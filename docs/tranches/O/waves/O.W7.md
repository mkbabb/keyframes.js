# O.W7 — The engine-seam transposition (the lifecycle/playback machine lifted off the frame-compile facade)

**Band:** D — Transposition + no-legacy
**Phase:** VJ-L1-GATED (fires atomically on value.js Tranche P shipping VJ-L1 flatLeaf, consumed via O.W16; NOT NOW)
**Sequence:** O.W10 (KF-TO-VALUEJS-P-ASKS dispatch) → value.js P publish (VJ-L1) → **O.W16** (S8 FN_NAME delete) → **O.W7** (the split over the cleared `utils.ts` seam) → O.WZ (chronic-closure reads DF-11-A discharged). The value.js-P spine edge is `O.W16 → O.W7 → O.WZ` — this wave (O.W7) sits BETWEEN O.W16 and the close, NOT a dangling "(VJ-L1)" label.
**Owning chronic/DM:** DF-11-A (the FULL engine-seam transposition; the single largest structural debt in the library surface, lane-11 §10 / C15) + DF-11-B (the co-deferred group.ts compositor arm)

M-substrate: **M.W13** (the engine-seam transposition developed wave, 2026-06-17). This wave
IMPLEMENTS M.W13's S1–S5 as written; the full developed S-clause body — the four-concern
state-machine anatomy, the `this`-bound re-derive contract, the three-place ceiling enforcement,
the `engine-composition.ts` extraction precedent — lives in M.W13.md and is NOT re-authored here.

Key delta from M.W13 to O.W7:
- **The blocker moved tranches.** M.W13 gated on `value.js 0.14.0 (VJ-L1)` consumed by M.W9.
  value.js Tranche O shipped **VJ-L2 only** — VJ-L1 `flatLeaf` was NEVER shipped (B10, B7
  BLOCKER: `"flatLeaf" in require("@mkbabb/value.js") === false` on 1.0.2). So the blocking
  HANDOFF is now **value.js Tranche P** (dispatched at O.W10), consumed at **O.W16** (the S8
  `FN_NAME` Symbol delete), and O.W7 reads the post-O.W16 `utils.ts` seam — NOT M.W9's.
- **The chronicity advanced.** engine.ts is **still 1397L** on 2026-06-19 (C15: `wc -l` confirmed,
  3L under the 1400 override). The DF-11-A HANDOFF text is verbatim-present at
  `proof-decomposition.mjs:151-157` and rode D→…→M unsplit. The override is the most-deferred
  named exception in the tree (G30, C15).
- **Everything else holds.** The seam, the `this`-bound re-derive risk, the three parallel
  ceiling clauses, the `engine-composition.ts`/`engine-options.ts`/`engine-css-metadata.ts`
  precedent, the S5 group.ts disposition (land-with OR re-defer-with-revised-rationale) — all
  carry from M.W13 unchanged. O.W7 is the implementation authorization, delta-noted, referencing
  M.W13 for the full body.

---

## Context

