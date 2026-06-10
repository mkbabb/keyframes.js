# valuejs-fold-out — the FOLD-OUT audit (value.js→kf consumption) + VJ-REFINE

**Lane:** FOLD-OUT — what kf should CONSUME that value.js already ships (the under-consumption
census), the consume-edge shapes (what kf DELETES on consume), plus the VJ-REFINE list (what
value.js itself needs net-new or upgraded for the K frontier). Written into the KF corpus;
READ-ONLY on both source repos.

**Provenance:** direct source survey of `/Users/mkbabb/Programming/value.js` HEAD
(`tranche-f-handoff`, `0cb5dd2`, published `0.11.2`) + the kf consume seam
(`/Users/mkbabb/Programming/keyframes.js/src/animation/`, branch `tranche-j-dev`) +
`valuejs-census.md` (same fleet) + `K-SEED.md`. Every claim carries file:line in BOTH repos.
The lerpArray bench was RUN locally on value.js HEAD (`node bench/numeric-soa.mjs`), not inherited.

**Date:** 2026-06-10.

---

## §0 — The one fact this lane adds to the census

The census established the seam is clean (one `normalize.ts`, no barrel duplication, spring is
kf-local-and-correct). This lane's job was to test the **under-consumption** hypothesis — that kf
re-implements what value.js ships. The finding splits the SoA story in two, which the census
collapsed: **kf has TWO interpolation hot paths with OPPOSITE consume-readiness**, and the census's
single "KF-1 lerpArray DO-IF-MEASURED" verdict elides that the easy consume and the hard consume
are different code:

1. `NumericAnimation.at()` (`numeric.ts:175-181`) — ALREADY SoA-shaped (parallel `startVals:
   number[]` / `stopVals: number[]`, `numeric.ts:139-140`), scalar `lerp` in a per-key loop. This
   is a **clean lerpArray consume** (convert the two value arrays to `Float64Array` once at
   `buildSegment`, replace the loop with one `lerpArray` call + a scatter back to `this.result`).
2. `Animation.interpFrames()` (`engine.ts:657-742`) — AoS over `ValueUnit[]` per key
   (`flatVars`), per-iv `_lerp` closure inside `processFrame` (`engine.ts:769`). There is **NO
   Float64Array carrier** in the CSS-frame model — the leaves being lerped ARE the `ValueUnit`s
   (`frame-compiler.ts` `acc[key] = value.map(v => v.value)`). Consuming `lerpArray` here needs a
   structural SoA carrier = the **ValueUnit-monomorphization ARCH-kill neighborhood**. NOT a clean
   consume; correctly OUT.

So KF-1 is really **two items**: a small DO (numeric SoA) and a no-op (the CSS path can't take it
without breaching an ARCH kill). The bench bites hard enough that the numeric DO is worth it.

---

## §1 — The under-consumption census (value.js→kf, with consume-edge shapes)

### KF-1 — lerpArray (SoA) into `NumericAnimation` — bench BITES, consume is CLEAN

**value.js:** `lerpArray(start: Float64Array, stop: Float64Array, t, out): Float64Array`
(`math.ts:48-60`), exported (`index.ts`), shipped in 0.11.2, **kf grep = 0**.

**Local bench (RAN on value.js HEAD, `node bench/numeric-soa.mjs`, this machine, 2026-06-10):**

| K | AoS (current shape) | SoA lerpArray | speedup |
|---|---|---|---|
| 1 | 11.36ms | 21.65ms | **0.52× SLOWER** |
| 2 | 44.52ms | 28.01ms | 1.59× |
| 4 | 67.05ms | 25.67ms | 2.61× |
| 8 | 107.42ms | 36.39ms | 2.95× |
| 16 | 227.96ms | 49.88ms | 4.57× |
| 64 | 1359.89ms | 324.23ms | 4.19× |

The land bar (bites ≥1.5× at realistic K) is met at K≥2 and the win grows with K; K=1 is slower
(the whole point of MEASURE-FIRST — a 2-frame single-key animation must NOT route through the
SoA path).

