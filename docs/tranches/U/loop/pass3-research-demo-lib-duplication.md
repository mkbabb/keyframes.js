# PASS-3 research — the DEMO ↔ LIBRARY duplication census

**Lane:** `demo-lib-duplication-census` (a NEW pass-3 loop item)
**Authority:** OD-U21 (OWNER-ASKS row 7, 2026-07-10, verbatim): *"likely a great
deal of duplication in functionality between the demo and the library."* The demo
must DOGFOOD the constellation — never hand-roll a primitive the library (kf) or
value.js already ships. The lane-19 `num()`/`toRGB()` findings
(`docs/tranches/U/audit/lane-19-demo-scenes.md:70-72,106`) were the first two
instances; this census generalizes.
**Mode:** READ-ONLY. Method: read `demo/@/utils`, the demo composables, the scene
composables, and the instrument-editor utils against the library surface
(`src/animation` exports + the value.js subpaths).
**Plain language throughout; every term of art is glossed at first use.**

---

## §0 — Glossary (terms this census uses)

| term | meaning |
|---|---|
| **the constellation** | the three published packages the demo exists to showcase: keyframes.js (kf), `@mkbabb/value.js`, parse-that. "Dogfood" = the demo consumes them instead of re-writing their code. |
| **dogfood** | eat your own dog food — the demo uses the very library APIs it advertises, so the demo is itself proof the API works. |
| **duplication** | a demo function that RE-IMPLEMENTS logic an installed package already exports (parse, color math, easing eval, unit handling, interpolation, clamp/lerp, timing, serialization). |
| **excision shape** | how the duplication is removed: which library symbol replaces it, and through WHICH import entry. |
| **the two kf entries** | the LIGHT barrel (`@mkbabb/keyframes.js` — value.js-free static exports: `SpringProgress`, `RAFPlayback`, `NumericAnimation`, `stagger`, …) and the HEAVY engine (reached via `await loadAnimationEngine()`, or `@mkbabb/keyframes.js/engine`, which carries value.js). |
| **value.js subpath** | value.js ships tree-shakeable entries: `@mkbabb/value.js/math`, `/color`, `/units`, `/parsing`, `/easing`, `/transform`, `/quantize` (plus the root barrel). The demo already declares `@mkbabb/value.js` as a direct dependency (`demo/CLAUDE.md` Key Dependencies), so importing from it is dogfood, not new weight. |
| **LIGHT / HEAVY** | LIGHT code is value.js-free; HEAVY code pulls value.js in. The census flags, per excision, whether the library equivalent is LIGHT-reachable (no engine load) or HEAVY. |
| **perceptual color** | color interpolation in a perceptually-uniform space (oklab) so a mix looks even to the eye — kf's headline feature. A naive sRGB channel lerp is NOT perceptual and reads as muddy mid-tones. |
| **true gap** | the demo genuinely needs something NO installed package ships → a named LIBRARY ask, not a demo re-implementation. |

---

## §1 — The census (every duplication, ranked by severity)

Two kinds appear: **HARD** duplications (a whole primitive re-written that the
library ships verbatim-equivalent) and **PARTIAL** duplications (the demo's helper
overlaps a library symbol but adds a thin, legitimate wrapper — the cure is
*consume-and-adapt*, not delete).

### D1 — HARD — `NAMED_EASING_BEZIER` re-tables value.js `bezierPresets`

- **Demo site:** `demo/@/components/custom/instrument/transport/animationDescriptions.ts:54-84`
  — a 30-row `Record<string, [x1,y1,x2,y2]>` mapping named easings (`ease-in-sine`,
  `ease-out-cubic`, `ease-in-out-back`, …) to cubic-bezier control points. Consumed
  by `easingGroups.ts` (`isBezier` flag), `useEasingDemo.ts:20`,
  `useTimingFunctionEditor.ts`.
- **Library equivalent:** value.js `bezierPresets`
  (`@mkbabb/value.js` root or `/easing`). **value.js's own docstring on this symbol
  reads: *"source of truth, rather than hand-rolling parallel tables."*** The demo is
  the exact hand-rolled parallel table that comment warns against.
- **Excision shape:** import `bezierPresets` from value.js; delete `NAMED_EASING_BEZIER`.
  LIGHT-reachable (pure data, value.js `/easing` subpath).
