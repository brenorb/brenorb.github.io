const fs = require("fs");
const path = require("path");

const repoRoot = path.join(__dirname, "..");
const postsDir = path.join(repoRoot, "_posts");
const manifestPath = path.join(__dirname, "media_sources.json");
const chapterSpecsPath = path.join(__dirname, "topic_chapters.json");
const generatedChaptersDir = path.join(repoRoot, "_includes", "generated");

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

function postIsMedia(frontMatter) {
  return /^content_type:\s*media\s*$/m.test(frontMatter);
}

function postHasEmbeddedMedia(body) {
  return /<(iframe|video|audio)\b/i.test(body);
}

function main() {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const chapterSpecs = JSON.parse(fs.readFileSync(chapterSpecsPath, "utf8"));
  const manifestSlugs = new Set(Object.keys(manifest));
  const files = fs
    .readdirSync(postsDir)
    .filter((file) => file.endsWith(".md"))
    .sort();

  const embeddedPosts = [];
  const missing = [];
  const missingChapterInclude = [];
  const missingChapterSpec = [];
  const invalidChapterCounts = [];
  const missingGeneratedChapterFile = [];

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

    if (!postIsMedia(frontMatter)) {
      continue;
    }

    const includeTag = `{% include generated/${slug}-chapters.html %}`;
    if (!body.includes(includeTag)) {
      missingChapterInclude.push(slug);
    }

    const chapterSpec = chapterSpecs[slug];
    if (!chapterSpec || !Array.isArray(chapterSpec.chapters)) {
      missingChapterSpec.push(slug);
    } else {
      const count = chapterSpec.chapters.length;
      if (count < 1 || count > 20) {
        invalidChapterCounts.push(`${slug} (${count})`);
      }
    }

    const generatedChapterPath = path.join(generatedChaptersDir, `${slug}-chapters.html`);
    if (!fs.existsSync(generatedChapterPath) || fs.readFileSync(generatedChapterPath, "utf8").trim().length === 0) {
      missingGeneratedChapterFile.push(slug);
    }
  }

  const problems = [];

  if (missing.length > 0) {
    problems.push(`Missing embedded-media slugs in manifest: ${missing.join(", ")}`);
  }
  if (missingChapterInclude.length > 0) {
    problems.push(`Missing chapter include tag in media posts: ${missingChapterInclude.join(", ")}`);
  }
  if (missingChapterSpec.length > 0) {
    problems.push(`Missing chapter spec entries: ${missingChapterSpec.join(", ")}`);
  }
  if (invalidChapterCounts.length > 0) {
    problems.push(`Invalid chapter counts (must be between 1 and 20): ${invalidChapterCounts.join(", ")}`);
  }
  if (missingGeneratedChapterFile.length > 0) {
    problems.push(`Missing generated chapter files: ${missingGeneratedChapterFile.join(", ")}`);
  }

  if (problems.length > 0) {
    for (const problem of problems) {
      console.error(problem);
    }
    process.exit(1);
  }

  console.log(`Embedded post slugs covered: ${embeddedPosts.length}`);
  for (const slug of embeddedPosts) {
    console.log(slug);
  }
}

main();
