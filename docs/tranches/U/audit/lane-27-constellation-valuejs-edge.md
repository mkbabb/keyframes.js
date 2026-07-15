# Lane 27/32 — constellation-valuejs-edge

**Fleet:** Tranche U (development-only corpus). **Repo:** keyframes.js @ 5.2.0, master post-T.
**Charter:** the value.js consume edge — pin verification, a full import inventory across the
HEAVY zones, the kf-side adapters/workarounds for value.js behavior, and the draft
`KF-TO-VALUEJS-U.md` coordination-letter content. NO value.js-internal work chartered.

---

## 0. Standing facts (verified against the live tree, not the board)

| Fact | Evidence |
|------|----------|
| kf pins `@mkbabb/value.js` `^3.1.0` (caret), sole runtime dep | `package.json` deps; `package-lock.json:12` |
| Installed value.js = **3.1.0** | `node_modules/@mkbabb/value.js/package.json` version |
| value.js still depends on `@mkbabb/parse-that ^1.0.0` (TRANSITIVE via value.js) | value.js `package.json` deps |
| **parse-that is NOT a direct kf dep** — CONFIRMED (charter ask discharged) | kf `package.json` lists only value.js; reached only through value.js's `./parsing`/`.` |
| **42** HEAVY src files import the bare `@mkbabb/value.js` `.` megabarrel | `grep -rc 'from "@mkbabb/value.js"'` |
| **1** src file uses a value.js SUBPATH: `internal/leaves.ts` → `/math` | `internal/leaves.ts:28` |
| value.js 3.1.0 ships **8 code-split subpaths**: `.`, `./color`, `./easing`, `./parsing`, `./math`, `./transform`, `./units`, `./quantize` | value.js `package.json` `exports` |
| Each subpath is a tiny (100–4KB) re-export shim into a dedicated chunk; every non-`./parsing`/non-`.` subpath is **parse-that-free** (0 packrat markers) | `dist/subpaths/*.js` byte census |
| ~24 DEMO files also bare-import the `.` megabarrel | `grep` over `demo/` |

### Full HEAVY import inventory (src/animation), grouped by the value.js subpath that now owns each symbol

| kf consumer | Symbols consumed | value.js 3.1.0 subpath that exports them |
|-------------|------------------|------------------------------------------|
| `compile/easing-registry.ts:12` | `CSSCubicBezier, cssLinear, parseLinearStops, parseSteps, steppedEase, timingFunctions` | **`./easing`** (all present) |
| `presets/classic.ts:9` | `CSSCubicBezier, steppedEase` | **`./easing`** |
| `compile/backward/backward-color.ts:25` | `Color, COLOR_SPACE_RANGES, deltaEOK, normalizeColorUnit, sampleColorRamp, scale` | **`./color`** (+`scale` in `./math`) |
| `compile/plain-vars.ts:28` | `isColorUnit, ValueUnit` | `./color` (`isColorUnit`) + `./parsing` (`ValueUnit`) |
| `constants/defaults.ts:13` | `COLOR_SPACE_RANGES, easeInOutCubic` | `./color` + `./easing` |
| `waapi/eligibility.ts:1` | `COMPUTED_UNITS` | **`./units`** |
| `svg/morph-geometry.ts:18`, `svg/morph-svg.ts:45` | `PathGeometry` | **`./transform`** |
| `compile/parse-flatten.ts:1` | `flattenObject, functionIdentityValue, FunctionValue, memoize, normalizeValueUnits, parseCSSSubValue, prepareInterpVar, unflattenObjectToString, ValueArray, ValueUnit` | **`./parsing`** (grammar tier — legitimately parse-that-bearing) |
| `compile/adapter.ts:1` | `extractAnimationOptions, extractFunctions, extractKeyframes, extractProperties, parseCSSStylesheet, ValueArray` | `./parsing` |
| `compile/selector.ts:14` | `ValueUnit, parseCSSValueUnit` | `./parsing` |
| `compile/frame-compiler.ts:14` | `seekPreviousValue, unflattenObject, ValueUnit` | `./parsing` |
| `compile/backward/{format,densify,easing-serialize,format-options,view-transition}.ts`, `compile/entry.ts` | `camelCaseToHyphen, formatCSS, reverseCSSTime, reverseAnimationShorthand, serializeStylesheetItem, timingFunctions, unflattenObjectToString, ValueArray, ValueUnit` | `./transform` (format/reverse) + `./easing` (`timingFunctions`) + `./parsing` (value model) |
| `engine/{animation,interpolate,composition,play-lifecycle}.ts`, `engine/css/{css-animation,metadata}.ts` | `ValueUnit, clamp, lerpArray, lerpValue, scale, parseCSSTime, sleep` | `./parsing` + `./math` + (`sleep`/`parseCSSTime` root) |
| `group/{soa,compositor}.ts` | `ValueUnit, lerp` | `./parsing` + `./math` |
| `resolve/*.ts` | `FunctionValue, ValueArray, ValueUnit, parseCSSValue, coerceToSyntax, CustomFunctionDescriptor/Parameter, CustomFunctionDescriptor` | `./parsing` |
| `scroll/{grammar,range,scene,trigger}.ts` | scroll-grammar types + `Stylesheet` + extractors | `./parsing` (grammar) |
| `waapi/emission.ts:1` | `unflattenObjectToString` | `./parsing`/`./transform` |
| `constants/types.ts` | ALL `import type` (erased — no runtime edge) | n/a |

