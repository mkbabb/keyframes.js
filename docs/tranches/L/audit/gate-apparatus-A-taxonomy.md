# Gate-apparatus audit A — taxonomy + timing (the "why 3 hours" measurement)

**Status:** ANALYSIS ONLY. No gate changed, no code written, no `proof:all` re-run.
All numbers below are either extracted from package.json / the gate scripts, or
sample-timed on this workstation (darwin, dist warm) on 2026-06-17. The brief:
the owner drove the `proof:*` + test apparatus to green and it cost ~3 HOURS.
This doc measures the apparatus and names where the cost — and the contrivance —
actually lives.

The headline, stated plainly up front:

> **The principle is sound. The implementation is the problem.** The cost is
> NOT in the gate *count* (~146 leaf gates is a lot, but most are sub-second).
> It is concentrated in **72 browser-gate invocations that run a per-scene
> sweep with hand-tuned `waitForTimeout` settle windows**, chained **purely
> serially with `&&`** so that the iterate-to-green loop pays **O(N²)** in
> re-runs. The 3 hours is N≈5–6 reds × a ~30-minute full-chain re-run. The
> durable cure is *already named in the team's own CI YAML* (ci.yml:316–335)
> and not yet built: one shared chromium + server, and migrate static-shape
> gates out of the browser tier.

---

## 1. Enumeration + classification

`package.json` defines **150** `proof:*` keys. Four are aggregators
(`proof:correctness`, `proof:hygiene`, `proof:all`, `proof:all:demo`), leaving
**146 leaf gates**. `proof:all` = `proof:correctness && proof:hygiene` runs
**142 distinct leaf gates** plus a trailing full `vitest run` (the remaining
4 leaf gates — `proof:peer-satisfied`, `proof:keyframes-vue-published`,
`proof:control-point-live`, `proof:agent-surface`'s demo arm, etc. — are wired
into CI jobs or `proof:all:demo`, not the main chain).

### Classification method

- **(c) BROWSER/PLAYWRIGHT** — the gate script imports `scripts/lib/demo-driver.mjs`
  and calls `withPage`/`withBrowser` (→ `chromium.launch()` + `serveDist()` +
  `newContext()` + drive the built `dist/gh-pages/`). 64 scripts call
  `withPage`/`withBrowser` directly; plus `proof:easing-sidebar-minimal` and
  `proof:easing-sidebar-normalized` launch their OWN chromium via
  `createRequire`/`http` (NOT demo-driver) and degrade to static when playwright
  is absent.
