# P.W2 — the SoA composite buffer for AnimationGroup + the computed-unit cache key

**Band:** B — Engine-perf (the transpositions).
**Phase:** NOW — kf-internal, zero sibling dependency, executable on authorization (the compositor SoA fold). The computed-unit cache-key arm is NOW for the kf-side bench observable; the cache-key transposition itself is a value.js-P DISPATCH (inv-16).
**Sequence (the DAG edge):** `P.W1 apparatus (the portable-perf helper + the compositor-SoA scenario class) ─► P.W2` (this wave — graduate the compositor-SoA scenario; consume the apparatus's `ratioGate`) ‖ `P.W3 Typed-OM+Playhead`. P.W2 + P.W3 are the two NOW engine transpositions (`P.md:136,161`); both spend P.W1's portable-perf floor.
**Owning-DM-or-idea:** the **K1/V2 radical "SoA composite buffer for AnimationGroup"** (`AUDIT-DIGEST.md` K1 novelIdea "replace the per-layer `Record<string,ValueUnit[]>` blend with a single contiguous Float64Array composite"; `CONSTELLATION-OPTIMIZATION-CAMPAIGN.md:115-117` "the multi-animation hot path") + the **K1 computed-unit cache-key** (the composite-numeric-key idea — the value.js C1 `(target, epoch)` cache, refined to a single numeric composite key; DISPATCH-coupled).

This wave is the campaign's headline kf radical play: the AnimationGroup compositor — the multi-animation hot path, run every group draw frame for every child — is today a boxed-`ValueUnit` AoS blend over `Record<string,ValueUnit[]>` with `for..in` + `Array.isArray` + per-element `isNumericUnit`. P.W2 transposes the numeric leaf subset into a contiguous `Float64Array` fold indexed by the existing `_groupedKeys` (key→offset) layout — a branch-free, vectorizable typed accumulate. The non-numeric tail (color/computed/string leaves) keeps the boxed path; the numeric majority becomes one typed fold.

---

## Context

### The compositor is the multi-animation hot path, and it is AoS

`AnimationGroup.transformFramesGrouped(t)` (`group.ts:245-394`) runs EVERY group draw frame for EVERY child. The blend (`group.ts:287-363`) is three `switch` arms (`replace`/`add`/`weighted`), each walking `values` (a `Record<string, ValueUnit[]>`) with `for..in`, testing `Array.isArray(existing) && Array.isArray(incoming)`, and per-element testing `isNumericUnit(existing[i]) && isNumericUnit(incoming[i])` before a boxed `existing[i].value += incoming[i].value` (`add`) or `existing[i].value = lerp(existing[i].value, incoming[i].value, w)` (`weighted`). This is the canonical Array-of-Structs shape: every numeric channel is a boxed `ValueUnit` object, the blend dispatches per-channel through a type guard, and the composite buffer `_grouped` is a string-keyed `Record` (`group.ts:110`). The LIGHT `NumericAnimation` ALREADY proved the SoA win one tier down — `Float64Array` + `lerpArray`, measured **3.86×** in `spring-vector-decision.json` (`AUDIT-DIGEST.md` K1: "the LIGHT NumericAnimation already runs Float64Array SoA — proven 3.86x but never transposed to the engine").

### The key-stability invariant ALREADY exists (the transposition is over a stable layout)

The hard part of an SoA fold is a STABLE `(key → offset)` mapping — and the group already computes exactly that. `computeGroupedKeys` (`group-layer-springs.ts:131-143`) folds the entries' `flatKeys` (whitelist-filtered) into a deduplicated `string[]`, recomputed ONLY on a structural change (`group.ts:249-254`, the `_groupedKeysDirty` seam — never per frame). `_groupedKeys: string[]` (`group.ts:119`) is the compile-stable key union the per-frame null-fill clears (`group.ts:260-263`, the F.W4 S2 stable-key null-fill — NO `delete`, so `_grouped` stays in V8 fast-properties mode). So the offset layout the SoA fold needs is `_groupedKeys.indexOf(key)` — a mapping that is already stable across frames and already busts only on a structural change. The transposition: at `_groupedKeysDirty` time, also build the `(key → flatOffset)` partition (which `_groupedKeys` entries are NUMERIC-leaf and at what `Float64Array` offset, accounting for multi-component leaves where a `ValueUnit[]` is length N), allocate the contiguous `_compositeBuf: Float64Array`, and rewrite the three blend arms' numeric path as a typed accumulate over `_compositeBuf` indexed by offset — the boxed `ValueUnit[]` tail kept ONLY for the non-numeric (color/computed/string) leaves.

### The blend semantics MUST be preserved exactly (the falsification guard)

The transposition is born-RED-guarded against changing the blend's OBSERVABLE result. The `add` arm is UN-CLAMPED (`group.ts:300-301` "Numeric add is UN-CLAMPED … `0.8 + 0.8 → 1.6`") — the SoA fold must preserve that (a `Float64Array` accumulate is naturally un-clamped — good). The `weighted` arm reads `w = layer.weightSpring?.value ?? layer.weight` ONCE per layer (`group.ts:335`, the K.W11 PHYS-C spring-driven blend weight that can overshoot 1.0) — the SoA fold hoists the SAME per-layer scalar. The post-blend compaction (`group.ts:368-375`) drops any key no enabled child contributed — the SoA fold must reproduce the "uncontributed key reads back undefined" semantics (a contribution bitmask per frame). The mixed-leaf case (a key that is numeric in one child, non-numeric in another) falls back to the boxed path (the SoA fold covers the PURE-numeric leaf subset only — the same partition discipline the K3 processFrame-SoA idea uses, `AUDIT-DIGEST.md` K3 "mixed segments cannot use SoA"). The replay-equality oracle (`proof:replay-equality`, `package.json:66`) is the regression authority: the SoA blend's output must be byte-equal to the boxed blend's over the corpus.

### The computed-unit cache key (the composite-numeric-key idea — DISPATCH-coupled)

The value.js C1 endpoint cache (`value.js/src/units/interpolate.ts:38-67`) collapses a computed/container-unit interp to a bare `lerp` once the `(target, epoch)` is unchanged — the steady state. The cache key is TWO comparisons per frame: `cache.target !== target` (object identity) + `cache.epoch !== epoch` (the monotonic `layoutEpoch`). The K1 composite-numeric-key idea: fold `(targetId, epoch)` into a SINGLE numeric composite key (a `targetId * EPOCH_SCALE + epoch`, the same `startIx*FRAME_ID_SCALE+endIx` pattern the K1 reconcileVars cure uses) so the fast-path is ONE integer compare, not two — a micro-win on the per-frame computed-unit egress. This cache lives in value.js (`iv._computedCache`), so the TRANSPOSITION is a value.js-P DISPATCH (inv-16 — kf does not write value.js). What P.W2 owns kf-side is the BENCH OBSERVABLE: the computed-unit steady-state collapse measured via the existing `bench/interp-buffer.bench.ts` "calc() leaf · 600-frame steady window (C1 endpoint memo)" arm (`taxonomy.json`), graduated to a budgeted ratio that the value.js-P cache-key transposition must beat (the before/after on the re-pin — the K1 densify-COMPILE cross-repo discipline).

### Audit evidence

| Ref | Source location | Fact (verified 2026-06-20) |
|-----|-----------------|------------------------------|
| compositor-AoS | `src/animation/group.ts:287-363` | the 3 blend arms walk `Record<string,ValueUnit[]>` with `for..in` + `Array.isArray` + per-element `isNumericUnit` — boxed AoS |
| composite-buffer | `src/animation/group.ts:110,119` | `_grouped: Record<string,unknown>` + `_groupedKeys: string[]` — the string-keyed composite + the stable key union |
| key-stability | `src/animation/group-layer-springs.ts:131-143` | `computeGroupedKeys` — the deduplicated `flatKeys` fold, the `(key→offset)` substrate, recomputed ONLY on structural change |
| dirty-seam | `src/animation/group.ts:249-254` | `_groupedKeysDirty` — the structural-change seam where the SoA partition + `Float64Array` alloc is built (never per frame) |
| null-fill | `src/animation/group.ts:256-263` | the F.W4 S2 stable-key null-fill (NO `delete` — keeps `_grouped` in V8 fast-properties mode); the SoA fold's contribution-bitmask analog |
| add-unclamped | `src/animation/group.ts:300-301` | `add` is UN-CLAMPED (`0.8+0.8→1.6`) — the SoA accumulate must preserve |
| weighted-spring | `src/animation/group.ts:335` | `w = layer.weightSpring?.value ?? layer.weight` — ONE per-layer scalar (K.W11 PHYS-C), hoisted out of the element loop |
| compaction | `src/animation/group.ts:368-375` | post-blend drop of uncontributed keys — the SoA contribution-bitmask must reproduce |
| SoA-proven | `scripts/spring-vector-decision.json` | the LIGHT `NumericAnimation` SoA (`Float64Array`+`lerpArray`) ratio **3.86×** at K=8 — the proven win the engine never inherited |
| replay-oracle | `package.json:66` (`proof:replay-equality`) | the regression authority — the SoA blend output must be byte-equal to the boxed blend over the corpus |
| C1-cache | `value.js/src/units/interpolate.ts:38-67` | the computed-unit `(target, epoch)` endpoint cache — TWO comparisons per frame (the composite-numeric-key DISPATCH target) |
| C1-bench | `bench/interp-buffer.bench.ts:124` + `taxonomy.json` | "calc() leaf · 600-frame steady window (C1 endpoint memo)" — the kf-side observable for the computed-unit cache-key win |
| portable-floor | `P.W1` (`scripts/lib/portable-perf.mjs`, `ratioGate`) | the apparatus this wave's gate CALLS — the same-report device-independent ratio |

---

## Scope

Each S-clause is a concrete, falsifiable deliverable. **S1** builds the SoA `(key→offset)` partition + the `_compositeBuf: Float64Array` at the `_groupedKeysDirty` seam. **S2** transposes the three blend arms' PURE-numeric path onto the typed fold (the boxed tail kept for non-numeric leaves). **S3** authors `proof:soa-composite` born-RED over a PORTABLE alloc-count + throughput ratio bench on the group draw path (the keystone — via P.W1's `ratioGate`). **S4** graduates the computed-unit cache-key bench observable (DISPATCH-coupled to value.js P). Every move preserves the blend's observable result byte-exactly (the replay-equality oracle) — NONE a strategy change to the blend SEMANTICS, NONE a workaround.

