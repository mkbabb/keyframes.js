# M.W3 — The @vitest/browser integration tier (shared browser, the runner retires)

- **Band:** A · **Class:** DEV (docs); IMPL opens on authorization · **Dep:** none
  (kf-internal; `@vitest/browser` from the npm registry — NOT a sibling publish
  gate; `@playwright/test@1.61.0` + `playwright-core@1.61.0` are ALREADY installed,
  so the provider is present — only `@vitest/browser` itself is the new install).
  Parallel with M.W2 ∥ M.W4; does NOT require M.W1 (but composes — M.W1's report-all
  runner schedules the browser project; once gates ARE `*.browser.test.ts`, the
  orchestrator is replaced by `vitest run --project browser` and `proof:all` is
  re-pointed, no parallel-runner tech-debt accrues — M.W1 S1 retirement seam).
- **Gate (new):** `proof:integration-tier` — born-RED on today's tree because
  **`@vitest/browser` is not installed** (`node_modules/@vitest/browser` ABSENT),
  there is **no `browser` project** in `vitest.config.ts` (jsdom-only, no
  `projects`/`browser` key), and **zero `test/*.browser.test.ts` files exist** (all
  verified 2026-06-17). GREEN only when the 72 runtime gates run as
  `*.browser.test.ts` over the SERVED built `dist/gh-pages` under ONE shared chromium
  + ONE server, each migrated gate assertion present VERBATIM, NO coverage lost, and
  the bespoke `demo-driver.mjs` runner retired.
- **Folds (lane #):** L13 (the apparatus-SOTA charter, Tier-c the integration
  tier) · L15 (the two-harness contrivance — the runner reinvention, the
  compliant-migration pattern, the LOC reduction) · L17 (browser-coldboot — the
  per-gate cold-boot lifecycle, the no-warm-reuse evidence, the shared-fixture
  design) · L5 (W5 orchestration — the drag/sequence vitest coverage gap, viol-M9)
- **Precept cure:** ⚠M6 (the reinvented test runner — no-legacy / no-workaround) ·
  viol-M9 (the W5 drag/sequence additions have ZERO vitest coverage)

---

## Context

The gate apparatus is over-engineered in its IMPLEMENTATION, not its principle
(lane-13 §2, lane-15 §11). The contrivance's wall-clock core is a **second,
hand-rolled test runner**: of the 146 leaf gates in `proof:all`, **72 (51%) spawn a
browser**, and every one of them **cold-boots its own chromium + its own
`node:http` server from zero with NO warm reuse** (lane-17 §1.2 / lane-15 §0,
verified live):

```
scripts importing demo-driver       = 67   (grep -l demo-driver scripts/proof-*.mjs)
self-launch chromium (not dd)        =  3   (easing-sidebar-minimal/normalized + bench-runs)
  browser-driving the SPA            =  69  (67 dd + 2 easing-sidebar; bench-runs is a bench harness)
multi-launch gates (≥2 chromium/run) → 72   (live-session×2, live-session-mobile×2,
                                            font-census, appearance-suffusion,
                                            fsm-suspend-resume-live, lighthouse-mobile)
@vitest/browser installed            = ABSENT   (node_modules/@vitest/browser)
@playwright/test installed           = 1.61.0   (PRESENT — the provider already exists)
playwright-core installed            = 1.61.0   (PRESENT)
vitest installed                     = 4.1.8
vitest.config.ts browser project     = ABSENT   (jsdom-only; no projects/browser key)
test/*.browser.test.ts files         = 0
connectOverCDP|wsEndpoint|launchServer|reuseExisting in demo-driver.mjs = 0 hits
```

The hand-rolled stack in `scripts/lib/demo-driver.mjs` re-implements, by hand,
everything vitest 4.1.8 (already installed) provides natively (lane-15 §2):

| Re-implemented by hand | demo-driver.mjs anchor | vitest provides |
|---|---|---|
| chromium launch + 3-attempt crash-retry | `withBrowser` (432; retry 450–495) | the browser provider + `retry` |
| `node:http` static server, fresh per gate | `serveDist` (318; `listen(0)` 340) | ONE `globalSetup` fixture |
| context + page lifecycle | `withPage` (513; `newContext` 534) | per-test context fixture |
| per-script `failures[]`/`ok`/`fail`/`process.exit(1)` | ~69 scripts | `expect()` + the reporter |
| scene roster + selectors | `SCENES` (258, sourced from `SCENES_TS` 81) | a `test/fixtures` import |
| `navToScene` per-destination-state settle | `navToScene` (741) | a shared browser-test fixture |

