# Tranche K — Audit Lane: live-dock-tabs-selects.md

**Scope:** U-K12 (tabs-vs-pills question; find the "awful top tabs") +
U-K16 (single-option-dropdown totality sweep — the U4 rule must be total).

**Auditor:** subagent lane, 2026-06-11  
**Branch:** tranche-j-dev @ 4f1fc4c  
**Files read (load-bearing):**
- `demo/spring/SpringSidebar.vue`
- `demo/@/components/custom/animation-controls/controls/AnimationControls.vue`
- `demo/@/components/custom/animation-controls/controls/tab-trigger.css`
- `demo/@/components/custom/animation-controls/controls/AnimationControlsControls.vue`
- `demo/@/components/custom/animation-controls/controls/LayerConfigPanel.vue`
- `demo/@/components/custom/dock/ChromeDock.vue`
- `demo/@/components/custom/animation-controls/TransportDock.vue`
- `demo/@/components/custom/animation-controls/stores/controlSurfaceDFA.ts`
- `demo/easing/EasingSidebar.vue`
- `demo/easing/EasingTarget.vue`
- `demo/@/components/custom/EasingSelect.vue`
- `demo/app/scenes/CubeScene.vue`
- `demo/playground/App.vue`
- `demo/playground/usePlaygroundAnimations.ts`
- `demo/@/components/custom/asset-manager/AssetPropertiesPanel.vue`
- `node_modules/@mkbabb/glass-ui/dist/components/custom/tabs/SegmentedTabs.vue.d.ts`
- `src/animation/constants.ts`

---

## §1 — THE TABS LANDSCAPE (U-K12)

### 1.1 The "awful top tabs" — the built-in editor triad in AnimationControls

**Location:** `demo/@/components/custom/animation-controls/controls/AnimationControls.vue:37–67`  
**Skin:** `tab-trigger.css` imported globally at line 167 of the same file.  
**Variant:** `tab-trigger-pill` — a pill shape with `border-radius: var(--radius-lg)` and
a muted `color-mix(… 8%, transparent)` active background.  
The trigger font is `var(--font-serif)` at `var(--type-prose, 1.125rem)` / `1.75rem` line-height
(`tab-trigger.css:22–30`). That is the DISPLAY/SERIF register, oversized for
a tab-switcher inside a controls panel.

**What the user sees:** The three built-in tabs ("Controls / Keyframes / Timeline") and any
slotted scene tabs ("Matrix Controls") appear inside the controls pane, in a `glass-wash
rounded-panel` header pill container at `AnimationControls.vue:44`. They are serialized as
reka `<TabsTrigger>` elements, styled entirely by the `tab-trigger-pill` class from
`tab-trigger.css`. The typography is serif at 1.125rem — conspicuously large and in the
display voice, mismatched to the mono-small / text-small idiom the surrounding controls use.
The `data-state=active` treatment is a faint `color-mix(…8%…)` background fill — barely
perceptible, NOT a proper pill indicator.

**Why the user says "awful":** The triggers use `var(--font-serif)` (line 28 of
`tab-trigger.css`), which is Instrument Serif, the display face. Inside the compact controls
panel this reads as decorative noise, not a navigation affordance. There is no filled pill or
ink underline on the active trigger — the 8% background tint on the pill variant barely reads
as selected. The `tab-trigger-underline` variant (`CubeScene.vue:147` — "Matrix Controls") is
more legible (a 2px border-bottom), but mixed with the pill triggers it is visually
inconsistent.

**The chrome-dock version of the same control (the CORRECT idiom):**
`ChromeDock.vue:199–221` uses a `<Select>` / `DockSelectTrigger` — a dropdown pill with
icon + `SelectValue` — for the same "which control tab" choice. That is the dock idiom, and
it reads correctly. The problem is the IN-PANEL tab host, not the dock.

**Verdict (U-K12):** The in-panel tab strip in `AnimationControls.vue` is the "awful top
tabs" the user identified. It is a reka `<Tabs>` / `TabsList` / `TabsTrigger` row styled
with `font-serif` at `1.125rem` and an anemic active state. The user's preferred replacement
— "pills if tabs at all, likely dock-dropdown items instead" — maps to:

