# R.W1 — Directory-ize the flat tree (the 7-zone partition) + 3 gate co-edits

**Phase:** IMPL (authorized when explicitly opened)
**Depends on:** R.W0 keystone (DELETE `LIBRARY_CEILING_OVERRIDE`) applied before first file move

---

## 1. Scope

Promote the flat `src/animation/` family clusters into the 7-zone directory partition specified in
`audit/gestalt-library.md §3`. The scope is purely mechanical: move existing flat-hyphenated-sibling
files into directories, add per-directory `index.ts` barrels, re-point the barrel (`index.ts`) and
dynamic loader (`load-engine.ts`), and apply the three gate co-edits. Zero public-API change — the
siblings are pure-internal with no `index.ts` hits.

The god-class carves (`engine/`, `group/`) are NOT in this wave; they live in R.W2. This wave
directory-izes every other family (spring, compile, ingest, scroll, sequence, waapi, presets, svg,
drag, timeline) and relocates engine's existing flat siblings into the new `engine/` shell, leaving
the carve for R.W2.

---

## 2. Concrete work (file-level moves + barrel re-points + gate co-edits)

### 2a. R.W0 keystone precondition

Before any file moves:

**DELETE** the `LIBRARY_CEILING_OVERRIDE` map in `scripts/proof-decomposition.mjs` (lines 128–200,
the entire `new Map([…])` block). Set ONE hard library ceiling (500L). The resulting reds on
`engine.ts` / `group.ts` / the other oversized files ARE the decomposition backlog measured by the
gate, not by prose. This is the R.W0 keystone (R.md §5; challenge-library §7).

The `proof-decomposition.mjs` stale-entry guard loop (lines 472–491) also goes away — it validates
the override map that no longer exists. Evidence: gestalt-library §12; retro-q-changes §1.

---

### 2b. Gate co-edit 1 — `proof-boundary.mjs:84` widen `isHeavyEngine` regex

**Current** (`scripts/proof-boundary.mjs:84`):
```js
const isHeavyEngine = (id) => /[\\/]animation[\\/]engine\.ts$/.test(id);
```

**After:**
```js
const isHeavyEngine = (id) => /[\\/]animation[\\/]engine[\\/]/.test(id);
```

**Why:** After the directory move, `KeyframesAnimation` lives in
`src/animation/engine/animation.ts`. The old regex matches `engine.ts` only; it will NEVER
match `engine/animation.ts`. Result before fix: assertion (3) DYNAMIC-CHUNK PRESENCE hard-reds
(`dynamicEngine.length === 0`); assertion (1) PER-ENTRY NEGATIVE COVERAGE goes silently blind
(filter returns `[]` regardless of a light-entry regression). Evidence: challenge-library §1,
`proof-boundary.mjs:444,459,484-490`.

**Re-RED test:** Before applying this widen, add a static `import {} from "./engine/animation"` to
`src/animation/physics/numeric.ts` (a light-zone file). Run `proof:boundary`. Assertion (1) must
RED with the engine path in the violation list. Remove the static import; confirm GREEN. Then apply
the widen. Run `proof:boundary` again — must stay GREEN.

---

### 2c. Gate co-edit 2 — `proof-boundary.mjs:237` drop granular accessors from `DYNAMIC_ACCESSORS`

**Current** (`scripts/proof-boundary.mjs:237–243`):
```js
const DYNAMIC_ACCESSORS = [
    "loadAnimationEngine",
    "warmEngine",
    "loadEngine",
    "loadCompiler",
    "loadIngest",
];
```

**After:**
```js
const DYNAMIC_ACCESSORS = [
    "loadAnimationEngine",
    "warmEngine",
];
```

This co-edit MUST land in the same commit as the excision of `loadEngine` / `loadCompiler` /
`loadIngest` from `load-engine.ts` (§2f below). The gate bundles each accessor by name and reds if
the export is absent (proof-boundary.mjs:476–477); leaving the three dead names in the list after
excision causes a hard red on the first CI run. Evidence: challenge-library §3,
`proof-boundary.mjs:237,476-477`.

