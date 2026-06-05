# SOTA Audit — value.js: quantize · transform · math · easing · utils

**Lane:** `value.js/src/{quantize,transform,math,easing}.ts` + `utils.ts` — the
non-color/non-parser surfaces keyframes.js touches (matrix3d transform decomposition,
the easing registry / cubic-bezier / `steppedEase` / `linear()`, the math leaves,
shared utilities).

**Disposition vocabulary:** every value.js finding is **FOLD-VALUEJS-HANDOFF** per
inv-16 — value.js is dirty + active; we propose a value.js tranche for the value.js
owner to formalize, never a direct write. A handful are **ALREADY-SOTA** (flagged so the
owner doesn't manufacture work). keyframes.js-side observations are tagged
**FOLD-E** where the fix belongs to the engine, not the dependency.

**Consumption map (what kf actually pulls from this lane):**

| value.js export | kf consumer | file:line |
|---|---|---|
| `CSSCubicBezier` | `getTimingFunction`, presets | `animation/utils.ts:121`, `animation/animations.ts:96` |
| `steppedEase`, `jumpTerms` | `getTimingFunction` | `animation/utils.ts:132,135,136` |
| `timingFunctions` (registry) | `getTimingFunction`, `TimingFunctionNames` | `animation/utils.ts:138`, `animation/constants.ts:47` |
| `cssLinear` | (none — kf builds `linear()` itself via `springLinearStops`) | — |
| `bezierPresets`, `timingFunctionDescriptions` | (editor/demo tooltip surface, not engine) | — |
| `decomposeMatrix3D` / `recomposeMatrix3D` / `slerp` / `interpolateDecomposed` | **NONE — orphaned export** | see F1 |
| `unpackMatrixValues` (units/utils, NOT transform/) | matrix sub-property resolution | `units/normalize.ts:175` |
| `quantizePixels` / `dominantColor` | **NONE in kf src or demo** | see F12 |
| `math.ts` leaves (`lerp`,`clamp`,`cubicBezier`,`deCasteljau`) | indirect, via easing | — |

The single highest-value finding (F1/F2) is that the lane carries **two divergent
matrix-decomposition implementations**, and keyframes' interpolation rides the
*wrong* (naive, buggy) one while the rigorous one is dead code.

---

## F1 — Two divergent matrix decompositions; the rigorous one (`transform/decompose.ts`) is orphaned

- **file:line:** `value.js/src/transform/decompose.ts:227` (`decomposeMatrix3D`), exported at `value.js/src/index.ts:299-304`; the *parallel* path is `value.js/src/units/utils.ts:156` (`unpackMatrixValues`), consumed at `value.js/src/units/normalize.ts:175`.
- **SOTA gap:** `transform/decompose.ts` is a faithful CSSOM/"unmatrix" implementation — Gram-Schmidt orthogonalization, negative-determinant flip (`decompose.ts:313-319`), trace-based quaternion extraction, `slerp`, `interpolateDecomposed`. It is the **correct** SOTA path for interpolating `matrix()`/`matrix3d()` (matches the CSS Transforms L1/L2 "interpolation of matrices" algorithm: decompose → componentwise lerp + quaternion slerp → recompose). **But nothing consumes it** — neither value.js's own interpolation (`units/normalize.ts` / `units/interpolate.ts`) nor keyframes.js (grep for `decompose*`/`slerp`/`interpolateDecomposed` in `keyframes.js/src` returns zero). Git history (`3896d51 feat: matrix decomposition…`) shows it was added, tested, hardened — then never wired in. Meanwhile the live path, `unpackMatrixValues`, is a **naive Euler decomposition** (F2).
- **perf/elegance rationale:** dead, tested, exported code is the worst kind of debt — it *looks* authoritative and will be cited as "we handle matrix interp correctly" when we don't. Wiring `interpolateDecomposed` into the matrix-interpolation path is the SOTA move; the alternative is deleting `transform/decompose.ts` so the surface stops lying. Either resolves the divergence.
- **disposition:** FOLD-VALUEJS-HANDOFF — propose a value.js tranche: *unify* the two paths. Make `unpackMatrixValues` (or its replacement) delegate to `decomposeMatrix3D` + `recomposeMatrix3D` + `interpolateDecomposed`, OR excise the orphan. The owner decides which; this audit's recommendation is to *wire it in* (it's the better algorithm) and delete the Euler decomposition.
- **isomorphism note:** **NOT isomorphic — this changes pixels**, and that is the point: the current Euler path produces visibly wrong rotations under gimbal lock / combined skew+rotation (F2). Switching to the decompose path makes `matrix3d` interpolation match what a browser does for a transitioned/animated transform. Any kf snapshot test pinned to the *old* (wrong) trajectory must be re-baselined. Strongly befitting — this is a correctness upgrade, not a cosmetic one.

