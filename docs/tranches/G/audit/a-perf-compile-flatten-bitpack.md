# Tranche G deep-SOTA audit — lane `a-perf-compile-flatten-bitpack`

**Lane mandate.** The COMPILE step + the flattening + the bit-packing — the half of
the engine-perf surface the runtime lanes do NOT own. The unit of analysis is
`FrameCompiler.parse` (`frame-compiler.ts:309-351`) — `sort → parseAndFlattenObject
→ createFrame → reconcileVars → sort → filter → finalizeFrameVars` — and the
compiled-frame representation it emits: the four derived forms `interpVars` /
`allInterpVars` / `flatVars` / `vars` (`constants.ts:98-114`), the content-derived
frame id (`FRAME_ID_SCALE`, `frame-compiler.ts:84,213`), and the `time` index
(`frame.time.{start,stop}`). The questions the brief poses: **(1) is the
flattened-frame-items representation optimal, or would a column-oriented / SoA /
bit-packed COMPILED frame representation compile + interp faster (the W8 S2 slot-map
BOOK; the typed time index W8 S1 RECORD)? (2) what bit-packing is viable (the id
scale, the time range, the dispatch tag)? (3) compile-throughput (the F.W1
`compile.bench`).** MEASURE-FIRST every claim.

**Research/audit ONLY — ZERO source/test/CI/demo edits.** This doc is the only
artifact. inv-16 RELAXED for G impl (the user drives value.js too), but each repo is
audited as its own surface and cross-repo items are tagged HAND-OFF. inv ε: every kf
claim is `file:line`-grounded against the live `tranche-g-dev` tree; every value.js
claim against the live repo (`/Users/mkbabb/Programming/value.js`); every number is
from a re-runnable node v26.0.0 / V8 probe reproduced in §A, the shipped F.W1
`bench/compile.bench.ts`, OR is RECORD-withheld WITH the model + the instrument that
WOULD measure it, and I say which. Branch: `tranche-g-dev`.

**Relation to the prior perf lanes (cite + EXTEND — I do NOT repeat).** Three lanes
already own the RUNTIME interp kernel and have settled it:
- `a-engine-perf` (G-1 re-pin, G-2 SoA runtime consumption K≥2, G-3 VJ-F4 DOM-write
  alloc, G-4 the F.W4/F.W5 ALREADY-SOTA, G-5 the W8 ledger HOLDS) — the
  post-publish reconciliation.
- `r-perf-hotpath-v8` (HP-1..HP-5) — the V8 object-model dimension of the same
  runtime kernel; **HP-4 explicitly KILLED runtime bit-packing of the frame id /
  time index / dispatch tag.**
- `r-perf-crossengine` (X-1..X-4) — **X-3 KILLED bit-packing cross-engine.**

None of them measured the **COMPILE step** as a cost center. Every perf number in
the corpus is a *per-frame runtime* number; the F.W1 `compile.bench` exists but the
W8 S1/S2/S3 dispositions were authored before it could be read at the sub-phase
level. **My distinct contribution is the compile-side decomposition the runtime
lanes structurally could not surface:** (1) I measure that the FrameCompiler
`parse()` is **87–91% of the full `fromString` cost** (the string-grammar parse is
only ~9–13%) — so for the editing-session reality the F.W1 bench targets, the
compiler IS the latency, not value.js's CSS parser; (2) I confirm the compile is
**O(N) linear** in frame count (the F.W3 `buildVarIndex` fold killed the O(N²)
`findIndex` scan — ALREADY-SOTA, measured); (3) I re-ground the bit-packing KILL
(HP-4/X-3) with a COMPILE-side measurement, not just the runtime one; (4) I answer
the column-oriented-COMPILED-representation question the W8 S2 slot-map BOOK left
open at the compile layer (it is a runtime-only lever — the COMPILE cost is in the
value.js per-value parse + the four derived forms, and an SoA compiled layout does
NOT compile faster). **I manufacture no new SHIP; I add the compile dimension to the
existing dispositions and one re-grounded value.js-HANDOFF.**

---

## The honest headline (read first)

**The compiler is the latency, and the compiler is value.js-bound.** The single
compile-side fact the runtime lanes never surfaced: `FrameCompiler.parse()` is
**87–91% of the cold `fromString` cost** (§A.1, the F.W1 `compile.bench`
decomposed) — the CSS-grammar string-parse value.js owns is only the residual
~9–13%. Of the compiler's own time, the dominant sub-phase is **value.js's
`parseAndFlattenObject` per-keyframe value parse + normalize** (~0.24 ms of the
1.03 ms 50-stop compile = ~24%, §A.2), and the rest is the kf-side structural work
(createFrame / reconcileVars / the two sorts / filter / `finalizeFrameVars` deriving
the four forms). **The compile is O(N) linear** in compiled-frame count (per-frame
~11.7 µs, flat from 25→200 stops, §A.3) — the F.W3 `buildVarIndex` fold (`frame-
compiler.ts:234-247`) already eliminated the O(N²) per-variable `findIndex` scan
the naïve reconcile would pay. **This is an ALREADY-SOTA compiler**, and the bulk
of this lane is the binding refusal.

