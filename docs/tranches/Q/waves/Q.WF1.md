# Q.WF1 — Engine-seam transposition: lift the standalone-play lifecycle machine into `engine-playback.ts` (1397L → ~900L)

**Band:** F — Engine-split (the architectural transposition)
**Phase:** NOW — kf-internal, executable on authorization. Sequenced AFTER Q.WE1 (alias-drop) so the split lifts a class that has already shed the `@deprecated Animation` re-export on `engine.ts:1205`. No value.js or cross-repo gate.
**Sequence (the DAG edge):** `Q.WA3 master-merge-reconcile → Q.WE1 alias-drop (FIRST — splits a clean class) → Q.WF1` (this wave) `→ Q.WZ 5.0.0 cut`. Q.WF1 sequences AFTER Q.WE1 so the alias line is gone before the class body moves. Q.WF2 (the group.ts SoA decomposition) is the natural companion — author Q.WF2 CONCURRENTLY but with Q.WF1 sequenced first because the group.ts split references the engine's composite contract (see §Dependencies).
**Owning chronic/DM:** DF-11-A (the FULL engine-seam transposition — deferred D→E→F→G→H→I→J→K→L→M→O→P, the single most-deferred named structural debt in the library; the BORN-RED HANDOFF text is verbatim at `proof-decomposition.mjs:151-157`). Audit lanes: B2-ow7-enginesplit, B5-kf-engine-arch.

---

## Context

`src/animation/engine.ts` is **1397L** (verified live `wc -l` — 3L under the `LIBRARY_CEILING_OVERRIDE` cap of 1400 at `proof-decomposition.mjs:132`). The `KeyframesAnimation` class body is **~1088L** against `proof:engine`'s `ANIMATION_CLASS_CEILING=1100` — 12L of headroom, a chronicity tell. The gate currently exits 0 ONLY because the 1400 override masks the underlying size. Three gates enforce the ceiling in parallel:

1. `proof:decomposition` clause-1 — the `LIBRARY_CEILING_OVERRIDE` entry + the stale-override guard (`proof-decomposition.mjs:128-159,381-389`) that REDS if `engine.ts` drops back under the 550L base while the override survives.
2. `proof:engine` — the `ANIMATION_CLASS_CEILING` clause measuring the `KeyframesAnimation` class body span (`proof-engine.mjs:79-104` — "the god-object is regrowing").
3. `proof:engine-no-throw-on-play` — the `[hygiene g]` engine.ts file-line `LIMIT=1400` (`proof-engine-no-throw-on-play.mjs:86`).

The O.W7 transposition was the first authorization attempt; it was declined in execution TWICE (M and O). The B2-ow7-enginesplit audit lane (2026-06-23) confirms:

- The FN_NAME blocker is DISCHARGED. `utils.ts:52` now reads `const FN_NAME_MAP = new WeakMap<ValueUnit, string>()` (not the foreign-Symbol stamp) — `proof:no-foreign-symbol-stamp` is GREEN. The S8 'split-blocking coupling' the O.W7 spec cited no longer exists.
- The seam is clearly defined. `engine.ts` houses four distinct concerns: (1) the compile-delegation facade (`parse()`, `_compiler`, `get frames`, `adoptCompiler`, `interpFrames`); (2) the live-options-reference setters (`setDuration`…`setComposite`); (3) **the standalone-play lifecycle machine** (`play`, `pause`, `resume`, `toggle`, `stop`, `reset`, `settle`, `paintRest`, `fillForwards`, `fillBackwards`, `onStart`, `onEnd`, `advanceTo`, `_advance`, `_frame`, `_renderFrame`, `_resolvePlay`, `_playRAF`, `_playWAAPI`, `_cancelWAAPI`, `_playReducedMotion`, `_snapToReducedMotion`, `finished`, `playing`, `effectiveT`); (4) the fill/rest contract.
- `interpFrames` and `advanceTo` are NOT private playback internals — they are the engine's public sampling API consumed externally by `group.ts:358/929`, `group-layer-springs.ts:201/221`, `ingest.ts:268`, `morph-svg.ts:281`, `sequence.ts:330`. They stay in `engine.ts` with concern 1. The split is **concern 3 only**. (Anchor note: `sequence.ts:330` is `animation.interpFrames(local, true)` inside `seek()`; line 300 in that file is docstring text, not a call site.)
- The extraction precedent is proven and idiomatic. `engine-composition.ts` (221L), `engine-options.ts` (193L), `engine-css-metadata.ts` (148L) are three colocated INTERNAL modules `engine.ts` already statically imports and never re-exports. `engine-playback.ts` is the fourth instance of this established `engine-*.ts` pattern.
- `proof:decomposition` is currently **RED** on HEAD (`df78088`, exit 1) for THREE OTHER files (group.ts 1083L, load-engine.ts 565L, frame-compiler.ts 553L). This is the prerequisite: the engine.ts override-removal born-RED witness CANNOT be isolated while other files also fail. Q.WA3 (master-merge reconcile) and Q.WF2 (group.ts decomposition) must establish a clean baseline before the engine override removal is the ONLY failing clause.

