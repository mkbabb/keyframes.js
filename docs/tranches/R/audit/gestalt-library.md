# Tranche R — Gestalt: The Single Coherent Target Structure for `src/`

**Lane:** `gestalt-library` (synthesis)
**Date:** 2026-06-24
**Branch:** `tranche-r-dev`
**Inputs synthesized:** all 13 `lib-*.md` area lanes + all 6 `retro-*.md` retro lanes.
**Verdict source:** read of the actual tree (`wc -l`, `grep`, `package.json`, `scripts/proof-boundary.mjs`), not the doc claims.

This document resolves the engine god-module + the flat-hyphenated-sibling regression + the
load-engine effusive-dynamicism question into ONE concrete `src/animation/` directory tree, with
the service boundaries, the DI pattern, the pipeline orchestration, and the import-edge consequences
spelled out so `proof:boundary` (LIGHT/HEAVY) survives the move unchanged.

---

## 0. The problem in one paragraph

`src/animation/` is a **flat tree of 56 `.ts` files** in one directory; the only sub-dir is
`src/animation/internal/` (5 files). Tranche Q branded a "decomposition close" but `engine.ts` is
**still 1420 lines** with two exported classes, and Q spawned EIGHT new flat hyphenated siblings
(`engine-playback.ts`, `engine-composition.ts`, `engine-css-metadata.ts`, `engine-options.ts`,
`group-soa.ts`, `group-layer-springs.ts`, `waapi-densify.ts`, `frame-compiler-numeric.ts`,
plus the L-era `spring-duration.ts`/`spring-reseat.ts`) instead of real directory sub-modules. The
`proof:decomposition` gate greens only because its `LIBRARY_CEILING_OVERRIDE` map raises each cap to
sit just above the file it measures (engine.ts cap=1450 for a 1420L file). The `internal/` directory
already proves the project knows how to build real directory sub-modules — the engine/group/spring/
compile families were denied that treatment. The target structure below directory-izes the nine
coupled families, carves the two genuine god-classes (engine, group) into cohesive sub-modules that
OWN their state (DI collaborators, not param-bag free functions), and collapses the over-engineered
load-engine surface — all while preserving the value.js LIGHT/HEAVY boundary by construction.

---

## 1. The current shape (measured)

### 1a. Files over the 500-line decomposition gate (11 files)

| File | LOC | Concerns packed | Lane verdict |
|---|---|---|---|
| `engine.ts` | **1420** | 2 classes (KeyframesAnimation 1058L + CSSKeyframesAnimation 228L), 5 concerns each | lib-engine F-1 CRITICAL |
| `group.ts` | **924** | class + transformFramesGrouped (146L) + boxedBlendArm (70L) | lib-group |
| `animations.ts` | **886** | 38 preset factories (54% raw CSS string data) | lib-animations F1 |
| `resolve-values.ts` | **796** | spring physics + if() + @function inline + env/API (4 concerns) | lib-resolve F12 |
| `sequence.ts` | **698** | class: position-resolve + transport + clock-apply | lib-sequence F-1 |
| `spring.ts` | **685** | SpringProgress class + ODE + vector mode | lib-spring |
| `frame-compiler.ts` | **616** | FrameCompiler class + selector grammar | lib-compile F9 |
| `waapi.ts` | **579** | eligibility + emission + options + delegation (4) | lib-waapi F1 |
| `load-engine.ts` | **559** | 52% comments; 4 surface interfaces + 4 accessors | lib-boundary 3.1/3.7 |
| `scroll-scene.ts` | **539** | time driver + re-export of grammar | lib-scroll-ingest F8 |
| `compile.ts` | **535** | backward compiler walker + refusal | lib-compile F9 |

### 1b. The flat hyphenated sibling families (the Q regression)

```
engine        engine.ts(1420) engine-composition.ts(221) engine-css-metadata.ts(148)
              engine-options.ts(193) engine-playback.ts(484)
group         group.ts(924) group-soa.ts(254) group-layer-springs.ts(236)
spring        spring.ts(685) spring-duration.ts(83) spring-reseat.ts(98)
              springLinearStops.ts(73) springTimingFunction.ts(120)   ← camelCase drift
frame-compiler frame-compiler.ts(616) frame-compiler-numeric.ts(77)
waapi         waapi.ts(579) waapi-densify.ts(287)
compile       compile.ts(535) compile-color.ts(325)
ingest        ingest.ts(348) ingest-cssom.ts(466)
scroll        scroll-scene.ts(539) scroll-grammar.ts(137)
sequence      sequence.ts(698) sequence-events.ts(216)
drag          drag.ts(462) drag-2d.ts(115)
```

