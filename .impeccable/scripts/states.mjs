import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
async function pageFor(width, height) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4322/', { waitUntil: 'networkidle' });
  await page.evaluate(() => { document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-in')); document.querySelector('.nav')?.remove(); });
  return { ctx, page };
}
const { ctx: dctx, page: d } = await pageFor(1440, 1000);
await d.click('[data-run]');
await d.waitForTimeout(800);
await d.locator('.demo').screenshot({ path: '.impeccable/review/final-demo-desktop.png' });
await d.click('[data-view="html"]');
await d.waitForTimeout(200);
await d.locator('.demo').screenshot({ path: '.impeccable/review/final-demo-html.png' });
await d.click('[data-recover]');
await d.waitForTimeout(200);
await d.locator('.demo').screenshot({ path: '.impeccable/review/final-demo-html-recovered.png' });
await dctx.close();

const { ctx: mctx, page: m } = await pageFor(390, 900);
await m.click('[data-run]');
await m.waitForTimeout(800);
await m.locator('.demo').screenshot({ path: '.impeccable/review/final-demo-mobile-run.png' });
await m.click('[data-view="html"]');
await m.waitForTimeout(200);
await m.locator('.demo').screenshot({ path: '.impeccable/review/final-demo-mobile-html.png' });
await mctx.close();
await browser.close();
