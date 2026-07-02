# a18 · compile/ zone deep-dive — SPEC vs SHIPPED vs GESTALT

**Lane:** a18-zone-compile (structural-quality). **Scope:** `src/animation/compile/**` as
shipped on `master` (a15cd48..18e8617), read on `tranche-s-dev`. Read-only.
**Sibling context:** a02 (zone-partition), a05/a12 (decomposition), a06 (cycle-ring),
a11 (engine-core). This lane owns the compile zone's internal layout only.

---

## Executive summary

The compile zone is **11 files / 2582 lines** — the second-densest library zone after
engine. It is genuinely two pipelines welded under one directory: a **FORWARD** half
(`parse-flatten` → `frame-compiler`, with `selector`/`numeric-plan`/`easing-*` leaves) that
engine imports *upstream*, and a **BACKWARD** half (`backward` + `backward-walk` +
`backward-color` + `format`) that *value-imports the live runtime graph* (`engine`/`group`/
`orchestration/sequence`/`scroll`) *downstream*. The zone straddles the engine seam in both
directions.

**Verdict: the zone is structurally sound but was NOT decomposed on cohesion — it was
decomposed on the 500-line gate.** The four R.W2b leaf files (`selector`, `numeric-plan`,
`easing-option`, `backward-walk`) were carved in exactly two commits whose own messages state
the motive: `289e6c5 "carve compile frame-compiler.ts (670->500)"` and `5163b39 "carve compile
backward.ts (536->429)"`. `frame-compiler.ts` now sits at **499/500** — one line under the
ceiling. Three of the four carves landed on real concern boundaries (selector grammar, SoA
plan, graph walkers) so they survive scrutiny; the fourth (`easing-option`) is pure
path-preservation ceremony — carved out, then **re-exported straight back through
`frame-compiler.ts`** so no import site had to change. That re-export is the tell that the
split was mechanical, not architectural.

The **ideal layout the owner suspected is correct for `backward/` and marginal for
`easing/`.** A `compile/backward/` sub-zone (`backward`, `backward-walk`, `backward-color`,
`format`) is *dependency-aligned* — it is exactly the set that consumes live animation
objects — and would make the forward/backward asymmetry legible at the tree level. A
`compile/easing/` sub-zone (`easing-registry` + `easing-option`, 178L, 2 files) is cohesive
but too small to earn a directory + barrel; the higher-value move there is deleting the
re-export ceremony.

Concrete residue for S: one **dead export** (`declaredKeyframeBodyFor`, zero consumers), one
**O(stops×1024) recompute** in the densify hot loop, a **barrel that overstates itself**
(5 deep-path bypasses from engine), and a **stale `animation/CLAUDE.md`** that still documents
the pre-R flat layout (`utils.ts`, root `format.ts`/`frame-compiler.ts`).

`frame-compiler.ts`'s `addFrame → parse` pipeline is **one cohesive stateful concern, not
three** — do NOT split it further; that would only push shared mutable state (`templateFrames`
/`parsedVars`/`frames`) through parameters.

---

## Findings

### F1 — compile/ is two zones across the engine seam; `backward/` is the right sub-zone (MEDIUM, structural)

**Evidence.** Dependency direction splits the zone cleanly:

- FORWARD / *upstream of engine* (engine imports them; they never value-import the runtime
  graph): `parse-flatten.ts` (320), `frame-compiler.ts` (499), `selector.ts` (108),
  `numeric-plan.ts` (59), `easing-registry.ts` (122), `easing-option.ts` (56).
- BACKWARD / *downstream of engine* (they value-import `engine`/`group`/`sequence`/`scroll`):
  `backward.ts` (`backward.ts:55-56,70` → `AnimationGroup`, `Sequence`, `serializeScrollOptions`),
  `backward-walk.ts` (`backward-walk.ts:16-18` → `AnimationGroup`, `getAnimationId`, `Sequence`),
  `backward-color.ts` (325, type-only engine, consumed only by `backward`), `format.ts` (488,
  type-only engine, consumed by `backward` AND `engine/public.ts:141`).

