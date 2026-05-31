const fs = require("fs");
const path = require("path");

const chaptersPath = path.join(__dirname, "topic_chapters.json");
const outputDir = path.join(__dirname, "..", "_includes", "generated");
const transcriptsDir = path.join(__dirname, "..", "tmp", "transcripts60");

function formatTime(totalSeconds) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildTimestampUrl(url, seconds, timestampStyle) {
  const separator = url.includes("?") ? "&" : "?";

  if (timestampStyle === "query-at") {
    return `${url}${separator}at=${seconds}`;
  }

  return `${url}${separator}t=${seconds}`;
}

function loadChunkStarts(slug) {
  const transcriptPath = path.join(transcriptsDir, `${slug}.json`);

  if (!fs.existsSync(transcriptPath)) {
    return [];
  }

  const transcript = JSON.parse(fs.readFileSync(transcriptPath, "utf8"));
  return (transcript.chunks || [])
    .map((chunk) => Number(chunk.start_s))
    .filter((start) => Number.isFinite(start))
    .sort((a, b) => a - b);
}

function snapToChunkStart(start, chunkStarts) {
  if (chunkStarts.length === 0 || start <= 0) {
    return Math.max(0, start);
  }

  let snapped = 0;

  for (const chunkStart of chunkStarts) {
    if (chunkStart > start) {
      break;
    }

    snapped = chunkStart;
  }

  return snapped;
}

const specs = JSON.parse(fs.readFileSync(chaptersPath, "utf8"));

for (const slug of Object.keys(specs).sort()) {
  const spec = specs[slug];
  const chunkStarts = loadChunkStarts(slug);
  const lines = [
    '<section class="media-chapters">',
    "  <h3 class=\"media-chapters__title\">Capítulos por assunto</h3>",
    "  <ul class=\"media-chapters__list\">"
  ];

  for (const chapter of spec.chapters) {
    const start = snapToChunkStart(chapter.start, chunkStarts);
    const url = buildTimestampUrl(spec.url, start, spec.timestamp_style);
    lines.push(
      `    <li><a class="media-chapters__stamp" href="#media-player" data-external-url="${url}" data-start-seconds="${start}">${formatTime(start)}</a> <span class="media-chapters__topic">${escapeHtml(chapter.title)}</span></li>`
    );
  }

  lines.push("  </ul>", "</section>", "");

  fs.writeFileSync(
    path.join(outputDir, `${slug}-chapters.html`),
    lines.join("\n"),
    "utf8"
  );
}
