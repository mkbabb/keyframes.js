# Sequence — frontend-design treatment

> Page: `SequenceScene` (`demo/app/scenes/SequenceScene.vue` → `demo/sequence/SequenceTarget.vue`
> + `SequenceScrubber.vue`). The engine dogfood for `Sequence` (master-playhead temporal
> orchestrator) + `stagger` (delay distribution) + draggable `at:` re-authoring + the "reel" egg.
> This treatment proposes design only — no source is written outside this doc.

---

## §Aesthetic direction

**THE STUDIO TRANSPORT — an After-Effects/DAW timeline rendered as a precision instrument.**

keyframes.js *is* a CSS-animation engine; the spring/easing/motion-path scenes each dogfood one
primitive, but the Sequence scene is the only place where the library's true thesis becomes
**spatial**: many clocks, one master playhead, staggered along a time grid you can grab and re-time.
Every professional motion tool the audience already loves — After Effects, Premiere, Ableton,
Resolve — communicates this exact idea with the same vocabulary: a **ruled time grid**, a **swept
playhead with a luminous head**, **track lanes that snap to a frame raster**, and **transport that
feels mechanical, weighted, exact**. The current page gestures at all of this but renders it as a
polite settings panel. The direction is to commit, hard, to **the instrument** — and to make the
page *dogfood its own motion as the design signature*.

Pick the lean: **industrial / instrument-panel**, not playful-toy and not editorial. Tight
monospaced numerics, a ruled raster substrate, a phosphor-red playhead that bleeds light, machined
handle grips, and transport that snaps with spring overshoot. This is a **refinement of the
extant glass-ui language, not a re-theme** — every one of the four pillars stays and is *amplified*:
GLASS (the cartoon-quiet panels/dock keep their surface), PAPER (the `--graph-pitch`/`--graph-major`
drafting substrate the well refracts against), AUDACIOUS TYPOGRAPHY (Instrument Serif display +
Fira Code numerics pushed bolder and more engraved), MATHEMATICS (the master playhead, the staggered
distribution, the `linear()` springs made *beautifully visible*). The crayon accents stay exactly
as the user likes them: the `--accent-red` motion authority and the `--rainbow-*` lane spectrum are a
**restrained, intentful signature** — red owns the one master clock, the rainbow names the five lanes
(violet→green, `SequenceTarget.vue:163-169`), and that two-tier crayon coding is *kept and
proportioned*, never widened into a decorative palette. The move is **depth and light around the
TASTE-approved colour**, not a new colour: a console you'd find in a mixing suite, dressed in the
same crayon-and-glass language as the rest of the demo.

**The ONE unforgettable thing (a proportionate signature, built on the KEPT ball + rail + rainbow):**
*a phosphor playhead that physically sweeps the lanes — a 2px red line with a machined diamond head
and a comet-trail of light — and as it crosses each lane's start gate, that lane's **existing** ball
**ignites** (the same rainbow ball, its kept glow blooms, its number lights). Scrubbing the master
makes the five rainbow lanes detonate in a diagonal cascade under your thumb. You are conducting
light along a ruler.* The cascade is an **easter-egg crescendo over the parts that already exist** —
the balls, the rail, the `--ball-p` the engine already paints, the crayon lane hues — not a new
mechanism and not a new palette. Nobody forgets a playhead that lights the room as it passes; and it
lights it in the demo's own colours.

---

## §Current-state audit

The scene is *structurally* SOTA — a real engine drives the balls, the rows are genuinely
draggable, the playhead is real `progress` — but it **reads as a generic settings card**, not as a
motion instrument. The gap between "correct" and "memorable" is entirely presentational.

**What reads generic / weak / AI-slop vs the SOTA bar:**

1. **The card is a polite white plate, not a console.** `SequenceTarget.vue:8` — the protagonist is
   a `<Card :shadow="false">` that hugs its content. The header (`:12`) is the canonical
   `flex items-center justify-between … border-b border-border/40` row every CRUD app ships. There
   is zero instrument identity: no ruled bezel, no machined chrome, no atmosphere. The SOTA bar
   (After Effects timeline panel) has a *dark, deep, ruled* work surface with a tactile frame; here
   the stage is `linear-gradient(… 5% … 2% …, var(--background))` (`:296-302`) — a wash so faint
   it's effectively invisible. **This is the single biggest miss: the timeline has no *room*.**

