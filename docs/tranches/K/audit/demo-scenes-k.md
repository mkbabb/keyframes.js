# Tranche K · Demo Scenes Audit

**Lane:** `demo-scenes-k` (DOCS ONLY — no source/test/gate/CI edits).
**Scope:** `demo/app/scenes/*Scene.vue` + per-scene composable dirs (`amiga/`, `cube/`, `easing/`, `motion-path/`, `sequence/`, `spring/`, `square/`), post-Tranche-J state (`tranche-j-dev` == `master` @ `4f1fc4c`).
**Method:** Static source read + `git log` provenance + cross-reference with sibling K audit lanes (`live-cold-play-path.md`, `live-amiga-breakage.md`, `live-session-gap-analysis.md`). Every claim cites file:line or a sibling-lane oracle citation (inv ε). This lane does NOT duplicate findings already rooted by the sibling lanes; it cross-references them and adds the per-scene wiring analysis they omit.

---

## §0 — Scene-contract grammar (the expected surface)

The App's `useSceneMachineApp.ts` reads a scene's `defineExpose` to drive the shell. The expected surface per scene type:

```
animationGroup   — required by all scenes (the bottom-bar transport host)
superKey         — required (the localStorage partition key)
isPlaying        — writable ref for GROUP scenes; readonly computed for rAF scenes;
                   ABSENT is a legal omission only if the scene owns no prop-driven
                   play state (square — spring-autonomous)
isStarted        — writable ref; drives CubeTarget:14 OrbitalDrag + idle-bob class
scenePlayback    — ScenePlayback adapter (raw-rAF scenes ONLY); group scenes use
                   createGroupAdapter implicitly; ABSENCE on a rAF scene is a bug
autoPlays        — boolean; rAF preview scenes (easing) auto-play on every entry
tabsContent/
ribbonContent    — optional scene-specific slot overrides (CubeScene, SpringScene,
                   EasingScene)
```

The App's write path:
- `onPlayStateChange`: writes `sceneRef.isPlaying = playing` ONLY if `!ownsPlayback && "isPlaying" in sceneRef`
  (`useSceneMachineApp.ts:173-175`).
- `onStartStateChange`: writes `sceneRef.isStarted = started` if `"isStarted" in sceneRef`
  (`:181-184`).

---

## §1 — Per-scene wiring audit

### 1.1 CubeScene (`demo/app/scenes/CubeScene.vue`)

**Exposed:** `animationGroup`, `superKey`, `isPlaying (ref)`, `isStarted (ref)`, `headerLeft`, `startScreen`, `tabsTrigger`, `tabsContent`, `ribbonContent`.

**Wiring quality:** Complete. Group adapter path is correct. `isPlaying`/`isStarted` are writable refs that route from `onPlayStateChange`/`onStartStateChange`. `storedControls.ppMode ??= false` is a setup side-effect mutation (`:55`) — tolerated (the DFA owns the selected-surface axis, not ppMode). The `startScreen` slot override (`EditorStartScreen`) duplicates the default from `EditorShell.vue:115` — the slot render function in CubeScene (`:138-141`) passes the SAME component with the SAME hint, producing no delta; the duplicate slot is dead weight.

**Cold-mount gap (P0):** The home→cube cold-play path is **broken**. Full root chain documented in `live-cold-play-path.md:P0-1` and `live-session-gap-analysis.md:§1`. Summary: `markSceneReady` dispatches `PLAY` → `applyEffects → adapter.resume()` → `createGroupAdapter.resume()` guards `if (group.started && group.paused)` (`scenePlaybackAdapters.ts:76-79`). On first visit the fresh `AnimationGroup` is never started (`group.started === false`) → **resume is a no-op**. The machine records `playing:true started:true` (`sceneMachine.ts:128-132`) over a hollow group. The engine group is never started, the subject freezes, the slider parks at 0. Observed live: `probe-trace-cold.mjs` (sibling lane) logged `machine={"cube":{"playing":true,"started":true,"animations":{}}}` while the dock play button read `"Play animation"` (never flipped to Pause). Second click plays normally (group now bound + `toggle()` fires `group.play()`).

**Dead code:** `CubeScene.startScreen` slot override (`:138-141`) — identical to the `EditorShell` default, no delta; dead weight.

**Composable hygiene:** `useCubeAnimations` does NOT use `useSceneMachine` — it uses `useSceneVisibilityPause` directly (`useCubeAnimations.ts:112-116`). This is correct; the visibility pause is orthogonal to the machine (the machine owns play intent; the visibility pause owns tab-hide pause autonomously). The `changeGraphPerspectiveAnim` is created and auto-played on `setTargets` (`:91-104`) but is NOT exposed and NOT a member of the group — it is a one-shot easter-egg visual only. This is intentional but undocumented in the composable's return type.

---

### 1.2 AmigaScene (`demo/app/scenes/AmigaScene.vue`)

