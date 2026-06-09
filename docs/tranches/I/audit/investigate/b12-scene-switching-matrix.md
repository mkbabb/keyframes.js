# b12 — Scene-Switch Matrix (NxN) · the DFA breakage surface

**Investigation agent:** `b12-scene-switching-matrix`
**Date:** 2026-06-08
**Harness:** Playwright (`playwright-core` via `KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js`),
serving the BUILT `dist/gh-pages/` on an ephemeral port (mirrors
`scripts/proof-no-orphan-specular.mjs`); cross-checked against the live DEV
server `:5174` (source-mapped). All behaviour reproduced live — nothing
theorised from source alone.

**Probes (all under `docs/tranches/I/audit/investigate/probes/`):**
- `matrix-v2.mjs` — the definitive NxN sweep (8 scenes → 56 ordered pairs):
  open A fresh → ENGAGE PLAY (confirmed `aria="Play animation"` button) → NAVIGATE
  to B → capture pageerrors/console verbatim + controls-render + suspend/resume.
  → `b12-matrix-v2.json`
- `dfa-suspend-resume.mjs` — focused B2 cases: easing→amiga, the resume-iff-playing
  round-trips, and per-scene suspend+save. → `b12-dfa-cases.json`
- `dev-gen-repro.mjs` — `_gen` TypeError repro attempt on DEV (:5174, source maps),
  incl. a rapid-switch race.
- `err-and-switch-recon.mjs`, `dom-recon.mjs`, `scene-select-recon.mjs` — gesture-surface
  recon (how scenes switch; where the Play button lives).

**Screenshots:** `docs/tranches/I/audit/investigate/shots/` (`m2_*`, `dfa_*`,
`after-cube-to-amiga.png`, `scene-dropdown-open.png`).

---

## 1. The transition defect matrix

`E` = pageerror fired during the switch · `M` = did NOT arrive (machine stayed on A)
· `B` = B rendered BLANK controls (panel expected, none shown) · `.` = clean · `--` = self.

```
from\to     home cube amig squa easi spri sequ moti
home        --   E    .    .    .    .    .    .
cube        M    --   M    M    M    M    M    M
amiga       .    .    --   .    .    .    .    .
square      .    .    .    --   .    .    .    .
easing      .    .    .    B    --   .    .    .
spring      .    .    .    B    .    --   .    .
sequence    .    .    .    .    .    .    --   .
motion-path .    .    .    .    .    .    .    --
```

**Totals over 56 transitions:** 8 with a fired error · 2 blank-controls · 7 did-not-arrive.

Three distinct defect bands fall out of the grid:

1. **The entire `cube` ROW is dead (`M ×7`)** — once cube is PLAYING you cannot
   leave it. Every cube→X transition aborts mid-flight; the machine stays on cube.
2. **`home→cube` errors on entry (`E`)** — entering cube (the default backdrop)
   already throws.
3. **`easing→square` and `spring→square` blank the controls (`B ×2`)** — switching
   from a raw-rAF scene into a group scene loses the editor panel.

Everything else (35 transitions among amiga/square/easing/spring/sequence/motion-path,
plus home→{amiga,square,easing,spring,sequence,motion-path}) is **clean** —
suspend+save works, the snapshot is captured, and (where a panel is expected) the
panel renders. The DFA is NOT globally broken; its breakage is concentrated on
**(a) the cube node and (b) the raw-rAF → group hand-off into square.**

---

## 2. DEFECT BAND A — the cube node poisons every transition (this IS B1, re-surfaced)

### Reproduction
1. `node …/probes/matrix-v2.mjs` (or open `dist/gh-pages/#/cube`, click the
   bottom-bar Play, then navigate away).
2. Observe: the navigation never completes; the machine's `activeScene` stays `cube`.

### Captured console (VERBATIM — both build & dev :5174)

On cube LOAD (before any interaction):
```
[error]  Err x     0
 1 |
     ^^^
[warning] [KeyframesString] could not serialize the animation to CSS: Parse error at offset 0: "......"
```

