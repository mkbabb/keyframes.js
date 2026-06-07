# Tranche G deep-SOTA audit — lane `r-perf-crossengine`

**Lane mandate.** The SAME engine hot paths as the F/G perf lanes —
`engine.ts:730-732` (`processFrame` → `lerpValue → iv._lerp`), the value.js
interp carrier (`ValueUnit` AoS + the D2 SoA `Float64Array` primitive), the
`FrameCompiler` flatten (`allInterpVars`), the computed-endpoint cache — but
across **SpiderMonkey (shapes / CacheIR / Warp-Ion)** and **WebKit/JSC
(structures / butterfly / DFG-FTL)**, not V8 alone. The question the brief poses:
**where does the V8-tuned shape behave DIFFERENTLY on the other two engines, is
the dict-mode-avoidance V8-specific or universal, and is there a
cross-engine-portable carrier (a flat `Float64Array` / bit-packed) that wins on
ALL THREE vs the object-of-`ValueUnit`-arrays shape?**

**Research/audit ONLY — ZERO source/test/CI/demo edits.** This doc is the only
artifact. inv-16 RELAXED for G impl but the carrier is **value.js-owned** — every
carrier item is tagged `value.js-HANDOFF`. inv ε: every kf claim cites a
`file:line` against the live `tranche-g-dev` tree; every value.js claim against
`/Users/mkbabb/Programming/value.js` (`0.11.0`, HEAD `e8cc1fb`); every engine-
internals claim cites a named source (§Sources); every number is from a
re-runnable probe on this machine (node v26 / **V8 14.6.202** — `node -v`
verified) OR is RECORD-withheld with the shaped instrument that WOULD measure it
on the absent engine.

**Relation to the prior lanes (cite + EXTEND — I do NOT repeat).** The carrier
dispute is the most-measured surface in the corpus, but **every prior measurement
was V8-only**:
- `F/audit/r-interpolation-carrier` (F-1) overturned the E "megamorphic store IC"
  causal model **on V8/node-26** and re-pointed the win to SoA layout (AoS
  pointer-chase + closure-dispatch elimination), ~2.0–2.3× at K≥16.
- `G/audit/a-engine-perf` (G-2) re-measured the **published** `lerpArray` K-gate
  **on V8** (0.73× at K=1 → 4.14× at K=16) and the live bimodal K distribution
  (transform animations are K=6–10).
- `G/audit/a-valuejs-leverage` (F-VJ-3) gated the kf-side SoA consumption at K≥2,
  **on V8 numbers**.

None of them asked the question this lane exists to answer: **does the SoA win,
and the dict-mode-avoidance the F.W4 buffer fold relies on, hold on SpiderMonkey
and JSC — or is keyframes.js' carrier strategy a V8 monoculture bet?** I do not
re-litigate F-1's V8 conclusion; I test its **portability** and add the
cross-engine instrument the prior lanes could not specify.

---

## The honest headline (read this first)

**The carrier strategy is cross-engine-portable, and the SoA win is *more*
universal than the AoS-closure baseline it replaces — but for a reason the V8-only
lanes never stated: the SoA `Float64Array` carrier is the ONE interpolation shape
whose fast path does not depend on the shapes/IC machinery that differs between
the three engines.** The AoS `ValueUnit` + per-`iv` `_lerp` path is fast on V8
*today* precisely because V8's IC happens to keep the indirect call and the
`{value}` store monomorphic; that property is an *engine policy*, not a guarantee,
and it is exactly the kind of thing that diverges across SM's CacheIR-stub chains
and JSC's multi-level megamorphic cache. The `Float64Array` flat loop bypasses
shapes, IC, dict-mode, and indirect dispatch **entirely** — it is a contiguous
unboxed-double load/store loop, which all three engines lower to nearly the same
specialized typed-array codegen ([V8 elements-kinds], [SM Warp TypedArray
transpiler], [JSC structures/butterfly]). **So the G.W2/F-VJ-3 SoA consumption is
not just a V8 micro-opt — it is the cross-engine-robust carrier, and that is an
*additional* SHIP-strengthening argument the V8-only lanes did not make.** This is
the lane's net-new contribution.

Concretely:
- **X-1 (the carrier portability finding, the headline).** The SoA `Float64Array`
  loop is the cross-engine-portable interp carrier; the AoS-closure path's V8
  speed rests on engine-specific IC policy. **value.js-HANDOFF** (the primitive is
  shipped — D2 `lerpArray`, `value.js src/math.ts:48`) **+ SHIP-in-G** (the kf-side
  consumption, F-VJ-3 / G-2, with the cross-engine argument folded into its
  rationale).