Because each `proof:<x>` is its own `npm run` → its own node process, **module-level
state cannot cross gates** (lane-17 §1.2): every gate re-launches chromium (~210 ms
fixed launch tax) and re-pays the SPA cold-boot — Vue hydration + scene-machine init
(~0.5–1 s/gate) — before it can assert. The shared-browser amortization is the
unbuilt cure named at `ci.yml:327` ("one shared chromium+server, withBrowser reuse")
since the F band, UNBUILT through L (lane-13 §1, lane-17 §4.2 VIOLATION 2).

**This is precept ⚠M6 (the reinvented runner — no-legacy / no-workaround) and a
GESTALT violation** (lane-15 §8): two parallel test infrastructures (vitest jsdom +
the bespoke proof runner) with no convergence point — no shared fixture, no shared
reporter, no shared parallelism model. M.W3 is the architectural transposition that
converges them onto ONE runner (inv-M-one-runner): the 72 runtime gates become
`*.browser.test.ts` files under the existing vitest, in a new `browser` project, over
ONE shared chromium + ONE served-dist server.

### The non-negotiable precept the migration MUST preserve (the trap)

`@vitest/browser` in its DEFAULT mode runs source modules through Vite in the browser
(component mount). **A naive component-mount migration defeats the
`gate-is-runtime` precept entirely** — it would test the Vite-transformed SOURCE
graph, not the shipped `dist/gh-pages/` bytes (lane-15 §4, lane-13 C1, the explicit
`gate-apparatus-VERDICT.md:229–239` warning). The `gate-is-runtime` precept caught
REAL bugs jsdom/grep structurally cannot: the over-removal blank-out
(`docs/tranches/I/audit/rootcause-rc-gate-blindspot.md:164`) and the ROOT-A
appearance misses (`docs/tranches/H/audit/a-gate-blindspots.md:21,82`).

The compliant pattern (lane-15 §4): use `@vitest/browser` as the
**runner/parallelizer/reporter** while each test body `page.goto(DIST_URL)` the
SERVED built dist — exactly as the gates do today via `withPage`. The `page` handle
vitest hands the test body is the same playwright `Page` the gates use now. **The
runner changes; the oracle does not.** This is the satisfaction of the built-dist
precept INSIDE vitest — the M.md M.W3 row: "page.goto the dist/gh-pages — the
built-dist precept satisfied inside vitest."

### The meta-gate that polices the precept must be re-pointed, not broken