- **RECONCILIATION REQUIRED (not pure indirection):** the two tables carry DIFFERENT
  control points for the sine/quad/cubic/expo families — the demo uses the classic
  easings.net approximations (`ease-in-sine` = `[0.47, 0, 0.745, 0.715]`), value.js
  uses the CSS-spec/MDN values (`ease-in-sine` = `[0.12, 0, 0.39, 0]`). Excising to
  value.js CHANGES the rendered curve for those tiles. The excision must state which
  set is canonical (value.js is the constellation's authority → adopt value.js's
  values; the visual delta is the correction, not a regression). See D-GAP-1 for the
  keys value.js does NOT carry.

### D2 — HARD — `TIMING_DESCRIPTIONS` re-tables value.js `timingFunctionDescriptions`

- **Demo site:** `animationDescriptions.ts:15-51` — a `Record<string,string>` of
  human blurbs ("slow start, fast end", "bouncing ramp up") keyed by easing name.
- **Library equivalent:** value.js `timingFunctionDescriptions`
  (`Record<string,string>`, exported from `/easing`).
- **Excision shape:** import `timingFunctionDescriptions`; delete the demo copy.
  LIGHT-reachable.
- **RECONCILIATION:** the demo keys on kebab CSS keywords (`"ease-in"`); verify value.js
  keys on the same space (its `timingFunctions` map keys are camelCase `easeInQuad`,
  so `timingFunctionDescriptions` may key camelCase). If the key spaces differ, the
  excision consumes value.js's map through the existing `hyphenToCamelCase` normalizer
  (value.js already ships it) — still a consume, not a re-table. Demo-only descriptions
  with no value.js entry stay as a small demo delta (see D-GAP-2).

### D3 — HARD — `useSquareDemo.num()` re-implements unit parsing (lane-19 #1)

- **Demo site:** `demo/scenes/square/useSquareDemo.ts:75-87` — a hand-rolled
  normalizer that turns `"42px"→42`, `"108%"→1.08`, passes numbers through, and
  digs `.value` off a stray object.
- **Library equivalent:** value.js `ValueUnit` (parse a CSS value string into
  `{value, unit}`), `parseCSSValueUnit`, `convertToPixels`, `parseCSSPercent` — all
  the exact job `num()` hand-rolls, and the very grammar kf exists over.
- **Excision shape:** parse each leaf with `new ValueUnit(leaf)` (or
  `parseCSSValueUnit`) and read `.value` / fractionalize a percent unit; delete
  `num()`. value.js `/units` + `/parsing`, LIGHT-reachable. This is the lane-19
  mandate verbatim.

### D4 — HARD — `useSquareDemo.toRGB()` re-implements color parsing (lane-19 #2)

- **Demo site:** `useSquareDemo.ts:187-202` — a regex `rgb()` matcher + hex expander
  (`#abc`→`#aabbcc`, `parseInt(...,16)` per channel) → `[r,g,b]`.
- **Library equivalent:** value.js `parseCSSColor` / `Color` (parses hex, `rgb()`,
  `hsl()`, named, and every 2026 color form, into a channel model).
- **Excision shape:** `new Color(str)` (or `parseCSSColor`); read channels off it.
  value.js `/color`, LIGHT-reachable. Delete `toRGB`.

### D5 — HARD — `useSquareDemo.sweepHue()` re-implements color interpolation, NAIVELY (lane-19 #3)

- **Demo site:** `useSquareDemo.ts:206-214` (+ the inline `mix` lerp `:210`) — a
  linear **sRGB** channel lerp across three stops.
- **Library equivalent:** value.js `mixColorsN` / `sampleColorRampAt` /
  `sampleColorRamp` — multi-stop color mixing in a chosen space; and `mixColors` for
  a two-stop mix. **kf's headline is PERCEPTUAL (oklab) color interpolation** — the
  square scene hand-rolling a naive sRGB lerp is the demo actively CONTRADICTING the
  library it showcases. Note `SpringHeatmap.vue:169` already does this right via
  `color-mix(in oklab, …)`; the demo is internally inconsistent.
- **Excision shape:** `sampleColorRampAt(stops, t, "oklab")` (or `mixColorsN`); delete
  `sweepHue` + `toRGB` + `mix` together. value.js `/color`, LIGHT-reachable. This
  ALSO subsumes D4 (no separate channel parse needed).

### D6 — HARD (broad, by count) — the `clamp` class

