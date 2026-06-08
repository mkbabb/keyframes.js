# R1 — Source Root-Cause (F1–F9)

Lane R1 · read-only source root-cause of the user's 9 feedback items on the
landed `tranche-h-impl` demo (W0–W4+W6 landed; W5 landing concurrently). Every
finding is anchored to a `file:line` in the CURRENT committed source (HEAD
`084feb9`). NO build was run. Anchors are the demo `@/`, the `app/` entry, the
scene sidebars, and the consumed `@mkbabb/glass-ui` dist (inv-16 — the demo
CONSUMES; the glass-ui anchors mark where a HANDOFF would land, not a demo
patch).

Summary verdict, up front:

| # | Item | Root cause one-liner | Fix locus |
|---|------|----------------------|-----------|
| F1 | controls row layout | W3 collapsed the `grid-cols-[auto_1fr]` + subgrid chain to `flex flex-col`; rows now stack label-OVER-value | demo (re-introduce a 2-cell row shape, keep one left edge) |
| F2 | bézier panel scroll + back | content (header + 280px canvas + readout + preset select) exceeds the `min(50vh,480px)` cap → scrollbar; back button is a separate top-LEFT `<Button>` above the title | demo (fit the panel; bake back into the header right) |
| F3 | specular too dramatic | `--specular-rest 0.22 / --specular-hover 0.4` + cursor-tracked travel reads hot on the bezier card | demo tune (lower) or remove |
| F4 | ppmycota logo | the SVG logo ALREADY renders (`ppmycota-logo-sm` → `ppmycota-logo-3.svg`); the emoji is a SEPARATE `<p>` line of decoration | demo (drop/replace the emoji `<p>`) |
| F5 | dark-mode click target | only the `<DarkModeToggle>` button toggles; the `<span>Dark mode</span>` label is inert (the `DropdownMenuItem` `@select.prevent` is suppressed, no row `@click`) | demo (row-level click → toggle) |
| F6 | specular only on bezier | the W2 "one composite exception" — only TimingFunctionPanel's bezier card carries `cartoon-specular glass-specular-track` + `useSpecularPointer`; the other ~10 cartoon Cards do not | decision: consistent-or-remove |
| F7 | hover shadow clipped bottom-LEFT | the cartoon offset-stamp shadow casts bottom-LEFT (`--shadow-cartoon-* = -Xpx +Ypx`); `.controls-pane-wrapper{overflow:hidden}` + `.controls-content` having only right/bottom padding clip exactly that corner | demo (clearance) / structural |
| F8 | not as glassy | W2 flipped `.glass-card` (tier `quiet`, ~0.50α/10px) → `surface="cartoon"` (defaults tier `resting`, ~0.65α/12px) + 2px solid border + opaque-reading offset stamp; cards got MORE opaque, not less | demo (tier=quiet/wash + cartoon) |
| F9 | idle-fade gone | the hover infra survives (`usePaneHover` 2s linger, `.controls-pane--hovered` applied) but the opacity rules that CONSUMED it (`idle 0.85` rest, lift to `1` on hover) were stripped; the class is now dead | demo (re-author the rest-dim rule) |

---

## F1 — controls row layout (revisits W3): label-LEFT / value-RIGHT, one column

**The user's ask.** Each field row should be label-LEFT + value-RIGHT (a 2-cell
row), while keeping ONE column of rows (W3's D1 single-column-pack — the sidebar
must not become two side-by-side columns of fields).

**Current state.** `AnimationControlsControls.vue:4` —
`<CardContent class="relative flex flex-col gap-2 px-4 py-3">`. The panel rows
are `flex flex-col`: `.panel-content flex flex-col gap-2 w-full`
(`AnimationControlsControls.vue:9, 133`). Each field is a `<LabeledInput>` /
`<LabeledSelect>` / `<LabeledField>` wrapper, and those wrappers render the label
ABOVE the control (see the LabeledField shape below), so every row reads
label-over-value stacked.

The `advanced` sub-pane the user names (blend / z-index / enabled) is
`LayerConfigPanel.vue`: `<LabeledSelect label="blend">` (`:3`), a raw
`<LabeledField label="z-index">` + slotted `<Input>` (`:19`), `<LabeledSwitch
label="enabled">` (`:46`). All of these inherit the LabeledField stacked shape.

