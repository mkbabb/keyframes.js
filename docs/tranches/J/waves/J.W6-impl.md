# J.W6 — IMPL: the FULL TERMINATION LEDGER (P-invariant-28 — nothing rides a fifth tranche)

**Branch:** `j-impl-w6` (worktree `/Users/mkbabb/Programming/kf-j-w6`, base `26eeac1`). This file
is the wave note the J.W6 hard gate names (`J.md §J.W6 gate`): every rider's terminal disposition
+ its MEASUREMENT ARTIFACT pasted INLINE, verbatim (the `/tmp/w6-*.txt` artifacts of record are
checked in HERE, not left in volatile `/tmp`). **Host for all on-device measurements:** Apple M5
Max, darwin 25.4.0, node v26.0.0, vitest 4.1.8; deps value.js 0.11.2 / glass-ui 3.9.0 /
parse-that 0.9.0. Date: 2026-06-10.

**The ledger at a glance (every clause of the hard gate, dispositioned):**

| Clause | Rider | Ride | Exit | Artifact (inline below) |
|---|---|---|---|---|
| (a) | FB-2 async sync-step half | F→I (4) | **LAND** | §S1 — full bench/probe record + born-RED ×2 |
| (b) | SoA `lerpArray` | E→I (5) | **ADOPT** (IMPL = separate authorized motion per spec) | §S2 — full bench record + decision math |
| (c) | FB-5 intrinsic-size | E→I (5) | **KILL** | §S3 — live cross-engine Baseline table |
| (d) | FB-6 `Mod+K` palette | F→I (4) | **KILL** (the spec DEFAULT) | §S4 — owner decision + residue-sweep grep |
| (e) | PF-1 Three.js named imports | perf-frontier P1 | **KILL** (delta = 0; estimate falsified; refactor reverted) | §S5 — full before/after build records |
| (f) | PF-3 Monaco static-edge | perf-frontier P1 | **PASS** (verify-only; I-era win held) | §S6 — fresh-build edge-list probe |
| (g) | EF-3 `parseLinearStops` shim | C-4→G→I | **KEEP-with-probe** (HANDOFF unchanged) | §S7 — value.js E1 probe output |
| (h) | GH-6 / DEP-1 CNAME | G→I (OUT) | **STILL OPEN, recorded** (deploy-owned) | §S8 — owner-repo line + live dig/curl |
| §S9 | CE-1.0 Safari `linear()`-HW-accel | frontier fold | **GUARD landed** | §S9 — on-device WebKit trace + born-RED |

Zero rows exit tagged MEASURE-FIRST without a measurement. No fifth BOOK anywhere.

---

## S1 — FB-2: the async sync-step half — **LAND** (clause a, RUNTIME tier)

**Rider:** convert `Animation.advanceTo`/`AnimationGroup.advanceTo` from async to sync so a
sync-driving caller pays no per-frame promise+microtask hop. Born F (F.W5 held half, locked OUT
behind an event-ordering parity requirement); rode F→G→H→I (4 tranches) as `MEASURE-FIRST —
build proof:event-ordering first` (`deferred-ledger.md:101,174`).

**Disposition: LAND — both threshold legs hold** (`J.W6.md §S1`: ≥20% microtask-turn reduction
on the K=8/32-cell steady window AND `proof:event-ordering` GREEN on the converted path).
Headline numbers: microtask turns/frame **1.998 → 0** (Animation·K=8) and **4.993 → 0**
(Group·32cells) = **−100% on both corpus shapes**; promise inits/frame 10.01 → 0.012 and
84.1 → 0.008; single-shot wall 51.73 → 39.88 µs/frame (−22.9%) and 208.04 → 190.83 (−8.3%).
The ordering lock was born-RED-witnessed twice BEFORE the conversion was trusted.

**What landed:** `engine.ts` — `advanceTo(t): number | Promise<number>` (plain number every
post-start frame; thenable only when `onStart` returned the genuine delay sleep), private
`_advance(t)`, sync `onEnd()`, `_frame(t): boolean | Promise<boolean>`,
`_snapToReducedMotion(): void`. `group.ts` — `advanceTo(t): this | Promise<this>` (`this`
directly when every child stepped sync; thenable only on a genuinely-async child or the
over-batch `_advanceBatched` yield path — `yieldToMain` preserved); `_advanceSlice` returns
`undefined` iff all-sync; `_endAdvance` preserves advance→done→onEnd ordering. New standing
locks: `test/event-ordering.test.ts` (5 clauses, wired `proof:event-ordering`) +
`test/sync-step.test.ts` clause 3 (Animation + AnimationGroup pump 20/20 frames with ZERO
awaited microtasks). `test/sequence-transport.test.ts`'s one `.then()` caller converted to the
path-agnostic `await`. Docs trued: `playback.ts` loop-core comment, `src/animation/CLAUDE.md`.
Dispatch order byte-identical: `animationstart` after the delay sleep; paintRest before
`animationend`.

**The measurement artifact of record (verbatim, `/tmp/w6-fb2.txt`):**

