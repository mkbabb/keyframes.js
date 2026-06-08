# H.W3 IMPLEMENT — the controls-column LAYOUT transposition (changes ledger)

**Branch:** `tranche-h-impl` · **Phase:** IMPL · **Lane:** implement (single coherent owner).
**NOT committed** — edits left in tree. Every touched file is `npx tsc --noEmit` clean (0
errors) AND the demo `vite build --mode gh-pages` compiles (✓ 1.35s). The gate lane binds to
the **§Resolved shell-root grid-template** section below (live-measured).

This is the one cohesive `rail·stage·rail` transposition: ONE named grid, ONE `--rail-width`
token, a single-column stacked-field sidebar, the two-track grid + subgrid chain + 768 cap +
`--controls-pane-width` token + the `translateX(-110%)` overlay slide DELETED (no legacy
beside replacement). Applied in order S3 → S1 → S2 → S3b → S4, tsc=0 after each step.

---

## §Resolved shell-root grid-template (the gate binds HERE)

`.controls-layout` (AnimationControlsGroup.vue root) resolves at `lg` (≥1024) to **exactly**:

```
grid-template-columns: [rail] var(--rail-width) [stage] 1fr;
grid-template-rows:    [top] auto [stage] 1fr [bottom] auto;
```

Live-measured (Playwright, `#/cube`, route rested, JS desktop state, pane OPEN):

| viewport | state | computed grid-template-columns | grid-template-rows |
|---|---|---|---|
| 1440×900 | open  | `[rail] 400px [stage] 953.594px`  | `[top] 0px [stage] 792px [bottom] 0px` |
| 1440×900 | closed| `[rail] 0px [stage] 1353.59px`    | (rail collapses to 0; stage reflows full-width) |
| 1280×800 | open  | `[rail] 400px [stage] 803.195px`  | — |

`--rail-width` resolves to `400px`. The `[top]`/`[bottom]` `auto` rows collapse to 0px when
empty (reserved for the H.W4 hero / dock, F7). The open/close axis IS the `[rail]` track
(`var(--rail-width) ↔ 0px`), driven by `.controls-layout--closed { --rail-track: 0px }`,
transitioned via `grid-template-columns var(--duration-slow) var(--spring-snappy)`.

---

## §Files + lines changed

### S3 — the global token rename `--controls-pane-width` → `--rail-width` (landed FIRST)

1. **`demo/@/styles/design-idioms.css:106-111`** — renamed the token definition
   `--controls-pane-width: 400px` → `--rail-width: 400px`; rewrote the doc comment to name
   it the SINGLE width authority (grid track + pane + expanded timeline), citing the named
   `grid-template-columns: [rail] var(--rail-width) [stage] 1fr` form. (The comment names the
   former token only as "the former pane-width token" — no live `--controls-pane-width`
   string survives anywhere in the tree.)

2. **`demo/@/components/custom/animation-controls/components/ControlsPaneWrapper.vue:202-212`
   (was :202-209)** — `.controls-content`: `min-width: var(--controls-pane-width)` (a FLOOR
   that let the pane stretch to 1272) → `width: var(--rail-width)` (the pane IS exactly the
   rail width); added `box-sizing: border-box` so the 12px shadow-clearance padding stays
   inside the budget. Comment rewritten to `--rail-width`.

3. **`demo/@/components/custom/animation-controls/controls/AnimationControls.vue:4`** —
   DELETED the divergent `lg:max-w-screen-md` (768px) cap from the root `class`. The root now
   resolves to `--rail-width` (live: 400px), matching the pane and the timeline.

### S1 — collapse the sidebar to a single-column stacked-field flow

`demo/@/components/custom/animation-controls/controls/AnimationControlsControls.vue`:
4. **:4** — CardContent: `grid grid-cols-[auto_1fr] gap-x-3 gap-y-1` → `flex flex-col gap-2`.
5. **:6** — panel-stack: `col-span-2 grid grid-cols-[subgrid]` → `relative` (a stack
   container; the panel-rows crossfade-stack via grid-template-rows).
6. **:9** — main panel-content: `grid grid-cols-[subgrid] items-center gap-x-3 gap-y-2 w-full`
   → `flex flex-col gap-2 w-full`.
7. **:124** — advanced panel-content: `grid grid-cols-[subgrid] items-start gap-x-3 gap-y-2
   w-full` → `flex flex-col gap-2 w-full`.
8. **:88** — Separator: removed `col-span-2` (→ `my-1`).
9. **:97** — advanced-nav row: `col-span-2 grid grid-cols-[subgrid] gap-x-3 items-center
   w-full …` → `flex items-center justify-between gap-x-3 w-full …` (label left, chevron
   right, on one full-width row).
10. **:125** — advanced header: removed `col-span-2` (→ `flex items-center gap-1 mb-1`).
11. **`.panel-row` scoped rule (was :288-293, now :288-296)** — KEPT `display:grid` (the
    crossfade — ALREADY-SOTA, WV-W3-NIT-1, the `:289` line); DELETED `grid-template-columns:
    subgrid` (the former `:291` line) AND the now-inert `grid-column: 1 / -1` (the former
    `:290` line, the dead subgrid-span). KEPT the `transition: grid-template-rows …`.
12. **`.panel-content` scoped rule** — DELETED the now-inert `grid-column: 1 / -1` subgrid-span.
    Gap rhythm normalized: CardContent `gap-y-1` + panel-content `gap-y-2` → one `gap-2`.

### S2 — fold the two mixed-paradigm rows onto one field shape

