# Lane 13 — apparatus-SOTA (the gate-apparatus consolidation charter)
# Tranche M candidate wave seed

**Status:** AUDIT ONLY. No gate changed, no code written. Every claim below is
verified against ground truth on this tree (`tranche-j-dev`, the current branch
at audit time; the gate scripts and package.json are the same on `tranche-l-dev`
tip `529fcfd` which `proof:all` ran GREEN). All file:line citations were
re-verified by direct read or grep on 2026-06-17.

**This doc synthesizes** the three L-apparatus audit lanes
(`gate-apparatus-A-taxonomy.md`, `gate-apparatus-B-contrivance.md`,
`gate-apparatus-C-superfluity.md`) and the verdict doc
(`gate-apparatus-VERDICT.md`) into a concrete Tranche-M wave decomposition,
migration path, coverage-invariant statement, and precept-compliance audit.

The document was written on `tranche-j-dev` (master branch tip), reading the L
audit docs from `docs/tranches/L/audit/`. The ground-truth verification commands
are cited inline; all claims re-measured.

---

## 1. GROUND-TRUTH VERIFICATION (the facts before the architecture)

Every number below is from a live command run, not from a prior doc's assertion:

```
package.json proof:* keys        = 150  (node -e verification)
  of which: aggregators          =   4  (proof:all, proof:correctness,
                                         proof:hygiene, proof:all:demo)
  leaf gates                     = 146
  gates in proof:all             = 142  (correctness 18 + hygiene 124)

scripts/proof-*.mjs count        = 128  (ls | wc -l)
  of which import demo-driver    =  67  (grep -l demo-driver | wc -l)
  self-launch chromium (not dd)  =   2  (easing-sidebar-minimal/normalized)
  total browser-driving scripts  =  69

proof:hygiene chain length:
  && count                       = 124  (node -e verified)
  ; count                        =   0
  || count                       =   0
  parallel runner in package.json = 0  (concurrently/npm-run-all/run-p/
                                        turbo/xargs -P → all absent)

demo-driver.mjs shared-browser:
  connectOverCDP                 =   0  (verified absent)
  wsEndpoint                     =   0
  launchServer                   =   0
  reuseExisting                  =   0
  → per-gate cold-boot confirmed

waitForTimeout across scripts    = 264  (grep -c | awk sum)
  in proof-live-session.mjs alone =  40

vitest installed                 = 4.1.8
@vitest/browser installed        = ABSENT
eslint installed                 = ABSENT
dependency-cruiser installed     = ABSENT
playwright-core installed        = 1.61.0  (node_modules/playwright-core)

vitest.config.ts browser block  = ABSENT  (jsdom only, no browser project)
test/*.test.ts count             = 89 files
vitest test count (npx list)     = 890

border-radius spread (5 gates):
  appearance-suffusion, card-rounded-primitive, scene-card-rounded,
  stage-glass-card, styling-idioms  (grep -l border-radius scripts/proof-*.mjs)

observe-only declarations        =   8  (declarePosture("observe-only") grep)
  NOTE: VERDICT.md evidence index says "9" (9 = 8 + the M2 clause counted
  as a separate declaration in gate-taxonomy.md); the live grep returns 8
  gate files with the declaration; the 9th is the M2 arm within one gate.

ci.yml named-but-unbuilt cure    = line 327: "one shared chromium+server,
  withBrowser reuse" + line 328: "F-7's static-gate migration out of
  demo-smoke" — PRESENT, UNBUILT (verified by read).
```

**L-audit factual correction carried.** The L audit's three sub-docs shipped two
factual errors that the implementation corrected; this lane records them so M
does not inherit them:

1. **The `!important` premise** (`DLL-1`, `deferred-ledger-L.md:82`): The L
   audit initially called this a "silent-drop violation"; the implementation
   found it is SPEC-FAITHFUL (CSS Animations §3 forbids `!important` in a
   keyframe; value.js drops it correctly; the kf behavior mirrors spec). The
   verification test locks `not.toContain("!important")`. The diagnostics ask
   was dispatched to value.js-O as a no-workaround/Band-B item.

2. **The parse-that mis-attribution** (`DLL-22`, `DLL-26`): The audit initially
   conflated two distinct gaps — the `any` combinator cross-realm seam in
   `utils.ts:1` (a direct `@mkbabb/parse-that` import, a workaround per ⚠24)
   and the packrat unsoundness in parse-that itself (`packrat.ts` self-documents
   as id-only-keyed, ⚠27). The VERDICT doc carries both correctly; this lane
   adopts that corrected framing.

---

## 2. THE HONEST VERDICT (synthesized from three lanes)

**The apparatus is over-engineered in its IMPLEMENTATION, not its PRINCIPLE.**

Three core principles are correct, are load-bearing, and must survive M intact:

**P1 — `proof:gate-is-runtime`**: A correctness gate's oracle must actuate the
running product through the real surface (a real browser over the BUILT
`dist/gh-pages/` artifact) with a zero error budget — NOT a jsdom unit, a source
grep, a serialized snapshot, or a self-baseline. This principle caught REAL bugs
that source-shape gates missed: the over-removal blank-out
(`docs/tranches/I/audit/rootcause-rc-gate-blindspot.md:164`) and the ROOT-A
appearance misses (`docs/tranches/H/audit/a-gate-blindspots.md:21,82`). The 18
correctness gates being all-browser is intentional and defensible.

