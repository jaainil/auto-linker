# Architecture

The library is independent of the Astro site and the browser-only demo. `src/index.ts` exports the synchronous API, public types and Zod schemas. Runtime dependencies are parse5 and Zod only.

1. Validate configuration, HTTP(S) URLs, limits and metadata.
2. Normalize destinations for comparisons, preserving original output URLs; reject conflicting duplicates.
3. Parse HTML with parse5 source locations, collecting eligible text and existing destinations. Treat malformed or uncertain source mappings conservatively.
4. Build a metadata phrase index and enumerate one-to-six-word, single-node candidates, looking up only matching destinations. Require contiguous metadata phrase evidence or explicit preferred anchors.
5. Score using preferred anchor/title/headings/keywords/BM25 context (35/25/15/15/10); normalize weights for available metadata. Penalize short, stopword-boundary, long and ambiguous candidates. Exclude generic single-word candidates.
6. Sort deterministically by score, anchor length, source offset and canonical destination. Select without overlap, self/existing destinations, duplicate destinations, or exceeded limits.
7. Insert only verified tags and record their exact output positions. No HTML serialization occurs.

`suggestLinks` stops after selection. `autoLink` applies selection to the original string. `removeInsertedLinks` verifies and removes precisely the audit-recorded tags, preserving authored anchors.

Source ranges are UTF-16 code units, not bytes or Unicode scalar indices. A text node is usable only when the exact source slice equals parse5's decoded text. Entities, null replacement and line-ending normalization therefore cause node-level skips. Formatting across nodes is intentionally unsupported.

Idempotency uses `data-autolink="juhenza-v1"` on generated anchors. If that marker exists, the whole article is already processed. This is necessary to avoid filling new slots on repeated limited executions. Reset using the original audit before changing configuration. No marker is added when no links are inserted.

There is no learned relevance calibration, exact global optimization, crawl/index adapter, or storage layer. A future retrieval adapter can supply a smaller page list without changing this core API.