**Why it stacks — the LabeledField internals.** `LabeledField` renders a flat
`<div class="labeled-field">` containing the `<label>` then the control `<slot>`
as block-flow siblings — NO flex/grid on `.labeled-field`
(`@mkbabb/glass-ui/dist/labeled-field.js:34-62`; the `.labeled-field` utility at
`utilities.css:62-67` only sets `--field-label-color`, not display). So a
LabeledField is INHERENTLY label-over-control. The four wrappers (LabeledInput
`:64`, LabeledSelect `:115`, LabeledSlider `:172`, LabeledSwitch `:218`) all
compose `LabeledField`, so they ALL stack.

**The OLD correct layout (git history).** Before W3, the row was a 2-track grid
with subgrid propagation:

- `cfea657` ("subgrid alignment") introduced it: CardContent
  `grid grid-cols-[auto_1fr] gap-x-3 gap-y-1`, the panel-stack
  `col-span-2 grid grid-cols-[subgrid]`, each panel-content
  `col-span-2 grid grid-cols-[subgrid] items-center gap-x-3 gap-y-2`.
- `ece4743` (W3, "the rail·stage·rail layout") COLLAPSED it. The diff
  (`git show ece4743 -- …/AnimationControlsControls.vue`):
  - `- CardContent class="… grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 …"`
    → `+ flex flex-col gap-2`
  - `- panel-content grid grid-cols-[subgrid] items-center …`
    → `+ panel-content flex flex-col gap-2 w-full`
  - removed every `col-span-2` marker (Separator, advanced row, easing block).
  - in the `<style scoped>`: `- grid-template-columns: subgrid;` deleted from
    `.panel-row` (`AnimationControlsControls.vue:303` now `display: grid` with
    only `grid-template-rows` for the collapse crossfade).

The W3 commit message explains the intent: "the lopsided two-column sidebar (was
grid-template-columns 212px 466px) collapses to … flex flex-col." W3 conflated
TWO things: (a) the OUTER two-column sidebar (rail = 212px + stage = 466px — the
real D1 lopsidedness), and (b) the per-row INNER `[auto_1fr]` label|value grid.
Collapsing (a) was correct; collapsing (b) is what F1 wants reverted.

**The reconcile — can a row be label-left/value-right while keeping one left
edge?** YES. The `proof:single-column-pack` invariant is that all ROWS share one
left edge (one column of rows, not two columns of fields). A per-row internal
`grid grid-cols-[auto_1fr]` (or `flex items-center justify-between`) does NOT
violate that — every row still starts at the same left edge; only the row's
INTERNAL content splits label-left / value-right. The clean idiom is to restore
the CardContent `grid grid-cols-[auto_1fr] gap-x-3` + `grid-cols-[subgrid]`
propagation so each LabeledField row's label lands in track 1 and its control in
track 2.

