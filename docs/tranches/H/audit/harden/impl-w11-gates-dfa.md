# impl-w11-gates-dfa — H.W11 GATE LANE: proof:scene-control-dfa + proof:scene-transition-perf (I2)

**Wave:** H.W11 · **Lane:** gates-dfa (the DFA + transition-perf gate authoring/wiring) · **Branch:** `tranche-h-impl`
**Contract:** `docs/tranches/H/waves/H.W11.md` §Hard gate (rows `proof:scene-control-dfa`, `proof:scene-transition-perf`) · `i-_PLAN.md §2 I2`
**Status:** LANDED — both gates GREEN on the W11 fix, born-RED on the W10 baseline, wired into package.json + ci.yml, `proof:ci-coverage` GREEN, `proof:scene-machine-irrefragable` stays GREEN. tsc-clean. NOT committed.

This lane OWNS the two I2 (DFA) browser-gated proofs. The DFA impl + the script bodies + the unit test + the package.json scripts landed in the W11 DFA impl lane (`impl-w11-dfa.md`, scripts authored 02:30–02:31); THIS lane VERIFIES the gates BITE, WIRES them into ci.yml (the missing half — they were in package.json but not yet in CI), and CERTIFIES the W1 keystone stays green (the DFA EXTENDS, never re-authors).

---

## §1 — THE TWO GATES (authored with the existing harness idioms)

Both scripts mirror the established browser-gate idioms verbatim:
- **serveDist + Playwright** — `http.createServer` over the BUILT `dist/gh-pages/`, `chromium` resolved from `playwright-core`/`@playwright/test` (the `proof-scene-machine-irrefragable.mjs` / `proof-scene-perf-budget.mjs` pattern).
- **FSM settle-gate** — `navByHash` assigns `location.hash` then polls `localStorage["keyframes-js-scene-machine"].activeScene === id` (the `MACHINE_KEY` poll, mirroring the W1 + scene-perf harnesses) before reading the DOM. The browser clauses settle on the W1 FSM resting.
- **KF_REQUIRE_BROWSER** — a STATIC half always runs (the source anchors); the BROWSER half is `skipOrFail`-gated so a playwright-absent skip becomes a hard CI fail under `KF_REQUIRE_BROWSER=1` (no vacuous pass).

### `proof:scene-control-dfa` — `scripts/proof-scene-control-dfa.mjs`
Per the DFA map: each scene renders ONLY its VALID control-surface set.
- **D1 STATIC** — `AnimationControls.vue` renders the built-in triad FROM the DFA (`v-for="tab in builtInTabs"`, NO hard-coded `controls/keyframes/timeline` trigger literals); `ChromeDock.vue` filters `BUILT_IN_CONTROL_TABS` against the `controlSurfaces` prop; the reka-fallback hacks DIE (`EasingScene`/`SpringScene` carry no `onMounted+nextTick` re-assert).
- **D2 TOTALITY** — re-derives `CONTROL_SURFACES` from source; all 8 declared scenes map AND `controlSurfacesFor` is TOTAL (unknown id → the built-in triad), so every `(scene → scene)` nav cell resolves a DEFINED set.
- **D3 LIVE PER-SCENE** — easing → ONLY the `Easing` trigger, NO keyframes/timeline node anywhere; spring → ONLY `Spring`; cube/amiga/square → the full triad (`Controls`); sequence/motion-path → NO control panel. (7/7 GREEN.)
- **D4 LIVE NAVIGATION-MATRIX** — drives 7 ordered `(from → to)` pairs (cube↔easing, easing↔sequence, spring↔motion-path, cube→spring); each lands on the DESTINATION's DFA set, no stale surface bleed. (7/7 GREEN.)
- Chains `vitest run test/control-surface-dfa.test.ts` (11/11) — the pure DFA core unit-locked.

### `proof:scene-transition-perf` — `scripts/proof-scene-transition-perf.mjs`
The MEASURE-FIRST transition budget (`bench:scene-transition`).
- **STATIC** — the `CONTROL_SURFACES` table + the TOTAL selector + the projection on the W1 EFFECT layer (`useSceneMachine`) with the reducer (`sceneMachine.ts`) UNTOUCHED (`!/controlSurface/i.test(reducer)`).
- **T1 TRANSITION-BUDGET** — 18 driven transitions over cube↔easing↔spring; per-transition settle measured in-page (`performance.now()` from the `location.hash` assignment to the control-surface re-render committed two rAFs after `activeScene` rests). `BUDGET_MS = 120`. Live p95 ranges **42.7–51.1ms** across runs ≤ 120ms.
- **T2 ROUND-TRIP IDENTITY** — easing↔cube round-trips `{selectedControl, isControlsPanelOpen}` byte-identical (`{selectedControl:"easing", isControlsPanelOpen:true}` resumes). EXTENDS the W1 `proof:scene-machine-irrefragable` field set with the control-surface projection.

---

## §2 — THE MEASURE-FIRST NUMBER (named, not guessed)

