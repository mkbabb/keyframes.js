# Lane R2-07 — The Gate/Test Prune Blueprint (keep / make-real / fold / prune, FINAL)

**Prefix:** GP- · **Date:** 2026-07-17 · **Model:** opus · **Method:** synthesis of
R1-02 (gate soundness), R1-06 (test critique), R1-12 (bench truth), R1-14/DP-03 (gate
blindspot), verified against **R2-04** (adversarial verify — ran the skipped oracles,
the demo vitest project, the GS-02 logic, and the phantom-gate set for real). Every
disposition below is anchored to a re-verified fact; I re-ran the inventory
(`package.json`, the three workflows, `scripts/**`, `bench/**`) and the drift/orphan
checks myself rather than inherit a row.

## Verdict

The apparatus is **already 90% honest** — R1-02's crown-jewel finding holds: the
merge/release spine (`check:lib`, `build:lib`, `test:lib`, `proof:publish` × 4 sub-gates,
`lint`, `release:changelog`) is real, fast, falsifiable, and it earns its keep (R2-04
independently re-ran nothing here because R1-02 already actuated all of it). The
superfluity is a **short, sharp list**, and R2-04's live runs let me collapse it to a
**MAKE-REAL set of exactly 4** — every one guarding a boundary that demonstrably bit V:
the blank-demo P0 shipped green because gates key `console.error` not `pageerror`
(DP-02/DP-03); the EN-a invalid-shorthand class that bit F6 has an oracle that R2-04
proved **green under a browser (14/14)** but which runs in no CI job; the standard
manual-dispatch deploy path bypasses the only demo-green enforcement (and DP-02 sharpens
it — dispatch would ship the blank demo with a green run); and 155 demo assertions sit
ungated on the eve of the FAM-06 demo restructure that will churn every one of them.

Everything else resolves the owner's way: **when in doubt, PRUNE.** taxonomy.json's
"budgeted" floor regime is inert *and* now wrong (23 stale rows, 0 matching the 7 live
cases) — a wrong catalog is worse than none: **PRUNE it** (fold the one shipped comment
that cites a deleted row into the doc wave). `mirror.test.ts` is a pure directory-topology
gate that will red the coming restructure on paths alone: **PRUNE**. The zero-alloc `gc`
arm is a permanent `expect(true).toBe(true)`: **PRUNE the arm** (the buffer-identity arms
are the real bite, keep them). 44 orphaned visual-lock diff PNGs, an orphaned
`group-soa-integration.mjs`, an orphaned `typed-om-validate.mjs`, two orphaned
`.measure.test.ts` files that match no runner glob, and a one-shot webkit probe: **PRUNE,
all superfluity.** `owner-golden`'s 375-line gate whose enforcing leg never runs in
automation is process weight the render-assert (MR1) covers more cheaply: **FOLD** to a
manual review harness, drop the "proof:" pretense. The `it.fails` witness and the stale
depcruise/gen-agent-surface comments are documentation folds. **No new gate farm** — the
make-real set is 4 small born-RED wires, not a process build-out.

Totals across the master table: **KEEP 49 · MAKE-REAL 4 wires (5 rows) · FOLD 6 ·
PRUNE 9** (69 rows; a few items appear as both an npm alias and their underlying
script, per the charge to cover every package script *and* every gate script).

---

## The final master table

Legend — **KEEP**: boundary-real, can fail, worth its maintenance. **MAKE-REAL**:
currently vacuous but guards a boundary that bit someone; the exact small change is named.
**FOLD**: merge into a neighbor / relabel / doc-correct (no standing new gate). **PRUNE**:
delete; superfluity. `MR#` = which make-real item. One line per item.

### Package scripts

