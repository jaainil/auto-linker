import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { autoLink, suggestLinks, removeInsertedLinks } from '../src/index';

const pages = [
  { url: 'https://example.com/ai', title: 'AI automation services', keywords: ['AI automation'], anchors: ['AI automation'] },
  { url: 'https://example.com/software', title: 'Custom software development', keywords: ['custom software'], anchors: ['custom software'] },
];
const content = '<p>AI automation helps. Custom software works.</p>';

describe('public API and required invariants', () => {
  it('inserts real opportunities and recovers the exact original (INV-01,12)', () => {
    const result = autoLink({ content, pages });
    expect(result.links).toHaveLength(2);
    expect(removeInsertedLinks(result)).toBe(content);
    for (const link of result.links) expect(content.slice(link.start, link.end)).toBe(link.anchor);
  });
  it('suggests without modifying source', () => {
    const result = suggestLinks({ content, pages });
    expect(result.content).toBe(content);
    expect(result.links).toEqual(autoLink({ content, pages }).links);
  });
  it.each(['a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code', 'pre', 'script', 'style', 'textarea', 'button', 'select', 'option', 'svg', 'math', 'template', 'title', 'iframe', 'label', 'summary'])('excludes %s (INV-02,03)', (tag) => {
    const html = `<${tag}>AI automation</${tag}><p>Custom software</p>`;
    const result = autoLink({ content: html, pages });
    expect(result.links.map(l => l.anchor)).toEqual(['Custom software']);
    expect(removeInsertedLinks(result)).toBe(html);
  });
  it('respects skip markers, interactive roles and contenteditable', () => {
    const html = '<div data-autolink-skip><p>AI automation</p></div><div role="button">AI automation</div><div contenteditable>AI automation</div>';
    expect(autoLink({ content: html, pages }).links).toEqual([]);
  });
  it('avoids self links (INV-04)', () => {
    expect(autoLink({ content, pages, currentUrl: 'https://example.com/ai/#here' }).links.map(l => l.url)).toEqual([pages[1].url]);
  });
  it('suppresses existing absolute and relative links (INV-05)', () => {
    const html = '<a href="/ai">Existing</a>' + content;
    expect(autoLink({ content: html, pages, currentUrl: 'https://example.com/post' }).links.map(l => l.url)).toEqual([pages[1].url]);
  });
  it('suppresses relative links conservatively without currentUrl', () => {
    expect(autoLink({ content: '<a href="/ai">Existing</a>' + content, pages }).links.map(l => l.url)).toEqual([pages[1].url]);
  });
  it('chooses no overlapping or duplicate destinations (INV-05,06,07)', () => {
    const result = autoLink({ content: '<p>AI automation services and AI automation.</p>', pages });
    expect(result.links).toHaveLength(1);
    expect(result.links[0].url).toBe(pages[0].url);
  });
  it('is deterministic and idempotent even at limits (INV-08,09)', () => {
    const options = { content, pages, maxLinks: 1 };
    const first = autoLink(options);
    expect(autoLink(options)).toEqual(first);
    const second = autoLink({ ...options, content: first.content, maxLinks: 5 });
    expect(second.content).toBe(first.content);
    expect(second.links).toEqual([]);
  });
  it('safely skips entity/CRLF mappings while retaining other nodes (INV-10)', () => {
    const html = '<p>AI&nbsp;automation &amp; custom software</p><p>😀 AI automation</p>';
    const result = autoLink({ content: html, pages });
    expect(result.links).toHaveLength(1);
    expect(result.links[0].anchor).toBe('AI automation');
    expect(removeInsertedLinks(result)).toBe(html);
  });
  it('handles Unicode matching without changing source', () => {
    const html = '<p>😀 Café numérique works.</p>';
    const result = autoLink({ content: html, pages: [{ url: 'https://example.com/cafe', title: 'Café numérique', anchors: ['café numérique'] }] });
    expect(result.links[0].anchor).toBe('Café numérique');
    expect(result.links[0].start).toBe(html.indexOf('Café'));
    expect(removeInsertedLinks(result)).toBe(html);
  });
  it.each(['javascript:alert(1)', 'data:text/html,evil', '/relative', 'ftp://example.com', 'https://user:pass@example.com'])('rejects unsafe or unsupported destination %s (INV-11)', (url) => {
    expect(() => autoLink({ content, pages: [{ url, title: 'AI automation' }] })).toThrow();
  });
  it('rejects invalid configuration predictably', () => {
    for (const value of [-1, 1.5, NaN, Infinity]) expect(() => autoLink({ content, pages, maxLinks: value })).toThrow();
    expect(() => autoLink({ content, pages, minScore: 2 })).toThrow();
    expect(autoLink({ content, pages, maxLinks: 0 }).links).toEqual([]);
  });
  it('deduplicates equivalent pages but reports metadata conflicts', () => {
    expect(autoLink({ content, pages: [pages[0], { ...pages[0], url: 'https://EXAMPLE.com:443/ai/#fragment' }] }).links).toHaveLength(1);
    expect(() => autoLink({ content, pages: [pages[0], { ...pages[0], title: 'Different' }] })).toThrow(/conflicting/i);
  });
  it('preserves supplied destination, path case, query and escapes attributes', () => {
    const url = 'https://example.com/AI?a=1&b=%22';
    const result = autoLink({ content, pages: [{ ...pages[0], url }], currentUrl: 'https://example.com/ai?a=1&b=%22' });
    expect(result.links[0].url).toBe(url);
    expect(result.content).toContain('href="https://example.com/AI?a=1&amp;b=%22"');
  });
  it('does not manufacture links to meet a count', () => {
    expect(autoLink({ content: '<p>Unrelated astronomy research.</p>', pages, maxLinks: 20 }).links).toEqual([]);
  });
  it('honors paragraph and article limits', () => {
    expect(autoLink({ content, pages, maxLinksPerParagraph: 1 }).links).toHaveLength(1);
    expect(autoLink({ content, pages, minScore: 1 }).links).toEqual([]);
  });
  it('does not join words across punctuation into a preferred phrase', () => {
    expect(autoLink({ content: '<p>AI. Automation.</p>', pages }).links).toEqual([]);
  });
  it('fails closed for malformed markup', () => {
    const html = '<p><b>AI automation</p></b>';
    expect(autoLink({ content: html, pages }).links).toEqual([]);
  });
  it('rejects modified output when reversing an audit', () => {
    const result = autoLink({ content, pages });
    expect(() => removeInsertedLinks({ ...result, content: result.content.replace('href=', 'oops=') })).toThrow();
  });
  it('preserves arbitrary Unicode input and generated destination provenance', () => {
    fc.assert(fc.property(fc.string(), (text) => {
      const html = `<p>${text.replace(/&/g, '&amp;').replace(/</g, '&lt;')} AI automation</p>`;
      const options = { content: html, pages };
      const result = autoLink(options);
      expect(removeInsertedLinks(result)).toBe(html);
      expect(autoLink(options)).toEqual(result);
      expect(autoLink({ ...options, content: result.content }).content).toBe(result.content);
      for (const link of result.links) expect(pages.map(p => p.url)).toContain(link.url);
    }), { numRuns: 150 });
  });
});