**Exposed:** `animationGroup`, `superKey`. **Missing:** `isPlaying`, `isStarted`, `tabsContent`, `ribbonContent`.

**Wiring quality:** Partial. The amiga scene has the full editor triad (DFA: `["controls","keyframes","timeline"]`, `controlSurfaceDFA.ts:79`), uses the group adapter implicitly (no `scenePlayback`), and correctly stops the group on unmount (`:315`). However:

1. **No `isPlaying` exposed.** `onPlayStateChange` checks `"isPlaying" in sceneRef` (`useSceneMachineApp.ts:174`) before writing — AmigaScene has none, so the write is silently skipped. The machine's PLAY state is never pushed back to the component. This is tolerable because `useAmigaAnimations` does NOT read `isPlaying` as a prop — the group's own play/pause state drives the WebGL loop. BUT:
2. **No `isStarted` exposed.** The OrbitalDrag and idle-bob patterns in CubeScene depend on `isStarted` to suppress the static CSS bob when playing; AmigaScene has NO equivalent prop-gate for its own visual posture. If the camera/orbit behaviour had a similar gate it would be missed.
3. **`tabsContent` absent:** The amiga scene has no custom controls pane content. The editor triad is generic (all scenes with the triad share the same controls/keyframes/timeline tabs). This is by design — no custom panel = no tabsContent slot. Correct.
4. **Cold-play gap (P0):** Same mechanism as CubeScene P0-1 (`live-cold-play-path.md`). From a DIRECT cold nav to `#/amiga`, clicking the rainbow play fires `toggleAnimationGroup`, picks the first animation, calls `group.play()` directly (this works because `animationGroup` is already bound in the direct-nav path — NOT the home→cube shared-key path). The amiga scene's P0 is NOT the shared-key gap; it is the **K4-C cold-reload-after-play** floats-constantly bug documented in `live-amiga-breakage.md:§K4-C`. The persisted `perScene.amiga.playing:true` resumes the bounce group on cold reload with zero user gesture; `adapter.restore(snap)` fires when `snap.started || snap.playing` (`useSceneMachine.ts:177`), and since `playing:true` is in the persisted snapshot, `restoreGroupPlaybackState` calls `group.resume()` (`scenePlaybackAdapters.ts:134`) — which IS a started group at this point (restored from the snapshot), so the resume works, and the bounce runs uninstructed.

**Composable hygiene:** `useAmigaAnimations` returns `animationGroup` but the callee (`AmigaScene.vue:97-100`) destructures only `{ animationGroup }` — `matrixAnim`/`rotationAnim`/`hoverAnim` are unused at the scene level (their lifecycle belongs to the group). Clean. `useSphereSpin` is self-contained. `useSceneVisibilityPause` registered correctly inside `AmigaScene.vue` (`:289-292`).

---

### 1.3 SquareScene (`demo/app/scenes/SquareScene.vue`)

**Exposed:** `animationGroup`, `superKey`. **Missing:** `isPlaying`, `isStarted`, `autoPlays`, `tabsContent`, `ribbonContent`.

**Wiring quality:** Intentionally minimal. The box is spring-autonomous — `useSquareAnimations` owns its `RAFPlayback` loop that self-terminates on spring settle and self-arms on `reseat`. The `CSSKeyframesAnimation` in the composable is a CONTRACT HOST only (`:193-210`), carrying the nested-object keyframes for the bottom-bar readout; it is never `play()`-ed by the scene and intentionally drives no DOM paint. The `AnimationGroup` (`SquareScene.vue:51`) wraps this contract anim.

**Cold-play behaviour (U-K5):** Clicking the bottom dock's rainbow play fires:
1. `toggleAnimationGroup` → group never started → `Object.keys > 0` (one contract anim) → `group.play()` → the group's rAF loop starts, interpolates `opacity: 0→1` on the contract anim (no DOM target set!) — no visual change.
2. Machine → PLAY → `adapter.resume()` → `group.started && group.paused` → false (group.paused = false while running) → no-op.

The box is draggable regardless of machine state; `paintRest()` on `onMounted` (`:60-65`) seats the initial transform. The "U-K5 — none of the animations work properly (/square)" observation likely refers to: **the rainbow play button triggers the contract anim group loop (which animates nothing), but the user expects a play to animate the box**. There is no visual feedback that "Play" does anything meaningful in the square scene. The scene does not expose `autoPlays` so it never self-plays on entry. The scene has no `ribbonContent` to replace the default transport with something contextual ("drag the box" affordance).

**Dead code / technical debt:** `SquareScene.vue:51` uses `as any` cast: `new AnimationGroup(anim as any)`. The `any` is acknowledged as `anim` is a `CSSKeyframesAnimation<any>` which should satisfy `AnimationGroup`'s constructor. This matches the pattern the easing/spring scenes use — not a regression but a type-system seam to address when `AnimationGroup`'s type param widens. `animationGroup.singleTarget = false` (`:54`) is set to bypass the grouped flat-value path — this is a documented quirk of the nested-object transform and is tested by the scene's own purpose.