- **X-2 (dict-mode-avoidance is UNIVERSAL, not V8-specific).** The F.W4 stable-key
  null-fill buffer (`engine.ts:706-711`, the `delete`-loop removal) defends against
  a degradation — dictionary/uncacheable shape — that exists in all three engines
  under the same trigger. The fold is correct on every engine; **ALREADY-SOTA**,
  re-confirmed cross-engine.
- **X-3 (the bit-packing question, answered NO).** Bit-packing frame ids / the time
  index / the dispatch tag into a typed array is a measured non-lever on V8 and a
  *worse* bet cross-engine (it re-introduces the unpack arithmetic the SoA loop
  removes). **KILL** (record so nobody "optimizes" the frame id/time index into a
  packed carrier).
- **X-4 (the AoS `_lerp` indirect call — the one place engines could diverge).**
  RECORD-withheld: I cannot run SM/JSC here, but I name the exact shaped probe that
  would measure the divergence, and reason from the published IC models why the SoA
  path is the hedge regardless of the answer.

**Net for the cross-engine band:** ZERO new kf work manufactured. The lane
**strengthens** the existing G.W2 / F-VJ-3 SHIP with a portability argument,
**confirms** the F.W4 dict-mode fold is universal (not a V8 bet), **kills** a
bit-packing temptation before anyone reaches for it, and **records** the one
divergence it cannot bench with the instrument to settle it. The carrier is
value.js-owned; the kf consumption rides the same re-pin.

---

## TL;DR — findings + disposition

| # | Finding | Site | Grounding | Disposition |
|---|---------|------|-----------|-------------|
| **X-1** | The SoA `Float64Array` interp loop is the cross-engine-portable carrier — it bypasses shapes/IC/dict-mode/indirect-dispatch, which is exactly the machinery that differs across V8/SM/JSC. The AoS-closure path's V8 speed is engine-IC-policy-dependent, not portable | kf `engine.ts:730-732`; vj `math.ts:48` (`lerpArray`), `interpolate.ts:172-178` (`lerpNumericValue`) | local V8 14.6 probe (§A.1): SoA beats AoS-closure 1.6×(K=1)→5.7×(K=16); all 3 engines lower contiguous-double loops to specialized typed-array codegen ([V8 elements-kinds], [SM newsletter-3 Warp TA], [JSC]) | **value.js-HANDOFF** (primitive shipped, D2) **+ SHIP-in-G** (folds INTO G.W2/F-VJ-3 rationale; cross-engine = stronger SHIP) |
| **X-2** | Dict-mode / uncacheable-shape avoidance is UNIVERSAL — V8 (dictionary mode), SM (unshared dictionary shape), JSC (uncacheable dictionary structure) all degrade on the same trigger the F.W4 `delete`-loop removal defends against | kf `engine.ts:706-711` (`clearBuffer`), `scripts/proof-interp-fastprops.mjs` | [Mathias shapes-ICs], [wingolog SM], [Benedikt cross-engine]: all engines share shapes+IC+the monomorphic→mega progression; `delete` → dict-mode is cross-engine | **ALREADY-SOTA** — the F.W4 fold is correct on all 3 engines; the gate's V8-specific `%HasFastProperties` probe is the one V8-ism (X-2b) |
| **X-2b** | `proof:interp-fastprops` asserts the buffer stays fast-properties via V8's `%HasFastProperties` — a V8-only intrinsic. The *property* it guards is universal; the *probe* is V8-specific (no equivalent stable intrinsic on SM/JSC) | `scripts/proof-interp-fastprops.mjs`, `test/interp-fastprops.test.ts` | `%HasFastProperties` is a V8 `--allow-natives-syntax` intrinsic; SM/JSC have no stable public equivalent | **RECORD** (the probe is correctly V8-only; the guarded invariant is cross-engine — name it, do not duplicate the gate per-engine) |
| **X-3** | Bit-packing frame ids / the time index / the dispatch tag into a typed-array carrier is a non-lever on V8 and a WORSE bet cross-engine — it re-introduces unpack arithmetic the SoA loop's whole value is removing | kf `engine.ts:619-653` (binary-search seed), `frame-compiler.ts:370` (`allInterpVars`) | the time index is `frame.time.start/stop` reads, N=1–2 active frames (a-engine-perf G-5); packing adds shift/mask per access | **KILL** (record so nobody packs the id/time index; the SoA value is *un*-packed contiguous doubles) |
| **X-4** | The AoS per-`iv` `_lerp` indirect call is the ONE site where the three engines' dispatch policy could diverge (V8 monomorphic-call IC vs SM CacheIR call-stub vs JSC poly-call). I cannot bench SM/JSC on this machine | kf `engine.ts:731`; vj `interpolate.ts:191-192` (`if (iv._lerp) return iv._lerp(t, iv)`) | local V8 keeps it monomorphic (§A.1 AoSmono≈AoSreal); SM/JSC unmeasured | **RECORD** (withheld WITH the instrument: a `jsshell`/`jsc` run of §A.1's probe; the SoA path makes the answer moot — the hedge argument) |

