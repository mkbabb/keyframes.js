# I.W2 — IMPL record (control-surface single authority + the unified EasingEditor)

**Status:** LANDED · gate `proof:easing-editor-live` GREEN (live) · `tsc` 0 · 683 tests pass ·
branch `tranche-i-dev`. **OWNS the order-independent control-mount single-authority I.W1 consumes.**

## What landed (file:line)

- **S1 — single-source the SELECTED control surface from the scene-machine DFA (the seam I.W1
  consumes).** `stores/controlSurfaceDFA.ts` — new pure `selectedControlSurfaceFor(sceneId,
  preferred)`: the selected surface as a PURE FUNCTION of (DFA-valid set × preferred pick) —
  returns the preferred pick iff valid for the scene (cube's conditional `matrix-controls`
  honored), else the scene's first static surface. `stores/useSceneMachine.ts` exposes the
  reactive `selectedControlSurface(preferred)` projection over `activeScene`.
  `controls/AnimationControls.vue` binds `<Tabs> :model-value` to that machine-projected value,
  so on a switch the model-value is BORN `"easing"` on the mounting tick — reka's `useVModel`
  `passive`-latch is taken CORRECT (the B4 desync dies at its source, no `nextTick` re-assert).
  The per-scene `storedControls.selectedControl = …` pokes in `EasingScene.vue`/`SpringScene.vue`
  are DELETED (no-legacy). **The mount is now a pure function of (DFA surfaces × active group's
  pick), order-independent — I.W1's S3 consumes exactly this for the resumed/entered scene.**
- **S2 — force-mount the single-surface scene's sole `TabsContent`.** EasingScene/SpringScene
  pass `forceMount: true` — single-surface scenes are immune to the latch BY CONSTRUCTION.
- **S3 — restore the read-only re-parseable readout/copy (the B5 readout seam — I.W2-owned).**
  `useTimingFunctionEditor.ts` now persists a COMPLETE re-parseable `cubic-bezier(x1,y1,x2,y2)` /
  `steps(n,term)` LITERAL into `animationOptions.timingFunction` (new `timingFunctionLiteralFor`)
  — never the bare `"cubic-bezier"`/`"steps"` token that `resolveEasingOption` rejects on
  re-mount. `animationDescriptions.ts` adds literal-aware `timingFunctionKind`/`isDetailTimingFunction`
  so the UI keys off the KIND while the store carries the re-mountable literal. **This closes
  I.W0's clause (e)** (the bare-`"cubic-bezier"` option-seam witness): the persisted value IS the
  literal the engine construction path accepts.
- **S4 — one `EasingEditor`.** NEW `demo/@/components/custom/EasingEditor.vue` (dropdown +
  editable `EasingCurveCanvas` + read-only readout/copy) mounted by BOTH `EasingSidebar.vue`
  (rail) and `TimingFunctionPanel.vue` (in-panel detail) — the curve-change capability + J's
  minimal chrome are identical everywhere; the rail's lost readout is restored. J1–J6 minimalism
  intact (no value text input, no `<h2>`, single flat container) — only the read-only readout+copy
  is restored (a design-CORRECTION, not a revert). CH-2 (φ-typography) untouched.

## The gate (proof:easing-editor-live) — live GREEN

Born-RED verified (cube→easing AND amiga→easing reds: canvas absent — the latch; spring panel
absent). GREEN on fix:
- **(a)** switch INTO easing (cube→easing + amiga→easing return) → `.easing-curve-canvas`
  present + `display:block` + host `[role=tabpanel]` `data-state="active"`. ✓
- **(b)** ≥2 `.control-point.handle`; a handle-drag MUTATES the bezier `d` AND re-animates the
  subject (the sampled traveling-dot spread shifts — a no-op that only mutates `d` would red). ✓
- **(c)** the dropdown re-renders the curve; the readout/copy is a complete re-parseable literal
  `cubic-bezier(0.75, 0.88, 0.25, 1.00)` (NOT the bare token); Easing→Amiga→Easing forces a
  controls RE-MOUNT with ZERO `AnimationOptionError`. ✓
- **(d)** the return path + spring's single-surface panel hold the same; ZERO
  `pageerror`/`_gen`/`"......"` across the cube→easing→amiga→easing→spring sweep. ✓
