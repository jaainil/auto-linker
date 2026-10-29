# Auto-Linker Implementation Plan

**Goal:** Build the v0.1 library independently of the existing Astro demo, starting with tests and contracts.
**Architecture:** A standalone npm package in `package/`, with no workspace or site dependency. Parse5 supplies source locations; source slices are preserved and only anchor tags inserted. Synchronous, deterministic, in-memory matching.
**Tech Stack:** Node 22+, TypeScript, parse5, Zod, Vitest, fast-check, tsup.
**Spec:** User's finalized v0.1 engineering blueprint and PRODUCT.md.

## Constraints and decisions
- Leave the Astro demo intact. Library builds separately as ESM/CJS with declarations.
- Offsets are UTF-16 code units in the original source. Skip decoded text whose source does not match exactly.
- Self-link detection requires `currentUrl`. URL comparison removes fragments, default ports and non-root trailing slashes, preserves path case and queries; output always retains supplied URL.
- Invalid input and conflicting duplicate metadata throw; identical duplicate destinations coalesce.
- Audit inserted markup using returned insertion offsets, allowing exact recovery without removing pre-existing anchors.
- Guarantee repeated execution by treating engine-owned anchors as a completed execution marker. This avoids adding more links when the first call reached a limit.
- Evaluation fixtures are authored smoke data, not evidence of 90% precision on real content.

## Tasks
- [x] Write public API/invariant/property tests before implementation; confirm missing implementation fails.
- [x] Implement validated contracts, canonical comparisons and deterministic page normalization.
- [x] Implement parse5 eligible segments and existing destination discovery; conservatively skip malformed input.
- [x] Implement tokenization, candidates, BM25, scoring and deterministic conflict selection.
- [x] Implement source-offset insertion and exact removal with verified audit records.
- [x] Build both formats, test packed consumption, run tests and Astro build.
- [x] Document API, limitations, evaluation/release work remaining.

## Review focus
Entities and CRLF mappings; HTML parser repair and nested anchors; relative links and base URLs; duplicate URL metadata; idempotency at article limits.

## Execution record
- Implemented inline in the shared checkout, preserving concurrent website edits. No commits, pushes or publication performed.
- Initial test run: 41 failures from unimplemented API; completed engine and fixed source-boundary regression for silent parse5 formatting repair.
- Added metadata-only ranking regressions before normalizing available scoring weights; rejected candidates containing unrelated extra words.
- Independent review found directory HTML base URL resolution bug; reproduced with a failing test, then fixed by retaining base trailing slashes before resolution.
- Benchmark before phrase indexing: ~4,528 ms for 100 destinations / ~800 source words. Same synthetic input after indexing: ~63 ms locally on Node 26.13.0. Not a general performance guarantee.
- Synthetic evaluation: five authored fixtures, four approved generated links, no forbidden links or checked invariant violations. Real-article evaluation remains a release gate.
- Library ESM/CJS/declaration builds and root Astro build pass. CI matrix added for Node 22/24/26; local execution does not establish remote CI results.