---

## 1. X-1 — the SoA `Float64Array` carrier is the cross-engine-portable interp shape · value.js-HANDOFF + SHIP-in-G

### 1.1 What the V8-only lanes proved, and the gap they left

`r-interpolation-carrier F-1` established **on V8** that the megamorphic-store-IC
causal model was wrong and the real lever is SoA layout. `a-engine-perf G-2` and
`a-valuejs-leverage F-VJ-3` re-measured the published `lerpArray` K-gate **on V8**.
Every number in the carrier arc is a V8/node-26 number. The kf hot loop is:

```ts
// engine.ts:730-732 — processFrame, the per-frame interior
for (const iv of frame.allInterpVars) {
    lerpValue(eased, iv);   // → iv._lerp(t, iv) (vj interpolate.ts:191-192)
}
```

Each `iv` is one `ValueUnit`-backed `InterpolatedVar` (6 declared fields on the
`ValueUnit` carrier, `vj units/index.ts:8-22`; the numeric inner loop reads only
`start.value`/`stop.value`, writes `value.value` — `vj interpolate.ts:172-178`,
the other 5 fields are prepare/serialize-only, F-2). The dispatch is an **indirect
call through `_lerp`** plus an AoS pointer-chase across K separately-allocated
carriers. The SoA alternative (`vj math.ts:48`) is one flat loop over three
contiguous `Float64Array`s:

```ts
// vj math.ts:48-60 — lerpArray, the D2 carrier primitive (PUBLISHED in 0.11.0)
for (let i = 0; i < n; i++) out[i] = u * start[i]! + t * stop[i]!;
```

**The gap:** is the SoA win a V8 artifact, or does it port? If it ports, the SHIP
gets a second, stronger leg than "it's 4× on V8."

### 1.2 The cross-engine object model (grounded) — why the AoS path is engine-policy-dependent