- **(a) SOURCE-SHAPE node grep** — `node scripts/proof-*.mjs`, no browser, no
  vitest. Reads source/dist files and asserts shape (e.g. `proof:boundary`,
  `proof:decomposition`, `proof:no-dup-utility`, `proof:gate-is-runtime` —
  *note: gate-is-runtime is itself a source-shape meta-gate that READS the other
  gates' scripts; it does not open a browser*).
- **(b) NODE + VITEST** — `node scripts/proof-x.mjs && vitest run test/x.test.ts`
  (a shape grep chained to a real jsdom test).
- **(b′) PURE-VITEST** — `vitest run test/x.test.ts` only.
- **(d) OBSERVE-ONLY** — declares `declarePosture("observe-only", …)` via
  `scripts/lib/ci-env.mjs`; RECORDED (never red) in CI, hard on-device. This is
  an orthogonal posture axis, not a runner class — every observe-only gate is
  ALSO one of the classes above (7 of the 8 are browser gates).

### Counts (within `proof:all`'s 142 leaf gates)

| Class | Count | Share | Examples |
|---|---:|---:|---|
| **(c) BROWSER/PLAYWRIGHT** | **72** | **51%** | live-session, drag-gesture, layout-cluster, visual-lock, taste-packet, every `proof:*-card-rounded`/`stage-*`/`bezier-*`/`hero-*` layout gate |
| **(a) SOURCE-SHAPE node grep** | **36** | 25% | boundary, decomposition, no-dup-utility, single-writer, idioms, gate-is-runtime, chronic-closure |
| **(b) NODE + VITEST** | **18** | 13% | blend, motion-path, replay-equality, composition-honored, drawsvg, ingest-replay |
| **(b′) PURE-VITEST** | **16** | 11% | zero-alloc, engine-correctness, sync-step, event-ordering, cohesion |
| trailing full `vitest run` | 1 | — | ~890 tests / 89 files |

**(d) OBSERVE-ONLY** (cross-cutting, 8 gates): `proof:perf-frame-budget`,
`proof:scene-transition-perf`, `proof:visual-lock`, `proof:lighthouse-mobile`,
`proof:drawer-spring`, `proof:live-session-mobile` (M2 clause),
`proof:bench-taxonomy`, `proof:ci-coverage` — manifest in
`docs/tranches/J/gate-taxonomy.md`.

Split across the two tiers:
- **`proof:correctness`** — 18 leaf gates, **ALL 18 BROWSER** (by design: the
  `proof:gate-is-runtime` meta-gate *forces* every correctness member to actuate
  the running product through a real browser — see §Fairness).
- **`proof:hygiene`** — 124 leaf gates: **54 browser**, 36 source-shape, 18
  node+vitest, 16 pure-vitest, + the trailing full `vitest run`.

So **72 of 142 gates (51%) spawn a browser** — and as §2 shows, they consume
**~92–96%** of the wall-clock.

---

## 2. Timing (sampled real wall-clock, dist warm)

The existing logs (`/tmp/proof-all-L-final*.log`, `/tmp/hygiene-run4.log`) carry
vitest `Duration` lines (the `vitest run` slices: 0.4–1.2s each) but were NOT
run with per-gate wall-clock timestamps, so per-gate timing was **sample-timed**
here (`time npm run proof:<x>`, ~9 gates only — the suite was NOT re-run):

| Gate | Class | Real wall-clock |
|---|---|---:|
| `proof:no-dup-utility` | source-shape | **0.16s** |
| `proof:single-writer` | source-shape | **0.17s** |
| `proof:decomposition` | source-shape | **0.25s** |
| `proof:boundary` | source-shape (graph analysis) | **0.69s** |
| `proof:blend` | node+vitest | **0.76s** |
| `proof:zero-alloc` | pure-vitest (3 files) | **1.02s** |
| `proof:dock-popover-opens` | **browser** (1 scene) | **1.98s** |
| `proof:single-toggle` | **browser** (1 scene) | **2.76s** |
| `proof:layout-cluster` | **browser** (multi-scene) | **11.29s** |
| `proof:drag-gesture` | **browser** (multi-surface drag) | **27.18s** |
| `proof:live-session` | **browser** (full scene sweep) | **80.85s** |

**The browser class spans 1.98s → 80.85s — a 40× spread.** Mean ≈ **24.8s**,
median ≈ **11.3s**. Source-shape gates mean **0.32s**; vitest gates **0.8–1.0s**.

### proof:all wall-clock estimate (single clean pass)

| Bucket | Count | Per-gate | Subtotal |
|---|---:|---:|---:|
| Browser (median-weighted) | 72 | 11.3s | **13.5 min** |
| Browser (mean-weighted) | 72 | 24.8s | **29.8 min** |
| Source-shape | 36 | 0.32s | 11.4s |
| node+vitest | 18 | 0.76s | 13.7s |
| pure-vitest | 16 | 1.02s | 16.3s |
| trailing full `vitest run` | 1 | ~25s | ~25s |

> **TOTAL `proof:all`: ~15–31 minutes single-pass** (median- vs mean-weighted).
> **Browser share: 92% (median) – 96% (mean).** The non-browser 70 gates +
> full vitest = **~70 seconds combined** — i.e. essentially free.

This independently agrees with the team's OWN measurement embedded in
`ci.yml:316–335`, which records `cold-entry 41s · font-census 41s ·
layout-cluster 24s · spring-slider-continuous 19s · taste-packet 42s` and
projects the demo-smoke browser job at **~42–50 minutes** — and notes shared GHA
runners are "~1.5–3× slower than dedicated hardware on browser work."

### Slowest gates (the long tail to attack first)

`live-session` (81s), `cold-entry` (41s, per ci.yml), `font-census` (41s),
`taste-packet` (42s), `drag-gesture` (27s), `layout-cluster` (24s),
`spring-slider-continuous` (19s). **A handful of full-scene-sweep gates carry
the bulk of the minutes.**

### Cost breakdown PER browser gate — the load-bearing finding

A direct probe of `withPage` lifecycle (launch chromium + serveDist + newContext
+ newPage + first `domcontentloaded` nav, NO assertions):

```
launch + serve + ctx + page = 209 ms
first nav (domcontentloaded)  =  31 ms
total withPage lifecycle      = 257 ms
```

> **The fixed chromium-spawn + dist-serve tax is only ~210 ms.** It is NOT the
> bottleneck. The 2s → 81s a gate actually costs is **DRIVE + ASSERT**: each
> heavy gate loops over the lib's `SCENES` export (home/cube/amiga/square/easing/
> spring/sequence/motion-path), `navToScene`s each, and waits on **hand-tuned
> `waitForTimeout` settle windows** — `proof:live-session` alone issues
> `waitForTimeout(200/350/700/900/1500…)` plus rAF-sampling loops and
> `waitForRender` predicates with timeouts up to 8000ms. The minutes are
> *sleeping for animations to settle*, multiplied by 8 scenes, multiplied by 72
> gates. **This is the contrivance core: the cost is per-scene `sleep`, not
> compute.**

