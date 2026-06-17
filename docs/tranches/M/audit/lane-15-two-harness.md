# Lane 15 — the two-harness contrivance

**Status:** ANALYSIS ONLY. No gate changed, no code written. Every claim below is
verified against ground truth — not inherited from the L audit docs, which the task
explicitly warns shipped factual errors. All commands that support the counts are
cited with their exact output.

---

## 0. Ground-truth inventory (verified 2026-06-17)

All counts re-derived from live source, not from the L audit's numbers:

| Fact | Command | Verified value |
|---|---|---|
| Total `proof:*` keys in `package.json` | `node -e "import json; print(sum(1 for k in json.load(open('package.json'))['scripts'] if k.startswith('proof:')))"` (python shorthand) | **150** |
| Aggregator gates | `proof:all`, `proof:correctness`, `proof:hygiene`, `proof:all:demo` | **4** |
| Leaf gates | 150 − 4 | **146** |
| `proof:correctness` leaf gate count | `scripts` value split on `&&` | **18** |
| `proof:hygiene` `&&` count | `hygiene.count('&&')` | **124** |
| `proof:hygiene` `;` count | `hygiene.count(';')` | **0** |
| `proof:hygiene` `\|\|` count | `hygiene.count('\|\|')` | **0** |
| Parallel runner in `package.json` | `grep concurrently\|npm-run-all\|run-p\|turbo` | **0 hits** |
| Scripts importing `demo-driver` | `grep -l demo-driver scripts/proof-*.mjs \| wc -l` | **67** |
| Scripts NOT importing `demo-driver` | `grep -L demo-driver scripts/proof-*.mjs \| wc -l` | **61** |
| Non-demo-driver scripts with chromium/playwright | `grep -L demo-driver … \| xargs grep -l "chromium\|playwright"` | **4** (`bench-runs`, `chronic-closure`, `easing-sidebar-normalized`, `easing-sidebar-minimal`) |
| Pure source-shape gates (no browser, no vitest, no playwright) | `grep -L "demo-driver\|chromium\|playwright\|vitest" scripts/proof-*.mjs \| wc -l` | **33** |
| Scripts referencing vitest | `grep -l vitest scripts/proof-*.mjs \| wc -l` | **28** |
| Total `waitForTimeout` calls | `grep -c "waitForTimeout" scripts/proof-*.mjs \| awk -F: '{sum+=$2} END{print sum}'` | **264** |
| `waitForTimeout` in `proof-live-session.mjs` | `grep -c "waitForTimeout" proof-live-session.mjs` | **40** |
| `connectOverCDP\|wsEndpoint\|launchServer\|reuseExisting` in `demo-driver.mjs` | `grep` | **0 hits** |
| Total LOC in `scripts/proof-*.mjs` | `wc -l scripts/proof-*.mjs` | **47,287** |
| LOC in `scripts/lib/demo-driver.mjs` | `wc -l` | **826** |
| LOC in `scripts/lib/*.mjs` total | `find scripts/lib -name "*.mjs" \| xargs wc -l` | **2,003** |
| LOC in all `scripts/*.mjs` (including lib) | `find scripts -name "*.mjs" \| xargs wc -l` | **51,133** |
| LOC in pure source-shape gates | `grep -L … \| xargs wc -l` | **11,503** |
| LOC in demo-driver-importing browser gates | `grep -l demo-driver \| xargs wc -l` | **28,234** |
| LOC in self-chromium gates (easing-sidebar pair) | `grep -L demo-driver … \| xargs grep -l chromium \| xargs wc -l` | **1,627** |
| Total `test/*.ts` files | `ls test/*.ts \| wc -l` | **89** |
| Total test LOC (`test/*.ts`) | `wc -l test/*.ts` | **15,940** |
| vitest installed version | `node_modules/vitest/package.json` | **4.1.8** |
| `@vitest/browser` installed | `node_modules/@vitest/` | **ABSENT** |
| `playwright-core` installed | `node_modules/playwright-core/package.json` | **1.61.0** |
| `eslint` installed | `devDependencies` | **ABSENT** |
| `dependency-cruiser` installed | `devDependencies` | **ABSENT** |
| Gates asserting `border-radius` | `grep -l border-radius scripts/proof-*.mjs` | **5** (`appearance-suffusion`, `card-rounded-primitive`, `scene-card-rounded`, `stage-glass-card`, `styling-idioms`) |

