# SOTA landscape — keyframes.js vs the 2026 animation-library field (audit ADDENDUM)

**Lane:** sota-landscape (post-fleet addendum, 2026-06-10 — answers the user's "are we truly
SOTA?" ask; the 33rd systemic doc, joining the 32 fleet lanes). Method: internal evidence from
the J audit corpus + source surface + the recorded bench/b16 numbers, crossed against the
WebSearch-verified June-2026 external landscape (GSAP 3.13+/Webflow, Motion (motion.dev),
anime.js v4, the native platform). Every internal claim cites a lane doc or `file:line`;
external claims carry source links (§7).

---

## §1 Internal evidence (what kf actually is)

**Public surface** (`src/animation/index.ts`): a proof-gated static/dynamic boundary. LIGHT
static barrel (zero value.js edge, gated by `proof:boundary`): `NumericAnimation`,
`SmoothProgress`, `SpringProgress`, `springLinearStops`, `springTimingFunction`,
`ElementMorph`, `Timeline`/`ScrollTimeline`/`ManualTimeline`/`createNativeTimeline`,
`RAFPlayback`, plus the E→I 16-export orchestration tier (`stagger`, `flip`/`flipShared`,
`drag`/`Draggable`, `decay`/`decayRest`, `Sequence`, `resolveEasing`/`toEasing`, typed
errors). HEAVY behind `loadAnimationEngine()`: `Animation`, `CSSKeyframesAnimation`,
`AnimationGroup`, `animate`, `MotionPath`, `DrawSVG`, 30+ presets, `resolveKeyframes`.

**Recorded engine qualities** (`audit/{engine-core,engine-periphery,perf-frontier,scope-adversary}.md`):

- **Zero-alloc hot path** — real but narrower than claimed: `interpFrames` (binary-search
  seed, in-place lerp, stable-key null-fill) and `transformFramesGrouped` are genuinely
  zero-alloc and test-gated; two escapes remain: ENG-3 (group `_advanceSlice` allocates a
  `Promise.all` array every frame, `group.ts:501-513`) and ENG-4 (per-frame closure pair in
  `withReducedMotion`, `engine.ts:876-880`).
- **`advanceTo` canon** — `tickDt(dt)` vs `advanceTo(t)` is clean (zero bare `tick(`), but
  `advanceTo` is `async` — the FB-2 microtask hop has ridden 4 tranches un-measured; J.W6
  is LAND-or-KILL.
- **WAAPI delegation** — default ON (`useWAAPI: true`), correctness-first eligibility
  (`waapi.ts`): rejects ALL viewport/container units + `%` (with a principled
  `offset-distance` exemption), `calc()`/`var()`, color interpolation, non-uniform easing;
  queryable `waapiIneligibleReason`; emits spring `linear()` CSS twins through `Easing.css`.
- **`scheduler.yield`** — live-probed `yieldToMain()` (`internal/scheduler.ts`);
  `AnimationGroup.YIELD_BATCH = 32` batches child ticks for INP relief; gated by the LoAF
  bench (200-cell group, zero >50 ms blocking tasks).
- **Static/dynamic boundary** — 16 KB ESM entry + 36 KB engine chunk (uncompressed; NOT
  directly comparable to competitors' min+gzip figures); light-only consumers never pull
  the parser or value.js.
- **Reduced motion** — ONE `withReducedMotion` gate; snap-to-rest-frame terminal path
  identical to forwards completion; SSR-safe.
- **Release posture** (`scope-adversary.md §1`) — npm is **frozen at 4.1.0**; the entire
  16-export orchestration tier (E→I) has never been published; README teaches 4 of ~13
  primitives; `flip`/`drag`/`draw-svg` have zero live demo coverage (EP-3).

## §2 External landscape (June 2026)

| | GSAP 3.13+ | Motion (motion.dev) | anime.js v4 | Native platform |
|---|---|---|---|---|
| **Ownership/license** | Webflow-owned (acq. Oct 2024); 100% free incl. all formerly-paid plugins (SplitText, MorphSVG, DrawSVG, ScrollTrigger, ScrollSmoother, Inertia) since Apr 2025 — but **proprietary "Standard License"**, not OSS; forbids Webflow-competing tools; revocable | **MIT**, independent, supporter-funded | **MIT** | n/a |
| **Engine** | rAF main-thread only; single ticker; no hardware acceleration | **Hybrid**: WAAPI + native ScrollTimeline first (compositor/120fps), JS fallback for springs/interrupts/gestures | Own rAF engine + optional `waapi` module | WAAPI; CSS scroll-driven animations (`scroll()`/`view()`) **still not Baseline** — Chrome/Edge + Safari 26, Firefox behind a flag; `@starting-style` Baseline; `linear()` Baseline Widely Available 2026-06-11; same-document View Transitions Baseline Newly Available Oct 2025 |
| **Size (min+gzip)** | core ~23.5 kb; ScrollTrigger +12–18 kb | `animate()` mini **2.6 kb**, full 18 kb; scroll +0.5–2.5 kb | ~10 kb full core / ~3 kb WAAPI-only module (~17 kb whole pkg) | 0 |
| **Springs** | **None** (duration-based eases only; oklch color anim reported buggy) | Real physics, velocity-passing, interruptible; also compiles springs → `linear()` for WAAPI | `createSpring` (mass/stiffness/damping/velocity) | `linear()` approximations only |
| **Perf claims** | Legacy "20× faster than jQuery"; no published ticks/sec | "2.5× faster than GSAP from unknown values, 6× at unit conversion"; compositor-immunity to main-thread jank | "lightweight/fast" positioning, no hard numbers | compositor-thread by construction |

## §3 Capability matrix

HAS / PARTIAL / NO. kf = keyframes.js @ the tranche-I tip.

| Capability | kf | GSAP | Motion | anime v4 | Native |
|---|---|---|---|---|---|
| **CSS @keyframes parse + round-trip** | **HAS — unique** (`parsing/keyframes.ts` grammar + `format.ts` serialize-from-template; caveat: the ENG-1 per-card serializer defect) | NO (own tween syntax) | NO | NO | PARTIAL (CSSOM exposes rules; no round-trip) |
| **Animate arbitrary JS objects from CSS** | **HAS — unique** (custom `transform` renderer; `NumericAnimation`) | HAS (any object, own syntax) | PARTIAL | HAS (own syntax) | NO |
| **Timeline/sequencing** | HAS (`Sequence`: labels, `"+=n"`, auto-append, rides `advanceTo`) | **HAS — gold standard** (nested timelines, timeScale) | HAS (+0.6 kb) | HAS (`createTimeline`) | NO |
| **Springs (physical)** | HAS (`SpringProgress` ODE, SwiftUI `(response, dampingFraction)`, velocity re-seat, `linear()` twins) | **NO** | HAS | HAS | NO |
| **Stagger** | HAS (first/last/center/edges/index) | HAS | HAS | HAS | NO |
| **FLIP/layout** | PARTIAL (single-element rect FLIP; no demo scene) | HAS (batch, nested) | **HAS — strongest** (shared layout) | NO | PARTIAL (View Transitions) |
| **Drag** | PARTIAL (1-axis pointer→spring plumbing) | HAS (Draggable: bounds, snap, 2D, rotation) | HAS (gestures) | HAS (`createDraggable`) | NO |
| **Decay/inertia** | HAS (`decay.ts` closed-form glide + `decayRest`) | HAS (InertiaPlugin + snap) | HAS | HAS | NO |
| **Motion path** | PARTIAL (CSS-native `offset-distance` sliver; path-`d` sampler BOOKED to value.js VJ-F1) | **HAS** (full sampler, any target) | HAS | HAS | HAS (`offset-path`) |
| **SVG draw** | HAS (dashoffset sweep, WAAPI-eligible) | HAS | HAS | HAS | PARTIAL |
| **SVG morph** | **NO** (routed out; `ElementMorph` is rect-to-rect) | **HAS** (MorphSVG) | HAS | HAS (`svg.morphTo`) | NO |
| **Perceptual color (oklab)** | **HAS — unique** (default `colorSpace: "oklab"`, CSS Color 4 `hueMethod`, multi-space) | NO (RGB-naive; oklch buggy per forum) | NO (RGB mix) | NO | HAS (`color-mix(in oklch)`) |
| **Compositor offload (WAAPI)** | HAS-conservative (default-on, wide ineligible set, always-correct rAF fallback) | **NO** | **HAS — most aggressive** (hybrid core) | PARTIAL (opt-in module) | HAS by definition |
| **Scroll-driven** | PARTIAL (progress driver + `createNativeTimeline`; **no pin/scrub/snap orchestration**) | **HAS — gold standard** (ScrollTrigger + ScrollSmoother) | HAS (native-backed) | HAS (`onScroll`) | PARTIAL (not Baseline) |
| **Layer blending/composition** | **HAS — unique** (`AnimationGroup` `replace`/`add`/`weighted`) | NO | NO | PARTIAL (additive blend) | PARTIAL (`composite`, no weighted) |
| **Text splitting** | NO | HAS (SplitText, free) | PARTIAL | HAS | NO |
| **Computed/container units (`calc`/`var`/`cq*`)** | **HAS — unique** (DOM round-trip resolution, layoutEpoch cache) | PARTIAL | PARTIAL | PARTIAL | HAS natively |
| **Tree-shaking/modularity** | HAS (light/heavy boundary, `sideEffects: false`, gate-enforced) | NO (monolithic) | HAS (2.6 kb tiers) | **HAS** (subpaths) | n/a |
| **Reduced-motion built-in** | HAS (ONE gate, snap semantics, SSR-safe) | NO (manual) | HAS | PARTIAL | HAS |
| **License** | MIT | Proprietary-free (revocable, anti-compete) | MIT | MIT | n/a |
| **Published/ecosystem** | **NO — npm frozen at 4.1.0; tier unpublished; README 4/13** | Massive | Massive | Large | n/a |

## §4 Verdicts

**Genuinely AHEAD (no 2026 competitor does these):**
1. **CSS `@keyframes` as a parseable, round-trippable source of truth** — parse author CSS,
   animate anything (DOM or plain objects), serialize back from the declared template.
   (Caveat: ENG-1 — one live defect at the per-card seam, J.W1's headline.)
2. **Perceptual color interpolation by default** — oklab + CSS Color 4 `hueMethod`; GSAP
   animates oklch incorrectly per its own forums; Motion/anime mix in RGB.
3. **Weighted layer blending** — a compositor-style lerp-by-weight tier no mainstream JS
   library exposes.
4. **Container-query-unit animation** with epoch-keyed DOM resolution.
5. **Engine-discipline proof culture** — gate-enforced zero-alloc, boundary gates, LoAF/INP
   gates. Competitors claim; kf proves in CI. (Engineering-quality axis.)

**BEHIND (honest):**
1. **Scroll orchestration** — nothing in ScrollTrigger's class (pin, scrub smoothing, snap,
   enter/leave, batch). The single largest capability gap.
2. **SVG morph + full motion-path sampler** — BOOKED out to value.js (VJ-F1), unshipped.
3. **Ecosystem, docs, distribution** — the decisive non-capability gap: npm frozen at 4.1.0
   while a GSAP-class API sits unpublished; README 4/13; no framework adapters; zero
   community. *As a shipped product*, this alone disqualifies SOTA status today (J.W5/WZ).
4. **Drag/text/layout depth** — 1-axis drag vs GSAP Draggable; no text splitting;
   single-element FLIP vs Motion's shared layout.
5. **Compositor offload breadth** — the conservative eligibility set keeps most real
   animations on rAF; Motion's hybrid delegates far more.

**PARITY:** springs (≈ Motion, both beat GSAP's none), stagger, basic sequencing,
decay/inertia, SVG draw, tree-shaking (≈ anime subpaths/Motion tiers), reduced-motion
(≈ Motion, ahead of GSAP), MIT licensing (≈ Motion/anime, ahead of GSAP's revocable grant).

## §5 Perf posture

- **GSAP**: no published engine numbers; two decades of main-thread ticker tuning;
  architecturally capped at zero compositor offload.
- **Motion**: adversarial micro-claims ("2.5× faster than GSAP from unknown values") + the
  structural compositor-immunity claim; concedes rAF wins at "thousands of small elements."
- **keyframes.js (measured)**: `interpFrames` 2-frame opacity ≈ **996k ops/s**; threaded
  interp at 600-frame windows K=2 34.1k hz / K=5 18.3k / K=12 8.4k (`G/audit/a-engine-perf.md`);
  the LoAF gate holds a 200-cell AnimationGroup composite with zero >50 ms blocking tasks
  (YIELD_BATCH=32); demo steady-state 60 fps on cube under 4× throttle (b16 — the demo
  hotspots were Vue reactivity, not the engine). Honest local vitest/playwright numbers, not
  public cross-library benchmarks.
- **kf's audit-named reserves (unspent)**: FB-2 the async `advanceTo` microtask hop (J.W6
  probe-or-KILL); ENG-3/ENG-4 the two per-frame allocation escapes (MEASURE-FIRST); PF-8 the
  value.js `lerpArray` SoA unconsumed while the measured real-world K is 6–10, where SoA
  bites **2.5–4×** (value.js probe: 0.73× K=1 → 3.13× K=8 → 4.14× K=16).

## §6 The synthesis line

keyframes.js is **architecturally SOTA-class and uniquely positioned on three axes no 2026
competitor occupies** (CSS-@keyframes round-trip, perceptual oklab interpolation, weighted
layer blending), with engine discipline exceeding what GSAP/anime demonstrate. It is **not
SOTA as a shipped product**: no ScrollTrigger-class scroll tier, no SVG morph, no ecosystem —
and its strongest tier is literally unpublished (the npm 4.1.0 freeze). Ahead on
parsing/color/composition · parity on springs/stagger/sequencing/inertia · behind on scroll
orchestration/morph/ecosystem · perf credible with three named reserves unspent. **The J
charter already owns every lever this verdict names** (J.W5/WZ the publish; J.W1 ENG-1;
J.W6 FB-2/SoA/PF-1; the scroll-orchestration tier is the one genuinely NET-NEW capability
candidate — a K-tranche question, recorded here, NOT folded into J).

## §7 External sources

[GSAP 3.13 release](https://gsap.com/blog/3-13/) · [GSAP is now completely free (CSS-Tricks)](https://css-tricks.com/gsap-is-now-completely-free-even-for-commercial-use/) · [Webflow makes GSAP free](https://webflow.com/blog/gsap-becomes-free) · [GSAP Standard License](https://gsap.com/community/standard-license/) · [Motion feature comparison](https://motion.dev/docs/feature-comparison) · [Motion performance guide](https://motion.dev/docs/performance) · [Motion WAAPI improvements](https://motion.dev/docs/improvements-to-the-web-animations-api-dx) · [anime.js](https://animejs.com/) · [animejs on Bundlephobia](https://bundlephobia.com/package/animejs) · [anime.js v4 migration](https://github.com/juliangarnier/anime/wiki/Migrating-from-v3-to-v4) · [MDN scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations) · [caniuse animation-timeline](https://caniuse.com/mdn-css_properties_animation-timeline_scroll) · [linear() easing Baseline](https://web-platform-dx.github.io/web-features-explorer/features/linear-easing/) · [View Transitions Baseline (web.dev)](https://web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available) · [MDN @starting-style](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@starting-style) · [GSAP oklch bug thread](https://gsap.com/community/forums/topic/44481-animating-oklch-colors-starts-the-animation-with-black/)
