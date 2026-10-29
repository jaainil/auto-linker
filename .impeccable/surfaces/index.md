---
version: 1
slug: "index"
primary_target: "index"
related_targets: []
---

# Surface brief — `/` product site

**Scope:** single marketing + technical-documentation page for JUHENZA Auto-Linker, including one interactive reference demo.
**Mode:** Persuade, with Read sections. A developer must understand the offer and the guarantee fast, then want to read the blueprint and try the engine.

## Audience and job

Developer or technical SEO with a content-heavy HTML site and a backlog of manual internal linking. They arrive skeptical of "AI linking" tools and need to know three things: what the engine does, why the results are safe/verifiable, and what the API actually looks like.

**Action:** try the live demo, then read the blueprint and API. No install CTA, because the package is not published — the honest action is "try the engine" / "read the spec".

**Proof:** a working source-offset linker in the browser, the exact API contract, the 12 invariants, and the scope table. No invented customers, benchmarks, or release claims.

**Constraints:** pinned Context.dev tokens; Astro static; no backend; all sample content labeled synthetic; accessibility basics; works at 390 and 1440.

## Chosen direction

The page is an **engineering dossier you can operate**. The blueprint and the working engine share one surface: every claim sits next to its demonstration. Thin hairlines, generous white, black editorial headings, Doto measurements, and electric blue reserved for links, traces, and the primary action. Dotted orbital paths are the brand device and become functional: they trace an anchor in the article to the destination page it resolves to.

**Memorable moment:** running the demo draws a blue scan line down the article, then dotted traces arc out of each verified anchor to its destination row; toggling "recover source" removes the tags and proves the byte count unchanged.

## Direction contract

THESIS: A live linking instrument inside a printed engineering dossier — the claims and the proof occupy the same viewport, refusing the category's hero-metric-plus-feature-cards arrangement.

OWN-WORLD: White ground, #E6E6E6 hairlines, #2563EB only for links, traces, focus, and the primary pill; black Rethink Sans 400 headlines with tight tracking; Doto for offsets, scores, and code; 7px hairline panels; full-radius pills; dotted orbital arcs as the only ornament.

STORY: The visitor watches a phrase become a verified link, sees the exact destination and score behind it, verifies that removing the markup restores the original, then reads the API, invariants, and v0.1 scope and knows precisely what exists and what does not.

FIRST VIEWPORT: 1440: hairline nav; left 46% — 68px two-line "Content in. / Verified links out.", 16px subcopy, two pills, Doto fact line "0 crawlers · 0 API keys · 0 rewrites"; right 54% — a hairline linking stage with a real article excerpt, three blue anchors, dotted arcs to destination rows, status "3 verified · 1,284 bytes preserved". Primary action sits under the subcopy at left.

FORM: whole surface inside the pinned world; no concept roll. Signature interaction: scan + dotted anchor-to-destination traces, and the working demo with source recovery.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Unresolved decisions

- Whether `@juhenza/auto-linker` will be available on npm at publication (unverified).
- Final scoring weights and evaluation precision (explicitly experimental).
