# H.W1 impl — CLEANUPS lane (`impl-w1-cleanups.md`)

The deletions lane (no legacy beside its replacement). Every deletion noted
below; the tree is **tsc-clean** (`npx tsc --noEmit` → 0), the app demo
**builds** (`npm run gh-pages` → `✓ built`), and the full vitest suite **passes**
(657 passed + 1 expected-fail = the born-RED `proof:group-snapshot-identity`
engine HANDOFF). DO NOT re-litigate the RESOLVED design decisions.

This lane runs ON TOP of the CORE+HEART lane (`impl-w1-core-api.md`) and the
Adapters lane — both already landed in tree. Two of the four mandated cleanups
were ALREADY discharged by CORE (noted below as "already done by CORE") because
CORE deleted whole files (`useSceneRouter.ts`, `useSceneUrl.ts`) rather than
editing two sites inside them, and re-authored `router.ts`'s guard. This lane
discharged the remaining two AND found + killed a third raw localStorage
active-scene site CORE's file-deletions did not reach.

---

## 1. The mandated cleanups — disposition

| # | Mandate | Status |
|---|---|---|
| 1 | DELETE the two raw localStorage sites in `useSceneRouter.ts:23,47-49`; merge `useSceneRouter`/`useSceneUrl` into the machine reconcile if empty | **ALREADY DONE by CORE** — both files were DELETED whole (git `D`), folded into `demo/app/useSceneMachineRouter.ts` (the ONE reader + ONE writer + echo guard + first-load seed). No localStorage active-scene read/write survives in the reconcile. |
| 2 | Collapse `usePlaybackToggle`'s SOLO/GROUPED fork to ONE path (the machine is always the owner) | **DONE this lane** — see §2. |
| 3 | Route `useAnimationGroupPlayback.syncPlayState` through the machine action | **ALREADY routed via the emit→dispatch bridge CORE built** — see §3 (a deliberate NON-edit, justified). |
| 4 | Drop the deprecated `next()` guard in `router.ts:49` (return its value) | **ALREADY DONE by CORE** — `router.ts` `beforeEach((to) => …)` returns a redirect-location / `true`; zero `next(` tokens remain (grep clean). |

Plus a found-in-passing third raw localStorage active-scene site CORE's
file-deletions didn't reach (§4).

---

## 2. The SOLO/GROUPED fork collapse (mandate #2)

**Root fact (verified):** the ONLY renderer of `<AnimationControls>` is
`ControlsPaneWrapper.vue` (single grep hit), which hard-coded `:is-grouped="true"`.
The whole panel chain `ControlsPaneWrapper → AnimationControls →
AnimationControlsControls → usePlaybackToggle/PlaybackRibbon` is therefore
ALWAYS grouped. Under the machine, playback for every panel is group-owned via
`createGroupAdapter` (the bottom-bar transport host). The SOLO branch was dead
code that "only ever existed because there was no shared authority" (the spec's
own framing).

The collapse removes the `isGrouped` axis ENTIRELY (DRY · no-legacy-beside-
replacement), not just inside the toggle — `isGrouped` was a dead prop threaded
through three components plus a hard-coded literal:

### DELETED

- **`controls/composables/usePlaybackToggle.ts`** — the `isGrouped: () => boolean`
  parameter; the entire SOLO branch (`if (isGrouped()) { emit; return }` else
  `animation.play()`/`animation.toggle()` + the `prevT`/`pausedTime` clock
  bookkeeping); the `prevT` ref. `toggleAnimation()` now unconditionally
  `emitTogglePlay()`. Signature: 3 args → 2 (`getAnimation`, `emitTogglePlay`).
- **`controls/AnimationControlsControls.vue`** — the `isGrouped?: boolean` prop;
  the third arg in the `usePlaybackToggle(...)` call; the `:is-grouped` binding
  on `<PlaybackRibbon>`; `v-if="isGrouped && layerConfig"` → `v-if="layerConfig"`
  (the layer config row is gated by whether the animation HAS a layer, not by a
  now-constant `isGrouped`).
- **`controls/AnimationControls.vue`** — the `isGrouped?: boolean` prop (the
  pass-through); the `:is-grouped="isGrouped"` binding on
  `<AnimationControlsControls>`.
- **`controls/PlaybackRibbon.vue`** — the `isGrouped?: boolean` prop; the dead
  `!isGrouped` SOLO branch in `scrubTo` (poke `animation.paused`/`animation.t`/
  `interpFrames` directly). `scrubTo` now unconditionally emits `sliderUpdate`
  (the group `setChildTime`s just this animation). The stale "non-grouped
  animation" wording in the `scrubbed` emit comment is corrected.
- **`components/ControlsPaneWrapper.vue`** — the hard-coded `:is-grouped="true"`
  binding on `<AnimationControls>`.

**Verification:** `grep -rn 'isGrouped|is-grouped' demo` → zero LIVE references
(remaining hits are explanatory doc-comments naming what was removed).

---

## 3. `syncPlayState` → the machine action (mandate #3, a justified NON-edit)

`useAnimationGroupPlayback.syncPlayState` ALREADY routes through the machine
action, via the emit→dispatch bridge CORE built — NO new edit was correct here:

