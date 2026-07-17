# R1-06 — Test-Suite Ruthless Critique

Lane: R1-06 (TEST-SUITE RUTHLESS CRITIQUE) · prefix TC- · date 2026-07-16

## Verdict

The suite is large (131 `*.test.ts` files, 1212 tests) and **live-green in ~6s**
(`npx vitest run`: 126 files passed / 5 skipped; 1197 passed / 1 expected-fail /
14 skipped). It is not, however, as green-as-gated as the count implies. Two
whole classes of tests — **32 of the 131 files (24%), 169 tests** — never execute
inside any CI gate: the 5 `describe.skipIf(!chromium)` browser oracles are
permanently *skipped* in `test:lib` (playwright is absent in the blocking job and
nothing ever runs them with a browser), and the entire 27-file `demo` vitest
project is *excluded* from `test:lib` and invoked by no workflow at all. Both are
green-over-broken hazards: the browser oracles were authored precisely because the
bugs they catch are invisible in jsdom, yet they run in jsdom-only mode and skip;
the demo project can rot RED forever without a gate noticing. Beyond gating, a
handful of tests are vacuous or overfit: a heap-delta probe that can never do
anything but `expect(true).toBe(true)`, a pure directory-topology gate that
protects a naming convention and will break on the colocation restructure purely
on paths, and demo composable tests whose lifecycle-teardown code never runs
because they invoke composables outside a component instance. The bulk of the
library tests, though, are real public-contract tests and sound. Full keep/merge/
prune census is at the end.

---

## TC-1 — The 5 browser-oracle files never run with a browser anywhere (permanently-skipped load-bearing gates) — P1

Mechanism-family: vacuous-green / skipped-load-bearing-gate

The five `describe.skipIf(!chromium)(…)` files:

- `test/engine/en-fix-oracle.test.ts:66`
- `test/compile/entry-roundtrip.test.ts:66`
- `test/compile/view-transition-roundtrip.test.ts:73`
- `test/orchestration/split-a11y-oracle.test.ts:136`
- `test/scroll/trigger-oracle.test.ts:142`

`chromium` is resolved via `createRequire(KF_PLAYWRIGHT_DIR ?? REPO)` requiring
`playwright-core`/`@playwright/test` (`en-fix-oracle.test.ts:31-44`). Evidence
that it resolves to `null` in the standard suite and thus every block skips:

```
$ ls node_modules/playwright-core → ABSENT
$ ls node_modules/@playwright/test → ABSENT
KF_PLAYWRIGHT_DIR=<unset>
$ npx vitest run test/engine/en-fix-oracle.test.ts
 Test Files  1 skipped (1)
      Tests  2 skipped (2)
```

These are the 5 skipped files and 14 skipped tests in the full census. The files'
own headers declare them load-bearing *because* the bug is invisible in jsdom —
`en-fix-oracle.test.ts:8-13`: "jsdom's getComputedStyle does NOT drop an invalid
`animation` shorthand, so the EN-a bug … is INVISIBLE in jsdom — precisely why
P2-2 F6 evaded every existing jsdom round-trip gate." The header claims browser CI
runs them "through `demo:correctness` under KF_PLAYWRIGHT_DIR."

That claim is false. Nothing anywhere runs these vitest files with a browser:

- The PR-blocking job runs `npm run test:lib` = `vitest run --project library`
  (`ci.yml:46`, `vitest.config.ts:42-44`). playwright is not installed in that job
  → all 5 skip.
- The nightly `demo-correctness` job installs playwright but runs
  `npm run demo:correctness` = `scripts/run-demo-roster.mjs` (`ci.yml:77`), which
  is a **standalone playwright driver, not vitest** — it never imports these
  oracle files.
- `grep -rn KF_PLAYWRIGHT_DIR scripts .github package.json` shows the variable is
  read by `capture.mjs`, `demo-driver.mjs`, `lighthouse.mjs`, etc., but **never
  assigned before a `vitest` invocation**. No script or workflow invokes
  `vitest run` with chromium present.
