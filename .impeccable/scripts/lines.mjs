import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto('http://localhost:4322/', { waitUntil: 'networkidle' });
await page.evaluate(() => document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-in')));
const rows = await page.evaluate(() => {
  const out = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const text = node.textContent.trim();
    if (text.length < 40) continue;
    const el = node.parentElement;
    if (!el) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const r = el.getBoundingClientRect();
    if (r.width < 50) continue;
    const size = parseFloat(cs.fontSize);
    const approx = r.width / (size * 0.5);
    if (approx > 80) out.push({ tag: el.tagName, cls: el.className, text: text.slice(0, 70), width: Math.round(r.width), size, approx: Math.round(approx), lh: cs.lineHeight });
  }
  return out;
});
console.log(JSON.stringify(rows, null, 2));
await browser.close();