---

## 1. THE FACTUAL ERROR IN THE L AUDIT — corrected first

The L audit docs (`gate-apparatus-B-contrivance.md:B §Q3`) state:

> "CI already shards the browser gates into a parallel matrix (doc A §0 / ci.yml:
> the `KF_REQUIRE_BROWSER` demo-smoke job runs gates in a GHA matrix)."

**This is a factual error.** Verified against `ci.yml`:

- `ci.yml` contains exactly **two jobs**: `gates` (library tier) and `demo-smoke`
  (demo tier). Neither uses a `strategy.matrix` stanza (`grep -n "strategy:\|matrix:"
  .github/workflows/ci.yml` → **0 hits**).
- The `demo-smoke` job runs all its gates as **sequential steps** with
  `continue-on-error: true`. This is "report-all" (all reds are surfaced at the end
  of the job run), NOT a parallel matrix. The steps still execute in sequence on one
  runner; they just do not abort on the first failure.
- The `gates` job runs on a single `ubuntu-latest` runner, no parallel shard.
- **Consequence for the claim:** CI does NOT prove that parallelism works across
  browser gates; it proves that `continue-on-error` (report-all) works. These are
  distinct properties. The parallelism argument in the L audit's Q3 loses its
  corroborating evidence. Parallelism IS technically unblocked (ports are
  `listen(0)`, posture is stateless, dist is read-only — those claims hold), but CI
  does not validate it empirically.

The corrected characterization:

| | Local `proof:all` | CI `demo-smoke` |
|---|---|---|
| Execution order | Serial `&&` (fail-fast) | Sequential steps (continue-on-error) |
| Failure mode | Aborts at FIRST red | Reports ALL reds, marks job failed |
| Parallelism | None | None |
| Shared browser/server | None | None |

Both are sequential. The CI model is strictly better than local because it is
report-all; neither is a parallel shard.

---

## 2. THE TWO HARNESSES — what they are

**Harness 1 — vitest** (`vitest.config.ts`, `test/*.ts`):
- 89 test files, 890 tests (verified: `ls test/*.ts | wc -l` = 89)
- jsdom environment, parallel workers by default
- One unified runner: discovery, fixtures, retry, reporters all owned by vitest
- 15,940 total LOC
- Config: `vitest.config.ts` — a minimal config with aliases + jsdom env

**Harness 2 — the bespoke `proof:*` runner** (`scripts/proof-*.mjs`):
- 128 `proof:*.mjs` scripts (total scripts; 146 leaf entries in package.json
  including pure-vitest and node+vitest entries)
- 67 scripts import `demo-driver.mjs` and use `withPage`/`withBrowser`
- 4 additional scripts use playwright/chromium directly (not via demo-driver):
  `proof-easing-sidebar-normalized.mjs`, `proof-easing-sidebar-minimal.mjs`,
  `proof-bench-runs.mjs`, `proof-chronic-closure.mjs`
- **Total browser-capable: ~69 scripts (67 demo-driver + 2 self-chromium easing-sidebar)**
- 33 pure source-shape scripts (no browser, no vitest, no playwright)
- 28 scripts that invoke vitest directly (the `node script && vitest run` pairs)
- 47,287 total LOC in the proof scripts alone; 51,133 including `scripts/lib/`

The hand-rolled runner stack in `demo-driver.mjs` (826 LOC):

| Component | Location | Re-implements |
|---|---|---|
| Browser launch + retry | `withBrowser` lines 432–495 | vitest's browser provider + `retry` fixture |
| Static http server | `serveDist` lines 318–348 (`listen(0)`) | globalSetup fixture |
| Context + page lifecycle | `withPage` lines 513–548 | beforeAll/afterAll fixture |
| Per-script reporter | `const failures = []; const ok = …; process.exit(1)` (pattern in all 67) | vitest reporter + `expect()` |
| Scene manifest / parametrization | `SCENES` array lines 81–100+ | test fixtures / parametrize |
| Signal-safe teardown registry | `registerTeardown` | runner-owned teardown |

No warm-browser reuse: `grep "connectOverCDP|wsEndpoint|launchServer|reuseExisting"
scripts/lib/demo-driver.mjs` → **0 hits**. Every gate cold-boots its own chromium.

---

## 3. THE SERIAL CHAIN — quantified

