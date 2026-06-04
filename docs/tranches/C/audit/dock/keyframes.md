# Tranche-C constellation dock audit — keyframes.js CONSUMPTION lane

**Scope (inv-16):** READ across all repos; WRITE only under
`keyframes.js`. The glass-ui dock is glass-ui-OWNED — this is an AUDIT +
refined RECOMMENDATIONS routed outward, never a patch of vendor source.

**Lane:** keyframes.js dock CONSUMPTION —
`demo/@/components/custom/dock/` (TopDock.vue, index.ts) +
`demo/@/components/custom/animation-controls/AnimationMenuBar.vue` (bottom
transport dock). Cross-references the dock-related tranche-C design-findings
already filed.

**Verdict (gestalt):** keyframes is a *near-textbook* glass-ui dock
consumer. Both docks compose 100% from `@mkbabb/glass-ui/dock` primitives
with zero re-implemented dock chrome — no forked `GlassDock`, no
hand-rolled collapse state machine, no local `.glass-dock` style block
(verified: `grep .glass-dock demo/**/*.{vue,css}` → 0 source hits; the
scoped `data-v-ca5b7b33` `.glass-dock` rule in `demo/app/dist` is glass-ui's
own compiled SFC bundled into the demo build, not a demo fork). The only
demo-owned logic is *orchestration glue* over the vendor API: a ~18-line
popup-mutex, a controls-pane hover bridge, and the `always-expanded` mobile
mask. The residual debt is (a) the touch-gate bug mask (ASK-1, glass-ui-
owned), (b) two convergence opportunities where ≥2 consumers re-implement
the same glue, and (c) a stale "11 unnamed DockIconButton" inventory figure
that did NOT reproduce.

---

## 1. Consumed vs hand-rolled

### 1.1 glass-ui dock primitives CONSUMED (verbatim, no fork)

| Primitive | TopDock.vue | AnimationMenuBar.vue | Source |
|-----------|-------------|----------------------|--------|
| `GlassDock` | `:17,74` (`ref="dockRef"`, `:collapse-delay`, `:start-collapsed`, `:fit-content`, `:always-expanded`) | `:17` (`:always-expanded="true"`, `:fit-content`) | `glass-ui/dock/GlassDock.vue` |
| `DockLayerGroup` | `:118` (`:active`, `:show-rail="false"`) | — | `glass-ui/dock/DockLayerGroup.vue` |
| `DockLayer` | `:119` (`id="main"`) | — | `glass-ui/dock/DockLayer.vue` |
| `DockIconButton` | `:121` (controls collapse toggle) | `:75,84,113` (reset / trash / collapse-timeline) | `glass-ui/dock/DockIconButton.vue` |
| `DockSelectTrigger` | `:146,172` (controls-tab + scene selects) | `:31` (animation select) | `glass-ui/dock/DockSelectTrigger.vue` |
| `#collapsed` slot | `:211–218` | `:123–140` | `GlassDock.vue:363–369` two-layer pattern |
| `dockRef.keepOpen()` / `.release()` | `:101,102` | — | `GlassDock.vue:311` `defineExpose` |
| `dockRef.expanded` | `:77` (hover-sync watch) | — | `GlassDock.vue:311` |
| `dockRef.expand()` | — | `:182` (`onCollapsedPlayClick`) | `GlassDock.vue:311` |
| `.dock-separator` class | `:136,163,203` | `:72,110` | `dock.css:574` (glass-ui-owned utility) |

Shared chrome also consumed correctly: `StatusDot`
(`@mkbabb/glass-ui/status-dot`), `Select*` + `Button`
(`@mkbabb/glass-ui`), `IconTooltip` (`@mkbabb/glass-ui/icon-tooltip`).
`dock/index.ts` is a clean 3-line barrel: it re-exports `GlassDock` +
`DockLayerGroup` straight from `@mkbabb/glass-ui/dock` and adds only the
local `TopDock.vue` wrapper.

