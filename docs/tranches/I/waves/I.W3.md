# I.W3 — THE AMIGA SCENE-RUNTIME TRANSPOSITION (Band 2 · subject = pivot = framing · the float disappears)

- **Phase:** DEV — spec authored, awaits IMPL+auth · **Class:** SHIP-in-I (HIGH; `/amiga`
  "totally broken and floats around" — an INCOHERENT interaction model + a wrong rendering
  primitive. No crash, no `pageerror`: the exact appearance/interaction class the green
  source-shape + load-time gates are blind to.) · **Scope (demo, NO engine):**
  `demo/app/scenes/AmigaScene.vue` (the sphere position, the OrbitControls target, the
  `content-visibility` declaration over the WebGL root, the `SPHERE_HOME` reconcile) +
  `demo/amiga/useAmigaAnimations.ts` (the boing-bounce extents keyed to the corner) +
  `demo/amiga/useSphereSpin.ts` (the spin gesture — already correct, simply aimed at an
  unreachable target). · **DAG-deps:** after **I.W0** (clean console) and **I.W1** (the
  switch-into-amiga stale-controls/leaked-pause-glyph is B2, closed by I.W1 — this wave is the
  GEOMETRY float, independent). RC-2 (the WebGL `content-visibility` stall) folds with the
  B8 perf posture (I.W4) — both are "the right occlusion primitive over live-painting surfaces."

## §Provenance (the folded root cause + investigation)

- `rootcause-rc-amiga.md` — the VERDICT: `/amiga` does NOT crash and emits NO `pageerror`; the
  breakage is two independent root causes, both appearance/interaction:
  - **RC-1 (the "floats around"):** the interactive SUBJECT (the sphere) and the camera ORBIT
    PIVOT (`OrbitControls.target = (0,0,0)`) are DIFFERENT points, and the subject is parked in
    a far CORNER `(-5,-5,-5)`. Every centre / empty-space drag is a raycast MISS, so it falls
    through to OrbitControls and TUMBLES THE WHOLE ROOM about the origin — the corner sphere
    swings across the frame. The W5-intended drag-to-spin → `decay()`-glide is practically
    UNREACHABLE.
  - **RC-2 (the GPU stall + verbose spam):** `.scene-root` carries `content-visibility: auto`
    over a live `requestAnimationFrame` WebGL present loop — the wrong primitive for a
    continuously-painted canvas; the browser warns *"Rendering was performed in a subtree
    hidden by content-visibility"* and pays a per-frame ReadPixels GPU stall.
- `rootcause-rc-amiga.md §confirmed root cause` (file:line):
  - `AmigaScene.vue:137-141` — `sphereMesh.position.set(-BOX_SIZE/2+1, …)` = `(-5,-5,-5)`
    (`BOX_SIZE=12`, `useAmigaAnimations.ts:6`) — the bottom-back-left corner, not the centre.
  - `AmigaScene.vue:147-150` — `new OrbitControls(...)` with NO `controls.target = sphere.position`
    (target stays default `(0,0,0)`); camera looks at origin (`:95-96`). **Subject ≠ pivot.**
  - `useSphereSpin.ts:81-105` — the spin gesture only fires on a raycast HIT of the corner
    sphere (`hitsSphere` gates `onPointerDown`; a miss `return`s `:91`, ceding to OrbitControls).
    The centre of the canvas — where the cursor naturally lands — is a MISS.
  - `AmigaScene.vue:64,76` + `useAmigaAnimations.ts:53-105` — `SPHERE_HOME = -BOX_SIZE/2+1` and
    the boing-bounce extents re-cement the corner; the corner is woven through the scene.
  - `AmigaScene.vue:263-266` — `.scene-root { content-visibility: auto; … }`; `:173-184`
    `startRenderLoop()` runs a perpetual rAF `renderer.render(scene, camera)` INSIDE that
    subtree; the occlusion-pause INTENT is already served by the
    `contentvisibilityautostatechange` listener (`:210-222`) + the tab-visibility pause
    (`useSceneVisibilityPause`, `:197-201`).
