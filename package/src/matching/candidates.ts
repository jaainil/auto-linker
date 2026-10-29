import type { LinkablePage, LinkSuggestion, TextSegment } from '../types';
import { createBM25 } from './bm25';
import { GENERIC, meaningful, STOP, tokenize, words } from './tokenizer';
export interface Candidate extends LinkSuggestion { paragraphId: string; canonical: string }
import { canonicalUrl } from '../normalization/urls';
function similarity(query: string[], value: string): number {
  const target = new Set(meaningful(value));
  const q = new Set(query);
  if (!q.size || !target.size) return 0;
  return [...q].filter(t => target.has(t)).length / new Set([...q, ...target]).size;
}
export function candidates(segments: TextSegment[], pages: LinkablePage[]): Candidate[] {
  const bm25 = createBM25(pages.map(page => meaningful(page.content ?? '')));
  const prepared = pages.map(page => ({ page, anchors: new Set((page.anchors ?? []).map(a => words(a).join(' '))) }));
  // Look up destinations by metadata phrase before scoring. In particular,
  // unrelated source n-grams must not tokenize every destination repeatedly.
  const phraseIndex = new Map<string, Set<number>>();
  const add = (key: string, index: number) => {
    const matches = phraseIndex.get(key) ?? new Set<number>();
    matches.add(index); phraseIndex.set(key, matches);
  };
  prepared.forEach(({ page, anchors }, index) => {
    for (const anchor of anchors) add(anchor, index);
    for (const value of [page.title, ...(page.headings ?? []), ...(page.keywords ?? [])]) {
      const tokens = words(value);
      for (let start = 0; start < tokens.length; start++) {
        for (let length = 1; length <= 6 && start + length <= tokens.length; length++) add(tokens.slice(start, start + length).join(' '), index);
      }
    }
  });
  const result: Candidate[] = [];
  for (const segment of segments) {
    const tokens = tokenize(segment.text);
    for (let i = 0; i < tokens.length; i++) for (let length = 1; length <= 6 && i + length <= tokens.length; length++) {
      const slice = tokens.slice(i, i + length);
      if (slice.some((token, n) => n > 0 && !/^\s+$/u.test(segment.text.slice(slice[n - 1].end, token.start)))) continue;
      const key = slice.map(t => t.norm).join(' ');
      if (GENERIC.has(key)) continue;
      const matches = phraseIndex.get(key);
      if (!matches) continue;
      const terms = slice.map(t => t.norm).filter(t => !STOP.has(t));
      if (!terms.length) continue;
      matches.forEach(index => {
        const { page, anchors } = prepared[index];
        const explicit = anchors.has(key);
        const title = similarity(terms, page.title);
        const heading = Math.max(0, ...(page.headings ?? []).map(h => similarity(terms, h)));
        const keyword = Math.max(0, ...(page.keywords ?? []).map(k => similarity(terms, k)));
        // Content relevance alone cannot justify an anchor.
        if (!explicit && !title && !heading && !keyword) return;
        const bm = bm25(index, meaningful(segment.context));
        const availableWeight = 0.25 + (anchors.size ? 0.35 : 0) + (page.headings?.length ? 0.15 : 0) + (page.keywords?.length ? 0.15 : 0) + (page.content?.trim() ? 0.1 : 0);
        let score = (0.35 * Number(explicit) + 0.25 * title + 0.15 * heading + 0.15 * keyword + 0.1 * bm / (bm + 3.5)) / availableWeight;
        if (!explicit && length === 1) score -= 0.2;
        if (STOP.has(slice[0].norm) || STOP.has(slice.at(-1)!.norm)) score -= 0.1;
        if (length > 4 && !explicit) score -= 0.04;
        const start = segment.start + slice[0].start;
        const end = segment.start + slice.at(-1)!.end;
        result.push({ anchor: segment.text.slice(slice[0].start, slice.at(-1)!.end), url: page.url, start, end,
          score: Math.max(0, Math.min(1, score)), reason: [explicit ? 'preferred anchor' : '', title ? 'title similarity' : '', heading ? 'heading similarity' : '', keyword ? 'keyword similarity' : '', bm ? 'BM25 context' : ''].filter(Boolean).join(', '),
          paragraphId: segment.paragraphId, canonical: canonicalUrl(page.url)!,
        });
      });
    }
  }
  const groups = new Map<string, Candidate[]>();
  for (const candidate of result) {
    const key = `${candidate.start}:${candidate.end}`;
    const group = groups.get(key) ?? [];
    group.push(candidate); groups.set(key, group);
  }
  for (const group of groups.values()) {
    group.sort((a, b) => b.score - a.score);
    if (group.length > 1 && group[0].score - group[1].score < 0.05) for (const candidate of group) {
      candidate.score = Math.max(0, candidate.score - 0.1); candidate.reason += ', ambiguous destination';
    }
  }
  return result;
}
