# ROOT-CAUSE — B4 `/easing` lost the curve/timing editor

**Agent:** ROOT-CAUSE `[rc-easing-editor]` · Tranche I (dev) · 2026-06-08
**Status:** ROOT CAUSE CONFIRMED by live reproduction against the BUILT `dist/gh-pages`.
**Probes (run, kept):**
`audit/investigate/probes/rc-easing-editor-gate.mjs`,
`rc-easing-editor-deep.mjs`, `rc-easing-editor-reka.mjs`, `rc-easing-editor-vmodel.mjs`.
**Shots:** `audit/investigate/shots/rc-easing-switched.png`, `rc-easing-forced.png`,
`rc-easing-reka-reassert.png`; the sibling switch frames `b4-proper-01/03-*.png`.
**Reads:** `investigate/b4-easing-lost-editor.md`, `b5-keyframes-editor.md`,
`b2-dfa-gen-crash.md`, `b14-controls-dfa-render.md`; the J amendment
`docs/tranches/H/audit/feedback/j-easing-minimalism.md`;
`EasingScene.vue`, `EasingSidebar.vue`, `EasingSelect.vue`, `EasingCurveCanvas.vue`,
`TimingFunctionPanel.vue`, `AnimationControls.vue`, `ControlsPaneWrapper.vue`,
`AnimationControlsGroup.vue`, `controlOptionsStore.ts`, `controlSurfaceDFA.ts`,
`useEasingDemo.ts`, and **reka-ui `Tabs/TabsRoot.js` + `Tabs/TabsContent.js`**.

---

## TL;DR — the confirmed root cause (and the correction to B4's hypothesis)

B4 framed two candidate explanations; my live probes **falsify the user's premise
AND refine B4's own hypothesis**:

1. **NOT a J over-removal.** The `EasingSelect` dropdown and the editable
   `EasingCurveCanvas` bezier are STILL in the source and STILL render+work on a
   fresh `#/easing` load (verified: `data-state="active"`, 2 draggable handles,
   handle-drag mutates the path). J did not remove the selector or the curve
   editor. **The user's "BACK" is satisfied the moment the host stops hiding them.**

2. **NOT the B2 `_gen` crash, NOT the B1 `"......"` serialize warning.** My
   switch-into-easing repro fired **ZERO** `pageerror`, **ZERO** `_gen`, **ZERO**
   `"......"`. The blank sidebar is a **SILENT render gating**, independent of B1/B2.

