# Tranche C — Dock consumption audit: fourier-analysis

**Lane:** fourier-analysis dock CONSUMPTION (the editor/canvas/animation dock cohort).
**Author repo:** keyframes.js (inv-16 — read-across permitted; WRITE only under keyframes.js; this is an AUDIT + outward RECOMMENDATIONS, NOT a glass-ui patch).
**Date:** 2026-06-04.
**fourier HEAD:** `7aae2e8` (prior L5 audit was `c7cfd82`, no longer in history — the three target files are read at current HEAD).
**glass-ui dock substrate:** `/Users/mkbabb/Programming/glass-ui/src/components/custom/dock/` + `src/styles/dock.css` (1109 LOC) + `src/composables/dom/useTouchGate.ts`.
**Scope:** `EditorControlsDock.vue`, `CanvasControlsDock.vue`, `AnimationControls.vue` + the cross-component coupling sites (`VisualizationView.vue`, `FullscreenViewer.vue`, `GlassTimeline.vue`). Prior dock audit `2026-05-26-B-audit-wave-1/L5-docks.md` folded.

---

## §1 — Primitive consumption vs hand-roll (the editor/canvas/animation triad)

fourier consumes the dock subpath `@mkbabb/glass-ui/dock` from exactly **three** components. The full importer set (`rg "@mkbabb/glass-ui/dock"`):

| File | Imports from `/dock` | Role |
|------|----------------------|------|
| `EditorControlsDock.vue:6` | `GlassDock`, `DockIconButton` | Contour-editor playback dock (undo/redo/smooth/simplify/magnet/overlay/reset/save) |
| `CanvasControlsDock.vue:7` | `GlassDock`, `DockIconButton` | Canvas top-right view-toggle dock (view-options/publish/equation/edit/fullscreen) |
| `AnimationControls.vue:8` | `GlassDock`, `DockDropdownTrigger` | Animation playback dock (play/timeline/speed/easing/export) |

### What is glass-ui-PROVIDED and consumed idiomatically

- **`GlassDock` chassis** — all three use the two-layer collapsed↔expanded pattern via the `#collapsed` slot + default slot (`GlassDock.vue:350-371`). Props consumed: `fit-content`, `:start-collapsed="true"`, `:collapse-delay="2000"` — all first-class (`GlassDock.vue:11-16,85-97`). The FLIP width crossfade, the 3-state machine (`collapsed↔hover↔pinned`), focus-in/out keyboard parity, ref-counted keep-open, and View-Transition morph are ALL inherited untouched.
- **`DockIconButton`** — D1/D2 use it as the canonical fixed-square icon button. The accent classes fourier applies are **idiomatic per-instance retints of a glass-ui-PROVIDED hook**, not a fork:
  - `--btn-hover-color` is a published dock.css variable (`dock.css:745,1038`); `EditorControlsDock.vue:199-201` sets `.is-amber/.is-sky/.is-rose { --btn-hover-color: … }`. This is exactly the intended consumer extension point.
  - `.is-active` is a glass-ui-recognised state vocabulary (`dock.css:775` — `.dock-icon-button:is(.is-active, .active, [aria-expanded="true"], [aria-pressed="true"])`). D1/D2 toggle `:class="{ 'is-active': … }"` correctly (`CanvasControlsDock.vue:54,59,71,77,87`; `EditorControlsDock.vue:143,148`).
- **`DockDropdownTrigger` + `DropdownMenu`** — `AnimationControls.vue:103-125` composes the glass-ui dropdown primitive (`role="menu"`, focus management, Esc + click-outside) for the three-dot menu. **This is the prior L5-docks F10/G1 finding, now ADDRESSED** (was a hand-rolled `.menu-popup` + `onClickOutside` at the audit revision).
- **`HoverPopover keep-dock-open`** — D1/D2 use `keep-dock-open` for the magnet/overlay clusters (`EditorControlsDock.vue:103,134`; `CanvasControlsDock.vue:44`), riding the dock's ref-counted keep-open contract rather than re-implementing it.
- **`Slider variant="glass-scrubber"`** — the magnet slider (D1) and the timeline (`GlassTimeline.vue`) consume the scrubber variant; per-instance retint via the published `--slider-scrub-*` + `--track-color` hooks (`EditorControlsDock.vue:222-229`). The variant internally acquires the typed `DockContext` (`GlassTimeline.vue:9,14`) — see §4.

