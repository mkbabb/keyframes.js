# J.W2 — THE DEMO SEAM COMPLETION (the latent classes I.W2/I.W4 left at zero · one drag seam · one control-surface WRITER · the spring-settle signal · the D-overclaim terminated)

- **Phase:** DEV — spec authored, awaits IMPL+auth · **Class:** SHIP-in-J (the completion wave —
  every seam I.W2/I.W4 OPENED at the right altitude but did not drive to its perimeter). I.W4
  installed the gestalt drag seam (one composable owns "a gesture is in flight") and delivered it
  for the 4 gate-covered scene surfaces + 3 `useDragCapture` surfaces — but **TWO pointer-capture
  surfaces still bypass it** (`EasingCurveCanvas.vue` inline handlers + `PlaybackRibbon.vue` raw
  `window.pointerup`, NO `acquireSelectSuppression` — `audit/wave-I.W4.md §3` coverage-gap, §5
  fold table). I.W2 single-SOURCED the SELECTED control surface from the DFA but left the
  `selectedControl` field a **half-migration** (`CubeScene.vue:80` writes it raw, bypassing the
  authority — `audit/demo-shared-layer.md §K`/DS-1) and the **S4-stretch flat-mount never landed**
  with no terminal home (`audit/wave-I.W2.md §7`). I.W2's M2 mobile re-open scroll claim was an
  **overclaim** — the spring-driven sheet never fires the CSS `max-height` `transitionend`
  `isPanelTransitionDone` waits on (`audit/wave-I.W2.md §4`). The D FINAL OVERCLAIMED the
  `AnimationMenuBar→TransportDock` rename as closed against a gate that never ran — an inv-ε
  violation against D's own close (`audit/recap-CD.md` CD-1). The spring scene writes 17 reactive
  refs/frame, never given the I.W4 D4 non-reactive treatment (`audit/demo-scenes.md` DS-3). ·
  **Scope (demo + shared layer; NO engine/CI/gate-source authoring):** the two recovered drag
  surfaces (`EasingCurveCanvas.vue`, `PlaybackRibbon.vue`) onto `useDragCapture`/`useDragScrub`;
  `CubeScene.vue:73-83` rogue write deleted + S4-stretch flat-mount; `useSheetSpring.ts` gains a
  `settled` signal consumed by `useControlsLayout.ts`; `AnimationMenuBar.vue` → `TransportDock.vue`
  (the 11-site reference sweep); `useSpringDemo.ts:175-193` onto the DotPainter non-reactive idiom;
  `useRafLoop.ts:56` `onUnmounted` → `onScopeDispose`; the LS-20 `as any` casts. · **DAG-deps:**
  J.W1 ∥ **J.W2** ∥ J.W6 run PARALLEL (file-disjoint: engine / demo-behavior / measurements,
  `J.md §WAVE MAP`). **J.W2 gates the W2→W7a critical path** — J.W7a (the appearance-grammar
  suffusion) follows J.W2 ("shared demo files — behavior first, then appearance", `J.md §WAVE MAP`).
  J.W2's §Hard gate is WITNESSED on the **J.W3-industrialized harness** (the `proof:drag-gesture`
  extension + the new mobile-sheet leg run through `withPage`/`navToScene` once J.W3 lands; J.W0's
  `navToScene` primitive is the nav authority the single-writer live sweep consumes).

## §The boundary with J.W0 (BINDING — two DIFFERENT control-surface seams, do not conflate)

The `selectedControl` story spans TWO disjoint seams, partitioned across J.W0 and J.W2; the
wave spec MUST keep them apart or the single-authority claim re-blurs:

| Seam | What it is | file:line locus | Owning wave |
|---|---|---|---|
| **the dock TRIGGER PROJECTION** (`allControlTabs`) | the dock control-tab label that must never render the SOURCE scene's stale text mid-transition (the deploy-gate reads it) | `ChromeDock.vue:74-80` `allControlTabs` ← `App.vue:11` `sceneRef.extraControlTabs` | **J.W0 S3** (`J.W0.md §S3`, the deploy P0; lands FIRST) |
| **the SELECTED-surface single WRITER** | the `storedControls.selectedControl` field — which authority WRITES it, so the rendered surface == the DFA projection on every entry | `CubeScene.vue:80` (rogue write) · `controlOptionsStore.ts:6` (the field) · `AnimationControls.vue:237-249` (the derivation-sync watch) | **J.W2 S2** (this wave) |

J.W0 makes the dock trigger PROJECTION born-correct (the `extraControlTabs` derive from the
machine, not a tick late through the `sceneRef` re-bind). J.W2 makes the SELECTED-surface field
single-WRITER (the DFA projection is the ONLY writer; the `CubeScene` rogue write dies).
**Disjoint loci:** J.W0 at the dock `allControlTabs` projection seam; J.W2 at the `<Tabs>
:model-value` SELECTED-surface + the store-field-writer seam (`J.W0.md §S3` boundary box,
verbatim). J.W0's product half lands FIRST (deploy P0); J.W2 verifies it does not regress and
completes the broader single-writer pass it does not subsume. If the IMPL finds an edit touches
both, it is split by the locus table above — never merged into one "control-surface fix."

## §Provenance (the folded findings + the audit anchors)

- **`audit/wave-I.W4.md §3 (coverage gap) + §5 (fold table)`** — the B6-a latent class is NOT
  zero. The shared seam owns gesture-in-flight for the 4 gate-covered scene surfaces (square,
  spring, sequence, motion-path) + 3 `useDragCapture` surfaces (AnimationVisualizer,
  AssetViewport, AssetLayerPanel), but THREE surfaces bypass it. Two are kf-deterministic and
  this wave's S1 (the third, `OrbitalDrag.vue`, is the measure-first BOOK below):
  - **W4-3 `EasingCurveCanvas.vue`** — inline `@pointerdown="startDragging"` /
    `@pointermove="onDrag"` / `@pointerup="stopDragging"` (`:12-15`, CONFIRMED), a
    `setPointerCapture` on the SVG (`:231`, CONFIRMED), and ONLY a surface-local
    `user-select: none` (`:370`, CONFIRMED) — NO `acquireSelectSuppression`, so a drag that
    sweeps OFF the bezier handle onto the dock/control chrome highlights it (the exact B6-a
    mechanism, latent here). `audit/wave-I.W4.md §3` (BOOK J), `§5` (FOLD J).
  - **W4-4 `PlaybackRibbon.vue`** — `@pointerdown.capture="gatedSliderDown"` (`:6`) +
    `@pointerdown="onSliderDown"` (`:18`) feeding a raw `useEventListener(window, "pointerup",
    onSliderUp)` (`:131`, CONFIRMED) with NO select-suppression token — the same latent B6-a.
    `audit/wave-I.W4.md §3`, `§5`.
