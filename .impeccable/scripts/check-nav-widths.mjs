import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
for (const width of [721, 768, 820, 900, 1080]) {
  const ctx = await browser.newContext({ viewport: { width, height: 200 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: `.impeccable/review/nav-${width}.png` });
  const nav = await page.evaluate(() => {
    const inner = document.querySelector('.nav__inner');
    const links = document.querySelector('.nav__links');
    const cta = document.querySelector('.nav__cta');
    return {
      inner: inner?.getBoundingClientRect().toJSON(),
      links: links?.getBoundingClientRect().toJSON(),
      cta: cta?.getBoundingClientRect().toJSON(),
      linksDisplay: links ? getComputedStyle(links).display : null,
      scrollW: document.documentElement.scrollWidth,
    };
  });
  console.log(width, JSON.stringify(nav));
  await ctx.close();
}
await browser.close();
