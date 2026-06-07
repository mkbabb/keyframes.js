# a-group-layering — the group + layering + compositor system

**Lane:** supplemental Tranche-G assay · branch `tranche-g-dev`
**Focus:** `src/animation/group.ts` — `AnimationGroup`, `transformFramesGrouped`,
the `replace`/`add`/`weighted` blend modes, the zIndex order, the `_grouped`
composite buffer, the layer whitelist seam, the `markRaw` reactive-sync (demo).
**Question:** how does the group STACK + RESOLVE multiple animations on a SINGLE
object — and is that resolution model correct, deterministic, and the right one?

**Headline:** the additive + weighted blend arms are **DEAD CODE** — proven by a
shaped runtime probe (numbers below). `add` and `weighted` both silently collapse
to `replace`. The cause is a value-shape mismatch the guard never matches:
`flatVars[key]` is a `ValueUnit[]` (a one-element array), but `isNumericUnit`
tests for a bare `ValueUnit`. This is the central SHIP. It also re-frames the
F.W8 `animation-composition` BOOK (deferred-ledger FB-1): the rAF-accumulate
"substrate" the ledger credits at `group.ts` is **not a working substrate — it is
a broken one**, so FB-1's rAF half is a FIX, not a green-field add.

Disposition tags per finding: SHIP-in-G / MEASURE-FIRST / BOOK / KILL / RECORD /
value.js-HANDOFF.

---

## §0 — The model, stated once (how the group resolves N anims on 1 target)

`transformFramesGrouped(t)` (`group.ts:238-367`) is the single-target compositor.
Per frame:

1. Clear the long-lived `_grouped` buffer in place via a stable-key null-fill
   (`group.ts:255-258`) — no `delete`, V8 fast-properties preserved (F.W4 S2).
2. Walk entries in zIndex order (`getEntries()` → sorted, `group.ts:154-161`).
3. For each enabled layer: refresh the child's `entry.values` in place
   (`animation.interpFrames(t, false, values)`, `group.ts:275-279`), then fold it
   into `_grouped` by the layer's `blendMode` with an inline whitelist key-skip
   (`group.ts:287-348`).
4. Compact: drop any grouped key no enabled child contributed (`group.ts:359-362`).
5. Call the group transform once with the merged buffer (`group.ts:364`).

The **resolution model** is: zIndex = paint order (low → high); `replace` =
last-writer-wins; `add` = numeric accumulate; `weighted` = lerp the existing
toward incoming by `weight`. The whitelist (`layer.properties: Set<string>`)
gates which keys a layer contributes. This is a sound, idiomatic model and maps
cleanly onto CSS/WAAPI `animation-composition` (`replace`/`add`/`accumulate`) and
onto Motion/GSAP's additive layering. The model is right. **The
implementation of two of its three arms does not run.**

---

## §GL-1 — `add` and `weighted` blend modes are DEAD CODE (collapse to replace)

**Disposition: SHIP-in-G (correctness bug, not enhancement). Instrument: a shaped
value-assertion blend test (named below) — currently NO test asserts a blended
number.**

### The defect

`flatVars[key]` is built at `frame-compiler.ts:364`:

```ts
acc[key] = value.map((v) => v.value);   // → ValueUnit[]  (an ARRAY)
```

So every leaf in `entry.values` / `_grouped` is a `ValueUnit[]` — for a scalar
property a **one-element array**. But the blend guard
(`group.ts:18-19`) tests for a bare `ValueUnit`:

```ts
const isNumericUnit = (value): value is ValueUnit<number> =>
    value instanceof ValueUnit && typeof value.value === "number";
```

An `Array` is never `instanceof ValueUnit`, so `isNumericUnit(existing)` and
`isNumericUnit(incoming)` are **always `false`**. Both branches:

- `add` (`group.ts:305-313`) → falls to `else { groupedValues[key] = incoming; }`
- `weighted` (`group.ts:331-342`) → falls to `else { groupedValues[key] = incoming; }`

i.e. both arms degrade to **plain replace**. The accumulate (`existing.value =
existing.value + incoming.value`, `group.ts:309-310`) and the lerp leaf
(`lerp(existing.value, incoming.value, layer.weight)`, `group.ts:335-339`) are
unreachable. The `lerp` import (`group.ts:1`) is dead. The `BlendMode` union, the
`LayerConfigPanel.vue` blend-mode picker (`controls/LayerConfigPanel.vue:4-10`,
`:24-33` weight slider), and the `weight` config (`constants.ts:189-190`) are all
a UI over a no-op.

