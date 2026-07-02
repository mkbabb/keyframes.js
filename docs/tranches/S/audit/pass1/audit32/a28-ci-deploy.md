# Lane a28 — CI + Deploy Pipeline Truth (Tranche R deep audit)

**Scope:** `.github/workflows/{ci.yml,release.yml,deploy-pages.yml}` + the proof-script
substrate they invoke. Judge SPEC vs SHIPPED vs GESTALT for the CI/deploy plane across the
R impl range `a15cd48..18e8617`. Read-only; every claim is `file:line` / SHA cited.

---

## Executive summary

**R did essentially nothing to the CI/deploy plane, and that is the honest verdict — but it
inherited a plane with three real coherence defects and one live invariant-violation that
Tranche S must own.**

R's *entire* CI footprint is five commits (`git log a15cd48..18e8617 -- .github/workflows/`):
each is a **purely-additive static gate** wired into the fast `gates` job
(`proof:no-flat-siblings` b52ad3e, `proof:in-is-importable` 437d7e0,
`proof:readme-paths-live` b735345, `proof:scene-colocated` 39b9e25) plus the
**keyframes-vue tripwire deletion** (23a6867, −27 lines). This is *idiomatic* — R's new gates
correctly ride the device-independent 10m library job, never the 50m browser job, honoring the
F-7 static-gate-placement discipline (ci.yml:344–360). **No cosmetic churn, no gate theater.**

But the three device-dependence reds the lane names are **not R's work and were not cured by
R** — LoAF calibration dates to Tranche C (`9154dfd`, 2026-06-04), the 50m demo-smoke ceiling
to Tranche K (`138be67`, 2026-06-16). R's own FINAL.md (§5, lines 108–135) **re-observes all
four as "documented CI device-dependence class" and defers them** to "the proper runner." That
is honest labeling, but it converts a chronic into a *permanent* carry: the same four env-class
misses have been re-declared every tranche since C with no structural cure.

The load-bearing finding is **F1**: a **glass-ui-OWNED** frame-drop clause
(`proof:perf-frame-budget`, self-described HANDOFF) is tagged `[CORRECTNESS]` and sits in
demo-smoke's **hard-blocking** `failed` set (ci.yml:628, 1740) — so a downstream-dep perf red
hard-reds the deploy-of-record gate, which is *precisely* the mechanism that forces the
`workflow_dispatch` deploy bypass (**F2**) the owner used to ship R. The "verified-deploy-of-
record" invariant (inv-28, deploy-pages.yml:10) is therefore **routinely circumvented**, and
the bypass deploys `github.sha` regardless of that SHA's CI colour (deploy-pages.yml:52).

---

## Findings

### F1 — [HIGH] A glass-ui-owned HANDOFF clause hard-blocks the deploy-of-record

`proof:perf-frame-budget` is tagged **`[CORRECTNESS]`**, runs `KF_REQUIRE_BROWSER: "1"` (hard),
and its `id` is enrolled in the demo-smoke **blocking** `failed` set:

- ci.yml:628–633 — the step, `[CORRECTNESS]`, `continue-on-error: true` + `KF_REQUIRE_BROWSER=1`
- ci.yml:1740 — `proof-perf-frame-budget` added to `$failed` → job exits 1

Yet the gate's own header declares the failing clause **not kf-owned**:
`scripts/proof-perf-frame-budget.mjs:8–17` — "the dock … width-morph is **GLASS-UI-OWNED** (kf
pins `~3.9.0`) … the gate names this a glass-ui **HANDOFF** flag". Clause (c) dock-expand is a
"born-RED witness: HEAD 12/114" and clause (d) is throttle-sensitive
(`proof-perf-frame-budget.mjs:22–24`). R's FINAL DM-12 (FINAL.md:124) confirms it dropped
`5 > 3` locally and calls it a GLASS-UI HANDOFF, "NOT a kf override."

**The incoherence:** a not-kf-owned, CPU-throttle-sensitive perf clause is a **hard blocking
correctness gate**, whereas comparably device-sensitive gates are declared observe-only — e.g.
`proof:lighthouse-mobile` is `[HYGIENE · observe-only-in-CI]` (ci.yml:984), misses RECORDED not
blocking. A glass-ui red therefore reds demo-smoke → reds the CI workflow →
`deploy-pages.yml`'s `workflow_run.conclusion == 'success'` gate never fires → the live site
can only ship via the manual `workflow_dispatch` bypass (F2).

