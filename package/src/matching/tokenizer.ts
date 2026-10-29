export function fold(text: string): string { return text.normalize('NFC').toLowerCase().replace(/\s+/gu, ' ').trim(); }
export interface Token { norm: string; start: number; end: number }
export function tokenize(text: string): Token[] {
  if (typeof Intl.Segmenter === 'function') {
    const segmenter = new Intl.Segmenter('en', { granularity: 'word' });
    return [...segmenter.segment(text)].filter(s => s.isWordLike).map(s => ({ norm: fold(s.segment), start: s.index, end: s.index + s.segment.length }));
  }
  return [...text.matchAll(/[\p{L}\p{N}][\p{L}\p{M}\p{N}'’_-]*/gu)].map(m => ({ norm: fold(m[0]), start: m.index!, end: m.index! + m[0].length }));
}
export const STOP = new Set('a an and are as at be been but by can could do for from has have how in is it its of on or our that the their these this to was we were which will with would you your'.split(' '));
export const GENERIC = new Set('business businesses company companies content here learn more operations process processes read solution solutions software team teams work workflow workflows'.split(' '));
export function words(text: string): string[] { return tokenize(text).map(t => t.norm); }
export function meaningful(text: string): string[] { return words(text).filter(t => !STOP.has(t)); }