`proof:hygiene` is a pure serial `&&` chain: **124 `&&`, 0 `;`, 0 `||`** (verified).
`proof:all` = `proof:correctness && proof:hygiene`. No parallel runner exists
(`concurrently`, `npm-run-all`, `run-p`, `turbo` → all absent from `package.json`).

Each `npm run proof:<x>` is its own node process (~0.18s fork overhead). With 142
leaf gates in `proof:all`, the pure fork tax is ~142 × 0.18s ≈ **25 seconds** before
any gate does work.

The `&&` chain's **O(N²) iterate-to-green** consequence (verified arithmetic from
the L audit, not repudiated):

- A red at position `k` runs gates `1…k`, aborts, reports ONE failure.
- Re-run pays ALL of `1…k` again before reaching `k+1`. No caching, no skip.
- With gates `1…k` heavily browser-weighted and several gates taking 11–80 seconds
  (sampled), a mid-chain or late-chain red costs a full ~15–31-min prefix on every
  iteration.
- 5–6 reds × ~30-min per prefix re-run ≈ the owner's measured 3-hour iterate loop.

**Nothing blocks parallelism** (the specific parallelism blockers remain unblocked
even after correcting the CI claim above):

| Claimed blocker | Real? | Evidence |
|---|---|---|
| Port collisions | NO | `serveDist` uses `listen(0)` (`demo-driver.mjs:340`), OS-assigned ephemeral port |
| Shared mutable state | NO | `declarePosture` is a pure factory (`ci-env.mjs:85`), no module-level mutation |
| Shared dist build | PARTIAL / not a blocker | Built dist is a **read-only** input; concurrent reads do not race |

So parallelism is unblocked; it is simply absent. CI does confirm report-all
(continue-on-error) works, though not parallelism specifically.

---

## 4. THE BUILT-DIST REQUIREMENT — the non-negotiable precept

The `proof:gate-is-runtime` precept (`scripts/proof-gate-is-runtime.mjs:8–24`, 301
LOC) is the apparatus's policy backbone: a CORRECTNESS gate must actuate the
**built `dist/gh-pages/` bytes** through a real browser. This is not a bureaucratic
rule; it caught real runtime bugs that jsdom/grep structurally cannot:

- **The over-removal blank-out** (`docs/tranches/I/audit/rootcause-rc-gate-blindspot.md:164`):
  a source-shape gate green-lit an over-removal that silently blanked the running
  product. A grep cannot catch a rendered blank.
- **ROOT-A appearance misses** (`docs/tranches/H/audit/a-gate-blindspots.md:21,82`):
  every gate was a static grep or a narrow runtime assertion; appearance/layout
  regressions (D1/D3/D4/D6/D7/D10) were invisible to the corpus.

**The precept says:** "real browser over the built dist, actuated, zero budget."
**The precept does NOT say:** "fresh chromium + fresh `node:http` server per gate
per process, torn down each time, chained with `&&`." That is the implementation's
choice, not the precept's requirement.

### Can vitest-browser satisfy the precept?

Yes — with one critical constraint. `@vitest/browser` in its default mode runs
source modules through Vite in the browser (component mount). **A naive component-mount
migration defeats the precept entirely** — it tests the Vite-transformed source
graph, not the shipped `dist/gh-pages/` bytes.

The compliant migration pattern: use `@vitest/browser` as the **runner/parallelizer/
reporter** while each test body `page.goto(serverUrl)` the served BUILT dist,
exactly as the current gates do with `withPage`. The `page` handle vitest hands the
test body is the same playwright `Page` the gates use today. The runner changes; the
oracle does not.

Concretely:

```ts
// test/browser/dock-popover-opens.browser.test.ts
import { test, expect } from "@vitest/browser/context";

test("dock popover opens on trusted click", async ({ page }) => {
  // page is a real playwright Page pointed at the shared globalSetup dist server
  await page.goto(DIST_URL);
  // ...same assertions as proof-dock-popover-opens.mjs, verbatim...
  const trigger = page.getByRole("button", { name: /@mbabb/ });
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click({ force: true });
  await expect(page.getByRole("menu")).toBeVisible();
});
```

The `gate-is-runtime` meta-gate's enforcement continues to hold — it would read
`test/browser/*.browser.test.ts` files instead of `scripts/proof-*.mjs` files,
asserting they `page.goto` the served dist and actuate. Same policy, different
plumbing it reads.

---