**Composable hygiene:** `useSquareAnimations` calls `onScopeDispose(dispose)` (`:234`) making lifecycle safe even if `SquareScene.onBeforeUnmount` is missed. Both teardowns (`animationGroup.stop()` on the scene + `dispose()` on the composable) are idempotent (`:67-70`). Clean.

---

### 1.4 EasingScene (`demo/app/scenes/EasingScene.vue`)

**Exposed:** `animationGroup`, `superKey`, `isPlaying (readonly computed)`, `isStarted (ref(true))`, `autoPlays: true`, `scenePlayback`, `tabsContent`, `ribbonContent`.

**Wiring quality:** The most complete scene contract. `isPlaying` is a machine-derived readonly computed (`useEasingDemo.ts:70`); `onPlayStateChange` guards `ownsPlayback = true` (has `scenePlayback`) so the App does NOT write `sceneRef.isPlaying` (`:173-175`) — correct. The `useRafScene` consolidation (`useRafScene.ts`) owns the RAFPlayback, bound startLoop/stopLoop, and `useSceneVisibilityPause` registration. The hot-path `DotPainter` registry (`useEasingDemo.ts:179-196`) keeps the 60 Hz updates off the Vue render graph — the I.W4 D4 discipline.

**Cold-mount behaviour (works):** `startLoop()` called at mount-time (`useEasingDemo.ts:284`) arms the loop; the machine SCENE_READY restore then sets `progress` + `playing` through the adapter. `autoPlays: true` ensures `dispatch({PLAY})` fires on every entry (`useSceneMachineApp.ts:127-130`). Observed: easing cold-enters with auto-play, slider advances, `hero-ball` transform is present (sibling lane `live-cold-play-path.md:A-2` adjacency note).

**Minor gap:** `storedControls.isControlsPanelOpen = true` setup side-effect (`:47`) is a poke that precedes the DFA desktop-open guard in `bindSceneAdapter` (`:79`). On mobile this forces the panel open even though `window.innerWidth < 1024` — the `bindSceneAdapter` guard fires AFTER this poke. On mobile this means easing always opens the controls panel, which is correct for the `editor` stageMode but may fight the sheet gesture posture.

---

### 1.5 SpringScene (`demo/app/scenes/SpringScene.vue`)

**Exposed:** `animationGroup`, `superKey`, `isPlaying (readonly computed)`, `isStarted (ref(true))`, `autoPlays: false` (no `autoPlays` key exposed — the App defaults to `autoPlays === false`), `scenePlayback`, `tabsContent`, `ribbonContent`.

**Wiring quality:** Correct machine integration. `useSpringDemo` mirrors the easing pattern: machine-derived `isPlaying`, `useRafScene` ownership, `createRafAdapter` wiring.

**Cold-play behaviour (P1):** From `live-cold-play-path.md:A-2`: `/spring` cold — the rainbow click does NOT engage play (`slider 0.5 static, vivid:false`). The spring scene does NOT have `autoPlays: true`, so play only happens on an explicit gesture. The bottom dock plays via `toggleAnimationGroup` which for the spring scene's single-anim group calls `group.play()`. Since the contract anim IS started (via `animationGroup.started = true` at composable init, `useSpringDemo.ts:395`), the first `toggleAnimationGroup` call reaches the `animationGroup.toggle()` branch — but the machine is in `paused` state, so `toggle()` → `resume()` → `group.paused: false` → `playing()` returns true. The machine PLAY effect then fires `adapter.resume()` on the rAF adapter, which calls `handle.startLoop()`. **But the loop is already running from `startLoop()` called at composable init (`:362`)** — so `startLoop` is a no-op (idempotent). The machine records `playing:true`; the rAF loop IS running; BUT the rainbow visualiser ball is tied to `progress` which only advances if `machine.status === 'playing'` (frame gate at `useSpringDemo.ts:166`). If the machine status is `playing`, the frame gate passes and `progress` advances. This should work.

The `vivid:false` in the probe may reflect the `TransportDock.vue:153-154` collapsed-dock label showing `storedControls.selectedAnimation` — which is `"Spring Preview"` for the spring scene. The **rainbow vivid class** depends on `isPlaying` (`isAnimPlaying` prop in the dock), which for the spring scene is derived from `demo.isPlaying.value` — the machine-projected readonly computed. If the machine IS playing, the prop SHOULD be true. The probe's `vivid:false` may be a timing artifact (the probe checked before the first frame gate pass) or the cold single-animation U4 select → the dock shows a static label, not the rainbow select button. **The probe's 'vivid' check reads the collapsed-dock play button's class, but the spring dock may show the static span (U4 single-anim path) rather than the `DockSelectTrigger` whose rainbow class is checked.** This is a label/vivid identification mismatch in the probe — not necessarily a functional break. Flag as P2 (needs live session verification).

