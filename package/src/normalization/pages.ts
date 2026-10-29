import type { LinkablePage } from '../types';
import { canonicalUrl } from './urls';
import { fold } from '../matching/tokenizer';
export function normalizePages(pages: LinkablePage[]): LinkablePage[] {
  const unique = new Map<string, { page: LinkablePage; metadata: string }>();
  for (const page of pages) {
    const key = canonicalUrl(page.url)!;
    const normalizedList = (values?: string[]) => [...new Set((values ?? []).map(fold))].sort();
    const metadata = JSON.stringify([fold(page.title), page.content ?? '', normalizedList(page.headings), normalizedList(page.keywords), normalizedList(page.anchors)]);
    const previous = unique.get(key);
    if (previous && previous.metadata !== metadata) throw new Error(`Conflicting metadata for destination: ${key}`);
    if (!previous) unique.set(key, { page, metadata });
  }
  return [...unique.values()].map(value => value.page);
}
