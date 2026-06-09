# Root-Cause — B3 `/amiga` "totally broken, floats around" [rc-amiga]

**Agent:** root-cause [rc-amiga] · **Tranche I development** · branch `tranche-i-dev`.
**Date:** 2026-06-08. **Inputs:** `investigate/b3-amiga.md` (+ probes `b3-amiga.mjs`,
`b3-amiga-float.mjs`, `b3-amiga-switch.mjs`), `AmigaScene.vue`, `useSphereSpin.ts`,
`useAmigaAnimations.ts`, the W5 (`db90cbb`) + W8 (`1f506b2`) diffs, and a fresh
confirmation probe `probes/rc-amiga-confirm.mjs` run against the BUILT `dist/gh-pages`.

---

## Verdict (one line)

`/amiga` does **not** crash and emits **no `pageerror`** — the breakage is an
**incoherent INTERACTION MODEL plus a wrong rendering primitive**, exactly the
appearance/interaction/state class the green source-shape + load-time gates are blind to.
Two independent root causes:

- **RC-1 (the "floats around"):** the interactive **subject** (the sphere) and the
  camera **orbit pivot** (`OrbitControls.target = (0,0,0)`) are **different points**, and
  the subject is parked in a far **corner** `(-5,-5,-5)`. Every centre / empty-space drag
  is a raycast **miss**, so it falls through to OrbitControls and **tumbles the whole room
  about the origin** — the corner sphere swings across the frame. The W5-intended
  drag-to-spin → `decay()`-glide gesture is practically **unreachable**.
- **RC-2 (the GPU stall + the verbose spam):** `.scene-root` carries
  `content-visibility: auto` over a **live `requestAnimationFrame` WebGL present loop** —
  the wrong primitive for a continuously-painted canvas; the browser warns *"Rendering was
  performed in a subtree hidden by content-visibility"* and pays a per-frame **ReadPixels
  GPU stall**.

---

## Confirmed root cause (file:line)

### RC-1 — corner-parked subject vs origin-orbiting camera

The scene wires THREE disjoint truths that do not agree on **what the subject is** or
**where the camera pivots**:

1. **The sphere is placed in a corner** — `demo/app/scenes/AmigaScene.vue:137-141`:
   ```ts
   sphereMesh.position.set(-BOX_SIZE / 2 + 1, -BOX_SIZE / 2 + 1, -BOX_SIZE / 2 + 1); // (-5,-5,-5)
   ```
   `BOX_SIZE = 12` (`demo/amiga/useAmigaAnimations.ts:6`), so the sphere sits at the
   bottom-back-left **corner** of the room, not its centre.

2. **OrbitControls pivots the ORIGIN, never re-targeted** —
   `demo/app/scenes/AmigaScene.vue:147-150`:
   ```ts
   controls = new OrbitControls(camera, renderer.domElement);
   controls.enableDamping = true;
   controls.dampingFactor = 0.05;
   controls.screenSpacePanning = false;
   // ← NO controls.target = sphere.position  (target stays default (0,0,0))
   ```
   The camera (`position.z = BOX_SIZE`, `position.y = BOX_SIZE/3`, looking at origin —
   lines 95-96) orbits the **box centre**. The subject is `(-5,-5,-5)`. **Subject ≠ pivot.**

3. **The spin gesture only fires on a raycast HIT of the corner sphere** —
   `demo/amiga/useSphereSpin.ts:81-105` (`hitsSphere` gates `onPointerDown`; a miss
   `return`s, line 91, ceding the pointer to OrbitControls). With the sphere in a corner,
   the **centre of the canvas — where the cursor naturally lands — is a MISS**, so the
   headline gesture a user gets is the **full-room camera orbit**, not the spin.

4. **The boing egg re-cements the corner home** —
   `demo/app/scenes/AmigaScene.vue:64,76`: `SPHERE_HOME = -BOX_SIZE/2 + 1`, and on the
   egg's settle the mesh is re-seated to `(SPHERE_HOME, SPHERE_HOME, SPHERE_HOME)` — the
   same corner. The bounce animations (`useAmigaAnimations.ts:53-105`) also key off the
   corner extents, so the corner is woven through the scene.

