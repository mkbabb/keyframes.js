# SOTA audit — animation interpolation / springs / motion SOTA (Tranche E)

**Lane:** forward-SOTA-research on interpolation math — closed-form springs, motion-path / `offset-path`, discrete-vs-smooth interpolation, `interpolate-size` + `@starting-style`, easing composition, and the WAAPI `linear()` twin.
**Scope:** keyframes.js engine `src/animation/` (the light interpolation primitives) + the Vue demo; value.js easing surface read-only for the hand-off.
**Method:** live code (file:line) grounded against W3C drafts, the modern-web-guidance baseline corpus (dated, cited by id), and each SOTA library's published surface (Motion / GSAP / anime.js v4). Research-only; FOLD-E / FOLD-VALUEJS-HANDOFF / BOOK / GAP-NAMED / ALREADY-SOTA dispositions.
**Relation to sibling lanes:** `r-anim-libs.md` mapped the *orchestration* gaps (stagger / sequence / FLIP / drag / native-scroll). This lane is the dedicated **interpolation-math** forward-research it deferred — it does NOT re-litigate stagger/sequence/FLIP. Where it touches the spring `linear()` twin or MotionPath, it **refines** `r-anim-libs` A-2 / F-6 with the spec frontier and a direct Motion source comparison (which moves one claim from LEAD to MATCH).

---

## TL;DR — interpolation-math headline

keyframes.js's interpolation **core math** is genuinely at or near the frontier:

