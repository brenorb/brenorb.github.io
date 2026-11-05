#!/usr/bin/env node
// Measures page-load time for every HTML page in a built Jekyll site.
//
// Test conditions (kept identical between runs so results are comparable):
// - Serves `_site/` from a local HTTP server with GitHub Pages-style URLs
//   (`/foo/` -> `/foo/index.html`) and gzip, like GitHub Pages.
// - Requests to the production origin (https://brenorb.com) are served from
//   the same local `_site/`.
// - Every other (third-party) request is answered by a local stub after a
//   fixed delay (THIRD_PARTY_DELAY_MS, default 100 ms), so pages are not
//   timed against the live internet, but anything on the critical path to a
//   third party still costs time.
// - Headless Chromium, 1366x768 viewport, no CPU or network throttling.
// - Every run uses a fresh browser context, so the cache is always cold.
// - Redirect stubs are measured as their own page; the follow-up navigation
//   is not loaded.
// - Metric: PerformanceNavigationTiming.loadEventEnd (time from navigation
//   start until the load event finished). Each page is loaded RUNS times
//   (default 5) and the median is reported.
//
// Usage:
//   node scripts/measure_page_load.js [--site _site] [--runs 5]
//        [--budget 50] [--json out.json] [--only substring]

const fs = require('fs');
const http = require('http');
const path = require('path');
const zlib = require('zlib');
const { chromium } = require('playwright');

const args = process.argv.slice(2);
function arg(name, fallback) {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
}

const SITE = path.resolve(arg('site', path.join(__dirname, '..', '_site')));
const RUNS = Number(arg('runs', 5));
const BUDGET = Number(arg('budget', 50));
const JSON_OUT = arg('json', null);
const ONLY = arg('only', null);
const THIRD_PARTY_DELAY_MS = Number(process.env.THIRD_PARTY_DELAY_MS || 100);
const PROD_ORIGIN = 'https://brenorb.com';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',
  '.pdf': 'application/pdf',
};
const COMPRESSIBLE = new Set(['.html', '.css', '.js', '.mjs', '.json', '.xml', '.txt', '.md', '.svg', '.ico', '.ttf', '.otf', '.eot']);

function resolveFile(urlPath) {
  let p = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  let file = path.join(SITE, p);
  if (!file.startsWith(SITE)) return null;
  try {
    const st = fs.statSync(file);
    if (st.isDirectory()) file = path.join(file, 'index.html');
  } catch (_) {
    if (fs.existsSync(`${file}.html`)) file = `${file}.html`;
  }
  return fs.existsSync(file) && fs.statSync(file).isFile() ? file : null;
}

const cache = new Map();
function load(file) {
  if (!cache.has(file)) {
    const body = fs.readFileSync(file);
    const ext = path.extname(file).toLowerCase();
    const gz = COMPRESSIBLE.has(ext) ? zlib.gzipSync(body, { level: 6 }) : null;
    cache.set(file, { body, gz, type: MIME[ext] || 'application/octet-stream' });
  }
  return cache.get(file);
}