**The consume-edge (the DO):** in `NumericAnimation.buildSegment` (`numeric.ts:130-143`) store
`startVals`/`stopVals` as `Float64Array` (one-time alloc per segment, already a `.map`), add a
`result` scratch `Float64Array` sized to `keys.length`. In `at()` (`numeric.ts:175-181`) replace
the per-key scalar `lerp` loop with: `lerpArray(seg.startVals, seg.stopVals, eased, scratch)` then
a scatter `for (i) result[keys[i]] = scratch[i]`. The scatter is unavoidable (the public contract
returns a `{key: number}` object) but is a flat number-array read, not a closure call. Gate it
on `keys.length >= 2` so K=1 keeps the scalar path.

**What kf DELETES on consume:** the scalar-`lerp` import becomes conditional (still needed for the
K=1 fast path), so nothing is fully deleted — this is a HOT-PATH SWAP, not a dedup. The win is
runtime, not LoC.

**Verdict: DO-IF-MEASURED → the bench BITES → DO (numeric path only).** S effort. The CSS
`interpFrames` path is explicitly OUT (ARCH-kill neighborhood — see §0).

### KF-2 — reverseAnimationShorthand for the CC-1 compiler emit path — UNCONSUMED, ready

**value.js:** `reverseAnimationShorthand(opts: CSSAnimationOptions): string`
(`animation-shorthand.ts:262-289`), exported (`index.ts:256`), shipped, **kf grep = 0**. It emits
the full ordered shorthand (`duration timing-function delay iteration-count direction fill-mode
composition name`) with a readable seconds-formatter (`formatTime`, `animation-shorthand.ts:284`).
Note it ALREADY emits `composition` (`:277`) — directly relevant to WL2-B/CC-1 honoring.

**kf today:** `format.ts` `animationOptionsToString` (`format.ts:84-110`) hand-rolls the LONGHAND
emit (`animation-duration:`, `animation-delay:` …) via `reverseCSSTime` + `serializeEasing`. This
is correct for the LONGHAND form K's CC-1 compiler wants for the per-property block, so it is NOT
a duplication to delete. `reverseAnimationShorthand` is the **SHORTHAND** twin — a different
emit shape (one `animation:` line) that CC-1's "compact CSS" mode and K1's round-trip-fidelity
replay will want. The parse direction is already consumed: kf's `extractAnimationOptions`
(`adapter.ts:135`) → value.js `applyLonghand` calls `parseAnimationShorthand` when the decl name
is `animation` (`extract.ts:114-118`) — so kf already eats the FORWARD shorthand parse; the
BACKWARD emit (`reverseAnimationShorthand`) is the unconsumed half of the same round-trip.

**The consume-edge:** K's CC-1 compiler emit path imports `reverseAnimationShorthand` for the
shorthand-compaction mode; kf maps its `AnimationOptions` → value.js `CSSAnimationOptions` (a thin
field-rename: `timingFunction`→`timingFunction`, `iterationCount`→`iterationCount`, the easing
serialized via the existing `serializeEasing`). **No kf code is deleted** (the longhand emitter
stays for the per-property block); this is a NEW consume for a NEW emit mode.

**Verdict: DO-IF-MEASURED → DO (in K.W3 CC-1 scope).** The "measured" gate is product, not perf:
land it when CC-1 actually needs the compact form. Until CC-1 exists it is a BOOK-for-K. S effort.

### EF-3 — the linear() string parser — kf's `parseLinearStops` shim is RETIRABLE

**value.js:** ships `cssLinear(stops: LinearStop[])` (`easing.ts:33`) — the EVALUATOR over a
**pre-parsed** `LinearStop[]` (`easing.ts:28`). There is **NO `string → LinearStop[]` parser**
(grep: `parseLinear`/`parseLinearStops` in value.js src = 0).

**kf today:** `parseLinearStops(inner: string): LinearStop[] | undefined` (`utils.ts:106-130`) —
~25 LoC of CSS-grammar string parsing (split on `,`, parse `<output> [<input%> [<input%>]]`, strip
`%`, return `undefined` on malformed so the caller falls through). This is **VALUE-domain
CSS-grammar work living in the TIME repo** — exactly a fold-OUT candidate. The boundary census
(`valuejs-census.md §4`) tagged it "the parse half COULD fold into value.js."

