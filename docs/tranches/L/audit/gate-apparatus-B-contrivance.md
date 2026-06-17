# Gate-apparatus audit B — the contrivance critique (principle vs implementation)

**Status:** ANALYSIS ONLY. Read-only. No gate changed, no code written, no
`proof:all` re-run (its slowness IS the subject — re-running it would re-pay the
3-hour tax this doc exists to explain). Timing evidence is taken from doc A
(`gate-apparatus-A-taxonomy.md`, sampled wall-clock) and the existing run logs
`/tmp/proof-all-L-final*.log` + `/tmp/hygiene-run4.log`. Every structural claim
cites `file:line`.

This doc is the candid follow-on to doc A. Doc A *measured* where the 3 hours
went (browser tier + serial `&&` chain). This doc answers the four architectural
questions the owner asked: **is the apparatus a reinvented test runner, are the
lint gates superfluous node scripts, why is it serial, and is the
gate-is-runtime precept sound-in-principle-but-contrived-in-implementation.**

The one-line verdict, stated plainly:

> **The PRINCIPLE is largely sound. The IMPLEMENTATION is a hand-rolled,
> second test runner bolted alongside vitest — it re-implements browser launch,
> test discovery, reporting, fixtures, and (badly) parallelism, then runs the
> result as a serial `&&` shell chain. The contrivance is not the gates' intent;
> it is that they are 128 separate node processes doing a test runner's job
> without a test runner.**

---

## Q1 — TWO HARNESSES: is the bespoke `proof:*` runner a reinvented test runner?

### The finding: yes, demonstrably — there are two test infrastructures.

The repo runs **two parallel test infrastructures** that do not share a runner:

1. **vitest** (`vitest.config.ts`, `test/` — ~890 tests / 89 files, jsdom) — the
   real test runner: discovery, parallel workers, reporters, fixtures,
   `expect`, retry.
2. **a bespoke node `proof:*` runner** — **128** `scripts/proof-*.mjs` scripts
   (verified: `ls scripts/proof-*.mjs | wc -l` → 128), of which **67 import
   `scripts/lib/demo-driver.mjs`** (`grep -l demo-driver scripts/proof-*.mjs |
   wc -l` → 67) and **2 more launch their own chromium** via `createRequire`
   (`proof-easing-sidebar-minimal.mjs:66`, `proof-easing-sidebar-normalized.mjs`)
   — so **~69 gate scripts drive a real browser by hand.**

The browser gates HAND-ROLL the entire test-runner stack. Evidence from
`scripts/lib/demo-driver.mjs`:

- **Browser launch** — `withBrowser` (line 432): `resolveChromium()` →
  `chromium.launch()` (line 463), with a hand-written 3-attempt launch-crash
  retry loop (lines 450–495) that **re-implements vitest's `retry` fixture**.
- **Server / fixture** — `withPage` (line 513): `serveDist()` (a hand-written
  `node:http` static server, `server.listen(0)` at line 340), `newContext`,
  `newPage`, and a hand-written teardown-in-`finally` (lines 539–544) with a
  `registerTeardown` signal-safe registry — **this is a fixture lifecycle,
  re-implemented.**
- **Test discovery / manifest** — the `SCENES` manifest (lines 81–100+) is a
  hand-built scene roster re-sourced from `demo/app/scenes.ts` with a stale-key
  guard — **this is test parametrization, re-implemented.**
- **Reporting** — every gate re-declares the SAME reporter primitives inline:
  `const failures = []; const ok = …; const fail = …; process.exit(1)`
  (`proof-live-session.mjs:91–96`, `proof-gate-is-runtime.mjs:66–72`, and
  dozens more). The `✓`/`✗`/`process.exit(1)` pass/fail protocol is
  copy-declared per script — **this is a reporter, re-implemented N times.**
- **Parallelism** — none (see Q3). vitest gives this free; the bespoke runner
  threw it away.

