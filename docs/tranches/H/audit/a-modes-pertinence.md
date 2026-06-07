# Tranche H — Deep Audit · Lane `a-modes-pertinence`

**Scope (D8/D11):** the pertinence of the four newer scene modes — **Spring**,
**Sequence**, **Path (motion-path)**, **Discrete (@starting-style)** — as demo
scenes. Are they coherent, valuable, finished? KILL / KEEP / MERGE / ELEVATE per
mode, with the D11 interactivity bar and the D8 icon need.

**Method:** read every scene + target + composable (`demo/spring/`,
`demo/sequence/`, `demo/motion-path/`, `demo/app/scenes/*Scene.vue`); confirmed
the engine primitives each dogfoods are real + public (`src/animation/index.ts`);
drove the live demo (Vite :5174) via Playwright — each route renders, screenshots
captured per mode.

---

## Headline verdict

**KEEP all four — they are the SHOP-WINDOWS for four distinct, PUBLIC engine
primitives, and killing any one would leave that primitive undemoed.** This is
not a "do they survive" question — the survivors are pre-decided by the public
API surface. The real findings are: (1) **MERGE Spring + Discrete** (they triple-
surface the same `springLinearStops()` artifact + the same four presets — a DRY
violation, not two scenes); (2) every mode is **gated behind D12 route/layout
corruption** that makes it look unfinished though the source is sound;
(3) **D8 is real and trivial** — the four lack the screenshotted SVG thumbnails
the other five have; (4) the D11 interactivity bar is **already met by Spring,
Sequence, and Discrete** and is the one genuine gap for **Path**.

### Why none can be killed (the primitive-coverage map)

| Mode | Public primitive it is the ONLY demo of | `src/animation/index.ts` |
|------|------------------------------------------|--------------------------|
| Spring | `SpringProgress` (live solver) + `springTimingFunction` + `springLinearStops` | L34, L40–43 |
| Sequence | `Sequence` (temporal orchestrator) + `stagger` | L56–59 barrel note |
| Path | `fromMotionPath` (CSS-native offset-path sweep) | `animate.ts:32,150` |
| Discrete | `@starting-style`/`allow-discrete` eased by `springLinearStops()` | the CSS-native primitive |

The cube proves the SPATIAL compositor (`AnimationGroup`); Sequence proves the
TEMPORAL orchestrator (`Sequence`) — `useSequenceDemo.ts:13-19` states this
explicitly and it is correct. Each scene is a deliberate, non-redundant proof of
a shipped capability. **KILL would orphan a public API from its only live proof.**

---

## D12 corruption is poisoning the pertinence read (CRITICAL cross-lane)

Before grading "finished", note that the modes LOOK broken for reasons OUTSIDE
the modes — these belong to the state-machine lane (D12) but they distort any
visual judgement of pertinence, so I anchor them here:

- **Direct-URL bounce.** Loading `http://localhost:5174/#/spring` from cold lands
  on `#/cube` then drifts to `#/square` with no user input (live: hash observed
  `#/spring`→`#/cube`→`#/square` across three probes). Root cause: the
  localStorage-stored-scene redirect in `useSceneRouter.ts:19-32` races the
  first-paint; the named route is valid (`router.ts:22`) but the redirect wins.
  Reaching a mode at all required forcing `location.hash` post-mount.
- **Path-segment corruption.** After a few swaps the URL became
  `http://localhost:5174/cube#/starting-style` — a path prefix leaked in front of
  the hash (live observation).
