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
**laboratory instrument / measurement bench**, sitting on the demo's existing
graph-paper drafting substrate: a calibrated, slightly austere, high-contrast
surface where the *signal* is the hero and the GLASS card holds the bench and the
PAPER grid backs it. Think Tektronix scope face, a seismograph drum, a Braun
measuring device — but built *from the four pillars already on the page* (glass,
paper, audacious serif type, visible math), not bolted on as a new theme.

The current page expresses the spring as a **ball that slides on a rail** (the
`.spring-ball` traveling `.progress-rail`, `SpringTarget.vue:84`) — and that ball
is GOOD: it is the live "now" of the system, the imperative-painter dogfood, the
thing your eye locks onto. We KEEP it. What it *lacks* is the curve around it: a
1D ball pinned to a line shows position but hides overshoot — when ζ<1 and the
spring rings past its target, the ball clamps to the wall (`clampSweep`, `:124`).
So the refinement is not to remove the ball — it is to **let the ball draw its
own trajectory**: keep the rail, keep the ball, and add the **phase trace** as a
mathematical OVERLAY the ball rides through — the position curve drawn out in
time, the overshoot cresting *past* the target line and ringing back, exactly as
the `linear()` string already encodes (`springLinearStops.ts:65` emits values
that exceed 1 for ζ < 1 — the overshoot is *right there in the data*, currently
unplotted). The ball becomes the bright cursor on a curve it was always tracing.

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