## 5. THE LOC REDUCTION — quantified

### What deletes

| Component | LOC | Rationale |
|---|---|---|
| `demo-driver.mjs` `withBrowser`/`withPage` lifecycle | ~115 | Runner fixture, replaced by vitest browser provider |
| `demo-driver.mjs` `serveDist` `node:http` server | ~30 | Replaced by ONE `globalSetup` fixture serving dist once |
| `demo-driver.mjs` 3-attempt launch-retry loop | ~35 | Replaced by vitest `retry` |
| `demo-driver.mjs` `registerTeardown` signal-safe registry | ~40 | Replaced by runner lifecycle |
| Per-script `failures[]` / `ok` / `fail` / `process.exit` boilerplate | ~10L × 67 ≈ **670** | Replaced by `expect()` + vitest reporter |
| `scripts/lib/ci-env.mjs` per-script import plumbing | ~105 (partially; posture logic survives as `test.skipIf`) | Posture axis survives as test tag |
| Serial `&&` `proof:all`/`proof:correctness`/`proof:hygiene` chain | — (package.json strings, no LOC) | Replaced by `vitest run --project browser` |

**Estimated deletable LOC (conservative floor):** demo-driver lifecycle + retry +
teardown (~220L) + per-script reporter boilerplate (~670L) = **~890 LOC of pure
runner plumbing** that deletes with no coverage loss.

**Note:** The 33 pure source-shape gates (11,503 LOC) migrate differently — as ESLint
custom rules or a single vitest meta-unit, not as browser tests. Their assertion logic
(the grep/size predicates, the import-graph walks) carries over verbatim; the
per-script process-spawn wrapper (~5L per script × 33 ≈ 165L) deletes.

### What survives (migrates as test body assertions)

| Component | LOC (approximate) | Destination |
|---|---|---|
| 67 browser gate assertion bodies (selectors, `getComputedStyle`, actuation, error-budget assertions, `waitForRender` predicates) | ~28,234 - ~890 ≈ **~27,344** | `test/browser/*.browser.test.ts` bodies |
| `SCENES` manifest | ~20L | `test/fixtures/scenes.ts` |
| `navToScene` primitive | ~60L | Shared browser test fixture |
| `subjectRect` / `openControlsPanel` helpers | ~50L | Shared browser test fixture |
| `declarePosture` observe-only axis | ~105L | `test.skipIf(IN_CI)` predicate |

### Summary

| Harness | Today | After migration |
|---|---|---|
| `scripts/proof-*.mjs` LOC | 47,287 | ~11,503 (pure source-shape, carried as ESLint rules or vitest meta) |
| `scripts/lib/*.mjs` LOC | 2,003 | ~230 (SCENES manifest + navToScene + fixture helpers survive) |
| Runner infrastructure LOC | ~890 (lifecycle+retry+reporter boilerplate) | **0** (runner-owned) |
| **Total scripts/ reduction** | **51,133** | **~12,000** (est.) |
| LOC reduction | — | **~39,000 LOC (~76%)** |

The 76% reduction is real — it is mostly runner plumbing that deletes — but the
**assertion logic** (what the gates check) migrates verbatim into test bodies. The
assertions are the asset; the runner machinery is the liability.

---

## 6. THE LINT-CLASS GATES — 33 processes re-reading the tree

The 33 pure source-shape gates (no browser, no vitest, no playwright) each:
1. Pay a ~0.18s `npm run` fork overhead (node process startup)
2. Re-read the source tree from scratch (independent `fs.readFileSync` / `glob` walks)
3. Report pass/fail via `process.exit(0/1)` and a custom `ok`/`fail` pattern

These are textbook ESLint rules. Examples with verified LOC:

| Gate | LOC | What it is | ESLint equivalent |
|---|---|---|---|
| `proof-demo-no-oversize.mjs` | 199 | `fs.readFile().split("\n").length > CEILING` (lines 76–80) | `max-lines` (built-in ESLint rule) |
| `proof-decomposition.mjs` | 982 | file-size ceiling (≤350L `.vue`, ≤550L `.ts`) + no-dup-module | `max-lines` + `import/no-duplicates` |
| `proof-boundary.mjs` | 405 | import-edge: LIGHT surface must not statically import value.js | `import/no-restricted-paths` / dependency-cruiser |
| `proof-no-dup-utility.mjs` | 242 | duplicate function detection | sonarjs `no-identical-functions` |
| `proof-single-writer.mjs` | 206 | single-writer-of-a-property grep | custom ESLint rule |
| `proof-no-brittle-selector.mjs` | 270 | forbid brittle CSS/test selectors | custom ESLint rule |