**Net:** the user grabs the visual centre of the stage → the camera orbits the **origin**
→ the entire perspective "room" re-projects and the small corner sphere swings to the
lower-left = **"floats around."** The intended *grab-the-ball → spin → release → glide* is
reachable only by precisely clicking a tiny off-centre target, which no one does.

### RC-2 — `content-visibility: auto` over a live WebGL loop

- `demo/app/scenes/AmigaScene.vue:263-266` (scoped style):
  ```css
  .scene-root { content-visibility: auto; contain-intrinsic-size: auto none auto 600px; }
  ```
- `demo/app/scenes/AmigaScene.vue:173-184` — `startRenderLoop()` runs a perpetual
  `requestAnimationFrame(animate)` calling `renderer.render(scene, camera)` **inside** that
  `content-visibility: auto` subtree. The browser is being asked to skip rendering a
  subtree the rAF loop is simultaneously painting → the *"rendering in a subtree hidden by
  content-visibility"* verbose log + a per-frame `ReadPixels` GPU stall.
- The W5 perf *intent* (stand the loop down when the scene is occluded) is **already
  served** by the `contentvisibilityautostatechange` listener (lines 210-222) **and** the
  tab-visibility pause (`useSceneVisibilityPause`, lines 197-201). The `content-visibility:
  auto` **declaration itself over the WebGL canvas** is the smell that produces the stall.

---

## Live confirmation (fresh probe, built dist)

`probes/rc-amiga-confirm.mjs` (serveDist port 0 + chromium via
`KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js`), navigating `#/amiga`:

```json
{
  "sceneRootStyle": { "found": true, "contentVisibility": "auto",
                      "containIntrinsicSize": "auto none auto 600px" },
  "centerDragChangedBytes": true, "beforeBytes": 20872, "afterBytes": 32429,
  "pageErrors": [],
  "gpuStallWarnings": 4, "contentVisibilityWarnings": 13
}
```

- **RC-1 proven:** a **centre-canvas drag** changed the canvas region drastically (20872 →
  32429 PNG bytes, ~+55%) — the **whole room re-projected**, not a centred sphere spinning.
  Visual evidence (load-bearing):
  - `shots/rc-amiga-center-before.png` — small checker sphere parked **low-left of centre**,
    room a symmetric perspective box.
  - `shots/rc-amiga-center-after.png` — **the entire room re-projected** (vanishing point
    swung up-left, ceiling/walls rotated) and the sphere flung to the lower-left corner,
    enlarged + perspective-distorted. The centre drag drove **OrbitControls**, confirming
    the centre is a sphere MISS.
- **RC-2 proven:** computed `content-visibility: auto` on `.scene-root`; **4** ReadPixels
  GPU-stall warnings + **13** content-visibility "hidden subtree" verbose logs in one load.
- **`pageErrors: []`** — no thrown error, no 404 on the built dist. The gates pass on load.

(Corroborates `investigate/b3-amiga.md` exactly: byte-identical 3-s-apart rest frames there
proved "floats around" is **not** idle drift — it is the camera-orbit-of-a-corner-subject.)

---

## Why the gates MISSED it (the blindspot, for the gate-regime overhaul)

The H gate-regime certified `/amiga` GREEN because every gate it runs is **source-shape or
load-time**, and **none of B3's two faults is visible to either**:

1. **`proof:demo-console-clean` / `proof:browser` check the HOME LOAD, not interaction.**
   `/amiga` throws nothing and 404s nothing **on load** — `pageErrors: []`. The defect only
   exists *after a pointer drag at the canvas centre* (RC-1) and only as **`warning`/
   `verbose`** console levels (RC-2), which a clean-`error` gate ignores. No gate ever
   **clicks-and-drags** the stage and asserts the **subject** (not the camera) moved.

2. **No gate encodes the interaction CONTRACT.** "Drag the sphere → the sphere spins; a
   miss → the camera orbits **about the sphere**" is a runtime invariant. The source
   *compiles* and the composable *exists* (`useSphereSpin` passes `proof:composable-
   encapsulation`), so source-shape is green — but **subject-position ≠ orbit-target** is a
   semantic disagreement no structural lint can see.

