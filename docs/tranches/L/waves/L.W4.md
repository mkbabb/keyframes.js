# L.W4 — Gate-suite transposition + publish-path hardening

- **Band:** A · **Class:** SHIP-in-L · **Dep:** none — repo-internal tooling + workflow
  edits only; no sibling publish gate
- **Gate (born-RED):** `proof:no-single-option-select` — new gate, absent from today's tree
  and from `proof:all`; RED on today's tree because the gate script does not exist (missing
  script exits non-zero); GREEN when the script exists and the clause passes. Secondary
  born-RED: `release.yml` proof-roster delta — today `release.yml` omits
  `proof:published-surface` and `proof:deps-current`; RED on the pre-L workflow; GREEN when
  both steps are present before `npm publish`.

---

## Context

The K close's honest post-mortem names a ~6-round / ~30-min-each whack-a-mole as the CI
experience for that tranche. The audit's Lane 33 finding (`scripts/lib/demo-driver.mjs` header
comment, the gate-audit lane verdict) diagnosed three independent structural roots that L
makes terminal:

1. **Fail-fast everywhere** (`ci.yml` demo-smoke job: ~70 sequential steps, no
   `continue-on-error`, one red aborts the whole corpus — the only diagnostic is the first
   failure). The fix is a report-all posture already live in `demo-smoke.mjs:51-56` (the
   `failures[]` accumulator, `process.exit(1)` at the end) but NOT in the outer CI
   `demo-smoke` job's serial step chain.

2. **259 fixed-ms sleeps** are the macOS-pass / Linux-fail render-race root
   (`grep waitForTimeout scripts/*.mjs` returns 259 hits — the audit witness;
   the recursive `grep -r waitForTimeout scripts/` count is 267, but 259 is the
   non-recursive `scripts/*.mjs` figure the audit cites; `scripts/lib/demo-driver.mjs:576,
   579, 622, 631` are among them). The settle-on-state cure already exists in ONE function —
   `navToScene` (`demo-driver.mjs:683-710`) uses `waitForFunction` predicate gates, not
   fixed waits — but the `openControlsPanel` helper at `demo-driver.mjs:575-631` and every
   proof script that calls `page.waitForTimeout(N)` directly have not been transposed.

3. **No Linux-container local-repro.** A Linux-specific flake's only feedback channel is
   push → wait 30 min → read CI. No `Makefile` / Docker spec / `act` harness exists in the
   repo; the `.github/` tree has no container-build helper.

The audit adds two more gate-coverage gaps (Lane 33, proposals W2 and W19):

- **`proof:no-single-option-select` (W2)** — U4's "lone-option dropdown does NOT render"
  rule (J.md FINAL.md:325) is BUILT as a product behavior but never gated. No script with
  this name exists anywhere in the repo; `package.json` has no `proof:no-single-option-select`
  entry; it is absent from `proof:all` and from `ci.yml`. The product fix is live; the gate
  is the missing piece.

