import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await page.evaluate(() => document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-in')));
console.log(await page.evaluate(() => {
  const corpus = document.querySelector('[data-corpus]');
  return {
    html: corpus?.innerHTML.slice(0, 800),
    childCount: corpus?.children.length,
    rows: [...document.querySelectorAll('.corpus__row')].map(r => ({
      text: r.innerText, rect: r.getBoundingClientRect().toJSON(),
    })),
    corpusRect: corpus?.getBoundingClientRect().toJSON(),
    corpusStyles: corpus ? { display: getComputedStyle(corpus).display, height: getComputedStyle(corpus).height, overflow: getComputedStyle(corpus).overflow } : null,
    paneRect: document.querySelector('.demo__pane--corpus')?.getBoundingClientRect().toJSON(),
  };
}));
await browser.close();
