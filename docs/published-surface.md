# The published surface — the documented-surface manifest

The authoritative roster of every public **value** export of
`@mkbabb/keyframes.js` (the `src/animation/index.ts` barrel): its tier —
**LIGHT** (static named export, zero value.js edge) or **HEAVY** (reached only
through `loadAnimationEngine()`, the `AnimationEngine` keys) — and where the
README teaches it. Type-only exports are erased at build and carry no runtime
surface, so they do not appear here.

This file is **machine-checked** by `proof:published-surface` clause (b)
(`scripts/proof-published-surface.mjs`): every public export must be either
README-taught or enumerated below, and a row naming a non-existent export
fails the gate — the roster cannot go stale against the source in either
direction. Row contract: first cell the backticked export name, second its
tier, third its README anchor (or a `manifest-only: <reason>` note).

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
| `KeyframesScrollTimeline` | LIGHT | [README §Timeline](../README.md#timeline) — L.W8 S4 PKG-3 — the canonical name of the JS scroll-progress sampler (renamed from `ScrollTimeline` to clear the `globalThis.ScrollTimeline` d.ts collision; `proof:pkg3-clean`). The `ScrollTimeline` backward-compat alias was DROPPED in 5.0.0 (Q.WE1 — NO-LEGACY).                                                                                                                          |
| `ManualTimeline`       | LIGHT | [README §Timeline](../README.md#timeline)                                                                                                                                                                                                                                                                                                                                                                                                 |
| `createNativeTimeline` | LIGHT | [README §Timeline](../README.md#timeline) — the native scroll/view-timeline fast lane (feature-detected, `null` off-platform)                                                                                                                                                                                                                                                                                                             |
| `RAFPlayback`          | LIGHT | [README §RAFPlayback](../README.md#rafplayback)                                                                                                                                                                                                                                                                                                                                                                                           |
| `Oscillator`           | LIGHT | manifest-only: L.W9 S5 KF-OSCILLATOR (W128) — a periodic phase clock (`{ frequency, waveform }` → phase ∈ [0,1)); `tick(dt)` advances the linear phase ramp by `frequency × dt` (caller-driven, no rAF ownership — mirrors `SmoothProgress`/`SpringProgress`), `sample(t)` is the pure `t → waveform(t × frequency)` map. Value.js-free (no CSS parsing); glass-ui BB `W-EASING-PRIMITIVE` + the demo KF-OSCILLATOR scene consume it. `proof:boundary` (CORE LIGHT entry). |
| `waveformValue`        | LIGHT | manifest-only: L.W9 S5 — the value.js-free waveform shaper leaf of `Oscillator` (`phase ∈ ℝ → value ∈ [-1,1]` for `sine`/`triangle`/`square`/`sawtooth`, the phase reduced to its fractional cycle position); a consumer can apply it to its own phase without constructing an `Oscillator`. `proof:boundary`. |
| `stagger`              | LIGHT | [README §stagger](../README.md#stagger)                                                                                                                                                                                                                                                                                                                                                                                                   |
| `flip`                 | LIGHT | [README §flip / flipShared](../README.md#flip--flipshared)                                                                                                                                                                                                                                                                                                                                                                                |
| `flipShared`           | LIGHT | [README §flip / flipShared](../README.md#flip--flipshared)                                                                                                                                                                                                                                                                                                                                                                                |
| `drag`                 | LIGHT | [README §drag / Draggable](../README.md#drag--draggable)                                                                                                                                                                                                                                                                                                                                                                                  |
| `Draggable`            | LIGHT | [README §drag / Draggable](../README.md#drag--draggable) — the class form behind `drag()`                                                                                                                                                                                                                                                                                                                                                 |
| `drag2D`               | LIGHT | manifest-only: L.W5 S4 — the single-call 2-D drag sugar over two one-axis `Draggable`s (`{x,y}` options pass `bounds`/`snap`/`rubberBand` through per-axis); a shared subscriber emits `(x,y,vx,vy)`, one `dispose()` tears down both. KISS: the 1-D engine stays 1-D. Returns a `Drag2DHandle`.                                                                                                                                            |
| `decay`                | LIGHT | [README §decay / decayRest](../README.md#decay--decayrest)                                                                                                                                                                                                                                                                                                                                                                                |
| `decayRest`            | LIGHT | [README §decay / decayRest](../README.md#decay--decayrest)                                                                                                                                                                                                                                                                                                                                                                                |
| `Sequence`             | LIGHT | [README §Sequence](../README.md#sequence)                                                                                                                                                                                                                                                                                                                                                                                                 |
| `loadAnimationEngine`  | LIGHT | [README §The dynamic engine](../README.md#the-dynamic-engine--loadanimationengine) — the one gateway to the HEAVY tier                                                                                                                                                                                                                                                                                                                    |
| `warmEngine`           | LIGHT | manifest-only: L.W7 S1 — fire-and-forget idle-warmer; pre-flights `loadAnimationEngine()`'s dynamic import (during `requestIdleCallback` / `visibilitychange` / `mouseenter`) so the first `.animate()` on a cold page resolves against an already-in-flight Promise. Shares the one memoized `_enginePromise` (no double import); adopts `scheduler.postTask("background")` when available. Value.js-free (fires a dynamic import only). |
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
| `KeyframesAnimation`    | HEAVY | [README §Animation](../README.md#animation) — L.W8 S4 PKG-3 — the canonical name of the core engine class (renamed from `Animation` to clear the `globalThis.Animation` d.ts collision; `proof:pkg3-clean`). `CSSKeyframesAnimation` extends it. The `Animation` backward-compat alias was DROPPED in 5.0.0 (Q.WE1 — NO-LEGACY). |
| `CSSKeyframesAnimation` | HEAVY | [README §CSSKeyframesAnimation](../README.md#csskeyframesanimation)                                                                                        |
| `AnimationGroup`        | HEAVY | [README §AnimationGroup](../README.md#animationgroup)                                                                                                      |
| `animate`               | HEAVY | [README §animate](../README.md#animate) — the single-call front door                                                                                       |
| `MotionPath`            | HEAVY | [README §MotionPath](../README.md#motionpath)                                                                                                              |
| `fromMotionPath`        | HEAVY | [README §MotionPath](../README.md#motionpath)                                                                                                              |
| `DrawSVG`               | HEAVY | [README §DrawSVG](../README.md#drawsvg)                                                                                                                    |
| `fromDrawSVG`           | HEAVY | [README §DrawSVG](../README.md#drawsvg)                                                                                                                    |
| `MorphSVG`              | HEAVY | [README §MorphSVG](../README.md#morphsvg)                                                                                                                  |
| `fromMorphSVG`          | HEAVY | [README §MorphSVG](../README.md#morphsvg)                                                                                                                  |
| `presets`               | HEAVY | [README §Presets](../README.md#presets)                                                                                                                    |
| `getAnimationId`        | HEAVY | [README §The dynamic engine](../README.md#the-dynamic-engine--loadanimationengine) — stable string id for an `Animation` (or passthrough)                  |
| `getTimingFunction`     | HEAVY | [README §The dynamic engine](../README.md#the-dynamic-engine--loadanimationengine) — easing name/literal → `TimingFunction` (the value.js registry lookup) |
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
manifest-only + gate-covered (`proof:ingest-replay` — the forward-direction
replay-equality oracle; the value proof `test/ingest.test.ts`).

| Export                 | Tier  | Taught                                                                                                                                                                                                                                                                                                         |
| ---------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fromStyleSheets`      | HEAVY | manifest-only: K.W8 K1 — walk the document's (or a given list's) stylesheets → a `Map<name, CSSKeyframesAnimation>` of reconstructed animations + the CORS-skip diagnostics; `proof:ingest-replay` + `test/ingest.test.ts` clause (a)/(b)/(d)                                                                  |
| `fromLiveAnimations`   | HEAVY | manifest-only: K.W8 K1 — narrow to the names currently RUNNING via `getAnimations()`, reconstructed from their source `@keyframes` rule (NOT the lossy computed `getKeyframes()`); `proof:ingest-replay` + `test/ingest.test.ts`                                                                               |
| `resolveLiveKeyframes` | HEAVY | manifest-only: K.W8 K1 — the lowest-level CSSOM walk (the live-CSSOM analogue of `resolveKeyframes`); per-sheet `try/catch` → a `CORS_SKIP` diagnostic, never a silent drop; `proof:ingest-replay` + `test/ingest.test.ts` clause (d)                                                                          |
| `adoptRunning`         | HEAVY | manifest-only: K.W8 K2 — the mid-flight takeover of a running CSS animation (`getAnimations()` currentTime handoff + commit-on-adopt + the continuity seed); named `adoptRunning` to disambiguate from `engine.adoptCompiled` (HARDENING-5 HAZARD-1); `proof:ingest-replay` + `test/ingest.test.ts` clause (c) |

### K.W9 SCROLL-AS-CSS — the scroll-grammar round-trip + `ScrollScene` driver

The scroll-driven-animation surface (`src/animation/scroll-scene.ts`, HEAVY — it
consumes value.js 0.13.0's typed `CSSTimelineOptions` scroll grammar). kf PARSES
the `animation-timeline`/`-range`/`timeline-scope`/`-trigger` the CSS WG
standardized, DRIVES it on the compositor where eligible (native `ScrollTimeline`)
and on its shipped physics where not (the JS `ScrollScene`: `SmoothProgress`
scrub + `decayRest`/`SpringProgress` snap), and SERIALIZES it BACK to valid CSS —
the only library that round-trips a scroll-driven stylesheet. value.js owns the
scroll VALUES; the `ScrollScene` driver owns TIME. Each row is manifest-only +
gate-covered (`proof:scroll-roundtrip` — the replay-equality oracle + the
dispatch matrix + the `position:sticky` pin assert; the value proof
`test/scroll-scene.test.ts`); the SO-4 transform-pinning primitive is KILLED
(cross-thread jitter — the pin is `position:sticky` synthesis only).

| Export                   | Tier  | Taught                                                                                                                                                                             |
| ------------------------ | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ScrollScene`            | HEAVY | manifest-only: the JS scroll driver (scrub/snap/enter-leave over a parsed `animation-range`); `proof:scroll-roundtrip` + `test/scroll-scene.test.ts` clause (a)/(e)                |
| `createScrollScene`      | HEAVY | manifest-only: construct a `ScrollScene` from parsed `CSSTimelineOptions` or a spec; `proof:scroll-roundtrip` + `test/scroll-scene.test.ts` clause (a)                             |
| `parseScrollCSS`         | HEAVY | manifest-only: SO-1 PARSE — a scroll-driven stylesheet → typed `CSSTimelineOptions` (consumes value.js `extractTimelineOptions`); `proof:scroll-roundtrip` clause (b)              |
| `parseScrollTimeline`    | HEAVY | manifest-only: parse one `animation-timeline` value (value.js `parseAnimationTimeline` pass-through); `proof:scroll-roundtrip` clause (b)                                          |
| `parseScrollRange`       | HEAVY | manifest-only: parse one `animation-range` shorthand (value.js `parseAnimationRange` pass-through); `proof:scroll-roundtrip` clause (b)                                            |
| `serializeScrollOptions` | HEAVY | manifest-only: SO-1 SERIALIZE — typed `CSSTimelineOptions` → CSS longhands (value.js `serializeTimelineOptions`); `proof:scroll-roundtrip` clause (b)                              |
| `roundTripScrollCSS`     | HEAVY | manifest-only: the full `parse → serialize` round-trip (the replay-equality oracle); `proof:scroll-roundtrip` clause (b)                                                           |
| `dispatchScrollBackend`  | HEAVY | manifest-only: the conservative-correct native-vs-JS dispatch with a queryable reason (the `waapiIneligibleReason` idiom on the scroll clock); `proof:scroll-roundtrip` clause (c) |
| `resolveRange`           | HEAVY | manifest-only: resolve a parsed `animation-range` to `[start,end]` scroll-extent fractions (the driver's TIME-side fill); `proof:scroll-roundtrip` clause (b)                      |
| `pinCSS`                 | HEAVY | manifest-only: SO-3 the `position:sticky` pin synthesis (SO-4 transform-pinning KILLED); `proof:scroll-roundtrip` clause (d)                                                       |

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
(CC-4) makes the demo a CSS-animation IDE. The row is manifest-only + gate-covered
(`proof:compile-replay` — the backward-direction replay-equality oracle; the value
proof `test/compile-roundtrip.test.ts`).

| Export         | Tier  | Taught                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `compileToCSS` | HEAVY | manifest-only: K.W10 CC-1/CC-2/CC-3 — compile an `AnimationGroup`/`Sequence`/child list → a zero-runtime CSS artifact (`@keyframes` + `animation-*` longhands + `animation-composition` layering + `linear()` springs + materialized stagger delays + perceptual `oklab()` densify) + the four CC-3 refusals (the `{ css, eligible, refusals }` trust surface); the parser run BACKWARD over the SAME data model; `proof:compile-replay` + `test/compile-roundtrip.test.ts` clause (a)/(b)/(c)/(d) |

### L.W6 AGENT-AUTHORING — the round-trip's FORWARD half (the validation layer)

The agent-authoring verb (`src/animation/validate.ts`, HEAVY — it statically
imports the engine + compile + waapi, all value.js-bearing). `validate(css, opts?)`
is the FORWARD direction of the moat — not a new direction but the VALIDATION
layer over the compile surface, the first question an LLM agent asks before it
suggests kf at all: "will this `@keyframes` block ship faithfully?" It is a
READ-ONLY projection over three already-gate-proven typed channels — the adapter's
`diagnostics` (`resolveKeyframes`), the compiler's `{ eligible, refusals }`
(`compileToCSS`), and the WAAPI `eligibility` (`isWAAPIEligible`) — onto ONE flat,
agent-shaped `ValidateResult` envelope an LLM branches on WITHOUT scraping a
message string. NO new engine code, NO new drop-diagnostic: it READS the channels
L.W1/L.W2 already made honest. `explain(css, opts?)` formats the SAME verdict as a
DETERMINISTIC human/LLM-readable string (field order fixed, byte-stable for a
doctest). The verb is gate-covered (`proof:agent-validate` + `test/agent-validate.test.ts`
clause (c) the spec-faithful @property/!important verdict / (d) the multi-color
perceptual-oklab refusal), and the `/llms.txt` "Agent authoring loop" section
teaches the validate→fix→compile LOOP (generated, never hand-edited).

| Export     | Tier  | Taught                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ---------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `validate` | HEAVY | manifest-only: L.W6 S1 — the READ-ONLY projection over the adapter `diagnostics` / compile `{ eligible, refusals }` / WAAPI `eligibility` channels onto ONE flat `ValidateResult` envelope (`{ parseable, eligible, refusals, diagnostics, waapi }`) an LLM agent branches on without scraping a message; a pure JOIN, no new engine code; `proof:agent-validate` + `test/agent-validate.test.ts` clause (c)/(d)                                                                                       |
| `explain`  | HEAVY | manifest-only: L.W6 S2 — the human/LLM-readable companion; formats `validate`'s typed result as a DETERMINISTIC string (field order fixed, byte-stable for a doctest) — the demo's ineligibility panel as a first-class library API, the surface the `/llms.txt` "Agent authoring loop" section links; `proof:agent-validate` + `test/agent-validate.test.ts` clause (d)                                                                                                                             |
| `CSSKeyframesToString`     | HEAVY | manifest-only: L.W8 S1 ED-3 — re-serialize a parsed `Animation` back to ONE CSS `@keyframes` block (the FORWARD half of `fromString`, value.js `formatCSS`-bearing); the demo's "Export CSS" + keyframe-string panels consume it through `loadAnimationEngine()` after the dogfood inversion. `proof:demo-on-published-surface` (KFVUE_INVERSION_LANDED) |
| `CSSKeyframesToStrings`    | HEAVY | manifest-only: L.W8 S1 ED-3 — per-DECLARED-template-stop serialization (index-aligned with `templateFrames`), the card-list authority; same value.js `formatCSS` pipeline as `CSSKeyframesToString`. Reached only via `loadAnimationEngine()`. `proof:demo-on-published-surface` |
| `formatCSSKeyframeString`  | HEAVY | manifest-only: L.W8 S1 ED-3 — trim ONE keyframe body (strip the selector + leading indent) for display; the pure-string companion of the serializers, surfaced on the heavy chunk beside them. `proof:demo-on-published-surface` |
| `transformTargetsStyle`    | HEAVY | manifest-only: L.W8 S1 ED-3 — paint a `Vars` snapshot directly onto DOM targets' inline style (the SAME painter `Animation.interpFrames`/the run loop drives); the matrix-editor's one-shot transform paint consumes it through `loadAnimationEngine()`. `proof:demo-on-published-surface` |
| `yieldToMain`              | HEAVY | manifest-only: L.W8 S1 ED-3 — the engine's ONE INP-relief yield ladder (`scheduler.yield` probe + cached fallback, value.js-free); surfaced on the heavy chunk so a consumer batching keyframe ops yields with the SAME ladder rather than hand-rolling one. `proof:demo-on-published-surface` |

## EP-3 — the live-coverage disposition (J.W4 S7 · the uncovered-export BOOK)

`engine-periphery.md` EP-3: `flip`/`flipShared`, `drag`/`Draggable`, and
`DrawSVG`/`fromDrawSVG` are load-bearing, README-taught, unit-tested exports
with **no demo scene** — zero `proof:live-session` runtime coverage. Per the
J.W4 spec's binding decision they take **PATH B — the recorded BOOK**: each is
documented here with its cited unit coverage and its no-live-scene status
DISCLOSED (this is the terminal disposition per P-invariant-28, not a punt; if
a future wave lands a befitting demo scene, that export flips to PATH A and
joins the every-scene sweep automatically via the scenes.ts roster). This
table is machine-checked by `proof:published-surface` clause (g): every EP-3
export below must carry a disposition row whose cited test file EXISTS.

| Export        | Disposition                    | Coverage (cited)                                                                                   |
| ------------- | ------------------------------ | -------------------------------------------------------------------------------------------------- |
| `flip`        | PATH B — no live-session scene | `test/flip.test.ts` (unit, vitest/jsdom)                                                           |
| `flipShared`  | PATH B — no live-session scene | `test/flip.test.ts` (unit, vitest/jsdom)                                                           |
| `drag`        | PATH B — no live-session scene | `test/drag.test.ts` (unit, vitest/jsdom)                                                           |
| `Draggable`   | PATH B — no live-session scene | `test/drag.test.ts` (unit, vitest/jsdom)                                                           |
| `DrawSVG`     | PATH B — no live-session scene | `test/draw-svg.test.ts` (unit) + `proof:drawsvg` (JSDOM hygiene gate, `scripts/proof-drawsvg.mjs`) |
| `fromDrawSVG` | PATH B — no live-session scene | `test/draw-svg.test.ts` (unit) + `proof:drawsvg` (JSDOM hygiene gate, `scripts/proof-drawsvg.mjs`) |
| `MorphSVG`     | PATH B — no live-session scene | `test/morph-svg.test.ts` (unit) + `proof:morphsvg-consume` (JSDOM hygiene gate, `scripts/proof-morphsvg-consume.mjs`) |
| `fromMorphSVG` | PATH B — no live-session scene | `test/morph-svg.test.ts` (unit) + `proof:morphsvg-consume` (JSDOM hygiene gate, `scripts/proof-morphsvg-consume.mjs`) |
