# Gate-apparatus audit — THE VERDICT + the SOTA path (Tranche-M charter seed)

**Status:** ANALYSIS ONLY. Read-only. No gate changed, no code written, `proof:all`
NOT re-run (its ~15–31-min single-pass cost is the subject; re-running it would
re-pay the 3-hour tax this audit exists to explain). This doc SYNTHESIZES the
three lane audits — `gate-apparatus-A-taxonomy.md` (the timing measurement),
`-B-contrivance.md` (the two-harness / serial-chain / precept critique), and
`-C-superfluity.md` (the redundancy / minimal-covering-set) — into a single
verdict, a target architecture, a migration path, and an honest counterpoint.
Every claim re-verified against package.json / the gate scripts / the run logs on
2026-06-17 (darwin, dist warm); the verifications are in the evidence index.

**This is a candidate Tranche-M charter SEED (the test-architecture
consolidation), NOT a retroactive change to Tranche L.** L's gates stay exactly
as they are through L's close; M is where the consolidation lands.

---

## 1. THE HONEST VERDICT

**The apparatus is over-engineered in its IMPLEMENTATION, not its PRINCIPLE — and
the cost is architectural, not inherent.** The three sound principles — *test the
rendered product through the real surface* (the `proof:gate-is-runtime` precept),
*the device-honesty law* (observe-only vs hard postures), and *the no-silent-drop
oracle discipline* (every appearance fact has a falsifiable owner) — are correct
and caught real runtime bugs that jsdom/grep structurally cannot (the over-removal
blank-out, `rootcause-rc-gate-blindspot.md:164`; the ROOT-A appearance misses,
`a-gate-blindspots.md:21,82`). **Keep all three.** The contrivance lives entirely
below them: the apparatus is **a second, hand-rolled test runner** — 67 gate
scripts import `demo-driver.mjs` and hand-roll chromium launch, a `node:http`
server, retry, fixtures, and per-script `failures[]`/`process.exit(1)` reporting
— **run as a pure serial `&&` shell chain** (124 `&&`, 0 `;`, 0 `||`) of ~142
separate `npm run` processes, **each cold-booting its own chromium + server with
zero warm reuse** (0 `connectOverCDP`/`wsEndpoint`/`launchServer` in
`demo-driver.mjs`) and **sleeping through 264 `waitForTimeout` settle windows**
(40 in `live-session` alone) across an 8-scene sweep.

