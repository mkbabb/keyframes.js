# H.W1 impl — CORE+HEART lane API handoff (`impl-w1-core-api.md`)

The EXACT exported surface the Adapters + Gates phases bind to. This is the
contract; everything below is implemented, tsc-clean (`npx tsc --noEmit` → 0),
and live-verified against the running demo (`:5200`). DO NOT re-litigate the
RESOLVED design decisions — bind to the surface as stated.

---

## 1. Files landed (left in tree, NOT committed)

| File | Role |
|---|---|
| `stores/sceneMachine.ts` | NEW — the PURE core: types + the `transition` reducer + the `ScenePlayback` contract interface (248L, unit-testable, no Vue) |
| `stores/useSceneMachine.ts` | NEW — the EFFECT layer: the `createGlobalState` store (dispatch + readonly refs + register + GC + adapter effects) over the pure core |
| `stores/scenePlaybackAdapters.ts` | NEW — the AnimationGroup adapter (`createGroupAdapter`) + the raw-rAF adapter (`createRafAdapter`) + the re-homed imperative `restoreGroupPlaybackState` |
| `demo/app/useSceneMachineRouter.ts` | NEW — the route reconcile (ONE reader + ONE writer + echo guard) + first-load seed + `?anim=` projection + boot GC |
| `demo/app/useSceneMachineApp.ts` | NEW — the scene-machine ↔ App-shell reconcile: adapter binding, SCENE_READY emit, play/pause routing, scene switch, tab-visibility fold (extracted so App.vue stays ≤350L) |
| `demo/app/App.vue` | INTEGRATED — binds the machine; home↔cube split; S8 popover un-wrap; delegates playback wiring to `useSceneMachineApp` (294L) |
| `demo/easing/useEasingDemo.ts` | RE-WIRED — the D12 literal repro; shadow `isPlaying` DELETED; loop gates on `machine.status`; exposes a raw-rAF `scenePlayback` adapter |
| `demo/app/scenes/EasingScene.vue` | exposes `scenePlayback` + `autoPlays: true` |
| `demo/app/router.ts` | `next()` → returned value (S5) |
| `stores/index.ts` | barrel re-exports the machine + adapters; type exports re-homed (MED-2) |
| `test/scene-machine-reducer.test.ts` | NEW — pure-reducer unit test (16 cases) |
| `test/e-w1-encapsulation.test.ts` | RE-HOMED — gates the group adapter round-trip |
| `test/scene-raf-leak.test.ts` | updated — seeds the machine to `playing` (easing now gates on it) |

(`stores/` = `demo/@/components/custom/animation-controls/stores/`. The pure
reducer + the `createGlobalState` store are SPLIT across two files to honor the
`proof:decomposition` ceiling — both import-compatible through the barrel.)

**`useSceneMachine` import:** the barrel (`@components/custom/animation-controls/
stores`) re-exports it; a direct deep import is `stores/useSceneMachine` (NOT
`stores/sceneMachine` — that is the pure core only). `transition` + all types +
`HOME_SCENE_ID` come from `stores/sceneMachine` (or the barrel).

**DELETED (no legacy beside replacement):** `stores/scenePlayback.ts` (the bare
Map), `demo/app/usePlaybackSnapshot.ts`, `demo/app/useSceneGroupSync.ts`
(`isStableFire`), `demo/app/useSceneRouter.ts`, `demo/app/useSceneUrl.ts`.

**PRESERVED untouched:** `demo/app/useSceneSwap.ts`, `demo/app/useSceneTransition.ts`,
`demo/app/useSceneVisibilityPause.ts` (consumed per-scene — see §7),
`stores/hashSharing.ts`.

---

## 2. The dispatch signature + the events (THE single writer)

```ts
import { useSceneMachine } from "@components/custom/animation-controls/stores";
const machine = useSceneMachine();
machine.dispatch(event: SceneEvent): void;
```

`SceneEvent` (discriminated union — the ONLY mutation surface, MED-4):

```ts
type SceneEvent =
    | { type: "NAVIGATE"; to: SceneId }   // scene switch (captures+suspends the leaving scene first)
    | { type: "SCENE_READY" }             // targets attached → restore (the ONE restore point, S4)
    | { type: "PLAY" }                    // → status "playing"; effect: adapter.resume()
    | { type: "PAUSE" }                   // → status "paused";  effect: adapter.suspend()
    | { type: "SCRUB"; t: number }        // records t onto the active snapshot; status unchanged
    | { type: "SUSPEND" }                 // captures+stops the active loop; → "suspended"
    | { type: "RESUME" }                  // re-derives status from the snapshot
    | { type: "RESET" }                   // clears the active snapshot; → "paused"
    | { type: "TAB_HIDDEN" }              // status-only park (per-scene VisibilityPause owns the loop)
    | { type: "TAB_SHOWN" };              // status-only re-derive
```

