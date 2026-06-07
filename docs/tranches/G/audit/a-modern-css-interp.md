# a-modern-css-interp — "interpolate through anything and everything": the modern-CSS interpolation coverage matrix (Tranche G deep audit)

**Lane id.** `a-modern-css-interp`. **Branch.** `tranche-g-dev` (D+E+F IMPLEMENTED +
RELEASED — kf `4.0.0`; value.js `0.11.0`, parse-that `0.9.0`, glass-ui `3.3.0` on the
registry). **Scope.** A NEW dimension the user requested, complementary to the authored
16-lane assay: not "what value.js win does the re-pin consume" (`a-valuejs-leverage`) nor
"what competitor feature is missing" (`r-animation-sota`), but **a per-facility audit of
the kf→value.js interpolation PATH** — for each modern CSS facility (container-query
units, the modern viewport units, `calc/min/max/clamp`, `var()`/`@property`, `color-mix`/
relative-color, gradients, transforms/matrix, filters, registered-property animations):
*does kf interpolate it, on which path (rAF / WAAPI / eager-px / lazy-DOM-resolve), and
where is the seam where it silently degrades?* Research + audit ONLY — this doc is the
only artifact; ZERO source/test/CI/demo edits.

**Method (inv ε).** Every kf claim is `file:line`-grounded against the live
`tranche-g-dev` tree + the installed `node_modules/@mkbabb/value.js@0.10.0` dist; every
value.js claim against the live source at `/Users/mkbabb/Programming/value.js` (version
`0.11.0`). I traced the **actual dispatch** for each facility end-to-end:
`parseAndFlattenObject` (`utils.ts:205`) → `createInterpVarValue` (`utils.ts:283`) →
`normalizeValueUnits` (vj `normalize.ts:437`) → `prepareInterpVar` (vj
`interpolate.ts:217`) → the per-frame `lerpValue → iv._lerp` (`engine.ts:731`). I DIFF
the authored lanes (I do not repeat the re-pin headline; I cite `a-valuejs-leverage
F-VJ-2` and EXTEND it with the bare-`cqw` case it does NOT cover).

---

## 0. The headline — kf interpolates almost the entire modern surface; the gaps are a SMALL, NAMED set, and the sharpest one is a CLASSIFICATION asymmetry, not a missing feature

The kf interpolation kernel is value-type-agnostic by construction: `flattenObject`
(vj `units/utils.ts:25`) decomposes any parsed CSS value — a `transform` function list, a
`matrix3d(...)`, a gradient stop list, a color — into a flat map of `ValueUnit` leaves
keyed by `property`/`subProperty`; `createInterpVarValue` (`utils.ts:283`) pairs the
start/stop leaf arrays (length-padding the shorter with `ValueUnit(0)`, `utils.ts:305-320`);
`normalizeValueUnits` collapses each pair to a common base; `lerpValue` lerps each leaf.
**So "interpolate through anything" is largely TRUE — anything that parses to numeric
leaves interpolates.** The honest gaps are four, in descending sharpness:

1. **The computed-unit CLASSIFICATION asymmetry (the sharpest, kf-side).** value.js's
   `COMPUTED_UNITS = ["var","calc"]` ONLY (vj `units/constants.ts:54`). The 36 relative
   length units — every `cqw`/`dvh`/`svh`/`lvh`/`vi`/`vb` — are `RELATIVE_LENGTH_UNITS`
   (vj `constants.ts:2-41`), NOT `COMPUTED_UNITS`. So a **bare** `cqw → cqw` keyframe is
   classified `computed: false` (vj `normalize.ts:488`) and resolved EAGERLY to px at
   `prepareInterpVar`-time, NOT lazily per-frame via `lerpComputedValue`. kf already
   knows this — it maintains a SEPARATE `WAAPI_INELIGIBLE_UNITS` superset
   (`waapi.ts:31-40`) precisely because value.js's classifier under-covers. This is
   covered for the WAAPI gate but NOT for the rAF resolution semantics (§1).