**Re-RED test:** Excise `loadEngine` from `load-engine.ts` WITHOUT removing it from
`DYNAMIC_ACCESSORS`. Run `proof:boundary`. Must RED on `loadEngine` accessor absent. Then remove
`loadEngine` from `DYNAMIC_ACCESSORS` in the same change — confirm GREEN.

---

### 2d. Gate co-edit 3 — `proof-engine.mjs:33,79` retarget `engine.ts` → `engine/animation.ts`

**Current** (`scripts/proof-engine.mjs:33`):
```js
for (const f of ["src/animation/engine.ts", "src/animation/group.ts"]) {
```

**After:**
```js
for (const f of ["src/animation/engine/animation.ts", "src/animation/group/group.ts"]) {
```

**Current** (`scripts/proof-engine.mjs:79`):
```js
const engine = read("src/animation/engine.ts").split("\n");
```

**After:**
```js
const engine = read("src/animation/engine/animation.ts").split("\n");
```

Evidence: challenge-library §1b, `proof-engine.mjs:33,79`.

**Re-RED test:** Move `engine.ts` to `engine/animation.ts` (the directory shell step in §2e)
WITHOUT applying this gate co-edit. Run `proof:engine`. Must error (file not found or wrong
assertion). Apply the retarget; confirm GREEN.

---

### 2e. The directory moves

Each move is mechanical: create the directory, move files, create `index.ts` barrel, update
internal imports. Order: families with no intra-cluster circular imports first (spring, waapi,
compile, ingest, scroll, sequence, drag, timeline, presets, svg); engine shell last (the carve
is R.W2).

#### `physics/spring/` — resolves the circular import ring

Evidence: lib-spring §3; gestalt-library §3.

```
src/animation/spring.ts           → src/animation/physics/spring/progress.ts
src/animation/spring-duration.ts  → src/animation/physics/spring/duration.ts
src/animation/spring-reseat.ts    → src/animation/physics/spring/reseat.ts
src/animation/springLinearStops.ts→ src/animation/physics/spring/linear-stops.ts  (kebab)
src/animation/springTimingFunction.ts→ src/animation/physics/spring/timing-function.ts  (kebab)
NEW                                → src/animation/physics/spring/types.ts
                                     (SpringProgressOptions, DEFAULT_SPRING_RESPONSE,
                                      subscriber types — breaks the spring.ts↔duration ring)
NEW (internal, no barrel export)   → src/animation/physics/spring/sample.ts
                                     (sampleNormalizedSpring — dedups the sampler setup;
                                      lib-spring §4)
NEW                                → src/animation/physics/spring/index.ts  (barrel)
```

`src/animation/index.ts` re-points:
- `from "./spring"` → `from "./physics/spring"`
- `from "./springLinearStops"` → `from "./physics/spring"` (merged into spring barrel)
- `from "./springTimingFunction"` → same

`spring.ts` ↔ `spring-duration.ts` ↔ `spring-reseat.ts` circular ring (lib-spring §3:
`spring.ts:12-15` ↔ `spring-duration.ts:17` ↔ `spring-reseat.ts:16-17`) dissolves because
`types.ts` is the new import target for `SpringProgressOptions` / `DEFAULT_SPRING_RESPONSE`.

The camelCase files (`springLinearStops.ts`, `springTimingFunction.ts`) are renamed to kebab on
move — one move, not a separate churn pass (gestalt-library §3a).

**`SpringDurationOptions` barrel gap** (lib-spring §10): add
`export type { SpringDurationOptions } from "./physics/spring"` to the barrel in this pass.

#### `physics/` flat members (no sub-zone)

```
src/animation/playback.ts   → src/animation/physics/playback.ts
src/animation/numeric.ts    → src/animation/physics/numeric.ts
src/animation/smooth.ts     → src/animation/physics/smooth.ts
src/animation/oscillator.ts → src/animation/physics/oscillator.ts
src/animation/decay.ts      → src/animation/physics/decay.ts
src/animation/morph.ts      → src/animation/physics/morph.ts
NEW                          → src/animation/physics/index.ts  (barrel)
```

