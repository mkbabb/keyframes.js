# Tranche R — Lane `lib-legacy-sweep`

**Scope:** cross-cutting legacy / workaround / fallback / silent-handling sweep across ALL of `src/` (57 files, 17,983 LOC). Branch `tranche-r-dev`. Read of actual code, not docs.

**Headline verdict:** The repo's *posture* is honest — most "fallback" mentions are documented architectural dispatch (native↔JS scroll driver, WAAPI↔rAF) or diagnostics-emitting (`COMPOSITION_FALLBACK`) honesty rows, and the `@deprecated` PKG-3 aliases were genuinely DROPPED in 5.0.0 (only doc tombstones remain). BUT there is a real spine of (a) **value.js-bug workarounds** that silently absorb upstream defects, (b) a small set of **over-broad `catch {}` swallows** that hide non-benign throws, (c) **optional-chaining geometry masking** that fabricates `0` for genuinely-absent data, and — the structural elephant — (d) the Tranche-Q "decomposition close" produced **FLAT hyphenated sibling files** that did NOT actually break the god module: `engine.ts` is still **1420 lines** and `KeyframesAnimation` is still a ~1060-line monster class.

---

## A. The `catch {}` swallow inventory (15 sites)

Every `catch {` in `src/` (`.d.ts` excluded). Classified EXCISE / FAIL-EXPLICIT / KEEP.

| # | file:line | verdict | note |
|---|-----------|---------|------|
| 1 | `engine-css-metadata.ts:140` | **NARROW (fail-explicit on non-dup)** | over-broad: swallows ALL throws, not just duplicate-name |
| 2 | `engine-options.ts:34` (`tryParseTime`) | **KEEP but rename** | parse→undefined seam; the setter that consumes it throws — see note |
| 3 | `resolve-values.ts:354` (`reparseLeaf`) | KEEP | re-parse miss → original leaf; documented |
| 4 | `resolve-values.ts:439` (`coerceArg` default) | **WORKAROUND** | value.js 1.2.0 `@function` param bug — see §B |
| 5 | `resolve-values.ts:538` (`--fn()` missing-arg default) | **WORKAROUND** | same bug family as #4 |
| 6 | `waapi.ts:501` (per-`wa` commit/cancel) | KEEP | "already detached" — genuine idempotent cleanup |
| 7 | `waapi.ts:505` (`finished` AbortError) | KEEP | deliberate halt path, documented |
| 8 | `engine.ts:1152` (`getComputedStyle`) | **NARROW** | jsdom-shaped; swallows to `v=""` then masks absence |
| 9 | `utils.ts:171` (`parseSteps`) | KEEP | degrade-to-registry, documented + gated |
| 10 | `utils.ts:198` (`parseLinearStops`) | KEEP | degrade-to-registry, documented + gated |
| 11 | `compile.ts:407` (`serializeEasing` throw) | **GOOD** | converted to a typed `refusal` row — fail-explicit done right |
| 12 | `compile.ts:528` (`formatCSS` Prettier) | KEEP | cosmetic pass, falls back to valid raw CSS |
| 13 | `validate.ts:186` (`keyframesNames`) | KEEP-with-doubt | `[]` on parse throw — only feeds a heading line |
| 14 | `engine-playback.ts:302` (`cancelWAAPI`) | KEEP | idempotent detach cleanup |
| 15 | `ingest.ts:276` (`live.cancel`) | KEEP | idempotent detach cleanup |

### A.1 — `engine-css-metadata.ts:140` — OVER-BROAD swallow (HIGH)

```ts
138        try {
139            CSS.registerProperty(definition);
140        } catch {
141            // InvalidModificationError on a duplicate name (process-wide
142            // registry) — benign, the property is already registered with
143            // these semantics. Any other throw (malformed syntax/initial
144            // value the UA rejects) likewise must not abort playback: the
145            // JS path remains correct, so swallow and move on.
146        }
```