---

### S1 — the SoA `(key→offset)` partition + `_compositeBuf: Float64Array` (at the stable seam)

**Breach.** The composite buffer `_grouped` (`group.ts:110`) is a string-keyed `Record<string,unknown>` of boxed `ValueUnit[]` leaves. The blend dispatches per-channel through `isNumericUnit` (`group.ts:311,345`) on every element of every key of every layer of every frame — megamorphic boxed reads on the multi-animation hot path. There is no contiguous numeric accumulator, despite the `(key→offset)` layout already being computed and stable (`computeGroupedKeys`).

**Cure.** At the `_groupedKeysDirty` recompute (`group.ts:249-254`), in ADDITION to `computeGroupedKeys`, build the SoA partition:

- **The numeric partition.** Walk `_groupedKeys`; for each key, inspect a representative child's leaf to classify it NUMERIC (every component a `isNumericUnit` `ValueUnit<number>`, not color/computed/string) or BOXED (the non-numeric tail). For each numeric key, record its `Float64Array` offset (accounting for multi-component leaves — a `translate3d` leaf is length 3, so it spans 3 contiguous slots). Build `_compositeOffsets: Map<string, {offset, len}>` (or a parallel-array layout keyed by the `_groupedKeys` index — the leaner SoA-of-SoA form).
- **The buffer.** Allocate `_compositeBuf: Float64Array` of the total numeric width ONCE per structural change (NOT per frame — the same `_groupedKeysDirty` discipline as `_groupedKeys`). Plus `_compositeContributed: Uint8Array` — the per-frame contribution bitmask (the SoA analog of the null-fill, cleared in place each frame).
- **The destination binding.** Keep the boxed `ValueUnit[]` destination refs for the numeric keys (the transform consumes `Record<string,ValueUnit[]>`); on the post-fold write-back, copy `_compositeBuf[offset..offset+len]` into the boxed leaves' `.value` slots ONCE per frame (one strided copy, not per-channel dispatch). The boxed tail (color/computed/string) keeps the existing per-element path untouched.

