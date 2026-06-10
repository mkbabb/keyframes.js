# Tranche J audit — CI/CD pipeline

Lane: **ci-cd**. Scope: `.github/workflows/**` (ci.yml, deploy-pages.yml, release.yml),
`scripts/pages-deploy.sh`, the `proof:ci-coverage` gate.
Tree: `master` @ `4072af9` (clean save `docs/tranches/J/`). Date 2026-06-09.
Read-only; every claim carries file:line or command+output.

> NOTE on the prompt's framing: the prompt said "branch master, clean tree" and quoted
> the YAML-fix commits as `f93e731`/`c48d577`. Those commit hashes resolve (verified).
> The repo HEAD at audit time is `master` @ `4072af9` (post-I-close, the WZ deploy +
> CI-was-never-running discovery commit), 10+ commits ahead of the gitStatus snapshot
> (`tranche-i-dev` @ `8a40cf4`). All findings below are grounded against `master`@`4072af9`.

---

## §0 — Job DAG (the whole pipeline at a glance)

```
PR→master / push→master ──▶ ci.yml  (concurrency ci-<wf>-<ref>, cancel-in-progress:true)
                              ├─ job: gates       (ubuntu-latest, node24, npm cache, timeout 10m)   ── PARALLEL
                              └─ job: demo-smoke   (ubuntu-latest, node24, npm cache, timeout 20m)   ── PARALLEL
   (no `needs:` between them — ci-coverage confirms 0 `needs:`; ci "success" = gates ∧ demo-smoke)

ci workflow_run completed ──▶ deploy-pages.yml  (workflow_dispatch OR ci=success ∧ head_branch=master ∧ event=push)
                              └─ job: deploy      (ubuntu-latest, timeout 20m) → scripts/pages-deploy.sh → CF Pages

push tag v*.*.* ───────────▶ release.yml  (concurrency release-<ref>, cancel-in-progress:FALSE)
                              └─ job: publish     (ubuntu-latest, node24) → check:lib→build:lib→test→proof:boundary→npm publish --provenance
```

- `gates` job (ci.yml:48-186): `npm ci` → deps-current → check:lib → build:lib → dts-symbol-rollup
  (15 symbols, precise anchors) → test → **~33 library `proof:*` gates** → `proof:gate-is-runtime`
  + `proof:chronic-closure` (HYGIENE-meta) → `proof:ci-coverage`. **Glass-ui-free, no browser, no demo build.**
  This job CAN go green on Linux — pure src→dist surface. (ci.yml:48-186)
- `demo-smoke` job (ci.yml:188-1096): `npm ci` → `npm i --no-save @playwright/test lighthouse`
  → `npx playwright install --with-deps chromium` → `npm run gh-pages` → `demo-smoke.mjs` →
  `occlusion-gate.mjs` → **~70 sequential gate steps** (93 `KF_REQUIRE_BROWSER` env occurrences;
  `grep -c KF_REQUIRE_BROWSER ci.yml` = 93) → lighthouse-gate → build:lib → LoAF bench.
- Runner OS: **ubuntu-latest** for all three workflows (no matrix, no macOS/Windows). Node **24**
  (named delta from constellation default 22; engines floor `>=22`; ci.yml:54-59).
- Caching: `actions/setup-node@v5` with `cache: "npm"` on every job. No playwright-browser cache
  (chromium re-downloaded every demo-smoke run via `npx playwright install` — ci.yml:212).

---

## §1 — YAML-validity fix (f93e731 + c48d577): SOUND ✔

| Probe | Result |
|---|---|
| `python3 -c "import yaml; yaml.safe_load(open('ci.yml'))"` | `ci.yml: YAML VALID` |
| same on deploy-pages.yml / release.yml | both `YAML VALID` |
| `node scripts/proof-ci-coverage.mjs` | PASS — 3× `yaml-valid … parses as valid YAML` |
| `git show f93e731 --stat` | `ci.yml \| 4 ++--` — quoted the 2 H.W12 step names whose `at:`/`offset-path:` colon-space GHA read as a nested mapping |
| `git show c48d577 --stat` | `proof-ci-coverage.mjs \| 41 +++` — added clause -1 (real `yaml` parser + dependency-free fallback) |

