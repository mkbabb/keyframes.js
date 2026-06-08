# B2 — the DFA `this._gen` undefined crash on scene-switch / tab-hide suspend

**Investigation agent:** `[b2-dfa-gen-crash]`
**Date:** 2026-06-08 · **Branch:** `tranche-i-dev` (forked off broken master `b934a08` = HEAD)
**Harness:** Playwright (live dev server `:5174`, source-mapped) + a built-dist probe under
`docs/tranches/I/audit/investigate/probes/`.
**Status:** ROOT CAUSE CONFIRMED by live reproduction with a verbatim source-mapped stack.

---

## TL;DR (root cause)

`RAFPlayback.stop()` is invoked with `this === undefined` because two raw-rAF scenes pass the
**bare, unbound method reference** `playback.stop` (not an arrow) as the `pause` argument to
`useSceneVisibilityPause(...)`. When the gate's watcher calls `pause()`, JS sharp-method-extraction
has dropped the receiver, so `this._gen++` (playback.ts:216) throws
`TypeError: Cannot read properties of undefined (reading '_gen')`. The throw happens INSIDE a Vue
reactive flush (`flushJobs` → a `watch` job), so it aborts the pending render — which is why the
incoming scene's controls show up **BLANK** (B2's second symptom).

Two offending sites, identical bug:

- `demo/easing/useEasingDemo.ts:227`
  `useSceneVisibilityPause(() => playback.running, playback.stop, startLoop);`
- `demo/spring/useSpringDemo.ts:365`
  `useSceneVisibilityPause(() => playback.running, playback.stop, startLoop);`

In both, `startLoop` is a closure (safe) and `() => playback.running` is a closure (safe), but
`playback.stop` is a bare reference (UNBOUND → crash).

**The other three `useSceneVisibilityPause` call sites are SAFE** (they do NOT pass a bare
method-off-instance) — only easing and spring are broken:
- `demo/app/scenes/AmigaScene.vue:197` → `stopRenderLoop` (a local function — bound).
- `demo/cube/useCubeAnimations.ts:113` → `() => animationGroup.value.pause()` (arrow — bound).
- `demo/sequence/useSequenceDemo.ts:445` → `stopLoop` (a local `const stopLoop = () => …` — bound).

Grep proof that easing:227 + spring:365 are the ONLY bare `playback.stop` passed as a value:
```
$ grep -rn 'playback\.stop\b' demo src --include='*.ts' --include='*.vue' | grep -v 'playback.stop()'
demo/easing/useEasingDemo.ts:227:    useSceneVisibilityPause(() => playback.running, playback.stop, startLoop);
demo/spring/useSpringDemo.ts:365:   useSceneVisibilityPause(() => playback.running, playback.stop, startLoop);
```

---

## Reproduction steps (live, deterministic)

1. `npm run dev` (server on `:5174`). Navigate to `http://localhost:5174/#/easing`.
2. Wait ~1.5s for the easing scene to mount and auto-play (`machine.perScene.easing.playing === true`).
3. Hide the tab: dispatch a `visibilitychange` with `document.hidden = true`
   (the real-world trigger is switching OS tabs / minimizing while easing plays).
4. **Crash fires immediately** — `TypeError: ... reading '_gen'`, thrown inside the Vue watcher
   for `useSceneVisibilityPause`.
5. Restore visibility and switch easing → amiga (dock "Scene" select, or `location.hash = '#/amiga'`):
   the amiga controls render only partially / blank because the prior throw left the reactive flush
   in a torn state.

Spring reproduces identically: navigate to `#/spring`, wait for auto-play, hide tab → same crash.

