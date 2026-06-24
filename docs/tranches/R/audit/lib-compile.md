# Tranche R — Lane: lib-compile

**Lane verdict:** The compile cluster (forward compiler `frame-compiler.ts`, backward compiler `compile.ts`, oklab densifier `compile-color.ts`, serializer `format.ts`, interp utilities `utils.ts`) is architecturally sound on the critical path but carries three distinct problem sets: (1) a cosmetic decomposition regression from Q — `frame-compiler-numeric.ts` is a 77-line appendage that should fold back into its sole consumer; (2) a significant DRY violation in `format.ts` — the per-stop body logic is duplicated verbatim between `declaredKeyframeBody` and `premultipliedKeyframesBlock`; (3) a cluster of minor but real code-quality issues: a dead-code branch in `addFrame`, a dead export (`declaredKeyframeBodyFor`), a legitimate deferred fallback (P.W9 named-selector NaN sort), and a non-trivial per-call O(N) scan buried in `reconcileVars`. The backward compiler (`compile.ts` + `compile-color.ts`) is genuinely well-partitioned; no decomposition is warranted there. The forward-compile cluster (`frame-compiler.ts`, `utils.ts`, `format.ts`) is a prime candidate for a `src/animation/compile/` sub-directory grouping.

---

## F1 — `frame-compiler-numeric.ts`: Cosmetic Decomposition — FOLD BACK

**Severity:** medium  
**Category:** decomposition

### Evidence

`frame-compiler-numeric.ts` (77 lines) exports exactly two symbols — `isNumericInterpVar` (lines 43–48) and `buildNumericPlan` (lines 59–77) — and has one and only one consumer:

```
/Users/mkbabb/Programming/keyframes.js/src/animation/frame-compiler.ts:33:
    import { buildNumericPlan } from "./frame-compiler-numeric";
/Users/mkbabb/Programming/keyframes.js/src/animation/frame-compiler.ts:584:
    frame._numericPlan = buildNumericPlan<V>(frame.allInterpVars);
```

`isNumericInterpVar` is not imported anywhere outside `frame-compiler-numeric.ts` itself. `buildNumericPlan` is called in exactly one place: `FrameCompiler.finalizeFrameVars` at frame-compiler.ts:584.

The Q.WF1 extraction rationale (frame-compiler-numeric.ts:1–27) claims "cohesive INTERNAL gestalt seam." The cohesion argument fails: the two functions have a total of 3 lines of logic each, they are not independently testable without `frame-compiler.ts`'s `allInterpVars` set, and `isNumericInterpVar` is not re-used anywhere. This is the archetypal Q flat-hyphenated-sibling anti-pattern the audit was warned about.

The file creates 77 lines of module overhead (module comment, imports, two `export const/function` wrappers) to hold 35 lines of actual logic. Folding them into `frame-compiler.ts` as private unexported functions reduces the flat sibling count by one and eliminates a superfluous import hop.

**Proposal:** Delete `frame-compiler-numeric.ts`. Move `isNumericInterpVar` and `buildNumericPlan` into `frame-compiler.ts` as module-private (non-exported) functions, immediately above `finalizeFrameVars`. The `NumericFoldPlan<V>` type stays in `constants.ts` (already there, `constants.ts:123`). No API change, no behavior change.

---

## F2 — `format.ts`: DRY Violation — Per-Stop Body Logic Duplicated

**Severity:** high  
**Category:** dry

### Evidence

`declaredKeyframeBody` (format.ts:86–121) builds the `{ prop: val; animation-timing-function: …; animation-composition: …; }` stop body from `parsedVars[i]` and the template frame's metadata. The SAME three-part logic — `unflattenObjectToString` → decl array → conditional easing → conditional composition → body string — appears a second time, inline, inside `premultipliedKeyframesBlock` (format.ts:326–339):

