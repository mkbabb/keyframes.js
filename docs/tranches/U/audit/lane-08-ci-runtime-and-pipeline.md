# Lane 08 — CI Runtime & Pipeline Cost Audit

**Tranche U · audit fleet · lane 8/32 · slug `ci-runtime-and-pipeline`**
Repo: `/Users/mkbabb/Programming/keyframes.js` @ `tranche-t-impl` (5.2.0). Read-only.

> Owner edict (ORIGINAL-PROMPT.md:8): *"Alright, that runner is entirely
> superfluous — our CI needs to be trimmed substantially (most of it's likely
> tautological)."* Reading 1 (:44): the Linux runner is ruled superfluous; the
> 227-key gate roster vs the 120 ceiling is presumed substantially tautological.
> This lane costs the pipeline and proposes the trimmed shape.

---

## 1. The pipeline as it stands (measured, not board-trusted)

Three workflows, all `ubuntu-latest`:

| Workflow | Jobs | Trigger | Ceiling |
|---|---|---|---|
| `ci.yml` (752 lines) | `gates` (library) · `demo-correctness` (BLOCKING) · `demo-device-observe` (observe) | PR + push→master | 10m / 50m / 30m |
| `release.yml` | `publish` | tag `v*.*.*` | 15m |
| `deploy-pages.yml` | `demo-correctness-green` preflight · `deploy` | `ci` completed / dispatch | 5m / 20m |

**Empirical fixed costs (warm local macOS — the runner is materially SLOWER; see
MEMORY device-dependence note):**

| Step | Local wall | Notes |
|---|---|---|
| `check:lib` (tsc) | 0.75s | incremental-cached; cold ~5-15s on runner |
| `build:lib` (vite) | 3.6s | glass-ui-free library entry |
| full `vitest run` (1052 tests / 113 files) | **6.0s** | the WHOLE jsdom suite, once |
| one vitest gate (`proof:engine-correctness`) | 1.07s | ~1s is pure vitest boot |
| static node gate (`proof:colocation`) | 0.14s | grep/graph-walk |
| `proof:board-live` | 2.4s | docs-freshness scan |
| `gh-pages` demo build (Monaco 4.18MB + three 538KB) | 2.5s warm | cold on runner ~30-60s; `dist/gh-pages` = 17MB |

**`gates` job = 134 named `proof:*` steps** (`grep -c "name: .*proof:"` = 134) +
tsc + build + dts-check + full test (151 `run:` lines total). **The
`demo-correctness` roster = 77 browser gates** (`CORRECTNESS_ROSTER.length` = 77;
**76 unique** — one duplicate, see F8). **227 `proof:*` scripts** exist in
package.json; `ROSTER_CEILING` is declared 120 and the born-RED
`proof:roster-ceiling` reports 228 (gate-bands.mjs:665-675).

---

## 2. Where the money goes

**The `gates` job is NOT the long pole.** Its 134 steps are dominated by ~90
sub-second static node greps (~40-60s aggregate) + 39 vitest reboots (~40s) +
build (4s) + full suite (6s). Realistic runner wall ~4-7 min, well under its 10m
ceiling. It is deterministic and glass-ui-free — the honest merge floor.

**The long pole is `demo-correctness`** (50m ceiling, 600s per-gate ceiling):
`npm ci` → a SECOND install (`npm i --no-save @playwright/test`, ci.yml:645) →
`npx playwright install --with-deps chromium` (~150MB download + apt system deps,
1-3 min) → `gh-pages` build → **77 browser gates that each load a 17MB
Monaco-heavy SPA** on the slow runner. The heaviest single gate
(`proof:scene-machine-irrefragable`, the six-scene FSM sweep, ci.yml:658-660) is
given a 10-minute ceiling by itself. This is the "entirely superfluous runner."

**`demo-device-observe`** (ci.yml:672-751) is a THIRD full ubuntu runner —
`npm ci` + playwright + lighthouse install + chromium download + `gh-pages` build
+ `build:lib` — and it is **job-level `continue-on-error: true` (ci.yml:678): it
NEVER gates anything.** Every PR and every push pays a full chromium+lighthouse
provisioning for measurements that are RECORDED, not blocking.

So **each CI run provisions three ubuntu runners, downloads chromium TWICE,
builds the 17MB Monaco demo TWICE, and runs `npm ci` THREE times** — for a
deploy gate that (F1) only genuinely needs the fast library job to be green.

