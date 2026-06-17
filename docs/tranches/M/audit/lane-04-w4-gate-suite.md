# Lane 04 — L.W4 Gate-suite transposition audit (Tranche M seed)

**Lane:** 04 · **Scope:** L.W4 (commit `f94fa7a`) + the structural roots W4 addressed vs
the roots it did NOT address (the serial O(N²) / per-gate browser root, named in the
VERDICT doc as the headline finding).
**Status:** ANALYSIS ONLY. No gate changed, no code written, no `proof:all` re-run.
All counts are verified against the current tree; all structural claims cite `file:line`.
**Date:** 2026-06-17 · **Tree:** `tranche-l-dev` tip `529fcfd`

---

## 1. What W4 actually delivered (ground truth)

W4 (`f94fa7a`, "the gate-suite transposition + publish-path hardening — device-honesty
terminal") shipped exactly eight S-clauses. Verified by reading the commit diff and the
final tree:

### S1 — report-all posture (ci.yml demo-smoke job)

**Delivered.** `.github/workflows/ci.yml` demo-smoke job now carries `continue-on-error: true`
on every `proof:*` step (verified: `ci.yml:357,365,375,383,399,401,407,413,...` — the grep for
`continue-on-error` returns ~60+ hits in the demo-smoke job). A terminal `check-failures` step
(`ci.yml:1577-1673`) reads every step's `${{ steps.<id>.outcome }}` and `exit 1` if any is
`"failure"` (`ci.yml:1666-1672`). The `gates` library job is correctly unchanged (fail-fast by
design; a library gate failure is a hard correctness miss).

The born-RED anchor was the pre-L ci.yml demo-smoke serial step chain; the green is the
current file.

### S2 — `waitForRender` settle primitive + `openControlsPanel` transposition

**Delivered.** `scripts/lib/demo-driver.mjs` exports a new `waitForRender(page, predicate,
{ timeout = 8000, arg })` function (`demo-driver.mjs:691-724`). The function wraps
`page.waitForFunction(predicate, arg, { timeout }).catch(() => undefined)` — returns the
instant the predicate holds, ceiling `timeout` ms, never a fixed sleep. No other
`waitForTimeout` call remains in `openControlsPanel` (`demo-driver.mjs:573-687`): the four
original sleeps (500/800/600/800 ms) are replaced by three `waitForRender` calls.

`proof:settle-is-predicate` (`scripts/proof-settle-is-predicate.mjs`) is the born-RED gate:
it brace-matches the `openControlsPanel` body and asserts ZERO `.waitForTimeout(` calls. It is
wired into `proof:hygiene` (`package.json:190`) and runs in the `gates` CI job.

**The gate's scope is deliberately narrow**: it asserts only `openControlsPanel`, the
load-bearing shared helper every layout-probing gate calls. The 271 remaining
`waitForTimeout` calls spread across `scripts/proof-*.mjs` (verified: `grep -c
"waitForTimeout" scripts/*.mjs | awk ... TOTAL: 271`) are NOT within `proof:settle-is-predicate`'s
scope. `proof:live-session.mjs` alone contains 40 `waitForTimeout` calls; it received zero
transposition in W4.

### S3 — Linux-container local-repro (Makefile ci-linux)

**Delivered.** `Makefile` at repo root defines a `ci-linux` target (`Makefile:36-43`) that
runs `docker run --rm -v "$(CURDIR)":/workspace -w /workspace -e KF_REQUIRE_BROWSER=1
$(CI_IMAGE) bash -lc '$(CI_LINUX_CMD)'`. The `CI_IMAGE` defaults to `node:24-slim` (the
same base GHA ubuntu-latest Node 24 uses). The command inside installs npm deps, installs
Playwright chromium + system deps, builds the demo, then runs `KF_REQUIRE_BROWSER=1 npm run
proof:all:demo`.

`README.md` gains a "Local CI repro" sentence (`README.md:` the `make ci-linux` entry).
`proof:ci-coverage` gains a Makefile-existence clause asserting `ci-linux:` target is present
(file-existence check, not a Docker execution — CI never runs Docker-in-Docker).

### S4 — gate-taxonomy CATEGORY + Architectural cure columns

**Delivered.** `docs/tranches/J/gate-taxonomy.md` now has five columns (Gate, Posture,
Category, Architectural cure, Reason). Six `observe-only` rows carry their categories:
`wall-clock` (perf-frame-budget, scene-transition-perf, lighthouse-mobile), `pixel-render`
(visual-lock), `physics-settle` (drawer-spring), `touch-emulation` (live-session-mobile M2,
added in S6). The Category + Architectural cure columns are machine-asserted by
`proof:ci-coverage` clause 4 extension (`scripts/proof-ci-coverage.mjs:48,517-594`).

### S5 — `proof:no-single-option-select`

**Delivered.** `scripts/proof-no-single-option-select.mjs` (220 lines) is a STATIC gate
(no browser, no vitest) that reads the demo Vue SFC source tree and asserts:
- `TransportDock.vue`: the animation select is rendered under `v-if="animationNames.length > 1"`.
- `ChromeDock.vue`: the control-tab select is rendered under `v-if="multipleControlTabs"` where
  `multipleControlTabs` is a computed gated on `allControlTabs.value.length > 1`.

Wired into `package.json` (`proof:no-single-option-select`) and into the `proof:hygiene`
chain before `proof:demo-smoke` (`package.json:190`). Runs in the `gates` job (no glass-ui,
no browser). `FINAL.md:109` records the observed oracle: `exit 0`.

### S6 — M2 touch-commit characterization

**Delivered as a documentation + taxonomy record.** `proof-live-session-mobile.mjs` gains a
17-line comment block documenting the Playwright `hasTouch` context limitation:
`touchscreen.tap()` dispatches only Touch-API events (no `pointerdown`/`pointerup`); reka's
`onPointerup` never fires, so the `.click()` (pointerdown→pointerup→click) is the faithful
reka commit path. A new `observe-only` row for `proof:live-session-mobile (M2)` appears in
`gate-taxonomy.md` with Category `touch-emulation` and the CDP-level cure.

No code change to the M2 commit path (`.click()` remains the strategy); the gate passes
green for the right reason — the commit strategy IS the faithful path.

### S7 — release.yml publish-path roster

**Delivered.** `release.yml` now runs `proof:published-surface` and `proof:deps-current`
before `npm publish` (`release.yml:68-71`). `proof:ci-coverage` clause 5
(`proof-ci-coverage.mjs:600-649`) asserts BOTH appear in `release.yml` before the
`npm publish` line. The `proof:peer-satisfied` F-2 tripwire also rides `release.yml` with
`continue-on-error: true` (`release.yml:79-81`).

### S8 — `proof:peer-satisfied` (born-RED-by-design F-2 tripwire)

**Delivered, RED by design.** `scripts/proof-peer-satisfied.mjs` (197 lines) reads
`node_modules/@mkbabb/glass-ui/package.json` (if present; if absent it exits 0 — the
library gates job has no glass-ui installed). For each `@mkbabb/*` peer declared by
glass-ui, it resolves the installed version and checks `semver.satisfies`. Today glass-ui
4.0.0 declares `"@mkbabb/value.js": "^0.10.0 || ^0.11.0"` while kf has value.js 0.13.0
installed → `ELSPROBLEMS` → `exit 1`. `FINAL.md:112-119` records the observed oracle:
`exit 1` by design. The gate rides the report-all CI demo-smoke lane (`continue-on-error:
true`), never the blocking `proof:hygiene` chain. `proof:peer-satisfied` is intentionally
ABSENT from `proof:all` — it is a born-RED live-defect tripwire, not a passing precondition.

---

## 2. What W4 explicitly DID NOT address (the VERDICT's headline finding)

The gate-apparatus VERDICT doc (`docs/tranches/L/audit/gate-apparatus-VERDICT.md`) was
authored alongside L.W4's implementation as the companion Tranche-M charter seed. Its
headline finding, which W4 does NOT cure:

> **The apparatus is a second, hand-rolled test runner.** 67 gate scripts import
> `demo-driver.mjs` and hand-roll chromium launch, a `node:http` server, retry, fixtures,
> and per-script `failures[]`/`process.exit(1)` reporting, **run as a pure serial `&&` shell
> chain** (124 `&&`, 0 `;`, 0 `||`) of ~142 separate `npm run` processes, **each
> cold-booting its own chromium + server with zero warm reuse**, **sleeping through 264
> `waitForTimeout` settle windows** across an 8-scene sweep.

The three structural roots the VERDICT names and W4 does NOT fix:

### Root 1 — Serial `&&` chain (the O(N²) iterate-to-green loop)

`proof:hygiene` = 124 `&&`, zero `;`, zero `||`. `proof:all` = `proof:correctness &&
proof:hygiene`. No parallel runner in `package.json` (verified: no
`concurrently|npm-run-all|run-p|turbo|xargs -P` anywhere). W4 adds `proof:no-single-option-select`
and `proof:settle-is-predicate` as two more `&&` links in the `proof:hygiene` chain
(`package.json:190`) — making the chain 126 `&&`, not shorter.

The O(N²) consequence: a red at position k re-pays every prior green on restart. The
VERDICT's quantification (`gate-apparatus-A-taxonomy.md §3`): ~5–6 reds × ~30-min
full-prefix re-run = ~2.5–3 hours. W4 is additive, not curative, here.

**W4's S1 report-all fix addresses THIS for CI (demo-smoke job) only.** Locally, the
developer running `npm run proof:all` still pays the serial `&&` O(N²) iterate tax. The
CI demo-smoke job now runs all gates and reports all failures at once; the local
`proof:hygiene` chain remains fail-fast serial.

### Root 2 — Per-gate cold browser + server (zero warm reuse)

`scripts/lib/demo-driver.mjs` `withBrowser` (line 432) cold-launches chromium on every
call; `withPage` (line 513) spawns a fresh `node:http` static server (`server.listen(0)`,
line 340) and tears both down in `finally` (lines 539-544). No `connectOverCDP`,
`wsEndpoint`, `launchServer`, or `reuseExisting` in the file (verified: grep returns 0).

W4 adds `waitForRender` but does NOT add a persistent browser, a shared server, or any
warm-reuse mechanism. Every gate process (128 total, 67 importing demo-driver) still cold-boots
its own chromium + server. The VERDICT's per-gate overhead measurement (`gate-apparatus-A-taxonomy.md
§4`): 72 browser gate-invocations → ~80+ chromium launches + ~80+ server bind/teardown cycles
per `proof:all`. W4 is unchanged here.

### Root 3 — 271 remaining `waitForTimeout` calls in proof scripts

W4's S2 scope is `openControlsPanel` in `demo-driver.mjs` only. The remaining 271
`waitForTimeout` calls across `scripts/proof-*.mjs` are untouched (verified: the post-W4
tree has TOTAL: 271 across gate scripts; `proof:live-session.mjs` alone has 40). The
`proof:settle-is-predicate` gate does not extend to these callers — its scope is exactly
`openControlsPanel`. The macOS-pass/Linux-fail render-race class persists in the 40 heavy
settle windows of `proof:live-session.mjs` and across the broader gate corpus.

---

## 3. The CATEGORY taxonomy — verified as delivered

The five-column `gate-taxonomy.md` is machine-checked. Verified claim counts:

| Category | Gates |
|---|---|
| `wall-clock` | `proof:perf-frame-budget`, `proof:scene-transition-perf`, `proof:lighthouse-mobile` |
| `pixel-render` | `proof:visual-lock` |
| `physics-settle` | `proof:drawer-spring` |
| `touch-emulation` | `proof:live-session-mobile (M2)` (added in S6) |

`proof:ci-coverage` clause 4 extension (`proof-ci-coverage.mjs:517-594`) reads the
`gate-taxonomy.md` table and asserts every `observe-only` row has a non-empty Category AND
non-empty Architectural cure value. Gate `proof:ci-coverage` is in `proof:hygiene`
(`package.json:190`), so this is machine-asserted on every full run.

The `observe-only` count is now 9 total (8 table rows + the M2 touchscreen row added in S6
= 9 declarations), matching the VERDICT doc's evidence index claim
(`gate-apparatus-VERDICT.md:338`: "9 `declarePosture("observe-only")` declarations").

---

## 4. Precept findings

### P1 — The settle transposition is PARTIAL, not full

W4 transposes `openControlsPanel` (4 sleeps removed) but leaves 271 `waitForTimeout` calls
in the gate scripts untouched. `proof:settle-is-predicate` enforces only the
`openControlsPanel` function body. A full inv-L-device-honesty compliance would require
every `waitForTimeout(N)` in a gate script to be either a `waitForRender` predicate or an
explicitly justified `observe-only` entry. The partial transposition is honest — the W4
spec (`L.W4.md:131`) scoped S2 to `openControlsPanel` explicitly — but it is not a cure
for the full class. The 40 `waitForTimeout` calls in `proof:live-session.mjs` remain
unaddressed.

This is NOT a precept violation in W4 (the wave spec was precise about scope). It is a
deferred structural obligation for M.

### P2 — The serial `&&` local chain is a LEGACY architecture persisting through W4

The 124 `&&` (now 126 with W4's additions) serial chain is contrived: nothing blocks
parallelism (ports are `listen(0)`, posture is stateless, dist is read-only — verified in
`gate-apparatus-B-contrivance.md §Q3`). The chain is a shell `&&` string, not a constraint.
CI already shards the browser gates into a parallel GHA matrix. The local developer pays a
serial tax CI does not.

W4's additions make the chain longer, not shorter. This is the archetypal "legacy code"
precept violation the charter defines: an architectural choice from the repo's growth history
that is no longer justified but was not retired.

### P3 — The two-harness split persists

128 bespoke `node` gate scripts coexist with vitest 4.1.8's first-class test infrastructure.
The browser gates hand-roll: chromium launch, 3-attempt retry (`demo-driver.mjs:450-495`),
`node:http` server (`demo-driver.mjs:340`), `newContext`/`newPage`/teardown lifecycle
(`demo-driver.mjs:432-548`), per-script `failures[]`/`process.exit(1)` reporter (copy-declared
in ~69 scripts). `@vitest/browser` is absent from the repo (verified: no
`@vitest/browser` in `package.json` or `node_modules`). This is the "NO quick solution /
workaround" precept pressure point: the bespoke runner is a workaround for the absence of a
first-class test runner over the built dist.

The VERDICT doc is explicit: this is the M-charter consolidation target, not a W4 defect.
W4 is the terminal device-honesty pass for L; M is where the consolidation lands.

---

## 5. What M owes the gate suite (the M-wave proposals)

### M-WAVE-A — Parallel report-all local runner (kill the O(N²) loop)

**Rationale.** The serial `&&` chain is the single highest-payoff, lowest-risk contrivance.
Nothing blocks parallelism (verified: ports `listen(0)`, posture stateless, dist read-only).
Replace the `proof:hygiene` `&&` chain with a concurrent runner (`npm-run-all -p` or
`concurrently`) that runs all gates, collects ALL reds, reports once. This converts the
"3 hours iterate-to-green" into "one ~15-min run that lists every red" — the O(N²) → O(1)
step. This is a `package.json` edit (the runner mechanics) plus a `scripts/check-all-outcomes.sh`
aggregate-exit script. Lowest-risk: the gate scripts' internal logic is unchanged; only the
scheduling changes.

**Constraint.** `proof:correctness` gates are already logically ordered (a library gate
failure should not be obscured by a browser gate that depends on the library being correct).
A two-pass approach: (1) the `gates` job gates run first (serial or fast-parallel); (2)
`demo-smoke` runs in parallel. This is the CI split already in place; the local chain can
mirror it.

**Gate bite.** A new `proof:ci-coverage` clause asserting the `proof:hygiene` chain
invokes ALL leaf gates — today it is a `&&` string; under parallel scheduling it should
become a manifest that a scheduler reads. The clause asserts every `proof:*` in
`package.json` is reachable from the local run.

### M-WAVE-B — `waitForRender` propagation to the heavy gate corpus

**Rationale.** `proof:live-session.mjs` has 40 `waitForTimeout` calls (the 81s gate, the
dominant wall-clock contributor). `proof:live-session-mobile.mjs` has 13. The aggregate
TOTAL of 271 calls across gate scripts is the surviving render-race surface.

W4's `waitForRender` primitive is already in `demo-driver.mjs`. M transposes the heavy
callers gate-by-gate, priority-ordered by `waitForTimeout` count × per-gate wall-clock:

1. `proof:live-session.mjs` (40 sleeps, ~81s) — the single highest-payoff target.
2. `proof:live-session-mobile.mjs` (13 sleeps, ~40s est).
3. `proof:scene-machine-irrefragable.mjs` (27 sleeps), `proof:fsm-suspend-resume-live.mjs`
   (20 sleeps).

**Extend `proof:settle-is-predicate`** in M to cover not just `openControlsPanel` but the
full gate scripts: assert ZERO `waitForTimeout` calls in the listed heavy-gate functions
(those that constitute the CI wall-clock body — the top-5 by count). The gate still runs
STATIC (no browser), adds zero demo-smoke wall-clock.

**Constraint.** Some `waitForTimeout` calls are physics-settle (rAF-loop sampling, frame
timing) and are LEGITIMATELY in the `observe-only` class — they cannot be replaced by DOM
predicates. These must be declared `observe-only` with a `wall-clock` Category rather than
deleted. The extended `proof:settle-is-predicate` must distinguish the two classes (declared
vs undeclared sleeps).

### M-WAVE-C — Test-infrastructure consolidation: the three-tier vitest architecture

**Rationale.** This is the VERDICT doc's headline recommendation:
`gate-apparatus-VERDICT.md §2`. The M consolidation is a phased migration:

**Phase 1 (LINT tier):** ESLint custom rules replacing ~33 source-shape gate scripts.
`proof:demo-no-oversize`, `proof:decomposition` clause-1, `proof:single-writer`,
`proof:no-brittle-selector`, `proof:no-single-option-select`, `proof:styling-idioms`,
`proof:no-deprecated-guard` → `eslint .` custom rules. ONE `dependency-cruiser` graph
replacing `proof:boundary`'s 405-line hand-rolled graph walk. Payoff: ~33 processes
(each paying ~0.18s fork + tree-read) → one sub-second parse-once pass.

**Phase 2 (UNIT tier consolidation):** Fold the 18 `node proof-x.mjs && vitest run
test/x.test.ts` pairs into single test files. The grep-half becomes a LINT rule or unit
assertion; the vitest half is already a test.

**Phase 3 (INTEGRATION/BROWSER tier):** Add `@vitest/browser` + playwright provider
(currently absent — install needed). A `globalSetup` dist server (ONE server, shared by all
browser tests, replacing ~80+ per-gate `serveDist` binds). Browser tests navigate the
**built dist** via `page.goto(distURL)` — preserving the `proof:gate-is-runtime` precept
(the shipped bytes, not Vite-transformed source). The cold-boot lifecycle
(`demo-driver.mjs:432-548`) retires; `withPage`/`withBrowser` delete; the
`failures[]`/`process.exit(1)` boilerplate (~69 scripts) deletes; parallelism is the
runner's default.

**Non-negotiable constraints (inv ε on the migration):**
1. Every browser test `page.goto`-s the SERVED BUILT DIST — never a component mount over
   Vite-transformed source. The `proof:gate-is-runtime` precept is unchanged; only its
   plumbing changes.
2. The `boundary`/`published-surface` import-graph checks stay as LINT-tier graph rules
   (dependency-cruiser or one parsed-once graph), never subsumed by jsdom unit tests.
3. The `observe-only` posture manifest (`gate-taxonomy.md`) carries over as test tags
   (`test.skipIf(IN_CI)`) with the same machine-checked Category + Architectural cure
   discipline.
4. Device-dependence thresholds re-validated against the new timing envelope before any
   observe-only gate transitions to hard.

**Expected outcome:** serial `&&` chain (O(N²)) → parallel vitest workers (O(1));
~80+ cold chromium boots → 1 shared; ~15–31 min single-pass → single-digit minutes.

**Phase 4 (retire):** Delete the serial `&&` chain; `npm run proof:all` becomes
`vitest run` across four projects.

### M-WAVE-D — `proof:peer-satisfied` GREEN (the F-2 consume-edge close)

**Rationale.** `proof:peer-satisfied` is born-RED by design as of W4. It greens ONLY when:
(a) glass-ui BB publishes a widened peer range (`"@mkbabb/value.js": ">=0.13.0"` or
equivalent), AND (b) kf re-pins to that glass-ui version. This is L.W9's Band-B
consume-edge, tracked as a cross-repo-ask (`KF-TO-GLASSUI-BB-ASKS.md`).

M's obligation: on the glass-ui BB publish, (a) update `package.json` glass-ui pin,
(b) run `npm install`, (c) verify `proof:peer-satisfied` exits 0. The gate then moves
from the `report-all` `continue-on-error` lane to `proof:hygiene` (it becomes a hard
gate: a device-INDEPENDENT version-number fact).

---

## 6. Deferred folds from W4

The following items were explicitly deferred by L.W4 and are M's inheritance:

| Item | Source | M owner |
|---|---|---|
| 271 remaining `waitForTimeout` calls outside `openControlsPanel` | `L.W4.md:131` (S2 scope = `openControlsPanel` only); `scripts/*.mjs` TOTAL:271 | M-WAVE-B |
| The serial `&&` local chain (O(N²) iterate) | `gate-apparatus-VERDICT.md §3`; `package.json:190` proof:hygiene = 124 `&&` | M-WAVE-A |
| Two-harness split (128 bespoke scripts + vitest) | `gate-apparatus-VERDICT.md §1` | M-WAVE-C |
| `proof:peer-satisfied` stays RED until glass-ui BB | `FINAL.md:112-119`; `scripts/proof-peer-satisfied.mjs` | M-WAVE-D |
| `proof:settle-is-predicate` scope extension to heavy gates | `scripts/proof-settle-is-predicate.mjs` (currently scoped to `openControlsPanel` body only) | M-WAVE-B |
| `ci-linux` Makefile target — never runs Docker in CI; the cure is local-repro only | `Makefile:36-43`; the fix for a Docker-absent developer machine is not specified | M operational note |
| `proof:keyframes-vue-published` clause (b) — RED by design until user publishes | `FINAL.md:148-151`; `scripts/proof-keyframes-vue-published.mjs` | L.W9 / user-domain |

---

## 7. Cross-repo asks inherited from W4

| Ask | Target | W4 tripwire | M action |
|---|---|---|---|
| glass-ui BB peer-range widen (`"@mkbabb/value.js": ">=0.13.0"`) | `@mkbabb/glass-ui` | `proof:peer-satisfied` born-RED (`scripts/proof-peer-satisfied.mjs`) | consume on publish → re-pin → gate goes hard |
| parse-that direct dep deletion (`utils.ts` `any` combinator) | `@mkbabb/value.js` (absorbs the `any` combinator) | `proof:workaround-deletion` born-RED clause (L.W9) | value.js O publish + re-pin |

---

## 8. Performance findings

**Measured (from gate-apparatus-A-taxonomy.md §2, sample-timed 2026-06-17):**

| Gate | Wall-clock |
|---|---|
| `proof:live-session` (40 `waitForTimeout`, full 8-scene sweep) | **80.85s** |
| `proof:drag-gesture` | 27.18s |
| `proof:layout-cluster` | 11.29s |
| `proof:single-toggle` | 2.76s |
| `proof:dock-popover-opens` | 1.98s |
| `proof:boundary` (source-shape) | 0.69s |
| `proof:no-dup-utility` (source-shape) | 0.16s |

**proof:all single-pass estimate:** ~15–31 min (median vs mean browser-weighted). Browser
gates (72/142 = 51%) consume 92–96% of wall-clock. Non-browser 70 gates + vitest = ~70s
combined (essentially free). `proof:live-session`'s 40 `waitForTimeout` calls (most
of them un-transposed post-W4) are the largest single contributor.

**W4 net impact on wall-clock:** `openControlsPanel`'s 4 fixed sleeps (500+800+600+800 ms =
2700 ms worst-case) were transposed to predicate-wait (typically ~1100 ms on a fast box
per the commit message). But this affects only the shared helper — the gate-level sweep
cost (dominated by animation settle, frame sampling, multi-scene navigation) is unchanged.
The per-gate cold-boot overhead (~210ms fixed per gate, ~80+ launches total = ~17s) is
unchanged. The dominant wall-clock — `proof:live-session`'s 81s of fixed-sleep settle —
is unchanged.

---

## 9. The honest verdict

**L.W4 is correctly scoped and correctly executed for the device-honesty pass.** Every S-clause
delivered its promised born-RED oracle: `proof:settle-is-predicate` green (`FINAL.md:102-110`),
`proof:no-single-option-select` green (`FINAL.md:109`), `proof:peer-satisfied` red-by-design
(`FINAL.md:112-119`), report-all CI posture verified in `ci.yml`. The CATEGORY taxonomy is
machine-asserted. The Makefile exists. The release.yml roster is closed.

**What W4 did NOT attempt (correctly named in L.W4.md as out of scope):**
- The serial `&&` O(N²) local iterate-to-green loop — addressed only for CI, not local.
- The 271 remaining `waitForTimeout` calls outside `openControlsPanel`.
- The two-harness (bespoke scripts + vitest) structural split.
- `proof:peer-satisfied` greening — this is a cross-repo deliver + re-pin event, not a
  W4 deliverable.

**The VERDICT doc was the canonical M-charter seed for this work surface.** It correctly
names M's headline consolidation target: retire the bespoke `proof:*` runner and migrate its
assertions into a first-class three-tier vitest architecture. L.W4's device-honesty pass is
the PREREQUISITE (the observe-only categories, the report-all posture, the settle-primitive
existence) that makes the M consolidation safe to execute without regression.

**Factual correction from prior audit drafts:** The L.W4 spec (`L.W4.md:27-35`) cited 259
`waitForTimeout` hits in `scripts/*.mjs` (the non-recursive `scripts/*.mjs` figure). The
VERDICT doc's evidence index (`gate-apparatus-VERDICT.md:335`) confirms 264 across
`scripts/proof-*.mjs` at audit time. The current tree (post-W4 `openControlsPanel`
transposition) shows 271 total — higher, not lower, because L.W4 through L.W11 added new
browser gates (`proof:design-refinement`, `proof:crayon-preserved`, `proof:easter-egg`,
`proof:scene-parity` additions) that each import `waitForTimeout`. The absolute count
drifts between waves; the structural obligation (the O(N²) runner) is the load-bearing
finding, not the integer.
