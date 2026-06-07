# Tranche H Deep Audit — Lane A: Scene + Playback State Machine (D12, CRITICAL)

**Branch:** tranche-h-dev · **Demo:** http://localhost:5174/ (kf 4.1.0 + Tranche G)
**Charge:** D12 — scene-state corruption + the play/pause RESTORE/SUSPEND state machine.
**Verdict:** The corruption is REAL, REPRODUCED LIVE, and ROOT-CAUSED. The current
design has **no single source of truth for "which scene is active"** — the active-scene
fact is independently derived/written in five places that desync, and the playback
restore codec is a fragile double-fire heuristic. This is the load-bearing H
architectural theme: replace the ad-hoc reconcile lattice with ONE explicit, finite
scene+playback state machine. **Disposition: SHIP-in-H (architectural transposition).**

---

## 0. The five competing "active scene" authorities (the gestalt defect)

There is no canonical scene state. "Which scene is active" is *re-derived* — and
separately *written* — by all of these, with no owner:

1. **vue-router route** (`router.ts`, hash mode) — `route.name`.
2. **localStorage `keyframes-js-active-scene`** (`useSceneRouter.ts:11,46-52`) — written
   on every `currentSceneId` change, read on fresh load to redirect.
3. **`currentSuperKey` shallowRef** (`App.vue:189`) — seeded from `currentScene`, but then
   *only* updated by the `sceneRef.animationGroup` watcher (`useSceneGroupSync.ts:75`),
   i.e. it lags the route by the async `<Suspense>` mount.
4. **The dock scene `<Select>` model** (`ChromeDock.vue:165` `:model-value="currentSceneId"`)
   — a reka-ui Select whose `update:model-value` re-emits `switchScene`.
