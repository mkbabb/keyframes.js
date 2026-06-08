# H.W6 (typing-dots) — IMPL lane notes (W6 half of the W6→W4 shared-file lane)

**Branch:** `tranche-h-impl` · **Status:** W6 landed in-tree (NOT committed) · tsc-clean.
**Shared file partition (CP-HIGH-1):** W6 runs FIRST on `EditorStartScreen.vue` — it
DELETES the dot-fade ellipsis node; W4 then sizes the survivor. This note is the handoff
so W4 sizes the hero without re-entangling the title run.

---

## What W6 changed (3 files)

### 1. NEW — `demo/@/components/custom/TypingDots.vue` (the dogfood seam · S1)

The dedicated staggered-dot primitive. Renders N explicit dot `<span>`s, each driven by
its OWN engine animation (the inv-ζ seam).

**Public API:**

```ts
defineProps<{
  count?: number;  // default 3 — how many dots to render + drive
  glyph?: string;  // default "." — the STATIC glyph each dot renders (never interpolated, S3)
}>()
```

No emits, no slots, no exposed methods. Drop-in: `<TypingDots />` renders the three-dot
"..." ellipsis blink. `<TypingDots :count="5" />` would render five.

**The recipe (verified):**

- PRIMARY loop = a per-dot `CSSKeyframesAnimation` (`iterationCount: "infinite"` → `Infinity`,
  WV-W6-HIGH-2 — NOT `NumericAnimation`, which is single-pass and would need a forbidden
  hand-rolled rAF re-loop). Each dot is a STANDALONE (non-grouped, `managed:false`) animation
  that owns its own rAF loop via `.play()` — no `AnimationGroup` needed (a single dot needs
  no compositor; CopyButton uses a group only to coordinate two icons).
- Imports (the inv-ζ dogfood symbol, WV-W6-MED-1):
  - `import { CSSKeyframesAnimation } from "@src/animation/engine";` — the kf ENGINE class (the
    dogfood symbol the `proof:dogfood-hero` gate asserts; mirrors `CopyButton.vue:24`).
  - `import { stagger } from "@src/animation/stagger";` — the delay-DISTRIBUTION primitive.
  - `import { steppedEase } from "@mkbabb/value.js";` — the discrete-cadence CURVE (NOT the
    dogfood symbol — it is a value.js export, so a `from "@src"` grep does NOT match it; this is
    intentional and matches WV-W6-MED-1's guidance: steppedEase MAY be the curve, the kf-engine
    CLASS import is the proof).
