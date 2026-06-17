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

2. **The canvas is honest graph-paper, but flat — it could read as an instrument screen.**
   `EasingCurveCanvas.vue:309-333` draws `.bounding-box` (1px border), three `.grid-line`
   verticals + three horizontals at `opacity: 0.4`, a `.diagonal-ref` dashed line, and
   four 0.055px `.axis-label` glyphs at `opacity: 0.5`. It is a *correct, on-brand* grid —
   the same PAPER pillar the page substrate speaks — but drawn flat, one uniform tier. It
   has no graticule *hierarchy* (the page substrate already runs bold majors + faint minors
   via `--graph-pitch`/`--graph-major`; the canvas doesn't inherit that two-tier logic),
   no center crosshair, no field tint, no vignette. The `GlassPanel variant="wash"` wrapper
   (`:4`) gives it a faint blur plate — the GLASS pillar is present — but the screen inside
   is inert. The fix is to *deepen* the graph-paper it already draws (bring the substrate's
   own two-tier idiom inside the plate), not to swap it for a foreign vocabulary.

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

5. **The hero stage's ball-on-a-rail is right — it's just under-dramatized.** `EasingTarget.vue`
   + `EasingHeroStage.vue`: one `.progress-ball` (`--ball-size: 56px`, `--ball-tone:
   var(--rainbow-violet)` — note the ball already rides the demo's own *rainbow* family,
   the signature accent) slides a `.progress-rail` hairline under an 8% ghost curve,
   anchored at the lower third (`pb-12`). **KEEP the ball + the rail** — they are the demo's
   honest, legible "the engine is running" gestalt, and the rainbow-violet tone is an
   intentful signature, not a default. What's missing is the *mathematical reading*: nothing
   yet dramatizes that the ball's HEIGHT *is* the curve, because the projected curve sits at
   8% and there's no plumb line tying position-on-the-clock to value-on-the-output. The move
   is to ADD a mathematical overlay (a brighter projected trace + a drop-line) *over* the
   existing ball/rail — an enhancement that makes the relationship visible — not to replace
   the ball with a bare phase plot.

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

8. **The comparison view is a correct small-multiple, but visually monotone.**
   `EasingTarget.vue:103-136` stacks `.track-row`s — a right-aligned `text-mono-caption`
   label + a ball on a rail. The small-multiple is the *right* structure (keep it) — it's
   just undifferentiated: every row is the same height, same rail, same tint; the active one
   only gets a color swap. There's no shared playhead and no per-track hue, so it doesn't yet
   read as *many timing functions racing the same clock* — which is exactly the dramatic,
   screenshot-worthy thing this view can become with a "now" line + a rainbow-stop per track
   (the demo's own palette, finally doing legible work). Enhance the rows; don't reshape them.

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
- **Keep the rainbow family — proportion it as the signature accent.** The ball stays the
  cascaded `--ball-tone` = `--rainbow-violet` (`EasingTarget.vue:374`) so the probe and the
  trace share one hue family — the rainbow six (`design-idioms.css:78-90`) is the demo's
  *intentful, restrained* spectrum and we KEEP it, not just inherit it. Give the probe a
  *whiter hot core* so it reads as the beam's focal point against the violet trace (the
  scope-beam relationship: bright point on a glowing line). One proportionate place to let
  the *full* rainbow fire as signature, not decoration: the **comparison-race** balls
  (REFINEMENT below) — let each timing-function track carry a distinct rainbow stop (red→
  violet across the small-multiple), so the race reads as a *spectrum of curves* and the
  demo's crayon palette earns a real, legible job. Everywhere else the violet stays the
  lone signal color — the rainbow is the accent that fires *once*, on the race, with intent.
  The comparison-track muted balls keep their 20% tint baseline (`:413`) and pick up the
  per-track rainbow hue at full strength only on the active/animating row.
- **Tint the screen — over the existing glass, not instead of it.** KEEP the
  `GlassPanel variant="wash"` plate (it is the GLASS pillar); *add* a faint **radial field
  tint** centered low (where the curve starts) as an inner layer on the wash interior, using
  `color-mix(in srgb, var(--trace) var(--stage-field-tint), transparent)` — the
  `--stage-field-tint: 4%` token already exists (`design-idioms.css:272`). The screen glows
  faintly violet from the origin, like a powered phosphor surface — the glass plate gains a
  tint, it isn't traded away for one.

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
- **Orchestrated load — the power-on, as a proportionate signature.** On scene enter the
  instrument *powers on*, ONCE: graticule fades in first (staggered minor → major), then the
  trace draws itself origin→end via `stroke-dashoffset` (the library SHIPS
  `DrawSVG`/`fromDrawSVG` for exactly this — *dogfood the engine's own line-drawing
  primitive*), then the probe drops onto the trace and begins its sweep. ~600ms total,
  staggered. This is a *delight on first paint*, not a re-theme: it plays on mount and then
  the page is simply the page — measured, not a dominant boot animation that re-fires or
  delays interaction. PRM: snap straight to the drawn state. It makes the first impression
  "instrument booting," not "div appeared," and earns the easter-egg slot without taxing the
  steady state.

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
- **Comparison view as a race — keep the small-multiple, dramatize it.** In
  `EasingTarget.vue:103-136`, KEEP the `.track-row` stack (it is the correct, legible
  small-multiple) and add two things over it: a single shared **vertical "now" line** (a
  faint playhead) the balls cross at different times — so the eye instantly sees ease-out
  balls sprinting ahead while ease-in balls lag (one absolutely-positioned line at
  `progress * width`) — and the **per-track rainbow tint** (COLOR above): each row's active
  ball draws a distinct `--rainbow-*` stop, red→violet down the stack. That converts a
  monotone table into a visibly-dramatic, *spectrum-colored* timing race and gives the
  demo's crayon palette its one proportionate, intentful job on the page.

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

- **The graticule, deepened into a scope screen.** KEEP the grid — *promote* the flat
  three-line grid (`EasingCurveCanvas.vue:322-326`, uniform `opacity: 0.4`) into a **two-tier
  graticule** by giving it the hierarchy the page substrate already has: faint minor divisions
  + bolder major divisions at 0.25/0.5/0.75 + a slightly brighter **center crosshair**. This
  is the same `--graph-pitch`/`--graph-major` two-tier idiom the substrate runs
  (`design-idioms.css:268-271`, majors held above the 10% legibility floor — respect that gate
  inside the canvas too) — we're bringing the demo's OWN paper-grain *inside* the plate, not
  importing a foreign graticule. The diagonal `f(t)=t` reference (`:315-320`) stays but tinted
  toward `--trace` at low opacity, so the linear baseline reads as "the null curve."
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

## §Design verdict reconciliation

The user's fleet-wide verdict is **refine, do not abrogate** — keep the crayon/rainbow
primaries (proportioned as a restrained signature), preserve + amplify the four pillars
(GLASS, PAPER, audacious TYPOGRAPHY, visible MATHEMATICS), and fold the signature moments as
*tasteful, proportionate easter eggs*, not dominant re-themes. This treatment was already the
disciplined one of the fleet — it spends a *brand* accent (`--ppmycota-primary`, not a
crayon), it never proposed killing the rainbow or any HSL square, and its own §Refinements
preamble already pledges "never a wholesale swap." So the reconciliation here is small and
surgical; what changed:

- **Crayons KEPT and given a real job (was: inherited silently).** The ball already rides
  `--ball-tone: var(--rainbow-violet)` — that's the demo's own crayon family, and we now say
  so explicitly and KEEP it. New proportioned use: the **comparison race** lets the *full*
  rainbow six fire as a spectrum-of-curves (red→violet down the track stack), the one place
  the palette earns a legible job. Everywhere else the violet stays the *lone* signal color —
  the rainbow is the accent that fires **once**, with intent, not a re-theme. No crayon was
  killed; the palette gained purpose.

- **"Replace the inert GlassPanel interior" → tinted, not traded (GLASS).** Reversed the
  replacement framing: the wash plate is KEPT; the radial field tint is an *added inner layer*
  on it. The glass pillar is amplified, not swapped.

- **"Rebuild the graticule" → deepen the demo's own paper-grain (PAPER).** Reversed
  "rebuilt"/"replace the flat grid"; the grid is KEPT and *promoted* into the substrate's own
  two-tier `--graph-pitch`/`--graph-major` idiom (majors respect the 10% legibility gate).
  We bring the page's paper INSIDE the plate — not import a foreign scope graticule.

- **Hero "ball on a flat line = generic" → KEEP the ball + rail, ADD the math overlay
  (MATHEMATICS).** Reversed the "quiet to the point of generic" dismissal. The ball-on-a-rail
  is the honest "engine is running" gestalt and stays; the new projected trace + plumb
  drop-line are a mathematical *overlay over* it that makes height-equals-curve visible — the
  exact "keep the ball, add the phase/graticule as a math easter-egg" shape the verdict names.

- **Signatures held to proportion (easter eggs).** The power-on boot is explicitly scoped to
  *first paint, once, PRM-snapped* — a delight, not a dominant boot theme. The drag-bend /
  settle-tick / probe-trail stay the page's one signature interaction (it is genuinely
  distinctive and dogfoods the engine), kept proportionate: one quiet crosshair pulse on
  release, not a celebration.