5. **The `?anim=` query param** (`useSceneUrl.ts`) — a *debounced* `router.replace` that
   fires per scene on mount, keyed off `currentSuperKey` (which lags, #3).

When five authorities each both read and write the same fact with different timing, the
system has no fixed point. The live repro below is that lattice oscillating.

---

## 1. LIVE REPRO — the autonomous route storm (the "impossible routed state")

**Steps:** load `http://localhost:5174/#/easing`, then interact (navigate / re-render).

**Observed (verbatim from the running demo):**

- `browser_navigate("http://localhost:5174/easing")` resolved to
  `http://localhost:5174/easing#/motion-path` — the path `/easing` is dead (hash mode),
  and `useSceneRouter.ts:19-31` redirected to the localStorage-saved scene.
- On a *clean* `#/easing` load, an in-page `evaluate` read the correct easing state
  (`hash: #/easing?anim=Easing+Preview`, single "duration" label, easing sidebar present,
  no cube/blend) — **but the very same evaluate's Playwright Page footer reported the URL
  had already moved to `#/motion-path?anim=Path+traversal`** with no user action.
- Repeated reads walked the route autonomously through scenes:
  `easing → motion-path → starting-style → spring → motion-path → amiga → easing …`
  Each re-render / interaction advanced it to a *different* scene.
- The route is NOT on a timer (a 1.2 s idle poll showed `moved: false`); it advances on
  **re-render / interaction**, i.e. it is a reactive feedback loop, not a setInterval.

**Root cause (history trap installed in-page; stack traces captured):**
The navigations arrive in repeating PAIRS:

```
replaceState #/motion-path                  ← popStateHandler → router.replace   (vue-router 4949)
replaceState #/motion-path?anim=Path+traversal ← finalizeNavigation → router.replace (vue-router 6228)
replaceState #/amiga                        ← popStateHandler → router.replace
replaceState #/amiga?anim=Rotations         ← finalizeNavigation → router.replace
```

- The **second** of each pair is `useSceneUrl`'s debounced `router.replace({ query })`
  appending `?anim=` — it fires on *every* scene mount because each scene seeds
  `selectedAnimation` (`useSceneGroupSync.ts:63-65`, `EasingScene` etc.), and the
  `selectedAnimation` watcher (`useSceneUrl.ts:64-67`) writes the URL.
- The **first** of each pair is `popStateHandler` — a browser back/forward (popstate)
  event vue-router is reacting to. The `push` (history entry) from `switchScene`
  (`useSceneRouter.ts:58`) interleaved with the per-scene `?anim=` `replace` writes builds
  a history stack that, combined with the automation context's popstate, walks itself.
- Because `useSceneUrl` keys its `?anim=` write off `currentSuperKey` (which LAGS the route
  through the async `<Suspense>` mount, see §0 #3), the param written can belong to the
  *previous* scene — appending the wrong scene's anim onto the new route, which the next
  reconcile then "corrects" by navigating again. The loop has no damping fixed point.

> **inv ε anchors:** `useSceneUrl.ts:36-55` (debounced `router.replace`),
> `useSceneRouter.ts:58` (`router.push`), `router.ts:42-54` (`next()` guard),
> live stack traces `popStateHandler @ vue-router 4949` + `finalizeNavigation @ 6228`.

---

## 2. LIVE REPRO — controls/options go INVALID on switch (the corrupt panel)

**Observed:** while transiently at `#/?anim=Rotations` (home/cube key) the *easing*
viewport rendered the **cube's** controls: the visible labels were
`duration|delay|iterations|direction|fill mode|easing|blend|z-index|enabled` repeated
**three times** (one per cube animation: Matrix/Rotations/Hover) — yet the easing scene
has exactly ONE animation ("Easing Preview") and no layer/blend controls.

**Root cause — the superKey desync at the seam:**
- `AnimationControlsGroup.vue:148` destructures `superKey` from `defineProps`, then
  `:155` resolves `storedControls = getStoredAnimationGroupControlOptions(superKey)` **once
  at setup**. The shell remounts ACG via `:key="superKey"` (`EditorShell.vue:63`), so a
  *correct* superKey relies entirely on the key changing *before* the new scene's group
  is read. During the route storm the key and the mounted `sceneRef` disagree → ACG reads
  the store sub-object of the WRONG scene.
- `getStoredAnimationGroupControlOptions` (`controlOptionsStore.ts:46-65`) returns a
  *plain string-keyed reactive sub-object* — there is no reactive binding to "the active
  scene", so a stale superKey silently yields a stale panel.
- `currentSuperKey` is only advanced inside the `sceneRef.value?.animationGroup` watcher
  (`useSceneGroupSync.ts:44-75`), gated on the async scene mount — so between route change
  and scene mount, `currentSuperKey` (and everything keyed off it: `storedControls`,
  `useSceneUrl`, the dock tabs) points at the OUTGOING scene.

> **inv ε anchors:** `AnimationControlsGroup.vue:148,155`, `EditorShell.vue:63`,
> `useSceneGroupSync.ts:54,75`, `controlOptionsStore.ts:46-65`, live label dump
> (cube's blend/z-index controls rendered under the easing route).

---

## 3. LIVE REPRO — orphaned serialize + interp errors (the leak symptoms)

Two distinct console error families confirm cross-scene state leaking into the engine:

**(a) `AnimationOptionError: Invalid value for animation option "timingFunction":
[function anonymous]`** — `format.ts:24` `serializeEasing` → `KeyframesStringControls.vue:46`.
The easing scene's *placeholder* `contractAnim` is built with
`timingFunction: currentEasingFn.value` — a raw JS easing function with **no CSS twin**
(`useEasingDemo.ts:268-275`). It is only a bottom-bar "contract" group, but it reaches the
keyframes-string serializer (which the dock Keyframes tab mounts), which throws. The
placeholder group is leaking into a UI surface that assumes a CSS-representable animation.

**(b) `Error: Parse error at offset 0: "......"`** — `value.js` lerp →
`CSSKeyframesAnimation.processFrame (engine.ts:576)` → `interpFrames (engine.ts:516)`.
A six-dot string `"......"` is being interpolated as a CSS value. This is the
start-screen `dot-fade` ellipsis text (`EditorStartScreen.vue:18-19`, `ellipsis: "..."`,
two `AnimatedText` blocks → "......") reaching a CSS-value lerp path — the start-screen
and scene group are not cleanly separated (relevant to D6 typing-dots; lane
`a-typing-dots` owns the dots fix, but the **leak into the animation pipeline is a
state-isolation defect this lane flags**).

> **inv ε anchors:** `format.ts:24`, `KeyframesStringControls.vue:46`,
> `useEasingDemo.ts:268-275`, `engine.ts:516,576`, `EditorStartScreen.vue:18-19`.

---

## 4. The playback RESTORE/SUSPEND codec is a fragile heuristic (no SUSPEND at all)

The charge requires play/pause **RESTORE on return + SUSPEND on leave**. Today:

- **Restore** exists but rides a double-fire guess: `useSceneGroupSync.ts:54`
  `isStableFire = currentSuperKey.value === superKey` distinguishes the "first" vs "second"
  watcher fire after ACG's keyed remount, and only restores on the second. This is
  inference from a remount race, not an explicit transition — exactly the brittleness the
  spine forbids ("no workarounds — gestalt only").
- **No genuine SUSPEND.** `usePlaybackSnapshot.saveCurrentPlaybackState` snapshots `t`/
  `reversed`/`iteration` (`usePlaybackSnapshot.ts:24-42`) but the rAF **is not stopped at
  the App level on leave** — it relies on the keyed `<Suspense>` *unmounting* the scene
  (no `<KeepAlive>`) to dispose loops via `onScopeDispose` (`useEasingDemo.ts:185`). During
  the route storm the unmount/remount churns, so loops are repeatedly torn down and
  re-armed — orphaned rAF is exactly what the storm produces.
- The snapshot store is an in-memory `Map` (`scenePlayback.ts:16`) with manual
  save/get/clear calls scattered across `App.vue`, `usePlaybackSnapshot`,
  `useSceneGroupSync` — CRUD with no lifecycle owner.
- `restoreGroupPlaybackState` mutates `markRaw` engine internals by hand
  (`usePlaybackSnapshot.ts:52-83`: sets `group.started`, `lastTickTime`, per-anim
  `startTime/t/paused/pausedTime`, calls `transformFramesGrouped`, then `resume()`).
  Reaching that deep into the engine from the demo is a layering smell; the engine should
  expose a `serialize()/hydrate()` seam (see §6).

> **inv ε anchors:** `useSceneGroupSync.ts:54,81-87`, `usePlaybackSnapshot.ts:24-83`,
> `scenePlayback.ts:16`, `useEasingDemo.ts:185`.

---

## 5. Secondary defects surfaced by the same root

- **Hash router redirect contradicts deep links (D12-adjacent):** `#/easing` deep link is
  silently overridden to the localStorage scene on load (`useSceneRouter.ts:19-31`). A
  shared/bookmarked scene URL does NOT win — the last-visited localStorage scene does.
  This is a correctness bug in the "active scene" authority (§0 #1 vs #2 conflict).
- **Deprecated `next()` guard:** `router.ts:42-54` uses `next(value)` — vue-router warns
  it is deprecated ("Return the value instead"). 7+ identical warnings in console. Trivial
  but it is in the load-bearing nav guard; fold into the rewrite.
- **Dock `<Select>` two-way feedback risk:** `ChromeDock.vue:165` binds
  `:model-value="currentSceneId"` and emits `switchScene` on `update:model-value`. With a
  single source of truth (§6) this is fine; in the current lattice it is another write
  path that can re-fire a switch. Confirm under the new SM that programmatic model updates
  don't echo an emit.

---

## 6. The gestalt fix — ONE finite scene+playback state machine + ONE store

**Replace the five-authority lattice with a single owner.** This is an architectural
transposition (NECESSARY AND DESIRABLE per the spine), done in ONE motion — the replaced
surfaces (`useSceneSwap` snapshot calls, `useSceneGroupSync` double-fire, `useSceneUrl`
debounce-write, `usePlaybackSnapshot` manual codec) are *replaced*, not aliased beside.

### 6a. Store/SM facility recommendation (D12 explicitly asks to evaluate + recommend)

The repo already standardizes on **`createGlobalState` + `@vueuse/core`**
(`useKeyboardShortcuts.ts`, `controlOptionsStore.ts:35`). **Recommend: stay on
`createGlobalState`** for the store (no Pinia — it would be a second store paradigm beside
the existing one, violating "no legacy/parallel surfaces"), and add a **tiny explicit
finite-state-machine** as a pure reducer (no XState dependency — a ~40-line typed
`transition(state, event)` is idiomatic, dependency-free, and testable). One global
`useSceneMachine()` (`createGlobalState`) owns:

```
States:   idle | loading | playing | paused | suspended
Context:  { activeScene: SceneId, perScene: Record<SceneId, PlaybackSnapshot> }
Events:   NAVIGATE(to) · SCENE_READY · PLAY · PAUSE · SCRUB(t) · SUSPEND · RESUME · RESET
```

Deterministic transitions (illustrative):
- `NAVIGATE(to)`: from any → snapshot current scene's playback into `perScene[active]`
  (SUSPEND: stop the active rAF), set `activeScene=to`, → `loading`. The route is a
  *projection* of `activeScene`, written **once** here (one `router.push`), never
  re-derived elsewhere.
- `SCENE_READY` (fired by the scene on mount, replacing the `animationGroup` watcher
  double-fire): hydrate `perScene[active]` onto the fresh group → `playing|paused` per the
  snapshot. RESTORE happens on exactly ONE explicit event, not a remount race.
- `SUSPEND`/`RESUME`: tab-visibility + scene-leave both route through the SAME suspend
  path — no orphaned rAF, one place that stops/starts loops.

The route, the dock Select model, the `?anim=` param, and localStorage all become
**read-only projections** of `machine.activeScene` (one-way data flow), killing the
feedback loop at the source (the param/route can never write back into scene selection).

### 6b. Engine seam (kills the deep-poke in `restoreGroupPlaybackState`)

Add `AnimationGroup.serialize(): PlaybackSnapshot` and `.hydrate(snapshot)` to the engine
(value-side of the demo). The demo SM calls those instead of hand-mutating `started`,
`lastTickTime`, `startTime`, `pausedTime`, `transformFramesGrouped`. This removes the
layering violation and makes restore engine-owned + unit-testable without DOM.

### 6c. Deep-link wins (fix §5 router conflict)

On load: an explicit scene in the hash MUST win over localStorage. localStorage is the
fallback ONLY for bare `#/`. Encode this as the `idle → NAVIGATE` initial transition
seeded from the URL, with localStorage consulted only when the URL is `home`.

---

## 7. Disposition + falsifiable instruments (so H can gate it)

**Disposition: SHIP-in-H.** This is THE H architectural theme; ship the SM + engine seam
in one motion.

Gates (each falsifiable, each maps to a live defect above):

- **`proof:no-route-storm`** — a Playwright/vitest test: load `#/easing`, idle 2 s with a
  `pushState/replaceState` history trap installed; assert **≤ 1** nav entry total and the
  resting hash is still `#/easing`. (Falsifies §1: today it walks scenes.)
- **`proof:scene-isolation`** — after `NAVIGATE(easing)`, assert the rendered control
  labels are exactly the easing set (`["duration"]`) and **no** `blend|z-index|enabled`
  node exists. (Falsifies §2: today cube controls leak in.)
- **`proof:playback-restore`** — vitest on the SM: PLAY cube to `t=0.4`, `NAVIGATE(easing)`,
  `NAVIGATE(cube)`, `SCENE_READY`; assert cube anim `t≈0.4` and state `playing`.
  And the inverse: pause, leave, return → state `paused`, `t` preserved.
- **`proof:suspend-no-orphan-raf`** — spy `RAFPlayback.loop/stop`: on `NAVIGATE` away,
  assert the leaving scene's loop `stop()` was called and `running===false` before the new
  scene's loop starts. (Falsifies §4: no genuine SUSPEND today.)
- **`proof:deep-link-wins`** — load `#/spring` with localStorage `active-scene=cube`;
  assert resting scene is `spring`. (Falsifies §5 router conflict.)
- **`proof:no-deprecated-guard`** — grep gate: `next(` absent from `router.ts` (the guard
  returns its value). (Falsifies §5 deprecation warnings.)
- **`proof:contract-serialize`** — the Keyframes tab on the easing scene must NOT throw
  `AnimationOptionError` (the placeholder contract group either gets a CSS-twin easing or
  is excluded from the serialize surface). (Falsifies §3a.)

---

## 8. One-paragraph synthesis for the H spine

The scene layer has **no canonical state** — "which scene is active" is independently read
AND written by the route, localStorage, a lagging `currentSuperKey` shallowRef, the dock
Select model, and a debounced `?anim=` writer, and these oscillate into an autonomous route
storm (live: easing→motion-path→starting-style→spring→amiga, driven by interleaved
`popStateHandler` + `?anim=` `replace` pairs) that renders the wrong scene's controls
(cube blend/z-index under the easing route) and orphans rAF loops via churned
unmount/remount. Playback "restore" rides a double-fire remount-race heuristic
(`isStableFire`) and there is no true SUSPEND. The gestalt fix is ONE finite
`useSceneMachine` (`createGlobalState` + a ~40-line dependency-free reducer; states
idle/loading/playing/paused/suspended) that OWNS the active-scene fact, with the route,
dock model, `?anim=`, and localStorage demoted to one-way projections, plus an engine-level
`serialize()/hydrate()` seam to replace the hand-mutated restore — gated by the seven
`proof:*` instruments above.
