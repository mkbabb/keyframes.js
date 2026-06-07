# Tranche H Deep Audit — Lane `a-mode-interactivity`

**Charge (D11):** the surviving scene modes should become MORE INTERACTIVE
(clickable / draggable) — audit each scene's direct-manipulation surface against
the cube's orbital drag, and propose the per-mode interaction model, dogfooding
the engine where apt.

**Method:** read every scene target + composable; drove the live demo at
`http://localhost:5174/` (Playwright MCP, 1440×900) and probed each scene's
`.dock-inset` viewport for `cursor:move|grab`, `[role=slider]`, `[tabindex]`.

**Binding mandate honoured:** every finding carries a `file:line` or a live
observation; gestalt fixes only (no workarounds); perf claims are MEASURE-FIRST;
dogfooding the engine (`SpringProgress`, `NumericAnimation`, `ManualTimeline`,
`fromMotionPath`) is preferred over hand-rolled gesture math.

---

## The baseline — what "interactive" means here (the cube)

The cube (`demo/cube/CubeTarget.vue:11` → `OrbitalDrag.vue`) is the gold
standard and the yardstick for every other scene. It is a complete
direct-manipulation surface:

- quaternion source-of-truth, never reconstructed from Euler
  (`OrbitalDrag.vue:71`), so drag never gimbal-locks;
- inertia / momentum hand-off on release (`useOrbitalInertia`, wired
  `OrbitalDrag.vue:239-250`; release dampen `OrbitalDrag.vue:306-325`);
- pinch-zoom + Safari gesture events (`useOrbitalPinch`,
  `OrbitalDrag.vue:225-235`, `:274-281`);
- axis-constrained rotate / translate / scale via held `x|y|z` + shift/ctrl
  keys (`handleAxisSpecificInput`, `OrbitalDrag.vue:184-203`);
- two-way `v-model` so a drag and the matrix-editor sliders are the SAME state
  (`OrbitalDrag.vue:34`, reverse-seed watch `:296-303`);
- `cursor: move; touch-action: none; user-select: none` (`OrbitalDrag.vue:328-333`).

**Live confirmation:** `/#/cube` viewport reports `rootTouchAction:"none"` and a
draggable element (`cursor:move`). This is ALREADY-SOTA — the audit's job is to
bring the *flat* scenes up toward it, not to touch the cube.

The demo already owns a SECOND reusable direct-manipulation primitive that the
flat scenes ignore: `EasingCurveCanvas.vue` has draggable bezier control-point
handles (`@pointerdown="startDragging"` … `EasingCurveCanvas.vue:12-14`,
`editable` handles `:72-92`). It is mounted ONLY inside the controls sidebar
(`TimingFunctionPanel.vue:38-45`, behind `cubic-bezier`), never on a scene stage.

---

## Interactivity census (source + live probe)

| Scene | Stage interactivity today | Engine dogfooded | Verdict |
|-------|---------------------------|------------------|---------|
| **cube** | Orbital drag + inertia + pinch + axis keys | `AnimationGroup` | ALREADY-SOTA (baseline) |
| **amiga** | three.js `OrbitControls` (3D orbit) | three (not kf) | adequate (out of lane scope) |
| **spring** | Drag/tap rail to re-seat target + arrow/Home/End keys (`SpringTarget.vue:31-32,93-124`) | `SpringProgress` | GOOD — closest to baseline; one gap |
| **sequence** | Master scrubber drag + keys (`SequenceTarget.vue:55-56,160-189`); transport buttons | `Sequence` transport | PARTIAL — playhead only, children inert |
| **easing** | Scrubber `Slider` only (`EasingTarget.vue:43-55`); comparison tracks READ-ONLY; bezier canvas NOT on stage | `NumericAnimation` sweep | WEAK — the curve itself is not manipulable |
| **motion-path** | NONE on stage; scrub only via bottom ribbon (`MotionPathTarget.vue` has no pointer handlers) | `fromMotionPath` | WEAK — a static traveller |
| **square** | NONE — static engine-driven box (`SquareScene.vue` template + `useSquareAnimations.ts`; no pointer/click anywhere) | `CSSKeyframesAnimation` | DEAD — zero direct manipulation |
| **starting-style** | Toggle button + preset buttons (`StartingStyleTarget.vue:32-66`) | `springTimingFunction` | OK by nature (discrete demo) |

**Live probe results (1440×900):**
- `/#/easing` viewport: `draggableCount:0`, `sliderCount:1` (scrub), `tabindexCount:1`.
  Comparison tracks expose NO `role`/`tabindex`/`pointer` — pure display.
- `/#/cube` viewport: draggable `cursor:move`, `touch-action:none`.
- `/#/square`: navigating there **bounced to `#/?anim=Rotations`** (home) — the
  square stage never mounted. This is the D12 scene-state corruption surfacing in
  THIS lane; cross-ref `a-state-machine` / `d-scene-state`. A scene that can't
  hold its route can't be made interactive — D12 is a **prerequisite** for D11.

---

## Findings