- **Option A — PILL STRIP:** keep reka `<TabsTrigger>` but re-skin with `font-mono` or
  `font-sans` at `text-mono-small` / `text-small`, a solid foreground active pill (e.g.
  glass-ui `SegmentedTabs variant="pill"` already carries exactly this chrome), and a visible
  resting indicator.
- **Option B — DOCK DROPDOWN (preferred by user):** replace the in-panel header row with
  the same `<Select>` / `DockSelectTrigger` idiom the top dock already uses. This means
  merging the in-panel tab header into the dock-managed selector, hiding the in-panel
  `TabsList` entirely when `tabsExternallyManaged` is true (it is already hidden via
  `v-if="!tabsExternallyManaged"` at line 44 of `AnimationControls.vue`) — i.e. Option B is
  ALREADY the architecture when the dock is present. The in-panel tab strip is only shown
  when the dock is NOT managing tabs (i.e. a standalone host — the playground
  `EditorShell`). So the "awful" visual arises ONLY on the standalone path and/or when the
  dock is collapsed.

**Deeper reading:** `AnimationControls.vue:44` guards the `TabsList` header with
`v-if="!tabsExternallyManaged"`. In the App shell the dock IS the tab selector and
`tabsExternallyManaged = true` via `TABS_EXTERNALLY_MANAGED_KEY` injection
(`AnimationControls.vue:213`). So the in-panel strip renders only on the standalone
playground path. HOWEVER, U-K12 likely refers to what the user SEES in the main app when
they look at the top of the controls panel — which suggests they may be seeing the scene's
slotted extra tab triggers that ARE injected into the `<slot name="tabs-trigger">` even in
the externally-managed case, e.g. CubeScene's "Matrix Controls" `tab-trigger-underline`
trigger. The `TabsList` header div is still rendered for these slotted items (the `v-if`
only suppresses the BUILT-IN triggers, not the slot). Actually, re-reading line 43–67: the
entire `<div>` containing `<TabsList>` is wrapped under `v-if="!tabsExternallyManaged"` at
line 44. So slotted scene-tab triggers render ONLY on the standalone path.

