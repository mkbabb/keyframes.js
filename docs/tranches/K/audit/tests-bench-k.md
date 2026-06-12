# Tranche K Audit — tests-bench-k.md

**Lane:** tests-bench-k  
**Scope:** test/ + bench/ current-state audit post-J (post-4.2.0 publish)  
**Date:** 2026-06-11  
**Branch:** tranche-j-dev @ 4f1fc4c  
**Test summary (verified):** 77 files / 754 tests (751 pass + 3 expected-fail). `npm test 2>&1 | grep "Test Files\|Tests"` → `77 passed (77)` / `751 passed | 3 expected fail (754)`.  
**Bench summary:** 8 files (`ls bench/*.bench.ts | wc -l`).

---

## §1 — The three expected-fail (`it.fails`) pins

Three `it.fails` born-RED HANDOFF pins are active. All three are **correctly GREEN** (the inner assertion fails today, so `it.fails` passes). Verified: `npx vitest run test/interpolate-anything.test.ts test/serialize-from-template.test.ts test/group-snapshot-identity.test.ts` — `3 expected fail`, 0 unexpected pass.

| Pin | File:line | Waiting on | Flip trigger |
|-----|-----------|------------|--------------|
| MCI-5 — filter `brightness` identity pad (`ValueUnit(0)` should be `1`) | `test/interpolate-anything.test.ts:256` | value.js MCI-5 (brightness identity default) | `it.fails` flips RED the moment value.js ships the fix; the co-witness at `:263` ("live `ValueUnit(0)` resolves 0") turns stale simultaneously |
| SEAM-4 — `rotate()` shorthand byte-witness (value.js expands `rotate(45deg)` → `rotateX/Y/Z`) | `test/serialize-from-template.test.ts:143` | value.js shorthand-normalization fix | Same flip pattern; delete `.fails` + the positive-control test below together |
| group-snapshot-identity — `AnimationGroup.serialize()/hydrate()` absent | `test/group-snapshot-identity.test.ts:75` | engine HANDOFF: `AnimationGroup.serialize(): GroupSnapshot` + `.hydrate(snap)` methods | Flips RED when engine ships the seam; the co-witness at `:107` ("seam is genuinely absent") goes stale simultaneously |

**Honesty check:** each pin has a paired positive-control test asserting the current broken behavior. None have been silently forgotten. The `it.fails` mechanism is correctly used — a pin without a positive-control would allow silent staleness.

---

## §2 — Pyramid shape: what belongs in the browser tier vs. unit tier

### 2a — Tests that are JSDOM but assert DOM-only behaviors (should stay JSDOM)

`test/computed-resolution.test.ts`, `test/resize-tracks.test.ts`, and `test/iw0-cube-composite.test.ts` all exercise DOM style reads under jsdom. jsdom resolves NONE of `dvh`/`cqw`/`calc(50%+10px)` — so these tests use only unitless or fixed-px values. This is correct for their stated purpose (structure/pipeline correctness), but it means the "real geometry" assertion lives exclusively in `bench/computed-real-dom.bench.ts` (the Playwright browser bench). That asymmetry is documented and accepted (`docs/published-surface.md` EP-3, G.W16 S2).

### 2b — Tests currently in the browser-gate tier that belong in unit tests

**`bench/playwright.bench.ts` and `bench/computed-real-dom.bench.ts`** are correctness gates masquerading as benchmarks: both run ONCE (`iterations: 1, warmupIterations: 0`), throw on violation, and produce no throughput output. They live in `bench/` because `npm run bench` (not `npm test`) is the trigger surface and they need a real Chromium. This is by design — jsdom cannot prove the real-DOM computed-unit path. **Finding:** the bench runner is used as a conditional-skip escape hatch rather than as a throughput tool. Both files are pure assertion gates. P2 label (structural mismatch, not broken).

### 2c — Unit tests that are browser-gate-only by construction