- The **spring solver is closed-form analytic** (`spring.ts:258` — underdamped / critical / overdamped cases of the damped-harmonic-oscillator ODE, per-frame error O(machine-ε)), with **live mid-flight target re-seat from `(x, v)`** (`spring.ts:167`) keeping the trajectory continuous. The mid-flight re-seat with velocity continuity is the part the big libraries under-ship.
- The **spring → CSS `linear()` round-trip** (`springLinearStops.ts`, `springTimingFunction.ts`, `waapi.ts:80`) is exactly the path the CSSWG *standardized on* — the `spring()` timing-function proposal (csswg-drafts #280) was **declined** in favor of `linear()` stops (csswg-drafts #229; spec `drafts.csswg.org/css-easing`). keyframes.js ships the modern path, not the dead WebKit `spring()`.
- `NumericAnimation` (`numeric.ts`) is **zero-alloc, SoA-segmented, O(log N) binary-search** keyframe interp — the correct shape for a hot interpolation primitive.

The **gaps** are all *spatial / structural*, not numeric:

- **MotionPath / `offset-path` following — GAP** (no path-distance interpolation anywhere; `r-anim-libs` F-6 BOOK stands, refined below with the CSS-native + numeric split).
- The **demo does not showcase `@starting-style` / discrete (`allow-discrete`) entry/exit** nor the spring→`linear()` round-trip as a *first-class designer artifact* — a missed teaching opportunity for the engine's strongest asset.
- `interpolate-size` / `calc-size()` is **correctly NOT adopted** (Chromium-only, the demo's `0fr→1fr` grid trick is preferable on today's Baseline) — ALREADY-correct, recorded so nobody manufactures it.

One claim from the sibling lane is **corrected**: Motion *does* ship the spring→`linear()` WAAPI round-trip (`generateLinearEasing`, ~30 stops — motion.dev). So keyframes.js **MATCHES** Motion on the round-trip; its differentiators narrow to the **closed-form solver quality + live re-seat**, which remain a real LEAD.

---

## SOTA map (interpolation-math axes only — orchestration is `r-anim-libs`)

| Interpolation capability | Motion | GSAP | anime.js v4 | keyframes.js | Verdict |
|---|---|---|---|---|---|
| Closed-form analytic spring (vs numeric integrator) | analytic-sampled generator | numeric | numeric (duration/bounce) | ✓ closed-form `spring.ts:258` | **LEAD (quality)** |
| Live mid-flight target re-seat w/ velocity continuity | partial (re-targets, re-derives) | partial (overwrite) | ✗ | ✓ `spring.ts:167` | **LEAD** |
| Spring → CSS `linear()` twin for WAAPI | ✓ `generateLinearEasing` ~30pt | ✗ | ✗ | ✓ `springTimingFunction.ts`+`waapi.ts:80` | **MATCH** (was LEAD in `r-anim-libs` A-2 — corrected) |
| Spring param surface | duration/bounce/visualDuration **+** stiffness/damping/mass | stiffness/damping | duration/bounce | response/dampingFraction (SwiftUI) | **MATCH** (idiom diff — see F-1) |
| Zero-alloc numeric keyframe interp (SoA) | ✗ (object-per-frame) | ✗ | ✗ | ✓ `numeric.ts:65` | **LEAD** |
| CSS `linear()` consumed as easing input | ✓ | ✓ | ✓ | ✓ via value.js `cssLinear` / `getTimingFunction` | **MATCH** |
| CSS Easing L1 `steps()`/`step-*` | ✓ | ✓ | ✓ | ✓ `utils.ts:126` | **MATCH** |
| MotionPath / `offset-path` distance interp | ✓ | ✓ (MotionPathPlugin) | ✓ (`svg.createMotionPath`) | ✗ | **GAP** |
| Discrete / non-interpolable value handling (`allow-discrete`, visibility) | via WAAPI/CSS | ✓ | partial | engine relies on CSS/WAAPI discrete-step; no JS discrete model | **MATCH-ish** (F-5) |
| `interpolate-size` / `calc-size()` height-to-auto | manual | manual | manual | N/A (demo uses `0fr→1fr` — *preferable*) | **ALREADY-correct** |
| `@starting-style` entry/exit interop | `AnimatePresence` | manual | manual | ✗ in demo | **GAP (demo)** |
| decay / inertia easing (frictional glide) | ✓ (`inertia`) | ✓ (InertiaPlugin) | ✓ | ✗ (spring core present; no decay closed form) | **GAP** (math → VJ hand-off) |

---

## Findings

### F-1 — Spring solver is SOTA; add the modern time-based param surface (`duration`/`bounce`) as a thin adapter · ALREADY-SOTA (core) + FOLD-E (small ergonomic)

- **Where:** `SpringProgress` takes `(response, dampingFraction)` — the SwiftUI-canonical pair (`spring.ts:15`, `:54`). The closed-form solver (`spring.ts:258`) and live re-seat (`spring.ts:167`) are class-leading.
- **SOTA / spec:** Motion's spring now leads its docs with **time-based** params — `duration` + `bounce` (0–1) and `visualDuration` — and treats stiffness/damping/mass as the advanced fallback ("Time options will be overridden if any physics options are set", motion.dev/docs/spring). The time-based surface is the one designers reach for because it answers "how long does this take" directly. keyframes.js's `response` (oscillation period) is *physics-correct* but not the same mental model as "total duration."
- **Gap / opportunity:** the math is identical under the hood (`bounce` maps monotonically to `dampingFraction`; `visualDuration`/`duration` maps to `response` × a settle factor). A **construction-time adapter** — `SpringProgress.fromDuration({ duration, bounce })` or accepting `{ bounce, visualDuration }` in `SpringProgressOptions` — gives the modern idiom *without touching the hot path or the solver*. This is pure parameter translation: closed-form `response = visualDuration` and `dampingFraction = 1 − bounce` (clamped) is the documented Motion mapping; expose it as an alternate constructor.
- **Perf rationale:** zero hot-path cost — the mapping runs once at construction. The solver, the `linear()` sampler, and the re-seat are unchanged.
- **Disposition:** **ALREADY-SOTA** for the solver + re-seat (do not touch `spring.ts:258`/`:167`). **FOLD-E (small)** for a `fromDuration`/`{ bounce, visualDuration }` ergonomic adapter so the modern designer idiom is first-class. The `demo/spring/springPresets.ts` presets (`response`/`dampingFraction`) keep working unchanged.
- **Isomorphism:** additive constructor; existing `(response, dampingFraction)` callers and the four glass-ui `--spring-*` tokens move zero pixels.

### F-2 — Spring → `linear()` WAAPI twin: corrected to MATCH; keyframes.js's edge is solver-quality + the multi-segment guard · ALREADY-SOTA (with corrected framing)

- **Where:** `springTimingFunction.ts` returns a typed `Easing { fn, css }` from ONE solver pass (`springTimingFunction.ts:65`); `springLinearStops.ts` emits the `linear()` string (`springLinearStops.ts:46`); `waapi.ts:80` delegates the `.css` twin to the compositor and — critically — **refuses to delegate a `.css` twin across 2+ segments** because WAAPI restarts the curve at every keyframe stop (`waapi.ts:75-85`). The bare-linear refusal for twin-less callables (`waapi.ts:97`) keeps delegation faithful.
- **SOTA / spec:** the CSSWG **declined** the `spring()` timing function (csswg-drafts #280, WebKit-only in Safari Technology Preview, never standardized) in favor of `linear()` stops (csswg-drafts #229; `drafts.csswg.org/css-easing`). modern-web-guidance **`physics-based-easing`** (Baseline 2023-12-11; Chrome/Edge 113, Firefox 112, Safari 17.2) prescribes exactly this: "Use a timing function from an external library, or a tool to convert a JS easing function … into the `linear()` syntax," apply to `transform`/`opacity` for compositor-thread execution. keyframes.js *is* that tool, in-house.
- **Correction to `r-anim-libs` A-2:** that lane called the WAAPI round-trip a unique LEAD. **Motion ships it too** — `generateLinearEasing` precompiles springs to `linear()` (~30 points, computed duration) for GPU/off-main-thread playback (motion.dev/docs/css, motion.dev/magazine WAAPI articles). So the *round-trip* is a **MATCH**, not a LEAD.
- **What still LEADS:** (a) the solver underneath is **closed-form analytic** vs Motion's sampled generator — same fidelity at the stops, but the keyframes.js curve has no integrator drift; (b) the **single-source pairing** (`{ fn, css }` from one solver, `springTimingFunction.ts:106`) guarantees the JS curve and the CSS curve are the *same* curve — Motion generates the JS spring and the `linear()` separately; (c) the **multi-segment guard** (`waapi.ts:80`) — refusing to delegate a spring `linear()` across multiple keyframe stops because the compositor restarts it per segment — is a subtlety most libraries get wrong (Motion's spring-to-CSS is single-segment by construction, so it never had to confront the multi-stop `@keyframes` case keyframes.js parses).
- **Perf rationale:** compositor-thread spring is the single biggest spring-perf win; the guard prevents a *silent* wrong-curve regression that would otherwise look fine in a smoke test.
- **Disposition:** **ALREADY-SOTA.** Leave the solver, the twin, and the guard. The one doc action: amend the synthesis so A-2 reads **MATCH (round-trip) + LEAD (solver quality / single-source pairing / multi-segment guard)**, not a blanket LEAD.
- **Isomorphism:** N/A (no change proposed).

### F-3 — MotionPath / `offset-path` following is absent · GAP-NAMED → BOOK (engine, two-track) + FOLD-VALUEJS-HANDOFF (geometry sampler)

- **Where:** no path-distance interpolation in `src/` (grep for `offset-path`/`offsetDistance`/`getPointAtLength` in source: zero — only the parsed-not-applied `@property` registry and false positives). `ElementMorph` (`morph.ts:66`) interpolates rect→rect on a **straight line** only (`dx`/`dy`/`sx`/`sy`).
- **SOTA:** every competitor ships it. GSAP `MotionPathPlugin` (any SVG path → motion path). anime.js **v4** replaced `anime.path()` with **`svg.createMotionPath(path)`** returning `{ translateX, translateY, rotate }` (animejs.com/documentation/svg/createmotionpath). Motion supports path following. The **CSS-native** path is `offset-path` + animatable `offset-distance` (+ `offset-rotate`) — compositor-friendly and WAAPI-eligible.
- **No baseline guide exists** for motion-path in modern-web-guidance (search "motion path / animate along path" returns only scroll-driven guides) — confirming it is genuinely outside the curated-baseline set and a real frontier gap, not a solved one.
- **Opportunity / elegance — two tracks that reuse existing primitives:**
  1. **DOM / CSS-native track:** a `MotionPath` that animates `offset-distance: 0%→100%` along a CSS `offset-path` string. This is WAAPI-eligible under the *existing* `waapi.ts` gate (it's a normal animatable length percentage with a uniform easing) — so it can ride the compositor for free, including a spring `linear()` twin for springy path-following.
  2. **Numeric / canvas track:** sample an SVG `<path>` by arc-length (`getPointAtLength`-style) into `{ x, y, angle }` keyframes and feed them to **`NumericAnimation`** (`numeric.ts`) — which already does zero-alloc SoA interp. The path-distance→point sampling is the only new math, and it is **value-domain geometry**, not animation-loop logic.
- **Perf rationale:** the CSS track is off-main-thread; the numeric track reuses the zero-alloc stepper. Arc-length resampling is O(N) once at construction.
- **Disposition:** **BOOK** the engine `MotionPath` (refines `r-anim-libs` F-6 with the explicit CSS-native vs numeric split + the WAAPI-eligibility observation). **FOLD-VALUEJS-HANDOFF** for the arc-length path sampler — see VJ-2. Ship-trigger: a concrete demo/consumer story (the playground or a new `demo/path/` scene). The CSS-native half is small enough to ship DOM-only first.
- **Isomorphism:** additive; `ElementMorph` (straight-line) unchanged — `MotionPath` is its curved sibling.

### F-4 — Demo opportunity: `@starting-style` + discrete (`allow-discrete`) entry/exit, and the spring→`linear()` round-trip as a first-class artifact · FOLD-E (demo)

- **Where:** zero `@starting-style` / `allow-discrete` / `transition-behavior` usage in `demo/` source (grep clean outside `dist/`). The engine's strongest asset — the spring→`linear()` round-trip — is exercised by `demo/spring/` interactively but is **not surfaced as a copy-pasteable CSS artifact** (the emitted `linear(...)` string a designer would paste into a stylesheet).
- **SOTA / spec:** modern-web-guidance **`animate-element-entry-exit`** — `@starting-style` + `transition-behavior: allow-discrete` (Baseline 2024-08-06; Chrome/Edge 117, Firefox 129, Safari 17.5) — is the standard way to animate elements in/out of the DOM and to/from `display:none` *without JS measurement*. **`animate-to-from-top-layer`** extends it to dialogs/popovers (with `overlay` in the transition list). These pair naturally with a spring `linear()` for a springy entrance.
- **Opportunity / elegance:** a small demo scene (or an addition to `demo/spring/` or `demo/easing/`) that (a) shows an element entering/exiting via `@starting-style` + `allow-discrete` *eased by a keyframes.js-generated spring `linear()`*, and (b) renders the emitted `springLinearStops(...)` string as a **copy button** so a designer can lift the exact `linear(...)` into their own CSS. This is the engine dogfooding the standardized physics-easing path AND teaching the modern entry/exit primitive in one scene. The `physics-based-easing` guide's reduced-motion `@media (prefers-reduced-motion: reduce) { transition: none }` block is mandatory copy-paste safety — the engine already has the `withReducedMotion` discipline to mirror it.
- **Perf rationale:** `@starting-style`/`allow-discrete` is the JS-measurement-free path; the spring `linear()` runs on the compositor (transform/opacity). Pure platform leverage.
- **Disposition:** **FOLD-E (demo).** Highest-ROI demo addition in this lane — it showcases the engine's class-leading spring as the *source of a standardized CSS artifact*, which is the most compelling possible demo of the spring round-trip. Pairs with `r-anim-libs` F-8 (spring-eased presets).
- **Isomorphism:** additive demo scene; no library or existing-demo pixels move.

### F-5 — Discrete / non-interpolable value handling is implicit (delegated to CSS/WAAPI), not a first-class JS model · GAP-NAMED → BOOK (low)

- **Where:** the JS interpolation path (`utils.ts` `prepareInterpVars` → `lerpValue`) assumes **interpolable `ValueUnit` leaves** (`utils.ts:250-281` throws a `TypeError` on non-`ValueUnit`). There is no JS notion of a *discretely-stepped* property (e.g. `visibility`, `display`, an enum/keyword that should flip at the midpoint per the Web Animations "discrete" interpolation rule) — on the rAF/JS path such a property has no defined behavior; on the WAAPI/CSS path the browser applies its native discrete step.
- **SOTA / spec:** the Web Animations interpolation model defines **discrete** interpolation (flip at 50%) for non-interpolable types; CSS `transition-behavior: allow-discrete` opts `display`/`content-visibility` into discrete transition. GSAP handles non-tweenable props by snapping; Motion routes them through CSS/WAAPI.
- **Gap:** for a JS-driven (`useWAAPI:false`) animation over a keyword/enum property, keyframes.js has no discrete-step rule — it relies on the value being numeric/`ValueUnit`. This is a correctness *completeness* gap, not a hot bug (the parser-driven CSS surface rarely feeds bare keywords to the JS lerp), and the WAAPI path is already correct via the browser.
- **Opportunity:** a thin "discrete leaf" in the interp dispatch — when a `ValueUnit` pair is flagged non-interpolable (or a keyword token), emit `start` for `t<0.5` else `stop`, matching the WAAPI spec. Small, but needs a design decision on how the parser tags non-interpolable leaves (value.js territory).
- **Disposition:** **BOOK (low).** Lower value than F-3/F-4 and entangled with how value.js tags interpolability. Park until a concrete keyword-property animation surfaces on the JS path.
- **Isomorphism:** additive dispatch branch; numeric/color leaves unchanged.

### F-6 — `NumericAnimation` segment interp is SOTA-shaped; one micro-opportunity in `at()` · ALREADY-SOTA

- **Where:** `numeric.ts:65` — zero-alloc (single pre-allocated `result` reused, `numeric.ts:117`/`:183`), **structure-of-arrays segments** (`startVals`/`stopVals` as parallel arrays, `numeric.ts:130-143`), **O(log N) binary-search** segment lookup (`numeric.ts:156`), incremental segment rebuild on `updateKeyframe` (`numeric.ts:196-202`). This is precisely the shape a hot interpolation primitive should take — no competitor's numeric tween is this disciplined (Motion/GSAP allocate per-frame objects).
- **Micro-opportunity (measure-first):** `at()` recomputes `clamp` + `scale` + `eased` + a per-key `lerp` loop every call (`numeric.ts:166-181`). For a *single uniform easing* (the common case) this is already tight; the only lever is hoisting `seg.keys.length` and the `result as Record` cast out of the loop, which a JIT likely already does. Not worth touching without a bench showing it in a hot trace.
- **Disposition:** **ALREADY-SOTA.** The `r-anim-libs`-adjacent / `d-framecompiler` lanes already named "port `NumericAnimation`'s SoA discipline UP to the FrameCompiler" — that is the real transposition; `NumericAnimation` itself is the reference, leave it.
- **Isomorphism:** N/A.

### F-7 — `interpolate-size` / `calc-size()` height-to-auto: correctly NOT adopted · ALREADY-SOTA (recorded so it is not manufactured)

- **Where:** the demo animates open/close height via the `0fr→1fr` grid-row trick (recorded in `d-demo-elevate.md` §6 / `_SYNTHESIS-E-augmentation.md`), not `interpolate-size`.
- **SOTA / spec:** modern-web-guidance **`animate-to-intrinsic-sizes`** — `interpolate-size: allow-keywords` + `calc-size()` — has **limited availability**: Chrome/Edge 129 (Sep 2024), **unsupported in Firefox and Safari**. The `0fr→1fr` grid technique is cross-browser today and JS-measurement-free.
- **Disposition:** **ALREADY-SOTA / correct.** Do **not** adopt `interpolate-size` on the current Baseline — the existing grid trick is preferable. Recorded here explicitly so a future pass does not "modernize" a working cross-browser solution into a Chromium-only one. Revisit only when `interpolate-size` reaches Baseline.
- **Isomorphism:** N/A (no change).

### F-8 — `Timeline` easing pipeline composes `SmoothProgress`; easing *composition* (chaining curves) is single-stage · ALREADY-SOTA (with a named frontier)

- **Where:** `Timeline.applyPipeline` (`timeline.ts:80`) applies ONE easing fn (`_easingFn`) then boundary-snap then `SmoothProgress` damping (`timeline.ts:100-110`). Easing is a single `TimingFunction` per timeline; there is no spec-style *easing composition* (compose two curves, or an easing-of-an-easing) beyond the implicit smooth-after-ease.
- **SOTA / spec:** CSS Easing L2 (`drafts.csswg.org/css-easing`) keeps timing functions atomic (no `compose()`), but the *pattern* of layering ease→smoothing→snap is exactly what keyframes.js does — and the boundary-snap-vs-jitter handling (`timeline.ts:86`) is a real-world nicety competitors omit.
- **Disposition:** **ALREADY-SOTA.** Function composition of easings is trivial in JS (`t => g(f(t))`) and the typed-`Easing` contract already accepts any callable, so a consumer composes curves freely — no engine primitive needed. The pipeline's ordered stages are the right design. No action.
- **Isomorphism:** N/A.

---

## ALREADY-SOTA — do not manufacture work here

- **A-1 — Closed-form analytic spring (`spring.ts:258`).** Three ODE cases solved analytically; per-frame error O(machine-ε) vs every competitor's numeric integrator; live `(x,v)` re-seat (`spring.ts:167`) for mid-flight target changes with velocity continuity. **LEADS** on solver quality + re-seat. LEAVE.
- **A-2 — Spring `linear()` twin + single-source pairing + multi-segment guard (`springTimingFunction.ts:106`, `waapi.ts:80`).** The round-trip itself is a **MATCH** (Motion ships `generateLinearEasing`); the single-solver pairing and the per-segment-restart guard are the LEAD. This is the CSSWG-standardized path (`linear()` won over `spring()`). LEAVE.
- **A-3 — Zero-alloc SoA `NumericAnimation` (`numeric.ts:65`).** Reference-quality numeric interp; no competitor matches the allocation discipline. LEAVE (and it is the *source* of the FrameCompiler transposition the other lanes named).
- **A-4 — `interpolate-size` correctly NOT adopted (F-7).** The `0fr→1fr` grid trick beats the Chromium-only feature on today's Baseline. LEAVE.
- **A-5 — `Timeline` ordered ease→snap→smooth pipeline (`timeline.ts:80`).** The boundary-snap-vs-jitter handling is a real nicety; easing composition is trivially available via callable composition. LEAVE.
- **A-6 — CSS Easing L1 completeness on the JS path (`utils.ts:126`).** `steps(n[, position])` + `step-start`/`step-end` parsed and resolved through `steppedEase`. MATCH. LEAVE.

---

## value.js hand-offs (FOLD-VALUEJS-HANDOFF — never written directly)

value.js already ships `cssLinear` (consume a `linear()` stops list → callable, `value.js/src/easing.ts:33`), `solveCubicBezierX`, and the full easing registry. Two **interpolation-math** primitives are value-domain and would let keyframes.js stay a thin caller:

- **VJ-1 — decay / inertia closed form + the inverse "JS-easing → `linear()` stops" sampler.** value.js has `cssLinear` (string→fn) but **not the inverse** (sample an arbitrary `TimingFunction` at N points → a `linear()` *string*) — which is the generic core that `springLinearStops`/`springTimingFunction` currently hand-roll, and the exact utility Motion centralizes as `generateLinearEasing`. It also has **no `decay(v0, k)` closed form** (frictional glide `x(t)=x0+v0/k·(1−e^{−kt})`) — needed for the F-4-adjacent flick/inertia story (and `r-anim-libs` F-4 drag). Both belong beside value.js's `timingFunctions`/`cssLinear` as value-domain math, so the engine doesn't grow a second math home. **HAND-OFF:** propose a value.js easing-tranche item — "decay/inertia closed form + a `TimingFunction → linear() string` sampler (inverse of `cssLinear`)." This consolidates `_SYNTHESIS-valuejs-handoff` VJ-1.
- **VJ-2 — SVG/`offset-path` arc-length geometry sampler for F-3 MotionPath.** Path-distance → `{ x, y, angle }` sampling (a `getPointAtLength`-equivalent + uniform arc-length resampling) is CSS/SVG **value geometry**, not animation-loop logic. If F-3 MotionPath graduates from BOOK, the sampler is a value.js candidate (it lives next to value.js's parsing/units), feeding `NumericAnimation` keyframes on the JS side. **HAND-OFF:** propose a value.js path-geometry item.

Both are **optional enablers**, not blockers — F-1 ships engine-side today; F-3/F-4 can hand-roll the math locally if value.js declines.

---

## Priority recommendation for this lane

1. **F-4 demo `@starting-style` + spring→`linear()` artifact** — highest ROI; showcases the engine's strongest, standardized asset as a copy-pasteable CSS deliverable. FOLD-E (demo).
2. **F-1 spring `fromDuration`/`{bounce, visualDuration}` adapter** — small, zero-hot-path, brings the modern Motion idiom to the SOTA solver. FOLD-E (small).
3. **F-3 MotionPath** — real gap vs all competitors; BOOK with the CSS-native (WAAPI-eligible) + numeric (`NumericAnimation`) two-track split; VJ-2 geometry hand-off.
4. **F-5 discrete-value JS model** — BOOK (low); entangled with value.js interpolability tagging.
5. **VJ-1 decay + inverse `linear()` sampler** — value.js hand-off; unblocks inertia and lets `springLinearStops` collapse to a thin caller.

**Corrections to record in synthesis:** `r-anim-libs` A-2 → **MATCH (round-trip) + LEAD (closed-form solver / single-source pairing / multi-segment guard)**, not blanket LEAD. The CSSWG `spring()`-declined-for-`linear()` history (csswg-drafts #280/#229) is the citation that makes the spring round-trip the *standardized* path, not a bespoke one.

Every finding is **additive and isomorphism-safe** — the spring solver, the `linear()` twin, the WAAPI guard, and the `NumericAnimation` SoA core are genuinely SOTA and must be left alone.