The comment ADMITS it: it swallows not only the benign `InvalidModificationError` (duplicate name) but ALSO "malformed syntax/initial value the UA rejects." The latter is a **real author error** — a typed `@property` the author wrote that the UA refuses — and it vanishes silently. The WAAPI path then animates that custom DISCRETELY (the very "silent regression vs the rAF path" the function's own docstring at line 107-110 warns about), with NO diagnostic. This violates the no-silent-fallback mandate.

**PRESCRIBE — FAIL-EXPLICIT (narrow the catch):** bind the error, swallow ONLY the duplicate-name case, push a diagnostic for the rest:

```ts
} catch (err) {
    if (err instanceof DOMException && err.name === "InvalidModificationError") {
        continue; // benign: already registered with these semantics
    }
    // A genuine UA rejection (malformed syntax/initial value) — surface it,
    // do NOT silently demote the typed custom to discrete WAAPI animation.
    diagnostics.push({ code: "PROPERTY_REGISTER_REJECTED", property: name,
        message: `CSS.registerProperty refused @property ${name}: ${String(err)}` });
}
```

(Requires threading the `diagnostics` channel into `registerPropertyDescriptors` — it already exists on the adapter; this is the same `COMPOSITION_FALLBACK` honesty-row pattern applied to the one place it's missing.)

### A.2 — `engine.ts:1152` — `getComputedStyle` swallow + double absence-mask (MEDIUM)

```ts
1145    customProps: (name: string) => {
1146        let v = "";
1147        if (typeof getComputedStyle === "function") {
1148            try {
1149                v = getComputedStyle(target).getPropertyValue(name).trim();
1150            } catch {
1151                v = "";
1152            }
1153        }
1154        if (v === "") v = target.style.getPropertyValue(name).trim();
1155        return v === "" ? undefined : v;
1156    },
```

Two layered absence-masks: (1) a thrown `getComputedStyle` → `""`, then (2) `"" → inline style`, then (3) `"" → undefined`. The `catch { v = "" }` is jsdom-shaped (the docstring at 1140-1143 says jsdom doesn't resolve registered customs reliably) but it is doing FEATURE-DETECTION-BY-EXCEPTION inside a hot reader. A genuine `getComputedStyle` throw (detached node, cross-origin) is indistinguishable from "prop unset" here.

**PRESCRIBE — partial EXCISE:** `getComputedStyle` only throws for a `null`/non-Element arg; guard the arg explicitly (`target instanceof Element`) instead of try/catch, so a real throw (which then cannot happen) is never masked. Keep the inline-fallback (that IS the documented jsdom seam) but the `try/catch` is doing no real work a type guard can't.

### A.3 — `engine-options.ts:30` — `tryParseTime` parse-to-undefined (LOW, KEEP, rename)

```ts
29 /** `parseCSSTime` that converts a parse failure to `undefined` for the option seam. */
30 const tryParseTime = (raw: string): number | undefined => {
31     try {
32         const parsed = parseCSSTime(raw);
33         return Number.isFinite(parsed) ? parsed : undefined;
34     } catch {
35         return undefined;
36     }
37 };
```

KEEP: the `undefined` is consumed by `parseOption(...)` which DOES throw a typed `AnimationOptionError` on `undefined` (verified: the option setters are fail-explicit). So this is a legitimate "result-type seam," not a silent swallow. The `try`-prefixed name signals it. No action required beyond awareness.

---

## B. value.js-bug WORKAROUNDS (the real legacy debt) — HIGH

These are not "fallbacks" — they are kf **silently absorbing a known upstream defect**. The user's mandate: "Every instance must be EXCISED entirely OR made to fail EXPLICITLY." These should become **upstream-fix dispatches to value.js + a kf assertion that the bug is gone**, not permanent compensation code.

### B.1 — `resolve-values.ts:362-413` — `normalizeParam` works around value.js 1.2.0 `@function` grammar bug

```ts
362  * normalized off the value.js `CustomFunctionParameter` shape. value.js 1.2.0's
363  * `extractFunctions` does NOT cleanly split the typed-param grammar: it hands
364  * `@function --f(--x <length>: 0px)` back as `{ name: "--x <length>", type:
365  * "0px" }` — the `<syntax>` glued onto `name`, the DEFAULT mis-landed on `type`.
```

The body (`normalizeParam`, lines 390-413) does string-surgery to un-glue `<syntax>` from `name` and recover the default from whichever of `defaultValue`/`type` carries it. The `??` chain at 411 (`param.defaultValue ?? fromType`) is the compensation:

```ts
406    const fromType =
407        param.type !== undefined &&
408        !(param.type.startsWith("<") && param.type.endsWith(">"))
409            ? param.type
410            : undefined;
411    const defaultValue = param.defaultValue ?? fromType;
```

This is brittle: it hard-codes value.js's *malformed* output shape. When value.js fixes `extractFunctions`, `param.type` becomes the syntax (not the default) and this silently mis-recovers.

**PRESCRIBE — DISPATCH + GUARD:** (1) file the value.js fix (`extractFunctions` must split `name`/`type`/`defaultValue` correctly per CSS Functions L1); (2) gate the kf-side `normalizeParam` behind an explicit version assertion or a born-RED handoff so it cannot silently outlive the upstream fix; (3) at minimum, comment the EXACT value.js version and add a unit assertion that the 1.2.0 shape is what we got (so a value.js bump that changes the shape FAILS LOUD instead of mis-recovering).

### B.2 — `resolve-values.ts:439` + `:538` — the `parseCSSValue(default)` catch→`DROP`

```ts
437        try {
438            return parseCSSValue(param.defaultValue);
439        } catch {
440            return DROP;
441        }
```

Tied to B.1: a default value that value.js mis-assigned to `type` and that then fails to re-parse silently DROPs the whole `--fn()` call. The DROP is honest-ish (better than NaN), but it is downstream of a workaround, so a value.js bug manifests as a silently-vanishing custom function with no diagnostic. **PRESCRIBE:** push a `CUSTOM_FN_ARG_DROP` diagnostic on the DROP path so the absorption is at least citable (same honesty-row pattern as `COMPOSITION_FALLBACK`).

### B.3 — `utils.ts:188-200` — RETIRED workaround (GOOD — reference exemplar)

The S7 `linear()` flat-comma normalize fold (a value.js 0.12.0 serialize/parse asymmetry workaround) was **retired** at the consume of the value.js 1.0.0 root fix (`proof:workaround-deletion S7`). This is exactly the lifecycle B.1/B.2 should follow. Cite it as the model: workaround → upstream fix → consume → DELETE + gate.

---

## C. Optional-chaining / `??` that MASKS genuine absence — MEDIUM

Most `?? 0`/`?? false` in src are legit option-defaulting (`duration`, `velocity`, `threshold`, `scrub`). The exceptions FABRICATE data:

### C.1 — `morph-svg.ts:213-214` — geometry coordinate masking (MEDIUM)

```ts
213            pt.x = v[xKey(i)]?.[0]?.value ?? 0;
214            pt.y = v[yKey(i)]?.[0]?.value ?? 0;
```

In the per-frame morph render, a MISSING coordinate key (`v[xKey(i)]` undefined, or its `[0]` leaf undefined) silently becomes `(0,0)` — collapsing that path point to the origin and emitting a corrupted `d`. The factory at lines 261+ already REFUSES degenerate (zero-length) inputs with a typed `AnimationOptionError` (the honest-or-refuse law in the docstring at 240-243), so a missing per-frame key is a genuine internal-invariant violation, not an expected-absent case. Masking it to `0` is the "silent or graceful handling" the mandate forbids.

**PRESCRIBE — FAIL-EXPLICIT:** the morph render path constructs its OWN keys (`xKey(i)`/`yKey(i)` for `i ∈ [0, samples]`) and seeds every frame, so the leaf is GUARANTEED present by construction. Replace `?? 0` with a non-null assertion or, if the invariant can be violated, throw — never silently warp the shape:

```ts
const lx = v[xKey(i)]?.[0]?.value;
const ly = v[yKey(i)]?.[0]?.value;
if (lx === undefined || ly === undefined) {
    throw new Error(`morph render: point ${i} lost its coordinate leaf (engine invariant violated)`);
}
pt.x = lx; pt.y = ly;
```

(Same applies more weakly to `morph-svg.ts:343-344` `angle ?? 0` and `:426` `{ x: x ?? 0, y: y ?? 0 }` — those are at construction-time off `PathGeometry` samples where `0` is arguably a real default for a flat segment; lower priority, but worth a comment asserting why `0` is correct there and not at 213.)

### C.2 — `engine-composition.ts:133,202` — `base[i] ?? 0` (LOW, KEEP)

`const b = base[i] ?? 0` and `compositionBase.get(key)?.[index] ?? 0`. Documented additive-identity choice (an absent underlying value = `0` = the `add` identity). Defensible and commented. KEEP.

---

## D. Structural decomposition — the FLAT-sibling overfit (CRITICAL)

This is the spine of the user's CRITICAL context, and it is CONFIRMED by reading the tree.

### D.1 — `engine.ts` is STILL 1420 lines; `KeyframesAnimation` is a ~1060-line god class

Tranche Q claimed a "decomposition close." The reality (`engine.ts` structure):

- `KeyframesAnimation<V>` spans **lines 115–1170** (~1055 lines, ~50 methods) and mixes:
  - option setters (`setTimingFunction`…`setComposite`, 451–558),
  - parse/compile orchestration (`parse` 366, `computeHasComposition` 380, `computeStableKeys` 433, `adoptCompiled` 410),
  - frame interpolation + buffering (`at` 654, `interpFrames` 682, `clearBuffer` 779, `processFrame` 794),
  - composition delegation (`applyComposition` 859),
  - lifecycle/playback delegation (`play`/`pause`/`resume`/`toggle`/`stop` 943–972, `advanceTo` 897, `_frame` 925),
  - element-aware resolution (`_resolveElementAwareValues` 1061, `_buildElementAwareEnv` 1137),
- then `CSSKeyframesAnimation<V>` (1175–1409) adds string ingestion (`fromString` 1312, `fromKeyframes` 1268, `fromVars` 1254), timeline binding (`bindTimeline` 1213), transform resolution.

The Q split pushed *helper functions* out (composition, options, css-metadata, playback) but left the **stateful class body** monolithic. The clearest tell of superficial decomposition: **circular coupling** — `engine-playback.ts:38` imports `KeyframesAnimation` from `engine.ts`, while `engine.ts:84` imports `* as playback from "./engine-playback"`. The "module" boundary is fictional; it's one unit cut along a dotted line.

A second tell: the **duplicated state seam**. `engine.ts` owns `_compositionFallbackSeen` (line 189) and a `compositionBase` map, then *passes them as arguments* to the extracted `engine-composition.ts` functions (`applyComposition`, `resetCompositionCaches`, `emitCompositionFallback` all take a `CompositionRuntime` bag of the engine's own fields). The state and its logic were severed; the logic now reaches BACK into the class via a parameter object. That is not encapsulation — it's a god class with its methods relocated to free functions.

**PRESCRIBE — REAL sub-module directory + state cohesion:** create `src/animation/engine/` with cohesive units that OWN their state, not borrow it:
```
src/animation/engine/
  index.ts            (barrel: re-exports KeyframesAnimation, CSSKeyframesAnimation)
  keyframes-animation.ts   (the core lifecycle/interp class — target <500)
  css-keyframes-animation.ts (the string-ingest subclass)
  composition.ts      (a Composition object that OWNS compositionBase + fallbackSeen — DI'd into the animation, not a param bag)
  options.ts          (← engine-options.ts)
  css-metadata.ts     (← engine-css-metadata.ts)
  playback.ts         (← engine-playback.ts, breaking the circular import via an injected host interface it already half-has via PlaybackHost)
  element-env.ts      (← the _buildElementAwareEnv / _resolveElementAwareValues pair, ~110 lines, cleanly extractable)
```
The composition split should become a real collaborator object (`new Composition()` held as a field) so `_compositionFallbackSeen`/`compositionBase` live with the code that mutates them — true DI / service boundary, the mandate's explicit ask.

### D.2 — The FLAT hyphenated-sibling families (HIGH)

Every other Q split is the same flat pattern — co-located `parent.ts` + `parent-detail.ts` siblings instead of `parent/` directories:

| family | files | LOC (parent) |
|--------|-------|--------------|
| engine | `engine.ts` `engine-composition.ts` `engine-css-metadata.ts` `engine-options.ts` `engine-playback.ts` | 1420 |
| group | `group.ts` `group-soa.ts` `group-layer-springs.ts` | 924 |
| spring | `spring.ts` `spring-duration.ts` `spring-reseat.ts` | 685 |
| frame-compiler | `frame-compiler.ts` `frame-compiler-numeric.ts` | 616 |
| waapi | `waapi.ts` `waapi-densify.ts` | 579 |
| ingest | `ingest.ts` `ingest-cssom.ts` | 348 |
| compile | `compile.ts` `compile-color.ts` | 535 |
| sequence | `sequence.ts` `sequence-events.ts` | 698 |
| drag | `drag.ts` `drag-2d.ts` | 462 |

The whole `src/animation/` tree is FLAT — 56 files in ONE directory, only `src/animation/internal/` is a real sub-dir. The mandate is explicit: "break into smaller COHESIVE sub-modules, preferably real DIRECTORY sub-modules, NOT flat hyphenated sibling files."

**PRESCRIBE — directory-ize the families** that exceed (or whose parent exceeds) the 500-line gate or that form a coupled cluster:
- `engine/` (D.1, CRITICAL)
- `group/` — `group.ts` 924 LOC is itself a second god module; `group-soa.ts` + `group-layer-springs.ts` are its split-outs. → `group/{index,group,soa,layer-springs}.ts`.
- `spring/` — `spring.ts` 685 + the 2 siblings → `spring/{index,spring,duration,reseat,linear-stops,timing-function}.ts` (folds in the camelCase files, §E).
- `compile/`, `ingest/`, `waapi/`, `sequence/`, `frame-compiler/`, `drag/` — directory-ize each family.

This is NOT contrivance: each family is ALREADY a cluster with a hub + spokes and internal cross-imports; a directory makes the boundary structural and lets the barrel (`index.ts`) be the only public surface.

### D.3 — Other >500-line god modules NOT touched by Q (HIGH)

Beyond `engine.ts`, files over the 500-line gate that are NOT decomposed at all:
- `group.ts` — **924** (god module #2; see D.2)
- `animations.ts` — **886** (a preset/registry catalog — likely a directory of grouped presets)
- `resolve-values.ts` — **796** (the `if()`/`var()`/`--fn()`/`@function` resolver — multiple distinct resolvers in one file)
- `sequence.ts` — **698**
- `spring.ts` — **685**
- `frame-compiler.ts` — **616**
- `waapi.ts` — **579**
- `load-engine.ts` — **559** (the dynamic-boundary loader; 4 surface interfaces + 6 loaders + warm — could split `load-engine/{surfaces,loaders,warm}.ts`)
- `scroll-scene.ts` — **539**
- `compile.ts` — **535**

`resolve-values.ts` (796) is the highest-value non-engine target: it holds the `supports()`/`media()` env resolver, the `if()`-branch resolver, the `var()` substituter, AND the entire `@function`/`--fn()` coercion machinery (B.1/B.2 live here). These are distinct concerns → `resolve-values/{env,if,var,custom-fn}.ts`.

---

## E. Naming-convention drift (LOW)

Three files break the kebab-case convention every other file follows:
- `src/animation/springLinearStops.ts`
- `src/animation/springTimingFunction.ts`
- `src/animation/internal/binarySearch.ts`

**PRESCRIBE — rename** to `spring-linear-stops.ts`, `spring-timing-function.ts`, `internal/binary-search.ts` (fold the two spring files into the `spring/` directory per D.2). Pure consistency; do it inside the directory-ization so it's one move, not a churn pass.

---

## F. What is NOT a problem (so R doesn't over-correct)

- The `@deprecated` PKG-3 aliases (`Animation`, `ScrollTimeline`, `parseCSSKeyframes`) are GENUINELY dropped in 5.0.0 — only doc tombstones remain (`engine.ts:111`, `index.ts:52`, `group.ts:5`). No dead alias code. GOOD.
- The native↔JS scroll-driver "fallback" (`scroll-scene.ts:281,347`) and WAAPI↔rAF "fallback" (`waapi.ts:445,534`) are documented ARCHITECTURAL DISPATCH (the JS driver is the universal correct backend, native is the fast-lane), not silent error handling. KEEP.
- The `COMPOSITION_FALLBACK` machinery (`engine-composition.ts`, `adapter.ts`, `validate.ts`) is the honesty-row pattern — every silent composite degradation becomes a citable diagnostic. This is the EXEMPLAR the §A.1/B.2 fixes should follow.
- `compile.ts:407` converts a `serializeEasing` throw into a typed `refusal` row — fail-explicit done right.
- `easing.ts:75` `resolveEasing` re-throws with `cause` on engine-load failure and throws `UnknownEasingError` on miss — no identity fallback. GOOD.
- No `eslint-disable`, no `@ts-ignore`/`@ts-expect-error`/`@ts-nocheck`, no empty `catch {}` (literal), no test files in `src/`, no nested `import()` inside function bodies (the `await import("./engine")` edges are the deliberate code-splitting boundary). CLEAN.

---

## Fold-list for R (deferred/chronic the lane says R must carry)

1. **engine.ts decomposition** — the Q "decomposition close" did NOT break the god class; it's a CHRONIC carried from K→Q. R must do the REAL `engine/` directory + state-cohesion (D.1), not another helper-extraction.
2. **value.js 1.2.0 `@function` workaround** (B.1/B.2) — must either ride a value.js upstream fix dispatch + kf version-guard, or be made to FAIL LOUD on a shape change. Chronic absorption otherwise.
3. **The flat-sibling convention itself** — R should ratify a "real directory sub-modules" rule so the next tranche can't re-spawn flat hyphenated siblings (the pattern that produced 8 of them in Q).