---

## 3. The serial-chain tax — the O(N²) that makes it 3 hours

`proof:all`, `proof:correctness`, and `proof:hygiene` are **pure serial `&&`
chains** (verified: `proof:hygiene` has 124 `&&`, zero `;`, zero `||`; no
`concurrently`/`npm-run-all`/`run-p`/`xargs -P` anywhere in package.json). Each
leaf is its OWN `npm run` subprocess (≈0.18s npm fork tax × 142 = ~25s of pure
process-spawn overhead alone, before any gate does work).

`&&` **aborts on the first non-zero exit.** Consequence for iterate-to-green:

- A red at gate *k* runs gates `1…k`, dies, and tells you about ONE failure.
- You fix it, re-run `proof:all` — which **re-runs `1…k` from scratch** (the
  142 prior greens are not cached or skipped) before reaching `k+1`.
- With reds distributed through the chain, the re-run cost is the **sum of
  prefixes** → **O(N²)** in chain length, and since the chain is browser-heavy,
  each prefix re-run is ~15–30 min.

**The 3-hour witness, reconciled:**

| N reds | Re-run cost (each ≈ a ~30-min full prefix) |
|---:|---|
| 3 | ~1.5 h |
| **5–6** | **~2.5–3 h ← the owner's measured 3 hours** |
| 8 | ~4 h |

5–6 reds discovered one-at-a-time, each forcing a full or near-full chain
re-run because a late-chain browser gate failed, **is exactly 3 hours.** The
math is not mysterious; it is the serial `&&` chain meeting browser-tier
per-gate minutes.

**Two compounding contrivances inside the serial chain:**
1. **No fail-fast batching / no `--continue`-style report-all.** You learn about
   reds one per full re-run instead of all at once.
2. **No caching/skip of already-green gates.** Every re-run pays for the 70
   greens before the red, including the slow browser greens.

---

## 4. Shared browser/server? — NO. One-per-gate, one-per-process.

Read of `scripts/lib/demo-driver.mjs`:

- `withPage(opts, fn)` (line 513) calls `withBrowser` (line 432) which does a
  fresh **`chromium.launch()`** (line 463), then inside opens a fresh
  **`serveDist()`** http server (line 532), a fresh `newContext()` (534) +
  `newPage()` (537), and **tears EVERYTHING down in the `finally`** (539–544):
  context closed, server closed, browser closed.
- There is **no persistent browser, no shared server, no `connectOverCDP`, no
  `wsEndpoint` reuse, no cross-process handle** (grep for
  `connectOverCDP|wsEndpoint|launchServer|reuseExisting` → none). `resolveChromium()`
  (275) just `require`s playwright-core per call.
- Because **each `proof:<x>` is a separate `npm run` → separate node process**,
  there is not even module-level state to share. Every gate process spawns its
  own chromium and its own http server from zero.

**Count:** **72 browser gate-invocations** each spawn ≥1 chromium + ≥1 server.
Several gates launch chromium **multiple times within one process**:
`proof:live-session-mobile` (4×), `proof:subject-animates`, `proof:live-session`,
`proof:lighthouse-mobile`, `proof:fsm-suspend-resume-live`, `proof:font-census`,
`proof:appearance-suffusion` (2× each) — so the chain performs **~80+ chromium
launches** and **~80+ server bind/teardown cycles** total in one `proof:all`.

**The cost of NOT sharing:** at ~210ms fixed launch+serve per cycle, the raw
spawn waste is ~80 × 0.21s ≈ **17 seconds** — *small*. The real cost of
one-per-process is the **lost opportunity to amortize app-boot + warm-cache
across gates**: every gate cold-boots the SPA, re-hydrates Vue, re-runs the
scene machine from scratch, and re-pays first-paint before it can assert. A
shared warm browser + server (the cure ci.yml:331 already names) would let many
small layout/appearance gates run as cheap `goto`+assert against an
already-booted page instead of each paying a full cold sweep.