13. **`AnimationControlsControls.vue:67-86`** — the hand-split easing row (a `<div flex>`
    label+pencil THEN a sibling `<EasingSelect>` = two cells) → ONE full-width unit: a
    `<div class="flex flex-col gap-1">` wrapping the label-row+pencil OVER `<EasingSelect>`.
    Wrapper fallback per WV-W3-LOW-1 (glass-ui 3.4.0 `<LabeledField>` has only default+error
    slots, no label-action slot — VERIFIED `LabeledField.vue.d.ts:34-43`). The label-action
    slot is BOOKED as an OPTIONAL glass-ui-HANDOFF (see impl-w3-impl.md §Handoffs).
14. **`demo/@/components/custom/animation-controls/controls/LayerConfigPanel.vue:14-22`** —
    z-index converted from bare `<IconTooltip><label>` + bare `<Input>` (two cells) →
    `<LabeledField label="z-index" tooltip="…" v-slot="{ controlId, errorId }">` wrapping a
    slotted `<Input :id="controlId" :aria-errormessage="errorId" …>`. Manual aria/controlId
    wiring per WV-W3-LOW-2 (`LabeledField.vue.d.ts:19-26`; default slot exposes
    `{errorId, controlId, labelledBy}`). blend/z-index/enabled are now all one-cell rows.
15. **`LayerConfigPanel.vue` imports** — added `LabeledField` to the `@mkbabb/glass-ui/
    labeled-field` import; REMOVED the now-unused `IconTooltip` import (z-index was its only
    consumer). **:43** — Separator: removed `col-span-2` (→ `my-1`).

### S3b — collapse TimingFunctionPanel's own two-track grid (W3 owns this file, WV-W3-HIGH-1b)

`demo/@/components/custom/animation-controls/controls/TimingFunctionPanel.vue`:
16. **:3** — root wrapper: removed `col-span-2` (→ `w-full grid justify-items-center`).
17. **:78** — steps CardContent: `grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2`
    → `flex flex-col gap-2`; the count + jump-term label/control pairs each wrapped in a
    `<div class="flex flex-col gap-1">` (label OVER control — the single-column field shape).

### S4 — collapse the 3-track grid to the named frame (MEASURE-FIRST, gated by stage-not-clipped)

`demo/@/components/custom/animation-controls/AnimationControlsGroup.vue`:
18. **:5** — root grid class: `lg:grid-rows-[1fr_auto]
    lg:grid-cols-[var(--controls-pane-width)_1fr_1fr]` REMOVED; mobile
    `grid grid-cols-1 grid-rows-[auto_1fr_auto]` kept; added
    `controls-layout--open`/`--closed` state class bound to
    `storedControls.isControlsPanelOpen`. The named desktop template lives in scoped CSS.
19. **:54-57 (stage)** — DELETED `lg:row-start-1 lg:row-end-auto lg:col-start-1 lg:col-end-4`
    AND the mobile-redundant `col-span-full`; added `.stage-cell` class. (`col-span-full` is
    redundant in a `grid-cols-1` mobile grid — an item auto-flows into the lone full-width
    column.) Scoped CSS places it `grid-column: stage; grid-row: stage` at lg (WV-W3-HIGH-3:
    the stronger `[stage]`-track form, NOT the conservative span — LIVE-PROVEN un-clipped).
20. **:63-72 (#timeline-expanded-target)** — `col-span-full row-start-3 lg:row-start-2` →
    `.timeline-expanded-cell row-start-3` (mobile) + scoped `grid-column: rail; grid-row:
    bottom` at lg (the [rail] track — the timeline is a vertical extension of the rail,
    a-demo-architecture F2). The desktop comment block (former :42-53) rewritten.
21. **Scoped `<style>` (new `@media (min-width: 1024px)` block)** — the named
    `rail·stage·rail` template (above), the `--rail-track` collapse, and the three child
    placements: `:deep(.controls-pane-wrapper) { grid-column: rail; grid-row: stage }`,
    `.stage-cell { grid-column: stage; grid-row: stage }`, `.timeline-expanded-cell {
    grid-column: rail; grid-row: bottom }`.

`demo/@/components/custom/animation-controls/components/ControlsPaneWrapper.vue`:
22. **root class :5** — removed the superseded `lg:row-start-1` (desktop placement now comes
    from the parent's `:deep` rule via the named lines; mobile `col-start-1 row-start-1` kept).
23. **desktop `@media (min-width: 1024px)` block :166-200** — DELETED the `translateX(-110%)
    rotate(-2deg)` overlay slide + the `visibility: visible/hidden` overlay toggle
    (WV-W3-HIGH-2 — the overlay slide is REPLACED by the [rail]-track collapse, no legacy
    beside replacement). Kept the opacity fade (composes with the track collapse) +
    `pointer-events` open/close gate; `overflow: visible` → `overflow: hidden` (clips the
    fixed-width `.controls-content` as the [rail] track shrinks to 0).

### NOT touched (per contract)
- The panel **crossfade** `grid-template-rows: 0fr↔1fr` (`AnimationControlsControls.vue:288-309`)
  — ALREADY-SOTA, KEPT untouched (only `grid-template-columns:subgrid` + the dead
  `grid-column` spans removed from the same rules).
- The **`--work-area-*-bias` algebra** (`style.css`) — both docks remain `position:fixed`
  (AnimationMenuBar root is `fixed`, VERIFIED), the algebra still has a job (WV-W3-MED-1);
  BOOKED to the dock-relocation work, NOT deleted here.
- `AssetPropertiesPanel.vue` — out of scope (separate tree); its `grid-cols-[auto_1fr]` is
  legitimate, untouched (git status confirms not modified).