So: launch, fixtures, retry, parametrization, reporting, and (the absence of)
parallelism are all hand-rolled. **This is a reinvented test runner.** The only
thing it adds over vitest that vitest-the-jsdom-config lacks is *a real browser
over the built dist* — and that capability is exactly what `@vitest/browser`
provides natively.

### Would `@vitest/browser` subsume the browser gates?

vitest **4.1.8** is already the installed runner (`node_modules/vitest` →
`4.1.8`). Vitest 4's browser mode (`@vitest/browser` with the `playwright`
provider) ships precisely the capabilities the 69 hand-rolled gates
re-implement: **one shared browser instance, parallel test files across workers,
test/-colocated `*.browser.test.ts`, `retry`/`fixtures`, and a unified
reporter.** A migration would let a browser gate be written as an ordinary
`test()` that gets a real page, with the launch/serve/teardown owned by the
runner.

**What vitest-browser WOULD replace (the bulk):**

- The `withBrowser`/`withPage` lifecycle (`demo-driver.mjs:432–548`) → the
  runner's browser provider + a `beforeAll` server fixture. ~115 lines of
  hand-rolled launch/retry/teardown deleted.
- The per-script `failures[]` / `ok` / `fail` / `process.exit(1)` reporter
  boilerplate → `expect()` + the vitest reporter. Deleted from ~69 scripts.
- The serial `&&` execution of the browser tier (Q3) → vitest's default
  parallel file scheduling.
- The 3-attempt launch retry (`demo-driver.mjs:450–495`) → vitest `retry`.
- The hand-rolled static server could remain as ONE `globalSetup` fixture
  (serve `dist/gh-pages` once, shared) instead of 80+ per-gate `serveDist`
  binds.

**What vitest-browser would NOT replace (be honest):**

- **The built-dist requirement.** vitest-browser runs your *source modules*
  through Vite in the browser; the `proof:gate-is-runtime` precept demands the
  gate actuate the **built `dist/gh-pages/` SPA** (the shipped artifact), not a
  Vite-transformed source graph. To preserve "test the shipped bytes," you'd run
  vitest-browser tests that `page.goto()` the served *built* dist (using the
  page handle vitest hands you) rather than mounting components — i.e. use
  vitest-browser as the *runner/parallelizer/reporter* while still navigating
  the real built artifact. This is a real distinction and the precept's whole
  point; it is NOT a blocker, but it means the migration is "use vitest-browser's
  page + workers to drive the built dist," not "rewrite gates as component
  mounts."
- **The `SCENES` manifest semantics.** The scene roster, subject selectors, and
  `dockFloatAllowed` design data (`demo-driver.mjs:93–100`) are domain knowledge,
  not runner mechanics. They survive as a shared `test/fixtures` import.
- **The observe-only / device-honesty posture** (`ci-env.mjs` `declarePosture`,
  Q4) — a CI policy axis orthogonal to the runner. It survives as a test tag /
  `test.skipIf(IN_CI)` predicate.
- **Lighthouse / the `proof:lighthouse-*` gates** — those drive lighthouse over a
  served URL; they are not test-runner-shaped and stay as scripts (or a single
  vitest test that shells lighthouse).

**Verdict Q1:** The browser gates are a reinvented test runner. `@vitest/browser`
(already on a compatible vitest 4.1.8) subsumes ~80% of the hand-rolled
machinery — launch, retry, fixtures, reporting, parallelism, test/ colocation —
while the built-dist navigation, the SCENES manifest, and the posture axis are
preserved as fixtures/tags on top. **The reinvention is not justified; the only
genuinely-bespoke need (drive the built artifact, not source) is satisfiable
inside vitest-browser by `page.goto`-ing the served dist.**

---

## Q2 — SOURCE-SHAPE GATES AS NODE SCRIPTS: how many are lint-class?

### Quantification

