import type { AutoLinkResult, Insertion, LinkSuggestion } from '../types';
import { validHttpUrl } from '../normalization/urls';
import { MARKER } from '../parsing/html';
function escapeAttr(value: string) { return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
export function insertLinks(content: string, links: LinkSuggestion[]) {
  const insertions: Insertion[] = [];
  let output = ''; let cursor = 0;
  for (const link of links) {
    if (!validHttpUrl(link.url) || link.start < cursor || link.end <= link.start || content.slice(link.start, link.end) !== link.anchor) throw new Error('Invalid link source mapping');
    output += content.slice(cursor, link.start);
    const open = `<a href="${escapeAttr(link.url)}" data-autolink="${MARKER}">`;
    insertions.push({ offset: output.length, markup: open });
    output += open + link.anchor;
    insertions.push({ offset: output.length, markup: '</a>' });
    output += '</a>'; cursor = link.end;
  }
  output += content.slice(cursor);
  return { content: output, insertions };
}
export function removeInsertedLinks(result: Pick<AutoLinkResult, 'content' | 'insertions'>): string {
  let output = result.content;
  const sorted = [...result.insertions].sort((a, b) => b.offset - a.offset);
  let boundary = output.length;
  for (const { offset, markup } of sorted) {
    if (!Number.isInteger(offset) || offset < 0 || !markup || offset + markup.length > boundary || output.slice(offset, offset + markup.length) !== markup) throw new Error('Insertion audit does not match output');
    output = output.slice(0, offset) + output.slice(offset + markup.length);
    boundary = offset;
  }
  return output;
}
