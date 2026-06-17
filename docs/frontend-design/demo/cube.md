# Cube Scene — frontend-design treatment

> Scope: the cube scene only — `demo/app/scenes/CubeScene.vue`, `demo/cube/CubeTarget.vue`,
> `demo/cube/useCubeAnimations.ts`, the orbital-drag input layer, the matrix editor.
> A design PROPOSAL. No source is written outside this doc.

---

## §Aesthetic direction

**The bold POV: "Drafting-table instrument, not a toy block."** This page is the one
scene where keyframes.js shows you raw geometry — a six-faced die suspended over an
engineer's graph-paper field, with three colored axis lines impaling it and a 4×4
matrix you can edit cell-by-cell. The current cube is a **crayon-box plaything**:
six saturated primaries (`rgba(255,0,0,0.8)` … `rgba(0,255,255,0.8)`), flat fills, a
spinning loader, numbers 1–6. That reads like a CSS-transform tutorial from 2014. The
SOTA bar for a CSS-animation engine's hero artifact is an **instrument** — a precision
object that feels machined, lit, and physically inertial, the way a Linear keyboard
or a Rive editor object feels. The aesthetic is **technical-luxe / orthographic
drafting**: the muted scientific palette the rest of the scene already speaks (the
axis-x/y/z HSL tokens, the graph-paper substrate, Instrument Serif), pushed onto the
cube faces themselves, plus **directional lighting that obeys the drag** so the cube is
clearly a *solid in a lit room*, not six stickers.

**The ONE unforgettable thing:** as you orbit the cube, the **light stays fixed in the
room** — faces turning toward the key light brighten and pick up a specular sheen,
faces turning away fall into shadow, and the colored axis lines cast a faint chromatic
bloom onto the nearest faces. The die isn't recolored on drag; it's *re-lit*. You feel
the mass of a real object turning under a studio lamp. Nothing else in the demo owns
this — the cube is the only true 3D subject, so it alone gets per-face lighting that
tracks orientation. That is the page's signature, and it is *dogfood*: the brightness
ramp is itself a keyframe-driven `rotate`-coupled interpolation.

---

## §Current-state audit

What reads generic / weak / AI-slop against the SOTA bar:

1. **The six faces are saturated CRT primaries — the single worst offender.**
   `CubeTarget.vue:124-130` hardcodes `rgba(255,0,0,0.8)`, `rgba(0,255,0,0.8)`,
   `rgba(0,0,255,0.8)`, `rgba(255,255,0,0.8)`, `rgba(255,0,255,0.8)`,
   `rgba(0,255,255,0.8)`. This is the literal RGB/CMY color wheel at full saturation —
   the "rainbow primaries on a cube" cliché. Worse, it is **incoherent with the scene's
   own refined palette**: the axis lines six lines below render in calibrated HSL
   (`--axis-x: hsl(0 72% 54%)`, `--axis-y: hsl(120 47% 47%)`, `--axis-z: hsl(240 76% 58%)`,
   `style.css:341-344`) and the matrix-editor cells color their labels by those same
   axis tokens (`MatrixEditor.vue:142-158`). The faces ignore the tokens entirely. The
   die and its own axis frame don't share a palette — a coherence break the rest of the
   demo would never ship.

2. **The faces are FLAT — zero material, zero lighting.** Each face is a single
   `backgroundColor` fill (`CubeTarget.vue:68-70`) behind a number. A real 3D solid
   under any light has per-face luminance variation; this cube has none, so it never
   stops looking like six divs taped into a box. There is `backface-visibility: hidden`
   (`:260`) but no `box-shadow`, no gradient, no border, no specular — no depth cues
   beyond the bare perspective transform.

3. **The number glyphs are the only typography, and they're an afterthought.**
   `text-display-2` numerals 1–6 (`CubeTarget.vue:74-77`) centered on each face. Instrument
   Serif numerals at display size on a flat primary fill — they read as a child's
   block, not as instrument markings. There is no face *labeling system* (no axis name,
   no orientation readout) that would make this feel like a measurement device.

4. **The drag is physically excellent but visually MUTE.** The orbital-drag layer is
   genuinely SOTA under the hood — a quaternion source-of-truth (`OrbitalDrag.vue:71`),
   EMA-smoothed angular velocity (`:127-129`), and an *analytic closed-form decay*
   glide on release that dogfoods the engine's own `decay()` (`useOrbitalInertia.ts:11,73`).
   But none of that physics is *expressed visually*. There's no motion blur, no
   velocity-coupled glow, no grab-cursor feedback beyond `cursor: move`
   (`OrbitalDrag.vue:330`), no "I am holding a heavy object" affordance. The best physics
   in the whole demo is invisible.

