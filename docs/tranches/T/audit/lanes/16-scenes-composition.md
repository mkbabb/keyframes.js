# Lane 16 — demo/scenes composition (VERDICT #26, scenes-specific deep dive)

**Surface:** `demo/scenes/<name>/` — all 9 fused scenes, every file, every line count.
**Method:** static file census (`find`/`wc -l`), full-file reads of the largest member in
each scene, cross-file grep for duplicated shapes (painter registries, constants),
comment-density spot checks. Read-only against `tranche-s-impl`.
**Grounding:** VERDICT #26 — *"demo/scenes — why aren't these properly composed into
sub-components?"* — the scenes-specific clause inside the broader demo-structure
indictment. Cross-reads lane 13 (`13-demo-structure.md`), whose F9 already surveyed
`scenes/` at whole-tree altitude and found the component graph "genuinely clean," with
the bulk mostly explained by heavy scoped `<style>` blocks. **This lane goes one level
deeper than F9's per-scene claim** and finds a real, second axis of "not properly
composed" that F9's CSS-mass argument does not cover: several scenes concentrate ALL
non-template logic into ONE big composable even where the demo's own established
"ceiling-split" convention (see F0 below) says otherwise — and one concrete DRY
violation (the painter-registry shape) is duplicated verbatim across scene boundaries,
which is exactly a shared-vs-scene-private boundary failure.

> **The one-sentence finding:** the scenes are not uniformly decomposed — `cube/`,
> `square/`, and `compose/` already hit the owner's `{components, composables}`
> recursive shape (sub-packages with their own `composables/`, `index.ts`, `types.ts`);
> `spring/`, `sequence/`, and `motion-path/` instead concentrate 7–11 distinct concerns
> into ONE 400–470-line orchestrator composable that never got the same sub-package
> treatment, and `easing/` decomposed exactly HALF of its two view-modes (the hero
> stage got a sub-component, the comparison-track view didn't) — an asymmetry, not a
> uniform absence. Layered under all of it: the "paint one ball each frame off a
> registered callback set" idiom is independently reinvented, verbatim, in `easing/`
> and `spring/` — the textbook case for a shared composable that was never extracted.

---

## Part 0 — The whole-scenes census (mass + the ceiling-split precedent)

| Scene | Files | LOC (vue+ts+css) | Largest single file | Sub-package tier? |
|---|---:|---:|---|---|
| `cube/` | 20 | 2,790 | `OrbitalDrag.vue` 352L | **YES** — `matrix-editor/` + `orbital-drag/` (own `composables/`, `index.ts`, `types.ts`) |
| `spring/` | 15 | 2,770 | `useSpringDemo.ts` 462L | partial — 5 sibling composables, but the orchestrator itself is still the biggest file in the scene |
| `easing/` | 10 | 2,188 | `EasingTarget.vue` 435L | partial — `EasingHeroStage.vue` extracted; comparison-track view is not |
| `compose/` | 12 | 1,672 | `AssetViewport.vue` 284L | **YES** — `asset-manager/` sub-package (5 components + composable + types + barrel) |
| `sequence/` | 10 | 1,402 | `useSequenceDemo.ts` 467L | **NO** — only 2 small state-only siblings (76L combined); every engine concern lives in the one file |
| `amiga/` | 9 | 1,433 | `AmigaScene.vue` 334L | partial — 4 focused composables (boot/three/spin/demo), each single-concern |
| `motion-path/` | 5 | 1,281 | `MotionPathTarget.vue` 494L | **NO** — the ENTIRE gesture/projection/editable-path engine is one 409L composable |
| `square/` | 5 | 1,173 | `SquareScene.vue` 469L | **YES** (small scene) — `SquareInstrument.vue` + 2 focused composables |
| `morph/` | 5 | 631 | `MorphTarget.vue` 335L | N/A — scene is small enough that one composable is proportionate |

**The demo's OWN established convention (cite it, because it settles the "is this a
real defect" question):** `SequenceScrubber.vue`'s header comment states the pattern
explicitly — *"Colocated sub-unit of SequenceTarget (J.WZ — split at the scrubber seam
to hold the ≤500L demo ceiling; it injects ONLY `demo`, no Target-private state)"*
(`demo/scenes/sequence/SequenceScrubber.vue:1-5`). This is a real, named, precedented
move: when an SFC nears the ceiling, carve the natural sub-view seam into a sibling
`.vue` that injects the same demo key. `useSequenceInstrument.ts`'s header says the
identical thing about ITS split (`useSequenceDemo.ts` mirroring `SequenceScrubber`,
`demo/scenes/sequence/useSequenceInstrument.ts:1-4`). **So the convention exists,
is named, and is applied inconsistently** — `SequenceTarget.vue` (the view) got the
split; `useSequenceDemo.ts` (the engine, still 467L) did not get an equivalent split
on the composable side, despite carrying more distinct concerns than the view.

