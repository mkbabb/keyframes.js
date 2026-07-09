# glass-ui usage census (T.F23(d) — READ-ONLY)

**Wave:** T.F23(d), the glass-ui-usage census clause (the GRAND COLOCATION EDICT +
lane 25 rec 2). **Nature:** a READ-ONLY report — no code changes. It feeds the
T.F / T.H terminal batches + the owner review packet: every glass-ui import site,
every hand-rolled twin of a shipped component, every consumed-vs-available gap,
each hand-roll mapped to exactly one disposition — **glass-ui-replace** (routes to
**T.H**, the consumption gate) · **keep-with-reason** (a delineated gap with a
`demo/glass-ui-gaps.ts` ledger row) · **delete**.

- **Consumed glass-ui version:** `@mkbabb/glass-ui@4.0.1` (demo `optionalDependencies`, pinned `~4.0.0`).
- **Derived on:** the T batch-⑥′ tree (this worktree, post the T.F23(a)/(b)/(c) landings).
- **Method:** `grep -rhoE 'from "@mkbabb/glass-ui[^"]*"' demo` (import specifiers);
  the named-symbol set via the import-binding scan; the available surface via
  `@mkbabb/glass-ui`'s `package.json` `exports`.

---

## 1. Import-site inventory

**50 files** under `demo/` import from `@mkbabb/glass-ui` (some via more than one
subpath). By specifier:

| Specifier | Sites | What it carries |
|---|---:|---|
| `@mkbabb/glass-ui` (barrel) | 33 | Button, Card/CardContent, Input, Label, Slider, Separator, DropdownMenu*, Tooltip*, Avatar*, Dialog* (via CSSPasteDialog/KeyframesAddDialog), SegmentedTabOption |
| `@mkbabb/glass-ui/forms` | 6 | LabeledField, LabeledInput, LabeledSelect, LabeledSlider, LabeledSwitch |
| `@mkbabb/glass-ui/dock` | 6 | GlassDock, DockIconButton, DockDropdownTrigger, useOptionalDockContext |
| `@mkbabb/glass-ui/labeled-field` | 5 | LabeledField (direct subpath) |
| `@mkbabb/glass-ui/icon-tooltip` | 5 | IconTooltip |
| `@mkbabb/glass-ui/dark` | 4 | DarkModeToggle, useGlobalDark |
| `@mkbabb/glass-ui/tabs` | 3 | SegmentedTabOption (the pill-tab option shape) |
| `@mkbabb/glass-ui/keyboard` | 3 | registerShortcut |
| `@mkbabb/glass-ui/controls` | 3 | control primitives |
| `@mkbabb/glass-ui/status-dot` | 2 | StatusDot |
| `@mkbabb/glass-ui/{toggle-chip, motion-core, metric-badge, header-ribbon, glass-panel, aurora, animated-digit}` | 1 each | ToggleChip · useTouchGate · MetricBadge · HeaderRibbon · GlassPanel · aurora wash (OD-2) · AnimatedDigit |

**Named symbols consumed (39):** AnimatedDigit, Avatar, AvatarImage, Button, Card,
CardContent, DarkModeToggle, DockDropdownTrigger, DockIconButton, DropdownMenu(+Content/Item/Separator),
GlassDock, GlassPanel, HeaderRibbon, IconTooltip, Input, Label, LabeledField,
LabeledInput, LabeledSelect, LabeledSlider, LabeledSwitch, MetricBadge,
SegmentedTabOption, Separator, Slider, StatusDot, ToggleChip, Tooltip(+Content/Provider/Trigger),
registerShortcut, supportsViewTransitions, useGlobalDark, useOptionalDockContext, useTouchGate.

**Read:** the demo consumes glass-ui idiomatically and broadly — the chrome (dock,
header ribbon, dark toggle, keyboard), the form primitives (the labeled-field
family), the surfaces (Card/GlassPanel/Dialog/Tooltip/DropdownMenu), and the
motion seams (aurora, motion-core `useTouchGate`, `supportsViewTransitions`). This
is NOT a hand-rolled UI that ignores the design system; it is a glass-ui consumer
with a **small, ledgered** hand-roll residue (§2).

---

## 2. Hand-rolled twins of shipped components

Every load-bearing hand-roll already lives in **`demo/glass-ui-gaps.ts`** (the T.H1
gap ledger) with a dispatched letter ask (`docs/tranches/T/KF-TO-GLASSUI-BG.md`), a
`glassCaps` tripwire key, and a `proof:*` acceptance gate that flips on the re-pin.
This census confirms that ledger is COMPLETE — every twin below maps to a row.

