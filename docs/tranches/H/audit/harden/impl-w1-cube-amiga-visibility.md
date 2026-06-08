# H.W1 impl — CUBE + AMIGA + VISIBILITY-FOLD lane (`impl-w1-cube-amiga-visibility.md`)

Lane charge: the cube + amiga scenes (AnimationGroup-based) + the visibility
fold. (1) CONFIRM cube + amiga register the AnimationGroup `ScenePlayback`
adapter from the Core; (2) FOLD `useSceneVisibilityPause` into the machine as
TAB_HIDDEN/TAB_SHOWN PRESERVING its "only resume what IT paused" (autoPaused)
contract — do NOT rewrite it; (3) tsc-clean; (4) note changes.

Verdict: the Core (`impl-w1-core-api.md`) already wired BOTH halves correctly —
cube/amiga group-adapter registration AND the status-only TAB fold beside the
PRESERVED per-scene loop owner. This lane CONFIRMED both live + made the
load-bearing autoPaused half FALSIFIABLE with a new biting unit test. Zero source
edits to cube/amiga/visibility-pause (PRESERVED untouched). `npx tsc --noEmit` → 0.

---

## 1. Files (left in tree, NOT committed)

| File | Role |
|---|---|
| `test/scene-visibility-pause.test.ts` | NEW — the visibility-fold contract test (3 cases): the autoPaused "only resume what IT paused" honesty, locked directly on `useSceneVisibilityPause`. The load-bearing half (clause 2) BITES — see §4. |

PRESERVED untouched (verified `git diff --stat` empty): `demo/cube/useCubeAnimations.ts`,
`demo/amiga/useAmigaAnimations.ts`, `demo/app/scenes/CubeScene.vue`,
`demo/app/scenes/AmigaScene.vue`, `demo/app/useSceneVisibilityPause.ts`. No
rewrite — the spec mandates PRESERVE for the visibility composable.

---

## 2. Adapter registration — CONFIRMED (no edit needed)

Cube + amiga register the AnimationGroup `ScenePlayback` adapter through the
Core's existing path; no per-scene wiring was needed because both scenes already
expose `animationGroup` and neither exposes a `scenePlayback` (so they fall to the
group-adapter branch):

- `useSceneMachineApp.bindSceneAdapter()` reads `sceneRef.value.animationGroup`,
  `markRaw`s it into `currentAnimationGroup`, then
  `createGroupAdapter(() => currentAnimationGroup.value)` and
  `machine.register(currentSceneId.value, adapter)`.
- CubeScene exposes `animationGroup: computed(() => animationGroup.value)`;
  AmigaScene exposes `animationGroup: computed(() => animationGroup)` (a plain
  group). Both unwrap to the live `AnimationGroup` the group adapter reads.

LIVE PROOF (dev server `:5200`, deep-linked cube, Play, 700ms): the persisted
machine context (`localStorage["keyframes-js-scene-machine"]`) shows the cube
snapshot carries all THREE cube animations with per-animation
`{t, reversed, iteration}` — exactly `createGroupAdapter.snapshot()`'s output
(iterating `group.animations`), `playing:true, started:true`. The amiga snapshot
(captured on its earlier pre-leave SUSPEND) carries all FOUR amiga animations
(`Rotations`, `Bouncing X/Y/Z`) — proving the amiga group adapter is registered
AND that the genuine pre-leave `captureActive()` snapshotted it before the new
scene started. The easing snapshot is `{progress, animations:{}}` (the raw-rAF
family), confirming both adapter families coexist correctly. The Core's
`test/e-w1-encapsulation.test.ts` already gates the group adapter's
`snapshot()→restore()` round-trip on a fixture group — no duplication added.

---

## 3. The visibility fold — CONFIRMED complementary, NOT a double-act

The tab-visibility concern is folded into the machine as TAB_HIDDEN/TAB_SHOWN
*status-only* events, BESIDE the PRESERVED per-scene `useSceneVisibilityPause`
that owns the actual loop. The two are complementary by design (spec S5/S9.d,
Core API §7):

