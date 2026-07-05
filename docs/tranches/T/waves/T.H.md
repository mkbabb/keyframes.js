# Tranche T — Band T.H · THE CONSTELLATION (glass-ui handoffs + pure consumption)

> **Status: DEVELOPMENT. Implementation NOT authorized.** Wave specs only — falsifiable gates,
> stated born-RED / born-OWNER / gated-on-publish, lane-cited, cross-band edged.
>
> **What this band is.** The seam between keyframes.js and glass-ui. VERDICT #18 ("wtf are most
> of these items? KfPillTabs.vue?? KF? Pills? Why aren't these just glass-ui components?") and
> #27 ("Leverage proper, and the latest, glass-ui components … Delineate our gaps, and glass-ui's
> gaps — glass-ui is in active development with BG/BH forthcoming"). Lane 20's census is the
> spine: the demo is **NOT** broadly under-consuming glass-ui (Card ×14, Button ×11, Slider ×3,
> dock/forms/labeled-field/icon-tooltip all consumed). The problem is a **small set of
> load-bearing hand-rolls** — three that exist ONLY because two glass-ui asks (Q's GU-Q1/GU-Q2)
> were never published, and one big pure-consumption win sitting unclaimed.
>
> **This band owns:** (1) the consolidated ask letter `KF-TO-GLASSUI-BG.md` (authored — every ask
> carries a kf-side born-RED acceptance gate + the workaround it retires); (2) ONE gap ledger with
> a **version TRIPWIRE** (kills the self-justifying "P-inv-28 forbids the Nth carry" that never
> fires); (3) the pure-consumption wins available TODAY (`Drawer mode="live-behind"`,
> `LabeledSelect`; `DockSeparator` is subsumed by T.C1); (4) the gated-on-publish excisions
> (`KfPillTabs`, `usePlayActuation`, the `MbabbMenu` synthesis), specified terminal-on-publish.
>
> **Lanes:** 20 (ALL), 21 (recs 1,2 — the gap ledger + KfPillTabs), 08 (recs 5,6 — the GU asks),
> 09 (the `--font-display-weight` ask), 12 (the public cursor-reactive-writer ask), 11 (T1's
> static-backdrop blur-mode ask).

---

## §0 The measured state (so the "gap" claims are honest)

- **glass-ui 4.0.1 is installed** (`package.json:274` `~4.0.0`); it exports **90 subpaths**.
- **Two Q asks never published** (VERIFIED against the CONSUMED dist, not glass-ui's source):
  - `dist/tabs.js:305-306` still emits `aria-orientation` UNCONDITIONALLY on `role=group` (the
    pill variant) — `proof-glassui-aria-ask.mjs:111` parked PENDING.
  - `dist/dock.js` carries no `.dock-layer` collapse-crossfade keepalive
    (`proof-workaround-deletion.mjs:255` `glassCaps.dockStrandKeepalive === false`).
- **Three surviving band-aids** each re-declare "P-inv-28 forbids the Nth carry" and survive:
  `KfPillTabs.vue`+`useKfPillTabs.ts` (211L, BG-1), `usePlayActuation` in `TransportDock.vue:315-359`
  (GU-4), `MbabbMenu.vue:180-199` pointerdown-synthesis (BG-4). **None points at a shared ledger**
  — no gate fires when the gap closes (lane 21 §3).
- **The unclaimed win:** glass-ui 4.0.1 ALREADY ships the exact `Drawer mode="live-behind"`
  peek/half/full sheet the demo hand-rolls in ~350L (`drawer.js` VERIFIED: `mode?: DrawerMode`
  with `live-behind`; drives `--glass-drawer-t` off kf's OWN `SpringProgress` — the dogfood is
  preserved transitively).

The full ask set + its naming crosswalk + measured evidence lives in
[`../KF-TO-GLASSUI-BG.md`](../KF-TO-GLASSUI-BG.md); the owner-fork rulings in
[`../OWNER-DECISIONS.md`](../OWNER-DECISIONS.md). This file specs the kf-side WAVES.

---

## §1 The waves

| id | title | size | gate posture |
|---|---|---|---|
| **T.H1** | The glass-ui gap ledger + version tripwire | M | BORN-RED (file+key absent) |
| **T.H2** | Author `KF-TO-GLASSUI-BG.md` + pin-ledger TARGET rows + new caps | S | BORN-RED (file+rows absent) |
| **T.H3** | Consume `Drawer mode="live-behind"` for the mobile sheet (the big win) | L | BORN-RED |
| **T.H4** | `LabeledSelect` pure-consumption (+ `DockSeparator` subsumed → T.C1) | S | BORN-RED |
| **T.H5** | Excise `KfPillTabs` (gated on BG-1 + BG-3) | M | GATED-ON-PUBLISH tripwire |
| **T.H6** | Excise `usePlayActuation` + the `MbabbMenu` synthesis (gated on GU-4 + BG-4) | M | GATED-ON-PUBLISH tripwire |

---

### T.H1 — The glass-ui gap ledger + version tripwire

**id** T.H1 · **size** M · **BORN-RED** (the ledger file + the gate key are absent)
**lanes** 21 rec 1 (+ lane 20 §1, lane 08 D7)

**Scope.** Consolidate the three (soon six) glass-ui-gap band-aids into **ONE**
`demo/glass-ui-gaps.ts` registry (lane 21 rec 1). Each entry names the consumed-dist defect, the
workaround site(s), the `glassCaps` probe key, and the glass-ui version expected to fix it:
- `segmentedTabsAriaOrientation` → `KfPillTabs.vue`/`useKfPillTabs.ts` + the two
  `:aria-orientation="undefined"` suppress sites (BG-1) — probe `glassCaps.ariaGuard`.
- `dockStrandKeepalive` → `usePlayActuation` in `TransportDock.vue:315-359` (GU-4) — probe
  `glassCaps.dockStrandKeepalive` (**exists**, `proof-workaround-deletion.mjs:255`).
- `dockPressScaleClickStrand` → `MbabbMenu.vue:180-199` (BG-4) — new probe
  `glassCaps.dockDropdownPointerdown`.
- `dockDismissHold` → `ChromeDock.vue:141-185` re-expand watch + mutex (GU-3) — new probe
  `glassCaps.dockDismissHold`.
- (recorded, no band-aid file) `dockRestBlur` (GU-1), `dockMorphMeasure` (GU-2),
  `staticBackdrop` (BG-5), `fontDisplayWeight` (BG-6), `specularWriterPublic` (BG-7).

Every band-aid file **imports and cites its ledger entry** — the single place a reviewer sees
"these die when glass-ui BG/BH lands." A new `proof:glass-ui-gap-tripwire` reads the installed
`@mkbabb/glass-ui` version + the `glassCaps` shape and **FAILS when a ledger entry's fix is
satisfied in the consumed dist while its workaround site still exists** — forcing excision at the
moment the gap closes, instead of N "forbids the Nth carry" comments that never fire.

**Gate.** `proof:glass-ui-gap-tripwire` — for each ledger entry: `cap satisfied (dist) ∧ workaround
present (grep)` ⇒ RED. **BORN-RED today** on the file+key absence (the gate cannot run — no
`demo/glass-ui-gaps.ts`, no roster key — the `proof:pin-ledger-current` born-RED-on-absent-ledger
pattern). Once authored it is a live version-sentinel: **vacuously green today** (no fix
published), it flips RED the instant a fix lands + the workaround survives.

**Edges.**
- **↔ existing `proof:workaround-deletion`** — the tripwire **reuses** its `glassCaps` probe (the
  SAME dist-content greps for `ariaGuard`/`dockStrandKeepalive`); it does NOT mint a second probe.
  The two gates read ONE source of the cap shape (else they can disagree — the cap-name discipline
  in the letter §1). The tripwire is the *generalized* register; `proof:workaround-deletion` is the
  per-arm three-state ledger — they compose, not duplicate.
- **→ T.H2** authors the letter + the new caps (`dockDismissHold`, `dockDropdownPointerdown`) into
  `proof:workaround-deletion`; T.H1 registers them in the ledger.
- **→ T.C6** the GU-3/GU-4 scaffolding excisions key on `dockDismissHold`/`dockStrandKeepalive` —
  the SAME caps the ledger records (single source).

**Lockstep.** Wire `proof:glass-ui-gap-tripwire` into `proof:hygiene-chain` + `proof:all` +
`run-all.mjs` + `proof:ci-coverage` in the SAME motion it is authored (T.M8 no-orphan-key; a
dangling CI reference reds `proof:ci-coverage`). Every band-aid file's ledger-import must resolve
(a moved band-aid re-points its entry). Grep `scripts/` for the new key basename before landing.

---

### T.H2 — Author `KF-TO-GLASSUI-BG.md` + the pin-ledger TARGET rows + the new caps

**id** T.H2 · **size** S · **BORN-RED** (the shipped file + the pin rows + the caps are absent)
**lanes** 20 rec 4 (+ lane 08 recs 5,6; lane 09 T-TY1; lane 11 T1; lane 12 F6)

**Scope.** Re-issue the DEV-authored `KF-TO-GLASSUI-BG.md` as the shipped dispatch and land its
machine-readable half:
- The letter carries **twelve asks** (GU-1..4 dock render/interaction, BG-1/BG-3 tabs, BG-4 dock
  dropdown, BG-5 static-backdrop, BG-6 `--font-display-weight`, BG-7 public cursor-writer, **BG-8/
  BG-9/BG-10 the easing-picker consumption asks** — named-catalogue/bounce coverage, external-driven
  `progress` docs, `ToggleChip cell` live-preview slot, routed from T.E8/lane 05 F6) + the retired
  BG-2 duplicate note. Each ask: (a) measured kf-side evidence citing the lane, (b) the kf-side
  born-RED acceptance gate (or a delineated non-blocking GAP note, for BG-7..BG-10) that flips on the
  re-pin, (c) the workaround it retires (none for the delineated-GAP asks).
- Extend `docs/tranches/Q/PIN-LEDGER.json`'s `target.pins` with a row per ask (the consume
  frontier), so `proof:pin-ledger-current` (c.3) witnesses the caret-pin consume as a gated edge.
- Wire the two new `glassCaps` caps into `proof:workaround-deletion`: `dockDismissHold` (GU-3
  dist signature) and `dockDropdownPointerdown` (BG-4 dist signature), each a device-independent
  dist-content grep like the existing `ariaGuard`/`dockStrandKeepalive`.

**Gate.** `proof:pin-ledger-current` (c.3) records the pending re-pin rows + the file exists +
each ask names a falsifiable kf-side gate (a doc-lint clause: every §0 ask row has a non-empty
"acceptance gate" cell that resolves to a real `proof:*` key). **BORN-RED today:** the shipped
`KF-TO-GLASSUI-BG.md` and the new TARGET rows + caps are absent.

**Edges.**
- **→ T.C5/T.C6** own the GU-1..4 kf-side acceptance GATES (`proof:dock-rest-crisp`,
  `-morph-continuity`, the `dockDismissHold`/`dockStrandKeepalive` tripwire rows); T.H2 records
  them in the letter, does NOT re-author them.
- **→ T.G1** owns BG-5's acceptance (`proof:blur-not-resampled`); **→ T.D2** owns BG-6's
  (`proof:demo-fonts` v3 weight clause); **→ T.D13** owns BG-7's named gap (`Aurora` serves the
  WebGL-cursor path; `proof:cursor-light-no-sync-layout` is the recurrence guard).