---

## Verdict — principle vs implementation (candid)

**Sound in principle (keep):**
- The **`proof:gate-is-runtime` precept** — a correctness gate must actuate the
  running product through the real surface with a zero error budget — is the
  *right* answer to "green source-shape gates miss appearance/interaction/state"
  (the recorded gate-blindspot lesson). The 18 correctness gates being all-browser
  is intentional and defensible.
- The **observe-only / device-honesty taxonomy** (gate-taxonomy.md) is principled:
  it honestly separates device-dependent measurement from hard oracles.

**Contrivance / superfluity (the implementation, where the hours live):**
1. **51% of gates are browser, 92–96% of the time is browser, and the browser
   time is mostly `waitForTimeout` sleeps × an 8-scene sweep.** Many browser
   gates assert a *static layout/shape* property (`proof:scene-card-rounded`,
   `proof:card-rounded-primitive`, `proof:stage-glass-card`, `proof:label-subgrid`,
   `proof:single-column-pack`, the `bezier-*`/`hero-*` family) that does NOT need
   a full cold-boot scene sweep — these are the F-7 "static-gate migration out of
   demo-smoke" candidates ci.yml:333 already flagged. **Demoting the static-shape
   browser gates to cheap goto+assert (or jsdom/source-shape where the property is
   truly static) is the single biggest win.**
2. **Pure serial `&&` with no parallelism, no fail-fast report-all, no
   green-skip caching** turns the iterate-to-green loop into O(N²). This is the
   direct cause of "3 hours." **CI already shards the browser gates into a
   parallel matrix** (the `KF_REQUIRE_BROWSER` demo-smoke job) — so the local
   `proof:all` serial chain is the *only* place this tax is paid. The local
   developer experience is strictly worse than CI's.
3. **One-per-process chromium + server**: no warm-browser reuse. The cure is
   named (ci.yml:331, "one shared chromium+server, withBrowser reuse") and
   **unbuilt**.
4. **~146 leaf gates** is a large surface with heavy naming ceremony; many
   layout gates are near-duplicates differing only in selector
   (`stage-not-clipped` / `stage-glass-card` / `stage-within-docks` /
   `card-rounded-primitive` / `scene-card-rounded`…). Consolidation is possible
   but is the *smallest* lever — the count is not the cost; the browser sweep is.

## Recommendation (next-doc handoff — NOT implemented here)

In priority order by measured payoff:

1. **Parallelize + report-all locally.** Replace the serial `&&` chain with a
   concurrent runner that runs all gates, collects ALL reds, and reports them
   once. Kills the O(N²) iterate loop outright. (Biggest DX win, lowest risk.)
2. **Migrate static-shape gates off the browser sweep.** Audit the ~30 layout/
   appearance browser gates; the ones asserting a static CSS/DOM-shape property
   become source-shape or single-`goto` checks. Targets the 51% → drops the
   browser count and the per-gate sweep cost. (F-7, already flagged.)
3. **Shared warm browser + server** across gates in one run (withBrowser reuse /
   a `connectOverCDP` pool). Amortizes app-boot. (ci.yml:331, already named.)
4. **Tighten the `waitForTimeout` settle windows / inject a synthetic clock** so
   the heavy live-session-class gates stop *sleeping* for real animation time —
   the same fix gate-taxonomy.md already prescribes as the "architectural cure"
   for the observe-only perf gates. (Attacks the 81s tail.)
5. **Consolidate near-duplicate layout gates** last — cosmetic, low payoff.

---

### Evidence index (every claim is reproducible)

- Counts: `node -e` over `package.json scripts` (150 keys, 146 leaf, 142 in
  proof:all; 72 browser / 36 source-shape / 18 node+vitest / 16 pure-vitest).
- Class membership: `grep -l demo-driver scripts/*.mjs` (64) + the 2 self-chromium
  easing-sidebar gates.
- Timings: `time npm run proof:<x>` (9 gates, table §2).
- Fixed browser tax 210ms: `/tmp/probe-overhead.mjs` via `withPage`.
- Serial chain: `proof:hygiene` = 124 `&&`, 0 `;`, 0 `||`; no parallel runner in
  package.json.
- No shared browser: `demo-driver.mjs:432–548` (`withBrowser`/`withPage` launch +
  teardown in finally); no `connectOverCDP`/`wsEndpoint`/`launchServer`.
- Independent corroboration: `ci.yml:316–335` (team's own per-gate wall-clocks,
  ~42–50m projection, and the named-but-unbuilt cure).