**The structural blocker (the honest seam).** For the subgrid to place
label|control in the two tracks, the `.labeled-field` div must participate in the
grid — i.e. it needs `display: contents` (so its `<label>` + control become the
grid's direct children) OR `display: grid; grid-template-columns: subgrid` on the
`.labeled-field` itself. glass-ui's `.labeled-field` is plain block flow today
(`utilities.css:62`), and the W3 note already records this exact gap: "glass-ui
3.4.0 `<LabeledField>` exposes only default+error slots (no label-action slot…) —
a glass-ui label-action slot is BOOKED as an OPTIONAL handoff"
(`AnimationControlsControls.vue:67-73`). The row-layout (label-left/value-right)
is the SAME class of gap: glass-ui owns `.labeled-field`'s display, so a
first-class "row" / "inline" layout variant on `<LabeledField>` is the idiomatic
home (a glass-ui HANDOFF, born-RED gate). A demo-side stopgap is a wrapper grid
where the demo authors the label and slots the bare control (bypassing the
LabeledField label layer) — but that re-forks the label affordance the wrappers
exist to single-source, so the HANDOFF is the no-legacy answer.

Anchors: `AnimationControlsControls.vue:4,9,133`; `LayerConfigPanel.vue:3,19,46`;
`@mkbabb/glass-ui/dist/labeled-field.js:34-62`;
`@mkbabb/glass-ui/dist/styles/utilities.css:45-67`; git `cfea657`, `ece4743`.

---

## F2 — cubic-bézier panel (W4): must not scroll; bake back into the header (right)

**The user's ask.** (a) The panel should NOT scroll — content overflows → a
scrollbar; make it fit. (b) The "← back to controls" button currently sits
top-LEFT above the title; bake the back affordance into the cubic-bézier HEADER
on the RIGHT (header row: title left, back/close right).

**Where the scroll comes from.** TWO compounding causes:

1. The detail panel has a hard height cap with `overflow-y: auto`:
   `AnimationControlsControls.vue:331-334` —
   `.panel-row--detail.panel-row--active > .panel-content { max-height:
   min(50vh, 480px); overflow-y: auto; }`. Any content taller than `min(50vh,
   480px)` scrolls.

2. The bézier panel's intrinsic height EXCEEDS that cap. Stacked in
   `TimingFunctionPanel.vue`: the back `<Button>` (`:5-12`, `mb-2`), the
   `cubic-bézier` title + optional "editing:" line + the timing-string readout
   row (`h-6`, `:34-48`), the `<EasingCurveCanvas>` (its block sizes at
   `38cqi` clamped to `[160px, 280px]` — the W4 ceiling; `:51-58` +
   `.easing-editor { container-type: inline-size }` `:245-248`), then the preset
   `<Select>` row (`:60-79`). Header (~24px) + readout (24px) + canvas (up to
   280px) + select (~40px) + gaps + the back button (~32px + mb-2) sums past
   480px on a short viewport, so the cap clips and the scrollbar appears. The
   canvas `280px` ceiling is the dominant term (W4 `.easing-editor` clamp).

**The fit path.** Reduce the standing height: drop the canvas ceiling for the
detail-panel host (a smaller clamp in the panel context), and/or fold the
readout into the header row (F2b removes one full row), and/or relax the
`overflow-y: auto` to `visible` once the content fits — the panel-row crossfade
already constrains via `grid-template-rows` so the `max-height` cap is the
belt-and-braces that produces the scrollbar.

**Where the back button lives.** `TimingFunctionPanel.vue:5-12` — a standalone
`<Button variant="ghost" … justify-self-start … mb-2 @click="emit('exitDetail
Panel')">` with `<ArrowLeft/> back to controls`, rendered ABOVE the `<Card>` /
`<CardHeader>` (the grid container is `:2-4`,
`grid justify-items-center`; the button is `justify-self-start` → top-left). The
cubic-bézier title is INSIDE the Card header:
`CardHeader … <CardTitle>cubic-bézier</CardTitle>` (`:31-32`). So the back
affordance is structurally OUTSIDE and ABOVE the card header — F2b wants it moved
INTO the `<CardHeader>` as a right-aligned row item (title left, back/close
right). The header is currently a `grid gap-0` (`:31`); a `flex items-center
justify-between` header row with the title left and a back/close icon-button
right is the idiomatic shape.

Anchors: `AnimationControlsControls.vue:331-334`; `TimingFunctionPanel.vue:2-12,
30-32, 51-58, 60-79, 245-248`.

---

## F3 — specular too dramatic (revisits W2)

**The user's ask.** The tracked catch-light on the bezier card is overpowering;
dial it down.

**Root cause — the magnitude.** The S2-COMPOSITE intensity is single-sourced in
`useSpecularPointer.ts:42` — `const { rest = 0.22, hover = 0.4 } = options;` —
and the call site passes no override (`TimingFunctionPanel.vue:198`
`useSpecularPointer(() => bezierCardRef.value?.$el ?? null)`), so it runs at
0.22 rest / 0.4 hover. These are written onto the host as `--specular-rest` /
`--specular-hover` (`useSpecularPointer.ts:54-55`) and projected onto the pseudo
by the recipe `design-idioms.css:277-282`
(`.cartoon-specular::before { --specular-intensity: var(--specular-rest, 0.22) }`
/ `:hover::before { … var(--specular-hover, 0.4) }`). glass-ui's own defaults are
hotter (0.35 rest → 0.6 hover, `useSpecularPointer.ts:18-20` comment), so W2
already calmed it — the user says NOT ENOUGH.

**Two contributing axes, not just the floor:**

1. The intensity numbers (0.22 / 0.4) — lower them (e.g. 0.12 / 0.22).
2. The cursor TRAVEL — the pointer write (`useSpecularPointer.ts:62-72`) makes
   the catch-light chase the cursor across the card; a tracked highlight reads
   far more "dramatic" than a static one even at the same intensity. Calming may
   mean reducing intensity AND/OR dropping the tracking (the static centered
   bloom is calmer), which also bears on F6.

This is a pure tuning surface (the magnitude lives in ONE place,
`useSpecularPointer.ts:42`); changing the two literals retunes every consumer.

Anchors: `useSpecularPointer.ts:42, 54-55, 62-72`;
`design-idioms.css:266-282`; `TimingFunctionPanel.vue:198`.

---

## F4 — ppmycota logo (new): the proper pp SVG

**The user's ask.** The @mbabb menu's ppmycota item shows text "ppmycota" + emoji
(😴🌱🍄) + ppmycota.com; the user wants the PROPER pp logo SVG (an existing brand
asset).

**Key finding — the SVG ALREADY renders.** The ppmycota item ALREADY shows the
proper logo SVG: `App.vue:50` —
`<div class="ppmycota-logo-sm w-7 h-7 shrink-0 scale-on-hover"></div>`. The
`.ppmycota-logo-sm` class (`@styles/brand.css`) sets
`background-image: url("@assets/ppmycota-logo-3.svg")` (the source asset is
`/Users/mkbabb/Programming/keyframes.js/assets/ppmycota-logo-3.svg`; siblings
`ppmycota-logo.svg`, `-2.svg` also exist), `background-size: contain`,
`filter: var(--filter-brand-color)`. So the 28×28 pp logo SVG IS the leading
mark of the row already.

**What the user is actually objecting to.** The TEXT block beside the logo —
`App.vue:57-59`:
- `<span … color: var(--ppmycota-primary)>ppmycota</span>` (the brand word)
- `<p …>🙂‍↔️ 🌱 🍄‍🟫</p>` — the emoji line at `:58` (HTML entities
  `&#x1F642;&#x200D;&#x2194;&#xFE0F; &#x1F331; &#x1F344;&#x200D;&#x1F7EB;`: a
  face-with-diagonal, a seedling, a brown-mushroom). This is the
  "😴🌱🍄" decoration the user calls out.
- `<a href="https://ppmycota.com">ppmycota.com</a>` (`:59`).

So F4 reads as: the menu's "ppmycota text + emoji + PPMYCOTA.COM" should be
REPLACED by the proper pp logo as the row's identity, not garnished with emoji.
The asset already exists and is wired; the fix is to drop (or replace) the emoji
`<p>` line `:58` — and, if the brand WORDMARK is itself an SVG (the `ppmycota-
logo-2.svg` / `-3.svg` are logo marks), to lead with the SVG mark rather than the
typed "ppmycota" word. No new asset hunt is needed: the brand SVGs live at
`/Users/mkbabb/Programming/keyframes.js/assets/ppmycota-logo*.svg` and are
already consumed via `brand.css`.

Anchors: `App.vue:48-61` (esp. `:50` logo, `:57` word, `:58` emoji, `:59` link);
`@styles/brand.css` (`.ppmycota-logo-sm`/`-lg` rules);
`/Users/mkbabb/Programming/keyframes.js/assets/ppmycota-logo-{,-2,-3}.svg`.

---

## F5 — dark-mode dock item: whole row should toggle (new)

**The user's ask.** Only the sun/moon ICON toggles dark mode; the WHOLE item
(row + label + icon) should be the click target.

**Root cause.** `App.vue:38-44`:
```
<DropdownMenuItem @select.prevent class="flex items-center gap-2.5 px-1.5 py-1 rounded-lg">
    <DarkModeToggle title="Toggle dark mode" class="aspect-square w-5" />
    <span class="text-small text-foreground">Dark mode</span>
</DropdownMenuItem>
```
The toggle lives ONLY in `<DarkModeToggle>` (a glass-ui `<button>` that owns
`toggleDark`; `@mkbabb/glass-ui/dist/controls.js:6-51` — the click handler is
internal to the component's own `<button>`). The `<span>Dark mode</span>` is
inert text. The `DropdownMenuItem` carries `@select.prevent` (it SUPPRESSES the
default menu-item select so the menu stays open) and NO `@click` handler — so
clicking the label or the row gutter does nothing. Contrast the SIBLING ppmycota
item (`App.vue:49`) which DOES carry a row-level handler:
`<DropdownMenuItem @select.prevent … @click="togglePpMode">` — that whole row IS
the click target. The dark-mode item simply omits the equivalent row `@click`.

**The fix shape.** Give the dark-mode `DropdownMenuItem` a row-level
`@click="…toggleDark"` (mirroring the ppmycota row at `:49`), and make the
`<DarkModeToggle>` `passive` (its `passive?: boolean` prop, DarkModeToggle.vue.d
`__VLS_Props`) so the inner button reflects state without double-toggling when
the row fires. `useDark`/`toggleDark` is glass-ui's (the demo imports
`DarkModeToggle` from `@mkbabb/glass-ui/controls`, `App.vue:158`); the row handler
calls the same toggle. This is a demo-local wiring fix — no glass-ui change.

Anchors: `App.vue:38-44, 49, 158`;
`@mkbabb/glass-ui/dist/controls.js:6-51`;
`@mkbabb/glass-ui/dist/components/custom/controls/DarkModeToggle.vue.d.ts`
(`passive` prop).

---

## F6 — specular only on the bezier card (revisits W2): consistent or remove

**The user's ask.** The specular is present only on SOME items (just the bezier
composite now); why? Either make it CONSISTENT across the relevant surfaces OR
remove it entirely.