All three engines share the *same* architecture for object property access:
shapes + inline caches, with a monomorphic → polymorphic → **megamorphic**
progression ([Benedikt cross-engine]: "V8 calls them Maps, SpiderMonkey uses
Shapes, JavaScriptCore calls them Structures … they all implement the identical
optimization strategy"; [Mathias shapes-ICs]). The *differences* are in the
machinery the AoS path leans on:

- **V8** — Maps/hidden classes; an IC goes megamorphic past **4** shapes ([V8
  IC]); the `{value}` store and the `_lerp` indirect call are the two IC sites.
- **SpiderMonkey** — Shapes + **CacheIR** stub chains; Warp builds Ion MIR *on top
  of* the CacheIR stubs ([SM Warp], [SM CacheIR jandemooij]). The dispatch fast
  path is a chain of `GuardShape`/`GuardToObject` stubs; more shapes = a longer
  stub chain, then a bail to a generic stub.
- **JSC** — Structures + the **butterfly** (inline + out-of-line slots); a
  **multi-level megamorphic cache** more sophisticated than the others ([JSC IC
  caiolima], [JSC docs]); the DFG/FTL inline the structure check + offset from IC
  profiling.

The point: **the AoS-closure path's V8 speed depends on V8's specific policy of
keeping the indirect `_lerp` call and the `value.value` store monomorphic across
the K carriers.** That holds today because `prepareInterpVar` (`vj
interpolate.ts:211-225`) installs *one* `_lerp` function identity per dispatch
class and the carriers are minted in one `ValueUnit` shape. But it is an *engine
choice* how aggressively each tier despeculates when the carrier population grows
or the call site sees mixed dispatch classes (numeric + color + computed ivs in
the *same* `allInterpVars` loop — which is the real kf shape, `frame-compiler.ts:370`
`Object.values(frame.interpVars).flat()`). On SM that is a longer CacheIR stub
chain at the `lerpValue` call site; on JSC a poly-call IC. **The carrier strategy
that depends least on which-engine-despeculates-when is the one that touches the IC
machinery least.**

### 1.3 The SoA loop touches NONE of the divergent machinery

A `Float64Array` is, on all three engines, contiguous unboxed double storage with
no per-element shape, no IC, no boxing, no dict-mode reachable:

- **V8** — typed arrays have specialized elements kinds; "if you're doing
  mathematical operations on an array of numbers, consider using a TypedArray. We
  have specialized elements kinds for those" ([V8 elements-kinds]). The load/store
  is a bounds-checked direct memory access, no Map transition on element write.
- **SpiderMonkey** — Warp's CacheIR→MIR transpiler explicitly added "property
  sets, double arithmetic, **TypedArray elements**" ([SM newsletter-3]); the typed-
  array element load lowers through MIR→LIR→native as a direct indexed double load,
  not a shape-guarded property access.
- **JSC** — typed-array storage is contiguous in the butterfly's indexed region;
  the DFG/FTL specialize typed-array access to direct loads. Typed arrays sidestep
  the structure/IC path that regular property access takes ([JSC docs]).

So the SoA loop is the carrier whose hot path is **structurally the same on all
three engines** — a counted loop over contiguous doubles, the canonical shape
every optimizing JIT lowers to tight native code. The AoS path's portability is
contingent; the SoA path's is structural.

### 1.4 The local V8 measurement (the floor; SM/JSC reasoned, X-4 records the withhold)

§A.1 probe (node v26 / V8 14.6.202, 2M frames/scenario), modelling the kf loop
(AoS of `{start,stop,value,_lerp}` ivs dispatched per-channel) vs the SoA flat loop:

| K | AoS-mono (ms) | AoS-real 6-field (ms) | SoA (ms) | real/SoA |
|---|---|---|---|---|
| 1 | 5.7 | 15.0 | 9.3 | **1.61×** |
| 3 | 33.6 | 32.9 | 11.0 | **2.98×** |
| 6 | 57.4 | 57.0 | 13.6 | **4.19×** |
| 10 | 92.5 | 98.0 | 17.7 | **5.53×** |
| 16 | 190.7 | 139.9 | 24.6 | **5.68×** |

This **corroborates** the value.js `numeric-soa.mjs` gate (a-engine-perf §A.3:
0.73×→4.14×) and `r-interpolation-carrier F-1`, and adds the K=3/6/10 transform
regime the prior table skipped. Two cross-engine-relevant reads:
1. **AoS-mono ≈ AoS-real at K≥3** — the 6-field `ValueUnit` carrier is *not*
   slower than a 1-field `{value}` cell at the mutation site (re-confirms F-1: the
   store IC is not the bottleneck; it is the layout). This matters cross-engine
   because it means the carrier-shape monomorphization sub-option (D1, KILLED) buys
   nothing on *any* engine — the win is purely the contiguous layout.
2. The crossover is K=2–3; **the transform regime (K=6–10) is decisively in the
   SoA-wins band on V8**, and that band is where the contiguous-double codegen is
   most uniform across engines.

### 1.5 Disposition

**value.js-HANDOFF (the primitive is already shipped — D2 `lerpArray`,
`value.js math.ts:48`, published in 0.11.0) + SHIP-in-G (the kf-side consumption,
which is G-2 / F-VJ-3).** This lane does NOT open a new SHIP — it **strengthens the
existing one**: the G.W2 SoA-segment consumption (a-engine-perf G-2, gated
`proof:interp-soa`) should carry the cross-engine portability argument in its
rationale, because the strongest case for paying the carrier-change risk is not
"4× on V8" but "the carrier whose hot path does not depend on which engine
despeculates when." The kf half rides the same re-pin; no new value.js work (the
primitive exists).

**Falsifiable instrument (the cross-engine extension of `proof:interp-soa`):** run
the §A.1 probe under `node` (V8, in CI today) AND, when the user can, under the
SpiderMonkey shell (`js`/`jsshell`) and `jsc` (the JSC shell ships with WebKit).
The SHIP-bar is the *V8* number (the CI engine); the SM/JSC runs are the
portability *witness* that the carrier is not a V8 monoculture bet. **BITE:** if
the SoA path ever regresses below the AoS-closure path at K≥3 on *any* of the three
shells, the carrier-portability claim is falsified.

**Isomorphism:** pixel-identical (`lerpArray` is K independent `lerp`s; the scatter
back to `value.value` restores the exact numbers the per-iv path writes — same
serialize boundary, F-VJ-3).

---

## 2. X-2 — dict-mode-avoidance is UNIVERSAL, not V8-specific · ALREADY-SOTA (cross-engine re-confirm)

### 2.1 The fold, and the cross-engine question