3. **`content-visibility: auto` is a legitimate token** — `proof:styling-idioms` would
   bless it. Nothing static knows it is **racing a live WebGL present loop**; only a
   running probe reading `console.on("console")` surfaces the GPU-stall/hidden-subtree warns,
   and the gate filtered to `error` level dropped them.

This is the user's standing warning verbatim: *green source-shape gates miss
appearance/interaction/state; audit the RUNNING demo.* The tranche-I gate overhaul must add
a **real interaction gate** that drives a centre-stage drag on `/amiga` and asserts the
**sphere** (the subject) moved while the **camera** did not — and a **runtime-console gate
that fails on `warning`/`verbose` GPU-stall + content-visibility logs**, not just `error`.

---

## W5 / W8 change attribution (what broke when)

- **The corner position PRE-DATES the W5 rebuild.** `git show db90cbb~1:…/AmigaScene.vue`
  already has `sphereMesh.position.set(-BOX_SIZE/2+1, …)` and an `OrbitControls` with **no
  `controls.target`**. The corner is the original 1984 boing-ball home.
- **W5 (`db90cbb`) is the regression of MEANING, not of geometry.** W5 promoted the sphere
  to the **interactive subject** (added `useSphereSpin` + `sphereSpin.attach(canvas)`,
  AmigaScene.vue:46-52,154) and bolted the drag-to-spin model onto the **off-centre,
  origin-orbited** subject **without re-centring it or re-targeting OrbitControls onto it.**
  W5 also introduced RC-2 (the S6 perf set added `content-visibility: auto` on the WebGL
  root). The W5 diff confirms it touched `setPixelRatio` + `attach` but **never** the
  `position.set` or a `controls.target`.
- **W8 (`1f506b2`) did NOT break positioning.** Its AmigaScene change is a clean swap of the
  `contentvisibilityautostatechange` listener from `addEventListener` →
  `useEventListener` (inv-ζ). It is not the float root cause; RC-1 is independent of it.
  *(One latent note for the engine-transposition phase: keep the gesture composable's
  scope-ownership explicit — `attach()` is imperative-in-`onMounted` while
  `useEventListener` binds in the component scope; fine at single-mount/no-KeepAlive, but
  the transposition should make ownership of the pointer + present-loop lifecycle one seam.)*

---

## Idiomatic GESTALT fix DIRECTION (the seam / transposition — NOT a patch)

The bug is **not** a wrong number to nudge; it is **two truths that must be made one**:
*the subject, the orbit pivot, and the framing are the same point.* The fix is a small
**geometric transposition** that makes the scene's interaction model **coherent**, riding
the demo's already-shipped idiom — **no workaround, no legacy.**

### Seam 1 — unify SUBJECT = ORBIT PIVOT = FRAMING (closes RC-1)

The single invariant to establish and **gate**:

> The sphere's world position, `OrbitControls.target`, and the camera's look-at are the
> **same point**, and the sphere is the **dominant centred subject** the cursor lands on.

Concretely (direction, the waves choose the exact values):

- **Centre the subject.** Seat the sphere at (or near) the room origin instead of the
  corner, and reconcile **`SPHERE_HOME`** (AmigaScene.vue:64) **and the boing-bounce
  extents** (`useAmigaAnimations.ts`) to that same centred home, so the egg returns to the
  centred subject — one home, used everywhere. (Alternatively, if the corner staging is
  aesthetically wanted, set `controls.target = sphereMesh.position` and frame the camera on
  it — but the simpler, more legible gestalt is **centre the subject**, because the spin is
  the headline and a centred subject is the one the cursor naturally grabs.)
- **Make the pivot follow the subject.** `controls.target` (and `controls.update()`) track
  the sphere's centre, so an empty-space drag orbits **about the subject**, not a disjoint
  origin — the camera "circles the ball," which reads as intentional rather than "the world
  swings."
