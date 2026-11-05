#!/usr/bin/env node
// Measures page-load time for every HTML page in a built Jekyll site.
//
// Test conditions (kept identical between runs so results are comparable):
// - Chromium resolves every host to one local server (--host-resolver-rules).
//   Pages are opened at https://brenorb.com/... and that origin is served from
//   `_site/` over TLS (ECDSA certificate) and HTTP/2 with gzip, like GitHub
//   Pages, with GitHub Pages-style URLs (`/foo/` -> `/foo/index.html`).
// - Every other (third-party) host gets an empty response after a fixed delay
//   (THIRD_PARTY_DELAY_MS, default 100 ms). Pages are never timed against the
//   live internet, but anything on the critical path to a third party still
//   costs time. No request is intercepted by the test process.
// - Headless Chromium, 1366x768 viewport, no CPU or network throttling.
// - Every run uses a fresh browser context, so the cache is always cold. The
//   browser is restarted every few pages to keep runs independent.
// - Metric: PerformanceNavigationTiming.loadEventEnd (time from navigation
//   start until the load event finished), reported by the page itself.
//   Redirect stubs are timed from the request for the old URL until the page
//   they send the visitor to has finished loading.
// - Each page is loaded RUNS times (default 5) and the median is reported.
//
// Usage:
//   node scripts/measure_page_load.js [--site _site] [--runs 5]
//        [--budget 50] [--json out.json] [--only substring] [--detail]
//
// --detail prints the resource timeline of the last run of each page.

const { execFileSync } = require('child_process');
const fs = require('fs');
const http = require('http');
const http2 = require('http2');
const net = require('net');
const os = require('os');
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
const DETAIL = args.includes('--detail');
const THIRD_PARTY_DELAY_MS = Number(process.env.THIRD_PARTY_DELAY_MS || 100);
const PAGES_PER_BROWSER = 10;
const PROD_HOST = 'brenorb.com';
const ORIGIN = `https://${PROD_HOST}`;

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
  const p = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  let file = path.join(SITE, p);
  if (!file.startsWith(SITE)) return null;
  try {
    if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
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

function serveSite(req, res) {
  const file = resolveFile(req.url);
  const entry = load(file || path.join(SITE, '404.html'));
  const gzip = entry.gz && /\bgzip\b/.test(req.headers['accept-encoding'] || '');
  res.writeHead(file ? 200 : 404, {
    'Content-Type': entry.type,
    'Cache-Control': 'max-age=600',
    'Access-Control-Allow-Origin': '*',
    ...(gzip ? { 'Content-Encoding': 'gzip' } : {}),
  });
  res.end(gzip ? entry.gz : entry.body);
}

const STUB_GIF = Buffer.from('R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==', 'base64');
const stubStats = { thirdParty: 0, production: 0 };

function serveStub(req, res) {
  const host = String(req.authority || req.headers.host || '').split(':')[0].toLowerCase();
  if (host === PROD_HOST || host === `www.${PROD_HOST}`) {
    stubStats.production += 1;
    serveSite(req, res);
    return;
  }
  stubStats.thirdParty += 1;
  setTimeout(() => {
    const accept = String(req.headers.accept || '');
    const dest = String(req.headers['sec-fetch-dest'] || '');
    let type = 'text/plain';
    let body = '';
    if (dest === 'image' || accept.startsWith('image/')) {
      type = 'image/gif';
      body = STUB_GIF;
    } else if (dest === 'script') {
      type = 'application/javascript';
    } else if (dest === 'style') {
      type = 'text/css';
    } else if (dest === 'iframe' || dest === 'document' || accept.includes('text/html')) {
      type = 'text/html';
      body = '<!doctype html><title>stub</title>';
    }
    res.writeHead(200, { 'Content-Type': type, 'Access-Control-Allow-Origin': '*' });
    res.end(body);
  }, THIRD_PARTY_DELAY_MS);
}

function makeCertificate() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'page-load-cert-'));
  const key = path.join(dir, 'key.pem');
  const cert = path.join(dir, 'cert.pem');
  execFileSync('openssl', ['req', '-x509', '-newkey', 'ec', '-pkeyopt', 'ec_paramgen_curve:prime256v1', '-nodes', '-days', '2',
    '-subj', '/CN=page-load-stub', '-keyout', key, '-out', cert], { stdio: 'ignore' });
  const result = { key: fs.readFileSync(key), cert: fs.readFileSync(cert) };
  fs.rmSync(dir, { recursive: true, force: true });
  return result;
}

