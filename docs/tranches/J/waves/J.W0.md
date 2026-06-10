# J.W0 — THE DEPLOY BOUNDARY (LEADS · P0 · the boundary-ORACLE's first oracle: what auto-DEPLOYS is what was certified)

- **Phase:** DEV — spec authored, awaits IMPL+auth · **Class:** SHIP-in-J (CRITICAL; the
  auto-deploy chain is ARMED and BLOCKED — `scene-control-dfa` flakes under load at
  `demo-smoke` step #16, so `ci` conclusion is non-deterministic, so `deploy-pages.yml`'s
  `workflow_run.conclusion == 'success'` gate is non-deterministic, so a future master push
  can silently NOT deploy — the SAME silent-no-deploy class that froze the live site H→I.
  The 06-09 ship was a MANUAL `wrangler` bypass; ONE clean green-CI → auto-deploy round-trip
  has NEVER been observed. `ci-linux-open-item.md §F/§8`, `wave-I.WZ-postclose.md §F`,
  `ci-cd.md §2`, `final-vs-tree-inv-epsilon.md` INVE-1.) · **Scope (gate harness + ONE demo
  product seam, inv-16 UNFENCED on the product half):** `scripts/lib/demo-driver.mjs` (the
  `navToScene` per-EXPECTED-state primitive + `SCENE_MACHINE_KEY`) + `scripts/proof-scene-control-dfa.mjs`
  + `scripts/proof-scene-transition-perf.mjs` (both migrate onto it; both shed their hand-rolled
  `navByHash`/`MACHINE_KEY`) + the dock trigger PROJECTION on the product half
  (`demo/@/components/custom/dock/ChromeDock.vue` `allControlTabs` + the `App.vue → sceneRef →
  extraControlTabs` mount chain — the I.W2 single-authority extended to the control-surface
  projection so the trigger never renders the SOURCE scene's stale label mid-transition) +
  the formal adoption of the 8-commit post-close tail (docs disposition only) + GH-secrets
  VERIFY (`gh secret list`, names only) + the never-run Linux tail triage protocol. ·
  **DAG-deps:** **LEADS the tranche** — the `navToScene` primitive and the observed green-Linux
  CI are CONSUMED by every later wave's verification (J.W3 owns the lib it lands in; J.W4's
  axes battery, J.W2's seam gates, and the J.WZ close-merge round-trip all require the deploy
  chain to be honest first). No wave's §Hard gate can be witnessed end-to-end on the CI
  substrate until step #16 stops fail-stopping the ~60-gate tail (`ci-linux-open-item.md` CI-5).

## §Provenance (the folded root causes + the booked follow-up)

