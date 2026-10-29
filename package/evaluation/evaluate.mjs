import { readFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { autoLink, removeInsertedLinks } from '../dist/index.js';

const articles = JSON.parse(readFileSync(new URL('./articles/smoke.json', import.meta.url), 'utf8'));
let generated = 0, approved = 0, hits = 0, covered = 0, violations = 0, forbidden = 0;
const key = pair => `${pair.anchor}\u0000${pair.url}`;
const started = performance.now();
for (const article of articles) {
  const options = { content: article.content, pages: article.pages };
  const result = autoLink(options);
  const allowed = new Set(article.approved.map(key));
  const prohibited = new Set(article.forbidden.map(key));
  generated += result.links.length;
  approved += article.approved.length;
  hits += result.links.filter(link => allowed.has(key(link))).length;
  forbidden += result.links.filter(link => prohibited.has(key(link))).length;
  covered += Number(result.links.length > 0);
  if (removeInsertedLinks(result) !== article.content) violations++;
  if (JSON.stringify(autoLink(options)) !== JSON.stringify(result)) violations++;
  if (autoLink({ ...options, content: result.content }).content !== result.content) violations++;
  if (new Set(result.links.map(link => link.url)).size !== result.links.length) violations++;
  for (let i = 0; i < result.links.length; i++) {
    const link = result.links[i];
    if (article.content.slice(link.start, link.end) !== link.anchor || !article.pages.some(page => page.url === link.url)) violations++;
    if (i && result.links[i - 1].end > link.start) violations++;
  }
}
console.log(JSON.stringify({ dataset: '5 authored synthetic smoke fixtures; not real-world precision evidence', articles: articles.length, generated, precision: generated ? hits / generated : null, recall: approved ? hits / approved : null, yield: generated / articles.length, coverage: covered / articles.length, checkedInvariantViolations: violations, forbiddenLinks: forbidden, elapsedMs: performance.now() - started }, null, 2));
if (violations || forbidden || hits !== generated || hits !== approved) process.exitCode = 1;
