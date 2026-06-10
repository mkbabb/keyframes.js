# J.W2 — IMPL RECORD (the demo seam completion · S1–S6 LANDED · all four mandated runtime gates GREEN on a fresh build)

- **Spec:** `J.W2.md` (BINDING). **Branch:** `j-impl-w2` (worktree off the J.W0 close `09a56bf` —
  the dock trigger projection already machine-derived; built on, not regressed: `proof:scene-control-dfa`
  D3 7/7 + D4 7/7 below). **Date:** 2026-06-10.
- **Status:** S1 (both recovered drag surfaces onto the shared seam) + S2 (single-writer completed:
  DS-1 rogue write deleted + S4-stretch flat mount + the suspend-on-leave write gate) + S3 (the
  spring-settle signal, M2 cured) + S4 (the `AnimationMenuBar→TransportDock` rename executed,
  CD-1 terminated) + S5 (spring painters off the render graph + `onScopeDispose`) + S6 (the 5
  LS-20 casts typed) are LANDED and witnessed on the fresh `dist/gh-pages` build
  (`rm -rf dist/gh-pages && npm run gh-pages`, `KF_REQUIRE_BROWSER=1`,
  `KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/glass-ui`).
- *(Commit-message label note: the mandated close message tags the spring non-reactive writes
  "(DS-2)"; the audit row is `audit/demo-scenes.md` **DS-3** — the spec's S5.1. The shared-layer
  DS-2 (`selectedControl` retype) remains the NOT-folded BOOK-adjacent row per spec §Folds.)*

## §The cured battery witness (the born-RED of record → GREEN)

**The recorded RED** (`audit/perf-battery-2026-06-10.md §2`, the battery's one REAL red): the
easing↔cube control-projection round-trip FAILED —
`before: {"selectedControl":"spring"}` (stale from a prior scene!) →
`after: {"selectedControl":"controls"}`; expected restore to `easing`. The audit named it the
DS-1/`selectedControl`-half-migration defect and recorded it as the BORN-RED WITNESS OF RECORD
for this wave.

**The cure (two mechanisms on the same writer seam, both in S2):**

1. **the stale cross-write** — the derivation-sync (the one writer) could fire during the
   NAVIGATE→SCENE_READY window while the controls still host the LEAVING scene's animations,
   writing a cross-scene projection into the leaving scene's store (how `"spring"` leaked into
   the easing store). Cured by gating the write on `isActiveSceneHost`
   (`animation.superKey === inject(ACTIVE_SUPER_KEY)` — atomic with `machine.activeScene`,
   `injectionKeys.ts:8-16`, `App.vue:253`): a stale-mounted host never writes.
2. **the rogue writer** — the `CubeScene` watch wrote the field outside the authority. DELETED
   (DS-1); the matrix-controls fallback is now a function OF the DFA
   (`selectedControlSurfaceFor(scene, pick, activeConditionals)` — a stale conditional pick falls
   back at the authority, `controlSurfaceDFA.ts:235-258`).

**The GREEN (this run, fresh build):** `proof:scene-transition-perf` round-trip clause —
easing↔cube preserves the control projection **byte-identical**
(`{"selectedControl":"easing","isControlsPanelOpen":true}`; `selectedControl='easing'` resumes);
transition budget p95=66.4ms ≤ 120ms (p50=48.9ms over 18 transitions). The recorded RED is cured
at its root, not at the gate.

## §S1 deltas — the two recovered drag surfaces onto the shared seam (W4-3/W4-4 → ZERO)

- **`demo/@/components/custom/EasingCurveCanvas.vue`** — the inline `@pointermove`/`@pointerup`
  handlers + the local `setPointerCapture` call DIE; `@pointerdown="startDragging"` (`:15`) keeps
  ONLY the handle hit-test (`:211-240`) and hands the captured event to `useDragCapture`'s
  `onPointerDown` (`:269-272` — the composable owns `setPointerCapture` + the global
  select-suppression token + the move/up/cancel lifecycle; `onDrag` is the move body,
  `stopDragging` the end). The former surface-local `user-select:none` (was `:370`) is DELETED in
  the same motion (`:375` comment) — suppression is inherited from the body token, never
  re-authored.