### The proof (shaped runtime probe — numbers, not assertion)

Two children, both `opacity: 0→1` at `t=500` (each interpolates to `0.5`):

```
ADD blend   opacity result: 0.5   (additive-correct = 1.0)   → DEAD-REPLACE
```

`a: opacity 0→0` (rests 0), `b: opacity 0→1` (→0.5), `b` blended `weighted`
weight=0.5 over `a`:

```
WEIGHTED(0.5) result: 0.5   (lerp(0, 0.5, 0.5) = 0.25)       → DEAD-REPLACE
array elem instanceof ValueUnit: true   (confirms the array-wrap)
```

Both arms return the bare incoming value (`0.5`) — the replace result — instead of
the accumulate (`1.0`) / weighted (`0.25`) result. (Probe: a `CSSKeyframesAnimation`
pair into an `AnimationGroup` with the respective layer config, a capturing
`group.transform`, read `cap["opacity"][0].value`. Run live on `tranche-g-dev`.)

### Why it went uncaught

`test/group.test.ts` (425 L) tests blend-mode **config get/set only**
(`:330-409`) — never a blended numeric value. The closest, "last-write-wins for
conflicting properties" (`:106-124`), asserts only `result` is defined.
`test/zero-alloc.test.ts:28-49` builds a `mixedGroup()` that exercises all three
modes including `add` + `weighted` — but asserts **only buffer identity and
key-sets** (`:52-90`), never a value. The `add`/`weighted` arms have **zero
value-level coverage**. The gap-scorecard (`_SYNTHESIS-gap-scorecard.md`) has no
group/blend row — confirming this dimension is genuinely un-assayed.

### The fix (gestalt, not a patch)

The leaf is a `ValueUnit[]`. The blend must operate element-wise over the array
(it must also cover a multi-element leaf — see §GL-2). The minimal correct shape:

- guard on the **array** (`Array.isArray(existing) && Array.isArray(incoming)`),
  then per index blend the two `ValueUnit`s when both are numeric, else replace
  that index. Reuse the existing `isNumericUnit` per element.
- This keeps the in-place mutation (mutate `existing[i].value`) — zero-alloc
  preserved, the `_grouped` fast-properties discipline untouched.

The lerp/add leaves already exist (`group.ts:309-310`, `:335-339`); they move
one indirection inward (array element, not the array). This is a small, contained
correctness transposition — KISS, DRY, no new machinery.

### Instrument (the SHIP gate)

`proof:blend` — a 2-child value-assertion test: (a) two `opacity 0→1` children
mid-frame, `add` → exactly `1.0`; (b) `weighted` weight=0.5 → exactly `0.25`;
(c) a clamp/overflow case (`add` of two 0.8s → 1.6, and the documented contract
for whether the group clamps — see §GL-6). Falsifiable: reds today, greens on the
element-wise fix. This is the missing twin to `proof:zero-alloc` — that proved
the buffer doesn't allocate; this proves the buffer holds the RIGHT number.

---

## §GL-2 — multi-component leaf (color / multi-arg function) blend gap

**Disposition: SHIP-in-G (fold into the §GL-1 fix). Instrument: extend
`proof:blend` with a multi-component leaf.**

A scalar leaf is `ValueUnit[]` of length 1, but a multi-arg function value is
length > 1. Confirmed by probe: `transform: translate(0px,0px)→translate(100px,200px)`
flattens to TWO separate keys, each length 1:

```
transform.translateX -> ARRAY len=1 values=50
transform.translateY -> ARRAY len=1 values=100
```

So distinct transform **components** are already separate keys (good — "multiple
transforms on one element" composition works at the key level for the
component-decomposed transform path). BUT a leaf that stays a multi-element array
— a color `rgb(r,g,b)` or `oklab(l,a,b)` carrier whose components are NOT split
into separate keys — would, under the §GL-1 element-wise fix, need to blend each
of its N elements. The fix MUST iterate `min(existing.length, incoming.length)`,
not assume length 1. A length-1-only fix would be a special case (Mandate: NO
special cases). The element-wise loop in §GL-1 covers this for free **if written
as a loop from the start** — that's the gestalt shape, not a length-1 shortcut.

The `add` semantics on a color leaf is itself questionable (adding two oklab L
channels is not "compositing two colors") — but that is the SAME `concat-vs-sum`
semantic question the deferred-ledger NEW-39 / FB-1 flags
(`_SYNTHESIS-deferred-ledger.md:138`). The §GL-1 fix should make the leaf blend
*mechanically correct* (operate on the array); the *semantic* question of "what
does `add` mean for a color/transform-list" is the FB-1 BOOK (§GL-4).

