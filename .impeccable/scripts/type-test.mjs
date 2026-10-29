import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto('http://localhost:4322/', { waitUntil: 'networkidle' });
await page.evaluate(() => { document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-in')); document.querySelector('.nav')?.remove(); });
await page.addStyleTag({ content: `
.code-card pre { font-size: 16px !important; font-weight: 750 !important; line-height: 1.8 !important; }
.dod__foot { font-size: 11px !important; color: #4d4d4d !important; }
.tag { font-size: 11px !important; font-weight: 700 !important; }
.stepper output { font-size: 18px !important; font-weight: 700 !important; }
.dod__item code { font-size: 13px !important; font-weight: 700 !important; }
`});
await page.waitForTimeout(300);
await page.locator('#api .code-card').first().screenshot({ path: '.impeccable/review/test-code.png' });
await page.locator('.dod').screenshot({ path: '.impeccable/review/test-dod.png' });
await page.setViewportSize({ width: 390, height: 900 });
await page.waitForTimeout(300);
await page.locator('.demo__toolbar').screenshot({ path: '.impeccable/review/test-toolbar.png' });
await browser.close();
