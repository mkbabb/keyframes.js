# E.W1 — Frontend encapsulation round 2 (the app shell + the orbital seam)

The encapsulation wave, round 2. D.W1 decomposed the five oversized
`animation-controls/**` units at their natural seams and brought every one under
the ceiling (350L `.vue` / 250L `.ts`, gated by `proof:decomposition`). The
post-D 6-lane assay found the decomposition *complete inside the controls tree* —
but two units OUTSIDE that tree still cross the seam where one concern stopped
being one concern: the app entry `demo/app/App.vue` (452L) conflates routing
plumbing with a playback-snapshot machine and a scene-swap spring, and the
orbital-drag input composable `useOrbitalPointer.ts` (376L) conflates pure
pointer-input plumbing with transform-business-logic that belongs on the
component that already owns its sibling rotation logic. E.W1 extracts the two
App.vue concerns into colocated composables, thins `useOrbitalPointer` to pure
input→event translation by moving the linear-transform application to
`OrbitalDrag.vue` (where the rotation application already lives), and documents
why `EasingCurveCanvas.vue` (351L) — one cohesive curve renderer+editor, 1L over
the ceiling — is NOT split. Net-deletion of conflation, **zero behaviour
change**. Grounds: `audit/prompt-recap.md` E1 (encapsulation r2) + the live
`wc -l` measurements below.

This is NET-NEW refinement, not folded debt. The deferred ledger is CLEAN — D
terminated every keyframes-owned deferral (zero KFE, `audit/deferred-ledger.md`).
E.W1's targets are post-D findings the assay surfaced, not chronic carry-over.

## § The state, verified (not asserted)

The live facts, `wc`- and read-confirmed against demo source, so the wave's
framing is honest:

1. **`demo/app/App.vue` is 452L** (`wc -l demo/app/App.vue` = 452) and carries
   THREE separable concerns. (a) The scene **router/host** — the `TopDock`
   wiring, the `EditorShell` slots, the keyed `<Suspense>` scene host,
   `switchScene` + the `sceneRef.animationGroup` watcher (the bulk of the
   template + `:1-229`, `:348-451`). (b) The **playback-snapshot machine** —
   `saveCurrentPlaybackState()` (`:286-304`) snapshots each animation's
   `{t, reversed, iteration}` to `saveScenePlaybackState`, and
   `restoreGroupPlaybackState(group, savedState)` (`:311-346`) re-seats a fresh
   `AnimationGroup` from a saved snapshot (started/lastTickTime, per-anim
   managed/startTime/paused, `interpFrames` to repopulate values,
   `transformFramesGrouped`, conditional `group.resume()`). This is a
   self-contained group-state codec — pure engine choreography with no routing
   concern. (c) The **scene-swap spring** — `sceneOpacity` + `sceneSwapStyle`
   (`:238-243`) + the `sceneSwapSpring = new SpringProgress({ respectReducedMotion: true })`
   driven by `watch(activeSceneKey, …)` (`:244-249`), the engine-dogfooded
   cross-dissolve on the sibling wrapper `<div>`. The carefully-reasoned comment
   block (`:108-135`, `:231-237`) documents WHY the spring is a sibling style
   binding, not a `<Transition>` (the B.W3 async-loader re-break) — that
   rationale travels WITH the spring into its composable.

2. **`demo/app/` outside App.vue is already well-decomposed.** The routing is
   already factored into `useSceneRouter.ts` (69L), `useSceneUrl.ts` (68L),
   `router.ts` (47L), `scenes.ts` (71L) — each a small, single-concern unit.
   The two App.vue residuals (snapshot, scene-swap) are the LAST two extractable
   concerns; the router/host shell that remains IS App.vue's legitimate job.

