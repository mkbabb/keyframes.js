# R2 — Git Archaeology (read-only)

Research lane R2 for the Tranche-H feedback fold. Ground = git history (`git log/show/grep`)
+ source reads on `tranche-h-impl` (HEAD `084feb9`). Scope: the three archaeology items —
**F1** (the "previous correct" label-LEFT/value-RIGHT controls layout), **F9** (the controls
idle-fade that "used to be extant"), **F4** (the ppmycota / pp-logo SVG). Supporting evidence
for **F5** (Dark-mode whole-row toggle) is included because the archaeology surfaced the exact
precedent in the SAME file.

All quotes are commit + path anchored. No files outside `docs/tranches/H/` were touched.

---

## F1 — the "previous correct" controls layout (label-LEFT / value-RIGHT)

### Verdict
The "previous correct" layout the user remembers is REAL and was the demo's controls register
from **2026-02-26 (`4a1c1cd`)** through the W3 wave. It is a parent `grid grid-cols-[auto_1fr]`
where each field is a **2-cell row**: a `<label>` in the `auto` column (LEFT, hugging content)
+ the control in the `1fr` column (RIGHT). Rows shared one alignment via `grid-cols-[subgrid]`.
**W3 (`ece4743`) collapsed this to `flex flex-col`** — which made each field stack the label
ABOVE the input. That collapse is exactly what F1 is reacting to.

### When it existed / when it changed
- `grid-cols-[auto_1fr]` INTRODUCED: `4a1c1cd` "feat: controls polish — effectiveT slider…"
  (2026-02-26). It then carried through `3900f96`, `cfea657`, `0472074`, `73b8f7a`, `7933057`,
  and into the D tranche, surviving to **`ece4743` W3 (2026-06-07)**, which removed it.
- The clearest snapshot of the correct shape is **`cfea657`** "refactor(demo): subgrid
  alignment, text+icon buttons, Teleport playback" (2026-03-03) — the commit whose subject
  literally names the alignment idiom.

### The old correct markup (the EXACT pattern to restore)
`cfea657:demo/@/components/custom/animation-controls/AnimationControlsControls.vue` —
the parent grid + the advanced/layer rows (blend / z-index / enabled), which is precisely the
`advanced` panel F1 calls out:

```
L4:   <CardContent class="relative grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 px-4 py-3">
...
L252: <CollapsibleContent class="col-span-2 grid grid-cols-[subgrid] items-center gap-x-3 gap-y-2 pb-2">
        <template v-if="isGrouped && layerConfig">
          <IconTooltip text="Stacking order in animation group">
            <label class="fira-code text-xs text-muted-foreground cursor-help">z-index</label>   <!-- auto col, LEFT -->
          </IconTooltip>
          <Input type="number" class="fira-code" :model-value="layerConfig.zIndex" .../>          <!-- 1fr col, RIGHT -->

          <IconTooltip text="How this layer blends with others">
            <label class="fira-code text-xs text-muted-foreground cursor-help">blend</label>      <!-- auto col, LEFT -->
          </IconTooltip>
          <Select :model-value="layerConfig.blendMode" ...>                                        <!-- 1fr col, RIGHT -->
            ...
          </Select>

          <IconTooltip text="Enable/disable this layer">
            <label class="fira-code text-xs text-muted-foreground cursor-help">enabled</label>     <!-- auto col, LEFT -->
          </IconTooltip>
          <div class="flex items-center"><Switch :checked="layerConfig.enabled" .../></div>        <!-- 1fr col, RIGHT -->

          <Separator class="col-span-2 my-1" />
        </template>
```

The recipe in one sentence: **the PARENT is `grid grid-cols-[auto_1fr]`; each field is two
sibling cells (label in `auto`, control in `1fr`); collapsibles/sub-panes propagate the same
columns via `grid-cols-[subgrid]`; full-width breaks use `col-span-2`.** That yields label-LEFT/
value-RIGHT WHILE staying ONE column of rows — which is exactly F1's reconcile requirement.