- **← T.H1** the ledger's version dimension feeds off these caps.

**Lockstep.** Per inv-16, kf NEVER patches glass-ui in-demo — every ask is a glass-ui-root fix.
The letter's DAG (§7) must match every downstream gate's PENDING→GREEN order (a re-pin flips them
all). Do not leave a letter ask whose named acceptance gate does not exist in `scripts/` (the
doc-lint clause catches it).

---

### T.H3 — Consume `Drawer mode="live-behind"` for the mobile sheet (the highest-leverage move)

**id** T.H3 · **size** L · **BORN-RED**
**lanes** 20 rec 1

**Scope (lane 20 §2b).** The demo hand-rolls the ENTIRE peek/half/full mobile sheet:
`ControlsPaneWrapper.vue` (sheet host) + `SheetGrabHandle.vue` (91L) + `useSheetGesture.ts` (88L)
+ `useSheetSpring.ts` (87L) + `useSheetState.ts` (78L) + the sheet half of `ControlsPaneWrapper.css`
(~302L). glass-ui 4.0.1's **`Drawer`** is the exact article (VERIFIED `drawer.js`):
- `mode="live-behind"` = the non-modal peek/half/full bottom sheet (`modal:false` — no focus
  trap, page-behind stays interactive; `shouldScaleBackground:false`) — the demo's exact
  requirement (a sheet over a live subject stage).