- `grep -rn "en-fix-oracle|entry-roundtrip|vt-roundtrip|split-a11y|trigger-oracle" scripts .github package.json` → **no matches**.

So the specific regression these gates exist to catch (a browser-invalid
`ease-out-cubic` token voiding the whole `animation` shorthand → `animation-name:
none`; the VT/entry allow-discrete round-trip; the SplitText a11y tree) has **no
executing gate** in the entire pipeline. They are decorative born-red skeletons.

Disposition — **build**: wire a CI job (or extend the nightly) that does
`npm i --no-save playwright-core && KF_PLAYWRIGHT_DIR=$PWD vitest run --project library`
so the `skipIf(!chromium)` blocks actually execute, OR fold these into
`run-demo-roster.mjs`'s driver. If neither is intended, **retire** the `skipIf`
theatre and the "browser CI runs this" comments — a gate that cannot run is worse
than an honest hole because it reads as covered.

## TC-2 — The entire `demo` vitest project (27 files / 155 tests) runs in no CI job — P1

Mechanism-family: green-over-broken / ungated-suite

`vitest.config.ts:38-56` defines two projects: `library` (`test/**/*.test.ts`
**excluding `test/demo/**`**) and `demo` (`test/demo/**/*.test.ts`). Every CI
invocation runs only the library project:

- `ci.yml:46` → `npm run test:lib` → `vitest run --project library`
  (`package.json:46`).
- `release.yml:47` → `npm run test:lib`.
- No `test:demo` script exists; `grep "project demo\|vitest run" .github package.json`
  finds only `test:lib` and the `color-fidelity` single-file bench.
- The nightly job runs `demo:correctness` (playwright roster) + `proof:publish`,
  not the demo vitest project.

Live proof the demo project is a real, currently-passing 155-test body that no
gate exercises:

```
$ npx vitest run --project demo
 Test Files  27 passed (27)
      Tests  155 passed (155)
```

These are not throwaway files — they lock demo state machines and instrument
behavior: `control-surface-dfa.test.ts` (229L), `scene-machine-reducer.test.ts`,
`no-shadow-playback-authority.test.ts`, `KfPillTabs.test.ts` (201L),
`timeline-undo.test.ts`, `transport-play-actuation.test.ts`, `sharing.test.ts`,
all the scene tests. Any of them can rot RED (a demo refactor, a composable
signature change) and **every CI gate stays green**, because the gate never loads
the file. Only a developer running bare `npm test` locally sees them.

Disposition — **build**: add `"test:demo": "vitest run --project demo"` and run it
in a CI job (it is jsdom-only and fast — 1.8s — so it can join the blocking
`gates` job or a sibling job). If the demo project is deliberately un-gated, that
decision is undocumented and contradicts the effort invested in 155 assertions;
name it explicitly.

## TC-3 — `zero-alloc.test.ts` heap-delta probe is permanently vacuous — P2

Mechanism-family: vacuous-assertion / dead-branch

`test/engine/zero-alloc.test.ts:112-131` — "heap-delta over a steady-state window
≈ 0 (when gc is exposed)":

```
const gc = (globalThis as { gc?: () => void }).gc;
if (typeof gc !== "function") {
    expect(true).toBe(true);   // line 117
    return;
}
```

`--expose-gc` is set nowhere: `grep -rn "expose-gc|exposeGc|--expose" package.json
vitest.config.ts *.json .github` → no matches, and vitest's default pool does not
expose `gc`. So `globalThis.gc` is always `undefined`, the test always early-
returns on the `expect(true).toBe(true)` tautology, and the heap-growth
assertion at line 130 (the only meaningful part) **never runs**. This is the sole
`expect(true)` in the suite; it cannot fail. The comment concedes "the
deterministic buffer-identity proof above carries the gate" — which is true, so
this probe adds nothing but a green tick.