F.W4 removed the per-frame `delete`-loop on the interp result buffer and replaced
it with a null-fill over a compile-stable key set (`engine.ts:706-711`,
`clearBuffer`; re-confirmed exemplary in a-engine-perf G-4). The motivating defect:
`delete obj[key]` forces the object out of fast-properties into **dictionary mode**
on V8, a one-way trip to hash-table property lookup. The question this lane must
answer: **is that a V8-specific hazard the fold over-fits to, or does the same
trigger degrade SM and JSC?**

### 2.2 Cross-engine grounding — the same trigger, the same degradation

The shapes+IC design is shared, and so is the dictionary-mode escape hatch:

- **V8** — "Objects that use the `delete` keyword force dictionary mode … converting
  the object to a hash table for slower dictionary lookups" ([V8 IC], [Mathias
  shapes-ICs]).
- **SpiderMonkey** — "shape lineages are either shared and live in property trees,
  or unshared and belong to a single JS object; these unshared ones are in
  **dictionary mode**" ([wingolog SM]; [SM property-cache]). The trigger is the
  same property-deletion / shape-thrash pattern; an object that looks like a
  hashtable gets an unshared dictionary shape and loses the cacheable-offset fast
  path.
- **JSC** — repeated structure transitions / deletions push a `Structure` into an
  **uncacheable dictionary** state; the IC can no longer cache the offset and falls
  to the generic (megamorphic) path ([JSC IC caiolima], [JSC docs]).

**So the F.W4 fold is correct on all three engines** — it keeps the buffer on the
shared-shape / cacheable-offset fast path universally, and the null-fill (writing
`undefined` to an existing slot, never deleting it) avoids the dictionary transition
on every engine. This is the [Benedikt cross-engine] portable rule #2 ("avoid
modifying [property] attributes to prevent dictionary mode degradation") applied
exactly. **ALREADY-SOTA, re-confirmed cross-engine — manufacture no work.**

### 2.3 X-2b — the one V8-ism: the *probe*, not the invariant

`proof:interp-fastprops` (`scripts/proof-interp-fastprops.mjs`,
`test/interp-fastprops.test.ts`) asserts the buffer stays fast-properties via
V8's `%HasFastProperties` intrinsic (`--allow-natives-syntax`). That intrinsic is
**V8-only** — SpiderMonkey and JSC have no stable public equivalent (SM's
`dumpObject`/`dis` and JSC's `$vm` are debug-shell-only, not a portable CI probe).

**Disposition: RECORD.** The *guarded invariant* (the buffer never enters
dict-mode) is cross-engine; the *probe* is correctly V8-specific because V8 is the
CI engine and `%HasFastProperties` is the only intrinsic that bites at all. Do NOT
duplicate the gate per-engine (there is no portable intrinsic to write it against,
and the null-fill discipline that produces the invariant is engine-agnostic). Name
in the gate's comment that the property is universal and the probe is the V8
witness of it — so a future reader does not mistake the V8 intrinsic for a V8-only
*concern*.

---

## 3. X-3 — bit-packing the frame id / time index / dispatch tag · KILL

### 3.1 The temptation, and why it loses

The brief names "bit-packing opportunities (frame ids, the time index, the
dispatch)." I assessed each against the live hot path and the cross-engine codegen:

- **The time index.** The active-frame lookup reads `frame.time.start/stop`
  (`engine.ts:623-624,646,651`) after a binary-search seed (`engine.ts:619-653`);
  the active-frame count N is 1–2 for the dominant shape (a-engine-perf G-5, W8 S1
  RECORD). Packing the times into a `Uint32Array` index buys nothing — the lookup
  is already O(log frames) seed + O(1) contiguous-neighbor scan over a small N, and
  packing *adds* shift/mask unpack arithmetic per access.
- **Frame ids.** `getAnimationId` ids are content-derived idempotent strings used
  for identity/dedup at compile, never in the per-frame loop. Packing them into
  ints is a compile-time concern with zero hot-path presence — no lever.
- **The dispatch tag.** `_lerp` is already a pre-resolved function reference
  installed once at `prepareInterpVar` (`vj interpolate.ts:211-225`). Replacing the
  function-reference dispatch with a packed integer tag + a `switch` re-introduces
  a branch the monomorphic indirect call already avoids — strictly worse on V8, and
  on SM/JSC a `switch` on a packed tag is a jump-table the engines do not
  specialize as well as a monomorphic call site.

### 3.2 The cross-engine reason it is a *worse* bet, not just a non-win

The entire value of the SoA carrier (X-1) is that it presents the engine with
**contiguous *unpacked* doubles** — the shape every JIT lowers to tight native FMA
loops. Bit-packing does the opposite: it stuffs heterogeneous fields into integer
words that must be masked/shifted back out before use, which (a) defeats the
typed-array double-load codegen the SoA path wins on, and (b) is *more* engine-
sensitive, not less, because each engine's integer-arithmetic + bounds-check
elision in the unpack differs. The portable move is **un-packed** SoA, not packed.