**Finding 1.1 — CONFIRMED: no dock chrome is re-implemented.** This is the
correct posture and matches design-findings.txt §8.

### 1.2 HAND-ROLLED in the demo (orchestration glue, not chrome)

**(a) The `TopDock.vue` wrapper itself (whole SFC).** A legitimate
composition layer: it binds scene/controls-tab selects, the controls-
collapse toggle, the collapsed pill summary, and the `#items` slot for
per-scene header buttons. This is *consumer composition*, not a primitive
fork — glass-ui ships no app-chrome "top navigation dock" preset, so this
is correctly demo-owned. (AnimationMenuBar.vue is the symmetric bottom
transport composition.)

**(b) Popup mutex** — `TopDock.vue:82–103`. ~18 lines:
`openPopup = ref<PopupKey | null>`, `popupModel(key)` returns a
get/set computed enforcing single-open, and a `watch(isAnyOpen)` driving
`dockRef.keepOpen()` / `dockRef.release()` so an open dropdown pins the
dock. glass-ui ships **no** single-open-at-a-time dropdown mutex, so the
glue is legitimate — but see §4.1 (convergence: a second copy of this idea
exists in the demo, `useExclusiveSelect.ts`).

**(c) Controls-pane hover bridge** — `TopDock.vue:74–79`. Watches
`dockRef.value?.expanded` and pushes it into the injected
`CONTROLS_PANE_HOVER_KEY` ref (`injectionKeys.ts:3`) so a sibling pane can
react to dock expansion. Pure app-wiring; correctly demo-owned.

**(d) The `safe-area-inset-top` fix** — `TopDock.vue:114`:
`top: calc(max(var(--work-area-top-offset, 0px), env(safe-area-inset-top, 0px)) + var(--dock-margin) / 4)`.
This is **demo-owned positioning** of a `position: inline` GlassDock inside
a `fixed` wrapper. The demo owns the fixed wrapper
(`TopDock.vue:112–116`) because it wants the dock centered at the top of the
work-area band (not glass-ui's `position: fixed` bottom-center default,
`GlassDock.vue:324`). The `--work-area-*-offset` tokens are demo-owned
(`style.css:19–26`); `--dock-margin` (`tokens.css:904`) and `--z-dock`
(`tokens.css:274`, via the `z-dock` Tailwind utility) are glass-ui-owned.
**This safe-area handling is correctly demo-side** — it is layout of the
dock *within the page*, which glass-ui's primitive deliberately does not own
when `position="inline"`. The symmetric bottom dock does the same:
`AnimationMenuBar.vue:4,7` uses
`pb-[max(calc(var(--dock-margin)/2),env(safe-area-inset-bottom))]` +
`bottom: var(--work-area-bottom-offset)`.

**(e) The always-expanded mask** — `TopDock.vue:117`
(`:always-expanded="isMobile"`) and `AnimationMenuBar.vue:17`
(`:always-expanded="true"`). See §2.

**(f) The collapsed-play "expand-then-act" patch** —
`AnimationMenuBar.vue:181–184`: `onCollapsedPlayClick()` calls
`dockRef.value?.expand()` *then* `emit('togglePlay')`. This is the
**single-gesture workaround for the same class of bug as ASK-1**, applied
to the collapsed-pill play button. It is masking the same "collapsed-pill
control needs the dock open first" friction in app logic. See §2 + §4.2.

