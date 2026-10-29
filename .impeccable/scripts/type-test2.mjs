import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto('http://localhost:4322/', { waitUntil: 'networkidle' });
await page.evaluate(() => { document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-in')); document.querySelector('.nav')?.remove(); });
await page.addStyleTag({ content: `
.tag { font-family: var(--font-sans) !important; font-size: 10px !important; font-weight: 500 !important; letter-spacing: 0.08em !important; text-transform: uppercase !important; }
.stepper output { font-family: var(--font-sans) !important; font-size: 13.5px !important; font-weight: 500 !important; }
.dod__foot { font-size: 10.5px !important; color: #3f3f3f !important; letter-spacing: 0.03em !important; }
.code-card pre { font-size: 15.5px !important; font-weight: 650 !important; line-height: 1.65 !important; }
`});
await page.waitForTimeout(300);
await page.locator('.dod').screenshot({ path: '.impeccable/review/test2-dod.png' });
await page.locator('.stage').screenshot({ path: '.impeccable/review/test2-stage.png' });
await page.setViewportSize({ width: 390, height: 900 });
await page.waitForTimeout(300);
await page.locator('.demo__toolbar').screenshot({ path: '.impeccable/review/test2-toolbar.png' });
await browser.close();