- **`audit/demo-shared-layer.md §K + DS-1 (P1)`** — `CubeScene.vue:73-83` a `watch(() =>
  storedControls.selectedAnimation, …)` that does `storedControls.selectedControl = "controls"`
  when the selected animation moves away from `"matrix-controls"` (CONFIRMED: `:73-80`,
  `selectedControl === "matrix-controls" … selectedControl = "controls"`). This is the EXACT
  anti-pattern the I.W2 S1 cure deleted from EasingScene/SpringScene — the one remaining rogue
  scene-side write to the control surface, bypassing the `selectedControlSurfaceFor` DFA
  projection. Functionally correct today (the cube DFA permits `"controls"`), structurally
  fragile (DS-1 P1).
- **`audit/wave-I.W2.md §7 (S4-stretch) + §6 (the half-migration tension)`** — the spec
  explicitly deferred "RECORD for IMPL, ship if room": mount EasingEditor flat for single-surface
  scenes (easing/spring), bypassing the Tabs/v-show double-gate. It landed in NO impl note and
  has NO J doc → no terminal disposition (P-invariant-28). §6 names the surviving architectural
  tension: `storedControls.selectedControl` serves TWO roles — (1) the user's preference (read
  by ribbon/dock/timeline) and (2) the Tabs model-value (now the computed projection); the watch
  sync keeps them coherent but they are no longer ONE authority. **This is a half-migration J
  should complete; S4-stretch eliminates the tension for the single-surface case.**
- **`audit/wave-I.W2.md §4 (M2 overclaim, P1)` + `audit/demo-shared-layer.md`** — M2: the sheet
  body clips controls with no scroll because `useControlsLayout.ts:30-35` gates
  `isPanelTransitionDone` (and thus `overflow-y-auto`) on a CSS `max-height` `transitionend`
  (`onPanelTransitionEnd` checks `e.propertyName === "max-height"`, CONFIRMED `:30-35`). On
  MOBILE the sheet height is spring-driven (`ControlsPaneWrapper.vue:254`), NO CSS height
  transition → the `transitionend` NEVER fires → `.controls-pane` stays `overflow-hidden`
  indefinitely after a close + re-open. The initial open works only because
  `isPanelTransitionDone = ref(storedControls.isControlsPanelOpen)` starts `true`. The fix the
  spec named — "drive `isPanelTransitionDone` off the spring settle" — was NEVER implemented:
  `useSheetSpring.ts` returns only `{ sheetT }` (CONFIRMED `:68` `return { sheetT }`), NO settled
  callback. No gate tests mobile (`proof:easing-editor-live` runs `1440×900` only). The
  `PROGRESS.md` claim "the mobile sheet body can SCROLL to its content (M2)" is OVERCLAIMED.
- **`audit/recap-CD.md` CD-1 (P1) + `audit/deferred-ledger.md`** — the D FINAL ledger records
  the `AnimationMenuBar→TransportDock` rename "closed via G.W12" with the gate
  `grep TopDock|AnimationMenuBar = 0`; the tree REFUTES it — `AnimationMenuBar.vue` exists
  unchanged (`git log --diff-filter=R` confirms it was NEVER renamed; only `TopDock→ChromeDock`
  landed in G). The D.W5 spec named `AnimationMenuBar → TransportDock` in the hard-gate scope;
  the gate was specified but never executed. **The exact class inv-ε was invented to prevent —
  a FINAL asserting a gate that did not pass.** The component ROLE is correct (the transport
  dock); only the NAME was not updated. Disposition: FOLD into J — execute the rename + the
  reference sweep, terminating the overclaim (`audit/recap-CD.md` Fold Candidates).
- **`audit/demo-scenes.md` DS-3 (P2)** — the spring scene writes **17 reactive refs/frame**
  (`useSpringDemo.ts:175-193`, CONFIRMED): `liveValue`/`liveVelocity`/`liveSettled` (3) + 4
  preset tracks × `value`/`velocity`/`settled` (12) + `progress`/`sampled` (2) = 17. These feed
  the SpringTarget ball position, the 4 SpringSidebar track balls, and the readout text. NOT as
  severe as the pre-D4 easing storm (243-node SVG re-render), but unaddressed reactive-per-frame
  writes with no measured ceiling; `proof:perf-frame-budget` does not measure spring (DS-7).
- **`audit/demo-shared-layer.md` DS-3/§L (P2)** — `useRafLoop.ts:56` uses `onUnmounted(stop)`
  (CONFIRMED) — the lone outlier; every other animation-controls composable converged on
  `onScopeDispose` (e.g. `useSheetSpring.ts:1` imports `onScopeDispose`). `onUnmounted` will not
  fire from a non-component (`effectScope`) context — structurally incorrect, low live risk
  (`useAnimationProgress` is its only caller today).
- **`audit/legacy-sweep.md` LS-20 (P2; PROGRESS homes it in THIS wave)** — `as any` casts with
  typed alternatives available, VERIFIED at HEAD: `useEasingDemo.ts:89`
  (`steppedEase(…, stepOptions.value.jumpTerm as any)`), `useEasingDemo.ts:389`
  (`new AnimationGroup(contractAnim as any)`), `AnimationControlsGroup.vue:198`
  (`storedControls.selectedAnimation = null as any`), `:217`
  (`useAnimationGroupPlayback(…, emit as any)`), `:272` (`null as any` again). PROGRESS §2 +
  `legacy-sweep.md` "Fold Candidates for J" both home LS-20 in **J.W2** (type hygiene) — verified
  and matched here. *(Note: `SquareScene.vue:34` `AnimationGroup(anim as any)` is in the
  legacy-sweep `as any` census but is NOT a LS-20 row — it rides the I.W4 square locus and is not
  homed here; this wave touches the 5 LS-20 sites only.)*