### What fourier HAND-ROLLS

| # | Hand-roll | Site | Verdict |
|---|-----------|------|---------|
| HR1 | **`.dock-separator` re-defined locally** in all three docks | `EditorControlsDock.vue:179-184`, `CanvasControlsDock.vue:106-112`, `AnimationControls`-cohort | **FORK of a provided style** — glass-ui ships `.dock-separator` in `dock.css:574-580` with the `--dock-separator-height` token (`dock.css:57`) + `--surface-tint-15`. Each fourier copy hardcodes `width: 1px; height: 1.5rem; background: color-mix(in srgb, var(--foreground) 20%, transparent)`. See §4 HR1. |
| HR2 | **`.dock-spacer` re-defined locally** | `EditorControlsDock.vue:186-188` (`flex: 1`) | **FORK** — glass-ui ships `.dock-spacer { @apply flex-1 }` in `dock.css:582-584`. Identical semantics, redundant local copy. |
| HR3 | **`.dock-badge` count pill** ("`{{ pointCount }} pts`", "`{{ N }}`") | `EditorControlsDock.vue:190-196,61,163` | **fourier-specific, legitimately bespoke** — no glass-ui in-dock text-badge primitive. `MetricBadge` is for numeric+unit (consumed at `EditorControlsDock.vue:113`, `AnimationControls.vue:75`), not free-text "N pts". Candidate upstream (§5). |
| HR4 | **`.play-btn` rainbow-gradient play/pause button** (~50 LOC CSS) | `AnimationControls.vue:139-187` | **KEEP-AS-IS** (matches prior L5 F15/G2). Opulent, uniquely-fourier register; not reuse-shaped. NOT a `DockIconButton` because the rainbow-drift `::before` + scale-press chrome is intentional fourier identity. |
| HR5 | **`.mini-progress`/`.mini-fill` collapsed-summary progress bar** | `AnimationControls.vue:74,190-191` | **fourier-specific** — a 3rem collapsed-state scrub readout. No glass-ui equivalent; legitimately local. |
| HR6 | **`.view-dot` "has-active-overlay" indicator** | `CanvasControlsDock.vue:48,121-130` | **FORK-adjacent** — matches prior L5 G7. glass-ui has a `StatusDot` (noted 0-adoption in the d-style audit). A 6px amber dot is a `StatusDot` shape. Consumer-side wire (§5). |

**Dual-dock pattern (editor vs canvas vs animation).** The bottom overlay (`VisualizationView.vue:234-248`) conditionally hosts **two** docks at one anchor — `AnimationControls` when `hasData && !isEditing`, `EditorControlsDock` when `isEditing && store.contour` — and the canvas top-right hosts a **third** (`CanvasControlsDock`, `VisualizationView.vue:209-227`). The three are coordinated **purely by `v-if` mutual exclusion in the parent**, not by any dock-group composable. This is the same observation as prior L5 G8 (`useDockGroup` not warranted — only one swap site). Confirmed still single-site; **KEEP-AS-IS**.

---

## §2 — Prior L5-docks findings: addressed vs standing

The prior audit (`L5-docks.md`, HEAD `c7cfd82`) raised 17 ledger items across 14 dock surfaces. Restricting to the **three lane targets (D1/D2/D3)** and re-checking at HEAD `7aae2e8`:

