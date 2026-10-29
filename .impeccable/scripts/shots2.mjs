import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const ctx = await browser.newContext({ viewport: { width: 390, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto('http://localhost:4322/', { waitUntil: 'networkidle' });
await page.evaluate(() => {
  document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-in'));
  document.querySelector('.nav')?.remove();
});
await page.waitForTimeout(600);
for (const [sel,name] of [['#demo','m2-demo'],['#api','m2-api'],['#blueprint','m2-blueprint'],['#guarantees','m2-invariants']]) {
  await page.locator(sel).screenshot({ path: `.impeccable/review/${name}.png` });
}
await page.locator('.hero').screenshot({ path: '.impeccable/review/m2-hero.png' });
await page.locator('#demo').scrollIntoViewIfNeeded();
await page.waitForTimeout(200);
await page.screenshot({ path: '.impeccable/review/m2-demo-viewport.png' });
await browser.close();
