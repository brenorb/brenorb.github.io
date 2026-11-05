#!/usr/bin/env node
// Renders a Mermaid diagram to a static SVG so pages don't need to load
// Mermaid (~1 MB of JavaScript) from a CDN.
//
//   npm install --no-save mermaid@11
//   node scripts/render_mermaid.js scripts/diagrams/granola-protocol-diagram.mmd \
//     assets/generated/granola-protocol-diagram.svg
//
// Uses Playwright's Chromium. Labels use Arial/Helvetica so the SVG renders
// the same when shown through an <img> tag.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const [input, output] = process.argv.slice(2);
  if (!input || !output) {
    console.error('usage: node scripts/render_mermaid.js <input.mmd> <output.svg>');
    process.exit(2);
  }
  const mermaidPath = require.resolve('mermaid/dist/mermaid.min.js', { paths: [process.cwd(), __dirname] });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent('<!doctype html><body></body>');
  await page.addScriptTag({ path: mermaidPath });
  const id = path.basename(output, '.svg');
  let svg = await page.evaluate(async ({ code, id }) => {
    window.mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'default',
      themeVariables: { fontFamily: 'Arial, Helvetica, sans-serif' },
    });
    return (await window.mermaid.render(id, code)).svg;
  }, { code: fs.readFileSync(input, 'utf8'), id });
  await browser.close();

  // Give the SVG an intrinsic size so it can be used directly in an <img>.
  const viewBox = svg.match(/viewBox="([-\d.]+) ([-\d.]+) ([\d.]+) ([\d.]+)"/);
  if (viewBox) {
    const width = Math.round(Number(viewBox[3]));
    const height = Math.round(Number(viewBox[4]));
    svg = svg.replace(/ width="100%"/, ` width="${width}" height="${height}"`).replace(/ style="max-width: [\d.]+px;"/, '');
    console.log(`${output}: ${width}x${height}`);
  }
  fs.writeFileSync(output, svg);
})();