`proof:gate-is-runtime` (lane-13 P3 / verified `scripts/proof-gate-is-runtime.mjs`)
is the apparatus's immune system: it DERIVES the correctness roster from the
`proof:correctness` chain string (`matchAll(/proof:[a-z0-9-]+/g)` at `:108`) and
asserts every member (a) opens a browser over the proven `serveDist` +
`KF_PLAYWRIGHT_DIR` chromium + `newContext` (`:18,202–203`), and (b) is wired into
the correctness tier (`:161–174`). When the browser gates become
`*.browser.test.ts`, the meta-gate's ENFORCEMENT must re-point at the new substrate:
it asserts every `*.browser.test.ts` `page.goto`s the served dist (not a
Vite-mounted component) and runs in the browser project. **The POLICY is unchanged;
only what it reads changes** (lane-13 Phase 0 keystone, lane-15 §4: "Same policy,
different plumbing it reads"). A migration that drops this re-point is a silent loss
of the built-dist oracle — the inv-M-observable-truth failure mode this wave forbids.

### viol-M9 — the W5 drag/sequence additions have ZERO vitest coverage

The L.W5 orchestration additions are covered ONLY by the node gates, never by
vitest (lane-5 §7 M-BOOK-2, verified live 2026-06-17):

- `test/drag.test.ts` has **ZERO** coverage of `bounds`, `rubberBand`, `snap`,
  `drag2D`, `Drag2DHandle` (`grep -c "bounds\|rubberBand\|snap\|drag2D\|Drag2DHandle"
  test/drag.test.ts` → **0**). The W5 behavior is covered ONLY by
  `proof-drag-gesture.mjs` (a BROWSER gate — uses demo-driver/chromium).
- `test/sequence-transport.test.ts` has **ZERO** coverage of `segment:enter`,
  `segment:leave`, `label` events, or `SequenceEventBus`
  (`grep -c "segment:enter\|segment:leave\|label\|SequenceEventBus"` → **0**). The
  SequenceEventBus is covered ONLY by `proof-transport-events.mjs` (a NODE gate).

This is ⚠M9 (test-completeness): pure-logic orchestration paths that belong on the
fast device-INDEPENDENT vitest axis (jsdom — no browser needed for bounds/snap/event
crossing logic) are stranded in node/browser gates. M.W3 closes the gap by authoring
the missing vitest coverage AS PART OF the migration — `proof-drag-gesture`'s
pure-logic assertions move to `test/drag.test.ts` (jsdom, no browser); only the
genuinely-browser-actuated drag clauses remain in the integration tier;
`proof-transport-events`'s crossing assertions move to `test/sequence-transport.test.ts`.
This is the inv-M-two-axis principle (M.W4) applied at the migration boundary: a
data-model truth (snap selection, event crossing) goes to the NODE/VITEST axis, not
forced through a browser.

### The redundant browser clauses fold here (zero coverage loss)

The named R1/R2 subsumptions (lane-13 §3, lane-15 §7, lane-17 — all verified
file:line) consolidate as their surfaces migrate to ONE shared-browser visit:

| Redundant clause | Type | Evidence | Folds into |
|---|---|---|---|
| `card-rounded-primitive` clause 2 | R1 exact dup | `proof-card-rounded-primitive.mjs:204–206` vs `proof-stage-glass-card.mjs:115–117` — identical `.stage-cell > [data-surface="glass"]` non-zero-radius query | the `stage-glass-card` browser test |
| `easing-sidebar-minimal` B4 | R2 nested + R4 double cold-boot | `proof-easing-sidebar-minimal.mjs:437,440` nested under `proof-easing-sidebar-normalized.mjs:343` (1 Card ⊆ 1 Card); two self-chromium boots → ONE shared visit | the `easing-sidebar` browser test |
| `bezier-grown` clause 3 | R1 re-measures | `proof-bezier-grown.mjs:34,39,52` self-documents reuse of `bezier-no-scroll` | the `bezier` browser test |
| "non-zero border-radius" (5 gates) | no single owner | `grep -l border-radius scripts/proof-*.mjs` → 5 (appearance-suffusion, card-rounded-primitive, scene-card-rounded, stage-glass-card, styling-idioms) | ONE "all kf surfaces rounded" sweep |

These are the ONLY deletions — provable clause-DUPLICATES with file:line evidence,
not oracle drops. Every non-redundant assertion migrates VERBATIM (the no-coverage-
loss precept, lane-13 §5 / lane-15 §5).

### Audit evidence

| Ref | Source location | Fact |
|-----|-----------------|------|
| lane-13 §1 | `ls node_modules/@vitest/browser` | **ABSENT** — the new install; `@playwright/test`/`playwright-core` 1.61.0 PRESENT |
| lane-17 §1.1 | 67 dd + 2 self-chromium + multi-launch | **72** browser gates (51% of 142) |
| lane-17 §1.2 | `demo-driver.mjs` `withBrowser` 432 / `withPage` 513 / `serveDist` 318,340 | per-gate cold-boot; `connectOverCDP\|wsEndpoint\|launchServer\|reuseExisting` → **0 hits** |
| lane-15 §4 | `proof-gate-is-runtime.mjs:18,108,202` | the precept = browser over the SERVED built dist; roster DERIVED from the `proof:correctness` chain string |
| lane-15 §4 | `gate-apparatus-VERDICT.md:229–239` | the compliant pattern — vitest-browser as runner/reporter while `page.goto(DIST_URL)`; NOT component-mount |
| lane-5 §7 | `test/drag.test.ts`, `test/sequence-transport.test.ts` | ZERO vitest coverage of W5 bounds/snap/drag2D + SequenceEventBus (viol-M9) — both `grep -c` → 0 |
| lane-13 §3 | `proof-card-rounded-primitive.mjs:204–206` etc. | the ~13 R1/R2 redundant browser clauses, file:line |
| lane-15 §2 | `demo-driver.mjs` `SCENES` 258 / `navToScene` 741 | domain data (scene roster, selectors) survives as a `test/fixtures` import; runner mechanics delete |
| lane-13 §3 / lane-15 §11 C3 | `ci-env.mjs` `declarePosture` | the 8(+M2) observe-only postures survive as `test.skipIf` tags with the `gate-taxonomy.md` manifest discipline — hardening is M.W4 (synthetic clock), NOT here |

---

## Scope

Each S-clause is a concrete, falsifiable deliverable. Together they constitute
`proof:integration-tier` GREEN: the 72 runtime gates run as `*.browser.test.ts` over
the served built dist under ONE shared chromium + ONE server, the W5 coverage gap
closed, NO oracle dropped, and `demo-driver.mjs` retired.

### S1 — `@vitest/browser` installed + the `browser` project exists over the BUILT dist

**Breach.** `node_modules/@vitest/browser` is absent; `vitest.config.ts` is
jsdom-only with no `projects`/`browser` key; zero `*.browser.test.ts` files exist
(verified 2026-06-17). The 72 runtime gates run as 72 bespoke node processes.

**Cure.** `npm install -D @vitest/browser` (the playwright provider's runtime,
`@playwright/test`/`playwright-core@1.61.0`, is ALREADY present — no new playwright
install). Add a `browser` project to `vitest.config.ts` (the modern `projects`
array — NOT a separate config file) configured with:
- `browser: { provider: "playwright", enabled: true, instances: [{ browser:
  "chromium" }] }` — ONE shared chromium, the provider's default reuse.
- a `globalSetup` that builds-or-reuses `dist/gh-pages` and serves it ONCE
  (`server.listen(0)`, the `serveDist` logic lifted from `demo-driver.mjs:318`),
  exposing the resolved base URL to the test context (an env var or a
  `provide()`/`inject()` channel).
- `test/*.browser.test.ts` as the project `include`.

**Constraint (the precept fence).** The browser project MUST be configured so test
bodies `page.goto(DIST_URL)` the served `dist/gh-pages` — it MUST NOT be a
component-mount project. No `*.browser.test.ts` may call `mount(Component)` /
`render(Component)` in lieu of navigating the served artifact (S4 enforces this).

**Falsifiable check.** `node_modules/@vitest/browser/package.json` resolves;
`vitest.config.ts` carries a `browser`-enabled project with a `globalSetup`;
`vitest run --project browser` launches chromium and serves the built dist once
(ONE `listen` in the run, not 72); at least one `*.browser.test.ts` exists.
Today: install absent, no project, 0 files → RED.

### S2 — ONE shared chromium + ONE server across the whole browser tier (warm-cache amortization)

**Breach.** Today each browser gate calls `withBrowser` → `chromium.launch()`
(`demo-driver.mjs:463`) + `serveDist` → `listen(0)` (`:340`) and tears BOTH down in
`finally` (`:539–544`) — **~80+ cold chromium launches + ~80+ server binds per
`proof:all`** (lane-17 §1.2: multi-launch gates push the count past the 72 gate
total). `connectOverCDP|wsEndpoint|launchServer|reuseExisting` → **0 hits**: no warm
reuse path exists anywhere in the harness.

**Cure.** The `browser` project's shared chromium (provider default) launches ONCE;
the `globalSetup` server binds ONCE. Every `*.browser.test.ts` opens its OWN context
(per-test isolation — localStorage, viewport, CDP session) from the shared browser
and `page.goto`s the shared server's URL. A context is ~5 ms; a chromium launch is
~210 ms; a Vue hydration is ~0.5–1 s (lane-17 §1.2) — per-test contexts over ONE
shared browser is the correct granularity (lane-17 §3 M-wave α).

**Constraint (isolation preserved).** Per-test contexts, NOT a shared page: each
gate is responsible for navigating to its scene via the migrated `navToScene` and
resetting any localStorage it cares about. The hand-written 3-attempt launch-retry
loop (`withBrowser:450–495`) — a workaround for cold-launch instability (lane-17 §4.2
VIOLATION 2) — is replaced by vitest's `retry` and made vestigial by the single warm
browser (one warm launch vs 80+ cold launches — transient launch crashes become rare).

**Falsifiable check.** Across a full `vitest run --project browser`, chromium is
launched exactly ONCE (instrument the provider / assert a single launch in the run
log) and the dist server binds exactly ONCE (one `globalSetup` listen). The
`demo-driver.mjs` per-gate `chromium.launch` + `serveDist` lifecycle is no longer on
the run path (S6). Today: ~80+ launches, ~80+ binds → RED.

### S3 — Every runtime gate's assertion migrates VERBATIM (no coverage lost)

**Breach (the risk, not a current defect).** A careless migration could drop oracles
— the no-coverage-loss precept (lane-13 §5, lane-15 §5) is the binding invariant:
every distinct regression a current gate catches MUST still be caught after the
migration. The gates' ASSERTIONS are the asset; the bespoke RUNNER is the liability.

**Cure.** Each of the 72 runtime gates' assertion bodies (selectors,
`getComputedStyle` checks, actuation sequences, error-budget=0 counts, settle
predicates) migrates VERBATIM into a `*.browser.test.ts` `expect` clause, organized
by SURFACE (the natural unit, lane-13 §5 Phase 3 / lane-15 §10): the bezier panel,
the stage card, the easing sidebar, the hero, the dock, each become ONE
`*.browser.test.ts` with all that surface's invariants as `expect` clauses and ONE
shared-browser visit. The `SCENES` manifest (`demo-driver.mjs:258`) →
`test/fixtures/scenes.ts`; `navToScene` (`:741`) + `subjectRect` + `openControlsPanel`
→ a shared browser-test fixture. The ONLY deletions are the named R1/R2 clause-
duplicates (the Context table — ~13 clauses, each with file:line evidence).

