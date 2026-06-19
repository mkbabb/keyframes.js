# O.W8 — Performance closure (honest, portable measurement)

**Band:** D — Transposition + no-legacy
**Phase:** NOW (kf-internal; every S-clause is a kf-side measurement instrument or doc edit — zero sibling publish to land)
**Sequence:** O.W0 (charter) → A{O.W1 lint, O.W2 ledger} → **O.W8** (parallel with O.W9 NOW; O.W7 GATED) → O.WZ (close)
**Owning chronic/DM:** none net-new (the perf-honesty wave); composes with the DM-5 S8/S9 consume (validation instrument for the value.js-P color-math edge) and the DF-11-A engine split (shared zero-alloc invariant)

M-substrate: **M.W12** (the performance-closure developed wave, 2026-06-17). This wave IMPLEMENTS
M.W12's S1–S7 as written; the full developed S-clause body — the five un-measured gaps, the
PLAY-leg/COMPILE-leg color distinction, the `postTask` INP keystone, the doc correction — lives in
M.W12.md and is NOT re-authored here.

Key delta from M.W12 to O.W8:
- **Two new perf gaps the O re-audit surfaced (E21).** (a) `transformTargetsStyle` calls
  `unflattenObjectToString(vars)` WITHOUT an `out` buffer on each rAF frame — allocating a fresh
  `Record<string,string>` per frame on the DOM-write path (value.js's API supports an `out` param
  that makes it zero-alloc); (b) a residual O(N) `this.frames.findIndex` scan inside `reconcileVars`
  (`frame-compiler.ts:418`) defeats the `buildVarIndex` O(1) pre-index for already-compiled frames.
  These are ADDED to M.W12's five gaps as O.W8 S8/S9 (compile-time + DOM-write zero-alloc arms).
