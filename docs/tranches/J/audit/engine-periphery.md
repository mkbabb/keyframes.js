# Engine Periphery Audit — Tranche J

**Lane:** engine-periphery  
**Date:** 2026-06-09  
**Branch audited:** tranche-i-dev (post-Tranche-I close)  
**Auditor:** J-deep-audit agent

---

## Scope

`src/animation/{timeline,smooth,morph,numeric,waapi,animations,constants,utils,adapter,animate,decay,drag,draw-svg,easing,flip,motion-path,sequence,spring,springLinearStops,springTimingFunction,stagger}.ts` plus `src/animation/internal/`.

---

## §1 — Load-bearing status of each module

All 21 in-scope modules are **load-bearing** — every one is either statically exported from the barrel (`index.ts`) or reachable behind `loadAnimationEngine()`, and has at least one test file. No speculative/dead code.

| Module | Barrel export type | Demo consumer | Tests |
|---|---|---|---|
| `timeline.ts` | LIGHT static | `useMotionPathGesture.ts` | `timeline.test.ts`, `timeline-undo.test.ts` |
| `smooth.ts` | LIGHT static | `Timeline` composes it | `smooth.test.ts` |
| `spring.ts` | LIGHT static | `useSceneSwap.ts`, `useSquareAnimations.ts`, `useSpringDemo.ts` | `spring.test.ts` |
| `springLinearStops.ts` | LIGHT static | `useSpringLinearStops.ts` | `springLinearStops.test.ts` |
| `springTimingFunction.ts` | LIGHT static | `useSequenceDemo.ts` | `springTimingFunction.test.ts` |
| `morph.ts` | LIGHT static | composed via `flip.ts` | `morph.test.ts` |
| `numeric.ts` | LIGHT static | `ElementMorph` composes it | `numeric.test.ts` |
| `stagger.ts` | LIGHT static | `useSequenceDemo.ts` | `stagger.test.ts` |
| `flip.ts` | LIGHT static | **no demo consumer** (see EP-3) | `flip.test.ts` |
| `drag.ts` | LIGHT static | **no demo consumer** (see EP-3) | `drag.test.ts` |
| `decay.ts` | LIGHT static | `useSphereSpin.ts` (amiga) | (via `orbital-inertia-parity.test.ts`) |
| `sequence.ts` | LIGHT static | `useSequenceDemo.ts` | `sequence.test.ts`, `sequence-transport.test.ts` |
| `easing.ts` | LIGHT static | indirect | `resolve-easing.test.ts` |
| `waapi.ts` | HEAVY (in engine chunk) | engine-internal | `waapi-lifecycle.test.ts` |
| `adapter.ts` | HEAVY (in engine chunk) | engine-internal | `adapter-capture.test.ts` |
| `animate.ts` | HEAVY (behind `loadAnimationEngine`) | no direct demo (pattern: `new CSSKeyframesAnimation`) | `animate.test.ts` |
| `motion-path.ts` | HEAVY (behind `loadAnimationEngine`) | `useMotionPathGesture.ts` (via `fromMotionPath`) | `motion-path.test.ts` |
| `draw-svg.ts` | HEAVY (behind `loadAnimationEngine`) | **no demo consumer** (see EP-3) | `draw-svg.test.ts` |
| `animations.ts` | HEAVY (behind `loadAnimationEngine().presets`) | `useCubeAnimations.ts`, `usePlaygroundAnimations.ts` | `presets.test.ts` |
| `constants.ts` | TYPE surface (static, erased) | engine-internal | (covered transitively) |
| `utils.ts` | HEAVY (engine-internal) | engine-internal | `frame-compiler.test.ts`, others |

---

## §2 — Spring module triad: duplication audit

Three spring files exist: `spring.ts`, `springLinearStops.ts`, `springTimingFunction.ts`. This is intentional and NOT duplication:

- `spring.ts` — the **live ODE integrator** (`SpringProgress`): solver state, `tickDt`, `subscribe`, `play`. The runtime physics core.
- `springLinearStops.ts` — **CSS emission**: runs the solver once, samples 24 stops, emits a `linear()` string. For stylesheets/tokens.
- `springTimingFunction.ts` — **typed `Easing` emission**: runs the solver once, samples 64 points into a `Float64Array` lookup table, returns `{ fn, css }`. For in-code easing + WAAPI delegation.

The distinction is real, documented, and each serves a different consumer class. No merger candidate.

**One P2 issue exists** in this triad — see EP-2 below.

---

## §3 — Per-module quality findings

### `sequence.ts` — inline `prefersReducedMotion` (EP-1)

`sequence.ts:621-628` contains a LOCAL inline `prefersReducedMotion()` probe rather than importing from `internal/reduced-motion.ts`. The module's docstring justifies this at line 622-623: "Inlined (not imported from `internal/reduced-motion`) to keep the dependency surface to the two light modules the docstring names."

