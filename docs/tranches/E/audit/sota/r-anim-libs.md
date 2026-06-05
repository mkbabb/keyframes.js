# SOTA audit — animation-library feature-gap analysis (Tranche E)

**Lane:** competitive map vs Motion (motion.dev / Framer Motion), GSAP, anime.js v4, Theatre.js, Popmotion.
**Scope:** keyframes.js engine `src/animation/` + the Vue demo. Research-only; FOLD-E / handoff / book dispositions.
**Method:** live code (file:line) grounded against each library's published feature surface and the modern-web-guidance baseline corpus.

---

## TL;DR — competitive headline

keyframes.js is a **CSS-`@keyframes`-native, value.js-typed interpolation engine with a class-leading physics core and a clean value.js static/dynamic boundary**. It MATCHES or LEADS the SOTA on three axes the big libraries treat as bolt-ons:

- **CSS-`@keyframes` parsing as the authoring surface** (no other JS lib parses real `@keyframes` text into a runtime; GSAP/Motion/anime author in JS objects). LEAD.
- **Perceptual color interpolation** (oklab default, hue-method aware) — Motion/GSAP do sRGB or named-space lerp; keyframes routes through value.js's color engine. LEAD.
- **Analytic closed-form spring** (`spring.ts` — second-order ODE solved in closed form with live mid-flight target re-seat, SwiftUI `(response, dampingFraction)` surface) **plus** a faithful CSS `linear()` twin (`springTimingFunction.ts` / `springLinearStops.ts`) that round-trips onto the compositor via WAAPI. This is genuinely SOTA — Motion's spring is a numeric integrator; the `linear()`-twin-for-WAAPI move is exactly what `physics-based-easing` guidance recommends and almost nobody ships. LEAD.

It **GAPS** on the *orchestration & interaction* layer that Motion/GSAP/anime.js v4 have made table-stakes: **stagger**, **timeline sequencing/labels**, **automatic FLIP/layout animation**, **drag/gesture + velocity-handoff (inertia)**, **MotionPath/offset-path following**, and **native scroll-driven (`animation-timeline`) delegation**. These are the highest-value, isomorphism-safe additions.

---

## Competitive map (LEAD / MATCH / GAP)

| Capability | Motion | GSAP | anime.js v4 | keyframes.js | Verdict |
|---|---|---|---|---|---|
| CSS `@keyframes` text → runtime | ✗ | ✗ | ✗ | ✓ `engine.ts` `CSSKeyframesAnimation.fromString` | **LEAD** |
| Perceptual color interp (oklab/oklch) | partial | sRGB | sRGB | ✓ value.js, `colorSpace`/`hueMethod` `constants.ts:140` | **LEAD** |
| Analytic spring + live re-seat | numeric | numeric (Club) | numeric (bounce/duration) | ✓ closed-form `spring.ts` | **LEAD** |
| Spring → CSS `linear()` twin (WAAPI) | partial | ✗ | ✗ | ✓ `springTimingFunction.ts` + `waapi.ts:80` | **LEAD** |
| WAAPI / rAF hybrid engine | ✓ (the headline) | ✗ | ✓ `waapi` module | ✓ `waapi.ts` (eligibility-gated) | **MATCH** |
| Layer blending (replace/add/weighted) | ✗ (additive only) | ✗ | ✗ | ✓ `group.ts:240` | **LEAD** |
| Reduced-motion as a first-class gate | manual | manual | manual | ✓ `internal/reduced-motion.ts` everywhere | **LEAD** |
| Timeline sequencing / labels / position | ✓ | ✓ (gold standard) | ✓ | ✗ `group.ts` is parallel-only | **GAP** |
| Stagger | ✓ | ✓ | ✓ (in timeline) | ✗ | **GAP** |
| Automatic FLIP / layout animation | ✓ (`layout`/`layoutId`) | ✓ (Flip plugin) | ✗ | partial — `morph.ts` is manual rect→rect | **GAP** |
| Drag / gesture + inertia handoff | ✓ | ✓ (Draggable+Inertia) | ✓ (draggable) | ✗ (`spring.ts` has the velocity core, unwired) | **GAP** |
| MotionPath / offset-path | ✓ | ✓ | ✓ (svg module) | ✗ | **GAP** |
| Native scroll-driven (`animation-timeline`) delegation | ✓ (`useScroll`) | ✓ (ScrollTrigger) | partial | ✗ — `ScrollTimeline` is JS-rAF only `timeline.ts:163` | **GAP** |
| Scroll trigger pipeline (smoothing/snap/easing) | ✓ | ✓ | ✓ | ✓ `timeline.ts:80` (clean, well-factored) | **MATCH** |
| View-Transitions interop helper | ✓ (`AnimatePresence` analogue) | manual | manual | ✗ | **GAP (small)** |

