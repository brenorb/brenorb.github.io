const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { test } = require("node:test");

function checkPost(t, { source = "youtube_id: leLfT93RSSA", body = "", complete = false, category = "podcast", tags = "", filename = "2026-11-24-episode.md" } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "media-format-test-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, "scripts"));
  fs.mkdirSync(path.join(root, "_posts"));
  fs.mkdirSync(path.join(root, "_includes", "generated"), { recursive: true });
  fs.copyFileSync(__dirname + "/check_media_sources.js", path.join(root, "scripts", "check_media_sources.js"));
  fs.writeFileSync(path.join(root, "_posts", filename),
    `---\ncontent_type: media\n${category ? `category: ${category}\n` : ""}${tags}\n${source}\n---\n${body}\n` +
    (complete ? "{% include generated/episode-chapters.html %}\n" : ""));
  fs.writeFileSync(path.join(root, "scripts", "media_sources.json"), JSON.stringify(
    complete ? { episode: { items: [{ id: "episode", source_url: "https://example.com/episode.mp3" }] } } : {}));
  fs.writeFileSync(path.join(root, "scripts", "topic_chapters.json"), JSON.stringify(
    complete ? { episode: { chapters: [{ start: 0, title: "Intro" }, { start: 60, title: "Discussion" }] } } : {}));
  if (complete) {
    fs.writeFileSync(path.join(root, "_includes", "generated", "episode-chapters.html"), "<section>Chapters</section>\n");
  }
  const result = spawnSync(process.execPath, [path.join(root, "scripts", "check_media_sources.js")], { encoding: "utf8" });
  assert.ifError(result.error);
  return result;
}

test("rejects the original cover-and-link podcast with declared media_url", (t) => {
  const result = checkPost(t, {
    source: "media_url: https://www.youtube.com/watch?v=leLfT93RSSA",
    body: "[![Episode cover](/cover.jpg)](https://www.youtube.com/watch?v=leLfT93RSSA)"
  });
  assert.equal(result.status, 1);
  for (const message of ["Missing embedded player", "Missing media slugs", "Missing chapter include", "Missing chapter spec", "Missing generated chapter files"]) {
    assert.ok(result.stderr.includes(message), result.stderr);
  }
});

test("rejects a link-only podcast even without declared source metadata", (t) => {
  const result = checkPost(t, { source: "", body: "[Listen](https://example.com/episode)" });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Missing embedded player in podcast posts: episode/);
  assert.match(result.stderr, /Missing media slugs in manifest: episode/);
});

test("requires a player even when source and chapter coverage exist", (t) => {
  const result = checkPost(t, { source: "youtube_id: leLfT93RSSA", complete: true });
  assert.equal(result.status, 1);
  assert.equal(result.stderr.trim(), "Missing embedded player in podcast posts: episode");
});

for (const player of ["iframe", "audio"]) {
  test(`accepts a complete podcast with an embedded ${player} player`, (t) => {
    const result = checkPost(t, { body: `<${player} src="https://example.com/episode"></${player}>`, complete: true });
    assert.equal(result.status, 0, result.stderr);
  });
}

test("does not require players on media articles without a recording", (t) => {
  const result = checkPost(t, { source: "", category: "news", body: "An article about Bitcoin." });
  assert.equal(result.status, 0, result.stderr);
});

for (const tags of ["tags: [bitcoin, podcast]", "tags:\n- bitcoin\n- podcast"]) {
  test(`detects podcasts by tags when category is missing: ${JSON.stringify(tags)}`, (t) => {
    const result = checkPost(t, { category: "", tags, body: "[Listen](https://example.com)" });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Missing embedded player/);
    assert.match(result.stderr, /require content_type: media and category: podcast/);
  });
}

test("detects uncategorized podcasts by filename", (t) => {
  const result = checkPost(t, { category: "", filename: "2026-11-24-podcast-episode.md", body: "[Listen](https://example.com)" });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Missing embedded player in podcast posts: podcast-episode/);
});

test("requires source metadata even when player and chapters exist", (t) => {
  const result = checkPost(t, { source: "", body: '<audio src="https://example.com/episode.mp3"></audio>', complete: true });
  assert.equal(result.status, 1);
  assert.equal(result.stderr.trim(), "Missing youtube_id or media_url in podcast posts: episode");
});