**Proposal (S):** reclassify the dock clause of `proof:perf-frame-budget` to the *same
declarePosture observe-only-in-CI tier as `proof:lighthouse-mobile`* until glass-ui root-fixes
the width-morph (the standing dock-flicker / dock-doubleclick / width-morph handoff in MEMORY).
Keep the kf-owned `/easing`-preview clause (d) hard — that one *is* kf's reactive-render-storm
(D4). Split the gate into `proof:perf-frame-budget` (kf-owned, blocking) +
`proof:dock-perf-glassui` (handoff, observe-only, RECORDED). This unblocks the green-CI deploy
gate the moment kf's own clause is green.

---

### F2 — [HIGH] `workflow_dispatch` fully circumvents the "verified-deploy-of-record" invariant

`deploy-pages.yml` bills itself "GREEN-CI-GATED (the constellation inv-28,
verified-deploy-of-record)" (deploy-pages.yml:10). But the job `if` is a **disjunction**:

```
if: github.event_name == 'workflow_dispatch' ||
    (workflow_run.conclusion == 'success' && head_branch == 'master' && event == 'push')
```
(deploy-pages.yml:42–46)

A manual dispatch satisfies the *first* disjunct with **zero CI-colour check**, and the checkout
resolves `github.event.workflow_run.head_sha || github.sha` → on dispatch there is no
`workflow_run`, so it deploys **`github.sha` = master tip regardless of whether that SHA's CI is
green** (deploy-pages.yml:52). Per MEMORY (`project_tranche_r_impl_drive_shipped`): R was
deployed via "`gh workflow run deploy-pages.yml` workflow_dispatch (**bypasses the flaky Linux
demo-gate**)." So the actual R ship **did not satisfy** the invariant the workflow's own header
claims to enforce.

This is a *smell*, not a crime — a break-glass manual deploy is legitimate — but the current
shape makes the bypass the **normal** path (because F1 keeps the gate flaky-red), and the header
comment over-claims a guarantee the pipeline does not provide.

**Proposal (S):** two moves. (a) Fix F1 so the green-CI path actually fires and the dispatch
returns to break-glass-only. (b) Make the demo gate **non-blocking-but-reported for deploy**:
split demo-smoke into a hard `demo-correctness` job (kf-owned product clauses — gate the deploy
on THIS) and a `demo-device-observe` job (LoAF/dock/lighthouse/render-race, observe-only, never
gates deploy). Then `deploy-pages` gates on `demo-correctness` success and the manual dispatch
stops being load-bearing. Re-word the deploy-pages.yml:10 header to state the *real* contract.

---

### F3 — [MEDIUM] LoAF gate: runner-speed artifact, correctly mitigated, but by a hand-tuned magic constant

**Verdict: runner-speed artifact, well-handled — NOT a real perf regression, NOT glass-ui.**
The 50ms threshold is an absolute real-user Web-Vitals standard and is **kept strict**
(`bench/playwright.bench.ts:52` `LOAF_THRESHOLD_MS = 50`, unchanged). The device-dependence is
neutralized by **sizing the workload**, not relaxing the bar: CI runs a 48-cell composite
(ci.yml:1699 `KF_LOAF_COUNT: "48"`) whose loop worst-frame is ~30ms on the ~6×-slow shared VM,
while the local/dedicated authority runs the full 200-cell yield-stress
(`bench/playwright.bench.ts:59` default `?? 200`). The 120ms inject-block still reddens
(`KF_LOAF_INJECT_BLOCK`). ci.yml:1683–1694 documents the reasoning honestly.

**The residual weakness:** `48` is a **hand-calibrated magic number** with no self-tracking. When
GitHub's runner hardware changes (they do), 48 silently drifts — either the loop starts blocking
>50ms (false red) or the composite shrinks below the YIELD_BATCH=32 boundary's stress value
(false green). There is already a *device-independent ratio* idiom in-repo (`proof:portable-perf`
"same-report ratio gate," ci.yml:411–412) that the LoAF gate does not use.

**Proposal (S):** replace the fixed `KF_LOAF_COUNT` with a **warmup-calibrated** count: measure
per-cell cost in a short warmup pass, size the composite to a target ~30ms worst-frame, so the
stress auto-tracks runner speed. Alternatively fold the LoAF assertion into the
`proof:portable-perf` ratio idiom (block on a same-report ratio, not an absolute count). Either
kills the magic constant.

---

### F4 — [MEDIUM] Render-race cure (settle-on-state) is real but only partially applied