Disposition — **prune** the heap-delta `it` (the buffer-identity arms at lines
92-110 are the real zero-alloc gate and are sound), or **build** an `--expose-gc`
node-arg into a dedicated vitest project so the branch can actually execute.

## TC-4 — `mirror.test.ts` is a directory-topology gate, not a contract test; breaks on the colocation restructure — P2

Mechanism-family: overfit-to-internals / structure-gate

`test/support/mirror.test.ts:36-63` asserts (a) every `test/` subdirectory maps to
a matching `src/animation/<zone>` directory, and (b) `_root` test files import
from `../../src/animation/<file>`. It exercises **no runtime behavior** — it reads
`readdirSync` on two trees and compares directory names. The only regression it
catches is "someone added a `test/<foo>/` dir without a matching
`src/animation/<foo>/` dir or forgot to add it to `infrastructureDirs`" — a
naming-convention violation, not a defect.

It is also directly in the blast radius of the coming colocation restructure. It
hard-codes `../..` relative roots (`mirror.test.ts:5-7`) and the `test/` ↔
`src/animation/` mirror shape; any move toward colocated tests (or even a
`src/animation` re-zoning) reds this file purely on paths while nothing about the
product changed. Note the owner's colocation edict is aspirational — the sibling
`glass-ui` repo itself still uses a top-level `tests/` tree (verified read-only:
`glass-ui/tests/**`, 0 colocated `src/*.test.ts`), so keyframes.js's separate
`test/` tree is idiomatic today; but this gate ossifies the exact directory names.

Disposition — **prune** (the mirror convention can live as a lint/docs note) or at
minimum **fold** its intent into a single non-topological check, so the restructure
does not have to fight a self-imposed structure assertion.

## TC-5 — Demo composable tests run composables outside a component instance; lifecycle teardown is untested — P2

Mechanism-family: weak-harness / untested-teardown

Multiple demo tests construct composables inside `effectScope()` rather than a
mounted component (`square-scene.test.ts:91`, `scene-facility.test.ts:71`,
`scene-contract-identity.test.ts:202`, `sequence-scene.test.ts`). `effectScope`
provides reactivity but **no current component instance**, so `onMounted` /
`onBeforeUnmount` registered inside those composables are silently dropped. The
live run emits the proof repeatedly:

```
stderr | test/demo/scenes/square-scene.test.ts > useSquareDemo construction …
[Vue warn]: onMounted is called when there is no active component instance …
[Vue warn]: onBeforeUnmount is called when there is no active component instance …
```

Consequence: the tests assert the composable's synchronous return shape but the
mount/unmount lifecycle — exactly where rAF loops, listeners, and disposal leaks
live — never executes, so those paths are uncovered. `scene-visibility-pause.test.ts:48`
shows the correct harness (`createApp(defineComponent(...))`), so the pattern is
known; the `effectScope` sites are the weak ones.

Disposition — **build** a shared `withSetup`/mount helper (or reuse the
`createApp` pattern) for composables that register lifecycle hooks, so teardown is
exercised; leave pure-function composable tests (e.g. `useSquareKeyboard` nudge
math) on the light path.

## TC-6 — `group-snapshot-identity` `it.fails` witness carries no live-behavior coverage and greens on any throw — P3

Mechanism-family: witness-gate / weak-assertion

`test/group/group-snapshot-identity.test.ts:75-102` wraps the serialize/hydrate
round-trip in `it.fails`, so it passes today *because* the seam is absent and the
call throws. `it.fails` greens on **any** throw (a typo in `makeGroup`, a JSON
error), not specifically the missing-method one, so as a regression detector it is
weak. It is partially rescued by the positive control at lines 108-115 that
asserts the seam is genuinely absent (bites if the witness goes stale). Net: this
file contributes zero coverage of shipping behavior — it is a scheduling reminder
for a value.js/engine handoff. Acceptable as a born-red witness, but it should not
be counted as behavioral coverage of `AnimationGroup`.

