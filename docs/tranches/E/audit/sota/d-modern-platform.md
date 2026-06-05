# Tranche E · SOTA Audit — Lane D: Modern-Platform Adoption (DEEP)

**Scope.** Synthesis of `r-waapi` + `r-scroll-view-transitions` + `r-cwv-perf` +
`r-modern-web-digest` into the concrete platform features the **library** (engine,
`src/animation/`) and the **demo** (`demo/`) should adopt NOW, each with a Baseline
date, an `@supports`/feature-detect fallback, and a disposition.

**Method.** modern-web-guidance skill (`2026_05_16-c5e7870`, the authoritative
Baseline-dated guidance) + W3C/MDN/web.dev cross-checks + live code reads (file:line).
inv-16: keyframes.js findings → FOLD-E; value.js findings → FOLD-VALUEJS-HANDOFF.

**Verdict (headline).** The engine is **already SOTA on the hard parts** — WAAPI
compositor delegation with a faithful eligibility gate and `linear()` spring twin
(`waapi.ts`), a unified `prefers-reduced-motion` authority, a LoAF perf observer, and
a value.js static/dynamic boundary. The gaps are **bridges to native compositor
timelines** the engine already has the JS analogues for but does not yet emit, and a
handful of **baseline-safe wins the engine parses-but-does-not-apply** (`@property`
registration) or **the demo hand-rolls instead of delegating to the platform** (View
Transitions for scene swaps; native CSS scroll-driven animations in the bench/visualizer).
No manufactured work: ~half the candidate features are flagged ALREADY-SOTA.

Legend — disposition: **FOLD-E** (fold into a Tranche-E keyframes.js wave) ·
**FOLD-VALUEJS-HANDOFF** (name a value.js tranche; do not write value.js) ·
**BOOK** (record for a later tranche; not now) · **GAP-NAMED** (platform gap, no
baseline-safe action) · **ALREADY-SOTA** (no work; we match or lead SOTA).

---

## A. Library (engine) findings

### D-LIB-1 · `@property` registry is parsed but never registered with the browser — FOLD-E

- **file:line** — `src/animation/engine.ts:995` (`propertyRegistry: Map<string, PropertyDescriptor>`),
  populated at `engine.ts:1005` from `resolveKeyframes(...).properties`. Grep confirms
  **zero** `CSS.registerProperty(` calls anywhere in `src/` or `demo/`.
- **SOTA gap** — `fromString` faithfully parses `@property --foo { syntax; initial-value;
  inherits }` into a registry, but the registry is **inert**: it is never handed to the
  platform via `CSS.registerProperty()`. Consequence: a custom property the author *typed*
  (`<color>`, `<length>`, `<number>`) is, to the browser, still an untyped string — so the
  native engine can NOT interpolate it. When such a `var(--foo)` rides the WAAPI path
  (`toWAAPIKeyframes`, `waapi.ts:132`) the compositor sees an unregistered custom property
  and falls back to discrete (no-interp) animation — a silent visual regression versus the
  rAF path, which interpolates it in JS.
- **perf/elegance rationale** — Registering up front lets the compositor interpolate typed
  custom properties on its own thread (the whole point of the WAAPI path) AND makes the
  parsed registry *do something* instead of being read-only metadata. Idempotent, one-time,
  near-zero cost. Closes the loop the parser already opened.
- **Baseline** — `@property` / `CSS.registerProperty()`: **Baseline newly available
  2024-07-09** (Chrome 85, Edge 85, Safari 16.4, Firefox 128). Baseline widely available
  expected 2027-01-09. (web.dev "@property: now with universal browser support";
  web-features `registered-custom-properties`.) **Baseline-safe to adopt now.**