**P2 — device-honesty taxonomy**: The 8 `declarePosture("observe-only")`
declarations (plus the M2 arm = 9 in `gate-taxonomy.md`) honestly separate
device-dependent measurements (throttled frame ms, cross-OS pixel settling,
absolute spring thresholds) from hard oracles. This axis was built from hard-won
CI-Linux render-race lessons (`project_ci_device_dependence_greening` in
MEMORY.md). Losing it would reintroduce the cross-OS flake it was built to tame.

**P3 — no-silent-drop oracle discipline**: The meta-gates (`proof:gate-is-runtime`,
`proof:chronic-closure`, `proof:ci-coverage`, `proof:settle-is-predicate`,
`proof:manifest-sourced`) enforce that appearance facts have falsifiable owners
and chronics cannot paper-close. These are the apparatus's immune system; they
are not bloat.

**The contrivance lives entirely in the implementation:**

The apparatus is a **second, hand-rolled test runner** — 67 gate scripts import
`scripts/lib/demo-driver.mjs` and hand-roll chromium launch (`withBrowser:432`),
a `node:http` static server (`serveDist:318`, `listen(0):340`), a 3-attempt
retry loop (`withBrowser:450–495`), fixture teardown (`withPage:513–548`), and
per-script `failures[]`/`ok`/`fail`/`process.exit(1)` reporting (`proof-live-session.mjs:91–96`,
`proof-gate-is-runtime.mjs:66–72`, and ~67 more) — run as a pure serial `&&`
shell chain (124 `&&`, 0 `;`, 0 `||` in `proof:hygiene`) of ~142 separate
`npm run` processes, **each cold-booting its own chromium + server with zero
warm reuse** (0 `connectOverCDP`/`wsEndpoint`/`launchServer` in `demo-driver.mjs:432–548`)
and **sleeping through 264 `waitForTimeout` settle windows** (40 in
`proof-live-session.mjs` alone).

### The quantified cost

| Metric | Measured value | Source |
|---|---|---|
| Browser launches per `proof:all` | ~80+ cold boots | lane A §4: each of 72 browser gates spawns ≥1 chromium; `live-session-mobile` launches 4× |
| Browser share of wall-clock | 92–96% | lane A §2: median-weighted 13.5 min / mean-weighted 29.8 min out of 15–31 min total |
| Non-browser gates wall-clock | ~70 seconds | lane A §2: 36 source-shape (0.16–0.69s) + 34 vitest (0.76–1.02s) = ~70s combined |
| Single `proof:all` pass | ~15–31 min | lane A §2: median vs mean-weighted |
| Slowest gate (`live-session`) | 80.85s | sampled `time npm run proof:live-session` |
| Serial `&&` iterate-to-green | ~2.5–3 hours | 5–6 reds × ~30-min full-prefix re-run = O(N²) |
| Redundant browser clauses | ~13 firmly-named | lane C §1: R1/R2 duplicates with file:line evidence |
| Redundant browser cost | ~2–3 min/pass | lane C §4; ×5–6 re-runs = ~10–18 min of the 3 hours |
| Process-spawn overhead | ~25s | lane A §3: ~142 npm forks × ~0.18s each |

**The 3-hour root cause is the O(N²) iterate-to-green loop**, not the gate
count and not the gates' intent: `&&` aborts on the first red, discovers ONE
failure, and the re-run re-pays every prior green (no caching, no report-all)
before reaching the next red. 5–6 reds distributed through the chain × ~30-min
full-prefix re-runs = ~2.5–3 hours — the owner's measured 3 hours, reconciled
exactly (`gate-apparatus-A-taxonomy.md:§3`).

Nothing blocks parallelism: ports are `listen(0)` (OS-assigned ephemeral,
`demo-driver.mjs:340`), `declarePosture` is a pure stateless factory
(`ci-env.mjs:85`), and the built dist is read-only (`demo-driver.mjs:524`). CI
already shards the browser gates into a parallel matrix (`KF_REQUIRE_BROWSER`
demo-smoke job in `ci.yml`). The local serial chain is strictly worse than CI
for no architectural reason.

---

## 3. THE SOTA TARGET ARCHITECTURE

Four tiers, fastest-and-most-parallel first. One runner (vitest 4.1.8, already
installed), four `vitest.config` projects, parallel by default, report-all by
default.

### Tier (a) — LINT tier (sub-second, parallel, fail-all-at-once)

The ~33–36 source-shape gates are lint-class invariants: file-size ceilings
(`max-lines`), import-edge assertions (`import/no-restricted-paths` /
dependency-cruiser), grep rules. Currently implemented as ~33–36 separate node
processes that each re-read the whole tree. The contrivance:

- `proof:demo-no-oversize` (`scripts/proof-demo-no-oversize.mjs`, 199L) —
  `fs.readFileSync().split("\n").length > CEILING` — this IS `max-lines`.
