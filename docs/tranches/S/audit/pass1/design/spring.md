# Spring scene — design audit (Tranche S, pass 1)

> Page: `#/spring` (keyframes.babb.dev). Sources: `demo/scenes/spring/*`.
> Evidence: `docs/tranches/S/audit/pass1/design/screenshots/spring-{mobile,laptop,desktop}.png`.
> Analysis only — no source modified.

---

## 1. Product truth — what the page IS and is FOR

The spring scene is the library's **physics instrument bench**: one live
`SpringProgress` solver (a red ball chasing a re-seatable target on a rail,
`SpringTarget.vue:63-95`), parameterized by `response` / `damping (ζ)` sliders and
a 20×20 analytic **parameter-space heatmap** (`SpringHeatmap.vue`), with the same
curve read three more ways — a `springTimingFunction` sweep sampler
(`SpringTarget.vue:135-147`), the `linear()` 26-stop **plot** (`SpringTrace.vue`),
and a second view where that same spring eases a real
`@starting-style`/`allow-discrete` CSS transition with a copy-pasteable
`transition-timing-function` artifact (`StartingStyleTarget.vue:51-57`). It exists
to prove the LIGHT spring surface (`SpringProgress`, `springTimingFunction`,
`springLinearStops`, `Draggable` — the control pane itself is flung by the
engine, `useSpringPaneDrag.ts:83-84`) is real, live, and shippable: the page's
subject is not an object but a *family of curves*, culminating in the hidden
four-lane rainbow **derby** (`useSpringDerby.ts`) where bouncy (ζ=0.45) rings past
the target line and gentle (ζ=1.0) never crosses.

---

## 2. Usability · affordance discoverability · interactability

### Findable unaided (desktop)
- **The rail re-seat** — `cursor-pointer`, a dashed ghost target marker, and an
  explicit instruction sentence ("Tap or drag the rail…", `SpringTarget.vue:127-131`).
  The one gesture the page teaches in words. Good.
- **Sliders + presets** — the labeled-field grammar (`SpringSidebar.vue:57-77`) and
  four preset cells with live in-cell balls; the red-dashed active ring
  (`SpringSidebar.vue:286-289`) reads as state, not decoration.
- **The heatmap** — `cursor-crosshair` + a live marker + a two-ended legend
  ("← underdamped (rings) / critical / overdamped →", `SpringHeatmap.vue:51-54`).
  Desktop users will probably try a click. See mobile caveats below.
- **Pane drag** — a grip glyph with `cursor-grab` + `title` (`SpringSidebar.vue:29-38`).
  Subtle but conventional.

### Hidden / unaided-undiscoverable
- **THE DERBY IS INVISIBLE.** The scene's single most memorable moment — four
  `SpringProgress` solvers racing four rainbow lanes — is bound ONLY to
  `@dblclick` on the rail (`SpringTarget.vue:73`). No hint text, no ribbon verb, no
  tooltip mentions it. The prior design treatment (`docs/frontend-design/demo/spring.md`
  §Implementation step 4) specified a "Race" verb beside "Re-seat" in the ribbon
  (`SpringScene.vue:152-170`); it was never shipped. On **touch**, `dblclick` is
  effectively unreachable — the egg does not exist on mobile at all.
- **The pane fling** — releasing a drag with velocity flings the card on the
  engine's closed-form spring (`useSpringPaneDrag.ts:110-125`). Delightful, but
  nothing suggests the card has momentum; most users will slow-drag and never feel it.
- **The plot ↔ string split.** The solver view shows the `linear()` PLOT with no
  copyable string (`SpringTrace.vue:9-15`); the discrete view shows the copyable
  STRING with no plot (`StartingStyleTarget.vue:51-57`). The design doc's "two
  readings of one curve, side by side" ended up one reading per tab — a user on
  either view never learns the other reading exists.
- **Keyboard paths exist but are unadvertised**: rail arrows/Home/End
  (`SpringTarget.vue:234-248`), heatmap arrow-stepping (`SpringHeatmap.vue:230-258`).
  Fine for a demo, but the rail lacks a visible focus treatment (see §6).