---

## Findings

### F-1 — No stagger primitive  ·  GAP-NAMED → FOLD-E

- **Where:** no `stagger` symbol anywhere in `src/` or `demo/` (grep: zero hits). `Animation.setTargets(...targets)` (`engine.ts:906`) applies ONE animation to all targets *uniformly* — no index-based offset.
- **SOTA:** stagger is table-stakes. anime.js v4 made `stagger()` usable directly as a timeline time-position (the v4 headline); Motion ships `stagger()`; GSAP's `stagger` is a core tween option. The platform itself is moving here: `sibling-index()` / `sibling-count()` give CSS-native stagger (modern-web-guidance `dynamic-sibling-animations`, **limited availability** — Chrome/Edge 138 Jun 2025, Safari 26.2, no Firefox).
- **Opportunity / elegance:** a `stagger(n | items, { each, from: 'first'|'center'|'last'|'edges'|index, ease })` helper that returns a per-index delay function composes cleanly with the existing `AnimationGroup` (apply N child animations with computed `delay`) and with WAAPI delegation (`delay` already flows to `toWAAPIOptions` `waapi.ts:204`). Zero new hot-path cost — it's a construction-time delay generator. The CSS-native path (`sibling-index()` on `animation-delay`) belongs in the demo, not the engine, since keyframes drives JS objects too.
- **Perf rationale:** pure construction-time; no per-frame allocation. The `from: 'center'`/`'edges'` distance functions are O(N) once.
- **Disposition:** **FOLD-E** — a `src/animation/stagger.ts` light-side helper (value.js-free; returns `(i, total) => number` delay), plus a demo scene. Highest ROI gap.
- **Isomorphism:** additive new API; no existing pixels move.

### F-2 — No timeline sequencing / labels / position-based insertion  ·  GAP-NAMED → FOLD-E (design book first)

- **Where:** `AnimationGroup` (`group.ts`) is a **parallel compositor** — every child advances to the same absolute clock `t` (`advanceTo(t)` `group.ts:360`; `_advanceSlice` pushes all children to the same `t`). There is no notion of "play B after A", offset insertion (`"+=0.2"`), labels, or a master timeline scrubber over a sequence. `setChildTime` (`group.ts:334`) scrubs ONE child but there's no sequence model.
- **SOTA:** GSAP's `Timeline` (position parameter: absolute, relative `"+="`/`"-="`, labels) is the genre's gold standard; Motion has `animateSequence`/timeline segments with string labels; anime.js v4's timeline accepts `stagger()` as a position. This is THE orchestration primitive every competitor leads with.
- **Opportunity / elegance:** the engine already has the substrate — `Animation.advanceTo(absoluteClock)` and per-child `delay`. A `Sequence`/`Timeline` orchestrator (distinct from the scroll `Timeline` class — naming collision to resolve) that holds `{ animation, at: number | label | "+=rel" }` entries and maps a master playhead → each child's local clock is a thin layer over `advanceTo`. It does NOT need WAAPI (sequences are inherently rAF-driven on the main thread) but each *segment* can still delegate.
- **Perf rationale:** master-playhead → child-clock is arithmetic; reuses the existing zero-alloc `interpFrames` buffers. The existing `YIELD_BATCH` INP relief (`group.ts:60`) carries over.
- **Disposition:** **FOLD-E** — but **BOOK a design pass first**: the `Timeline` name already means "scroll/manual progress driver" (`timeline.ts`). The sequence orchestrator needs a distinct name (`Sequence`? `Storyboard`?) and a decision on whether it subsumes `AnimationGroup` (group = parallel sequence at `at: 0`) or sits beside it. This is the single biggest competitive gap; worth a deliberate API design.
- **Isomorphism:** additive; `AnimationGroup` semantics unchanged (it becomes the `at: 0` special case if unified).

