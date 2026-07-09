# Lane 20 — glass-ui consumption + gaps

> Surface: VERDICT #18 (the KfPillTabs / "wtf are most of these items… why aren't
> these just glass-ui components?" catalogue) + #27 ("Leverage proper, and the
> latest, glass-ui components for all items when befitting. Delineate our gaps, and
> glass-ui's gaps — glass-ui is in active development with BG/BH forthcoming").
> Read shots: `owner-review/shots/15.png` (the spring preset cells + hand-rolled
> preset-track balls), `owner-review/shots/16.png` (the `Live solver │ Discrete
> transition` KfPillTabs strip).
>
> Method: censused the REAL 4.0.1 export surface of `node_modules/@mkbabb/glass-ui`
> (90 `exports` subpaths + `typesVersions`), read each candidate `.d.ts` to its
> props, and read the COMPILED dist (`dist/tabs.js`, `dist/drawer.js`) to verify
> claims against the CONSUMED artifact, not the source branch.

---

## Headline

**The S impl drive never resolved the two glass-ui asks booked in Tranche Q (GU-Q1
aria guard, GU-Q2 dock-layer keepalive) — glass-ui never published them, the tree
still installs 4.0.1 — so THREE glass-ui-gap workarounds survive into T
(`KfPillTabs`, `usePlayActuation`, the `MbabbMenu` pointerdown-synthesis), and they
are precisely the "why isn't this a glass-ui component" the owner flagged; meanwhile
the ONE big pure-consumption win is sitting unclaimed: glass-ui 4.0.1 ALREADY ships
the exact `Drawer mode="live-behind"` peek/half/full bottom sheet the demo
hand-rolls in ~350L, and it is spring-driven by keyframes.js's OWN `SpringProgress`,
so the swap preserves the dogfood transitively.**

---

## 0. The 4.0.1 census — what glass-ui actually ships (so "gap" claims are honest)

glass-ui 4.0.1 exports **90 subpaths**. The ones that bear on kf hand-rolls:

| glass-ui subpath | Export | Relevance to a kf hand-roll |
|---|---|---|
| `./tabs` | `SegmentedTabs` (`variant: pill\|underline`, `orientation`, `responsive`, `draggable`, `SegmentedTabOption{label,value,icon?,disabled?,tooltip?}`) | **KfPillTabs** (shot 16) |
| `./dock` | `GlassDock, DockIconButton, DockSelectTrigger, DockDropdownTrigger, **DockSeparator**, DockRail, DockSection, useDockContext, useLayerTransition, useDockOrientationMorph…` | the hand-rolled `<div class="dock-separator">` |
| `./drawer` | `Drawer` (`mode: modal\|live-behind`, `direction`, `snapPoints`, `activeSnapPoint`), `DrawerContent` (`showOverlay`, `surface`), `DrawerHeader/Footer/Title/…`, `useDrawerSnap` | **the entire mobile bottom sheet** |
| `./sheet` | `Sheet, SheetContent/Header/Title/…` (reka side-sheet) | (modal side variant — not the peek sheet) |
| `./slider` · `./labeled-field` | `Slider` · `LabeledSlider` | already consumed (SpringSidebar) |
| `./controls` | `DarkModeToggle` | consumed (MbabbMenu) |
| `./icon-tooltip` · `./tooltip` · `./status-dot` · `./metric-badge` · `./header-ribbon` · `./instrument-chassis` | consumed across scenes | — |

**Current consumption is already broad and mostly idiomatic** — root imports resolve
`Card`×14, `Button`×11, `CardContent`×8, `Separator`×4, `Slider`×3, plus
`./dock`, `./forms`, `./labeled-field`, `./icon-tooltip`, `./metric-badge`,
`./status-dot`, `./tabs`. The demo is NOT broadly under-consuming glass-ui. The
problem is a small set of **specific, load-bearing hand-rolls**, three of which
exist ONLY because two glass-ui asks were never published, and one big one that is
pure unclaimed consumption.

