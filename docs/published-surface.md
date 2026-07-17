# The published surface — the documented-surface manifest

The authoritative roster of every public **value** export of
`@mkbabb/keyframes.js` (the `src/animation/index.ts` barrel): its tier —
**LIGHT** (static named export, zero value.js edge) or **HEAVY** (reached only
through `loadAnimationEngine()`, the `AnimationEngine` keys) — and where the
README teaches it. Type-only exports are erased at build and carry no runtime
surface, so they do not appear here.

This file is **machine-checked** by `npm run proof:publish`: every public export must be either
README-taught or enumerated below, and a row naming a non-existent export
fails the gate — the roster cannot go stale against the source in either
direction. Row contract: first cell the backticked export name, second its
tier, third its README anchor (or a `manifest-only: <reason>` note).

**The value.js consume-edge is exact-pinned by design.** The exact
`@mkbabb/value.js@4.0.0` pin (see the CHANGELOG 6.0.0 "Dependency Changes"
section) is deliberate: every constellation consume-edge is a measured,
integrity-pinned edge, not a semver range. Value patches reach consumers through
the smallest honest keyframes successor — a re-pinned, re-verified release —
never by range drift under a caret.

## LIGHT — the static barrel

`import { … } from "@mkbabb/keyframes.js"` — value.js-free, tree-shakeable
(see [README §Baseline, tree-shaking & reduced motion](../README.md#baseline-tree-shaking--reduced-motion)).

| Export                 | Tier  | Taught                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ---------------------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NumericAnimation`     | LIGHT | [README §NumericAnimation](../README.md#numericanimation)                                                                                                                                                                                                                                                                                                                                                                                 |
| `SmoothProgress`       | LIGHT | [README §SmoothProgress](../README.md#smoothprogress)                                                                                                                                                                                                                                                                                                                                                                                     |
| `SpringProgress`       | LIGHT | [README §SpringProgress](../README.md#springprogress)                                                                                                                                                                                                                                                                                                                                                                                     |
| `reseatToSpring`       | LIGHT | manifest-only: K.W11 PHYS-B2 — velocity-continuous interruption of a parsed-CSS animation; finite-differences a `VelocityProbe` interp stream and seeds a `SpringProgress` at the current position with the measured velocity, targeting a new value (the spring's `linear()` twin is round-trippable).                                                                                                                                   |
| `probeVelocity`        | LIGHT | manifest-only: K.W11 PHYS-B2 — the finite-difference leaf of `reseatToSpring`; `(curr − prev)/dt` over a two-sample `VelocityProbe`, the one place a numerical derivative is correct on a velocity-less keyframe stream.                                                                                                                                                                                                                  |
| `reducedMotionScale`   | LIGHT | manifest-only: K.W11 PHYS-E — resolves a `ReducedMotionPolicy` (`boolean \| number`) to the amplitude scale ∈ [0,1] a stepper multiplies its displacement-from-rest by (the WCAG 2.3.3 intensity); the consumer can read it to scale its own non-spring motion. The app supplies the policy; kf supplies the mechanism.                                                                                                                   |
| `springLinearStops`    | LIGHT | [README §springLinearStops & springTimingFunction](../README.md#springlinearstops--springtimingfunction)                                                                                                                                                                                                                                                                                                                                  |
| `springTimingFunction` | LIGHT | [README §springLinearStops & springTimingFunction](../README.md#springlinearstops--springtimingfunction)                                                                                                                                                                                                                                                                                                                                  |
| `ElementMorph`         | LIGHT | [README §ElementMorph](../README.md#elementmorph)                                                                                                                                                                                                                                                                                                                                                                                         |
| `Timeline`             | LIGHT | [README §Timeline](../README.md#timeline)                                                                                                                                                                                                                                                                                                                                                                                                 |
| `KeyframesScrollTimeline` | LIGHT | [README §Timeline](../README.md#timeline) — L.W8 S4 PKG-3 — the canonical name of the JS scroll-progress sampler (renamed from `ScrollTimeline` to clear the `globalThis.ScrollTimeline` d.ts collision; the emitted-d.ts check runs in `proof:publish`). The `ScrollTimeline` backward-compat alias was DROPPED in 5.0.0 (Q.WE1 — NO-LEGACY).                                                                                                                          |
| `ManualTimeline`       | LIGHT | [README §Timeline](../README.md#timeline)                                                                                                                                                                                                                                                                                                                                                                                                 |
| `createNativeTimeline` | LIGHT | [README §Timeline](../README.md#timeline) — the native scroll/view-timeline fast lane (feature-detected, `null` off-platform)                                                                                                                                                                                                                                                                                                             |
| `RAFPlayback`          | LIGHT | [README §RAFPlayback](../README.md#rafplayback)                                                                                                                                                                                                                                                                                                                                                                                           |
| `Oscillator`           | LIGHT | manifest-only: L.W9 S5 KF-OSCILLATOR (W128) — a periodic phase clock (`{ frequency, waveform }` → phase ∈ [0,1)); `tick(dt)` advances the linear phase ramp by `frequency × dt` (caller-driven, no rAF ownership — mirrors `SmoothProgress`/`SpringProgress`), `sample(t)` is the pure `t → waveform(t × frequency)` map. Value.js-free (no CSS parsing); glass-ui BB `W-EASING-PRIMITIVE` + the demo KF-OSCILLATOR scene consume it. The CORE LIGHT edge is checked by `proof:publish`. |
| `waveformValue`        | LIGHT | manifest-only: L.W9 S5 — the value.js-free waveform shaper leaf of `Oscillator` (`phase ∈ ℝ → value ∈ [-1,1]` for `sine`/`triangle`/`square`/`sawtooth`, the phase reduced to its fractional cycle position); a consumer can apply it to its own phase without constructing an `Oscillator`. Its LIGHT edge is checked by `proof:publish`. |
| `stagger`              | LIGHT | [README §stagger](../README.md#stagger)                                                                                                                                                                                                                                                                                                                                                                                                   |
| `flip`                 | LIGHT | [README §flip / flipShared](../README.md#flip--flipshared)                                                                                                                                                                                                                                                                                                                                                                                |
| `flipShared`           | LIGHT | [README §flip / flipShared](../README.md#flip--flipshared)                                                                                                                                                                                                                                                                                                                                                                                |
| `splitText`            | LIGHT | manifest-only: S.F2 SF-10 — the a11y-first text-splitter (`splitText(el, { by, a11y })`); shreds a text element into a per-word/grapheme/line fragment cohort + a ready `stagger`, consolidating the accessible name onto the container (`aria-label` over a naming role + `aria-hidden` fragments) so AT reads the whole string, not the per-glyph stream. LIGHT (composes `stagger` + the platform `Intl.Segmenter`; zero static value.js edge, checked by `proof:publish`). `by:"line"` is measure-or-refuse (`getClientRects`-grouped, re-measured on resize; a `SplitTextRefusalError` under container-query/resize instability). `test/orchestration/split-a11y-oracle.test.ts`, run through `demo:correctness`, checks computed accessible-name equality in Chromium. |
| `SplitTextRefusalError`| LIGHT | manifest-only: S.F2 SF-10 — the typed REFUSAL of `splitText(el, { by:"line" })` when the container cannot be measured/held (`reason`: `"unmeasurable"` \| `"unstable"` \| `"empty"`); the caller `instanceof`-narrows it to fall back to the layout-independent `by:"word"`. Its value.js-free edge is checked by `proof:publish`. |
| `viewTransition`       | LIGHT | [README §viewTransition](../README.md#viewtransition) — S.F1 VT-a — the LIGHT View-Transitions dispatch: mutate the DOM behind a native View Transition where the platform ships one, else fall back to a `flipShared` shared-element morph (or a bare immediate mutation), behind ONE normalized `ViewTransitionHandle` whose `backend` (`"view-transition"` \| `"flip"` \| `"immediate"`) is queryable synchronously and whose promises never reject. Feature-detects `startViewTransition` + its typed-`update` overload; PRM routes through the ONE `withReducedMotion` gate. Its zero static value.js edge is checked by `proof:publish`; its zero-runtime CSS twin is the HEAVY `compileToViewTransition`. |
| `drag`                 | LIGHT | [README §drag / Draggable](../README.md#drag--draggable)                                                                                                                                                                                                                                                                                                                                                                                  |
| `Draggable`            | LIGHT | [README §drag / Draggable](../README.md#drag--draggable) — the class form behind `drag()`                                                                                                                                                                                                                                                                                                                                                 |
| `drag2D`               | LIGHT | manifest-only: L.W5 S4 — the single-call 2-D drag sugar over two one-axis `Draggable`s (`{x,y}` options pass `bounds`/`snap`/`rubberBand` through per-axis); a shared subscriber emits `(x,y,vx,vy)`, one `dispose()` tears down both. KISS: the 1-D engine stays 1-D. Returns a `Drag2DHandle`.                                                                                                                                            |
| `decay`                | LIGHT | [README §decay / decayRest](../README.md#decay--decayrest)                                                                                                                                                                                                                                                                                                                                                                                |
| `decayRest`            | LIGHT | [README §decay / decayRest](../README.md#decay--decayrest)                                                                                                                                                                                                                                                                                                                                                                                |
| `Sequence`             | LIGHT | [README §Sequence](../README.md#sequence)                                                                                                                                                                                                                                                                                                                                                                                                 |
| `loadAnimationEngine`  | LIGHT | [README §The dynamic engine](../README.md#the-dynamic-engine--loadanimationengine) — the one gateway to the HEAVY tier                                                                                                                                                                                                                                                                                                                    |
| `warmEngine`           | LIGHT | manifest-only: L.W7 S1 — fire-and-forget idle-warmer; pre-flights `loadAnimationEngine()`'s dynamic import (during `requestIdleCallback` / `visibilitychange` / `mouseenter`) so the first `loadAnimationEngine()` on a cold page resolves against an already-in-flight Promise. Shares the one memoized `_enginePromise` (no double import); adopts `scheduler.postTask("background")` when available. Value.js-free (fires a dynamic import only). |
| `resolveEasing`        | LIGHT | [README §Beyond CSS](../README.md#beyond-css) intro — async string-name → typed `Easing` (rides the dynamic engine edge)                                                                                                                                                                                                                                                                                                                  |
| `toEasing`             | LIGHT | [README §Beyond CSS](../README.md#beyond-css) intro — sync callable → typed `Easing` normalizer                                                                                                                                                                                                                                                                                                                                           |
| `AnimationOptionError` | LIGHT | [README §AnimationOptions](../README.md#animationoptions) — typed throw on a malformed option (fail-explicit validation)                                                                                                                                                                                                                                                                                                                  |
| `UnknownEasingError`   | LIGHT | [README §Beyond CSS](../README.md#beyond-css) intro — typed throw from `resolveEasing` on an unresolvable name                                                                                                                                                                                                                                                                                                                            |

## HEAVY — the `AnimationEngine` surface

`const engine = await loadAnimationEngine()` — carries the CSS `@keyframes`
parser and `@mkbabb/value.js`; one dynamic import, cached thereafter
(see [README §The dynamic engine](../README.md#the-dynamic-engine--loadanimationengine)).

| Export                  | Tier  | Taught                                                                                                                                                     |
| ----------------------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `KeyframesAnimation`    | HEAVY | [README §Animation](../README.md#animation) — L.W8 S4 PKG-3 — the canonical name of the core engine class (renamed from `Animation` to clear the `globalThis.Animation` d.ts collision; the emitted-d.ts check runs in `proof:publish`). `CSSKeyframesAnimation` extends it. The `Animation` backward-compat alias was DROPPED in 5.0.0 (Q.WE1 — NO-LEGACY). |
| `CSSKeyframesAnimation` | HEAVY | [README §CSSKeyframesAnimation](../README.md#csskeyframesanimation)                                                                                        |
| `AnimationGroup`        | HEAVY | [README §AnimationGroup](../README.md#animationgroup)                                                                                                      |
| `MotionPath`            | HEAVY | [README §MotionPath](../README.md#motionpath)                                                                                                              |
| `fromMotionPath`        | HEAVY | [README §MotionPath](../README.md#motionpath)                                                                                                              |
| `DrawSVG`               | HEAVY | [README §DrawSVG](../README.md#drawsvg)                                                                                                                    |
| `fromDrawSVG`           | HEAVY | [README §DrawSVG](../README.md#drawsvg)                                                                                                                    |
| `MorphSVG`              | HEAVY | [README §MorphSVG](../README.md#morphsvg)                                                                                                                  |
| `fromMorphSVG`          | HEAVY | [README §MorphSVG](../README.md#morphsvg)                                                                                                                  |
| `presets`               | HEAVY | [README §Presets](../README.md#presets)                                                                                                                    |
| `getAnimationId`        | HEAVY | [README §The dynamic engine](../README.md#the-dynamic-engine--loadanimationengine) — stable string id for an `Animation` (or passthrough)                  |
| `resolveKeyframes`      | HEAVY | [README §The dynamic engine](../README.md#the-dynamic-engine--loadanimationengine) — CSS `@keyframes` text/stylesheet → resolved keyframes                 |
| `DIRECTIONS`            | HEAVY | [README §AnimationOptions](../README.md#animationoptions) — the valid `direction` values, as a const tuple                                                 |
| `FILL_MODES`            | HEAVY | [README §AnimationOptions](../README.md#animationoptions) — the valid `fillMode` values, as a const tuple                                                  |
| `defaultOptions`        | HEAVY | [README §AnimationOptions](../README.md#animationoptions) — the `AnimationOptions` defaults                                                                |
| `defaultLayerConfig`    | HEAVY | [README §AnimationGroup](../README.md#animationgroup) — the per-layer blend-config defaults                                                                |

### K.W8 INGEST — the round-trip pointed FORWARD at the live web

The ingest surface (`src/animation/ingest.ts`, HEAVY — it statically imports the
engine + adapter, the value.js `@keyframes` parser). kf READS the live web's OWN
CSS: it walks `document.styleSheets`, filters to `CSSKeyframesRule`, serialises
each via `rule.cssText`, and feeds THAT text into the EXISTING
`resolveKeyframes` pipeline — the parser run FORWARD over the SAME data model (no
new grammar, no re-derivation). `adoptRunning` takes over a RUNNING CSS animation
mid-flight via the `getAnimations()` currentTime handoff (the continuity seed,
NOT seed-at-zero). Every step it cannot complete faithfully (a cross-origin
sheet, a malformed rule) becomes a citable `CORS_SKIP`/`PARSE_ERROR` diagnostic
on `ResolvedKeyframes.diagnostics` — never a silent drop. Each row is
manifest-only and covered by `test/ingest/ingest.test.ts`.

| Export                 | Tier  | Taught                                                                                                                                                                                                                                                                                                         |
| ---------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fromStyleSheets`      | HEAVY | manifest-only: K.W8 K1 — walk the document's (or a given list's) stylesheets → a `Map<name, CSSKeyframesAnimation>` of reconstructed animations + the CORS-skip diagnostics; `test/ingest/ingest.test.ts` clause (a)/(b)/(d)                                                                  |
| `fromLiveAnimations`   | HEAVY | manifest-only: K.W8 K1 — narrow to the names currently RUNNING via `getAnimations()`, reconstructed from their source `@keyframes` rule (NOT the lossy computed `getKeyframes()`); `test/ingest/ingest.test.ts`                                                                               |
| `resolveLiveKeyframes` | HEAVY | manifest-only: K.W8 K1 — the lowest-level CSSOM walk (the live-CSSOM analogue of `resolveKeyframes`); per-sheet `try/catch` → a `CORS_SKIP` diagnostic, never a silent drop; `test/ingest/ingest.test.ts` clause (d)                                                                          |
| `adoptRunning`         | HEAVY | manifest-only: K.W8 K2 — the mid-flight takeover of a running CSS animation (`getAnimations()` currentTime handoff + commit-on-adopt + the continuity seed); named `adoptRunning` to disambiguate from `engine.adoptCompiled` (HARDENING-5 HAZARD-1); `test/ingest/ingest.test.ts` clause (c) |

### K.W9 SCROLL-AS-CSS — the scroll-grammar round-trip + `ScrollScene` driver

The scroll-driven-animation surface (`src/animation/scroll-scene.ts`, HEAVY — it
consumes value.js 0.13.0's typed `CSSTimelineOptions` scroll grammar). kf PARSES
the `animation-timeline`/`-range`/`timeline-scope`/`-trigger` the CSS WG
standardized, DRIVES it on the compositor where eligible (native `ScrollTimeline`)
and on its shipped physics where not (the JS `ScrollScene`: `SmoothProgress`
scrub + `decayRest`/`SpringProgress` snap), and SERIALIZES it BACK to valid CSS —
the only library that round-trips a scroll-driven stylesheet. value.js owns the
scroll VALUES; the `ScrollScene` driver owns TIME. Each row is manifest-only and
covered by `test/scroll/scroll-scene.test.ts` (replay equality, dispatch, and the
`position:sticky` pin assertion); the SO-4 transform-pinning primitive is KILLED
(cross-thread jitter — the pin is `position:sticky` synthesis only).

| Export                   | Tier  | Taught                                                                                                                                                                             |
| ------------------------ | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ScrollScene`            | HEAVY | manifest-only: the JS scroll driver (scrub/snap/enter-leave over a parsed `animation-range`); `test/scroll/scroll-scene.test.ts` clause (a)/(e)                |
| `createScrollScene`      | HEAVY | manifest-only: construct a `ScrollScene` from parsed `CSSTimelineOptions` or a spec; `test/scroll/scroll-scene.test.ts` clause (a)                             |
| `driveScrollCSS`         | HEAVY | [README §Scroll-driven animation](../README.md#scroll-driven-animation) — compose parsed `CSSTimelineOptions` into the range scene, optional trigger scene, and conservative native-vs-JS backend handle; parse→drive symmetry is covered by the scroll suite |
| `parseScrollCSS`         | HEAVY | manifest-only: SO-1 PARSE — a scroll-driven stylesheet → typed `CSSTimelineOptions` (consumes value.js `extractTimelineOptions`); `test/scroll/scroll-scene.test.ts` clause (b)              |
| `parseScrollTimeline`    | HEAVY | manifest-only: parse one `animation-timeline` value (value.js `parseAnimationTimeline` pass-through); `test/scroll/scroll-scene.test.ts` clause (b)                                          |
| `parseScrollRange`       | HEAVY | manifest-only: parse one `animation-range` shorthand (value.js `parseAnimationRange` pass-through); `test/scroll/scroll-scene.test.ts` clause (b)                                            |
| `serializeScrollOptions` | HEAVY | manifest-only: SO-1 SERIALIZE — typed `CSSTimelineOptions` → CSS longhands (value.js `serializeTimelineOptions`); `test/scroll/scroll-scene.test.ts` clause (b)                              |
| `roundTripScrollCSS`     | HEAVY | manifest-only: the full `parse → serialize` round-trip (the replay-equality oracle); `test/scroll/scroll-scene.test.ts` clause (b)                                                           |
| `dispatchScrollBackend`  | HEAVY | manifest-only: the conservative-correct native-vs-JS dispatch with a queryable reason (the `waapiIneligibleReason` idiom on the scroll clock); `test/scroll/scroll-scene.test.ts` clause (c) |
| `resolveRange`           | HEAVY | manifest-only: resolve a parsed `animation-range` to `[start,end]` scroll-extent fractions (the driver's TIME-side fill); `test/scroll/scroll-scene.test.ts` clause (b)                      |
| `pinCSS`                 | HEAVY | manifest-only: SO-3 the `position:sticky` pin synthesis (SO-4 transform-pinning KILLED); `test/scroll/scroll-scene.test.ts` clause (d)                                                       |
| `TriggerScene`           | HEAVY | manifest-only: S.F4 the discrete `animation-trigger` driver — the idle→active→done lifecycle (+ backward/repeat) over a parsed `<trigger-type>`; `test/scroll/scroll-scene.test.ts` and the Chromium-backed `test/scroll/trigger-oracle.test.ts` run by `demo:correctness` |
| `createTriggerScene`     | HEAVY | manifest-only: S.F4 construct a `TriggerScene` from a parsed `AnimationTriggerValue` or `CSSTimelineOptions` (grammar → behavior); same scroll suites                       |
| `supportsNativeTrigger`  | HEAVY | manifest-only: S.F4 feature-detect native `animation-trigger` (Chrome 145+) via `CSS.supports` — the native/fallback split, never UA-sniffed; same scroll suites           |

### K.W10 COMPILE — the round-trip's BACKWARD half (the XL anchor)

The CSS compiler (`src/animation/compile.ts`, HEAVY — it statically imports
value.js's `reverseAnimationShorthand`/`sampleColorRamp`/`deltaEOK` + the engine).
`compileToCSS` walks an orchestration graph — an `AnimationGroup` (spatial
blend), a `Sequence` (temporal positioning), or a bare child list (e.g. a
`stagger` cohort) — and emits a PURE, ZERO-RUNTIME CSS artifact: one
`@keyframes` block + one `animation` shorthand per child, the `replace`/`add`
layering as a SEPARATE `animation-composition` longhand (INVERTING W7's
honoring), springs as `linear()`, materialized stagger/sequence delays, computed
units (`vh`/`cqw`/`calc()`/`var()`) VERBATIM (STRICTLY BETTER than WAAPI — CSS
re-resolves natively), and color tracks DENSIFIED into perceptual `oklab()` stops
(consuming `sampleColorRamp`) under the ΔE-ε proof (`deltaEOK`). The compiler is
the parser run BACKWARD over the SAME data model (`format.ts` is `keyframes.ts`
run backward — GSAP/Motion/anime cannot do this, their authoring object is not
CSS). What cannot round-trip faithfully is REFUSED with a NAMED reason — the four
CC-3 refusals (`weighted` blend / custom renderers / perceptual oklab beyond
densify / computed-unit drift), the `waapiIneligibleReason` idiom generalized to
the CSS domain — never silently approximated. The "Export CSS" editor button
(CC-4) makes the demo a CSS-animation IDE. The row is manifest-only and covered
by `test/compile/compile-roundtrip.test.ts`.

| Export         | Tier  | Taught                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `compileToCSS` | HEAVY | manifest-only: K.W10 CC-1/CC-2/CC-3 — compile an `AnimationGroup`/`Sequence`/child list → a zero-runtime CSS artifact (`@keyframes` + `animation-*` longhands + `animation-composition` layering + `linear()` springs + materialized stagger delays + perceptual `oklab()` densify) + the four CC-3 refusals (the `{ css, eligible, refusals }` trust surface); the parser run BACKWARD over the SAME data model; `test/compile/compile-roundtrip.test.ts` clause (a)/(b)/(c)/(d) |
| `compileToViewTransition` | HEAVY | [README §compileToViewTransition](../README.md#compiletoviewtransition) — S.F1 VT-c — `compileToCSS`'s sibling pointed at native View Transitions: compile a name-keyed `VTRoleSpec` (`{ old?, new?, group?, class? }`) → zero-runtime `::view-transition-*` CSS over THREE surfaces — old/new full `@keyframes` + shorthand, and a MANDATORY timing-only `::view-transition-group(name)` override (duration + timing-function, NEVER `animation-name` — the UA rect-morph IS the free FLIP; omitting it ships the 250ms/ease temporal incoherence). Re-targets the SAME `compileChild` pipeline via the VT-b selector-factory seam. Refuses with the CC-3 four ∪ `vt-scroll-grammar`/`vt-element-scoped-computed`/`vt-snapshot-inapplicable`/`vt-name-collision`; `test/compile/view-transition-roundtrip.test.ts`, run through `demo:correctness`, checks the browser structure and settled rect. |
| `compileToEntry` | HEAVY | [README §compileToEntry](../README.md#compiletoentry) — S.F3 EN-c — `compileToCSS`'s DECLARED-ENDPOINT sibling: compile a selector-keyed `{ enter?, exit? }` spec (2-stop endpoint pairs) → zero-runtime `@starting-style` + `transition-behavior: allow-discrete` CSS over the three-rule grammar (base/closed + open + `@starting-style`). Asymmetric entry/exit ride the two lists; `display`/`overlay <dur> allow-discrete` ride BOTH; spring `linear()`s verbatim; color endpoints canonicalize to `oklab()` (the `perceptual-oklab` refusal INVERTED — native Oklab, NO densify, ZERO stops). A `format.ts`-substrate projection, NOT a `compileToCSS` post-transform (refuted by P2-2's mixed-track bug). Refuses with 3 inherited + 6 entry-specific (`entry-multi-keyframe`/`entry-iteration`/`entry-composition`/`entry-scroll-grammar`/`entry-color-space`/`entry-easing-twin`); `test/compile/entry-roundtrip.test.ts`, run through `demo:correctness`, checks scrub-based S1–S7 in Chromium. Unshippable until S.B3 lands EN-a (the `serializeEasing` CSS-twin fix). |

### L.W6 AGENT-AUTHORING — the round-trip's FORWARD half (the validation layer)

The agent-authoring verb (`src/animation/validate.ts`, HEAVY — it statically
imports the engine + compile + waapi, all value.js-bearing). `validate(css, opts?)`
is the FORWARD direction of the moat — not a new direction but the VALIDATION
layer over the compile surface, the first question an LLM agent asks before it
suggests kf at all: "will this `@keyframes` block ship faithfully?" It is a
READ-ONLY projection over three already-tested typed channels — the adapter's
`diagnostics` (`resolveKeyframes`), the compiler's `{ eligible, refusals }`
(`compileToCSS`), and the WAAPI `eligibility` (`isWAAPIEligible`) — onto ONE flat,
agent-shaped `ValidateResult` envelope an LLM branches on WITHOUT scraping a
message string. NO new engine code, NO new drop-diagnostic: it READS the channels
L.W1/L.W2 already made honest. `explain(css, opts?)` formats the SAME verdict as a
DETERMINISTIC human/LLM-readable string (field order fixed, byte-stable for a
doctest). The verb is covered by `test/compile/agent-validate.test.ts`
clause (c) the spec-faithful @property/!important verdict / (d) the multi-color
perceptual-oklab refusal), and the `/llms.txt` "Agent authoring loop" section
teaches the validate→fix→compile LOOP (generated, never hand-edited).

| Export     | Tier  | Taught                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ---------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `validate` | HEAVY | manifest-only: L.W6 S1 — the READ-ONLY projection over the adapter `diagnostics` / compile `{ eligible, refusals }` / WAAPI `eligibility` channels onto ONE flat `ValidateResult` envelope (`{ parseable, eligible, refusals, diagnostics, waapi }`) an LLM agent branches on without scraping a message; a pure JOIN, no new engine code; `test/compile/agent-validate.test.ts` clause (c)/(d)                                                                                       |
| `explain`  | HEAVY | manifest-only: L.W6 S2 — the human/LLM-readable companion; formats `validate`'s typed result as a DETERMINISTIC string (field order fixed, byte-stable for a doctest) — the demo's ineligibility panel as a first-class library API, the surface the `/llms.txt` "Agent authoring loop" section links; `test/compile/agent-validate.test.ts` clause (d)                                                                                                                             |
| `CSSKeyframesToString`     | HEAVY | manifest-only: L.W8 S1 ED-3 — re-serialize a parsed `Animation` back to ONE CSS `@keyframes` block (the FORWARD half of `fromString`, value.js `formatCSS`-bearing); the demo's "Export CSS" + keyframe-string panels consume it through `loadAnimationEngine()` after the dogfood inversion. The inversion is covered by `proof:publish` and `demo:correctness`. |
| `CSSKeyframesToStrings`    | HEAVY | manifest-only: L.W8 S1 ED-3 — per-DECLARED-template-stop serialization (index-aligned with `templateFrames`), the card-list authority; same value.js `formatCSS` pipeline as `CSSKeyframesToString`. Reached only via `loadAnimationEngine()`; covered by `proof:publish` and `demo:correctness`. |
| `formatCSSKeyframeString`  | HEAVY | manifest-only: L.W8 S1 ED-3 — trim ONE keyframe body (strip the selector + leading indent) for display; the pure-string companion of the serializers, surfaced on the heavy chunk beside them; covered by `proof:publish` and `demo:correctness`. |
| `transformTargetsStyle`    | HEAVY | manifest-only: L.W8 S1 ED-3 — paint a `Vars` snapshot directly onto DOM targets' inline style (the SAME painter `Animation.interpFrames`/the run loop drives); the matrix-editor's one-shot transform paint consumes it through `loadAnimationEngine()`; covered by `proof:publish` and `demo:correctness`. |
| `yieldToMain`              | HEAVY | manifest-only: L.W8 S1 ED-3 — the engine's ONE INP-relief yield ladder (`scheduler.yield` probe + cached fallback, value.js-free); surfaced on the heavy chunk so a consumer batching keyframe ops yields with the SAME ladder rather than hand-rolling one; covered by `proof:publish` and `demo:correctness`. |

## EP-3 — the live-coverage disposition (J.W4 S7 · the uncovered-export BOOK)

`engine-periphery.md` EP-3: `flip`/`flipShared`, `drag`/`Draggable`, and
`DrawSVG`/`fromDrawSVG` are load-bearing, README-taught, unit-tested exports
with **no demo scene** — zero live-session runtime coverage. Per the
J.W4 spec's binding decision they take **PATH B — the recorded BOOK**: each is
documented here with its cited unit coverage and its no-live-scene status
DISCLOSED (this is the terminal disposition per P-invariant-28, not a punt; if
a future wave lands a befitting demo scene, that export flips to PATH A and
joins the every-scene sweep automatically via the scenes.ts roster). This
table is machine-checked by `proof:publish`: every EP-3
export below must carry a disposition row whose cited test file EXISTS.

| Export        | Disposition                    | Coverage (cited)                                                                                   |
| ------------- | ------------------------------ | -------------------------------------------------------------------------------------------------- |
| `flip`        | PATH B — no live-session scene | `test/orchestration/flip.test.ts` (unit, vitest/jsdom)                                                           |
| `flipShared`  | PATH B — no live-session scene | `test/orchestration/flip.test.ts` (unit, vitest/jsdom)                                                           |
| `drag`        | PATH B — no live-session scene | `test/physics/drag.test.ts` (unit, vitest/jsdom)                                                           |
| `Draggable`   | PATH B — no live-session scene | `test/physics/drag.test.ts` (unit, vitest/jsdom)                                                           |
| `DrawSVG`     | PATH B — no live-session scene | `test/svg/draw-svg.test.ts` (Vitest/jsdom) |
| `fromDrawSVG` | PATH B — no live-session scene | `test/svg/draw-svg.test.ts` (Vitest/jsdom) |
| `MorphSVG`     | PATH B — no live-session scene | `test/svg/morph-svg.test.ts` (Vitest/jsdom) |
| `fromMorphSVG` | PATH B — no live-session scene | `test/svg/morph-svg.test.ts` (Vitest/jsdom) |

## Structural conventions (retired gate recorded)

**The test-area mirror convention.** Library test areas under `test/` mirror the
`src/animation/` zone layout — each non-infrastructure test directory maps to an
animation zone, and root-module tests live in `test/_root`. This was formerly
enforced by `test/support/mirror.test.ts`, a topology-only assertion
(`readdirSync` over `test/` vs `src/animation/`, exercising zero runtime
behavior) pruned at V.W4 (commit `fe42c6f9`, per TC-4/LT-02a/XB-04). The
convention now survives as this documented expectation rather than a gated test.
