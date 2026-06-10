# Pane Audit — Square Scene
**Tranche J · Design Audit · pane-square lane**

## Overview

The Square scene is the most primitive of the demo's stages: a single mint-aquamarine
box, directly draggable, with two-axis spring physics and a nested-object `transformFunc`
as the library primitive. Its design problem is equally primitive: the subject is the
whole point, yet the scene gives it almost nothing to stand against. The checkered
background reads as *empty* rather than *clean*, the "drag me" callout is undersized
mono text, the color is pleasant but unmotivated, and the scene ships zero visual
language beyond the box itself. The controls panel composes passably on desktop but
collapses hierarchy on mobile.

---

## Screenshot Index

| File | Viewport | State |
|------|----------|-------|
| `square-mobile.png` | 375 w | controls closed |
| `square-mobile-open.png` | 375 w | controls open (sheet raised) |
| `square-laptop.png` | 1280 w | controls open (left rail) |
| `square-laptop-open.png` | 1280 w | controls panel + playing (Pause/Reverse shown) |
| `square-desktop.png` | 1440 w | controls open |
| `square-desktop-open.png` | 1440 w | playing state |

---

## Findings Table

| ID | Sev | Title | Evidence | File | Owner |
|----|-----|-------|----------|------|-------|
| SQ-1 | P1 | Subject sinks to lower-right quadrant at all desktop breakpoints | `square-laptop.png`, `square-desktop.png` — box center is ~55–60 % from left, ~55 % from top; not optically centered in the stage cell | `SquareScene.vue` `.square-stage` | kf-demo |
| SQ-2 | P1 | "drag me" label is invisibly small mono at body scale — the principal affordance communication fails | `square-mobile.png` center region — `font-size: var(--type-body)` + `font-weight: bold` at 12 rem box renders text ~14–16 px; no hierarchy signal to the affordance | `SquareScene.vue` `.demo-box` | kf-demo |
| SQ-3 | P1 | Stage background is raw checkered pattern — no glass surface registers the subject as protagonist | All screenshots — the box floats over the repeating SVG checker; no card, no panel depth, no tonal field; the box has no "stage" | `SquareScene.vue`, `EditorShell.vue` `.grid-background` | kf-demo |
| SQ-4 | P2 | Box corner radius (`--radius-lg`) inconsistent with the glass-ui `rounded-card` protagonist plate the other scenes use | `square-laptop.png` — box corners are subtly less rounded than the spring/easing stage Cards | `SquareScene.vue` `.demo-box { border-radius: var(--radius-lg) }` | kf-demo |
| SQ-5 | P2 | `background-color: aquamarine` is a hard-coded CSS named color — not a design-token; no dark-mode variant | `SquareScene.vue` line 162 | kf-demo |
| SQ-6 | P2 | `box-shadow: 0 0 0 0.5rem color-mix(…)` halo is low-contrast and visually disappears against the light background | `square-laptop.png` — the box ring is nearly invisible; adds no depth signal | `SquareScene.vue` line 163 | kf-demo |
| SQ-7 | P2 | Spring-state readout (aria-valuetext only, no visible readout) — the math that is the brand (x/y deflection, spring ζ) is invisible | All screenshots — no numeric readout, no coordinate display; the spring math is hidden in aria attributes only | `SquareScene.vue` | kf-demo |
| SQ-8 | P2 | Mobile: box overflows into the controls sheet at `square-mobile.png`; the box top edge is ~245 px from top in a ~375 px viewport leaving ~20 px clearance before the sheet handle | `square-mobile.png` — box clips to bottom of visible stage area | `AnimationControlsGroup.vue` / `SquareScene.vue` | kf-demo |
| SQ-9 | P2 | Playback ribbon's `Play`/`Pause` button uses `btn-playback-accent` (accent-red) but the box and its spring are green/aquamarine — the accent color fights the subject's palette | `square-laptop-open.png` — red Play + pink ball against mint box; dissonant | `PlaybackRibbon.vue`, `playback-button.css` | kf-demo |
| SQ-10 | P2 | AnimationVisualizer ball is `bg-accent-red` and the dashed ghost is `border-accent-red/40` — accent-red is a warm-red action token, but in this scene the spring is the physics, and the progress ball has no relation to the box color | `square-laptop-open.png` — the red ball in the controls card disconnects from the teal/aquamarine subject | `AnimationVisualizer.vue` | kf-demo |
| SQ-11 | OPP | Empty stage left half (desktop/laptop, panel-closed state) is wasted whitespace — opportunity for a mathematical annotation: spring phase portrait, axis coordinate overlay, or deflection grid | `square-laptop.png` — right half has the box, left half has controls; upper-right stage quadrant (≥ 500 px wide) is empty | `SquareScene.vue` | kf-demo |
| SQ-12 | OPP | "drag me" could be a Instrument Serif display line — the scene has no typography moment; the box is the only brand element and it gets body-mono text | `square-laptop.png` center box | `SquareScene.vue` | kf-demo |
| SQ-13 | OPP | The double-click "tumble" easter egg sweeps #C462D8→#7E6BE8→#52E898 — these are exactly the saturated audacious pops the design language calls for; they are invisible to first-time users and not hinted visually | `square-laptop.png` — no hint of the egg in the resting state | `SquareScene.vue`, `useSquareAnimations.ts` EGG_HUES | kf-demo |
| SQ-14 | OPP | The box has no gradient or depth — using a linear gradient from the egg palette (#C462D8 → aquamarine), or a radial center highlight, would read as the "proportionate audacious pop" the brief calls for without decorating chrome | All screenshots — solid flat `aquamarine` | `SquareScene.vue` `.demo-box` | kf-demo |
| SQ-15 | OPP | The controls panel (two stacked glass-ui Cards: options + PlaybackRibbon) has a gap between them on laptop/desktop — the vertical space between the two cards at `square-laptop.png` is ~20 px but no divider or visual grouping signals they are related | `square-laptop.png` — two isolated white cards with implicit relationship | `ControlsPaneWrapper.vue` / glass-ui Card layout | glass-ui-handoff |
| SQ-16 | OPP | The scene has no scene-specific icon in the dock (the purple diamond glyph is generic across scenes); the scene's mathematical identity — ∇·spring, dual-axis, nested transform — has no icon moment | `square-laptop.png` top-center — generic diamond icon | `AnimationMenuBar.vue` / scenes icon data | kf-demo |

---

## Detailed Findings

### SQ-1 · P1 · Subject off-center in stage cell
**Evidence:** `square-laptop.png` and `square-desktop.png`: the box sits at roughly
(60 %, 55 %) of the stage area (right-of-center, below optical center). `.square-stage`
uses `flex items-center justify-center` which should center it, but the `stage-cell` in
`AnimationControlsGroup.vue` is a `col-2` grid item and `h-full / self-center` — with the
left-rail controls open, the stage cell gets the 1fr remainder. The box appears well to the
right and below center. The optical-bias top offset (`--work-area-vertical-bias-top: 0.42`)
governs the work area, not the box within the stage. The net result: the subject is not the
geometric or optical center of what the user sees.

**Proposal:** In `.square-stage` ensure the `flex` container is truly `h-full w-full` and
that no ancestor clipping narrows it. On desktop confirm the stage cell actually gets the
full remaining viewport height. Consider using `place-items-center` on the stage grid cell
directly. The box should be the first thing the eye reaches, not the second.

### SQ-2 · P1 · "drag me" affordance too small
**Evidence:** `square-mobile.png` — the label is `font-size: var(--type-body)` (≈14 px),
`font-weight: bold`, `font-family: font-mono`. At 12 rem (192 px) box size this is a tiny
caption relative to the card.

**Proposal:** The drag-me label is the ONLY affordance communication. Promote it to at
minimum `text-subheading` (glass-ui φ-ladder step up from body), ideally use `font-display`
(`Instrument Serif`) at `text-heading` or larger, letterspaced, perhaps with `opacity-60`.
The brand language for audacious type applies here — this is the "what to do" moment.
Alternatively: a visual cursor icon as SVG overlaid on the box center is cleaner than text.

### SQ-3 · P1 · No protagonist plate — subject floats without a stage
**Evidence:** All screenshots — the aquamarine box floats directly on the checkered grid
background. Every other scene wraps its protagonist in a glass `<Card surface="glass"
tier="resting">` (the I5 stage-card register). The Square scene omits this entirely.

**Proposal:** Wrap the `.square-stage` area in the standard glass protagonist plate
(a shadowless `<Card surface="glass" tier="resting" :shadow="false">`) as the stage
container. This gives the drag arena a calm glass surface that recedes behind the subject
while visually bounding the interaction zone. The card's `rounded-card` also resolves SQ-4
for free. File: `SquareScene.vue`, match the pattern in `SpringTarget.vue` or
`EasingTarget.vue`.

### SQ-4 · P2 · Corner radius inconsistency
**Evidence:** `square-laptop.png` — the box uses `border-radius: var(--radius-lg)`, while
the glass-ui Card uses `rounded-card`. On the protagonist-plate swap (SQ-3), the box itself
can keep `--radius-lg`; the plate should use `rounded-card`. Current mismatch between
box radius and the absence of a card frame makes the scene look ad-hoc vs. the easing/spring
scenes.

**Proposal:** Adopt the stage-card register (SQ-3); box radius stays `var(--radius-lg)` or
promote to `rounded-card` for visual alignment with glass-ui's system.

### SQ-5 · P2 · Hard-coded `aquamarine` CSS named color
**Evidence:** `SquareScene.vue` line 162: `background-color: aquamarine`. This is not a
glass-ui token, not a demo token, not dark-mode-aware. The tumble egg already defines
`EGG_HUES = ["#C462D8", "#7E6BE8", "#52E898"]` — the green stop `#52E898` is close to
aquamarine (slightly more saturated). 

**Proposal:** Replace `aquamarine` with `var(--color-mint, #52E898)` — a named demo token
(add to `style.css :root`) that also feeds the tumble egg's end-stop so the resting color
IS the tumble color (they share the same identity). This opens the door to SQ-14 gradient
opportunity and removes the only raw CSS named color in the scene code.

### SQ-6 · P2 · Box halo is imperceptible
**Evidence:** `square-laptop.png` box border region — `box-shadow: 0 0 0 0.5rem
color-mix(in srgb, var(--background) 50%, transparent)` creates a diffuse white ring at 50 %
opacity that is nearly invisible on the light grid background.

**Proposal:** Either remove the halo (the stage-card plate, SQ-3, provides depth instead)
or replace it with a colored glow that amplifies the spring energy: e.g.
`box-shadow: 0 0 1.5rem 0.5rem color-mix(in srgb, var(--color-mint) 30%, transparent)`.
The glow should DEEPEN with spring deflection (already possible in the `transformFunc`
callback), making physics tangible.

### SQ-7 · P2 · Spring math invisible — no live readout
**Evidence:** All screenshots — `springReadout.x / .y` are written to `aria-valuetext`
but never rendered visually. The scene's entire identity is "two springs, one box,
custom transform math." The math is the brand.

**Proposal:** Add a small Fira Code readout below or beside the box — `x: 0.00 / y: 0.00`
in `text-caption font-mono text-muted-foreground`, updating live as the spring tracks. This
is the "mathematical motif" the brief calls for, and it makes the physics tangible. Keep it
subtle (caption scale, muted color) so it informs without competing. File: `SquareScene.vue`
template.

### SQ-8 · P2 · Mobile box clips at sheet threshold
**Evidence:** `square-mobile.png` — the box bottom edge sits ≈ 240–250 px from top in a
375 px viewport; the sheet handle is at ≈ 360 px leaving only ~15 px clearance. The box
visual mass extends nearly to the sheet edge, creating occlusion risk.

**Proposal:** The `.square-stage { overflow: hidden }` combined with the work-area height
logic (`--work-area-max-height` on mobile) should give enough room, but the box size
(`--size: 12rem = 192px`) relative to the available stage height may be too large. Consider
reducing to `10rem` on mobile via a media query, or applying the stage-card plate (SQ-3)
which pads the arena and prevents visual clipping.

### SQ-9 / SQ-10 · P2 · Accent-red playback palette fights the teal subject
**Evidence:** `square-laptop-open.png` — the Play/Pause button is `btn-playback-accent`
(accent-red), the visualizer ball is `bg-accent-red`, and the ghost/dashed target is
`border-accent-red/40`. Against the mint/aquamarine box these are discordant.

**Proposal (kf-demo side):** The PlaybackRibbon button class `btn-playback-accent` is
applied in `PlaybackRibbon.vue` line 28. Consider making the accent color a token per scene
(or per animation target color). For the square scene specifically, the natural accent is
`--color-progress` (the green) which harmonizes with the teal subject. This is a broader
single-token theming ask rather than a per-scene patch — but worth noting that the red/mint
dissonance is most visible in this scene since no other scene has such a warm accent vs.
cool subject.

---

## Suffusion Opportunities (Detail)

### SQ-11 · OPP · Empty stage quadrant → spring phase portrait
**Evidence:** `square-laptop.png` — with the controls panel open, the right ~880 px of
the stage is blank except the box. The upper-right area is completely empty.

**Proposal:** Render a faint, low-opacity spring phase portrait (position vs. velocity) or
a 2D coordinate grid showing the spring's live deflection axes. This could be an SVG `<g>`
drawn on a `<canvas>` or inline SVG inside `SquareScene.vue`. It dogfoods the math brand
perfectly: the grid *is* the animation engine's state space. Token: draw using
`var(--color-progress)` at 8–12% opacity. Update: on spring tick, draw the current
(x, y) point as a dot.

### SQ-12 · OPP · Display typography moment
**Evidence:** `square-laptop.png` — the box has mono body text; all other scenes use
Instrument Serif for their display moments (start screen title, scene name headers).

**Proposal:** Remove the body-mono "drag me" text from inside the box. Instead, place a
large, faint Instrument Serif label — perhaps the word "drag" at `text-display-4` in
`text-muted-foreground/20` — as a background watermark in the stage, visible through the
glass plate. The box itself is then text-free (the affordance is communicated by the cursor
and a subtle grab handle icon). This is the "large and audacious typography" call — one
moment, proportionate.

### SQ-13 · OPP · Tumble egg hint
**Evidence:** All resting-state screenshots — the `#C462D8 → #52E898` palette sweep is
completely hidden. Users who do not double-click see a plain mint box forever.

**Proposal:** Add a faint, animated double-chevron (`⟳`) or sparkle icon at the top-right
of the box at low opacity (`opacity-30`), or a single sentence below the box in caption-mono:
`dbl-click to tumble`. Alternatively, after 3s of idle time, pulse the box with a single
frame of the egg palette (a flash-hint). This is the scene's only delight moment — it should
be discoverable.

### SQ-14 · OPP · Box gradient — audacious pop within proportion
**Evidence:** All screenshots — the box is flat `aquamarine`. The EGG_HUES palette is
available as the resting-to-active color range.

**Proposal:** Apply a subtle radial gradient to the box resting state:
`background: radial-gradient(circle at 35% 35%, var(--color-mint-light, #7EFFD5), var(--color-mint, #52E898))`.
This adds the "colorful audacious pop" the brief requests — a highlight that reads as the
glass/light vocabulary — without decorating chrome. The tumble overlay then replaces it
fully. Source: `SquareScene.vue` `.demo-box`.

---

## Panel-Open Composition Analysis

**Laptop/Desktop (`square-laptop-open.png`, `square-desktop-open.png`):**
The rail·stage·rail split works — controls on left, box on right. But with controls open
the box drifts to a visually off-center position (≈ 55 % from left edge of full viewport).
The two control cards (options + PlaybackRibbon) are cleanly separated with ~20 px gap;
there is no visual hierarchy between them (the options card is primary, the ribbon secondary,
but they present at equal weight).

**Mobile (`square-mobile-open.png`):**
The sheet raises to ~50 % of the screen. The box is still partially visible in the top half.
The `stageMode: "subject"` full-bleed is correct — the box shows through. But the box's
mint fill against the light checkered background gives it near-zero contrast at the top
of the sheet overlap region. A glass protagonist plate (SQ-3) with `backdrop-blur` would
visually separate the box from the sheet surface during this overlap.

---

## Glass-UI Idiom Items

| Kind | Item | Evidence | Proposal |
|------|------|----------|----------|
| ADOPT | Standard protagonist glass Card for the stage arena | `square-laptop.png` — bare checkered background | Adopt `<Card surface="glass" tier="resting" :shadow="false">` wrapping `.square-stage`, as every other scene does (I5 register) |
| ADOPT | `rounded-card` radius on the stage plate | `square-laptop.png` box border radius vs. card siblings | Adopting the Card primitive resolves the radius automatically |
| REFINE-IN-GLASS-UI | The two stacked `cartoon+quiet` Cards in the controls rail have no visual grouping signal between them | `square-laptop.png` gap between options card and PlaybackRibbon card | Glass-ui could offer a `CardGroup` or `card-stack` idiom that applies a shared container silhouette to a vertical stack, making the two cards read as one panel unit |
| ABSTRACT-INTO-GLASS-UI | Live spring readout (SQ-7) pattern — `aria-valuetext` with a visible Fira Code caption readout | `SquareScene.vue` springReadout reactive | This "live physics readout" pattern (numeric spring state → display) recurs in Spring scene too; a `<SpringReadout>` utility component in glass-ui's data-display family could serve both |