| Prior ID | Finding | Status at `7aae2e8` | Evidence |
|----------|---------|---------------------|----------|
| **F10 / G1** | D3 AnimationControls hand-rolled three-dot menu (`.menu-popup` + `onClickOutside`) | **ADDRESSED** | Now `DropdownMenu` + `DockDropdownTrigger` + `DropdownMenuContent` (`AnimationControls.vue:103-125`). The comment at `:100-102` documents the substitution. |
| **F11 / §3-D3** | `--animation-dock-max-width` cross-component CSS-var contract with FullscreenViewer | **ADDRESSED** | Replaced by a typed `maxWidth` prop (`AnimationControls.vue:21-26`, default `"960px"`); FullscreenViewer passes `max-width="60rem"` (`FullscreenViewer.vue:135`). The dock still publishes the var INTERNALLY as a `:style` (`AnimationControls.vue:62`) but the cross-component contract is now a prop, not a leaked CSS var. Comment at `FullscreenViewer.vue:225-227` records the migration. |
| **F12 / §3-D2** | D2 `dockRef.expanded` read by VisualizationView via `defineExpose` (out-of-band coupling) for `dock-centered` class | **ADDRESSED** | Replaced by a typed `update:expanded` event (`CanvasControlsDock.vue:26,34-37`); parent binds `v-model:expanded="dockExpanded"` (`VisualizationView.vue:212`) and drives `.dock-centered` (`:210`). Comment at `CanvasControlsDock.vue:31-33` records the in-band conversion. |
| **F8 / β-γ** | D1+D4 EditorTools duplication (Smooth/Simplify/Magnet in both floating dock + in-flow panel) | **ADDRESSED** | `EditorToolsPanel.vue` **retired** (`rg` → 0 component files; only a tombstone comment at `VisualizationView.vue:258-259`). The three operations now live solely in D1's floating dock. |
| **CR-2 (dock barrel note)** | fourier's silent `inject("dockKeepOpen", null)` no-ops at `SliderControl.vue` + `GlassTimeline.vue` (functional regression on scrub at glass-ui v1.7.0) | **ADDRESSED** | Both migrated to `Slider variant="glass-scrubber"`, which acquires the typed `DockContext` internally via `useOptionalDockContext()` (`GlassTimeline.vue:9,14-15`; `SliderControl.vue:19`). The string-key inject is gone. |
| **F15 / G2** | D3 hand-rolled `play-btn` rainbow gradient | **STANDING — KEEP-AS-IS** (intentional) | Still `AnimationControls.vue:139-187`. Correctly classified opulent-fourier-only; not reuse-shaped. |
| **HR1/HR2 (new)** | `.dock-separator` / `.dock-spacer` local re-definition | **STANDING — NEW** | Not in prior L5 ledger (which focused on a11y + menu/Configurator). See §4. |

**Net:** of the lane-relevant prior findings, **5 of 6 actionable items are ADDRESSED** (F10/F11/F12/F8/CR-2); F15 is a deliberate keep. The dock triad has converged substantially since `c7cfd82`. The remaining gaps are the newly-surfaced `dock-separator`/`dock-spacer` fork (HR1/HR2) and the longstanding `view-dot`→`StatusDot` non-adoption (HR6).

---

## §3 — The double-click encounter (ASK-1 / project-memory `project_dock_doubleclick.md`)

**The bug is glass-ui-OWNED** (`useTouchGate.ts` + `GlassDock.vue` touch path) and fourier is a CONSUMER that inherits it. Per inv-16 and the standing memory note (*"glass-ui dock buttons require double-click; NOT transition-related; fix in glass-ui root"*), fourier neither fixes nor should fix it locally.

**Mechanism (grounded).** On a collapsed horizontal dock, `GlassDock.onTouchStart` (`GlassDock.vue:268-278`) routes the first tap into `useTouchGate.handleTouchStart`, which returns `false` and sets `isPending` (`useTouchGate.ts:123-139`) — the first tap is consumed to *activate the gate / expand*, NOT to dispatch the control under the finger. `onTouchEnd` (`GlassDock.vue:285-294`) calls `expand()` on that first tap. The control's actual `@click` only lands on a **second** tap, once `visualExpanded` is true and `shouldGateTouch()` short-circuits (`GlassDock.vue:264-266,269`). Hence: **tap-1 expands, tap-2 acts.**

**fourier's exposure.** All three fourier docks are **collapse-on-load horizontal docks** (`:start-collapsed="true"`, default `orientation="horizontal"`):
- `EditorControlsDock.vue:56` — `:start-collapsed="true" fit-content`, `:collapse-delay="2000"`.
- `CanvasControlsDock.vue:41` — `fit-content :start-collapsed="true"`.
- `AnimationControls.vue:58-63` — `:collapse-delay="2000" :start-collapsed="true"`.

So on touch, the FIRST tap on any collapsed fourier dock's visible control expands the pill; the intended action requires a SECOND tap. This is the exact double-click symptom.