**Constraint.** No oracle is dropped that is not a PROVEN duplicate. A per-gate
migration manifest names, for each of the 72 gates, the `*.browser.test.ts` file its
assertions land in (or, for the ~13 redundant clauses, the surviving owner clause
they fold into). This is the lane-12 §3 spec-error lesson applied: the migration
must not silently lose a gate the way a mis-tiered gate silently escaped the
correctness roster.

**Falsifiable check.** A migration-manifest meta-test asserts: for every one of the
72 runtime gates, EITHER its assertions are present in a named `*.browser.test.ts`
file OR it is a named R1/R2 duplicate folded into a surviving owner. Zero gates
unaccounted. The total count of distinct invariants (browser `expect` clauses +
folded duplicates) ≥ the pre-migration distinct-invariant count. Today: 0 of 72
migrated → RED.

### S4 — The built-dist precept survives: `page.goto(DIST_URL)`, NOT component-mount (the keystone)

**Breach (the trap).** `@vitest/browser`'s default is component-mount through Vite —
which tests the SOURCE graph, not the shipped `dist/gh-pages/` bytes, defeating
`gate-is-runtime` entirely (lane-15 §4 C1, lane-13 C1). A naive migration that calls
`mount(MyComponent)` instead of `page.goto(DIST_URL)` loses the oracle that caught
the over-removal blank-out and the ROOT-A appearance misses.

