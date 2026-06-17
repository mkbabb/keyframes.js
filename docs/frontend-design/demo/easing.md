# Easing Scene — frontend-design treatment

> Scope: the easing scene only — `demo/app/scenes/EasingScene.vue`,
> `demo/easing/EasingSidebar.vue`, `demo/easing/EasingTarget.vue`,
> `demo/easing/EasingHeroStage.vue`, `demo/@/components/custom/EasingCurveCanvas.vue`,
> `demo/@/components/custom/EasingEditor.vue`, `demo/@/components/custom/EasingSelect.vue`,
> the `useEasingDemo` / `useEasingGallery` composables, and the design tokens in
> `demo/@/styles/{style.css,design-idioms.css}`.
> A design PROPOSAL. No source is written outside this doc.

---

## §Aesthetic direction

**The bold POV: "An oscilloscope, not a settings panel."** Every other CSS-easing
demo on the web is a `cubic-bezier.com` clone — a flat curve in a white box, two
handles, a ghost ball that loops on a gray line. That is a *configuration utility*.
This page is the one place keyframes.js shows you the **shape of time itself**, and a
shape-of-time instrument should read like lab equipment: a phosphor trace on a dark
field, a graticule etched behind it, a probe that travels the signal in real time. The
direction is **scientific-instrument / phosphor-CRT**, pushed onto the glass-ui
substrate the demo already speaks — graph-paper field, Instrument Serif posters, Fira
Code readouts — but with the curve promoted from a thin decorative stroke to a **glowing
luminous trace** and the canvas reframed as the screen of a measuring device. The bezier
editor is the hero; the gallery is the band-sweep; the hero ball is the probe riding the
output. Bold accent: the violet `--ppmycota-primary` (`hsl(248 88% 71%)`) stops being a
timid 8% ghost and becomes the **signal color** — a saturated trace with a real bloom,
the way a scope's beam glows against the dark.

**The ONE unforgettable thing:** when you **drag a bezier handle, the curve doesn't just
redraw — it *responds like a live signal*.** The trace flexes under your cursor with a
faint motion-blur smear in the drag direction, the traveling probe-dot re-derives its
height against the new curve every frame, and the graticule behind it pulses a single
quiet tick at the moment of release — the instrument *settling*. You are not editing
four numbers; you are bending a beam of light and watching the readout track it. The
`f(t) = …` value at the top counts in tabular Fira Code as the probe climbs, like a
voltmeter following the trace. Nothing else in the demo owns "you are physically shaping
a luminous signal and the whole instrument answers." That is the page's signature, and
it is *dogfood*: the smear, the settle-tick, and the probe height are all keyframe /
easing-driven interpolation — the engine animating its own measuring surface.

---

## §Current-state audit

What reads generic / weak / AI-slop against the SOTA bar:

1. **The curve is a thin decorative stroke, not a signal — the single biggest miss.**
   `EasingCurveCanvas.vue:335-343` strokes `.bezier-path` at `stroke-width: 0.04` in
   flat `var(--primary)` with `fill: none` and *no glow, no bloom, no depth*. On the
   hero stage the projected curve is even fainter — `EasingHeroStage.vue:143-150`
   renders it at `opacity: 0.08`, a 3px ghost that "barely there"-s the one artifact
   this entire page exists to celebrate. The curve is THE shape of time and it is drawn
   like a hairline in a wireframe. The SOTA bar for a curve-editing instrument (think
   the Rive or After Effects graph editor, or a real scope trace) is a curve with
   **luminance** — a bright core with a falloff halo that reads as emitted light. We
   own a violet brand accent and we're spending it at 8% opacity.

2. **The canvas reads as a generic grid box, not an instrument screen.**
   `EasingCurveCanvas.vue:309-333` draws `.bounding-box` (1px border), three `.grid-line`
   verticals + three horizontals at `opacity: 0.4`, a `.diagonal-ref` dashed line, and
   four 0.055px `.axis-label` glyphs at `opacity: 0.5`. It is a competent, *forgettable*
   graph — the exact chart-junk vocabulary every cubic-bezier clone ships. There's no
   graticule hierarchy (a scope has bold majors + faint minors + a center crosshair), no
   field tint, no vignette, nothing that says "this is a measuring surface." The
   `GlassPanel variant="wash"` wrapper (`:4`) gives it a faint blur plate but the screen
   inside is inert.