- `direction="bottom"` resolves the `[0.12, 0.5, 1]` peek/half/full snap ladder natively;
  `useDrawerSnap` owns the grab-handle drag, the velocity-flung detent advance, and the a11y —
  everything `useSheetGesture`/`useSheetState` re-implement.
- **The dogfood is PRESERVED transitively.** `drawer.js` literally does `import { SpringProgress
  } from "@mkbabb/keyframes.js"` and drives `--glass-drawer-t` off a kf `SpringProgress`
  (`DRAWER_SNAP = {response:0.4, dampingFraction:0.82}`). Swapping does NOT abandon
  `proof:drawer-spring`'s "the spring engine springs its own chrome" mandate — the sheet is STILL
  moved by kf's `SpringProgress`, through glass-ui's Drawer facade.

Replace the sheet host + the four sheet composables + the sheet CSS with `<Drawer
mode="live-behind" direction="bottom">` + `DrawerContent`. Net: **delete ~350L of bespoke
gesture/spring/state + ~200L of sheet CSS** for a better-tested, focus-correct, snap-detented
component.

**Gate.** `proof:drawer-spring` **RE-POINTED** — from "the demo constructs `new SpringProgress`
for the sheet" to "the sheet is `<Drawer>` whose `--glass-drawer-t` is spring-driven (transitively
kf `SpringProgress`, confirmed in `drawer.js`)" — GREEN; **plus** a `proof:demo-no-oversize`
line-count drop of ≥300L in `demo/@/…/animation-transport/`; the deleted composables
(`useSheetGesture`/`useSheetSpring`/`useSheetState`/`SheetGrabHandle`) absent (grep → 0).
**BORN-RED today:** the sheet is hand-rolled; `proof:drawer-spring` today asserts the bespoke
construction.

