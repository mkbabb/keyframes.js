# INV [b14-controls-dfa-render] — the per-scene control-surface DFA + the B2 "blank controls"

**Agent:** investigation [b14-controls-dfa-render]
**Date:** 2026-06-08
**Harness:** Playwright (playwright-core via `KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js`),
serving the BUILT `dist/gh-pages` on port 0 + the dev server at `:5174` for source-mapped stacks.
**Probes (run, kept under `audit/investigate/probes/`):**
- `b14-controls-dfa-render.mjs` — per-scene fresh-mount control-surface render snapshot (7 scenes) + a
  hash-route easing→amiga switch.
- `b14-dock-snapshot.mjs` — harvests the dock nav DOM (found the scene switcher is a reka **Select**,
  `aria-label="Scene"`, not per-scene nav buttons).
- `b14-b2-reka-select.mjs` / `b14-b2-switch-repro.mjs` / `b14-gen-crash-minimal.mjs` — switch-repro
  attempts against dist (blocked by the dock's own animation flakiness — see below).
- The DECISIVE reproduction was driven LIVE via Playwright-MCP against the dev server (`:5174`), which
  yielded the **source-mapped** `_gen` stack.

**Screenshots (`audit/investigate/shots/`):** `b14-fresh-{cube,amiga,square,easing,spring,sequence,
motion-path}.png` (per-scene render), `b14-b2-1-after-switch.png`, `sw2_easing_to_amiga.png`
(the ghosted-controls after-switch, sibling-captured), `b14-gen-crash-{easing,spring}.png`.

---

## TL;DR — verdict on my assigned question

**The DFA table (`controlSurfacesFor` / `CONTROL_SURFACES`) is CORRECT. The per-scene render is
CORRECT on fresh mount. Neither is the cause of B2's "blank controls".**

The "blank controls on easing→amiga" (B2) is a **runtime crash that aborts the scene-swap's Vue
component-update cycle** — NOT a DFA mis-mapping. The crash is:

```
TypeError: Cannot read properties of undefined (reading '_gen')
    at stop (src/animation/playback.ts:216  [dev shows :156])
    at useSceneVisibilityPause.ts:38
    at callWithErrorHandling (vue)  →  baseWatchOptions.call  →  job  →  flushJobs
```

**Root cause (one line):** `demo/easing/useEasingDemo.ts:227` and `demo/spring/useSpringDemo.ts:365`
pass the **UNBOUND** method reference `playback.stop` (a bare `RAFPlayback.prototype.stop`) as the
`pause` callback to `useSceneVisibilityPause`. When the visibility watcher fires it invokes that
callback with `this === undefined`, so `this._gen++` (the first statement of `stop()`) throws. The
throw propagates into the component update during the swap → the leaving scene's controls freeze
ghosted and the incoming scene's panel half-mounts → "blank controls".

---

## 1. Reproduction steps (live, dev server `:5174`)

1. Navigate to `http://localhost:5174/#/easing`. The easing scene **auto-plays** (`autoPlays: true`,
   `useEasingDemo` arms its raw-rAF loop on mount); the transport reads **"Pause"** — confirmed
   `playback.running === true`.
2. Open the dock **"Scene"** selector (`button[aria-label="Scene"]`, a reka Select) and choose
   **Amiga** (the genuine NAVIGATE-while-playing gesture).
3. **OBSERVED:** the console emits the `_gen` `TypeError` (verbatim below) preceded by two
   `[Vue warn] Unhandled error during execution of watcher callback / component update`; the URL
   advances to `#/amiga` but the swap visibly **stalls** — controls render ghosted/blank, and on the
   dev server the AmigaScene chunk intermittently fails to load ("Loading scene…").

The dock **Select trigger itself is frequently `visibility:hidden` / "not stable"** during the
collapse/expand animation (the dual `dock-layer--summary` / `--expanded` layers), so Playwright's
stable-click times out — this is **B8 (broken dock animations) directly obstructing the switch** and is
a second, independent finding surfaced here.

### Minimal deterministic equivalent (isolation)

```
$ npx tsx -e 'import { RAFPlayback } from "@src/animation/playback";
              const pb = new RAFPlayback(); const bare = pb.stop; bare();'
UNBOUND stop() THREW: Cannot read properties of undefined (reading '_gen')
```

Exactly the live error, from the exact unbound-reference shape used at the two call sites.

---

## 2. Captured console errors (VERBATIM, source-mapped — dev `:5174`)

```
[WARNING] [Vue warn]: Unhandled error during execution of watcher callback
  at <SpringScene ref="sceneRef" >
  at <AsyncComponentWrapper ref="sceneRef" >
  …
  at <AnimationControlsGroup key="Spring" …>
  at <EditorShell …>
  at <App>
[WARNING] [Vue warn]: Unhandled error during execution of component update
  at <SpringScene ref="sceneRef" > … at <App>
TypeError: Cannot read properties of undefined (reading '_gen')
    at stop (http://localhost:5174/@fs/Users/mkbabb/Programming/keyframes.js/src/animation/playback.ts:156:3)
    at http://localhost:5174/useSceneVisibilityPause.ts:38:5
    at callWithErrorHandling (…/vue.runtime.esm-bundler…:1889:17)
    at callWithAsyncErrorHandling (…:1896:15)
    at baseWatchOptions.call (…:2388:46)
    at job (…:1670:13)
    at callWithErrorHandling (…:1889:31)
    at flushJobs (…:2038:5)
```

(The trace above landed on `<SpringScene>` during MCP exploration; the user's report named easing.
**Both scenes carry the identical bug** — see §4. The `[Vue warn] … component update` line is the
mechanism by which the throw corrupts the swap render → blank controls.)

The cube/amiga keyframes-panel **B1/B5** crash co-occurs and is captured here too (separate root cause,
owned by the B1/B5 investigators) — on fresh cube:
```
[error]  Err x  0 \n 1 | \n ^^^
[warning] [KeyframesString] could not serialize the animation to CSS: Parse error at offset 0: "......"
```
and the cube keyframes pane renders `/* timing-function: custom — no CSS twin (see console) */`.

---

## 3. Behavior vs intended — the DFA render is CORRECT; the crash corrupts it

### What the DFA SHOULD produce (the table, `controlSurfaceDFA.ts`)

| scene | `controlSurfacesFor` | + `extraControlTabs` |
|-------|----------------------|----------------------|
| cube  | `[controls, keyframes, timeline]` | `matrix-controls` (conditional) |
| amiga | `[controls, keyframes, timeline]` | — |
| square| `[controls, keyframes, timeline]` | — |
| easing| `[easing]` | `easing` |
| spring| `[spring]` | `spring` |
| sequence / motion-path | `[]` | — |

### What ACTUALLY renders on **fresh mount** (probe `b14-controls-dfa-render.mjs`, Part 1)

| scene | rendered control panels (visible) | matches DFA? |
|-------|-----------------------------------|--------------|
| cube  | controls + keyframes (real `.cube-*` CSS, modulo the B1/B5 "......" twin) | ✅ |
| amiga | controls (`duration/delay/iterations/…`) + keyframes (`.amiga-rotations { … }`, 386 chars) | ✅ |
| square| controls + keyframes (`.square-transform { … }`) | ✅ |
| easing| **ONLY** the easing panel (`tf(t) · ease · duration`) — NO keyframes/timeline node | ✅ |
| spring| spring panel (`response / damping (ζ) / …`) + the spring's own `Live solver / Discrete transition` tabs | ✅ |
| sequence / motion-path | **no control panel** (DFA `[]`) — self-contained stage transport | ✅ |

**The DFA table is right and the render projection is right.** Easing shows easing-only, amiga shows
the triad — exactly the table. The H.W11/I2 DFA mechanism (`builtInSurfacesFor` filtered triggers +
`hasSurface` pane-gate in `AnimationControls.vue`, mirrored by `allControlTabs` in `ChromeDock.vue`)
**works as designed on a clean mount.**

### What happens on the SWITCH (B2)

The leaving scene (easing/spring, **while playing**) runs its
`useSceneVisibilityPause` watcher during the swap teardown / visibility churn. The watcher calls the
**unbound** `pause` callback → `_gen` throw → Vue reports "Unhandled error during execution of
**component update**". The swap's render is interrupted: `sw2_easing_to_amiga.png` shows the easing
control panel **ghosted at ~0.3 opacity, frozen mid-View-Transition** — the controls neither finish
leaving nor does amiga's panel cleanly mount. That frozen/empty state IS the user's "blank controls".

So: **DFA correct · render correct · a runtime watcher crash corrupts the transition.**

---

## 4. Source trace (file:line) — the unbound-method regression

`useSceneVisibilityPause(wasRunning, pause, resume)` (`demo/app/useSceneVisibilityPause.ts:39`) invokes
`pause()` directly inside its `watch(visibility, …)` body (line 45). It is therefore the caller's job to
pass a **bound** callback. Five scenes wire it; the pattern is **inconsistent**:

| scene | call site | `pause` arg | bound? |
|-------|-----------|-------------|--------|
| Amiga | `demo/app/scenes/AmigaScene.vue:197` | `stopRenderLoop` (a `function`) | ✅ |
| Cube  | `demo/cube/useCubeAnimations.ts:112` | `() => animationGroup.value.pause()` | ✅ |
| Sequence | `demo/sequence/useSequenceDemo.ts:443` | `stopLoop` (a closure) | ✅ |
| **Easing** | **`demo/easing/useEasingDemo.ts:227`** | **`playback.stop`** | ❌ **UNBOUND** |
| **Spring** | **`demo/spring/useSpringDemo.ts:365`** | **`playback.stop`** | ❌ **UNBOUND** |

```ts
// useEasingDemo.ts
171:    const stopLoop = () => playback.stop();           // ← a CORRECT bound closure exists…
205-207: …stopLoop, startLoop,                            //   …and is used here (the adapter)…
227:    useSceneVisibilityPause(() => playback.running, playback.stop, startLoop);  // ← …but NOT here
```

`RAFPlayback.stop()` (`src/animation/playback.ts:215`) opens with `this._gen++;` (line 216). Called
unbound, `this` is `undefined` → the exact `_gen` `TypeError`. `playback` is a `markRaw(new
RAFPlayback())` (easing:150, spring:165), so the method is a genuine instance method that requires
`this`.

Why it only bites on a scene with a **live** loop: `useSceneVisibilityPause`'s honesty gate only calls
`pause()` when `wasRunning()` is true (line 43-45). Easing **autoPlays**, so `playback.running` is true
→ the watcher reaches the unbound `pause()`. A paused/idle scene short-circuits and never hits it
(which is why the bug "hides" — the gate masks it until something is actually playing).

---

## 5. Root-cause HYPOTHESIS (high confidence — directly reproduced)

**B2 is an unbound-method-reference regression, not a DFA defect.** Passing
`playback.stop` (instead of the already-present `stopLoop` closure, or `() => playback.stop()`) to
`useSceneVisibilityPause` at `useEasingDemo.ts:227` and `useSpringDemo.ts:365` makes the visibility
watcher throw `Cannot read properties of undefined (reading '_gen')` whenever a PLAYING easing/spring
scene is left (the swap perturbs `useDocumentVisibility` / flushes the watcher mid-teardown). The throw
propagates into Vue's component-update phase during the scene swap, freezing the View Transition and
leaving the control surfaces ghosted/blank — the observed "blank controls".

**Idiomatic fix shape (for the authoring phase — DO NOT apply here):** pass the **bound** loop-stop both
call sites already define — `useSceneVisibilityPause(() => playback.running, stopLoop, startLoop)`. The
gestalt move is stronger than a per-site patch: this is a recurring foot-gun (the H stack of
"pass-a-method-reference" bugs), so the durable cure is to make `RAFPlayback`'s control methods
**bind-proof** — e.g. define `stop`/`loop`/`drive`/`play` as **arrow class-fields** (`stop = () => {…}`)
or bind in the constructor — so `const s = pb.stop; s()` can NEVER lose `this`. That closes the entire
class of unbound-method crashes (inv-16: this is engine `src/animation` territory and is in-scope for a
runtime-correctness transposition). A REAL runtime gate must click-switch between two PLAYING scenes
and assert ZERO `pageerror` (the H gate-blindspot: a source-shape/load-time check never exercises the
playing→switch path, which is exactly why this shipped green).

### Note for the gate-regime overhaul (the headline)

`proof:demo-console-clean` went green by checking the HOME LOAD. The B2 crash needs: easing
auto-playing **then** a NAVIGATE while playing. The I-tranche control-surface gate must be a genuine
**interaction** gate: for every (scene→scene) pair where the source scene is PLAYING, drive the dock
Select, switch, and assert (a) zero `pageerror`, (b) the destination's DFA control set actually renders
(non-ghosted, opacity≈1, expected panel text present), (c) the source's controls fully unmount. That
property bites B2, and — because the dock Select is itself unstable mid-animation (B8) — the same gate
should assert the Scene trigger is hit-testable (not `visibility:hidden`) at click time.

---

## 6. Secondary findings surfaced (hand-off to siblings / authoring)

- **B8 corroborated:** the dock "Scene" Select trigger is intermittently `visibility:hidden` / "not
  stable" during the summary↔expanded layer animation, blocking the switch click outright (multiple
  Playwright stable-click timeouts). The dual `dock-layer` animation is genuinely broken.
- **B1/B5 corroborated (not my axis):** cube/amiga keyframes pane shows the `Parse error at offset 0:
  "......"` + `/* timing-function: custom — no CSS twin (see console) */` on fresh mount.
- **B4 cross-signal:** the easing scene's bezier-curve editor IS present in `controlSurfacesFor('easing')
  = ['easing']` and renders (`b14-b2-1-after-switch.png` shows the draggable bezier curve + `ease`
  selector + duration). Whatever B4's "lost easing editor" is, it is NOT the DFA dropping the surface —
  the easing surface resolves and mounts. (Hand to the B4 investigator.)