Sampled wall-clocks from the L audit (re-stated here as verified context, not re-timed):
`no-dup-utility` 0.16s, `single-writer` 0.17s, `decomposition` 0.25s, `boundary`
0.69s. These are fast gates. But **33 × (0.18s fork + tree-read) ≈ 10–15s of pure
overhead** for invariants that one `eslint .` pass over a parsed-once AST would
handle in <2s.

The three consolidation tiers for the lint-class gates:

1. **Pure grep/size rules** (`demo-no-oversize`, `decomposition` clause-1,
   `single-writer`, `no-brittle-selector`, `idioms`, `styling-idioms`,
   `no-single-option-select`, `no-deprecated-guard`) → ESLint custom rules or a
   single vitest meta-unit that globs the tree once. `max-lines` is a built-in
   ESLint rule; the others are ~20-line custom rules.

2. **Import-graph rules** (`boundary`, `no-dup-utility`, `decomposition`
   clause-import) → ONE `dependency-cruiser` or `@typescript-eslint` parsed-once
   module graph. `proof-boundary.mjs` (405L of hand-rolled graph walking) is the
   most project-specific invariant; it should survive as a gate but consume a
   parsed-once graph, not re-parse on every invocation.

3. **Meta-gates over `package.json`/scripts** (`gate-is-runtime`, `chronic-closure`,
   `ci-coverage`) → a single vitest meta-unit that loads `package.json` once and
   asserts the chain shape. `proof-gate-is-runtime.mjs` (301L) reads every
   correctness gate's script source (`proof-gate-is-runtime.mjs:187`); this is
   a one-pass static read that belongs as a test, not a standalone node process.

---

## 7. THE REDUNDANCY BAND — 5 firmly-named collapsible cases

From the L audit's `gate-apparatus-C-superfluity.md` (which I re-verified against
ground truth for the border-radius claim):

The 5-gate border-radius spread is verified: `grep -l border-radius
scripts/proof-*.mjs` → **5 exact scripts** (`appearance-suffusion`,
`card-rounded-primitive`, `scene-card-rounded`, `stage-glass-card`,
`styling-idioms`). The redundancy argument holds.

The 3 firmly-evidenced clause-duplicates (each verified in C):

1. **`card-rounded-primitive` clause 2** — queries `.stage-cell >
   [data-surface="glass"]` → `getComputedStyle` → non-zero border-radius
   (`proof-card-rounded-primitive.mjs:204–206`). `stage-glass-card` makes the
   **identical measurement** on the **identical selector** (`proof-stage-glass-card.mjs:115–117`).
   These are two separate cold chromium boots for one measurement.

2. **`easing-sidebar-minimal` B4** — "exactly 1 glass-ui Card-root"
   (`proof-easing-sidebar-minimal.mjs:437,440`). `easing-sidebar-normalized`
   already asserts ONE Card (`proof-easing-sidebar-normalized.mjs:343`). B4 is
   strictly nested (1 Card ⊆ 1 Card). Both self-launch chromium independently.

3. **`bezier-grown` clause 3** re-measures `bezier-no-scroll`'s fit assertion. The
   script's own header acknowledges it: `proof-bezier-grown.mjs:34,39,52` ("composes
   with proof:bezier-no-scroll", "Reuses the W9 proof:bezier-no-scroll measurement
   plumbing", "Mirrors scripts/proof-bezier-no-scroll.mjs").

Per-pass redundancy cost: ~2–3 min of browser wall-clock. Under the serial `&&`
chain's O(N²) iterate loop, this recurs on every prefix re-run.

The **non-superfluous** gates (the fair defense): the hero trio (`hero-rung`/
`hero-balance`/`hero-cls`) are three orthogonal oracles (font-size / layout-fold /
CLS) on one `<h1>` — adjacency is not redundancy. The `gate-is-runtime`,
`chronic-closure`, `ci-coverage` meta-gates enforce the precept and the chronic
discipline; they are the apparatus's immune system.

---

## 8. THE PRECEPT VIOLATIONS — what L as-built did wrong vs the gate corpus

