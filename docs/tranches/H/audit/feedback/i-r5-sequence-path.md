# i-r5 — SEQUENCE + PATH refinement (I3 focus · read-only research lane R5)

**Charge (RESEARCH LANE R5):** the user (round-3 feedback I3) singled out **Sequence**
and **MotionPath** as needing GREAT refinement, with a frontend-design pass on every
scene for usability / affordance / interactability, plus a few EASTER EGGS per scene.
For EACH scene: (1) what the demo is TODAY (what it shows, what it teaches about the
primitive — `Sequence` / `fromMotionPath`); (2) what is WEAK (usability, affordance,
interactability, visual polish, control set); (3) the SPECIFIC refinements (what the
W5 interactive affordances added — drag the traveller etc — what is missing, what is
rough); how each reconciles with **I5** (the standard glass-card stage — REVERSES
W10 G8 full-bleed), **I8** (standardize/share), and the **W10 normalization** spine.
Propose the refined design per scene.

**Method:** SOURCE reads (cited `file:line`) + git history + the frontend-design lens.
DOCS-ONLY; NO build, NO source edit. Grounds on the landed `tranche-h-impl` source
(HEAD region after W0–W6 + W9 + W10; W10 LANDING CONCURRENTLY via `H.W10.md`).

**Binding context the lead must hold:**
- **I5 SUPERSEDES W10 G8 for these stage scenes.** W10 G8 made easing/spring stages
  FULL-BLEED (no card); the user now wants a STANDARD, NON-CARTOON GLASS card on the
  easing/spring/**sequence**/**path** STAGE scenes. The control PANELS keep
  cartoon+quiet (W2/W9); the STAGE scenes get a standard `<Card>` (glass, resting).
  Treat W10's full-bleed (easing/spring) as the immediately-superseded baseline.
- **The current state diverges PER scene (the load-bearing fact this lane found):**
  W10 G8 full-bleed was applied to **easing + spring + starting-style only**
  (`H.W10.md:43`, `EasingTarget.vue:2-9`, `SpringTarget.vue:2-7`). **Sequence and
  MotionPath were NOT touched by G8** — they STILL wrap their stage in a bare-class
  `glass-resting cartoon-surface` card (`SequenceTarget.vue:3`, `MotionPathTarget.vue:3`).
  So the four stage scenes are in THREE different states today:
  - easing/spring → full-bleed, no card (W10 G8)
  - sequence/path → `glass-resting cartoon-surface` bare-class card (un-rounded by
    G2's own diagnosis — `cartoon-surface` carries NO `border-radius`, `H.W10.md:20`)
  - I5's target → ALL FOUR on ONE standard non-cartoon `<Card>` (glass, resting,
    `rounded-card` by construction)
  **This is the I8/I12 isomorphism win hiding inside I5:** the four stage scenes
  converge to ONE card register instead of three.

---

## §0 — The cross-scene through-line (read first)

