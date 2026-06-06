# Tranche F deep-SOTA audit — animation-library frontier vs the POST-E engine

**Lane:** `r-anim-libs-2026` (FOCUS: the 2026 animation-library SOTA frontier vs the
engine *after* E shipped the orchestration tier).
**Branch:** `tranche-e-impl` (D + E IMPLEMENTED + CLOSED).
**Method:** live code (`file:line`) grounded against the current published surface of
Motion (`motion.dev`, v12.35, Mar 2026), GSAP 3.13 (now 100% free incl. all bonus
plugins — Webflow), anime.js v4, Theatre.js, Rive, WAAPI; modern-web-guidance baseline
corpus. RESEARCH/AUDIT ONLY — zero source edits.
**Diff base:** `docs/tranches/E/audit/sota/r-anim-libs.md` (the *pre-E* baseline,
F-1..F-8) + `_SYNTHESIS-scorecard.md` rows 5/9 + `valuejs-sota-handoff.md`.

---

## TL;DR — E closed the orchestration tier; what remains is narrow + honest

The pre-E lane named eight gaps (F-1 stagger, F-2 sequence, F-3 FLIP, F-4 drag/inertia,
F-5 native-scroll, F-6 MotionPath, F-7 view-transitions, F-8 spring presets). **E shipped
F-1..F-5 and F-8 with rigor, plus the scorecard's `fromDuration` adapter.** I verified each
in the live tree (`stagger.ts`, `sequence.ts`, `flip.ts`, `drag.ts`, `decay.ts`,
`waapi.ts:396 attachNativeScrollTimeline`, `animations.ts:717 spring presets`,
`spring.ts:93 fromDuration`). The competitive map the baseline drew is now MOSTLY closed.

After re-walking the 2026 frontier, what is STILL not-SOTA is **narrow and concentrated**,
not a broad list:

1. **The SVG suite is now table-stakes AND free, and keyframes ships none of it.** GSAP's
   MorphSVG / DrawSVG / MotionPathPlugin went 100% free in 2026 (Webflow); anime.js v4
   ships `morphTo` / `createMotionPath` / `createDrawable` as first-class SVG utilities.
   keyframes has **zero** path/SVG primitives (grep: no `offset-path`, no `getPointAtLength`,
   no `morphTo`, no DrawSVG). F-6 was BOOKED pre-E and did NOT land; the 2026 frontier has
   since *widened* it (line-drawing + shape-morph are now named, not just motion-path). **(F26-1)**
2. **The just-shipped `Sequence` is transport-incomplete vs the GSAP `Timeline` it names as
   its gold standard.** It has `play`/`stop`/`seek`/`add`/`label` but NO `pause`/`resume`/
   `reverse`/`timeScale`/`progress`/`repeat`/`yoyo` (`sequence.ts` — verified absent). The
   scrub substrate exists (`seek`); the transport surface does not. **(F26-2)**
3. **The orchestration tier shipped as API but is UNDOGFOODED — and the demo still
   hand-rolls the exact physics the engine now exports analytically.** `decay`/`Draggable`/
   `Sequence`/`stagger`/`flip` have ZERO demo callsites; `useOrbitalInertia.ts:62` hand-rolls
   `Math.pow(inertiaFactor, dt/TARGET_DT)` frictional decay — precisely the
   `decay()` closed form (`decay.ts:9`). inv ζ (rAF dogfood) is satisfied; the *orchestration*
   dogfood is not. **(F26-3)**
4. **No text-splitting primitive (SplitText analogue).** GSAP SplitText is now free; anime.js
   v4 ships text utilities. The demo `AnimatedText.vue:2` splits by raw `char` (no grapheme
   segmentation — breaks on emoji / combining marks); the engine offers no `splitText`. **(F26-4)**

And what is **ALREADY-SOTA and must not be re-touched** (the bulk): the spring core, the
orchestration tier E shipped, the WAAPI gate + native-scroll bridge, the value.js boundary.
The honest headline is *manufacture little here* — E did the heavy lifting.

---

## Competitive map — re-drawn for the POST-E state (2026 libraries)

