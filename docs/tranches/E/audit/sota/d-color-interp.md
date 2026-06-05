# SOTA Audit — Lane D: Color Interpolation Perf + Science (DEEP)

**Scope:** the per-frame OKLab interpolation cost, the `getComputedValue` memo,
`color-mix` offload, wide-gamut handling, and the SOTA color-interp path. Goes
deeper than `a-vj-color-units` — this lane profiles the *runtime hot path* and
names the FOLD-VALUEJS-HANDOFF shape for the parts that live in value.js.

**inv-16:** keyframes.js findings → FOLD-E; value.js findings →
FOLD-VALUEJS-HANDOFF (value.js is dirty+active; do NOT write it — propose a
value.js tranche the owner formalizes).

---

## Method — the measured hot path

The per-frame color path, end to end:

1. `Animation.interpFrames` (`engine.ts:578-580`) → `lerpValue(eased, iv)` per
   InterpolatedVar.
2. `lerpValue` (`value.js units/interpolate.ts:113`) dispatches via the
   pre-resolved `iv._lerp` → `lerpColorValue` (`interpolate.ts:57`).
3. `lerpColorValue` walks each channel, `unwrapDeep`s start/stop, lerps (hue
   channel routes through `interpolateHue`), writes back into `value.value`.
4. DOM apply: `transformTargetsStyle` (`keyframes utils.ts:305`) →
   `unflattenObjectToString` (`value.js units/utils.ts:115`) → per-value
   `ValueUnit.toString()` → for color, `Color.toString()`
   (`value.js color/index.ts:191`) → `target.style.setProperty`.

The collapse to the interpolation space (oklab) happens **once** at frame-prep
time in `normalizeValueUnits` (`value.js normalize.ts:379-398`) with
`inverse=true`, so endpoints are stored as *denormalized oklab* — there is **no
per-frame color-space conversion**. That is already correct and SOTA; the
matrix multiplies are amortized.

### Measured numbers (node, `dist/value.js`, 500k iters, warm)

| Path | lerp only | lerp + `toString()` |
|------|-----------|---------------------|
| numeric (`opacity` 0→1) | **7 ns** | **7 ns** |
| hex sRGB (`#ff0000`→`#00f`) | 98 ns | **294 ns** |
| `rgb()` | 85 ns | 286 ns |
| `oklch()` | 89 ns | 317 ns |
| `hsl()` | 86 ns | 281 ns |

`Color.toString()` alone = **191 ns**; the serialized string is
`oklab(53.99845437103836% 0.09620303924921089 -0.09284094315819447 / 100%)` —
**73 chars, full f64 precision**.

**Headline:** the *interpolation math is fast* (collapse is amortized). The
per-frame color cost is dominated by **(a) serialization (~190 ns, ~65%)** and
**(b) per-channel `unwrapDeep` + array churn in the lerp (~85 ns)**. A color
property is ~40× a numeric property per frame, and ~2/3 of that is `toString`,
not science.

---

## Findings

### D-1 · Per-frame `Color.toString()` allocates 3+ arrays and emits 73-char full-precision strings — the dominant color cost · FOLD-VALUEJS-HANDOFF

- **Where:** `value.js src/units/color/index.ts:191-200` (`Color.toString` →
  `values().slice(0,-1).map(...)` → `formatColor` `.join(" ")`,
  `index.ts:18-20`); reached every frame via `keyframes utils.ts:312`
  (`unflattenObjectToString` → `values.join(", ")` → `toString`).
- **Gap:** `toString()` calls `values()` (allocates an array, `index.ts:271`),
  then `.slice(0,-1)` (second array), then `.map()` (third array), then
  `formatColor` does `.join(" ")`. Three array allocations + a join + full-f64
  number stringify, **per color, per frame** (~191 ns measured). The output is
  73 chars at full precision — which the browser must then **re-parse every
  frame** in `setProperty`. CSS Color 4 §15 (serialization) and every SOTA
  engine round numeric color channels to a small fixed precision for exactly
  this reason.
- **Perf/elegance rationale:** the per-frame DOM-apply path does not need a
  human-readable string — it needs the *shortest valid* CSS the browser parses
  fastest. Two wins, independent: (1) a zero-alloc fixed-precision color
  formatter (write channels straight into a preallocated buffer / template, no
  intermediate arrays) — kills the 3-array churn; (2) round channels to a
  sensible precision (oklab L/a/b to ~4-5 sig-figs, alpha to ~3) — `oklab(54%
  0.0962 -0.0928)` is ~28 chars vs 73, halving both the format cost and the
  browser re-parse cost. GSAP/Motion both quantize color output for this reason.