---

## Part 1 — Per-scene decomposition map

### cube/ — the REFERENCE shape (no defect; cite as the pattern to generalize)

```
cube/
├── CubeScene.vue (267L) · CubeTarget.vue (302L) + CubeTarget.css (222L, sibling split)
├── CubeAxisLines.vue (88L)        # presentational sub-component (the axis-lock reveal)
├── useCubeDemo.ts (133L) · useCubeRelit.ts (119L)   # two focused, single-concern composables
├── cubeTransformStore.ts (20L) · cubeKeys.ts (9L)
├── matrix-editor/                  # a SUB-PACKAGE: its own composable + pure math + index barrel
│   ├── MatrixEditor.vue (159L) · transformMath.ts (55L) · useTransformState.ts (240L) · index.ts
└── orbital-drag/                   # a SUB-PACKAGE with its OWN composables/ tier
    ├── OrbitalDrag.vue (352L) · quaternionEuler.ts (64L) · types.ts (15L) · index.ts (116L)
    └── composables/
        ├── useOrbitalPointer.ts (249L) · useOrbitalPinch.ts (201L)
        └── useOrbitalInertia.ts (144L) · inertiaDecay.ts (34L)
```

This is, file-for-file, the owner's recursive `{components, composables, constants}`
ask already realized (`demo/CLAUDE.md:23` — "matrix-editor/ + orbital-drag/ (S.D2
colocation)"). Four single-concern composables under `orbital-drag/composables/`
(pointer capture, pinch, inertia decay, the shared math) instead of one fused
"cube gesture" god-file. **No T recommendation needed here — this is the shape
`sequence/` and `motion-path/` should be measured against.**

### square/ — the reference shape at small scale

```
square/
├── SquareScene.vue (469L: ~215L template/comments, ~254L script/style — see F1)
├── SquareInstrument.vue (213L)     # the derived-read coordinate-field/tether/telemetry sub-unit
├── useSquareDemo.ts (384L) · useSquareKeyboard.ts (102L)
└── squareKeys.ts (5L)
```
`SquareScene.vue` DOES delegate the instrument layer to a sibling and the keyboard
"envelope tour" egg to its own composable — the same shape as cube, just with one
fewer sub-package tier (square doesn't need one; its interaction surface is 2D drag +
keyboard, not a 3D gesture stack).

### compose/ — the reference shape (structure sound; scene itself is a PRUNE candidate)

```
compose/
├── ComposeScene.vue (165L) · ComposeTarget.vue (183L)
├── useComposeDemo.ts (110L) · composeKeys.ts (17L)
└── asset-manager/                   # a full sub-package: components + composable + types + barrel
    ├── AssetViewport.vue (284L) · AssetLayerPanel.vue (185L) · AssetPropertiesPanel.vue (218L)
    ├── AssetLayer.vue (182L) · EditableLabel.vue (49L)
    ├── useAssetManager.ts (213L) · assetTypes.ts (60L) · index.ts (6L, a REAL barrel)
```
`asset-manager/` is the single cleanest sub-package in the entire `scenes/` tree: five
presentational components (viewport/panel/properties/layer/label), ONE state composable,
ONE types module, and a real (non-stub) barrel. **Note the disposition conflict, stated
plainly so it doesn't get lost**: VERDICT #23 wants `compose` pruned wholesale
("motion-path, morph, and compose likely need to just be pruned"; owned by lane 07).
This lane's finding is orthogonal — IF compose survives triage, its internal shape is
the one to imitate; if it doesn't, the shape is still worth lifting as the template for
whatever the T re-plan puts in `spring/`/`sequence/` (below), since a prune doesn't
retroactively fix the OTHER scenes' composition.