| Capability | Motion 12.35 | GSAP 3.13 (free) | anime.js v4 | keyframes (post-E) | Verdict |
|---|---|---|---|---|---|
| CSS `@keyframes` text → runtime | ✗ | ✗ | ✗ | ✓ `engine.ts` `fromString` | **LEAD** (unchanged) |
| Perceptual color interp (oklab/oklch) | partial | sRGB | sRGB | ✓ value.js | **LEAD** (unchanged) |
| Analytic spring + live re-seat | numeric | numeric | numeric | ✓ closed-form `spring.ts` | **LEAD** (unchanged) |
| Spring → CSS `linear()` (WAAPI) | ✓ `generateLinearEasing` | ✗ | ✗ | ✓ `springTimingFunction.ts` | **MATCH** (scorecard-corrected) |
| `{visualDuration, bounce}` spring surface | ✓ | partial | ✓ (bounce/duration) | ✓ `spring.ts:93 fromDuration` | **MATCH** (E landed) |
| Stagger | ✓ | ✓ | ✓ | ✓ `stagger.ts` | **MATCH** (E landed) |
| Sequence/labels/position | ✓ | ✓ (gold std) | ✓ | partial — `sequence.ts` (no transport) | **GAP-NARROW (F26-2)** |
| FLIP / layout | ✓ | ✓ Flip | ✗ | ✓ `flip.ts` / `flipShared` | **MATCH** (E landed) |
| Drag + inertia/fling | ✓ | ✓ Draggable+Inertia | ✓ Draggable | ✓ `drag.ts` + `decay.ts` | **MATCH** (E landed) |
| Native scroll-driven delegation | ✓ ViewTimeline | ✓ ScrollTrigger | partial | ✓ `waapi.ts:396` bridge | **MATCH** (E landed) |
| **MotionPath / offset-path** | ✓ | ✓ MotionPathPlugin | ✓ `createMotionPath` | ✗ | **GAP (F26-1a)** |
| **SVG shape morph (MorphSVG)** | partial | ✓ MorphSVG (free) | ✓ `morphTo` | ✗ | **GAP (F26-1b)** |
| **SVG line-drawing (DrawSVG)** | ✗ | ✓ DrawSVG (free) | ✓ `createDrawable` | ✗ | **GAP (F26-1c)** |
| **Text-splitting (SplitText)** | partial | ✓ SplitText (free) | ✓ text utils | ✗ | **GAP (F26-4)** |
| Timeline scrubbing / devtools UI | dev tools | ✓ GSDevTools | editor | partial (demo scrubbers, no Sequence) | **GAP-SMALL (F26-3 corollary)** |
| Per-property keyframe easing | ✓ | ✓ | ✓ | per-FRAME only | **GAP-ASSESSED (F26-5, KILL)** |
| Reactive motion-value graph | ✓ `useFollowValue` | ✗ | ✗ | partial (`SpringProgress.subscribe`) | **RECORD (F26-6)** |
| Layer blending (weighted) | ✗ | ✗ | ✗ | ✓ `group.ts` | **LEAD** (unchanged) |
| Reduced-motion first-class gate | manual | manual | manual | ✓ `internal/reduced-motion.ts` | **LEAD** (unchanged) |
| value.js static/dynamic boundary | ✗ | ✗ | partial (modular) | ✓ `index.ts` boundary | **LEAD** (unchanged) |

---

## Findings

### F26-1 — The SVG suite (MotionPath · MorphSVG · DrawSVG) is the one real persisting gap — now table-stakes AND free · **BOOK → SHIP-in-F the CSS-native sliver**

- **Where (verified absent):** `grep -rniE "offset-path|offsetDistance|getPointAtLength|getTotalLength|motionPath|morphTo|drawable" src/` → **zero hits**. `morph.ts:1` imports only `NumericAnimation` and computes a straight-line rect→rect `translate()/scale()` (no curve, no path). The baseline F-6 was dispositioned **BOOK** and did NOT land in E (confirmed against `FINAL.md` W10 — the orchestration tier shipped stagger/flip/drag/decay/Sequence/animate, NOT path/SVG).
- **2026 SOTA (grounded):**
  - **GSAP went 100% free in 2026** (Webflow sponsorship) — MorphSVG, DrawSVG, MotionPathPlugin, SplitText, all formerly Club-only plugins are now free for commercial use. This is a *structural* shift in the competitive bar: SVG morphing + line-drawing are no longer a paywalled differentiator, they are baseline expectations. [gsap.com/svg, Codrops 2025]
  - **anime.js v4 ships the SVG triad as core modules:** `morphTo(path, precision)` (shape morph; start/end need NOT share point counts — converts to cubic béziers and adds points), `createMotionPath(path)` (move elements along an SVG path), `createDrawable(selector, start, end)` (stroke line-drawing). [animejs.com, v4 wiki]
  - Plus the **CSS-native lane**: `offset-path` / `offset-distance` are animatable and compositor-friendly (modern-web-guidance corpus; `offset-distance` is WAAPI-eligible — interpolates as a `<length-percentage>`).