**The slider-steps issue (U-K15):** The spring sidebar slider (`SpringSidebar.vue`) drives `response` and `dampingFraction` refs. The `watch([response, dampingFraction], rebuildLiveSpring)` (`useSpringDemo.ts:317`) rebuilds the `SpringProgress` on every slider change. If the glass-ui slider emits discrete steps (a known regression in the ~3.x glass-ui slider before the upstream fix), the spring rebuilds discretely instead of continuously — the visual stutter. This is a glass-ui consumer edge, not a scene-wiring bug (the scene correctly watches the refs). Seam: glass-ui slider (the 3.11.2 re-implemented slider, `56aa00f`). **The fact that `U-K15` is called out as "spring slider literally steps (not smooth)" pins this at glass-ui ~3.11.2 slider input granularity** — a consume-edge for the K glass-ui upgrade lane.

---

### 1.6 SequenceScene (`demo/app/scenes/SequenceScene.vue`)

**Exposed:** `animationGroup`, `superKey`, `isPlaying (computed)`, `isStarted (ref(true))`, `scenePlayback`.

**Wiring quality:** Machine-correct. `scenePlayback` is a `createRafAdapter` wrapping the mirror loop (`mirror.running`) and the `startLoop`/`stopLoop` seam. The `Sequence` engine loop and the rAF mirror loop are distinct (the mirror only syncs `progress`).

**Cold-play behaviour (P1 — cold slider stuck):** From `live-cold-play-path.md:A-1`: `/sequence` cold — play engages (vivid), but master slider stuck at 0. The rainbow click → `toggleAnimationGroup` → group is pre-started (`animationGroup.started = true`, `useSequenceDemo.ts:165`) → `animationGroup.toggle()` → `group.paused` flips → `playing()` true → `syncPlayState(true)` → machine PLAY. PLAY effect → `adapter.resume()` → `handle.startLoop()` → `startLoop` is the sequence-local `startLoop` (`:229`). The sequence `startLoop` checks `isMidPlay()` — at cold mount `sequence.time = 0`, `sequence.duration > 0` → `isMidPlay()` = false → calls `sequence.play()`. This should work. The master slider reads `progress.value` which is only updated by the mirror loop (`:203-210`); the mirror only starts if `startMirror()` is called inside `startLoop` (`:230`). If the mirror starts and the loop gate (`machine.status === 'playing'`) passes, `syncFromSequence()` fires per rAF and `progress.value` advances.

The "master slider stuck at 0" cold probe observation is likely the same **timing issue as spring**: the probe sampled before enough rAF frames elapsed, OR the mirror was not started in time because the machine status reached `playing` AFTER `startLoop` was called from the adapter (the adapter's `startLoop` fires synchronously inside `applyEffects` before the reactive machine `status` ref updates in the next tick). The machine `shallowRef` update (`useSceneMachine.ts:125`) is synchronous; `applyEffects` fires AFTER the update (`shallowRef` is already `playing` at that point). **The mirror loop gates on `machine.status === 'playing'` at LOOP TIME (each rAF frame), not at start time** — so there should be no race. Flag as P1 pending re-probe with a longer sample window. The sibling lane treated this as a hand-off.

**Composable hygiene:** `useSequenceDemo` does NOT use `useRafScene` (it uses `createRafAdapter` directly, `useSequenceDemo.ts:419-432`). This means it manually handles `useSceneVisibilityPause` (`:442-447`) and `onScopeDispose` (`:451-455`). The visibility pause uses the mirror `running` state as the gate (`:443`) — correct, since the mirror and the sequence loop start/stop together. The manual pattern works but diverges from the consolidated `useRafScene` recipe (which easing/spring use); this divergence was intentional because the Sequence's `startLoop` is more complex than the simple `playback.loop(frame)` pattern.

---

### 1.7 MotionPathScene (`demo/app/scenes/MotionPathScene.vue`)

**Exposed:** `animationGroup`, `superKey`, `isPlaying (ref(false) — SHADOW)`, `isStarted (ref(true))`. **Missing:** `scenePlayback`.

**This is the most significant scene-contract gap in the tree.**

**P1 — shadow playback authority (the D12 smell, un-migrated):**
`useMotionPathDemo.ts:48` declares `isPlaying = ref(false)` — a private mutable ref, NOT a machine-derived computed. `useMotionPathGesture.ts` mutates `demo.isPlaying.value = false/true` directly at four gesture callsites (`:232, :240, :258, :304`) — bypassing the machine entirely. This is the same "shadow playback authority" pattern that the D12 audit identified in earlier tranches and that easing/spring/sequence all migrated away from (H.W1). The MotionPath scene was NOT migrated.

Consequences:
- The machine's `playing` axis and the scene's `isPlaying` ref can diverge (e.g., a tab-hide/show cycle updates the machine but not the shadow ref; a PAUSE dispatch from the dock pauses the machine but the gesture handler still sees the shadow ref).
- `onPlayStateChange` writes `sceneRef.isPlaying = playing` (`:174-175`) — this IS a writable ref, so the App CAN write it. But `onPlayStateChange` only fires from the transport dock, not from the machine's effect layer directly. On restore (SCENE_READY → `adapter.restore`), the MotionPath has **no `scenePlayback`** → `exposed ?? createGroupAdapter(getGroup)` (`:84`) creates a GROUP adapter wrapping the reactive `animationGroup` getter. Since the MotionPath group is built LAZILY (registered on mount in `onMounted` of `useMotionPathGesture.ts:98-115`), the group adapter's `isPlaying()` reads the live group's state — which is correct. But `resume()` on the group adapter requires `group.started && group.paused`; if the group was just built and never played, this is again a no-op (the cold-play gap from §1.1 also applies to MotionPath).

- **No `scenePlayback` = no `progress` round-trip.** The sequence/spring/easing adapters persist `progress` (the sweep position) in the machine snapshot so a scene-switch and return restores the playhead. MotionPath has no `progress` contract — a scene switch loses the traveller's position on the path. On return the traveller snaps to offset-distance 0 (the animation's start). This is a silent UX regression on the scene-switch round-trip.