**Cure.** EVERY `*.browser.test.ts` `page.goto`s the served `dist/gh-pages` (S1's
`globalSetup` URL) and actuates the rendered artifact — the same oracle as the
current gates. The `proof:gate-is-runtime` meta-gate is RE-POINTED (in this wave) at
the new substrate: instead of parsing the `proof:correctness` chain string and
asserting each member script opens a browser, it asserts every `*.browser.test.ts`
(a) `page.goto`s the served dist (not `mount`/`render` of a Vite-transformed
component) and (b) is in the browser project. The POLICY (correctness gates actuate
the built dist, zero budget) is UNCHANGED in substance; only its read-target moves
from `scripts/proof-*.mjs` to `test/*.browser.test.ts` (lane-13 Phase 0, lane-15 §4).

**Constraint.** This is the inv-M-observable-truth keystone of the wave: the gate
must bite the REAL failure mode — *"a migrated test mounts the component and silently
stops actuating the shipped bytes."* The proxy to AVOID: asserting a
`*.browser.test.ts` merely IMPORTS `@vitest/browser/context` (a file-shape check a
`mount`-based test would also pass). The gate must assert the test NAVIGATES the
served dist — a planted `mount(Component)`-only test must RED the re-pointed
`proof:gate-is-runtime`.

**Falsifiable check.** The re-pointed `proof:gate-is-runtime` exits 0 and its derived
browser-test roster is NON-EMPTY (equals the migrated surface set). A born-RED arm:
plant a `*.browser.test.ts` that `mount`s a component WITHOUT `page.goto(DIST_URL)` →
the re-pointed `proof:gate-is-runtime` REDs (the built-dist precept still bites
through the new topology). Today: the meta-gate reads the chain string and the
correctness roster is the 18 browser scripts; after cure it reads the browser project
and the roster is the migrated `*.browser.test.ts` set — both non-empty, the precept
unbroken.

### S5 — The W5 drag/sequence coverage gap closes on the right axis (viol-M9)

**Breach.** `test/drag.test.ts` has ZERO coverage of W5 `bounds`/`rubberBand`/`snap`/
`drag2D`/`Drag2DHandle`; `test/sequence-transport.test.ts` has ZERO coverage of
`segment:enter`/`segment:leave`/`label`/`SequenceEventBus` (both `grep -c` → 0,
verified 2026-06-17). The W5 behavior is covered ONLY by node/browser gates
(`proof-drag-gesture.mjs` — browser; `proof-transport-events.mjs` — node). These are
pure-logic, device-INDEPENDENT paths (snap selection, bounds clamp, event crossing)
that belong on the fast jsdom axis (lane-5 §7 M-BOOK-2, inv-M-two-axis).

**Cure.** As part of the migration, author the missing vitest coverage on the
correct axis (inv-M-two-axis):
- `test/drag.test.ts` gains jsdom tests for `bounds` clamp + `rubberBand`, `snap`
  nearest-target selection, and `drag2D` two-axis follow + `Drag2DHandle` export —
  the EXACT assertions `proof-drag-gesture.mjs`'s pure-logic clauses make (S1/S2/S4
  of L.W5, lane-5 §2/§4: a drag past max clamps `spring.target`; a release reseats to
  the nearest snap; drag2D follows both axes). Only the genuinely browser-ACTUATED
  drag clauses (real pointer events over the rendered dist) remain in the integration
  tier as a `*.browser.test.ts`.
- `test/sequence-transport.test.ts` gains jsdom tests for `SequenceEventBus`
  crossings: `segment:enter`/`segment:leave` edge detection and `label` straddle —
  the EXACT assertions `proof-transport-events.mjs` clauses (b)/(c) make (lane-5 §3:
  `segment:enter` fires with `(segB, masterClock=1200)`; `label` fires with
  `(name="mid", masterClock=800)`).

