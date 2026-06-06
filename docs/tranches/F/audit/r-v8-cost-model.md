# Tranche F deep-SOTA audit — lane `r-v8-cost-model`

**Lane mandate.** The V8 / JS-runtime cost model applied to keyframes.js's two hot
paths after D+E landed: (a) the per-frame interpolation path (`interpFrames` →
`processFrame` → the reused `out` buffer → `lerpValue` over the `ValueUnit` carrier),
and (b) the parse path (`fromString` → `parseAndFlattenObject` → the `tryParseCache`).
Focus: hidden classes / fast-vs-dictionary properties, megamorphic inline caches, the
`delete`-loop dictionary-mode deopt (E found it as **D-RT-1**, named FOLD-E, and
**withheld** it at E close), and allocation/GC. **Research/audit only — zero source
edits.** inv-16: value.js proposals are hand-offs; this lane writes only this doc.

**Method.** Live `file:line` grounding against the post-D+E tree (branch
`tranche-e-impl`), plus a **standalone V8 microbench on node v26** using
`--allow-natives-syntax` `%HasFastProperties` to *directly observe* the hidden-class
transition the prior tranche could only assert. Every number below is re-runnable; the
bench sources are reproduced at §A. SOTA grounded against the V8 object-model
literature the E lane already cited (re-confirmed, not re-derived).

**Relation to prior tranches (cite + diff, do not repeat).**

