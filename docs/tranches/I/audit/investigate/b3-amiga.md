# B3 — `/amiga` "totally broken, floats around" — investigation [b3-amiga]

**Agent:** investigation [b3-amiga] · **Tranche I dev** · serve `dist/gh-pages` (the
pre-BUILT artifact) + Playwright (`KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js`).
**Date:** 2026-06-08.

**Verdict in one line:** `/amiga` does NOT crash and emits NO `pageerror` — the breakage
is **VISUAL / INTERACTION-MODEL**, and exactly the class of defect the green source-shape
gates cannot see. Two distinct root causes: **(RC-1)** the sphere is parked in the far
**corner** of the room while OrbitControls orbits the **origin**, so the sphere is never
under the cursor and never centred — center-drags **tumble the whole room** ("floats
around") and the spin gesture is effectively unreachable; **(RC-2)** the scene root carries
`content-visibility:auto` over a live WebGL present loop, so the browser warns
*"Rendering was performed in a subtree hidden by content-visibility"* and the demo pays a
**ReadPixels GPU stall** every frame.

---

## Reproduction steps (Playwright, against `dist/gh-pages`)

Probes written + run under `docs/tranches/I/audit/investigate/probes/`:

- `b3-amiga.mjs` — open `#/amiga`; capture `console`+`pageerror`+`requestfailed`/4xx;
  probe the DOM/WebGL runtime; screenshot load → rest t0 → rest t1 → after a center
  drag → after the boing dblclick; then switch in from `#/easing`.
- `b3-amiga-float.mjs` — sample drift-at-rest + classify a center drag (sphere-spin vs
  camera-orbit). *(centroid-from-canvas returned 0 red px — the WebGL buffer is
  `preserveDrawingBuffer:false`, so a `drawImage`→`getImageData` copy is blank; the
  screenshots are the load-bearing visual evidence instead.)*
- `b3-amiga-switch.mjs` — load `#/easing`, PLAY it, switch to `#/amiga`, inspect the left
  controls panel DOM + the menubar play/pause label + `pageerror`.
- inline rest-stability probe — two canvas-clipped screenshots **3 s apart**, byte-compared.

Run command (all probes): `KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js node <probe>`.

---

## Captured console (verbatim) — `#/amiga`

```
[warning] [.WebGL-0x…]GL Driver Message (OpenGL, Performance, GL_CLOSE_PATH_NV, High): GPU stall due to ReadPixels
[warning] [.WebGL-0x…]GL Driver Message (OpenGL, Performance, GL_CLOSE_PATH_NV, High): GPU stall due to ReadPixels
[warning] [.WebGL-0x…]GL Driver Message (OpenGL, Performance, GL_CLOSE_PATH_NV, High): GPU stall due to ReadPixels
[warning] [.WebGL-0x…]GL Driver Message (OpenGL, Performance, GL_CLOSE_PATH_NV, High): GPU stall due to ReadPixels (this message will no longer repeat)
[verbose] Rendering was performed in a subtree hidden by content-visibility.
```

- `pageErrors`: **[] (none)** — no thrown error, no uncaught exception.
- `netFails` (requestfailed + 4xx): **[] (none)** on the built dist for `/amiga`.
  *(Note: the B9 `easing-icon-sm.svg` ENOENT is a **dev-server** discrepancy; the built
  dist uses `easing.svg` and does not 404 here — out of scope for B3, flagged for B9.)*

So `proof:demo-console-clean` / `proof:browser` pass `/amiga` on **load** — yet the scene
is the user-reported "totally broken, floats around". This is the gate-blindspot: load-time
+ source-shape is green; the **interaction model + the runtime visual** are broken.

---

## Behavior observed vs intended

### Drift-at-rest — NOT the bug (measured)
- The autoplay `rotations`/`bouncing*` group is **NOT** running on mount. Two canvas-clipped
  screenshots **3 s apart** are **byte-identical** (`identical-bytes: true`). The
  `b3-amiga.mjs` load / t0 / t1 frames are also visually identical. So "floats around" is
  **not** an idle animation drifting the mesh.
  - Evidence: `shots/b3-amiga-01-load.png`, `…-02-t0.png`, `…-03-t1.png`,
    `…-rest-A.png`/`…-rest-B.png`.

### The actual "floats around" — camera-orbit of a **corner-parked** sphere
- **At rest** the checker sphere sits **low and left of centre**, tiny, inside the grey
  perspective "room" (`shots/b3-amiga-01-load.png`). It is NOT centred in the stage.
- **A drag through the canvas centre tumbles the ENTIRE room** — the box re-projects
  wildly and the sphere swings to the lower-left, no longer in its corner
  (`shots/b3-amiga-04-after-drag.png`). The drag drove **OrbitControls** (camera orbit),
  **not** the sphere spin.
- **Why:** the raycast spin-gesture only fires when the pointer **hits the sphere**
  (`useSphereSpin.hitsSphere`). The sphere is parked at `(-5,-5,-5)` (a corner), so the
  vast majority of the canvas — including the centre — **misses** it and falls through to
  OrbitControls. The user experiences "I grab the stage and the whole world swings around"
  = **floats around**. The intended interaction (grab the sphere → spin → release →
  `decay()` glide) is **practically unreachable** because the subject is off in a corner.

### Intended (per W5 A5 rebuild + the source comments)
- The **sphere is the interactive subject**: drag the sphere → it spins; release → the
  engine `decay()` glide coasts it to rest (inv-ζ: the engine drives a non-DOM Three.js
  target). Camera orbit is the **background** gesture for **misses only**. For that model
  to read, the sphere must be the **centred, dominant** subject the cursor lands on — not a
  small corner ornament that the camera orbits **around**.

### The boing egg works (dblclick)
- `dblclick` fires the dormant `animationGroup` boing arc — the sphere lifts + scales mid-
  bounce (`shots/b3-amiga-05-boing.png`), then resets to `SPHERE_HOME = (-5,-5,-5)` (back to
  the corner). No error. The egg is fine; it just **re-confirms** the corner home.

### Switch-into-amiga (the B2 DFA symptom landing here)
- Switching **easing → amiga** lands a broken control surface: the left controls panel can
  render **EMPTY** (an empty rounded pill, `shots/b3-amiga-06-switch-from-easing.png`) while
  the menubar shows the **pause** glyph (group treated as playing — leaked playback state).
  In a variant where easing was PLAYED first, the amiga controls **did** render (18 fields =
  3 anims × 6) but the "Pause animation" label persisted — the playback state **leaks across
  the switch**. **This is B2's DFA suspend/resume defect manifesting on the amiga surface,
  not a B3-local bug** — cross-referenced to the [b2] agent; B3's float root-cause is
  independent of it.

---

## Source trace (file:line)

**RC-1 — corner-parked subject vs origin-orbiting camera (the "floats around"):**
- `demo/app/scenes/AmigaScene.vue:137-141` — on mount the sphere is placed at the corner:
  ```ts
  sphereMesh.position.set(-BOX_SIZE / 2 + 1, -BOX_SIZE / 2 + 1, -BOX_SIZE / 2 + 1); // (-5,-5,-5)
  ```
- `demo/app/scenes/AmigaScene.vue:88-96` — camera at `z=BOX_SIZE(12)`, `y=BOX_SIZE/3(4)`,
  default look toward origin.
- `demo/app/scenes/AmigaScene.vue:147-150` — `new OrbitControls(camera, …)`; **`controls.target`
  is left at its default `(0,0,0)`** → the camera orbits the **box origin**, not the sphere.
  The subject and the orbit pivot are **different points**, so orbiting sweeps the corner
  sphere across the whole frame.
- `demo/amiga/useSphereSpin.ts:81-105` — `hitsSphere()` gates `onPointerDown`; a miss
  `return`s to OrbitControls. With the sphere in a corner, the **centre of the stage is a
  miss**, so the headline gesture is the camera orbit, not the spin.
- `demo/app/scenes/AmigaScene.vue:64,76` — `SPHERE_HOME = -BOX_SIZE/2 + 1` re-cements the
  corner home after the boing egg.

**RC-2 — `content-visibility:auto` over a live WebGL loop (the GPU stall + the verbose warn):**
- `demo/app/scenes/AmigaScene.vue:263-266` (style) — `.scene-root { content-visibility: auto; }`
- `demo/app/scenes/AmigaScene.vue:173-184` — `startRenderLoop()` rAF `renderer.render()` runs
  while that subtree is being skipped/affected by `content-visibility`, producing the browser
  *"Rendering was performed in a subtree hidden by content-visibility"* verbose log and the
  per-frame **ReadPixels GPU stall** (the `GL_CLOSE_PATH_NV … GPU stall due to ReadPixels`
  warnings). This is a perf/correctness smell on the WebGL surface (it ties into B8 "glass-ui
  / dock animations slow", and the user's perf-above-all precept).

**W5/W8 change context (what the prompt pointed at):**
- The W5 commit `db90cbb` **rebuilt** amiga: created `useSphereSpin.ts` (drag→`decay()`), and
  in S6 added the amiga perf set — `setPixelRatio ≤2`, `content-visibility:auto` on inactive
  roots, the `tesselateSphere` tile-loop fix. The **corner sphere position pre-dates** the
  rebuild (it is the original boing-ball home), but W5 promoted the sphere to the **interactive
  subject** without **re-centring it** or **re-targeting OrbitControls onto it** — so the new
  drag-to-spin model was bolted onto an off-centre subject, which is what reads as "broken".
- The W8 commit `1f506b2` migrated the listeners to `useEventListener` (inv-ζ). This is a
  **clean swap** (`canvas.addEventListener(…,{capture:true})` → `useEventListener(canvas,…,
  {capture:true})`, with `stop()` handles). **It did NOT break positioning** — the probe shows
  the pointer listeners still attach and the camera orbit/spin still respond. The W8 migration
  is **not** the float root cause; RC-1 is independent of it. *(One latent note for the
  authoring phase: `attach()` is called once in `onMounted` while a vueuse `useEventListener`
  binds within the component's effect scope — fine here since the scene is single-mount/no
  KeepAlive; flagged only so the engine-transposition phase keeps the scope-ownership explicit.)*

---

## Root-cause HYPOTHESIS (for the root-cause + authoring phases)

1. **RC-1 (primary, the "floats around"):** the amiga interaction model is **incoherent** —
   the **subject** (sphere) and the **orbit pivot** (`OrbitControls.target = origin`) are
   different points, and the subject is parked in a **corner**. Result: (a) the sphere reads
   as a tiny off-centre ornament, not the subject; (b) the dominant gesture is a full-room
   camera orbit (every centre/empty-space drag), which **swings the corner sphere all over the
   frame** = "floats around"; (c) the W5-intended drag-to-spin-then-`decay()`-glide is
   practically unreachable. **Idiomatic fix direction (no workaround):** make the sphere the
   **centred subject** — place it at/near the room origin (or set `controls.target` onto the
   sphere and frame it) so the cursor lands on it and the orbit pivots **about the subject**;
   reconcile the boing `SPHERE_HOME` to the same centred home. This is a small, *gestalt*
   transposition of the scene's geometry, not a patch.

2. **RC-2 (secondary, perf/correctness):** `content-visibility:auto` is the **wrong primitive**
   for a live-`requestAnimationFrame` WebGL surface — it asks the browser to skip rendering a
   subtree that the rAF loop is simultaneously painting, yielding the "rendering in a hidden
   subtree" warning + a per-frame ReadPixels GPU stall. The W5 perf intent (stand the loop down
   when occluded) is already served by the **`contentvisibilityautostatechange`** listener +
   the tab-visibility pause; the `content-visibility:auto` *declaration itself* over a WebGL
   canvas is the smell. **Fix direction:** drive occlusion-pausing off the event/Intersection
   path and drop `content-visibility:auto` from the WebGL scene root (or scope it so it never
   races the present loop). Folds into B8 (perf) for the authoring phase.

3. **NOT B3:** no crash, no `pageerror`, no 404 on the built dist; no idle drift. The blank-
   controls-on-switch is **B2's DFA leak** surfacing on this scene, handed to [b2].

---

## Screenshots (paths)

- `docs/tranches/I/audit/investigate/shots/b3-amiga-01-load.png` — first load: sphere parked
  low-left in the room (the subject is NOT centred).
- `…/b3-amiga-02-t0.png`, `…/b3-amiga-03-t1.png` — rest frames (identical → no idle drift).
- `…/b3-amiga-04-after-drag.png` — **the "floats around":** a center drag tumbled the WHOLE
  room (camera orbit), sphere swung to lower-left.
- `…/b3-amiga-05-boing.png` — the boing egg arc (works).
- `…/b3-amiga-06-switch-from-easing.png` — switch easing→amiga: EMPTY left controls pill +
  menubar pause glyph (the B2 DFA symptom on this surface).
- `…/b3-amiga-07-switch-played.png` — switch after playing easing (controls render; play
  state leaks).
- `…/b3-amiga-rest-A.png`, `…/b3-amiga-rest-B.png` — canvas-clipped, 3 s apart, byte-identical.

## Probe files (paths)

- `docs/tranches/I/audit/investigate/probes/b3-amiga.mjs`
- `docs/tranches/I/audit/investigate/probes/b3-amiga-float.mjs`
- `docs/tranches/I/audit/investigate/probes/b3-amiga-switch.mjs`