**Constraint.** This is NOT new behavior — it is coverage of EXISTING behavior on the
device-independent axis (the W5 logic is unchanged). The node-gate assertions move to
jsdom where they are device-honest by construction (no browser, no settle sleep). The
browser gate's pure-logic clauses are subtracted from `proof-drag-gesture` as they
land in `test/drag.test.ts` (no double-coverage carry).

**Falsifiable check.** `grep -c "bounds\|rubberBand\|snap\|drag2D" test/drag.test.ts`
> 0 AND those tests exercise the clamp/snap/2D-follow behavior (a planted regression
— remove the bounds clamp in `drag.ts` — reds them); `grep -c
"segment:enter\|label\|SequenceEventBus" test/sequence-transport.test.ts` > 0 AND a
planted regression (break the crossing straddle test) reds them. Today: both
`grep -c` → 0 → RED.

### S6 — The bespoke `demo-driver.mjs` runner retires (the runner converges to ONE)

**Breach.** `demo-driver.mjs` (826 LOC) is the second runner: `withBrowser`/`withPage`
lifecycle (~115L, `:432–548`), the 3-attempt retry loop (~35L, `:450–495`),
`serveDist` (~30L, `:318–348`), the signal-safe teardown registry, and the per-script
`failures[]`/`ok`/`fail`/`process.exit(1)` reporter pattern in ~69 scripts — ~890 LOC
of pure runner plumbing (lane-15 §5) that vitest owns natively.

**Cure.** Once the 72 gates are `*.browser.test.ts`, the runner machinery RETIRES:
- `withBrowser`/`withPage` → vitest's browser provider + per-test context.
- the retry loop → vitest `retry`.
- `serveDist` → the ONE `globalSetup` (the function BODY is lifted, the per-gate
  invocation deletes).
- the per-script reporter boilerplate → `expect()` + the vitest reporter.
- `SCENES` + `navToScene` + the settle helpers → `test/fixtures/` (domain data and
  shared fixtures survive; runner mechanics delete).
- `proof:all`'s browser tier → `vitest run --project browser` (parallel by default,
  report-all by default — composing with M.W1's runner change).

**Constraint (inv-M-one-runner).** There is ONE runner after this wave: vitest, with
a jsdom UNIT project (existing) and a chromium BROWSER project (new). The
`demo-driver.mjs` `withBrowser`/`withPage`/`serveDist` lifecycle is ABSENT from the
browser-test run path (the surviving `serveDist` body is the `globalSetup` source, not
a per-gate call). The observe-only posture axis (`ci-env.mjs` `declarePosture`, 8+M2
declarations) survives as `test.skipIf(IN_CI)` tags with the same `gate-taxonomy.md`
manifest discipline — no posture is HARDENED here (the synthetic-clock hardening is
M.W4); the 264 `waitForTimeout` settle sleeps are addressed by M.W4's synthetic clock,
NOT swallowed in this wave.

**Falsifiable check.** `grep -rn "withBrowser\|withPage" test/ scripts/proof-*.mjs` →
0 on the migrated browser tier (the lifecycle is no longer invoked by any gate);
`demo-driver.mjs`'s `withBrowser`/`withPage` are absent or reduced to the lifted
`serveDist` body now living in the `globalSetup`; `proof:all`'s browser path is a
`vitest run --project browser` invocation, not 72 `npm run proof:*` forks. The
existing jsdom vitest project is unchanged (no test regressed). Today:
`withBrowser`/`withPage` invoked by 67 scripts → RED.

---

## Born-RED gate

**Gate name:** `proof:integration-tier` (NEW — does not exist in `package.json` or
`scripts/`; this wave authors it). Verified absent 2026-06-17.

**Structure.** The gate composes its clauses over the REAL migrated tier (not a
proxy): (a) `@vitest/browser` resolves AND `vitest.config.ts` carries a browser
project with a `globalSetup`; (b) `vitest run --project browser` launches chromium
ONCE + serves the built dist ONCE (warm amortization, instrumented in the run); (c)
the migration-manifest meta-test maps every one of the 72 runtime gates to a named
`*.browser.test.ts` (or a folded R1/R2 owner) with NO oracle dropped; (d) the
re-pointed `proof:gate-is-runtime` derives a NON-EMPTY browser-test roster, each test
`page.goto`s the served dist (the precept), and a planted `mount`-only test REDs it;
(e) the parallel worker count ≥ 2 (the serial chain is dead on the browser tier); (f)
the W5 coverage gap is closed on the jsdom axis (S5).

**The REAL observable (inv-M-observable-truth — NOT a proxy).** The L.W1 S4 lesson is
the binding precedent: that gate tested a PROXY (no-throw + string round-trip) and
missed the genuine NaN-frame breach. The two proxies M.W3's gate must AVOID:

1. **File-presence as a stand-in for actuation.** Asserting that
   `test/*.browser.test.ts` files EXIST, or that they IMPORT `@vitest/browser/context`,
   says nothing about whether they actuate the shipped bytes — a `mount(Component)`
   test passes both checks while losing the built-dist oracle. The gate MUST assert
   each migrated test NAVIGATES the served dist (the re-pointed
   `proof:gate-is-runtime` clause d), and a PLANTED component-mount-only test MUST RED.

2. **Test-COUNT as a stand-in for coverage.** Asserting "N browser tests exist" or "N
   ≥ 72" says nothing about whether each ORIGINAL oracle survived — a migration that
   drops 10 assertions and adds 10 trivial ones passes a count check while silently
   losing coverage. The gate MUST run the per-gate migration manifest (clause c): each
   of the 72 gates maps to a surviving assertion or a proven-duplicate fold, and a
   PLANTED dropped-oracle (delete a migrated assertion) MUST RED the manifest.

**Witness inputs that RED today / GREEN after cure:**

| Clause | Witness on today's tree | Failure mode today | Expected after cure |
|--------|-------------------------|--------------------|---------------------|
| S1 | `node_modules/@vitest/browser`; `vitest.config.ts` browser project; `vitest run --project browser` | install absent; no project; no `*.browser.test.ts` | resolves; project + globalSetup present; the project runs |
| S2 | instrument chromium launches + server binds across a full browser run | ~80+ cold launches, ~80+ binds | exactly 1 launch + 1 bind (warm-amortized) |
| S3 | the per-gate migration-manifest meta-test | 0 of 72 gates migrated → unmapped | all 72 mapped (verbatim assertion OR named R1/R2 fold); distinct-invariant count preserved |
| S4 | the re-pointed `proof:gate-is-runtime` over the browser project; plant a `mount`-only test | meta-gate reads the chain string (18 script roster); no `*.browser.test.ts` substrate | non-empty browser-test roster; each `page.goto`s the dist; the planted `mount`-only test REDs |
| S5 | `grep -c "bounds\|snap\|drag2D" test/drag.test.ts`; `grep -c "segment:enter\|label\|SequenceEventBus" test/sequence-transport.test.ts`; plant a clamp/crossing regression | both → 0 (zero vitest coverage); regressions invisible to jsdom | both > 0; the planted regressions red the new jsdom tests |
| S6 | `grep -rn "withBrowser\|withPage" scripts/proof-*.mjs test/` | invoked by 67 scripts | 0 on the migrated tier; the lifecycle retired; `proof:all` browser path = `vitest run --project browser` |

**Today's tree result.** `proof:integration-tier` exits non-zero by construction at
S1: `@vitest/browser` is not installed (`node_modules/@vitest/browser` ABSENT), there
is no browser project in `vitest.config.ts`, and zero `*.browser.test.ts` files exist.
This is not a contrived red — it is the actual absence the wave cures. The 72 runtime
gates live as 72 bespoke node processes the new tier replaces.

**Green condition.** `@vitest/browser` installed + a browser project over a
`globalSetup`-served `dist/gh-pages`; `vitest run --project browser` launches ONE
shared chromium + binds ONE server; all 72 runtime gates migrated `*.browser.test.ts`
(assertions verbatim, the ~13 R1/R2 duplicates folded, NO oracle dropped); the
re-pointed `proof:gate-is-runtime` proves every test `page.goto`s the served dist (a
planted `mount`-only test REDs); the W5 drag/sequence coverage gap closed on the jsdom
axis; `demo-driver.mjs`'s `withBrowser`/`withPage` retired. ONE runner (inv-M-one-
runner): vitest, jsdom UNIT + chromium BROWSER projects.

**Why this is the genuine defect, not a proxy.** S2 (the warm-amortization observable
— 1 launch vs 80+) and S4 (the planted `mount`-only test reds the re-pointed precept)
together ARE the real architecture change, falsifiable on the running tier: the gate
counts the actual chromium launches in a real run, and it plants a real
oracle-defeating test and observes the precept gate red. S3 (the planted dropped-
oracle reds the manifest) bites the real coverage-loss failure mode, not a test-count
proxy. No file-presence check, no import-shape check, no count threshold stands
between the gate and the real behavior.

---

## Dependencies