Disposition — **fold**: keep the positive control (it is the real bite); when the
engine ships `serialize()/hydrate()`, delete the `it.fails` wrapper per its own
instructions. No action needed this tranche beyond not double-counting it.

---

## Negatives (checked and found sound)

- **Full suite is green and fast**: `npx vitest run` → 1197 passed / 1 expected-
  fail / 14 skipped in 6.08s. No hidden failures behind the green.
- **`test/compile/adapter-capture.test.ts`** exercises real public contract
  (`CSSKeyframesAnimation.fromString` option resolution, shorthand-vs-ctor
  precedence, `resolveKeyframes` composition capture) with falsifiable assertions
  — a model contract test, would catch a regression in shorthand option merging.
- **`test/characterization/stable-surfaces.test.ts`** snapshots the *public*
  `compileToCSS` byte output (inline snapshot, not snapshot-everything) and proves
  scalar/vector `SpringProgress` trajectory equivalence to 10 digits across three
  damping regimes — real cross-implementation invariant, not a tautology.
- **`test/engine/zero-alloc.test.ts`** buffer-identity arms (lines 92-110) are a
  genuine bite: the `bite-proof` test constructs the exact regression (per-frame
  fresh object) and confirms the identity assertion reds on it. Only the gc arm is
  vacuous (TC-3).
- **view-transition trio is not duplication**: `compile/view-transition.test.ts`
  (emission surfaces + refusals), `orchestration/view-transition.test.ts` (LIGHT
  dispatch/fallback backends), `compile/view-transition-roundtrip.test.ts` (browser
  oracle) cover distinct layers; no merge warranted (roundtrip is caught by TC-1).
- **Test-mirror convention matches the glass-ui idiom** (both use a top-level
  test/tests tree, not colocated), so no colocation-migration finding beyond the
  overfit gate flagged in TC-4.

## Coverage holes (real contracts with no executing gate)

1. **The EN-a invalid-shorthand class** (browser drops an invalid `animation`
   token → `animation-name: none`) has **no gate that executes** — its only test
   (`en-fix-oracle.test.ts`) always skips (TC-1). Same for VT/entry allow-discrete
   round-trip and SplitText a11y-tree (all TC-1 files).
2. **The entire demo behavioral surface** (scene state machines, transport
   actuation, pill tabs, timeline undo, sharing) has 155 assertions that no CI job
   runs (TC-2) — effectively uncovered from the pipeline's perspective.
3. **Composable mount/unmount teardown** (rAF disposal, listener cleanup) is
   uncovered wherever tests use `effectScope` instead of a mounted instance (TC-5).

## Coverage gaps in THIS lane (not audited)

- Did not diff every library test against source to prove per-file "would catch a
  named regression" for all 104 files — sampled adapter-capture, characterization,
  zero-alloc, the oracles, mirror, group-snapshot; the remainder are asserted
  keep-by-default from title/structure, not line-audited.
- Did not measure statement/branch coverage (no coverage run) — holes named are
  gate-execution holes, not line-coverage holes.
- Did not audit the `bench/` files (out of lane) or the fixture `.css` corpus for
  staleness.

---

## Keep / merge / prune census (per file)

Legend: KEEP = real contract, retain; KEEP* = real but has a flagged defect
(see TC-n); MERGE = candidate to consolidate; PRUNE = remove or gut.