- **Fallback / feature-detect** —
  ```ts
  if (typeof CSS !== "undefined" && "registerProperty" in CSS) {
    for (const [name, d] of this.propertyRegistry) {
      try { CSS.registerProperty({ name, ...d }); } catch { /* already registered — benign */ }
    }
  }
  ```
  A duplicate-name registration throws `InvalidModificationError`; swallow it (registries
  are process-global and may already hold the name). No-op where unsupported (SSR/jsdom).
- **isomorphism** — Behaviour-stable on the rAF path (JS already interpolates these). On the
  WAAPI path it *upgrades* fidelity (discrete → smooth) for typed customs — a strictly
  befitting pixel change, not a regression. Recommend a one-time call at the end of
  `fromString` (guarded), or an explicit `registerProperties()` the consumer opts into.
- **disposition** — **FOLD-E**.

### D-LIB-2 · Native compositor `ScrollTimeline`/`ViewTimeline` bridge — the engine has the JS analogue but never emits the native one — FOLD-E (behind a guard)

- **file:line** — `src/animation/timeline.ts:163` (`ScrollTimeline extends Timeline`),
  `:182` (`ManualTimeline`). These are **main-thread rAF-sampled** progress drivers
  (`sample() → clamp → easing → boundary snap → smoothing`, `timeline.ts:80`). WAAPI options
  builder `toWAAPIOptions` (`waapi.ts:173`) emits `{ duration, delay, iterations, direction,
  fill, easing }` — it **never sets the `timeline:` member** of `KeyframeEffectOptions`.
- **SOTA gap** — `Element.animate(keyframes, { timeline: new ScrollTimeline({ source }) })`
  and `new ViewTimeline({ subject })` move scroll/view-progress animations onto the
  **compositor thread** — zero main-thread sampling, no rAF, no INP cost. The engine's own
  `ScrollTimeline` re-samples `window.scrollY` every frame on the main thread (`timeline.ts:176`).
  Where the target is a DOM element and the curve is WAAPI-eligible, the native timeline is
  categorically more performant.
- **perf/elegance rationale** — This is the single largest *runtime* perf win available: a
  scroll-linked animation that currently costs a per-frame `getScrollY()` + JS lerp + style
  write becomes a compositor-resident animation that survives main-thread jank entirely. The
  engine already owns the eligibility gate (`isWAAPIEligible`) and the keyframe emitter
  (`toWAAPIKeyframes`); the bridge is "pass a `timeline` into `target.animate(...)` and skip
  the shadow rAF tick when the timeline is non-monotonic."
- **Baseline** — JS `ScrollTimeline`/`ViewTimeline` (and the CSS `animation-timeline:
  scroll()/view()` they mirror): **NOT Baseline — limited availability.** Chrome 115 /
  Edge 115 (Jul 2023), **Safari 26 (Sep 2025)** for the CSS surface; the JS WAAPI
  constructors remain **Chromium-only, unsupported in Firefox & Safari** as of this audit
  (MDN `ScrollTimeline`/`ViewTimeline`: "not Baseline"). modern-web-guidance
  `scroll-entry-exit-effects` / `scrollytelling` confirm "limited availability… Unsupported
  in Firefox."
- **Fallback / feature-detect** — `if ("ScrollTimeline" in window) { … native … } else { …
  keep the existing rAF `Timeline` path … }`. The existing JS `ScrollTimeline` IS the
  fallback — this is pure progressive enhancement with the *better* primitive already in
  hand. modern-web-guidance is explicit: **DO NOT use the `scroll-timeline-polyfill`
  package** (not feature-complete, known issues). The engine's hand-rolled sampler is the
  correct fallback.
- **isomorphism** — Pixel-stable in steady state (same progress → same keyframe sample);
  the native path removes a frame of smoothing latency (the compositor samples synchronously
  with scroll). That delta is *befitting* (it is strictly closer to the scroll). Gate the
  native path so the curve must be WAAPI-eligible (no computed units, no color lerp) — same
  gate already enforced for time-driven WAAPI.
