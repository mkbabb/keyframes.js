# impl-w9-layout — Lane B (rows · shadow-clip · idle-fade)

**Wave:** H.W9 — design-language refinement round 2 (feedback fold F1–F9).
**Lane:** B — ROWS + SHADOW-CLIP + IDLE-FADE.
**Items:** F1 (rows), F7 (shadow un-clip), F9 (idle-fade restoration).
**Files (file-disjoint from Lanes A/C):**
- `demo/@/components/custom/animation-controls/controls/AnimationControlsControls.vue` (F1 scoped CSS)
- `demo/@/components/custom/animation-controls/controls/LayerConfigPanel.vue` (F1 doc anchor)
- `demo/@/components/custom/animation-controls/components/ControlsPaneWrapper.vue` (F7 padding-left + F9 idle CSS rules + apply class + prop)
- `demo/@/components/custom/animation-controls/composables/usePaneHover.ts` (F9 `useIdle` wire)
- `demo/@/components/custom/animation-controls/composables/useControlsLayout.ts` (F9 forward `isPaneIdle`)
- `demo/@/components/custom/animation-controls/AnimationControlsGroup.vue` (F9 prop pass-through)
- `demo/@/styles/design-idioms.css` (F9 `--controls-idle-opacity` token + NEW §idle-fade doc section — appended at the foot; Lane A owns the specular section, NO collision)

tsc-clean: `npm run check` (library `tsc --noEmit`) PASS. `npm run gh-pages` (vite/rolldown demo build) BUILT (✓ 1.19s) — no SFC/template/import errors; the only warnings are pre-existing (vueuse `#__PURE__` interop, chunk-size, ineffective-dynamic-import). No `vue-tsc` is installed, so the vite build is the authoritative demo type/transpile check.

---

## F1 — label-LEFT / value-RIGHT per row, ONE column of rows (revises W3.S1)

### MEASURE-FIRST (the glass-ui shape)
glass-ui 3.4.0 (installed) has NO `LabeledField orientation` prop (verified `LabeledField.vue.d.ts` props = `{label, tooltip, labelClass, required}`). So path A (the durable `orientation="horizontal"` HANDOFF) is BOOKED for the glass-ui repo (inv-16 — NOT authored here); path B (demo-side, born-GREEN today) lands.

Decompiled the labeled-field bundle (`node_modules/@mkbabb/glass-ui/dist/labeled-field.js`): each `LabeledInput`/`LabeledSelect`/`LabeledSwitch`/`LabeledSlider` composes `<LabeledField>`, which renders `<div class="labeled-field">` containing the tooltip-wrapped `<label>` (the IconTooltip uses `TooltipTrigger as-child` → NO wrapper element, the `<label>` is the direct child), the default-slot control, then the `.labeled-field-error` region. So `.labeled-field` is the ROW container and its children are label → control → error. `.labeled-field` has NO `display` in `utilities.css:62` (block flow, `:has()` group only).

→ The correct demo-side mechanism is to make `.labeled-field` ITSELF a `grid-template-columns: auto 1fr` row (NOT a parent wrapper grid — a parent grid makes each whole `.labeled-field` ONE cell). This mirrors the in-tree precedent `AssetPropertiesPanel.vue:6` at the row level.

### The change
`AnimationControlsControls.vue` `<style scoped>` — a `:deep` rule:
```css
.panel-content :deep(.labeled-field) {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    column-gap: 0.75rem;
    row-gap: 0.25rem;          /* gap-y > gap-x preserves Gestalt proximity */
}
.panel-content :deep(.labeled-field .labeled-field-error) {
    grid-column: 1 / -1;       /* error spans both cols, under the control */
}
```

### DRY note (LayerConfigPanel)
`LayerConfigPanel` (blend / z-index / enabled — the named `:3,19,46` rows) is a ROOTLESS fragment used ONLY inside `AnimationControlsControls`'s advanced sub-pane `.panel-content`. Its `.labeled-field` rows render INTO that `.panel-content`, so the host's single `:deep(.labeled-field)` rule reaches them — ONE source for the panel-row shape. `LayerConfigPanel.vue` carries only a documenting comment (it does NOT re-author the grid). The hand-rolled easing field + the advanced nav row are NOT `.labeled-field`, so they keep their full-width custom shape (unaffected).

