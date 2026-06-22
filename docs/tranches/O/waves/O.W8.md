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
- **~~Two new perf gaps the O re-audit surfaced (E21)~~ — BOTH FALSIFIED BY BENCH, RETIRED
  (full-loop, ledger line 577).** The O re-audit proposed (a) a `transformTargetsStyle` `out`-buffer
  cure and (b) a `reconcileVars` O(1) Map cure as O.W8 S8/S9. The full loop BENCHED both: (a)
  out-buffer is **0.83-0.84× — SLOWER** (the value.js delete-clear-loop costs more than the GC-cheap
  young-gen Record), and (b) `reconcileVars` is **already LINEAR** (no quadratic at N=10..1000). Both
  are KILLED with tombstones in `scripts/transform-out-buffer-decision.json`. O.W8 therefore carries
  **NO engine arms** — it is a pure-instrument wave (the five M.W12 measurement gaps + the doc
  correction + the dispatch). See the S8/S9 entries in Scope and the Full-loop disposition.
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
FALSIFIABLE and TRACKED. (The re-audit's two proposed zero-alloc cures S8/S9 were BENCHED and
KILLED — S8 out-buffer is 16-20% slower, S9's quadratic does not exist; full-loop, ledger line 577 —
leaving the "ZERO engine code" claim literally true.)

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

The two NEW O-surfaced gaps (E21 BLOCKER-adjacent HIGH) — **BOTH RETIRED by full-loop bench (ledger
line 577); the premises were proposed, not proven**:
6. ~~**`transformTargetsStyle` per-frame `Record` alloc**~~ — the `out`-buffer cure was BENCHED at
   **0.83-0.84× (SLOWER)**; the GC-cheap young-gen Record costs less than value.js's
   delete-clear-loop. KILLED → `scripts/transform-out-buffer-decision.json`.
7. ~~**Residual O(N) `reconcileVars` findIndex**~~ — BENCHED LINEAR at N=10..1000 (flat/decreasing
   per-stop ratios); the claimed O(N²) does not exist. KILLED; the N=1000 bench case SALVAGED as an
   observe-only linear-regression guard.

### Audit evidence

| Ref | Source (file:line) | Gap |
|-----|--------------------|-----|
| lane-29 Gap 2 / E21 | `numeric.ts:145-208` (SoA shipped); `bench/numeric-soa.bench.ts` ENOENT; `test/zero-alloc.test.ts:181-182` (sentinel only) | `NumericAnimation.at()` throughput un-benched kf-side |
| lane-29 Gap 3 / lane-30 §2.2-2.3 / E21 | `bench/interpolation.bench.ts` (opacity+transforms only); no color suite | color-interp PLAY + densify COMPILE legs un-benched; value.js P color-math un-validatable |
| lane-29 Gap 1 / E21 / E24 | `bench/taxonomy.json:suites` (5, sync-step absent); `proof-bench-runs.mjs:51` (runs it); `proof-bench-taxonomy.mjs:207-242` | `sync-step.bench.ts` 4 cases un-classified, un-budgeted |
| lane-29 Gap 5 / lane-30 §3.4 | `scripts/proof-scheduler-posttask.mjs:31` (SKIPs in jsdom) | postTask INP benefit never measured — GREEN-by-SKIP, not by measurement |
| lane-29 §1e/§2 / E24 | `proof-bench-taxonomy.mjs:66-70` + `ci-env.mjs:63-65` (observe-only miss never reds); `taxonomy.json` warmEngine `floorHz:1000` (absolute) | budgeted floors un-enforced; no device-independent HARD floor |
| ~~**E21 rec 2 (NEW)**~~ KILLED | `transformTargetsStyle` → `unflattenObjectToString(vars)` w/o `out` buffer | premise grounded but cure BENCHED 0.83-0.84× SLOWER → KILLED (full-loop; `transform-out-buffer-decision.json`) |
| ~~**E21 rec 3 (NEW)**~~ KILLED | `frame-compiler.ts:418` `this.frames.findIndex` | claimed O(N²) FALSIFIED — BENCHED LINEAR at N=10..1000 → KILLED; N=1000 case salvaged as observe-only guard |
| lane-29 §5 / lane-30 §3.3 | `L.W7.md:24,450,451` vs `J.W6-impl.md:327` + `G/audit/a-valuejs-leverage.md:173` | "1.56×–4.25×" is value.js's G-era number, mis-cited as kf's J.W6 measurement |
| E24 | `bench/taxonomy.json:264-313` `crossRepo[]` (VJ.L1–L8) | color-math co-bench dispatch must stay intact; graduates on value.js-P publish |