**Verdict:** the root cause (two unquoted step `name:` with a colon-space → GHA parse-time 0s reject
→ no job → deploy-pages `workflow_run`-on-success never fires → live site frozen at pre-H since H's merge)
is correctly diagnosed and fixed. The clause -1 in `proof-ci-coverage.mjs:58-97` is the right gate-of-the-gate:
it parses ALL THREE workflows with the real `yaml` lib, falling back to a regex that detects the exact
unquoted-colon-space class. **The gate now self-polices parse-validity** — born-RED on the H.W12 names.
This is the textbook I-precept turn (a gate that "verifies CI" must verify CI would PARSE).

**Caveat (P2, §6):** clause -1 only catches *YAML* validity, not *GHA-schema* validity. A workflow can be
valid YAML yet invalid as an Actions schema (e.g. a typo'd `on:` trigger, a bad `uses:` ref). The clause
closes the exact 0s-parse-fail that bit, not the broader class. Acceptable; record it.

---

## §2 — demo-smoke chain: a known-flaky HARD gate at step #16 blocks ~50 gates from EVER running on Linux [P0]

`awk` over ci.yml:188-1097 yields the ordered demo-smoke `run:` steps. There is **NO `continue-on-error`,
NO `fail-fast` override, NO step `if:`** anywhere in ci.yml (`grep -nE 'continue-on-error|fail-fast|if:' ci.yml`
returns nothing). The job is **one long serial bash sequence**: the first non-zero exit aborts the job and
every later step is `skipped`.

**Position of the flake** (the ordered list, line → step):

| # | line | gate | tier | CI posture |
|---|---|---|---|---|
| 1 | 216 | `demo-smoke.mjs` (inv γ paints) | hard | hard |
| 2 | 218 | `occlusion-gate.mjs` (inv δ) | hard | hard |
| 3 | 222 | proof:demo-usability | hard | hard |
| 4 | 240 | proof:engine-no-throw-on-play | CORRECTNESS | hard |
| 5 | 244 | proof:fsm-suspend-resume-live | CORRECTNESS | hard |
| 6 | 248 | proof:easing-editor-live | CORRECTNESS | hard |
| 7 | 252 | proof:amiga-subject-is-pivot | CORRECTNESS | hard |
| 8 | 256 | proof:drag-gesture | CORRECTNESS | hard |
| 9 | 260 | proof:perf-frame-budget | CORRECTNESS | **CI observe-only** (IN_CI, §4) |
| 10 | 264 | proof:icon-paint-live | CORRECTNESS | hard |
| 11 | 268 | proof:specular-absent-at-rest | CORRECTNESS | hard |
| 12 | 272 | proof:demo-fonts | CORRECTNESS | hard |
| 13 | 276 | proof:live-session (HEADLINE) | CORRECTNESS | hard (KF_DEV_SERVER=1) |
| 14 | 288 | proof:visual-lock | HYGIENE | **CI observe-only** (IN_CI, §4) |
| 15 | 306 | proof:scene-machine-irrefragable | HYGIENE | hard |
| **16** | **322** | **proof:scene-control-dfa** | hard | **HARD — the KNOWN FLAKE** |
| 17 | 338 | proof:scene-transition-perf | hard | **CI observe-only** (IN_CI, §4) |
| 18–70 | 342→1097 | dock/single-toggle/darkmode/idle/grid/subgrid/rail/shell/stage/cartoon/lighthouse/decomposition/composable/bezier/scene-perf/scene-parity/sequence/motion-path/easter-egg/hero/dogfood/demo-elevate/modern-web/platform-adopt/LoAF bench | mixed | **NEVER REACHED ON LINUX** if #16 fails |

**The flake is LIVE and OPEN.** `git log scripts/proof-scene-control-dfa.mjs`:
- `66855c2` — "CI-aware settle + wait for the control-tab trigger to render (slow-runner timing)"
- `feb39c3` — **REVERT** of `66855c2`: "the escape-hatch waited on the STALE trigger (no-op under load)".
  Commit body: *"on a hash-nav scene transition the control-surface projection lags the route under load …
  passes on a fast/unloaded machine (proof:all caught it), fails under load + on the slow CI runner. The
  correct fix is a per-expected-trigger settle wait — booked as part of the CI-on-Linux gate-robustness pass."*

`grep -nE 'process.env.(CI|GITHUB_ACTIONS)|IN_CI' scripts/proof-scene-control-dfa.mjs` → **nothing.**
The gate has NO IN_CI observe-only downgrade; it **hard-gates in CI** with a fixed settle and a known
under-load failure mode. It sits at step #16, before ~50 gates that have therefore **never executed on a
real Linux runner** (CI was YAML-dead since H; the first valid Linux run is now gated on a gate the author
reverted to its flaky baseline).

**The chain:** scene-control-dfa flakes → demo-smoke job fails → ci conclusion=failure → deploy-pages `if`
is false → **no auto-deploy.** This is why the 06-09 deploy was MANUAL (§3). Until scene-control-dfa is
fixed, the auto-deploy path is structurally blocked and the tail gates are unverified on Linux.

**Underlying defect is a REAL PRODUCT BUG, not just a test-timing issue:** per the revert body, the
control-surface projection genuinely lags a hash-nav scene transition under load (the panel is briefly
empty/wrong after a dock switch). The gate is doing its job; the product has a lagging FSM→control-surface
projection. (Corroborated by the sibling lane: `docs/tranches/J/audit/wave-I.WZ-postclose.md:84-121` §C.)

**Disposition: FOLD → J.** Two atomic pieces: (1) fix the product (the control-surface projection must
settle deterministically on SCENE_READY, not lag the route under load); (2) fix the gate (a per-expected-trigger
settle wait that waits for the DESTINATION trigger, not the source's stale one). Do NOT make this gate
CI-observe-only — it is a device-INDEPENDENT correctness property (the rendered control set per scene),
so it MUST hard-gate per the §5 boundary. The fix is to make it deterministic, not to demote it.

---

## §3 — deploy-pages.yml: gating sound; deploy was DEAD since H; manual-bypass cred story needs a J VERIFY

**The `workflow_run`-on-green gating (deploy-pages.yml:42-46) is CORRECT:**
```yaml
if: github.event_name == 'workflow_dispatch' ||
    (github.event.workflow_run.conclusion == 'success' &&
     github.event.workflow_run.head_branch == 'master' &&
     github.event.workflow_run.event == 'push')
```
- `conclusion == 'success'` — only a GREEN ci run deploys (a red ci → `if` false → no ship). ✔
- `head_branch == 'master'` — only master, not feature branches. ✔
- `event == 'push'` — excludes PR-triggered ci runs (a PR's ci run must not deploy). ✔ (correct subtlety)
- `workflow_dispatch` escape — a manual re-deploy is always allowed. ✔
- `head_sha` checkout (`:52`) pins the deployed tree to the EXACT sha CI greened. ✔
- No path filter (`:40-41` comment): the former tip-commit `git diff HEAD^ HEAD` filter silently skipped a
  push whose TIP commit was docs-only even when earlier commits changed the demo; dropping it means every
  green-CI master push re-ships. **Sound design.**

**Deploy was DEAD H→I:** ci.yml was YAML-invalid (§1) → ci never reached `success` → `if` never true →
deploy-pages never fired. Live site frozen at pre-H from H's merge until the f93e731 fix (verified by the
commit bodies + I/FINAL.md:237-252 "master is 10 commits BEHIND … LIVE demo is still the BROKEN H tip").

**The manual-deploy reality (the OPEN cred-story item):** even after f93e731 made ci PARSE, the 06-09 deploy
was MANUAL — because the auto-path is blocked by the scene-control-dfa flake (§2). The deploy-of-record
mechanics are kf-OWNED and correct: `deploy-pages.yml:66-67` consumes `secrets.CLOUDFLARE_API_TOKEN` +
`secrets.CLOUDFLARE_ACCOUNT_ID` (GH repo secrets) and runs `scripts/pages-deploy.sh` (constellation spine:
project pre-flight + rollback-id capture + commit-msg ASCII sanitise + `wrangler pages deploy`). The script
reads creds from `env` only (`pages-deploy.sh:45-46` `: "${CLOUDFLARE_API_TOKEN:?…}"`), never inlined. ✔

The MEMORY note (`project_ci_was_dead_and_deploy_creds`) records the manual bypass pulled creds from a
SIBLING repo's `.env` (`fourier-analysis/.env`, account `07119f…`) because the GH-secrets auto-path was dead.
**Does kf need an owned deploy-credential story instead of a sibling `.env`?** The DESIGN already is owned —
the workflow + script consume GH repo secrets. The sibling-`.env` was a one-time emergency, not the design.
The only open question is whether the GH repo secrets ACTUALLY exist and match — I cannot read secrets from
the tree.

**Disposition:** deploy-pages design = **VERIFY-ONLY** (re-confirm gating logic once §2 unblocks the auto-path).
The cred existence = **VERIFY-ONLY → J.W0**: J must confirm `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`
exist as kf GH repo secrets (`gh secret list`) and match the live `keyframes` CF project, so the auto-path
works the instant §2 lands and NO sibling-`.env` dependency remains. (Do NOT touch secret values.)

---

## §4 — The CI-observe-only boundary: REAL but AD-HOC (triplicated literal, no shared seam) [P1]

Three device-DEPENDENT gates downgrade themselves in CI. `grep -rn 'process.env.CI|GITHUB_ACTIONS' scripts/`:

| gate | detector | observe behavior | sound? |
|---|---|---|---|
| `proof-perf-frame-budget.mjs:61` | `const IN_CI = !!(process.env.CI \|\| process.env.GITHUB_ACTIONS)` | `:464-471` `if (IN_CI) { … process.exit(0) }` — the throttled drop counts are RECORDED, zero-error floor + structural checks still bite | ✔ (throttled-frame budget is hardware-dependent; ~6× slow VM) |
| `proof-scene-transition-perf.mjs:79` | same literal | `:81` notes `[CI observe-only — re-measure on-device]`; the timing budget is advisory | ✔ (cross-scene render budget is hardware-dependent) |
| `proof-visual-lock.mjs:220` | same literal | `:222` `[CI observe-only — cross-OS render; re-baseline in-container]` — pixel-diff advisory | ✔ (cross-OS font/AA render delta) |

**The boundary is RIGHT** — these three measure hardware/OS-dependent quantities (throttled frame timing,
cross-OS pixel render) that a shared-runner cannot bound against a real-hardware threshold. Demoting them to
observe-only in CI while keeping them hard local is the correct device-DEPENDENT posture.

**But the implementation is ad-hoc:** the `IN_CI = !!(process.env.CI || process.env.GITHUB_ACTIONS)` literal
is **triplicated** verbatim across three scripts (and `demo-fonts`/`scene-control-dfa` etc. do NOT use it at
all). There is no single helper, no manifest of "which gates are observe-only and why", no enforcement that a
NEW device-dependent gate adopts the posture. A gate author can forget IN_CI and ship a flaky hard gate
(exactly scene-control-dfa, §2). **The boundary is a convention, not a charter invariant.**

**Disposition: FOLD → J.** (a) Single-source `IN_CI` + an `observeOnlyInCI(label)` helper in `scripts/lib/`;
(b) publish a MANIFEST mapping each observe-only gate → its device-dependence reason; (c) encode the §5
boundary as a J charter invariant + a gate that polices it (see §5).

---

## §5 — Candidate J charter invariant: the principled CI hard-gate boundary

> **inv (CI-boundary):** A gate in CI hard-gates **iff** its oracle is **device-INDEPENDENT** — a product
> property whose truth value does not change with runner hardware speed, OS pixel-rendering, or wall-clock
> load. Device-DEPENDENT measurements (throttled frame budgets, cross-OS pixel diffs, absolute timing) run
> **observe-only in CI** (recorded, never red) and **hard local/on-device**. A device-INDEPENDENT gate may
> NEVER be demoted to observe-only to paper over a flake; a flaky device-INDEPENDENT gate is a determinism
> bug in the gate or a real bug in the product — fix the gate or the product, do not silence it.

**Compliance table** (every gate that runs in CI, by axis):

| gate | oracle axis | runs as | compliant with inv(CI-boundary)? |
|---|---|---|---|
| gates job: check:lib / build:lib / test / dts-rollup / all ~33 library proof:* | device-INDEPENDENT (src→dist, jsdom) | hard | ✔ |
| proof:engine-no-throw-on-play / fsm-suspend-resume-live / easing-editor-live / amiga-subject-is-pivot / drag-gesture / icon-paint-live / specular-absent-at-rest / demo-fonts / live-session | device-INDEPENDENT (DOM facts: paints, mounts, transform persists, no-throw, svg paints, title, font-family) | hard | ✔ |
| proof:scene-machine-irrefragable + the ~50 layout/grid/subgrid/rail/shell/card/bezier/dock/mobile/stage/idiom/hero/dogfood/scene-parity/easter-egg gates | device-INDEPENDENT (computed CSS, geometry containment, DOM membership) | hard | ✔ (modulo settle-flake risk, §2) |
| **proof:scene-control-dfa** | device-INDEPENDENT (rendered control-set per scene) — BUT currently **timing-flaky under load** | **hard** | **✗ VIOLATES** — a device-INDEPENDENT gate that is non-deterministic. The fix is determinism (per-trigger settle wait + product FSM fix), NOT observe-only demotion. (§2) |
| proof:perf-frame-budget | device-DEPENDENT (throttled frame timing) | observe-only | ✔ |
| proof:scene-transition-perf | device-DEPENDENT (cross-scene render budget) | observe-only | ✔ |
| proof:visual-lock | device-DEPENDENT (cross-OS pixel diff) | observe-only | ✔ |
| lighthouse-gate (a11y=100 + seo≥90) | device-INDEPENDENT (a11y/seo audit pass/fail) | hard | ✔ (a11y/seo are deterministic; the perf score is NOT asserted) |
| LoAF >50ms bench (KF_LOAF_COUNT=48) | device-DEPENDENT (main-thread block ms) | **runner-CALIBRATED** (size shrunk to 48 cells so worst-frame fits the strict 50ms on the slow VM; threshold UNCHANGED) | ✔ (a third, legitimate, model: calibrate the STRESS SIZE to the runner, keep the threshold absolute — ci.yml:1080-1095) |

**Three legitimate device-dependence postures emerge** (J should name all three in the charter):
1. **observe-only** (perf-frame-budget, scene-transition-perf, visual-lock) — record, never red.
2. **runner-calibrated** (LoAF bench) — keep the absolute threshold, size the stress to the runner.
3. **hard** (everything device-independent) — red on any failure.
The ONE non-compliant cell is `scene-control-dfa` (device-independent but non-deterministic → must be made
deterministic, §2).

---

## §6 — proof:ci-coverage: passes, but has its OWN blind spots [P1]

`node scripts/proof-ci-coverage.mjs` → PASS (all clauses). 102 `proof:*` gates invoked, 7 excluded
(proof:all, proof:ci-coverage, proof:lighthouse-mobile, proof:repin-safe, proof:browser, proof:correctness,
proof:hygiene). The coverage clause is real and useful. **But three blind spots remain:**

1. **Raw `node scripts/*.mjs` gates are NOT covered.** `demo-smoke.mjs`, `occlusion-gate.mjs`,
   `lighthouse-gate.mjs` are invoked as `run: node scripts/X.mjs` (ci.yml:216,218,471), NOT as `proof:*`
   package scripts. `node -e` confirms there is NO `proof:occlusion` / `proof:demo-smoke` script and no
   `proof:*` wraps them. The coverage gate enumerates `Object.keys(pkg.scripts).filter(s=>s.startsWith('proof:'))`
   (proof-ci-coverage.mjs:117) — so these three could be DROPPED from ci.yml and the coverage gate stays
   green. The inv-γ paint gate and inv-δ occlusion gate (the two HEADLINE demo invariants) are coverage-blind.
   **FOLD → J:** either wrap them as `proof:occlusion`/`proof:demo-smoke`/`proof:lighthouse-a11y` package
   scripts (so coverage sees them) or extend the coverage clause to scan `node scripts/` invocations too.

2. **The version-literal clause (clause 1) scans ONLY ci.yml and is caret-only.**
   `proof-ci-coverage.mjs:53` `const ci = wf("ci.yml")`; `:155` `ci.matchAll(/\^\d+\.\d+\.\d+/g)`.
   - It does NOT scan deploy-pages.yml or release.yml. `deploy-pages.yml:58` carries a STALE
     `@mkbabb/glass-ui ^3.4.0` comment (actual pin is `~3.9.0` per package.json) — **never scanned.**
   - The regex is caret-only (`\^\d`). ci.yml's actual stale version mentions are TILDE-form comments:
     `ci.yml:199` says `@mkbabb/glass-ui ~3.5.1` (actual pin `~3.9.0`, **stale by 4 minors**). The tilde
     form evades the caret regex → clause 1 passes VACUOUSLY (`grep -oE '\^[0-9.]+' ci.yml` = empty).
   **FOLD → J:** widen clause 1 to scan all three workflows and both `^`/`~` literals.

3. **Stale-doc / retired-gate references INSIDE ci.yml** (NO-legacy precept violation in the workflow itself):
   - `ci.yml:204` comment: *"Gated by proof:dock-morph-settled"* — but `proof:dock-morph-settled` is RETIRED
     (`node -e` → `false`; ci.yml:345 itself documents the retirement). A comment cites a dead gate as the
     live gating mechanism.
   - `ci.yml:199` glass-ui `~3.5.1` stale (above).
   - `deploy-pages.yml:58` glass-ui `^3.4.0` stale (above).
   These are stale docs embedded in the pipeline — the exact "no stale docs" precept, in the CI files.
   **FOLD → J (P2 polish):** refresh the comments; ideally single-source the pin into a comment-free form.

---

## §7 — release.yml: coherent, with two notes

**Sound:** tag-triggered (`v*.*.*`); `concurrency: release-<ref>, cancel-in-progress: FALSE` (deliberate
asymmetry vs ci's `true` — a half-`npm publish` is the corruption it prevents, release.yml:24-30);
`id-token: write` for `--provenance` (SLSA attestation via OIDC, npm token still authenticates the publish,
release.yml:11-15,54-57); library-scoped pre-publish gate `check:lib → build:lib → test → proof:boundary`
(release.yml:46-53). Library build is glass-ui-free (the demo seam is never reached on publish). ✔

**Note 1 — pre-publish gate is NARROWER than the `gates` job.** release.yml runs only check:lib/build:lib/
test/proof:boundary — NOT proof:engine, proof:zero-alloc, proof:engine-correctness, or the I.W0 bugfix gates
(proof:engine-no-throw-on-play is a demo gate, but proof:engine/proof:cohesion are library gates the `gates`
job runs and release does not). A `v*` publish could ship with a library regression the `gates` job would
catch but release does not — IF the tag is pushed without a green ci on the same sha. **Mitigant:** in
practice the tag rides a master commit that already passed `gates`. **BOOK:** consider gating release on a
green ci `workflow_run` for the tagged sha, or run the full library `gates` chain in release. Measure-first
(it has never bitten); record the gap.

**Note 2 — changeset/semver coherence (USER-DOMAIN).** Two pending changesets, both `patch`:
`.changeset/tranche-h.md` (`"@mkbabb/keyframes.js": patch`) + `.changeset/tranche-i.md` (`patch`).
Current `package.json` version `4.1.0`; `npm view @mkbabb/keyframes.js version` = `4.1.0` (un-bumped).
- H is a pure demo tranche (changeset body: library *"byte-stable vs 4.1.0"*) → patch defensible.
- I TOUCHES the library: `git diff v4.1.0 master --stat -- src/animation/` shows
  `format.ts +22 / frame-compiler.ts +16 / group.ts +52 / playback.ts +33` (101 insertions). I/FINAL.md:228-235
  argues these are *"strictly-more-correct BUGFIXES"* (empty-input no longer crashes; serialize-from-template;
  group no-op transform) → patch is **semver-defensible** (bugfix = patch). No new public API symbol added
  (the dts-rollup gate still asserts the same 15 symbols, ci.yml:84). value.js floor moved `^0.11.2`,
  glass-ui `~3.9.0` (demo-only optional dep, no library impact).
  **The publish boundary is USER-DOMAIN** (version owner Mike Babb, confirm-first per I/FINAL.md:235).
  **VERIFY-ONLY → J / RECORD:** when J ships, consume BOTH changesets in one `4.1.1` patch (or let the user
  elect minor); confirm value.js `0.11.2` published FIRST (the registry dep-order, release.yml:8-10).

---

## §8 — Wall-clock budget: demo-smoke 20m for ~55 cold-chromium gates is a TIMEOUT RISK [P1]

`grep -c KF_REQUIRE_BROWSER ci.yml` = 93 env occurrences; `grep -rl 'chromium.launch' scripts/proof-*.mjs | wc -l`
= **55 scripts each launch their OWN chromium + serve dist independently** (sampled: live-session,
scene-control-dfa, dock-zorder all `chromium.launch`). The demo-smoke job (timeout 20m, ci.yml:191) does:
`npm ci` + `npm i --no-save @playwright/test lighthouse` + `npx playwright install --with-deps chromium`
(cold download, no cache) + `npm run gh-pages` build + ~70 sequential gate steps (each a cold chromium
launch + static serve + settle) + lighthouse + `build:lib` + LoAF bench.

55 cold chromium launches × (launch + serve + multi-second settle each) + the install/build overhead is a
**real risk of exceeding 20 minutes** on a shared ubuntu-latest runner. This compounds §2: even AFTER
scene-control-dfa is fixed, the FIRST full Linux run may time out before reaching the tail gates (scene-parity,
easter-egg, hero, dogfood, demo-elevate, modern-web, platform-adopt, LoAF). The job has NEVER run to
completion on Linux (CI was dead H→I; then gated on the flake), so the 20m budget is **unvalidated**.

**Disposition: FOLD → J (measure-first).** Either (a) shard demo-smoke into parallel matrix legs (group gates
by scene/area, each its own runner), (b) share ONE chromium+server across gates via a batched harness, or
(c) cache the playwright browser. Bind the real wall-clock from the first complete Linux run before choosing
— do not pre-optimize. The job MUST be observed running end-to-end on Linux at least once (the §2 fix is the
prerequisite). P-invariant-28: this gets a terminal J home, not a perpetual punt.

---

## §9 — Findings summary (atomic, deduplicated)

| id | sev | title | disposition |
|---|---|---|---|
| CICD-1 | P0 | scene-control-dfa: flaky HARD gate at demo-smoke step #16 blocks ~50 gates from ever running on Linux + blocks auto-deploy; underlying product bug (control-surface lags hash-nav under load) | FOLD → J.W0 (product FSM fix + per-trigger gate fix; keep hard) |
| CICD-2 | P1 | Auto-deploy chain dead/blocked (YAML-dead H→I, then scene-control-dfa flake); 06-09 deploy was MANUAL; cred-story is kf-OWNED in design but sibling-`.env` was used as emergency bypass | VERIFY-ONLY → J.W0 (confirm GH repo secrets exist/match; auto-path unblocks when CICD-1 lands) |
| CICD-3 | P1 | CI-observe-only boundary is REAL+correct but AD-HOC: IN_CI literal triplicated, no shared helper, no manifest, no enforcement → a new device-dependent gate can ship flaky-hard | FOLD → J (single-source helper + manifest + charter inv §5) |
| CICD-4 | P1 | proof:ci-coverage blind to raw `node scripts/` gates (demo-smoke.mjs, occlusion-gate.mjs, lighthouse-gate.mjs — the inv-γ/inv-δ headlines) | FOLD → J (wrap as proof:* or extend the clause) |
| CICD-5 | P1 | proof:ci-coverage version-literal clause scans ci.yml ONLY + caret-only regex → deploy-pages.yml `^3.4.0` unscanned; ci.yml `~3.5.1` tilde stale, evades; clause passes vacuously | FOLD → J (scan all 3 workflows + `^`/`~`) |
| CICD-6 | P2 | Stale docs IN the pipeline: ci.yml:199 glass-ui `~3.5.1` (actual `~3.9.0`); ci.yml:204 cites RETIRED `proof:dock-morph-settled` as live gating; deploy-pages.yml:58 `^3.4.0` (actual `~3.9.0`) | FOLD → J (NO-stale-docs precept; refresh) |
| CICD-7 | P1 | demo-smoke 20m timeout for ~55 cold-chromium gates is unvalidated (job never ran end-to-end on Linux) → timeout risk even after CICD-1 | FOLD → J (measure-first, then shard/share/cache) |
| CICD-8 | BOOK | release.yml pre-publish gate (check:lib/build:lib/test/proof:boundary) is narrower than the `gates` job → a tagged sha without a green ci could ship a library regression | BOOK (measure-first; consider gating release on green ci workflow_run) |
| CICD-9 | RECORD | Changeset/semver: H+I both `patch`; I touched 4 library files but as bugfixes → patch semver-defensible; publish boundary USER-DOMAIN | VERIFY-ONLY/RECORD → J (consume both in 4.1.1; value.js 0.11.2 first) |
| CICD-10 | VERIFY-ONLY | YAML-validity fix (f93e731) + clause -1 (c48d577) are SOUND; clause -1 catches YAML-validity not full GHA-schema validity | VERIFY-ONLY (J re-verifies; record the schema-validity caveat as P2) |

**Precept ledger:** NO-stale-docs violated inside the workflow files (CICD-6). gate-ORACLE precept: the
CI-observe boundary is sound but un-charter'd (CICD-3, §5). inv ε: the I close's CI claims (YAML-fix,
deploy mechanics) re-verified TRUE against the tree (§1, §3). P-invariant-28: every deferral above has a
terminal J home or a measure-first BOOK — no perpetual punt.