- **`demo/@/components/custom/animation-controls/controls/PlaybackRibbon.vue`** — the raw
  `useEventListener(window, "pointerup", onSliderUp)` + the inline `onSliderDown` DIE;
  `useDragCapture` at `:117` owns the scrub (`onScrubPointerDown`); `gatedSliderDown` (`:124`)
  keeps only the capture-phase gating and delegates. The slider value-project math is the
  `onMove` body.
- **The source-wide census (the I.W4 invariant, extended to its perimeter):** gesture-scoped
  `user-select:none` outside the global token = **ZERO**. Remaining `user-select` sites, each
  legitimate: `design-idioms.css:651-656` (IS the token rule — `html:has(body.is-dragging)` +
  `body.is-dragging *`), `ControlsPaneWrapper.vue:327` (`.sheet-grab-handle` — a STATIC
  affordance property beside `cursor:grab`/`touch-action:none`, not gesture-scoped),
  `orbital-drag/OrbitalDrag.vue:331` (the measure-first BOOK, §BOOK below).

## §S2 deltas — the `selectedControl` single-writer completed (DS-1 + S4-stretch)

- **`demo/app/scenes/CubeScene.vue:73-81`** — the rogue
  `watch(()=>selectedAnimation … selectedControl="controls")` is DELETED (only the explanatory
  comment remains; ZERO writes in the file).
- **`…/stores/controlSurfaceDFA.ts:235-258`** — `selectedControlSurfaceFor` gains the
  `activeConditionals: readonly ControlSurface[]` parameter: a preferred CONDITIONAL surface is
  honored ONLY while its condition holds (declared for the scene AND supplied by the caller); a
  lapsed conditional pick falls back to the scene's first static surface — the deleted rogue
  write's job, done by the projection.
- **`…/stores/useSceneMachine.ts:280-286`** — the machine exposes
  `selectedControlSurface(preferred, activeConditionals)` (the reactive projection over
  `activeScene`).
- **`…/injectionKeys.ts:8-25` + `demo/app/App.vue:252-253`** — `ACTIVE_SUPER_KEY` (the active
  scene's superKey, atomic with the machine) + `ACTIVE_CONTROL_CONDITIONALS_KEY` (the cube
  matrix predicate — the SAME fact `extraControlTabs` consumes), provided by the App.
- **`…/controls/AnimationControls.vue:288-313`** — **THE ONE WRITER**: the derivation-sync watch,
  now gated on `tabsExternallyManaged && surface && isActiveSceneHost && field !== surface`
  (idempotent; the suspend-on-leave half). `:410-420` — the user-pick path (`selectControl`) also
  writes the DFA projection OF the pick, so every value that ever lands in the field is a
  projection of the single authority.
- **S4-stretch (the flat mount):** `EasingScene.vue:45-53` / `SpringScene.vue:81-89` — the
  single-surface panel mounts FLAT; the `TabsTrigger`/`TabsContent` wrappers are DELETED (no
  `:model-value` to project, no latch to race — the field's Tabs-model-value role is GONE for
  single-surface scenes, leaving only the preference role the one writer owns). Witnessed live:
  `proof:easing-editor-live` reads `tabpanelState:"(flat)"` on every easing entry and the spring
  flat fallback (`flatVisible:true, rows:4`).