---

## Scope (delta-only — full S-clauses in M.W12.md §S1–S7)

O.W8 implements M.W12 S1–S7 verbatim, with the cross-repo edge re-pointed value.js-O → value.js-P.
The two NEW zero-alloc arms (S8/S9) the O re-audit proposed were BENCHED by the full loop and KILLED
(S8 slower, S9 already linear; ledger line 577) — O.W8 is therefore a **pure-instrument wave** (S1-S7
only, no engine code). The full developed prose for S1–S7 is in M.W12.md — this wave carries the
authorization, the deltas, the S8/S9 KILL tombstones, and the born-RED gate.

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
- **~~S8 (NEW) — `transformTargetsStyle` per-frame DOM-write zero-alloc~~ — KILLED (full-loop,
  ledger line 577).** The premise (`unflattenObjectToString` accepts an `out` param, value.js 1.0.2
  verified) is grounded, but **the cure is FALSIFIED BY MEASUREMENT** — the Typed-OM lesson repeated.
  RAN (`npx tsx bench/_tmp_s8_*.mts` over 300k frames, 3 trials): current 117.6/114.5/115.2ms vs
  out-buffer 141.4/135.9/137.8ms = **0.83/0.84/0.84× (16-20% SLOWER)**; retained-heap probe
  (`--expose-gc`, 200k frames): current 0.06MB vs out-buffer 0.00MB — a 0.06MB young-gen Record the
  GC reclaims trivially, while the delete-clear-loop value.js runs to reuse the buffer costs MORE
  than the alloc it removes. **RETIRED.** Tombstone recorded in
  `scripts/transform-out-buffer-decision.json` (the `typed-om-decision.json` pattern). The genuine
  engine zero-alloc win lives on the PLAY hot path (`interpFrames`/`_interpOut` buffer reuse, already
  gated), NOT this DOM-write path.
- **~~S9 (NEW) — `reconcileVars` O(1) frame-dedup~~ — KILLED (full-loop, ledger line 577).** The
  quadratic premise — `frame-compiler.ts:418` `this.frames.findIndex` "re-introduces O(N²)" — is
  **FALSIFIED BY MEASUREMENT.** RAN (`npx tsx` compile bench N=[10,50,100,250,500,1000] × 2 shapes):
  per-stop ratios are flat/decreasing (no O(N²)); total compile time is LINEAR in N. `reconcileVars`
  is **already O(N)** — there is no quadratic to cure. **RETIRED.** Tombstone recorded in the same
  decision JSON. **SALVAGE:** keep the `bench/compile.bench.ts` N=1000-stop case as an
  **observe-only LINEAR-regression guard** — it does not gate a cure (none is owed) but proves the
  code stays O(N) and reds if a future edit reintroduces quadratic compile cost.

**Net (full-loop SIMPLIFY):** with S8/S9 retired, O.W8 ships **ZERO engine code** — it is a
pure-instrument wave (the five M.W12 measurement gaps + the doc correction + the dispatch), which is
the stronger, KISS form. The "ships ZERO engine code" claim in Context becomes literally true.

---

## Born-RED gate

**Gate:** `proof:bench-taxonomy` (EXTENDED — S1/S2/S3/S5/S7 arms + the salvaged S9 N=1000
observe-only linear-regression guard) + `proof:scheduler-posttask` (RE-TARGETED — S4 real-browser
arm). The wave's DONE is the EXTENDED gates biting RED on the REAL runtime observables on today's
tree, before any bench/decision artifact exists. *(`proof:standalone-zero-alloc` is NO LONGER
extended — the S8 DOM-write arm is KILLED, full-loop line 577; the existing PLAY-leg `_interpOut`
zero-alloc clause stands unchanged.)*

**The REAL runtime observable per arm (observable-truth — each bites the genuine breach, not a
source-grep proxy).**