| File | Disp | Rationale |
|---|---|---|
| _root/resolve-easing.test.ts | KEEP | root-module easing resolution contract |
| characterization/stable-surfaces.test.ts | KEEP | public compileToCSS byte + spring equivalence |
| compile/adapter-capture.test.ts | KEEP | shorthand/option/composition capture contract |
| compile/agent-validate.test.ts | KEEP | agent-surface validation |
| compile/authored-values.test.ts | KEEP | authored-value preservation |
| compile/compile-deterministic.test.ts | KEEP | determinism contract |
| compile/compile-roundtrip.test.ts | KEEP | 646L core round-trip corpus (jsdom half) |
| compile/default-easing-css-twin.test.ts | KEEP | default-easing parity |
| compile/diagnostics-channel.test.ts | KEEP | refusal/diagnostic surface |
| compile/entry-roundtrip.test.ts | KEEP*/TC-1 | browser oracle — never executes |
| compile/entry.test.ts | KEEP | @starting-style/allow-discrete emit |
| compile/format.test.ts | KEEP | CSS format bytes |
| compile/frame-compiler-value4.test.ts | KEEP | value4 frame compile |
| compile/frame-compiler.test.ts | KEEP | frame compiler core |
| compile/grammar-fuzz.test.ts | KEEP | fuzz over selector grammar |
| compile/interp-slot.test.ts | KEEP | interp slot contract |
| compile/roundtrip-easing.test.ts | KEEP | easing round-trip |
| compile/roundtrip-fidelity.test.ts | KEEP | fidelity corpus |
| compile/selector-value4.test.ts | KEEP | named-selector→fraction |
| compile/serialize-from-template.test.ts | KEEP | template serialize |
| compile/structural-emit.test.ts | KEEP | structural emission |
| compile/transform-style.test.ts | KEEP | transform emit |
| compile/value4-color-emit.test.ts | KEEP | color emit |
| compile/value4-easing-contract.test.ts | KEEP | easing contract |
| compile/valuejs-contract.test.ts | KEEP | value.js boundary |
| compile/view-transition-roundtrip.test.ts | KEEP*/TC-1 | browser oracle — never executes |
| compile/view-transition.test.ts | KEEP | VT emission surfaces + refusals |
| engine/animation.test.ts | KEEP | 361L core engine contract |
| engine/boundary-cohesion.test.ts | KEEP | boundary cohesion |
| engine/c6-correctness.test.ts | KEEP | correctness suite |
| engine/color-fidelity.test.ts | KEEP | color fidelity |
| engine/composition-honored.test.ts | KEEP | composition honoring |
| engine/computed-resolution.test.ts | KEEP | getComputedValue pipeline |
| engine/en-fix-oracle.test.ts | KEEP*/TC-1 | browser oracle — never executes |
| engine/engine-correctness.test.ts | KEEP | engine correctness |
| engine/engine-modern-web.test.ts | KEEP | modern-web API surface |
| engine/equivalence.test.ts | KEEP | 417L equivalence invariants |
| engine/event-ordering.test.ts | KEEP | event order contract |
| engine/finished.test.ts | KEEP | finished promise |
| engine/interp-fastprops.test.ts | KEEP | fast-path interp |
| engine/interpolate-anything.test.ts | KEEP | generic interp + fn-arity witness |
| engine/iw0-cube-composite.test.ts | KEEP | cube composite (writes distinct transforms) |
| engine/lerparray-adopt.test.ts | KEEP | lerp array adopt |
| engine/nan-frame.test.ts | KEEP | NaN-frame guard |
| engine/performance.test.ts | KEEP | perf thresholds (verify not device-flaky) |
| engine/replay-equality.test.ts | KEEP | replay equality |
| engine/standalone-zero-alloc.test.ts | KEEP | standalone alloc |
| engine/strict-options.test.ts | KEEP | strict option validation |
| engine/w0-crashes.test.ts | KEEP | crash corpus |
| engine/zero-alloc.test.ts | KEEP*/TC-3 | buffer-identity real; gc arm vacuous |
| group/blend.test.ts | KEEP | blend math |
| group/composite-state-boundary.test.ts | KEEP | composite boundary |
| group/group-snapshot-identity.test.ts | KEEP*/TC-6 | born-red witness, no live coverage |
| group/group.test.ts | KEEP | 438L group core |
| group/normalized-weight.test.ts | KEEP | weight normalization |
| group/operator-axis.test.ts | KEEP | operator axis |
| group/spring-blend-weight.test.ts | KEEP | 413L spring blend |
| group/structural-composition.test.ts | KEEP | structural composition |
| group/waapi-lifecycle-parity.test.ts | KEEP | WAAPI parity |
| group/waapi-lowering.test.ts | KEEP | WAAPI lowering |
| ingest/adopt-compiled.test.ts | KEEP | adopt compiled |
| ingest/ingest.test.ts | KEEP | 500L ingest core |
| ingest/platform-adopt.test.ts | KEEP | 389L platform adopt |
| internal/binary-search.test.ts | KEEP | internal but tiny/stable primitive |
| internal/leaves-parity.test.ts | KEEP | leaves parity |
| internal/scheduler-posttask-probe.test.ts | KEEP | scheduler probe |
| orchestration/flip.test.ts | KEEP | FLIP |
| orchestration/orchestration-api.test.ts | KEEP | orchestration public API |
| orchestration/sequence-transport.test.ts | KEEP | 441L sequence transport |
| orchestration/sequence.test.ts | KEEP | sequence |
| orchestration/split-a11y-oracle.test.ts | KEEP*/TC-1 | browser oracle — never executes |
| orchestration/split-text.test.ts | KEEP | split text |
| orchestration/stagger.test.ts | KEEP | stagger |
| orchestration/timeline.test.ts | KEEP | timeline |
| orchestration/view-transition.test.ts | KEEP | VT dispatch/fallback |
| physics/decay.test.ts | KEEP | decay |
| physics/drag.test.ts | KEEP | drag |
| physics/morph.test.ts | KEEP | morph |
| physics/numeric.test.ts | KEEP | numeric |
| physics/oscillator.test.ts | KEEP | oscillator |
| physics/playback-bind.test.ts | KEEP | playback bind |
| physics/reducedMotion.test.ts | KEEP | PRM |
| physics/smooth.test.ts | KEEP | smoothing |
| physics/snap-symmetry.test.ts | KEEP | snap symmetry |
| physics/spring-adapter.test.ts | KEEP | spring adapter |
| physics/spring.test.ts | KEEP | 407L spring core |
| physics/springLinearStops.test.ts | KEEP | linear() stops |
| physics/springTimingFunction.test.ts | KEEP | spring timing fn |
| physics/sync-step.test.ts | KEEP | sync step |
| presets/presets.test.ts | KEEP | preset table |
| presets/spring-presets.test.ts | KEEP | spring presets |
| resolve/emerging-css-resolve-fn.test.ts | KEEP | emerging-CSS resolve |
| resolve/emerging-css-resolve-now.test.ts | KEEP | resolve-now |
| resolve/emerging-css-resolve-p2.test.ts | KEEP | 327L resolve p2 |
| resolve/value4-immutable-resolve.test.ts | KEEP | immutable resolve |
| scroll/scroll-scene.test.ts | KEEP | 497L scroll scene |
| scroll/trigger-oracle.test.ts | KEEP*/TC-1 | partial browser oracle — skipIf block never executes |
| svg/draw-svg.test.ts | KEEP | draw SVG |
| svg/morph-svg.test.ts | KEEP | 418L morph SVG |
| svg/motion-path.test.ts | KEEP | motion path |
| support/mirror.test.ts | PRUNE/TC-4 | directory-topology gate, breaks on restructure |
| support/group-probe.ts | KEEP | test helper (not a test file) |
| waapi/value4-layout-eligibility.test.ts | KEEP | layout eligibility |
| waapi/waapi-densify.test.ts | KEEP | 309L densify |
| waapi/waapi-lifecycle.test.ts | KEEP | WAAPI lifecycle |
| demo/** (27 files) | KEEP*/TC-2 | real behavior, but ungated in CI; see TC-5 for effectScope harness weakness |

Kept: 128 · Kept-with-defect (TC-1/2/3/6): browser-oracle 5, zero-alloc 1,
snapshot-witness 1, demo-project 27 · Prune: 1 (mirror.test.ts) · Merge: 0.
