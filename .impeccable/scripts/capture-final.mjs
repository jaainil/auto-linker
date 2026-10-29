import { chromium } from 'playwright';

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });

async function capture(width, height, name) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-in'));
  });
  await page.waitForTimeout(700);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(250);
  await page.screenshot({ path: `.impeccable/review/${name}.png`, fullPage: true });
  await page.screenshot({ path: `.impeccable/review/${name}-viewport.png`, fullPage: false });
  await ctx.close();
}

await capture(1440, 1000, 'desktop');
await capture(390, 844, 'mobile');

await browser.close();
console.log('captured');