- **The transposition (idiomatic, two-track):** this is THREE distinct capabilities, not one, and they split cleanly across the engine's existing boundary:
  - **(1a) MotionPath — SHIP-in-F the CSS-native half.** A `MotionPath` that animates
    `offset-distance: 0%→100%` over an author-supplied `offset-path` is *pure WAAPI-eligible
    CSS* — it needs NO new geometry math, reuses the existing `waapi.ts` eligibility gate and
    `toWAAPIOptions`, and runs compositor-thread. This is the F-1-class "cheap win that
    composes with what's there" and is shippable engine-side TODAY with zero value.js change.
    The numeric/canvas variant (sample an SVG `<path>` via `getPointAtLength`, feed
    `NumericAnimation`) is the heavier half → keep BOOKED behind the geometry hand-off.
  - **(1b) MorphSVG — BOOK + value.js-HANDOFF.** Path-`d` interpolation with point-count
    reconciliation (the anime.js `morphTo` precision model) is *value-domain geometry math*
    (parse `d`, normalize to cubic béziers, pad point counts, lerp control points). It belongs
    beside value.js's CSS/SVG value engine, NOT as a keyframes-local geometry home — exactly the
    VJ-2 "path geometry" hand-off the baseline flagged but **which the E `valuejs-sota-handoff.md`
    did NOT carry** (its Waves A–F are parse/color/computed-unit/interpolation; no path geometry).
    F re-surfaces it.
  - **(1c) DrawSVG — BOOK.** Stroke line-drawing is `stroke-dasharray`/`stroke-dashoffset`
    animation keyed off `getTotalLength()` — small, DOM-only, WAAPI-eligible, but depends on the
    same SVG-geometry read. Park beside 1b.
- **Perf rationale:** the CSS-native MotionPath (1a) is compositor-thread (zero main-thread
  sample); 1b/1c force one `getTotalLength`/`getPointAtLength` layout read at construction, then
  interpolate a single CSS string — no per-frame geometry.
- **Disposition:** **(1a) MotionPath CSS-native → SHIP-in-F** (engine-side, no value.js dep,
  reuses the WAAPI gate — this is the highest-ROI F item). **(1b) MorphSVG + (1c) DrawSVG →
  BOOK + value.js-HANDOFF** (the path-geometry sampler is value-domain; re-propose it into the
  F augmentation of `valuejs-sota-handoff.md` — it is currently MISSING there).
- **Isomorphism:** fully additive; no existing pixel moves.

### F26-2 — `Sequence` is transport-incomplete vs the GSAP `Timeline` it names as gold-standard · **SHIP-in-F**

- **Where:** `sequence.ts` is the E.W10 orchestrator and explicitly docstrings itself as
  "GSAP-`Timeline`-class position sequencing" (`sequence.ts:2`). Its surface (verified by
  grep over the file): `add()` (`:156`), `label()` (`:145`), `seek()` (`:202`), `play()`
  (`:238`), `stop()` (`:325`), `setTargets()` (`:220`), getters `duration` (`:130`) + `time`
  (`:140`). **Absent:** `pause()`, `resume()`, `reverse()`, `timeScale()`/`playbackRate`,
  a `progress` getter/setter, `repeat`/`yoyo`. (grep `pause|resume|reverse|timeScale|playbackRate|progress\(|repeat|yoyo` over `sequence.ts` → zero matches.)
- **SOTA gap (grounded):** GSAP's `Timeline` — the gold standard the docstring names — ships
  `pause()`, `resume()`, `reverse()`, `timeScale(n)` (slow-mo/fast-forward), `progress(0..1)`
  (normalized scrub), `repeat`/`yoyo`. These are not bolt-ons; they are *the* timeline transport.
  Motion's `animateSequence`/timeline and anime.js v4's Timeline both carry pause/reverse/scrub.
  A `Sequence` that can only `play`/`stop`/`seek` is a *one-shot scrubber*, not a transport — the
  one thing a sequencing primitive exists to provide.