`src/animation/index.ts` re-points each from `"./<name>"` to `"./physics/<name>"`.

#### `orchestration/drag/`

Evidence: lib-light F-10; gestalt-library §3.

```
src/animation/drag.ts     → src/animation/orchestration/drag/draggable.ts
src/animation/drag-2d.ts  → src/animation/orchestration/drag/drag-2d.ts
NEW                        → src/animation/orchestration/drag/index.ts  (barrel)
```

The flat-sibling re-export relay (`drag.ts:455-462` re-exporting `drag-2d`) disappears: the barrel
owns the unified surface. `draggable.ts` imports nothing from `drag-2d.ts`; `drag-2d.ts` imports
only `Draggable` from `draggable.ts`.

#### `orchestration/timeline/`

Evidence: lib-light F-9; gestalt-library §3.

```
src/animation/timeline.ts → src/animation/orchestration/timeline/index.ts
                             (Timeline + KeyframesScrollTimeline + ManualTimeline)
                          → src/animation/orchestration/timeline/native.ts
                             (createNativeTimeline — the platform feature-detect;
                              split per lib-light F-9 / gestalt-library §3)
```

`timeline.ts` is 272L (under 500); the split is motivated by the consumer seam
(`native.ts` is consumed by `waapi/` on the HEAVY side), not by line count.

#### `orchestration/sequence/`

Evidence: gestalt-library §3; lib-sequence (referenced in gestalt).

```
src/animation/sequence.ts        → src/animation/orchestration/sequence/sequence.ts
src/animation/sequence-events.ts → src/animation/orchestration/sequence/events.ts
NEW                               → src/animation/orchestration/sequence/index.ts  (barrel)
```

`src/animation/index.ts` re-points `from "./sequence"` → `from "./orchestration/sequence"`.

#### `orchestration/` flat members

```
src/animation/stagger.ts → src/animation/orchestration/stagger.ts
src/animation/flip.ts    → src/animation/orchestration/flip.ts
NEW                       → src/animation/orchestration/index.ts  (barrel)
```

#### `waapi/`

Evidence: lib-waapi §1 (579L god-module), F-6; gestalt-library §3.

```
src/animation/waapi.ts         → src/animation/waapi/waapi.ts
                                  (eligibility + emission + options + delegation;
                                   the densify import relay disappears)
src/animation/waapi-densify.ts → src/animation/waapi/densify.ts
NEW                             → src/animation/waapi/index.ts  (barrel)
```

The dual import relay (`waapi.ts:276-281` exports + re-imports from `"./waapi-densify"`) disappears:
`waapi/index.ts` is the unified surface; `emission.ts` imports `densify.ts` directly within the
directory.

In this wave, `waapi.ts` is moved as-is (4-concern file). The concern split into
`eligibility.ts / emission.ts / options.ts / delegation.ts / densify.ts`
(gestalt-library §3) is R.W2's engine-carve territory if desired, or deferred to a post-R.W1 pass.
The line threshold (579L) still exceeds 500 after the densify split, which `proof:decomposition`
will red — that red is the measured backlog (the override delete means no masking).

#### `compile/`

Evidence: lib-compile F-9 (the flat cluster); lib-support F-1 (utils.ts junk-drawer); gestalt-library §3.

```
src/animation/frame-compiler.ts         → src/animation/compile/frame-compiler.ts
src/animation/frame-compiler-numeric.ts → DELETE (folded back into frame-compiler.ts
                                           as module-private functions per lib-compile F1;
                                           `isNumericInterpVar` + `buildNumericPlan` become
                                           non-exported; `NumericFoldPlan` type stays in
                                           constants.ts)
src/animation/compile.ts                → src/animation/compile/backward.ts
src/animation/compile-color.ts          → src/animation/compile/backward-color.ts
src/animation/format.ts                 → src/animation/compile/format.ts
src/animation/utils.ts                  → src/animation/compile/parse-flatten.ts
                                           (the CSS-leaf pipeline: flattenToValueUnits,
                                            parseAndFlattenObject, tryParseLeaves,
                                            createInterpVarValue — lib-support F1)
                                         + easing-registry.ts for getTimingFunction
                                           (HEAVY sync resolver — lib-support F1/F7;
                                            lets easing.ts narrow its dynamic import)
NEW                                     → src/animation/compile/index.ts  (barrel)
```