`internal/reduced-motion.ts` carries ZERO `@mkbabb/value.js` edge — it is a light module. The `proof:boundary` gate verifies static edges per light entry, and `internal/reduced-motion` ALREADY appears in the static graph of `spring.ts`/`smooth.ts` (which import `withReducedMotion`). The justification is therefore weak: importing `prefersReducedMotion` from `internal/reduced-motion` would NOT add a new static edge to the sequence entry's module set — `internal/reduced-motion` is already a transitive leaf in the light graph.

The inline also diverges from the shared ONE gate (`internal/reduced-motion.ts:57` exports `prefersReducedMotion`; `withReducedMotion` is the full gate). The `Sequence` uses only the bare boolean test (not `withReducedMotion`), which is a valid but minimal interface. More critically, the inline misses the module-level `MediaQueryList` singleton optimization in `internal/reduced-motion.ts` (it calls `matchMedia` directly each time via the inline `matchMedia("(prefers-reduced-motion: reduce)").matches`), creating a live-query handle allocation on every `play()` call under `respectReducedMotion=true`.

Evidence: `sequence.ts:350,626-628`; `internal/reduced-motion.ts:29-59`.

### `springTimingFunction.ts` — CSS twin `sampleCount` not forwarded (EP-2)

`springTimingFunction` accepts `sampleCount` (default 64, for the JS `fn`). When building the CSS twin via `springLinearStops`, `sampleCount` is NOT forwarded to `stopOpts` (lines 112-118). Result: a caller passing `springTimingFunction({ ..., sampleCount: 200 })` gets a 200-point JS lookup table but a 24-stop CSS twin (the `springLinearStops` default). The JS and CSS curves sample the same solver at different resolutions when the user overrides `sampleCount`.

This is a minor divergence: the curves converge on the same mathematical curve but with different sample-density fidelity. The CSS twin is always the lower-resolution version when `sampleCount > 24`. The docstring at line 21-23 explains the deliberate 64-vs-24 DEFAULT asymmetry (CSS `linear()` consumed at sub-pixel cadence), but it does not address the explicit-override case.

Evidence: `springTimingFunction.ts:112-119`; `springLinearStops.ts:6-31`.

### `animations.ts` — `flip` name collision with `flip.ts` (EP-4)

`animations.ts:123` exports `const flip` (a CSS 3D rotation preset). `flip.ts:108` exports `function flip` (the FLIP layout-animation technique). The static barrel exports the LAYOUT `flip` from `flip.ts:64`. The CSS rotation `flip` is only accessible as `(await loadAnimationEngine()).presets.flip()`.

These are disambiguated by access path (static barrel vs `presets` namespace) so there is no TypeScript conflict. However, a library consumer who imports `flip` from the static barrel receives the layout-animation technique, not the CSS rotation, and the `presets.flip` is visually named the same. No documentation calls this out explicitly.

Evidence: `animations.ts:123`; `flip.ts:108`; `index.ts:64`.

---

## §4 — CLAUDE.md doc-rot: root vs reality

### Root `CLAUDE.md` animation/ tree is severely stale (EP-5)

The root `CLAUDE.md:19-29` lists the `animation/` subtree as 10 files. The actual tree has **~28 source files** (plus 5 in `internal/`). Missing entirely from the root listing:

```
engine.ts, playback.ts, frame-compiler.ts, format.ts, easing.ts,
spring.ts, springLinearStops.ts, springTimingFunction.ts, adapter.ts,
animate.ts, decay.ts, drag.ts, draw-svg.ts, flip.ts, motion-path.ts,
sequence.ts, stagger.ts
internal/{leaves,binarySearch,errors,reduced-motion,scheduler}.ts
```

The root CLAUDE.md says `index.ts` is "Animation, CSSKeyframesAnimation classes" — this is wrong: `index.ts` is the package barrel (light/heavy boundary), not a class file. The classes live in `engine.ts` (which is not listed at all).

The root `CLAUDE.md:90` "Primary exports" list is also stale:

> `Animation, CSSKeyframesAnimation, AnimationGroup, NumericAnimation, SmoothProgress, ElementMorph, Timeline, ScrollTimeline, ManualTimeline, getAnimationId`

Missing light exports: `SpringProgress`, `springLinearStops`, `springTimingFunction`, `RAFPlayback`, `stagger`, `flip`, `flipShared`, `drag`, `Draggable`, `decay`, `decayRest`, `Sequence`, `resolveEasing`, `toEasing`, `createNativeTimeline`, `AnimationOptionError`, `UnknownEasingError`.

`getAnimationId` in this list is misleading — it is NOT a static barrel export; it is ONLY available via `(await loadAnimationEngine()).getAnimationId`. The static barrel never exports it by name.

The `animation/CLAUDE.md` IS current and accurate — the sub-CLAUDE.md is authoritative. The root CLAUDE.md tree is a stale pre-E skeleton.

