# SOTA Audit — value.js color / units / normalize lane

**Tranche E · research + findings only (no implementation).**
**Lane:** value.js `src/units` (color spaces, normalize, `convertToPixels`, the
computed-value DOM resolution) + the interpolation primitives keyframes.js
consumes (`lerpValue` / `lerpColorValue` / `lerpComputedValue` /
`normalizeValueUnits` / `prepareInterpVar`).

**inv-16 disposition rule:** value.js is dirty + active. Every finding below
is **FOLD-VALUEJS-HANDOFF** — a proposal the value.js owner formalizes into a
value.js tranche. We do NOT propose writing value.js directly. (keyframes.js
findings, where any, would be FOLD-E — none arose in this lane; the keyframes
consumption sites are thin and correct.)

All file:line cites are against the live tree at audit time
(`/Users/mkbabb/Programming/value.js`, branch state of 2026-06-05) and
`/Users/mkbabb/Programming/keyframes.js`.

---

## Verdict (headline)

**SOTA-aligned on color science; one real correctness GAP in length-unit
resolution; a small cluster of per-frame / cache-lifecycle perf-and-correctness
opportunities.**

The color pipeline is genuinely state-of-the-art: perceptual OKLab default,
full CSS Color 4/5 syntax (relative color, `color()`, `color-mix()`, wide-gamut
spaces), spec-correct cylindrical hue interpolation (CSS Color 4 §12.4),
premultiplied-alpha mixing, NaN/`none` propagation, and Ottosson analytical
gamut mapping. Interpolation output is correct physical-unit `oklab(L% a b /
alpha%)` that the browser gamut-maps — verified live (see §0). The one true
**GAP** is in `convertToPixels`: ~24 declared length units (the entire
small/large/dynamic viewport family + `cap`/`ic`/`lh`/`rlh` + logical `vi`/`vb`)
silently resolve to a no-op (wrong pixels). The rest are perf/lifecycle
opportunities, not breakage.

---

## §0 — Ground-truth probe (live, against built `value.js/dist`)

`red → blue` interpolation in OKLab, three sample points:

```
START: oklab(62.79553658442184% 0.22486306663558264 0.1258462754162425 / 100%)
MID:   oklab(53.99845437103836% 0.09620303924921089 -0.09284094315819447 / 100%)
END:   oklab(45.20137215765489% -0.03245698813716086 -0.3115281617326314 / 100%)
```

Confirms: endpoints are denormalized to **physical** OKLab (L in %, a/b in
[-0.4, 0.4], alpha in %), not left in the internal normalized [0,1] space. The
denormalize is driven by `normalizeValueUnits` passing `inverse=true` to
`normalizeColorUnits` (`normalize.ts:380-388`). Output is valid CSS Color 4
`oklab()` → the browser performs the final gamut map. This is the correct,
isomorphic, SOTA division of labour. **No interpolation-output bug exists.**

---

## FINDINGS

### F1 — `convertToPixels` silently no-ops ~24 declared length units (GAP)

- **file:** `value.js/src/units/utils.ts:274-355` (`convertToPixels`) +
  `convertAbsoluteUnitToPixels` `utils.ts:255-272`; declarations at
  `value.js/src/units/constants.ts:2-41` (`RELATIVE_LENGTH_UNITS`).
- **gap:** `RELATIVE_LENGTH_UNITS` declares 40 units. `convertToPixels`
  resolves only `em rem vh vw vmin vmax % ch ex cqw cqh cqi cqb cqmin cqmax`.
  The remaining **24** fall through the `if/else` chain to
  `convertAbsoluteUnitToPixels`, whose `if`-ladder only knows
  `cm/mm/Q/in/pt/pc` — so any unknown unit **returns the raw numeric value
  unchanged**. Net effect: `50dvh` → `50px`, `2lh` → `2px`, `10cqi`-sibling
  `10vi` → `10px`. The missing set:
  `cap ic lh rlh vi vb svw svh svi svb svmin svmax lvw lvh lvi lvb lvmin lvmax
  dvw dvh dvi dvb dvmin dvmax`.
- **spec/guide:** CSS Values & Units L4 (the `svh/lvh/dvh` + `*i/*b` logical
  family); modern-web-guidance `css` guide §1 Foundations explicitly steers
  authors to `cqi`/`cqb` and dynamic viewport units as the idiomatic modern
  primitives ("baseline" platform guidance). MDN `<length>` lists all of
  `cap/ic/lh/rlh/dvh/...` as shipped. These are **Baseline** today.