On clicking PLAY (a thrown `pageerror`, NOT just a warning):
```
Error: Parse error at offset 0: "......"
    at bo            (engine-*.js)   ← value.js tryParse  (parsing/utils.ts:69)
    at cn.keyFn      (engine-*.js)   ← memoize key fn      (value.js utils.ts:131)
    at c             (engine-*.js)
    at zc [as _lerp] (engine-*.js)   ← interpolate iv._lerp
    at Hc            (engine-*.js)   ← lerpValue
    at pp.processFrame (engine-*.js) ← Animation.processFrame  (engine.ts:~707/576)
    at pp.interpFrames (engine-*.js) ← Animation.interpFrames  (engine.ts:657/516)
```

`b12-matrix-v2.json` `cube→amiga` row: `"arrived": false`, `"aPlayingBefore": true`,
`"switchErrs": ["[error]  Err x 0 1 | ^^^"]`. `b12-dfa-cases.json`
`case4…cube`: `"snapshotCaptured": true, "snapPlaying": true, "leaveErrs": ["[error] Err x 0 1 | ^^^"]`.

### Intended vs actual
- **Intended:** cube plays its rotation/matrix/hover group; leaving it SUSPENDs +
  SAVEs and lands on the next scene.
- **Actual:** cube's draw loop throws on every interpolated frame; the throw also
  fires inside `captureActive`'s `adapter.snapshot()` (the group adapter walks every
  child to read `t`, but the live frame state is already poisoned), aborting the
  NAVIGATE. You are TRAPPED on cube whenever it is playing.

### Root cause (the `"......"` decoded)
The `"......"` is NOT a literal value in the data — it is value.js's empty-input
parse-error rendering. `tryParse` (`value.js/src/parsing/utils.ts:69`) formats its
message as `Parse error at offset ${offset}: "...${context}..."`, where `context`
is `input.slice(offset-8, offset+8)`. For an **empty input string** the context is
`""`, so the message collapses to `"......"` (the `...` prefix + `...` suffix with
nothing between). **The input being parsed is the empty string `""`.**

That empty string originates in the **cube Rotations animation**:
`demo/cube/useCubeAnimations.ts:59` keyframes
`rotateX: "0deg"` → `rotateX: new ValueUnit("--rotationX", "var")`.
Interpolating a `var(--rotationX)` computed endpoint resolves it against the live
`getComputedStyle` (`lerpComputedValue → getComputedValue`); the `--rotationX`
custom property is declared on `.cube` (CubeTarget.vue:226) but is **not resolvable
on the animation's serialization target at all** (the `CSSKeyframesToString`
read-out animation has NO DOM target), and is unreliable on the live draw target,
so the computed value comes back **`""`** → `tryParse("")` → `Parse error at offset 0:
"......"`.

The crash has TWO faces, ONE cause:
- **Serialize face** (load-time WARNING) — `KeyframesStringControls` →
  `CSSKeyframesToString` (format.ts:86) serialises the cube animation for the
  read-out with no DOM target; the `var()` endpoint serialises/parses to `""`.
- **Interpolate face** (play-time THROWN pageerror) — the live rAF draw loop runs
  `interpFrames → processFrame → lerpValue → _lerp → keyFn → tryParse("")` on the
  same `var()` endpoint.

This is the user's **B1**, EXACTLY: "THE H.W0 '......' CRASH — BACK, via a path
W0's frame-compiler guard never covered. The W0 fix guarded the FrameCompiler
blank-selector, NOT the `CSSKeyframesToString → processFrame` `var()`-endpoint
path." The H.W0 frame-compiler guard does not touch the value.js
interpolation/serialisation of an unresolved `var()` endpoint, so the crash class
was never actually closed — it merely stopped firing on the specific blank-selector
input W0 tested.

### Why it makes B12 worse
B1 is not "just" a cube bug. Because the cube is **the default home backdrop** AND
because a PLAYING cube throws inside `captureActive`'s snapshot read, **the cube node
becomes a one-way trap in the scene graph.** Any user who hits Play on the landing
backdrop and then tries to navigate is stuck. This is the load-bearing reason the
cube row is solid `M`.