- **disposition** — **FOLD-E** (a `useNativeScrollTimeline`-style opt-in on the WAAPI bridge,
  feature-detected). Sizeable; could be its own wave.

### D-LIB-3 · `prefers-reduced-motion` is polled per-`play()`, not live-observed — FOLD-E

- **file:line** — `src/animation/internal/reduced-motion.ts:23` (`prefersReducedMotion()`
  reads `matchMedia(...).matches` once per call); consulted at `engine.ts:787`
  (`withReducedMotion` inside `play()`). Grep confirms **no `addEventListener('change')`** on
  the media query list anywhere in `src/`.
- **SOTA gap** — The preference is sampled at the *instant* `play()` is called. A long or
  infinite animation (a spinner, an idle bob — `animations.ts`) that is mid-flight when the
  user flips the OS reduced-motion toggle keeps running at full motion until the next `play()`.
  SOTA (and the modern-web-guidance accessibility guide) treats reduced-motion as a **live**
  signal — `matchMedia(q).addEventListener('change', …)`.
- **perf/elegance rationale** — One shared `MediaQueryList` + one `change` listener (the file
  is already "THE one detector" by design) lets every running loop honor a mid-flight
  preference flip without re-architecting. Cheap, central, and the module is already the
  single authority — the live observer belongs exactly here.
- **Baseline** — `matchMedia` + `MediaQueryList.addEventListener('change')`: **Baseline
  widely available** (universal for years). No fallback gate needed beyond the existing SSR
  `typeof window` guard at `reduced-motion.ts:24`.
- **Fallback / feature-detect** — none required; SSR guard already present. Expose an
  `onReducedMotionChange(cb): () => void` subscriber from the module; running loops
  (`RAFPlayback.loop`, `AnimationGroup`) re-consult `withReducedMotion` on fire and snap to
  rest if it flipped to `reduce`.
- **isomorphism** — Behaviour change is *additive and befitting*: animations that were
  already correct at start stay correct; only a mid-flight toggle now takes effect. No pixel
  change for the common case (preference set before play).
- **disposition** — **FOLD-E**.

### D-LIB-4 · WAAPI compositor delegation + faithful eligibility gate — ALREADY-SOTA

- **file:line** — `src/animation/waapi.ts:35` (`isWAAPIEligible`), `:223` (`playWAAPI` with a
  shadow rAF tick for lifecycle parity), dispatch at `engine.ts:795`.
- **Assessment** — This is **at or ahead of** the SOTA libraries. The gate correctly rejects
  (a) non-uniform per-frame easing (WAAPI exposes one easing per animation, `waapi.ts:62`),
  (b) a CSS-twinned easing across multiple segments (the compositor restarts the curve per
  segment, `:80`), (c) a bespoke callable with no faithful CSS twin (would run bare-linear on
  the compositor — a silent regression, `:97`), (d) computed units needing DOM resolution
  (`:104`), and (e) color interpolation needing perceptual lerp (`:116`). The bind-proof
  reference comparison `usesDefaultRenderer` (`:54`) is a genuinely subtle correctness fix
  most libraries miss. The spring `linear()` twin emission (`toWAAPIOptions`, `:198`) lets a
  real spring curve run on the compositor — a capability GSAP/Motion approximate but few
  emit natively.
- **Baseline** — WAAPI `Element.animate`: Baseline widely available. `linear()` easing twin:
  **Baseline newly available** (Chrome 113 / Firefox 112 / Safari 17.2, Apr–Dec 2023);
  widely available expected **2026-06-11** (web-features `linear-easing`). The engine emits
  it where present and falls back to `linear` otherwise — exactly right.
- **disposition** — **ALREADY-SOTA**. No action. (Recorded so the tranche does not
  manufacture work here.)

### D-LIB-5 · LoAF perf observer is wired (dev-only) but unconsumed by the library surface — BOOK

- **file:line** — `demo/app/loaf-observer.ts:45` (`observeLongAnimationFrames`), gated dev-only
  at `demo/app/main.ts:29`. This is a **demo** asset, not a library export.
