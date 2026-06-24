# Tranche R — Lane `lib-resolve` Audit

**Files:** `src/animation/resolve-values.ts` (796L) · `src/animation/compile-color.ts` (325L)  
**Adjacent files read:** `adapter.ts`, `utils.ts`, `engine.ts`, `compile.ts`

---

## Finding 1 — Dead-code callback + `void` suppressor (adapter.ts:235–238)

**Category:** dead-code / workaround  
**Severity:** medium

```ts
// adapter.ts:235-238
const onParseError: OnParseError = (d: ParseDiagnostic) => {
    diagnostics.push({ ...d, code: "PARSE_ERROR" });
};
void onParseError;
```

`parseCSSStylesheet` is typed as `Memoized<(input: string) => Stylesheet>` — it takes **no** `onParseError` parameter. The callback is constructed, never passed to anything, and suppressed with `void` to silence the TypeScript unused-variable error. `OnParseError` is imported (`adapter.ts:10`) purely for this dead symbol.

The `void` suppressor is itself a workaround smell: valid code does not need `void` to silence a legitimate value. The comment says "Ready for K.W8: … The CSSOM walk K.W8 owns threads THIS sink into its per-sheet parse…" — but K.W8 was delivered (shipped in Tranche K); `parseCSSStylesheet` was never extended to accept the callback.

**Proposal:** Delete `onParseError` + `void onParseError` + the `type OnParseError` import. The `PARSE_ERROR` row is wired correctly for the K.W8 CSSOM path via a different code path (`ingest-cssom.ts`). The dead symbol should not live in the hot-path `resolveKeyframes`.

---

## Finding 2 — `spring` declared resolvable but `resolveNode` has no spring arm (resolve-values.ts:624–693, 755)

**Category:** brittleness / workaround  
**Severity:** high

`hasResolvableValue` at line 755 flags `spring` as resolvable:
```ts
if (value.name === "if" || value.name === "spring") return true;
```

But `resolveNode` (lines 630–693) has **no `spring` dispatch arm**. A `spring()` `FunctionValue` falls through to the generic child-recurse path at line 676–692, which recurses into its children (all `ValueUnit` leaves) and returns them unchanged. The value passes through the `resolveValues` pipeline untouched.

The comment at lines 624–628 says "`spring` is handled at the timing-function seam (left intact as a keyframe value — a bare `spring()` keyframe value is degenerate; the gate exercises spring via `resolveSpringTiming`)". This means: `spring()` is intentionally *not* lowered as a value node, yet `hasResolvableValue` marks it resolvable. The gate-entry cost is paid (the declaration enters the `resolveValues` pass) and produces no transformation.

Additionally, `resolveSpringTiming` (lines 224–229) is exported but has **zero production call sites** — only test usage at `test/emerging-css-resolve-now.test.ts:142`. The JSDoc for `resolveSpringTiming` notes "the `getTimingFunction` (`utils.ts`) `SPRING_PAREN` branch that wires this into per-keyframe `animation-timing-function` strings" — but `utils.ts/getTimingFunction` has **no** `spring(...)` branch.

**Proposal:**
- Remove `"spring"` from `hasResolvableValue` so a `spring()` declaration does not spuriously enter the resolve pass.
- Either implement the missing `SPRING_PAREN` arm in `getTimingFunction` (dispatch `resolveSpringTiming` when `timingFunction.startsWith("spring(")`) or move `springCssToOptions`/`resolveSpringTiming` to `spring.ts`/`springTimingFunction.ts` where the physics lives, and delete the exports from `resolve-values.ts`. The current arrangement is a half-built seam with phantom exports.

---

## Finding 3 — `normalizeParam` workaround for value.js 1.2.0 `extractFunctions` bug (resolve-values.ts:363–413)

**Category:** workaround  
**Severity:** medium

```ts
// resolve-values.ts:402-411
// The default lives on `defaultValue` (a clean value.js build) OR on `type`
// (the 1.2.0 build mis-assigns the default-value string there). Prefer the
// explicit `defaultValue`; fall back to `type` only when it is NOT itself a
// `<syntax>` token (a `<length>` on `type` is a syntax, not a default).
const fromType =
    param.type !== undefined &&
    !(param.type.startsWith("<") && param.type.endsWith(">"))
        ? param.type
        : undefined;
const defaultValue = param.defaultValue ?? fromType;
```

