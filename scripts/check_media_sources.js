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
  return /^content_type:[ \t]*["']?media["']?[ \t]*$/m.test(frontMatter);
}

function postHasPodcastCategory(frontMatter) {
  return /^category:[ \t]*["']?podcast["']?[ \t]*$/m.test(frontMatter);
}

function postIsPodcast(filename, frontMatter) {
  const tags = frontMatter.match(/^tags:[^\n]*(?:\n[ \t]*-[^\n]*)*/m)?.[0] || "";
  return postHasPodcastCategory(frontMatter) || /\bpodcast\b/i.test(tags) ||
    /^\d{4}-\d{2}-\d{2}-podcast-/.test(filename) || /^title:[ \t]*["']?Podcast\b/im.test(frontMatter);
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

  const sourcePosts = [];
  const missingPodcastPlayer = [];
  const missingPodcastMetadata = [];
  const missingPodcastSource = [];
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

    const isPodcast = postIsPodcast(file, frontMatter);
    const hasPlayer = postHasEmbeddedMedia(body);
    const hasDeclaredMedia = postIsMedia(frontMatter) && /^(youtube_id|media_url):[ \t]*\S+/m.test(frontMatter);
    if (!hasPlayer && !hasDeclaredMedia && !isPodcast) {
      continue;
    }

    const slug = slugForPost(file, frontMatter);
    sourcePosts.push(slug);

    if (isPodcast && !hasPlayer) {
      missingPodcastPlayer.push(slug);
    }
    if (isPodcast && (!postIsMedia(frontMatter) || !postHasPodcastCategory(frontMatter))) {
      missingPodcastMetadata.push(slug);
    }
    if (isPodcast && !hasDeclaredMedia) {
      missingPodcastSource.push(slug);
    }

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
      if (count < 2 || count > 20) {
        invalidChapterCounts.push(`${slug} (${count})`);
      }
    }

    const generatedChapterPath = path.join(generatedChaptersDir, `${slug}-chapters.html`);
    if (!fs.existsSync(generatedChapterPath) || fs.readFileSync(generatedChapterPath, "utf8").trim().length === 0) {
      missingGeneratedChapterFile.push(slug);
    }
  }

  const problems = [];

  if (missingPodcastPlayer.length > 0) {
    problems.push(`Missing embedded player in podcast posts: ${missingPodcastPlayer.join(", ")}`);
  }
  if (missingPodcastMetadata.length > 0) {
    problems.push(`Podcast posts require content_type: media and category: podcast: ${missingPodcastMetadata.join(", ")}`);
  }
  if (missingPodcastSource.length > 0) {
    problems.push(`Missing youtube_id or media_url in podcast posts: ${missingPodcastSource.join(", ")}`);
  }
  if (missing.length > 0) {
    problems.push(`Missing media slugs in manifest: ${missing.join(", ")}`);
  }
  if (missingChapterInclude.length > 0) {
    problems.push(`Missing chapter include tag in media posts: ${missingChapterInclude.join(", ")}`);
  }
  if (missingChapterSpec.length > 0) {
    problems.push(`Missing chapter spec entries: ${missingChapterSpec.join(", ")}`);
  }
  if (invalidChapterCounts.length > 0) {
    problems.push(`Invalid chapter counts (must be between 2 and 20): ${invalidChapterCounts.join(", ")}`);
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

  console.log(`Post slugs covered by media manifest: ${sourcePosts.length}`);
  for (const slug of sourcePosts) {
    console.log(slug);
  }
}

main();
