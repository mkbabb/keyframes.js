# Tranche H Deep Audit — Lane `a-controls-sidebar`

**Charge:** D1 — the controls sidebar renders TWO columns
(duration|delay, iterations|direction, fill|easing); it should be ONE column.
Diagnose *why* two columns; determine whether the sidebar is "totally broken"
beyond the columns (screenshot shows mis-sized fields); propose the layout
transposition; specify a falsifiable layout/visual lock.

**Anchors:** `AnimationControlsControls.vue` · `ControlsPaneWrapper.vue` ·
`AnimationControls.vue` · `AnimationControlsGroup.vue` · glass-ui
`labeled-field` (PUBLISHED) · `design-idioms.css`.

**Method:** read the component chain + the published glass-ui labeled-field
bundle/CSS; reproduced live on the running demo (Vite :5174) with Playwright,
measuring computed `grid-template-columns` and each field's bounding box.

---

## TL;DR

D1 is real and the sidebar is broken **beyond** the column count. Root cause is a
**half-finished migration**: `AnimationControlsControls.vue` is built on a
`grid-cols-[auto_1fr]` *two-track* grid (label-track | control-track) threaded
through nested `subgrid` panel rows. That grid was designed for the OLD
"`<label>` cell + `<control>` cell" split row. The fields now use glass-ui's
`<LabeledInput>`/`<LabeledSelect>` (`@mkbabb/glass-ui ^3.4.0`), each of which
renders as a SINGLE self-contained `<div class="labeled-field">` (label+control
stacked *inside* one block — confirmed: glass-ui `LabeledField` is a plain
`<div>`, **no `display:contents`**). So each field occupies exactly ONE grid
cell and auto-flows **two-per-row** into the two tracks — that is the two-column
artifact. Worse, the two tracks are `auto` (collapses to the widest label) and
`1fr` (the rest), so the two columns are **lopsided** (col-1 fields ≈212px,
col-2 fields ≈466px in my live capture) — the "mis-sized fields" the user saw.

The whole `auto_1fr` + `col-span-2` + `subgrid` scaffolding is now load-bearing
machinery for a layout the components no longer want. The gestalt fix is to
**delete the two-track grid and the subgrid chain**, and lay the controls out as
a **single-column vertical stack** (one row = one self-contained `<LabeledField>`).
This is a NO-WORKAROUND architectural simplification, not a band-aid.

**Disposition: SHIP-in-H.** (Pure demo CSS/markup; no engine, no glass-ui patch.)

---

## Live reproduction (Playwright, :5174, 1440×900)

Measured the active controls grid (route with the standard controls pane visible):

```
panel-content grid: display=grid, grid-template-columns = "subgrid [] [] []"
CardContent grid:    grid-template-columns = "auto 1fr"   ← the two tracks
fields (label · x · width):
  duration   x=76  w=212   ← col 1 (auto)
  delay      x=300 w=466   ← col 2 (1fr)
  iterations x=76  w=212   ← col 1
  direction  x=300 w=466   ← col 2
  fill mode  x=76  w=212   ← col 1
  blend      x=76  w=212   ← col 1   (advanced/LayerConfig)
  enabled    x=300 w=466   ← col 2
every field: computed `grid-column: auto`  (none span — they auto-flow)
every field: computed `display: block`     (single cell, not `contents`)
```

Two columns confirmed by the alternating `x` (76 ↔ 300); lopsided widths
confirmed (212 vs 466). `grid-column: auto` on every field proves nothing spans —
they pack into the next free cell. This is the exact `duration|delay`,
`iterations|direction`, `fill|easing` pairing the user reported.

(Screenshot of the easing route's card captured at
`/Users/mkbabb/Programming/keyframes.js/controls-sidebar-d1.png` — that route
shows the cubic-bézier *detail* panel, the D3 lane; the controls-grid numbers
above are the load-bearing evidence for D1.)

---

## Root cause — file:line

### F1 (PRIMARY) — the two-track grid is the wrong substrate
`demo/@/components/custom/animation-controls/controls/AnimationControlsControls.vue:4`
```
<CardContent class="relative grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 px-4 py-3">
```
`grid-cols-[auto_1fr]` is a **label-track | control-track** grid. It only yields
one logical row per field if each field emits TWO children (a label cell + a
control cell). The glass-ui `<LabeledInput>`/`<LabeledSelect>` do NOT — each is
one `<div class="labeled-field">`. Result: 2 fields per row → the two columns,
and `auto`/`1fr` → the unequal widths.