- **The elegance (the substrate is ALREADY there):** the gaps are arithmetic over the existing
  `seek(masterClock)` + the `RAFPlayback` loop, not new machinery:
  - `pause()`/`resume()` — the loop already holds `_playOrigin`/`_time`; `RAFPlayback` already
    owns the analogous pause contract for `Animation`/`AnimationGroup` (the D.W4 managed-pause
    note). Reuse it: stop the loop, retain `_time`, re-anchor `_playOrigin` on resume (the exact
    `pausedTime`-style re-anchor `AnimationGroup` already does, group.ts).
  - `progress` getter/setter — `progress = _time / duration`; the setter is `seek(p * duration)`.
    Pure division; the scrub already exists.
  - `reverse()` / `timeScale(n)` — a single `rate` field scaling `masterClock` in `_frame`
    (`masterClock = (clock - _playOrigin) * rate`); `reverse()` is `rate = -|rate|` + a reflected
    origin. No per-child change — the `advanceTo` map already takes any masterClock.
  - `repeat`/`yoyo` — modulo the master clock by `duration` in `_frame`; `yoyo` reflects the phase.
- **Perf rationale:** every addition is a scalar field read/multiply in the existing `_frame`
  arithmetic. Zero new allocation; the zero-alloc `interpFrames` buffers carry over unchanged.
- **Disposition:** **SHIP-in-F** — complete the `Sequence` transport (`pause`/`resume`/`reverse`/
  `timeScale`/`progress`/`repeat`/`yoyo`) by reusing `RAFPlayback`'s managed-pause re-anchor and
  the existing `seek`. This finishes a primitive E *just* shipped — it is completion, not new scope,
  and it is the single largest ergonomic gap in the new public API.
- **Isomorphism:** additive methods + one scalar field; `play`/`stop`/`seek` semantics unchanged.
- **inv-ε caveat (MEASURE-FIRST sub-clause):** verify the `advanceTo`-based `_frame` map stays
  C⁰-continuous under a negative/scaled `rate` BEFORE shipping `reverse`/`timeScale` — the
  segment `onEnd`-clears-`startTime` window (`sequence.ts:296` comment) was reasoned for the
  forward monotone case; reverse re-enters finished segments. Lock it with a seek↔play parity
  test (the existing gate idiom) so reverse is pixel-identical to a reversed `seek` sweep.

### F26-3 — The orchestration tier shipped as API but is UNDOGFOODED; the demo hand-rolls the physics the engine now exports · **SHIP-in-F (dogfood)**

- **Where:** the E.W10 tier (`stagger`/`flip`/`flipShared`/`drag`/`Draggable`/`decay`/`Sequence`)
  has **zero demo callsites** (grep `\bstagger\b|\bflip\b|flipShared|\bDraggable\b|\bdrag\(|\bdecay\b|new Sequence` over `demo/**` non-dist → the only hits are *unrelated local identifiers*:
  `useSpringDemo.ts:176` "Flip the target" (a comment), `EasingCurveCanvas.vue` "draggable handles"
  (SVG control points), and `useOrbitalInertia.ts`'s OWN local `const decay`).
- **The sharp edge — the demo hand-rolls the exact closed form the engine now ships:**
  `useOrbitalInertia.ts:62` computes frictional inertia as
  `const decay = Math.pow(inertiaFactor, dt / TARGET_DT)` and multiplies velocity by it each
  frame (`:67`, `:82`). That is a *discrete exponential decay* — the per-frame Euler form of
  exactly the `decay.ts:9` analytic closed form `x(t) = x0 + v0/k·(1−e^(−k·t))` /
  `v(t) = v0·e^(−k·t)`. The engine now owns the analytic version (no frame-rate drift, an exact
  `decayRest` projected endpoint); the flagship demo still uses the hand-rolled discrete one.
  The orbital drag *also* hand-rolls pointer-velocity sampling that `Draggable` (`drag.ts:297
  estimateVelocity`) now provides as a tested primitive.
- **SOTA framing:** this is not a competitor-feature gap — it is a *credibility/proof* gap. A
  library that ships `decay`/`Draggable` as public API while its own flagship demo hand-rolls
  worse versions of both has not *proven* the API. The §Mandate's inv ζ (rAF dogfood) is green;
  the *orchestration* dogfood is the missing analogue. Motion/GSAP/anime all dogfood their own
  draggable/inertia in their homepage demos — the proof IS the demo.
- **Disposition:** **SHIP-in-F (dogfood)** — replace `useOrbitalInertia.ts`'s `Math.pow` decay
  with the engine's `decay()`/`decayRest`, and (where the gesture is 1-D) route orbital
  release-velocity through `Draggable`'s sampler. This is isomorphism-*restoring* (the analytic
  form is the continuous limit of the discrete one — verify the felt-inertia is pixel-equivalent
  under a parity test, MEASURE-FIRST). A small `Sequence` + `stagger` demo scene proves the
  temporal orchestrator the way the cube demo proves `AnimationGroup`.