- **Demo sites:** ~30 hand-rolled `Math.max(min, Math.min(max, x))` clamps, incl. FOUR
  named `clamp01` re-definitions across separate files:
  `scenes/sequence/SequenceScrubber.vue:48`, `SequenceTarget.vue:153`,
  `SequencePlayhead.vue:16`, `scenes/spring/SpringPhysicsFacet.vue:142`
  (also `SpringTarget.vue:180` `clampSweep`, `useSquareDemo.ts:243,338,339,382,383`,
  `useSquareKeyboard.ts:91,92`, `useSpringDemo.ts:281,294,417,422`,
  `useSequenceDemo.ts:180,273,320,395,420`, `useEasingDemo.ts:387`,
  `EasingScene.vue:73`, `useCubeRelit.ts:65`, `AmigaScene.vue:161`,
  `sceneFacility.ts:102`, `SpringHeatmap.vue:193-194,210-211,259,261`,
  `useAnimationProgress.ts:23,34`, `AnimationVisualizer.vue:107,185`,
  `AnimationControlsControls.vue:333`, `AnimationControlsGroup.vue:257,265`).
- **Library equivalent:** value.js `clamp(value, min, max)` (`/math`, LIGHT).
- **Excision shape:** ONE demo-shared import of value.js `clamp`; replace every
  `Math.max(0, Math.min(1, x))` with `clamp(x, 0, 1)` and delete the four `clamp01`
  copies. See §3's architectural fork on WHERE the demo imports it from.
- **Judgment:** individually trivial, collectively the largest single class and the
  one OD-U21 names by word ("clamp"). Worth a mechanical sweep; not worth a bespoke
  demo util that re-wraps `clamp` (that would be a fifth copy).

### D7 — HARD — `lerp`

- **Demo sites:** `demo/scenes/amiga/AmigaScene.vue:92`
  (`const lerp = (a,b,t) => a + (b-a)*t`) and the inline `mix` in `useSquareDemo`
  `sweepHue` (folds into D5).
- **Library equivalent:** value.js `lerp(start, end, t)` (`/math`, LIGHT).
- **Excision shape:** import `lerp`; delete the local copy.

### D8 — PARTIAL — `flattenVars` overlaps value.js `flattenObject`

- **Demo site:** `demo/@/components/custom/instrument/timeline/utils/flattenVars.ts`
  — recursively flattens a nested vars object to `Record<string,string>`, hyphen-joining
  keys, with a `transformKey` hook (used with value.js `camelCaseToHyphen` in
  `timelineEngine.ts:90`) and `valueOf`-based leaf detection.
- **Library equivalent:** value.js `flattenObject(obj)` (`/units`) + its inverse
  `unflattenObject`. value.js's flatten is the same structural operation kf's own
  pipeline uses (and per MEMORY it treats `calc()` atomically — the correct behavior
  the demo copy does NOT guarantee).
- **Excision shape:** CONSUME `flattenObject`, then apply `camelCaseToHyphen` to the
  keys where the caller wants it (value.js already ships that transform) — a
  compose, not a re-implementation. value.js `flattenObject`'s signature is
  `(obj) => Record` (no `transformKey`/`prefix` params), so the thin key-transform
  wrapper is legitimate demo glue, but the RECURSION + leaf-detection body must be
  value.js's, not the demo's. LIGHT-reachable. NOT a true gap — the compose exists today.

### D9 — PARTIAL — `generateCurveSVGPath` (cubic-bezier branch) vs value.js `cubicBezierToSVG`

- **Demo site:** `demo/@/components/custom/instrument/transport/controls/timingCurveUtils.ts:4-12`
  (a generic fn→SVG-path sampler) + `getCurvePath:37` (its `cubic-bezier` case builds
  the path from `CSSCubicBezier(0.4,0,0.2,1)`).
- **Library equivalent:** value.js `cubicBezierToSVG(x1,y1,x2,y2)` returns exactly an
  SVG path string for a bezier; the demo's `cubic-bezier` branch re-derives it by
  sampling.
- **Excision shape:** route the `cubic-bezier` case through `cubicBezierToSVG`. The
  GENERIC `generateCurveSVGPath(fn, n)` (arbitrary easing fn → path) has no value.js
  equivalent and stays (see D-GAP-3). value.js `/math`, LIGHT. This is the SMALLEST
  win; list it for completeness, not urgency.

### D10 — PARTIAL / GAP — `captureSnapshot` / `captureNonDefaultSnapshot` vs kf ingest

