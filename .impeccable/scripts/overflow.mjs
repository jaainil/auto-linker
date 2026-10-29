import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
for (const width of [390, 320]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto('http://localhost:4322/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-in')));
  const offenders = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    return [...document.querySelectorAll('*')].map(el => {
      const r = el.getBoundingClientRect();
      return { tag: el.tagName.toLowerCase(), cls: (el.className && typeof el.className === 'string') ? el.className : '', left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width), sw: el.scrollWidth, cw: el.clientWidth };
    }).filter(o => o.right > vw + 1 || o.left < -1).sort((a,b)=>b.right-a.right).slice(0,25);
  });
  console.log(width, JSON.stringify(offenders, null, 1));
  await page.close();
}
await browser.close();
