# impl-w12-verify — H.W12 VERIFY LANE (builds · tests · 10 new gates · regression · BITE)

**Lane:** VERIFY (run builds/tests; integrate only obvious lane seams).
**Branch:** `tranche-h-impl`. **Date:** 2026-06-08.
**Engine FENCED** (inv ζ — `src/animation` untouched). **No git commit.**
**No source edits** beyond the two transient BITE injections (added → gate reds →
removed → gate greens; the working tree is restored to the impl-lane state).

All commands run from the repo root. Browser gates serve the BUILT
`dist/gh-pages/` and launch chromium via playwright (`@playwright/test` +
`playwright-core` both resolvable; `~/Library/Caches/ms-playwright` populated).
`KF_REQUIRE_BROWSER=1` set on every browser gate so a playwright-absent skip is a
HARD FAIL (the affordance is never silently waved through).

---

## §1 — Foundational (verbatim results)

| # | Command | Result |
|---|---------|--------|
| 1 | `npx tsc --noEmit` | **TSC_EXIT=0** — zero diagnostics, clean. |
| 2 | `npm test` (vitest, jsdom) | **GREEN** — `Test Files 68 passed (68)` · `Tests 682 passed \| 2 expected fail (684)`. NPM_TEST_EXIT=0. |
| 3 | `npm run gh-pages` | **GREEN** — `✓ built in ~1.3s`, GH_PAGES_EXIT=0. (Warnings only, ALL pre-existing + non-fatal: vueuse `/* #__PURE__ */` INVALID_ANNOTATION, the >500kB monaco/three chunk-size note, the CubeScene/engine INEFFECTIVE_DYNAMIC_IMPORT statics — none are errors.) |

**Size-ceiling note (I10 MEASURE-FIRST).** No size ceiling needed updating. The
test suite carries no size-ceiling that moved. The demo-file size ceiling is a
SEPARATE gate (`proof:demo-no-oversize`, §2) and remains GREEN with headroom — see
the MEASURE-FIRST numbers in §4. The 2 "expected fail" vitest cases are
pre-existing `test.fails` markers (not W12-introduced regressions).

---

## §2 — The 10 NEW W12 gates (KF_REQUIRE_BROWSER=1 where browser) — ALL GREEN