**Edges.**
- **→ T.F** the `--menubar-measured-h` ResizeObserver (`TransportDock.vue:264-313`, sheet-anchor
  plumbing) relocates to the layout owner — the sheet's anchor contract changes with the Drawer
  adoption; coordinate so the anchor moves in the same motion (lane 08 D7 / T.C6 note).
- **→ T.F** the four deleted composables' reflexive `*State`/`*Deps` interface exports feed the
  `proof:no-dead-export` sweep (lane 21 rec 6).

**Lockstep.** Re-point `proof:drawer-spring` in the SAME commit that swaps the sheet (never leave
it asserting the deleted `new SpringProgress`). Grep `scripts/` for `SheetGrabHandle` /
`useSheetGesture` / `useSheetSpring` / `useSheetState` literal paths — any gate anchored on them
re-points or retires. The mobile-sheet occlusion gates (`proof:occlusion`,
`proof:mobile-single-page`) must re-verify against the Drawer's snap ladder, not the bespoke one.

---

### T.H4 — `LabeledSelect` pure-consumption (+ `DockSeparator` subsumed by T.C1)

**id** T.H4 · **size** S · **BORN-RED**
**lanes** 20 rec 2 (DockSeparator) + charter T.H pure-consumption roster (LabeledSelect)

**Scope.** Two pure-consumption swaps the charter names; one is owned here, one is subsumed:
- **`LabeledSelect` (owned here).** glass-ui's `labeled-field` family is already partly consumed
  (`LabeledSlider` in `SpringSidebar` — lane 20 §0). Its sibling **`LabeledSelect`** (VERIFIED
  export: `dist/components/custom/labeled-field/LabeledSelect.vue`, props
  `{modelValue,isOpen,items,descriptions?,label,tooltip,required?,hideLabel?}`) replaces the
  demo's hand-rolled label+`<select>`/trigger pairs in the option/config rows (the exact sites are
  enumerated at impl entry from the labeled-field census; a hand-rolled `<label>` adjacent to a
  bespoke select trigger is the witness). `hideLabel` handles the `sr-only` double-label case a
  `ConfiguratorRow` already labels.
