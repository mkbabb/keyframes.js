# Lane a03-w2-engine-carve — R.W2 engine carve audit

**Scope.** `engine.ts` (1420L, pre-carve `a15cd48:src/animation/engine.ts`) →
`engine/` zone of 12 siblings (`4b0cc17` + `d3c6976`), base
`KeyframesAnimation` now 499L / class body 442L. Judged SPEC (`docs/tranches/R/waves/R.W2.md`)
vs SHIPPED (`src/animation/engine/*.ts`) vs GESTALT (is it a real seam split or a
line-count shuffle).

---

## Executive summary

**Verdict: the carve is REAL, not cosmetic — but the wave's headline promise ("DI
not param-bags") is only HALF delivered, and that half is the residue Tranche S
inherits.**

What is genuinely true and well-executed:

- The `PlaybackHost` `this as unknown as` privacy-inversion is **actually excised**
  (`grep -rn PlaybackHost src/` returns only doc-comments + gate strings; zero
  interface, zero cast). The three structural workaround casts named in the spec
  (`engine.ts:918`, `engine-playback.ts:287/378`) are gone.
- The born-RED gate `proof:engine` is **non-vacuous**: clause (b) reads the real
  class body to its own closing brace (442L measured) against a ceiling *lowered*
  1100→500 (`scripts/proof-engine.mjs:74`), and clauses (c)/(d) scan the actual
  `engine/` tree for the cast string and the export. It bites. `node
  scripts/proof-engine.mjs` → PASS on all clauses; `proof:decomposition` → PASS
  (every file ≤ 500L).
- Each sibling is a **named concern with a header stating its charter**, not a
  `helpers.ts` dump. Flat pre-carve siblings (`engine-playback.ts` etc.) are fully
  migrated — none linger. Zero `deprecated`/`TODO`/`FIXME`/legacy in the zone.
- **Three of the siblings are textbook narrow seams**: `options.ts` (pure
  normalizers, *zero* animation coupling), `composition.ts` (takes an explicit
  `CompositionRuntime` interface — exactly the fields it needs, no `this`),
  `css-metadata.ts` (takes `stylesheet`/`registry`/`diagnostics`). These could be
  unit-tested in isolation today.

What is honest-but-incomplete (the residue):

- **`PlaybackState` is a PARTIAL extraction.** It owns 5 *infrastructure* fields
  (resolver, held promise, WAAPI handles, bound-frame, interp buffer). But the
  play **FSM** — `paused/done/started/reversed/iteration/t/startTime/pausedTime` —
  stays declared on the `KeyframesAnimation` class body and is mutated **30 times
  from `playback.ts` externally** (`anim.paused =` ×5, `anim.done =` ×4,
  `anim.started =` ×4, `anim.iteration =` ×4, `anim.startTime =` ×4,
  `anim.pausedTime =` ×4, `anim.t =` ×3, `anim.reversed =` ×2), while the class
  itself writes only `this.reversed` once. So the run-state has a **declare-here /
  mutate-there split-brain**: the class declares the FSM, a sibling owns every
  transition. That is better than a fake interface, but it is not "the collaborator
  owns its state" — it is "free functions mutate the god-object's fields by field
  access," which the spec's own prose openly admits ("the seam between them is
  plain field access", `playback.ts:24`).
- **`playback.ts` / `interpolate.ts` / `compile-bridge.ts` are wide-concrete-DI, not
  narrow seams.** They import `type KeyframesAnimation` and reach into it broadly:
  `playback.ts` touches **25 distinct `anim.*` members**, `interpolate.ts` 12,
  `compile-bridge.ts` 11. The interface between `animation.ts` and these three *is
  the entire concrete class*. Line count moved out of the class; **coupling did
  not shrink** — it was relocated, not reduced.

Net: this is a legitimate god-class decomposition (the class is a thin facade now,
the gate proves it, the cast is dead), executed as **"extract free functions taking
`self`"**. It scores well on the "is the class still a god-object?" axis and poorly
on the "is the run-state actually owned?" axis. The owner's instinct to keep
challenging it is right; the concrete S-work is to *finish* the PlaybackState
extraction (fold the FSM in) and to recognize the CSS surface is already split
across two zones.

---

## Findings

### F1 — PlaybackState is a partial owner; the play FSM is a declare-here/mutate-there split-brain — MEDIUM

**Evidence.**
- `engine/playback.ts:62-72` — `PlaybackState` holds exactly 5 fields: `resolvePromise`,
  `_playingPromise`, `_waAnimations`, `_boundFrame`, `_interpOut`. All *infrastructure*
  (promises, handles, buffers).
- `engine/animation.ts:86-115` — the FSM fields (`startTime`, `pausedTime`, `t`,
  `iteration`, `started`, `done`, `reversed`, `paused`, `managed`) stay declared on
  the class body.
- `engine/playback.ts` mutates those class fields 30× from outside the class
  (`settle` at :475-484 alone writes 7 of them; `advanceBody` :188-203 writes
  `pausedTime`/`startTime`/`t`; `onStart` :115-133 writes `reversed`/`paused`/`started`;
  `onEnd` :137-152 writes `startTime`/`done`/`iteration`). `interpolate.ts:96-100`
  reads/writes `anim.reversed`.