**Cold-mount behaviour:** The MotionPath animation is built on `onMounted` of `useMotionPathGesture` via `fromMotionPath` (`:105`) and registered via `demo.registerAnimation(anim)` (`:112`), which replaces the `animationGroup.value` shallowRef with a new group. This triggers the `watch(() => sceneRef.value?.animationGroup, markSceneReady)` in `useSceneMachineApp.ts:136` → `markSceneReady`. Since `autoPlayNext` is false (no home-play gesture that navigated here) and `autoPlays` is undefined, PLAY is NOT dispatched — correct; the scene starts paused. The traveller sits at offset-distance 0 and the user must click Play.

**Missing `autoPlays` on MotionPath** is intentional (the scene is an editor, not an auto-preview), but the absence is implicit (no key in the expose) — a clarity gap compared to EasingScene's explicit `autoPlays: true`.

**Composable hygiene:** `useMotionPathGesture` uses `onMounted` directly, not `useRafScene` (there is no rAF loop here — the MotionPath animation drives itself via the standard `AnimationGroup` draw loop). No visibility pause for MotionPath — the path animation pauses via the machine's `TAB_HIDDEN` → `PAUSE`-if-playing path, which fires `adapter.suspend()`. Since `suspend()` for the group adapter calls `group.pause()` (`:67-70`), this is correct. The scene's lack of a `useSceneVisibilityPause` is acceptable because the group adapter already handles the suspend.

---

## §2 — Cross-scene contract completeness matrix

| Scene | `animationGroup` | `superKey` | `isPlaying` | `isStarted` | `scenePlayback` | `autoPlays` | Custom slots |
|-------|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| CubeScene | ✓ | ✓ | writable ref | writable ref | — (group) | — | tabsTrigger, tabsContent, ribbonContent, startScreen |
| AmigaScene | ✓ | ✓ | **ABSENT** | **ABSENT** | — (group) | — | — |
| SquareScene | ✓ | ✓ | **ABSENT** | **ABSENT** | — (group) | — | — |
| EasingScene | ✓ | ✓ | readonly computed | ref(true) | ✓ rAF | **true** | tabsContent, ribbonContent |
| SpringScene | ✓ | ✓ | readonly computed | ref(true) | ✓ rAF | — | tabsContent, ribbonContent |
| SequenceScene | ✓ | ✓ | computed | ref(true) | ✓ rAF | — | — |
| MotionPathScene | ✓ | ✓ | **shadow ref** (D12) | ref(true) | **MISSING** | — | — |

Legend: `— (group)` = no explicit adapter; App creates `createGroupAdapter` from `animationGroup`. `shadow ref` = private mutable, not machine-derived.

**Missing `isPlaying`/`isStarted` in AmigaScene/SquareScene:** The App's `onPlayStateChange` write is gated on `"isPlaying" in sceneRef` — since neither exposes it, the write is silently skipped. For amiga, the draw-loop posture is owned by the group's own playing state (correct, it does not need a prop). For square, the spring loop is fully autonomous (also correct). These absences are therefore TOLERABLE but reduce observability (the shell cannot provide `isPlaying` feedback to scene components that might want it).

---

## §3 — Dead code and legacy accumulation

### 3.1 CubeScene `startScreen` slot override (P2)

