# N.W5 — Per-scene interactive idle states (7 live scenes · distinct interactive idle when active)

- **Band:** B · **Class:** DEV (docs); IMPL opens on authorization · **Dep:** independent of
  N.W1–N.W4 (touches the LIVE scene components, not the stage overlay). The stage need not be
  present for a scene's idle state to function — it is a scene-resident behaviour that is
  simply ENTERED when the commit handoff (N.W6) delivers focus to the scene host. No hard
  dependency on any other N wave; may develop in parallel with N.W1–N.W4.
- **Gate (born-RED, the idle-state roster):**
  - `proof:stage-scene-idles` — **does NOT exist today**. The gate asserts: each of the
    7 live scene components has a distinct `idle` state in its local state machine (or an
    equivalent `isIdle: boolean` computed from the scene's existing playback state); entering
    idle triggers a named observable — a CSS class, a data attribute, or a reactive prop
    change — that the gate's browser arm detects; and the idle loop dogfoods at least ONE
    light or heavy engine primitive (HEAVY is permitted in the live scenes — they already
    import `loadAnimationEngine`; the constraint is inv-ζ: no hand-rolled rAF). Born-RED
    because no scene has an explicit `idle` state or interactive idle loop today (verified
    by scanning the scene files — none expose a `data-idle` attribute or an `idle` state
    in their composables).

---

## Context

N.W5 is the live-scene counterpart to N.W4's ring previews. Where N.W4 authors lightweight
bespoke idle loops for the carousel ring (the "watching from outside" view), N.W5 authors the
**interactive idle** that the ACTIVE, MOUNTED, LIVE scene enters when at rest — the state a
user sees when they have committed to a scene and the main interaction has not yet begun (or
has settled).

The design-synthesis §"Per-scene idle states" resolves the open question from research
(`research-visual-motion.md §open-questions:` "is the idle loop ONLY in the carousel preview,
or does the live mounted scene ALSO gain a persistent interactive idle when at rest?"): **the
owner's wording demands the latter** — each scene gains a new interactive idle in the LIVE
mounted component, distinct from the ring preview.

The distinction from the ring preview (N.W4):

| | Ring preview (N.W4) | Live scene idle (N.W5) |
|---|---|---|
| Location | `scene-stage/previews/` — a mini-component on the ring | The actual scene component (`CubeScene.vue`, etc.) |
| Weight | LIGHT-barrel ONLY — no loadAnimationEngine | May use HEAVY engine (scenes already import it) |
| When active | While the stage overlay is open | While the scene is the active mounted scene, at rest |
| Interactivity | Front item only, hover-gated | Always interactive when idle |
| Purpose | "Watching from outside" preview | "You have arrived" ambient engagement |

### The 7 idle states — per-scene design

Each idle is authored to teach the scene's engine primitive through ambient motion that is
always readable, never distracting. The `idle` state is distinct from the `playing` state
(active animation) and the `stopped` state (no animation). It is entered automatically when
the scene mounts (the "wake" pose the commit handoff delivers) and exits on first user
interaction.

| Scene | Engine primitive | Interactive idle description |
|---|---|---|
| **Home** (`home`) | `CSSKeyframesAnimation` (existing engine, HEAVY) | The hero text slowly breathes via a `liftDown` `CSSKeyframesAnimation` at 1/3 speed; a soft `--stage-light` glow pulses on the play-CTA button at ~4s. The idle exits on any button interaction. |
| **Cube** (`cube`) | `AnimationGroup` (existing — three groups drive the cube) | The cube enters a slow autonomous tumble at reduced `timeScale` (0.1× the normal rotation speed) when no orbit drag is active for > 2s. The tumble uses the existing `AnimationGroup` in a `loop: true` mode — no new engine instance. A subtle `--stage-light` radial bloom follows the face nearest the key-light. Hover resumes the full-speed tumble. |
| **Amiga** (`amiga`) | `CSSKeyframesAnimation` + the existing Boing ball | The Boing ball enters a slow `scaleY: 0.95` breathing idle with a ~3s `CSSKeyframesAnimation` (amplitude 2% only — barely perceptible, a "resting" breath). On idle the CRT scanline overlay pulses to half-opacity every 4s (a CSS animation on `--crt-scanline-opacity`). Touch/click resumes the full bounce. |
| **Square** (`square`) | `SpringProgress` + `decay` (existing drag composable) | When no drag is active for > 1.5s, the box enters a slow 2° left–right rock (`NumericAnimation` or a `CSSKeyframesAnimation` over `rotate`, ~3s period). The rock is interruptible by any `pointerdown` — `decay` fling resumes immediately. The tether elastic (L.W11 refinement) draws faintly at rest. |
| **Easing** (`easing`) | `DrawSVG` / `CSSKeyframesAnimation` | The bezier curve trace slowly self-erases then redraws via `stroke-dashoffset` animation (~5s round-trip) when the user has not dragged a handle for > 3s. The dot traces the curve after the draw completes. Idle exits on any handle drag. |
| **Spring** (`spring`) | `SpringProgress` | The spring-ball fires at random intervals (every 3–6s, `Math.random()` seeded) to a random target in the current response/damping regime and rings to rest — demonstrating the configured spring parameters as ambient motion. The `linear()` readout updates each time the ball settles. Idle exits on any slider interaction. |
| **Sequence** (`sequence`) | `Sequence` (existing — the orchestrator) | When the Sequence is not manually scrubbing, it auto-plays at 0.3× speed in a 12s loop — the staggered rainbow lanes cascade slowly, demonstrating orchestration without requiring interaction. The phosphor playhead (`L.W11` treatment) crawls at idle speed. Drag the playhead to exit idle. |
| **Motion-Path** (`motion-path`) | `fromMotionPath` + the editable path | The traveller sweeps the current path at 1/4 speed continuously when the user is not editing a handle — a slow demonstration of the path. On handle drag: the traveller follows in real time at full speed (the L.W11 "creature obeys" egg). Idle exits on any handle interaction. |

> **Note (registry-aligned, 2026-06-17).** `home` (`HOME_SCENE_ID`, `scenes.ts:83`) is the
> hero landing with NO scene component — it cannot expose a `data-scene-state` on a "scene
> root component" because no such component exists. The Home row above is therefore a
> DESIGN-INTENT entry only (a hero-text breathe that would live in the landing markup, not a
> `*Scene.vue`); it is explicitly OUT of the `proof:stage-scene-idles` 7-arm roster. The gate
> measures the 7 component scenes (`cube`, `amiga`, `square`, `easing`, `spring`, `sequence`,
> `motion-path`) ONLY. If a Home landing idle is built it is a bonus tracked at N.WZ — never a
> gate arm. This removes the 7-vs-8 ambiguity the original note left open.

### Inv-ζ compliance (no hand-rolled rAF)

Every idle loop rides `RAFPlayback` or the scene's existing `AnimationGroup` rAF ownership.
No scene may introduce a new `requestAnimationFrame(function loop() { … })` call. The random
interval for SpringScene's idle uses `setTimeout` (scheduling, not animation timing) to
re-seat the `SpringProgress` target, then the existing `RAFPlayback`-driven spring handles
the animation.

---

## Scope

### S1 — Idle-state signal per scene (the observable the gate reads)

**Breach.** Scenes have no machine-readable `idle` state. The gate cannot distinguish "the
scene is actively animating" from "the scene is at rest" without a DOM signal.

**Cure.** Each of the 7 scene root components exposes a `data-scene-state="idle"` attribute
(or `"playing"` / `"stopped"`) on its root element. This attribute is driven by a reactive
`sceneState: 'idle' | 'playing' | 'stopped'` computed from each scene's existing composables:

- Cube: `isDragging || isAnimating` → `playing`; 2s inactivity timer → `idle`.
- Amiga: `isBouncing` → `playing`; `!isBouncing` after a settle → `idle`.
- Square: `isDragging` → `playing`; `!isDragging` after 1.5s → `idle`.
- Easing: `isDraggingHandle` → `playing`; `!isDraggingHandle` after 3s → `idle`.
- Spring: `isInteractingWithSlider` → `playing`; `!isInteracting` after 3s → `idle`.
- Sequence: `isScrubbing` → `playing`; `!isScrubbing` → `idle` (auto-play at 0.3×).
- Motion-Path: `isDraggingHandle` → `playing`; `!isDraggingHandle` → `idle`.

The `data-scene-state` attribute is the gate's read surface — not a CSS class (classes
are styling-only per the source-shape convention; data attributes are semantic signals).

**Falsifiable check.** Mount the scene via the demo SPA; perform no interaction for the
scene's idle timeout; assert `sceneHostEl.dataset.sceneState === 'idle'`. Interact once;
assert `=== 'playing'`. Today: no `data-scene-state` attribute exists on any scene root
(verified by scanning the scene Vue template files for `data-scene-state`).

### S2 — 7 idle loop implementations (one per live scene, inv-ζ)

**Breach.** No scene has a quiescent idle loop. Scenes are static or stop at their last frame.

**Cure.** Author the 7 idle-state animation hooks described in the per-scene table above,
each wired into the scene's existing composable structure:

Each idle loop is authored as a composable method `startIdle()` / `stopIdle()` on the
scene's primary composable (or inlined in the scene's `watch`/`watchEffect` that observes
`sceneState`). The composable activates on `sceneState === 'idle'` and deactivates
(cancelling the loop) on `sceneState === 'playing'`.