Evidence: `CLAUDE.md:19-29,90`; `src/animation/index.ts` (37 `export` lines); actual `ls src/animation/`.

---

## §5 — Documented BOOKs status

### `managed-pause contract` — PRESENT

The managed-pause contract (E-BOOK-1) is documented in full at `src/animation/CLAUDE.md` under "Managed-child lifecycle (the one contract, stated once)". The contract covers: `managed=true` at attach, group owns the loop, child throws on direct `play()`, pause records the last rAF timestamp on each child's `pausedTime`, resume un-pauses children directly (not via `child.resume()` to avoid race), `settle()` releases via `managed=false`. This is the authoritative single-statement location as E.W5 required.

Evidence: `src/animation/CLAUDE.md:§Managed-child lifecycle`.

### `tryParseCache eviction` — PRESENT (recorded-withheld BOOK)

The `tryParseCache` eviction is a CHRONIC-WITHHELD value.js-HANDOFF (the C-3 item from `docs/tranches/G/audit/a-deferred-ledger.md:102`). The cache at `utils.ts:203` remains unbounded. The BOOK status is carried forward: the eviction policy belongs ONCE in value.js's `memoize` (F3 LRU); no kf-side second policy (DRY). This is correctly left as-is: no measure-first bench showing editor-keystroke memory footprint has been authored (the re-open trigger).

Evidence: `src/animation/utils.ts:203`; `docs/tranches/G/audit/a-deferred-ledger.md:102`; `docs/tranches/I/FINAL.md:198-201`.

### `animation-composition` — PRESENT

`adapter.ts:24-29` captures `animation-composition` per-keyframe from value.js (F.W8 change), correctly noted as "Captured (F.W8); honoring it (→ WAAPI `composite` / rAF accumulate) is BOOKed, not half-wired." The BOOK is correctly deferred.

Evidence: `src/animation/adapter.ts:24-29`.

---

## §6 — Modules with no demo consumer (EP-3)

Three load-bearing, tested modules have no current demo scene that exercises them at runtime:

| Module | Barrel export | Tests | Demo consumer |
|---|---|---|---|
| `flip.ts` (`flip`, `flipShared`) | LIGHT static | `flip.test.ts` | None — no demo scene |
| `drag.ts` (`drag`, `Draggable`) | LIGHT static | `drag.test.ts` | None — demo uses custom `useDragScrub` (raw pointer events) |
| `draw-svg.ts` (`DrawSVG`, `fromDrawSVG`) | HEAVY / `loadAnimationEngine` | `draw-svg.test.ts` | None — no demo scene |

These are NOT dead (all are exported, tested, and have real use-cases), but they lack a proof:live-session surface. The gate-oracle precept (the I-born charter invariant) requires product-property proofs through the human's surface — these three modules have zero runtime demo coverage. `proof:drawsvg` exists in `scripts/proof-drawsvg.mjs` but it is a JSDOM-based unit test, not a live browser exercise; whether it is labeled HYGIENE-tier needs verification.

Evidence: `src/animation/index.ts:64-70,110`; `demo/` grep output (no flip/Draggable/DrawSVG scene imports); `package.json:41` for `proof:drawsvg`.

---

## §7 — `decay.ts` value.js-HANDOFF note

`decay.ts:17-18` carries: "A richer canonical closed form is the value.js hand-off VJ-1; `decay` ships keyframes-local today and collapses to a thin caller once value.js publishes the canonical surface."

VJ-1 status from `docs/tranches/I/audit/recap-deferred.md:101`: OPEN, not yet shipped in value.js. The kf-local `decay.ts` is the correct interim. No action needed for J unless VJ-1 lands.

Evidence: `src/animation/decay.ts:17-18`; `docs/tranches/I/audit/recap-deferred.md:101`.

---

## Summary of findings

| ID | Severity | Title | Disposition |
|---|---|---|---|
| EP-1 | P2 | `sequence.ts` inlines `prefersReducedMotion()` instead of using shared `internal/reduced-motion` gate — misses the singleton optimization | FOLD |
| EP-2 | P2 | `springTimingFunction` does not forward `sampleCount` to CSS twin `springLinearStops` — explicit consumer overrides get lower-res CSS twin | FOLD |
| EP-3 | P1 | `flip.ts`, `drag.ts`, `draw-svg.ts` have no live demo scene — zero proof:live-session runtime coverage | FOLD |
| EP-4 | P2 | `flip` name collision: static barrel exports layout-FLIP fn; `presets.flip` is a CSS rotation preset — undocumented naming hazard | BOOK |
| EP-5 | P1 | Root `CLAUDE.md` animation/ subtree is stale (10-entry skeleton, missing 18+ modules, wrong `index.ts` description, stale primary-exports list, `getAnimationId` claimed as static export) | FOLD |