`demo/app/scenes/CubeScene.vue:138-141` defines:
```ts
const startScreen = () =>
    h(EditorStartScreen, {
        hint: "or drag M. cubert ...",
    });
```
And exposes it (`defineExpose`, `:213`). However, `App.vue:115-117` renders:
```html
<template #start-screen>
    <EditorStartScreen hint="or drag M. cubert &#x1F642;&#x200D;&#x2194;&#xFE0F;" />
</template>
```
The App's default slot **is also** `EditorStartScreen` with the identical hint string. The `sceneRef?.startScreen` slot override is consumed by `ControlsPaneWrapper` or the outer `EditorShell` — but `EditorShell.vue:46-51` renders `<slot name="start-screen"><EditorStartScreen /></slot>` from the App's `#start-screen` template slot. The `CubeScene.startScreen` render function is exported in `defineExpose` but the App's `#start-screen` template never reads `sceneRef?.startScreen` (`App.vue` does not reference this property at all). The property is a no-op dead export.

### 3.2 MotionPath `isPlaying = ref(false)` shadow authority (P1)

`demo/motion-path/useMotionPathDemo.ts:48` — a pre-H.W1 private mutable `isPlaying` ref. Four callsites in `useMotionPathGesture.ts` (`232, 240, 258, 304`) mutate it directly. This is the exact D12 shadow-authority pattern. It was NOT migrated in H.W1 or I.W1 (those waves focused on easing/spring/sequence). The MotionPath scene's machine-integration seam (seen in `MotionPathScene.vue:27-28`) stores `storedControls.isControlsPanelOpen = false` and calls `getStoredAnimationGroupControlOptions` — but it never calls `useSceneMachine`, so the scene cannot receive play intent from the machine except through the `onPlayStateChange` chain (App-level → writable `isPlaying` write → CubeTarget analogue, but MotionPath has no equivalent prop-reader).

### 3.3 `changeGraphPerspectiveAnim` in useCubeAnimations (P2)

`demo/cube/useCubeAnimations.ts:91-104` creates a `CSSKeyframesAnimation` for the graph perspective change and auto-plays it in `setTargets`. It is NOT a member of the `AnimationGroup`, NOT returned from the composable, and NOT persisted in the machine snapshot. On a scene-switch and return, the animation is re-played from start (the one-shot play fires every time `setTargets` is called — i.e., on every CubeScene mount since there is no KeepAlive). This is a minor cosmetic-flash issue on hot-revisit, not a functional bug.

### 3.4 `randomized animationDelay/animationDuration` on rainbow-wrapper faces (P2)

`demo/cube/CubeTarget.vue:60-63`:
```html
:style="{
    animationDelay: `${Math.random() * 10}s`,
    animationDuration: `${Math.random() * 10}s`,
}"
```
`Math.random()` is called every render cycle that touches this reactive binding. Because these are inline style bindings, Vue re-evaluates them on every component update that triggers a patch — each render produces new random values, which flickers the rainbow animation timing. The `Math.random() * 10` range (0–10s) is also very wide; a 0.001s delay and a 9.999s duration on adjacent faces create visible desynchrony. This is not new in Tranche K but is a longstanding quality issue.

---

## §4 — The cold-mount/default-state band (U-K2/K3/K5 scene view)

The root cause of U-K2 (hero rainbow-play → no transition), U-K3 (rainbow play broken while slider progresses), and U-K5 (square animations not working) is **not per-scene but cross-scene** — the `createGroupAdapter.resume()` no-op on an unstarted group (`scenePlaybackAdapters.ts:76-79`). This was rooted and fully documented in `live-cold-play-path.md:P0-1` and `live-session-gap-analysis.md:§1`. The scene-lane's contribution is:

1. **The defect IS per-scene-family:** it affects all GROUP-adapter scenes (cube, amiga, square) on their FIRST visit. It does NOT affect rAF-adapter scenes (easing, spring, sequence, motion-path) because those use `createRafAdapter.resume()` which calls `handle.startLoop()` unconditionally (no `group.started` guard).
2. **The scene contract has no formal "can play on cold-mount" discriminator.** The `autoPlays` boolean covers the auto-play-on-entry intent for rAF scenes; there is no equivalent for group scenes. The adapter's `resume/play` split is the gap.
3. **Fix seam (per the cold-play-path lane):** `createGroupAdapter.resume()` should become `play/resume`: `if (!group.started) group.play(); else if (group.paused) group.resume()`. Or `markSceneReady`'s autoplay branch should call `currentAnimationGroup.value.play()` directly when `autoPlayNext` is true and the group is unstarted.

---

## §5 — Composable hygiene summary