```
================================================================================
J.W6 S1 — FB-2 (the async sync-step half) — MEASUREMENT ARTIFACT OF RECORD
Worktree: /Users/mkbabb/Programming/kf-j-w6 (branch j-impl-w6), 2026-06-10
Spec: docs/tranches/J/waves/J.W6.md §S1 · Hard gate clause (a)
Host: darwin 25.4.0 (on-device IMPL host; benches hard-gate the decision here,
observe-only in CI per the P6 posture). Node per repo toolchain; vitest 4.1.8.
================================================================================

DISPOSITION: ██ LAND ██  (both threshold legs hold — detail in §4)

--------------------------------------------------------------------------------
§1 — proof:event-ordering AUTHORED (the correctness oracle)
--------------------------------------------------------------------------------
File: test/event-ordering.test.ts (5 clauses; path-agnostic across the async
and sync `advanceTo` shapes — every advance awaited; await of a non-thenable
is the identity). Script wired: package.json "proof:event-ordering":
"vitest run test/event-ordering.test.ts".

RUN on the UNCONVERTED (async) tree — GREEN:

> @mkbabb/keyframes.js@4.1.0 proof:event-ordering
> vitest run test/event-ordering.test.ts
 RUN  v4.1.8 /Users/mkbabb/Programming/kf-j-w6
 Test Files  1 passed (1)
      Tests  5 passed (5)
   Start at  13:44:21
   Duration  771ms

--------------------------------------------------------------------------------
§2 — BORN-RED WITNESSES (the lock bites BEFORE the conversion is trusted)
--------------------------------------------------------------------------------
WITNESS 1 — deliberate dispatch-before-paint reorder in `Animation.onEnd`
(animationend dispatched BEFORE paintRest) → clause 3 REDS (verbatim):

     × clause 3 — the rest frame is painted BEFORE animationend dispatches 3ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
 FAIL  test/event-ordering.test.ts > proof:event-ordering — the Animation lifecycle dispatch order > clause 3 — the rest frame is painted BEFORE animationend dispatches
AssertionError: expected NaN to be 1 // Object.is equality
      Tests  1 failed | 4 passed (5)

WITNESS 2 — deliberate boundary-event swap in `onEnd` (the iteration-window
dispatch emitted as `animationend`) → clause 2 REDS (verbatim):

     × clause 2 — start first; iteration between; end exactly once, last 4ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
 FAIL  test/event-ordering.test.ts > proof:event-ordering — the Animation lifecycle dispatch order > clause 2 — start first; iteration between; end exactly once, last
AssertionError: expected [ 'end', 'end', 'end' ] to have a length of 1 but got 3
      Tests  1 failed | 4 passed (5)

Both mutations REVERTED (git checkout); gate GREEN again on the pristine
async tree (Tests 5 passed (5), 13:45:20) before any measurement.

--------------------------------------------------------------------------------
§3 — THE MEASUREMENT (both arms; 600-frame steady window; rAF stubbed sync)
--------------------------------------------------------------------------------
Corpus per spec: a single K=8 transform Animation (translate3d(3)+scale3d(3)+
rotate(1)+opacity(1), the demo cube shape) + a 32-cell AnimationGroup (the
YIELD_BATCH=32 fast-path boundary), duration 60 s (no onEnd in-window), driven
through the REAL play loop (RAFPlayback.loop → _frame → advanceTo).

Instruments:
  - test/sync-step.measure.test.ts — microtask TURNS/frame (drains needed
    before the in-flight frame's reschedule lands), PROMISE inits/frame
    (node:async_hooks, separate pass), wall/frame (hooks disabled, gc()'d
    between passes; run under NODE_OPTIONS=--expose-gc).
  - bench/sync-step.bench.ts (extended) — calibrated wall-time over the same
    window (vitest bench, includes per-iteration corpus construction equally
    in both arms).

ARM (a) — the CURRENT async `advanceTo` (engine.ts:840 / group.ts:469), verbatim:

[FB-2 measure] {"rider":"FB-2","probe":"sync-step.measure","arm":"async-advanceTo","corpus":"Animation·K=8","frames":600,"microtaskTurns":1199,"turnsPerFrame":1.998,"promiseInits":6006,"promiseInitsPerFrame":10.01,"wallMs":31.04,"usPerFrame":51.73}
[FB-2 measure] {"rider":"FB-2","probe":"sync-step.measure","arm":"async-advanceTo","corpus":"AnimationGroup·32cells·K=8","frames":600,"microtaskTurns":2996,"turnsPerFrame":4.993,"promiseInits":50460,"promiseInitsPerFrame":84.1,"wallMs":124.82,"usPerFrame":208.04}

bench (arm a), verbatim rows:
   · play(Animation · K=8 transform) · 600-frame window        250.45  3.6704  5.6554  3.9929  4.0874  5.4527  5.6554  5.6554  ±1.21%      126
   · play(AnimationGroup · 32 cells · K=8) · 600-frame window  9.5815  101.41  108.45  104.37  106.03  108.45  108.45  108.45  ±1.59%       10

ARM (b) — the SYNC-converted `advanceTo` (the land candidate applied), verbatim:

[FB-2 measure] {"rider":"FB-2","probe":"sync-step.measure","arm":"sync-advanceTo","corpus":"Animation·K=8","frames":600,"microtaskTurns":0,"turnsPerFrame":0,"promiseInits":7,"promiseInitsPerFrame":0.012,"wallMs":23.93,"usPerFrame":39.88}
[FB-2 measure] {"rider":"FB-2","probe":"sync-step.measure","arm":"sync-advanceTo","corpus":"AnimationGroup·32cells·K=8","frames":600,"microtaskTurns":0,"turnsPerFrame":0,"promiseInits":5,"promiseInitsPerFrame":0.008,"wallMs":114.5,"usPerFrame":190.83}

bench (arm b), verbatim rows:
   · play(Animation · K=8 transform) · 600-frame window        287.48  3.2691  5.3218  3.4785  3.5238  5.0365  5.3218  5.3218  ±1.14%      144
   · play(AnimationGroup · 32 cells · K=8) · 600-frame window  9.4576  101.80  111.73  105.74  106.85  111.73  111.73  111.73  ±2.40%       10

--------------------------------------------------------------------------------
§4 — DELTAS vs THE THRESHOLD (J.W6.md §S1: LAND iff (a) ≥20% microtask-turn
reduction OR non-noise wall reduction on the K=8/32-cell steady window, AND
(b) proof:event-ordering stays GREEN)
--------------------------------------------------------------------------------
microtask turns/frame   Animation·K=8: 1.998 → 0      = −100%  (≥20% ✓)
                        Group·32cells: 4.993 → 0      = −100%  (≥20% ✓)
promise inits/frame     Animation·K=8: 10.01 → 0.012  = −99.9%
                        Group·32cells: 84.1  → 0.008  = −100%
wall (bench mean/window) Animation·K=8: 3.9929 → 3.4785 ms = −12.9% (rme ±1.2%,
                        non-noise; corroborator) · Group·32: 104.37 → 105.74 ms
                        = +1.3% (within ±2.4% rme — noise; the group window is
                        dominated by 32×K=8 interpFrames paint work, exactly
                        the "not masked by a single-frame alloc" shape)
wall (probe single-shot) Animation: 51.73 → 39.88 µs/frame (−22.9%) ·
                        Group: 208.04 → 190.83 µs/frame (−8.3%)
proof:event-ordering    GREEN on arm (a) AND arm (b); born-RED witnesses §2.

THRESHOLD LEG (a): met — 100% microtask-turn reduction on BOTH corpus shapes.
THRESHOLD LEG (b): met — ordering lock GREEN on the converted path.
⇒ LAND. The F→G→H→I (4-tranche) ride ends with this artifact. No fifth BOOK.

--------------------------------------------------------------------------------
§5 — THE LANDED IMPLEMENTATION (the gestalt seam — uncommitted per task)
--------------------------------------------------------------------------------
The conversion speaks the SAME sync-when-sync/thenable-when-async shape
`RAFPlayback._run` already speaks (F.W5 S1's feature-detect):

src/animation/engine.ts
  - onStart(): Promise<void> | undefined — sync; a thenable ONLY when
    delay > 0 (the genuinely-async sleep, semantics byte-preserved:
    paused-during-sleep, started-after).
  - onEnd(): sync (body had no awaits).
  - advanceTo(t): number | Promise<number> — plain number every post-start
    frame; first tick returns a thenable only when onStart returned the
    delay sleep. Private _advance(t) holds the post-start body (pause clock,
    local time, iteration end) — dispatch order byte-identical.
  - _frame(t): boolean | Promise<boolean> — sync steady path via
    _renderFrame(t); _snapToReducedMotion(): void (was async, no awaits).
src/animation/group.ts
  - advanceTo(t): this | Promise<this> — `this` directly when every child
    stepped sync (the ≤YIELD_BATCH single-slice steady state); thenable only
    on a genuinely-async child or the over-batch _advanceBatched yield path
    (yieldToMain preserved). _advanceSlice returns undefined iff all-sync
    (no promises array, no Promise.all on the steady path); _endAdvance
    preserves the advance→done→onEnd ordering.
  - _frame(t): boolean | Promise<boolean> via _renderFrame(t); _boundFrame
    type widened to (t) => boolean | Promise<boolean>.
test/sequence-transport.test.ts — one caller used `.then()` on advanceTo;
  converted to the path-agnostic `await` form.
test/sync-step.test.ts — clause 3 ADDED (the landed half's standing lock):
  Animation + AnimationGroup play loops pump 20/20 frames with ZERO awaited
  microtasks (reverting to async ⇒ 1 frame, exactly the arm-(a) shape).
  Clause-2 header updated: the held half LANDED at J.W6 S1 behind the lock.
Docs trued: playback.ts loop-core comment + class doc; src/animation/CLAUDE.md
  RAFPlayback section. AnimationEvent ordering: animationstart still fires
  after the delay sleep; paintRest still precedes animationend (clause 3).

--------------------------------------------------------------------------------
§6 — POST-LAND GATES (all on the converted tree)
--------------------------------------------------------------------------------
proof:event-ordering   Tests 5 passed (5)            GREEN
proof:sync-step        Tests 5 passed (5) (incl. new clause 3)  GREEN
full suite             vitest run: Test Files 72 passed (72);
                       Tests 695 passed | 2 expected fail (697)  GREEN
                       (the 2 expected-fail are pre-existing `.fails` tests,
                       unchanged from the pre-conversion baseline of
                       693 passed | 2 expected fail + the 2 added clause-3)
typecheck              npm run check (tsc --noEmit) + check:lib  CLEAN
line ceilings          proof:decomposition PASS (engine.ts ≤1400, group.ts
                       819 ≤ 820); proof:engine PASS
build                  npm run build:lib ✓ built in 1.36s
                       (dist/engine-DX8A5w2A.js 37.06 kB │ gzip 10.35 kB)

P6 tier annotation: proof:event-ordering + sync-step clause 3 are
device-independent correctness locks (hard-gate in CI); the measure probe
prints numbers and asserts arm-neutral invariants only (observe-only in CI);
the LAND decision was taken on-device from the §3/§4 numbers.
================================================================================
```

---

## S2 — SoA `lerpArray`: bench on the real-K corpus — **ADOPT** (clause b, bench oracle)

**Rider:** consume value.js `lerpArray` over a packed `Float64Array` SoA buffer in place of
per-channel `_lerp` closure dispatch. Born E (G-2/VJ-D2); rode E→F→G→H→I (5 tranches) as
`MEASURE-FIRST / STILL BOOK` (`deferred-ledger.md:102,175`, `perf-frontier.md §PF-8`).

**Disposition: ADOPT — the threshold (≥20% wall-time reduction at K=8, `perf-frontier.md:236`)
is cleared 4.7× over.** K=8 full-pipeline 0.0928 → 0.0056 ms = **16.6× = 94.0% reduction**;
K=10 corroborator 20.3× = 95.0%; dispatch-only K=8 14.6× = 93.1% (the closure dispatch IS the
cost — corroborates the G-2 "2.5–4×" claim, larger on this host). Even the MOST conservative
accounting (replace only the per-channel loop inside an otherwise unchanged pipeline:
0.0928 − 0.0452 + 0.0031 = 0.0507 ms) is a 45.4% reduction — clears 20% more than 2× over.

**Per `J.W6.md §S2` (spec-verbatim): the FrameCompiler-side SoA transposition is ELECTED but
the HIGH-risk IMPL lands in J.W1 or a dedicated authorized motion — J.W6's deliverable is this
artifact + the ADOPT decision, not the refactor.** `grep -r lerpArray src/` = 0 is therefore BY
DESIGN, not a missing LAND. The in-lane guard edges that DID land this wave:

1. `bench/interp-buffer.bench.ts` — the 6-case J.W6 S2 SoA arm (K=8/K=10 full-pipeline pairs +
   K=8 dispatch-only pair); enumerated by `proof:bench-runs`, re-run PASS.