3. **`useOrbitalPointer.ts` is 376L** (`wc -l` = 376) and mixes two concerns.
   The **input plumbing** (its legitimate job): `startDrag`/`stopDrag`/`drag`
   (`:168-240`), `handleWheel` (`:242-285`), `updatePressedKeys` (`:287-305`),
   the pointer-capture lifecycle `onPointerDown`/`onPointerUp`/`onPointerCancel`
   + `removeDocListeners` (`:307-356`), `syncModifiers` (`:78-86`) — reads
   PointerEvents, tracks pressed keys + active touch pointers, dispatches to
   callbacks. The **transform-business-logic** (the conflation):
   `updateLinearTransform` (`:88-117`, the clamp-to-bounds + emit), the
   `updateTranslation`/`updateScale` deltas (`:119-138`), and
   `handleAxisSpecificInput` (`:140-166`, the per-axis modifier dispatch that
   decides translate-vs-scale-vs-rotate). These four mutate `model.value` and
   emit — they are the same SHAPE as the rotation logic
   (`updateRotation`/`updateAxisRotation`/`applyRotation`) that ALREADY lives in
   `OrbitalDrag.vue` (`:122-168`). The composable receives `updateRotation`/
   `updateAxisRotation`/`applyRotation` as callbacks FROM the component but
   defines `updateLinearTransform`/`updateTranslation`/`updateScale` ITSELF —
   the split is inconsistent: half the transform application is in the component,
   half in the composable.

4. **`OrbitalDrag.vue` is 297L** (under the ceiling) and is the RIGHT home for
   the transform logic. It already owns `applyRotation`/`updateRotation`/
   `updateAxisRotation` (`:122-168`), the quaternion core, the `model` defineModel
   and `emit`, the bounds, and the `velocity` ref. It already passes the rotation
   appliers DOWN to `useOrbitalPointer` as callbacks (`:185-188`). Moving the
   linear-transform appliers UP to the component makes ALL transform application
   live in ONE place (the component that owns the model), and the composable
   becomes pure input→callback translation — symmetric with how rotation is
   already wired. (Note: `useOrbitalPinch.ts` and `useOrbitalInertia.ts` also
   consume `updateTranslation`/`updateScale`/`updateLinearTransform` via the
   `pointer.*` handles — `OrbitalDrag.vue:199,218` — so the appliers must remain
   reachable; the move re-exposes them from the component, not the composable.)

5. **`EasingCurveCanvas.vue` is 351L** (`wc -l` = 351) — 1L over the 350 ceiling,
   and ONE cohesive concern. It is a single SVG bezier/step curve renderer with
   an inline drag-edit interaction (the bezier path / step path / overshoot-aware
   `viewBox` computeds `:124-169`, the `pointerToSVG` CTM-inverse mapping
   `:174-186`, the `rubberBand` overshoot clamp `:188-201`, the handle-drag
   state machine `:204+` with EMA smoothing). The template's `@pointerdown`/
   `@pointermove`/`@pointerup` (`:12-15`) are Vue TEMPLATE bindings, not manual
   `addEventListener` (so it is NOT an E.W2 site). Splitting a single
   curve-editor into "renderer" + "drag composable" would fragment one concern
   to satisfy a 1L overage — the anti-pattern D.W1 §Design-Decision 1 forbids
   ("decompose at the natural seam, not to a number"). The honest disposition is
   to RAISE the ceiling rationale for this one cohesive SVG-editor unit (or hold
   it as a named, documented 1L exception), NOT to over-fragment it.

The wave's job is to finish the encapsulation D.W1 began — at the two seams
OUTSIDE the controls tree the post-D assay found — while being honest that
`EasingCurveCanvas` is cohesive and stays.

## § Goal