The two halves share nothing but `constants`/`internal` — there is no forward↔backward import
edge inside the zone (verified: `grep "from \"./"` shows `backward*` importing only
`format`/`backward-color`/`backward-walk`, never `frame-compiler`/`parse-flatten`). They are
co-located purely because both say "CSS keyframes." That is a *topic* grouping, not a
*dependency* grouping.

**Proposal.** Introduce `compile/backward/` = { `backward.ts`, `backward-walk.ts`,
`backward-color.ts`, `format.ts` } with its own `index.ts`; leave the forward half at
`compile/` root. This is cohesion-positive (the "consumes live animation objects" set becomes
a named boundary), dependency-aligned (the downstream half is visibly downstream), and
shrinks the flat root from 11 to 7. One wrinkle: `engine/public.ts:141` value-imports
`format.ts` for the load-engine bridge, so it would reach into `compile/backward/format` — a
minor layering smell but *not* a cycle (format's engine import is type-only, erased). Accept
it: `public.ts` is the barrel-assembly point and is allowed to reach serialize primitives.

**Cohesion-win vs ceremony:** HIGH win (4 files, 1382L, a real dependency boundary) vs one
`index.ts`. Worth it.

---

### F2 — R.W2b carves were ceiling-driven; `easing-option` re-export is pure ceremony (MEDIUM, cosmetic-carve)

**Evidence.** The carve commits name the number, not the concern:
`289e6c5 "R.W2b: carve compile frame-compiler.ts (670->500) — selector grammar + numeric plan
+ easing resolver"`; `5163b39 "carve compile backward.ts (536->429) — extract the graph
walkers"`. `frame-compiler.ts` landed at **499** (`wc -l` = 499), one line under the 500L
`proof:decomposition` ceiling (`scripts/proof-decomposition.mjs:130`).

The `easing-option` carve left a re-export bridge so no consumer had to move:
- `frame-compiler.ts:76-77` — `import { resolveEasingOption } from "./easing-option"; export {
  resolveEasingOption } from "./easing-option";`
- `frame-compiler.ts:49-52` — same pattern re-exporting `namedSelectorToFraction` /
  `NAMED_SELECTOR_SUPERTYPE` from `./selector`.
- Consumers then still import *through frame-compiler*, not from the real module:
  `engine/options.ts:26` `import { resolveEasingOption } from "../compile/frame-compiler"`;
  `engine/interpolate.ts:24` `import { NAMED_SELECTOR_SUPERTYPE } from "../compile/frame-compiler"`.

So `frame-compiler.ts` is now a **re-export hub** for two modules it no longer contains. If the
split were a genuine concern boundary, `options.ts` would import from `compile/easing-option`
(or the barrel) and `interpolate.ts` from `compile/selector`. The re-export exists only to keep
`frame-compiler.ts` under 500 *without* touching call sites — the definition of cosmetic
decomposition (the exact pattern MEMORY flags on Tranche Q's "cosmetic close").

Note: `selector.ts` and `numeric-plan.ts` themselves ARE cohesive extractions (the keyframe
grammar and the SoA plan are self-contained, tested concerns) — those carves survive on
merit even though the *motive* was the number. Only the `easing-option` re-export is
indefensible residue.

**Proposal.** Delete the three re-export lines in `frame-compiler.ts` (`:49-52`, `:77`) and
retarget the two consumers: `options.ts` → `compile/easing-option` (or the zone barrel),
`interpolate.ts` → `compile/selector`. This removes the ceremony and makes `frame-compiler.ts`
own only what it defines. Do it in the same wave as F1 so import churn happens once.

---

### F3 — `declaredKeyframeBodyFor` is dead exported code (MEDIUM, S "no legacy" charter)

**Evidence.** `format.ts:223-229` exports `declaredKeyframeBodyFor`, a thin pass-through
wrapper over the module-private `declaredKeyframeBody`. Its docstring says CC-2's densify
threads a `bodyOverride`/`bodyByStop` — but the wrapper takes **no** override arg (it forwards
the three params verbatim) and has **zero consumers**: `grep -rn declaredKeyframeBodyFor src/
demo/ test/` returns only the definition line. The densify path in fact substitutes bodies via
`keyframesBlock`'s `bodyByStop` map (`format.ts:243,253`), never this function.

This is exactly the residue S's "NO legacy/deprecated code anywhere" charter targets: an
export minted for a design (CC-1 per-stop body injection) that shipped a different way.

**Proposal.** Delete `declaredKeyframeBodyFor` (`format.ts:223-229`). No barrel export
references it; safe.

---

### F4 — the zone barrel overstates "single surface"; engine deep-imports bypass it (LOW-MEDIUM, honesty)

**Evidence.** `index.ts:9-10` header: *"This barrel is the zone's single surface (consumers
reach it through `loadAnimationEngine`)."* Reality — engine reaches **into 4 compile modules by
deep path**, bypassing the barrel:
- `engine/animation.ts:27,31` → `../compile/frame-compiler`, `../compile/parse-flatten`
- `engine/css-animation.ts:33,35,36` → `../compile/frame-compiler`, `../compile/easing-registry`,
  `../compile/parse-flatten`
- `engine/interpolate.ts:24` → `../compile/frame-compiler`
- `engine/options.ts:26` → `../compile/frame-compiler`
- `engine/index.ts:21` / `engine/public.ts:141-142` → `../compile/easing-registry`,
  `../compile/format`, `../compile/parse-flatten`

The barrel is a *partial* surface: it is the surface for `compileToCSS` + types (used by
`index.ts:223`, `validate.ts:49`, `engine/public.ts:130`, `load-engine.ts:76`), but the
forward primitives are reached raw. This is partly *justified* — engine and the forward
compile half are tightly-coupled peers (engine composes `FrameCompiler`), and forcing that
through a barrel adds an indirection without a boundary benefit. But the header claims a
totality that does not hold.

**Proposal.** Soften the `index.ts` header to state the truth: the barrel is the *backward*
surface + the shared types; the forward primitives (`FrameCompiler`, `parseAndFlattenObject`,
`getTimingFunction`) are peer-imported by engine directly because engine composes them. This is
a doc fix, not a re-plumb — do NOT force engine's `FrameCompiler` construction through the
barrel. (If F1 lands, the barrel naturally becomes "the backward sub-zone's surface" and the
claim becomes honest by construction.)

---

### F5 — `format.ts` (488/500) mixes two serialize audiences; the natural next split (LOW-MEDIUM)

**Evidence.** `format.ts` carries two distinct audiences under one roof:
- **Editor / single-animation readout:** `CSSKeyframesToString` (`:435`), `CSSKeyframesToStrings`
  (`:133`), `formatCSSKeyframeString` (`:157`), `animationOptionsToString` (`:170`) — the
  demo/editor whole-block + per-card serializers.
- **Multi-child compiler primitives:** `keyframesBlock` (`:240`), `premultipliedKeyframesBlock`
  (`:298`), `animationShorthand` (`:373`), `animationComposition` (`:397`) — consumed only by
  `backward.ts`.

Shared machinery (`declaredKeyframeBody`, `serializeEasing`, `propertyRegistryToString`) sits
between them. At 488/500 the file is one enrichment away from the gate, and the two audiences
are a legible seam.

**Proposal.** If F1's `compile/backward/` lands, `format.ts` moves there whole first (it is
serialize = backward). A *further* split into `format-serialize.ts` (editor readout) +
`format-block.ts` (compiler primitives) over a shared `format-core.ts` (`declaredKeyframeBody`
+ `serializeEasing`) is a MEDIUM-cohesion / MEDIUM-ceremony call — defer it unless a real
enrichment pushes the file over 500. Flag, don't force.