**Effect convention (the writer runs effects the pure reducer cannot):**
- NAVIGATE-away / SUSPEND: `captureActive()` reads `adapter.snapshot()` + calls
  `adapter.suspend()` BEFORE the reducer transitions (genuine pre-leave suspend,
  S5 — no orphan rAF), folding the captured snapshot into the reducer input.
- SCENE_READY: `adapter.restore(snap)` iff `snap.started || snap.playing`.
- PLAY → `adapter.resume()`; PAUSE → `adapter.suspend()`; RESUME → `adapter.resume()`.
- TAB_HIDDEN/TAB_SHOWN: NO adapter call (the preserved per-scene
  `useSceneVisibilityPause` owns the loop; the machine only parks `status`).

---

## 3. The READONLY refs (the only read surface — proof:single-writer)

```ts
machine.status: Readonly<Ref<PlaybackStatus>>      // "idle"|"loading"|"playing"|"paused"|"suspended"
machine.activeScene: Readonly<Ref<SceneId>>         // the SCENE axis (the one owned fact)
machine.perScene: Readonly<Ref<Record<SceneId, PlaybackSnapshot>>>
machine.machine: DeepReadonly<Ref<MachineState>>    // the full value (status + context)
```

NO writable `activeScene`/`.status` is exported. `proof:single-writer` greps:
no file outside `sceneMachine.ts` assigns `machine.activeScene`/`.status`
(VERIFIED clean — the only matches are READS / comparisons).

---

## 4. The ScenePlayback contract + the register() call

```ts
interface ScenePlayback {
    snapshot(): PlaybackSnapshot;     // capture live → serializable
    restore(snap: PlaybackSnapshot): void;  // re-seat (targets attached)
    suspend(): void;                  // stop the loop (no orphan rAF)
    resume(): void;                   // restart the loop
    isPlaying(): boolean;
}

machine.register(sceneId: SceneId, adapter: ScenePlayback): () => void;  // returns an unregister fn
machine.adapterFor(sceneId: SceneId): ScenePlayback | undefined;          // effect-layer read
machine.gcOrphans(validSceneIds: Iterable<SceneId>): void;               // boot GC (ST-7)
```

**Two adapter factories (both implement the dual contract — WV-W1-HIGH-3):**

```ts
createGroupAdapter(getGroup: () => AnimationGroup<any>): ScenePlayback
// cube/amiga/square + the dummy-group scenes' bottom-bar host. snapshot() reads
// {t,reversed,iteration} per animation + {playing,started}; restore() calls the
// re-homed imperative restoreGroupPlaybackState (the S6 engine serialize()/
// hydrate() HANDOFF lands HERE — body reduces to g.hydrate(g.serialize())).

createRafAdapter(handle: RafSceneHandle): ScenePlayback
// easing (the D12 repro) + future raw-rAF scenes. Round-trips progress/isPlaying
// (animations stays empty — these have NO AnimationGroup position).
```

`RafSceneHandle` (what a raw-rAF scene supplies):
```ts
interface RafSceneHandle {
    getProgress(): number; setProgress(t: number): void;
    getPlaying(): boolean; setPlaying(playing: boolean): void;
    isLoopRunning(): boolean; stopLoop(): void; startLoop(): void;
}
```

---

## 5. The SCENE_READY emit convention (App-side, S4)

A scene becomes "ready" when its `defineExpose` surface is BOUND to the CURRENT
scene through `sceneRef`. `markSceneReady()` (in `useSceneMachineApp.ts`) fires
once per entry (guarded by `readyFor`) from THREE seams, idempotent across all:
1. the group watcher `watch(() => sceneRef.value?.animationGroup, markSceneReady)`
   — the sceneRef-bound path (remount);
2. the `<Suspense> @resolve` (`onSceneResolved`) — belt-and-braces;
3. the `currentSceneId` watcher — ONLY for the home↔cube no-remount transition
   (shared Suspense key 'cube' → no @resolve / no group change).

