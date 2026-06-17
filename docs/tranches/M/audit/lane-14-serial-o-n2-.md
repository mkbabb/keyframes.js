# Lane 14 — serial-O(N²): the parallel report-all runner wave

**Status:** AUDIT ONLY. No gate changed, no code written. All numbers verified
against ground truth on the live tree (`tranche-j-dev`, branch tip; gate scripts
and `package.json` are identical to the `tranche-l-dev` tip `529fcfd` where
`proof:all` ran GREEN). File:line citations re-verified by direct read or grep on
2026-06-17.

**Relationship to lane 13.** Lane 13 (`lane-13-apparatus-sota.md`) covers the
full gate-apparatus consolidation charter — the four-tier vitest migration
target, the migration path, the counterpoint, and the precept-compliance
argument. This lane focuses narrowly on the parallel report-all question the
brief poses: what blocks parallelism today, is this an M.W1 quick-win or part of
the full vitest-browser migration, and what the M wave looks like. Read lane 13
first for the broader apparatus argument; this lane derives its M-wave proposals
from it.

---

## 1. GROUND TRUTH: the serial && chain

### 1.1 The chain, verified

`proof:all` in `package.json` is:

```
npm run proof:correctness && npm run proof:hygiene
```

`proof:correctness` = 18 `&&`-chained gates (all browser, enforced by
`proof:gate-is-runtime`). `proof:hygiene` = **124 `&&`, 0 `;`, 0 `||`** — a
single unbroken shell string of 124 `npm run proof:*` invocations terminating in
`&& vitest run`. Verified:

```
node -e "const p = require('./package.json'); console.log(
  p.scripts['proof:hygiene'].split('&&').length - 1  // → 124
)"
```

**Total in `proof:all`:** 17 (correctness) + 124 (hygiene) = **141 `&&`
clauses**, 142 leaf gates.

### 1.2 No parallel runner exists

```
grep "concurrently\|npm-run-all\|run-p\b\|turbo\b" package.json  → 0 matches
```

`concurrently`, `npm-run-all`, `turbo`, `xargs -P` — all absent from
`package.json` devDependencies and scripts. The chain is not concurrent in any
form. `@vitest/browser` is also absent; `eslint` is absent;
`dependency-cruiser` is absent.

### 1.3 No parallel equivalent for `proof:hygiene` locally

CI (`ci.yml`) splits into two jobs — `gates` (library, serial steps, 10-minute
ceiling) and `demo-smoke` (demo, **all steps `continue-on-error: true`** with a
terminal `check-failures` accumulator, 50-minute ceiling, `ci.yml:1569–1677`).
The demo-smoke job implements report-all in CI. Locally there is no equivalent;
`proof:correctness && proof:hygiene` is the only entry point and it is purely
serial.

---

## 2. THE O(N²) COST, MEASURED

### 2.1 Why `&&` → O(N²)

`&&` exits on the first non-zero exit. A red at position *k* runs gates
1…*k*, reports ONE failure, and exits. The re-run re-pays gates 1…*k* (no
caching, no green-skip), discovering the gate at position *k*+1. With *R* reds
distributed through the chain the total gate-invocations = sum(k₁, k₂, … kᴿ),
which in the worst case (reds uniformly spaced, chain length N) is O(N²/2). For
N=142 and R=5–6, the expected cost is re-paying ~30-min prefix runs 5–6 times
= **~2.5–3 hours** — the measured 3-hour witness the brief cites.

### 2.2 Per-gate timing (sampled, dist warm, darwin)

From `gate-apparatus-A-taxonomy.md §2` (sample-timed on this machine,
2026-06-17):

| Gate | Class | Wall-clock |
|---|---|---:|
| `proof:no-dup-utility` | source-shape | 0.16s |
| `proof:single-writer` | source-shape | 0.17s |
| `proof:decomposition` | source-shape | 0.25s |
| `proof:boundary` | source-shape | 0.69s |
| `proof:blend` | node+vitest | 0.76s |
| `proof:zero-alloc` | pure-vitest (3 files) | 1.02s |
| `proof:dock-popover-opens` | browser (1 scene) | 1.98s |
| `proof:single-toggle` | browser (1 scene) | 2.76s |