- **M2 touch-commit path (W19)** — `proof:live-session-mobile` documents the M2 clause
  (the reka SelectItem `pointerup`-commit path on touch) at `proof-live-session-mobile.mjs:
  592-614`. The workaround comment at line 601 ("THAT is the M2 failure: a PLAYWRIGHT
  touch-emulation gap, NOT a product break") and the current `.click()` commit strategy at
  lines 617-638 constitute an _observed workaround_, not a certified touch path. The gate
  passes but the M2 inner loop uses `.click()` in a `hasTouch` context, which dispatches
  `pointerdown → pointerup → click` rather than a real finger's touch event sequence. The
  lane finding (W19) asks for a certified TRUE touch-event-only commit path — either via
  CDP `Input.dispatchTouchEvent` touchStart→Move→End or via confirming that reka's
  `onPointerup` fires from Playwright's `.tap()` in `hasTouch` context and that the current
  fallback is genuinely not exercising the wrong path.

Lane 36 adds the **publish-path gap** (audit W27-class, Lane 36 findings):

- `release.yml` runs only `check:lib → build:lib → test → proof:boundary` before
  `npm publish` (`.github/workflows/release.yml:52-61`). It omits `proof:published-surface`
  (the tarball == exports == docs oracle, `ci.yml:106-107`) and `proof:deps-current` (the
  `@mkbabb/*` floor + protocol-clean + realm-convergent lock, `ci.yml:62-63`). A publish
  that ships a stale or mismatched surface passes today's `release.yml` without either gate
  firing.

- **No `proof:peer-satisfied` gate exists.** The live F-2 peer-cycle (`⚠8`, Lane 36
  CROSS-REPO-ASK finding) — glass-ui's `peerDependencies: { "@mkbabb/value.js":
  "^0.10.0||^0.11.0" }` rejecting value.js 0.13.0 — produces `ELSPROBLEMS` on any consumer
  that installs both. `proof:deps-current` clause 3 (`proof-deps-current.mjs:237-276`) checks
  kf's own parse-that realm convergence but does NOT read glass-ui's peer range against the
  installed value.js version. The F-2 blast radius is invisible to every gate in ci.yml today.

`inv-L-device-honesty` (L.md §invariant set) names the gate-suite law: a CI gate asserts a
device-INDEPENDENT predicate, or declares `observe-only` with a CATEGORY (wall-clock /
pixel-render / physics-settle) and a recorded architectural cure. The current `gate-taxonomy.md`
(`docs/tranches/J/gate-taxonomy.md`) has five `observe-only` rows but no CATEGORY column —
the taxonomy is posture-only, not cure-coupled. L.W4 adds the column, satisfying the
inv-L-device-honesty declaration.

### K substrate

- `navToScene` (`demo-driver.mjs:671-711`) already implements the settle-on-state primitive
  for scene navigation: two `waitForFunction` predicates (route text + trigger text), no
  `waitForTimeout`. The transposition scope is the callers that never adopted it.
- `scripts/lib/ci-env.mjs` (`declarePosture`, `observeOnlyInCI`) is the single `IN_CI`
  authority — `proof:ci-coverage` clause 4 enforces the two-way `observe-only` manifest.
  Adding a CATEGORY column to `gate-taxonomy.md` requires a corresponding clause extension
  to `proof:ci-coverage`.
- `proof:deps-current.mjs:60-98` holds the `FLOORS` map and the three-clause structure
  (floor, protocol, realm-convergence). A new clause 4 (peer-satisfied) is additive.
- The `proof:demo-on-published-surface` script already exists (`scripts/proof-demo-on-
  published-surface.mjs`) and runs in `ci.yml:116-117` — it is absent from `release.yml`.

---

## Scope

Each S-clause is a concrete, falsifiable deliverable.

### S1 — Report-all (non-fail-fast) posture for the demo-smoke CI job (W27)

**Breach.** `ci.yml:277-1250` sequences the demo-smoke job as a flat list of `run:` steps
with no `continue-on-error: true`. The first red step aborts; downstream gates never run.
`demo-smoke.mjs` itself is already report-all (`failures[]` accumulator, final `process.exit`)
but every gate AFTER it in the job would still abort on failure.

**Cure.** Add `continue-on-error: true` to every `proof:*` step in the `demo-smoke` job in
`ci.yml`, paired with a terminal summary step that exits non-zero if any prior step failed.
The canonical pattern uses `${{ steps.<id>.outcome }}` — a final `check-failures` step reads
all outcomes and `exit 1` if any is `failure`. This preserves the individual red annotations
in the GHA step view while reporting ALL failures in one run.

**Constraint.** The `gates` (library) job is already fail-fast by design (a library gate
failure is a hard correctness miss; running further gates over a broken library is noise). The
report-all posture applies to the `demo-smoke` job only, where a UI-level flake in gate N
should not hide a correctness miss in gate N+20.

**Gate bite.** A gate in `demo-smoke` that fails must NOT abort the job's subsequent gate
steps. The terminal summary step exits 1 if any step failed — the job goes red, all steps
run. `proof:ci-coverage` clause 0 (`proof-ci-coverage.mjs:7-12`) already asserts that every
`proof:*` in `package.json` is invoked by CI — it does not check `continue-on-error`. A
new sub-clause (S1 below the existing clause 0b) asserts that every demo-smoke `proof:*` step
carries `continue-on-error: true`; this sub-clause reds on today's workflow and greens on
the cure.

### S2 — `waitForRender`/`settle` primitive replacing fixed-ms sleeps (W28)

**Breach.** `scripts/lib/demo-driver.mjs:575-631` (`openControlsPanel`) contains four
`page.waitForTimeout(N)` calls (500 ms, 800 ms, 600 ms, 800 ms) that are the direct
macOS-pass / Linux-fail class. The K audit counted 259 total `waitForTimeout` hits across
`scripts/*.mjs` (the non-recursive audit witness; the recursive `scripts/` count is 267);
`demo-driver.mjs` is the load-bearing helper — the four calls inside
`openControlsPanel` affect every gate that calls `openControlsPanel` before probing layout.

**Cure.** Introduce a `waitForRender(page, predicate, { timeout = 8000 })` helper in
`scripts/lib/demo-driver.mjs` alongside `navToScene`. Contract: poll
`page.waitForFunction(predicate, { timeout })` — returns the instant the predicate holds,
no fixed sleep. Transpose `openControlsPanel` to use `waitForRender` predicates:
- After `Select animation` click + option click: predicate = `selectedAnimation` in
  `localStorage` + the option text no longer equals the trigger placeholder.
- After `Open controls` click: predicate = `.controls-pane--open` in DOM OR
  `#controls-ribbon-target` visible.
- The trailing `waitForTimeout(800)` at line 631 and the final `waitForFunction` at 633-638
  collapse into ONE `waitForRender` call with the pane-open predicate.

The transposition is load-independent by construction (the timeout is a ceiling, the function
returns the instant the predicate holds — exactly the `navToScene` contract the header comment
at line 659 describes).

**Gate bite.** New `proof:settle-is-predicate` (STATIC) — a script-level grep asserting that
`openControlsPanel` in `demo-driver.mjs` contains ZERO `waitForTimeout` calls. Red on today's
tree (four hits); green on the cure. The gate is STATIC (no browser), runs in the `gates` job,
does not add to the demo-smoke wall-clock.

### S3 — Linux-container local-repro (W29)

**Breach.** No `Makefile`, `Dockerfile`, `docker-compose.yml`, or `act` configuration exists
in the repository. The only path to reproduce a Linux-specific CI flake is push + wait 30 min.

**Cure.** Add a `Makefile` at repo root with a `ci-linux` target that:
1. Pulls `node:24-slim` (the same base GHA uses for `ubuntu-latest`).
2. Mounts the repo at `/workspace` read-write.
3. Runs `npm ci && npm run gh-pages && npm run proof:all:demo` (the demo-smoke roster)
   inside the container.
4. Exits with the container's exit code.

The `Makefile` is the entry point; `docker` is the only new dependency (already present on
developer machines that run Playwright). No new npm dependency. The `Makefile` is documented
in `README.md` under "Local CI repro" (one sentence: `make ci-linux`).

**Gate bite.** `proof:ci-coverage` gains a new STATIC clause asserting `Makefile` exists and
contains `ci-linux:` as a target. Red today; green on the cure. This is a file-existence check,
not a Docker execution — the gate asserts the repro path is present without requiring Docker
in CI.

### S4 — Single-source device thresholds + CATEGORY column in gate-taxonomy (W22 / W30)

**Breach.** `docs/tranches/J/gate-taxonomy.md` has five `observe-only` rows but no CATEGORY
column. The audit's `inv-L-device-honesty` invariant requires each `observe-only` declaration
to carry a CATEGORY (wall-clock / pixel-render / physics-settle) and a recorded architectural
cure. Without the column, `proof:ci-coverage` cannot enforce the cure requirement, and the
categories are informal notes in the `reason` string.

Device thresholds (the pixel budgets, the ms settle budgets) are distributed across scripts.
`scripts/lib/ci-env.mjs` is the `IN_CI` authority; it has no threshold registry. The
`FLOORS` map in `proof-deps-current.mjs:61-98` is the established single-source pattern.

**Cure.** Two changes:

1. **`gate-taxonomy.md` CATEGORY column.** Add a fourth column `Category` to the posture
   manifest table. Valid values: `wall-clock` (timing-dependent settle budgets),
   `pixel-render` (cross-OS rasterization differences), `physics-settle` (spring / easing
   convergence measurements). Each existing `observe-only` row gains its category:
   - `proof:perf-frame-budget` → `wall-clock` (on-device felt budget)
   - `proof:scene-transition-perf` → `wall-clock`
   - `proof:visual-lock` → `pixel-render`
   - `proof:lighthouse-mobile` → `wall-clock`
   - `proof:drawer-spring` → `physics-settle`
   Each row also gains an `Architectural cure` column: the durable fix that would promote the
   gate from `observe-only` to `hard` (e.g. for `proof:drawer-spring`: "a deterministic
   spring simulator replacing the real-time spring, gated by a synthetic-time predicate").

2. **`proof:ci-coverage` clause 4 extension.** After the two-way `observe-only` manifest
   check (lines 392-458), add a sub-clause that reads the `gate-taxonomy.md` table and asserts
   every `observe-only` row has a non-empty `Category` and a non-empty `Architectural cure`
   value. Red if any row is missing either. Green when all five rows carry both.

**Gate bite.** `proof:ci-coverage` clause 4 (extended) reds on a taxonomy row with no
CATEGORY column; greens when all rows carry the category and cure.

### S5 — `proof:no-single-option-select` (missing gate, W2)

**Breach.** U4 ("a lone-option dropdown does NOT render") is a shipped product behavior
(J.md FINAL.md:325) with no gate. No `proof:no-single-option-select` script exists in
`scripts/`, no entry in `package.json`, no step in `ci.yml`. A future regression (a Vue
component re-rendering a single-option dropdown unconditionally) is invisible to CI.

**Cure.** Author `scripts/proof-no-single-option-select.mjs`. The gate is STATIC (no browser)
— it reads the Vue SFC source tree in `demo/` and asserts:

1. Every component that renders a `<GlassSelect>` / `<select>` / reka `<SelectRoot>`
   wraps it in a `v-if` conditioned on `options.length > 1` (or equivalent — the count
   guard).
2. No scene's `scenePlaybackAdapters.ts` or `useControlOptions.ts` passes a `options` array
   of length 1 directly to a Select component without a guard (the J.W7c U4 pattern).

Wire into `package.json`:
```
"proof:no-single-option-select": "node scripts/proof-no-single-option-select.mjs"
```

Add to `proof:hygiene` chain and to `ci.yml` `gates` job (library gate — STATIC, glass-ui-free).

**Gate bite.** Red today (no script); green when the script exists and passes. A future
single-option select that removes the count guard reds.

### S6 — M2 touch-commit path certification (W19)

**Breach.** `proof-live-session-mobile.mjs:592-614` documents the M2 reka SelectItem
commit path. The comment at line 601 ("THAT is the M2 failure: a PLAYWRIGHT touch-emulation
gap, NOT a product break") records that the gate currently uses `.click()` in a `hasTouch`
context as a workaround for Playwright's touch-emulation gap (`.tap()` dispatches only
Touch-API events; reka's `onPointerup` never fires). The gate passes green today, but the
proof it certifies is the `.click()` (pointerdown+up+click) path, not a REAL touch path.

**Cure.** The cure is a characterization + decision record, not a code change:

1. Measure whether Playwright's `touchscreen.tap()` (CDP `Input.dispatchTouchEvent`) in
   a `hasTouch + isMobile` context generates `pointerdown → pointerup` on the target element
   (open a minimal Playwright repro). If it does, replace `.click()` with `.tap()` in
   `proof-live-session-mobile.mjs:617-638`.
2. If it does not (the current understanding — reka's `onPointerup` depends on
   the Pointer Events API bridged from touch), record this as a named PLAYWRIGHT LIMITATION
   in the gate header and in `docs/tranches/J/gate-taxonomy.md` under a new row:
   `proof:live-session-mobile (M2)` → posture `observe-only` with reason "Playwright
   hasTouch context does not dispatch pointerup via CDP dispatchTouchEvent on reka SelectItem
   — `.click()` in hasTouch context is the faithful commit path; real-device verification
   is the authoritative oracle".
3. Add the row to `gate-taxonomy.md` and extend `proof:ci-coverage` clause 4 to pass
   on the new row (no category mismatch).

**Gate bite.** If `.tap()` is viable: `proof:live-session-mobile` M2 clause now uses `.tap()`;
a future fallback to `.click()` reds a new static assertion. If `.tap()` is not viable:
`gate-taxonomy.md` gains the M2 row; `proof:ci-coverage` clause 4 greens with the row
present; RED today because the row is absent from the taxonomy (the S4 CATEGORY clause
would catch this gap even if S6 were not authoring its own row).

### S7 — `proof:published-surface` + `proof:deps-current` in `release.yml` (Lane 36)

**Breach.** `release.yml:52-61` runs only `check:lib → build:lib → test → proof:boundary`
before `npm publish`. `proof:published-surface` (the tarball == exports == docs oracle) and
`proof:deps-current` (floor + protocol + realm-convergent lock) are absent. A publish that
ships a stale `@mkbabb/*` floor or a mismatched API-Extractor surface passes today without
either gate firing (Lane 36, `⚠gate-ORACLE completeness`).

**Cure.** Add two steps to `release.yml` between `proof:boundary` and `npm publish`:

```yaml
- name: proof:published-surface (tarball == exports == docs · the publish-boundary oracle)
  run: npm run proof:published-surface
- name: proof:deps-current (@mkbabb/* pins current · protocol-clean · realm-convergent)
  run: npm run proof:deps-current
```

Both gates are already in `ci.yml` (lines 106-107 and 62-63); the `release.yml` addition
closes the posture gap without authoring new logic. `proof:ci-coverage` clause 0 checks that
CI runs every `proof:*` in `package.json` — it does NOT assert that `release.yml` runs
specific gates. A new sub-clause in `proof:ci-coverage` (call it clause 5: publish-path
roster) asserts that `release.yml` invokes `proof:published-surface` and `proof:deps-current`
before the `npm publish` step. Red today; green on the cure.

**Gate bite.** `proof:ci-coverage` clause 5 (new) — reads `release.yml` and asserts both
gate steps appear before the `npm publish` line. Red today; green when both steps are present.

### S8 — `proof:peer-satisfied` (NEW gate, Lane 36, the live F-2 peer-cycle)

**Sole authorship (per DLL-24).** `proof:peer-satisfied` is the SOLE PROPERTY of
L.W4 — this gate-suite / publish-path wave is the ONE author of the script,
the `package.json` entry, the `ci.yml`/`release.yml` wiring, and the
`gate-taxonomy.md` row. No other wave authors it. **L.W8 and L.W9 only CONSUME
it:** L.W9 (the Band-B glass-ui leg) is the wave that drives the gate GREEN by
re-pinning kf to the glass-ui BB version that widens the peer range to admit
value.js 0.13.0 — it consumes the born-RED tripwire L.W4 plants, it does not
re-author the gate. L.W8 (the constellation dogfood / publish-loop wave)
likewise reads the gate's green/red status as a publish precondition; it adds
no clause. The born-RED tripwire is authored ONCE here, consumed downstream.

**Breach.** The F-2 peer-cycle (`⚠8`, `docs/tranches/K/CONSTELLATION-DAG.md §5`): glass-ui's
published `peerDependencies: { "@mkbabb/value.js": "^0.10.0||^0.11.0" }` (glass-ui 4.0.0)
does not admit value.js 0.13.0. Any consumer installing `@mkbabb/keyframes.js` (which
depends on `@mkbabb/value.js ^0.13.0`) alongside `@mkbabb/glass-ui` gets `ELSPROBLEMS`.
`proof:deps-current` clause 3 (`proof-deps-current.mjs:237-276`) checks kf's own parse-that
realm convergence; it does NOT read glass-ui's peer range. The peer-cycle is invisible to
every gate in the repo today.

**Cure.** Author `scripts/proof-peer-satisfied.mjs`. The gate:

1. Reads `node_modules/@mkbabb/glass-ui/package.json` (if installed — glass-ui is
   `optionalDependencies`; absent in the library `gates` job). If absent, the gate records
   the skip with a note and exits 0 (no peer check possible without the package present).
2. Reads `peerDependencies` from the glass-ui manifest. For each peer range, resolves the
   INSTALLED version from `node_modules/<peer>/package.json` and checks that the installed
   version satisfies the declared range.
3. Fails with a named message for each peer violation: `"glass-ui@X.Y.Z declares peer
   @mkbabb/value.js@"RANGE" but installed value.js is V (ELSPROBLEMS)"`.

Wire into `package.json`:
```
"proof:peer-satisfied": "node scripts/proof-peer-satisfied.mjs"
```

Add to `proof:hygiene` and to `ci.yml` `demo-smoke` job (the demo arm installs glass-ui;
the library `gates` job skips if glass-ui is absent). Add to `release.yml` (via the clause 5
publish-path roster from S7 — or as a sixth step if the peer check is architecturally
distinct from the tarball surface check). Add to `gate-taxonomy.md` as a `hard` gate (the
peer violation is a device-INDEPENDENT fact — a version number mismatch is not a timing
measurement).

**This gate stays RED until glass-ui BB fixes the F-2 peer range** (a `^0.13.0` or
`>=0.13.0` peer bump). The gate is the born-RED evidence that the F-2 cross-repo-ask is a
live defect, not a future concern. It is the kf-side tripwire the BB wave must satisfy.

**Gate bite.** Red today (value.js 0.13.0 installed; glass-ui 4.0.0 declares
`^0.10.0||^0.11.0` — the installed version DOES NOT satisfy). Green when glass-ui re-pins
its peer to `>=0.13.0` and kf re-pins to the fixed glass-ui version.

---

## Born-RED gate

**`proof:no-single-option-select`** — the canonical born-RED for this wave.

- **Witness input:** `node scripts/proof-no-single-option-select.mjs` on today's tree.
  Exit code: non-zero (the script does not exist — `node: no such file or directory`).
- **RED today:** the gate script is absent from `scripts/`; `package.json` has no
  `proof:no-single-option-select` entry; the step is absent from `ci.yml`.
- **GREEN on cure:** the script exists, reads `demo/` source, finds the U4 count-guard
  pattern in every Select consumer, exits 0.
- **Gate discipline:** gate-first — the script is authored BEFORE any scan of the demo
  source tree for single-option patterns.

Secondary born-RED: **`proof:ci-coverage` clause 5 (publish-path roster, S7)**.

- **Witness input:** `node scripts/proof-ci-coverage.mjs` on today's tree, after the
  clause 5 sub-check is added to the script.
- **RED today:** `release.yml` does not invoke `proof:published-surface` or
  `proof:deps-current`; the new sub-clause finds both absent.
- **GREEN on cure:** both steps are present in `release.yml` before `npm publish`.

---

## Deps

- No sibling publish gate. All work is repo-internal: `scripts/` authors, `ci.yml` /
  `release.yml` edits, `gate-taxonomy.md` column addition.
- S8 (`proof:peer-satisfied`) stays RED until glass-ui BB publishes the F-2 peer fix;
  the gate itself ships before the fix — that is its purpose. **L.W4 is the SOLE
  AUTHOR of this gate (per DLL-24); L.W8 and L.W9 only CONSUME it** — L.W9 drives
  it GREEN by re-pinning to the BB-widened glass-ui peer range, L.W8 reads its
  status as a publish precondition. Neither re-authors the gate.
- No dependency on L.W1 / L.W2 / L.W3. L.W4 is file-disjoint from the engine/compiler/
  ingest work. The wave can proceed in parallel with Band A's replay-equality + compiler
  waves. The only ordering constraint: S7's `proof:ci-coverage` clause 5 must land before
  the next `release.yml`-triggered publish (which is L.WZ's version cut).

---

## Bite — what regression each clause gates

| Clause | Regression it catches |
|--------|----------------------|
| S1 (report-all) | A flake in gate N hiding correctness misses in gates N+1 through N+70 — the K whack-a-mole root |
| S2 (settle primitive) | A fixed-ms `waitForTimeout(800)` race on the Linux runner that macOS passes silently — the 259-sleep macOS-pass/Linux-fail class |
| S3 (Linux repro) | A Linux-specific flake with no local repro path — developer must push + wait 30 min per iteration |
| S4 (CATEGORY + cure columns) | An `observe-only` gate added without a named cure — `inv-L-device-honesty` drifts back to informal notes inside the reason string |
| S5 (`proof:no-single-option-select`) | A future component removing the U4 lone-option guard — renders a single-option dropdown unconditionally, CI never notices |
| S6 (M2 touch-commit) | Playwright `.click()` in `hasTouch` context silently certifying the wrong event path — the gate passes for the wrong reason |
| S7 (release.yml roster) | A publish that ships a stale `@mkbabb/*` floor or mismatched API surface without either gate firing — the exact G-CONST-1 recurrence `proof:deps-current` was built to forbid |
| S8 (`proof:peer-satisfied`) | A glass-ui peer range that rejects the installed value.js version — ELSPROBLEMS on every consumer installing both; invisible to CI until the gate exists |