**Takeaway:** value.js has partitioned its surface into a subpath taxonomy that maps almost
one-to-one onto kf's zone-level symbol clusters — and kf consumes NONE of it except the one
`/math` leaf. The consume edge is stuck at the pre-2.x "one megabarrel" model.

---

## Findings (severity-ranked; every row carries file:line evidence read from the tree)

### F1 — MAJOR — The entire HEAVY consume edge bare-imports the value.js `.` megabarrel; the published subpath taxonomy is un-consumed
**Area:** whole HEAVY surface (`src/animation/**`).
**Evidence:** 42 files import `from "@mkbabb/value.js"` (root); only `internal/leaves.ts:28`
uses a subpath (`/math`). value.js 3.1.0 exports `./color ./easing ./parsing ./transform
./units ./quantize` — each a code-split, mostly parse-that-free chunk (`dist/subpaths/*.js`
census: `easing.js` 1.1KB, `color.js` 4.3KB, `units.js` 1KB, `transform.js` 288B, ALL zero
packrat markers). The exact symbol clusters kf consumes live in those subpaths
(`easing-registry.ts:12-19` ⊆ `./easing`; `backward-color.ts:25-35` ⊆ `./color`;
`eligibility.ts:1` = `./units`; `morph-geometry.ts:18` = `./transform`).
**Why it matters (the grand edict = PERFORMANCE):** the HEAVY surface is dynamically split
into lazy chunks (`engine-*`, `motion-path-*`, `draw-svg-*`…). Every chunk that touches value.js
imports the whole root barrel, whose graph re-exports the grammar/parse-that tier. A chunk that
only needs `COMPUTED_UNITS` (WAAPI eligibility) or `PathGeometry` (morph) has no business pulling
the CSS parser into its split. Root-barrel tree-shaking is a *hope* the bundler may honor; a
subpath import is a *guarantee*, and it severs parse-that from chunks that never parse.
**PROPOSAL (gestalt transposition, not a patch):** ratify value.js's subpath taxonomy as *the*
kf↔value.js consume contract and transpose the entire HEAVY edge onto it in one systematic pass —
`easing-registry`/`presets` → `/easing`; `backward-color`/`defaults` colour arm → `/color`;
`eligibility` → `/units`; `morph-*` → `/transform`; the value-model/grammar tier
(`parse-flatten`, `adapter`, `frame-compiler`, `resolve/*`, `scroll/*`, `group`, `engine`) →
`/parsing` + `/math`. Extend `internal/leaves.ts`'s blessed `/math` precedent to the whole tree.
Then add a standing gate (a `proof:valuejs-subpath` arm, sibling to `proof:boundary`) that REDs
any bare-`.`-barrel import of a symbol that a narrower subpath exports — so the edge cannot
regress to the megabarrel. This is the colocation edict applied to the dependency graph: consume
value.js at the granularity value.js publishes.