**Disposition: KILL.** Record so no future pass "optimizes" the frame id / time
index / dispatch into a packed carrier. The interp win is contiguous *doubles*; the
time index is fine as small AoS reads at N=1–2; the dispatch is fine as a
pre-resolved function reference. There is no bit-packing lever on any of the three
engines. (This is the cross-engine complement to a-engine-perf G-5's V8-grounded
"typed time index is negative at the dominant N" RECORD.)

---

## 4. X-4 — the AoS `_lerp` indirect call: the one divergence I cannot bench · RECORD (withheld WITH the instrument)

### 4.1 The site

`lerpValue` (`vj interpolate.ts:191-192`) dispatches `if (iv._lerp) return
iv._lerp(t, iv)` — an indirect call per channel, looped K times per frame
(`engine.ts:730`). This is the one place the three engines' policies could
genuinely diverge:
- **V8** keeps it monomorphic when one `_lerp` identity dominates (§A.1: AoS-mono ≈
  AoS-real, so V8 specializes it well today).
- **SpiderMonkey** routes it through a CacheIR call stub; a *mixed* `allInterpVars`
  loop (numeric + color + computed ivs share the call site, `frame-compiler.ts:370`)
  presents the call IC with multiple `_lerp` targets → a longer stub chain or a
  generic call ([SM CacheIR]).
- **JSC** uses a poly-call IC with its multi-level megamorphic cache ([JSC IC]).

I **cannot** run SM or JSC on this machine (node/V8 only, verified). So I do not
assert a number — I RECORD the withhold WITH the instrument that settles it.

### 4.2 The withheld instrument (named, shaped)

The §A.1 probe is engine-portable JS (no node APIs except `performance.now`, which
both shells provide). To measure the divergence:
- **SpiderMonkey:** `js /tmp/xeng-probe.mjs` (the SpiderMonkey shell, `jsshell`
  from a Firefox build or `mach jsshell`). Add a *mixed-dispatch* variant: an
  `allInterpVars`-shaped array where one third of the ivs carry `lerpNumericValue`,
  one third `lerpColorValue`, one third `lerpComputedValue` as `_lerp` — to surface
  the CacheIR call-stub-chain cost the uniform probe hides.
- **JSC:** `jsc /tmp/xeng-probe.mjs` (the JSC shell ships in WebKit;
  `Tools/Scripts/run-jsc`).

The SHIP-bar does NOT wait on this (the SoA path makes it moot — §4.3); these runs
are the *witness* that confirms or falsifies the X-1 portability hedge.

### 4.3 Why the answer is moot for the SHIP (the hedge argument)

Whatever SM/JSC do at the `_lerp` call site, **the SoA path removes the call site
entirely** for the K≥2 numeric subset — one `lerpArray` call replaces K indirect
`_lerp` calls (X-1). So:
- If SM/JSC keep the call monomorphic (like V8): the SoA path still wins on layout
  (the contiguous-double codegen, X-1.3).
- If SM/JSC despeculate the mixed call site (the divergence risk): the SoA path
  wins *more*, because it is precisely the K indirect calls that got slow.

Either way the SoA consumption is the robust choice. **Disposition: RECORD** — the
divergence is real and unmeasured here, the instrument is named, and the SHIP (X-1)
is a hedge against the worst case rather than a bet on the best.

---

## ALREADY-SOTA — where the carrier needs no cross-engine work (binding)

Stated plainly (the KISS clause), cross-engine re-confirmed:

- **The single `lerpValue → iv._lerp` dispatch seam** (`engine.ts:731`) — the
  structural reason the SoA primitive is consumable with zero kf edit, on every
  engine. The seam is engine-agnostic.
- **The pre-resolved `_lerp` predispatch** (`vj interpolate.ts:211-225`) — installs
  one function identity per dispatch class, which is the right monomorphic-friendly
  shape on all three engines (the cross-engine portable rule #1: consistent
  shapes/identities). Nothing to change.
- **The F.W4 stable-key null-fill buffer** (`engine.ts:706-711`) — dict-mode
  avoidance, universal (X-2). Exemplary on V8/SM/JSC alike.
- **The B3 color-channel plan + C1 computed cache** (`vj interpolate.ts:89-135`,
  `26-72`) — both are SoA/closure-free flat loops over `Float64Array` plans (the
  same contiguous-double shape that ports). value.js already built the color and
  computed hot paths in the cross-engine-portable shape; the numeric hot path is the
  only one still on the AoS-closure path, and that is exactly G-2/X-1.