**Why it matters.** The wave title is "DI not param-bags," and the spec claims the
privacy-inversion is *dissolved* — "the collaborator owns its state, the animation
owns the rest" (`playback.ts:24`). But the collaborator (`PlaybackState`) owns only
the plumbing; the *semantic* run-state it exists to encapsulate is still on the
class, mutated by the sibling. A reader tracing `pause()` sees `anim.paused = true`
(class field) two lines from `play()`'s `anim._playback._playingPromise` (struct
field): two homes for one lifecycle, split along an infra/FSM line that is an
implementation accident, not a domain boundary. This is exactly the "shared mutable
state smeared across files" smell the audit brief names — mitigated only by the fact
that the smear is *consolidated* to one mutator file, not scattered across many.

**Proposal (S).** Fold the FSM into `PlaybackState` (or a sibling `PlaybackFSM`):
`playback.ts` mutates `state.paused`/`state.t`/… and `animation.ts`'s class body
retains only `{ options, _compiler, playback, _playback, targets, name, id }` + the
sample/config delegates. Then the `animation.ts ↔ playback.ts` interface narrows from
"the whole concrete class" to "`PlaybackState` + a handful of sample callbacks," and
the "collaborator owns its state" claim becomes literally true. Gate the result: a
`proof:engine` clause asserting the transition fields are read/written only through
`_playback`.

### F2 — playback/interpolate/compile-bridge are wide-concrete-DI, not narrow seams; coupling was relocated, not reduced — LOW/MEDIUM

**Evidence.** Distinct `anim.*` member accesses per sibling: `playback.ts` 25,
`interpolate.ts` 12, `compile-bridge.ts` 11, `option-setters.ts` 5,
`element-resolve.ts` 3. All import `type KeyframesAnimation from "./animation"`; the
intra-zone graph shows `animation → {playback,interpolate,option-setters,compile-bridge,element-resolve}`
and every one of those → `type KeyframesAnimation` back (a type-only cycle, erased
under `verbatimModuleSyntax`, so no runtime cycle — confirmed by the no-cycle gate
baseline 0).

**Why it matters.** These three modules cannot be reasoned about or tested without
the entire animation object. The carve made the *class* small (442L, gate-verified)
but the *unit of coupling* is unchanged: the god-object's behavior is now spread
across files that all depend on all of it. Contrast the genuinely narrow siblings —
`options.ts` (0 anim coupling), `composition.ts` (explicit `CompositionRuntime` at
`composition.ts:35-41`), `css-metadata.ts` (3 explicit args), `element-resolve.ts` (3
accessors over the *public* compiler/targets surface, `:48-114`). The delta between
those and `playback.ts` is the delta between a seam and a `self`-extraction.