Sequence and MotionPath are **genuine, valuable, well-built engine dogfoods** — the
prior deep audit ruled KEEP for both (`a-scene-spring-sequence.md:56-59` Sequence
"KEEP — pertinence proven"; `a-scene-path-discrete.md:12,167-175` Path "KEEP +
ELEVATE"). They prove the only coverage of two primitives nothing else demos:
- **Sequence** → the engine's TEMPORAL orchestrator (`Sequence` + `stagger`) — N
  staggered children on ONE master clock, each painting its own target. The temporal
  counterpart to the cube's spatial `AnimationGroup`.
- **MotionPath** → the CSS-native `offset-path`/`offset-distance` primitive via
  `fromMotionPath` — the browser owns the geometry, the engine sweeps one scalar.

They are NOT the W10 spine (W10's spine is easing/spring → standard `PlaybackRibbon` +
normalized `Card surface="cartoon"` sidebar). Sequence/Path were left UNNORMALIZED by
W5/W10 because they are **self-contained**: their transport + interaction live ON the
target, not in a sidebar/ribbon. That self-containment is correct and should SURVIVE
— but it is exactly WHY they were skipped, and exactly WHY they now diverge from the
card register I5 wants. **The R5 refinement is: bring these two self-contained scenes
into the I5 card register + the I8 shared idiom, without surrendering their
self-contained transport.**

The four cross-cutting threads that touch both scenes:
1. **I5/I4 — the standard glass-card stage** (swap `cartoon-surface` → `<Card>`; the
   card is rounded by construction — closes I4 at the primitive for these scenes too).
2. **I1 — uniform label-column grid/subgrid** (Sequence's per-row `@{{at}}ms` labels
   are `w-20` fixed-width and right-aligned; this is ALREADY uniform, but the I1
   grid/subgrid idiom should subsume the manual flex+`w-20`).
3. **I3 — interactability + affordance + easter eggs** (Sequence: per-row re-time
   markers — the deferred H-MI-4 enrichment; Path: editable control points — the
   BOOKed F4 elevation). Easter eggs per scene.
4. **I8/I11/I12 — share/normalize + de-brittle** (both hand-roll the SAME pointer-drag
   scrub dance Spring/Easing hand-roll; the `projectPointer`/scrub seam is a 3rd+
   consumer — the `useDragScrub` extraction the W5 audit BOOKed under MEASURE-FIRST is
   now over its 3-consumer threshold and should be RE-OPENED).

---

## §1 — SEQUENCE (`/sequence` · `demo/sequence/` + `demo/app/scenes/SequenceScene.vue`)

### 1.1 — What the scene IS today (what it shows, what it teaches)

**Files:** `SequenceTarget.vue` (231L, the whole scene UI), `useSequenceDemo.ts` (372L,
the composable), `sequenceKeys.ts` (the inject key), `SequenceScene.vue` (the App
wrapper — provide + defineExpose only).

**What it teaches (`Sequence` + `stagger`):** N=5 staggered storyboard rows
(`ROW_COUNT = 5`, `useSequenceDemo.ts:56`), each a `CSSKeyframesAnimation` sweeping a
ball across its own rail via the engine-painted `--ball-p` custom property
(`useSequenceDemo.ts:93-110`). The five children are inserted into ONE `Sequence`
master clock at the `stagger` distribution offsets — 0 / 260 / 520 / 780 / 1040ms
(`STAGGER_EACH = 260`, `useSequenceDemo.ts:62,81-85,117-120`). The whole storyboard is
driven by the `Sequence`'s OWN `RAFPlayback` loop through the full F.W9 transport:
play / pause / resume / reverse / timeScale(0.5×/1×/2×) / scrub
(`useSequenceDemo.ts:239-297`). The engine writes `--ball-p` directly onto each row's
DOM target — **zero per-frame Vue work for the motion** (`SequenceTarget.vue:33-36,
139-150`; the comment `:203-214`). This is **exemplary dogfood** — the prior audit
credits it as "textbook" (`a-scene-spring-sequence.md:288-293`).

**The UI today (`SequenceTarget.vue`):**
- Header (`:5-16`): title "Sequence" + live readout "stagger × 5 · progress NN%" + a
  `status-badge` (reverse / playing / ready).
- The staggered storyboard (`:19-38`): 5 rows, each `seq-row` = a fixed-width
  right-aligned `@{{at}}ms` label (`w-20 text-right`, `:25-27`) + a `seq-track` rail
  with an engine-painted `seq-ball` (`:28-36`).
- Master scrubber (`:41-63`): a `seq-scrub` rail (`role="slider"`, drag + keyboard)
  whose ball is Vue-positioned from `demo.progress` (the one ball the engine does NOT
  paint, `:217-222`).
- The transport (`:68-106`): a `grid grid-cols-4` of Play/Pause · Reverse · timeScale
  cycle · Reset — outline `Button`s on `.btn-interactive`, NOT the standard ribbon.

**State machine integration (H.W1):** the play-intent is a read-only projection of
`machine.status === 'playing'` (`useSequenceDemo.ts:154-167`); play/pause/reset
DISPATCH to the machine; a raw-rAF `ScenePlayback` adapter round-trips
progress/isPlaying through the contract (`:299-318`). This is correct and SOTA — do
not re-author it (I2's per-scene control-visibility DFA EXTENDS the W1 FSM; it does
not touch this seam).

### 1.2 — What is WEAK (usability · affordance · interactability · polish · controls)

- **W-SEQ-1 (I5/I4) — the stage card is a bare-class `cartoon-surface`, un-rounded by
  G2's own diagnosis.** `SequenceTarget.vue:3` is `<div class="glass-resting
  cartoon-surface w-full flex-1 …">`. Per `H.W10.md:20`, `cartoon-surface` is a
  decoration-only utility that carries NO `border-radius` — the radius lives on the
  glass-ui `<Card>` root's `rounded-card`. So this stage is a square-corner cartoon
  panel. The W10 G8 pass fixed easing/spring by DELETING the card (full-bleed); it
  never reached Sequence. I5 now reverses that direction: the right fix is a STANDARD
  `<Card>` (glass, resting), which is rounded by construction — closing I4 here.
  Today Sequence is the WRONG register on BOTH axes (cartoon where it should be glass;
  un-rounded where it should be rounded).

- **W-SEQ-2 (I1) — the per-row labels are manual fixed-width, not a grid/subgrid.**
  Each row is `flex items-center gap-3` with a `w-20 text-right pr-2` label
  (`SequenceTarget.vue:23-27`). The `w-20` happens to be uniform across rows (good),
  but it is a hand-tuned magic width inside a flex row, not the I1 grid/subgrid idiom
  that derives a UNIFORM label column from the content. I1 wants "all labels the same
  width via a CLEAN GRID + SUB-GRID." The storyboard is the canonical place to dogfood
  that: the 5 rows + the master-scrubber label + the readout column should share ONE
  label track via CSS subgrid, not three independent `w-20`/`w-XX` literals.

- **W-SEQ-3 (I3/I8) — the transport is a bespoke `grid-cols-4`, NOT the standard
  ribbon idiom; it diverges from the W10 spine.** `SequenceTarget.vue:68-106` hand-
  rolls Play/Reverse/timeScale/Reset as outline `Button`s on `.btn-interactive`.
  W10 normalized easing/spring onto the standard `PlaybackRibbon` (Play/Reverse +
  scrubber `Slider` + `AnimationVisualizer`, `PlaybackRibbon.vue:1-69`). Sequence's
  transport is genuinely DIFFERENT (it has timeScale, which the standard ribbon lacks,
  and its scrubber is the master playhead, not a per-animation timeline) — so it does
  NOT need to be the standard ribbon verbatim. BUT: (a) its Play/Pause+Reverse buttons
  should share the `.btn-playback` skin the ribbon uses (the intended reuse seam,
  `H.W10.md:37` FLOOR clause; `PlaybackRibbon.vue:26,73-76`), and (b) the master
  scrubber IS a slider-posture rail that could read more like the standard timeline
  slider's affordance. RIGHT NOW it reads as a fourth distinct button vocabulary.

- **W-SEQ-4 (I3 affordance) — the rows are READ-ONLY; the `stagger`/`at:` distribution
  is invisible-as-tunable.** The five rows show the staggered START offsets as `@NNms`
  text, but the user cannot TOUCH them. The scene is ABOUT the stagger distribution
  (it is literally `stagger × 5` in the header) yet the distribution is a static
  construction-time value. The prior audit named this exactly: **H-MI-4 — make the
  Sequence ROWS individually draggable to re-author each child's `at:` offset live (the
  GSAP-timeline gesture)** (`a-scene-spring-sequence.md:273-277` RECORD;
  `H.W5.md:56` "H-MI-4 = SHIP (med) … ENRICHMENT, folded as a stretch within S4"). It
  was deferred because the master scrubber already gives ONE real handle. I3's "greatly
  refined" + "more interactable" mandate RE-OPENS it: the storyboard rows are the
  natural drag surface, and the geometry is trivial (each row's `at:` maps to a
  horizontal position on a shared timeline track).

