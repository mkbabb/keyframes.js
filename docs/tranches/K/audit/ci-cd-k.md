# Tranche K — CI/CD Audit: ci-cd-k.md

**Lane:** `ci-cd-k` (DOCS ONLY — no source/test/gate/CI edits).
**Repo state:** `tranche-j-dev` == `master` @ `4f1fc4c` (Tranche J closed 2026-06-11; 4.2.0 published).
**Subject files:** `.github/workflows/ci.yml`, `.github/workflows/release.yml`, `.github/workflows/deploy-pages.yml`, `scripts/proof-ci-coverage.mjs`, `scripts/proof-deps-current.mjs`, `package.json`.

---

## §1 — Current CI/CD Shape (ground truth)

### 1.1 Workflow inventory

| File | Jobs | Timeout | Trigger |
|---|---|---|---|
| `ci.yml` | `gates` (library, glass-ui-free), `demo-smoke` (demo + browser) | `gates: 10m`, `demo-smoke: 35m` | PR to master, push to master |
| `release.yml` | `publish` | **NONE** (GHA default 360m) | tag `v*.*.*` |
| `deploy-pages.yml` | `deploy` | `20m` | `workflow_run` on `ci` completed, `workflow_dispatch` |

All three workflows declare `concurrency:` blocks (proof:ci-coverage clause 3, verified green).
All three are valid YAML (proof:ci-coverage clause -1, yaml package installed as devDep).
No workflow carries a `git clone` or `file:` glass-ui reference (clause 2 re-grounded, green).

### 1.2 Gate roster size

| Job | Named steps | Browser-gated (KF_REQUIRE_BROWSER=1) | Static/vitest-only |
|---|---|---|---|
| `gates` | 39 | 0 | 39 |
| `demo-smoke` | 86 | 64 | 16 + 6 infra |

Total: 125 named steps across both jobs. 80 of those are `npm run proof:*` invocations in demo-smoke alone (ci.yml:80 proof steps in the demo-smoke job — counted via `grep -c "run: npm run proof:" ci.yml` on the demo-smoke section).

Source: `ci.yml:52-1171`. The `gates` job is `ci.yml:47-202`; `demo-smoke` is `ci.yml:204-1171`.

---

## §2 — Findings

### F-1 (P1) — release.yml has no `timeout-minutes`; a stuck npm publish blocks for up to 6 hours

**Evidence:** `ci.yml:51` sets `timeout-minutes: 10` for the gates job; `ci.yml:213` sets `timeout-minutes: 35` for demo-smoke; `deploy-pages.yml:48` sets `timeout-minutes: 20`. `release.yml` has **no** `timeout-minutes` at the job or step level.

Verified by command: `grep -n "timeout-minutes" .github/workflows/release.yml` → **no output**.

GitHub Actions' documented default timeout for a job with no declared timeout is **360 minutes (6 hours)** (docs.github.com/en/actions/using-workflows/workflow-syntax#jobsjob_idtimeout-minutes). If `npm publish` hangs (registry outage, stale TCP connection, CI network partition — all observed in practice), the job blocks silently for six hours before the runner is force-killed. At J.W4 the commentary explicitly noted the hang-protection rationale for ci.yml's `cancel-in-progress: false` (a concurrent publish must NOT be cancelled mid-publish): the asymmetry makes a timeout declaration **more** important, not less, because only the runner kill ends it.

The release.yml publish step also carries no per-step `timeout-minutes`. A `npm ci` cache-miss on a cold runner + a `npm publish --provenance` attestation-generation round-trip could each independently stall.

