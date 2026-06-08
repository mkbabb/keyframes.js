# impl-w12-scenes — LANE A: SEQUENCE + MOTION-PATH enrich + de-brittle + their eggs (S6-seq/path + S4 + EE-SEQ-1/EE-MP-2)

**Lane:** H.W12 LANE A (S6 — I3 sequence/path GREATLY REFINED, the FULL rung; S4 — I11
motion-path de-brittle; the two scene eggs EE-SEQ-1 "the reel" + EE-MP-2 "the emoji winks").
File-disjoint: `demo/sequence/*` + `demo/motion-path/*` + `motionPathGeometry.ts`. BORN on the
SEAM lane's `useDragScrub` + `useMotionPathGesture` (`impl-w12-seam.md` — read first; the I3
affordances are born on that spine, no churn-then-delete).

**Status:** LANDED, tsc-clean (`npm run check` PASS), full test suite GREEN (68 files, 682
pass / 2 expected-fail — no regression; the engine is FENCED, inv ζ, untouched). All four
interactive deliverables VERIFIED LIVE in the running demo (0 console errors). No git commit
(per directive).

**Files (all absolute):**
- M `/Users/mkbabb/Programming/keyframes.js/demo/motion-path/motionPathGeometry.ts` (139L) —
  the single-source `PATH_D` made EDITABLE: a control net (`DEFAULT_POINTS`) + `buildPathD()`
  compiler + the centralized `clientToUserUnits()` square-viewBox scale (S4).
- M `/Users/mkbabb/Programming/keyframes.js/demo/motion-path/useMotionPathDemo.ts` (108L) —
  owns the reactive editable geometry (`points`/`pathD`/`movePoint`/`resetPath`/`copyablePath`).
- M `/Users/mkbabb/Programming/keyframes.js/demo/motion-path/useMotionPathGesture.ts` (326L) —
  the gesture engine grew the control-handle drag (one shared `useDragScrub` consumer with an
  `{x,y}` projection), the single-source re-emit `watch(pathD)`, the tangent readout, and the
  EE-MP-2 full-lap egg. Consumes the centralized scale (S4).
- M `/Users/mkbabb/Programming/keyframes.js/demo/motion-path/MotionPathTarget.vue` (362L) —
  the editable SVG control net (anchors + controls + tethers), the copy-`offset-path` artifact,
  the tangent header readout, the wink glyph swap, the Reset-path button.
- M `/Users/mkbabb/Programming/keyframes.js/demo/sequence/useSequenceDemo.ts` (485L) — reactive
  `delays`, `reseatRow()` (re-author `at:` + re-sort the engine entries), `playReel()`
  (EE-SEQ-1), `STAGGER_MAX`, Reset-restores-default-stagger.
- M `/Users/mkbabb/Programming/keyframes.js/demo/sequence/SequenceTarget.vue` (434L) — the
  draggable row start-handles (shared `useDragScrub`), the swept master-playhead line (pure
  CSS), the hidden-typed-"reel" trigger + the discoverable Reel button.

---

## 1. S4 — motion-path de-brittle (I11 / proof:no-brittle-selector)

The SEAM lane already named `SAMPLE_STEP` and documented the square-viewBox invariant as a
comment in `useMotionPathGesture.ts`. This lane HARDENS it because the editable path adds a
SECOND client→user-unit projection (the control-handle drag) beside the traveller's
nearest-point search — two copies of the same scale would be the exact brittleness I11 names.

**The fix — ONE scale home (`motionPathGeometry.ts`):** `clientToUserUnits(rect, clientX,
clientY)` is the SINGLE site of the square-viewBox coupling. Both projectors (the traveller's
`projectPointer` and the control-handle `project`) call it. The invariant is asserted in ONE
place: the stage is `aspect-ratio: 1` and the guide fills it with `viewBox 0 0 VIEW VIEW`, so
ONE scale (`min(width,height)`) governs both axes; a future non-square stage breaks HERE,
visibly, not in two drifting hand-rolled copies. Degenerate rect → `null` (clean fallback).
`SAMPLE_STEP` stays a named, documented coarse-search resolution.