`frame-compiler-numeric.ts` excision: the file is a cosmetic Q.WF1 extraction (lib-compile F1 —
sole consumer is `frame-compiler.ts:584`; `isNumericInterpVar` has zero cross-file callers).
EXCISE per the precept rubric (dead no-op separation; zero independent testability).

`utils.ts` dissolution: the misnamed god-utilities module (lib-support F1; 5 unrelated concerns) is
renamed on move to `parse-flatten.ts` (the name reflects the actual job). `getTimingFunction` moves
to `compile/easing-registry.ts` (lib-support F7: lets `easing.ts:resolveEasing` narrow its dynamic
import from the full engine to `"./compile/easing-registry"`). `transformTargetsStyle` + `_styleOut`
buffer move to `engine/` scope (already an engine-side concern; exact placement is R.W2).
`calcFrameTime` inlines into `frame-compiler.ts` (sole consumer; 12 lines).

#### `resolve/`

Evidence: gestalt-library §3 (resolve-values.ts 796L — also reds `proof:decomposition` NOW).

```
src/animation/resolve-values.ts → src/animation/resolve/index.ts  (re-exports)
                                  src/animation/resolve/env.ts
                                  src/animation/resolve/resolve-if.ts
                                  src/animation/resolve/resolve-function.ts
```

The spring orphan (`springCssToOptions` / `resolveSpringTiming`) moves to
`physics/spring/timing-function.ts` (gestalt-library §3 NOTE).

#### `ingest/` and `scroll/`

Evidence: lib-scroll-ingest F-8; gestalt-library §3.

```
src/animation/ingest-cssom.ts → src/animation/ingest/cssom.ts
src/animation/ingest.ts       → src/animation/ingest/adopt.ts
NEW                            → src/animation/ingest/index.ts  (barrel)

src/animation/scroll-grammar.ts → src/animation/scroll/grammar.ts
src/animation/scroll-scene.ts   → src/animation/scroll/scene.ts
                                   (MINUS grammar re-export — the hub re-export relay goes away)
NEW                              → src/animation/scroll/index.ts  (barrel)
```

`load-engine.ts` re-points:
- `import("./ingest")` → `import("./ingest/index")`
- `import("./scroll-scene")` → `import("./scroll/index")`

Vite chunks by entry specifier; the heavy scroll chunk is now `./scroll/index` — identical chunk
behavior, new path. Evidence: lib-scroll-ingest F-8 (constraint note).

The `PHASE_FRACTIONS` / `NAMED_SELECTOR_PHASES` book-duplication (lib-scroll-ingest F-7;
lib-compile F-5): extract `PHASE_FRACTIONS` (the 4 selector-valid entries) to
`src/animation/internal/scroll-phases.ts`. Both `scroll/scene.ts` and
`compile/frame-compiler.ts` import it from there. The duplication + the BOOK note are removed.
Evidence: lib-scroll-ingest §3 Finding 7.

#### `presets/`

Evidence: lib-animations F1 (886L god-module); gestalt-library §3.

```
src/animation/animations.ts → src/animation/presets/classic.ts   (lines 1-729: 34 cubic-bezier/stepped presets)
                             → src/animation/presets/spring.ts    (lines 731-816: SPRING_* + spring factories)
                             → src/animation/presets/taxonomy.ts  (lines 818-886: taxonomy objects)
NEW                          → src/animation/presets/index.ts     (1:1 re-export barrel)
```

`load-engine.ts:464` switches from `import("./animations")` to `import("./presets/index")`.

`slideInLeftKeyframes` / `slideInRightKeyframes` un-exported (`export const` → `const`) in
`presets/classic.ts` per lib-animations F2 (zero callers outside the file).

