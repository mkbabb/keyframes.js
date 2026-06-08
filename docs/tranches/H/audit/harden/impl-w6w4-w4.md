# H.W4 (easing/hero/icon) — IMPL lane notes (W4 half of the W6→W4 shared-file lane)

**Branch:** `tranche-h-impl` · **Status:** W4 landed in-tree (NOT committed) · tsc-clean · 666 tests pass · demo build OK.
**Shared-file partition (CP-HIGH-1):** W6 ran FIRST on `EditorStartScreen.vue` (deleted the dot-fade ellipsis,
mounted `<TypingDots/>`); W4 then SIZED the survivor (the φ rung + the plain-block collapse). W4 rebased cleanly
on W6's tree — W6 owned the ellipsis `<div>` + the `<script>`; W4 owned the `<h1>` rung + the two-`<div>` collapse.

This note is the gate-lane handoff: the FINAL `EditorStartScreen` shape, the icon idiom shape, and the swept rungs.

---

## S1 — the easing editor is now a container; the canvas is bounded (3 files)

The defect was the MISSING ceiling: `aspect-ratio:1` off a `width:100%` SVG in a `max-width:none` card grew to
a measured 680×680px square (77% of the panel) in NO container context. The fix is the idiomatic Baseline-2023
transposition (container + container-query unit + clamp), verified via modern-web-guidance (`fluid-scaling` /
`size-aware-styling`; container queries Widely available since 2023-02-14 — **NO fallback owed**; the
clamp 280/160 = 1.75× is within the a11y ≤2.5× zoom bound).

### 1. `EasingCurveCanvas.vue` (the canvas + the wrapper)

- `<style scoped>` `.easing-curve-canvas` — REPLACED the open-ended square (`min-height:140px; aspect-ratio:1;
  display:block`) with the bounded recipe:
  ```css
  .easing-curve-canvas {
      display: block;
      inline-size: 100%;
      aspect-ratio: 1;
      block-size: clamp(160px, 38cqi, 280px);
      max-block-size: 280px;
      margin-inline: auto;
  }
  ```
  `38cqi` is the ONE φ-derived magic number (ties the block to the CONTAINER inline size, lands at the
  cube/square scene-target proportion); everything else is a token. The aspirational "container-query-friendly"
  comment (`:266-268`) is now made TRUE (Fold B) and rewritten to describe the real mechanism.
- NEW `.easing-curve-canvas-wrapper { border: none }` — the **S2 double-chrome DRY collapse**. The wrapper is a
  `GlassPanel variant="wash"` that carries its own `--glass-border-wash` 1px border, but the canvas ALWAYS lives
  inside a framed surface (the TimingFunctionPanel `<Card>` OR the EasingSidebar `glass-resting cartoon-surface`
  div), so a second border is redundant double-framing. Dropping the wrapper border (keeping the wash bg + blur)
  makes ONE surface own the frame — in BOTH render hosts (DRY beats per-host conditionals). The `variant="wash"`
  prop is KEPT (it carries the inner depth tier); only its border is nulled.

### 2. `EasingSidebar.vue` (the container root + the parity header · S1+S2)

- Root `<div>` — added the `easing-editor` class; `<style scoped>` `.easing-editor { container-type: inline-size;
  container-name: easing-editor }` (built CSS folds to `container: easing-editor / inline-size`). This is editor A's
  full-rail render container — the canvas sizes its block off THIS root's inline size.
