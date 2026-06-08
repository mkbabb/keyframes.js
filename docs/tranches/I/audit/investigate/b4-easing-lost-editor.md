# B4 — /easing LOST the curve/timing editor

**Investigation agent:** `b4-easing-lost-editor`
**Date:** 2026-06-08
**Harness:** Playwright (`playwright-core` via `KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js`)
serving the BUILT `dist/gh-pages/` on an ephemeral port; the proven `serveDist` +
`openSceneFresh` pattern from `scripts/proof-no-orphan-specular.mjs`.
**Probes:** `probes/b4-easing-lost-editor.mjs`, `probes/b4-easing-switch.mjs`,
`probes/b4-easing-proper-switch.mjs`
**Shots:** `shots/b4-easing-01-default.png`, `shots/b4-easing-03-after-drag.png`,
`shots/b4-proper-01-cube-to-easing.png`, `shots/b4-proper-03-amiga-to-easing.png`

---

## TL;DR — the verdict (it is NOT what the J amendment implies)

The user's report — "/easing LOST the easing-curve/timing editor ... the bezier
editor + the ability to CHANGE the easing must return — J over-removed" —
diagnoses J (the easing-minimalism strip) as the culprit. **The evidence
contradicts that root-cause.** J did NOT remove the bezier editor or the
selector: on a CLEAN first-load of `#/easing`, the `EasingSelect` dropdown (34
curves incl. `cubic-bezier`) AND the editable `EasingCurveCanvas` (2 draggable
handles, drag mutates the curve) BOTH render and BOTH work — verified live, no
errors.

**The real defect is RUNTIME, not source-shape:** the ENTIRE `EasingSidebar`
(bezier canvas + dropdown + duration) renders **BLANK** the moment you navigate
INTO `#/easing` from another scene via the dock scene-nav. Only the playback
ribbon (Pause / Reverse / scrubber) survives. The editor is present on a
hard-reloaded scene and ABSENT on an in-app switched-in scene — which is exactly
how a user perceives it as "lost": they navigate around the demo, land on
easing, and the curve/timing editor is gone.

This is the **same gate-blindspot class** the user has warned about: every
`proof:easing-sidebar-minimal` / `proof:easing-sidebar-normalized` gate checks
the FRESH-load source shape and goes green, while the INTERACTION/STATE path (a
scene switch) leaves the panel empty. The gate certified a broken product.

It is also **the same FSM/controlled-component desync family as B2** (the DFA
suspend/`this._gen` crash) and **B1** (the `"......"` serialize warning, which
fires during the very same switch — captured below).

---

## Reproduction (live, BUILT dist)

### Scenario 1 — FRESH load of `#/easing` → editor PRESENT and WORKS
`probes/b4-easing-lost-editor.mjs`, viewport 1440×900.

Inventory of the easing sidebar (curve = `ease` default):

```json
{
  "editorPresent": true,
  "editorVisible": true,
  "canvasPresent": true,
  "canvasVisible": true,
  "handleCount": 2,
  "handlesVisible": [true, true],
  "bezierPathPresent": true,
  "bezierPathD": "M 0 1 C 0.25 0.9, 0.25 0, 1 0",
  "easingTriggerPresent": true,
  "easingTriggerText": "ease",
  "durationSliderCount": 1,
  "jRemoved_valueInputCount": 0,   // J's strip confirmed (no value text input)
  "jRemoved_h2Count": 0            // J's strip confirmed (no <h2> title)
}
```

- Open the `EasingSelect` dropdown → **34 curves** present, grouped
  (linear / ease* / sine / quad / cubic / expo / circ / back / bounce / steps /
  step-start / step-end / **cubic-bezier "custom curve"**).
- Select `cubic-bezier` → `currentCurveLabel: "cubic-bezier"`, 2 handles present.
- Drag a handle → the path MUTATES:
  `before "M 0 1 C 0.25 0.9, 0.25 0, 1 0"` →
  `after  "M 0 1 C 0.439… 0.646…, 0.25 0, 1 0"` (`changed: true`).
- Console + pageerror during this whole flow: **EMPTY** (no errors).

Shot `shots/b4-easing-01-default.png`: the bezier curve canvas (with both
handles), the "ease" dropdown, the full-width "duration" slider — all present.
Shot `shots/b4-easing-03-after-drag.png`: handle dragged, curve reshaped, the
dropdown reads "cubic-bezier" (gold shimmer), readout "cubic-bezier F(0.18) =
0.209". **The editor is fully functional on a fresh load.**

### Scenario 2 — SWITCH INTO easing (the user's real flow) → editor BLANK
`probes/b4-easing-proper-switch.mjs` drives the GENUINE switch path: land on
`#/cube`, hover the bottom-center `GlassDock` to reveal it, click the
`[aria-label="Scene"]` `DockSelectTrigger`, pick "Easing" (the
`switchScene → FSM → :key Suspense re-mount` path — the router is vue-router
NAMED routes via `useSceneMachineRouter`, NOT raw `location.hash`).

