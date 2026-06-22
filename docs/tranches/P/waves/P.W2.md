# P.W2 — MEASURE-FIRST → VALIDATED: ADOPT the SoA fold on the AnimationGroup add/weighted arms (3.7× measured on the real path, bit-identical)

**Band:** B — Engine-perf (the transpositions).
**Phase:** NOW — kf-internal, zero sibling dependency, executable on authorization. **The spike RAN** (the measure-first discipline EXERCISED, not deferred — per the owner's "prototype and validate, don't abrogate"): `bench/group-soa-validate.mjs` → `scripts/group-soa-decision.json` benched the SoA fold against the CURRENT boxed blend on `transformFramesGrouped`'s ACTUAL leaf shape (`ValueUnit[]` output kept). **Verdict: ADOPT** — weighted **3.66×**, add **3.69×** (3-trial median), output **bit-identical** (`weightedMaxErr=0`, `addMaxErr=0`). Scope: the `add`/`weighted` arms ONLY; the default `replace` arm is already dispatch-free + untouched. The computed-unit composite-key arm stays a kf-side OBSERVE-ONLY bench — NOT a value.js dispatch.
**Sequence (the DAG edge):** `P.W1 apparatus (the portable-perf helper + the compositor-blend scenario class) ─► P.W2` (this wave — graduate the compositor-blend scenario; consume the apparatus's `ratioGate`) ‖ `P.W3 _styleOut out-buffer`. P.W2 + P.W3 are the two NOW engine waves (`P.md:136,161`); both spend P.W1's portable-perf floor.
**Owning-DM-or-idea:** the **K1/V2 "SoA composite buffer for AnimationGroup"** (`AUDIT-DIGEST.md` K1) — the CONTRIVANCE-AUDIT flagged the original justification (the 3.86× was TRANSPLANTED; the default arm is dispatch-free), the spike was authored to TEST it rather than abrogate it, and the measurement on the REAL path RETURNED **ADOPT**: a genuine ~3.7× on the add/weighted arms with bit-identical output. The win is eliminating the per-element `isNumericUnit` dispatch + `for..in` + `Array.isArray` overhead via a precomputed flat numeric-slot layout + a `Float64Array` fold — NOT the boxed `.value` read/write (which the seed + write-back still pay). **Impl-phase confirm:** an integration bench of the WHOLE `transformFramesGrouped` with real children (the blend is a SHARE of the frame; Amdahl) before the engine edit lands — the isolated blend is 3.7×, the whole-frame delta is the blend's share.

**The measurement-honesty correction (CONTRIVANCE-AUDIT).** Two facts the original framing got wrong:

1. **The 3.86× headline is TRANSPLANTED.** It measures `SpringProgress.setTargets` (the LIGHT `NumericAnimation` Float64Array path, `spring-vector-decision.json`) — a DIFFERENT path than `AnimationGroup.transformFramesGrouped`. It is NOT evidence that the compositor blend is slow. The 3.86× is DROPPED as this wave's justification; the only valid evidence is a bench of `transformFramesGrouped` itself (S1).
2. **The DEFAULT blend arm (`replace`) is ALREADY dispatch-free.** `group.ts:289-294` is a bare reference-assign (`existing = incoming`) — ZERO per-element `isNumericUnit` dispatch, ZERO boxed read-modify-write. The megamorphic boxed-AoS blend the SoA fold attacks lives ONLY in the non-default `add`/`weighted` arms. The original "the compositor is a megamorphic AoS blend run every frame" headline is FALSE for the default path and is DROPPED.

So P.W2 is restructured: (S1) bench `transformFramesGrouped` SPECIFICALLY — the default `replace` arm AND the `add`/`weighted` arms measured SEPARATELY, same-report ratio; (S2/S3) the SoA engine edit is a DEMOTE-TO-SPIKE, chartered ONLY if the `add`/`weighted` arms clear the bar in the decision-JSON; (S4) the computed-unit composite-key is a kf-side MEASURE-FIRST observe-only bench — NOT dispatched (two cheap integer compares per frame are not a plausible bottleneck). The SoA fold, IF chartered, transposes the `add`/`weighted` numeric subset into a contiguous `Float64Array` indexed by the existing `_groupedKeys` (key→offset) layout; the default `replace` path is untouched (already dispatch-free) and the non-numeric tail keeps the boxed path.

---

## Context

### The compositor blend: the DEFAULT arm is already dispatch-free; only `add`/`weighted` are boxed AoS

`AnimationGroup.transformFramesGrouped(t)` (`group.ts:245-394`) runs EVERY group draw frame for EVERY child. The blend (`group.ts:287-363`) is three `switch` arms — but they are NOT uniform:

- **`replace` (the DEFAULT, `group.ts:289-294`)** — a bare reference-assign (`existing = incoming` per key). ZERO per-element walk, ZERO `Array.isArray` guard, ZERO per-channel `isNumericUnit` dispatch, ZERO boxed read-modify-write. This is the z-order last-writer-wins path, and it is ALREADY dispatch-free. The SoA fold attacks a cost this path does not pay.
- **`add` / `weighted` (NON-default, `group.ts:296-363`)** — these DO walk `values` (a `Record<string, ValueUnit[]>`) with `for..in`, test `Array.isArray(existing) && Array.isArray(incoming)`, and per-element test `isNumericUnit(existing[i]) && isNumericUnit(incoming[i])` before a boxed `existing[i].value += incoming[i].value` (`add`) or `existing[i].value = lerp(existing[i].value, incoming[i].value, w)` (`weighted`). THIS is the Array-of-Structs shape the SoA fold targets — and it fires ONLY when an author opts into additive or weighted blending.

So the megamorphic boxed-AoS cost is REAL but NON-default: the SoA transposition can only pay on the `add`/`weighted` arms, never on the default `replace` path. The composite buffer `_grouped` is a string-keyed `Record` (`group.ts:110`) across all arms, but `replace` reads/writes it by whole-key reference, not per-channel.

**The transplanted 3.86× is NOT evidence here.** The 3.86× in `spring-vector-decision.json` measures `SpringProgress.setTargets` (the LIGHT `NumericAnimation` `Float64Array`+`lerpArray` path) — a DIFFERENT codepath. It says nothing about `transformFramesGrouped`. The ONLY admissible justification for the SoA engine edit is a bench of `transformFramesGrouped`'s `add`/`weighted` arms themselves (S1, the wave's FIRST step). That is the MEASURE-FIRST discipline this wave now enforces.

### The key-stability invariant ALREADY exists (the transposition is over a stable layout)

The hard part of an SoA fold is a STABLE `(key → offset)` mapping — and the group already computes exactly that. `computeGroupedKeys` (`group-layer-springs.ts:131-143`) folds the entries' `flatKeys` (whitelist-filtered) into a deduplicated `string[]`, recomputed ONLY on a structural change (`group.ts:249-254`, the `_groupedKeysDirty` seam — never per frame). `_groupedKeys: string[]` (`group.ts:119`) is the compile-stable key union the per-frame null-fill clears (`group.ts:260-263`, the F.W4 S2 stable-key null-fill — NO `delete`, so `_grouped` stays in V8 fast-properties mode). So the offset layout the SoA fold needs is `_groupedKeys.indexOf(key)` — a mapping that is already stable across frames and already busts only on a structural change. The transposition: at `_groupedKeysDirty` time, also build the `(key → flatOffset)` partition (which `_groupedKeys` entries are NUMERIC-leaf and at what `Float64Array` offset, accounting for multi-component leaves where a `ValueUnit[]` is length N), allocate the contiguous `_compositeBuf: Float64Array`, and rewrite the three blend arms' numeric path as a typed accumulate over `_compositeBuf` indexed by offset — the boxed `ValueUnit[]` tail kept ONLY for the non-numeric (color/computed/string) leaves.

### The blend semantics MUST be preserved exactly (the falsification guard)

The transposition is born-RED-guarded against changing the blend's OBSERVABLE result. The `add` arm is UN-CLAMPED (`group.ts:300-301` "Numeric add is UN-CLAMPED … `0.8 + 0.8 → 1.6`") — the SoA fold must preserve that (a `Float64Array` accumulate is naturally un-clamped — good). The `weighted` arm reads `w = layer.weightSpring?.value ?? layer.weight` ONCE per layer (`group.ts:335`, the K.W11 PHYS-C spring-driven blend weight that can overshoot 1.0) — the SoA fold hoists the SAME per-layer scalar. The post-blend compaction (`group.ts:368-375`) drops any key no enabled child contributed — the SoA fold must reproduce the "uncontributed key reads back undefined" semantics (a contribution bitmask per frame). The mixed-leaf case (a key that is numeric in one child, non-numeric in another) falls back to the boxed path (the SoA fold covers the PURE-numeric leaf subset only — the same partition discipline the K3 processFrame-SoA idea uses, `AUDIT-DIGEST.md` K3 "mixed segments cannot use SoA"). The blend-equality oracle (`proof:blend`, `package.json:84` — `scripts/proof-blend.mjs` + `test/blend.test.ts`, with `test/group.test.ts` + `test/iw0-cube-composite.test.ts` as the compositor corpus) is the regression authority: the SoA blend's output must be byte-equal to the boxed blend's over the `replace`/`add`/`weighted` corpus.

### The computed-unit composite-key (MEASURE-FIRST kf-side observe-only — NOT dispatched)

The value.js C1 endpoint cache (`value.js/src/units/interpolate.ts:38-67`) collapses a computed/container-unit interp to a bare `lerp` once the `(target, epoch)` is unchanged — the steady state. The cache key is TWO comparisons per frame: `cache.target !== target` (object identity) + `cache.epoch !== epoch` (the monotonic `layoutEpoch`). The K1 composite-numeric-key idea was to fold `(targetId, epoch)` into a SINGLE numeric composite key so the fast-path is ONE integer compare, not two.

**The CONTRIVANCE-AUDIT correction: this is NOT dispatched.** Two cheap integer compares per frame are not a plausible bottleneck — folding them into one is a speculative micro-opt with no measured need, and dispatching it to value.js would charter a sibling edit on an unmeasured premise. So S4 is RE-SCOPED to a kf-side MEASURE-FIRST OBSERVE-ONLY bench: the existing `bench/interp-buffer.bench.ts` "calc() leaf · 600-frame steady window (C1 endpoint memo)" arm (`taxonomy.json`) STAYS observe-only — it records the computed-unit steady-state collapse hz as a watched number, with NO budgeted floor and NO value.js dispatch packet. If a future bench ever shows the two-compare key is a real per-frame cost (it will not, but the bench is the authority), the composite-key would be RE-OPENED then — measured-need-first, not speculatively. The cache lives in value.js (`iv._computedCache`); kf owns ONLY the observe-only bench, and chooses NOT to ask value.js to change a non-bottleneck.

### Audit evidence

| Ref | Source location | Fact (verified 2026-06-20) |
|-----|-----------------|------------------------------|
| default-replace-dispatch-free | `src/animation/group.ts:289-294` | the DEFAULT `replace` arm is a bare reference-assign (`existing = incoming`) — ZERO per-element walk / `Array.isArray` / `isNumericUnit` dispatch. The SoA fold pays NOTHING here. |
| add/weighted-AoS | `src/animation/group.ts:296-363` | the NON-default `add`/`weighted` arms walk `Record<string,ValueUnit[]>` with `for..in` + `Array.isArray` + per-element `isNumericUnit` — boxed AoS (the ONLY arms the SoA fold targets) |
| composite-buffer | `src/animation/group.ts:110,119` | `_grouped: Record<string,unknown>` + `_groupedKeys: string[]` — the string-keyed composite + the stable key union |
| key-stability | `src/animation/group-layer-springs.ts:131-143` | `computeGroupedKeys` — the deduplicated `flatKeys` fold, the `(key→offset)` substrate, recomputed ONLY on structural change |
| dirty-seam | `src/animation/group.ts:249-254` | `_groupedKeysDirty` — the structural-change seam where the SoA partition + `Float64Array` alloc is built (never per frame) |
| null-fill | `src/animation/group.ts:256-263` | the F.W4 S2 stable-key null-fill (NO `delete` — keeps `_grouped` in V8 fast-properties mode); the SoA fold's contribution-bitmask analog |
| add-unclamped | `src/animation/group.ts:300-301` | `add` is UN-CLAMPED (`0.8+0.8→1.6`) — the SoA accumulate must preserve |
| weighted-spring | `src/animation/group.ts:335` | `w = layer.weightSpring?.value ?? layer.weight` — ONE per-layer scalar (K.W11 PHYS-C), hoisted out of the element loop |
| compaction | `src/animation/group.ts:368-375` | post-blend drop of uncontributed keys — the SoA contribution-bitmask must reproduce |
| 3.86×-is-TRANSPLANTED | `scripts/spring-vector-decision.json` | the **3.86×** ratio measures `SpringProgress.setTargets` (the LIGHT `NumericAnimation` `Float64Array`+`lerpArray` path) — a DIFFERENT path than `transformFramesGrouped`. NOT admissible as compositor-blend justification; DROPPED as this wave's headline (the decision-JSON `$comment` scopes any ratio to `transformFramesGrouped`). |
| blend-oracle | `package.json:84` (`proof:blend` — `scripts/proof-blend.mjs` + `test/blend.test.ts`; corpus `test/group.test.ts` + `test/iw0-cube-composite.test.ts`) | the regression authority — the SoA blend output must be byte-equal to the boxed blend over the `replace`/`add`/`weighted` corpus |
| C1-cache | `value.js/src/units/interpolate.ts:38-67` | the computed-unit `(target, epoch)` endpoint cache — TWO cheap integer compares per frame. NOT a plausible bottleneck; the composite-key is NOT dispatched (CONTRIVANCE-AUDIT) |
| C1-bench | `bench/interp-buffer.bench.ts:124` + `taxonomy.json` | "calc() leaf · 600-frame steady window (C1 endpoint memo)" — STAYS observe-only (a watched number, no budgeted floor, no dispatch) |
| portable-floor | `P.W1` (`scripts/lib/portable-perf.mjs`, `ratioGate`) | the apparatus this wave's gate CALLS — the same-report device-independent ratio |

---

## Scope

Each S-clause is a concrete, falsifiable deliverable. The wave is restructured MEASURE-FIRST: the bench comes BEFORE the engine edit, and the engine edit is a DEMOTE-TO-SPIKE gated on the bench verdict.

- **S1 (the FIRST step — MEASURE).** Author `bench/group-composite.bench.ts` measuring `transformFramesGrouped` SPECIFICALLY: the default `replace` arm AND the `add`/`weighted` arms benched SEPARATELY, same-report ratio. Records the verdict in `scripts/soa-composite-decision.json` (the P-inv-28 terminal home), whose `$comment` SCOPES the ratio to `transformFramesGrouped` (never the transplanted 3.86×).
- **S2 (DEMOTE-TO-SPIKE — gated).** The SoA `(key→offset)` partition + `_compositeBuf: Float64Array` + the typed fold over the `add`/`weighted` numeric subset. CHARTERED ONLY if S1's `add`/`weighted` arms clear the bar (`floorFraction ≥ 1.2`) in the decision-JSON. The default `replace` path is UNTOUCHED (already dispatch-free); the non-numeric tail keeps the boxed path. On a KILL verdict the spike is NOT built — the falsification is recorded and the boxed `add`/`weighted` arms ship as-is.
- **S3 (the gate).** `proof:soa-composite` born-RED over the PORTABLE bench (S1's measurement, via P.W1's `ratioGate`) + the decision-JSON ADOPT/KILL discipline + `proof:blend` byte-equality (if the spike is chartered).
- **S4 (MEASURE-FIRST observe-only — NOT dispatched).** The computed-unit composite-key bench stays observe-only kf-side; NO value.js dispatch.

If the spike is chartered, every move preserves the blend's observable result byte-exactly (the `proof:blend` oracle) — NONE a strategy change to the blend SEMANTICS, NONE a workaround.

---

### S1 — the FIRST step: bench `transformFramesGrouped` SPECIFICALLY (default `replace` + `add`/`weighted` separately) — MEASURE-FIRST

**Breach (the measurement gap).** The compositor SoA win is UN-BENCHED on its own path. The existing SoA arms (`taxonomy.json` "K=8 … SoA Float64Array+lerpArray") bench `interpFrames` (the per-frame NUMERIC LEAF) and `SpringProgress.setTargets` (the 3.86×) — NEITHER is `transformFramesGrouped` (the GROUP composite). No bench has ever measured the actual cost of the `add`/`weighted` arms this wave proposes to transpose. Chartering the SoA engine edit on the transplanted 3.86× would be building on an unmeasured premise.

**Cure.** Author `bench/group-composite.bench.ts` (the suite P.W1 S2 added to the taxonomy as a `pendingBudgeted` arm) measuring `transformFramesGrouped` SPECIFICALLY, at a K-ladder (K∈{3,8,12} children · a 600-frame steady window), with the THREE blend arms benched SEPARATELY in the SAME report:

1. **`replace` (the DEFAULT)** — the reference-assign path. Benched to CONFIRM the headline claim: this arm is already dispatch-free, so the SoA fold has NOTHING to win here. (Expected: an SoA fold over `replace` would be ≤1.0× — no point.)
2. **`add`** — the boxed accumulate (`group.ts:296-...`). The candidate.
3. **`weighted`** — the boxed lerp-by-weight (`group.ts:...-363`). The candidate.

The verdict is recorded in `scripts/soa-composite-decision.json` (the P-inv-28 durable-verdict shape, `spring-vector-decision.json` lineage). Its `$comment` field SCOPES the ratio EXPLICITLY: any speedup number applies to `transformFramesGrouped`'s `add`/`weighted` arms — NEVER the transplanted `SpringProgress.setTargets` 3.86×.

**Constraint (PORTABLE, same-report — MEASURE-FIRST, no engine code yet).** S1 writes ZERO engine source — it is the bench + the decision-JSON scaffold ONLY. The per-arm ratios are SAME-REPORT (each arm's boxed-baseline hz measured in the same pass, device-independent via P.W1's `ratioGate`). This is the gate that DECIDES whether S2 (the spike) is chartered at all.

**Gate bite.** `proof:soa-composite` `measured-first` clause: `bench/group-composite.bench.ts` exists, benches all three arms separately, and writes `soa-composite-decision.json` with a `$comment` scoping the ratio to `transformFramesGrouped`. BITE: a decision-JSON that cites the 3.86× (the transplanted number) instead of a `transformFramesGrouped`-measured ratio → the `$comment`-scope assertion reds.

---

### S2 — DEMOTE-TO-SPIKE: the SoA fold over the `add`/`weighted` arms (CHARTERED ONLY if S1 clears the bar)

**This entire S-clause is a SPIKE, gated on S1's verdict.** It is authored ONLY if `bench/group-composite.bench.ts` shows the `add`/`weighted` arms clear `floorFraction ≥ 1.2` in `soa-composite-decision.json`. On a KILL verdict (the `add`/`weighted` SoA fold does not beat the boxed blend by 1.2×), the spike is NOT built — the falsification is recorded in the decision-JSON and the boxed `add`/`weighted` arms ship as-is. The default `replace` path is UNTOUCHED in every case (it is already dispatch-free — S1 confirms there is nothing to win).

**Breach (in the `add`/`weighted` arms ONLY).** The `add`/`weighted` arms (`group.ts:296-363`) carry the boxed dispatch: `for..in` over `values`, `Array.isArray` guards, per-element `isNumericUnit`, then a boxed `.value` read-modify-write. The pure-numeric majority pays the megamorphic-dispatch tax on every channel of every frame — but ONLY when an author opts into additive/weighted blending. The `(key→offset)` layout the SoA fold needs already exists and is stable (`computeGroupedKeys`).

**Cure (IF chartered).** Two parts, built at the stable seam:

- **The partition + buffer.** At the `_groupedKeysDirty` recompute (`group.ts:249-254`), in ADDITION to `computeGroupedKeys`, build the SoA partition: walk `_groupedKeys`, classify each key NUMERIC (every component a `isNumericUnit` `ValueUnit<number>`) or BOXED, record each numeric key's `Float64Array` offset (multi-component leaves span contiguous slots — a `translate3d` leaf is length 3), allocate `_compositeBuf: Float64Array` of the total numeric width ONCE per structural change (NOT per frame), plus `_compositeContributed: Uint8Array` (the per-frame contribution bitmask). The mixed-leaf case (numeric in one child, non-numeric in another) classifies BOXED (the K3 partition discipline). On the post-fold write-back, copy `_compositeBuf[offset..offset+len]` into the boxed leaves' `.value` slots ONCE per frame (one strided copy).
- **The fold over `add`/`weighted` ONLY** (the `replace` default is untouched):
  - **`add`** — `_compositeBuf[i] += incomingN[i]` (UN-CLAMPED, the `group.ts:300-301` semantic preserved naturally by the typed accumulate) + the contribution bit OR'd.
  - **`weighted`** — `_compositeBuf[i] = lerp(_compositeBuf[i], incomingN[i], w)` with `w = layer.weightSpring?.value ?? layer.weight` hoisted ONCE per layer (the K.W11 PHYS-C scalar, `group.ts:335` — the overshoot-1.0 spring weight unchanged).

After the layer loop, the write-back copies `_compositeBuf` into the boxed destination leaves; the post-blend compaction reads the contribution bitmask (an uncontributed numeric key reads back "undefined" — the `group.ts:368-375` drop preserved). The non-numeric tail (color/computed/string) walks the existing per-element boxed path UNCHANGED.

**Constraint (observable-truth — the blend result is byte-exact; KISS).** The transposition changes the ARITHMETIC SUBSTRATE (boxed per-channel → contiguous typed fold) for `add`/`weighted` ONLY, NEVER the blend's OBSERVABLE result. `proof:blend` (`package.json:84` — `scripts/proof-blend.mjs` + `test/blend.test.ts`; the compositor corpus `test/group.test.ts` + `test/iw0-cube-composite.test.ts`) is the oracle: the SoA blend's serialized output must be byte-equal to the boxed blend's over the `add`/`weighted` corpus. The un-clamped `add` and the spring-overshoot `weighted` are preserved exactly. No new approximation, no clamp, no reordering. KISS: the SoA buffer is a contiguous `Float64Array` + an offset map + a contribution bitmask, indexed by the layout that already exists.

**Gate bite.** `proof:soa-composite` `blend-equal` clause (active ONLY when the spike is chartered): the SoA blend output `deepEquals` the boxed blend output over the `add`/`weighted` corpus. BITE: the SoA `add` accidentally clamps (`Math.min(1, …)`) → `0.8+0.8` reads `1.0` not `1.6` → `blend-equal` reds. On a KILL verdict (spike not built) this clause is INERT — there is no SoA path to compare.

---

### S3 — `proof:soa-composite` born-RED: the PORTABLE bench + the ADOPT/KILL decision-JSON (the keystone)

**Breach.** No `proof:soa-composite` gate exists (`ls scripts/proof-soa-composite.mjs` → no file; `grep soa-composite package.json` → none). The compositor blend has never been measured on its OWN path, and there is no terminal home for the ADOPT/KILL verdict. A DEMOTE-TO-SPIKE with no decision-JSON gate is an open-ended deferral.

**Cure.** Author `scripts/proof-soa-composite.mjs`, the born-RED gate over S1's `bench/group-composite.bench.ts`, via P.W1's `ratioGate` (`scripts/lib/portable-perf.mjs` — the same-report device-independent ratio):

1. **measured-first (S1's verdict).** The bench measures `transformFramesGrouped`'s three arms separately and writes `scripts/soa-composite-decision.json` with the per-arm ratio + a `$comment` scoping the ratio to `transformFramesGrouped`. The `add`/`weighted` arms' `floorFraction = 1.2` is the CHARTER GATE for S2: ADOPT (≥1.2×) authorizes the spike; KILL (<1.2×) forbids it and records the falsification. This is the MEASURE-FIRST discipline — the engine code is chartered by the bench, not the other way around.
2. **blend-equal + alloc-count (only IF the spike is chartered).** If S2 lands: `proof:blend` byte-equality over the `add`/`weighted` corpus + a heap-delta probe (`--expose-gc` + `process.memoryUsage` delta, the `proof:zero-alloc` shim, `package.json:61,63`) confirming ZERO per-frame `Float64Array` alloc (the buffer allocated once at `_groupedKeysDirty`, reused — the F.W4 zero-alloc discipline).

**Constraint (PORTABLE, ratio-normalized — the owner mandate).** Every ratio is SAME-REPORT (numerator and denominator measured in the same pass — device-independent BY CONSTRUCTION), routed through `declarePosture` per P.W1's `ratioGate`. The absolute hz survives ONLY as an observe-only note. The alloc-count arm is DETERMINISTIC (an alloc count, not wall-clock — HARD everywhere). No absolute `floorHz` is a HARD predicate (the K3 portability spine).

**Gate bite.** `node scripts/proof-soa-composite.mjs` → exit 1 today (the bench suite absent, the decision JSON absent). After S1 lands: the per-arm ratio is recorded and the `$comment` scopes it to `transformFramesGrouped`. After S2 (if chartered): the decision records ADOPT (≥1.2×) or KILL (<1.2×), the alloc-count arm confirms zero per-frame `Float64Array` alloc, and `proof:blend` confirms byte-exactness. BITE: a decision-JSON that ADOPTs the spike on the transplanted 3.86× (not a `transformFramesGrouped`-measured ratio) → the `$comment`-scope assertion reds.

---

### S4 — the computed-unit composite-key: kf-side MEASURE-FIRST OBSERVE-ONLY (NOT dispatched)

**Breach (NONE that warrants a sibling edit).** The value.js C1 computed-unit cache (`value.js/src/units/interpolate.ts:38-67`) keys the steady-state fast-path on TWO cheap integer compares (`cache.target !== target` + `cache.epoch !== epoch`). The K1 composite-numeric-key idea was to fold them into ONE compare. But two cheap integer compares per frame are not a plausible bottleneck — there is no measured cost to cure.

**Cure (the CONTRIVANCE-AUDIT correction — keep it observe-only, do NOT dispatch).** The existing `bench/interp-buffer.bench.ts` "calc() leaf · 600-frame steady window (C1 endpoint memo)" arm (`taxonomy.json`) STAYS `observe-only`: a watched number, NO budgeted floor, NO `crossRepo` tag, NO value.js dispatch packet. kf does NOT ask value.js to fold the cache key — that would be chartering a sibling edit on an unmeasured premise (a speculative micro-opt). If a FUTURE bench ever shows the two-compare key is a real per-frame cost, the composite-key is RE-OPENED then — measured-need-first.

**Constraint (measure-first, single-path — no speculative dispatch).** The composite-key is NOT in `KF-TO-VALUEJS-P.md`'s dispatch roster and NOT in any `crossRepo[]` budgeted array. kf owns ONLY the observe-only bench. This honors the smallest-grounded-change discipline: no public API / no sibling ask without a measured need.

**Gate bite.** `proof:bench-taxonomy` `observe-only` clause: the `calc()` leaf arm is tagged `observe-only` (a watched number) — NOT budgeted, NOT `crossRepo`. BITE: a future edit that silently graduates this arm to a budgeted `crossRepo` floor (re-introducing the speculative dispatch) without a measured-need record → the observe-only-tag assertion reds.

---

## Born-RED gate

**Gate:** `proof:soa-composite` (NEW — `scripts/proof-soa-composite.mjs`, the MEASURE-FIRST compositor-blend bench + the ADOPT/KILL decision-JSON gate via P.W1's `ratioGate`) + `proof:blend` (EXISTING — the byte-exact blend oracle, `package.json:84` — `scripts/proof-blend.mjs` + `test/blend.test.ts`; corpus `test/group.test.ts` + `test/iw0-cube-composite.test.ts`; active ONLY when the spike is chartered) + the EXTENDED `proof:bench-taxonomy` (the `group-composite` scenario class + the `calc()`-leaf observe-only arm). Born-RED on today's tree, before any bench suite / decision JSON exists.

**The REAL observable per arm (observable-truth — each bites the genuine breach, not a source-grep proxy).**

| Arm | The REAL observable the gate bites | Born-RED witness on today's tree |
|-----|-------------------------------------|------------------------------------------------|
| S1 measured-first (**FIRST step**) | `transformFramesGrouped`'s three arms have NEVER been benched separately; the SoA charter rests on the transplanted 3.86× | `bench/group-composite.bench.ts` ENOENT + `scripts/soa-composite-decision.json` ENOENT → no `transformFramesGrouped`-scoped measurement exists → RED |
| S2 blend-equal (**oracle — only if chartered**) | the SoA blend output DIFFERS from the boxed blend over the `add`/`weighted` corpus (a clamp slipped in, a multi-component leaf mishandled) | the SoA path does not exist; if S1 charters the spike and it lands, `proof:blend` reds the instant the SoA `add` clamps or a hue channel is mishandled. On a KILL verdict this clause is INERT |
| S3 decision-JSON scope (**KEYSTONE**) | the decision-JSON ADOPTs the spike on the transplanted 3.86×, NOT a `transformFramesGrouped`-measured `add`/`weighted` ratio ≥1.2× | `scripts/soa-composite-decision.json` ENOENT → no ADOPT/KILL verdict scoped to `transformFramesGrouped` exists → RED |
| S3 alloc-count (**only if chartered**) | a fresh `Float64Array` ALLOCATED per group draw frame (the buffer not reused) | the SoA buffer does not exist; if chartered, a per-frame alloc (buffer rebuilt every frame instead of at `_groupedKeysDirty`) → the heap-delta probe reds. INERT on a KILL verdict |
| S4 observe-only (**no dispatch**) | the `calc()`-leaf composite-key arm is silently graduated to a budgeted `crossRepo` floor (re-introducing the speculative value.js dispatch) without a measured-need record | the arm is `observe-only` today (correct); the gate asserts it STAYS observe-only — RED if a speculative budgeted/dispatch graduation slips in |

**The portability spine (the owner mandate — PORTABLE perf gate, ratio-normalized).** Every ratio is a SAME-REPORT device-INDEPENDENT measurement (numerator and denominator measured on the same runner in the same pass — the E24 gold standard, via P.W1's `ratioGate`). The absolute wall-clock magnitude survives ONLY as an `observe-only` note, NEVER as a HARD CI predicate (the device-dependence-greening lesson — a gate that passes on macOS cannot flake RED on the slow Linux runner for a device reason). The alloc-count arm is DETERMINISTIC (it counts `Float64Array` allocations, not timing — HARD everywhere; active only if the spike is chartered). The blend-equal oracle is device-INDEPENDENT (byte-equality, not timing — HARD everywhere; active only if chartered). No absolute `floorHz` is a HARD predicate.

**How each is born-RED (plant-a-failure).** S1 reds because `bench/group-composite.bench.ts` + the decision-JSON are absent — `transformFramesGrouped`'s `add`/`weighted` arms have NEVER been measured on their own path. S3 reds because the decision-JSON is absent (no `transformFramesGrouped`-scoped ADOPT/KILL verdict); after S1 lands, a decision-JSON that cites the transplanted 3.86× instead of a measured `add`/`weighted` ratio reds the `$comment`-scope assertion. S2/blend + S3/alloc-count are INERT until the spike is chartered; if chartered, S2/blend reds the instant a planted SoA `add` clamps (`0.8+0.8` reads `1.0` not `1.6`), and alloc-count reds on a planted per-frame `Float64Array` alloc. S4 reds if the `calc()`-leaf arm is speculatively graduated to a budgeted `crossRepo` dispatch without a measured need. Each born-RED witness is the REAL runtime observable measured live — never a source grep that a stub could green.

**Green condition.** `bench/group-composite.bench.ts` measures `transformFramesGrouped`'s default `replace` + `add`/`weighted` arms SEPARATELY and writes `soa-composite-decision.json` with a `$comment` scoping the ratio to `transformFramesGrouped` (S1 — the FIRST step, MEASURE-FIRST); `proof:soa-composite` records the per-arm verdict and gates the S2 spike on the `add`/`weighted` arms clearing `floorFraction ≥ 1.2` (S3 — ADOPT charters the spike, KILL forbids it and records the falsification). IF chartered: the SoA fold over `add`/`weighted` lands with `proof:blend` byte-exact + zero per-frame `Float64Array` alloc; the default `replace` path stays untouched (already dispatch-free). The computed-unit composite-key arm stays observe-only kf-side — NOT dispatched (S4). The outcome is a MEASURED decision: the `add`/`weighted` boxed-AoS cost is either cured by the spike (if it pays ≥1.2×) or shipped as-is (if the bench falsifies the win) — never an unmeasured engine edit on a transplanted number.

---

## Dependencies

- **P.W1 apparatus — sequenced BEFORE (the Band ordering).** P.W2's `proof:soa-composite` CALLS P.W1's `ratioGate` (`scripts/lib/portable-perf.mjs`) for the same-report per-arm ratio + graduates the `group-composite` scenario class P.W1 S2 added to the taxonomy. Without P.W1 the bench has no portable born-RED gate (`P.md:175` "Band A lands FIRST").
- **`computeGroupedKeys` + `_groupedKeys` + `_groupedKeysDirty` — already shipped** (`group-layer-springs.ts:131`, `group.ts:119,249`). IF the spike is chartered, the SoA partition is built at the EXISTING structural-change seam; the key-stability invariant the fold needs already exists. NO new library surface, NO new value.js edge.
- **`proof:blend` — already shipped** (`package.json:84` — `scripts/proof-blend.mjs` + `test/blend.test.ts`; the compositor corpus `test/group.test.ts` + `test/iw0-cube-composite.test.ts`). The byte-exact blend oracle is the regression authority IF the spike lands; the SoA transposition adds NO new oracle — it RIDES the existing one (the blend result must be unchanged).
- **The 3.86× LIGHT precedent — TRANSPLANTED, NOT admissible here** (`spring-vector-decision.json`, the `SpringProgress.setTargets` `Float64Array`+`lerpArray` ratio). It measures a DIFFERENT path; it is DROPPED as this wave's justification. The ONLY admissible evidence is S1's `transformFramesGrouped`-scoped bench — MEASURE-FIRST, no transplant.
- **The computed-unit composite-key — NOT dispatched (CONTRIVANCE-AUDIT).** Two cheap integer compares per frame are not a plausible bottleneck. The `calc()` leaf arm stays kf-side observe-only; NO `KF-TO-VALUEJS-P.md` ask, NO `crossRepo[]` budgeted arm. No sibling edit on an unmeasured premise.
- **Independent of P.W3 (the `_styleOut` out-buffer) and every Band-C/D/E wave.** File surfaces: `bench/group-composite.bench.ts` (NEW — the FIRST step), `scripts/proof-soa-composite.mjs` (NEW), `scripts/soa-composite-decision.json` (NEW — the durable verdict + the `$comment` scope), `bench/taxonomy.json` (the scenario class graduation); IF the spike is chartered, `src/animation/group.ts` + `src/animation/group-layer-springs.ts` (the SoA partition + fold over `add`/`weighted`). No collision with P.W3's `utils.ts` `_styleOut` seam (a SEPARATE file + gate).
- **NO glass-ui publish dep, NO value.js publish dep, NO parse-that dep.** The compositor bench + the (gated) SoA fold are entirely kf-internal; the computed-unit composite-key is NOT dispatch-coupled (observe-only).

---

## dev→impl boundary

This file is the Tranche P DEVELOPMENT spec for P.W2 — DOCS ONLY. It writes zero engine/demo/library source (inv-16: kf writes only keyframes.js; and the computed-unit composite-key is NOT dispatched — no foreign-tree ask at all). The IMPLEMENTATION opens only on the owner's explicit authorization, and even then it is STAGED: S1 (the bench + decision-JSON scaffold) lands FIRST; the S2 SoA fold over `add`/`weighted` is a DEMOTE-TO-SPIKE chartered ONLY by S1's `transformFramesGrouped`-measured verdict (≥1.2× on the `add`/`weighted` arms). When the impl opens it is gate-first (`proof:soa-composite` authored born-RED + the `bench/group-composite.bench.ts` baseline recorded BEFORE any SoA fold lands — MEASURE-FIRST, ADOPT-or-KILL), observable-truth (the per-arm ratio + the alloc-count + the byte-exact `proof:blend` oracle over the REAL blend, not a source grep), no-legacy (IF the spike charters, the boxed dispatch DELETED from the `add`/`weighted` numeric path — the default `replace` path and the non-numeric tail keep their existing paths, not kept beside as dead parallel), KISS (the SoA buffer is a contiguous `Float64Array` + an offset map + a contribution bitmask, indexed by the layout that already exists), measurement-honesty (the transplanted 3.86× is DROPPED; the only admissible justification is a `transformFramesGrouped`-scoped bench; the default `replace` arm is acknowledged dispatch-free and untouched), and P-invariant-28 (the SoA-composite verdict gets a durable `soa-composite-decision.json` terminal home with a `$comment` scoping the ratio to `transformFramesGrouped` — ADOPT charters the spike, KILL forbids it and records the falsification; no unproven engine code).

---

## Bite — what regression each clause catches

| Clause | Regression it prevents |
|--------|------------------------|
| S1 measure-first | The SoA engine edit is chartered on the transplanted 3.86× (a different path — `SpringProgress.setTargets`) instead of a `transformFramesGrouped`-scoped bench — building on an unmeasured premise; OR the default `replace` arm is wrongly characterized as megamorphic AoS (it is a dispatch-free reference-assign) |
| S2 demote-to-spike | The SoA fold over `add`/`weighted` is built BEFORE the bench charters it (S1 KILL ignored) — an aggressive engine edit ships without clearing the 1.2× bar; OR the default `replace` path is needlessly touched (it has nothing to win) |
| S2 blend-equal (oracle, if chartered) | The SoA fold is faster but WRONG — a clamp slips into `add` (`0.8+0.8` reads `1.0` not `1.6`), a multi-component leaf is mis-strided, or a spring-overshoot `weighted` weight is mishandled — and `proof:blend` (`test/blend.test.ts` + the `test/group.test.ts`/`test/iw0-cube-composite.test.ts` corpus) does not catch it because the SoA path bypassed the oracle |
| S3 decision-JSON scope (keystone) | The decision-JSON ADOPTs the spike on the transplanted 3.86× instead of a `transformFramesGrouped`-measured `add`/`weighted` ratio — the falsify-first mandate unmet; OR the gate hardcodes an absolute `floorHz` that flakes RED on the slow runner for a device reason |
| S3 alloc-count (if chartered) | The SoA path allocates per-frame (the buffer not reused across frames) — a zero-alloc regression on the group draw path the heap-delta probe must catch deterministically |
| S4 no-dispatch | The computed-unit composite-key is speculatively dispatched to value.js (a sibling edit on an unmeasured premise — two cheap integer compares are not a bottleneck), OR the observe-only `calc()` leaf arm is silently graduated to a budgeted `crossRepo` floor without a measured-need record |

---

## Excluded from this wave

- **The `_styleOut` out-buffer (P.W3 S2)** — that is P.W3 (a SEPARATE `utils.ts` seam + gate). P.W2 is ONLY the AnimationGroup compositor-blend bench + the (gated) SoA fold + the computed-unit composite-key observe-only bench.
- **Extending SoA to `CSSKeyframesAnimation.processFrame`** (the K3 single-animation per-frame SoA — `AUDIT-DIGEST.md` K3 "extend SoA to processFrame for pure-numeric segments") — a SEPARATE single-animation transposition (the interp-buffer arm O.W8 benches, the J.W6 S2 prototype). P.W2 is the GROUP COMPOSITOR (`transformFramesGrouped`), the multi-animation path — a distinct seam from the per-animation `processFrame`.
- **Dispatching the computed-unit composite-key to value.js** — NOT done (CONTRIVANCE-AUDIT). Two cheap integer compares per frame are not a plausible bottleneck; folding the cache key is a speculative micro-opt with no measured need. The `calc()` leaf arm stays kf-side observe-only; if a future bench ever shows a real cost, the composite-key is re-opened then — measured-need-first.
- **A SoA fold over the default `replace` arm** — pointless: `replace` (`group.ts:289-294`) is a bare reference-assign, already dispatch-free. The SoA fold, IF chartered, touches ONLY the `add`/`weighted` arms.
- **The non-numeric (color/computed/string) leaf blend** — kept on the existing boxed per-element path UNCHANGED. The SoA fold covers the PURE-numeric leaf subset only (the mixed-leaf case classifies BOXED — the K3 partition discipline). A color-channel SoA is the K3 `lerpColorValue` Float64 plan idea (a value.js-side `ColorChannelPlan` consume), not this wave.
- **The WAAPI maximalism arms** (color densify, computed px-bake — `AUDIT-DIGEST.md` K1 novelIdeas) — those lift whole animation classes onto the compositor thread; a separate frontier from the rAF-path SoA compositor fold. Not this wave.
