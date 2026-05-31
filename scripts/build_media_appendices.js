const fs = require("fs");
const path = require("path");

const sourcesPath = path.join(__dirname, "media_sources.json");
const transcriptsDir = path.join(__dirname, "..", "transcripts", "raw");
const outputDir = path.join(__dirname, "..", "_data", "media_appendices");

function formatTimestamp(totalSeconds) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function publicUrlForItem(item) {
  return item.public_url || item.source_url;
}

function sourceLabelForUrl(url) {
  if (!url) {
    return "source";
  }
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return "YouTube";
  }
  if (url.includes("fountain.fm")) {
    return "Fountain";
  }
  if (url.includes(".mp3")) {
    return "audio";
  }
  if (url.includes(".mp4")) {
    return "video";
  }
  return "source";
}

function buildTimestampUrl(item, seconds) {
  const url = publicUrlForItem(item);
  if (!url) {
    return null;
  }
  if (item.timestamp_style === "query-at") {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}at=${seconds}`;
  }
  if (item.timestamp_style === "fragment-t") {
    return `${url}#t=${seconds}`;
  }
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}t=${seconds}`;
}

function normalizeSegments(payload) {
  if (Array.isArray(payload.segments) && payload.segments.length > 0) {
    return payload.segments;
  }
  if (Array.isArray(payload.chunks) && payload.chunks.length > 0) {
    return payload.chunks;
  }
  return [];
}

function transcriptPathForItem(item) {
  return path.join(transcriptsDir, `${item.id}.json`);
}

function normalizeSpeakerLabel(value) {
  if (!value) {
    return null;
  }

  const raw = String(value).trim();
  const match = raw.match(/(?:speaker[_\s-]*)?s?0*(\d+)/i);
  if (!match) {
    return raw.toUpperCase();
  }

  return `SPEAKER_${String(Number(match[1])).padStart(2, "0")}`;
}

function speakerCount(segments) {
  return new Set(
    segments
      .map((segment) => normalizeSpeakerLabel(segment.speaker))
      .filter((speaker) => typeof speaker === "string" && speaker.length > 0)
  ).size;
}

function loadItem(slug, item, itemCount) {
  const transcriptPath = transcriptPathForItem(item);
  if (!fs.existsSync(transcriptPath)) {
    return null;
  }

  const payload = JSON.parse(fs.readFileSync(transcriptPath, "utf8"));
  const segments = normalizeSegments(payload).filter((segment) => {
    return typeof segment.text === "string" && segment.text.trim().length > 0;
  });

  if (segments.length === 0) {
    return null;
  }

  return {
    id: item.id,
    slug,
    label: item.label || (itemCount > 1 ? item.id : "Transcricao diarizada"),
    source_label: sourceLabelForUrl(publicUrlForItem(item)),
    source_url: publicUrlForItem(item),
    stats: {
      line_count: segments.length,
      speaker_count: speakerCount(segments)
    },
    lines: segments.map((segment) => {
      const start = Math.max(0, Math.floor(Number(segment.start_s) || 0));
      return {
        timestamp: formatTimestamp(start),
        href: buildTimestampUrl(item, start),
        speaker: normalizeSpeakerLabel(segment.speaker),
        text: segment.text.trim()
      };
    })
  };
}

function resetOutputDir() {
  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(outputDir, { recursive: true });
}

function main() {
  const sources = JSON.parse(fs.readFileSync(sourcesPath, "utf8"));
  resetOutputDir();

  for (const [slug, spec] of Object.entries(sources)) {
    const items = (spec.items || [])
      .map((item) => loadItem(slug, item, spec.items.length))
      .filter(Boolean);

    if (items.length === 0) {
      continue;
    }

    fs.writeFileSync(
      path.join(outputDir, `${slug}.json`),
      `${JSON.stringify({ items }, null, 2)}\n`,
      "utf8"
    );
  }
}

main();
