import type { Candidate } from './candidates';
import type { AutoLinkOptions, LinkSuggestion } from '../types';
export function select(candidates: Candidate[], used: Set<string>, options: Required<Pick<AutoLinkOptions, 'maxLinks' | 'maxLinksPerParagraph' | 'minScore'>>): LinkSuggestion[] {
  const selected: Candidate[] = [];
  const counts = new Map<string, number>();
  candidates.sort((a, b) => b.score - a.score || (b.end - b.start) - (a.end - a.start) || a.start - b.start || (a.canonical < b.canonical ? -1 : a.canonical > b.canonical ? 1 : 0));
  for (const candidate of candidates) {
    if (selected.length >= options.maxLinks) break;
    if (candidate.score < options.minScore || used.has(candidate.canonical)) continue;
    if ((counts.get(candidate.paragraphId) ?? 0) >= options.maxLinksPerParagraph) continue;
    if (selected.some(link => candidate.start < link.end && candidate.end > link.start)) continue;
    selected.push(candidate); used.add(candidate.canonical);
    counts.set(candidate.paragraphId, (counts.get(candidate.paragraphId) ?? 0) + 1);
  }
  return selected.sort((a, b) => a.start - b.start).map(({ paragraphId, canonical, ...link }) => link);
}
