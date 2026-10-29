import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto('http://localhost:4322/', { waitUntil: 'networkidle' });
await page.addStyleTag({ content: `.code-card pre { font-size: 16px !important; font-weight: 750 !important; outline: 4px solid red !important; } .tag { background: red !important; }` });
const out = await page.evaluate(() => {
  const pre = document.querySelector('.code-card pre');
  const cs = getComputedStyle(pre);
  return { fs: cs.fontSize, fw: cs.fontWeight, ff: cs.fontFamily, outline: cs.outlineColor, tagBg: getComputedStyle(document.querySelector('.tag')).backgroundColor, sheets: document.styleSheets.length };
});
console.log(out);
await browser.close();