2. **The playhead is a hairline with no presence.** `:389-399` — `.seq-playhead` is a 2px bar at
   `color-mix(… 55%, transparent)`, no head, no glow, no trail. A pro transport's playhead is the
   *protagonist* of the frame; here it's a tick you'd miss. There is no swept-light idiom anywhere,
   despite this being a page **about** a swept master clock.

3. **The lane balls don't react to the playhead.** The cascade is real (`:463-473` positions each
   ball at `--row-start + --ball-p`), but the balls are inert dots — `.progress-ball` at a flat 35%
   glow (`design-idioms.css:546-556`). The engine paints a `scale: 0.7 → 1.12 → 1` settle
   (`useSequenceDemo.ts:123-126`) but **nothing in the visual ties a ball's ignition to the
   playhead crossing its gate** — the most cinematic beat the data already contains is thrown away.

4. **The handle grip is a generic slider thumb.** `:407-440` — a 0.4rem bar inside a 24px box, the
   stock "vertical pill" every range input ships. No machined affordance, no frame-snap feedback, no
   sense that you're gripping a clip on a timeline. Drag emits a number; it doesn't *feel* like
   re-timing a track.

5. **Numerics are present but not instrumented.** The `@{{ at }}ms` labels (`:91`) and the
   `progress.toFixed(3)` readout (`SequenceScrubber.vue:10`) use `tabular-nums` Fira Code — good —
   but they're muted-grey captions, not a glowing **timecode display**. A DAW's master readout is a
   *seven-segment-feeling* hero, lit in the transport accent; here it's the same grey as everything.

6. **The axis ruler is a flat tick row, not a film raster.** `:60-67` + `.stage-field-x`
   (`design-idioms.css:588-594`) draws quarter rules with a bare `var(--border)` hairline at one
   uniform weight. Real time rulers have a **major/minor tier** (every 4th tick bolder, like the
   `--graph-pitch`/`--graph-major` pair the substrate already owns at `style.css` `--graph-major`)
   and a **frame-number raster**. The ruler is the one place the "engineering instrument" identity
   should be loudest and it's the faintest element on screen.

7. **The reel egg is a hidden delight with no on-stage signature.** `playReel()`
   (`useSequenceDemo.ts:383-411`) fires a gorgeous under-damped Mexican-wave overshoot
   (`dampingFraction: 0.34`) — genuinely the best motion on the page — but the only visible cue is a
   Clapperboard button that tints red (`:31-39`, `.reel-active` `:449-452`). The marquee motion of
   the page has *no marquee staging*. SOTA would make the reel a **full transport takeover**: lights
   dim, the playhead parks, the lanes fire like a launch sequence.

8. **Typography under-uses the display voice.** Only the word "Sequence" (`:14`) wears Instrument
   Serif (`text-display`); everything else is mono-caption or sans. The instrument has a name plate
   but no *engraved-panel* typography — the lane labels, the transport state, the timecode all read
   as form fields.

**Net:** the bones are a pro transport; the skin is a settings dialog. Every refinement below is a
*skin + motion* move over the existing, correct DOM and engine — no structural rework, no token
fork, no incoherent theme swap.

---

## §Refinements

All proposals **extend** the existing system: they reuse `--accent-red`/`--color-progress` (the
motion authority), the `--rainbow-*` lane spectrum, `--graph-pitch`/`--graph-major`, the
`--ball-tone`/`--badge-tone` seams, Instrument Serif + Fira Code, `@property`, `linear()` springs,
`color-mix`, and the existing `@supports (anchor-name)` fallback discipline. New tokens are namespaced
`--seq-*` and live in the scene's `<style scoped>` or `design-idioms.css` `:root`, never a glass-ui
patch (inv-16).

### TYPOGRAPHY — engrave the panel

- **Hero timecode readout.** `SequenceScrubber.vue:10` — promote `progress.toFixed(3)` from
  `text-mono-caption` grey to a **lit timecode**: `font-feature-settings: "tnum" 1, "ss01" 1;`
  larger (`text-display` mono rung), color `var(--ball-tone)` via the existing `.readout-accent`
  but with a phosphor lift — `text-shadow: 0 0 8px color-mix(in oklab, var(--accent-red) 45%,
  transparent)`. Render it as `0.000` always-three-digits so it *clicks* like a counter. This is the
  master clock; make it the brightest number on the page.