2. `test/lerparray-adopt.test.ts` — the 3-clause ADOPT guard: (a) API lock — the pinned
   value.js exports `lerpArray` (reds on a re-pin that drops it); (b) semantics lock —
   out-writing, out-returning, `(1−t)·from + t·to`, endpoint-exact; (c) equivalence witness —
   one `lerpArray` call over packed segment buffers reproduces `interpFrames` per-channel values
   on the K=8 cube corpus at 9 sampled playheads (the correctness oracle the elected refactor
   lands behind). 3/3 GREEN.

**The measurement artifact of record (verbatim, `/tmp/w6-lerparray.txt` — contains the full
verbatim bench output; `/tmp/w6-lerparray-raw.txt` is the byte-duplicate raw bench block already
embedded below):**

```
J.W6 S2 — SoA lerpArray ADOPT-or-KILL measurement artifact (P-invariant-28)
============================================================================
Date: 2026-06-10 (IMPL, on-device per P6 — decision hard-gates on the IMPL host)
Host: Apple M5 Max, node v26.0.0, vitest 4.1.8
Tree: worktree /Users/mkbabb/Programming/kf-j-w6, branch j-impl-w6, base 26eeac1
Dep:  @mkbabb/value.js@0.11.2 (lerpArray published: typeof === "function")
Bench: bench/interp-buffer.bench.ts — "interpFrames — SoA lerpArray arm (J.W6 S2, real-K corpus)"
Corpus: K=8 = the demo cube shape translate3d(3)+scale3d(3)+rotateZ(1)+opacity(1),
        5 stops, 600-frame steady window, threaded long-lived buffer (the
        _frame/_interpOut hoisted shape) — dispatch is the measured quantity,
        not allocation. K=10 corroborator (bare rotate expands to rotateX/Y/Z).
Twin fairness: the SoA arm KEEPS the binary segment search + the
        timingFunction.fn easing call (work lerpArray cannot remove) and
        replaces ONLY the per-channel lerpValue loop + buffer merge with one
        lerpArray(from, to, eased, out) over packed Float64Array segments.

VERBATIM BENCH OUTPUT (npx vitest bench --run bench/interp-buffer.bench.ts):
----------------------------------------------------------------------------
Benchmarking is an experimental feature.
Breaking changes might not follow SemVer, please pin Vitest's version when using it.

 RUN  v4.1.8 /Users/mkbabb/Programming/kf-j-w6


 ✓ bench/interp-buffer.bench.ts > interpFrames — threaded out-buffer (realistic playback) 1821ms
     name                                                     hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · K=2 · 600-frame steady window (threaded buffer)   25,653.72  0.0310  0.2424  0.0390  0.0415  0.0845  0.1026  0.1812  ±0.52%    12828
   · K=5 · 600-frame steady window (threaded buffer)   13,387.42  0.0608  0.3217  0.0747  0.0797  0.1437  0.1595  0.2487  ±0.53%     6694
   · K=12 · 600-frame steady window (threaded buffer)   5,905.51  0.1386  0.4610  0.1693  0.1778  0.2865  0.3144  0.3836  ±0.59%     2953

 ✓ bench/interp-buffer.bench.ts > interpFrames — computed endpoint (C1 memo, G.W2) 607ms
     name                                                             hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · calc() leaf · 600-frame steady window (C1 endpoint memo)  20,187.43  0.0418  0.2855  0.0495  0.0534  0.1005  0.1193  0.2016  ±0.53%    10094

 ✓ bench/interp-buffer.bench.ts > interpFrames — SoA lerpArray arm (J.W6 S2, real-K corpus) 3703ms
     name                                                                                                hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · K=8 (translate3d+scale3d+rotateZ+opacity) · per-channel _lerp (current) · 600-frame window   10,772.56  0.0764  0.8086  0.0928  0.1016  0.1863  0.2217  0.2703  ±0.68%     5387
   · K=8 (translate3d+scale3d+rotateZ+opacity) · SoA Float64Array+lerpArray · 600-frame window   179,142.05  0.0046  0.1343  0.0056  0.0051  0.0171  0.0226  0.0399  ±0.34%    89572
   · K=10 (rotate expands ×3) · per-channel _lerp (current) · 600-frame window                     8,284.41  0.0955  0.5915  0.1207  0.1299  0.2195  0.2598  0.3343  ±0.62%     4143
   · K=10 (rotate expands ×3) · SoA Float64Array+lerpArray · 600-frame window                    167,885.38  0.0052  0.4478  0.0060  0.0055  0.0163  0.0217  0.0356  ±0.34%    83943
   · K=8 · dispatch-only · per-channel lerpValue ×8 (current)                                     22,120.00  0.0373  0.2663  0.0452  0.0462  0.1021  0.1508  0.2070  ±0.59%    11061
   · K=8 · dispatch-only · single lerpArray (SoA)                                                322,627.82  0.0025  0.5012  0.0031  0.0029  0.0107  0.0131  0.0255  ±0.36%   161314

 BENCH  Summary

  K=2 · 600-frame steady window (threaded buffer) - bench/interp-buffer.bench.ts > interpFrames — threaded out-buffer (realistic playback)
    1.92x faster than K=5 · 600-frame steady window (threaded buffer)
    4.34x faster than K=12 · 600-frame steady window (threaded buffer)

  calc() leaf · 600-frame steady window (C1 endpoint memo) - bench/interp-buffer.bench.ts > interpFrames — computed endpoint (C1 memo, G.W2)

  K=8 · dispatch-only · single lerpArray (SoA) - bench/interp-buffer.bench.ts > interpFrames — SoA lerpArray arm (J.W6 S2, real-K corpus)
    1.80x faster than K=8 (translate3d+scale3d+rotateZ+opacity) · SoA Float64Array+lerpArray · 600-frame window
    1.92x faster than K=10 (rotate expands ×3) · SoA Float64Array+lerpArray · 600-frame window
    14.59x faster than K=8 · dispatch-only · per-channel lerpValue ×8 (current)
    29.95x faster than K=8 (translate3d+scale3d+rotateZ+opacity) · per-channel _lerp (current) · 600-frame window
    38.94x faster than K=10 (rotate expands ×3) · per-channel _lerp (current) · 600-frame window

----------------------------------------------------------------------------

DECISION MATH (threshold: ADOPT iff >=20% wall-time reduction at K=8 on the
steady window — perf-frontier.md:236, J.W6.md §S2):

  FULL-PIPELINE (decision arm), mean per 600-frame window:
    K=8  current per-channel _lerp : 0.0928 ms  (10,772.56 hz)
    K=8  SoA Float64Array+lerpArray: 0.0056 ms  (179,142.05 hz)
    delta = 16.6x faster = 94.0% wall-time reduction   [threshold 20%: CLEARED 4.7x over]
    K=10 current per-channel _lerp : 0.1207 ms  (8,284.41 hz)
    K=10 SoA Float64Array+lerpArray: 0.0060 ms  (167,885.38 hz)
    delta = 20.3x faster = 95.0% wall-time reduction

  DISPATCH-ONLY (corroborator — where the delta comes from), K=8:
    per-channel lerpValue x8       : 0.0452 ms  (22,120.00 hz)
    single lerpArray               : 0.0031 ms  (322,627.82 hz)
    delta = 14.6x = 93.1% — the closure-dispatch overhead IS the cost
    (corroborates the G-2 "2.5-4x" claim; on this host it is larger).

  CONSERVATIVE BOUND (pre-empting "the twin omits engine fixed costs"):
    if the refactor replaced ONLY the per-channel loop inside the otherwise
    unchanged interpFrames pipeline:
      0.0928 - 0.0452 + 0.0031 = 0.0507 ms  =>  45.4% reduction at K=8
    — the MOST conservative accounting still clears the 20% threshold >2x.

DISPOSITION: **ADOPT** (E→I 5-tranche ride ends; deferred-ledger.md:102 /
perf-frontier.md §PF-8 resolve ADOPT-on-the-number, not KILL-reaffirm).

Per J.W6.md §S2 the FrameCompiler-side SoA transposition (emit Float64Array
buffers consumed by lerpArray in interpFrames) is ELECTED but the HIGH-risk
IMPL is a separate authorized motion (engine files are J.W1's lane; J.W6's
deliverable is this artifact + the ADOPT decision). The in-lane consume-edge
+ guards landed in THIS wave:
  1. bench/interp-buffer.bench.ts — the J.W6 S2 SoA arm (6 new cases:
     K=8/K=10 full-pipeline pairs + K=8 dispatch-only pair); guarded by
     proof:bench-runs (suite already enumerated; gate re-run PASS, 39 cases).
  2. test/lerparray-adopt.test.ts — the ADOPT guard (3 clauses): (a) API lock
     — pinned value.js exports lerpArray (reds on a re-pin that drops it);
     (b) semantics lock — out-writing, out-returning, (1-t)*from + t*to,
     endpoint-exact; (c) equivalence witness — one lerpArray call over packed
     segment buffers reproduces interpFrames per-channel values on the K=8
     cube corpus at 9 sampled playheads (the correctness oracle the elected
     refactor lands behind). All 3 PASS.
  grep -r lerpArray (bench/ + test/) is now non-zero; src/ remains 0 by
  design until the elected engine motion lands.

GATES RE-RUN AFTER LANDING: tsc --noEmit clean; vitest run 70 files /
686 passed + 2 expected-fail (unchanged); proof:bench-runs PASS.
```