- `rootcause-rc-amiga.md §live confirmation` (`probes/rc-amiga-confirm.mjs`, BUILT dist):
  `sceneRootStyle.contentVisibility:"auto"`; a CENTRE-canvas drag changed the canvas region
  drastically (`20872 → 32429` PNG bytes, ~+55% — the whole room re-projected, not a centred
  sphere spinning); `pageErrors:[]`; `gpuStallWarnings:4`, `contentVisibilityWarnings:13`.
  Load-bearing shots: `shots/rc-amiga-center-before.png` (small checker sphere low-left of
  centre) → `shots/rc-amiga-center-after.png` (the ENTIRE room re-projected, sphere flung to
  the lower-left, perspective-distorted — the centre drag drove OrbitControls).
- `rootcause-rc-amiga.md §change attribution` — the corner PRE-DATES W5 (the original 1984
  boing-ball home); W5 (`db90cbb`) is the regression of MEANING: it promoted the sphere to the
  interactive SUBJECT (`useSphereSpin` + `attach`) and bolted drag-to-spin onto the off-centre,
  origin-orbited subject WITHOUT re-centring it or re-targeting OrbitControls. W5 also
  introduced RC-2 (the S6 perf set added `content-visibility: auto` on the WebGL root). W8
  (`1f506b2`) did NOT break positioning (a clean `addEventListener → useEventListener` swap).

## §The state, verified (file:line / live anchors)

- The scene wires THREE disjoint truths that do not agree on WHAT the subject is or WHERE the
  camera pivots: the sphere at `(-5,-5,-5)` (a corner), OrbitControls pivoting the origin
  (never re-targeted), and the spin gesture gated on a raycast HIT of the corner sphere. Net:
  the user grabs the visual CENTRE → the camera orbits the ORIGIN → the entire perspective
  "room" re-projects and the small corner sphere swings to the lower-left = "floats around."
  The intended grab-the-ball → spin → release → glide is reachable only by precisely clicking a
  tiny off-centre target, which no one does.
- `content-visibility: auto` over the live WebGL loop is the WRONG primitive for a
  continuously-`rAF`-painted canvas — it asks the compositor to skip a subtree the present loop
  is actively painting → the verbose log + a per-frame ReadPixels GPU stall. The
  occlusion-pause intent is ALREADY met by the two event-driven standers-down
  (`useSceneVisibilityPause` + the `contentvisibilityautostatechange` listener).
- `useSphereSpin` (the drag-to-spin → `decay()`-glide) is ALREADY CORRECT — it is the Three.js
  twin of the cube's `useOrbitalInertia.ts`/`useOrbitalPointer.ts` (which spin a CENTRED
  subject and ride the engine's analytic `decay()`). It was simply aimed at an unreachable
  corner target.

## §Goal

