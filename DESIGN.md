---
name: JUHENZA Auto-Linker
description: An operable engineering dossier for a source-offset internal linking engine.
colors:
  primary: "#2563eb"
  primary-deep: "#1d4ed8"
  primary-wash: "#f1f5ff"
  ink: "#000000"
  graphite: "#4d4d4d"
  label: "#3f3f3f"
  border: "#e6e6e6"
  border-strong: "#d2d2d2"
  muted: "#f7f7f7"
  white: "#ffffff"
typography:
  display:
    fontFamily: "Rethink Sans Variable, Rethink Sans, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(44px, 5.3vw, 68px)"
    fontWeight: 400
    lineHeight: 1.03
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Rethink Sans Variable, Rethink Sans, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(32px, 3.5vw, 46px)"
    fontWeight: 400
    lineHeight: 1.06
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Rethink Sans Variable, Rethink Sans, system-ui, -apple-system, sans-serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.012em"
  body:
    fontFamily: "Rethink Sans Variable, Rethink Sans, system-ui, -apple-system, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "26px"
    letterSpacing: "normal"
  label:
    fontFamily: "Doto Variable, Doto, ui-monospace, SFMono-Regular, monospace"
    fontSize: "11.5px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.04em"
  code:
    fontFamily: "Doto Variable, Doto, ui-monospace, SFMono-Regular, monospace"
    fontSize: "16.5px"
    fontWeight: 900
    lineHeight: 1.6
    letterSpacing: "0.01em"
  measure:
    fontFamily: "Doto Variable, Doto, ui-monospace, SFMono-Regular, monospace"
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.01em"
rounded:
  inline: "2px"
  chip: "5px"
  card: "7px"
  panel: "12px"
  field: "12px"
  close: "16px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  gutter: "clamp(20px, 4vw, 24px)"
  section: "clamp(64px, 8vw, 96px)"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "42px"
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "42px"
  button-secondary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.primary}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "42px"
  button-inverse:
    backgroundColor: "{colors.white}"
    textColor: "{colors.primary}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "42px"
  tag:
    backgroundColor: "{colors.white}"
    textColor: "{colors.label}"
    rounded: "{rounded.pill}"
    padding: "0 9px"
    height: "22px"
  tag-accent:
    backgroundColor: "{colors.primary-wash}"
    textColor: "{colors.primary}"
    rounded: "{rounded.pill}"
    padding: "0 9px"
    height: "22px"
  panel:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.card}"
    padding: "24px"
  code-card:
    backgroundColor: "{colors.muted}"
    rounded: "{rounded.card}"
    padding: "0"
  segmented-control:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.pill}"
    padding: "3px"
    height: "36px"
---

# Design System: JUHENZA Auto-Linker

## Overview

**Creative North Star: "The Operable Dossier"**

This is an engineering dossier you can operate. The page reads like a printed technical document — white paper, hairline rules, black editorial sans, dotted instrument measurements — and then becomes a working linking instrument in the same viewport. Every claim sits next to its demonstration rather than in a feature card.

The system is deliberately flat and quiet at rest. Structure comes from one-pixel rules, tonal fields, and a strict measure, not from shadows or decoration. Electric blue is the only signal: it marks a link, a trace, focus, or the primary action, so a blue mark always means "verified" or "act here." Doto supplies the machine voice — offsets, scores, URLs, code — while Rethink Sans carries the human argument.

The composition refuses the category's hero-metric-plus-three-cards arrangement. The first viewport is a split instrument: a two-line claim on the left, a live article with three anchors and dotted traces to their destinations on the right. The rest of the page alternates dense evidence tables with generous quiet, ending on a solid blue close.

**Key Characteristics:**
- White ground, hairline rules, and a single blue verification signal.
- Rethink Sans 400 for display and body; Doto for measurements, URLs, and code.
- Flat surfaces at rest; depth only from tonal layering and state shadows.
- 7px cards, 12px instrument panels, full-radius pills.
- Dotted orbital paths as the only ornament, used functionally as anchor-to-destination traces.
- Working proof: scan, link, audit, recover — not a screenshot.

## Colors

A white page, a pencil, and one verification signal.

