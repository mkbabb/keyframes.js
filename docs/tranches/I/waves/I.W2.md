# I.W2 — THE EASING-EDITOR DESIGN-CORRECTION + CONTROLLED-TABS DESYNC (Band 1 · the curve editor BACK + the single-authority surface mount)

- **Phase:** DEV — spec authored, awaits IMPL+auth · **Class:** SHIP-in-I (HIGH; the easing
  curve/timing editor is BLANK on every in-app switch-in — a silent render gating, no crash —
  and the user reads it as "the J1–J6 minimalism over-removed it." Both halves are real: a
  controlled-component DESYNC that hides the (still-present) editor, AND a genuine parity gap
  J's strip cost.) · **Scope (demo, NO engine):** the control-surface single-authority
  (`AnimationControls.vue` / `ControlsPaneWrapper.vue` / `controlSurfaceDFA.ts` — the reka
  `<Tabs>` `:model-value` source) + the easing editor components (`EasingSidebar.vue`,
  `EasingSelect.vue`, `EasingCurveCanvas.vue`, `TimingFunctionPanel.vue` → reconcile to ONE
  `EasingEditor`) + `EasingScene.vue` (delete the redundant `selectedControl` poke). ·
  **DAG-deps:** after **I.W0** (clean console — the gate's oracle is readable). **OWNS the
  order-independent control-panel mount single-authority that I.W1 consumes** (B2's
  flush-abort and B4's reka latch both blank a panel the DFA says exists — one cure). NOT the
  φ-typography chronic (CH-2 is genuinely closed; this is a DISTINCT D-defect on the
  easing-editor surface — `recap-chronic CH-2 caveat`).

## §Provenance (the folded root cause + investigation)

- `rootcause-rc-easing-editor.md` — the CONFIRMED root cause, with B4's premise FALSIFIED and
  its hypothesis REFINED:
  1. **NOT a J over-removal.** The `EasingSelect` dropdown and the editable `EasingCurveCanvas`
     bezier are STILL in source and STILL render+work on a FRESH `#/easing` load (verified:
     `data-state="active"`, 2 draggable handles, handle-drag mutates the path). The user's
     "BACK" is satisfied the moment the host stops hiding them.
  2. **NOT the B2 `_gen` crash, NOT the B1 `"......"` warn.** The switch-into-easing repro
     fired ZERO `pageerror`, ZERO `_gen`, ZERO `"......"`. The blank is a SILENT render gating.
  3. **NOT a `selectedControl` model-value desync** (B4's primary hypothesis). On the broken
     switch the store reads `selectedControl === "easing"` — the bound value is CORRECT. The
     desync is INSIDE reka's `useVModel`, between the store and the Tabs root's internal proxy.
- `rootcause-rc-easing-editor.md §root-cause` — THE root cause: the easing editor lives in
  `TabsContent value="easing"` under a reka `<Tabs :model-value="storedControls.selectedControl">`
  whose `useVModel` LATCHES `passive` from `modelValue === undefined` AT MOUNT
  (`reka-ui/dist/Tabs/TabsRoot.js:57-60`, `passive: props.modelValue === void 0`). On a scene
  SWITCH the `<Tabs>` root is created during a tick where `:model-value` resolves `undefined`
  (the freshly-keyed superKey store hasn't been re-pointed to `"easing"` yet / the `animation`
  prop is briefly unbound), so the root takes ownership of an INTERNAL value that is NOT
  `"easing"`, `TabsContent.isSelected = (value === modelValue)` computes FALSE
  (`reka-ui/dist/Tabs/TabsContent.js:35,57`), the panel renders `data-state="inactive"` →
  `display:none` → the bezier canvas + dropdown + duration are unmounted/hidden. The FRESH path
  works because EasingScene sets `selectedControl = "easing"` synchronously at setup, so the
  latch is taken `"easing"` and the proxy is a live `computed` that tracks the store.
- `rootcause-rc-easing-editor.md §live discriminator` (probe `rc-easing-editor-vmodel.mjs`):
  FRESH `#/easing` → panel `data-state:active`, `display:block`, bezier canvas PRESENT, store
  `"easing"`; SWITCH cube→Easing → panel `data-state:inactive`, `display:none`, bezier canvas
  ABSENT, store `"easing"`. SAME store value, single host root, ZERO triggers, OPPOSITE panel
  state — the reka `isSelected:false` gate, not a crash.
- `rootcause-rc-easing-editor.md §design reconciliation` — the J-minimal vs "editor BACK"
  reconcile: J wanted minimal (no value TEXT INPUT, no `<h2>` title, single flat container,
  full-width duration, grown canvas — `j-easing-minimalism.md` J1–J6, GOOD, stays). The user
  needs to CHANGE the curve — which the `EasingSelect` + editable `EasingCurveCanvas` already
  provide. The ONE genuine parity gap J cost: the live `cubic-bezier(…)`/`steps(…)` read-only
  VALUE READOUT + copy that `TimingFunctionPanel.vue:36-50` still carries but the standalone
  `EasingSidebar` lost. `recap-precepts §1.3` — `proof:scene-control-dfa` codified the strip
  as the contract (asserted the tab LABEL, not the mounted PANEL); the visual baseline locked
  the over-removed state as golden.

## §The state, verified (file:line / live anchors)

- **The reka primitive (the gate):** `reka-ui/dist/Tabs/TabsContent.js:35,57` —
  `const isSelected = computed(() => props.value === rootContext.modelValue.value);` →
  `"data-state": isSelected.value ? "active" : "inactive"`, `present: forceMount ||
  isSelected.value`. The easing `TabsContent value="easing"` is NOT `force-mount`, so the
  EasingSidebar mounts ONLY while `isSelected` is true.
- **The latch:** `reka-ui/dist/Tabs/TabsRoot.js:57-60` — `useVModel(props, "modelValue", emits,
  { defaultValue, passive: props.modelValue === void 0 })`. `@vueuse` `useVModel(passive:true)`
  returns an INTERNAL `ref(getValue())` seeded from `props.modelValue` AT MOUNT, decoupled from
  the parent thereafter except via a `watch(() => props[key])`. Latched with `undefined` → the
  root's "active value" is self-owned and seeded wrong.
- **The host:** `AnimationControls.vue:6-9` — `<Tabs :model-value="storedControls.selectedControl"
  @update:model-value="selectControl">`; `:174` — `storedControls =
  getStoredAnimationGroupControlOptions(animation)` (keyed off the *animation* prop). On a
  switch-in the `animation` prop and/or the re-pointed superKey store entry are not yet
  carrying `selectedControl === "easing"` on the tick the `<Tabs>` first renders.
- **The deep slot chain (registers a tick LATE):** App `#tabs-content` → AnimationControlsGroup
  → `ControlsPaneWrapper.vue:63-99` (`v-show="selectedAnimation == name"`) → `<AnimationControls>`
  `<slot name="tabs-content">`. The slotted easing content registers with the Tabs root a tick
  late relative to the root's own model-value latch.
- **The redundant poke:** `EasingScene.vue:31-33,55-60` — sets `storedControls.selectedControl
  = "easing"` at setup and renders the editor only inside `TabsContent value="easing"`. Wins
  the race on a fresh mount; loses it on a switch.
- **The TWO duplicated bezier hosts:** `EasingSidebar` (the rail) and `TimingFunctionPanel`
  (the in-panel cube/amiga detail) BOTH host an `EasingCurveCanvas` + a curve picker +
  (panel-only) a readout/copy + a preset Select — divergent chrome, which is WHY the readout
  was "lost" in the rail but not the panel.

## §Goal

The easing editor — the `EasingSelect` curve dropdown + the editable `EasingCurveCanvas`
(draggable bezier handles) + a read-only copyable curve value — is PRESENT and FUNCTIONAL on
every entry to `/easing` (fresh AND switched-in) and on spring's single-surface panel, with
J's minimal chrome as the one shared skin. The cure is a controlled-component CONTRACT
correction at the slot seam (so the panel cannot be selected-but-unmounted on switch), a small
design parity restoration (the lost readout/copy), and a unification of the two divergent
bezier hosts onto ONE `EasingEditor` — the "architectural transposition for elegance/
simplicity" the mandate names. Three moves, KISS · no-legacy · no workaround (NO `nextTick`
re-assert — the EasingScene comment correctly notes the old `onMounted+nextTick` hack was
removed; re-adding it is the workaround we must NOT take):

1. **Kill the `passive`-latch race at its source** — make the `<Tabs>` born-correct on every
   entry by single-sourcing the selected surface from the scene machine's control-surface DFA
   (the same single-authority the DFA already started for the valid SET — extend it to the
   SELECTED surface).
2. **Restore the lost parity** — fold the read-only value + copy back into the shared editor.
3. **Reconcile the two bezier hosts into ONE `EasingEditor`** so the rail and the detail panel
   are the same editor with the same affordances.

## §Scope

- **S1 — single-source the selected control surface from the scene machine (KFI, the seam —
  the PRIMARY · OWNS the order-independent mount I.W1 consumes).** Locus: the `<Tabs>
  :model-value` binding (`AnimationControls.vue:6-9`) + the machine's control-surface
  projection (`controlSurfaceDFA.ts`, `controlSurfacesFor(activeScene)`). The active control
  surface for the current scene is a DERIVABLE function of the machine (`controlSurfacesFor` →
  `["easing"]` for easing). Make the SELECTED surface a machine-projected, synchronously-
  correct value (default to the scene's first/only valid surface) rather than a free
  `storedControls.selectedControl` that the scene mutates in `setup` and hopes wins the race.
  Bind `<Tabs> :model-value` to THAT projection, so on a switch the model-value is `"easing"`
  on the very tick the root mounts — the latch is taken correct, fresh and switched paths
  converge. The `storedControls.selectedControl` poke in `EasingScene.vue:32` (and the
  equivalent per-scene pokes) becomes redundant and is DELETED (no legacy beside the
  replacement). **WHY:** this is the SAME single-authority move the DFA already started
  (AnimationControls reads `machine.controlSurfaces` for the triggers/panes) — extend it so
  the SELECTED surface, not just the valid SET, is machine-derived. **This is the
  order-independent control-mount single-authority I.W1's S3 consumes** for B2's resumed scene
  — author it ONCE here, the mount becomes a pure function of (DFA set × active group),
  immune to flush-completion order. (`rc-easing-editor §fix 1`, `rc-dfa-gen §5c`.)

- **S2 — force-mount the single-surface scene's sole `TabsContent` (KFI, the construction-time
  guarantee — the simpler floor).** Locus: the easing/spring `TabsContent`. Where a scene has
  a SINGLE valid surface (easing → `["easing"]`, spring → `["spring"]`), the `TabsContent` for
  it is UNCONDITIONALLY present (`force-mount`, the same escape already used for the keyframes
  Monaco pane at `AnimationControls.vue:69`), driven by the DFA's "this is the only/active
  surface" fact. **WHY:** there is no other panel to switch to, so `present` should not be
  gated on reka's `isSelected` race at all — this makes single-surface scenes (easing/spring)
  immune to the latch BY CONSTRUCTION, and it is the right semantic: their one panel is ALWAYS
  the content. S1 is the headline single-authority; S2 is the belt for single-surface scenes.

- **S3 — restore the read-only curve VALUE readout + copy AS A RE-PARSEABLE LITERAL (the genuine
  parity restoration + the B5 readout-seam half).** Locus: the shared editor (S4's `EasingEditor`).
  Fold back the live `cubic-bezier(…)`/`steps(…)` read-only VALUE READOUT + `CopyButton` that
  `TimingFunctionPanel.vue:36-50` still carries — as a READ-ONLY value + copy (NOT the J-stripped
  editable text INPUT; a passive, copyable readout consistent with the design language). The readout
  + copy emit the COMPLETE `cubic-bezier(x1, y1, x2, y2)` / `steps(n, …)` literal — the value
  `timingString = cubicBezierToString(...controlPoints)` (`TimingFunctionPanel.vue:204`) already
  produces — NEVER the bare `"cubic-bezier"` keyword. **WHY (parity):** this is the part of "the
  easing selector/bezier component BACK" that is a genuine, smaller parity gap — it honors J (no
  text field) while giving back the curve's CSS value. **WHY (the B5 readout-seam, the coordinated
  half):** the construction/update path TODAY persists the bare token —
  `TimingFunctionPanel.vue:216 emit("updateTimingFunction", "cubic-bezier")` (and the equivalent
  EasingSelect update) writes the bare `"cubic-bezier"` keyword into
  `animationOptions.timingFunction`, which `resolveEasingOption ← setTimingFunction ← new
  CSSKeyframesAnimation` REJECTS with `AnimationOptionError` on the next controls re-mount (`b10
  §B5`, I.W0 §state:82-87). **The ownership split (binding):** **I.W0's S5 OWNS the
  construction-path born-RED clause** (the option seam that THROWS — the engine/control component
  that constructs the `CSSKeyframesAnimation` must round-trip a custom-bezier easing without
  emitting the bare token). **I.W2's S3 OWNS the readout-emits-reparseable clause** — the unified
  `EasingEditor`'s readout/copy surface emits, and its `@update`/persist path writes, a re-parseable
  `cubic-bezier(…)` literal (or a typed `Easing`), so the value a user copies AND the value the
  editor persists are both re-mountable. The two clauses are coupled at the easing value surface
  (the readout literal IS what the construction path must accept) but each carries its OWN born-RED
  witness — neither is inferred from the other (closes H-7's "no §Hard gate clause drives the
  option-seam round-trip" for the readout half). (`rc-easing-editor §design reconciliation §4`,
  `I.W0 S5`.)

- **S4 — reconcile the TWO bezier hosts into ONE `EasingEditor` (the structural transposition,
  the elegance move).** Locus: NEW `EasingEditor` component; refactors `EasingSidebar.vue` +
  `TimingFunctionPanel.vue`. `EasingSidebar` (the rail) and `TimingFunctionPanel` (the in-panel
  cube/amiga detail) BOTH host an `EasingCurveCanvas` + a curve picker + (panel-only) a
  readout/copy + a preset Select — duplicated, divergent chrome. Build ONE `EasingEditor`
  (dropdown + editable canvas + read-only readout/copy) that BOTH hosts mount, so the rail and
  the detail panel are the same editor with the same affordances. **WHY:** this kills the
  parity drift at its root (the reason the readout was lost in the rail but not the panel) —
  the curve-change capability is identical everywhere, and J's minimal chrome is the one shared
  skin. **The stretch transposition (RECORD for IMPL, ship if room):** let a scene whose DFA
  set is a SINGLE non-built-in surface render its `EasingEditor` DIRECTLY as the control-pane
  content, bypassing the built-in `<Tabs>`/`v-show` double-gate entirely (that machinery exists
  for the cube/amiga multi-pane controls/keyframes/timeline triad — overkill for easing/spring).
  This removes the desync class for easing/spring permanently. S1+S2 already make B4 a real
  gated fix; S4-stretch is the most elegant and deletes the most machinery.

## §Hard gate (the proof:* that BITES — born-RED on `b934a08`, GREEN-on-fix · RUNTIME/INTERACTION)

**`proof:easing-editor-live`** — a Playwright session over the BUILT `dist/gh-pages/` (the
`proof-no-orphan-specular.mjs` harness):

- **clause (a) — the editor un-hides on switch-IN.** Load `#/cube` → dock-switch INTO `Easing`
  → assert `.easing-curve-canvas` is PRESENT AND `display !== none` AND its host
  `[role="tabpanel"]` is `data-state="active"`. **BITE:** reds TODAY — the panel is
  `data-state="inactive"`, `display:none`, the canvas ABSENT after a switch (the reka latch,
  `rc-easing-editor-vmodel.mjs`); greens on S1 (machine-projected model-value, born-correct) +
  S2 (force-mount the single surface).
- **clause (b) — the bezier is EDITABLE AND the edit RE-ANIMATES the subject (the full
  curve-change → playback chain, the real runtime gate the charge names).** Assert ≥2
  `.control-point.handle` present; then DRAG a handle and assert the drag (1) mutates the bezier
  path `d` (the canvas re-renders the new curve) AND (2) the edited curve actually drives playback —
  the easing changes and the SWEEP/ball re-animates under the new curve: with the easing PLAYING,
  sample the subject's progress/position across frames before vs after the handle-drag and assert
  the timing profile CHANGES (the sampled position-at-fixed-t differs once the curve is edited), so
  a no-op that mutates only the SVG `d` without re-driving the animation still REDs. **BITE:** reds
  TODAY (the handles are unmounted with the hidden panel — nothing to drag, nothing re-animates);
  greens once the panel mounts (S1+S2) and the editable canvas feeds the live animation (the wiring
  that already exists — `:editable` / `@update:bezier-points`). **This is the behavioral assertion**
  — the user's "drag a handle → the easing changes → the ball re-animates" is proven end-to-end, not
  just the DOM presence and not just the `d` mutation.
- **clause (c) — the selector re-renders the curve + the readout emits a RE-PARSEABLE literal
  that SURVIVES re-mount (the B5 readout-seam born-RED witness — I.W2 owns; couples to but is NOT
  inferred from I.W0's construction-path clause).** Assert the `.easing-trigger-label` dropdown is
  present AND changing it RE-RENDERS the curve. Then drive the readout round-trip on the BUILT dist:
  pick `cubic-bezier` in the selector (or drag a handle), READ the value-readout text + the
  `CopyButton`'s copied value, and assert BOTH are a complete, re-parseable `cubic-bezier(x1, y1,
  x2, y2)` / `steps(n, …)` literal — `parseCSSValueUnit` / the engine's easing resolver accepts it
  without throw — and NEITHER is the bare `"cubic-bezier"` token. Finally, SWITCH away and back
  (Easing→Amiga→Easing) to force a controls RE-MOUNT and assert ZERO `AnimationOptionError`
  ("Invalid value for animation option \"timingFunction\": \"cubic-bezier\"") across the re-mount —
  proving the value the editor PERSISTED is re-mountable, not the bare keyword. **BITE:** reds TODAY
  on two grounds — (1) the readout is ABSENT from the rail (J stripped it; `TimingFunctionPanel` has
  it, `EasingSidebar` does not), and (2) the update path persists the bare `"cubic-bezier"` token
  (`TimingFunctionPanel.vue:216`), so a custom-bezier controls re-mount throws `AnimationOptionError`
  (`b10 §B5`). Greens on S3 (the readout folded back as a re-parseable literal + the persist path
  emits the literal) + S4 (one `EasingEditor`, one readout home). **The split with I.W0:** I.W0's
  clause asserts the CONSTRUCTION path (`new CSSKeyframesAnimation`) does not throw on a custom
  bezier; THIS clause asserts the READOUT/copy/persist VALUE the easing editor surfaces is the
  re-parseable literal that construction path accepts — same seam, two born-RED witnesses, neither
  inferred. (`I.W0 S5`, `rc-easing-editor §design reconciliation §4`.)
- **clause (d) — the SAME assertions hold on the return path AND on spring.** Run (a)-(c) for
  Easing→Amiga→Easing (the return) and for spring's single-surface panel. Assert ZERO
  `pageerror`/`_gen`/`"......"` throughout. **BITE:** reds TODAY (the latch re-fires on every
  switch-in; spring shares the single-surface class); greens on S1+S2 (which generalize to
  every single-surface scene).

**The §spine bar — MUST bite.** Clauses (a)-(d) dock-SWITCH into easing/spring and DRAG the
bezier handle + change the selector — the exact interaction `proof:scene-control-dfa` skipped
(it asserted the tab LABEL `selectedControl === "easing"`, which was already correct, while
the PANEL was silently `data-state="inactive"`; `recap-precepts §1.3`,
`rc-gate-blindspot §2.4`). Each asserts a PRODUCT-FACING DOM/playback property (the canvas
mounted; a handle-drag mutates `d` AND re-animates the subject under the new curve; the readout
present + the copied/persisted value re-parseable + a re-mount throws no `AnimationOptionError`),
not a chrome status label one projection removed. Revert S1/S2 → (a)/(b) red (the panel blank, no
canvas to drag, no re-animate); revert S3/S4 → (c) reds (readout absent OR the bare token persists,
the re-mount throws). RED on `b934a08` (the panel blank on switch, the readout absent, the bare
`"cubic-bezier"` token persisted), GREEN only when the machine-projected mount + the unified
`EasingEditor` (with its re-parseable readout/persist) land. This gate is a CLAUSE of the I.W7
`proof:live-session` battery
(the switch-into-easing + handle-drag leg).

**Two-tier taxonomy (the charter invariant, inherited — H-4).** Per the charter's two-tier
taxonomy invariant (bound at I-open, every wave inherits it) and the `proof:gate-is-runtime`
meta-gate, ALL of clauses (a)-(d) are CORRECTNESS-tier RUNTIME/INTERACTION clauses — each
dock-switches the running product and asserts a product-facing DOM/playback property. This wave
carries NO source-shape / static-lint clause, so its GREEN depends on the runtime clauses ALONE;
there is no hygiene clause that could substitute for a red runtime clause. `proof:gate-is-runtime`
passes for I.W2 because every §Hard clause is interaction-driven through `dist/gh-pages/`.

## §Folds

- **B4** (the lost easing-curve/timing editor) — S1 (the desync fix: the editor un-hides on
  switch) + S2 (force-mount the single surface) + S3 (fold the read-only value+copy back) + S4
  (unify the two bezier hosts onto one `EasingEditor`). The user gets the selector + the
  editable bezier + a copyable value, minimal-chrome, everywhere — fresh AND switched-in.
- **B2's blank-controls cure (SHARED)** — S1 IS the order-independent control-mount
  single-authority that I.W1's S3 consumes. The easing panel un-hiding (this gate's clause a)
  and the resumed-scene controls mounting (I.W1's clause b) are the SAME cure, two witnesses.
- **b12 band B** (`{easing,spring}→square` panel blank via the `selectedAnimation`/teleport
  seam) — folds under S1's machine-projected, order-independent mount.
- **I.W0's S5 / the bare-`"cubic-bezier"` `AnimationOptionError` (B5 secondary, COORDINATED, the
  H-7 witness split — BINDING).** The seam is the easing value surface; the fix is split by
  ownership so each half carries its OWN born-RED witness (closes H-7's "the option-seam fault is
  folded but its gate is thin / inferred"):
  - **I.W0 OWNS the construction-path clause** — `new CSSKeyframesAnimation` / `resolveEasingOption
    ← setTimingFunction` must round-trip a custom bezier WITHOUT throwing on the bare token; its
    §Hard gate drives the construct/round-trip and asserts NO `AnimationOptionError` (I.W0 S5).
  - **I.W2 OWNS the readout-emits-reparseable clause** (S3 + clause c) — the unified `EasingEditor`'s
    readout/copy emits, and its `@update`/persist path writes, a complete re-parseable
    `cubic-bezier(…)` / `steps(…)` literal (never the bare `"cubic-bezier"`), and a switch-away/back
    controls re-mount throws ZERO `AnimationOptionError`. The construction path can only stay clean
    if the value the editor persists is the literal — so the two are coupled, but I.W2's witness is
    independent (it reads the readout + drives the re-mount, it does not rely on I.W0's construct
    leg). Neither clause is inferred from the other.
- **NOT CH-2 (the φ chronic) — RECORD.** The φ-hero typography chronic is genuinely closed
  (the one SYSTEM gate that discharged; the user did not re-flag it). B4 is a DISTINCT D-defect
  on the easing-editor surface — do NOT re-litigate the φ-ladder. (`recap-chronic CH-2 caveat`.)
- **J1–J6 STAYS (the design reconciliation, not a revert).** No value TEXT INPUT, no `<h2>`
  title, single flat container, full-width duration, grown canvas — J's minimalism is GOOD and
  is the shared `EasingEditor` skin. The ONLY thing restored is the read-only readout+copy (a
  parity gap, not the stripped input). The user's two intents (J-minimal + "the editor BACK")
  are NOT in conflict once the desync is fixed. (`rc-easing-editor §design reconciliation`.)

## §Design decisions (trade-offs RESOLVED)

- **The desync is at the reka latch, NOT the store value — RESOLVED.** B4's premise (J
  over-removed) and B4's hypothesis (a `selectedControl` model-value desync) are BOTH refined:
  the editor is still in source and the store value is correct; the desync is inside reka's
  `useVModel` passive-latch taken with `undefined` on the switch tick. The fix single-sources
  the model-value from the machine so the latch is BORN correct — not a re-assert after the
  fact.
- **NO `nextTick` re-assert — RESOLVED.** The old `onMounted+nextTick` hack was correctly
  removed; re-adding it is a workaround (a timing band-aid over a latch that should be born
  correct). The machine-projected model-value (S1) makes the re-assert unnecessary.
- **Single-authority (S1) is the headline; force-mount (S2) is the floor — RESOLVED.** S1 fixes
  the general controlled-Tabs contract (it generalizes to cube/amiga multi-pane on switch too).
  S2 is the construction-time guarantee for single-surface scenes (easing/spring), immune to
  the latch by `force-mount`. Ship both: S1 the durable single-authority, S2 the
  can't-go-wrong floor for the single-surface case.
- **Restore ONLY the readout, not the text input — RESOLVED.** J's strip was mostly correct
  (the text input, the `<h2>`, the double container — all stay gone). The ONE genuine parity
  gap is the read-only copyable curve value, which `TimingFunctionPanel` kept and the rail
  lost. Restore it as a passive readout + copy (honors J, gives back the CSS value). This is a
  design-CORRECTION, not a revert.
- **The readout (+ persist path) emits a RE-PARSEABLE literal, never the bare token — RESOLVED
  (the B5 readout-seam half, I.W2-owned).** The restored readout/copy surfaces the COMPLETE
  `cubic-bezier(x1, y1, x2, y2)` / `steps(n, …)` literal (the value
  `cubicBezierToString(...controlPoints)` already yields), and the editor's `@update`/persist path
  writes that literal (or a typed `Easing`) into `animationOptions.timingFunction` — NOT the bare
  `"cubic-bezier"` keyword the current `TimingFunctionPanel.vue:216` emit persists, which
  `resolveEasingOption` rejects with `AnimationOptionError` on the next controls re-mount. The
  construction-path throw (the option seam) is I.W0's S5 to OWN; the readout/copy/persist literal is
  I.W2's to OWN — coupled at the value surface, each with its own born-RED witness (closes H-7's
  thin-witness gap for the readout half). The readout is what makes the construction path stay clean:
  the value copied AND persisted is re-mountable.
- **One `EasingEditor` over two divergent hosts — RESOLVED.** The duplication (rail vs detail
  panel) IS why the readout drifted. Unifying onto one component makes the curve-change
  capability identical everywhere and gives J's minimal chrome one home. The stretch
  (mount the editor flat for single-surface scenes, bypassing the Tabs double-gate) is recorded
  for IMPL if there is room — it deletes the most machinery, but S1+S2 already make B4 gated.
- **OWNS the I.W1-shared mount — RESOLVED.** Rather than two waves re-inventing the
  order-independent control mount, I.W2 owns the surface single-authority (the latch lives
  here) and I.W1 consumes it. The dependency is explicit in both waves' §Hard gates.