| Composable | `useRafScene` | `onScopeDispose` | `useSceneVisibilityPause` | Machine-derived `isPlaying` |
|-----------|:---:|:---:|:---:|:---:|
| `useCubeAnimations` | — (group) | — (AmigaScene owns stop) | ✓ (`useCubeAnimations.ts:112`) | N/A (prop) |
| `useAmigaAnimations` | — (group) | — (AmigaScene owns stop) | via AmigaScene IntersectionObserver | N/A |
| `useSquareAnimations` | — (self-RAFPlayback) | ✓ (`:234`) | — (self-terminate) | N/A |
| `useEasingDemo` | ✓ | ✓ (via useRafScene) | ✓ (via useRafScene) | ✓ |
| `useSpringDemo` | ✓ | ✓ (via useRafScene) | ✓ (via useRafScene) | ✓ |
| `useSequenceDemo` | — (manual) | ✓ (`:451`) | ✓ (`:442`) | ✓ |
| `useMotionPathDemo` | N/A | — | — | **shadow ref (P1)** |

`useMotionPathDemo` is the only composable that (a) has no `onScopeDispose` for its internal state, (b) has no visibility pause, and (c) uses a shadow `isPlaying` ref. The group adapter in the App handles suspend/resume for the animation, so (b) is partially covered; (a) is benign since there is no timer/rAF to clean up; (c) is the live bug.

---

## §FOLD