**Constraint (the stable seam, KISS).** The partition + the `Float64Array` alloc happen ONLY at `_groupedKeysDirty` time — never per frame (the `computeGroupedKeys` discipline). The numeric width is fixed for the structure; a structural change rebuilds it. The mixed-leaf case (a key numeric in one child, non-numeric in another) classifies BOXED (falls back to the existing path — the SoA covers the pure-numeric majority, the K3 partition discipline). KISS: the SoA buffer is a contiguous `Float64Array` + an offset map + a contribution bitmask, indexed by the layout that already exists.

**Gate bite.** `proof:soa-composite` `partition-built` clause: at a structural change, `_compositeBuf instanceof Float64Array` and its width equals the numeric-leaf channel count. BITE: a structural change that does not rebuild the partition (a stale buffer) → a wrong-width fold → the throughput arm + the replay-equality oracle red.

---

### S2 — transpose the three blend arms' numeric path onto the typed fold (the boxed tail preserved)

**Breach.** The `replace`/`add`/`weighted` arms (`group.ts:287-363`) each carry the full boxed dispatch: `for..in` over `values`, `Array.isArray` guards, per-element `isNumericUnit`, then a boxed `.value` read-modify-write. The pure-numeric majority pays the megamorphic-dispatch tax on every channel of every frame.