**The quantified cost.** Of 142 leaf gates in `proof:all`, **72 (51%) spawn a
browser, and those 72 consume 92–96% of the wall-clock** (lane A §2). A single
clean `proof:all` pass is **~15–31 minutes** (median- vs mean-weighted); the
non-browser 70 gates + the full vitest suite combined are **~70 seconds** —
essentially free. The 3-hour iterate-to-green is **not** the pass cost; it is the
serial `&&` chain's **O(N²) re-run tax**: `&&` aborts on the first red, reports
ONE failure, and the re-run re-pays every prior green (no caching, no report-all)
before reaching the next red. **5–6 reds discovered one-at-a-time × a ~30-min
full-prefix re-run = ~2.5–3 hours** — the owner's measured 3 hours, reconciled
exactly. The redundancy band (~13 firmly-named duplicate browser clauses, lane C
§4) adds ~2–3 min/pass that recurs under that O(N²) loop, i.e. **~10–18 min of
the 3 hours spent re-proving subsumed facts.** The headline finding: **the cost
is the runner architecture (serial · per-gate cold browser · no parallelism · no
report-all), not the gate count and not the gates' intent.** The team's own CI
YAML already names the cure (`ci.yml`: "one shared chromium+server, withBrowser
reuse" + "F-7's static-gate migration out of demo-smoke") — and it is **unbuilt.**

> **HEADLINE RECOMMENDATION:** Collapse the two test infrastructures into one.
> Retire the bespoke `proof:*` runner; migrate its *assertions* (the asset) into
> a **first-class three-tier vitest architecture** — a sub-second parallel LINT
> tier (the source-shape invariants as ESLint rules + one parsed-once import
> graph), the existing fast parallel UNIT tier (jsdom), and a parallel
> @vitest/browser INTEGRATION tier over the **built dist** with ONE shared
> browser + ONE served-dist fixture — plus a thin E2E/deploy tier (lighthouse +
> the round-trip). A failing run reports **ALL** failures at once (killing the
> O(N²) iterate cost), parallel workers + a warm browser drop the wall-clock from
> **hours to single-digit minutes**, and **no real coverage is lost** — every
> distinct regression a current gate catches migrates verbatim into a test body.

---

## 2. THE SOTA TARGET ARCHITECTURE

Four tiers, fastest-and-most-parallel first. The governing shape: **one runner
(vitest 4.1.8, already installed), four `vitest.config` projects, parallel by
default, report-all by default.**

### (a) LINT tier — sub-second, parallel, fail-all-at-once

The ~33–36 source-shape gates (lane A: 36 in `proof:all`; lane B: 33 pure
no-browser-no-vitest) are **lint-class invariants implemented as separate node
processes that each re-read the whole tree.** They are textbook lint rules:

- `proof:demo-no-oversize` (199L) is `max-lines` (`fs.readFileSync().split("\n").length > CEILING`).
- `proof:decomposition` clause-1 is `max-lines` + a no-duplicate-module check (982L).
- `proof:boundary` (405L) is `import/no-restricted-paths` — the LIGHT surface
  must never statically import value.js — a module-graph edge assertion.
- `proof:no-dup-utility` (242L) is `no-duplicate-code`; `proof:single-writer`
  (206L), `proof:no-brittle-selector` (270L) are grep-rules.

**Target:** ONE `eslint .` invocation (custom rules) + ONE parsed-once import
graph (`dependency-cruiser` or a `ts-morph`/`@typescript-eslint` pass) that builds
the graph ONCE and runs all edge assertions, + ONE vitest meta-unit for the
package.json/scripts shape gates (`gate-is-runtime`, `chronic-closure`,
`ci-coverage`). **Expected:** sub-second, parallel, reports every violation in one
pass. Replaces ~33 processes (each paying ~0.18s fork + an independent tree-read,
≈10–15s of pure overhead) with one parse-once-run-many pass (<2s). *Note: eslint
is currently ABSENT from the repo — this tier is greenfield; that is a small
build cost, not a migration of existing config.*

### (b) UNIT tier — vitest jsdom (already exists, keep verbatim)

The ~34 pure-vitest / node+vitest gates (zero-alloc, engine-correctness,
replay-equality, blend, motion-path, drawsvg, sync-step, event-ordering, cohesion)
ride the existing `vitest.config.ts` jsdom project — **already fast (0.4–1.2s
slices), already parallel across workers, already report-all.** 89 files / 890
tests today. **This tier is the model the other tiers should converge to. No
change needed** beyond folding the `node scripts/proof-x.mjs && vitest run` pairs
into single test files (the source-grep half becomes a LINT rule or a unit
assertion; the vitest half is already a test).

### (c) INTEGRATION/BROWSER tier — @vitest/browser over the BUILT dist

The 67 browser gates become **@vitest/browser tests in `test/` (one project,
`*.browser.test.ts`)** with:

- **ONE shared browser instance** (the playwright provider's default) instead of
  ~80+ cold chromium launches per `proof:all` — kills the per-gate cold-boot tax
  the precept never required.
- **ONE `globalSetup` server** serving `dist/gh-pages` once (replacing 80+ per-gate
  `serveDist` binds), with each test `page.goto`-ing the **built artifact** — this
  preserves the `gate-is-runtime` precept's whole point (actuate the *shipped
  bytes*, not a Vite-transformed source graph; see §4).
- **parallel workers** (vitest's default file scheduling) — the parallelism CI
  already proves works (the `KF_REQUIRE_BROWSER` matrix), now local too.
- **first-class `retry` + fixtures** replacing the hand-rolled 3-attempt
  launch-crash loop (`demo-driver.mjs:450–495`) and the `withPage`/`withBrowser`
  lifecycle (~115 lines).
- **`expect()` + the vitest reporter** replacing the per-script
  `failures[]`/`ok`/`fail`/`process.exit(1)` boilerplate copy-declared across ~69
  scripts.
- the `SCENES` manifest survives verbatim as a shared `test/fixtures` import
  (domain data, not runner mechanics); the observe-only posture survives as a test
  tag (`test.skipIf`/annotation) — see §4.

### (d) E2E / deploy tier — thin, stays scripted

`proof:lighthouse-*` (lighthouse over a served URL) and the round-trip / deploy
gates are not test-runner-shaped. Keep them as a thin script tier (or a single
vitest test that shells lighthouse), run post-build / pre-deploy, observe-only in
CI per the device-honesty law.

### Expected speedup — the arithmetic

| | Today | Target |
|---|---|---|
| Browser launches per full run | ~80+ cold boots | **1 shared** |
| Server binds per full run | ~80+ | **1 globalSetup** |
| Scheduling | serial `&&` (124 `&&`) | **parallel workers** |
| A red run reports | **ONE** failure | **ALL** failures |
| Iterate-to-green re-run cost | **O(N²)** (re-pay every prior green) | **O(1)** (one parallel run lists every red) |
| Lint tier | ~33 processes, each re-reads tree | **one parse-once pass, <2s** |
| Single-pass wall-clock | ~15–31 min | **single-digit minutes** (shared browser amortizes boot; parallel workers overlap the settle sweeps) |
| 3-hour iterate-to-green | ~2.5–3 h | **minutes** (no O(N²); all reds surfaced per run) |

The decisive win is not raw pass-time alone — it is **killing the O(N²) iterate
loop**: one parallel run that surfaces every red replaces 5–6 sequential
full-prefix re-runs. That is the 3-hours → minutes step.

---

## 3. THE MIGRATION PATH (phased, low-risk, zero coverage loss)

**The invariant (binding): NO loss of real coverage. Every distinct regression a
current gate catches must still be caught.** The gates' *assertions* are the
asset; the bespoke *runner* is the liability. Assertions migrate into test bodies;
the runner retires.

**Phase 0 — Lift the precept into the new substrate (no gate change).** Keep the
`proof:gate-is-runtime` meta-gate's POLICY (correctness oracle = real browser over
built dist, actuated, zero budget) but re-point its enforcement at the new browser
project: assert the `*.browser.test.ts` files `page.goto` the served dist and
actuate. The policy is unchanged; only what it reads changes. *This is the keystone
— it proves the migration preserves the law before any gate moves.*

**Phase 1 — LINT tier (cheapest, safest, highest process-count reduction).**
Stand up `eslint .` (greenfield) with custom rules for the pure grep/size gates
(`max-lines`, `single-writer`, `no-brittle-selector`, `idioms`,
`no-single-option-select`, …) + ONE `dependency-cruiser` graph for the import-edge
gates (`boundary`, `no-dup-utility`, `decomposition` clause-1). **Carries over
verbatim:** the assertions (the ceilings, the forbidden edges, the override maps).
**Consolidates:** ~33 processes → one parse-once pass. **Deletes:** the per-script
fork + tree-read boilerplate. *Zero coverage loss — same invariants, faster.*

**Phase 2 — UNIT tier (already done; just consolidate the pairs).** Fold the
`node scripts/proof-x.mjs && vitest run test/x.test.ts` pairs into single test
files (grep-half → LINT rule or unit assertion; vitest-half already a test).
**Carries over verbatim:** the 890 existing tests. **Consolidates:** 18 node+vitest
pairs → 18 unit files.

**Phase 3 — INTEGRATION/BROWSER tier (the big lift, do it surface-by-surface).**
Add `@vitest/browser` + the playwright provider (currently ABSENT — an install,
not a config migration), a `globalSetup` dist server, and a shared-browser project.
Migrate the 67 browser gates **one surface at a time** (lane C's
one-gate-per-surface reorg is the natural unit): the bezier panel, the stage card,
the easing sidebar, the hero each become ONE `*.browser.test.ts` with all their
invariants as `expect` clauses and ONE shared-browser visit. **Carries over
verbatim:** every assertion — the selectors, the computed-style checks, the
actuation sequences, the error-budget=0 counts, the `waitFor` predicates (now
runner-owned). **Consolidates:** the named redundancies from lane C §1 —
`card-rounded-primitive` clause-2 (R1 dup of `stage-glass-card`),
`easing-sidebar-minimal` B4 (R2-nested in `normalized`), `bezier-grown` clause-3
(re-measures `bezier-no-scroll`); the "non-zero border-radius" theme spread across
5 gates folds into ONE "all kf surfaces rounded" sweep. **Deletes:** the
`withPage`/`withBrowser` lifecycle (~115L), the 3-attempt retry loop, the
per-script reporter boilerplate, the 80+ cold boots, the redundant settle re-pays.
*Coverage invariant held: each deletion is a provable clause-duplicate or a
runner-mechanic, never an oracle.*

**Phase 4 — E2E/deploy + retire the chain.** Keep lighthouse + round-trip as the
thin scripted tier. Delete the serial `&&` `proof:all`/`proof:correctness`/
`proof:hygiene` chains; `npm run proof:all` becomes `vitest run` across the four
projects (parallel, report-all). The `demo-driver.mjs` `withBrowser`/`withPage`
machinery retires; the `SCENES` manifest + posture helpers move to `test/fixtures`.

**What carries over · consolidates · is deleted (summary):**

| Carries over VERBATIM | Consolidates | Deleted |
|---|---|---|
| Every assertion (selectors, computed-style, actuation, error budgets) | 33 lint processes → 1 parse-once pass | `withPage`/`withBrowser` (~115L) |
| The 890 unit tests | 67 browser scripts → ~N surface test files | the 3-attempt retry loop |
| The `gate-is-runtime` POLICY | 5 border-radius gates → 1 rounded sweep | per-script `failures[]`/`process.exit(1)` reporter |
| The `SCENES` manifest (→ fixtures) | the §1 R1/R2 duplicate clauses | 80+ cold chromium boots + server binds |
| The observe-only postures (→ tags) | node+vitest pairs → unit files | the serial `&&` chain (O(N²) iterate) |

---

## 4. THE COUNTERPOINT — where the apparatus is RIGHT and naive "just use vitest" LOSES

Honest both ways. A careless migration would discard real value:

1. **The built-dist requirement is NOT optional, and vitest-browser's default
   defeats it.** @vitest/browser runs your *source modules* through Vite in the
   browser. The `proof:gate-is-runtime` precept demands the gate actuate the
   **shipped `dist/gh-pages/` bytes**, not a Vite-transformed source graph — this
   caught the over-removal blank-out (`rootcause-rc-gate-blindspot.md:164`) and the
   subject-write seam that jsdom green-lit. **The migration MUST use vitest-browser
   as the runner/parallelizer/reporter while still `page.goto`-ing the served BUILT
   dist** (the page handle vitest hands you), not as a component-mount harness. A
   naive "mount the component in vitest-browser" loses the shipped-artifact oracle
   entirely. This distinction is the precept's whole point and is load-bearing.

2. **The published-surface / boundary checks are import-graph + shipped-artifact
   invariants, not test assertions.** `proof:boundary` (the LIGHT surface never
   statically pulls value.js) and `proof:published-surface` / `proof:agent-surface`
   police the *graph of the shipped package*, not runtime behavior. A naive "just
   write tests" misses them — they belong in the LINT/graph tier (a parsed-once
   dependency-cruiser graph), and that tier MUST exist; it is not subsumed by
   jsdom unit tests. Keep them, as graph lint, first-class.

