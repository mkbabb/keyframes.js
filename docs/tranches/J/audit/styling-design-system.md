# Styling / Design-System Audit — Tranche J

**Date:** 2026-06-09  
**Branch audited:** tranche-i-dev (post-I, a4b1472 lineage)  
**Scope:** `demo/@/styles/**`, all `<style>` blocks, Tailwind usage, glass-ui token consumption

---

## Executive Summary

The styling system is substantively clean post-Tranche-I. The big structural items from D–I are delivered: `utils.css` deleted and folded into `style.css` + component partials, `design-idioms.css` owns the demo's rainbow/gold/progress/ball/badge vocabulary, `--font-stack-text` override properly reclaims the body register from glass-ui's Plus Jakarta, the z-index contract is documented and consumed via semantic tokens, `dvh` is the preferred unit throughout (with a guarded `vh` fallback), and the `progress-rail`/`progress-ball`/`status-badge`/`code-token` idioms are single-sourced and consumed correctly.

Seven defects survive into J:

1. **gold-shimmer duplication** — `design-idioms.css` re-authors `.gold-shimmer` that glass-ui 3.x already ships as a first-class `@utility`; the demo now owns a shadow copy (inv-16 violation, the same pattern that previously killed `.scale-on-hover`).
2. **`.easing-edit-btn { color: var(--color-gold) }` not using `.text-gold`** — the named utility exists (design-idioms.css:183) but one callsite bypasses it.
3. **`min(50vh, 480px)` / `50vh` literals** — two scoped rules (`AnimationControlsControls.vue:350`, `TimingFunctionPanel.vue:241`) use static `vh` rather than `dvh`; inconsistent with the reconciled `dvh` mandate. No `@supports` fallback guards them since `dvh` IS supported everywhere, but they should be `50dvh` for mechanical consistency.
4. **`max-w-[90vw]` toast literal** — `AnimationControlsGroup.vue:127` Toaster class string carries `max-w-[90vw]`. No token wraps it; no `dvw` form. Low impact but escapes the tokenization sweep.
5. **`stroke-[var(--ppmycota-primary,var(--foreground))]` ×2** — `EasingSelect.vue:14,50` uses an arbitrary-value Tailwind utility for the brand SVG stroke. A named `@utility ppmycota-stroke` in `design-idioms.css` would complete the token-idiom for this recurring two-site pattern.
6. **`transition: all` in `tab-trigger.css:30`** — over-broad transition; should enumerate `color, background, font-weight` to stay compositor-safe and consistent with glass-ui's PRM bracket.
7. **`max-w-[500px]` in `EditorHeader.vue:89`** — raw pixel cap not backed by a token. One off-contract magic number.

No dead CSS selectors found. No `utils.css` residue. No raw `z-[N]` bracket values outside the scoped `--z-seq-*` micro-stack (which is correctly local and named). Dark-mode coverage is class-based and complete for all demo-owned tokens (`.dark { … }` blocks in `style.css` + `design-idioms.css`). The `@supports not (height: 100dvh)` fallback in `EditorShell.vue` is the only `@supports` guard for the fallback path; the mask-image guards are correct progressive-enhancement. The `@custom-variant dark` definition is correct and single-sourced.

---

## (a) Glass-UI Idiom — Token Consumption

### Wins (clean)
- All z-index usage routes through `z-content / z-controls / z-bar / z-dock / z-overlay / z-popover / z-modal / z-hovercard` — zero raw `z-[N]` bracket values in templates or style blocks (the one `z-index: var(--z-behind, -10)` in `CubeTarget.vue:287` is the documented exception).
- `scale-on-hover`, `btn-interactive`, `glass-wash`, `glass-resting`, `cartoon-surface`, `rainbow-vivid`, `rainbow-pastel` — all consumed from glass-ui, not re-authored.
- Arbitrary Tailwind values using CSS vars (`[var(--panel-max-h)]`, `[var(--dropdown-min-width)]`, `[var(--easing-dropdown-max-h)]`, `[var(--target-viewport-h)]`, `[var(--target-viewport-w)]`, `[var(--visualizer-track-gutter)]`) — all backed by design-idioms.css tokens. Correct idiom.
- `rounded-card`, `rounded-panel`, `rounded-pill` consumed from glass-ui token system; `rounded-lg` used for generic element rounding (10 callsites) — acceptable since Tailwind's `rounded-lg` maps to `var(--radius-lg)` which is `var(--radius)` in glass-ui.
- Icon sizing: `icon-xs / icon-sm / icon-md / icon-lg` are `@utility` declarations in `design-idioms.css`, all 61 callsites differentiate correctly.