**What lands:**
- `demo/app/App.vue` (452L) drops under the ceiling by extracting two composables
  into `demo/app/` (colocated with the app entry + its sibling `useScene*`
  composables):
  - **`usePlaybackSnapshot.ts`** — the group-state codec. Exposes
    `saveCurrentPlaybackState()` + `restoreGroupPlaybackState(group, savedState)`
    (moved verbatim from App.vue `:286-346`), parameterized by the current
    super-key + group accessors. Pure engine choreography; no routing.
  - **`useSceneSwap.ts`** — the scene-swap spring. Owns `sceneOpacity`,
    `sceneSwapStyle`, the `SpringProgress({ respectReducedMotion: true })`, and
    the `watch(activeSceneKey, …)` re-seat (moved from App.vue `:238-249`).
    Returns `{ sceneSwapStyle }` for the template. The B.W3 async-loader
    rationale comment travels WITH it.
  App.vue retains its legitimate router/host shell + the `sceneRef` watcher
  (which calls `restoreGroupPlaybackState` via the composable).
- `useOrbitalPointer.ts` (376L) thinned to pure input→event translation:
  `updateLinearTransform`, `updateTranslation`, `updateScale`, and
  `handleAxisSpecificInput` move to `OrbitalDrag.vue` (joining the rotation
  appliers already there), and the composable receives them as callbacks (the
  symmetric wiring rotation already uses). The composable's remaining surface is
  pointer/key/wheel input → callback dispatch. Both files drop under their
  ceilings (376L `.ts` → ≤250L; OrbitalDrag stays ≤350L after absorbing the
  ~60L of appliers, because the appliers are SMALL and OrbitalDrag had headroom).
- `EasingCurveCanvas.vue` documented as the named cohesive exception (the 351L
  single-concern SVG curve-editor) — either via a raised, rationale-bearing
  ceiling for that one file in `proof:decomposition`, or a one-line trim that
  brings it to ≤350 WITHOUT splitting the concern (e.g. collapsing a trivially
  foldable line) — the implementation chooses the smaller honest move, recorded
  in §Design-Decision 4.
- `proof:decomposition` EXTENDED to sweep the new units (App.vue's tree +
  `orbital-drag/**`), so the ceilings BITE there too; a component-render smoke
  asserts the decomposed roots + their composables mount and the snapshot codec
  round-trips.

**Why:** encapsulation is the gap between "one file does one thing" and "one
file is a junk drawer." App.vue is the demo's entry point — it should read as a
router/host, but today a 60L group-state codec and a 12L spring machine sit
inline, making the routing logic harder to find and the codec/spring harder to
test in isolation. Extracting each to a colocated composable is the idiomatic
Vue 3 shape (composables own reactive sub-concerns), KISS (each file is one
concern), and net-deletion of conflation. `useOrbitalPointer`'s split is a
correctness-of-vocabulary fix: a composable named "Pointer" that defines half
the transform application lies about its contract; moving the appliers to the
component that owns the model makes ALL transform application live in ONE place
and the composable purely about input. The no-legacy mandate forbids leaving a
unit conflated at the wrong seam; KISS favors the colocated composable over the
god-file. Every change is behaviour-isomorphic — the same engine calls, the same
emits, the same pixels.

## § Scope

### S1 — App.vue → usePlaybackSnapshot (the group-state codec) — prompt-recap E1

**WHAT:** extract `saveCurrentPlaybackState()` (App.vue `:286-304`) and
`restoreGroupPlaybackState(group, savedState)` (App.vue `:311-346`) into a new
`demo/app/usePlaybackSnapshot.ts` composable, colocated with the app entry +
its sibling `useSceneRouter`/`useSceneUrl`. The composable takes the reactive
accessors it needs (`currentSuperKey`, `currentAnimationGroup`, and the
`saveScenePlaybackState`/`getScenePlaybackState`/`clearScenePlaybackState`
store fns it already imports) and returns
`{ saveCurrentPlaybackState, restoreGroupPlaybackState }`. App.vue imports the
two functions and calls them from `switchScene` (`:355`) and the `sceneRef`
watcher (`:438`) exactly as today — the bodies move verbatim (the `performance.now()`
re-seat math, the `interpFrames`/`transformFramesGrouped`/`resume` sequence is
unchanged). The store-type import (`ScenePlaybackState`) co-locates with the
codec.