3. **The device-honesty / observe-only category is a CI-policy axis vitest does
   not natively model.** The 9 observe-only declarations (`declarePosture`,
   `ci-env.mjs`) honestly separate device-dependent measurement (throttled frame
   ms, cross-OS pixel, absolute spring-settle) — RECORDED in CI, HARD on-device —
   from hard oracles. The `gate-taxonomy.md` manifest (Category + Architectural
   cure per row, machine-checked both directions) is principled and earned by the
   CI-Linux device-dependence lessons (`project_ci_device_dependence_greening`).
   The migration MUST carry it as a test tag / `skipIf(IN_CI)` predicate with the
   same manifest discipline — a naive port that makes everything hard everywhere
   re-introduces the cross-OS flake the posture axis was built to tame.

4. **The cold-entry / CI-Linux device-dependence lessons are real and must not be
   regressed.** The recorded lessons — FAIL-FAST master demo-smoke, render-races
   and absolute frame/ms thresholds that pass on macOS and fail on the slow Linux
   runner, `navToScene` per-expected-state, the round-trip observed — are hard-won.
   A shared-browser parallel tier changes the *timing envelope*; the migration must
   re-validate the observe-only thresholds against the new envelope (a synthetic
   clock injected into the rAF driver — the cure `gate-taxonomy.md` already
   prescribes — is the right durable fix, and it composes with this migration).

