# Tranche R — lib-support lane audit

**Files in scope:** `src/animation/utils.ts` (435L), `src/animation/format.ts` (488L),
`src/animation/constants.ts` (351L), `src/animation/easing.ts` (96L),
`src/animation/validate.ts` (242L), `src/animation/animate.ts` (213L),
`src/animation/internal/binarySearch.ts`, `src/animation/internal/errors.ts`,
`src/animation/internal/leaves.ts`, `src/animation/internal/reduced-motion.ts`,
`src/animation/internal/scheduler.ts`

---

## Finding 1 — `utils.ts` is a genuine junk-drawer (5 unrelated concerns, 435L)

**Severity: high | Category: god-module / decomposition**

`utils.ts` exports five semantically distinct things that have no cohesion with each other:

| Export | Semantic zone | Natural home |
|--------|--------------|--------------|
| `getTimingFunction` | Easing-registry lookup (heavy, uses `timingFunctions` from value.js) | `internal/easing-registry.ts` or alongside `easing.ts` as a heavy companion |
| `parseAndFlattenObject` + `ParsedVarMap` | CSS leaf-parsing pipeline (flattenToValueUnits, splitPathKey, applyPropertyContext, tryParseLeaves) | `internal/parse-flatten.ts` |
| `createInterpVarValue` | Interpolation-pair setup (identity-pad logic, fnName provenance) | `internal/interp-setup.ts` or into `frame-compiler.ts` directly |
| `calcFrameTime` | Frame time arithmetic (duration × percent) | `frame-compiler.ts` (its sole consumer is `frame-compiler.ts:346`) |
| `transformTargetsStyle` | DOM style-write renderer (the default `_defaultTransform`) | `internal/dom-renderer.ts` or directly in `engine.ts` |

The file has `getTimingFunction` (an easing concern) and `transformTargetsStyle` (a DOM renderer) sitting next to `parseAndFlattenObject` (CSS parsing). No unifying abstraction connects them.

**Importers of utils.ts:**
- `engine.ts:80-83` — imports `getTimingFunction`, `transformTargetsStyle`, `ParsedVarMap`
- `frame-compiler.ts:35-40` — imports `calcFrameTime`, `createInterpVarValue`, `getTimingFunction`, `ParsedVarMap`
- `format.ts:24` — imports type `ParsedVarMap`
- `load-engine.ts:99` — imports type `transformTargetsStyle` (for the surface interface)

**Proposal:** Decompose into cohesive sub-modules:
1. `internal/parse-flatten.ts` — the CSS-leaf pipeline: `flattenToValueUnits`, `splitPathKey`, `applyPropertyContext`, `tryParseLeaves`, `parseAndFlattenObject`, `ParsedVarMap`.
2. `internal/easing-registry.ts` — `getTimingFunction` (the heavy sync resolver). This is the heavy-side counterpart to the light async `resolveEasing` in `easing.ts`; collocating them under a shared directory makes the split explicit.
3. `calcFrameTime` — move directly into `frame-compiler.ts`; it is a 10-line frame-time arithmetic helper used only there.
4. `transformTargetsStyle` — move into `internal/dom-renderer.ts` (or directly inline into `engine.ts`). The module-scope `_styleOut` buffer travels with it.
5. `createInterpVarValue` — move into `internal/parse-flatten.ts` or `frame-compiler.ts`; it is the downstream consumer of `ParsedVarMap` that creates the interp-var arrays.

---

## Finding 2 — `getTimingFunction` has two silent-swallow `catch` blocks (warn-worthy fallthrough)

**Severity: medium | Category: workaround / fallback**
**File:** `src/animation/utils.ts:168-172`, `196-200`

```ts
// utils.ts:167-173
if (STEPS_PREFIX.test(timingFunction)) {
    try {
        const { count, jumpTerm } = parseSteps(timingFunction);
        return steppedEase(count, jumpTerm);
    } catch {
        // fall through to the registry / undefined
    }
}
```

```ts
// utils.ts:195-201
if (LINEAR_PAREN_PREFIX.test(timingFunction)) {
    try {
        return cssLinear(parseLinearStops(timingFunction));
    } catch {
        // fall through to the registry / undefined
    }
}
```

Both blocks match the exact prefix (e.g. `steps(`), call value.js parsers that validate and throw on malformed input, and then SILENTLY swallow the throw and fall through to the registry. The comment says "degrades to the registry lookup exactly as before" — but any string that passes `STEPS_PREFIX.test()` but makes `parseSteps` throw is definitionally a *malformed* `steps(...)` literal; there is no value.js registry entry for a malformed literal, so the ultimate return is `undefined` silently. The caller at `engine.ts:1361` does document the parse-path intent ("unrecognized per-keyframe timing-function falls back to the inherited easing"), but the `catch {}` with NO logging means a typo like `steps(abc)` is lost without a trace.