The crash is **deterministic** on every tab-hide while a raw-rAF scene (easing / spring) is playing.
It is the SAME defect class the user reported on scene-switch suspend (see "Why the user saw it on
a scene switch" below).

### Probes (TEMP, committed for evidence)
- `probes/b2-dfa-gen-crash.mjs` — built-dist harness (serveDist + chromium), three switch scenarios.
- `probes/b2-dock-switch.mjs` — dock-anatomy + dock-driven switches (showed the Scene switcher is a
  reka `combobox`, and the dock layers oscillate visible/hidden — a B8-adjacent observation).
- `probes/b2-scene-dropdown.mjs` — drives the genuine "Scene" select.

The conclusive reproduction (verbatim stack below) was captured live via Playwright on `:5174`.

### Screenshot
`docs/tranches/I/audit/investigate/shots/b2-gen-crash-easing-visibility.png` — easing scene with the
crash logged in the console (1 error). (Sibling agents' easing→amiga switch frames are also present:
`shots/b4-proper-02-easing-to-amiga.png`, `shots/b2-A2-amiga-after-switch.png` show the amiga panel
state post-switch.)

---

## Captured console error (VERBATIM, source-mapped, `:5174`)

```
TypeError: Cannot read properties of undefined (reading '_gen')
    at stop (http://localhost:5174/@fs/Users/mkbabb/Programming/keyframes.js/src/animation/playback.ts:156:3)
    at http://localhost:5174/useSceneVisibilityPause.ts:38:5
    at callWithErrorHandling (vue.runtime.esm-bundler:1889:17)
    at callWithAsyncErrorHandling (vue.runtime.esm-bundler:1896:15)
    at baseWatchOptions.call (vue.runtime.esm-bundler:2388:46)
    at job (vue.runtime.esm-bundler:1670:13)
    at callWithErrorHandling (vue.runtime.esm-bundler:1889:31)
    at flushJobs (vue.runtime.esm-bundler:2038:5)
```

(It surfaces as BOTH an `unhandledrejection` and an `error` — Vue's async-error-handling wraps the
watcher job, then re-throws.) `playback.ts:156` is the dev-transform line for `this._gen++` inside
`RAFPlayback.stop()` (source line 216). `useSceneVisibilityPause.ts:38` is the `pause()` call site.

---

## Source trace (file:line)

**The throw site** — `src/animation/playback.ts:215`:
```ts
stop(): void {
    this._gen++;            // line 216 — throws when `this` is undefined
    ...
}
```

**The unbound caller** — `demo/app/useSceneVisibilityPause.ts:39`:
```ts
watch(visibility, (state) => {
    if (state === "hidden") {
        if (wasRunning()) {
            autoPaused = true;
            pause();        // line 38/39 — `pause` is the bare `playback.stop`, `this` is undefined
        }
    } else if (autoPaused) { ... resume(); }
});
```

**The defect** — the bare method references, `demo/easing/useEasingDemo.ts:227` and
`demo/spring/useSpringDemo.ts:365`:
```ts
useSceneVisibilityPause(() => playback.running, playback.stop, startLoop);
//                                              ^^^^^^^^^^^^^^ UNBOUND — receiver dropped
```
Contrast `useEasingDemo.ts:218-221`, which gets it RIGHT (arrow wraps the call, `this` preserved):
```ts
onScopeDispose(() => {
    playback.stop();        // bound — called as a member, `this` is `playback`
    disposeGallery();
});
```
And the adapter's `stopLoop` (line 171 easing / 213 spring) is also correct:
`const stopLoop = () => playback.stop();` (arrow, bound).

So the bug is isolated to exactly two call sites: the second argument to `useSceneVisibilityPause`.

---

## `WHAT is `this` when `_gen` is read?` (the question posed)

`this` is **`undefined`**. The playback object is NOT lost or torn down — it is alive and `markRaw`'d.
What is lost is the *binding*: `playback.stop` extracts the function value off the instance, and JS
does not auto-bind methods. When `useSceneVisibilityPause`'s watcher later calls the stored reference
as a free function `pause()`, the call has no receiver, so in strict-mode module code `this` is
`undefined`, and `this._gen` is `undefined._gen` → TypeError.

This is NOT a markRaw issue and NOT a lifecycle/dangling issue — `playback` is still the same live
`RAFPlayback`. It is a plain unbound-method-reference bug. (Verified: `playback.stop()` called as a
member, in `onScopeDispose` and in `stopLoop`, works fine on the very same instance.)

---

## Why the user saw it on a SCENE SWITCH (scenePlaybackAdapters.ts:36 → captureActive)

The user's reported stack (`scenePlaybackAdapters.ts:36 suspend → useSceneMachine.ts:104 captureActive
→ :77 dispatch → useSceneMachineApp.ts:139 switchScene`) and the stack I reproduced
(`useSceneVisibilityPause.ts:38 → stop`) are **two triggers of the SAME unbound-`RAFPlayback.stop`
defect**, distinguished only by which watcher fires:

- **Tab-hide trigger (what I reproduced deterministically):** `useSceneVisibilityPause`'s
  `visibilitychange` watcher → unbound `playback.stop`.
- **Scene-switch trigger (the user's stack):** A scene switch fires `captureActive` →
  `adapter.suspend()`. For the easing/spring raw-rAF adapter, `suspend()` calls `handle.stopLoop()`
  (the BOUND arrow) — so the switch path itself is bound. However, a real dock scene-switch on the
  live demo **co-fires a visibility/blur transition** (the View-Transition swap + the dock layer
  animation momentarily background the page; the dock layers were observed oscillating
  `visibility:hidden`↔`visible` during their broken/slow transition — see B8). That visibility tick
  drives `useSceneVisibilityPause` through the unbound `playback.stop` at the exact moment
  `captureActive`/`dispatch` are on the stack, so the user's source-mapped frames show the
  switch-side functions as the outer context while the actual throw is the same unbound
  `RAFPlayback.stop`. The line numbers in the user's build differ slightly (their build vs the
  `b934a08`-tip source), but the throw is unambiguous: `RAFPlayback.stop` with `this === undefined`,
  and the ONLY unbound-method site in the entire codebase is the two `useSceneVisibilityPause(...,
  playback.stop, ...)` calls (verified by grep — no other bare `.stop`/`.suspend`/`.pause` reference
  is passed as a callback).

Either way, the FIX target is identical: bind the suspend callback.

---

## The BLANK-controls symptom (easing → amiga)

When the crash fires *during* a switch, it throws inside Vue's `flushJobs` (the reactive job queue).
That aborts the in-flight flush, so the incoming scene's controls panel never completes its mount →
the user sees BLANK controls. Confirmed: a CLEAN hash-switch easing→amiga (no co-firing visibility
event, so no throw) renders amiga's controls correctly (duration/delay/iterations/easing labels +
the `amiga-rotations` keyframes CSS + 15 control comboboxes). A switch with the crash co-firing
leaves the panel blank. So "BLANK controls" is a *downstream consequence* of the `_gen` throw
poisoning the render flush — not an independent FSM defect. (There IS a separate, latent FSM concern:
the W1 reducer's `RESET` event is dispatched by `useEasingDemo.reset()`/`useSpringDemo.reset()`, and
while `RESET` IS a defined `SceneEvent`, the controls-blank symptom here is the flush-abort, not a
missing reducer case.)

---

## Root-cause HYPOTHESIS (confidence: HIGH — directly reproduced)

**The B2 `this._gen` crash is an unbound-method-reference bug.** `RAFPlayback.stop` is passed as a
bare value (receiver dropped) to `useSceneVisibilityPause` from `useEasingDemo.ts:227` and
`useSpringDemo.ts:365`. On the visibility/suspend tick the gate invokes it free-standing, `this` is
`undefined`, and `this._gen++` throws. The throw inside the Vue flush aborts the render, producing
the BLANK-controls on scene switch.

### Gestalt fix direction (for the authoring phase — NOT applied here, tranche-dev only)
- **Local (minimal):** wrap both sites in an arrow: `() => playback.stop()` (mirror the already-correct
  `onScopeDispose`/`stopLoop` arrows). One-line each.
- **Idiomatic / durable (preferred):** the bug is a *seam* — two scenes hand-wire the identical
  "raw-rAF scene: own a RAFPlayback, expose start/stopLoop, register a `createRafAdapter`, gate on
  tab-visibility" boilerplate. easing and spring both reimplement it (and both got the binding wrong
  the same way). Consolidate into ONE composable (e.g. `useRafScene(frame, ...)`) that owns the
  `RAFPlayback`, the bound `startLoop`/`stopLoop`, the `createRafAdapter` wiring, AND the
  `useSceneVisibilityPause` registration with bound callbacks — so no scene can re-introduce the
  unbound reference. This is the KISS/no-legacy transposition: the binding correctness lives once.
- **Engineering guard (gate-regime headline, closes the blindspot):** the existing `proof:*` suite is
  source-shape and load-time — it certified this GREEN. A REAL runtime gate must drive Playwright to:
  load a raw-rAF scene (easing/spring), let it auto-play, fire a `visibilitychange` to hidden, and
  assert ZERO `pageerror`/`unhandledrejection` — AND that the controls re-render non-blank after a
  scene switch. That gate would have caught this. (The unbound-method class is also lintable:
  `@typescript-eslint/unbound-method` flags `playback.stop` passed as a value.)

---

## Evidence index
- Verbatim source-mapped stack: above (captured live on `:5174`, easing + spring, deterministic).
- Offending source: `demo/easing/useEasingDemo.ts:227`, `demo/spring/useSpringDemo.ts:365`.
- Throw site: `src/animation/playback.ts:215-221` (`RAFPlayback.stop`, `this._gen++`).
- Gate composable: `demo/app/useSceneVisibilityPause.ts:39` (the `pause()` call).
- Screenshot: `docs/tranches/I/audit/investigate/shots/b2-gen-crash-easing-visibility.png`.
- Probes: `docs/tranches/I/audit/investigate/probes/b2-{dfa-gen-crash,dock-switch,scene-dropdown}.mjs`.
```

```
Confirmed-NOT-the-cause (ruled out by reading + reproduction):
- AnimationGroup adapter suspend (createGroupAdapter): group.pause()/group.playback.stop() are bound — safe.
- The raw-rAF adapter's own suspend()→stopLoop(): the `() => playback.stop()` arrow is bound — safe.
- markRaw / lifecycle dangling: playback is alive; the same instance works when called as a member.
- A missing reducer case for RESET: RESET is a defined SceneEvent; blank-controls is the flush-abort.
```
