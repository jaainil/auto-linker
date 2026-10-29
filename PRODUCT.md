# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro (static build, no framework islands), TypeScript for the demo engine, self-hosted variable fonts. Chosen by the user in the init round.

## Users

Developers, technical SEOs, and content engineers at agencies and product teams running content-heavy HTML sites (100+ published pages: service pages, blog articles, industry guides). They publish through a Node-based pipeline — Next.js, Astro, TanStack Start, or a plain static site — and currently link internal pages by hand: hunting for relevant URLs, choosing phrases, inserting anchors, and checking nothing broke.

## Product Purpose

JUHENZA Auto-Linker is an open-source npm package that discovers and inserts contextually relevant internal links into HTML articles using only the content and destination metadata the developer supplies. Success means a developer can call `autoLink()` with an article and a page list and receive verified links, an audit report, and the original content exactly recoverable — with no database, crawler, API key, or AI model.

## Positioning

The engine inserts only opening and closing anchor tags at verified source offsets, so the author's original wording and bytes survive intact. Selection is deterministic (preferred anchors, title/heading/keyword similarity, BM25) rather than generative: every returned URL came from the supplied page list. That combination — byte-preserving insertion plus provable destination provenance — is the claim a neighboring tool in this category could not truthfully copy.

## Operating Context

- Developers supply `LinkablePage[]` in memory: url, title, optional content, headings, keywords, anchors.
- The source article is an HTML string; output is an updated HTML string plus a `links` audit array, a skipped count, and diagnostics.
- Two entry points: `suggestLinks()` (dry run) and `autoLink()` (insert).
- Intended for build-time or server-side use; framework-independent, Node.js 22+.
- The first release deliberately excludes Markdown, a CLI, crawling, storage, embeddings, CMS integrations, and a dashboard.

## Capabilities and Constraints

- v0.1: in-memory ingestion, HTML parsing with source locations, contextual anchor discovery, keyword + BM25 relevance, editor-defined anchors, deterministic selection, safe insertion, suggestion-only mode, JSON audit, automated tests.
- Excluded from linking: `a`, `h1`–`h6`, `code`, `pre`, `script`, `style`, `textarea`, `button`, and `[data-autolink-skip]`.
- Invariants: exact recovery, no nested links, no excluded-element links, no self-links, no duplicate destinations, no overlapping anchors, no invented URLs, deterministic, idempotent, entity-safe, predictable invalid input, no rewriting.
- Scoring weights are explicitly experimental starting values (35/25/15/15/10) and must not be presented as calibrated probabilities.
- Cannot link if only low-quality opportunities exist; the engine must return fewer links rather than meet a count.
- No publication has happened. The npm package, GitHub repository, and evaluation results do not exist yet; v0.1 scope is finalized and implementation starts with the invariant tests.

## Brand Commitments

- Product name: JUHENZA Auto-Linker; npm name `@juhenza/auto-linker` (subject to availability).
- Licensing: MIT proposed.
- The user pinned the Context.dev design system as binding visual direction: white canvas, #2563EB primary, Rethink Sans, Doto for code, pill controls, hairline borders, generous editorial spacing, dotted orbital motif. Recorded as a constraint; the surface brief expands it into composition.

## Evidence on Hand

- The full engineering blueprint supplied in the request: vision, scope table, stack, modules, API, invariants, repository structure, five-stage plan, definition of done.
- No published package, repository, customers, benchmarks, evaluation scores, or testimonials exist. These must not be fabricated.
- The interactive demo on the site is a reference implementation of the documented selection and insertion rules, running client-side on authored sample content. It must be labeled as a demonstration, not a released package.

## Product Principles

1. Preserve first. The original text is never rewritten; only anchor tags are added at verified offsets.
2. Evidence over eagerness. Fewer good links beat a filled quota; every destination must trace back to supplied metadata.
3. Deterministic by default. Same input, same output; no external service in the critical path.
4. Show the mechanism. Claims about parsing, scoring, and insertion are demonstrated, not asserted.
5. Ship the spec honestly. Scope, weights, and unfinished status are stated plainly.

## Accessibility & Inclusion

Standard web accessibility expected: keyboard-operable controls, visible focus, semantic landmarks, sufficient contrast, no motion-only communication, reduced-motion support. No product-specific accessibility requirement was established.