---

## 3. Findings

### F1 — CRITICAL — the 77-gate Linux browser job IS the superfluous runner, and it gates the deploy-of-record
**Evidence:** `ci.yml:628-670` (`demo-correctness`, 50m ceiling, gate-timeout
600); `scripts/demo-roster.mjs:71-280` (77-gate `CORRECTNESS_ROSTER`); the build
carries `vendor-monaco 4.18MB` + `vendor-three 538KB` (measured). Each gate
navigates a fresh page of the 17MB SPA on a shared chromium
(`scripts/run-demo-roster.mjs:104-150`).
**Why it is tautological/misplaced:** MEMORY (`project_ci_device_dependence_greening`)
records the standing truth — *gates that pass on macOS fail on the slow Linux
runner (render-races, absolute frame/ms thresholds)*. The S.A2 split, the
per-gate 600s ceiling, the settle-predicate rewrites, the observe-tier carve-outs
are ALL scar tissue from fighting one fact: **a 17MB Monaco SPA rendered on a
throttled shared runner is not a deterministic correctness substrate.** The
browser roster is the right SUITE run in the wrong PLACE.
**Proposal (gestalt):** delete the per-push `demo-correctness` job. The
`run-demo-roster.mjs` driver is already device-agnostic (shared chromium + served
snapshot) — run it (a) **on-device pre-push** (fast macOS, minutes not tens of
minutes — where MEMORY says browser correctness actually holds), and (b) on a
**nightly `schedule:` + `workflow_dispatch`** run that records a last-green SHA.
The merge gate becomes the library job alone. This is the owner's ruling made
mechanical: the runner is retired, not patched.

### F2 — CRITICAL — `proof:ci-coverage` CLAUSE 0 is the forcing function that mandates the 134-step enumeration; trimming is impossible until the coverage contract is inverted
**Evidence:** `scripts/proof-ci-coverage.mjs:7-14` — *"every `proof:*` gate
declared in package.json MUST be invoked by the CI workflow… Drop any `proof:*`
from ci.yml → it reds."* This is why ci.yml is 752 lines of one-`proof:`-per-step
enumeration: the gate LITERALLY forbids collapsing it.
**Why it is the root cause:** the CI file cannot be trimmed by editing the CI
file — the coverage gate will red. Every new born-RED oracle each tranche
authored (203→228 roster, gate-bands.mjs:589-595) mechanically grew ci.yml by a
step. The bloat is self-reinforcing BY DESIGN.
**Proposal (architectural transposition):** invert the contract. CI invokes ONE
tiered aggregator per job — `proof:library-correctness`, `proof:hygiene`
(package.json:269-272 already hold these `&&`-chains; `scripts/run-all.mjs`
already reads them concurrently). Rewrite CLAUSE 0 to assert *every `proof:*` is
reachable from an aggregator TIER* (CLAUSE 0b already does the converse —
:15-22), not that it appears as a literal ci.yml step. **ci.yml `gates`
collapses from 134 steps to ~5** (check → build → dts → `proof:library-correctness`
→ `proof:hygiene`), membership stays single-sourced in package.json, and coverage
is still a machine fact. This is the keystone that makes every other trim legal.

