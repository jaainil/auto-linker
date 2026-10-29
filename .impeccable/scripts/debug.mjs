import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.on('console', m => { if (m.text().includes('DEBUG')) console.log(m.text()); });
await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await page.click('[data-run]');
await page.waitForTimeout(1200);
await browser.close();