3. **NOT a `selectedControl` model-value desync** (B4's primary hypothesis). On the
   broken switch the store reads `selectedControl === "easing"` — the value the
   `<Tabs>` is bound to is CORRECT. B4 was directionally right that this is a
   controlled-`Tabs` defect, but **mislocated** it: the store value is right; the
   desync is INSIDE reka's `useVModel`, between the store and the Tabs root's
   internal proxy.

**THE ROOT CAUSE (one line):** the easing editor lives in `TabsContent
value="easing"` under a reka `<Tabs :model-value="storedControls.selectedControl">`
whose `useVModel` **latches `passive` from `modelValue === undefined` at mount**;
on a scene SWITCH the `<Tabs>` root is created during a render tick where its
`:model-value` resolves `undefined` (the freshly-keyed superKey store hasn't been
re-pointed to `"easing"` yet / the `animation` prop is briefly unbound), so the
Tabs root takes ownership of an **internal** value that is NOT `"easing"`, the
`TabsContent`'s `isSelected = (value === modelValue)` computes **false**, and the
panel renders `data-state="inactive"` → `display:none` → **the bezier canvas +
dropdown + duration are unmounted/hidden**. The fresh path works because the
`<Tabs>` is BORN with `selectedControl === "easing"` (EasingScene sets it
synchronously at setup), so `passive:false` and the proxy is a live `computed` that
tracks the store.

---

## The decisive evidence (file:line + live numbers)

### The two reka primitives that produce the gate

**`reka-ui/dist/Tabs/TabsContent.js:35,57`** — the panel's visibility is a pure
computed off the root's model-value:
```js
const isSelected = computed(() => props.value === rootContext.modelValue.value);
// …
"data-state": isSelected.value ? "active" : "inactive",     // line 57
present:      _ctx.forceMount || isSelected.value,           // gates the slot mount
```
The easing `TabsContent value="easing"` is NOT `force-mount`, so `present` (hence
the EasingSidebar) mounts ONLY while `isSelected` is true.

**`reka-ui/dist/Tabs/TabsRoot.js:57-60`** — the model-value is a `useVModel` whose
`passive` is latched ONCE at setup:
```js
const modelValue = useVModel(props, "modelValue", emits, {
    defaultValue: props.defaultValue,
    passive: props.modelValue === void 0,   // ← latched at the FIRST render tick
});
```
`@vueuse/core` `useVModel(passive:true)` returns an **internal `ref(getValue())`**
seeded from `props.modelValue` AT MOUNT, decoupled from the parent thereafter
except via a `watch(() => props[key])`. When the latch is taken with `undefined`,
the Tabs root's notion of "active value" is self-owned and seeded wrong.

### The host that binds it

**`AnimationControls.vue:6-9`** — the controlled root:
```html
<Tabs :model-value="storedControls.selectedControl" @update:model-value="selectControl">
```
**`AnimationControls.vue:174`** — `storedControls = getStoredAnimationGroupControlOptions(animation)`
(keyed off the *animation* prop). On a switch-in the `animation` prop and/or the
re-pointed superKey store entry are not yet carrying `selectedControl === "easing"`
on the tick the `<Tabs>` first renders.

**`ControlsPaneWrapper.vue:63-99`** — the easing `TabsContent` reaches this `<Tabs>`
through the deep slot chain (App `#tabs-content` → AnimationControlsGroup →
ControlsPaneWrapper → `<AnimationControls>` `<slot name="tabs-content">`), wrapped
in `v-show="selectedAnimation == name"`. The slotted content therefore registers
with the Tabs root **a tick LATE** relative to the root's own model-value latch.

**`EasingScene.vue:31-33,55-60`** — the scene sets `storedControls.selectedControl
= "easing"` at setup and renders the editor ONLY inside `TabsContent value="easing"`.
On a fresh mount that assignment runs before the controls host's `<Tabs>` mounts,
so the latch is taken with `"easing"`. On a switch it does not win the race.

### The live discriminator (probe `rc-easing-editor-vmodel.mjs`)

| | host Tabs root | panel `data-state` | `display` | `hidden` | bezier canvas | store `selectedControl` |
|---|---|---|---|---|---|---|
| **FRESH** `#/easing` | contains easing content | **active** | block | false | **present** | `"easing"` |
| **SWITCH** cube→Easing | contains easing content | **inactive** | none | true | **absent** | `"easing"` |

Same store value, same single host root, ZERO triggers (header hidden by
`tabsExternallyManaged`), opposite panel state. `rc-easing-editor-gate.mjs`
additionally confirms: **0** new `pageerror`, **0** `_gen`, **0** `"......"` across
the switch — the blank is purely the reka `isSelected:false` gate, not a crash.

---

## WHY the gates missed it (the blindspot, verbatim class)

- Every `proof:easing-sidebar-*` gate (`-minimal`, `-normalized`, `-bezier-grown`,
  `-label-subgrid`) asserts the **FRESH-load source shape** — and on a fresh load the
  panel is `active`, so the editor is present and the gates go GREEN. The defect is
  **state-dependent**: it manifests ONLY on an in-app scene SWITCH, the exact path no
  load-time/source-shape gate exercises. This is the user's chronic warning made
  literal: *"green source-shape gates miss appearance/interaction/state; audit the
  RUNNING demo."*
- It is **silent** — no thrown error, no console line — so `proof:demo-console-clean`
  (a HOME-load console check) had nothing to catch even if it had switched scenes.
- The DFA work (`controlSurfaceDFA.ts`, B14) is CORRECT and is NOT the cause: the
  easing surface resolves and the `TabsContent` node is in the DOM — it is reka's
  `passive`-latched controlled-Tabs that refuses to mark it active. A gate that
  asserted "the DFA set is right" passes while the panel is hidden.

---

## The IDIOMATIC GESTALT fix DIRECTION (the seam, the transposition — NOT a patch)

The bug is a **controlled-component contract violation at a slot seam**, recurring
across the whole control surface (cube/amiga/square hit the same latch for their
keyframes/controls panels on switch — only easing is single-panel so it reads as
"totally blank"). The durable cure is to make the controls-panel surface mount
**deterministically from the active scene's control-surface state**, so a switch
cannot leave a selected-but-unmounted panel. Three composable moves, in order of
preference (KISS · no-legacy · no workaround):

### 1. Kill the `passive`-latch race at its source — make the `<Tabs>` born-correct on every entry (the seam)

The reka `useVModel` latch is taken at the FIRST render tick. The transposition is
to guarantee the `<Tabs>` root NEVER mounts against an `undefined`/stale
`selectedControl`. The idiomatic shape is **single-sourcing the active surface from
the W1 scene machine's control-surface DFA** rather than from a per-animation
localStorage poke that lags the swap:

- The active control surface for the current scene is a **derivable function of the
  machine** — `controlSurfacesFor(activeScene)` already gives the valid set
  (`["easing"]` for easing). The selected surface should be a **machine-projected,
  synchronously-correct** value (default to the scene's first/only valid surface)
  rather than a free `storedControls.selectedControl` that the scene mutates in
  `setup` and hopes wins the race. Bind the `<Tabs> :model-value` to **that
  projection**, so on a switch the model-value is `"easing"` on the very tick the
  root mounts — the latch is taken correct, fresh and switched paths converge.
- This is the same single-authority move the DFA already started (`AnimationControls`
  reads `machine.controlSurfaces` for the triggers/panes); extend it so the
  **selected** surface — not just the valid SET — is machine-derived. The
  `storedControls.selectedControl` poke in `EasingScene.vue:32` (and the equivalent
  per-scene pokes) then becomes redundant and is DELETED (no legacy beside the
  replacement).

### 2. Force the panel mount to track the DFA, not reka's internal latch (defense, and the simpler floor)

Where a scene has a SINGLE valid surface (easing → `["easing"]`, spring →
`["spring"]`), the `TabsContent` for it should be **unconditionally present** — there
is no other panel to switch to, so `present` should not be gated on reka's
`isSelected` race at all. The idiomatic reka escape is `force-mount` on the scene's
sole `TabsContent` (the same `force-mount` already used for the keyframes Monaco
pane at `AnimationControls.vue:69`), driven by the DFA's "this is the only/active
surface" fact. This makes the single-surface scenes (easing/spring) immune to the
latch by construction, and is the right semantic: their one panel is ALWAYS the
content.

### 3. The structural transposition (the real elegance, folds B2/B4 together)

The deeper smell is that the easing editor is buried under **two independent gates**
that both have to agree: `v-show="selectedAnimation == name"`
(ControlsPaneWrapper:63) AND reka `isSelected` on `selectedControl`. The easing
scene has no real per-animation tabbing — it is a SINGLE editor surface. The gestalt
move (matching the user's "architectural transposition for elegance/simplicity") is
to let a scene whose DFA set is a **single non-built-in surface** render its editor
**directly as the control-pane content**, bypassing the built-in `<Tabs>`/v-show
machinery entirely (that machinery exists for the cube/amiga multi-pane
controls/keyframes/timeline triad — it is overkill for easing/spring). The control
pane becomes: *if the active scene's surfaces are the built-in triad → the Tabs
host; else → mount the scene's single surface flat.* This removes the desync class
for easing/spring permanently (no Tabs, no latch, no v-show double-gate), and is the
SAME reconcile B14/B2 want (FSM↔controls-surface single authority). One pass closes
B4 AND hardens the surface for B2's family.

**Recommended:** ship **(1)** as the single-authority fix (the headline), with **(2)**
as the construction-time guarantee for single-surface scenes; **(3)** is the
stretch transposition if the wave has room — it is the most elegant and deletes the
most machinery, but (1)+(2) already make B4 a real, gated fix. **No `nextTick`
re-assert** (the EasingScene comment correctly notes the old `onMounted+nextTick`
hack was removed — re-adding it is the workaround we must NOT take).

---

## The design reconciliation (J-minimal vs "the editor BACK")

The user's two intents are NOT in conflict once the desync is fixed:

- **J wanted minimal** (no value TEXT INPUT, no `<h2>` scene title, single flat
  container, full-width duration, grown canvas) — `j-easing-minimalism.md` J1–J6.
  This is GOOD and stays.
- **The user needs to CHANGE the curve** — which the **`EasingSelect` dropdown** (34
  grouped curves incl. `cubic-bezier`) + the **editable `EasingCurveCanvas`** (2
  draggable handles, `@update:bezier-points`) already provide. They return LITERALLY
  the moment the panel un-hides. **This is a design-correction, not a revert.**

**The gestalt design for the easing editor (keep the dropdown + the editable bezier,
drop only the redundant chrome):**

1. **Keep** the `EasingSelect` dropdown — it IS the curve selector (the dropdown
   names the curve, the canvas shows it). J was right to make it the sole selector;
   no text input returns.
2. **Keep** the editable `EasingCurveCanvas` with its draggable handles — the
   "change the easing curve" affordance the user is asking for. It is already wired
   (`:editable="isBezierEditable"`, `@update:bezier-points="updateBezierPoints"`).
3. **Fold back ONE affordance J's strip cost (the legible/copyable curve value):**
   the standalone `EasingSidebar` lacks the live `cubic-bezier(…)` / `steps(…)`
   **read-only VALUE READOUT + copy** that the in-panel detail editor
   `TimingFunctionPanel.vue:36-50` still carries. Restore it as a **read-only value +
   `CopyButton`** (NOT the J-stripped editable text INPUT — a passive, copyable
   readout, consistent with the design language). This is the part of "the easing
   selector/bezier component BACK" that is a genuine, smaller parity gap, and it
   honors J (no text field) while giving back the curve's CSS value.
4. **Reconcile the TWO bezier editors into ONE component.** `EasingSidebar` (the
   rail) and `TimingFunctionPanel` (the in-panel cube/amiga detail) BOTH host an
   `EasingCurveCanvas` + a curve picker + (panel-only) a readout/copy + a preset
   Select — duplicated, divergent chrome. The idiomatic move is a **single
   `EasingEditor` component** (dropdown + editable canvas + read-only readout/copy)
   that BOTH hosts mount, so the rail and the detail panel are the same editor with
   the same affordances — the curve-change capability is identical everywhere, and
   J's minimal chrome is the one shared skin. This kills the parity drift at its
   root (the reason the readout was "lost" in the rail but not the panel).

So the wave's B4 deliverable is: **(a)** the desync fix from the section above
(the editor un-hides on switch), **(b)** fold the read-only value+copy back into the
shared easing editor, **(c)** unify the two bezier hosts onto one `EasingEditor`
component. The user gets the selector + the editable bezier + a copyable value,
minimal-chrome, everywhere — fresh AND switched-in.

---

## The REAL gate this needs (feeds the wave gate-regime overhaul)

A genuine **interaction** gate, not a source-shape check:

> Playwright: load `#/cube`, dock-switch INTO `Easing`, then assert
> `.easing-curve-canvas` is present AND `display !== none` AND its host
> `[role="tabpanel"]` is `data-state="active"`; assert ≥2 `.control-point.handle`
> present AND a handle-drag MUTATES the bezier path `d`; assert the
> `.easing-trigger-label` dropdown is present and changing it re-renders the curve;
> assert the read-only value readout + copy are present. Run the SAME assertions for
> the return path (Easing→Amiga→Easing) and for spring's single-surface panel. Zero
> `pageerror`/`_gen`/`"......"` throughout.

This is exactly the property `rc-easing-editor-vmodel.mjs` / `-gate.mjs` exercise —
the gate that, had it existed, would have caught the `data-state="inactive"` on
switch that every fresh-load gate certified GREEN.
