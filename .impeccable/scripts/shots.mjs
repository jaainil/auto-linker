import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const dir = '.impeccable/review';
await fs.mkdir(dir, { recursive: true });
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const errors = [];
async function open(width, height) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:4322/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-in')));
  await page.waitForTimeout(900);
  return page;
}
const d = await open(1440, 1000);
await d.screenshot({ path: `${dir}/desktop.png`, fullPage: true });
await d.screenshot({ path: `${dir}/desktop-viewport.png` });
for (const [sel, name] of [['#problem','sec-problem'],['#mechanism','sec-mechanism'],['#api','sec-api'],['#scoring','sec-scoring'],['#guarantees','sec-invariants'],['#blueprint','sec-blueprint'],['.close','sec-close']]) {
  await d.locator(sel).screenshot({ path: `${dir}/${name}.png` });
}
await d.locator('#demo').screenshot({ path: `${dir}/sec-demo.png` });
await d.click('[data-run]');
await d.waitForTimeout(1300);
await d.locator('#demo').screenshot({ path: `${dir}/sec-demo-run.png` });
await d.locator('.demo').screenshot({ path: `${dir}/demo-panel.png` });

const m = await open(390, 844);
await m.screenshot({ path: `${dir}/mobile.png`, fullPage: true });
await m.screenshot({ path: `${dir}/mobile-viewport.png` });
for (const [sel, name] of [['#demo','m-demo'],['#api','m-api'],['#blueprint','m-blueprint']]) {
  await m.locator(sel).screenshot({ path: `${dir}/${name}.png` });
}
console.log(JSON.stringify({ errors }, null, 2));
await browser.close();