1. **The ball-on-a-rail is good, but it has no curve around it — the overshoot
   is hidden (the single biggest opportunity).** `SpringTarget.vue:84` renders
   the protagonist as a `.progress-ball` traveling a horizontal `.progress-rail`
   (`:74`), positioned by an imperative `left: %` write (`:135-137`). The ball
   itself is *right* — it is the live "now," the painter dogfood, the eye's
   anchor; it stays. The defect is that the rail throws away the *shape*: a ball
   sliding left-to-right cannot show overshoot, so when ζ<1 and the spring rings
   past its target the code clamps it (`clampSweep`, `:124`, "the ball stays
   inside the track even though the read-out shows >1"). The most important
   visual fact about a spring — that it *exceeds and returns* — is present in the
   data but never drawn. The fix is *additive*: keep the ball, give it a trace.

2. **The `linear()` artifact — the page's crown jewel — is shown only as
   monospace text, never plotted.** `StartingStyleTarget.vue:56` renders the
   emitted `linear(0, 0.234 4.17%, …, 1)` string in a `text-mono-caption
   text-muted-foreground` code block. That code block is *correct and must stay*:
   it is the copy-pasteable deliverable, the literal output of
   `springLinearStops()` (`:60-72`), 26 stops a designer pastes into their
   stylesheet — and as raw mono type it already honors the audacious-type pillar
   (Fira Code, the engineering voice). The gap is not that it is text; it is that
   the page *only* offers the text and never the *picture*. There is a graph
   hiding in those 26 stops, and the refinement is to plot it ALONGSIDE the
   string — the two readings of one curve, numeral and trace, side by side — not
   to demote the numerals away.

3. **Two metric badges fight; the curve has no home.** `SpringTarget.vue:33-52`
   gives a big `.spring-readout-primary` displacement number (good — the K.W4
   re-tier was right to promote x) and a `settled`/`tracking` status badge. But
   the *velocity* is a muted caption afterthought (`:48-50`) and there is no
   trace of the curve's *shape* anywhere — no overshoot indicator, no settle-time
   readout, no "ζ < 1 → this one rings" cue. The numbers describe a point; the
   spring is a *trajectory*.

4. **The four preset cells repeat the rail without distinguishing the four
   springs.** `SpringSidebar.vue:79-101` renders four `ToggleChip` cells, each
   with its OWN in-cell `.preset-track` + traveling `.preset-ball` (`:93-99`),
   painter-driven at 60Hz (`:177-183`). The cells are fine as a *register* — they
   keep the ball-on-rail family the scene already speaks — but right now all four
   look the same: same red, same dot, no cue that bouncy and gentle are different
   curves. The refinement is small and additive: tint each cell its own lane hue
   (from the sanctioned rainbow family, §Color below) and let each cell's ball
   leave a faint curve-shaped wake, so the four cells *foreshadow* the four
   different curves without re-authoring the recipe. This is the derby's raw
   material, currently undifferentiated rather than wasted.

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
  copy-pasteable and fully present (`StartingStyleTarget.vue:56`) — the plot is
  its *companion*, not its replacement. Numeral and trace sit together: the
  designer reads one, copies the other, and the page honors both the artifact and
  the audacious-mono-type pillar that renders it.

### COLOR

- **Give the four presets four distinguishable lane hues — from the sanctioned
  rainbow family, used with proportion.** This is the headline color move and the
  derby's prerequisite. The rainbow crayons stay crayons: pure, saturated, and
  *intentful* — they fire only where the page's job is literally to tell four
  springs apart, never as ambient decoration. Add four demo tokens beside the
  rainbow set in `design-idioms.css :root`, mapping each preset to a member of the
  *already-owned* spectrum (so this is a consume, not a new identity):
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

### MOTION — the ball, and the trace it draws

- **Keep the ball + rail; add a 2D PHASE TRACE as the mathematical overlay it
  rides through (the core refinement).** The stage subject stays the live
  `.spring-ball` on its `.progress-rail` — but the rail gains a vertical
  dimension: a small SVG plot behind/around the ball with a horizontal **target
  line**, and the spring's position drawn as a **trace that crests over the line
  and rings back** when ζ<1. The ball is the bright cursor; the trace is the
  curve it has always been tracing, now made visible. Two sources of geometry,
  both pure dogfood, and they STACK rather than compete:
  - *Static curve (the graticule layer):* feed the live `linear()` stops into an
    SVG `<path>` (parse the `0.234 4.17%` stops → `(x=pct, y=value)` points). The
    overshoot is `y > 1` → the path *visibly crosses above the target line*. This
    is the `springLinearStops()` output finally *plotted* beside its own string —
    the math made beautifully visible (the visible-mathematics pillar), the
    crayon-red identity curve drawn against the paper graticule.
  - *Live trace (the comet):* keep the imperative painter
    (`SpringTarget.vue:133-142`) and have the *same* ball draw its own *history* —
    a fading polyline of the last ~1.2s of `live.value`, so re-seating leaves a
    comet-trail that shows the ring. The ball stays the *now*; it just drags its
    trajectory behind it.

  The overshoot becomes *the* visual event without ever removing the element the
  page already has. The `clampSweep` hack (`:124`) relaxes for the *trace's*
  vertical axis (the curve is *supposed* to cross the line); the ball's
  horizontal travel can keep its bounded rail. Refine, don't abrogate: the ball
  earns a second axis.
- **The derby (the signature easter-egg — see §below).** Four `SpringProgress`
  solvers, one shared re-seat, four traces racing in four lanes. It stays
  *earned, not default*: `demo.derby` is already wired to the double-click
  (`SpringTarget.vue:72`) — a discovered delight, not a permanent re-theme. The
  single live red spring is the resting state; the four-lane rainbow race is the
  moment you trigger. This gives the existing binding a stage worth watching
  while keeping the page calm at rest (proportion).
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

**The derby — a discovered delight, not the default.** At rest the page is the
one calm red spring: ball, rail, trace. Then you re-seat with intent — drag the
rail, or double-click (already bound, `SpringTarget.vue:72`) — and the bench
*blooms*: four traces launch at once down four parallel lanes, each in its own
rainbow hue: **bouncy** (violet, ζ=0.45) leaps *past* the shared target line,
overshoots into the zone above it, and rings back down through it twice before
settling; **snappy** (green, ζ=0.65) crests just over and tucks in; **smooth**
(blue, ζ=0.86) eases up and kisses the line; **gentle** (red, ζ=1.0, the
critically-damped identity hue, the crayon held back for the one that *doesn't*
cross) creeps in from below and *never crosses*. For about a second you are
watching four differential equations race, the overshoot lobes cresting over one
shared graticule line like four seismograph needles, the phosphor glow trailing
each beam. Then they all lock, the target line gives its one red-dashed
settle-pulse, the rainbow drains back to the single resting red, and the bench
goes quiet. The race is the easter egg; the calm is the home state. No other
scene is a *comparison* — the cube, the sphere, the box each have ONE subject.
The spring scene's subject is a *family*, so it alone can race them. And it is the
engine dogfooding its own `SpringProgress` four ways on one shared re-seat — the
most physics ever on screen at once in the whole demo, drawn as the curve that
physics actually is, and proportioned to fire only when you ask for it.

---

## §Implementation plan

Priority order — each step is self-contained and shippable.

1. **Plot the `linear()` string as an SVG trace, BESIDE its string** *(highest
   impact, lowest risk, no new physics)*
   New small component `demo/spring/SpringTrace.vue` (or inline SVG in
   `SpringTarget.vue`): parse `useSpringLinearStops`' output
   (`useSpringLinearStops.ts` already gives the reactive string) into
   `(pct, value)` points, draw a `<path>`, draw the target line at y=1, let the
   overshoot cross it. The existing mono code block (`StartingStyleTarget.vue:56`)
   STAYS as the copy-pasteable numeral reading + `CopyButton`; the plot is added
   adjacent (the two readings of one curve, type and trace). Closes the "only
   text, never plotted" gap; makes overshoot visible with zero solver changes and
   zero loss of the artifact a designer copies.

2. **Add the phase trace to the live stage (keep the ball + rail)** *(the core
   refinement)*
   `SpringTarget.vue:74-84` — keep the `.progress-rail` + `.spring-ball`; wrap
   them in the trace plot so the ball reads as the cursor on the curve, and add a
   fading history polyline driven by the SAME imperative painter (`:133-142`).
   Relax `clampSweep` (`:124`) on the trace's vertical axis so the curve crosses
   the target line (the ball's horizontal rail can stay bounded). Add the
   two-axis graticule (extend `.stage-field-x` with the `.stage-field-y`
   horizontal lines + a brighter target line at 1.0) on the paper substrate.

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
`SpringProgress` dogfood is preserved and *amplified* — the page keeps every
element it has (ball, rail, string, red identity, preset cells) and adds the
trace, the graticule, and the lane hues *around* them. Every clause is additive:
nothing the page already does well is removed, only the curve it was missing is
drawn.

---

## §Design verdict reconciliation

What was REVERSED or tempered to honor the design verdict (refine-not-abrogate,
keep the crayons proportioned, signatures as easter eggs):

- **REVERSED — "Replace the 1D ball-on-rail" / "the trace, NOT the ball" /
  "the single worst offender."** The verdict names this page's clause by hand:
  *"spring's 'kill the ball-on-a-rail and PLOT a phase trace' becomes 'KEEP the
  ball + rail, refine them, and ADD the phase/graticule as a mathematical
  overlay/easter-egg.'"* The ball is now KEPT as the live cursor; the phase trace
  is layered *around* it (the ball draws the curve it was always tracing). The
  §Motion header is now "the ball, and the trace it draws"; audit clause 1 is
  reframed from "worst offender" to "biggest additive opportunity"; impl step 2
  keeps `.progress-rail` + `.spring-ball` and *wraps* them. `clampSweep` is
  *relaxed on the trace's vertical axis*, not deleted — the ball's bounded rail
  survives.
- **TEMPERED — "demote the `linear()` string to a view-source detail" /
  "rendering plottable data as muted grey text" / "printed as text."** The mono
  code block is the copy-pasteable artifact AND already honors the
  audacious-mono-type pillar (Fira Code). It STAYS, fully present, beside the new
  plot — numeral and trace as two readings of one curve. The plot is a companion,
  never a replacement; the `CopyButton` deliverable is untouched.
- **KEPT + PROPORTIONED — the crayons.** The rainbow lane hues
  (`--spring-lane-*` from `--rainbow-*`, `design-idioms.css:78-90`) are NOT killed
  and NOT replaced — they are *consumed* exactly where the page's job is to tell
  four springs apart, and held back everywhere else. The single live spring keeps
  the canonical crayon-red identity (`--color-progress`); the critically-damped
  "gentle" lane is the red crayon used with intent (the one that *doesn't* cross).
  Saturated primaries fire as a restrained signature, never as ambient wash.
- **FRAMED AS EASTER EGG — the derby.** Already gated behind the
  double-click/re-seat (`SpringTarget.vue:72`), so it is naturally a *discovered*
  delight, not a dominant re-theme. The doc now states the resting state (one calm
  red spring) explicitly and frames the four-lane rainbow race as the moment you
  *trigger*, draining back to red on settle — proportionate, not a permanent
  re-skin.
- **AMPLIFIED — the four pillars.** Glass (the resting Card + dock), paper (the
  graticule now drawn on the existing drafting substrate), audacious type
  (Instrument-Serif display + the new Fira Code engineering-annotation stratum,
  pushed bolder/more mathematical), and visible mathematics (the `linear()` curve
  finally plotted, ζ/overshoot/settle named) are all *enhanced in place*, never
  swapped.
