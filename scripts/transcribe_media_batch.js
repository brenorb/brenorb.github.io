const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const repoRoot = path.join(__dirname, "..");
const sourcesPath = path.join(__dirname, "media_sources.json");
const transcriptsDir = path.join(repoRoot, "transcripts", "raw");
const scriptsDir = path.join(repoRoot, "transcripts");
const sourceCacheDir = path.join(repoRoot, "transcripts", "source_cache");
const fscriptBinary = process.env.FSCRIPT_BIN || "/Users/breno/Documents/code/PROJECTS/fast-transcript-frozen/target/release/fscript";
const diarizationBinary = process.env.FSCRIPT_DIARIZATION_BINARY || "/Users/breno/Documents/code/PROJECTS/FluidAudio/.build/arm64-apple-macosx/release/fluidaudiocli";
const ytDlpBrowser = process.env.YT_DLP_COOKIES_BROWSER || "chrome";
const baseArgs = ["--prefer-local-for-remote", "-d"];

function shouldRunForSlug(targetSlug, slug) {
  return !targetSlug || targetSlug === slug;
}

function transcriptPathForItem(item) {
  return path.join(transcriptsDir, `${item.id}.json`);
}

function scriptPathForItem(item) {
  return path.join(scriptsDir, `${item.id}.script.txt`);
}

function isRemoteSource(source) {
  return /^https?:\/\//i.test(source);
}

function cachedSourcePathForItem(item) {
  if (!fs.existsSync(sourceCacheDir)) {
    return null;
  }

  const prefix = `${item.id}.`;
  const match = fs
    .readdirSync(sourceCacheDir)
    .find((entry) => entry === item.id || entry.startsWith(prefix));

  if (!match) {
    return null;
  }

  const filePath = path.join(sourceCacheDir, match);
  try {
    return fs.statSync(filePath).size > 0 ? filePath : null;
  } catch (_error) {
    return null;
  }
}

function directMediaExtension(sourceUrl) {
  const pathname = new URL(sourceUrl).pathname.toLowerCase();
  const match = pathname.match(/\.(mp3|mp4|m4a|wav|webm|ogg)$/);
  return match ? `.${match[1]}` : "";
}

function ensureLocalSourcePath(item) {
  if (!isRemoteSource(item.source_url)) {
    return item.source_url;
  }

  const cachedPath = cachedSourcePathForItem(item);
  if (cachedPath) {
    return cachedPath;
  }

  fs.mkdirSync(sourceCacheDir, { recursive: true });

  const extension = directMediaExtension(item.source_url);
  if (extension) {
    const outputPath = path.join(sourceCacheDir, `${item.id}${extension}`);
    const result = spawnSync(
      "curl",
      ["-L", "--fail", "--output", outputPath, item.source_url],
      {
        cwd: repoRoot,
        encoding: "utf8",
        stdio: "inherit"
      }
    );

    if (result.status !== 0) {
      throw new Error(`direct media download failed for ${item.id}`);
    }

    return outputPath;
  }

  const outputTemplate = path.join(sourceCacheDir, `${item.id}.%(ext)s`);
  const result = spawnSync(
    "yt-dlp",
    [
      "--no-progress",
      "--no-warnings",
      "--no-playlist",
      "--cookies-from-browser",
      ytDlpBrowser,
      "-f",
      "bestaudio/best",
      "--output",
      outputTemplate,
      "--print",
      "after_move:filepath",
      item.source_url
    ],
    {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["inherit", "pipe", "inherit"]
    }
  );

  if (result.status !== 0) {
    throw new Error(`yt-dlp cache download failed for ${item.id}`);
  }

  const downloadedPath = result.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .at(-1);

  if (!downloadedPath) {
    throw new Error(`yt-dlp did not report cached file path for ${item.id}`);
  }

  return downloadedPath;
}

function hasUsableJsonTranscript(filePath) {
  if (!fs.existsSync(filePath)) {
    return false;
  }

  try {
    const payload = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return (
      (Array.isArray(payload.segments) && payload.segments.length > 0) ||
      (Array.isArray(payload.chunks) && payload.chunks.length > 0)
    );
  } catch (_error) {
    return false;
  }
}

function hasUsableScriptTranscript(filePath) {
  if (!fs.existsSync(filePath)) {
    return false;
  }

  try {
    return fs.readFileSync(filePath, "utf8").trim().length > 0;
  } catch (_error) {
    return false;
  }
}

function transcribeItem(slug, item) {
  const outputPath = transcriptPathForItem(item);
  const scriptPath = scriptPathForItem(item);
  const sourceInput = ensureLocalSourcePath(item);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.mkdirSync(path.dirname(scriptPath), { recursive: true });

  if (!hasUsableJsonTranscript(outputPath)) {
    console.error(`start json ${slug}/${item.id}`);

    const result = spawnSync(
      "nice",
      [
        "-n",
        "10",
        fscriptBinary,
        sourceInput,
        outputPath,
        ...baseArgs
      ],
      {
        cwd: repoRoot,
        env: {
          ...process.env,
          FSCRIPT_DIARIZATION_BINARY: diarizationBinary
        },
        encoding: "utf8",
        stdio: "inherit"
      }
    );

    if (result.status !== 0) {
      throw new Error(`json transcription failed for ${slug}/${item.id}`);
    }
  } else {
    console.error(`skip json ${slug}/${item.id} (already exists)`);
  }

  if (!hasUsableScriptTranscript(scriptPath)) {
    console.error(`start script ${slug}/${item.id}`);

    const result = spawnSync(
      "nice",
      [
        "-n",
        "10",
        fscriptBinary,
        sourceInput,
        scriptPath,
        ...baseArgs,
        "--script",
        "timestamps"
      ],
      {
        cwd: repoRoot,
        env: {
          ...process.env,
          FSCRIPT_DIARIZATION_BINARY: diarizationBinary
        },
        encoding: "utf8",
        stdio: "inherit"
      }
    );

    if (result.status !== 0) {
      throw new Error(`script transcription failed for ${slug}/${item.id}`);
    }
  } else {
    console.error(`skip script ${slug}/${item.id} (already exists)`);
  }

  console.error(`done ${slug}/${item.id}`);
}

function main() {
  const targetSlug = process.argv[2] || "";
  const sources = JSON.parse(fs.readFileSync(sourcesPath, "utf8"));

  for (const [slug, spec] of Object.entries(sources)) {
    if (!shouldRunForSlug(targetSlug, slug)) {
      continue;
    }

    for (const item of spec.items || []) {
      transcribeItem(slug, item);
    }
  }
}

main();
