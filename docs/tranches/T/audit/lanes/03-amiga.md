# Lane 03 — amiga (VERDICT #8, #9 · shot 08) — DESIGN LANE

> Probed live against the dev server (http://localhost:5180/#/amiga, the current
> `tranche-s-impl` tree) with a playwright instrument that reads the Three.js
> mesh through the dev-build component instance while driving REAL pointer
> input. All evidence in `shots-03-amiga/` (screenshots + `probe-data.json` +
> the two re-runnable probes `amiga-probe.mjs` / `amiga-probe2.mjs`,
> `KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/glass-ui node …`).

## The headline measurement

**The Boing Ball vanishes during its own signature animation.** Spin the sphere
(drag → release, the decay() glide), then double-tap: the ball disappears from
the stage for the glide-overlap window (~2.7s of the 4.2s arc), reappears
mid-arc with the user's spin pose discarded, wobbles less than half its own
radius, then teleports back to center when a `setTimeout` chops the infinite
group. That IS VERDICT #9 — "a broken mess and does not properly interleave and
stack animations" — reproduced, quantified, and root-caused below.

| Evidence | File |
|---|---|
| Rest state (legend + parked telemetry + CRT haze) | `shots-03-amiga/rest-1440.png` |
| Mid-boing after a spin: **the ball is GONE** | `shots-03-amiga/mid-boing-1440.png` |
| Post-chop: ball teleported home | `shots-03-amiga/post-chop-1440.png` |
| Control (boing with NO prior spin): ball visible, barely displaced | `shots-03-amiga/pure-boing-1440.png` |
| Mobile 390: sheet occludes stage bottom + telemetry; dock is a blur-blob | `shots-03-amiga/rest-390.png` |
| Raw per-frame samples + stacking census | `shots-03-amiga/probe-data.json` |

## Findings

### F1 — The engine's transform channel hands consumers ARRAY-BOXED internal types; a second writer NaNs the Euler and the ball vanishes

**Measured.** During the boing, 97/98 sampled frames carry a corrupted
`sphere.rotation`:

- `rotation.x` = `[{ value: 0, subProperty: "x", property: "rotation" }]` — a
  ValueUnit ARRAY assigned raw into `THREE.Euler`;
- `rotation.y` = `"0.0000185605266880201470.013691394016406705"` — a STRING:
  the group assigned an array-boxed value, then the spin glide's
  `mesh.rotation.y += …` (useSphereSpin.ts:210) string-concatenated onto it.
  Two decimal points → `Number()` = NaN → NaN quaternion → **the mesh is not
  rasterized** (`mid-boing-1440.png`: the room renders, the ball does not).

**Control experiment** (`amiga-probe2.mjs`): a pure double-tap boing with no
prior glide → leaves are still array-boxed `object`s, but single-element-array
JS coercion (`[VU]` → `"0.0135"` → number) happens to produce finite quaternions
(0 NaN frames of 99) — the ball renders **by accident of ToPrimitive**. The
contract only detonates when a second writer composes (`+=`), which is exactly
what "interleave and stack" means.

**Root cause chain (file:line):**

1. `src/animation/compile/frame-compiler.ts:403-410` — `finalizeFrameVars`
   builds `flatVars: Record<string, ValueUnit[]>` and
   `frame.vars = unflattenObject(frame.flatVars)`.
2. value.js 2.0.1 `unflattenObject(flatObj: Record<string, any[]>)`
   (`node_modules/@mkbabb/value.js/dist/units/utils.d.ts:29`) — leaves stay
   ARRAY-boxed (verified in isolation: `unflattenObject(flattenObject({rotation:
   {x:1.5}})).rotation.x` is a one-element array object, not `1.5`). The S-era
   value.js-2.0.x consume-edge (S.C4/S2) made this the transform channel's leaf
   shape.
3. `src/animation/engine/interpolate.ts:285` —
   `frame.transform(anim.unflatten ? frame.vars : frame.flatVars, t)` hands the
   boxed tree straight to the consumer.