| Arm | The REAL observable the gate bites | Born-RED witness on today's (2026-06-19) tree |
|-----|-------------------------------------|------------------------------------------------|
| S1 numeric-SoA | `proof:bench-taxonomy` coverage: a classified `numeric-soa` case absent from the bench REPORT (the gate runs `vitest bench` and asserts finite hz) | `bench/numeric-soa.bench.ts` ENOENT → manifest names cases the report cannot contain → coverage clause reds (`proof-bench-taxonomy.mjs:245-253`) |
| S2 color-interp | coverage: the PLAY + densify-COMPILE color cases un-reported | `bench/color-interp.bench.ts` ENOENT → same coverage red |
| S3 sync-step wired | coverage: the 4 sync-step cases reported-but-un-classified | add `sync-step` to `suites` (today absent) → 4 reported, 0 classified → `:234-240` reds |
| S4 postTask (**KEYSTONE**) | the INP delta of `postTask("background")` vs bare `void loadAnimationEngine()`, **measured in a real browser** | `scripts/scheduler-posttask-decision.json` ENOENT + the jsdom-SKIP no longer counts GREEN → the real measurement has never run → RED (the L.W1 S4 proxy failure cured) |
| S5 budgeted-floor | a budgeted ARM's ratio INVERSION (SoA slower than per-channel) reds HARD | plant the `numeric.ts` per-channel revert → SoA ratio < 1.0 → today NOTES-and-passes (blanket observe-only); after S5 the HARD ratio arm REDS |
| ~~S8 DOM-write zero-alloc~~ KILLED | — | the out-buffer cure BENCHED 0.83-0.84× SLOWER (full-loop line 577); no gate arm — `transform-out-buffer-decision.json` records the KILL |
| ~~S9 reconcile O(1)~~ KILLED → SALVAGED guard | the compile-time hz holds LINEAR at N=1000 (observe-only) | `reconcileVars` BENCHED already-LINEAR (no O(N²)); no cure owed — the N=1000 `compile.bench.ts` case stays as an observe-only linear-regression guard (reds only if a future edit reintroduces quadratic cost) |
| S7 cross-repo | a VJ.L# dropped from `KF-TO-VALUEJS-P-ASKS.md` or `crossRepo[]` → frontier untracked | (regression-guard — GREEN today; reds the moment a VJ.L# is silently dropped) |

**The portability spine (the owner mandate — PORTABLE perf gate, ratio-normalized).** Every HARD
predicate in O.W8 is a **same-report device-INDEPENDENT ratio** (`baseHz × frac`, numerator and
denominator measured on the same runner in the same pass — device-independent BY CONSTRUCTION, the
E24-confirmed gold standard). The absolute wall-clock magnitude (`floorHz`) survives ONLY as an
`observe-only` note, NEVER as a HARD CI predicate — so a gate that passes on macOS cannot flake RED
on the slow Linux runner for a device reason (the device-dependence-greening lesson). S5 is the
universal application: the warmEngine absolute `floorHz:1000` is re-derived to a ratio; the SoA /
spring-vector ratio misses route through `declarePosture("hard")`; only magnitude stays observe-only.
S1/S2 baselines (and the salvaged S9 N=1000 linear guard) are recorded `observe-only` (no floor until
a measurement run records the baseline — the MEASURE-FIRST discipline).

**How each is born-RED (plant-a-failure).** S1/S2/S3 red because the bench files/wiring are absent —
the coverage clause runs `vitest bench` and finds a manifest case with no report row (cannot be
gamed by a stub). S4 reds because the decision JSON is absent and the jsdom-SKIP no longer counts
GREEN — the real measurement has never run. S5 reds on a planted `numeric.ts` per-channel revert
(SoA ratio < 1.0) that today NOTES-and-passes. Each born-RED witness is the REAL runtime observable
measured live — never a source grep. *(The S8/S9 arms are KILLED by full-loop bench — S8 out-buffer
slower, S9 already linear; line 577 — so neither carries a born-RED arm. The salvaged S9 N=1000 case
is observe-only, not a born-RED gate.)*

**Green condition.** The two new bench suites exist + report finite hz (S1/S2); sync-step classified
(S3); `proof:scheduler-posttask` records ADOPT (no INP regression) OR KILL (the postTask stays
un-shipped, recorded) in the decision JSON (S4); the budgeted ratio arms HARD, the warmEngine arm
ratio-based (S5); the L.W7.md mis-attribution corrected (S6); the VJ.L# + `VJ.O.DIRECT-OKLCH-OKLAB`
dispatch INTACT to value.js P (S7); the S8/S9 KILLs recorded in
`scripts/transform-out-buffer-decision.json` with the salvaged N=1000 linear guard in place. All
extended gates GREEN; no absolute `floorHz` survives as a HARD predicate. **No engine source is
touched** (S8/S9 retired) — O.W8 is a pure-instrument wave.

---

## Dependencies

- **value.js 1.0.2 (already pinned) — NO sibling publish to land.** S1/S2/S3/S5/S6 are all
  kf-side measurement instruments / doc edits over the installed surface (S8/S9 KILLED — no engine
  cure remains). S2's densify arm
  and S7's dispatch confirmation need no publish; the densify-arm GRADUATION (cross-repo → budgeted)
  is the **value.js-P** color-math consume (re-pointed from value.js O — E24), tracked but NOT this
  wave's DONE.