### Primary
- **Verification Blue** (#2563eb): Internal links, dotted traces, focus rings, the primary pill, the active pipeline step, the "verified" state, and the closing CTA field. It is the only saturated color in the system.
- **Deep Signal Blue** (#1d4ed8): Hover state for primary actions and links; never a resting fill.
- **Proof Wash** (#f1f5ff): Selected or linked rows, blue tag fills, focus halos, and the active-step halo.

### Neutral
- **Press Black** (#000000): Display headlines, body text, and active control labels.
- **Pencil Graphite** (#4d4d4d): Secondary paragraphs, leads, captions, and URLs.
- **Graphite Microcopy** (#3f3f3f): Small uppercase labels and tag text.
- **Hairline Rule** (#e6e6e6): Every structural divider, panel border, and table rule.
- **Heavier Rule** (#d2d2d2): Control borders, inactive dots, and stronger separations.
- **Paper Grey** (#f7f7f7): Code grounds, formula panels, and quiet table headers.
- **Dossier White** (#ffffff): The page ground and every raised panel.

### Named Rules

**The One Signal Rule.** Blue is evidence, not decoration. Use it only for links, traces, focus, selected states, and the primary action. The single permitted large blue field is the closing CTA panel.

**The Hairline Rule.** Structure is drawn with 1px rules in Hairline Rule. No heavy dividers, no dark bands, no drop shadows at rest.

## Typography

**Display Font:** Rethink Sans Variable (with Rethink Sans, system-ui, sans-serif)
**Body Font:** Rethink Sans Variable (with Rethink Sans, system-ui, sans-serif)
**Label/Mono Font:** Doto Variable (with Doto, ui-monospace, monospace)

**Character:** A neutral, slightly narrow editorial sans with tight tracking carries the argument; Doto's dotted mono reads like instrument output and carries only measured things. The pairing is a printed report with a live readout.

### Hierarchy
- **Display** (400, clamp 44–68px, 1.03, -0.035em): The first-viewport claim and closing statement. Two lines maximum; never bold.
- **Headline** (400, clamp 32–46px, 1.06, -0.03em): Section openings. Keep to 15 characters per line where possible.
- **Title** (400, 22px, 1.2, -0.012em): Card titles, step names, and panel headings.
- **Body** (400, 16px, 26px): Argument and documentation. Keep long passages to 46–62 characters per line.
- **Label** (600, 11.5px, 1.4, 0.04em, uppercase): Section metadata, table labels, and small state text.
- **Code** (900, 16.5px, 1.6, 0.01em): Code cards only. On narrow screens the card scrolls horizontally rather than reflowing code.
- **Measure** (700, 13px, 1.2, 0.01em): Scores, offsets, byte counts, and timing readouts.

### Named Rules

**The Doto Measures Rule.** Doto is for offsets, scores, URLs, code, and short metadata. Never set a sentence, paragraph, or button label in it.

**The Tight Display Rule.** Display and headline weights stay at 400 with negative tracking. Do not bold a headline or add a display serif to create emphasis; use scale and space.

## Layout

The page sits on a 1200px measure with 20–24px gutters and 64–96px section padding. A 66px sticky navigation holds the brand, five section links, and the primary pill; it gains a hairline border only after scroll. At 820px the links collapse into a Menu disclosure so the bar never wraps.

The first viewport is a two-column instrument: copy and stage split roughly 1.02 / 0.98 with a 32–60px gap, collapsing to one column at 900px. Section heads use a 1.15 / 0.85 split with the heading left and metadata right. The problem section is a 0.92 / 1.08 split with a sticky left aside. The demo is a 1.9 / 0.82 article-to-corpus split. The closing panel is a 1.15 / 0.85 split.

Density alternates: a dense table or audit is followed by a quiet statement or a full-width rule. Nothing is centered except short state copy inside panels. Body text never runs wider than 62ch.

**The Dossier Grid Rule.** Content stays on the 1200px measure. Only the hero orbit and the closing panel may break the measure; there is no full-bleed section.

## Elevation & Depth

The system is flat by default. Depth comes from tonal layering — Paper Grey fields inside white panels, Proof Wash rows inside white tables — and from 1px hairlines. Cards do not cast shadows.

Shadows exist only as state or instrument effects: the active segment's 1px seat, the blue focus halo, the active pipeline step's 4px halo, the scan line's 12px glow, the linked destination dot's 3px halo, and the mobile menu panel's 30px ambient shadow. None of them simulate physical lift.

The dotted orbital motif is the only atmospheric device. In the hero and close it is a faint set of ellipses; in the linking stage it becomes functional geometry, tracing each anchor to its destination row.

**The Flat-By-Default Rule.** A surface is flat at rest. Any shadow must encode state (focus, active, open) or a live instrument effect; it may not decorate a card.

## Shapes

The form language is drawn, not molded: 1px rules, circular dots, full-radius pills, and two container radii. Cards and code cards use 7px; instrument panels and fields use 12px; the closing field uses 16px; tags, pills, and segmented controls are fully rounded. Inline code and small chips step down to 2–5px.

There are no bevels, no glass, no hard offset shadows, and no clipped decorative polygons. The only circles larger than a control are the orbit rings, and they are always dotted.

**The Two-Radius Rule.** Containers are 7px or 12px. Controls are pills. Do not introduce a third container radius for a new surface.

## Components

### Buttons
- **Shape:** Full-radius pill, 42px tall, 18px horizontal padding, 9px icon gap.
- **Primary:** Verification Blue ground with white text; the arrow translates 1px up and right on hover while the ground shifts to Deep Signal Blue.
- **Secondary:** White ground, blue text, 1px Heavier Rule border; hover fills with Paper Grey.
- **Inverse:** White ground with blue text on the closing field; outline-inverse uses a 42% white border and a 12% white hover fill.
- **Quiet:** Transparent ground with graphite text; hover fills Paper Grey.
- **Focus:** 2px Verification Blue outline at 3px offset, never removed.

### Tags
- **Style:** 22px pill, 10px uppercase label at 0.07em, white ground with a Hairline Rule border.
- **Accent:** Proof Wash ground, Verification Blue text, and a 22% blue border. Used for counts, "3 links added," and verified states.

### Cards and Panels
- **Corner Style:** 7px for cards and code cards; 12px for the linking stage, demo, and other instrument panels.
- **Background:** Dossier White for content panels; Paper Grey for code and formula grounds.
- **Border:** 1px Hairline Rule on every edge; no shadow.
- **Internal Padding:** 20–24px for content panels; code cards use a 42px head, 20px code padding, and a 34px foot.

### Inputs and Controls
- **Segmented control:** Paper Grey pill with 3px padding and a 1px Hairline Rule; the active segment is a white pill with a 1px seat shadow. Text is 12.5px graphite, active text Press Black.
- **Stepper:** 38px pill with 28px circular buttons in Paper Grey; the value is Doto Measure.
- **Code copy:** 28px white pill with a 1px Hairline Rule; hover turns the label and border blue.
- **Focus:** All controls use the same 2px blue outline at 3px offset.

### Navigation
- **Desktop:** 66px sticky white bar; brand at left, five 13.5px graphite links, primary pill at right. The border appears only when scrolled.
- **Mobile:** Brand and primary pill stay; a 36px "Menu" pill opens a full-width white panel of 15px links separated by hairlines. The label becomes "Close" with an X; Escape, a link click, or an outside pointer closes it.

### Signature: The Linking Stage
A 12px instrument panel with a file bar, an article excerpt with three blue anchors, an SVG layer of dotted curves from each anchor to a destination rail, and a footer byte count. "Remove markup" swaps the article to its plain source, sets the state to "original intact," and proves the byte count is unchanged; "Insert links again" restores the linked version and redraws the traces. On widths below 900px the traces are removed and the rail stacks under the article.

### Signature: The Demo
A working reference implementation in the same instrument language: sample tabs, link-count stepper, insert/suggest modes, rendered/HTML views, a blue scan line, destination rows that light up as they are selected, an audit table with score meters, and a "Recover original" control that removes the inserted tags.

## Do's and Don'ts

### Do:
- **Do** reserve Verification Blue for links, traces, focus, selected states, and the primary action.
- **Do** use Doto for offsets, scores, URLs, byte counts, and code; use Rethink Sans for every sentence.
- **Do** draw structure with 1px Hairline Rule borders and Paper Grey tonal fields.
- **Do** keep cards at 7px, instrument panels at 12px, and controls as full pills.
- **Do** label demo content as synthetic and keep the v0.1 scope, weights, and release status honest.
- **Do** preserve the two public calls, the 12 invariants, and the byte-identical recovery proof in any new surface.
- **Do** keep the page operable at 390px and 1440px, including the mobile section menu.

### Don't:
- **Don't** use blue as a decorative fill outside the closing CTA panel.
- **Don't** set body copy, leads, or button labels in Doto.
- **Don't** bold display headings or introduce a second display face.
- **Don't** add drop shadows, glass, gradients, bevels, or hard offset shadows.
- **Don't** introduce a third container radius or a second accent color.
- **Don't** invent customers, benchmarks, package releases, or evaluation scores.
- **Don't** present the 35/25/15/15/10 weights as calibrated probabilities.
- **Don't** hide the primary navigation on mobile without the menu disclosure.