### Root-cause HYPOTHESIS (for the authoring phase)
The gestalt fix is at the **engine/value.js seam, not a demo patch**: an unresolved
`var()`/computed endpoint that resolves to `""` must NOT be handed to `tryParse` —
the interpolator should treat an unresolvable computed endpoint as a no-op/identity
(hold the other endpoint) rather than parse the empty string and throw. (inv-16:
the engine `src/animation` is the product and is NOT fenced this tranche — runtime
correctness here is an engine transposition, candidate: guard `lerpComputedValue`/
`getComputedValue` against an empty computed resolution; and make
`CSSKeyframesToString` tolerant of a `var()` endpoint with no twin.) The demo-side
companion is that a keyframe referencing `var(--rotationX)` that is never defined on
the serialisation target is itself a smell — but the durable cure is the engine
guard, so a SINGLE unresolved computed unit can never again crash the whole draw loop
or the read-out.

---

## 3. DEFECT BAND B — `{easing,spring} → square` blanks the controls (B2/B5 manifest)

### Reproduction
1. Open `dist/gh-pages/#/easing` (or `#/spring`), let it settle (it auto-plays).
2. Navigate to `square`.
3. Observe: the square stage shows the draggable box, but the **controls panel is
   empty** — no duration/delay/iterations/easing/blend fields.

### Captured evidence
`b12-matrix-v2.json` `easing→square` row:
```json
{ "from":"easing","to":"square","arrived":true,
  "ctrl":{"textLen":24,"panelText":false,"surfaces":1,"sample":"Square drag me Transform"},
  "controlsBlank":true,"switchErrs":[] }
```
`spring→square` is identical. By contrast `cube→square`, `amiga→square`,
`sequence→square`, `motion-path→square` ALL render the full panel (`panelText:true`,
`surfaces≥4`). The blank is SPECIFIC to a **raw-rAF source scene (easing/spring) →
a group scene (square)**.

### Intended vs actual
- **Intended:** square's DFA control set is `["controls","keyframes","timeline"]`
  (`controlSurfaceDFA.ts:80`) — a non-empty panel MUST render.
- **Actual:** the panel is blank — the DFA says "show controls" but nothing mounts.

### Source trace + root-cause HYPOTHESIS
The differentiator is the **leaving adapter family**. easing/spring expose a
`scenePlayback` raw-rAF adapter and drive playback through `machine.status`; cube/
amiga/square/sequence/motion-path are group/no-adapter scenes. Two source seams are
implicated (to confirm in root-cause phase):

1. **`selectedAnimation` seeding** (`useSceneMachineApp.ts:69-73`): `bindSceneAdapter`
   only seeds `controls.selectedAnimation` to the first animation name when the group
   has animations AND no selection yet. Square's group has exactly one animation
   ("Transform"). The bottom-bar/controls panel renders against the *selected*
   animation; if the prior raw-rAF scene left the panel's selection/teleport target
   in a state the group host doesn't re-seat, the panel teleports nothing →
   `textLen:24`. (The clean group→square cases come from scenes that share the group
   adapter family, so the selection/teleport seam is already warm.)
2. **`isControlsPanelOpen` per-superKey** (`controlOptionsStore.ts` keyed by
   `superKey`): the raw-rAF scenes (Easing/Spring) and Square keep SEPARATE
   per-superKey control-option records; the open/selection state does not carry, and
   the group host's `bindSceneAdapter` re-open is gated on `window.innerWidth >= 1024`
   only — it never re-asserts the SELECTION the panel needs after a raw-rAF leave.

