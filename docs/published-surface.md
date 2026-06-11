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

| Export | Tier | Taught |
| --- | --- | --- |
| `NumericAnimation` | LIGHT | [README §NumericAnimation](../README.md#numericanimation) |
| `SmoothProgress` | LIGHT | [README §SmoothProgress](../README.md#smoothprogress) |
| `SpringProgress` | LIGHT | [README §SpringProgress](../README.md#springprogress) |
| `springLinearStops` | LIGHT | [README §springLinearStops & springTimingFunction](../README.md#springlinearstops--springtimingfunction) |
| `springTimingFunction` | LIGHT | [README §springLinearStops & springTimingFunction](../README.md#springlinearstops--springtimingfunction) |
| `ElementMorph` | LIGHT | [README §ElementMorph](../README.md#elementmorph) |
| `Timeline` | LIGHT | [README §Timeline](../README.md#timeline) |
| `ScrollTimeline` | LIGHT | [README §Timeline](../README.md#timeline) |
| `ManualTimeline` | LIGHT | [README §Timeline](../README.md#timeline) |
| `createNativeTimeline` | LIGHT | [README §Timeline](../README.md#timeline) — the native scroll/view-timeline fast lane (feature-detected, `null` off-platform) |
| `RAFPlayback` | LIGHT | [README §RAFPlayback](../README.md#rafplayback) |
| `stagger` | LIGHT | [README §stagger](../README.md#stagger) |
| `flip` | LIGHT | [README §flip / flipShared](../README.md#flip--flipshared) |
| `flipShared` | LIGHT | [README §flip / flipShared](../README.md#flip--flipshared) |
| `drag` | LIGHT | [README §drag / Draggable](../README.md#drag--draggable) |
| `Draggable` | LIGHT | [README §drag / Draggable](../README.md#drag--draggable) — the class form behind `drag()` |
| `decay` | LIGHT | [README §decay / decayRest](../README.md#decay--decayrest) |
| `decayRest` | LIGHT | [README §decay / decayRest](../README.md#decay--decayrest) |
| `Sequence` | LIGHT | [README §Sequence](../README.md#sequence) |
| `loadAnimationEngine` | LIGHT | [README §The dynamic engine](../README.md#the-dynamic-engine--loadanimationengine) — the one gateway to the HEAVY tier |
| `resolveEasing` | LIGHT | [README §Beyond CSS](../README.md#beyond-css) intro — async string-name → typed `Easing` (rides the dynamic engine edge) |
| `toEasing` | LIGHT | [README §Beyond CSS](../README.md#beyond-css) intro — sync callable → typed `Easing` normalizer |
| `AnimationOptionError` | LIGHT | [README §AnimationOptions](../README.md#animationoptions) — typed throw on a malformed option (fail-explicit validation) |
| `UnknownEasingError` | LIGHT | [README §Beyond CSS](../README.md#beyond-css) intro — typed throw from `resolveEasing` on an unresolvable name |

## HEAVY — the `AnimationEngine` surface

`const engine = await loadAnimationEngine()` — carries the CSS `@keyframes`
parser and `@mkbabb/value.js`; one dynamic import, cached thereafter
(see [README §The dynamic engine](../README.md#the-dynamic-engine--loadanimationengine)).

| Export | Tier | Taught |
| --- | --- | --- |
| `Animation` | HEAVY | [README §Animation](../README.md#animation) |
| `CSSKeyframesAnimation` | HEAVY | [README §CSSKeyframesAnimation](../README.md#csskeyframesanimation) |
| `AnimationGroup` | HEAVY | [README §AnimationGroup](../README.md#animationgroup) |
| `animate` | HEAVY | [README §animate](../README.md#animate) — the single-call front door |
| `MotionPath` | HEAVY | [README §MotionPath](../README.md#motionpath) |
| `fromMotionPath` | HEAVY | [README §MotionPath](../README.md#motionpath) |
| `DrawSVG` | HEAVY | [README §DrawSVG](../README.md#drawsvg) |
| `fromDrawSVG` | HEAVY | [README §DrawSVG](../README.md#drawsvg) |
| `presets` | HEAVY | [README §Presets](../README.md#presets) |
| `getAnimationId` | HEAVY | [README §The dynamic engine](../README.md#the-dynamic-engine--loadanimationengine) — stable string id for an `Animation` (or passthrough) |
| `getTimingFunction` | HEAVY | [README §The dynamic engine](../README.md#the-dynamic-engine--loadanimationengine) — easing name/literal → `TimingFunction` (the value.js registry lookup) |
| `resolveKeyframes` | HEAVY | [README §The dynamic engine](../README.md#the-dynamic-engine--loadanimationengine) — CSS `@keyframes` text/stylesheet → resolved keyframes |
| `DIRECTIONS` | HEAVY | [README §AnimationOptions](../README.md#animationoptions) — the valid `direction` values, as a const tuple |
| `FILL_MODES` | HEAVY | [README §AnimationOptions](../README.md#animationoptions) — the valid `fillMode` values, as a const tuple |
| `defaultOptions` | HEAVY | [README §AnimationOptions](../README.md#animationoptions) — the `AnimationOptions` defaults |
| `defaultLayerConfig` | HEAVY | [README §AnimationGroup](../README.md#animationgroup) — the per-layer blend-config defaults |

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

| Export | Disposition | Coverage (cited) |
| --- | --- | --- |
| `flip` | PATH B — no live-session scene | `test/flip.test.ts` (unit, vitest/jsdom) |
| `flipShared` | PATH B — no live-session scene | `test/flip.test.ts` (unit, vitest/jsdom) |
| `drag` | PATH B — no live-session scene | `test/drag.test.ts` (unit, vitest/jsdom) |
| `Draggable` | PATH B — no live-session scene | `test/drag.test.ts` (unit, vitest/jsdom) |
| `DrawSVG` | PATH B — no live-session scene | `test/draw-svg.test.ts` (unit) + `proof:drawsvg` (JSDOM hygiene gate, `scripts/proof-drawsvg.mjs`) |
| `fromDrawSVG` | PATH B — no live-session scene | `test/draw-svg.test.ts` (unit) + `proof:drawsvg` (JSDOM hygiene gate, `scripts/proof-drawsvg.mjs`) |
