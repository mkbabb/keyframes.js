# Assay — Compositor / Stacking / Layering Semantics (static, code-level)

**Tranche U · OD-U14 semantics lane · 2026-07-10**
**Scope:** `src/animation/group/` (group · lifecycle · compositor · soa · springs ·
entries · layer-api · yield-batch) + the group↔engine hand-off
(`engine/interpolate.ts`, `compile/plain-vars.ts`) + the demo layer surface
(`LayerConfigPanel` / `useAnimationGroupActions`).
**Method:** read every file in the zone; verified the *documented* blend semantics
(`replace`=z-order, `add`=accumulate, `weighted`=lerp-by-weight) against the actual
math; traced the SoA fold + the plain-vars projection for leaf-identity stability;
mapped every "built once" cache for the C14 pathology class.
**READ-ONLY. No patches. Cures are gestalt.**

---

## Headline

The C14 amiga freeze (`defect-amiga-suspend-resume.md`) is **not a lone bug — it
is one instance of a two-instance pathology class**, and the *second* instance sits
in the flagship "zero-alloc 3.7×" **SoA fold** and is reachable **from the shipped
demo** the moment a user picks `add` or `weighted` on a group whose child has ≥3
keyframes. Both caches (`plain-vars.ts` writers, `soa.ts` `carriers`/`incomings`)
capture `ValueUnit` **leaf-array references** under the false premise "structure is
stable, only `.value` changes" — a premise `interpFrames`'s single-active-frame
**alias re-point** (`interpolate.ts:187-194`) violates at every segment boundary.
Beyond that class, the blend math itself is **unit-blind** and **colour-blind**
across layers, and `weighted` is a non-normalized order-dependent sequential lerp
that silently drops its weight for a bottom/lone layer. `replace` z-order is
correct.

---

## What is CORRECT (verified, stated so the assay is falsifiable)

- **`replace` = strict z-order last-wins per property.** `getEntries()`
  (`group.ts:189-196`) sorts ascending by `layer.zIndex` (stable sort; equal
  zIndex → insertion order), the `replace` arm reference-assigns
  `groupedValues[key] = incoming` (`compositor.ts:98-107`), highest zIndex writes
  last. Re-read fresh from `values[key]` every frame → **NOT** stale (the reason
  cube dodges C14). ✔
- **Partial-overlap / disjoint property sets across layers** — each key is
  independent; `computeGroupedKeys` unions, the null-fill clears, compaction drops
  the uncontributed. Semantically correct (perf caveat below). ✔
- **Same property at different keyframe times across layers** — each child samples
  at its own `t`; `replace` z-orders the results. ✔
- **WAAPI vs compositor** — group children are `managed = true` and driven through
  `interpFrames` directly; they throw on their own `play()` and never reach
  `waapi/delegation.ts`. So the compositor and the WAAPI compositor-thread path
  **never co-drive** one target — no double-apply. ✔
- **Enabled-toggle rebuild** — `setLayerConfig` → `invalidateEntries()`
  (`layer-api.ts:34`) sets `_groupedKeysDirty`, which drops `_soaPlans` AND
  `_plainProj` (`compositor.ts:47-55`); the next frame rebuilds. So toggling
  `enabled` correctly re-arms both caches (it does *not* fix the staleness — see D1
  — it merely re-captures fresh refs that go stale again at the next boundary). ✔
- **`add` un-clamped** — `existing.value += incoming.value` (`compositor.ts:231`)
  and the Float64 `+=` fold (`soa.ts:142`) both leave `0.8+0.8→1.6`. ✔

---

## Defects

### D1 (CRITICAL) — the SoA fold caches leaf refs that go stale at segment boundaries: the un-found C14 sibling, reachable from the demo

**Seam:** `group/soa.ts:73-104` (`SoALayerPlan.carriers/incomings`), `soa.ts:198-253`
(`buildSoAPlans` capture), `soa.ts:123-146` (`groupSoABlendLayer` fold);
re-pointing source `engine/interpolate.ts:187-196`; plan drop only on structural
dirty `compositor.ts:42-56`.

