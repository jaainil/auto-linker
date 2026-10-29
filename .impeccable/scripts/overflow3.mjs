import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
for (const width of [320, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto('http://localhost:4322/', { waitUntil: 'networkidle' });
  const m = await page.evaluate(() => {
    const d = document.querySelector('.diff');
    const r = d?.getBoundingClientRect();
    const src = document.querySelector('.demo__source');
    return {
      diffW: r?.width, diffSW: d?.scrollWidth, diffOverflow: d ? d.scrollWidth - d.clientWidth : null,
      diffRight: r?.right,
      srcSW: src?.scrollWidth, srcCW: src?.clientWidth,
      demoSourceHidden: src?.hidden,
    };
  });
  console.log(width, JSON.stringify(m));
  await page.close();
}
await browser.close();