- **W-SEQ-5 (I3 polish) — the rows do not visually express the master playhead.** The
  master scrubber has a playhead ball, but there is no vertical playhead LINE crossing
  the 5 rows to show WHERE the master clock is relative to each row's window. A
  staggered storyboard reads best when you can see the playhead sweep ACROSS the rows
  and each ball "wake up" as the playhead enters its window. Today each ball animates
  independently with no shared temporal reference line — the stagger is felt only as
  asynchrony, not SEEN as a swept playhead.

- **W-SEQ-6 (I11 brittleness) — the contract-group `paused` mirror is a manual `watch`,
  and the master-scrub pointer math is hand-rolled (3rd copy).** The `animationGroup.
  paused` one-way projection is a `watch(isPlaying, …)` (`useSequenceDemo.ts:161-167`)
  — correct but a manual reactive bridge. The `progressFromEvent` clamp+rect math
  (`SequenceTarget.vue:155-160`) is the SAME shape as Spring's `positionFromEvent`
  (`SpringTarget.vue:88-93`) and Path's `projectPointer` (`MotionPathTarget.vue:124-
  147`) — the `useDragScrub` extraction the W5 audit BOOKed at 2 consumers
  (`H.W5.md:66`) is now at 3+ and over threshold.

### 1.3 — REFINED DESIGN (Sequence)

**R-SEQ-A (I5/I4) — the stage on a STANDARD `<Card>` (glass, resting).** Replace the
bare-class `glass-resting cartoon-surface` div (`SequenceTarget.vue:3`) with the
glass-ui `<Card>` (default `tier="resting" surface="glass"`, `Card.vue.d.ts` — the
five-tier ladder + the orthogonal surface register). The `<Card>` carries `rounded-card`
by construction (closing I4 here with NO ad-hoc `rounded-*` literal). Keep the inner
flex column + header/storyboard/footer structure exactly. This is the I5 isomorphism:
sequence, path, easing, spring all converge to the SAME card register — ONE non-cartoon
glass `<Card>` stage. The card sits in the `[stage]` track, contained between docks by
the `.stage-cell` primitive (`AnimationControlsGroup.vue:364-367` — `padding-block:
var(--dock-band-reserve)`, the W10 G8 layout primitive that SURVIVES I5; only the
full-bleed CONSEQUENCE is reversed, not the dock-band-reserve primitive). NAMED delta
to consider: the stage card may earn `shadow` off (`shadow={false}`) since it is the
protagonist plate, not a nested card — IMPL/MEASURE-FIRST call.

**R-SEQ-B (I1) — the storyboard as a CSS subgrid with ONE label column.** Replace the
per-row `flex + w-20` (`SequenceTarget.vue:23-27`) with a parent
`grid grid-cols-[auto_1fr]` (or `subgrid`) so EVERY row's `@NNms` label sits in ONE
derived label track — the master-scrubber's "master playhead" label and the readout
align to the same column. This is the I1 "clean grid + sub-grid, uniform label-column
width" idiom applied to its most natural home. DRY win: the `w-20` magic literal dies;
the column width derives from the widest label.

**R-SEQ-C (I3 + I8) — share the `.btn-playback` skin; keep the timeScale/Reset verbs.**
Sequence's transport is legitimately domain-specific (timeScale is unique to the
temporal orchestrator). Do NOT force it onto the standard `PlaybackRibbon` (that would
LOSE timeScale and mis-frame the master scrubber). Instead: put Play/Pause + Reverse on
the shared `.btn-playback`/`.btn-playback-accent` skin (`PlaybackRibbon.vue:26,73-76`,
the intended non-scoped reuse partial) so they read identically to cube/amiga/easing;
keep timeScale + Reset as domain extras on `.btn-interactive` (the cube model — domain
verbs beside the standard transport, `H.W10.md:37,53`). This is the I8 "share more"
applied honestly: share the SKIN, not the whole component, where the component does not
fit.

**R-SEQ-D (I3 affordance, the headline refinement) — make the storyboard rows
DRAGGABLE to re-author each child's `at:` offset live (H-MI-4).** This is the "greatly
refined" Sequence. Each row gets a draggable start-handle on a shared timeline track;
dragging it re-emits that child's `at:` into the `Sequence` (`sequence.add(child, at)`
re-sort, `useSequenceDemo.ts:117-120` already re-sorts by `at`). The drag dogfoods the
SAME `useDragScrub` seam (R-SEQ-F) Spring/Path/master-scrub use — one progress source,
DRY. The reseat is live: drag row 3's start later and watch the storyboard re-time. This
turns Sequence from "watch a staggered storyboard" into "AUTHOR a staggered storyboard
and watch the engine re-orchestrate" — the GSAP-timeline gesture, the cube-orbital-drag
bar for this scene. **MEASURE-FIRST scope guard:** if full per-row drag slips the wave,
the FLOOR is a single "stagger amount" slider (re-derives all five `at:` from one
`each`) — cheaper, still teaches the distribution as tunable. The lead picks the rung;
the full per-row drag is the I3-faithful target.

**R-SEQ-E (I3 polish) — a swept master-playhead LINE crossing the rows.** Add a single
vertical playhead line spanning the 5-row storyboard, positioned at
`left: progress * 100%` over the rows' shared timeline track (the same `[1fr]` track the
labels' grid defines, R-SEQ-B). As the master clock sweeps, the line crosses the rows
left-to-right and each ball visibly "wakes" as the line enters its window. This makes
the STAGGER legible as a swept playhead (W-SEQ-5) — the temporal-orchestrator story
told visually. Pure CSS (one absolutely-positioned line driven by `demo.progress`), no
per-frame Vue cost beyond the one `left` it already pays for the scrub ball.

**R-SEQ-F (I8/I11) — extract `useDragScrub` (the rect→ratio pointer seam).** Sequence's
`progressFromEvent` (`SequenceTarget.vue:155-160`), Spring's `positionFromEvent`
(`SpringTarget.vue:88-93`), Path's `projectPointer` (`MotionPathTarget.vue:124-147`),
and the master-scrub + per-row-drag (R-SEQ-D) are FOUR-to-FIVE consumers of the same
pointer→[0,1]-ratio + pointer-capture + window-pointermove/up dance. The W5 audit BOOKed
this extraction at MEASURE-FIRST/3-consumer threshold (`H.W5.md:66`); it is now over
threshold. Extract a `useDragScrub({ el, onScrub, project })` composable in
`demo/@/composables/` (the I9 encapsulation lane's natural seam) that owns the
pointer-capture + window listeners + clamp; each scene supplies only its `project`
(rect-ratio for rails, nearest-point-on-path for MotionPath). This is the I8/I11
de-brittle: ONE drag seam, no four hand-rolled copies that can drift.

**EASTER EGGS (Sequence) — I3 asks for a few per scene; propose, lead selects:**
- **EE-SEQ-1 "the reel" — type `seq` or press a hidden key and the five balls perform a
  Mexican-wave / cascading bounce in perfect stagger, ignoring the master clock once,
  then re-settle.** Dogfoods nothing new (it is the existing children replayed with an
  exaggerated overshoot spring), pure delight, on-brand (it IS the stagger, dramatized).
- **EE-SEQ-2 "palindrome" — scrub the master playhead to EXACTLY 0.500 and hold; the
  status badge flips to a playful "⟷ centered" and the rows briefly mirror.** Cheap, a
  reward for precise scrubbing.
- **EE-SEQ-3 "the count-in" — clicking Reset three times fast plays a 4-count metronome
  tick across the rows (each ball flashes in turn like a drummer's count-in) before the
  storyboard resets.** Ties the temporal theme to a musical metaphor.
Recommend EE-SEQ-1 as the primary (most on-brand, lowest risk, reuses the engine).

---

## §2 — MOTIONPATH (`/motion-path` · `demo/motion-path/` + `…/MotionPathScene.vue`)

### 2.1 — What the scene IS today (what it shows, what it teaches)

**Files:** `MotionPathTarget.vue` (293L, the whole scene), `useMotionPathDemo.ts` (49L,
a thin composable — group + register), `motionPathGeometry.ts` (the single-sourced
`PATH_D` + `VIEW`), `motionPathKeys.ts` (the inject key), `MotionPathScene.vue` (wrapper).

**What it teaches (`fromMotionPath`):** a traveller element swept along an author
`offset-path` by the engine sweeping the scalar `offset-distance` (0%→100%). The
`fromMotionPath` factory (`MotionPathTarget.vue:95-103`) sets `offset-path` +
`offset-rotate: auto` (tangent-following) on a LIVE element and builds the
`offset-distance` sweep; `autoPlay:false` (the bottom-bar drives it). The browser owns
the path→position resolution; the engine sweeps ONE scalar — WAAPI-eligible, zero JS
geometry. The author path is a self-crossing figure-loop (`PATH_D`,
`motionPathGeometry.ts:17-18`) drawn ONCE and shared by BOTH the SVG guide `<path>` and
the traveller's CSS `offset-path` (the single-source invariant — they cannot drift,
`motionPathGeometry.ts:1-11`). The prior audit verified live that the browser resolves
the geometry correctly (`a-scene-path-discrete.md:21-44`) — **ALREADY-SOTA on the
engine seam**.

**The interactivity W5.S4a added (drag-the-traveller):** the traveller is draggable
ALONG its own path (`MotionPathTarget.vue:105-203`). On pointerdown it projects the
pointer onto the SVG `<path>` via `getTotalLength()`/`getPointAtLength()` to the nearest
length ratio (`projectPointer`, `:124-147`), feeds it through a `ManualTimeline`
(`:86,153-165` — the engine's caller-driven progress primitive, so the drag owns NO
bespoke clamp math, inv ζ), and re-seats the engine playhead via the group scrub seam
`group.setChildTime(anim, p*duration).render()` (`:162-164`). The drag pauses the group
for the gesture and resumes on release (`:167-203`, mirroring the bottom bar's
onScrubStart/onScrubEnd). Keyboard scrub (`role="slider"` + arrows/Home/End, `:206-220`)
gives parity with Spring/Sequence. The traveller wears a 🙂‍↔️ glyph (`:42`).

**This is the W5 elevation of the F4 "Path is inert" finding** (`a-scene-path-discrete.md:
129-139` F4 — Path was the most static scene; W5.S4a made the traveller draggable). It
SHIPPED. So Path is no longer inert — it has ONE real affordance (drag the traveller
along the path).

### 2.2 — What is WEAK (usability · affordance · interactability · polish · controls)

- **W-MP-1 (I5/I4) — the stage card is a bare-class `cartoon-surface`, un-rounded (same
  as Sequence).** `MotionPathTarget.vue:3` is `<div class="glass-resting cartoon-surface
  …">`. Same G2 defect as W-SEQ-1: cartoon decoration with no `border-radius`. I5 wants
  a standard non-cartoon `<Card>` here. Path was never touched by W10 G8, so it is in the
  same wrong-register state as Sequence.

