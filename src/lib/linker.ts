/**
 * Reference implementation of the v0.1 selection + insertion rules.
 * Runs entirely in the browser on authored sample content.
 * Not the published package.
 */

export interface LinkablePage {
  url: string;
  title: string;
  content?: string;
  headings?: string[];
  keywords?: string[];
  anchors?: string[];
}

export interface LinkSuggestion {
  anchor: string;
  url: string;
  pageTitle: string;
  start: number;
  end: number;
  score: number;
  reason: string;
  paragraphId: string;
}

export interface AutoLinkOptions {
  content: string;
  pages: LinkablePage[];
  maxLinks?: number;
  maxLinksPerParagraph?: number;
  minScore?: number;
  mode?: 'insert' | 'suggest';
}

export interface AutoLinkResult {
  content: string;
  links: LinkSuggestion[];
  candidates: number;
  skipped: number;
  diagnostics: string[];
  elapsed: number;
}

interface Token {
  raw: string;
  norm: string;
  start: number;
  end: number;
}

interface Segment {
  text: string;
  start: number;
  end: number;
  paragraphId: string;
}

interface ParsedSource {
  segments: Segment[];
  existingUrls: string[];
  diagnostics: string[];
}

const EXCLUDED = new Set([
  'a',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'code',
  'pre',
  'script',
  'style',
  'textarea',
  'button',
  'select',
  'option',
  'svg',
  'math',
  'title',
  'head',
  'template',
]);

const RAW_TEXT = new Set(['script', 'style', 'textarea', 'title']);

const VOID = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

const BLOCK = new Set([
  'p',
  'div',
  'li',
  'section',
  'article',
  'blockquote',
  'td',
  'th',
  'dd',
  'dt',
  'figcaption',
  'header',
  'footer',
  'aside',
  'main',
]);

const STOP = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'been',
  'but',
  'by',
  'can',
  'could',
  'did',
  'do',
  'does',
  'for',
  'from',
  'had',
  'has',
  'have',
  'how',
  'i',
  'if',
  'in',
  'into',
  'is',
  'it',
  'its',
  'may',
  'might',
  'more',
  'most',
  'must',
  'my',
  'no',
  'not',
  'of',
  'on',
  'or',
  'our',
  'out',
  'over',
  'should',
  'so',
  'some',
  'such',
  'than',
  'that',
  'the',
  'their',
  'them',
  'then',
  'there',
  'these',
  'they',
  'this',
  'those',
  'to',
  'too',
  'under',
  'up',
  'very',
  'was',
  'we',
  'were',
  'what',
  'when',
  'where',
  'which',
  'while',
  'who',
  'why',
  'will',
  'with',
  'would',
  'you',
  'your',
]);

const GENERIC = new Set([
  'business',
  'businesses',
  'company',
  'companies',
  'content',
  'here',
  'learn',
  'more',
  'operations',
  'process',
  'processes',
  'read',
  'solution',
  'solutions',
  'software',
  'team',
  'teams',
  'work',
  'workflow',
  'workflows',
]);