**First occurrence** (`declaredKeyframeBody`, lines 95–120):
```typescript
const decls = Object.entries(unflattenObjectToString(declared)).map(
    ([propName, v]) => `  ${camelCaseToHyphen(propName)}: ${v};`,
);
const frameEasing = templateFrame.timingFunction
    ? serializeEasing(templateFrame.timingFunction)
    : defaultEasing;
if (frameEasing !== defaultEasing) {
    decls.push(`  animation-timing-function: ${frameEasing};`);
}
const composition = templateFrame.composition;
if (composition != null && composition !== "replace") {
    decls.push(`  animation-composition: ${composition};`);
}
const css = decls.join("\n").trim();
return `{\n${css}\n}`;
```

**Second occurrence** (`premultipliedKeyframesBlock`, lines 326–339):
```typescript
const decls = Object.entries(unflattenObjectToString(scaled)).map(
    ([propName, v]) => `  ${camelCaseToHyphen(propName)}: ${v};`,
);
const frameEasing = templateFrame.timingFunction
    ? serializeEasing(templateFrame.timingFunction)
    : defaultEasing;
if (frameEasing !== defaultEasing) {
    decls.push(`  animation-timing-function: ${frameEasing};`);
}
const composition = templateFrame.composition;
if (composition != null && composition !== "replace") {
    decls.push(`  animation-composition: ${composition};`);
}
const body = `{\n${decls.join("\n").trim()}\n}`;
```

These are byte-for-byte identical except for the input `declared` vs `scaled`. The only structural difference is that `premultipliedKeyframesBlock` substitutes a pre-scaled `ParsedVarMap`; the stop-body assembly is otherwise the same contract.

**Proposal:** Extract a private `buildStopBody(decls: ParsedVarMap, templateFrame: TemplateAnimationFrame<V>, defaultEasing: string): string` function (or generalize `declaredKeyframeBody` to accept a `ParsedVarMap` override). `premultipliedKeyframesBlock` calls it with the scaled clone, `declaredKeyframeBody` calls it with `animation.parsedVars[i]`. This is 14 lines folded to one call-site each, and the easing/composition emit logic becomes a single authoritative definition.

---

## F3 — `declaredKeyframeBodyFor` in `format.ts`: Dead Export

**Severity:** low  
**Category:** dead-code

### Evidence

`format.ts:223–229` exports a one-line pass-through wrapper:

```typescript
export function declaredKeyframeBodyFor<V extends Vars>(
    animation: KeyframesAnimation<V>,
    i: number,
    defaultEasing: string,
): string {
    return declaredKeyframeBody(animation, i, defaultEasing);
}
```

This function has zero callers anywhere in the codebase:
```
$ grep -rn "declaredKeyframeBodyFor" src/ → format.ts:223 only
```

It was presumably added as a "public seam" for `compile.ts` at K.W10, but `compile.ts` calls `keyframesBlock` directly (format.ts:240), which in turn calls the private `declaredKeyframeBody`. The wrapper is dead surface area on an otherwise-internal module.

**Proposal:** Delete `declaredKeyframeBodyFor` (format.ts:212–229). No callers exist; no API change.

---

## F4 — `addFrame` No-Op `else if` Branch

**Severity:** low  
**Category:** dead-code

### Evidence

`frame-compiler.ts:241–248`:

```typescript
if (typeof start === "number") {
    start = String(start) + "%";
} else if (typeof start === "string") {
    start = start;           // ← pure no-op assignment
} else if (start instanceof ValueUnit) {
    start = String(start);
}
```

The `start = start` branch (line 244) is a dead no-op: it re-assigns the variable to itself and produces no observable effect. The `start` parameter is `number | string | ValueUnit<number>` (frame-compiler.ts:235); for the `string` case no transformation is needed, so the branch is correct behavior — but the explicit no-op is misleading. A reader might wonder "is something being normalized here?" when the answer is "nothing."

**Proposal:** Remove the `else if (typeof start === "string") { start = start; }` branch entirely. The code then falls through to `selector = start.trim()` (line 262) unchanged.

---

## F5 — `NAMED_SELECTOR_PHASES` in `frame-compiler.ts`: Intentional Book Duplication — But Needs a Sync Guard

**Severity:** low  
**Category:** brittleness

### Evidence

