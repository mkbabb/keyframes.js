# Sequence — design audit (Tranche S, pass 1)

> Page: `SequenceScene` (`demo/scenes/sequence/`). Inputs: the three S-pass screenshots
> (mobile 375px / laptop 1280px / desktop 1440px), the full scene source, the prior
> frontend-design treatment (`docs/frontend-design/demo/sequence.md`), `demo/DESIGN.md`,
> and `demo/@/styles/design-idioms.css`. Analysis only — no source touched.

---

## 1. Product truth

The Sequence scene is the demo's only proof of the engine's **temporal** orchestrator:
`Sequence` (many child clocks positioned along one master playhead) + `stagger` (the
per-index delay distribution) — the GSAP-timeline idiom rendered as a five-lane
storyboard (`useSequenceDemo.ts:20-56`). Five `CSSKeyframesAnimation`s each sweep a
`--ball-p` custom property 0→1 on their own traveller ball (the engine's DOM renderer
paints the balls directly — no per-frame Vue work, `useSequenceDemo.ts:111-138`), eased
by the library's own `springTimingFunction` twin. The user can (a) scrub the master
playhead (`SequenceScrubber.vue`), which detonates the staggered lanes in a diagonal
"ignition cascade"; (b) **drag any row's start-handle** to re-author its `at:` offset
live, re-sorting the engine's own position-insertion model (`useSequenceDemo.ts:324-348`);
and (c) fire the "reel" egg — a cascading under-damped Mexican-wave replay
(`useSequenceDemo.ts:350-391`). The page is the library's thesis made spatial: one
sweep conducting a distribution of clocks, in the demo's crayon spectrum.

## 2. Usability, affordance discoverability, interactability

### Findable unaided (desktop)
- **The master scrubber** — the dominant 36px red ball on a full-width rail under the
  "MASTER PLAYHEAD" eyebrow (`SequenceScrubber.vue:18-36`) reads immediately as a
  slider (`cursor-pointer`, `role="slider"`, keyboard arrows/Home/End at `:98-112`).
  Scrubbing gives excellent feedback: the phosphor playhead sweeps, the lanes bloom in
  the diagonal cascade, the timecode counts. The best feedback loop on the page.
- **The transport dock** ("Sequence Preview" + reset + play) at the bottom — findable,
  though physically dislocated from the card it drives (see below).
- **The reel button** (Clapperboard, `SequenceTarget.vue:31-39`) — findable but
  cryptic: a clapperboard glyph with no label; its payoff (the overshoot wave) is only
  learned by pressing it. Acceptable for a delight affordance; the `aria-label` is good.

### Hidden / weakly signalled
- **The headline gesture — draggable row start-handles — is the least discoverable
  thing on the page.** The grip is a 0.4rem × 1.5rem tinted pill (`SequenceTarget.vue:376-391`)
  that at t=0 sits flush against (row 1: underneath) the resting traveller ball, which
  is painted at the SAME z-index later in the DOM (`SequenceTarget.vue:427` —
  `z-index: var(--z-seq-handle)`), so the ball visually swallows the grip at the
  origin rows. `.progress-ball` is `pointer-events: none` (`design-idioms.css:585`),
  so the drag still WORKS — but nothing at rest says "this pill is a handle, this
  timeline is re-authorable." `cursor: grab` fires only once you happen to hover the
  24px box. The prior design doc's own remedy — hover lights the lane's `@…ms` label
  in the lane hue (§MICRO-INTERACTIONS, "grip light") — was never implemented; only
  the grip's background/scaleY change shipped (`:392-396`).
- **Drag feedback is displaced from the thumb.** During a row drag the live `@…ms`
  value updates in the label column at the far LEFT (`SequenceTarget.vue:89`), while
  the user's eyes and finger are on the handle mid-track. No value chip travels with
  the thumb; the feedback loop is real but peripheral.
- **The dock's trash icon** (visible in all three shots) reads as "delete" on a page
  with nothing deletable — it resets stored options; first-time users will hesitate to
  touch it. (Shell-owned, not scene-owned — noted for the shell lane.)

### Touch targets
- Row handles: the 24×24px hit element is deliberate and documented
  (`SequenceTarget.vue:360-373`) — meets the 24px minimum, below the 44px comfort bar,
  and on mobile the compressed row pitch (`row-gap: 0.15rem`, tracks 1.5rem,
  `:476-486`) puts adjacent 24px handles ~26px apart center-to-center — cross-row
  fat-finger grabs are likely at 375px.
- Reel button: `h-7 w-7` = 28px (`SequenceTarget.vue:33`) — under-sized for touch.
- Master scrubber: `h-9` (36px) full-width — good.

### Empty / loading states
No empty state is needed (the storyboard is always populated); the ~700ms PRM-guarded
power-on boot (ruler wipe → staggered lane drop, `SequenceTarget.vue:447-462`,
`useSequenceInstrument.ts:24-35`) doubles as the load moment AND a live demonstration
of `stagger` — a genuinely elegant choice. Return-entry restores the machine snapshot
(`SequenceTarget.vue:187-199`) rather than clobbering to t=0 — correct.