- **The cross-repo edge moved tranches.** M.W12 S7 dispatched VJ.L1–L8 to value.js O; value.js O
  shipped only a slice and the color-math zero-alloc rewrites are still ahead. The kf-side
  validation instrument (S2's densify arm) graduates on the **value.js Tranche P** color-math
  publish (re-pointed from M.W9), not value.js O.
- **Portability is the spine (E24 strength + the owner mandate).** The wave's defining discipline:
  every floor is a **device-INDEPENDENT ratio** (same-report `baseHz × frac`), HARD everywhere,
  with the absolute wall-clock magnitude observe-only ONLY. This is the E24-confirmed gold standard
  (ratio-relative `baselineCase × floorFraction` with `declarePosture`), made the universal rule —
  no absolute `floorHz` survives as a HARD CI predicate.

---

## Context

Lane-29/lane-30 (M audit) certified the L perf surface as **clean — no precept violation** — but
with **five un-measured / mis-attributed gaps** the L gates structurally cannot see. The O re-audit
(E21, E24, F29) confirms the five persist on 2026-06-19 AND surfaces two more allocation gaps. O.W8
is the **honesty wave**: it closes each gap with a kf-side measurement instrument whose born-RED
witness is the REAL runtime observable (observable-truth), corrects the one factual doc error, and
keeps the value.js color-math co-bench dispatch on the acyclic spine. **The wave ships ZERO engine
code** — the engine perf is already SOTA (monomorphic dispatch, zero-alloc steady state,
phase-separated PLAY path, E21 strength). O.W8 is the gate apparatus that makes the perf claims
FALSIFIABLE and TRACKED, plus the two genuine zero-alloc cures (S8/S9) the re-audit found.

The five M.W12 gaps (each live-verified 2026-06-19, E21/E24):
1. **`NumericAnimation.at()` has NO kf-side throughput bench** — `bench/numeric-soa.bench.ts` ENOENT;
   the LIGHT-tier SoA win (the value.js-free re-implementation, the most-likely-to-regress) is
   asserted only by a `Float64Array` sentinel (`test/zero-alloc.test.ts:181-182`), never a
   throughput number. The borrowed "1.56× at K=2" is value.js's G-era microbench, not kf's.
2. **No color-interpolation integration bench** — `bench/interpolation.bench.ts` benches opacity +
   transforms ONLY; the color PLAY leg + the densify COMPILE leg are entirely un-benched; value.js
   P's color-math rewrites cannot be validated on re-pin (no before/after instrument).
3. **`bench/sync-step.bench.ts` un-wired into the taxonomy** — it RUNS in `proof:bench-runs`
   (`proof-bench-runs.mjs:51`) but is ABSENT from `taxonomy.json:suites`; its four J.W6 loop-core
   cases are outside the `proof:bench-taxonomy` coverage floor.
4. **The `postTask` probe is GREEN-by-SKIP, never measured** — `proof:scheduler-posttask` SKIPs in
   jsdom; **the gate has NEVER measured the INP delta it was built to gate** (wrapping
   `warmEngine()`'s `loadAnimationEngine()` in `scheduler.postTask("background")` vs bare
   `void loadAnimationEngine()`). The exact observable-truth failure: a gate testing a proxy ("the
   probe didn't error in an env that lacks the API") that never bites the real observable.
5. **The budgeted floors are NOT enforced** — the three `budgeted` arms route every floor miss
   through `declarePosture("observe-only")`, so a 2× throughput REGRESSION NOTES and stays GREEN.
   The warmEngine arm uses an ABSOLUTE `floorHz:1000` (device-dependent AND un-tracked to a baseline)
   — no device-INDEPENDENT floor is HARD everywhere.

The two NEW O-surfaced gaps (E21 BLOCKER-adjacent HIGH):
6. **`transformTargetsStyle` per-frame `Record` alloc** — `unflattenObjectToString(vars)` called
   without an `out` buffer on the DOM-write path allocates a fresh `Record<string,string>` every rAF
   frame; value.js exposes an `out` param that makes it zero-alloc (E21 rec 2).
7. **Residual O(N) `reconcileVars` findIndex** — `frame-compiler.ts:418` `this.frames.findIndex`
   inner scan defeats the `buildVarIndex` O(1) pre-index, degrading large-stop animations at
   compile-time (E21 rec 3; the CF-2 guard claimed O(N) but the inner scan re-introduces O(N²)).

### Audit evidence

| Ref | Source (file:line) | Gap |
|-----|--------------------|-----|
| lane-29 Gap 2 / E21 | `numeric.ts:145-208` (SoA shipped); `bench/numeric-soa.bench.ts` ENOENT; `test/zero-alloc.test.ts:181-182` (sentinel only) | `NumericAnimation.at()` throughput un-benched kf-side |
| lane-29 Gap 3 / lane-30 §2.2-2.3 / E21 | `bench/interpolation.bench.ts` (opacity+transforms only); no color suite | color-interp PLAY + densify COMPILE legs un-benched; value.js P color-math un-validatable |
| lane-29 Gap 1 / E21 / E24 | `bench/taxonomy.json:suites` (5, sync-step absent); `proof-bench-runs.mjs:51` (runs it); `proof-bench-taxonomy.mjs:207-242` | `sync-step.bench.ts` 4 cases un-classified, un-budgeted |
| lane-29 Gap 5 / lane-30 §3.4 | `scripts/proof-scheduler-posttask.mjs:31` (SKIPs in jsdom) | postTask INP benefit never measured — GREEN-by-SKIP, not by measurement |
| lane-29 §1e/§2 / E24 | `proof-bench-taxonomy.mjs:66-70` + `ci-env.mjs:63-65` (observe-only miss never reds); `taxonomy.json` warmEngine `floorHz:1000` (absolute) | budgeted floors un-enforced; no device-independent HARD floor |
| **E21 rec 2 (NEW)** | `transformTargetsStyle` → `unflattenObjectToString(vars)` w/o `out` buffer | per-frame `Record<string,string>` alloc on the DOM-write path; value.js `out` param supported |
| **E21 rec 3 (NEW)** | `frame-compiler.ts:418` `this.frames.findIndex` | residual O(N) scan inside `reconcileVars` defeats `buildVarIndex` O(1) pre-index |
| lane-29 §5 / lane-30 §3.3 | `L.W7.md:24,450,451` vs `J.W6-impl.md:327` + `G/audit/a-valuejs-leverage.md:173` | "1.56×–4.25×" is value.js's G-era number, mis-cited as kf's J.W6 measurement |
| E24 | `bench/taxonomy.json:264-313` `crossRepo[]` (VJ.L1–L8) | color-math co-bench dispatch must stay intact; graduates on value.js-P publish |

---

## Scope (delta-only — full S-clauses in M.W12.md §S1–S7)

O.W8 implements M.W12 S1–S7 verbatim, with the cross-repo edge re-pointed value.js-O → value.js-P,
PLUS two new zero-alloc arms (S8/S9) the O re-audit surfaced. The full developed prose for S1–S7 is
in M.W12.md — this wave carries the authorization, the deltas, the two new arms, and the born-RED
gate.

- **S1 — `bench/numeric-soa.bench.ts`** — the kf-side `NumericAnimation.at()` K-ladder at
  K∈{2,5,12,32}, 600-frame window; classified `observe-only` in `taxonomy.json`. Full prose: M.W12
  §S1.
- **S2 — `bench/color-interp.bench.ts`** — the PLAY-leg (`interpFrames` color corpus) + the
  densify-COMPILE-leg (oklch-space ramp, the allocating one); both `observe-only`; the densify arm
  is the kf-side validation instrument that graduates on the **value.js-P** color-math publish
  (delta: re-pointed from value.js O). Full prose: M.W12 §S2.
- **S3 — wire `bench/sync-step.bench.ts` into the taxonomy** — add to `suites`; classify the 4
  J.W6 cases (loop-core `run-check`; `play(Animation)`/`play(Group)` `observe-only`). Full prose:
  M.W12 §S3.
- **S4 — RE-TARGET `proof:scheduler-posttask` onto a REAL-BROWSER INP measurement** (the
  observable-truth keystone) — measure the INP delta of `postTask("background")` vs bare
  `void loadAnimationEngine()` in a real chromium; record ADOPT/KILL in
  `scripts/scheduler-posttask-decision.json`. Full prose: M.W12 §S4.
- **S5 — budgeted-floor ENFORCEMENT: a device-independent HARD ratio** — split each budgeted arm's
  floor into the device-INDEPENDENT ratio (HARD everywhere via `declarePosture("hard")`) + the
  absolute-magnitude (observe-only ONLY); re-derive the warmEngine arm from absolute `floorHz:1000`
  to a `baselineCase × floorFraction` ratio. Full prose: M.W12 §S5.
- **S6 — the `L.W7.md` doc correction** — cite the kf-side 16.6× at K=8 as kf's measurement; label
  the "1.56×–4.25×" as value.js's OWN `numeric-soa.mjs` provenance number; grep-falsifiable. Full
  prose: M.W12 §S6.
- **S7 — the value.js color-math co-bench DISPATCH** (acyclic spine, NO kf code change) — confirm
  the VJ.L# dispatch is INTACT; add the lane-30 §7 `VJ.O.DIRECT-OKLCH-OKLAB` ask; **delta:** the
  dispatch target is value.js Tranche P (re-pointed from value.js O, which never shipped the
  color-math zero-alloc rewrites — E24). The kf-side validation edge (S2's densify arm) graduates on
  the value.js-P re-pin. Full prose: M.W12 §S7.
- **S8 (NEW) — `transformTargetsStyle` per-frame DOM-write zero-alloc** — hoist a module-scope
  `const _styleOut: Record<string,string> = {}` and pass it as the `out` arg to
  `unflattenObjectToString` on the apply path, eliminating the per-frame `Record` allocation (E21
  rec 2). Gate via a `proof:standalone-zero-alloc` extension asserting **zero fresh objects created
  during the DOM-write phase of a 60-frame steady window** (the REAL observable — a heap-delta
  probe, not a source grep). This is a genuine engine micro-edit (the only engine-touching arm) —
  scoped, zero behaviour change, value.js's `out` API already supports it.
- **S9 (NEW) — `reconcileVars` O(1) frame-dedup** — build a `Map<id, frame>` keyed by
  `startIx × FRAME_ID_SCALE + endIx` (the `id` already computed in `createFrame`) alongside
  `buildVarIndex`, replacing the O(N) `this.frames.findIndex` inner scan (`frame-compiler.ts:418`)
  with an O(1) lookup. Gate via a `bench/compile.bench.ts` case at **N=1000 stops** that makes the
  quadratic regression observable as a ratio inversion (the REAL observable — the compile-time hz
  collapse at large N, not the source shape). Compile-time only (E21 confirms not per-frame), but a
  real correctness-class quadratic the CF-2 guard claimed cured.

---

## Born-RED gate

**Gate:** `proof:bench-taxonomy` (EXTENDED — S1/S2/S3/S5/S7/S9 arms) + `proof:scheduler-posttask`
(RE-TARGETED — S4 real-browser arm) + `proof:standalone-zero-alloc` (EXTENDED — S8 DOM-write arm).
The wave's DONE is the EXTENDED gates biting RED on the REAL runtime observables on today's tree,
before any bench/decision/cure artifact exists.

**The REAL runtime observable per arm (observable-truth — each bites the genuine breach, not a
source-grep proxy).**

| Arm | The REAL observable the gate bites | Born-RED witness on today's (2026-06-19) tree |
|-----|-------------------------------------|------------------------------------------------|
| S1 numeric-SoA | `proof:bench-taxonomy` coverage: a classified `numeric-soa` case absent from the bench REPORT (the gate runs `vitest bench` and asserts finite hz) | `bench/numeric-soa.bench.ts` ENOENT → manifest names cases the report cannot contain → coverage clause reds (`proof-bench-taxonomy.mjs:245-253`) |
| S2 color-interp | coverage: the PLAY + densify-COMPILE color cases un-reported | `bench/color-interp.bench.ts` ENOENT → same coverage red |
| S3 sync-step wired | coverage: the 4 sync-step cases reported-but-un-classified | add `sync-step` to `suites` (today absent) → 4 reported, 0 classified → `:234-240` reds |
| S4 postTask (**KEYSTONE**) | the INP delta of `postTask("background")` vs bare `void loadAnimationEngine()`, **measured in a real browser** | `scripts/scheduler-posttask-decision.json` ENOENT + the jsdom-SKIP no longer counts GREEN → the real measurement has never run → RED (the L.W1 S4 proxy failure cured) |
| S5 budgeted-floor | a budgeted ARM's ratio INVERSION (SoA slower than per-channel) reds HARD | plant the `numeric.ts` per-channel revert → SoA ratio < 1.0 → today NOTES-and-passes (blanket observe-only); after S5 the HARD ratio arm REDS |
| S8 DOM-write zero-alloc | a fresh `Record<string,string>` ALLOCATED during the DOM-write phase of a 60-frame steady window (heap-delta probe) | `transformTargetsStyle` allocs a `Record` per frame today → the extended `proof:standalone-zero-alloc` heap probe reds; after S8 (the `out` buffer) → zero per-frame alloc |
| S9 reconcile O(1) | the compile-time hz COLLAPSE at N=1000 stops (ratio vs N=10 baseline) — the O(N²) signature | the `findIndex` inner scan today produces a quadratic ratio inversion at N=1000; after the `Map` lookup → linear, ratio holds |
| S7 cross-repo | a VJ.L# dropped from `KF-TO-VALUEJS-P-ASKS.md` or `crossRepo[]` → frontier untracked | (regression-guard — GREEN today; reds the moment a VJ.L# is silently dropped) |

**The portability spine (the owner mandate — PORTABLE perf gate, ratio-normalized).** Every HARD
predicate in O.W8 is a **same-report device-INDEPENDENT ratio** (`baseHz × frac`, numerator and
denominator measured on the same runner in the same pass — device-independent BY CONSTRUCTION, the
E24-confirmed gold standard). The absolute wall-clock magnitude (`floorHz`) survives ONLY as an
`observe-only` note, NEVER as a HARD CI predicate — so a gate that passes on macOS cannot flake RED
on the slow Linux runner for a device reason (the device-dependence-greening lesson). S5 is the
universal application: the warmEngine absolute `floorHz:1000` is re-derived to a ratio; the SoA /
spring-vector ratio misses route through `declarePosture("hard")`; only magnitude stays observe-only.
S1/S2/S8/S9 baselines are recorded `observe-only` (no floor until a measurement run records the
baseline — the MEASURE-FIRST discipline).

**How each is born-RED (plant-a-failure).** S1/S2/S3 red because the bench files/wiring are absent —
the coverage clause runs `vitest bench` and finds a manifest case with no report row (cannot be
gamed by a stub). S4 reds because the decision JSON is absent and the jsdom-SKIP no longer counts
GREEN — the real measurement has never run. S5 reds on a planted `numeric.ts` per-channel revert
(SoA ratio < 1.0) that today NOTES-and-passes. S8 reds because `transformTargetsStyle` allocs a
`Record` per frame today (the heap-delta probe observes a non-zero per-frame alloc). S9 reds on the
N=1000-stop bench case (the quadratic ratio inversion). Each born-RED witness is the REAL runtime
observable measured live — never a source grep.

**Green condition.** The two new bench suites exist + report finite hz (S1/S2); sync-step classified
(S3); `proof:scheduler-posttask` records ADOPT (no INP regression) OR KILL (the postTask stays
un-shipped, recorded) in the decision JSON (S4); the budgeted ratio arms HARD, the warmEngine arm
ratio-based (S5); the L.W7.md mis-attribution corrected (S6); the VJ.L# + `VJ.O.DIRECT-OKLCH-OKLAB`
dispatch INTACT to value.js P (S7); `transformTargetsStyle` zero-alloc on the DOM-write path (S8);
`reconcileVars` O(1) at N=1000 (S9). All extended gates GREEN; no absolute `floorHz` survives as a
HARD predicate.

---

## Dependencies

- **value.js 1.0.2 (already pinned) — NO sibling publish to land.** S1/S2/S3/S5/S6/S8/S9 are all
  kf-side measurement instruments / zero-alloc cures over the installed surface. S2's densify arm
  and S7's dispatch confirmation need no publish; the densify-arm GRADUATION (cross-repo → budgeted)
  is the **value.js-P** color-math consume (re-pointed from value.js O — E24), tracked but NOT this
  wave's DONE.
- **Playwright-core / O.W2 shared browser — S4's real-browser INP arm.** `bench/playwright.bench.ts`
  + `proof:computed-real-dom` are the browser-gated precedent; O.W2's warm chromium is the eventual
  home (composes, not required — on the serial tree it is a standalone Playwright-core driver).
- **O.W1 (report-all / lint tier) — composes, NOT required.** Once O.W1's tooling lands, the extended
  `proof:bench-taxonomy` + re-targeted `proof:scheduler-posttask` are surfaced in one parallel pass.
- **O.W7 (engine-seam) — Band-D sibling, NO file collision.** O.W7 lifts `engine.ts`/`group.ts`;
  O.W8 touches `bench/*` + `scripts/proof-bench-taxonomy.mjs` + `scripts/proof-scheduler-posttask.mjs`
  + `bench/taxonomy.json` + `L.W7.md`/`PROGRESS.md`, plus the two scoped engine micro-edits (S8
  `transformTargetsStyle` `out` buffer, S9 `reconcileVars` Map). The S8/S9 edits are in `engine.ts`/
  `frame-compiler.ts` regions disjoint from O.W7's class-body lift — sequence O.W8's S8/S9 before
  O.W7 (O.W8 is NOW, O.W7 is GATED) so the playback hot path is already zero-alloc when O.W7 moves
  it; O.W7 S3's `proof:standalone-zero-alloc` GREEN then includes the S8 DOM-write arm.
- **O.W16 (value.js-P consume) — S2/S7 graduation only.** The densify-arm graduation to `budgeted`
  fires on O.W16's value.js-P re-pin (the color-math zero-alloc rewrites); the dispatch confirmation
  (S7) is independent.

---

## dev→impl boundary

This file is the Tranche O DEVELOPMENT spec for O.W8 — DOCS ONLY (inv-16: kf writes only
keyframes.js; the VJ color-math co-bench need is a DISPATCH at S7 / O.W10, never a value.js-tree
edit). The IMPLEMENTATION (the two bench suites, the gate extensions, the real-browser INP arm, the
budgeted-floor HARD ratio, the two zero-alloc engine micro-edits, the doc correction) opens ONLY on
the owner's explicit authorization. Phase NOW: zero sibling publish gates the landing — every arm is
a kf-side instrument, cure, or doc edit. Gate-first, born-RED, observable-truth, PORTABLE
(ratio-normalized), gestalt, KISS throughout. The born-RED witnesses (the bench-coverage reds, the
postTask decision-JSON absence, the DOM-write heap-delta, the N=1000 quadratic) stand on today's
tree; the cure opens on authorization.