- **Disposition:** FOLD-VALUEJS-HANDOFF. The fix is entirely inside value.js
  (`Color.toString` / a new `toCSSFast`/`toAnimationString` + `formatColor`).
  Propose a value.js tranche: *"zero-alloc, fixed-precision color serialization
  for the animation hot path."* keyframes consumes it transparently via
  `ValueUnit.toString` for `unit==="color"`.
- **Isomorphism:** precision rounding is a *visible* change to the serialized
  string (not pixels — sub-JND). Recommend the rounded fast-path be the
  **animation/apply** serializer, leaving the existing high-precision
  `toString` for round-trip/format use (`format.ts`). Pixels stable to within
  far below the OKLab JND (`DELTA_E_OK_JND = 0.02`, `gamut.ts:50`); 4-5 sig-figs
  on L/a/b is ~10⁴× under JND.

---

### D-2 · The interp output is always `oklab(...)` regardless of input syntax — an isomorphism + browser-reparse concern · FOLD-VALUEJS-HANDOFF (+ FOLD-E policy)

- **Where:** the interp space is fixed at frame-prep (`normalize.ts:366`,
  default `"oklab"`); the lerped value serializes in that space
  (`Color.toString`). A user animating `background: #ff0000 → #0000ff` gets
  `oklab(...)` written to `style.background` every frame.
- **Gap:** this is *spec-correct CSS Color 4 interpolation* (oklab is the L4
  default for non-legacy interpolation), and the **science is right**. But two
  costs ride along: (i) the browser re-parses a 73-char `oklab()` string each
  frame instead of a short `rgb()`; (ii) for **legacy sRGB inputs**
  (`#hex`/`rgb()`/named), CSS Color 4 §12 says legacy↔legacy color *transitions*
  interpolate in **sRGB** by default — the engine unconditionally upgrades them
  to oklab. That is arguably *better* perceptually, but it's a silent
  isomorphism departure from what the platform would do for the same two
  keyframes, and it's the slower-to-reparse form.
- **Perf/elegance rationale:** for sRGB-gamut endpoints, serializing the lerp
  result back as `rgb(r g b / a)` (the gamut-mapped sRGB, `gamutMapSRGB` already
  exists, `gamut.ts:299`) is *shorter to parse* AND keeps the output in the
  user's original family. The science choice (interpolate in oklab) and the
  serialization choice (emit rgb vs oklab) are **orthogonal** — interpolate in
  oklab, serialize the result as compact sRGB when both endpoints were sRGB-gamut
  legacy colors. Wide-gamut / explicit-oklab inputs keep oklab output.
- **Disposition:** FOLD-VALUEJS-HANDOFF for the *serializer* (value.js owns
  `Color.toString` + the "emit in source family" option); FOLD-E for the
  *policy* (keyframes decides, at frame-prep, an `outputSpace` hint —
  "preserve-source-family" vs "interp-space" — and threads it onto the
  InterpolatedVar). Propose value.js tranche: *"color serialization can target a
  requested output space distinct from storage space."*
- **Isomorphism:** preserving the source family for legacy sRGB is *more*
  isomorphic to platform behavior, not less; it's the conservative default.
  Keep oklab output for non-legacy inputs (matches WebKit/Blink — see D-6).

---

### D-3 · `lerpColorValue` re-derives `hueKey` + walks `keys()` + double `unwrapDeep` every channel every frame · FOLD-VALUEJS-HANDOFF