---

### F6 — densify recomputes a 1024-point ramp inside the midpoint loop: O(segments×stops×1024) (MEDIUM, efficiency)

**Evidence.** `backward-color.ts:200-209` — the ΔE ship-vs-refuse proof:
```
for (let s = 0; s + 1 < ramp.length; s++) {
    const tMid = (s + 0.5) / (ramp.length - 1);
    const kfMid = sampleColorRamp(fromColor, toColor_, 1024, { space, ...hueOpt })[Math.round(tMid * 1023)]!;
    ...
}
```
`sampleColorRamp(..., 1024, ...)` builds the **entire 1024-sample perceptual ramp on every
midpoint iteration** and indexes one element. For a default `densifyStops=16` that is 15
midpoints × 1024 samples = ~15,360 color computations per segment where **1024 would suffice**
(the ramp is invariant across `s` — it depends only on `fromColor`/`toColor_`/`space`/`hueOpt`,
all loop-invariant).

Not a runtime-render hot path (densify is compile-time and `compileToCSS` is already async), so
severity is MEDIUM not HIGH — but it is a clean, real inefficiency in a zone S is meant to bring
to SOTA.

**Proposal.** Hoist the 1024-ramp above the `for s` loop (compute once per segment pair, index
inside): `const kfRamp = sampleColorRamp(fromColor, toColor_, 1024, {space, ...hueOpt});` then
`const kfMid = kfRamp[Math.round(tMid*1023)]!`. ~15× fewer color samples on the densify path,
bit-identical result.