`buildSoAPlans` captures `carriers[s]` / `incomings[s]` as **the actual
`ValueUnit<number>` element objects** taken from `entry.values[key]` / the lower
layer's leaf at plan-build time (`soa.ts:227-230`). The plan is rebuilt **only** on
`_groupedKeysDirty` (a structural change); a keyframe-segment crossing is **not**
structural, so the plan persists. But each frame `compositeFrame` calls
`animation.interpFrames(animation.t, false, values)` (`compositor.ts:88-92`), and
`interpFrames`'s single-active-frame path does `Object.assign(out, fv)` where `fv`
is **the newly-active frame's `flatVars`** (`interpolate.ts:187-194`). Because every
`AnimationFrame` owns a **distinct** `flatVars` leaf-array object
(`frame-compiler.ts:409-415` — `acc[key] = value.map(...)`, one per frame), the
identity of `entry.values[key]` **changes** when the child crosses from segment
`[0,2000]` into `[2000,4000]`. The SoA plan still folds the **orphaned** old-segment
leaf, and `processFrame` only mutates the **active** frame's leaves — so:

1. `incomings[s].value` (read at `soa.ts:137/142`) is **frozen** at the boundary
   value → the `add`/`weighted` contribution stops advancing; and
2. `carriers[s].value = buf[s]` (`soa.ts:145`) writes back into the **orphaned**
   carrier leaf, which is **no longer** the leaf `groupedValues[key]` points at
   (the lower `replace` layer re-pointed `_grouped[key]` to the fresh leaf) — so
   the folded result is **written to a leaf the transform never reads**. The
   composite silently degrades to the replace layer alone, unblended.

This is **byte-for-byte the C14 amiga pathology** (`plain-vars.ts` writers, D2),
displaced into the `add`/`weighted` path. It is **not theoretical**:
`LayerConfigPanel.vue:69` ships a live `["replace","add","weighted"]` selector wired
through `useAnimationGroupActions.ts:45` → `group.setLayerConfig`, and the transport
editor authors arbitrary (≥3-stop) keyframes. A user selecting `add`/`weighted` on
such a group watches it freeze at the first boundary exactly as amiga does.

The false premise is stated verbatim at `soa.ts:63-71`: *"both alias `frame.flatVars`
units whose `.value` `interpFrames` mutates in place, so the refs are
frame-stable."* True **within** a segment (same active frame → same leaf identity),
**false across** one.

**Cure (gestalt, shared with D2):** the plan must re-resolve its `(carrier,
incoming)` from the **live** `_grouped[key]` / `entry.values[key]` leaf each fold,
not from a snapshot — i.e. store the plan as a **view keyed by `(flatKey,
elementIndex)`** and dereference the current leaf per frame, OR invalidate
`_soaPlans` + `_plainProj` on an **active-frame-set change** signal (a per-child
"active frame changed" bit), not only on structural change. Option 1 preserves the
zero-alloc numeric fast path; whichever is chosen, D1 and D2 are ONE fix — the
compositor's cached projections must be *views over the live composite*, which is
what "refresh" already claims to be.

---

### D2 (CRITICAL — CONFIRMED, extends the dossier) — the plain-vars group projection is the same stale-leaf pathology; it and D1 are ONE class

**Seam:** `compile/plain-vars.ts:30-43` (`PlainLeafWriter.units` caches the leaf),
`plain-vars.ts:120-128` (`refreshPlainProjection` re-reads the cached `w.units`),
`compositor.ts:172-182` (group refresh path); re-point source identical to D1
(`interpolate.ts:187-194`).

