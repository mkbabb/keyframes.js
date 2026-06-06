# F.W1 — Fix the broken benches + author the missing ones (charter F1)

**Phase:** IMPL (spec authored in DEV — awaits auth) · **Class:** SHIP-in-F — harness-only,
isomorphic (the bench tier; ZERO engine/library change) · **Scope:**
`bench/**` + `package.json` (the bench harness) · **DAG-deps:** depends on F.W0
(the §Mandate spine, the dev/impl boundary). **F.W1 LEADS Band 1** — the perf
waves F4/F5/F6 cannot gate honestly until the benches run (`F.md §The DAG`,
the critical path `F1 → F4/F5/F6`).

The §Mandate (F.W0) is the spine; this wave most tests **measure-first** — the
instrument every Band-1 perf disposition leans on is *broken*, so no perf claim
can be gated honestly until it runs. Four independent F lanes converged on the same
blocker: the compile/interp benches import `CSSKeyframesAnimation` from the barrel,
which E made a **type-only export** (`src/animation/index.ts:108`) → the runtime
value resolves `undefined` → `TypeError: ... is not a constructor` on the first
`new` (`bench/interpolation.bench.ts:2` + `bench/parser.bench.ts:2`). This wave
specs the one-line import fix and authors the missing benches the Band-1 withholds
need to gate against.

This is net-new (a gate-coverage residual, NOT inherited debt — the ledger is clean,
`_SYNTHESIS-deferred-ledger §0`). Verified not asserted (inv ε) against `tranche-e-impl`.

**Provenance.** `r-frame-compile-sota F-5`, `a-framecompiler-remeasure §4`,
`p-compile-perf-F §6`, `a-test-quality §4` (4 lanes converge on the broken-bench
blocker + the missing-bench coverage frontier).

---

## § The state, verified (not asserted)

The live facts, read- and grep-confirmed on `tranche-e-impl`:

1. **The barrel exports `CSSKeyframesAnimation` as a TYPE only.**
   `src/animation/index.ts:108` reads `export type { Animation, CSSKeyframesAnimation,
   AnimationGroup } from "./engine";` — verified live. The comment at `:105-107`
   names the design: "Heavy-class TYPES stay on the static barrel (erased)… The
   runtime constructors are reached only via `loadAnimationEngine()`." The barrel
   is correct — the light/heavy boundary is exemplary (`proof:boundary` gates it,
   §ALREADY-SOTA). The BUG is the bench importing the *value* through the *type*
   surface.

2. **Two benches import the value through the type-only barrel.**
   `bench/interpolation.bench.ts:2` reads `import { CSSKeyframesAnimation } from
   "../src/animation";` and `new CSSKeyframesAnimation({ duration: 1000 }).fromString(...)`
   at `:6` — verified live. `bench/parser.bench.ts:2` is identical. The static named
   import resolves `undefined`; `new undefined(...)` throws `TypeError:
   CSSKeyframesAnimation is not a constructor`. `a-framecompiler-remeasure §4`
   reproduced the live `TypeError` via `npx vitest bench --run bench/interpolation.bench.ts`.

3. **The fix is one line, and the demo already uses it.** The runtime value lives at
   `src/animation/engine` and is imported there directly by the demo ops:
   `useKeyframeOps.ts:2` reads `import { Animation, CSSKeyframesAnimation } from
   "@src/animation/engine"` (`a-framecompiler-remeasure §4`). The bench fix is to
   change the import path from `"../src/animation"` (the type-only barrel) to
   `"../src/animation/engine"` (the value module) at `bench/{interpolation,parser}.bench.ts:2`.
   `interpolation.bench.ts:3` already imports `AnimationGroup` from
   `"../src/animation/group"` directly (the value path) — so the engine sub-path
   import is the established idiom; the barrel import is the anomaly.