### Live verification (`#/cube`, 1440px desktop)
24 `.controls-content .labeled-field` rows; every sampled row resolves `display:grid` + `grid-template-columns` ≈ `auto 1fr` (e.g. duration `68.9px 211.1px`) and `labelRect.right ≤ controlRect.left` = TRUE — duration / delay / iterations / direction / fill mode AND the LayerConfigPanel rows blend / z-index / enabled (proving the DRY parent rule reaches them). The one-column-pack invariant holds (each row is one grid box; rows stack one column).

### Gate alignment — `proof:single-column-pack` AMEND
The amended born-RED clause `labelRect.right ≤ controlRect.left` per visible leaf row greens on this intra-row `[auto_1fr]`; the existing row-box clause (one left-edge, one width ±2px) STAYS GREEN (it measures the row element, not the inner label/control). Re-uses the `fieldCount >= 6` guard (24 rows ≥ 6).

---

## F7 — symmetric shadow-clearance inside the load-bearing clip (revises the W3×W2 structural tension)

### MEASURE-FIRST (the shadow throw)
glass-ui tokens (`tokens.css`): `--shadow-cartoon-md: -4px 3px 1px …` (left 4 + blur 1 = ~5px left extent), `--shadow-cartoon-lg: -6px 4px 1px …` (the hover/focus rung, ~7px left extent), `--lift-sm: -1px` (the hover translate adds 1px left). Worst case bottom-LEFT extent ≈ `1 + 6 + 1 = 8px`. The wrapper's `overflow:hidden` (load-bearing for the `[rail]`-track collapse — KEPT) clips anything outside `.controls-content`, which budgeted clearance only RIGHT + BOTTOM (12px each) — the shadow throws LEFT → the bottom-left lobe was sliced.

### The change
`ControlsPaneWrapper.vue` `.controls-content` (desktop block) — add `padding-left: 12px` beside the existing `padding-right: 12px; padding-bottom: 12px` (symmetric, generous over the ~8px worst case; `box-sizing: border-box` keeps it inside the `--rail-width` budget). The wrapper's `overflow:hidden` is UNTOUCHED (do-not-remove — load-bearing). `overflow-clip-margin` PE layer NOT adopted (limited availability + disables scrolling — a non-base nice-to-have per the spec).

### Live verification (`#/cube`, 1440px)
`.controls-content` resolves `padding-left: 12px` (+ right/bottom 12px). The cartoon Card's left = 71px; the content-box left = 43px; the shadow's ~8px left extent (≈63px) lands well inside the content box → `shadowClearsClip: true`. The crisp Memphis stamp (intended) now renders inside the padded box; the slice is gone.

### Gate alignment — `proof:cartoon-shadow-unclipped` (NEW)
The active panel Card's box minus the shadow's left extent is ≥ the `.controls-pane` content-box left edge — verified TRUE live (63 ≥ 43).

---

## F9 — restore the controls idle-fade via `@vueuse/core useIdle` (restoration; inv ζ)

### MEASURE-FIRST (the primitive)
`@vueuse/core@14.3.0` `useIdle(timeout?, options?)` → `{ idle: ShallowRef<boolean>, … }`; default events `mousemove/mousedown/resize/keydown/touchstart/wheel` + `listenForVisibilityChange:true` — so scrubbing a slider / typing / scrolling all RESET the idle clock (matches the spec). The `.controls-pane--hovered` class + `usePaneHover` 2s linger are intact but the consuming opacity rule was D-era-dropped (the class was vestigial).

### The change (the wire)
- `usePaneHover.ts`: `const { idle } = useIdle(10_000)`; expose `isPaneIdle = computed(() => idle.value && !isPaneHovered.value)`. The `usePaneHover` 2s linger stays the immediate hover tracker; `useIdle` adds the 10s global idle dim. (inv ζ — NO hand-rolled `setTimeout`.)
- `useControlsLayout.ts`: forward `isPaneIdle`.
- `AnimationControlsGroup.vue`: destructure + pass `:is-pane-idle="isPaneIdle"`.
- `ControlsPaneWrapper.vue`: prop `isPaneIdle: boolean`; apply `isPaneIdle ? 'controls-pane--idle' : ''` on the wrapper root.