`src/animation/engine.ts` is the library's largest module — **1397L** (verified live 2026-06-19,
C15 / G30 / F29), 3 lines under the `LIBRARY_CEILING_OVERRIDE` cap of 1400
(`proof-decomposition.mjs:132`). It is the only `src/animation/**` file capped over 900L. The
override is JUSTIFIED (the gate's `why` records the cohesion rationale correctly) but it also
carries, in the same entry, a **BORN-RED HANDOFF (P-invariant-28)** verbatim
(`proof-decomposition.mjs:151-157`): *"the FULL engine-seam transposition the D.W4 audit named
('the 1100-line god-object at the right seam' — the lifecycle/playback machine lifted off the
frame-compile facade) is a DEFERRED future-tranche split, NOT a silent punt."* The D.W4 audit
named this seam; every tranche since (D→E→F→G→H→I→J→K→L→M) has deferred it. M scheduled it
(M.W13) but the long-horizon campaign implemented only a slice of M — the split was NOT built
(C15: *"the engine-seam transposition (M.W13, the largest structural debt) remains deferred, now
blocked specifically on VJ-L1"*). **O is where it lands** — once the VJ-L1 precondition is
genuinely met (which value.js O failed to ship, so the gate moved to value.js P).

**The seam (what splits, from M.W13).** engine.ts defines `KeyframesAnimation<V>` (the PKG-3
rename of `Animation`, `engine.ts:101`) + `CSSKeyframesAnimation<V> extends KeyframesAnimation<V>`
(`:1207`). The class body is a four-concern machine: (1) the compile-delegation facade (`parse()`,
`_compiler`, `get frames`, `adoptCompiler`, `interpFrames`); (2) the live-options-reference setters
(`setDuration`…`setComposite`, each mutating `this.options` in place — never replacing it); (3)
**the lifecycle/playback machine** (`play`/`pause`/`resume`/`stop`/`playing`/`get effectiveT`/
`settle`/`reset`/`paintRest`/`_frame`/`_renderFrame`/`_snapToReducedMotion`/`advanceTo` + the
`readonly playback: RAFPlayback` handle); (4) the fill/rest contract. The D.W4-named split lifts
concern **3** off concern **1** into a colocated INTERNAL `engine-playback.ts` (the exact
`engine-composition.ts` 221L / `engine-options.ts` 193L / `engine-css-metadata.ts` 148L
precedent) — expected outcome **1397L → ~900L** (M.W13 §S1, lane-11 §6).

**Why the FN_NAME-stamp split is BLOCKED on value.js VJ-L1 (the gating fact this wave carries).**
The split's one load-bearing risk (M.W13 §Context, lane-11 §8) is the `this`-bound re-derive
contract — and one of its couplings is NOT in engine.ts itself but in the `utils.ts` interp seam
the compile half reaches through: kf stamps a private `FN_NAME = Symbol("kf.fnName")`
(`utils.ts:45`) onto **published value.js `ValueUnit` instances** to carry the flatten-origin
function name through interp, re-stamped on every `.clone()` because `ValueUnit.clone()` drops it
(S8 — verified live, B10: `utils.ts:1/45/47/50/51/54/55/64/213/236/289/293/342/361`). Splitting the
playback machine off the facade **while that Symbol sidechannel is live on a class kf does not own**
risks exactly the invisible-state coupling the D.W4 audit flagged. The provenance belongs in
value.js's flatten API — **VJ-L1 `flatLeaf(valueUnit, { fnName })`**. O.W7 does NOT delete the
Symbol (that is O.W16's job, the value.js-P consume); it **CONSUMES the cleared `utils.ts` seam**
and lifts the playback machine.

**The new blocker chain (the M→O delta, B7/B10/F25/G30).** value.js Tranche O shipped VJ-L2 only;
VJ-L1 and VJ-L3 were **DEFERRED and never shipped** (B7 BLOCKER, B10 BLOCKER — confirmed by live
probe on 1.0.2). So the M.W13 chain `value.js 0.14.0 → M.W9 → M.W13` is **broken at the first
edge**. O re-forms it: **O.W10 dispatches VJ-L1 to value.js Tranche P → value.js P publishes →
O.W16 deletes S8 (`proof:workaround-deletion` S8 flips PENDING→GREEN) → O.W7 splits the engine over
the cleared seam.** O.W7 is a **GATED** wave: not startable until O.W16 lands. (DM-5 S8 chronicity:
K,L,M→O = 3 today, named with its terminal value.js-P home per P-inv-28 — not a perpetual punt;
the `P-inv-28 >=4` belt fires at **kf-P** (the NEXT kf tranche after O, NOT kf-Q) if value.js P slips.)

**The three-place ceiling enforcement (the gate ground truth, from M.W13 §Context, re-verified).**
The engine.ts ceiling is enforced in THREE gates, not one:
1. `proof:decomposition` clause-1 — the `LIBRARY_CEILING_OVERRIDE` engine.ts:1400 entry
   (`proof-decomposition.mjs:128-159`) + the stale-override guard (`:381-389`) that REDS if
   engine.ts drops back under the 550 base while the override survives;
2. `proof:engine` — the `ANIMATION_CLASS_CEILING` clause measuring the `KeyframesAnimation` class
   body span (`proof-engine.mjs:79-104` — "the god-object is regrowing");
3. `proof:engine-no-throw-on-play` — the `[hygiene g]` engine.ts file-line `LIMIT`
   (`proof-engine-no-throw-on-play.mjs:82-91`).
A split that moves the playback machine OUT shrinks the file AND the class body — all three must be
re-pointed to the post-split reality in ONE pass (M.W13 §S2). The stale-override guard means the
override entry CANNOT be left in place once the file drops: it is either REMOVED (if post-split ≤550
base) or RE-WRITTEN to a measured ~900 cap with a revised `why` (the deep split DONE, the group.ts
arm the remaining HANDOFF). **The exact cap is a measured outcome, not a spec number.**

**The regime is AFFIRMED, not reconsidered (lane-11 §3.3).** The 550/700/1400 ceiling regime is
SOUND — O does NOT raise or abolish it. O.W7 RETIRES the one most-deferred exception
(engine.ts:1400) by curing its root (the deep split), not by raising any cap. The discovery-latency
issue the regime surfaced at L-close is cured by O.W1's LINT tier (sub-second per-save ceiling
checks), orthogonal to this structural lift.

### Audit evidence

| Ref | Source location | Fact (verified 2026-06-19) |
|-----|-----------------|----------------------------|
| C15 / G30 / F29 | `wc -l src/animation/engine.ts` | **1397L** — 3L under the 1400 override; the only `src/animation/**` file capped over 900 |
| C15 / lane-11 §6 DF-11-A | `proof-decomposition.mjs:151-157` | the engine.ts override `why` carries the BORN-RED HANDOFF (P-inv-28) text verbatim — the FULL engine-seam transposition DEFERRED, NOT a silent punt |
| B10 BLOCKER / B7 BLOCKER | live probe on `@mkbabb/value.js@1.0.2` | `"flatLeaf" in require("@mkbabb/value.js") === false` — VJ-L1 was DEFERRED by value.js O, never shipped (VJ-L2 only) |
| C15 / B10 / F29 | `src/animation/utils.ts:45` | `const FN_NAME = Symbol("kf.fnName")` stamps a private Symbol onto published value.js `ValueUnit`; S8 PENDING (the split-blocking coupling) |
| C15 / F25 / G30 | `M/PROGRESS.md:139` | M.W13 recorded as STAGED/blocked on VJ-L1; the split was developed (M) but never implemented (the campaign shipped only a slice of M) |
| the seam | `src/animation/engine.ts:101,1207` | `export class KeyframesAnimation<V>` + `class CSSKeyframesAnimation<V> extends KeyframesAnimation<V>` |
| concern 3 (playback) | `engine.ts:596,896,921,1085,1092,1120,1143,1162` | `paintRest`, `_frame`, `_renderFrame`, `pause`, `resume`, `stop`, `settle`, `reset` — the machine to lift |
| the re-derive seam | `engine.ts:288-294,382-402,453-462` | setters mutate `this.options` in place (never replace); `this.options === this.compiler.options` identity; `setDuration` re-reads `this.frames` to re-time — the byte-for-byte contract |
| precedent | `wc -l engine-composition.ts engine-options.ts engine-css-metadata.ts` → 221/193/148 | three colocated INTERNAL helper modules engine.ts statically imports, never re-exported — the extraction pattern this wave extends |
| ceiling gate #1 | `proof-decomposition.mjs:128-159,381-389` | the `LIBRARY_CEILING_OVERRIDE` engine.ts:1400 entry + the stale-override guard |
| ceiling gate #2 | `proof-engine.mjs:79-104` | the `ANIMATION_CLASS_CEILING` clause measures the `KeyframesAnimation` class body span |
| ceiling gate #3 | `proof-engine-no-throw-on-play.mjs:82-91` | the `[hygiene g]` engine.ts file-line `LIMIT` |
| gate exit today | `node scripts/proof-decomposition.mjs` → exit 0 | passes ONLY because the override exists; the deep split is the named HANDOFF, not a current red |
| dep (the new chain) | O.W10 (KF-TO-VALUEJS-P-ASKS) + O.W16 (S8 delete) | value.js P ships VJ-L1 → O.W16 deletes `FN_NAME` → O.W7 reads the cleared seam |

---

## Scope (delta-only — full S-clauses in M.W13.md §S1–S5)

O.W7 implements M.W13 S1–S5 verbatim over the **post-O.W16** `utils.ts` (the `FN_NAME` Symbol
already deleted by the value.js-P consume). Each S-clause is unchanged from M.W13; the only delta
is the precondition source (O.W16, not M.W9).

- **S1 — Lift the lifecycle/playback machine into `engine-playback.ts`.** Extract concern 3 into a
  colocated INTERNAL module, statically imported by engine.ts, never re-exported beyond the engine
  (the `engine-composition.ts` precedent). Playback methods become thin `this`-delegates whose
  bodies live in `engine-playback.ts` (the `applyComposition(this, …)` binding style) OR keyed off
  a narrow `PlaybackHost` protocol the class satisfies. **1397L → ~900L.** Full prose: M.W13 §S1.
- **S2 — Retire the engine.ts:1400 override; re-point the THREE parallel ceiling clauses in ONE
  pass.** Remove the override if post-split ≤550 base (the stale guard then enforces the base
  directly), OR re-write it to a measured ~900 cap with a revised `why` (the deep split DONE, the
  group.ts arm the remaining HANDOFF). Re-point `ANIMATION_CLASS_CEILING` and `[hygiene g]` to the
  post-split reality. The cap is a measured outcome. Full prose: M.W13 §S2.
- **S3 — Behaviour-byte-identical: the full engine/playback gate suite GREEN through the move.**
  The acceptance oracle is the behavioural suite, NOT the line count — `proof:engine`,
  `proof:engine-no-throw-on-play`, `proof:standalone-zero-alloc`, `proof:event-ordering`,
  `proof:finished`, the managed-child contract, the vitest lifecycle suite — each GREEN through the
  move. The `this.options === this.compiler.options` identity, the per-tick `this.frames` read, the
  `_interpOut` zero-alloc buffer reuse, the event ordering, the managed-child loop ownership MUST
  survive byte-for-byte. Full prose: M.W13 §S3.
- **S4 — The born-RED witness: `proof:decomposition` with the engine.ts override REMOVED** (the
  gate-first law). Author the RED FIRST — before S1's extraction. See §Born-RED gate. Full prose:
  M.W13 §S4.
- **S5 — Dispose the co-deferred group.ts compositor split (DF-11-B, P-inv-28).** group.ts is 812L
  under its 820 override; the override `why` co-defers the compositor-seam split WITH the engine
  transposition. Now that S1 re-threads the composite contract, the obligation falls due: **(a)**
  land-with-engine (extract `group-compositor.ts`, retire the 820 override, `proof:spring-blend-
  weight` + `proof:blend` GREEN) IF the re-threaded contract makes the seam cleanly separable; OR
  **(b)** re-defer with a REVISED rationale (named-not-silent) IF the gate-locked composite
  statements must stay inline. Evidence-driven, no manufactured carve. Full prose: M.W13 §S5.

---

## Born-RED gate

**Gate:** `proof:decomposition` with the `LIBRARY_CEILING_OVERRIDE` engine.ts:1400 entry REMOVED
(the cap reverts to the 550L base) — an EXISTING gate; the override removal is the born-RED trigger
this wave authors FIRST (S4), before S1's extraction. The two parallel engine-ceiling clauses
(`proof:engine`'s `ANIMATION_CLASS_CEILING`, `proof:engine-no-throw-on-play`'s `[hygiene g]`) red in
the same removal and are re-pointed by S2. **The acceptance of the cure is the FULL behavioural
engine/playback gate suite (S3)** — the split's RISK is a behaviour regression, not a line count.

**The REAL runtime observable (observable-truth — the genuine defect, measured live, not a proxy).**

| Clause | Witness on today's (2026-06-19) tree | Failure mode today (the REAL observable) | Expected after cure |
|--------|--------------------------------------|------------------------------------------|---------------------|
| S4 override-removed decomposition (**KEYSTONE**) | remove the engine.ts override → `node scripts/proof-decomposition.mjs` | **exit 1** naming `src/animation/engine.ts: 1397L exceeds the 550L library ceiling` — the real `wc -l` of the un-split 1100-line god-object measured against the base cohesion floor, no exception (the genuine DF-11-A debt, lane-11 §10) | exit 0 WITHOUT the 1400 override — engine.ts ~900L, the lifecycle/playback machine in `engine-playback.ts`, the override retired/re-written to the measured cap |
| S3 behavioural acceptance | the full engine/playback gate suite (`proof:engine`, `proof:engine-no-throw-on-play`, `proof:standalone-zero-alloc`, `proof:event-ordering`, `proof:finished` + the vitest lifecycle suite) | GREEN today (the machine is intact in engine.ts) — the split MUST keep them GREEN; a break in the `this.options===compiler.options` identity / per-tick `this.frames` read / zero-alloc buffer / event ordering / managed-child loop is the real regression a size-only gate misses | GREEN through the move — the `this`-bound re-derive contract preserved byte-for-byte |
| S5 group.ts co-deferral | `wc -l src/animation/group.ts` → 812L; `proof-decomposition.mjs:200-205` | the group.ts:820 override co-defers the compositor split WITH the engine seam — P-inv-28 falls due on the engine re-thread | (a) split done, override retired + `proof:spring-blend-weight`/`proof:blend` GREEN; OR (b) override re-written with a REVISED `why` naming the post-engine-split deferral reason |

**How it is born-RED (plant-a-failure).** Today `proof:decomposition` exits 0 ONLY because the
1400 override masks the 1397L god-object. **Remove the `LIBRARY_CEILING_OVERRIDE` engine.ts entry
(or temporarily lower its cap to the 550 base) and the gate exits 1**, naming engine.ts at 1397L
over the base — the genuine structural debt the D.W4 audit named, live the instant the override is
lifted. This is the real `wc -l` of the real file against the real base ceiling — NOT a grep proxy.
A gate that merely greps `"does engine-playback.ts exist"` would be the proxy mistake (it greens on
a manufactured empty file); the size-of-the-un-split-god-object witness only a genuine cohesive
extraction can reduce. **Discriminating bite:** plant a BREAKING extraction (replace the in-place
`this.options` mutation with a fresh-object assignment) → `proof:engine` / the round-trip suite RED
even though the line count dropped — proving the cure is the behaviour, not the size.

**Green condition.** The lifecycle/playback machine lifted into `engine-playback.ts` (S1) over the
post-O.W16 (FN_NAME-cleared) `utils.ts` seam, the `this`-bound re-derive contract preserved
byte-for-byte; engine.ts ~900L; the 1400 override retired or re-written to the measured cap with a
revised `why` (S2); the three parallel ceiling clauses re-pointed (S2); `proof:decomposition` exits
0 WITHOUT the 1400 override; the full behavioural suite GREEN through the move (S3); the group.ts
arm disposed (S5, P-inv-28 discharged).

---

## Dependencies

- **value.js Tranche P VJ-L1 flatLeaf — THE blocking HANDOFF (via O.W16).** value.js O shipped
  VJ-L2 only; VJ-L1 was DEFERRED and never shipped (B7/B10 BLOCKER). O.W10 dispatches VJ-L1 to
  value.js Tranche P; O.W16 consumes it (deletes the `FN_NAME` Symbol, `proof:workaround-deletion`
  S8 flips PENDING→GREEN). **O.W7 opens only AFTER O.W16's consume commit lands** (the cleared
  `utils.ts` seam). The HANDOFF chain: value.js P publish (VJ-L1) → O.W16 consume → O.W7 split.
  Named tripwire: `flatLeaf in require("@mkbabb/value.js")` transitions false→true; the
  `proof:workaround-deletion` S8 arm is the machine-readable gate.
- **O.W16 (the value.js-P consume) — the in-tranche precondition.** O.W16 S8 deletes the `FN_NAME`
  Symbol on the value.js-P re-pin. O.W7 reads the post-FN_NAME-delete `utils.ts`. The two are
  sequenced (O.W16 → O.W7), not parallel.
- **O.W1 (the LINT tier) — the soft precondition.** Sub-second per-save ceiling checks make the
  iterate-to-green during the split far faster; O.W1 lands early (Band A), O.W7 lands late (Band D),
  the ordering is natural — no explicit gate.
- **O.W9 (no-legacy cuts) — Band-D sibling, NO collision.** O.W9 drops the `@deprecated Animation`
  alias on `engine.ts:1205` and swaps `internal/leaves.ts`; O.W7 lifts concern 3 out of the
  `KeyframesAnimation` class body. The two touch engine.ts in disjoint regions (O.W9: the alias
  line + the leaves; O.W7: the class-body methods). Sequence O.W9 (NOW) before O.W7 (GATED) so the
  alias line is already gone when the class body moves — they compose cleanly.
- **O.W8 (perf) — Band-D sibling, no collision.** O.W8 measures the playback hot path
  (`_frame`/`interpFrames`); O.W7 MOVES it into `engine-playback.ts`. The zero-alloc steady-state
  path (`_interpOut` buffer reuse) is a SHARED invariant — O.W7 S3 keeps `proof:standalone-zero-
  alloc` GREEN; O.W8's bench asserts the throughput is unregressed. They compose (the split is
  zero-alloc-preserving; the bench confirms no regression).