## §The state, verified (file:line / live anchors / command + output)

| Fact | Command / anchor | Observed |
|---|---|---|
| EasingCurveCanvas inline drag, no token | `grep -n "pointerdown\|setPointerCapture\|user-select" EasingCurveCanvas.vue` | `:12-14` inline handlers · `:231` `setPointerCapture` · `:370` LOCAL `user-select:none` — NO `acquireSelectSuppression` |
| PlaybackRibbon raw window pointerup | `PlaybackRibbon.vue:6,18,131` | `@pointerdown.capture` + `@pointerdown` + `useEventListener(window,"pointerup",…)`; NO token |
| CubeScene rogue write | `CubeScene.vue:73-80` | `watch(()=>storedControls.selectedAnimation … selectedControl="controls")` |
| `selectedControl` field type | `controlOptionsStore.ts:6` | `string` (not `ControlSurface` — DS-2) |
| the derivation-sync watch | `AnimationControls.vue:237-249` | `{immediate:true}`, "derivation-sync, NOT a latch re-assert" |
| M2 `transitionend` gate | `useControlsLayout.ts:30-35` | `onPanelTransitionEnd` ⇒ `e.propertyName === "max-height"` only |
| `useSheetSpring` exposes no settle | `useSheetSpring.ts:68` | `return { sheetT }` — NO `settled` |
| `useSheetSpring` already on `onScopeDispose` | `useSheetSpring.ts:1,66` | imports + uses `onScopeDispose(() => spring.dispose())` |
| AnimationMenuBar.vue present | `ls …/AnimationMenuBar.vue` | EXISTS (12,649 bytes) |
| AnimationMenuBar refs (excl. docs/tranches, dist) | `grep -rn AnimationMenuBar demo/` | **11 sites** (the rename sweep targets, §S4) |
| spring 17 reactive refs/frame | `useSpringDemo.ts:175-193` | 3 live + 12 track + 2 sampler = 17 `.value =` writes/frame |
| `useRafLoop` cleanup hook | `useRafLoop.ts:1,56` | `import { … onUnmounted … }` · `onUnmounted(stop)` |
| LS-20 `as any` sites | `grep -n "as any" useEasingDemo.ts AnimationControlsGroup.vue` | `useEasingDemo.ts:89,389` · `AnimationControlsGroup.vue:198,217,272` |
| the I.W4 idioms ALREADY in tree (the target shapes) | `useSquareAnimations.ts:95,150,162` (RAFPlayback+`startLoop`+`reseat`) · `useEasingDemo.ts:171-178,442` (`DotPainter`/`registerDotPainter`) · `useDragScrub.ts:4-5,52,96` (`acquireSelectSuppression`/`ReleasePolicy`) · `useDragCapture.ts:4-5,56` (token on pointer-down) | the seams to EXTEND, not invent |

**The eleven `AnimationMenuBar` reference sites (the §S4 sweep — verified):**
`AnimationControlsGroup.vue:88` (template), `:149` (import), `:251` (`useTemplateRef` instance
type), `:360` (comment) · `App.vue:187` (comment) · `design-idioms.css:99,342` (comment +
scoped-block migration note) · `useEasingDemo.ts:370` (comment) · `useSequenceDemo.ts:148`
(comment) · `demo/CLAUDE.md:53` (the doc entry — handed to J.W5's demo/CLAUDE.md rewrite, NOT
patched here) + the file itself (`AnimationMenuBar.vue` → `TransportDock.vue`).

## §Goal

Every seam I.W2/I.W4 opened reaches its perimeter — no latent class, no half-migration, no
overclaim survives. Concretely: the B6-a drag-select class is at TRUE zero (BOTH recovered
surfaces route through the gesture-in-flight seam so global select-suppression is inherited, not
sprinkled per-surface); the `selectedControl` authority is SINGLE-WRITER (the DFA projection is
the ONLY writer, the `CubeScene` rogue write dies, single-surface scenes mount flat so the
Tabs/v-show double-gate that bred the half-migration is gone); the mobile sheet re-open SCROLLS
to its content because `isPanelTransitionDone` is driven off the spring's own settle signal, not
a CSS `transitionend` that the spring-driven sheet never fires; the D-overclaimed
`AnimationMenuBar→TransportDock` rename is EXECUTED (terminating the inv-ε violation against D's
close); the spring scene's hot positional writes leave the Vue render graph via the I.W4 D4
DotPainter idiom; the lone `onUnmounted` outlier converges on `onScopeDispose`; the typed-cast
debt is paid. The cures are STRUCTURAL — extend the seams the I waves already built, never a
per-surface workaround.

## §Scope