`frame-compiler.ts:148–153` declares:
```typescript
const NAMED_SELECTOR_PHASES: Record<string, { start: number; end: number }> = {
    entry: { start: 0, end: 0.25 },
    cover: { start: 0.25, end: 0.75 },
    contain: { start: 0.375, end: 0.625 },
    exit: { start: 0.75, end: 1 },
};
```

`scroll-scene.ts:99–106` declares:
```typescript
const PHASE_FRACTIONS: Record<RangePhase, { start: number; end: number }> = {
    normal: { start: 0, end: 1 },
    cover: { start: 0.25, end: 0.75 },
    contain: { start: 0.375, end: 0.625 },
    entry: { start: 0, end: 0.25 },
    exit: { start: 0.75, end: 1 },
    "entry-crossing": { start: 0, end: 0.25 },
    "exit-crossing": { start: 0.75, end: 1 },
};
```

The comment at frame-compiler.ts:146 justifies the duplication as "a LOCAL numeric copy… NOT a runtime import, so `frame-compiler.ts` does NOT couple to the HEAVY scroll-scene module." This is architecturally correct — the import penalty of pulling a 539-line scroll-scene module into the compile hot-path is unacceptable. The duplication is intentional and the note says "the DATA is duplicated; the LOGIC lives once."

The brittleness is that these two tables can silently drift. If `scroll-scene.ts`'s `contain` phase fractions change, `frame-compiler.ts`'s resolver will produce wrong CSS offsets. There is no compile-time or test-time guard against this.

**Proposal:** Add a unit test in the compile gate suite that asserts `namedSelectorToFraction("entry") === 0.0`, `namedSelectorToFraction("cover") === 0.25`, etc. — pinning the book values against their scroll-scene equivalents. This is a documentation-level brittleness only if tests confirm it; without a test the drift is a real latent bug.

---

## F6 — P.W9 Named-Selector NaN Sort: Deferred Fallback Behavior

**Severity:** medium  
**Category:** fallback

### Evidence

`frame-compiler.ts:509–522`:
```typescript
// P.W9 (DM-22 named-selector NaN-frame) — DEFERRED to a follow-up wave.
// …
// here we keep the shipped (tranche-L) behavior: named frames round-trip;
// the NaN is latent at sample-time only (no timeline = user error, surfaced at play).
this.templateFrames.sort((a, b) => a.start.value - b.start.value);
```

When a template frame carries a `NAMED_SELECTOR_SUPERTYPE`-tagged `ValueUnit`, `start.value` is the raw string (e.g. `"entry"`) rather than a number. `"entry" - "entry"` in JavaScript produces `NaN`. `Array.sort` with a comparator that returns `NaN` produces implementation-defined ordering — the sort contract is violated. This is not a user-visible crash but a latent incorrect frame ordering whenever a scroll-range named keyframe is compiled.

The comment explicitly labels this "DEFERRED" from P.W9. By the Tranche R precepts, deferred fallback behavior is a target: it must either be explicitly failed (throw at sort-time if any start is non-numeric) or properly fixed. The "user error at play" path is not explicit failure at the point of the contract violation.

**Proposal for R:** Sort only the numeric-start frames; collect named-selector frames as a separate opaque bucket that participates in ordering only after ScrollTimeline resolution. At minimum, add a guard before the sort: if `a.start.superType?.includes(NAMED_SELECTOR_SUPERTYPE)` or same for `b`, return 0 (treat as equal-order to preserve insertion order for unresolved named selectors). This replaces the silent NaN comparator with a stable, deterministic fallback.

---

## F7 — `reconcileVars` Remaining O(N) `frames.findIndex` Scan

**Severity:** low  
**Category:** brittleness

### Evidence

`frame-compiler.ts:478–480`:
```typescript
const frameIx = this.frames.findIndex(
    (f) => f.ixs.start === startIx && f.ixs.stop === endIx,
);
```

`reconcileVars` is called once per template frame index (frame-compiler.ts:542: `this.frames.forEach((_, ix) => this.reconcileVars(ix, varIndex))`). The `buildVarIndex` optimization (lines 431–443) removed the O(N) variable-occurrence scan but did not replace the `frames.findIndex` scan. For N template frames and M variables per frame, this is O(N × M × F) where F is the number of already-created frames.