**Cure.** Rewrite each arm's PURE-numeric path as a typed fold over `_compositeBuf`, indexed by the `_compositeOffsets` layout (the boxed tail kept verbatim for non-numeric keys):

- **`replace`** — for a numeric key, `_compositeBuf[off..off+len]` is overwritten by the incoming child's unwrapped numbers + the contribution bit set (the z-order last-writer-wins, branch-free).
- **`add`** — `_compositeBuf[i] += incomingN[i]` (UN-CLAMPED, the `group.ts:300-301` semantic preserved naturally by the typed accumulate) + the contribution bit OR'd.
- **`weighted`** — `_compositeBuf[i] = lerp(_compositeBuf[i], incomingN[i], w)` with `w = layer.weightSpring?.value ?? layer.weight` hoisted ONCE per layer (the K.W11 PHYS-C scalar, `group.ts:335` — the overshoot-1.0 spring weight unchanged).

After the layer loop, the write-back (S1) copies `_compositeBuf` into the boxed destination leaves; the post-blend compaction reads the contribution bitmask (an uncontributed numeric key reads back "undefined" — the `group.ts:368-375` drop preserved). The non-numeric tail (color/computed/string) walks the existing per-element boxed path UNCHANGED.

**Constraint (observable-truth — the blend result is byte-exact).** The transposition changes the ARITHMETIC SUBSTRATE (boxed per-channel → contiguous typed fold), NEVER the blend's OBSERVABLE result. `proof:replay-equality` (`package.json:66`) is the oracle: the SoA blend's serialized output must be byte-equal to the boxed blend's over the full replay corpus. The un-clamped `add`, the spring-overshoot `weighted`, the z-order `replace`, and the uncontributed-key drop are all preserved exactly. No new approximation, no clamp, no reordering. The falsification guard: a SoA fold that is faster but produces a DIFFERENT blend (a clamp slipped in, a hue channel mishandled) reds `proof:replay-equality` BEFORE it can ship.

**Gate bite.** `proof:soa-composite` `blend-equal` clause: the SoA blend output `deepEquals` the boxed blend output over the `replace`/`add`/`weighted` corpus (the un-clamped add, the spring-weighted overshoot, the multi-component leaf). BITE: the SoA `add` accidentally clamps (`Math.min(1, …)`) → `0.8+0.8` reads `1.0` not `1.6` → `blend-equal` reds.

---

### S3 — `proof:soa-composite` born-RED over a PORTABLE alloc-count + throughput ratio (the keystone — observable-truth)

**Breach.** No `proof:soa-composite` gate exists (`ls scripts/proof-soa-composite.mjs` → no file; `grep soa-composite package.json` → none). The existing SoA arms (`taxonomy.json` "K=8 … SoA Float64Array+lerpArray") bench `interpFrames` (the per-frame NUMERIC LEAF), NOT `transformFramesGrouped` (the GROUP composite) — the compositor SoA win is un-benched. An aggressive transposition with no portable born-RED gate is unmeasured.

**Cure.** Author `bench/group-composite.bench.ts` (the suite P.W1 S2 added to the taxonomy as a `pendingBudgeted` arm) + `scripts/proof-soa-composite.mjs`, the born-RED gate. Two measured arms, both via P.W1's `ratioGate` (`scripts/lib/portable-perf.mjs` — the same-report device-independent ratio):