### H-MI-1 — `square` is a non-interactive dead end · **disposition: KILL (recommend) / else SHIP-in-H rebuild**
**Anchor:** `demo/app/scenes/SquareScene.vue` (static `<div class="demo-box">heyyyy`,
no handlers) + `demo/square/useSquareAnimations.ts:14-32` (a custom `transformFunc`
that string-builds `translate/scale/rotate` with NO input path).

The square is purely a passive showcase of the custom-transform-function feature
(nested `a.b.c.d` object keyframes). It has zero clickable/draggable surface, the
copy reads "heyyyy", and live it doesn't even survive a route switch. Per the
mandate (NO legacy code; a replaced surface is replaced in one motion), the
honest gestalt call is: **the square's feature (custom transform fn over nested
objects) is already proven by the cube's matrix path and the motion-path scalar
sweep.** It earns its keep ONLY if it becomes directly manipulable.

**Gestalt fix (if it survives):** make the box a drag target that the engine
follows. Drop the box's *position* onto a `SpringProgress`-per-axis (dogfood):
pointer-drag sets each axis target, the spring chases it — the SAME re-seat idiom
spring already ships (`SpringTarget.vue:84-108`). The custom `transformFunc`
(`useSquareAnimations.ts:14`) then reads live spring values, so the demo proves
"custom transform fn + SpringProgress" instead of an inert ping-pong.
**Falsifiable instrument:** `proof:square-drag` — a test that a `pointerdown`+move
on `.demo-box` mutates a target ref and the spring value converges toward it;
visual lock on the box following the cursor.

**Recommendation:** if a hardening lane (D8 pertinence audit) is already
questioning the new modes, square is the weakest of the *original* set and the
prime KILL candidate. If kept, it MUST get the drag model above — no third option.

---

### H-MI-2 — `easing`: the curve is shown but not GRABBED · **disposition: SHIP-in-H**
**Anchor:** `EasingTarget.vue:43-55` (scrub `Slider` is the only handle) +
`EasingTarget.vue:64-95` (comparison tracks are read-only balls). The draggable
bezier editor exists (`EasingCurveCanvas.vue:12-14,72-92`, `editable`) but is
imprisoned in the sidebar (`TimingFunctionPanel.vue:38`), never on the stage.

The easing scene is *about* the shape of a curve, yet you cannot touch the curve.
You scrub a 1-D slider while a number changes — the least tactile of all the
flat scenes relative to its own subject.

**Gestalt fix:** promote `EasingCurveCanvas` (already built, already draggable,
already `@update:bezier-points`) to be the easing scene's PRIMARY stage element
when the selected curve is bezier-class (`isBezierEditable`,
`useEasingDemo.ts:66-69`). Dragging a control handle re-shapes the live curve AND
the sweep ball that rides it (`progress` is already the shared time axis,
`useEasingDemo.ts:52-58`). This is pure REUSE — no new gesture code, it collapses
the sidebar-vs-stage split (DRY) and makes the scene's subject its interaction.
For non-bezier named curves keep the scrubber; for `steps` the discrete inputs.
**Falsifiable instrument:** `proof:easing-curve-onstage` — a test that on a bezier
curve the stage renders `EasingCurveCanvas[editable]` and a handle drag updates
`bezierControlPoints`; visual lock on the curve+ball re-shaping under drag.

---

### H-MI-3 — `motion-path`: a traveller you can't grab; scrub it ON the path · **disposition: SHIP-in-H**
**Anchor:** `MotionPathTarget.vue` (no `@pointerdown`/`@click` anywhere; the
traveller is positioned solely by the engine's `offset-distance` sweep,
`:54-69`). Scrubbing exists only via the bottom ribbon, far from the path.

The browser already owns `path → position` (the scene's whole thesis,
`motionPathGeometry.ts`). The inverse — `pointer → offset-distance` — is the
natural direct manipulation and is trivially dogfoodable.

**Gestalt fix:** make the traveller draggable ALONG its own path. On
`pointerdown`, scrub by projecting the pointer onto the path: walk the SVG
`<path>` with `getTotalLength()` / `getPointAtLength()` (the path element is
already in the DOM, `MotionPathTarget.vue:20`), find the nearest length, set
`offset-distance = len/total`. Drive it through a `ManualTimeline` (the engine's
caller-driven progress primitive — `src/animation/timeline.ts`, "set raw value,
get immediate result") so the drag feeds the SAME pipeline the ribbon scrub does
(one progress source, DRY). Release → resume autoplay. This dogfoods
`ManualTimeline` the way the cube dogfoods `AnimationGroup`.
**Falsifiable instrument:** `proof:motionpath-drag` — a test that a pointer near
the path sets `offset-distance` to the projected length ratio (±tolerance);
visual lock on the traveller tracking the cursor along the curve.

---

### H-MI-4 — `sequence`: only the master playhead is grabbable; children are spectators · **disposition: SHIP-in-H (medium)**
**Anchor:** `SequenceTarget.vue:46-63` (master scrub is interactive) vs.
`:19-38` (per-row balls are engine-painted via `--ball-p`, NO per-row handles).
The transport buttons (`:68-106`) are good but indirect.

The sequence's *point* is per-child stagger offsets along one clock — the most
interesting thing to manipulate is each child's `at` (its position in the
storyboard), which is currently fixed.

