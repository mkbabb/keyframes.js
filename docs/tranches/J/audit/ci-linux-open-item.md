# Tranche J audit — the CI-on-Linux OPEN item (scene-control-dfa transition-settle flake)

Lane: `ci-linux-open`. Read-only audit, tree @ `tranche-i-dev` (working from the I close, clean modulo package*.json + a stray png). Disposition: **FOLD into a J wave.** This is the one explicitly-booked I follow-up (memory `project_ci_was_dead_and_deploy_creds.md` §"OPEN follow-up — CI-on-Linux gate-robustness"); J designs + ships the cure. The doc below is wave-ready: exact root cause, the fix spec, the generalization, the never-run tail, and the load-independence question.

---

## 0. TL;DR verdict

| # | Finding | Sev | Disp |
|---|---------|-----|------|
| CI-1 | `proof:scene-control-dfa` fails on the GitHub Linux runner — `navByHash` waits on the EARLY `activeScene` localStorage fact then a fixed `settleMs`; the destination control-tab trigger TEXT lags (via the mounted scene component's `extraControlTabs`), so easing/spring/D4 read `trigger='null'`. EMPIRICALLY witnessed (run 27228309606). | P0 | FOLD |
| CI-2 | The reverted escape-hatch (`66855c2`) was a structural no-op: `waitForFunction(trigger-present OR no-panel)` is satisfied IMMEDIATELY by the SOURCE scene's stale trigger (`panel:true` for cube→spring) — it never waited for the DESTINATION. Confirms the cure must be per-EXPECTED-state. | P0 | FOLD |
| CI-3 | `proof:scene-transition-perf` (the very NEXT gate) carries the IDENTICAL `navByHash` race + the same fixed `settleMs` — same latent flake, not yet bitten only because its oracle reads localStorage `selectedControl`, not the DOM trigger. | P1 | FOLD |
| CI-4 | The fix primitive must live in `scripts/lib/demo-driver.mjs` (a `navToScene(page, dest, expected)` per-expected-settle), which TODAY has NO scene-nav primitive — every transition-driving gate copy-pastes its own `navByHash`. Single-source it so ALL inherit it. | P1 | FOLD |
| CI-5 | ~60 demo-smoke gates after `proof:scene-control-dfa` (ci.yml line 321) have NEVER executed on Linux — the job fail-stops there (zero `continue-on-error`). The whole demo appearance/layout/interaction tail is UN-VERIFIED on the CI substrate. J must budget for this tail surfacing NEW env-coupled failures once the flake is cured. | P0 | FOLD |
| CI-6 | The cure SHOULD make the wait load-independent locally too: `proof:all` caught this green "by luck" (fixed `settleMs` happened to exceed the local mount time on an unloaded dev box). A per-expected predicate with a generous timeout is load-independent by construction. | P1 | FOLD |
| CI-7 | There is NO `data-scene`/`aria-current` scene-id DOM marker anywhere in the demo. The cure's available signals are (a) the localStorage `activeScene` (early — already used, races), (b) the dock scene-Select label, (c) the control-tab trigger text (late — the true settle signal). Recommend predicate on (c) keyed to the per-destination EXPECT label. | BOOK | RECORD |

---

## 1. The gate + the exact failure (CI-1)

`scripts/proof-scene-control-dfa.mjs` — the per-scene control-surface DFA gate. STATIC half (D1/D2, source-shape) always runs; BROWSER half (D3 per-scene, D4 navigation-matrix) runs over BUILT `dist/gh-pages/` under playwright.

**The navigation primitive** (`scripts/proof-scene-control-dfa.mjs:211-229`):

```js
async function navByHash(page, sceneId, settleMs = 1600) {
    await page.evaluate((s) => { location.hash = "#/" + s; }, sceneId);
    await page.waitForFunction(
        ([mk, id]) => JSON.parse(localStorage.getItem(mk) || "{}").activeScene === id,
        [MACHINE_KEY, sceneId], { timeout: 8000 },
    ).catch(() => {});
    await page.waitForTimeout(settleMs);   // ← the flake: fixed settle after the EARLY fact
}
```

**The oracle** (`dockControlState`, lines 234-256): reads `document.querySelector("[aria-label='Controls tab']")` → `triggerText`. D3/D4 assert `triggerText === EXPECT[id].trigger` (`EXPECT`, lines 185-193): cube/amiga/square→`"Controls"`, easing→`"Easing"`, spring→`"Spring"`.

**Empirical failure** — CI run `27228309606` (the WZ deploy commit, latest on master), `gh run view 27228309606 --log-failed`:

```
✗ D3 easing  — got {panel:true, trigger='null', triad:false} expected {trigger:"Easing", noBuiltInTriad:true}
✗ D3 spring  — got {panel:true, trigger='null', triad:false} expected {trigger:"Spring"}
✗ D4 [cube→easing]        — got {panel:true, trigger='null'} expected {trigger:"Easing"}  (stale 'cube' bled)
✗ D4 [sequence→easing]    — trigger='null' expected "Easing"
✗ D4 [motion-path→spring] — trigger='null' expected "Spring"
✗ D4 [cube→spring]        — trigger='null' expected "Spring"
proof:scene-control-dfa — FAIL (6) … ##[error]Process completed with exit code 1.
```

Decisive detail: **`panel:true` and `triad:false`** in every failure. The control-surface SET is correct (panel present, no stale built-in triad). Only the trigger TEXT is `null` — it had not yet projected the destination's label. cube/amiga/square do NOT fail because their trigger (`"Controls"`, the built-in default) does not depend on the lagging scene-component injection (see §2).

---

## 2. Root cause: the trigger TEXT lags the route via the mounted scene component

The control-tab trigger's text is the SELECTED control's label, drawn from `allControlTabs` = the DFA-valid built-in triad ∪ the scene's `extraControlTabs`. Trace:

| Layer | file:line | settle timing |
|-------|-----------|---------------|
| `location.hash = "#/spring"` | gate | t0 |
| router `afterEach` → `dispatch(NAVIGATE)` | `demo/app/useSceneMachineRouter.ts:60-69` | t0+ε |
| reducer writes `activeScene` SYNCHRONOUSLY | `sceneMachine.ts:110-124` (`transition` NAVIGATE) | **t0+ε — what `navByHash` waits on** |
| `persisted.value = {activeScene…}` (localStorage) | `useSceneMachine.ts:126-129` | t0+ε (same tick) |
| `currentSceneId = machine.activeScene.value` | `demo/app/App.vue:199` | t0+ε |
| dock scene-Select label updates | `ChromeDock.vue:196-205` (`:model-value="currentSceneId"`) | t0+ε |
| `controlSurfaces` projection (the SET) | `useSceneMachine.ts:233-237` + `ChromeDock.vue:74-80` | t0+ε (reactive on activeScene) — **why `panel:true`/`triad:false` is already right** |
| `<Suspense>` resolves → destination scene COMPONENT mounts | App scene host | **t0 + MOUNT (the lag)** |
| `sceneRef` re-binds to the destination instance | App | t0 + MOUNT |
| `:extra-control-tabs="sceneRef?.extraControlTabs ?? []"` updates | `demo/app/App.vue:11` | t0 + MOUNT |
| easing/spring inject `{value:"spring", label:"Spring"}` | `SpringScene.vue:80-83`, `EasingScene.vue:45-47` | t0 + MOUNT |
| `allControlTabs` recomputes → trigger text = `"Spring"` | `ChromeDock.vue:74-80` + `:177 SelectValue` | **t0 + MOUNT + flush** |
| `SCENE_READY` (targets attached) → `selectedControl` resolves | `useSceneMachineApp.ts:93-112` | t0 + MOUNT |

So **`activeScene` is the EARLY fact; the destination trigger text is the LATE fact**, gated on the destination scene component's mount + its `extraControlTabs` re-bind through `sceneRef`. The fixed `settleMs=1600` is a guess at "MOUNT + flush"; on a fast unloaded box it suffices (local PASS), on GitHub's shared 2-core headless runner the heavy control-surface editor mounts SLOWER than 1600ms → trigger still `null` → red. This is the documented class in the revert message (`feb39c3`): *"a fresh goto /spring renders trigger='Spring' fine; the cube→spring hash-nav leaves it null/stale until the FSM settles."*

cube/amiga/square are immune because `"Controls"` is the built-in triad default — it is present the moment `controlSurfaces` projects (t0+ε), independent of any scene-component `extraControlTabs`.

---

## 3. Why the escape-hatch was a no-op (CI-2)

Attempt `66855c2` added, inside `navByHash`:

```js
await page.waitForFunction(
    () => !!document.querySelector("[aria-label='Controls tab']")     // trigger PRESENT
       || !document.querySelector(".animation-controls, .controls-pane-wrapper"),  // OR no panel
    null, { timeout: IN_CI ? 9000 : 4000 },
).catch(() => {});
```

This returns IMMEDIATELY: on a cube→spring transition the SOURCE scene's `[aria-label='Controls tab']` trigger is still mounted (the gate even logs `panel:true` at the failure moment), so `trigger PRESENT` is true on the first poll. The predicate asks "is ANY trigger present" — it is, the STALE one — never "is the DESTINATION's trigger present". The revert (`feb39c3`) is correct: the baseline `waitForTimeout(settleMs)` is no worse than a no-op wait, so they reverted to it and booked the per-expected-state cure.

The lesson generalizes: **a settle predicate keyed on existence (`trigger present`) is structurally blind to a TRANSITION** because the source's DOM persists through the swap. The predicate must be keyed on the EXPECTED destination VALUE.

---

## 4. THE CURE — wave-ready spec

### 4.1 The wait predicate

Wait until the control-tab trigger's text EQUALS the destination's expected label (per-EXPECTED-state settle), with the panel-less destinations (sequence/motion-path/home) waiting for the ABSENCE of the trigger. The EXPECT table the gate already owns (`scene-control-dfa.mjs:185-193`) IS the expected-label source.

**Validation of the predicate against the source:**
- Is the trigger text unique-per-scene? **No** — cube/amiga/square all → `"Controls"`. But the cure does not need global uniqueness: it is a per-DESTINATION settle — we already KNOW the destination id, so we wait for `triggerText === EXPECT[dest].trigger`. For cube→amiga (both `"Controls"`) the predicate is satisfied at t0+ε (correct — the trigger genuinely never changes text), and the SET-correctness is what the oracle then asserts. For the FLAKY pairs (→easing/→spring) the label DOES change (`"Controls"`→`"Spring"`), so the predicate genuinely waits for the projection.
- Is there a better invariant — `data-scene`, `aria-current`, machine state in localStorage? **No `data-scene`/`aria-current` exists** (`grep -rn "data-scene\|aria-current" demo/ --include=*.vue` → only `:current-scene-id` prop bindings, no rendered attr). The localStorage `activeScene` is the EARLY fact (already used, races). The dock scene-Select LABEL settles at t0+ε too (bound to `currentSceneId`) — also early, would NOT fix the trigger-text lag. **The control-tab trigger text is the only DOM signal that settles at the genuine "control surface projected" moment** — so it is the correct settle target. (A born-RED alternative — adding a `data-scene-ready` attr the scene component sets on its post-mount SCENE_READY tick — is a cleaner machine-state signal and is recorded as CI-7's optional upgrade, but is not required: the trigger-text predicate is sufficient and adds zero product surface.)

### 4.2 The exact fix (file / function / predicate / timeout policy)

**File:** `scripts/lib/demo-driver.mjs` (the shared driver — §4.3). **New export:**

```js
/**
 * navToScene — drive a hash-nav scene transition + WAIT for the DESTINATION's
 * control-surface to project (per-EXPECTED-state settle, NOT a fixed settleMs /
 * any-trigger-present). The control-tab trigger TEXT lags the route via the
 * mounted scene component's extraControlTabs (App.vue:11) — so we wait for the
 * trigger to equal the destination's expected label, OR to be absent when the
 * destination has no panel. Load-independent: the timeout is a CEILING, not a
 * fixed wait, so it returns the instant the surface projects (fast box) and only
 * spends the budget on a slow runner.
 *
 * @param expectedTrigger  the destination's control-tab label, or null when the
 *                         scene has no control panel (home/sequence/motion-path).
 */
export async function navToScene(page, sceneId, expectedTrigger, { timeout = 12000 } = {}) {
    await page.evaluate((s) => { location.hash = "#/" + s; }, sceneId);
    // 1. machine activeScene rests on the target (the EARLY fact — necessary,
    //    not sufficient; bounds the route reconcile).
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

**Timeout policy:** ONE generous ceiling (12s) for BOTH waits — not a CI-scaled `Math.max(settleMs, 3500)` (the `66855c2` mistake of scaling a fixed wait). A `waitForFunction` ceiling is load-independent: it returns the instant the predicate holds. The `.catch(() => {})` keeps the oracle HONEST — if the surface genuinely never projects within 12s, the wait expires and the gate's existing assertion reads the real (wrong) DOM and reds. No oracle relaxation: a real missing/wrong trigger STILL bites; only the timing race is removed.

**Gate rewrite (`scene-control-dfa.mjs`):** replace `navByHash(page, id)` D3/D4 call sites with `navToScene(page, id, EXPECT[id].hasPanel ? EXPECT[id].trigger : null)`. The D4 loop `navByHash(from); navByHash(to)` → `navToScene(from, …); navToScene(to, …)`. Delete the local `navByHash` + `MACHINE_KEY` (re-export `SCENE_MACHINE_KEY` from the driver). Net: −18 lines local, +1 shared primitive.

### 4.3 Generalization to demo-driver.mjs (CI-4)

`scripts/lib/demo-driver.mjs` is the single-sourced Playwright driver (its docstring: *"the convergence point — both lanes import the SAME manifest + the SAME open-panel driver"*). It TODAY exports `SCENES`, `resolveChromium()`, `serveDist()`, `openControlsPanel()`, `subjectRect()` — but **NO scene-navigation primitive.** Every transition-driving gate hand-rolls its own `navByHash`:
- `scripts/proof-scene-control-dfa.mjs:211` (the flaky one).
- `scripts/proof-scene-transition-perf.mjs:203` (the IDENTICAL race — CI-3).
- (audit: `grep -rln "location.hash = " scripts/` to enumerate ALL hash-nav gates in the J wave; each is a copy-paste candidate.)

J folds `navToScene` (+ `SCENE_MACHINE_KEY`) INTO `demo-driver.mjs` so EVERY transition-driving gate inherits the per-expected-settle for free — the same convergence the manifest/`openControlsPanel` already enjoy. This is the idiomatic, no-workaround fix: one settle authority, no per-gate guess-the-`settleMs`.

### 4.4 The sibling that carries the same race (CI-3)

`scripts/proof-scene-transition-perf.mjs:203-221` is `navByHash` byte-for-byte (fixed `settleMs=1500`, `activeScene`-only wait). It has NOT bitten because its D-clause oracle (`controlProjection`, :248-263) reads localStorage `selectedControl`, not the DOM trigger — and `selectedControl` is reconciled by the SCENE_READY path which the 8s `activeScene` wait + 1500ms roughly covers. But it is the SAME latent flake: a slow runner that under-settles will mis-measure the transition budget or mis-read the round-trip. It is already `IN_CI` observe-only (`:79-81`), so it cannot RED CI — but the OBSERVED p95 is garbage under a race. Fold it onto `navToScene` in the same wave so the observe-only measurement is honest. (Its `measureTransition`, :226-246, uses an in-page rAF×2 settle and is fine — only the inter-sample `navByHash` needs the swap.)

---

## 5. The never-run demo-smoke tail (CI-5)

`proof:scene-control-dfa` is at `ci.yml:321` — position ~21 in the `demo-smoke` job. The job has **zero `continue-on-error`** (`grep -c continue-on-error ci.yml` → 0), so the GitHub default fail-stop applies: the instant scene-control-dfa exits 1, EVERY subsequent step is skipped. Combined with the fact that CI was YAML-invalid since H and only began running on 2026-06-09 (memory `project_ci_was_dead_and_deploy_creds`; first parse-valid run `f93e731`), **no gate after line 321 has EVER executed on the Linux CI substrate.** Verified against the actual run log (27228309606): the last passing step is `proof:icon-paint-live`; scene-control-dfa is the terminal `##[error]`.

The un-run tail (ci.yml demo-smoke step order, line numbers within the job, from `proof:scene-transition-perf` onward — ALL never-run on Linux):

| Gate | Predicted env-coupling risk on Linux 2-core headless |
|------|------------------------------------------------------|
| `proof:scene-transition-perf` | TIMING — same `navByHash` race (CI-3); already `IN_CI` observe-only so won't RED, but mis-measures. |
| `proof:dock-popover-opens`, `proof:single-toggle`, `proof:darkmode-row-toggle` | TIMING — trusted-click + popover open settle; risk if the dock spring settle is slower than the wait. |
| `proof:idle-fade` | TIMING — a REAL >10s `useIdle` wait; clock/scheduling on a loaded runner could extend the dim onset past the wait window. |
| `proof:single-column-pack`, `proof:label-subgrid`, `proof:timeline-rail-width`, `proof:demo-shell-grid`, `proof:stage-not-clipped`, `proof:cartoon-shadow-unclipped`, `proof:computed-real-dom` | LAYOUT/RASTER — subpixel grid/rail/clearance asserts at fixed viewports. Font-metric differences (Linux fontconfig ≠ macOS) shift text box widths → label-column / single-column ±px tolerances at risk. HIGH suspicion. |
| `lighthouse A11y=100 + SEO≥90` | RASTER/PERF — lighthouse scoring on a 2-core runner; A11y is structural (likely stable), SEO likely stable; the LCP/CLS-adjacent metrics are env-sensitive but this gate scores A11y+SEO only. |
| `proof:decomposition`, `proof:no-deprecated-guard`, `proof:single-writer`, `proof:composable-encapsulation`, `proof:demo-no-oversize`, `proof:no-brittle-selector`, `proof:no-dup-utility`, `proof:idioms`, `proof:phi-leaf-zero`, `proof:icon-idiom`, `proof:styling-idioms`, `proof:brittleness` | NONE — static source-shape gates; env-independent, will pass once reached. LOW. |
| `proof:cartoon-is-panel-depth`, `proof:glass-and-cartoon`, `proof:scene-card-rounded`, `proof:stage-glass-card`, `proof:card-rounded-primitive`, `proof:stage-within-docks`, `proof:bezier-no-scroll`, `proof:bezier-single-card`, `proof:bezier-grown` | LAYOUT/RASTER — computed-style + bbox asserts; backdrop-filter/shadow geometry. MEDIUM — geometry math is DPR-stable but font-metric-driven box sizes shift. |
| `proof:pp-logo-svg`, `proof:dogfood-hero`, `proof:typing-dots`, `proof:easing-canvas-bounded` | TIMING/RASTER — `typing-dots` asserts a staggered cadence + never-vanish ≥0.15 over a ≤1.6s cycle (engine-driven); a loaded runner's rAF jitter could clip a sample. MEDIUM. |
| `proof:scene-uses-standard-ribbon`, `proof:easing-sidebar-normalized`, `proof:easing-sidebar-minimal`, `proof:easing-stage-is-ball` | LAYOUT — sidebar/ribbon shape + bbox; font-metric risk. MEDIUM. |
| `proof:mobile-single-page`, `proof:dock-zorder`, `proof:drawer-spring` | TIMING/LAYOUT — `drawer-spring` asserts a SpringProgress <350ms settle + overshoot ring (engine timing); `dock-zorder` is elementFromPoint geometry. `drawer-spring` HIGH timing risk on a slow runner. |
| `proof:scene-perf-budget` | PERF — amiga tile-count/dpr/pixel-identity; explicitly device-dependent — verify it is `IN_CI` observe-only BEFORE J relies on it RED-on-regression (AUDIT: it is NOT in the `IN_CI`-grep hits list — §6 — so it may HARD-RED on Linux GPU/raster differences). FLAG. |
| `proof:scene-parity`, `proof:sequence-rows-draggable`, `proof:motion-path-editable`, `proof:motion-path-copy`, `proof:easter-egg` | TIMING/INTERACTION — drag gestures + clipboard write (`motion-path-copy` does a REAL clipboard write — headless clipboard permission risk on Linux chromium). MEDIUM-HIGH for the clipboard one. |
| `proof:hero-rung`, `proof:hero-balance`, `proof:hero-cls` | LAYOUT/CLS — `hero-rung` asserts ≥140px @1440 (font-metric-driven — the Instrument Serif mega rung renders at a Linux-fontconfig-dependent size; HIGH risk the px floor mis-resolves if the webfont is slow/absent); `hero-cls` asserts CLS≤0.02 (layout-shift, env-sensitive). HIGH. |
| `proof:demo-elevate`, `proof:modern-web`, `proof:platform-adopt` | MIXED — mostly source/feature-detect; LOW-MEDIUM. |
| `LoAF >50ms trace gate` (job tail) | PERF — Long Animation Frame trace; explicitly timing/CPU-bound on a 2-core runner. HIGH — likely needs `IN_CI` observe-only treatment. FLAG. |

**J wave budget:** the cure unblocks the tail, but the tail is a SECOND wavefront of env-coupling. Two highest-risk classes: (1) **font-metric-driven layout asserts** (`hero-rung` px floor, `single-column-pack`/`label-subgrid` ±px, every bbox gate) — Linux fontconfig + webfont-load timing differs from macOS; (2) **device-dependent perf gates not yet `IN_CI`-guarded** (`proof:scene-perf-budget`, the `LoAF` gate) — these may HARD-RED. J must, in the same wave, (a) ship `navToScene`, (b) run the FULL demo-smoke locally under `CI=1` (or actually on a Linux runner) to surface the tail, (c) apply the SAME device-INDEPENDENT-correctness / device-DEPENDENT-observe-only boundary the memory established to every newly-surfaced perf/raster gate. Do NOT assume the tail is green — it has literally never run.

---

## 6. Verified state of the already-reconciled siblings (adversarial check)

The memory claims several gates were already adjusted for Linux. Verified against the tree (NOT trusting the paperwork):

| Gate | Claimed adjustment | Tree evidence | Verdict |
|------|--------------------|----------------|---------|
| `proof:scene-transition-perf` | CI observe-only via `process.env.CI` | `scripts/proof-scene-transition-perf.mjs:79` `const IN_CI = !!(process.env.CI || process.env.GITHUB_ACTIONS)`; `:81` `if (IN_CI) note("[CI observe-only…]")` | TRUE |
| `proof:perf-frame-budget` | CI observe-only | `grep -l process.env.CI` → present in `scripts/proof-perf-frame-budget.mjs` | TRUE |
| `proof:demo-fonts` | exclude `… Fallback` metric-override faces | `scripts/proof-demo-fonts.mjs:104` filter `(f) => /Instrument\|Fira/i.test(f) && !/Fallback/i.test(f)`; `:106` ok message | TRUE |
| `proof:visual-lock` | CI observe-only (macOS baseline ≠ Linux AA) | `grep -l process.env.CI` → present in `scripts/proof-visual-lock.mjs` | TRUE |
| occlusion easing subject = sweeping ball, centering skipped | demo-driver `sweepingSubject` | `scripts/lib/demo-driver.mjs:104` `sweepingSubject: true` for easing; `:249` propagated | TRUE |
| `proof:scene-control-dfa` | **STILL OPEN** | `scripts/proof-scene-control-dfa.mjs:211-229` post-revert baseline (fixed `settleMs=1600`, `activeScene`-only wait); `:228` `waitForTimeout(settleMs)` | OPEN — confirmed (the lane's subject) |

The memory's reconciliation is HONEST and verified. The single remaining OPEN item is exactly scene-control-dfa (+ the demo-gate transition matrix), as booked. Two perf gates in the never-run tail (`proof:scene-perf-budget`, the `LoAF` gate) do NOT appear in the `IN_CI`-grep hit set — J must confirm their CI posture before relying on them (§5 FLAG).

---

## 7. Load-independence (CI-6) — the cure also fixes the local "by luck" green

The flake reproduces under LOCAL load too: `proof:all` caught it green only because the fixed `settleMs=1600` happened to exceed the local mount time on an UNLOADED dev box (revert message `feb39c3`: *"It passes on a fast/unloaded machine (the proof:all caught it), fails under load + on the slow CI runner."*). A fixed `settleMs` is a load-DEPENDENT correctness oracle — it asserts nothing about whether the surface actually projected, only that N ms elapsed.

The `navToScene` predicate is load-INDEPENDENT by construction: `waitForFunction(triggerText === expected, {timeout: 12000})` returns the instant the projection commits (fast on an unloaded box, late on a loaded one), and the timeout is a CEILING not a wait. The oracle now asserts the PRODUCT PROPERTY ("the destination control surface has projected") through the human's surface (the dock trigger text) — which is exactly the I-born gate-ORACLE precept. So the cure is not just a CI fix: it makes the gate honest under local concurrency (a developer running `proof:all` alongside a build no longer gets a luck-green), and removes the only timing heuristic in the gate's settle. **Recommend: YES, the cure MUST be load-independent locally — it is the same change, no extra cost.**

---

## 8. Wave-ready summary for the J orchestrator

- **One wave, ~half a day.** Add `navToScene(page, sceneId, expectedTrigger, {timeout})` + `SCENE_MACHINE_KEY` to `scripts/lib/demo-driver.mjs`. Re-point `proof:scene-control-dfa` (delete its local `navByHash`/`MACHINE_KEY`) and `proof:scene-transition-perf` at it. No product code changes (the demo is correct — `panel:true`/`triad:false` proves the SET projects right; only the gate's settle is wrong).
- **Then run the FULL `demo-smoke` under `CI=1` (or on a Linux runner) and triage the ~60-gate tail** (§5) — budget for font-metric layout asserts (`hero-rung`, `single-column-pack`, `label-subgrid`, bbox gates) and un-guarded perf gates (`proof:scene-perf-budget`, `LoAF`) surfacing NEW Linux failures. Apply the device-independent/observe-only boundary to each per the established rule.
- **Acceptance:** a green `ci` `demo-smoke` job on master → `deploy-pages.yml` (`workflow_run` gated on `ci` success, `deploy-pages.yml:42-45`) AUTO-fires → keyframes.babb.dev re-ships without the break-glass manual `wrangler` deploy. This is the terminal home for the booked item (P-invariant-28): the cure + a green tail = auto-deploy restored, no perpetual punt.
- **Optional upgrade (CI-7, RECORD):** if J wants a cleaner machine-state settle signal than trigger text, a `data-scene-ready` attr set by the scene component on its SCENE_READY tick is a born-RED-able, zero-pixel addition — but the trigger-text predicate is sufficient and adds no product surface, so this is NOT required.

---

### Re-runnable probes (every claim above)

```sh
# the gate's racy nav primitive (post-revert baseline)
sed -n '203,229p' scripts/proof-scene-control-dfa.mjs

# the empirical Linux failure (panel:true, trigger='null')
gh run view 27228309606 --log-failed | grep -E "scene-control-dfa|✗ D|exit code"

# the attempt + revert pair
git show 66855c2   # escape-hatch (waited on the stale trigger)
git show feb39c3   # revert (booked the per-expected cure)

# the trigger-text lag chain
sed -n '11p;199p' demo/app/App.vue                 # :extra-control-tabs="sceneRef?.extraControlTabs ?? []"
sed -n '45,47p' demo/app/scenes/EasingScene.vue    # extraControlTabs → {label:"Easing"}
sed -n '74,80p' demo/@/components/custom/dock/ChromeDock.vue  # allControlTabs ∪ extraControlTabs

# no scene-id DOM marker exists
grep -rn "data-scene\|aria-current" demo/ --include="*.vue"   # → only :current-scene-id prop bindings

# fail-stop: zero continue-on-error → tail never runs
grep -c continue-on-error .github/workflows/ci.yml            # → 0
grep -n "proof:scene-control-dfa" .github/workflows/ci.yml    # → line 321 of ~900

# the sibling carrying the same race
sed -n '203,221p' scripts/proof-scene-transition-perf.mjs

# verified-honest sibling reconciliations
grep -n "IN_CI\|observe-only" scripts/proof-scene-transition-perf.mjs scripts/proof-perf-frame-budget.mjs scripts/proof-visual-lock.mjs
sed -n '104,106p' scripts/proof-demo-fonts.mjs

# deploy auto-fire gating
sed -n '42,45p' .github/workflows/deploy-pages.yml
```