The random-interval spring idle uses `useIntervalFn` (vueuse) — `useIntervalFn(() =>
springTarget.value = randomTarget(), randomMs(), { immediate: false })` — so the interval
is reactive and pausable. The vueuse composable handles the `setTimeout` machinery; the
SpringProgress animation itself rides `RAFPlayback`.

**Falsifiable check.** `proof:stage-scene-idles` browser arm: mount each scene; wait for
`data-scene-state === 'idle'`; assert a CSS property on the scene's subject changes value
within a measured virtual-time window (the same `__tick` pattern from M.W4). For the Cube
idle: `--preview-ry` advances between `__tick(0)` and `__tick(3000)`. For the Spring idle:
the ball's `translateX` changes between two settled positions within 5000ms. The assertion
is on the REAL property value, not the `data-scene-state` attribute (inv-M-observable-truth:
the proxy would be asserting `data-idle` without checking the animation runs).

### S3 — Idle → playing transition (interruptibility)

**Breach.** An idle loop that is not interruptible degrades UX — the user drags a handle
and the idle loop fights the drag spring.

**Cure.** Every idle loop is interruptible on the SAME event that begins interaction
(`pointerdown` for drag scenes; `input` for slider scenes; a `pointerenter` on the
scene host for scenes with hover-only idle). The transition from `idle` → `playing` is
synchronous (the `sceneState` watcher fires before the idle loop's next rAF tick);
the idle `RAFPlayback` or `AnimationGroup.pause()` is called before control transfers
to the interaction handler.

The cube idle (slow tumble via `AnimationGroup`) uses the existing `AnimationGroup`
pause mechanism — `group.pause()` — already tested in the engine suite. The
motion-path idle (slow sweep via the existing traveller) uses `motionPath.pause()`.

**Falsifiable check.** Mount the scene in `idle` state; fire a synthetic `pointerdown` on
the scene's interactive element; within ONE rAF tick, assert `data-scene-state === 'playing'`
AND the idle loop's `RAFPlayback.running === false` (the loop yielded). Today: no such
transition exists (no idle state machine present in the scene composables).

### S4 — `proof:stage-scene-idles` gate authored (the born-RED gate)

**Breach.** No gate asserts the idle states exist or function correctly. A scene could ship
without the idle behaviour and nothing would catch it.

**Cure.** Author `scripts/proof-stage-scene-idles.mjs` as a browser integration gate
(AXIS-1 — it actuates the SPA, routes to each scene, waits for idle, asserts the property
change) with the following structure:

```
for each of the 7 scenes:
  1. Navigate to the scene via runSceneSwitch (or direct URL)
  2. Await data-scene-state === 'idle' (predicate wait, not sleep)
  3. Inject __tick(idleTimeout + 100) to ensure the loop has fired
  4. Query the scene's known animated property (scene-specific selector + CSS custom
     property or transform)
  5. Assert it differs from the initial mount value (the loop ran)
  6. Fire synthetic pointerdown on the scene's primary interaction target
  7. Assert data-scene-state === 'playing' within one rAF tick (interruptibility)
```

The gate uses `declarePosture('hard', 'AXIS-1')` — the idle behaviour is deterministic
under a synthetic clock and the scene mount/route is the real observable.

**Falsifiable check.** Today the gate DOES NOT EXIST (`ls scripts/proof-stage-scene-idles*`
→ ABSENT); on today's tree, even if the gate were authored, every scene would fail step 2
(no `data-scene-state` attribute). After the cure: each of the 7 arms exits 0; a planted
violation (commenting out the cube idle's `AnimationGroup` activation) REDs clause `C2-cube`.

---

## Born-RED gate

**The wave's named born-RED gate:** `proof:stage-scene-idles` — ABSENT from `package.json`
and `scripts/` today, verified 2026-06-17.

**The REAL observable (inv-M-observable-truth).** The genuine defect: no live scene has an
idle state — after the demo is running and the user does nothing, all scenes are static at
their last frame. The proxy to AVOID: asserting a `data-scene-state` attribute exists in the
template (greens if the attribute is present but no loop runs). The gate's born-RED witness
mounts the SpringScene, waits 5s of virtual time, and asserts the ball's `translateX` has
changed (the loop ran) — the REAL motion, not the attribute.

| Clause | Today's tree | After cure |
|---|---|---|
| C1 — attribute present | no `data-scene-state` on any scene root | all 7 scene roots expose `data-scene-state` |
| C2-{scene} (×7) | idle loop absent; property static after idle timeout | property changes between `__tick(0)` and `__tick(idleTimeout)` |
| C3 — interruptibility | no `idle→playing` transition | `pointerdown` → `playing` within one rAF tick |
| C4 — inv-ζ | n/a | no `requestAnimationFrame` reached outside `RAFPlayback` / `AnimationGroup` by any idle loop — the standalone `proof:no-raw-raf` gate's RUNTIME observable (a wrapped/spied `globalThis.requestAnimationFrame` records zero calls whose stack does not pass through `RAFPlayback`), NOT a source-shape grep alone (a grep greens on an aliased `raf` or a re-exported wrapper — the proxy the inv-ζ discipline forbids) |

**Today's tree result:** RED — `proof:stage-scene-idles` ABSENT; no `data-scene-state`
attribute on any scene root (`grep -rn "data-scene-state" demo/` → 0 matches, verified).

**GREEN condition.** All 7 scene idle implementations present; each `data-scene-state`
attribute transitions idle → playing on interaction; each idle loop's animated property
changes in virtual time; `proof:stage-scene-idles` exits 0; inv-ζ scan (C4) finds no
hand-rolled rAF in any idle impl.

---

## Dependencies

| Dep | Required state |
|-----|----------------|
| **None (N-wave dependencies)** | N.W5 is independent of N.W1–N.W4; scene idle states live in the live scene components, not the stage overlay |
| **`loadAnimationEngine` (existing HEAVY barrel)** | live scenes already import the engine; N.W5 idles may use it (Cube AnimationGroup, MotionPath fromMotionPath) |
| **vueuse `useIntervalFn`** | for Spring and other interval-based idles; already a project dep |
| **M.W4 synthetic clock** | the `__tick` pattern used in S2/S4 browser assertions; if M.W4 has not landed, N.W5 provides a test-local `injectSyntheticRaf` shim (NOT in src) |
| inv-16 | holds — all changes are under `demo/`; no library source modified |
| inv-ζ | every idle loop rides `RAFPlayback` or `AnimationGroup`; no hand-rolled rAF |

---

## Bite — what regression each S-clause prevents

| Clause | Regression it prevents |
|--------|------------------------|
| S1 idle-state signal | A scene ships with no machine-readable idle state; the gate cannot distinguish idle from playing → idle loop assertions are impossible |
| S2 7 idle implementations | After commit, scenes are static at their last frame — the "you have arrived" ambient engagement is absent; the demo teaches the engine primitive best when it runs continuously at rest |
| S3 interruptibility | The idle loop fights the drag spring (both writing `translateX` simultaneously) → visual glitch; or the idle loop prevents interaction by holding the rAF budget |
| S4 `proof:stage-scene-idles` | An idle implementation is accidentally omitted from a scene (the gate's 7-arm structure requires all 7 to be present); an idle loop hand-rolls rAF instead of riding the engine (inv-ζ violation); the idle loop does not actually animate (the property is static — a silent wiring failure) |