---

## S3 — FB-5 intrinsic-size `0→auto` — **KILL** (clause c, HYGIENE/platform tier — Baseline fact-check artifact)

**Rider:** `interpolate-size: allow-keywords` + `calc-size()` guarded enhancement (animating
`height: 0 → auto`). Born E/F; rode E→F→G→H→I (5 tranches) as `BOOK (guarded-enh) — VERIFY
Baseline first` (`deferred-ledger.md:104,177`). TREE today (re-verified this wave):
`grep -r "interpolate-size\|calc-size" src/` = **0** — kf has no consumer, no path.

**The probe — the LIVE cross-engine Baseline check, run 2026-06-10 (not a remembered date):**

| Source (live, 2026-06-10) | `interpolate-size` | `calc-size()` |
|---|---|---|
| webstatus.dev (web-features Baseline data), `api.webstatus.dev/v1/features/…` | **Baseline: Limited** | **Baseline: Limited** |
| Chrome / Chrome Android | Available — **129** (2024-09-17) | Available — **129** (2024-09-17) |
| Edge | Available — **129** (2024-09-19) | Available — **129** (2024-09-19) |
| Firefox | **Not available** (Mozilla position: positive; not shipped) | **Not available** |
| Safari | **Not available** (Apple position: under review; not shipped) | **Not available** |
| MDN (`developer.mozilla.org …/interpolate-size`) | **"Limited Availability — this feature is not Baseline because it does not work in some of the most widely-used browsers"**; marked Experimental | (same family banner) |

Registry snapshot at probe time: `caniuse-lite 1.0.30001797`, `web-features 3.30.0`
(`npm view`, 2026-06-10). Two independent live sources agree; WPT signal per webstatus.dev:
full pass on Chromium engines, no Firefox/Safari implementation.

**Threshold applied (`J.W6.md §S3`):** cross-engine Baseline (Newly/Widely) across Chromium +
Firefox + WebKit as of the IMPL date? **NO — Chromium-only**, ~21 months after the Chrome 129
ship, with neither Gecko nor WebKit shipped and no Baseline date scheduled.