### F-3 — FLIP / layout animation is manual-only  ·  GAP-NAMED → FOLD-E

- **Where:** `ElementMorph` (`morph.ts`) is a clean rect→rect interpolator — caller passes explicit `from`/`to` rects or elements, it computes `dx/dy/sx/sy` (`morph.ts:66`) and emits a `translate()/scale()` transform. It is a **manual FLIP** (you supply First and Last). There is no automatic "measure before a DOM mutation, measure after, invert+play" loop, and no shared-element (`layoutId`) matching.
- **SOTA:** Motion's `layout`/`layoutId` props auto-animate any layout change from a render (FLIP: First/Last/Inverse/Play, animating "un-animatable" properties like `justify-content` via transform). GSAP's Flip plugin captures state → mutates → `Flip.from(state)`. Motion notes FLIP-transform beats View-Transitions perf (no screenshot, animates `transform` not `width/height`).
- **Opportunity / elegance:** `ElementMorph` already IS the "Inverse+Play" half. A `flip(element, mutate: () => void, opts)` helper — measure rect, run `mutate`, measure again, build an `ElementMorph(before, after)` and `.play()` — is a ~30-line composition over the existing primitive. Shared-element (`flipShared(a, b)`) is the same with two elements. This is leverage of an existing asset, not new physics.
- **Perf rationale:** transform-only animation (compositor-friendly); the guide-cited advantage over View-Transitions. The spring twin (`springTimingFunction`) makes the FLIP springy for free.
- **Disposition:** **FOLD-E** — a `flip()` / `flipShared()` helper over `ElementMorph`. Note `getBoundingClientRect()` forces layout — batch the two reads to avoid layout thrash (read-mutate-read, one forced layout each side).
- **Isomorphism:** additive; `ElementMorph` unchanged.

### F-4 — Drag/gesture + velocity-handoff (inertia) absent — but the physics core is RIGHT THERE  ·  GAP-NAMED → FOLD-E

- **Where:** `SpringProgress` (`spring.ts`) tracks `currentVelocity` (`spring.ts:301`), re-seats the closed-form solution from `(x, v)` on every `set target` (`spring.ts:158`/`reseatTarget:167`), and exposes `velocity` and `subscribe(value, velocity)`. This is EXACTLY the substrate for gesture-follow + flick/inertia — the hard part (continuous trajectory across a live target change seeded from current velocity) is already solved and class-leading. What's missing is the *input* layer (pointer capture, velocity sampling from pointermove) and the *fling* wiring (release velocity → spring `initialVelocity` or a decay model).
- **SOTA:** Motion's `drag` does an inertia animation from pointer velocity (`dragMomentum`); GSAP Draggable + InertiaPlugin glides to a momentum stop; anime.js v4 added a `draggable` module. All three treat "drag → release → physics carries it" as core.
- **Opportunity / elegance:** a light-side `Draggable`/`useDrag` that samples pointer velocity and feeds it into the existing `SpringProgress` (set target on move, hand release-velocity to a spring re-seat) is a small adapter over a solved core. A pure `decay(v0, power)` (frictional, `x(t) = x0 + v0/k·(1−e^{−kt})`) is the only new math, and it's a one-liner sibling to the spring solver.
- **Perf rationale:** reuses the analytic stepper (O(machine-ε) per frame, `spring.ts:219`); pointer sampling is event-driven, not per-frame.
- **Disposition:** **FOLD-E** — `src/animation/drag.ts` (light: pointer capture + velocity sampler) + optional `decay.ts` sibling of the spring. The value.js-free boundary holds (no CSS parsing needed).
- **Isomorphism:** additive; no existing behavior touched.