5. **The idle state is a generic spinner + a bob.** When idle the cube shows a
   `Loader2` `animate-spin` (`CubeTarget.vue:32-34`) — the universal "loading…" glyph,
   the most generic motion possible — and an `idle-bob` 5px translate (`:222-229`). A
   precision instrument at rest should breathe with intent (a slow signature
   orientation drift), not display a throbber.

6. **The axis lines are hairline dashes that vanish.** `1px dashed`, `opacity: 0.75`
   (`CubeTarget.vue:288-298`), infinite-width (`1000vw`). They carry the *correct* axis
   colors but are visually thin and never interact with the cube — no glow at the
   origin, no fade with distance, no tick marks. A drafting instrument's axes should be
   the second-most-confident graphic on the stage.

7. **The matrix editor is a competent form, not a control surface.** `MatrixEditor.vue`
   is a clean 4×4 grid of inputs (`:4-68`) with axis-colored labels at `opacity-20`
   (`:48-51`) and a single slider. It works, but the active cell only goes `font-bold`
   (`:20-22`) — there's no visual *link* between the cell you're editing and the cube's
   corresponding transform, no sense that this grid IS the cube's brain. The label
   opacity (20% light / 75% dark) makes the axis colors nearly invisible in light mode.

What is ALREADY at the bar and must be preserved: the quaternion/inertia physics
core, the axis-color token system, the graph-paper substrate (`--graph-pitch`/`--graph-major`),
the cartoon+quiet glass control register, the ppmycota easter-egg + the double-click
"roll" (`CubeTarget.vue:167-194`), Instrument Serif + Fira Code, the reduced-motion gates.

---

## §Refinements

Every change extends the existing token system — no wholesale swap. New tokens are
proposed as additions to the demo-owned layers (`design-idioms.css` / `style.css :root`),
consumed by the scene, exactly as the axis/rainbow/graph families already are.

### TYPOGRAPHY

- **Face markings become instrument labels, not block numbers.** Keep the Instrument
  Serif numeral but demote it and *pair* it with a Fira Code orientation tag. Replace
  the lone `text-display-2` (`CubeTarget.vue:74-77`) with a two-part stamp per face: the
  big serif numeral at ~40% face-size, top-left aligned (not centered), plus a small
  `font-mono` axis tag bottom-right reading the face's axis+sign — e.g. `+X` on front,
  `−Z` on back — in the matching axis color at `--type-mono-caption`. This is the
  drafting-stamp convention: a large index + a small coordinate annotation. The serif/mono
  pairing is the demo's established voice; here it earns the cube the "measured object"
  read. Anchor the numeral with `font-feature-settings: "tnum"` so it sits like a gauge
  figure.
- **A persistent orientation readout** in a `font-mono` `text-mono-caption` chip,
  bottom-left of the stage (new, small): live `rx ry rz` Euler degrees from
  `model.value.rotate` (already computed, `OrbitalDrag.vue:80-88`), wearing
  `.readout-accent`. "The number that proves the engine runs carries the colour"
  (`design-idioms.css:558`) — this scene's readout is the *attitude* of the die.

### COLOR

- **Repaint the six faces from the axis-token family — the headline fix.** The cube has
  three axis pairs (front/back = ±Z, left/right = ±X, top/bottom = ±Y per the face
  transforms at `CubeTarget.vue:267-284`). Color each *opposite pair* by its axis token,
  the bright member at full token chroma and the back member at a darkened
  `color-mix(… 70% black)` variant. Add **three new demo tokens** beside the axis set in
  `style.css :root` (mirroring how `--axis-w` derives from `--foreground`):
  ```
  --face-x: var(--axis-x);              /* left/right → red family   */
  --face-y: var(--axis-y);              /* top/bottom → green family  */
  --face-z: var(--axis-z);              /* front/back → blue family   */
  --face-back-mix: 32%;                 /* the far-member darken ratio */
  ```
  Faces become `color-mix(in oklab, var(--face-z), var(--background) var(--face-back-mix))`
  for the back, full `--face-z` for the front, etc. — replacing the raw rgba literals at
  `CubeTarget.vue:124-130` with a `style="background: var(--face-bg)"` driven by a
  per-side `--face-bg` token. Result: the die, the axis lines, and the matrix labels
  finally speak ONE palette. The scientific HSL set (72%/47%/76% sat) is muted and
  premium where the old `255,0,0` is garish.
- **Per-face lighting tint** is the magic layer (see MOTION): a single inset
  `linear-gradient` overlay per face whose stop positions/alpha are driven by one CSS
  custom property `--lit` (0…1) the orbital-drag layer publishes per face from the
  face-normal · light-direction dot product. Light faces lift toward white at low alpha;
  shadowed faces deepen with a `color-mix(… --background)` veil. No new color identity —
  it's a luminance modulation OVER the axis palette.