2. **`currentColor` / `light-dark()` / system-color sentinels don't PARSE** (vj
   `color.ts` `nameParser:540` resolves only the 155 `COLOR_NAMES` keywords + `transparent`;
   no `currentColor`/`light-dark`/`Canvas` branch). kf has zero policy because the input
   never produces a leaf — this is `a-valuejs-leverage F-VJ-5`, re-grounded here as a
   parse-gap, not an interp-gap (§2).
3. **Intrinsic-size `0 → auto` / `min-content` / `fit-content`** — a keyword endpoint is
   not a numeric leaf, so it cannot lerp (`r-animation-sota G26-4`, value.js E7 + native
   `calc-size()`; re-confirmed, NOT re-litigated here — §3).
4. **`min()`/`max()`/`clamp()`** flow through the SAME atomic-`calc` seam ONLY if the
   parser wraps them as `calc`-kind FunctionValues; otherwise they fall to the generic
   `FunctionValue` decomposition which would try to lerp the arguments INDIVIDUALLY (wrong
   for a `clamp`). Needs a one-test witness (§4, MEASURE-FIRST).

Everything else — `calc()`, `var()`, `@property`-typed customs, `color-mix()`,
relative-color (`oklch(from …)`), all 9 `color()` spaces, the 6 gradient functions,
`translate`/`rotate`/`scale`/`skew`/`perspective`/`matrix`/`matrix3d`, and the entire
`filter` function family — **interpolates today**, on the path documented per-row in §5.
The bulk of this lane is the ALREADY-SOTA coverage record (§5); the SHIP set is two thin
items (§1 the cqw-rAF-resolution correctness witness; §6 the gradient/transform
length-mismatch hardening), both with a value.js half tagged.

---

## 1. SHIP-in-G — the bare-`cqw`/`dvh` rAF-resolution correctness witness (EXTENDS `a-valuejs-leverage F-VJ-2`, covers the case it does NOT)

**Disposition: SHIP-in-G (a correctness witness + a documented contract), value.js-HANDOFF (the classifier fix).**

### 1.1 The asymmetry, traced end-to-end

value.js classifies a unit `computed` iff it is `var` or `calc`:

```
// vj units/constants.ts:54
export const COMPUTED_UNITS = ["var", "calc"] as const;
// vj units/normalize.ts:488
out.computed = isComputedUnit(left.unit) || isComputedUnit(right.unit);
```

For a keyframe `from { width: 10cqw } to { width: 90cqw }`:
- both leaves have `unit === "cqw"`, so `isComputedUnit` is FALSE → `computed: false`
  (vj `normalize.ts:488`);
- `left.unit === right.unit`, so the `if (left.unit !== right.unit)` branch
  (`normalize.ts:476`) does NOT fire → `normalizeNumericUnits` is NOT called either;
- `prepareInterpVar` wires `iv._lerp = lerpNumericValue` (vj `interpolate.ts:218-222`);
- per frame, `lerpNumericValue` (vj `interpolate.ts:171-177`) lerps the RAW NUMBERS
  (`10 → 90`) and keeps `value.unit = "cqw"`.

**So a bare `cqw → cqw` rAF animation emits a `cqw` STRING to the DOM** (via
`transformTargetsStyle → unflattenObjectToString`, `utils.ts:363-377`), and **the BROWSER
resolves `cqw` each frame against the live container.** This is actually correct-by-accident
for the bare case: it tracks a container resize because the browser owns the resolution.

The hazard is the MIXED case and the `lerpComputedValue` path. For
`from { width: 10cqw } to { width: 50% }` (mixed units), `normalize.ts:476` DOES fire →
`normalizeNumericUnits` (vj `normalize.ts:293`) calls `convertToPixels(10, "cqw", target)`
ONCE at prepare-time (vj `units/utils.ts:451-476` — the container-query branch), freezing
the `cqw` endpoint to a static px number. From then it lerps `px → px` and **does NOT
track a container resize** — there is no `computed` flag, so `lerpComputedValue`'s
epoch-cache invalidation (`bumpLayoutEpoch`) never applies. The `a-valuejs-leverage F-VJ-2`
finding addresses the `calc(100cqw - 100%)` case (which IS `calc`-kind → `computed: true`
→ goes through `lerpComputedValue` + the epoch cache); **it does NOT cover the
mixed-bare-unit `cqw ↔ %` / `cqw ↔ px` case, which is `computed: false` and freezes with
NO epoch invalidation at all.** This lane names that second case.