---

## F2 — Live matrix interpolation uses naive Euler-angle decomposition with gimbal-lock and no orthogonalization

- **file:line:** `value.js/src/units/utils.ts:197-232` (`unpackMatrixValues` for `matrix3d`).
- **SOTA gap:** the 16-element branch reads `rotateX/Y/Z` straight out of raw matrix cells via `Math.atan2` (`utils.ts:220-229`) and `scaleX/Y/Z` straight from column lengths — **without** (a) Gram-Schmidt orthogonalization to separate skew from rotation, (b) the negative-determinant coordinate-flip check, or (c) quaternion-based rotation (Euler angles gimbal-lock and interpolate badly near poles). `rotateY = atan2(m13, sqrt(m11²+m12²))` is a textbook Euler extraction that silently double-counts skew as rotation and diverges from the CSSOM unmatrix algorithm. The components are then lerped **independently as scalars** at `units/normalize.ts:175` — Euler-angle componentwise lerp, which is the classic wrong way to interpolate 3D rotations.
- **perf/elegance rationale:** the correct algorithm *already exists in the same repo* (`transform/decompose.ts`, F1). This isn't "write new math" — it's "delete the wrong copy, call the right one." Net LOC drops.
- **disposition:** FOLD-VALUEJS-HANDOFF — fold into the F1 unification tranche.
- **isomorphism note:** same as F1 — intentionally non-isomorphic for matrix3d with rotation/skew; isomorphic for pure translate/scale (where Euler and unmatrix agree). Re-baseline affected snapshots.

---

## F3 — `solveCubicBezierX` lacks the precomputed sample-spline + slope-gated solver (Firefox/Blink / bezier-easing SOTA)

- **file:line:** `value.js/src/easing.ts:136-170` (`solveCubicBezierX`, `CSSCubicBezier`).
- **SOTA gap:** the current solver is Newton-Raphson (8 iters) with a **64-iteration bisection fallback** every time Newton fails to converge. The browser-engine SOTA (WebKit `UnitBezier`, Firefox `nsSMILKeySpline`, gre/bezier-easing) is: (1) build a small **precomputed sample table** of `X(t)` at `kSplineTableSize = 11` evenly-spaced t (step `1/10`) *once at curve-construction time*; (2) at sample time, locate the bracketing interval from the table in O(1); (3) if local slope `≥ NEWTON_MIN_SLOPE (0.001)` run a few (`NEWTON_ITERATIONS = 4`) Newton steps, else fall back to `binarySubdivide` (`SUBDIVISION_PRECISION 1e-7`, `SUBDIVISION_MAX_ITERATIONS 10`). The table gives Newton a near-perfect seed so it converges in 4 (not 8) iterations and the slow 64-iter bisection essentially never fires.
- **perf/elegance rationale:** `CSSCubicBezier` returns a *closure* (`easing.ts:164`) — the table would be built once in that closure and amortized across every `easing(t)` call on the hot interpolation path (`Animation.interpFrames` reads `frame.timingFunction.fn` per frame, per element). Current code re-runs Newton+bisection from the raw guess `t=x` on every call with no memo. The flat-slope guard (`|dxt| < 1e-12 → break` at `easing.ts:146`) drops to the 64-iter bisection precisely on the curves where it matters (ease-in-expo, back-overshoot). The sample-table approach is strictly faster and more robust.
- **disposition:** FOLD-VALUEJS-HANDOFF — propose adopting the bezier-easing-style precomputed-spline solver in `easing.ts`.
- **isomorphism note:** **isomorphic to within tolerance** — both converge to the same root; the new path is more accurate (1e-7 vs the early-break cases) and faster. No visible pixel change except where the old bisection early-exited imprecisely. Befitting.