**Notable divergence from the keyframes demo's mask.** The keyframes demo masks the bug by mounting `:always-expanded="isMobile"` (`ASK-1`, demo `TopDock.vue:117`), so the collapsed-pill first-tap state never occurs on mobile. **fourier does NOT apply this mask** — none of the three docks set `:always-expanded` on touch/mobile. fourier's `CanvasControlsDock` collapsed slot even exposes *direct action glyphs* (`Maximize2`/`Pencil`, `CanvasControlsDock.vue:98-101`) that look tappable but only expand on first touch. **fourier is therefore MORE exposed to ASK-1 than the keyframes demo**, because it has no mobile mask in place.

**Recommendation (routes to glass-ui — this is ASK-1, no consumer workaround):** the fix belongs in glass-ui's `useTouchGate`/`GlassDock` — make a collapsed-dock control's FIRST tap both expand AND dispatch (expand-then-act in one gesture), per `keyframes.js/docs/tranches/B/asks/glass-ui-adoption-asks.md` ASK-1. fourier's enabler/mitigation until glass-ui ships: either (a) adopt the same `:always-expanded` mobile mask the keyframes demo uses (a consumer-side stopgap, NOT the fix), or (b) avoid rendering tappable-looking action glyphs in the collapsed slot (`CanvasControlsDock.vue:98-101`) so the first-tap-expands gesture reads as intentional. **No fourier-local code change is mandated by this audit** — the canonical disposition is "wait for the glass-ui fix; the mask is optional."

---

## §4 — What fourier FORKS that belongs upstream