- **S1 — the two recovered drag surfaces onto the shared seam (the B6 latent class to ZERO;
  closes W4-3/W4-4 — the gestalt single-seam, finished).** Locus: `EasingCurveCanvas.vue` +
  `PlaybackRibbon.vue`. The seam ALREADY owns gesture-in-flight: `useDragScrub`/`useDragCapture`
  both call `acquireSelectSuppression()` on pointer-down and `releaseSelectSuppression()` on
  release (`useDragScrub.ts:96-109`, `useDragCapture.ts:56,47`, CONFIRMED) — setting the global
  `body.is-dragging` token whose rule is `* { user-select: none }`. The two surfaces must INHERIT
  that authority, not re-author a local `user-select:none`:
  1. **`PlaybackRibbon.vue` → `useDragCapture`.** The ribbon's slider is a control-surface drag
     (a scrub of the playhead), so `useDragCapture` is the correct seam (it owns
     `setPointerCapture` + the token, `useDragCapture.ts:56,59`). Replace the raw
     `useEventListener(window, "pointerup", onSliderUp)` (`:131`) + the inline `gatedSliderDown`/
     `onSliderDown` (`:6,18`) with the `useDragCapture({ onStart, onMove, onEnd })` handlers and
     its returned `onPointerDown`. The window-level pointerup dies WITH the migration (vueuse owns
     the lifecycle inside the composable). The slider's value-project math is the `onMove` body.
  2. **`EasingCurveCanvas.vue` → `useDragCapture`.** The bezier handles are control-point drags
     (the same family as the timeline diamonds `useDragCapture` already serves — `AnimationVisualizer`).
     Replace the inline `@pointerdown="startDragging"`/`@pointermove="onDrag"`/
     `@pointerup="stopDragging"` (`:12-14`) + the SVG `setPointerCapture` (`:231`) + the local
     `user-select:none` (`:370`) with `useDragCapture`'s `onPointerDown` (which owns
     `setPointerCapture` + the token). The handle-drag → `d`-mutation math is the `onMove` body.
     The local `user-select:none` at `:370` is DELETED in the same motion — its job is now the
     global token (no legacy beside its replacement).

  **What dies in the same motion:** the raw `window.pointerup` in PlaybackRibbon, the inline
  pointer handlers + the `setPointerCapture` call + the surface-local `user-select:none` in
  EasingCurveCanvas. After S1, the source-wide grep for a gesture-scoped `user-select:none` that
  is NOT the global token is ZERO across the demo (`audit/wave-I.W4.md §state` — the I.W4 B6-a
  cure invariant, now extended to every surface). **NO workaround:** the surfaces do NOT get a
  re-authored local select-suppression; they INHERIT the single body-token authority — the
  gestalt the I.W4 §Design-decisions resolved ("one drag seam owns gesture-in-flight"). **WHY:**
  there was never a seam below these two that knew "a drag is live," so select-suppression had
  no home — the same root cause I.W4 cured for square; S1 finishes it for the last two pointer-
  capture surfaces. **Measure-first BOOK (do NOT fold here):** `OrbitalDrag.vue:331` is the
  THIRD bypass — it `setPointerCapture`s the container + has a local `user-select:none`; the
  audit's disposition is "measure-first (setPointerCapture may be sufficient; verify live)"
  (`audit/wave-I.W4.md §5`). It is NOT in this wave's S1 scope — recorded as a J.W2-adjacent
  BOOK, verified live in the §Hard gate's drag-surface sweep but not converted unless the live
  drag actually selects chrome text (the born-RED-or-leave rule).

- **S2 — the `selectedControl` single-WRITER completion (DS-1 + S4-stretch; the half-migration
  closed — the DFA projection is the ONLY writer).** Locus: `CubeScene.vue:73-83` (the rogue
  write) + `AnimationControls.vue:237-249` (the derivation-sync watch) + the single-surface scene
  mount (EasingScene/SpringScene Tabs machinery). The end-state contract, defined precisely:

  > **The single-writer contract.** `storedControls.selectedControl` has EXACTLY ONE writer: the
  > `AnimationControls.vue` `watch(selectedControlSurface)` derivation-sync, which projects the
  > DFA's `selectedControlSurfaceFor(activeScene, preferred)` onto the field. NO scene component,
  > NO ribbon, NO dock writes it imperatively. On every scene entry the rendered control surface
  > (the `<Tabs> :model-value`) EQUALS the DFA projection for that scene — no stale latch, no
  > one-tick window where a downstream read sees a scene-incompatible value.

  1. **DS-1 — the CubeScene rogue write DIES.** Delete the `CubeScene.vue:73-83`
     `watch(()=>selectedAnimation … selectedControl="controls")`. The conditional-surface
     fallback it performed (matrix-controls is no longer valid when the animation deselects away
     from Matrix → fall back to controls) MUST instead happen at the AUTHORITY: the
     `AnimationControls.vue` derivation-sync detects "the preferred surface
     (`matrix-controls`) is no longer valid for the current animation" and re-projects via
     `selectedControlSurfaceFor` (which already owns the valid-surface set). The cube DFA permits
     `"controls"`, so the projection yields it — the SAME result, via the single authority, NOT a
     scene-side imperative that duplicates the DFA's job (`audit/demo-shared-layer.md §K`, the
     named correct fix). **NO workaround:** NOT a guarded scene-side write, NOT a second sync
     watch — the fallback is a function OF the DFA, computed at the one writer.
  2. **S4-stretch — single-surface scenes mount FLAT.** EasingScene/SpringScene are single-control-
     surface scenes (`forceMount: true` already, `EasingScene.vue:70`/`SpringScene.vue:94`); the
     Tabs/v-show double-gate is dead weight for them and is the structural source of the
     half-migration tension (`audit/wave-I.W2.md §6`). Mount the EasingEditor/spring panel FLAT —
     bypass the `<Tabs>`/`TabsContent` machinery entirely for the single-surface case (the spec's
     "RECORD for IMPL, ship if room", `audit/wave-I.W2.md §7`, now FOLDED with a terminal home).
     For single-surface scenes there is then NO `:model-value` to project and NO double-role for
     `selectedControl` — the field's Tabs-model-value role disappears, leaving ONLY the preference
     role (read by ribbon/dock/timeline), which the single writer owns. This is the move that
     "eliminates the tension for the single-surface case" (`audit/wave-I.W2.md §6`).
  3. **The downstream reads converge.** The five downstream reads of the field
     (`AnimationControls.vue:288` `isTimelineVisible`, `:296` `keyframesActive`, `:330`
     `activeBtn`; `RibbonBar.vue:8,13,57`; `App.vue:9` dock `:selected-control` —
     `audit/wave-I.W2.md §2`) now read a field with ONE writer and NO stale-latch window. The
     `{immediate:true}` sync that fires synchronously before next render (the minimal-in-practice
     one-tick risk the audit named) is no longer load-bearing because the writer is the only
     mutation path.

  **WHY:** the I.W2 "single authority" was single-SOURCED but not single-WRITTEN — the field
  still had a rogue scene-side writer and a double role bred by the Tabs double-gate. J.W2 closes
  BOTH: one writer (the DFA projection), one role (preference, for single-surface scenes). **NO
  workaround:** NOT a `selectedControl: ControlSurface` retype alone (that is DS-2, a separate
  type-hygiene win that does not fix the writer count — recorded BOOK-adjacent, not the cure);
  the cure is deleting the rogue write + flattening the mount so the authority is genuinely sole.