function listen(server) {
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server.address().port)));
}

// One port that speaks both TLS (HTTP/2 or HTTP/1.1) and plain HTTP, so every
// URL (https:// or http://) can be pointed at it.
async function startStub() {
  const tls = http2.createSecureServer({ ...makeCertificate(), allowHTTP1: true }, serveStub);
  const plain = http.createServer(serveStub);
  const front = net.createServer({ pauseOnConnect: true }, (socket) => {
    socket.once('readable', () => {
      const first = socket.read(1);
      if (!first) {
        socket.destroy();
        return;
      }
      socket.unshift(first);
      // A TLS handshake starts with byte 0x16.
      (first[0] === 0x16 ? tls : plain).emit('connection', socket);
    });
  });
  return { port: await listen(front), servers: [front, tls, plain] };
}

function listPages() {
  const out = [];
  (function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      if (fs.statSync(full).isDirectory()) walk(full);
      else if (name.endsWith('.html')) {
        out.push(`/${path.relative(SITE, full).split(path.sep).join('/')}`.replace(/index\.html$/, ''));
      }
    }
  })(SITE);
  return out.sort();
}

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

// Runs in every document: report when it starts and when its load event ends.
const REPORT_TIMING = `(() => {
  if (window.top !== window) return;
  if (location.href === 'about:blank') return;
  window.__reportTiming({ kind: 'start', timeOrigin: performance.timeOrigin });
  window.addEventListener('load', () => setTimeout(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const fcp = performance.getEntriesByName('first-contentful-paint')[0];
    window.__reportTiming({
      kind: 'load',
      url: location.href,
      timeOrigin: performance.timeOrigin,
      load: nav ? nav.loadEventEnd : NaN,
      dcl: nav ? nav.domContentLoadedEventEnd : NaN,
      fcp: fcp ? fcp.startTime : NaN,
      nav: nav ? { responseStart: nav.responseStart, responseEnd: nav.responseEnd,
        domInteractive: nav.domInteractive, dcl: nav.domContentLoadedEventEnd, domComplete: nav.domComplete } : null,
      resources: performance.getEntriesByType('resource').map((e) => ({
        name: e.name, type: e.initiatorType, start: e.startTime, end: e.responseEnd, size: e.encodedBodySize })),
    });
  }, 0), { once: true });
})();`;

async function measure(browser, base, pagePath) {
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 }, ignoreHTTPSErrors: true });
  let firstOrigin = null;
  let resolveTiming;
  const timing = new Promise((resolve) => { resolveTiming = resolve; });
  await context.exposeBinding('__reportTiming', (_source, data) => {
    if (data.kind === 'start') {
      if (firstOrigin === null) firstOrigin = data.timeOrigin;
      return;
    }
    // Times are relative to the first document, so a redirect stub is timed
    // until the page it sends the visitor to has loaded.
    const offset = data.timeOrigin - (firstOrigin === null ? data.timeOrigin : firstOrigin);
    resolveTiming({
      ...data,
      load: data.load + offset,
      dcl: data.dcl + offset,
      fcp: data.fcp + offset,
      redirected: offset > 0,
    });
  });
  await context.addInitScript(REPORT_TIMING);
  const page = await context.newPage();
  stubStats.thirdParty = 0;
  stubStats.production = 0;
  page.goto(base + pagePath, { waitUntil: 'commit', timeout: 30000 }).catch(() => {});
  let timer;
  const result = await Promise.race([
    timing,
    new Promise((resolve) => { timer = setTimeout(() => resolve({ load: NaN, dcl: NaN, fcp: NaN }), 30000); }),
  ]);
  clearTimeout(timer);
  const thirdParty = stubStats.thirdParty;
  await context.close();
  return { ...result, thirdParty, requests: (result.resources || []).length + 1 };
}