### The change (the CSS) — home decision
The CONSUMING RULES live in `ControlsPaneWrapper.vue`'s scoped `<style>` desktop block (NOT design-idioms.css) because the rest-dim opacity transition must COMPOSE with that component's existing `.controls-pane--open` `grid-template-rows` open/close transition — co-locating keeps the cascade specificity honest (a global rule would lose to the scoped two-class `--open` selector → the fade would snap). The TOKEN `--controls-idle-opacity: 0.35` + a NEW §idle-fade documenting section live in `design-idioms.css` (the demo's owned token home; the "NEW idle-fade section" Lane B owns — appended at the foot, NO collision with Lane A's specular section).

Rules (desktop, `@media (min-width: 1024px)`):
```css
.controls-pane-wrapper.controls-pane--open {
    transition:
        grid-template-rows var(--duration-panel) var(--ease-out),
        opacity var(--duration-normal) var(--ease-standard);   /* composed */
}
.controls-pane-wrapper.controls-pane--idle:not(.controls-pane--hovered) {
    opacity: var(--controls-idle-opacity, 0.35);
}
.controls-pane-wrapper:hover,
.controls-pane-wrapper:focus-within { opacity: 1; }            /* instant lift */
```
PRM guard (`@media (min-width:1024px) and (prefers-reduced-motion:reduce)`): restore the `--open` transition to grid-only (drop the opacity term → the dim snaps, not animates). This is surgical — it does NOT kill all transitions (which would re-enable the otherwise-PRM-neutralized rows animation; glass-ui's global bracket already restricts transition-property under PRM).

### NAMED a11y improvement
`:focus-within` in the override is ABSENT in the historical idle-fade form — a keyboard user tabbing in is never left on a ghosted surface. + the MANDATORY PRM snap-guard.

### Live verification (`#/cube`, 1440px)
- Token `--controls-idle-opacity` = `0.35`.
- After >10s genuine idle: the wrapper carries `.controls-pane--idle` and computed `opacity` = `0.35`.
- After a synthetic `mousemove` (activity): `useIdle` resets → `isPaneIdle` false → class removed → opacity returns to `1` (proves activity lifts the dim).
- The `:focus-within` override rule resolves in the stylesheet.
- Non-vacuity: resting opacity is a real `1`, idle is `0.35`.

### Gate alignment — `proof:idle-fade` (NEW)
Pane open, idle >10s → opacity drops to `--controls-idle-opacity` (< 1); hover/activity → returns to 1. Verified live.

---

## Precepts honored
- **NO workaround / reconcile-don't-fork:** F7 keeps the load-bearing `overflow:hidden`, gives the shadow room INSIDE (symmetric padding) — the demo's own existing idiom.
- **NO legacy beside replacement:** F9 consumes the still-wired `usePaneHover`/`.controls-pane--hovered` plumbing (the dead class becomes live), not a parallel mechanism.
- **DRY:** F1's row-shape rule is ONE source (the host `.panel-content :deep(.labeled-field)`) covering both AnimationControlsControls AND LayerConfigPanel rows.
- **KISS / isomorphic-unless-named:** F1 restores the OLD correct row shape at the ROW altitude (`AssetPropertiesPanel` precedent); the one-column-pack invariant stays true.
- **inv ζ (dogfood):** F9 uses the installed `@vueuse/core useIdle`, no hand-rolled timer.
- **inv-16:** the F1 durable home (`LabeledField orientation`) is a glass-ui HANDOFF (BOOKED, NOT kf-authored); no glass-ui patch in kf. No new backdrop CSS.
- **MEASURE-FIRST:** shadow throw measured from tokens before sizing the padding; `useIdle` signature + default events verified; the `.labeled-field` DOM shape decompiled before choosing the grid mechanism.

## Coordination
- design-idioms.css: Lane A owns the specular section (deleted it); Lane B appended the §idle-fade doc section at the foot + the `--controls-idle-opacity` token in `:root`. Verified no overlap — Lane A's edits were to the mid-file specular block (lines ~245-282, now removed); Lane B's are the `:root` token + the foot.
- AnimationControlsControls.vue: Lane A added `tier="quiet"` (line 3 prop); Lane B added the `<style scoped>` F1 rule — disjoint regions, no conflict.