---

### F7 — `findComputedDrift` refusal fires on an empty array, not on a computed unit — likely unreachable (LOW, correctness-adjacent)

**Evidence.** `backward.ts:169-179` `findComputedDrift` returns the first flat key whose declared
value array is `length === 0`, and the `computed-unit-drift` refusal (`backward.ts:225-236`) keys
on it. But the docstring itself says the universal computed case (`vh`/`cqw`/`calc()`/`var()`)
carries a verbatim string and **round-trips** — so drift only fires when
`parseAndFlattenObject` produced an *empty* `ValueArray` for a declared key. Whether that state
is reachable at all through the normal parse path is unclear; the refusal reason may be dead in
practice (an honest refusal nobody can trigger).

This is at the edge of the structural lane (it is a reachability/coverage question, not a layout
one), so flagged LOW for a correctness lane to confirm.

**Proposal.** S should add a targeted test that *constructs* the empty-array state (or prove it
unconstructable and delete the `computed-unit-drift` reason + `findComputedDrift`). Either way
the refusal-surface stops carrying an unverified branch. Hand to a correctness lane, not this
one.

---

### F8 — `numeric-plan.ts` is value.js-free but homed in a HEAVY zone (INFO, micro)

**Evidence.** `numeric-plan.ts:11-15` header states it is "value.js-free at runtime (the
`InterpolatedVar`/`NumericFoldPlan` types erase)" and imports only `../constants` (types). It
rides the heavy compile chunk solely because `frame-compiler.ts:75` imports it. It is the same
*kind* of leaf as the `internal/` residents (binarySearch, leaves) — pure, dependency-free.

**Proposal.** Leave it. It is a compile-specific concern (the SoA fold plan is meaningless
outside frame compilation) and moving it to `internal/` would scatter one concern for a purity
badge it doesn't need. Noted only so a future "value.js-free = internal/" sweep doesn't
mistakenly relocate it.

---

### F9 — cross-realm `Color`/`ValueUnit` bridges in `backward-color` are irreducible here but a value.js dispatch (INFO)

**Evidence.** `backward-color.ts:58-62,92-106` carry `@cross-realm` `as unknown as Color` /
`as never` bridges: value.js and kf each bundle their own nominal `Color`/`ValueUnit`, and the
densify path has "no value.js typed accessor," forcing the realm bridge. The casts are honest
(commented, localized) but they are a structural seam, not a defect.

**Proposal.** Not a kf-side fix. Book a value.js dispatch: a typed densify accessor
(`sampleColorRamp` returning kf-consumable tuples, or a `color2` overload accepting the literal
oklab shape) would erase 4 cast sites. Feed to the value.js coordination lane, not S's kf waves.

