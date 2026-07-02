# Lane a16 — Zone structural quality: `physics/` + `orchestration/` (the LIGHT zones)

> DEEP AUDIT of Tranche R (the surgical refactor). Scope: `src/animation/physics/`
> + `src/animation/orchestration/` — per-file cohesion, sub-zoning judgement, the
> LIGHT (value.js-free) constraint, dead/speculative exports, API surface vs README
> billing. Read-only. Branch `tranche-s-dev`, R impl range `a15cd48..18e8617`.

## Executive summary

**The R partition of the two LIGHT zones is honest and the LIGHT invariant is
intact.** `proof:boundary` passes GREEN with every one of the 15 physics/
orchestration barrel entries reporting `value.js:0 engine:0 dynamic-chunks:0`
(the sole dynamic chunk is `resolveEasing`, by design). Static-grep confirms zero
`@mkbabb/value.js` import edges in either zone — all 30-odd matches are prose in
doc comments. R.W2's carves are **real, not cosmetic**: `spring/progress.ts` shed
its vector-lane / sample-kernel / solver leaves (`vector.ts`, `sample.ts`,
`solver.ts`) and `sequence/sequence.ts` shed its transport math and event bus
(`transport.ts`, `events.ts`) — each a cohesive value.js-free leaf, not a
hyphenated flat sibling. No `@deprecated`/legacy code survives in either zone (the
two "legacy" tokens are prose noting correct removals). The sub-zoning judgement
is sound: `spring/` (a 9-file family) earned its directory; R correctly resisted
manufacturing subzones for the singleton steppers (`oscillator`, `decay`, `morph`).

**The residue Tranche S inherits is documentation drift and a small speculative-
surface tail, not structural rot.** Four defects, in descending order: (1) the
zone-level `src/animation/CLAUDE.md` was *never* refreshed for the R partition —
it still documents the flat pre-R tree (`numeric.ts`, `spring.ts`, `drag.ts` at
animation root) and pre-L export names, so the zone's own contract file lies about
both its structure and its API; (2) the root `CLAUDE.md` LIGHT-export list names
`ScrollTimeline`, a symbol R/Q **dropped** (the real export is
`KeyframesScrollTimeline`) — a consumer copying the doc gets `undefined`; (3)
`sequence/transport.ts` hand-rolls its own `prefersReducedMotion()`, resurrecting
the exact copy `internal/reduced-motion.ts` was built to *collapse*, and does so
without the memoization the singleton carries; (4) `Oscillator` is a public,
gated, tested primitive with **zero in-repo consumer**, and its module header
bills a demo "KF-OSCILLATOR scene" that does not exist.