For typical animations (≤20 keyframes, ≤10 variables) this is negligible. The real cost is readability: the code comment claims the optimization eliminated O(frames²) scans, but the `findIndex` re-introduces an inner O(frames) scan that is uncovered by the comment.

**Proposal:** Replace `this.frames.findIndex` with a `Map<string, AnimationFrame<V>>` keyed on `${startIx}:${endIx}` (a `frameMap` local to `parse`), built alongside `varIndex`. The map lookup is O(1); the existing push stays. This makes the reconcile loop genuinely O(N × M) rather than O(N × M × F) and makes the code match its own documentation claim.

---

## F8 — `compile-color.ts`: Per-Adjacent-Pair Inner 1024-Stop Resample

**Severity:** medium  
**Category:** brittleness

### Evidence

`compile-color.ts:203–206` inside `densifyKey`:
```typescript
const kfMid = sampleColorRamp(fromColor, toColor_, 1024, {
    space,
    ...hueOpt,
})[Math.round(tMid * 1023)]!;
```

This call is made **once per emitted stop pair** (`for (let s = 0; s + 1 < ramp.length; s++)`). For the default `stopCount = 16`, this loop runs 15 times per adjacent template-stop pair, allocating a 1024-element array and running the full perceptual ramp sampler each time — only to read a single element. For a 4-keyframe animation with 2 changing color keys, that is `3 pairs × 15 inner loops × 1024-element alloc = 45,000 samples`.

The correct approach: sample the reference ramp once per adjacent pair (outside the inner loop), then index into it per `s`. The reference ramp is the same `(fromColor, toColor_, 1024)` call for the entire adjacent pair.

**Proposal:** Hoist the 1024-stop reference ramp out of the inner ΔE proof loop. Before `for (let s = 0; s + 1 < ramp.length; s++)`, add:
```typescript
const refRamp = sampleColorRamp(fromColor, toColor_, 1024, { space, ...hueOpt });
```
Then change line 203 to `refRamp[Math.round(tMid * 1023)]!`. This reduces the alloc count from `O(stopCount × pairs)` to `O(pairs)`.

---

## F9 — `format.ts` + `compile.ts`: Flat Cluster Should Become `src/animation/compile/`

**Severity:** medium  
**Category:** decomposition

### Evidence

The compile cluster — the backward half of the round-trip — currently spans 5 flat sibling files:

| File | Lines | Role |
|---|---|---|
| `format.ts` | 488 | Serialization primitives: `declaredKeyframeBody`, `keyframesBlock`, `premultipliedKeyframesBlock`, `animationShorthand`, `CSSKeyframesToString/s` |
| `compile.ts` | 535 | Backward compiler: walker (group/sequence/list), refusal surface (CC-3), `compileToCSS` |
| `compile-color.ts` | 325 | Oklab densify (CC-2): `densifyColorBlock`, `densifyKey`, ΔE proof |
| `frame-compiler.ts` | 616 | Forward compiler: `FrameCompiler` class, selector grammar, `namedSelectorToFraction` |
| `utils.ts` | 435 | Parse+flatten pipeline: `parseAndFlattenObject`, `createInterpVarValue`, `getTimingFunction`, `calcFrameTime`, `transformTargetsStyle` |

These five files share a unified concern: the CSS keyframe compile pipeline (forward and backward). They import each other along clear dependency lines:
- `compile.ts` → `format.ts`, `compile-color.ts`
- `frame-compiler.ts` → `utils.ts`
- `format.ts` → `utils.ts` (type only)

They are never imported by the LIGHT barrel; all five live behind the `loadAnimationEngine()` dynamic boundary.

The current flat layout mixes these concerns with the other 45 animation files (engine, spring, scroll, WAAPI, morph, etc.) in a single directory with no grouping signal.

