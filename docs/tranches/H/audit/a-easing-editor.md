# Tranche H Deep Audit — Lane `a-easing-editor`

**Charge:** D3 — the cubic-bézier / easing editor is FAR too big. KISS proper sizing +
layout via MODERN-WEB-GUIDANCE idioms (container queries, `aspect-ratio`, intrinsic
sizing). Fix: inner border touching the "cubic-bézier" header, header too small, the
massive canvas. Live-measure at `/easing`.

**Spine (BINDING):** no quick fixes / no workarounds — idiomatic gestalt. Architectural
transposition for ELEGANCE · SIMPLICITY · PERFORMANCE welcome. MEASURE-FIRST every perf
claim. Every claim carries a `file:line` or a live observation.

**Branch:** `tranche-h-dev` · **Demo:** `http://localhost:5174/#/easing` (kf 4.1.0 + Tranche G)

---

## 0. Surface map — where the "easing editor" actually lives

The charge names `CubicBezierControls.vue` / `TimingFunctionPanel.vue` /
`EasingCurveCanvas`. **`CubicBezierControls.vue` does not exist** (grep of the tree: no
such file; `demo/CLAUDE.md` lists it but it was folded into `TimingFunctionPanel.vue`).
The real surface is THREE files, and there are **TWO distinct editors**:

| # | Editor | Files | Reached via |
|---|--------|-------|-------------|
| A | **EasingSidebar** (the `/easing` scene's own panel) | `demo/easing/EasingSidebar.vue` (185L) + `demo/@/components/custom/EasingCurveCanvas.vue` (349L) | `/#/easing` |
| B | **TimingFunctionPanel** (the cubic-bézier *detail panel* in the general controls) | `demo/@/components/custom/animation-controls/controls/TimingFunctionPanel.vue` (208L) + same `EasingCurveCanvas.vue` | cube/square/etc. → easing tab → "edit curve" |

Both editors render the **same** `EasingCurveCanvas` SVG, so the sizing defect is
single-sourced there. D3's two *symptom clusters* split cleanly: the **"massive canvas"**
is editor A (live-measured below); the **"inner border touching the header / header too
small"** is editor B (`TimingFunctionPanel`'s `CardHeader` + adjacent `GlassPanel`).
`demo/CLAUDE.md` mentioning a non-existent `CubicBezierControls.vue` is a **stale doc**
(RECORD — fix the tree table in `demo/CLAUDE.md`).

---

## 1. LIVE MEASUREMENT (the smoking gun)

Driven with Playwright MCP at viewport **1440×900**, route `/#/easing`
(`browser_evaluate` → `getBoundingClientRect` / `getComputedStyle`):

```
glass-card (EasingSidebar root) : 724 × 883 px   (full sidebar column, full vh)
  cardMaxWidth: none   cardMinWidth: 0px           ← nothing caps it
easing-curve-canvas-wrapper     : 698 × 698 px
easing-curve-canvas  (the SVG)  : 680 × 680 px   ← THE MASSIVE CANVAS
  min-height: 140px   aspect-ratio: 1 / 1   viewBox: "0 -0.1 1 1.2"
container-type (any ancestor)   : normal          ← NO container context anywhere
```

So on a typical desktop the easing curve is a **680px square** — 77% of the 883px panel
height is one SVG. The card has **`max-width: none` and `min-width: 0`**: it expands to
whatever the sidebar column gives it, and `aspect-ratio: 1` (EasingCurveCanvas.vue:271)
then drives the *height* off that width. There is no block-size ceiling, so width → square
→ the whole viewport. This is exactly D3's "FAR too big / massive canvas."

`grep -rn 'container-type|@container|cqi|cqw' demo/easing/ EasingCurveCanvas.vue
TimingFunctionPanel.vue` → **NONE**. Yet `EasingCurveCanvas.vue:266-268` claims the
canvas is "container-query-friendly"; that comment is **aspirational, not implemented** —
there is no container, no container unit, no `@container` rule. (Honest note: the
`aspect-ratio` + `min-height` pairing was a reasonable first cut; it is the *missing
ceiling*, not the technique, that fails.)

**φ-ladder cross-check (probe of resolved rungs, live):** `text-heading` = 25.888px (φ),
`text-title` = 32.928px (φ^1.5), `text-subheading` = 20.352px (√φ) — the glass-ui ladder
resolves correctly. BUT `text-display` probed to **16px** (should be φ^2 ≈ 42px), i.e. a
demo-local override is clobbering the display rung. That mis-resolution is **D7's lane
(hero typography)**, flagged here only as a cross-lane corroboration — do not fix in this
lane.

---

## 2. ROOT CAUSES (cited)

### RC-1 — Canvas has no block ceiling; `aspect-ratio:1` off an uncapped width
`EasingCurveCanvas.vue:269-273`:
```css
.easing-curve-canvas { min-height: 140px; aspect-ratio: 1; display: block; }
```
`width: 100%` (template line 8) + `aspect-ratio: 1` + an uncapped 724px card ⇒ a 680px
square. There is no `max-block-size`, no `max-inline-size`, and the editor lives in **no
container context** (`container-type: normal` on every ancestor — §1). The square scales
off the *viewport-driven sidebar width* instead of an intended, bounded canvas size.

### RC-2 — EasingSidebar root has no inline-size cap and is not a container
`EasingSidebar.vue:2` `<div class="glass-card p-3 grid gap-3">` — measured 724×883,
`max-width: none`. It neither bounds itself nor declares `container-type`, so RC-1 cannot
self-size; both editors inherit the unbounded width.

### RC-3 — "Inner border touches the cubic-bézier header" (editor B)
`TimingFunctionPanel.vue:17-45`: a `<Card plain>` whose `<CardHeader class="...pb-1">`
(CardTitle `text-heading`, line 19) is followed *immediately* by `<EasingCurveCanvas>`,
which is itself a `GlassPanel variant="wash"` carrying its own
`border: 1px solid var(--glass-border-wash)` (glass-ui `glass.css:48-52`) + `rounded-card`
(`EasingCurveCanvas.vue:4`). With only `CardContent ... gap-2` (line 37) and `pb-1` on the
header, the wash panel's 1px top border sits hard against the header baseline — the
"inner border touching the top of the header" artifact. It is the **nested bordered
GlassPanel inside a bordered Card** (double chrome) with near-zero separation.

### RC-4 — Header "too small" is *relative*, not absolute
`text-heading` (25.9px, φ) is a perfectly good rung — but D3 reads it as "too small"
because it sits under a 680px canvas. The fix is **shrink the canvas** (RC-1/2) and bump
the title **one φ-rung** to `text-title` (32.9px) so the header wins the eye, not the
graph. This is a ladder *step*, not an ad-hoc px.

### RC-5 — `viewBox` recompute is per-render, unmemoized
`EasingCurveCanvas.vue:146-165`: `viewBox` is a `computed` that samples the easing fn 17×
(`for i in 0..16`) on every control-point change. Cheap, but it re-runs the easing fn each
drag frame alongside `bezierPathD`. MEASURE-FIRST before touching — see §4 proof gate; do
**not** assert a perf win without the instrument.

---

## 3. THE GESTALT FIX (KISS · modern-web · single motion)

Modern-web-guidance (`size-aware-styling`, `fluid-scaling`; both **Baseline Widely
available since 2023-02-14** — no fallback owed) prescribes: *make the panel a container,
size the canvas off the container, clamp it.* This is the idiomatic transposition.

### Fix-1 — Make the panel a container, give the canvas a real ceiling (RC-1/2)
Declare the editor root a container, and size the canvas with **intrinsic + clamped**
block-size instead of a viewport-driven square. One motion, no compat path:

```css
/* EasingSidebar.vue root  (and the TimingFunctionPanel Card wrapper) */
.glass-card { container-type: inline-size; container-name: easing-editor; }

/* EasingCurveCanvas.vue — replace the open-ended aspect square */
.easing-curve-canvas {
    display: block;
    inline-size: 100%;
    aspect-ratio: 1;                 /* keep the square LAW */
    /* but cap the block so width can't make it gigantic: */
    block-size: clamp(160px, 38cqi, 280px);   /* container-relative, clamped */
    max-block-size: 280px;
    margin-inline: auto;             /* center when width > height-implied square */
}
```
`38cqi` ties the canvas to the *container's* inline size (not the viewport), and `clamp`
holds it in `[160px, 280px]` — a deliberate, bounded canvas regardless of sidebar width.
The `aspect-ratio` keeps it square; `margin-inline:auto` centers it. The 680px square
becomes a ≤280px square — measured target: **canvas ≤ 280px, panel height drops from
883px to ≈ 470px** (instrument in §4). KISS: ~4 lines, deletes the unbounded behavior in
one stroke (NO legacy fallback owed — Baseline 2023).

> Ratio is a **named delta**: `38cqi` is the φ-derived fraction that lands the canvas at
> ~the same proportion as the cube/square scene targets — it is chosen, not arbitrary,
> and is the only magic number; everything else is a token.

### Fix-2 — Lift the inner border off the header (RC-3), one motion
In `TimingFunctionPanel.vue`: the canvas should **not** be a second bordered glass panel
nested inside a bordered Card. Idiomatic: the canvas's `GlassPanel variant="wash"` *is*
the surface; the surrounding `<Card plain>` chrome is redundant double-framing. Either
(a) drop `variant="wash"`'s border on the canvas when it is already inside a Card (one
surface owns the border), or (b) give the header genuine separation:
`CardHeader class="pb-3"` + `CardContent gap-3`. Prefer **(a)** — collapse the double
chrome — as the gestalt (DRY: one border, not two). The canvas already carries depth via
its wash; the Card's job is layout, not a second frame.