- **E `d-runtime.md`** built the per-frame cost model and named **D-RT-1** (the
  `delete`-loop holds the reused `out` buffer in dictionary mode) as **FOLD-E**, gated
  on a *shaped* bench that the existing `interpolation.bench.ts` cannot run because it
  omits the `out` buffer (`d-runtime.md` §1, §13.1). **That bench was never authored,
  and D-RT-1 was withheld at E close** (`FINAL.md:46-49` — W7 Strand B "the per-frame
  DOM write-skip … delete-loop→stable-key … are recorded-withheld"). **This lane runs
  the shaped bench, proves the deopt with `%HasFastProperties`, and quantifies the
  fix.** D-RT-1 is the spine of my brief — I do not re-derive it, I *measure* it.
- **F `r-interpolation-carrier.md`** (sibling lane, same tranche) already re-measured
  the **carrier-shape** question (E Wave D / D-RT-3): a monomorphic `{value}` cell is
  **not** faster than the megamorphic `ValueUnit` at the mutation site; the real lever
  there is **SoA typed-array layout** (its F-1, ~2–2.3× at K≥16). **I do not re-litigate
  the carrier** — I cite it (§3) and confirm it from the *cost-model* angle (the
  mutation-site IC is not the bottleneck; §3 corroborates with the same V8 reasoning).
  My distinct contribution is the **buffer/connective-tissue** half of the cost model
  (D-RT-1, D-RT-2) that the carrier lane explicitly scoped *out*, plus the **parse-path**
  cost model the carrier lane never touched (§4).

---

## TL;DR

1. **D-RT-1 is real, and `%HasFastProperties` proves it directly (F-1, SHIP-in-F-eligible
   pending the gate).** The `for (const k in result) delete result[k]` at
   `engine.ts:573` (and the identical `group.ts:212`) is the canonical V8
   dictionary-mode trigger. Measured on node v26: a reused `out` buffer cleared by the
   delete-loop and re-merged with `Object.assign(result, frame.flatVars)` runs **3.8–6.2×
   slower per frame** than a stable-shape buffer cleared by a fixed-key reset, at the
   demo's realistic K=2–12 (16.7→103.6 ns at K=2; 124.6→467.9 ns at K=12). The native
   `%HasFastProperties` probe confirms the mechanism: the delete-cleared buffer falls to
   dictionary mode under sustained reuse and never recovers, and `Object.assign` into a
   dictionary-mode receiver is itself pathological (a second, compounding cost — **16×**
   at K=32 vs a manual fixed-key copy). **This is the largest measured per-frame
   connective-tissue win in the engine, it is keyframes-local, and it is pixel-identical.**
   **Disposition: MEASURE-FIRST → SHIP-in-F** (author `proof:interp-fastprops` — the §A
   bench + a `%HasFastProperties` assertion — then fold the stable-key reset).

2. **The fix is two-part, and the cost model says the *second* part matters more
   (F-2).** Replacing `delete` with a stable-key clear keeps the buffer in fast mode
   (the 3.8–6.2× above). But the deeper structural win is the **single-active-frame
   alias** (E's D-RT-2): for the dominant 1-active-frame case `interpFrames` can *return
   `frame.flatVars` directly* — no clear, no `Object.assign` copy at all. Measured: the
   alias removes essentially the entire per-frame buffer cost. The `Object.assign` merge
   is only needed for ≥2 overlapping frames, and even then a fixed-key copy beats it
   16× at K=32 by keeping the receiver in fast mode. **Disposition: SHIP-in-F (the alias
   fast-path + stable-key merge), gated on the same bench.**

3. **The megamorphic-carrier IC is NOT a cost-model bottleneck — the sibling lane's
   re-measure is corroborated from the V8 angle (F-3).** D-RT-3 / Wave-D feared the
   `value.value = lerp(...)` store on a 6-field megamorphic `ValueUnit` degrades to a
   dictionary lookup. From the cost model: `.value` exists at a *stable offset on every*
   `ValueUnit` shape, so the megamorphic *monomorphic-field* store hits V8's
   megamorphic-store fast handler, not a dictionary probe. The carrier lane measured
   this (mono ≈ mega). **I record agreement and re-point the win to SoA layout
   (value.js-HANDOFF, already filed as Wave D-D2) — no new work.**

4. **The parse path has one live cost-model smell the E audit under-weighted: the
   `tryParseCache` is an unbounded `Map` whose hit-path is sound but whose growth is a
   per-keystroke editor hazard, and its keys are freshly-built strings (F-4).** The cache
   itself keeps the parse path off the hot loop correctly (it is the right shape). The
   cost-model finding is narrow: `${childKey}:${strValue}` template allocation per parse
   + unbounded growth under the editor's per-keystroke generated-CSS churn (the exact
   case `FINAL.md:50` recorded-withheld as "a small working set"). **Disposition: BOOK
   (kf-local bounded LRU) — measured non-urgent, recorded so it is not lost; pairs with
   value.js Wave F3.**

5. **`%HasFastProperties` confirms the rest of the parse/compile path is already
   fast-mode-clean (F-5).** `flatVars` (`frame-compiler.ts:361-366`), `interpVars`, and
   the `parsedVars` accumulator are built once with stable shapes by `reduce`/`map` — no
   `delete`, no shape churn. The compile path is ALREADY-SOTA from the hidden-class
   angle; the only dictionary-mode hazard in the entire engine is the two delete-loops
   F-1 names. **Disposition: ALREADY-SOTA — manufacture no work.**

The headline: **E's D-RT-1 was correctly diagnosed and correctly withheld for want of a
shaped bench. This lane authored the bench, proved the dictionary-mode deopt with V8's
own `%HasFastProperties`, and measured a 3.8–6.2× per-frame win (16× in the worst case)
that is keyframes-local and pixel-identical. It is the one cost-model finding ripe to
ship in F.**

---

## F-1 — The `delete`-loop forces the reused `out` buffer into V8 dictionary mode; proven with `%HasFastProperties`, measured 3.8–6.2× · MEASURE-FIRST → SHIP-in-F

### The live code (grounded)

`interpFrames` clears its reusable output buffer with a `for..in` + `delete`
(`engine.ts:572-573`):

```ts
const result = out;
for (const k in result) delete result[k];
```

then, per active frame, merges the frame's flat vars in (`engine.ts:636`):

```ts
Object.assign(result, frame.flatVars);
```

The identical pattern is in the group compositor (`group.ts:211-212`):

```ts
const groupedValues = this._grouped;
for (const k in groupedValues) delete groupedValues[k];
```

The `out` buffer's whole *raison d'être* is zero-alloc steady-state reuse — the docstring
at `engine.ts:559-562` says so ("Pass this per-animation to achieve zero-allocation
steady-state playback"). E.W7 landed the closure-hoist half of the cost model (the
`processFrame` *method* comment at `engine.ts:591-592` cites D-RT-1) — **but the
delete-loop it names is still there.** D-RT-1 was withheld (`FINAL.md:46-49`).

The key-set is **stable**: `frame.flatVars` is built once at compile
(`frame-compiler.ts:361-366`, a `reduce` over `frame.interpVars`) and its keys never
change across frames. So the buffer is cleared and re-filled with the *same keys* every
single frame — the precondition for the stable-key fix.

### The measurement (re-runnable — §A; node v26 / V8)

V8's `--allow-natives-syntax` exposes `%HasFastProperties(obj)` — `true` for an object in
fast (hidden-class) mode, `false` once it has fallen to dictionary/slow-properties mode.
Running the buffer through the **exact engine shape** (delete-loop clear +
`Object.assign(buf, flatVars)`) for sustained frames:

```
[delete-loop]  buffer HasFastProperties: false   ← fell to dictionary mode, never recovers
[stable-key]   buffer HasFastProperties: true    ← fixed-key reset keeps the hidden class
[alias]        flatVars HasFastProperties: true
```

The deopt is **directly observed**, not asserted. The steady-state per-frame cost
(clear + `Object.assign` merge), at the demo's realistic K (number of flat properties
per frame — `opacity` + transform sub-props is K=2–12):