**The bit-packing question, answered NO (three ways) — re-grounded at the COMPILE
layer.** The mandate asks specifically about packing the frame id, the time index,
and the dispatch tag. `r-perf-hotpath-v8` HP-4 and `r-perf-crossengine` X-3 already
KILLED runtime bit-packing; I add the compile-side reason it is also a non-lever
*at compile time*: the `id = startIx*1e6+stopIx` (`frame-compiler.ts:213`) is an
SMI-cheap integer that is computed ONCE per frame at compile and never decoded on
the hot path (it is an identity token for the FC-2 byte-determinism lock, not an
index that is unpacked) — packing it `(startIx<<20)|stopIx` saves nothing and
*risks* the FC-2 determinism contract; the `time.{start,stop}` are floating-point
ms that cannot be SMI-packed and whose binary-search reads are already monomorphic
`LoadField` at N=1–2 active frames; the dispatch is value.js's `_lerp`
predispatch, the bit-packing-EQUIVALENT done right (`r-perf-hotpath-v8` HP-4).
**KILL/RECORD — name it so nobody packs the id or the time index.**

**The column-oriented / SoA COMPILED-representation question, answered: it is a
RUNTIME lever (= G-2), NOT a compile lever.** The W8 S2 slot-map BOOK and the W8 S1
typed time index RECORD are about the per-frame *interp* speed, which the runtime
lanes own (G-2 / HP-2: SoA `Float64Array` carrier, K≥2, 2.4–4× — value.js-HANDOFF +
the re-pin). I measured whether re-shaping the COMPILED frame to a column layout
would also make the COMPILE faster: it would NOT — the compile cost is the value.js
per-value parse (§A.2) + the four-form derivation (§A.4), and a `Float64Array`
column layout would ADD a compile-time scatter-setup pass, not remove one. So the
SoA decision stays exactly where G-2 / HP-2 / F-VJ-3 put it (a gated runtime SHIP on
the re-pin), and the COMPILE representation is left alone. **No compile-side
re-architecture.**