- **`@vitest/browser` (npm registry)** — `npm install -D @vitest/browser`. The
  playwright provider runtime (`@playwright/test` + `playwright-core@1.61.0`) is
  ALREADY installed (verified 2026-06-17), so this is the SINGLE new install. NOT a
  sibling publish gate; greenfield browser-project config (lane-13 §10: "the
  gate-apparatus consolidation is entirely kf-internal — no sibling repo publishes or
  consumes the test infrastructure").
- **No sibling dep (kf-internal).** value.js, parse-that, and glass-ui have NO role
  in the test infrastructure (lane-13 §10, lane-17 §6: "this lane is entirely
  kf-internal"). The only adjacency: glass-ui's dock spring animations run in the demo
  page — verified non-blocking; the synthetic-clock interaction with them is M.W4's
  concern, not this wave's.
- **Composes with M.W1 (does NOT require it).** M.W1's report-all runner schedules
  the browser project as one node it no longer aborts the chain on; once the gates ARE
  `*.browser.test.ts`, M.W1's orchestrator is REPLACED on the browser path by
  `vitest run --project browser` (M.W1 S1 retirement seam). M.W3 lands independently;
  the iterate-count win (M.W1) and the per-pass wall-clock win (M.W3) compound.
- **Composes with M.W4 (does NOT require it).** M.W4's synthetic clock is the cure
  for the 264 `waitForTimeout` settle sleeps and the observe-only → hard hardening.
  M.W3 migrates the sleeps AS-IS (carried, not swallowed) and the observe-only
  postures AS `test.skipIf` tags; M.W4 hardens them under the new envelope. The
  device-honesty re-validation (lane-13 §3 C4: the shared-browser timing envelope
  differs from per-gate cold-boot) is M.W4's, gated on this wave's stable tier.
- **Re-point co-edit (in-wave, not a separate dep).** `proof:gate-is-runtime` and
  `proof:ci-coverage` are re-pointed in the SAME wave commit as the migration — they
  must stay green throughout, reading the new `test/*.browser.test.ts` substrate
  instead of the `scripts/proof-*.mjs` chain (S4, lane-13 Phase 0 keystone).

---

## Bite — what regression each clause catches

| Clause | Regression it prevents |
|--------|----------------------|
| S1 browser project | The integration tier never runs — a runtime regression ships because no browser project actuates the built dist (the tier is absent / mis-configured as component-mount) |
| S2 shared browser | A migration that report-alls but re-launches chromium per test (forgetting provider reuse) re-introduces the ~80+ cold-boot tax — the launch-count instrument catches it |
| S3 verbatim coverage | A migration that SILENTLY drops an oracle (deletes an assertion under cover of "consolidation") — the per-gate manifest + planted dropped-oracle bite the real coverage-loss, not a test-count proxy |
| S4 built-dist precept (keystone) | A `*.browser.test.ts` that `mount`s a Vite-transformed component instead of `page.goto`-ing the shipped bytes — defeating `gate-is-runtime` — reds the re-pointed meta-gate on a planted `mount`-only test |
| S5 W5 coverage (viol-M9) | The drag bounds/snap/drag2D + SequenceEventBus crossing logic regresses invisibly because it lives ONLY in node/browser gates, never on the device-independent jsdom axis |
| S6 runner retirement | A future contributor re-introduces a `withBrowser`/`withPage` cold-boot gate beside the vitest tier (two runners again) — the inv-M-one-runner convergence is asserted; the bespoke lifecycle stays retired |

---

## Excluded from this wave

- **The serial `&&` → parallel report-all runner** (M.W1) — the runner TOPOLOGY over
  the existing gate scripts. M.W3 changes WHAT the runner schedules (vitest browser
  tests), not the report-all accumulator itself; once migrated, M.W1's orchestrator is
  replaced by `vitest run --project browser` on the browser path. Orthogonal; compose.
- **The eslint + dependency-cruiser LINT tier** (M.W2) — the 33 SOURCE-SHAPE gates →
  static rules. M.W3 touches ZERO source-shape gates; it owns ONLY the 72 runtime
  (browser) gates. The boundary/published-surface GRAPH checks belong in M.W2's
  depcruise tier, NOT in browser tests (lane-15 §11 C2).
- **The synthetic-clock settle + the observe-only → hard hardening + the two-axis
  taxonomy reform** (M.W4) — the 264 `waitForTimeout` sleeps and the device-honesty
  re-validation under the new timing envelope. M.W3 carries the sleeps AS-IS and the
  observe-only postures as `test.skipIf` tags; it does NOT swallow them and does NOT
  harden them (lane-13 §3, lane-17 §3 — the synthetic clock is M.W4's discharge).
- **The superfluity prune BEYOND the named R1/R2 browser duplicates** — M.W3 folds
  ONLY the ~13 file:line-proven clause-duplicates (the Context table) as their surfaces
  migrate; any broader subsumption analysis is M.W4 (lane-16 §5).
- **The Band-B compile/ingest correctness waves** (M.W5–W7) and the Band-C
  constellation consumes (M.W8–W11) — orthogonal; M.W3 is Band-A apparatus only.
- **Any change to WHICH product behavior a gate asserts.** M.W3 substitutes the
  RUNNER over IDENTICAL oracles (plus closes the W5 jsdom coverage gap for EXISTING
  behavior). The 72 gates' product-correctness authority is preserved verbatim.