### F2 — MAJOR — `getTimingFunction` re-authors a CSS timing-function DISPATCHER inside kf
**Area:** `compile/easing-registry.ts`.
**Evidence:** `easing-registry.ts:30-38` hand-rolls `CUBIC_BEZIER_LITERAL` (a full
`cubic-bezier(...)` regex), `STEPS_PREFIX`/`LINEAR_PAREN_PREFIX` cheap guards, and
`:54-133` dispatches by literal shape — bezier-regex→`CSSCubicBezier`, `steps(`→`parseSteps`,
`step-start`/`step-end` keywords→`steppedEase`, `linear(`→`parseLinearStops`+`cssLinear`,
else→`timingFunctions[name]` — each wrapped in try/catch fall-through. value.js exports every
LEAF parser, but the *combinator that decides which parser a given string needs* is authored in
kf. This is precisely the pattern CLAUDE.md records value.js already internalized for
`parseCSSSubValue` (the old cross-realm `any(FunctionArgs, Value)` combinator kf used to hand-compose).
**Why it matters:** kf is holding a shard of value.js's own timing-function GRAMMAR. It is the
canonical "workaround/adapter for value.js behavior" the charter asks me to inventory — a
duplicated grammar seam that drifts the moment value.js's Easing L2 vocabulary grows
(`linear()` extensions, new step positions).
**PROPOSAL:** charter a value.js coordination ask for a single `parseTimingFunction(input:
string): TimingFunction | Easing | undefined` (or `resolveTimingFunction`) entry that internalizes
the whole dispatch (bezier / steps / step keywords / linear / registry-name) behind ONE call —
mirroring the `parseCSSSubValue` internalization. kf then deletes the regex, the two prefix
guards, and the four try/catch arms, and `getTimingFunction` collapses to a thin normalize over
value.js's result. NO kf-side re-implementation survives.

### F3 — MAJOR — The transform-seam array-boxing adapter (`plain-vars.ts`) is naturalized as a permanent "contract" and escapes the workaround-deletion ledger
**Area:** `compile/plain-vars.ts` + its two consumers.
**Evidence:** `plain-vars.ts:5-11` — *"Under value.js ≥ 2.0.1 a frame's `vars` delivers
array-boxed internal leaves — a unitless number authored as `rotation.x: 1.5` arrives as a
one-element `ValueUnit[]`, so `typeof vars.rotation.x === 'object'` … arithmetic yields NaN."*
kf's cure is a whole per-frame nested-plain projection (`buildPlainProjection` /
`refreshPlainProjection`), driven on BOTH hot paths: `engine/interpolate.ts:293-307` and
`group/compositor.ts:24,169-180`. It shipped as T.A6 / 5.2.0 (commit `efcb244`). It is framed
as a *contract* — yet the analogous linear()-normalize fold IS tracked in
`proof-workaround-deletion.mjs` (arm S7, retired on the VJ-L2 consume). plain-vars has no arm:
it never enters the upstream-fix→consume→delete lifecycle, so a future value.js that stops
boxing (or ships an authored-plain unflatten) would leave this adapter as permanent dead weight
on the two hottest loops in the library — a NO-LEGACY violation waiting to accrete.
**Why it matters:** "animate any object" is a headline seam; a per-frame projection over every
leaf is real hot-path cost incurred solely to undo a value.js representation choice.
**PROPOSAL:** force the binary decision U was chartered to force. Either (a) RATIFY numbers-out
as the permanent, desirable public transform contract and document it as kf-owned API (not a
value.js workaround) — in which case delete the "≥2.0.1 boxing" provenance framing; OR (b)
charter a value.js `unflattenObject`/`unflattenAuthored` variant that yields authored-plain
values (bare `number` where the author wrote a number, string where a unit/colour demands one),
consume it, delete `plain-vars.ts` and both hot-path branches, and enter it as a
`proof:workaround-deletion` arm keyed on the new value.js API's presence. Do NOT let it drift as
an un-tracked "contract." (Recommended: (b) — the projection is value.js-representation debt, and
the deletion ledger is the exact mechanism U inherited to retire it.)

### F4 — MAJOR — The `proof:deps-current` FLOOR (value.js 0.13.0) is vacuous relative to the 2.0.1/3.x APIs kf now hard-assumes present
**Area:** `scripts/proof-deps-current.mjs`.
**Evidence:** `proof-deps-current.mjs:72` — `"@mkbabb/value.js": "0.13.0"` as the installed FLOOR.
But kf's SOURCE now hard-assumes: value.js ≥ 2.0.1 leaf-boxing (`plain-vars.ts:6`); the value.js
2.0.x `@function` param fix, whose recovery apparatus is DELETED (`resolve-function.ts:22-28`);
the `/math` subpath (`leaves.ts:28`, a 1.x+ feature); the 3.x subpath taxonomy (F1's target).
A resolver landing value.js 0.13.0 — *permitted by this floor* — would break kf outright; only
the manifest `^3.1.0` protects it, making the FLOOR gate misleading and non-load-bearing.
**Why it matters:** the gate exists precisely to catch a pin reverted below the correctness
minimum; it currently green-lights a version 12 majors stale.
**PROPOSAL:** advance the value.js FLOOR to the true correctness minimum — the version that first
ships the contract kf's source assumes (the 2.0.1 boxing + 2.0.x `@function` fix + the 3.x
subpath taxonomy once F1 lands, i.e. floor to `3.1.0` or the U-tranche cut). Fold this into U's
CI-trim band so the trimmed gate roster keeps a floor that actually bites.