The Q precept is explicit: O.W7 is a REAL elegance transposition, not churn, WHEN sequenced after the alias-drop. The CONTRIVANCE-AUDIT framing is honored: the legitimacy test is the DISCRIMINATING BITE — the split must pass the behavioral gate suite, not just shrink the line count. A host-passing extraction that breaks `this.options === this.compiler.options` identity or the zero-alloc `_interpOut` buffer reuse is a real regression; a source-grep that greens on a stubbed empty file is a proxy mistake.

### Audit evidence

| Ref | Source location | Fact (verified 2026-06-23) |
|-----|-----------------|----------------------------|
| B2-ow7-enginesplit | `wc -l src/animation/engine.ts` | **1397L** — 3L under the 1400 override; the only `src/animation/**` file capped over 900L |
| B2-ow7-enginesplit | `proof-decomposition.mjs:128-159` | the `LIBRARY_CEILING_OVERRIDE` engine.ts entry + the BORN-RED HANDOFF text (P-invariant-28) verbatim |
| B5-kf-engine-arch | `proof-engine.mjs:79-104` | `ANIMATION_CLASS_CEILING=1100`; current class body ~1088L (12L of headroom) |
| B5-kf-engine-arch | `proof-engine-no-throw-on-play.mjs:86` | `LIMIT=1400` — the `[hygiene g]` file-line cap |
| B2-ow7-enginesplit | `utils.ts:52` | `const FN_NAME_MAP = new WeakMap<ValueUnit, string>()` — the S8 split-blocker DISCHARGED |
| B2-ow7-enginesplit | `proof-decomposition.mjs` on HEAD | **exit 1** — group.ts 1084L / load-engine.ts 565L / frame-compiler.ts 553L over cap (Q.WF2 + Q.WA3 pre-empt) |
| concern 3 methods | `engine.ts:596,859,873,896,921,944,951,968,979,998,1018,1042,1085,1092,1111,1120,1127,1143,1162` | `paintRest`, `advanceTo`, `_advance`, `_frame`, `_renderFrame`, `_resolvePlay`, `_playRAF`, `_playWAAPI`, `_cancelWAAPI`, `_playReducedMotion`, `_snapToReducedMotion`, `play`, `pause`, `resume`, `toggle`, `stop`, `playing`, `settle`, `reset` — the machine to lift; `interpFrames`/`at` stay (public sampling API) |
| `this`-bound contract | `engine.ts:287-294,396-402,447-462` | `this.options = {}` at 287, compiler bound to same object at 294 (constructor); `adoptCompiled` re-binds the live-options reference at 396-402 (`this.options = this.compiler.options` is true by construction); `setDuration` method starts at 447, re-reads `this.frames` (456-460) and mutates `this.options.duration` in place (462) — setters never replace the object |
| `_interpOut` zero-alloc | `engine.ts:214-223` | the ONE hoisted buffer for the standalone play loop's `interpFrames`; docstring at 214-222, field declaration `private _interpOut: Record<string, ValueUnit[]> = {}` at 223; stays with the play concern (concern 3), re-derived from `this` |
| extraction precedent | `engine-composition.ts:221L`, `engine-options.ts:193L`, `engine-css-metadata.ts:148L` | three colocated INTERNAL modules `engine.ts` statically imports, never re-exports |