### F2 — glass-ui `LabeledField` is single-cell (the migration mismatch)
`@mkbabb/glass-ui` `LabeledField` renders `<div class="labeled-field">[label][slot]</div>`;
the `.labeled-field` utility (glass-ui `dist/styles/utilities.css:62`) sets only
`--field-label-color` — **no `display:contents`, no grid spanning**. So a
labeled field is an atomic block. This is correct glass-ui behaviour; the demo's
grid simply assumes the old split-row shape that predates the LabeledField
family. value-class confirmation, not a glass-ui defect → **no glass-ui handoff.**

### F3 — the `subgrid` chain only exists to propagate the two tracks
`AnimationControlsControls.vue:6` `panel-stack ... grid-cols-[subgrid]`,
`:9` & `:124` `panel-content grid grid-cols-[subgrid]`,
`:293` (scoped CSS) `.panel-row { grid-template-columns: subgrid; }`.
The `col-span-2` markers at `:88` (Separator), `:97` (advanced nav row),
`:125` (advanced header) all exist *solely* to make full-width items span the
two tracks. **Every one of these is dead weight once the grid is one column.**

### F4 — mixed-paradigm rows compound the breakage
- `AnimationControlsControls.vue:67-86` — the **easing** row is hand-built as a
  split pair: a `<div>` (label + edit pencil) **then** `<EasingSelect>` — i.e.
  it DOES emit two cells, so it lands label-in-col1 / select-in-col2. So easing
  behaves *differently* from duration/delay (which are one-cell each). The grid
  has two contradictory row shapes living in it at once.
- `LayerConfigPanel.vue:14-22` — **z-index** is a bare `<label>` + bare `<Input>`
  (two cells, old split shape), while `blend` (`:3`) and `enabled` (`:36`) are
  single-cell `<LabeledSelect>`/`<LabeledSwitch>`. Within one panel, rows
  alternate between the two paradigms — this is why `blend` and `enabled` landed
  in *different* columns in the live capture.

### F5 — token/gap incoherence (minor, fold into the fix)
`CardContent` declares `gap-y-1` (`:4`) but the inner `panel-content` declares
`gap-y-2` (`:9`, `:124`) — two different vertical rhythms stacked. After the
collapse there is one stack → one `gap-y`.

**Verdict on "totally broken beyond columns":** YES. The mis-sized fields (F1
`auto`/`1fr`), the contradictory row shapes (F4), and the doubled gap rhythm
(F5) are all symptoms of the same half-migrated two-track substrate. D1 is not a
one-line `grid-cols-1` swap — it's the removal of an obsolete layout apparatus.

---

## Gestalt fix — single-column stack (the transposition)

**Principle:** a labeled field is already a complete, self-laying-out unit
(label above/with its control). The container's only job is to stack units
vertically with one rhythm. That is a 1-D layout → **a flex column** (or
`grid` with a single implicit column), NOT a 2-track grid.

### Step 1 — collapse the container (`AnimationControlsControls.vue:4`)
Replace the two-track grid with a single-column flow. CardContent becomes a
plain vertical stack:
```diff
- <CardContent class="relative grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 px-4 py-3">
+ <CardContent class="relative flex flex-col gap-2 px-4 py-3">
```

### Step 2 — drop the subgrid chain (`:6`, `:9`, `:124`, scoped `:293`)
- `panel-stack` (`:6`): drop `col-span-2 grid grid-cols-[subgrid]` → it is just
  the relative container for the sliding panel rows; keep `position`/stack role.
- `panel-content` (`:9`, `:124`): drop `grid grid-cols-[subgrid]` →
  `flex flex-col gap-2 w-full`. Each `<LabeledInput>`/`<LabeledSelect>` is now a
  direct flex child = one full-width row.
- Scoped CSS `.panel-row` (`:293`): drop `grid-template-columns: subgrid;`
  (and the `display:grid`/`grid-column:1/-1` is now just "block, full width").
  The `grid-template-rows` collapse animation (`0fr`/`1fr`) is **independent** of
  the columns and must be **preserved** — it is the panel crossfade machinery
  (still needs `display:grid` on `.panel-row` for the `1fr/0fr` rows trick).
  So: keep `display:grid; grid-template-rows`; remove `grid-template-columns`.

### Step 3 — remove the now-meaningless `col-span-2` markers
`:88` (Separator), `:97` (advanced nav), `:125` (advanced header): drop
`col-span-2` (no columns to span). Full width is the default in a flex column.

### Step 4 — normalize the two mixed-paradigm rows (F4)
- **Easing row (`:67-86`):** today it is a hand-split label+select. Fold it into
  the same single-cell shape as the others. Options (in order of preference):
  1. Adopt glass-ui `<LabeledSelect>`/`<LabeledField>` for easing too, threading
     the edit-pencil via the field's label slot if glass-ui exposes one
     (verify `LabeledField`'s label-slot surface; if absent, this is a small,
     named glass-ui-HANDOFF for a label-action slot — **not** a kf patch).
  2. If no label slot: wrap the existing label-row + `EasingSelect` in ONE
     `<div class="flex flex-col gap-1">` so it is a single full-width unit like
     every other row. Cheapest, fully idiomatic, ship now.