- **proof:no-brittle-selector GREEN-shaped:** ZERO `.closest(".class")`/`querySelector(".class")`
  class-string DOM walks in either scene (all refs are `useTemplateRef`s); the projection has a
  NAMED constant (`SAMPLE_STEP`) + a documented + centralized viewBox invariant
  (`clientToUserUnits`). Verified: `grep -rn '.closest(\|querySelector' demo/sequence
  demo/motion-path` → NONE.
- **proof:dragscrub-single GREEN-shaped:** `setPointerCapture` + window `pointermove`/`pointerup`
  exist in EXACTLY ONE file (`demo/@/composables/useDragScrub.ts`). The NEW affordances (row-drag,
  control-handle drag) are all `useDragScrub` consumers — ZERO hand-rolled drag dances in the
  scene files. The `getBoundingClientRect` reads that remain are pure `project` GEOMETRY closures
  (the seam's documented carve-out).

---

## 2. S6 — MOTION-PATH greatly refined (I3 / the F4 elevation)

### 2.1 The editable path — the single-source invariant (proof:motion-path-editable)

`PATH_D` is no longer a frozen literal. `motionPathGeometry.ts` is now a CONTROL NET
(`DEFAULT_POINTS`: 3 anchors + 6 explicit cubic controls — the former two `S` shorthands
expanded to explicit `C` so EVERY control is independently draggable) + `buildPathD()` that
compiles the net to the ONE `d` string. **Geometric isomorphism witness:** `buildPathD(
DEFAULT_POINTS)` traces the SAME curve as the legacy `S`-form (`LEGACY_PATH_D`) — verified
segment-by-segment (the `S` controls = the reflected explicit controls); the un-dragged path is
pixel-identical to the former const.

The reactive net lives in `useMotionPathDemo` (`points`/`pathD`). A control-handle drag (one
shared `useDragScrub` consumer in `useMotionPathGesture`, latched by `activeHandle`, `{x,y}`
projection via the centralized `clientToUserUnits`) calls `demo.movePoint(id, x, y)` → re-emits
`pathD`. BOTH consumers re-read the ONE source in lockstep:
- the guide `<path>` `:d="demo.pathD.value"` (reactive bind),
- the traveller's `offset-path` — re-written by `watch(pathD)` in the gesture composable
  (`el.style.offsetPath = \`path('${d}')\``), then re-measured + re-seated so the traveller
  re-resolves on the new geometry.

**VERIFIED LIVE:** dragging control point c0 (60,80)→(120,40): the guide `d` became `M 60 200
C 120 40, 200 80, ...` AND the traveller's computed `offset-path` became the SAME `d` —
`proof:motion-path-editable` GREEN (both change to the same `d`, no drift). The 9 handles
render (3 solid anchors ON the path, 6 hollow controls OFF it) with faint anchor→control
tethers showing the cubic structure.

### 2.2 The copy-`offset-path` artifact (proof:motion-path-copy)

`copyablePath` = `offset-path: path('${pathD}');` — re-reads the SAME single source, so what you
copy IS what you shaped. Surfaced via the existing `CopyButton` + a `.artifact` `<code>` block
(the SAME inline-code register Discrete/StartingStyle use for their `linear()` — the demo's
two copy-paste artifacts read identically). **VERIFIED LIVE:** the artifact emits `offset-path:
path('M 60 200 C ...')` and updates live as the path is edited.

### 2.3 The tangent readout (R-MP-E / W-MP-7)

Header reads `offset-distance = NN% · tangent NN°` — the tangent is two nearby `getPointAtLength`
samples around the live distance → `atan2`. **VERIFIED LIVE** (showed `tangent -89°` at 0%).

### 2.4 EE-MP-2 "the emoji winks" (proof:easter-egg)

A full-lap traveller drag (signed |delta| accumulated around the closed `Z` loop's [0,1) ring;
≥1 whole loop fires it) swaps the 🙂‍↔️ glyph to 😎 + a one-shot spin (transform/box-shadow only,
compositor-friendly; reduced-motion drops the spin, keeps the glyph swap). Off the normal scrub
path — a partial scrub never triggers it. **VERIFIED LIVE:** a full-lap drag set `winking=true`,
glyph → 😎.

### 2.5 I9 note (the gesture engine stays in the composable)

The W-MP-5 lift HOLDS: the Target's `<script>` holds NO projection math — refs + markup + the
tethers view-derivation + the handle keyboard nudge. The gesture engine (projection, scrub-seam,
ManualTimeline, the control-handle drag, the single-source re-emit) lives in
`useMotionPathGesture`. `useMotionPathDemo` grew to own the geometry STATE (the provide-side data
the Target binds + the gesture mutates) — the right home (it is the injected demo both consume).

---

## 3. S6 — SEQUENCE greatly refined (I3 / H-MI-4)

### 3.1 Draggable storyboard rows (proof:sequence-rows-draggable)

`delays` is now reactive; `reseatRow(index, at)` re-authors a child's master-clock offset live.
ONE shared `useDragScrub` consumer drives every row handle (latched by `activeRow`); the
`project` reads THAT row's track rect → `[0,1]` ratio → an `at:` across `[0, STAGGER_MAX]`. The
re-author dogfoods the engine's OWN position-insertion: the matching `Sequence` entry's `at` is
set and the entries re-sort by `at` (the SAME re-sort `Sequence.add` runs internally), then a
re-seek repaints. The scrubbed snapshot round-trips through the W1 machine.

**VERIFIED — two ways.** (a) Against the REAL engine (Node): reseating child B 260→800 re-sorts
entries to `[A@0, C@520, B@800]`, `duration` recomputes 1420→1700, `seek` works on the
re-authored timing. (b) LIVE: dragging row 1's handle changed its label `@260ms`→`@1440ms` (the
`delays[i]` re-emits, the engine re-sorts). `proof:sequence-rows-draggable` GREEN.

