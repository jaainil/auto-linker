import { expect, it } from 'vitest';
import { autoLink } from '../src';

it.each([
  { title: 'AI automation' },
  { title: 'Our capabilities', keywords: ['AI automation'] },
  { title: 'Our capabilities', headings: ['AI automation'] },
])('supports metadata without preferred anchors: %j', metadata => {
  const result = autoLink({ content: '<p>AI automation improves efficiency.</p>', pages: [{ url: 'https://example.com/ai', ...metadata }] });
  expect(result.links.map(l => l.anchor)).toEqual(['AI automation']);
});
it('uses content BM25 as a contextual ranking signal', () => {
  const options = { content: '<p>AI automation for hospital patient care.</p>', pages: [
    { url: 'https://example.com/retail', title: 'AI automation', anchors: ['AI automation'], content: 'Retail shopping store commerce.' },
    { url: 'https://example.com/health', title: 'AI automation', anchors: ['AI automation'], content: 'Hospital patient care medical treatment.' },
  ] };
  expect(autoLink(options).links[0].url).toBe('https://example.com/health');
});
it('avoids generic single-word anchors', () => {
  expect(autoLink({ content: '<p>Software helps our business.</p>', pages: [{ url: 'https://example.com/software', title: 'Software' }] }).links).toEqual([]);
});
it('handles an HTML document and base URL with existing entity-escaped links', () => {
  const html = '<!doctype html><html><head><base href="https://example.com/"></head><body><a href="/ai?a=1&amp;b=2">Previous</a><p>AI automation</p></body></html>';
  expect(autoLink({ content: html, pages: [{ url: 'https://example.com/ai?a=1&b=2', title: 'AI automation', anchors: ['AI automation'] }] }).links).toEqual([]);
});
it('keeps punctuation and CRLF source unchanged', () => {
  const html = '<p>AI automation\r\nworks.</p><p>Custom software.</p>';
  const result = autoLink({ content: html, pages: [{ url: 'https://example.com/ai', title: 'AI automation' }] });
  expect(result.content).toBe(html);
  expect(result.diagnostics.join(' ')).toContain('mapping');
});
it('does not mutate pages or options', () => {
  const page = Object.freeze({ url: 'https://example.com/ai', title: 'AI automation', anchors: Object.freeze(['AI automation']) });
  const options = Object.freeze({ content: '<p>AI automation</p>', pages: Object.freeze([page]) });
  expect(autoLink(options as unknown as Parameters<typeof autoLink>[0]).links).toHaveLength(1);
});
it('resolves existing links against a directory base before canonicalization', () => {
  const html = '<!doctype html><html><head><base href="https://example.com/docs/"></head><body><a href="ai">Existing</a><p>AI automation</p></body></html>';
  expect(autoLink({ content: html, pages: [{ url: 'https://example.com/docs/ai', title: 'AI automation' }] }).links).toEqual([]);
});
it('excludes hidden and interactive content containers', () => {
  const content = '<form><p>AI automation</p></form><div hidden>AI automation</div><div aria-hidden="true">AI automation</div><div role="unknown button">AI automation</div>';
  expect(autoLink({ content, pages: [{ url: 'https://example.com/ai', title: 'AI automation' }] }).links).toEqual([]);
});