| Hand-roll | Shipped twin | Disposition | Ledger row / gate |
|---|---|---|---|
| `KfPillTabs.vue` + `useKfPillTabs.ts` | `SegmentedTabs` (`/tabs`, pill variant) | **glass-ui-replace → T.H** | `segmentedTabsAriaOrientation` (BG-1+BG-3); retire on the aria-guard + material↔role decouple. Gate: `proof:glassui-aria-ask`. The fork is ARIA-correct-by-construction (`role=tablist`); glass-ui's pill emits `aria-orientation` unconditionally on `role=group` (WAI-ARIA 1.2 §6.3 breach). |
| `usePlayActuation.ts` + `TransportDock.vue` (dock-layer keepalive) | `GlassDock` @click actuation | **keep-with-reason → T.H** | `dockStrandKeepalive` (GU-4). Gate: `proof:workaround-deletion`. The collapse-crossfade strands a @click-only play toggle. |
| `MbabbMenu.vue` (pointerdown-open synthesis) | `DockDropdownTrigger` | **keep-with-reason → T.H** | `dockDropdownPointerdown` (BG-4). Gate: `proof:dock-popover-opens`. Press-scale reflow drops the native click. |
| `ChromeDock.vue` (dismiss-hold) | `GlassDock` dismiss contract | **keep-with-reason → T.H** | `dockDismissHold` (GU-3). Gate: `proof:workaround-deletion`. |
| `ControlsPaneWrapper.vue` + `useSheetGesture.ts` + `useSheet*` composables (bespoke peek/half/full sheet) | `@mkbabb/glass-ui/drawer` `<Drawer mode="live-behind">` (+ `/sheet`) | **keep-with-reason (HELD) → T.H** | `drawerDetentInset` (BG-11). Gate: `proof:glass-ui-gap-tripwire`. glass-ui 4.0.1 SHIPS the live-behind Drawer, but a detented Drawer is forced to `height:100%`/`bottom:0` (drawer.css `[data-glass-drawer-snap-points=true]`) → covers the bottom menubar at any snap; no bottom-inset / max-detent lever. Adopting as-is REGRESSES the owner-verified occlusion cure (52dvh reserve, ≤70dvh). Swap held behind BG-11; geometry decision owner-open (`verdicts/T.H3.md`, PENDING-OWNER). |

**Recorded no-band-aid gaps (in the ledger, no twin to delete — the version
dimension only):** `dockRestBlur` (GU-1), `dockMorphMeasure` (GU-2),
`staticBackdrop` (BG-5), `fontDisplayWeight` (BG-6), `specularWriterPublic` (BG-7,
served today by the public `/aurora` — do NOT hand-copy the internal composable).

**No un-ledgered hand-rolled primitive was found.** The dialogs
(`CSSPasteDialog`/`KeyframesAddDialog`/`KeyboardShortcutsModal`) consume glass-ui
`Dialog`; the form controls consume the labeled-field family; the toasts route
through `@utils/toastGuard` over `vue-sonner` (a delineated private-DOM contract,
not a glass-ui twin). `reka-ui` has ZERO direct demo consumers (it rides in only as
glass-ui's peer basis) — the last shadcn island (`ui/menubar`) was retired at S.C3b.

---

## 3. Consumed-vs-available gap

glass-ui@4.0.1 exports **~85 subpaths**; the demo consumes ~17. The unconsumed
surface is mostly out-of-scope for this demo's job (data-table, carousel,
command palette, search, sidebar, fourier-field, goo-blob, constellation,
concentric, pager-dots, notification, sortable-list, spa-view, …). Two unconsumed
subpaths are DELIBERATE-avoid / held, worth flagging for T.H:

| Available (unconsumed) | Why not consumed | Note for T.H |
|---|---|---|
| `./drawer`, `./sheet` | The bespoke sheet is occlusion-correct; the shipped Drawer regresses it (BG-11). | HELD behind `drawerDetentInset` (T.H3, owner-open). |
| `./instrument-chassis` | The demo composes its instrument panels bespoke (`InstrumentChassis` file-module in `components/instrument/`, S.D2 — DISTINCT from glass-ui's). | T.H owns the `InstrumentChassis` consumption EVAL (T.md §2 edge `T.H → T.F16/T.F5/T.F14`). Recorded, not owned here. |

The remaining unconsumed exports are genuine non-needs (no gap, no ledger row
required) — the demo is a 6-scene animation showcase, not a dashboard/app kit.

---

## 4. Feed-forward

- **→ T.H (glass-ui gap letter + consumption):** all five `glass-ui-replace` /
  `keep-with-reason` dispositions above are already dispatched via
  `KF-TO-GLASSUI-BG.md` and armed via `demo/glass-ui-gaps.ts` +
  `proof:glass-ui-gap-tripwire`. T.H owns: the aria-guard retirement (KfPillTabs
  fork → SegmentedTabs on publish), the dock keepalive/pointerdown/dismiss trio,
  the BG-11 Drawer geometry decision, and the `InstrumentChassis` consumption eval.
- **→ T.F terminal batch:** no NEW hand-roll to excise beyond the ledgered set;
  the demo purge (T.F23) is complete on the export/`any`/throttle axes; the
  glass-ui axis is a version-tripwire concern (T.H), not a T.F excision.
- **→ owner review packet:** the demo is an idiomatic glass-ui consumer; the
  hand-roll residue is FIVE ledgered, gate-armed, letter-dispatched band-aids —
  each dies on the corresponding glass-ui BG/BH publish, none is a silent fork.

**Disposition summary:** 1 glass-ui-replace (KfPillTabs, T.H) · 4 keep-with-reason
(all ledgered) · 0 delete · 0 un-dispositioned. No bespoke re-implementation
without a ledger entry (the lane-25-rec-2 born-RED condition is satisfied — the
tripwire's citation clause already patrols it).