### Surviving ad-hoc / arbitrary values

| Location | Value | Token needed? |
|---|---|---|
| `AnimationControlsGroup.vue:127` | `max-w-[90vw]` (toast) | BOOK — one-off string; minor |
| `EasingSelect.vue:14,50` | `stroke-[var(--ppmycota-primary,var(--foreground))]` | Yes — `@utility ppmycota-stroke` |
| `EditorHeader.vue:89` | `max-width: 500px` | Yes — token or `--header-collapse-max-w` |
| `TimingFunctionPanel.vue:241` | `calc(min(50vh, 480px) - 137px)` | Replace `50vh` → `50dvh` |
| `AnimationControlsControls.vue:350` | `max-height: min(50vh, 480px)` | Replace `50vh` → `50dvh` |

---

## (b) design-idioms.css — Current State

File exists at `demo/@/styles/design-idioms.css` (658 lines). Contains:
- `:root` token block: rainbow family (7 tokens), gold ramp (3), `--scale-hover`, layout tokens (8: `--panel-max-h`, `--dock-panel-width`, `--dropdown-min-width`, `--target-viewport-h`, `--target-viewport-w`, `--visualizer-track-gutter`, `--easing-dropdown-max-h`, `--rail-width`, `--mask-fade`), `--z-behind`, `--controls-idle-opacity`
- `.dark { }` gold ramp parity
- `.focus-ring`, `.text-gold`, `@utility icon-{xs,sm,md,lg}`
- `.gold-shimmer` + `@keyframes gold-shimmer-slide` (DUPLICATE — see STY-1 below)
- `.progress-bar`, `.progress-dot`, `.progress-rail`, `.progress-ball`
- `.status-badge`, `.settled-badge`, `.tracking-badge`, `.reverse-badge`
- `.code-token`, `.labeled-field-grid` subgrid idiom
- `@keyframes enter`, `§idle-fade` anchor comment, `§gesture-in-flight` drag suppression

**Referenced-but-undefined idioms (D-era bug class): NONE found.** All consumed idioms resolve from this file or glass-ui. The `gold-shimmer-slide` keyframe is defined here AND in glass-ui (`animations.css:139`) — cascade race, not a missing definition.

---

## (c) I.W6 Font Reclaim + WZ TimingFunctionPanel Padding Trim

**Font reclaim (`--font-stack-text` override, `style.css:113-117`):**  
Correct mechanism: overrides glass-ui's `:root { --font-stack-text: "Plus Jakarta Sans" }` (tokens.css:51) at the same cascade layer with a system-sans stack. Also sets `--font-stack-sans`, `--font-text`, `--font-sans` so all bridge aliases resolve. The `@theme { --font-sans: … }` override (style.css:60) handles the Tailwind `font-sans` utility. This is clean and complete.

**WZ padding trim (`TimingFunctionPanel.vue:253-254`):**  
```css
:deep(.easing-curve-canvas-wrapper) {
    padding-block: 0.25rem;  /* was 0.5rem → 8px reclaim so canvas stays 223px and fits min(50vh,480px) */
}
```
This is a band-aid in the sense that it patches measured chrome to work around the `min(50vh, 480px)` host cap. The `50vh` host cap itself is the root cause. Replacing `50vh` → `50dvh` in `AnimationControlsControls.vue:350` + `TimingFunctionPanel.vue:241` is the honest fix; the `0.25rem` scoped override might then be revisited (but the measured comment documents the proof chain — acceptable for now). Not a standalone bug; the `50vh/50dvh` inconsistency is STY-2.

