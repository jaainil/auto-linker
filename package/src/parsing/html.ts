import { parse, parseFragment, type DefaultTreeAdapterMap } from 'parse5';
import type { TextSegment } from '../types';
type Node = DefaultTreeAdapterMap['node'];
const EXCLUDED = new Set('a h1 h2 h3 h4 h5 h6 code pre script style textarea button select option optgroup svg math title head template iframe object embed audio video canvas label summary details input meter progress noscript xmp plaintext form dialog menu nav'.split(' '));
const BLOCK = new Set('p div li section article blockquote td th dd dt figcaption header footer aside main'.split(' '));
const INTERACTIVE = new Set('button link checkbox radio switch textbox combobox listbox menu menuitem option slider spinbutton tab tree treeitem'.split(' '));
const OPTIONAL_END = new Set('html head body p li dt dd rt rp optgroup option colgroup thead tbody tfoot tr td th'.split(' '));
const VOID = new Set('area base br col embed hr img input link meta param source track wbr'.split(' '));
export const MARKER = 'juhenza-v1';
export function parseSource(content: string) {
  const diagnostics: string[] = [];
  const errors: string[] = [];
  const opts = { sourceCodeLocationInfo: true, onParseError: (error: { code: string }) => { if (error.code !== 'missing-doctype') errors.push(error.code); } };
  const document = /<!doctype|<html[\s>]|<head[\s>]|<body[\s>]/i.test(content) ? parse(content, opts) : parseFragment(content, opts);
  const segments: TextSegment[] = [];
  const hrefs: string[] = [];
  let base: string | undefined;
  let processed = false;
  function walk(node: Node, skip: boolean, paragraph: string) {
    if ('tagName' in node) {
      const location = node.sourceCodeLocation;
      if (location?.startTag && !location.endTag && !OPTIONAL_END.has(node.tagName) && !VOID.has(node.tagName) && node.namespaceURI === 'http://www.w3.org/1999/xhtml') {
        errors.push(`unverified-end-tag:${node.tagName}`);
      }
      const attrs = new Map(node.attrs.map(a => [a.name, a.value]));
      if (node.tagName === 'base' && base === undefined && attrs.has('href')) base = attrs.get('href');
      if (node.tagName === 'a') {
        if (attrs.has('href')) hrefs.push(attrs.get('href')!);
        if (attrs.get('data-autolink') === MARKER) processed = true;
      }
      skip ||= EXCLUDED.has(node.tagName) || attrs.has('data-autolink-skip') || attrs.has('contenteditable') || attrs.has('tabindex') || attrs.has('hidden') || attrs.get('aria-hidden')?.toLowerCase() === 'true' || (attrs.get('role')?.toLowerCase().split(/\s+/).some(role => INTERACTIVE.has(role)) ?? false);
      if (BLOCK.has(node.tagName)) paragraph = `p${node.sourceCodeLocation?.startOffset ?? paragraph}`;
    }
    if (node.nodeName === '#text' && 'value' in node && !skip) {
      const loc = node.sourceCodeLocation;
      if (loc && node.value.trim()) {
        const raw = content.slice(loc.startOffset, loc.endOffset);
        if (raw === node.value) segments.push({ text: raw, start: loc.startOffset, end: loc.endOffset, paragraphId: paragraph, context: raw });
        else diagnostics.push(`Skipped text at ${loc.startOffset}: decoded or normalized source mapping.`);
      }
    }
    if ('childNodes' in node) for (const child of node.childNodes) walk(child, skip, paragraph);
    // Template contents never contribute eligible text, but existing anchors still need auditing.
    if ('content' in node && typeof node.content === 'object' && node.content) walk(node.content as Node, true, paragraph);
  }
  walk(document, false, 'p0');
  if (errors.length) {
    diagnostics.push(`Skipped malformed HTML: ${[...new Set(errors)].join(', ')}.`);
    segments.length = 0;
  }
  if (processed) diagnostics.push('Article already contains JUHENZA generated links; reverse the prior audit before reprocessing.');
  return { segments, hrefs, base, processed, diagnostics };
}