### Feedback loops
Excellent overall: the 60 Hz painter channel moves ball/sampler/scrubber together
(`useSpringHotPath` seam), scrub-while-idle works (`useSpringDemo.ts:268-276`),
the settled/tracking badge flips live, and the target line fires one settle-pulse
(`SpringTarget.vue:82-85`). The heatmap click → marker + sliders + rail all update
in one motion (shared refs, `SpringHeatmap.vue:220-221`). No dead controls found
in source.

### Touch targets
- Rail: `h-12` (48px) — good.
- Heatmap: large field — good; but a fat-finger tap lands ±half-cell by design
  (`SpringHeatmap.vue:82-83`), acceptable.
- **Sliders: the filled track reads as an inert dark pill in all three screenshots
  — no visibly distinct thumb**, and the track band is well under 44px tall. As the
  page's primary tuning control this is the weakest interactive read on the page
  (component is glass-ui `LabeledSlider`; any fix belongs in glass-ui per the
  root-changes rule).
- Drag handle, re-sample button: small (~24px) but secondary.

### Empty / loading states
None needed and none missing: the scene auto-plays (`SpringScene.vue:182`), the
heatmap paints synchronously at mount (`SpringHeatmap.vue:267-269`), the ball is
live on first paint. The only "blank-looking" state is the heatmap's top band —
see §4/#4 — which is *correct math* (overshoot = 0 for ζ ≥ 1 spans ~38% of the
rows, `SpringHeatmap.vue:100-104`) that *reads* as unrendered space.

### Mobile (375px shot) specifically
The mobile experience inverts the page's hierarchy:
1. **The bottom sheet is born-open and occludes the stage.** `SpringScene.vue:47`
   forces `isControlsPanelOpen = true`; at 375px the sheet covers ~85% of the
   viewport — the SpringProgress readout, rail, ball, sweep, and plot are all
   invisible. A first-time mobile visitor sees a control panel for a demo they
   cannot see.
2. **The heatmap's top ~38% is pure white** and at mobile scale it dominates the
   sheet — it reads as a broken/unloaded image rather than the overdamped regime.
3. **The derby cannot be triggered** (dblclick-only; and the rail is under the
   sheet anyway).
4. **Slider affordance**: the dark fill-pills with no visible thumb are hardest to
   parse at mobile size; they look like static status bars.
5. **Label wrap**: "parameter space — overshoot" wraps to two lines against the
   value column (`SpringHeatmap.vue:16-22`) — a minor but visible raggedness in an
   otherwise tight mono grammar.

---

## 3. Aesthetic critique (against glass-ui + the demo's four pillars)

**Verdict: distinctive — this is one of the demo's strongest pages, and it
visibly dogfoods the engine everywhere.** The laboratory-instrument direction
from the design treatment landed: graph-paper substrate, glass stage plate,
cartoon-quiet control rail, Instrument Serif display ("SpringProgress",
`SpringTarget.vue:35-37`) over Fira Code measurements, and the audacious red
`x 1.000` poster numeral (`.spring-readout-primary`, `SpringTarget.vue:267-274`)
is a genuine typographic moment — the number IS the hero.

- **Typography** — the display/mono stratification is disciplined and on-system
  (`text-display` / `text-mono-caption` / `.readout-accent`). One gap: the
  treatment's "instrument annotation row" (`ζ · overshoot · settle` as labeled
  measurements) was never shipped, so the bench still describes a *point* (x, v)
  rather than naming the *curve* — the analytic overshoot function is literally
  already written in the codebase (`SpringHeatmap.vue:100-104`), unused by the readout.
- **Color** — exemplary token discipline. The monochrome red identity
  (`--color-progress` via the `--ball-tone` seam, `SpringTarget.vue:257-259`) rules
  the resting state; the sanctioned `--spring-lane-*` rainbow (`design-idioms.css:117-120`)
  fires only during the derby; the heatmap tints via `color-mix(in oklab, …)` off
  the live token so dark mode re-tints for free (`SpringHeatmap.vue:169-170`). Red =
  "the spring I'm driving," rainbow = "the family I'm comparing" — both truths coexist.