- Per-dot delays = `stagger(count, { each: 160, from: "first" }).delays(count)` → `[0, 160, 320]ms`
  for count=3 (left-to-right cadence, strictly increasing — satisfies `proof:typing-dots (b)` /
  WV-W6-LOW-1's "left-to-right cadence for from:first").
- Keyframes (opacity ONLY — S3, the literal "." is static `<span>` text, never a keyframe value):
  `{ "0%": {opacity:0.2}, "50%": {opacity:1}, "100%": {opacity:0.2} }`. Rest 0.2 → peak 1 → 0.2.
  NEVER 0 (kills the 43% ghost window; `min opacity = 0.2 ≥ 0.15` → `proof:typing-dots (c)`).
- Timing: `duration: 1200ms` (FIXED, NOT text.length-derived; ≤1.6s → `proof:typing-dots (d)`),
  `timingFunction: steppedEase(4, "jump-none")` (discrete dot cadence).
- `respectReducedMotion: true` — the shared engine `withReducedMotion` authority snaps each dot to
  its resting frame under PRM (replacing the hand-mirrored `@media (prefers-reduced-motion)` block).
  The `.typing-dot` CSS sets `opacity: 0.2` as the pre-first-frame / PRM-rest paint (readable).
- Constants (named, top of `<script setup>`): `CYCLE_MS=1200`, `STEP_MS=160`, `REST_OPACITY=0.2`.
- Lifecycle: `onMounted` builds + `.play()`s one anim per dot el (collected via `useTemplateRef`
  + `ref` in `v-for` → `HTMLElement[]`); `onBeforeUnmount` `.stop()`s each (no dangling rAF).

**Headless verification (run + passed):** `stagger` delays `[0,160,320]` strictly increasing;
`iterationCount` resolves to `Infinity`; `duration` 1200; compiled keyframes carry opacity
floor `0.2` (segment 0) + peak `1.0` (segment 1) — the engine interpolates within `[0.2, 1.0]`,
never below 0.2.

### 2. `EditorStartScreen.vue` (the call-site re-point · S2)

- `:15-24` — the ellipsis `<div>` now renders `<TypingDots />` (was
  `<AnimatedText class="dot-fade depth-text" :text="ellipsis">`). The `<div>` is KEPT as a
  SEPARATE inline host carrying `depth-text` (the cartoon-shadow idiom, preserved) — this is the
  W4 mount point per WV-W4-MED-3 (the dots are NOT merged into the title `AnimatedText` `:text` run).
- `<script setup>` — added `import TypingDots from "@components/custom/TypingDots.vue";`.
- REMOVED the now-dead `ellipsis?: string` prop (+ its `"..."` default). The trailing "..." is now
  a fixed three-dot blink, not a configurable text run. (No external consumer passed `ellipsis` —
  grep-verified.) A NOTE comment records the API change for downstream.

### 3. `AnimatedText.vue` (the cascade decouple + no-legacy delete · S2)

- DELETED the `.dot-fade` rule + `@keyframes dotFade` (was `:93-107`) — no legacy beside the
  replacement. The dual-`animation`-shorthand collision (`.lift-down` + `.dot-fade` on one span)
  is now STRUCTURALLY gone: the dots are their own substrate (TypingDots), so no node carries two
  `animation` shorthands. Satisfies the cascade lint.
- The PRM `@media` block now guards ONLY `.lift-down` (the `.dot-fade` arm removed with the rule).
- Updated the stale `$attrs` doc-comment (it cited `dot-fade depth-text`; the hero now passes only
  `depth-text` to the title).
- UNTOUCHED: `.lift-down` + `@keyframes liftDown` (the title lift), the `sr-only` a11y mirror, the
  word-split substrate, the `duration` computed (still consumed by the title spans via
  `animationDuration` `:28`). AnimatedText remains single-purpose (the title hero).

---

## The EXACT state W4 inherits (so W4 sizes the survivor without re-entangling)

`EditorStartScreen.vue` template, post-W6 (UNCHANGED from the live tree EXCEPT the ellipsis node):

```
<div class="absolute … mt-28 grid h-0 w-screen … lg:mt-24 …">          ← :2-3 (W7/H.W3 overlay host — NOT W6's)
  <h1 class="text-display-4 grid p-0 lg:flex">                          ← :5-6  ★ W4 OWNS this: the φ rung
    <div><AnimatedText class="depth-text" :text="title"/></div>          ← :8-13   the TITLE run (W6 untouched)
    <div class="depth-text"><TypingDots /></div>                         ← :22-24  the ELLIPSIS host (W6's survivor)
  </h1>
  <h2 class="start-screen-prose text-title …">…</h2>                     ← :26-29 (subtitle prose)
  <h2 v-if="hint" class="start-screen-prose text-subheading …">…</h2>   ← :30-35 (hint prose)
</div>
```

**W4's coupling points (what W4 must do to the hero, per H.W4.md §S3 + WV-W4-MED-3):**

1. **The φ rung bump is W4's, NOT W6's.** `<h1>` `:6` still reads `text-display-4 grid p-0 lg:flex`
   — UNTOUCHED by W6. W4 swaps `text-display-4 → text-display-mega` and collapses the
   `grid p-0 lg:flex` host to a plain BLOCK (the orphaned-`...`-on-its-own-grid-row fix, CP-HIGH-6
   — the mechanism is grid-row stacking, not flex-wrap).
2. **The ellipsis host is a SEPARATE inline `<div>` (`:22-24`), ready to collapse inline.** Per
   WV-W4-MED-3, W6 deliberately did NOT merge the dots into the title `AnimatedText :text` run (that
   would fade the title or leave the dots no mount point). W4 collapses the two child `<div>`s so the
   title + the inline dots read as ONE optical block. `<TypingDots />` is the inline mount point — it
   renders an `inline-flex` `.typing-dots` span, so it sits inline naturally; W4 can drop the wrapper
   `<div>`s and place `<TypingDots />` inline after the title `AnimatedText` if the plain-block
   collapse wants it inline-adjacent. The `depth-text` class on the host carries the cartoon shadow —
   W4 should preserve it (or move it onto a surviving inline wrapper) so the dots keep the shadow.
3. **W6 already deleted the `dot-fade` MECHANISM.** Per the W6→W4 ordering in H.W4.md §S3: since W6
   landed FIRST, the ellipsis does NOT keep `dot-fade` — it is fully the TypingDots primitive. W4
   therefore owns ONLY the hero LAYOUT (the rung + the block collapse), not the dot mechanism.
4. **W6 removed the `ellipsis` prop.** If W4 touches the `defineProps`/`withDefaults` block, note the
   `ellipsis` field is gone (W6 deleted it). The surviving props are `title?`, `subtitle?`,
   `subtitleSuffix?`, `hint?`.

**No collision risk for W4:** W6's edits to `EditorStartScreen.vue` are confined to the ellipsis
`<div>` (`:15-24`) + the `<script>` import/props. W4's edits are the `<h1>` class (`:6`) + the
two-`<div>` collapse. They touch DIFFERENT lines of the same `<h1>` — W4 rebases cleanly on W6's tree.

---

## Gate readiness (born-RED→GREEN, per H.W6.md §Hard gate)

W6 implements the SOURCE side of every clause (the gate SCRIPTS themselves are H.W8's gate-regime
upgrade; W6 leaves the tree GREEN-able):

| Clause | Source fact W6 lands | Status |
|---|---|---|
| `proof:typing-dots (a)` 3 distinct animated spans | `v-for="i in count"`, count=3 → 3 `.typing-dot` spans, each with its own `CSSKeyframesAnimation` | GREEN |
| `proof:typing-dots (b)` left-to-right cadence | `stagger(3,{from:"first"})` → delays `[0,160,320]` (strictly increasing) | GREEN |
| `proof:typing-dots (c)` never vanish (min ≥0.15) | opacity floor 0.2 (rest), peak 1.0; engine interpolates in `[0.2,1.0]` | GREEN |
| `proof:typing-dots (d)` short fixed cycle (≤1.6s) | `duration: 1200ms` fixed (not text.length-derived) | GREEN |
| `proof:dogfood-hero` (inv ζ) kf-engine import | `CSSKeyframesAnimation` from `@src/animation/engine` | GREEN |
| Cascade lint — no double-`animation` shorthand | `.dot-fade` DELETED; dots on a disjoint substrate (TypingDots); only `.lift-down` remains on AnimatedText spans | GREEN |

WV-W6-HIGH-1 harness note: `proof:typing-dots` (a)/(b)/(c)/(d) mount `<TypingDots/>` in ISOLATION
(its own component) — route-free; the home-route harness is unreachable pre-H (the D12 storm
unmounts home in <1 rAF). The SOURCE fix is FSM-orthogonal — TypingDots is a kf-local substrate
with zero FSM/layout-grid dependency.

---

## tsc

`npm run check` (`tsc --noEmit`, full project incl. demo) — CLEAN after all W6 edits.