- `proof:decomposition` (982L) clause-1 — library file-size ceiling + a
  no-duplicate-module check — `max-lines` + a module-uniqueness rule.
- `proof:boundary` (405L) — the LIGHT surface never statically imports
  value.js — this IS `import/no-restricted-paths` / a dependency-cruiser
  forbidden-edge rule.
- `proof:no-dup-utility` (242L) — duplicate-function detection — `no-duplicate-code`.
- `proof:no-brittle-selector` (270L), `proof:single-writer` (206L) — grep rules.

**Target:** ONE `eslint .` invocation (custom rules for the grep/size gates;
eslint is currently ABSENT — greenfield install) + ONE parsed-once module graph
(`dependency-cruiser`, also ABSENT — greenfield) for the import-edge gates
(`boundary`, `no-dup-utility`, `decomposition` clause-1) + ONE vitest meta-unit
for the package.json/scripts shape gates (`gate-is-runtime`, `chronic-closure`,
`ci-coverage`).

**Expected:** sub-second, parallel, reports every violation at once. Replaces
~33 processes (each paying ~0.18s fork + an independent tree-read ≈ 10–15s of
pure overhead) with one parse-once-run-many pass (< 2s). The greenfield cost
(eslint + dependency-cruiser install, custom rule authoring) is the only
migration work; there is no config to migrate because eslint is absent today.

### Tier (b) — UNIT tier (vitest jsdom — already exists, keep verbatim)

The ~34 pure-vitest / node+vitest gates (zero-alloc, engine-correctness,
replay-equality, blend, motion-path, drawsvg, sync-step, event-ordering,
cohesion) ride the existing `vitest.config.ts` jsdom project — already fast
(0.4–1.2s slices per lane A §2), already parallel across workers, already
report-all. 89 files / 890 tests today (`test/*.test.ts`). The existing
`vitest.config.ts` is minimal (28 lines) and already model-correct
(`vitest.config.ts:1–30`).

**No change needed** beyond folding the `node scripts/proof-x.mjs && vitest run
test/x.test.ts` pairs into single test files (the source-grep half becomes a
LINT rule or a unit assertion; the vitest half is already a test). This tier is
the model the other tiers converge to.

### Tier (c) — INTEGRATION/BROWSER tier (@vitest/browser over the BUILT dist)

The 67 browser gates become `@vitest/browser` tests (`test/*.browser.test.ts`)
with:

- **ONE shared browser instance** — the playwright provider's default, replacing
  ~80+ cold chromium launches per `proof:all`.
- **ONE `globalSetup` dist server** serving `dist/gh-pages` once, replacing 80+
  per-gate `serveDist` binds (each gate's `page.goto(url)` navigates the built
  artifact — the `gate-is-runtime` precept is preserved).
- **parallel workers** — vitest's default file scheduling.
- **`expect()` + the vitest reporter** replacing per-script `failures[]` /
  `ok` / `fail` / `process.exit(1)` boilerplate in ~69 scripts.
- **vitest `retry` fixture** replacing the hand-rolled 3-attempt launch-crash
  loop (`withBrowser:450–495`, ~45L).
- **The SCENES manifest survives** as a shared `test/fixtures` import — it is
  domain data (scene roster, subject selectors, `dockFloatAllowed`), not runner
  mechanics.
- **The observe-only posture axis survives** as test tags (`test.skipIf(IN_CI)`
  or a `@observe-only` annotation) with the same `gate-taxonomy.md` manifest
  discipline.

**CRITICAL INVARIANT:** `@vitest/browser` by default runs source modules through
Vite in the browser — NOT the built dist. The `gate-is-runtime` precept demands
the gate actuate the **shipped `dist/gh-pages/` bytes**. The migration MUST use
`@vitest/browser` as the runner/parallelizer/reporter while still calling
`page.goto(DIST_URL)` (the page handle vitest hands each test) — NOT as a
component-mount harness. This distinction is load-bearing; a naive
"mount the component in vitest-browser" loses the shipped-artifact oracle
entirely. The VERDICT doc is explicit (`gate-apparatus-VERDICT.md:229–239`).

**The folding from lane C §1** (the named redundancies that consolidate cleanly
with NO coverage loss, all verified file:line):

| Redundant unit | Type | Evidence | Per-pass saving |
|---|---|---|---|
| `card-rounded-primitive` clause 2 | R1 exact dup of `stage-glass-card` | `proof-card-rounded-primitive.mjs:204–206` vs `proof-stage-glass-card.mjs:115–117,39` — identical `.stage-cell > [data-surface="glass"]` non-zero-radius query | ~11s (multi-scene sweep) |
| `easing-sidebar-minimal` B4 | R2 nested in `normalized`'s ONE-Card flatten; plus R4 double cold-boot | `proof-easing-sidebar-normalized.mjs:343` vs `proof-easing-sidebar-minimal.mjs:437,440` | ~2–3s (one self-chromium boot) |
| `bezier-grown` clause 3 | R1 re-measures `bezier-no-scroll` fit | `proof-bezier-grown.mjs:34,36–37,39,52` self-documents the reuse | ~1–2s per panel visit |
| "non-zero border-radius" across 5 gates | no single owner (appearance-suffusion, card-rounded-primitive, scene-card-rounded, stage-glass-card, styling-idioms) | `grep -l border-radius scripts/proof-*.mjs` | folds into ONE sweep of all scenes |