- **Motion quality** — the motion is the *product's own physics*, not CSS garnish:
  painter-positioned balls off the render graph, the closed-form pane fling, the
  spring-eased `@starting-style` card, one quiet 220ms settle-pulse. Proportioned:
  the page rests calm; the derby blooms and drains back (`useSpringDerby.ts:96-107`).
- **Composition** — the stage column (`max-w-3xl`) stacks readout → rail → sweep →
  plot cleanly; the desktop shot shows the sidebar's keyframes editor clipping at
  the viewport bottom (acceptable — the band scrolls, `SpringSidebar.vue:304-309`),
  and the pane is user-draggable when it collides. The weakest compositional read
  is the heatmap's blank upper band (correct math, poor optics — no ζ=1 boundary
  line names WHY it's white, and since the tint varies only with ζ the response
  axis looks *dead*: half a 2D instrument carries zero visual information).
- **Memorable vs generic** — the heatmap, the plotted overshoot cresting the
  dashed target line, and the derby make this page memorable; nothing here is
  template slop. The failure mode is not blandness but **buried treasure**: the
  two most distinctive behaviors (derby, fling) are invisible, and the mobile
  presentation hides the protagonist entirely.

---

## 4. Ranked refinements (tasteful, on-system, wave-shaped)

1. **Ship the "Race" ribbon verb** — WHAT: a `Race` button (Flag/Zap icon) beside
   `Re-seat` calling `demo.derby()`; WHERE: `SpringScene.vue:152-170`
   (`ribbonContent`), verb already exported (`useSpringDemo.ts:438`); WHY: the
   scene's signature moment is dblclick-only (`SpringTarget.vue:73`) — invisible on
   desktop, nonexistent on touch; the prior treatment specified this and it was
   never built. One `h(Button…)` block; zero new state.
2. **Let the mobile sheet open at peek height (or closed) on small viewports** —
   WHAT: don't force the panel fully open at 375px; open to a peek band showing
   the view-switcher + sliders, stage visible above; WHERE: `SpringScene.vue:47`
   (`storedControls.isControlsPanelOpen = true`) + the sheet-gesture composables
   (`useSheetGesture`/`useSheetSpring`); WHY: the mobile shot shows the sheet
   occluding the entire stage — the demo's protagonist is invisible on first visit.
3. **Reunite plot and string** — WHAT: add the `linear()` string + `CopyButton`
   (the exact artifact block from `StartingStyleTarget.vue:51-57`) beneath the plot,
   collapsed to one mono line; WHERE: `SpringTrace.vue:9-15` header row; WHY: the
   "two readings of one curve" are currently split across two tabs — solver users
   get a picture they can't copy, discrete users get a string they can't see.
4. **Name the ζ=1 boundary on the heatmap** — WHAT: draw one hairline at the ζ=1
   row with a tiny `ζ=1` mono tag, and add a faint sub-tint (e.g. settle-time vs
   response) so the overdamped band and the x-axis both read as *measured*, not
   blank; WHERE: `SpringHeatmap.vue:135-180` (`paint()`); WHY: the top ~38% of the
   field is uniformly white (correct: overshoot=0 for ζ≥1) and reads as unloaded
   space, especially at mobile scale — and the response axis currently carries zero tint.
5. **Add the instrument-annotation row** — WHAT: `ζ 0.86 · overshoot +4% · settle
   0.61s` as a mono row under the `x` readout (values `.readout-accent`, labels
   muted); WHERE: `SpringTarget.vue:38-51`; the overshoot closed-form already
   exists at `SpringHeatmap.vue:100-104` (lift to a shared helper), settle-time
   from the `linear()` stops; WHY: the bench readout describes a point (x, v) while
   the page's subject is a trajectory — this names the curve's properties in the
   lab voice the page already speaks.
6. **Give the rail its focus ring** — WHAT: add the demo's `.focus-ring` idiom;
   WHERE: `SpringTarget.vue:63` (the `role="slider"` rail, `tabindex="0"`); WHY:
   the heatmap carries `.focus-ring` (`SpringHeatmap.vue:31`) but the page's PRIMARY
   keyboard control has no visible focus treatment — keyboard users can't tell the
   rail is focused before pressing arrows.