---

## (d) Z-Index Scale, dvh/vh Consistency, @supports Guards

### Z-index
- Glass-ui defines: `--z-content:10`, `--z-controls:20`, `--z-bar:30`, `--z-dock:40`, `--z-overlay:50`, `--z-hovercard:120`, `--z-popover:130`, `--z-modal:140`
- Demo adds: `--z-behind:-10` (design-idioms.css:135)
- `SequenceTarget.vue:342-343` defines `--z-seq-playhead:1` and `--z-seq-handle:2` SCOPED to `.seq-storyboard` — correctly named local micro-stack tokens, not global drift.
- Contract: **clean**. The comment in `style.css:11-37` documents the ordered-layer contract.

### dvh/vh consistency
- `style.css`, `design-idioms.css`, `AnimationControlsGroup.vue`, `ControlsPaneWrapper.vue`, `EditorShell.vue` — all use `dvh`.
- **Survivors using static `vh`:**
  - `AnimationControlsControls.vue:350`: `min(50vh, 480px)` — no `@supports`, used as a height cap.
  - `TimingFunctionPanel.vue:241`: `calc(min(50vh, 480px) - 137px)` — same.
  - `CubeTarget.vue:245`: `min(50vh, 50vw, 18rem)` — scoped cube sizing, low impact.
  - `CSSPasteDialog.vue:54`: `min-h-[20vh]` — dialog min-height.
  - `KeyframesAddDialog.vue:33`: `min-h-[25vh]` — dialog min-height.
  - `design-idioms.css:101`: `--target-viewport-h: 30vh` — documented token. Should be `dvh`.
- None of these are guarded with `@supports not (height: 100dvh)`. On `dvh`-capable browsers (universal now) they simply use the static viewport — no visible breakage but inconsistent with the project's `dvh` mandate.

### @supports guards
- `EditorShell.vue:165`: `@supports not (height: 100dvh)` → correct static-viewport fallback
- `AnimationMenuBar.vue:289`: `@supports not (padding: env(safe-area-inset-bottom))` → correct safe-area fallback
- `AnimationControls.vue:383`: `@supports not (content-visibility: hidden)` → correct DC-8 guard
- `AnimationControls.vue:395`, `ControlsPaneWrapper.vue:470`: `-webkit-mask-image` paired guards → correct progressive-enhancement

---

## (e) Deprecated/Duplicated CSS, Dead Selectors

- `utils.css`: **deleted** (`demo/@/styles/` contains only `style.css`, `design-idioms.css`, `brand.css`). No import survives.
- **DC-8 content-visibility grep = 0** (outside the correct usage in `AnimationControls.vue:377`): confirmed.
- `.scale-on-hover` scoped re-author: **deleted** (design-idioms.css:234–253, deletion note).
- Tracked specular subsystem: **deleted** (design-idioms.css:255–265, deletion note).
- `.dock-inset`: **deleted** (design-idioms.css:470–478, deletion note).
- Legacy rail/ball class names (`.spring-rail-line`, `.track-line`, `.preset-line`, `.spring-ball-old`): **not found** in tree.
- Scoped `.settled-badge` / `.tracking-badge` duplicates: **not found** — single-sourced in design-idioms.css.

**One surviving duplication: `.gold-shimmer`** — see STY-1.

---

## (f) Dark-Mode Coverage