| # | Finding | Sev | The seam (file:line) | Suggested wave-class |
|---|---------|:---:|----------------------|---------------------|
| S1 | **COLD group-adapter resume no-op:** `createGroupAdapter.resume()` (`scenePlaybackAdapters.ts:76-79`) guards `group.started && group.paused`; on a first-visit cold mount `group.started === false` → resume is a no-op → the machine records `playing:true` but the engine never starts. Affects cube/amiga/square on first visit. Root of U-K2/K3/K5 (per `live-cold-play-path.md:P0-1`). | **P0** | `scenePlaybackAdapters.ts:76-79` (resume guard) + `useSceneMachineApp.ts:119-130` (markSceneReady→PLAY chain) | cold-play-engine fix (K.W-impl: adapter play/resume split OR markSceneReady direct-play for autoPlayNext) |
| S2 | **MotionPath missing `scenePlayback` adapter:** `useMotionPathDemo` has no machine integration; `isPlaying = ref(false)` is a shadow authority mutated at 4 gesture callsites in `useMotionPathGesture.ts` (`:232,240,258,304`). Traveller position not persisted in machine snapshot → scene-switch loses playhead. | **P1** | `useMotionPathDemo.ts:48` (shadow ref) + `useMotionPathGesture.ts:232,240,258,304` (mutations) + `MotionPathScene.vue:31-35` (no scenePlayback expose) | motion-path machine integration (K.W-impl: migrate to `useSceneMachine` + `createGroupAdapter`-based or `useRafScene`-based adapter, expose `scenePlayback`) |
| S3 | **AmigaScene K4-C: persisted `playing:true` auto-resumes the bounce group on cold reload** (zero gesture). `useSceneMachine.ts:177` restores when `snap.playing || snap.started`; amiga group stays started after any play. Bounce runs uninstructed on every reload after one play session. Root of the "constantly" axis of U-K4 (per `live-amiga-breakage.md:K4-C`). | **P1** | `useSceneMachine.ts:177` (restore gate) + `useAmigaAnimations.ts:24` (BOUNCE amplitude) | amiga scene (K.W-impl: add explicit "requires user gesture" flag to the amiga scene's machine snapshot, or reset `playing:false` on bouncing-group natural-end) |
| S4 | **AmigaScene K4-A: `material.color` multiplied into checkerboard texture** (`useAmigaAnimations.ts:57-58`): `setHSL(colorT,1,0.95)` tints a `MeshLambertMaterial` with `.map` → `map × color` desaturation/resaturation cycle. Observed satRange 0.216 over 4 s. Root of the "flashes" axis of U-K4 (per `live-amiga-breakage.md:K4-A`). | **P1** | `demo/amiga/useAmigaAnimations.ts:57-58` (material.color write) + `demo/amiga/utils.ts:35-37` (map texture build) | amiga scene (K.W-impl: drop hue-cycle animation from the default group or use `emissive`/separate tint channel that does not multiply the map) |
| S5 | **AmigaScene K4-B: bounce envelope = ~69% canvas width / 37% height** — `BOUNCE = BOX_SIZE/2-1 = 5` with `BOUNCE_FIT_MARGIN = 0.95`. The sphere swings to the frame edge by design; visually reads as chaotic floating. Root of the "floats around" axis of U-K4 (per `live-amiga-breakage.md:K4-B`). | **P1** | `demo/amiga/useAmigaAnimations.ts:24` (BOUNCE constant) + `AmigaScene.vue:62` (BOUNCE_FIT_MARGIN) | amiga scene (K.W-impl: reduce BOUNCE and/or BOUNCE_FIT_MARGIN to keep excursion tasteful; design-amplitude call) |
| S6 | **CubeScene `startScreen` slot override is dead export:** `CubeScene.vue:138-141` defines and exposes `startScreen` render fn, but `App.vue` provides `#start-screen` directly (`:115-117` with the same component and hint). The property is never read from `sceneRef`. | **P2** | `demo/app/scenes/CubeScene.vue:138-141,213` vs `demo/app/App.vue:115-117` | housekeeping (K.W-impl: delete `startScreen` render fn + expose entry from CubeScene) |
| S7 | **SquareScene: rainbow Play button does nothing visible** (group contract anim has no DOM target; machine PLAY→resume is a no-op on the just-`play()`ed group since `group.paused=false`). The scene exposes no `ribbonContent` to replace the transport with a contextual drag affordance. User expectation: "Play animates the box." Reality: box is drag-autonomous; Play changes nothing. | **P2** | `demo/app/scenes/SquareScene.vue:151-154` (no ribbonContent) + `useSquareAnimations.ts:192-210` (contract anim has no target) | ux refinement (K.W-impl: expose `ribbonContent` replacing the transport with a drag affordance; OR remove the animation group from the scene contract, OR connect a "tumble" play-verb to the bottom bar) |
| S8 | **`Math.random()` in reactive CubeTarget rainbow-wrapper style binding:** `CubeTarget.vue:60-63` — inline `:style` calls `Math.random()` per render, flickering the rainbow timing on every reactive update. Wide range (0–10s) also creates jarring desynchrony. | **P2** | `demo/cube/CubeTarget.vue:60-63` | cube refinement (K.W-impl: generate random delays once at component setup; store in a static array; bind the array values instead of live `Math.random()`) |
| S9 | **SpringScene slider-steps (U-K15):** `response`/`dampingFraction` sliders emit discrete steps (glass-ui ~3.11.2 slider input granularity). `useSpringDemo.ts:317` `watch([response, dampingFraction], rebuildLiveSpring)` rebuilds on every step → discrete jumps instead of smooth sweep. Seam is the glass-ui slider; the scene wiring is correct. | **P1** | `demo/spring/SpringSidebar.vue` (slider consumers) + `useSpringDemo.ts:317` (rebuild watch); root: glass-ui ~3.11.2 slider | glass-ui version upgrade (K.W-impl: upgrade glass-ui to latest 3.13.0; verify slider emits continuous input events) |
| S10 | **Sequence cold slider stuck at 0 (U-K13 adjacency):** `live-cold-play-path.md:A-1` observes master slider static after cold play. Root uncertain — possible machine-status→loop gate timing issue (mirror gates on `machine.status` per frame; PLAY effect fires the adapter's `startLoop` synchronously). Needs re-probe with longer sample window before assigning root. | **P1** | `useSequenceDemo.ts:203-210` (mirror loop) + `:166` (frame gate) | sequence lane (re-probe needed; K.W-impl if confirmed: arm mirror unconditionally on PLAY, stop on PAUSE/stop) |

---

## 10-line summary

1. The **cold home→cube play P0** (`S1`) — `createGroupAdapter.resume()` no-ops on an unstarted group — is the single most impactful defect, rooted at `scenePlaybackAdapters.ts:76-79`. Full root chain in `live-cold-play-path.md`.
2. **MotionPath (`S2`) is the only scene that never migrated to machine-native playback** (H.W1). It still uses a shadow `isPlaying` ref mutated by the gesture composable at 4 sites, and exposes no `scenePlayback` adapter, so scene-switch loses the traveller's position.
3. **AmigaScene has three compounding U-K4 defects** (`S3/S4/S5`): bounce-restores-on-cold-reload (persisted `playing:true`), texture-color multiply (hue-cycle flash), and a bounce envelope that fills the frame.
4. **EasingScene, SpringScene, and SequenceScene** are the most complete scene contracts — they use `useRafScene` or equivalent, expose `scenePlayback`, and derive `isPlaying` from the machine.
5. **AmigaScene and SquareScene** expose only `animationGroup + superKey` — no `isPlaying`, no `isStarted`, no adapter. This is tolerable (group adapter is created implicitly) but reduces shell observability.
6. **SquareScene's Play button** does nothing visible to the user — the box is spring-autonomous and the contract anim has no DOM target (`S7`). No `ribbonContent` to replace the transport with a drag affordance.
7. **`Math.random()` in CubeTarget's reactive style binding** (`S8`) flickers rainbow timing per render.
8. **Spring slider steps** (`S9`) trace to the glass-ui ~3.11.2 slider granularity; the scene wiring is correct. Fix: upgrade to glass-ui 3.13.0.
9. **CubeScene exports a dead `startScreen` render fn** (`S6`) — the App provides the same content directly and never reads `sceneRef.startScreen`.
10. **No gate exercises the cold hero CTA** (`live-session-gap-analysis.md:§0`): the gate battery green-runs over the broken P0 path because `proof:live-session` pre-seeds `isControlsPanelOpen`, counts the idle-bob CSS animation as "engine live," and clicks play twice.