Confirmed live against the installed value.js 1.2.0:
```
// node probe output:
{
  "parameters": [{ "name": "--x <length>", "type": "0px" }],
  "result": ["--x"]
}
```
`param.defaultValue` is `undefined`; `param.type` is `"0px"`. The workaround is genuinely load-bearing today.

However, the code is pinned to `^1.2.0` and the comment says "a clean value.js build" would use `defaultValue` — the fix must land in value.js first, then the `fromType` fallback must be excised. The workaround itself is fine for now but needs a tracked upstream ticket and a `// TODO(value.js): remove fromType fallback once extractFunctions populates .defaultValue` comment; the current phrasing ("1.2.0 build mis-assigns") does not make the exit condition explicit.

**Proposal:** Replace the prose comment with a TODO keyed to the value.js issue; add a TypeScript assertion `param.defaultValue satisfies string | undefined` once the upstream fix lands so the compiler catches the workaround surviving beyond its shelf life.

---

## Finding 4 — `reparseLeaf` swallows all parse failures silently (resolve-values.ts:347–359)

**Category:** fallback / silent handling  
**Severity:** medium

```ts
// resolve-values.ts:352-358
const reparseLeaf = (
    node: Resolved<ValueUnit | FunctionValue>,
): Resolved<ValueUnit | FunctionValue> => {
    if (node === DROP) return node;
    if (node instanceof ValueUnit && node.unit === "string") {
        try {
            return parseCSSValue(String(node.value));
        } catch {
            return node;   // ← silent swallow: bad parse returns the raw opaque string
        }
    }
    return node;
};
```

When `parseCSSValue` throws (a malformed `if()` consequent like `"not a css value!!!"`), the catch returns the original opaque `ValueUnit("not a css value!!!", "string")` intact. This leaf then enters the interpolation pipeline as a `string`-unit leaf, where `lerpValue` will treat it as a non-numeric value and produce undefined behaviour.

The comment says "a parse miss leaves the original leaf intact" — but an opaque `string`-unit leaf is not a valid interpolation endpoint. Per the precepts, the correct posture is explicit failure: the consequent that fails to re-parse is a guaranteed-invalid value and should return `DROP`, not the broken leaf.

**Proposal:** Change the catch to `return DROP`. The caller `resolveIf` and `resolveValues` handle `DROP` correctly (omit the declaration, CSS guaranteed-invalid rule applies). A broken `if()` consequent that can't round-trip through `parseCSSValue` is not a valid animation value — do not feed it to the interpolation pipeline.

---

## Finding 5 — `coerceArg` and `resolveFunctionCall` have matching silent-catch branches (resolve-values.ts:438–441, 537–539)

**Category:** fallback  
**Severity:** low

```ts
// resolve-values.ts:436-441
if (param.defaultValue === undefined) return DROP;
try {
    return parseCSSValue(param.defaultValue);
} catch {
    return DROP;    // ← acceptable: no default to parse → guaranteed-invalid
}
```

```ts
// resolve-values.ts:534-539
if (param.defaultValue === undefined) return DROP;
try {
    bound = parseCSSValue(param.defaultValue);
} catch {
    return DROP;    // ← acceptable: malformed default → guaranteed-invalid
}
```

These two `catch → DROP` branches are actually correct by the CSS guaranteed-invalid rule (a malformed default is not recoverable). The pattern is repeated twice because `coerceArg` handles the type-mismatch-with-default case and `resolveFunctionCall` handles the missing-positional-with-default case. Both are the same operation.

**Proposal:** Extract into a private `parseDefaultOrDrop(defaultValue: string): Resolved<ValueUnit | FunctionValue>` helper used by both sites. Eliminates the duplication and makes the guaranteed-invalid posture explicit in one place.

---

## Finding 6 — `defaultResolveEnv` re-evaluates `globalThis` feature checks on every call (resolve-values.ts:100–129)

**Category:** brittleness / effusive-dynamicism  
**Severity:** low

```ts
// resolve-values.ts:100-129
export const defaultResolveEnv = (): Required<Pick<ResolveEnv, "supports" | "matchMedia">> => {
    const hasCSS =
        typeof globalThis !== "undefined" &&
        typeof (globalThis as { CSS?: { supports?: unknown } }).CSS?.supports === "function";
    const hasMM =
        typeof globalThis !== "undefined" &&
        typeof (globalThis as { matchMedia?: unknown }).matchMedia === "function";
    // ...returns new closures every call
};
```