Of the 128 gate scripts, **33 are source-shape** — no browser, no vitest, pure
`fs.readFileSync` + grep/`wc`-equivalent over the tree (verified:
`grep -L demo-driver|chromium|playwright scripts/proof-*.mjs`, minus those that
shell vitest → 33). Doc A counts 36 within `proof:all`'s membership (the small
delta is gates wired into CI jobs / `proof:all:demo`, not the main chain). Either
way: **~33–36 gates, ~25% of the suite, are LINT-CLASS invariants implemented as
standalone node scripts.**

The roster (each re-reads the tree from scratch in its own process):

```
boundary  decomposition  no-dup-utility  no-brittle-selector  demo-no-oversize
single-writer  idioms  styling-idioms  icon-idiom  phi-leaf-zero  brittleness
composable-encapsulation  no-deprecated-guard  no-single-option-select
modern-web  dogfood  dogfood-hero  engine  crayon-preserved  chronic-closure
ci-coverage  agent-surface  control-point-live  deps-current  peer-satisfied
platform-adopt  pp-logo-svg  readme-runs  transport-events  workaround-deletion
demo-on-published-surface  keyframes-vue-published  gate-is-runtime
```

These are textbook lint rules. Concrete proofs they are pure static shape:

- **`proof:demo-no-oversize`** (199L) — a **file-size ceiling**:
  `fs.readFileSync(abs).split("\n").length` then `lines > CEILING` (lines 76–80).
  This is `max-lines`, the canonical ESLint rule, re-implemented in 199 lines.
- **`proof:decomposition`** (982L) — clause 1 is the **library file-size ceiling**
  (`≤350L .vue / ≤550L .ts`, with a per-file override map). Also `max-lines`,
  plus a no-duplicate-module check. 982 lines.
- **`proof:boundary`** (405L) — the **import-edge** static/dynamic boundary: a
  module-graph analysis asserting the LIGHT surface never statically imports
  value.js. This is precisely `import/no-restricted-paths` / a dependency-cruiser
  rule — an import-graph lint.
- **`proof:no-dup-utility`** (242L) — duplicate-function detection across the
  tree. A `no-duplicate-code` lint.
- **`proof:no-brittle-selector`** (270L) — forbids brittle CSS/test selectors. A
  grep-rule lint.
- **`proof:single-writer`** (206L) — single-writer-of-a-property invariant. A
  grep-rule lint.

Sampled timings (doc A §2) confirm these are *cheap* — `no-dup-utility` 0.16s,
`single-writer` 0.17s, `decomposition` 0.25s, `boundary` 0.69s — but they each
pay the **~0.18s npm-fork tax** (doc A §3) AND re-read the source tree
independently. **33 gates × (fork + tree-read) ≈ ~10–15s of pure overhead doing
what one lint pass over a parsed-once module graph would do in <2s.**

### Could these be ESLint rules / one lint pass / a vitest unit over a parsed graph?

Yes, in three tiers:

1. **The pure grep/size rules** (`demo-no-oversize`, `decomposition` clause-1,
   `single-writer`, `no-brittle-selector`, `idioms`, `styling-idioms`,
   `no-single-option-select`, `no-deprecated-guard`) → **ESLint custom rules** or
   a single `vitest` unit that globs + reads the tree ONCE and asserts. `max-lines`
   is literally a built-in ESLint rule; the rest are ~20-line custom rules. One
   `eslint .` invocation parses each file once and runs all rules — instead of 8
   separate node processes each re-reading the tree.
2. **The import-graph rules** (`boundary`, `no-dup-utility`, parts of
   `decomposition`) → **one parsed module graph** (via `dependency-cruiser`,
   `eslint-plugin-import`, or a single `ts-morph`/`@typescript-eslint` pass) that
   builds the graph ONCE and runs all edge assertions. `boundary`'s 405 lines of
   hand-rolled graph walking is the most-justified to keep bespoke (the
   static/dynamic split is project-specific), but it should consume a
   parsed-once graph, not re-parse.
