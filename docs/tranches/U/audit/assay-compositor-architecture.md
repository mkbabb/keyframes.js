# Assay — the Compositor / Layering ARCHITECTURE

**Tranche U · lane: architecture critique (design-level) · 2026-07-10**
**Mandate (OD-U14, verbatim):** *"The primary issue with our animations was that
the compositing and stacking and layering. Ensure that's assayed."*
**Discipline:** READ-ONLY over the live tree (`tranche-u-dev`, 5.2.0 shape). Every
finding carries `file:line` evidence + the idiomatic gestalt cure — no patches.

---

## Verdict on the current model (one paragraph)

The layering model is **two half-built compositors wearing one class**, and the
seam between them is a **pointer table, not a value store** — which is *why* the
amiga freeze (defect dossier C14) exists and why it is not a one-scene bug. Read
against how real compositors express stacking — Web Animations `composite:
replace | add | accumulate`, the CSS `animation-composition` property, and
game-engine additive/override blend layers with normalized weights — kf's group
model diverges on **four** structural axes: (1) it keeps **two incompatible
composition vocabularies** for one operation (`BlendMode = replace|add|weighted`
vs `CompositeOperator = replace|add|accumulate`), inventing a non-standard,
non-normalizing `weighted` and *omitting* `accumulate`; (2) the group compositor
has **no WAAPI path at all**, so any compositor-eligible animation silently drops
to main-thread rAF the instant it joins a group, while the platform's native
`composite: 'add'` — the exact primitive additive layering wants — is never used;
(3) the composite buffer `_grouped` **aliases borrowed frame-leaf references**
that `interpFrames` re-points at every keyframe-segment boundary, so every cache
built over it (the plain-vars projection AND the SoA carrier plan) goes stale mid-
play — this is the C14 freeze, and it is **latent for add/weighted groups too**,
not just amiga; (4) layer identity/order is **insertion+zIndex implicit** with
config poked in imperatively post-hoc, not a declarative stack descriptor. The
model is not *wrong* so much as **unreconciled** — it grew a second composition
tier (K.W7 `animation-composition`) beside the first (the group blend) and never
merged them, and it grew a zero-alloc SoA fold over a buffer whose leaf identity
is not actually stable. The cure is one coherent re-charter of the `group/` zone,
not four patches — and it belongs *with* lane-11's U.C1 (Transport core) and U.C3
(shape-stable composition), because the stable-leaf store that fixes C14 **is**
C3's shape-stability, and the draw-half carve that houses it **is** the symmetric
half of C1's transport carve.

---

## The evidence trail (what the code actually does)

### A. `_grouped` is a pointer table into borrowed frame buffers — the C14 root, generalized

The defect dossier root-caused the amiga freeze to the *plain-vars projection*
caching stale leaf refs. Reading one level deeper: the projection is stale
*because the thing it caches from is itself a table of borrowed pointers.* The
architectural fault is upstream of the projection.

- A child's interpolation output is written into the entry's reused buffer:
  `compositor.ts:88` `animation.interpFrames(animation.t, false, values)`.
- On the **dominant single-active-frame path**, `interpFrames` does NOT copy —
  it *aliases* the active frame's leaf array into the buffer:
  `interpolate.ts:187-194` (`clearBuffer(out); Object.assign(out, fv)` where
  `fv = frames[seedIdx].flatVars`). So `entry.values[key]` **becomes a reference
  to whichever frame is currently active.**
- The `replace` arm then reference-assigns that borrowed leaf straight into the
  composite: `compositor.ts:105` `groupedValues[key] = incoming;`.

So `_grouped[key]`'s *identity* is "the leaf of the child's currently-active
frame" — and that identity **changes every time a child crosses a segment
boundary** (a new `frames[seedIdx]`). `_grouped` is not a value store; it is a
per-frame-rebuilt pointer table into frame-owned buffers.

Every cache built over `_grouped` therefore inherits a "captured ref vs re-pointed
source" hazard, and both existing caches rebuild only on **structural** change,
never on a **segment crossing**:

1. **The plain-vars projection** (`plain-vars.ts:109` stores the live `units`
   ref; `:120-126` re-reads *that same ref*; rebuilt only on `_groupedKeysDirty`
   at `compositor.ts:52-55`). → the amiga freeze, live-reproduced in the dossier.