- **Isomorphism:** the inertia swap must be felt-identical (parity-gated); the new demo scene is
  purely additive.

### F26-4 — No text-splitting primitive (SplitText analogue); the demo splits by raw char (grapheme-unsafe) · **BOOK**

- **Where:** `grep -rniE "splitText|Intl.Segmenter|grapheme" src/` → zero. The engine's text
  story is the `typewriter` preset (`animations.ts:215`, a `steps()`/clip animation) and the
  demo's `AnimatedText.vue:2`, which does `v-for="(char, index) in currentText"` — i.e. it
  iterates the **raw string by UTF-16 code unit**, not by grapheme. That breaks on emoji,
  combining marks, and surrogate pairs (a 👍🏽 splits into 2–4 fragments).
- **2026 SOTA (grounded):** GSAP **SplitText is now free** (Webflow) and is the genre's reference
  for splitting text into chars/words/lines with stable wrapping + a11y-preserving aria, feeding
  stagger. anime.js v4 ships text utilities for the same. SplitText + stagger is the single most
  common "designer reaches for it" combination in 2026 — and keyframes now HAS the stagger half
  (`stagger.ts`) but not the split half to feed it.
- **The transposition:** a light, value.js-free `splitText(element, { by: "chars"|"words"|"lines" })`
  that uses **`Intl.Segmenter`** (Baseline 2024 — grapheme-correct, the platform-native splitter)
  to wrap each unit in a span and return the unit array, designed to hand directly to `stagger`.
  This is the natural *completion* of the stagger story E shipped: stagger distributes delays;
  splitText produces the indexed units stagger distributes over. It belongs on the LIGHT barrel
  (DOM-only, no value.js, no CSS parse).
- **Perf rationale:** construction-time only (one segment pass + DOM wrap); `Intl.Segmenter` is
  native and fast; line-splitting needs one layout read (range rects) — the documented cost.
- **Disposition:** **BOOK** — high designer-ROI and it completes the stagger story, but it is
  net-new DOM surface (wrapping/unwrapping, a11y aria reconstruction, line re-split on resize)
  that deserves a deliberate design pass rather than an F drive-by. Promote to SHIP only with a
  concrete demo scene driving it (pairs with the F26-3 stagger scene). Note the grapheme
  correctness (`Intl.Segmenter`) is the non-negotiable that the current demo `AnimatedText`
  violates — fixing *that* (demo-side) is a small honest correction independent of the engine
  primitive.
- **Isomorphism:** additive; the `AnimatedText` grapheme fix is a demo correctness fix (named delta).

### F26-5 — Per-property keyframe easing is a per-FRAME design choice, NOT a gap to close · **KILL (assessed, leave)**

- **Where:** `AnimationFrame.timingFunction: Easing` (`constants.ts:114`) is **per-frame** — one
  easing per keyframe segment, applied to ALL properties in that segment. The hot path reads
  `frame.timingFunction.fn` (per the engine CLAUDE.md). There is no per-property easing axis.
- **SOTA:** Motion/GSAP/anime allow per-property easing (e.g. `x` eases differently from
  `opacity` within one tween). It is a real expressivity axis they lead with.