`/amiga` reads as a coherent scene: the cursor lands on the sphere (the dominant, centred
subject), a grab spins it and a release glides it (the W5-intended gesture, now reachable), and
an empty-space drag orbits the camera ABOUT the subject (reads as "circling the ball," not "the
world swings") — and the WebGL present loop pays no `content-visibility` GPU stall. The bug is
NOT a wrong number to nudge; it is TWO truths that must be made ONE: *the subject, the orbit
pivot, and the framing are the same point.* A small geometric transposition that rides the
demo's already-shipped idiom — no workaround, no legacy.

## §Scope

- **S1 — unify SUBJECT = ORBIT PIVOT = FRAMING (closes RC-1, the PRIMARY).** Establish (and
  gate) the single invariant: *the sphere's world position, `OrbitControls.target`, and the
  camera's look-at are the SAME point, and the sphere is the dominant centred subject the cursor
  lands on.* Concretely (the wave chooses exact values):
  - **Centre the subject.** Seat the sphere at (or near) the room origin instead of the corner,
    and reconcile `SPHERE_HOME` (`AmigaScene.vue:64`) AND the boing-bounce extents
    (`useAmigaAnimations.ts`) to that same centred home, so the egg returns to the centred
    subject — ONE home, used everywhere.
  - **Make the pivot follow the subject.** `controls.target` (and `controls.update()`) track
    the sphere's centre, so an empty-space drag orbits ABOUT the subject, not a disjoint origin.
  - **Result:** the centre of the canvas now HITS the sphere → the headline gesture is the
    W5-intended drag-to-spin → `decay()`-glide (`useSphereSpin` already implements it; it was
    aimed at an unreachable target). The camera orbit recedes to its intended
    background-for-misses role. "Floats around" disappears because there is no longer a corner
    subject for an origin orbit to sweep.
  **WHY:** this is the SAME idiom the cube already ships (`useOrbitalInertia`/`useOrbitalPointer`
  spin a CENTRED subject and ride `decay()` for release inertia). Amiga's `useSphereSpin` is the
  Three.js twin; the transposition gives it a centred subject + a subject-tracking pivot so the
  two demos share one coherent "grab the centred subject, flick, watch it glide" model.
  > Alternative recorded for IMPL: if the corner STAGING is aesthetically wanted, set
  > `controls.target = sphereMesh.position` and frame the camera on it — but the simpler, more
  > legible gestalt is to CENTRE the subject (the spin is the headline; a centred subject is the
  > one the cursor naturally grabs).

- **S2 — drop `content-visibility: auto` from the live WebGL root (closes RC-2; folds B8).**
  Locus: `AmigaScene.vue:263-266` (the scoped style) + the occlusion-pause path. Drive
  occlusion-pausing ENTIRELY off the event/observer path (the `contentvisibilityautostatechange`
  listener — which can itself ride an `IntersectionObserver`-style visibility signal — plus
  `useSceneVisibilityPause`) and REMOVE the `content-visibility: auto` declaration from the
  WebGL scene root (or scope it so it never overlaps the present loop's painted subtree). ONE
  owner of "is this surface visible?", driving start/stopRender — not a CSS token racing the
  GPU. **WHY:** `content-visibility: auto` is the wrong primitive for a continuously-painted
  canvas; the occlusion intent is already met by the event-driven standers-down. This is a pure
  removal of a smell — it can only REDUCE per-frame work (the ReadPixels stall + the hidden-
  subtree warns vanish). Folds into B8 (I.W4) as "the right occlusion/visibility primitive over
  live-painting surfaces" — both waves share that principle; this wave owns the amiga locus.

## §Hard gate (the proof:* that BITES — born-RED on `b934a08`, GREEN-on-fix · RUNTIME/INTERACTION)

**`proof:amiga-subject-is-pivot`** + **`proof:amiga-no-gpu-stall`** — a Playwright session over
the BUILT `dist/gh-pages/` (the `proof-no-orphan-specular.mjs` harness; this wave's confirmation
probe `rc-amiga-confirm.mjs` is the working template, the assertions INVERT):

- **clause (a) — a centre-canvas drag moves the SUBJECT, not the camera.** Drive a centre-canvas
  pointer drag on `/amiga` and assert (i) the SPHERE rotation / screen-centroid CHANGED (subject
  moved) WHILE (ii) the room/camera did NOT tumble (the orbit pivot is the subject, not a
  disjoint origin) — i.e. the inverse of the `centerDragChangedBytes`-of-the-whole-room signal.
  Concretely: the canvas-region delta of a centre drag is LOCAL (the sphere spins) — NOT the
  ~+55% whole-room re-projection the probe measured today. **BITE:** reds TODAY — a centre drag
  re-projects the entire room (`rc-amiga-center-before/after.png`, +55% bytes); greens on S1
  (centre the subject + track the pivot) so the centre HITS the sphere and the spin gesture
  fires. **This is the behavioral assertion** — it proves the W5-intended gesture is reachable.
- **clause (b) — an empty-space drag orbits ABOUT the subject.** Drive a clearly-empty-space drag
  (a corner of the canvas with no subject) and assert the camera orbits such that the sphere
  stays roughly framed (the pivot is the subject) — not a sweep that flings a corner sphere
  across the frame. **BITE:** reds TODAY (the origin-orbit flings the corner sphere); greens on
  S1's subject-tracking pivot.
- **clause (c) — no GPU-stall / content-visibility warns.** Load `/amiga`, run the present loop
  for ≥2s, and assert ZERO `warning`/`verbose` console lines matching
  `/ReadPixels|GPU stall|content-visibility|hidden by content-visibility/` — promoting the
  console gate PAST `error`-only. **BITE:** reds TODAY (4 ReadPixels GPU-stall + 13
  content-visibility hidden-subtree warns in one load, `rc-amiga-confirm.mjs`); greens on S2
  (drop `content-visibility` from the WebGL root).

**The §spine bar — MUST bite.** Clauses (a)/(b) CLICK-AND-DRAG the stage and assert the SUBJECT
(not the camera) moved — an interaction invariant no source-shape lint can see (the source
compiles, `useSphereSpin` passes `proof:composable-encapsulation`, but subject-position ≠
orbit-target is a semantic disagreement). Clause (c) fails on `warning`/`verbose` GPU-stall +
content-visibility logs that a clean-`error` gate ignores. RED on `b934a08` (the whole-room
re-projection on centre drag + the GPU-stall spam), GREEN only when the subject/pivot/framing are
one point and the WebGL root sheds `content-visibility`. These gates would have caught B3 the day
W5 shipped. This gate is a CLAUSE of the I.W7 `proof:live-session` battery (the amiga centre-drag
+ console-during-render leg).

## §Folds

- **B3** (amiga floats around) — S1 (subject = pivot = framing). The W5 regression of MEANING is
  corrected at the geometry seam, riding the cube's shipped orbital idiom.
- **RC-2 / B8** (the WebGL `content-visibility` GPU stall) — S2. Folds into B8 (I.W4) as the
  shared "right occlusion primitive over live-painting surfaces" principle; this wave owns the
  amiga locus, I.W4 owns the dock/perf posture.
- **B2's amiga surfacing (the stale-controls + leaked pause glyph on switch-into-amiga,
  `shots/b3-amiga-06/07`)** — NOT this wave; it is B2's DFA suspend/resume leak surfacing on
  amiga, owned by **I.W1**. RC-1 (the float) is independent of it. (`rc-amiga §Scope notes`.)
- **Latent note (RECORD for IMPL):** keep the gesture composable's scope-ownership explicit —
  `useSphereSpin.attach()` is imperative-in-`onMounted` while `useEventListener` binds in the
  component scope; fine at single-mount/no-KeepAlive, but the transposition should make ownership
  of the pointer + present-loop lifecycle ONE seam (`rc-amiga §W5/W8 attribution`).

## §Design decisions (trade-offs RESOLVED)

- **Centre the subject over re-target-the-corner — RESOLVED (centre).** Both fix RC-1, but the
  more legible gestalt is to centre the subject: the spin is the headline, and a centred subject
  is the one the cursor naturally grabs. Re-targeting OrbitControls onto a corner subject keeps
  an off-centre staging that reads as odd; centring makes the whole scene coherent. (The
  re-target alternative is recorded for IMPL if the corner staging is aesthetically wanted.)
- **ONE home, reconciled everywhere — RESOLVED.** The corner is woven through `SPHERE_HOME` AND
  the boing-bounce extents; centring the subject requires reconciling BOTH to the new home, so
  the egg returns to the centred subject. A half-fix (move the sphere but leave the bounce
  extents at the corner) would re-introduce the disagreement. One home, used everywhere.
- **Drop `content-visibility`, don't tune it — RESOLVED.** `content-visibility: auto` is the
  wrong primitive for a live-painting canvas, full stop — tuning `contain-intrinsic-size` would
  not stop the present loop from painting a "hidden" subtree. The occlusion intent is already
  met by the event-driven standers-down (`useSceneVisibilityPause` + the
  `contentvisibilityautostatechange` listener). Removing the declaration is a pure
  smell-removal that only reduces per-frame work. (K-8's `content-visibility:auto` precondition
  note in `recap-deferred §9` confirms the precondition is absent here.)
- **`useSphereSpin` is NOT rewritten — RESOLVED.** The drag-to-spin → `decay()`-glide is already
  correct (the Three.js twin of the cube orbital). It was aimed at an unreachable target; S1
  makes the target reachable. No gesture-engine churn — the geometry transposition alone makes
  the existing, correct composable fire. (no-legacy: the gesture seam is sound, only the staging
  was wrong.)
- **HIGH, appearance/interaction — RESOLVED.** No crash, no `pageerror`, no 404 — the gates pass
  on load. The defect exists only AFTER a pointer drag at the canvas centre (RC-1) and only as
  `warning`/`verbose` console levels (RC-2), which a clean-`error` gate ignores. This is the
  user's standing warning verbatim: green source-shape gates miss appearance/interaction; audit
  the RUNNING demo. The gate must drive a centre-stage drag and assert the subject (not the
  camera) moved — exactly what the I overhaul mandates.