2. **The SoA carrier plan** (`soa.ts:228-229` pushes `existing[i]`/`incoming[i]`
   — the build-frame's active-frame leaves — as `carriers`/`incomings`;
   `groupSoABlendLayer` at `soa.ts:131-145` reads `carriers[s].value` and writes
   back to the *same captured leaf*; rebuilt only on the same `_groupedKeysDirty`
   seam at `compositor.ts:51`). After a segment crossing the `replace` arm
   re-points `_grouped[key]` to the **new** active frame's leaf, but the SoA fold
   still seeds from and writes back to the **old** captured carrier — so the
   add/weighted contribution is written to an orphaned leaf while the transform
   reads the re-pointed one. **This is the identical freeze class, latent for any
   multi-segment `add`/`weighted` group** — amiga only dodges it by being
   `replace`-only (empty SoA plan), so only its projection bites.

The gate the dossier proposes (`singleTarget`+`unflatten` multi-segment) does
**not** cover this second variant. The born-RED gate must ALSO assert an
`add`/`weighted` group with ≥3-keyframe children composites correctly past its
first segment boundary.

**The gestalt fault:** the composite conflates *the mix output* with *borrowed
inputs*. A real compositor writes into a **mix buffer it owns**; kf points at the
sources.

### B. Two composition vocabularies for one operation — `weighted` invented, `accumulate` missing

The codebase carries two enums for what is conceptually one axis (how a value
stacks onto what is already there), and **the type comments themselves admit the
overlap while deliberately refusing to reconcile it**:

- `types.ts:190` `CompositeOperator = "replace" | "add" | "accumulate"` — the
  per-keyframe `animation-composition` operator, *and* the whole-animation
  `AnimationOptions.composite` (`types.ts:229`). This one matches the CSS/WAAPI
  grammar exactly.
- `types.ts:273` `BlendMode = "replace" | "add" | "weighted"` — the group's
  per-layer tier.
- `types.ts:185-188` states it outright: *"the engine routes `add`/`accumulate`
  onto the SAME un-clamped numeric leaf the group's `add` layer runs
  (`group.ts`), so the two tiers share one accumulation semantic **without
  sharing a type**."*

The divergence is not benign:

- **`weighted` is not a composite op.** WAAPI/CSS have no "weighted composite."
  Weighting is an orthogonal concept — *how much* a layer contributes — separable
  from *how* it contributes (replace/add/accumulate). Game-engine blend trees keep
  these on separate axes precisely so weight can apply to any op.
- **`weighted` does not normalize and is order-dependent.** The arm lerps the
  running composite toward the incoming by `w` in zIndex order
  (`compositor.ts:250-273`, `soa.ts:132-138`). Two `weighted` layers at 0.5 do
  **not** produce a normalized 50/50 blend — the second lerps over the *result*
  of the first, so the blend is non-associative and order-sensitive. There is no
  weight pool, no normalization. That is a genuine semantic gap vs "normalized
  weights across contributing layers."
- **`accumulate` is absent from the group tier** even though the engine already
  implements repeat-aware accumulate for the per-keyframe path
  (`composition.ts`, `types.ts:173`). A group cannot express what a single
  animation can.

**The gestalt fault:** one operation modeled twice, neither model complete, the
non-standard member (`weighted`) conflating two axes.

### C. The group has NO WAAPI path — split-brain by omission

`grep -rn -i waapi src/animation/group/` → **zero hits.** The entire group blend
runs main-thread rAF:

- A child is marked `managed = true` (`group.ts:173`) and **throws** on a direct
  `play()` (`play-lifecycle.ts:362-364`), so a managed child never reaches the
  WAAPI eligibility gate at `play-lifecycle.ts:383-387`.
- The group's own draw loop (`group.ts:288-317` `_frame`/`_renderFrame` →
  `compositeFrame`) only ever calls `interpFrames` on the main thread.

Consequences that answer the prompt's split-brain questions directly:

- **A WAAPI-eligible animation drops to main-thread rAF the moment it joins a
  group.** The two subsystems do not "produce the same stacked output" — the
  group subsystem simply *has no compositor output at all.*
- **Eligibility is per-single-animation only** (`eligibility.ts:131`,
  `isWAAPIEligible(animation)`); there is no per-layer nor per-group notion.