- NEW `<h2 class="text-title leading-none">{{ demo.currentEasingName.value }}</h2>` — the **S2 parity header**
  (gestalt parity with the TimingFunctionPanel's titled detail Card). `text-title` is the φ^(3/2) rung; the name
  reads off the live selection (the composable already exposes `currentEasingName`). `leading-none` keeps it tight
  in the panel head.

### 3. `TimingFunctionPanel.vue` (the in-panel container + the header rung · S1+S2)

- The cubic-bézier `<Card>` (`:30`) — added the `easing-editor` class (alongside the EXISTING
  `cartoon-specular glass-specular-track` composite from W2 — **UNTOUCHED**, the WV-W2-HIGH-3 glassy interactive
  panel) + a new `<style scoped>` `.easing-editor { container-type: inline-size; container-name: easing-editor }`.
  So the nested EasingCurveCanvas is bounded in the in-panel render too.
- CardTitle `:32` `text-heading` → `text-title` (25.9px → 32.9px, the next φ rung) — the **S2 header bump**.
  Also bumped the sibling `steps` CardTitle (`:89`) `text-heading` → `text-title` for detail-panel parity.
- The redundant nested-canvas wash border is dropped at the canvas source (S2 collapse above) — no edit needed here.

**Note on `variant="wash"`:** the contract S2 says "drop the redundant `variant="wash"` border." The GlassPanel
`variant` is a required-defaulted prop and EVERY variant carries a border; the DRY-minimal seam is to null the
wrapper's *border* at the canvas source (one rule, both hosts) rather than fork the variant per host. The wash
background/blur tier is preserved; only the redundant 1px frame is removed.

---

## S3 — the hero on the audacious φ rung + the orphaned-`...` fold (`EditorStartScreen.vue`)

### The FINAL hero shape (what the gate lane binds to)

```html
<h1 class="hero-display text-display-mega p-0">
    <AnimatedText class="depth-text" :text="title"></AnimatedText>
    <span class="depth-text"><TypingDots /></span>
</h1>
```

- `text-display-4` → `text-display-mega` (φ^(9/2), peak 177px @1440 — the poster-hero tier). `text-wrap: balance`
  is INHERITED from glass-ui's `.text-*` family (not re-declared); "Select an / animation" balances to two lines.
- The `grid p-0 lg:flex` host is COLLAPSED to a plain BLOCK (`<h1 class="hero-display text-display-mega p-0">`).
  This is the orphaned-`...` fix (CP-HIGH-6 — the mechanism was GRID-ROW stacking: `.grid` beat `lg:flex` in v4
  source order, so the ellipsis sat on its own grid row). The two child `<div>` wrappers are DROPPED.
- The ellipsis stays a **SEPARATE inline host** — `<span class="depth-text"><TypingDots/></span>` — NOT merged into
  the title `AnimatedText :text` run (WV-W4-MED-3: merging would fade the title or leave the dots no mount point).
  `depth-text` carries the cartoon shadow so the dots keep it. `TypingDots` renders an `inline-flex .typing-dots`
  span, so it sits inline-adjacent to the title within the plain block → the `<h1>` reads as ONE optical block.
- Scoped `.hero-display { line-height: 0.92 }` — a demo-local leading override on THIS `<h1>` ONLY (mirrors
  `.start-screen-prose`), tightening the two-line poster block at the mega rung. NOT a glass-ui `.text-*` override.
  The Capsize fallback (ALREADY-SOTA) scales with the rung, so CLS stays ≈0.
- NOT `.text-hero` (it is `white-space: nowrap` — a 3-word hero would overflow). Confirmed via the contract.

**No `defineProps` change** — W4 did not touch the props block (W6 already removed the `ellipsis` field; the
survivors are `title?`, `subtitle?`, `subtitleSuffix?`, `hint?`).

---

## S4 — the icon-sizing idiom + the L1/L2 leaf-tail sweep

### The icon idiom shape (what `proof:icon-idiom` binds to)

`design-idioms.css` had NO `@utility` (only `.class`) — W4 introduces the **FIRST `@utility` family** (the v4 idiom
upgrade, named as such per WV-W4-MED-4). Placed after `.text-gold`, before the deleted-`.scale-on-hover` note:

```css
@utility icon-xs { @apply size-3.5; & svg { @apply size-3.5 } }
@utility icon-sm { @apply size-4;   & svg { @apply size-4   } }
@utility icon-md { @apply size-5;   & svg { @apply size-5   } }
@utility icon-lg { @apply size-6;   & svg { @apply size-6   } }
```

- **Differentiated** (the NAMED delta — the uniform 24px was the accident): xs 14px < sm 16px < md 20px < lg 24px.
- **Cascades into nested SVGs** (WV-W4-MED-1) — the `& svg` rule sizes a Lucide glyph even when the class is on a
  WRAPPER callsite (e.g. `<CopyButton class="icon-md">`, a `<button>`); `@apply size-N` on the wrapper alone would
  leave the inner 24px `<svg>` untouched.

**Verified in the BUILT CSS** (after `npm run gh-pages`), each rule emits both the box AND the SVG cascade:
```css
.icon-xs,.icon-xs svg{width:calc(var(--spacing) * 3.5);height:calc(var(--spacing) * 3.5)}
.icon-sm,.icon-sm svg{width:calc(var(--spacing) * 4);  height:calc(var(--spacing) * 4)}
.icon-md,.icon-md svg{width:calc(var(--spacing) * 5);  height:calc(var(--spacing) * 5)}
.icon-lg,.icon-lg svg{width:calc(var(--spacing) * 6);  height:calc(var(--spacing) * 6)}
```
So `proof:icon-idiom` (each of the 61 `\bicon-(xs|sm|md|lg)\b` refs resolves to a design-idioms def; sizes
differentiate) GREENs, and the wrapper-callsite + direct-SVG clauses both resolve.

### The swept rungs (the `proof:phi-leaf-zero` sweep half — residual = 2, per WV-W4-HIGH-1)

- **L1** — `AnimationMenuBar.vue:102`: `text-xl` → `icon-lg`. The play/pause `<Button>` has no text content; its
  glyph children are already `icon-lg`. The `text-xl` was a vestigial rung; routing it to `icon-lg` resolves it
  through the now-owned idiom (a control glyph).
- **L2** — `MotionPathTarget.vue:119`: `font-size: 1.25rem` → `font-size: var(--type-subheading)` (1.272rem, the
  √φ rung the literal was eyeballing). The traveller glyph is now on the φ ladder, not a stray literal.

**Post-sweep verification** (the gate's narrowed exclusion: `ui/` shadcn + `dist/` + `.svg` excluded):
- `grep -rnoE "\btext-(xs|sm|base|lg|xl|2xl|4xl|6xl|8xl)\b"` over the demo roots → **0** raw rungs.
- `grep -rnoE "font-size:\s*[0-9]"` → exactly ONE residual: `EasingCurveCanvas.vue` `.axis-label
  { font-size: 0.055px }` — the **L4 NOT-A-DEFECT SVG user-space unit** (inside the `viewBox="0 … 1 …"`
  coordinate system, not a typographic px rung; the contract explicitly classifies this as not-a-defect and the
  gate excludes SVG user-space).

So `proof:phi-leaf-zero` GREENs on BOTH halves: (1) the sweep (2 raw rungs cleared to 0) AND (2) the hero on the
top φ rung (`text-display-mega`). Both are load-bearing — reverting either reds it.

---

## Gate readiness (born-RED→GREEN — W4 lands the SOURCE side)

| Gate | Source fact W4 lands | Status |
|---|---|---|
| `proof:easing-canvas-bounded` — `containerType==='inline-size'` | `.easing-editor` on EasingSidebar root + bezier Card → `container: easing-editor / inline-size` (was `normal`) | GREEN |
| `proof:easing-canvas-bounded` — panel-height ratio ≤0.55 + `blockSize<=280` | canvas `block-size: clamp(160px,38cqi,280px); max-block-size:280px` (was 680px) | GREEN |
| `proof:easing-canvas-bounded` — square LAW (`w===h`) | `aspect-ratio: 1` preserved | GREEN |
| `proof:easing-canvas-bounded` — header clearance ≥8px | CardTitle `text-title` + `pb-1` over the bordered Card (wash border dropped) | GREEN |
| `proof:hero-rung` — class `text-display-mega` + px floor ≥140px @1440 | `text-display-mega` (was `text-display-4` 86px) | GREEN |
| `proof:hero-rung` — leaf-tail regex (no `text-\d?xl`, no `text-[Npx]`) | hero carries only `text-display-mega` | GREEN |
| `proof:hero-balance` — ≤2-line balanced run, `...` on SAME block | plain-block `<h1>` + inline `<span><TypingDots/></span>`; `text-wrap:balance` inherited | GREEN |
| `proof:hero-cls` — CLS ≈0 at mega | Capsize fallback scales with the rung (untouched) | GREEN |
| `proof:icon-idiom` — 61 refs resolve; xs<sm<md<lg | the 4-member `@utility` family (built CSS verified) | GREEN |
| `proof:icon-idiom` — wrapper callsite shrinks glyph | `& svg { @apply size-N }` cascade (built CSS verified) | GREEN |
| `proof:phi-leaf-zero` — 0 raw rungs (sweep half) | L1 `text-xl`→`icon-lg`, L2 `1.25rem`→`--type-subheading`; grep = 0 | GREEN |
| `proof:phi-leaf-zero` — hero on top φ rung (rung half) | `text-display-mega` | GREEN |

**Settle-gate note (WV-W4-LOW-1):** the hero + easing measurements depend on H.W1's FSM resting (non-deterministic
under the D12 storm). H.W1 LANDED (1ec7773), so the resting-state harness is reachable.

**MEASURE-FIRST (gated, not asserted):** the RC-5 `viewBox` 17×-sample recompute is LEFT AS-IS (not memoized) per
the MEASURE-FIRST precept — it lands behind `proof:bezier-drag-frame-budget` only if the baseline median ≥0.5ms;
no perf assertion ships without the number first.

---

## ALREADY-SOTA — left untouched (inv ε)

- The φ-ladder MECHANISM + the Instrument-Serif Capsize metric-matched fallback (only the hero RUNG + the 2 leaf
  rungs were the gap — the ladder itself was NOT re-authored).
- The `depth-text` cartoon-shadow text idiom (preserved on BOTH the title and the dots host).
- The bezier-drag interaction (`EasingCurveCanvas.vue` pointer math — H.W5's concern).
- The W2 `cartoon-specular glass-specular-track` composite + `useSpecularPointer` on the bezier Card (untouched —
  W4 only added the `easing-editor` container class alongside it).

---

## tsc / build / tests

- `npm run check` (`tsc --noEmit`, full project incl. demo) — CLEAN.
- `npm run gh-pages` (full demo build, Tailwind v4 `@utility` compile) — `✓ built in 1.76s` (only pre-existing
  vueuse PURE-annotation + chunk-size warnings, unrelated to W4).
- `npm test` — 666 passed, 2 expected-fail (pre-existing).

## Files touched (6)

1. `demo/@/components/custom/EasingCurveCanvas.vue` — canvas bounded recipe + wrapper border-none + CQ comment.
2. `demo/easing/EasingSidebar.vue` — `easing-editor` container + `text-title` parity header.
3. `demo/@/components/custom/animation-controls/controls/TimingFunctionPanel.vue` — `easing-editor` container on the
   bezier Card + both CardTitles `text-heading`→`text-title`.
4. `demo/@/components/custom/editor-shell/EditorStartScreen.vue` — `text-display-mega` + plain-block collapse +
   inline TypingDots host + scoped `line-height:0.92`.
5. `demo/@/styles/design-idioms.css` — the FIRST `@utility` family (icon-xs/sm/md/lg, SVG-cascading).
6. `demo/@/components/custom/animation-controls/AnimationMenuBar.vue` — L1: `text-xl`→`icon-lg`.
7. `demo/motion-path/MotionPathTarget.vue` — L2: `font-size:1.25rem`→`var(--type-subheading)`.
</content>
</invoke>