---

## §GL-3 — z-order determinism: sort is correct but NOT stable-tie-broken

**Disposition: MEASURE-FIRST → likely SHIP (tiny). Instrument: an equal-zIndex
ordering test.**

`getEntries()` sorts by `a.layer.zIndex - b.layer.zIndex` (`group.ts:157`).
`Array.prototype.sort` is spec-stable since ES2019, so equal-zIndex layers keep
**insertion order** (constructor order = `Object.values(this.animations)` order =
key-insertion order). That is deterministic and the right tie-break (insertion =
"declared paint order"). BUT:

- `this.animations` is a plain object keyed by `getAnimationId` (`group.ts:127-133`).
  `Object.values` order is insertion order for string keys — fine — UNLESS an id
  is an integer-like string, in which case V8 reorders integer keys ascending
  ahead of string keys (the elements-kind / dictionary ordering rule). If
  `getAnimationId` can ever return a numeric string, the tie-break silently
  reorders. **MEASURE-FIRST:** check `getAnimationId`'s id shape (`engine.ts`,
  `getAnimationId`); if it's always a non-numeric string (e.g. `anim-<n>` or the
  `name`), this is a non-issue → RECORD. If it can be a bare counter number,
  there's a latent reorder → SHIP a stable insertion-index tie-break.

This is a determinism *seam*, not a known bug — flagged for the measure, not
asserted as broken.

---

## §GL-4 — FB-1 (`animation-composition` honoring) re-framed: the rAF half is a FIX

**Disposition: BOOK (honoring FB-1) — but the BOOK's premise is CORRECTED here.**

The deferred-ledger FB-1 (`_SYNTHESIS-deferred-ledger.md:138`) says the
`group.ts:84-174` `_grouped` null-fill machinery "is ALREADY the accumulation
substrate" for the rAF `add`/`accumulate` half. **That is the finding §GL-1
falsifies:** the substrate's accumulate arm does not run. The buffer machinery
(null-fill, zero-alloc, whitelist) is sound; the *blend leaf* is dead. So FB-1's
rAF half is not "wire the captured composition to the existing-working blend" — it
is "**fix the blend (§GL-1) THEN map `animation-composition` → blendMode**." The
ordering matters: §GL-1 (SHIP-in-G, a correctness fix with its own gate) must land
BEFORE FB-1's rAF half (the feature) can be honest.

The adapter already CAPTURES per-keyframe `composition` into
`ResolvedKeyframes.composition` (`adapter.ts:24-29,107,120-126`) but it is inert
(BOOKed honestly). FB-1's two gated halves stand:
(a) WAAPI lane: pass `composite` through `adapter → waapi.ts` (`waapi.ts` has NO
`composite` handling today — confirmed: only `easing`/`fill`/timing, `waapi.ts`
`toWAAPIOptions`); (b) rAF lane: map `composition` ∈ {replace, add, accumulate}
onto the (fixed) `group.ts` blend. The `proof:composition` instrument
(`_SYNTHESIS-deferred-ledger.md:138`: 2-keyframe `composite:add` mid-frame = sum,
WAAPI+rAF parity) is the right gate — but it now PRESUPPOSES `proof:blend`
(§GL-1) is green. Note the **semantic mismatch**: CSS `composite:add` on
`transform`/`filter` is list-CONCATENATION, not numeric sum (NEW-39); kf's `add`
is numeric sum. `proof:composition` must encode whichever semantic kf commits to
(recommend: numeric-add for scalar/component leaves, document that
list-concatenation transform composition is out of scope — the component
decomposition in §GL-2 already gives per-component additivity, which is the useful
half).

**Recommendation:** SHIP §GL-1 in G (correctness); keep FB-1 honoring BOOKed, but
re-tag the ledger so FB-1's rAF half reads "depends-on §GL-1" not "substrate ready."

---

## §GL-5 — `markRaw` reactive-sync (demo): correct but rAF-polled, not group-pushed

**Disposition: RECORD (already-idiomatic given the constraint) + one MEASURE-FIRST
note.**

The group is `markRaw`'d into App state (`demo/app/useSceneGroupSync.ts:76`,
`currentAnimationGroup.value = markRaw(group)`). Per MEMORY, this is the
established pattern: the group is a non-reactive raw object, and the UI syncs via
**rAF polling**, not Vue reactivity. The poll reads `animation.effectiveT` /
`animation.t` each frame (`controls/composables/useAnimationSync.ts:33,43,52`,
`composables/useAnimationProgress.ts:19`). The sync has a settled-idle window
(`useAnimationSync.ts:22-24,37`) that re-arms on a changing polled value and a
`wake()` for scrub-while-settled (`:96-100`) — this is a thoughtful, correct
bridge between the markRaw engine and reactive sliders. **Already-SOTA for the
markRaw constraint; do not re-raise.**