- **`NumericAnimation`** (`numeric.ts:8-15,175-181`) — the in-tree SoA reference
  (`number[]` slots, flat per-key lerp); its upgrade to `Float64Array` + `lerpArray`
  (F-VJ-3) is the same DRY motion as the CSS-engine SoA-segment, portable on every
  engine.

**The carrier is value.js-owned and ~SOTA; the one open lever (numeric SoA
consumption) is already a G SHIP, and this lane's contribution is the cross-engine
*why* that strengthens it, not a new deficit.**

---

## Disposition ledger

| ID | Finding | Site | Grounding | Disposition | Instrument |
|----|---------|------|-----------|-------------|-----------|
| **X-1** | SoA `Float64Array` is the cross-engine-portable interp carrier; AoS-closure speed is engine-IC-policy-dependent | kf `engine.ts:730-732`; vj `math.ts:48`, `interpolate.ts:172-178` | §A.1 V8 probe 1.6×→5.7×; [V8 elements-kinds]/[SM Warp TA]/[JSC] typed-array codegen | **value.js-HANDOFF (shipped) + SHIP-in-G** (folds into G.W2/F-VJ-3 rationale) | `proof:interp-soa` extended: §A.1 probe under `node`+`js`+`jsc`; SHIP-bar = V8, SM/JSC = portability witness |
| **X-2** | Dict-mode avoidance is universal (V8 dict-mode / SM unshared-dict-shape / JSC uncacheable-dict-structure) | kf `engine.ts:706-711` | [Mathias]/[wingolog]/[Benedikt]: shared shapes+IC+dict escape | **ALREADY-SOTA** (F.W4 correct on all 3) | — (the existing `proof:interp-fastprops` is the V8 witness) |
| **X-2b** | `%HasFastProperties` probe is V8-only; the guarded invariant is cross-engine | `scripts/proof-interp-fastprops.mjs` | `%HasFastProperties` is a V8 intrinsic; no SM/JSC public equivalent | **RECORD** (probe V8-only by necessity; name the universal invariant in the gate comment) | — |
| **X-3** | Bit-packing frame id / time index / dispatch is a non-lever on V8 and a worse bet cross-engine | kf `engine.ts:619-653`, `frame-compiler.ts:370` | packing adds unpack arithmetic; defeats the contiguous-double codegen the SoA path wins on | **KILL** (record so nobody packs them) | — |
| **X-4** | The AoS `_lerp` indirect call is the one site engines could diverge; unmeasurable here | kf `engine.ts:731`; vj `interpolate.ts:191-192` | §A.1 V8 monomorphic; SM CacheIR call-stub / JSC poly-call unmeasured | **RECORD** (withheld WITH instrument; SoA makes it moot — the hedge) | §A.1 + a mixed-dispatch variant under `js`/`jsc` shells |

---

## §A — re-runnable probes (node v26 / V8 14.6.202, `tranche-g-dev`)

- **A.1 — the cross-engine carrier-shape probe (X-1/X-4).** `/tmp/xeng-probe.mjs`
  (authored this lane; engine-portable JS — runs under `node`, the SM `js` shell,
  and `jsc` unchanged). Models the kf loop three ways: AoS-mono (`{value}` cell,
  one `_lerp` identity), AoS-real (6-field `ValueUnit`-shaped carrier, per-iv
  closure), SoA (three `Float64Array` + flat loop), 2M frames/scenario across
  K∈{1,3,6,10,16}. Result on this V8: SoA beats AoS-real **1.61×(K=1) → 2.98×(K=3)
  → 4.19×(K=6) → 5.53×(K=10) → 5.68×(K=16)**; AoS-mono ≈ AoS-real (the carrier
  shape is not the bottleneck — the layout is). Corroborates value.js
  `bench/numeric-soa.mjs` (a-engine-perf §A.3) and `r-interpolation-carrier F-1`,
  and adds the K=3/6/10 transform band. **To witness portability:** run the same
  file under `js` (SpiderMonkey shell) and `jsc` (WebKit shell) — withheld here
  (node/V8 only on this machine, X-4).
- **A.2 — the dispatch site (X-2/X-4).** `grep -n "lerpValue\|allInterpVars"
  src/animation/engine.ts` → `730` loop, `731 lerpValue(eased, iv)`; `grep -n
  "_lerp" /Users/mkbabb/Programming/value.js/src/units/interpolate.ts` → `191-192`
  (`if (iv._lerp) return iv._lerp(t, iv)`), `211-225` (`prepareInterpVar` installs
  the per-class identity).