---

## 1. The three surviving glass-ui-gap workarounds (the root of VERDICT #18)

Tranche Q authored `docs/tranches/Q/KF-TO-GLASSUI-Q.md` with GU-Q1 (SegmentedTabs
pill `aria-orientation`-on-`role=group` guard) and GU-Q2 (dock collapse-crossfade
layer keepalive). **VERIFIED against the consumed dist that NEITHER shipped:**

- `node_modules/@mkbabb/glass-ui/dist/tabs.js:305-306` still emits, on the DEFAULT
  pill variant:
  ```js
  role: I.value ? "tablist" : "group",          // I = variant==="underline"; pill ⇒ "group"
  "aria-orientation": L.value ? "vertical" : "horizontal",   // UNCONDITIONAL — emitted on role=group too
  ```
  i.e. the prohibited `aria-orientation` on `role=group` (WAI-ARIA 1.2 §6.3) is
  STILL rendered. `scripts/proof-glassui-aria-ask.mjs:111` confirms this gate is
  parked PENDING because "the installed dist/tabs.js emits `aria-orientation`
  UNCONDITIONALLY on `role=group`."
- `package.json:274` still pins `"@mkbabb/glass-ui": "~4.0.0"` → 4.0.1.

Because those asks are unresolved, the demo carries three hand-rolls the S drive
introduced to dodge them — and they read exactly like the "kf-prefixed, why-isn't-
this-glass-ui" cruft the owner rejected:

| Workaround (file) | Exists to dodge | LOC | Owner hit |
|---|---|---|---|
| `demo/@/components/custom/KfPillTabs.vue` (121L) + `useKfPillTabs.ts` (90L) | GU-Q1: pill emits prohibited `aria-orientation`; P-inv-28 forbids re-carrying the `:aria-orientation="undefined"` suppress a 9th tranche (`KfPillTabs.vue:1-12`) | 211 | **#18** ("KfPillTabs.vue?? KF? Pills?") |
| `usePlayActuation` in `TransportDock.vue:315-359` (the DM-1 CONTINGENCY KILL — pointerup/keyup disjoint actuation) | GU-Q2: dock collapse-crossfade strands the synthesized `click`; `glassCaps.dockStrandKeepalive === false` | ~45 | #4 (dock jank family) |
| `MbabbMenu.vue:180-199` (`onMbabbTriggerPointerdown` synthesizes reka's click, kills the native one) | `DockDropdownTrigger` opens on **click** while `DockSelectTrigger` opens on **pointerdown**; the press-scale reflow (`scale:.96`) drops the native click | ~35 | #6 (dock cluster) |

All three are honest, well-documented dodges — but they are the tax of glass-ui not
having published the asks. **The T posture is: escalate GU-Q1/GU-Q2 in the BG/BH
letter (§4), and when they land, DELETE all three** (the delete edges are already
specified in the Q letter; the gates already exist —
`proof:workaround-deletion` S1/S2, `proof:glassui-aria-ask`,
`proof:dock-popover-opens`, `proof:single-toggle`).

---

## 2. The swap list (hand-roll → glass-ui component)

### 2a. `<div class="dock-separator">` → `DockSeparator` — READY NOW, zero blocker

5 sites (`ChromeDock.vue:217,268,309`, `TransportDock.vue:119,161`) hand-roll a
vertical hairline that `@mkbabb/glass-ui/dock` already exports as **`DockSeparator`**
(confirmed in `dock/index.d.ts`). Pure duplication. The swap also lets the
home-screen "superfluous dividing line" (VERDICT #6) be elided by a `v-if` on the
real component instead of a bespoke div — and folds a `proof:no-dup-utility` risk.
**No API delta, no glass-ui ask.**

### 2b. The mobile bottom sheet → `Drawer mode="live-behind"` — READY NOW, the big win

The demo hand-rolls the ENTIRE peek/half/full mobile sheet:
`ControlsPaneWrapper.vue` (sheet host) + `SheetGrabHandle.vue` (91L) +
`useSheetGesture.ts` (88L) + `useSheetSpring.ts` (87L) + `useSheetState.ts` (78L) +
the sheet half of `ControlsPaneWrapper.css` (302L). glass-ui 4.0.1's **`Drawer`**
is the exact article (`drawer/index.d.ts`, `constants.d.ts`):

- `mode="live-behind"` = the non-modal peek/half/full bottom sheet: reka
  `:modal="false"` (no focus trap, page-behind stays interactive) +
  `shouldScaleBackground:false` — the demo's exact requirement (a sheet over a live
  subject stage).
- `direction="bottom"` resolves the **`[0.12, 0.5, 1]` peek/half/full snap ladder**
  natively (`resolveDefaultSnapPoints`); `useDrawerSnap` owns the grab-handle drag,
  the velocity-flung detent advance (`DRAG_RELEASE_VELOCITY`), and the a11y —
  everything `useSheetGesture`/`useSheetState` re-implement.
- **The dogfood is PRESERVED, transitively.** `dist/drawer.js` literally does
  `import { SpringProgress as A } from "@mkbabb/keyframes.js"` and its
  `DRAWER_SNAP = {response:0.4, dampingFraction:0.82}` drives `--glass-drawer-t` off
  a kf `SpringProgress` (vs the demo's `useSheetSpring` `{0.3, 0.8}` → `--sheet-t`).
  So swapping does NOT abandon `proof:drawer-spring`'s "the spring engine springs
  its own chrome" mandate — the sheet is STILL moved by kf's `SpringProgress`, just
  through glass-ui's Drawer facade. `proof:drawer-spring` re-points from "the demo
  constructs `new SpringProgress`" to "the sheet is `<Drawer>` whose
  `--glass-drawer-t` is spring-driven (transitively kf's `SpringProgress`)".

Net: **delete ~350L of bespoke gesture/spring/state + ~200L of the sheet CSS** for a
glass-ui component that is better tested, focus-correct, and snap-detented. This is
the single highest-leverage consumption move on the board and it is available TODAY
with no ask.

### 2c. `KfPillTabs` → `SegmentedTabs` — BLOCKED (GU-Q1 + a deeper semantics gap)

Both KfPillTabs consumers — `AnimationControls.vue:74` (the controls/keyframes/
timeline panel switcher) and `SpringSidebar.vue:160` (shot 16's `Live solver │
Discrete transition`) — want a **pill LOOK with panel-switcher (tablist)
SEMANTICS**. glass-ui's SegmentedTabs COUPLES material to role
(`tabs.js:305`): `pill ⇒ role=group` (toggle-button semantics),
`underline ⇒ role=tablist`. So today the demo can have pill-look+group-semantics
(with the prohibited aria) OR underline-look+tablist-semantics — never
pill-look+tablist-semantics, which is exactly what a panel switcher wants
(`AnimationControls.vue:43` calls it "the canonical `<SegmentedTabs>` (panel-nav
`role=tablist`/`tab`)"). **GU-Q1 alone does NOT unblock this** — it only stops pill
from emitting `aria-orientation`; pill stays `role=group`. The clean swap needs
glass-ui to decouple material from role (§4, BG-3). The `SegmentedTabOption` shape is
already a superset of `KfPillTabOption` (adds `icon`,`tooltip`), and `v-model` +
`orientation` are byte-identical, so the swap is trivial ONCE the semantics gap is
closed. `CubeScene` already proves the underline path works (`<SegmentedTabs
variant="underline">`, a legal tablist).

### 2d. `GestureLegend.vue` → DELETE (no swap)

VERDICT #8 rejects the S.G3 gesture-legend layer wholesale ("remove all elements
like this"). glass-ui has no "gesture legend" primitive and none is wanted — the
recommendation is deletion, plus retiring `proof:gesture-manifest` and the
`data-gesture-tell` census contract that keeps it structurally pinned. (Cross-ref
lane 07 prune-triage.)

### 2e. `CopyButton.vue` → keep as a kf dogfood (base on glass-ui `Button`)

glass-ui ships no copy-button; CopyButton is a legit bespoke leaf that dogfoods kf's
own engine for the clipboard-icon swap (`loadAnimationEngine()` +
`CSSKeyframesAnimation`). Keep it, but re-base its bare `<button>` on glass-ui
`Button variant="ghost"` for token consistency (VERDICT #24 font/size consistency).
Low priority.

---

## 3. KF-side gaps glass-ui 4.0.1 CANNOT fill today

1. **GU-Q1 — SegmentedTabs pill `aria-orientation`-on-`role=group` guard: unpublished
   for TWO tranches** (Q→S). Confirmed in the consumed dist (`tabs.js:306`). Blocks
   killing `KfPillTabs`.
2. **The pill-material ↔ tablist-role coupling** (`tabs.js:305`). Even after GU-Q1,
   there is no way to get a pill-look panel switcher with `role=tablist` + roving
   tabindex — which is what `useKfPillTabs` hand-rolls. glass-ui gap, distinct from
   GU-Q1.
3. **GU-Q2 — dock collapse-crossfade layer keepalive: unpublished.**
   `glassCaps.dockStrandKeepalive === false`; blocks deleting `usePlayActuation`.
4. **`DockDropdownTrigger` opens on `click`, not `pointerdown`** — asymmetric with
   `DockSelectTrigger` (pointerdown). Under the press-scale reflow this drops the
   click; `MbabbMenu.vue:127-199` synthesizes it. glass-ui gap.
5. (Low) **No value-sparkline / mini-progress primitive** for the spring preset-cell
   tracks + ball (shot 15, `SpringSidebar.vue` `.preset-track`/`.preset-ball`).
   glass-ui has `border-progress`/`pulse`/`animated-digit` but nothing that plots a
   scalar as a filled track with a settling ball. Scene-specific; a defensible
   hand-roll, not a T-blocker — but named so the delineation is honest.

Note: the "dock icon renders as an unreadable blur-blob" (VERDICT #4, shot 04) is
plausibly a `GlassDock` collapsed-morph / backdrop-filter rendering issue in the
consumed dist, but it is an appearance/rendering axis owned by **lane 08 (dock
system)** — flagged here for cross-reference, not owned.

---

## 4. The BG/BH glass-ui ASK letter (owner-domain handoff content — kf never writes glass-ui)

Per inv-16 (kf writes only keyframes.js; every cross-repo need is a dispatch), the T
deliverable is the CONTENT of a `docs/tranches/T/KF-TO-GLASSUI-BG.md` re-issue. It
**escalates** the two unshipped Q asks (now 2 tranches stale and now
owner-visible via VERDICT #18) and adds two:

- **BG-1 (re-issue + ESCALATE GU-Q1):** publish the SegmentedTabs pill
  `aria-orientation` guard (`SegmentedTabs.vue:406` on `prototype/liquid-dock`,
  already authored — carve a BC-only patch, not the entangled liquid-dock work).
  Discharge: kf `proof:glassui-aria-ask` flips PENDING→GREEN on re-pin.
- **BG-2 (re-issue GU-Q2):** dock collapse-crossfade `.dock-layer` keepalive so the
  play control's layer survives the crossfade without a swallowed pointerdown.
  Discharge: `glassCaps.dockStrandKeepalive` + `proof:live-session` S5.
- **BG-3 (NEW — the real KfPillTabs cure):** decouple SegmentedTabs MATERIAL from
  ARIA ROLE — a `role`/`semantics` axis (or a `pill` + `as="tablist"`) so a
  **pill-look panel switcher with `role=tablist` + arrow-key roving-tabindex** is a
  glass-ui component. This folds `useKfPillTabs` (the roving-tabindex core) upstream
  and lets kf delete BOTH `KfPillTabs.vue` + `useKfPillTabs.ts`. glass-ui's
  `SegmentedTabs` DRAG-MORPH work shows the indicator engine already spans both
  materials; this is a role attribute + keyboard-nav axis, not a new component.
- **BG-4 (NEW):** `DockDropdownTrigger` pointerdown-open parity with
  `DockSelectTrigger` (or a `trigger-action="pointerdown"` prop) — kills the
  `MbabbMenu` click-synthesis. Discharge: `proof:dock-popover-opens` /
  `proof:single-toggle` with the synthesis removed.

BG-1/BG-2/BG-4 are non-breaking; BG-3 is additive (a new opt-in on an existing
component). All four carry existing born-RED kf gates, so the consume-and-delete is
oracle-bound.

---

## T recommendations

1. **Consume glass-ui `Drawer mode="live-behind"` for the mobile sheet.** Scope:
   replace `SheetGrabHandle` + `useSheetGesture`/`useSheetSpring`/`useSheetState` +
   the sheet portion of `ControlsPaneWrapper.vue`/`.css` with `<Drawer
   mode="live-behind" direction="bottom">` + `DrawerContent`; re-point
   `proof:drawer-spring` to assert the sheet is `<Drawer>` whose `--glass-drawer-t`
   is spring-driven (transitively kf `SpringProgress`, confirmed
   `dist/drawer.js`). Gate: `proof:drawer-spring` re-pointed GREEN + a
   `proof:demo-no-oversize` line count drop of ≥300L in `animation-transport/`; the
   deleted composables absent. Size: **L**.

2. **Swap `<div class="dock-separator">` → `DockSeparator` at all 5 sites; elide on
   home.** Scope: `ChromeDock.vue`, `TransportDock.vue`. Gate: a
   `proof:no-hand-rolled-dock-separator` grep (zero `class="dock-separator"` in
   `demo/`) + the home route renders zero dock separators (VERDICT #6). Size: **S**.

3. **Delete `GestureLegend.vue` + its `proof:gesture-manifest` contract.** Scope:
   remove the component, every `<GestureLegend>` mount, the `data-gesture-tell`
   census, and the gate. Gate: zero `GestureLegend` imports; `proof:gesture-manifest`
   retired from the roster. Size: **S** (coordinate with lane 07).

4. **Author `docs/tranches/T/KF-TO-GLASSUI-BG.md`** carrying BG-1..BG-4 (§4), each
   with its born-RED discharge gate. Gate: the file exists, each ask names a
   falsifiable kf-side gate, and `proof:pin-ledger-current` records the pending
   re-pin. Size: **S** (docs only, dev phase).

5. **GATED-ON-BG-1+BG-3: kill `KfPillTabs.vue` + `useKfPillTabs.ts`; both consumers
   move to `SegmentedTabs`.** Scope: `AnimationControls.vue`, `SpringSidebar.vue`
   adopt the pill-tablist SegmentedTabs; re-pin glass-ui. Gate:
   `proof:glassui-aria-ask` GREEN + zero `KfPillTabs`/`useKfPillTabs` references +
   the panel switcher renders `role=tablist` with no prohibited `aria-orientation`.
   Size: **M** (blocked on the glass-ui publish; specified now, terminal-on-publish).

6. **GATED-ON-BG-2+BG-4: delete `usePlayActuation` and the `MbabbMenu`
   pointerdown-synthesis; re-pin.** Scope: `TransportDock.vue`, `MbabbMenu.vue`.
   Gate: `proof:workaround-deletion` S1/S2 + `proof:dock-popover-opens` +
   `proof:single-toggle` all GREEN with the workarounds absent. Size: **M** (blocked
   on publish).
