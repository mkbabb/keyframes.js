# H.W4 gate lane — `proof:easing-canvas-bounded` + the hero gate set (IMPL notes)

**Branch:** `tranche-h-impl` · **Status:** four gates authored + wired in-tree (NOT committed) ·
tsc-clean · all four GREEN on the landed source · all four born-RED-verified.
**Lane:** the W4 SOURCE side landed first (see `impl-w6w4-w4.md`); this note is the GATE
authorship for the W4 easing/hero clauses (the `proof:*` that BITE). The W6 gate lane
(`proof:typing-dots`/`proof:dogfood-hero`/cascade) and the icon/φ-sweep lane
(`proof:icon-idiom`/`proof:phi-leaf-zero`) are SIBLING lanes — this lane touched neither
their scripts nor clobbered their `package.json`/`ci.yml` entries (verified).

---

## The four gates (scripts + the clauses that bite)

All four mirror `scripts/proof-demo-shell-grid.mjs` / `proof-stage-not-clipped.mjs`: a
`serveDist()` ephemeral http server over the BUILT `dist/gh-pages/` + Playwright resolved via
`KF_PLAYWRIGHT_DIR ?? REPO` (`playwright-core` then `@playwright/test`); a STATIC half that
always runs (where one exists); a BROWSER half whose skip becomes a HARD FAIL under
`KF_REQUIRE_BROWSER=1` (so a SHIP is never green-reported un-exercised). Settle-gated on the
H.W1 FSM resting (WV-W4-LOW-1 / HD-W4-6): the route is pinned via an IN-PAGE hash assignment
(NOT `page.goto` — `goto` clears storage + kills the H.W1 reconcile trap), the machine is
polled to rest (`localStorage["keyframes-js-scene-machine"].activeScene`), and the viewport is
RE-ASSERTED after navigation.

### 1. `scripts/proof-easing-canvas-bounded.mjs` (H.W4 S1/S2)

Browser-only. Settles `#/easing`, opens the controls pane + the easing tab (the `EasingSidebar`
is teleported into the easing `TabsContent` — it mounts ONLY when the pane is open + the easing
control is active), waits for the FULL-RAIL render (`.easing-editor` root + `.easing-curve-canvas`
with real area). The 680px born-RED is pinned to THIS full-rail render (WV-W4-MED-2 / HD-W4-3).

| # | Clause | Kind | GREEN today | Born-RED proof |
|---|---|---|---|---|
| 1 | `getComputedStyle(.easing-editor).containerType === 'inline-size'` | **born-RED anchor** (layout-invariant) | `inline-size` | drop the `.easing-editor` container → `normal` → REDS (verified) |
| 2 | canvas-height ÷ panel-height ≤ 0.55 | **born-RED anchor** | 0.391 | (see note) |
| 3 | computed `aspect-ratio: 1 / 1` (the square LAW) | structural invariant | `1 / 1` | drop `aspect-ratio:1` → REDS |
| 4 | parity header (`.easing-editor > h2`) → canvas-wrapper gap ≥ 8px | structural | 12.0px | collapse the header gap → REDS |
| 5 | computed `block-size` ≤ 280px | **DEMOTED** post-fix ceiling | 160px | drop the clamp → 300px > 280 → REDS (verified) |

**MEASURE-FIRST finding on the square LAW (clause 3) — the spec's "SVG bbox `width===height`"
is NOT assertable as a rendered-box equality.** The `--rail-width` is a FIXED 344px token (not
viewport-scaled), so the canvas inline-size is always 300px while `block-size` clamps to the
160px FLOOR (38cqi of 344 ≈ 130 < 160). An explicit `block-size` OVERRIDES `aspect-ratio`, so the
rendered box is **300×160 — NOT square**. A naive `getBoundingClientRect().width === height`
assert would RED on the CORRECT fix (a false failure). The honest square LAW the canvas keeps is
the DECLARED `aspect-ratio: 1 / 1` (renders a true square whenever the clamp is not clipping;
keeps the curve undistorted via `preserveAspectRatio` when it is). Clause 3 asserts the computed
`aspect-ratio`, which BITES (drop it → the SVG goes rectangular → reds) and is truthful about the
clamp.

**Why the container-context anchor is load-bearing (and clause 2/5 are not the sole anchors).**
In the born-RED probe (container + clamp reverted) the canvas grew to 300×300 (square) and the
panel to 549px → ratio **0.547 ≤ 0.55** — it passed near-VACUOUSLY on this rail width. This is
exactly the WV-W4-MED-2 / HD-W4-3 concern. The `containerType === 'inline-size'` clause is the
layout-INVARIANT born-RED anchor that reds unconditionally (`normal` pre-W4), and clause 5
(block-size 300 > 280) also reds — so the gate bites on a layout-robust anchor, not the
state-dependent ratio. Clause 2 is kept as a born-RED anchor per the spec but it is the
container-context + block-size clauses that carry the bite.

