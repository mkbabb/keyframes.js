# Tranche F deep-SOTA audit — lane `p-runtime-perf-F`

**Lane mandate.** RUNTIME / interpolation perf, DEEP. The lerp hot path
(`lerpValue → lerpComputedValue → getComputedValue`, the computed-unit DOM
round-trip = the real D-3 win, value.js-owned); the `ValueUnit` carrier
megamorphism; the zero-alloc discipline (group + standalone both zero-alloc
post-E; the **delete-loop deopt remains**); the shaped bench + the F disposition
(kf-side vs the value.js endpoint-cache + carrier handoff). **Quantify.**

**Research/audit only — ZERO source edits.** inv-16: value.js items are
hand-offs (keyframes proposes, never writes value.js). inv ε: every keyframes
claim is `file:line`-grounded; every number is from a **re-runnable node v26 /
V8** probe, and where I run the *live engine* I say so. Branch: `tranche-e-impl`.

**Relation to the sibling F lanes (cite + diff — I do NOT repeat them).** Three
sibling lanes already worked this band hard; my distinct contribution is the
**live engine** measurement none of them ran, plus the honest **reconciliation
of the carrier dispute** between two of them.

- **`r-v8-cost-model.md`** (F-1/F-2) ran a *standalone synthetic mirror* of
  `interpFrames` with `%HasFastProperties`, proved the delete-loop dict-mode
  deopt (3.8–6.2× at K=2–12), and ranked it SHIP-in-F. **I reproduce the
  mechanism on the ACTUAL `CSSKeyframesAnimation.interpFrames`** (not a mirror):
  §1 observes the *live* `out` buffer, the *live* group `_grouped`, and *every*
  live `entry.values` in dictionary mode, and surfaces the regression the
  synthetic mirror cannot — **the W7 threaded-buffer path is 4–5.75× slower than
  the `{}`-default the bench measures** (§1.2). The optimization regressed the
  thing it optimized; only the live engine shows it.