- **rationale (correctness, not perf):** This is the only finding that produces
  *wrong pixels* rather than slower/heavier ones. `vi`/`vb` resolve to raw px
  even though `vw`/`vh` next to them resolve correctly — a sharp asymmetry. The
  dynamic family (`dvh` etc.) is exactly what a modern animation targeting
  mobile would reach for.
- **isomorphism:** Fixing changes pixels for inputs that are currently *wrong*,
  so the "isomorphic" bar is the spec, not current behaviour. Most are simple:
  `vi`/`vb` = writing-mode-aware `vw`/`vh` (the `isVerticalWritingMode` helper
  already exists at `utils.ts:250-253` and is used for `cqi`/`cqb`); `lh`/`rlh`
  = `line-height` of element / root; `cap`/`ic` = cap-height / advance of "水"
  (canvas-measurable like `ch` already is, `utils.ts:300-318`). The
  small/large/dynamic viewport units cannot be read from `window.innerHeight`
  alone — but the pragmatic SOTA stance (matching what JS libs do) is to treat
  `sv*`/`lv*`/`dv*` as `v*` (the dynamic value at sample time) rather than
  no-op; an honest fallback beats silent identity.
- **disposition:** **FOLD-VALUEJS-HANDOFF.** Propose a value.js units tranche:
  (a) resolve `vi`/`vb` via the existing writing-mode helper; (b) resolve
  `lh`/`rlh` from computed `line-height`; (c) `cap`/`ic` via canvas like `ch`;
  (d) map `sv*`/`lv*`/`dv*` onto their `v*`-equivalent at sample time. Also
  add a fail-loud branch: an unrecognized **relative** length unit reaching
  `convertAbsoluteUnitToPixels` should throw/warn rather than identity-pass
  (mirrors `normalizeNumericUnits`'s own "silent passthrough hides bugs"
  policy at `normalize.ts:212-216`).

---

### F2 — `getComputedValue` memo is unbounded + never invalidated on resize (GAP/perf)

- **file:** `value.js/src/units/interpolate.ts → normalize.ts:136-206`
  (`getComputedValue = memoize(...)`); memoize impl
  `value.js/src/utils.ts:108-153`.
- **gap:** `getComputedValue` is memoized keyed on
  `` `${value.toString()}-${elementId}` `` (`normalize.ts:195-196`) with **no
  `maxCacheSize` and no `ttl`**. `shouldCache` (`normalize.ts:200-205`) only
  declines to cache *disconnected* targets. Two consequences:
  1. **Staleness on resize.** `vh`/`vw`/`cqw` resolve through
     `convertToPixels` reading `window.innerHeight` / container `clientWidth`
     (`utils.ts:287-349`). Once cached for a connected element, a window or
     container resize does **not** invalidate the entry — a `100vh` animation
     keeps painting the pre-resize pixel value for the life of the page.
  2. **Unbounded growth.** Distinct `value.toString()` keys (every distinct
     `calc()`/`var()`/computed string × every element id) accumulate forever.
     For a long-lived app cycling computed-unit animations this is a slow leak.
- **spec/guide:** N/A spec; this is engine hygiene. The resize-staleness is a
  behavioural correctness bug for any viewport/container-relative animation.
- **rationale (perf + correctness):** The memo is the right idea — DOM
  round-trips (`style[prop] = ...; getComputedStyle(...)`) are the single most
  expensive thing in the computed path and absolutely should be cached within a
  frame/layout epoch. The problem is the cache outlives the layout epoch it was
  valid for.
- **isomorphism:** A correct invalidation strategy changes pixels only when the
  viewport/layout actually changed — i.e. it makes behaviour *more* correct,
  matching native CSS (which re-resolves `vh` on resize). Stable otherwise.