**Verdict: mostly runner-speed on the slow quiet host; the correct cure exists but is scoped to
one function.** L.W4 introduced `waitForRender` — the settle-on-state primitive that returns the
instant a predicate holds and treats `timeout` as a *ceiling* (demo-driver.mjs:757–784), so a
transposed caller is load-independent by construction. This is the *right* pattern and it is
what makes the 30s-timeout misses (FINAL.md:123 DM-11b `proof:subject-animates`) genuinely
env-class rather than source regressions.

**But the ban is not global.** `proof:settle-is-predicate` enforces "ZERO `waitForTimeout(...)`"
**only over `openControlsPanel`** (`scripts/proof-settle-is-predicate.mjs:23,81–93`). Meanwhile
fixed sleeps survive elsewhere in the same driver surface — e.g. `expandDock` /`dockSwitch`
carry `page.waitForTimeout(200)` and `waitForTimeout(350)`
(`scripts/proof-live-session.mjs:275,285`). Several gates also call `waitForFunction` with **no
explicit timeout** → Playwright's 30s default (`scripts/proof-dock-zorder.mjs`,
`proof-hero-cls.mjs`, `proof-stage-within-docks.mjs`, et al. in the "default 30s" grep). Each is
a 30s stall-then-red on a slow runner and a contributor to the F5 wall-clock pressure.

**Proposal (S):** widen `proof:settle-is-predicate` from `openControlsPanel` to **all of
`scripts/` driver code** (grep-gate: zero numeric-literal `waitForTimeout` in any `proof-*.mjs`
/ `demo-driver.mjs`), and require an explicit `{ timeout }` ceiling on every `waitForFunction`
(no reliance on the 30s default). That finishes the L.W4 migration the repo started.

---

### F5 — [MEDIUM] demo-smoke is one slow runner from a timeout-flake red; the durable cure is deferred

The demo-smoke `timeout-minutes: 50` is a **measured recalibration bounding a ~48–51m
worst-case projection with a "thin margin"** (ci.yml:485–508, verbatim). The job invokes
**117** `KF_REQUIRE_BROWSER` browser gates (`sed 484,1700 | grep -c KF_REQUIRE_BROWSER`), and
each proof script independently `withBrowser → chromium.launch` + `serveDist` — i.e. **~50+
separate chromium launches and static-server spins per run** (`scripts/lib/demo-driver.mjs:495,
526, 593`). A razor-thin margin against 50m means a single slow runner tips the job into a
**wall-clock timeout red** — which is itself a device-dependence flake and another trigger for
the F2 manual-deploy bypass. The *durable* cure — "one shared chromium+server, `withBrowser`
reuse" — was explicitly **deferred** (ci.yml:504–508, "F-2 §Hand-off → W6-infra"). It never
landed; R did not pick it up.

**Proposal (S):** land the deferred W6-infra harness net-deletion — a single shared
chromium + one served dist reused across all demo gates (a `globalSetup`-mounted browser/server,
gates take a `page` from a pool). This is the single highest-leverage CI move available: it
collapses the ~50m job toward the sum of *drive* time (not launch time), removes the timeout-
flake class, and makes the 50m ceiling comfortable rather than binding.

---

### F6 — [LOW] Stale "committed source-shape reds" comment — two of the three gates are now green

ci.yml:356–359 carves `proof:decomposition` / `proof:demo-no-oversize` / `proof:brittleness`
out of the F-7 static-migration because they "carry committed source-shape reds … until a
source-fix wave greens them." On the shipped R tree **that is stale for two of the three**:
`npm run proof:decomposition` → **exit 0** (FINAL.md:144–147 confirms; `engine/animation.ts`
499L, `group/group.ts` 496L post-R.W2 carves), and `npm run proof:demo-no-oversize` → **exit 0**
(both run this session). The comment still describes them as red, and they still sit in the
demo-smoke `failed` set (ci.yml:1767–1768) / off the fast job. This is a doc-vs-truth drift R's
own decomposition work created but did not reconcile.

**Proposal (S):** now that decomposition + demo-no-oversize are green, **migrate them to the
fast library `gates` job** (they are device-independent source greps — the exact F-7 criterion)
and delete the stale carve-out comment. Leave `proof:brittleness` (a browser gate) where it is,
or re-tier it explicitly.

---

### F7 — [LOW] R closed with a mis-tiered meta-gate + broken bench; both fixed *after* R.W8 close

The three commits at master tip are **post-close R-fallout CI repairs**, not R.W8 content:
- `18e8617` — "re-tier `proof:emerging-css-resolve-now` correctness→hygiene-chain … →
  `proof:gate-is-runtime` **GREEN**" — i.e. R.W8 closed with the `proof:gate-is-runtime`
  meta-gate (ci.yml:299) **RED** (a gate mis-tiered against its siblings), fixed the next day.