The one note (MEASURE-FIRST, low priority): the poll reads per-CHILD `t`, never
the group's COMPOSITE state. The blend result (`_grouped`) is never surfaced to
the UI — so `LayerConfigPanel`'s blend-mode/weight controls have no visual readout
of the composited value (compounding §GL-1: the user toggles `add` and sees
nothing change, partly because §GL-1 makes nothing change, partly because the UI
shows per-child progress not the composite). After §GL-1 lands, consider whether a
composite-state readout is wanted — but that is a demo enhancement, BOOK-able, not
a G requirement.

---

## §GL-6 — `add` accumulation has no clamp / range contract

**Disposition: BOOK (fold the decision into the §GL-1 / FB-1 gate) — a contract
gap, not a live bug (the arm is dead today).**

Once §GL-1 makes `add` live, `add`-ing two `opacity: 0.8` layers yields `1.6` —
out of the `[0,1]` range. The blend leaf (`group.ts:309-310`) does a raw
`existing.value + incoming.value` with NO clamp and NO range awareness. CSS
`animation-composition: add` likewise does not clamp at the composition stage
(clamping happens at use), so an un-clamped numeric add is arguably *correct* —
but it MUST be a stated contract, decided at the §GL-1 gate, not discovered.
value.js's `ValueUnit` carries no range metadata to clamp against per-property,
so a per-property clamp would be a **value.js-HANDOFF** (range-aware
ValueUnit) if wanted. **Recommendation:** decide "numeric add does not clamp;
clamping is the consumer's / the property's job" and encode it in `proof:blend`
case (c) (§GL-1). RECORD the value.js-HANDOFF as the only path to per-property
clamping, should it ever be wanted (do NOT special-case opacity in `group.ts` —
Mandate: NO special cases).

---

## §GL-7 — the whitelist seam is correct and idiomatic (ALREADY-SOTA)

**Disposition: RECORD (honest already-SOTA).**

The `layer.properties: Set<string>` whitelist is applied as an **inline
`for..in` key-skip** in each blend arm (`group.ts:289-291,298-300,325-327`) —
no `filteredValues` object, no `Object.entries`/`fromEntries` round-trip. The
F.W4 fold (per the code comments `group.ts:282-286`) retired the per-layer
intermediate object; the whitelist is now allocation-free and contributes to
`_groupedKeys` correctly (`computeGroupedKeys`, `group.ts:178-188`, applies the
same whitelist when sizing the clear set). `proof:zero-alloc`'s third case
(`zero-alloc.test.ts:72-90`) covers the whitelist's no-intermediate-object
property. This seam is at its gestalt — no finding. (The ONE latent coupling:
the whitelist is checked TWICE per frame — once in `computeGroupedKeys` for the
clear set, once in the blend arm — but `computeGroupedKeys` is memoized behind
`_groupedKeysDirty` and runs only on structural change, so the per-frame cost is
the single blend-arm check. Correct.)

---

## §GL-8 — per-child `entry.values` buffers: zero-alloc, correct (ALREADY-SOTA)

**Disposition: RECORD (honest already-SOTA).**

Each entry owns a long-lived `values` buffer (`group.ts:23,131`), refreshed in
place by `interpFrames(t, false, values)` (`group.ts:275-279`). This rides the
engine's F.W4 stable-key null-fill clear (`engine.ts:677-678,706-711`,
`clearBuffer`), so no per-child per-frame allocation and no stale-key leak. The
group's own `_grouped` buffer is the same idiom one level up
(`group.ts:90-99,255-258`). The whole composite path is zero-alloc in steady
state, gated by `proof:zero-alloc` (`zero-alloc.test.ts`). The
`a-engine-perf.md:415-417` audit already credits this — no new perf finding. The
buffers are correct; the BUG is purely in how their *contents* are blended
(§GL-1), not in the buffering. This is the important distinction: the perf
machinery is SOTA, the correctness leaf is dead.

---

## §GL-9 — `singleTarget` detection + the multi-target path (RECORD)

**Disposition: RECORD (correct; one robustness note → MEASURE-FIRST).**

