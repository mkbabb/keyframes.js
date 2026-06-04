# Tranche-C — dock DIVERGENCE + CONVERGENCE map (cross-repo)

**Lane.** The synthesis layer over the four tranche-C dock audits
(`dock/{glass-ui,keyframes,value-js,fourier}.md`). It folds the per-consumer
findings into one cross-repo picture: a capability × consumer matrix
(glass-ui-primitive vs hand-rolled), the patterns ≥2 consumers re-implement
(upstream candidates), the patterns that diverge for good reason (stay
per-consumer), the API gaps glass-ui must close to stop the forking, and a
ranked upstream-to-glass-ui list.

**Constraint (inv-16).** Authored in keyframes.js (the lead's repo); READ-only
across glass-ui / value.js / fourier. The dock is **glass-ui-OWNED** — this is
an AUDIT + RECOMMENDATIONS routed outward, never a patch. Every row is grounded
in `file:line` against the source read at HEAD (glass-ui working tree,
2026-06-04).

**The three consumers.**
- **keyframes** (`demo/@/components/custom/dock/TopDock.vue`,
  `animation-controls/AnimationMenuBar.vue`) — app-chrome top dock + transport
  dock. *Near-textbook consumer; near-zero hand-roll.*
- **value.js** (`demo/@/components/custom/dock/{Dock,DockViewSelect,…}.vue` +
  `composables/*`) — the **heaviest** consumer: a 4-layer nav chrome with a
  nested sub-layer group, view-select, profile/auth, mobile overflow. *Most
  forks; most stress.*
- **fourier** (`EditorControlsDock.vue`, `CanvasControlsDock.vue`,
  `AnimationControls.vue`) — editor/canvas/animation triad. *Clean consumer;
  forks are CSS re-declarations, not component forks.*

**Headline.** The dock primitive is mature and three independent consumers
adopt it well — no consumer forks a glass-ui *component*. But the cross-repo
view exposes a tight cluster of repeated hand-rolls that the per-consumer
audits each saw only partially: **the single-open popup mutex is re-implemented
in ALL THREE consumers** (the strongest convergence signal in the whole map),
**the collapsed-touch double-tap is masked by TWO consumers and un-masked-but-
exposed by the third** (ASK-1, the one correctness bug), and **value.js forks
`useLayerTransition` purely for an ergonomic `layerProps(id)` return shape**.
Two findings from the per-consumer audits are also **stale and corrected here**
by reading the live glass-ui source: the "40px touch target" (glass-ui ships a
44px coarse-pointer floor, `dock.css:1134-1152`) and the "11 unnamed
DockIconButton" inventory (never reproduced; all consumer sites are named).

---

## §1 — Capability × consumer matrix

`P` = consumed from the glass-ui primitive (no fork). `H` = hand-rolled in the
consumer. `H(mask)` = hand-rolled workaround for a glass-ui bug. `—` = not used.
`FORK` = a re-implementation of glass-ui-provided logic. Each cell cites the
load-bearing `file:line`.

| # | Capability | glass-ui provides? | keyframes | value.js | fourier |
|---|---|---|---|---|---|
| C-01 | **Dock chassis** (collapse/hover/pin state machine, FLIP width morph, focus parity, ref-counted keep-open) | YES — `GlassDock` + `useDockState.ts:76` | **P** `TopDock.vue:17`, `AnimationMenuBar.vue:17` | **P** `Dock.vue:93` | **P** `EditorControlsDock.vue:56`, `CanvasControlsDock.vue:41`, `AnimationControls.vue:58` |
| C-02 | **Two-layer collapsed↔expanded** (`#collapsed` + default slot) | YES — `GlassDock.vue:350-371` | **P** `TopDock.vue:211-218`, `AnimationMenuBar.vue:123-140` | **P** (via layer group) | **P** all three docks |
| C-03 | **Multi-layer group + crossfade** (`DockLayerGroup`/`DockLayer`) | YES — `DockLayerGroup.vue` | **P (degenerate)** `TopDock.vue:118-119` single static layer; `:show-rail="false"` | **P (stressed)** `Dock.vue:94` 4 layers, `:show-rail="false"` | — (single `v-if` swap in parent, `VisualizationView.vue:235-248`) |
| C-04 | **Nested sub-layer group** (a 2nd managed pane-stack inside ONE layer) | **NO** — `DockLayerGroup` is single-level | — | **FORK** `ActionBarLayer.vue:54-58,65` re-uses forked `useLayerTransition` one level deeper | — |
| C-05 | **Layer-precedence reducer** (N boolean conditions → 1 active layer id) | **NO** — group has crossfade, no precedence model | **H (trivial)** `computed(()=>"main")` `TopDock.vue:106-108` | **H** `Dock.vue:77-87` 4-condition reducer, "call order does not matter" hazard | — |
| C-06 | **View-select** (reka-ui `Select` inside a dock trigger) | YES — `DockSelectTrigger.vue:7-14` | **P** `TopDock.vue:146,172`, `AnimationMenuBar.vue:31` | **P** `DockViewSelect.vue:3,52` | — |
| C-07 | **Dropdown trigger** (reka-ui `DropdownMenu` in a dock trigger) | YES — `DockDropdownTrigger.vue` | — | **P** `MobileMenuDropdown.vue:11,34` | **P** `AnimationControls.vue:103-125` (was hand-rolled `.menu-popup`, now ADDRESSED) |
| C-08 | **Single-open popup MUTEX** (only one dropdown open at a time + swap delay) | **NO** — none in glass-ui (grep: 0 `PopupMutex`/`useExclusive` in `glass-ui/src`) | **H ×2** `TopDock.vue:82-103` inline `popupModel` + `composables/useExclusiveSelect.ts` | **H** `composables/usePopupMutex.ts` (85 LOC, 4 popups, 180ms swap) | — (single popup; no mutex needed) |
| C-09 | **`isAnyOpen → keepOpen/release` bridge** (pin the dock while any popup is open) | **HALF** — `keepOpen`/`release` provided (`GlassDock.vue:311`, `dockContext.ts:31`); the *binding* is not | **H** `TopDock.vue:100-103` `watch(isAnyOpen)` | **H** `Dock.vue:60-73` `watch` → imperative; AND DI path `ActionButton.vue:79,81` via `useOptionalDockContext` | **P (per-control)** `keep-dock-open` on HoverPopover clusters `EditorControlsDock.vue:103,134`, `CanvasControlsDock.vue:44` |
| C-10 | **expanded → host-state sync** (read dock open-state into app state) | **PARTIAL** — `expanded` exposed (`GlassDock.vue:311`); NO `@expand`/`@collapse` event on `GlassDock` | **H** `TopDock.vue:74-79` template-ref `watch(dockRef.expanded)` | **H** `Dock.vue:71` reads `dockRef.value?.expanded` | **P (in-band)** `CanvasControlsDock.vue:26,34-37` declares its OWN `update:expanded` event → `VisualizationView.vue:212` `v-model` (the F12 fix) |
| C-11 | **Collapsed-touch first-tap = ACT** (tap a collapsed dock and fire the control in one gesture) | **NO — BUG** `GlassDock.vue:268-294` + `useTouchGate.ts:123-162` swallow tap-1 | **H(mask)** `:always-expanded="isMobile"` `TopDock.vue:117`; `AnimationMenuBar.vue:181-184` hand-rolls expand-then-act | **H(mask)** `:always-expanded="!isDesktop"` `Dock.vue:93` | **NONE — EXPOSED** all 3 docks collapse-on-load, no mask; `CanvasControlsDock.vue:98-101` even shows tappable glyphs in the collapsed slot |
| C-12 | **Safe-area inset placement** (`env(safe-area-inset-*)` for fixed/sticky docks) | **NO** — `dock.css` has ZERO `env(safe-area-inset-*)` (grep: 0); `position="fixed"` emits only `bottom-[var(--dock-pos)]` `GlassDock.vue:324` | **H** `TopDock.vue:114` `calc(max(--work-area-top-offset, env(safe-area-inset-top))…)`; `AnimationMenuBar.vue:4,7` symmetric bottom | **H** value.js owns its `fixed` wrapper placement (`Dock.vue` mounts `inline` in a host-positioned wrapper) | **H** docks anchored by parent overlay (`VisualizationView.vue`) |
| C-13 | **Exclusion-zone / work-area offset** (reserve a band so the dock avoids app chrome) | **NO** — no offset/exclusion contract on the primitive | **H** `--work-area-top/bottom-offset` `style.css:19-26` | **H** value.js host-positions its `fixed` wrapper | **H** parent overlay reserves the anchor |
| C-14 | **`position` escape hatch** (inline default so the consumer owns placement) | YES — `position` defaults `"inline"` `GlassDock.vue:89` | **P** `TopDock.vue:112-116` inline-in-fixed-wrapper | **P** `Dock.vue` inline-in-fixed-wrapper | **P** parent-anchored |
| C-15 | **Always-expanded** (disable collapse) | YES — `alwaysExpanded` prop `GlassDock.vue:128` | **P** (used as the C-11 mask) | **P** (used as the C-11 mask) | — (deliberately NOT used) |
| C-16 | **Dock icon button** (fixed-square, accent retint via `--btn-hover-color`, `.is-active` state) | YES — `DockIconButton.vue` + `dock.css:745,775` | **P** `TopDock.vue:121`, `AnimationMenuBar.vue:75,84,113` | **P** `Dock.vue:101,102,…`, `ActionBarLayer.vue:93` (uses `compact`, `:aria-pressed`, `type="submit"`, `:disabled`) | **P + retint** `.is-amber/.is-sky/.is-rose` `EditorControlsDock.vue:199-201` (intended extension hook) |
| C-17 | **Dock separator / spacer** (`.dock-separator`, `.dock-spacer`) | YES — `dock.css:574-580,582-584` + `--dock-separator-height` token `:57` | **P** `TopDock.vue:136,163,203`, `AnimationMenuBar.vue:72,110` (uses the global class) | **P** (global class) | **FORK** `.dock-separator`/`.dock-spacer` RE-DEFINED locally in scoped style — `EditorControlsDock.vue:179-184,186-188`, `CanvasControlsDock.vue:106-112` (drifts: `1.5rem`/`foreground-20%` vs token/`--surface-tint-15`) |
| C-18 | **In-dock free-text badge** ("N pts", count pill) | **NO** — `MetricBadge` is numeric+unit only | **H** demo `dock-badge` class | — | **H** `.dock-badge` `EditorControlsDock.vue:190-196` |
| C-19 | **Action-bar reveal** (a control animates in via `grid 0fr→1fr`) | **NO** — no width-reveal affordance | — | **H** `.action-bar-toggle-slot` `Dock.vue:215-234` | — |
| C-20 | **Status / "live toggle" indicator dot** (corner dot on a control) | **PARTIAL** — `StatusDot` exists, 0 dock adoption, no corner-on-button placement | **P** uses `StatusDot` `TopDock.vue` (status row) | **P** per-item status dots in view-select | **FORK-adjacent** `.view-dot` bespoke `CanvasControlsDock.vue:48,121-130` |
| C-21 | **Accessible names on controls** (every dock control has an a11y name) | **PARTIAL** — `$attrs` forwarded; NO required-name contract or default | **H (correct)** `:title`/`aria-label` on every control `TopDock.vue:123`, `AnimationMenuBar.vue:75,84,113` | **H (correct)** `:aria-pressed`/`aria-label` on buttons | **H (correct)** `:title` + `IconTooltip` on every control |
| C-22 | **Rail tablist semantics** (rail = `role="tablist"`, roving tabindex) | **PARTIAL/BUG** — rail uses `<button :aria-pressed>` `DockLayerGroup.vue:101-109`, should be `aria-selected`+tablist (AT.W6-dock-b PLANNED) | — (`:show-rail="false"`) | — (`:show-rail="false"`) | — (no layer group) |
| C-23 | **View-Transition names** (per-instance `view-transition-name`, pairwise-distinct) | YES — `GlassDock.vue:205-214`, `DockLayerGroup.vue:67-77` from `useId()` | **P** (free; consumer does nothing) | **P** in upstream group; **FORK loses it** for the nested sub-layer (forked `useLayerTransition` lacks the native-VT path) | **P** (free) |
| C-24 | **Layer crossfade composable** (`useLayerTransition`: VT-or-FLIP size morph) | YES — `useLayerTransition.ts:49` (native-VT path `:121-133`, axis `:14,59`, computed cleanup `:77-88`) | **P** (internal to GlassDock) | **FORK** `composables/useLayerTransition.ts` (123 LOC) for a `layerProps(id)` shim; **drifted behind** — no native-VT path, width-only, hard-coded `setTimeout(…,400)` | **P** (internal; not used directly) |
| C-25 | **DockSelectTrigger label clamp control** (un-clamp long view-option labels) | **NO** — `SelectTrigger.vue:36` forces `[&>span]:line-clamp-1`, no `clampLabel` prop | — | **H(workaround)** `[&>span]:line-clamp-none` child-selector hack `DockViewSelect.vue:49-64`; OPEN across 7 value.js tranches | — |
| C-26 | **44px coarse-pointer touch floor** | **YES** — `dock.css:1134-1152` lifts `--dock-control-size`→`--dock-touch-target` (2.75rem) under `@media (pointer: coarse)` + a standalone button-level floor; the AP.W3 R0G-6 history fixed the exact 40px-pinning bug | **P (free)** | **P (free)** | **P (free)** — *the audit "40px touch" figures (`dock.css:716`) are STALE; superseded upstream (see §6)* |
| C-27 | **App-domain logic** (admin mode, auth, scene routing) | NO — correctly app-owned | **H (correct)** scene/controls binding `TopDock.vue` | **H (correct)** `useDockAdminMode.ts`, profile/auth menus | **H (correct)** editor-tool ops |

**Reading the matrix.** Three columns of `P` for C-01/C-02/C-06/C-16 — the
*core* dock is consumed identically and cleanly everywhere. The `H` clusters
that repeat across columns are the convergence signal: **C-08/C-09 (mutex +
bridge)** and **C-11 (touch)** light up in 2-3 consumers; **C-12/C-13
(safe-area/exclusion)** light up in 2-3; **C-10 (expanded sync)** in 3 (and
fourier already solved it the right way, which becomes the reference). The
`FORK` cells — **C-04/C-24 (value.js layer transition), C-17 (fourier
separator)** — are re-implementations of provided logic and are the cleanest
deletes once the gap closes.

---

## §2 — Patterns ≥2 consumers RE-IMPLEMENT (upstream candidates)

Ranked by how many consumers re-roll it and how mechanical the convergence is.

### U-1 — Single-open popup mutex + `keepOpen/release` auto-bind (C-08 + C-09) — **ALL 3 / strongest signal**
The same idea is hand-rolled in every consumer that has ≥2 dock dropdowns:
- keyframes: `TopDock.vue:82-103` *inline* `popupModel(key)` **and** a *second*
  copy as `composables/useExclusiveSelect.ts` (two impls in ONE repo).
- value.js: `composables/usePopupMutex.ts` (85 LOC; 4 popups; 180ms swap;
  `isAnyOpen → keepOpen/release` at `Dock.vue:73`).
- fourier: only one popup per dock, so no mutex — but it DOES re-roll the
  `keepOpen/release` half per-control (`keep-dock-open`), and the
  `useOptionalDockContext` DI surface it would consume is the same.

Three independent re-implementations of "only one open at a time, hold the dock
open while any is open." glass-ui ships the *primitives* it needs
(`keepOpen`/`release`/`isHeld`/`useOptionalDockContext`) but not the
*composition*. **Grep-confirmed there is no `PopupMutex`/`useExclusive` anywhere
in `glass-ui/src` today** — so whatever the "retired at D-II" history value.js's
comment records, no upstream equivalent exists now. This is the highest-leverage
convergence target.

### U-2 — Collapsed-touch first-tap = ACT (C-11) — **3 consumers feel it** (ASK-1)
The one correctness bug. Tap-1 on a collapsed horizontal dock is swallowed
(`GlassDock.vue:274-277,289-293` `preventDefault`+`stopPropagation`+`expand()`;
`useTouchGate.ts:138,154-156` returns `false` then merely `activate`s) — the
control under the finger never fires; it needs tap-2. Two consumers mask it
(keyframes `:always-expanded="isMobile"`, value.js `:always-expanded="!isDesktop"`)
and the third (fourier) ships *exposed* (no mask, tappable glyphs in the
collapsed slot). **Two independent consumers landing the identical
`always-expanded`-on-mobile mask for the identical root cause is the strongest
possible evidence the fix belongs upstream.** Reference shape already written by
hand: keyframes' `AnimationMenuBar.vue:181-184` `onCollapsedPlayClick()` =
`expand()` then act.

### U-3 — `useLayerTransition` ergonomic return (`layerProps(id)`) (C-24/C-04) — **value.js forks; fourier nested-need latent**
value.js forked the *entire* composable (123 LOC) only because the upstream
return is too low-level for a template that wants per-id `{ class, inert }`
(`UseLayerTransitionReturn` exposes `currentLayer`/`leavingLayer`/`onTransitionEnd`
only — `useLayerTransition.ts:17-24`). The fork has since **drifted behind
upstream**: no native-VT fast path (`useLayerTransition.ts:121-133`), no axis
param (`:14,59-62`), hard-coded `setTimeout(…,400)` instead of the computed
`cleanupDelayMs` (`:77-88`). Adding a `layerProps(id)` / `layerClass(id)` +
`layerInert(id)` convenience to the upstream return retires the fork AND its
nested sub-layer (C-04) inherits native-VT + axis for free. Only value.js forks
it today, but the *nested-pane-stack* need (C-04) is a second, distinct pressure
on the same composable.

### U-4 — Safe-area / exclusion-zone placement tokens (C-12 + C-13) — **3 consumers re-derive**
Every fixed/sticky consumer re-derives the same `calc(max(env(safe-area-inset-*),
…))` and owns its own work-area-offset tokens (keyframes
`TopDock.vue:114` + `style.css:19-26`; value.js host-wrapper; fourier
parent-overlay). The dock has **zero** `env(safe-area-inset-*)` in `dock.css`
and `position="fixed"` emits only a bottom offset (`GlassDock.vue:324`). A
`--dock-safe-inset-*` token (or `safeArea?` prop) folding the env() math into
fixed/sticky placement kills the repeated `calc()`. (Lower mechanical certainty
than U-1/U-3 because each consumer's *exclusion band* is genuinely app-specific —
see §3 D-3 — but the *safe-area* half is pure boilerplate.)

### U-5 — `expanded → host` declarative event (C-10) — **3 consumers, fourier shows the fix**
keyframes (`TopDock.vue:74-79`) and value.js (`Dock.vue:71`) read the exposed
`expanded` ref through a template-ref `watch`; fourier ALREADY converted its own
dock to a declarative `update:expanded` event consumed by `v-model:expanded`
(`CanvasControlsDock.vue:26,34-37` → `VisualizationView.vue:212`, the F12 fix).
fourier's pattern is the reference; glass-ui should declare `@expand`/`@collapse`
(or `v-model:expanded`) on `<GlassDock>` so the other two stop reaching through a
template ref.

### U-6 — In-dock free-text badge (C-18) — **2 consumers**
keyframes (`dock-badge` class) and fourier (`.dock-badge` "N pts",
`EditorControlsDock.vue:190-196`) both hand-roll a `tabular-nums`,
foreground-tinted in-dock text pill. `MetricBadge` covers numeric+unit, not
free-text. A `DockBadge` slot-child (or `MetricBadge variant="text"`) keyed off
dock density tokens removes the duplication. Low effort, low stakes.

---

## §3 — Patterns that DIVERGE for good reason (stay per-consumer)

These are NOT convergence candidates — the divergence is correct.

- **D-1 — Layer count & structure.** keyframes runs a *degenerate* single static
  layer (`TopDock.vue:106-108`, a latent simplification — drop the group unless
  multi-layer ships); value.js runs *4 dispatched layers + a nested sub-group*;
  fourier runs *no layer group at all* (parent `v-if` swap). The structure is
  genuinely app-shaped. glass-ui correctly provides the *mechanism*
  (`DockLayerGroup`) and lets each consumer choose 0/1/N layers. **Keep.** (The
  precedence *reducer*, C-05, is a borderline gap — §4 G-5 — but the layer
  topology itself is rightly per-consumer.)

- **D-2 — `position: inline` inside a consumer-owned `fixed` wrapper.** All three
  leave the dock `inline` (the default) and own the outer positioning context so
  they can anchor top-center / work-area-bottom / canvas-corner. This is the
  intended escape hatch (`position` defaults to `"inline"` precisely for this).
  **Keep** — the *safe-area math* inside the wrapper is the convergence target
  (U-4), not the wrapper itself.

- **D-3 — Exclusion-band tokens.** The *band the dock must avoid* is app chrome
  (keyframes' top work-area, value.js's nav, fourier's canvas overlay) — that
  geometry is irreducibly app-specific and stays consumer-owned. Only the
  `env(safe-area-inset-*)` boilerplate (U-4) converges; the work-area offset
  stays per-app (glass-ui could at most *document* the recipe, with
  `--dock-icon-height` as the glass-ui-side input).

- **D-4 — Opulent / identity chrome.** fourier's `.play-btn` rainbow-gradient
  play/pause (`AnimationControls.vue:139-187`, ~50 LOC) and `.mini-progress`
  collapsed scrub readout (`:74,190-191`); keyframes' `conic-gradient` progress
  dot (`AnimationMenuBar.vue:49-60`). These are intentional per-app visual
  identity, not reuse-shaped. **Keep-as-is** (matches the prior L5 F15/G2 keep).

- **D-5 — App-domain logic.** `useDockAdminMode` (value.js), scene/auth routing,
  editor-tool ops — correctly app-local; never upstream. **Keep.**

- **D-6 — `DockSelectTrigger` directly over reka-ui `Select`** (rather than
  `DockDropdownTrigger`). Idiomatic in all consumers — `DockSelectTrigger` *is*
  the Select trigger (`DockSelectTrigger.vue:7-14`). **Keep** (not a divergence
  to fix; listed so it is not mistaken for one).

---

## §4 — API gaps glass-ui must close to stop the forking

Each gap maps to one or more §1 capabilities and the §2 re-implementations it
would retire.

| Gap | What's missing | Closes | Retires |
|---|---|---|---|
| **G-1** | **`useDockPopupMutex()` / `<DockPopupGroup>`** — owns the single-open invariant AND auto-binds `open → keepOpen/release` against the dock context | C-08, C-09 | keyframes `TopDock.vue:82-103` + `useExclusiveSelect.ts`; value.js `usePopupMutex.ts` (85 LOC) + `Dock.vue:73` bridge; fourier per-control `keep-dock-open` wiring |
| **G-2** | **Touch-gate fix** — collapsed-dock tap-1 expands AND dispatches in one gesture (prefer: collapsed pill = single expand-only disclosure target so tap-1 has no apparent control to miss; fallback: capture-and-replay the touched control after expand). Gate with a NEW touch behavioural test (none exists today) | C-11 | both `always-expanded` masks (keyframes `TopDock.vue:117`, value.js `Dock.vue:93`); keyframes `AnimationMenuBar.vue:181-184` hand-roll; un-masks fourier's exposed docks |
| **G-3** | **`layerProps(id)` / `layerClass(id)`+`layerInert(id)` on `UseLayerTransitionReturn`** — the per-id convenience that forces the value.js fork | C-24, C-04 | value.js `composables/useLayerTransition.ts` (123 LOC FORK) → inherits native-VT + axis + computed-cleanup it has drifted behind |
| **G-4** | **`--dock-safe-inset-*` token (or `safeArea?` prop)** — fold `env(safe-area-inset-*)` into fixed/sticky placement | C-12 | the repeated `calc(max(env(safe-area-inset-*),…))` in every fixed consumer |
| **G-5** | **Nested layer groups + layer precedence** — let `DockLayerGroup` nest, and let `DockLayer` accept `:active-when` / a priority order so the group resolves the winner | C-04, C-05 | value.js's nested re-use of the forked composable AND its `Dock.vue:77-87` reducer + "call order does not matter" hazard *(lower confidence — may be deliberately consumer-owned)* |
| **G-6** | **`@expand`/`@collapse` (or `v-model:expanded`) on `<GlassDock>`** — declarative open-state out | C-10 | keyframes `TopDock.vue:77` + value.js `Dock.vue:71` template-ref `watch` (fourier already did this for its own dock) |
| **G-7** | **`clampLabel`/`noClamp` prop on `DockSelectTrigger`** (or the underlying `SelectTrigger`) — `SelectTrigger.vue:36` forces `[&>span]:line-clamp-1` | C-25 | value.js's `[&>span]:line-clamp-none` child-selector hack, OPEN across 7 tranches |
| **G-8** | **Required accessible-name contract** — assert every dock control has an a11y name (and consider a required `label` on `DockIconButton` with no text child); ALSO `IconTooltip text → wrapped-control aria-label` so the tooltip is the single name source | C-21 | the per-consumer `:title`/`aria-label` discipline (which is currently *correct* but unenforced); folds into AT.W6-dock-b |
| **G-9** | **`DockBadge` slot-child (or `MetricBadge variant="text"`)** — in-dock free-text count pill | C-18 | keyframes + fourier `dock-badge` hand-rolls |
| **G-10** | **`DockIconButton` corner `badge`/`indicator` slot** — a "this toggle is live" dot anchored to the control | C-20 | fourier `.view-dot` (`CanvasControlsDock.vue:121-130`) + future StatusDot dock adoption |
| **G-11** | **Rail tablist semantics** — `role="tablist"` + `aria-selected` + roving tabindex (rail currently `<button :aria-pressed>` `DockLayerGroup.vue:101-109`) | C-22 | the rail's incorrect ARIA *(already PLANNED as AT.W6-dock-b; listed for completeness)* |

**Consumer-side cleanups (no glass-ui change needed — listed so the map is
complete):**
- fourier: **DELETE** the local `.dock-separator`/`.dock-spacer` re-declarations
  (C-17) — glass-ui already ships them (`dock.css:574,582`); the local copies
  silently drift. Pure deletion.
- keyframes: internally converge `TopDock.vue:82-103` onto its own
  `useExclusiveSelect.ts` (one impl, not two) *before* G-1 lands.
- keyframes: `alt=""` on the collapsed-pill scene `<img>` (`TopDock.vue:212`).

---

## §5 — RANKED upstream-to-glass-ui list (highest-leverage first)

Ranked by `(consumers affected) × (mechanical certainty of the convergence) ÷
(effort)`, with the one correctness bug pulled to the top.

1. **[P0 · correctness · ASK-1] G-2 — touch-gate fix.** The only defect. 3
   consumers exposed, 2 masking by hand. Land with a NEW touch behavioural test
   (the absence of one is exactly why it shipped — §4-tests). Fold into the
   live AT dock-perfection wave (AT.W6/W7); it is in scope ("perfect the dock")
   and the AT.W1b §0 "no shipped dock bug" verdict is falsified by it.
   *Reference shape: keyframes `AnimationMenuBar.vue:181-184`.*

2. **[P1 · convergence · 3 consumers] G-1 — `useDockPopupMutex`.** The strongest
   re-implementation signal in the map: three independent single-open mutex
   hand-rolls (and a double-impl inside keyframes alone). glass-ui already ships
   the `keepOpen/release/isHeld` primitives — this composes them. Highest LOC
   retired (85 in value.js + ~18 in keyframes + a second keyframes copy).

3. **[P1 · de-fork · drift risk] G-3 — `layerProps(id)` on
   `UseLayerTransitionReturn`.** Retires a 123-LOC FORK that has DRIFTED BEHIND
   upstream (missing the native-VT path, axis, computed cleanup) — so it is both
   a convergence win and a *correctness* win (value.js's nested sub-layer is
   stuck on the slow FLIP-only path and loses VT names). One-method addition to
   the return shape.

4. **[P1 · convergence · 3 consumers] G-4 — `--dock-safe-inset-*` token.** Every
   fixed consumer re-derives the identical `env(safe-area-inset-*)` `calc()`.
   Token-only, no behavioural surface. (The exclusion-band half stays per-app —
   §3 D-3.)

5. **[P2 · convergence · 3 consumers] G-6 — `@expand`/`@collapse` event.**
   fourier already proved the pattern; declaring it upstream lets keyframes +
   value.js drop their template-ref `watch`. Small, declarative.

6. **[P2 · long-standing · 7 tranches] G-7 — `clampLabel` on
   `DockSelectTrigger`.** A one-prop fix that has been open across seven value.js
   tranches; retires a child-selector hack reaching into glass-ui internals.
   Single consumer but maximal staleness.

7. **[P2 · a11y · 3 consumers] G-8 — required-name contract + IconTooltip→aria.**
   All consumers currently name controls correctly but unenforced; an assertion
   gate prevents the next nameless control. Folds into the PLANNED AT.W6-dock-b
   a11y contract test. Sibling to ASK-3 (`LabeledField`).

8. **[P3 · low-stakes · 2 consumers] G-9 — `DockBadge` free-text pill.** Removes
   a 3-property duplication across keyframes + fourier. Low effort, low stakes.

9. **[P3 · low-stakes · 2 consumers] G-10 — `DockIconButton` indicator slot.**
   Corner "live toggle" dot; lets fourier retire `.view-dot` and unlocks
   `StatusDot` dock adoption.

10. **[P3 · lower confidence] G-5 — nested groups + layer precedence.** Would
    retire value.js's nested fork-reuse and its precedence reducer, but the
    precedence model may be deliberately consumer-owned; flag for upstream
    discussion, not a firm ask. (G-11 rail tablist is already PLANNED — not
    re-ranked here.)

---

## §6 — Cross-audit reconciliation (corrections this synthesis makes)

Reading the live glass-ui source corrects two figures the per-consumer audits
carried, and confirms a third correction:

- **"Dock icon-button 40px on touch" (fourier §5/keyframes §7) is STALE.**
  glass-ui ships a 44px coarse-pointer floor at `dock.css:1134-1152`: under
  `@media (pointer: coarse)` it lifts `--dock-control-size` →
  `--dock-touch-target` (2.75rem = 44px) via the `.glass-dock[data-density]`
  presence-selector, PLUS a standalone `.dock-icon-button:not(--compact)`
  `min-block/inline-size` floor for un-docked buttons. The inline comment records
  the AP.W3 R0G-6 history of fixing the *exact* 40px-pinning bug (the density
  setter shadowing a bare coarse floor). The audits cite `dock.css:716` (the
  fine-pointer default) without the coarse override. **Disposition: the 44px ask
  is already SHIPPED; strike it from the outward list.** (Compact buttons opt out
  by design — auto-sized affordances, not primary targets.)

- **"11 unnamed DockIconButton" (keyframes §5 / `grounding.txt:31`) is STALE —
  never reproduced.** All consumer `DockIconButton` sites carry a name
  (keyframes lists 6 titled sites; value.js uses `aria-label`/`aria-pressed`;
  fourier wraps every one in `IconTooltip`). The real `button-name` Lighthouse
  fails come from glass-ui's `glass-wash` select/switch buttons, not
  `DockIconButton`. **Disposition: STRIKE the "11" from `grounding.txt:31` /
  `PROGRESS.md`.** The a11y gap that DOES remain is the *unenforced* name
  contract (G-8), not a count of nameless buttons.

- **`DockTabButton` has ZERO consumers** across all three repos (verified absent
  in each audit). AT.W7 already books `wrap` (also 0 consumers) for deletion; the
  cross-repo view confirms `DockTabButton` is in the same un-adopted cohort —
  worth a glass-ui adoption-or-retire decision (not an ask, a note).

**Test-fabric gap (root cause of why ASK-1 shipped).** All three glass-ui dock
test files are STRUCTURAL (class-hook / id assertions); ZERO behavioural. No test
mounts a collapsed dock, simulates `touchstart`/`touchend`, and asserts the inner
control fired — which is precisely why the touch-gate two-tap shipped and the AT
audit lenses missed it. **The G-2 fix MUST land with a touch behavioural test**
(extend AT.W6-dock-b or add a W6-dock-d), or the fix can silently regress.

---

## §7 — One-screen summary

- **Adoption is healthy.** No consumer forks a glass-ui *component*; the core
  dock (chassis, two-layer, view-select, icon-button) is consumed identically
  and cleanly in all three repos.
- **The forking that exists is concentrated and convergeable.** It clusters on
  exactly four seams: the **popup mutex (G-1, all 3)**, the **touch-gate bug
  (G-2, all 3)**, the **layer-transition return shape (G-3, value.js fork that
  has drifted)**, and **safe-area placement (G-4, all 3)**. Close those four and
  the bulk of the hand-roll disappears.
- **The one correctness bug (G-2/ASK-1)** is corroborated independently by all
  three consumers — the strongest possible upstream signal — yet has no booked
  test gate. It is the P0.
- **Two audit figures are corrected here** by the live source: the 44px touch
  floor is already shipped (`dock.css:1134-1152`), and the "11 unnamed buttons"
  never reproduced.

**Top 4 upstream moves:** **G-2** (touch fix + test, P0 correctness) → **G-1**
(`useDockPopupMutex`, 3 consumers) → **G-3** (`layerProps`, de-fork a drifting
123-LOC copy) → **G-4** (`--dock-safe-inset-*`, 3 consumers).

**Files synthesized:**
`/Users/mkbabb/Programming/keyframes.js/docs/tranches/C/audit/dock/glass-ui.md` ·
`/Users/mkbabb/Programming/keyframes.js/docs/tranches/C/audit/dock/keyframes.md` ·
`/Users/mkbabb/Programming/keyframes.js/docs/tranches/C/audit/dock/value-js.md` ·
`/Users/mkbabb/Programming/keyframes.js/docs/tranches/C/audit/dock/fourier.md`

**glass-ui source grounded (read-only, inv-16):**
`GlassDock.vue:128,205-214,264-294,311,324,350-371` ·
`useTouchGate.ts:123-162` · `useDockState.ts:76,246-263,287-314` ·
`useLayerTransition.ts:17-24,49,77-88,121-133` ·
`DockLayerGroup.vue:97-109` · `DockSelectTrigger.vue:7-14,31` ·
`DockIconButton.vue:22-48` · `dock.css:57,574,582,716,1134-1152` ·
grep: 0 `env(safe-area-inset-*)` in `dock.css`, 0 `PopupMutex`/`useExclusive` in
`glass-ui/src`.
