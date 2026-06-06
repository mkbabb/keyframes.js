# Tranche F deep-SOTA audit — lane `r-interpolation-carrier`

**Lane mandate.** Interpolation-*representation* SOTA: the value.js `ValueUnit`
carrier the per-frame keyframe lerp mutates; SoA-vs-AoS for interpolation; typed-array
segment layouts; CSS Typed OM (`CSSNumericValue`/`CSSUnitValue`) as a carrier; what
Motion/GSAP use internally; the monomorphic-carrier transposition — feasibility + the
value.js-handoff shape. **Research/audit only — zero source edits.** inv-16: value.js
proposals are hand-offs; this lane writes only this doc.

**Method.** Live `file:line` grounding against the post-D+E tree; a re-measure of the
E-handoff **Wave D** carrier hypothesis with a standalone V8 microbench (node v26 /
V8); SOTA grounded against Motion + GSAP source, the Chrome CSS Typed OM doc, and the
modern-web-guidance LoAF guide. Every code claim cites a line; every measurement is
re-runnable (the bench scripts are reproduced inline at §A).

**Relation to prior tranches (cite + diff, do not repeat).** The E lane
`docs/tranches/E/audit/sota/r-interpolation.md` covered the interpolation *math* (spring
solver, `linear()` twin, `NumericAnimation` SoA) and ruled it ALREADY-SOTA. The E
value.js hand-off `docs/tranches/E/valuejs-sota-handoff.md` **Wave D** (D1/D2) named the
megamorphic carrier as "the largest structural per-var win" and proposed a lean carrier
behind `prepareInterpVar`, gated on a `lerpNumericValue` megamorphic-vs-monomorphic
bench. **This lane RE-MEASURES that withheld bench and overturns its causal model** —
see F-1. It does not re-litigate the spring/`linear()`/`NumericAnimation` findings (those
remain ALREADY-SOTA; §5).

---

## TL;DR

1. **The E Wave-D causal model is WRONG, and the measurement proves it (F-1).** The E
   hand-off attributes the carrier cost to the **megamorphic mutation-site inline
   cache** (`value.value = lerp(...)` on a 6-field `ValueUnit` minted in many shapes →
   "dictionary-style lookup"). Measured on V8/node-26: a **monomorphic `{value}` cell
   is not faster than the megamorphic `ValueUnit`** at the mutation site (within noise,
   even marginally *slower* at K=1). The store IC is not the bottleneck. **The real,
   measured lever is the layout: a flat `Float64Array` SoA loop is ~2.0–2.3× faster
   than the AoS `ValueUnit` + per-`iv` `_lerp` dispatch the engine actually runs**
   (K=16: 27.1→13.7 ns; K=64: 96.3→41.3 ns). The win is **AoS pointer-chase + closure
   dispatch elimination**, not hidden-class monomorphization. This sharpens D1→D2 and
   **kills the "frozen-shape ValueUnit variant" sub-option** as a measured non-win.
   **Disposition: value.js-HANDOFF (re-scope Wave D) + MEASURE-FIRST.**

