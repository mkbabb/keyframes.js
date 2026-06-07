# Tranche H Audit — `a-store-architecture`

**Lane:** Store / state facility evaluation (D12 — the CRITICAL scene-state-corruption finding)
**Pairs with:** `a-scene-state-machine` (the FSM definition; this lane owns the STORE/persistence facility + the recommendation)
**Branch:** `tranche-h-dev` · demo @ kf 4.1.0 + Tranche G
**Anchor convention:** every claim cites `file:line` or a live observation.

---

## 0. TL;DR — the recommendation

**Adopt Pinia as the single store facility, and define ONE formal finite state machine (a tiny hand-rolled XState-lite reducer inside a Pinia store) that owns BOTH scene lifecycle AND playback lifecycle. Delete all three `createGlobalState` singletons, the in-memory `scenePlayback` Map, the two ad-hoc `localStorage` keys, and the per-scene `isPlaying` shadow authorities in ONE motion (no parallel system).**

Rationale in one line: the corruption in D12 is **not** a store bug — it is the absence of any single authority. State is currently sharded across **six** disjoint stores with **three** competing playback authorities and a **double-fire watcher heuristic** doing the reconcile (`useSceneGroupSync.ts:54`). No amount of patching the existing `createGlobalState` singletons fixes that; the gestalt fix is to collapse the shards into one store with one transition function.

Disposition headline: **SHIP-in-H** (the facility swap is a clean transposition; the FSM is small) with **two MEASURE-FIRST gates** (Pinia bundle delta, restore-fidelity proof) called out below.

---

## 1. The current facility — a forensic inventory

There is no single "store." There are **six** independent state homes, three of which are `createGlobalState`+`useStorage` singletons, plus engine-internal flags:

| # | Home | Backing | Owns | Anchor |
|---|------|---------|------|--------|
| 1 | `useAnimationGroupsOptionsStore` | `createGlobalState`+`useStorage("animation-groups-options-store")` | per-anim duration/delay/easing/step/bezier/`animationState` | `animationOptionsStore.ts:58-65` |
| 2 | `useAnimationGroupsControlOptionsStore` | `createGlobalState`+`useStorage("animation-groups-control-options-store")` | selectedControl/selectedAnimation/panel-open/timeline-expanded/ppMode | `controlOptionsStore.ts:35-44` |
| 3 | `useAssetManager` | `createGlobalState`+`useStorage("asset-manager-state")` | playground assets | `useAssetManager.ts:38-42` |
| 4 | `_scenePlaybackStates` | a bare in-memory `Map` (NOT persisted) | per-scene playing/started + per-anim t/reversed/iteration snapshot | `scenePlayback.ts:16` |
| 5 | active-scene | raw `localStorage.getItem/setItem("keyframes-js-active-scene")` | last-visited scene id | `useSceneRouter.ts:11,23,47-49` |
| 6 | `?anim=` URL param | `vue-router` query + a manual generation counter | selected-animation deep-link | `useSceneUrl.ts:14-67` |

Plus the **engine flags** that are the *de facto* runtime truth and are NOT in any store: `group.started`, `group.playing()`, `anim.t/reversed/iteration/paused/startTime` (`usePlaybackSnapshot.ts:30-41`).

### 1.1 The three competing playback authorities (this IS D12's root cause)

The "impossible routed state" the user reported (`easing→cube→back` leaves controls invalid) is the direct consequence of **three** components each believing they own play/pause, with no arbiter:

1. **AnimationGroup engine** — cube/amiga/square: `group.play()/toggle()/pause()/resume()`, truth = `group.started` + `group.playing()` (`useAnimationGroupPlayback.ts:10-11,47-61`).
2. **`useEasingDemo` shadow authority** — easing scene runs its OWN `isPlaying = ref(true)` + a raw `RAFPlayback` loop AND fabricates a *dummy* `AnimationGroup` whose `paused` flag it hand-syncs (`useEasingDemo.ts:53,135,279-289`). The scene exposes `demo.isPlaying` as `isPlaying` to App (`EasingScene.vue:31,96`). So in the easing scene the "play state" is a different ref in a different file with a different loop.
3. **`usePlaybackToggle` SOLO/GROUPED bifurcation** — a per-controls-panel toggle that itself forks into "GROUPED (group owns it)" vs "SOLO (this panel owns the engine directly)" with its OWN `prevT`/`userReversed` bookkeeping and manual `pausedTime` clock-folding (`usePlaybackToggle.ts:38-58`).

