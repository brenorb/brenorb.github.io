const fs = require("fs");
const path = require("path");

const repoRoot = path.join(__dirname, "..");
const postsDir = path.join(repoRoot, "_posts");
const manifestPath = path.join(__dirname, "media_sources.json");

function extractFrontMatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  return match ? match[1] : "";
}

function slugForPost(filename, frontMatter) {
  const frontMatterSlug = frontMatter.match(/^slug:\s*(.+)$/m);
  if (frontMatterSlug) {
    return frontMatterSlug[1].trim();
  }

  return filename
    .replace(/^\d{4}-\d{2}-\d{2}-/, "")
    .replace(/\.md$/, "");
}

function bodyForPost(text) {
  const match = text.match(/^---\n[\s\S]*?\n---\n?([\s\S]*)$/);
  return match ? match[1] : text;
}

function postHasEmbeddedMedia(body) {
  return /<(iframe|video|audio)\b/i.test(body);
}

function main() {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const manifestSlugs = new Set(Object.keys(manifest));
  const files = fs
    .readdirSync(postsDir)
    .filter((file) => file.endsWith(".md"))
    .sort();

  const embeddedPosts = [];
  const missing = [];

  for (const file of files) {
    const postPath = path.join(postsDir, file);
    const contents = fs.readFileSync(postPath, "utf8");
    const frontMatter = extractFrontMatter(contents);
    const body = bodyForPost(contents);

    if (!postHasEmbeddedMedia(body)) {
      continue;
    }

    const slug = slugForPost(file, frontMatter);
    embeddedPosts.push(slug);

    if (!manifestSlugs.has(slug)) {
      missing.push(slug);
    }
  }

  if (missing.length > 0) {
    console.error(`Missing embedded-media slugs in manifest: ${missing.join(", ")}`);
    process.exit(1);
  }

  console.log(`Embedded post slugs covered: ${embeddedPosts.length}`);
  for (const slug of embeddedPosts) {
    console.log(slug);
  }
}

main();