- **S3 — M2 the spring-settle signal (the mobile re-open scroll latch; the overclaim cured).**
  Locus: `useSheetSpring.ts` (expose `settled`) + `useControlsLayout.ts:21-35` (consume it).
  1. **Expose `settled` from `useSheetSpring`.** The composable already owns the spring (the
     `liveSpring`/`spring.dispose()` at `:66`) and writes `sheetT` from the spring's
     `value`-callback (`:47`); add a `settled: Ref<boolean>` to the return — driven off the
     spring's own settled state (the same `settled` flag the engine springs expose, the idiom
     `useSquareAnimations.ts:132` already reads `springX.settled && …`). `useSheetSpring.ts:68`
     becomes `return { sheetT, settled }`. The reduced-motion jump (the `:54` note) already
     reaches `sheetT`; `settled` is `true` immediately in the reduced-motion path (no spring
     loop) — the leg works under PRM by construction.
  2. **Drive `isPanelTransitionDone` off `settled` on mobile.** In `useControlsLayout.ts`, the
     mobile branch replaces the CSS `max-height` `transitionend` gate (`:30-35`) with a watch on
     the sheet spring's `settled`: when the sheet is OPEN and `settled` becomes `true` on mobile,
     set `isPanelTransitionDone = true` (so `overflow-y-auto` clears the `overflow-hidden` and the
     body scrolls to content). The DESKTOP path (which DOES have a CSS `max-height` transition)
     keeps the `transitionend` gate — the two paths are dispatched by the mobile/desktop layout
     mode (`ControlsPaneWrapper.vue:254` is the mobile spring-height locus). The fix is the one
     the I.W2 spec NAMED but never implemented ("drive `isPanelTransitionDone` off the spring
     settle", `audit/wave-I.W2.md §4`).

  **WHY:** the spring-driven sheet has no CSS height transition, so the `transitionend` the gate
  waits on NEVER fires after a close+re-open — the latch is structurally unreachable on mobile
  (`audit/wave-I.W2.md §4`). The cure binds the readiness signal to the ACTUAL motion driver (the
  spring's settle), not a CSS event the motion does not emit. **NO workaround:** NOT a timeout, NOT
  a `nextTick`, NOT an `overflow-y-auto` always-on (which would break the open-animation clip) —
  the readiness is the spring's own honest settled signal. **This cures the PROGRESS overclaim:**
  the "mobile sheet body can SCROLL to its content (M2)" claim becomes TRUE, witnessed by the
  §Hard gate's 390×844 open→close→RE-OPEN leg.

- **S4 — the `AnimationMenuBar → TransportDock` rename (CD-1 — the D overclaim TERMINATED).**
  Locus: `AnimationMenuBar.vue` (the file) + the 11 reference sites (verified, §The state). A
  one-file component rename + an import/reference sweep:
  1. `git mv demo/@/components/custom/animation-controls/AnimationMenuBar.vue …/TransportDock.vue`.
  2. Sweep the references: `AnimationControlsGroup.vue:149` (`import AnimationMenuBar from
     "./AnimationMenuBar.vue"` → `TransportDock`), `:88` (the `<AnimationMenuBar>` template tag),
     `:251` (the `useTemplateRef<InstanceType<typeof AnimationMenuBar>>` instance type + the
     `menuBarRef` name → `transportDockRef`), `:360` (comment) · `App.vue:187` (comment) ·
     `useEasingDemo.ts:370` + `useSequenceDemo.ts:148` (the bottom-bar-contract comments) ·
     `design-idioms.css:99,342` (the comment + the scoped-block migration note).
  3. The doc entry `demo/CLAUDE.md:53` is HANDED to J.W5's `demo/CLAUDE.md` rewrite (J.W5 owns the
     demo doc-rot purge, `J.md` J.W5 row) — J.W2 does NOT patch the doc; it flags the row so the
     two waves do not both touch it. The cross-wave note is recorded here so a future reader sees
     the rename's doc tail has a home.

  **The component's `:always-expanded="true"` prop STAYS** — it is the dispositioned-as-kept
  always-expanded transport affordance (`audit/recap-CD.md` CD-3, RECORD), NOT the retired
  `isMobile` touch-mask. **WHY:** the D FINAL asserted this rename closed against a gate that
  never ran — the exact class inv-ε forbids (`audit/recap-CD.md` CD-1, P1). J executes the rename
  the D FINAL claimed and verifies `grep AnimationMenuBar demo/ = 0` (excl. `docs/tranches/`),
  terminating the overclaim. **NO workaround:** NOT a re-export alias keeping `AnimationMenuBar`
  resolvable (that is legacy beside its replacement) — the old name is GONE, every reference
  updated in the same motion.

- **S5 — spring non-reactive writes (DS-3; extend the I.W4 DotPainter idiom) + `onScopeDispose`
  (DS-3/§L).** Locus: `useSpringDemo.ts:175-193` + the SpringTarget/SpringSidebar view layer +
  `useRafLoop.ts:56`.
  1. **The 17 reactive refs/frame onto the DotPainter idiom.** The easing scene already models
     the target shape (`useEasingDemo.ts:171-178,442`): a `registerDotPainter(paint)` registry
     where the view layer hands a closure that writes `el.style.transform` DIRECTLY (off the Vue
     render graph), and `progress` is written reactively at most `PROGRESS_READOUT_HZ = 6`
     (`useEasingDemo.ts:166`). The spring scene adopts the SAME discipline: the hot POSITIONAL
     writes (the live ball `left`/transform, the 4 preset-track ball positions — the writes that
     move pixels at 60Hz) move to direct `style.transform` writes via a painter registry; the
     human-readable readouts (`liveValue`/`liveVelocity`/`liveSettled` numerals, the sampler
     value) are written reactively at the few-Hz readout cadence, NOT per frame. The 17/frame
     reactive storm collapses to ~0 reactive writes on the hot path + a few-Hz readout flush —
     the exact I.W4 D4 transposition, applied to the one scene that never received it
     (`audit/demo-scenes.md` DS-3). **WHY:** reactivity is the wrong tool for a 60Hz positional
     update — a per-frame `ref` write re-renders its consumers; the position is a direct DOM
     write, the readout is a few-Hz reactive flush (the I.W4 §Design-decision, verbatim, extended).
     **NO workaround:** NOT a `shallowRef`/`triggerRef` micro-opt, NOT a debounce on the existing
     refs — the hot positional path leaves the render graph entirely, as easing's did.
  2. **`useRafLoop` → `onScopeDispose`.** `useRafLoop.ts:1,56` swaps `onUnmounted(stop)` for
     `onScopeDispose(stop)` (and the import), converging on the seam every other animation-controls
     composable uses (`useSheetSpring.ts:1,66`). **WHY:** `onScopeDispose` fires on component
     unmount AND on `effectScope` disposal — `onUnmounted` leaks the rAF loop if `useRafLoop` is
     ever called from a non-component scope (`audit/demo-shared-layer.md §L`). Structurally correct,
     converges the lone outlier.

- **S6 — LS-20 the typed-alternative cast removals (type hygiene; PROGRESS homes it here).**
  Locus: the 5 verified `as any` sites. Each gets its typed alternative:
  - `useEasingDemo.ts:89` `steppedEase(…, stepOptions.value.jumpTerm as any)` → the proper
    `jumpTerm` union type the `steppedEase` signature expects (a typed narrowing, not `any`).
  - `useEasingDemo.ts:389` `new AnimationGroup(contractAnim as any)` — `contractAnim` is a
    `Ref<>` needing `.value` (the cast hides a missing unwrap, `audit/legacy-sweep.md` LS-20).
  - `AnimationControlsGroup.vue:198,272` `storedControls.selectedAnimation = null as any` → the
    typed `string | null` union on `selectedAnimation` so `null` is a valid assignment without
    the cast.
  - `AnimationControlsGroup.vue:217` `useAnimationGroupPlayback(…, emit as any)` → the composable's
    `emit` parameter typed to the component's emit signature (resolves the `any`-typed
    `useAnimationGroupPlayback` contract, the DS-5-adjacent smell).
  **NO workaround:** the `src/animation/utils.ts:251,258` cross-realm parse-that casts are LEGIT
  (documented structural impossibility, `audit/legacy-sweep.md §B`) and are NOT touched; LS-20 is
  the demo-side casts with a typed alternative ONLY. **WHY:** `as any` with a typed alternative
  available is a no-legacy item the marker grep cannot see (a cast carries no TODO token) — the
  J no-legacy precept reaches it (`PROGRESS.md §3`, no-legacy row).