3. **The two handles are anonymous dots.** `.control-point.handle`
   (`EasingCurveCanvas.vue:359-367`) is a `fill: var(--foreground)` circle with a
   background-colored stroke; hover just bumps `r` from 0.04 → 0.055 (`:365`). The handle
   *lines* are dashed `--muted-foreground` at `opacity: 0.5` (`:328-333`). For the HERO
   interaction of the page — the thing you grab and bend — there is no tactile identity:
   no accent ring, no grab-affordance glow, no "this is the live control" signal. A
   precision instrument's adjustment knob looks adjustable at rest. These don't.

4. **The traveling dot is a flat fill with `transition: none`.** `.traveling-dot`
   (`EasingCurveCanvas.vue:369-373`) is `fill: var(--primary); opacity: 0.9`. The probe
   that proves the engine is running — the literal dot tracing f(t) up the curve — has no
   glow, no trail, no presence beyond a solid circle. On a scope the beam *is* the bright
   point; here it's the dimmest element on screen.

5. **The hero stage is ~90% empty glass with a ball on a flat line.** `EasingTarget.vue`
   + `EasingHeroStage.vue`: one `.progress-ball` (`--ball-size: 56px`, green
   `--ball-tone: var(--rainbow-violet)`) slides a `.progress-rail` hairline under an 8%
   ghost curve, anchored at the lower third (`pb-12`). The composition is honest but
   *quiet to the point of generic* — a single ball on a single line is the universal
   "loading bar" gestalt. The stage doesn't dramatize that the ball's HEIGHT *is* the
   curve; the ghost curve at 8% can't carry that relationship.

6. **Typography is doing 70% of its job.** The curve name DID lift to `text-display`
   Instrument Serif (`EasingTarget.vue:36-38`) and the readout DID promote to a damped
   `AnimatedDigit` mono (`:40-46`) — both genuinely good, keep them. But the *sidebar*
   (the editor host) is title-less and the readout literal there is a tiny italic
   `text-mono-caption` (`EasingEditor.vue:44-48`) — the `cubic-bezier(.17,.67,.83,.67)`
   string, the most copy-worthy artifact on the page, is rendered as a faint footnote.
   The axis labels inside the canvas are Fira Code at `opacity: 0.5` (`:378-384`) — the
   right face, dimmed into invisibility.

7. **The gallery easter-egg is hidden and uncelebrated.** `useEasingGallery.ts` runs a
   gorgeous 6-curve auto-tour (back / bounce / elastic, 520ms steps) — the single most
   *delightful* thing on the page — but it's bound to an **undocumented double-click on
   the canvas** (`EasingSidebar.vue:38`). No affordance, no label, no visual signature
   when it runs. A motion catalogue this good should be a *named feature*, not a secret.

8. **The comparison view is a spreadsheet of identical rows.** `EasingTarget.vue:103-136`
   stacks `.track-row`s — a right-aligned `text-mono-caption` label + a ball on a rail.
   It's a functional small-multiple but visually monotone: every row is the same height,
   same rail, same tint; the active one only gets a color swap. There's no sense that
   you're watching *many timing functions race the same clock* — which is exactly the
   dramatic, screenshot-worthy thing a comparison view could be.

---

## §Refinements