| Item | Boundary | Can fail? | Verdict | One-line rationale |
|---|---|---|---|---|
| `prepare` (→build:lib) | npm lifecycle build | yes | KEEP | prepublish artifact build |
| `check` | whole-project + test/bench typecheck | yes | KEEP | dev-time; green ~3s (R1-02) |
| `check:lib` | src-only publishable types | yes | KEEP | CI+release gate; <1s; glass-free |
| `dev` | vite dev server | n/a | KEEP | dev instrument |
| `build` (alias build:lib) | lib artifact | yes | KEEP | alias; prerequisite for surface gates |
| `build:lib` | lib artifact | yes | KEEP | CI+release build step |
| `build:watch` | lib artifact (watch) | n/a | KEEP | dev instrument |
| `gh-pages` | demo build | yes | KEEP | consumed by nightly + deploy |
| `lint` (`depcruise src`) | source graph cycles/leaf-boundary | yes | KEEP | real; 151 mod/661 edge, 0 viol — fix stale rule-1 comment (GS-04 → FOLD) |
| `test` | both vitest projects | yes | KEEP | dev instrument (local only) |
| `test:lib` | library correctness (1042 tests) | yes | KEEP | the real merge gate; CI+release |
| **`test:demo` (NEW)** | 27 demo files / 155 assertions | yes | **MAKE-REAL (MR4)** | add script `vitest run --project demo` + one CI step (1.7s); ungated today (TC-2/AV-3) |
| `bench` (`vitest bench`) | perf instruments | n/a | KEEP | measurement, not a gate |
| `bench:color-fidelity` | color harness | yes(dev) | KEEP | wired instrument |
| `gen:agent-surface` | generate llms.txt/-full | generator | KEEP | but comment claims "cannot drift" — false, llms.txt is 70 lines drifted now (FOLD: regen + soften comment) |
| `proof:publish` (→4 sub-gates) | tarball/exports/docs/runtime boundary | yes | KEEP | crown jewel (R1-02 negatives, all actuate) |
| `proof:owner-golden` (gates/visual) | owner appearance golden | static leg only | **FOLD** | enforcing dHash leg runs in no workflow; relabel manual review harness, drop "proof:" pretense (GS-03) |
| `demo:correctness` (run-demo-roster) | 6 live demo observations | yes (nightly) | KEEP | only appearance signal; enforce on deploy via MR3 |
| `audit:lighthouse` | a11y/SEO | masked `\|\| echo` | KEEP (observe) | never fails job by construction; honest observe-only |
| `release:changelog` | semver removal→migration doc | yes | KEEP | real git surface diff; in release.yml |

### Workflows

| Item | Boundary | Can fail? | Verdict | One-line rationale |
|---|---|---|---|---|
| `ci.yml` **gates** job | library merge correctness | yes | KEEP | the real PR gate; add MR4's `test:demo` step here |
| `ci.yml` **demo-correctness** job | nightly appearance roster | yes | KEEP | non-blocking by design; host of MR1+MR2 wires |
| `deploy-pages.yml` **deploy-preflight** | CI-green + last-demo-green ancestry | **bypassed under dispatch** | **MAKE-REAL (MR3)** | both asserts guarded `if: … != 'workflow_dispatch'` → dispatch is a no-op preflight (AV-4) — exact yml fix below |
| `deploy-pages.yml` **deploy** job | build demo + ship CF Pages | yes | KEEP | real deploy; consider post-build `proof:publish` (GS-06) |
| `release.yml` | tag==version + gate surface + publish | yes | KEEP | provenance-signed publish path |

### Gate & substrate scripts

