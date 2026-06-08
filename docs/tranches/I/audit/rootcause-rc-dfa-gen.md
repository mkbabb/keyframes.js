# ROOT CAUSE — B2 · the DFA `this._gen` crash + blank controls

**Agent:** `[rc-dfa-gen]` (root-cause)
**Date:** 2026-06-08 · **Branch:** `tranche-i-dev` (forked off broken master `b934a08`)
**Harness:** Playwright (`playwright-core` via `KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js`)
against the live DEV server `:5174` (source-mapped) + the built `dist/gh-pages`.
**Probes (run; kept under `audit/investigate/probes/`):** `rc-gen-dock-switch.mjs`,
`rc-dock-dom.mjs`, `rc-gen-captureactive.mjs`, `rc-gen-instrument.mjs` — plus the
sibling repros `b2-dfa-gen-crash.mjs`, `b14-gen-crash-minimal.mjs`, `dev-gen-repro.mjs`,
`matrix-v2.mjs`, `dfa-suspend-resume.mjs`.
**Status:** ROOT CAUSE CONFIRMED. One defect, two triggers. The sibling investigations
DISAGREED on the site (b2/b14: unbound `playback.stop`; b12: stale-group race); I
adjudicated with the error-message semantics and direct reproduction — **b2/b14 is
correct, b12's stale-group race is RULED OUT**. The design target is the user's exact
suspend/save/resume-iff-was-playing spec.

---

## TL;DR — the confirmed root cause (one line)

`demo/easing/useEasingDemo.ts:227` and `demo/spring/useSpringDemo.ts:365` pass the
**UNBOUND** instance method `playback.stop` (a bare `RAFPlayback.prototype.stop` value
with its receiver dropped) as the `pause` callback to `useSceneVisibilityPause(...)`.
When the visibility watcher fires it invokes that callback free-standing — `this`
is `undefined` — so the first statement of `RAFPlayback.stop()`, `this._gen++`
(`src/animation/playback.ts:216`), throws
`TypeError: undefined is not an object (evaluating 'this._gen')`. The throw lands
**inside a Vue reactive flush** (`watch` job → `flushJobs`), which aborts the in-flight
component-update of the scene swap → the incoming scene's control panel half-mounts →
**BLANK controls**. The two symptoms (the `_gen` crash and the blank controls) are ONE
defect: the crash poisons the render flush.

```
src/animation/playback.ts:216        this._gen++;            ← throws, this === undefined
demo/app/useSceneVisibilityPause.ts:45   pause();            ← invokes the unbound ref
demo/easing/useEasingDemo.ts:227     useSceneVisibilityPause(() => playback.running, playback.stop, startLoop);
demo/spring/useSpringDemo.ts:365     useSceneVisibilityPause(() => playback.running, playback.stop, startLoop);
```

---

## 1. WHY `this` is `undefined` (the question posed: is it this-binding, lifecycle, or FSM-contract?)

**It is a THIS-BINDING bug — a method passed unbound. NOT a lifecycle bug, NOT an FSM
contract gap.** Proof, three independent strands:

### 1a. The playback object is ALIVE — it is the *binding* that is lost, not the object.
`playback` is `markRaw(new RAFPlayback())` (`useEasingDemo.ts:150`, `useSpringDemo.ts:165`).
It is never disposed before the visibility tick: the SAME instance's `playback.stop()`
called as a member — in `onScopeDispose` (`useEasingDemo.ts:219`) and in
`stopLoop = () => playback.stop()` (`:171`) — works on the very same object. What is lost
is only the receiver: `playback.stop` extracts the function VALUE off the instance, and
JS does not auto-bind methods. The stored reference, called later as a free function
`pause()` (`useSceneVisibilityPause.ts:45`), has no receiver; in strict-mode ESM `this`
is `undefined`. `this._gen` is `undefined._gen` → throw. The minimal isolation confirms
it exactly (sibling `b14` ran it):
```
const pb = new RAFPlayback(); const bare = pb.stop; bare();
→ TypeError: ... reading '_gen'    (the identical shape used at the two call sites)
```