- **Playwright-core / O.W2 shared browser — S4's real-browser INP arm.** `bench/playwright.bench.ts`
  + `proof:computed-real-dom` are the browser-gated precedent; O.W2's warm chromium is the eventual
  home (composes, not required — on the serial tree it is a standalone Playwright-core driver).
- **O.W1 (report-all / lint tier) — composes, NOT required.** Once O.W1's tooling lands, the extended
  `proof:bench-taxonomy` + re-targeted `proof:scheduler-posttask` are surfaced in one parallel pass.
- **O.W7 (engine-seam) — Band-D sibling, NO file collision.** O.W7 lifts `engine.ts`/`group.ts`;
  O.W8 touches ONLY `bench/*` + `scripts/proof-bench-taxonomy.mjs` +
  `scripts/proof-scheduler-posttask.mjs` + `bench/taxonomy.json` +
  `scripts/transform-out-buffer-decision.json` (the S8/S9 KILL tombstone) + `L.W7.md`/`PROGRESS.md`.
  With S8/S9 KILLED (full-loop bench), O.W8 makes **NO `engine.ts`/`frame-compiler.ts` edit** — the
  prior S8/S9 sequencing concern is moot; the two waves are now fully file-disjoint with no ordering
  coupling. O.W7's existing `proof:standalone-zero-alloc` PLAY-leg clause is untouched.
- **O.W16 (value.js-P consume) — S2/S7 graduation only.** The densify-arm graduation to `budgeted`
  fires on O.W16's value.js-P re-pin (the color-math zero-alloc rewrites); the dispatch confirmation
  (S7) is independent.

---

## dev→impl boundary

This file is the Tranche O DEVELOPMENT spec for O.W8 — DOCS ONLY (inv-16: kf writes only
keyframes.js; the VJ color-math co-bench need is a DISPATCH at S7 / O.W10, never a value.js-tree
edit). The IMPLEMENTATION (the two bench suites, the gate extensions, the real-browser INP arm, the
budgeted-floor HARD ratio, the doc correction, and recording the S8/S9 KILL tombstones +
salvaged-N=1000 guard) opens ONLY on the owner's explicit authorization. Phase NOW: zero sibling
publish gates the landing — every arm is a kf-side instrument or doc edit (NO engine source: S8/S9
retired by full-loop bench, ledger line 577). Gate-first, born-RED, observable-truth, PORTABLE
(ratio-normalized), gestalt, KISS throughout. The born-RED witnesses (the bench-coverage reds, the
postTask decision-JSON absence) stand on today's tree; the cure opens on authorization.

---

**Full-loop disposition (`docs/tranches/P/FULL-LOOP-LEDGER.md` O.W7-9-engine / [SIMPLIFY] O.W8,
line 569-577):** SIMPLIFY. **KEEP S1-S7** — the falsifiability / measurement apparatus; all five
born-RED witnesses verified real (RAN: `bench/numeric-soa.bench.ts` ENOENT,
`bench/color-interp.bench.ts` ENOENT, `taxonomy.json` suites lack sync-step, `proof:scheduler-posttask`
SKIPs in jsdom, the budgeted floors route through observe-only). S5 (device-INDEPENDENT HARD ratio
floors) and S4 (real-browser `postTask` INP) are the correct portability + observable-truth
disciplines and are KEPT. **KILL the two NEW O-surfaced engine cures S8 and S9** — both FALSIFIED by
in-session bench:

- **S8 out-buffer:** 0.83/0.84/0.84× (16-20% SLOWER) over 300k frames × 3 trials; retained heap
  0.06MB/200k frames — the value.js delete-clear-loop costs more than the GC-cheap young-gen Record
  it removes. **RETIRED** → `scripts/transform-out-buffer-decision.json` (the `typed-om-decision.json`
  pattern).
- **S9 reconcileVars:** already LINEAR (flat per-stop cost at N=10..1000; total linear) — the claimed
  O(N²) does not exist. **RETIRED**; the `bench/compile.bench.ts` N=1000 case SALVAGED as an
  observe-only linear-regression guard (it proves the code is already O(N)).

This removes the wave's ONLY two engine-touching arms — leaving O.W8 a **pure-instrument wave (no
engine code)**, which is the stronger, KISS form and makes the "ships ZERO engine code" claim
literally true. The stale `bench/numeric-soa.bench.ts` / `bench/color-interp.bench.ts` references
elsewhere in the constellation (P.W1 S2) are corrected to "proposed but not shipped" — they do not
exist on today's tree; S1/S2 author them born-RED.