| Gate | Item | Result | Evidence (verbatim highlight) |
|------|------|--------|-------------------------------|
| `proof:dragscrub-single` | I8 | **PASS** | the dance lives in EXACTLY ONE home `demo/@/composables/useDragScrub.ts` (1 recorded carve-out: `SquareScene.vue`); spring/sequence/motion-path carry ZERO `setPointerCapture` + window pointer-listener dance. |
| `proof:composable-encapsulation` | I9 | **PASS** | the gesture engine is in `useMotionPathGesture.ts` (11 projection sites); `MotionPathTarget.vue` holds ZERO projection math; every store write inside the stores module (2 recorded seed-on-read lazy-inits); no writable computed writes in its GET half. |
| `proof:demo-no-oversize` | I10 | **PASS** (born-GREEN regression guard) | all 162 demo `.vue`/`.ts` ≤ 500L (max `useSequenceDemo.ts` @ 486L per the gate's counter); 4/4 `use*Demo` colocate a sibling `*Target.vue`; 4/4 stage dirs colocate Target + composable + Keys; the engine `src/animation` FENCED + excluded. |
| `proof:no-brittle-selector` | I11 | **PASS** | ZERO class-string DOM walks in spring/sequence/motion-path (every ref a `useTemplateRef`); `SAMPLE_STEP` is a named documented constant in `useMotionPathGesture.ts`; the square-viewBox scale is ONE documented `clientToUserUnits` helper in `motionPathGeometry.ts`. |
| `proof:styling-idioms` | I12 | **PASS** (FORK-I12 **reduction branch** — see §5) | 108 distinct referenced idiom-shaped classes, ALL resolve to an owned definition (design-idioms.css ∪ glass-ui ∪ tw-animate-css ∪ scoped `<style>`); zero referenced-but-undefined demo-authored idiom beyond `icon-*`; the W4 `icon-*` four are in the set and subsumed. |
| `proof:sequence-rows-draggable` | I3 | **PASS** | `.seq-handle` per row = `role="slider"` + `@pointerdown` + `:aria-valuenow`; `reseatRow()` re-emits `delays[i]` AND re-sorts `sequence.entries` by `at`. LIVE: dragging row 1's handle re-authored its `at:` (0ms → 1440ms) AND the stagger re-sorted `[0,260,520,780,1040] → [260,520,780,1040,1440]` (the engine re-ordered, not relabelled). |
| `proof:motion-path-editable` | I3 | **PASS** | `motionPathGeometry` exports `DEFAULT_POINTS` + `buildPathD()`, `PATH_D = buildPathD(DEFAULT_POINTS)`; the guide binds `:d="demo.pathD"` AND the gesture `watch(pathD)` re-writes the traveller's `offset-path` to the SAME `d`. LIVE: dragging a control handle re-shaped guide `d` AND `offset-path` to the SAME new `d` (no-drift invariant). |
| `proof:motion-path-copy` | I3 | **PASS** | `useMotionPathDemo` derives `copyablePath = "offset-path: path('${pathD}')"`; `<CopyButton :text="demo.copyablePath">` + a `.artifact <code>` block. LIVE: a real CopyButton click wrote the EXACT `offset-path: path('M 60 200 …Z');` string to the clipboard; after a handle edit the artifact re-read the single source (what you copy IS what you shaped). |
| `proof:easter-egg` | I3 | **PASS** | EACH of 7 scenes wired + FIRED: sequence reel (typed "reel"→cascading overshoot) · motion-path wink (full-lap drag→😎) · cube Roll (dblclick die-roll on a `CSSKeyframesAnimation`) · amiga Boing (dblclick wakes the Boing-Ball `AnimationGroup`) · square Tumble (dblclick barrel-roll via `SpringProgress`) · spring Derby (dblclick staggered `SpringProgress` wave, peak Δleft 772px) · easing Gallery (dblclick tours the catalogue, `.bezier-path d` cycles). Every egg dogfoods the engine (inv ζ). |
| `proof:easing-sidebar-minimal` | J | **PASS** | static: no `<LabeledInput label="value">`, no `label="value"`, no `<h2>`, no dead value anchors. LIVE: 0 `<h2>` + 0 CSS-value input + 0 "value" row; `<EasingSelect>` is the sole selector; ONE Card-root (no double container); duration track 296px ≈ CardContent inner 296px (full-width); canvas grew block-size 260px > the W11 ~160px in-sidebar baseline AND still fits (scrollHeight 660 ≤ clientHeight 660, overflow-y `auto` ≠ scroll). |

**`proof:ci-coverage`** (5): **PASS** — all 90 `proof:*` gates are invoked in CI (4
recorded exclusions); no ci.yml version literal disagrees with package.json; zero
workflow clones the glass-ui sibling / carries a `file:` ref; all 3 workflows
declare a top-level `concurrency:`. The 10 NEW W12 gates are wired into `proof:all`
+ `ci.yml`.

---

## §3 — NO regression (the W1 FSM · W11 DFA · W10 ribbon · J-composes set) — ALL GREEN

| Gate | Holds | Result |
|------|-------|--------|
| `proof:scene-machine-irrefragable` | W1 FSM | **PASS** — 6/6 ordered identity cells; suspend-no-orphan-raf stable; deep-link wins; deterministic restore. |
| `proof:scene-control-dfa` | W11 DFA | **PASS** — `.mjs` + vitest `Test Files 1 passed (1) · Tests 11 passed (11)`, EXIT 0. |
| `proof:scene-parity` | survivor set + per-mode interactivity | **PASS** — survivor new-mode set `{spring, sequence, motion-path}`; motionpath-drag · square-drag · easing-curve-editable all fire (the I3 affordances ADD interactivity, remove none). |
| `proof:stage-glass-card` | W11 I5 | **PASS** — easing/spring/sequence/motion-path each resolve ONE glass Card (data-surface=glass, radius 16px, NOT cartoon) — the four-protagonist convergence. |
| `proof:scene-uses-standard-ribbon` | W10 + I8 | **PASS** — easing + spring(solver) mount the STANDARD `PlaybackRibbon` (scrubber + Play/Reverse on `.btn-playback` grid-cols-2, equal 148×40 cells). I8 EXTENDS to sequence/path WITHOUT forcing them onto `PlaybackRibbon` (cube/easing/spring subjects unchanged). |
| `proof:bezier-grown` | W11 I7 (J composes) | **PASS** — canvas grew to 223px@1280 / 232px@1440 > the W9 220px ceiling; no "editing:" subtitle; fits without scroll. |
| `proof:label-subgrid` | W11 I1 (J composes) | **PASS** — 5 labels uniform 86.16px right-aligned to one track via `subgrid`; 3-row panel uniform 43.19px. (J removed a row the subgrid no longer needs; the invariant holds.) |
| `proof:demo-console-clean` | W0 | **PASS** — the H-A1 `serializeEasing` crash is dead; no throw resting on `/#/amiga` or `/#/easing`. |
| `proof:icon-idiom` | W4 substrate | **PASS** — the 4 `icon-*` resolve + strictly differentiate (xs<sm<md<lg) + SVG-cascade; the substrate `proof:styling-idioms` EXTENDS. |
| `proof:scene-icons` | W10 G1 | **PASS** — every scene icon an inline `<svg>` with its own expressive color (not currentColor). |
| `proof:easing-sidebar-normalized` | W10 G5/G6 (J composes) | **PASS** — ONE quiet-cartoon Card, standard Labeled* rows; J removes a row WITHOUT breaking the normalized-sidebar ≥1-row invariant. |

---

## §4 — MEASURE-FIRST numbers

**I10 — demo-file 500L ceiling (the born-GREEN regression-guard headroom).** Top demo
files by `wc -l`:

```
485  demo/sequence/useSequenceDemo.ts   (the gate's counter reports 486 — trailing-newline; ≤500 either way)
466  demo/spring/useSpringDemo.ts
439  demo/easing/useEasingDemo.ts
434  demo/sequence/SequenceTarget.vue
417  demo/@/components/custom/animation-controls/AnimationControlsGroup.vue
373  demo/@/components/custom/EasingCurveCanvas.vue
367  demo/@/components/custom/animation-controls/controls/AnimationControls.vue
364  demo/@/components/custom/animation-controls/controls/AnimationControlsControls.vue
```

Largest demo file = 485–486L → **14–15L headroom** under 500L. The I3 enrichments
(draggable rows, editable path, copy artifact, eggs) landed WITHOUT pushing any
Target over 500L — the gesture engine LIFTED into `useMotionPathGesture.ts`, the
sequence/spring demos kept their composables under the ceiling. The engine
(`src/animation`, >500L files: engine.ts 1375, animations.ts 870, …) is FENCED +
excluded by the gate. **No size-ceiling update required** (the guard is born-GREEN,
its bite is a FUTURE over-split).

**I12 — referenced-idiom set vs owned definitions.** 108 distinct referenced
idiom-shaped classes; definition corpus = design-idioms+style+brand 34 + glass-ui
583 + tw-animate-css 48 + scoped `<style>`. ALL 108 resolve. **Zero
referenced-but-undefined demo-authored idiom beyond the W4-owned `icon-*` four.**

**I8 — drag-dance consumers collapsed.** ONE home (`useDragScrub.ts`) + 1 recorded
carve-out (`SquareScene.vue`'s 2-D `{x,y}` per-axis box drag — it EARNS its
difference, per the precept "keep the scene-specific structure that earns it").
spring/sequence/motion-path drags ALL ride the shared seam.

---

## §5 — FORK-I12 disposition (the honest record)

`proof:styling-idioms` is the ONE gate whose ORIGINAL born-RED premise was STALE
(the `a-styling-idioms §1` "61 silent no-op `icon-*`" finding was W4-CLOSED in
`084feb9` — the four `@utility icon-(xs|sm|md|lg)` resolve via
`design-idioms.css:209-232`, gated GREEN by `proof:icon-idiom`).

Per the H.W12 §Hard-gate FORK-I12 mandate, the impl lane MEASURED-FIRST whether any
referenced idiom-shaped class beyond the resolved `icon-*` is undefined. **The probe
found NONE** — all 108 referenced idiom-shaped classes resolve to an owned
definition. Therefore `proof:styling-idioms` clause (a) **honestly REDUCES to the
born-GREEN regression-guard branch** (it bites a FUTURE un-owned idiom-shaped
class), NOT a papered born-RED.

This is recorded as the gate intends — the gate's own output names it:
> "FORK-I12 reduction branch: zero referenced-but-undefined demo-authored idiom
> beyond icon-* — born-GREEN regression guard, bites a future un-owned idiom."

This is the correct, non-vacuous disposition. The gate BITES a real future
regression (add a `<div class="depth-glow-XXX">` with no definition → it reds), and
it subsumes the W4 `proof:icon-idiom` substrate.

---

## §6 — BITE proof (the gates are not vacuous)

Each BITE: inject the regression → run the gate → confirm RED → remove the
injection → confirm GREEN. No residue (grep for `BITE-TEST`/`__biteDance` = 0
across `demo/`). The two touched files (`SpringTarget.vue`, `EasingSidebar.vue`)
remain `M` from the impl lanes (their impl-lane content is intact; only my transient
BITE lines were added then removed).

| BITE | Injection | Gate | RED proof | Restored |
|------|-----------|------|-----------|----------|
| #1 | Re-introduced a hand-rolled drag dance (`setPointerCapture` + window `pointermove`/`pointerup`) into `SpringTarget.vue` (reverting the `useDragScrub` extraction on the spring consumer) | `proof:dragscrub-single` | **FAIL** — `[one-home] 2 un-allowlisted files carry the hand-rolled drag dance` (useDragScrub.ts + SpringTarget.vue) AND `[scene-clean] 1 scene-target … still hand-roll part of the drag dance (SpringTarget.vue)`. | removed → **PASS** (EXIT 0). |
| #2 | Re-introduced the J1-deleted `<LabeledInput label="value">` CSS-value text input into `EasingSidebar.vue`, rebuilt gh-pages | `proof:easing-sidebar-minimal` | **FAIL (3)** — `static S1 (J1): still renders <LabeledInput label="value">`, `static S2 (J2): still carries label="value"`, `B1 (live): "value" row:1 (want 0)`. | removed → rebuilt → **PASS** (EXIT 0). |

Both BITEs bit on BOTH their static and (for #2) their live/rendered halves — the
gates assert the actual source-shape AND the rendered DOM, not a grep that a stub
could satisfy.

---

## §7 — Confirmations (the contract's closing asks)

- **Sequence rows DRAG** — confirmed live: row 1 `at:` 0→1440ms, stagger re-sorts. ✓
- **Motion-path control-points EDIT** — confirmed live: guide `d` + traveller
  `offset-path` move to the SAME new `d` in lockstep. ✓
- **EACH scene has an egg** — confirmed: 7/7 fired (sequence/motion-path/cube/amiga/
  square/spring/easing). ✓
- **Easing sidebar is MINIMAL** — confirmed: no value input, no "value" label, no
  `<h2>`, full-width duration, ONE container, grown canvas without scroll. ✓
- **I8 extends the ribbon WITHOUT forcing sequence onto `PlaybackRibbon`** —
  confirmed: `proof:scene-uses-standard-ribbon` cube/easing/spring subjects
  unchanged; sequence keeps its timeScale/Reset domain verbs on `.btn-interactive`
  beside the shared `.btn-playback` skin. ✓
- **The engine (`src/animation`) is FENCED** — no engine source touched; the eggs +
  affordances dogfood public primitives (`Sequence.add`/re-sort, `ManualTimeline`,
  `setChildTime().render()`, `SpringProgress`, `CSSKeyframesAnimation`,
  `AnimationGroup`) — inv ζ. ✓

---

## §8 — Result: ALL GREEN

`tsc 0` · `npm test green (682+2xfail)` · `gh-pages built` · 10/10 new W12 gates
GREEN (`proof:styling-idioms` = honest FORK-I12 reduction branch) ·
`proof:ci-coverage` GREEN · 11 regression gates GREEN (no W1/W9/W10/W11 regression) ·
both BITEs bit and restored. **No RED-that-should-be-GREEN. No git commit.**
