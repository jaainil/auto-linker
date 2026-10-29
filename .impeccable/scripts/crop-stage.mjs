import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto('http://localhost:4322/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
await page.locator('.stage').screenshot({ path: '.impeccable/review/crop-stage.png' });
await browser.close();