`BUDGET_MS = 120` — named from the W11 baseline measured in `impl-w11-dfa.md §3` (p50 ≈ 36ms, p95 ≈ 46–50ms) on the live render (1280×900, built dist). ~2.6× headroom over the measured p95, comfortably under the ~200ms "feels-instant" INP threshold, while still biting a real regression (a transition crossing 120ms is a perceptible hitch). VERIFIED live in this lane: p95 landed at **42.7ms / 50.1ms / 51.1ms** across three runs — all ≤ 120ms with ample margin, the budget BITES without flaking.

---

## §3 — THE BITE (born-RED on the W10 baseline → GREEN on the W11 fix)

Verified by restoring the committed HEAD (`f7fcc40`, the W0–W10 baseline) for the DFA-touched files — `AnimationControls.vue` (hard-coded `controls/keyframes/timeline` triad at `:20-22`), `useSceneMachine.ts`, `ChromeDock.vue`, `EasingScene.vue`, `SpringScene.vue` — and DELETING the W11-only `controlSurfaceDFA.ts`, then re-running each gate's static half. Working tree then restored byte-identical (md5-verified: AC `efd47de8…`, DFA `8cab7b3d…`).

| Gate | @ W10 baseline (HEAD) | @ W11 fix (working tree) |
|------|-----------------------|--------------------------|
| `proof:scene-control-dfa` | **RED** — 3 static failures: D1 hard-coded triad present (`tableDriven:false, noHardCoded:false`); ChromeDock unfiltered; the reka-fallback `onMounted+nextTick` re-assert present (`easingHackGone:false, springHackGone:false`) | **GREEN** — D1+D2 static · D3 7/7 per-scene · D4 7/7 nav-matrix · 11/11 unit |
| `proof:scene-transition-perf` | **RED** (exit FAIL) — `controlSurfaceDFA.ts ABSENT`; projection absent (`projection:false`) | **GREEN** — static · T1 p95=42.7ms ≤ 120ms · T2 round-trip byte-identical |

The W10 baseline correctly reds: the DFA SOURCE is the thing W11 adds, so dropping it reds the static anchors (the explicit owner the reka-hacks stood in for). Note: the perf gate's T1/T2 browser clauses incidentally stayed green at baseline (the localStorage round-trip is a W1-era property already holding) — but the STATIC half reds (DFA absent), which is the correct bite: the gate's NEW assertion is DFA-owner-existence + budget.

---

## §4 — RECONCILE (the DFA EXTENDS W1 — proof:scene-machine-irrefragable stays GREEN)

Re-ran `proof:scene-machine-irrefragable` against the W11 working tree: **PASS, all clauses** — `irrefragable-matrix: 6/6 ordered (A→B→A) cells identity-preserving over [cube, easing, amiga]`; "one authority, one reducer, one-way projections, explicit SCENE_READY, genuine SUSPEND." The DFA is a PURE orthogonal projection (`controlSurfaces` derives from `activeScene` only); the W1 reducer is untouched (the perf gate's STATIC half asserts `reducerUntouched`). The keystone did not break — the RECONCILE requirement holds.

---

## §5 — WIRING

- **package.json** (already present from the impl lane, lines 81–82):
  - `proof:scene-control-dfa` → `node scripts/proof-scene-control-dfa.mjs && vitest run test/control-surface-dfa.test.ts`
  - `proof:scene-transition-perf` → `node scripts/proof-scene-transition-perf.mjs`
- **ci.yml** (THIS lane wired) — both inserted into the demo-smoke browser job right AFTER `proof:scene-machine-irrefragable` (they EXTEND it + settle-gate on the same FSM), each with `KF_REQUIRE_BROWSER: "1"` (the playwright-absent → hard-fail discipline) + a multi-line provenance comment naming the born-RED W10 baseline + the budget rationale. YAML validated (python `safe_load`).
- **`proof:ci-coverage`** — GREEN (every `proof:*` in package.json is now invoked in CI; the workflow-hygiene clauses 1–3 pass → the YAML insertion is well-formed). Without this wiring, ci-coverage clause-0 would have red.

H.W8 (the gate-regime wave) folds both into `proof:all` at gate-regime time; THIS lane leaves them in package.json + ci.yml + ci-coverage-clean (the CI runs gates distributed across jobs, not via a single `proof:all` call — the recorded ci-coverage exclusion).

---

## §6 — FILE FOOTPRINT (this lane)

MODIFIED:
- `.github/workflows/ci.yml` — the two `proof:scene-control-dfa` / `proof:scene-transition-perf` browser-gate steps (the ONLY edit this lane made).

VERIFIED (authored by the impl lane, certified here):
- `scripts/proof-scene-control-dfa.mjs`, `scripts/proof-scene-transition-perf.mjs` — both BITE + GREEN.
- `test/control-surface-dfa.test.ts` — 11/11.
- `package.json:81-82` — the two scripts.

NOT touched: the engine (`src/animation` — FENCED, inv ζ); the W1 reducer (`sceneMachine.ts`); the DFA impl (`controlSurfaceDFA.ts` / `useSceneMachine.ts` / `AnimationControls.vue` / `ChromeDock.vue` / the scenes — owned by the impl lane); the stage/subgrid/bezier lanes.

tsc-clean (`tsc --noEmit` exit 0) after the lane.