`test/scene-raf-leak.test.ts`, `test/scene-visibility-pause.test.ts`, `test/scene-machine-reducer.test.ts`, `test/control-surface-dfa.test.ts`, and `test/useAnimationGroupPlayback.test.ts` exercise demo-layer Vue composables. They run under jsdom (with Vue's effectScope shim), not a real browser. This is architecturally correct — the demo composables are pure-function and DOM-free enough to be proven in isolation. **No defect.**

---

## §3 — Sync-step / event-ordering test honesty post-P0

### 3a — sync-step.measure.test.ts is a CONSOLE-LOG measurement artifact in `npm test`

`test/sync-step.measure.test.ts` (J.W6 S1 FB-2) runs under the default `npm test` suite (not behind a KF_ env guard), emits `[FB-2 measure]` JSON to stdout on every run, and makes only arm-neutral structural assertions (`record.frames === 600`, `record.wallMs > 0`). The measurement is not acted on by any gate — the land decision is described as "on-device from the printed numbers per the P6 posture." The gate exists to RECORD, not to assert.

**Finding (P2):** the measure file runs in CI on every `npm test` invocation, produces always-passing assertions, and generates noisy stdout JSON that is not machine-consumed. It is a documentation artifact in the test runner. The right home is `bench/` (where `sync-step.bench.ts` already lives) or behind `process.env.KF_MEASURE === '1'` opt-in. File: `test/sync-step.measure.test.ts`, lines 1–199.

**Companion file:** `test/d3-changed-keys.measure.test.ts` has the same pattern — a `console.log` measurement artifact with a vacuously-passing assertion (`expect(fraction).toBeLessThan(0.5)`). D-3 was explicitly withheld (the finding is that the benefit is ~0). The test is a one-shot decision record, not a regression gate. Same P2 classification. File: `test/d3-changed-keys.measure.test.ts`, lines 1–64.

### 3b — event-ordering test is honest post-P0

`test/event-ordering.test.ts` (J.W6 S1) and `test/sync-step.test.ts` clause 2 both assert the `animationstart → animationiteration* → animationend` ordering correctly with a jsdom AnimationEvent polyfill. The J.W6 P0 subject-write fix (`_renderFrame` separation) did not change the dispatch ordering — both tests remain correct and non-vacuous. **No defect.**

---

## §4 — Coverage of the orchestration tier exposed by the 4.2.0 publish

The 4.2.0 publish documented `Sequence`, `stagger`, `flip`/`flipShared`, `drag`/`Draggable`, `decay`/`decayRest` as LIGHT public exports in the README (§Beyond CSS). The test coverage of these exports post-publish:

### 4a — Covered adequately

| Export | Test file | Cases | Notes |
|--------|-----------|-------|-------|
| `Sequence` | `test/sequence.test.ts` + `test/sequence-transport.test.ts` | 195 + 400 lines, dense | Transport seek/play parity, C⁰ continuity lock, yoyo/reverse/timeScale all exercised |
| `stagger` | `test/stagger.test.ts` | 14 cases | All `from` variants, ease, callable, item-count edges |
| `decay` / `decayRest` | `test/decay.test.ts` (J.W1 S5) | 12 cases | Closed-form pin, overshoot-absence, sign symmetry, fail-explicit friction guard |
| `drag` / `Draggable` | `test/drag.test.ts` | 17 cases | Follow, fling, multi-pointer guard, subscribe/detach lifecycle |
| `flip` / `flipShared` | `test/flip.test.ts` | 8 cases | FLIP identity at t=0, land at t=1, `flipShared` shared-element path |

### 4b — PATH B gap: no live-session coverage (recorded in published-surface.md §EP-3)

`flip`/`flipShared`, `drag`/`Draggable`, `DrawSVG`/`fromDrawSVG` have no demo scene and therefore no `proof:live-session` browser coverage. This is the J.W4 binding decision ("PATH B — the recorded BOOK"), documented at `docs/published-surface.md:89-94`. The jsdom unit tests are the agreed coverage level. **No new defect** — already booked.

### 4c — MISSING: no bench coverage for the orchestration tier

`Sequence`, `stagger`, `flip`, `drag`, and `decay` have **zero bench coverage**. The eight benches in `bench/` cover: `FrameCompiler` (compile.bench.ts), `RAFPlayback` loop-core (sync-step.bench.ts), `interpFrames` (interpolation.bench.ts, interp-buffer.bench.ts), `SpringProgress.tickDt` (spring-tick.bench.ts), parser throughput (parser.bench.ts), and the two Playwright browser correctness gates (playwright.bench.ts, computed-real-dom.bench.ts).

For a published library the highest-profile LIGHT exports (`stagger` + `Sequence`) ship with no throughput baseline. **Finding (P2):** if Sequence orchestration over N segments regresses in a refactor, no bench would surface it. The right addition is a `bench/sequence.bench.ts` (N-segment seek sweep + play throughput, mirroring `spring-tick.bench.ts`'s shape) and a `bench/stagger.bench.ts` (`delays(N)` sweep at the published size scales). Neither is in scope for this lane but should be booked as K-work.

---

## §5 — The cold-path test blindspot (U-K2 / U-K3 root)

### 5a — What `proof:live-session` B1 actually tests

`proof:live-session` B1 (the rainbow group-play → cube draw loop LIVE gate) seeds `isControlsPanelOpen: true` into `localStorage` via `seedControlsOpen()` on every leg, including the B1 home→cube play leg (`scripts/proof-live-session.mjs:387`). **Every single call** to `withPage`-based legs uses `seedControlsOpen`. There is no leg that tests the cold user path (fresh `localStorage`, `isControlsPanelOpen` at its default).

The default in `controlOptionsStore.ts:35` is `isControlsPanelOpen: true` and `selectedAnimation: ""`. On the cold path:
1. User loads `/` (home). `selectedAnimation = ""`, which is **falsy** in JavaScript.
2. User clicks the rainbow play button → `toggleAnimationGroup` → group is empty (`Object.keys(group.animations).length === 0`) → `syncPlayState(true)` → `onPlayStateChange(true)` → `getRunSceneSwitch()("cube")`.
3. Cube scene mounts → `bindSceneAdapter()` → `if (!controls.selectedAnimation)` → `""` is falsy → `controls.selectedAnimation = names[0]!` — auto-selection RUNS.

So the auto-binding itself is not broken by U4 for the cold path. The orchestrator's triage suspects U4 may have killed a side-effect but the code path analysis shows the `toggleAnimationGroup` (line 70-71 of `useAnimationGroupPlayback.ts`) still auto-selects when `selectedAnimation` is falsy. **The cold path may freeze for a different reason** (the `autoPlayNext` flag or the home→cube `sceneRef` swap timing), but it is definitively untested — `proof:live-session` never exercises the path without `isControlsPanelOpen=true` pre-seeded.

**Finding (P1):** `proof:live-session` has a structural blindspot: every leg calls `seedControlsOpen` before navigation. A cold-load user with default `localStorage` is never driven through the gate. The U-K2/U-K3 defects (hero rainbow-play → frozen subjects, slider advances but no animation) are described as the cold-path failure. The gate would not have caught this. The fix is a dedicated `proof:cold-start` leg (or a no-seed variant of B1) that navigates from `/` with empty `localStorage`, clicks the rainbow play, and asserts the cube subjects show ≥3 distinct transforms — the same oracle as B1 but without the localStorage seed.

### 5b — U4 conditional-select and the auto-binding side-effect

The U4 change (`TransportDock.vue:39`, `v-if="animationNames.length > 1"`) replaces the always-rendered `<Select>` with a `v-if` gate. On single-animation scenes this removes the `onSelectAnimation` emission path entirely. `onSelectAnimation` (`useAnimationGroupPlayback.ts:47-54`) calls `animationGroup.play()` if not started — this was an implicit play trigger via selection. After U4, single-animation scenes (spring, sequence, motion-path) have NO UI path that calls `onSelectAnimation`. For multi-animation scenes (cube, amiga, square) the Select is still present.

**The actual breakage risk:** the `toggleAnimationGroup` path (`useAnimationGroupPlayback.ts:56-80`) is the play trigger for cube/amiga/square. It still works and still auto-selects when `selectedAnimation` is falsy. The risk is NOT that the auto-selection is broken for the multi-animation scenes — it is that the `onSelectAnimation`-driven `play()` shortcut no longer fires as a side-effect of the Select rendering for single-animation scenes. Whether this breaks U-K3 (slider advances without animation) depends on whether those scenes relied on `onSelectAnimation` as their exclusive `play()` trigger rather than the standard `toggleAnimationGroup` path. **This is unproven by the test suite** — no unit test exercises the single-animation scene play path without `onSelectAnimation`. File seam: `test/useAnimationGroupPlayback.test.ts` tests `sliderUpdate` but does NOT test `onSelectAnimation`-as-implicit-play for single-animation scenes.

---

## §6 — Additional findings

### 6a — `test/iw0-cube-composite.test.ts` has a console.log in a passing test

`test/iw0-cube-composite.test.ts:43` emits `console.log("[iw0] distinct target transforms:", ...)` on every `npm test` run. The test was a diagnostic that became permanent. It is not a measure artifact (it has a real assertion) but it produces log noise. Minor P2.

### 6b — `test/performance.test.ts` uses wall-clock thresholds with CI headroom

`test/performance.test.ts` asserts `elapsed < 2000ms` for 10k `interpFrames` calls (smoke). The comment explicitly notes "CI runner's variance (400ms locally, 612ms on a loaded runner) — generous headroom." The threshold is 2000ms against a ~1-5ms local run. This provides almost no signal — a 400× regression would be needed to fail it. The real perf gate is `npm run bench`. P2 (vacuously weak assertion, documented intention).

### 6c — Two bench files have no driver beyond `npm run bench`

`bench/playwright.bench.ts` and `bench/computed-real-dom.bench.ts` self-skip under jsdom (the `chromium = null → warn and return` pattern). This means `npm test` does not exercise them at all. They only run under `KF_PLAYWRIGHT_DIR=… npm run bench`. `proof:computed-real-dom` in `package.json:77` (`node scripts/proof-computed-real-dom.mjs`) is the CI wrapper that drives them. The bench files themselves are secondary surfaces. **No defect** — the pattern is correct and documented.

### 6d — No Sequence/stagger/drag/decay bench exists (restatement as gap list)

For the K bench work:
- `bench/sequence.bench.ts` — N-segment `seek()` sweep + `play()` throughput (the orchestration hot path)
- `bench/stagger.bench.ts` — `delays(N)` at N=10/50/200 + eased variant
- `bench/drag.bench.ts` — `tickDt` pointer-follow loop (the gesture physics hot path, mirrors spring-tick.bench.ts)

These are P2 gaps (no regression baseline for published APIs) but not P0/P1 defects today.

---

## §FOLD

| Finding | Severity | Seam | Suggested wave-class |
|---------|----------|------|----------------------|
| `proof:live-session` never tests the cold path (no `seedControlsOpen`); U-K2/U-K3 cold-play freeze is untestable by the current gate | P1 | `scripts/proof-live-session.mjs:387` + `scripts/lib/demo-driver.mjs` | K correctness — add `proof:cold-start` leg; seed-free B1 variant |
| `onSelectAnimation`-as-implicit-play path for single-animation scenes removed by U4 (v-if="animationNames.length > 1"); no unit test covers this path | P1 | `demo/@/components/custom/animation-controls/composables/useAnimationGroupPlayback.ts:47-54` + `TransportDock.vue:39` | K correctness — add unit test for single-animation scene play path |
| `test/sync-step.measure.test.ts` and `test/d3-changed-keys.measure.test.ts` run under `npm test` (in CI), emit console.log noise, and assert vacuously (structural numbers only) | P2 | `test/sync-step.measure.test.ts`, `test/d3-changed-keys.measure.test.ts` | K hygiene — guard behind `KF_MEASURE=1` or move to bench/ |
| `bench/playwright.bench.ts` and `bench/computed-real-dom.bench.ts` are correctness assertion gates (iterations=1, time=0) housed in bench/ — structural mismatch | P2 | `bench/playwright.bench.ts`, `bench/computed-real-dom.bench.ts` | K hygiene (naming) — rename or document as correctness probes, not throughput benches |
| Zero bench coverage for the 4.2.0-published LIGHT orchestration tier (`Sequence`, `stagger`, `drag`, `decay`) | P2 | `bench/` — no sequence.bench.ts, stagger.bench.ts, drag.bench.ts | K bench wave — add throughput baselines for each |
| `test/iw0-cube-composite.test.ts:43` emits `console.log` in a passing test (diagnostic left over) | P2 | `test/iw0-cube-composite.test.ts:43` | K hygiene — remove or demote to `test.skip` comment |
| `test/performance.test.ts` wall-clock thresholds (2000ms for ~5ms operation) are vacuously weak; a 400× regression would be needed to fail | P2 | `test/performance.test.ts` | K bench — tighten thresholds or supersede with bench/ runs |
| PATH B (flip/flipShared/drag/Draggable/DrawSVG) — no live-session coverage; jsdom only | P2 (booked) | `docs/published-surface.md:89-94` | Already recorded; K demo-scene wave if a fitting scene is added |
| Three `it.fails` pins (MCI-5 brightness pad, SEAM-4 rotate() shorthand, group-snapshot-identity serialize/hydrate) are pending value.js/engine HANDOFFs | P2 (pending) | `test/interpolate-anything.test.ts:256`, `test/serialize-from-template.test.ts:143`, `test/group-snapshot-identity.test.ts:75` | Consume-leg — not K work; K should verify they do not silently flip |

---

## 10-line summary

1. **77 test files / 754 total tests, 3 `it.fails` pins.** All three pins are correctly GREEN (inner fails, `it.fails` passes); positive-control companions are in place.
2. **`proof:live-session` has a structural blindspot (P1):** every leg calls `seedControlsOpen` before navigation — the cold-user path (empty localStorage, default controls) is never driven. The U-K2/U-K3 cold-play freeze would not be caught by any gate.
3. **U4 conditional-select removes the `onSelectAnimation`-as-implicit-play path (P1):** single-animation scenes no longer render the `<Select>`, so `onSelectAnimation` (which triggers `animationGroup.play()`) is never emitted. No unit test exercises this path.
4. **Two measure tests run in `npm test` and emit console.log noise (P2):** `sync-step.measure.test.ts` and `d3-changed-keys.measure.test.ts` are decision records, not regression gates, but run on every CI invocation.
5. **Two bench files are correctness gates mis-shelved in bench/ (P2):** `playwright.bench.ts` and `computed-real-dom.bench.ts` run once, assert, and never produce throughput — structural mismatch.
6. **Zero bench coverage for `Sequence`, `stagger`, `drag`, `decay` (P2):** four published LIGHT exports have no throughput baseline; regressions in these paths would be invisible to `npm run bench`.
7. **`test/performance.test.ts` thresholds are vacuously weak (P2):** 2000ms ceiling for ~5ms operations; the real perf gate is `npm run bench`.
8. **PATH B is correctly booked (no new defect):** `flip`/`flipShared`/`drag`/`Draggable`/`DrawSVG` with no live-session scene is the J.W4 binding decision, recorded in `docs/published-surface.md`.
9. **The event-ordering and sync-step correctness gates are honest post-P0:** `test/event-ordering.test.ts` and `test/sync-step.test.ts` clauses 2-3 correctly pin the J.W6 dispatch ordering and loop-core sync conversion.
10. **Three K-bench gaps to book:** `bench/sequence.bench.ts`, `bench/stagger.bench.ts`, `bench/drag.bench.ts` — throughput baselines for the 4.2.0-published orchestration tier.

**Doc path:** `/Users/mkbabb/Programming/keyframes.js/docs/tranches/K/audit/tests-bench-k.md`