Each concrete + implementable, extending the existing design system (glass-ui tokens +
the demo's `design-idioms.css` vocabulary) — never a wholesale swap.

### TYPOGRAPHY

- **Promote the readout literal to a poster, not a footnote.** In `EasingEditor.vue:44-48`
  the `cubic-bezier(…)` string is `text-mono-caption normal-case italic` — lift it to
  `text-mono-prose` (the same rung the live `f(t)=` value uses), drop the italic, and
  give it the violet `.readout-accent` (it already cascades `--ball-tone`). The
  most-copyable artifact on the page should *look* like the answer. Keep the CopyButton;
  enlarge its hit target.
- **Add a one-word instrument label inside the canvas, top-left.** A single Fira Code
  uppercase micro-label — `EASE · f(t)` — at `text-admin-label` weight, low opacity,
  positioned absolutely over the canvas top edge. This is the masthead of a measuring
  device; it costs nothing and instantly reads "instrument," not "graph." (One new
  absolutely-positioned `<span>` in `EasingCurveCanvas.vue` over the GlassPanel.)
- **Keep the two wins.** The `text-display` Instrument-Serif curve name
  (`EasingTarget.vue:36`) and the damped `AnimatedDigit` readout (`:40-46`) are exactly
  right — the serif poster + tabular-mono voltmeter is the correct two-voice pairing.
  Do not touch them.

### COLOR

- **Spend the violet. Make the trace the signal color.** Introduce a scene-scoped
  `--trace` token on the editor root = `var(--ppmycota-primary)` and a `--trace-glow`
  = `color-mix(in srgb, var(--ppmycota-primary) 60%, transparent)`. The curve
  (`EasingCurveCanvas.vue:335`) keeps its violet stroke but gains a **bloom** via a
  layered `drop-shadow` filter (see MOTION/BACKGROUND). On the hero stage, raise the
  projected curve from `opacity: 0.08` (`EasingHeroStage.vue:149`) to a **gradient-stroke
  trace**: `opacity: 0.22` at the bright core, falling to ~0.06 at the tails via a
  `<linearGradient>` along the path — the beam is brightest where the action is.
- **Keep the green/violet split honest.** The ball stays the cascaded `--ball-tone`
  (`EasingTarget.vue:374` already sets it to `--rainbow-violet`) so the probe and the
  trace share one hue family — but give the probe a *whiter hot core* so it reads as the
  beam's focal point against the violet trace (the scope-beam relationship: bright point
  on a glowing line). The comparison-track muted balls stay at 20% tint (`:413`).
- **Tint the screen.** Replace the inert `GlassPanel variant="wash"` interior with a
  faint **radial field tint** centered low (where the curve starts), using
  `color-mix(in srgb, var(--trace) var(--stage-field-tint), transparent)` — the
  `--stage-field-tint: 4%` token already exists (`design-idioms.css:272`). The screen
  glows faintly violet from the origin, like a powered phosphor surface.

### MOTION

- **The drag-smear (signature half 1).** While a bezier handle is dragging
  (`EasingCurveCanvas.vue` already tracks `currentHandleIndex`), apply a transient
  directional `filter: blur()` smear to `.bezier-path` proportional to the handle's
  per-frame velocity, decaying to zero on release via the engine's own
  `SmoothProgress`/`decay` primitive — *dogfood*. The curve flexes like a live trace,
  not a static SVG snapping between states. PRM: snap (no smear) under
  `prefers-reduced-motion`.
- **The settle-tick (signature half 2).** On `stopDragging` (`:244`), fire a single
  one-shot graticule pulse: the center crosshair / the nearest major gridline brightens
  for ~180ms then eases back — the instrument acknowledging the new value. Drive it with
  a keyframe animation using the demo's own `--ease-standard` token. One quiet flash, not
  a celebration.
- **The probe trail.** Give `.traveling-dot` (`:369`) a short fading tail — 3–4 ghost
  positions at decaying opacity sampled from the last frames, or a simpler CSS approach: a
  `box-shadow`-driven comet glow elongated along travel direction. The beam should leave a
  faint afterimage as it climbs the curve, the way a real scope phosphor decays.
