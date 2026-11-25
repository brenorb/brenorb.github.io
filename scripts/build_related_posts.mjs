import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cachePath = path.join(root, "scripts/data/related_embeddings.json");
const outputPath = path.join(root, "_data/related_posts.json");

export const CONFIG = Object.freeze({
  schema: 1,
  model: "Xenova/multilingual-e5-small",
  revision: "761b726dd34fb83930e26aab4e9ac3899aa1fa78",
  runtime: "@huggingface/transformers@3.8.1",
  dtype: "q8",
  dimensions: 384,
  prefix: "query: ",
  chunk_tokens: 384,
  overlap_tokens: 48,
  pooling: "mean",
  document_pooling: "equal-weight-summary-and-content",
  metric: "cosine-distance",
  limit: 3
});

export function hash(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

export function readCorpus() {
  const posts = JSON.parse(execFileSync("ruby", [path.join(root, "scripts/export_related_posts.rb")], { encoding: "utf8" }));
  if (new Set(posts.map((post) => post.url)).size !== posts.length) {
    throw new Error("Duplicate canonical URLs in related-post corpus");
  }
  return posts;
}

export function normalize(vector) {
  if (!Array.isArray(vector) || !vector.length || vector.some((value) => !Number.isFinite(value))) {
    throw new Error("Embedding must contain finite numbers");
  }
  const length = Math.hypot(...vector);
  if (!length) throw new Error("Zero-length embedding");
  return vector.map((value) => value / length);
}

export function cosineDistance(left, right) {
  if (left.length !== right.length) throw new Error("Embedding dimensions differ");
  const a = normalize(left);
  const b = normalize(right);
  const similarity = a.reduce((sum, value, index) => sum + value * b[index], 0);
  return Math.max(0, Math.min(2, 1 - similarity));
}

export function rankRelated(source, posts, entries, limit = CONFIG.limit) {
  return posts.filter((post) => post.url !== source.url).map((post) => ({
    url: post.url,
    title: post.title,
    distance: Number(cosineDistance(entries[source.url].embedding, entries[post.url].embedding).toFixed(6))
  })).sort((a, b) => a.distance - b.distance || (a.url < b.url ? -1 : a.url > b.url ? 1 : 0)).slice(0, limit);
}

export function buildIndex(posts, entries) {
  return {
    metadata: { ...CONFIG, corpus_hash: hash(posts) },
    pages: Object.fromEntries(posts.map((post) => [post.url, rankRelated(post, posts, entries)]))
  };
}

export function isCurrent(entry, post) {
  return entry?.content_hash === hash(post) && Array.isArray(entry.embedding) &&
    entry.embedding.length === CONFIG.dimensions && entry.embedding.every(Number.isFinite) &&
    Math.abs(Math.hypot(...entry.embedding) - 1) < 0.001;
}

// Token windows cover the entire prose, including the end of long articles.
// Reserve space for the E5 prefix and special tokens; never silently truncate a page.
export function chunkText(tokenizer, text) {
  const tokens = tokenizer.encode(text, { add_special_tokens: false });
  const chunks = [];
  const step = CONFIG.chunk_tokens - CONFIG.overlap_tokens;
  for (let start = 0; start < tokens.length; start += step) {
    chunks.push(CONFIG.prefix + tokenizer.decode(tokens.slice(start, start + CONFIG.chunk_tokens), { skip_special_tokens: true }));
    if (start + CONFIG.chunk_tokens >= tokens.length) break;
  }
  return chunks.length ? chunks : [CONFIG.prefix];
}

async function loadExtractor() {
  let transformers;
  try {
    transformers = await import("@huggingface/transformers");
  } catch (error) {
    throw new Error("Install embedding dependencies with npm ci before regenerating related posts", { cause: error });
  }
  transformers.env.cacheDir = path.join(root, ".cache/related-posts/models");
  return transformers.pipeline("feature-extraction", CONFIG.model, {
    revision: CONFIG.revision,
    dtype: CONFIG.dtype,
    device: "cpu",
    session_options: { intraOpNumThreads: 2 }
  });
}

async function embedPost(extractor, post) {
  const chunks = chunkText(extractor.tokenizer, post.text);
  const sum = new Array(CONFIG.dimensions).fill(0);
  for (const chunk of chunks) {
    const result = await extractor(chunk, { pooling: CONFIG.pooling, normalize: true });
    Array.from(result.data).forEach((value, index) => { sum[index] += value; });
  }
  const summaryChunks = chunkText(extractor.tokenizer, post.summary);
  const summarySum = new Array(CONFIG.dimensions).fill(0);
  for (const chunk of summaryChunks) {
    const result = await extractor(chunk, { pooling: CONFIG.pooling, normalize: true });
    Array.from(result.data).forEach((value, index) => { summarySum[index] += value; });
  }
  const bodyVector = normalize(sum);
  const summaryVector = normalize(summarySum);
  return {
    content_hash: hash(post),
    chunks: chunks.length,
    embedding: normalize(bodyVector.map((value, index) => value + summaryVector[index])).map((value) => Number(value.toFixed(8)))
  };
}

function readJsonOrNull(file) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : null;
}

export async function main(checkOnly = false) {
  const posts = readCorpus();
  const cache = readJsonOrNull(cachePath);
  const sameModel = JSON.stringify(cache?.metadata) === JSON.stringify(CONFIG);
  const entries = {};
  let extractor;
  let regenerated = 0;
  try {
    for (const post of posts) {
      const cached = sameModel && cache.documents[post.url];
      if (isCurrent(cached, post)) {
        entries[post.url] = cached;
      } else {
        if (checkOnly) throw new Error(`Missing or stale embedding for ${post.url}. Run npm ci && npm run build:related`);
        extractor ||= await loadExtractor();
        console.log(`Embedding ${post.url}`);
        entries[post.url] = await embedPost(extractor, post);
        regenerated += 1;
      }
    }
  } finally {
    await extractor?.dispose();
  }
  const index = buildIndex(posts, entries);
  if (checkOnly) {
    if (JSON.stringify(readJsonOrNull(outputPath)) !== JSON.stringify(index)) {
      throw new Error("Related-page rankings are stale. Run npm run build:related");
    }
    if (JSON.stringify(Object.keys(cache.documents)) !== JSON.stringify(posts.map((post) => post.url))) {
      throw new Error("Embedding cache contains deleted or unordered pages. Run npm run build:related");
    }
    console.log(`Verified semantic recommendations for ${posts.length} pages (no model download required).`);
  } else {
    fs.mkdirSync(path.dirname(cachePath), { recursive: true });
    // Keep each vector on one line so changes to one page have a readable diff.
    fs.writeFileSync(cachePath, `{
  "metadata": ${JSON.stringify(CONFIG)},
  "documents": {
${Object.entries(entries).map(([url, entry]) => `    ${JSON.stringify(url)}: ${JSON.stringify(entry)}`).join(",\n")}
  }
}\n`);
    fs.writeFileSync(outputPath, `${JSON.stringify(index, null, 2)}\n`);
    console.log(`Related pages: ${posts.length} indexed, ${regenerated} embeddings regenerated.`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.some((arg) => arg !== "--check")) {
    console.error("Usage: node scripts/build_related_posts.mjs [--check]");
    process.exitCode = 1;
  } else {
    main(args.includes("--check")).catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
  }
}