4. **The bench tier has a coverage frontier — net-new E surfaces with NO bench.**
   `bench/` holds exactly three runnable files (`interpolation.bench.ts`,
   `parser.bench.ts`, `playwright.bench.ts` + the `loaf-scene.html` fixture) —
   verified live. `a-test-quality §4` + `a-framecompiler-remeasure §4` name the gaps:
   (a) the **threaded-buffer interp shape** the current `interpolation.bench.ts` cannot
   measure (it calls `interpFrames(t, false)` with the default `{}` buffer, blind to
   the dict-mode deopt F4 needs — `p-runtime-perf-F §1.3`); (b) the **sync-step
   loop-core** F5 needs; (c) the **FrameCompiler compile-throughput** the editing
   session profile needs; (d) **`SpringProgress.tick`** (the orchestration tier shipped
   E.W10 with zero throughput coverage). `package.json:57` defines `"bench": "vitest bench"`.

The wave's job: fix the one-line import at both benches, author the four missing
bench files the Band-1 withholds need, and close it with a gate that bites the
`TypeError` it removes — each re-runnable, isomorphic (bench-harness-only).

---

## § Goal

**What lands (the IMPL the spec gates):**
- **The one-line import fix at `bench/{interpolation,parser}.bench.ts:2`** — change
  `"../src/animation"` → `"../src/animation/engine"`. Isomorphic, harness-only; turns
  the live `TypeError` into a running bench. (SHIP-in-F.)