### 2. `scripts/proof-hero-rung.mjs` (H.W4 S3)

STATIC source clauses (the `<h1 class>` in `EditorStartScreen.vue`, comment-blanked) + a BROWSER
half at `/` (the home `#start-screen` slot, gated on `isHome`; the machine rests on `home`).

| # | Clause | GREEN today | Born-RED proof |
|---|---|---|---|
| (a) | source + resolved `<h1>` className carries `text-display-mega` | yes | `text-display-4` → REDS |
| (a') | NOT `text-display-4` (no legacy beside replacement) | yes | keep `text-display-4` → REDS |
| (b) | computed `font-size ≥ 140px` at 1440×900 (a PX FLOOR, NOT a `≥--type-display-mega` clamp compare — WV-W4-MED-2) | 177.4px | 86.1px on `text-display-4` < 140 → REDS |
| (c) | NO raw leaf-tail rung (`text-\d?xl` / `text-(xs|sm|base)` / `text-[Npx]`) on the hero | yes | add `text-2xl`/`text-[120px]` → REDS |

Born-RED verified: reverting to `hero-display text-display-4 grid p-0 lg:flex` → 4 failures
(no mega, still text-display-4, 86.1px < 140, resolved-mega absent).

### 3. `scripts/proof-hero-balance.mjs` (H.W4 S3 — the orphaned-`...` fold)

Browser-only at 1440×900 + 390×844 (the contract's "screenshot diff at 1440 + 390"). Asserts the
LAYOUT fold only — the dot CADENCE is `proof:typing-dots` (WV-W4-MED-3 / HD-W4-4).

| # | Clause | Widths | GREEN today | Born-RED proof |
|---|---|---|---|---|
| 1 | NO grid-row stacking (`display !== grid` OR < 2 explicit row tracks) — the CP-HIGH-6 orphan mechanism | both | `display:block`, rows `none` | `grid p-0 lg:flex` → `display:grid` w/ 2 rows → REDS |
| 2 | title balances to ≤ 2 lines (lift-down word-box tops clustered within ½ line-height) | both | 1 (1440), 2 (390) | over-wrap → REDS |
| 3 | the TypingDots host band OVERLAPS the last title word's line box (inline-adjacent — no orphan row) | desktop 1440 | +157px overlap | grid orphan → dots below last word, overlap −6.7px → REDS |

**MEASURE-FIRST on clause 3's viewport scope.** At 390 with the mega rung (99px) the title
legitimately wraps to two lines ("Select an / animation") and the dots follow the last word in
NATURAL text flow (a 3rd visual row) — that is text wrapping, NOT the grid-row orphan. So clause 3
(dots-on-same-band) is the DESKTOP-anchored bite (where "Select an animation" fits one line and
the dots trail it inline), while clauses 1+2 (the structural grid-fix + the ≤2-line balance) hold
at BOTH widths. This keeps the gate honest: it bites the grid-row ORPHAN mechanism without
false-failing on the mobile mega-rung's natural wrap.

Born-RED verified: reverting to the grid host → clause 1 reds at both widths, clause 3 reds at 1440.

### 4. `scripts/proof-hero-cls.mjs` (H.W4 S3 — the MEASURE-FIRST CLS companion)

Browser-only at 1440×900, fresh context, a `PerformanceObserver('layout-shift')` installed at
document-start (`addInitScript`, `buffered:true`, `hadRecentInput` excluded), the machine rested on
`home`, `document.fonts.ready` awaited.

| # | Clause | GREEN today | Bite |
|---|---|---|---|
| 1 | hero-ATTRIBUTED STEADY-STATE CLS ≤ 0.02 (entries whose `sources[].node` touch the hero, in a post-entrance window) | 0.00000 (8/8 runs) | a steady-state font-swap reflow of the hero → reds |
| 2 | the hero's nearest positioned ancestor is `position:absolute`/`fixed` + ≤ 1px in-flow height (the structural reason CLS stays ≈0) | absolute + 0px | move the hero into document flow → REDS (verified by probe) |

**This is a regression GUARD, not a born-RED-on-the-old-rung clause — and that is CORRECT per the
spec.** The spec says "the `<h1>` LCP node CLS contribution ≈ 0 AFTER the mega bump — the Capsize
fallback STILL neutralizes the swap." CLS is ≈0 on BOTH the old and the mega rung because the hero
lives in a zero-height `absolute pointer-events-none` overlay (`EditorStartScreen.vue:3`) — its
internal reflow shifts nothing in flow. So `proof:hero-cls` GREENs on the reverted rung too; its
bite is STRUCTURAL (clause 2): if the hero leaves the zero-height overlay, the walk-up finds a
height-900 ancestor → clause 2 reds (verified by an in-page `position:static` simulation: the
positioned ancestor became `absolute` height **900px**, failing the `absolute && ≤1px` check).

**MEASURE-FIRST robustness fix — clause 1 attributes + windows (the two flake roots fixed).** The
first cut of clause 1 summed TOTAL page CLS, which intermittently spiked to **0.16** and FALSE-bit
the hero. Two distinct roots, both fixed:
1. **Attribution.** The 0.16 entry's `sources[].node` were `SPAN.lift-down.depth-text` (the title
   words) + `H2.start-screen-prose` — i.e. the START-SCREEN entrance, not the stage. But total-CLS
   also folds in the demo's own stage/scene mount churn. Fix: sum ONLY entries whose `sources[].node`
   IS the hero `<h1>` / a descendant / the hero overlay (the spec's "the `<h1>` CONTRIBUTION").
2. **Entrance vs steady-state.** The hero's own 0.16 was the deliberate `<Transition appear>` +
   per-word `lift-down` entrance (fires on ANY rung — NOT the mega-bump's font-swap risk), caught
   mid-flight on slow runs. Fix: a TWO-WINDOW measure — settle (entrance + `fonts.ready`, 1.5s),
   RESET `__lsEntries`, then a clean 800ms steady-state window. The font-swap/rung risk shows in the
   steady-state window; the one-shot entrance is excluded. Result: 8/8 stable PASS (was 3/5 flaky).

**Capsize note (measured, not a defect).** The condensed Instrument Serif cannot metric-match BOTH
the vertical box AND the horizontal advance of the Georgia-based fallback, so a forced JS
`font-family` swap shows the title wrap-count differ (1 line real vs 2 lines fallback @1440). But
the steady-state hero CLS is 0.00000 — the overlay non-displacement (clause 2) neutralizes it
regardless of any internal wrap reflow. The Capsize fallback is ALREADY-SOTA (inv ε) — untouched.

---

## Wiring (no clobber of the sibling lanes)

- **`package.json`** — added 4 `scripts` entries (`proof:easing-canvas-bounded`, `proof:hero-rung`,
  `proof:hero-balance`, `proof:hero-cls`) after the W6 `proof:dogfood-hero` entry; appended all 4 to
  the `proof:all` chain after `proof:dogfood-hero`, before `proof:brittleness`. Valid JSON.
- **`.github/workflows/ci.yml`** — added 4 browser-gated steps (each `env: KF_REQUIRE_BROWSER: "1"`)
  in the demo job AFTER the `npm run gh-pages` build, immediately after the `proof:typing-dots`
  step. Valid YAML. They join `proof:demo-shell-grid`/`proof:stage-not-clipped`/`proof:cartoon-*`
  as the H.W3/W2/W4 browser-gated cohort.
- The W6 lane's `proof:typing-dots`/`proof:dogfood-hero` and the icon lane's
  `proof:phi-leaf-zero`/`proof:icon-idiom` entries are intact (verified in `proof:all` + ci.yml).

---

## Verification matrix (all run on `tranche-h-impl`)

| Gate | GREEN on landed source | RED on reverted source | skip-path (no browser) | hard-fail (KF_REQUIRE_BROWSER) |
|---|---|---|---|---|
| `proof:easing-canvas-bounded` | ✓ 5/5 clauses | ✓ container + block-size red | n/a (browser-only) | ✓ |
| `proof:hero-rung` | ✓ 6/6 clauses | ✓ 4 failures | ✓ static runs, browser skips, exit 0 | ✓ exit 1 |
| `proof:hero-balance` | ✓ 5/5 clauses | ✓ grid + orphan red | n/a (browser-only) | ✓ |
| `proof:hero-cls` | ✓ 2/2 clauses | ✓ overlay clause red (probe) | n/a (browser-only) | ✓ |

- `npm run check` (`tsc --noEmit`, full project incl. demo) — CLEAN.
- `npm run gh-pages` — builds OK (pre-existing vueuse PURE + chunk-size warnings only).
- Each gate exits 0 on the landed source under `KF_REQUIRE_BROWSER=1`.

## Files touched (this lane)

1. `scripts/proof-easing-canvas-bounded.mjs` — NEW (browser, 5 clauses).
2. `scripts/proof-hero-rung.mjs` — NEW (static + browser, source-shape + px-floor + leaf-tail).
3. `scripts/proof-hero-balance.mjs` — NEW (browser, the orphaned-`...` fold).
4. `scripts/proof-hero-cls.mjs` — NEW (browser, the MEASURE-FIRST CLS companion).
5. `package.json` — 4 `scripts` entries + the `proof:all` chain.
6. `.github/workflows/ci.yml` — 4 browser-gated demo-job steps.
