# H.W1 impl — SPRING + STARTING-STYLE lane (`impl-w1-spring-startingstyle.md`)

The lane-4 sibling: re-wire `demo/spring/` (the Spring scene) AND the
starting-style scene to the raw-rAF `ScenePlayback` contract from the Core API
(`impl-w1-core-api.md`). Each scene now REGISTERs its `ScenePlayback` adapter
(via the App's `bindSceneAdapter` on SCENE_READY), gates its loop on
`machine.status === 'playing'` (where it HAS a loop), and round-trips
`progress`/`isPlaying` through the CONTRACT — the same transposition the easing
scene (the literal D12 repro) landed. `npx tsc --noEmit` → 0 across `src/` +
`demo/`. DO NOT git-committed — left in tree.

---

## Files changed

| File | Change |
|---|---|
| `demo/spring/useSpringDemo.ts` | RE-WIRED — the SHADOW authority DELETED (private `isPlaying = ref(true)` + the bidirectional dummy-group `paused` hand-sync); `isPlaying` is now `computed(() => machine.status.value === 'playing')`; the loop gates on `machine.status`; play/pause/reset dispatch to the machine; a `progress` (sampler-phase) ref + `startLoop`/`stopLoop` + a `createRafAdapter` `scenePlayback` round-trip the sweep phase + play intent. The `contractAnim` group is RETAINED as the bottom-bar transport host with a ONE-WAY `paused` projection (no longer a playback authority). |
| `demo/app/scenes/SpringScene.vue` | exposes `scenePlayback: demo.scenePlayback` + `autoPlays: true` (mirrors EasingScene). `isPlaying` documented as a readonly machine projection. |
| `demo/spring/useStartingStyleDemo.ts` | NEW — the starting-style scene's composable. Owns the `visible` discrete-transition toggle (lifted OUT of the Target so the contract can round-trip it) + the dummy transport group + a `createRafAdapter` `scenePlayback`. `isPlaying` is a readonly machine projection. |
| `demo/spring/startingStyleKeys.ts` | NEW — `STARTING_STYLE_DEMO_KEY` injection key + `StartingStyleDemoContext` type (mirrors `springKeys.ts`). |
| `demo/app/scenes/StartingStyleScene.vue` | REWRITTEN — was an inline dummy-group scene; now uses `useStartingStyleDemo`, provides the demo context, exposes `scenePlayback`. NO `autoPlays` (its motion is a user-driven CSS discrete transition, not an auto-running sweep). The inline `contractAnim`/group moved into the composable. |
| `demo/spring/StartingStyleTarget.vue` | injects `visible`/`toggle` from `STARTING_STYLE_DEMO_KEY` instead of owning local `ref(true)`; the `springLinearStops` artifact (preset switch + `springCss` + copy payload) stays local (it is the copy-paste-artifact concern, not playback state). |

---

## Why each move (binding to the spec)

- **The shadow-authority kill (S2 / WV-W1-HIGH-3).** `useSpringDemo` carried the
  exact D12 smell easing had: a private `isPlaying = ref(true)` and a dummy
  `AnimationGroup` whose `paused` it bidirectionally hand-synced. Both DELETED.
  `isPlaying` derives from `machine.status`; the loop's first line is now
  `if (machine.status.value !== 'playing') return false;` (the loop
  self-terminates when the machine leaves `playing`). The group's `paused` is a
  ONE-WAY `watch(isPlaying, …)` projection — the machine is the authority.

- **The raw-rAF round-trip (WV-W1-HIGH-3).** Spring exposes `progress` (the
  normalized sampler sweep phase, written each frame) and a `createRafAdapter`
  handle. On suspend the adapter snapshots `getProgress()`; on restore it
  re-seats it and `startLoop` rebases `startTime` from it, so the sweep resumes
  in phase. This is the NON-VACUOUS scalar `proof:scene-contract-identity`'s
  `spring↔cube` cross-pair bites (the `contractAnim` group has no position).

- **Starting-style has NO rAF loop — its motion is declarative CSS.** The
  `@starting-style`/`allow-discrete` transition (eased by a spring `linear()`) is
  driven by a `visible` toggle, not a JS loop. So there is no per-frame sweep to
  gate. The faithful contract round-trips the ONE scene fact — `visible` —
  encoded as `progress` (1=shown, 0=dismissed); the loop methods
  (`startLoop`/`stopLoop`/`isLoopRunning`) are INERT (no phantom rAF). This keeps
  the scene on the SAME `ScenePlayback` contract (so suspend/restore route
  through the CONTRACT, not the dummy group) without inventing a loop it does not
  have. `visible` had to be LIFTED out of `StartingStyleTarget.vue` into the
  composable so it is reachable by the adapter — the Target now injects it.

- **`autoPlays` asymmetry (S5 / S4).** Spring sets `autoPlays: true` (its preview
  sweep auto-ran via the old `isPlaying = ref(true)`; on SCENE_READY the App
  dispatches PLAY so the machine reaches `playing` and the gated loop sweeps).
  Starting-style sets NO `autoPlays` — its motion is a user gesture; on
  SCENE_READY it rests `paused`, and the SCENE_READY restore re-seats `visible`
  from the snapshot on a return visit (the raw adapter's `snapshot()` reports
  `started: true`, so restore fires on re-entry; on a first-ever entry the fresh
  snapshot is `started: false` so `visible` keeps its default).

- **`ownsPlayback` (readonly `isPlaying`).** Both scenes expose `scenePlayback`,
  so the App's `onPlayStateChange` sees `ownsPlayback === true` and does NOT
  write `sceneRef.value.isPlaying` — correct, since `isPlaying` is now a readonly
  machine-derived computed (writing it would throw "computed is readonly").

---

## springLinearStops triple-fork — LEFT for H.W5 (not in scope)

The lane named a possible "triple-forked `springLinearStops` usage" to collapse
"IF in scope (else leave for H.W5)." Audited: there are exactly TWO demo call
sites — `SpringSidebar.vue:130` (live-param CSS editor) and
`StartingStyleTarget.vue:95` (the preset-keyed copy artifact). Both already call
the single `springLinearStops` source directly with LEGITIMATELY DIFFERENT params
(live sliders vs. a chosen preset). There is no divergent fork to DRY — a shared
helper would not reduce duplication (the params differ by design). LEFT for H.W5
per the lane's escape clause; no change made.

---

## Verification

- `npx tsc --noEmit` → 0 errors (tsconfig includes `src/` + `demo/`).
- `vitest run test/scene-machine-reducer.test.ts test/scene-raf-leak.test.ts
  test/adapter-capture.test.ts` → 21 passed (the reducer + raf-leak + group
  adapter round-trip gates are unaffected).
- No leftover `ensureLoop` / private `isPlaying = ref` in `demo/spring/`.

## Notes for the GATES phase

- `proof:scene-contract-identity` should add `spring↔cube` / `cube↔spring`
  cross-pair rows alongside the named `easing↔cube` rows — spring now round-trips
  `progress`/`isPlaying` identically to easing.
- `proof:suspend-no-orphan-raf` covers spring's loop (a real `RAFPlayback` the
  machine's `captureActive` → `adapter.suspend()` stops on NAVIGATE-away);
  starting-style has NO loop, so it cannot orphan one (its adapter `suspend()` is
  inert by construction).
- starting-style is the SECOND raw-rAF scene with no AnimationGroup position
  (after easing) — `proof:group-snapshot-identity` would pass vacuously on it too;
  the raw contract is what bites.