**Root cause — the W2 "one composite exception" decision.** The specular
composite is applied to EXACTLY ONE Card. Inventory of the demo's cartoon Cards
(grep `surface="cartoon"` over source):

| Card | specular? | anchor |
|------|-----------|--------|
| bézier editor | YES — `cartoon-specular glass-specular-track` + `useSpecularPointer` | `TimingFunctionPanel.vue:30, 198` |
| controls sidebar | no | `AnimationControlsControls.vue:3` |
| ribbon bar | no | `RibbonBar.vue:3` |
| steps panel | no | `TimingFunctionPanel.vue:87` |
| keyframes editor | no | `KeyframesEditor.vue:3` |
| keyframe timeline | no | `KeyframeTimeline.vue:3` |
| matrix editor | no | `MatrixEditor.vue:2` |
| asset viewport | no | `AssetViewport.vue:12` |
| asset layer panel | no | `AssetLayerPanel.vue:2` |
| easing sidebar ×2 | no | `EasingSidebar.vue:19, 40` |
| spring sidebar ×3 | no | `SpringSidebar.vue:4, 60, 81` |

So ~14 cartoon Card sites, ONE carries specular. The W2 rationale
(`design-idioms.css:245-261`, `TimingFunctionPanel.vue:17-29`): the bézier editor
is "the ONE legitimate demo class-composition … the one direct-manipulation
surface the user wants glassy." That is precisely the "one exception" F6
challenges. The decision is documented as deliberate, but the user finds the
inconsistency jarring.