- `ci-linux-open-item.md` — THE decisive input, wave-ready: the exact root cause (the
  trigger TEXT lags the route via the mounted scene component's `extraControlTabs`, §2), the
  cure spec (the `navToScene(page, sceneId, expectedTrigger, {timeout})` primitive, §4.2), why
  the reverted escape-hatch was a STRUCTURAL no-op (§3 — `waitForFunction(trigger-present)` is
  satisfied immediately by the SOURCE scene's stale trigger), the EXPECT-table feasibility (§4.1
  — the gate already owns the per-destination labels), the sibling that carries the IDENTICAL
  race (§4.4 — `scene-transition-perf`), and the never-run Linux tail with its per-gate
  env-coupling risk (§5). This is the one explicitly-booked I follow-up (memory
  `project_ci_was_dead_and_deploy_creds.md §"OPEN follow-up — CI-on-Linux gate-robustness"`).
- `wave-I.WZ-postclose.md` — the 8-commit post-close tail with NO tranche-structural home
  (§A `f93e731..4072af9`, all 2026-06-09); the deploy-block CHAIN verified exactly (§F finding
  (e): `scene-control-dfa flake → demo-smoke FAILS → ci conclusion=failure → deploy-pages
  workflow_run gate false → auto-deploy NEVER fires`); `scene-control-dfa` is a REAL PRODUCT
  BUG masquerading as a CI flake (§C — the control-surface projection LAGS the route under
  load; a real loaded device shows the panel briefly empty/wrong after a dock switch); the
  GH-secrets verify (§F finding (f) — the kf-owned deploy story is whole in-workflow, but the
  06-09 bypass pulled creds from a sibling `.env`; J must confirm the repo secrets exist + match).
- `ci-cd.md` — the demo-smoke job MAP (§2 — the ordered step list; `scene-control-dfa` at
  `ci.yml:321`, position #16, before ~50 gates that have NEVER executed on Linux), the 20-minute
  wall-clock budget VALIDATION owed (§8 / CICD-7 — ~55 cold-chromium launches, the budget is
  UNVALIDATED because the job has never run to completion on Linux), and the device-INDEPENDENCE
  boundary that forbids demoting `scene-control-dfa` to observe-only (§5 / CICD-1 — the rendered
  control-set per scene is device-independent; the cure is DETERMINISM, not silencing).
- `final-vs-tree-inv-epsilon.md` INVE-1 — the I FINAL's "merge → green CI → CF auto-deploys"
  claim was STRUCTURALLY IMPOSSIBLE when written (CI was YAML-invalid since H; first parse-valid
  run only 2026-06-09 post-close). J.W0 is the wave that exists to MAKE that claim true — the
  charter's two named inv-ε FINAL gaps are exactly what J.W0 (deploy) and J.W4 (axes) cure
  (`J.md §ENFORCEMENT`).
- `I-WZ-verify.md:344-348` — the in-tree booking of the per-expected-state settle (the IMPL
  addendum that narrates the tail but leaves `scene-control-dfa` **"STILL OPEN"**); the revert
  commit `feb39c3` body is the product-bug witness in kf's own git log.

## §The state, verified (file:line / live anchors / command+output)

- **The gate's racy primitive (post-revert baseline):** `scripts/proof-scene-control-dfa.mjs:211-229`
  — `navByHash(page, sceneId, settleMs = 1600)` sets `location.hash`, waits on the EARLY
  localStorage `activeScene` fact (`:217-227`, `{timeout:8000}`), then `await page.waitForTimeout(settleMs)`
  (`:228`) — a FIXED settle after the early fact, asserting nothing about whether the destination
  surface actually projected. `MACHINE_KEY = "keyframes-js-scene-machine"` (`:179`).
- **The empirical Linux failure (CI run `27228309606`, the WZ deploy commit, latest on master):**
  `gh run view 27228309606 --log-failed` →
  `✗ D3 easing — got {panel:true, trigger='null', triad:false} expected {trigger:"Easing"…}`;
  `✗ D3 spring — got {panel:true, trigger='null'…}`; `✗ D4 [cube→easing] / [sequence→easing] /
  [motion-path→spring] / [cube→spring] — trigger='null'`; `proof:scene-control-dfa — FAIL (6) …
  exit code 1` (`ci-linux-open-item.md §1`). DECISIVE: `panel:true` and `triad:false` in EVERY
  failure — the control-surface SET is correct (panel present, no stale built-in triad); ONLY
  the trigger TEXT is `null` (the destination's label had not yet projected). This is the
  born-RED witness shape (§Hard gate).
- **The trigger-lag chain (the PRODUCT-half root cause), confirmed against the tree:**
  | Layer | file:line | settle timing |
  |-------|-----------|---------------|
  | `location.hash = "#/spring"` | gate | t0 |
  | reducer writes `activeScene` SYNCHRONOUSLY + persists localStorage | `sceneMachine.ts` (NAVIGATE) → `useSceneMachine.ts:126-129` | **t0+ε — what `navByHash` waits on** |
  | `currentSceneId = machine.activeScene.value` | `demo/app/App.vue:199` (`const currentSceneId = computed(() => machine.activeScene.value)`) | t0+ε |
  | `controlSurfaces` projection (the SET) | `useSceneMachine.ts:233-237` + `ChromeDock.vue` | t0+ε (reactive on activeScene) — **why `panel:true`/`triad:false` is already right** |
  | `<Suspense>` resolves → destination scene COMPONENT mounts → `sceneRef` re-binds | App scene host | **t0 + MOUNT (the lag)** |
  | `:extra-control-tabs="sceneRef?.extraControlTabs ?? []"` updates | `demo/app/App.vue:11` (CONFIRMED) | t0 + MOUNT |
  | easing/spring inject `{value:"easing"/"spring", label:"Easing"/"Spring"}` | `EasingScene.vue:45-47`, `SpringScene.vue:80-83` (CONFIRMED: `extraControlTabs = computed(() => [{ value:"easing", label:"Easing"… }])`) | t0 + MOUNT |
  | `allControlTabs = builtIn ∪ extraControlTabs` → trigger text = `"Spring"` | `ChromeDock.vue:74-80` (CONFIRMED: `props.extraControlTabs ? [...builtIn, ...props.extraControlTabs] : builtIn`) | **t0 + MOUNT + flush** |
  So `activeScene` is the EARLY fact; the destination trigger text is the LATE fact, gated on
  the destination scene component's mount + its `extraControlTabs` re-bind THROUGH `sceneRef`.
  The fixed `settleMs=1600` is a GUESS at "MOUNT + flush"; it suffices on a fast unloaded box
  (local PASS, by luck), under-settles on GitHub's shared 2-core headless runner → trigger
  still `null` → RED. cube/amiga/square are IMMUNE because `"Controls"` is the built-in triad
  default, present the moment `controlSurfaces` projects (t0+ε), independent of any
  `extraControlTabs` injection (`ci-linux-open-item.md §2`).
- **Why the escape-hatch (`66855c2`) was a structural no-op:** it added
  `waitForFunction(trigger PRESENT || no-panel)` — which returns IMMEDIATELY because on a
  cube→spring transition the SOURCE scene's `[aria-label='Controls tab']` trigger is STILL
  mounted (the gate logs `panel:true` at the failure moment). The predicate asks "is ANY
  trigger present" — it is, the STALE one — never "is the DESTINATION's trigger present". A
  settle predicate keyed on EXISTENCE is structurally blind to a TRANSITION because the
  source's DOM persists through the swap. The revert (`feb39c3`) correctly removed the mask and
  booked the per-EXPECTED-state cure (`ci-linux-open-item.md §3`).
- **The sibling carrying the IDENTICAL race:** `scripts/proof-scene-transition-perf.mjs:177`
  (`MACHINE_KEY` duplicated) + `:203-221` (`navByHash` byte-for-byte, fixed `settleMs=1500`,
  `activeScene`-only wait). It has NOT bitten only because its oracle reads localStorage
  `selectedControl`, not the DOM trigger; it is already `IN_CI` observe-only (`:79-81`) so it
  cannot RED — but its OBSERVED p95 is garbage under a race (`ci-linux-open-item.md §4.4`,
  CI-3).
- **`demo-driver.mjs` has NO scene-nav primitive:** `grep -n "export " scripts/lib/demo-driver.mjs`
  → `SCENES` (`:244`), `resolveChromium()` (`:261`), `serveDist()` (`:293`), `openControlsPanel()`
  (`:335`), `subjectRect()` (`:419`) — NO `navToScene`, NO `SCENE_MACHINE_KEY`. Every
  transition-driving gate copy-pastes its own `navByHash` + `MACHINE_KEY` literal
  (`ci-linux-open-item.md §4.3`, CI-4).
- **The deploy-block CHAIN (verified exactly):** `deploy-pages.yml:42-46` fires iff
  `github.event.workflow_run.conclusion == 'success' && head_branch == 'master' && event == 'push'`
  (CONFIRMED). The `ci` workflow has TWO jobs — `gates` (`ci.yml:48`) and `demo-smoke`
  (`ci.yml:188`, `timeout-minutes: 20` `:191`); `demo-smoke` has NO `needs:` and NO
  `continue-on-error` (`grep -c continue-on-error ci.yml` → 0, CONFIRMED). So a `demo-smoke`
  failure → `ci` conclusion `failure` → the `deploy-pages` `if` is false → auto-deploy never
  fires. `proof:scene-control-dfa` is at `ci.yml:321` (CONFIRMED), `scene-transition-perf` at
  `:337`; the job fail-stops there, so EVERY gate after #16 has NEVER executed on Linux
  (`ci-cd.md §2`, `wave-I.WZ-postclose.md §F`, CI-5).
- **The kf-owned deploy story:** `deploy-pages.yml:66-68` — `CLOUDFLARE_API_TOKEN` +
  `CLOUDFLARE_ACCOUNT_ID` from GH repo secrets → `bash scripts/pages-deploy.sh` (CONFIRMED).
  The design is whole in-workflow; only the SECRET EXISTENCE is unverified (cannot be read from
  the tree). The 06-09 bypass pulled creds from a sibling `.env` (account `07119f…`,
  `fourier-analysis/.env`) — a one-time emergency, NOT the design (`wave-I.WZ-postclose.md §F`
  finding (f), `ci-cd.md §3`, memory `project_ci_was_dead_and_deploy_creds.md`).
- **The 8-commit post-close tail** (`git log --oneline a4b1472..master`, all 2026-06-09, CONFIRMED):
  `f93e731` (YAML fix) · `c48d577` (ci-coverage yaml-valid clause) · `c10e2b4` (occlusion-gate
  inv δ) · `196ec2f` (perf-frame-budget + scene-transition-perf observe-only) · `166aa42`
  (demo-fonts Fallback exclude + visual-lock observe-only) · `66855c2` (the escape-hatch) ·
  `feb39c3` (the REVERT) · `4072af9` (docs — deploy EXECUTED + CI-on-Linux follow-up). NO wave
  file, NO FINAL §, NO PROGRESS row OWNS this tail (`wave-I.WZ-postclose.md §A`).

## §Goal

Make the deploy boundary tell the TRUTH: a real master push earns an OBSERVED clean round-trip
— **green CI (`demo-smoke` end-to-end GREEN on the Linux runner, `scene-control-dfa` included,
ZERO escapes) → `deploy-pages.yml` auto-fires → the live site serves the pushed bytes** — and
the booked I tail gets its terminal home. Five moves, each at the gestalt altitude the mandate
demands (NO longer `settleMs`, NO `continue-on-error`, NO `IN_CI` escape on a correctness gate —
the gate is made DETERMINISTIC, not silenced; the PRODUCT lag is fixed at its single-authority
seam, not papered):

1. **Adopt the tail (S1):** the 8 post-close commits get a real wave home with a terminal
   disposition table — P-invariant-28, no perpetual punt.
2. **The gate primitive (S2):** `navToScene(page, sceneId, expectedTrigger, {timeout})` lands
   in `scripts/lib/demo-driver.mjs` — the wait predicate is the PER-EXPECTED destination state
   (the destination trigger TEXT == the destination's expected label; trigger-ABSENT for
   panel-less scenes), a CEILING timeout, load-independent BY CONSTRUCTION. Both `scene-control-dfa`
   and `scene-transition-perf` migrate onto it; their hand-rolled `navByHash`/`MACHINE_KEY` die.
3. **The PRODUCT half (S3):** the dock trigger projection is made BORN-CORRECT from the DFA —
   the I.W2 single-authority extended to the control-surface PROJECTION, so the trigger never
   renders the SOURCE scene's stale label during a transition. The gate fix REMOVES the timing
   race; the product fix REMOVES the lag the gate caught — both land, the gate is deterministic
   because the surface is born-correct, not because the wait is generous.
4. **The credentials + the sanctioned path (S4):** `gh secret list` confirms the GH repo
   secrets exist (names only) + the sanctioned `deploy-pages.yml → pages-deploy.sh` path is
   re-stated as the ONLY deploy mechanism (the sibling-`.env` bypass is retired).
5. **The never-run Linux tail (S5):** the ~60-gate tail is triaged under P6 (the CI
   device-independence boundary) AS each gate surfaces — device-independent → fix-deterministic-
   or-hard; device-dependent → observe-only/runner-calibrated via the ONE shared seam (J.W3
   owns the helper; J.W0 consumes the posture). The 20-minute wall-clock is VALIDATED on the
   first complete Linux run (CICD-7).

## §Scope

- **S1 — formal adoption of the 8-commit post-close tail (docs disposition; the terminal home).**
  The 7 non-merge commits landed AFTER `FINAL.md` was committed (`6a0abe9`, pre-merge); only the
  `4072af9` addendum INSIDE an IMPL doc narrates them, and it leaves `scene-control-dfa` "STILL
  OPEN" (`wave-I.WZ-postclose.md §A`). This wave is their tranche-structural home. The terminal
  disposition table (recorded here, propagated to J's `PROGRESS.md`):

  | commit | what | terminal disposition (J home) |
  |---|---|---|
  | `f93e731` | ci.yml YAML fix — 2 step `name:` quoted (the colon-space class that 0s-rejected the whole workflow since H.W12) | **RE-AFFIRM** — the YAML-dead root cause is correctly diagnosed + fixed; J.W0 cites the FIRST green CI run as the inv-ε observation (`wave-I.WZ-postclose.md §B` finding (b2)). |
  | `c48d577` | `proof:ci-coverage` gains the yaml-valid clause (clause −1, real `yaml` parser + regex fallback) | **RE-AFFIRM** — sound gate-of-the-gate (`ci-cd.md §1`). The `yaml`-package ELSPROBLEMS fragility is a BOOK → **J.W3** (declare devDep or accept the regex contract — `wave-I.WZ-postclose.md` finding (b1)); NOT this wave's scope. |
  | `c10e2b4` | occlusion-gate inv δ — easing subject = the sweeping hero ball | **RE-AFFIRM** — the redesigned oracle (`sweepingSubject` flag) is the right call; verified honest (`ci-linux-open-item.md §6`). |
  | `196ec2f` | perf-frame-budget + scene-transition-perf → CI observe-only | **RE-AFFIRM the posture, FOLD the seam** — the device-dependence boundary is correct; the ad-hoc triplicated `IN_CI` literal is **J.W3**'s single-seam fold. `scene-transition-perf`'s `navByHash` race is THIS wave's S2 migration. |
  | `166aa42` | demo-fonts Fallback exclude (unconditional) + visual-lock observe-only | **RE-AFFIRM the posture, FOLD the seam** — the Fallback exclusion is defensible; the tier-decision + the single `IN_CI` seam are **J.W3** (`wave-I.WZ-postclose.md §D`). |
  | `66855c2` | the escape-hatch (waited on the stale trigger) | **SUPERSEDED-BY-S2** — the structural no-op (§3); its correct replacement is this wave's `navToScene` per-expected predicate. RECORD historical. |
  | `feb39c3` | the REVERT of `66855c2` | **RE-AFFIRM** — the revert correctly removed the mask + booked the per-expected cure; `git diff a4b1472 master -- scripts/proof-scene-control-dfa.mjs` is EMPTY (clean revert to the merge baseline). This wave discharges the booking. |
  | `4072af9` | docs — deploy EXECUTED + CI-was-never-running discovery + the CI-on-Linux follow-up | **DISCHARGED-BY-J.W0** — the follow-up it books IS this wave; INVE-1 (the deploy-claim gap) is RECORD-cured by this wave's observed round-trip oracle. |

  Plus the two stale-doc reconciliations (`wave-I.WZ-postclose.md §G`): the `I.WZ.md` spec's
  `DEFERRED-BY-USER` disposition of `d469e69` was SUPERSEDED-BY-FIX-SHIP (the FINAL is
  authoritative; the tree disambiguates) — **RECORD** in J's PROGRESS so a future reader does
  not believe the broken demo was knowingly left live; `PROGRESS.md §0`'s stale revert
  recommendation — **RECORD, do not re-propagate** (the FINAL discloses it). **WHY:** the tail
  is REAL CI/deploy-hardening work with no structural home; P-invariant-28 forbids the
  perpetual punt — every commit exits with a terminal disposition here.

- **S2 — the `navToScene` per-EXPECTED-state primitive + both gate migrations (the harness
  transposition for ELEGANCE/SIMPLICITY; the gate-determinism half).** Locus: NEW export in
  `scripts/lib/demo-driver.mjs` (the single-sourced driver, the convergence point both lanes
  already import). The primitive (`ci-linux-open-item.md §4.2`):

  ```js
  // navToScene — drive a hash-nav transition + WAIT for the DESTINATION's control-surface
  // to PROJECT (per-EXPECTED-state settle, NOT a fixed settleMs / any-trigger-present). The
  // control-tab trigger TEXT lags the route via the mounted scene component's extraControlTabs
  // (App.vue:11). Load-INDEPENDENT: the timeout is a CEILING, returns the instant the surface
  // projects (fast box), spends the budget only on a slow runner.
  // @param expectedTrigger  the destination's control-tab label, or null when the scene has
  //                         no control panel (home/sequence/motion-path).
  export async function navToScene(page, sceneId, expectedTrigger, { timeout = 12000 } = {}) {
      await page.evaluate((s) => { location.hash = "#/" + s; }, sceneId);
      // 1. machine activeScene rests on target (the EARLY fact — necessary, not sufficient).
      await page.waitForFunction(
          ([mk, id]) => { try { return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === id; } catch { return false; } },
          [SCENE_MACHINE_KEY, sceneId], { timeout },
      ).catch(() => {});
      // 2. the DESTINATION control surface has PROJECTED (the LATE fact — the cure).
      await page.waitForFunction(
          (expected) => {
              const trig = document.querySelector("[aria-label='Controls tab']");
              const text = trig?.textContent?.trim() || null;
              return expected === null ? !trig : text === expected;
          },
          expectedTrigger, { timeout },
      ).catch(() => {});
  }
  ```

  **The predicate is per-DESTINATION, not global-unique:** cube/amiga/square all → `"Controls"`
  (the built-in default — the predicate is satisfied at t0+ε, CORRECT, the trigger genuinely
  never changes text and the SET-correctness is what the oracle then asserts); the FLAKY pairs
  (→easing/→spring) change the label (`"Controls"`→`"Spring"`), so the predicate genuinely WAITS
  for the projection (`ci-linux-open-item.md §4.1`). The EXPECT table the gate ALREADY owns IS
  the expected-label source — `scripts/proof-scene-control-dfa.mjs:185-193` (verified):
  `cube/amiga/square: {hasPanel:true, trigger:"Controls"}`, `easing: {trigger:"Easing"…}`,
  `spring: {trigger:"Spring"…}`, `sequence / motion-path: {hasPanel:false}`. **Timeout policy:**
  ONE generous CEILING (12s) for BOTH waits — NOT a CI-scaled `Math.max(settleMs, 3500)` (the
  `66855c2` mistake of scaling a FIXED wait). A `waitForFunction` ceiling is load-independent: it
  returns the instant the predicate holds. The `.catch(() => {})` keeps the oracle HONEST — if
  the surface genuinely never projects within 12s, the wait expires and the gate's EXISTING
  assertion reads the real (wrong) DOM and reds. **NO oracle relaxation:** a real missing/wrong
  trigger STILL bites; only the timing race is removed (`ci-linux-open-item.md §4.2/§7`).

  **The two migrations:**
  - `scene-control-dfa.mjs` — replace the D3/D4 `navByHash(page, id)` call sites with
    `navToScene(page, id, EXPECT[id].hasPanel ? EXPECT[id].trigger : null)`; the D4 matrix loop
    `navByHash(from); navByHash(to)` → `navToScene(from, …); navToScene(to, …)`. DELETE the local
    `navByHash` (`:211-229`) + `MACHINE_KEY` (`:179`); re-export `SCENE_MACHINE_KEY` from the
    driver. Net: −18 lines local, +1 shared primitive (no-legacy: the hand-rolled copy dies WITH
    the consolidation).
  - `scene-transition-perf.mjs` — fold its inter-sample `navByHash` (`:203-221`) onto `navToScene`
    too; DELETE its `MACHINE_KEY` (`:177`). Its `measureTransition` rAF×2 settle (`:226-246`) is
    FINE — only the inter-sample nav needs the swap. It stays `IN_CI` observe-only; the swap makes
    the OBSERVED p95 honest under load (`ci-linux-open-item.md §4.4`, CI-3).

  > **The lib HOME (cross-wave seam, BINDING):** `navToScene` + `SCENE_MACHINE_KEY` land in
  > `scripts/lib/demo-driver.mjs` — the SAME lib J.W3 owns for the `withPage`/`withBrowser`
  > lifecycle + the `serveDist`/MIME/chromium consolidation. J.W0 AUTHORS the primitive (it is
  > the consumed dependency); J.W3 INDUSTRIALIZES the lib around it under the net-deletion rule.
  > Every OTHER transition-driving gate (`grep -rln "location.hash = " scripts/`) inherits the
  > per-expected-settle for free in J.W3's migration — one settle authority, no per-gate
  > guess-the-`settleMs`. **WHY (transposition):** a settle predicate keyed on a fixed time is a
  > load-DEPENDENT correctness oracle; the per-expected predicate asserts the PRODUCT PROPERTY
  > ("the destination control surface has projected") through the human's surface (the dock
  > trigger text) — the I-born gate-ORACLE precept, now at the deploy boundary.

- **S3 — the PRODUCT half: the dock trigger projection born-correct from the DFA (the
  single-authority extended; the engine/demo seam, inv-16 UNFENCED on the product).** Locus: the
  `App.vue:11 → sceneRef → extraControlTabs` mount chain (`demo/app/App.vue`) +
  `ChromeDock.vue:74-80` (`allControlTabs`). **Root-cause confirmation step FIRST (born-RED
  discipline):** before any product edit, re-confirm the lag chain LIVE on the BUILT
  `dist/gh-pages/` — drive a `cube→spring` hash-nav and sample the trigger text across the mount
  window; assert it is `null`/`"Controls"` (the SOURCE label) for a window AFTER `activeScene`
  rests on `spring` (the `ci-linux-open-item.md §2` chain: `App.vue→sceneRef→EasingScene/
  SpringScene.extraControlTabs→ChromeDock.allControlTabs`). This proves the projection lags the
  route — a real loaded device shows the panel briefly empty/wrong after a dock switch
  (`wave-I.WZ-postclose.md §C`). THEN the cure: the destination scene's control-surface
  projection must settle SYNCHRONOUSLY with the route transition (or be render-suppressed until
  the destination commits), so the trigger NEVER renders the SOURCE scene's stale label
  mid-transition. The seam is the I.W2 single-authority (`I.W2 §S1` — the SELECTED control
  surface single-sourced from the scene machine's control-surface DFA, born-correct on every
  entry): I.W2 made the SELECTED-surface model-value machine-projected; J.W0 EXTENDS that to the
  dock's control-tab PROJECTION — the `extraControlTabs` for the destination are a DERIVABLE
  function of the machine's `activeScene` (the same `controlSurfacesFor(activeScene)` projection
  the DFA already owns for the valid SET), NOT a value that arrives a tick LATE through the
  `sceneRef.extraControlTabs` re-bind on `<Suspense>` mount. Bind the dock's `extraControlTabs`
  to the machine-projected source so the trigger label is correct on the very tick `activeScene`
  rests on the destination — fresh and switched paths converge. **WHY:** the I.W2 §"single
  authority" claim is partially undercut by this lag (`wave-I.WZ-postclose.md §C`): the surface
  is single-SOURCED but the source LAGS the route via the component-mounted `extraControlTabs`.
  J.W0 closes that — the projection is born-correct, not late-correct. **NO workaround:** NOT a
  `nextTick` re-assert (the I.W2 §Design-decisions forbids the timing band-aid), NOT a
  `force-mount` of the stale trigger — the projection is machine-derived so the latch is taken
  correct.

  > **Boundary with J.W2 (BINDING):** J.W2 owns the `selectedControl` single-WRITER completion +
  > the CubeScene rogue-write death (DS-1, `J.md` J.W2 cluster). J.W0 owns ONLY the DOCK TRIGGER
  > PROJECTION born-correctness (the `extraControlTabs`/`allControlTabs` chain that the deploy
  > gate reads). Disjoint loci: J.W2 at the `<Tabs> :model-value` SELECTED-surface seam; J.W0 at
  > the dock `allControlTabs` PROJECTION seam. The product fix here is the minimal seam that makes
  > `scene-control-dfa` deterministic on the product side — it does NOT subsume J.W2's broader
  > single-writer pass. If the IMPL finds the two are the same edit, J.W0's product half lands
  > FIRST (it is the deploy P0) and J.W2 verifies it; if disjoint, each is named in its wave.

- **S4 — GH secrets VERIFY (names only) + the sanctioned deploy path re-statement (VERIFY-ONLY).**
  Run `gh secret list` against the kf repo and confirm `CLOUDFLARE_API_TOKEN` +
  `CLOUDFLARE_ACCOUNT_ID` EXIST as repo secrets (NAMES only — never read or print the values).
  Re-state the sanctioned deploy path as the ONLY mechanism: `deploy-pages.yml` (on green-CI
  `workflow_run`) → `scripts/pages-deploy.sh` (the constellation spine: project pre-flight +
  rollback-target capture + ASCII commit-message sanitisation + `wrangler pages deploy`),
  consuming the GH repo secrets — `deploy-pages.yml:66-68` (verified). The sibling-`.env` bypass
  (`fourier-analysis/.env`, account `07119f…`) is RETIRED — it was a one-time emergency forced by
  the dead CI, NOT the design (`wave-I.WZ-postclose.md §F` finding (f), `ci-cd.md §3`). **WHY:**
  the kf-owned deploy story is whole in-workflow; the ONLY open verification is that the secrets
  exist + point at the SAME CF account as the live `keyframes` project, so the auto-path works
  the instant S2+S3 unblock `demo-smoke`. **Do NOT touch secret values** (USER-DOMAIN; the secret
  configuration, if absent, is a confirm-first USER action). The CNAME/DEP-1 confirm is OUT
  (deploy-repo-owned; J.W6 confirms DEP-1 only).

- **S5 — the never-run Linux tail triage protocol (P6 applied per gate AS it surfaces; CICD-7
  budget validation).** Once S2+S3 green `scene-control-dfa`, the ~60-gate tail (`ci-cd.md §2`,
  `ci-linux-open-item.md §5`) executes on Linux for the FIRST TIME — a SECOND wavefront of
  env-coupling. The triage is NOT a one-shot fix list; it is a PROTOCOL applied to each gate AS
  it surfaces, under the **P6 boundary** (`J.md §invariants`: CI hard-gates device-INDEPENDENT
  correctness; device-DEPENDENT measurements hard-gate ON-DEVICE, run OBSERVE-ONLY in CI, posture
  DECLARED per-gate through the ONE shared helper):
  - **device-INDEPENDENT** (computed CSS, geometry containment, DOM membership, the rendered
    control set — the bulk of the layout/grid/idiom/bezier/dock gates, `ci-linux-open-item.md §5`
    rows tagged NONE/LOW) → if it reds on Linux, the fix is DETERMINISM (a per-expected settle, a
    font-load wait, a real product fix) or it HARD-gates — NEVER a demote. Font-metric-driven
    layout asserts (`hero-rung` px floor, `single-column-pack`/`label-subgrid` ±px, every bbox
    gate; Linux fontconfig + webfont-load timing ≠ macOS — the §5 HIGH-suspicion class) are made
    DETERMINISTIC (await the webfont before the bbox read), not relaxed.
  - **device-DEPENDENT** (throttled frame budgets, cross-OS pixel diffs, absolute timing) →
    observe-only or runner-calibrated, DECLARED through J.W3's single `IN_CI` seam. The two
    FLAGGED gates NOT in the current `IN_CI`-grep hit set — `proof:scene-perf-budget` and the
    `LoAF >50ms` trace gate (`ci-linux-open-item.md §5/§6` FLAG, `ci-cd.md §5`) — MUST have their
    CI posture confirmed BEFORE J relies on them; if they HARD-RED on Linux GPU/raster/CPU
    differences they take the device-dependent posture (observe-only, or LoAF's runner-calibrated
    stress-size with the absolute threshold unchanged, `ci-cd.md §5` posture 2).
  - **CICD-7 — the 20-minute wall-clock VALIDATION:** the `demo-smoke` `timeout-minutes: 20`
    (`ci.yml:191`, verified) is UNVALIDATED — ~55 cold-chromium launches × (launch + serve +
    settle) + install/build overhead, and the job has NEVER run to completion on Linux. The FIRST
    complete Linux run BINDS the real wall-clock; if it exceeds 20m, the J.W3 harness
    (`withPage`/`withBrowser` + one shared chromium+server) is the net-deletion mechanism that
    cuts it — MEASURE-FIRST, do NOT pre-optimize (`ci-cd.md §8`, CICD-7). **WHY:** the tail is the
    second wavefront; the cure unblocks it but does not certify it green — it has literally never
    run. The protocol prevents the §No-workaround failure mode (a panicked `continue-on-error` to
    "get past" a freshly-surfaced red).

## §Hard gate (the proof:* that BITES — born-RED on CI run `27228309606`, GREEN-on-fix · the boundary-ORACLE deploy oracle)

**The boundary oracle (per J.md's boundary-ORACLE extension — the DEPLOY oracle):** the
correctness oracle ACTUATES the running deploy pipeline, not a proxy. **One OBSERVED clean
round-trip:**

> **a real master push → green CI (`demo-smoke` end-to-end GREEN on the Linux runner,
> `scene-control-dfa` included, ZERO escapes) → `deploy-pages.yml` auto-fires via the
> `workflow_run`-on-`push` arm (`:42-46`, NOT the `workflow_dispatch` arm) → the live site
> (keyframes.babb.dev) serves the PUSHED bytes** — observed, recorded with the run id, the
> deploy run's TRIGGER (`event_name == 'workflow_run'`), and the served-build hash; no manual
> `wrangler` bypass AND no `workflow_dispatch` substitute (a GH-native manual dispatch is a
> DIFFERENT manual path — it proves bytes can be served, never that the auto-chain fires).

This is the boundary-ORACLE's first oracle (`J.md` inv "the boundary-ORACLE extension": the
DEPLOY oracle is an observed green-CI → auto-deploy round-trip serving the certified bytes). It
is composed of the named-boundary corroborators below; the round-trip is the CORRECTNESS oracle,
the gate clauses are its actuating components.

- **clause (a) — `proof:scene-control-dfa` GREEN on the Linux runner via `navToScene`, ZERO
  escapes (the deterministic gate; CORRECTNESS).** The D3 per-scene + D4 navigation-matrix legs
  run over BUILT `dist/gh-pages/` on the Linux substrate; every transition uses
  `navToScene(page, id, EXPECT[id].hasPanel ? EXPECT[id].trigger : null)`. Assert ZERO failures
  across the matrix — specifically the SIX `27228309606` failures (`D3 easing`, `D3 spring`,
  `D4 [cube→easing]`, `[sequence→easing]`, `[motion-path→spring]`, `[cube→spring]`) all GREEN,
  `triggerText === EXPECT[dest].trigger` for every destination. **BORN-RED WITNESS:** the gate
  is RED on the recorded CI run `27228309606` failure shape — `{panel:true, trigger='null',
  triad:false}` under load (the destination label not yet projected) — BEFORE the cure. **BITE:**
  reds on the pre-cure tree under load (the fixed `settleMs=1600` under-settles on the 2-core
  runner); greens on S2 (the per-expected predicate returns the instant the projection commits)
  + S3 (the projection is born-correct so the predicate holds at t0+ε). **NO escape:** there is
  NO `IN_CI` branch, NO `continue-on-error`, NO `settleMs` bump — the gate is made DETERMINISTIC,
  not silenced (the rendered control-set per scene is device-INDEPENDENT — `ci-cd.md §5` CICD-1).
- **clause (b) — the product projection is born-correct mid-transition (the PRODUCT half, the
  no-silent-no-op guard; CORRECTNESS).** On the BUILT dist, drive a `cube→spring` hash-nav and
  sample the dock trigger text across the mount window (the `ci-linux-open-item.md §2` chain).
  Assert: from the tick `activeScene` rests on `spring`, the trigger text is NEVER the SOURCE
  label (`"Controls"`/`null`) — it projects `"Spring"` synchronously with the route, never the
  stale source label. **BITE:** reds on the pre-cure tree (the trigger lags via the
  `sceneRef.extraControlTabs` re-bind on `<Suspense>` mount — `App.vue:11`); greens on S3 (the
  machine-projected `extraControlTabs`). **This is the no-silent-no-op guard:** a gate-only fix
  that makes `navToScene` wait LONGER while leaving the product lag live would still let a real
  loaded user see the stale label — this clause reds on that, forcing the PRODUCT fix.
- **clause (c) — the auto-deploy round-trip is OBSERVED end-to-end via the `workflow_run`-on-push
  arm (the boundary oracle itself; CORRECTNESS).** On a real master push (or the J.WZ close merge,
  where this is RE-observed): the `ci` workflow concludes `success` (BOTH `gates` and `demo-smoke`
  green on Linux — the `demo-smoke` tail runs to completion within the validated wall-clock),
  `deploy-pages.yml`'s `workflow_run` `if` evaluates true (`conclusion=='success' &&
  head_branch=='master' && event=='push'`, `:42-46`), the `deploy` job runs
  `scripts/pages-deploy.sh`, and the live site serves the pushed `head_sha`'s bytes (the
  served-build hash == the pushed tree's `dist/gh-pages/assets/index-*.js`). **The observed deploy
  run MUST have been triggered by the AUTO arm:** `deploy-pages.yml:42-46` is a TWO-arm `if`
  (`github.event_name == 'workflow_dispatch' || (conclusion=='success' && head_branch=='master' &&
  event=='push')`); a `workflow_dispatch` deploy ALSO serves bytes (and the deploy job's
  `github.ref`/`github.sha` fallbacks, `:29/:52`, handle the dispatch path) — so this clause
  asserts the recorded deploy run's TRIGGER is the `workflow_run`-on-`push` disjunct, NOT
  `workflow_dispatch`. Record the CI run id, the served hash, AND the deploy run's `event_name`
  (must read `workflow_run`, with `workflow_run.event == 'push'` in the run metadata) — proving
  the AUTO chain fired, not a manual GH-native dispatch. **BITE:** the chain is RED today —
  `scene-control-dfa` flakes → `demo-smoke` fails → `ci` conclusion `failure` → the
  `workflow_run`-on-push arm is false → NO auto-deploy (the 06-09 ship was a MANUAL bypass). A
  `workflow_dispatch`-triggered run that serves bytes does NOT discharge this clause — it leaves
  the auto-fire-on-push path (the actual P0 silent-no-deploy hazard) UNTESTED, the vacuity window
  this clause exists to close. Greens when (a) makes `demo-smoke` deterministic, the tail (S5)
  runs green within budget, and the `workflow_run`-on-push deploy is observed firing. **This is
  the inv-ε cure for INVE-1** — the I FINAL's "merge → green CI → CF auto-deploys" claim becomes
  TRUE because the AUTO round-trip is OBSERVED, not asserted.
- **clause (d) — the GH secrets exist + the sanctioned path is the only mechanism (boundary
  corroborator; HYGIENE — labeled).** `gh secret list` shows `CLOUDFLARE_API_TOKEN` +
  `CLOUDFLARE_ACCOUNT_ID` present (names only, values never read); `deploy-pages.yml` consumes
  them via `scripts/pages-deploy.sh` (`:66-68`); no sibling-`.env` reference remains in the
  deploy path. **BITE:** would red if a required secret is absent (the auto-path would fail at the
  `wrangler` step). *(Labeled HYGIENE per the two-tier taxonomy — it CORROBORATES the round-trip
  oracle (c) but does not by itself certify the deploy; clause (c) is the CORRECTNESS oracle. The
  secret CONFIGURATION, if absent, is a confirm-first USER-DOMAIN action — J.W0 VERIFIES, never
  writes secret values.)*
- **clause (e) — `scene-transition-perf` observes an HONEST p95 via `navToScene` (boundary
  corroborator; HYGIENE — labeled, observe-only).** The sibling gate's inter-sample nav uses
  `navToScene`; its OBSERVED transition p95 is recorded (not red — it is `IN_CI` observe-only by
  the device-dependent posture, `ci-linux-open-item.md §4.4`). **BITE:** the measurement is
  garbage under the pre-cure race (the sample reads a mid-transition surface); honest once the
  nav settles per-expected. *(Labeled HYGIENE/observe-only — it measures a device-DEPENDENT
  timing budget; it may NEVER red CI and may NEVER substitute for the correctness clauses (a)-(c).
  The migration de-vacuouses the measurement, not the gate's tier.)*

**The §spine bar — MUST bite.** Clauses (a)-(c) are the boundary-ORACLE deploy oracle: they
ACTUATE the running pipeline — the gate drives real hash-nav transitions through `navToScene`
over the BUILT dist on the LINUX substrate, the product clause reads the live mid-transition
trigger projection, and the round-trip clause OBSERVES a real green-CI → auto-deploy → served-bytes
chain. Each asserts an EXACT property (zero `scene-control-dfa` failures with no escape; the
trigger never renders the source label mid-transition; the live site serves the pushed
`head_sha`'s bytes). Revert S2 → (a) reds under load (the fixed settle races); revert S3 → (b)
reds (the projection lags) AND (a) flakes (the gate must wait the full ceiling, the product is
still wrong on a real device); revert either and the round-trip (c) is non-deterministic. **The
born-RED witness is CONCRETE:** the recorded CI run `27228309606` failure shape (`trigger='null'`
under load, six failures) — the gate is RED on that observed run BEFORE the cure and GREEN on the
Linux runner after. **Two-tier taxonomy:** the wave's GREEN depends on the RUNTIME/boundary
clauses (a)-(c); clauses (d) (secrets) and (e) (the observed-p95) are HYGIENE/observe-only
corroborators — they support the round-trip oracle but may NEVER substitute for a red correctness
clause. **P6 posture (declared):** clause (a) is a device-INDEPENDENT correctness gate (the
rendered control-set per scene) — it hard-gates on Linux; clause (e) is a device-DEPENDENT
measurement — observe-only in CI per the boundary. This is the headline-prerequisite gate of the
tranche: until it is green end-to-end on Linux, NO later wave's §Hard gate can be witnessed on the
CI substrate (the ~60-gate tail fail-stops at #16).

## §No-workaround prohibitions (BINDING — the mandate's named forbiddings for this wave)

- **NO `settleMs` bump.** The cure is the per-EXPECTED-state predicate with a CEILING timeout
  (load-independent by construction), NOT a longer fixed `settleMs`. A fixed settle is a
  load-DEPENDENT oracle that asserts only that N ms elapsed, never that the surface projected
  (`ci-linux-open-item.md §7`); `66855c2`'s CI-scaled `Math.max(settleMs, 3500)` is the EXACT
  mistake — scaling a fixed wait is still a fixed wait. The 12s timeout is a CEILING that returns
  the instant the predicate holds, never a wait that is spent.
- **NO `continue-on-error`.** `demo-smoke` has ZERO `continue-on-error` today (verified) and gains
  NONE — the tail must run to a real conclusion. A `continue-on-error` that "gets past" a
  freshly-surfaced Linux red (S5) is the panicked workaround the protocol exists to prevent; a
  red tail gate is fixed-deterministic-or-tier-declared, never skipped.
- **NO `IN_CI` escape on `scene-control-dfa`.** The gate's oracle (the rendered control-set per
  scene) is device-INDEPENDENT (`ci-cd.md §5` CICD-1) — it MUST hard-gate on Linux. Demoting it
  to `IN_CI` observe-only to paper over the flake is FORBIDDEN: a device-independent gate that is
  non-deterministic is a DETERMINISM bug in the gate (cured by S2) or a real PRODUCT bug (cured by
  S3) — fix the gate or the product, do NOT silence it. The `IN_CI` posture is legitimate ONLY
  for the device-DEPENDENT measurements (`scene-transition-perf`'s p95, clause (e)), declared
  through J.W3's single seam — never on a correctness gate.
- **NO sibling-`.env` deploy.** The sanctioned path is `deploy-pages.yml → pages-deploy.sh`
  consuming the GH repo secrets (S4). The `fourier-analysis/.env` bypass is retired; J.W0
  VERIFIES the repo secrets, never re-introduces the sibling dependency.
- **NO `workflow_dispatch` substitute for the observed round-trip.** The round-trip oracle
  (clause (c)) is discharged ONLY by a deploy run the AUTO `workflow_run`-on-`push` arm triggered
  (`deploy-pages.yml:42-46` second disjunct) — NOT by a manual GH-native `workflow_dispatch`
  deploy (the first disjunct, `:43`). A `workflow_dispatch` deploy is a DIFFERENT manual path than
  the retired `wrangler` bypass (GH-native, not sibling-`.env`) and the wording must close it:
  serving the `head_sha` bytes via a manual dispatch proves bytes CAN ship, never that the
  auto-chain fires on a green-CI push — the exact P0 silent-no-deploy hazard the oracle exists to
  test. The observed deploy run's `event_name` MUST read `workflow_run` (with
  `workflow_run.event == 'push'`), recorded from the GH run metadata.
- **NO `nextTick` re-assert on the product half.** S3 makes the projection born-correct from the
  machine (the I.W2 single-authority), NOT a timing band-aid after the fact (`I.W2
  §Design-decisions` — the `onMounted+nextTick` hack was correctly removed; re-adding it is the
  workaround we must not take).

## §Folds (every J.md-assigned fold, with its evidence citation)

- **CI-1** (scene-control-dfa flakes on Linux, `trigger='null'` under load) — S2 (the per-expected
  predicate) + S3 (the product projection born-correct). `ci-linux-open-item.md §1`, run
  `27228309606`. The born-RED witness (§Hard gate clause (a)).
- **CI-2** (the reverted escape-hatch was a structural no-op — waited on the SOURCE stale trigger)
  — SUPERSEDED-BY-S2; the per-expected predicate replaces the existence predicate.
  `ci-linux-open-item.md §3`, commits `66855c2`/`feb39c3`.
- **CI-3** (scene-transition-perf carries the IDENTICAL `navByHash` race) — S2 (folded onto
  `navToScene` in the same wave; the observe-only p95 made honest). `ci-linux-open-item.md §4.4`,
  clause (e).
- **CI-4** (demo-driver.mjs has NO scene-nav primitive — every gate copy-pastes `navByHash`) — S2
  (the single-sourced primitive in the lib). `ci-linux-open-item.md §4.3`; J.W3 industrializes
  the lib around it.
- **CI-5** (~60 demo-smoke gates have NEVER run on Linux; the job fail-stops at #16) — S5 (the
  triage protocol under P6) + clause (c) (the tail runs to completion in the round-trip).
  `ci-linux-open-item.md §5`, `ci-cd.md §2`.
- **CI-6 / the load-independence** (the local "by luck" green) — S2 (the per-expected predicate
  is load-independent locally too — a developer running `proof:all` alongside a build no longer
  gets a luck-green). `ci-linux-open-item.md §7`.
- **CICD-1** (the flaky HARD gate blocks the tail + auto-deploy; the product bug) — S2 + S3; keep
  HARD (device-independent), make deterministic, do NOT demote. `ci-cd.md §2/§5`.
- **CICD-2** (the auto-deploy chain dead/blocked; the cred story) — clause (c) (the observed
  round-trip) + S4 (the secrets verify). `ci-cd.md §9`, `wave-I.WZ-postclose.md §F`.
- **CICD-7** (the 20m demo-smoke budget UNVALIDATED) — S5 (the first complete Linux run binds the
  wall-clock; measure-first before any shard/share/cache). `ci-cd.md §8`.
- **The 8-commit tail** (no tranche-structural home) — S1 (the terminal disposition table).
  `wave-I.WZ-postclose.md §A`. P-invariant-28.
- **The GH-secrets verify** (the kf-owned deploy story vs the sibling-`.env` bypass) — S4
  (VERIFY-ONLY, names only). `wave-I.WZ-postclose.md §F` finding (f), `ci-cd.md §3`.
- **INVE-1** (the I FINAL's structurally-impossible deploy claim) — clause (c) (the observed
  round-trip RECORD-cures it). `final-vs-tree-inv-epsilon.md` INVE-1, `J.md §ENFORCEMENT`.
- **CI-7** (no `data-scene`/`aria-current` DOM marker; the optional `data-scene-ready` upgrade) —
  RECORD only; the trigger-text predicate is sufficient and adds zero product surface, so the
  born-RED-able attribute is NOT required (`ci-linux-open-item.md §4.1/§8` CI-7).

## §Hand-off / cross-wave boundaries (BINDING)

- **→ J.W3 (the lib, BINDING):** `navToScene` + `SCENE_MACHINE_KEY` land in
  `scripts/lib/demo-driver.mjs`; J.W3 owns the `withPage`/`withBrowser` lifecycle + the
  `serveDist`/MIME/chromium consolidation around it under the net-deletion rule, migrates every
  OTHER hash-nav gate onto the primitive, and owns the single `IN_CI` + per-gate DECLARED P6
  posture helper that S5's tail triage and clause (e) consume. J.W0 AUTHORS the primitive (the
  consumed dependency); J.W3 INDUSTRIALIZES.
- **→ J.W2 (the product, BINDING):** J.W0 owns ONLY the dock trigger PROJECTION born-correctness
  (the `extraControlTabs`/`allControlTabs` chain the deploy gate reads, S3); J.W2 owns the
  `selectedControl` single-WRITER completion + the CubeScene rogue write (DS-1). Disjoint loci;
  J.W0's product half lands FIRST (it is the deploy P0) and J.W2 verifies it does not regress.
- **→ J.WZ (the close, BINDING):** the auto-deploy round-trip (clause (c)) is RE-observed on the
  J.WZ close merge — the J.W0 oracle witnessed on the close itself (`J.md` J.WZ row: "the
  close merge's own CI run auto-deploys (the J.W0 oracle, re-witnessed on the close)").
- **OUT / sibling (do NOT touch):** the `yaml`-package ELSPROBLEMS fragility → J.W3 (declare
  devDep or accept the regex contract); the CNAME/DEP-1 confirm → J.W6 (deploy-repo-owned, verify
  only); the changeset/version cut + npm publish → J.W5/J.WZ (USER-DOMAIN, confirm-first, Mike
  Babb); the single `IN_CI` helper SEAM → J.W3 (J.W0 declares the POSTURE per the tail, J.W3
  builds the helper). The secret VALUES → USER-DOMAIN (J.W0 verifies names only).

## §Design decisions (trade-offs RESOLVED)

- **The cure is the per-EXPECTED-state predicate, NOT a longer settle — RESOLVED.** A fixed
  `settleMs` is a load-DEPENDENT oracle (asserts only elapsed time); the per-expected predicate
  asserts the PRODUCT PROPERTY (the destination surface projected) through the human's surface
  (the dock trigger text) — the gate-ORACLE precept. Load-independent by construction, on the CI
  runner AND under local concurrency (`ci-linux-open-item.md §7`).
- **BOTH the gate fix AND the product fix land — RESOLVED.** The gate fix (S2) removes the timing
  race; the product fix (S3) removes the lag the gate caught (a real loaded device shows the
  panel briefly empty/wrong after a dock switch — `wave-I.WZ-postclose.md §C`). A gate-only fix
  would make `scene-control-dfa` pass while leaving the product bug live; clause (b) reds on that.
  The gate is deterministic BECAUSE the surface is born-correct, not because the wait is generous.
- **The gate stays HARD (device-independent), NOT observe-only — RESOLVED.** The rendered
  control-set per scene is device-INDEPENDENT (`ci-cd.md §5` CICD-1); demoting it to `IN_CI`
  observe-only to paper over the flake is forbidden by the P6 boundary — a flaky device-independent
  gate is a determinism bug to FIX, not silence. Observe-only is legitimate only for the
  device-dependent p95 (clause (e)).
- **The product seam is the I.W2 single-authority extended, NOT a new mechanism — RESOLVED.** I.W2
  single-sourced the SELECTED control surface from the machine; J.W0 extends that to the dock
  trigger PROJECTION (the `extraControlTabs` derive from the machine's `activeScene`, not arrive a
  tick late through the `sceneRef` re-bind). The I.W2 "single authority" claim is partially
  undercut by this lag — J.W0 closes it (born-correct, not late-correct). NO `nextTick` band-aid.
- **The tail is a SECOND wavefront, triaged by PROTOCOL not a fix list — RESOLVED.** The cure
  unblocks the ~60-gate tail but does not certify it green — it has literally never run on Linux.
  Each surfaced gate is triaged under P6 (device-independent → deterministic-or-hard;
  device-dependent → observe-only/runner-calibrated through J.W3's seam); the 20m budget is
  validated on the first complete run, MEASURE-FIRST before any shard/share/cache (`ci-cd.md §8`).
  Do NOT assume the tail is green; do NOT panic-`continue-on-error` a freshly-surfaced red.
- **GH secrets are VERIFY-ONLY (names) — RESOLVED.** The kf-owned deploy story is whole
  in-workflow (`deploy-pages.yml → pages-deploy.sh`, GH repo secrets); the ONLY open verification
  is that the secrets exist + match the live CF account. J.W0 confirms names via `gh secret list`,
  never reads or writes values; the secret CONFIGURATION (if absent) is confirm-first USER-DOMAIN.
- **LEADS the tranche — RESOLVED.** The deploy boundary is the P0 hazard (a future master push can
  silently not deploy — the same class that froze the site H→I), and the `navToScene` primitive +
  the green-Linux CI are consumed by every later wave's verification. J put W0 first for the same
  structural reason I did (the headline-prerequisite); the difference is the ORACLE — I's W0 made
  the demo not throw; J's W0 makes the deploy boundary tell the truth.