### Fix-3 — Header one φ-rung up (RC-4)
`TimingFunctionPanel.vue:19` `class="text-heading"` → `class="text-title"` (25.9px →
32.9px, the next φ rung). Stays on the ladder; no px literal. With the canvas now ≤280px,
the title legitimately leads the panel.

### Fix-4 (EasingSidebar parity) — give editor A a header too
`EasingSidebar.vue` currently has **no title at all** — the canvas just floats (live
screenshot `easing-desktop-clean.png`: bare graph, "ease" only appears in the value
input). For gestalt parity with editor B, add a `text-title` "cubic-bézier" / "easing"
header above the canvas (it already knows `demo.currentEasingName`). ISOMORPHIC with
editor B's header treatment. (Disposition: SHIP — it is the same KISS header, reused.)

---

## 4. FALSIFIABLE INSTRUMENTS (proof gates for H to wire)

1. **`proof:easing-canvas-bounded` (visual + DOM lock).** At 1440×900 on `/#/easing`,
   `getComputedStyle('.easing-curve-canvas').blockSize <= 280` AND the SVG bounding box
   `width === height` (square LAW held) AND `<= 280`. Today: 680px (FAILS) → after Fix-1:
   ≤280px (PASSES). Encode as a Playwright assertion in a demo e2e + a screenshot diff.
2. **`proof:easing-panel-height`.** `.glass-card` (EasingSidebar root) `offsetHeight`
   fits within the sidebar without the canvas exceeding ~50% of panel height. Today the
   canvas is 680/883 = 77%; gate at `<= 0.55`.
3. **`proof:easing-header-clearance` (border-touch lock).** In `TimingFunctionPanel`,
   assert vertical gap between `CardTitle` bottom and the `.easing-curve-canvas-wrapper`
   top border `>= 8px` (today ≈ near-0 with `pb-1` + nested borders). DOM-rect assertion.