---

## Scope

Each S-clause is a concrete, falsifiable deliverable.

- **S1 — Author `proof:engine-seam-split` born-RED FIRST (the gate-first law).** Before any extraction, author `scripts/proof-engine-seam-split.mjs` that (a) asserts `engine.ts ≤ 950L` AND (b) asserts `src/animation/engine-playback.ts` exists AND (c) asserts the `LIBRARY_CEILING_OVERRIDE` engine.ts entry is REMOVED or re-written to a post-split cap below 1000 in `proof-decomposition.mjs`. Running it on the un-split tree exits 1 on all three clauses (the genuine DF-11-A debt, live and observable). This is the born-RED planted failure.

- **S2 — Lift concern 3 into `engine-playback.ts`.** Extract the standalone-play lifecycle machine into a colocated INTERNAL `src/animation/engine-playback.ts` (the fourth `engine-*.ts` — statically imported by `engine.ts`, never re-exported beyond the engine barrel). The extraction pattern: the playback methods become thin `this`-delegates — either (`a`) the free-function host style (`playFrame(anim, t)` accepting `KeyframesAnimation<V>` as a narrow `PlaybackHost` protocol the class satisfies) OR (`b`) the `applyComposition(this, …)` style already used by `engine-composition.ts`. The `this`-bound re-derive contract is non-negotiable: `this.options === this.compiler.options` identity, the per-tick `this.frames` read, the `_interpOut` zero-alloc buffer reuse, and the `_boundFrame = this._frame.bind(this)` initialization ALL survive byte-for-byte. `interpFrames`, `at`, and `advanceTo` stay in `engine.ts` (public sampling API — external consumers). **Target: 1397L → ~900L.** The exact post-split line count is a measured outcome, not a spec number.

- **S3 — Retire / re-write the three parallel ceiling clauses in ONE pass.** (a) `proof-decomposition.mjs`: remove the engine.ts `LIBRARY_CEILING_OVERRIDE` entry if post-split ≤ 550L base (the stale guard enforces directly), OR re-write to a measured post-split cap with a revised `why` (the deep split DONE, the group.ts compositor split the remaining HANDOFF). (b) Re-point `proof:engine`'s `ANIMATION_CLASS_CEILING` to the post-split class body span. (c) Re-point `proof:engine-no-throw-on-play`'s `[hygiene g]` `LIMIT` to the post-split file length. All three in ONE commit — a split that re-points two of three and leaves the third stale is partial and fails S3's gate sweep.

- **S4 — Behavioral gate suite GREEN through the move.** The acceptance oracle is behavior, not line count. Every member of the behavioral suite must stay GREEN through the extraction: `proof:engine`, `proof:engine-no-throw-on-play`, `proof:standalone-zero-alloc`, `proof:event-ordering`, `proof:finished`, `proof:engine-correctness`, `proof:transport-events`, and the full vitest lifecycle suite (`test/engine.test.ts`, `test/lifecycle.test.ts`). The `this.options === this.compiler.options` identity, the per-tick `this.frames` read, the `_interpOut` buffer reuse, the event ordering, and the managed-child loop ownership survive byte-for-byte. A break in any of these is the REAL regression a size-only gate misses.

- **S5 — The alias-drop prerequisite honored.** The Q.WE1 `@deprecated Animation` alias on `engine.ts:1205` and the `KeyframesAnimation as Animation` re-export are GONE before this split moves the class body. If Q.WE1 has not yet landed, this wave's first action is to record that dependency and wait — the DAG edge is hard.

---

## Born-RED gate