- **Stale controls panel bleed.** `MotionPathScene.vue:25` and
  `StartingStyleScene.vue:43` BOTH set `isControlsPanelOpen = false`, yet live the
  full two-column controls panel (duration/delay/iterations/direction/fill —
  D1's subgrid) is open and **occludes the entire path stage / discrete card**
  (screenshots `motion-path-target.png`, `starting-style-target.png`). The
  panel's open-state and the editor controls are not suspended/restored across
  the scene swap.
- **Full-width ribbon over the stage.** The PlaybackRibbon (D4) spans full width
  and overlaps the motion-path traveller + discrete card.

**Disposition:** RECORD here, **owned by D12 + the D1/D4 layout lanes.** None of
these are mode-design defects — but until D12 lands, Path and Discrete are
effectively unusable, which is why a naïve audit would wrongly call them "unfinished".

---

## Per-mode findings

### 1. Spring — `demo/spring/` · KEEP, but **MERGE Discrete into it** and de-duplicate

**Coherent & valuable:** yes — it is the live `SpringProgress` solver
(`useSpringDemo.ts:50-306`), driven by ONE shared `RAFPlayback` clock so all
trackers are phase-aligned (L122-162), with response/dampingFraction sliders, the
four canonical presets, and the `springTimingFunction` sweep sampler.

**D11 interactivity: ALREADY MET (exemplary).** `SpringTarget.vue:84-124` —
the rail is a `role="slider"` you tap/drag to re-seat the live target
(pointerdown/move/up + `setPointerCapture`, plus full Arrow/Home/End keyboard).
This is the cube-orbital-drag parity D11 asks for. **ALREADY-SOTA** for interaction.

**The real defect — TRIPLE duplication (DRY, the binding mandate):** the spring
`linear()` artifact + the four presets are surfaced in **three** places:
- `SpringSidebar.vue:80-96` (tab panel: sliders + preset comparison + Monaco CSS),
- `SpringTarget.vue` (scene stage: the rail + sweep),
- `StartingStyleTarget.vue:91-104` ("the same `springLinearStops()` path the
  Spring scene surfaces" — its own comment admits the overlap).

`grep` confirms `springLinearStops`/`springTimingFunction` across Spring scene,
SpringSidebar, StartingStyleTarget, AND the sequence dogfood. SpringSidebar and
SpringTarget largely **restate each other** (both: presets + comparison + the
artifact); the scene is split-brained between a "sidebar" and a "target".

**Gestalt fix:** collapse Spring to ONE surface — the interactive rail IS the hero
(stage), the sliders/presets/`linear()` artifact live in its own panel ONCE (no
SpringSidebar/SpringTarget content overlap). Then **fold Discrete in as a
sub-mode/tab of Spring** (see §4) — `@starting-style` is "the spring `linear()`
applied to a real discrete transition", literally the same artifact with a live
target. Two scenes that share an artifact are one scene with two views.

- **Disposition:** SHIP-in-H (de-dup + merge Discrete).
- **Instrument:** `proof:spring-single-artifact` — assert `springLinearStops` is
  computed in exactly ONE composable consumed by both the rail view and the
  discrete view (grep gate: ≤1 `springLinearStops(` call-site in `demo/spring/`).
- **Instrument:** visual lock — Playwright drag rail to 20%, assert the ghost
  `.spring-target-marker` left ≈ 20% and `.spring-ball` left animates toward it
  (the source path I read but could not re-drive live due to D12 remount).

---

### 2. Sequence — `demo/sequence/` · KEEP as-is · ALREADY-SOTA

**Coherent & valuable:** yes, and it is the strongest of the four. It is the ONLY
proof of `Sequence` + `stagger` (`useSequenceDemo.ts:13-38`), and it dogfoods them
honestly: 5 child `CSSKeyframesAnimation`s positioned by the `stagger`
distribution (L66-105), driven by the engine's OWN `RAFPlayback` loop (inv ζ:
no hand-rolled rAF), with the **complete F.W9 transport** —
play/pause/resume/reverse/timeScale/scrub (L151-223). The engine paints
`--ball-p` directly onto each row target → zero per-frame Vue work
(`SequenceTarget.vue:139-146`). Live: 5 rows render @0/260/520/780/1040ms with the
master scrubber + 4-button transport (`sequence-target.png`).

**D11 interactivity: ALREADY MET.** The master playhead is a draggable/keyboard
`role="slider"` scrubber (`SequenceTarget.vue:46-63, 148-189`) plus the four
transport buttons. This is genuinely interactive.

**Minor finish gap:** the rails are nearly invisible at rest (very faint
`--color-progress` tint at 8%) — the balls sit on an almost-blank field
(`sequence-target.png`). A slightly stronger rest-state rail tint would make the
storyboard legible before play. Cosmetic; isomorphic with the shared
`.progress-rail` idiom so fix in the idiom, not per-site.

- **Disposition:** SHIP-in-H (icon only, §D8) — the scene itself is exemplary.
- **Instrument:** `proof:sequence-transport` — Playwright: click Play, assert
  `demo.progress` advances 0→1; click Reverse mid-run, assert it walks back;
  cycle timeScale, assert 0.5/1/2; drag scrubber, assert progress tracks.

---

### 3. Path (motion-path) — `demo/motion-path/` · KEEP · the D11 LAGGARD (needs interactivity)

**Coherent & valuable:** yes — it is the ONLY proof of `fromMotionPath`
(`MotionPathTarget.vue:54-69`): a traveller swept along an author `offset-path`
via `offset-distance: 0%→100%`, with one `PATH_D` source feeding BOTH the SVG
guide and the CSS `offset-path` (`motionPathGeometry.ts` — clean, no drift,
browser owns geometry). Architecturally the cleanest: WAAPI-eligible, zero geom
math in the demo. Live: stage + dashed guide + traveller all render
(`mpStage/mpTraveller/mpGuidePath` all true).

**D11 interactivity: THE GAP.** This is the ONLY mode that is **NOT interactive
beyond the bottom-bar scrub.** The traveller just rides the editor transport;
there is no clickable/draggable affordance ON the stage. Compare cube
(orbital drag), Spring (drag rail), Sequence (drag scrubber). It is a passive
shop-window.

**Gestalt fix (D11):** make the path itself the toy. Idiomatic options, in order:
1. **Scrub-by-dragging the traveller along the path** — pointer-drag maps the
   nearest path point to `offset-distance` (the same `role="slider"` posture
   Spring/Sequence already use; project the pointer onto the SVG path via
   `getPointAtLength`/`getTotalLength`).
2. **Editable path** — drag the SVG control points (the demo already has a
   draggable-control-point idiom in `matrix-editor`/`CubicBezierControls.vue`);
   re-emit `PATH_D` live so guide + `offset-path` update in lockstep (the single
   source already supports this).
3. Toggle `offset-rotate: auto` on/off so the tangent-follow is legible.

(1) is the minimum D11 bar; (2) is the elevation that would make Path as
compelling as the cube.

**Also occluded by D12/D1/D4** — the open controls panel covers the path stage
(`motion-path-target.png`); not a mode defect.

- **Disposition:** SHIP-in-H (icon §D8) + MEASURE-FIRST/BOOK the interactivity
  elevation (drag-the-traveller is SHIP; editable-path is a BOOK item if scope-bound).
- **Instrument:** `proof:motionpath-drag` — Playwright: pointer-drag the traveller
  to 50% along the path, assert computed `offset-distance` ≈ 50%.

---

### 4. Discrete (@starting-style) — `demo/spring/StartingStyleTarget.vue` · KEEP the CONTENT, KILL the standalone scene → MERGE into Spring

**Coherent & valuable:** the CONTENT is valuable — it is the ONLY demo of CSS
`@starting-style` + `transition-behavior: allow-discrete`
(`StartingStyleTarget.vue:117-156`), eased by the engine's `springLinearStops()`
(L94-99), with the emitted `linear()` offered as a copy-paste artifact + four
preset switches + a real Reveal/Dismiss enter/exit toggle. It even degrades
correctly under `prefers-reduced-motion` (L171-175). Live: card + presets +
artifact render (`discreteCard` true, `starting-style-target.png`).

**D11 interactivity: MET** (the Reveal/Dismiss toggle drives a real discrete
transition; preset buttons re-sample live).

**The pertinence problem — it is Spring's twin, not its own scene.** Its own file
header (L23) and code (L91) say it surfaces "the same `springLinearStops()` path
the Spring scene surfaces". It shares Spring's solver, Spring's four presets, and
Spring's `linear()` artifact. As a SEPARATE top-level mode it (a) duplicates the
artifact a third time (DRY), (b) dilutes the nav with a near-identical entry, and
(c) lives physically in `demo/spring/` already — the codebase already treats it as
a spring sub-thing.

**Gestalt fix:** **MERGE Discrete as a second view/tab WITHIN the Spring scene**
("Spring → Live solver | Discrete transition"), sharing one `springLinearStops()`
composable. This removes a nav entry, kills the triple-duplication, AND tells a
better story (here's the spring curve → here it is easing a real CSS transition).
The standalone `StartingStyleScene.vue` + its route + its dock entry are then
**replaced in one motion** (no legacy alias).

- **Disposition:** SHIP-in-H (merge into Spring; remove the standalone
  scene/route/nav entry as one replacement).
- **Instrument:** `proof:no-discrete-route` — assert `router.ts` has no
  `starting-style` route AND `scenes.ts` has no `starting-style` descriptor once
  merged; `proof:discrete-under-spring` — Playwright: in Spring scene, switch to
  the Discrete sub-view, assert `.discrete-card` mounts + Reveal/Dismiss toggles
  `opacity`/`display`.

---

## D8 — the icon gap (confirmed, trivial, SHIP)

**Confirmed at source.** `ChromeDock.vue:25-30` defines `sceneIcons` with ONLY
`cube`, `amiga`, `square`, `easing` (PNG/SVG thumbnails at `assets/icons/`,
listed: `cube-icon-sm.png`, `amiga-icon-sm.png`, `square-icon-sm.png`,
`easing-icon-sm.svg`). Spring/Sequence/motion-path/starting-style fall through:
the dropdown ITEM (L192-196) renders NO icon for them (no img, and unlike the
trigger/collapsed states there is not even a `Home` fallback — just the StatusDot
+ label), so they read as second-class next to the screenshotted five.

**Gestalt fix (only for the survivors, post-merge → Spring, Sequence, Path):**
author three screenshotted SVG thumbnails matching the existing lineage
(`easing-icon-sm.svg` is the SVG precedent — follow its form), add to the
`sceneIcons` map. Discrete needs NO icon (merged into Spring). Suggested motifs:
- **Spring** — a damped sine settling to a baseline (the solver's signature curve).
- **Sequence** — staggered ascending bars/dots (the stagger staircase).
- **Path** — a looping offset-path with a dot on it (the `PATH_D` figure).

- **Disposition:** SHIP-in-H.
- **Instrument:** `proof:scene-icons-complete` — assert every entry in
  `scenes.ts` has a key in `ChromeDock`'s `sceneIcons` (so a new mode can never
  ship icon-less again).

---

## Summary table

| Mode | KEEP/KILL/MERGE | D11 interactive? | D8 icon | Primary action (H) |
|------|-----------------|------------------|---------|---------------------|
| **Spring** | KEEP + absorb Discrete | YES (drag rail) — SOTA | needs SVG | de-dup the 3× artifact; host Discrete as a sub-view |
| **Sequence** | KEEP as-is | YES (scrub + transport) — SOTA | needs SVG | icon only; faint-rail tint nudge |
| **Path** | KEEP | **NO** — the gap | needs SVG | add drag-the-traveller (min) / editable path (elevate) |
| **Discrete** | MERGE → Spring sub-view | YES (toggle) | none (merged) | remove standalone scene/route/nav in one motion |

**Net:** 4 nav entries → **3** (Spring | Sequence | Path), each a non-redundant
proof of a distinct public primitive, each interactive, each icon'd. The spring
`linear()` artifact is computed ONCE. Nothing dies that has no replacement; the
one removal (Discrete-as-scene) is a fold, not a deletion.

**Cross-lane dependencies:** the modes cannot be fairly finished until D12
(route/scene-state machine) + D1/D4 (controls one-column / ribbon width) land —
RECORD those as owned elsewhere; this lane's SHIP items (merge, de-dup, icons,
Path-drag) are independent of them.