- The platform's **native `composite: 'add'`** — multiple `Element.animate(kf,
  {composite:'add'})` on one element, layered on the compositor thread — is the
  *exact* primitive that single-target additive layering should lower to, and kf
  reimplements it by hand on the main thread. The `waapi-options.ts` map does not
  even emit a `composite` key (the option builder is per-animation, composite-
  unaware).

This is the deepest "compositing/stacking" gap relative to OD-U14: the flagship
"springs on the compositor" story evaporates for *any grouped* animation.

### D. The unflatten/plain-vars projection is a RENDERER concern, misfiled and inlined

`plain-vars.ts` projects the internal `ValueUnit[]` leaf representation onto the
plain authored-shape object a custom `transform` consumes. That is an **output
adapter (a renderer)** — not a compiler (input → frames). Yet:

- It lives in `compile/` (`compile/plain-vars.ts`), the input pipeline zone.
- It is branched **inline in two hot paths** on a boolean `unflatten` flag:
  `interpolate.ts:288-311` and `compositor.ts:172-185`. Each site hand-rolls the
  build-once/refresh lifecycle.
- There is no `Renderer` seam. The renderer choice (DOM-flat default vs plain-
  object projection vs the WebGL-via-transform amiga case) is an `if (unflatten)`
  in both the per-animation and the group path, duplicated.

The dossier's C14 freeze is the *symptom* of this missing abstraction: because no
renderer *owns* the projection lifecycle, the group's single shared projection is
rebuilt on the wrong signal (structural, not segment). A `Renderer` that owns a
stable composite it reads would rebuild the projection exactly when the composite's
leaves change — which, under the Finding-A cure, is never per-segment.

### E. Layer identity/order is insertion+zIndex implicit, config poked imperatively

- Layers are keyed by `getAnimationId(animation)` (`group.ts:165-171`) and ordered
  by a `zIndex`-sorted `Object.values` (`group.ts:189-196`); default `zIndex: 0`
  (`defaults.ts:76`) means **insertion order via the stable sort** is the de-facto
  stack.
- Blend config is set **after construction**, imperatively, via `setLayerConfig`/
  `setLayerEnabled`/`transitionLayer`/`crossfade` (`group.ts:391-431`). The demo's
  `LayerConfigPanel.vue` edits it one field at a time by emitting partial updates.
- The `properties` whitelist (`AnimationLayerConfig`, consumed at
  `compositor.ts:96` / `soa.ts:183`) is the "mask" concept — but it is an ad-hoc
  `Set<string>` on each layer, not a first-class channel mask.

There is no **declarative layer-stack descriptor** — a list where each layer names
its op, weight, mask, and z up front. Compare a real compositor: the stack IS the
data structure; here the stack is emergent from insertion + a mutable per-entry
config bag. This makes the composite non-inspectable ("what is the layer stack?"
has no single answer) and the WAAPI-lowering of Finding C harder (a declarative
stack is exactly what lowers to N `composite` calls).

### F. Draw/composite state is diffuse; the per-frame `delete` compaction (lane-11 F5)

Five pieces of draw scratch live as public instance fields on the class body —
`_grouped`, `_groupedKeys`, `_soaPlans`, `_compositeBuf`, `_plainProj`
(`group.ts:104-128`) — mutated by free functions in `compositor.ts`/`soa.ts`.
Lane-11 F3 already flagged that `group.ts` never carved its draw half (no
`group/draw.ts` mirroring the engine's `play-lifecycle.ts`); lane-11 F5 flagged the
per-frame `delete`-compaction (`compositor.ts:143-146`) that drops `_grouped` back
to V8 dictionary mode whenever an enabled-set changes mid-play. Both are the same
root as Finding A: **there is no object that owns the composite as a stable value
store.** Once one exists, the delete-compaction vanishes (stable leaves are
contributed-flagged, never deleted) and the scratch fields belong to that object,
not the class body.

---

## The target design (gestalt — minimal, KISS, no loss of functionality)

Four moves, one coherent re-charter of `group/`. Each is small; together they make
the layering model isomorphic to how the platform expresses stacking.

### T1 — ONE composite axis + an orthogonal weight

Collapse the two vocabularies onto the CSS/WAAPI grammar the codebase already owns:

- **The op axis is `CompositeOperator = replace | add | accumulate`** — shared by
  the per-keyframe operator, the whole-animation `composite`, AND the group layer.
  Delete `weighted` *as an op*.
- **`weight: number` stays on the layer, orthogonal, applied to ANY op.** For a
  set of contributing `add` layers, weights **normalize** across the contributing
  pool (a real blend-weight pool), so the blend is order-independent and
  associative. The spring-driven `weightSpring` (K.W11 PHYS-C — the flagship
  crossfade) rides *this* weight unchanged; the crossfade is expressed as two
  layers whose normalized weights spring a→0, b→1 (which is what `crossfade`
  already does, just re-expressed on the orthogonal axis). **No functionality is
  lost** — `weighted` was `{op: replace-or-add, weight}` all along.

This gives the group `accumulate` for free (the engine already implements it) and
makes one accumulation semantic *share one type* instead of the deliberate two.

### T2 — the composite is a value store the compositor OWNS (fixes C14 + C3 + F5)

Replace the pointer-table `_grouped` with a **`CompositeState` that owns its own
`ValueUnit[]` leaves**, allocated once per structural change (shape-stable), keyed
by the compile-stable key union already computed (`entries.ts:computeGroupedKeys`):

- Each blend arm **writes VALUES into the owned leaves** — `replace` copies
  `.value` (not the reference), `add` accumulates, weighted-`add` folds the
  normalized pool — never `groupedValues[key] = foreignLeaf`.
- The SoA carriers and the plain projection then capture **the composite's own
  stable leaves**, which never re-point across a segment. The C14 freeze — both
  the projection variant AND the latent SoA-carrier variant of Finding A — is
  structurally impossible.
- The stable owned leaves are contributed-flagged (an epoch/`contributed` bit),
  so the per-frame `delete`-compaction (F5) is gone and `_grouped` never leaves
  fast-properties mode. **This subsumes lane-11 U.C3 outright** — C3's shape-
  stability and this stable-value-store are the same object.

This is the gestalt cure: the composite becomes a *mix buffer written into*, which
is what every real compositor is, and what `refreshPlainProjection` already claims
to be ("a view over the live composite") but isn't.

### T3 — a `Renderer` seam owns the projection lifecycle

Introduce a tiny renderer abstraction (`apply(vars, t)`) with two implementations —
**DOM-flat** (the default, the flat `_grouped`/`flatVars` apply) and **plain-object
projection** (the `unflatten` custom-transform case, wrapping today's `plain-vars`)
— selected ONCE per animation/group instead of an inline `if (unflatten)` in two
hot paths. Move `plain-vars.ts` out of `compile/` to sit beside the renderers (it
is an output adapter). The renderer owns its projection's build/refresh, rebuilt on
the same signal that rebuilds the composite's owned leaves (T2) — i.e. never per-
segment. `interpolate.ts` and `compositor.ts` stop branching on `unflatten`.

### T4 — a declarative layer-stack descriptor + per-group WAAPI lowering (Finding C)

- **Declarative stack.** `AnimationGroup.of(...)` continues to accept animations,
  but a layer's `{op, weight, mask, z}` becomes a first-class descriptor the group
  holds as an ordered list — the stack IS the data structure, inspectable in one
  read. `setLayerConfig` stays as the mutation verb (unchanged surface), but it
  edits a declared stack, not an emergent one.
- **Per-layer eligibility + group lowering.** With T1 (op = WAAPI's `composite`)
  and T4 (a declarative stack), a **single-target** group whose every layer is
  WAAPI-eligible lowers to **N `target.animate(kf, {composite})` calls on the
  compositor thread** — the native additive path (Finding C). Eligibility becomes
  per-layer with a group-level "all eligible" gate; a mixed group keeps the rAF
  compositor (the always-correct fallback, symmetric with the single-animation
  gate's posture at `eligibility.ts:22-26`). `waapi-options.ts` gains the
  `composite` key it currently omits. This is where the "springs on the
  compositor" story is repaired for grouped animations.

---

## The migration shape — 5.3 surface, additive only (OD-U8)

Everything above lands **additive**; nothing on the published surface breaks.

1. **Vocabulary (T1) — additive union.** Widen `BlendMode` to include
   `accumulate`; keep `weighted` as a **deprecated alias** that the constructor
   normalizes to `{op: 'add' | 'replace', weight}` (documented: `weighted` ⇒ the
   orthogonal weight axis). `replace`/`add` are byte-unchanged. No consumer
   (including `LayerConfigPanel.vue`'s `BLEND_MODES` array) breaks; the demo gains
   `accumulate` and a normalized-weight semantic. The eventual `BlendMode`→
   `CompositeOperator` type merge is a *later* breaking wave; 5.3 ships the union.
2. **Composite value store (T2) + renderer (T3) — pure internals.** No surface
   change at all — `_grouped`/`_plainProj`/`_soaPlans` are all `INTERNAL`
   (`group.ts:104-128`). This is the correctness fix (C14) and lands with the
   born-RED gates the dossier + Finding A demand (projection variant AND the
   add/weighted multi-segment variant).
3. **Declarative stack (T4a) — additive read API.** Add a `layers` accessor
   (read the declared stack) beside the existing imperative setters; no removal.
4. **Group WAAPI lowering (T4b) — additive fast lane.** Behind the existing
   `useWAAPI` opt-in and a group-level eligibility gate; pure additive
   optimization, always with the rAF fallback (the delegation contract's "only
   ever trades a perf opportunity, never a loss" — `delegation.ts:100-107`).

---

## Why this is ONE U.C re-charter, not a parallel arm (cross-ref lane-11)

Lane-11 chartered the `group/` zone carve as:
- **U.C1 — the unified Transport core** (F1: three copied play FSMs → one shared
  spine over a driver seam).
- **U.C3 — shape-stable group composition** (F5: kill the per-frame `delete`
  compaction with a contributed-key epoch).

This assay's target design **must land inside those waves, not beside them**:

- **T2 (the composite value store) IS U.C3.** C3's contributed-key epoch and this
  assay's owned-stable-leaf store are the same object — you cannot fix the
  `delete` compaction without deciding who owns the composite leaves, and once an
  owner exists the leaves are stable and the C14 freeze is gone. Charter them as
  one: *"the composite is a shape-stable value store the compositor owns"* —
  covering F5 **and** the C14 root (Finding A) **and** the latent SoA-carrier
  variant in a single structural change.
- **T3 (the renderer seam) rides U.C1's draw-half carve** (lane-11 F3: the missing
  `group/draw.ts` symmetric to the engine's `play-lifecycle.ts`). The `CompositeState`
  + `Renderer` are exactly the "draw state belongs to the draw module's contract"
  that F3 names — the transport carve (C1) and the draw carve (F3) are the two
  halves of the same `group.ts` decomposition, and the renderer/composite-store is
  the draw half's payload.
- **T1 (the vocabulary) + T4 (WAAPI lowering)** are the *new* surface this lane
  adds on top — but they are only coherent *because* T2/T3 gave the composite an
  owned, inspectable, declarative shape to lower from.

**Net charter for U.C (the group re-charter):** *One composite axis
(`replace/add/accumulate` + orthogonal normalized weight), a shape-stable
composite the compositor owns (killing C14 and the delete-compaction together), a
renderer seam that owns the projection lifecycle (retiring the inline `unflatten`
branch and the misfiled `compile/plain-vars`), and a declarative layer stack that
lowers an all-eligible single-target group to native compositor `composite` — all
additive on the 5.3 surface, with born-RED gates covering both the projection and
the add/weighted multi-segment freeze the current gates omit.*

---

## Appendix — the born-RED gates this design owes (beyond the dossier's)

The dossier proposes a `singleTarget`+`unflatten` multi-segment gate. Finding A
shows that is **necessary but insufficient**. Add:

- **The add/weighted multi-segment gate.** A group with an `add` (or `weighted`)
  layer whose child has ≥3 keyframes, played *past its first segment duration*,
  must composite values that keep changing across ≥2 segments — asserting the SoA
  carrier plan does not freeze at the boundary (`Set(sampledCompositeValues).size`
  grows across segments). This is the exact assertion no current gate makes and
  the one Finding A predicts fails today.
- **The group↔WAAPI parity gate (once T4b lands).** A single-target additive group
  driven via the compositor lowering and the same group driven via the rAF
  compositor must produce the same stacked output (replay-equality at sampled
  offsets) — the isomorphism `eligibility.ts` guarantees for a single animation,
  extended to the stack.
</content>
</invoke>