- **W-MP-2 (I3 affordance, the headline gap) — the AUTHOR PATH is FIXED; the control
  points are NOT editable.** The drag-the-traveller affordance W5 added scrubs DISTANCE
  along a FIXED path. But the scene is ABOUT `offset-path` — and you cannot SHAPE the
  path. The prior audit's F4 explicitly named the FULL elevation and only landed the
  cheaper half: **"Draggable path control points … surface them as draggable SVG handles
  … dragging a handle re-emits `PATH_D`, which updates BOTH the guide `<path>` and the
  traveller's `offset-path` in lockstep (the geometry is already single-sourced …)"**
  (`a-scene-path-discrete.md:135-137` F4; the editable-path elevation was BOOKed as an H
  follow-up, `H.W5.md:35`). The single-source invariant (`motionPathGeometry.ts`) makes
  this a NATURAL extension: a draggable control point re-emits `PATH_D`, the guide +
  `offset-path` both re-read it, and the traveller re-resolves on the new geometry — no
  drift possible. This turns Path from "scrub a ball along a fixed loop" into "DESIGN a
  motion path, watch the engine sweep it, copy the `offset-path`" — a genuine tool AND a
  copy-paste artifact (the `offset-path` string), exactly the F4 vision. **This is the
  "greatly refined" MotionPath the user asked for.**

