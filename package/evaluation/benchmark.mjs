import { performance } from 'node:perf_hooks';
import { autoLink } from '../dist/index.js';
const pages = Array.from({ length: 100 }, (_, index) => ({ url: `https://example.com/topic-${index}`, title: `Topic ${index} services`, anchors: [`Topic ${index}`], keywords: [`Topic ${index}`] }));
const content = `<p>${'Unrelated ordinary filler words. '.repeat(200)} Topic 42.</p>`;
const start = performance.now();
const result = autoLink({ content, pages });
console.log(JSON.stringify({ dataset: 'synthetic sparse-match article', pages: 100, approximateWords: 802, links: result.links.length, elapsedMs: performance.now() - start }, null, 2));
if (result.links.length !== 1 || result.links[0].url !== pages[42].url) process.exitCode = 1;