- **The writer census (tree-wide, by grep + the gate's corroborator):** the spec's labeled
  hygiene scope (`demo/app/scenes/`, `demo/@/…/dock/`, `RibbonBar.vue`) has **ZERO** writers.
  Tree-wide, THREE assignment sites exist: `AnimationControls.vue:311` (the derivation-sync —
  the authority), `AnimationControls.vue:417` (the user-pick path — writes the DFA projection of
  the pick, the same authority's function), and `demo/playground/App.vue:59` (the PLAYGROUND
  build root seeding ITS OWN superKey-scoped store — a different app + store instance with no
  scene DFA, outside the main-app contract; recorded, not a contract breach).

## §S3 deltas — the spring-settle signal (M2 cured)

- **`…/composables/useSheetSpring.ts:46-86`** — the composable exposes
  `settled: Ref<boolean>` driven off the spring's OWN settled state (seeded `spring.settled`,
  updated in the value-callback `:58`); un-settles FIRST when a real motion is about to run
  (`:75-80` — so a settled→settled re-open still nets an observable flip via the combined
  watch); the reduced-motion jump path is settled-immediately by construction. `:86` —
  `return { sheetT, settled }`.
- **`…/components/ControlsPaneWrapper.vue:161-163, 187-196`** — the wrapper forwards the signal
  UP via the `onSheetSettled` prop, watched on `[settled, sheetOpen]` (the `sheetOpen` leg
  carries the PRM-snap case where `settled` never nets false across the tick).
- **`…/composables/useControlsLayout.ts:41-60`** — `onSheetSettled(settled)`: when the sheet is
  OPEN and the spring has settled ON THE MOBILE LAYOUT, `isPanelTransitionDone = true` (the
  `overflow-y-auto` latch reaches the re-opened sheet). The DESKTOP `max-height` `transitionend`
  gate (`:21-36`) is KEPT — the two paths dispatch on the layout mode, per spec. No timeout, no
  `nextTick`, no always-on overflow.

## §S4 deltas — `AnimationMenuBar → TransportDock` (CD-1 terminated)

- **`git mv`** `…/animation-controls/AnimationMenuBar.vue` → `TransportDock.vue` (recorded as a
  RENAME in the index).
- **The reference sweep (all 11 sites):** `AnimationControlsGroup.vue` import + template tag +
  `useTemplateRef` instance type (`menuBarRef` → `transportDockRef`) + comment · `App.vue`
  comment · `design-idioms.css:99,342` · `useEasingDemo.ts` + `useSequenceDemo.ts`
  bottom-bar-contract comments.
- **The terminal grep:** `grep -rn AnimationMenuBar demo/` = **1 hit** — `demo/CLAUDE.md:53`,
  which is the row the spec HANDS to J.W5's demo-doc rewrite (S4.3; NOT patched here, flagged so
  the two waves do not collide). Excluding that handed row: **ZERO**. No re-export alias — the
  old name is unresolvable. The `:always-expanded="true"` prop STAYS (the kept transport
  affordance, CD-3).

## §S5 deltas — spring non-reactive writes + `onScopeDispose`

- **`demo/spring/useSpringDemo.ts`** — the 17-reactive-refs/frame storm collapses onto the I.W4
  D4 DotPainter idiom: a `registerSpringPainter(paint)` registry (`:191-206`) whose painters
  write `el.style.transform` DIRECTLY off the Vue render graph, run per frame (`:266`); the
  former hot refs become READOUT mirrors flushed at `PROGRESS_READOUT_HZ = 6` (`:173`,
  `:209-222`, gated `:269`). Hot path: ~0 reactive writes/frame; readouts: few-Hz.
- **`demo/spring/SpringTarget.vue:95-110`** (the live ball + the sampler ball) and
  **`demo/spring/SpringSidebar.vue:108-125`** (the 4 preset-track balls) register painters
  reading the non-reactive `springLive` snapshot — direct style writes, unregistered on dispose.
- **`…/composables/useRafLoop.ts:1,60`** — `onUnmounted(stop)` → `onScopeDispose(stop)` (the
  lone outlier converges; fires on `effectScope` disposal too).

## §S6 deltas — the 5 LS-20 casts, each with its TYPED alternative