## §Hard gate (the proof:* that BITES — born-RED on the pre-fix tree, GREEN-on-fix · RUNTIME/INTERACTION)

**Gate-ORACLE precept (CHARTER INVARIANT, mechanically prior — NOT asserted backward).** Every
correctness clause DRIVES the running product through the human's surface — a real `page.mouse`
drag over a recovered surface, a real mobile sheet open→close→RE-OPEN on a 390×844 touch context,
a real scene sweep reading the rendered control surface — and asserts a FELT product property
under an error budget. This wave's §Hard gate SATISFIES the `proof:gate-is-runtime` meta-gate
(which fails any wave whose §Hard gate is not interaction-driven, `audit/precepts.md` gate-ORACLE
row) — the precept is enforced by machine. The clauses inherit the structured error-budget
allowlist (`console.error`/`pageerror`/`unhandledrejection`/`"......"` = 0, hard) as the floor
under every assertion. The gate is WITNESSED on the **J.W3-industrialized harness** (`withPage`/
`navToScene`) and consumes J.W0's `navToScene` per-expected-state primitive for every scene entry.

**`proof:drag-gesture` (extended) + `proof:control-surface-single-writer` (new) +
`proof:sheet-reopen-scroll` (new)** — a Playwright session over the BUILT `dist/gh-pages/`:

- **clause (a) — `proof:drag-gesture` DRAG_SURFACES EXTENDED to the two recovered surfaces (S1;
  CORRECTNESS).** The existing `DRAG_SURFACES` roster lists exactly 4 surfaces (verified:
  `scripts/proof-drag-gesture.mjs:137-141` — `square/.demo-box`, `spring/.spring-rail`,
  `sequence/.seq-scrub`, `motion-path/.mp-traveller`); it does NOT cover EasingCurveCanvas or
  PlaybackRibbon. Extend the roster with the two recovered surfaces (the easing bezier-handle
  drag + the playback-ribbon slider scrub). For EACH new surface, drive a REAL `page.mouse.down →
  move → up` (the CDP mouse path, NOT a synthetic `dispatchEvent`) that starts on the surface's
  handle and SWEEPS the pointer across a dock/control label, then assert the DUAL born-RED witness
  (the I.W4 clause-a shape, `audit/wave-I.W4.md §3`): (i) `window.getSelection().toString()` is
  EMPTY after the gesture; (ii) the structural corroborator — `getComputedStyle(html/body/dock/
  controls).userSelect` is the global-token `none` (not `auto`) DURING the gesture. Assert the
  gesture LANDS (the bezier `d` mutates / the playhead scrubs). **BORN-RED witness:** on the
  pre-fix tree, a real drag over a chrome label from the easing handle / the ribbon slider leaves
  a non-empty `getSelection()` AND `userSelect:auto` on the chrome (the inline-handler/raw-window
  surfaces have no global token — `EasingCurveCanvas.vue:370`'s local `user-select:none` does NOT
  cover the chrome the pointer sweeps onto). **BITE:** reds TODAY on the two new roster rows;
  greens on S1 (both surfaces route through `useDragCapture`, inheriting the body-token →
  `* { user-select: none }` for the gesture). The 4 existing surfaces stay green (no regression).