**`presets/classic.ts` data-volume note:** at ~700L (54% raw CSS string data), `classic.ts` will
red `proof:decomposition`. Per R.md §7 + challenge-library §4b, splitting a flat list of 34 preset
constants three ways by taxonomy purely to satisfy a line gate on string-literal data IS the
contrivance the precepts forbid. The correct disposition is a documented data-volume override (one
entry, not the self-raising cap). A single `LIBRARY_CEILING_OVERRIDE`-style note for `classic.ts`
is the honest exception (data, not logic) if needed. Do NOT split classic into
`classic-enter/exit/attention` — that is a forced taxonomy-driven data-partition with no cohesion
benefit.

#### `svg/`

Evidence: lib-light F-1 (SVG factories are HEAVY, not light); lib-light F-2/F-3 (DRY violations);
gestalt-library §3.

```
src/animation/motion-path.ts → src/animation/svg/motion-path.ts
src/animation/draw-svg.ts    → src/animation/svg/draw-svg.ts
src/animation/morph-svg.ts   → src/animation/svg/morph-svg.ts
NEW                           → src/animation/svg/handle.ts
                                (AnimationHandle<V> base: play/pause/stop/finished;
                                 eliminates the three-way DRY violation lib-light F-2/F-3)
NEW                           → src/animation/svg/index.ts  (barrel)
```

The three factories each extend `AnimationHandle` rather than duplicating
`play/pause/stop/finished` delegates. `autoPlay` boilerplate moves to `AnimationHandle` constructor
(lib-light F-3).

The `svg/` zone is HEAVY (static `import { CSSKeyframesAnimation } from "./engine/index"` after
the engine move). The barrel `index.ts` stays at the `src/animation/` root — no change. The
`proof:boundary` SOURCE-GREP complement assertion (4) already passes because the SVG factories were
already HEAVY; the move makes their HEAVY status structural.

#### `engine/` shell (R.W1 portion only)

Evidence: gestalt-library §3,§5; challenge-library §1b (proof-engine retarget).

The full god-class CARVE is R.W2. In R.W1, create the directory shell and do the pure moves:

```
src/animation/engine.ts            → src/animation/engine/animation.ts
                                      (moved as-is; 1420L — reds proof:decomposition;
                                       that red IS the R.W2 carve backlog)
src/animation/engine-composition.ts→ src/animation/engine/composition.ts
src/animation/engine-css-metadata.ts→ src/animation/engine/css-metadata.ts
src/animation/engine-options.ts    → src/animation/engine/options.ts
src/animation/engine-playback.ts   → src/animation/engine/playback.ts
NEW                                 → src/animation/engine/index.ts
```

`engine/index.ts` becomes the bundling seam (gestalt-library §5):
```ts
export { KeyframesAnimation } from "./animation";
export { CSSKeyframesAnimation } from "./animation";   // until css-animation.ts split (R.W2)
export { AnimationGroup } from "../group";
export { getTimingFunction } from "../compile/easing-registry";
export { resolveKeyframes } from "../adapter";
export { DIRECTIONS, FILL_MODES, defaultOptions, defaultLayerConfig } from "../constants";
```

`load-engine.ts` re-points `import("./engine")` → `import("./engine/index")`.

The `group.ts` flat siblings mirror the same pattern:

```
src/animation/group.ts             → src/animation/group/group.ts
src/animation/group-soa.ts         → src/animation/group/soa.ts
src/animation/group-layer-springs.ts→ src/animation/group/layer-springs.ts
                                      (moved as-is; the 3-way split is R.W2)
NEW                                  → src/animation/group/index.ts  (barrel)
```

---

### 2f. `load-engine.ts` slim + granular accessor excision (co-edit 2 dependency)

Evidence: gestalt-library §6; challenge-library §3; lib-boundary (referenced in gestalt).

**EXCISE** `loadEngine` / `loadCompiler` / `loadIngest` + their 3 surface interfaces
(`EngineCore`, `CompilerSurface`, `IngestSurface`) + the dead `_compileMod` / `_ingestMod` /
`_scrollMod` memo vars from `load-engine.ts`. Zero real call sites: 0 cross-codebase consumers of
the three granular accessors (verified: demo has 47 `loadAnimationEngine` references, 0 for the
granular trio — challenge-library §3). This is EXCISE per the precept rubric (dead surface,
never-occurring condition).