Net: the *code* carve was idiomatic; the *documentation and consume-story* around
it were left in a pre-R/pre-L state. S should fold the doc refresh into the
partition (a partition that doesn't update its own CLAUDE.md is only half done)
and resolve the phantom-consumer chronics (Oscillator, the reseat surface).

---

## Findings

### 1. [HIGH] `src/animation/CLAUDE.md` was never refreshed for the R partition — the zone contract file documents the flat pre-R tree

`src/animation/CLAUDE.md` is untouched across the entire R range:

```
$ git log --oneline a15cd48..18e8617 -- src/animation/CLAUDE.md   → (empty)
```

Yet R.W1 (`40834d2`) partitioned the tree into zones. The file's "Files" section
(`src/animation/CLAUDE.md:42-67`) still draws the **flat** pre-R layout:

```
├── numeric.ts       # NumericAnimation …          (now physics/numeric.ts)
├── smooth.ts        # SmoothProgress …            (now physics/smooth.ts)
├── spring.ts        # SpringProgress …            (now physics/spring/progress.ts)
├── morph.ts         # ElementMorph …              (now physics/morph.ts)
├── drag.ts          # drag / Draggable …          (now orchestration/drag/draggable.ts)
├── stagger.ts       # stagger …                   (now orchestration/stagger.ts)
├── sequence.ts      # Sequence …                  (now orchestration/sequence/sequence.ts)
├── timeline.ts      # Timeline …                  (now orchestration/timeline/index.ts)
├── playback.ts      # RAFPlayback …               (now physics/playback.ts)
```

Every per-class section cites the old path (`(numeric.ts)`, `(spring.ts)`,
`(playback.ts)`, …). Beyond paths, the doc carries **pre-L export names**: the
`Timeline` section says "`Timeline (abstract), ScrollTimeline, ManualTimeline`"
(the real class is `KeyframesScrollTimeline`, renamed L.W8 §S4), and the drag
paragraph describes `drag2D` as "re-exported from `drag-2d.ts` through `drag.ts` →
the barrel — the single LIGHT re-export chain." That chain does not exist: there is
no `drag.ts`, and `draggable.ts:455-459` explicitly states it "imports nothing from
`./drag-2d`" — the barrel (`orchestration/drag/index.ts`) re-exports `drag2D`
*directly*.

**Severity HIGH** because this is the zone's own authoritative contract file (the
`animation/CLAUDE.md` the project structure section points agents at), and it is
wrong about the tree it governs, the export names, and the re-export topology. A
partition wave that renames every file but leaves the zone-doc describing the old
names is a half-finished partition. R.W8 refreshed `demo/CLAUDE.md` (`5a5f7db`) and
the root `CLAUDE.md` project-tree but skipped this one.

**Proposal (S):** rewrite `src/animation/CLAUDE.md`'s "Files" + per-class sections
to the seven-zone tree and current export names; make it a `proof:readme-paths-live`-
style gate target so a cited path that no longer exists fails CI (the existing gate
covers README, not this file).

---

### 2. [MEDIUM] Root `CLAUDE.md` LIGHT-export list names `ScrollTimeline` — a symbol that was DROPPED

`CLAUDE.md:70` (root, project instructions) enumerates the LIGHT static exports and
lists `` `ScrollTimeline` ``. The barrel dropped that name:
`src/animation/index.ts:62-66` documents "The legacy `ScrollTimeline`/`ScrollTimelineOptions`
@deprecated PKG-3 aliases … were DROPPED"; the actual export is
`KeyframesScrollTimeline` (`index.ts:68`, class defined at
`orchestration/timeline/index.ts:181`). `CLAUDE.md:108` repeats the stale name in
the architecture notes.

A consumer following the root CLAUDE.md verbatim writes
`import { ScrollTimeline } from "@mkbabb/keyframes.js"` and binds `undefined`. The
README (the user-facing doc) is *correct* here (`README.md:489,510` use
`KeyframesScrollTimeline`) — only the two CLAUDE.md files carry the stale name, so
this is an internal-doc-truth defect, not a shipped-README defect.

**Severity MEDIUM** — internal instruction files, but they are the files agents
trust first, and the named symbol genuinely does not exist.

**Proposal (S):** `ScrollTimeline` → `KeyframesScrollTimeline` in `CLAUDE.md:70,108`;
fold with Finding 1 into one doc-truth pass.

---

### 3. [MEDIUM] `sequence/transport.ts` hand-rolls its own `prefersReducedMotion()` — resurrecting the copy `internal/reduced-motion.ts` was built to collapse

`internal/reduced-motion.ts:2-4` declares itself "One shared `prefers-reduced-motion`
gate for the whole engine" that "Collapses the formerly hand-rolled
`prefersReducedMotion()` copies," is value.js-free (`:12`), and **memoizes** the
`MediaQueryList` keyed on the live `window.matchMedia` identity so it never
re-constructs the query per call (`:24-42`).

`sequence/transport.ts:171-176` nonetheless defines its OWN:

```ts
export function prefersReducedMotion(): boolean {
    return (
        typeof matchMedia === "function" &&
        matchMedia("(prefers-reduced-motion: reduce)").matches
    );
}
```