- **clause (b) — the single-writer live sweep: rendered surface == DFA projection on EVERY entry
  (S2; CORRECTNESS).** Drive a scene sweep over the BUILT dist via `navToScene` (J.W0's
  per-expected primitive) — cube → easing → spring → sequence → cube (covering single-surface
  scenes, the cube matrix-fallback case, and panel-less scenes). On EVERY entry, read the rendered
  control surface (the `<Tabs> :model-value` for multi-surface scenes; the flat-mounted panel
  presence for single-surface scenes) and assert it EQUALS the DFA's
  `selectedControlSurfaceFor(activeScene, preferred)` projection — NO stale latch, NO one-tick
  window where the rendered surface is a scene-incompatible value. Specifically: on cube after
  deselecting the Matrix animation, the rendered surface is `"controls"` (the DFA fallback) and
  the field had exactly ONE writer (the derivation-sync), NOT a CubeScene rogue write.
  **BORN-RED witness:** on the pre-fix tree, the `CubeScene.vue:73-83` rogue write mutates the
  field outside the DFA — plant a probe that snapshots `storedControls.selectedControl` writes and
  assert ZERO writes originate from a scene component; TODAY the cube write fires (RED); greens on
  S2 (the rogue write deleted, the fallback at the authority). **BITE:** reds on the rogue-write
  tree; greens when the DFA projection is the sole writer. **The hygiene corroborator (LABELED):**
  the no-writer-outside-the-DFA GREP — `grep -rn "storedControls.selectedControl\s*=" demo/app/
  scenes/ demo/@/.../RibbonBar.vue demo/@/.../dock/` returns ZERO scene/ribbon/dock-side writes
  (only the `AnimationControls.vue` derivation-sync writes the field). *(Labeled HYGIENE per the
  two-tier taxonomy — a source-shape grep; it CORROBORATES the live sweep but the wave's GREEN
  depends on the RUNTIME sweep alone; the grep failing flags a regression but does not by itself
  certify the writer count — the live sweep is the correctness oracle.)*
- **clause (c) — the mobile sheet open→close→RE-OPEN scrolls to its content on 390×844 (S3 — the
  M2 cure; CORRECTNESS).** On a `390×844` `hasTouch` context, switch to a control-bearing scene,
  OPEN the sheet (real touch tap on the dock affordance), CLOSE it, then RE-OPEN it; after the
  re-open spring SETTLES, assert the `.controls-pane` inner is scroll-reachable — its computed
  `overflow-y` is `auto` (not `hidden`) AND a touch-drag-scroll inside the sheet moves the content
  (the bottom of the control list becomes reachable). **BORN-RED witness:** on the pre-fix tree,
  `isPanelTransitionDone` stays `false` after the close+re-open (the spring-driven sheet fires no
  `max-height` `transitionend`, `useControlsLayout.ts:30-35`) → `.controls-pane` stays
  `overflow-hidden` → the content is unreachable (RED — the M2 latch, the overclaim). **BITE:**
  reds on the `transitionend`-gated tree after a re-open; greens on S3 (the `settled` signal sets
  `isPanelTransitionDone` on re-open). This is the leg that makes the PROGRESS M2 claim TRUE — the
  runtime oracle for the overclaim the I.W2 audit found (`audit/wave-I.W2.md §4`).

**The §spine bar — MUST bite.** Clauses (a)/(b)/(c) DRIVE the running product: a real
`page.mouse` drag over each recovered surface (no chrome-text selection, gesture lands); a live
`navToScene` scene sweep asserting the rendered control surface == the DFA projection on every
entry (no stale latch), with the no-rogue-writer grep as the LABELED hygiene corroborator; and a
real 390×844 sheet open→close→RE-OPEN that scrolls to content (the M2 runtime oracle). Each
asserts a FELT product property (selected text, the projected surface, scroll reachability), NOT
a code shape. Revert S1 → (a) reds (the recovered surfaces select chrome text); revert S2 → (b)
reds (the rogue write desyncs the field from the DFA); revert S3 → (c) reds (the re-opened sheet
clips its content). These are CLAUSES of the `proof:live-session` battery (the drag + control-
surface + mobile-sheet legs) and inherit its error-budget allowlist as a charter invariant.
**Two-tier discipline:** the wave is GREEN iff clauses (a)/(b)/(c) — the RUNTIME/INTERACTION
clauses — all bite born-RED and turn green on the fix; the no-rogue-writer grep is strictly a
HYGIENE corroborator and may NEVER substitute for a red runtime clause. There is NO source-shape
escape hatch in any correctness clause. **NO workaround:** the M2 leg waits on the spring's actual
`settled` signal (not a `waitForTimeout`); the single-writer leg reads the live rendered surface
(not a localStorage proxy — the WZ `2e3669e` lesson, `audit/wave-I.W2.md §2`, that the gate must
read the RENDERED surface, not the deprecated field axis).

## §No-workaround prohibitions (BINDING — the mandate's named forbiddings for this wave)

- **NO per-surface `user-select:none` re-author (S1).** The two recovered surfaces INHERIT the
  global `body.is-dragging` token via the shared seam; they do NOT get a re-authored local
  select-suppression. The `EasingCurveCanvas.vue:370` local `user-select:none` DIES with the
  migration — no legacy beside its replacement.
- **NO guarded scene-side write (S2).** The `CubeScene` rogue write is DELETED, not wrapped in a
  validity guard or a second sync watch. The matrix-controls fallback is a function OF the DFA,
  computed at the one writer (the derivation-sync), never a scene-side imperative.
- **NO `waitForTimeout`/`nextTick`/always-on-overflow for M2 (S3).** The readiness signal is the
  sheet spring's own `settled` flag — bound to the actual motion driver, not a CSS event the
  spring does not emit nor a blind timeout.
- **NO re-export alias for the rename (S4).** `AnimationMenuBar` is GONE — no compatibility alias
  keeps the old name resolvable. `grep AnimationMenuBar demo/ = 0` (excl. `docs/tranches/`,
  excl. the J.W5-owned `demo/CLAUDE.md` row).