**Ripeness:** the K-SEED notes `linear()` reached **Baseline 2026-06-11** (`K-SEED.md:37`). With
the platform faithfulness floor crossed, the round-trip emit (`format.ts` already emits spring
`linear()` strings via `serializeEasing`) needs a symmetric INGEST — and that ingest is exactly a
`string → LinearStop[]` parse feeding `cssLinear`. K1 live-stylesheet ingestion will encounter
`animation-timing-function: linear(...)` declarations in the wild and must parse them. Today kf's
shim does it; it should be value.js's, co-located with `cssLinear` and the `LinearStop` type it
already owns.

**The VJ-work shape:** value.js adds `parseLinearStops(css: string): LinearStop[] | undefined`
(or folds it into a `parseTimingFunction` that dispatches `cubic-bezier`/`steps`/`linear`) beside
`cssLinear` in `easing.ts`. Pure, DOM-free, grammar-domain — squarely value.js. The empty/malformed
contract should match the 0.11.2 `parseCSSValueUnit` precedent (typed-empty / `undefined`, never a
cryptic throw — see VJ-9).

**What kf DELETES on consume:** `parseLinearStops` (`utils.ts:106-130`, ~25 LoC) deleted outright;
the caller (`getTimingFunction`-ish resolver in `utils.ts`) calls `cssLinear(parseLinearStops(s))`
from value.js directly. A clean LoC deletion + co-location of the parse with the evaluator that
consumes it.

**Verdict (kf side): VJ→KF-consume DO — but BLOCKED on VJ-1 publishing the parser.** Until value.js
ships it, kf KEEPS the shim. Reframed as the value.js charter item it IS:

### VJ-1 — Fold the linear() string parser into value.js (the producer half of EF-3)

**Verdict: KF→VJ DO.** S effort. Pure grammar work, co-located with the type+evaluator it already
owns, ripened by linear() Baseline. Retires kf's `parseLinearStops` shim on consume.

### adapter.ts vs extract.ts / stylesheet.ts — NO duplication; already fully consumed