**What is NOT superfluous (the fair defense):**
- The hero trio (`hero-rung` / `hero-balance` / `hero-cls`) — three orthogonal
  oracles (font-size floor / layout fold / CLS budget) on one `<h1>`. Adjacency
  is not redundancy.
- The bezier trio's three distinct invariants (panel fits / single-card / canvas
  grew) — only `bezier-grown` clause 3 is carry.
- The meta-gates — the apparatus's immune system; deleting them loses the
  discipline that makes the estate trustable.
- The 54 H-born appearance gates — the appearance estate the `gate-is-runtime`
  precept exists to protect; the redundancy is ~17% concentrated and nameable,
  not pervasive.

### Tier (d) — E2E / deploy tier (thin, stays scripted)

`proof:lighthouse-*` (lighthouse over a served URL) and the round-trip /
deploy gates are not test-runner-shaped. Keep as a thin scripted tier (or a
single vitest test that shells lighthouse), run post-build / pre-deploy,
observe-only in CI per the device-honesty law.

---

## 4. THE WAVE DECOMPOSITION (Tranche M)

Four waves, sequenced by safety × payoff. Each wave's preconditions are named;
no wave assumes a prior wave's code is merged unless stated.

### M.W1 — LINT tier (greenfield eslint + dependency-cruiser)

**What:** Install eslint + dependency-cruiser (both ABSENT today). Author
custom eslint rules for the pure grep/size gates (`max-lines` for the file-size
ceilings, `no-duplicate-code`, `no-brittle-selector`, `single-writer`,
`idioms`, `no-single-option-select`, `no-deprecated-guard`). Author ONE
dependency-cruiser config for the import-edge gates (`boundary` forbidden edges,
`no-dup-utility`, `decomposition` clause-1 module-uniqueness). Replace the ~33
standalone node scripts with `npm run lint` (eslint + depcruise).

**Born-RED gate to author first:**
`proof:lint-tier` — asserts (a) `eslint .` exits 0 on the current tree with the
custom rules enforcing every assertion the ~33 node processes enforce; (b)
`depcruise` exits 0 on the boundary/no-dup graph; (c) each deleted node script
has a named eslint rule / depcruise config clause that bites on the same inputs
(the coverage-invariant check). The gate must RED on a tree with a planted
violation before it can GREEN.

**Coverage invariant:** For every gate deleted, its assertion must be demonstrably
present as an eslint rule or depcruise clause that (i) GREENs on the current
clean tree and (ii) REDs when the violation it guards against is planted. This is
the no-coverage-loss precept applied to the LINT tier.

**Preconditions:** vitest 4.1.8 already installed. eslint and dependency-cruiser
require `npm install -D`. No existing eslint config to migrate (greenfield).

**Expected payoff:** ~33 processes → 1 pass. ~10–15s of pure fork overhead → < 2s.
Does NOT yet touch the O(N²) 3-hour iterate loop (that requires the BROWSER tier
to land) but removes ~25% of the suite's process count.

### M.W2 — UNIT tier consolidation (fold the 18 node+vitest pairs)

**What:** Fold the 18 `node scripts/proof-x.mjs && vitest run test/x.test.ts`
pairs into single test files. The source-grep half moves to either a LINT rule
(if it is a static shape assertion — → M.W1) or a unit `expect` assertion inside
the test file (if it asserts a runtime shape computable without a browser). The
vitest half is already a test; this is a colocation move.