### MOTION

- **Orientation-coupled lighting (the signature).** Compute, per face, `dot(faceNormal,
  keyLight)` from `currentQuaternion`. The six face normals are constants; the key light
  is a fixed world vector (e.g. up-and-right `(0.4, 0.7, 0.6)`). Publish each face's
  clamped dot as `--lit` on that face element on every rotation tick (the same place
  `syncRotationToModel` runs, `OrbitalDrag.vue:80`). A face's `--face-overlay`
  gradient + a faint `box-shadow` spread both read `--lit`, so faces brighten/dull as
  they turn — **lighting fixed in the room, cube turning under it.** This is keyframe-
  adjacent interpolation; it dogfoods the engine's value-coupling story without a second
  rAF loop (it rides the existing rotation sync).
- **Velocity-coupled atmosphere on drag.** The angular speed already exists
  (`angularVelocitySpeed`, `OrbitalDrag.vue:75`). Map it to a stage-level
  `--spin-energy` (0…1) and use it to (a) lift a faint radial bloom behind the cube and
  (b) drive a `filter: drop-shadow` that grows with speed — a cheap "motion presence"
  that decays exactly with the analytic inertia, so the bloom bleeds off in lockstep
  with the glide (`useOrbitalInertia.ts:73`). Compositor-only (opacity/filter).
- **Replace the idle spinner with a signature drift.** Drop `Loader2 animate-spin`
  (`CubeTarget.vue:32-34`); when idle and un-started, run a slow engine-driven
  `CSSKeyframesAnimation` that orbits the die ~8° on a Lissajous-ish two-axis path over
  ~12s on the `--spring-smooth` curve — a "breathing attitude" that shows the object is
  alive and *shows off the engine* instead of a throbber. Keep `idle-bob` but couple its
  amplitude to `--spin-energy` so it stills while the user drags.
- **Grab feedback.** On `pointerdown` add a `.cube--grabbed` class that does an instant
  `scale(0.98)` + shadow-deepen and swaps `cursor: grabbing`; release springs back on
  `--spring-smooth`. The "I picked up a heavy thing" micro-beat the SOTA bar expects,
  and the press-scale lesson from the J tranche (pointerdown swallow) is respected by
  keeping it CSS-class-driven, not intercepting the gesture.

### SPATIAL

- **Break the dead-center symmetry.** The cube currently centers perfectly in the stage
  cell. Park it on the **golden optical center** the layout already computes
  (`--work-area-vertical-bias-top: 0.382`, `style.css:190`) and let the three axis lines
  extend asymmetrically — the +X/+Y/+Z arms longer and brighter than the negatives, so
  the frame reads as a *coordinate origin*, not a plus-sign. The stage is intentionally
  generous negative space (drafting-table emptiness); the cube + its axis frame is the
  single confident object in it.
- **Tighten the matrix editor into a "control panel" altitude.** Keep the cartoon+quiet
  Card (`MatrixEditor.vue:2`) but raise the active cell: when a cell is selected
  (`:18-23`) give it a ring in its axis color + a subtle inset, and draw a hairline
  connector cue (a colored top-border on the matrix Card matching the selected cell's
  axis) so the grid visibly "owns" an axis of the cube. Lift the label opacity floor in
  light mode from `opacity-20` (`:48-51`) to ~`opacity-45` so the axis colors actually
  register.

### MICRO-INTERACTIONS

- **Face hover spotlight (desktop, fine pointer only):** hovering the cube lifts that
  face's `--lit` toward 1 with a short `--spring-smooth` transition — the face you point
  at catches the light, a "the instrument responds to attention" beat. Suppressed on
  coarse pointers and under reduced-motion.
- **Matrix cell ↔ cube echo:** when you edit a matrix cell, briefly pulse the
  corresponding face(s)' `--lit` (a 200ms flash) so the causal link between the grid and
  the geometry is *felt*, not inferred.
- **Roll easter-egg upgrade:** the double-click roll (`CubeTarget.vue:167-194`) already
  uses `ease-out-back`; on landing, flash `--spin-energy` to 1 and let the bloom decay,
  so the die visibly "thunks" onto its face. Pure additive on the existing animation.

### BACKGROUND

- **Deepen the substrate behind the cube only.** Keep the global graph-paper field
  (`--graph-pitch`/`--graph-major`, `design-idioms.css:268-271`) but add a single
  large, very-soft radial vignette centered on the cube (a stage-local pseudo-element,
  not the page field) that darkens the corners ~6–8% and warms the center — a "studio
  pool of light" the lit cube sits in. This is the atmospheric depth the SOTA bar wants;
  it reads as a lamp pool, reinforcing the lighting story. Gated to the cube stage so it
  never touches other scenes' fields (respecting the `--stage-field-tint` "amplify in the
  stage region only" rule, `design-idioms.css:568`).