**Revised conclusion:** The "awful top tabs" seen in the main app are the `<SegmentedTabs>`
in SpringSidebar (the view/artifact switchers visible in the Spring scene's control panel),
NOT the reka `<Tabs>` header (which is dock-hidden in the main app). The SpringSidebar
`SegmentedTabs` uses `variant="segmented"` (the muted pill-slider) and `variant="underline"`
for the artifact fork. These are in-pane controls, styled in glass-ui's SegmentedTabs
primitive — but the FONT is `var(--font-serif)` at the `text-small` / `text-mono-small`
equivalent, because the `tab-trigger-base` rule in `tab-trigger.css` leaks serif onto ALL
`.segmented-tab` elements (the CSS is non-scoped and global). The SegmentedTabs primitive
receives the `tab-trigger-base` class only if explicitly applied, but the global
`[data-state="active"][role="tabpanel"]` rule from `tab-trigger.css` also fires on ANY reka
tabpanel in the page, potentially touching SegmentedTabs internals.

**Both sites are P1:**

| Site | File:line | Problem |
|------|-----------|---------|
| SpringSidebar view switcher | `demo/spring/SpringSidebar.vue:29–34` | `SegmentedTabs variant="segmented"` — 2 options, correct count, but visual register inconsistent with user expectation of pill/chip |
| SpringSidebar artifact fork | `demo/spring/SpringSidebar.vue:110–115` | `SegmentedTabs variant="underline"` — reads as a subdued sub-header; user wants "dock-dropdown items instead" |
| AnimationControls tab strip | `demo/@/components/custom/animation-controls/controls/AnimationControls.vue:44–67` | `tab-trigger-base` uses `var(--font-serif)` at `1.125rem` — display voice in a control panel; renders on standalone path only |
| tab-trigger.css font choice | `demo/@/components/custom/animation-controls/controls/tab-trigger.css:28–29` | `font-family: var(--font-serif); font-size: var(--type-prose)` — wrong register for a compact tab switcher |
| CubeScene "Matrix Controls" | `demo/app/scenes/CubeScene.vue:147` | `tab-trigger-underline` — underline style is inconsistent with surrounding pill triggers; only renders on standalone path |

---

## §2 — SINGLE-OPTION DROPDOWN SWEEP (U-K16 / U4 rule totality)

The U4 rule (coined J.W7c): a dropdown/select with ≤1 option is dead chrome — render the
sole label as a static text or suppress the dropdown entirely. The TransportDock already
applies this rule for the animation name select (`TransportDock.vue:39`,
`v-if="animationNames.length > 1"`). The sweep below checks every other select/dropdown
site in the demo.

### 2.1 ChromeDock — Controls Tab Select (SINGLE-OPTION VIOLATION)

**Location:** `demo/@/components/custom/dock/ChromeDock.vue:199–221`  
**Guard:** `v-if="hasControlPanel"` where `hasControlPanel = allControlTabs.value.length > 0`.  
**The bug:** `hasControlPanel` only gates on ZERO tabs. When exactly ONE tab exists (easing
scene → `['easing']`; spring scene → `['spring']`), the `<Select>` renders with a single
`<SelectItem>` — a dropdown that opens onto the sole item the trigger already shows. That is
exactly the U4 dead-chrome case.

**Evidence:** `controlSurfaceDFA.ts:76–85`:
```
easing: ["easing"],
spring: ["spring"],
```
For these two scenes `allControlTabs.value` has exactly one element. The `<Select>` at
`ChromeDock.vue:199` renders with `v-if="hasControlPanel"` (true — 1 > 0), produces a
`DockSelectTrigger` with one `<SelectItem>` inside, and the user can open it to see exactly
the value already displayed. No selection is possible.

**The fix:** change `v-if="hasControlPanel"` to `v-if="allControlTabs.value.length > 1"` at
`ChromeDock.vue:200` and render the single-tab label as static text (mirroring
`TransportDock.vue:91–95`'s single-animation name pattern).

**Severity:** P1 — the U4 rule is explicitly documented as "total" (U-K16), and this is the
most prominent dock control.

### 2.2 TransportDock — Animation Name Select (ALREADY GUARDED — green)

**Location:** `demo/@/components/custom/animation-controls/TransportDock.vue:38–95`  
**Guard:** `v-if="animationNames.length > 1"` at line 39 — exact U4 gate.  
`v-else` at line 92 renders the static label when only one animation exists.  
**Status:** CORRECT. No action needed.

### 2.3 AnimationControlsControls — Direction Select (safe — 4 static options)

**Location:** `demo/@/components/custom/animation-controls/controls/AnimationControlsControls.vue:51–62`  
**Items:** `DIRECTIONS` — `["normal", "reverse", "alternate", "alternate-reverse"]` at
`src/animation/constants.ts:17–22`. Always 4 options, never runtime-dynamic.  
**Status:** OK — fixed list of 4, no single-option risk.

### 2.4 AnimationControlsControls — Fill Mode Select (safe — 4 static options)

**Location:** `demo/@/components/custom/animation-controls/controls/AnimationControlsControls.vue:63–73`  
**Items:** `FILL_MODES` — `["none", "forwards", "backwards", "both"]` at
`src/animation/constants.ts:24`. Always 4.  
**Status:** OK.

### 2.5 LayerConfigPanel — Blend Mode Select (safe — 3 static options)

**Location:** `demo/@/components/custom/animation-controls/controls/LayerConfigPanel.vue:8–17`  
**Items:** `BLEND_MODES = ["replace", "add", "weighted"]` — line 69. Always 3.  
**Status:** OK.

### 2.6 EasingSidebar — Jump Term Select (safe — 4 static options, conditional render)

**Location:** `demo/easing/EasingSidebar.vue:63–72`  
**Items:** `JUMP_TERMS = ["jump-start", "jump-end", "jump-none", "jump-both"]` — line 109.
Always 4 options; the entire `<template v-if="demo.isSteps.value">` block is only shown when
the selected easing is a `steps()` function.  
**Status:** OK.

### 2.7 EasingTarget — View Mode Select (safe — N+2 options always > 1)

**Location:** `demo/easing/EasingTarget.vue:60–84`  
**Items:** "Singular" + separator + one item per `EASING_GROUPS` family + separator + "All".
`easingGroups.ts` contains multiple families; the list is always > 1.  
**Status:** OK.

### 2.8 EasingSelect — Timing Function Select (safe — multiple groups always)

**Location:** `demo/@/components/custom/EasingSelect.vue:29–84`  
**Items:** Iterated from `EASING_GROUPS` — multiple families, dozens of items.  
**Status:** OK.

### 2.9 AssetPropertiesPanel — Animation Binding Select (POTENTIAL SINGLE-OPTION)

**Location:** `demo/@/components/custom/asset-manager/AssetPropertiesPanel.vue:114–131`  
**Guard:** `v-if="animationNames && animationNames.length > 0"` at line 114.  
**The issue:** The select renders when `animationNames.length >= 1`. When `animationNames`
has exactly 1 item the dropdown opens to show "None" + one named animation — exactly 2
items total (the hard-coded `__none__` option plus the one name). This is arguably OK
(the "None" option makes it a genuine 2-option choice). However, if the future introduces a
strict U4 interpretation (no select unless > 1 MEANINGFUL choice), the "None" + 1
animation case could be collapsed to a checkbox or toggle.  
**Status:** BORDERLINE P2 — technically 2 items (None + 1 name), but the "None" anchor is a
real option. Verify in context; not a hard violation of the U4 rule as currently written.  
This is the `playground/` app only; not in the main SPA.

### 2.10 ChromeDock — Scene Select (safe — always > 1 scene)

**Location:** `demo/@/components/custom/dock/ChromeDock.vue:226–262`  
**Items:** `homeSceneId` + all `scenes[]`. The scene list is always the full 7-scene roster
(cube/amiga/square/easing/spring/sequence/motion-path). Always > 1.  
**Status:** OK.

### 2.11 SpringSidebar — SegmentedTabs VIEW_OPTIONS (safe — 2 options, always)

**Location:** `demo/spring/SpringSidebar.vue:29–34`, `VIEW_OPTIONS` at line 156.  
**Items:** `["solver", "discrete"]` — always 2, static.  
**Status:** OK — 2 options is the minimum valid use of a segmented switcher.

### 2.12 SpringSidebar — SegmentedTabs ARTIFACT_OPTIONS (safe — 2 options, always)

**Location:** `demo/spring/SpringSidebar.vue:110–115`, `ARTIFACT_OPTIONS` at line 198.  
**Items:** `["linear", "keyframes"]` — always 2, static.  
**Status:** OK.

### 2.13 SegmentedTabs responsive collapse (glass-ui internal — no single-option risk from demo)

Per `SegmentedTabs.vue.d.ts` the `responsive` prop causes the strip to collapse to a
`<Select>` below a breakpoint. Neither the view switcher nor the artifact fork in
`SpringSidebar.vue` passes `responsive` — they never collapse to a select. No violation.

---

## §3 — SUMMARY TABLE (all single-option sites)

| # | Site | File:line | Status | Severity |
|---|------|-----------|--------|----------|
| S1 | ChromeDock controls-tab Select — single-surface scenes (easing/spring) render a 1-item dropdown | `ChromeDock.vue:199–221` | **VIOLATION** — missing `> 1` guard | P1 |
| S2 | TransportDock animation-name Select — already guarded `> 1` | `TransportDock.vue:38–95` | OK | — |
| S3 | AnimationControlsControls direction Select — 4 static items | `AnimationControlsControls.vue:51–62` | OK | — |
| S4 | AnimationControlsControls fill-mode Select — 4 static items | `AnimationControlsControls.vue:63–73` | OK | — |
| S5 | LayerConfigPanel blend-mode Select — 3 static items | `LayerConfigPanel.vue:8–17` | OK | — |
| S6 | EasingSidebar jump-term Select — 4 static items, conditional mount | `EasingSidebar.vue:63–72` | OK | — |
| S7 | EasingTarget view-mode Select — N+2 options | `EasingTarget.vue:60–84` | OK | — |
| S8 | EasingSelect timing-function Select — dozens of items | `EasingSelect.vue:29–84` | OK | — |
| S9 | AssetPropertiesPanel animation-binding Select — "None" + 1 name when playground has 1 anim | `AssetPropertiesPanel.vue:114–131` | Borderline | P2 |
| S10 | ChromeDock scene Select — always > 1 scene | `ChromeDock.vue:226–262` | OK | — |
| S11 | SpringSidebar VIEW_OPTIONS SegmentedTabs — 2 static items | `SpringSidebar.vue:29–34` | OK | — |
| S12 | SpringSidebar ARTIFACT_OPTIONS SegmentedTabs — 2 static items | `SpringSidebar.vue:110–115` | OK | — |

---

## §4 — TABS TYPOGRAPHY ROOT CAUSE

The `tab-trigger-base` rule in `tab-trigger.css` (non-scoped, global, imported by
`AnimationControls.vue`) pins:
```css
font-family: var(--font-serif);   /* line 28 */
font-size: var(--type-prose, 1.125rem);  /* line 26 */
line-height: 1.75rem;             /* line 27 */
```
This is the Instrument Serif display face at 1.125rem. The standalone
`playground/App.vue` renders the full `<TabsList>` + `<TabsTrigger>` row with this style
(the "Assets" tab trigger at `playground/App.vue:8`, which also carries
`tab-trigger-base tab-trigger-pill`). The main app ALSO shows this via CubeScene's "Matrix
Controls" trigger (`CubeScene.vue:147`) on the standalone `EditorShell` path.

The SegmentedTabs in SpringSidebar are NOT touched by `tab-trigger-base` (they don't carry
that class), but the spring panel's view switcher labels ("Live solver" / "Discrete
transition") are at whatever size SegmentedTabs defaults to from glass-ui 3.11.2.

---

## §5 — FOLD TABLE

| Finding | Severity | Seam | Suggested Wave-class |
|---------|----------|------|----------------------|
| ChromeDock controls-tab Select renders as 1-item dropdown for easing/spring scenes (U4 rule not total) | P1 | `ChromeDock.vue:200` — change `hasControlPanel` to `allControlTabs.value.length > 1`; render static label in `v-else` (mirror `TransportDock.vue:92–95`) | K-fast / K.W1 (single-line guard fix, no design work) |
| AnimationControls tab strip uses serif display face at 1.125rem — wrong register for a compact tab switcher | P1 | `tab-trigger.css:26–29` — retype to `var(--font-sans)` or `var(--font-mono)` at `text-mono-small`; also update `tab-trigger-pill` active state to a more visible filled pill | K.W_tabs (U-K12 tabs-vs-pills; pairs with U-K6/U-K10 font pass) |
| SpringSidebar SegmentedTabs variant="segmented" — user prefers pills or dock-dropdown items | P2 | `SpringSidebar.vue:29–34` — switch `variant` to `"pill"` or replace with a dock-dropdown item-style Select; the two-option view switcher is a genuine 2-option choice so the count is fine | K.W_spring-ui (U-K11/U-K12 spring UI wave) |
| SpringSidebar artifact SegmentedTabs variant="underline" — sub-section fork header reads as an unlabelled divider | P2 | `SpringSidebar.vue:110–115` — use `variant="pill"` or convert to a radio-toggle pair for the linear/keyframes fork | K.W_spring-ui |
| AssetPropertiesPanel animation-binding Select renders for animationNames.length === 1 (playground only; "None" + 1 item) | P2 | `AssetPropertiesPanel.vue:114` — guard with `animationNames.length > 1` if U4 is made total; otherwise the None option makes it a real choice | K.W_playground (low-priority, playground only) |

---

*Audit complete. No source, test, gate, or CI files were modified.*