**WHY:** these two functions ARE the per-scene playback persistence codec —
they snapshot and restore an `AnimationGroup`'s playing state across scene
switches, pure engine choreography (no routing, no DOM, no template). They are
the textbook composable extraction: a cohesive reactive sub-concern App.vue
calls but does not need inline. Extracting them shrinks App.vue toward its
router/host job and makes the codec independently testable (the render-smoke
S5 round-trips it). Verified §State 1(b): the two functions are self-contained
(`:286-346`), reading only the super-key + group + the scenePlayback store.

### S2 — App.vue → useSceneSwap (the scene-swap spring) — prompt-recap E1

**WHAT:** extract the scene-swap spring into `demo/app/useSceneSwap.ts`: the
`sceneOpacity` ref, the `sceneSwapStyle` computed (`:239-243`, the
opacity + `scale(0.97 + 0.03·v)`), the
`sceneSwapSpring = new SpringProgress({ respectReducedMotion: true })`
(`:244`), and the `watch(activeSceneKey, …)` that reset(0)/play/target=1
re-seats the spring on scene change (`:245-249`). The composable takes the
`activeSceneKey` computed (the trigger) and returns `{ sceneSwapStyle }`. App.vue
binds `:style="sceneSwapStyle"` on the wrapper `<div>` (`:136`) from the
composable's return. The two large rationale comment blocks (`:108-135` the
no-KeepAlive/no-Transition reasoning, `:231-237` the spring-preset reasoning)
travel with the spring: the async-loader half stays at the `<Suspense>` host
(App.vue), the spring half moves to the composable's docstring.

**WHY:** the scene-swap spring is a self-contained engine-dogfooded
sub-concern — a `SpringProgress` driving a reactive style on scene change,
the inv-ζ "demo eats its own engine" posture (`modern-web-findings.md` D-5
confirms this is *why* View-Transitions is N-A here). It has no routing
dependency beyond the `activeSceneKey` trigger, so it lifts cleanly into a
composable. Extracting it removes ~12L of spring machinery + its rationale from
App.vue's body, and gives the cross-dissolve a named home a future scene-swap
tweak edits in one place. Verified §State 1(c): the spring block reads only
`activeSceneKey` and writes only `sceneOpacity`.

### S3 — useOrbitalPointer thinned: transform application → OrbitalDrag.vue — prompt-recap E1

**WHAT:** move the four transform-application functions from
`useOrbitalPointer.ts` to `OrbitalDrag.vue`, joining the rotation appliers
already there:
- `updateLinearTransform` (composable `:88-117`) — the clamp-to-bounds +
  category emit.
- `updateTranslation` / `updateScale` (composable `:119-138`) — the delta
  appliers.
- `handleAxisSpecificInput` (composable `:140-166`) — the per-axis
  modifier dispatch (translate/scale/rotate by pressed key).

These mutate `model.value` + `velocity.value` and emit `translate`/`scale` —
all of which `OrbitalDrag.vue` already owns (the `model` defineModel `:33`, the
`emit` `:27`, the `bounds` `:48`, the `velocity` ref `:50`). In OrbitalDrag,
they sit beside `applyRotation`/`updateRotation`/`updateAxisRotation`
(`:122-168`) — ALL transform application in ONE place. The composable then
RECEIVES `updateTranslation`/`updateScale`/`handleAxisSpecificInput` (and the
already-passed rotation appliers) as callbacks in its `OrbitalPointerParams`,
the exact wiring rotation already uses (`:19-26`). The composable's `drag`/
`handleWheel` call the callbacks instead of local definitions. CRITICAL: the
appliers must stay reachable for `useOrbitalPinch` + `useOrbitalInertia`, which
consume them via `pointer.updateTranslation`/`pointer.updateScale`/
`pointer.updateLinearTransform` (`OrbitalDrag.vue:199,218`) — after the move,
OrbitalDrag passes the component-owned appliers DIRECTLY into pinch/inertia
(not via the `pointer` handle), so the consumption is rewired to the new home,
not broken.