- **Why this is KILL, not GAP:** keyframes' authoring surface is **CSS `@keyframes` text** — and
  CSS `@keyframes` itself is **per-frame** (`animation-timing-function` is a property *of a
  keyframe step*, applied to the whole step; CSS has no per-property-per-step easing). The
  per-frame model is not a limitation keyframes chose — it is *faithfulness to the authoring
  format that is the engine's entire LEAD* (the "CSS `@keyframes` text → runtime" row no other
  lib has). A per-property easing axis would either (a) diverge the runtime from the CSS source
  it parses (anti-isomorphic, breaks the round-trip `format.ts` guarantees), or (b) require a
  non-CSS authoring extension — abandoning the differentiator. The idiomatic answer already
  exists: a consumer who wants per-property easing composes **separate animations per property**
  (or an `AnimationGroup` with per-layer easing) — which the engine supports today.
- **Disposition:** **KILL** — assessed and rejected. This is an ALREADY-CORRECT design decision
  forced by the CSS-`@keyframes` fidelity that is the engine's core LEAD; "closing" it would
  cost the LEAD. Record it so a future lane does not re-raise it as an unexamined gap.

### F26-6 — Reactive motion-value graph (Motion `useFollowValue`/`followValue`) · **RECORD (out of scope; the demo owns it)**

- **Where:** `SpringProgress.subscribe(value, velocity)` (`spring.ts`) + `Draggable.subscribe`
  (`drag.ts:178`) already give the *push* half of a reactive value. There is no
  value-derives-from-value graph (a motion value that *follows* another through a transition).
- **SOTA:** Motion 12.35 added `useFollowValue`/`followValue` — `useSpring`-style motion values
  that follow any source through any transition (the React-reactive value graph). It is Motion's
  framework-binding ergonomic.