**Proposal:** Replace empty `catch {}` with a diagnostic emit or at minimum a structured rethrow under a `DEV` guard. The per-keyframe ingest path that intentionally produces `undefined` (engine.ts:1355-1367) should document WHY that specific call site returns undefined, not rely on the silent catch two levels below. Alternatively, the parsers already distinguish invalid from unrecognized — catch the specific value.js error type and only fall through for "not a steps/linear literal," throw explicitly for "malformed steps/linear literal."

---

## Finding 3 — `constants.ts` mixes five distinct concern groups (god-constants, 351L)

**Severity: high | Category: god-module / decomposition**

`constants.ts` is used by 30+ files across the codebase. Its 351 lines mix:

| Lines | Concern | Cohesive sub-module |
|-------|---------|---------------------|
| 17–45 | CSS vocabulary arrays (`DIRECTIONS`, `FILL_MODES`, `COLOR_SPACES`, `HUE_METHODS`) | `internal/css-vocab.ts` |
| 47–84 | Core animatable types (`Vars`, `TimingFunction`, `TransformFunction`, `NOOP_TRANSFORM`, `Easing`) | `types.ts` or `internal/types.ts` |
| 86–188 | Frame data shapes (`TemplateAnimationFrame`, `AnimationFrame`, `NumericFoldPlan`) | `internal/frame-types.ts` — these are frame-compiler implementation shapes, not public "constants" |
| 202–293 | Animation options (`AnimationOptions`, `InputAnimationOptions`, `defaultOptions`, `CompositeOperator`) | `options.ts` |
| 295–351 | Layer config (`BlendMode`, `WeightStepper`, `AnimationLayerConfig`, `defaultLayerConfig`) | `internal/layer-config.ts` |

The most egregious misplacement is `NumericFoldPlan` (lines 123–129) and `AnimationFrame._numericPlan` (line 169). `NumericFoldPlan` is a `frame-compiler-numeric.ts` implementation detail — it is used only by `frame-compiler-numeric.ts:30,61` and `constants.ts` itself as the type of `_numericPlan`. Moving it to `frame-compiler-numeric.ts` or a new `internal/frame-types.ts` removes an implementation detail from the shared-types file.

Similarly `WeightStepper` / `AnimationLayerConfig` / `BlendMode` / `defaultLayerConfig` are group-layer configuration types; they belong nearer `group.ts` than a "constants" file.

**Proposal:** Split `constants.ts` into two or three modules:
- `src/animation/options.ts` — `AnimationOptions`, `InputAnimationOptions`, `defaultOptions`, `CompositeOperator`, `DIRECTIONS`, `FILL_MODES`, `COLOR_SPACES`, `HUE_METHODS` (the option-tier data). This is what `engine-options.ts` and all setters truly need.
- `src/animation/types.ts` (or keep minimal exported types inline in their consumers) — `Vars`, `Easing`, `TimingFunction`, `TransformFunction`, `NOOP_TRANSFORM`.
- Keep `internal/frame-types.ts` for `TemplateAnimationFrame`, `AnimationFrame`, `NumericFoldPlan`.
- Move `BlendMode`, `WeightStepper`, `AnimationLayerConfig`, `defaultLayerConfig` to `group.ts` or a new `src/animation/layer-config.ts`.

With 30+ importers the split must be done in one atomic pass or the barrel (`index.ts`) must re-export during transition.

---

## Finding 4 — `format.ts` leaks compile-only primitives into the serialization module (488L, boundary violation)

**Severity: high | Category: encapsulation / api-surface**
**File:** `src/animation/format.ts:240–403`

`format.ts` contains four functions that are exclusively consumed by `compile.ts` and never by any other module:

```ts
// format.ts:240 — used only in compile.ts:61,399
export function keyframesBlock<V extends Vars>(...): string

// format.ts:298 — used only in compile.ts:62,372
export function premultipliedKeyframesBlock<V extends Vars>(...): PremultiplyResult

// format.ts:373 — used only in compile.ts:60,406
export function animationShorthand(options: AnimationOptions, name: string): string

// format.ts:397 — used only in compile.ts:59,422
export function animationComposition(composition: CompositeOperator): string | undefined
```