After **cube → Easing** (dock switch, `clicked:true`):

```json
{
  "activeScene": "easing",   // FSM switched correctly
  "editorPresent": false,    // EasingSidebar GONE
  "canvasPresent": false,    // bezier canvas GONE
  "handleCount": 0,
  "selectorPresent": false,  // EasingSelect dropdown GONE
  "durationPresent": 0
}
```

After **Easing → Amiga → Easing** (return, dock switch): IDENTICAL — still
`editorPresent:false, canvasPresent:false, selectorPresent:false`. The editor
does NOT come back on return either.

Shots `shots/b4-proper-01-cube-to-easing.png` and
`shots/b4-proper-03-amiga-to-easing.png`: the left controls panel shows ONLY the
playback ribbon (green scrubber, "Pause", "Reverse"). **The entire upper card
that held the bezier canvas + dropdown + duration is absent.** Crucially the
DOCK still shows the controls-tab pill reading **"Easing" (Activity icon)** — so
`selectedControl === "easing"` — yet `TabsContent value="easing"` is NOT
mounted. The active tab is selected but its panel never renders.

---

## Captured console (verbatim, during the switch)

The B1 `"......"` serialize crash fires during the SAME switch (`b4-easing-switch.mjs`
and `b4-easing-proper-switch.mjs` both captured it):

```
[error]   Err x     0
 1 |
     ^^^
[warning] [KeyframesString] could not serialize the animation to CSS: Parse error at offset 0: "......"
```

