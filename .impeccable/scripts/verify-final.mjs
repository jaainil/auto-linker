import { chromium } from 'playwright';

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const widths = [390, 768, 1024, 1280, 1440, 1600];
const errors = [];

for (const width of widths) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`${width}: ${m.text()}`); });
  page.on('pageerror', (e) => errors.push(`${width}: pageerror ${e.message}`));
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  const overflow = await page.evaluate(() => {
    const de = document.documentElement;
    const wide = [...document.querySelectorAll('body *')].filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && (r.right > de.clientWidth + 1 || r.left < -1) && getComputedStyle(el).position !== 'fixed';
    }).slice(0, 8).map((el) => `${el.tagName.toLowerCase()}.${el.className?.toString().split(' ')[0] ?? ''} right=${Math.round(el.getBoundingClientRect().right)}`);
    return { scrollW: de.scrollWidth, clientW: de.clientWidth, wide };
  });
  console.log(width, JSON.stringify(overflow));
  await ctx.close();
}

// functional run at 1440
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await ctx.newPage();
page.on('pageerror', (e) => errors.push(`func pageerror ${e.message}`));
await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await page.locator('#demo').scrollIntoViewIfNeeded();
await page.click('[data-run]');
await page.waitForTimeout(1400);
const state = await page.evaluate(() => {
  const stage = document.querySelector('#demo');
  const links = stage?.querySelectorAll('.demo__article a').length ?? 0;
  const rows = stage?.querySelectorAll('.audit__row').length ?? 0;
  const status = stage?.querySelector('.demo__status')?.textContent?.trim();
  return { links, rows, status };
});
console.log('after run', state);
const recoverDisabled = await page.locator('[data-recover]').isDisabled();
console.log('recover disabled after run:', recoverDisabled);
await page.click('[data-recover]');
await page.waitForTimeout(400);
const recovered = await page.evaluate(() => ({
  links: document.querySelectorAll('#demo .demo__article a').length,
  status: document.querySelector('#demo .demo__status')?.textContent?.trim(),
}));
console.log('after recover', recovered);

// tabs keyboard
const tabs = page.locator('[data-tabs]').first();
await tabs.scrollIntoViewIfNeeded();
const firstTab = tabs.locator('[data-tab-target]').first();
await firstTab.focus();
await page.keyboard.press('ArrowRight');
console.log('tab selected', await page.evaluate(() => document.querySelector('[data-tabs] [aria-selected="true"]')?.textContent?.trim()));

// focus visibility
const focus = await page.evaluate(() => {
  const el = document.querySelector('.pill--primary');
  el.focus();
  const s = getComputedStyle(el);
  return { outline: s.outlineStyle, width: s.outlineWidth, color: s.outlineColor };
});
console.log('focus', focus);

console.log('errors', errors);
await browser.close();
