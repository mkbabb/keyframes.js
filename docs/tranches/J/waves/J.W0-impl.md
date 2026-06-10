# J.W0 — IMPL RECORD (the deploy boundary · S1–S4 LANDED locally · CI-substrate clauses OPEN until the master push)

- **Spec:** `J.W0.md` (BINDING). **Branch:** `tranche-j-dev`. **Date:** 2026-06-10.
- **Status:** S1 (tail adoption) + S2 (`navToScene` primitive + both gate migrations) + S3 (dock
  projection born-correct) + S4 (secrets VERIFY) are LANDED and locally witnessed. Clause (a)
  on the Linux runner, clause (c) (the observed auto-deploy round-trip), and S5 (the never-run
  Linux tail triage) are OPEN by construction — they require the CI substrate and are discharged
  at the master push (§OPEN below).

## §The witness measurements (born-RED discipline — the never-projects finding + its reconciliation)

**The spec's hypothesized failure shape** (`J.W0.md §S3` root-cause confirmation step): on a
`cube→spring` hash-nav over the built dist, the trigger reads the SOURCE scene's stale label
(`"Controls"`) for a window AFTER `activeScene` rests on `spring` — the label arriving late
through the `sceneRef.extraControlTabs` re-bind on `<Suspense>` mount.

**The observed pre-cure shape (the NEVER-PROJECTS finding):** the frame-granular probe over the
built `dist/gh-pages/` (per-rAF sampling of localStorage `activeScene` + the
`[aria-label='Controls tab']` trigger text across the mount window) found the trigger does NOT
render the stale SOURCE label mid-transition — it goes ABSENT (`null`) for the mount window.
Mechanism: `ChromeDock.vue`'s `hasControlPanel` carried a `props.hasSelectedAnimation`
AND-clause; that prop derives from the DESTINATION superKey's stored `selectedAnimation` — a
per-superKey fact seeded only at `SCENE_READY` (post-mount). On a cross-scene nav the affordance
itself therefore VANISHED until the destination mounted, so the mid-transition observable is
trigger-ABSENT/`null`, not stale-`"Controls"`.

**The reconciliation:** the never-projects shape is CONSISTENT with the recorded CI witness —
run `27228309606`'s six failures all read `trigger='null'` (never `'Controls'`). The lag chain
the spec named (`ci-linux-open-item.md §2`: route → mount → `sceneRef.extraControlTabs` re-bind)
is REAL, but it carries TWO lag mechanisms on the same chain, both cured by S3:

1. **the label CONTENT lag** — `extraControlTabs` arrived a tick late through the mounted scene
   component (the spec's named chain) → cured by the machine-projected
   `extraControlTabsFor(activeScene)` (the DFA tab table);
2. **the affordance PRESENCE lag** — `hasSelectedAnimation` seeded only at `SCENE_READY`
   (post-mount) gated the trigger's existence → cured by DELETING the AND-clause; the affordance
   now keys purely on the DFA projection (`allControlTabs.length > 0`), born-correct on the rest
   tick. Spec clause (b)'s wording ("NEVER the SOURCE label (`'Controls'`/`null`)") covers both
   shapes; the cure makes both impossible.

**Post-cure witness (clause (b), frame-granular, built dist):** from the very first frame
`activeScene` rests on `spring`, the trigger reads `"Spring"` — **265/265** post-rest frames
unthrottled (rest at t=23.6 ms from hash-set, trigger already `"Spring"` on that frame);
**228/228** frames under CDP 6× CPU throttle (rest at t=168.2 ms, already `"Spring"`). Never the
SOURCE label `"Controls"`, never `null`. The projection is born-correct, not late-correct.

## §S2 deltas — the `navToScene` per-EXPECTED-state primitive + both gate migrations (file:line)

- **`scripts/lib/demo-driver.mjs:330`** — `export const SCENE_MACHINE_KEY =
  "keyframes-js-scene-machine"` (single-sourced; the hand-rolled per-gate literals die).
- **`scripts/lib/demo-driver.mjs:332-355`** — `export async function navToScene(page, sceneId,
  expectedTrigger, { timeout = 12000 } = {})` exactly per spec `§S2`: hash-set → wait the EARLY
  fact (machine `activeScene` rests on target) → wait the LATE fact (the DESTINATION control
  surface PROJECTED: trigger text == expected label, or trigger-ABSENT for `expectedTrigger ===
  null`). ONE 12 s CEILING for both waits, `.catch(() => {})` keeps the oracle honest (the gate's
  existing assertion reads the real DOM on expiry). NO fixed `settleMs` anywhere.
- **`scripts/proof-scene-control-dfa.mjs`** — migrated: import at `:51`; D3 per-scene call site
  `:274` and D4 matrix call sites `:320-321` now
  `navToScene(page, id, EXPECT[id].hasPanel ? EXPECT[id].trigger : null)`. The local `navByHash`
  (was `:211-229`) + `MACHINE_KEY` (was `:179`) are DELETED. No `IN_CI` branch, no
  `continue-on-error`, no settle bump — the gate stays HARD.
- **`scripts/proof-scene-transition-perf.mjs`** — migrated: import at `:56`; the per-EXPECTED
  label table `TRIGGER = { cube: "Controls", easing: "Easing" }` at `:206`; T2 round-trip navs
  `:312-315` onto `navToScene`; `measureTransition` now parameterized on the shared
  `SCENE_MACHINE_KEY` (`:230`) — its rAF×2 settle untouched per spec. Local `navByHash` (was
  `:203-221`) + `MACHINE_KEY` (was `:177`) DELETED. Stays `IN_CI` observe-only (device-dependent
  posture); the OBSERVED p95 is now honest under load (CI-3).

## §S3 deltas — the dock trigger projection born-correct from the DFA (file:line)

- **`demo/@/components/custom/animation-controls/stores/controlSurfaceDFA.ts:140-198`** — the
  extra-tab projection lands BESIDE the DFA table that declares where each surface is valid:
  `interface ControlSurfaceTab` (`:153-157`), the static per-surface tab-metadata table
  `SCENE_SURFACE_TABS` (`:160-168`: easing→"Easing", spring→"Spring",
  matrix-controls→"Matrix Controls"), and `extraControlTabsFor(sceneId, activeConditionals)`
  (`:181-196`) — derived PURELY from `controlSurfacesFor(activeScene)` ∪ the caller-supplied
  active conditionals ∩ `CONDITIONAL_SURFACES[sceneId]` (total: an undeclared conditional can
  never render).
- **`demo/@/components/custom/animation-controls/stores/useSceneMachine.ts:244-262`** — the
  machine exposes `extraControlTabsFor` + the reactive `extraControlTabs(activeConditionals?)`
  projection of `machine.value.context.activeScene` (the I.W2 single-authority extended from the
  SELECTED surface to the tab PROJECTION).
- **`demo/app/App.vue:243-249`** — the dock binds the machine projection:
  `extraControlTabs = computed(() => machine.extraControlTabs(storedControls.selectedAnimation
  === CUBE_ANIMATION_NAMES.Matrix ? ["matrix-controls"] : []))`; the template bind at `:10`
  (`:extra-control-tabs="extraControlTabs"`). The `sceneRef?.extraControlTabs ?? []` re-bind
  (the lag) is DELETED. Cube's conditional keys on a stored, synchronous fact — no mount
  dependency.
- **`demo/app/App.vue:260-264` + `:8`** — `dockSelectedControl`: the dock trigger's SELECTED
  surface binds the SAME I.W2 machine projection (`selectedControlSurfaceFor(activeScene,
  pick)`) the in-panel tab host already binds — READ-side derivation ONLY; the write path is
  untouched (J.W2 owns the `selectedControl` single-WRITER completion, per spec §Boundary).
- **`demo/@/components/custom/dock/ChromeDock.vue:95`** — `hasControlPanel = computed(() =>
  allControlTabs.value.length > 0)`; the `hasSelectedAnimation` prop + AND-clause are DELETED
  (the never-projects mechanism, §witness above). `allControlTabs` (`:76-81`) unions the
  DFA-valid built-in triad with the now machine-projected `extraControlTabs`.
- **Per-scene injections DELETED (no legacy beside the replacement):**
  `demo/app/scenes/EasingScene.vue` (the `extraControlTabs` computed + expose),
  `demo/app/scenes/SpringScene.vue` (same), `demo/app/scenes/CubeScene.vue` (same — its
  conditional matrix-controls tab moved to the App-supplied `activeConditionals`).
- **NO `nextTick` re-assert, NO force-mount** — the projection is machine-derived; fresh and
  switched paths converge on the rest tick.

## §Local gate results (the substrate available pre-push; macOS, built dist)

- **Build:** `npm run gh-pages` GREEN (1.34 s).
- **Clause (a) locally — `proof:scene-control-dfa` GREEN ×3, ZERO failures:**
  `KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/glass-ui node scripts/proof-scene-control-dfa.mjs`
  passed end-to-end three times — solo, concurrent-with-rebuild-load, and post-final-rebuild.
  D1 3/3 · D2 totality · D3 7/7 (easing trigger=`'Easing'`, spring trigger=`'Spring'`,
  sequence/motion-path `panel:false`) · D4 navigation-matrix 7/7. All SIX run-`27228309606`
  failure cells (D3 easing, D3 spring, D4 cube→easing, sequence→easing, motion-path→spring,
  cube→spring) GREEN.
- **CI-6 (load-independence) — GREEN under load, 4.42 s wall:** the second run executed
  concurrent with two looped `npx vite build --mode gh-pages` workloads (8 builds each) spanning
  the whole gate run. *Methodology note:* the load builds targeted temp outDirs — rebuilding
  into the live `dist/gh-pages` would have WIPED the served fixture mid-run
  (`vite.config.ts:357-358` `emptyOutDir: true`), which tests fixture destruction, not load.
  Gate wall-clock under load: 4.42 s vs the old fixed-settle floor of ~34 s (1600 ms × 21 navs)
  — the per-expected predicate returns the instant the surface projects.
- **Clause (b) — born-correct mid-transition, unthrottled AND 6× CPU-throttled:** the
  frame-granular probe results recorded in §witness above (265/265 and 228/228 post-rest frames
  `"Spring"`; never `"Controls"`, never `null`).
- **Clause (e) — `scene-transition-perf` HONEST p95 (observe-only):** transition-budget GREEN —
  p95 = 67.5 ms ≤ 120 ms budget, p50 = 43.0 ms over 18 transitions (recorded baseline
  p95 ≈ 46 ms). ONE RED present: the easing↔cube round-trip ends `selectedControl='controls'`
  (before `'spring'`, expected `'easing'`) — this is the PRE-RECORDED **J.W2-owned** witness
  (`docs/tranches/J/audit/perf-battery-2026-06-10.md:89` — "the J.W0/W2 round-trip witness";
  `J.W0.md §Boundary with J.W2`: the `selectedControl` single-WRITER completion is J.W2's, the
  dock READ-side projection is J.W0's and landed). NOTED, not papered; the gate stays
  observe-only per its device-dependent posture.

## §S4 — GH secrets VERIFY (names only; orchestrator-verified)

`gh secret list` against the kf repo (run by the orchestrator, recorded here) confirms the repo
secrets EXIST — names only, values never read:

| Secret | Updated |
|---|---|
| `CLOUDFLARE_API_TOKEN` | 2026-06-07 |
| `CLOUDFLARE_ACCOUNT_ID` | 2026-06-07 |
| `NPM_TOKEN` | 2026-06-03 |

The sanctioned deploy path is re-stated as the ONLY mechanism: `deploy-pages.yml` (on green-CI
`workflow_run`, `:42-46`) → `scripts/pages-deploy.sh`, consuming the GH repo secrets
(`deploy-pages.yml:66-68`). The sibling-`.env` bypass (`fourier-analysis/.env`, account
`07119f…`) is RETIRED — a one-time emergency forced by the dead CI, not the design. Clause (d)
satisfied (HYGIENE corroborator; the secret CONFIGURATION remains USER-DOMAIN).

## §S1 — the 8-commit post-close tail: ADOPTED as-specced (pointer)

The terminal disposition table for the 8 post-close commits (`f93e731` · `c48d577` · `c10e2b4` ·
`196ec2f` · `166aa42` · `66855c2` · `feb39c3` · `4072af9`) lives in **`J.W0.md §S1`** and is
**ADOPTED AS-SPECCED** — every commit exits with its terminal disposition exactly as recorded
there (RE-AFFIRM ×5, SUPERSEDED-BY-S2 for `66855c2`, RE-AFFIRM for `feb39c3` with this wave
discharging its booking, DISCHARGED-BY-J.W0 for `4072af9`), plus the two stale-doc
reconciliations (the `I.WZ.md` `DEFERRED-BY-USER` supersession RECORD; the `PROGRESS.md §0`
stale revert recommendation RECORD-not-re-propagated). P-invariant-28 satisfied: no perpetual
punt; this wave is the tail's tranche-structural home. The J.W3-booked items in that table
(the `yaml`-package devDep decision; the single `IN_CI` seam fold) remain J.W3's.

## §OPEN — awaiting the CI substrate (discharged at the master push)

These are NOT locally dischargeable by construction; they are the deploy boundary's own
substrate:

1. **Clause (a) on Linux** — `proof:scene-control-dfa` GREEN inside `demo-smoke` on the GitHub
   2-core Linux runner (the born-RED run `27228309606` substrate), ZERO escapes. Locally GREEN
   ×3 incl. under load (above); the Linux witness lands on the next master push.
2. **Clause (c) — the observed auto-deploy round-trip** — a real master push → `ci` concludes
   `success` (BOTH jobs) → `deploy-pages.yml` fires via the `workflow_run`-on-`push` arm
   (`event_name == 'workflow_run'`, `workflow_run.event == 'push'` — NOT `workflow_dispatch`) →
   keyframes.babb.dev serves the pushed `head_sha`'s bytes. Record the CI run id, the deploy
   run's trigger, and the served-build hash. RE-observed at the J.WZ close merge. This is the
   INVE-1 cure.
3. **S5 — the never-run Linux tail triage** — the ~60-gate `demo-smoke` tail executes on Linux
   for the FIRST time once #16 stops fail-stopping; each surfaced red triaged under P6
   (device-independent → fix-deterministic-or-hard; device-dependent → observe-only/
   runner-calibrated via J.W3's single seam — NEVER `continue-on-error`); CICD-7's 20-minute
   wall-clock BOUND on the first complete run, measure-first.

---

## §CLAUSE (c) DISCHARGED — the OBSERVED auto-deploy round-trip (2026-06-10, the oracle of record)

**The chain, observed end-to-end on the `workflow_run`-on-push arm (NO manual path):**

| Link | Record |
|---|---|
| The real master push | `c6c3c37` ("the files negation"; the J.W0+W1+W2+W3+W5+W6 integrated tree + 4 triage rounds) |
| Green CI | run **`27310054675`** — `gates` 2m54s + `demo-smoke` **19m13s END-TO-END GREEN on the Linux runner** (the FIRST fully-green CI run in the repo's history; `scene-control-dfa` included, ZERO escapes) |
| Auto-fire | deploy run **`27310920981`**, `event == workflow_run` (the auto arm — NOT `workflow_dispatch`), checked out `HEAD == c6c3c37` |
| Served bytes | the deploy build produced `index-DiVbdzH3.js` + `engine-DZcTI7Qc.js`; **`https://keyframes.babb.dev/` serves `assets/index-DiVbdzH3.js`** (curl-verified 2026-06-10T22:4xZ) — the live site serves the pushed sha's bytes |

**The S5 tail-triage ladder (the second wavefront, run by protocol — each CI attempt penetrated one layer deeper into the never-run tail):**

| Attempt | master sha | CI run | The layer that bit | Disposition (P6) |
|---|---|---|---|---|
| #1 | `09a56bf` | `27298506458` | `scene-control-dfa` **GREEN on Linux for the first time** (the W0 cure held); fail-stop at `scene-transition-perf`'s round-trip identity clause | device-INDEPENDENT product defect — owned + cured by J.W2 (no gate change) |
| #2 | `e9f2f8a` | `27303418544` | `proof:ci-coverage` (3 new gates unwired) + the lighthouse a11y band (`label-content-name-mismatch` ×2 scenes, `aria-required-attr`) | the wiring honored; the ARIA defects fixed at the product seam (`af5b7e7`) |
| #3 | `af5b7e7` | `27305120296` | `proof:demo-no-oversize` (W2 grew 2 units past 500L) | colocated re-decomposition at the natural seams: `SheetGrabHandle.vue`, `useSpringHotPath.ts` (`890e2b7`) |
| #4 | `890e2b7` | `27306845701` | `proof:easing-sidebar-normalized` (the gate's `tabpanel` mount predicate stale vs the SPEC'D J.W2 flat-mount grammar) | the gate's oracle evolved + corpus-swept (`3727382`); W3 merged (`c6ba13b`) |
| #5 | `c6c3c37` | `27310054675` | **NONE — GREEN end-to-end → the auto-deploy fired** | the round-trip OBSERVED |

**CICD-7 — the wall-clock VALIDATED:** the complete `demo-smoke` tail runs **19m13s** against the
`timeout-minutes: 20` budget on the post-W3 (shared-lib) corpus — VALID but with only ~47s headroom;
the J.W3 `withPage`/`withBrowser` consolidation is the recorded mechanism should it regress past 20m
(measure-first; the budget itself is unchanged).

**INVE-1 is RECORD-CURED:** the I FINAL's "merge → green CI → CF auto-deploys" claim is now an
OBSERVED fact with run ids, not an assertion. Zero escapes were added anywhere in the ladder: no
`settleMs` bump, no `continue-on-error`, no `IN_CI` demote on a correctness gate, no
`workflow_dispatch` substitute — every layer exited via a product fix, a wiring honor, a spec'd-grammar
predicate evolution, or a colocated decomposition.
