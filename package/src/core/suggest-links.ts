import type { AutoLinkOptions, AutoLinkResult } from '../types';
import { optionsSchema } from '../normalization/options';
import { normalizePages } from '../normalization/pages';
import { canonicalUrl, relativeKey } from '../normalization/urls';
import { parseSource } from '../parsing/html';
import { candidates } from '../matching/candidates';
import { select } from '../matching/conflicts';
export function suggestLinks(input: AutoLinkOptions): AutoLinkResult {
  const options = optionsSchema.parse(input);
  const pages = normalizePages(options.pages);
  const parsed = parseSource(options.content);
  const result: AutoLinkResult = { content: options.content, links: [], skipped: 0, diagnostics: parsed.diagnostics, insertions: [] };
  if (parsed.processed) return result;
  const used = new Set<string>();
  const current = options.currentUrl && canonicalUrl(options.currentUrl);
  if (current) used.add(current);
  // Resolution must retain a directory's trailing slash; canonicalization is
  // only for comparing the final destination, never the resolution base.
  let base = options.currentUrl;
  if (parsed.base !== undefined) {
    try {
      const resolved = new URL(parsed.base, options.currentUrl);
      if (/^https?:$/.test(resolved.protocol)) base = resolved.href;
    } catch { /* An unresolvable base cannot improve destination discovery. */ }
  }
  for (const href of parsed.hrefs) {
    const canonical = canonicalUrl(href, base);
    if (canonical) used.add(canonical);
    else if (!base) for (const page of pages) {
      if (relativeKey(href, page.url) === relativeKey(page.url, page.url)) used.add(canonicalUrl(page.url)!);
    }
  }
  const scored = candidates(parsed.segments, pages);
  result.links = select(scored, used, options);
  result.skipped = scored.length - result.links.length;
  if (result.skipped) result.diagnostics.push(`${result.skipped} candidates skipped by relevance, overlap, existing/self destination, or link limits.`);
  return result;
}