Every family is ALREADY a hub + spokes with internal cross-imports; the directory makes that
boundary structural and lets the barrel be the only public surface. The siblings are pure-internal
(zero `index.ts` barrel hits) — moving them into directories is a **zero-public-API-change** refactor.

---

## 2. Service boundaries (the seven-zone partition)

Before drawing the tree, the synthesis names the **seven cohesive service zones** that the 56 files
actually fall into. This is the partition that earns its keep — each zone has one responsibility, one
import-direction story, and (critically) a single LIGHT-or-HEAVY classification.

| Zone | Responsibility | LIGHT/HEAVY | Files today |
|---|---|---|---|
| **`physics/`** | Clock-driven, value.js-free steppers + the rAF driver | **LIGHT** | numeric, smooth, oscillator, decay, morph, playback, spring/* |
| **`orchestration/`** | Multi-target/temporal helpers over physics or the engine | LIGHT (mostly) | stagger, flip, drag/*, timeline/*, sequence/* |
| **`engine/`** | The value.js-bearing KeyframesAnimation + CSSKeyframesAnimation core | **HEAVY** | engine.ts + 4 engine-* siblings |
| **`group/`** | The AnimationGroup compositor (layers, SoA fold, layer-springs) | HEAVY | group.ts + 2 group-* siblings |
| **`compile/`** | Forward + backward CSS keyframe compile pipeline | HEAVY | frame-compiler*, compile*, format, utils |
| **`resolve/`** | CSS `if()` / `@function` / env resolution (emerging-CSS) | HEAVY | resolve-values.ts |
| **`ingest/` + `scroll/`** | CSSOM walk + temporal takeover; scroll grammar + driver | HEAVY | ingest*, scroll*, adapter |

Two zones stay flat at `src/animation/` level (they belong to no family): the **preset catalog**
(`presets/`, a data-directory) and the **SVG factories** (`motion-path`, `draw-svg`, `morph-svg` —
HEAVY despite the lib-light lane's mis-assignment; lib-light F-1). The LIGHT static barrel
(`index.ts`) and the HEAVY loader (`load-engine.ts`) are the two boundary files and stay at the root.

**The single hard invariant across all zones:** `proof:boundary` (`scripts/proof-boundary.mjs`)
parses `index.ts`'s `export { … } from "./X"` statements to DERIVE the light-entry chunk set, then
bundles each from source and asserts ZERO static `@mkbabb/value.js` edge and ZERO `engine.ts` edge.
It also asserts the barrel holds NO inline runtime light export except the dynamic accessors. **Every
move below preserves this**: the barrel keeps re-exporting via `export { … } from "./physics/spring"`
(a path change only); the `physics/` and `orchestration/` zones keep their zero-value.js-edge; the
HEAVY zones stay behind `loadAnimationEngine()`'s `import("./engine/index")`.

---

## 3. THE TARGET TREE

```
src/animation/
├── index.ts                      ← LIGHT static barrel (unchanged role; import paths re-pointed)
├── load-engine.ts                ← HEAVY dynamic loader (slimmed ~559→~310: §6)
├── animate.ts                    ← single-call front door (stays; decide promote-or-excise — retro-api-in F2)
├── adapter.ts                    ← CSS parse→engine normalize layer (feeds engine + ingest)
│
├── internal/                     ← EXISTING proven sub-dir; gains 2 shared collaborators
│   ├── binary-search.ts          ← rename from binarySearch.ts (kebab; lib-legacy-sweep §E)
│   ├── errors.ts
│   ├── leaves.ts
│   ├── reduced-motion.ts
│   ├── scheduler.ts
│   ├── event-registry.ts         ← NEW: EventRegistry<K,CB> (lib-sequence F-4: dedupe Sequence+ScrollScene)
│   └── scroll-phases.ts          ← NEW: PHASE_FRACTIONS value.js-free (lib-scroll-ingest F7: kill book-dup)
│
├── physics/                      ← ZONE: LIGHT clock-driven steppers (value.js-free)
│   ├── index.ts                  ← barrel
│   ├── playback.ts               ← RAFPlayback + Tickable
│   ├── numeric.ts                ← NumericAnimation
│   ├── smooth.ts                 ← SmoothProgress
│   ├── oscillator.ts             ← Oscillator + waveformValue
│   ├── decay.ts                  ← decay + decayRest (drop stale VJ-1 comment; lib-light F-7)
│   ├── morph.ts                  ← ElementMorph (remove `!`; lib-light F-6)
│   └── spring/                   ← SUB-ZONE: the spring physics family (lib-spring §10)
│       ├── index.ts              ← public surface (barrel)
│       ├── types.ts              ← SpringProgressOptions, DEFAULT_SPRING_RESPONSE, subscriber types
│       │                            (BREAKS the spring.ts↔duration↔reseat circular ring; lib-spring §3)
│       ├── progress.ts           ← SpringProgress class (ODE + vector; ~480L)
│       ├── duration.ts           ← durationToSpringOptions, SpringDurationOptions
│       ├── reseat.ts             ← probeVelocity, reseatToSpring, VelocityProbe
│       ├── sample.ts             ← NEW internal: sampleNormalizedSpring (lib-spring §4 DRY)
│       ├── linear-stops.ts       ← from springLinearStops.ts (kebab)
│       └── timing-function.ts    ← from springTimingFunction.ts (extends linear-stops opts; §5/§7)
│
├── orchestration/                ← ZONE: temporal/multi-target helpers (LIGHT)
│   ├── index.ts
│   ├── stagger.ts
│   ├── flip.ts
│   ├── drag/                     ← SUB-ZONE (lib-light F-10: kill flat re-export coupling)
│   │   ├── index.ts              ← re-exports drag + Draggable + drag2D + Drag2DHandle
│   │   ├── draggable.ts          ← Draggable 1-D engine (no edge to drag-2d)
│   │   └── drag-2d.ts            ← drag2D + Drag2DHandle (imports Draggable only)
│   ├── timeline/                 ← SUB-ZONE (lib-light F-9)
│   │   ├── index.ts              ← Timeline + KeyframesScrollTimeline + ManualTimeline
│   │   └── native.ts             ← createNativeTimeline (the platform feature-detect; HEAVY consumer waapi)
│   └── sequence/                 ← SUB-ZONE (lib-sequence F-1; sequence.ts 698L carved)
│       ├── index.ts              ← barrel (re-exports Sequence + types unchanged)
│       ├── sequence.ts           ← class shell: entries/labels/cursor; seek/_applyAt; setTargets (~350L)
│       ├── transport.ts          ← play/pause/resume/stop/timeScale/reverse/repeat/yoyo + _frame/_fold (~280L)
│       ├── events.ts             ← SequenceEventBus (from sequence-events.ts; uses internal/event-registry)
│       └── position.ts           ← resolvePosition + SequencePosition (the GSAP "+=n" parser, ~30L)
│
├── engine/                       ← ZONE: HEAVY core (lib-engine §4; the CRITICAL carve)
│   ├── index.ts                  ← barrel: re-exports both classes + the bundling seam (§5 below)
│   ├── animation.ts              ← KeyframesAnimation<V> base: fields, compiler delegation,
│   │                                option setters, interpFrames hot-path (~550L, under 500 after §4 lifts)
│   ├── css-animation.ts          ← CSSKeyframesAnimation<V> subclass: fromString/fromVars/fromKeyframes,
│   │                                bindTimeline, resolveTransform (~250L; lib-engine F-4)
│   ├── playback.ts               ← PlaybackState struct (OWNS the run-state) + the play free functions
│   │                                (from engine-playback.ts; KILLS the `this as unknown as PlaybackHost`
│   │                                cast — lib-engine F-2, retro-q-changes §2)
│   ├── composition.ts            ← Composition collaborator OWNING compositionBase + fallbackSeen
│   │                                (from engine-composition.ts; DI'd as a field, not a param bag —
│   │                                lib-legacy-sweep D.1)
│   ├── options.ts                ← from engine-options.ts (option normalizers/setters surface)
│   ├── css-metadata.ts           ← from engine-css-metadata.ts (registerProperty; narrow the catch — A.1)
│   ├── element-resolve.ts        ← _resolveElementAwareValues + _buildElementAwareEnv extracted
│   │                                (~90L Phase-2 resolver; lib-engine F-7; fix the getComputedStyle
│   │                                swallow — lib-resolve F7)
│   └── events.ts                 ← dispatchAnimationEvent shared by animation + playback (lib-engine F-6)
│
├── group/                        ← ZONE: HEAVY compositor (lib-group §9; group.ts 924L carved)
│   ├── index.ts                  ← barrel (re-exports AnimationGroup + entry/input/spring types)
│   ├── group.ts                  ← AnimationGroup class (no forcePause/forcePlay, no onStart/onEnd stubs;
│   │                                transformFramesGrouped demoted private — lib-group §5/§6/§8)
│   ├── soa.ts                    ← from group-soa.ts (the GOOD extraction; KEEP shape — retro-q-changes §4)
│   ├── entries.ts                ← resolveEntryKey, requireEntry, computeGroupedKeys, renderMultiTarget,
│   │                                snapChildrenToFinal, setChildrenPaused (the non-spring half of
│   │                                group-layer-springs.ts; lib-group §2b junk-drawer split)
│   ├── scheduler.ts              ← advanceSlice, advanceBatched (the INP-yield batching; lib-group §2b)
│   └── springs.ts                ← seedLayerSpring, LayerTransitionSpring, advanceLayerSprings
│                                    (the actual spring half; lib-group C2)
│
├── compile/                      ← ZONE: HEAVY compile pipeline (lib-compile F9/F10; lib-support F4)
│   ├── index.ts                  ← barrel (same public surface through load-engine)
│   ├── frame-compiler.ts         ← FrameCompiler class (folds frame-compiler-numeric.ts back in — F1;
│   │                                replace findIndex scan with a Map — F7)
│   ├── backward.ts               ← from compile.ts (the walker + refusal surface + compileToCSS)
│   ├── backward-color.ts         ← from compile-color.ts (oklab densify; hoist the 1024-ramp — F8)
│   ├── format.ts                 ← serializer ONLY: serializeEasing, CSSKeyframesToString(s),
│   │                                propertyRegistryToString (compile-primitives MOVED to backward.ts —
│   │                                lib-support F4; dedupe buildStopBody — lib-compile F2)
│   ├── parse-flatten.ts          ← flattenToValueUnits, parseAndFlattenObject, tryParseLeaves,
│   │                                createInterpVarValue (from utils.ts — lib-support F1; the misnamed
│   │                                "utils" god-module dissolved)
│   └── easing-registry.ts        ← getTimingFunction (from utils.ts; the HEAVY sync resolver — lib-support F1;
│                                    lets easing.ts narrow its dynamic import — lib-support F7;
│                                    fix the silent steps()/linear() catch — lib-support F2)
│
├── resolve/                      ← ZONE: HEAVY emerging-CSS resolver (lib-resolve F12; resolve-values 796L)
│   ├── index.ts                  ← resolveNode, resolveValues, hasResolvableValue, hasPhase2Node + re-exports
│   ├── env.ts                    ← ResolveEnv, ResolveContext, defaultResolveEnv, makeResolveContext, DROP
│   │                                (memoize the feature-checks once — lib-resolve F6)
│   ├── resolve-if.ts             ← splitCondition, evalCondition, evalStyleCondition, reparseLeaf, resolveIf
│   │                                (reparseLeaf returns DROP on parse-miss, not the broken leaf — F4)
│   └── resolve-function.ts       ← normalizeParam, coerceArg, substituteParams, resolveFunctionCall
│                                    (the value.js 1.2.0 @function workaround GUARDED + dispatched — F3, B.1)
│       (NOTE: the orphan spring physics — springCssToOptions/resolveSpringTiming — MOVES to
│        physics/spring/timing-function.ts; `"spring"` removed from hasResolvableValue — lib-resolve F2)
│
├── waapi/                        ← ZONE: HEAVY WAAPI delegation (lib-waapi F1; waapi.ts 579L carved)
│   ├── index.ts                  ← re-export surface (kills the dual import relay — F6)
│   ├── eligibility.ts            ← isWAAPIEligible + units + isWebKitEngine (add composition-uniformity gate — F4)
│   ├── emission.ts               ← toWAAPIKeyframes (imports densify directly)
│   ├── options.ts                ← toWAAPIOptions + maps (throw on unknown composite, not ?? "replace" — F2/F5)
│   ├── delegation.ts             ← playWAAPI, attachNativeScrollTimeline (narrow the bare catch — F7)
│   └── densify.ts                ← from waapi-densify.ts (un-export dead WAAPI_CHORD_TOLERANCE — F3)
│
├── ingest/                       ← ZONE: HEAVY CSSOM ingest (lib-scroll-ingest F8)
│   ├── index.ts                  ← barrel
│   ├── cssom.ts                  ← from ingest-cssom.ts (single-pass walk — F3; new diagnostic codes — F4)
│   └── adopt.ts                  ← from ingest.ts (adoptRunning, seedAtTime — temporal takeover)
│
├── scroll/                       ← ZONE: HEAVY scroll (lib-scroll-ingest F8)
│   ├── index.ts                  ← barrel
│   ├── grammar.ts                ← from scroll-grammar.ts (value.js parse/serialize)
│   └── scene.ts                  ← from scroll-scene.ts MINUS grammar re-export (drop dead scrubSeconds — F2;
│                                    use internal/event-registry + internal/scroll-phases — F7)
│
├── presets/                      ← ZONE: HEAVY preset catalog (lib-animations F1; animations.ts 886L)
│   ├── index.ts                  ← 1:1 re-export barrel (load-engine imports this instead of ./animations)
│   ├── classic.ts                ← 34 cubic-bezier/stepped presets (un-export slideIn*Keyframes — F2)
│   ├── spring.ts                 ← 4 SPRING_* constants + 4 spring factories (single source of truth — F6)
│   └── taxonomy.ts               ← enter/exit/attention/loop + presetTaxonomy (add the 6 missing — F3)
│
└── svg/                          ← ZONE: HEAVY SVG factories (lib-light F-1: they are NOT light)
    ├── index.ts                  ← barrel
    ├── handle.ts                 ← NEW AnimationHandle base: play/pause/stop/finished (lib-light F-2/F-3 DRY)
    ├── motion-path.ts            ← MotionPath (extends AnimationHandle)
    ├── draw-svg.ts               ← DrawSVG (widen setTargets to Element — F-4; extends handle)
    └── morph-svg.ts              ← MorphSVG (extends handle; fail-explicit on lost coord leaf — C.1)
```

### 3a. Why this is KISS, not over-engineering

- **Seven directories, each named for its zone's one responsibility.** No directory holds fewer than
  2 cohesive files except where the sub-zone (`spring/`, `drag/`, `timeline/`) genuinely has a
  ring-breaking `types.ts` or a flat-coupling fix that REQUIRES the directory.
- **The `internal/` precedent is followed exactly** — it is the proven pattern; the new directories
  are the same shape (a barrel + cohesive members), not a novel abstraction.
- **No file exceeds 500 lines** after the carve (estimates in §7). The two god-classes (engine, group)
  become 3–4 cohesive sub-modules each that OWN their state.
- **Flat hyphenated siblings are eliminated** — every `<base>-<suffix>.ts` becomes `<base>/<suffix>.ts`.
- **Naming normalized to kebab-case** inside the moves (springLinearStops→linear-stops,
  springTimingFunction→timing-function, binarySearch→binary-search) — one move, not a churn pass.

---

## 4. The two genuine god-class carves (engine, group) — DI not param-bags

The retros are emphatic that Q's "extraction" was fictitious: the play functions reach back into the
class via `this as unknown as PlaybackHost<V>` (engine.ts:918), and `engine-composition.ts` receives
the engine's OWN `compositionBase`/`_compositionFallbackSeen` fields as a `CompositionRuntime` param
bag. **The carve must transfer ownership, not relocate borrowed logic.** This is the DI/service-boundary
ask the precepts name.

### 4a. `engine/playback.ts` — `PlaybackState` struct OWNS the run-state

Today: `resolvePromise`, `_playingPromise`, `_boundFrame`, `_interpOut`, `_waAnimations` are declared
`private` on `KeyframesAnimation` (engine.ts:218–237), then re-published through the `PlaybackHost`
interface (engine-playback.ts:50–100) and reached via the `this as unknown as PlaybackHost<V>` cast.
This is a **privacy inversion** (lib-engine F-2, F-9; retro-q-changes §2).

Target: a `PlaybackState<V>` plain struct (plain object or small class) declared in `engine/playback.ts`
that OWNS those fields. `KeyframesAnimation` composes it (`this._playback = new PlaybackState()`); the
play free functions operate on `state` natively. No cast. The minimal driver the play loop needs
(`advanceTo`, `interpFrames`, the fill verbs, the clock fields) is an EXPLICIT injected interface — the
`group-soa.ts` shape (explicit args, no host) is the reference model (retro-q-changes §4).

### 4b. `engine/composition.ts` — `Composition` collaborator OWNS its caches

Today: `engine-composition.ts` functions take a `CompositionRuntime` bag of the engine's own fields
(lib-legacy-sweep D.1). Target: a `Composition` object that holds `compositionBase` + `fallbackSeen` as
its OWN fields, DI'd onto the animation as `this._composition = new Composition()`. `applyComposition`
becomes `this._composition.apply(...)`. The state lives with the code that mutates it — true
encapsulation.

### 4c. `group/` — demote the test-scaffold surface

`group.ts` carves cleanly (lib-group §9) once the dead surface is excised: `forcePause`/`forcePlay`
(test-scaffold leaks — §5), the `onStart`/`onEnd` no-op stubs (§6), and `transformFramesGrouped`
demoted private (§8). `soa.ts` is the model extraction — moved verbatim. The misnamed
`group-layer-springs.ts` junk-drawer splits 3-ways into `springs.ts` (the real spring half),
`entries.ts` (entry lookups + key-union + multi-render), and `scheduler.ts` (the INP-yield batching).

---

## 5. The `engine/index.ts` bundling seam (preserve the dynamic-boundary contract)

`engine.ts` currently ends with a re-export block (verified at the file tail):

```ts
export { AnimationGroup } from "./group";
export { getTimingFunction } from "./utils";
export { resolveKeyframes } from "./adapter";
export { DIRECTIONS, FILL_MODES, defaultOptions, defaultLayerConfig } from "./constants";
```

The comment explains it bundles the value.js-bearing surface so `loadAnimationEngine()` hands consumers
"the whole engine in one `import("./engine")`" (lib-engine F-5). This is a **bundling seam**, not a class
concern. In the target tree it MOVES to `engine/index.ts` (the barrel), which re-exports:

```ts
export { KeyframesAnimation } from "./animation";
export { CSSKeyframesAnimation } from "./css-animation";
export { AnimationGroup } from "../group";
export { getTimingFunction } from "../compile/easing-registry";   // was ./utils
export { resolveKeyframes } from "../adapter";
export { DIRECTIONS, FILL_MODES, defaultOptions, defaultLayerConfig } from "../constants";
```

`load-engine.ts` changes `import("./engine")` → `import("./engine/index")`. **Vite chunks by entry
specifier**, so the heavy engine chunk is unchanged — same module, new path. The `proof:boundary`
DYNAMIC-CHUNK-PRESENCE assertion (it bundles `loadAnimationEngine` and asserts the engine emits as a
NON-ENTRY dynamic chunk with no static value.js edge on the accessor) survives because the boundary is
still a single `import("./engine/index")`.

---

## 6. Collapsing the over-engineered loader (load-engine.ts 559→~310)

retro-api-in F3 + lib-boundary 3.1/3.2/3.3 converge: the granular accessors `loadEngine` /
`loadCompiler` / `loadIngest` (and the `EngineCore` / `CompilerSurface` / `IngestSurface` interfaces)
have **zero real usage** — the demo (36 sites) uses only the full `loadAnimationEngine()`. They add
~150 lines of effusive-dynamicism surface. The synthesis:

1. **Excise** `loadEngine`/`loadCompiler`/`loadIngest` + their 3 surface interfaces + the
   `_compileMod`/`_ingestMod`/`_scrollMod` memo vars (dead after excision). `_enginePromise ??=` is the
   only memoization the contract needs (lib-boundary 3.5).
2. **Keep** the hand-maintained `AnimationEngine` interface (the API-Extractor `typeof import()`
   constraint is genuine — lib-boundary 3.2) but strip the per-member tranche-provenance JSDoc to one
   line each (122L → ~55L). The change-log prose belongs in CHANGELOG, not in the shipped `.d.ts`.
3. **Re-point** the 4 memoized dynamic imports: `import("./engine")`→`"./engine/index"`,
   `"./compile")`→`"./compile/index"`, `"./ingest")`→`"./ingest/index"`, `"./scroll-scene")`→`"./scroll/index"`.
   The ~9 inline imports re-point similarly (`./animate`, `./svg/motion-path`, `./svg/draw-svg`,
   `./svg/morph-svg`, `./validate`, `./presets`, `./compile/format`, `./compile/parse-flatten`,
   `./internal/scheduler`).

Projected: ~559 → ~310 lines, doing exactly one thing — the `AnimationEngine` interface + the two-function
loading API (`loadAnimationEngine` + `warmEngine`). It stays a single root file (NOT a directory — at 310L
it is under the gate and splitting it would be the contrivance the precepts forbid).

> **The deeper api-in question (subpath exports `@mkbabb/keyframes.js/engine` as a static "in")** is a
> PRODUCT decision (retro-api-in F1/F3) that intersects this tree: if adopted, `engine/index.ts` is the
> natural subpath target and most of `load-engine.ts` evaporates. The tree above is correct EITHER way —
> the subpath decision only changes whether `engine/index.ts` is also a `package.json` `exports` entry.
> The tree does not block on that call; flag it for the owner.

---

## 7. Sizing after the carve (every file under 500)

| New file | Est. LOC | Source |
|---|---|---|
| `engine/animation.ts` | ~550→<500 after lifts | KeyframesAnimation minus CSS, Phase-2, playback delegates |
| `engine/css-animation.ts` | ~250 | CSSKeyframesAnimation |
| `engine/playback.ts` | ~510→<500 | engine-playback.ts + PlaybackState absorbing class fields |
| `engine/composition.ts` | ~221 | unchanged move (now owns its state) |
| `engine/options.ts` | ~193 | move |
| `engine/css-metadata.ts` | ~148 | move |
| `engine/element-resolve.ts` | ~90 | extracted Phase-2 |
| `engine/index.ts` | ~30 | barrel + bundling seam |
| `group/group.ts` | ~600→<500 after demoting dead surface | carved |
| `group/{soa,entries,scheduler,springs}.ts` | 254/~120/~50/~90 | family split |
| `compile/{frame-compiler,backward,backward-color,format,parse-flatten,easing-registry}.ts` | all <500 | utils dissolved |
| `resolve/{env,resolve-if,resolve-function,index}.ts` | ~80/~200/~200/~120 | 796L → 4 files |
| `sequence/{sequence,transport,events,position}.ts` | ~350/~280/~216/~30 | 698L → 4 files |
| `waapi/{eligibility,emission,options,delegation,densify}.ts` | all <300 | 579L → 5 files |
| `presets/{classic,spring,taxonomy}.ts` | ~700→<500/~120/~70 | classic.ts may need a 2nd split if >500 |
| `physics/spring/{progress,…}.ts` | progress ~480, rest <150 | 685L → 7 files |

The only residual watch: `presets/classic.ts` at ~700L is 54% raw CSS string DATA, not logic
(lib-animations §5). If it still reds the gate after the spring/taxonomy lift, split classic into
`classic-enter.ts` / `classic-exit.ts` / `classic-attention.ts` by taxonomy group — a data-partition,
not a logic carve. This is the one place the 500-line gate may need a documented data-volume note rather
than a forced split.

---

## 8. Import-edge consequences (proof:boundary survives)

The boundary contract has THREE assertions the tree must not break. Each is preserved:

| proof:boundary assertion | How the tree preserves it |
|---|---|
| **(1) PER-ENTRY NEGATIVE COVERAGE** — each LIGHT barrel export bundles with 0 value.js + 0 engine.ts modules | `physics/` + `orchestration/` zones keep their zero-value.js edge; the barrel re-exports them via `export {…} from "./physics/spring"` etc. — a path change only. `morph.ts`, `numeric.ts`, the steppers carry no new edge. |
| **(2) SELF-ENFORCING ENTRY SET** — entries PARSED from barrel `export {…} from` statements; barrel holds NO inline runtime light export except the accessors | Barrel keeps the `export {…} from "./X"` form (re-pointed paths); NO inline `export const` is added. The parse finds the same symbol set from new paths. |
| **(3) DYNAMIC-CHUNK PRESENCE** — `loadAnimationEngine` emits engine as a NON-ENTRY dynamic chunk | `load-engine.ts` keeps `import("./engine/index")` as the single heavy boundary; Vite chunks by specifier → unchanged chunk graph. |
| **(4) SOURCE-GREP COMPLEMENT** — no LIGHT-graph source module holds a static value.js specifier | The 3 SVG factories (motion-path/draw-svg/morph-svg) MOVE to `svg/` (HEAVY, behind loadAnimationEngine) — they were already HEAVY (static `import {CSSKeyframesAnimation} from "./engine"`); the move makes their HEAVY status structural, not accidental. `timeline/native.ts` is consumed by `waapi/` (HEAVY) but itself stays value.js-free in `orchestration/`. |

**The barrel re-point is mechanical:** every `index.ts` line `export {…} from "./spring"` becomes
`export {…} from "./physics/spring"`; `"./numeric"`→`"./physics/numeric"`; `"./drag"`→`"./orchestration/drag"`;
`"./sequence"`→`"./orchestration/sequence"`; `"./springLinearStops"`→`"./physics/spring"` (folds into the
spring barrel). 21 static-`from-"./engine"` importers (verified list) re-point to `"./engine/index"` — but
all 21 are themselves HEAVY-zone files moving INTO directories, so most become same-directory or
`../engine/index` relative imports resolved at move time.

**`adapter.ts` stays at the root** (lib-scroll-ingest F8) — it is the parse/normalize layer feeding both
`engine/` and `ingest/cssom.ts`; it belongs to neither family. `constants.ts` and `easing.ts` also stay
at root for now (constants is a 30+-importer shared-types file that the lib-support F3 split addresses
separately; forcing it into a directory in the same pass risks the atomic-barrel-rewrite churn that
lib-support F3 warns about).

---

## 9. The DI pattern (one sentence, applied three places)

**Collaborators own their state and are composed as fields; free functions take explicit minimal
interfaces, never `this as unknown as` casts or param-bags of the caller's private fields.**

- `engine/animation.ts` holds `this._playback = new PlaybackState()` and `this._composition = new
  Composition()` — the two seams Q faked are now real DI collaborators (§4a/4b).
- `group/group.ts` holds its `soa`/`springs` as the explicit-arg fold functions `soa.ts`/`springs.ts`
  expose (the `group-soa.ts` model — explicit `(buffer, plan)` args).
- `sequence/sequence.ts` composes `transport.ts` (the play machine) and `events.ts` (the
  `EventRegistry`-backed bus) — the temporal orchestrator delegates to two owned collaborators.

---

## 10. Pipeline orchestration (the round-trip, made legible by the tree)

The library's core proposition is the bidirectional round-trip. The tree makes the two directions
legible as two zone-pipelines:

**FORWARD (author → playing animation):**
```
adapter.ts (parse CSS)
  → resolve/ (if() / @function / env lower)
    → compile/parse-flatten.ts (flatten to ValueUnits)
      → compile/frame-compiler.ts (build frames + numeric plan)
        → engine/animation.ts (interpFrames hot-path)
          → engine/playback.ts (rAF drive)  OR  waapi/ (compositor delegate)
            → physics/spring/ (per-property spring tracking, when used)
```

**BACKWARD (animation → CSS artifact):**
```
engine/animation.ts (parsedVars)
  → compile/backward.ts (walk group/sequence/list)
    → compile/backward-color.ts (oklab densify)  +  compile/format.ts (serialize @keyframes)
      → CSS string
```

**INGEST (live page → animation):**
```
scroll/grammar.ts (scroll-range parse)  +  ingest/cssom.ts (CSSOM walk)
  → ingest/adopt.ts (temporal takeover)
    → engine/css-animation.ts (reconstruct)
```

Each arrow is a directory boundary. The HEAVY zones (`resolve/`, `compile/`, `engine/`, `group/`,
`waapi/`, `ingest/`, `scroll/`, `presets/`, `svg/`) all sit behind `loadAnimationEngine()`; the LIGHT
zones (`physics/`, `orchestration/`) are statically importable with zero value.js cost. The boundary is
no longer a property of 56 flat files — it is a property of the directory partition.

---

## 11. What this tree explicitly does NOT do (avoiding over-engineering)

- **No `physics/` ↔ `orchestration/` merge into a single `light/` dir.** The lib-light lane proposed
  `light/`; the synthesis splits it into `physics/` (steppers) + `orchestration/` (helpers) because they
  are two responsibilities (clock-driven value producers vs. multi-target/temporal coordinators). But it
  does NOT split further — `stagger.ts`/`flip.ts` stay flat in `orchestration/`, not their own dirs.
- **No `load-engine/` directory.** At ~310L post-slim it is under the gate; a directory would be contrivance.
- **No forced `constants.ts`/`easing.ts` move** in this pass — they are cross-zone shared and their
  internal split (lib-support F3) is a separate atomic concern.
- **No new abstraction layers** — every directory is a barrel + cohesive members, the exact `internal/`
  shape. No registry, no plugin system, no dispatch framework.
- **`animate.ts` stays at root** pending the promote-or-excise product call (retro-api-in F2) — the tree
  does not pre-judge it.

---

## 12. Sequencing note (for the wave-planner, not part of the tree)

The directory promotion is **mechanical and zero-API-change** (the siblings are pure-internal). The
god-class CARVES (engine §4, group §4c) are the hard, real work. The recommended order: (1) directory-ize
the already-cohesive families (spring, compile, ingest, scroll, sequence, waapi, presets, svg, drag,
timeline) — pure moves + barrel re-points; (2) carve `engine/` and `group/` with the DI collaborators;
(3) slim `load-engine.ts`; (4) re-run `proof:boundary` + the (de-allowlisted) `proof:decomposition` after
each. The keystone precondition the retros name: **DELETE the `LIBRARY_CEILING_OVERRIDE` allowlist** so the
gate reds on every god-module and those reds ARE the decomposition backlog (retro-q-changes §1,
retro-plan-waves §3) — otherwise the next tranche re-spawns flat siblings under a self-raising cap.

---

## 13. Summary — the gestalt in one table

| Decision | Resolution |
|---|---|
| **Scope** | LIBRARY (`src/animation/`) |
| **Replace the flat tree with** | 7 zone-directories (physics, orchestration, engine, group, compile, resolve, ingest+scroll) + presets/ + svg/, mirroring the proven `internal/` pattern |
| **Service boundaries** | physics (LIGHT steppers) · orchestration (LIGHT helpers) · engine (HEAVY core) · group (HEAVY compositor) · compile (HEAVY pipeline) · resolve (HEAVY emerging-CSS) · ingest/scroll (HEAVY CSSOM/scroll) |
| **DI pattern** | Collaborators own state, composed as fields (`_playback`, `_composition`); free functions take explicit minimal interfaces — NO `this as unknown as` casts, NO param-bags of the caller's private fields |
| **Pipeline orchestration** | The bidirectional round-trip becomes 3 directory-boundary pipelines (forward / backward / ingest); each arrow crosses a zone boundary |
| **load-engine effusive-dynamicism** | Excise the 3 unused granular accessors + 3 surface interfaces; keep `loadAnimationEngine`+`warmEngine`; strip provenance JSDoc; ~559→~310L; stays a root file |
| **proof:boundary survival** | Barrel keeps `export {…} from "./<zone>/<file>"` (path-only change); `loadAnimationEngine` keeps `import("./engine/index")` single heavy boundary; SVG factories move to HEAVY `svg/` (already HEAVY) |
| **Keystone precondition** | DELETE `LIBRARY_CEILING_OVERRIDE`; the resulting reds ARE the backlog |