3. **The meta-gates over package.json/scripts** (`gate-is-runtime`,
   `chronic-closure`, `ci-coverage`) → a single vitest unit that loads
   `package.json` once and asserts the chain shape. `gate-is-runtime` reading
   every correctness gate's *source* (`proof-gate-is-runtime.mjs:187`) is a
   one-pass static read that belongs in a unit test, not a standalone process.

**Verdict Q2:** **~25% of the suite (33–36 gates) is lint-class** and should be
a **single fast lint pass** (ESLint custom rules + one dependency-cruiser graph)
or **one vitest unit file** that reads the tree once. The contrivance here is not
that the invariants are wrong — they are good invariants — it is that each is a
**separate process that re-reads the whole tree**, when ESLint's entire design is
"parse once, run many rules." This is the cheapest tier to consolidate and the
clearest superfluity.

---

## Q3 — THE SERIAL `&&` CHAIN: why not parallel? What blocks it?

### The chain is verifiably pure-serial

`proof:hygiene` and `proof:correctness` and `proof:all` are unbroken `&&`
chains. Direct evidence from `/tmp/hygiene-run4.log` — the chain header is one
line of **~133 `&& npm run proof:*` clauses terminating in `&& vitest run`**
(reproduced in the log; ~133 distinct gates counted via
`grep -oh "proof:[a-z0-9-]*" /tmp/hygiene-run4.log | sort -u | wc -l` → 133).
Doc A §3 verifies: `proof:hygiene` has **124 `&&`, zero `;`, zero `||`**, and
package.json contains **no parallel runner** (`concurrently:false`,
`npm-run-all/run-p:false`, `xargs -P:false`, `turbo:false` — verified directly).

`&&` **aborts on first non-zero exit.** Doc A §3 derives the consequence
rigorously: a red at position *k* runs gates `1…k`, dies, reports ONE failure;
the re-run re-pays `1…k` (no green-skip cache); reds distributed through the
chain cost the **sum of prefixes → O(N²)**, and each prefix re-run is browser-
heavy (~15–30 min). **5–6 reds × ~30-min prefix = ~2.5–3 h** — the owner's
measured 3 hours. The math is not mysterious; it is serial-`&&`-meets-
browser-minutes.

### What blocks parallelism today? (the load-bearing investigation)

I checked each candidate blocker the brief named. **Almost nothing blocks it —
which makes the serial chain the purest contrivance in the apparatus:**