- **`a-runtime-remeasure.md`** (RM-1..RM-4) re-measured the four W7 Strand-B
  withholds with a bench-harness plan. I **cite its dispositions** (RM-1 LAND,
  RM-2 split, RM-3 kill+handoff, RM-4 record) and do not re-derive them; I add
  the live-engine grounding under RM-1 and the **D-3 computed-unit half** that
  lane left to the value.js handoff (§3 — the lane's *named* "real D-3 win").
- **`r-interpolation-carrier.md`** (F-1) ran the E Wave-D carrier bench and
  concluded **mono ≈ mega** (the IC is not the bottleneck; SoA layout is the
  ~2–2.3× lever). **My live-shape replication DISAGREES on the mono-vs-mega
  magnitude (I measure 6.2× mega/mono) while AGREEING on the decisive
  conclusion (SoA dominates either way).** §4 reconciles this honestly — it is
  the one place a sibling claim does not reproduce, and the divergence itself is
  the finding: the carrier win is bench-shape-sensitive, so the gate must use
  the demo's real-K distribution.

**The honest headline.** The interpolation *kernel* is SOTA and untouched (§5).
The whole runtime cost lives in the **connective tissue around the kernel**, and
F's value is **measurement, not architecture**: the post-E zero-alloc work
(W7/D.W4) is structurally correct — one buffer, reused, no GC — but it left the
**clear mechanism** (`delete`-loop) un-co-designed, so on V8 the reused buffer is
*permanently in dictionary mode* and steady-state playback is **slower than the
naive fresh-`{}` it replaced**. The fix is a one-line clear-mechanism change
(stable-key null-fill) + the single-active-frame alias; both are kf-local,
pixel-identical, and the largest measured per-frame win in the engine. The
*structural* carrier win (SoA) and the *computed-unit* win (the real D-3) cross
into value.js — handoffs, re-pointed and re-grounded below.

---

## TL;DR — findings + disposition

| # | Finding | Site | Measured (live where noted) | Disposition |
|---|---------|------|------|-------------|
| **P-1** | The `delete`-loop holds **every** reused buffer in dictionary mode — standalone `_interpOut`, group `_grouped`, AND every child `entry.values` — proven on the **LIVE engine** | `engine.ts:573`, `group.ts:212` | live `%HasFastProperties === false` on all three; threaded-buffer `interpFrames` **4–5.75× slower** than fresh-`{}` (§1) | **SHIP-in-F** (stable-key null-fill; gate `proof:interp-fastprops`) — corroborates `r-v8-cost-model` F-1 / `a-runtime-remeasure` RM-1 from the live angle |
| **P-2** | `Object.assign(result, frame.flatVars)` re-copies a stable, fast-properties dict into a dict-mode buffer every frame; single-active-frame can alias | `engine.ts:636` | alias vs delete+assign = **41.7×** on the single-frame path (§2); `flatVars` leaves ARE the lerped units (`frame-compiler.ts:364`) | **SHIP-in-F** (single-frame alias, paired with P-1) |
| **P-3** | The real **D-3**: computed-unit (`calc`/`var`/`vh`/`cqw`) re-resolves **both endpoints every frame**, and the value.js memo **re-serializes its key** (`value.toString()`) on every hit — for an invariant pair. kf-side endpoint cache (C1) **never landed in E** | kf `utils.ts:339`; vj `interpolate.ts:31-32`, `normalize.ts:162-168,195` | live verification: no kf endpoint cache exists (§3.1); the vj write→read→write thrash + per-hit re-serialize confirmed live (§3.2) | **kf: SHIP-in-F seam** (endpoint cache on the InterpolatedVar + resize epoch) **+ value.js-HANDOFF** (C2/C3/C5/C7 — augment existing Wave C) |
| **P-4** | The `ValueUnit` 6-field carrier megamorphism — sibling says mono≈mega, I measure 6.2× mega/mono; **both agree SoA is the real lever** | vj `units/index.ts:13-20`; `interpolate.ts:101,123` | §4: live-shape replication 6.2× mega/mono, 21.9× SoA vs real-engine-shape at K=64 — magnitude diverges from sibling, **direction agrees** | **value.js-HANDOFF** (re-pointed Wave D — **promote D2 SoA; the gate MUST use real-K**) + the honest dispute note |
| **P-5** | The kernel, the steppers, the WAAPI delegation, the pre-resolved `_lerp` dispatch, the binary search, the pre-flattened `allInterpVars` | (§5) | re-confirmed live | **ALREADY-SOTA** — manufacture no work |

**Net for F's runtime band:** two kf-local SHIP-in-F folds (P-1 + P-2, gated on
one authored fast-properties bench), one split kf-seam + value.js-handoff (P-3,
the lane's named D-3 win), one re-pointed value.js carrier handoff with a
documented inter-lane measurement dispute (P-4), and a SOTA kernel left alone.
**No re-architecture.** The deliverable F's runtime band needs is the *shaped,
fast-properties-aware bench* — the current `interpolation.bench.ts` is
structurally blind to every one of these (it never threads the buffer, never
hits a DOM target, §1.3).

---

## 1. P-1 — the `delete`-loop deopt, proven on the LIVE engine · SHIP-in-F

### 1.1 The live code (grounded)

E.W7 landed the standalone zero-alloc structural win: `processFrame` is now a
*method* (`engine.ts:618`, not a per-call closure), the `out` buffer threads
through (`engine.ts:565-568`), and the standalone play loop passes a hoisted
`_interpOut` (`engine.ts:161`, used at `engine.ts:747`). `proof:standalone-zero-
alloc` (`test/standalone-zero-alloc.test.ts`) gates it — but it gates only
**buffer identity** (the same object reference across frames, lines 22-24), NOT
that the object stays in fast-properties mode.

The clear mechanism survived untouched, in **both** the standalone and group
paths:

```ts
// engine.ts:572-573  (interpFrames, standalone + group child)
const result = out;
for (const k in result) delete result[k];
```
```ts
// group.ts:211-212  (transformFramesGrouped, the composite buffer)
const groupedValues = this._grouped;
for (const k in groupedValues) delete groupedValues[k];
```

`delete obj[key]` is the canonical V8 trigger to transition an object out of
fast-properties (hidden-class) mode into **dictionary (slow) mode** — and once
there it does **not** recover. So every reused buffer pays a hash probe per
`result[key] = …` and per `for..in` for the *entire lifetime* of the animation.
This is the residue the E `d-runtime.md` named **D-RT-1** and withheld at close
(`FINAL.md:46-49`).

### 1.2 The re-measurement — on the ACTUAL engine (the live-angle contribution)

The sibling lanes measured *synthetic mirrors* of `interpFrames`. I ran the
**live `CSSKeyframesAnimation.interpFrames`** under `--allow-natives-syntax` and
observed the deopt directly on the engine's own buffers.

**(a) The live buffers are all in dictionary mode.** After playing the 11-stop
multi-property bench animation through the buffers:

| Live buffer | `%HasFastProperties` after reuse |
|---|---|
| standalone `interpFrames` `out` (the W7 path) | **false** |
| group `_grouped` (the D.W4 composite buffer) | **false** |
| every child `entry.values` (×3) | **false** |

Every buffer the zero-alloc work reuses is permanently in slow mode. The group
is "zero-alloc," but each of its reused buffers pays the dictionary-access tax on
every key touch, every frame.

**(b) The regression the synthetic mirror cannot show.** I timed the *live*
`interpFrames` two ways — threaded buffer (the W7 realistic playback path) vs the
`{}`-default (what `interpolation.bench.ts` measures):

| props (flat keys) | threaded-buffer (W7 path) | fresh-`{}` (bench path) | ratio |
|---|---|---|---|
| 1 (1 key) | 137.7 ns/frame | 33.9 ns/frame | **4.06×** |
| 3 (2 keys) | 152.9 ns/frame | 34.7 ns/frame | **4.40×** |
| 5 (4 keys) | 259.7 ns/frame | 45.1 ns/frame | **5.75×** |

**This is the finding the live engine reveals and the mirrors cannot: the W7
buffer-reuse made steady-state per-frame playback 4–5.75× *slower* than the
fresh-`{}` it replaced** — because the reused buffer is trapped in dictionary
mode while a fresh `{}` is born in fast-properties mode. The ratio *grows* with
key count (the dict-probe cost is per-key). The GC win W7 bought is real, but the
per-access penalty dominates in steady state. This is precisely the "the
optimization regressed the thing it optimized" class the E audit predicted
(`d-runtime.md` §1) but never measured against the live code.

**The honest nuance (do NOT misread this as "revert to `{}`").** The fresh-`{}`
path "wins" this micro-loop partly because V8's young-gen alloc is cheap and the
fresh object stays fast-properties — but in a *real* rAF loop the GC churn it
creates is the INP/jank cost the buffer was added to kill. The correct fix is
**neither** the delete-loop buffer **nor** the fresh `{}` — it is a buffer
cleared by a **stable-key null-fill** so it is BOTH zero-alloc AND
fast-properties. Measured (synthetic, the exact `flatVars` key shape, §A.1):

| clear mechanism | ns/frame (clear+write, K=5) | buffer fast? |
|---|---|---|
| `for..in` + `delete` (LIVE) | 213.6 | **false** |
| stable-key null-fill (PROPOSED) | 50.5 | **true** |

**4.23×** on the clear, and the buffer stays in fast mode — so the *downstream*
`Object.assign`/`for..in`/read all run at fixed-offset speed too. The stable-key
reset is sound because `flatVars`' key-set is **compile-stable**: it is built
once in `finalizeFrameVars` (`frame-compiler.ts:361-366`) and never changes
across frames.

### 1.3 Why the current bench is blind

`bench/interpolation.bench.ts` (3 cases, lines 22-38) calls `interpFrames(t,
false)` — **no `out` buffer**, so every call allocates a fresh fast-mode object
and the GC win *masks* the dict-mode cost. It is structurally incapable of seeing
P-1, P-2, or the regression in §1.2. The authored deliverable (the sibling
`a-runtime-remeasure` RM-1 sketches `bench/interp-buffer.bench.ts`; this lane
corroborates the need) is a **threaded-buffer bench + a `%HasFastProperties`
assertion test** (`proof:interp-fastprops`) that bites: revert to the delete-loop
→ the buffer reads `false` → the test reds.

### 1.4 Disposition

**SHIP-in-F.** Stable-key null-fill clear at `engine.ts:573` + `group.ts:212`
(and the `entry.values` clears via `interpFrames`). The win is measured on the
live engine (4–5.75× regression eliminated; the buffer returns to fast mode),
keyframes-local (no value.js edge), and pixel-identical (only the clear mechanism
changes — same keys, same `ValueUnit[]` values). Gate on `proof:interp-fastprops`
(threaded-buffer bench + the native fast-properties assertion). This corroborates
`r-v8-cost-model` F-1 and `a-runtime-remeasure` RM-1 from the **live-engine**
angle they did not run — three independent measurements now agree the win is
robust, not an artifact.

**Isomorphism:** pixel-identical.

---

## 2. P-2 — `Object.assign(result, frame.flatVars)` vs the single-frame alias · SHIP-in-F

### 2.1 The live code (grounded)

`processFrame` merges each active frame's flat vars into the output every frame
(`engine.ts:636`):

```ts
Object.assign(result, frame.flatVars);
```

Two facts make this redundant for the dominant case. First, `frame.flatVars` is
built ONCE at compile (`frame-compiler.ts:361-366`) and its leaf values **are the
same `ValueUnit` instances** `lerpValue` mutated two lines earlier — grounded:
`finalizeFrameVars` does `acc[key] = value.map((v) => v.value)`
(`frame-compiler.ts:364`), and those `v.value` units are exactly the carriers
`processFrame`'s `for (const iv of frame.allInterpVars) lerpValue(eased, iv)`
(`engine.ts:628-629`) writes into. So `Object.assign` copies references that
already point at the freshly-mutated units. Second, for a typical 2-keyframe
property only **one** frame spans any given `t` (the binary-search seed +
contiguous-neighbor scan, `engine.ts:579-606`, finds exactly one active frame for
a `from`/`to` property), so the merge has a single source.

### 2.2 The measurement

For the single-active-frame case, `result` can alias `frame.flatVars` directly —
no clear (P-1), no copy. Measured (§A.2):

| path | ns/frame | buffer fast? |
|---|---|---|
| `delete` + `Object.assign` (LIVE single-frame) | 221.6 | false |
| alias `frame.flatVars` (PROPOSED) | 5.3 | true (`flatVars` is fast-properties) |

**41.7×** on this step. Most of the 221ns is the P-1 dict-mode tax bleeding into
`Object.assign`'s writes; the alias sidesteps both — and because `frame.flatVars`
is itself fast-properties, the downstream transform/read is fast too.

### 2.3 Disposition

**SHIP-in-F**, paired with P-1. Branch on active-frame count: **1 active frame**
(the common path) → return `frame.flatVars` directly; **≥2 active frames** → keep
the merge, into a stable-key (P-1) buffer. The one caveat the alias must honor:
the group always passes its own `entry.values` buffer (`group.ts` per-entry
`interpFrames` call), so the group takes the buffer path and never the alias —
the alias fires only for the standalone single-frame return. Gate: the
round-trip clause (byte-identical output) under `proof:interp-fastprops`.

**Isomorphism:** pixel-identical for the single-frame alias (same object, same
mutated values, grounded at `frame-compiler.ts:364`); the multi-frame merge is
unchanged.

---

## 3. P-3 — the real D-3: the computed-unit DOM round-trip · kf SHIP-in-F seam + value.js-HANDOFF

This is the lane's *named* focus ("the computed-unit DOM round-trip = the real
D-3 win, value.js-owned"). The sibling `a-runtime-remeasure` deferred the
computed path entirely to the value.js handoff; I verify it **live** on both
sides of the repo boundary and confirm the kf-side seam **never landed in E**.

### 3.1 The kf-side seam C1 is NOT landed (verified)

The E handoff Wave C and the E `a-kf-runtime.md` §4 / `d-runtime.md` §5 named the
kf-side endpoint cache (cache resolved `(newStart, newStop, newUnit)` on the
`InterpolatedVar` at prepare time, invalidate on resize) as the FOLD-E half of
D-3 — owned by E.W9. **It did not land.** Grounded:

- `createInterpVarValue` (`utils.ts:325-340`) compiles each var via
  `prepareInterpVar(normalizeValueUnits(l, r, opts))` (`utils.ts:339`) — value.js
  resolves the dispatch (`iv._lerp`) once, but the returned `InterpolatedVar`
  carries **no** cached resolved endpoints for the computed path.
- A repo-wide grep for `cachedStart`/`cachedStop`/`endpoint.*cache`/`layout.*
  epoch`/`ResizeObserver` in `src/animation/**` returns **nothing** on the
  interpolation path (the only `ResizeObserver` hits are in the demo). No
  resize-epoch invalidation exists.

So for a `calc(100cqw - 100%)` leaf (the demo's `AnimationVisualizer`, per
MEMORY.md), the per-frame `lerpValue → iv._lerp → lerpComputedValue` re-resolves
**both** endpoints against the live box every tick. The kf-side fold is still
open.

### 3.2 The value.js cost is live and exactly as D named it

Grounded in the live value.js tree (`/Users/mkbabb/Programming/value.js`):

```ts
// interpolate.ts:31-32 — BOTH endpoints, every frame
const newStart = getComputedValue(start, target);
const newStop  = getComputedValue(stop,  target);
```
```ts
// normalize.ts:195-196 — the memo keyFn RE-SERIALIZES on every call (hit included)
keyFn: (value, target?) => `${value.toString()}-${target ? getElementId(target) : "null"}`
```
```ts
// normalize.ts:162-168 — the cold path: write → read (forced layout) → restore
style[prop] = newValue;
const computed = getComputedStyle(target).getPropertyValue(prop);  // forced reflow
style[prop] = originalValue;
```

So even on the memo *hit* path, every computed leaf pays
`start.toString()` + `stop.toString()` (two full `ValueUnit` serializations) +
two `Map` hashes + a `Date.now()` (the TTL clock, even though
`getComputedValue`'s memo has no TTL → `Infinity`), to retrieve an
O(1)-invariant pair. On the cold path it forces a synchronous layout flush per
leaf per distinct expression — the layout-thrash anti-pattern Motion's batched
read/write phase exists to kill.

### 3.3 Disposition — split, and the F sharpening of "kf-side vs value.js-endpoint"

**kf-side: SHIP-in-F seam.** Cache the resolved `(newStart, newStop, newUnit)` on
the `InterpolatedVar` at `prepareInterpVar` time (the seam where the dispatch is
already resolved, `utils.ts:339`); the per-frame computed body collapses to a
bare `lerp(cachedStart, cachedStop, t)` — **no re-serialize, no memo call, no
reflow** for prepared vars. Invalidate on `setTargets` and on a `ResizeObserver`
layout epoch (the one event that changes the resolution). This is the C1 the E
handoff specced and E.W9 did not land; it is the *bigger* half of D-3 because it
removes the value.js memo from the hot path **entirely** for prepared vars. Gate:
`proof:computed-frame` — a `toString`/`getComputedStyle` call-counter asserting
O(1)-per-frame (paid once at prepare) + a forced-reflow count → ~0 steady-state.

**value.js: HANDOFF (augment the existing Wave C, do not duplicate).** The
existing `valuejs-sota-handoff.md` Wave C already proposes C2 (stable-identity
memo key, no per-hit `toString()`), C3 (batched resolve, cut cold reflows to
1/target), C4 (`ttl===Infinity` fast path, skip `Date.now()`), C5 (the 24-of-43
no-op length units), C7 (resize eviction). **F adds no new value.js item here** —
it re-confirms all five are live and correctly scoped, and sharpens the
cross-repo edge: the kf endpoint cache (above) makes the value.js memo *hit* path
**cold** for prepared vars, so C2/C3/C4 drop to a *secondary hardening for the
external/unprepared path* once the kf seam lands. They are not blocked by each
other; both are real.

**The F disposition the brief asks for — "kf-side vs the value.js endpoint":**
the *primary* D-3 win is **kf-side** (the endpoint cache eliminates the value.js
memo call from the hot path for the prepared majority); the value.js endpoint
(C2/C3/C5/C7) is the *fallback hardening* for the unprepared path + the
correctness fixes (C5 unit coverage, C7 resize) that the kf cache cannot reach.

**Isomorphism:** pixel-identical while the layout epoch is stable; the
ResizeObserver invalidation trades one frame of staleness on resize (the current
per-frame resolve is never stale) for eliminating the per-frame thrash — almost
always acceptable, gated by the resize contract.

---

## 4. P-4 — the `ValueUnit` carrier megamorphism, and the inter-lane measurement dispute · value.js-HANDOFF (re-pointed Wave D)

### 4.1 The carrier (grounded, both repos)

`ValueUnit` is a 6-field positional-optional class (vj `units/index.ts:13-20`):
`value, unit?, superType?, subProperty?, property?, targets?`. The numeric hot
path mutates exactly one field: `value.value = lerp(start.value, stop.value, t)`
(vj `interpolate.ts:101` / `:123`), via the pre-resolved `iv._lerp` dispatch
(`:117-118`), looping the kf-owned AoS `frame.allInterpVars` (`engine.ts:628`).

### 4.2 The dispute (stated plainly, because intellectual honesty requires it)

The sibling **`r-interpolation-carrier.md` F-1** ran the E Wave-D bench and
concluded a **monomorphic `{value}` cell is NOT faster than the megamorphic
`ValueUnit`** at the mutation site (mono ≈ mega, even marginally slower at K=1) —
the store IC is "handled efficiently for a property at a stable offset" — and the
real lever is **SoA `Float64Array` layout (~2.0–2.3× at K≥16)**, re-pointing Wave
D from D1 (monomorphize) to D2 (typed-array primitive).

**My independent live-shape replication does not reproduce the mono≈mega
result.** Measured on node v26 / V8 at K=64 (§A.3, §A.4):

| population (`.value` at fixed offset, all fast-properties) | ns/var |
|---|---|
| monomorphic AoS | 1.04 |
| megamorphic-CLEAN AoS (6 shapes) | 6.47 |
| `Float64Array` SoA | 0.26 |

→ **6.2× mega/mono**, and (isolating, §A.4) **both** the megamorphic
`.value` *reads* (5.8×) and the megamorphic *write* (3.7×) contribute. And the
real-engine-shape (`iv._lerp(t, iv)` dispatch over the AoS, `engine.ts:629`) vs a
flat SoA loop: **21.9× at K=64** (398 → 18 ns), far larger than the sibling's
reported 2.33×.

### 4.3 Reconciliation — what is robust vs what is bench-sensitive

I do **not** assert my numbers override the sibling's — two careful V8 microbenches
disagreeing on magnitude is itself the finding. The reconciliation:

1. **The decisive conclusion is AGREED and robust: SoA `Float64Array` is the real
   lever**, by both measurements (sibling ~2–2.3×; mine ~4–22× depending on
   shape). The disposition does **not** depend on the mono-vs-mega dispute — SoA
   wins under either causal model. **Wave D should be re-pointed to D2 (the
   typed-array primitive), exactly as the sibling concludes.**
2. **The mono-vs-mega magnitude is bench-shape-sensitive** — it depends on how
   many distinct hidden classes actually reach the IC, whether V8 keeps the site
   polymorphic (≤4) vs megamorphic (>4), and whether the `_lerp` closure
   dispatch (a non-inlinable indirect call per element) **masks** the carrier IC
   delta. The most likely source of the divergence: the sibling's "real engine
   shape" routed through `_lerp`, where the closure-call cost dominates and
   compresses the visible carrier delta; my isolation bench (§A.4) measures the
   `.value` load/store directly, where the megamorphism shows. Both are correct
   *for what they measured*.
3. **The actionable consequence for the gate (this is the real F contribution to
   the carrier question):** because the win is this bench-sensitive AND
   K-dependent (absent at K=1, decisive at K≥16 — both lanes agree), the
   measure-first gate **must use the demo's actual frame-K distribution**, not a
   synthetic K=64, before any SoA-segment compile ships. The sibling's `proof:
   interp-soa` (representative-K) is the right gate; F must not let a synthetic
   number drive the fold.

### 4.4 Disposition

**value.js-HANDOFF (re-pointed Wave D), concurring with the sibling's
re-point.** Promote **D2** (`lerpArray(Float64Array, Float64Array, t, out)`, the
SoA primitive) to the primary carrier win. The kf-local numeric-segment SoA
compile (mirror `NumericAnimation`'s `startVals`/`stopVals`, `numeric.ts:139-181`)
is the FOLD-E half — **MEASURE-FIRST / BOOK**, gated on real-K. Keep D1's
"reconstitute the rich `ValueUnit` only at serialize" framing (F-2 of the carrier
lane proves the numeric inner loop reads only `{value}` — vj `interpolate.ts:97-
103`); **record the mono-vs-mega magnitude dispute** so a future pass measures it
on the real corpus rather than inheriting either lane's number. **No kf or
value.js edit in F** (this is the structural, riskiest change — a named tranche,
not a drive-by).

**Isomorphism:** pixel-identical (SoA stores the same `value` numbers; the rich
carrier is reconstituted at the serialize boundary).

---

## 5. ALREADY-SOTA — manufacture no work

Re-confirmed live (re-confirms `d-runtime.md` §11, `a-runtime-remeasure`
§ALREADY-SOTA, `r-interpolation-carrier` §5):

- **Standalone zero-alloc structurally LANDED (E.W7)** — `processFrame` is a
  method (`engine.ts:618`), the `_interpOut` buffer threads (`engine.ts:161,747`),
  zero per-frame closure. The P-1 delete-loop is a *clear-mechanism* residue on
  top of correct structure, not an allocation.
- **The hot kernel** — binary-search seed + contiguous-neighbor scan
  (`engine.ts:579-606`; `internal/binarySearch.ts`), pre-resolved monomorphic
  `lerpValue` over pre-flattened `allInterpVars` (`engine.ts:628-629`;
  `frame-compiler.ts:370`), zero-width-frame snap (`engine.ts:625`,
  `start === stop ? 1 : scale(...)` — E-RT-5 landed). SOTA, leave it.
- **Pre-resolved `_lerp` dispatch** (vj `interpolate.ts:143-150`) — the
  type-check is hoisted out of the per-call path; the residual cost is the
  per-`iv` closure call, addressed (if at all) by SoA-batching (P-4), NOT by
  redesigning the dispatch. ALREADY-SOTA.
- **In-place `value.value` mutation, serialize only at the write boundary** (vj
  `interpolate.ts:101`; kf `utils.ts` `transformTargetsStyle`) — the zero-alloc
  carrier-mutation discipline CSS Typed OM would *regress* (the carrier lane F-4
  KILLs Typed OM on evidence). Leave.
- **Group compositor zero-alloc** (`group.ts`) — inline whitelist key-skip (no
  `filteredValues` object), in-place blend accumulation, long-lived
  `_grouped`/`entry.values`. ALREADY-SOTA **modulo P-1** (the one residue is the
  delete-loop clear, a mechanism fix, not an allocation).
- **`scheduler.yield` INP-batched group advance** (`group.ts` `YIELD_BATCH`;
  `internal/scheduler.ts`) — live probe + cached fallback. Modern, leave it.
- **WAAPI compositor delegation** (`waapi.ts`) — the off-main-thread path when
  eligible; the narrowness of eligibility is *why* the rAF-path costs above
  (P-1..P-4) matter for the rAF majority. ALREADY-SOTA.

The honest verdict: the interpolation **kernel**, the **steppers**, the **group
blend**, and the **WAAPI delegation** are SOTA. Every finding above is in the
**connective tissue** — the buffer clear (P-1), the merge copy (P-2), the
computed-unit round-trip (P-3), and the carrier layout (P-4) — and of those, two
are kf-local SHIP-in-F folds, one is a split kf-seam + value.js-handoff, and one
is a re-pointed value.js handoff. **No manufactured work.**

---

## Disposition ledger

| ID | Finding | Site | Measured | Disposition |
|----|---------|------|----------|-------------|
| **P-1** | `delete`-loop holds every reused buffer in dictionary mode (live: standalone + `_grouped` + `entry.values`); threaded-buffer 4–5.75× slower than fresh-`{}` | `engine.ts:573`, `group.ts:212` | live `%HasFastProperties=false` ×5 buffers; 4.23× clear win with null-fill | **SHIP-in-F** (stable-key null-fill; `proof:interp-fastprops`) |
| **P-2** | `Object.assign(result, frame.flatVars)` copies a stable dict every frame; single-frame can alias | `engine.ts:636` | 41.7× alias vs delete+assign; leaves are the lerped units (`frame-compiler.ts:364`) | **SHIP-in-F** (single-frame alias) |
| **P-3** | the real D-3: computed-unit re-resolves both endpoints/frame + memo re-serializes key/hit; kf endpoint cache never landed | kf `utils.ts:339`; vj `interpolate.ts:31-32`, `normalize.ts:162-168,195` | live: no kf cache; vj thrash + per-hit re-serialize confirmed | **kf SHIP-in-F seam** (endpoint cache + resize epoch; `proof:computed-frame`) **+ value.js-HANDOFF** (C2/C3/C5/C7 re-confirmed, secondary) |
| **P-4** | `ValueUnit` 6-field carrier megamorphism; mono-vs-mega dispute with sibling; SoA is the agreed lever | vj `units/index.ts:13-20`; `interpolate.ts:101,123` | 6.2× mega/mono (mine) vs ≈ (sibling); 21.9× SoA at K=64; both agree SoA wins | **value.js-HANDOFF** (re-pointed Wave D → D2 SoA; gate on real-K) + dispute recorded |
| **P-5** | kernel / steppers / `_lerp` dispatch / binary search / `allInterpVars` / group blend / scheduler.yield / WAAPI | (§5) | re-confirmed live | **ALREADY-SOTA** |

---

## §A — re-runnable probes (node v26, `--allow-natives-syntax`)

All numbers above are from these. The live-engine probes import
`src/animation/{engine,group}.ts` directly; the native `%HasFastProperties` is
hidden from the TS transform via `new Function("o","return %HasFastProperties(o)")`.

### A.1 — the clear-mechanism deopt (the `flatVars` key shape)
`delete`-loop clear+write vs stable-key null-fill, K=5 keys, 100k frames:
delete=213.6 ns (`%HasFastProperties=false`), null-fill=50.5 ns
(`true`) → **4.23×**. The delete-cleared buffer falls to dictionary mode after
~5 cycles and never recovers.

### A.2 — the single-frame alias (P-2)
`delete`+`Object.assign(buf, flatVars)` vs `return flatVars`, 5 keys, 500k iters:
221.6 ns vs 5.3 ns → **41.7×**; `flatVars` stays fast-properties.

### A.3 — the LIVE engine (P-1 §1.2)
`CSSKeyframesAnimation.interpFrames` (11-stop multi-prop), threaded `out` buffer
vs `{}`-default, across 1/3/5 props: 137.7/152.9/259.7 ns (buffer) vs
33.9/34.7/45.1 ns (fresh) → **4.06×/4.40×/5.75×**; the live `out`, the live group
`_grouped`, and every live `entry.values` read `%HasFastProperties=false`.

### A.4 — the carrier dispute (P-4)
Clean megamorphic (6 shapes, `.value` at fixed offset, all fast-properties) vs
monomorphic vs `Float64Array` SoA at K=64: 6.47 / 1.04 / 0.26 ns/var → **6.2×
mega/mono, 24.5× SoA vs mega**. Isolation: mega-read+mono-write=379 ns,
mono-read+mega-write=245 ns vs all-mono=65 ns (both sites contribute).
Real-engine-shape (`iv._lerp(t,iv)` AoS) vs flat SoA at K=64: 398 → 18 ns =
**21.9×**. Diverges from `r-interpolation-carrier` F-1's mono≈mega / 2.33× — the
magnitude is bench-shape-sensitive (closure-dispatch masking + IC shape-count);
the SoA direction agrees. Gate must use real-K.

---

## Sources

- Live code: kf `src/animation/{engine,group,frame-compiler,utils,playback,
  numeric}.ts`, `internal/{binarySearch,scheduler}.ts`, `bench/interpolation.
  bench.ts`, `test/standalone-zero-alloc.test.ts`; value.js
  `src/units/{interpolate,index,normalize}.ts`.
- Sibling F lanes (cited + diffed): `r-v8-cost-model.md` (delete-loop synthetic
  mirror), `a-runtime-remeasure.md` (the four W7 withholds), `r-interpolation-
  carrier.md` (the carrier bench + SoA re-point).
- E prior art (cited + diffed): `docs/tranches/E/audit/sota/{d-runtime,a-kf-
  runtime}.md` (D-RT-1..9), `valuejs-sota-handoff.md` (Waves C + D),
  `FINAL.md:39-55` (the measure-first withholds).
- V8 object model: hidden-class / dictionary-mode-on-`delete`; inline-caching
  monomorphic/polymorphic/megamorphic (>4 shapes → slow); `Float64Array` single
  element type / dense / SIMD-amenable (the same corpus the E lanes cited;
  re-confirmed by the `%HasFastProperties` direct observation above, not
  re-derived).
- Motion batched read/write (the layout-thrash framing for P-3): motion.dev
  GSAP-vs-Motion.