- **Demo site:** `demo/@/components/custom/instrument/timeline/utils/snapshotCapture.ts`
  — reads an element's `getComputedStyle` into a `{prop: value}` vars map (and a
  non-default variant diffing against a throwaway element).
- **Library equivalent (partial):** kf's HEAVY ingest zone already walks live computed
  styles — `resolveLiveKeyframes`, `fromLiveAnimations`, `adoptRunning`
  (`loadAnimationEngine()`), and value.js `getComputedValue`. None is a drop-in for
  "snapshot THESE props at THIS percent," so this is closer to a true gap than a
  duplication.
- **Excision shape:** none clean today. Flag as a candidate library ask (D-GAP-4) OR
  an accepted demo-owned helper (it is a UI-authoring convenience, not a library
  primitive). Recommend: KEEP as demo glue, note the overlap, do NOT force an excision.

### D11 — MINOR — `resolveColor` var() token resolution (amiga)

- **Demo site:** `demo/scenes/amiga/utils.ts:14-27` — resolves a `var(--token, fallback)`
  string to its computed value via `getComputedStyle(document.documentElement)`, for a
  Canvas2D `fillStyle` (which does not resolve `var()`).
- **Library equivalent:** none clean. value.js `getComputedValue` resolves computed
  UNITS on an element, not a bare custom-property token lookup. This is genuine
  DOM/Canvas glue.
- **Verdict:** NOT duplication — KEEP. Listed so the sweep does not mis-flag it.

---

## §2 — The clean consumers (the good pattern, cited so the sweep does not touch them)

These demo sites ALREADY dogfood correctly — they are the target shape, not defects:

- `keyframes/utils/parseAnimationCSS.ts` — value.js `parseCSSStylesheet` /
  `extractAnimationOptions` / `extractStyleRules` + kf `loadAnimationEngine()`.
- `timeline/utils/timelineEngine.ts` — kf `loadAnimationEngine()`
  (`CSSKeyframesAnimation`, `resolveKeyframes`, `CSSKeyframesToString`) + value.js
  `camelCaseToHyphen`/`hyphenToCamelCase`.
- `scenes/cube/matrix-editor/transformMath.ts` — value.js `FunctionValue` + `ValueUnit`
  (+ gl-matrix `mat4` for the matrix seed).
- `transport/composables/useTimingFunctionEditor.ts` + `scenes/easing/useEasingDemo.ts`
  — value.js `CSSCubicBezier`, `cubicBezierToString`, `timingFunctions` + kf
  `NumericAnimation`.
- `@/utils/kfEngine.ts` — the sanctioned HEAVY-engine warm/accessor over
  `loadAnimationEngine()` (the dogfood boundary itself).

---

## §3 — The architectural fork the excisions surface (for SPEC-B3)

The LIGHT math/color primitives (D5, D6, D7, D8, D9) all live in value.js, NOT on kf's
LIGHT barrel. So each excision must choose an import ENTRY, and the choice is uniform
enough to rule ONCE:

- **Option A — the demo imports value.js subpaths directly** (`@mkbabb/value.js/math`,
  `/color`, `/units`). Honest: value.js is a first-class constellation package the demo
  already depends on and showcases; the subpaths are tree-shakeable and LIGHT. No kf
  surface change. **Recommended** — it is the minimal, truest dogfood, and it keeps
  kf's LIGHT barrel from bloating with pass-through re-exports.
- **Option B — kf re-exports the value.js math primitives on its LIGHT barrel** so the
  demo reaches `clamp`/`lerp`/`scale` "through kf." Rejected unless the OWNER wants kf
  to present a unified math surface: it adds pass-through exports kf does not otherwise
  need, and `proof:boundary`/`proof:published-surface` would have to bless them.

**Recommendation: Option A**, value.js subpaths, for D3–D9. HEAVY items (none here —
all these are LIGHT) would go through `loadAnimationEngine()`.

---

## §4 — True gaps (named LIBRARY asks — NOT demo re-implementations)

