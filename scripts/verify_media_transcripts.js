const fs = require("fs");
const path = require("path");

const repoRoot = path.join(__dirname, "..");
const manifestPath = path.join(__dirname, "media_sources.json");
const appendixDir = path.join(repoRoot, "_data", "media_appendices");
const rawDir = path.join(repoRoot, "transcripts", "raw");
const scriptsDir = path.join(repoRoot, "transcripts");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function hasNonEmptyFile(filePath) {
  return fs.existsSync(filePath) && fs.readFileSync(filePath, "utf8").trim().length > 0;
}

function main() {
  const manifest = readJson(manifestPath);
  const problems = [];
  let itemCount = 0;

  for (const [slug, spec] of Object.entries(manifest)) {
    const appendixPath = path.join(appendixDir, `${slug}.json`);
    if (!fs.existsSync(appendixPath)) {
      problems.push(`missing appendix file for ${slug}`);
      continue;
    }

    const appendix = readJson(appendixPath);
    const appendixItems = new Map((appendix.items || []).map((item) => [item.id, item]));

    for (const item of spec.items || []) {
      itemCount += 1;

      const rawPath = path.join(rawDir, `${item.id}.json`);
      const scriptPath = path.join(scriptsDir, `${item.id}.script.txt`);
      const appendixItem = appendixItems.get(item.id);

      if (!fs.existsSync(rawPath)) {
        problems.push(`missing raw transcript for ${slug}/${item.id}`);
      }
      if (!hasNonEmptyFile(scriptPath)) {
        problems.push(`missing script transcript for ${slug}/${item.id}`);
      }
      if (!appendixItem) {
        problems.push(`missing appendix item for ${slug}/${item.id}`);
        continue;
      }
      if (!Array.isArray(appendixItem.lines) || appendixItem.lines.length === 0) {
        problems.push(`empty appendix lines for ${slug}/${item.id}`);
      }
      for (const line of appendixItem.lines || []) {
        if (!line.timestamp) {
          problems.push(`missing timestamp text for ${slug}/${item.id}`);
          break;
        }
        if (!line.href) {
          problems.push(`missing timestamp href for ${slug}/${item.id}`);
          break;
        }
      }
    }
  }

  if (problems.length > 0) {
    for (const problem of problems) {
      console.error(problem);
    }
    process.exit(1);
  }

  console.log(`Verified transcript coverage for ${itemCount} manifest items.`);
}

main();
