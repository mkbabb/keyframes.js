# Tranche R Audit — `lib-waapi` lane

**Files:** `src/animation/waapi.ts` (579 L) · `src/animation/waapi-densify.ts` (287 L)

**Lane focus:** WAAPI delegation gate (`isWAAPIEligible`), keyframe emission (`toWAAPIKeyframes`), options builder (`toWAAPIOptions`), play/scroll delegation (`playWAAPI`, `attachNativeScrollTimeline`), and the Q densify extraction.

---

## 1. God-module threshold exceeded — `waapi.ts` is 579 lines

**Threshold:** 500 L per the Tranche R precepts.

`waapi.ts` is 579 lines and contains **four distinct concerns**:

| Lines | Concern |
|-------|---------|
| 1–261 | Eligibility predicate (`isWAAPIEligible` + constants + helpers) |
| 263–330 | Keyframe emission (`toWAAPIKeyframes` + re-exports from `waapi-densify`) |
| 332–435 | Options builder (`toWAAPIOptions` + maps + `uniformComposite`) |
| 437–579 | Play/scroll delegation (`playWAAPI`, `attachNativeScrollTimeline`) |

The densify extraction into `waapi-densify.ts` (Q.WF1 Band-F) demonstrates the correct seam pattern — but it produced a flat hyphenated sibling (`waapi-densify.ts`) rather than a directory (`waapi/`). With `waapi.ts` still above 500 L, the pattern is internally inconsistent: the densify moved to a sibling, but the remaining four concerns stayed in the oversized host.

**Proposed decomposition** — a `src/animation/waapi/` directory:

```
waapi/
  index.ts            — re-export surface (replaces waapi.ts as import target)
  eligibility.ts      — isWAAPIEligible, WAAPI_INELIGIBLE_UNITS, isWebKitEngine, WAAPIEligibility
  emission.ts         — toWAAPIKeyframes (imports densify internally)
  options.ts          — toWAAPIOptions, DIRECTION_MAP, FILL_MAP, COMPOSITE_MAP, uniformComposite
  delegation.ts       — playWAAPI, attachNativeScrollTimeline, NativeScrollAttachment
  densify.ts          — current waapi-densify.ts content (moved, renamed)
```

This mirrors the `internal/` sub-directory pattern already established in `src/animation/internal/`.

---

## 2. Silent fallback in `uniformComposite` — precept violation

**File:** `src/animation/waapi.ts:377`

```ts
return COMPOSITE_MAP[op] ?? "replace";
```

**JSDoc at line 352–353:**
> "value.js + the engine guarantee the operator is one of the three (the adapter only captures the CSS grammar's three keywords); a stray value degrades to `replace` (the default composite), **never a throw**."

This is an explicit silent fallback — the very pattern the Tranche R precepts forbid: "NO fallback/fall-through behavior... must fail EXPLICITLY." The `CompositeOperator` type (`"replace" | "add" | "accumulate"`) is a closed union that TypeScript enforces at compile time, but the map lookup operates on a `string` (coming off `frame.composition`), so a runtime-stray value silently produces `replace` instead of blowing up.

**Proposed fix:** Remove the `?? "replace"` nullish coalesce and replace with an explicit throw:

```ts
const mapped = COMPOSITE_MAP[op];
if (mapped === undefined) {
    throw new TypeError(`Unknown animation-composition operator "${op}" on WAAPI delegation path.`);
}
return mapped;
```

If the guarantee truly holds, the throw is unreachable. If it doesn't hold, the silent `replace` was masking a real bug.

---

## 3. Dead re-export of `WAAPI_CHORD_TOLERANCE`

**File:** `src/animation/waapi-densify.ts:55`

```ts
export const WAAPI_CHORD_TOLERANCE = 0.005;
```

`WAAPI_CHORD_TOLERANCE` is exported from `waapi-densify.ts` but is **not** re-exported through `waapi.ts` (only `densifyInteriorTimes`, `segmentFlatnessError`, and `WAAPI_MAX_SUBSEGMENT_STOPS` are re-exported at waapi.ts:276-280). No test, no bench, and no source file outside `waapi-densify.ts` references `WAAPI_CHORD_TOLERANCE`. It is a published but unreachable constant — dead export.

**Proposed fix:** Either remove the `export` keyword (making it a module-internal constant), or add it to the re-export block in `waapi.ts` if external tuning was the intent. The proof comment (waapi.ts:271-275) only names the three re-exported tokens, confirming the tolerance was never part of the intended external surface.

---

## 4. `uniformComposite` assumes composition uniformity — but `isWAAPIEligible` never checks it

**File:** `src/animation/waapi.ts:362-368` (docstring), and `src/animation/waapi.ts:371-381` (`uniformComposite`)