- `useSceneMachineApp.ts:193-196` — an App-level `useDocumentVisibility` watcher
  dispatches `TAB_HIDDEN`/`TAB_SHOWN`. The reducer
  (`sceneMachine.ts:180-191`) parks the STATUS axis only (`playing→suspended` on
  hide; `suspended→re-derive` on show), guarded so a paused/idle scene is inert.
- `sceneMachine.ts applyEffects` routes TAB_HIDDEN/TAB_SHOWN to the `default`
  branch — NO adapter call. So the machine NEVER stops/restarts the loop on tab
  visibility.
- cube (`useCubeAnimations.ts:112`) + amiga (`AmigaScene.vue:122`) keep their
  `useSceneVisibilityPause` over the group `pause()/resume()` (cube) / the WebGL
  present loop `stopRenderLoop/startRenderLoop` (amiga). It alone owns the loop
  with the autoPaused contract.

No double-act: the machine parks status; the per-scene composable pauses/resumes
the loop. They never both touch the loop.

LIVE PROOF:
- **cube (AnimationGroup, DOM)** — Play → cube transform advances; tab HIDE →
  transform FROZEN (group paused, autoPaused armed); tab SHOW → transform
  advances again (resumed). Contrapositive: a USER-PAUSED cube stays paused
  across a hide/show cycle (autoPaused never armed → no spurious resume).
- **amiga (AnimationGroup + WebGL)** — hooked `requestAnimationFrame`: the
  present loop's per-window frame count drops on HIDE (the `animate()` self-loop
  ceases) and jumps on SHOW (resumed). The WebGL loop is genuinely suspended on a
  hidden tab and re-armed on return.

---

## 4. The new gate BITES (the autoPaused half the fold must not break)

`test/scene-visibility-pause.test.ts` locks the contract the spec says to
PRESERVE. It mounts `useSceneVisibilityPause` in a real Vue setup and drives
`document.visibilityState` + `visibilitychange` (awaiting `nextTick` for the
async `watch`). Three clauses:
1. a RUNNING loop is paused on hide, resumed on show (auto-pause it armed);
2. a USER-PAUSED loop (not running at hide) is NEVER auto-resumed on show — the
   load-bearing honesty;
3. a spurious second `visible` (no intervening hide) is inert (autoPaused cleared).

BITE VERIFIED: patching `useSceneVisibilityPause` to resume UNCONDITIONALLY (the
exact regression a careless fold would cause — dropping the `autoPaused`/
`wasRunning` gate) REDS clause 2; reverted clean (no diff on the composable).

The reducer's TAB status-axis behavior is separately gated by the Core's
`test/scene-machine-reducer.test.ts:126` ("TAB_HIDDEN only suspends a playing
scene; TAB_SHOWN re-derives"). Together: the machine's status fold AND the
per-scene loop-owner contract are both locked.

---

## 5. tsc + tests

- `npx tsc --noEmit` → exit 0 (clean).
- `vitest run test/scene-machine-reducer.test.ts test/scene-visibility-pause.test.ts
  test/e-w1-encapsulation.test.ts test/scene-raf-leak.test.ts` → 21 passed.
- full suite `vitest run` → 64 files, 660 passed + 1 expected-fail (a
  pre-existing born-RED gate, unrelated). No regression from the added test.

## 6. Note for the GATES phase

- The cross-scene playback round-trip (cube↔easing identity — the
  `proof:scene-machine-irrefragable` matrix + `proof:scene-contract-identity`)
  is the Gates lane's charge; this lane confirmed the cube/amiga group adapter is
  registered + snapshotted (the precondition that gate relies on).
- A stale Vite transform-cache error (`PERSIST_KEY is not defined` from
  `useSceneMachine.ts?t=…`) was observed transiently — it is an HMR artifact of a
  CONCURRENT lane renaming `PERSIST_KEY → SCENE_MACHINE_PERSIST_KEY` mid-session,
  NOT a real defect. A dev-server restart + `node_modules/.vite` clear made the
  console clean (0 errors on cube + amiga). Current source is correct.