- **O.WZ (the close).** `proof:chronic-closure` (re-pointed M→O) reads DF-11-A discharged (the
  engine-seam transposition done) and DF-11-B disposed (group.ts split-or-re-deferred). The
  P-inv-28 accounting in `PROGRESS.md §"Open deferrals"` records the engine arm EXITED and the group
  arm per S5's disposition before O.WZ's planted-row probe.

---

## dev→impl boundary

This file is the Tranche O DEVELOPMENT spec for O.W7 — DOCS ONLY (inv-16: kf writes only
keyframes.js; the VJ-L1 need is a DISPATCH at O.W10, never a value.js-tree edit). The IMPLEMENTATION
(the `engine-playback.ts` extraction, the override retire, the three-clause re-point, the group.ts
disposition) opens ONLY on the owner's explicit authorization AND on the VJ-L1-GATED HANDOFF firing
(value.js P publishes VJ-L1 → O.W16 lands). Gate-first, born-RED, observable-truth, no-legacy,
gestalt, KISS throughout. The full developed S-clause body is M.W13.md; this wave carries the O
authorization, the moved-tranche blocker chain, the born-RED witness, and the delta — it does NOT
re-author M.W13's body. The born-RED witness (S4: the override removed → `proof:decomposition` exit
1 on 1397L) is observable on today's tree the instant the override is lifted; the cure awaits both
authorization and the O.W16 precondition.