- **TYPOGRAPHY untouched where it already wins, pushed where it's timid.** The Instrument-Serif
  curve name + tabular-mono voltmeter readout are KEPT verbatim; the only typographic moves
  *promote* an existing dimmed literal (the `cubic-bezier(…)` string) and add a single
  characterful instrument micro-label — amplification, no new font, no palette swap.

Net: every clause now KEEPS its extant element and ENHANCES it; nothing in the original
called for a crayon-kill or an HSL-square swap, so no such reversal was needed here (those
belong to the cube / color-picker pages). The file:line specificity is unchanged throughout.

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
   - Comparison stack (`:103-136`): KEEP the `.track-row` small-multiple; add the shared
     vertical "now" playhead line + the per-track rainbow tint (red→violet down the stack —
     the crayon palette's one proportionate job). Active row draws its `--rainbow-*` stop at
     full strength; muted rows hold the 20% tint baseline.
   - Surface the gallery: KEEP the power-user dblclick (`EasingSidebar.vue:38`) and ADD a
     real labeled affordance beside it — a small "Tour the gallery" control near the canvas —
     and give the tour a visible running signature (a sweeping trace-color pulse per step).
     The hidden shortcut stays; it just stops being the *only* door.

5. **`EasingSelect.vue` — kinetic curve previews.**
   - Per-item glyph (`:43-55`): hover-draw the stroke via `stroke-dashoffset`.

6. **Orchestrated load (cross-cutting).**
   - Power-on sequence on scene enter: graticule stagger-in → trace `DrawSVG` self-draw →
     probe drop. Dogfood `fromDrawSVG` + `stagger`. Lives in `EasingCurveCanvas.vue` /
     `EasingHeroStage.vue` mount hooks, PRM-guarded.

All tokens route through the existing system: `--ppmycota-primary` (the new `--trace`),
`--stage-field-tint`, `--graph-pitch`/`--graph-major`, `--ball-tone`, the full
`--rainbow-*` six (the comparison-race spectrum), `--ease-standard`, `--duration-fast`. No
new font, no palette swap — the violet was always there and the crayons were always there;
this treatment finally *turns the violet on* and gives the rainbow its one proportionate,
intentful job. Every clause KEEPS its element and ENHANCES it (the four pillars amplified, the
signatures held to easter-egg proportion) — per the §Design verdict reconciliation above.