**The targets-attached gate (CRITICAL — the race the spec's S4 names):**
`markSceneReady` proceeds ONLY when `isHome || sceneRef.value?.superKey ===
currentSuperKey` — i.e. `sceneRef` is bound to THE CURRENT scene, not a
stale/transient ref during the outgoing scene's teardown. Without this gate the
group watcher fires once with `animationGroup === undefined` mid-swap and
prematurely consumes the once-per-entry guard before the real scene exposes
`autoPlays` (LIVE-VERIFIED: this was the fresh-load auto-play miss; the
superKey-match gate fixes it). This IS the targets-attached precondition
(WV-W1-MED-5) — NOT a nextTick count.

`markSceneReady()` → `bindSceneAdapter()` → `dispatch SCENE_READY` → auto-play:
a scene exposing `autoPlays: true` (the raw-rAF previews — easing) dispatches
PLAY on every entry; a group scene plays only on `autoPlayNext`/the home Play.

**Scene `defineExpose` contract additions a scene MAY expose:**
- `scenePlayback: ScenePlayback` — the scene owns its playback (App registers it;
  App does NOT write the scene's `isPlaying`, which is then a readonly computed).
- `autoPlays: true` — auto-play on every entry.

(Group scenes expose neither; the App wraps their `animationGroup` in
`createGroupAdapter` and pushes `isPlaying` as a writable ref as before.)

---

## 6. The route reconcile (S3 — useSceneMachineRouter, the fixed point)

- ONE READER: `router.afterEach → dispatch NAVIGATE(to)`; skips when the nav is
  the echo of our own writer push (a `writerEcho` flag) OR when the route already
  equals `machine.activeScene`.
- ONE WRITER: `watch(machine.activeScene) → router.push`, with the ECHO GUARD
  (`route===activeScene → no-op`). Strips `?state=`, preserves `?anim=`.
- First-load seed (deep-link wins, S5/MED-6): `router.isReady()` → deep-link URL
  scene WINS; bare `#/` → the persisted activeScene. `?anim=` applied AFTER the
  seed, scene-keyed.
- boot GC: `machine.gcOrphans(allScenes.map(s => s.id))`.

**LIVE-VERIFIED:** route storm DEAD (6 driven re-render frames → 0 scene navs,
hash unchanged, navEntries===1, pathname==='/'); scene-isolation clean (no cube
labels under easing); easing↔cube round-trip byte-identical; suspend captures the
leaving snapshot before the new scene starts; deep-link `#/spring` over
localStorage `cube` rests on spring; `next() is deprecated` = 0; @mbabb popover
opens (aria-expanded false→true). Console clean of FSM errors (the only live
errors are the pre-existing `cube-icon-sm.png` dev-server 404 — H.W5's icon lane).

---

## 7. What the GATES phase must know

- **proof:scene-contract-identity** binds to `createRafAdapter` on easing —
  round-trip `progress`/`isPlaying` via `snapshot()`/`restore()`. The
  easing↔cube cross-pair is driveable via in-app hash NAVIGATE (NOT goto, which
  clears storage — harness preamble).
- **proof:group-snapshot-identity** (born-RED engine HANDOFF) lands in
  `restoreGroupPlaybackState` (scenePlaybackAdapters.ts) — swap the eight-field
  re-seat for `g.hydrate(g.serialize())` when the engine ships the seam (S6).
- **proof:no-timing-heuristic**: SCENE_READY fires on the targets-attached
  `markSceneReady` (once-per-entry `readyFor` guard), NOT a nextTick count.
- **The reducer is PURE** — `transition(state, event)` is importable and
  unit-tested directly (`test/scene-machine-reducer.test.ts`), no Vue/DOM.
- **TAB visibility**: the per-scene `useSceneVisibilityPause` (PRESERVED,
  autoPaused "only resume what IT paused") owns the loop; the machine's
  TAB_HIDDEN/TAB_SHOWN are status-only. Do NOT add an adapter call to those
  events (it would double-act).
- **The dummy contractAnim group** in easing/spring/sequence/path is RETAINED
  ONLY as the bottom-bar transport host (documented escape hatch — deleting it
  outright strands ControlsPaneWrapper/AnimationMenuBar/the readout). The
  PLAYBACK authority is the machine + the raw-rAF adapter; the group's `paused`
  is a one-way projection of `machine.status`. (Only easing is fully re-wired —
  lane 4's literal D12 repro; spring/sequence/path still run their own private
  `isPlaying` loops and are NOT yet machine-gated. That is a follow-on, not a
  W1-CORE deliverable.)