### F-5 — `ScrollTimeline` is JS-rAF only; no native `animation-timeline: scroll()/view()` delegation  ·  GAP-NAMED → FOLD-E (delegation) + FOLD-VALUEJS-HANDOFF (none) 

- **Where:** `ScrollTimeline` (`timeline.ts:163`) samples `window.scrollY / (viewportHeight·threshold)` in a caller-owned rAF loop. It is a clean, testable JS progress driver (injectable `getScrollY`/`getViewportHeight`, smoothing, boundary snap — `timeline.ts:80`) but it never delegates to the **native** CSS Scroll-driven Animations (`animation-timeline: scroll()` / `view()`, `ScrollTimeline`/`ViewTimeline` Web API), which run **off the main thread**.
- **SOTA / baseline:** native scroll-driven animations are the platform answer Motion (`useScroll`) and GSAP (ScrollTrigger) increasingly bridge to. modern-web-guidance `scrollytelling`/`scroll-entry-exit-effects`/`parallax-scroll-effects` all lead with `animation-timeline` and recommend it "over JS" (echoed in this tranche's own `modern-web-findings.md` CSS5 row). The IntersectionObserver-threshold pattern is the documented *fallback*, not the primary.
- **Opportunity / elegance:** when the keyframes carry no computed units / no color interp (same eligibility `waapi.ts` already computes) AND a real DOM `ScrollTimeline`/`ViewTimeline` is available, an `Animation` could attach via `Element.animate(keyframes, { timeline: new ScrollTimeline({...}) })` — compositor-thread, zero JS per scroll frame. The JS `ScrollTimeline` class stays as the fallback + the testable/numeric path (canvas, non-DOM targets).
- **Perf rationale:** off-main-thread scroll animation is the single biggest scroll-perf win available; the JS rAF loop reads `scrollY` and lerps every frame on the main thread.
- **Disposition:** **FOLD-E** — extend WAAPI delegation to accept a native timeline; keep the JS `ScrollTimeline` as fallback/non-DOM driver. (Naming: see F-2 — the JS `Timeline` family and a native-`ScrollTimeline` delegation must not collide in docs.) No value.js change needed.
- **Isomorphism:** the native path must reproduce the JS path's curve; gate on the same eligibility as WAAPI so pixels match. Where they can't (smoothing, boundary snap are JS-side niceties), keep JS.

### F-6 — No MotionPath / offset-path following  ·  BOOK

- **Where:** no path-following primitive (grep for path/offset-path/getPointAtLength: only false positives — file paths, "playback"). `ElementMorph` does straight-line rect→rect only.
- **SOTA:** GSAP MotionPath, Motion path support, anime.js v4 `svg` module (motion path, morphing, line drawing). Plus the CSS-native `offset-path`/`offset-distance` (animatable, compositor-friendly).
- **Opportunity:** a `MotionPath` that animates `offset-distance` along an `offset-path` (CSS-native, WAAPI-eligible) for DOM, or samples an SVG `<path>` via `getPointAtLength` for canvas/numeric targets. The numeric variant composes with `NumericAnimation`.
- **Disposition:** **BOOK** — real value, but lower priority than F-1..F-5 and it leans on SVG geometry (a larger surface). Park it; the CSS `offset-path` half is small if scoped to DOM-only.
- **Isomorphism:** additive.

### F-7 — No View-Transitions interop helper  ·  BOOK (engine) — already correctly N/A in the demo

- **Where:** no `startViewTransition` usage in `src/`. The demo deliberately uses an engine-dogfooded `SpringProgress` cross-dissolve for scene-swap, and the prior `modern-web-findings.md` (row D-5) correctly records View-Transitions as **N/A-with-reason** for the demo (the API snapshots and forbids transitioning elements with active animations; it would re-introduce a removed wrapper).
- **SOTA:** `document.startViewTransition()` + `view-transition-name` (modern-web-guidance `same-document-transitions`). Motion's `AnimatePresence` is the library analogue.
- **Opportunity:** a tiny `withViewTransition(domMutation, { fallback })` helper that PRM-gates and feature-detects, for *consumers* doing route/state swaps where snapshot semantics fit (lists, hero expand). This is library-surface, distinct from the demo's deliberate dogfood choice. F-3's FLIP is the better fit for *active-animation* cases (transform, not screenshot).
- **Disposition:** **BOOK** — small, but it's a thin wrapper over a platform API; only worth shipping if a consumer story demands it. The demo stance is already correct and should not change.
- **Isomorphism:** N/A (new helper).

### F-8 — Preset library is solid but lacks the "entrance/exit" + "loop" taxonomy and spring presets  ·  FOLD-E (small)

- **Where:** `animations.ts` ships ~35 presets (fadeIn, bounce, shake, flip, heartbeat, glow, typewriter, spinner, slideIn{Left,Right}, etc. — `animations.ts:13–709`). No preset is spring-eased (all use CSS/cubic curves), and there's no taxonomy split (enter/exit/attention/loop) the way Motion's gallery or animate.css organizes.
- **SOTA:** anime.js v4 / Motion ship spring-physics presets; animate.css's enter/exit taxonomy is the mental model designers expect.
- **Opportunity:** a handful of `spring*`-eased presets (using `springTimingFunction` — already in-house) and a light grouping export. Cheap, high demo value.
- **Disposition:** **FOLD-E (small)** — add spring-eased presets + group exports. Pairs naturally with the F-1 stagger demo.
- **Isomorphism:** additive new presets; existing presets unchanged.

---

## ALREADY-SOTA — do not manufacture work here

- **A-1 — Analytic spring (`spring.ts`).** Closed-form second-order ODE (underdamped/critical/overdamped cases `spring.ts:258`), live mid-flight target re-seat from `(x, v)` keeping the trajectory continuous (`spring.ts:167`), SwiftUI `(response, dampingFraction)` surface. Per-frame error O(machine-ε) vs Motion's numeric integrator. **LEADS the field.** LEAVE.
- **A-2 — Spring `linear()` twin for WAAPI (`springTimingFunction.ts`, `springLinearStops.ts`, `waapi.ts:80`).** Same solver emits both the JS callable AND the faithful CSS `linear()` so the true overshoot/settle runs on the compositor. This is precisely the `physics-based-easing` guidance pattern (Baseline 2023-12-11) and almost nobody ships the round-trip. The CSS-twin-across-multiple-segments rejection (`waapi.ts:80`) is *correct* (WAAPI restarts the curve per segment) — a subtlety most libs get wrong. **LEADS.** LEAVE.
- **A-3 — WAAPI eligibility gate (`waapi.ts:35`).** Single source of truth, queryable `waapiIneligibleReason`, the bind-proof `usesDefaultRenderer` reference check (`waapi.ts:54`) that fixed the formerly-dead WAAPI path, refusal to delegate a non-CSS-faithful callable as bare-linear (`waapi.ts:97`). This is more rigorous than Motion's hybrid switch. MATCH/LEAD. LEAVE.
- **A-4 — Layer blending (`group.ts:240`).** replace/add/weighted with z-order, property whitelist, zero-alloc in-place compositing (`group.ts:91`, `transformFramesGrouped`). No mainstream lib exposes weighted layer blends — this is an animation-*compositor* capability. **LEADS.** LEAVE.
- **A-5 — Reduced-motion as a first-class unified gate (`internal/reduced-motion.ts`).** ONE `prefersReducedMotion()` + `withReducedMotion(snap, run)` consumed by every play path (spring/smooth/numeric/group/engine). Per-case snap, never the forbidden global `0.01ms`. More disciplined than any competitor (they leave it to the consumer). **LEADS.** LEAVE.
- **A-6 — Timeline progress pipeline (`timeline.ts:80`).** `sample → clamp → easing → boundary snap → smoothing → progress`, injectable scroll/viewport suppliers (testable off-DOM), caller-owns-rAF. The boundary-snap-vs-jitter handling (`timeline.ts:86`) is a real-world nicety. MATCH (the *delegation* gap is F-5, the pipeline itself is excellent). LEAVE.
- **A-7 — value.js static/dynamic boundary (`index.ts`).** Light physics engines carry zero static value.js edge; the heavy CSS-parsing engine loads via `loadAnimationEngine()`. A spring/smooth/numeric/morph/timeline consumer never pulls the parser. No competitor offers this granularity of tree-shaking. **LEADS.** LEAVE.

---

## value.js hand-offs (FOLD-VALUEJS-HANDOFF)

The orchestration/interaction gaps (F-1..F-7) are **engine-side** (keyframes.js `src/animation/`) — they consume value.js's published surface (lerp, easing, ValueUnit, color) without needing new value.js primitives. The math they need (spring solver, decay) already lives in keyframes.js, not value.js.

Two adjacent items the value.js owner may want to formalize, surfaced as a tranche proposal (do NOT write value.js directly):

- **VJ-1 — A canonical `decay`/inertia easing + a `cubicBezier`/`linear()`-sampling utility in value.js's easing registry.** keyframes.js will build `decay()` for F-4 locally over its spring; but a frictional-decay closed form and a generic "JS easing → `linear()` stops" sampler are value-domain math that belongs beside value.js's `timingFunctions` and would let `springLinearStops` collapse to a thin caller. **HAND-OFF:** propose a value.js easing-tranche item "decay model + JS-easing→linear() sampler" so the engine doesn't grow a second math home.
- **VJ-2 — `offset-path`/SVG path geometry helpers (`getPointAtLength`-equivalent, path sampling) for F-6 MotionPath.** Path geometry is value-domain (it's CSS/SVG value math), not animation-loop logic. If MotionPath graduates from BOOK, the geometry sampler is a value.js candidate rather than a keyframes-local one. **HAND-OFF:** propose a value.js path-geometry item.

Both are *optional enablers*, not blockers — every F-finding can ship engine-side without them.

---

## Priority recommendation for FOLD-E

1. **F-1 stagger** — highest ROI, pure construction-time, composes with `AnimationGroup` + WAAPI delay.
2. **F-2 sequence/timeline** — biggest competitive gap; BOOK the API design (name collision with scroll `Timeline`), then fold.
3. **F-3 FLIP/layout** — leverage of existing `ElementMorph`; ~30 lines + a shared-element variant.
4. **F-5 native scroll delegation** — biggest *perf* win (off-main-thread scroll); gate on existing WAAPI eligibility.
5. **F-4 drag/inertia** — the physics core is already SOTA and unwired; an input adapter unlocks it.
6. **F-8 spring presets** — cheap demo polish; pairs with F-1.
7. **F-6 MotionPath**, **F-7 View-Transitions helper** — BOOK; ship only on a concrete consumer story.

Every finding is **additive and isomorphism-safe** — no existing pixel or behavior moves. The engine's foundations (spring, color, WAAPI gate, blending, boundary, reduced-motion) are genuinely SOTA and should be left alone.