function startServer() {
  const server = http.createServer((req, res) => {
    const file = resolveFile(req.url);
    const status = file ? 200 : 404;
    const entry = load(file || path.join(SITE, '404.html'));
    const gzip = entry.gz && /\bgzip\b/.test(req.headers['accept-encoding'] || '');
    res.writeHead(status, {
      'Content-Type': entry.type,
      'Cache-Control': 'max-age=600',
      ...(gzip ? { 'Content-Encoding': 'gzip' } : {}),
    });
    res.end(gzip ? entry.gz : entry.body);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

function listPages() {
  const out = [];
  (function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      const st = fs.statSync(full);
      if (st.isDirectory()) walk(full);
      else if (name.endsWith('.html')) {
        let rel = `/${path.relative(SITE, full).split(path.sep).join('/')}`;
        rel = rel.replace(/index\.html$/, '');
        out.push(rel);
      }
    }
  })(SITE);
  return out.sort();
}

const STUB_GIF = Buffer.from('R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==', 'base64');
function stubFor(request) {
  const type = request.resourceType();
  if (type === 'image') return { contentType: 'image/gif', body: STUB_GIF };
  if (type === 'script') return { contentType: 'application/javascript', body: '' };
  if (type === 'stylesheet') return { contentType: 'text/css', body: '' };
  if (type === 'document') return { contentType: 'text/html', body: '<!doctype html><title>stub</title>' };
  return { contentType: 'text/plain', body: '' };
}

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

async function measure(browser, base, pagePath) {
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await context.newPage();
  const counts = { firstParty: 0, thirdParty: 0, bytes: 0 };
  let mainDocSeen = false;
  await page.route('**/*', async (route) => {
    const request = route.request();
    const url = request.url();
    if (request.isNavigationRequest() && request.frame() === page.mainFrame()) {
      if (mainDocSeen) return route.abort(); // do not follow redirect stubs
      mainDocSeen = true;
    }
    if (url.startsWith(base)) {
      counts.firstParty += 1;
      return route.continue();
    }
    if (url.startsWith(PROD_ORIGIN)) {
      counts.firstParty += 1;
      const file = resolveFile(new URL(url).pathname);
      if (!file) return route.fulfill({ status: 404, body: '' });
      const entry = load(file);
      return route.fulfill({ status: 200, contentType: entry.type, body: entry.body });
    }
    if (url.startsWith('data:') || url.startsWith('blob:')) return route.continue();
    counts.thirdParty += 1;
    await new Promise((r) => setTimeout(r, THIRD_PARTY_DELAY_MS));
    return route.fulfill({ status: 200, ...stubFor(request) }).catch(() => {});
  });
  page.on('response', async (response) => {
    const len = Number(response.headers()['content-length'] || 0);
    counts.bytes += len;
  });
  try {
    await page.goto(base + pagePath, { waitUntil: 'load', timeout: 30000 });
  } catch (err) {
    if (!/net::ERR_ABORTED|frame was detached|Navigation/.test(String(err))) throw err;
  }
  const timing = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const fcp = performance.getEntriesByName('first-contentful-paint')[0];
    return {
      load: nav ? nav.loadEventEnd : NaN,
      dcl: nav ? nav.domContentLoadedEventEnd : NaN,
      fcp: fcp ? fcp.startTime : NaN,
      transfer: nav ? nav.transferSize : NaN,
    };
  }).catch(() => ({ load: NaN, dcl: NaN, fcp: NaN }));
  await context.close();
  return { ...timing, ...counts };
}

(async () => {
  if (!fs.existsSync(SITE)) {
    console.error(`Site directory not found: ${SITE}. Run "bundle exec jekyll build" first.`);
    process.exit(2);
  }
  const server = await startServer();
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch();
  let pages = listPages();
  if (ONLY) pages = pages.filter((p) => p.includes(ONLY));

  // Warm up the browser process and the server cache once, then discard.
  for (const p of pages.slice(0, 3)) await measure(browser, base, p);

  const results = [];
  for (const p of pages) {
    const runs = [];
    for (let i = 0; i < RUNS; i += 1) runs.push(await measure(browser, base, p));
    const loads = runs.map((r) => r.load);
    results.push({
      page: p,
      load: median(loads),
      maxLoad: Math.max(...loads),
      dcl: median(runs.map((r) => r.dcl)),
      fcp: median(runs.map((r) => r.fcp)),
      requests: runs[0].firstParty,
      thirdParty: runs[0].thirdParty,
    });
  }
  await browser.close();
  server.close();

  results.sort((a, b) => b.load - a.load);
  const over = results.filter((r) => !(r.load < BUDGET));
  const fmt = (n) => (Number.isFinite(n) ? n.toFixed(1).padStart(7) : '    n/a');
  console.log(`${'load'.padStart(7)} ${'max'.padStart(7)} ${'dcl'.padStart(7)} ${'fcp'.padStart(7)}  req 3rd  page`);
  for (const r of results) {
    console.log(`${fmt(r.load)} ${fmt(r.maxLoad)} ${fmt(r.dcl)} ${fmt(r.fcp)}  ${String(r.requests).padStart(3)} ${String(r.thirdParty).padStart(3)}  ${r.page}`);
  }
  const loads = results.map((r) => r.load);
  console.log('');
  console.log(`pages: ${results.length}  runs/page: ${RUNS}  budget: ${BUDGET} ms`);
  console.log(`median of medians: ${median(loads).toFixed(1)} ms  slowest: ${Math.max(...loads).toFixed(1)} ms`);
  console.log(`pages at or over budget: ${over.length}`);
  if (JSON_OUT) fs.writeFileSync(JSON_OUT, JSON.stringify({ budget: BUDGET, runs: RUNS, results }, null, 2));
  process.exit(over.length ? 1 : 0);
})().catch((err) => {
  console.error(err);
  process.exit(2);
});