- **SOTA gap** — The Long Animation Frames API (modern-web-guidance `identify-heavy-scripts`,
  `identify-inp-causes`) is the lightweight field signal for INP attribution. The engine
  already yields between AnimationGroup batches (`scheduler.yield`, per `animation/CLAUDE.md`)
  but offers no first-class hook for a consumer to *measure* whether a group tick blew a frame
  budget. SOTA motion libs (Motion's dev tooling) surface this.
- **perf/elegance rationale** — A tiny, tree-shakeable `observeLongAnimationFrames` re-exported
  from the library barrel (it is value.js-free, fits the LIGHT surface) would let any
  consumer wire INP attribution without copying the demo's observer. Marginal, not urgent.
- **Baseline** — Long Animation Frames: **limited availability — Chrome/Edge 123 (Mar 2024)
  only**, unsupported in Firefox/Safari. Safe without fallback (no-ops elsewhere), but its
  niche reach makes this a "nice, not now."
- **isomorphism** — Pure measurement; zero behaviour/pixel impact.
- **disposition** — **BOOK** (promote the demo observer to a light library export in a later
  wave; not a Tranche-E headline).

---

## B. Demo findings

### D-DEMO-1 · Scene swaps hand-roll a SpringProgress cross-fade where View Transitions now fit — FOLD-E

- **file:line** — `demo/app/App.vue:231–249`: a `SpringProgress` drives `sceneSwapStyle`
  (opacity + scale) on a sibling wrapper `<div>` on every `activeSceneKey` change
  (`:245`). The comment block (`App.vue:111–135`) documents that a `<Transition
  mode="out-in">` around the keyed `<Suspense>` broke the async loader, so the fade was
  re-implemented as a reactive style binding.
- **SOTA gap** — This is exactly the **same-document View Transitions** use case
  (modern-web-guidance `same-document-transitions`, `directional-navigation-transitions`):
  wrap the scene-key swap in `document.startViewTransition(() => { /* commit the key change */ })`
  and let the platform snapshot old→new and cross-fade on the compositor — including the
  ability to *morph persisting elements* (the editor shell chrome, the header logo) across
  scenes via `view-transition-name`, which the current opacity-only spring cannot do.
- **perf/elegance rationale** — The View Transition runs on the compositor (no main-thread
  rAF spring sampling per frame), gives a richer effect (shared-element morph, directional
  slides keyed to nav direction via `types`), and *deletes* the bespoke spring-on-a-sibling
  machinery. It sidesteps the original `<Transition>`-vs-async-loader breakage entirely
  because `startViewTransition` is imperative — it does not wrap the `<Suspense>` vnode, so
  the async loader is untouched (the exact constraint `App.vue:128` was engineered around).
- **Baseline** — View Transitions (same-document): **Baseline newly available 2025-10-14**
  (Chrome 111, Edge 111, Safari 18, **Firefox 144 Oct 2025**). `types` /
  `:active-view-transition-type()` (directional): **Baseline newly available 2026-01-13**.
  `view-transition-class`: Baseline newly available 2025-10-14. **Baseline-safe now** for the
  cross-fade; directional types are *just* baseline.
- **Fallback / feature-detect** —
  ```ts
  function swapScene(commit: () => void) {
    if (!document.startViewTransition) { commit(); return; }   // immediate, no animation
    document.startViewTransition(commit);
  }
  ```
  Plus the **MANDATORY** reduced-motion guard from the guide:
  ```css
  @media (prefers-reduced-motion: reduce) {
    ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation: none !important; }
  }
  ```
- **isomorphism** — Visually *befitting* (richer, compositor-driven), not a regression; the
  reduced-motion branch preserves the engine's existing "snap clean swap" posture. NOTE the
  guide's accessibility-routing requirement: shift focus to the new scene heading on
  `transition.finished` (the current spring does not, so this is also an a11y upgrade).
- **disposition** — **FOLD-E** (demo). Keep the `SpringProgress` path as the documented
  no-`startViewTransition` fallback — it dogfoods the engine and is the guide-blessed
  non-polyfill fallback.

### D-DEMO-2 · Bench + AnimationVisualizer can demonstrate native CSS scroll-driven animation as a fourth engine — FOLD-E (demo/educational)

- **file:line** — `bench/` (`interpolation.bench.ts`, `playwright.bench.ts`,
  `loaf-scene.html`) benches rAF vs CSS `@keyframes` vs WAAPI (per `demo/CLAUDE.md`).
  `demo/@/components/custom/animation-controls/controls/AnimationVisualizer.vue` drives a
  progress ball via rAF sync. Grep confirms **zero** `animation-timeline` / `scroll()` /
  `view()` usage anywhere in `demo/` or `src/` (only the JS-side `ScrollTimeline` class).
- **SOTA gap** — keyframes.js *is a keyframes library*; the headline modern-platform feature
  for keyframes is **scroll-driven animations** (`animation-timeline: scroll()/view()`,
  modern-web-guidance `scroll-progress-indicator`, `scroll-entry-exit-effects`,
  `parallax-scroll-effects`). The demo showcases rAF/WAAPI/custom-transform but never the
  native CSS scroll-driven path — the most relevant modern CSS-animation capability for this
  exact library's domain. A scroll-progress-indicator or entry/exit reveal demo (with the
  engine's JS `ScrollTimeline` as the feature-detected fallback) would both teach the feature
  and dogfood the fallback story from D-LIB-2.
- **perf/elegance rationale** — Pedagogically and architecturally aligned: it makes the
  D-LIB-2 native-bridge story *visible* and gives the bench a fourth, compositor-resident
  engine to compare honestly against rAF/WAAPI.
- **Baseline** — Scroll-driven animations: **limited availability** (Chrome/Edge 115 Jul 2023,
  Safari 26 Sep 2025, **no Firefox**). Decorative → progressive enhancement (no fallback
  needed per the guide); functional → IntersectionObserver / scroll-listener fallback (the
  guide's pattern) or the engine's own JS `ScrollTimeline`.
- **Fallback / feature-detect** — `@supports ((animation-timeline: scroll()) and
  (animation-range: 0% 100%))` (the `animation-range` clause is **MANDATORY** per the guide,
  to exclude partial-support browsers), wrapped in `@media (prefers-reduced-motion:
  no-preference)`.
- **isomorphism** — New demo surface; no change to existing behaviour/pixels.
- **disposition** — **FOLD-E** (demo). Pairs naturally with D-LIB-2.

### D-DEMO-3 · `prefers-reduced-motion` CSS coverage is thin across demo motion — FOLD-E

- **file:line** — Only **3** files carry a `prefers-reduced-motion` block:
  `demo/app/App.vue`, `demo/cube/CubeTarget.vue`, `demo/@/styles/design-idioms.css`. Many
  motion surfaces (`will-change: transform` decorative motion in
  `demo/easing/EasingTarget.vue:314`, `demo/spring/SpringTarget.vue:180`,
  `AnimationVisualizer.vue:16`) have **no** reduced-motion guard at the CSS layer.
- **SOTA gap** — The engine honors reduced-motion (`respectReducedMotion`), but
  *CSS-authored* decorative motion in the demo (hover lifts, pulses, idle transitions) sits
  outside that gate. modern-web-guidance marks `@media (prefers-reduced-motion: reduce)` as
  **MANDATORY copy-paste safety** for any continuous/decorative motion.
- **perf/elegance rationale** — A single shared partial (the existing
  `demo/@/styles/design-idioms.css` is the right home — it already has one block) that
  neutralizes decorative transitions/animations under `reduce` covers the long tail without
  per-component edits. Low effort, high a11y/compliance value.
- **Baseline** — `prefers-reduced-motion`: **Baseline widely available** (universal).
- **Fallback / feature-detect** — none; pure CSS media query.
- **isomorphism** — Only changes pixels for users who *asked* for reduced motion — the
  definition of befitting.
- **disposition** — **FOLD-E** (demo).

### D-DEMO-4 · LoAF dev observer + `content-visibility` opportunity for offscreen scenes — BOOK

- **file:line** — `demo/app/loaf-observer.ts` (LoAF, already wired, dev-only). Scenes are
  code-split `defineAsyncComponent` + keyed `<Suspense>` (`scenes.ts:27`, `App.vue:137`) with
  **no** `<KeepAlive>` (removed for cause, `App.vue:111`). No `content-visibility: auto` on
  heavy offscreen panels (timeline, Monaco editor regions).
- **SOTA gap** — modern-web-guidance `defer-rendering-heavy-content` /
  `efficient-background-processing`: `content-visibility: auto` skips rendering/layout for
  offscreen content (the collapsed `KeyframeTimeline`, hidden control panels), cutting render
  cost and improving INP in complex layouts. The LoAF observer is the right instrument to
  *prove* the win before/after.
- **perf/elegance rationale** — Real but marginal for a single-scene-at-a-time demo; the
  biggest payoff is on the timeline/editor surfaces with large offscreen DOM.
- **Baseline** — `content-visibility`: **Baseline newly available** (Chrome 85, Edge 85,
  Safari 18 Sep 2024, Firefox 125 Apr 2024). Safe to adopt; needs `contain-intrinsic-size`
  to avoid scrollbar jump.
- **Fallback / feature-detect** — Unsupported browsers ignore the property (graceful).
- **isomorphism** — Pixel-stable when `contain-intrinsic-size` is set to the real size;
  visible only as faster offscreen→onscreen transitions.
- **disposition** — **BOOK** (measure-first; not a Tranche-E headline).

---

## C. value.js hand-offs (FOLD-VALUEJS-HANDOFF)

value.js is dirty + active; these are **named tranches for the value.js owner to
formalize**, NOT direct edits.

### D-VJS-1 · `@property` `syntax` → `CSS.registerProperty()` descriptor surface — FOLD-VALUEJS-HANDOFF

- **Context** — `engine.ts:1005` consumes `resolveKeyframes(...).properties`, a
  `Map<string, PropertyDescriptor>` produced by value.js's `@property` parser. For D-LIB-1
  (registering parsed `@property` rules with the browser) the engine needs the parsed
  descriptor to round-trip *exactly* into the `CSS.registerProperty()` argument shape:
  `{ name, syntax, inherits, initialValue }`. If value.js's `PropertyDescriptor` already
  exposes a verbatim `syntax` string and a normalized `inherits` boolean, D-LIB-1 is a pure
  keyframes.js change. If value.js normalizes/loses the raw `syntax` token (e.g. drops
  `<color>` vs `<color>+` multipliers, or unwraps `|` unions), the registration would be
  lossy.
- **Hand-off ask** — value.js tranche to **confirm/expose a lossless `syntax` string + a
  normalized `inherits` flag** on the `@property` parse result, suitable for direct
  `CSS.registerProperty()` hand-off. Verification only if already faithful; a small surface
  addition if not.
- **isomorphism** — Parsing-stable; this is about *preserving* fidelity that registration
  needs.

### D-VJS-2 · `linear()` easing round-trip parity with the engine's spring stops — FOLD-VALUEJS-HANDOFF

- **Context** — The engine emits `linear()` strings from `springLinearStops.ts:72` and reads
  CSS easing back through value.js (`getTimingFunction`, `engine.ts:1022`). For the WAAPI and
  native-timeline paths (D-LIB-2) the *same* `linear()` string must parse back to an
  equivalent curve. This is a **parity check**, not a defect — flag it so the value.js owner
  confirms value.js's easing parser accepts the multi-stop `linear(0, 0.234 4.17%, …, 1)`
  form (with explicit percentage positions) the engine emits, since CSS L2
  `<easing-function> linear()` allows positioned stops.
- **Hand-off ask** — value.js tranche to **add/confirm round-trip tests** for positioned
  `linear()` stops (Easing L2) so a spring emitted by keyframes.js re-parses identically.
- **isomorphism** — Behaviour-stable; guards against a future drift where an engine-emitted
  curve fails to round-trip through value.js's parser.

---

## D. Summary table

| ID | Surface | Finding | Baseline | Disposition |
|----|---------|---------|----------|-------------|
| D-LIB-1 | engine | parsed `@property` registry never `CSS.registerProperty()`'d | 2024-07-09 (newly avail) | **FOLD-E** |
| D-LIB-2 | engine | no native `ScrollTimeline`/`ViewTimeline` WAAPI bridge | limited (Chromium JS) | **FOLD-E** |
| D-LIB-3 | engine | reduced-motion polled per-play, not live-observed | widely avail | **FOLD-E** |
| D-LIB-4 | engine | WAAPI gate + `linear()` spring twin | newly/widely | **ALREADY-SOTA** |
| D-LIB-5 | engine | LoAF observer not a library export | limited (Chrome 123) | **BOOK** |
| D-DEMO-1 | demo | scene swap hand-rolls spring; View Transitions fit | 2025-10-14 (newly avail) | **FOLD-E** |
| D-DEMO-2 | demo | no native CSS scroll-driven animation demo/bench engine | limited (no Firefox) | **FOLD-E** |
| D-DEMO-3 | demo | thin `prefers-reduced-motion` CSS coverage | widely avail | **FOLD-E** |
| D-DEMO-4 | demo | `content-visibility` for offscreen heavy panels | newly avail (2024) | **BOOK** |
| D-VJS-1 | value.js | lossless `@property` `syntax`/`inherits` for registration | — | **FOLD-VALUEJS-HANDOFF** |
| D-VJS-2 | value.js | positioned `linear()` stop round-trip parity (Easing L2) | — | **FOLD-VALUEJS-HANDOFF** |

---

## E. Cites

- modern-web-guidance (`2026_05_16-c5e7870`): `scroll-entry-exit-effects`, `scrollytelling`,
  `parallax-scroll-effects`, `scroll-progress-indicator` (scroll-driven: limited avail,
  Chrome/Edge 115, Safari 26, no Firefox; `animation-range` clause MANDATORY in `@supports`;
  DO NOT use scroll-timeline-polyfill); `same-document-transitions`,
  `directional-navigation-transitions`, `group-element-transitions` (View Transitions:
  Baseline newly avail 2025-10-14; Active VT types 2026-01-13; mandatory PRM guard +
  focus routing); `identify-heavy-scripts`, `identify-inp-causes` (LoAF: limited, Chrome 123;
  Event Timing Baseline 2025-12-12); `defer-rendering-heavy-content`,
  `efficient-background-processing` (content-visibility).
- MDN `ScrollTimeline` / `ViewTimeline` — "not Baseline"; JS constructors Chromium-only.
- web.dev "@property: now with universal browser support" + web-features
  `registered-custom-properties` — Baseline newly avail 2024-07-09; widely avail 2027-01-09.
- web-features `linear-easing` — Baseline newly avail (Apr–Dec 2023); widely avail 2026-06-11.
- W3C Scroll-driven Animations Module L1 (drafts.csswg.org/scroll-animations-1);
  CSS Easing L2 (`linear()` positioned stops).

**inv-16 compliance.** Only this file written. keyframes.js findings → FOLD-E / BOOK.
value.js findings → FOLD-VALUEJS-HANDOFF (D-VJS-1, D-VJS-2) — named tranches, no value.js
edits proposed.