1. **throughput** — the SoA composite blend (S2) vs the boxed baseline, at a K-ladder (K∈{3,8,12} children · the `replace`/`add`/`weighted` mix · a 600-frame steady window). Budgeted `floorFraction = 1.2` (the J.W6 ADOPT threshold — the SoA fold must run ≥1.2× the boxed blend). The floor is the baselineCase's hz × 1.2, computed at run time from the same report (device-independent — the K3 portability spine). ADOPT (≥1.2×) records in `scripts/soa-composite-decision.json` (the `spring-vector-decision.json` durable-verdict shape) and authorizes the engine edit; KILL (<1.2×) forbids it (MEASURE-FIRST — no unproven engine code ships).
2. **alloc-count** — a heap-delta probe (`--expose-gc` + `process.memoryUsage` delta, the `proof:zero-alloc`/`proof:standalone-zero-alloc` shim, `package.json:61,63`) over a 600-frame group draw window: the SoA path allocates ZERO per-frame `Float64Array` (the buffer is allocated once at `_groupedKeysDirty`, reused across frames — the F.W4 zero-alloc discipline). The boxed baseline's per-frame boxed churn is the contrast.

**Constraint (PORTABLE, ratio-normalized — the owner mandate).** The throughput gate is a SAME-REPORT ratio (`soaHz / boxedHz ≥ 1.2`, numerator and denominator measured in the same pass — device-independent BY CONSTRUCTION), routed through `declarePosture` per P.W1's `ratioGate`. The absolute hz survives ONLY as an observe-only note. The alloc-count arm is DETERMINISTIC (an alloc count, not wall-clock — HARD everywhere; it counts allocations, not timing). No absolute `floorHz` is a HARD predicate (the K3 portability spine). The keystone is the throughput ratio: the compositor SoA is the multi-animation hot path's win, and the gate proves it on ANY runner.

**Gate bite.** `node scripts/proof-soa-composite.mjs` → exit 1 today (the bench suite absent, the SoA path absent, the decision JSON absent). After S1+S2 land: the throughput arm records ADOPT (≥1.2×) or KILL (<1.2×) in the decision JSON, the alloc-count arm confirms zero per-frame `Float64Array` alloc, and `proof:replay-equality` confirms the blend is byte-exact. BITE: revert the SoA fold to the boxed path (a planted regression) → the throughput ratio inverts (<1.0) → the HARD ratio arm reds (the planted-failure born-RED proof).

---

### S4 — graduate the computed-unit cache-key bench observable (DISPATCH-coupled to value.js P)

**Breach.** The value.js C1 computed-unit cache (`value.js/src/units/interpolate.ts:38-67`) keys the steady-state fast-path on TWO comparisons (`cache.target !== target` + `cache.epoch !== epoch`). The K1 composite-numeric-key idea folds them into ONE integer compare (`targetId * EPOCH_SCALE + epoch`). This cache lives in value.js — the transposition is a value.js-P DISPATCH (inv-16: kf does NOT write value.js). The kf-side `bench/interp-buffer.bench.ts` "calc() leaf · 600-frame steady window (C1 endpoint memo)" arm (`taxonomy.json`) is the OBSERVABLE, but it is `observe-only` — no budgeted floor tracks the value.js-P cache-key win.

**Cure.** Two parts, honoring the inv-16 fence:

1. **kf-side (NOW).** Graduate the existing `bench/interp-buffer.bench.ts` "calc() leaf · 600-frame steady window (C1 endpoint memo)" arm from `observe-only` to a `crossRepo`-tagged budgeted-on-re-pin arm in `taxonomy.json` (the P.W1 S2 color2Into-consume discipline): record the pre-P baseline; on the value.js-P re-pin, assert the computed-unit steady-state collapse hz EXCEEDS the recorded baseline × 1.0 (no regression) and observes the cache-key micro-win (the K1 densify-COMPILE cross-repo gate shape, `AUDIT-DIGEST.md` K1).
2. **DISPATCH (the transposition itself).** The composite-numeric-key cache-key refinement is authored as a value.js-P ask in `KF-TO-VALUEJS-P.md` (the dispatch packet — NOT a kf write): "fold the C1 `(target, epoch)` cache key into a single numeric composite (`targetId * EPOCH_SCALE + epoch`) so the steady-state fast-path is one integer compare." The kf-side budgeted arm (part 1) is the gate the value.js-P transposition is measured against on the re-pin.