### Mobile (375px shot) — the weak axis
1. **The master scrubber — the page's primary interaction — is buried under the bottom
   sheet.** In the 375px shot "MASTER PLAYHEAD" is clipped mid-glyph at the sheet fold;
   the timecode and the entire scrub rail are occluded behind the sheet/dock band. The
   one control the page is named for requires discovering that the sheet collapses.
2. **Axis tick collision:** the 1200 and 1600 labels overlap into "12001600"
   (`SequenceAxis.vue:6-13` places 5 labels across a ~230px track; the
   `translateX(-50%)`/`-100%` end-hugs collide at this width).
3. **Header stacks to three rows** (title+caption / progress badge / reel+READY),
   spending ~90px of a 667px viewport on chrome before the storyboard begins.
4. **Compressed lanes:** 5 rows at 1.5rem pitch with 24px handles — functional but
   dense; adjacent handles are near-touching (cross-grab risk above).
5. The playhead's diamond head crowds the "0" axis label at the origin (minor).

## 3. Aesthetic critique (against glass-ui)

This page has already received — and substantially **implemented** — a full design
treatment (the L.W11 S7 "studio transport": `docs/frontend-design/demo/sequence.md`).
The result is one of the demo's most distinctive scenes, and it visibly dogfoods the
engine rather than faking it:

- **Typography** — genuinely instrumented. Instrument Serif name plate + engraved
  serif channel numbers (`SequenceTarget.vue:336-341`), Fira Code tabular numerics
  everywhere, the letter-spaced "MASTER PLAYHEAD" micro-cap eyebrow
  (`SequenceScrubber.vue:123-127`), and the lit phosphor timecode with its
  `tnum` + red text-shadow (`:134-139`). The `@…ms` sub-labels stay on the φ type
  ladder (`SequenceTarget.vue:342-350`). This is the strongest typographic voice of
  the storyboard scenes.
- **Color** — the two-tier crayon system is exactly right: ONE master red authority
  (playhead, scrub ball, timecode, progress badge — all `--color-progress` via the
  `--ball-tone` seam) over the five `--rainbow-*` lane hues violet→green, with the
  bridge stop derived by `color-mix`, never a new literal (`SequenceTarget.vue:164-170`).
  Token-clean throughout; no off-system hues found.
- **Motion** — the page's motion IS the engine's: `--ball-p` is registered via
  `@property` so blooms interpolate between engine frames (`:265-269`), the ignition
  cascade is one `box-shadow: calc()` over the engine's own variable — no rAF, no
  second writer (`:419-436`) — and the boot literally demonstrates `stagger`. The
  comet-trail playhead with machined diamond head (`SequencePlayhead.vue:32-78`) is a
  real signature. Motion quality: high, and honest.
- **Composition** — the subgrid label column (`:309-325`) keeps the lanes machined;
  the master-tinted stage frame (`:287-307`) gives the timeline a room without
  shouting (the 5%/2% wash reads as a faint rose blush on the light theme — right at
  the edge of legible intent; defensible). At t=0 the travellers resting at their
  start gates draw the diagonal cascade — the distribution SEEN before any playback.
  One blemish: at p=0 the 36px master scrub ball overhangs the rail's left edge
  (`SequenceScrubber.vue:152-155` centres it at 0% with no end-inset), hanging half
  outside the readout column — the lane travellers inset their travel
  (`100% - ball-size`, `SequenceTarget.vue:423-426`); the master ball doesn't.
- **Memorable or generic?** Memorable, on desktop. Scrub-to-detonate is a moment no
  other scene owns, the phosphor playhead is a real identity, and the page is the one
  place the library's temporal thesis is felt in the thumb. The gap to an A is
  entirely in the mobile presentation and the last-mile affordance polish the prior
  treatment specified but didn't ship (grip light, drag value chip).

## 4. Ranked refinements (all on-system, wave-shaped)

1. **Unbury the master scrubber on mobile.** WHAT: at `<1024px` reserve the sheet peek
   band below the card (safe-area padding on `.seq-root` / reorder the scrubber above
   the storyboard) so rail + timecode sit fully above the fold. WHERE:
   `SequenceTarget.vue:2` root classes + the `:476-486` media block;
   `SequenceScrubber.vue:7`. WHY: the page's primary interaction is occluded in the
   375px shot — a P1 usability failure on an otherwise strong page.
2. **Fix the axis label collision at narrow widths.** WHAT: hide the 0.25/0.75 tick
   labels under a container/media query (keep 0 / 800 / 1600), or gate on track width.
   WHERE: `SequenceAxis.vue:6-13` + its `:43-48` media block. WHY: "12001600" is
   illegible and reads as a bug — the ruler is the instrument's identity.