| Candidate blocker | Real? | Evidence |
|---|---|---|
| **Port collisions** in per-gate servers | **NO** | `serveDist` binds `server.listen(0)` (`demo-driver.mjs:340`) — OS-assigned ephemeral port. Two gates running concurrently get distinct ports. **Ports do not collide.** |
| **`declarePosture` global state** | **NO** | `declarePosture` (`ci-env.mjs:85`) is a **pure per-call factory** — returns `{ posture, inCI, miss }`, mutates no module/process state. `IN_CI` is a read-only const (`ci-env.mjs:41`). **No shared mutable state.** |
| **Shared `dist/gh-pages` build** | **PARTIAL** | The built dist is a shared *read-only* input (`withPage` checks `index.html` exists, `demo-driver.mjs:524`). Concurrent gates *read* it safely; the only constraint is "build once before the parallel fan-out," which the chain already does implicitly. **Read-only sharing is not a blocker.** |
| **Per-gate process isolation** | **NO** (it's the cause, not a blocker) | Each gate is its own `npm run` → its own node process (doc A §3). There is no shared module state to race on — which is *why* they parallelize trivially. The isolation that makes them slow (no warm-browser reuse) also makes them embarrassingly parallel. |

**So nothing real blocks parallelism.** Ports are ephemeral, posture is stateless,
dist is read-only. The serial chain is a choice (a shell `&&` string), not a
constraint.

The proof that it's a free win: **CI already shards the browser gates into a
parallel matrix** (doc A §0 / ci.yml: the `KF_REQUIRE_BROWSER` demo-smoke job
runs gates in a GHA matrix). So the parallelism exists in CI and is simply
*absent locally*. The local developer pays a serial tax CI does not.

### What parallel should look like

Three options, increasing in payoff:

1. **`npm-run-all -p` / `concurrently`** over the leaf gates — runs all, collects
   ALL reds, reports once. Kills the O(N²) iterate loop. Lowest risk; a
   package.json edit. **This alone converts "3 hours of one-red-per-re-run" into
   "one ~15-min run that lists every red."**
2. **A single vitest config that owns all tiers** — vitest parallelizes test
   *files* across workers by default; if the gates were vitest tests (Q1 + Q2),
   parallelism is the runner's default, not a bolt-on.
3. **A task runner (turbo) with caching** — adds green-skip: an unchanged gate's
   green is cached, so a re-run only re-pays the gates whose inputs changed. This
   directly kills the "re-run 70 greens before the red" tax doc A §3 names.

**Verdict Q3:** The serial `&&` chain is the **single highest-payoff, lowest-risk
contrivance** to remove. Nothing blocks parallelism — ports are `listen(0)`,
posture is stateless, dist is read-only — and CI already proves the gates shard.
The local serial chain is strictly worse than CI for no architectural reason. It
is the direct, sole cause of the 3-hour iterate-to-green witness.

---

## Q4 — THE `proof:gate-is-runtime` PRECEPT: principle vs implementation

### The principle IS sound — cite the real bug.

The precept (`proof-gate-is-runtime.mjs:8–24`): a CORRECTNESS gate's oracle must
be *the product property a human would check, exercised through the same surface
the human uses, error budget zero* — NOT a source grep, a jsdom unit, a
serialized snapshot, or a self-baseline. The meta-gate enforces it by reading
every `proof:correctness` member's script and asserting it (a) opens a real
browser over the built dist (`serveDist + KF_PLAYWRIGHT_DIR + newContext`,
inline or via `withPage`), (b) actuates (`page.click`/`dispatchEvent`/`mouse`/
`keyboard`/`dragAndDrop`/`PointerEvent`/`hover`), and (c) is in the correctness
tier (`proof-gate-is-runtime.mjs:178–237`).

This is the **mechanized form of the user's standing warning** — "green
source-shape gates miss appearance/interaction/state" (CLAUDE.md memory,
gate-blindspot lesson). And it caught REAL bugs that jsdom/grep structurally
cannot:

- **The over-removal blank-out** (`docs/tranches/I/audit/rootcause-rc-gate-blindspot.md:164`):
  a source-shape gate "green-lit the over-removal AND **missed the runtime
  blank-out**" — a gate passed on source text while the running product rendered
  blank. Only a browser-over-dist oracle catches this.
- **ROOT-A, the H census** (`docs/tranches/H/audit/a-gate-blindspots.md:21,82`):
  "Every gate is either a STATIC GREP or a NARROW RUNTIME ASSERTION. There is
  ZERO pixel/visual-regression baseline" → misses D1/D3/D4/D6/D7/D10
  (appearance/layout regressions). The W11 contrast regression and the
  subject-write seam (CLAUDE.md memory: jsdom misses real render/interaction
  bugs; `proof:subject-animates` PASS line in `/tmp/proof-all-L-final.log` shows
  it guards the engine WRITE to the real built-dist subject, not a synthetic
  `<div>`) are the same class.

So: **jsdom and grep demonstrably green-lit broken running products; the
browser-over-built-dist precept is the correct answer.** Keep the principle. The
18 correctness gates being all-browser is intentional and defensible.

### The implementation IS contrived — separate it cleanly.

The precept says "open a real browser over the built dist and actuate." It does
**NOT** say "spawn a fresh chromium + a fresh http server in a fresh node
process per gate, tear it all down, and chain them with `&&`." But that is
exactly what the implementation does:

- **One-per-process chromium + server.** `withPage`/`withBrowser`
  (`demo-driver.mjs:432–548`) launch a fresh chromium (line 463) and a fresh
  `serveDist` (line 532) and **tear both down in `finally`** (lines 539–544).
  There is **no shared browser, no `connectOverCDP`, no `wsEndpoint`, no
  `launchServer` reuse** (doc A §4 verified the absence). Because each gate is a
  separate `npm run`, there isn't even module state to share. Doc A §4 counts
  **~80+ chromium launches + ~80+ server bind/teardown cycles per `proof:all`**.
- **The cost is not the launch (~210ms fixed, doc A §2) — it's the lost
  amortization.** Every gate cold-boots the SPA, re-hydrates Vue, re-runs the
  scene machine, re-pays first paint, then sleeps through `waitForTimeout` settle
  windows (**264 `waitForTimeout` calls across the gate scripts**;
  `proof:live-session` alone has **40**) × an 8-scene sweep × 69 browser gates.
  This is the 92–96%-of-wall-clock doc A §2 measured. **The minutes are sleeping
  for animations to settle, re-paid from cold on every gate.**
- **The precept does not require any of that.** A shared warm browser + a single
  served dist (one `globalSetup`) lets each correctness gate be a cheap
  `page.goto` + actuate against an already-booted page. The precept's
  requirements — real browser, built dist, actuation, zero budget — are ALL
  preserved by `@vitest/browser` with a shared provider + a one-time dist server
  fixture (Q1). The meta-gate's *assertion* ("the gate references
  `page.click`/etc. and runs in the correctness tier") is unchanged; only the
  *plumbing under it* changes from hand-rolled-per-process to runner-owned-shared.

**The clean separation:**

| | Principle (KEEP) | Implementation (CONTRIVED) |
|---|---|---|
| **What** | Correctness oracle = real browser over the **built dist**, **actuated**, zero budget | Fresh chromium + fresh `node:http` server **per gate per process**, torn down each time, chained `&&` |
| **Why** | jsdom/grep green-lit a runtime blank-out (`rootcause-rc-gate-blindspot.md:164`) + ROOT-A appearance misses | No shared warm browser (`demo-driver.mjs` has no `connectOverCDP`); 80+ cold boots; 264 `waitForTimeout` sleeps re-paid per gate |
| **Cure** | unchanged — the meta-gate's source-shape assertion survives verbatim | `@vitest/browser` shared provider + one `globalSetup` dist server; gates become `goto`+actuate tests, parallel, warm |