No `pageerror` (uncaught throw) for B4 itself — the sidebar blanking is a SILENT
render failure (`TabsContent` simply doesn't mount), which is precisely why the
load-time/source-shape gates never caught it. The `"......"` warning is the B1
chronic surfacing on the easing transport during the switch (the easing scene's
`contractAnim` + `AnimationControlsGroup` Keyframes-string readout).

(Also observed, non-blocking noise: `Rendering was performed in a subtree hidden
by content-visibility` ×many — the Monaco force-mount cache; `GL Driver Message
… GPU stall due to ReadPixels` — amiga WebGL, relevant to B3/B8 not B4.)

---

## What J (the easing-minimalism) ACTUALLY removed vs what EXISTS now

From the W12/J diff (`git show 1988dcb -- demo/easing/EasingSidebar.vue`) and the
amendment `docs/tranches/H/audit/feedback/j-easing-minimalism.md`:

**J REMOVED (the strip, J1–J6):**
- J1/J2 — the `<LabeledInput label="value">` CSS-value TEXT INPUT + its "value"
  label + the trailing inline `CopyButton` (the `onCSSInputValue` →
  `demo.parseCSSValue` handler also deleted).
- J5 — the `<h2 class="text-title">{{ currentEasingName }}</h2>` scene title.
- J4 — the double container (collapsed to one flat `CardContent`).
- J3 — the duration slider widened to full-width.
- J6 — the bezier canvas GREW into the reclaimed space.

**J KEPT (and they STILL render on a fresh load):**
- `EasingSelect` — the grouped curve dropdown, THE sole easing selector. PRESENT.
- `EasingCurveCanvas` with `:editable="demo.isBezierEditable"` + the draggable
  bezier handles + `@update:bezier-points="demo.updateBezierPoints"`. PRESENT
  and FUNCTIONAL.
- `LabeledSlider` duration; the steps/jump rows (when `isSteps`).

So **the user's premise ("J over-removed the bezier editor + the ability to
change easing") is FALSE for a fresh load** — the bezier editor and the selector
were never removed; they vanish at RUNTIME on a scene switch (a different, deeper
defect). What J DID remove that is defensibly missed: the **explicit
`cubic-bezier(...)` / `steps(...)` VALUE READOUT + copy** affordance, and a
**bezier-preset Select** — both of which the controls-panel detail editor
(`TimingFunctionPanel.vue`) still has but the standalone `EasingSidebar` does
not. That is a SECONDARY, real feature-parity gap (see "Authoring implications").

---

## Source trace (file:line)

- `demo/app/scenes/EasingScene.vue:55-60` — the `EasingSidebar` is rendered ONLY
  inside `tabsContent = () => h(TabsContent, { value: "easing", ... }, EasingSidebar)`.
  It is therefore gated entirely on the controls-panel Tabs root selecting the
  `"easing"` tab.
- `demo/app/scenes/EasingScene.vue:31-33` — the scene sets
  `storedControls.selectedControl = "easing"` at setup (and `isControlsPanelOpen
  = true`), where `storedControls = getStoredAnimationGroupControlOptions("Easing")`
  (the PER-SUPERKEY store).
- `demo/@/components/custom/animation-controls/controls/AnimationControls.vue:6-9`
  — the `<Tabs :model-value="storedControls.selectedControl">` root. The scene's
  `tabsContent` slot is injected at `:105` via `<slot name="tabs-content">`,
  INSIDE this `<Tabs>` root. reka mounts `TabsContent value="easing"` ONLY when
  the root's controlled `model-value` resolves to `"easing"`.
- `demo/easing/EasingSidebar.vue:18-49,79-89` — the (intact) sidebar markup:
  `EasingCurveCanvas` (editable) + `EasingSelect` + full-width duration.
- `demo/easing/useEasingDemo.ts:81-100,231-298` — `isBezierEditable`,
  `currentEasingFn`, `selectEasing`, `updateBezierPoints` — all intact and
  exercised by the fresh-load probe.
- The B1 `"......"` warning origin (per the user's stack): `format.ts:86`
  `CSSKeyframesToString` → `engine.ts:460/516/576` → value.js `parseState` on
  empty input — fired here from the easing scene's `contractAnim` transport
  during the switch (`useEasingDemo.ts:354-367` `contractAnim` /
  `KeyframesStringControls`).

---

## Root-cause HYPOTHESIS

**The `EasingSidebar` is not "lost to J" — it is unmounted by a controls-panel
Tabs MODEL-VALUE DESYNC across the scene-switch Suspense re-mount.**

The scene's editor surface lives inside `TabsContent value="easing"`, which reka
renders ONLY when the parent `<Tabs>` root's controlled `:model-value`
(`storedControls.selectedControl` for the active superKey) equals `"easing"` AT
THE TIME the slotted content evaluates. On an in-app switch:

1. The `:key="activeSceneKey"` `<Suspense>` re-mounts the scene (`EasingScene`),
   which sets `selectedControl = "easing"` on the **"Easing"** superKey store —
   but the App's controls host / `<Tabs>` root resolves its `storedControls`
   binding to a value that is stale or not synchronously re-pointed to the new
   superKey during the swap (the prior scene left `selectedControl` at e.g.
   `"controls"`). The controlled `<Tabs>` root therefore mounts/holds a
   `model-value` that does NOT equal `"easing"`, so the slotted
   `TabsContent value="easing"` never mounts → the sidebar is BLANK.
2. The dock controls-tab pill reads "Easing" because it is a separate
   projection of the (correct) `selectedControl`, masking the desync — the tab
   is "selected" in the chrome but its PANEL is unmounted. This selected-but-
   unrendered split is the signature of a controlled-component value mismatch
   (the reka `Tabs` root never re-derived the content mount from the late
   model-value update).

This is the **same defect family as B2's DFA suspend/`this._gen`** and the
broader FSM↔view reconcile fragility: the machine status is right (`activeScene
= easing`), the chrome label is right, but the actual surface state (the mounted
panel / the captured generator) is desynced. The fresh-load path works precisely
because there is NO prior scene state to desync against — the Tabs root is born
with `selectedControl = "easing"`.

A secondary contributing factor to rule IN/OUT during root-cause: whether the
per-superKey `storedControls` returned to `AnimationControls` is the SAME object
the scene mutated, and whether the controlled `<Tabs>` needs a forced re-key on
superKey change (a `:key` on the Tabs root keyed by superKey would force the
content to re-derive from the fresh model-value). The elegant fix is NOT a
nextTick re-assert (the EasingScene comment notes the old "onMounted+nextTick
re-assert hack" was deliberately removed) — it is making the controls-panel Tabs
mount DETERMINISTICALLY from the active scene's DFA surface set, single-sourced,
so a switch cannot leave a selected-but-unmounted surface.

---

## Authoring implications (feeds the path-forward)

1. **B4 is a SWITCH-STATE regression, not a J over-removal.** The fix must
   restore the editor on a SWITCHED-IN scene — i.e. make `TabsContent
   value="easing"` mount deterministically from the active scene's control-surface
   DFA, killing the Tabs model-value desync (shared root with B2). A wave gate
   for B4 MUST be a real interaction gate: dock-switch INTO easing, then assert
   `.easing-curve-canvas` + `.easing-trigger-label` + draggable
   `.control-point.handle` are present AND a handle-drag mutates the path — the
   exact assertions this probe runs. A fresh-load-only gate is the blindspot that
   shipped this.

2. **Secondary parity gap (a genuine, smaller part of the user's "BACK"
   request):** the standalone `EasingSidebar` lacks the live `cubic-bezier(...)`/
   `steps(...)` VALUE READOUT + copy, and the bezier-preset Select, that the
   controls-panel detail editor `TimingFunctionPanel.vue:36-81` still carries.
   The user wants "the easing selector/bezier component BACK" — the selector +
   canvas literally return once the desync is fixed; consider folding the
   readout/copy back idiomatically (NOT the J-stripped text INPUT — a read-only
   value + copy, consistent with the design language) so the curve's CSS value is
   legible/copyable again, which is the affordance J's strip cost.

3. **Couple with B1/B2 in the same wave.** The `"......"` serialize warning fires
   on the easing transport during the switch (B1), and the Tabs/surface desync is
   the FSM-reconcile family of B2. One gestalt FSM↔controls-surface↔transport
   reconcile pass resolves the shared root rather than three point-patches.