- **Result:** the centre of the canvas now **hits** the sphere → the headline gesture is the
  W5-intended **drag-to-spin → `decay()`-glide** (`useSphereSpin` already implements it
  correctly; it was simply aimed at an unreachable target). The camera orbit recedes to its
  intended **background-for-misses** role. "Floats around" disappears because there is no
  longer a corner subject for an origin orbit to sweep.

This is the **same idiom the cube already ships** — `useOrbitalInertia.ts` /
`useOrbitalPointer.ts` spin a **centred** subject and ride the engine's analytic `decay()`
for release inertia (e12487b). Amiga's `useSphereSpin` is the Three.js twin of that seam;
the transposition simply gives it a **centred subject + a subject-tracking pivot** so the
two demos share one coherent "grab the centred subject, flick, watch it glide" model.

### Seam 2 — drop `content-visibility: auto` from the live WebGL root (closes RC-2)

`content-visibility: auto` is the **wrong primitive** for a continuously-`rAF`-painted
canvas — it asks the compositor to skip a subtree the present loop is actively drawing.
The occlusion-pause **intent** is already met by the two **event-driven** standers-down
(`useSceneVisibilityPause` + the `contentvisibilityautostatechange` listener, which itself
can ride an `IntersectionObserver`-style visibility signal). The transposition: **drive
occlusion-pausing entirely off the event/observer path and remove the `content-visibility:
auto` declaration from the WebGL scene root** (or scope it so it never overlaps the present
loop's painted subtree). One owner of "is this surface visible?", driving start/stopRender
— not a CSS token racing the GPU. Folds into B8 (perf) for the wave plan.

### Gate the seam (so the blindspot stays closed)

The fix is only durable behind a **runtime interaction gate** that the wave authors must
stand up:
- **`proof:amiga-subject-is-pivot`** — drive a **centre-canvas pointer drag** on `/amiga`
  and assert (a) the **sphere rotation/screen-centroid changed** (subject moved) while (b)
  the **room/camera did NOT tumble** (orbit pivot is the subject, not a disjoint origin) —
  i.e. the inverse of the `centerDragChangedBytes`-of-the-whole-room signal this probe used.
- **`proof:amiga-no-gpu-stall`** — load `/amiga`, run the present loop, and **fail on any
  `warning`/`verbose` console matching `ReadPixels`/`GPU stall`/`content-visibility hidden
  subtree`** — promoting the console gate past `error`-only.

Both gates **click and observe the running demo** — the headline of the tranche-I
gate-regime overhaul — and would have caught B3 the day W5 shipped.

---

## Scope notes (handoffs)

- **NOT rc-amiga:** the *empty-controls-on-switch into amiga* + the *leaked pause glyph*
  (`shots/b3-amiga-06/07`) are **B2's DFA suspend/resume leak** (`this._gen` /
  scenePlaybackAdapters) surfacing on this scene — handed to **[rc-dfa / B2]**. RC-1 is
  independent of it.
- **RC-2 folds into B8** (glass-ui/dock perf) for the wave plan — both are "the right
  occlusion/visibility primitive over live-painting surfaces."

## Evidence index

- Findings: `docs/tranches/I/audit/investigate/b3-amiga.md`
- Probes: `…/investigate/probes/b3-amiga.mjs`, `b3-amiga-float.mjs`, `b3-amiga-switch.mjs`,
  and the confirmation `…/probes/rc-amiga-confirm.mjs` (this agent).
- Shots: `…/investigate/shots/b3-amiga-01-load.png` … `-07-switch-played.png`;
  `…/shots/rc-amiga-center-before.png` + `…/rc-amiga-center-after.png` (this agent — the
  centre-drag room-tumble, the load-bearing RC-1 proof).
- Source: `demo/app/scenes/AmigaScene.vue:137-141,147-150,95-96,64,76,173-184,210-222,263-266`;
  `demo/amiga/useSphereSpin.ts:81-105`; `demo/amiga/useAmigaAnimations.ts:6,53-105`.
- Change attribution: W5 `db90cbb`, W8 `1f506b2`, pre-W5 `db90cbb~1` (corner predates W5).