**WHY:** the composable's name promises pointer-input plumbing; defining the
transform appliers there (verified §State 3) makes it a half-input,
half-business-logic file at 376L. The rotation appliers ALREADY live in the
component (verified §State 4) and are passed DOWN as callbacks — the linear
appliers should be symmetric. Moving them UP makes the boundary honest (the
composable reads input → dispatches to callbacks; the component owns ALL
transform application against the model it owns), drops the composable under the
250L ceiling, and keeps OrbitalDrag under 350L (the appliers are ~60L; OrbitalDrag
at 297L has the headroom). KISS: one home for transform application, one home for
input. No behaviour change — the same clamp, the same emit, the same model
mutation, just relocated to the component that owns the model.

### S4 — EasingCurveCanvas: the named cohesive exception — prompt-recap E1

**WHAT:** EasingCurveCanvas.vue (351L, 1L over) is NOT split. Record it as the
named cohesive exception: it is ONE concern (an SVG bezier/step curve renderer
with inline drag-edit). Choose the smaller honest move:
- EITHER a 1-line trim that brings it to ≤350 without touching the concern
  boundary (collapsing a foldable line — e.g. a multi-line type annotation or a
  blank-line removal), so the ceiling holds with no exception needed,
- OR, if no clean trim exists, a documented per-file ceiling exception in
  `proof:decomposition` (a small `CEILING_OVERRIDE` map entry keyed to this one
  file with the cohesion rationale inline), so the gate stays honest about WHY
  this one file is allowed 351L.
The implementation picks the smaller move (a trim is preferred — it needs no
exception machinery); §Design-Decision 4 records the choice.

**WHY:** D.W1 §Design-Decision 1 is law: "decompose at the natural seam, not to
a number." EasingCurveCanvas is one cohesive curve-editor (verified §State 5) —
splitting it into "renderer" + "drag composable" to shed 1L would fragment one
concern, the exact anti-pattern the ceiling exists to PREVENT being weaponized
into. The honest disposition is to keep the unit whole and either trim 1L
mechanically or name the exception — never to over-fragment. This is the wave
being honest (inv ε): the ceiling is a forcing function for real seams, not a
guillotine for cohesive units 1L over.

### S5 — The `proof:decomposition` extension + render smoke — prompt-recap E1 (the falsifiable close)

**WHAT:** EXTEND the existing `scripts/proof-decomposition.mjs` (today it sweeps
only `demo/@/components/custom/animation-controls/**`) to ALSO sweep the E.W1
surfaces, so the ceilings BITE there:
- Add `demo/app/**` and `demo/@/components/custom/orbital-drag/**` to the
  `collectSources` roots (or a parallel sweep), applying the SAME ceilings
  (350L `.vue` / 250L `.ts`). BITES: App.vue at 452L, useOrbitalPointer at 376L
  red it today; after S1–S3 both drop under.
- Add the EasingCurveCanvas disposition (S4): either the file is ≤350 (trimmed)
  or it appears in a documented `CEILING_OVERRIDE` map with its rationale — the
  gate asserts the override map carries ONLY the named cohesive exception (a
  stale-override guard, mirroring the existing `ASYNC_ALLOWLIST` stale-entry
  guard at `proof-decomposition.mjs:334-342`).
- A new clause OR a sibling render-smoke (`test/` vitest, jsdom): mount the
  decomposed App.vue surface + its two new composables + the thinned
  OrbitalDrag, assert no throw, AND assert `usePlaybackSnapshot` round-trips —
  `saveCurrentPlaybackState` → `restoreGroupPlaybackState` on a fixture
  `AnimationGroup` leaves it at the saved `t`/`reversed`/`iteration`.