- **`DockSeparator` (SUBSUMED — cross-ref, do NOT author here).** Lane 20 rec 2's `<div
  class="dock-separator">` → `DockSeparator` swap (5 sites: `ChromeDock.vue:217,268,309`,
  `TransportDock.vue:119,161`) is **subsumed by T.C1's grammar recut** — the compass/transport
  rebuild on `DockSection` draws `DockSeparator` between inhabited zones **by construction** (one
  motion, not two). T.H4 does NOT double-author it; the `proof:no-hand-rolled-dock-separator` grep
  clause rides `proof:dock-grammar` (T.C1).

**Gate.** `proof:no-hand-rolled-labeled-select` — zero hand-rolled label-adjacent-select pairs in
the option/config rows (each resolves to a `LabeledSelect` / `DockSelectTrigger` / `Select`);
folds a `proof:no-dup-utility` risk. **BORN-RED today:** the hand-rolled pairs exist.
(DockSeparator's clause is T.C1's `proof:dock-grammar` — zero `class="dock-separator"` in `demo/`.)

**Edges.**
- **→ T.C1** owns the `DockSeparator` adoption (subsumed) — a coordination note, not a shared
  wave; T.H4 must NOT re-swap the separators (double-authoring risk, charter §5 lockstep).
- **→ T.D** the `LabeledSelect` face inherits glass-ui's body register — coordinate with T.D3
  (Jakarta body) so the swapped selects do not re-introduce a serif/mono override.

**Lockstep.** Do not leave a hand-rolled select behind a gate that now expects `LabeledSelect`;
re-verify `proof:no-brittle-selector` against the new component's DOM (the option rows change
markup).

---

### T.H5 — Excise `KfPillTabs` (gated on BG-1 + BG-3)

**id** T.H5 · **size** M · **GATED-ON-PUBLISH tripwire** (NOT born-RED today — see gate)
**lanes** 20 rec 5, 21 rec 2 (+ VERDICT #18 by name)

**Scope.** `KfPillTabs.vue` (121L) + `useKfPillTabs.ts` (90L) exist ONLY to route around glass-ui
4.0.1's pill emitting the prohibited `aria-orientation` on `role=group` (BG-1) — VERDICT #18 by
name. Both consumers — `AnimationControls.vue:74` (the Controls/Keyframes/Timeline panel switcher)
and `SpringSidebar.vue:160` (shot 16's `Live solver │ Discrete transition`) — want a **pill LOOK
with panel-switcher (tablist) SEMANTICS**. glass-ui today COUPLES material to role
(`tabs.js:305`: pill ⇒ `role=group`), so BG-1 alone does NOT unblock the swap — it needs **BG-3**
(decouple material↔role: a pill-look panel switcher with `role=tablist` + roving tabindex). Once
both land, DELETE both files; both consumers move to `SegmentedTabs`. The `SegmentedTabOption`
shape is already a superset of `KfPillTabOption`; `v-model` + `orientation` are byte-identical.

**Gate.** A ledger tripwire row (T.H1): `glassCaps.ariaGuard (BG-1) ∧ BG-3 material-role axis
present` ⇒ `KfPillTabs`/`useKfPillTabs` MUST be absent — else RED. Plus, on the flip:
`proof:glassui-aria-ask` GREEN + zero `KfPillTabs`/`useKfPillTabs` references + both switchers
render `role=tablist` with **no** prohibited `aria-orientation` (extend `proof:brittleness`/the
a11y probe). **NOT born-RED today:** BG-1+BG-3 unpublished; deleting KfPillTabs now re-breaks aria
(the three-state `PRESENT+UNPUBLISHED → PENDING`). **Terminal-on-publish** — flips RED the instant
the caps are satisfied but the files survive.

**Edges.**
- **→ T.B (esp. T.B6)** the spring/easing sidebars DISSOLVE into channels+facets (VERDICT #12/#18
  rebuild to the cube/amiga/square controls-model) — both KfPillTabs call sites are being rebuilt
  anyway; the pill component dies with that redesign. T.B owns the sidebar dissolution and is a
  **pure consumer** of the switcher (T.B6 carries NO deletion clause); **T.H5 is the SINGLE owner of
  the fork's DELETION** + the SegmentedTabs adoption (the charter's gated-on-publish excision).
- **→ T.F16** owns the demo-side **rename** off the `Kf`-vanity prefix + the `useRovingTabindex`
  convergence (lands now); T.H5's deletion supersedes the renamed fork on the re-pin. One deletion
  owner (T.H5), one rename owner (T.F16), T.B6 a consumer — cross-referenced all three ways.
- **→ T.D** the `KfPillTabs.vue:93` display-face force dies with the component (T.D2/T.D5 note);
  the byte-identical `controls/tab-trigger.css:54-62` pill-recipe twin is retired in lockstep.
- **← T.H2** BG-1/BG-3 are asks in the letter.

**Lockstep.** The KfPillTabs deletion re-arms `proof:glassui-aria-ask` (PENDING→GREEN) + the a11y
role probe — re-derive both against the SegmentedTabs `role=tablist` DOM in the same motion. Do
NOT green the aria gate by resurrecting a suppressed attribute on a resurrected pill (lane 18
rule). Grep `scripts/` for `KfPillTabs`/`useKfPillTabs` literal paths before the excision commit.

---

### T.H6 — Excise `usePlayActuation` + the `MbabbMenu` synthesis (gated on GU-4 + BG-4)

**id** T.H6 · **size** M · **GATED-ON-PUBLISH tripwire** (NOT born-RED today — see gate)
**lanes** 20 rec 6 (+ lane 08 rec 6, lane 21 recs 2,3)

**Scope.** The two dock-interaction band-aids, both terminal-on-publish:
- **`MbabbMenu.vue:180-199` pointerdown-synthesis (BG-4).** `DockDropdownTrigger` opens on
  **click** while `DockSelectTrigger` opens on **pointerdown**; the press-scale reflow (`scale:.96`)
  drops the native click, so MbabbMenu synthesizes reka's click on pointerdown and kills the
  native one. On BG-4 (pointerdown-open parity), delete the synthesis.
- **`usePlayActuation` in `TransportDock.vue:315-359` (GU-4).** The modality-pure pointerup/keydown
  actuation built to dodge the collapse-crossfade stranding the synthesized click. On GU-4
  (`dockStrandKeepalive`), collapse to a plain click handler. **CO-OWNED with T.C6** — see edges.

**Gate.** Ledger tripwire rows (T.H1): `glassCaps.dockDropdownPointerdown (BG-4) ∧ MbabbMenu
synthesis present` ⇒ RED; `glassCaps.dockStrandKeepalive (GU-4) ∧ usePlayActuation present` ⇒ RED
(this is `proof:workaround-deletion` **S2**, already coded). On the flip: `proof:dock-popover-opens`
+ `proof:single-toggle` GREEN with the synthesis removed; `proof:live-session` S5 GREEN with the
plain click handler. **NOT born-RED today:** BG-4/GU-4 unpublished (the caps false; deleting now
re-breaks the dock). **Terminal-on-publish.**

**Edges.**
- **↔ T.C6 (must-land-together, DO-NOT-DOUBLE-AUTHOR).** T.C6 specs the SAME `usePlayActuation`
  collapse in the dock-recut context (it needs `actions.primary` from T.B10/T.C1 to render play
  as a plain click). T.H6 and T.C6 are the SAME excision triggered by the SAME gap-ledger tripwire
  — the impl drive lands it ONCE. T.H6 owns the ledger/tripwire framing + the `MbabbMenu` half;
  T.C6 owns the dock-render side. Flagged so the impl drive does not delete `usePlayActuation`
  twice or leave one half. (Charter conflict note 2.)
- **→ T.C2** adds the "Clear all & reload" action to `MbabbMenu` (home = compass only) — that is a
  DIFFERENT MbabbMenu change (ADD, not the synthesis excision); the two must not collide (T.C2
  only adds the item; T.H6 removes the pointerdown synthesis).
- **← T.H2** BG-4/GU-4 are asks in the letter; the `dockDropdownPointerdown` cap is authored there.

**Lockstep.** Removing the synthesis re-arms `proof:dock-popover-opens` / `proof:single-toggle`
(they assume the synthesized path today) — re-derive against the NATIVE pointerdown-open path in
the same motion (the arming-audit lesson, charter §5 clause 1; recurred 5×). Grep `scripts/` for
`usePlayActuation` / `pointerHandled` / `onPlayPointerDown` / the MbabbMenu synthesis literal
before the excision commit.

---

## §2 Cross-band edges (summary)

| From (T.H) | To | What crosses |
|---|---|---|
| T.H1 (gap ledger) | **T.C6** | GU-3/GU-4 scaffolding excisions key on `dockDismissHold`/`dockStrandKeepalive` — the SAME caps the ledger records (single source of the probe shape) |
| T.H1 (tripwire) | **existing `proof:workaround-deletion`** | reuses its `glassCaps` probe; composes (generalized register) not duplicates |
| T.H2 (the letter — GU-1/GU-2 acceptance) | **T.C5** | `proof:dock-rest-crisp` / `proof:dock-morph-continuity` are landed in T.C5; the letter records them |
| T.H2 (BG-5 acceptance) | **T.G1** | `blur-source="static"` — `proof:blur-not-resampled` landed in T.G1; the letter carries the ask |
| T.H2 (BG-6 acceptance) | **T.D2** | `--font-display-weight` — `proof:demo-fonts` v3 weight clause landed in T.D2; the letter carries the ask |
| T.H2 (BG-7 named gap) | **T.D13 / OD-2** | public `createSpecularWriter` gap; `Aurora` serves the WebGL path; `proof:cursor-light-no-sync-layout` the recurrence guard |
| T.H3 (Drawer swap) | **T.F** | the `--menubar-measured-h` ResizeObserver relocation + the deleted composables' dead-export sweep |
| T.H4 (DockSeparator) | **T.C1** | SUBSUMED by the dock-grammar recut — do NOT double-author |
| T.H5 (KfPillTabs) | **T.B / T.D** | the sidebar dissolution (T.B) + the display-face force + `tab-trigger.css` twin retirement (T.D) |
| T.H6 (usePlayActuation) | **T.C6** | the SAME excision (must-land-together, do-not-double-author); T.C2 separately ADDS the clear action to MbabbMenu |
| T.H1/T.H2 (roster keys) | **T.M8 / T.M6** | new keys count against the ceiling + declare INSTRUMENT/OWNER authority (the appearance-touching dock ones ride T.C7) |

---

## §3 Disposition of lane recommendations (zero silent drops)

### Lane 20 — glass-ui consumption (ALL 6 recs assigned)

| # | rec | disposition |
|---|---|---|
| 1 | Consume `Drawer mode="live-behind"` for the mobile sheet | **→ T.H3** |
| 2 | Swap `<div class="dock-separator">` → `DockSeparator` (5 sites) | **→ T.H4** (SUBSUMED by **T.C1**'s grammar recut — one motion; T.H4 carries only the cross-ref + the grep clause rides `proof:dock-grammar`) |
| 3 | Delete `GestureLegend.vue` + `proof:gesture-manifest` | **→ T.E** (charter routes the gesture-legend removal + its gate rewire to the prune band; VERDICT #8; coordinate lane 07). glass-ui has no primitive — deletion, not swap. |
| 4 | Author `KF-TO-GLASSUI-BG.md` (BG-1..BG-4 + gates) | **→ T.H2** (expanded to twelve asks GU-1..4 + BG-1/3/4/5/6/7 + BG-8/9/10 the easing-picker consumption asks routed from T.E8/lane 05 F6) |
| 5 | GATED: kill `KfPillTabs` + `useKfPillTabs`; both consumers → SegmentedTabs | **→ T.H5** (gated on BG-1 + BG-3) |
| 6 | GATED: delete `usePlayActuation` + the `MbabbMenu` synthesis; re-pin | **→ T.H6** (gated on GU-4 + BG-4; usePlayActuation co-owned with T.C6) |

### Lane 21 — legacy sweep (recs 1,2 assigned; 3–7 cross-referenced)

| # | rec | disposition |
|---|---|---|
| 1 | Consolidate the 3 band-aids into ONE gap ledger + version tripwire | **→ T.H1** |
| 2 | Retire `KfPillTabs` onto glass-ui `SegmentedTabs` | **→ T.H5** |
| 3 | Replace the placeholder `AnimationGroup` with a `TransportSource` interface (`useContractAnimGroup`) | **→ T.B** (VERDICT #25 — the transport facility hard-typed to `AnimationGroup`; the light-scene decoy replacement is T.B's `SceneFacility` charter, lane 23/10). Cross-ref only. |
| 4 | DRY the hot/cold readout throttle into one composable | **→ T.F23(c)** (OWNED — the `useThrottledReadout` seam across 4 scenes; also folds with **T.G3**'s `PROGRESS_READOUT_HZ` per-frame reactive-write cure). Cross-ref. |
| 5 | Sweep `demo` `any` to a bounded ceiling under a gate | **→ T.F23(b)** (OWNED — the demo strictness sweep + the `any`-ceiling ratchet gate). Cross-ref. |
| 6 | Add `proof:no-dead-export`; excise `kfEngineReady` + 6 dead types | **→ T.F23(a)** (OWNED — the export-granularity hygiene gate; feeds off T.H3's deleted sheet composables). Cross-ref. |
| 7 | De-defer or build the DM-22 named-selector resolution (`frame-compiler.ts:341`) | **→ T.S** (the S-residue / DM-22 de-defer; the ONE live `src` "DEFERRED to a follow-up wave" marker). Cross-ref. |

### Lane 08 — dock system (recs 5,6 assigned — the GU asks; 1–4,7 → T.C)

| # | rec | disposition |
|---|---|---|
| 5 | T-DOCK-5 · morph + crispness handoff (GU-1/GU-2, born-RED) | **→ KF-TO-GLASSUI-BG.md GU-1/GU-2 (T.H2)**; the kf-side acceptance gates `proof:dock-rest-crisp`/`proof:dock-morph-continuity` are landed in **T.C5** |
| 6 | T-DOCK-6 · scaffolding excision behind the re-pin (GU-3/GU-4) | **→ KF-TO-GLASSUI-BG.md GU-3/GU-4 (T.H2)** + the gap-ledger tripwire (**T.H1**); the excision itself is **T.C6** (dock) / **T.H6** (MbabbMenu + usePlayActuation) |
| 1,2,3,4,7 | dock grammar recut / home=compass / one tooltip / voice / roster | **→ T.C** (T.C1–T.C4, T.C7 — the dock band; not assigned here) |

### Lane 09 — theme/typography (the `--font-display-weight` ask assigned; rest → T.D)

| # | rec | disposition |
|---|---|---|
| 1 (T-TY1, the glass-ui half) | `var(--font-display-weight, 600)` token seam on the display rungs | **→ KF-TO-GLASSUI-BG.md BG-6 (T.H2)**; acceptance `proof:demo-fonts` v3 weight clause landed in **T.D2**; the demo-side `@layer` override until the re-pin is T.D2's |
| 1 (T-TY1 remainder), 2–6 (T-TY2/T-TY3/T-TH1/T-TH2/T-TY4) | honest weight / Jakarta body / mono→data / violet accent / signal-contrast / ramp totality | **→ T.D** (the look band; OD-6 for the ramp choice). Cross-ref. |

### Lane 12 — cursor-light (the public cursor-reactive-writer ask assigned; rest → T.D/OD-2)

| # | rec | disposition |
|---|---|---|
| F6 / T-CL-1 (the glass-ui gap half) | make `createSpecularWriter`'s coalesced core PUBLIC (internal-only today) | **→ KF-TO-GLASSUI-BG.md BG-7 (T.H2)** — a NAMED gap, not a workaround (do NOT hand-copy the internal composable — the forbidden 2nd occurrence) |
| T-CL-1 (Aurora-on-hero), T-CL-2 (REMOVE), T-CL-3 (recurrence gate) | the cursor-light disposition | **→ T.D13 / OD-2** (the owner fork: Aurora-on-hero vs REMOVE; the compose-wash kill is unconditional). Cross-ref. |

### Lane 11 — performance (T1's static-backdrop blur-mode ask assigned; rest → T.G)

| # | rec | disposition |
|---|---|---|
| T1 (the glass-ui half) | a `blur-source="static"` / frozen-backdrop mode | **→ KF-TO-GLASSUI-BG.md BG-5 (T.H2)**; acceptance `proof:blur-not-resampled` landed in **T.G1**; the kf-side shell de-layer (delete the falsified `contain:paint`, `App.vue:337`) is T.G1's |
| T1 (kf half), T2–T6 | de-layer / master rAF clock / settle-and-stop / transform-not-left / amiga budget / perf-gate re-home | **→ T.G** (the speed band). Cross-ref. |

### Lane 15 — app-prune (rec 5 → OD-3 assigned; rest → T.F/T.C)

| # | rec | disposition |
|---|---|---|
| 5 | Get an explicit owner ruling on the `ppMode`/ppmycota toggle (`MbabbMenu.vue:55-66`) | **→ OD-3** (materialized in `OWNER-DECISIONS.md`; KEEP as brand mark vs CUT as decorative chrome; the `grep -ri ppmode demo/` follow-up gate authored only if CUT) |
| 1–4 | provenance sweep / const-trim / chrome-rename / scenes-shrink | **→ T.F** (demo restructure; the `app/chrome/`→`app/dock/` rename co-timed with **T.C**'s recut). Cross-ref. |

---

## §4 Charter conflicts / coordination notes spotted

1. **The ask-naming tension (GU-n vs BG-n).** Two audit lanes (08, 20) and Q numbered overlapping
   asks independently, and charter §1's T.H shorthand ("dock dismiss-hold + click-integrity
   (BG-2/4)") does not match the downstream-anchored usage. **Resolved in `KF-TO-GLASSUI-BG.md` §1**
   (the crosswalk): the operative naming is GU-3 = dismiss-hold, GU-4 = click-integrity (≡ Q GU-Q2
   ≡ lane-20 "BG-2", the ONE genuine duplicate — unified), BG-4 = the DockDropdownTrigger
   pointerdown parity. The charter shorthand is imprecise, not operative; the letter is
   authoritative. **Cap-name discipline:** GU-4 reuses the EXISTING `glassCaps.dockStrandKeepalive`
   (already coded) — do NOT mint `dockClickIntegrity` as a second cap for one defect.

2. **`usePlayActuation` excision is co-owned (T.H6 ↔ T.C6).** Charter §1 assigns the
   `usePlayActuation` gated-on-publish excision to T.H, but T.C6 independently specs the SAME
   collapse in the dock-recut context (it needs `actions.primary` from T.B10/T.C1). This is ONE
   excision triggered by ONE gap-ledger tripwire — the impl drive must land it once. Flagged so
   nobody double-authors or half-lands it.

3. **`DockSeparator` is subsumed, not a T.H wave.** Charter §1 lists `DockSeparator` among T.H's
   pure-consumption wins, but T.C1's grammar recut draws it by construction. T.H4 carries only the
   cross-ref + the grep clause rides `proof:dock-grammar` — no double-authoring.

4. **The gap-ledger tripwire overlaps the existing `proof:workaround-deletion`.** Lane 21 rec 1's
   new `proof:glass-ui-gap-tripwire` and the existing three-state `proof:workaround-deletion` both
   probe `glassCaps`. Resolved: the tripwire is the GENERALIZED register (all gaps, version
   dimension); `proof:workaround-deletion` is the per-arm three-state ledger. They **compose off a
   single `glassCaps` probe** (T.H1 reuses it), never a second copy — else the two gates can
   disagree.

## Addendum (2026-07-05, post-harden synthesizer ruling) — lane 25 fold

- **Lane 25 rec 2** (glass-ui-consumption gate on primitive replacement) → **OWNED by T.H1**:
  the gap-ledger + version tripwire IS the "a deleted primitive's replacement imports glass-ui
  OR carries a ledgered `GLASSUI-GAP:` row" rule — T.H1's gate gains that clause explicitly
  (a replacement site with neither an `@mkbabb/glass-ui` import nor a ledger row REDs).
  Co-cited: T.F23's glass-ui-usage census (the sweep side).