The 36 source-shape gates and 34 vitest gates together consume **~70 seconds**.
The 72 browser gates consume the remaining **~15–31 minutes** (92–96% of
wall-clock). A red in a late-chain browser gate (e.g. `proof:live-session` at
~80s, position ~100/142) forces a ~28-min re-run prefix. Five such reds = 140
min ≈ 2.3 hours.

### 2.3 The sleep tax inside the browser tier

264 `waitForTimeout()` calls across `scripts/proof-*.mjs` — verified:

```
grep -c "waitForTimeout" scripts/proof-*.mjs | awk -F: '{sum+=$2} END{print sum}'
→ 264
```

`proof-live-session.mjs` alone carries **40** `waitForTimeout` calls. Every
cold-boot re-pays ALL of them from scratch. L.W4's `waitForRender/settle`
primitive (`demo-driver.mjs:716`) replaced the settle windows in
`openControlsPanel` but the 264 per-gate per-scene `waitForTimeout` calls in the
individual gate scripts remain. These are the macOS-pass/Linux-fail render-race
root (L.W4's `inv-L-device-honesty` finding, `PROGRESS.md §2.2`), AND they are
the cold-boot re-pay tax inside the O(N²) loop.

---

## 3. WHAT BLOCKS PARALLELISM TODAY

Verified against the actual sources (none of the candidate blockers are real):

| Candidate blocker | Real? | Evidence |
|---|---|---|
| **Port collisions** between concurrent gates | **NO** | `serveDist` calls `server.listen(0, …)` at `scripts/lib/demo-driver.mjs:340` — OS-assigned ephemeral port. Concurrent gates each bind port 0 and receive distinct OS-assigned ports. No collision possible. |
| **`declarePosture` global state** | **NO** | `declarePosture` (`scripts/lib/ci-env.mjs:85`) is a pure per-call factory returning `{ posture, inCI, miss }`. `IN_CI` is a read-only const (`ci-env.mjs:41`). No module-level mutable state. Multiple concurrent callers are safe. |
| **Shared `dist/gh-pages` build** | **PARTIAL — NOT a blocker** | `withPage` checks `path.join(distDir, "index.html")` exists (`demo-driver.mjs:524`). Concurrent gates READ the same built dist. Read-only file sharing is safe. The only real constraint: build once before the parallel fan-out — which the chain satisfies implicitly (build always precedes proof:all). |
| **Per-gate process isolation / module state** | **NOT a blocker** | Each gate is a separate `node` process (each `npm run proof:x` forks). There is no shared module state to race on. The isolation that makes them slow (no warm-browser reuse) is exactly why they parallelize trivially. |
| **`KF_REQUIRE_BROWSER` env flag** | **NOT a blocker** | This is a read-only env var checked at startup (`REQUIRE_BROWSER = process.env.KF_REQUIRE_BROWSER === "1"`, `demo-driver.mjs:369`). Setting it globally before the parallel fan-out is equivalent to setting it per-process; no race. |

**Conclusion: nothing real blocks parallelism.** The serial `&&` chain is a
choice in `package.json`, not a constraint from the gate architecture. CI proves
this: the demo-smoke job already runs all gates with `continue-on-error: true`
and a terminal accumulator — the report-all model exists in CI and is absent
locally only.

---

## 4. M.W1 QUICK-WIN vs FULL VITEST-BROWSER MIGRATION

### 4.1 The quick-win tier (M.W1 — lowest risk, maximum O(N²) payoff)

The serial `&&` chain can be replaced without touching a single gate script.
Two options, both valid:

**Option A — `concurrently` / `npm-run-all -p` over leaf gates.** Install
`concurrently` (or `npm-run-all`), rewrite `proof:hygiene` and
`proof:correctness` to `run-p proof:* …` (or `concurrently`). All gates run
concurrently; `--continue` collects all exit codes; a terminal step exits 1 if
any failed. This is a `package.json` edit + one devDependency.

**Option B — a thin `scripts/run-all.mjs` orchestrator.** A 50–80-line node
script that reads the leaf gate list, spawns them with
`child_process.spawn(…, {stdio: 'inherit'})` in a concurrency-limited fan-out
(e.g. `--workers=N`), collects exit codes, and prints a summary. Zero new
devDependencies; keeps the gate scripts verbatim; the `proof:all` script points
at this orchestrator instead of the `&&` chain. This is the lowest-risk
structural change.

Either option **kills the O(N²) iterate-to-green loop immediately**: one run
surfaces ALL failures instead of ONE. The ~3-hour iterate becomes one
**~15–31-minute run that lists every red.** No gate script changes; no
`withBrowser`/`withPage` changes; no vitest migration required.

**This is unambiguously M.W1.** The payoff — eliminating the 3-hour iterate —
is immediate. The risk — one new devDep or a 60-line orchestrator script — is
minimal. The full vitest-browser migration (the warm-browser + one-dist-server
architecture) is a separate, larger wave (lane 13's Phase 3); the quick-win is
independent of it and should land first.

### 4.2 The warm-browser complement (M.W3 or later)

The parallel report-all runner reduces O(N²) → O(1) per-run-count but does NOT
reduce per-pass wall-clock. With 72 browser gates running concurrently, the
wall-clock drops from the serial 15–31 min to roughly the SLOWEST single gate
(currently `proof:live-session` at ~80s = ~1.3 min) gated by worker concurrency.
With N=8 workers the expected wall-clock is ~8–12 min (the 72 browser gates
distributed across 8 workers, each paying 1–2 scene cold-boot chains). This is
a significant improvement but not the "single-digit minutes" target.

The warm-browser architecture (ONE shared chromium + ONE served dist via
`globalSetup`, with `@vitest/browser` as the runner) is the wall-clock cure.
It is the full Phase 3 in lane 13 — a meaningful lift (install `@vitest/browser`,
write a `globalSetup` dist server, migrate 67 scripts to `*.browser.test.ts`
surface-by-surface). **This is NOT M.W1**; it is a later wave that composes
with and builds on the M.W1 report-all runner.

### 4.3 The L.W4 `waitForRender/settle` primitive (already landed)

L.W4 delivered `waitForRender` (`demo-driver.mjs:716`) and the
`proof:settle-is-predicate` gate that asserts `openControlsPanel` no longer uses
fixed-ms sleeps. This cured the `openControlsPanel` settle windows
(`demo-driver.mjs:579,615,628,663,677`). The 264 remaining `waitForTimeout`
calls in the individual gate scripts are NOT yet cured — they are the subject of
the warm-browser migration (a warm browser amortizes the cold-boot that makes
re-paying those sleeps expensive). The M.W1 parallel-runner does not reduce the
per-gate sleep count; the warm-browser migration does. These are orthogonal and
both needed.

---

## 5. THE M WAVE DECOMPOSITION

### M.W1 — parallel report-all runner (the O(N²) kill)

**Scope:** Replace `proof:all` / `proof:correctness` / `proof:hygiene`'s serial
`&&` chains with a parallel report-all orchestrator. All leaf gates run
concurrently; the run exits 1 iff any gate failed; the terminal output lists
every failure name. Born-RED gate: run `proof:all` with a deliberately-planted
red gate; verify it surfaces ALL failures (including those after the red), not
just the first one.

**Implementation options (in order of increasing effort):**

1. `npm-run-all -p` / `concurrently` over a flat gate list — one devDep,
   `package.json` edit, zero gate-script changes.
2. `scripts/run-all.mjs` — a 60-80-line node orchestrator using
   `child_process.spawn` with configurable `--workers=N` concurrency — zero new
   devDeps.
3. Flat `vitest run` with all gates as vitest tests — requires Phase 3 (lane 13)
   first.

Option 2 is the GESTALT choice: it is a project-owned script, has no new
external dependency, can enforce the same `KF_REQUIRE_BROWSER` env convention,
and produces structured output the existing `check-failures` pattern reads. It
is also the natural precursor for Phase 3: when gates migrate to vitest-browser,
the orchestrator is replaced by `vitest run` and the `proof:all` script is
updated — no parallel runner tech-debt accumulates.

**M.W1 precept compliance.** A parallel runner does NOT change which gates run
or what they assert. `proof:gate-is-runtime` continues to assert the correctness
tier uses real browsers. `proof:ci-coverage` continues to assert every gate is
in CI. `proof:chronic-closure` is unchanged. The meta-gates' source-shape
assertions are entirely independent of the runner topology.

**What does NOT belong in M.W1:** the 264 `waitForTimeout` replacements (that
is the warm-browser wave), the vitest-browser migration (Phase 3), the lint-tier
ESLint consolidation (Phase 1). M.W1 is the runner topology only.

### M.W3 — warm browser + one dist server (the wall-clock core)

**Scope:** Install `@vitest/browser`, add a `globalSetup` dist server, write a
`vitest.config.browser.ts` project for `test/*.browser.test.ts`. Migrate the 67
browser gate scripts surface-by-surface (bezier panel, stage card, easing
sidebar, hero, …) into `*.browser.test.ts` files sharing ONE browser instance
and ONE served dist. Replace 264 `waitForTimeout` calls with `waitFor`
predicates (the `waitForRender` pattern). Retire `demo-driver.mjs`'s
`withBrowser`/`withPage` lifecycle (~115L) after the last script migrates.

**Coverage invariant:** every assertion migrates verbatim — selectors,
computed-style checks, actuation sequences, error-budget=0 counts. The named
redundancies from lane 13 (R1: `card-rounded-primitive` clause-2 dup of
`stage-glass-card`; R2: `easing-sidebar-minimal` B4 nested in `normalized`) are
consolidated in the same migration, not in a separate pass.

**This is NOT M.W1** — it requires `@vitest/browser` (absent), a new vitest
project config, and surface-by-surface migration of 67 scripts. The
prerequisites are M.W1 (parallel runner confirms the gate isolation; warm-browser
replaces the need for it) and the full Phase 3 effort from lane 13.

---

## 6. PRECEPT VIOLATIONS IN L-AS-BUILT

### 6.1 Serial `&&` chain (NO quick-solution permitted)

The serial `&&` chain (`package.json:proof:correctness`, `proof:hygiene`,
`proof:all`) is the architectural root of the 3-hour iterate-to-green. It is NOT
a workaround of a gate defect; it is the runner topology. The M.W1 cure —
replacing `&&` with a parallel report-all orchestrator — is an idiomatic
GESTALT approach (a single well-understood coordination primitive over
independent workers), not a quick solution. Quick solutions PROHIBITED per
precept: no adding `; true` to swallow failures, no `--bail=0` without
report-all, no per-gate `|| true`.

### 6.2 264 `waitForTimeout` calls (the device-honesty violation, deferred to warm-browser)

264 `waitForTimeout` calls across `scripts/proof-*.mjs` are the `inv-L-device-
honesty` violation (`PROGRESS.md §3.3`): a gate that settles on fixed milliseconds
rather than a state predicate passes on the fast dev-box and races on the slow
Linux runner. L.W4 cured `openControlsPanel` via `waitForRender`; the remaining
264 are `inf-L-device-honesty` violations not yet cured. These are DEFERRED to
the warm-browser migration (M.W3) where the shared-browser architecture makes
per-gate settle windows irrelevant and `waitForFunction` predicates are the
natural idiom. This deferral is NOT a quick-solution escape; it is the correct
prioritization: the M.W1 parallel runner removes the O(N²) iterate; M.W3 removes
the device-dependence and the sleep tax.

### 6.3 No local Linux-container repro (W29, still open)

`PROGRESS.md §2.2 W29`: "No Linux-container local-repro; only feedback channel
for a Linux-specific flake is push + ~30min CI." This is still open in L-as-built.
The M.W1 parallel runner does not cure it. The warm-browser migration that
replaces `waitForTimeout` with `waitForFunction` predicates reduces the
Linux-macOS flake surface; a Docker/`act` container is the full cure. This is a
deferred fold for M.WZ or a separate M wave — not M.W1.

---

## 7. DEFERRED FOLDS

| Item | Source | Tripwire | Owner |
|---|---|---|---|
| 264 `waitForTimeout` replacements (inv-L-device-honesty) | `scripts/proof-*.mjs` (grep verified); `PROGRESS.md §2.2 W28` | M.W3 warm-browser migration (the shared-browser architecture makes `waitForFunction` the natural idiom) | M.W3 |
| Linux-container local-repro (W29) | `PROGRESS.md §2.2 W29`; no Docker/act/container in `.github/` | `proof:all` green on a Linux container (the CI environment locally) | M.WZ or a separate M wave |
| `gate-taxonomy.md` posture row for the M.W1 parallel runner | `docs/tranches/J/gate-taxonomy.md` (the posture-manifest `proof:ci-coverage` clause 4 gates); the parallel runner itself is `hard` posture, device-independent — no new observe-only row needed | The M.W1 born-RED gate checks that `proof:all` reports ALL failures, not just the first; device-independent | M.W1 implementation |

---

## 8. CROSS-REPO ASKS

**None.** The serial `&&` chain is entirely kf-owned (`package.json` + optional
`scripts/run-all.mjs`). value.js, parse-that, and glass-ui have no role in the
runner topology. `@vitest/browser` is a devDependency install (M.W3); it is
published on npm and does not require a cross-repo coordination.

---

## 9. PERF NUMBERS

| Metric | Value | Source |
|---|---|---|
| Serial `proof:all` pass (median) | ~15 min | lane A §2 sample-timed, darwin, dist warm |
| Serial `proof:all` pass (mean-weighted) | ~31 min | lane A §2 |
| O(N²) iterate-to-green (5–6 reds) | ~2.5–3 hours | measured; the brief's witness |
| Parallel `proof:all` estimate (8 workers) | ~8–12 min per pass | 72 browser gates / 8 workers; slowest gate `proof:live-session` ~80s |
| Parallel iterate-to-green cost | **~8–12 min** (one run, report-all, O(1)) | vs ~3 hours serial |
| Non-browser gates combined | ~70 sec | lane A §2: 36 source-shape (0.16–0.69s) + 34 vitest (0.76–1.02s) |
| Warm-browser pass estimate (Phase 3) | **~2–4 min** (shared browser + parallel workers) | one cold-boot amortized; 72 gates as parallel test files |
| Process-spawn overhead | ~25s | 142 npm forks × ~0.18s; removed by vitest-as-runner (M.W3) |
| `waitForTimeout` count in proof scripts | **264** | `grep -c "waitForTimeout" scripts/proof-*.mjs \| awk '{sum+=$2} END{print sum}'` |
| `waitForTimeout` in `proof-live-session.mjs` | **40** | `grep -c "waitForTimeout" scripts/proof-live-session.mjs` |

---

## 10. VERDICT

**M.W1 is the immediate high-leverage quick-win. Nothing blocks parallelism.**

Ports: `listen(0)` (`demo-driver.mjs:340`) — OS-assigned, no collision.
Posture: `declarePosture` is a pure per-call factory (`ci-env.mjs:85`) — no
global state. Dist: read-only shared input — safe. Process isolation: each
`npm run` is its own node process — zero shared module state to race on.

The serial `&&` chain is a CHOICE in `package.json`, not a constraint. CI
already proves the gates shard: the demo-smoke job runs all 91 gates with
`continue-on-error: true` and a terminal `check-failures` accumulator — the
report-all model is already built and running in CI (`ci.yml:1577–1677`).
Locally it is simply absent.

**M.W1 is a `package.json` edit + a 60–80-line orchestrator script.** It
converts the 3-hour O(N²) iterate into a single ~10-min run that lists every
red. It does NOT require `@vitest/browser`, ESLint, or any gate-script changes.

The full vitest-browser migration (M.W3, lane 13's Phase 3) is the wall-clock
cure — warm browser, one dist server, parallel workers, `waitForFunction`
predicates replacing 264 `waitForTimeout` sleeps — but it is a larger wave
(~67 script migrations, a new vitest project) that builds on M.W1 and should
follow it.

**The precept holds throughout.** `proof:gate-is-runtime`, `proof:ci-coverage`,
`proof:chronic-closure`, `proof:settle-is-predicate`, and the device-honesty
posture manifest are assertions about gate SHAPE and CI WIRING — orthogonal to
runner topology. They survive the M.W1 parallel runner and the M.W3 vitest
migration unchanged.