5. **The no-silent-drop oracle discipline is the apparatus's immune system.** The
   meta-gates (`gate-is-runtime`, `chronic-closure`, `ci-coverage`,
   `settle-is-predicate`, `manifest-sourced`) enforce that appearance facts have
   falsifiable owners and chronics cannot paper-close. They are NOT bloat — they
   are policy enforcement. They survive as the meta-unit in the LINT tier; deleting
   them to "simplify" would lose the discipline that makes the whole estate trustable.

**The fair bottom line:** the principle deserves its defenders; the implementation
does not. A migration that (a) drives the **built dist** through a shared
vitest-browser page, (b) keeps the **boundary/published-surface** checks as graph
lint, (c) preserves the **observe-only posture manifest** as test tags, and (d)
re-validates the **device-dependence thresholds** under the new timing envelope —
loses nothing real and converts 3 hours into minutes. Anything that skips (a)–(d)
is the naive mistake the counterpoint warns against.

---

## Recommendation summary — the Tranche-M charter seed

In priority order (safety × payoff), composing all three lanes:

1. **Phase 1 LINT tier** (eslint custom rules + one dependency-cruiser graph + one
   meta-unit) — replaces ~25% of the suite's process count with one sub-second
   parallel pass. Cheapest, safest, greenfield.