- **disposition:** **FOLD-VALUEJS-HANDOFF.** Propose: (a) bound the cache
  (`maxCacheSize`, the memoize option already exists at `utils.ts:97`); (b)
  key/scope the cache to a *layout epoch* — e.g. a generation counter bumped on
  a `ResizeObserver`/`resize`/`scroll`-of-container signal, folded into the
  `keyFn`, so resize transparently busts the relevant entries. A short `ttl`
  (one frame) is the crude version; an epoch counter is the elegant one. This
  matters most for keyframes.js, whose entire computed-unit story (`vh`,
  `cqw`, `calc(100cqw - 100%)` per the project's own AnimationVisualizer memo)
  rides this memo.

---

### F3 — Analytical gamut map diverges from the CSS Color 4 spec algorithm (BOOK / ALREADY-SOTA-adjacent)

- **file:** `value.js/src/units/color/gamut.ts` (Ottosson analytical clip,
  `gamutMapOKLab` `gamut.ts:247-277`, `gamutMapSRGB` `gamut.ts:305-321`);
  wired through `gamutMap` in `dispatch.ts:189-215` and all RGB direct paths
  (`conversions/direct.ts:31,36-43`).
- **observation:** value.js gamut-maps with **Ottosson's adaptive-L0
  analytical clip** (alpha=0.05, one Halley step, zero-iteration). The **CSS
  Color 4 spec** algorithm is different: constant-L, constant-H **binary chroma
  reduction in OKLCH** using `deltaEOK` against a channel-clipped candidate,
  terminating when the result is within one JND (~0.02) of the clip (≈ up to
  ~30 iterations). They produce *slightly* different colors near the gamut
  boundary.
- **spec/guide:** CSS Color 4 §"Gamut Mapping"; color.js implements the binary
  search as the reference. value.js already *has* the JND constant
  (`DELTA_E_OK_JND = 0.02`, `gamut.ts:51`) and `deltaEOK` (`gamut.ts:53-61`) —
  the spec's exact ingredients — but doesn't run the spec's loop.
- **rationale (perf vs spec-fidelity tradeoff):** The analytical clip is the
  *better* engineering choice for an animation engine: deterministic,
  zero-iteration, no `deltaE` loop per gamut event, exact hue preservation.
  The spec algorithm is ~30× the work for a sub-JND visual difference. **This is
  a deliberate, defensible, near-SOTA divergence, not a bug** — and crucially,
  for the *interpolation output path* it is moot (F0: output is raw `oklab()`,
  the browser maps it; value.js's gamut map only fires on the parse-side
  direct-RGB paths and explicit `gamutMap`/quantize calls).
- **isomorphism:** Switching to the spec loop would change boundary pixels by
  < 1 JND at ~30× cost — net negative for an animation lib. Keeping analytical
  is the isomorphism-respecting call.
- **disposition:** **BOOK** (record the divergence; do not "fix"). Optional
  **FOLD-VALUEJS-HANDOFF** only as an *opt-in*: expose a
  `gamutMethod: "clip" | "css"` parameter (default keep `"clip"`) for callers
  who need byte-exact CSS Color 4 parity (e.g. a conformance/test harness). The
  ingredients already exist; this is a thin wrapper, not new science.

---

### F4 — `lerpColorValue` allocates a closure + re-walks `unwrapDeep` every frame (perf)

- **file:** `value.js/src/units/interpolate.ts:57-94` (`lerpColorValue`).
- **gap:** The per-frame hot path (called once per color var per frame from
  keyframes.js `engine.ts:578-580`) does:
  - `start.value.keys().forEach((key) => { ... })` (`interpolate.ts:67`) —
    `.forEach` with an arrow allocates a **fresh closure each frame**. `keys()`
    itself is already optimized to a cached frozen tuple (`color/index.ts:259-264`,
    E.W1 Lane C) — good — but the closure over it is not.
  - For **every channel, every frame**: `ValueUnit.unwrapDeep(sv)` +
    `unwrapDeep(ev)` (`interpolate.ts:70-71`) each run a
    `while (raw instanceof ValueUnit)` loop (`index.ts:38-42`). Post-`prepareInterpVar`
    the endpoint structure is invariant — the channels are flat
    `ValueUnit<number>` (depth 1) for the entire animation lifetime — so the
    unwrap result is recomputable-once, not per-frame.
  - `channelOf(start.value, key)` / `channelOf(stop.value, key)` /
    `channelOf(value.value, key)` are three index reads per channel per frame.
- **spec/guide:** N/A; pure engine perf. Color interp is the single most
  expensive `lerpValue` dispatch (vs the numeric fast path which is one `lerp`).
- **rationale (perf):** `prepareInterpVar` (`interpolate.ts:143-150`) already
  pre-resolves the *dispatch* function to kill 3 type checks per call — the same
  philosophy should extend one level deeper: pre-resolve, per InterpolatedVar,
  the **flat channel plan** (the ordered list of `{startNum, stopNum,
  targetSlot, isHue}` with numbers already unwrapped, hue-key already resolved).
  Then the per-frame loop is a tight indexed `for` over primitives — zero
  closures, zero `unwrapDeep`, zero `keys()` indirection. This is the natural
  next step of the existing `_lerp` pre-resolution pattern.
- **isomorphism:** Pure refactor — identical numbers out (the unwrap result and
  hue key are invariant), just computed once instead of 60×/s. Byte-stable.
- **disposition:** **FOLD-VALUEJS-HANDOFF.** Propose extending `prepareInterpVar`
  to attach a precomputed channel plan for the color branch; `lerpColorValue`'s
  fast path reads the plan and writes results into the target slots with no
  per-frame allocation. Caveat to flag for the owner: the producer must verify
  the per-channel `current instanceof ValueUnit` invariant
  (`interpolate.ts:87`) is stable across the lifetime (it is, for parser-minted
  colors) before caching the write target.

---

### F5 — `interpolateHue` operates on a 0..1 round-trip the color path immediately reverses (perf/elegance)

- **file:** `value.js/src/units/interpolate.ts:73-81` (hue branch) +
  `dispatch.ts:234-268` (`interpolateHue`).
- **gap:** For the hue channel of a cylindrical space, `lerpColorValue` divides
  by 360 to normalize, calls `interpolateHue` (which does its own
  `((result % 1) + 1) % 1` wrap), then multiplies by 360 again
  (`interpolate.ts:78-81`). The comment concedes this is to reconcile the
  inverse-denormalized degrees with `interpolateHue`'s [0,1] contract. Two
  modulo wraps + a divide + a multiply per hue channel per frame, purely to
  bridge a unit mismatch.
- **spec/guide:** CSS Color 4 §12.4 (the four hue methods) — the *logic* is
  correct and complete (`shorter`/`longer`/`increasing`/`decreasing`,
  `dispatch.ts:247-262`, with NaN/`none` handling at 241-243). Only the
  unit-bridging is wasteful.
- **rationale (elegance + perf):** `interpolateHue` is the only consumer of the
  [0,1] hue convention on this path; everything around it now speaks degrees.
  An overload (or a `degrees: boolean`) that operates directly in degrees
  (wrap at 360 instead of 1) removes the div/mul/double-mod entirely and reads
  more honestly. Minor cost, but it is *per hue channel per frame* and the
  current form is a documented papering-over.
- **isomorphism:** Algebraically identical (the wrap is the same modular
  arithmetic at a different scale). Byte-stable within FP epsilon.
- **disposition:** **FOLD-VALUEJS-HANDOFF.** Low priority; bundle with F4 since
  both touch the per-frame color loop. Optionally fold into the F4 channel plan
  (`isHue` flag → degree-domain interp directly).

---

### F6 — No color-interpolation benchmark anywhere in the stack (demo/coverage GAP)

- **file:** `keyframes.js/bench/interpolation.bench.ts` (opacity + transform
  only — *no color case*); value.js has `bench/color2-direct-paths.mjs` and
  `bench/color-channel-access.mjs` (conversion micro-benches) but **no
  end-to-end `lerpColorValue` per-frame bench**.
- **gap:** The most expensive `lerpValue` dispatch (color) is the one path with
  zero benchmark coverage. F4/F5 perf claims can't be regression-gated and the
  `oklab` default's per-frame cost is unmeasured. The conversion benches measure
  `color2`, not the interpolation loop that calls it 60×/s.
- **rationale:** A `background-color: red → blue` (and an `oklch` hue-sweep
  `red → green` across the long arc) bench in `interpolation.bench.ts` would
  (a) ground the F4/F5 wins, (b) lock the per-frame color budget, (c) exercise
  the hue branch which is otherwise only correctness-tested.
- **isomorphism:** Additive (new bench), no behaviour change.
- **disposition:** **FOLD-E** for the keyframes-side bench file (a
  `bench/interpolation.bench.ts` color case is keyframes.js's to own);
  **FOLD-VALUEJS-HANDOFF** for an analogous `lerpColorValue` micro-bench in
  value.js to pair with its existing color benches. (This is the one finding
  that splits across both repos.)

---

## ALREADY-SOTA — explicitly flagged (no work)

These are state-of-the-art and should **not** be touched. Honesty per the
precept — don't manufacture work:

- **A1 · OKLab perceptual default.** `colorSpace` defaults to `"oklab"`
  end-to-end (`normalize.ts:366`, keyframes `constants.ts:181`). Perceptually
  uniform interpolation is exactly the SOTA default (Motion, Tailwind v4,
  CSS Color 4 all converge here). **ALREADY-SOTA.**
- **A2 · Full CSS Color 4/5 parse surface.** Relative color syntax
  (`from <color>`, component refs + `calc()`,
  `parsing/color.ts:104-117,253-267`), `color()` for all wide-gamut spaces
  (`parsing/color.ts:216-226`), `color-mix()` with the full space map incl.
  `xyz-d50`/`xyz-d65` (`parsing/color.ts:196-213`), hex/named/legacy. Baseline
  features all present. **ALREADY-SOTA.**
- **A3 · All 15 color spaces are valid interpolation targets**, including
  wide-gamut `display-p3`/`rec2020`/`a98-rgb`/`prophoto-rgb`/`srgb-linear` and
  `xyz`/`lab`/`lch`/`oklch`/`kelvin`. keyframes.js accepts the full set
  (`COLOR_SPACES = Object.keys(COLOR_SPACE_RANGES)`, keyframes `constants.ts:32`,
  validated fail-explicit in `engine.ts:428-441`). **ALREADY-SOTA.**
- **A4 · Spec-correct cylindrical hue interpolation.** CSS Color 4 §12.4 — all
  four methods, NaN/`none` → adopt-other-hue, short/long-arc wrap
  (`dispatch.ts:234-268`); hue channel routed via `CYLINDRICAL_HUE_COMPONENT`
  (`dispatch.ts:221-227`, consumed `interpolate.ts:65,73`). **ALREADY-SOTA**
  (the *logic*; F5 is only its unit-bridging).
- **A5 · CSS Color 4 `color-mix()` semantics.** Premultiplied-alpha
  interpolation for non-hue channels, hue handled separately, percentage
  normalization + alpha multiplier when sum<1, NaN adoption
  (`dispatch.ts:277-349`); N-color fold extends it correctly (`mix.ts`).
  **ALREADY-SOTA.**
- **A6 · XYZ-hub architecture with hot-path direct shortcuts.** Every space ↔
  space routes through XYZ D65 (`dispatch.ts:103-185`); the 6 hottest CSS
  interpolation pairs (`oklab/oklch/hsl ↔ rgb`) skip XYZ via `DIRECT_PATHS`
  (`conversions/direct.ts`), saving a matrix multiply + an `XYZColor` alloc per
  call. CSS Color 4 spec matrices + Bradford D50↔D65 adaptation
  (`xyz-extended.ts:27`, `constants.ts:313-320`). Benched
  (`bench/color2-direct-paths.mjs`). **ALREADY-SOTA.**
- **A7 · `deltaEOK` + JND present and correct** (`gamut.ts:51-61`) — the CSS
  Color 4 difference metric, Euclidean OKLab, JND 0.02. (F3 only notes it isn't
  wired into a spec-loop gamut map — by deliberate choice.) **ALREADY-SOTA.**
- **A8 · Interpolation-output isomorphism.** Endpoints denormalized to physical
  `oklab()`/`oklch()` and emitted as valid CSS so the **browser** owns the final
  gamut map (§0). This is the correct, lib-appropriate division of labour — the
  engine doesn't second-guess the UA's gamut mapping. **ALREADY-SOTA.**
- **A9 · V8-monomorphic Color storage + cached channel-key tuples**
  (`color/index.ts:259-264,298-318`, own-property channels, frozen
  per-subclass `channelKeysWithAlpha`). The per-frame allocation work has
  already been substantially done (E.W1 Lane C); F4 is the residual closure +
  unwrap, not a green field. **ALREADY-SOTA-adjacent.**

---

## Handoff summary for the value.js owner (the FOLD-VALUEJS-HANDOFF tranche)

| # | Title | Disposition | Priority |
|---|-------|-------------|----------|
| F1 | `convertToPixels` no-ops ~24 declared length units (`dvh`/`vi`/`lh`/`cap`/…) | FOLD-VALUEJS-HANDOFF | **HIGH (correctness)** |
| F2 | `getComputedValue` memo: unbounded + stale on resize | FOLD-VALUEJS-HANDOFF | **HIGH (correctness+leak)** |
| F4 | `lerpColorValue` per-frame closure + `unwrapDeep` re-walk → extend `prepareInterpVar` channel plan | FOLD-VALUEJS-HANDOFF | MED (perf) |
| F5 | `interpolateHue` 0..1↔deg round-trip per frame | FOLD-VALUEJS-HANDOFF | LOW (perf/elegance; bundle w/ F4) |
| F6 | `lerpColorValue` micro-bench (value.js side) | FOLD-VALUEJS-HANDOFF | LOW (coverage) |
| F3 | Analytical vs CSS-spec gamut map — opt-in `gamutMethod` only | BOOK (+ optional handoff) | INFO |

keyframes.js-side (FOLD-E): **F6** — add a color-interpolation case to
`keyframes.js/bench/interpolation.bench.ts` (the engine consumes the color path;
the bench is keyframes.js's to own). No other keyframes.js change needed in this
lane — its consumption (`animation/utils.ts:279-282`,
`frame-compiler.ts:258-265`, `engine.ts:578-580`) is thin and correct.
