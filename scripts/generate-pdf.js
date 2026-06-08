#!/usr/bin/env node
/**
 * generate-pdf.js — HTML → PDF exporter for the résumé editions.
 *
 * Produces ONE continuous-scroll page per edition (no page breaks), sized to
 * the full content height, matching the live web design 1:1.
 *
 * Usage:
 *   node scripts/generate-pdf.js              # regenerate every edition
 *   node scripts/generate-pdf.js root swiss   # only the named editions
 *
 * See PDF_CONVERSION.md for the full guide (setup, why each setting exists,
 * how to add a new edition, troubleshooting).
 */

const path = require('path');
const fs = require('fs');

let puppeteer;
try {
  // Prefer a local install (puppeteer or puppeteer-core, either works).
  puppeteer = require('puppeteer-core');
} catch (_) {
  try {
    puppeteer = require('puppeteer');
  } catch (_) {
    console.error(
      '\nMissing dependency. Install one of:\n' +
      '  npm i -D puppeteer-core   (then set CHROME_PATH, see below)\n' +
      '  npm i -D puppeteer        (downloads its own Chromium)\n'
    );
    process.exit(1);
  }
}

const ROOT = path.resolve(__dirname, '..');
const MM = 96 / 25.4;          // CSS px per millimetre at 96 dpi
const PAGE_W_MM = 210;         // A4 width — the visual width of every page

/**
 * Locate a Chrome/Chromium executable.
 * Priority: $CHROME_PATH → puppeteer's bundled browser → system Google Chrome.
 */
function resolveChrome() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }
  try {
    const p = puppeteer.executablePath();
    if (p && fs.existsSync(p)) return p;
  } catch (_) { /* puppeteer-core has no bundled browser */ }
  const fallbacks = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ];
  for (const p of fallbacks) if (fs.existsSync(p)) return p;
  return undefined; // let puppeteer try its own default
}

/**
 * One entry per édition.
 *   id      cli selector
 *   html    source file (relative to repo root)
 *   pdf     output file (relative to repo root)
 *   media   'print' or 'screen' — which stylesheet to render with
 *   margin  millimetres of whitespace kept around the continuous page
 *
 * media: most editions use their @media print styling ('print'). The terminal
 * edition's print styling collapses its layout, so it renders with 'screen'.
 */
const EDITIONS = [
  { id: 'root',      html: 'index.html',                            pdf: 'Ahmad_iOS_TechLead_Resume.pdf',                            media: 'print',  margin: 0 },
  { id: 'editorial', html: 'versions/2026-06-editorial/index.html', pdf: 'versions/2026-06-editorial/Ahmad_iOS_TechLead_Resume.pdf', media: 'print',  margin: 0 },
  { id: 'terminal',  html: 'versions/2026-06-terminal/index.html',  pdf: 'versions/2026-06-terminal/Ahmad_iOS_TechLead_Resume.pdf',  media: 'screen', margin: 9 },
  { id: 'swiss',     html: 'versions/2026-06-swiss/index.html',     pdf: 'versions/2026-06-swiss/Ahmad_iOS_TechLead_Resume.pdf',     media: 'print',  margin: 8 },
];

async function exportEdition(browser, job) {
  const page = await browser.newPage();
  const mPx = Math.round(job.margin * MM);
  const contentW = Math.round(PAGE_W_MM * MM) - 2 * mPx; // printable width in px

  // Render at the printable width with the edition's stylesheet.
  await page.emulateMediaType(job.media);
  await page.setViewport({ width: contentW, height: 1123, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(ROOT, job.html), { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 500)); // let fonts / reveal styles settle

  // Measure the full content height, then make Chrome size a SINGLE page that
  // tall via an injected @page rule. Letting Chrome own the page size (with
  // preferCSSPageSize) is what produces a correct continuous page — forcing
  // height through page.pdf({height}) mis-lays-out the content.
  const contentH = await page.evaluate((mm, pageWmm) => {
    const h = Math.ceil(document.documentElement.getBoundingClientRect().height);
    const style = document.createElement('style');
    style.textContent =
      '@page{ size: ' + pageWmm + 'mm ' + (h + 2 * mm) + 'px; margin: ' + mm + 'mm !important; }';
    document.head.appendChild(style);
    return h;
  }, job.margin, PAGE_W_MM);

  await page.pdf({
    path: path.join(ROOT, job.pdf),
    printBackground: true,
    preferCSSPageSize: true,
  });

  // Report dimensions + a 1-page sanity check.
  const raw = fs.readFileSync(path.join(ROOT, job.pdf), 'latin1');
  const boxes = [...raw.matchAll(/MediaBox\s*\[([^\]]+)\]/g)].map((m) => m[1].trim());
  const ok = boxes.length === 1 ? '✓' : '⚠ expected 1 page';
  console.log(`  ${job.id.padEnd(10)} → ${job.pdf}`);
  console.log(`             pages=${boxes.length} ${ok}  box=[${boxes[0]}]  contentH=${contentH}px`);
  await page.close();
}

(async () => {
  const wanted = process.argv.slice(2);
  const jobs = wanted.length ? EDITIONS.filter((e) => wanted.includes(e.id)) : EDITIONS;
  if (!jobs.length) {
    console.error('No matching editions. Valid ids: ' + EDITIONS.map((e) => e.id).join(', '));
    process.exit(1);
  }

  const executablePath = resolveChrome();
  console.log('Chrome: ' + (executablePath || '(puppeteer default)'));
  const browser = await puppeteer.launch({ executablePath, headless: 'new' });
  console.log('Generating ' + jobs.length + ' edition(s):');
  for (const job of jobs) await exportEdition(browser, job);
  await browser.close();
  console.log('Done.');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