**Disposition — KILL (the spec's Chromium-only ⇒ KILL leg), reasoned from the probe:** no
cross-engine platform support exists as of 2026-06-10; a Chromium-only animation path is not a
kf commitment (the rider's own bar). No dated BOOK is available because no Baseline date exists
or is scheduled — the row exits terminally, not riding. Zero kf code touched (there was never a
path: grep = 0). If the platform ever reaches cross-engine Baseline, a NEW row may be born with
that date as its birth artifact; this row is dead.

---

## S4 — FB-6 `Mod+K` command palette — **KILL** (the spec DEFAULT; clause d — owner decision + residue swept)

**Rider:** a command-palette / `Mod+K` quick-switcher for the demo. Born F (F.W13 BOOK, LOW,
"decide owner"); rode F→G→H→I (4 tranches) as `BOOK (demo, LOW) — decide owner or KILL`
(`deferred-ledger.md:105,176`).

**The owner decision (the artifact — a scope/owner decision, not a perf measure):**

1. **The component was already deleted once.** `CommandPalette.vue` was DELETED at E.W11
   (`recap-EF.md:126`); TREE today has **zero** `CommandPalette`/`cmdk` in source (grep over
   `demo/ src/ test/`, excl. `dist/` — re-verified this wave = 0).
2. **The design directive does not elect it.** `J.W7a` (the APPEARANCE-GRAMMAR half — the lane
   that would own a command-palette demo affordance) does NOT name a command palette anywhere
   in its protagonist/display/colour/math/grammar folds (re-verified: every "palette" hit in
   `J.W7a.md` is the COLOUR palette / `--ball-tone` seam, none is the command palette).
3. **No owner has elected BUILD.** No user/owner election exists across 4 tranches of riding,
   and none was issued for this wave. Per the spec's resolved design decision (`J.W6.md §Design
   decisions — FB-6 DEFAULT-KILL`): BUILD fires ONLY on an explicit owner election (and then as
   a glass-ui consume per inv-16, never hand-rolled) — absent that, the DEFAULT is KILL.

**Disposition — KILL-reaffirm, with reason:** deleted at E.W11, not in the J.W7a
appearance-grammar suffusion, no owner pull across 4 tranches. The F→I ride ends terminally.
Any future palette is a NEW owner-elected row (glass-ui `CommandPalette`/`cmdk` HANDOFF per
inv-16, born-RED interaction gate: opens on `Mod+K`, navigates a scene, closes on Escape) — not
a revival of this one.

**Residue sweep (the no-legacy corroborator, executed in the same motion):**
`demo/@/styles/style.css:29` z-index ladder comment `popovers (share, command palette)` →
`popovers (share)` — the share popover is the real surviving `--z-popover` consumer; the killed
feature's mention is gone. Post-sweep grep (the clause-d gate form):

```
grep -rni "command palette" demo/@/styles/                                    → 0 hits (exit 1)
grep -rni "command palette|CommandPalette|cmdk" demo/ src/ test/ (excl. dist/) → 0 hits
```

---

## S5 — PF-1: Three.js namespace → named imports — **KILL** (clause e — measured before/after build artifact; delta = 0, the estimate FALSIFIED, the refactor REVERTED)

**Rider:** convert the four amiga `import * as THREE` consumers to named imports for
tree-shaking (`perf-frontier.md §PF-1`, P1 FOLD; est. 100–200 KB — the est. is NOT the
artifact). The ONE rider that was permitted to land product code, IFF the measured delta was a
real reduction.

**Disposition: KILL — the measured delta is exactly 0 bytes.** The `vendor-three` chunk hash is
UNCHANGED across the refactor (`B9C4oDST` before AND after = byte-identical content): rolldown
already tree-shakes the namespace import fully. The 100–200 KB estimate is **falsified by
measurement** — precisely the zero-delta cause the spec's KILL leg anticipates ("rolldown
already tree-shakes the namespace"). Per the spec's binary exit ("KILL if the measured delta is
zero / noise … the refactor is churn without a measured reduction"), the four files were
**REVERTED** to the namespace-import form (`git checkout --` over
`demo/app/scenes/AmigaScene.vue demo/amiga/utils.ts demo/amiga/useSphereSpin.ts
demo/amiga/useAmigaAnimations.ts`; `grep -n "import \* as THREE"` hits all four again; tsc
clean). No product code ships.

**Post-revert witness:** a fresh `KF_ANALYZE=1 npm run gh-pages` over the reverted tree (14:26)
reproduces the BEFORE state byte-identically (`vendor-three-B9C4oDST.js` 534,141 bytes;
`AmigaScene-DiCpt8p9.js` 5,854 bytes). Render gate over that dist
(`KF_REQUIRE_BROWSER=1 proof:amiga-subject-is-pivot`): **PASS all 3 clauses** — centre drag
local (centreMAD=8.7 ≫ peripheryMAD=0.0), sphere framed (centroid (0.50,0.50), moved 0.00),
ZERO ReadPixels/GPU-stall/content-visibility warns over a ≥2 s present loop. The
Lighthouse-mobile corroborator is moot at delta=0: the served bytes are IDENTICAL before/after
(same chunk hashes), so there is no perf-score delta to measure — the render gate is the live
actuation of record.

**The BEFORE artifact of record (verbatim, `/tmp/w6-pf1-before.txt`):**

```
=== PF-1 BEFORE (namespace imports) — KF_ANALYZE=1 npm run gh-pages — 2026-06-10 14:01:28 ===
git HEAD: 26eeac1 branch: j-impl-w6

--- build-reported chunk sizes (vite/rolldown reporter) ---
dist/gh-pages/assets/favicon-lzj0QcBq.svg                       0.87 kB │ gzip:     0.52 kB
dist/gh-pages/index.html                                        7.29 kB │ gzip:     2.87 kB
dist/gh-pages/assets/ppmycota-logo-3-BIN0nMRd.svg              10.28 kB │ gzip:     4.95 kB
dist/gh-pages/assets/ppmycota-logo-2-CAWHh5aE.svg              42.68 kB │ gzip:    20.11 kB
dist/gh-pages/assets/codicon-ngg6Pgfi.ttf                     121.97 kB
dist/gh-pages/_chunks.json                                    150.25 kB │ gzip:    17.05 kB
dist/gh-pages/assets/editor.worker-Cn2oRESe.js                279.94 kB
dist/gh-pages/assets/json.worker-BkJRGcCJ.js                  409.21 kB
dist/gh-pages/assets/html.worker-BO6WuOEO.js                  719.57 kB
dist/gh-pages/assets/css.worker-CvXBzhp8.js                 1,054.62 kB
dist/gh-pages/assets/ts.worker-B0J26iPs.js                  6,895.04 kB
dist/gh-pages/assets/AmigaScene-X466Q-mu.css                    0.25 kB │ gzip:     0.17 kB
dist/gh-pages/assets/SquareScene-BzYJ_qzr.css                   0.48 kB │ gzip:     0.30 kB
dist/gh-pages/assets/KeyframeTimeline-BqnghshP.css              0.90 kB │ gzip:     0.32 kB
dist/gh-pages/assets/EasingScene-w340TG1h.css                   1.27 kB │ gzip:     0.49 kB
dist/gh-pages/assets/SequenceScene-2AiPlqU1.css                 1.58 kB │ gzip:     0.61 kB
dist/gh-pages/assets/MotionPathScene-Bv4PrdKr.css               1.96 kB │ gzip:     0.74 kB
dist/gh-pages/assets/SpringScene-CxVxwBb4.css                   2.92 kB │ gzip:     0.86 kB
dist/gh-pages/assets/vendor-monaco-CGi5ri4_.css               145.98 kB │ gzip:    22.60 kB
dist/gh-pages/assets/index-CKGNTKyf.css                       332.53 kB │ gzip:    58.13 kB
dist/gh-pages/assets/_plugin-vue_export-helper-BDNMzG2s.js      0.08 kB │ gzip:     0.09 kB
dist/gh-pages/assets/clipboard-i8JHdbfI.js                      0.12 kB │ gzip:     0.13 kB
dist/gh-pages/assets/useDragScrub-B2ddyHpH.js                   0.53 kB │ gzip:     0.34 kB
dist/gh-pages/assets/rolldown-runtime-QTnfLwEv.js               0.69 kB │ gzip:     0.42 kB
dist/gh-pages/assets/preload-helper-kNaey6uv.js                 1.20 kB │ gzip:     0.68 kB
dist/gh-pages/assets/format-CCoh5EK-.js                         1.42 kB │ gzip:     0.75 kB
dist/gh-pages/assets/useRafScene-BHiOH8kK.js                    2.48 kB │ gzip:     1.08 kB
dist/gh-pages/assets/spring-CYpuPK8D.js                         3.71 kB │ gzip:     1.19 kB
dist/gh-pages/assets/SquareScene-DdrfJYAC.js                    3.79 kB │ gzip:     1.92 kB
dist/gh-pages/assets/KeyframesStringControls-kHvSE6nD.js        4.26 kB │ gzip:     1.98 kB
dist/gh-pages/assets/AmigaScene-DiCpt8p9.js                     5.85 kB │ gzip:     2.72 kB
dist/gh-pages/assets/MotionPathScene-oGAQRyU_.js                8.77 kB │ gzip:     3.85 kB
dist/gh-pages/assets/CSSCodeEditor-gkSYZV_Z.js                  9.19 kB │ gzip:     2.68 kB
dist/gh-pages/assets/vendor-lucide-DDac3_jt.js                 10.52 kB │ gzip:     4.01 kB
dist/gh-pages/assets/EasingScene-MJN0Q7j7.js                   12.01 kB │ gzip:     4.87 kB
dist/gh-pages/assets/SequenceScene-DoYMxSh-.js                 13.88 kB │ gzip:     5.26 kB
dist/gh-pages/assets/SpringScene-Ci-Lhgki.js                   14.85 kB │ gzip:     5.19 kB
dist/gh-pages/assets/KeyframeTimeline-CErTAg-t.js              19.16 kB │ gzip:     7.29 kB
dist/gh-pages/assets/lib-SHQdnRLj.js                           22.54 kB │ gzip:     7.41 kB
dist/gh-pages/assets/standalone-DlyrSOeX-BvaX2kS-.js           90.41 kB │ gzip:    32.86 kB
dist/gh-pages/assets/postcss-CWmVrHvs-BDGCWgzN.js             149.56 kB │ gzip:    41.37 kB
dist/gh-pages/assets/engine-CXSkNzwb.js                       161.00 kB │ gzip:    53.03 kB
dist/gh-pages/assets/html2canvas-B9Ed0YNC.js                  199.57 kB │ gzip:    46.79 kB
dist/gh-pages/assets/index-DMdX4ZMv.js                        235.06 kB │ gzip:    76.68 kB
dist/gh-pages/assets/vendor-reka-ui-bQhghO1n.js               361.31 kB │ gzip:   105.88 kB
dist/gh-pages/assets/vendor-three-B9C4oDST.js                 534.14 kB │ gzip:   133.71 kB
dist/gh-pages/assets/vendor-highlight-DIw3vDFC.js             926.31 kB │ gzip:   308.31 kB
dist/gh-pages/assets/vendor-monaco-COAzEUjw.js              4,183.69 kB │ gzip: 1,068.76 kB

--- ls -la dist/gh-pages/assets ---
total 33416
drwxr-xr-x  48 mkbabb  staff     1536 Jun 10 14:01 .
drwxr-xr-x   6 mkbabb  staff      192 Jun 10 14:01 ..
-rw-r--r--   1 mkbabb  staff     5854 Jun 10 14:01 AmigaScene-DiCpt8p9.js
-rw-r--r--   1 mkbabb  staff      253 Jun 10 14:01 AmigaScene-X466Q-mu.css
-rw-r--r--   1 mkbabb  staff     9198 Jun 10 14:01 CSSCodeEditor-gkSYZV_Z.js
-rw-r--r--   1 mkbabb  staff    12010 Jun 10 14:01 EasingScene-MJN0Q7j7.js
-rw-r--r--   1 mkbabb  staff     1273 Jun 10 14:01 EasingScene-w340TG1h.css
-rw-r--r--   1 mkbabb  staff      903 Jun 10 14:01 KeyframeTimeline-BqnghshP.css
-rw-r--r--   1 mkbabb  staff    19161 Jun 10 14:01 KeyframeTimeline-CErTAg-t.js
-rw-r--r--   1 mkbabb  staff     4264 Jun 10 14:01 KeyframesStringControls-kHvSE6nD.js
-rw-r--r--   1 mkbabb  staff     1960 Jun 10 14:01 MotionPathScene-Bv4PrdKr.css
-rw-r--r--   1 mkbabb  staff     8777 Jun 10 14:01 MotionPathScene-oGAQRyU_.js
-rw-r--r--   1 mkbabb  staff     1582 Jun 10 14:01 SequenceScene-2AiPlqU1.css
-rw-r--r--   1 mkbabb  staff    13880 Jun 10 14:01 SequenceScene-DoYMxSh-.js
-rw-r--r--   1 mkbabb  staff    14852 Jun 10 14:01 SpringScene-Ci-Lhgki.js
-rw-r--r--   1 mkbabb  staff     2922 Jun 10 14:01 SpringScene-CxVxwBb4.css
-rw-r--r--   1 mkbabb  staff      480 Jun 10 14:01 SquareScene-BzYJ_qzr.css
-rw-r--r--   1 mkbabb  staff     3798 Jun 10 14:01 SquareScene-DdrfJYAC.js
-rw-r--r--   1 mkbabb  staff       84 Jun 10 14:01 _plugin-vue_export-helper-BDNMzG2s.js
-rw-r--r--   1 mkbabb  staff      125 Jun 10 14:01 clipboard-i8JHdbfI.js
-rw-r--r--   1 mkbabb  staff   121972 Jun 10 14:01 codicon-ngg6Pgfi.ttf
-rw-r--r--   1 mkbabb  staff  1054628 Jun 10 14:01 css.worker-CvXBzhp8.js
-rw-r--r--   1 mkbabb  staff   279948 Jun 10 14:01 editor.worker-Cn2oRESe.js
-rw-r--r--   1 mkbabb  staff   161004 Jun 10 14:01 engine-CXSkNzwb.js
-rw-r--r--   1 mkbabb  staff      872 Jun 10 14:01 favicon-lzj0QcBq.svg
-rw-r--r--   1 mkbabb  staff     1422 Jun 10 14:01 format-CCoh5EK-.js
-rw-r--r--   1 mkbabb  staff   719577 Jun 10 14:01 html.worker-BO6WuOEO.js
-rw-r--r--   1 mkbabb  staff   199579 Jun 10 14:01 html2canvas-B9Ed0YNC.js
-rw-r--r--   1 mkbabb  staff   332532 Jun 10 14:01 index-CKGNTKyf.css
-rw-r--r--   1 mkbabb  staff   235069 Jun 10 14:01 index-DMdX4ZMv.js
-rw-r--r--   1 mkbabb  staff   409211 Jun 10 14:01 json.worker-BkJRGcCJ.js
-rw-r--r--   1 mkbabb  staff    22541 Jun 10 14:01 lib-SHQdnRLj.js
-rw-r--r--   1 mkbabb  staff   149564 Jun 10 14:01 postcss-CWmVrHvs-BDGCWgzN.js
-rw-r--r--   1 mkbabb  staff    42684 Jun 10 14:01 ppmycota-logo-2-CAWHh5aE.svg
-rw-r--r--   1 mkbabb  staff    10288 Jun 10 14:01 ppmycota-logo-3-BIN0nMRd.svg
-rw-r--r--   1 mkbabb  staff     1208 Jun 10 14:01 preload-helper-kNaey6uv.js
-rw-r--r--   1 mkbabb  staff      694 Jun 10 14:01 rolldown-runtime-QTnfLwEv.js
-rw-r--r--   1 mkbabb  staff     3715 Jun 10 14:01 spring-CYpuPK8D.js
-rw-r--r--   1 mkbabb  staff    90417 Jun 10 14:01 standalone-DlyrSOeX-BvaX2kS-.js
-rw-r--r--   1 mkbabb  staff  6895040 Jun 10 14:01 ts.worker-B0J26iPs.js
-rw-r--r--   1 mkbabb  staff      536 Jun 10 14:01 useDragScrub-B2ddyHpH.js
-rw-r--r--   1 mkbabb  staff     2485 Jun 10 14:01 useRafScene-BHiOH8kK.js
-rw-r--r--   1 mkbabb  staff   926314 Jun 10 14:01 vendor-highlight-DIw3vDFC.js
-rw-r--r--   1 mkbabb  staff    10529 Jun 10 14:01 vendor-lucide-DDac3_jt.js
-rw-r--r--   1 mkbabb  staff   145983 Jun 10 14:01 vendor-monaco-CGi5ri4_.css
-rw-r--r--   1 mkbabb  staff  4183695 Jun 10 14:01 vendor-monaco-COAzEUjw.js
-rw-r--r--   1 mkbabb  staff   361313 Jun 10 14:01 vendor-reka-ui-bQhghO1n.js
-rw-r--r--   1 mkbabb  staff   534141 Jun 10 14:01 vendor-three-B9C4oDST.js

--- vendor-three exact bytes ---
dist/gh-pages/assets/vendor-three-B9C4oDST.js 534141 bytes
```

**The AFTER artifact of record (verbatim, `/tmp/w6-pf1-after.txt` — includes the delta block):**

```
=== PF-1 AFTER (named imports) — KF_ANALYZE=1 npm run gh-pages — 2026-06-10 14:03:42 ===
git HEAD: 26eeac1 branch: j-impl-w6 (working-tree edit, uncommitted)
refactor: import * as THREE -> named imports in demo/app/scenes/AmigaScene.vue, demo/amiga/utils.ts, demo/amiga/useSphereSpin.ts, demo/amiga/useAmigaAnimations.ts; grep THREE across the four = 0; npm run check (tsc --noEmit) clean

--- build-reported chunk sizes (vite/rolldown reporter) ---
dist/gh-pages/assets/favicon-lzj0QcBq.svg                       0.87 kB │ gzip:     0.52 kB
dist/gh-pages/index.html                                        7.29 kB │ gzip:     2.87 kB
dist/gh-pages/assets/ppmycota-logo-3-BIN0nMRd.svg              10.28 kB │ gzip:     4.95 kB
dist/gh-pages/assets/ppmycota-logo-2-CAWHh5aE.svg              42.68 kB │ gzip:    20.11 kB
dist/gh-pages/assets/codicon-ngg6Pgfi.ttf                     121.97 kB
dist/gh-pages/_chunks.json                                    150.25 kB │ gzip:    17.05 kB
dist/gh-pages/assets/editor.worker-Cn2oRESe.js                279.94 kB
dist/gh-pages/assets/json.worker-BkJRGcCJ.js                  409.21 kB
dist/gh-pages/assets/html.worker-BO6WuOEO.js                  719.57 kB
dist/gh-pages/assets/css.worker-CvXBzhp8.js                 1,054.62 kB
dist/gh-pages/assets/ts.worker-B0J26iPs.js                  6,895.04 kB
dist/gh-pages/assets/AmigaScene-laeuZdoG.css                    0.25 kB │ gzip:     0.17 kB
dist/gh-pages/assets/SquareScene-BzYJ_qzr.css                   0.48 kB │ gzip:     0.30 kB
dist/gh-pages/assets/KeyframeTimeline-BqnghshP.css              0.90 kB │ gzip:     0.32 kB
dist/gh-pages/assets/EasingScene-w340TG1h.css                   1.27 kB │ gzip:     0.49 kB
dist/gh-pages/assets/SequenceScene-2AiPlqU1.css                 1.58 kB │ gzip:     0.61 kB
dist/gh-pages/assets/MotionPathScene-Bv4PrdKr.css               1.96 kB │ gzip:     0.74 kB
dist/gh-pages/assets/SpringScene-CxVxwBb4.css                   2.92 kB │ gzip:     0.86 kB
dist/gh-pages/assets/vendor-monaco-CGi5ri4_.css               145.98 kB │ gzip:    22.60 kB
dist/gh-pages/assets/index-CKGNTKyf.css                       332.53 kB │ gzip:    58.13 kB
dist/gh-pages/assets/_plugin-vue_export-helper-BDNMzG2s.js      0.08 kB │ gzip:     0.09 kB
dist/gh-pages/assets/clipboard-i8JHdbfI.js                      0.12 kB │ gzip:     0.13 kB
dist/gh-pages/assets/useDragScrub-B9Mj3_uC.js                   0.53 kB │ gzip:     0.34 kB
dist/gh-pages/assets/rolldown-runtime-QTnfLwEv.js               0.69 kB │ gzip:     0.42 kB
dist/gh-pages/assets/preload-helper-kNaey6uv.js                 1.20 kB │ gzip:     0.68 kB
dist/gh-pages/assets/format-CCoh5EK-.js                         1.42 kB │ gzip:     0.75 kB
dist/gh-pages/assets/useRafScene-CjyRZ9b2.js                    2.48 kB │ gzip:     1.08 kB
dist/gh-pages/assets/spring-CYpuPK8D.js                         3.71 kB │ gzip:     1.19 kB
dist/gh-pages/assets/SquareScene-BRSmEAUC.js                    3.79 kB │ gzip:     1.92 kB
dist/gh-pages/assets/KeyframesStringControls-Ct6geCKM.js        4.26 kB │ gzip:     1.98 kB
dist/gh-pages/assets/AmigaScene-W6EK3xcf.js                     5.85 kB │ gzip:     2.72 kB
dist/gh-pages/assets/MotionPathScene-D1lJtbfP.js                8.77 kB │ gzip:     3.85 kB
dist/gh-pages/assets/CSSCodeEditor-7OblCl3f.js                  9.19 kB │ gzip:     2.68 kB
dist/gh-pages/assets/vendor-lucide-DDac3_jt.js                 10.52 kB │ gzip:     4.01 kB
dist/gh-pages/assets/EasingScene-CewoCKBS.js                   12.01 kB │ gzip:     4.87 kB
dist/gh-pages/assets/SequenceScene-23TrXCgb.js                 13.88 kB │ gzip:     5.26 kB
dist/gh-pages/assets/SpringScene-DZxl_PVU.js                   14.85 kB │ gzip:     5.18 kB
dist/gh-pages/assets/KeyframeTimeline-BhDvPmyv.js              19.16 kB │ gzip:     7.29 kB
dist/gh-pages/assets/lib-SHQdnRLj.js                           22.54 kB │ gzip:     7.41 kB
dist/gh-pages/assets/standalone-DlyrSOeX-BvaX2kS-.js           90.41 kB │ gzip:    32.86 kB
dist/gh-pages/assets/postcss-CWmVrHvs-BDGCWgzN.js             149.56 kB │ gzip:    41.37 kB
dist/gh-pages/assets/engine-CXSkNzwb.js                       161.00 kB │ gzip:    53.03 kB
dist/gh-pages/assets/html2canvas-B9Ed0YNC.js                  199.57 kB │ gzip:    46.79 kB
dist/gh-pages/assets/index-CPeGIBUj.js                        235.06 kB │ gzip:    76.68 kB
dist/gh-pages/assets/vendor-reka-ui-bQhghO1n.js               361.31 kB │ gzip:   105.88 kB
dist/gh-pages/assets/vendor-three-B9C4oDST.js                 534.14 kB │ gzip:   133.71 kB
dist/gh-pages/assets/vendor-highlight-DIw3vDFC.js             926.31 kB │ gzip:   308.31 kB
dist/gh-pages/assets/vendor-monaco-COAzEUjw.js              4,183.69 kB │ gzip: 1,068.76 kB

--- ls -la dist/gh-pages/assets ---
total 33416
drwxr-xr-x  48 mkbabb  staff     1536 Jun 10 14:03 .
drwxr-xr-x   6 mkbabb  staff      192 Jun 10 14:03 ..
-rw-r--r--   1 mkbabb  staff     5854 Jun 10 14:03 AmigaScene-W6EK3xcf.js
-rw-r--r--   1 mkbabb  staff      253 Jun 10 14:03 AmigaScene-laeuZdoG.css
-rw-r--r--   1 mkbabb  staff     9198 Jun 10 14:03 CSSCodeEditor-7OblCl3f.js
-rw-r--r--   1 mkbabb  staff    12010 Jun 10 14:03 EasingScene-CewoCKBS.js
-rw-r--r--   1 mkbabb  staff     1273 Jun 10 14:03 EasingScene-w340TG1h.css
-rw-r--r--   1 mkbabb  staff    19161 Jun 10 14:03 KeyframeTimeline-BhDvPmyv.js
-rw-r--r--   1 mkbabb  staff      903 Jun 10 14:03 KeyframeTimeline-BqnghshP.css
-rw-r--r--   1 mkbabb  staff     4264 Jun 10 14:03 KeyframesStringControls-Ct6geCKM.js
-rw-r--r--   1 mkbabb  staff     1960 Jun 10 14:03 MotionPathScene-Bv4PrdKr.css
-rw-r--r--   1 mkbabb  staff     8777 Jun 10 14:03 MotionPathScene-D1lJtbfP.js
-rw-r--r--   1 mkbabb  staff    13880 Jun 10 14:03 SequenceScene-23TrXCgb.js
-rw-r--r--   1 mkbabb  staff     1582 Jun 10 14:03 SequenceScene-2AiPlqU1.css
-rw-r--r--   1 mkbabb  staff     2922 Jun 10 14:03 SpringScene-CxVxwBb4.css
-rw-r--r--   1 mkbabb  staff    14852 Jun 10 14:03 SpringScene-DZxl_PVU.js
-rw-r--r--   1 mkbabb  staff     3798 Jun 10 14:03 SquareScene-BRSmEAUC.js
-rw-r--r--   1 mkbabb  staff      480 Jun 10 14:03 SquareScene-BzYJ_qzr.css
-rw-r--r--   1 mkbabb  staff       84 Jun 10 14:03 _plugin-vue_export-helper-BDNMzG2s.js
-rw-r--r--   1 mkbabb  staff      125 Jun 10 14:03 clipboard-i8JHdbfI.js
-rw-r--r--   1 mkbabb  staff   121972 Jun 10 14:03 codicon-ngg6Pgfi.ttf
-rw-r--r--   1 mkbabb  staff  1054628 Jun 10 14:03 css.worker-CvXBzhp8.js
-rw-r--r--   1 mkbabb  staff   279948 Jun 10 14:03 editor.worker-Cn2oRESe.js
-rw-r--r--   1 mkbabb  staff   161004 Jun 10 14:03 engine-CXSkNzwb.js
-rw-r--r--   1 mkbabb  staff      872 Jun 10 14:03 favicon-lzj0QcBq.svg
-rw-r--r--   1 mkbabb  staff     1422 Jun 10 14:03 format-CCoh5EK-.js
-rw-r--r--   1 mkbabb  staff   719577 Jun 10 14:03 html.worker-BO6WuOEO.js
-rw-r--r--   1 mkbabb  staff   199579 Jun 10 14:03 html2canvas-B9Ed0YNC.js
-rw-r--r--   1 mkbabb  staff   332532 Jun 10 14:03 index-CKGNTKyf.css
-rw-r--r--   1 mkbabb  staff   235069 Jun 10 14:03 index-CPeGIBUj.js
-rw-r--r--   1 mkbabb  staff   409211 Jun 10 14:03 json.worker-BkJRGcCJ.js
-rw-r--r--   1 mkbabb  staff    22541 Jun 10 14:03 lib-SHQdnRLj.js
-rw-r--r--   1 mkbabb  staff   149564 Jun 10 14:03 postcss-CWmVrHvs-BDGCWgzN.js
-rw-r--r--   1 mkbabb  staff    42684 Jun 10 14:03 ppmycota-logo-2-CAWHh5aE.svg
-rw-r--r--   1 mkbabb  staff    10288 Jun 10 14:03 ppmycota-logo-3-BIN0nMRd.svg
-rw-r--r--   1 mkbabb  staff     1208 Jun 10 14:03 preload-helper-kNaey6uv.js
-rw-r--r--   1 mkbabb  staff      694 Jun 10 14:03 rolldown-runtime-QTnfLwEv.js
-rw-r--r--   1 mkbabb  staff     3715 Jun 10 14:03 spring-CYpuPK8D.js
-rw-r--r--   1 mkbabb  staff    90417 Jun 10 14:03 standalone-DlyrSOeX-BvaX2kS-.js
-rw-r--r--   1 mkbabb  staff  6895040 Jun 10 14:03 ts.worker-B0J26iPs.js
-rw-r--r--   1 mkbabb  staff      536 Jun 10 14:03 useDragScrub-B9Mj3_uC.js
-rw-r--r--   1 mkbabb  staff     2485 Jun 10 14:03 useRafScene-CjyRZ9b2.js
-rw-r--r--   1 mkbabb  staff   926314 Jun 10 14:03 vendor-highlight-DIw3vDFC.js
-rw-r--r--   1 mkbabb  staff    10529 Jun 10 14:03 vendor-lucide-DDac3_jt.js
-rw-r--r--   1 mkbabb  staff   145983 Jun 10 14:03 vendor-monaco-CGi5ri4_.css
-rw-r--r--   1 mkbabb  staff  4183695 Jun 10 14:03 vendor-monaco-COAzEUjw.js
-rw-r--r--   1 mkbabb  staff   361313 Jun 10 14:03 vendor-reka-ui-bQhghO1n.js
-rw-r--r--   1 mkbabb  staff   534141 Jun 10 14:03 vendor-three-B9C4oDST.js

--- vendor-three exact bytes ---
dist/gh-pages/assets/vendor-three-B9C4oDST.js 534141 bytes

=== DELTA ===
BEFORE: vendor-three-B9C4oDST.js 534141 bytes (534.14 kB, gzip 133.71 kB)
AFTER:  vendor-three-B9C4oDST.js 534141 bytes
DELTA:  0 bytes — chunk hash UNCHANGED (B9C4oDST = byte-identical content): rolldown already tree-shakes the namespace import fully
AmigaScene chunk: BEFORE AmigaScene-DiCpt8p9.js 5854 bytes -> AFTER AmigaScene-W6EK3xcf.js 5854 bytes

=== RENDER VERIFICATION (over the AFTER dist) ===
proof:amiga-subject-is-pivot (serves dist/gh-pages, actuates /#/amiga, KF_REQUIRE_BROWSER=1): PASS
  clause(a) centre drag local subject change: centreMAD=8.7 >> peripheryMAD=0.0
  clause(b) sphere framed: centroid (0.50,0.50), moved 0.00 of frame
  clause(c) ZERO ReadPixels/GPU-stall/content-visibility warns over >=2s present loop
```

---

## S6 — PF-3: Monaco static-edge re-verify — **PASS** (clause f — bundle-probe artifact over a fresh build)

**Rider:** VERIFY-ONLY re-confirm of the I-era win — ZERO static edge from any emitted chunk to
`vendor-monaco` (`perf-frontier.md §PF-3`; `vendor-monaco` is the dominant payload on this
build: 4,183.69 kB │ gzip 1,068.76 kB, + workers).

**Protocol executed:** fresh `KF_ANALYZE=1 npm run gh-pages` (✓ built — the same fresh build as
S5's post-revert witness, 2026-06-10 14:26) → `node scripts/proof-modern-web.mjs` over
`dist/gh-pages/_chunks.json`. The probe output (the edge-list assertion, verbatim):

```
✓ proof:monaco-deferred: CSSCodeEditor source: Monaco namespace + workers are dynamic-imported (no static edge).
✓ proof:monaco-deferred (bundle): 0 chunks statically import vendor-monaco-COAzEUjw.js — Monaco rides only the dynamic editor-mount boundary.
proof:modern-web — PASS (every adopted lever present; every checklist row dispositioned)
```

**The no-build hard-fail witnessed working as designed:** with `dist/gh-pages` absent (the lib
build empties `dist/`) the probe hard-FAILED exit 1 — `"dist/gh-pages not built — run npm run
gh-pages …"` — a FAIL, not a skip, exactly per `proof-modern-web.mjs:182-186`/`:663`. That fail
is the gate working; THIS section's edge-list over the real build is the close artifact.

**Disposition — PASS: the I-era win held.** Monaco is off the critical path (the spring-mobile
LCP win 28.5 s → <15 s preserved); the `advancedChunks` `preload-helper` group did not regress.
No escalation.

---

## S7 — EF-3: `parseLinearStops` shim retirement check — **KEEP-with-probe** (clause g — value.js E1 probe artifact; HANDOFF unchanged)

**Rider:** retire kf's local `linear()`/`steps()` reader IFF value.js E1 published its parser
(`recap-GH.md §G-1`, `recap-deferred.md:101`, `G.WV.md:356`; no-legacy: retire-in-the-same-
motion, no compat alias). `linear()` platform Baseline-WA 2026-06-11 is a fixed PAST date — the
gating question is purely the value.js publish state. (N.B. "EF-3" is `J.md`'s charter label for
THIS shim check; `recap-EF.md:373`'s own EF-3 is the sync-step item this wave routed to S1/FB-2.)

**The probe (run first-hand, 2026-06-10):**

```
npm view @mkbabb/value.js version                 → 0.11.2   (latest published)
node_modules/@mkbabb/value.js package.json        → 0.11.2   (installed = latest)
typeof v.parseLinearStops                          → undefined
typeof v.getPointAtLength                          → undefined
typeof v.lerpArray                                 → function   (S2's dep intact, same probe)
```

**value.js E1 is UNPUBLISHED ⇒ the RETIRE precondition does not hold.**

**Disposition — KEEP (probe-evidenced, not asserted):** the shim stays —
`src/animation/utils.ts:106` (definition) + `:192` (consumption), both verified present. This is
NOT a fifth defer: the shim is a sibling-gated CHRONIC-by-design HANDOFF (the re-pin process,
OUT); the probe output above is the artifact, and the paired born-RED gate
(`grep parseLinearStops src/` = 0 reds-on-retire) flips on the value.js E1 re-pin with ZERO kf
edit owed beyond the same-motion excision (`deferred-ledger.md:88`).

---

## S8 — GH-6 / DEP-1: the CNAME drift — **STILL OPEN, recorded** (clause h — VERIFY-ONLY; stays OUT, deploy-owned)

**Rider:** confirm whether the deploy-owned `dns-cf-sync.sh` CNAME drift fix has been applied
since I-close (`recap-GH.md §H-4`; kf AUTHORS the target, deploy WRITES; a blind sync would
REGRESS the live CNAME).

**The verification (first-hand, 2026-06-10 — the deploy owner's repo-of-record read READ-ONLY,
plus the live boundary oracle the spec names):**

1. **The authoritative target (kf-side):** `.github/workflows/deploy-pages.yml:4-5` —
   *"keyframes.babb.dev is a Cloudflare Pages project (`keyframes` → keyframes-8uq.pages.dev)"*.
2. **The deploy repo-of-record (`~/Programming/deploy/cf/dns-cf-sync.sh`, read-only):** line 105
   still reads, verbatim:
   `"CNAME|keyframes.babb.dev|keyframes.pages.dev|true"  # UNVERIFIED — owner-confirm the real subdomain`
   — the DRIFTED target (`keyframes.pages.dev`, not `keyframes-8uq.pages.dev`), still marked
   UNVERIFIED by the owner's own roster comment. The fourier line WAS fixed (`3c3fbd2 fix(dns):
   fourier CNAME → fourier-682.pages.dev`) but the keyframes line was NOT.
3. **The live boundary oracle:** `dig keyframes.babb.dev` → CF-proxied A records
   `104.21.56.22` / `172.67.175.252` (orange-cloud flattening hides the CNAME content at the
   resolver — the proxied form the script's own §88 comment describes);
   `curl -sI https://keyframes.babb.dev` → **HTTP/2 200** via Cloudflare. The LIVE site is
   correct TODAY because `dns-cf-sync.sh` has not been re-run against the drifted roster.

**Disposition — VERIFY-ONLY, recorded: the DEP-1 fix is NOT applied (STILL OPEN).** The hazard
is unchanged: a blind `dns-cf-sync.sh` run would rewrite the keyframes CNAME to the wrong
(`keyframes.pages.dev`) target. It stays an OUT sibling-HANDOFF (deploy-owned P0) — J does not
fold it into a kf wave; the kf-side deploy correctness is J.W0's green-CI→auto-deploy oracle,
cross-referenced. The owed deploy-side write remains: `dns-cf-sync.sh:105` →
`keyframes-8uq.pages.dev` (authoritative source: kf's `deploy-pages.yml`).

---

## S9 — CE-1.0: Safari `linear()`-HW-accel hazard — **GUARD landed** (on-device WebKit trace artifact + born-RED witnessed)

**Rider:** verify on-device that WebKit refuses hardware acceleration for the spring-`linear()`
twin the CURRENT delegation emits (`waapi.ts` toWAAPIOptions: `easing = uniformTiming.css ??
"linear"`); GUARD-or-DOCUMENT (`audit/frontier/compositor-eligibility.md` CE-1.0 / §3.0).

**The probe (authored this wave):** `scripts/probe-webkit-linear-accel.mjs` — a differential
main-thread-occupancy probe (no public WebKit API exposes compositor placement; this is the
feasible feature-probe form §S9 names). N=800 concurrent WAAPI animations per arm; a 2 s
saturating MessageChannel task-throughput measurement (rendering steps preempt between tasks, so
per-frame main-thread animation cost shows directly as lost units) + rAF cadence; arms =
baseline (none) / keyword `linear` transform (compositor-eligible) / custom 61-stop `linear()`
transform (the spring-twin hazard arm) / `left` layout (the never-accelerated anchor); Chromium
runs the same arms as the instrument control. Run first-hand
(`KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/glass-ui`, Playwright webkit-2287), verbatim:

```
webkit 26.4 — task-throughput units (2 s window):
  baseline  units= 43505 (ceiling)            rafFrames=122 meanMs=16.57
  keyword   units= 41880 (96.3% of baseline)  easing="linear"
  linearfn  units= 10424 (24.0% of baseline)  easing="linear(0.00 0%, 0.14 1.67%, ..." (accepted)
  layout    units= 37287 (85.7% of baseline)
  → keyword=96.3% · linearfn=24.0% · layout=85.7% · linearfn-vs-keyword gap=72.3pp
chromium 148.0.7778.96 — control:
  → keyword=80.9% · linearfn=77.8% · layout=76.4% · linearfn-vs-keyword gap=3.1pp
```

**Reading:** on WebKit the IDENTICAL transform corpus costs ~4% of main-thread throughput with
keyword `linear` but **~76% with the custom `linear()` easing** — a 72.3pp gap, with the
`linear()` string provably ACCEPTED (`effect.getTiming().easing` echoes it back; not a syntax
gap). The Chromium control's 3.1pp gap bounds instrument noise — the WebKit gap is ENGINE
behaviour. **The exclusion BITES: a delegated spring-`linear()` animation runs main-thread on
WebKit — heavier than the rAF path it bypassed. The spec's GUARD leg fires.**

**The GUARD (landed, no second delegation path):** `src/animation/waapi.ts` — ONE ineligibility
reason added to the existing `isWAAPIEligible` gate: a `linear()`-twinned easing
(`firstTF.css.startsWith("linear(")`) is HELD on the rAF path when the engine is WebKit. The
WebKit check is an ENGINE feature-detect (`typeof webkitConvertPointFromNodeToPage ===
"function"` — WebKit-only since Safari 4), NOT a UA sniff: Chromium AND jsdom both falsely
advertise "AppleWebKit" in their UA strings (probe-verified on all three engines), so a UA gate
would misfire in tests and in Chromium. `cubic-bezier()`/keyword twins still delegate — the hold
is `linear()`-specific, matching the measured refusal. `toWAAPIOptions`' easing comment +
`src/animation/CLAUDE.md` trued in the same motion.

**Born-RED witness:** guard deliberately disabled (`if (false && …)`) →
`test/waapi-lifecycle.test.ts` clause `CE-1.0 — a spring linear() twin is INELIGIBLE on WebKit`
REDs (`Tests 1 failed | 9 passed (10)`); mutation reverted → 10/10 GREEN. The paired test also
locks the inverse contracts: jsdom (no WebKit marker) still delegates the single-segment spring,
and a `cubic-bezier()` twin still delegates under the WebKit marker.

**Conservative-correctness restored:** the delegation again only ever trades a perf OPPORTUNITY
(`waapi.ts` delegation contract) — on WebKit the spring runs the rAF path that was already
correct. The K-scoped CE-1 per-property partition is untouched (this is ONLY the hazard cure on
the path that ships today). A real-Safari Web Inspector trace remains a welcome corroborator but
is no longer load-bearing: the on-device WebKit measurement above is the artifact, and the guard
is engine-feature-keyed, not version-keyed.

---

## Final gates on the closing tree (waapi guard + PF-1 revert included; re-run at close)

| Gate | Result |
|---|---|
| `npm run check` (tsc --noEmit) | CLEAN |
| full `vitest run` | **72 files passed; 696 passed + 2 expected-fail (698)** |
| `proof:event-ordering` | 5/5 GREEN (born-RED ×2 witnessed, §S1) |
| `proof:sync-step` | 5/5 GREEN (incl. the new clause 3) |
| `test/lerparray-adopt.test.ts` | 3/3 GREEN |
| `test/waapi-lifecycle.test.ts` | 10/10 GREEN (incl. CE-1.0 clause; born-RED witnessed, §S9) |
| `proof:modern-web` (incl. `proof:monaco-deferred` bundle half) | PASS over the fresh build |
| `proof:amiga-subject-is-pivot` (KF_REQUIRE_BROWSER=1) | PASS 3/3 over the post-revert dist |
| `proof:decomposition` / `proof:engine` | PASS (engine.ts ≤1400; group.ts 819 ≤ 820) |
| `npm run build:lib` | ✓ (dist/engine-DX8A5w2A.js 37.06 kB │ gzip 10.35 kB) |

**P6 tier annotation:** the ordering lock + sync-step clause 3 + the lerpArray-adopt guard +
the CE-1.0 eligibility clause are device-independent correctness locks (hard-gate in CI); the
S1 measure probe and the S2 bench print numbers and assert arm-neutral invariants only
(observe-only in CI); the LAND/ADOPT/KILL decisions were taken on-device from the numbers above.
PF-1/PF-3 bundle sizes are deterministic build output (device-independent).

**The close-ledger invariant holds:** every rider above exits with its named artifact inline in
this note or a reasoned KILL that cites the number/probe that killed it. ZERO rows leave J.W6
tagged MEASURE-FIRST without a measurement. Nothing rides a fifth tranche.