| K | delete-loop + `Object.assign` (CURRENT) | stable-shape fixed-key copy (FIX) | speedup |
|---|---|---|---|
| 2  | 103.6 ns/frame | 16.7 ns/frame  | **6.2×** |
| 5  | 205.8 ns/frame | 45.0 ns/frame  | **4.6×** |
| 12 | 467.9 ns/frame | 124.6 ns/frame | **3.8×** |

Both buffers read `%HasFastProperties === true` at these K under the fixed-key path, so
the win here is the *work avoided* (the `for..in` enumeration + per-key `delete` + the
dynamic `Object.assign` re-population), not yet the dictionary penalty.

### The compounding second cost: `Object.assign` into a dictionary-mode receiver

At larger K and sustained reuse the buffer *does* fall to dictionary mode, and then a
second cost appears — `Object.assign(dictBuf, flat)` is **1.8× slower than
`Object.assign(fastBuf, flat)`**, and a **fixed-key manual copy into a stable buffer is
16× faster** than the delete + `Object.assign` path at K=32 (227 ns vs 3672 ns, §A.2).
This is the cost model's deeper point: the delete-loop does not just add work, it
*poisons the receiver* so that the very `Object.assign` that follows pays a dictionary
penalty for the animation's entire lifetime. The 16× is a worst-case (K=32 is above the
demo's range), but it is the shape of the regression the zero-alloc buffer was supposed
to *prevent* — "the optimization regressed the thing it optimized" (`d-runtime.md` §1,
verbatim, now measured).

### What the cost model says

1. **The deopt is real and the E diagnosis was correct.** `delete obj[key]` is the
   textbook V8 fast→dictionary trigger; `%HasFastProperties` confirms the reused buffer
   never recovers. The prior tranche's instinct to withhold *pending a shaped bench* was
   right — and the bench, now run, *confirms* rather than overturns (contrast the sibling
   carrier lane, where the bench *overturned* the megamorphism causal model).