### 1.2 Why this is a real seam, not a contrivance

The flagship demo animates the ball via `translate-x-[calc(100cqw_-_100%)]`
(`a-valuejs-leverage F-VJ-2`, citing `AnimationVisualizer.vue:35`) — `calc`-kind, so it is
the F-VJ-2 epoch-cache case. But a designer reaching for the obvious
`width: 10cqw → 90cqw` (bare) or `left: 10cqw → 100px` (mixed) lands on the
`computed: false` path with materially different resize semantics — one tracks (bare, the
browser resolves the string), one freezes silently (mixed, value.js froze it to px at
prepare). **Two CSS expressions a designer would treat as equivalent have divergent,
undocumented resize behaviour.** That is the no-quick-solution seam: the fix is to make the
classification honest, not to special-case the demo.

### 1.3 The fold

- **kf-side SHIP (now):** a `proof:`-grade witness test asserting (a) a bare
  `cqw → cqw` rAF animation emits a `cqw`-unit string (so the browser tracks resize), and
  (b) a mixed `cqw ↔ px` animation's resize behaviour is DOCUMENTED (it freezes; pair it
  with `bumpLayoutEpoch()` on the container `ResizeObserver` exactly as F-VJ-2 prescribes
  for the `calc` case). This converts the silent divergence into a tested, documented
  contract. The library documents the container-unit contract ONCE (the F-VJ-2 doc home).
- **value.js-HANDOFF (the genuine fix):** value.js should classify the
  viewport/container relative units as `computed` so they route through `lerpComputedValue`
  uniformly (lazy DOM-resolve + epoch cache), eliminating the bare/mixed divergence. This
  is the DRY home — kf's `WAAPI_INELIGIBLE_UNITS` superset (`waapi.ts:31-40`) is the
  evidence value.js's `COMPUTED_UNITS` under-classifies; the second copy in kf is the
  symptom. NB: this is a behaviour change at the boundary kf consumes, so it RIDES a
  re-pin and is gated by the C5 correctness discipline already in `G.W2 §S4`.
- **Falsifiable instrument (SHIP-bar):** `proof:cqw-resolution` — (1) parse
  `from { width: 10cqw } to { width: 90cqw }`, drive the rAF path, assert the emitted
  style string carries `cqw` (NOT a frozen px); (2) parse `from { left: 10cqw } to { left: 100px }`,
  assert `iv.computed === false` and document the freeze; the BITE: flip value.js to
  classify `cqw` as `computed` → assertion (1) must then assert a px emit through
  `lerpComputedValue`, witnessing the path change.

---

## 2. value.js-HANDOFF — the color sentinels (`currentColor` / `light-dark()` / system colors) are a PARSE gap, not an interp gap

**Disposition: value.js-HANDOFF (re-grounds `a-valuejs-leverage F-VJ-5` from the interp side).**

- **Where (verified):** vj `color.ts` `nameParser` (`color.ts:540-547`) resolves an
  identifier ONLY if it is in `KNOWN_COLOR_NAMES = new Set(Object.keys(COLOR_NAMES))`
  (`color.ts:536`). `transparent` IS handled (`color/constants.ts:534`:
  `transparent: "rgba(0, 0, 0, 0)"`). **`currentColor`, `light-dark(a, b)`, and the
  system-color keywords (`Canvas`, `CanvasText`, `ButtonFace`, …) are NOT in `COLOR_NAMES`
  and have no parser branch** (`color.ts` dispatch table `color.ts:569-574` has no
  `currentColor`/`light-dark` arm). They fail to parse → no `ValueUnit` leaf → nothing for
  `lerpColorValue` to interpolate.