- **W-MP-3 (I3/usability) — there is NO copy-the-`offset-path` affordance.** The scene's
  most useful output is the `offset-path: path('…')` string the user could paste into
  their own stylesheet (the Discrete scene's `linear()` artifact is the model —
  `a-scene-path-discrete.md:172` "the most directly useful artifact in the entire
  demo"). MotionPath emits a real `offset-path` but never surfaces it as copyable. Once
  the path is editable (W-MP-2), a "copy `offset-path`" button makes the scene a real
  tool — you shaped a path, here is the CSS.

- **W-MP-4 (I3/affordance discoverability) — the traveller drag is under-signposted.**
  The traveller has `cursor: grab` (`MotionPathTarget.vue:270`) and a footnote "Drag the
  traveller along the path" (`:47-53`). But on a static loop with a small 🙂‍↔️ ball, the
  drag affordance is easy to miss (the prior live audit at W5-time still flagged Path as
  the interactivity laggard). The control-point handles (W-MP-2) are MORE discoverable
  (handles read as draggable) and would carry the affordance better than the lone
  traveller.

- **W-MP-5 (I8/normalization) — `useMotionPathDemo.ts` is anomalously thin; the drag
  logic lives entirely in the Target.** Unlike Sequence/Spring (whose composables own
  the engine + transport), `useMotionPathDemo.ts` (49L) only holds the group + a
  `registerAnimation` (`:28-47`); ALL the drag/projection/ManualTimeline logic is in
  `MotionPathTarget.vue:79-220`. This is acceptable today (the drag needs the live DOM
  els) but I9 (encapsulation audit) + I8 (share/normalize) want the projection +
  scrub-seam logic in a composable (the `useDragScrub` of R-SEQ-F, specialized with the
  path `project`). The Target should hold refs + markup, not the whole gesture engine.

- **W-MP-6 (I11 brittleness) — the `SAMPLE_STEP = 5` nearest-point search + the
  client→SVG-user-unit scale are magic-number-adjacent.** `projectPointer`
  (`MotionPathTarget.vue:118-147`) walks the path in 5-unit steps (~220 samples) and maps
  client px → user units by the stage rect scale. This works (verified live) but is a
  hand-rolled nearest-point search with a tuned step and a manual scale assumption (the
  SVG viewBox fills the stage 1:1). If the stage aspect or viewBox changes, the scale
  math (`:131-134`) silently mis-projects. The `getPointAtLength` approach is correct;
  the brittleness is the un-named SAMPLE_STEP + the implicit-square-viewBox coupling.
  A coarse-then-refine search (or a documented invariant that the stage IS square via
  `aspect-ratio: 1`, `:226`) de-brittles it.

- **W-MP-7 (I3/polish) — no live distance/tangent read-out beyond the header %.** The
  header shows `offset-distance = NN%` (`MotionPathTarget.vue:7-9`). For a motion-path
  scene, the live TANGENT angle (the `offset-rotate: auto` value) is the other half of
  the story — the traveller rotates to follow the path, but the rotation is invisible as
  a number. A small "tangent NN°" read-out (read from the resolved `offset-rotate` or
  computed from two nearby path points) would make the tangent-following legible.

### 2.3 — REFINED DESIGN (MotionPath)

**R-MP-A (I5/I4) — the stage on a STANDARD `<Card>` (glass, resting).** Same as
R-SEQ-A: replace `glass-resting cartoon-surface` (`MotionPathTarget.vue:3`) with the
glass-ui `<Card>` (rounded by construction, I4). The `.mp-stage` viewport
(`min(70vmin, 26rem)` square, `:224-227`) centers inside the card; the card sits in the
`[stage]` track, dock-contained by `.stage-cell`. Converges Path into the I5 four-scene
card register.

**R-MP-B (I3, the headline refinement) — make the PATH editable via draggable control
points (the F4 elevation, landed at last).** Surface the cubic's control points as
draggable SVG handles over the guide (`MotionPathTarget.vue:18-24` SVG guide is the host).
The geometry is single-sourced (`motionPathGeometry.ts`): promote `PATH_D` from a const
to a reactive value derived from the control-point positions; a handle drag updates a
point, re-emits `PATH_D`, and BOTH the guide `<path>` `d` AND the traveller's
`offset-path` re-read it in lockstep (the invariant `motionPathGeometry.ts:1-11`
guarantees no drift). The traveller re-resolves its position on the new geometry on the
next frame (the engine sweeps the scalar; the browser re-resolves path→position). This
is pure REUSE of the single-source invariant + the established Pointer-Events +
`setPointerCapture` demo idiom (the same one orbital-drag/AnimationVisualizer/the
traveller use). The handles dogfood `useDragScrub` (R-SEQ-F) with a `project` that maps
client→user-units (the same scale `projectPointer` already computes, `:131-134`).
**MEASURE-FIRST floor:** if full editable cubic slips, expose 2-3 named PRESET paths
(figure-8, spiral, the current loop) the user can switch — cheaper, still teaches
"the path is data." The full editable path is the I3-faithful target.

**R-MP-C (I3/usability) — surface a "copy `offset-path`" affordance.** Once the path is
editable (R-MP-B), add a copy button (the demo already has `CopyButton.vue`,
`demo/CLAUDE.md`) that copies `offset-path: path('${PATH_D}')`. This makes the scene the
SECOND copy-paste artifact alongside Discrete's `linear()` — "you shaped this path, here
is the CSS." DRY: the same `PATH_D` source feeds the guide, the traveller, AND the
clipboard.

**R-MP-D (I8/I9) — move the projection + scrub-seam into a composable.** Lift the
`projectPointer` + `applyDistance` + the ManualTimeline + the pause/resume-for-gesture
logic (`MotionPathTarget.vue:124-203`) out of the Target into `useMotionPathDemo.ts` (or
into the shared `useDragScrub` of R-SEQ-F with a path-`project`). The Target keeps refs +
markup + the pointerdown/keydown wiring; the gesture engine lives in the composable. This
is the I9 encapsulation audit applied — the anomalously-thin composable (W-MP-5) grows to
hold its scene's logic, matching Sequence/Spring's shape.

**R-MP-E (I3/polish) — a live tangent read-out + a more legible traveller.** Add a
"tangent NN°" caption beside the `offset-distance NN%` header readout (W-MP-7), read from
the resolved tangent (two nearby `getPointAtLength` points → atan2, or the resolved
`offset-rotate`). Optionally make the traveller a small arrow/chevron that visibly points
along the tangent (it already rotates via `offset-rotate: auto`) so the tangent-following
is SEEN, not just numbered. Keep the 🙂‍↔️ as the easter-egg glyph (see EE-MP-2).

**R-MP-F (I11) — de-brittle the projection.** Name `SAMPLE_STEP` as a documented
coarse-search resolution OR replace the linear walk with a coarse-then-refine binary
search; assert the square-viewBox invariant explicitly (the `.mp-stage` is
`aspect-ratio: 1`, `:226-227`, so the client→user scale is uniform — document that
coupling so a future non-square stage does not silently mis-project, `:131-134`).

**EASTER EGGS (MotionPath) — propose, lead selects:**
- **EE-MP-1 "trace the ghost" — double-click the guide path and a faint ghost traveller
  runs the full loop once at speed, leaving a brief motion-blur trail, then fades.** Pure
  delight; reuses the existing sweep at a fun rate. On-brand (it IS the traversal,
  dramatized).
- **EE-MP-2 "the emoji winks" — drag the traveller a full lap (distance crosses 100% back
  to 0% on the closed loop) and the 🙂‍↔️ glyph briefly swaps to 😎 / spins.** The closed
  `Z` loop makes 0%==100% (`a-scene-path-discrete.md:36-42`), so a full lap is a natural,
  detectable gesture; cheap reward.
- **EE-MP-3 "draw mode" — a hidden key toggles a free-draw cursor; click to drop control
  points and the path rebuilds live (a power-user extension of R-MP-B).** Higher effort;
  only if R-MP-B's editable-path lands and there is room.
Recommend EE-MP-2 as the primary (lowest risk, ties to the closed-loop geometry already
proven live).

---

## §3 — Reconciliation with I5 · I8 · the W10 normalization

### 3.1 — I5 (the standard glass-card stage — REVERSES W10 G8)

- **The four stage scenes converge to ONE card register.** I5's instruction — "easing,
  spring, sequence AND path should all have that glass-card encapsulation … a standard,
  non-cartoon glass one" — is, for THIS lane, a SIMPLER state than today's three-way
  split (§0). Sequence + Path already have a card (the wrong, cartoon, un-rounded one);
  I5 swaps `glass-resting cartoon-surface` → glass-ui `<Card>` (default glass/resting).
  Easing + Spring (W10 full-bleed) GAIN that same `<Card>` back. Result: ONE standard
  non-cartoon glass `<Card>` is the stage register for all four — the I8/I12 isomorphism.
- **The W10 G8 LAYOUT PRIMITIVE survives; only the full-bleed CONSEQUENCE reverses.** The
  `.stage-cell` dock-band reserve (`AnimationControlsGroup.vue:345-367`) is the binding
  primitive that contains ANY stage subject between the docks — card or full-bleed. I5
  does not touch it; the card simply sits inside the contained `.stage-cell` as the
  centered subject. The `dock-inset` deletion (W10 G8, `design-idioms.css:470-478`)
  STAYS deleted (no legacy beside the replacement). So I5 reverses ONLY the
  "drop the card → full-bleed" half of G8, not the layout-primitive half.
- **I4 closes for free.** A standard `<Card>` carries `rounded-card` by construction
  (the glass-ui Card root); swapping the bare-class cartoon div → `<Card>` makes
  Sequence + Path rounded with NO ad-hoc `rounded-*` literal — the I4 "rounded at the
  primitive level" mandate satisfied by consuming the primitive, not patching the demo.
  (I4's deeper ask — bake rounding into the card PRIMITIVE so a `cartoon-surface`-only
  div is impossible to leave square — is a glass-ui HANDOFF, inv-16, outside this lane;
  but for Sequence/Path the in-demo fix is simply to consume `<Card>`, which is already
  rounded.)

### 3.2 — I8 (standardize / share / normalize)

- **Sequence/Path are the LAST two un-normalized stage scenes.** W10 normalized
  easing/spring onto the standard ribbon + the `Card surface="cartoon"` sidebar. Sequence
  and Path were skipped (self-contained transport). The I8 normalization for them is NOT
  "force them onto `PlaybackRibbon`" (their transport genuinely differs) — it is: share
  the CARD register (R-SEQ-A/R-MP-A), share the `.btn-playback` SKIN (R-SEQ-C), and share
  the DRAG seam (`useDragScrub`, R-SEQ-F / R-MP-D). Share the idioms, keep the
  scene-specific structure that earns its difference.
- **The `useDragScrub` extraction is the single biggest I8 share-win in this lane.** Five
  consumers (Spring rail, Sequence master-scrub, Sequence per-row drag, MotionPath
  traveller, MotionPath control points) of one pointer→ratio+capture+window-listener
  dance. Extracting it satisfies I8 (share), I9 (encapsulation), I11 (de-brittle — one
  copy not five), and I3 (it is the seam the new affordances dogfood). It crosses the
  3-consumer threshold the W5 audit set for the BOOK (`H.W5.md:66`) — RE-OPEN it.

### 3.3 — The W10 normalization (what to keep, what NOT to re-author)

- **KEEP the W1 FSM + `ScenePlayback` adapters untouched** (Sequence's raw-rAF adapter
  `useSequenceDemo.ts:299-318`, MotionPath's group-state mirror). I2's per-scene
  control-visibility DFA EXTENDS the FSM; this lane's refinements are STAGE/affordance
  changes that route through the EXISTING transport seams.
- **KEEP the engine-loop hygiene** (Sequence's `RAFPlayback` mirror + visibility-pause +
  scope-dispose, `useSequenceDemo.ts:183-191,329-341`; MotionPath's `ManualTimeline`).
  The new affordances (per-row drag, editable path) must dogfood the SAME engine
  primitives (`Sequence.add`/re-sort, `ManualTimeline`, `setChildTime().render()`) — NO
  hand-rolled rAF, inv ζ.
- **The control-visibility DFA (I2) for these two scenes:** Sequence + Path are
  SELF-CONTAINED — their valid control surface is `{stage-only}` (Sequence's transport is
  ON the target; MotionPath uses the bottom-bar scrub). Neither should show the
  controls|keyframes|timeline tabs (Sequence's `isControlsPanelOpen = false`,
  `SequenceScene.vue:28`; MotionPath same, `MotionPathScene.vue:25`). I2's DFA should
  formally enumerate these scenes as `controlSurfaces: []` (or `[transport-only]`) so the
  cube editor panel never bleeds (the §E "Sequence bleeds the cube panel" finding,
  `a-scene-spring-sequence.md:203-237`, which the W1 FSM + the per-scene flag address —
  I2 makes it a first-class DFA state). This lane RECORDS the DFA states; I2's lane owns
  the enumeration.

---

## §4 — Disposition summary + the gate hooks

| # | Scene | Refinement | I-item | Disposition | Falsifiable gate (born-RED today) |
|---|-------|-----------|--------|-------------|------------------------------------|
| R-SEQ-A | Sequence | stage → standard `<Card>` (glass, rounded) | I5/I4 | SHIP | `proof:stage-card-standard` — `SequenceTarget` root resolves non-zero `border-radius` AND is NOT `cartoon-surface` (it is glass `<Card>`); reds on `:3` today |
| R-SEQ-B | Sequence | storyboard subgrid, ONE label column | I1 | SHIP | `proof:label-column-uniform` — all row labels share one computed column width (no per-row `w-20` literal); reds on `:25` today |
| R-SEQ-C | Sequence | Play/Reverse on `.btn-playback` skin | I3/I8 | SHIP | `proof:transport-shared-skin` — Sequence Play/Pause carries `.btn-playback`; reds on `:69-77` today |
| R-SEQ-D | Sequence | rows draggable → re-author `at:` (H-MI-4) | I3 | SHIP (floor: stagger slider) | `proof:sequence-rows-draggable` — drag a row handle → its `at:` / `delays[i]` changes AND `Sequence` re-sorts; reds (no row drag) today |
| R-SEQ-E | Sequence | swept master-playhead line across rows | I3 | SHIP | visual lock — a playhead line element tracks `progress` across the storyboard |
| R-SEQ-F | both | extract `useDragScrub` (pointer seam) | I8/I9/I11 | SHIP | `proof:dragscrub-single` — ≤1 hand-rolled `getBoundingClientRect`-ratio drag block across spring/sequence/motion-path; reds at 3-4 today |
| R-MP-A | Path | stage → standard `<Card>` (glass, rounded) | I5/I4 | SHIP | `proof:stage-card-standard` (covers path) — reds on `MotionPathTarget.vue:3` today |
| R-MP-B | Path | editable path control points (F4 elevation) | I3 | SHIP (floor: preset paths) | `proof:motion-path-editable` — drag a control handle → guide `<path>` `d` AND traveller `offset-path` BOTH change to the SAME `d`; reds (fixed `PATH_D`) today |
| R-MP-C | Path | copy `offset-path` artifact | I3 | SHIP | `proof:motion-path-copy` — a copy affordance emits `offset-path: path(…)`; reds (none) today |
| R-MP-D | Path | move gesture logic → composable | I8/I9 | SHIP | structural — `useMotionPathDemo` owns project/scrub; Target holds refs+markup |
| R-MP-E | Path | tangent read-out + arrow traveller | I3 | RECORD→SHIP | visual — a tangent angle read-out present |
| R-MP-F | Path | de-brittle `SAMPLE_STEP` + viewBox coupling | I11 | RECORD | named-constant / documented invariant |
| EE-SEQ-1 | Sequence | "the reel" cascading wave | I3 | SHIP (1 egg) | hidden trigger replays staggered overshoot |
| EE-MP-2 | Path | "the emoji winks" full-lap reward | I3 | SHIP (1 egg) | full-lap drag swaps glyph |

**ALREADY-SOTA (honest credit, do NOT touch):**
- Sequence's zero-per-frame-Vue ball painting (engine writes `--ball-p`,
  `useSequenceDemo.ts:93-110`); the full F.W9 transport + raw-rAF `ScenePlayback`
  adapter (`:239-318`); the W1 FSM integration (`:154-167`).
- MotionPath's `fromMotionPath` engine seam (offset-path + auto-rotate + scalar sweep on
  a live element, WAAPI-eligible, zero JS geometry — verified live,
  `a-scene-path-discrete.md:21-44`); the single-source `PATH_D` invariant
  (`motionPathGeometry.ts:1-11`); the `ManualTimeline`-driven drag (no bespoke clamp,
  inv ζ, `MotionPathTarget.vue:86,153-165`).

**The one cross-lane handoff to I9/I8 lanes:** `useDragScrub` (R-SEQ-F) is the shared
seam these refinements all dogfood; it lives in `demo/@/composables/` and is consumed by
spring/sequence/motion-path — the I9 encapsulation lane should own its extraction so the
five drag copies collapse to one in ONE motion (no churn-then-delete).

**Net shape:** Sequence gains the standard card (I5) + subgrid labels (I1) + draggable
rows (I3 headline) + shared skin/seam (I8). MotionPath gains the standard card (I5) +
editable path (I3 headline, the F4 elevation finally landed) + copy artifact (I3) +
composable encapsulation (I8/I9). Both keep their SOTA engine seams and self-contained
transport. The four stage scenes converge to ONE glass-card register — the I5/I8/I12
isomorphism. No engine touched (inv ζ / fenced); all DEMO-side; every gate born-RED today.