**Constraint (inv-16 — kf asks, never writes).** The cache-key transposition is value.js's to make (`iv._computedCache` is value.js-owned). kf owns ONLY the bench observable (the kf-side `calc()` leaf arm) + the DISPATCH ask. No kf source touches the value.js cache. The kf-side budgeted arm is `crossRepo`-tagged (EXCLUDED from kf CI as a HARD floor until the value.js-P re-pin; the STRUCTURE — the ask is present, the baseline is recorded — is HARD).

**Gate bite.** `proof:bench-taxonomy` `crossRepo` clause: the computed-unit cache-key ask is PRESENT in `KF-TO-VALUEJS-P.md` + the `crossRepo[]` array, and the kf-side `calc()` leaf budgeted arm records its pre-P baseline. BITE: drop the cache-key ask from the dispatch → the value.js-P frontier is silently un-tracked; the kf-side observable has no transposition to validate.

---

## Born-RED gate

**Gate:** `proof:soa-composite` (NEW — `scripts/proof-soa-composite.mjs`, the compositor SoA throughput + alloc-count gate via P.W1's `ratioGate`) + `proof:replay-equality` (EXISTING — the byte-exact blend oracle, `package.json:66`) + the EXTENDED `proof:bench-taxonomy` (the `group-composite` scenario class + the computed-unit cache-key crossRepo arm). Born-RED on today's tree, before any SoA partition / typed fold / bench suite / decision JSON exists.

**The REAL observable per arm (observable-truth — each bites the genuine breach, not a source-grep proxy).**

| Arm | The REAL observable the gate bites | Born-RED witness on today's (2026-06-20) tree |
|-----|-------------------------------------|------------------------------------------------|
| S1 partition-built | a structural change does not allocate a correct-width `_compositeBuf: Float64Array` | the partition + the `Float64Array` do not exist (`grep _compositeBuf src/animation/group.ts` → ZERO) → the gate cannot find the buffer → RED |
| S2 blend-equal (**oracle**) | the SoA blend output DIFFERS from the boxed blend over the corpus (a clamp slipped in, a multi-component leaf mishandled) | the SoA path does not exist; once authored, `proof:replay-equality` reds the instant the SoA `add` clamps or a hue channel is mishandled |
| S3 throughput (**KEYSTONE**) | the SoA composite blend runs SLOWER than the boxed baseline (ratio < 1.2) — the transposition does not pay | `bench/group-composite.bench.ts` ENOENT + `scripts/soa-composite-decision.json` ENOENT → the SoA win has never been measured on the COMPOSITOR path (only `interpFrames`) → RED |
| S3 alloc-count | a fresh `Float64Array` ALLOCATED per group draw frame (the buffer not reused) | the SoA buffer does not exist; once authored, a per-frame alloc (buffer rebuilt every frame instead of at `_groupedKeysDirty`) → the heap-delta probe reds |
| S4 cache-key crossRepo | the computed-unit composite-numeric-key ask dropped from the dispatch → the value.js-P frontier untracked | the ask is not yet in `KF-TO-VALUEJS-P.md`/`crossRepo[]`; the `calc()` leaf arm is `observe-only` (no budgeted baseline) → RED until the ask + baseline land |

**The portability spine (the owner mandate — PORTABLE perf gate, ratio-normalized).** The throughput gate is a SAME-REPORT device-INDEPENDENT ratio (`soaHz / boxedHz ≥ 1.2`, numerator and denominator measured on the same runner in the same pass — the E24 gold standard, via P.W1's `ratioGate`). The absolute wall-clock magnitude survives ONLY as an `observe-only` note, NEVER as a HARD CI predicate (the device-dependence-greening lesson — a gate that passes on macOS cannot flake RED on the slow Linux runner for a device reason). The alloc-count arm is DETERMINISTIC (it counts `Float64Array` allocations, not timing — HARD everywhere). The blend-equal oracle is device-INDEPENDENT (byte-equality, not timing — HARD everywhere). No absolute `floorHz` is a HARD predicate.

**How each is born-RED (plant-a-failure).** S1 reds because `_compositeBuf` is absent (the partition does not exist). S2/replay reds the instant a planted SoA `add` clamps (`0.8+0.8` reads `1.0` not `1.6`) — the byte-exact oracle bites the genuine semantic drift, not a source grep. S3 throughput reds because the compositor SoA path + its bench suite are absent (the win has never been measured on `transformFramesGrouped` — only on `interpFrames`); after the path lands, a planted revert to the boxed blend inverts the ratio (<1.0) and the HARD ratio arm reds. S3 alloc-count reds on a planted per-frame `Float64Array` alloc (the buffer rebuilt every frame instead of at the structural seam). S4 reds because the cache-key ask is not yet dispatched + the `calc()` leaf arm has no budgeted baseline. Each born-RED witness is the REAL runtime observable measured live — never a source grep that a stub could green.

**Green condition.** The SoA `(key→offset)` partition + `_compositeBuf: Float64Array` built at the `_groupedKeysDirty` seam (S1); the three blend arms' numeric path transposed onto the typed fold with the boxed tail preserved + `proof:replay-equality` byte-exact (S2); `proof:soa-composite` throughput records ADOPT (≥1.2×) or KILL (<1.2×) in `soa-composite-decision.json` + the alloc-count arm confirms zero per-frame `Float64Array` alloc (S3); the computed-unit composite-numeric-key ask dispatched to value.js P + the kf-side `calc()` leaf budgeted baseline recorded (S4). The multi-animation compositor hot path is a contiguous typed fold over the numeric majority — the proven LIGHT SoA win (3.86×) inherited by the engine, byte-exactly, on any runner.

---

## Dependencies

- **P.W1 apparatus — sequenced BEFORE (the Band ordering).** P.W2's `proof:soa-composite` CALLS P.W1's `ratioGate` (`scripts/lib/portable-perf.mjs`) for the throughput ratio + graduates the `group-composite` scenario class P.W1 S2 added to the taxonomy. Without P.W1 the SoA throughput claim has no portable born-RED gate (`P.md:175` "Band A lands FIRST").
- **`computeGroupedKeys` + `_groupedKeys` + `_groupedKeysDirty` — already shipped** (`group-layer-springs.ts:131`, `group.ts:119,249`). The SoA partition is built at the EXISTING structural-change seam; the key-stability invariant the fold needs already exists. NO new library surface, NO new value.js edge.
- **`proof:replay-equality` — already shipped** (`package.json:66`). The byte-exact blend oracle is the regression authority; the SoA transposition adds NO new oracle — it RIDES the existing one (the blend result must be unchanged).
- **The LIGHT SoA precedent — already proven** (`spring-vector-decision.json`, the `NumericAnimation` `Float64Array`+`lerpArray` 3.86×). The engine inherits a measured win, not an unproven hypothesis (MEASURE-FIRST).
- **The computed-unit cache-key transposition — a value.js-P DISPATCH (inv-16).** The `iv._computedCache` composite-numeric-key refinement is value.js's to make (`KF-TO-VALUEJS-P.md`); kf owns ONLY the bench observable + the ask. The kf-side `calc()` leaf budgeted arm is `crossRepo`-tagged (gated on the value.js-P re-pin, like the color2Into arm).
- **Independent of P.W3 (Typed-OM + Playhead) and every Band-C/D/E wave.** File surfaces: `src/animation/group.ts` + `src/animation/group-layer-springs.ts` (the SoA partition + fold), `bench/group-composite.bench.ts` (NEW), `scripts/proof-soa-composite.mjs` (NEW), `scripts/soa-composite-decision.json` (NEW — the durable verdict), `bench/taxonomy.json` (the scenario class graduation), `KF-TO-VALUEJS-P.md` (the cache-key ask). No collision with P.W3's `engine.ts`/`utils.ts` Typed-OM seam (a SEPARATE file + gate).
- **NO glass-ui publish dep, NO value.js publish dep (for the SoA fold — pure NOW), NO parse-that dep.** The compositor SoA is entirely kf-internal; only the computed-unit cache-key arm is DISPATCH-coupled (tracked-not-waited).

---

## dev→impl boundary

This file is the Tranche P DEVELOPMENT spec for P.W2 — DOCS ONLY. It writes zero engine/demo/library source (inv-16: kf writes only keyframes.js; the computed-unit cache-key transposition is a value.js-P DISPATCH, never a foreign-tree edit). The IMPLEMENTATION (the SoA partition + `_compositeBuf`, the three-arm typed fold, the `proof:soa-composite` authoring, the cache-key dispatch) opens only on the owner's explicit authorization. When it opens it is gate-first (`proof:soa-composite` authored born-RED + the `bench/group-composite.bench.ts` baseline recorded BEFORE the SoA fold lands — MEASURE-FIRST, ADOPT-or-KILL), observable-truth (the throughput ratio + the alloc-count + the byte-exact `proof:replay-equality` oracle over the REAL blend, not a source grep), no-legacy (the boxed per-channel dispatch DELETED from the numeric path — only the non-numeric tail keeps it, not kept beside as a dead parallel), KISS (the SoA buffer is a contiguous `Float64Array` + an offset map + a contribution bitmask, indexed by the layout that already exists), gestalt (ONE composite path — the numeric majority a typed fold, the non-numeric tail the boxed path; the proven LIGHT SoA win inherited at the TRUE seam), and P-invariant-28 (the SoA-composite verdict gets a durable `soa-composite-decision.json` terminal home — ADOPT authorizes the edit, KILL forbids it; no unproven engine code).

---

## Bite — what regression each clause catches

| Clause | Regression it prevents |
|--------|------------------------|
| S1 SoA partition | The contiguous `Float64Array` accumulator is rebuilt per FRAME (not at the `_groupedKeysDirty` structural seam) — re-introducing the per-frame alloc the F.W4 null-fill eliminated; the multi-animation hot path pays an allocation tax every draw |
| S2 typed fold | The blend's numeric path stays boxed-`ValueUnit` AoS with per-channel `isNumericUnit` dispatch — the proven LIGHT SoA win (3.86×) is never inherited by the engine; the multi-animation compositor stays megamorphic |
| S2 blend-equal (oracle) | The SoA fold is faster but WRONG — a clamp slips into `add` (`0.8+0.8` reads `1.0` not `1.6`), a multi-component leaf is mis-strided, or a spring-overshoot `weighted` weight is mishandled — and `proof:replay-equality` does not catch it because the SoA path bypassed the oracle |
| S3 throughput (keystone) | The compositor SoA is shipped WITHOUT a portable born-RED gate — a perf claim with no same-report ratio (the falsify-first mandate unmet), OR the gate hardcodes an absolute `floorHz` that flakes RED on the slow runner for a device reason |
| S3 alloc-count | The SoA path allocates per-frame (the buffer not reused across frames) — a zero-alloc regression on the group draw path the heap-delta probe must catch deterministically |
| S4 cache-key dispatch | The computed-unit composite-numeric-key win is silently un-tracked (the ask dropped from `KF-TO-VALUEJS-P.md`), OR kf reaches INTO value.js to make the cache-key edit itself (an inv-16 breach — the transposition is a DISPATCH, not a kf write) |

---

## Excluded from this wave

- **The Typed-OM (`StylePropertyMap`) write path + the `Playhead` value-object** — those are P.W3 (a SEPARATE `engine.ts`/`utils.ts` seam + gate). P.W2 is ONLY the AnimationGroup composite fold + the computed-unit cache-key observable.
- **Extending SoA to `CSSKeyframesAnimation.processFrame`** (the K3 single-animation per-frame SoA — `AUDIT-DIGEST.md` K3 "extend SoA to processFrame for pure-numeric segments") — a SEPARATE single-animation transposition (the interp-buffer arm O.W8 benches, the J.W6 S2 prototype). P.W2 is the GROUP COMPOSITOR (`transformFramesGrouped`), the multi-animation hot path — a distinct seam from the per-animation `processFrame`.
- **Making the computed-unit cache-key edit in value.js** — that is a value.js-P DISPATCH (`KF-TO-VALUEJS-P.md`), NEVER a kf write (inv-16). kf owns the bench observable + the ask only.
- **The non-numeric (color/computed/string) leaf blend** — kept on the existing boxed per-element path UNCHANGED. The SoA fold covers the PURE-numeric leaf subset only (the mixed-leaf case classifies BOXED — the K3 partition discipline). A color-channel SoA is the K3 `lerpColorValue` Float64 plan idea (a value.js-side `ColorChannelPlan` consume), not this wave.
- **The WAAPI maximalism arms** (color densify, computed px-bake — `AUDIT-DIGEST.md` K1 novelIdeas) — those lift whole animation classes onto the compositor thread; a separate frontier from the rAF-path SoA compositor fold. Not this wave.