Independently re-derived here from the code and **confirmed** against
`defect-amiga-suspend-resume.md`: `buildPlainProjection` stores `units` = the live
`_grouped[flatKey]` leaf **at build time** (`plain-vars.ts:105-109`);
`refreshPlainProjection` dereferences that **cached** `w.units[0].value`, never
re-reading `_grouped[flatKey]`. When the `replace` compositor re-points
`_grouped[key]` at a new active frame's leaf (segment crossing), the projection
keeps reading the orphaned leaf → the custom `transform` receives a frozen number →
the amiga mesh freezes at `t≈2000ms`. The docstring premise (`plain-vars.ts:19`:
*"structure is stable … only `.value` changes"*) is the **same** false premise as
D1's `soa.ts:63-71`.

**Why this belongs in the semantics assay (beyond the dossier):** the dossier framed
this as "why only amiga." The assay's finding is stronger — the *standalone* engine
path is correct **for an unrelated reason** that does NOT generalize to the group.
`processFrame` (`interpolate.ts:297-307`) uses `frame._plainProj`, a **per-frame**
projection over that frame's **own** stable leaves, and always uses the **active**
frame's projection — so a segment crossing swaps to the right projection. The group
has **one shared projection over `_grouped`**, whose leaf identities are re-pointed
under it. The invariant the whole class violates: *a cache of leaf references is only
valid while the leaf-array identities it captured remain the ones the source map
points at.* Both group caches (SoA, plain-vars) break it; both frame-local caches
(`frame._plainProj`, `frame._numericPlan`) honour it. **Same cure as D1.**

---

### D3 (MAJOR) — `add` / `weighted` blend is UNIT-BLIND across layers

**Seam:** `soa.ts:56-57` (`isNumericUnit`), `compositor.ts:227-235` (`add` element
loop), `compositor.ts:257-269` (`weighted` element loop), `soa.ts:217-230` (SoA
partition).

`isNumericUnit` is `value instanceof ValueUnit && typeof value.value === "number"`
— it inspects **only** the numeric type of `.value`, **never `.unit`**. A `10px`
leaf and a `50%` leaf are **both** numeric, so `add` computes
`existing.value += incoming.value` → `10 + 50 = 60`, carrying `existing`'s unit →
**`60px`** (the `%` silently dropped); `weighted` does `lerp(10, 50, w)` → a raw
number lerp with no unit reconciliation. The forward interp path never hits this
because value.js normalizes units **within a keyframe pair**; but the **cross-layer**
add/lerp has **no** such reconciliation — it blends incommensurable quantities
numerically and keeps whichever unit the lower layer parked. `defaultLayerConfig`
(`defaults.ts:75-80`) offers no unit contract, and the demo blend selector exposes
this directly.

**Cure:** the numeric-pair guard must additionally require **unit equality** (and a
colour/computed leaf must never enter the numeric fold — see D4). A mismatched-unit
pair belongs in `boxedKeys` with an honest refusal/diagnostic (the same
`COMPOSITION_FALLBACK` posture `engine/composition.ts` already uses), not a silent
wrong-unit accumulate. This is a *classification* fix in `buildSoAPlans` +
`isNumericUnit`, not new math.

---

### D4 (MAJOR) — `add` / `weighted` never blend COLOURS across layers; they silently element-replace

**Seam:** `soa.ts:217-233` (allNumeric partition → `boxedKeys`),
`compositor.ts:230-234 / 260-268` (boxed `else existing[i] = incoming[i]`).

A colour leaf's `.value` is a `Color` object, not a number
(`isColorUnit: value is ValueUnit<Color<ValueUnit>>`, value.js
`units/utils.d.ts:5`), so `isNumericUnit` is **false**. `buildSoAPlans` therefore
marks any colour-bearing key `allNumeric = false` → `boxedKeys`, and both boxed arms
take the `else` branch `existing[i] = incoming[i]` — a **plain element replace**.
Consequence: layered colour composition under `add`/`weighted` is **silently
replace-only** — there is **no** oklab / perceptual cross-layer colour blend, in
direct contradiction of the project's "colour → perceptual (oklab default)"
interpolation-dispatch contract (CLAUDE.md Architecture Notes). A user weighting two
colour layers 0.5/0.5 gets the top layer's colour verbatim, not a mix.