Plus: the existing demo gates (`demo-smoke`, `occlusion`, `proof:dogfood`) stay
green (the moves are structural), and the capture harness AFTER is
pixel-identical to BEFORE (`audit/DELTA.md` records no intended pixel change for
E.W1 — decomposition is behaviour-isomorphic).

**WHY:** the close is only honest if a gate BITES on the regression (inv ε,
`audit/deferred-ledger.md` CL-6). D.W1's `proof:decomposition` already gates
the controls tree; EXTENDING its sweep to App.vue + orbital-drag is the
falsifiable form of "the decomposition is now complete OUTSIDE the controls tree
too." The render-smoke + the snapshot round-trip prove the extraction is
behaviour-preserving (the composables mount, the codec works) — the falsifiable
form of "zero behaviour change." Re-adding a 400L App.vue, or a transform
applier back into useOrbitalPointer, reds the extended gate.

## § Hard gate — `proof:decomposition` (extended)

The wave closes when every clause VERIFIES (each BITES — a real `wc`/grep/render,
not an assertion):

1. **Ceilings hold across the EXTENDED sweep.** `npm run proof:decomposition`
   now sweeps `demo/app/**` + `orbital-drag/**` in addition to
   `animation-controls/**`; every `.vue` ≤ 350L and every `.ts` ≤ 250L (the
   sole documented exception: EasingCurveCanvas, either trimmed to ≤350 or in
   the rationale-bearing `CEILING_OVERRIDE` map). BITES: App.vue (452L) +
   useOrbitalPointer (376L) red it today; after S1–S3 both pass.
2. **App.vue's two concerns are extracted.** `demo/app/usePlaybackSnapshot.ts`
   and `demo/app/useSceneSwap.ts` exist; App.vue carries no inline
   `restoreGroupPlaybackState` body and no inline `new SpringProgress(` for the
   scene swap (both live in the composables). `grep` confirms the codec +
   spring are gone from App.vue's `<script setup>`.
3. **useOrbitalPointer is pure input plumbing.** `useOrbitalPointer.ts` defines
   no `updateLinearTransform`/`updateTranslation`/`updateScale`/
   `handleAxisSpecificInput` BODY (it receives them as callbacks);
   `OrbitalDrag.vue` defines all four (beside the rotation appliers).
   `grep` over the composable finds the four names only in the
   `OrbitalPointerParams` interface + call sites, not as local `const … =`
   definitions.
4. **Render smoke + snapshot round-trip pass.** The vitest render-smoke mounts
   the decomposed roots + composables (no throw), and the snapshot codec
   round-trips a fixture group (saved `t`/`reversed`/`iteration` restored).
5. **Zero behaviour change.** `demo-smoke`, `occlusion`, `proof:dogfood` stay
   green; the capture AFTER is pixel-identical to BEFORE (`audit/DELTA.md`
   records no intended pixel delta for E.W1). The orbital-drag gestures
   (rotate/translate/scale/wheel/pinch/inertia) behave identically (the appliers
   moved, the math did not).
6. **Net-deletion of conflation, no new legacy.** The E.W1 diff removes more
   inline body from App.vue + useOrbitalPointer than the composable/OrbitalDrag
   scaffolding adds; `git diff --stat` shows the decomposed files shrink. No
   alias re-export of the moved functions, no compat shim, no behaviour drift.

Every clause is a `wc`/grep/render instrument that reds on its negative case.

## § Folds

Retires (by finding id):
- **prompt-recap E1** (encapsulation r2: App.vue 452L conflating router +
  snapshot + scene-swap; useOrbitalPointer 376L conflating input + transform) —
  S1 (snapshot) + S2 (scene-swap) + S3 (orbital thin).
- The EasingCurveCanvas 351L cohesion question — S4 (the named exception /
  honest trim), closed by the `proof:decomposition` override-map clause (S5).

This wave folds NO chronic deferral — there is none (zero KFE,
`audit/deferred-ledger.md`). E.W1 is net-new post-D refinement.