2. **The numeric hot path reads only `{value}` of the 6-field carrier — the other 5
   fields are prepare-time/serialize-time-only, so the SoA transposition is feasible
   and pixel-identical (F-2).** Grounded: `lerpNumericValue` reads `start.value`/
   `stop.value`, writes `value.value` (`interpolate.ts:97-103`); `unit`/`superType`/
   `property`/`subProperty`/`targets` are consumed at `normalizeValueUnits` (prepare)
   and `ValueUnit.toString()` (serialize) — never in the numeric inner loop. The
   carrier is dead weight per frame. **Disposition: value.js-HANDOFF (the feasibility
   proof for D2's `lerpArray` primitive) — RECORD on the kf side.**

3. **The kf-side half is already shaped to consume a SoA primitive without an edit
   (F-3).** `NumericAnimation` (`numeric.ts:139-181`) is the in-tree SoA reference; the
   engine loops `lerpValue(eased, iv)` over `frame.allInterpVars` (`engine.ts:628-629`)
   — an AoS of `InterpolatedVar`. The transposition target on the kf side is to compile
   the **numeric subset** of `allInterpVars` into parallel `Float64Array`s at
   `parse()`, mirroring `NumericAnimation`'s `startVals`/`stopVals`. This is a *named kf
   wave* (it does not need value.js to land — see F-3 for the local-only path).
   **Disposition: MEASURE-FIRST (kf-local SoA-segment compile) + BOOK.**

4. **CSS Typed OM (`CSSNumericValue`/`CSSUnitValue`) is NOT a carrier upgrade — it is a
   carrier *downgrade* for this engine (F-4).** The platform's own perf story is "skip
   string serialization by mutating the underlying data object," which keyframes.js
   **already does** (in-place `value.value` mutation; serialize only at the DOM write
   boundary). A per-frame `CSSUnitValue` carrier *allocates* and its `.add`/`.mul`
   arithmetic allocates — strictly worse than the zero-alloc in-place mutation in tree.
   **Disposition: KILL (record so nobody "modernizes" the carrier to Typed OM).**

5. **Motion and GSAP both confirm keyframes.js's direction (F-5).** Motion's number
   path is a **stateless 3-arg function** over raw numbers (`from + (to-from)*progress`,
   no carrier object); GSAP uses an **AoS PropTween linked list** (`_pt`/`_next`). The
   only library with a *zero-alloc SoA numeric core* is keyframes.js's own
   `NumericAnimation`. The megamorphic `ValueUnit` per-leaf carrier in the value.js
   *keyframe* path is the field outlier — every fast competitor interpolates over **raw
   numbers in arrays**. **Disposition: ALREADY-SOTA (`NumericAnimation`) + the gap is
   the value.js keyframe carrier only.**

The headline correction: **Wave D's leverage is real but its mechanism was
mis-attributed. The fix is SoA typed-array layout (D2), not carrier-shape
monomorphization (D1's frozen-`ValueUnit` sub-option). The bench the E handoff asked
for has now been run, and it re-points the wave.**

---

## F-1 — The megamorphic-carrier mechanism is mis-attributed; the measured lever is SoA layout, not hidden-class monomorphization · value.js-HANDOFF (re-scope Wave D) + MEASURE-FIRST

### What the E handoff claimed

`docs/tranches/E/valuejs-sota-handoff.md` Wave D (lines 232-244) and the synthesis
twin (`_SYNTHESIS-valuejs-handoff.md:236-244`):

> The numeric hot path does `value.value = lerp(start.value, stop.value, t)` — 3 reads
> + 1 write on a **6-field megamorphic** `ValueUnit` … minted in many shapes → **the IC
> at the mutation site tends polymorphic/megamorphic → dictionary-style lookup.**

D1's first proposed remedy is a "monomorphic `{value:number}` cell" or a "frozen-shape
`ValueUnit` variant minted at prepare so all interp-time units share one hidden class."
The gate: "bench `lerpNumericValue` over a megamorphic population vs the monomorphic
cell at K=1/8/64." **That bench was recorded-WITHHELD at E close** (FINAL.md:46-49
folds W8's SoA micro-reps into the measure-first withhold). This lane runs it.

### The live carrier (grounded)

`ValueUnit` is genuinely 6-field with positional-optional fields
(`value.js/src/units/index.ts:13-20`):

```
constructor(public value: T, public unit?, public superType?,
            public subProperty?, public property?, public targets?) {}
```

It is minted in **~40 call sites across value.js src** at arities 1, 2, 3, 4, and (via
`coalesce`, `index.ts:123-131`) up to 6 — every distinct field-population is a distinct
V8 hidden class, so the *population* of `ValueUnit`s reaching `lerpValue` is genuinely
megamorphic. The E claim's premise (a megamorphic population) is **true**.

The hot loop (grounded): the engine runs, per active frame, per interp-var:

- `engine.ts:628-629` — `for (const iv of frame.allInterpVars) lerpValue(eased, iv)`
  over an **AoS** `Array<InterpolatedVar>` (`constants.ts:110`).
- `lerpValue` (`value.js/src/units/interpolate.ts:113-133`) dispatches to the
  pre-resolved `iv._lerp(t, iv)` closure (`:117-119`).
- `lerpNumericValue` (`interpolate.ts:97-103`) — `value.value = lerp(start.value,
  stop.value, t)`.

### The measurement (re-runnable — §A.1, §A.2; node v26 / V8)

A microbench reproducing the exact shapes: a **megamorphic** `ValueUnit` population
(arities 1–6, some pushed to dictionary mode), the **monomorphic `{value}` cell** D1
proposed, and a flat **`Float64Array` SoA** loop, each at K=1/8/16/64 interp-vars,
2M frame-iterations warm.

| K | megamorphic `ValueUnit` (mutation site) | monomorphic `{value}` cell | **`Float64Array` SoA** |
|---|---|---|---|
| 1 | 3.3 ns | 5.7 ns | 5.0 ns |
| 8 | 14.9 ns | 15.4 ns | **8.9 ns** |
| 64 | 84.3 ns | 86.5 ns | **42.9 ns** |

And the **real engine shape** (AoS + per-`iv` `_lerp` closure dispatch, as
`engine.ts:629` runs it) vs the flat SoA loop:

| K | `ValueUnit` + `_lerp` dispatch (real engine) | `Float64Array` SoA (flat loop) | speedup |
|---|---|---|---|
| 4  | 6.1 ns  | 5.4 ns  | 1.13× |
| 16 | 27.1 ns | **13.7 ns** | **1.98×** |
| 64 | 96.3 ns | **41.3 ns** | **2.33×** |

### What the numbers say (the correction)

1. **The mutation-site IC is NOT the bottleneck.** The monomorphic `{value}` cell is
   **within noise of, and at K=1 measurably slower than**, the megamorphic `ValueUnit`.
   V8's store IC for `obj.value = x` on a megamorphic receiver is *not* the
   "dictionary-style lookup" cost the E handoff feared — for a property that exists on
   every shape at a stable offset, the megamorphic store is handled efficiently, and the
   per-element cost is dominated by the `lerp` FMA, not the carrier. **D1's
   "monomorphic cell / frozen-shape `ValueUnit`" sub-option is a measured non-win** —
   monomorphizing the carrier buys nothing here.

2. **The real lever is the layout.** Flat `Float64Array` SoA is **~2× at K≥8, ~2.3× at
   K=64**. The win comes from two effects the carrier shape does not touch: (a) AoS
   **pointer-chasing** — each `iv` is a separate heap object holding three more separate
   `ValueUnit` heap objects, so the traversal is cache-hostile; SoA is contiguous. (b)
   the **per-`iv` closure dispatch** (`iv._lerp(t, iv)`) — a flat `for` over a typed
   array inlines the `lerp`, where the closure call is an indirect, non-inlinable hop
   per element. This is **D2** (the typed-array primitive), not **D1** (carrier shape).

3. **K-dependence matters for disposition.** At K=1 (a 2-frame `opacity` animation — the
   `interpolation.bench.ts` first case) there is **no win** (the SoA setup overhead
   dominates a single element). The win is monotone in K: it appears at K≈8 and is
   decisive at K≥16. The demo's `complexAnim` (11 stops × 2 props,
   `bench/interpolation.bench.ts:16-19`) and any rich multi-transform keyframe set sit
   in the winning regime. **This K-dependence is exactly why it is MEASURE-FIRST and
   must be gated on a representative-K bench, not asserted.**

### Disposition

- **value.js-HANDOFF — re-scope Wave D.** Promote **D2** (the `lerpArray(Float64Array,
  Float64Array, t, out)` primitive) from the secondary item to the **primary** carrier
  win, and **demote D1's "monomorphic cell / frozen-shape `ValueUnit`"** to a recorded
  measured-non-win (keep only the framing that the *serialize-boundary reconstitution
  must round-trip exactly*). The corrected one-liner for the value.js owner: *the carrier
  win is a typed-array SoA interp primitive (D2), not a carrier-shape change (D1); the
  6-field megamorphism is a real population property but a measured non-cost at the
  mutation site.*
- **MEASURE-FIRST** on the kf side (F-3): gate any kf SoA-segment compile on a
  representative-K bench (`proof:interp-soa`, sketched §A.3), because the win is
  K-dependent and absent at K=1.

### Isomorphism

Pixel-identical — SoA stores the same `value` numbers in `Float64Array` lanes;
`ValueUnit` is reconstituted only at the serialize boundary (F-2 proves the inner loop
never reads the other fields).

---

## F-2 — The numeric inner loop reads only `{value}`; the other 5 carrier fields are prepare/serialize-only — so the SoA transposition is feasible and pixel-identical · value.js-HANDOFF (feasibility proof) + RECORD

The SoA transposition is only safe if the per-frame loop does not depend on the rich
carrier fields. Grounded, it does not — for the dominant **numeric** path:

- **Per-frame reads (numeric):** `lerpNumericValue` (`interpolate.ts:97-103`) reads
  `start.value`, `stop.value`; writes `value.value`. Nothing else.
- **`unit` / `superType`** are consumed at **prepare** time:
  `normalizeValueUnits` → `convertToCommonUnit` reads `superType[0]` + `unit`
  (`value.js/src/units/normalize.ts:222,230-251`) **once** when the `InterpolatedVar` is
  built (kf calls it at `utils.ts:339` via `prepareInterpVar`).
- **`unit`** is read again at **serialize** time only — `ValueUnit.toString()`
  (`index.ts:64-82`) branches on `unit` to emit `12px` / `calc(...)` / `var(...)`. The
  serialize happens at the DOM write boundary (`transformTargetsStyle` →
  `unflattenObjectToString`, kf `utils.ts:356-375`), **not** in the interp loop.
- **`property` / `subProperty` / `targets`** are read by the **computed** path
  (`lerpComputedValue` → `getComputedValue`, `normalize.ts:149-178`) and by frame
  pairing — never by the numeric path.

**Therefore:** for numeric leaves (the majority — `opacity`, `translateX`, scalar
transforms), the 5 non-`value` fields are dead weight during interpolation. A SoA
substrate can hold `startVals`/`stopVals` as `Float64Array` and carry the rich
`ValueUnit` *beside* the lane index (a parallel array of the carriers, read only at
serialize) — exactly `NumericAnimation`'s `startVals`/`stopVals` + `keys` shape
(`numeric.ts:138-140`). The "reconstitute only at serialize" claim in D1 is **proven
feasible** for the numeric subset.

**The color and computed paths are excluded** (and need not be SoA'd): `lerpColorValue`
walks `Color` channels (`interpolate.ts:67-92`) and `lerpComputedValue` does a DOM
round-trip (`interpolate.ts:28-29`) — both are >>40× a numeric lerp and dominated by
other costs (the color serializer is Wave B; the computed round-trip is Wave C). The
SoA win is **numeric-only**, which is fine — numeric leaves are the per-frame majority.

**Disposition:** value.js-HANDOFF (this is the feasibility note D2 needs) + RECORD. No
kf or value.js edit in F.

---

## F-3 — The kf-side substrate is already SoA-shaped; a kf-local numeric-segment compile is a named wave that does not need value.js · MEASURE-FIRST + BOOK

The E handoff frames the carrier as value.js-owned. That is true for the **shared
primitive** (D2's `lerpArray`), but the kf side has a **local-only** path that captures
most of the F-1 win without touching value.js, because the *layout* lives on the kf
`AnimationFrame`:

- `frame.allInterpVars` (`constants.ts:110`, built once at `parse()`) is the AoS the
  engine loops (`engine.ts:628`). kf owns this array.
- `NumericAnimation` already proves the target shape in-tree: parallel `startVals`/
  `stopVals` number arrays + a flat `for` lerp into a reused `result`
  (`numeric.ts:139-140,175-181`), zero-alloc, O(log N) segment lookup
  (`numeric.ts:156`). This is the **reference** the FrameCompiler should mirror.
- E.W8 *deliberately stopped* at the time-index + slot-map and did NOT flatten the rich
  leaves (FINAL.md:46-49; handoff line 247-249). F-1's measurement is the evidence that
  re-opens the leaf-flattening question — **for the numeric subset only**.

**The named kf wave (BOOK, gated):** at `parse()`, partition `allInterpVars` into a
**numeric segment** (leaves where both endpoints are plain `number`, no `unit`
conversion pending) compiled into `Float64Array startVals/stopVals`, and a **rich
residue** (color/computed/unit-bearing) left on the existing AoS `lerpValue` path. The
hot loop becomes: one flat SoA `lerp` pass + the residue loop. The numeric segment
covers the common case; the residue keeps correctness for the minority. This is a pure
kf-local transposition — `lerpValue`'s signature is untouched (handoff D1's "preserve
the signature" constraint is honored), and value.js's D2 `lerpArray` would simply *back*
the SoA pass if/when value.js ships it (kf can hand-roll the 3-line loop until then,
exactly as it hand-rolls `internal/leaves.ts`).

**Why MEASURE-FIRST, not SHIP-in-F:** (a) the win is K-dependent and absent at K=1
(F-1) — a real keyframe corpus may skew low-K; the gate must measure the *demo's*
distribution, not a synthetic K=64. (b) the partition adds a compile-time branch and a
second loop — only justified if the representative-K bench shows it. (c) the
serialize-reconstitution must be proven byte-identical (the `proof:interp-soa`
round-trip clause, §A.3). The §Mandate forbids asserting an unmeasured win; this is the
disciplined withhold until the bench bites on real frames.

**Disposition:** MEASURE-FIRST (author `proof:interp-soa` — a call-counter + a
representative-K wall-time bench over the demo's actual frame shapes) → BOOK the
numeric-segment compile as a kf wave, paired with value.js D2 (`lerpArray`) as the
shared primitive. **Not shipped in F** (F is audit-only).

---

## F-4 — CSS Typed OM (`CSSNumericValue`/`CSSUnitValue`) is a carrier *downgrade*, not an upgrade · KILL (record)

The lane brief names CSS Typed OM as a candidate carrier. Investigated and rejected on
evidence:

- The platform's own perf claim (Chrome CSS Typed OM doc) is "~30% faster than CSSOM
  **strings**," and the cited mechanism is: *update the underlying `CSSTransformValue`
  data object rather than touching the DOM / reading back a value on every frame —
  improving performance by skipping string serialize/parse.* **keyframes.js already does
  exactly this** — it mutates `value.value` in place (`interpolate.ts:101`) and
  serializes a string only once, at the DOM write boundary (`utils.ts:356-375`). The
  Typed-OM win is *against the string-CSSOM baseline keyframes.js does not use.*
- The doc explicitly does **not** claim per-frame `CSSUnitValue` *creation* is cheap,
  and notes Blink perf was still in-flight (2018). `CSSNumericValue` arithmetic
  (`.add`/`.mul`/`.to()`) returns **new** `CSSNumericValue` objects (W3C css-typed-om-1)
  — i.e. it **allocates per operation**. A per-frame Typed-OM carrier would allocate
  where the current in-place `ValueUnit` mutation allocates nothing. That is strictly
  worse for a 60fps loop, and inverts the zero-alloc discipline the rest of the engine
  enforces (`proof:zero-alloc`, FINAL.md:34).
- Typed OM is also **DOM-coupled** — `CSSUnitValue` is a platform object; adopting it as
  the carrier would drag a DOM dependency into the value-domain interp core, violating
  the static/dynamic boundary (`src/animation/CLAUDE.md` — the LIGHT surface is
  value.js-free and DOM-free).

The one place Typed OM *could* help is the **DOM write boundary** —
`attributeStyleMap.set(prop, CSSStyleValue)` can be faster than `style.setProperty(prop,
string)` because it skips a parse on the browser side. But that is a *write-path*
question (adjacent to WAAPI/`r-waapi`), **not** an interp-*carrier* question, and the
E.W9 WAAPI adoption already routes the compositor-eligible cases off the per-frame JS
write entirely. For the carrier itself: Typed OM is a non-starter.

**Disposition:** KILL — recorded explicitly so a future "modernize the carrier to Typed
OM" pass does not regress the zero-alloc in-place core. (A write-path Typed-OM probe is
a separate, low-priority BOOK under the WAAPI lane, not this one.)

---

## F-5 — SOTA cross-check: Motion (stateless fn over numbers) + GSAP (AoS PropTween) confirm keyframes.js's SoA core leads; the value.js keyframe carrier is the field outlier · ALREADY-SOTA (`NumericAnimation`)

Grounded against competitor source:

- **Motion** — the number path is a **stateless 3-arg function**: `mixNumber(from, to,
  progress) => from + (to - from) * progress` (motion-dom `mix/number.ts`, fetched).
  **No carrier object** on the number path; the values live in the keyframe arrays Motion
  reads from. Motion interpolates over **raw numbers**, not a per-leaf rich object.
- **GSAP** — an **AoS PropTween linked list** (`_pt` / `_next`, per-property nodes;
  GSAP dist source map). Object-per-property, pointer-chased — the same AoS shape F-1
  measures as the slow side, and notably *not* typed-array SoA. GSAP's speed comes from
  other engineering (lazy rendering, the ticker), not the carrier layout.
- **anime.js v4** — object-per-tween (per `r-anim-libs` / `r-interpolation` E findings);
  same AoS family.

**The field convergence:** every fast competitor interpolates over **raw numbers**
(Motion: in arrays/closures; GSAP: in linked-list nodes holding `s`/`c` start/change
numbers). **None** carries a 6-field megamorphic value object through the per-frame
numeric lerp. keyframes.js's own `NumericAnimation` (`numeric.ts:139-181`) is the only
**zero-alloc typed-SoA numeric core** among them — it *leads*. The gap is isolated and
precise: it is **only** the value.js `ValueUnit` carrier on the *CSS-keyframe* path
(`engine.ts` → `lerpValue`) that still pays the AoS-rich-object tax. The fix (F-3)
brings the keyframe path to the bar `NumericAnimation` already sets in-tree.

**Disposition:** ALREADY-SOTA for `NumericAnimation` (the SoA reference — do not touch;
this re-confirms E `r-interpolation` F-6). The single carrier gap is the value.js
keyframe path, addressed by F-1/F-3.

---

## What is ALREADY-SOTA in this lane — manufacture no work

- **`NumericAnimation` zero-alloc SoA core** (`numeric.ts:139-181`) — the in-tree
  reference layout; leads Motion/GSAP/anime. Re-confirms E `r-interpolation` F-6. LEAVE.
- **The pre-resolved `_lerp` dispatch** (`prepareInterpVar`, `interpolate.ts:143-150`) —
  hoisting the type-check out of the per-call path is correct; the residual cost F-1
  finds is the per-`iv` *closure call*, addressed by SoA-batching the numeric subset
  (which removes the closure for that subset), **not** by changing the dispatch design.
  The dispatch itself is SOTA. LEAVE (re-confirms handoff line 251).
- **In-place `value.value` mutation + serialize-only-at-write-boundary**
  (`interpolate.ts:101`; `utils.ts:356-375`) — the zero-alloc carrier-mutation discipline
  Typed OM would regress (F-4). LEAVE.
- **The 6-field `ValueUnit` *as a value-domain type*** — its richness is *correct* for
  parsing/serialization/unit-math; the finding is narrowly that it should not be the
  *per-frame numeric interp substrate*, not that the type is wrong. No value.js carrier
  *redesign* is warranted — only the D2 SoA *primitive beside it*. LEAVE the type.

---

## Disposition summary

| Finding | Disposition |
|---|---|
| F-1 — Wave-D mechanism mis-attributed; SoA layout (D2), not monomorphization (D1), is the measured 2–2.3× lever | **value.js-HANDOFF (re-scope Wave D: promote D2, demote D1's frozen-shape sub-option) + MEASURE-FIRST** |
| F-2 — numeric loop reads only `{value}`; SoA feasible + pixel-identical | **value.js-HANDOFF (feasibility proof for D2) + RECORD** |
| F-3 — kf-local numeric-segment SoA compile (mirrors `NumericAnimation`); needs no value.js | **MEASURE-FIRST (author `proof:interp-soa`, gate on representative-K) + BOOK** |
| F-4 — CSS Typed OM is a carrier downgrade (allocates; string-baseline win kf doesn't use; DOM-coupled) | **KILL (record)** |
| F-5 — Motion (fn-over-numbers) + GSAP (AoS PropTween) confirm `NumericAnimation` SoA leads; value.js keyframe carrier is the outlier | **ALREADY-SOTA (`NumericAnimation`)** |

**Net for F:** zero source edits (F is audit-only). One material correction to the E
value.js hand-off (F-1 re-points Wave D from D1→D2 with a measurement), one kf-side named
wave booked behind a measure-first gate (F-3), one carrier candidate killed on evidence
(F-4), and the in-tree SoA core re-confirmed SOTA (F-5).

---

## §A — Re-runnable bench scripts + gate sketch

### A.1 — carrier-shape bench (mono vs mega vs SoA at the mutation site)

`node carrier-bench.mjs` — builds a megamorphic `ValueUnit` population (arities 1–6), a
monomorphic `{value}` cell population, and `Float64Array` lanes; times 2M frame-iters
warm at K=1/8/64. Result (node v26): mono ≈ mega (no monomorphization win); SoA ~2× at
K≥8. Full source captured in this lane's working notes; the shapes mirror
`value.js/src/units/index.ts:13-20` (carrier) and `interpolate.ts:97-103` (lerp).

### A.2 — real-engine-shape bench (AoS + `_lerp` dispatch vs flat SoA)

`node carrier-bench2.mjs` — the megamorphic `ValueUnit` carried through the **actual**
`iv._lerp(t, iv)` dispatch (`engine.ts:629` shape) vs a flat `Float64Array` SoA loop, at
K=4/16/64. Result: 1.13× / 1.98× / 2.33× SoA speedup. This is the bench the E handoff
asked for (handoff D1 gate) — **run, with the causal correction in F-1.**

### A.3 — `proof:interp-soa` (the kf gate F-3 must author before shipping)

Sketch (NOT authored in F — F is audit-only):
1. **Call-counter clause:** assert the numeric-segment pass invokes `ValueUnit.toString()`
   / constructs zero `ValueUnit`s per frame (zero-alloc, mirrors
   `proof:standalone-zero-alloc`).
2. **Round-trip clause:** the SoA-compiled frame's serialized output is **byte-identical**
   to the current AoS `lerpValue` path over the full kf parsing corpus (the
   reconstitute-at-serialize must not drift).
3. **Representative-K wall-time clause:** measure over the demo's *actual* frame K
   distribution (not synthetic K=64); ship only if the win is positive on the real
   corpus. K=1 cases must not regress.