The `uniformComposite` JSDoc states:

> "Eligibility (`isWAAPIEligible`) already guaranteed the operator is uniform when it admitted an `add`/`accumulate` animation, so reading the first composited frame's operator is enough."

This claim is **unsubstantiated** — `isWAAPIEligible` contains no check for per-frame composition uniformity. Scanning `isWAAPIEligible` (lines 134–261), the five eligibility criteria are: targets, `Element.animate`, default renderer, uniform timing function, and ineligible units/color. Composition uniformity is absent.

`AnimationFrame.composition` is assigned per-segment from `endFrame.composition` in `frame-compiler.ts:409`. A CSS source with:

```css
@keyframes foo {
  0%  { ... animation-composition: replace; }
  50% { ... animation-composition: add; }
  100% { ... animation-composition: replace; }
}
```

would produce two frames with different operators. `isWAAPIEligible` returns `{ eligible: true }`. `uniformComposite` then reads the first non-`replace` frame and emits a single effect-level `composite: add` — misrepresenting the per-frame intent at the WAAPI effect level.

**Proposed fix:** Add a composition-uniformity gate to `isWAAPIEligible`:

```ts
const firstComp = animation.frames[0]?.composition;
for (let i = 1; i < animation.frames.length; i++) {
    if (animation.frames[i]!.composition !== firstComp) {
        return {
            eligible: false,
            reason: "non-uniform per-frame animation-composition (WAAPI exposes one composite per effect)",
        };
    }
}
```

This gates the exact scenario `uniformComposite` claims is already gated.

---

## 5. `toWAAPIOptions` — easing fallback path is reachable without eligibility gate

**File:** `src/animation/waapi.ts:410-412`

```ts
const uniformTiming =
    animation.frames[0]?.timingFunction ?? animation.options.timingFunction;
const easing = uniformTiming.css ?? "linear";
```

Two silent fallbacks chained:

1. `animation.frames[0]?.timingFunction ?? animation.options.timingFunction` — falls through to the animation-level timing if frame 0 is absent.
2. `uniformTiming.css ?? "linear"` — falls through to bare `"linear"` if the css twin is absent.

**Context:** `isWAAPIEligible` at line 196 rejects any animation whose first frame has `css === undefined`:

```ts
if (firstTF && firstTF.css === undefined) {
    return { eligible: false, reason: "easing has no faithful CSS twin (would run bare linear on the compositor)" };
}
```

So `uniformTiming.css ?? "linear"` can only fire if `toWAAPIOptions` is called with: (a) zero frames (which eligibility already blocks via the targets check), or (b) directly — bypassing eligibility — with a non-css-twin easing. The comment on line 403 says "Otherwise fall back to bare `linear`" and documents this as intentional, but the precepts require that design decisions like this either have a proof gate or fail explicitly when called incorrectly.

**Proposed fix:** Assert rather than silently degrade. If the calling contract guarantees `isWAAPIEligible` was checked first, assert:

```ts
const uniformTiming = animation.frames[0]?.timingFunction ?? animation.options.timingFunction;
const easing = uniformTiming.css;
if (easing === undefined) {
    throw new TypeError(
        "toWAAPIOptions called with a non-CSS-twin easing — isWAAPIEligible must be checked first."
    );
}
```

---

## 6. Q densify extraction is a flat sibling, not a directory module

**Files:** `src/animation/waapi-densify.ts` (287 L), re-exported through `waapi.ts`

Q.WF1 extracted the densify machinery into `waapi-densify.ts` — the correct cohesion split. But the result is a flat hyphenated sibling (`waapi-densify.ts`) in the already-flat 51-file `src/animation/` directory, not a directory sub-module. The precepts name this the exact anti-pattern: "flat hyphenated sibling files."

The re-export relay in `waapi.ts:276-281` is a workaround for the flat layout:

```ts
export {
    densifyInteriorTimes,
    segmentFlatnessError,
    WAAPI_MAX_SUBSEGMENT_STOPS,
} from "./waapi-densify";
import { densifyInteriorTimes } from "./waapi-densify";
```

The dual import (export + local import of the same name) is an additional smell created by the flat layout — under a directory structure, `waapi/densify.ts` is consumed by `waapi/emission.ts` directly without a relay.

**Proposed resolution:** As part of the `waapi/` directory decomposition described in Finding 1, move `waapi-densify.ts` → `waapi/densify.ts`. The `waapi/index.ts` re-exports the public tokens. The dual import relay disappears.

---

## 7. `playWAAPI` — bare `catch {}` swallows unexpected errors

**File:** `src/animation/waapi.ts:505-510`