**NOT retired here (named, routed):**
- The manual `addEventListener`/`new ResizeObserver` sites the thinned
  `useOrbitalPointer` still carries (the dynamic `doc.addEventListener` during
  drag, the `wheelTimeout` `setTimeout`) → **E.W2** (the vueuse listener/observer
  gestalt). E.W1 is structural decomposition only; it does not re-home the
  listeners (and OrbitalDrag.vue's container/window listeners are ALREADY on
  `useEventListener`, `:237-260` — so the orbital seam's E.W2 work is confined
  to the composable's dynamic doc listeners).
- Any arbitrary-value tailwind / `.gold-shimmer` the touched files carry →
  **E.W3** (styling r2).

## § Design decisions

1. **Extract reactive sub-concerns to colocated composables — the idiomatic
   shape.** RESOLVED: `usePlaybackSnapshot` + `useSceneSwap` land in `demo/app/`
   beside the existing `useSceneRouter`/`useSceneUrl` — the established colocation
   for app-entry composables. Each is ONE concern (the codec; the spring). App.vue
   retains its router/host shell, which IS its legitimate job — the goal is a
   legible entry file, not zero logic. KISS: the smallest composable boundary
   that makes App.vue read as a router. No premature abstraction (no generic
   "scene lifecycle" mega-composable — two distinct concerns, two composables).

2. **The transform appliers belong with the model, not the input reader.**
   RESOLVED: `OrbitalDrag.vue` owns the `model` defineModel, the `emit`, the
   bounds, and the rotation appliers — so it is the correct home for the linear
   appliers too. The composable becomes pure input→callback dispatch, symmetric
   with how rotation is ALREADY wired (the appliers passed down as callbacks).
   Trade-off: OrbitalDrag grows ~60L (297→~355 before re-balancing) — but the
   appliers are small and the component has the ceiling headroom once the move
   lands; if it would breach 350, the implementation folds a foldable block (the
   appliers are mechanical clamp/emit, not new concerns). The pinch/inertia
   consumers rewire to the component-owned appliers (passed directly), not the
   `pointer` handle — a one-line wiring change at `OrbitalDrag.vue:199,218`.

3. **No alias, no shim — the moved functions have ONE home.** RESOLVED: the
   snapshot codec, the scene-swap spring, and the transform appliers each move
   to ONE new home; no re-export of the old App.vue / composable names. The no-legacy
   mandate forbids a compat alias for a function that simply moved. Call sites
   import the canonical name from the new home.

4. **EasingCurveCanvas stays whole — trim 1L OR name the exception, never
   split.** RESOLVED + HONEST (inv ε): the unit is one cohesive curve-editor
   (verified §State 5); splitting it to shed 1L is the over-fragmentation D.W1
   §DD1 forbids. The implementation prefers a mechanical 1-line trim (no
   exception machinery); failing a clean trim, a documented `CEILING_OVERRIDE`
   entry in `proof:decomposition` keyed to this one file with its cohesion
   rationale (and a stale-override guard so the map can't accrue silent
   exceptions). Either way the FINAL claims "EasingCurveCanvas is the named
   cohesive exception," not "every demo file is under 350" — honest about the one
   unit that earns its 1L.

5. **Structural only — listeners + styling route to E.W2/E.W3.** RESOLVED: E.W1
   moves code, it does not re-home listeners or tokenize styles. The thinned
   `useOrbitalPointer`'s dynamic doc listeners + `wheelTimeout` go to E.W2; any
   arbitrary-value tailwind in the touched files goes to E.W3. E.W1's
   pixel-isomorphism is the `proof:decomposition` zero-behaviour-change clause —
   file-disjoint from E.W3, sequenced with E.W2 where the same file
   (`useOrbitalPointer`) is touched (E.W1 thins it structurally; E.W2 re-homes
   its listeners — the order is E.W1 then E.W2 on that one shared file, recorded
   so the two waves do not fork the composable).