- **Lane labels become track headers.** `:89-92` — keep the index + `@…ms`, but set the index
  (`.seq-row-name`) in **Instrument Serif** (`font-family: var(--font-display)`) at a confident
  rung, so each lane is *named* in the display voice (the instrument's engraved channel numbers),
  while `@…ms` stays Fira Code mono. This extends the "Sequence" name plate down into the lanes — the
  whole panel speaks one engraved language instead of one serif word floating over form fields.

- **Section micro-caps.** "master playhead" (`SequenceScrubber.vue:9`) and a new "TIMELINE" eyebrow
  over the storyboard: `text-transform: uppercase; letter-spacing: 0.18em;` Fira Code at the caption
  rung — the *instrument-panel label* convention. Tiny, dim, precise.

### COLOR — phosphor on graphite

- **Keep the crayons — proportion them, don't replace them.** `--accent-red` stays the master
  authority (the K.W4 collapse — playhead, master ball, timecode, transport state all read the one
  red), and the lanes keep their `--rainbow-*` spectrum (`SequenceTarget.vue:163-169`) — violet→green
  — which is *exactly* the After-Effects multi-track colour-coding idiom and *exactly* the crayon
  signature the user likes. **No palette change, no hue swap, no crayon kill.** The existing two-tier
  (master = red, lanes = rainbow) is already the right structure; the refinement is to *use* it with
  more proportion — red fires ONLY where the master authority belongs, rainbow fires ONLY to name the
  five lanes, and the new depth/light below sits *under* that crayon, never on top of it. The move is
  depth, not hue.

- **Darken the stage into a console.** `.seq-stage` (`:282-302`) — replace the near-invisible 5%/2%
  wash with a **graphite work-surface** that reads as a recessed panel in *both* themes:
  `background: color-mix(in oklab, var(--foreground) 4%, var(--background));` plus an *inset* top
  shadow (`box-shadow: inset 0 1px 0 color-mix(in srgb, var(--foreground) 8%, transparent), inset 0
  0 24px color-mix(in oklab, var(--background) 60%, black 40%))` in dark, lighter in light) so the
  timeline sits *down inside* the card like a real transport well. This is the "give the timeline a
  room" fix from audit #1.

- **Phosphor accent ramp.** Register `--seq-glow` and drive a single intensity var the playhead and
  the igniting balls share, so the red bloom is *one* light source. Light intensity rises with
  `progress` velocity (computed cheaply, see MOTION) so the instrument *runs hotter when it moves*.

### MOTION — dogfood the swept clock (the design signature)

This page must *be* the demo. Every motion below is CSS-driven off the existing `--playhead-p` /
`--ball-p` / `--row-start` custom properties — zero new per-frame JS.

- **The playhead becomes a phosphor sweep.** Rebuild `.seq-playhead` (`:389-399`) as three layers
  on the existing `left: calc(var(--playhead-p) * 100%)` transform:
  1. the **line** — 2px, full `var(--accent-red)`, not the 55%-transparent ghost;
  2. a **machined diamond head** at top — a `::before` rotated 45° square, red fill + 1px lighter
     bevel, the AE playhead-cap;
  3. a **comet trail** — a `::after` linear-gradient that fades *behind* the direction of travel,
     ~32px wide, `color-mix(… 30% … transparent)`, so the sweep leaves light. Direction flips with
     `demo.isReversed` (a `[data-reversed]` attr on the stage already available via
     `useSequenceDemo`'s `isReversed`).
  All three use `will-change: left` (already present) — compositor-cheap.

- **Lane ignition keyed to the playhead crossing (KEEP the ball, refine its glow).** The data already
  exists: a lane's ball is "lit" when `--ball-p > 0`. This does **not** replace the existing ball or
  its rainbow tone — it *amplifies* the kept `.progress-ball` glow by making its bloom scale with
  `--ball-p`, in the lane's own crayon hue (`--ball-tone`). The ball, the rail it rides, and the
  rainbow stay; the refinement is a registered-property `calc()` over them:
  `box-shadow: 0 0 calc(2px + var(--ball-p, 0) * 16px) calc(var(--ball-p,0) * 4px)
  color-mix(in srgb, var(--ball-tone) calc(30% + var(--ball-p,0) * 50%), transparent);` So as the
  master sweep drives each child's `--ball-p` 0→1, that lane *blooms* — and because the lanes are
  staggered, scrubbing the master lights them **in a diagonal cascade**. This is audit #3 fixed with
  one `box-shadow` `calc()` over an existing variable. Register `--ball-p` as
  `@property { syntax: "<number>" }` so the glow interpolates smoothly between engine frames (the
  scrubbed/keyboard-nudged case) — the exact registered-custom-property idiom the codebase already
  uses for `--rail-width` and the spotlight guide blesses.

- **Frame-snap handle feedback.** On `pointerdown`/drag, the handle grip (`.seq-handle::after`,
  `:420-435`) gets a spring scale-pop using a `linear()` token from the engine's own
  `springTimingFunction` (dogfood) — it *clunks* into the grip like grabbing a clip. On release, a
  brief red flash on the lane rail confirms the re-time. This makes audit #4's generic thumb feel
  *mechanical*.

- **Orchestrated load.** On scene enter, stage the instrument powering up: the ruler draws
  left→right (a `clip-path` inset wipe), then the five lanes drop in staggered top→bottom
  (`animation-delay: calc(var(--row-index) * 60ms)`), each ball doing a small ignite-and-settle,
  then the master timecode counts `0.000` up to its restored value. One orchestrated power-on, ~700ms,
  PRM-guarded. This is the "one well-orchestrated page load with staggered reveals" the methodology
  prizes — and it literally demonstrates `stagger`, the primitive this page exists to prove.

### SPATIAL — the console layout

- **Recess the timeline, raise the transport.** Keep the grid geometry (the subgrid label column is
  correct, `:329-345`), but frame the `.seq-stage` as a *recessed well* (inset shadow, above) inside
  a card that now has a **machined top bezel** — a thin `border-image` or a 2-stop gradient strip
  under the header that reads as brushed metal. The header becomes a **transport bar**: name plate
  left, lit timecode + state badge right, the reel button as a *physical key*.

- **Major/minor ruler raster.** `.stage-field-x` (`design-idioms.css:588-594`) currently draws one
  uniform quarter rule. Extend it (scene-scoped override, not a glass-ui edit) to a **two-tier
  raster** mirroring the `--graph-pitch`/`--graph-major` substrate idiom: minor ticks every ~1/16,
  major (labeled) ticks every 1/4, the majors at `--graph-major-opacity`-class strength, minors
  fainter. Add a 1px **baseline rule** under the lanes so the time grid reads as engineering paper.
  This makes the ruler the loudest instrument signal instead of the faintest (audit #6).

- **Negative space as instrument margin.** The card hugs content (`h-fit`), good — keep it, but give
  the timeline well generous internal padding and a *fixed lane pitch* so the instrument reads
  uncramped, with the ruler/transport as deliberate bands. Density in the lanes, air around them.

### MICRO-INTERACTIONS — surprise the operator

- **Handle hover = grip light.** Already partially there (`:436-440` scaleY 1.12). Extend: on hover
  the grip lights with a `--ball-tone` glow ring and the lane's `@…ms` label *brightens to the lane
  hue* — the operator sees which clock they're about to move.

- **Scrub = thumb-conducted cascade.** While the master scrub is dragged
  (`SequenceScrubber.vue:48-57`), the whole stage runs hotter: bump `--seq-glow` for the gesture
  (toggle a `.is-scrubbing` class via the existing `useDragScrub` `body.is-dragging` seam, scoped).
  The five lanes detonate under the thumb — the signature moment, made interactive.

- **State badge as a transport lamp.** `:40-43` — the settled/playing/reverse badge becomes a
  **lit lamp**: playing = a soft pulsing red dot + "PLAYING" micro-caps; reverse = violet, the
  `.reverse-badge` tone already there; ready = dim graphite. The pulse uses the engine's spring,
  not a CSS `ease`.

- **Reverse = the sweep visibly flips.** When `demo.reverse()` fires, the comet trail and diamond
  bevel re-render on the other side (CSS `[data-reversed]`), so reversing *looks* like reversing —
  the trail follows the direction of travel.

### BACKGROUND — atmosphere + depth

- **The recessed graphite well** (above) is the primary depth move — the timeline lives *inside* the
  card, not on it.
- **Phosphor bloom is the atmosphere.** The playhead's comet trail + the lane ignition glows are the
  page's light sources; together they make the dark well feel *alive* when the clock runs and *cold*
  when it rests — the instrument's heartbeat. No decorative mesh/noise needed; the motion *is* the
  atmosphere (correct for an instrument — keep it clean, let the light do the work).
- **The page substrate stays** the existing `--graph-pitch`/`--graph-major` engineering paper
  (`EditorShell .grid-background`) — the timeline well *refracts against it*, which is exactly the
  W6-3 "the glass plate finally has structure to refract against" intent, now earned by a darker
  well sitting over the ruled page.

---

## §The one unforgettable moment

**THE IGNITION CASCADE — scrub the master and conduct five clocks of light along a ruler.**

The master scrubber is a real `Sequence.progress` drive. Grab it and drag. The phosphor playhead
sweeps the well, its comet trail streaking the direction of travel. As the head crosses each lane's
**start gate** — the staggered `--row-start` already encoded in the DOM — that lane's ball *ignites*:
its glow blooms from a cold 2px ember to a 16px phosphor flare, its channel number lights in
Instrument Serif, its `@…ms` label flickers to the lane hue. Because the lanes are staggered, the
ignitions fire in a **diagonal cascade** chasing your thumb — violet, blue, cyan, teal, green —
five clocks detonating in sequence along the time grid. Drag back and they cool in reverse, the
trail flipping sides. The whole well runs *hotter the faster you scrub* (`--seq-glow` keyed to scrub
velocity).

This is owned by this page alone because **only the Sequence scene has many clocks on one master
playhead** — the cube blends, the spring oscillates, the easing samples, but only here does one
sweep *conduct a distribution of light*. It's built entirely on data the page already computes
(`--playhead-p`, `--ball-p`, `--row-start`) and lights up the elements the page already draws (the
balls, the rail, the rainbow lane hues), so it's a **skin/easter-egg over the existing engine and the
kept crayon language**, not a re-theme — and it *is* the demo: the user feels `stagger` + `Sequence`
in their thumb. The crayon spectrum is the *point* of the cascade (you read the order of the clocks
by their kept colours), so the rainbow is preserved and *celebrated*, never replaced. Nobody forgets
conducting light along a ruler — in the demo's own colours.

---

## §Design verdict reconciliation

This treatment was *already* substantially verdict-compliant — Sequence never proposed killing the
crayons or the HSL square — so the pass here is a **tightening, not a rescue**. What was reversed or
tempered, and why:

- **No crayon-kill clause existed to reverse, but the framing was sharpened.** The COLOR section's
  "Keep `--accent-red`" bullet now reads as an explicit *keep-and-proportion* of BOTH crayon tiers
  (master red + the `--rainbow-*` lanes, `SequenceTarget.vue:163-169`). Where the prior draft said
  "no palette change," it now says **no crayon kill, no hue swap** and frames the rainbow as the
  user-liked signature, used with *more proportion* (red only at the master authority, rainbow only
  to name the five lanes) rather than widened. Why: honor verdict #1 — the crayons are a restrained,
  intentful accent and must be folded deftly, not merely tolerated.

- **Tempered "ignition" from a re-theme reading to a refinement of the kept ball.** The lane-ignition
  clause and the unforgettable-moment section now state plainly that the existing `.progress-ball`,
  its rail, and its rainbow `--ball-tone` are **kept** — the `--ball-p`-scaled `box-shadow` only
  *amplifies* the glow that already exists, in the lane's own crayon hue. Why: verdict #2 (refine,
  don't abrogate) and #3 (the cascade is a proportionate easter egg over existing parts, not a new
  mechanism or palette).

- **Re-anchored the direction to "refinement of the four pillars," not "the extreme."** The
  §Aesthetic-direction lede now names GLASS / PAPER / TYPOGRAPHY / MATHEMATICS as the pillars being
  *amplified* and labels the instrument lean a refinement of the extant glass-ui language, not a
  re-theme. Why: verdict #2/#4 — measured, surgical refinement of the TASTE-approved language.

- **Held the signatures as proportionate eggs.** The ignition cascade (the page's one signature) and
  the orchestrated power-on boot are kept but explicitly scoped as *delights over existing data/DOM*,
  PRM-guarded, ~700ms — a crescendo, not a dominant theme. Why: verdict #3 — signature moments fold
  as tasteful easter eggs, proportionate.

Nothing here was deleted from the prior treatment; the depth/light/typography/ruler refinements all
stand, now unambiguously sitting *under and around* the kept crayon-and-glass language.

---

## §Implementation plan

Priority order — each item is a skin/motion change over existing DOM + engine; no structural rework,
no token fork, no glass-ui patch.

1. **The recessed graphite well + phosphor playhead** *(highest impact — fixes audit #1, #2; builds
   the signature)*. `SequenceTarget.vue` `<style scoped>` — rewrite `.seq-stage` (`:282-302`) to the
   graphite/inset-shadow console; rebuild `.seq-playhead` (`:389-399`) into the 3-layer line +
   diamond head + comet trail using `::before`/`::after` and a new `--seq-glow` token. Register
   `--ball-p` via `@property` in `design-idioms.css` (beside `--rail-width`). New tokens `--seq-well`,
   `--seq-glow` in the scene's `:root` block.

2. **Lane ignition keyed to `--ball-p`** *(fixes audit #3 — the cascade)*. `SequenceTarget.vue`
   `.seq-ball` (`:463-473`) — add the `--ball-p`-scaled `box-shadow` glow `calc()`. Add the
   `@property --ball-p` registration (item 1). One rule, no JS.

3. **Lit timecode + engraved labels** *(fixes audit #5, #8)*. `SequenceScrubber.vue:10` — promote the
   readout to the lit `text-display` mono timecode with phosphor `text-shadow`. `SequenceTarget.vue:90`
   — `.seq-row-name` → Instrument Serif. Add the "TIMELINE" / "MASTER PLAYHEAD" micro-caps eyebrows.

4. **Major/minor ruler raster** *(fixes audit #6)*. Scene-scoped override of `.stage-field-x` inside
   `SequenceTarget.vue` `<style scoped>` (does NOT edit `design-idioms.css`'s shared copy — adds a
   `.seq-axis .stage-field-x` layered raster) using `repeating-linear-gradient` at minor + major
   pitches keyed to `--graph-major-opacity`-class strengths. Add the baseline rule.

5. **Machined handle + frame-snap feedback** *(fixes audit #4)*. `SequenceTarget.vue` `.seq-handle`
   / `::after` (`:407-440`) — grip light ring on hover, spring scale-pop on `pointerdown` (a
   `.is-gripping` class toggled in the existing `onRowDown` at `:226-229`), release flash on the
   rail. Reuse a `linear()` from `springTimingFunction` (dogfood, no new dependency).

6. **Scrub-hot + transport lamps** *(micro-interactions)*. `.is-scrubbing` glow bump driven off the
   existing `body.is-dragging` / `useDragScrub` seam, scoped to the stage. State badge → pulsing
   transport lamp (`:40-43`, reuse `.tracking-badge`/`.reverse-badge` tones, add a spring pulse).

7. **Orchestrated power-on load** *(the one load moment)*. `SequenceTarget.vue` — entry animation:
   ruler clip-path wipe → staggered lane drop-in (`animation-delay` per `--row-index`) → timecode
   count-up. Pure CSS keyframes + `animation-delay`, gated behind `prefers-reduced-motion: no-preference`
   (the codebase's standard PRM posture). Demonstrates `stagger` on load.

8. **Reel egg as transport takeover** *(highest delight, lowest urgency)*. When `demo.isReeling`
   (`:34`, `useSequenceDemo.ts:377`) is true, add a `.is-reeling` class on the stage: dim the well,
   park the playhead diamond, let the five lanes fire the existing under-damped overshoot as a
   **launch sequence** with the ignition glow turned to max. No JS change — the egg already runs; this
   stages it.

**Files touched (proposal scope, for the eventual impl):** `demo/sequence/SequenceTarget.vue`
(scoped style + 2 class bindings), `demo/sequence/SequenceScrubber.vue` (readout markup + scoped
style), `demo/styles/design-idioms.css` (one `@property --ball-p` registration + optional `--seq-*`
token homes). **No** glass-ui edits, **no** new fonts, **no** new dependencies, **no** new tokens
outside the `--seq-*` namespace + the one `@property` registration. Every motion rides existing
custom properties the engine already paints.