`defaultResolveEnv` is a factory called from `makeResolveContext` (line 137) — once per `resolveKeyframes` invocation. The `typeof globalThis` + `typeof CSS.supports` feature checks are re-evaluated every call. `CSS.supports` and `matchMedia` do not change at runtime. The closures returned also capture `globalThis as unknown as {...}` repeatedly.

The verbosity of the `globalThis as unknown as { CSS: { supports: ... } }` double-cast on every call is also effusive dynamicism for a capability that is static.

**Proposal:** Lazily evaluate once with a module-level `const`:
```ts
const _supports: ((q: string) => boolean) | undefined =
    typeof globalThis !== "undefined" &&
    typeof (globalThis as any).CSS?.supports === "function"
        ? (q) => (globalThis as any).CSS.supports(q)
        : undefined;
```
Then `defaultResolveEnv` becomes a thin object literal with `_supports ?? (() => false)`. The runtime feature check runs once at module load, not once per animation parse.

---

## Finding 7 — `_buildElementAwareEnv` in engine.ts has a silent `getComputedStyle` swallowing try/catch (engine.ts:1147–1154)

**Category:** fallback / workaround  
**Severity:** medium

```ts
// engine.ts:1147-1156
if (typeof getComputedStyle === "function") {
    try {
        v = getComputedStyle(target).getPropertyValue(name).trim();
    } catch {
        v = "";   // ← silent: any error (detached element, cross-origin) → empty
    }
}
if (v === "") v = target.style.getPropertyValue(name).trim();
```

`getComputedStyle` can throw when the element is detached from a document, is in a cross-origin frame, or when the target is destroyed between `setTargets` and this call. The catch swallows the error silently. More critically, the double-read pattern (`getComputedStyle` first, then inline `style.getPropertyValue` as fallback) is explicitly described as a jsdom workaround ("jsdom does not resolve inline/registered custom props into `getComputedStyle` reliably").

Two issues:
1. The `try/catch` silent swallow means an element that genuinely cannot be introspected (detached, not in a document) behaves identically to one with no custom property set — the `style(--p: value)` condition returns false for both cases, which is incorrect for a detached element that has the prop set inline.
2. The jsdom-fallback double-read embeds a test-runner quirk into production code paths.

**Proposal:** Restructure to:
```ts
customProps: (name: string): string | undefined => {
    try {
        const v = getComputedStyle(target).getPropertyValue(name).trim();
        if (v !== "") return v;
    } catch {
        // Only fallback to inline style on environments where getComputedStyle
        // is unreliable (jsdom), NOT silently on genuine errors.
    }
    const inline = target.style?.getPropertyValue(name).trim();
    return inline || undefined;
},
```
The comment should call out the jsdom workaround explicitly so it can be excised when jsdom improves (or when tests switch to a real browser runtime via playwright-browser-context).

---

## Finding 8 — `ruleComposition` cast via `(rule as { composition?: string })` despite typed field (adapter.ts:298–301)

**Category:** brittleness / workaround  
**Severity:** low

```ts
// adapter.ts:298-301
const ruleComposition = (rule as { composition?: string })
    .composition;
```

`KeyframeRule` in value.js 1.2.0 IS typed:
```ts
export type KeyframeRule = {
    ...
    composition?: "replace" | "add" | "accumulate";
};
```

The `as { composition?: string }` cast widens the union to `string`, discarding the type precision. `rule.composition` is directly accessible without a cast.

**Proposal:** Delete the cast: `const ruleComposition = rule.composition;`. The existing `Map<string, string>` for `composition` then naturally accepts the narrower union type, or the Map should be typed `Map<string, "replace" | "add" | "accumulate">` for accuracy.

---

## Finding 9 — `compile-color.ts` has four `as never` / `as unknown as Color` realm-bridge casts that are load-bearing but undocumented at the type level (compile-color.ts:62, 66, 104, 106)

**Category:** workaround / brittleness  
**Severity:** medium

```ts
// compile-color.ts:58-62
const toColor = (vu: ValueUnit): Color =>
    // @cross-realm: ...
    normalizeColorUnit(vu as never).value as unknown as Color;

// compile-color.ts:92-106
const fromRawOklab = (L: number, a: number, b: number): Color =>
    // @cross-realm: ...
    color2({
        colorSpace: "oklab", l: L, a: ..., b: ..., alpha: 1,
    } as never, "oklab") as unknown as Color;
```

The `@cross-realm` comment correctly identifies why the casts are needed: value.js and kf each bundle their own nominal `Color`/`ValueUnit` types; tsc sees two structurally compatible but nominally distinct types. The casts are not bugs — they are genuinely irreducible without a single shared type package.