### F3 — MAJOR — `demo-device-observe` is a full third runner that gates nothing
**Evidence:** `ci.yml:672-751`; `continue-on-error: true` at :678 (job level).
It runs `npm ci` + `npm i --no-save @playwright/test lighthouse` (:691) +
`playwright install --with-deps chromium` (:693) + `gh-pages` (:695) +
`build:lib` (:730), then runs LoAF/lighthouse/perf-frame-budget — every step
`continue-on-error`, every result "RECORDED, never blocking" (:749-751).
**Failure scenario:** on every PR the runner spends ~5-10 min provisioning
chromium + lighthouse + building the demo to produce numbers that, by
construction, can never fail the workflow. Pure fixed cost, zero gating value.
**Proposal:** device measurements do not belong in per-push CI. Fold the entire
job into the nightly `schedule:` run (F1's nightly). Zero assurance is lost —
observe-only means observe-only.

### F4 — MAJOR — 39 gates reboot vitest for test files the full suite already ran; the jsdom suite is paid ~40× over
**Evidence:** 39 `proof:*` scripts embed `vitest run <file>`
(package.json:56,58,81,87,100-115,…); `ci.yml:110-111` ALSO runs the full
`npm test -- --run`; `proof:hygiene-chain` ENDS with a bare `vitest run`
(package.json:272). Full suite = 6.0s for all 1052 tests; a single-file vitest
boot ≈ 1.07s of which ~1s is pure boot. 39 reboots ≈ **40s of overhead
re-running tests already covered by the full suite.**
**Proposal:** the node-script halves are the real per-gate assertions; the
`vitest run <file>` halves are a subset of the suite that CI runs whole. In CI,
run the full suite ONCE and let the gates contribute only their node halves
(guard the vitest tail behind a `KF_GATE_STANDALONE` env the aggregator does not
set). On-device the paired form stays for fast single-gate iteration. Net: ~40s
off every gates run and the "same test, 40 boots" waste is gone.

### F5 — MAJOR — deploy-of-record is welded to the demo-correctness job by a single-sourced literal NAME; trimming that job silently collapses the deploy gate
**Evidence:** `deploy-pages.yml:50-54` (`env.DEMO_CORRECTNESS_JOB` = the exact
50-char job name string), `:72-90` (the preflight greps the triggering run's jobs
API for that name; a rename → the preflight reds "in lockstep"). The deploy `if`
(:100-104) also requires the `ci` conclusion `success`, which requires
demo-correctness (it "gates deploy").
**Failure scenario:** F1 deletes `demo-correctness` → the preflight's
`select(.name == $n)` returns empty → `CONCLUSION != "success"` → **every
deploy is blocked**, or (worse) the `ci` success no longer implies any demo
assurance and the coupling is a dead literal.
**Proposal:** decouple deploy from a per-push browser job entirely. Deploy-of-
record gates on **(a) the library `ci` job green on master + (b) the most-recent
nightly demo-roster green on an ancestor SHA** (the nightly writes a
`last-demo-green` ref/gist; the preflight asserts `merge-base --is-ancestor`).
A per-push master deploy never waits on a 40-min browser job; a red nightly
opens an issue and freezes the deploy ref until cured. This is the honest
deploy-of-record under a trimmed CI.

### F6 — MAJOR — chromium is downloaded and the 17MB Monaco demo is built TWICE per run; `npm ci` runs THREE times
**Evidence:** chromium install at `ci.yml:647` (demo-correctness) and `:693`
(demo-device-observe); `gh-pages` build at `:649` and `:695`; `npm ci` at `:69`,
`:643`, `:687`. The `demo-device-observe` job even runs `build:lib` (`:730`)
AFTER building gh-pages, needing a specific ordering comment (`:726-729`) to keep
the two builds from wiping each other.
**Proposal:** if ANY browser job survives (nightly), provision once — a single
`build-demo` job uploads `dist/gh-pages` as an artifact; browser jobs
`download-artifact` + reuse ONE cached chromium (`actions/cache` on the
playwright browsers path). But the load-bearing cure is F1/F3: with both per-push
browser jobs retired, the double-download and triple-install vanish outright.

### F7 — MINOR — the `gates` job carries docs-hygiene steps that are not merge-blocking correctness
**Evidence:** `ci.yml:145-156` — `proof:owner-verdict-recorded`,
`proof:board-live` (2.4s), `proof:retirement-ledger`, `proof:prompt-recap-t`,
`proof:record-truth` (:519). These police DOCS freshness (session logs, board↔tree,
recap teeth), not the publishable surface.
**Proposal:** partition `proof:*` into **merge-blocking** (boundary, build,
library-correctness, the fast STRUCTURAL edict gates — colocation / zone-cohesion
/ no-flat-siblings, which ARE the U colocation edict and must block) vs
**advisory docs-hygiene** (board/record/recap/ledger). Only the former gates a
merge; the latter run in a non-blocking `docs-hygiene` tier. Keeps the merge gate
about code, not bookkeeping.

### F8 — MINOR — `proof:dfa-derived` is listed twice in the correctness roster
**Evidence:** `scripts/demo-roster.mjs:176` and `:279` both push
`"proof:dfa-derived"` (77 entries, 76 unique — confirmed
`new Set(CORRECTNESS_ROSTER).size` = 76). The second was added at "batch ⑧"
(:275-279) apparently unaware of the first.
**Proposal:** dedupe. Trivial, but it is a live witness that a 77-row
hand-maintained roster has drifted past human review — corroborating F2's case
for aggregator-derived membership over hand enumeration.

---

## 4. The trimmed pipeline (the proposal, whole)

**Merge gate — ONE fast deterministic ubuntu job (target < 90s cached), gates PR + push:**
`npm ci` (cached) → `check:lib` → `build:lib` → dts-symbol check →
`proof:library-correctness` (node+jsdom value proofs, run concurrently via
run-all) → `proof:boundary` → `proof:published-surface` → the FAST STRUCTURAL
edict gates (colocation / zone-cohesion / no-flat-siblings / no-silent-fallback —
they enforce the U colocation+no-legacy edict and are sub-second static). Full
`vitest run` ONCE. **No browser. No Monaco. No chromium.** This is device-
independent and cannot flake on runner speed.

**Docs-hygiene tier — same run, non-blocking annotations:** board-live /
record-truth / retirement-ledger / prompt-recap — reported, not deploy-gating.

**Nightly (`schedule:` cron + `workflow_dispatch`) — the browser roster + device
observe:** the full `demo:correctness` roster on a shared chromium (built once) +
LoAF/lighthouse/perf. Writes `last-demo-green = <sha>` on success. This is where
the 40-min browser suite belongs — off the merge path, run once a day, not 50×.

**On-device pre-push:** `npm run demo:correctness` (the identical
run-demo-roster driver) on fast macOS before pushing — the correctness the runner
was pretending to give, delivered where it is deterministic.

**Deploy-of-record (redesigned):** `deploy-pages.yml` triggers on `ci` (the
library merge gate) completing green on master, AND asserts `last-demo-green` is
an ancestor of the deploy SHA (F5). Break-glass `workflow_dispatch` stays. A red
nightly freezes the deploy ref (opens an issue) rather than blocking every push
on a browser job. The single-sourced `DEMO_CORRECTNESS_JOB` literal is retired
with the job.

**`release.yml`:** largely correct (publish-safety re-runs check/build/test/
boundary/published-surface/deps-current/alias-dropped/changelog + provenance).
One trim: it re-runs the full library gate on a tag that already passed CI green
on master — acceptable belt-and-suspenders for a publish, but the
`proof:library-correctness` aggregator (F2) should replace its hand-listed
`check→build→test→boundary→…` prefix for single-sourcing.

**Net shape:** `ci.yml` from 752 lines / 134 gate-steps / 3 ubuntu runners →
~1 fast job / ~8 aggregator-level steps / 1 ubuntu runner. Chromium downloaded
0× on the merge path (1× nightly). Monaco built 0× on the merge path.

---

## What U must charter

1. **Charter the retirement of the per-push `demo-correctness` Linux browser job** — move the 77-gate `run-demo-roster` suite to a nightly `schedule:` run + on-device pre-push; the merge gate is the library job alone. (F1)
2. **Charter inverting `proof:ci-coverage` CLAUSE 0** — coverage asserts reachability-from-an-aggregator-TIER, not literal per-step presence in ci.yml; collapse `gates` from 134 steps to ~5 aggregator invocations. This is the KEYSTONE — no trim is legal until it lands. (F2)
3. **Charter deleting the `demo-device-observe` job from `ci.yml`** and folding its measurements into the nightly run — it is `continue-on-error` and gates nothing. (F3)
4. **Charter de-duplicating vitest** — the full suite runs once in CI; the 39 per-gate `vitest run <file>` tails run only standalone/on-device, not in the CI aggregator path. (F4)
5. **Charter the deploy-of-record redesign** — gate on library-`ci`-green + a `last-demo-green` ancestor SHA from the nightly; retire the single-sourced `DEMO_CORRECTNESS_JOB` name coupling. (F5, F6)
6. **Charter a merge-blocking vs docs-hygiene gate partition** — bookkeeping gates (board/record/recap/ledger) annotate, they do not gate a merge; the fast structural edict gates (colocation/zone) DO. (F7)
7. **Charter aggregator-derived roster membership** — the hand-maintained 77-row `CORRECTNESS_ROSTER` (already carrying a dup) is derived from a tier chain, ending hand-enumeration drift. (F8, F2)