**Suggested fix:** Add `timeout-minutes: 15` to the `publish` job in `release.yml`. (The full `npm ci` + `check:lib` + `build:lib` + `test` + `proof:boundary` + `npm publish --provenance` sequence has measured under 5 minutes on warm runners; 15m is ~3× that with headroom, and still terminates within the CI runner's billing epoch.)

---

### F-2 (P1) — The 35m demo-smoke budget was set at J.W4 but does NOT account for post-J.W4 gate additions; the true headroom is unknown

**Evidence — the budget comment (ci.yml:207–213):**

> `# CICD-7 wall-clock bound, re-sized at J.W4 (measure-first): the pre-W4`
> `# roster measured 19m13s end-to-end (run 27310054675) against the old`
> `# 20m ceiling; J.W4 adds the mobile-input battery (~2m), the axes legs`
> `# inside proof:live-session (~2m), and the observe-only mobile`
> `# Lighthouse matrix (~5m). 35m bounds the new roster with headroom —`
> `# a hang still dies well before the 6h GHA default.`

**The measurement baseline** is run `27310054675` (J.W0 baseline, `c6c3c37`) which measured `19m13s`. The 35m ceiling was set at J.W4 to accommodate ~9m of new work (mobile battery + axes legs + lighthouse-mobile). This makes the J.W4-era projected total ~28m, and 35m = 28m + 7m headroom.

**Gates added AFTER the J.W4 recalibration** (verified in ci.yml by wave-label search):

| Gate | Wave | Est. browser time | Evidence |
|---|---|---|---|
| `proof:subject-animates` | J.W6 | ~1m (synthetic probe page, 3 arms × browser launch) | ci.yml:266-268 `J.W6 P0` |
| `proof:control-surface-single-writer` | J.W2 | ~2m (full DFA sweep) | ci.yml:368-370 `J.W2 S2` |
| `proof:sheet-reopen-scroll` | J.W2 | ~1m (spring settle-wait) | ci.yml:921-923 `J.W2 S3` |
| `proof:appearance-suffusion` | J.W7a | ~3m (7 scene navigations + computed-style reads + handle drag) | ci.yml:311-314 `J.W7a` |
| `proof:sequence-rows-draggable` | H.W12 | ~1m (drag + re-sort wait) | ci.yml:1031-1034 |
| `proof:motion-path-editable` | H.W12 | ~1m (drag + path-change wait) | ci.yml:1048-1050 |
| `proof:motion-path-copy` | H.W12 | ~1m (clipboard grant + write) | ci.yml:1063-1065 |
| `proof:easter-egg` | H.W12 | ~4-5m (7 scenes × dblclick + observable assert, isolated contexts) | ci.yml:1085-1088 |

**Rough estimate:** ~14-15m of new browser work added after J.W4. The projected total is ~28m + ~14m = **~42m**, which **exceeds the 35m ceiling**. There is no recent measured run after J.W7c's close (the last recorded run was `27378354065` on `f0822a1`, the close-merge, with no published timing annotation for the demo-smoke job — only the J.W4-era 19m13s baseline is on record in the codebase).

**Risk:** If the demo-smoke job now runs in ~38-42m, it is within the CI timeout window (35m) but will FAIL on slow runners (the shared GHA Ubuntu pool runs ~2-3× slower than dedicated hardware during peak hours). A timeout-killed CI run blocks every PR and blocks the green-CI gate for the auto-deploy chain (`deploy-pages.yml` triggers only on `ci` conclusion == `success`).

**Seam:** The CICD-7 comment was written as a one-time recalibration at J.W4; the `35m` ceiling is now an unverified artifact. The gap is structural: there is no automated check that re-measures the wall clock against the declared ceiling.

**Suggested fix for Tranche K:** Before adding new K-era browser gates to demo-smoke, trigger a manual CI run on the current tree and observe the demo-smoke actual wall clock. If it is already above 30m, the budget must be recalibrated before K wave additions. A dedicated `proof:ci-wallclock` hygiene gate (records and asserts the last-observed demo-smoke duration against the ceiling, with a measured re-baseline update) is the long-term cure of the CICD-7 recurrence.

---

### F-3 (P1) — The hero CTA cold path (U-K2/U-K3 root) is structurally absent from every CI gate; the gate roster passes GREEN over a P0 product defect

**Evidence — confirmed by sibling lane (`live-session-gap-analysis.md` §1):**

The cold path is: user visits `#/` (hero) → clicks rainbow play → machine dispatches `NAVIGATE("cube")` + sets `autoPlayNext = true` → `markSceneReady()` fires → `PLAY` is dispatched → cube animates.

Live probe confirms that on the BUILT dist, this path **does not animate the cube** (`k-isolate.mjs` result: `.cube` distinct transforms = 0, `.idle-hover` CSS bob = 85; `cold-cube-2s.png`). This is P0.

**The gate gap mechanism:**

1. `proof:live-session` B1 leg (`ci.yml:262`): navigates to `#/` then calls `clickRainbowPlay()`, but IMMEDIATELY follows with `location.hash = "#/cube"` (in-page evaluate, bypassing the machine navigation: `proof-live-session.mjs:395-414`). It then samples `.cube/.graph/.idle-hover` for distinct transforms. The idle-hover CSS animation (`CubeTarget.vue:207-214`) satisfies the `>= 3 distinct` floor WITHOUT any engine write.

2. `proof:engine-no-throw-on-play` (`ci.yml:262-265`): the gate's headline is play-is-TOTAL + no parse error. It also bypasses the machine path (it opens its own HTTP server with an importmap, not the demo SPA cold start).

3. Hero-specific gates (`proof:hero-rung`, `proof:hero-balance`, `proof:hero-cls`, `proof:dogfood-hero`): all are static/visual gates that navigate to `#/` and read layout/font/CLS properties — none clicks the rainbow play and asserts engine motion. Verified: `grep -cE "click.*[Pp]lay|togglePlay|distinct.*transform|Pause animation"` in each of the four hero scripts → 0 in all four.

4. `proof:demo-usability` (`ci.yml:243`): asserts the hero word-gap and Play aria uniqueness, but does not click the play button and verify animation.

**Why the gates pass GREEN over the defect:** The B1 leg's `>= 3 distinct` oracle is satisfied by the `.idle-hover` CSS bob (85 distinct values in the live probe) regardless of whether the engine wrote a single frame. The gap was noted in `proof:subject-animates`'s own docstring (the "false positive" paragraph in `scripts/proof-subject-animates.mjs:8-13`) but that gate uses a synthetic `<div>` probe over `dist/keyframes.js` directly — it never drives the DEMO cube via the hero CTA.

**Seam:** The unexercised axis is the **machine-navigation cold-path binding**: `onPlayStateChange` → `autoPlayNext = true` → `getRunSceneSwitch()("cube")` → `markSceneReady()` → `machine.dispatch({type: "PLAY"})`. This is `useSceneMachineApp.ts:111-131` (the `isHome && playing && isHomeEmptyGroup` branch). No CI gate executes this code path end-to-end.

**Suggested K gate:** A `proof:hero-play-cold` correctness-tier gate that: (a) opens a FRESH context with NO `seedControlsOpen` pre-seed, (b) navigates to `#/` and waits for the hero FSM rest, (c) clicks the rainbow play button, (d) waits for the machine's `activeScene` to flip to `"cube"`, (e) asserts the `.cube` element's computed `transform` traverses >= 3 distinct ENGINE-WRITTEN values (the distinct-set must exclude the `.idle-hover` element, or use a non-idle selector). Born-RED on the current dist; GREEN only when the `autoPlayNext`/`markSceneReady` binding is repaired. This is the **canonical K-W-cold wave**.

---

### F-4 (P2) — release.yml runs a thinner gate set than CI; four library-scope gates present in CI are absent from the publish path

**Evidence — release.yml steps (verified by reading `release.yml:46-55`):**

Release gate: `check:lib → build:lib → test → proof:boundary → npm publish --provenance`

Gates in `ci.yml:gates` job that are absent from `release.yml`:

| Gate | Why it matters at publish time |
|---|---|
| `proof:published-surface` (J.W5) | The tarball-content oracle: asserts the `files:` declaration matches `npm pack --dry-run`, all 15 public runtime symbols roll up in `dist/keyframes.d.ts`, `AnimationEngine` interface is current, README snippets are self-consistent. A bad `files:` entry (e.g. `dist/_*` proof-harness dir accidentally packed — the recorded J.W4 defect) passes `proof:boundary` but fails here. |
| `proof:readme-runs` (J.W5) | Every README `// =>` snippet executes against the BUILT dist. A published README with a broken snippet is a user-facing defect. |
| `proof:deps-current` (G.W2) | Verifies the `@mkbabb/*` floors AND no `file:` protocol in the manifest. Publishing a `file:` glass-ui or sub-floor value.js is a defect. |
| `proof:engine` (D.W4) | The transposition source gate: tick-canon, pause-honest, snap-symmetry, no-legacy. A pre-publish regression here ships a broken engine. |

The release.yml comment at the top (`release.yml:1-16`) describes the intent as "re-runs the LIBRARY-SCOPED release gate" — but the implementation is a 4-step subset of the actual library gates job. The J.W5 addition of `proof:published-surface` and `proof:readme-runs` was done only in ci.yml, not backported to release.yml.

**Risk level:** P2. The gates in question are not safety-critical (a bad publish can be yanked and re-published), and CI must pass GREEN before a merge that would trigger a tag, so these gates HAVE been run on the pre-tag commit. The publish itself is an additional re-build from scratch that could theoretically drift if `npm run build:lib` is non-deterministic. The main exposure is a situation where someone creates a tag on a commit that bypassed CI (direct push to master with no PR, or a force-push).

**Suggested fix:** Add `proof:published-surface`, `proof:readme-runs`, and `proof:deps-current` to the `publish` job in `release.yml`, between `proof:boundary` and `npm publish`. These are all library-scoped, no browser needed, and each runs in under 30s.

---

### F-5 (P2) — deploy-pages.yml rebuilds the demo independently; no artifact sharing with CI; the deployed dist is not the tested dist

**Evidence:**

`deploy-pages.yml:64-68`: The deploy step runs `bash scripts/pages-deploy.sh`, which calls `BUILD_CMD="${BUILD_CMD:-npm run gh-pages}"` (`scripts/pages-deploy.sh:52`). This is a fresh `npm run gh-pages` build inside the deploy job — **independent of the build CI ran** in the `demo-smoke` job.

`grep -n "actions/upload-artifact\|actions/download-artifact" .github/workflows/ci.yml .github/workflows/deploy-pages.yml` → **no output** (no artifact sharing).

The SHA is correct: `deploy-pages.yml:52` checks out `${{ github.event.workflow_run.head_sha || github.sha }}`, which is the same SHA that CI ran on. So the source is identical. However:

1. The deploy job installs `npm ci` (its own package-lock resolution) and runs its own `npm run gh-pages`. If there is any non-determinism in the Vite build (hashed chunk names, timestamp-embedded manifests, etc.), the deploy binary will differ from the CI-tested binary.

2. More concretely: any `npm` resolution non-determinism (a new patch release of a non-pinned transitive dep) could produce a different `node_modules` tree in the deploy vs CI. The `package-lock.json` pins this for first-level deps but transitive deps under non-exact version ranges in lockfiles can drift between install sessions.

3. The deploy job performs NO gate validation after its build. It builds and ships. If the deploy build is broken (e.g. Vite emits an error that `pages-deploy.sh`'s `set -euo pipefail` does not catch because it's in the `eval "$BUILD_CMD"` subprocess), the error may go unnoticed.

**Risk level:** P2. In practice the builds are deterministic enough that this has not caused a visible defect. The SHA pin ensures the source is the same commit. The theoretical exposure is non-zero but the practical consequence is a redeployed site that renders identically to the CI-tested one.

**Suggested fix (K era):** Consider adding a `dist/gh-pages/.buildinfo` or `package-lock.json` hash assertion to `pages-deploy.sh` to verify the build inputs match what CI used. This is a hardening, not a blocker for K.

---

### F-6 (P2) — glass-ui pin is `~3.11.2`; registry latest is `3.13.0`; two minor releases (3.12.0, 3.13.0) are blocked by the tilde; one is a **breaking** upstream tranche

**Evidence:**

`package.json:182`: `"@mkbabb/glass-ui": "~3.11.2"` (tilde = `>=3.11.2 <3.12.0`).

Registry: `npm show @mkbabb/glass-ui version` → `3.13.0` (observed 2026-06-11).

The sibling-lane `live-glassui-currency.md` verified both tarballs. Its finding at §2:

> `3.12.0 → 3.13.0`: **breaking tranche** — dock taxonomy rewrite (`variant="rail"` and `variant="instrument-strip"` removed, `DockProps` unified without `variant` prop), `InstrumentRail` component removed, fluid typography tokens introduced, CSS god-module split.

> `3.11.2 → 3.12.0`: internal/hygiene only; dock API unchanged.

**Impact on K:** The K wave's U-K14 item is "upgrade to LATEST glass-ui (sliders etc.)". The 3.12.0 upgrade is safe (no breaking API). The 3.13.0 upgrade is breaking at the dock taxonomy seam and requires a demo adoption wave. Both upgrades are blocked by the tilde range.

**proof:deps-current posture:** The floor check in `scripts/proof-deps-current.mjs:80` is `"@mkbabb/glass-ui": "3.11.2"`. The gate passes GREEN at `3.11.2`; it does NOT enforce currency against the registry latest. There is no automated check that flags a 2-minor-release lag. This is by design (the gate comments at `proof-deps-current.mjs:1-12` explain that the floor tracks correctness minimums, not latest-always).

**Seam:** The tilde pin is the manual artifact of the J.W7b re-pin (`~3.9.0 → ~3.11.2`). When K advances the pin to `~3.12.0` (non-breaking) or prepares the breaking 3.13.0 adoption, `proof:deps-current`'s floor must be advanced in lockstep — the gate is the only automated check that the floor stays current.

---

### F-7 (P2) — The demo-smoke job's 16 static gates run redundantly; they do not need the `npm run gh-pages` build and could run in the `gates` job to save demo-smoke wall clock

**Evidence:**

The 16 static gates in demo-smoke (no `KF_REQUIRE_BROWSER`, no browser launch):

```
proof:lighthouse-mobile (observe-only)
proof:decomposition
proof:no-deprecated-guard
proof:single-writer
proof:composable-encapsulation
proof:demo-no-oversize
proof:no-brittle-selector
proof:no-dup-utility
proof:idioms
proof:phi-leaf-zero
proof:icon-idiom
proof:styling-idioms
proof:brittleness
proof:dogfood
proof:demo-elevate
proof:modern-web
```

All 16 are source/static grep gates that do not require a browser or the built `dist/gh-pages/`. Of these, 15 only need source files (under `demo/`); `proof:brittleness` reads the built `dist/gh-pages/` CSS. The 15 purely-source gates share no context requirement with the browser battery.

**Current placement:** These run in demo-smoke, after `npm run gh-pages` (the 3-4 minute demo build). Moving the 14 source-only gates to the `gates` job would save ~14 × (launch overhead ~5s each) = ~70s of demo-smoke sequential overhead, but the bigger benefit is that demo-smoke's wall clock is the bottleneck gate. Even modest savings extend the F-2 headroom.

**Note:** `proof:brittleness` reads `dist/gh-pages/`, so it must stay in demo-smoke (or a new third job). The `proof:modern-web` gate explicitly notes it skips the corpus-presence clause in CI (no `modern-web-guidance` corpus installed). These nuances make migration non-trivial; this is a P2 refinement.

---

### F-8 (P2) — `release.yml` has no job-level `timeout-minutes`; and also lacks a concurrency `cancel-in-progress: false` **with** a clear human-readable reason in the comment

This is a note, not a defect: `release.yml:26-30` correctly sets `cancel-in-progress: false` with an inline comment explaining the half-publish corruption risk. The posture is correct. But the absence of `timeout-minutes` (F-1) means the protection has a gap: the first run is BLOCKED (not cancelled) but it can also stall forever. The deliberate asymmetry vs ci.yml is documented but the missing timeout makes the asymmetry incomplete.

---

## §3 — Runner Posture and Action Versions

| Item | State | Risk |
|---|---|---|
| `ubuntu-latest` | Both workflows use `ubuntu-latest` = `ubuntu-24.04` (GHA current mapping) | Low — but `ubuntu-latest` is an alias that can shift; pinning to `ubuntu-24.04` is more stable. The gates rely on Chromium from Playwright, not the OS packages. |
| `actions/checkout@v5` | All three workflows | Green — v5 released 2024, uses Node 20 internally, supports sparse checkout |
| `actions/setup-node@v5` | All three workflows | Green — v5 supports `cache: "npm"` and the `node-version: 24` target |
| Node 24 vs `engines: >=22` | `ci.yml` uses Node 24; `engines` floor is `>=22` | Deliberate (CLAUDE.md: "kf runs Node 24 — the newest runtime the published lib will face"). The gate tests the newest runtime. |
| Playwright install | `npm i --no-save @playwright/test lighthouse` + `npx playwright install --with-deps chromium` | Pinned to whatever version is in the lockfile's transitive deps; `--no-save` means no lockfile pin for the Playwright version used in CI. This is a latent flakiness source if Playwright ships a breaking change. |

---

## §4 — Structural Coverage vs U-K Gate Blindspots

The orchestrator identified the hero-CTA path (U-K2/U-K3) as a key blindspot. This audit confirms the mechanism and traces it to:

- `proof:live-session` B1 leg: `scripts/proof-live-session.mjs:380-414` — clicks rainbow play on `#/`, then immediately `location.hash = "#/cube"` bypassing the machine navigation. The `>= 3 distinct` oracle is satisfied by CSS idle-bob.
- `useSceneMachineApp.ts:111-131` — the `isHome && playing && isHomeEmptyGroup` branch that sets `autoPlayNext = true` and calls `getRunSceneSwitch()("cube")` — never reached by any CI gate.
- `AnimationControlsGroup.vue:219-221` — the `onMounted` autoPlay trigger — never invoked on the cold path in any CI gate.

The K-era gate closure for this is straightforward: a `proof:hero-play-cold` gate that drives the EXACT cold path without `seedControlsOpen`, asserts the machine transition, and verifies `.cube` transform changes from a non-idle selector.

For the broader U-K register, CI coverage of new K features must route through the **correctness tier** of `proof:live-session` (the headline) or new correctness-tier siblings — the gate-ORACLE precept (`proof:gate-is-runtime`, `ci.yml:190`) enforces that every gate with a §Hard clause opens a browser AND actuates AND is wired to the correctness tier.

---

## §5 — FOLD Table

| Finding | Severity | Seam (file:line) | Suggested wave-class |
|---|---|---|---|
| F-1: `release.yml` has no `timeout-minutes`; stuck publish blocks 6 hours | P1 | `release.yml` (entire `publish` job, no timeout declared) | K-W1 chore (single-line fix: add `timeout-minutes: 15`) |
| F-2: 35m demo-smoke budget set at J.W4 not re-measured post-J.W7c; projected ~42m exceeds ceiling | P1 | `ci.yml:207-213` (CICD-7 comment), 8 new browser gates post-J.W4 | K-W0 measure-first (trigger a CI run, observe wall clock, recalibrate before K gates ship) |
| F-3: Hero CTA cold path structurally absent; `proof:live-session` B1 bypasses the machine; CSS idle-bob satisfies the oracle; P0 product defect passes GREEN | P1 | `scripts/proof-live-session.mjs:380-414` (B1 leg), `useSceneMachineApp.ts:111-131` (unexercised branch), `AnimationControlsGroup.vue:219-221` (onMounted autoPlay) | K-W-cold (new correctness-tier `proof:hero-play-cold` gate, born-RED on current dist) |
| F-4: release.yml runs only 4 library gates; missing `proof:published-surface`, `proof:readme-runs`, `proof:deps-current`, `proof:engine` | P2 | `release.yml:46-55` (steps), `ci.yml:106-114` (the missing gates are gates-job steps) | K-W1 chore (add 3 gates to release.yml publish job) |
| F-5: deploy-pages.yml rebuilds independently; no artifact sharing with CI; deployed binary != tested binary (theoretically) | P2 | `deploy-pages.yml:64-68`, `scripts/pages-deploy.sh:52` (BUILD_CMD) | K-W-infra (hardening; not blocking) |
| F-6: glass-ui pin `~3.11.2` blocks 3.12.0 (safe) and 3.13.0 (breaking — dock taxonomy, InstrumentRail removal, fluid typography); two minor releases behind latest 3.13.0 | P2 | `package.json:182`, `scripts/proof-deps-current.mjs:80` (floor at 3.11.2) | K-W-glass-ui (U-K14 adoption wave; 3.12.0 first as non-breaking, then 3.13.0 as a full breaking tranche with demo adoption) |
| F-7: 15 static source-grep gates run in demo-smoke behind the 3-4m `npm run gh-pages` build; could move to gates job to reduce demo-smoke wall clock | P2 | `ci.yml:538-570` (the 15 static gates), `ci.yml:234` (gh-pages build step) | K-W-infra (triage; move after F-2 re-measurement) |
| F-8: release.yml `cancel-in-progress: false` asymmetry is correct but incomplete without a timeout (see F-1) | P2 | `release.yml:26-30` | subsumed by F-1 fix |