The gestalt reading: the raw-rAF↔group adapter boundary is the un-exercised seam
(the H.W1 `proof:scene-contract-identity` gate notes the "easing↔cube cross-pair the
group gate misses"); the control-panel mount is coupled to a selection/teleport that
the boundary crossing does not re-establish. **The authoring fix is to make the
control-panel mount a PURE function of the DFA control-surface set + the active
scene's group, independent of which adapter family preceded it** — so no transition
ORDER can blank a panel the DFA says exists.

---

## 4. The `_gen` TypeError (B2 core) — DID NOT reproduce in build OR dev; isolated to the dock-select gesture

The user's B2 report is a `TypeError: undefined is not an object (evaluating
'this._gen')` at `suspend (scenePlaybackAdapters.ts) → captureActive → dispatch →
switchScene`, seen on dev :5174 switching easing→amiga.

**My probes did NOT reproduce `_gen`** — not via hash-NAVIGATE (build), not on the
dev server, not under a rapid-fire switch race, not on easing→amiga specifically
(`b12-dfa-cases.json case1`: `genError:false`; `dev-gen-repro.mjs`: `genError:false`
on all four paths incl. `rapid_race`). This is itself a decisive finding:

- `_gen` is a private field of **`RAFPlayback`** (`src/animation/playback.ts:78`).
- The ONLY scene-switch path that touches `_gen` through a possibly-undefined `this`
  is **`createGroupAdapter.suspend()`** (`scenePlaybackAdapters.ts:67-74`):
  `if (group.started && !group.paused) group.pause(); else group.playback.stop();`.
  Both `group.pause()` (group.ts:631 `this.playback.stop()`) and the direct
  `group.playback.stop()` deref `group.playback._gen`. The adapter reads the group
  **lazily via a live getter** `() => currentAnimationGroup.value`
  (`useSceneMachineApp.ts:77`) — and the file's own header (adapters.ts:32-36) warns
  the getter must never hold a stale/dangling group.
- The crash fires when `group` (or `group.playback`) is **undefined/stale at suspend
  time** — i.e. the LEAVING scene's adapter runs `suspend()` AFTER
  `currentAnimationGroup.value` has already been reassigned (to the new empty
  `markRaw(new AnimationGroup())` in `bindSceneAdapter`, or to a torn group on a fast
  remount). That is a **timing race in the captureActive → bindSceneAdapter ordering**,
  which the dock-select-trigger gesture hits (it routes through the full
  `switchScene → dispatch → captureActive` synchronously against a different vue-tick
  state than a hash write) but which hash-NAVIGATE and my rapid loop did not.

**Why the gesture matters + the gate blind-spot:** the dock Scene select-trigger is a
reka-ui `role=combobox` (`aria-controls="reka-select-content-…"`) that I could NOT
click programmatically — Playwright reported the trigger **`element is not visible`**
(`scene-select-recon.mjs`), even though it is in the DOM with non-zero box. The dock
itself has a visibility/hit-test friction (corroborates B8 "dock animations supremely
broken"). So the real user gesture path and the programmatic path DIVERGE — and the
H.W gate regime only ever drove the programmatic/hash path, never a real dock-select
click, which is precisely why `proof:scene-machine-*` stayed green while the dock
gesture crashes. **The fix surface is two-fold:** (a) eliminate the suspend-time
staleness — `captureActive` must `suspend()` the leaving scene's adapter against the
group it was REGISTERED with (snapshot the group reference at registration, or null-
guard `group?.playback?.stop()`), never a live getter that the in-flight transition
already swapped; (b) the I-tranche gate regime must drive the ACTUAL dock-select
gesture (a real click that opens the reka popper) so this path is exercised.

(Note: `_gen` is a real, source-confirmable hazard even though my harness did not
trip it — the staleness window is genuine; reproduction requires the dock gesture's
exact tick ordering. This is recorded for the root-cause phase with the precise call
site, not dismissed.)

---

## 5. Suspend / resume contract — the PURE layer is SOUND; the breakage is in EFFECTS

The resume-iff-was-playing spec the user stated ("the first scene must SUSPEND+SAVE,
and the next RESUMES iff it was playing before, else paused") is **correctly
implemented in the pure reducer** and verified live:

- `sceneMachine.ts transition` — `NAVIGATE` → `loading`; `SCENE_READY` →
  `status: snap.playing ? "playing" : "paused"` (line 129). Suspend/resume symmetry
  at `SUSPEND`/`RESUME`/`TAB_*`.
- `b12-dfa-cases.json`:
  - `case2` cube(playing)→easing→cube: `cubeSnapPlaying:true`, `resumedAsExpected:true`.
  - `case3` cube(paused)→easing→cube: `cubeSnapPlaying:false`, `stayedPausedAsExpected:true`.
  - `case4` EVERY scene: `snapshotCaptured:true` on leave (suspend+save works for
    all 7 scenes; only cube also throws B1 alongside).

So the DFA's **state algebra is correct**. The live breakage is entirely in the
**effect layer** (the adapter calls the reducer's purity forbids):
1. B1 poisons `captureActive`'s `snapshot()`/`suspend()` for cube (band A).
2. The raw-rAF→group control-panel mount seam blanks square (band B).
3. The `_gen` staleness race in `createGroupAdapter.suspend()` (band, dock-gesture).

This is the crux for authoring: **do not rewrite the reducer** (it is the keystone
and it is correct); harden the THREE effect-layer seams, and make the gate regime
drive the REAL gestures (play click + dock-select click + drag) so an effect-layer
regression can never again pass a source-shape gate.

---

## 6. Adjacent observations captured during the sweep (hand-off to sibling surfaces)

- **amiga** repeatedly logs `GL Driver Message … GPU stall due to ReadPixels (High)`
  on load (`b12-switch-via-select.json [amiga]`), and its controls render minimal
  (`b12-dfa-cases case1`: `panel:false`, sample "Amiga Rotations"). Feeds B3/B8.
- The dock Scene select-trigger is **not programmatically clickable** (reka combobox,
  reports not-visible) — feeds B8 (dock interaction broken) and is the reason the
  `_gen` gesture path diverges from the hash path.
- 8× `[KeyframesString] could not serialize … "......"` warnings across the sweep —
  every one is the B1 `var()`-endpoint serialise face. The cube read-out is the
  load-bearing source; it fires on every entry to a cube-bearing route.

---

## 7. Concrete file:line index (for root-cause + authoring)

| Symptom | Site |
|---|---|
| B1 source data (`var(--rotationX)` endpoint) | `demo/cube/useCubeAnimations.ts:59` |
| `--rotationX` declared (scoped, not on serialise target) | `demo/cube/CubeTarget.vue:226` |
| `"......"` formatted (empty-input parse) | `value.js/src/parsing/utils.ts:69` (`tryParse`) |
| Interpolate face | `src/animation/engine.ts:657 interpFrames` → `:~707 processFrame` → value.js `lerpValue/_lerp` |
| Serialize face | `KeyframesStringControls.vue` → `CSSKeyframesToString` (`src/animation/format.ts:86`) |
| `_gen` field | `src/animation/playback.ts:78` |
| `_gen` deref on suspend (stale group) | `scenePlaybackAdapters.ts:67-74` (`createGroupAdapter.suspend`) + live getter `useSceneMachineApp.ts:77` |
| captureActive (suspend on leave) | `useSceneMachine.ts:141-157` |
| dispatch / pre-transition capture | `useSceneMachine.ts:93-132` |
| switchScene (NAVIGATE) | `useSceneMachineApp.ts:184-187` |
| pure reducer (CORRECT) | `sceneMachine.ts:106-191` |
| DFA control-surface table | `controlSurfaceDFA.ts:76-85` |
| selectedAnimation seeding (band B) | `useSceneMachineApp.ts:69-73` |

---

## 8. Verdict

The DFA's **pure algebra is sound** (suspend/resume-iff-playing verified live). The
catastrophe is that **97 green source-shape gates certified an effect-layer that is
broken on real gestures.** The b12 matrix localises the breakage precisely:

1. **B1 is the dominant defect** — an unresolved `var()` computed endpoint crashes
   the cube draw loop AND read-out, turning the default backdrop into a one-way trap
   (the entire cube row is dead). It is the H.W0 chronic, never actually closed; the
   durable cure is an ENGINE guard against parsing an empty computed resolution
   (inv-16 — engine transposition is in-scope).
2. **The raw-rAF↔group adapter boundary** blanks `{easing,spring}→square` — the
   control-panel mount must become a pure function of the DFA set + active group,
   order-independent.
3. **`_gen` staleness** in `createGroupAdapter.suspend()` is a real (source-confirmed)
   race on the dock-select gesture; the live getter must not outlive the transition.

**Gate mandate (the headline):** every I-tranche wave gate for this surface must be a
REAL runtime gate — click Play, click the dock SELECT (open the reka popper, pick a
scene), drag — across the full NxN matrix, asserting (a) zero pageerrors, (b) every
DFA-non-empty scene renders its panel, (c) suspend captured + resume-iff-playing — so
the effect layer can never again hide behind a source-shape green.
