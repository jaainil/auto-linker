import { expect, it } from 'vitest';
import fc from 'fast-check';
import { autoLink, removeInsertedLinks } from '../src';

it('preserves arbitrary Unicode scalars including astral characters and malformed HTML', () => {
  const unicode = fc.array(fc.integer({ min: 0, max: 0x10ffff }), { maxLength: 40 }).map(points => String.fromCodePoint(...points));
  fc.assert(fc.property(unicode, text => {
    const content = `<p>${text} AI automation</p>`;
    const options = { content, pages: [{ url: 'https://example.com/ai', title: 'AI automation', anchors: ['AI automation'] }] };
    const result = autoLink(options);
    expect(removeInsertedLinks(result)).toBe(content);
    expect(autoLink(options)).toEqual(result);
    expect(autoLink({ ...options, content: result.content }).content).toBe(result.content);
    for (const link of result.links) expect(content.slice(link.start, link.end)).toBe(link.anchor);
  }), { numRuns: 200 });
});
it('enforces limits and uniqueness over repeated opportunities across paragraphs', () => {
  fc.assert(fc.property(fc.integer({ min: 1, max: 8 }), fc.integer({ min: 0, max: 5 }), fc.integer({ min: 0, max: 3 }), (paragraphs, maxLinks, maxLinksPerParagraph) => {
    const content = '<p>AI automation and Custom software. AI automation again.</p>'.repeat(paragraphs);
    const pages = [
      { url: 'https://example.com/ai', title: 'AI automation', anchors: ['AI automation'] },
      { url: 'https://example.com/software', title: 'Custom software', anchors: ['custom software'] },
    ];
    const options = { content, pages, maxLinks, maxLinksPerParagraph };
    const result = autoLink(options);
    expect(result.links.length).toBeLessThanOrEqual(maxLinks);
    expect(new Set(result.links.map(l => l.url)).size).toBe(result.links.length);
    for (let i = 1; i < result.links.length; i++) expect(result.links[i].start).toBeGreaterThanOrEqual(result.links[i - 1].end);
    for (let paragraph = 0; paragraph < paragraphs; paragraph++) {
      const start = paragraph * (content.length / paragraphs);
      const end = start + content.length / paragraphs;
      expect(result.links.filter(l => l.start >= start && l.start < end).length).toBeLessThanOrEqual(maxLinksPerParagraph);
    }
    expect(removeInsertedLinks(result)).toBe(content);
    expect(autoLink({ ...options, content: result.content }).content).toBe(result.content);
  }), { numRuns: 100 });
});