**The two reconcile paths (the user named both):**

1. REMOVE entirely. Delete `useSpecularPointer` (the composable + the call at
   `TimingFunctionPanel.vue:175,198`), drop the `cartoon-specular glass-specular-
   track` classes from `:30`, and retire the `.cartoon-specular` recipe
   (`design-idioms.css:245-282`). Net deletion; the bezier card becomes a plain
   cartoon Card like its siblings. This pairs naturally with F3 (too dramatic) —
   removal is the strongest "calm."
2. CONSISTENT. Promote the specular to ALL relevant interactive cartoon Cards.
   But this multiplies a `::before` backdrop pseudo across ~14 surfaces — the
   glassmorphism-perf audit (`audit/a-glassmorphism-perf.md`) flags
   `backdrop-filter`/specular as glass-ui's most expensive idiom, so consistency
   has a measured cost; only the direct-manipulation surfaces (bezier, maybe the
   matrix/spring sliders) would earn it.

Given F3 + F6 + F8 together (the user wants calmer, glassier, less dramatic), the
gestalt points to REMOVE the tracked specular and instead recover broad GLASS via
F8 (tier-quiet cartoon). That collapses three findings into one coherent move.

Anchors: `TimingFunctionPanel.vue:17-30, 175, 198`;
`useSpecularPointer.ts` (whole file); `design-idioms.css:245-282`; the 14
`surface="cartoon"` sites above; `audit/a-glassmorphism-perf.md`.

---

## F7 — cartoon hover box-shadow sharp + cut-off bottom-LEFT (W2): the clip