7. **Slider thumb legibility (glass-ui dispatch)** — WHAT: a visible thumb /
   accent-toned fill on `LabeledSlider` so response/ζ read as adjustable, not as
   dark status pills; WHERE: glass-ui repo (per the root-changes rule — not
   patched in demo); WHY: in all three screenshots the page's primary tuning
   controls have no discernible thumb or track contrast.
8. **Derby touch path + lane-tag crowding** — WHAT: (with #1 shipped) also map a
   double-TAP (pointer-based, 300ms window) on the rail to `demo.derby()`, and nudge
   `.derby-lane-tag` (`SpringTarget.vue:414-421`) inset so four tags don't collide
   at narrow widths; WHERE: `SpringTarget.vue:73` + scoped styles; WHY: touch
   parity for the egg and clean lane labels at 375px.

---

## 5. The easter egg — "the pane inherits your physics"

**Concept:** the control pane's fling spring stops being hard-coded and becomes
*your* spring. `useSpringPaneDrag.ts:79-84` currently flings the card on a fixed
`{ response: 0.18, dampingFraction: 0.9 }`. Pass the live `demo.response` /
`demo.dampingFraction` getters in instead (clamped to a sane band): now crank ζ
down to 0.3, grab the grip handle, fling the card — and **the instrument itself
rings**, overshooting and settling on exactly the curve you just tuned. Set
gentle and it glides; set bouncy and the whole control bench wobbles home. It is
discovered through an affordance that already exists (the drag handle), costs two
getter parameters and a clamp, dogfoods `Draggable` + `SpringProgress` in the
page's own laboratory voice ("everything on this bench obeys the dial"), and
degrades safely: under `prefers-reduced-motion`, keep the stiff defaults so the
card never rings. The moment of realization — "wait, the *panel* is on my spring
too" — is exactly this page's kind of joke.

---

## 6. Accessibility notes (from source)

- **Rail**: `role="slider"` + `aria-label` + `aria-valuenow/min/max` + `tabindex=0`
  + Arrow/Home/End handling (`SpringTarget.vue:66-73, 234-248`). GOOD — but no
  `.focus-ring`/`:focus-visible` treatment (refinement #6), and `aria-valuetext`
  ("target 40%") would read better than a bare percent.
- **Heatmap**: `role="application"` + a descriptive label naming both axes and the
  keyboard path; canvas `aria-hidden`; `.focus-ring`; arrow keys step one cell
  (`SpringHeatmap.vue:29-38, 230-258`). Strong for a canvas instrument.
- **Derby overlay + markers**: `aria-hidden="true"` (`SpringTarget.vue:85, 108`)
  — correct, decorative. No SR announcement of the race; acceptable for an egg.
- **View switcher**: `KfPillTabs` is `role=tablist/tab` by construction
  (`SpringSidebar.vue:41-50`) — the DM-5 ARIA fix noted in source.
- **Reduced motion**: settle-pulse + derby fade gated (`SpringTarget.vue:428-435`);
  heatmap marker transition gated (`SpringHeatmap.vue:319-323`); the discrete card
  transitions to an instant toggle (`StartingStyleTarget.vue:199-203`). The live
  ball physics itself still animates under PRM (the scene auto-plays,
  `SpringScene.vue:182`) — arguably the page's content, but a PRM-paused initial
  state would be the stricter reading.
- **Contrast**: badge tones ride the documented ≥4.5:1 `--badge-tone` contract
  (`design-idioms.css:639+`); the heatmap marker keeps a `--background` ring +
  glow so it survives saturated cells (`SpringHeatmap.vue:299-317`). Watch items:
  `text-mono-caption text-muted-foreground` labels over the glass plate, and the
  heatmap's mid-band tint vs the white marker ring in light mode.
- **Focus order**: handle (button) → tabs → sliders → heatmap → preset chips →
  editor — logical, matches visual order.

---

**Grade: B+.** A genuinely distinctive instrument page with exemplary token and
dogfooding discipline, held back by discoverability debt (the derby and fling are
invisible; plot/string split) and a mobile presentation that hides its own
protagonist behind the control sheet.