| # | Fork | Site | Upstream already exists? | Direction |
|---|------|------|--------------------------|-----------|
| **HR1** | `.dock-separator` re-defined locally (3×) | `EditorControlsDock.vue:179-184`, `CanvasControlsDock.vue:106-112`, plus an `AnimationControls`-cohort separator pattern | **YES** — `dock.css:574-580` ships `.dock-separator` + `--dock-separator-height` (`:57`) + `--surface-tint-15`. | **CONSUMER-SIDE DELETE.** Remove the three local `.dock-separator` blocks and rely on the global dock.css class. The local copies hardcode `height: 1.5rem` (vs the token's `calc(--dock-h * 0.5)`) and `var(--foreground) 20%` (vs `--surface-tint-15`) — a silent drift from the substrate's density-aware separator. **Root cause:** each `<style scoped>` cannot SEE the global class would already apply, so the author re-wrote it. The fix is deletion, not re-authoring. |
| **HR2** | `.dock-spacer` re-defined locally | `EditorControlsDock.vue:186-188` | **YES** — `dock.css:582-584` ships `.dock-spacer { @apply flex-1 }`. | **CONSUMER-SIDE DELETE.** Byte-equivalent. |
| **HR6** | `.view-dot` bespoke status indicator | `CanvasControlsDock.vue:48,121-130` | **PARTIAL** — glass-ui has `StatusDot` (0-adoption per d-style audit). | **CONSUMER-SIDE WIRE** to `StatusDot` if its API covers the amber-glow + absolute-corner placement; else KEEP. Low priority. |
| **HR3** | `.dock-badge` free-text count pill ("N pts") | `EditorControlsDock.vue:190-196` | **NO** — `MetricBadge` is numeric+unit only. | **UPSTREAM CANDIDATE** (see §5) — a `DockBadge`/`DockTextPill` slot-child for in-dock free-text counts. Currently only 1 fourier consumer (the keyframes demo's `dock-badge` is a separate copy) → **convergence at 2 consumers, warrants upstream**. |

**No source-fork of glass-ui exists.** Critically, fourier does NOT fork any glass-ui *component* — all forks are CSS-class re-definitions in scoped `<style>` blocks (HR1/HR2) or bespoke local widgets (HR3/HR6). The accent-variant retints (`--btn-hover-color`) and scrubber retints (`--slider-scrub-*`, `--track-color`) are PROVIDED extension hooks used correctly, NOT forks. This is a clean consumer.

---

## §5 — fourier-specific dock needs (API gaps glass-ui should close)

1. **In-dock free-text badge primitive (HR3).** Both fourier (`EditorControlsDock`'s "N pts", `AnimationControls`'s collapsed summary) and the keyframes demo (its own `dock-badge` class) hand-roll a `tabular-nums`, foreground-tinted, in-dock text pill. `MetricBadge` covers numeric+unit but not free-text labels. **Convergence opportunity (2+ consumers):** a `DockBadge` slot-child (or a `MetricBadge` `variant="text"` / free-label mode) keyed off the dock density tokens. Routes to glass-ui as a NEW dock-cohort primitive. Low effort, removes a 3-property duplication across the constellation.

2. **`StatusDot` adoption + the corner-placement recipe (HR6).** fourier's `view-dot` is a glow-dot indicating "an overlay toggle is active." glass-ui's `StatusDot` exists but has 0 adoption and (per d-style audit) may not ship the absolute-corner-on-a-button placement. **Recommendation:** glass-ui should ship a `<DockIconButton>` `badge`/`indicator` slot (corner-anchored) so the "this toggle is live" affordance is a primitive feature, not a per-consumer `position: absolute` dance. 2 consumers minimum (fourier `view-dot`; the editor overlay-stack `Eye` button could use it too).

3. **Collapsed-summary scrub readout (HR5).** `AnimationControls`'s `.mini-progress`/`.mini-fill` is a collapsed-state progress bar. This is genuinely playback-specific (fourier + any media dock). **Not yet warranted** — single consumer; flag for a future `DockProgressSummary` only if a 2nd consumer appears.

4. **Expand-then-act touch gesture (ASK-1, §3) — the headline need.** fourier's strongest dock need is the glass-ui-owned touch-gate fix. Until it lands, fourier's collapsed docks are double-tap on mobile. This is already filed as ASK-1; this audit reaffirms it and notes fourier is **more exposed than the keyframes demo** (no `always-expanded` mask). **Highest-value glass-ui carry for fourier.**

5. **Multi-dock-at-one-anchor coordination (`useDockGroup`).** The bottom overlay swaps `AnimationControls`↔`EditorControlsDock` by parent `v-if` (`VisualizationView.vue:235-248`). Still single-site → **KEEP-AS-IS** (matches prior L5 G8). Re-flag only if a 2nd swap-anchor appears.

---

## §6 — Ledger + dispositions

| # | Finding | Severity | Disposition |
|---|---------|---------:|-------------|
| C-F1 | HR1 `.dock-separator` forked locally in 3 docks (glass-ui ships it, with density token) | MED | **CONSUMER-SIDE DELETE** (fourier) — remove local blocks, inherit `dock.css:574`. Drift risk: local `1.5rem`/`foreground-20%` vs token `calc(--dock-h*0.5)`/`--surface-tint-15`. |
| C-F2 | HR2 `.dock-spacer` forked locally (byte-equiv to `dock.css:582`) | LOW | **CONSUMER-SIDE DELETE** (fourier). |
| C-F3 | ASK-1 double-tap — all 3 fourier docks collapse-on-load, no mobile mask | MED (UX) | **ROUTE-TO-glass-ui** (ASK-1, already filed). fourier MORE exposed than keyframes demo. Optional consumer stopgap: `always-expanded` mobile mask. No mandated fourier code change. |
| C-F4 | HR3 `.dock-badge` free-text pill — 2+ consumers hand-roll it | LOW | **UPSTREAM CANDIDATE** — glass-ui `DockBadge` / `MetricBadge` text mode. |
| C-F5 | HR6 `.view-dot` bespoke vs `StatusDot` 0-adoption | LOW | **CONSUMER-WIRE or glass-ui `DockIconButton` indicator slot** (2 consumers). |
| C-F6 | HR4 `.play-btn` rainbow gradient | INFO | **KEEP-AS-IS** (intentional fourier identity; matches prior F15). |
| C-F7 | Prior F10/F11/F12/F8/CR-2 | — | **ADDRESSED at `7aae2e8`** (verified §2). No action. |

**Tally:** 2 consumer-side deletes (HR1/HR2 — clean wins), 1 glass-ui carry reaffirmed (ASK-1), 2 upstream candidates (DockBadge, DockIconButton indicator slot), 1 keep-as-is. **5 of 6 prior lane findings already discharged** — the fourier dock triad is a near-exemplary glass-ui consumer; the only genuine residue is the `dock-separator`/`dock-spacer` style fork, which is a deletion, not a re-authoring.