---

## F4 — `bounce*` easings approximate physics with hand-tuned Bézier control points; no real `linear()` spring/bounce generator

- **file:line:** `value.js/src/easing.ts:172-224` (`easeInBounce`/`bounceInEase`/`bounceInEaseHalf`/`bounceOutEase`/`bounceInOutEase`), the bezier presets `ease-*-back` at `easing.ts:370-372`.
- **SOTA gap:** `bounceInEase = CSSCubicBezier(0.09, 0.91, 0.5, 1.5)` and the `bounceOutEase`/`interpBezier` variants are *single-arc* Bézier curves dressed as bounces — a real multi-bounce (Penner `easeOutBounce` is 4 piecewise parabolas) or a real spring (damped sinusoid) cannot be a single cubic Bézier. SOTA (Motion `spring()`, okikio/spring-easing, Josh Comeau's generator) expresses springs/bounces as **CSS `linear()` stops** sampled from the actual physics ODE — which is exactly what the modern-web-guidance `physics-based-easing` guide prescribes (Baseline 2023-12-11). value.js already *consumes* `linear()` (`cssLinear`, `easing.ts:33`) but has **no generator** to produce spring/bounce `linear()` strings; the only one in the ecosystem lives in **keyframes.js** (`animation/springLinearStops.ts`, `animation/springTimingFunction.ts`). So value.js's "bounce" family is a lower-fidelity fake while the high-fidelity primitive sits one repo over.
- **perf/elegance rationale:** a `springLinear()`/`bounceLinear()` generator in value.js would (a) let value.js's easing registry expose *real* physics easings, (b) give the WAAPI path a `linear()` it can run on the compositor thread (the whole point of the guidance), and (c) de-duplicate the spring math that currently only keyframes has. Pairs naturally with `cssLinear` (generate ↔ consume).
- **disposition:** FOLD-VALUEJS-HANDOFF — propose a value.js tranche adding a spring/bounce → `linear()` generator (mirroring kf's `springLinearStops`), and consider deprecating the Bézier-faked `bounce*` entries or re-pointing them at it. **Cross-ref FOLD-E:** kf's `springLinearStops`/`SpringProgress` is the reference implementation; the FOLD-E decision is whether kf keeps its copy or consumes a value.js one once it exists (boundary-aware — kf's light surface must stay value.js-free, so kf likely keeps its own and value.js gets a parallel for *its* consumers).
- **isomorphism note:** additive (new generator) — isomorphic for existing callers. Re-pointing `bounce*` to physics-`linear()` *would* change those curves' pixels (more faithful); gate behind new names to stay isomorphic, or re-baseline if the owner wants the upgrade in place.

---

## F5 — `cssLinear` flat-segment / duplicate-input handling diverges from CSS Easing L2 "last matching point" rule

- **file:line:** `value.js/src/easing.ts:80-99` (the returned sampler), spec: CSS Easing L2 §calculate-output-progress.
- **SOTA gap:** the binary search (`easing.ts:85-90`) finds *a* bracketing segment, and the degenerate guard `if (p0.input === p1.input) return p0.output` (`easing.ts:95`) returns the **left** endpoint at a discontinuity. The spec ([css-easing-2](https://drafts.csswg.org/css-easing/)) says: when `inputProgress` matches the input of ≥1 point, return the output of the **last** such point (with a `before` flag for the first-point edge). For a flat/step segment authored as `linear(0, 0.5 25% 75%, 1)` (which the doc comment at `easing.ts:26` explicitly advertises as supported — "second stop spans 25%–75%"), sampling exactly at the shared input must yield the *later* stop's output to reproduce the CSS step semantics. Current code yields the earlier one. Minor, but it's a spec-conformance gap on a feature the comment claims to support.
- **perf/elegance rationale:** correctness on the documented flat-segment case; the fix is a tie-break direction in the search, not new structure.
- **disposition:** FOLD-VALUEJS-HANDOFF — propose aligning the tie-break with the L2 "last matching point" rule (and a test for the `0.5 25% 75%` flat segment).
- **isomorphism note:** non-isomorphic *only* exactly at a shared-input sample of a flat segment — a measure-zero set in practice; effectively isomorphic. Befitting (spec conformance).

---

## F6 — `slerp` is missing the `acos` domain clamp (NaN risk on near-identical quaternions)

- **file:line:** `value.js/src/transform/decompose.ts:386-422` (`slerp`), specifically `const theta = Math.acos(dot)` at `:411`.
- **SOTA gap:** glMatrix / cglm / every production slerp **clamps `dot` to `[-1, 1]` before `acos`** because floating-point dot products routinely exceed 1.0 and `Math.acos(1.0000000002) → NaN`. The code guards the *near-1* case with the NLERP branch (`dot > 0.9995`, `:396`) which masks most occurrences, but a `dot` landing in `(0.9995, 1.0]`… is caught by NLERP, so the practical exposure is small — *however* the symmetric near-`-1` antipodal case after the shorter-arc flip (`:390`) can still feed `acos` a value like `-1.0000001` is *not* possible post-flip (flip makes dot ≥ 0). Net: the NLERP threshold incidentally shields the NaN, but the code relies on that coincidence rather than the canonical explicit clamp. SOTA is an explicit `dot = Math.min(1, Math.max(-1, dot))`.
- **perf/elegance rationale:** one-line robustness hardening that makes the invariant explicit instead of emergent; near-zero cost.
- **disposition:** FOLD-VALUEJS-HANDOFF — propose adding the explicit `acos` domain clamp (defensive; pairs with the `sinTheta ≈ 0` guard which is *also* currently implicit via the 0.9995 threshold).
- **isomorphism note:** isomorphic — clamp is a no-op except on the FP-overflow edge it exists to fix. Note: this whole function is currently **dead** (F1) — robustness matters only once it's wired in.

---

## F7 — `logerp` argument order breaks the repo's own "value-pair first, parameter last" canon

- **file:line:** `value.js/src/math.ts:34` (`logerp(t, start, end)`) vs `value.js/src/math.ts:28` (`lerp(start, end, t)` — explicitly documented "Canonical (a, b, t) — value-pair first, parameter last").
- **SOTA gap:** `lerp` was deliberately canonicalized to `(start, end, t)` (comment at `math.ts:27`), but `logerp` (`:34`), `deCasteljau` (`:42`), `cubicBezier` (`:55`), and `interpBezier` (`:61`) all take `t` **first**. This is an internal inconsistency that invites call-site bugs (a reader who learned `lerp(a,b,t)` will mis-call `logerp`). Not a web-platform-spec issue; a library-ergonomics / footgun issue.
- **perf/elegance rationale:** KISS / least-surprise. Uniform parameter order across the math module removes an entire class of swap bugs.
- **disposition:** FOLD-VALUEJS-HANDOFF — propose normalizing `logerp`/bezier helpers to `(…points…, t)` last, with a deprecation shim if any external caller depends on the old order. Low priority, but cheap and the owner already started the canonicalization on `lerp`.
- **isomorphism note:** isomorphic if done as a pure signature swap with call-site updates; the math is unchanged.

---

## F8 — `cubicBezierToSVG` hardcodes a 1000-step fixed-resolution path sampler

- **file:line:** `value.js/src/math.ts:69-84` (`cubicBezierToSVG`).
- **SOTA gap:** the loop `for (t = 0; t <= 1; t += 0.001)` emits ~1000 `L` segments unconditionally — for an editor curve preview this is wasteful (a quadratic/cubic SVG path needs one `C` command, not 1000 line segments) and at small render sizes is overkill; at huge sizes it can under-resolve. SOTA for curve preview is either a native SVG cubic `C x1 y1, x2 y2, 1 1` path (exact, 1 command) or adaptive flattening. The `0.001` literal is a magic constant.
- **perf/elegance rationale:** this is a *demo/editor* helper (not the hot animation path), so impact is bounded — but emitting a real `<path d="M0 0 C …">` is both exact and ~1000× smaller. Pure elegance/payload win.
- **disposition:** FOLD-VALUEJS-HANDOFF — propose emitting a native cubic-`C` path (or parameterizing the step). Low priority (editor surface).
- **isomorphism note:** visually isomorphic at typical sizes; the `C`-path version is *more* accurate. Befitting.

---

## F9 — Quantizer `k-means++` seeding uses `Math.random()` — non-deterministic palette output

- **file:line:** `value.js/src/quantize/cluster.ts:199` (`Math.random() * total`), within `kmeansPlusPlusInit`.
- **SOTA gap:** the D²-weighted seeding (correctly Arthur–Vassilvitskii 2007) draws from `Math.random()`, so `quantizePixels` is **non-deterministic** — the same image yields different palettes across runs, and there is no seed parameter in `QuantizeOptions` (`quantize/types.ts:10-29`). SOTA quantizers used as a *library primitive* (and especially as a build/test dependency) expose a seedable PRNG (e.g. mulberry32/xoshiro) so palettes are reproducible and snapshot-testable. Material Color Utilities, leant’s `colorjs`, and `image-q` all seed or are fully deterministic.
- **perf/elegance rationale:** reproducibility is a correctness property for a *library* (vs an app). It also makes the quantizer unit-testable without statistical tolerance bands. Trivial to add a `seed?: number` to `QuantizeOptions` and thread a tiny PRNG.
- **disposition:** FOLD-VALUEJS-HANDOFF — propose a `seed` option + injectable/deterministic RNG (mirrors how kf's `ScrollTimeline` injects `getScrollY` for testability).
- **isomorphism note:** non-isomorphic *by nature* today (output already varies run-to-run); adding a seed makes it deterministic, which is strictly better. Befitting.

---

## F10 — `medianCutOKLab` splits at the **count median**, not the perceptual/volume median (classic MMCQ deviation)

- **file:line:** `value.js/src/quantize/cluster.ts:99` (`const mid = count >> 1`) inside `splitBucket`, and the bucket-selection score `Math.max(rL,rA,rB)` at `cluster.ts:136`.
- **SOTA gap:** two deviations from canonical median-cut: (1) the split point is the **population median** (`count >> 1`) rather than the median *along the chosen axis* weighted by population × volume — Heckbert's MMCQ and the widely-used `quantize`/`image-q` variants split where the cumulative population reaches half, and rank buckets by `population × volume`, not raw axis range. Ranking by range alone (`cluster.ts:136`) over-splits low-population but wide-gamut regions (e.g. a few bright specular pixels) and under-represents large flat regions. (2) Re-sorting the whole bucket every split (`indices.sort`, `cluster.ts:88`) is O(n log n) per split. Since this only *seeds* k-means (the comment at `cluster.ts:44` is honest about this being "coarse"), the impact is muted — but the seeding bias propagates into the final palette.
- **perf/elegance rationale:** better seeding → fewer k-means iterations to converge and a more representative palette. The population×volume ranking is the textbook fix and is cheap.
- **disposition:** FOLD-VALUEJS-HANDOFF — propose population-weighted axis-median splits + `population × volume` bucket ranking. Medium priority (quality, not correctness).
- **isomorphism note:** non-isomorphic (palettes shift), but the quantizer has no isomorphism contract — it's an extraction heuristic. Befitting if the owner wants palette-quality gains.

---

## F11 — Quantizer is single-threaded synchronous on the main thread; no Worker/OffscreenCanvas path

- **file:line:** `value.js/src/quantize/index.ts:97` (`quantizePixels` — synchronous), k-means inner loop `cluster.ts:251-273`.
- **SOTA gap:** `quantizePixels` runs MMCQ + multi-pass Lloyd k-means **synchronously**. For the default `targetPixels: 20_000` (`types.ts:47`) × `maxIterations: 10` × `k≤16` the inner loop is ~3.2M distance evals — enough to blow the INP budget if called on the main thread during interaction (modern-web-guidance `identify-inp-causes` — Long Animation Frames). SOTA image-palette extraction (Material Color Utilities, vibrant.js workers) runs off-thread via Web Worker / OffscreenCanvas, or yields cooperatively. value.js offers neither an async/yielding variant nor a Worker-friendly (transferable-typed-array) entry. (keyframes.js itself solved the analogous INP problem in `AnimationGroup.tick` with `scheduler.yield` batching — the pattern exists in the ecosystem.)
- **perf/elegance rationale:** keeps palette extraction off the interaction critical path; the algorithm is already written against `Float64Array` so it's *almost* Worker-ready (just needs a transferable boundary + an async shell).
- **disposition:** FOLD-VALUEJS-HANDOFF — propose an async/yielding `quantizePixelsAsync` (or a documented "run me in a Worker" contract with transferable buffers). Medium priority (perf hygiene for a heavy primitive).
- **isomorphism note:** isomorphic (same output, different scheduling). Pure win.

---

## F12 — `quantize` and `transform/decompose` are exported surface area that **no keyframes consumer uses** — dead weight on the boundary

- **file:line:** exports at `value.js/src/index.ts:294-295` (`quantizePixels`/`dominantColor`) and `:299-310` (decompose/recompose/slerp/interpolateDecomposed). Zero hits in `keyframes.js/src` and `keyframes.js/demo` (grep confirmed).
- **SOTA gap:** keyframes.js works hard to keep its *light* barrel free of static value.js edges (`animation/CLAUDE.md` "static/dynamic boundary", CI `proof:boundary`). Every symbol value.js exports that kf never imports is pure tree-shake liability — and `quantize` pulls in the OKLab gamut machinery (`quantize/index.ts:12`). If the demo *wants* palette extraction (the `playground` asset drag-drop demo is the natural home — modern-web-guidance would surface `quantizePixels` for a "dominant color of dropped image" affordance), that's a **FOLD-E demo opportunity**; if not, these are candidates for a value.js sub-path export (`@mkbabb/value.js/quantize`) so they never enter kf's graph.
- **perf/elegance rationale:** bundle hygiene + honest surface area. A sub-path export for the heavy/standalone primitives (quantize, transform) keeps the main barrel lean and the kf boundary proof simpler.
- **disposition:** FOLD-VALUEJS-HANDOFF (sub-path export / surface trimming) **+ FOLD-E opportunity** (wire `dominantColor`/`quantizePixels` into the `playground` demo for image-driven palette/accent — genuinely befitting that demo's drag-drop-an-asset story; would also exercise the surface kf otherwise leaves cold).
- **isomorphism note:** isomorphic (no behavior change; export-graph reshaping only). The demo wiring is additive.

---

## ALREADY-SOTA (do not manufacture work)

- **A1 — OKLab-native quantization distance metric.** `chromaDistSq` (`cluster.ts:21-31`), the JND dedup via `deltaEOK` (`cluster.ts:337`), and quantizing *natively in OKLab* rather than RGB (`index.ts:1-10`) are genuinely ahead of most JS palette libraries (which still cluster in sRGB). The chroma-weighted `d² = ΔL² + (1+kC·C)(Δa²+Δb²)` and perceptual nearest-neighbor palette sort (`index.ts:55-87`) are a thoughtful, modern design. The Float64Array SoA layout (`sumL/suma/sumb` accumulators, `cluster.ts:240-243`) is cache-friendly and zero-alloc per iteration. Keep.
- **A2 — `steppedEase` / `jump-*` vocabulary is CSS-Easing-L1 complete.** `jumpStart/End/Both/None` (`easing.ts:276-291`) with the full `jumpTerms` set including the L1 aliases (`start`/`end`/`both`) match the spec exactly, and `jumpNone`'s `steps≤1` guard (`easing.ts:289`) is correct. kf's `getTimingFunction` round-trips the full vocabulary (`animation/utils.ts:126-136`). Spec-faithful.
- **A3 — `cssLinear` core algorithm.** Modulo F5's flat-segment tie-break, the `linear()` implementation correctly resolves unset input positions (first→0%, last→100%, gap fill by linear interpolation between anchors, `easing.ts:46-68`), enforces monotonicity (`easing.ts:71-75`), and binary-searches segments (`easing.ts:85-90`). This is a real CSS Easing L2 `linear()` consumer — most libraries only *emit* `linear()`, they don't *parse/evaluate* it. Ahead of the curve.
- **A4 — `bezierPresets` as a single source of truth.** Centralizing the Penner/Material bezier control-point tables (`easing.ts:334-373`) plus `timingFunctionDescriptions` (`easing.ts:381-425`) so every consumer (kf, editors) asks one registry "is this a bezier? what are its points?" is exactly the right architectural call — kf's `getTimingFunction` and `TimingFunctionNames` ride it cleanly. Keep.
- **A5 — 2D matrix decomposition (`decomposeMatrix2D`).** `decompose.ts:41-92` correctly follows CSSOM View §15.1 (translate → column norms → skew orthogonalization → determinant flip → `atan2` rotation). This one is *right* — the problem (F1/F2) is that the *3D* live path doesn't use the analogous rigorous decomposition; the 2D one here is correct and SOTA. (It is, however, also unconsumed — same orphan caveat as F1.)
- **A6 — `memoize` with TTL + `shouldCache` predicate.** `utils.ts:108-153` — the `shouldCache` hook (used by `units/normalize.ts` to skip caching layout-dependent reads of detached elements) is a genuinely elegant escape valve, and TTL + LRU-ish eviction is solid. Modern, no notes.
- **A7 — `scheduler.yield`-shaped INP awareness is a kf concern, correctly placed there.** value.js's math/easing leaves are pure and synchronous *by design* (hot interpolation path); the cooperative-yielding lives in kf (`AnimationGroup.tick`) where it belongs. The one place value.js *should* yield is the quantizer (F11), not the easing leaves. Correct division of labor.

---

## Summary for the value.js owner (handoff priority order)

1. **F1 + F2 (HIGH):** unify the two matrix decompositions — wire `interpolateDecomposed` into the live interpolation path and delete the Euler `unpackMatrixValues` 3D branch (or excise the orphan if not wiring). Correctness + dead-code elimination in one move.
2. **F3 (MED-HIGH):** precomputed-spline + slope-gated cubic-bezier solver (bezier-easing/UnitBezier pattern) — hot-path perf + accuracy.
3. **F4 (MED):** real spring/bounce → `linear()` generator (pairs with `cssLinear`; mirrors kf's `springLinearStops`).
4. **F9 + F11 (MED):** quantizer determinism (seed) + off-main-thread/async path.
5. **F5, F6, F7, F10 (LOW-MED):** spec-conformance + robustness nits.
6. **F8, F12 (LOW):** editor/demo-surface polish + export-graph trimming. F12 also seeds a **FOLD-E** `playground` demo opportunity (image → dominant color).

**FOLD-E cross-refs for the keyframes side:**
- F4: the spring `linear()` reference implementation already lives in kf (`springLinearStops.ts`); the boundary contract means kf keeps its own value.js-free copy — value.js gets a parallel for *its* consumers. No kf change required, but worth a note in the E tranche that the spring-curve math is canonically kf's.
- F12: wire `quantizePixels`/`dominantColor` into the `playground` demo (image drop → accent/palette) — befitting, and it exercises an otherwise-cold value.js surface.