| # | The gap | Who should ship it |
|---|---|---|
| **D-GAP-1** | value.js `bezierPresets` lacks the `quart`/`quint` families the demo's `NAMED_EASING_BEZIER` carries (`ease-in-quart`, `ease-out-quint`, …). | value.js ask: extend `bezierPresets` with the quart/quint rows (they are standard easings.net presets). Until then the demo keeps ONLY those rows as a documented delta over value.js — not the whole table. |
| **D-GAP-2** | If value.js `timingFunctionDescriptions` omits demo-only blurbs (e.g. `"cubic-bezier": "custom curve"`, the `steps` family), those few rows are a demo delta. | value.js ask (small): add the missing description rows; OR accept the demo delta. Reconcile the key space (kebab vs camelCase) first. |
| **D-GAP-3** | No constellation symbol samples an ARBITRARY easing fn to an SVG path — value.js ships only `cubicBezierToSVG` (bezier-specific). The demo's generic `generateCurveSVGPath(fn, n)` fills this. | value.js ask (optional): a generic `easingToSVGPath(fn, n)`; OR accept the demo's generic sampler as legitimate UI glue (recommended — it is presentation, not core math). |
| **D-GAP-4** | No kf helper does "snapshot THESE props at THIS percent" from a live element (the timeline authoring need behind `snapshotCapture.ts`). | Likely NOT a library ask — it is UI-authoring glue over `getComputedStyle`. Recommend accept as demo-owned; note the ingest-zone overlap so no one re-hunts it. |

---

## Verdicts for SPEC-B3

1. **EXCISE the three lane-19 primitives from `useSquareDemo.ts` as ONE motion (D3+D4+D5).**
   Replace `num()` with value.js `ValueUnit`/`parseCSSValueUnit`; replace
   `toRGB`+`sweepHue`+the inline `mix` with value.js `sampleColorRampAt`/`mixColorsN`
   in **oklab** (perceptual — the library's headline). Delete all three plus
   `resolvePaletteSweep`'s channel plumbing. Import from value.js `/units`, `/parsing`,
   `/color` subpaths (LIGHT). This is the lane-19 mandate, now widened to the whole
   square palette-sweep egg.

2. **EXCISE `NAMED_EASING_BEZIER` (D1) and `TIMING_DESCRIPTIONS` (D2) from
   `animationDescriptions.ts`** to value.js `bezierPresets` and
   `timingFunctionDescriptions` (`/easing`, LIGHT). value.js's OWN docstring names this
   table the thing to consume, not re-roll. **Adopt value.js's control-point values as
   canonical** (the constellation authority) and record the curve delta as a correction.
   Carry the quart/quint rows as an explicit demo delta pending **D-GAP-1**; reconcile
   the description key space (kebab vs camelCase) via the existing `hyphenToCamelCase`.

3. **SWEEP the `clamp` class (D6) and `lerp` (D7)** to value.js `clamp`/`lerp` (`/math`,
   LIGHT). Delete all four `clamp01` definitions and the amiga `lerp`; replace the ~30
   inline `Math.max/Math.min` clamps with `clamp(x, min, max)`. Do NOT introduce a demo
   wrapper — import value.js directly (a wrapper would be a fifth copy).

4. **RE-BASE `flattenVars` (D8) onto value.js `flattenObject`.** Keep the thin
   `camelCaseToHyphen` key-transform as demo glue (compose over `flattenObject`), delete
   the hand-rolled recursion + leaf-detection body. This also inherits value.js's
   correct `calc()`-atomic handling. Not a gap — the compose ships today.

5. **ROUTE `generateCurveSVGPath`'s `cubic-bezier` branch through value.js
   `cubicBezierToSVG` (D9);** KEEP the generic fn-sampler (D-GAP-3 accepted as UI glue).
   Lowest priority; bundle with the animationDescriptions excision since they co-locate.

6. **RULE the import ENTRY once (Option A, §3):** demo excisions import value.js
   subpaths directly (`@mkbabb/value.js/math|color|units|parsing|easing`), LIGHT.
   Do NOT bloat kf's LIGHT barrel with pass-through math re-exports (Option B rejected
   absent an owner call for a unified kf math surface).

7. **KEEP, do not mis-flag:** `resolveColor` (D11, DOM/Canvas var glue) and
   `snapshotCapture` (D10 / D-GAP-4, timeline-authoring glue) are NOT duplications —
   record them so the sweep leaves them alone. The §2 clean consumers are the TARGET
   shape and stay untouched.

8. **BOOK the true gaps as constellation asks, not demo debt:** D-GAP-1 (value.js
   bezier quart/quint), D-GAP-2 (value.js description rows) → a value.js U-letter row;
   D-GAP-3 / D-GAP-4 → accepted demo-owned glue, closed with a note. A gap is a library
   ask; only a re-implementation of shipped functionality is a demo defect.