### easing/ — an asymmetric decomposition (real finding)

```
easing/
├── EasingScene.vue (126L)
├── EasingTarget.vue (435L)          # ← mixes TWO fully distinct view-modes, see below
├── EasingHeroStage.vue (390L)       # the "singular" mode — EXTRACTED, painter+CSS travel together
├── EasingSidebar.vue (279L) · EasingCurvePhysics.vue (234L)
├── useEasingDemo.ts (420L) · useEasingGallery.ts (69L) · useEasingGhost.ts (44L)
├── useEasingTraceSmear.ts (57L) · easingGroups.ts (125L) · easingKeys.ts (9L)
```

**F1 — `EasingTarget.vue` extracted ONE of its two view-modes, not both.**
`EasingTarget.vue` renders two mutually-exclusive modes: `viewMode === 'singular'`
(one line, `<EasingHeroStage v-if="viewMode === 'singular'" />`,
`EasingTarget.vue:94`) — fully decomposed into its own sub-component with its own
painter lifecycle — versus the `v-else` comparison-track branch
(`EasingTarget.vue:98-137`, 40 template lines) whose ENTIRE supporting engine stays
inline in the parent: `trackContainerEl`/`trackEls`/`trackBallEls` refs, `ballSizes`
measurement (`readBallSizes`, `EasingTarget.vue:188-207`), `visibleCurves` derivation
(`EasingTarget.vue:237-258`), the `trackBallXAt`/`fnForCurve`/`paintTrackDots` painter
trio (`EasingTarget.vue:281-309`), and the `wirePainter`/`measureTrackWidth` lifecycle
(`EasingTarget.vue:317-362`) — roughly 130 lines of script plus 40 of template, all for
the SECOND view-mode that got no sub-component. The precedent for extracting it already
exists two lines above it in the same file (`EasingHeroStage.vue`) and one scene over
(`SequenceScrubber.vue`'s ceiling-split). **Root cause:** the hero-stage split happened
at a specific fix-round (`J.W7a fix-round proof:demo-no-oversize`, cited in
`EasingTarget.vue:89-93`) that had a narrow mandate (fix the hero's oversize bug); the
comparison-track branch was untouched because no bug touched it, so it never got the
same-shaped split even though it is the same KIND of unit (a view-mode + its painter).

### spring/ — the widest fan-out, but the orchestrator itself never got the cube-style sub-package treatment

```
spring/
├── SpringScene.vue (196L) · SpringSidebar.vue (313L) · SpringTarget.vue (460L)
├── SpringHeatmap.vue (324L) · SpringTrace.vue (129L) · StartingStyleTarget.vue (218L)
├── useSpringDemo.ts (462L)          # ← the orchestrator: 462L, ~10 concerns (below)
├── useSpringDerby.ts (115L)         # ✓ ALREADY split — a self-contained finite "egg" process
├── useSpringHotPath.ts (163L)       # ✓ ALREADY split — the painter registry + rAF loop
├── useSpringKeyframesEditor.ts (76L) · useSpringLinearStops.ts (34L)
├── useSpringPaneDrag.ts (168L) · useCompiledEntry.ts (60L) · springKeys.ts (10L) · springPresets.ts (42L)
```

**F2 — `useSpringDemo.ts` is the best-precedented case for further splitting, because
5 of its natural siblings were ALREADY carved out and it's still 462L.** Its own
section comments (`useSpringDemo.ts:50-367`) name at least 9 distinct concerns living
in the one function body: sub-view selection, interactive params, canonical preset
trackers, the hot-path/readout mirror wiring, the `springTimingFunction` sampler, the
keyframes-editor animation build, playback-intent derivation, the shared rAF loop, the
scrub seam, methods, the derby wiring, and the scene-contract group construction. Two
of those (derby, hot-path/painters) were already extracted at exactly this size class
(115L, 163L) — proving the split is both possible and already the demo's practice for
THIS scene. The remaining candidates that read as equally separable: **canonical preset
trackers** (`useSpringDemo.ts:87-107`, the `tracks`/`SpringTrack` array + settle
watchers) and **the keyframes-editor-animation build** (`useSpringDemo.ts:139-163`,
already named "the PROPER keyframes EDITOR animation" as a distinct unit in its own
comment) — both are self-contained enough to become `useSpringPresets.ts` and fold into
the existing `useSpringKeyframesEditor.ts` respectively, the same way derby/hot-path
already left.

### sequence/ — the thinnest sibling-composable fan-out relative to its own complexity (the strongest single finding)

```
sequence/
├── SequenceScene.vue (44L) · SequenceTarget.vue (264L) + SequenceTarget.css (259L, sibling split)
├── SequenceAxis.vue (49L) · SequencePlayhead.vue (79L) · SequenceScrubber.vue (156L)
├── useSequenceDemo.ts (467L)        # ← the ENTIRE engine: 467L, ~11 concerns, only 2 tiny siblings
├── useSequenceInstrument.ts (45L)   # state-only (isScrubbing/scrubDir/powerOn) — no engine logic
├── useTypedTrigger.ts (31L)         # a generic keydown-buffer matcher — genuinely reusable, scene-scoped anyway
```

**F3 — `useSequenceDemo.ts` (467L) is the single largest composable in `scenes/`, and
unlike `spring/`, sequence's own easter-egg process was NOT given the sibling-composable
treatment its sibling scene's equivalent got.** Section markers inside the file
(`useSequenceDemo.ts:91,111,140,150,158,205,250,306,314,350,393`) name: the stagger
distribution, the child-animation builder, the `Sequence` orchestrator construction,
playback-intent derivation, a "minimal contract `AnimationGroup`" for the transport bar,
the engine-loop drivers, transport wiring, the reactive storyboard-rows view, the
draggable-row re-seat (`reseatRow`, `useSequenceDemo.ts:324-348`), **"EE-SEQ-1 'the
reel'"** (`useSequenceDemo.ts:350-391`, 42 lines — a self-contained, timer-driven,
finite egg process: pause transport → fire each child on a stagger → restore each
child's timing function → re-settle on completion), and the raw-rAF `ScenePlayback`
adapter. The reel egg (42 lines, a bounded finite process with its own guard flag
`isReeling`) is structurally IDENTICAL in shape to `useSpringDemo.ts`'s derby, which
WAS extracted to `useSpringDerby.ts` (115 lines including comments) — proving this is
not a novel ask, it is applying spring's own already-adopted pattern to sequence's
un-split twin. **Recommendation shape:** carve `useSequenceReel.ts` (the 42-line egg,
mirroring `useSpringDerby.ts`) and `useSequenceRows.ts` (the storyboard-rows computed +
`reseatRow` re-author, `useSequenceDemo.ts:306-348`) out of the orchestrator, leaving
`useSequenceDemo.ts` holding only the stagger/child-build/Sequence-construction/
transport core — bringing it into the same multi-composable shape spring already has,
and matching `sequence/`'s OWN precedent (`useSequenceInstrument.ts`,
`SequenceScrubber.vue`) that a ceiling-split already happened twice in this exact scene
for smaller reasons.

### motion-path/ — one composable owns the entire interaction model (no sibling fan-out at all)

```
motion-path/
├── MotionPathScene.vue (43L) · MotionPathTarget.vue (494L, ~216L is <style>)
├── useMotionPathGesture.ts (409L)   # ← the ENTIRE gesture/projection/editable-path engine, ONE file
├── motionPathGeometry.ts (166L) · motionPathKeys.ts (8L)
```

**F4 — the smallest sibling-composable count in the roster (1) against the SECOND
LARGEST single composable (409L).** `useMotionPathGesture.ts`'s own section markers
(`useMotionPathGesture.ts:88,132,168,206,256,276,303,349`) name 8 distinct concerns:
the traveller-scale fix, tangent-at-distance sampling math, the guide self-build
(DrawSVG dogfood on mount), client-point→path-ratio projection, the single-source
path re-emit, the "emoji winks" full-lap egg, the traveller drag-scrub seam, and the
control-point (editable-path) drag. Compare to `cube/orbital-drag/composables/`, which
split an interaction model of comparable richness (pointer capture + pinch + inertia)
into 4 files averaging 157L each. `motion-path/`'s equivalent richness (projection math
+ two DISTINCT drag targets — the traveller vs. a control handle — + a self-build
animation + an egg) sits unsplit. **Recommendation shape:** the traveller drag (scrub
the distance) and the control-point drag (reshape the path) are two independently
testable gesture surfaces sharing only the projection math — split into
`useMotionPathProjection.ts` (the pure geometry: tangent-at-distance, client→ratio),
`useMotionPathTravellerDrag.ts` (the scrub seam + wink egg), and
`useMotionPathControlDrag.ts` (the handle drag + single-source re-emit + guide
self-build), the same three-way split shape `orbital-drag/` already proved out.