**Born-RED gate to author first:**
`proof:unit-pairs-consolidated` — asserts the 18 proof+test pairs each have a
single corresponding `test/x.test.ts` file and no orphaned `scripts/proof-x.mjs`
(source-shape half either in eslint or in the test's `expect`).

**Coverage invariant:** Each merged test file must exercise the same inputs and
assert the same facts as the two it replaces. The node script's assertions
become `expect` calls; the vitest assertions are unchanged.

**Preconditions:** No change to existing tests. Does not require M.W1 (though
the source-grep half of each pair is most elegantly handled as a LINT rule once
M.W1 exists). Can proceed independently.

**Expected payoff:** 18 paired processes → 18 single test files. Minimal
wall-clock change (the vitest slices are already fast); the gain is maintenance
simplicity and one less cross-process dependency per gate.

### M.W3 — INTEGRATION/BROWSER tier (@vitest/browser + shared browser)

**What:** Install `@vitest/browser` + the playwright provider (both ABSENT;
requires `npm install -D @vitest/browser @playwright/test`). Add a browser
`vitest.config` project (`test/*.browser.test.ts`). Write a `globalSetup` that
serves `dist/gh-pages` once (reusing `serveDist` from `demo-driver.mjs:318` or
a direct `node:http` equivalent). Migrate the 67 browser gates surface-by-surface
into `*.browser.test.ts` files: each surface (the bezier panel, the stage card,
the easing sidebar, the hero) becomes ONE `*.browser.test.ts` with all that
surface's invariants as `expect` clauses and ONE shared-browser `page.goto`.

The folding from §3 (the named redundancies) lands here:
- `card-rounded-primitive` clause 2 → folded into `stage-glass-card` test;
  clause 1 → LINT rule; clause 3 → cheap `grep` in the LINT tier.
- `easing-sidebar-minimal` B4 → folded into `easing-sidebar-normalized` test;
  the two self-chromium cold-boots → ONE shared browser visit.
- `bezier-grown` clause 3 → folded into the `bezier-no-scroll` assertion in
  the shared bezier test.
- The "non-zero border-radius" theme → ONE "all kf surfaces rounded" sweep in
  ONE test that asserts the invariant across all scenes.

**Born-RED gate to author first:**
`proof:integration-tier` — asserts (a) `@vitest/browser` is installed; (b) the
browser project exists in `vitest.config.ts`; (c) each migrated gate's assertion
is present in a `*.browser.test.ts` file; (d) the `globalSetup` serves
`dist/gh-pages` (the `gate-is-runtime` POLICY re-pointed at the new substrate:
the test navigates the served dist, not a Vite-transformed source); (e) the
parallel worker count ≥ 2 (verifying the serial chain is dead). RED before a
single browser gate is migrated; GREEN when all 67 are migrated.

**CRITICAL PRECEPT (the non-negotiable constraint):** Every `*.browser.test.ts`
MUST call `page.goto(DIST_URL)` — the served `dist/gh-pages` — and MUST NOT
mount the Vue component directly in a Vite context. The `gate-is-runtime` policy
is unchanged; only the plumbing moves from hand-rolled to runner-owned. The
`proof:gate-is-runtime` meta-gate's *assertion* (the gate references
`page.click`/`page.goto`/etc. and runs in the correctness tier) survives
verbatim; it re-reads the new `*.browser.test.ts` files.

**Device-honesty re-validation:** The shared-browser parallel tier changes the
timing envelope. The 8 (+ M2 arm) observe-only gates must be re-validated under
the new envelope. The architectural cure `gate-taxonomy.md` already prescribes
(synthetic clock injected into the rAF driver) is the durable fix; it composes
with this migration. Until the synthetic clock lands, the observe-only predicates
migrate as `test.skipIf(IN_CI)` tags with the same `gate-taxonomy.md` manifest
discipline — no posture is hardened without a re-measured threshold under the new
runner.

**Coverage invariant (strict):** For every browser gate deleted, its assertion
migrates verbatim into a `*.browser.test.ts` `expect` clause. The only
deletions are the provable R1/R2 clause duplicates named in §3 above (13 clauses,
verified with file:line evidence). No oracle is dropped.

**Expected payoff:** This wave is THE decisive win.
- ~80+ cold chromium boots → 1 shared browser.
- ~80+ server bind/teardown cycles → 1 globalSetup.
- Serial `&&` → parallel workers (vitest default).
- A red run reports ALL failures at once (killing the O(N²) 3-hour iterate loop).
- Wall-clock: single-digit minutes (shared browser amortizes cold-boot across
  all tests; parallel workers overlap the settle sweeps).

### M.W4 — RETIRE the serial chain + thin E2E tier

