import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const dir = '/home/jainil/Downloads/CODE/auto-linker/.impeccable/review';
await fs.mkdir(dir, { recursive: true });

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const errors = [];

async function shoot(width, height, name, opts = {}) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`${name}: ${msg.text()}`);
  });
  page.on('pageerror', (err) => errors.push(`${name}: ${err.message}`));
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-in')));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${dir}/${name}.png`, fullPage: opts.fullPage ?? true });
  if (opts.viewportShot) {
    await page.screenshot({ path: `${dir}/${opts.viewportShot}.png` });
  }
  return { page, context };
}

const desktop = await shoot(1440, 1000, 'desktop', { viewportShot: 'desktop-viewport' });
const mobile = await shoot(390, 844, 'mobile', { viewportShot: 'mobile-viewport' });

// Interaction audit on desktop
const page = desktop.page;
const results = [];
results.push(await page.evaluate(() => ({
  title: document.title,
  scrollWidth: document.documentElement.scrollWidth,
  clientWidth: document.documentElement.clientWidth,
  bodyHeight: document.body.scrollHeight,
})));

const stage = await page.evaluate(() => {
  const s = document.querySelector('[data-stage]');
  return {
    paths: s?.querySelectorAll('.trace-path').length,
    anchors: s?.querySelectorAll('.trace-anchor').length,
    bytes: s?.querySelector('[data-stage-bytes]')?.textContent,
  };
});
results.push({ stage });

await page.click('[data-run]');
await page.waitForTimeout(1400);
results.push(await page.evaluate(() => ({
  auditRows: document.querySelectorAll('.audit__row').length,
  insertedLinks: document.querySelectorAll('.demo__article a[data-autolink]').length,
  live: document.querySelector('[data-live]')?.textContent,
  selected: document.querySelector('[data-stat="links"]')?.textContent,
  candidates: document.querySelector('[data-stat="candidates"]')?.textContent,
  bytes: document.querySelector('[data-bytes]')?.textContent,
  diag: document.querySelector('[data-diag]')?.textContent,
  corpusLinked: document.querySelectorAll('.corpus__row.is-linked').length,
  auditText: [...document.querySelectorAll('.audit__row')].map((r) => r.innerText.replace(/\n/g, ' | ')),
})));
await page.screenshot({ path: `${dir}/demo-inserted.png`, fullPage: false });

await page.click('[data-recover]');
await page.waitForTimeout(300);
results.push(await page.evaluate(() => ({
  bytes: document.querySelector('[data-bytes]')?.textContent,
  linksAfter: document.querySelectorAll('.demo__article a[data-autolink]').length,
  recovered: document.querySelector('[data-bytes]')?.classList.contains('proof'),
})));

// Stage recovery
await page.click('[data-stage-recover]');
await page.waitForTimeout(300);
results.push(await page.evaluate(() => ({
  stageState: document.querySelector('[data-stage-state]')?.textContent,
  stageBytes: document.querySelector('[data-stage-bytes]')?.textContent,
  anchors: document.querySelectorAll('.trace-anchor').length,
})));

// Suggest mode
await page.click('[data-mode="suggest"]');
await page.waitForTimeout(200);
await page.click('[data-run]');
await page.waitForTimeout(1300);
results.push(await page.evaluate(() => ({
  spans: document.querySelectorAll('.demo__article span[data-autolink]').length,
  links: document.querySelectorAll('.demo__article a[data-autolink]').length,
  bytes: document.querySelector('[data-bytes]')?.textContent,
})));
await page.screenshot({ path: `${dir}/demo-suggest.png`, fullPage: false });

// Overflow and font check
results.push(await page.evaluate(() => {
  const overflowing = [...document.querySelectorAll('body *')].filter((el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && (r.right > document.documentElement.clientWidth + 1 || r.left < -1);
  }).slice(0, 10).map((el) => `${el.tagName}.${el.className}`);
  return {
    overflowing,
    h1Size: getComputedStyle(document.querySelector('h1')).fontSize,
    bodyFont: getComputedStyle(document.body).fontFamily,
    codeFont: getComputedStyle(document.querySelector('pre')).fontFamily,
  };
}));

console.log(JSON.stringify({ results, errors }, null, 2));
await browser.close();