However, `as never` is the wrong cast for this. `as never` asserts the value is of the `never` type (an impossible value), which TypeScript silences by accepting any conversion from `never`. The correct cast is a double assertion `vu as unknown as Parameters<typeof normalizeColorUnit>[0]` or a type-helper. Using `as never` as a type-escape device is fragile — it fails if the function ever adds overloads whose first overload doesn't accept `never`.

**Proposal:** Replace `as never` with a typed bridge alias:
```ts
type NativeValueUnit = Parameters<typeof normalizeColorUnit>[0];
const toColor = (vu: ValueUnit): Color =>
    normalizeColorUnit(vu as unknown as NativeValueUnit).value as unknown as Color;
```
Similarly for `fromRawOklab`. This makes the cross-realm seam explicit at the type level without the `never` escape hatch.

---

## Finding 10 — `toColor_` naming collision workaround in `densifyKey` (compile-color.ts:190)

**Category:** brittleness  
**Severity:** low

```ts
// compile-color.ts:189-191
const fromColor = toColor(a);
const toColor_ = toColor(b);      // ← trailing underscore to dodge module-level `toColor`
const ramp = sampleColorRamp(fromColor, toColor_, stopCount, {
```

`toColor_` exists solely because the local variable would shadow the module-level `toColor` function. This is a naming anti-pattern. The trailing underscore convention is Python/JSX idiom for "intentional shadow avoidance" — it is not a TypeScript convention and creates confusion in a TypeScript codebase.

**Proposal:** Rename to `endColor` / `targetColor` / `colorTo`:
```ts
const startColor = toColor(a);
const endColor = toColor(b);
const ramp = sampleColorRamp(startColor, endColor, stopCount, { ... });
```

---

## Finding 11 — ΔE proof uses a hardcoded `1024`-sample reference ramp with no named constant (compile-color.ts:203–206)

**Category:** brittleness / DRY  
**Severity:** low

```ts
// compile-color.ts:201-207
for (let s = 0; s + 1 < ramp.length; s++) {
    const tMid = (s + 0.5) / (ramp.length - 1);
    const kfMid = sampleColorRamp(fromColor, toColor_, 1024, {
        space,
        ...hueOpt,
    })[Math.round(tMid * 1023)]!;
```

`1024` (and its companion `1023`) are magic numbers with no named constant. This is the "high-fidelity reference ramp" used as ground truth for the ΔE proof. Changing the proof fidelity requires a grep, and the relationship between `1024` (sample count) and `1023` (index into 0-based array) is implicit.

**Proposal:**
```ts
const DELTA_E_PROOF_SAMPLES = 1024;
// then:
const kfMid = sampleColorRamp(fromColor, endColor, DELTA_E_PROOF_SAMPLES, {
    space,
    ...hueOpt,
})[Math.round(tMid * (DELTA_E_PROOF_SAMPLES - 1))]!;
```

---

## Finding 12 — `resolve-values.ts` at 796L mixes three distinct concerns (resolve-values.ts: all)

**Category:** decomposition / god-module  
**Severity:** high

`resolve-values.ts` at 796 lines contains four distinct logical concerns:

1. **Spring physics conversions** (`springCssToOptions`, `resolveSpringTiming`, `SpringCssOptions`, `SPRING_DEFAULTS`) — lines 153–230. Physics algebra belonging with `spring.ts`/`springTimingFunction.ts`.

2. **CSS `if()` resolution engine** (`evalCondition`, `evalStyleCondition`, `splitCondition`, `isEmptyLeaf`, `reparseLeaf`, `resolveIf`) — lines 241–619. The core `if(supports/media/style)` logic.

3. **`@function` call-inlining engine** (`NormalizedParam`, `normalizeParam`, `coerceArg`, `isVarRef`, `substituteParams`, `resolveFunctionCall`) — lines 363–571. Value.js `@function` descriptor binding/substitution.

4. **Public API + env machinery** (`ResolveEnv`, `ResolveContext`, `defaultResolveEnv`, `makeResolveContext`, `DROP`, `Resolved`, `resolveValues`, `hasResolvableValue`, `hasPhase2Node`) — lines 59–151, 695–796.

The spring concern (concern 1) is already orphaned (no production callers; see Finding 2). Splitting the remaining three concerns:

**Proposed sub-module directory `src/animation/resolve/`:**
- `env.ts` — `ResolveEnv`, `ResolveContext`, `defaultResolveEnv`, `makeResolveContext`, `DROP`, `Resolved` (~80L)
- `resolve-if.ts` — `splitCondition`, `evalCondition`, `evalStyleCondition`, `isEmptyLeaf`, `reparseLeaf`, `resolveIf` (~200L)
- `resolve-function.ts` — `NormalizedParam`, `normalizeParam`, `coerceArg`, `isVarRef`, `substituteParams`, `resolveFunctionCall` (~200L)
- `index.ts` — `resolveNode`, `resolveValues`, `hasResolvableValue`, `hasPhase2Node` + re-exports (~120L)

Spring symbols move to `spring.ts` / `springTimingFunction.ts`.

This decomposition is NOT flat hyphenated siblings — it is a genuine `src/animation/resolve/` directory, the same pattern `src/animation/internal/` uses for `binarySearch.ts`/`errors.ts`/`leaves.ts`/`reduced-motion.ts`/`scheduler.ts`.

---

## Finding 13 — `adapter.ts` `pickKeyframes` hard-limits to first `@keyframes` block without explicit failure (adapter.ts:183–194)

**Category:** legacy / brittleness  
**Severity:** low

```ts
// adapter.ts:183-194
/**
 * Pick the first @keyframes block from the stylesheet — the AST
 * supports multiple, but the legacy `fromString` interface assumed one.
 */
const pickKeyframes = (ast: Stylesheet): KeyframeRule[] => {
    const all = extractKeyframes(ast);
    for (const rules of all.values()) {
        if (rules.length > 0) return rules;
    }
    return [];
};
```

The comment says "the legacy `fromString` interface assumed one." The `legacy` label is itself a red flag per the precepts: legacy assumptions should either be made explicit-fail or removed. A stylesheet with two `@keyframes` blocks silently loses the second. The comment even says "the consumer should call `parseCSSStylesheet` directly if it needs the full set" — but `fromString` is the only public API; consumers have no other path.

**Proposal:** Either:
- (a) Emit a `MULTIPLE_KEYFRAMES` diagnostic when `all.values()` has >1 entry with rules, surfacing the silent data loss explicitly. 
- (b) Expand `resolveKeyframes` to accept an optional `name?: string` parameter and pick by name (consistent with `IngestOptions.keyframeName` in `ingest-cssom.ts:79`).

This is a documentation/API-surface issue that should be explicit-fail rather than silent first-pick.

---

## Summary Table

| # | File | Lines | Category | Severity | Finding |
|---|------|-------|----------|----------|---------|
| 1 | adapter.ts | 235–238 | dead-code | medium | `onParseError` never wired; `void` suppressor |
| 2 | resolve-values.ts | 624–693, 755 | brittleness | high | `spring` in `hasResolvableValue` with no `resolveNode` arm; `resolveSpringTiming` has no production callers |
| 3 | resolve-values.ts | 363–413 | workaround | medium | `normalizeParam` `fromType` fallback for value.js 1.2.0 upstream bug |
| 4 | resolve-values.ts | 347–359 | fallback | medium | `reparseLeaf` silent catch returns broken opaque string instead of DROP |
| 5 | resolve-values.ts | 436–441, 534–539 | dry | low | Duplicated `parseDefaultOrDrop` pattern in `coerceArg` + `resolveFunctionCall` |
| 6 | resolve-values.ts | 100–129 | effusive-dynamicism | low | `defaultResolveEnv` re-evaluates feature checks on every call |
| 7 | engine.ts | 1147–1156 | fallback | medium | Silent `getComputedStyle` swallow + jsdom double-read in `_buildElementAwareEnv` |
| 8 | adapter.ts | 298–301 | brittleness | low | `rule as { composition?: string }` cast ignores typed field on `KeyframeRule` |
| 9 | compile-color.ts | 62, 66, 104, 106 | workaround | medium | `as never` misused as type-escape for cross-realm bridge casts |
| 10 | compile-color.ts | 190 | brittleness | low | `toColor_` naming workaround for shadow avoidance |
| 11 | compile-color.ts | 203–206 | dry | low | Hardcoded `1024` / `1023` magic numbers in ΔE proof |
| 12 | resolve-values.ts | all | decomposition | high | 796L mixing spring physics + if-resolve + function-inline + public API |
| 13 | adapter.ts | 183–194 | legacy | low | `pickKeyframes` silently drops multi-keyframes with `legacy` tag |