- **The missing benches authored** — `bench/interp-buffer.bench.ts` (the threaded
  `out`-buffer interp shape, the deliverable `a-runtime-remeasure RM-1` sketches at
  its §A.1, that F4 gates against), `bench/sync-step.bench.ts` (the `RAFPlayback`
  loop-core dispatch F5 gates against), `bench/compile.bench.ts` (FrameCompiler
  compile-throughput on the editing-session profile, F4/W8-remeasure), and a
  `SpringProgress.tick` bench (the orchestration tier's hot stepper). (SHIP-in-F.)
- **`bench/parser.bench.ts` SHAPED** (S4b, `KF-10`/`NEW-40` — the parsing-charter
  measurement substrate) — the corpus / cache-buster / layer-isolation shapes the
  value.js+parse-that hand-offs gate against, and the bench KF-9/`NEW-24` (`splitPathKey`)
  measures itself on. (SHIP-in-F.)
- **`proof:bench-runs` authored** — a gate that runs `npm run bench` for the compile +
  interp + parser suites and asserts a non-empty result (it bites the `TypeError` today).

**Why:** every measure-first disposition in Band 1 is un-measurable until the benches
run — this is the critical-path unblock (`F.md §The DAG`). The fix is
trivial and isomorphic (it changes only an import path on a harness file; zero engine
behaviour); the missing benches are the harnesses required to honestly re-measure (or
finally retire) E's W7/W8 withholds rather than re-asserting "negligible"
(`a-test-quality §6`). Without `bench/interp-buffer.bench.ts` and the threaded-buffer
shape, F4's 3.8–6.2× claim is un-gateable — the current bench is structurally blind to
the dict-mode deopt (`p-runtime-perf-F §1.3`).

---

## § Scope

### S1 — The one-line import fix — `r-frame-compile-sota F-5` / `a-framecompiler-remeasure §4`

**WHAT:** at `bench/interpolation.bench.ts:2` and `bench/parser.bench.ts:2`, change the
import from the type-only barrel `"../src/animation"` to the value module
`"../src/animation/engine"`. (The `AnimationGroup` import at `interpolation.bench.ts:3`
already uses the direct value path `"../src/animation/group"` — this aligns the
`CSSKeyframesAnimation` import to the same idiom.) **No other change** to the bench
bodies — same animations, same cases, same assertions.

**WHY:** the barrel is a type-only surface BY DESIGN (the light/heavy boundary,
`index.ts:105-108`, §ALREADY-SOTA); the bench's bug is importing a runtime constructor
through it. The fix is the demo's established idiom (`useKeyframeOps.ts:2`). It is
isomorphic (harness-only; the benches measure the SAME engine) and removes the live
`TypeError` four lanes hit. The §Mandate forbids a workaround — this is not "stub the
constructor" or "skip the bench"; it is the genuine one-motion path-correction.

### S2 — Author `bench/interp-buffer.bench.ts` (the threaded-buffer interp shape) — `a-runtime-remeasure RM-1 §A.1`

**WHAT:** the shaped sibling of `interpolation.bench.ts` that the current bench
**cannot** be (it calls `interpFrames(t, false)` with the default `{}` buffer, so every
call allocates a fresh fast-mode object and the GC win *masks* the dict-mode cost —
`p-runtime-perf-F §1.3`). The new bench threads ONE long-lived `out` buffer across a
600-frame steady window at the demo's realistic K (2/5/12 flat keys), the realistic
playback shape (`a-runtime-remeasure §A.1` reproduces the file). This is the harness
F4's `proof:interp-fastprops` wall-time clause measures.

**WHY:** the threaded-buffer shape is the one the dict-mode deopt (F4) is observable
in — the current bench is "structurally incapable of observing three of the four
withholds" (`a-runtime-remeasure` headline). F4's 3.8–6.2× claim is un-gateable
without it. KISS: it is the minimal shaped variant, not a rewrite of the existing bench.

### S3 — Author `bench/sync-step.bench.ts` (the loop-core dispatch) — `a-runtime-remeasure RM-2 §A.2`

**WHAT:** a bench over `RAFPlayback._run`'s loop-core dispatch on a synchronous `drive`
stepper (`SmoothProgress`/`SpringProgress` `tickDt`), with rAF stubbed to a synchronous
immediate-callback so it measures the loop-core promise+microtask cost, not real frame
pacing (`a-runtime-remeasure §A.2`). This is the harness F5's `proof:sync-step`
promise-count clause measures (the 33 ns/frame `drive` overhead).

**WHY:** F5's `drive`-half fold (the sync fast-path) is un-gateable without a bench that
isolates the loop-core dispatch. The current tier has zero coverage of `playback.ts`.

### S4 — Author `bench/compile.bench.ts` + a `SpringProgress.tick` bench — `a-test-quality §4` / `a-framecompiler-remeasure §1`

**WHAT:** (a) `bench/compile.bench.ts` — a FrameCompiler compile-throughput bench on the
editing-session profile (cold `parse()` over 2/6/11/50/200-stop animations, the full-tick
denominator `a-framecompiler-remeasure §1` measured by importing from `engine.ts` directly).
This is the harness that lets F honestly re-measure (or retire) E's W8 S1/S2/S3 withholds
rather than re-asserting "negligible" (`a-test-quality §6`: "F cannot re-measure E's W8
withhold without a FrameCompiler bench that doesn't exist"). (b) a `SpringProgress.tick`
bench — the orchestration tier's hot stepper (`spring.ts:289` `tickDt`), shipped E.W10
with zero throughput coverage.

**WHY:** the W8 withhold HOLDS but must hold "re-measured with the numbers the BOOK
lacked" (`F.md §The honest bottom line`) — the FrameCompiler bench is the instrument that
gives the W8 RECORD/BOOK its full-tick denominator. The orchestration tier is the
highest-profile E public API with zero bench coverage (`a-test-quality §4`).

### S4b — Shape `bench/parser.bench.ts` (the parsing-charter measurement substrate) — `parsing/_SYNTHESIS-parsing-sota KF-10` / `px-kf-grammar` / `p-parse-perf-F`

**WHAT:** extend the existing `bench/parser.bench.ts` (today only a cold `simple 2-stop` +
`complex 11-stop` `fromString`, verified `bench/parser.bench.ts:14-22`) into the SHAPED
parser bench the parsing dive names as the charter deliverable — three shapes: (1) a
realistic per-value corpus (lengths/colors/calc/transforms, not just `opacity`), (2) the
cache-buster shape (a unique value per iteration so `tryParseCache` never hits — the
editor-keystroke reality, warm ~94 µs → cache-busting ~247 µs ≈ 2.6×), and (3) a
layer-isolation micro-bench (the bare `CSSValueUnit.Value` parse vs the full pipeline — the
13.6× / `any`-vs-`dispatch` 21× rows the value.js/parse-that hand-offs collapse). Import
`CSSKeyframesAnimation` from `engine` (the S1 fix), not the type-only barrel.

**WHY:** this is the parse-side sibling of S2/S3/S4's interp/compile benches — the durable
measurement substrate every value.js (Band V Wave A `any()`→`dispatch()`) and parse-that
(the §1.5 expose) hand-off must pass before "done" (`parsing/_SYNTHESIS-parsing-sota KF-10`).
It is ALSO the bench KF-9/`NEW-24`'s MEASURE-FIRST gate bites against — the multi-property
keyframe compile row is where `splitPathKey`'s double-`split(".")` alloc would show above
noise (`p-parse-perf-F F-P3`). Without the shaped form, the parsing charter's "done" bar and
KF-9's measure-first disposition have no instrument — exactly the gap S1-S4 close for the
runtime/compile band.

### S5 — `proof:bench-runs` (the falsifiable close) — `F.md §F.W1`

**WHAT:** a gate wired as `proof:bench-runs` that runs `npm run bench` for the compile +
interp suites (`bench/interpolation.bench.ts`, `bench/parser.bench.ts`,
`bench/interp-buffer.bench.ts`, `bench/compile.bench.ts`) and asserts (a) exit 0 and
(b) non-empty results (a parsed throughput number per case). **RECORD** that the vitest
benches are intentionally budget-free reporters (`a-test-quality §4`: a 2× regression
prints a slower number and stays green — that is a defensible default, but it must be
stated so a future lane does not mistake green for "no regression"). The gates that
ASSERT a budget are F4/F5/F6's `proof:interp-fastprops`/`proof:sync-step`/`proof:computed-frame`,
not this one.

**WHY:** even a harness wave closes on a gate that bites (inv ε). `proof:bench-runs`
bites the exact regression this wave forbids: revert the import to the barrel → the
bench `TypeError`s → exit non-zero → the gate reds. It is the falsifiable form of "the
benches run."

---

## § Hard gate (falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES:

1. **The benches run.** `proof:bench-runs`: `npm run bench` exits 0 and produces
   non-empty results for the compile + interp suites. **BITES today:** the live
   `TypeError: CSSKeyframesAnimation is not a constructor` (`bench/interpolation.bench.ts:2`,
   `bench/parser.bench.ts:2`). Revert the import to `"../src/animation"` → the bench
   throws → exit non-zero → reds.
2. **The missing benches exist and run.** `bench/interp-buffer.bench.ts`,
   `bench/sync-step.bench.ts`, `bench/compile.bench.ts`, the `SpringProgress.tick`
   bench, and the SHAPED `bench/parser.bench.ts` (S4b: the corpus / cache-buster /
   layer-isolation shapes, `KF-10`/`NEW-40`) are present and produce non-empty results.
   BITES: a missing/empty bench → reds. (These are the harnesses F4/F5/F6 gate against —
   their absence un-gates the perf band — plus the parse-side substrate the value.js /
   parse-that hand-offs and KF-9/`NEW-24` measure against.)
3. **Isomorphic — harness-only.** No `src/animation/**` change in this wave; the import
   fix touches only the import path on the bench files. BITES: an engine edit smuggled
   into the bench fix → reds (the fix is path-only; the benches measure the SAME engine).
4. **The budget-free posture is RECORDED.** `proof:bench-runs` asserts only run-success +
   non-empty, NOT a throughput budget (the budget gates are F4/F5/F6). BITES: a claim that
   `proof:bench-runs` catches a perf regression → reds (it is a run-check, not a budget).

---

## § Folds

Retires (by finding id):
- **`C1`/`NEW-4`/`NEW-5`** — the broken benches + the missing ones (`F.md §F.W1`) —
  S1 (fix) + S2/S3/S4 (author) + S5 (gate).
- **`r-frame-compile-sota F-5`** / **`a-framecompiler-remeasure §4`** — the type-only
  barrel export breaks the compile/interp benches; fix = import from `engine` — S1.
- **`a-test-quality §4`** — the bench coverage frontier (orchestration tier + FrameCompiler
  have no bench; vitest benches are budget-free) — S4 (benches) + S5 (RECORD the posture).
- **`parsing/_SYNTHESIS-parsing-sota KF-10`** / **`NEW-40`** (the shaped parser bench — the
  parsing-charter deliverable; the existing `parser.bench.ts` is cold-only/unshaped) — S4b
  (the corpus / cache-buster / layer-isolation shapes) + S5 (runs it). This is the parse-side
  measurement substrate the value.js Wave-A / parse-that §1.5 hand-offs gate against.

**RECORD (carried so no future lane re-raises):**
- **The vitest benches are intentionally budget-free reporters** (`a-test-quality §4`) —
  a 2× regression prints a slower number and stays green. The budget-bearing gates are
  F4/F5/F6. RECORDED so green is not mistaken for "no regression."
- **`proof:lighthouse-mobile` stays browser-gated/CI-calibrated** (`a-test-quality §1`,
  `E/FINAL.md:54`) — F1 does NOT touch it; it has a legitimate CI-calibration excuse the
  three grep gates (F2's surface) do not. RECORDED to scope F1 to the compile/interp suites.

**Routed OUTWARD:**
- **The W8 S1/S2/S3 re-measure** rides F1's `bench/compile.bench.ts` but is DISPOSED in
  the Band-1 ledger (S1 RECORD, S2 BOOK, S3 BOOK — `F.md §F.W6 (the Band-1 KILL/RECORD ledger)`,
  `a-framecompiler-remeasure`). F1 ships the instrument; F4's §Folds carry the disposition.
- **KF-9/`NEW-24` (`splitPathKey` double-`split`)** rides F1's S4b shaped `parser.bench.ts`
  (the multi-property compile row) but is DISPOSED MEASURE-FIRST in the parsing surface
  (`F.md §BAND 2 parsing-surface`, ledger `NEW-24`): SHIP the `indexOf`/`lastIndexOf`
  zero-alloc form only if the bench bites above noise, else RECORD. F1 ships the instrument;
  the disposition stays with the parsing band.

---

## § Design decisions

1. **The fix is a path-correction, not a barrel change — RESOLVED.** The barrel's
   type-only export is correct (the light/heavy boundary is §ALREADY-SOTA, `proof:boundary`
   gates it). The bug is the bench reaching a runtime constructor through the type surface;
   the fix is to import from the value module `engine`, exactly as the demo does
   (`useKeyframeOps.ts:2`). Trade-off: one could "fix" it by re-exporting the value on the
   barrel — but that would BREACH the light/heavy boundary (the whole point of the
   type-only export), a §Mandate violation. The path-correction is the one-motion,
   no-legacy fix.

2. **Author the threaded-buffer bench, do not retrofit the existing one — RESOLVED.**
   `interpolation.bench.ts`'s `{}`-default shape is a legitimate microbench of the
   allocation path; F4's dict-mode deopt needs the DIFFERENT threaded-buffer shape
   (`p-runtime-perf-F §1.3`). The honest move is a NEW `bench/interp-buffer.bench.ts`
   sibling (`a-runtime-remeasure §A.1`), not mutating the existing bench's contract.
   Trade-off: two interp benches — but they measure two genuinely different shapes
   (alloc-path vs reuse-path), and the reuse-path is the realistic playback shape the
   current bench cannot see. KISS favors the minimal new file over a mutated contract.

3. **`proof:bench-runs` is a run-check, not a budget — RESOLVED.** The vitest benches are
   budget-free reporters by design (CI micro-benches are noisy, `a-test-quality §4`).
   `proof:bench-runs` asserts the benches RUN (exit 0, non-empty) — the falsifiable form of
   the unblock. The throughput BUDGETS are gated by F4/F5/F6's biting instruments
   (`proof:interp-fastprops` etc.), where the measurement is shaped to bite. Trade-off:
   `proof:bench-runs` alone does not catch a slowdown — but conflating "the benches run"
   with "the benches assert a budget" would over-claim; the two are separate gates by
   correct design.