- **Why RECORD (not a gap):** keyframes is deliberately framework-AGNOSTIC; a reactive
  value-graph is a *binding-layer* concern (Vue `ref`/`computed`, React `useState`), and the
  demo already does this idiomatically (`useSpringDemo.ts`, `useOrbitalInertia.ts` bridge the
  engine's `subscribe`/reads into Vue reactivity — the documented `markRaw` + rAF-poll pattern).
  Shipping a `useFollowValue` analogue in the engine would either pick a framework (anti-gestalt)
  or duplicate what the subscribe surface + a 3-line composable already provides. The engine's
  job ends at `subscribe`; the graph is the consumer's.
- **Disposition:** **RECORD** — out of engine scope by design; the `subscribe`/reads surface is
  the right primitive and it is complete. Note for the demo lane: a tiny `useMotionValue` Vue
  composable over `SpringProgress.subscribe` would be the *demo's* idiomatic showcase of this
  (NOT an engine addition).

---

## ALREADY-SOTA after E — manufacture NO work here (the bulk)

- **A26-1 — The orchestration tier E shipped is genuinely SOTA.** `stagger.ts` (pure
  construction-time delay generator, `from: first/last/center/edges/index`, eased, zero hot-path
  cost), `flip.ts`/`flipShared` (FLIP over `ElementMorph` with batched read-mutate-read, springy
  via the `linear()` twin), `drag.ts` (`Draggable` — pointer-capture + windowed velocity sampling
  feeding the spring re-seat, the hard continuous-trajectory physics already solved in
  `spring.ts`), `decay.ts` (the analytic frictional closed form + `decayRest` projected endpoint),
  `sequence.ts` (the booked-name master-clock orchestrator over `advanceTo`). The value.js-free
  LIGHT boundary holds across all of them (`index.ts:55-75`). This MATCHES the genre's
  orchestration table-stakes — leave it (modulo the F26-2 transport completion + F26-3 dogfood).
- **A26-2 — `SpringProgress.fromDuration({visualDuration, bounce})`** (`spring.ts:93`) — the
  scorecard's named FOLD-E landed: the Motion `{duration, bounce}` idiom translated to
  `(response, dampingFraction)` with zero hot-path cost. MATCH. LEAVE.
- **A26-3 — The native scroll-driven bridge** (`waapi.ts:396 attachNativeScrollTimeline` +
  `timeline.ts:228 createNativeTimeline`) — F-5 landed: feature-detected `ScrollTimeline`/
  `ViewTimeline` attachment behind the ONE WAAPI eligibility gate, the JS sampler retained as the
  general fallback, the ARCH-kill explicitly held, the smoothing-reconciliation caveat documented
  (`waapi.ts:386`). MATCH (the platform-correct posture). LEAVE.
- **A26-4 — `animate()` single-call front door** (`animate.ts`) — the genre's `motion.animate` /
  `gsap.to` / anime `animate` DX baseline, shape-dispatched (string/map/array) onto the existing
  `from*` factories, heavy-boundary-correct (rides `loadAnimationEngine`). MATCH. LEAVE.
- **A26-5 — Spring presets + the `--spring-*` token vocabulary** (`animations.ts:717` —
  `springScaleIn`/`springSlideIn`/`springPop`/`springWobble`, the four iOS spring constants
  matched to glass-ui's `--spring-*` tokens) — F-8 landed, demo+engine speak one spring
  vocabulary. MATCH. LEAVE.
- **A26-6 — The spring core, WAAPI gate, layer blending, reduced-motion gate, value.js boundary**
  — every pre-E ALREADY-SOTA item (baseline A-1..A-7) holds unchanged. The one scorecard
  correction stands: spring→`linear()` is a MATCH not a LEAD (Motion ships `generateLinearEasing`);
  the narrowed LEAD (solver quality + single-source `{fn,css}` + the multi-segment guard
  `waapi.ts`) is intact. LEAVE.

---

## value.js hand-off (inv-16 — propose, never write)

The E `valuejs-sota-handoff.md` (Waves A–F: parse / color / computed-unit / interpolation /
easing / surface) does **NOT** carry a path-geometry item — the baseline's VJ-2 candidate was
dropped from the E handoff. F **re-surfaces it**, sharpened by the 2026 SVG-suite frontier:

- **VJ-F1 — SVG/path geometry sampler (the MorphSVG + DrawSVG + numeric-MotionPath enabler).**
  Path-`d` parsing + normalization to cubic béziers, point-count reconciliation (the anime.js
  `morphTo(path, precision)` model), and `getPointAtLength`/`getTotalLength`-equivalent sampling
  are **value-domain geometry math** (CSS/SVG value parsing + interpolation), NOT animation-loop
  logic. They belong beside value.js's value engine so keyframes does not grow a second geometry
  home. This unblocks F26-1b (MorphSVG), F26-1c (DrawSVG), and the *numeric* half of F26-1a
  (canvas MotionPath). **HAND-OFF:** propose a value.js "path-geometry" wave (parse `d` → typed
  segment AST → length-parametrized sampler + a point-count-reconciling `d`-lerp). The
  CSS-native MotionPath half (`offset-distance` over `offset-path`) needs NO value.js change and
  ships engine-side in F (F26-1a).
- The baseline's VJ-1 (canonical `decay`/inertia + JS-easing→`linear()` sampler) is **already
  carried** — `decay.ts:17` notes it explicitly hands off to VJ-1 and collapses to a thin caller
  once value.js publishes the canonical form, and `springLinearStops` is the sampler half. No new
  action; re-confirm it stays in the F augmentation.

---

## Priority recommendation for Tranche F (this lane's view)

1. **F26-1a — CSS-native MotionPath** (`offset-distance` over `offset-path`, WAAPI-eligible) —
   **SHIP-in-F.** Highest ROI; zero value.js dep; reuses the WAAPI gate; the one real
   competitor-feature gap with a cheap engine-side close.
2. **F26-2 — `Sequence` transport completion** (`pause`/`resume`/`reverse`/`timeScale`/`progress`/
   `repeat`/`yoyo`) — **SHIP-in-F** (MEASURE-FIRST on reverse/timeScale C⁰-continuity). Finishes a
   primitive E *just* shipped; the substrate is already there.
3. **F26-3 — Dogfood the orchestration tier** (swap `useOrbitalInertia`'s `Math.pow` decay for
   `decay()`/`Draggable`; add a `Sequence`+`stagger` demo scene) — **SHIP-in-F (dogfood,
   parity-gated).** Proves the new API; closes the credibility gap.
4. **F26-1b/1c — MorphSVG + DrawSVG** — **BOOK + value.js-HANDOFF (VJ-F1).** The geometry sampler
   is value-domain; re-propose it into the F augmentation (it is missing from the E handoff).
5. **F26-4 — `splitText` (Intl.Segmenter)** — **BOOK.** Completes the stagger story; net-new DOM
   surface deserves a design pass. (Demo-side: fix `AnimatedText`'s grapheme-unsafe split now.)
6. **F26-5 per-property easing — KILL** (CSS-`@keyframes` fidelity forces per-frame; the LEAD
   depends on it). **F26-6 reactive value-graph — RECORD** (binding-layer, out of engine scope).

Every SHIP item is additive and isomorphism-safe (the two felt-equivalence cases — Sequence
reverse, orbital-inertia swap — are parity-gated MEASURE-FIRST). The engine's foundations and the
entire orchestration tier E shipped are genuinely SOTA and must be left alone; F's net-new surface
is **narrow** — the SVG sliver, the Sequence transport finish, and the dogfood proof.

---

## Diff vs the pre-E baseline (`r-anim-libs.md`) — explicit

| Pre-E finding | Pre-E disposition | POST-E status (verified) |
|---|---|---|
| F-1 stagger | FOLD-E | **LANDED** `stagger.ts` — ALREADY-SOTA (A26-1) |
| F-2 sequence/labels | FOLD-E (book first) | **LANDED** `sequence.ts` — but transport-incomplete → **F26-2 SHIP-in-F** |
| F-3 FLIP/layout | FOLD-E | **LANDED** `flip.ts`/`flipShared` — ALREADY-SOTA (A26-1) |
| F-4 drag/inertia | FOLD-E | **LANDED** `drag.ts`+`decay.ts` — SOTA, but UNDOGFOODED → **F26-3 SHIP-in-F** |
| F-5 native scroll | FOLD-E | **LANDED** `waapi.ts:396` bridge — ALREADY-SOTA (A26-3) |
| F-6 MotionPath | BOOK | **DID NOT LAND** — frontier widened (MorphSVG+DrawSVG now free) → **F26-1 SHIP(1a)+BOOK/HANDOFF(1b/1c)** |
| F-7 view-transitions helper | BOOK | demo stance correct (W11 dogfooded `SpringProgress` cross-dissolve); engine helper still BOOK — unchanged, low-pri |
| F-8 spring presets | FOLD-E (small) | **LANDED** `animations.ts:717` — ALREADY-SOTA (A26-5) |
| (scorecard) `fromDuration` | FOLD-E | **LANDED** `spring.ts:93` — ALREADY-SOTA (A26-2) |
| **NEW (2026 frontier)** | — | **F26-1b/c** MorphSVG/DrawSVG (GSAP-free shift) · **F26-4** SplitText · **F26-5** per-prop easing (KILL) · **F26-6** value-graph (RECORD) |

---

## Sources (2026 SOTA grounding)

- Motion — [motion.dev](https://motion.dev/), [changelog](https://motion.dev/changelog),
  [animate()](https://motion.dev/docs/animate) (v12.35, Mar 2026; ViewTimeline in useScroll,
  `useFollowValue`/`followValue`, hybrid WAAPI+ScrollTimeline).
- GSAP 3.13 — [gsap.com/svg](https://gsap.com/svg/), [Installation](https://gsap.com/docs/v3/Installation/),
  [Codrops: free GSAP plugins](https://tympanus.net/codrops/2025/05/14/from-splittext-to-morphsvg-5-creative-demos-using-free-gsap-plugins/),
  [GSDevTools](https://gsap.com/docs/v3/Plugins/GSDevTools/) (100% free incl. MorphSVG/DrawSVG/
  MotionPath/SplitText — Webflow).
- anime.js v4 — [animejs.com](https://animejs.com/), [v4 release](https://github.com/juliangarnier/anime/releases/tag/v4.0.0),
  [What's new in v4](https://github.com/juliangarnier/anime/wiki/What's-new-in-Anime.js-V4)
  (`morphTo`/`createMotionPath`/`createDrawable`, Draggable, Scope API, stagger-as-position).
- Theatre.js — [theatrejs.com](https://www.theatrejs.com/), [sequences](https://www.theatrejs.com/docs/latest/manual/sequences)
  (visual timeline scrubbing).
- modern-web-guidance baseline corpus — `scrollytelling`, `parallax-scroll-effects`,
  `dynamic-sibling-animations` (`sibling-index()`), `offset-path`/`offset-distance` animatability;
  `Intl.Segmenter` (Baseline 2024).
