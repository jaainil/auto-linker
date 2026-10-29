import { z } from 'zod';
import { validHttpUrl } from './urls';
const url = z.string().refine(validHttpUrl, 'Expected an absolute HTTP(S) URL without credentials or whitespace');
const list = z.array(z.string().trim().min(1));
export const pageSchema = z.object({
  url, title: z.string().trim().min(1), content: z.string().optional(),
  headings: list.optional(), keywords: list.optional(), anchors: list.optional(),
}).strict();
export const optionsSchema = z.object({
  content: z.string(), pages: z.array(pageSchema), currentUrl: url.optional(),
  maxLinks: z.number().int().min(0).default(5),
  maxLinksPerParagraph: z.number().int().min(0).default(2),
  minScore: z.number().min(0).max(1).default(0.35),
}).strict();