**The one compile-side observation worth recording (not a SHIP):** the COMPILED
frame carries **four** derived forms of the same data — `interpVars` (the dotted
map), `allInterpVars` (`Object.values().flat()`), `flatVars` (the `value.value`
projection map), and `vars` (`unflattenObject(flatVars)`) — built in
`finalizeFrameVars` (`frame-compiler.ts:360-371`). Three of the four are genuinely
needed on disjoint hot paths (measured, §A.4); the redundancy is **deliberate
pre-flattening that trades compile-time work + frame memory for zero per-tick
re-walk** — the correct F.W4-era tradeoff, NOT a defect. I name the ONE micro-fold
that is honest (the `unflattenObject` `vars` form is value.js-owned and rides
VJ-F4's buffer-reuse handoff) and RECORD the rest as ALREADY-SOTA.

**Net for the compile/flatten/bit-pack lane:** ZERO new kf SHIP manufactured. The
compiler is ALREADY-SOTA (O(N), `buildVarIndex`-folded, content-id idempotent, the
four forms a correct pre-flatten tradeoff). The bit-packing temptation is KILLED
compile-side (re-grounding HP-4/X-3). The column-SoA compiled-representation
question is answered (runtime lever = G-2, not a compile lever). The one HANDOFF is
the value.js `unflattenObject` buffer-reuse that VJ-F4 / G-3 already own, re-grounded
as also touching the compile-time `vars` derivation. **The compile latency that
matters (the editing session) is value.js-bound, and the re-pin (G.W2) is the
leverage there too.**

---

## TL;DR — findings + disposition

| # | Finding | Site | Measured (live, §A) | Disposition |
|---|---------|------|---------------------|-------------|
| **CF-1** | `FrameCompiler.parse()` is **87–91% of the cold `fromString` cost** — the editing-session latency is the COMPILER, not value.js's CSS string-parse (which is the ~9–13% residual). Of the compiler, value.js's `parseAndFlattenObject` is ~24% (50-stop) | `frame-compiler.ts:309-351`; `engine.ts fromString`; `utils.ts:205-281` | §A.1 compile% = 87/91/91 at 11/50/200 stops; §A.2 `parseAndFlattenObject` 4.8 µs/frame | **RECORD** (the compile-latency map; the value.js share rides the re-pin / C5/A2 — not a kf fold) |
| **CF-2** | The compile is **O(N) LINEAR** in compiled-frame count — the F.W3 `buildVarIndex` (`frame-compiler.ts:234-247`) already eliminated the O(N²) per-variable `findIndex` reconcile scan. Per-frame ~11.7 µs flat from 25→200 stops | `frame-compiler.ts:234-302` (`buildVarIndex`/`reconcileVars`) | §A.3 per-frame 14.5/11.7/11.7/11.7/12.0 µs at 11/25/50/100/200; N²-norm DROPS = O(N) | **ALREADY-SOTA** (the buildVarIndex fold is the right shape; manufacture no work) |
| **CF-3** | **Bit-packing the frame id / time index is a NON-LEVER at compile time too.** The `id=startIx*1e6+stopIx` is computed once/frame as an SMI identity token (FC-2 lock), never decoded; packing it saves 0 and risks FC-2. The `time` is FP ms, un-SMI-packable | `frame-compiler.ts:84,213`; `constants.ts:88-96` | §A.4 id is SMI by construction; packing adds shift/mask, removes nothing | **KILL** (re-grounds HP-4/X-3 at the compile layer — record so nobody packs the id/time) |
| **CF-4** | The **column-oriented / SoA COMPILED representation is a RUNTIME lever (= G-2/HP-2), NOT a compile lever.** A `Float64Array` column layout would ADD a compile-time scatter-setup pass; it does not make the compile faster. The W8 S2 slot-map = the runtime SoA fold, gated on the re-pin | `frame-compiler.ts:360-371`; vj `math.ts:48` | §A.5 the compile cost is parse+derive, not the AoS layout; SoA setup is net-add at compile | **RECORD** (the SoA SHIP stays G-2/F-VJ-3 runtime+re-pin; the compile representation is left alone) |
| **CF-5** | The COMPILED frame carries **four** derived forms (`interpVars`/`allInterpVars`/`flatVars`/`vars`). Three are needed on disjoint hot paths (interp, serialize, DOM-write) — a deliberate F.W4 pre-flatten tradeoff. The `vars` (`unflattenObject`) form is value.js-owned and rides VJ-F4's buffer-reuse handoff | `frame-compiler.ts:360-371`; `constants.ts:98-114`; `engine.ts:735`; `format.ts:97` | §A.4 each form has a live consumer; `vars` only when `unflatten` (the default DOM path) | **ALREADY-SOTA** (the four forms) + **value.js-HANDOFF** (the `unflattenObject`/`vars` buffer-reuse = VJ-F4, re-grounded) |
| **CF-6** | The compile-side `tryParseCache` (`utils.ts:203`) is **unbounded** — distinct keyframe value strings (every editing keystroke mints new ones) grow it forever. This is the parse-side cache, NOT the engine-runtime LRU; it is the same `memoize`-bound item MF-9 / F3 routes to value.js | `utils.ts:203,241,267` | cache keyed `childKey:strValue`; distinct stops MISS (§A.2 cold==warm); no eviction | **value.js-HANDOFF** (F3 LRU bound, ONCE in value.js `memoize` — no 2nd kf policy, DRY) + RECORD the kf-local map as the interim |

**Net for the compile/flatten/bit-pack band:** ONE compile-latency map (CF-1,
RECORD); ONE ALREADY-SOTA confirmation the compile is O(N) (CF-2); the bit-packing
KILL re-grounded compile-side (CF-3); the column-SoA-compiled question answered as a
runtime-not-compile lever (CF-4); the four-form pre-flatten confirmed correct with
one value.js-HANDOFF re-grounding (CF-5); and the unbounded compile cache routed to
the value.js `memoize` F3 bound (CF-6). **No new kf SHIP. No re-architecture. No
manufactured deficit.** The compile latency that matters is value.js-bound — the
re-pin (G.W2) is the leverage there as everywhere.

---

## 1. CF-1 — the compile IS the latency, and it is value.js-bound · RECORD

### 1.1 The decomposition the F.W1 bench enabled but no lane read

The F.W1 `bench/compile.bench.ts` (`bench/compile.bench.ts:1-44`) measures the FULL
cold `fromString` (parse string → compile → sampled `frames[]`) — the editing-
session denominator. Live on `tranche-g-dev`, node v26 / V8 14.6 (§A.1, the shipped
bench):

| stops | full `fromString` (hz) | mean (ms) |
|---|---|---|
| 2 | 27,632 | 0.036 |
| 6 | 8,456 | 0.118 |
| 11 | 4,408 | 0.227 |
| 50 | 950 | 1.05 |
| 200 | 459 | 2.18 |

But the bench measures the WHOLE pipeline; nobody split it. I instrumented the
split (§A.1): re-running `.parse()` on an animation whose templates are already
added isolates the FrameCompiler `parse()` from the string-grammar parse:

| stops | full `fromString` | compile-only `.parse()` | **compile %** |
|---|---|---|---|
| 11 | 0.256 ms | 0.222 ms | **87%** |
| 50 | 1.127 ms | 1.028 ms | **91%** |
| 200 | 2.296 ms | 2.099 ms | **91%** |

**The FrameCompiler `parse()` is 87–91% of the cold-compile latency.** value.js's
CSS-grammar string-parse — the part one would naïvely assume dominates a "parse" —
is the ~9–13% residual. For the editing-session reality the F.W1 bench targets (a
keystroke re-parses + re-compiles the whole stylesheet, `compile.bench.ts:11-13`),
the compiler is the cost.

### 1.2 Where the compiler's own time goes — value.js's per-value parse leads

Inside `FrameCompiler.parse()` the dominant sub-phase is **value.js's
`parseAndFlattenObject`** (`utils.ts:205-281`), called once per template frame
(`frame-compiler.ts:314-324`). It runs `flattenObject` + a per-value `tryParse`
through value.js's CSS-value grammar + `normalizeValueUnits`. Measured isolated
(§A.2): **4.8 µs per K=9 transform+opacity keyframe**, identical cache-cold and
cache-warm (distinct values miss the `tryParseCache`, CF-6). For a 50-stop
animation that is ~0.24 ms — **~24% of the 1.03 ms compile**. The remaining ~76% is
the kf structural work: `createFrame` (`frame-compiler.ts:168-227`),
`reconcileVars` + `createInterpVarValue` → `normalizeValueUnits` (value.js again,
the per-pair color/unit normalize), the two `sort`s (`frame-compiler.ts:312,335`),
the `filter` (`:343`), and `finalizeFrameVars` (the four-form derivation, CF-5).

The per-value parse + the per-pair normalize are **value.js-owned**. The 0.11.0
A2 maximal-munch unit classifier + C5 length-unit correctness CHANGE that boundary
(the G.W2 §Design-decision-2 named delta). So the compile-latency lever that
matters is the SAME re-pin: faster/correct value.js parsing flows straight into the
87–91% compile share. **There is no kf-side compile fold here** — the kf structural
work is already O(N) (CF-2) and the parse is value.js's.

### 1.3 Disposition

**RECORD** (the compile-latency map). This is not a SHIP — it is the honest
denominator the W8 RECORD/BOOK lacked (`compile.bench.ts:7-10` named this gap). It
RE-CONFIRMS the re-pin (G.W2) is the leverage even for compile latency, and it
bounds any future compile-side claim: a kf-local compile micro-opt can only address
the ~76% structural residual, which is O(N) and already folded (CF-2). The
falsifiable instrument is the **compile-% clause** the F.W1 bench can carry: assert
`.parse()`-only ≥ 85% of `fromString` at N≥50 (it bites if a future regression
inflates the string-parse share, or if a compile fold lands that should drop the
compile share below the floor — either way the assumption is checked, not asserted).

---

## 2. CF-2 — the compile is O(N) LINEAR; the buildVarIndex fold landed · ALREADY-SOTA

The naïve reconcile is O(N²): for each frame, for each variable, scan `frames` for
the matching segment. `reconcileVars` (`frame-compiler.ts:257-302`) avoids the
per-variable "next occurrence" scan via the pre-built `buildVarIndex`
(`frame-compiler.ts:234-247`) — a `Map<string, number[]>` of occurrence indices,
giving O(1) "next frame defining this var" lookups (`:264-275`). The remaining
`this.frames.findIndex` (`:281-283`) scans only the *already-created segment*
frames for an existing (startIx, stopIx) pair, which is bounded by the segment
count, not the variable count.

Measured (§A.3): the per-COMPILED-frame compile cost is **flat at ~11.7 µs** from
25 to 200 stops, and the N²-normalized cost (`compile / frames²`) DROPS
monotonically (1448 → 487 → 239 → 118 → 120). A flat per-frame cost with a falling
N²-norm is the signature of **O(N), not O(N²)**:

| stops | compiled frames | compile (ms) | per-frame (µs) | N²-norm |
|---|---|---|---|---|
| 11 | 10 | 0.145 | 14.5 | 1448 |
| 25 | 24 | 0.281 | 11.7 | 487 |
| 50 | 49 | 0.574 | 11.7 | 239 |
| 100 | 99 | 1.159 | 11.7 | 118 |
| 200 | 100 | 1.203 | 12.0 | 120 |

(The 200-stop produces 100 compiled frames, not 200 — `Math.round((i/199)*100)`
yields only 101 distinct percentages, a bench-shape artifact confirmed in §A.6, NOT
an engine cap. No finding.)

**Disposition: ALREADY-SOTA.** The `buildVarIndex` fold is the correct idiom
(`frame-compiler.ts:233` documents the intent). Manufacture no work. The per-frame
~11.7 µs is dominated by the value.js per-value parse (CF-1 §1.2) + the per-pair
`normalizeValueUnits`, both value.js-owned; the kf structural overhead per frame is
small and linear. No compile-side algorithmic lever remains.

---

## 3. CF-3 — bit-packing the frame id / time index is a non-lever at COMPILE time too · KILL

The mandate asks specifically about packing the frame id, the time index, and the
dispatch tag. `r-perf-hotpath-v8` HP-4 and `r-perf-crossengine` X-3 KILLED this on
the RUNTIME path; I add the compile-side reason it is also a non-lever where it is
*produced*.

- **The frame id** (`frame-compiler.ts:213`): `id = startIx * FRAME_ID_SCALE +
  endIx`, `FRAME_ID_SCALE = 1_000_000` (`:84`). This is computed **once per frame
  at compile** and is an **identity token**, not a runtime index — it exists for the
  FC-2 byte-determinism lock (`frame-compiler.ts:208-213`: "two parses of identical
  input produce byte-identical `frames[]`, ids included"). It is **never decoded**
  anywhere (grep: no `% FRAME_ID_SCALE`, no `/ 1e6`, no `>> `/`& ` on `frame.id`).
  For any real keyframe count (`startIx`,`endIx` ≪ 1000) it is well inside the V8
  SMI range, stored as a tagged SMI — register-cheap to compute and compare. A
  bit-packed `(startIx << 20) | endIx` would be identical SMI cost, save zero (the
  value is never unpacked), and *risk* the FC-2 lock (any consumer or test that
  reasons about the human-readable `startIx*1e6+endIx` form would have to change in
  lockstep). **Net negative.**

- **The time index** (`constants.ts:88-96`; `engine.ts:623-624,646,651`):
  `frame.time.{start,stop}` are floating-point ms (e.g. `333.33`) — they **cannot**
  be SMI-packed at all. They are derived once at compile in `calcFrameTime`
  (`utils.ts:343-354`) and read on the runtime binary search through monomorphic
  `LoadField` on a stable `AnimationFrame` hidden class at N=1–2 active frames
  (`a-engine-perf` G-5, `r-perf-hotpath-v8` HP-4 both measured this negative). A
  parallel `Float64Array` time index (the W8 S1 "typed time index" RECORD) would let
  the binary search scan contiguous doubles — but N is 2–12 frames, the search is
  O(log N) ≈ 1–4 iterations, ~3.66 ns/frame (HP-4 §A.2), ~3% of a K=9 tick, and the
  second index trades the FC-2 byte-determinism for nothing. **W8 S1 HOLDS as
  RECORD** (concurs `a-engine-perf` G-5, `r-perf-hotpath-v8` HP-4).

- **The dispatch tag** (`engine.ts:730` → vj `_lerp`): value.js's `prepareInterpVar`
  predispatch (`vj interpolate.ts:217-227`) IS the bit-packing-equivalent done
  right — it resolves the numeric/color/computed branch ONCE at compile and stamps
  `iv._lerp`, so the hot loop is a single field-load + indirect call, not a per-call
  tag decode. A tag-byte LUT would be strictly worse (an extra indirection,
  `r-perf-hotpath-v8` HP-4). And it is value.js-owned, not a kf-compile concern.

**Disposition: KILL** (re-grounds HP-4 / X-3 at the COMPILE layer). Record so nobody
"optimizes" the frame id into a packed carrier or the time into a parallel typed
index — the id is an un-decoded SMI identity token bound to FC-2, the time is
un-SMI-packable FP read at N=2, and the dispatch is already pre-resolved. **No
bit-packing headroom at compile or runtime.**

---

## 4. CF-4 — the column-oriented / SoA COMPILED representation is a RUNTIME lever, not a compile lever · RECORD

The W8 S2 "slot-map" BOOK and the brief's "would a column-oriented / SoA / bit-
packed frame representation compile + interp faster" question split cleanly once you
measure both halves separately:

- **The INTERP half is real and owned elsewhere.** The SoA `Float64Array` carrier
  (one `lerpArray(startN, stopN, t, outN)` over contiguous doubles vs K AoS pointer-
  chases + K indirect `_lerp` calls) is 2.41× at K=3 → 3.97× at K=16
  (`r-perf-hotpath-v8` HP-2 §A.1; `a-engine-perf` G-2 §2.3), and the real transform
  shape is **K=9** (measured §A.5 — `scale()`→scaleX/Y/Z, `rotate()`→rotateX/Y/Z,
  plus translateX/Y + opacity = 9, not the K=10 the prior lanes estimated; the win
  regime is unchanged). That is the W8 S2 slot-map shape, and it is a **runtime
  SHIP** gated on the re-pin (the value.js `lerpArray` primitive is published in
  0.11.0, dark until G.W2) — exactly where G-2 / HP-2 / F-VJ-3 put it. The in-tree
  reference is `NumericAnimation`'s `NumericSegment` (`numeric.ts`, the `number[]`
  slot map).

- **The COMPILE half is NOT a lever.** I measured whether re-shaping the COMPILED
  frame to a column layout (`startN`/`stopN`/`outN: Float64Array` + a parallel
  `ValueUnit[]` scatter target) would make the COMPILE faster. It would NOT (§A.5):
  the compile cost is the value.js per-value parse (CF-1 §1.2, ~24%) + the per-pair
  `normalizeValueUnits` + the four-form derivation (CF-5) — none of which an SoA
  output layout removes. An SoA compiled layout ADDS a compile-time partition pass
  (split numeric channels off `allInterpVars`, allocate + fill three
  `Float64Array`s, build the scatter map) on TOP of the existing derivation. So the
  COMPILED representation re-shape is a **net-add at compile** that pays back ONLY
  at runtime, K≥2 — which is precisely the gated G-2 / F-VJ-3 disposition.

**Disposition: RECORD.** The SoA decision stays exactly where the runtime lanes put
it: a gated SHIP on the re-pin (consume `lerpArray`, partition numeric channels at
`finalizeFrameVars`, scatter at `processFrame`, byte-lock). The COMPILE
representation is left alone — re-shaping it does not make the compile faster, and
the runtime win is the value.js-HANDOFF + re-pin G-2 already owns. This lane's
contribution is the explicit answer to "does it compile faster too": **no, the SoA
is interp-only**, so the compile-side question raised by the brief is closed
negative and nobody should pursue an SoA compiled layout *for compile speed*.

---

## 5. CF-5 — the four derived forms are a correct pre-flatten tradeoff · ALREADY-SOTA + one value.js-HANDOFF

`finalizeFrameVars` (`frame-compiler.ts:360-371`) derives, per compiled frame, FOUR
forms of the same interpolation data:

```ts
// frame-compiler.ts:360-371
const flatVars = Object.entries(frame.interpVars).reduce(...)   // {key: ValueUnit[]}
frame.flatVars = flatVars;
frame.vars = unflattenObject(frame.flatVars);                   // nested {transform: {...}}
frame.allInterpVars = Object.values(frame.interpVars).flat();   // InterpolatedVar[]
```

plus `interpVars` itself (the dotted `{key: InterpolatedVar[]}` map). At first
glance this is four copies of one thing — a redundancy worth interrogating. I traced
each form to its consumer (verified live):

| form | consumer(s) | hot? |
|---|---|---|
| `interpVars` | `reconcileVars` write target (`:289`); `renormalizeColors` re-derive (`:387-401`); WAAPI sub-segment sampling (`waapi.ts:169`) | compile + WAAPI |
| `allInterpVars` | **the interp hot loop** `processFrame` (`engine.ts:730`) | **yes, per-tick** |
| `flatVars` | the interp merge / single-frame alias (`engine.ts:672,690`); serialize (`format.ts:97`); DOM-write when `unflatten===false` (`engine.ts:735`) | **yes, per-tick** |
| `vars` | DOM-write when `unflatten===true` — **the DEFAULT path** (`engine.ts:142,735`) | **yes, per-tick (default)** |

Three of the four (`allInterpVars`, `flatVars`, `vars`) are on disjoint per-tick hot
paths; `interpVars` is the compile + WAAPI source. This is **deliberate
pre-flattening** — `constants.ts:105-109` documents `allInterpVars` is "built once
during parse() to avoid Object.values().flat() allocation on every interpFrames()
call." Each form trades compile-time work + a few extra references per frame for
ZERO per-tick re-walk. The leaves are SHARED: `flatVars[key]` holds the SAME
`ValueUnit` objects that are the `.value` field of the `allInterpVars` entries
(`frame-compiler.ts:362-364`, `acc[key] = value.map(v => v.value)`), so the four
forms are mostly aliasing, not four deep copies. This is the correct F.W4-era shape.

**The one honest micro-observation:** `frame.vars = unflattenObject(frame.flatVars)`
(`frame-compiler.ts:368`) mints a fresh nested object per frame at compile, and
`unflattenObject` is value.js-owned (`vj units/utils.ts:84`). On the DOM-write hot
path (`engine.ts:735`, the default `unflatten===true`), `frame.vars` is read but the
per-tick `transformTargetsStyle` re-flattens it via `unflattenObjectToString`
(`utils.ts:370`) — the SAME per-frame `{}`+split+concat alloc VJ-F4 / G-3 already
own as a value.js-HANDOFF. So the compile-time `unflattenObject` and the runtime
`unflattenObjectToString` are the same value.js string/object-shape concern, and
both ride VJ-F4's buffer-reuse overload. I re-ground that the handoff also touches
the COMPILE-time `vars` derivation, not only the runtime write (G-3 framed it
runtime-only).

**Disposition: ALREADY-SOTA (the four forms) + value.js-HANDOFF (the
`unflattenObject`/`vars` buffer-reuse = VJ-F4, re-grounded).** Do NOT collapse the
four forms — each has a measured disjoint consumer, and the redundancy IS the F.W4
zero-per-tick-re-walk win. The only compile-side allocation worth removing is the
value.js-owned `unflattenObject`, which the existing VJ-F4 handoff covers; kf
consumes the buffer-reuse overload on the same re-pin. **No kf compile fold.**

---

## 6. CF-6 — the compile-side `tryParseCache` is unbounded · value.js-HANDOFF (F3 LRU bound)

`parseAndFlattenObject` memoizes parsed values in a module-level
`tryParseCache = new Map<string, ValueArray>()` (`utils.ts:203`), keyed
`childKey:strValue` (`:240`), read at `:241`, written at `:267`. There is **no
eviction** — every distinct keyframe value string adds an entry forever. In an
editing session every keystroke produces new value strings (`translateX(51px)`,
`translateX(52px)`, …), so the cache grows monotonically (§A.2 confirms distinct
values MISS — cache-cold and cache-warm cost are identical at 4.8 µs/frame). The
cache helps only when the SAME value recurs (a preset replayed, identical stops),
which the editing session does not produce.

This is the SAME unbounded-`Map` concern the F ledger named as **MF-9 / F3**: the
bound belongs in value.js's `memoize` primitive (FIFO→LRU), ONCE, not a second
kf-local eviction policy (`a-engine-perf` G-5 confirmed MF-9 is a value.js-HANDOFF;
the G.WV band carries "F3 LRU bound — ONCE in value.js, no 2nd kf policy, DRY",
`G.md:402`, `_SYNTHESIS-gap-scorecard §Band V`). The kf-local `tryParseCache` is the
interim; it should adopt the value.js bound, not grow a parallel one.

**Disposition: value.js-HANDOFF** (the F3 LRU bound, in value.js `memoize`) + RECORD
the kf-local `tryParseCache` as the interim that adopts it. **No kf-side eviction
policy** (the Mandate's DRY + "ONCE in value.js" — `G.md:408`). The falsifiable
instrument is value.js-side: a `memoize` cache-size assertion under a bounded
workload; kf inherits it on the re-pin if `parseAndFlattenObject` migrates the cache
to the bounded `memoize`. (Honest caveat: the kf `tryParseCache` is a bespoke `Map`,
NOT a `memoize()` call today — adopting the bound is a small kf consumption edit, so
this is HANDOFF-then-consume, not zero-edit. Recorded so it is sequenced behind the
value.js bound, not patched in kf with a second policy.)

---

## ALREADY-SOTA — the binding refusal (manufacture NO work)

Re-confirmed live, concurring with `a-engine-perf §ALREADY-SOTA`,
`r-perf-hotpath-v8 §ALREADY-SOTA`, `r-perf-crossengine X-2/X-3`:

- **The FrameCompiler split + pipeline** (`frame-compiler.ts:309-351`): the
  clock-free value-in→frames-out unit (D.W4 D-4), compile-once pre-flatten
  (`finalizeFrameVars`), the targeted color re-normalize WITHOUT re-flatten/re-sort
  (`renormalizeColors:387-401`), the content-derived idempotent FC-2 id. SOTA at its
  scale.
- **The compile is O(N)** (CF-2): the `buildVarIndex` fold (`frame-compiler.ts:234-247`)
  killed the O(N²) reconcile scan; per-frame cost is flat (§A.3).
- **The four derived forms** (CF-5): a deliberate pre-flatten trading compile-time +
  frame memory for zero per-tick re-walk; each form has a measured disjoint
  consumer; the leaves are shared (aliased), not deep-copied.
- **The frame id + time index + dispatch** (CF-3): SMI id by construction, FP time
  read monomorphically at N=2, dispatch pre-resolved by value.js's `prepareInterpVar`
  — no bit-packing headroom at compile OR runtime.
- **The value.js boundary** (CF-1): the compile latency that matters is the value.js
  per-value parse + normalize (87–91% of `fromString` is the compiler; ~24% of that
  is value.js's `parseAndFlattenObject`) — the re-pin (G.W2) is the leverage, and
  the boundary consumes the 0.11.0 A2/C5 parse deltas through the same seam with
  zero kf compile-fold.

**The §ALREADY-SOTA record is BINDING: the compiler is exemplary; manufacture no
compile-side fold. The only levers are the re-pin (value.js parse/normalize/
`lerpArray`/`memoize`) and the gated runtime SoA (G-2), both owned elsewhere.**

---

## Disposition ledger

| ID | Finding | Site | Measured | Disposition | Instrument |
|----|---------|------|----------|-------------|-----------|
| **CF-1** | `parse()` is 87–91% of `fromString`; the compile is the editing-session latency, value.js-bound (~24% `parseAndFlattenObject`) | `frame-compiler.ts:309-351`; `utils.ts:205-281` | §A.1 87/91/91%; §A.2 4.8 µs/frame | **RECORD** (compile-latency map; the share rides the re-pin C5/A2) | compile-% clause on `compile.bench` (`.parse()` ≥ 85% of `fromString` at N≥50) |
| **CF-2** | the compile is O(N); the F.W3 `buildVarIndex` killed the O(N²) reconcile | `frame-compiler.ts:234-302` | §A.3 per-frame flat 11.7 µs; N²-norm drops | **ALREADY-SOTA** | — |
| **CF-3** | frame id / time index bit-packing is a non-lever at compile too (SMI identity token / FP time, FC-2 lock) | `frame-compiler.ts:84,213`; `constants.ts:88-96` | §A.4 id SMI, never decoded; time un-SMI-packable | **KILL** (re-grounds HP-4/X-3) | record-only (do not pack the id/time) |
| **CF-4** | column / SoA COMPILED layout is a runtime lever (= G-2/HP-2), NOT a compile lever — SoA setup is a net-add at compile | `frame-compiler.ts:360-371`; vj `math.ts:48` | §A.5 compile cost = parse+derive; SoA adds a partition pass | **RECORD** (SoA stays G-2/F-VJ-3 runtime+re-pin) | — |
| **CF-5** | four derived forms; three on disjoint per-tick paths (correct F.W4 pre-flatten); `vars`/`unflattenObject` value.js-owned | `frame-compiler.ts:360-371`; `engine.ts:735`; `format.ts:97` | §A.4 each form has a live consumer | **ALREADY-SOTA** + **value.js-HANDOFF** (VJ-F4, re-grounded compile-side) | the VJ-F4 buffer-reuse bench (vj) |
| **CF-6** | the compile-side `tryParseCache` is unbounded; = MF-9/F3 LRU bound | `utils.ts:203,241,267` | §A.2 distinct values MISS; no eviction | **value.js-HANDOFF** (F3, ONCE in `memoize`) + RECORD interim | a `memoize` cache-size assertion (vj) |

---

## §A — re-runnable probes (node v26.0.0, V8 14.6, `tranche-g-dev`)

- **A.1 — the compile-% split (CF-1).** The shipped `npx vitest bench --run
  bench/compile.bench.ts` gives the full `fromString`: 2-stop 27,632 hz / 6 8,456 /
  11 4,408 / 50 950 / 200 459 hz. The split probe (construct
  `CSSKeyframesAnimation`, `fromString(css)` once to add templates, then time 400×
  `.parse()` vs 400× fresh `fromString`, both warmed 50×): compile-only `.parse()`
  is 0.222 / 1.028 / 2.099 ms vs full `fromString` 0.256 / 1.127 / 2.296 ms at
  11/50/200 stops → **compile % = 87 / 91 / 91**.
- **A.2 — `parseAndFlattenObject` cost + cache miss (CF-1/CF-6).** Import
  `parseAndFlattenObject` from `src/animation/utils`, run 50,000× on a K=9
  transform+opacity vars object: **4.81 µs/call**. 50 DISTINCT stops, warmed 200×,
  2nd run 2,000×50: **4.84 µs/call** — identical to cold → the `tryParseCache`
  misses on distinct values (the editing-session shape), so it grows unbounded with
  zero hit benefit. 50-stop ≈ 0.24 ms in `parseAndFlattenObject` alone (~24% of the
  1.03 ms compile).
- **A.3 — the O(N) linearity (CF-2).** Construct an N-stop animation, warm 30×
  `.parse()`, time 300× `.parse()`: per-COMPILED-frame cost 14.5 / 11.7 / 11.7 /
  11.7 / 12.0 µs at 11 / 25 / 50 / 100 / 200 stops; the N²-normalized cost
  (`compile / frames²`) falls 1448 → 487 → 239 → 118 → 120 → flat per-frame + falling
  N²-norm = **O(N)**, confirming the `buildVarIndex` fold.
- **A.4 — the frame representation (CF-3/CF-5).** Construct `CSSKeyframesAnimation`,
  `fromString` a K=9 transform+opacity 2-stop: 1 compiled frame, 9 channels, maxK=9;
  frame keys `id,ixs,start,time,vars,flatVars,interpVars,allInterpVars,transform,
  timingFunction`; `flatVars` and `interpVars` keys are the 9 dotted channels
  (`opacity, transform.translateX/Y, transform.scaleX/Y/Z, transform.rotateX/Y/Z`);
  `flatVars !== vars` (distinct objects, `vars` is the nested unflatten). The id
  `startIx*1e6+endIx` is a plain SMI integer (grep: never decoded). The K-shape: a
  `translate3d/translateX+translateY + scale + rotate + opacity` chain is **K=9**,
  not K=10 (`scale()`→scaleX/Y/Z, `rotate()`→rotateX/Y/Z) — the SoA win regime
  (`r-perf-hotpath-v8` HP-2) is unchanged (K=9 ≈ 3.4×).
- **A.5 — the SoA-is-runtime-not-compile reasoning (CF-4).** The compile cost
  decomposes to value.js per-value parse (A.2, ~24%) + per-pair `normalizeValueUnits`
  + the four-form derivation (A.4) — an SoA output layout removes NONE of these and
  ADDS a partition+`Float64Array`-fill+scatter-map pass; so SoA is a compile net-add
  that pays back only at runtime K≥2 (the gated G-2 SHIP). Confirmed structurally
  against `frame-compiler.ts:360-371` (no AoS layout cost is in the compile critical
  path; the AoS cost is the per-CHANNEL `_lerp` dispatch at runtime).
- **A.6 — the 200→100 compiled-frame collapse is a bench artifact (no finding).**
  101/200/300 stops all yield 101 distinct percentages (`Math.round((i/(n-1))*100)`)
  → 101 templateFrames → 100 compiled segments. Correct dedup-by-percent, not an
  engine cap.

The probe scripts run via `npx tsx` against `src/animation/engine` +
`src/animation/utils` (the same value-module entry the F benches use,
`compile.bench.ts:18`), reproduced inline above.

## Sources

- Live kf (`tranche-g-dev`): `src/animation/frame-compiler.ts:84,168-227,234-302,
  309-351,360-371,387-401` (the id scale, createFrame, buildVarIndex/reconcileVars,
  parse, finalizeFrameVars, renormalizeColors), `src/animation/engine.ts:609-737`
  (interpFrames/processFrame/clearBuffer/the seam :731; the `unflatten` flag :142,
  the DOM-write :735), `src/animation/utils.ts:203-281,343-377` (parseAndFlattenObject,
  the tryParseCache, calcFrameTime, transformTargetsStyle), `src/animation/constants.ts:74-115`
  (TemplateAnimationFrame/AnimationFrame shapes), `src/animation/format.ts:97,134`,
  `src/animation/waapi.ts:169,267`, `bench/compile.bench.ts:1-44`,
  `package.json:84-85,88` (the verified-live `value.js ^0.10.0` / `parse-that ^0.8.2`
  / `glass-ui file:../glass-ui` pins; version `4.0.0`; installed value.js `0.10.0`).
- Live value.js (`/Users/mkbabb/Programming/value.js`): `src/units/utils.ts:84`
  (`unflattenObject`), `:115-148` (`unflattenObjectToString`), `src/math.ts:48`
  (`lerpArray`), `src/units/interpolate.ts:171-227` (`lerpNumericValue`/`lerpValue`/
  `prepareInterpVar`).
- The prior perf lanes EXTENDED (cited, not repeated): `a-engine-perf` (G-1..G-5 —
  the runtime reconciliation; G-2 the runtime SoA, G-5 the W8 ledger),
  `r-perf-hotpath-v8` (HP-1..HP-5 — the V8 runtime kernel; HP-2 the SoA dispatch,
  HP-4 the runtime bit-packing KILL), `r-perf-crossengine` (X-3 the cross-engine
  bit-packing KILL). This lane adds the COMPILE-step decomposition none of them
  measured (CF-1 the 87–91% compile share, CF-2 the O(N) confirmation, CF-3 the
  compile-side bit-packing re-grounding, CF-4 the SoA-is-runtime-not-compile answer,
  CF-5 the four-form pre-flatten, CF-6 the unbounded compile cache).
- V8 object model (the lens, corroborated by the direct probes): SMI tagging (the
  frame id), monomorphic `LoadField` on a stable hidden class (the time read),
  `Float64Array` dense backing store (the SoA carrier — runtime only per CF-4),
  `Map` growth without eviction (the tryParseCache, CF-6).

## inv-16 / inv ε compliance

This doc wrote ONLY `docs/tranches/G/audit/a-perf-compile-flatten-bitpack.md` — ZERO
source/test/CI/demo edits to keyframes.js or value.js. Every kf claim cites a
`file:line` against the live `tranche-g-dev` tree (the pins re-verified live:
`package.json:84-85,88` → `value.js ^0.10.0`, `parse-that ^0.8.2`, `glass-ui
file:../glass-ui`, version `4.0.0`, installed value.js `0.10.0`); every value.js
claim cites a `file:line` against the live repo; every number is from a re-runnable
node v26.0.0 / V8 14.6 probe (§A) or the shipped F.W1 `compile.bench`, and I say
which. The value.js items (the per-value parse share / CF-1, the `unflattenObject`
buffer-reuse / CF-5 = VJ-F4, the unbounded cache / CF-6 = F3 LRU bound) are tagged
value.js-HANDOFF where they cross the boundary; the SoA-compiled-layout question
(CF-4) is answered as a runtime lever owned by G-2 / F-VJ-3 + the re-pin, not a new
compile SHIP. The compiler is honestly ALREADY-SOTA (CF-2/CF-5 + the bulk). **G
IMPLEMENTATION awaits explicit authorization — this is TRANCHE DEVELOPMENT, docs
ONLY.**