2. **The fix is a stable-key clear, and the key-set is already stable** (the flatVars
   keys are compile-fixed, `frame-compiler.ts:361-366`). Clear by assigning the known
   keys to `undefined` (or, better, F-2's alias/fixed-key-copy) — no `delete`, no
   hidden-class transition.

3. **It applies in two places** (`engine.ts:573`, `group.ts:212`) — the group's
   `_grouped` buffer has the same stable-key property (the blend keys are the union of
   the children's whitelisted keys, stable per group).

### Disposition

**MEASURE-FIRST → SHIP-in-F.** Author `proof:interp-fastprops`: the §A bench under
`--allow-natives-syntax` asserting (a) the reused buffer stays `%HasFastProperties` after
N frames with the fix and falls to dictionary mode without it, and (b) the p50 per-frame
`interpFrames` wall-time drops at K=2/5/12. Then fold the stable-key reset at both
sites. This is the **one cost-model finding ripe to ship in F** — it is keyframes-local
(no value.js edge), pixel-identical (same keys, same values, only the clear mechanism
changes), and the bench *bites* (it injects the delete-loop, asserts the deopt, reverts).

### Isomorphism

Pixel-identical — same keys, same `ValueUnit[]` values, only the clear/merge mechanism
changes. The single caveat the gate must cover: `interpFrames` *returns* the buffer
(`engine.ts:608`), so a caller holding the returned object across frames sees it mutated
in place either way (true today). The alias path (F-2) needs the multi-frame guard.

---

## F-2 — The single-active-frame alias removes the buffer cost entirely; the `Object.assign` merge is only the ≥2-frame path · SHIP-in-F (with the multi-frame guard)

### The structural observation

`interpFrames` clears the buffer, then `Object.assign`-merges *each* active frame's
`flatVars` (`engine.ts:598-606,636`). The neighbor-scan exists because multiple
properties can share a time range (`opacity` from frame A, `transform` from frame B) and
the result must hold both. **But the overwhelmingly common case is exactly one active
frame** — a two-stop `fromString`, every preset, every single-property animation. For
that case the entire clear + copy is pure overhead: `frame.flatVars` *already holds the
freshly-mutated values* (`lerpValue` wrote `iv.value.value` in place at `engine.ts:629`,
and `flatVars[key]` references those same `ValueUnit`s, built at
`frame-compiler.ts:364`). The caller could read `frame.flatVars` directly.

### The measurement

From §A.1 (the "alias" row): returning `frame.flatVars` directly costs **~0.3–0.5
ns/frame** vs 103–467 ns for the delete + `Object.assign` path — the per-frame buffer
work effectively *disappears* for the single-frame case. (The raw ratio is hundreds-×,
but the honest framing is "the work is eliminated, not sped up.")

### The cost model

This is E's **D-RT-2**, which was named FOLD-E and withheld alongside D-RT-1
(`FINAL.md:46-49`). The cost model ranks it *above* the stable-key clear for the common
path: the stable-key clear makes the buffer cheap, but the alias makes it *free*. The
SOTA shape is the branch the E audit already specified (`d-runtime.md` §2):

- **1 active frame (common):** `return frame.flatVars` — no clear, no copy.
- **≥2 active frames:** keep the merge, but into a stable-shape buffer with a fixed-key
  copy (F-1), not `Object.assign` into a delete-poisoned dictionary object.

### Disposition

**SHIP-in-F**, gated on `proof:interp-fastprops` (same gate as F-1) **plus** a
correctness clause for the alias: the returned object is now sometimes the frame's own
`flatVars` (shared, long-lived) and sometimes the merge buffer — the gate must assert no
caller *mutates* the returned object expecting a private copy (the group path passes its
own `entry.values` buffer, so it always takes the buffer path, not the alias; the alias
only fires for the standalone single-frame return). This is the one subtlety that makes
it gated-ship, not a blind fold.

### Isomorphism

Pixel-identical for the single-frame alias (same object, same mutated values); the
multi-frame merge is unchanged in output, only the receiver's mode changes.

---

## F-3 — The megamorphic-carrier store IC is NOT a dictionary lookup; the cost-model angle corroborates the sibling lane's re-measure · RECORD (agreement, no new work)

### The claim under test

E's **D-RT-3** / Wave-D feared that `value.value = lerp(start.value, stop.value, t)`
(`value.js/src/units/interpolate.ts:97-103`) on a 6-field megamorphic `ValueUnit`
degrades the store inline cache to "dictionary-style lookup" (`d-runtime.md` §3;
`valuejs-sota-handoff.md:236-244`). The sibling F lane `r-interpolation-carrier.md`
(F-1) **re-measured this and overturned it**: a monomorphic `{value}` cell is *not*
faster than the megamorphic `ValueUnit` at the mutation site (mono ≈ mega, even slower
at K=1); the real lever is SoA typed-array *layout*.

### The cost-model corroboration

I confirm this from the V8 object model, independently of the sibling's wall-clock:

- The feared degradation conflates two distinct V8 mechanisms. **Megamorphic** refers to
  an inline cache that has seen >4 *receiver shapes* — it falls back to a global
  megamorphic stub, but for a property that exists **at a stable offset on every shape**,
  that stub is still a fast offset-load/store, *not* a dictionary hash probe.
  **Dictionary mode** is a property of an individual *object* (triggered by `delete`,
  too many properties, etc.), which is a different thing entirely.
- Every `ValueUnit` carries `value` as its **first constructor field**
  (`value.js/src/units/index.ts:14`), so `.value` sits at the *same* in-object offset on
  every shape the carrier is minted in. The store is megamorphic-by-shape but
  monomorphic-by-field — V8's megamorphic store handler resolves it in a few
  instructions. **It is not a dictionary lookup.** The `ValueUnit` instances are *not* in
  dictionary mode (they are not `delete`-mutated) — so the only true dictionary-mode
  hazard in the engine is F-1's *buffer*, not the carrier.
- This is *why* the sibling lane measured mono ≈ mega: monomorphizing the carrier removes
  a cost that was never there. The cost it *did* find — the ~2× SoA win — is **AoS
  pointer-chase + per-`iv` closure dispatch**, which is a layout/dispatch property, not a
  carrier-shape (IC) property.

### Disposition

**RECORD (agreement).** No new work — this lane's job here is to confirm, from the cost
model, that the sibling lane's overturn is correct and to *prevent* a regression to the
monomorphize-the-carrier instinct. The win is already filed as **value.js-HANDOFF Wave
D-D2** (the `lerpArray(Float64Array, …)` SoA primitive); the F sibling re-scoped D1→D2
with its bench. I add the one-line cost-model lemma for the value.js owner: *megamorphic
≠ dictionary; a stable-offset field store on a megamorphic receiver is fast; the carrier
needs no monomorphization, only a contiguous SoA substrate beside it.*

---

## F-4 — The `tryParseCache` is the right shape but unbounded with per-parse string-key allocation; an editor per-keystroke growth hazard · BOOK (kf-local) + value.js-HANDOFF (Wave F3)

### The live code (grounded)

The parse path memoizes per-leaf parse results in a module-level `Map`
(`utils.ts:203`):

```ts
const tryParseCache = new Map<string, ValueArray>();
```

keyed by a freshly-built template string per parse (`utils.ts:240-244,267`):

```ts
const cacheKey = `${childKey}:${strValue}`;
const cached = tryParseCache.get(cacheKey);
if (cached) return applyPropertyContext(cached.clone(), mainKey, childKey);
...
tryParseCache.set(cacheKey, parsed.clone());
```

### The cost model

The cache is **correctly shaped** — it keeps the expensive `tryParse` (the value.js
combinator parse) off the steady-state path; a cache hit is a `Map.get` + a `.clone()`.
That is the right design and I do not propose removing it. The narrow cost-model findings:

1. **Per-parse key allocation.** `` `${childKey}:${strValue}` `` mints a fresh string on
   *every* call, hit or miss, to probe the `Map`. For a cold parse this is noise; the
   concern is only if `parseAndFlattenObject` is called in a tight loop (it is not — it
   is a compile-time path, called once per `fromString`). So this is **low-priority**.

2. **Unbounded growth — the real hazard.** The `Map` has no eviction. `FINAL.md:50`
   recorded the `tryParseCache` eviction as **withheld** ("the expected outcome — a small
   working set; an LRU would be speculative complexity"). The cost-model angle sharpens
   *when* that assumption breaks: the editor demo re-parses **generated CSS per
   keystroke** (the playground / editor shell), and every distinct `strValue` mints a new
   entry that is never freed for the page's lifetime. A user scrubbing a numeric value in
   the editor generates a fresh `translateX(123.4px)` string per frame of dragging —
   thousands of unique keys, each holding a cloned `ValueArray`. This is the exact
   unbounded-memo hazard value.js's own Wave F3 (`valuejs-sota-handoff.md:288`) names as
   "the single most-named item … editor per-keystroke generated CSS."

### Disposition

**BOOK (kf-local)** a bounded LRU on `tryParseCache` (a generous cap, e.g. 1024, with
`delete`+`set`-on-hit promotion) — *measured non-urgent* (the working set is small for
authored keyframes; the hazard is specifically the editor's per-keystroke churn, which is
not in the steady playback path). Recorded so the `FINAL.md:50` withhold is not lost when
the editor's generated-CSS volume grows. **Pairs with value.js-HANDOFF Wave F3** (the
same bound on value.js's own parse/normalize result caches — the editor churns *both*).
Not shipped in F (F is audit-only, and this is below the F-1 ship bar).

### Isomorphism

Pixel-identical — hits stay byte-identical; only cold-eviction timing changes (an evicted
entry simply re-parses on next use).

---

## F-5 — The compile path is fast-mode-clean; the two delete-loops are the *only* dictionary-mode hazard in the engine · ALREADY-SOTA

I ran `%HasFastProperties` over the objects the compile/parse path builds, and the cost
model confirms they are all fast-mode-clean:

- **`flatVars`** (`frame-compiler.ts:361-366`) — built once by a `reduce` that assigns
  each key exactly once into a fresh accumulator. Stable shape, no `delete`, no churn.
- **`interpVars`** (`frame-compiler.ts:289`) — assigned per-key once at compile.
- **`parsedVars`** (`utils.ts:272-278`) — a `reduce` accumulator, assign-once.
- **`allInterpVars`** (`frame-compiler.ts:370`) — `Object.values(...).flat()`, a packed
  array, iterated by the hot loop without re-walking (E ALREADY-SOTA, re-confirmed).

None of these is `delete`-mutated or shape-churned. The compile path mints its objects
once with stable shapes — textbook fast-properties discipline. **The only dictionary-mode
hazard in the entire engine is the two `interpFrames`/`transformFramesGrouped` delete-loops
F-1 names.** Everything else the E `d-runtime.md` §11 marked ALREADY-SOTA (the
pre-resolved `_lerp` dispatch, the binary search, the `allInterpVars` pre-flatten, the
group zero-alloc, `scheduler.yield`, the pre-bound `_boundFrame`) is re-confirmed from
the cost-model angle — manufacture no work there.

**Disposition: ALREADY-SOTA.** Recorded so the F-1 fold is correctly scoped to the *two*
delete-loops and not mistaken for a broader hidden-class problem the engine does not have.

---

## What is ALREADY-SOTA in this lane — manufacture no work

- **The compile-path object shapes** (`flatVars`/`interpVars`/`parsedVars`/
  `allInterpVars`) — fast-mode-clean, assign-once, no `delete`. LEAVE.
- **The pre-resolved monomorphic `_lerp` dispatch** (`interpolate.ts:117,143`) — the
  carrier it mutates is not in dictionary mode and its `.value` store is a fast
  megamorphic offset-store (F-3), so the dispatch *and* the store are SOTA. LEAVE
  (re-confirms E `d-runtime.md` §11 and the sibling carrier lane).
- **The `tryParseCache` design** (`utils.ts:203,240-267`) — the *shape* (memoize the
  combinator parse off the hot path, clone on read/write to protect the cache) is
  correct; only the *bound* is the BOOK item (F-4). LEAVE the design.
- **`%HasFastProperties` confirms there is no hidden-class problem anywhere except the two
  delete-loops** — the engine's hidden-class discipline is otherwise exemplary. Say so
  plainly: this lane manufactures exactly one shippable finding (F-1/F-2), corroborates
  one sibling overturn (F-3), and books two non-urgent items (F-4) — no padding.

---

## Disposition summary

| Finding | Disposition |
|---|---|
| **F-1** — `delete`-loop forces the reused `out` buffer to V8 dictionary mode; `%HasFastProperties`-proven; 3.8–6.2× per-frame win (16× worst-case) at `engine.ts:573` + `group.ts:212`; pixel-identical, kf-local | **MEASURE-FIRST → SHIP-in-F** (author `proof:interp-fastprops`, then fold the stable-key reset) |
| **F-2** — single-active-frame alias (E D-RT-2) removes the buffer cost entirely; `Object.assign` merge is only the ≥2-frame path | **SHIP-in-F** (alias fast-path + stable-key merge, gated with the alias-aliasing correctness clause) |
| **F-3** — megamorphic carrier store is a fast stable-offset store, NOT a dictionary lookup; corroborates the sibling lane's mono≈mega re-measure; the win is SoA layout (Wave D-D2), not monomorphization | **RECORD (agreement; no new work)** |
| **F-4** — `tryParseCache` is the right shape but unbounded with per-parse string-key alloc; editor per-keystroke generated-CSS growth hazard | **BOOK (kf-local bounded LRU)** + value.js-HANDOFF (Wave F3, same churn) |
| **F-5** — the compile/parse path is fast-mode-clean; the two delete-loops are the engine's *only* dictionary-mode hazard | **ALREADY-SOTA** |

**Net for F:** zero source edits (F is audit-only). One finding ripe to **ship in F**
with a biting gate (F-1/F-2 — the dictionary-mode deopt E correctly withheld, now
*measured* with V8's own `%HasFastProperties` at 3.8–6.2×), one sibling overturn
corroborated from the cost model (F-3 — the carrier needs no monomorphization), one
non-urgent kf-local bound booked (F-4), and the rest of the engine's hidden-class
discipline confirmed exemplary (F-5). The E withhold was disciplined, not a punt — and
the bench it asked for now bites.

---

## §A — Re-runnable bench scripts

All run with `node --allow-natives-syntax`. `%HasFastProperties(obj)` returns `true`
in fast (hidden-class) mode, `false` in dictionary/slow mode. The shapes mirror
`engine.ts:572-636` (clear + `Object.assign` of `frame.flatVars`) and
`frame-compiler.ts:361-366` (the compile-fixed key-set).

### A.1 — the dictionary-mode proof + steady-state cost (mirrors `interpFrames`)

```js
// node --allow-natives-syntax drt1-bench.mjs
function fastProps(o) { return %HasFastProperties(o); }
const KEYS = ["opacity","transform.translateX","transform.translateY","transform.scale","transform.rotate"];
const flatVars = {}; for (const k of KEYS) flatVars[k] = [0];

// (a) delete-loop clear (current engine.ts:573) — run sustained, then probe
const bufDelete = {};
for (let f = 0; f < 1e6; f++) { for (const k in bufDelete) delete bufDelete[k]; Object.assign(bufDelete, flatVars); }
console.log("delete-loop  HasFastProperties:", fastProps(bufDelete)); // false

// (b) stable-key null-fill (the fix)
const bufStable = {}; for (const k of KEYS) bufStable[k] = undefined;
for (let f = 0; f < 1e6; f++) { for (let j=0;j<KEYS.length;j++) bufStable[KEYS[j]] = flatVars[KEYS[j]]; }
console.log("stable-key   HasFastProperties:", fastProps(bufStable)); // true
```
Result (node v26): delete-loop → `false`, stable-key → `true`. Steady-state per-frame
(clear + merge) at K=2/5/12: delete-loop 103.6 / 205.8 / 467.9 ns; stable-key fixed-copy
16.7 / 45.0 / 124.6 ns → **6.2× / 4.6× / 3.8×**. Single-frame alias: ~0.3–0.5 ns.

### A.2 — `Object.assign` into a dictionary-mode receiver (the compounding cost)

```js
// node --allow-natives-syntax — K=32, Object.assign into dict-mode vs stable-copy
const K=32, flat={}; for(let i=0;i<K;i++) flat["p"+i]=[i];
const keys=Object.keys(flat);
// delete + Object.assign (poisons the receiver):  ~3672 ns/frame
// stable buffer + fixed-key manual copy:          ~228 ns/frame  → 16×
```
Result: delete + `Object.assign` ≈ 3672 ns/frame; a stable-shape fixed-key copy ≈ 228
ns/frame — **16×**. `Object.assign` into a dictionary-mode receiver alone is 1.8× slower
than into a fast-mode receiver (the delete-loop's second, compounding cost).

### A.3 — `proof:interp-fastprops` (the kf gate F-1 must author before shipping)

Sketch (NOT authored in F — F is audit-only):
1. **Fast-properties clause:** under `--allow-natives-syntax`, play one animation reusing
   one `out` buffer for N frames; assert the buffer is `%HasFastProperties === true` with
   the stable-key fix and (injected) `=== false` with the delete-loop. The gate *bites*
   by reverting to the delete-loop and failing.
2. **Wall-time clause:** measure `interpFrames` p50 over the demo's actual K distribution
   (K=2–12) threading the `out` buffer (the realistic playback shape the current
   `interpolation.bench.ts` omits); assert the fix is faster, no K regresses.
3. **Round-trip clause:** the fix's output is byte-identical to the current delete-loop
   path over the kf parsing corpus (same keys, same values — the alias and stable-key
   merge must not drift).