- `style.css:204`: `.dark { color-scheme: dark; --color-progress …; --color-slider-track …; --accent-red …; --accent-red-foreground … }`
- `design-idioms.css:151`: `.dark { --color-gold …; --color-gold-light …; --color-gold-dark … }`
- `@custom-variant dark (&:where(.dark, .dark *))` — allows `dark:` prefix in Tailwind classes.
- Only one Tailwind `dark:` callsite: `MatrixEditor.vue:51` (`dark:opacity-75`) — correct idiom for the class-based variant.
- `EditorShell.vue:185`: `:where(.dark) .grid-background` — correct scoped dark override.
- No `prefers-color-scheme` usage (the demo uses the class-toggle, not the media query); glass-ui's `color-scheme: light dark` on `:root` (tokens.css:32) is overridden by the demo's `color-scheme: light` on `:root` and `color-scheme: dark` in `.dark` — correct.
- Coverage gap: `--axis-x / --axis-y / --axis-z` (style.css:179–183) have no `.dark` override. In dark mode these hsl(…) values render against a dark background. This is a BOOK item (the cube demo hasn't surfaced a contrast complaint) but it is an untested gap.

---

## (g) Global Monolith Residue

`utils.css` is gone. The three surviving cross-cutting utilities (`.container-inline-size`, `.icon`, `.is-disabled`) folded into `style.css @layer utilities` — correct home for genuinely-global primitives. No per-component rules survive in the global layer. `brand.css` is properly scoped to `App.vue` import (app-entry only). `tab-trigger.css` and `playback-button.css` are colocated partials, non-scoped deliberately (reka-ui DOM surface) — documented and correct.

---

## Findings Summary

| ID | Severity | Title | Evidence | Disposition |
|---|---|---|---|---|
| STY-1 | P1 | `.gold-shimmer` re-authored in design-idioms.css; glass-ui ships first-class `@utility` | `design-idioms.css:292-317` vs `glass-ui/utilities.css:356-367`; identical recipe | FOLD |
| STY-2 | P2 | Remaining `50vh` literals inconsistent with `dvh` mandate | `AnimationControlsControls.vue:350`, `TimingFunctionPanel.vue:241`; no `@supports` guard | FOLD |
| STY-3 | P2 | `stroke-[var(--ppmycota-primary,var(--foreground))]` ×2 needs `@utility ppmycota-stroke` | `EasingSelect.vue:14,50` — same arbitrary value repeated, no named utility | FOLD |
| STY-4 | P2 | `.easing-edit-btn { color: var(--color-gold) }` bypasses `.text-gold` utility | `AnimationControlsControls.vue:366` — the owned `.text-gold` idiom (design-idioms.css:183) exists | FOLD |
| STY-5 | P2 | `EditorHeader.vue` 500px raw cap — no token backing | `EditorHeader.vue:89` `max-width: 500px` — one magic pixel number | FOLD |
| STY-6 | P2 | `transition: all` in `tab-trigger.css:30` — over-broad | `tab-trigger.css:30` — should enumerate `color, background, font-weight` | FOLD |
| STY-7 | BOOK | `--target-viewport-h: 30vh` token uses static `vh` | `design-idioms.css:101` — should be `dvh` for consistency | BOOK |
| STY-8 | BOOK | `--axis-x/y/z` color tokens have no `.dark` override | `style.css:179-183` — untested contrast gap | BOOK |
| STY-9 | BOOK | `max-w-[90vw]` in toast Toaster class string | `AnimationControlsGroup.vue:127` — one-off `vw`, could be `dvw` | BOOK |
| STY-10 | BOOK | `AssetPropertiesPanel.vue` uses `grid-cols-[auto_1fr]` directly instead of `.labeled-field-grid` | `AssetPropertiesPanel.vue:6` — the subgrid idiom exists but isn't applied here | BOOK |

---

## Fold Candidates for J

| Item | Origin | Status today | Must fold? |
|---|---|---|---|
| `.gold-shimmer` duplication (STY-1) | I.W6 / design-idioms.css | OPEN — class defined twice; demo copy wins by cascade position | Yes |
| `50vh` → `50dvh` (STY-2) | D-era (pre-tokenization) | OPEN — 2 scoped rules + 3 dialog classes | Yes (completeness) |
| `ppmycota-stroke` utility (STY-3) | D-era EasingSelect | OPEN — arbitrary value repeated ×2 | Yes |
| `.easing-edit-btn` → `.text-gold` (STY-4) | D-era AnimationControlsControls | OPEN — idiom exists, callsite bypasses it | Yes |
| `max-width: 500px` token (STY-5) | Unknown (pre-D) | OPEN — EditorHeader scoped style | Yes |
| `transition: all` (STY-6) | D-era tab-trigger.css | OPEN — 1 occurrence | Yes |