The transport **Reset** now ALSO restores the default stagger staircase (undoing any row
re-author) — Reset returns the storyboard to pristine. VERIFIED LIVE (drag row 2 → `@1120ms`,
Reset → `@520ms`).

### 3.2 The swept master-playhead line (R-SEQ-E)

A single vertical line crosses all five row tracks at `progress`, so the stagger is SEEN as a
sweep (each ball "wakes" as the line enters its window). Pure CSS — a `.seq-playhead-track`
wrapper spans ONLY the shared track region (inset past the label column), so the line's `left: %`
resolves against the TRACK width (the SAME axis the row handles ride); translateX centers it.
**VERIFIED LIVE:** at 50% progress the playhead center sits exactly at the track midpoint, and
the wrapper aligns to ±0px with the row track. Driven by the one `progress` the scrub ball
already pays for — no extra per-frame Vue cost.

### 3.3 EE-SEQ-1 "the reel" (proof:easter-egg)

A HIDDEN typed-"reel" trigger (i-r5's primary; scene-scoped via vueuse `useEventListener`,
auto-cleanup, ignores editable targets) replays the five balls as a cascading-wave overshoot,
IGNORING the master clock once: each child is driven standalone (`managed=false`) with an
under-damped overshoot spring (`response 0.42 / ζ 0.34`) fired in a 90ms stagger (the wave),
then restored to its glide easing + `managed=true` and re-settled to the live playhead. Reuses
the existing engine children (inv ζ — no new engine code, no hand-rolled rAF). A discoverable
Reel button (clapperboard) is the graceful twin. **VERIFIED LIVE:** typing "reel" set
`reel-active=true` and the first ball mid-glided (`--ball-p 0.67`) while the others stayed at 0 —
the cascade.

### 3.4 Kept ALREADY-SOTA (untouched, honest credit)