**Gate:** `proof:engine-seam-split` (NEW — `scripts/proof-engine-seam-split.mjs`) + the existing behavioral suite (`proof:engine`, `proof:engine-no-throw-on-play`, `proof:standalone-zero-alloc`, `proof:event-ordering`, `proof:finished`, `proof:engine-correctness`).

**The REAL observables (not proxy greps).**

| Clause | Witness on today's (2026-06-23) tree | Failure mode (the REAL observable) | Expected after cure |
|--------|--------------------------------------|-------------------------------------|---------------------|
| S1 `engine.ts ≤ 950L` (**KEYSTONE**) | `wc -l src/animation/engine.ts` = 1397 | **exit 1** naming `engine.ts: 1397L exceeds 950L` — the genuine size of the un-split god-file | exit 0 — engine.ts ~900L, lifecycle machine in `engine-playback.ts` |
| S1 `engine-playback.ts` exists | `ls src/animation/engine-playback.ts` → ENOENT | **exit 1** — the extraction module is absent | exit 0 — `engine-playback.ts` present |
| S1 override retired | `grep "engine.ts.*cap.*1400" proof-decomposition.mjs` | exit 1 — the 1400 entry survives post-split, the stale-override guard would fire | exit 0 — entry removed or re-written to post-split cap |
| S4 behavioral (**discriminating bite**) | plant a BREAKING extraction: replace `this.options` mutation with `this.options = {...this.options, ...}` (fresh object) | `proof:engine` + `proof:standalone-zero-alloc` + vitest RED even though line count dropped — proving the behavioral suite catches a semantically-wrong extraction a size-only gate would PASS | GREEN through the move — `this.options === this.compiler.options` identity preserved |
| S4 zero-alloc | `proof:standalone-zero-alloc` GREEN today (one hoisted `_interpOut` buffer reused per frame) | a naive extraction re-derives `_interpOut` per call instead of reusing the hoisted buffer → the heap-delta probe reds | GREEN — buffer identity preserved across move |

**How it is born-RED today (plant-a-failure):** running `proof:engine-seam-split` on the current tree exits 1 on all three S1 clauses (engine.ts is 1397L > 950L, `engine-playback.ts` is absent, the 1400 override entry still lives in `proof-decomposition.mjs`). Additionally, planting a `this.options = {...this.options}` replacement inside the extracted `_advance` body would pass the size check while REDding `proof:engine` and the vitest identity assertions — the discriminating bite proving the behavioral suite guards against wrong extractions that happen to be small.

**Green condition:** `engine.ts` ≤ 950L; `engine-playback.ts` present; `LIBRARY_CEILING_OVERRIDE` engine.ts entry removed/re-written; `proof:engine` + `proof:engine-no-throw-on-play` + `proof:standalone-zero-alloc` + `proof:event-ordering` + `proof:finished` + `proof:engine-correctness` ALL GREEN; the vitest lifecycle suite GREEN; the `this.options === this.compiler.options` identity contract preserved; `Q.WE1` alias-drop confirmed landed (engine.ts:1205 alias absent).

---

## Dependencies