### amiga/ — proportionate, no action needed

```
amiga/
├── AmigaScene.vue (334L) · AmigaCrtOverlay.vue (125L) · AmigaTelemetry.vue (103L)
├── useAmigaThree.ts (267L) · useAmigaDemo.ts (172L) · useAmigaBoot.ts (65L) · useSphereSpin.ts (271L)
├── utils.ts (91L) · amigaKeys.ts (5L)
```
Four composables, each single-concern (the Three.js room, the boing/bounce
`AnimationGroup` build, the power-on boot egg, the drag-to-spin gesture), cross-import
named constants from their logical owner (`SPHERE_HOME`/`BOUNCE`/`BOX_SIZE` exported
from `useAmigaDemo.ts`, imported by `useAmigaThree.ts`/`useAmigaBoot.ts`/
`AmigaScene.vue` — verified NOT duplicated, just correctly shared by import). This is
proportionate decomposition already; amiga's VERDICT defects (#1 render, #9 "broken
mess … does not properly interleave and stack animations") are FUNCTIONAL, not
structural, and are owned by lane 03.

### morph/ — proportionate at its size, no action needed

```
morph/
├── MorphSVGScene.vue (44L) · MorphTarget.vue (335L, ~150L is <style>)
├── useMorphDemo.ts (160L) · morphShapes.ts (83L) · morphKeys.ts (9L)
```
One composable for one interaction surface (advance shape pair, read the
engine-written orient channel) is the right size for this scene's actual complexity —
no monolith to cure. (VERDICT #21 "does not work at all" is functional, lane-05/07
territory, not a composition defect.)

