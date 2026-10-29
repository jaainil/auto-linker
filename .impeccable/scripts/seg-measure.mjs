import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
for (const width of [320, 360, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto('http://localhost:4322/', { waitUntil: 'networkidle' });
  const m = await page.evaluate(() => {
    const seg = document.querySelector('.demo__toolbar .seg');
    const buttons = [...seg.querySelectorAll('button')];
    return { segW: seg.getBoundingClientRect().width, segSW: seg.scrollWidth, segCW: seg.clientWidth, btns: buttons.map(b => ({ t: b.textContent, w: +b.getBoundingClientRect().width.toFixed(1), sw: b.scrollWidth, fs: getComputedStyle(b).fontSize, pad: getComputedStyle(b).padding })) };
  });
  console.log(width, JSON.stringify(m));
  await page.close();
}
await browser.close();