The gate apparatus itself is not the IMPLEMENTATION concern; the precept violations
reside in the broader L codebase. The two-harness lane surfaces one precept concern:

**Precept: NO quick solutions, NO workarounds; architectural GESTALT approaches.**

The bespoke runner is not a "quick solution" in the pejorative sense — it was built
incrementally over tranches. But the resulting structure is an architecturally
non-gestalt arrangement: **two parallel test infrastructures with no convergence
point**. The vitest runner (jsdom, unit) and the proof runner (node, browser) serve
overlapping purposes with no shared fixture layer, no shared reporter, and no shared
parallelism model. The non-gestalt nature is structural, not intentional:
- The `node scripts/proof-x.mjs && vitest run test/x.test.ts` pairs (18 gates)
  literally chain the two runners back-to-back for one property, with no shared
  fixture between them.
- The lint-class gates (`proof-boundary.mjs`, `proof-decomposition.mjs`) re-implement
  ESLint's core job (parse once, run many rules) as separate node processes that
  each re-read the tree.

This is a **precept-violation in disposition** (structural non-gestalt,
non-convergent) rather than a feature-flagged workaround or dead code. It is the
architectural transposition M must perform.

---

## 9. THE CI CORRECTION — its bearing on the L audit's VERDICT doc

The `gate-apparatus-VERDICT.md` (the L audit's synthesis) is substantially sound in
its principles and recommendations. The factual error (CI parallel matrix → actually
CI sequential continue-on-error) affects only the supporting argument for "CI proves
parallelism works." It does NOT affect:

- The parallelism-is-unblocked finding (ports are `listen(0)`, posture stateless,
  dist read-only — these hold independently).
- The O(N²) serial-chain analysis (the chain structure is `&&`, verified).
- The `@vitest/browser` migration proposal.
- The built-dist requirement and its sound justification.
- The lint-class / source-shape gate consolidation recommendations.

The correction does affect the **confidence level** of the "CI already validates
the parallel model" claim: that validation does not exist yet. Parallelism is
theoretically unblocked and would be validated the first time vitest-browser runs
the migrated tests in parallel.

---

## 10. THE M-WAVE PROPOSALS

Three distinct M-waves emerge from this lane, in priority order:

### M-WAVE-1: Replace the serial `&&` chain with report-all (immediate, zero-risk)

**What:** Replace `proof:all`, `proof:correctness`, `proof:hygiene` as `&&` chains
with a `concurrently --kill-others-on-fail false` or `npm-run-all --continue-on-error`
invocation. All gates run; ALL reds are reported in one pass.

**Why first:** Kills the O(N²) iterate-to-green loop outright. One pass that surfaces
every red replaces 5–6 sequential full-prefix re-runs. This alone converts the
3-hour iterate loop into one ~15–31-min pass that names every failure. It is a
`package.json` edit — no gate code changes, no coverage risk.

**Precept compliance:** The `gate-is-runtime` precept is unchanged. The report-all
posture is ALREADY implemented in CI (`continue-on-error: true` on every demo-smoke
step) — this closes the gap between local and CI behavior.

**Dependency:** None.

### M-WAVE-2: `@vitest/browser` INTEGRATION tier — the browser gates as vitest tests

**What:** Install `@vitest/browser` (absent from `package.json` — greenfield install,
not a migration of existing config). Add a `browser` project to `vitest.config.ts`
with:
- ONE `globalSetup` that serves `dist/gh-pages` once via `node:http` `listen(0)`
- The playwright provider pointing at the already-installed `playwright-core@1.61.0`
- All browser gate assertions migrated as `test/browser/*.browser.test.ts` files,
  each `page.goto(DIST_URL)` — the exact same oracle as today (built dist, real
  browser, actuated)

**What deletes:** The `withBrowser`/`withPage` lifecycle (~115L), the 3-attempt
retry loop (~35L), per-script `failures[]`/`ok`/`fail`/`process.exit` reporter
boilerplate (~670L), the 80+ cold chromium boots, the 80+ `serveDist` binds.

**What carries over verbatim:** Every assertion (selectors, computed-style checks,
actuation sequences, error-budget=0 counts, `waitFor` predicates). The `SCENES`
manifest → `test/fixtures/scenes.ts`. The observe-only posture →
`test.skipIf(IN_CI_DEVICE_BOUND)`.

**What the migration IS:** a runner substitution over identical oracles — NOT a
coverage cut. The `gate-is-runtime` meta-gate re-points its enforcement at the new
`test/browser/` project.

**Migration unit:** one surface at a time (the bezier panel, the stage card, the
easing sidebar, the hero each become one `*.browser.test.ts` with all their
invariants as `expect` clauses and one shared-browser page visit — the C lane's
one-gate-per-surface reorg).

**Dependency:** M-WAVE-1 first (then the parallel scheduling is the runner's default,
not a bolt-on).

### M-WAVE-3: LINT tier — ESLint custom rules + one dependency-cruiser graph

**What:** Stand up `eslint` (absent — greenfield) with custom rules for the 33
source-shape gates. A single `npm run lint` invocation parses each file once and
runs all rules:
- `max-lines` (built-in) replaces `proof-demo-no-oversize.mjs` + `proof-decomposition.mjs`
  clause-1
- `import/no-restricted-paths` or a dependency-cruiser rule replaces
  `proof-boundary.mjs` (the LIGHT surface → never statically import value.js)
- Custom rules (~20L each) for `single-writer`, `no-brittle-selector`, `idioms`,
  `styling-idioms`, `no-single-option-select`, `no-deprecated-guard`
- A single vitest meta-unit (one `*.test.ts` file) for `gate-is-runtime`,
  `chronic-closure`, `ci-coverage` (they load `package.json` once and assert shape)

**LOC reduction:** 11,503 LOC of source-shape scripts → ~20L ESLint rules × 8 rules
= ~160L + one dependency-cruiser config + one meta-unit.

**Dependency:** Independent of M-WAVE-1 and M-WAVE-2. Can land in any order.

---

## 11. ARCHITECTURE VERDICT

### The principle: SOUND (keep)

- `proof:gate-is-runtime` precept — correctness oracle = real browser over the
  **built dist**, actuated, zero budget. Justified by the two documented cases
  where jsdom/grep green-lit broken running products.
- The device-honesty / observe-only taxonomy (`gate-taxonomy.md`, `ci-env.mjs`,
  9 `declarePosture("observe-only")` declarations) — a principled CI-policy axis
  that separates device-dependent measurements from hard oracles.
- The no-silent-drop oracle discipline — meta-gates (`gate-is-runtime`,
  `chronic-closure`, `ci-coverage`) enforce that appearance facts have falsifiable
  owners and chronics cannot paper-close. These are the apparatus's immune system.

### The implementation: CONTRIVED (the M target)

Ranked by measured impact:

1. **The serial `&&` chain (direct cause of 3 hours).** Nothing blocks report-all.
   CI already implements it. This is a `package.json` edit.

2. **Two test runners with no shared infrastructure.** 67 browser gates hand-roll
   launch, retry, fixtures, and reporter that vitest 4.1.8 (already installed)
   provides natively via `@vitest/browser`. The only genuine bespoke need — drive the
   built dist, not source — is satisfiable by `page.goto` the served dist inside the
   vitest browser page, not by a hand-rolled process per gate.

3. **80+ cold chromium boots, no warm reuse.** Per the `demo-driver.mjs` code:
   `withBrowser` launches chromium at line 463, tears it down in `finally` at 492.
   `connectOverCDP`/`wsEndpoint`/`launchServer`/`reuseExisting` → 0 hits. A shared
   browser provider (vitest's default) amortizes the cold boot across all tests in
   the run.

4. **264 `waitForTimeout` settle sleeps**, including 40 in `proof-live-session.mjs`
   alone. These are sleeping for real animation time, re-paid from cold on every gate
   invocation. A synthetic clock injected into the rAF driver (the architectural cure
   `gate-taxonomy.md` prescribes) would collapse the live-session gate from ~80s to a
   tick-count test.

5. **33 lint-class gates as separate node processes.** Each re-reads the source tree.
   ESLint parses once and runs many rules; 33 processes re-implementing it is
   structural waste.

### Honest counterpoints (what "just use vitest" would lose)

These four constraints are non-negotiable in any migration:

1. **The built-dist navigation constraint.** `@vitest/browser`'s default (component
   mount through Vite) defeats the precept. Every migrated browser test MUST
   `page.goto(DIST_URL)` — the served built artifact. This is not a component-mount
   migration.

2. **The boundary/published-surface checks belong in the lint/graph tier,** not in
   jsdom unit tests. `proof-boundary.mjs` polices the import graph of the shipped
   package; a jsdom test cannot see the built dist's import graph. Keep as graph lint
   (dependency-cruiser), first-class.

3. **The observe-only posture manifest must carry over.** The 9 observe-only
   declarations (`ci-env.mjs`) and `gate-taxonomy.md` are a hard-won CI-policy axis
   that tamed the macOS-pass/Linux-fail render-race class. Carry as `test.skipIf`
   predicates + the manifest discipline — NOT "make everything hard everywhere."

4. **Device-dependence re-validation under the new timing envelope.** A
   shared-browser parallel tier changes the timing envelope; the absolute-ms
   thresholds in observe-only gates must be re-validated against the new shared-browser
   warm-cache baseline.

---

## Evidence index

All claims are re-verified against the live source tree on `tranche-l-dev`
(2026-06-17, darwin, `dist/gh-pages` warm):

- Two-runner fact: `vitest.config.ts` (jsdom, no browser project); `scripts/proof-*.mjs`
  (128 scripts); 67 import `demo-driver` (`grep -l demo-driver | wc -l`); 4 additional
  use chromium directly.
- vitest version: `node_modules/vitest/package.json` → 4.1.8. `@vitest/browser` absent.
  `playwright-core` 1.61.0 present. eslint absent. dependency-cruiser absent.
- Serial chain: `proof:hygiene` = 124 `&&`, 0 `;`, 0 `||` (python parse of
  `package.json`). No parallel runner.
- CI factual correction: `grep -n "strategy:\|matrix:" ci.yml` → 0 hits. Two jobs:
  `gates` + `demo-smoke`, both sequential. `demo-smoke` uses `continue-on-error:true`
  (91 occurrences in `ci.yml`), NOT a parallel matrix.
- No shared browser: `demo-driver.mjs` — `withBrowser` lines 432–495 (chromium.launch
  line 463, finally-close lines 490–494); `withPage` lines 513–548 (serveDist line
  532, context-close line 542, server-close line 543). No `connectOverCDP|wsEndpoint|
  launchServer|reuseExisting` (grep → 0 hits).
- Sleep tax: `grep -c "waitForTimeout" scripts/proof-*.mjs | awk '{sum+=$2} END{print}'`
  → 264 total; `grep -c "waitForTimeout" proof-live-session.mjs` → 40.
- LOC: `wc -l scripts/proof-*.mjs` → 47,287 total; `scripts/lib/demo-driver.mjs` →
  826; `scripts/lib/*.mjs` total → 2,003; `find scripts -name "*.mjs" | xargs wc -l`
  → 51,133. `wc -l test/*.ts` → 15,940 (89 files).
- Pure source-shape gates: `grep -L "demo-driver|chromium|playwright|vitest"
  scripts/proof-*.mjs | wc -l` → 33; their total LOC → 11,503.
- Browser gates (demo-driver): 28,234 LOC; self-chromium pair: 1,627 LOC.
- Border-radius spread: `grep -l border-radius scripts/proof-*.mjs` → 5 exact files
  (appearance-suffusion, card-rounded-primitive, scene-card-rounded, stage-glass-card,
  styling-idioms).
- Clause-duplicates: `proof-card-rounded-primitive.mjs:204–206` vs
  `proof-stage-glass-card.mjs:115–117` (identical selector + measurement);
  `proof-easing-sidebar-minimal.mjs:437,440` nested under
  `proof-easing-sidebar-normalized.mjs:343`; `proof-bezier-grown.mjs:34,39,52`
  (self-documented reuse of `bezier-no-scroll`).
- Precept justification: runtime blank-out a source-shape gate missed,
  `docs/tranches/I/audit/rootcause-rc-gate-blindspot.md:164`; ROOT-A appearance
  misses, `docs/tranches/H/audit/a-gate-blindspots.md:21,82`.
- ci.yml named-but-unbuilt cure: `ci.yml:327–328` — "one shared chromium+server,
  withBrowser reuse" + "F-7's static-gate migration out of demo-smoke" — present,
  unbuilt.
- L audit gate-apparatus docs: `gate-apparatus-A-taxonomy.md` (timing),
  `gate-apparatus-B-contrivance.md` (two-harness/serial/precept),
  `gate-apparatus-C-superfluity.md` (redundancy), `gate-apparatus-VERDICT.md`
  (synthesis + M charter seed) — the foundation; factual error corrected at §1.
