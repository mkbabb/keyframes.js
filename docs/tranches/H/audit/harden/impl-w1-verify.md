# H.W1 impl — VERIFY lane (`impl-w1-verify.md`)

The VERIFY lane: run the full build/test/gate suite against the landed keystone
(the scene+playback FSM), report verbatim, and diagnose any RED that should be
GREEN. I authored NO features — only ran builds/gates and confirmed lane seams
integrate. NOT committed; left in tree for the lead.

Tree state at verify time: branch `tranche-h-impl`, working-tree W1 edits in
place (CORE/HEART/Adapter/Gate lanes' files, all uncommitted per the brief).
Build artifact `dist/gh-pages/` freshly rebuilt by this lane (`npm run gh-pages`).

---

## 1. The result table (verbatim)

| # | Step | Command | Result | Verbatim |
|---|------|---------|--------|----------|
| 1 | tsc | `npx tsc --noEmit` | **GREEN** | `TSC EXIT: 0` · 0 lines of output |
| 2 | tests | `npm test` (vitest) | **GREEN** | `Test Files 66 passed (66)` · `Tests 666 passed \| 2 expected fail (668)` · exit 0 |
| 3 | demo build | `npm run gh-pages` | **GREEN** | `✓ built in 1.39s` · exit 0 (rolldown PURE/chunk-size advisories only, pre-existing — NOT errors) |
| 4a | browser keystone | `KF_REQUIRE_BROWSER=1 proof:scene-machine-irrefragable` | **GREEN** | all 7 clause groups ✓; `6/6 ordered (A→B→A) cells identity-preserving`; exit 0 |
| 4b | browser popover | `KF_REQUIRE_BROWSER=1 proof:dock-popover-opens` | **GREEN** | `finalOpen:true` ✓; exit 0 |
| 4c | browser toggle | `KF_REQUIRE_BROWSER=1 proof:single-toggle` | **GREEN** | clean latch `closed→open→closed→open` ✓; exit 0 |
| 5a | static guard | `proof:no-deprecated-guard` | **GREEN** | `router.ts calls next( 0 times` ✓; exit 0 |
| 5b | static writer | `proof:single-writer` | **GREEN** | `159 demo source files` swept; `one writer (dispatch)` ✓; exit 0 |
| 5c | timing-heuristic | (folded as clause C7 of `proof:scene-machine-irrefragable`) | **GREEN** | `no-timing-heuristic: the restore is DETERMINISTIC across 2 timing-perturbed mounts` ✓ |
| 6 | coverage | `proof:ci-coverage` | **GREEN** | `all 43 proof:* gates are invoked in CI (4 recorded exclusions)`; exit 0 |
| — | unit (contract) | `proof:scene-contract-identity` | **GREEN** | `Tests 5 passed (5)`; exit 0 |
| — | unit (HANDOFF) | `proof:group-snapshot-identity` | **GREEN** | `Tests 1 passed \| 1 expected fail (2)` (the `it.fails` witness); exit 0 |
| — | rAF leak | `proof:scene-raf-leak` | **GREEN** | `Tests 2 passed (2)`; exit 0 |
| — | reducer unit | `vitest test/scene-machine-reducer.test.ts` | **GREEN** | `Tests 13 passed (13)` (not wired to package.json — not this wave's gate) |
| — | visibility fold | `vitest test/scene-visibility-pause.test.ts` | **GREEN** | `Tests 3 passed (3)` (TAB_HIDDEN/TAB_SHOWN) |
| — | W0 console (shared) | `KF_REQUIRE_BROWSER=1 proof:demo-console-clean` | **GREEN** | 5 clauses ✓ — the keystone integration introduced NO new console error |

**Every required clause is GREEN. NO RED-that-should-be-GREEN.** No paper-overs.

---

## 2. The 2 expected-fail (witnessed, correct)

The `2 expected fail` in `npm test` are EXACTLY the two born-RED HANDOFF witnesses
(`it.fails`), confirmed by `grep -rn "it.fails" test/`:

1. `test/interpolate-anything.test.ts:256` — MCI-5 value.js HANDOFF (pre-existing,
   Tranche-G era).
2. `test/group-snapshot-identity.test.ts:75` — **this wave's** S6 engine
   `serialize()/hydrate()` HANDOFF. GREEN today (seam absent), FLIPS RED when the
   engine ships the seam.

Neither is a defect; both are the chronic-closure discipline (inv-27: not a
perpetually-red gate — the suite stays green while the HANDOFF is pending).

---

## 3. inv-16 — NO engine serialize/hydrate authored (CONFIRMED)

- `grep -rnE "(serialize|hydrate)\s*\(.*\)\s*[:{]|\.(serialize|hydrate)\s*="
  src/animation/group.ts src/animation/engine.ts` → exit 1 (NO method).
- `grep -nE "GroupSnapshot|g\.serialize|g\.hydrate|\.serialize\(\)|\.hydrate\("
  src/ -r` → empty (NO type, NO call site).
- The only `serialize*` matches in `src/animation/` are the pre-existing
  `serializeEasing` (Tranche-G CSS easing serializer) + prose comments — NOT the
  AnimationGroup seam.

**The seam exists ONLY as the `it.fails` witness in
`test/group-snapshot-identity.test.ts`.** inv-16 HONORED: the engine half is the
HANDOFF; the demo uses the existing imperative `restoreGroupPlaybackState`
(re-homed into `scenePlaybackAdapters.ts`), NOT a new engine API.

---

## 4. BITE checks (2 clauses, RED→GREEN, no residue)

Per the brief: 2 clauses bite-checked. (Done via surgical inject+revert of the
exact named regression rather than `git stash` of a whole file — `router.ts`/
`App.vue` are W1-modified files in the working tree, so a `git stash` of either
reverts the ENTIRE W1 change, not just the fix-under-test; the surgical inject
is the precise equivalent and leaves the W1 change intact.)

| Clause | Injected regression | RED result | After revert |
|---|---|---|---|
| `proof:no-deprecated-guard` | `next(); // TEMP BITE` into `router.ts` beforeEach | **RED** exit 1 — `✗ router.ts calls the deprecated next( 1 time(s) at line(s) 58` | **GREEN** exit 0 |
| `proof:single-writer` | `machine.activeScene.value = HOME_SCENE_ID; // TEMP BITE` into `App.vue` | **RED** exit 1 — `✗ demo/app/App.vue:190 assigns machine.activeScene.value =` | **GREEN** exit 0 |

`grep -rn "TEMP BITE" demo/ scripts/ test/` → exit 1 (ZERO residue). Both files
verified back at their W1 baseline (the only remaining `next() is deprecated`
match in `router.ts` is the legitimate S5 docstring PROSE, which the gate's
comment-blanker correctly ignores — that is why GREEN holds on revert).

Both gates are NON-vacuous: each reds on the exact regression the spec names,
with a precise file:line.

---

## 5. CI wiring (confirmed in `.github/workflows/ci.yml`)

- `gates` job (vitest, glass-ui-free): `proof:scene-contract-identity` (:149),
  `proof:group-snapshot-identity` (:151) — adjacent to `proof:scene-raf-leak`.
- `demo-smoke` job (`KF_REQUIRE_BROWSER: "1"`, post `npm run gh-pages`):
  `proof:scene-machine-irrefragable` (:207), `proof:dock-popover-opens` (:211),
  `proof:single-toggle` (:215).
- `demo` job (static greps, no browser): `proof:no-deprecated-guard` (:243),
  `proof:single-writer` (:245).
- `proof:ci-coverage` GREEN: 43 gates invoked, no authored-but-unrun gate.

---

## 6. Lane-seam integration notes (no new features added)

- All seven impl lanes' files integrate clean: `tsc` 0 errors across the
  CORE (`sceneMachine.ts`/`useSceneMachine.ts`), Adapters (`scenePlaybackAdapters.ts`),
  router reconcile (`useSceneMachineRouter.ts`/`useSceneMachineApp.ts`),
  re-wired easing (`useEasingDemo.ts`), App.vue integration, and all gate scripts.
- Deleted files (no legacy beside replacement) confirmed gone from the working
  tree: `usePlaybackSnapshot.ts`, `useSceneGroupSync.ts` (isStableFire),
  `useSceneRouter.ts`, `useSceneUrl.ts`, `stores/scenePlayback.ts`.
- No integration break required a fix by this lane — the suite was already
  cohesive across lanes when verify ran.

### Minor doc-vs-reality drift (NON-blocking, for the lead)

- `impl-w1-core-api.md:24` says the reducer test has "16 cases"; it actually
  runs **13** (`test/scene-machine-reducer.test.ts` → 13 passed). The test is
  green and not a gate (unwired); drift is cosmetic.
- Several lane notes cite different coverage counts (38 / 40 / 42 / 43 gates) —
  these were written incrementally as each lane wired its gates. The FINAL,
  authoritative count is **43** (`proof:ci-coverage` at verify time). Not a
  defect — just stale intermediate snapshots.

---

## 7. Verdict

H.W1 — THE KEYSTONE — passes the full VERIFY suite GREEN:
tsc 0 · 666+2xf tests · demo builds · 7-clause browser keystone +2 popover gates ·
2 static gates · ci-coverage 43/43 · 2 BITE checks RED→GREEN · inv-16 honored
(no engine serialize/hydrate authored; only the `it.fails` witness). No
RED-that-should-be-GREEN. Ready for the lead's review + commit.