2. **Replace the serial `&&` chain with vitest's parallel report-all scheduling**
   (the moment the browser gates are vitest tests, this is the runner's default,
   not a bolt-on) — **THE direct kill of the O(N²) 3-hour iterate loop.** Nothing
   blocks it: ports are `listen(0)`, posture is stateless, dist is read-only; CI
   already shards.
3. **Phase 3 INTEGRATION tier** — @vitest/browser + shared browser + one
   globalSetup dist server, surface-by-surface, folding lane C's named redundancies.
   The wall-clock core; the biggest lift; highest absolute time saved.
4. **Carry the counterpoint guarantees** (built-dist navigation, boundary graph
   lint, observe-only manifest, device-dependence re-validation) — non-negotiable;
   these are what "just use vitest" would lose.

**The honest message to the owner:** *The apparatus is mostly earned coverage
behind sound principles — it is not 50% bloat. The 3 hours is the runner
architecture (serial · per-gate cold browser · no report-all · O(N²) iterate),
not the gates' intent. The cure is consolidation onto one first-class parallel
runner, named in the team's own CI YAML and not yet built. Tranche M is where it
lands.*

---

### Evidence index (every claim re-verified read-only, 2026-06-17)

- Gate counts: `node -e` over `package.json` → 150 `proof:*` keys, 4 aggregators,
  146 leaf, 142 in `proof:all`. 72 browser / 36 source-shape / 18 node+vitest /
  16 pure-vitest (lane A §1).
- Serial chain: `proof:hygiene` = **124 `&&`, 0 `;`, 0 `||`** (verified); `proof:all`
  = `proof:correctness && proof:hygiene`; no parallel runner in package.json
  (`concurrently|npm-run-all|run-p|turbo|xargs -P` → **0**).
- No shared browser: `demo-driver.mjs` `connectOverCDP|wsEndpoint|launchServer|
  reuseExisting` → **0**; `chromium.launch` → 2 paths; per-gate cold boot confirmed.
- Sleep tax: **264 `waitForTimeout`** across `scripts/proof-*.mjs`; **40** in
  `proof-live-session.mjs` (verified).
- Runner availability: **vitest 4.1.8** present (browser mode compatible);
  **`@vitest/browser` ABSENT** (install needed); **`playwright-core` 1.61.0**
  present; **eslint ABSENT** (LINT tier greenfield); **dependency-cruiser ABSENT**;
  no `browser` block in `vitest.config.ts`.
- Source-shape gates: 33 (no browser, no vitest, no chromium/playwright) verified;
  67 import demo-driver.
- Border-radius spread: 5 gates (`appearance-suffusion`, `card-rounded-primitive`,
  `scene-card-rounded`, `stage-glass-card`, `styling-idioms`) verified.
- Consecutive redundancy cluster (lane C §4): `scene-card-rounded → stage-glass-card
  → card-rounded-primitive → stage-within-docks → bezier-no-scroll →
  bezier-single-card → bezier-grown` — verified consecutive in the hygiene chain.
- Observe-only: **9** `declarePosture("observe-only")` declarations; manifest in
  `gate-taxonomy.md` (8 rows + the M2 touch-emulation = 9), machine-checked by
  `proof:ci-coverage` clause 4.
- ci.yml names the unbuilt cure: "one shared chromium+server, withBrowser reuse" +
  "F-7's static-gate migration out of demo-smoke" — verified present, unbuilt.
- Run logs: `/tmp/proof-all-L-final*.log` + `/tmp/hygiene-run4.log` are
  content-only (assertion lines, vitest `Duration` slices 0.4–1.2s); NO per-gate
  wall-clock timestamps — confirming lane A's per-gate timings were sample-timed
  (`time npm run proof:<x>`), not log-derived.
- Precept real-bug justification: runtime blank-out a source-shape gate missed,
  `docs/tranches/I/audit/rootcause-rc-gate-blindspot.md:164`; ROOT-A appearance
  misses, `docs/tranches/H/audit/a-gate-blindspots.md:21,82`.
- Lane sources: `gate-apparatus-A-taxonomy.md` (timing), `-B-contrivance.md`
  (two-harness/serial/precept), `-C-superfluity.md` (redundancy/minimal-set).