- **Where:** `value.js src/units/interpolate.ts:57-104`.
- **Gap:** for the overwhelmingly common case (oklab/rgb — *non*-cylindrical,
  `unit==="color"` with `Color<ValueUnit<number>>` channels), the per-frame body
  still: (1) re-computes `hueKey = CYLINDRICAL_HUE_COMPONENT[colorSpace]` every
  call (`interpolate.ts:64` — invariant for the IV's life); (2) `keys().forEach`
  with a closure allocation per call; (3) `ValueUnit.unwrapDeep` on *both* sv/ev
  per channel (`interpolate.ts:71-72`) — a `while` loop per channel even though
  the normalize step already flattened them; (4) an `instanceof ValueUnit`
  branch per channel write. That's the measured ~85 ns floor.
- **Perf/elegance rationale:** the dispatch already pre-resolves `_lerp` once via
  `prepareInterpVar` (`interpolate.ts:140-148`) — the same precompute discipline
  should pre-resolve *the channel plan*: a frozen array of `{ readKey, writeKey,
  isHue }` and whether channels are raw-number or ValueUnit-wrapped, computed
  once at prep. Then the per-frame loop is a flat `for` over a numeric array,
  zero closures, zero `instanceof`, zero `keys()` realloc. The hue method, color
  space, and channel shape are all invariant for the IV's lifetime — classic
  hoist-from-hot-loop. Mirrors the `_lerp` precompute that already exists.
- **Disposition:** FOLD-VALUEJS-HANDOFF (`interpolate.ts` + `prepareInterpVar`).
  Propose value.js tranche: *"precompute a per-IV color channel-plan in
  `prepareInterpVar`; flatten `lerpColorValue` to a closure-free numeric loop."*
- **Isomorphism:** pure refactor — byte-identical lerp outputs. No pixel change.

---

### D-4 · `getComputedValue` is memoized but the key/eviction story is the risk surface for color-via-`var()` · FOLD-VALUEJS-HANDOFF (verify)

- **Where:** `value.js src/units/normalize.ts:136-205` (`memoize(... )`),
  consumed by `lerpComputedValue` (`interpolate.ts:17-40`).
- **Gap (honest):** for the **color** lane this is mostly *not* on the hot path —
  colors collapse to oklab at prep and lerp as plain channels; only
  `var()`/`calc()`-valued *color* properties would route through
  `lerpComputedValue` (and that path lerps numeric, not color, after DOM
  resolve). The memo correctly **does not cache** detached-element /
  zero-`offsetWidth` reads (`normalize.ts:199` comment). The risk is the memo
  *key*: if it keys on the `ValueUnit` identity + target, a `var(--accent)`
  whose CSS custom property *changes mid-animation* (e.g. theme switch, a very
  common modern pattern — see `dark-mode` guide, Baseline-widely-available
  `light-dark()`) could serve a **stale** computed color. Needs a read to
  confirm the memo key includes a generation/invalidation token.
- **Perf/elegance rationale:** per-frame `getComputedStyle` is the single most
  expensive DOM read; the memo is *essential* and correct in spirit. SOTA is to
  cache per-(target, property, frame-epoch) and bust on `:root` style mutation —
  but that's gold-plating unless theme-mid-animation is a named use case.
- **Disposition:** FOLD-VALUEJS-HANDOFF (verify the memo key + document the
  invalidation contract). Likely **ALREADY-SOTA** for the static case; the
  hand-off is "confirm `var()`-color staleness under live custom-property
  mutation, document the contract."
- **Isomorphism:** no behavior change proposed — a correctness *confirmation*.

---

### D-5 · `color-mix()` / N-color mix is correct and SOTA, but there is no compile-time offload of *static* mixes to the browser · FOLD-VALUEJS-HANDOFF + FOLD-E

- **Where:** `value.js color/dispatch.ts:226-329` (`mixColors`, premultiplied
  alpha, NaN/`none` propagation, hue methods) + `color/mix.ts` (`mixColorsN`,
  pairwise left-fold).
- **Gap:** the `mixColors` implementation is **spec-faithful** (premultiplied
  alpha per CSS Color 5 §2.1, `none`→adopt-other, all four hue methods) — this
  is ALREADY-SOTA *as a runtime function*. The missed opportunity is at
  **compile time**: `color-mix(in oklab, red, blue 30%)` with *constant*
  arguments is a static value the browser computes natively
  (`color-mix()` is **Baseline 2023 / widely available** per the modern-web
  guidance `css` guide — "you do NOT need `@supports` for `color-mix()`"). If a
  keyframe value is a constant `color-mix()`, keyframes.js could pass the
  *string* straight through to the DOM and let the compositor handle it (and
  WAAPI-offload, see D-6), rather than parsing → mixing in JS → re-serializing.
- **Perf/elegance rationale:** the cheapest mix is the one you never compute.
  Constant `color-mix()`/relative-color (`oklch(from … )`) expressions are
  static; folding them to a pass-through (or pre-computing once at prep, never
  per-frame) is free perf.
- **Disposition:** FOLD-E for the *detection* (keyframes' frame compiler flags
  "constant color expression, no interp needed → pass string through"); the
  value.js side is ALREADY-SOTA (no hand-off needed for the mix math itself).
- **Isomorphism:** passing a constant `color-mix()` string to the DOM is *more*
  isomorphic than JS-computing it (identical to author intent). Note the guide's
  warning that **relative color syntax + lightness adjustment is unreliable**
  because browsers don't yet gamut-map it — value.js's analytical gamut map
  (D-7) is the *better* path for those, so keep JS-evaluating relative-color
  with a non-trivial lightness delta. KISS: pass through only the safe,
  in-gamut, constant cases.

---

### D-6 · WAAPI color exclusion is now over-conservative — browsers interpolate oklab on the compositor · GAP-NAMED / FOLD-E

- **Where:** `keyframes src/animation/waapi.ts:116-121` — *any* `unit==="color"`
  InterpolatedVar makes the whole animation WAAPI-ineligible, reason `"color
  interpolation requires perceptual lerp"`.
- **Gap:** that rationale is **stale**. WebKit and Blink now natively
  interpolate animations in **OKLab** when the keyframes use *non-legacy* color
  syntax (e.g. `oklab()`, `oklch()`, `color()`), and legacy sRGB pairs in sRGB —
  *on the compositor thread* (WebKit commit
  [1140e61](https://github.com/WebKit/WebKit/commit/1140e61c63402f8b7f84b620960a1a28a2ce4513),
  "Support extended color animation interpolation"; Chrome for Developers
  ["Access more colors and new spaces"](https://developer.chrome.com/docs/css-ui/access-colors-spaces)).
  So an animation `background: oklch(0.7 0.2 30) → oklch(0.6 0.15 260)` *can* run
  on WAAPI: emit the keyframes as `oklab()`/`oklch()` strings and the browser
  does the perceptual lerp off-main-thread — exactly what the JS path does, but
  free. The current code forfeits the compositor for *every* color animation.
- **Perf/elegance rationale:** moving color animations to the compositor is the
  single biggest runtime win available for the color lane — it removes the
  entire ~290 ns/frame/property JS cost (D-1+D-3) from the main thread and stops
  the per-frame `setProperty` reflow churn. The eligibility predicate already
  iterates frames (`waapi.ts:104-124`); it can refine to: *eligible when (a)
  every color keyframe's endpoints are expressible as a single CSS color string
  AND (b) the requested `colorSpace` matches the browser's interpolation default
  for that syntax family* (oklab for non-legacy, sRGB for legacy). Custom
  `hueMethod` or a non-default `colorSpace` that the browser can't honor →
  stay on rAF. This is the WAAPI [README's](https://chromium.googlesource.com/chromium/src/+/HEAD/third_party/blink/renderer/core/animation/README.md)
  compositor-eligibility model.
- **Disposition:** FOLD-E. keyframes owns `waapi.ts` eligibility +
  `toWAAPIKeyframes` (would need to emit color strings rather than excluding).
  Depends on D-1/D-2's compact serializer to emit the keyframe strings.
- **Isomorphism:** the perceptual lerp is the *same OKLab math* the browser now
  runs — pixels match to compositor precision **only when** the requested space
  equals the browser default. The guard must keep custom-space/custom-hue
  animations on the JS path so behavior never silently diverges. Conservative,
  opt-in, queryable via the existing `waapiIneligibleReason`.

---

### D-7 · Analytical OKLab sRGB gamut mapping is AHEAD of the CSS Color 4 spec algorithm · ALREADY-SOTA

- **Where:** `value.js src/units/color/gamut.ts` — Ottosson analytical gamut
  clipping (`gamutMapOKLab`, `findCusp`, `findGamutIntersection`, adaptive
  L0 α=0.05, one Halley step), `deltaEOK` + `DELTA_E_OK_JND`.
- **Assessment:** CSS Color 4 §13.2 specifies an *iterative* gamut-mapping
  algorithm (binary-search OKLCH chroma reduction with MINDE/deltaE-OK clamp) —
  value.js instead uses Ottosson's **closed-form, zero-iteration** clip with one
  Halley refinement. It is numerically very close, **hue-preserving**, and far
  cheaper than the spec's iterate-to-JND loop. The modern-web-guidance `css`
  guide explicitly warns that **browsers do NOT yet implement gamut mapping for
  relative color syntax** ("the resulting color is unpredictable") — so value.js
  here is *ahead of shipping browsers*, not behind them. This is a genuine
  competitive advantage; do not manufacture work against it.
- **Disposition:** ALREADY-SOTA. No hand-off. (Optional future note: the spec
  algorithm and the analytical one can disagree at deep-saturation extremes by a
  hair; if exact spec-parity is ever required for a conformance test, that's a
  *separate, narrow* value.js task — not recommended; the analytical path is the
  better engineering choice.)
- **Isomorphism:** N/A — already the better-of-both (matches author intent,
  beats the platform's current behavior).

---

### D-8 · Wide-gamut (`display-p3`, `rec2020`, `prophoto`, `a98`) round-trips through XYZ-D65 hub correctly, but always gamut-maps to sRGB on RGB egress · FOLD-VALUEJS-HANDOFF (verify)

- **Where:** `value.js color/conversions/xyz-extended.ts:74` + `direct.ts:79,157`
  — every RGB-family egress runs `gamutMap` (→ sRGB clip) to match
  `xyz2rgb`'s `correctGamut=true` default.
- **Gap:** for an animation whose endpoints are `color(display-p3 …)` and whose
  output we *want* to keep in P3 (modern displays, `dynamic-range-limit`,
  HDR-ish UI), collapsing every RGB-family result through *sRGB* gamut mapping
  would clip P3-only colors. Need to confirm: when `colorSpace` /
  `outputSpace` is a wide-gamut RGB space, does the egress gamut-map to *that*
  space's gamut rather than sRGB? If `gamutMapSRGB` is hard-wired, wide-gamut
  animation outputs are silently desaturated to sRGB. (`display-p3` is
  **Baseline 2023** per the `css` guide / `access-colors-spaces`.)
- **Perf/elegance rationale:** correctness first — but also, if the output space
  is `display-p3`, the *right* serialization is `color(display-p3 …)` (compact,
  native, compositor-eligible per D-6), not a sRGB-clipped `rgb()`.
- **Disposition:** FOLD-VALUEJS-HANDOFF (verify + parameterize the egress gamut
  target by output space). Propose value.js tranche: *"gamut-map to the egress
  RGB space's own gamut, not unconditionally sRGB; preserve wide-gamut
  outputs."* keyframes side is FOLD-E only if it needs to thread an output-space
  hint (overlaps D-2).
- **Isomorphism:** preserving P3 output for P3 input is *more* isomorphic; the
  current sRGB-clip is the behavior departure. Fixing it widens fidelity on
  wide-gamut displays, identical on sRGB displays.

---

### D-9 · The interpolation benchmark suite has NO color case · FOLD-E

- **Where:** `keyframes bench/interpolation.bench.ts` — covers
  `opacity`/`transform` only; zero color animations benched.
- **Gap:** the most expensive interpolation lane (color, ~40× numeric) is
  unbenched, so regressions in D-1/D-3 (or wins from them) are invisible to CI.
  Every change proposed here needs a guard.
- **Perf/elegance rationale:** you cannot defend a hot path you do not measure.
  Add `from { background: #f00 } to { background: #00f }` (sRGB legacy),
  `oklch(…)→oklch(…)` (cylindrical/hue), and a multi-stop gradient-ish color
  ramp to the bench.
- **Disposition:** FOLD-E (keyframes owns the bench). Low effort, high leverage.
- **Isomorphism:** test-only; no behavior change.

---

### D-10 · Demo never exercises color interpolation — `colorSpace`/`hueMethod` are described but not demonstrated · FOLD-E (demo)

- **Where:** `demo/@/components/custom/animation-controls/animationDescriptions.ts:89,93`
  describes oklab/oklch; grep of `demo/**/*.{vue,ts}` finds **no** animation
  whose keyframes interpolate a color (no `background`/`color`/`fill` keyframe
  ramps; the scenes animate transforms).
- **Gap:** the engine's headline science feature — perceptual color
  interpolation with selectable space + hue method, the analytical gamut map
  (D-7), wide-gamut (D-8) — is **invisible** in the demo. A side-by-side
  `sRGB vs oklab vs oklch` gradient/swatch animation would be the single most
  compelling demonstration of what differentiates this engine, and would
  visually prove the "no banding / no gray dead-zone through the midpoint"
  property the `css` guide calls out (oklab stays in gamut; oklch preserves
  chroma).
- **Perf/elegance rationale:** N/A (demo) — this is product/showcase value, and
  it doubles as a visual regression harness for D-1/D-2/D-7/D-8.
- **Disposition:** FOLD-E (demo). Propose a "color interpolation" scene: animate
  `background` across a spectrum, toggle `colorSpace` (sRGB/oklab/oklch) and
  `hueMethod` (shorter/longer/increasing/decreasing) live, show the three rails
  side by side. Bonus: a `display-p3` swatch to show wide-gamut (D-8).
- **Isomorphism:** N/A — additive demo content.

---

## Disposition summary

| ID | Title | Disposition |
|----|-------|-------------|
| D-1 | Per-frame `Color.toString` 3-array alloc + 73-char full-precision output | FOLD-VALUEJS-HANDOFF |
| D-2 | Interp output always `oklab()` regardless of source family | FOLD-VALUEJS-HANDOFF + FOLD-E |
| D-3 | `lerpColorValue` re-derives hueKey + closure + double-unwrap per channel | FOLD-VALUEJS-HANDOFF |
| D-4 | `getComputedValue` memo staleness under live `var()`-color mutation | FOLD-VALUEJS-HANDOFF (verify) |
| D-5 | No compile-time pass-through of constant `color-mix()`/relative-color | FOLD-VALUEJS-HANDOFF + FOLD-E |
| D-6 | WAAPI color exclusion stale — browsers now oklab-interp on compositor | GAP-NAMED / FOLD-E |
| D-7 | Analytical OKLab gamut map ahead of spec | **ALREADY-SOTA** |
| D-8 | Wide-gamut egress always sRGB-clips | FOLD-VALUEJS-HANDOFF (verify) |
| D-9 | No color case in interp benchmark | FOLD-E |
| D-10 | Demo never shows color interpolation | FOLD-E (demo) |

## value.js hand-off tranche shape (consolidated)

A single value.js tranche, **"color animation hot-path"**, would carry D-1, D-2,
D-3, D-8 (and the D-4 verification):

1. **Fast serializer** — zero-alloc, fixed-precision color formatter for the
   apply path (`toAnimationString` / a precision arg on `formatColor`); keep
   high-precision `toString` for round-trip. (D-1)
2. **Output-space targeting** — serialize a stored-oklab color *as* a requested
   output space (compact `rgb()` for legacy sRGB pairs, `color(display-p3 …)`
   for wide-gamut), decoupling storage space from emit space. (D-2, D-8)
3. **Channel-plan precompute** — extend `prepareInterpVar` to freeze a
   closure-free numeric channel plan; flatten `lerpColorValue`. (D-3)
4. **Egress gamut target** — gamut-map to the egress RGB space's own gamut, not
   unconditionally sRGB. (D-8)
5. **Memo contract** — confirm/document `getComputedValue` invalidation under
   live custom-property mutation. (D-4)

keyframes.js (FOLD-E) then consumes the above and additionally: refines WAAPI
eligibility to admit compositor-eligible color animations (D-6), flags constant
color expressions for pass-through (D-5), adds color benches (D-9), and ships a
color-interpolation demo scene (D-10).

## What is already SOTA (do not touch)

- One-time space collapse at frame-prep — **no per-frame conversion**
  (`normalize.ts:379`). Correct and fast.
- `_lerp` pre-dispatch on the InterpolatedVar (`interpolate.ts:140`). Correct
  precompute discipline — D-3 just extends it.
- Premultiplied-alpha + `none`/NaN + all four hue methods in `mixColors`
  (`dispatch.ts:226`) — CSS Color 5 faithful. (D-5)
- Analytical Ottosson gamut map — ahead of shipping browsers. (D-7)
- XYZ-D65 hub + `DIRECT_PATHS` hot-pair shortcut (`dispatch.ts:159`,
  `conversions/direct.ts`) — the right architecture; the hot interp pairs skip
  the hub.

---

**Sources:**
- [WebKit — Support extended color animation interpolation](https://github.com/WebKit/WebKit/commit/1140e61c63402f8b7f84b620960a1a28a2ce4513)
- [Chrome for Developers — Access more colors and new spaces](https://developer.chrome.com/docs/css-ui/access-colors-spaces)
- [Blink core/animation README (compositor eligibility)](https://chromium.googlesource.com/chromium/src/+/HEAD/third_party/blink/renderer/core/animation/README.md)
- [MDN — oklab() CSS function](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/oklab)
- modern-web-guidance `css` guide (Baseline-dated: `color-mix()` 2023 widely-available; `display-p3` 2023; `light-dark()` widely-available; relative-color gamut-mapping NOT yet shipped)