- **Orchestrated load.** On scene enter, the instrument *powers on*: graticule fades in
  first (staggered minor → major), then the trace draws itself origin→end via
  `stroke-dashoffset` (the library SHIPS `DrawSVG`/`fromDrawSVG` for exactly this —
  *dogfood the engine's own line-drawing primitive*), then the probe drops onto the
  trace and begins its sweep. ~600ms total, staggered. This is the one orchestrated load
  the methodology asks for, and it makes the page's first impression "instrument booting,"
  not "div appeared."

### SPATIAL

- **Make the hero stage dramatize that height = curve.** In `EasingHeroStage.vue`, raise
  the projected trace (COLOR above) and add **a vertical drop-line** from the live probe
  down to the t-axis baseline — a faint plumb line that makes the ball's height legible as
  a *value*, not just a position. Now the eye reads: probe is here on the clock (x), and
  THIS high on the output (y) — the curve made physical. The `.stage-field-y` coordinate
  frame (`design-idioms.css:579`) already gives the graticule; the drop-line is the
  missing read.
- **Grow the canvas into a true hero.** The sidebar already grows it
  (`EasingSidebar.vue:178-181`, `clamp(260px, 64cqi, 360px)`). Push the floor a touch and
  let the instrument label + the promoted readout frame it top and bottom so the canvas
  reads as a *screen in a chassis*, not a square in a list.
- **Comparison view as a race, not a table.** In `EasingTarget.vue:103-136`, keep the
  small-multiple but add a single shared **vertical "now" line** (a faint playhead) the
  balls cross at different times — so the eye instantly sees ease-out balls sprinting
  ahead while ease-in balls lag. One absolutely-positioned line over the track stack at
  `progress * width`. That converts a spreadsheet into a visibly-dramatic timing race.

### MICRO-INTERACTIONS

- **Handles that look adjustable at rest.** Give `.control-point.handle`
  (`EasingCurveCanvas.vue:359`) a violet accent ring (`--trace`) and a resting soft glow,
  so they read as the live controls. On `:hover` (`:365`) — already bumps `r` — add a
  brighter halo + cursor `grab`; on active-drag, `grabbing` + a tightened bright core. The
  handle *lines* (`:328`) brighten from `opacity: 0.5` to a crisp `--trace`-tinted dash
  while their handle is grabbed, so you see exactly which control arm you're bending.
- **The readout reacts to copy.** On CopyButton success in `EasingEditor.vue`, flash the
  readout literal with a brief `--trace` highlight sweep (reuse the existing
  `gold-shimmer`-style sweep mechanism but in the violet) — confirmation that the
  copy-worthy artifact was copied.
- **Curve-name hover in the dropdown.** `EasingSelect.vue` already renders per-item SVG
  curve glyphs (`:43-55`) — on hover, let the glyph's stroke *draw itself* quickly
  (stroke-dashoffset) so the menu previews each curve's shape kinetically. A motion
  catalogue should move when you browse it.

### BACKGROUND

- **The graticule, rebuilt as a scope screen.** Replace the flat three-line grid
  (`EasingCurveCanvas.vue:322-326`, uniform `opacity: 0.4`) with a **two-tier graticule**:
  faint minor divisions + bolder major divisions at 0.25/0.5/0.75 + a slightly brighter
  **center crosshair**. This is the same `--graph-pitch`/`--graph-major` two-tier idiom
  the page substrate already uses (`design-idioms.css:268-271`) — bring it *inside* the
  canvas. The diagonal `f(t)=t` reference (`:315-320`) stays but tinted toward `--trace`
  at low opacity, so the linear baseline reads as "the null curve."
- **The trace bloom.** The curve gains a true emitted-light halo: a `drop-shadow(0 0 Npx
  var(--trace-glow))` filter on `.bezier-path`, sized so the violet beam glows against the
  dark screen without smearing the graticule. This is the single highest-leverage visual
  change — it converts the hairline into a *signal*.
- **A whisper of phosphor grain.** A very low-opacity noise/scanline texture over the
  canvas interior (a tiled SVG `feTurbulence` or a repeating-linear-gradient scanline at
  ~2% opacity) sells the CRT/instrument material without theming the rest of the demo. It
  lives ONLY inside the canvas plate — atmospheric depth, scoped, coherent.
- **Vignette the screen.** A subtle inner shadow / radial darkening at the canvas edges
  (inside the `GlassPanel`) focuses the eye on the trace and reads as the curved glass of
  a real scope tube. One `box-shadow: inset` on `.easing-curve-canvas-wrapper`.

---

## §The one unforgettable moment

**Bending a beam of light.** You grab a bezier handle and pull. The violet trace —
glowing against a faintly-phosphor-tinted dark screen behind a two-tier graticule —
*flexes under your cursor with a directional smear*, the way a live oscilloscope beam
lags when the signal changes fast. The traveling probe re-derives its height against the
new curve in real time, dragging a short comet-tail of afterglow up the slope. At the top
of the screen, `f(t) = 0.42 → 0.71` counts in tabular Fira Code like a voltmeter
following the trace. You release — and the graticule's center crosshair *pulses once*,
quietly, the instrument settling on the new value, while the smear decays to a crisp clean
trace via the engine's own decay primitive. The `cubic-bezier(.17,.67,.83,.67)` literal
below flashes a violet highlight, copy-ready.

No other scene owns this: the easing page is the *only* place you directly, continuously
shape a curve and watch a measuring instrument answer. The cube gets re-lit; the easing
screen gets *bent*. And every part of it — the smear decay, the settle pulse, the probe
height, the boot-up trace draw — is keyframes.js animating its own instrument. The page
that teaches timing functions is itself driven by them.

---

## §Implementation plan

In priority order. Files to touch + the specific change.

1. **`EasingCurveCanvas.vue` — promote the screen (highest leverage).**
   - `.bezier-path` (`:335-343`): add `drop-shadow` bloom filter via `--trace`/`--trace-glow`;
     keep violet stroke. (The trace becomes a signal.)
   - Graticule rebuild (`:322-333`): two-tier minor/major + center crosshair + `--trace`-tinted
     diagonal null line, consuming the existing `--graph-*` idiom values.
   - `.traveling-dot` (`:369-373`): whiter-hot core + comet-tail glow.
   - `.control-point.handle` (`:359-367`): violet accent ring + resting glow + grab/grabbing
     cursors + grabbed-state handle-line brighten.
   - Add the scoped `--trace`/`--trace-glow` tokens + the radial field tint + inner vignette
     + scanline grain on `.easing-curve-canvas-wrapper`.
   - Add the absolutely-positioned `EASE · f(t)` instrument label.
   - Drag-smear + settle-tick logic in the existing `startDragging`/`onDrag`/`stopDragging`
     seam (`:211-247`), dogfooding `SmoothProgress`/`decay`. PRM-guarded.

2. **`EasingHeroStage.vue` — dramatize height = curve.**
   - Projected trace (`:143-150`): `opacity: 0.08` → gradient-stroke `0.22→0.06` core-to-tail.
   - Add the live probe→baseline drop-line.
   - Probe (`.hero-ball`, `:163-167`): inherit the comet-tail glow treatment.

3. **`EasingEditor.vue` — promote the readout literal.**
   - `.easing-readout` (`:44-48`): `text-mono-caption italic` → `text-mono-prose .readout-accent`,
     drop italic, enlarge CopyButton hit target, add violet copy-success flash.

4. **`EasingTarget.vue` — the comparison race + the gallery affordance.**
   - Comparison stack (`:103-136`): add the shared vertical "now" playhead line.
   - Surface the gallery: replace the undocumented dblclick (`EasingSidebar.vue:38`) with a
     real labeled affordance — a small "Tour the gallery" control near the canvas — and give
     the tour a visible running signature (a sweeping trace-color pulse per step). Keep the
     dblclick as a power-user shortcut.

5. **`EasingSelect.vue` — kinetic curve previews.**
   - Per-item glyph (`:43-55`): hover-draw the stroke via `stroke-dashoffset`.

6. **Orchestrated load (cross-cutting).**
   - Power-on sequence on scene enter: graticule stagger-in → trace `DrawSVG` self-draw →
     probe drop. Dogfood `fromDrawSVG` + `stagger`. Lives in `EasingCurveCanvas.vue` /
     `EasingHeroStage.vue` mount hooks, PRM-guarded.

All tokens route through the existing system: `--ppmycota-primary` (the new `--trace`),
`--stage-field-tint`, `--graph-pitch`/`--graph-major`, `--ball-tone`, `--ease-standard`,
`--duration-fast`. No new font, no palette swap — the violet was always there; this
treatment finally *turns it on*.