- `6f2493d` / `1f7d323` — bench files still referenced R-excised symbols (`animate()` removed at
  R.W4; `KeyframesAnimation` renamed at 5.0.0), so `npm run bench` was broken at close.

This corroborates the MEMORY lesson ("independent gate re-runs caught what agents mis-reported
… the bench `engine.animate` excision") and implies **`npm run proof:all` + `npm run bench` were
not run clean before R.W8 declared close**. The FINAL.md §5 re-verification exercised the
chronics on the dist but not the meta-gate / bench roster.

**Proposal (S):** make `proof:all` **and** `bench --run` (compile-only is enough to catch symbol
drift) **mandatory close-gates** in the tranche method — a wave cannot declare close until both
exit 0 locally, not just the product chronics. Add a `proof:bench-compiles` node gate so a
rename that breaks `bench/*.bench.ts` reds a *fast* gate, not a manual `npm run bench`.

---

### F8 — [INFO] fail-fast vs report-all is coherent; the two jobs use two deliberate patterns

The `gates` job is **fail-fast** (a flat list of hard steps, only 1 `continue-on-error` in
50–483 — the born-RED `proof:peer-satisfied` tripwire), so the first red aborts and the job
reds fast. The `demo-smoke` job is **report-all** (81 `continue-on-error` steps + the terminal
`check-failures` aggregator, ci.yml:1719–1809) so every gate runs and every red annotates in one
pass — the documented cure for the "K whack-a-mole" flake-hides-correctness pathology
(ci.yml:1700–1706). The two born-RED tripwires are correctly **excluded from the blocking set
and RECORDED** (ci.yml:1727, 1801–1805). This is *sound* and needs no change. `release.yml` is
tag-triggered and **CI-independent** (its own library-scoped roster, no demo-smoke) — coherent
library/demo separation (release.yml:1–17), with the one caveat that a tag publish can ship while
ci.yml demo-smoke is red (acceptable: the library build is glass-ui-free, A inv β).

---

## Tranche-S implications

Wave-shaped, ranked by leverage:

1. **S-CI-1 (the keystone) — reshape the deploy gate so device-dependence never blocks the
   live site.** Split `demo-smoke` into `demo-correctness` (kf-owned product clauses, hard,
   gates deploy) + `demo-device-observe` (LoAF, dock-perf, lighthouse, render-race — all
   observe-only-in-CI, RECORDED, never gates deploy). Point `deploy-pages.yml`'s
   `workflow_run.success` gate at `demo-correctness`. This *dissolves* F1+F2 together: the green-
   CI deploy path fires reliably, and `workflow_dispatch` reverts to genuine break-glass. Re-word
   the deploy-pages.yml:10 "verified-deploy-of-record" header to the real contract.

2. **S-CI-2 — land the deferred W6 browser-harness net-deletion (F5).** One shared
   chromium + one served dist reused across all ~50 demo gates via `globalSetup`. Highest single
   perf lever: collapses the binding 50m ceiling, kills the timeout-flake class. This is the
   *durable* cure the pipeline has deferred since Tranche K.

3. **S-CI-3 — de-magic the device-dependence knobs (F3+F4).** Replace `KF_LOAF_COUNT=48` with a
   warmup-calibrated count (or fold into the `proof:portable-perf` ratio idiom); widen
   `proof:settle-is-predicate` to ban numeric-literal `waitForTimeout` across **all** `scripts/`
   driver code and require explicit `waitForFunction` ceilings. Turns two hand-tuned artifacts
   into self-tracking gates.

4. **S-CI-4 — reconcile the static-gate roster (F6) + harden the close-gate (F7).** Migrate the
   now-green `proof:decomposition` + `proof:demo-no-oversize` to the fast job and delete the stale
   carve-out comment; add a fast `proof:bench-compiles` gate and make `proof:all` + bench-compile
   mandatory tranche-close preconditions so a close cannot ship a mis-tiered meta-gate or a
   symbol-drifted bench again.

5. **S-CI-5 (method-level) — the "device-dependence class" must exit via a system gate, not a
   per-tranche re-declaration.** R (like C, K, L before it) re-labeled the same four env misses
   as "verifies in CI post-push" (FINAL.md:130–135). That is honest but it is a *chronic that
   never terminates*. S should either (a) drive each to a real cure (S-CI-1..3 above) or (b)
   convert each into a formally-tracked observe-only posture with a named exit condition — never
   a fourth re-observation.