---

### F10 — `animation/CLAUDE.md` still documents the pre-R flat layout (LOW, cross-ref docs lane)

**Evidence.** `src/animation/CLAUDE.md` (the zone doc) lists `frame-compiler.ts`, `format.ts`,
and `utils.ts` **at the `animation/` root** in its Files block, and its Dependencies section
names `utils.ts` and root `format.ts` as value.js importers. Post-R none of these exist: `utils.ts`
became `compile/parse-flatten.ts` (`R.W1.md:268`), `format.ts`/`frame-compiler.ts` moved under
`compile/`, and the whole compile zone the doc never mentions. The zone's own map contradicts
the shipped tree.

**Proposal.** Docs-lane (a12/a13) owns the CLAUDE.md refresh; noted here because the drift is in
*this zone's* documentation. S should regenerate `animation/CLAUDE.md`'s Files/Dependencies from
the shipped tree.

---

### F11 — `proof:decomposition` header comment says 550L; the constant is 500L (INFO, gate doc drift)

**Evidence.** `scripts/proof-decomposition.mjs:22` header comment: "(350L `.vue`, 550L `.ts`)";
the enforced constant `scripts/proof-decomposition.mjs:130` is `{ ".vue": 350, ".ts": 500 }`,
and the log line `:262` prints "500L .ts". The 550 in the comment is stale — it would mislead an
author into thinking they have 50L of headroom they don't. Directly relevant to this zone:
`frame-compiler.ts:499` and `format.ts:488` are within 1–12 lines of the *real* 500 ceiling, so
the exact number matters.

**Proposal.** Fix the comment to 500L. Trivial; fold into any S touch of the gate.

---

### F12 — the `addFrame → parse` pipeline is ONE cohesive stateful concern — do NOT split it (INFO, anti-over-zoning verdict)

**Evidence (the seam question, answered).** `FrameCompiler` (`frame-compiler.ts:79-499`) holds
three shared mutable arrays (`templateFrames`, `parsedVars`, `frames`, `:80-82`) and six methods
over them: `addFrame` (template accumulation + selector validation), `createFrame` (segment
build + inheritance seeks), `buildVarIndex`/`reconcileVars` (cross-keyframe reconciliation),
`parse` (the orchestrator: sort → flatten → createFrame loop → reconcile → sort → filter →
finalize), `finalizeFrameVars` (derive `flatVars`/`vars`/`allInterpVars`/`_numericPlan`),
`renormalizeColors` (color re-derive). Every method reads or writes the shared arrays; there is
no sub-cluster that touches a disjoint state slice.

One could *narratively* call it three concerns (accumulate / build-graph / finalize), but they
are welded by shared mutable state. Splitting `parse` out of the class would force
`templateFrames`/`parsedVars`/`frames` through parameters and re-introduce the god-object's
param-bag smell R.W2 explicitly rejected ("DI not param-bags", `R.W2.md:1`). The already-carved
*pure* leaves (`selector` grammar, `numeric-plan` SoA, `parse-flatten` CSS-leaf parse) are the
correct extractions — they are stateless functions the class *calls*. The stateful core rightly
stays whole.

**Verdict:** the pipeline is one concern. This is a *don't-touch* finding — recorded so S does
not "decompose" `FrameCompiler` chasing a cohesion metric and fragment a correct stateful unit.

---

## Ideal compile/ layout (the design)

```
compile/
├── index.ts              # barrel: backward surface + shared types (honest post-F1)
├── frame-compiler.ts     # FrameCompiler — the stateful forward pipeline (F12: keep whole)
├── parse-flatten.ts      # CSS leaf → ValueUnit parse/flatten + default renderer
├── selector.ts           # keyframe-selector grammar (forward leaf)
├── numeric-plan.ts       # SoA numeric fold plan (forward leaf)
├── easing-registry.ts    # getTimingFunction (forward easing)
├── easing-option.ts      # resolveEasingOption (forward easing)
└── backward/             # ← F1: the downstream serialize/compile half
    ├── index.ts
    ├── backward.ts       # compileToCSS orchestrator
    ├── backward-walk.ts  # graph walkers (group/sequence/list → CompileChild)
    ├── backward-color.ts # oklab densify (F6: hoist the 1024-ramp)
    └── format.ts         # serializers (F3: drop declaredKeyframeBodyFor; F5: split later if it grows)
```

