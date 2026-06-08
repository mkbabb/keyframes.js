# H.W1 impl — SEQUENCE + MOTION-PATH lane (`impl-w1-sequence-path.md`)

Lane: re-wire `demo/sequence/` + `demo/motion-path/` to the `ScenePlayback`
contract (WV-W1-HIGH-3). Binds to the CORE+HEART surface in
`impl-w1-core-api.md` (the `createRafAdapter`/`createGroupAdapter` factories, the
`register()` registry, `useSceneMachine().dispatch`/`.status`). tsc-clean
(`npx tsc --noEmit` → 0); the full vitest suite passes (660 + 1 expected-fail =
the born-RED engine HANDOFF gate). DO NOT git commit — left in tree.

---

## 1. The disposition (read FIRST — the two scenes are DIFFERENT architectures)

The spec's contract comment lists "easing/spring/sequence/**path**" as raw-rAF,
but the ACTUAL code is split:

| Scene | Architecture | Adapter | Lane work |
|---|---|---|---|
| **sequence** | raw-rAF — own `Sequence.play()` loop + a reactive mirror loop, a private `isPlaying` ref, NO real AnimationGroup position (the `contractAnim` dummy is a transport host only) | **`createRafAdapter`** (self-exposed) | **FULL re-wire** |
| **motion-path** | group — `fromMotionPath` returns a real `CSSKeyframesAnimation` wrapped in a real `AnimationGroup`; rides the bottom-bar transport; NO custom loop, NO `progress` ref | **`createGroupAdapter`** (App-wrapped) | **already wired — doc-only** |

Forcing motion-path into `createRafAdapter` would be a FICTION: it has a genuine
per-animation `{t, reversed, iteration}` clock the group adapter snapshots, and
NO rAF loop / `progress` / `startTime` to round-trip. The raw-rAF adapter reports
`animations: {}` — wrapping a real group in it would DISCARD the real clock (a
regression, and a fail-explicit / no-legacy violation). So motion-path stays a
GROUP-adapter scene, registered centrally by `useSceneMachineApp.bindSceneAdapter`
(the App owns group-adapter registration; only raw-rAF scenes self-expose
`scenePlayback`). This is the honest architecture, not an oversight — the core
lane already updated the motion-path doc comment to "registers its ScenePlayback
adapter (H.W1)" via the group watcher.

---

## 2. Files changed (left in tree, NOT committed)

| File | Change |
|---|---|
| `demo/sequence/useSequenceDemo.ts` | RE-WIRED to the raw-rAF contract (the deliverable — see §3) |
| `demo/sequence/SequenceTarget.vue` | mount `seek(0)` → `sequence.progress = progress.value` (paint the live playhead, not a hard 0 — survives the SCENE_READY restore regardless of mount/restore order) |
| `demo/app/scenes/SequenceScene.vue` | `defineExpose` now exposes `scenePlayback: demo.scenePlayback` (so the App registers the raw-rAF adapter, NOT the dummy-group adapter) |
| `demo/motion-path/useMotionPathDemo.ts` | doc-comment only (already updated by the core lane to name the machine group watcher) — NO code change needed; group-adapter scene |

`SequenceScene`/`MotionPathScene`/`SequenceTarget`/`MotionPathTarget` produce
ZERO vue-tsc errors (the 95 pre-existing vue-tsc errors are unrelated:
playground DOM-lib clash, spring `SpringPreset` export, `timeline.ts`
`ScrollAxis`/globalThis — verified identical with my edits stashed; vue-tsc is
NOT in the build pipeline, `tsc --noEmit` is the project gate and is clean).

---

## 3. The Sequence re-wire — ONLY the machine-integration seam (transport PRESERVED)

The Sequence is ALREADY-SOTA as a transport — its internals (the `Sequence`
class play/pause/resume/reverse/timeScale/seek, the no-forward-jump re-anchor,
the C⁰-continuity) are UNTOUCHED. The seam changes:

1. **The shadow authority is DELETED.** The former private `isPlaying = ref(false)`
   (the D12 smell — a second source of truth nothing could suspend) → a read-only
   `computed(() => machine.status.value === 'playing')`. `play()`/`pause()`/
   `reset()` now `machine.dispatch(...)`; the transport UI reads the computed.
2. **The mirror loop gates on the machine.** `mirror.loop(() => { sync(); return
   machine.status.value === 'playing'; })` — when the machine leaves `playing`
   the reactive readout loop self-terminates (no orphan rAF).