| Item | Boundary | Can fail? | Verdict | One-line rationale |
|---|---|---|---|---|
| `gates/surface/index.mjs` (proof:publish) | orchestrates the 4 sub-gates | yes | KEEP | U.D6 inline clause is nightly-only (GS-06) — accept/note, not a lie |
| `gates/surface/boundary.mjs` (741L) | source light/heavy value.js split | yes | KEEP | real; negative test enforced (R1-02) |
| `gates/surface/published-surface.mjs` (874L) | tarball==exports==dts==runtime | yes | KEEP | actuates npm-pack + built dist |
| `gates/surface/consume-bundle.mjs` | downstream dist consumer graph | yes | KEEP | complements source boundary |
| `gates/surface/readme-runs.mjs` (498L) | 20 README snippets execute + 29 asserts | yes | KEEP | executable-docs oracle |
| `gates/surface/verify-diff.mjs` | one-shot OD-U8 surface-diff | yes | KEEP | still live-referenced by published-surface `--diff` (:107); not dead |
| `gates/visual/index.mjs` (375L) | owner appearance golden | static leg only | **FOLD** | same as proof:owner-golden — relabel review harness |
| `release/changelog.mjs` | semver→migration doc | yes | KEEP | real; in release.yml |
| `gen-agent-surface.mjs` | write llms.txt/-full | generator | KEEP | `--check` only prints (no diff/exit) — not a gate; see FOLD note |
| `lib/agent-surface.mjs` | shared roster derivation | n/a | KEEP | single-source substrate |
| `lib/console-budget.mjs` | shared observe substrate | n/a | KEEP | consumed by observe scripts |
| `lib/demo-driver.mjs` | shared playwright driver | n/a | KEEP | consumed by roster/observe |
| `capture.mjs` | screenshot instrument | n/a | KEEP | measurement harness |
| `color-fidelity-harness.mjs` | color instrument | yes(dev) | KEEP | wired to bench:color-fidelity |
| `demo-roster.mjs` | roster data (6 rows) | n/a | KEEP | consumed by run-demo-roster |
| `run-demo-roster.mjs` | nightly appearance driver | yes | KEEP | the roster backbone |
| `pages-deploy.sh` | CF Pages deploy | yes | KEEP | deploy machinery |
| `probe-webkit-linear-accel.mjs` | one-shot webkit measure | n/a | **PRUNE** | self-labeled "NOT a CI gate"; orphan, no runner/reference |
| `build/vite/*.ts` (index + 5 plugins) | build behavior | build | KEEP | product build machinery, not gates |

### Observe scripts

| Item | Boundary | Can fail? | Verdict | One-line rationale |
|---|---|---|---|---|
| `observe/demo/smoke.mjs` (200L) | demo mounts + renders | yes | **MAKE-REAL (MR1)** | step-7 keys `console.error`; blank demo emits **only `pageerror`** → green over blank (DP-03) — key on `pageerror==0` per scene |
| `observe/demo/occlusion.mjs` (327L) | dock-vs-subject occlusion | yes | KEEP | live product-truth |
| `observe/demo/usability.mjs` (410L) | interaction affordances | yes | KEEP | live product-truth |
| `observe/demo/subject-animates.mjs` (341L) | subject actually animates | yes | KEEP | live product-truth |
| `observe/demo/live-session.mjs` (1612L) | full round-trip session | yes | KEEP | roster backbone |
| `observe/demo/live-session-mobile.mjs` (1202L) | mobile round-trip | yes | KEEP | roster backbone |
| `observe/lighthouse.mjs` (343L) | a11y/SEO scores | observe | KEEP | observe-only by construction |

### Test files

| Item | Boundary | Can fail? | Verdict | One-line rationale |
|---|---|---|---|---|
| library suite — 122 sound files (~1040 tests) | public contracts | yes | KEEP | R1-06 census: real contract tests, green+fast (6s) |
| 5 browser oracles (`entry-roundtrip`, `view-transition-roundtrip`, `split-a11y-oracle`, `en-fix-oracle`, `trigger-oracle`) | EN-a/VT/entry round-trip + a11y-tree | **skip in all CI** | **MAKE-REAL (MR2)** | R2-04 ran them under a browser → **14/14 green**; skip masks a green suite (guards F6-class); wire one nightly step |
| demo project — 27 files / 155 tests | demo state machines, transport, sharing | **ungated** | **MAKE-REAL (MR4)** | AV-3: 27/27 green in 1.7s, no CI job loads them; FAM-06 restructure will churn them |
| `engine/zero-alloc.test.ts` `gc` arm (:112-131) | heap-delta ≈ 0 | never (no --expose-gc) | **PRUNE the `it`** | permanent `expect(true).toBe(true)` (TC-3); keep buffer-identity arms :92-110 (real bite) |
| `support/mirror.test.ts` | test↔src dir topology | yes (on paths) | **PRUNE** | pure directory-name gate; reds the FAM-05/06 restructure on paths, no runtime behavior (TC-4) |
| `group/group-snapshot-identity.test.ts` `it.fails` wrapper (:75-102) | serialize/hydrate round-trip | greens on any throw | **FOLD** | keep positive control :108-115 (the real bite); drop `it.fails` when engine ships the seam; don't count as coverage (TC-6) |
| TC-5 `effectScope` composable tests (square/scene-facility/…) | mount/unmount teardown | partial | **FOLD** | build a shared `withSetup`/mount helper so teardown (rAF/listener disposal) actually runs — quality build in the demo-test wave |

