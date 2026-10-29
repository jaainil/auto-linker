# JUHENZA Auto-Linker

An experimental, synchronous HTML internal-linking engine for Node.js 22+. No network, model, crawler, or database is used at runtime. This is a local v0.1 implementation, not a published release or a calibrated relevance model.

```ts
import { autoLink, suggestLinks, removeInsertedLinks } from '@juhenza/auto-linker';

const options = {
  content: '<p>AI automation reduces repetitive tasks.</p>',
  currentUrl: 'https://example.com/article',
  pages: [{
    url: 'https://example.com/ai',
    title: 'AI automation services',
    anchors: ['AI automation'],
    keywords: ['AI automation'],
  }],
};
const preview = suggestLinks(options); // content unchanged
const result = autoLink(options);
console.log(result.content, result.links, result.diagnostics);
console.assert(removeInsertedLinks(result) === options.content);
```

Build locally with `npm ci && npm test && npm run build` inside `package/`. Install the resulting tarball from `npm pack` into a consuming project. Both ESM and CommonJS exports include TypeScript declarations. The Astro site at the repository root remains a separate demonstration.

## Configuration

| Option | Default | Meaning |
| --- | --- | --- |
| `content` | required | Original HTML string |
| `pages` | required | Destination array: absolute HTTP(S) `url`, `title`, optional `content`, `headings`, `keywords`, `anchors` |
| `currentUrl` | absent | Absolute article URL for self-link detection and resolving relative links |
| `maxLinks` | 5 | Nonnegative integer maximum per execution |
| `maxLinksPerParagraph` | 2 | Nonnegative integer limit in each content block |
| `minScore` | 0.35 | Minimum heuristic score from 0 to 1 |

Validation throws Zod errors for invalid configuration/unsafe URLs and an Error for conflicting duplicate metadata. Identical canonical destinations are deduplicated. Canonical comparisons retain protocol, path case and query, remove fragments/default ports/non-root trailing slashes. Actual `href` retains the original supplied URL, escaped for an HTML attribute. Credentials in URLs are rejected.

`links` contains selected suggestions in source order; for `autoLink` these are only newly inserted links. `start` and `end` are UTF-16 code-unit offsets into the **original** source, with end exclusive. `score` is an experimental ranking value, not a probability. `skipped` counts scored candidates not selected; diagnostics explain conservative source skips. `insertions` contains exact inserted tags and their offsets in the **output**, for audit and exact reversal with `removeInsertedLinks`. Dry runs have no insertions.

## Preservation and limitations

Only opening and closing anchor tags are inserted. Source is never serialized. Parse5 locates text; decoded entities, CRLF normalization, parser errors, or uncertain source mapping cause conservative skips. Candidates remain in one text node and never span markup or sentence punctuation. Excluded elements, skip-marked regions, editable content, and interactive roles are ignored.

Self-link detection needs `currentUrl`: HTML alone does not identify its own address. Existing relative destinations are resolved against `currentUrl` (or an explicit HTML base); without a base they conservatively suppress matching paths/queries on all supplied origins. Existing absolute links are always compared canonically.

Inserted anchors carry `data-autolink="juhenza-v1"`. An article with this marker is treated as already processed and receives no further links, even if limits/options change. This deliberately guarantees idempotency after reaching a link limit. To reprocess with new settings, reverse the original result first. The exact audit is authoritative for reversal; marker attributes alone are not sufficient, and edited output may invalidate the audit.

Ranking uses preferred anchors, title, headings, keywords and BM25 with experimental 35/25/15/15/10 weights, normalized over metadata fields actually supplied. Non-preferred candidates must occur as a contiguous phrase in destination title, headings or keywords. Selection is greedy and deterministic, with ambiguity penalties, no overlapping anchors or duplicate destinations, and per-block limits. Short/generic phrases are penalized. There is no language-specific grammar model, stemming or semantic understanding. A phrase index prunes unrelated destinations before scoring; metadata indexing and dense matches can still be costly on very large corpora. Run `npm run benchmark` for a reproducible synthetic 100-page sparse-match example.

This version has synthetic fixtures and invariant tests. Precision on 20–30 independently reviewed real articles, supported-Node CI results, full dependency license review, name availability and npm publication are still release gates. Do not interpret smoke tests as proof of 90% precision. MIT licensing is supplied for the new library; the website is outside the package tarball.

## Releases and Publishing

Releases are published to npmjs.org automatically via GitHub Actions:
- **Workflow:** [`.github/workflows/publish.yml`](../.github/workflows/publish.yml)
- **Auto-version bump:** Triggers via `workflow_dispatch` in GitHub Actions with `patch`, `minor`, or `major` input.
- **Verification:** Runs typecheck, tests, examples, and builds before publishing.
- **npm configuration:** Published under public access (`publishConfig.access = "public"`) with provenance.
- **Requirement:** Add your npm granular access token or automation token as `NPM_TOKEN` under GitHub repository secrets.