### F5 — MINOR — Stale "value.js 1.2.0 bug" provenance comments outlive the fix (NO-LEGACY)
**Area:** `resolve/env.ts:55`, `compile/adapter.ts:58`, `resolve/core.ts:82`.
**Evidence:** these three sites still narrate a *"value.js 1.2.0 bug — the default was
mis-assigned to `type`"* / *"LIVE on the value.js 1.2.0 dashed-call parse,"* while
`resolve-function.ts:22-28` records the bug was fixed at value.js 2.0.x and *"the R.W3 §2C
recovery apparatus is DELETED."* The generic FAIL-EXPLICIT diagnostic arms are legitimate and
stay; only the historic-bug provenance is now stale documentation that reads as a live workaround.
**PROPOSAL:** in U's NO-LEGACY comment sweep, purge the "value.js 1.2.0 bug" provenance from the
three comments (retain the `CUSTOM_FN_ARG_DROP` fail-explicit rationale, which is version-agnostic).
Comments must not assert a fixed upstream defect as live.

### F6 — MINOR — The DEMO consume edge also bare-imports the megabarrel
**Area:** `demo/@/**`, `demo/scenes/**`, `demo/@/state/**` (~24 files).
**Evidence:** e.g. `TimingFunctionPanel.vue:51` (`CSSCubicBezier, bezierPresets` → `./easing`),
`animationOptionsStore.ts:1` (`jumpTerms` → `./easing`), `matrix-editor/transformMath.ts:1`
(`FunctionValue, ValueUnit` → `./parsing`), `orbital-drag/quaternionEuler.ts:1` (`clamp` →
`./math`), `EasingTarget.vue:119` (`cubicBezierToString, stepEnd, stepStart, steppedEase` →
`./easing`). Same megabarrel pattern as F1 on the demo side; Vite tree-shakes the app bundle so
the perf stake is lower, but the *grand recursive-colocation edict* names ALL directories and the
consume-granularity principle is uniform.
**PROPOSAL:** apply F1's subpath transposition to the demo in the same pass (demo scenes/@ are in
U's restructuring scope anyway), and extend the F1 gate to `demo/` so the app edge matches the
library edge. One contract, both surfaces.

### F7 — MINOR — `^3.1.0` caret against an actively-developed sibling with a breaking-major history
**Area:** `package.json` deps.
**Evidence:** kf pins `@mkbabb/value.js` `^3.1.0`; the charter states value.js's own tranche is
in ACTIVE development elsewhere, and value.js has shipped breaking majors before (2.0.0 — the
boxing/`@function` seam kf adapts to). MEMORY's glass-ui note already moved to a TILDE pin
(`~3.5.1`) for exactly this "sibling-in-flight, breaking-prone" reason; value.js is the more
volatile sibling yet floats on a caret.
**PROPOSAL:** freeze the consume-edge contract via the `KF-TO-VALUEJS-U.md` letter (§ below) and
tie kf's value.js pin to value.js's *deliberate U-tranche cut* — a witnessed re-pin at the
constellation close (the S.H4→2.0.x→consume lifecycle idiom), not a silent caret float. Consider
a tilde pin during value.js's active tranche to make each minor a witnessed consume, matching the
glass-ui discipline.

---

## Draft content for `KF-TO-VALUEJS-U.md` (the coordination letter — content only; the file is NOT written by this lane)

> **From:** keyframes.js Tranche U (consume-edge charter). **To:** value.js (tranche IN ACTIVE
> DEVELOPMENT). **Status:** kf pins `^3.1.0`; kf charters ONLY its consume edge — no
> value.js-internal work is requested or authorized from kf's side.