**Proposal:** Create `src/animation/compile/` sub-directory and move:
- `frame-compiler.ts` → `compile/frame-compiler.ts`
- `frame-compiler-numeric.ts` → DELETE (see F1, fold into frame-compiler)
- `compile.ts` → `compile/backward.ts`
- `compile-color.ts` → `compile/backward-color.ts`
- `format.ts` → `compile/format.ts`
- `utils.ts` → `compile/parse-flatten.ts` (the name reflects its actual job — parse, flatten, createInterpVar — vs. the generic "utils" misnomer)

Export a barrel `compile/index.ts` that re-exports the public surface (same symbols, same paths through `load-engine.ts`). Import paths in `engine.ts`, `engine-options.ts`, `load-engine.ts`, `validate.ts`, and `index.ts` update to `./compile/...`. No behavior change; the `loadAnimationEngine()` boundary stays intact.

---

## F10 — `utils.ts`: Misnamed God-Utilities Module

**Severity:** medium  
**Category:** god-module

### Evidence

`utils.ts` (435 lines) is a flat catch-all containing four conceptually distinct concerns:

1. **Flatten+parse pipeline** (`flattenToValueUnits`, `parseAndFlattenObject`, `tryParseLeaves` + LRU cache) — lines 57–308. These are frame-compile input processing.
2. **Interp-var construction** (`createInterpVarValue`, `padToLength`) — lines 310–386. These are the segment builder used by `FrameCompiler.reconcileVars`.
3. **Frame timing** (`calcFrameTime`) — lines 388–399. A 12-line pure math helper.
4. **DOM apply** (`transformTargetsStyle`, `_styleOut` reuse buffer) — lines 401–435. The default renderer, which runs on the hot rAF path.

The name "utils" signals nothing about what it holds. The DOM renderer (`transformTargetsStyle`) has no relationship to the parse/flatten pipeline; it belongs with the engine apply path. The interp-var constructor (`createInterpVarValue`) is a frame-compile concern. The timing helper (`calcFrameTime`) is trivial and could fold directly into `FrameCompiler.createFrame`.

Under the F9 `compile/` directory proposal, the correct split is:
- `transformTargetsStyle` + `_styleOut` → engine-side (e.g. `engine-apply.ts` or back into `engine.ts` which already imports it from utils)
- `flattenToValueUnits`, `parseAndFlattenObject`, `tryParseLeaves` → `compile/parse-flatten.ts`
- `createInterpVarValue`, `padToLength` → `compile/interp-var.ts` or fold into `compile/frame-compiler.ts`
- `calcFrameTime` → inline into `FrameCompiler.createFrame` (12 lines)
- `getTimingFunction` → belongs with easing; could merge into `easing.ts` which already handles timing function resolution

**Proposal:** Under the F9 migration, split `utils.ts` into named sub-modules with self-documenting names. Do not rename it `utils.ts` inside the subdirectory — the generic name would persist the problem.

---

## Summary Table

| Finding | Severity | Category | File(s) |
|---|---|---|---|
| F1: frame-compiler-numeric.ts is a cosmetic extraction | medium | decomposition | frame-compiler-numeric.ts, frame-compiler.ts |
| F2: per-stop body logic duplicated in format.ts | high | dry | format.ts:86–121, 326–339 |
| F3: `declaredKeyframeBodyFor` dead export | low | dead-code | format.ts:223–229 |
| F4: `start = start` no-op branch in addFrame | low | dead-code | frame-compiler.ts:244 |
| F5: NAMED_SELECTOR_PHASES duplication has no sync guard | low | brittleness | frame-compiler.ts:148, scroll-scene.ts:99 |
| F6: P.W9 NaN sort deferred fallback | medium | fallback | frame-compiler.ts:522 |
| F7: `reconcileVars` O(N) findIndex unaddressed | low | brittleness | frame-compiler.ts:478 |
| F8: CC-2 ΔE proof inner 1024-stop resample | medium | brittleness | compile-color.ts:203 |
| F9: compile cluster should be `src/animation/compile/` | medium | decomposition | format.ts, compile.ts, compile-color.ts, frame-compiler.ts, utils.ts |
| F10: `utils.ts` is a misnamed god-utilities module | medium | god-module | utils.ts |
