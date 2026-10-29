import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
for (const width of [320, 360, 390, 768, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto('http://localhost:4322/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-in')));
  const m = await page.evaluate(() => {
    const pre = document.querySelector('.code-card pre');
    const card = document.querySelector('.code-card');
    return {
      docOverflow: document.documentElement.scrollWidth - window.innerWidth,
      bodyOverflow: document.body.scrollWidth - window.innerWidth,
      cardWidth: card?.getBoundingClientRect().width,
      cardRight: card?.getBoundingClientRect().right,
      preW: pre?.getBoundingClientRect().width,
      preSW: pre?.scrollWidth,
      preOverflow: pre ? pre.scrollWidth - pre.clientWidth : null,
    };
  });
  console.log(width, JSON.stringify(m));
  await page.close();
}
await browser.close();