The zero-per-frame-Vue ball painting (engine writes `--ball-p`), the full F.W9 transport + the
raw-rAF `ScenePlayback` adapter, the W1 FSM integration, the `.btn-playback` skin share (the
seam lane's S1) — all preserved. The row-drag + reel are ADDITIVE on those seams.

---

## 4. I10 / 500L + colocation

Every lane file is ≤500L (max `useSequenceDemo.ts` 485, `SequenceTarget.vue` 434). The geometry,
the two composables, the keys, and the Target are colocated in each scene dir — coherent, no
orphan, no manufactured split. The geometry STATE moved into `useMotionPathDemo` (colocated
beside the gesture composable + the Target) rather than a stray module. proof:demo-no-oversize
holds (born-GREEN regression guard intact — the enrichment did NOT push any Target over 500L).

---

## 5. Styling (I12 / ISOMORPHIC unless NAMED)

All new visuals consume OWNED idioms or introduce NAMED, befitting deltas — NO new
referenced-but-undefined idiom-shaped class:
- The traveller/balls keep the `.progress-ball` idiom (`--ball-size`/`--ball-glow`).
- The copy artifact uses the SAME `.artifact` recipe Discrete/StartingStyle use (the inline-code
  register); `.code-token` for prose API names — both OWNED.
- NEW scene-scoped classes (`.mp-handle`/`.mp-tether`/`.seq-handle`/`.seq-playhead`/
  `.seq-playhead-track`) are component-LOCAL editor affordances tinted from the shared
  `--color-progress` tone — they EARN their place (the editable-path + draggable-timeline
  affordances that did not exist before), not ad-hoc forks of a shared idiom.
- Named constants replace magic numbers: `STAGGER_MAX`, `SAMPLE_STEP`, `REEL_STAGGER`,
  `HANDLE_STEP`, `ROW_AT_STEP`, the `.seq-storyboard` `--label-col`/`--row-gap`/`--track-inset`
  track-axis vars. The swept-line + handle positions derive from named axes, not literals.
- Reduced-motion: the wink spin + handle transitions degrade under `prefers-reduced-motion`
  (the glyph swap survives — the reward without the motion).

No magic-number/brittle-calc regression introduced. proof:styling-idioms (clause b, the
regression guard) holds for this lane.

---

## 6. Verification summary (the gates this lane greens)

| Gate | Disposition | Evidence |
|------|-------------|----------|
| `proof:motion-path-editable` | GREEN | LIVE: drag c0 → guide `d` AND traveller `offset-path` BOTH → same new `d` |
| `proof:motion-path-copy` | GREEN | LIVE: `.artifact` emits `offset-path: path('…')`, updates on edit |
| `proof:sequence-rows-draggable` | GREEN | LIVE: drag row handle → `@260ms`→`@1440ms`; Node: engine re-sorts entries |
| `proof:easter-egg` (path EE-MP-2) | GREEN | LIVE: full-lap drag → glyph 🙂‍↔️→😎, `winking=true` |
| `proof:easter-egg` (seq EE-SEQ-1) | GREEN | LIVE: type "reel" → `reel-active`, cascading wave (`--ball-p` 0.67 / 0 / 0 / 0 / 0) |
| `proof:no-brittle-selector` | GREEN | named `SAMPLE_STEP` + centralized `clientToUserUnits` viewBox invariant; ZERO class-string DOM walks |
| `proof:dragscrub-single` | GREEN | `setPointerCapture`/window-listeners ONLY in `useDragScrub.ts`; the new affordances are seam consumers |
| `proof:demo-no-oversize` | GREEN | all lane files ≤500L (max 485) |

**Engine FENCED (inv ζ):** no `src/animation` edit; the affordances dogfood public primitives —
`Sequence` re-sort + `seek`, `ManualTimeline`, `setChildTime().render()`, the children's standalone
`play()` for the reel. Full test suite GREEN confirms no engine regression. The W1 FSM + W11
DFA/card + W10 normalization all hold.

**Note on live verification:** the shell briefly failed to render because a STALE localStorage
`timingFunction: "cubic-bezier"` value (a corrupted stored animation option, NOT a source bug —
the value.js dev-export easing-registry gotcha) crashed the cube-scene setup. Clearing
localStorage recovered the shell (0 errors), after which all Lane A affordances verified live.
This is environmental (a pre-existing stored-state corruption), out of this lane's scope.
