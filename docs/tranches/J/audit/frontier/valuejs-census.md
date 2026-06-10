# valuejs-census — the verified current state of @mkbabb/value.js (the boundary substrate)

**Lane:** the value.js CENSUS — the verified current state both repos' Tranche-K/M planning
must rest on. Written into the KF corpus (READ-ONLY on both source repos).

**Provenance:** direct source survey of `/Users/mkbabb/Programming/value.js` (working tree HEAD
on `tranche-f-handoff`, the publish lineage) + the kf consumption seam (`/Users/mkbabb/Programming/keyframes.js/src`)
+ the J handoff ledger (`docs/tranches/J/audit/constellation-edges.md §2e`, `recap-GH.md`,
`PROGRESS.md`) cross-checked against value.js HEAD, NOT trusted from the ledger.

**Date:** 2026-06-10.

---

## §0 — The two load-bearing corrections (read these first)

Two facts overturn assumptions in the directive's working hypothesis and the kf CLAUDE.md.

### §0.1 — The value.js DOC lineage (A→M, v1.0.0) DIVERGED from the PUBLISHED lineage (0.11.2)

The directive describes "value.js … version 0.11.2, its own tranche lineage A→M". These are
**two different lineages that do not meet**:

- **Published / consumed lineage** — what kf actually depends on (`@mkbabb/value.js@^0.11.2`,
  installed `0.11.2`). Its git is `tranche-f-handoff` HEAD (`0cb5dd2`). The version chain is:
  `v0.11.0` tag = "the Tranche **F** hand-off" (`e8cc1fb`) → `0.11.1` (dropped the broken
  `development` export, `4c8c532`) → **`0.11.2`** (UNTAGGED HEAD — `parseCSSValueUnit`
  empty-input contract, authored explicitly "kf Tranche I B1 dependency", `0cb5dd2`).
- **Doc lineage** — `docs/tranches/A..M`. **Tranche M** (`docs/tranches/M/M.md` +
  `PROGRESS.md`) is **planning-only, never dispatched** (`PROGRESS.md:5,47`: "No M wave
  dispatches until ratified … Status: OPEN (awaiting ratification)"). M's spine-head wave
  **M.W4 would "publish value.js 0.11.0"** — but 0.11.0 ALREADY shipped from F, so M's anchor
  number is stale. **M targets `v1.0.0`; no `v1.0.0` tag exists** (`git tag` → highest is
  `v0.11.0`/`v0.11.1`). M is also overwhelmingly **api/demo/glass-ui work** (the `development`
  export deletion, WithId casts in `api/src`, aurora-derive, blob extirpation, router 4→5) —
  the genuinely value.js-LIBRARY items in M are tiny (`parseCSSColor` return-type tighten,
  a `parseColorUnitToRgb01` color-resolver primitive — neither shipped, both demo-driven).

**Consequence for K/M planning:** value.js's "own current trajectory" per the directive (M →
v1.0.0) is **aspirational and stalled**. The live substrate K must plan against is **0.11.2 =
F-handoff + two patches**. Do not plan as if M shipped. The one published M-relevant precept
fix (the `development`-export removal) DID land out-of-band at `0.11.1` (`4c8c532`), so the
dual-instance precept hazard is already closed in what kf consumes.

### §0.2 — kf has FULLY SHED its value.js re-export barrels; the "contested middle" is RESOLVED