3. **The raw-rAF adapter** (`createRafAdapter`) round-trips `progress`/`isPlaying`
   through `getProgress`/`setProgress` (`sequence.progress`) + `startLoop`/
   `stopLoop`. The App registers it on SCENE_READY; the machine's effect layer
   calls `suspend()`/`resume()`/`restore()` through the CONTRACT (the single
   suspend path — `captureActive` stops the loop BEFORE the next scene starts).
4. **`startLoop`/`stopLoop` are the ONE engine-loop seam.** `startLoop` keeps the
   ORIGINAL play-vs-resume split byte-for-byte (`isMidPlay()` → `sequence.resume()`
   continue from the playhead; settled → fresh `sequence.play()`); the only added
   behavior is the natural-end `.finally` dispatches `PAUSE` so the machine status
   reflects the engine settling. `stopLoop` = `sequence.pause()` + stop mirror
   (genuine suspend, no rewind — the snapshot already captured the playhead).
5. **`reverse`/`setTimeScale`/`scrub` keep their EXACT engine calls.** `reverse`
   flips `sequence.reverse()` first (the SOTA call), then dispatches `PLAY` ONLY
   when paused-AND-mid (matching the original `sequence.resume()` path — a
   reverse-from-settled stays an effective no-op for the loop, as it was before,
   NOT a spurious forward replay). `scrub` additionally dispatches `SCRUB` so the
   scrubbed playhead round-trips on a scene switch.
6. **ONE-WAY group projection.** `watch(isPlaying, p => animationGroup.paused =
   !p, {immediate})` — the dummy transport host's `paused` mirrors the machine so
   the bottom-bar play button reflects the true state (read-only; NOT the former
   bidirectional hand-sync).
7. **VisibilityPause PRESERVED (autoPaused).** `useSceneVisibilityPause(() =>
   mirror.running, stopLoop, startLoop)` — "only resume what IT paused"; the
   machine drives NO adapter on TAB_HIDDEN/TAB_SHOWN (status-only), so the
   per-scene gate is the sole loop owner on tab visibility (no double-act).

`SequenceDemo` now also returns `scenePlayback` (injected via `SEQUENCE_DEMO_KEY`,
consumed by the App's `defineExpose`). No consumer reads a removed field.

---

## 4. Round-trip identity (proof:scene-contract-identity bites here)

`createRafAdapter` snapshot/restore for sequence:
- `snapshot()` → `{ playing: machine.status==='playing', started: true,
  animations: {}, progress: sequence.progress }`.
- `restore(snap)` → `sequence.progress = snap.progress` (targets attached at
  SCENE_READY — `SequenceTarget.onMounted` `setTargets` runs before `@resolve`),
  then `startLoop()` iff `snap.playing` else `stopLoop()`. The reducer sets
  `status = snap.playing ? 'playing' : 'paused'`, so `isPlaying`, the mirror, and
  the engine loop are all consistent on re-entry.

The `easing↔sequence`/`sequence↔cube` cross-pairs the gate names round-trip
because the machine calls the CONTRACT (not a group): sequence's adapter restores
`progress`; cube's group adapter restores `{t,reversed,iteration}`; neither is
vacuous.

---

## 5. Notes for the GATES phase

- **sequence** = the raw-rAF clause's second witness beside easing (a real
  `Sequence` engine loop, unlike easing's `NumericAnimation` sweep). Drive its
  `progress` via the in-app master scrubber (the `SequenceTarget` `seek`-on-mount
  now seeds the LIVE playhead, so a restored progress is not clobbered).
- **motion-path** = a GROUP-adapter scene → `proof:group-snapshot-identity`
  territory (the born-RED engine HANDOFF), NOT `proof:scene-contract-identity`.
  Its real `CSSKeyframesAnimation` round-trips `{t,reversed,iteration}` through
  `createGroupAdapter`/`restoreGroupPlaybackState` exactly like cube/amiga/square.
- **Pre-existing transport edge (NOT introduced here):** scrub-while-fully-stopped
  then play is an effective engine no-op (no live `_playingPromise` for
  `sequence.resume()` to continue, and a fresh `play()` would reset `_time` to 0).
  This was the original transport's behavior; the seam re-wire preserves it
  byte-for-byte rather than touching `Sequence` internals (inv: SOTA transport
  untouched). If a future lane wants play-from-scrubbed-rest, that is a `Sequence`
  engine change, not a demo-seam change.