`sequence.ts:66` imports it from `./transport`, not from `internal/reduced-motion`.
This is a straight duplicate of the exact hand-rolled detector the internal gate
exists to eliminate — and a *worse* one: it re-parses the media query on every call
(no memoization), whereas the singleton caches. Since `internal/reduced-motion.ts`
is itself value.js-free, `transport.ts` could import it with zero LIGHT-boundary
cost; there is no boundary excuse for the copy. The "ONE detector for the whole
engine" invariant (`internal/reduced-motion.ts:2`) is therefore **false** — the
sequence subzone is the one that reintroduced the fork, most likely carried through
the R.W2b `sequence.ts` carve (`9f6576d`) that split `transport.ts` out.

**Severity MEDIUM** — behaviourally equivalent today (both return the same boolean),
so no user-visible bug, but it is precisely the DRY/consistency regression the S
no-legacy/single-source mandate targets, and it silently breaks the singleton's
memoization contract for the Sequence path.

**Proposal (S):** delete `transport.ts:171-176`; import `prefersReducedMotion` from
`../../internal/reduced-motion` in `transport.ts`/`sequence.ts`. Consider a
`proof:single-prm-detector` grep gate (one `matchMedia("(prefers-reduced-motion…"`
literal across `src/animation/**`, in `internal/reduced-motion.ts` only) so the
fork cannot silently return.

---

### 4. [MEDIUM] `Oscillator` — public, gated, tested, but zero in-repo consumer; its header bills a demo scene that does not exist