3. **Ship the grip-light hover the design doc already specified.** WHAT: on
   `.seq-handle:hover/:focus-visible`, brighten the lane's `@…ms` label to its
   `--ball-tone` and add a soft tone glow ring to the grip; optionally a one-time
   ~300ms post-boot grip shimmer (PRM-guarded) to announce "these are draggable."
   WHERE: `SequenceTarget.vue:392-396` + `.seq-row-label`; the boot hook at `:198`.
   WHY: the headline re-timing gesture is the least discoverable affordance on the page.
4. **Restore a visible focus ring on the sliders.** WHAT: replace `outline: none`
   (`SequenceTarget.vue:397-399`) with the system focus token (outline/ring on the
   24px host, not the ::after pill); same on `.seq-scrub`. WHY: keyboard users
   currently get only a subtle pill tint change — WCAG 2.4.7 is marginal.
5. **A drag value chip at the thumb.** WHAT: while a row drag is active, float a tiny
   mono `@{{at}}ms` chip above the handle (the `activeRow` latch at
   `SequenceTarget.vue:206-233` already knows which row; reuse the status-badge
   recipe with `--badge-tone: var(--ball-tone)`). WHY: closes the feedback loop where
   the eyes actually are; makes re-timing feel precise, instrument-grade.
6. **Enlarge the reel button's hit area.** WHAT: keep the 28px visual, extend the hit
   target to ≥40px (padding or an ::after hitbox), and add a tooltip ("Play the reel").
   WHERE: `SequenceTarget.vue:31-39`. WHY: touch-target + a hint for the cryptic glyph.
7. **Inset the master scrub-ball's travel.** WHAT: mirror the lane formula —
   `left: calc(p * (100% - var(--ball-size)))` — so the ball never overhangs the rail
   ends. WHERE: `SequenceScrubber.vue:33-35, 152-155`. WHY: composition polish; the
   protagonist ball currently clips the frame at both rests.
8. **Richer slider semantics.** WHAT: add `aria-valuetext` ("row 2 starts at 260 ms")
   on the row handles and percent text on the master scrub; make the status badge an
   `aria-live="polite"` region so playing/reverse/ready announce. WHERE:
   `SequenceTarget.vue:98-109`, `:40-43`; `SequenceScrubber.vue:22-27`. WHY: the
   interactions are keyboard-complete but screen-reader-thin.

## 5. The easter egg — "swing quantize"

**Double-click the `stagger × 5` caption (or type "swing") → the timeline swing-quantizes.**
The five `at:` offsets glide from the straight staircase to a swung-8th groove
(long-short pairs — 0, 340, 520, 860, 1040), each handle springing to its new gate via
the existing `reseatRow` + the row spring, then the reel fires once in swing time.
Double-click again to snap back straight. It is pure DAW vocabulary — the exact joke a
motion-tools audience gets instantly — and it is nearly free: `reseatRow`
(`useSequenceDemo.ts:324-348`) already re-authors the engine's position-insertion
live, `playReel` already exists, and `useTypedTrigger` (`SequenceTarget.vue:252`)
already hosts the scene's typed-trigger pattern. Discoverable (the caption is the one
un-interactive label in the header — a double-click is a natural poke), PRM-safe (the
glide is the engine's own spring; under PRM the handles snap), and in the page's own
voice: the egg IS a `stagger` re-distribution, the primitive the page exists to prove.

## 6. Accessibility notes (from source)

- **Contrast:** the status-badge family carries the single-sourced AA lineage
  (14% tint / 50% text-mix documented at `design-idioms.css:626-670`) — good. The
  `@…ms` labels are muted-foreground caption at `opacity: 0.8`
  (`SequenceTarget.vue:347-350`) — likely borderline against the tinted stage; worth a
  contrast check. The lit timecode is a text-shadow over `readout-accent` — the shadow
  is decorative, the base color is the token; fine.
- **Focus:** `outline: none` on `.seq-handle:focus-visible` (`SequenceTarget.vue:397`)
  with only the pill tint/scale as indication — the one real focus gap (refinement 4).
- **Keyboard:** both slider families are fully keyboard-operable (arrows/Home/End —
  `SequenceTarget.vue:235-246`, `SequenceScrubber.vue:98-112`); the typed "reel"
  trigger ignores editable targets (`useTypedTrigger`, `:252`).
- **ARIA:** `role="slider"` + valuenow/min/max on every handle and the master scrub;
  the reel button is labelled; playhead + axis correctly `aria-hidden`
  (`SequencePlayhead.vue:9`, `SequenceAxis.vue:6`). Missing: `aria-valuetext`, a live
  region for the transport state (refinement 8).
- **Reduced motion:** the boot is dual-guarded — CSS (`SequenceTarget.vue:464-470`)
  AND JS (`useSequenceInstrument.ts:29-32`). The cascade glow rides the engine's
  `--ball-p`, so it degrades with the library's own reduced-motion snap. Correct posture.

**Grade: B+.** Desktop is an A-grade instrument — distinctive, token-clean,
engine-honest; the mobile occlusion of the master scrubber, the ruler-label collision,
and the undiscoverable row handles are what hold it off the line.