### 1b. The error-MESSAGE SEMANTICS rule out the stale-group race (b12's hypothesis).
This is the decisive adjudication between the two sibling hypotheses. The user's verbatim
message is `undefined is not an object (evaluating 'this._gen')` — Safari's phrasing for
reading `_gen` off an `undefined` **`this` INSIDE `stop`**. Now consider the ONLY other
`_gen` deref reachable on a scene-switch, `createGroupAdapter.suspend()`
(`scenePlaybackAdapters.ts:72-73`):
```ts
if (group.started && !group.paused) group.pause();   // member call: this === group.playback
else group.playback.stop();                           // member call: this === group.playback
```
Both are MEMBER calls. `group.pause()` → `this.playback.stop()` (`group.ts:631`); the
direct branch is `group.playback.stop()`. In BOTH, `stop` is invoked WITH a receiver
(`group.playback`), so `this` is the playback object and is NEVER `undefined`. For b12's
"stale group" to throw, `group` or `group.playback` would have to be `undefined` — but
then the throw fires at the **`.stop` PROPERTY ACCESS**, with the message
`undefined is not an object (evaluating 'group.playback.stop')` (or `'.pause'`), reading
`stop` off `undefined` — **a different message, a different evaluated expression**. The
user's message names `this._gen`, which can only be reached if `stop` was ENTERED with
`this === undefined`. A member call cannot do that. Therefore the throw is an unbound free
call, NOT a stale-group deref. (Further: `bindSceneAdapter` reassigns
`currentAnimationGroup.value` to `markRaw(new AnimationGroup())` — which HAS a `.playback`
— so even a "swapped" group resolves a live `.playback`; the race b12 posited cannot
produce an undefined `.playback` in the first place.)

### 1c. The FSM contract is SOUND; the reducer is not implicated.
The pure reducer (`sceneMachine.ts transition`) and the suspend/resume algebra are correct
(sibling `b12 §5` verified live: `resume-iff-was-playing` holds, `case2/case3/case4` all
pass). `captureActive` (`useSceneMachine.ts:141-157`) correctly snapshots-then-suspends the
leaving scene through the CONTRACT. The crash is NOT in that machinery — it is an orthogonal
visibility watcher that two scenes wired with an unbound callback. The FSM's only
involvement is that it is on the OUTER stack when the co-fired visibility tick throws (see §2).

---

## 2. WHY the user saw it on a SCENE SWITCH (reconciling the user's stack with the binding bug)

The user's reported stack —
`suspend (scenePlaybackAdapters.ts:36) → captureActive (useSceneMachine:104) →
dispatch (:77) → switchScene (useSceneMachineApp:139)` — and the source-mapped stack I/the
siblings reproduced —
`stop (playback.ts:216) → useSceneVisibilityPause.ts:45 → callWithErrorHandling →
job → flushJobs` — are **two views of ONE event**, and they reconcile cleanly:

The user's gesture is the **dock "Scene" select** (a reka combobox), which routes through
`runSceneSwitch` (`App.vue:291`) = `useSceneTransition`'s `startViewTransition(() =>
switchScene(id))` (`useSceneTransition.ts:32`). A real dock switch therefore:
1. opens the View Transition (compositor snapshots the page, momentarily backgrounding it),
2. synchronously runs `switchScene → dispatch(NAVIGATE) → captureActive → adapter.suspend()`
   (the leaving scene's bound suspend — for easing/spring the RAF adapter's
   `() => playback.stop()`, which is SAFE),
3. AND the VT/dock-layer churn co-fires a `visibilitychange`/blur tick. `@vueuse`'s
   `useDocumentVisibility` (which `useSceneVisibilityPause` rides) flips reactive, the
   `watch` job flushes, and it calls the **UNBOUND** `playback.stop` → the `_gen` throw,
   while `captureActive`/`switchScene` are still the OUTER context the user's source-map
   attributed the frame to.

So the user's "via scene switch" stack and the "via tab-hide" stack are the SAME unbound
`RAFPlayback.stop`, differing only in which watcher fired it. My harness could NOT click the
dock trigger to reproduce the exact frame interleave — the trigger is `visibility:hidden`
mid-animation (`rc-dock-dom.mjs`: `button[aria-label="Scene"]` reports `vis:false`; that is
**B8 directly obstructing the gesture**), so `force`-click never opens the reka popper
(`rc-gen-dock-switch.mjs`: `gesture:"trigger-open-no-option"`). The deterministic
tab-hide reproduction (b2/b14, source-mapped) IS the same defect; hash-NAVIGATE alone does
NOT co-fire the visibility tick, which is exactly why `rc-gen-captureactive.mjs` and
`dev-gen-repro.mjs` show `genError:false` on every hash path — the bug needs the
VT/visibility co-fire, i.e. the real dock gesture.

**Net:** the user's stack does not contradict the binding bug; it is the binding bug seen
through the View-Transition's visibility co-fire during `captureActive`.

---

## 3. The BLANK-controls symptom (easing/spring → amiga/square) is DOWNSTREAM of the throw

The throw fires inside `flushJobs` (Vue's reactive job queue) DURING the swap. Vue logs
`[Vue warn] Unhandled error during execution of component update` (b14 §2) and aborts the
in-flight flush, so the incoming scene's control panel never finishes mounting → blank /
ghosted controls (`shots/sw2_easing_to_amiga.png` shows the leaving panel frozen ~0.3
opacity mid-VT). A CLEAN hash switch with NO co-fired visibility tick renders the
destination controls correctly (b14 §3) — proving the blank is the flush-abort, not a DFA
mis-mapping (the DFA table + per-scene render are CORRECT, b14 verdict). **One defect, two
faces.**

> Note on b12's *separate* `{easing,spring}→square` blank (band B): b12 attributes a
> blank on raw-rAF→square to a `selectedAnimation`/teleport seam, distinct from this
> `_gen` flush-abort. That is a SECOND, independent blank-controls cause on a different
> pair and is owned by the b12/control-mount surface; it does not change THIS root cause.
> Both, however, share the cure principle in §4c (make the control-panel mount a pure
> function of the DFA set + active group, order-independent).

---

## 4. WHY THE GATES MISSED IT (the blind-spot, for the gate-regime overhaul)

The H gate-regime certified this GREEN across all 97 `proof:*` gates because every gate is
**source-shape or load-time**, and this defect lives only in a **runtime interaction**:

1. **`proof:demo-console-clean` checks the HOME LOAD.** The `_gen` crash needs a raw-rAF
   scene (easing/spring) AUTO-PLAYING and THEN a visibility/switch tick. Home is idle, so
   the honesty gate in `useSceneVisibilityPause` (`if (wasRunning())`) short-circuits and the
   unbound `pause()` is never reached. The gate never put a PLAYING scene through a hide/switch.
2. **`proof:scene-machine-*` drove the hash/programmatic path, never the real dock-select
   gesture.** The reducer's pure algebra passed (it IS correct), but no gate ever opened the
   reka popper and picked a scene while one was playing — the exact path that co-fires the VT
   visibility tick. b12 §4 records the dock trigger is not even programmatically clickable
   (B8), so the programmatic and user gesture paths DIVERGE, and only the programmatic one was
   ever gated.
3. **The unbound-method class is statically LINTABLE and was not linted.**
   `@typescript-eslint/unbound-method` flags `playback.stop` passed as a value; the suite had
   no such rule, so a whole bug class shipped invisible.

The headline: a green source-shape gate exercised the SHAPE of the state machine, never the
PLAYING→switch RUNTIME, so an effect-layer crash hid behind 97 greens. **This is the
gate-blind-spot the tranche exists to close.**

---

## 5. THE IDIOMATIC GESTALT FIX DIRECTION (the seam, the transposition — NOT a patch)

> Tranche-DEVELOPMENT only — this is the DESIGN INPUT for the waves; no source is edited here.
> NO workaround, NO legacy. Three nested altitudes; the wave should land the deepest two.

### 5a. The PRIMARY transposition — make `RAFPlayback` BIND-PROOF at the engine seam (inv-16).
The durable cure is NOT "wrap the two call sites in an arrow" (that is the minimal patch and
it leaves the foot-gun live for the next consumer). The class of bug is *"an
`RAFPlayback`/`AnimationGroup` control method loses `this` when passed as a value"* — this is
a RECURRENCE (the H stack already carried a `Function.prototype.bind`-drops-the-tag bug noted
in `animation/CLAUDE.md` WAAPI section). The engine `src/animation` is the PRODUCT and is
in-scope this tranche (inv-16). Define `RAFPlayback`'s control surface as **bound-by-construction**:
make `stop`/`play`/`drive`/`loop` arrow class-fields (`stop = () => { this._gen++; … }`) or
bind them in the constructor, so `const s = pb.stop; s()` can NEVER lose `this`. Then `const
{ stop } = playback` and `playback.stop` passed as a callback are both safe, FOREVER, for
every consumer — the binding correctness lives ONCE, in the engine, not re-asserted per call
site. This closes the entire unbound-method crash class, not just B2's two instances. (Cost
note for the wave: arrow fields move the methods onto the instance, not the prototype — a
per-instance allocation. `RAFPlayback` instances are few and long-lived (one per scene), so
this is the right trade; measure-first if a bench says otherwise, but the engine owns its own
binding invariant either way.)

### 5b. The STRUCTURAL transposition — consolidate the raw-rAF scene boilerplate into ONE composable.
easing and spring HAND-WIRE the identical "raw-rAF scene" recipe — own a `RAFPlayback`,
expose `startLoop`/`stopLoop`, build a `createRafAdapter`, register it, AND wire
`useSceneVisibilityPause` — and BOTH made the same binding mistake at the same line. That is a
DUPLICATION seam, and the bug is its symptom. Fold the recipe into a single
`useRafScene(frame, opts)` composable that owns the `RAFPlayback`, the bound
`startLoop`/`stopLoop`, the `createRafAdapter` wiring, and the `useSceneVisibilityPause`
registration **with bound callbacks** — so no scene can re-introduce the unbound reference,
and the visibility-pause is registered correctly in ONE place. This is the KISS/no-legacy
move: the two ~440-line demo composables shrink and converge; the binding + visibility-pause
correctness is structural, not per-author-discipline. (5a and 5b are complementary: 5a makes
the engine method safe even if misused; 5b removes the duplicated misuse surface. The wave
should do BOTH — defence in depth at the engine seam AND elimination of the duplication.)

### 5c. The CONTRACT clarification — the suspend/save/resume-iff-was-playing spec is the design target.
The user's spec: *"when a scene is playing and you switch, the first scene must SUSPEND+SAVE,
and the next RESUMES iff it was playing before (else paused)."* The pure reducer ALREADY
implements this correctly (`SCENE_READY → status: snap.playing ? "playing" : "paused"`;
`captureActive` snapshots-then-suspends). The fix must PRESERVE that algebra untouched — the
keystone is correct. What 5a/5b restore is the EFFECT layer's ability to execute the suspend
without throwing. The wave's CONTROL-PANEL-mount hardening (make the panel a pure function of
the DFA control-surface set + the active group, order-independent — §3 / b12 band B) ensures
the resumed/entered scene's controls always mount regardless of which adapter family
preceded it, so neither the `_gen` flush-abort NOR the selectedAnimation seam can ever blank
a panel the DFA says exists.

### 5d. The GATE the wave MUST author (closes the blind-spot for good — the headline).
A REAL runtime/interaction gate, driven by Playwright on the BUILT demo:
- load a raw-rAF scene (easing/spring), let it AUTO-PLAY, assert `isPlaying`;
- fire a `visibilitychange → hidden` (the deterministic trigger) AND drive a real dock-Select
  scene-switch WHILE PLAYING (the user gesture — which REQUIRES the dock trigger be
  hit-testable, so this gate also asserts the Scene trigger is NOT `visibility:hidden` at
  click time, folding the B8 dependency);
- assert ZERO `pageerror`/`unhandledrejection` across the transition;
- assert the destination's DFA control set renders NON-BLANK (opacity≈1, expected panel text
  present) and the source's controls fully unmount;
- run it across the (scene→scene) matrix where the source scene is PLAYING.
Plus the static guard: enable `@typescript-eslint/unbound-method` (or a `proof:` grep) so a
bare `.stop`/`.suspend`/`.pause` passed as a callback REDS at lint time — the bug class is
caught at two altitudes (runtime gate + static lint), never again behind a source-shape green.

---

## 6. Evidence index

| Fact | Site |
|---|---|
| Throw site (`this._gen++`, `this===undefined`) | `src/animation/playback.ts:216` (`RAFPlayback.stop`) |
| Unbound caller (invokes `pause()` free) | `demo/app/useSceneVisibilityPause.ts:45` |
| The two UNBOUND call sites (the defect) | `demo/easing/useEasingDemo.ts:227`, `demo/spring/useSpringDemo.ts:365` |
| Correct bound siblings on the SAME instance | `useEasingDemo.ts:171` (`stopLoop`), `:219` (`onScopeDispose`) |
| Group-adapter suspend (MEMBER call — SAFE, rules out b12 race) | `scenePlaybackAdapters.ts:72-73` |
| RAF-adapter suspend (bound arrow — SAFE) | `scenePlaybackAdapters.ts:185` (`handle.stopLoop`) |
| captureActive (snapshot→suspend on leave) | `useSceneMachine.ts:141-157` |
| dispatch / pre-transition capture | `useSceneMachine.ts:93-132` |
| switchScene (NAVIGATE) | `useSceneMachineApp.ts:184-187` |
| VT wrap (the dock gesture's co-fire) | `useSceneTransition.ts:32` → `App.vue:291` |
| Pure reducer (CORRECT — do NOT rewrite) | `sceneMachine.ts:106-196` |
| Dock trigger hidden (B8 obstructs the gesture) | `rc-dock-dom.mjs`: `aria-label="Scene"` → `vis:false` |
| Blank-controls = flush-abort (not DFA) | b14 §3 + `shots/sw2_easing_to_amiga.png` |
| Source-mapped `_gen` stack (deterministic, tab-hide) | b2-dfa-gen-crash.md §"Captured console error" |
| hash-path does NOT reproduce (needs the VT co-fire) | `rc-gen-captureactive.mjs`, `dev-gen-repro.mjs`: `genError:false` |

## 7. Adjudication summary (one defect, the sibling split resolved)

- **CONFIRMED:** unbound `RAFPlayback.stop` passed to `useSceneVisibilityPause` at
  `useEasingDemo.ts:227` + `useSpringDemo.ts:365` (b2/b14). The `this._gen` + `undefined`
  message can ONLY arise from an unbound free call.
- **RULED OUT:** b12's stale-group race in `createGroupAdapter.suspend()`. That path is a
  MEMBER call (`group.playback.stop()`), so it cannot enter `stop` with `this===undefined`;
  a stale/undefined group would throw a DIFFERENT message at the `.stop` property access, and
  the reassigned `markRaw(new AnimationGroup())` always has a live `.playback` anyway.
- **CARRIED (separate, real):** b12 band B `{easing,spring}→square` control-panel blank via
  the `selectedAnimation`/teleport seam — a DISTINCT cause folded under the §5c order-
  independent control-mount cure.
- **DESIGN TARGET:** the user's suspend/save/resume-iff-was-playing spec — already correct in
  the pure reducer; the fix restores the effect layer's ability to execute it (5a bind-proof
  engine + 5b consolidated raw-rAF composable + 5c order-independent control mount + 5d real
  runtime gate).