- **Axis-origin bloom:** a tiny soft glow at the world origin where the three axis lines
  cross — the brightest point on the field — so the eye reads the coordinate frame's
  center. Colored by `color-mix` of the three axis tokens.

---

## §The one unforgettable moment

**The re-lit die.** Grab the cube and orbit it. The light does not move — it's pinned to
the upper-right of the room. As each face rotates toward that light it *brightens and
catches a thin specular highlight*; as it turns away it sinks into a `--background`-tinted
shadow. The colored axis lines bleed a faint chromatic glow onto the faces nearest them.
You are not spinning six colored stickers — you are turning a **machined solid under a
studio lamp**, and you can feel its mass because the release-glide (the engine's analytic
`decay()`) carries the lighting sweep with it: the die coasts to rest and the highlights
slide across the faces and settle. No other page in the demo has a true 3D subject, so no
other page can own per-face orientation-lighting. It is the cube scene's alone, and it is
the engine dogfooding its own value-interpolation on the most physical object in the app.

---

## §Implementation plan

Priority order — each step is self-contained and shippable.

1. **Repaint faces from axis tokens** *(highest impact, lowest risk)*
   `style.css :root` — add `--face-x/y/z` (= axis tokens) + `--face-back-mix`.
   `CubeTarget.vue:123-130` — replace the six rgba literals with per-side `--face-bg`
   computed from the axis family (front=full, back=darkened mix), keyed by axis pair.
   `CubeTarget.vue:68-70` — bind `background: var(--face-bg)`. Kills the crayon palette,
   unifies the die with its axis frame + matrix labels. No physics touched.

2. **Per-face material** *(depth, still static)*
   `CubeTarget.vue` scoped style — add to `.cube-side`: a 1px inset border in a
   `color-mix(… white 25%)` of the face color, a soft `box-shadow`, and an inset
   `--face-overlay` gradient layer (the `--lit`-ready overlay, initially neutral). Faces
   stop looking like flat divs.

3. **Orientation-coupled lighting** *(the signature)*
   `OrbitalDrag.vue` — in/after `syncRotationToModel` (`:80`), compute each face normal ·
   key-light from `currentQuaternion`, write clamped `--lit` to each face element (pass
   face element refs in, or have CubeTarget subscribe to the rotate model and compute it
   locally — prefer the latter to keep OrbitalDrag generic). `CubeTarget.vue` scoped style
   — bind `--face-overlay` alpha + `box-shadow` to `--lit`. Add the fixed key-light vector
   + the six constant normals as a small module constant.

4. **Velocity atmosphere + grab feedback**
   `CubeTarget.vue` — publish `--spin-energy` from `angularVelocitySpeed` (subscribe via
   the existing rotate sync), drive a stage radial bloom + `drop-shadow`. Add
   `.cube--grabbed` (scale 0.98 + `cursor: grabbing`) on pointerdown/up. All compositor-
   only, all reduced-motion-gated.

5. **Idle drift replaces the spinner**
   `CubeTarget.vue:32-34` — remove `Loader2`; `useCubeAnimations.ts` or a small local
   `CSSKeyframesAnimation` — add the ~12s two-axis idle orbit on `--spring-smooth`, gated
   on `!isStarted && !isPlaying` and `prefers-reduced-motion: no-preference`.

6. **Background lamp pool + axis-origin bloom**
   `CubeScene.vue` / `CubeTarget.vue` stage root — add a stage-local radial vignette
   pseudo-element + the origin glow at the axis crossing (`CubeTarget.vue:95-97` region).
   Scoped to the cube stage only.

7. **Face markings → drafting stamps**
   `CubeTarget.vue:62-89` — restructure the face content into the serif-numeral +
   mono-axis-tag stamp; add the bottom-left stage orientation readout (`.readout-accent`,
   live Euler from the model).

8. **Matrix editor control-panel polish + cell↔cube echo**
   `MatrixEditor.vue:14-66` — active-cell axis-color ring + raised label opacity floor +
   selected-axis top-border on the Card; wire the 200ms `--lit` flash on cell edit
   (emit/prop into the cube's lighting layer).

Tokens touched: `style.css :root` (`--face-*`), `design-idioms.css` (optional
`--lamp-*`/`--spin-energy` defaults). Components touched, in order:
`demo/cube/CubeTarget.vue`, `demo/@/components/custom/orbital-drag/OrbitalDrag.vue`
(read-only consume of `currentQuaternion`), `demo/cube/useCubeAnimations.ts`,
`demo/@/components/custom/matrix-editor/MatrixEditor.vue`, `demo/app/scenes/CubeScene.vue`.
No glass-ui patching (all changes ride demo-owned token layers + scoped styles, per inv-16).