4. **`proof:easing-container-context`.** Assert `getComputedStyle(editorRoot).containerType
   === 'inline-size'` — codifies that the canvas resizes off its *container*, not the
   viewport (guards RC-1 from regressing back to a viewport square).
5. **`proof:bezier-drag-frame-budget` (MEASURE-FIRST gate for RC-5).** Instrument a drag:
   `performance.measure` around `viewBox` + `bezierPathD` recompute during a synthetic
   handle drag; record the baseline median before claiming any RC-5 optimization. **No
   perf assertion lands without this number first** (spine). If baseline is already <0.5ms
   median, RC-5 is **ALREADY-SOTA** — leave it.

---

## 5. DISPOSITIONS

| ID | Finding | Anchor | Disposition |
|----|---------|--------|-------------|
| RC-1 | Canvas `aspect-ratio:1` off uncapped width → 680px square | `EasingCurveCanvas.vue:269-273`; live 680×680 | **SHIP-in-H** (Fix-1) |
| RC-2 | Editor root uncapped, not a container (`container-type:normal`, `max-width:none`) | `EasingSidebar.vue:2`; live 724px, no container | **SHIP-in-H** (Fix-1) |
| RC-3 | Inner wash border touches header (nested bordered GlassPanel in bordered Card) | `TimingFunctionPanel.vue:17-45` + glass.css:48-52 | **SHIP-in-H** (Fix-2) |
| RC-4 | Header "too small" relative to giant canvas | `TimingFunctionPanel.vue:19` `text-heading` | **SHIP-in-H** (Fix-3) |
| RC-5 | `viewBox` 17× easing-sample recompute per render | `EasingCurveCanvas.vue:146-165` | **MEASURE-FIRST** (gate §4.5) |
| A | EasingSidebar has NO header (parity gap) | `EasingSidebar.vue` (no title element) | **SHIP-in-H** (Fix-4) |
| B | Aspirational "container-query-friendly" comment, zero CQ in tree | `EasingCurveCanvas.vue:266-268` | **SHIP-in-H** (made true by Fix-1) |
| C | `demo/CLAUDE.md` lists non-existent `CubicBezierControls.vue` | `demo/CLAUDE.md` controls table | **RECORD** (doc fix) |
| D | `text-display` resolves to 16px not φ^2 (≈42px) | live probe; clobbered display rung | **glass-ui-/D7-HANDOFF** (NOT this lane) |
| E | `/#/easing` redirects to `#/spring`; card transiently 0×0 on remount; viewport reverts to 390 on nav | live nav observations §1 | **cross-ref D12** (scene-state) — NOT this lane |

---

## 6. SUMMARY (one breath)

The easing editor is "FAR too big" because **the curve canvas has no block-size ceiling
and lives in no container context**: `aspect-ratio:1` on a `width:100%` SVG inside a
724px `max-width:none` card yields a measured **680×680px** square eating 77% of an 883px
panel (live, 1440×900). The idiomatic, Baseline-2023 fix is a one-motion transposition
straight from modern-web-guidance: **make the editor root a `container-type:inline-size`
container and size the canvas with `aspect-ratio:1` + `block-size: clamp(160px, 38cqi,
280px)`** — bounded, container-relative, centered. Separately, the `TimingFunctionPanel`
"border touching header" is a **double-chrome** defect (a bordered wash GlassPanel nested
in a bordered Card with `pb-1`/`gap-2`) — collapse to one surface and bump the title one
φ-rung (`text-heading`→`text-title`). EasingSidebar should gain the same header for parity.
Five falsifiable proof gates (`proof:easing-canvas-bounded`, `-panel-height`,
`-header-clearance`, `-container-context`, `-bezier-drag-frame-budget`) let H lock it.
No legacy path, no polyfill owed (CQ + aspect-ratio + clamp all Baseline Widely available).