`Oscillator` + `waveformValue` are exported on the physics barrel
(`physics/index.ts:16-17`) and the package barrel, and tested
(`test/oscillator.test.ts`). But the only `src`/`demo` reference is the barrel
re-export itself — no library module and no demo scene constructs one (the sole
`demo` grep hit, `demo/scenes/spring/SpringHeatmap.vue:5,86`, is the prose "damped
harmonic **oscillator**", incidental).

The module header actively bills a consumer that is absent:
`physics/oscillator.ts:10-13` — "The consume signal is glass-ui BB's
`W-EASING-PRIMITIVE` wave … and the demo's `KF-OSCILLATOR` scene reads the phase to
drive a looping motion." There is no `KF-OSCILLATOR` scene in `demo/scenes/`. So
`Oscillator` is a speculative public primitive whose documented in-repo consumer is
fictional (either never built or dropped in R.W5's scene-fusion, unrecorded).

The primitive itself is *well-built* (clean phase/sample separation, correct
negative-`dt` wrap, thorough JSDoc) — this is a consume-story defect, not a code
defect. It is exactly the "green source-shape gate misses a missing consumer" chronic
class the owner's memory flags.

**Severity MEDIUM** — dead public surface inflates the API and the `.d.ts`, and a
header that lies about its consumer is a maintenance trap.

**Proposal (S):** decide per the no-chronic mandate — either (a) build the promised
`KF-OSCILLATOR` demo scene (resurrect it alongside the scene-switcher work) and wire
a real consumer, or (b) if the primitive is intended as a pure exported leaf, strip
the fictional-scene claim from the header and record it as an intentional
consumer-less export in the surface ledger. Do not leave the header asserting a
scene that isn't there.

---

### 5. [LOW–MEDIUM] The spring reseat surface (`reseatToSpring` / `probeVelocity`) is public but consumed only by one test; the obvious consumer uses `decayRest` instead

`reseatToSpring` + `probeVelocity` (`physics/spring/reseat.ts`, barrel-exported at
`physics/spring/index.ts:17`) have exactly one non-barrel consumer:
`test/spring-blend-weight.test.ts`. No `src` or `demo` module calls them. The
natural consumer — the drag fling, whose whole point is a velocity-continuous
re-seat of the spring at release — instead imports `decayRest`
(`orchestration/drag/draggable.ts:1`), not `reseatToSpring`. So the library ships a
public "velocity-continuous interruption seam" that its own gesture layer bypasses.

**Severity LOW–MEDIUM** — smaller than Finding 4 (it *is* exercised by a test, and
`probeVelocity` is a plausibly-useful public read), but it's the same speculative-
surface pattern: a committed public API with no in-realm consumer and a more-obvious
sibling (`decay`) filling the actual need.

**Proposal (S):** either wire `Draggable`'s release path through `reseatToSpring`
(if the closed-form spring re-seat is genuinely the better fling model than the
frictional `decay` it currently uses — an SOTA-uplift question worth a bench), or
demote the reseat helpers behind the spring subzone barrel to internal if no
consumer materializes.

---

### 6. [LOW] Both R.W2 carves land at exactly 499 lines — one under the 500 cap; the target was the number, the cohesion is genuine

`physics/spring/progress.ts` = 499L and `orchestration/sequence/sequence.ts` = 499L
(exactly). The R.W2 commit subjects state the intent literally: "carve spring
progress.ts (628->500)" (`b4eba1d`) and "carve sequence sequence.ts (699->500)"
(`9f6576d`). Landing both at 499 is gate-hugging — the decomposition threshold, not
natural module boundaries, set the stopping point.

That said, the *extractions were real and cohesive*: `vector.ts` (typed-array SIMD
lanes), `sample.ts` (normalized sample kernel), `solver.ts` (damped-harmonic
kernel), `transport.ts` (position/phase math + play-loop driver), `events.ts`
(event bus + entry types) are each a genuine value.js-free leaf with a single
responsibility, not a hyphenated dump. So this is a note on *method*, not a defect:
the carve was cohesion-shaped but tuned to the cap.

**Severity LOW.** **Proposal (S):** treat the 500-line cap as a smell threshold, not
a target; a file that needs to sit at 480–520 for cohesion should, and one that's
naturally 300 shouldn't be padded. If S deepens sub-zoning elsewhere (compile/,
engine/), hold the same "cohesion first, line-count as tripwire" discipline.

---

### 7. [INFO] Sub-zoning judgement is correct; the flat remainder is right; one optional reflection

The lane's framing question — should `oscillator`/`decay`/`morph` group like
`spring/`, and is the flat orchestration remainder (`stagger`, `flip`) right? —
resolves in R's favor:

- **`spring/` earned its subzone**: 9 files (`progress`, `duration`, `reseat`,
  `linear-stops`, `timing-function`, `types`, `sample`, `solver`, `vector`) forming
  one family with a shared `types.ts` ring-break and a dedicated barrel. This is the
  *model* subzone.
- **`oscillator`/`decay`/`morph` are correctly left flat**: each is a single ~100–143L
  module with no family to gather. Manufacturing `physics/oscillator/` for one file
  would be the over-decomposition R itself criticized in Q. Restraint here is right.
- **`orchestration` flat remainder (`stagger`, `flip`) is correct**: single-file
  primitives; `drag/`, `timeline/`, `sequence/` earned subzones (3/2/4 files each).

**Optional reflection for S (not a recommendation):** if `physics/` ever grows, the
one *conceptual* seam is interpolators (`numeric`, `smooth`, `morph` — position/
progress lerp) vs. dynamics (`spring`, `decay`, `oscillator` — velocity/friction/
frequency ODEs). A `physics/interp/` + `physics/dynamics/` split would express that,
but it is speculative and not clearly better than the current flat+`spring/` layout;
`morph` composing `numeric` is the only cross-group edge. Do not act on this without
a growth pressure that isn't present today.

---

### 8. [INFO — positive] What R got right, verified

- **LIGHT invariant intact.** `proof:boundary` PASS: all 15 physics/orchestration
  barrel entries `value.js:0 engine:0` (only `resolveEasing` carries the one
  intended dynamic chunk). Static grep: zero `@mkbabb/value.js` edges in either zone.
  Cross-zone imports resolve only to `internal/` (leaves, errors, reduced-motion),
  `constants` (types), `easing` (itself LIGHT), and *type-only* `engine`
  (`sequence.ts:86`, `events.ts:28` — `import type`, erased under
  `verbatimModuleSyntax`).
- **No legacy/deprecated code** in either zone (the two "legacy" tokens are prose
  noting correct prior removals: `sequence.ts:11`, `timeline/index.ts:177-179`).
- **Real carves, not sibling-shuffles** — see Finding 6.
- **API quality is high** where consumed: `decay.ts`, `oscillator.ts`, `stagger.ts`
  are exemplary — fail-explicit (`decay` throws on `friction<=0`), allocation-free
  hot paths, thorough JSDoc, correct edge handling.
- Minor non-issues: `OscillatorConfig` shows 0 external refs but is the constructor
  option type (consumers pass object literals — not dead). The barrel mixes explicit
  named re-exports (flat members) with `export *` (subzones) — a cosmetic
  inconsistency, harmless.

---

## Tranche-S implications

Wave-shaped recommendations, ordered by leverage:

1. **S.W-DOC — zone-doc truth pass (folds Findings 1 + 2).** Rewrite
   `src/animation/CLAUDE.md` to the seven-zone tree + current export names
   (`KeyframesScrollTimeline`, `draggable.ts`, the direct `drag2D` barrel re-export);
   fix `CLAUDE.md:70,108` (`ScrollTimeline` → `KeyframesScrollTimeline`). Add a
   `proof:claude-paths-live` gate (the `proof:readme-paths-live` sibling) that fails
   when a path or symbol cited in either CLAUDE.md no longer resolves — so a future
   partition cannot leave its own contract file stale. This is the single highest-
   leverage S action for these zones: R's *code* partition is done; its *doc*
   partition never happened.

2. **S.W-DRY — collapse the reduced-motion fork (Finding 3).** Delete
   `transport.ts:171`'s `prefersReducedMotion()`; route the Sequence path through
   `internal/reduced-motion.ts`. Gate with `proof:single-prm-detector` (one
   `prefers-reduced-motion` `matchMedia` literal in the tree, in the singleton only).
   This restores the memoization contract and the "ONE detector" invariant the file
   claims.

3. **S.W-CONSUME — resolve the phantom-consumer chronics (Findings 4 + 5).** Per the
   no-chronic mandate, force each speculative LIGHT export to a decision: **Oscillator**
   — build the promised `KF-OSCILLATOR` demo scene (dovetails with the scene-switcher
   resurrection) or strip the fictional-scene header and ledger it as an intentional
   leaf; **reseat surface** — wire `Draggable`'s fling through `reseatToSpring` (with a
   bench vs. the current `decay` fling, an SOTA-uplift opportunity) or demote it to
   subzone-internal. Every public LIGHT primitive should have either a real in-repo
   consumer or an explicit "exported leaf, no consumer" ledger entry — no headers that
   assert consumers that don't exist.

4. **S.W-METHOD — cohesion-first decomposition (Finding 6).** Carry the "500 lines is
   a tripwire, not a target" discipline into S's deeper sub-zoning (compile/, engine/,
   resolve/). The R.W2 carves that hit exactly 499 were cohesive by luck of tuning;
   S's carves should be shaped by module boundaries and land wherever cohesion puts
   them.

5. **NO structural churn for physics/orchestration.** The zone geometry is correct
   (Finding 7). S should *not* re-partition these two zones; the optional
   `interp/`vs`dynamics/` split is unmotivated today. Spend the S structural budget on
   the zones that need it (compile/, engine/, the demo/app mess), and treat physics/
   + orchestration as the reference for how the rest should look — a partition whose
   only debt is that its documentation was left in the previous era.
