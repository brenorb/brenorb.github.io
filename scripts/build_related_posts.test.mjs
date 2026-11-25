import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { test } from "node:test";
import { CONFIG, cosineDistance, hash, isCurrent, chunkText, rankRelated, main } from "./build_related_posts.mjs";

test("cosine distance measures direction rather than vector magnitude", () => {
  assert.equal(cosineDistance([1, 0], [5, 0]), 0);
  assert.equal(cosineDistance([1, 0], [0, 1]), 1);
  assert.equal(cosineDistance([1, 0], [-1, 0]), 2);
  assert.throws(() => cosineDistance([0, 0], [1, 0]), /Zero-length/);
  assert.throws(() => cosineDistance([1, NaN], [1, 0]), /finite/);
  assert.throws(() => cosineDistance([1], [1, 0]), /dimensions/);
});

test("ranking chooses nearest meaning without shared tags, dates or self-links", () => {
  const source = { url: "/source/", title: "Bitcoin and AI", tags: ["bitcoin"] };
  const sameTag = { url: "/unrelated/", title: "Mining stocks", tags: ["bitcoin"], date: "2026-11-25" };
  const semantic = { url: "/semantic/", title: "IA e trabalho", tags: ["labor"], date: "2020-01-01" };
  const entries = {
    "/source/": { embedding: [1, 0] },
    "/semantic/": { embedding: [0.99, 0.01] },
    "/unrelated/": { embedding: [0, 1] }
  };
  const results = rankRelated(source, [source, sameTag, semantic], entries);
  assert.deepEqual(results.map((item) => item.url), ["/semantic/", "/unrelated/"]);
  assert.ok(results[0].distance < results[1].distance);
});

test("ties use canonical URL order and recommendations are capped at three", () => {
  const posts = ["source", "d", "c", "b", "a"].map((name) => ({ url: `/${name}/`, title: name }));
  const entries = Object.fromEntries(posts.map((post) => [post.url, { embedding: [1, 0] }]));
  assert.deepEqual(rankRelated(posts[0], posts, entries).map((item) => item.url), ["/a/", "/b/", "/c/"]);
});

test("source edits invalidate embeddings and malformed vectors are rejected", () => {
  const post = { url: "/page/", title: "Original", summary: "Summary", text: "Body" };
  const embedding = [1, ...new Array(CONFIG.dimensions - 1).fill(0)];
  const cached = { content_hash: hash(post), embedding };
  assert.ok(isCurrent(cached, post));
  for (const field of ["title", "summary", "text", "url"]) {
    assert.ok(!isCurrent(cached, { ...post, [field]: "Changed" }));
  }
  assert.ok(!isCurrent({ ...cached, embedding: [1] }, post));
  assert.ok(!isCurrent({ ...cached, embedding: new Array(CONFIG.dimensions).fill(0) }, post));
  assert.ok(!isCurrent({ ...cached, embedding: [NaN, ...embedding.slice(1)] }, post));
});

test("token windows include the end of long pages and the E5 similarity prefix", () => {
  const tokenizer = { encode: (text) => text.split(" "), decode: (tokens) => tokens.join(" ") };
  const words = Array.from({ length: 1400 }, (_, i) => `word${i}`);
  const chunks = chunkText(tokenizer, words.join(" "));
  assert.ok(chunks.length > 1);
  assert.ok(chunks.every((chunk) => chunk.startsWith("query: ")));
  const tokenLists = chunks.map((chunk) => chunk.slice(CONFIG.prefix.length).split(" "));
  assert.ok(tokenLists.every((tokens) => tokens.length <= CONFIG.chunk_tokens));
  assert.deepEqual(tokenLists[0].slice(-CONFIG.overlap_tokens), tokenLists[1].slice(0, CONFIG.overlap_tokens));
  assert.deepEqual([...new Set(tokenLists.flat())], words);
});

test("corpus excludes nonpublic pages and strips players, URLs and Liquid boilerplate", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "related-corpus-test-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, "scripts"));
  fs.mkdirSync(path.join(root, "_posts"));
  fs.copyFileSync(new URL("./export_related_posts.rb", import.meta.url), path.join(root, "scripts/export_related_posts.rb"));
  fs.writeFileSync(path.join(root, "scripts/topic_chapters.json"), "{}");
  for (const [name, flags] of Object.entries({ public: "", draft: "published: false", hidden: "sitemap: false", noindex: "noindex: true" })) {
    fs.writeFileSync(path.join(root, "_posts", `2020-01-01-${name}.md`),
      `---\ntitle: Example\npermalink: /${name}/\ndescription: Topic summary\n${flags}\n---\n` +
      '<iframe src="https://youtube.com/embed/test">Player fallback</iframe>\n' +
      '{% include generated/chapters.html %}\n[Readable body](https://example.com)\nLate paragraph.');
  }
  const posts = JSON.parse(execFileSync("ruby", [path.join(root, "scripts/export_related_posts.rb")], { encoding: "utf8" }));
  assert.equal(posts.length, 1);
  assert.equal(posts[0].url, "/public/");
  assert.equal(posts[0].text, "Readable body Late paragraph.");
  assert.match(posts[0].summary, /Example.*Topic summary/);
});

test("committed vectors and rankings match every current public page without model inference", async () => {
  await main(true);
});

test("real embeddings put the IA discussion closer than the former tag-only suggestions", () => {
  const { documents } = JSON.parse(fs.readFileSync(new URL("./data/related_embeddings.json", import.meta.url)));
  const tapa = documents["/media/podcast-tapa-da-mao-invisivel-431/"].embedding;
  const discussion = documents["/media/podcast-explica-bitcoin-ia-fim-da-historia-humana/"].embedding;
  const oldTagSuggestion = documents["/projects/btc-implicit-distribution/"].embedding;
  assert.ok(cosineDistance(tapa, discussion) < cosineDistance(tapa, oldTagSuggestion));
});