**A. The consume-edge contract kf now depends on (freeze these — a break here breaks kf's HEAVY surface):**
1. The **subpath taxonomy** `./color ./easing ./parsing ./transform ./units ./math ./quantize`
   is now a load-bearing API. kf will transpose its whole HEAVY edge onto it (F1). Ask: keep
   these subpaths stable and their symbol membership additive; keep `./easing ./color ./units
   ./transform ./math` **parse-that-free** (they are today — preserve that as a contract, it is
   what lets kf sever the grammar tier from its non-parsing chunks).
2. `ValueUnit` leaf **boxing at the unflatten seam** (≥2.0.1) is the behavior `plain-vars.ts`
   adapts to (F3). kf needs a DECISION from value.js here — see ask C.
3. The value.js 2.0.x `@function` param grammar fix (`CustomFunctionParameter.name/syntax/default`)
   is CONSUMED and its kf recovery apparatus DELETED — do not regress it (`resolve-function.ts:22-28`).
4. VJ-Q4 `ValueUnit.fnName` clone-preserved provenance (`parse-flatten.ts:30-35`) — keep.
5. `PathGeometry` (`./transform`) is the ONE geometry edge morph legitimately needs — keep its
   `sampleAtLength`/polyline surface stable (`morph-geometry.ts`).

**B. NEW ask — a unified timing-function parser (retires kf-side grammar duplication, F2):**
Provide `parseTimingFunction(input: string): TimingFunction | Easing | undefined` on `./easing`
that internalizes the full dispatch (bezier / steps / step-start|end keywords / linear() / registry
name), throwing-free (returns `undefined` on unrecognized), mirroring the `parseCSSSubValue`
internalization. On landing, kf deletes its `CUBIC_BEZIER_LITERAL` regex + prefix guards + four
try/catch arms in `easing-registry.ts`.

**C. NEW ask (decision-gated) — authored-plain unflatten (retires `plain-vars.ts`, F3):**
Offer an `unflattenObject` variant (or an option) that yields **authored-plain values** — a bare
`number` where the author wrote a unitless number, a string where a unit/colour demands one —
instead of array-boxed `ValueUnit[]` leaves. This lets kf delete its entire per-frame plain
projection on both hot paths (`interpolate.ts`, `compositor.ts`). If value.js declines (boxing is
intentional for its own reasons), say so explicitly — kf will then RATIFY numbers-out as a
permanent kf-owned contract and stop tracking it as consume-edge debt.

**D. Version discipline:** kf will move its value.js pin as a WITNESSED consume at value.js's
U-tranche cut, not a caret float (F4/F7). value.js: please tag the U-tranche cut deliberately and
publish the subpath-taxonomy stability guarantee (A.1) so kf can advance its `proof:deps-current`
FLOOR to the true correctness minimum.

**E. Non-asks (explicitly out of scope):** kf charters NO value.js-internal refactor, NO grammar
change beyond B/C, and NO parse-that work (parse-that is value.js's transitive concern; kf has no
direct edge — confirmed).

---

## What U must charter

1. **Transpose the entire HEAVY value.js consume edge onto value.js 3.1.0's subpath taxonomy**
   (`./easing`, `./color`, `./units`, `./transform`, `./parsing`, `./math`) in one systematic
   pass, extending the blessed `internal/leaves.ts:/math` precedent to all 42 heavy files (F1).
2. **Stand up a `proof:valuejs-subpath` gate** (sibling to `proof:boundary`) that REDs any bare-`.`
   megabarrel import of a symbol a narrower value.js subpath exports — library AND demo (F1/F6).
3. **Charter the value.js coordination letter `KF-TO-VALUEJS-U.md`** with the § content above:
   freeze the subpath + boxing + `@function` + `PathGeometry` contract; ask for
   `parseTimingFunction` (B) and the authored-plain unflatten decision (C) (F2/F3).
4. **Force the `plain-vars.ts` binary decision** — ratify numbers-out as permanent kf-owned API OR
   charter its deletion against a value.js authored-plain unflatten, and enter it as a
   `proof:workaround-deletion` arm either way (F3).
5. **Delete the kf-side timing-function dispatcher** in `easing-registry.ts` once value.js ships
   the unified `parseTimingFunction` (F2).
6. **Advance the `proof:deps-current` value.js FLOOR** from `0.13.0` to the true correctness
   minimum (the 2.0.1/3.x contract kf's source assumes), folded into U's CI-trim band (F4).
7. **Purge the stale "value.js 1.2.0 bug" provenance comments** (`env.ts:55`, `adapter.ts:58`,
   `core.ts:82`) in the NO-LEGACY comment sweep, retaining the version-agnostic fail-explicit
   rationale (F5).
8. **Move kf's value.js pin as a witnessed consume** at value.js's U-tranche cut (tilde during the
   sibling's active tranche), not a caret float — matching the glass-ui discipline (F7).