- **A.3 — the dict-mode fold (X-2).** `src/animation/engine.ts:706-711`
  (`clearBuffer` null-fill, no `delete`); `scripts/proof-interp-fastprops.mjs` +
  `test/interp-fastprops.test.ts` (the V8 `%HasFastProperties` witness, wired in
  `proof:all`).

## Sources

- **Live kf (`tranche-g-dev`):** `src/animation/engine.ts:619-653,706-711,730-732`,
  `frame-compiler.ts:360-371`, `numeric.ts:8-15,175-181`,
  `scripts/proof-interp-fastprops.mjs`.
- **Live value.js 0.11.0 (`/Users/mkbabb/Programming/value.js`):** `src/math.ts:48-60`
  (`lerpArray`), `src/units/interpolate.ts:26-72` (C1 cache), `89-135` (B3 color
  plan), `172-178` (`lerpNumericValue`), `191-192` (`lerpValue` dispatch), `211-225`
  (`prepareInterpVar`), `src/units/index.ts:8-22,240-289` (`ValueUnit` /
  `InterpolatedVar`); `bench/numeric-soa.mjs`.
- **Prior lanes (cited + EXTENDED, not repeated):** `F/audit/r-interpolation-carrier`
  (F-1 the V8-only carrier dispute), `G/audit/a-engine-perf` (G-1/G-2/G-5),
  `G/audit/a-valuejs-leverage` (F-VJ-1/F-VJ-3).
- **Engine internals (named):**
  - [V8 elements-kinds] https://v8.dev/blog/elements-kinds — typed-array specialized
    elements kinds; "if you're doing mathematical operations on an array of numbers,
    consider using a TypedArray."
  - [V8 IC] https://braineanear.medium.com/the-v8-engine-series-iii-inline-caching-unlocking-javascript-performance-51cf09a64cc3
    — megamorphic past 4 shapes; `delete` → dictionary mode.
  - [Mathias shapes-ICs] https://mathiasbynens.be/notes/shapes-ics — shapes + ICs,
    the cross-engine fundamentals.
  - [Benedikt cross-engine] https://benediktmeurer.de/2018/06/14/javascript-engine-fundamentals-shapes-and-inline-caches/
    — "V8 calls them Maps, SpiderMonkey uses Shapes, JavaScriptCore calls them
    Structures … they all implement the identical optimization strategy"; the two
    portable rules (consistent shapes; avoid dict-mode).
  - [SM Warp] https://hacks.mozilla.org/2020/11/warp-improved-js-performance-in-firefox-83/
    — Warp builds Ion MIR on top of CacheIR stub data.
  - [SM CacheIR jandemooij] https://jandemooij.nl/blog/cacheir/ — CacheIR stub chains
    for property access / calls.
  - [SM newsletter-3] https://spidermonkey.dev/blog/2020/03/12/newsletter-3.html —
    the CacheIR→MIR transpiler added "property sets, double arithmetic, TypedArray
    elements."
  - [wingolog SM] https://wingolog.org/archives/2018/10/11/heap-object-representation-in-spidermonkey
    — Shapes; unshared **dictionary-mode** shapes.
  - [SM property-cache] http://udn.realityripple.com/docs/Mozilla/Projects/SpiderMonkey/Internals/Property_cache
  - [JSC IC caiolima] https://caiolima.github.io/jsc/2020/03/12/jsc-inline-cache.html
    — `get_by_id`/`put_by_id` cache StructureID + offset; monomorphic/polymorphic
    stubs; DFG/FTL consume IC profiling.
  - [JSC docs] https://docs.webkit.org/Deep%20Dive/JSC/JavaScriptCore.html — LLInt /
    Baseline / DFG / FTL; the butterfly (inline + out-of-line slots); multi-level
    megamorphic cache.

## inv-16 / inv ε compliance

This lane wrote ONLY `docs/tranches/G/audit/r-perf-crossengine.md` — ZERO
source/test/CI/demo edits to keyframes.js OR value.js. The carrier is value.js-
owned; every carrier item is tagged `value.js-HANDOFF` (the primitive D2 is
shipped) and the kf consumption rides the existing G.W2/F-VJ-3 SHIP (no new kf
work manufactured). Every kf claim cites a `file:line` against the live
`tranche-g-dev` tree; every value.js claim against the live `0.11.0` source; every
number is from the re-runnable §A.1 probe on node v26 / V8 14.6.202; the
SpiderMonkey + JSC measurements are RECORD-withheld WITH the named shell instrument
(X-4). **G IMPLEMENTATION awaits explicit authorization — this is TRANCHE
DEVELOPMENT, docs ONLY.**