**The user's ask.** The cartoon-surface hover box-shadow is strangely SHARP and
CUT OFF in the bottom-left (a clipping artifact). Root-cause the clip.

**Two facts compose into the artifact:**

1. **The cartoon offset shadow casts bottom-LEFT.** `cartoon-surface`
   (`@mkbabb/glass-ui/dist/styles/cards.css:33-48`) is
   `box-shadow: var(--shadow-cartoon-md)` at rest, `var(--shadow-cartoon-lg)` on
   hover, plus `translate: var(--lift-sm) var(--lift-sm)` on hover. The token
   values (`tokens.css:543-551`):
   - `--shadow-cartoon-md: -4px 3px 1px …, 0 4px 1px …, -4px 4px 2px …`
   - `--shadow-cartoon-lg: -6px 4px 1px …, 0 6px 1px …, -6px 6px 2px …`

   The X offsets are NEGATIVE (`-4px`/`-6px`) and Y POSITIVE (`+3..6px`) → the
   stamp projects to the BOTTOM-LEFT. The hover lift adds `translate: -1px -1px`
   (`--lift-sm: -1px`, `tokens.css:830`), moving the card up-left and growing the
   shadow to `-6px` left — so on hover the bottom-LEFT protrusion is at its
   largest (~6–8px beyond the card box). The shadows are `0px`–`2px` blur (a
   crisp Memphis stamp), which is exactly why the user reads it as "SHARP."

2. **The clipping ancestors clip the bottom-LEFT.** On desktop the controls pane
   wrapper sets `overflow: hidden`
   (`ControlsPaneWrapper.vue:182`, `@media (min-width: 1024px)`), and the inner
   `.controls-pane` toggles `overflow-y-auto` / `overflow-hidden`
   (`ControlsPaneWrapper.vue:20-22`). The `.controls-content` budgets shadow
   clearance with `padding-right: 12px; padding-bottom: 12px`
   (`ControlsPaneWrapper.vue:207-208`) — i.e. clearance on the RIGHT and BOTTOM
   only, but the cartoon stamp casts to the LEFT. So the bottom-LEFT lobe has
   ZERO clearance and is sliced by the `overflow:hidden` edge — a sharp straight
   cut, exactly the reported artifact. (The W3 `.controls-content { width:
   var(--rail-width); box-sizing: border-box }` `:204-205` means the content fills
   the rail to its left edge, leaving no room for a left-casting shadow.)

   A secondary clip exists inside the controls card: `.panel-content { overflow:
   hidden }` (`AnimationControlsControls.vue:313`, required for the
   grid-template-rows collapse crossfade) — though the controls Card itself is
   `overflow-visible` (`:3`), so the primary clip is the pane wrapper.

**Root cause, one line.** The cartoon offset shadow casts bottom-LEFT, but the
clearance padding + `overflow:hidden` on the controls-pane chain only protects the
RIGHT/BOTTOM — the asymmetry slices the shadow's bottom-left lobe. Fix path: add
left/bottom clearance (`padding-left`/`padding-bottom` on `.controls-content` to
match the cartoon cast direction) OR drop the `overflow:hidden` to `visible` where
the rail-collapse clip is not needed OR (cleaner) reconcile the cartoon shadow
direction. Note this is a STRUCTURAL tension between the W3 rail-collapse
(`overflow:hidden` is load-bearing for the track-width clip) and the W2 cartoon
left-cast shadow — the gate should bite on the live corner, not just source.

Anchors: `@mkbabb/glass-ui/dist/styles/cards.css:33-48`; `tokens.css:543-551,
830`; `ControlsPaneWrapper.vue:20-22, 182, 204-208`;
`AnimationControlsControls.vue:3, 313`.

---

## F8 — cards not as glassy as before the box-shadow (revisits W2 CORE)

**The user's ask.** "The cards are not quite as glassy as they used to be before
the box-shadow — any way to have both?" Wants the GLASS (backdrop blur /
translucency) BACK, TOGETHER WITH the cartoon depth (box-shadow), broadly — glass
+ cartoon coexisting as the DEFAULT panel register, calmer than the dramatic
bezier composite but glassy.

**Root cause — W2 silently raised the opacity tier.** Two compounding shifts when
W2 flipped the panels to `surface="cartoon"`:

1. **Tier went quiet → resting (MORE opaque).** The OLD demo card was the
   `.glass-card` recipe (`@mkbabb/glass-ui/dist/styles/glass.css:175-183`):
   `background: var(--glass-bg-quiet)` + `backdrop-filter: var(--glass-blur-
   quiet)` — the **quiet** tier (~0.50α, 10px blur; `tokens.css:572-573, 581,
   601`). The W3 diff confirms the demo carried `glass-card`:
   `git show ece4743` shows `- <Card class="… glass-card">`. The NEW
   `surface="cartoon"` Card has NO explicit `tier`, so it defaults to
   `tier="resting"` (Card.vue.d.ts: "Default `resting`"; `resting` ~0.65α, 12px
   blur; `tokens.css:576, 583, 600`). `surface` is ORTHOGONAL to `tier`
   (Card.vue.d.ts `CardSurface` doc) — so the cartoon flip didn't just add depth,
   it bumped the background from 0.50α → 0.65α. The cards became MORE opaque, the
   exact opposite of glassy.

2. **The 2px solid border + crisp offset stamp read as opaque.**
   `cartoon-surface` adds `border-width: 2px` + the sharp Memphis stamp
   (`cards.css:34-35`). A solid 2px outline + a hard sticker shadow visually
   reads as a flat opaque card even when the fill is translucent — reinforcing
   the "lost the glass" perception.

**The "any way to have both?" answer — YES, already proven.** The S2-COMPOSITE
(the bezier card) IS the existence proof that glass + cartoon coexist:
`surface="cartoon"` + `glass-specular-track` over the resolved glass tier
(`TimingFunctionPanel.vue:30`; `design-idioms.css:245-261`). The user wants that
coexistence "calmer + broader" — i.e. WITHOUT the dramatic tracked specular (F3 /
F6), but WITH the glass translucency restored. The fix path: keep
`surface="cartoon"` (the depth) but set an explicit GLASSIER tier — `tier="quiet"`
(recover the old 0.50α/10px) or `tier="wash"` (0.30α/1px, even glassier) — on the
broad panel Cards. That gives glass + cartoon as the DEFAULT register. The bezier
composite then stands apart only by being calmer-or-specular-free, not by being
the lone glassy card.

(Caveat: `prefers-reduced-transparency: reduce` maps every `--glass-blur-*` to
`none`, `glass.css:374-379` — so the glass is correctly suppressed for that user;
the tier choice still governs the opacity floor.)

Anchors: `@mkbabb/glass-ui/dist/styles/glass.css:175-183, 374-379`;
`tokens.css:572-583, 600-601`; `cards.css:33-48`;
`Card.vue.d.ts` (`CardTier`/`CardSurface`, default `resting`);
`TimingFunctionPanel.vue:30`; `design-idioms.css:245-261`; git `ece4743`.

---

## F9 — controls idle-fade (restore): pane should fade transparent on idle

**The user's ask.** After ~10s of no engagement (no hover/interaction) the
controls sidebar should become MUCH MORE TRANSPARENT. "This used to be extant."

**Root cause — the infra survives, the opacity rule was stripped, so the class is
DEAD.** The hover-tracking machinery is fully present:

- `usePaneHover.ts` — computes `isPaneHovered` = direct pane hover OR dock hover,
  with a `useTimeoutFn` LINGER (default `lingerMs = 2000`,
  `usePaneHover.ts:12, 25-31`); `onPaneMouseLeave` starts the 2s timer
  (`:38-40`), `onPaneMouseEnter` cancels it and sets hovered (`:33-36`).
- `useControlsLayout.ts:50` wires it and returns `isPaneHovered`.
- `ControlsPaneWrapper.vue:11` APPLIES the class:
  `isPaneHovered ? 'controls-pane--hovered' : ''` on the wrapper, and the inner
  pane carries `@mouseenter`/`@mouseleave` (`:16-17`).

But **NO CSS rule in source consumes `.controls-pane--hovered`** (grep over
`demo/**/*.{vue,css,ts}` excluding `/dist/`: the ONLY hit is the apply site
`ControlsPaneWrapper.vue:11`). The pane's open-state opacity rests at `1`
unconditionally (`ControlsPaneWrapper.vue:159-161` mobile, `:190-193` desktop:
`.controls-pane--open .controls-pane { opacity: 1 }`). So the hover state is
computed and the class painted, but nothing dims the pane — the idle-fade is
gone, the class is vestigial.