### Bench artifacts

| Item | Boundary | Can fail? | Verdict | One-line rationale |
|---|---|---|---|---|
| `taxonomy.json` | bench→category + "budgeted" floors | **no consumer** | **PRUNE** | inert (no gate/script/test reads it) AND wrong: 23 interp-buffer rows, **0 match** the 7 live cases (PF-1/PF-2); a wrong catalog is worse than none |
| `interp-buffer.bench.ts` (91L, 7 cases) | interp hot-path perf | n/a | KEEP | runs; the 7 live cases are current |
| 11 `*.bench.ts` (compile, cold-import, computed-real-dom, group-composite, interpolation, parser, playwright, resolve, spring-tick, sync-step, waapi-densify) | perf instruments | n/a | KEEP | run via `vitest bench` glob; typecheck clean (PF negatives) |
| `computed-scene.html`, `loaf-scene.html` | browser-bench scene fixtures | n/a | KEEP | loaded by computed-real-dom + playwright benches |
| `group-soa-integration.mjs` | isolated-blend share measure | n/a | **PRUNE** | orphan; no runner; one-shot spike, compositor SoA decision sealed (PF-5) |
| `typed-om-validate.mjs` | typed-OM validation spike | n/a | **PRUNE** | orphan; no runner or reference |
| `d3-changed-keys.measure.test.ts` | changed-keys measure | never | **PRUNE** | matches neither `bench/*.bench.ts` nor `test/**` glob → no runner |
| `sync-step.measure.test.ts` | sync-step measure | never | **PRUNE** | same: orphan `.measure.test.ts`, no runner |

### Standing artifacts / comments

| Item | Boundary | Verdict | One-line rationale |
|---|---|---|---|
| `scripts/baselines/visual-lock/_diff/` (44 PNGs) | (dead) | **PRUNE** | retired gate's orphaned diff outputs; 0 references (GS-05) |
| `.dependency-cruiser.cjs` rule-1 comment (~:119-128) | (doc) | **FOLD** | describes a `known-violations` baseline file that does not exist; state true post-R.W1 invariant (GS-04) |
| `interpolate.ts:257-259` ADOPT-provenance comment | (doc) | **FOLD** | cites the deleted `budgeted K=8 SoA-lerpArray` taxonomy row; repoint to a surviving artifact (PF-3) → doc wave |

---

## The 4 MAKE-REAL wires (born-RED; exact minimal changes)

Each protects a boundary with R1/R2 evidence of an actual bite. No new gate infrastructure —
each is a one-step wire into a job that already exists.

### MR1 — `pageerror`-key the render-assert (the blank-demo P0)
**Boundary that bit:** V's transaction renders **blank on all 7 routes** (DP-01/DP-02),
yet R1-14 first reported **0 console errors** — the crash is a Vue `pageerror`, not a
`console.error` (DP-03). A console-keyed smoke/observe gate greens over the blank app.
**Change:** in `scripts/observe/demo/smoke.mjs`, add a `page.on("pageerror", …)` collector
and assert `pageerrors.length === 0` **per scene** alongside the existing step-5
render-shape assert (`#app` non-trivial children + hero text). R2-04 further shows 5/7
scenes throw a masked `timingFunction` pageerror even once render is restored
(AV-DP02-DELTA) — the per-scene `pageerror==0` assert catches both the blank and that
class. Born RED against today's tree until DP-02 is fixed.