- **NO `shallowRef`/debounce micro-opt for the spring storm (S5).** The hot positional path leaves
  the Vue render graph entirely (the DotPainter idiom), as easing's did — not a reactivity-tuning
  band-aid on the existing 17 refs.
- **NO blanket `as any → as unknown` swap (S6).** Each LS-20 cast gets its TYPED alternative (the
  `jumpTerm` union, the `.value` unwrap, the `string | null` field type, the typed emit), never a
  laundered cast that still erases the type.

## §Folds (every J.md-assigned fold, with its evidence citation)

| Fold | Origin (audit §) | Where in this spec |
|---|---|---|
| W4-3 EasingCurveCanvas onto the shared drag seam (B6 latent class) | `audit/wave-I.W4.md §3`/`§5` | S1.2 |
| W4-4 PlaybackRibbon onto the shared drag seam (raw `window.pointerup`) | `audit/wave-I.W4.md §3`/`§5` | S1.1 |
| OrbitalDrag third bypass — measure-first BOOK (verify live, born-RED-or-leave) | `audit/wave-I.W4.md §5` | S1 (BOOK; §Hard sweep) |
| DS-1 CubeScene rogue `selectedControl` write dies (single-authority bypass) | `audit/demo-shared-layer.md §K`/DS-1 | S2.1 |
| S4-stretch — single-surface scenes mount flat (bypass Tabs double-gate) | `audit/wave-I.W2.md §7`/`§6` | S2.2 |
| the `selectedControl` half-migration completed (one writer, one role) | `audit/wave-I.W2.md §6`, `§2` | S2 (the contract) |
| M2 — `isPanelTransitionDone` off the spring settle (the overclaim cured) | `audit/wave-I.W2.md §4` | S3 |
| `useSheetSpring` exposes a `settled` signal | `audit/wave-I.W2.md §4` (named, never implemented) | S3.1 |
| CD-1 `AnimationMenuBar → TransportDock` executed (the D overclaim terminated) | `audit/recap-CD.md` CD-1 | S4 |
| DS-3 spring 17 reactive refs/frame onto the DotPainter non-reactive idiom | `audit/demo-scenes.md` DS-3 | S5.1 |
| DS-3/§L `useRafLoop` `onUnmounted` → `onScopeDispose` | `audit/demo-shared-layer.md §L`/DS-3 | S5.2 |
| LS-20 the `as any` casts with typed alternatives (5 sites) | `audit/legacy-sweep.md` LS-20; `PROGRESS.md §2` | S6 |

**Adjacent rows NOT folded here (recorded so they are not orphaned):** DS-2 (`selectedControl`
typed `string` not `ControlSurface`, `audit/demo-shared-layer.md §J`) — a type-hygiene win that
does NOT change the writer count; recorded BOOK-adjacent to S2, not the cure. DS-5
(`useAnimationGroupPlayback` typed `any` for storedControls+emit) — partially touched by S6's
`emit as any` removal (`:217`), the storedControls-`any` half is a BOOK. The `demo/CLAUDE.md:53`
AnimationMenuBar doc row — HANDED to J.W5's demo-doc rewrite (S4.3). The gate-script settle
sleeps (`audit/wave-I.W2.md §7` row — `waitForTimeout(700)` in `switchScene`) — superseded by
J.W0's `navToScene` per-expected predicate, which this wave's §Hard gate consumes; recorded as
discharged-by-J.W0-primitive, not re-litigated here.

## §Design decisions (trade-offs RESOLVED)

- **One drag seam owns gesture-in-flight, finished — RESOLVED.** I.W4 resolved this for square +
  the gate-covered surfaces; the two recovered surfaces are the last pointer-capture bypasses.
  Routing them through `useDragCapture` (PlaybackRibbon a control scrub, EasingCurveCanvas a
  control-point drag — both the control-surface family `useDragCapture` already serves) inherits
  the single body-token authority, deleting their bespoke local select-suppression. The B6-a
  latent class reaches TRUE zero (the I.W4 §Design-decision, extended to its perimeter).
- **The DFA projection is the SOLE writer; single-surface scenes mount flat — RESOLVED.** The I.W2
  single-authority was single-SOURCED but had a rogue scene-side writer (CubeScene) and a double
  role (preference + Tabs model-value) bred by the Tabs double-gate. Deleting the rogue write
  (the fallback moves to the authority) + flattening the single-surface mount (no `:model-value`
  to project) closes BOTH — one writer, one role. The S4-stretch the I.W2 spec deferred IS the
  move that eliminates the tension (`audit/wave-I.W2.md §6`), now with a terminal home.
- **The M2 readiness binds to the spring, not a CSS event the spring does not emit — RESOLVED.**
  The spring-driven mobile sheet fires no `max-height` `transitionend`, so the gate that waits on
  it is structurally unreachable on a re-open. Binding `isPanelTransitionDone` to the sheet
  spring's `settled` signal is the fix the I.W2 spec NAMED but never built — readiness from the
  actual motion driver. The PROGRESS overclaim becomes TRUE, witnessed by the runtime re-open leg.
- **The rename is EXECUTED, not aliased — RESOLVED.** The D FINAL asserted the
  `AnimationMenuBar→TransportDock` rename closed against a gate that never ran (CD-1, the inv-ε
  class). J executes it — the file renamed, all 11 references swept, the old name GONE (no
  compatibility alias). The `:always-expanded="true"` prop stays (the kept transport affordance,
  CD-3). The overclaim terminates at a real `grep = 0`.
- **The spring scene adopts the easing D4 idiom; the lone outlier converges — RESOLVED.** The hot
  positional writes leave the Vue render graph (the DotPainter registry easing already models),
  the readouts flush at a few Hz — the I.W4 D4 transposition applied to the one scene that never
  got it. `useRafLoop` converges on `onScopeDispose` (the seam every sibling composable uses).
  Both are seam-extensions, not new mechanisms.
- **The typed casts get typed alternatives, not laundered — RESOLVED.** Each LS-20 cast gets its
  real type (the union, the unwrap, the field type, the typed emit); the documented cross-realm
  parse-that casts are untouched (LEGIT). No `as any → as unknown` swap that still erases the type.