- **Why it matters:** `currentColor` and `light-dark()` are Baseline-Widely-Available CSS
  Color 4/5 and are the idiomatic theme-aware color authoring tokens; a designer animating
  `color: light-dark(black, white)` or `border-color: currentColor → red` gets a parse
  miss, not an interpolation. This is the interp-side framing of `F-VJ-5`: kf has zero
  policy because the input never reaches `lerpColorValue`.
- **The transposition (value.js-side):** `currentColor` resolves at use-time against the
  target's computed `color` — a `computed`-kind sentinel resolved exactly like `var()` (read
  `getComputedStyle(target).color`); `light-dark()` resolves against the computed
  `color-scheme`; both belong in value.js's color parser + a `getComputedValue`-style
  resolution arm, NOT in kf (kf would breach the value.js boundary to add a color parser).
- **Falsifiable instrument:** the value.js half carries its own parse + resolution test;
  the kf consumer half is a `proof:`-grade equivalence test (`color: currentColor → red`
  resolves the start endpoint against the live `color` and lerps in oklab) that lands the
  same motion as the value.js publish. **No kf source edit beyond the re-pin** — the
  consume-unchanged charter holds.

---

## 3. BOOK + value.js-HANDOFF — intrinsic-size `0 → auto` (re-affirm `r-animation-sota G26-4`, do NOT re-litigate)

**Disposition: BOOK + value.js-HANDOFF (E7) — re-confirmed, owned by `r-animation-sota G26-4`.**

A keyword endpoint (`auto`, `min-content`, `fit-content`) is not a numeric leaf, so the
length-padded leaf-pairing in `createInterpVarValue` (`utils.ts:305-320`) has nothing to
lerp against `0`. This is THE most-requested animation kf can't do, and it is correctly
BOOKed: the portable JS-measure fallback (`getBoundingClientRect` the auto height, animate
the px, snap to `auto` on finish) is net-new engine surface deserving its own wave; the
native `interpolate-size`/`calc-size()` lane is non-Baseline (Chrome/Edge only, June 2026)
and value.js-gated (E7 — `grep -rniE "calc-size" value.js/src` → zero, re-verified). I add
NO new disposition; I name it here for the completeness of the modern-CSS-interp matrix and
defer wholly to `r-animation-sota G26-4`.

---

## 4. MEASURE-FIRST — `min()`/`max()`/`clamp()` interpolation path is unwitnessed

**Disposition: MEASURE-FIRST (a one-test witness decides SHIP vs ALREADY-SOTA).**

- **The question:** `calc()` is treated ATOMICALLY by `flattenObject` (vj
  `units/utils.ts:33-43`: `if (obj.name === "calc")` → one `ValueUnit(innerExpr, "calc")`
  leaf, NOT decomposed) — so `calc(...)` interpolates correctly via `lerpComputedValue`
  (DOM round-trip resolves the whole expression). **But `min()`/`max()`/`clamp()` are
  NOT `calc`-named FunctionValues** — they hit the GENERIC FunctionValue arm
  (`units/utils.ts:46-58`), which decomposes the function into its argument leaves and
  flattens each. If a `clamp(10px, 5vw, 100px)` decomposes to three independent leaves that
  each lerp against the other endpoint's three leaves, the interpolation is **semantically
  wrong** (you cannot lerp the bounds of a clamp independently and recover the clamp).
- **Why MEASURE-FIRST not SHIP:** I did not confirm whether value.js's CSS-values parser
  emits `min`/`max`/`clamp` as `calc`-kind (atomic, correct) or as a generic FunctionValue
  (decomposed, wrong). The parser dispatch is in vj `parsing/index.ts`; the math-function
  handling may already normalise them under the `calc` umbrella. **This is a one-test
  witness:** parse `from { width: clamp(10px, 5vw, 100px) } to { width: clamp(20px, 8vw, 200px) }`,
  inspect the flattened leaf shape — one atomic `calc/clamp`-kind leaf (correct, ALREADY-SOTA)
  or three decomposed leaves (a value.js-HANDOFF interp bug).
