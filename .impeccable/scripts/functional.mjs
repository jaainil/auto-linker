import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const results = {};
const errors = [];

async function open(width, height) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') errors.push(`${width}: ${m.text()}`); });
  page.on('pageerror', e => errors.push(`${width}: ${e.message}`));
  await page.goto('http://localhost:4322/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-in')));
  return { ctx, page };
}

const { ctx, page } = await open(1440, 1000);
results.initial = await page.evaluate(() => ({
  overflow: document.documentElement.scrollWidth - window.innerWidth,
  bytes: document.querySelector('[data-bytes]')?.textContent,
  corpus: document.querySelectorAll('.corpus__row').length,
  empty: !document.querySelector('[data-empty]')?.hidden,
}));

await page.click('[data-run]');
await page.waitForTimeout(900);
results.insert = await page.evaluate(() => ({
  auditRows: document.querySelectorAll('.audit__row').length,
  links: document.querySelectorAll('.demo__article a[data-autolink]').length,
  bytes: document.querySelector('[data-bytes]')?.textContent,
  live: document.querySelector('[data-live]')?.textContent,
  linkedRows: document.querySelectorAll('.corpus__row.is-linked').length,
  stats: document.querySelector('.demo__stats')?.innerText.replace(/\s+/g, ' ').trim(),
  diag: document.querySelector('[data-diag]')?.textContent,
}));

await page.click('[data-recover]');
await page.waitForTimeout(200);
results.recovered = await page.evaluate(() => ({
  links: document.querySelectorAll('.demo__article a[data-autolink]').length,
  bytes: document.querySelector('[data-bytes]')?.textContent,
  live: document.querySelector('[data-live]')?.textContent,
  recoverDisabled: document.querySelector('[data-recover]')?.disabled,
}));

await page.click('[data-view="html"]');
await page.waitForTimeout(200);
results.htmlRecovered = await page.evaluate(() => ({
  hasTags: document.querySelector('[data-source]')?.textContent.includes('data-autolink="true"'),
  sourceLen: document.querySelector('[data-source]')?.textContent.length,
}));

await page.click('[data-run]');
await page.waitForTimeout(900);
results.htmlInserted = await page.evaluate(() => ({
  hasTags: document.querySelector('[data-source]')?.textContent.includes('data-autolink="true"'),
  tagCount: (document.querySelector('[data-source]')?.textContent.match(/data-autolink="true"/g) || []).length,
  bytes: document.querySelector('[data-bytes]')?.textContent,
}));

await page.click('[data-recover]');
await page.waitForTimeout(200);
results.htmlRecoveredAfterInsert = await page.evaluate(() => ({
  hasTags: document.querySelector('[data-source]')?.textContent.includes('data-autolink="true"'),
  bytes: document.querySelector('[data-bytes]')?.textContent,
  live: document.querySelector('[data-live]')?.textContent,
}));

await page.click('[data-view="rendered"]');
await page.click('[data-mode="suggest"]');
await page.waitForTimeout(200);
await page.click('[data-run]');
await page.waitForTimeout(900);
results.suggest = await page.evaluate(() => ({
  auditRows: document.querySelectorAll('.audit__row').length,
  links: document.querySelectorAll('.demo__article a[data-autolink]').length,
  bytes: document.querySelector('[data-bytes]')?.textContent,
  label: document.querySelector('[data-run-label]')?.textContent,
  live: document.querySelector('[data-live]')?.textContent,
}));

await page.click('[data-mode="insert"]');
await page.click('[data-scenario="1"]');
await page.waitForTimeout(300);
await page.click('[data-run]');
await page.waitForTimeout(900);
results.logistics = await page.evaluate(() => ({
  title: document.querySelector('.corpus__title')?.textContent,
  auditRows: document.querySelectorAll('.audit__row').length,
  bytes: document.querySelector('[data-bytes]')?.textContent,
  live: document.querySelector('[data-live]')?.textContent,
}));

await page.click('[data-scenario="2"]');
await page.waitForTimeout(300);
await page.click('[data-run]');
await page.waitForTimeout(900);
results.internal = await page.evaluate(() => ({
  title: document.querySelector('.corpus__title')?.textContent,
  auditRows: document.querySelectorAll('.audit__row').length,
  live: document.querySelector('[data-live]')?.textContent,
}));

for (let i = 0; i < 3; i++) await page.click('[data-step="+"]');
await page.click('[data-run]');
await page.waitForTimeout(900);
results.maxLinks = await page.evaluate(() => ({
  max: document.querySelector('[data-max]')?.textContent,
  auditRows: document.querySelectorAll('.audit__row').length,
}));

await ctx.close();

for (const width of [390, 320, 768]) {
  const { ctx: c, page: p } = await open(width, 900);
  results[`layout${width}`] = await p.evaluate(() => {
    const seg = document.querySelector('.demo__toolbar .seg');
    const code = document.querySelector('.code-card pre');
    return {
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      segOverflow: seg ? seg.scrollWidth - seg.clientWidth : null,
      codeScrolls: code ? code.scrollWidth > code.clientWidth : null,
      heroFactsLines: (() => {
        const el = document.querySelector('.hero__facts');
        if (!el) return null;
        return Math.round(el.getBoundingClientRect().height / 18);
      })(),
    };
  });
  await c.close();
}

console.log(JSON.stringify({ results, errors }, null, 2));
await browser.close();
