# Lane 05 — easing (VERDICT #13, #14, #15, #16 · shots 11, 12, 13)

**Design lane.** Frontend-design skill loaded; live state captured off the dev tree
(1440×900, light + dark; evidence at `docs/tranches/T/audit/lanes/shots-05/`:
`dev-easing-closed.png` (the singular stage), `dev-easing-all.png` (the buried
"All" comparison mode — the balls preview that already exists), `dev-easing-all-dark.png`).
All font/color numbers below are `getComputedStyle` measurements from the live page,
not vibes.

**The owner's rulings for this surface (operative, not suggestions):**

- #13 — the curve-physics telemetry block: **"Remove all of this"** (shot 11)
- #14 — the curve canvas + preview ball stage: **"we should just have the easing balls previewed here"** (shot 12)
- #15 — the Gallery button: **"remove this button"** (shot 13)
- #16 — **"Most of this page looks awful and needs to be re-designed with glass-ui
  in mind. I don't like this latent red theme."** Fonts: "the sub-header hero and
  dropdowns are mostly wrong"

---

## 1. The current state, measured

### 1.1 What the scene shows today (dev-easing-closed.png)

- **Left rail**: a cartoon-quiet Card stacking (top→bottom) a ~330px hand-rolled
  curve editor (`EasingCurveCanvas`, black-filled handles with violet rings on
  chunky tape-dash control polygons), an `EasingSelect` dropdown, a **truncated**
  readout literal (`cubic-bezier(0.25, 0.10, 0.25, 1.` — the closing paren is
  clipped off a *copyable* literal), the **Gallery** button (ruling #15), a
  `duration` label over a **~90px black blob** that is supposed to be a
  full-width slider, and the **curve-physics telemetry block** (ruling #13:
  `:: double-tap: name this curve / peak velocity 2.29× (in red) / overshoot 0% /
  anticipation 0% / stays within bounds` in italic mono).
- **Right stage**: a full-height glass Card that is **~90% empty**. Contents: the
  serif title `ease` + a magenta `f(0.56) = 0.841` readout, a system-sans
  "Singular" Select, an extremely faint projected ghost curve, a **second copy of
  the same two bezier handles** (the Q.WC2 hero overlay — the same black-blob
  eyeballs at stage scale, shot 12's exact frame), and **one** magenta ball on a
  barely-visible rail at the lower right.
- **Bottom left**: the PlaybackRibbon card — pink-red progress fill, `Pause` in red.

### 1.2 The balls preview ALREADY EXISTS — buried

`dev-easing-all.png`: switching the unlabeled "Singular" Select to "All" reveals a
scrolling list of every named curve, each with its own ball sweeping its own rail —
**the classic form the owner is asking for**. It is (a) hidden behind a
`viewMode = ref("singular")` default (`EasingTarget.vue:169`), (b) visually anemic
(muted balls at 20% tint, rails at 8% tint — near-invisible in light mode),
(c) a 1-D row list with right-aligned truncating labels (`ease-in-out-…`), not a
gallery. The owner never found it, and on sight it would not have passed anyway.
The core T move is an **inversion, not an invention**: promote this mode to BE the
scene, delete the singular hero.

### 1.3 The red theme, located

`--color-progress` **is literally red**: measured `hsl(0 72% 63%)`; defined at
`demo/@/styles/style.css:388` and `:409` as `--color-progress: var(--accent-red)` —
the K.W4 S3 "motion-color authority collapsed to ONE: the RED-DASHED" ruling. The
owner's #16 verdict **reverses that K-era ruling**. On this surface the red rides
into: the PlaybackRibbon fill + red `Pause`, the telemetry `2.83×`/`2.29×` accent
(shot 11), the gallery-door glyph/hover (`EasingSidebar.vue:267-273`), and every
default `.progress-ball`/`.progress-rail` (`design-idioms.css:586-597`).

Worse, the scene runs **four accent hues simultaneously**: violet
`--ppmycota-primary hsl(248 88% 71%)` (the curve), magenta `--rainbow-violet
hsl(300 75% 60%)` (the ball + readout, via `--ball-tone`, `EasingTarget.vue:381`),
red `--color-progress hsl(0 72% 63%)` (transport/telemetry), and the warm tan
grid/borders. No single hue authority — the "latent red" is one symptom of the
scene never having committed to a palette.

### 1.4 The fonts, measured

| Surface | Claimed | Measured |
|---|---|---|
| View-mode SelectTrigger | "the governed `text-dropdown` (14px) scale" (`EasingTarget.vue:54-59` comment) | `ui-sans-serif, system-ui, …` at **16.4px** |
| Body | — | system sans at **18.608px** (an enormous UI base) |
| `--font-serif` | a serif | resolves to the **sans** stack |
| Sidebar labels, gallery door, telemetry | — | Fira Code mono as general UI text; the telemetry verdict line *italic* mono (shot 11) |
| Display title `ease` | Instrument Serif `text-display` | ✓ correct (41.9px, the one rung that lands) |

Root cause: `--font-sans` is deliberately pinned to the native system stack
(`style.css:70-78`) while **glass-ui 4.0.1 ships its own brand sans — Plus Jakarta
Sans — in `dist/fonts/`** (`fira-code/`, `plus-jakarta-sans/`; export subpaths
`./fonts/*`, `./styles/fonts`). "Re-designed with glass-ui in mind" means consuming
glass-ui's font kit and type ramp, not bridging around it. Mono-as-UI-text
(labels, buttons) is the second driver of the "fonts are not right" read — mono
belongs to *literals and digits only*.

### 1.5 glass-ui census — the unconsumed easing arm

glass-ui 4.0.1 (installed, `node_modules/@mkbabb/glass-ui`) **already ships an
easing editor**: `@mkbabb/glass-ui/easing` exports `EasingPicker` (bezier +
steps modes, draggable canvas with overshoot-clamped viewBox, touch hit-radii,
re-parseable readout + copy, a drivable `progress` ref + travel dot, footer slot)
and `EasingConfigurator`, over `useEasingPicker` (`dist/components/custom/easing/`).
Meanwhile the demo hand-rolls the same thing across
`demo/@/components/custom/easing-editor/`: `EasingCurveCanvas.vue` (499L) +
`DemoControlPoint.vue` (328L) + `EasingSelect.vue` (136L) + `EasingEditor.vue`
(119L) = **1,082L duplicating a shipped glass-ui component** — the literal #27
directive ("leverage proper, and the latest, glass-ui components… delineate our
gaps, and glass-ui's gaps").

Also relevant and unconsumed on this surface: `ToggleChip variant="cell"`
("square card that stacks an icon/preview over a label — pose pickers, palette
swatches"; selected state via `data-state="on"`), `ToggleGroup` (single-select),
`FadingScroll`, and `MOTION_CURVES` (`@mkbabb/glass-ui/motion-curves` — the
CSS↔JS curve table with kf as its own consumer).

**The honest gap** (for the BG/BH letter): `EasingPicker`'s catalogue is
bezier + steps only. The demo's catalogue (`easingGroups.ts`) includes the
bounce family — not expressible as one cubic-bezier. So the division of labor is
clean: the **gallery** (every named curve, kf/value.js-owned) is the scene's; the
**editor** (bezier/steps authoring) is `EasingPicker`'s.

### 1.6 Accretion inventory — how the scene got here

The singular stage is nine waves of additive decoration with no subtractive pass:
H.W10 G4 ("the stage is ONE ball") → J.W7a lower-third rail + projected ghost →
L.W11 gradient beam + drag-smear (**per-frame `filter: blur()` writes**,
`EasingHeroStage.vue:204-214`, + `drop-shadow` on an ~870px SVG — a
compositor-expensive combo, VERDICT #19's slice on this page) + a 620ms self-draw
boot → Q.WC2 hero handle overlay (the *third* mount of the same bezier edit
surface: sidebar canvas + hero overlay + TimingFunctionPanel) → P.W7 physics
telemetry → S.G3 gallery door. Each wave passed its gate; nobody asked whether
the stage should exist in that shape. The scene directory is 1,693L + the 1,082L
editor cluster for what is, functionally, a picker and a ball.

---

## 2. Findings

**F1 — the physics telemetry block (ruling #13).** Defect: engineer's telemetry
(peak velocity/overshoot/anticipation + an italic prose verdict + a
"name this curve" egg) as consumer chrome. Root cause: P.W7 instrument accretion.
Cure: delete `EasingCurvePhysics.vue` (234L) + its mount (`EasingSidebar.vue:124`)
+ its scoped-style remnants. No replacement — the ruling is removal.

**F2 — the Gallery door + tour (ruling #15).** Defect: a full-width button
promoting an easter-egg tour into primary chrome; red glyph. Root cause: S.G3
promoted a sealed dblclick egg to a visible button instead of asking whether the
tour earns chrome. Cure: delete the button (`EasingSidebar.vue:58-69` + styles
`:247-278`) and `useEasingGallery.ts` (69L) + the `gallery`/`galleryActive` seam in
`useEasingDemo`. The redesigned scene IS the gallery — a tour of it is moot.

**F3 — the stage inversion (ruling #14, the core).** Defect: the protagonist
surface is ~90% empty glass with one ball and duplicated handles, while the
classic balls-preview exists as a hidden view-mode. Root cause: §1.6 accretion on
top of an H.W10 premise the owner has now rejected. Cure: the specimen-drawer
gallery (§3) replaces `EasingHeroStage.vue` (390L), `useEasingGhost.ts` (44L),
`useEasingTraceSmear.ts` (57L), the view-mode Select, the beam/smear/self-draw,
and the hero handle overlay. The `registerDotPainter` seam + contract animation
in `useEasingDemo` **survive** — direct `style.transform` writes off the render
graph are exactly the right engine for a 36-ball grid (I.W4 D4 proved it).

**F4 — the red theme (ruling #16a).** Defect + root cause per §1.3: the K.W4 S3
red collapse (`style.css:388,409`) is owner-reversed; the scene has no single hue.
Cure: repoint `--color-progress` off `--accent-red` to the neutral glass accent
family (sitewide move — coordinate with the theme/fonts lane), and give the easing
scene ONE hue family: the violet the scene icon already promises
(`--ppmycota-primary` 248° — consolidate `--ball-tone` onto it; the magenta
`--rainbow-violet` ball dies). Also fix the light-mode slider: the range fill
rides light `--primary` = near-black `hsl(24 10% 10%)` (the ~90px black blob in
`dev-easing-closed.png`; dark mode paints it correctly violet because dark
`--primary` is `oklch(0.739 0.134 318.1)`) — an asymmetric token, a glass-ui-vs-demo
bridge defect to fix at the token, not the component.

**F5 — the fonts (ruling #16b).** Per §1.4: consume glass-ui's font kit (Plus
Jakarta Sans via `@mkbabb/glass-ui/fonts/*` + `./styles/fonts`) as `--font-sans`;
verify the governed rungs actually land (the Select's claimed-14px-measured-16.4px
gap is a **claim-vs-render** defect class the gate roster never caught — assert
computed styles, not source shape); demote Fira Code to literals + tabular digits
only; delete the dead `--font-serif`-resolves-to-sans token.

**F6 — the editor duplication (directive #27).** Per §1.5: three mounts of a
hand-rolled 1,082L editor cluster vs the shipped `EasingPicker`. Cure: ONE editor,
in the sidebar panel only, = glass-ui `EasingPicker` (its `progress` ref driven by
the scene sweep; its `modelValue` seeded when a bezier-expressible tile is
selected; steps mode replaces the hand-built steps/jump rows). The demo keeps only
a thin catalogue adapter (name → `TimingFunction`, already `easingGroups.ts` +
`timingFunctionsAnd`). Gaps for the glass-ui BG/BH letter: (1) named-catalogue
coverage beyond bezier presets (bounce family), (2) an
externally-driven-progress example in EasingPicker docs, (3) `ToggleChip cell`
with a live-animating preview slot.

**F7 — small honesty defects.** The truncated copyable literal
(`cubic-bezier(0.25, 0.10, 0.25, 1.` — §1.1); `EasingPicker`'s own readout
replaces it. The `Singular` Select renders system-sans (F5). The comparison-mode
labels truncate (`ease-in-out-…`) — the tile form (§3) gives names room.

---

## 3. The target design — "the specimen drawer"

**Direction.** Refined-minimal glass; a museum drawer of living type specimens —
every easing curve is a specimen you watch move. One violet accent family.
Instrument Serif for the selected curve's name (the one rung that already works);
Plus Jakarta Sans for all UI text; Fira Code strictly for CSS literals and
tabular digits. No red anywhere on the surface. Motion is the content — the
chrome is quiet.

**Layout (desktop 1440).** ONE standard glass Card stage (the surviving I5
protagonist plate), three regions:

1. **Header** (one row, wraps at phone widths):
   - Left: the selected curve's name in `text-display` Instrument Serif (~42px) —
     e.g. `ease-out-back` — with the re-parseable literal beside it in Fira Code
     14px muted + a `CopyButton` (never truncated; the full literal or none).
   - Right: the **family filter** — a glass-ui `ToggleGroup` of quiet pills
     (`All · Standard · Sine · Quad · Cubic · Expo · Circ · Back · Bounce ·
     Steps`), `text-small`, single row, horizontally scrollable inside
     `FadingScroll` below ~900px. This **replaces the view-mode Select**; there is
     no "Singular".

2. **The gallery** (the body — ruling #14 made form): a responsive grid
   (`repeat(auto-fill, minmax(150px, 1fr))`, `gap: 0.75rem`) of **easing tiles**
   inside `FadingScroll`. Each tile is a glass-ui `ToggleChip variant="cell"`
   (single-select via the surrounding `ToggleGroup`):
   - upper ~70%: the tile stage — a hairline baseline rail; a **14px violet ball**
     sweeping `x = fn(phase) · maxX`; behind it the curve's static sparkline
     (one `<path>`, stroke at 15% presence — the specimen's signature);
   - lower: the curve name, `text-mono-caption`, as-cased, centered, room to
     breathe (no truncation at the 150px floor).
   - Selected: `data-state="on"` ring + sparkline at full presence + the ball at
     hero tone. Hover: sparkline lifts to ~40%.
   - **One shared sweep clock** for every tile (the existing `demo.progress`
     contract sweep): all balls depart together, arrive per their curve — the
     comparative read that makes the classic form pedagogic. Sweep duration =
     `demo.duration`; ~350ms dwell at each end before the loop returns.
   - **Performance budget** (VERDICT #19): transforms only — zero per-frame
     `filter`/layout writes (the smear/beam die with F3); the tile painter is the
     proven `registerDotPainter` direct-write seam; tiles outside the scroll
     viewport skip painting (IntersectionObserver gating the snapshot walk);
     `content-visibility: auto` on tile rows. ~36 tiles × 1 transform write per
     frame is well inside a 60fps budget.
   - **Reduced motion**: no sweep; balls rest at the end state; the sparklines ARE
     the preview (the specimen still reads).

3. **The sidebar panel** (secondary, the editor): glass-ui **`EasingPicker`** —
   bezier mode seeded from the selected tile when bezier-expressible, steps mode
   for the steps family (its own steps/jump controls replace the hand-built
   `LabeledInput`/`LabeledSelect` rows), its readout replacing the truncated
   literal, its `progress` driven by the scene sweep so the picker's travel dot
   and the gallery balls agree — plus the `LabeledSlider` duration (full-width,
   on a *visible* glass track once F4's token lands). Nothing else: no physics
   block, no gallery door, no second curve canvas on the stage.

**Color.** One family: violet (the scene icon's promise). Ball + selected ring +
sparkline + readout accent all `--ball-tone: var(--ppmycota-primary)`-derived
(and that token deserves a sane name — `--brand-violet` — in the styles lane).
Rails/hairlines: `--border`. The magenta and the red leave the scene entirely.

**Dark theme** is the same drawing with flipped tokens (`dev-easing-all-dark.png`
already shows the geometry surviving darkness; only the hue chaos needs curing).

**Mobile 375.** Grid floor drops to `minmax(120px, 1fr)` (2–3 columns); header
stacks (serif name row, then literal + copy row); filter pills scroll under
`FadingScroll`; the sheet hosts the same EasingPicker panel.

**What dies (explicit kill list).** `EasingHeroStage.vue` (390L),
`EasingCurvePhysics.vue` (234L), `useEasingGallery.ts` (69L), `useEasingGhost.ts`
(44L), `useEasingTraceSmear.ts` (57L), the gallery-door button + styles, the
view-mode Select + `visibleCurves` row-list, the hero handle overlay, the
beam/smear/self-draw, and the `demo/@/components/custom/easing-editor/` cluster
(1,082L) in favor of `EasingPicker` + a ~80L catalogue adapter. Net ≈ **−1,900L**
while the scene gains function. New code: the tile component (~120L) + the grid
host (~150L) — both under the 500L ceiling by construction.

**Gates to re-cut** (the current roster asserts the rejected shape):
`proof-easing-stage-is-ball` (asserts the singular hero) → `proof-easing-gallery`;
`proof-easing-sidebar-normalized` / `proof-easing-curve-editor` /
`proof-bezier-single-card` / `proof-bezier-grown` / `proof-bezier-no-scroll` →
re-pointed at the EasingPicker mount. Per the meta-fact (lane 26/29), the new
gates must assert **computed rendered truth** (font-family/size on the live
Select, ball transforms sampled mid-sweep, zero red pixels) — not source shape.

---

## T recommendations

1. **T-E1 — The specimen-drawer gallery IS the easing scene** · Invert ruling #14:
   promote the buried comparison mode into a `ToggleGroup`/`ToggleChip cell` tile
   grid (each named curve = sparkline + ball sweeping `fn(phase)·maxX` on the one
   shared clock), family-filter pills replace the "Singular" Select, the singular
   hero stage + ghost/beam/smear/self-draw + hero handles die
   (`EasingHeroStage.vue` 390L, `useEasingGhost` 44L, `useEasingTraceSmear` 57L);
   painter seam + IntersectionObserver gating; PRM = static sparklines ·
   **Gate**: browser probe — ≥30 tiles rendered; two sampled tiles' ball
   `translateX` at phase 0.5 equals `fn(0.5)·maxX` ±1px; zero per-frame
   `filter`/layout writes in a 2s trace; a tile click updates the header name +
   literal; frame budget ≤4ms scripting median on the reference machine · **L**

2. **T-E2 — Execute the removals (rulings #13 + #15)** · Delete
   `EasingCurvePhysics.vue` (234L) + its `EasingSidebar.vue:124` mount;
   delete the gallery-door button (`EasingSidebar.vue:58-69`, styles `:247-278`)
   + `useEasingGallery.ts` (69L) + the `gallery`/`galleryActive` demo seam ·
   **Gate**: static — zero references to `curve-physics|gallery-door|galleryActive|
   useEasingGallery` under `demo/`; browser probe — no element matching
   `[data-gesture-tell="easing:gallery"]`, no text node matching
   `/peak velocity|overshoot|anticipation/` on the easing route · **S**

3. **T-E3 — ONE editor: glass-ui `EasingPicker` replaces the demo easing-editor
   cluster** · Mount `EasingPicker` (from `@mkbabb/glass-ui/easing`) as the sole
   edit surface (sidebar panel), `progress` driven by the scene sweep, seeded from
   tile selection; delete `demo/@/components/custom/easing-editor/` (1,082L:
   EasingCurveCanvas 499 + DemoControlPoint 328 + EasingSelect 136 + EasingEditor
   119) and the hand-built steps/jump rows; keep a thin name→fn catalogue adapter;
   write the BG/BH gap letter (bounce-family catalogue, external-progress-drive
   docs, ToggleChip live-preview slot) · **Gate**: static — the easing-editor dir
   is gone and `EasingPicker` is imported exactly once under `demo/scenes/easing/`;
   browser probe — dragging a picker handle re-times a sampled gallery ball within
   one frame; the readout literal is complete + re-parseable
   (`new Function`-free parse via value.js round-trip) · **M**

4. **T-E4 — De-red the motion tokens + one violet hue authority** · Repoint
   `--color-progress` off `--accent-red` (`style.css:388,409` — the K.W4 S3
   collapse, owner-reversed) to the neutral accent; collapse the easing scene to
   ONE violet family (`--ball-tone` ← the brand violet; the magenta
   `--rainbow-violet` ball + red telemetry/ribbon accents die); fix the light-mode
   slider fill riding near-black light `--primary` (the black-blob track) —
   coordinate the sitewide half with the theme lane, own the easing-scene
   assertions here · **Gate**: browser probe — a rendered-pixel sweep of the
   easing route (light + dark) finds zero pixels within ΔE<10 of
   `hsl(0 72% 63%)`/`hsl(5 55% 50%)`; the duration slider's track spans ≥90% of
   the panel inner width with a fill whose hue ∈ [240°,320°] · **S** (easing
   scope) / M with the sitewide half

5. **T-E5 — Type honesty: glass-ui's font kit + rendered-rung assertions** ·
   Consume Plus Jakarta Sans from `@mkbabb/glass-ui/fonts` as `--font-sans`
   (killing the deliberate system-stack pin, `style.css:70-78`); delete the
   sans-resolving `--font-serif`; demote Fira Code to literals/digits (labels and
   buttons go sans); verify the governed rungs LAND (the Select's
   claimed-14px/measured-16.4px gap) — sitewide coordination with the fonts lane,
   easing-scoped assertions here · **Gate**: browser probe on the easing route —
   `getComputedStyle` of the filter pills + panel labels reports the Jakarta
   family; the curve-name display reports Instrument Serif; no element outside
   literal/digit surfaces reports Fira Code; the (former) dropdown surface
   measures its governed rung ±0.5px · **M**