`singleTarget` is computed by comparing every child's `targets[0]` to the first
child's `targets[0]` (`group.ts:139-141,206-209`). When true, the group blends
through `transformFramesGrouped`; when false, each child applies its own
interpolated vars to its own targets (`group.ts:383-387,484-489`). The split is
the right two-mode design (blend N→1, else fan-out N→N). The robustness note
(MEASURE-FIRST, low): the equality is `targets[0]` ONLY — a child with multiple
targets, or a child whose `targets[0]` matches but `targets[1]` differs, is
classified by its first target alone. For the demo's single-element scenes this
is always correct; for a hypothetical multi-target child it under-specifies.
RECORD unless a multi-target-child scenario is in scope (it is not, per the demo
constellation) → then a set-equality check would be the gestalt fix. Not a G item.

---

## Synthesis — dispositions

| # | Finding | file:line | Disposition | Instrument |
|---|---------|-----------|-------------|------------|
| GL-1 | `add` + `weighted` blend arms DEAD (collapse to replace) — leaf is `ValueUnit[]`, guard tests bare `ValueUnit`; proven `add`→0.5 (want 1.0), `weighted`→0.5 (want 0.25) | `group.ts:18-19,305-313,331-342`; `frame-compiler.ts:364` | **SHIP-in-G** | `proof:blend` (value-assertion: add=1.0, weighted=0.25, +overflow) |
| GL-2 | Multi-element leaf (color/multi-arg) blend must loop elements, not assume len 1 | `group.ts:305-342`; probe: `translate`→2 keys len 1; color→len N | **SHIP-in-G** (fold into GL-1 as an element loop) | extend `proof:blend` w/ multi-component leaf |
| GL-3 | z-order tie-break = insertion order (stable sort) — latent reorder IF `getAnimationId` returns numeric-string keys | `group.ts:157`; `engine.ts` getAnimationId | **MEASURE-FIRST** → SHIP iff numeric ids | equal-zIndex ordering test |
| GL-4 | FB-1 rAF half is a FIX not a green-field add — ledger's "substrate ready" premise falsified by GL-1; SHIP GL-1 before honoring FB-1 | `_SYNTHESIS-deferred-ledger.md:138`; `adapter.ts:24-29,120-126`; `waapi.ts` (no composite) | **BOOK** (re-tag FB-1: depends-on GL-1) | `proof:composition` (presupposes `proof:blend`) |
| GL-5 | demo markRaw + rAF-poll sync — correct/idiomatic; composite state not surfaced to UI | `useSceneGroupSync.ts:76`; `useAnimationSync.ts:33,43,52`; `useAnimationProgress.ts:19` | **RECORD** (+ BOOK composite-readout post-GL-1) | — |
| GL-6 | `add` has no clamp/range contract (once live) — un-clamped sum; per-property clamp = value.js-HANDOFF | `group.ts:309-310` | **BOOK** (decide at GL-1 gate) + **value.js-HANDOFF** (range-aware ValueUnit) | `proof:blend` case (c) |
| GL-7 | whitelist seam — inline `for..in` key-skip, zero-alloc | `group.ts:289-291,298-300,325-327`; `zero-alloc.test.ts:72-90` | **RECORD** (already-SOTA) | (covered) |
| GL-8 | per-child `entry.values` + `_grouped` buffers — zero-alloc, stale-free | `group.ts:23,90-99,255-258,275-279`; `engine.ts:706-711` | **RECORD** (already-SOTA) | `proof:zero-alloc` (existing) |
| GL-9 | `singleTarget` = `targets[0]`-only equality — correct for the demo; under-specifies multi-target children | `group.ts:139-141,206-209` | **RECORD** (MEASURE-FIRST iff multi-target child in scope) | — |

**The one SHIP-in-G that matters:** GL-1 (+ GL-2 folded in). It is a correctness
bug — two of three documented, UI-exposed blend modes do not run — caught by no
existing test, and it silently inverts the deferred-ledger's FB-1 premise. The fix
is a contained element-wise transposition of the existing (dead) blend leaves;
the gate is `proof:blend`, the missing value-level twin to `proof:zero-alloc`.

**Honest already-SOTA:** the buffer machinery (GL-7, GL-8) — null-fill clear,
whitelist key-skip, zero-alloc — is at its gestalt. The model (zIndex paint order,
replace/add/weighted, whitelist) is the right model. The defect is purely the
blend LEAF, not the compositor architecture.

**Cross-repo HAND-OFFs:** value.js (GL-6 range-aware `ValueUnit` for per-property
clamp — only if clamping is ever wanted; recommend NOT clamping, so this stays
RECORD-only).