- **Q.WE1 (alias-drop) — HARD SEQUENCE FIRST.** The `@deprecated Animation` alias at `engine.ts:1205` (`export { KeyframesAnimation as Animation }`) and the `load-engine.ts` interface alias entries are `@deprecated` re-exports the 5.0.0 cut drops. The split must lift a clean class body — not one still carrying the alias line. If Q.WE1 has not landed, this wave waits. The two waves touch disjoint engine.ts regions (Q.WE1: the alias export line at :1205; Q.WF1: the class body methods :596–1188), so they compose cleanly once sequenced.
- **Q.WA3 (master-merge reconcile + proof:decomposition baseline) — prerequisite for the born-RED isolation.** `proof:decomposition` is currently RED on HEAD for group.ts, load-engine.ts, and frame-compiler.ts. The born-RED witness (engine.ts override removed → gate exit 1) cannot be ISOLATED from the other failures until Q.WA3 reconciles the baseline and Q.WF2 cures the group.ts failure. Q.WF1's `proof:engine-seam-split` gate is a NEW independent gate that does not require `proof:decomposition` to be green first — but the override-retire step in S3 still interacts with `proof-decomposition.mjs`. The safest ordering: Q.WA3 → Q.WF2 → Q.WF1.
- **Q.WF2 (group.ts SoA decomposition) — companion, sequenced before.** Q.WF2 cures the group.ts 1083L > 820L override failure in `proof:decomposition`. Landing it before Q.WF1 means proof:decomposition's remaining failure (after Q.WF2) is the engine.ts override and the two other files — a cleaner baseline for the override-retire step in S3.
- **The FN_NAME blocker — DISCHARGED.** `utils.ts:52` is now a WeakMap; `proof:no-foreign-symbol-stamp` is GREEN. No value.js publish dep. No O.W16 precondition.
- **`interpFrames`, `advanceTo`, `at` — stay in `engine.ts`.** These are external sampling APIs (`group.ts:358/929`, `group-layer-springs.ts:201/221`, `ingest.ts:268`, `morph-svg.ts:281`, `sequence.ts:330`) and must NOT move into `engine-playback.ts`. The split scope is concern 3 (the standalone-play loop) ONLY. (Anchor correction: `sequence.ts:330` is the `animation.interpFrames(local, true)` call inside `seek()`; line 300 is docstring text in the method comment, not a call site.)
- **No cross-repo dep, no glass-ui dep, no parse-that dep.** The extraction is entirely kf-internal.

---

## dev→impl boundary

This file is the Tranche Q DEVELOPMENT spec for Q.WF1 — DOCS ONLY (inv-16: kf writes only keyframes.js). The IMPLEMENTATION (the `engine-playback.ts` extraction, the three-clause ceiling re-point, the behavioral suite verification) opens ONLY on the owner's explicit authorization, in DAG order: Q.WA3 baseline reconcile → Q.WE1 alias-drop → Q.WF2 group.ts decomp → Q.WF1. Gate-first (S1 born-RED authored before any extraction), observable-truth (the behavioral suite is the acceptance oracle, not the line count), no-legacy (the 1400 override retired/re-written — the HANDOFF text gone once the split lands), KISS (the fourth `engine-*.ts` extraction instance, no new patterns), no-deferral (DF-11-A discharged — the HANDOFF text removed from `proof-decomposition.mjs` in the same commit the split lands).

---

## Mid-tranche friction pre-emption

- **FRICTION: `proof:decomposition` RED for other files blocks the born-RED isolation.** If Q.WF1 runs while group.ts, load-engine.ts, and frame-compiler.ts are still over cap, the override-removal witness cannot be isolated as "the engine.ts failure." PRE-EMPT: Q.WF1 authors a SEPARATE `proof:engine-seam-split` gate independent of `proof:decomposition`; the override-retire step in S3 is the ONLY interaction with `proof-decomposition.mjs`, and it is sequenced after Q.WF2 cures the group.ts failure.
- **FRICTION: a future implementer might re-scope `interpFrames` into `engine-playback.ts`.** `interpFrames` is the public sampling API; moving it would break `group.ts`, `ingest.ts`, `morph-svg.ts`, `sequence.ts`. PRE-EMPT: S2 NAMES the excluded methods explicitly; S4's behavioral suite REDs if an external consumer breaks.
- **FRICTION: host-passing style (`playFrame(anim)`) risks degrading the zero-alloc path if the bound `_frame` callback allocates a new closure per loop start.** PRE-EMPT: S4's `proof:standalone-zero-alloc` is the oracle — the buffer identity assertion reds on a per-call closure alloc. The `_boundFrame = this._frame.bind(this)` initialization stays at construction time.
- **FRICTION: Q.WE1 (alias-drop) migrates 33 demo consumers mid-tranche; if it slips, Q.WF1 waits.** The DAG edge is hard; Q.WF1 cannot land before Q.WE1. PRE-EMPT: Q.WE1's `proof:no-legacy-surface` gate is authored born-RED in Q.WE1 itself; Q.WF1 simply declares the dependency and waits for that gate to be GREEN.