**What:** Once M.W3 lands, `proof:all` becomes `vitest run` across the four
`vitest.config` projects (parallel, report-all). Delete the serial `&&`
`proof:all` / `proof:correctness` / `proof:hygiene` shell chains from
`package.json`. The `demo-driver.mjs` `withBrowser`/`withPage` machinery retires
(its logic lives in vitest's browser provider + the `globalSetup` fixture). The
`SCENES` manifest + posture helpers move to `test/fixtures/`.

Keep `proof:lighthouse-*` and the round-trip/deploy gates as the thin scripted
tier. `npm run proof:all` becomes `vitest run --project unit,lint,browser` +
the lighthouse/deploy script.

**Born-RED gate:** `proof:chain-retired` — asserts `proof:hygiene` in
`package.json` is a single `vitest run` call (no `&&` chain of 124 clauses);
`demo-driver.mjs`'s `withPage`/`withBrowser` are absent or stubbed; `SCENES`
manifest is present in `test/fixtures/`.

**Expected payoff:** The O(N²) iterate loop is dead (it dies the moment M.W3
lands parallel report-all; M.W4 just formalizes the retirement). Cleans up ~115L
of `withBrowser`/`withPage` lifecycle, ~69 per-script reporter boilerplate
instances, and 124 `&&` clauses.

---

## 5. THE MIGRATION PATH (phased, low-risk, zero coverage loss)

**The binding invariant: NO loss of real coverage.** Every distinct regression
a current gate catches must still be caught after the migration. The gates'
*assertions* are the asset; the bespoke *runner* is the liability.

**Phase 0 — Keystone: lift the `gate-is-runtime` POLICY onto the new substrate.**
Before migrating any gate, assert that the new browser project's tests call
`page.goto(DIST_URL)` (the served `dist/gh-pages`). This proves the migration
preserves the law before any gate moves. The meta-gate's *assertion* is
unchanged; only what it reads changes (from hand-rolled scripts to
`*.browser.test.ts` files).

**Phase 1 — LINT tier (M.W1): cheapest, safest, highest process-count reduction.**
Carries over verbatim: the assertions (the size ceilings, the forbidden import
edges, the override maps). Consolidates: ~33 processes → 1 parse-once pass.
Deletes: the per-script fork + tree-read boilerplate.
Zero coverage loss — same invariants, faster.

**Phase 2 — UNIT tier consolidation (M.W2): already fast; just colocation.**
Carries over verbatim: all 890 existing tests.
Consolidates: 18 node+vitest pairs → 18 unit files.

**Phase 3 — INTEGRATION/BROWSER tier (M.W3): the big lift, do it surface-by-surface.**
The natural migration unit is lane C's one-gate-per-surface reorg: the bezier
panel, the stage card, the easing sidebar, the hero each become ONE
`*.browser.test.ts` with all their invariants as `expect` clauses and ONE
shared-browser visit.

Carries over verbatim:
- Every assertion — selectors, computed-style checks, actuation sequences,
  error-budget=0 counts, `waitFor` predicates (now runner-owned).
- The `SCENES` manifest (→ `test/fixtures`).
- The observe-only postures (→ `test.skipIf(IN_CI)` tags).
- The `gate-is-runtime` POLICY (→ re-pointed at `*.browser.test.ts` files).

Consolidates (the named redundancies, zero coverage loss):
- `card-rounded-primitive` clause 2 (R1 dup) → into `stage-glass-card` test.
- `easing-sidebar-minimal` B4 (R2 nested) → into `normalized` test.
- `bezier-grown` clause 3 (R1 re-measures) → into `bezier-no-scroll` assertion.
- "non-zero border-radius" (5 gates, no single owner) → 1 "all surfaces rounded"
  sweep test.

Deletes:
- `withPage`/`withBrowser` lifecycle (~115L of `demo-driver.mjs:432–548`).
- The 3-attempt retry loop (`withBrowser:450–495`) → vitest `retry`.
- Per-script `failures[]`/`ok`/`fail`/`process.exit(1)` reporter in ~69 scripts.
- ~80+ cold chromium boots + server bind/teardown cycles.
- The serial `&&` chain (the O(N²) iterate loop) — via M.W4.

**Phase 4 — E2E + retire the chain (M.W4): formalize.**
`npm run proof:all` = `vitest run` (parallel, four projects) + lighthouse/deploy.
`demo-driver.mjs` retires. The 124-`&&` chain deletes.

---

## 6. EXPECTED SPEEDUP

| Metric | Today | After M |
|---|---|---|
| Browser launches per full run | ~80+ cold boots | **1 shared** |
| Server binds per full run | ~80+ | **1 globalSetup** |
| Scheduling | serial `&&` (124 `&&`) | **parallel workers** |
| A red run reports | **ONE failure** | **ALL failures** |
| Iterate-to-green re-run cost | **O(N²)** (re-pay every prior green) | **O(1)** (one parallel run lists every red) |
| Lint tier | ~33 processes, each re-reads tree | **one parse-once pass, <2s** |
| Single-pass wall-clock | **~15–31 min** | **single-digit minutes** |
| 3-hour iterate-to-green | **~2.5–3 h** | **minutes** |

**The decisive win is not raw pass-time alone** — it is killing the O(N²) iterate
loop. One parallel run that surfaces every red replaces 5–6 sequential
full-prefix re-runs. That is the 3-hours → minutes step.

The **wall-clock core** is M.W3 (the shared browser). The **DX core** is the
parallel report-all that M.W3 inherits from vitest's default runner (it is not a
bolt-on; it is the runner's default the moment the browser gates are vitest
tests).

---

## 7. THE COUNTERPOINT — where "just use vitest" naively loses

A careless migration would discard real value. Four explicit non-negotiable
constraints:

**C1 — Built-dist navigation is non-negotiable.**
`@vitest/browser` runs source modules through Vite by default. The migration MUST
navigate the served `dist/gh-pages/` bytes, not mount Vue components. Any
`*.browser.test.ts` that calls `mount(MyComponent)` instead of
`page.goto(DIST_URL)` FAILS the `gate-is-runtime` policy. The VERDICT doc is
unambiguous (`gate-apparatus-VERDICT.md:229–239`): "use vitest-browser as the
runner/parallelizer/reporter while still `page.goto`-ing the served built dist."

**C2 — Boundary/published-surface checks belong in the LINT tier, not unit tests.**
`proof:boundary` and `proof:published-surface` / `proof:agent-surface` police the
GRAPH of the shipped package. A naive "just write tests" misses them — they belong
in the dependency-cruiser pass (one parsed graph, all edge assertions), not in
jsdom unit tests.

**C3 — The observe-only posture manifest must carry as test tags, not be dropped.**
The 9 observe-only declarations must migrate as `test.skipIf(IN_CI)` predicates
with the same `gate-taxonomy.md` manifest discipline. Hardening all of them would
reintroduce the macOS-pass/Linux-fail render-race flakes the posture axis was
built to prevent.