const WORD_RE = /[\p{L}\p{N}][\p{L}\p{N}'’_-]*/gu;

function fold(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase();
}

function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  WORD_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = WORD_RE.exec(text)) !== null) {
    const raw = match[0];
    const norm = fold(raw).replace(/[’']/g, "'").replace(/-+$/, '');
    if (!norm) continue;
    tokens.push({ raw, norm, start: match.index, end: match.index + raw.length });
  }
  return tokens;
}

function contentTokens(text: string): string[] {
  return tokenize(text)
    .map((token) => token.norm)
    .filter((token) => !STOP.has(token));
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function canonicalUrl(href: string): string | null {
  try {
    const url = new URL(href, 'https://example.com/');
    return `${url.host}${url.pathname.replace(/\/+$/, '') || '/'}`.toLowerCase();
  } catch {
    return null;
  }
}

function findTagEnd(html: string, start: number): number {
  let quote = '';
  for (let i = start + 1; i < html.length; i += 1) {
    const char = html[i];
    if (quote) {
      if (char === quote) quote = '';
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === '>') return i;
  }
  return html.length - 1;
}

function parseSource(html: string): ParsedSource {
  const segments: Segment[] = [];
  const existingUrls: string[] = [];
  const diagnostics: string[] = [];
  let entitySpans = 0;
  let skippedRegions = 0;

  interface Frame {
    name: string;
    skip: boolean;
    paragraph: number | null;
  }

  const stack: Frame[] = [];
  let paragraphCounter = 0;
  let i = 0;

  const currentParagraph = (): string => {
    for (let s = stack.length - 1; s >= 0; s -= 1) {
      const frame = stack[s];
      if (frame.paragraph !== null) return `p${frame.paragraph}`;
    }
    return 'p0';
  };

  const isSkipped = (): boolean => stack.some((frame) => frame.skip || EXCLUDED.has(frame.name));

  const handleText = (text: string, start: number, end: number) => {
    if (!text.trim()) return;
    if (isSkipped()) return;
    if (/&[#a-zA-Z0-9]+;/.test(text)) {
      entitySpans += 1;
      return;
    }
    segments.push({ text, start, end, paragraphId: currentParagraph() });
  };

  while (i < html.length) {
    const lt = html.indexOf('<', i);
    const textEnd = lt === -1 ? html.length : lt;
    if (textEnd > i) handleText(html.slice(i, textEnd), i, textEnd);
    if (lt === -1) break;

    if (html.startsWith('<!--', lt)) {
      const close = html.indexOf('-->', lt + 4);
      i = close === -1 ? html.length : close + 3;
      continue;
    }

    if (html.startsWith('<!', lt) || html.startsWith('<?', lt)) {
      const close = html.indexOf('>', lt);
      i = close === -1 ? html.length : close + 1;
      continue;
    }

    const gt = findTagEnd(html, lt);
    const tagText = html.slice(lt, gt + 1);
    const nameMatch = tagText.match(/^<\s*\/?\s*([a-zA-Z][a-zA-Z0-9:-]*)/);
    if (!nameMatch) {
      i = gt + 1;
      continue;
    }

    const name = nameMatch[1].toLowerCase();
    const closing = /^<\s*\//.test(tagText);
    const selfClosing = /\/\s*>$/.test(tagText);

    if (closing) {
      for (let s = stack.length - 1; s >= 0; s -= 1) {
        if (stack[s].name === name) {
          if (stack[s].skip) skippedRegions += 1;
          stack.length = s;
          break;
        }
      }
      i = gt + 1;
      continue;
    }

    if (name === 'a') {
      const hrefMatch = tagText.match(/\shref\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i);
      const href = hrefMatch ? hrefMatch[2] ?? hrefMatch[3] ?? hrefMatch[4] : '';
      const canonical = href ? canonicalUrl(href) : null;
      if (canonical) existingUrls.push(canonical);
    }

    if (RAW_TEXT.has(name) && !selfClosing) {
      const closeRe = new RegExp(`</\\s*${name}\\s*>`, 'i');
      closeRe.lastIndex = gt + 1;
      const rest = html.slice(gt + 1);
      const closeMatch = closeRe.exec(rest);
      i = closeMatch ? gt + 1 + closeMatch.index + closeMatch[0].length : html.length;
      continue;
    }

    if (VOID.has(name) || selfClosing) {
      i = gt + 1;
      continue;
    }

    let paragraph: number | null = null;
    if (BLOCK.has(name)) {
      paragraphCounter += 1;
      paragraph = paragraphCounter;
    }

    stack.push({
      name,
      skip: /\sdata-autolink-skip(?:\s|=|>|\/)/i.test(tagText),
      paragraph,
    });

    i = gt + 1;
  }

  if (entitySpans > 0) {
    diagnostics.push(`${entitySpans} text span${entitySpans === 1 ? '' : 's'} skipped: HTML entity offsets cannot be trusted.`);
  }
  if (skippedRegions > 0) {
    diagnostics.push(`${skippedRegions} skip-marked region${skippedRegions === 1 ? '' : 's'} respected.`);
  }

  return { segments, existingUrls, diagnostics };
}

interface Corpus {
  pages: LinkablePage[];
  anchors: Set<string>[];
  titles: Set<string>[];
  headings: Set<string>[];
  keywords: Set<string>[];
  docs: string[][];
  docLengths: number[];
  avgLength: number;
  df: Map<string, number>;
  phrases: Map<string, number[]>;
}

function phraseTokens(value: string): string[] {
  return tokenize(value)
    .map((token) => token.norm)
    .filter(Boolean);
}

function addPhrase(map: Map<string, number[]>, phrase: string, index: number) {
  const tokens = phraseTokens(phrase);
  if (!tokens.length || tokens.length > 6) return;
  const key = tokens.join(' ');
  const list = map.get(key) ?? [];
  if (!list.includes(index)) list.push(index);
  map.set(key, list);
}

function addNgrams(map: Map<string, number[]>, value: string, index: number, min: number, max: number, skipStop = true) {
  const tokens = phraseTokens(value);
  for (let start = 0; start < tokens.length; start += 1) {
    for (let length = min; length <= max && start + length <= tokens.length; length += 1) {
      const slice = tokens.slice(start, start + length);
      if (skipStop && slice.every((token) => STOP.has(token))) continue;
      addPhrase(map, slice.join(' '), index);
    }
  }
}

function buildCorpus(pages: LinkablePage[]): Corpus {
  const corpus: Corpus = {
    pages,
    anchors: [],
    titles: [],
    headings: [],
    keywords: [],
    docs: [],
    docLengths: [],
    avgLength: 0,
    df: new Map(),
    phrases: new Map(),
  };

  pages.forEach((page, index) => {
    const anchorSet = new Set<string>();
    (page.anchors ?? []).forEach((anchor) => {
      const key = phraseTokens(anchor).join(' ');
      if (key) anchorSet.add(key);
      addPhrase(corpus.phrases, anchor, index);
    });

    const titleSet = new Set(contentTokens(page.title));
    addNgrams(corpus.phrases, page.title, index, 1, 4);

    const headingSet = new Set<string>();
    (page.headings ?? []).forEach((heading) => {
      contentTokens(heading).forEach((token) => headingSet.add(token));
      addPhrase(corpus.phrases, heading, index);
      addNgrams(corpus.phrases, heading, index, 1, 4);
    });

    const keywordSet = new Set<string>();
    (page.keywords ?? []).forEach((keyword) => {
      contentTokens(keyword).forEach((token) => keywordSet.add(token));
      addPhrase(corpus.phrases, keyword, index);
    });

    const doc = [
      page.title,
      page.content ?? '',
      (page.headings ?? []).join(' '),
      (page.keywords ?? []).join(' '),
      (page.anchors ?? []).join(' '),
    ]
      .flatMap((part) => phraseTokens(part))
      .filter((token) => !STOP.has(token));

    corpus.anchors.push(anchorSet);
    corpus.titles.push(titleSet);
    corpus.headings.push(headingSet);
    corpus.keywords.push(keywordSet);
    corpus.docs.push(doc);
    corpus.docLengths.push(doc.length);
    new Set(doc).forEach((token) => corpus.df.set(token, (corpus.df.get(token) ?? 0) + 1));
  });

  corpus.avgLength = corpus.docLengths.reduce((sum, length) => sum + length, 0) / Math.max(1, corpus.docLengths.length);
  return corpus;
}

function bm25(corpus: Corpus, pageIndex: number, query: string[]): number {
  const doc = corpus.docs[pageIndex];
  const length = corpus.docLengths[pageIndex];
  const k1 = 1.2;
  const b = 0.75;
  const counts = new Map<string, number>();
  doc.forEach((token) => counts.set(token, (counts.get(token) ?? 0) + 1));

  let score = 0;
  new Set(query).forEach((term) => {
    const frequency = counts.get(term) ?? 0;
    if (!frequency) return;
    const df = corpus.df.get(term) ?? 0;
    const idf = Math.log(1 + (corpus.pages.length - df + 0.5) / (df + 0.5));
    score += idf * ((frequency * (k1 + 1)) / (frequency + k1 * (1 - b + (b * length) / corpus.avgLength)));
  });
  return score;
}

function coverage(candidate: string[], target: Set<string>): number {
  if (!candidate.length || !target.size) return 0;
  let hits = 0;
  candidate.forEach((token) => {
    if (target.has(token)) hits += 1;
  });
  return hits / candidate.length;
}

function jaccard(candidate: string[], target: Set<string>): number {
  if (!candidate.length || !target.size) return 0;
  const union = new Set([...candidate, ...target]);
  let intersection = 0;
  candidate.forEach((token) => {
    if (target.has(token)) intersection += 1;
  });
  return intersection / union.size;
}

interface ScoredCandidate {
  suggestion: LinkSuggestion;
  key: string;
  pageIndex: number;
  score: number;
}

export function autoLink(options: AutoLinkOptions): AutoLinkResult {
  const started = performance.now();
  const {
    content,
    pages,
    maxLinks = 4,
    maxLinksPerParagraph = 2,
    minScore = 0.52,
    mode = 'insert',
  } = options;

  const parsed = parseSource(content);
  const corpus = buildCorpus(pages);
  const diagnostics = [...parsed.diagnostics];
  const scored: ScoredCandidate[] = [];

  parsed.segments.forEach((segment) => {
    const tokens = tokenize(segment.text);
    if (!tokens.length) return;

    for (let start = 0; start < tokens.length; start += 1) {
      const maxLength = Math.min(6, tokens.length - start);
      for (let length = 1; length <= maxLength; length += 1) {
        const slice = tokens.slice(start, start + length);
        const key = slice.map((token) => token.norm).join(' ');
        const pageIndexes = corpus.phrases.get(key);
        if (!pageIndexes) continue;

        const phrase = contentTokens(slice.map((token) => token.raw).join(' '));
        if (!phrase.length) continue;

        pageIndexes.forEach((pageIndex) => {
          const page = pages[pageIndex];
          const anchor = corpus.anchors[pageIndex].has(key) ? 1 : 0;
          const title = coverage(phrase, corpus.titles[pageIndex]);
          const heading = corpus.headings[pageIndex].size
            ? Math.max(
                ...(page.headings ?? []).map((value) => coverage(phrase, new Set(contentTokens(value)))),
                0,
              )
            : 0;
          const keyword = Math.max(
            ...(page.keywords ?? []).map((value) => jaccard(phrase, new Set(contentTokens(value)))),
            0,
          );
          const relevance = bm25(corpus, pageIndex, phrase);
          const bm25Normalized = relevance / (relevance + 3.5);

          let score =
            anchor * 0.35 + title * 0.25 + heading * 0.15 + keyword * 0.15 + bm25Normalized * 0.1;


          const first = phrase[0];
          const last = phrase[phrase.length - 1];
          if (GENERIC.has(key) || (phrase.length === 1 && GENERIC.has(phrase[0]))) score -= 0.24;
          if (phrase.length === 1 && !anchor) score -= 0.24;
          if (!anchor && (STOP.has(first) || STOP.has(last))) score -= 0.05;
          if (!anchor && phrase.length > 4) score -= 0.04;
          if (phrase.every((token) => STOP.has(token))) score -= 0.4;

          score = Math.max(0, Math.min(1, score));

          const reasons: string[] = [];
          if (anchor) reasons.push('preferred anchor');
          if (title >= 0.99) reasons.push('title exact');
          else if (title >= 0.5) reasons.push(`title ${Math.round(title * 100)}%`);
          if (heading >= 0.99) reasons.push('heading exact');
          if (keyword >= 0.99) reasons.push('keyword exact');
          if (bm25Normalized >= 0.3) reasons.push(`BM25 ${(bm25Normalized * 10).toFixed(1)}`);

          const anchorText = content.slice(segment.start + slice[0].start, segment.start + slice[slice.length - 1].end);

          scored.push({
            key,
            pageIndex,
            score,
            suggestion: {
              anchor: anchorText,
              url: page.url,
              pageTitle: page.title,
              start: segment.start + slice[0].start,
              end: segment.start + slice[slice.length - 1].end,
              score,
              reason: reasons.length ? reasons.join(' · ') : 'context overlap',
              paragraphId: segment.paragraphId,
            },
          });
        });
      }
    }
  });

  const byKey = new Map<string, ScoredCandidate[]>();
  scored.forEach((candidate) => {
    const group = `${candidate.key}@${candidate.suggestion.start}`;
    const list = byKey.get(group) ?? [];
    list.push(candidate);
    byKey.set(group, list);
  });
  byKey.forEach((list) => {
    list.sort((a, b) => b.score - a.score);
    if (list.length > 1 && list[0].score - list[1].score < 0.05) {
      list.forEach((candidate) => {
        candidate.score = Math.max(0, candidate.score - 0.07);
        candidate.suggestion.score = candidate.score;
        candidate.suggestion.reason += ' · ambiguous';
      });
    }
  });

  const eligible = scored.filter((candidate) => candidate.score >= minScore);
  const belowThreshold = scored.length - eligible.length;
  eligible.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.suggestion.anchor.length - a.suggestion.anchor.length;
  });

  const usedUrls = new Set(parsed.existingUrls);
  const usedAnchors = new Set<string>();
  const chosen: LinkSuggestion[] = [];
  let conflictSkips = 0;

  for (const candidate of eligible) {
    if (chosen.length >= maxLinks) break;
    const suggestion = candidate.suggestion;
    const canonical = canonicalUrl(suggestion.url);
    const paragraphCount = chosen.filter((link) => link.paragraphId === suggestion.paragraphId).length;
    const overlaps = chosen.some((link) => suggestion.start < link.end && suggestion.end > link.start);

    if (usedAnchors.has(candidate.key)) {
      conflictSkips += 1;
      continue;
    }
    if (canonical && usedUrls.has(canonical)) {
      conflictSkips += 1;
      continue;
    }
    if (paragraphCount >= maxLinksPerParagraph) {
      conflictSkips += 1;
      continue;
    }
    if (overlaps) {
      conflictSkips += 1;
      continue;
    }

    chosen.push(suggestion);
    usedAnchors.add(candidate.key);
    if (canonical) usedUrls.add(canonical);
  }

  chosen.sort((a, b) => a.start - b.start);

  if (conflictSkips > 0) diagnostics.push(`${conflictSkips} candidate${conflictSkips === 1 ? '' : 's'} dropped by overlap, paragraph, or duplicate-destination rules.`);
  if (belowThreshold > 0) diagnostics.push(`${belowThreshold} candidate${belowThreshold === 1 ? '' : 's'} below the ${minScore.toFixed(2)} relevance floor.`);
  if (chosen.length >= maxLinks) diagnostics.push(`Maximum of ${maxLinks} links reached.`);

  let output = content;
  const ordered = [...chosen].sort((a, b) => b.start - a.start);
  ordered.forEach((link) => {
    const open =
      mode === 'suggest'
        ? '<span data-autolink="suggest">'
        : `<a href="${escapeAttr(link.url)}" data-autolink="true">`;
    const close = mode === 'suggest' ? '</span>' : '</a>';
    output = output.slice(0, link.start) + open + output.slice(link.start, link.end) + close + output.slice(link.end);
  });

  return {
    content: output,
    links: chosen,
    candidates: scored.length,
    skipped: Math.max(0, scored.length - chosen.length),
    diagnostics,
    elapsed: performance.now() - started,
  };
}