The kf CLAUDE.md "Project Tree" (`src/units/`, `src/parsing/`, `src/easing.ts`, `src/math.ts`,
`src/utils.ts` barrels + a LOCAL `src/units/normalize.ts` "DOM-aware unit normalization") is
**STALE**. The live kf `src/` is **only `src/animation/` + `env.d.ts`** (verified:
`find src -maxdepth 2 -type f`). There is **no `src/units/`** in kf. The directive's "two
normalize.ts files … map the actual split" resolves cleanly: **there is now exactly ONE**
(`value.js/src/units/normalize.ts`, 494 LoC — `getComputedValue`, `normalizeNumericUnits`,
`normalizeValueUnits`, the C1/C2/C7 layout-epoch cache + `bumpLayoutEpoch`). kf consumes it
across the package boundary. **The DOM-resolution middle is wholly value.js's; the seam is
clean — no duplication to reconcile there.** (One kf-side action this implies: the kf CLAUDE.md
project tree is fiction and should be re-derived — flagged for kf, out of this lane's scope.)

---

## §1 — value.js src census (HEAD, `wc -l`)

11,702 LoC across 42 source files in 8 dirs. The substrate, by domain:

| Domain | Files (LoC) | Boundary role |
|---|---|---|
| **units/color/** (color science) | `index.ts` 732, `constants.ts` 551, `dispatch.ts` 349, `gamut.ts` 347, `colorFilter.ts` 305, `conversions/{direct 288, lab 239, xyz-extended 220, cylindrical 193, oklab 156, kelvin 123, transfer 109, index 71, hex 44}`, `normalize.ts` 126, `contrast.ts` 110, `mix.ts` 81, `matrix.ts` 75 | VALUE — oklab/deltaE/gamut/mix; the color moat (K-SEED ED-4 fidelity headline) |
| **units/** (value types + normalize) | `constants.ts` 736, `utils.ts` 611, `normalize.ts` 494, `index.ts` 302, `interpolate.ts` 267 | VALUE + the DOM-resolution MIDDLE (now wholly here) |
| **parsing/** | `color.ts` 662, `stylesheet.ts` 520, `math.ts` 509, `animation-shorthand.ts` 289, `extract.ts` 200, `serialize.ts` 160, `units.ts` 154, `index.ts` 291, `utils.ts` 89, `grammars/*.bbnf` | VALUE — CSS value/color/stylesheet grammars; the round-trip substrate |
| **easing.ts** | 505 | VALUE — easing MATH + `cssLinear(LinearStop[])` evaluator + presets |
| **transform/decompose.ts** | 541 | VALUE — matrix decompose/recompose + `slerp` + `interpolateDecomposed` |
| **quantize/** | `cluster.ts` 356, `index.ts` 191, `types.ts` 50 | VALUE — k-means pixel quantize / dominant color (image domain) |
| **math.ts** | 122 | VALUE — `clamp/scale/lerp/lerpArray(SoA)/logerp/bezier` |
| **utils.ts** | 206 | shared — `memoize` (the cache primitive), `clone`, rAF shims |

**Exports map (published):** `package.json` declares **only `"."`** (the barrel → `dist/value.js`).
The `dist/` tree HAS per-subpath `.d.ts` files (`parsing/*.d.ts`, `units/color/*.d.ts`, …) but
**no subpath export entries** — so `@mkbabb/value.js/units/color` is NOT importable; all
consumption flows through the single barrel (`dist/index.d.ts` re-exports everything). This is
the M.W7 "subpath exports" cohort ask — **unshipped**. Relevant to ED/K only if a consumer wants
tree-shakeable deep imports; kf does not (it relies on the kf-side static/dynamic boundary, not
value.js subpaths).

---

## §2 — The seam: exactly what kf imports from value.js TODAY

kf imports value.js from **6 files**, all under `src/animation/` and all behind kf's own
HEAVY/dynamic boundary (`loadAnimationEngine()`); the LIGHT modules carry zero value.js edge by
inlining trivia into `internal/leaves.ts` (a DELIBERATE byte-equivalent duplication of
`clamp/scale/lerp` + rAF — `leaves.ts:1-18` documents why: an external specifier survives
bundling even for a one-liner, so severing the static edge requires re-homing). The complete
consumed symbol set:

| kf file | value.js symbols consumed |
|---|---|
| `engine.ts` | `clamp, isObject, lerpValue, parseCSSTime, scale, sleep, ValueUnit`, type `PropertyDescriptor` |
| `utils.ts` | `CSSCubicBezier, CSSFunction, CSSValues, cssLinear, flattenObject, FunctionValue, jumpTerms, normalizeValueUnits, prepareInterpVar, steppedEase, timingFunctions, tryParse, unflattenObjectToString, ValueArray, ValueUnit`; types `ColorSpace, HueInterpolationMethod, LinearStop, NormalizeValueUnitsOptions` |
| `frame-compiler.ts` | `clamp, convertToMs, parseCSSValueUnit, seekPreviousValue, unflattenObject, ValueUnit` |
| `adapter.ts` | `extractAnimationOptions, extractKeyframes, extractProperties, parseCSSStylesheet`; types `KeyframeRule, PropertyDescriptor, Stylesheet` |
| `format.ts` | `camelCaseToHyphen, formatCSS, reverseCSSTime, timingFunctions, unflattenObjectToString, ValueUnit` |
| `constants.ts` | `COLOR_SPACE_RANGES, easeInOutCubic, timingFunctions`; types `ColorSpace, HueInterpolationMethod, InterpolatedVar, ValueArray, ValueUnit` |
| `waapi.ts` | `COMPUTED_UNITS, unflattenObjectToString` |
| `group.ts` | `ValueUnit, lerp` |
| `animations.ts` | `CSSCubicBezier, steppedEase` |

**Boundary verdict:** the hypothesis holds and is CLEANER than stated. kf imports value.js's
**value substrate** (ValueUnit, parse, normalize/interpolate kernels, easing math, the SoA-less
`lerp`) and owns **time** (frames, playback, group/sequence/stagger). The DOM-resolution middle
the hypothesis called "contested" is **uncontested** — it lives entirely in value.js's
`normalize.ts`/`interpolate.ts` and kf consumes `lerpValue`/`normalizeValueUnits`/
`prepareInterpVar` as opaque kernels. `extractAnimationOptions` (kf-consumed) transitively wraps
`parseAnimationShorthand` (`value.js/src/parsing/extract.ts:118`) — so kf ALREADY consumes the
animation-shorthand parser indirectly.

---

## §3 — Handoff-ledger verification against value.js HEAD (each item, re-checked)

The kf J ledger (`constellation-edges.md §2e`, `PROGRESS.md`, `recap-GH.md`) names a set of
sibling HANDOFFs. Verdict per item, checked against value.js HEAD source — NOT trusted:

| Handoff | Ledger claim | HEAD reality | Verdict |
|---|---|---|---|
| **lerpArray SoA** (VJ-D2) | exists, published, **kf-unconsumed** | `math.ts:48` `lerpArray(start,stop,t,out): Float64Array` EXISTS, exported (`index.d.ts`), IN published 0.11.2. **kf grep = 0** (numeric.ts uses scalar `lerp` from `internal/leaves.ts`). Bench `bench/numeric-soa.mjs:10`: `~2.0× at K≥8, ~2.3× at K=64, ABSENT at K=1` (the math.ts doc-comment's 1.56×K=2→4.25×K=64 is the same shape on another machine). The ledger's "0.73×K=1→4.14×K=16" numbers are stale/another run; the INVARIANT is: bites at realistic K (kf's K=6-10 transform shape), absent at K=1. | **CONFIRMED. kf-MEASURE-FIRST** (see Item J-1) |
| **linear() string parser E1** | undefined in 0.11.2; kf `parseLinearStops` shim lives | value.js ships `cssLinear(stops: LinearStop[])` (`easing.ts:33`) — the EVALUATOR over **pre-parsed** structs. There is **NO string→`LinearStop[]` parser**. kf's `parseLinearStops` (`src/animation/utils.ts:106-130`) does that string parse and feeds `cssLinear`. | **CONFIRMED OPEN.** value.js owns the curve math, kf owns the string parse (see Item VJ-1) |
| **VJ-F1 arc-length path sampler** | OPEN; `getPointAtLength`/`samplePath` undefined | **No path/geometry code anywhere in value.js src** (grep: arcLength/samplePath/getPointAtLength/motionPath = 0). kf's `motion-path.ts:13-18` AND `draw-svg.ts:18-20` BOTH explicitly route the "heavier SVG-geometry half (parse path `d` → length-parametrized sampler)" OUT to value.js (VJ-F1) and BOOK it — they only do the CSS-native scalar sweep (`offset-distance` / `getTotalLength()`). | **CONFIRMED OPEN.** The one real competitor-gap (MorphSVG/numeric-MotionPath) blocked on value.js (see Item VJ-2) |
| **VJ-F2 / LD-DIAG diagnostics sink** | OPEN; no `ResolvedKeyframes.diagnostics` | No `diagnostic`/`DiagnosticSink`/`onWarn` in value.js src (grep = 0). The parse path throws or returns typed-empty (`parseCSSValueUnit` empty-input contract was the 0.11.2 cut), no structured warning channel. | **CONFIRMED OPEN** (see Item VJ-3) |
| **MCI-5 identity-pad / arity pad** (VJ-4) | OPEN; `it.fails` witness GREEN | The `it.fails` witness lives at kf `test/interpolate-anything.test.ts:242-256` ("FLIPS RED when value.js MCI-5 identity-aware pad lands"). value.js has no identity-aware function-arity pad in interpolation. | **CONFIRMED OPEN.** Witness-gated — the test IS the consume signal |
| **VJ-7 / F3 tryParseCache LRU bound** | OPEN; unbounded Map | **PARTIALLY MISDIAGNOSED.** value.js `memoize` (`utils.ts:108-159`) DOES implement `maxCacheSize` with FIFO eviction (`:114,147-150`) — the machinery EXISTS. The defect is that **every parse-cache call site defaults `maxCacheSize=Infinity`** (`parseCSSValueUnit:115`, `parseCSSColor:635`, `parseCSSValue/Percent/Time:262/269/275`, `parseCSSStylesheet:514`, `getComputedValue` — none sets a bound). So caches grow unbounded in a long-lived page. **The fix is CONFIGURATION, not construction** — far smaller than "build an LRU." | **CONFIRMED OPEN — but S, not L** (see Item VJ-4) |
| **VJ-F4 buffer overload** (`unflattenObjectToString(flat, out?)`) | OPEN; no out-buffer overload | `unflattenObjectToString` exists + is kf-consumed (waapi.ts, format.ts, utils.ts) but takes no caller-owned out buffer. A speculative GC-relief overload; no measured kf pressure cited. | **CONFIRMED OPEN — speculative** (see Item VJ-5, BOOK) |
| **parse-that packrat re-key** (PT-1) | parse-that-owned; WITHHELD, gate-first | parse-that-internal, not value.js. ALSO surfaced: a **pin skew** — value.js HEAD pins `@mkbabb/parse-that@^0.8.2` (`package.json`), kf pins `^0.9.0`. Since parse-that is value.js's dependency (bundled), the skew is internal to value.js. | **OUT (parse-that-owned)** + a value.js pin-refresh (see Item VJ-6) |

---

## §4 — Duplication census (what kf re-implements that value.js also ships / could own)

| kf re-implements | value.js state | Verdict |
|---|---|---|
| `internal/leaves.ts` `clamp/scale/lerp` + rAF shims | value.js owns canonical (`math.ts`, `utils.ts`); kf copies are byte-equivalent, parity-tested | **KEEP the duplication** — it is LOAD-BEARING (severs the static value.js edge for light-only consumers; `leaves.ts:1-18` documents the rationale; `proof:boundary` enforces). NOT a fold. |
| `parseLinearStops` (string→`LinearStop[]`, utils.ts:106-130) | value.js has the `cssLinear` evaluator but NOT the string parser | The parse half COULD fold into value.js (it is value-domain CSS-grammar work). See VJ-1. |
| `spring.ts` (491 LoC, full spring physics) + `decay.ts` (100 LoC) | value.js has **NO spring/decay math** (grep: spring/stiffness/damping = 0 outside a color constant) | kf OWNS all motion physics. `decay.ts:17` self-flags "value.js hand-off VJ-1; `decay` ships keyframes-local today and collapses to a thin caller once value.js publishes the canonical surface." This is the boundary's REAL contested case (see §5). |
| `springLinearStops.ts` (spring→CSS `linear()` string) + `springTimingFunction.ts` | value.js `cssLinear` evaluates a `linear()`; the spring→stops SAMPLING is kf | kf-owned (it is animation-semantic: spring → CSS twin). KEEP. |

**No accidental duplication found.** Every kf re-implementation is either (a) load-bearing
boundary-severance (`leaves.ts`), (b) a documented BOOKED fold-out (`parseLinearStops`,
`decay`), or (c) genuinely animation-semantic (spring/twin). The seam is disciplined.

---

## §5 — The boundary hypothesis: where it holds, where REALITY differs

> Hypothesis: value.js owns easing/bezier/**spring** MATH; kf owns animation semantics.

**It holds for easing/bezier** (value.js `easing.ts`, `math.ts` — kf consumes
`CSSCubicBezier/steppedEase/cssLinear/jumpTerms/timingFunctions`). **It does NOT hold for
spring/decay PHYSICS** — value.js ships **none**; kf owns `spring.ts` (491) + `decay.ts` (100)
entirely, and `decay.ts` self-documents a fold-OUT intent that has never landed (the VJ-1
"canonical surface" is unpublished). The K-SEED frontier (PHYS-C spring-driven blend, PHYS-B2
reseat, SO-2 snapDecay) leans hard on this physics — and it is **all kf-local**. The honest
reading: **spring/decay MATH is a legitimate value.js candidate (pure, DOM-free, testable in
isolation) BUT has zero pull until a SECOND consumer exists.** glass-ui consumes a spring from
*keyframes* (per M.md §3: "`glass-ui(lib) → keyframes(lib)` is the spring dep") — so the spring
already has a cross-repo consumer, but it is sourced from KF, not value.js. Moving it to value.js
would invert an established edge for no functional gain. **Verdict: leave spring/decay in kf**
(the boundary hypothesis is wrong here, and reality is the better design — physics rides with the
time engine that schedules it). Only the closed-form `decay` *sampler* (pure math, no clock) is a
clean ≥2-consumer-gated future fold; not now.

---

## §6 — Dead / speculative surface (value.js's own no-legacy question)

From **kf's** consumption view, a large value.js surface is orphaned: `quantizePixels`,
`dominantColor`, `KelvinColor`, `rgb2ColorFilter`/`cssFiltersToString`, `decomposeMatrix3D`/
`recomposeMatrix3D`/`slerp`, `mixColorsN`, `computeSafeAccent`, `deltaEOK`, `gamutMapOKLab`,
`registerColorNames`, `evaluateMathFunction`, `parseAnimationShorthand` (direct) — **all 0 kf
consumers**. BUT value.js is a **multi-consumer substrate**: every one of these has value.js-
internal `src/` + `test/` (and several `demo/`) consumers — they are the **glass-ui / color-tool
/ image-quantize** surface, NOT dead globally (e.g. `deltaEOK`: 4 src + 1 demo + 1 test;
`computeSafeAccent`: 2 src + 2 demo; `quantizePixels`: 1 demo + 1 test). **No truly-dead export
found from the data I can verify** (kf + value.js repos). A genuine dead-surface call requires
the glass-ui consumption map, which is out of this lane's read scope — flagged, not claimed.

**One note for K:** `parseAnimationShorthand` + `reverseAnimationShorthand` (the full
animation-shorthand parse+emit round-trip) are value.js-internal-consumed AND are precisely the
primitive the K-SEED **CC-1 CSS compiler** and **K1 live-stylesheet ingestion** will want for the
backward (emit) direction. kf already eats the parse side via `extractAnimationOptions`; the
**emit** side (`reverseAnimationShorthand`) is shipped, exported, and kf-unconsumed — a ready
VJ→KF-consume for K's compiler emit path.

---

## §7 — Actionable items (returned as StructuredOutput)

The disposition vocabulary, applied. IDs prefixed VJ-* (value.js-side) / KF-* (kf-side consume).
All MEASURE-FIRST perf items carry the bench that must bite. The ARCH kills (WASM-parser,
Typed-OM carrier, ValueUnit monomorphization) are respected and not re-litigated.