### MR2 — run the 5 browser oracles where a browser exists
**Boundary that bit:** the EN-a invalid-`animation`-shorthand class (`ease-out-cubic`
token → `animation-name: none`) that evaded every jsdom gate as F6; the oracle exists for
exactly this and **skips in every CI job** (GS-01/TC-1). R2-04 proved all five pass
**14/14 under a real browser** — the skip hides a *green* suite, so wiring it is pure
signal-add, no red-chasing.
**Change:** in `ci.yml`'s **demo-correctness** job (which already installs chromium), add
one step after `install chromium`:
`KF_PLAYWRIGHT_DIR=$PWD npx vitest run --project library test/compile/entry-roundtrip.test.ts test/compile/view-transition-roundtrip.test.ts test/orchestration/split-a11y-oracle.test.ts test/engine/en-fix-oracle.test.ts test/scroll/trigger-oracle.test.ts`
(the bundled-chromium revision mismatch R2-04 hit is a cache artifact of the audit copy;
CI's fresh `playwright install --with-deps chromium` provides the pinned revision).

### MR3 — enforce demo-green ancestry on the standard (dispatch) deploy path
**Boundary that bit:** MEMORY records manual `workflow_dispatch` as the *standard* deploy
("bypasses the flaky Linux demo-gate"), and AV-4 confirms both preflight asserts are
guarded `if: github.event_name != 'workflow_dispatch'` → dispatch preflight is a no-op
that always succeeds. DP-02 sharpens it: the demo *builds* fine but *renders blank*, so a
dispatch deploy ships the blank demo green.
**Exact minimal `deploy-pages.yml` change** — add an explicit break-glass input and gate
the two asserts on it:
```yaml
on:
    workflow_run:
        workflows: ["ci"]
        types: [completed]
    workflow_dispatch:
        inputs:
            require_demo_green:
                description: "Enforce last-demo-green ancestry (uncheck ONLY for genuine break-glass)"
                type: boolean
                default: true
```
then change **both** guard lines (the `assert library CI conclusion` step and the
`assert last-demo-green is an ancestor` step) from
`if: github.event_name != 'workflow_dispatch'`
to
`if: github.event_name != 'workflow_dispatch' || inputs.require_demo_green`.
Result: a normal dispatch (default `true`) now enforces ancestry; the flaky-roster escape
is an explicit, logged `require_demo_green=false` — the guarantee the header comment
already claims becomes real, and the escape hatch is honest.

### MR4 — wire the demo vitest project into CI
**Boundary that bit / will bite:** 155 demo assertions (control-surface DFA, transport
actuation, pill tabs, timeline undo, sharing) run in **no CI job** (TC-2/AV-3, 27/27 green
in 1.7s), on the eve of the FAM-06 demo restructure (R2-06) that moves/renames the very
files they cover — silent RED rot is near-certain.
**Change:** add `"test:demo": "vitest run --project demo"` to `package.json`, and one step
in `ci.yml`'s **gates** job after `correctness suite`: `- run: npm run test:demo`
(jsdom-only, 1.7s — it does not need a browser and does not slow the merge gate materially).

---

## Explicit decisions the charge names

- **taxonomy.json floors (PF-2): RETIRE (PRUNE the file).** No consumer, and the
  "budgeted/floorFraction/must-run" language points at 23 deleted/renamed rows. Deleting
  the file removes a wrong catalog and the vacuous-floor pretense in one move; fold the
  `interpolate.ts:259` provenance comment (PF-3) and the 4 bench-file mentions into the
  doc-correction wave. Building a `verify-taxonomy.mjs` gate is exactly the "contrived
  gate/process" the owner says to avoid — declined.
- **mirror.test.ts (TC-4): PRUNE.** Directory-topology gate; the coming restructure would
  fight it on paths for zero product signal. The mirror convention survives as a docs note.
- **zero-alloc gc arm (TC-3): PRUNE the arm.** Permanent tautology; buffer-identity arms
  (:92-110) are the real, verified bite — keep those.
- **it.fails witness (TC-6): FOLD.** Keep the positive control (real bite); drop the
  `it.fails` wrapper when the engine ships `serialize()/hydrate()`; never count it as
  behavioral coverage. No action this tranche beyond not double-counting.
- **visual-lock PNGs (GS-05): PRUNE** `scripts/baselines/visual-lock/` (44 orphan diffs).
- **owner-golden wiring (GS-03): FOLD** — relabel `gates/visual/index.mjs` a manual review
  harness (keep `--capture-candidates`), drop the `proof:` gate pretense. Its enforcing
  dHash leg needs browser+built-demo and runs in no workflow; MR1's per-scene render-assert
  covers the "blank ships green" boundary at a fraction of the maintenance (no re-blessing).
  If the formation later wants an automated *perceptual* nightly signal, adding
  `node scripts/gates/visual/index.mjs` after the roster in demo-correctness is a one-liner
  (the job already builds gh-pages + installs chromium) — offered, not required.
- **U.D6 clause (GS-06): FOLD/accept.** Inert on merge/release by the library/demo split,
  and honestly documented as such in-source — not a lie. Optionally have the deploy job run
  `proof:publish` post-build so the shipped bundle is shape-checked on the deploy path.
- **deploy ancestry under dispatch (GS-02): MAKE-REAL (MR3)** — exact yml change above.

---

## Negatives (checked, found sound — do NOT touch)

- **The proof:publish spine is a crown jewel** — boundary.mjs / published-surface.mjs /
  consume-bundle.mjs / readme-runs.mjs all actuate real artifacts with sanity floors
  (R1-02 negatives, re-affirmed). No prune, no fold.
- **The 122-file library suite is real contract testing** — green + fast; R1-06 sampled
  adapter-capture/characterization/zero-alloc(buffer arms)/oracles and found them
  falsifiable. Bulk KEEP.
- **release.yml + release:changelog** are real (tag==version, git surface diff caught
  `getTimingFunction` removal → migration doc). KEEP.
- **The 11 live `*.bench.ts` suites + 2 html fixtures typecheck and run** against the
  Value-4 tree (PF negatives). Only taxonomy.json and the 4 orphan artifacts are cruft.
- **Non-dispatch deploys cannot skip the ancestry gate** (AV-4) — MR3 touches only the
  dispatch path; the `workflow_run` path already enforces it.
- **verify-diff.mjs is NOT dead** — it is live-referenced by published-surface's `--diff`
  mode (:107); keep despite its "one-shot" self-description.

## Coverage gaps (this lane)

- **I did not line-audit all 131 test files** — the 122-file library bulk is KEEP-by-census
  (R1-06), not per-file re-proven here; the 9 itemized exceptions are the decided set.
- **MR2 chromium-revision parity**: R2-04 ran the oracles under system Chrome (channel), not
  the pinned playwright chromium; the CI target is the revision-exact `playwright install`.
  Whether the pinned revision launches clean on the Linux runner is unverified from here
  (the device-dependence history, MEMORY, is the risk).
- **MR1/MR3 are proposals, not applied** — per audit rules I made no source/workflow/config
  edits in the real repo. The exact diffs are specified above for the V build wave.
- **llms.txt drift** is real now (70 lines, verified) but classed FOLD not MAKE-REAL: a P3
  doc concern that bit no one; `gen-agent-surface --check` prints without diffing/exiting, so
  a true gate would be a code change I judged below the make-real bar. Regenerate in the doc
  wave and soften the "cannot drift" comment; an enforcing `--check` is an optional cheap
  follow-on, not part of the 4.