**Proposal (S).** Accept `playback.ts` as concrete-DI (playback genuinely needs the
FSM — F1's fold is the real fix there) but narrow `interpolate.ts`: its hot path reads
`frames`, `reversed`, `options`, `unflatten`, `_stableKeys`, `_hasComposition`,
`_compositionBase/_compositionFallbackSeen`, `diagnostics`, `targets` — most are
compile-derived, not run-state. Consider an `InterpContext` struct (the compile-stable
subset) so `interpFrames` is a pure `(ctx, frames, t) → out` and the "zero-alloc / fast-
props" contract is provable against a fixed shape rather than the mutable class.

### F3 — the `engine/css/` sub-module the owner suspects: cohesive but marginal; the real shape is that the CSS surface is already split engine↔compile — LOW

**Evidence.** The two CSS-entry siblings — `css-animation.ts` (277L,
`CSSKeyframesAnimation`: `fromString`/`fromVars`/`fromKeyframes`/`bindTimeline`/
`transform`) and `css-metadata.ts` (169L, `recoverAnimationOptionsBase`/
`recoverScrollOptions`/`registerPropertyDescriptors`) — are 446L of genuinely
cohesive CSS-specific concern; `css-animation.ts` already delegates its metadata
recovery to `css-metadata.ts` (`css-animation.ts:24-28,199,214,269`). BUT the sibling
CSS concerns are *already zoned into `compile/`*: `cssTwinFor` lives in
`easing.ts` + `compile/easing-option.ts`, `getTimingFunction` in
`compile/easing-registry.ts`, serialization in `compile/format.ts`,
`transformTargetsStyle`/flatten in `compile/parse-flatten.ts`. `css-animation.ts`
imports from all of them (`:29,33,35,36`).

**Why it matters.** A `engine/css/` holding only `css-animation.ts` + `css-metadata.ts`
would capture 2 of ~6 CSS-related concerns; the CSS-twin/serialization half is
correctly in `compile/` (it is compile-pipeline work, not engine-entry work). So the
owner's suspicion is *directionally* right (those two files cohere) but the payoff is
low — a 2-file subdir — and it risks re-splitting a surface that is already sensibly
partitioned engine(entry) ↔ compile(twin/serialize). This is a taste call, not a
structural defect.

**Proposal (S).** Do **not** manufacture `engine/css/` for two files. If Tranche S
sub-zones `compile/` (per the mission's `compile/backward/`, `compile/easing/`
intent), make the CSS-twin/serialization cohere *there* and leave `css-animation.ts` +
`css-metadata.ts` as the engine's CSS-entry pair in the flat `engine/` zone. Revisit a
`engine/css/` only if a third CSS-entry concern lands (e.g. a CSSOM-adopt entry that
today lives in `ingest/`).

### F4 — wave doc's before/after BOX undercounts the shipped carve (8 listed, 12 shipped) — INFO

**Evidence.** `R.W2.md` §2A "AFTER" box lists 8 engine files (index, animation,
css-animation, playback, composition, options, css-metadata, element-resolve). Shipped
is 12: it *adds* `interpolate.ts`, `option-setters.ts`, `compile-bridge.ts` (the extra
concern-extractions that netted the class under 500), plus `public.ts` (the R.W4b
subpath sink, correctly a different wave). The commit message `4b0cc17` is accurate
("carve css/interpolate/options/compile-bridge/element-resolve"); only the ASCII box
in the spec is stale.

**Why it matters.** Low — but it is exactly the "sizing is an estimate, the gate
verifies, if over 500 keep carving" discipline the spec promised (§4), *working*: the
box was the estimate, the impl carved further to satisfy the gate, and the extra files
are honest cohesive concerns (not padding). Worth recording only so an S reader does
not treat the box as the manifest. The method held here.

### F5 — the gate is genuinely born-RED-capable and non-vacuous (strength, recorded) — INFO

**Evidence.** `scripts/proof-engine.mjs:74` lowers `ANIMATION_CLASS_CEILING` to 500;
:83-113 measures the class body from `^export class KeyframesAnimation<` to its own
closing brace (excludes trailing re-exports) → a real 442L measurement, not a file
`wc`. Clauses (c)/(d) at :114-155 scan every `engine/*.ts` for
`/as\s+unknown\s+as\s+PlaybackHost/` and `/export\s+(interface|type)\s+PlaybackHost\b/`
— so a rename-and-re-export of the interface still reds. This is the rare gate that
cannot be satisfied by a source grep a stub could fake: the ceiling reads the AST-ish
body span, the cast clause names the interface not just the syntax.

**Why it matters.** This is the method working as designed and should be *preserved*
and *extended* (see F1's proposed FSM-ownership clause), not rewritten. Cite it as the
positive template when other lanes report vacuous gates.

---

## Tranche-S implications

Wave-shaped recommendations, ordered by leverage:

1. **S-wave "finish PlaybackState" (MEDIUM, ~1 focused wave).** Fold the play FSM
   (`paused/done/started/reversed/iteration/t/startTime/pausedTime`) off the
   `KeyframesAnimation` class body into `PlaybackState`. `playback.ts` mutates
   `state.*`; `animation.ts` shrinks to config + compiler + sample delegates. Extend
   `proof:engine` with a clause asserting the transition fields are reached only via
   `_playback`. This is the residue that makes the R.W2 title ("DI not param-bags")
   *actually* true rather than half-true. Born-RED: the clause reds on today's tree
   (30 `anim.<fsm> =` sites in `playback.ts`).

2. **S-wave "narrow the interp seam" (LOW/MEDIUM, folds into #1 or #3).** Introduce an
   `InterpContext` (the compile-stable subset `interpFrames` reads) so the hot path is
   a pure function over a fixed shape — makes the zero-alloc/fast-props contract
   provable against a struct, not a mutable class. Optional; do only if #1 lands.

3. **Do NOT create `engine/css/` for two files (LOW).** Instead, if S sub-zones
   `compile/` (the mission's `compile/backward/`, `compile/easing/`), home the
   CSS-twin/serialization concerns there and leave `css-animation.ts` +
   `css-metadata.ts` as the flat engine CSS-entry pair. Re-evaluate only on a third
   CSS-entry concern.

4. **Doc hygiene (INFO).** When S rewrites the tranche method, mandate that wave
   before/after boxes are *regenerated from the shipped tree at close*, not left as the
   authoring estimate — F4 shows the box drifting from truth while the commit message
   stayed accurate. A `proof:wave-manifest` that diffs the box against `ls` would close
   this cheaply.

5. **Preserve `proof:engine` as the gate template (INFO).** F5's body-span + interface-
   name scanning is the anti-vacuous pattern other lanes should cite. Any S gate over a
   god-class ceiling should read the class body span, not the file line count.

**Bottom line for S:** R.W2 is an honest carve that shrank the class for real and
killed the fake seam — it is NOT a cosmetic shuffle. Its one load-bearing residue is
that `PlaybackState` stopped halfway: it owns the plumbing, not the FSM, so the run-
state is still mutated on the class by a sibling. Finishing that extraction is the
single highest-value engine follow-on, and it is gateable today.