All inline dynamic imports re-pointed to new paths:
- `import("./engine")` → `import("./engine/index")`
- `import("./compile")` → `import("./compile/index")`  ← new compile barrel
- `import("./ingest")` → `import("./ingest/index")`
- `import("./scroll-scene")` → `import("./scroll/index")`
- Inline imports: `./animate`, `./svg/motion-path`, `./svg/draw-svg`, `./svg/morph-svg`,
  `./validate`, `./presets/index`, `./compile/format`, `./compile/parse-flatten`,
  `./internal/scheduler`

Projected slim: ~559L → ~310L (gestalt-library §6). Stays a root file at 310L — under the gate;
no directory warranted.

---

### 2g. `index.ts` barrel re-points (mechanical)

Every `export {…} from "./<flat-name>"` in `src/animation/index.ts` re-points to the new zone
path. The barrel form (`export {…} from`) is unchanged — same symbol set, new paths. The
`proof:boundary` SELF-ENFORCING ENTRY SET assertion (2) parses these statements; path changes
are transparent to it.

Key re-points (non-exhaustive):
- `"./spring"` → `"./physics/spring"`
- `"./springLinearStops"` → `"./physics/spring"` (merged into spring barrel)
- `"./numeric"`, `"./smooth"`, `"./playback"`, `"./oscillator"`, `"./decay"`, `"./morph"` → `"./physics/<name>"`
- `"./stagger"`, `"./flip"` → `"./orchestration/<name>"`
- `"./drag"` → `"./orchestration/drag"`
- `"./sequence"` → `"./orchestration/sequence"`
- `"./timeline"` → `"./orchestration/timeline"`
- `"./waapi"` → `"./waapi/index"` (HEAVY; type-only on barrel or through load-engine)
- `"./engine"` → `"./engine/index"` (type-only re-exports on barrel)
- `"./animations"` → `"./presets/index"` (type-only; runtime behind loadAnimationEngine)

---

### 2h. `internal/` barrel question

Evidence: challenge-library §2; R.md §2 last bullet.

`internal/` has NO `index.ts` today (challenge-library §2 verified: consumers import by direct
file path). The barrel-per-directory rule is a NEW convention for the zone directories, justified
by the LIGHT/HEAVY re-export seam (the barrel is WHERE `export {…} from "./physics/spring"` lives).
This is NOT a continuation of the `internal/` precedent — it is a departure.

**Decision:** Give `internal/` a barrel (`internal/index.ts`) for genuine consistency. Without it,
`internal/` is the sole exception to the barrel rule across 10 zone directories, requiring a
bespoke justification every time it is cited. With it, the rule is universal. The barrel is
`export * from "./errors"; export * from "./leaves"; …` — 6 lines. The two NEW internal files
added in this wave (`scroll-phases.ts`, `event-registry.ts`) are part of the same barrel.
Consumers may continue to import by direct path (no breaking change); the barrel is additive.

---

## 3. Born-RED gate

**Name:** `proof:no-flat-siblings`

**Asserts:**

1. No `src/animation/*.ts` file exists whose name matches the flat-hyphenated-sibling pattern
   `<base>-<suffix>.ts` where `<base>` names a zone family (engine, group, spring, compile, waapi,
   frame-compiler, ingest, scroll, sequence, drag). Concretely: none of
   `engine-*.ts`, `group-*.ts`, `spring-*.ts` (or `spring[A-Z]*.ts`),
   `compile-*.ts`, `waapi-*.ts`, `frame-compiler-*.ts`, `ingest-*.ts`,
   `scroll-*.ts`, `sequence-*.ts`, `drag-2d.ts`, `animations.ts` survive as flat files.

2. Every introduced zone directory (`physics/`, `orchestration/`, `engine/`, `group/`, `compile/`,
   `resolve/`, `ingest/`, `scroll/`, `presets/`, `svg/`) contains an `index.ts` barrel.