4. `demo/scenes/amiga/useAmigaDemo.ts:42-56` —
   `Object.assign(sphereMesh.rotation, vars.rotation)` writes the boxes into
   `THREE.Euler`; `useSphereSpin.ts:203/210` then does numeric `+=` on the
   poisoned members.

This is not a demo bug to patch around — it is the library's headline contract
("animate any object or DOM element") delivering internal box types at the
"anything in JavaScript" seam. Any non-DOM consumer that composes writers hits
it.

**T-shape:** the transform channel delivers PLAIN authored-shaped values —
numbers where the author wrote numbers, strings where units/colors demand them.
One unboxing projection at the compile seam (a `plainVars` sibling written by
the same interp stride that fills `value.value`, so the hot path stays
zero-alloc), `frame.transform` consumes it. No demo-side coercion, no
`singleTarget` dodges.

### F2 — Nothing actually interleaves: the flagship AnimationGroup scene bypasses the group compositor, so writers race last-wins

- `demo/scenes/amiga/useAmigaDemo.ts:167-169` — `animationGroup.singleTarget =
  false` with the confession: *"Force per-animation transform path — the grouped
  path passes flat ValueUnit values which don't match the nested object
  structure our transform expects."* The demo's AnimationGroup showcase opts OUT
  of the SoA layer compositor (`group/soa.ts`, replace/add/weighted — the
  engine's marquee blending feature) because the group path's var shape is
  unconsumable (same F1 root).
- **Pose discard, measured:** user spins the ball to `rotation.y = 1.114`;
  one frame into the boing the group's `Object.assign` stomps it to `"0"`
  (probe delta `-1.1007` at t≈265ms). The gesture and the animation do not
  stack — the animation replaces the gesture.
- The spin glide and the group then fight per-frame for the rest of the overlap
  (61 frames in the run) — the F1 corruption is the race's terminal form.

**T-shape:** amiga becomes THE compositor showcase it was always meant to be:
spin / bounceX / bounceY as GROUP LAYERS composited through the singleTarget
SoA path onto one plain-vars target adapter, and the user's drag/decay spin
joins as an **additive layer** (weight 1, `add` blend) — gesture and animation
compose by construction, no second writer on the mesh, ever. The
`singleTarget = false` line and the transform-per-animation workaround die.

### F3 — The boing is an amputated easter egg: infinite group + setTimeout chop + one-frame teleport home

- `AmigaScene.vue:176-185` — `boingTimer = setTimeout(…, 4200)` stops the
  infinite group and hard-snaps `position.set(HOME…)` +
  `rotation.set(0,0,0)`. **Measured teleport:** last boing frame at
  `(-0.47, 0.10, 0.36)` → `(0,0,0)` in one frame (`teleportDelta 0.61` world
  units, ~0.6 ball-radii of instantaneous jump; `post-chop-1440.png`).
- `useAmigaBoot.ts:47-57` duplicates the same chop at 3000ms for the re-entry
  boot egg.
- `useDoubleTap` is mounted on the WHOLE canvas (`AmigaScene.vue:118-121`), so a
  double-click on empty background (the orbit surface) also fires the boing —
  the probe itself exploited this.

**Root design gap:** the scene's MAIN animation was demoted to a hidden egg, so
it must be guillotined by a timer. The 1984 Boing demo's entire identity is the
ball bouncing FOREVER.

**T-shape (the gestalt inversion):** the Boing IS the scene. The dock transport
plays the group continuously (cold-entry contract intact — human presses play);
there is no chop, no timer, no teleport. Stop settles the ball home through a
short spring re-seat (the engine's own SpringProgress), never `position.set`.
The boot egg, the visited-flag sessionStorage machinery, and the
`bootedOnce` IntersectionObserver re-arm dance (`AmigaScene.vue:199-263`) all
die with the egg framing.

### F4 — The bounce is visually dead: authored ±5 crushed to ±0.42

- **Measured envelope during play:** `py ∈ [-0.422, +0.422]`, `pz` same,
  `px ∈ [-1.10, +1.10]` — for a ball of RADIUS 1. The vertical "wall-slam arc"
  moves the ball less than half its own radius; `pure-boing-1440.png` vs
  `rest-1440.png` shows a displacement of a few dozen pixels.
- Root cause: `useAmigaThree.ts:42` `BOUNCE_FIT_MARGIN = 0.35` × the
  frustum-fit solver (`refreshBounceFraming`, :88-114) scales the authored
  `BOUNCE = 5` by 0.084 (y/z) / 0.22 (x). The camera frames the REST pose
  (protagonist reframe) and the solver then crushes the PLAY envelope into that
  frustum — the equation optimized "stay in frame" and deleted the animation.

**T-shape:** frame the ROOM, not the rest pose — then delete the entire fit
apparatus (`refreshBounceFraming`, `BounceScale`, the `getBounceScale` seam,
`BOUNCE_FIT_MARGIN`). Author the true arc inside the room: Y slams
floor-to-upper-third with gravity easing (fast at the floor, floating at the
apex), X sweeps wall-to-wall (~4s per crossing), **Z motion dies** — the
original Boing is planar motion in a 3D room, and flattening Z is both more
authentic and calmer. Spin: the ball carries the authentic ~16° static Z-tilt
and rotates LINEARLY about its tilted axis (today: all three axes 0→2π over 20s
under a cubic-bezier — a chaotic eased tumble, `useAmigaDemo.ts:73-95`), with
spin sign flipping when X reverses at a wall.

### F5 — Owner rulings applied: the gesture legend dies; the CRT pastiche, boot egg, flick threshold, and spin-bloom go with it

- **VERDICT #8 is a RULING:** `GestureLegend` usage (`AmigaScene.vue:25-32`,
  shot 08) is removed. Discoverability is carried by the dock transport +
  `cursor: grab` — not by stage-mounted instruction text.
- **Stacking incoherence, measured:** DOM order is canvas → legend → crt-overlay
  → telemetry, all at `z-index: 10` (`--z-content`) — so the CRT scanline
  (multiply) + vignette layers composite OVER the legend but UNDER the
  telemetry. Shot 08's muddy legend is literally the atmosphere layer sitting
  on top of it.
- The CRT stack (`AmigaCrtOverlay.vue`, 125L: scanlines + grille + vignette +
  flash, mix-blend multiply/overlay over a live WebGL canvas) is the very haze
  that turns the stage into the gray-purple slab visible in every shot — the
  "latent red theme" deadness on this surface — and it is compositing cost paid
  every frame (F7). It exists to serve two eggs the redesign removes.
- Dependents that die with it: `useAmigaBoot.ts` (65L), `spinBloom` +
  `FLICK_BOING_RAD_S` machinery (`useSphereSpin.ts:53-68, 177-184`,
  `AmigaScene.vue:146-165` bloom integration), the `.amiga-canvas--power-on`
  marker, the sessionStorage visited flag.

### F6 — Dishonest telemetry: a permanently parked "ω 0.00 rad/s", occluded on mobile, hand-rolled

- `rest-1440.png`: the readout shows `ω 0.00 rad/s` forever at rest — an
  instrument displaying the absence of a measurement (same species as the
  removed easing curve-physics readout, VERDICT #13).
- `rest-390.png`: on mobile the bottom sheet covers the stage's lower band —
  the bottom-left telemetry is unreachable exactly when shown.
- `AmigaTelemetry.vue:46-102` hand-rolls what glass-ui 4.0.1 ships:
  `metric-badge` (value/unit/label), `animated-digit` (damped tabular numerals)
  — censused in `node_modules/@mkbabb/glass-ui/dist/components/custom/`.

**T-shape:** ONE transient glass-ui `MetricBadge` (`value` = ω via
`AnimatedDigit` formatting, `unit` "rad/s", size `sm`), top-right of the stage
(survives the mobile sheet), mounted only while `|ω| > 0.05 rad/s` and fading
at rest. It appears when you spin, witnesses the decay() coast, and leaves.
`AmigaTelemetry.vue` dies.

### F7 — Performance: ~34fps mean on a fast macOS; the present loop renders every frame at rest, forever

- **Measured cadence** during the probe: mean inter-frame 29.8ms (~34fps),
  worst 91.8ms (dev server, M-series Mac) — VERDICT #19 corroborated on this
  surface.
- `useAmigaThree.ts:200-212` — `present.loop(() => { …render…; return true; })`
  unconditionally: the WebGL room renders 60 times a second while NOTHING moves
  (the scene at rest is a static image). The CRT blend stack (F5) taxes the
  compositor on top.

**T-shape:** render-on-demand — render when (OrbitControls fired `change` ||
group playing || glide live || re-seat spring live), else skip the
`renderer.render` while keeping the loop light (or stop it and re-arm on
interaction). With the CRT gone and the room framed statically this makes the
at-rest scene ~free.

### F8 — Panel truth (evidence for the controls lane): the pane lies about the selected animation

`rest-1440.png`: dock selects "Rotations"; the controls pane shows
`5s / 0ms / ∞ / alternate / forwards / ease-in-out`. The actual Rotations
animation (`useAmigaDemo.ts:73-77`) is `20s / cubic-bezier(0.2,0.65,0.6,1) /
normal / infinite`. Only `∞` is true — the pane renders store defaults, not the
live animation's options. Logged here as amiga-side evidence; the cure belongs
to the controls/panel lane (VERDICT #25's facility must be TRUE, not just
present).

## The TARGET design — "the 1984 demo restaged on the site's own drafting paper"

One coherent direction, glass-ui-first, zero stage text:

- **Stage.** A full-bleed `rounded-card` glass slab (keep the 1px inset border
  hairline). The gray Lambert box DIES. The room's floor and back wall are
  drawn as the demo's own paper-grid: grid lines in the site's grid-line token
  over the theme background (light: warm paper + faint red-tinged grid — the
  page's own substrate continued in perspective; dark: deep neutral + dim
  grid). The stage stops being a foreign gray room and becomes the page itself,
  folded into 3D — which is also exactly what the original Boing demo looked
  like (the magenta wireframe grid). Renderer stays `alpha: true` over the
  themed backdrop.
- **Subject.** The checker ball exactly as tessellated (`--amiga-red`/white,
  specular kept), plus the authentic ~16° Z-tilt. A soft radial-gradient
  contact-shadow blob on the grid floor tracks the ball's x, scales and fades
  with bounce height — the original demo's iconic fake shadow, and the cue that
  sells the arc's altitude.
- **Motion.** Three group layers on one plain-vars target: Y slam
  (gravity-eased, floor to upper third, ~1.4s period), X sweep (wall-to-wall,
  ~4s, linear), spin (linear about the tilted axis, sign follows X direction).
  The user's drag-spin + decay() glide is the fourth, ADDITIVE layer. Dock play
  runs it forever; dock stop spring-settles home. Reduced-motion: rest pose,
  no autoplay (existing contract).
- **Chrome.** Nothing on the stage except the transient ω MetricBadge
  (top-right, only while spinning/gliding). All type belongs to glass-ui
  components (dock, panel) — this surface contributes zero scene-local fonts,
  which is the correct amiga-shaped answer to VERDICT #24.
- **What dies.** GestureLegend usage; AmigaCrtOverlay.vue; useAmigaBoot.ts;
  AmigaTelemetry.vue (→ MetricBadge); the boing/boot timers + teleports; the
  flick-to-boing threshold + spinBloom; the frustum-fit solver +
  BOUNCE_FIT_MARGIN + getBounceScale seam; `singleTarget = false`; bouncingZ;
  the sessionStorage visited flag. Net: the scene sheds ~400L of egg/pastiche
  machinery and gains one texture helper (grid + shadow) — every remaining line
  serves the ball.

## T recommendations

1. **T-AM1 — Plain-vars transform contract (engine).** `frame.transform`
   delivers unboxed authored-shaped values (number/string leaves), via a
   `plainVars` projection written by the same interp stride that fills
   `value.value` (compile/frame-compiler.ts + engine/interpolate.ts:285); kills
   the value.js-2.0.x array-boxed leak at the "animate any object" seam. ·
   Gate: unit — fromVars `{rotation:{x}}` transform receives
   `typeof vars.rotation.x === "number"`; live probe (`amiga-probe.mjs`) — zero
   non-number rotation frames during boing+glide overlap; mid-boing screenshot
   contains the ball. · **M**
2. **T-AM2 — Amiga rides the group compositor; gesture as additive layer
   (group + demo).** singleTarget SoA path over a non-DOM plain-vars target;
   drag/decay spin becomes an `add`-blended layer; `singleTarget = false` and
   the per-animation transform workaround die. · Gate: probe — during
   simultaneous drag + play, rotation stays finite AND the user's spin delta
   accumulates on top of the group value (no pose stomp: pre-gesture pose
   preserved within ε after gesture ends). · **M**
3. **T-AM3 — The Boing IS the scene (demo).** Dock-play runs the group
   continuously; double-tap egg framing, 4200ms/3000ms chops, boot egg, visited
   flag all die; stop settles via spring re-seat. · Gate: probe — no frame-pair
   with position discontinuity > 0.05 world units across play/stop; grep —
   zero `setTimeout` in `scenes/amiga/`. · **M**
4. **T-AM4 — Honest arc: frame the room, delete the fit solver, retune physics
   (demo).** Camera frames the play envelope; `refreshBounceFraming` +
   `BOUNCE_FIT_MARGIN` + `BounceScale` deleted; Y gravity slam, X wall sweep,
   linear tilted-axis spin with wall-flip, Z motion removed. · Gate: probe —
   `max |py| ≥ 2.5 × SPHERE_RADIUS` during play; spin `|dθ/dt|` constant within
   5% between wall hits. · **M**
5. **T-AM5 — Stage strip-down per owner rulings (demo).** GestureLegend usage,
   AmigaCrtOverlay, useAmigaBoot, spinBloom/flick machinery removed; grid-room
   + contact-shadow visuals in. · Gate: DOM census on #/amiga — zero elements
   between canvas and the (one) transient metric badge; screenshot diff shows
   no scanline/vignette layer; `find scenes/amiga` has no CrtOverlay/Boot
   files. · **S**
6. **T-AM6 — Transient telemetry via glass-ui MetricBadge/AnimatedDigit
   (demo).** Top-right, mounts only while `|ω| > 0.05 rad/s`, fades at rest;
   AmigaTelemetry.vue deleted. · Gate: probe — badge absent at rest, present
   within 200ms of a drag, absent ≤ 1s after glide rest; mobile 390 shot shows
   badge unoccluded by the sheet. · **S**
7. **T-AM7 — Render-on-demand present loop (demo, pattern shareable).** Render
   only when controls change / any layer is live; at-rest GPU cost ~0. · Gate:
   probe — `renderer.info.render.frame` stable over 2s at rest; first
   interaction frame renders within 1 rAF; mean inter-frame during play ≤ 17ms
   on the reference Mac. · **S**
8. **T-AM8 — Panel-truth for fromVars scenes (hand-off to the controls lane).**
   The controls pane projects the SELECTED animation's real options (20s /
   cubic-bezier / normal for amiga Rotations), never store defaults. · Gate:
   probe — pane duration text equals `animation.duration` for each amiga
   animation selected. · **S** (amiga evidence; cross-lane ownership)
