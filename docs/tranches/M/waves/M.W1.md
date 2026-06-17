# M.W1 — The parallel report-all runner (the O(N²) kill)

- **Band:** A · **Class:** the keystone (the runner unblocks fast iteration for every other M wave) · **Dep:** none (entirely kf-owned — no value.js / parse-that / glass-ui edge; `@vitest/browser` is NOT required, this is runner-topology only)
- **Gate (new):** `proof:report-all` — born-RED on today's tree over a DELIBERATELY-PLANTED multi-red tree; GREEN only when ONE invocation of the orchestrated `proof:all` reports EVERY red, where today's serial `&&` chain aborts on the first.
- **Folds (lane #):** L12 (the close-reconciliation cross-wave masking root) · L13 (the apparatus-SOTA charter, Tier-0 the runner) · L14 (serial-O(N²) — the parallel report-all proposal, the no-blocker evidence) · L15 (the two-harness contrivance, the CI report-all correction)
- **Precept cure:** ⚠M6 (the serial `&&` chain — no-legacy / no-workaround)

---

## Context

The owner-flagged 3-hour iterate-to-green is not gate count and not gate intent
— it is the **runner topology**. `proof:all` is a serial `&&` shell chain
(verified live, 2026-06-17):

```
proof:all         = "npm run proof:correctness && npm run proof:hygiene"
proof:correctness = 18 leaf gates, 17 && (all browser, enforced by proof:gate-is-runtime)
proof:hygiene     = 124 &&, 0 ;, 0 ||  — one unbroken shell string terminating in `&& vitest run`
                  → 142 leaf gates in proof:all; no parallel runner present
                    (concurrently / npm-run-all / run-p / turbo / xargs -P → all ABSENT)
```

`&&` exits on the first non-zero exit. A red at chain position *k* runs gates
1…*k*, reports **ONE** failure, and aborts. The re-run re-pays gates 1…*k* (no
caching, no green-skip) to discover the gate at *k*+1. With *R* reds distributed
through the chain the cost is `sum(k₁…kᴿ)` ≈ **O(N²/2)**; for N=142 and R=5–6,
re-paying ~30-min full-prefix runs 5–6 times = the **~2.5–3-hour** witness the
owner measured (`lane-14 §2.1`, `lane-13 §2`). The L close-reconciliation lane
(`lane-12 §3`) names the same root from the other side: **per-wave green-masking**
— the serial chain cannot surface cross-wave reds during development, only at the
full-roster close sweep, because each red aborts before the next is reached.

**This is a legacy architecture with no blocking justification.** The
report-all model **already exists in CI** and is absent only locally
(`lane-15 §1`, verified live): the `demo-smoke` job runs its gates with
`continue-on-error: true` (94 occurrences in `ci.yml`) plus a terminal
`check-failures` accumulator step that reds the job iff any gate red'd — so CI
reports ALL reds in one run; local `proof:all` reports only the first. The local
serial chain is strictly worse than CI for no architectural reason.

**Nothing real blocks parallelism** (every candidate blocker verified absent —
`lane-14 §3`, re-confirmed live at the file:lines below):

| Candidate blocker | Real? | Evidence (verified 2026-06-17) |
|---|---|---|
| Port collisions between concurrent gates | **NO** | `serveDist` calls `server.listen(0, …)` (`scripts/lib/demo-driver.mjs:340`) — OS-assigned ephemeral port; concurrent gates each receive a distinct port. |
| `declarePosture` global state | **NO** | `declarePosture` is a pure per-call factory (`scripts/lib/ci-env.mjs:85`) returning `{ posture, inCI, miss }`; `IN_CI` is a read-only const (`ci-env.mjs:41`). No module-level mutable state. |
| Shared `dist/gh-pages` build | **NO (read-only)** | Concurrent gates `page.goto` the SAME built dist as a read-only input (`demo-driver.mjs` `withPage`/`serveDist`). The only constraint — build once before fan-out — the chain already satisfies (build always precedes `proof:all`). |
| Per-gate process isolation | **NO** | Each `npm run proof:*` forks a fresh node process; zero shared module state to race on. The same cold-boot isolation that makes them slow makes them parallelize trivially. |

The cure is **not** a quick solution. PROHIBITED quick-hacks (explicitly out of
scope, would mask reds): `; true` per gate, `--bail=0` without a report-all
accumulator, per-gate `|| true`. The GESTALT cure is a single well-understood
coordination primitive over independent workers — a concurrency-limited node
orchestrator (`scripts/run-all.mjs`, ~60–80L, `child_process.spawn` +
`--workers=N` + an exit-1-if-any accumulator) OR `npm-run-all -p
--continue-on-error` over the leaf gate list. `lane-14 §4.1 / §10` and
`lane-15 §10 M-WAVE-1` both rank the project-owned orchestrator as the gestalt
choice: zero new external dependency, keeps every gate script VERBATIM, owns the
same `KF_REQUIRE_BROWSER` env convention, and is the natural precursor for the
M.W3 vitest-browser migration (when gates become `*.browser.test.ts`, the
orchestrator is replaced by `vitest run` and `proof:all` is re-pointed — no
parallel-runner tech-debt accrues).

### The boundary M.W1 does NOT cross (the scope fence)

M.W1 is runner topology ONLY. It does **not** touch:
- the 264 `waitForTimeout` settle-sleeps (the warm-browser wave — M.W3/M.W4);
- the `@vitest/browser` migration (M.W3);
- the eslint + dependency-cruiser LINT tier (M.W2);
- which gates run or what they assert (the oracles are untouched).

A parallel runner changes the SCHEDULE, not the SUITE. The decisive win is
killing the O(N²) iterate (3 hours → one ~8–12-min report-all pass with 8
workers — `lane-14 §9`); the per-pass wall-clock floor (the warm shared browser)
is a later wave that BUILDS on this one.

### The non-negotiable membership constraint (the trap M.W1 must not spring)

Two meta-gates **parse the chain strings** to derive their rosters — the runner
refactor must preserve a machine-readable membership list or it silently breaks
them (verified live):

- `proof:gate-is-runtime` derives the correctness-tier roster by
  `matchAll(/proof:[a-z0-9-]+/g)` over the **`proof:correctness` chain STRING**
  (`scripts/proof-gate-is-runtime.mjs:82,108`). If the orchestrator dissolves
  `proof:correctness` into an opaque blob (e.g. `run-all --tier=correctness`
  with the member list hidden in a sidecar the regex can't see), the runtime
  precept's roster collapses to empty and the gate vacuously greens — a silent
  coverage loss.
- `proof:ci-coverage` reads `proof:correctness ∪ proof:hygiene` as the
  CI-reachability set (`scripts/proof-ci-coverage.mjs:14`). Same dependency on a
  parseable membership.

So the orchestrator MUST keep the tier membership enumerable from
`package.json` by the same regex contract (an explicit gate-name list per tier
— in `package.json` or a manifest the two meta-gates are re-pointed to read),
and the correctness/hygiene PARTITION must survive (`proof:gate-is-runtime`
still asserts every correctness member is a browser gate). This is the
`lane-12 §3` spec-error lesson applied forward: the runner must not destroy the
tier taxonomy the meta-gates police.

---

## Scope

Each S-clause is a concrete, falsifiable deliverable. Together they constitute
`proof:report-all` GREEN, the parseable-membership invariant intact, and the
serial `&&` chain retired.

### S1 — The orchestrator exists and is the entry point (`scripts/run-all.mjs`)

> **Decision (GESTALT, per lane-14 §4.1 / lane-15 §10 / lane-13 §4):** Option B
> — a project-owned `scripts/run-all.mjs` orchestrator (~60–80L), NOT a new
> external devDependency. `npm-run-all -p --continue-on-error` (Option A) is a
> VALID fallback if a future constraint demands it, but the owned script is the
> idiomatic choice (zero new dep, owns the `KF_REQUIRE_BROWSER`/`IN_CI`
> conventions, structured output the `check-failures` pattern already reads, and
> the clean retirement seam for M.W3). The S-clauses below specify Option B; an
> Option-A variant must satisfy the SAME S2–S6 observables.

**Deliverable.** `scripts/run-all.mjs`:
- Reads a leaf gate list (the `proof:correctness` ∪ `proof:hygiene` members,
  parsed from `package.json` so the orchestrator and the meta-gates read ONE
  source of truth).
- Spawns each leaf gate with `child_process.spawn(npm, ["run", gate], { stdio:
  "inherit" })` in a **concurrency-limited** fan-out (a `--workers=N` flag,
  default a sensible CPU-bound N; `--workers=1` recovers serial for debugging).
- **Collects ALL exit codes** — never aborts the fan-out on the first non-zero.
- Prints a terminal summary listing EVERY failed gate by name.
- **Exits 1 iff ANY gate exited non-zero**, else 0 (the accumulator — equivalent
  to CI's `check-failures` terminal step, now local).

**Constraint.** The correctness/hygiene PARTITION is preserved as enumerable
membership (S6). The orchestrator passes `KF_REQUIRE_BROWSER` / `CI` /
`IN_CI`-relevant env through to children unchanged (setting them globally before
the fan-out is equivalent to per-process — `lane-14 §3`, no race).

**Falsifiable check.** `scripts/run-all.mjs` exists; `node scripts/run-all.mjs
--workers=1` over the real tree exits 0 on a clean tree (parity with the old
serial chain's green); `--workers=N` (N≥2) exits 0 on a clean tree (parallel
parity). `grep -c "child_process\|spawn" scripts/run-all.mjs` > 0;
`grep "process.exit(1)" scripts/run-all.mjs` present (the accumulator).

### S2 — `proof:all` is the orchestrator, not the `&&` chain

**Breach.** `proof:all` = `"npm run proof:correctness && npm run proof:hygiene"`
(verified live) — a serial two-stage `&&`, each stage itself a serial chain;
`proof:hygiene` carries 124 `&&`, 0 `;`, 0 `||`.

**Cure.** `proof:all` becomes a single invocation of the orchestrator over the
union of both tiers (e.g. `"node scripts/run-all.mjs --all"`). The `&&`-chain
shell strings for the FULL `proof:all` path are deleted; the per-tier MEMBERSHIP
survives as a parseable list (S6) but is no longer the EXECUTION topology.

**Falsifiable check.** `node -e "const p=require('./package.json');
console.log((p.scripts['proof:all'].match(/&&/g)||[]).length)"` → **0** (today:
1). The aggregate execution no longer contains an abort-on-first `&&` between
tiers or between leaf gates on the run path.

### S3 — Report-all: ONE invocation surfaces EVERY red (the keystone observable)

**Breach.** Today a multi-red tree, run through `proof:all`, reports exactly ONE
red and aborts (empirically confirmed: a 3-stage `a && b && c` chain where `a`
exits 1 NEVER runs `b` or `c`).

**Cure.** `node scripts/run-all.mjs --all` (the new `proof:all`) runs EVERY leaf
gate regardless of any earlier failure, and its terminal summary names every
failed gate. The process exits 1 (any red), but the OUTPUT is complete.

**Falsifiable check (the Born-RED gate over the REAL observable — see below).**
Plant ≥2 deliberate reds at SEPARATED chain positions; run the orchestrated
`proof:all`; assert BOTH red gate names appear in the summary AND the exit is 1.
Run the SAME planted tree through a reconstruction of today's serial `&&` chain;
assert EXACTLY ONE red name appears (the abort witness). The delta between the
two is the cure, asserted on the real runner over real gate processes — NOT a
proxy.

### S4 — Concurrency is real, not cosmetic (parallelism actuated)

**Breach.** No parallel runner exists; the chain is serial in every form.

**Cure.** With `--workers=N` (N≥2) the orchestrator runs N gates concurrently —
confirmed not by inspecting the flag but by OBSERVING overlap.

**Falsifiable check.** A born-RED fixture: plant two slow gates (each a node
script that sleeps a known bounded interval and timestamps spawn+exit to a temp
file). Run them under `--workers=2`. Assert the two gates' [spawn, exit]
intervals OVERLAP (concurrent), and under `--workers=1` they do NOT (serial).
The no-blocker evidence is cited as the safety proof: ports `listen(0)`
(`demo-driver.mjs:340`), posture stateless (`ci-env.mjs:85`), dist read-only —
so concurrent browser gates cannot collide. (This S-clause asserts the
ORCHESTRATOR parallelizes correctly; it does NOT assert any wall-clock target —
that is M.W3's warm-browser frontier.)

### S5 — Clean-tree parity: no coverage lost, no gate weakened

**Breach (the risk, not a current defect).** A naive `; true` / `|| true` /
`--bail=0`-without-accumulator runner would report-all by SWALLOWING reds —
turning a multi-red tree GREEN. That is the PROHIBITED quick-hack.

**Cure / lock.** On a CLEAN tree the orchestrated `proof:all` exits 0 AND every
leaf gate actually RAN (the same N gates as the old chain — none skipped). On a
multi-red tree it exits 1. The accumulator distinguishes "ran-and-passed" from
"ran-and-failed" — it does not conflate "failed" with "passed."

**Falsifiable check.** Clean tree → exit 0, and the summary reports the SAME leaf
gate count as `|proof:correctness ∪ proof:hygiene|` (no gate silently dropped).
Single planted red → exit 1. This is the no-coverage-loss precept applied to the
runner: the SUITE membership and exit semantics are preserved; only the SCHEDULE
changes.

### S6 — Tier membership survives parseable (the meta-gate contract)

**Breach (the trap).** If the orchestrator hides the per-tier gate list, two
live meta-gates break silently:
- `proof:gate-is-runtime` (`proof-gate-is-runtime.mjs:82,108`) derives the
  correctness roster by `matchAll(/proof:[a-z0-9-]+/g)` over the
  `proof:correctness` STRING. An opaque blob → empty roster → vacuous green.
- `proof:ci-coverage` (`proof-ci-coverage.mjs:14`) reads
  `proof:correctness ∪ proof:hygiene` as the CI-reachability set.

**Cure.** The correctness/hygiene tier membership stays enumerable as a
`proof:[a-z0-9-]+`-matchable list in `package.json` (the `proof:correctness` /
`proof:hygiene` keys keep listing their members — even if their EXECUTION is now
the orchestrator, their VALUE remains a parseable membership), OR the two
meta-gates are re-pointed (in the SAME wave) to a single manifest the
orchestrator and they share. Either way: `proof:gate-is-runtime` still derives a
NON-EMPTY correctness roster and still asserts every member is a browser gate;
`proof:ci-coverage` still resolves the full reachability set.

**Falsifiable check.** After the refactor: `proof:gate-is-runtime` exits 0 and
its derived correctness roster is non-empty and equals the pre-refactor roster
(the 18 correctness members); `proof:ci-coverage` exits 0. A born-RED arm: plant
a node-only gate into the correctness membership → `proof:gate-is-runtime` REDs
(the precept still bites through the new topology). The `lane-12 §3` spec-error
class (a mis-tiered gate) must remain catchable.

---

## Born-RED gate

**Gate name:** `proof:report-all` (NEW — does not exist in `scripts/` today; this
wave authors it). **Tier:** hygiene (a node meta-gate over the runner — no
browser; `GATE TIER: hygiene` per the `lane-12 §M-ARCH-4` tier-field
discipline).

**The REAL observable (inv-M-observable-truth — NOT a proxy).** The L.W1 S4
lesson is the binding precedent: that gate tested a PROXY (no-throw + string
round-trip) and missed the genuine NaN-frame breach. M.W1's gate must bite the
ACTUAL failure mode — *"a multi-red tree reports only the FIRST red and the
developer re-iterates."* The proxy to AVOID here would be: asserting
`package.json` no longer contains `&&` (a source-shape check that a `; true`
hack would PASS while still masking reds), or asserting `run-all.mjs` exists (a
file-presence check that says nothing about behavior). Neither bites the real
observable. The gate must **plant a real multi-red tree and observe the real
output of the real runner.**

**Structure.** A node gate (`scripts/proof-report-all.mjs`) that, in a temp
sandbox, constructs a SMALL synthetic gate set — e.g. four trivial node scripts
`g1`(pass) `g2`(exit 1) `g3`(pass) `g4`(exit 1), registered as throwaway
`proof:*` keys — and exercises BOTH topologies over them:

| Clause | Input | Today (serial `&&`) | After cure (orchestrator) |
|---|---|---|---|
| C1 — report-all | the 4-gate tree {g1✓, g2✗, g3✓, g4✗} run via the orchestrator | n/a (orchestrator absent) | summary names BOTH `g2` AND `g4`; exit 1 |
| C2 — abort witness | the SAME 4-gate tree run via a literal `g1 && g2 && g3 && g4` chain | summary names ONLY `g2`; `g3`,`g4` never spawn | (proves the delta — the serial chain still aborts-first) |
| C3 — clean parity | a clean 4-gate tree {g1✓, g2✓, g3✓, g4✓} via the orchestrator | n/a | exit 0; all 4 ran |
| C4 — no-swallow | {g1✓, g2✗} via the orchestrator | n/a | exit **1** (a red is NOT swallowed) |
| C5 — concurrency | two timestamped sleeper gates under `--workers=2` | n/a | spawn/exit intervals OVERLAP; under `--workers=1` they do not |
| C6 — membership | post-refactor `proof:gate-is-runtime` + `proof:ci-coverage` | both green; correctness roster = 18 | both green; roster non-empty + unchanged |

**Today's tree result.** `proof:report-all` exits 1 on today's tree **by
construction**: `scripts/run-all.mjs` does not exist (C1/C3/C4/C5 cannot pass —
the orchestrator they exercise is absent), and `proof:all` still carries the
abort-first `&&` (C2 is the live witness — empirically confirmed: a planted
3-stage `&&` where stage 1 exits 1 never runs stages 2–3). The gate REDs because
the report-all observable does not exist yet.

**Green condition.** All six clauses pass: the orchestrator reports BOTH planted
reds in ONE pass (C1), the serial chain is shown to abort-first (C2, the
contrast), clean trees green with full membership (C3), reds are never swallowed
(C4), concurrency is actuated (C5), and the meta-gate tier contract survives
(C6). The gate is added to `proof:hygiene` membership (node-only, per
`proof:gate-is-runtime`'s correctness=browser partition).

**Why this is the genuine defect, not a proxy.** C1∧C2 together ARE the owner's
3-hour wound, reproduced in miniature and falsifiable: the serial chain
demonstrably hides `g4` behind `g2`; the orchestrator demonstrably surfaces
both. No source-grep, no file-presence check, no string round-trip stands
between the gate and the real behavior — the gate runs the real runner over a
real multi-red tree and reads the real summary. A `; true` quick-hack runner
fails C4 (it would exit 0 on a red); a roster-dissolving runner fails C6.

---

## Dependencies

- **None (kf-internal, no sibling edge).** The serial `&&` chain is entirely
  kf-owned (`package.json` + the new `scripts/run-all.mjs` + the new
  `scripts/proof-report-all.mjs`). value.js, parse-that, and glass-ui have NO
  role in runner topology (`lane-14 §8`, `lane-13 §10`, `lane-15` — verified).
- **`@vitest/browser` is NOT a dependency of this wave.** It is the M.W3
  warm-browser migration's devDependency; M.W1 is runner topology over the
  EXISTING gate scripts, unchanged. No new external devDependency is required for
  Option B (the owned orchestrator).
- **No M-wave precedes M.W1.** M.W1 is the keystone of Band A (`M.md` DAG):
  M.W2 ∥ M.W3 ∥ M.W4 follow it and inherit fast report-all iteration. M.W1 does
  not require M.W2/W3/W4.
- **Membership-contract co-edit (in-wave, not a separate dep).** `proof:gate-is-runtime`
  and `proof:ci-coverage` are re-pointed in the SAME wave commit if the
  tier-membership representation moves (S6) — they must stay green throughout.

---

## Bite — what regression each clause catches

| Clause | Regression it prevents |
|---|---|
| S1 orchestrator | A future contributor re-introduces a serial `&&` aggregate (or a non-accumulating runner); the missing `child_process` fan-out + exit-1-accumulator is caught. |
| S2 `proof:all` topology | A re-added `&&` between tiers (the abort-first regression) reddens the zero-`&&` assertion. |
| S3 report-all (the keystone) | The O(N²) iterate-to-green returns the moment a runner reports only the first red — C1∧C2 bite the real multi-red observable, not a proxy. |
| S4 concurrency | A runner that report-alls but runs SERIALLY (e.g. forgets `--workers`, or a `for`-await that awaits each child) is caught by the interval-overlap fixture. |
| S5 no-swallow | A `; true` / `|| true` / `--bail=0`-without-accumulator quick-hack that report-alls by turning reds GREEN is caught by C4 (a red must exit 1). |
| S6 membership contract | A roster-dissolving runner that silently empties `proof:gate-is-runtime`'s correctness roster (vacuous green) or breaks `proof:ci-coverage`'s reachability set is caught — the tier taxonomy the meta-gates police survives the topology change. |

---

## Excluded from this wave

- **The 264 `waitForTimeout` settle-sleeps** (`lane-14 §4.3 / §7`) — the
  device-honesty cure rides the warm-browser migration (M.W3/M.W4), where the
  shared browser makes `waitForFunction` predicates the natural idiom. M.W1 does
  not reduce the per-gate sleep count; it removes the O(N²) RE-PAY of those
  sleeps. DEFERRED, not dropped.
- **The `@vitest/browser` integration tier** (the warm shared browser + one dist
  server, the per-pass wall-clock cure) — M.W3 (`lane-13 Tier-c`, `lane-14 §4.2`).
  M.W1 reduces the iterate-COUNT to O(1); M.W3 reduces the per-pass wall-clock.
  Orthogonal; M.W3 BUILDS on M.W1.
- **The eslint + dependency-cruiser LINT tier** (the 33 source-shape gates →
  static rules) — M.W2 (`lane-13 Tier-a`, `lane-15 §6`).
- **The ~13 redundant browser clauses prune** (the R1/R2 subsumptions) — M.W4
  (`lane-13 §3`, `lane-15 §7`); a consolidation, not a runner concern.
- **The synthetic-clock settle + the two-axis taxonomy reform** — M.W4
  (`M.md` row). M.W1 does not touch the device-honesty posture manifest; the
  observe-only declarations carry through unchanged.
- **The Linux-container local-repro (W29)** (`lane-14 §6.3`) — a deferred fold
  for M.WZ or a separate wave; the parallel runner does not cure cross-OS flake.
- **Any change to which gates run or what they assert.** M.W1 is the schedule,
  not the suite.