3. The count of known-violations entries in
   `.dependency-cruiser-known-violations.json` is STRICTLY LESS than its value at the start of
   R.W1 (the 15 sibling cycles dissolve as the families become directories with single barrel
   imports).

**Script location:** `scripts/proof-no-flat-siblings.mjs`

**Plant test (what RED-state proves it bites):**

Add `engine-playback.ts` back as a flat file in `src/animation/` alongside the new `engine/`
directory — without the directory containing the file. Run `proof:no-flat-siblings`. Assertion (1)
must RED with `engine-playback.ts` in the violation list. Remove the spurious flat file; confirm
GREEN.

Alternatively (for assertion 3): run the gate immediately AFTER the moves but BEFORE updating
`.dependency-cruiser-known-violations.json`. Must RED (new violation paths no longer map to old
baseline entries). Update the baseline; confirm GREEN.

---

## 4. Challenge-tempered cautions (R.md §2 overrides)

- **The 3 gate co-edits are first-class steps, each with a re-RED test.** The gestalt's
  "zero-gate-change / path change only" framing was falsified by challenge-library §1. Gate
  co-edits (2b, 2c, 2d) are not optional cleanup — they are the difference between a working gate
  and a silently-blind or hard-red gate. Each co-edit lands atomically with its corresponding
  file move.

- **`presets/classic.ts` data-volume: do NOT force a 3-way taxonomy split.** The
  `classic-enter/exit/attention` split is CONTRIVED (challenge-library §4b). If the gate reds on
  `classic.ts` (~700L, 54% raw CSS strings), the correct disposition is a single documented
  data-volume override entry (one rationale-bearing exception), not a forced split.

- **`internal/` barrel is a deliberate NEW convention, not a continuation of the old precedent.**
  The gestalt mis-cited `internal/` as "the proven barrel pattern" when `internal/` has NO barrel
  (challenge-library §2). This spec corrects: `internal/` gets a barrel for genuine consistency.
  Argue the barrel on its merits (LIGHT/HEAVY seam), not on a false precedent.

- **Engine/group carve NOT in this wave.** `engine/animation.ts` at 1420L and `group/group.ts` at
  924L will red `proof:decomposition` after the override delete. Those reds ARE the R.W2 backlog —
  measured by the gate, discharged by the carve.

- **`useSceneSwap` STAYS.** No demo changes in this wave.

- **The decomposition keystone is the SIMPLE fix:** DELETE the `LIBRARY_CEILING_OVERRIDE` map and
  set one hard ceiling. Do NOT rebuild governance machinery (R.md §2 second bullet).

- **`animate.ts` stays at root** pending the promote-or-excise product call (R.W4). This wave does
  not pre-judge it.

---

## 5. Verification + DEV/IMPL boundary

**This spec is authored now (R.W0 DEV phase). IMPL opens on explicit authorization.**

Verification steps post-IMPL:

1. `npm run build` — zero TypeScript errors; bundle emits identical chunk graph (engine still a
   non-entry dynamic chunk).
2. `node scripts/proof-boundary.mjs` — GREEN (all four assertions pass with widened `isHeavyEngine`
   and trimmed `DYNAMIC_ACCESSORS`).
3. `node scripts/proof-engine.mjs` — GREEN (retargeted to `engine/animation.ts`).
4. `node scripts/proof-decomposition.mjs` — reds ONLY on `engine/animation.ts` (1420L),
   `group/group.ts` (924L), `waapi/waapi.ts` (579L), `presets/classic.ts` (~700L data-volume)
   — those reds are the R.W2 carve backlog.
5. `node scripts/proof-no-flat-siblings.mjs` — GREEN.
6. `.dependency-cruiser-known-violations.json` entry count is LOWER than pre-R.W1 (the 15 sibling
   cycles discharged).
7. `npm test` — full test suite GREEN (no import path regressions).
8. Demo dev server starts; `loadAnimationEngine()` resolves; `proof:ci-coverage` GREEN.
