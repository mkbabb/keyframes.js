# Spring Scene — frontend-design treatment

> Scope: the spring scene only — `demo/app/scenes/SpringScene.vue`,
> `demo/spring/SpringSidebar.vue`, `demo/spring/SpringTarget.vue`,
> `demo/spring/StartingStyleTarget.vue`, plus the `springLinearStops()` /
> `springPresets` / `useSpringLinearStops` it consumes.
> A design PROPOSAL. No source is written outside this doc.

---

## §Aesthetic direction

**The bold POV: "An oscilloscope for physics — the page that rings."** Every
other scene in the demo animates a *thing* (a cube, a sphere, a box, a ball on a
path). The spring scene's subject is not an object — it is **a force you can't
see made visible**. The page's whole reason to exist is the shape of an
underdamped curve: the overshoot, the ring, the settle. So the aesthetic is
**laboratory instrument / measurement bench**: a calibrated, slightly austere,
high-contrast surface where the *signal* is the hero and everything else is the
graticule around it. Think Tektronix scope face, a seismograph drum, a Braun
measuring device — not a playground.

The current page treats the spring as a **ball that slides on a rail** (the
`.spring-ball` traveling `.progress-rail`, `SpringTarget.vue:84`). That is the
weakest possible expression of a spring: it shows you *position* but throws away
the *curve*, which is the entire point. A 1D ball on a line cannot show
overshoot — it just stops at the wall. The SOTA bar for a CSS-animation engine's
spring page is the **phase portrait**: you should see the position trace ITSELF
drawn out in time, the overshoot cresting *past* the target line and ringing
back, exactly as the `linear()` string already encodes (`springLinearStops.ts:65`
emits values that exceed 1 for ζ < 1 — the overshoot is *right there in the
data*, currently invisible).

**The ONE unforgettable thing — "the derby."** This page alone owns a
**four-lane spring race**. Re-seat the target (or double-click — `demo.derby` is
*already wired* at `SpringTarget.vue:72`, just unexpressed) and all four presets
— smooth, snappy, bouncy, gentle — launch *simultaneously* down four parallel
traces, each drawing its own physics curve in its own lane, the bouncy one
visibly *overshooting and ringing past* the finish while gentle creeps in
critically-damped and never crosses. You watch ζ=0.45 fight ζ=1.0 in real time,
side by side, the overshoot lobes cresting over a shared target line like four
seismograph needles. Nothing else in the demo is a *comparison* instrument —
this is the only scene whose subject is a *family* of curves, so it alone earns
the race. And it is pure dogfood: four `SpringProgress` solvers, one shared
re-seat, the engine's own physics drawn four ways at once.

---

## §Current-state audit

What reads generic / weak / AI-slop against the SOTA bar:

1. **The spring is a ball on a rail — the curve is thrown away (the single
   worst offender).** `SpringTarget.vue:84` renders the protagonist as a
   `.progress-ball` traveling a horizontal `.progress-rail` (`:74`), positioned
   by an imperative `left: %` write (`:135-137`). A ball sliding left-to-right
   on a line **physically cannot show overshoot** — when ζ<1 and the spring
   rings past its target, the ball just pins to the wall (the code even *clamps*
   it: `clampSweep`, `:124`, "the ball stays inside the track even though the
   read-out shows >1"). The most important visual fact about a spring — that it
   *exceeds and returns* — is actively hidden. This is a tutorial-grade
   visualization of a SOTA physics engine.

2. **The `linear()` artifact — the page's crown jewel — is shown as grey
   monospace text.** `StartingStyleTarget.vue:56` renders the emitted
   `linear(0, 0.234 4.17%, …, 1)` string in a `text-mono-caption
   text-muted-foreground` code block. This string IS the deliverable — it is
   what a designer copies into their stylesheet, the literal output of
   `springLinearStops()` (`:60-72`), 26 stops that trace the exact overshoot
   curve. Rendering humanity's most plottable data structure as muted grey text
   is the equivalent of printing a photograph as its hex bytes. There is a
   *graph* hiding in that string and the page shows none of it.

3. **Two metric badges fight; the curve has no home.** `SpringTarget.vue:33-52`
   gives a big `.spring-readout-primary` displacement number (good — the K.W4
   re-tier was right to promote x) and a `settled`/`tracking` status badge. But
   the *velocity* is a muted caption afterthought (`:48-50`) and there is no
   trace of the curve's *shape* anywhere — no overshoot indicator, no settle-time
   readout, no "ζ < 1 → this one rings" cue. The numbers describe a point; the
   spring is a *trajectory*.

4. **The preset cells are four tiny rails, redundant with the stage.**
   `SpringSidebar.vue:79-101` renders four `ToggleChip` cells, each with its OWN
   in-cell `.preset-track` + traveling `.preset-ball` (`:93-99`), painter-driven
   at 60Hz (`:177-183`). So the page shows the *same ball-on-rail metaphor* FIVE
   times (the stage rail + the sampler + four preset cells), each a 1D position
   with no curve. Four chances to show four *different curve shapes* side by
   side, all spent on four identical sliding dots. This is exactly the derby's
   raw material, wasted.

5. **The `@starting-style` view is the strongest idea, undersold.**
   `StartingStyleTarget.vue:146-185` is genuinely SOTA under the hood — a real
   `@starting-style` entry + `transition-behavior: allow-discrete` exit
   (`:167`), eased by the live spring `linear()` (`--spring-ease`). But the
   visible payload is a small pill that says "Hello, spring." fading up
   (`:32-37`) with `opacity + translate + scale`. The mechanism is bleeding-edge;
   the *demonstration* is a tooltip. You can't feel the spring in a 1.25rem
   translate on one small card.

6. **The palette is monochromatic red — coherent but mute for a *comparison*
   page.** The K.W4 motion-color collapse repointed everything to `--accent-red`
   (`style.css:370`) — correct as a *system* decision, and the dashed-red settled
   register is a strong identity. But a page whose job is to **distinguish four
   springs** renders all four in the same red (`SpringSidebar.vue:256-270`). The
   derby needs the four lanes to be *tellable apart* at a glance, and the
   demo already owns a sanctioned multi-hue family for exactly this kind of
   "legitimate pop" — the `--rainbow-*` set (`design-idioms.css:78-90`), the one
   place a controlled spectrum is allowed.

7. **The drag rail is a coarse re-seat, not a charged gesture.** The rail
   (`SpringTarget.vue:61-85`) re-seats the target on pointer-drag via
   `useDragScrub` (`:148-157`), and the spring chases — fine physics. But the
   gesture carries no *charge*: you don't feel the spring loading, there's no
   release-snap feedback, no sense that you're *pulling* a mass on a spring and
   *letting go*. The `drag()`/`Draggable` primitive the library itself ships
   (the closed-form fling re-seat) is not dogfooded on its own spring page.

What is ALREADY at the bar and must be preserved: the imperative-painter hot
path (direct `style.left` writes off the Vue graph, `SpringTarget.vue:131-142`);
the real `@starting-style`/`allow-discrete` machinery; the copy-pasteable
`linear()` artifact + `CopyButton`; the `springLinearStops()` dogfood (the demo
emits the SAME curve glass-ui's tokens regenerate from); the response/ζ slider
grammar (`SpringSidebar.vue:50-71`); the cartoon+quiet control register vs the
glass-resting stage plate; the red-dashed *settled* register; the reduced-motion
gates (`StartingStyleTarget.vue:199-203`); Instrument Serif + Fira Code.

---

## §Refinements

Every change extends the existing token system — no wholesale swap. New tokens
are proposed as additions to the demo-owned layers (`design-idioms.css` /
`style.css :root`), consumed by the scene exactly as the rainbow/graph/ball-tone
families already are.

### TYPOGRAPHY

- **A genuine "instrument label" register for the curve readouts.** The display
  voice (Instrument Serif) currently carries the scene name + the big `x` number
  (`SpringTarget.vue:35,41`). Keep that, but *add* a Fira Code **engineering
  annotation** stratum the lab aesthetic demands: settle-time and overshoot as
  *labeled measurements*, not bare numbers. Below the `x` readout, a mono row:
  `ζ 0.45 · overshoot +18% · settle 0.74s` — each value computed live (ζ is
  `demo.dampingFraction`, overshoot = `max(trace) − 1`, settle-time from the
  `linear()` sample where it pins to 1). Render the value glyphs at
  `.readout-accent` (`design-idioms.css:564`) and the labels at
  `text-mono-caption text-muted-foreground`. This is the oscilloscope's
  measurement cursor readout — the page finally *names* the curve's properties.
- **The `linear()` string gets a monospace gutter with stop indices.** When the
  artifact graph (below) is shown, annotate it the way a scope annotates a
  trace: tiny Fira Code tick labels at 0% / 25% / 50% / 75% / 100% along the
  time axis, `text-[0.625rem]` `--muted-foreground`. The string stays
  copy-pasteable (`StartingStyleTarget.vue:56`) but is no longer the *primary*
  representation — it demotes to a "view source" detail under the plot.

### COLOR

- **Give the four presets four distinguishable lane hues — from the sanctioned
  rainbow family.** This is the headline color move and the derby's prerequisite.
  Add four demo tokens beside the rainbow set in `design-idioms.css :root`,
  mapping each preset to a member of the *already-owned* spectrum (so this is a
  consume, not a new identity):
  ```css
  --spring-lane-smooth: var(--rainbow-blue);    /* calm, settles    */
  --spring-lane-snappy: var(--rainbow-green);   /* quick            */
  --spring-lane-bouncy: var(--rainbow-violet);  /* the playful ring */
  --spring-lane-gentle: var(--color-progress);  /* critically damped → the red identity */
  ```
  Drive each preset cell's `--ball-tone` (the `.progress-ball` already
  parameterizes its hue by this one var, `design-idioms.css:522-534`) from its
  lane token. The four cells (`SpringSidebar.vue:79-101`) become four colors —
  tellable apart at a glance — *without* re-authoring the rail/ball recipe. The
  monochrome-red *settled* register survives where it means "done"; the lane
  hues mean "which spring." Both truths coexist, exactly as `--rainbow-*` and
  `--accent-red` already coexist elsewhere.
- **The single active spring keeps the red identity on the stage.** The
  *solver* stage (`SpringTarget.vue`, `--ball-tone: var(--color-progress)`,
  `:182-184`) stays red — the one live spring you're driving is the scene's
  protagonist and wears the canonical motion color. The lane hues live only in
  the *comparison* surfaces (the preset cells + the derby), so the system reads:
  red = "the spring I'm controlling," rainbow = "the family I'm comparing."

### MOTION — the trace, not the ball

- **Replace the 1D ball-on-rail with a 2D PHASE TRACE (the core fix).** The
  stage subject becomes a small SVG plot: a horizontal **target line** across the
  middle, and the spring's position drawn as a **trace that crests over the line
  and rings back** when ζ<1. Two ways to source the geometry, both pure dogfood:
  - *Static curve:* feed the live `linear()` stops into an SVG `<path>` (parse
    the `0.234 4.17%` stops → `(x=pct, y=value)` points). The overshoot is
    `y > 1` → the path *visibly crosses above the target line*. This is the
    `springLinearStops()` output finally *plotted* instead of printed.
  - *Live trace:* keep the imperative painter (`SpringTarget.vue:133-142`) but
    have it draw the ball's *history* — a fading polyline of the last ~1.2s of
    `live.value`, so re-seating leaves a comet-trail that shows the ring. The
    ball stays (it's the *now*), but it now drags its trajectory behind it.

  Either way the overshoot becomes *the* visual event. The `clampSweep` hack
  (`:124`) dies — the trace is *supposed* to cross the line.
- **The derby (the signature — see §below).** Four `SpringProgress` solvers, one
  shared re-seat, four traces racing in four lanes. `demo.derby` is already wired
  (`SpringTarget.vue:72`); this gives it a stage worth watching.
- **Charge the drag gesture.** Route the rail re-seat through the library's own
  `Draggable` (the closed-form fling) instead of the bare `useDragScrub` ratio
  (`SpringTarget.vue:148-157`). On `pointerdown`, the *target* marker lifts
  toward the cursor and a faint tension cue appears (a thin connecting line
  between the ball's rest and the cursor — "the spring is loaded"); on release,
  the spring fires and the trace draws. This dogfoods `drag`/`Draggable` on the
  one page about springs. Respects the J-tranche pointerdown-swallow lesson:
  the press cue is CSS-class-driven, not gesture-intercepting.

### SPATIAL

- **Stack the comparison vertically as a stave, not a 2×2 grid.** The preset
  cells are a `grid-cols-2` (`SpringSidebar.vue:79`). For a *comparison*
  instrument, four curves read best **stacked as parallel horizontal lanes** (a
  musical stave / a multi-channel scope), so the eye scans top-to-bottom and the
  overshoot lobes align on a shared vertical target gridline. In the rail this
  may stay 2×2 for space, but the **derby stage** must be four full-width lanes
  one above the other, sharing one target line — the asymmetry that makes
  "bouncy crosses, gentle doesn't" instantly legible.
- **Anchor the trace to the golden optical center,** parking the plot on
  `--work-area-vertical-bias-top: 0.382` (`style.css:190`) the layout already
  computes, with generous lab-bench negative space above and the measurement
  readout floating bottom-left like a scope's cursor box.

### MICRO-INTERACTIONS

- **Slider drag → live curve morph.** As you drag the ζ slider
  (`SpringSidebar.vue:61-70`), the phase-trace plot *reshapes in real time* — at
  ζ=1.5 it's a flat critically-damped ramp; drag toward ζ=0.2 and the overshoot
  lobe *grows up out of the target line* and starts ringing. The `linear()`
  recomputes already (`useSpringLinearStops`); this just plots the result. The
  single most satisfying micro-interaction the page can own: you *sculpt the
  bounce* with a slider and watch the curve grow a lobe.
- **Preset hover → ghost trace.** Hovering a preset cell paints a faint *ghost*
  of that preset's curve onto the main plot (overlaid on the active one), so you
  preview "what bouncy would look like" before committing — a scope's "compare
  to reference" overlay. Suppressed on coarse pointers + reduced-motion.
- **Settle pulse.** When the live spring crosses `demo.liveSettled`
  (`SpringTarget.vue:46`), the target line gives one quiet red-dashed pulse (the
  settled register, `style.css:368`) — the instrument confirming "locked." A
  200ms `outline` flash, compositor-cheap.

### BACKGROUND

- **A scope-face graticule behind the trace.** The stage already carries
  `.stage-field-x` quarter-ticks (`SpringTarget.vue:63`, `design-idioms.css:588`).
  Extend it for *this* stage to a true two-axis graticule: the existing vertical
  time-ticks PLUS faint horizontal value-lines at 0 / 0.5 / **1.0 (the target,
  brighter)** / overshoot-zone, using the same `var(--border)` hairline language
  (`.stage-field-y` already draws horizontal lines, `:579`). The target line at
  1.0 is the *brightest* graticule line — the thing every trace is measured
  against. This is atmospheric depth that *means something*: the curve has a grid
  to ring against.
- **A soft phosphor glow on the live trace.** A faint `drop-shadow` /
  `feGaussianBlur` on the SVG trace in the lane hue — the CRT-phosphor afterglow
  of a scope beam, brightest where the trace just passed. Compositor-only,
  reduced-motion-gated, scoped to this stage so it never touches other scenes'
  fields (respecting the `--stage-field-tint` "amplify in the stage region only"
  rule, `design-idioms.css:568`).

### The `@starting-style` view, re-sold

- **Make the discrete card *visibly spring*, big.** The entry/exit
  (`StartingStyleTarget.vue:146-185`) is the right mechanism; give it a payload
  worth the bandwidth. Increase the `scale`/`translate` deltas so the card
  *clearly overshoots* on a bouncy preset (the `@starting-style` from-state at
  `:171-177` and the `.is-hidden` to-state at `:180-185` get more travel), and
  add a second, *staggered* element (a row of 3–4 chips entering on the SAME
  spring with `stagger()` delays — the library's own primitive) so you see the
  spring *ring through a sequence*, not one lonely pill. The bouncy preset should
  make the whole group visibly bounce in. This keeps the real
  `allow-discrete`/`@starting-style` machinery (per the modern-web guide:
  `transition-behavior: allow-discrete` stays a *separate* declaration, `:167`,
  exactly as required) and the reduced-motion snap (`:199-203`).
- **(Optional, progressive-enhancement) scroll-reveal the artifact.** If the
  scene ever gains vertical scroll, the `linear()` plot is a natural
  `view-timeline` entry/exit reveal — but ONLY behind
  `@supports ((animation-timeline: view()) and (animation-range: entry))` with
  no fallback (decorative), per the scroll-entry-exit guide. Not core; noted so
  the door is known.

---

## §The one unforgettable moment

**The derby.** Re-seat the target — drag the rail, or just double-click (it's
already bound, `SpringTarget.vue:72`). Four traces launch at once down four
parallel lanes, each in its own rainbow hue: **bouncy** (violet, ζ=0.45) leaps
*past* the shared target line, overshoots into the zone above it, and rings back
down through it twice before settling; **snappy** (green, ζ=0.65) crests just
over and tucks in; **smooth** (blue, ζ=0.86) eases up and kisses the line;
**gentle** (red, ζ=1.0, the critically-damped identity hue) creeps in from below
and *never crosses*. For about a second you are watching four differential
equations race, the overshoot lobes cresting over one shared graticule line like
four seismograph needles, the phosphor glow trailing each beam. Then they all
lock, the target line gives its one red-dashed settle-pulse, and the bench goes
quiet. No other scene is a *comparison* — the cube, the sphere, the box each have
ONE subject. The spring scene's subject is a *family*, so it alone can race them.
And it is the engine dogfooding its own `SpringProgress` four ways on one shared
re-seat — the most physics ever on screen at once in the whole demo, drawn as
the curve that physics actually is.

---

## §Implementation plan

Priority order — each step is self-contained and shippable.

1. **Plot the `linear()` string as an SVG trace** *(highest impact, lowest
   risk, no new physics)*
   New small component `demo/spring/SpringTrace.vue` (or inline SVG in
   `SpringTarget.vue`): parse `useSpringLinearStops`' output
   (`useSpringLinearStops.ts` already gives the reactive string) into
   `(pct, value)` points, draw a `<path>`, draw the target line at y=1, let the
   overshoot cross it. Replace the grey code block as the *primary* view in
   `StartingStyleTarget.vue:56` (keep the string as a demoted "source" detail
   under the plot). Kills the "data printed as text" offense; makes overshoot
   visible with zero solver changes.

2. **Phase-trace the live stage** *(the core metaphor fix)*
   `SpringTarget.vue:74-84` — replace the `.progress-rail` + `.spring-ball` with
   the trace plot (or augment: keep the ball as "now," add a fading history
   polyline). Drive it from the existing imperative painter (`:133-142`); drop
   `clampSweep` (`:124`) so the trace crosses the target line. Add the two-axis
   graticule (extend `.stage-field-x` with the `.stage-field-y` horizontal lines
   + a brighter target line at 1.0).

3. **Four lane hues from the rainbow family** *(the color move, derby
   prerequisite)*
   `design-idioms.css :root` — add `--spring-lane-{smooth,snappy,bouncy,gentle}`
   (= rainbow members). `SpringSidebar.vue:80-100` — set each cell's
   `--ball-tone` from its lane token (the `.progress-ball` recipe already keys on
   `--ball-tone`, no recipe re-author). Four cells become four colors.

4. **The derby stage** *(the signature)*
   New `useSpringDerby` (four `SpringProgress` solvers seeded from
   `SPRING_PRESETS`, `springPresets.ts`) sharing one re-seat. Render four
   full-width stacked lanes (one shared target line) in `SpringTarget.vue` (or a
   `SpringDerby.vue` swapped in on `demo.derby`). Wire `demo.derby`
   (`SpringTarget.vue:72`, already bound) + double-click + a "Race" verb beside
   the existing "Re-seat" ribbon button (`SpringScene.vue:152-170`). Each lane in
   its preset hue; the settle-pulse on lock.

5. **Live-morph the plot from the ζ slider + measurement readout**
   `SpringSidebar.vue:61-70` — already recomputes the `linear()`; the trace from
   step 1/2 re-plots reactively, so the lobe grows as you drag ζ. Add the Fira
   Code measurement row (`SpringTarget.vue:38-50` region): `ζ · overshoot% ·
   settle-time`, value glyphs `.readout-accent`, labels muted.

6. **Charge the drag gesture**
   `SpringTarget.vue:148-157` — swap `useDragScrub` for the library's `Draggable`
   (closed-form fling re-seat). Add the CSS-class press cue (tension line +
   target lift on `pointerdown`, release-fire). All compositor-only, reduced-
   motion-gated, pointerdown-swallow-safe (CSS-class, not gesture-intercept).

7. **Re-sell the `@starting-style` view**
   `StartingStyleTarget.vue:146-185` — bigger overshoot deltas; add a
   `stagger()`-delayed row of chips entering on the same spring so you see it
   ring through a sequence. Keep the separate `transition-behavior:
   allow-discrete` declaration (`:167`) + the reduced-motion snap (`:199-203`)
   exactly as the modern-web `animate-element-entry-exit` guide requires.

8. **Phosphor glow + hover ghost-trace + settle-pulse** *(atmosphere polish)*
   `SpringTarget.vue` scoped style — `drop-shadow` afterglow on the trace in the
   lane hue; preset-hover paints a faint ghost curve onto the plot; the target
   line's one red-dashed `outline` pulse on `demo.liveSettled`
   (`SpringTarget.vue:46`). All scoped to this stage, reduced-motion-gated.

Tokens touched: `design-idioms.css :root` (`--spring-lane-*`, optional
`--phosphor-*` defaults). Components touched, in order: `demo/spring/SpringTarget.vue`,
`demo/spring/StartingStyleTarget.vue`, `demo/spring/SpringSidebar.vue`, a new
`demo/spring/SpringTrace.vue` (+ optional `SpringDerby.vue`), `demo/spring/useSpringDemo.ts`
(the derby solvers + shared re-seat), `demo/app/scenes/SpringScene.vue` (the
"Race" ribbon verb). No glass-ui patching (all changes ride demo-owned token
layers + scoped styles, per inv-16); the `springLinearStops()` /
`SpringProgress` dogfood is preserved and *amplified* — the page finally plots
the curve it already emits.
