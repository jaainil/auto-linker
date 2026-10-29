# Finish review — `/` product site

**Disposition: ship** (verdict pass; the two material fixes from the full review are resolved, no regressions)

This review ran inline under the degraded finish-reviewer contract because the shipped subagent hit the harness usage limit. Evidence: `.impeccable/review/desktop.png` (1440×8722, full page), `.impeccable/review/mobile.png` (390×14159, full page), `desktop-viewport.png`, `mobile-viewport.png`, `mobile-menu.png`, `demo-run.png`, `demo-run-mobile.png`, `demo-recovered.png`. No approved comp: code-led build.

## persistence

Pass. PRODUCT.md exists; the new world's DESIGN.md and `.impeccable/design.json` were written after the review. No comp round, no build state, no mocks — code-led by contract. Detector returned `[]` over the page, components, styles, and scripts.

## fidelity

Faithful to the direction contract, judged against OWN-WORLD because there is no comp.

- **TYPE:** Rethink Sans 400 display and body with tight tracking; Doto for measurements, URLs, and code. Match.
- **MATERIAL:** Flat paper, hairline rules, tonal fields; no faked physicality. Match.
- **GROUND:** Dossier White (#ffffff) with #e6e6e6 rules and Verification Blue only for links, traces, focus, and primary actions. Match.
- **FIRST VIEWPORT:** Two-column instrument; two-line claim, subcopy, two pills, constraint facts, live stage with three anchors, dotted traces, "3 verified," and a byte-preservation proof. Match. Two acceptable adaptations: the live byte count is 324 (true to the authored sample, not the brief's illustrative 1,284) and the fact line carries four truthful constraints instead of three.
- **STORY / FORM:** Watch a phrase become a verified link, see destination and score, recover the source byte-for-byte, then read API, invariants, and v0.1 scope. The hero stage and demo both deliver the signature interaction. Match.
- **Navigation:** Desktop five-link bar; mobile Menu disclosure at ≤820px with Escape, outside-pointer, and link-close behavior. Added as an accessibility/wayfinding adaptation for the 390px visitor path; in-world and keyboard operable.
- **Truth:** Demo labeled synthetic; no invented customers, benchmarks, releases, or scores; weights labeled experimental. Match.
- **Provenance:** No shipping raster assets. The favicon and brand mark are SVG; nothing requires a provenance sidecar.

## ceiling

Reached. The world's native devices are used, not merely cited: dotted orbital geometry becomes functional traces; the article stage proves byte-identical recovery; the demo runs the documented selection rules with audit rows and score meters; the scope table and definition-of-done state the unfinished release honestly. Motion is orchestrated (scan, link-in, traces, reveals) and respects reduced motion.

## material_fixes

None open. The full review's two material findings were fixed in one batch:

1. **Mobile wayfinding (resolved):** primary section links were hidden below 720px with no replacement; added the 36px Menu/Close pill and the hairline panel, raised the nav breakpoint to 820px so 721–820px widths cannot wrap the bar, and verified Escape, outside-pointer, link-click, and CTA-click close behavior.
2. **Mobile caption break (resolved):** `INV-07 · INV-12` broke mid-token at 390px; the reference is now nowrap and the caption wraps as a unit.

The fix batch introduced no regressions in the recaptures; no horizontal overflow at 390, 768, 1024, 1280, 1440, or 1600.

## keep

Keep the white ground and hairline structure, the single blue verification signal, Doto only for measured things, the live stage and demo, the honest v0.1 scope, and the mobile menu disclosure.
