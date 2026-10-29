export interface LinkablePage {
  url: string;
  title: string;
  content?: string;
  headings?: string[];
  keywords?: string[];
  anchors?: string[];
}
export interface AutoLinkOptions {
  content: string;
  pages: LinkablePage[];
  currentUrl?: string;
  maxLinks?: number;
  maxLinksPerParagraph?: number;
  minScore?: number;
}
export interface LinkSuggestion {
  anchor: string;
  url: string;
  /** UTF-16 code-unit offsets in original input, end exclusive. */
  start: number;
  end: number;
  score: number;
  reason: string;
}
export interface Insertion {
  /** UTF-16 code-unit offset in output, not input. */
  offset: number;
  markup: string;
}
export interface AutoLinkResult {
  content: string;
  links: LinkSuggestion[];
  skipped: number;
  diagnostics: string[];
  insertions: Insertion[];
}
export interface TextSegment {
  text: string;
  start: number;
  end: number;
  paragraphId: string;
  context: string;
}