**Cure:** route colour leaves in the `add`/`weighted` arms through value.js's real
`Color` blend (the same oklab path the intra-keyframe interp uses) instead of the
element-replace fallthrough — or, if cross-layer colour blend is deemed out of
scope, make the refusal **explicit** (a diagnostic + documented "colour blends
replace-only"), not a silent last-wins.

---

### D5 (MAJOR) — `weighted` is a non-normalized, order-dependent sequential lerp, and a bottom/lone weighted layer silently drops its weight

**Seam:** `compositor.ts:250-273` (per-layer `lerp(existing, incoming, w)`),
`soa.ts:132-138` (SoA weighted fold), `compositor.ts:236-238 / 270-272` (non-array
carrier → `groupedValues[key] = incoming`), `defaults.ts:78` (`weight: 1`).

The documented model is "`weighted` = lerp by weight." The **actual** model is an
iterative "over" composite: for each weighted layer in zIndex order,
`existing = lerp(existing, incoming, w)`. This is **not** a normalized convex
combination — two weighted layers at `w=0.5` yield `lerp(lerp(base,A,.5),B,.5)`,
which is **order-dependent** and depends on the base beneath, not a symmetric
average of A and B. The mandate's specific questions resolve as:

- **weight 0** on a layer → `lerp(carrier, incoming, 0) = carrier` → the layer
  contributes nothing (identity). Fine, but only *because* a carrier exists.
- **single enabled weighted layer / bottom weighted layer** → its carrier is a
  **non-array first-touch** (nothing beneath) → the boxed arm hits
  `groupedValues[key] = incoming` (`compositor.ts:271`) and `buildSoAPlans` records
  it in `boxedKeys` (`soa.ts:236-243`). The weight is **ignored entirely** — a lone
  `weighted` layer behaves as `replace`, `w` silently discarded. `w=0` on a lone
  layer therefore does NOT produce "no contribution"; it produces the full incoming.
- **weight-sum** is not a concept — there is no normalization pass, so "weight sum 0"
  is undefined; the result is purely the sequential-lerp accumulation.

**Cure:** either (a) document `weighted` honestly as an ordered "over" lerp (and fix
the lone-layer case to lerp against the *carrier-or-identity* so `w` is always
honoured), or (b) if the demo/UX intends a normalized weighted **average**, compute
`Σ wᵢ·vᵢ / Σ wᵢ` across the contributing layers per key in a single fold (an SoA
pass already visits every contributor). The current behaviour matches **neither**
mental model at the edges.

---

### D6 (MINOR) — `computeGroupedKeys` counts DISABLED layers' keys → per-frame `delete` compaction → V8 dictionary-mode deopt

**Seam:** `entries.ts:65-77` (`computeGroupedKeys` iterates all entries, **no
`layer.enabled` filter**), `compositor.ts:143-146` (per-frame `delete` compaction).

`computeGroupedKeys` folds `entry.animation.flatKeys` for **every** entry regardless
of `layer.enabled`, so a disabled layer's **exclusive** keys enter `_groupedKeys`.
Each frame they are null-filled (`compositor.ts:61-64`), the disabled layer is
`continue`d (`compositor.ts:84`) so nothing contributes them, and the compaction
loop `delete`s them (`compositor.ts:145`). That is a **per-frame `delete`** on
exactly the shape the entire SoA/null-fill apparatus exists to avoid (F.W4 S2),
dropping `_grouped` to dictionary mode for the run whenever a layer is toggled off
while it owns keys no enabled layer covers. This is the root of lane-11 F5 (which
named the compaction but not that the **union itself** is the source). Correctness is
unaffected (the key is correctly absent from the transform); this is pure perf.

**Cure:** filter `!layer.enabled` in `computeGroupedKeys` (a disabled layer
contributes no keys to the stable union), and carry a "contributed-this-frame" epoch
so the transform skips uncontributed keys without ever `delete`-ing — the shape-stable
discipline `clearBuffer` consumers (`interpolate.ts:221`) already follow. Then
`_grouped` never leaves fast-properties mode.

---

## The pathology-class map (the C14 sibling sweep the mandate asked for)

| Cache | Where | Keyed by | Re-pointed under it? | Stale at boundary? |
|---|---|---|---|---|
| `frame._plainProj` (standalone) | `interpolate.ts:297` | the frame's OWN `flatVars` (stable id) | no — active frame's own proj used | **safe** |
| `frame._numericPlan` (standalone) | `frame-compiler.ts:426` | the frame's OWN iv leaves | no | **safe** |
| `group._plainProj` | `compositor.ts:172` / `plain-vars.ts` | `_grouped` leaf refs | **YES** (replace re-points `_grouped[key]`) | **D2 — freezes** |
| `group._soaPlans` carriers/incomings | `compositor.ts:118` / `soa.ts` | `entry.values`/`_grouped` leaf refs | **YES** (interpFrames alias re-points) | **D1 — freezes** |

The discriminant is identity ownership: **frame-local caches capture the leaf a
frame permanently owns (stable); group caches capture a leaf the compositor
re-points every boundary (stale).** Every "built once, only `.value` changes"
comment in the group zone (`soa.ts:63-71`, `plain-vars.ts:19`,
`group.ts:118-124`) rests on the same falsified premise. Fix the two group caches as
one view-over-live-composite change and the class is closed.

---

## Answers to the mandate's explicit questions (index)

- *replace strict z-order last-wins?* — **yes** (verified, `compositor.ts:98-107` +
  ascending zIndex sort).
- *add accumulate correctly across heterogeneous units/colours?* — **no**:
  unit-blind (D3), colour-blind → element-replace (D4).
- *weighted normalize / weight 0 / sum 0 / single layer?* — **no normalization**;
  order-dependent sequential lerp; lone/bottom layer drops its weight (D5).
- *layer toggles enabled mid-play?* — correctness **fine** (invalidate rebuilds
  both caches); **perf deopt** via the union not filtering disabled (D6).
- *different property sets / same prop at different times / partial overlap?* —
  **correct** (per-key independence).
- *units differ across layers (px vs % vs calc)?* — **silently wrong** (D3);
  `calc`/computed leaves (`.value` non-numeric) fall to boxed replace like colour.
- *colour-space blending across layers?* — **absent** (D4).
- *transform sub-properties stack?* — in the **unflatten/plain** path yes (distinct
  keys `rotation.y`, `position.x` stack independently); in the **DOM-flat** path two
  layers animating the aggregate `transform` string **clobber** via replace (a CSS
  single-value limitation, worth documenting, not a code defect).
- *SoA zero-alloc + blend-order correct?* — zero-alloc **within a segment** holds;
  blend **order** correct; blend **identity** stale across segments (D1).
- *springs.ts role?* — `weightSpring` drives the `weighted` `w` live
  (`compositor.ts:250`, `soa.ts:135`); `advanceLayerSprings` commits+clears on
  settle. Correct and orthogonal to the staleness class (it mutates `layer.weight`,
  not leaves).

---

## Cross-refs

- `defect-amiga-suspend-resume.md` — D2 is that dossier's root cause, confirmed; D1
  is the sibling it did not sweep (it noted amiga is `replace`+`unflatten`, so the
  SoA add/weighted twin was outside its repro).
- lane-11 F5 — D6 is its root (the union, not just the compaction).
- The born-RED gate the dossier proposes for D2 must be **generalized** to cover D1:
  a `singleTarget` group with an `add` **and** a `weighted` layer over ≥3-keyframe
  children, asserting the *composited* leaf keeps changing across ≥2 segments (not
  just amiga's replace+unflatten shape).
</content>
</invoke>