```ts
} catch {
    // `Animation.stop()`/`reset()` cancelled the compositor animations,
    // rejecting `finished` with an AbortError — a deliberate halt, not
    // an error (`_cancelWAAPI` already cleared the handles). Swallow it so
    // the awaited `play()` resolves cleanly.
}
```

This bare `catch` swallows **all** rejections from `Promise.all(waAnimations.map(wa => wa.finished))` — not just `AbortError` cancellations. Any unexpected rejection from the WAAPI runtime (OOM, detached-document, paint-worklet failure) would be silently eaten, making debugging impossible.

**Proposed fix:** Discriminate explicitly:

```ts
} catch (err) {
    const name = (err as { name?: string }).name;
    if (name !== "AbortError") {
        // Unexpected WAAPI runtime failure — re-throw rather than silently swallowing.
        throw err;
    }
    // AbortError: deliberate stop()/reset() cancel — resolve cleanly.
}
```

This preserves the legitimate "halt resolves cleanly" contract while making unexpected failures visible.

---

## 8. `commitStyles` feature-detect is a legacy-safe workaround

**File:** `src/animation/waapi.ts:496-498`

```ts
if (
    animation.restPosition === "final" &&
    typeof wa.commitStyles === "function"
) {
    wa.commitStyles();
}
```

`commitStyles` is Baseline 2021 (Chrome 84, Firefox 75, Safari 13.1). The `typeof wa.commitStyles === "function"` guard silently skips the commit on platforms that lack it — leaving a forwards-fill WAAPI animation with a live compositor effect and no inline style bake. Per precepts: NO fallback behavior unless genuinely befitting.

**Assessment:** In 2026, this feature-detect is defensive against pre-2021 browsers that no WAAPI animation can reach anyway (since `Element.animate()` predates `commitStyles` by only two years and the eligibility gate requires it). The guard silently degrades rather than failing explicitly.

**Proposed fix:** Remove the `typeof` guard and call `wa.commitStyles()` directly. If it throws (pre-Baseline browser), let it propagate — the animation was already delegated to WAAPI, so the platform clearly supports it. The inner `try/catch` handles the already-detached case:

```ts
if (animation.restPosition === "final") {
    wa.commitStyles(); // Baseline 2021 — present whenever WAAPI delegation is possible.
}
wa.cancel();
```

---

## 9. `isOffsetPercentProperty` — over-broad `split(".").pop()` dot-traversal

**File:** `src/animation/waapi.ts:92-95`

```ts
const isOffsetPercentProperty = (property: string): boolean =>
    PATH_RELATIVE_PERCENT_PROPERTIES.has(property) ||
    PATH_RELATIVE_PERCENT_PROPERTIES.has(property.split(".").pop() ?? property);
```

The `split(".").pop()` extracts a leaf segment from a dotted key like `"transform.offset-distance"`. The fallback `?? property` is a silent path: `"".split(".").pop()` returns `""`, not `undefined`, so the nullish coalesce never fires — it is dead code.

More critically, the traversal is under-specified: it matches any dotted key whose LAST segment is `offset-distance`, even `"foo.offset-distance"` — a property that may not be path-relative at all depending on context. The set has one member (`"offset-distance"`), making this a single-case exemption that should be stated directly rather than via string manipulation.

**Proposed fix:** Tighten to an exact match and remove the dead nullish coalesce:

```ts
const isOffsetPercentProperty = (property: string): boolean =>
    property === "offset-distance" ||
    property.endsWith(".offset-distance");
```

Or better: make the set check explicit and drop the split entirely — the dotted-key traversal was added to handle nesting but introduces brittleness for no real gain (the only property in the set is `"offset-distance"`, which does not nest).

---

## Summary table

| # | Severity | Category | Location |
|---|----------|----------|----------|
| 1 | high | god-module / decomposition | `waapi.ts` (579 L), `waapi-densify.ts` flat sibling |
| 2 | high | fallback | `waapi.ts:377` — `COMPOSITE_MAP[op] ?? "replace"` |
| 3 | medium | dead-code | `waapi-densify.ts:55` — `WAAPI_CHORD_TOLERANCE` unexported dead export |
| 4 | high | brittleness | `waapi.ts:367` — undocumented assumption that composition is uniform, no gate |
| 5 | medium | fallback | `waapi.ts:412` — `uniformTiming.css ?? "linear"` reachable without eligibility |
| 6 | medium | decomposition | `waapi-densify.ts` flat sibling pattern, dual import relay |
| 7 | medium | fallback | `waapi.ts:505` — bare `catch {}` swallows non-AbortError WAAPI failures |
| 8 | low | legacy/workaround | `waapi.ts:496` — `commitStyles` feature-detect on Baseline 2021 API |
| 9 | low | brittleness | `waapi.ts:92` — `split(".").pop() ?? property` dead fallback + over-broad traversal |