These four compile primitives comprise ~164 lines that belong in `compile.ts` or a dedicated `src/animation/compile-primitives.ts`. `format.ts` is conceptually the "serialization" module (the `@keyframes` block + the `.class` block → CSS string); the compiler (`compile.ts`) is the "orchestration graph → CSS artifact" module. Compile primitives belong in the compiler's own file, not borrowed from the serializer.

The circular pull is subtle: `compile.ts` imports from `format.ts`, and `format.ts` imports type `ParsedVarMap` from `utils.ts`. The compile primitives in `format.ts` reach into `parse.ts`-adjacent data through `declaredKeyframeBody`, which itself lives in `format.ts`. Moving the four primitives to `compile.ts` (with `declaredKeyframeBody` exported or inlined) would make the dependency graph acyclic and the boundaries explicit.

**Proposal:** Move `keyframesBlock`, `premultipliedKeyframesBlock`, `animationShorthand`, `animationComposition`, and `PremultiplyResult` to `compile.ts` (or a new `src/animation/compile-keyframes.ts` that `compile.ts` imports from). `format.ts` retains: `serializeEasing`, `CSSKeyframesToString`, `CSSKeyframesToStrings`, `formatCSSKeyframeString`, `animationOptionsToString`, `declaredKeyframeBodyFor`, `propertyRegistryToString`. That trims `format.ts` by ~165 lines and gives `compile.ts` ownership of all its own primitives.

---

## Finding 5 — Stale cross-reference comment: `SPRING_PAREN` branch that does not exist

**Severity: low | Category: dead-code (stale documentation)**
**File:** `src/animation/resolve-values.ts:220`

```ts
// resolve-values.ts:220
 * NOTE: the `getTimingFunction` (`utils.ts`) `SPRING_PAREN` branch that wires
 * this into per-keyframe `animation-timing-function` strings is the utils-lane
 * seam; this helper is the kf-owned core both call sites consume.
```

`getTimingFunction` in `utils.ts` has no `SPRING_PAREN` / `spring()` handler. The comment references a branch that does not exist in the current codebase. A git blame confirms no such branch was ever merged: `utils.ts` never contained a `spring(` parse arm. The `resolveSpringTiming` function at `resolve-values.ts:229` is real and is the "kf-owned core" mentioned, but the `getTimingFunction` SPRING_PAREN seam does not exist.

**Proposal:** Remove or rewrite the "NOTE" comment in `resolve-values.ts:220–222`. If `spring()` timing function support through `getTimingFunction` is genuinely planned, file it as a named TODO with a tracking label. Do not leave a comment describing non-existent code.

---

## Finding 6 — `constants.ts` re-exports value.js types that blur the public API surface

**Severity: medium | Category: api-surface / encapsulation**
**File:** `src/animation/constants.ts:11–15`

```ts
// constants.ts:11-15
export type {
    ColorSpace,
    HueInterpolationMethod,
    InterpolatedVar,
} from "@mkbabb/value.js";
```

`constants.ts` re-exports three value.js types directly onto the public keyframes surface (via `index.ts:131`). `ColorSpace` and `HueInterpolationMethod` are CSS Color 4 vocabulary types; `InterpolatedVar` is a value.js interpolation-engine implementation type that consumers should never need to reference by name. The re-export means a keyframes consumer can write `import type { InterpolatedVar } from "@mkbabb/keyframes.js"` and depends on a value.js internal shape as a public API contract.

**Proposal:** Remove the `InterpolatedVar` re-export from `constants.ts` and `index.ts` — it is not a keyframes public-API type. If `ColorSpace` and `HueInterpolationMethod` must be on the barrel (for `AnimationOptions.colorSpace`), re-export them from the new `options.ts` module with a narrower path and an explicit comment that they are re-exported from value.js's COLOR 4 vocabulary, not kf originals.

---

## Finding 7 — `easing.ts` makes a dynamic import of `"./engine"` instead of a narrower boundary

**Severity: low | Category: encapsulation / brittleness**
**File:** `src/animation/easing.ts:75–96`

```ts
// easing.ts:76-88
let engine: typeof import("./engine");
try {
    engine = await import("./engine");
} catch (cause) {
    throw new Error(`keyframes: the engine chunk failed to load...`, { cause });
}
const fn = engine.getTimingFunction(name);
```

`resolveEasing` dynamically imports the ENTIRE `engine.ts` module to call one function: `getTimingFunction`. `engine.ts` is 1420 lines. The goal is the value.js `timingFunctions` registry (about 10 KB). After the Finding 1 decomposition (moving `getTimingFunction` to `internal/easing-registry.ts`), the dynamic import in `easing.ts` should narrow to `import("./internal/easing-registry")` — pulling only the registry, not the full engine class hierarchy. Under the current flat structure, this narrowing is impossible without the decomposition.