**(g) The progress-dot** — `AnimationMenuBar.vue:49–60,262–274`. A
`conic-gradient` progress ring driven by a single `--dot-p` custom property,
companion to glass-ui's discrete `<StatusDot>`. This is engine/visual, not
dock chrome — out of dock-lane scope but noted: it is a genuine demo-owned
visual (a live-progress variant glass-ui's StatusDot does not provide).

---

## 2. How keyframes masks the double-click bug (ASK-1)

**The bug (glass-ui-owned).** `useTouchGate.ts` (the touch-gate behind
GlassDock) defers the first touch: `handleTouchStart` returns `false`
(`useTouchGate.ts:138`) and the gesture only *activates* the gate, and in
`GlassDock.onTouchEnd` (`GlassDock.vue:285–294`) the first tap on a
collapsed horizontal dock calls `expand()` but does **not** dispatch the
control beneath the finger. The second tap hits the now-expanded control.
That is the documented double-tap.

**The mask (demo-side, honest, temporary).**

- `TopDock.vue:117` — `:always-expanded="isMobile"` (`isMobile` =
  `useMediaQuery("(max-width: 1023px)")`, `:65`). On touch viewports the
  top dock mounts pinned, so `GlassDock.shouldGateTouch()` returns `false`
  (it requires `!alwaysExpanded.value`, `GlassDock.vue:264–266`) — the
  collapsed-pill-first-tap state is never live, so the double-tap can never
  occur. Desktop keeps the collapse/hover affordance.
- `AnimationMenuBar.vue:17` — `:always-expanded="true"` unconditionally.
  Its inline comment (`:9–16`) documents a *second, distinct* reason:
  x-position stability of the transport buttons (the collapsed summary's
  play button and the full layer's play button sit at different x, so a
  hover-then-click-without-moving lands on a sibling). This is **always-
  expanded for a layout reason that also happens to suppress the touch
  gate** — a stronger justification than the top dock's pure-mask.
- `AnimationMenuBar.vue:181–184` — `onCollapsedPlayClick()` =
  `expand()` then `togglePlay()`. Because the bottom dock is
  `always-expanded`, this collapsed handler is effectively dead on the
  shipped path, but it is the canonical "single-gesture expand-then-act"
  shape the ASK-1 fix should generalize into glass-ui (see §4.2).

**Filed correctly.** ASK-1
(`docs/tranches/B/asks/glass-ui-adoption-asks.md:10–26`) names
`TopDock.vue:117` + `AnimationMenuBar.vue`, attributes the defect to
glass-ui `useTouchGate`/`GlassDock`, declares **no keyframes-side enabler**
(purely glass-ui-internal), and commits to removing the mask once glass-ui
ships. design-findings.txt §6 confirms the posture (SHIP, no demo action;
"the `always-expanded` mask is the only outstanding demo-side residue").
**This is exact inv-16 discipline** — the demo does not aria/touch band-aid
around the vendor.

**Refinement to ASK-1 (this audit).** The ASK currently frames the fix as
"first tap expands AND dispatches." The cleaner glass-ui-internal landing is
the shape the demo *already wrote by hand* at
`AnimationMenuBar.vue:181–184`: make the collapsed pill a single full-pill
button whose tap runs `expand()` then forwards the gesture to the control
under it (expand-then-act in one gesture). The demo's `onCollapsedPlayClick`
is the de-facto reference implementation — point glass-ui at it.

---

## 3. Divergences from glass-ui's dock idiom

**D1 — Single static `DockLayerGroup`/`DockLayer` in TopDock**
(`TopDock.vue:118–119`, `activeLayer` is a `computed(() => "main")` that
never changes, `:106–108`). `DockLayerGroup` exists to crossfade between
*multiple* registered layers via a switcher rail (`DockLayerGroup.vue:7–20`,
rail hidden when `layers.length <= 1`, `:97`). With one layer and
`:show-rail="false"`, the group/layer pair is **inert overhead** — a host
`div` (`DockLayer.vue:46`) plus an unused `useLayerTransition` FLIP machine
plus a `view-transition-name` (`DockLayerGroup.vue:70–77`). The comment at
`:105` ("extensibility for future layers") states the intent: it is staged
for a future multi-layer top dock. **Disposition: RECORD** — idiomatically a
single-layer dock should put its content directly in the default `<slot>`
(as AnimationMenuBar.vue does, no DockLayerGroup at all). If the multi-layer
future is real, keep it; if not, drop the wrapper. Not a defect, a latent
simplification.

**D2 — `position: inline` GlassDock inside a demo `fixed` wrapper**
(`TopDock.vue:112–116`, `AnimationMenuBar.vue:2–8`). glass-ui's
`position="fixed"` (`GlassDock.vue:324`) anchors bottom-center; the demo
wants top-center (TopDock) and a work-area-aware bottom (menubar), so it
leaves the dock `inline` (the default) and wraps it in its own `fixed`
positioning context. **This is the intended escape hatch** — `position`
defaults to `"inline"` precisely so consumers can own placement. Not a
divergence to fix; documents the seam (§4.3).

**D3 — `DockSelectTrigger` wrapping reka-ui `Select` directly** rather than
glass-ui's `DockDropdownTrigger`. `TopDock.vue:139–161,166–201` and
`AnimationMenuBar.vue:22–67` pair `DockSelectTrigger` with reka-ui
`Select`/`SelectContent`. This is idiomatic — `DockSelectTrigger`'s
docstring (`DockSelectTrigger.vue:7–14`) says it *is* the Select trigger for
GlassDock. No divergence.

**D4 — Manual dock-open pinning via `keepOpen`/`release` watch**
(`TopDock.vue:100–103`). The demo wires the popup-mutex to dock pinning by
hand. glass-ui's `DockSelectTrigger` does **not** auto-pin the dock while
its dropdown is open — so the consumer must thread `keepOpen`/`release`
itself. This is a **real API gap** (§4.3), but the demo's handling is
correct given the gap.

---

## 4. What keyframes re-implements that belongs upstream (convergence)

**C1 — Single-open-at-a-time dropdown mutex (≥2 consumers).** The demo has
TWO implementations of "only one dropdown open at a time":
1. `TopDock.vue:82–103` — `openPopup` + `popupModel(key)` + the
   `keepOpen`/`release` watch (dock-aware).
2. `demo/@/composables/useExclusiveSelect.ts` — a generic mutual-exclusion
   composable (per `demo/CLAUDE.md`: "useExclusiveSelect.ts — Mutual-
   exclusion for dropdowns: only one open at a time").

Two implementations of the same idea in one repo ⇒ the convergence test
fires. **Disposition:** first, *internally* converge — `TopDock.vue` should
consume `useExclusiveSelect` instead of re-deriving `popupModel` inline
(keyframes-owned cleanup, bookable in C). Second, *outward* — if glass-ui
later ships a dock-popup-mutex / `useExclusiveOpen` primitive that also
threads `keepOpen`/`release`, route this glue to it. design-findings.txt §8
already books this as a "future outward-adoption candidate, not an ask";
this audit upgrades it: the demo-internal duplication is itself a finding,
fixable now without glass-ui.

**C2 — Collapsed-pill "expand-then-act" single gesture.** The hand-rolled
`AnimationMenuBar.vue:181–184` (`expand()` then `togglePlay()`) is the
exact behavior ASK-1 asks glass-ui to make native (§2). It is currently
demo-local because the primitive's collapsed pill only *expands* on first
interaction. **Disposition:** belongs upstream — it is the reference shape
for the ASK-1 fix; keyframes should cite it in ASK-1 (refinement above).
Two consumers already feel this pain surface (the top dock via the mask, the
bottom dock via this handler).

**C3 — Dock placement tokens.** The demo owns `--work-area-top-offset` /
`--work-area-bottom-offset` / `--dock-icon-height` (`style.css:19–26`) to
position inline docks and reserve exclusion bands. layout-rhythm §2/§5
already shows the bottom token `--dock-menubar-reserve` is *undefined*
(`AnimationControlsGroup.vue:461`) — a demo bug, fixed in C.W2 by deriving
top+bottom from one symmetric pair. **Not upstream** (these are app-layout
tokens), but the *pattern* — "reserve a dock-exclusion band from the dock's
own size tokens" — is a candidate glass-ui could document as a recipe
(`--dock-icon-height` is the glass-ui-side input). RECORD only.

---

## 5. Dock-related tranche-C findings already filed (cross-reference)

**The "11 unnamed DockIconButton a11y" figure is STALE — did NOT
reproduce.** It originates in the lead grounding
(`audit/grounding.txt:31`: "DockIconButton without title/aria-label: 11")
and is echoed in `PROGRESS.md:42` ("11 unnamed dock buttons"). The
a11y-responsive lane investigated and **corrected** it
(design-findings.txt §10, a11y-responsive.md §10): *every* `DockIconButton`
in the demo carries a name. Verified independently in this audit — all 5
source `<DockIconButton>` sites are named:

| Site | Name source |
|------|-------------|
| `TopDock.vue:121` | `:title="isControlsPanelOpen ? 'Close controls' : 'Open controls'"` (`:123`) |
| `AnimationMenuBar.vue:75` | `title="Reset animation"` |
| `AnimationMenuBar.vue:84` | `title="Clear all & reload"` |
| `AnimationMenuBar.vue:113` | `title="Collapse timeline"` |
| `AnimationControlsControls.vue:72` | `title="Edit easing curve"` |
| `AnimationControlsControls.vue:126` | `title="Back"` (`:128`) |

(6 sites; all titled. The "11" never matched the codebase.) The *real*
`button-name` lighthouse fails come from glass-ui's `glass-wash`
select/switch buttons, NOT `DockIconButton` (design-findings.txt §3, §10).
**Disposition: correct the inventory in C's plan** — the "11 DockIconButton"
figure is dead and should be struck from `grounding.txt:31` / `PROGRESS.md`.

**The genuine dock-related a11y/responsive findings that DO bite:**

- **§10 [low] — `title`-only naming is sufficient but `IconTooltip` is the
  semantic home.** All 6 titled buttons are already wrapped in
  `<IconTooltip text="…">`, so the accessible name exists adjacent;
  `title` is invisible to touch / unreliable for SR. **Outward refinement:**
  glass-ui's `IconTooltip` should thread `text` onto the wrapped control's
  `aria-label` (single source of truth). Minor; RECORD.
- **§7 [medium] — Dock icon-button touch targets 40px on mobile**
  (`dock.css:716`, `--dock-control-size` defaults to 2.5rem). Below WCAG
  2.5.5 / Apple HIG 44px. The bottom-dock reset/trash/play row + the
  compact easing-edit/back buttons ship sub-44px. **Outward ask** (glass-ui
  token default under `@media (pointer: coarse)`); keyframes enabler: none.
- **§5 [high] — Scene-icon `<img>` in `DockSelectTrigger` flagged
  `image-alt`.** `TopDock.vue:173` *does* set `:alt`, so the flagged node is
  the **collapsed-pill img** (`TopDock.vue:212`, no `alt`) or the menubar
  select-icon. **Demo-owned fix** (`alt=""` for decorative scene icons,
  since the label already names the scene) + verify glass-ui's
  `DockSelectTrigger` forwards `alt` from the slotted img.
- **§9 [medium] — Focus order across teleported PlaybackRibbon / advanced
  pane.** Dock controls keep glass-ui focus-visible rings (sound); the risk
  is teleport reordering, not dock chrome. Out of strict dock-lane scope.

**ASK-1 (dock double-click)** —
`docs/tranches/B/asks/glass-ui-adoption-asks.md:10–26`. Filed, masked
honestly, no demo patch. Refinement above (cite the demo's
`onCollapsedPlayClick` as the reference fix shape).

**API gaps glass-ui should close (consolidated, outward):**

1. **First-tap-acts on collapsed touch docks** (ASK-1) —
   `useTouchGate`/`GlassDock`. Reference shape:
   `AnimationMenuBar.vue:181–184`.
2. **`DockSelectTrigger` should auto-pin its parent dock while its dropdown
   is open** (`keepOpen`/`release` on open/close) — closes the manual
   `watch(isAnyOpen)` glue (`TopDock.vue:100–103`) and the D4 gap. Today
   every consumer threads pinning by hand.
3. **A dock-popup-mutex / `useExclusiveOpen` primitive** that composes the
   above — would absorb C1 (the `popupModel`/`useExclusiveSelect`
   duplication).
4. **`IconTooltip text → wrapped-control aria-label`** — §10; makes the
   tooltip the single accessible-name source for `DockIconButton`.
5. **44px dock control default under `@media (pointer: coarse)`** — §7.

---

## 6. Summary table

| # | Finding | File:line | Owner | Disposition |
|---|---------|-----------|-------|-------------|
| 1.1 | No dock chrome re-implemented; 100% glass-ui primitives | `dock/index.ts:1–3`, `TopDock.vue:7–20`, `AnimationMenuBar.vue:156–175` | keyframes | SHIP (confirms posture) |
| 2 | Double-click masked via `always-expanded` (honest, temporary) | `TopDock.vue:117`, `AnimationMenuBar.vue:17` | glass-ui (ASK-1) | SHIP mask until glass-ui fix; remove on ASK-1 land |
| 2′ | ASK-1 refinement: cite `onCollapsedPlayClick` as fix shape | `AnimationMenuBar.vue:181–184` | glass-ui (ASK-1) | BOOK (refine ASK-1) |
| D1 | Single static `DockLayerGroup`/`DockLayer` (inert overhead) | `TopDock.vue:106–108,118–119` | keyframes | RECORD (drop wrapper unless multi-layer ships) |
| D4 | Manual `keepOpen`/`release` pin (DockSelectTrigger gap) | `TopDock.vue:100–103` | glass-ui (API gap) | BOOK outward (auto-pin trigger) |
| C1 | Popup-mutex duplicated (`popupModel` vs `useExclusiveSelect`) | `TopDock.vue:82–103`, `composables/useExclusiveSelect.ts` | keyframes (now) → glass-ui (later) | SHIP internal converge; BOOK outward |
| 5.§10 | `title`-only naming; IconTooltip is the semantic home | `TopDock.vue:123`, `AnimationMenuBar.vue:75,84,113`, `AnimationControlsControls.vue:72,128` | glass-ui (IconTooltip) | RECORD outward refinement |
| 5.§7 | Dock icon-button 40px < 44px on touch | `dock.css:716` | glass-ui (token default) | BOOK outward ask |
| 5.§5 | Collapsed-pill scene `<img>` missing `alt` | `TopDock.vue:212` | keyframes + verify glass-ui passthrough | SHIP demo `alt=""`; verify forwarding |
| 5.stale | "11 unnamed DockIconButton" did NOT reproduce | `grounding.txt:31`, `PROGRESS.md:42` | keyframes (inventory) | STRIKE (all 6 sites named) |

**Files in scope:**
`/Users/mkbabb/Programming/keyframes.js/demo/@/components/custom/dock/TopDock.vue` ·
`/Users/mkbabb/Programming/keyframes.js/demo/@/components/custom/dock/index.ts` ·
`/Users/mkbabb/Programming/keyframes.js/demo/@/components/custom/animation-controls/AnimationMenuBar.vue` ·
`/Users/mkbabb/Programming/keyframes.js/demo/@/components/custom/animation-controls/controls/AnimationControlsControls.vue` ·
`/Users/mkbabb/Programming/keyframes.js/demo/@/composables/useExclusiveSelect.ts` ·
`/Users/mkbabb/Programming/keyframes.js/demo/@/styles/style.css:19–26`

**glass-ui evidence (read-only):**
`GlassDock.vue:264–294,311,324`, `useTouchGate.ts:123–162`,
`useDockState.ts:246–263`, `DockSelectTrigger.vue:7–14`,
`DockLayerGroup.vue:7–20,70–97`, `dock.css:574,716`,
`tokens.css:274,904`.

**Asks ledger:**
`/Users/mkbabb/Programming/keyframes.js/docs/tranches/B/asks/glass-ui-adoption-asks.md`
(ASK-1 dock double-click; ASK-3 LabeledField is non-dock).