**Gestalt fix:** make each row's start marker draggable to re-time that child
(drag the `@{at}ms` marker → adjust the child's stagger offset and rebuild the
`Sequence` distribution). The engine already exposes the transport/scrub
(`demo.scrub`, `demo.childAnims`); re-timing is the same kind of write. Lower
priority than H-MI-2/3 because the master scrubber already gives a real handle —
this is *enrichment* toward the cube's depth, not a first handle.
**Falsifiable instrument:** `proof:sequence-retime` — dragging a row marker
changes that child's `at`, the master timeline re-derives, and the ordering holds;
visual lock on a row's ball schedule shifting under marker drag.

---

### H-MI-5 — `spring` is the model citizen; one parity gap · **disposition: RECORD (mostly ALREADY-SOTA)**
**Anchor:** `SpringTarget.vue:31-32` (drag/tap rail re-seats target),
`:93-108` (pointer capture + window move/up), `:110-124` (arrow/Home/End keys),
`useSpringDemo.ts:167-178` (`reseat`/`toggleTarget`). This is the closest flat
scene to the cube's standard and it dogfoods `SpringProgress` properly.

Honest ALREADY-SOTA for the lane. **One gap:** the rail uses bare
`@pointerdown`/window listeners (`SpringTarget.vue:93,101`) rather than the
glass-ui `Slider` the easing scene adopted (`EasingTarget.vue:43`). Not a defect
(it has keyboard a11y via `role=slider`+`tabindex`, `:25-32`), but a DRY note:
if a shared "drag-a-ball-on-a-rail" primitive is extracted (see H-MI-6), spring
should consume it too. **Disposition RECORD**, fold into H-MI-6 if that lands.

---

### H-MI-6 — DRY: three scenes hand-roll the same rail/drag dance · **disposition: MEASURE-FIRST → BOOK**
**Anchor:** near-identical pointer/drag blocks in
`SpringTarget.vue:84-124`, `SequenceTarget.vue:151-189`, and the would-be
motion-path handler (H-MI-3). Each re-implements: rect → ratio, pointer capture,
window move/up, arrow/Home/End keys.

The cube's gestures are already factored into composables
(`orbital-drag/composables/useOrbitalPointer|Pinch|Inertia`). The flat scenes
have NO such shared seam — each rolls its own. A `useRailScrub` /
`useDragScrub(el, { onScrub, keys })` composable would collapse three copies into
one (KISS, DRY), and motion-path's path-projection variant could compose over it.
**MEASURE-FIRST:** confirm the three blocks are genuinely the same shape before
extracting (don't over-abstract two-line handlers). If three+ real consumers,
BOOK the extraction for an H follow-up.
**Falsifiable instrument:** a single `useDragScrub` unit test exercised by all
consumers; line-count delta as the proof the duplication collapsed.

---

### H-MI-7 — Interactivity is moot until scenes hold their route (D12 dependency) · **disposition: RECORD (blocking note)**
**Anchor:** live — navigating to `/#/square` bounced to `#/?anim=Rotations`
(home). A drag model on a stage that doesn't mount is dead code.

D11 (this lane) is DOWNSTREAM of D12 (scene-state machine). Every interaction
proposal here assumes the scene mounts and retains state across switches. Flag
for the synthesis: **gate D11 visual locks behind the D12 state-machine fix** —
otherwise `proof:*-drag` tests will flake on the routing corruption, not on the
interaction logic. Cross-ref lanes `a-state-machine` / scene-state.

---

## Summary of dispositions

| ID | Scene | Disposition | One-line fix |
|----|-------|-------------|--------------|
| H-MI-1 | square | KILL (rec) / else SHIP rebuild | drag the box, SpringProgress chases — or remove it |
| H-MI-2 | easing | SHIP-in-H | promote the existing draggable `EasingCurveCanvas` to the stage |
| H-MI-3 | motion-path | SHIP-in-H | drag traveller along its path via `getPointAtLength` + `ManualTimeline` |
| H-MI-4 | sequence | SHIP-in-H (med) | draggable per-row start markers re-time children |
| H-MI-5 | spring | RECORD (ALREADY-SOTA) | parity gap only; fold into H-MI-6 |
| H-MI-6 | shared | MEASURE-FIRST → BOOK | extract `useDragScrub` if 3+ true consumers |
| H-MI-7 | all | RECORD (blocking) | D11 locks gate behind the D12 state machine |

**Two reusable direct-manipulation primitives already EXIST and are
under-used:** `OrbitalDrag` (cube) and `EasingCurveCanvas` (sidebar-only). The
cheapest, most idiomatic wins (H-MI-2) are pure REUSE of what's already built,
not new gesture code. The engine offers the right dogfood seams for the rest:
`ManualTimeline` (motion-path drag), `SpringProgress` (square drag),
`Sequence` re-time (sequence markers).