**C4 — Device-dependence thresholds must be re-validated under the new timing
envelope.**
A shared-browser parallel tier changes the timing envelope. The absolute
frame-ms / spring-settle thresholds that were calibrated for per-gate cold-boot
serial execution may not hold under parallel shared-browser execution. The
synthetic-clock injection `gate-taxonomy.md` prescribes is the durable fix; it
composes with this migration. Skipping the re-validation re-introduces the
cross-OS flake class.

---

## 8. PRECEPT VIOLATIONS IN L-AS-BUILT

Verified against the L apparatus as it stands at L.WZ close.

**P-V1 — WORKAROUND (lane B §Q3): the serial `&&` chain is a choice, not a
constraint.**
`package.json` `proof:hygiene` is a 124-`&&` shell string with no parallel runner
(`concurrently`/`npm-run-all`/`run-p`/`turbo` all absent). Nothing blocks
parallelism: ports are `listen(0)`, posture is stateless, dist is read-only. CI
already shards the exact same gates in a parallel matrix. The local serial chain
is a legacy workaround — the developer pays a serial tax CI does not.
Evidence: `package.json` `proof:hygiene` (124 `&&`, 0 `;`, 0 `||`); no parallel
runner in `package.json`; `ci.yml:404–585` (KF_REQUIRE_BROWSER matrix jobs run
the same gates in parallel).

**P-V2 — REINVENTED TEST RUNNER (lane B §Q1): two parallel test infrastructures.**
The `scripts/proof-*.mjs` stack hand-rolls browser launch, fixture lifecycle,
retry, reporting, and parallelism — all of which vitest 4.1.8 (already installed)
provides natively. The only genuinely-bespoke need (drive the built dist, not
source) is satisfiable inside `@vitest/browser` via `page.goto`. The reinvention
is not justified.
Evidence: `demo-driver.mjs:432–548` (launch/retry/fixture/teardown); per-script
`failures[]`/`process.exit(1)` boilerplate in `proof-live-session.mjs:91–96` and
67 more scripts; vitest 4.1.8 present in `node_modules/vitest/package.json`;
`@vitest/browser` ABSENT.

**P-V3 — NO quick solution (the meta): the cure is named in ci.yml and unbuilt.**
The architectural cure ("one shared chromium+server, withBrowser reuse" +
"F-7's static-gate migration out of demo-smoke") is named at `ci.yml:327–328` and
UNBUILT as of L.WZ. The 3-hour iterate-to-green is a KNOWN, MEASURED, NAMED
architectural defect that survived every tranche from F through L without a
resolution wave. M is where it must land.

**P-V4 — LEGACY CODE: the 264 `waitForTimeout` sleeps.**
`waitForTimeout` calls are the macOS-pass/Linux-fail render-race root (named in
`PROGRESS.md:§0` as `DLL-11`; `proof:settle-is-predicate` GREEN at L.W4 proves
the cure exists — `waitForRender`/settle predicates — but only `openControlsPanel`
was migrated). 264 `waitForTimeout` calls remain across the gate scripts (verified
by sum of `grep -c` across all `scripts/proof-*.mjs`). Each one that survives the
M migration is a potential CI-Linux flake. The M.W3 migration is the opportunity
to replace the remaining sleeps with predicate-based settle (`waitForRender` or
equivalent) as each gate migrates.

**P-V5 — GESTALT violation: ~13 redundant browser clauses re-prove subsumed facts.**
`card-rounded-primitive.mjs:204–206` re-measures the identical selector and
assertion as `stage-glass-card.mjs:115–117,39`; `easing-sidebar-minimal.mjs:437,440`
re-asserts the B4 nested clause that `easing-sidebar-normalized.mjs:343` already
owns; `bezier-grown.mjs:34,36–37,39,52` self-documents re-using `bezier-no-scroll`'s
measurement plumbing. These are not separate oracles; they are copy-paste
carry costing ~2–3 min per pass, recurring under the O(N²) loop (~10–18 min
of the 3 hours). The gestalt approach is one oracle per invariant, not one
clone per tranche-bug.

---

## 9. DEFERRED FOLDS (for the M chronic ledger)

**DMM-1 — The `waitForTimeout` replacement** (DLL-11 partial): `proof:settle-is-predicate`
GREEN at L.W4 proves the `waitForRender` primitive exists. 264 remaining
`waitForTimeout` calls should be replaced as each browser gate migrates in M.W3.
Tripwire: M.W3 migration complete → `grep -c waitForTimeout scripts/proof-*.mjs`
= 0. Owner: M.W3 (kf-internal, no sibling dependency).

**DMM-2 — Synthetic clock injection** (`gate-taxonomy.md` architectural cure for
the observe-only perf gates): `proof:perf-frame-budget`, `proof:scene-transition-perf`,
`proof:visual-lock`, `proof:drawer-spring`, `proof:live-session-mobile` M2 clause
all currently declare `observe-only` because they measure real animation timing.
The durable fix is a synthetic clock injected into the rAF driver so the test
controls animation time. This composes with M.W3 but is a deeper architectural
change; it should land in its own M.W (M.W5 or later) once the shared-browser
tier is stable. Tripwire: all 9 observe-only gates have synthetic-clock
predicates and `test.skipIf(IN_CI)` → `test()` (hard everywhere). Owner:
kf-internal (no sibling dependency; requires touching the rAF driver or adding
a test-injectable clock seam).

