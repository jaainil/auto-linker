import type { AutoLinkOptions, AutoLinkResult } from '../types';
import { suggestLinks } from './suggest-links';
import { insertLinks } from '../insertion/html-inserter';
export function autoLink(options: AutoLinkOptions): AutoLinkResult {
  const result = suggestLinks(options);
  return { ...result, ...insertLinks(result.content, result.links) };
}