Three authorities → no single source of truth → switching scenes cannot deterministically suspend/restore because *there is nothing to suspend* — the "state" is smeared across an engine flag, a scene-local ref, and a panel-local ref. **This is why D12 is CRITICAL and why a store swap alone is insufficient: the fix is one authority, expressed as one FSM.**

### 1.2 The reconcile is a fragile heuristic, not a machine

The scene↔group reconcile is driven by a **double-fire watcher with a string-equality guess** at which fire is "stable":

```
demo/app/useSceneGroupSync.ts:54
const isStableFire = currentSuperKey.value === superKey;
```

The comment above it (`:50-53`) documents that ACG's key-triggered remount "fires this watcher twice" and the restore must happen "only on the second fire" because targets aren't set yet on the first. This is a timing heuristic standing in for an explicit lifecycle state. It is **inherently brittle** (any change to ACG's remount keying, Suspense resolution order, or watcher flush timing silently breaks restore) and is exactly the class of bug D12 reports.

### 1.3 Restore correctness depends on hand-poked engine internals

`restoreGroupPlaybackState` (`usePlaybackSnapshot.ts:49-84`) manually re-seats **eight** private engine fields per animation (`managed/started/reversed/iteration/startTime/t/paused/pausedTime`) then calls `transformFramesGrouped(now)` and conditionally `resume()`. Every field is a place restoration can desync. This is the snapshot/restore that D12 says is broken; it works *only* when the double-fire heuristic (§1.2) lands the call at the right instant. The save side (`saveCurrentPlaybackState`, `:24-42`) early-returns on `!group.started` — so a scene the user **paused before its first tick** saves NOTHING and restores to a cold group. (Falsifiable: pause cube at t=0 → switch → return → cube is unstarted, not paused-at-0.)

### 1.4 Persistence is split-brain and unbounded

- Stores 1–3 persist to `localStorage` with a 7-day TTL reset (`storeUtils.ts:11-21`). Store 4 (playback) is **in-memory only** — a reload loses all play/pause/t restoration. So "suspend/restore across scenes" works within a session but is wiped on reload, while options survive — **inconsistent durability** is itself a corruption vector.
- The options/control stores are keyed by `superKey` and **accrete forever**: live probe shows `controlSuperKeys: ["__home__","Cube","Square"]` already present from prior sessions (live eval, `localStorage` key `animation-groups-control-options-store`). There is no GC except the all-or-nothing 7-day wipe. `getStoredAnimationOptions` *lazily mutates the store inside a getter* (`animationOptionsStore.ts:80-97`) — a read has write side effects, which is a reactivity footgun and makes the hash-sharing snapshot non-idempotent without the `_storeTimestamp` strip hack (`hashSharing.ts:21-26`).

### 1.5 `markRaw` reactivity bridges everywhere

Because the engine objects are `markRaw`'d (`App.vue:188`, `useEasingDemo.ts:279`, the cube), every UI surface that needs to *see* play state must poll via rAF (`useAnimationSync.ts`, `useAnimationProgress.ts`) or be hand-`syncPlayState`'d (`useAnimationGroupPlayback.ts:15-30`). The store does not reflect engine truth; a polling bridge does. A real store would hold the authoritative playback enum and the engine would be a *driver* of it, not a hidden parallel truth.

---

## 2. The options, evaluated against the gestalt mandate

The user named three candidates. I evaluate each against: **single authority · irrefragable suspend/restore · no-legacy clean transposition · KISS/DRY · modern+robust.**

### (a) Keep `createGlobalState` + add a formal state machine — **REJECT as the primary**

`createGlobalState` is a fine *primitive* (it's what the singletons already are), but it gives you **no actions, no devtools, no SSR-safe instance boundary, no plugin layer, and no convention** — you'd be hand-rolling a store framework around six call sites. Worse, it does nothing to collapse the six shards into one authority; it's the status quo. A formal machine bolted onto six disjoint `createGlobalState`s still has six homes to reconcile. KISS fails: the reconcile heuristic (§1.2) stays. **This is the no-legacy trap** — adding a machine *beside* the existing singletons is exactly the "parallel system" the mandate forbids.

### (b) **Pinia** (the user's named choice) — **RECOMMEND**

Pinia is the official Vue store, ships first-class TS inference, `storeToRefs`, actions, getters, devtools time-travel (huge for debugging D12-class corruption), the `pinia-plugin-persistedstate` ecosystem for `localStorage` parity, and — critically — a **single store instance per logical concern with explicit actions** is the natural home for a transition function. It collapses stores 1–6 into a small number of stores with one playback/scene store as the authority. The `markRaw` engine objects live *outside* the store as drivers; the store holds the **serializable** truth (the playback enum + per-anim snapshot + scene id) and the engine subscribes to it. This is the modern, robust facility the user asked for, and it's the one they named.

Cost: one dependency (~1.5 KB min+gz core) + the persist plugin. **MEASURE-FIRST gate** below.

### (c) A deeper vueuse machine (`useStateMachine`/XState-lite) — **PARTIAL ADOPT (inside (b))**

`@vueuse/core@14.3.0` does **NOT** export `useStateMachine` (grep over `node_modules/@vueuse` returns nothing — it was never in core; the community `useStateMachine` lives in `@vueuse/integrations`/`@vueuse/router`-adjacent packages, not installed). Full XState is overkill (~15 KB, actor model, more machinery than two small machines need). **The gestalt move is a ~40-line hand-rolled reducer** — a `transition(state, event) → state` pure function — living *inside* the Pinia store. That is the "XState-lite" the user gestured at, with zero new runtime dependency, fully testable as a pure function, and devtools-visible via Pinia. This is what pairs with `a-scene-state-machine`.

**Verdict: (b) Pinia as the facility, hosting a hand-rolled FSM reducer ((c) in spirit, not the library). (a) is rejected as the no-legacy trap.**

---

## 3. The recommended shape (gestalt)

Two Pinia stores + one pure reducer. The engine becomes a *driver*, never a parallel authority.

```
demo/app/stores/
  useSceneStore.ts      // scene FSM: id, status(idle|loading|live|leaving), the reducer
  usePlaybackStore.ts   // playback FSM per superKey: status(cold|playing|paused),
                        //   + serializable per-anim snapshot {t,reversed,iteration}
  usePreferencesStore.ts// options + control options (merge stores 1+2; persisted)
  useAssetStore.ts      // asset-manager state (was store 3; persisted)
```

- **One playback authority.** `usePlaybackStore` holds `status: 'cold'|'playing'|'paused'` per `superKey`, plus the snapshot. `play()/pause()/scrub()` are *actions* that (1) mutate store status and (2) drive the engine. `useEasingDemo`'s private `isPlaying` ref AND its dummy AnimationGroup are **deleted** — easing becomes a driver subscribing to the same store status (its `RAFPlayback` loop gates on `store.status==='playing'` instead of a local ref). `usePlaybackToggle`'s SOLO/GROUPED fork **collapses** to one path (the store is always the owner; "SOLO" was only ever needed because there was no shared authority).
- **Suspend/restore becomes structural, not heuristic.** Switching scenes is an FSM event: `LEAVE(superKey)` → store writes the snapshot from engine truth (the save side, now reading the *one* authority); `ENTER(superKey)` after the new scene's targets are set fires `RESTORE`. The double-fire `isStableFire` guess (`useSceneGroupSync.ts:54`) is **deleted** — the FSM's `live` status is reached via an explicit `SCENE_READY` event the scene emits on mount, so there is no timing heuristic. This is the irrefragability D12 demands.
- **Persistence parity.** With `pinia-plugin-persistedstate`, the playback snapshot persists too (fixes §1.4 split-brain — reload now restores play/pause). active-scene (store 5) becomes `useSceneStore`'s persisted `id`; the raw `localStorage` calls in `useSceneRouter.ts:23,47-49` are deleted. `?anim=` (store 6) stays in the URL (it's a *share* surface, correctly the router's) but reads/writes the Pinia control store instead of `getStoredAnimationGroupControlOptions`.
- **superKey GC.** A store action prunes snapshots for scenes not in the descriptor list on boot, ending the unbounded accretion (§1.4).
- **Reads are pure.** `getStoredAnimationOptions`' read-with-write-side-effect (`animationOptionsStore.ts:80-97`) becomes an explicit `ensureAnimation(superKey,id)` action; getters are side-effect-free, so hash-sharing no longer needs the `_storeTimestamp` strip hack (`hashSharing.ts:21-26`).

---

## 4. Migration path (no-legacy: one clean transposition)

The mandate forbids a parallel system. The cut is per-concern and atomic:

1. **Add Pinia + persist plugin** (one `app.use(createPinia())` in `main.ts`). *Gate: bundle delta below.*
2. **Port stores 1+2+3 → Pinia stores**, preserving the `localStorage` keys via the persist plugin's `key` option so existing user state migrates with zero data loss. Delete the three `createGlobalState` wrappers AND the `resetAllStores`/`_reset*` plumbing (`stores/index.ts:42-55`) — Pinia's `$reset()` replaces it. The 30 `getStoredAnimation*` call sites (live grep: 20 files) change to `storeToRefs`/store-action calls in the same commit.
3. **Define the FSM reducer** (pure `transition()`), host it in `usePlaybackStore`/`useSceneStore`. Move `usePlaybackSnapshot.ts` save/restore *into* store actions; **delete** `usePlaybackSnapshot.ts`, `scenePlayback.ts`, and the `isStableFire` heuristic in `useSceneGroupSync.ts`.
4. **Collapse the three playback authorities**: delete `useEasingDemo`'s private `isPlaying` + dummy group; collapse `usePlaybackToggle`'s SOLO/GROUPED fork; route `useAnimationGroupPlayback`'s `syncPlayState` through the store action.
5. **Delete the two raw `localStorage` sites** in `useSceneRouter.ts`; active-scene is now persisted store state.

No step leaves an old-and-new pair coexisting; each concern is replaced in one motion. This pairs with `a-scene-state-machine` which owns the reducer's transition table.

---

## 5. Dispositions + falsifiable instruments

| ID | Finding | Anchor | Disposition | Proof gate |
|----|---------|--------|-------------|------------|
| ST-1 | Three competing playback authorities (engine / easing-shadow / usePlaybackToggle SOLO) — D12 root cause | `useEasingDemo.ts:53,279-289`; `usePlaybackToggle.ts:38-58`; `useAnimationGroupPlayback.ts:47-61` | **SHIP-in-H** | `proof:single-authority` — assert NO component holds an `isPlaying` ref other than the store; grep gate + a test that easing play/pause mutates the same store status as cube |
| ST-2 | Adopt Pinia as the single facility (the user's choice) | §2(b) | **SHIP-in-H** | `proof:store-singularity` — exactly the recommended store files exist; zero `createGlobalState` remain in `demo/` |
| ST-3 | Hand-rolled FSM reducer (XState-lite), NOT a library | §2(c); vueuse has no `useStateMachine` (grep `node_modules/@vueuse` empty) | **SHIP-in-H** (pairs w/ `a-scene-state-machine`) | `proof:fsm-pure` — `transition(state,event)` unit-tested for every (scene×playback) edge incl. `easing→cube→easing` round-trip |
| ST-4 | Delete the `isStableFire` double-fire heuristic; replace with explicit `SCENE_READY` event | `useSceneGroupSync.ts:54` | **SHIP-in-H** | `proof:no-timing-heuristic` — restore correctness holds when watcher flush timing is perturbed (test injects a delayed mount) |
| ST-5 | Save side drops paused-at-t=0 scenes (`!group.started` early-return) | `usePlaybackSnapshot.ts:27` | **SHIP-in-H** | `proof:restore-fidelity` — pause cube at t=0 → switch → return → still paused at t=0 (visual lock + state assert) |
| ST-6 | Playback snapshot not persisted (split-brain durability) | `scenePlayback.ts:16` (in-mem Map) vs `storeUtils.ts:11-21` (persisted options) | **SHIP-in-H** | `proof:reload-restore` — play cube, pause, reload → restores to paused-at-t (currently fails) |
| ST-7 | Unbounded superKey accretion + read-with-write-side-effect getter | live `localStorage` probe (`__home__`,`Cube`,`Square` retained); `animationOptionsStore.ts:80-97` | **SHIP-in-H** | `proof:store-gc` — boot prunes orphan superKeys; `proof:pure-reads` — calling a getter twice produces identical store JSON |
| ST-8 | Pinia bundle cost | — | **MEASURE-FIRST** | `proof:bundle-budget` — Pinia core + persist plugin add ≤ ~3 KB min+gz to the demo entry; record the before/after `dist` size |
| ST-9 | Hash-sharing `_storeTimestamp` strip hack becomes unnecessary once reads are pure | `hashSharing.ts:21-26` | **RECORD** (falls out of ST-7) | shared-state hash is byte-stable for identical logical state without the strip |
| ST-10 | Vue Router `next()` deprecation warning floods console on every nav | live console (`router.ts` guards; warning ×5 per load) | **BOOK** (adjacent, not store) | `proof:clean-console` — zero router-deprecation warnings; hand off scope to a routing lane |

---

## 6. Honest ALREADY-SOTA notes

Not everything here is broken; several pieces are exemplary and the recommendation **preserves** them:

- The **scene-swap motion** (`useSceneSwap.ts` / `useSceneTransition.ts`) is genuinely well-reasoned: native VT owns the swap where present, SpringProgress dogfoods the fallback, and the comments document the real B.W3 async-loader trap. **Keep as-is** — it is a *driver*, not a store, and is correctly outside store scope.
- `useSceneVisibilityPause.ts` has an honest "only resume what IT paused" contract (`:14-17,43-50`) — this is exactly the discipline the new FSM needs and should be **folded into** the playback store's transition table (a `TAB_HIDDEN`/`TAB_SHOWN` event pair) rather than rewritten.
- The hash-sharing codec (`hashSharing.ts`) is clean and lossless; it just needs to read the Pinia stores instead of the singletons.

The store *facility* is the weak point; the motion/transition choreography around it is strong and should survive the transposition intact.

---

## 7. One-paragraph summary for synthesis

D12 is a **single-authority** problem masquerading as a store bug. State is sharded across six homes (three `createGlobalState` singletons, an in-memory `Map`, two raw `localStorage` keys, plus engine-internal flags), with **three** competing playback authorities (the AnimationGroup engine, `useEasingDemo`'s private `isPlaying`+dummy group, and `usePlaybackToggle`'s SOLO/GROUPED fork). The scene↔group reconcile is a fragile **double-fire watcher heuristic** (`useSceneGroupSync.ts:54`) and restore re-pokes eight private engine fields by hand. The gestalt fix — and the user's named choice — is **Pinia** as the single facility hosting **one hand-rolled XState-lite FSM reducer** (vueuse has no `useStateMachine`) that owns scene-lifecycle AND playback-lifecycle, with the engine demoted to a *driver* of the store's serializable truth. Migrate as one clean per-concern transposition (no parallel system): port the three persisted stores, collapse the three playback authorities, replace the timing heuristic with an explicit `SCENE_READY` event, and persist the playback snapshot to end the reload split-brain. Pairs with `a-scene-state-machine` (the transition table).