---

## Part 2 — The cross-cutting shared-vs-scene-private finding

### F5 — the imperative "painter registry" idiom is reinvented verbatim in TWO scenes; it belongs in `@/composables/` (or `app/runtime/`, pending lane-13's F5 move), not duplicated per scene

**Evidence — the shape is byte-for-byte identical in structure:**

`demo/scenes/easing/useEasingDemo.ts:179-196`:
```ts
type DotPainter = (phase: number) => void;
const dotPainters = new Set<DotPainter>();
const registerDotPainter = (paint: DotPainter): (() => void) => {
    dotPainters.add(paint);
    paint(livePhaseValue);
    return () => dotPainters.delete(paint);
};
const repaintDots = (): void => {
    for (const paint of dotPainters) paint(livePhaseValue);
};
```

`demo/scenes/spring/useSpringHotPath.ts:96-111`:
```ts
const springPainters = new Set<SpringPainter>();
const registerSpringPainter = (paint: SpringPainter): (() => void) => {
    springPainters.add(paint);
    paint();
    return () => springPainters.delete(paint);
};
const repaintSprings = (): void => {
    for (const paint of springPainters) paint();
};
```

Same primitive (a `Set` of void-callbacks), same three operations (register-and-
paint-once, unregister via closure, repaint-all), same call site shape (a
per-frame hot loop calls the repaint function; the view layer registers a closure
that writes `el.style.*` directly, off the Vue render graph). `useSpringHotPath.ts:52`
even names its lineage explicitly: *"the I.W4 D4 DotPainter idiom, transposed from
easing"* — this is a KNOWN, self-acknowledged copy-paste-and-rename, not an
accidental convergence. `SpringSidebar.vue:194-204` and `EasingTarget.vue:302-309`
each then hand-roll the SAME "walk a fixed-size array of nullable template
refs, `if (el) el.style.left = …`" consumer loop around their own registry.