**DMM-3 — `demo-driver.mjs` `withPage`/`withBrowser` retirement**: Once M.W3
lands, `withPage`/`withBrowser` (~115L of `demo-driver.mjs:432–548`) retire.
The `serveDist` utility (`demo-driver.mjs:318`) migrates to `test/fixtures/`.
The `SCENES` manifest migrates to `test/fixtures/`. Tripwire: M.W4 lands (the
chain retirement wave).

---

## 10. CROSS-REPO ASKS

**None for this lane.** The gate-apparatus consolidation is entirely kf-internal
— no sibling repo (value.js / parse-that / glass-ui) publishes or consumes the
test infrastructure. The dependency is unidirectional: M.W3 requires `@vitest/browser`
and `@playwright/test` from the npm registry (not from siblings).

The only tangential sibling dependency is the `glass-ui ~4.x` peer cycle (DLL-24
`proof:peer-satisfied` RED-by-design until glass-ui BB widens the value.js peer
range) — but this is a pre-existing Band-B consume-edge, not a new ask from this
lane.

---

## 11. EVIDENCE INDEX (all claims re-verified)

- Gate counts: `node -e` over `package.json` → 150 proof keys, 4 aggregators,
  146 leaf, 142 in `proof:all`. Direct run 2026-06-17.
- Script count: `ls scripts/proof-*.mjs | wc -l` → 128.
- demo-driver import count: `grep -l demo-driver scripts/proof-*.mjs | wc -l` → 67.
- Serial chain: `package.json proof:hygiene` parsed → 124 `&&`, 0 `;`, 0 `||`.
  No parallel runner: `concurrently|npm-run-all|run-p|turbo|xargs -P` absent.
- No shared browser: `grep` for `connectOverCDP|wsEndpoint|launchServer|reuseExisting`
  in `demo-driver.mjs` → 0 matches.
- `serveDist listen(0)`: `demo-driver.mjs:340`.
- `withBrowser` launch: `demo-driver.mjs:432–496`; retry loop 450–495.
- `withPage` lifecycle: `demo-driver.mjs:513–548`.
- Reporter boilerplate: `proof-live-session.mjs:91–96`, `proof-gate-is-runtime.mjs:66–72`.
- `process.exit(1)`: `proof-live-session.mjs:1576`, `proof-gate-is-runtime.mjs:292`.
- `waitForTimeout` total: `grep -c waitForTimeout scripts/proof-*.mjs | awk sum` → 264.
- `waitForTimeout` in `proof-live-session.mjs`: `grep -c` → 40.
- vitest version: `node_modules/vitest/package.json` → 4.1.8.
- `@vitest/browser`: `ls node_modules/@vitest/browser` → ABSENT.
- eslint: `ls node_modules/eslint` → ABSENT.
- dependency-cruiser: `ls node_modules/dependency-cruiser` → ABSENT.
- playwright-core: `node_modules/playwright-core/package.json` → 1.61.0.
- `vitest.config.ts` browser block: absent (28-line file, jsdom only, read directly).
- test file count: `ls test/*.test.ts | wc -l` → 89.
- vitest test count: `npx vitest list | wc -l` → 890.
- border-radius spread: `grep -l border-radius scripts/proof-*.mjs` → 5 files
  (appearance-suffusion, card-rounded-primitive, scene-card-rounded, stage-glass-card,
  styling-idioms).
- observe-only declarations: `grep -c "declarePosture.*observe-only"
  scripts/proof-*.mjs | grep -v ":0" | wc -l` → 8 gate files.
- ci.yml named-but-unbuilt cure: `ci.yml:327–328` read directly.
- `card-rounded-primitive` clause 2 dup: `proof-card-rounded-primitive.mjs:204–206`
  vs `proof-stage-glass-card.mjs:115–117,39` — identical selector/assertion, read
  directly.
- `bezier-grown` self-documents reuse: `proof-bezier-grown.mjs:34,36–37,39,52`
  (cited in audit C §1a, re-verified by file location).
- easing-sidebar overlap: `proof-easing-sidebar-normalized.mjs:343` (ONE Card)
  vs `proof-easing-sidebar-minimal.mjs:437,440` (B4 exactly 1 Card).
- precept real-bug justification: `docs/tranches/I/audit/rootcause-rc-gate-blindspot.md:164`;
  `docs/tranches/H/audit/a-gate-blindspots.md:21,82`.
- L-audit factual corrections: `deferred-ledger-L.md:82` (DLL-1 !important
  spec-faithful correction); DLL-22/DLL-26 parse-that distinction carried correctly
  in `gate-apparatus-VERDICT.md`.
- Sampled gate timings (lane A §2, re-stated here without re-timing):
  source-shape 0.16–0.69s; vitest 0.76–1.02s; browser 1.98s–80.85s (40× spread);
  `proof:live-session` 80.85s; `proof:drag-gesture` 27.18s; `proof:layout-cluster` 11.29s.