Tested the directive's hypothesis ("could kf's adapter consume VJ's parsers and DELETE local
code?"). **Answer: kf already does — there is no local parser to delete.** kf's
`adapter.ts:1-5,73,97,134-135` imports `parseCSSStylesheet`, `extractKeyframes`,
`extractProperties`, `extractAnimationOptions` from value.js and does ZERO local CSS parsing —
`resolveKeyframes` (`adapter.ts:94-135`) is pure orchestration (wrap-anonymous, dispatch
string-vs-AST, lift per-keyframe `animation-composition`). The capture logic the directive worried
might duplicate `extract.ts` IS `extract.ts`, consumed. **No fold available; the seam is already
optimal here.** (One forward note for WL2-B: the `animation-composition` LIFT at `adapter.ts:120`
is kf-side glue over value.js's parsed declarations — correct, animation-semantic, KEEP.)

### format.ts vs serialize.ts — NO overlap; complementary halves of the round-trip

value.js `serialize.ts` (`serializeKeyframeSelector`/`serializeDeclaration`/`serializeStylesheet`,
`:12-116` + `formatCSS` Prettier wrapper `:131`) serializes a value.js **Stylesheet AST** →
string. kf `format.ts` serializes an **Animation/AnimationFrame object** → @keyframes string
(`CSSKeyframeToString` `:112`, `CSSKeyframesToString` `:124`), consuming value.js's
`unflattenObjectToString` + `formatCSS` as leaf primitives (`format.ts:2-6`). These operate on
DIFFERENT inputs (value-AST vs animation-object) and **both are load-bearing for the K round-trip**
— `format.ts` IS the CC-1 emit substrate ("the parser run backward over the same data model",
K-SEED §1). **No duplication; no fold.**

### quantize/ + transform/ — kf-IRRELEVANT (image + matrix-decompose domains)

`quantize/` (`quantizePixels`, `dominantColor`, k-means over pixels — `index.ts:97,176`) is the
IMAGE domain (glass-ui/color-tool aurora-derive). Zero kf relevance, zero kf consumers, not dead
globally (census §6). `transform/decompose.ts` (`decomposeMatrix3D`/`recomposeMatrix3D`/`slerp`/
`interpolateDecomposed`, `:227,431,386,510`) is matrix-decompose — kf does its own matrix3d via
the computed-unit DOM pipeline and does NOT consume these (grep = 0). **Neither is a fold target.**
Note for completeness: `interpolateDecomposed` + `slerp` are a POTENTIAL future consume IF kf ever
wants matrix-path interpolation (decompose-lerp-recompose instead of raw matrix element lerp), but
there is no current kf workload demanding it — BOOK, not now.

### interpolate.ts — already consumed as opaque kernels; no duplication

value.js `interpolate.ts` (`lerpValue`/`lerpColorValue`/`lerpComputedValue`/`prepareInterpVar`,
`:187,104,26,217`) is the interp DISPATCH. kf consumes `lerpValue`/`normalizeValueUnits`/
`prepareInterpVar` (census §2) as opaque kernels — the dispatch the K-SEED EPF-2 kill confirms is
"already monomorphic-per-iv via value.js `_lerp` kernels installed at compile()". **No kf
re-implementation of dispatch; no fold.** The ONLY interp primitive kf doesn't consume is the
SoA `lerpArray` (KF-1) — and that's because kf's CSS path is AoS-by-design (§0).

---

## §2 — VJ-REFINE (what value.js needs net-new / upgraded for the K frontier)

### VJ-4 — Bound the parse-cache memos — CONFIG, not construction (S, not L)

**Confirmed against HEAD (NOT trusted from ledger):** value.js `memoize` (`utils.ts:108-159`)
**already implements** `maxCacheSize` + FIFO eviction (`utils.ts:114` default `Infinity`;
`utils.ts:147-150` the `cache.size > maxCacheSize` evict). The machinery EXISTS. The defect is
that every parse-cache call site defaults to `Infinity`:
- `parseCSSValueUnit` (`parsing/units.ts:115`)
- `parseCSSColor` (`parsing/color.ts:635`)
- `parseCSSStylesheet` (`parsing/stylesheet.ts:514`)

(plus `parseCSSValue/Percent/Time` per the census — same pattern.) In a long-lived page (the demo,
K1 live-ingestion walking the whole CSSOM) these grow unbounded. **The fix is passing
`{ maxCacheSize: N }` at three-to-six call sites** — not building an LRU. The ledger's "build an
LRU bound" framing (L) was the misdiagnosis; reality is S.

**Verdict: VJ-REFINE DO.** S effort. Pick a bound (a few thousand entries is generous for CSS
value strings); the FIFO is already correct. Tripwire: K1 ingestion is the consumer that makes
unbounded caches a real hazard, so land this WITH K1 or just before.

### VJ-6 — Refresh value.js parse-that pin ^0.8.2 → ^0.9.0 (align to kf)

**Confirmed both repos:** value.js `package.json` pins `@mkbabb/parse-that@^0.8.2`; kf pins
`^0.9.0`. Since parse-that is value.js's BUNDLED dependency, the skew is internal to value.js's
build (kf's `^0.9.0` governs nothing value.js-internal). Aligning value.js up to `^0.9.0` is
hygiene — but it's a dependency BUMP, so MEASURE-FIRST that the parser bench (`bench/parser-*.mjs`)
doesn't regress, and confirm the `^0.9.0` parse-that surface is API-compatible with value.js's
grammar consumers.

**Verdict: VJ-REFINE DO-IF-MEASURED.** S effort (a pin bump + the parser bench gate). Low urgency
unless `^0.9.0` carries a fix value.js wants.

### VJ-9 — Generalize the empty-input contract to a TOTAL parsing surface (the B1 class)

The 0.11.2 cut was ONE function's empty-input contract (`parseCSSValueUnit` typed-empty, never the
`'......'` throw — `fbea3e2`). The K-SEED frontier (K1 ingesting the live web's ARBITRARY CSS, the
diagnostics channel K3) demands this generalize: every public parse entry
(`parseCSSColor`/`parseCSSStylesheet`/`parseCSSTime`/the new `parseLinearStops`) should have a
total partial-input contract — typed-empty or a structured diagnostic, **never a cryptic throw** on
malformed live-web input. This is the VJ producer half of the diagnostics story (VJ-3) and the
B1-class generalized. The census found no NEW cryptic-throw sites in the kf+value.js read scope,
but K1's "ingest arbitrary CSSOM" workload is precisely the fuzzer that will surface them.

**Verdict: VJ-REFINE BOOK (tripwire: K1 dispatch).** Sized M when K1 lands (audit each public parse
entry's malformed-input behavior; add the typed-empty/diagnostic contract). Until K1 exists there
is no consumer demanding totality beyond what shipped — BOOK with the named tripwire.

### VJ-3 — Diagnostics sink (the producer half of K3) — BOOK, K-gated

**Confirmed OPEN:** no `DiagnosticSink`/`onWarn`/`diagnostic` channel in value.js (grep = 0). The
parse path throws or returns typed-empty; there is no structured warning channel. K3 (the full
diagnostics channel, K.W0) wants the parse layer to EMIT structured warnings (unknown timing fn,
dropped declaration, clamped value) rather than silently coercing. The PRODUCER half is value.js's
(it's where the parse decisions happen); the CONSUMER half (`ResolvedKeyframes.diagnostics`,
surfacing in the editor) is kf's. **Verdict: VJ-REFINE BOOK (tripwire: K.W0 K3 dispatch).** M
effort when K3 lands. Pairs with VJ-9 (totality is the precondition for diagnostics-instead-of-throw).

### VJ-2 — Arc-length path sampler (VJ-F1) — the one real competitor gap — BOOK, honestly sized

**Confirmed OPEN:** no path/geometry code in value.js (grep `arcLength`/`samplePath`/
`getPointAtLength`/`motionPath` = 0). kf's `motion-path.ts` and `draw-svg.ts` both route the
"heavier SVG-geometry half (parse path `d` → length-parametrized sampler)" OUT to value.js (VJ-F1)
and do only the CSS-native scalar sweep. This is **MorphSVG's blocker** — the one place a competitor
(GSAP MorphSVG, numeric MotionPath) does something kf structurally cannot without this primitive.

**Honest sizing:** a correct arc-length-parametrized path sampler is **L, not S** — it needs SVG
path `d` parsing (the full command grammar: M/L/C/Q/A/Z + relative variants), per-segment
arc-length integration (cubic/quadratic Béziers have no closed-form arc length — adaptive
subdivision or Gauss-Legendre quadrature), a length→t inverse (binary search over a cumulative LUT),
and the elliptical-arc decomposition. This is real geometry-kernel work, value-domain (pure,
DOM-free, testable) but NOT a quick win.

**Verdict: VJ-REFINE BOOK (tripwire: a kf consumer actually demanding numeric path-morph — the
competitor-parity case, not a demo).** L effort. It's the right value.js home (geometry is a value
kernel), but it has no current kf workload pulling it — kf already does the CSS-native
`offset-path`/`getTotalLength` sweep. Land it when MorphSVG-parity becomes a charter goal, not
speculatively.

### Booked items the census flagged — re-verified, still BOOK

- **VJ-5 — `unflattenObjectToString(flat, out?)` out-buffer overload (VJ-F4).** Speculative GC
  relief; no measured kf pressure. `unflattenObjectToString` is hot (kf `waapi.ts`, `format.ts`,
  `utils.ts` all call it) but no bench shows allocation pressure there. **BOOK (MEASURE-FIRST
  tripwire: a kf bench showing GC pressure on the emit path).** The K-SEED's emit-heavy CC-1
  compiler could be that workload — re-evaluate when CC-1's emit path is benched.
- **VJ-8 — Subpath exports map (M.W7 ask).** value.js `package.json` declares only `"."`; the
  `dist/` has per-subpath `.d.ts` but no export entries, so `@mkbabb/value.js/units/color` is not
  importable. **kf does NOT want this** (it relies on its own static/dynamic boundary, not value.js
  subpaths — `animation/CLAUDE.md` the LIGHT/HEAVY split). Only matters for a tree-shaking consumer
  value.js doesn't currently have. **BOOK (KILL-leaning for the kf axis; out of kf scope).**

### MCI-5 identity-pad / arity pad — witness-gated, value.js's to land

**Confirmed:** the `it.fails` witness lives at kf `test/interpolate-anything.test.ts` ("FLIPS RED
when value.js MCI-5 identity-aware pad lands"). value.js has no identity-aware function-arity pad in
interpolation. This is a value.js interp-kernel refinement (pad mismatched function arities with
identity elements so e.g. `translate(x)` ↔ `translate(x,y)` interpolate). **Verdict: VJ-REFINE —
the witness IS the consume signal; land when a kf workload makes the `it.fails` test a real
regression.** S-M on the value.js side. BOOK with the witness as tripwire (it's already wired).

---

## §3 — Spring/decay physics — the hypothesis is FALSE, KEEP in kf (re-confirmed)

The directive's working hypothesis ("value.js owns … spring MATH") is **wrong**, and reality is the
better design. **Confirmed against HEAD:** value.js has ZERO spring/decay math (grep
`spring`/`stiffness`/`damping` = 0 outside a color constant). kf owns `spring.ts` (491 LoC) +
`decay.ts` entirely. glass-ui consumes the spring FROM kf (M.md §3: `glass-ui(lib) → keyframes(lib)`
is the spring dep) — so the spring ALREADY has its second cross-repo consumer, sourced from kf.
Moving it to value.js inverts an established edge for zero functional gain. **Physics rides with the
time engine that schedules it.** The K-SEED frontier (PHYS-C spring-driven blend, PHYS-B2 reseat,
SO-2 snapDecay) leans hard on this physics and it is all kf-local — correctly.

**Verdict (VJ-7): KF-KEEPS KILL** (kill the fold-OUT, keep in kf). The only ≥2-consumer-gated future
fold is the closed-form `decay` SAMPLER (pure math, no clock — `decay.ts:17` self-flags the VJ-1
"canonical surface") and that has no second consumer today.

---

## §4 — The packrat parse-that item (PT-1) — value.js perf posture

PT-1 (parse-that packrat re-key) is **parse-that-owned, not value.js** — OUT of both repos' scope.
The only value.js-side residue is the pin skew (VJ-6 above). value.js's parser perf posture is
already addressed by the EXISTING memoize caches (the fix there is bounding them, VJ-4, not
re-architecting parse-that). The ARCH kill (WASM-parser) stands — no re-litigation. **Verdict:
OUT (parse-that-owned); the value.js-side action is the VJ-6 pin refresh only.**

---

## §5 — Summary ledger (returned as StructuredOutput)

| ID | Direction | What | Verdict | Effort |
|---|---|---|---|---|
| KF-1 | VJ→KF-consume | lerpArray SoA into NumericAnimation (bench BITES K≥2) | DO-IF-MEASURED→DO | S |
| KF-2 | VJ→KF-consume | reverseAnimationShorthand for CC-1 compact-emit | DO-IF-MEASURED | S |
| VJ-1 | KF→VJ | Fold linear() string parser into value.js (retire kf shim) | DO | S |
| VJ-4 | VJ-REFINE | Bound parse-cache memos — CONFIG not construction | DO | S |
| VJ-6 | VJ-REFINE | Refresh parse-that pin ^0.8.2→^0.9.0 | DO-IF-MEASURED | S |
| VJ-9 | VJ-REFINE | Total partial-input contract (B1 class generalized) | BOOK (K1 tripwire) | M |
| VJ-3 | VJ-REFINE | Diagnostics sink producer half (K3) | BOOK (K.W0 tripwire) | M |
| VJ-2 | VJ-REFINE | Arc-length path sampler (VJ-F1, MorphSVG blocker) | BOOK (parity tripwire) | L |
| MCI-5 | VJ-REFINE | Identity-aware arity pad (witness-gated) | BOOK (it.fails tripwire) | M |
| VJ-5 | VJ-REFINE | unflattenObjectToString out-buffer overload | BOOK (GC-bench tripwire) | S |
| VJ-8 | VJ-REFINE | Subpath exports map | BOOK (kf doesn't want) | M |
| VJ-7 | KF-KEEPS | Keep spring/decay in kf (hypothesis FALSE) | KILL (the fold-out) | — |

**The two RIPE consumes for K:** KF-1 (numeric SoA, bench-proven) and VJ-1→EF-3 (linear() shim
retirement, Baseline-ripened). The two K-gated VJ producers: VJ-9 (totality, K1) and VJ-3
(diagnostics, K3). The one honest big-rock: VJ-2 (arc-length sampler, L, the real competitor gap,
unpulled). Everything else is config-hygiene (VJ-4, VJ-6) or correctly-booked.