**Rejected: `compile/easing/`.** `easing-registry` + `easing-option` (178L / 2 files) is
cohesive but below the directory-earning threshold — a dir + barrel for two files is ceremony.
The higher-value easing move is F2 (delete the re-export bridge, retarget the 2 consumers). If a
third easing concern ever lands, revisit.

**Rejected: splitting FrameCompiler.** See F12.

---

## Tranche-S implications

Wave-shaped, ordered so import churn happens once:

1. **S-wave "compile/backward/ sub-zone" (F1 + F5-move + F3).** Create `compile/backward/`,
   move { `backward`, `backward-walk`, `backward-color`, `format` } into it with an `index.ts`,
   retarget the ~4 external import sites (`index.ts:223`, `validate.ts`, `engine/public.ts`,
   `load-engine.ts`) and the intra-zone edges. In the same move **delete
   `declaredKeyframeBodyFor`** (F3) and soften the `compile/index.ts` header (F4). Born-RED a
   gate clause asserting `compile/` root holds ONLY the forward set (grep-based, like the
   existing zone gates). *Net: −1 dead export, +1 named dependency boundary, honest barrel.*

2. **S-wave "kill the easing-option ceremony" (F2).** Delete the three re-export lines in
   `frame-compiler.ts` (`:49-52`, `:77`); retarget `engine/options.ts:26` → `compile/easing-option`
   and `engine/interpolate.ts:24` → `compile/selector`. Add a gate clause forbidding
   re-export-only lines in `frame-compiler.ts` (it must export only what it defines). *This is
   the anti-cosmetic-carve lesson from Q made enforceable.*

3. **S-wave "densify SOTA" (F6).** Hoist the loop-invariant 1024-ramp in `backward-color.ts:203`
   above the midpoint loop. Pairs naturally with the SOTA-uplift charter; verify against
   `proof:*densify*`/replay-equality (bit-identical output, ~15× fewer samples).

4. **Correctness-lane handoff (F7).** Confirm or delete the `computed-unit-drift` refusal +
   `findComputedDrift` — either construct the empty-array state in a test or prove it
   unreachable and excise. NOT an S structural wave; a born-RED correctness task.

5. **Docs sweep (F10 + F11).** Regenerate `src/animation/CLAUDE.md` Files/Dependencies from the
   shipped tree (fold into the a12/a13 docs wave); fix the `proof-decomposition.mjs:22` 550→500
   comment. Trivial, batch with any gate touch.

6. **Method-note, not a wave (F12).** Record in the S plan: `FrameCompiler` is a *sealed*
   stateful unit — the decomposition charter stops at its pure leaves. This is the one place in
   the zone where "more files" would be a regression, and the plan should say so explicitly so no
   sub-agent chases the number into it.

7. **value.js coordination (F9).** Book a typed densify accessor on the value.js side to erase
   the 4 `@cross-realm` casts in `backward-color.ts`. Constellation dispatch, not a kf wave.

**Method critique for the owner.** This zone is the cleanest single evidence that R's
"decomposition close" was **gate-satisfied, not cohesion-satisfied**: two commits carving to
`->500`/`->429`, a 499/500 landing, and a re-export bridge whose only job is to keep call sites
frozen. The carves that *happened* to land on real seams (selector, numeric-plan, walkers) got
lucky; the one that didn't (easing-option) shipped ceremony. S's decomposition waves should be
driven by the **dependency graph** (F1's forward/backward direction split is invisible to a
line-count gate but obvious to an import scan), and the decomposition gate should be
*augmented* with a "no re-export-only bridge module" clause so a future ceiling-clearing carve
cannot hide behind path preservation.
