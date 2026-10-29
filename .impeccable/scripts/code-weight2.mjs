import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto('http://localhost:4322/', { waitUntil: 'networkidle' });
await page.evaluate(() => { document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-in')); document.querySelector('.nav')?.remove(); });
await page.addStyleTag({ content: `.code-card pre { font-weight: 900 !important; font-size: 16.5px !important; line-height: 1.55 !important; }` });
await page.waitForTimeout(300);
await page.locator('#api .code-card').first().screenshot({ path: '.impeccable/review/weight-900.png' });
await browser.close();