| Site (pre-fix) | The typed alternative |
|---|---|
| `useEasingDemo.ts:89` `jumpTerm as any` | the `steppedEase` `jumpTerm` union, derived FROM the signature (`:44` — one authority, no laundering) |
| `useEasingDemo.ts:389` `new AnimationGroup(contractAnim as any)` | the `.value` unwrap the cast was hiding (`:399`) |
| `AnimationControlsGroup.vue:198` `= null as any` | `selectedAnimation: string \| null` on the store type (`controlOptionsStore.ts:7-10`) — `null` is the honest cleared state |
| `AnimationControlsGroup.vue:272` `= null as any` | same field retype; cast-free |
| `AnimationControlsGroup.vue:217` `emit as any` | `AnimationGroupPlaybackEmit` interface on the composable (`useAnimationGroupPlayback.ts:5-13`) — the DS-5 EMIT half; the `storedControls: any` half stays a recorded BOOK per spec |

The documented cross-realm parse-that casts (`src/animation/utils.ts`) are UNTOUCHED (LEGIT per
`audit/legacy-sweep.md §B`).

## §Gate outputs (fresh `dist/gh-pages`, `KF_REQUIRE_BROWSER=1`, 2026-06-10)

**The four mandated runtime gates — ALL GREEN:**

1. **`proof:drag-gesture` PASS** — roster EXTENDED to 6 surfaces
   (`scripts/proof-drag-gesture.mjs:146-171`; non-vacuity enforced: an unfound handle on a
   recovered row is a RED). Both recovered surfaces driven with REAL `page.mouse` drags sweeping
   chrome, both **LAND**: `easing/bezier-handle` — the bezier `d` mutates
   (`…C 0.25 0.9, 0.25 0, 1 0…` → `…C 1 -0.0724…`); `easing/ribbon-slider` — the playhead
   scrubs (`aria-valuenow` 749 → 1500). For all 6: `userSelect` suppressed mid-gesture on
   html/body/dock/controls (= `none`), `getSelection()` EMPTY after the sweep,
   `body.is-dragging` armed on down and CLEARED on up. The 4 pre-existing surfaces stay green
   (no regression). Clause (b): persist-on-release + Home-recenters both hold.
2. **`proof:scene-transition-perf` PASS** — the round-trip clause GREEN (the cured battery
   witness, §above): easing↔cube byte-identical
   `{"selectedControl":"easing","isControlsPanelOpen":true}`; p95=66.4ms ≤ 120ms budget
   (p50=48.9ms / 18 transitions). DFA-source + projection clauses green (the W0 seam EXTENDED,
   not re-authored).
3. **`proof:scene-control-dfa` PASS** — 13 clauses + 11 vitest tests
   (`test/control-surface-dfa.test.ts`). The J.W0 projection NOT regressed: D3 7/7 scenes render
   EXACTLY their DFA set; D4 7/7 ordered nav pairs land on the DESTINATION's set, no stale bleed.
4. **`proof:sheet-reopen-scroll` PASS** (new; wired into `proof:correctness`) — 390×844
   `hasTouch` context: non-vacuity floor (sheet content 668px > body 563px — the leg bites);
   real tap CLOSE → **RE-OPEN**; after the spring settles, `.controls-pane` `overflow-y='auto'`
   AND a real scroll MOVES the content (`scrollTop=105px` — the bottom of the control list
   reachable); error budget 0 across the leg. **The M2 PROGRESS claim is now TRUE.**

**Corroborating gates also run — ALL GREEN:**

- **`proof:control-surface-single-writer` PASS** (new; wired into `proof:correctness`) —
  (b1) the live sweep cube→easing→spring→sequence→cube renders the DFA projection on EVERY
  entry; (b2) cross-store purity after the sweep (easing store holds `'easing'`, spring holds
  `'spring'` — suspend-on-leave, no mid-transition cross-write); (b3) a stale
  `'matrix-controls'` pick with a non-Matrix selection falls back to `'controls'` AT THE
  AUTHORITY. Plus the LABELED hygiene corroborator: zero scene/ribbon/dock-side writes
  (scenes/, dock/, RibbonBar.vue) — corroborates, never substitutes (two-tier discipline).