- **Falsifiable instrument:** `proof:math-fn-atomic` — assert a `clamp()`/`min()`/`max()`
  keyframe flattens to a SINGLE computed leaf (routes through `lerpComputedValue`), exactly
  as `calc()` does; the BITE: a decomposed-leaf shape reds (the wrong-interp witness). If the
  witness shows correct atomic handling → fold into the §5 ALREADY-SOTA record; if it shows
  decomposition → value.js-HANDOFF (extend the `calc`-atomic arm to the math-function family
  in vj `units/utils.ts:33`).

---

## 5. ALREADY-SOTA — the modern-CSS interpolation coverage matrix (the bulk; binding per §Mandate, do NOT manufacture a deficit)

Each row traced end-to-end on the live tree. **kf interpolates ALL of these today.**

| Facility | Parses? (value.js) | Interp path | Resize-aware? | Verdict |
|---|---|---|---|---|
| `calc(…)` | ✓ atomic leaf (vj `units/utils.ts:33-43`) | `computed: true` → `lerpComputedValue` + C1 epoch cache (vj `interpolate.ts:26-72`) | ✓ via `bumpLayoutEpoch` (window auto; container = F-VJ-2) | **ALREADY-SOTA** |
| `var(--x)` | ✓ `unit:"var"` (vj `normalize.ts:213`) | `computed: true` → reads `getComputedStyle(target).getPropertyValue` per (target,epoch) | ✓ epoch cache | **ALREADY-SOTA** |
| `@property`-typed custom | ✓ parsed → `propertyRegistry` (`engine.ts:1163,1173`) + `CSS.registerProperty` (`engine.ts:1248-1281`) | typed numeric `--ramp: 0→1` lerps as numeric leaf; UA can composite the registered custom | n/a | **ALREADY-SOTA** (D-LIB-1, `platform-adopt.test.ts:102`) |
| `cqw/cqh/cqi/cqb/cqmin/cqmax` (bare) | ✓ `RELATIVE_LENGTH_UNITS` (vj `constants.ts:35-40`); `convertToPixels` cq branch (vj `units/utils.ts:451-476`, writing-mode aware `:458`, `findQueryContainer:238`) | `computed:false` → numeric lerp, emits `cqw` string, **browser** resolves per frame | ✓ (browser owns it) | **ALREADY-SOTA for bare; mixed = §1 SHIP** |
| `svh/lvh/dvh` + the 18 viewport variants | ✓ `convertViewportUnitToPixels` (vj `units/utils.ts:287-339`), C5 fix (0.11.0) | same as cqw (numeric-lerp string-emit, or eager-px if mixed) | mixed freezes (§1) | **ALREADY-SOTA on re-pin (C5); mixed = §1** |
| `vi/vb`, `cap/ic/lh/rlh` | ✓ C5 (vj `units/utils.ts:300-380`); fail-loud guard (`:491-504`) | numeric lerp / eager-px | — | **ALREADY-SOTA on re-pin (C5)** |
| `color-mix(in oklch, a, b)` | ✓ full parser (vj `color.ts:424-474`), space + hue-method + dual-pct | resolves to a STATIC `Color` leaf at parse → animating `color-mix → color-mix` lerps the two resolved colors (oklab perceptual) | n/a | **ALREADY-SOTA** |
| relative color `oklch(from c …)` | ✓ `relativeColorParser` for all 6 spaces (vj `color.ts:292,327-376`) + calc body eval (`color.ts:113-117`) | resolves to a static `Color` leaf → lerps perceptually | n/a | **ALREADY-SOTA** |
| `color(display-p3 …)` + 9 spaces | ✓ `colorFunction` (vj `color.ts:490-525`: srgb/srgb-linear/display-p3/a98/prophoto/rec2020/xyz/xyz-d50/xyz-d65) | static `Color` leaf → perceptual lerp | n/a | **ALREADY-SOTA** |
| `oklab/oklch/lab/lch/hsl/hwb/hsv/rgb` | ✓ dispatch LUT (vj `color.ts:569-574`, A1 2.41×) | `unit:"color"` → `lerpColorValue` + frozen channel plan (B3, vj `interpolate.ts:104-135`) | n/a | **ALREADY-SOTA** |
| `transparent` | ✓ → `rgba(0,0,0,0)` (vj `color/constants.ts:534`) | color leaf | n/a | **ALREADY-SOTA** |
| `currentColor` / `light-dark()` / system colors | ✗ no parser branch (vj `color.ts:540-547`) | — | — | **§2 value.js-HANDOFF** |
| linear/radial/conic + repeating gradients | ✓ `handleGradient` (vj `parsing/index.ts:125-186`): direction-angle + color-stop list (color + length-%) | each stop's color + position flattens to a leaf → per-stop interp (matched stop counts) | — | **ALREADY-SOTA (matched-arity); §6 mismatch** |
| `translate/rotate/scale/skew/perspective` | ✓ FunctionValue per axis | `flattenObject` keys each as `subProperty` (`translateX`, `rotate`, …, vj `units/utils.ts:46-58`); per-axis numeric/angle lerp; `getComputedValue` matrix-decompose for `calc`-on-transform (vj `normalize.ts:60-90,246-258`) | n/a | **ALREADY-SOTA** |
| `matrix()` / `matrix3d()` | ✓ → 6/16 numeric leaves (`unpackMatrixValues` vj `units/utils.ts:156`, `MatrixValues` `constants.ts:81-102`) | per-element numeric lerp | n/a | **ALREADY-SOTA** (note: element-wise lerp, not polar-decomposed — same as WAAPI's matrix interp, the spec-correct default) |
| `filter: blur/brightness/contrast/hue-rotate/drop-shadow/…` | ✓ generic FunctionValue → per-arg leaves (length/%/angle/color) | per-arg numeric/angle/color lerp (matched function lists) | n/a | **ALREADY-SOTA (matched-arity); §6 mismatch** |
| `box-shadow` / `text-shadow` | ✓ length + color leaves | per-component lerp | n/a | **ALREADY-SOTA (matched-arity)** |

**The binding record:** the interpolation KERNEL is value-type-agnostic — it lerps any
parsed numeric leaf, dispatching numeric/color/computed through the single
`lerpValue → iv._lerp` seam (`engine.ts:731`). The perceptual color science (oklab default,
6-space relative-color, color-mix, 9 `color()` spaces, CSS-Color-4 hue short-way) is at or
ahead of every competitor (`r-animation-sota` competitive map; `a-valuejs-leverage §3.3`).
**G manufactures NO interpolation-coverage work here.** The two narrow SHIPs (§1, §6) are
correctness/robustness witnesses on edges, not new interpolation capability.

---

## 6. SHIP-in-G (MED) — length-mismatch hardening for gradients / filters / transform-function lists

**Disposition: SHIP-in-G (a robustness witness) — the length-pad seam is silent on a function-arity mismatch.**

- **Where:** `createInterpVarValue` (`utils.ts:305-320`) pads the shorter leaf array to
  `maxLength` with `new ValueUnit(0)`. For matched-arity inputs (a 3-stop gradient → a
  3-stop gradient; `blur(0) → blur(10px)`) this is correct. For a MISMATCH — a 2-stop
  gradient → a 3-stop gradient, or `filter: blur(4px) → filter: blur(4px) brightness(2)`,
  or `transform: translateX(10px) → transform: translateX(10px) rotate(45deg)` — the pad
  inserts a `ValueUnit(0)` for the missing function's leaf, which lerps a numeric `0`
  against the present function's argument. **For a numeric tail (`rotate(0deg)` implied)
  this is sometimes right; for a `brightness` (identity = `1`, not `0`) or a gradient
  color stop (identity = transparent, not numeric `0`) it is silently WRONG** — a
  `brightness` fades to `0` (black) instead of holding its identity `1`.
- **Why it matters:** the most natural designer keyframe — adding a filter function or a
  gradient stop across the animation — produces a wrong but non-erroring interpolation.
  This is the no-special-case seam: the fix is an identity-aware pad (a missing `brightness`
  pads to `1`, a missing color stop pads to the neighbouring stop / transparent), not a
  per-call guard.
- **The transposition:** the identity-aware pad is value-domain knowledge (which CSS
  function has which identity argument) — it belongs beside value.js's parser/normalize, so
  the **pad policy is value.js-HANDOFF** with kf's `createInterpVarValue` (`utils.ts:305`)
  consuming the identity-aware endpoints. The kf-side SHIP now is the **witness test** that
  red-flags the current silent-wrong pad so the value.js fix has a target.
- **Falsifiable instrument:** `proof:fn-arity-pad` — assert
  `filter: blur(4px) → filter: blur(4px) brightness(2)` holds `brightness` at its identity
  `1` at `t=0` (NOT `0`); the BITE: the current `ValueUnit(0)` pad makes `brightness`
  resolve `0` at `t=0` → the assertion reds, witnessing the gap. Co-locate with the
  `equivalence.test.ts` transform/filter cases.

---

## 7. Disposition summary

| ID | Finding | Disposition | Instrument (SHIP) |
|---|---|---|---|
| **MCI-1** | Bare `cqw`/`dvh` rAF resolution vs mixed-unit eager-px freeze — the `COMPUTED_UNITS=["var","calc"]` classification asymmetry; EXTENDS F-VJ-2 to the bare/mixed case it doesn't cover | **SHIP-in-G** (witness + documented contract) + **value.js-HANDOFF** (classify cq/viewport units as `computed`) | `proof:cqw-resolution` — bare emits `cqw` string; mixed freezes (documented); flip the classifier → path change witnessed |
| **MCI-2** | `currentColor` / `light-dark()` / system colors don't PARSE (re-grounds F-VJ-5 from the interp side) | **value.js-HANDOFF** | paired kf equivalence test on publish; zero kf edit beyond re-pin |
| **MCI-3** | Intrinsic-size `0 → auto` — keyword endpoint, not a numeric leaf | **BOOK + value.js-HANDOFF (E7)** — owned by `r-animation-sota G26-4` | (re-affirm; no new disposition) |
| **MCI-4** | `min()`/`max()`/`clamp()` interp path unwitnessed (atomic-`calc` vs decomposed-FunctionValue) | **MEASURE-FIRST** | `proof:math-fn-atomic` — assert single computed leaf; decomposed-leaf shape reds |
| **MCI-5** | Gradient / filter / transform-function-LIST length-mismatch pads to `ValueUnit(0)` (silent-wrong for non-`0`-identity functions like `brightness`) | **SHIP-in-G** (witness) + **value.js-HANDOFF** (identity-aware pad) | `proof:fn-arity-pad` — `brightness` holds identity `1` at `t=0`, not `0` |
| **MCI-6** | The interpolation KERNEL is value-type-agnostic; `calc`/`var`/`@property`/`color-mix`/relative-color/`color()`/gradients/transforms/`matrix3d`/filters all interpolate today | **RECORD (ALREADY-SOTA)** | — (the binding coverage matrix, §5) |

---

## inv-16 compliance

This lane wrote ONLY `docs/tranches/G/audit/a-modern-css-interp.md`. ZERO source/test/CI/
demo edits to keyframes OR value.js. Every value.js item (MCI-1 classifier, MCI-2 color
sentinels, MCI-4/MCI-5 pad policy) is a HAND-OFF *proposal* the value.js owner sequences;
the kf-side witnesses (MCI-1, MCI-5) are proposed G-wave IMPL, not written here. Every kf
claim is `file:line`-grounded against the live `tranche-g-dev` tree; every value.js claim
against the live `0.11.0` source. I DID NOT re-litigate `a-valuejs-leverage`'s re-pin
headline (cited, EXTENDED at the bare/mixed-cqw case it does not cover) nor
`r-animation-sota`'s SVG/intrinsic-size frontier (cited, re-affirmed).