The meta-gate `proof:gate-is-runtime` itself is honest about being hygiene-tier
(`proof-gate-is-runtime.mjs:266–283`: "it reads gate SCRIPTS … structural
enforcement, like eslint"). That self-awareness is correct — and it underscores
the point: **the precept is a policy; the policy can be enforced over a shared
vitest-browser tier exactly as well as over 69 hand-rolled processes.** The
processes are the contrivance; the policy is not.

**Verdict Q4:** Principle sound (cite: the runtime blank-out a source-shape gate
missed, `rootcause-rc-gate-blindspot.md:164`; ROOT-A appearance misses,
`a-gate-blindspots.md:21,82`). Implementation contrived: per-gate
per-process cold chromium+server with no warm reuse, sleeping through 264
`waitForTimeout` settles re-paid from cold. The cure is a **shared
vitest-browser tier** that preserves every precept requirement while amortizing
the boot the implementation throws away on every gate.

---

## Synthesis — the contrivance, ranked

1. **The serial `&&` chain (Q3) — THE direct cause of "3 hours," and nothing
   blocks fixing it.** Ports are `listen(0)`, posture is stateless, dist is
   read-only. CI already shards. Replacing `&&` with a parallel
   report-all runner is the highest-payoff, lowest-risk change. **(Biggest win.)**
2. **Two test runners (Q1) — the root contrivance.** 69 browser gates hand-roll
   launch/retry/fixtures/reporting/discovery that vitest 4.1.8's browser mode
   provides natively. The only genuinely-bespoke need — drive the *built dist*,
   not source — is satisfiable inside vitest-browser via `page.goto`. Migrating
   collapses two infrastructures into one and gets parallelism (Q3) for free.
3. **The per-gate cold browser+server (Q4 impl) — the wall-clock core.** No warm
   reuse, 80+ cold boots, 264 `waitForTimeout` sleeps re-paid per gate. Cured by
   a shared provider + one dist-server fixture (a subset of the Q1 migration).
4. **33–36 lint-class gates as separate processes (Q2) — the cheapest
   superfluity.** `max-lines`, import-edge, no-dup, brittle-selector are ESLint's
   home turf. One `eslint .` + one dependency-cruiser graph + one vitest meta-unit
   replaces ~25% of the suite's process count. Cheap tier, but lowest wall-clock
   payoff (these gates are already sub-second).

**What to KEEP, unambiguously:**

- The `proof:gate-is-runtime` PRECEPT (real-browser-over-built-dist, actuated,
  zero budget) — it caught real runtime bugs jsdom missed.
- The observe-only / device-honesty taxonomy (`ci-env.mjs` + `gate-taxonomy.md`)
  — a principled CI-vs-on-device policy axis, orthogonal to the runner.
- The `boundary` graph analysis as a project-specific invariant (but fed by a
  parsed-once graph, not a re-parse).

The owner's frustration is well-founded and the cost is **architectural, not
inherent**: the gates' *intent* is sound; the apparatus pays for re-implementing
a test runner, running it serially, and cold-booting a browser per gate — three
removable contrivances, none of which the underlying principles require.

---

### Evidence index (reproducible, read-only)

- Two runners / hand-rolled stack: `demo-driver.mjs` — `withBrowser` 432–496
  (launch + retry), `withPage` 513–548 (serve+ctx+page+teardown), `serveDist`
  `listen(0)` at 340; reporter boilerplate `proof-live-session.mjs:91–96`,
  `proof-gate-is-runtime.mjs:66–72`. Counts: 128 gate scripts, 67 import
  demo-driver, 2 self-chromium (`grep -l/-L` over `scripts/proof-*.mjs`).
- vitest version: `node_modules/vitest/package.json` → 4.1.8 (browser mode
  available).
- Lint-class count: 33 source-shape (no browser, no vitest) via
  `grep -L demo-driver|chromium|playwright` minus vitest-shelling scripts.
  File-size ceiling: `proof-demo-no-oversize.mjs:76–80`; library ceiling:
  `proof-decomposition.mjs` clause-1; import-edge: `proof-boundary.mjs` (405L).
- Serial chain: `proof:hygiene` = 124 `&&`, 0 `;`, 0 `||`; no parallel runner in
  package.json; the full chain string reproduced in `/tmp/hygiene-run4.log`
  (~133 gates → `vitest run`).
- Parallelism blockers (none real): port `listen(0)` `demo-driver.mjs:340`;
  `declarePosture` stateless factory `ci-env.mjs:85–120`; dist read-only check
  `demo-driver.mjs:524`.
- Precept real-bug justification: runtime blank-out a source-shape gate missed,
  `docs/tranches/I/audit/rootcause-rc-gate-blindspot.md:164`; ROOT-A appearance
  misses, `docs/tranches/H/audit/a-gate-blindspots.md:21,82`;
  `proof:subject-animates` guards real built-dist write (PASS line,
  `/tmp/proof-all-L-final.log`).
- Sleep tax: 264 `waitForTimeout` across `scripts/proof-*.mjs`;
  `proof:live-session.mjs` = 40. Per-gate cold boot, no warm reuse: no
  `connectOverCDP`/`wsEndpoint`/`launchServer` in demo-driver (doc A §4).
- Timing: doc A §2 (sampled wall-clock), `/tmp/proof-all-L-final*.log` +
  `/tmp/hygiene-run4.log` (Duration lines).