(async () => {
  if (!fs.existsSync(SITE)) {
    console.error(`Site directory not found: ${SITE}. Run "bundle exec jekyll build" first.`);
    process.exit(2);
  }
  const stub = await startStub();
  const base = ORIGIN;
  // Chromium honours proxy variables from the environment even with
  // --no-proxy-server, which would send stubbed hosts to a real proxy.
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !/proxy/i.test(key)));
  const launch = () => chromium.launch({
    env,
    args: [
      `--host-resolver-rules=MAP * 127.0.0.1:${stub.port}`,
      '--ignore-certificate-errors',
      '--no-proxy-server', // never use a proxy from the environment
    ],
  });

  let pages = listPages();
  if (ONLY) pages = pages.filter((p) => p.includes(ONLY));

  let browser = await launch();
  // Warm up the browser and the server cache once, then discard.
  for (const p of pages.slice(0, 3)) await measure(browser, base, p);

  const results = [];
  for (const [index, p] of pages.entries()) {
    if (index > 0 && index % PAGES_PER_BROWSER === 0) {
      await browser.close();
      browser = await launch();
      await measure(browser, base, p); // warm-up after restart
    }
    const runs = [];
    for (let i = 0; i < RUNS; i += 1) runs.push(await measure(browser, base, p));
    const loads = runs.map((r) => r.load);
    if (DETAIL) {
      console.error(`\n${p}  runs: ${loads.map((x) => x.toFixed(1)).join(', ')}`);
      const last = runs[runs.length - 1];
      const n = last.nav || {};
      const f = (x) => (Number.isFinite(x) ? x.toFixed(1) : '-');
      console.error(`\n${p}  load ${f(last.load)}  response ${f(n.responseStart)}-${f(n.responseEnd)}  interactive ${f(n.domInteractive)}  dcl ${f(n.dcl)}  complete ${f(n.domComplete)}`);
      for (const r of last.resources || []) {
        console.error(`  ${f(r.start).padStart(6)} -> ${f(r.end).padStart(6)}  ${String(r.size).padStart(7)}  ${r.type.padEnd(8)} ${r.name.replace(base, '')}`);
      }
    }
    results.push({
      page: p,
      load: median(loads),
      maxLoad: Math.max(...loads),
      dcl: median(runs.map((r) => r.dcl)),
      fcp: median(runs.map((r) => r.fcp)),
      requests: runs[0].requests,
      thirdParty: runs[0].thirdParty,
    });
  }
  await browser.close();
  stub.servers.forEach((s) => s.close());

  results.sort((a, b) => b.load - a.load);
  const over = results.filter((r) => !(r.load < BUDGET));
  const fmt = (n) => (Number.isFinite(n) ? n.toFixed(1).padStart(7) : '    n/a');
  console.log(`${'load'.padStart(7)} ${'max'.padStart(7)} ${'dcl'.padStart(7)} ${'fcp'.padStart(7)}  req 3rd  page`);
  for (const r of results) {
    console.log(`${fmt(r.load)} ${fmt(r.maxLoad)} ${fmt(r.dcl)} ${fmt(r.fcp)}  ${String(r.requests).padStart(3)} ${String(r.thirdParty).padStart(3)}  ${r.page}`);
  }
  const loads = results.map((r) => r.load);
  console.log('');
  console.log(`pages: ${results.length}  runs/page: ${RUNS}  budget: ${BUDGET} ms  third-party delay: ${THIRD_PARTY_DELAY_MS} ms`);
  console.log(`median of medians: ${median(loads).toFixed(1)} ms  slowest: ${Math.max(...loads).toFixed(1)} ms`);
  console.log(`pages at or over budget: ${over.length}`);
  if (JSON_OUT) fs.writeFileSync(JSON_OUT, JSON.stringify({ budget: BUDGET, runs: RUNS, results }, null, 2));
  process.exit(over.length ? 1 : 0);
})().catch((err) => {
  console.error(err);
  process.exit(2);
});