**Root cause.** There is no shared "register a per-frame imperative painter" primitive
in `@/composables/` (which today holds only `gestureSelectSuppression.ts` and
`useDragScrub.ts`) or in `app/runtime/` (which holds `useRafScene.ts` and friends —
the closest existing relative, but it drives the LOOP, not the painter-registration
idiom sitting inside each scene's hot path). Each scene that needed "many DOM
elements positioned imperatively off a shared per-frame value" reinvented the
register/repaint pair locally because the demo has no home for a cross-scene
composable that isn't either a gesture primitive or a full rAF-loop driver.

**Recommendation.** Extract a generic `createPainterRegistry<Args extends
unknown[]>()` (or `usePainterRegistry`) into `@/composables/` (or, if lane 13's F5
`app/runtime → shared/composables` move lands first, alongside `useRafScene.ts` there)
returning `{ register(paint): unregister, repaintAll(...args) }`. `useEasingDemo.ts`'s
`DotPainter`/`dotPainters`/`registerDotPainter`/`repaintDots` and
`useSpringHotPath.ts`'s `SpringPainter`/`springPainters`/`registerSpringPainter`/
`repaintSprings` both become one-line calls into it — this is the shared-vs-private
boundary the audit prompt asks for made concrete: the register/repaint MECHANISM is
cross-scene (shared), the painter CLOSURES themselves (what to paint, which refs) stay
scene-private, exactly as `useDragScrub`/`useDoubleTap` already split "the gesture
mechanism is shared, the gesture meaning is scene-private" for pointer input.

### F6 — no scene-level loading-placeholder distinct from a bare spinner (a scene-scoped instance of lane 13's F7)

**Evidence.** `CubeTarget.vue:43-48` shows a generic `<Loader2 class="animate-spin">`
gating the cube faces while `loadAnimationEngine()` resolves
(`showLoader` prop, `CubeTarget.vue:164`) — a spinner INSIDE a scene's own stage, not
just the outer `App.vue` Suspense fallback lane 13's F7 already flagged. No scene has a
shaped skeleton (e.g., six gray face-outlines for the cube, a dimmed rail for
spring/easing) standing in during the engine-load window.

**Recommendation.** Once lane 13's `skeletons/` tier lands (recommendation 8 there),
give each stage-bearing scene a shaped skeleton matching its own stage geometry
(cube: 6 face outlines; easing/spring/motion-path/morph: a dimmed rail/stage
silhouette) instead of a borrowed spinner icon — this is genuinely `scenes/`-owned
work riding on top of the shared tier lane 13 proposes, not a duplicate ask.

---

## Part 3 — What NOT to do (guarding against contrivance)

Per lane 13's F9 and the owner's explicit "without contrivance" caution: `amiga/`,
`morph/`, `square/`, `compose/`, and `cube/` should NOT be touched by this lane's
recommendations — their composable-to-complexity ratio is already proportionate or
exemplary. The fixes below target ONLY the three scenes (`spring/`, `sequence/`,
`motion-path/`) whose orchestrator composables sit at 2–4× the size of their own
scene's sibling composables while housing 7–11 independently-nameable concerns each,
plus `easing/`'s one asymmetric view-mode, plus the one proven cross-scene DRY
violation (F5). This is a targeted, evidence-gated set, not a blanket "decompose
everything" mandate.

---

## T recommendations

1. **Extract `useSequenceReel.ts` + `useSequenceRows.ts` from `useSequenceDemo.ts`.**
   · Scope: move the reel egg (`useSequenceDemo.ts:350-391`, ~42L) and the
   storyboard-rows/`reseatRow` unit (`useSequenceDemo.ts:306-348`, ~43L) into two new
   sibling composables, mirroring `useSpringDerby.ts`'s already-precedented shape;
   `useSequenceDemo.ts` retains only stagger/child-build/`Sequence`-construction/
   transport. · Gate: `useSequenceDemo.ts` line count drops below ~380L; a new
   `proof:scene-orchestrator-ceiling` advisory (orchestrator composables >350L must
   cite ≥2 already-extracted siblings, mirroring cube/spring's actual practice). ·
   Size **M**.

2. **Split `useMotionPathGesture.ts` into projection + traveller-drag +
   control-point-drag composables.** · Scope: `useMotionPathProjection.ts` (pure
   tangent/ratio math, `useMotionPathGesture.ts:132-255`), `useMotionPathTravellerDrag.ts`
   (the scrub seam + wink egg, `:276-348`), `useMotionPathControlDrag.ts` (the handle
   drag + guide self-build + single-source re-emit, `:168-275,349-409`) — the same
   three-way split `cube/orbital-drag/composables/` already proves out for a
   comparably rich gesture surface. · Gate: same orchestrator-ceiling advisory as
   above; `MotionPathTarget.vue` imports stay a single destructure (no template churn).
   · Size **M**.

3. **Extract `useSpringPresets.ts` from `useSpringDemo.ts`; fold the keyframes-editor
   animation build into the existing `useSpringKeyframesEditor.ts`.** · Scope: move
   the canonical preset trackers (`useSpringDemo.ts:87-107`) and the "PROPER keyframes
   EDITOR animation" build (`:139-163`) out, completing the split pattern
   `useSpringDerby.ts`/`useSpringHotPath.ts` already started for this same file. ·
   Gate: `useSpringDemo.ts` drops below ~380L; no behavior change (pure move, verified
   by the existing spring scene tests). · Size **S**.

4. **Give `EasingTarget.vue`'s comparison-track view-mode the same split its sibling
   `singular` mode already got.** · Scope: extract `EasingComparisonTracks.vue` +
   `useEasingComparisonTracks.ts` covering `EasingTarget.vue:98-137` (template) and
   `:182-362` (measurement/painter/lifecycle script) — mirroring `EasingHeroStage.vue`'s
   existing shape (component owns its own painter registration lifecycle, injects the
   same `EASING_DEMO_KEY`). · Gate: `EasingTarget.vue` drops below ~280L (header +
   mode switch + the two child components only); `proof:scene-colocated` still green.
   · Size **M**.

5. **Introduce a shared `createPainterRegistry()` primitive; retire the two
   hand-duplicated copies.** · Scope: new `@/composables/usePainterRegistry.ts` (or
   land beside `useRafScene.ts` if lane 13's app/runtime→shared move (its
   recommendation 5) lands first) exporting `{ register, repaintAll }` generic over
   the painter's argument tuple; repoint `useEasingDemo.ts`'s `dotPainters` and
   `useSpringHotPath.ts`'s `springPainters` onto it (both call sites become ≤3 lines).
   · Gate: new `proof:no-duplicate-registry` — grep asserts no second hand-rolled
   `Set<...Painter>` + register/repaint trio exists outside the shared primitive; both
   scenes' existing behavior tests stay green (pure refactor, zero behavior delta). ·
   Size **S**.

6. **Per-scene shaped skeletons for the engine-load window (rides lane 13's
   `skeletons/` tier).** · Scope: once `shared/components/skeletons/` exists
   (lane 13 rec. 8), replace `CubeTarget.vue`'s bare `<Loader2>` spinner
   (`CubeTarget.vue:43-48`) and any equivalent in spring/easing/motion-path/morph with
   a stage-shaped skeleton. · Gate: `proof:has-skeletons` extended with a per-scene
   clause (no bare icon-spinner gating a stage's own content, only the shared
   Suspense-level fallback may use one generic shape). · Size **S** (per scene; **M**
   in aggregate across the ~4 affected scenes).