`syncPlayState` emits `playStateChange`/`startStateChange` →
`AnimationControlsGroup` re-emits → `EditorShell` → `App.vue:86-87` →
`useSceneMachineApp.onPlayStateChange(playing)` → `machine.dispatch({ type:
playing ? "PLAY" : "PAUSE" })`. That IS routing the play state through the
machine action (the single authority).

**Why NOT couple `useAnimationGroupPlayback` directly to `useSceneMachine`:**
`useAnimationGroupPlayback` lives in the SHARED component lib
(`demo/@/components/custom/animation-controls/`) consumed by the simple / cube /
balls / boxes demos that have NO scene machine. Importing the demo-app's
`useSceneMachine` into the shared composable would couple the reusable controls
to one app's store — a layering inversion that breaks the other demos and
violates KISS/decomposition. The emit→dispatch bridge at the App seam is the
correct decoupling: the composable stays a generic group-playback driver; the
App composes it with the machine. The local `isPlaying`/`isStarted` refs remain
the per-panel render-bridge for `useAnimationProgress` (the markRaw → reactive
sync), not a competing authority — the machine status is authoritative and is
what `onPlayStateChange` dispatches off.

This matches `impl-w1-core-api.md §7`'s already-resolved statement that
"`syncPlayState` routes through the machine action."

---

## 4. Found-in-passing: the third raw localStorage active-scene site (BONUS)

`AnimationControlsGroup.vue`'s `clear()` (the dock "clear/reset" action) wrote
the LEGACY `localStorage.setItem("keyframes-js-active-scene", "home")` then
reloaded — the same raw-localStorage-active-scene smell the mandate names, but in
a third site CORE's `useSceneRouter`/`useSceneUrl` file-deletions didn't reach.
Under the machine, the active-scene fact is persisted by the machine under
`keyframes-js-scene-machine` (via `useStorage`); the legacy key is read by NOBODY
(grep-confirmed: it was the lone surviving writer). So the `clear → home` intent
was actually BROKEN — the legacy write no-op'd and the machine's persisted active
scene survived the reload.

### DELETED + re-pathed (no legacy beside replacement)

- **`AnimationControlsGroup.vue` `clear()`** — DELETED the
  `try { localStorage.setItem("keyframes-js-active-scene", "home") } catch {}`
  block (and its now-pointless try/catch). `clear()` now just
  `resetAllStores(); window.location.reload()`.
- **`stores/useSceneMachine.ts`** — the `PERSIST_KEY` const is renamed +
  EXPORTED as `SCENE_MACHINE_PERSIST_KEY` (single-sourced; no string
  duplication). No behavior change to the machine.
- **`stores/index.ts` `resetAllStores()`** — now also wipes
  `SCENE_MACHINE_PERSIST_KEY` (`[...STORE_KEYS, SCENE_MACHINE_PERSIST_KEY]`), so a
  reset reload boots the machine to its `HOME_SCENE_ID` default — the genuine
  "clear → home", single-pathed through the machine's own persistence (no second
  localStorage key authority). Import graph checked: no cycle
  (`useSceneMachine` imports only `@vueuse/core` + the pure `sceneMachine`;
  `index.ts` is already downstream of both).

**Verification:** `grep -rn 'keyframes-js-active-scene' demo` → zero LIVE
references (remaining hits are doc-comments naming the removed key).

---

## 5. Gate state

- `npx tsc --noEmit` → **0 errors** (was 0 at baseline; preserved).
- `npm run gh-pages` (the app-demo SFC compile — the real check for the removed
  template props) → **`✓ built`** (pre-existing vueuse `#__PURE__` + dynamic-
  import warnings only, unrelated to this lane).
- `npx vitest run` → **63 files, 657 passed + 1 expected-fail** (the expected-fail
  is the born-RED `proof:group-snapshot-identity` engine HANDOFF — correctly RED
  until value.js ships `serialize()/hydrate()`).
- `proof:single-writer` posture preserved: this lane added NO writable
  `machine.activeScene`/`.status` assignment; it removed a localStorage writer.

## 6. Files touched (left in tree, NOT committed)

| File | Edit |
|---|---|
| `controls/composables/usePlaybackToggle.ts` | SOLO branch + `isGrouped` arg + `prevT` DELETED; signature 3→2 args |
| `controls/AnimationControlsControls.vue` | `isGrouped` prop + binding DELETED; `v-if` simplified; toggle call 3→2 args |
| `controls/AnimationControls.vue` | `isGrouped` pass-through prop + binding DELETED |
| `controls/PlaybackRibbon.vue` | `isGrouped` prop + dead SOLO `scrubTo` branch DELETED; comment corrected |
| `components/ControlsPaneWrapper.vue` | hard-coded `:is-grouped="true"` DELETED |
| `AnimationControlsGroup.vue` | legacy `keyframes-js-active-scene` localStorage write DELETED from `clear()` |
| `stores/useSceneMachine.ts` | `PERSIST_KEY` → exported `SCENE_MACHINE_PERSIST_KEY` |
| `stores/index.ts` | `resetAllStores()` now wipes the machine persist key |