### What W3 changed it to (the regression)
`ece4743 demo/@/components/custom/animation-controls/controls/AnimationControlsControls.vue`
(commit-message §S1: "*AnimationControlsControls sidebar grid-cols-[auto_1fr] + the subgrid
chain → flex flex-col*"):

```
- <CardContent class="relative grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 px-4 py-3">
+ <CardContent class="relative flex flex-col gap-2 px-4 py-3">
...
- <div class="panel-content grid grid-cols-[subgrid] items-center gap-x-3 gap-y-2 w-full">
+ <div class="panel-content flex flex-col gap-2 w-full">
```
And the `.panel-row` scoped CSS dropped `grid-template-columns: subgrid` (kept `display:grid`
only for the `grid-template-rows 0fr↔1fr` crossfade — *WV-W3-NIT-1*).

### WHERE the field shape lives NOW (the crux for the fix)
W3 also rewrote the advanced rows to consume glass-ui's **`LabeledField` family**, not raw
`<label>`+control pairs. `ece4743 .../controls/LayerConfigPanel.vue`:

```
- <IconTooltip text="Stacking order in animation group">
-   <label class="text-body text-muted-foreground cursor-help">z-index</label>
- </IconTooltip>
- <Input type="number" ... />
+ <LabeledField label="z-index" tooltip="Stacking order in animation group" v-slot="{ controlId, errorId }">
+   <Input :id="controlId" :aria-errormessage="errorId" type="number" ... />
+ </LabeledField>
```
And `Separator class="col-span-2 my-1"` → `Separator class="my-1"`.

The current `advanced` fields (blend / z-index / enabled / weight) are now `LabeledSelect`,
`LabeledField`+`Input`, `LabeledSwitch`, `LabeledSlider` — all from `@mkbabb/glass-ui/labeled-field`.

**glass-ui `.labeled-field` is a plain `<div>` (block flow) with NO `display:flex/grid`** —
verified at source `/Users/mkbabb/Programming/glass-ui/src/styles/utilities.css:62` (the rule
sets only `--field-label-color`, no layout) and the template
`/Users/mkbabb/Programming/glass-ui/src/components/custom/labeled-field/LabeledField.vue`
renders `<label>` then `<slot/>` as block siblings → **label stacks ABOVE control**. The compiled
`node_modules/@mkbabb/glass-ui/dist/labeled-field.js` confirms only the `IconTooltip` wrapper
is `"flex items-center"`; the field body is block-stacked.

### Implication for the H fix (inv-16 boundary call)
Because the label-above shape is BAKED INTO glass-ui's `.labeled-field` block layout, restoring
label-LEFT/value-RIGHT is one of:
- **(a) glass-ui HANDOFF**: give `LabeledField` a horizontal/`orientation` mode (e.g.
  `.labeled-field` → `grid grid-cols-[auto_1fr] items-center` opt-in) — the isomorphic home,
  since five `Labeled*` consumers + EditorHeader share the family. This matches inv-16 (the
  field-shape authority is the published sibling, not the demo). Installed glass-ui is **3.4.0**;
  source repo is already at **3.6.0**, so a published bump is the clean vehicle.
- **(b) demo-side wrapper**: wrap the advanced panel in `grid grid-cols-[auto_1fr]` and feed the
  `Labeled*` controls their label via the parent — but glass-ui's `LabeledField` owns the
  `<label for/id>` a11y binding, so a demo re-split would duplicate that (the W3 §S2 note already
  recorded "glass-ui 3.4.0 LabeledField has no label-action slot — BOOKed as an optional
  glass-ui-HANDOFF"). A demo override of `.labeled-field { display:grid; grid-template-columns:
  auto 1fr }` (un-scoped, since the class is global) is the smallest demo-local lever but it
  reaches into a sibling's class — a NAMED befitting delta at best, brittle at worst.

Recommendation for the spec lane: treat F1 as the **glass-ui orientation HANDOFF** (born-RED kf
gate: `proof:controls-label-left` measuring `labelRect.right ≤ controlRect.left` on the advanced
rows), keeping the W3 `proof:single-column-pack` TRUE (one left edge for the row STACK).

---

## F9 — the controls idle-fade ("this used to be extant")

### Verdict
REAL and now ORPHANED. The controls pane DID dim after a delay of inactivity and brighten on
hover. The mechanism survives ONLY as dead wiring: the `usePaneHover` composable + the
`isPaneHovered → 'controls-pane--hovered'` class are still threaded today, but **the CSS rule
that consumed `.controls-pane--hovered` to drive opacity was deleted** — there is currently
**zero CSS** referencing that class.

Proof of orphan (HEAD): `git grep 'controls-pane--hovered'` returns exactly ONE hit, the class
binding in `ControlsPaneWrapper.vue:11` — no CSS rule anywhere uses it. The composable
`demo/@/components/custom/animation-controls/composables/usePaneHover.ts` is fully alive
(2000ms `useTimeoutFn` linger) and `isPaneHovered` is still passed
AnimationControlsGroup → ControlsPaneWrapper, but it now decorates a class no stylesheet reads.

### The two historical forms (both gone)

**(1) Pure-CSS idle-fade — the ORIGINAL.** Tuned across `088aab6` → `11550cd`
"style(demo): controls pane hover shadow and opacity" (the subject literally names it). The
rule (`11550cd:demo/@/components/custom/animation-controls/AnimationControlsGroup.vue` desktop
`@media (min-width: 1024px)` block):
```css
.controls-pane {
    opacity: 0.85;                              /* was 0.75 before this commit */
    transition: opacity 0.5s ease-out 2s;       /* <-- 2s DELAY then fade to dim */
}
.controls-pane:hover {
    opacity: 1 !important;
    transition: opacity 0.3s ease-out;          /* instant brighten on engagement */
}
```
The pre-`11550cd` value was `opacity: 0.75 !important; transition: opacity 0.6s ease-in-out 2.5s`
(visible inline as the `-` lines in `3b8b468`'s diff hunk). So historically: **idle dim ≈
0.75–0.85, delayed ~2–2.5s, brightening to 1 on hover.**

**(2) JS-linger idle-fade — the SUCCESSOR.** `3b8b468` "refactor(demo): extract dock components,
glassmorphism UI, controls pane hover" replaced the `:hover` selector with a JS-driven class so
the brightened state could LINGER after the mouse left. Result
(`3b8b468:.../AnimationControlsGroup.vue`, desktop block):
```css
.controls-pane--open { opacity: 1; ... }        /* idle = base */
/* JS-driven hover class: instant in, lingers 2s via timer */
.controls-pane--hovered.controls-pane--open {
    opacity: 1;
    transition: opacity 0.4s ease-in-out, transform 0.3s ease-out;
}
.controls-pane :deep(.controls-card)         { box-shadow: var(--shadow-card); }
.controls-pane--hovered :deep(.controls-card){ box-shadow: var(--shadow-card-hover); }
```
with the script (same commit):
```js
// --- Controls pane hover with linger delay ---
const isPaneHovered = ref(false);
let paneHoverTimer = null;
function onPaneMouseEnter()  { /* clear timer */ isPaneHovered.value = true; }
function onPaneMouseLeave()  { // Keep hovered state for 2s after mouse leaves so opacity lingers at 1
    paneHoverTimer = setTimeout(() => { isPaneHovered.value = false; }, /* 2000 */ ); }
```
This is the DIRECT ancestor of today's `usePaneHover.ts` (which `bbe9392` extracted and
`905a8c3`/D.W1.S4 moved onto `useTimeoutFn`, `lingerMs = 2000`).

### When the idle-fade DISAPPEARED
Between `3b8b468` and the D decomposition. By `905a8c3^` (the commit just before
`feat(tranche-D W1+W2+W3): demo decomposed`) the desktop block was already reduced to
open/closed only:
```css
.controls-pane--open   .controls-pane { opacity: 1; transform: translateX(0); ... }
.controls-pane--closed .controls-pane { opacity: 0; transform: translateX(-110%) rotate(-2deg); ... }
```
— no `--hovered` opacity rule, no idle dim. The D refactor (`905a8c3`) carried the
`ControlsPaneWrapper.vue` forward with the same open/closed-only opacity (verified
`905a8c3:.../components/ControlsPaneWrapper.vue` and current HEAD lines 155–196). So the idle-fade
CSS was dropped during the D-era extraction while the JS plumbing (`usePaneHover`,
`isPaneHovered`, the `--hovered` class) was kept — producing today's orphan.

### Discrepancy to flag for the spec lane
The user says **"~10s"**; every historical implementation used **~2–2.5s** (a 2s transition-delay
in the pure-CSS form; a 2s linger AFTER mouse-leave in the JS form). The restoration should pick
a deliberate idle threshold — `~10s` per the user's stated intent is fine and is what F9 asks for
("MUCH MORE TRANSPARENT after ~10s of no engagement"); note the old code dimmed sooner and only
to ~0.75. A faithful restore + the user's louder, later fade = pick a ~10s timeout and a deeper
target opacity (e.g. ≤ 0.4) and re-attach a CSS rule to the still-live `.controls-pane--hovered`
class (or invert to a `.controls-pane--idle` class), reusing `usePaneHover`'s `useTimeoutFn`.

### Lowest-friction restore path (for the impl lane)
The plumbing already exists — `usePaneHover` returns `isPaneHovered` and is wired to the pane's
`@mouseenter/@mouseleave` in `ControlsPaneWrapper.vue:16-17`. The fix is essentially: (1) bump
`lingerMs`/add an idle threshold to ~10s, and (2) re-add the deleted CSS consumer, e.g.
`.controls-pane:not(.controls-pane--hovered) { opacity: 0.4; transition: opacity … 10s }` (or the
inverse). Born-RED gate: `proof:controls-idle-fade` (computed opacity of `.controls-pane` drops
below a threshold after the idle window with no pointer events; returns to 1 on `mouseenter`).

---

## F4 — the ppmycota / pp-logo SVG

### Verdict
The "proper pp logo SVG" the user wants ALREADY EXISTS in this repo and is ALREADY rendered in
the menu — the problem is the menu wraps that logo with REDUNDANT text + emoji + URL, so the
brand mark reads as clutter rather than as the logo. There is no missing/lost asset to recover.

### Where the logo SVG lives
`assets/` (committed):
- `assets/ppmycota-logo.svg`   — `viewBox 0 0 283.8 316.8` (the original, 2024-01-17)
- `assets/ppmycota-logo-2.svg` — `370×370` (the LARGE mark, 2024-07-01)
- `assets/ppmycota-logo-3.svg` — `312×312` (the SMALL mark, 2024-07-01)

Wired in `demo/@/styles/brand.css` (D.W2.S2 — "the ppmycota brand-mark rules"):
```css
.ppmycota-logo-lg { background-image: url("@assets/ppmycota-logo-2.svg"); background-size: cover;   filter: var(--filter-brand-color); }
.ppmycota-logo-sm { background-image: url("@assets/ppmycota-logo-3.svg"); background-size: contain; ... filter: var(--filter-brand-color); }
```
The tint token `--filter-brand-color` lives in `demo/@/styles/style.css:175`
(`invert(55%) sepia(80%) … hue-rotate(220deg) …`), approximating `--ppmycota-primary:
hsl(248 88% 71%)`.

### Siblings / web check
NOT in the siblings — `grep -rli ppmycota` over `/Users/mkbabb/Programming/{value.js,glass-ui,
parse-that}` (src + assets) returns nothing, and no `*pp*logo*`/`*mycota*` files there.
keyframes.js OWNS the asset locally. The brand is also a live web property (`ppmycota.com`,
linked from the menu) — but the canonical SVG is the local `assets/ppmycota-logo-3.svg`, so no
fetch is required.

### The actual F4 defect — the menu markup
The dropdown lives in `demo/app/App.vue` (NOT ChromeDock.vue — `ChromeDock.vue` has no ppmycota
item). The offending item, `App.vue:49-61`:
```html
<DropdownMenuItem @select.prevent class="flex items-center gap-2.5 px-1.5 py-1 rounded-lg cursor-pointer" @click="togglePpMode">
    <div class="ppmycota-logo-sm w-7 h-7 shrink-0 scale-on-hover"></div>   <!-- this IS the SVG, via brand.css -->
    <div class="flex-1 min-w-0">
        <span class="text-small" :style="{ color: 'var(--ppmycota-primary)' }">ppmycota</span>
        <p class="text-admin-label text-muted-foreground leading-tight">&#x1F642;&#x200D;&#x2194;&#xFE0F; &#x1F331; &#x1F344;&#x200D;&#x1F7EB;</p>  <!-- the emoji line 🙂‍↔️ 🌱 🍄‍🟫 -->
        <a href="https://ppmycota.com" ...>ppmycota.com</a>
    </div>
</DropdownMenuItem>
```
So the menu shows: **`.ppmycota-logo-sm` SVG (left) + "ppmycota" text + the emoji `<p>` + the
ppmycota.com link.** F4 ("shows the text 'ppmycota' + emoji + PPMYCOTA.COM … wants the PROPER pp
logo SVG") is therefore satisfied by promoting the existing `.ppmycota-logo-sm` SVG to BE the
brand mark and removing the emoji line (and possibly the redundant "ppmycota" word-mark), mirroring
how `@mbabb` and `Share` items present a single mark + caption. The emoji line entered via
`3b8b468` (the popover-branding commit) and predecessors (`189c5c2` "minor refinements",
`48e95c2` "tmp mycota mode").

NOTE: this menu item is dual-purpose — its whole row already carries `@click="togglePpMode"`
(`App.vue:235`), i.e. clicking it toggles "pp mode". So the F4 cleanup must preserve that
whole-row toggle while swapping the text/emoji presentation for the proper SVG mark.

---

## F5 (adjacent — surfaced in the SAME file as F4)

The archaeology of the F4 menu directly answers F5. In the SAME dropdown (`App.vue:37-44`):
```html
<!-- Dark mode -->
<DropdownMenuItem @select.prevent class="flex items-center gap-2.5 px-1.5 py-1 rounded-lg">  <!-- NO @click on the row -->
    <DarkModeToggle title="Toggle dark mode" class="aspect-square w-5" />                     <!-- only the ICON toggles -->
    <span class="text-small text-foreground">Dark mode</span>
</DropdownMenuItem>
```
The Dark-mode row has **no `@click`**, so only the `<DarkModeToggle>` icon flips the theme —
exactly F5's complaint. The fix precedent is RIGHT BELOW it: the ppmycota item puts
`@click="togglePpMode"` on the whole `DropdownMenuItem`. The idiomatic, no-handoff fix:
- glass-ui's `DarkModeToggle` has a **`passive`** prop — source
  `/Users/mkbabb/Programming/glass-ui/src/components/custom/controls/DarkModeToggle.vue:79`
  (`@click="!passive && toggleDark()"`). With `passive`, the icon becomes a pure indicator.
- glass-ui exports **`useGlobalDark` from `@mkbabb/glass-ui/dark`** (returns `{ isDark, toggleDark }`)
  — already imported elsewhere in the demo (`CSSCodeEditor.vue:38`, `useHighlightCSS.ts:2`).
- So: `<DarkModeToggle passive ... />` + `@click="toggleDark()"` on the whole `DropdownMenuItem`,
  matching the ppmycota row. Demo-local, idiomatic, no glass-ui change. Born-RED gate:
  `proof:dark-row-toggles` (clicking the row's label/padding — not just the icon — flips
  `<html class="dark">`).

---

## Anchor index (commit · path · line)

| Item | Anchor | What it proves |
|---|---|---|
| F1 introduced | `4a1c1cd` (2026-02-26) | `grid-cols-[auto_1fr]` first appears |
| F1 correct snapshot | `cfea657:demo/@/components/custom/animation-controls/AnimationControlsControls.vue:4,252-308` | label-LEFT(auto)/value-RIGHT(1fr) rows + subgrid propagation + col-span-2 |
| F1 regression | `ece4743:.../controls/AnimationControlsControls.vue` (§S1) | `grid-cols-[auto_1fr]` → `flex flex-col` |
| F1 field-shape now | `ece4743:.../controls/LayerConfigPanel.vue` + glass-ui `LabeledField.vue` + `utilities.css:62` | fields are glass-ui `Labeled*` (block-stacked label-above) |
| F1 glass-ui version | installed `3.4.0`, source `3.6.0` | handoff vehicle = a published bump |
| F9 pure-CSS form | `11550cd:.../AnimationControlsGroup.vue` | `.controls-pane{opacity:.85;transition:opacity .5s ease-out 2s}` + `:hover{opacity:1}` |
| F9 JS-linger form | `3b8b468:.../AnimationControlsGroup.vue` | `.controls-pane--hovered.controls-pane--open{opacity:1}` + 2s linger timer |
| F9 removed by | `905a8c3^` already open/closed-only; D refactor carried it; HEAD orphan | `git grep controls-pane--hovered` = 1 hit (class binding, no CSS) |
| F9 live plumbing | `demo/@/components/custom/animation-controls/composables/usePaneHover.ts` (2000ms `useTimeoutFn`) + `ControlsPaneWrapper.vue:11,16-17` | composable + class still wired, CSS gone |
| F4 asset | `assets/ppmycota-logo{,-2,-3}.svg` + `demo/@/styles/brand.css:26-37` | proper pp logo SVG exists + is wired (`.ppmycota-logo-sm/-lg`) |
| F4 defect | `demo/app/App.vue:49-61` (+ `togglePpMode` `:235`) | menu = SVG + "ppmycota" + emoji line + ppmycota.com; emoji is the clutter |
| F4 siblings | `grep -rli ppmycota` over value.js/glass-ui/parse-that = ∅ | keyframes.js owns the asset locally; ppmycota.com is the live web property |
| F5 defect | `demo/app/App.vue:37-44` | Dark-mode row has no `@click`; only `DarkModeToggle` icon toggles |
| F5 fix lever | glass-ui `DarkModeToggle` `passive` prop (`DarkModeToggle.vue:79`) + `useGlobalDark` (`@mkbabb/glass-ui/dark`) | `passive` indicator + row-level `@click="toggleDark()"`, mirroring the ppmycota row |