- **`proof:easing-editor-live` PASS** — the editor un-hides on every switch-in now reading the
  FLAT mount (`tabpanelState:"(flat)"`); handle-drag mutates + re-animates; readout literal
  re-parseable; spring flat panel active; ZERO pageerror/`_gen`/`"......"`.
- **`proof:fsm-suspend-resume-live` PASS** — zero `_gen` throws on synthetic
  visibility-suspend; destination DFA set non-blank on the co-fire switch;
  resume-iff-was-playing holds A→B→A.
- **`proof:live-session` PASS** — the whole-battery ERROR BUDGET = 0 (hard + promoted charges);
  B1/B2/B3/B4/B6/B7/B9/font all green.
- **`proof:gate-is-runtime` PASS** — every §Hard gate opens a real browser + actuates; the
  meta-gate's self-posture HYGIENE-tier.
- **Unit suite:** `vitest run` — 69 files, **683 passed, 2 expected-fail** (the recorded
  expected-fail rows; zero unexpected).

## §The OrbitalDrag BOOK (measure-first — verified LIVE, NOT converted, per born-RED-or-leave)

The third bypass (`orbital-drag/OrbitalDrag.vue:331` local `user-select:none` +
container `setPointerCapture`) was verified live per the spec's BOOK protocol: a one-off probe
(real `page.mouse.down→move→up` from the cube centre sweeping across a dock/chrome label on the
built dist) observed — mid-gesture `body.is-dragging=false`, `body userSelect=auto` (the bypass
is REAL: no token), yet **`getSelection()` EMPTY after the gesture (0 chars selected)**. The
audit's hypothesis is CONFIRMED: `setPointerCapture` routes the pointer stream away from the
document text-selection machinery, so the live drag never selects chrome text. Per the
born-RED-or-leave rule it is NOT converted — the BOOK stands with this live measurement as its
disposition evidence.

## §Folds discharged (the spec's §Folds table, per-row disposition)

| Fold | Disposition |
|---|---|
| W4-3 EasingCurveCanvas onto the seam | DONE (S1; gate clause a, roster row 5) |
| W4-4 PlaybackRibbon onto the seam | DONE (S1; gate clause a, roster row 6) |
| OrbitalDrag third bypass (BOOK) | verified live, stays a BOOK (§above) |
| DS-1 CubeScene rogue write dies | DONE (S2; gate b3 + the hygiene grep) |
| S4-stretch flat mount | DONE (S2; `tabpanelState:"(flat)"` witnessed) — terminal home reached |
| the half-migration completed (one writer, one role) | DONE (S2; the single-writer contract holds live) |
| M2 `isPanelTransitionDone` off the spring settle | DONE (S3; `proof:sheet-reopen-scroll` GREEN — the overclaim cured) |
| `useSheetSpring` `settled` signal | DONE (S3.1; `return { sheetT, settled }`) |
| CD-1 rename executed | DONE (S4; `grep = 0` excl. the J.W5-handed doc row) — the inv-ε violation terminated |
| DS-3 spring writes onto DotPainter | DONE (S5.1; painters + 6Hz readouts) |
| DS-3/§L `onScopeDispose` | DONE (S5.2) |
| LS-20 five casts | DONE (S6; all five typed) |

**NOT folded (recorded, per spec):** DS-2 (`selectedControl: string` retype) — BOOK-adjacent;
DS-5 `storedControls: any` half — BOOK; `demo/CLAUDE.md:53` — HANDED to J.W5; the gate-script
settle sleeps — discharged-by-J.W0-`navToScene` (consumed here, not re-litigated).