**Proposal:** After Finding 1 is implemented (extracting `getTimingFunction` to its own module), update `easing.ts:resolveEasing` to `await import("./internal/easing-registry")` rather than the full engine. This also removes the fragile "engine chunk failed to load" error path that conflates a registry lookup failure with an engine initialization failure.

---

## Finding 8 — `format.ts` performs direct string manipulation instead of the serializer-only path (brittleness)

**Severity: low | Category: brittleness**
**File:** `src/animation/format.ts:157–168`, `487–488`

```ts
// format.ts:157-168 — regex string scraping
export function formatCSSKeyframeString(keyframe: string) {
    let s = keyframe
        .replace(/^[^{]*{/, "")
        .replace(/^  /gm, "")
        .replace(/}\s*$/, "");
    s = s.trim();
    s = s.replace(/^  /, "");
    return s;
}
```

```ts
// format.ts:487-488 — post-processing Prettier output with regex
return out.replace(/\(\s*\{/g, "{").replace(/\}\s*\)/g, "}");
```

`formatCSSKeyframeString` is a regex scraper over an already-formatted CSS string to strip the `@keyframes` wrapper for display. This is fragile — it depends on the exact output format of `formatCSS` (Prettier), and the regex `replace(/^  /gm, "")` silently misses lines with more or fewer spaces. The bottom of `CSSKeyframesToString` applies two regexes as a post-Prettier fixup (`/\(\s*\{/g` and `/\}\s*\)/g`) to correct Prettier's mangling of keyframe-block grouper syntax. Both are brittleness patterns: they post-process a formatter's output with assumptions about its output format.

**Proposal:** The Prettier post-fixup should be documented with the exact Prettier version and rule that produces the incorrect output, or the Prettier configuration should be adjusted to not produce the incorrect format in the first place. The `formatCSSKeyframeString` regex chain should be replaced with a structured extract that does not depend on the exact indentation produced by `formatCSS`.

---

## Summary table

| # | Finding | Severity | Category | File(s) |
|---|---------|----------|----------|---------|
| 1 | `utils.ts` is a 5-concern junk-drawer (435L) | high | god-module / decomposition | `utils.ts` |
| 2 | `getTimingFunction` silent-swallow `catch {}` blocks | medium | workaround / fallback | `utils.ts:168-200` |
| 3 | `constants.ts` mixes 5 unrelated concern groups (351L) | high | god-module / decomposition | `constants.ts` |
| 4 | `format.ts` leaks compile-only primitives (4 functions, ~164L) | high | encapsulation / api-surface | `format.ts:240-403` |
| 5 | Stale `SPRING_PAREN` cross-reference to a non-existent branch | low | dead-code | `resolve-values.ts:220` |
| 6 | `constants.ts` re-exports `InterpolatedVar` as public API | medium | api-surface / encapsulation | `constants.ts:11-15` |
| 7 | `easing.ts` dynamic-imports full engine to call one function | low | encapsulation / brittleness | `easing.ts:76-88` |
| 8 | `format.ts` regex-scrapes Prettier output as a post-fixup | low | brittleness | `format.ts:157-168,487` |

---

## What is CLEAN in this lane

- `validate.ts` (242L): clean READ-ONLY projection. Well-bounded, no hidden state, explicit fail paths. No action needed.
- `animate.ts` (213L): clean construction-time dispatch. The dispatch chain is explicit with a fail-explicit `else throw`. No action needed.
- `easing.ts` (96L): clean light-boundary module. The two-regex `CSS_NATIVE_KEYWORD`/`CSS_FUNCTION_EASING` fast-paths are appropriate. Only the dynamic import breadth (Finding 7) is worth revisiting after decomposition.
- `internal/binarySearch.ts`: single-purpose, well-named, correct complexity. No action needed.
- `internal/errors.ts`: clean typed error hierarchy, value.js-free. No action needed.
- `internal/reduced-motion.ts`: the PRM singleton with invalidation on `matchMedia` identity swap is the right approach. `withReducedMotion` / `reducedMotionScale` are clean. No action needed.
- `internal/scheduler.ts`: the `yieldToMain` progressive-enhancement pattern with one-time fallback detection is correct. No action needed.
- `internal/leaves.ts`: the rAF shim + re-export from `@mkbabb/value.js/math` is the right pattern post Q.WE2. No action needed.