**Proof it "used to be extant" + the canonical recipe (git history).**
`git log -S "opacity: 0.75"` and `git show 11550cd`
("style(demo): controls pane hover shadow and opacity") — commit message:
"**Idle opacity 0.85 with 2s delayed restore, instant on hover**." The old
`AnimationControlsGroup.vue` `<style>` carried:
```
.controls-pane--open .controls-pane { opacity: 0.85; transition: opacity 0.5s ease-out 2s; }
.controls-pane--hovered.controls-pane--open .controls-pane { opacity: 1; transition: opacity 0.2s ease-out; }
```
(0.75 in the original; bumped to 0.85 at `11550cd`). So the OLD behavior: the
open pane RESTED at ~0.85 opacity and lifted to 1 ONLY when hovered (with a 2s
linger before re-dimming on un-hover — the SAME 2s `usePaneHover` still tracks).
The `.controls-pane--hovered` class was the lift selector. These rules were
dropped in the later refactors (`6f5a421` and onward show `opacity: 1` rest with
no `--hovered` lift left); the W3 rewrite of the wrapper's `<style>`
(`ControlsPaneWrapper.vue:134-210`) does not re-author them.

**Reconcile the user's "10s" vs. the historical "hover + 2s linger."** The
mechanism that existed was hover-driven with a 2s linger, not a 10s
inactivity timer. The user's "~10s of no engagement → MUCH MORE TRANSPARENT" is a
STRONGER restatement (more idle delay, more transparency). The idiomatic
restoration: re-author a rest-dim rule keyed on `:not(.controls-pane--hovered)`
(or the existing `--hovered` lift), reading the `usePaneHover` state that's
already wired. To honor "10s" the `lingerMs` and/or a dedicated idle timer
governs WHEN it dims; the opacity DELTA governs how transparent. The composable
already owns the timer (`useTimeoutFn`) — the demo need only (a) re-add the CSS
opacity rule the class was meant to drive, and (b) optionally lengthen the idle
delay toward 10s and deepen the rest opacity (e.g. ~0.5–0.65 for "much more
transparent" vs. the old 0.85).

Anchors: `usePaneHover.ts:12, 25-40`; `useControlsLayout.ts:50`;
`ControlsPaneWrapper.vue:11, 16-17, 159-161, 190-193` (the `opacity:1` rest with
no `--hovered` consumer); git `11550cd` (the canonical idle-0.85 / hover-1 / 2s
recipe), `6f5a421` (where the dim was already gone).

---

## Cross-cutting gestalt (for the spec-development lane)

- **F3 + F6 + F8 are ONE move.** The user wants: calmer specular (F3), consistent-
  or-removed specular (F6), and glass-back-with-cartoon broadly (F8). The
  coherent resolution: REMOVE the tracked specular (net deletion — collapses F3 +
  F6) and recover broad glass by setting a GLASSIER tier (`quiet`/`wash`) on the
  `surface="cartoon"` panel Cards (F8). One register: glass + cartoon, calm,
  consistent. This honors KISS · DRY · no-legacy and the "one composite
  exception" can simply dissolve rather than multiply.
- **F1 + F2 are layout reconciles within landed waves** (W3 rows, W4 bezier
  panel) — both demo-local, both have a glass-ui HANDOFF flavor (F1 the
  `.labeled-field` row-layout variant; the back-into-header for F2 is pure demo).
- **F4 + F5 are dock-menu polish** (drop the emoji line / lead with the SVG mark;
  row-level dark-mode click) — both demo-local in `App.vue`.
- **F7 is a STRUCTURAL tension** between W3's load-bearing `overflow:hidden`
  (rail-collapse clip) and W2's left-casting cartoon shadow — the gate must bite
  on the LIVE bottom-left corner, not just source grep (a born-RED Playwright
  pixel/clip gate).
- **F9 restores a DEAD class** — the infra is intact (`usePaneHover` + the applied
  `.controls-pane--hovered`), only the opacity rule that consumed it is gone; a
  born-RED gate asserting "open+idle pane opacity < 1" bites today, greens on the
  re-authored rule.
- Every fix is DEMO-OWNED except the two named glass-ui HANDOFF candidates (F1's
  `.labeled-field` row layout; optionally an F8 glass+cartoon tier preset) — both
  fall under inv-16 (consumed published, sibling = HANDOFF, born-RED kf gate).