- **LayerConfigPanel z-index (`:14-22`):** convert the bare `<label>` + `<Input>`
  pair to `<LabeledField>` + slotted `<Input>` (glass-ui supports a raw
  `<LabeledField>` with a control slot per its d.ts), so blend/z-index/enabled
  are all one-cell rows. This DRYs the panel onto one paradigm.

### Step 5 — verify the coupled width token still holds
`--controls-pane-width: 400px` (`design-idioms.css:106`) feeds both
`AnimationControlsGroup` grid track and `ControlsPaneWrapper` `min-width`
(`:206`). The single-column stack lives INSIDE that pane; the token is unaffected
and remains the single source for the pane width. **No change needed** — but the
visual lock below pins the field width to the pane so a future regression that
re-splits the grid trips the gate.

**Net deletion:** one `grid-cols-[auto_1fr]`, three `grid-cols-[subgrid]`, one
`grid-template-columns: subgrid`, three `col-span-2`, and the `auto`/`1fr`
width asymmetry — all removed in one motion. This is the "replaced surface is
replaced in ONE motion / no god-grid" spirit of the spine. No new abstraction;
fewer lines.

---

## Out-of-scope notes (route the right lanes)

- `TimingFunctionPanel.vue:78` has its OWN `grid-cols-[auto_1fr]` — that is the
  cubic-bézier/steps **detail** panel (the D3 "easing editor too massive" lane),
  a SEPARATE grid. Do not fold it into this fix; flag for the D3 lane that it
  shares the same anti-pattern and may want the same single-column treatment.
- D4 (PlaybackRibbon full-width → match sidebar width) is teleported out of this
  component (`AnimationControlsControls.vue:154` → `#controls-ribbon-target`);
  its width is governed elsewhere. Out of this lane; named for the D4 lane.

---

## Falsifiable instruments (gates H can wire later)

1. **proof:single-column-pack (layout lock).** In the rendered controls grid,
   assert ALL top-level field rows share the same left edge `x` (±1px) — i.e.
   `new Set(rows.map(r => Math.round(r.getBoundingClientRect().x))).size === 1`.
   Today this set is `{76, 300}` (size 2) → **fails now, passes after**. This is
   the column-count gate.
2. **proof:equal-field-width (mis-size lock).** Assert every field row width is
   within ±2px of every other (`max(w) - min(w) <= 2`). Today `{212, 466}` →
   fails; after the stack, all rows span the pane → passes. Catches any
   regression to `auto`/`1fr`.
3. **proof:no-subgrid-substrate (architecture lock — static).** Grep gate over
   `controls/AnimationControlsControls.vue`: assert ZERO occurrences of
   `grid-cols-[auto_1fr]`, `grid-cols-[subgrid]`, `col-span-2`, and (scoped CSS)
   `grid-template-columns: subgrid`. Pins the deletion so the apparatus can't
   creep back.
4. **proof:row-width-tracks-pane (coupling lock).** Assert a field row's width ≈
   `--controls-pane-width` minus the card+content horizontal padding. Ties the
   single-column width to the one coupling token (`design-idioms.css:106`) so a
   future re-split that ignores the token is caught.
5. **visual lock.** Reference screenshot of the controls pane at 1440×900 (and a
   mobile width) post-fix; pixel-diff gate in CI. Pairs with the D2/D14 hover
   work (don't bake a hover state into the baseline).

---

## Dispositions summary

| Finding | Disposition |
|---|---|
| F1 two-track grid is wrong substrate | **SHIP-in-H** (Step 1–3) |
| F2 LabeledField single-cell | RECORD (root cause; glass-ui correct, no handoff) |
| F3 subgrid/col-span chain is dead weight | **SHIP-in-H** (delete) |
| F4 mixed-paradigm easing/z-index rows | **SHIP-in-H** (Step 4); easing label-action slot is a possible small **glass-ui-HANDOFF** if no slot exists |
| F5 gap-y incoherence | **SHIP-in-H** (folds into Step 1) |
| TimingFunctionPanel own auto_1fr | BOOK → D3 lane |
| PlaybackRibbon width | BOOK → D4 lane |

**Already-SOTA note (inv ε, honest):** the panel crossfade via
`grid-template-rows: 0fr↔1fr` (`AnimationControlsControls.vue:293-302`) is
exemplary — keep it; it is orthogonal to the column defect and must survive the
transposition.
