# H.W10 — Research Lane R2: Git Archaeology (G1-G8)

**Lane:** R2 — git archaeology (read-only). The "previous correct" forms + when/why
they were replaced, so H.W10 can RECOVER them idiomatically rather than re-invent.
**Method:** `git log/show` over the killed assets + the easing scene lineage; PNG icons
read visually (extracted to disk + viewed). All quotes are `commit:path` exact.
**Mirrors** the H.W9 `r2-git-archaeology.md` precedent (the same "find the OLD correct
form, name where a wave over-corrected" discipline; this is the chronic-closure catch
of a re-paper — W5 monochrome over-corrected the icons — BEFORE the H.W8 golden lock).

---

## (a) G1 — the PREVIOUS expressive/colorful icons (the headline find)

### What landed: TWO generations of icon assets, both KILLED by W5

**Generation 1 — the COLORFUL Playwright-screenshot PNGs (`74abd2b`, 2026-03-15).**
Commit `74abd2bed4942b975840b641c12e1d29c3464542` — "feat(demo): add scene icons …":

> - Capture Playwright screenshots of cube (3-face angle, vivid colors), amiga
>   (checkerboard ball, isolated), square (rotated heyyyy)
> - All icons 256×256 (lg) + 32×32 (sm) with transparent backgrounds
> - Update favicon to cube-icon-sm.png

Six PNGs landed: `cube-icon-{lg,sm}.png`, `amiga-icon-{lg,sm}.png`,
`square-icon-{lg,sm}.png` (under `assets/icons/`). These are LITERAL RENDERS of the
running scenes — the most dogfooded icon form possible (the icon IS the scene's own
pixels). **Visual style** (extracted from `db90cbb^` and viewed):

| Icon | Visual style (the "expressive, colorful" the user wants BACK) |
|------|--------------------------------------------------------------|
| **cube-icon-lg.png** (9432 B) | A 3D cube in 3/4 view: TOP face vivid **magenta/fuchsia** (`#FF2DD…`), LEFT face saturated **yellow**, RIGHT/front face saturated **red** — three flat high-chroma faces meeting at the top vertex, hard edges, a touch of edge shading. Pure primary-adjacent palette, isometric, reads instantly as "3D cube." |
| **amiga-icon-lg.png** (31261 B) | The Amiga boing-ball: a sphere wrapped in a **red-and-white checkerboard**, soft spherical shading (lighter top-left, darker lower-right), isolated on transparent. The iconic demoscene ball — red `#CC0000`-ish + off-white squares, ~8×8 lat/long checker. |
| **square-icon-lg.png** (18935 B) | A rounded square tilted ~15°, filled **periwinkle/violet** (`#7C6FE0`-ish), with white "heyyyy" text centered. Flat single-fill with a generous corner radius — soft, friendly, one bold color. |

The PNGs were the favicon source too (`74abd2b` re-pointed the favicon to
`cube-icon-sm.png`).

**Generation 2 — the original easing SVG, ALSO colorful (`f1d4fe6`, 2026-04-04).**
When the easing scene landed, it shipped ONE vector icon — `easing-icon-sm.svg` — and
it was COLORFUL (a baked purple). `git show db90cbb^:assets/icons/easing-icon-sm.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
  <path d="M4 28C4 28 4 4 16 4C28 4 28 28 28 28" stroke="hsl(248, 88%, 71%)" stroke-width="3" stroke-linecap="round"/>
  <circle cx="4" cy="28" r="2.5" fill="hsl(248, 88%, 71%)" opacity="0.4"/>
  <circle cx="28" cy="28" r="2.5" fill="hsl(248, 88%, 71%)" opacity="0.4"/>
</svg>
```

The form: an ease curve (a single bezier-ish arc) with two faint endpoint dots, stroked
in **`hsl(248, 88%, 71%)`** — a vivid violet/indigo, the SAME family hue as the periwinkle
square. So BEFORE W5 the icon language was: **scene-true photography (PNG) where it
existed, colorful vector (the violet curve) where it didn't.** The unifying read was
**expressive + colorful**, not a monochrome line set.

### When + why W5 replaced them with monochrome

`db90cbb` (W5, 2026-06-07) — "feat(tranche-H W5): scene icons + Discrete→Spring merge …":

> S1/S2 — the icon registry moved onto SceneDescriptor.icon as an inline-`<svg>`
> currentColor family (vite-svg-loader ?component + the env.d.ts ambient decl + SVGO
> convertColors:false/removeViewBox:false); ChromeDock renders `<component :is="scene.icon"/>`
> (the sceneIcons map + `<img>` sites deleted); **the 6 PNGs killed** + index.html favicon
> re-pointed to favicon.svg (BLK-7, rel=icon serves 200, no 404).

The W5 driver was a REAL defect (D8): the OLD registry was a dock-keyed
`Record<string,string>` of imported image URLs covering only 4 of 9 scenes, rendered via
`<img :src>` — **theme-blind by construction** (an `<img>` paints SVG as a separate
document that cannot read host `currentColor`). W5 correctly fixed the SUBSTRATE
(per-descriptor inline-`<svg>`, full coverage, themable) — but in doing so it threw out
the COLOR with the bathwater: it made every icon monochrome `stroke="currentColor"`.

W5 itself flagged this as superseded — `db90cbb` commit body:

> NOTE: the inline-SVG icon STYLE (monochrome currentColor) is superseded by H.W10
> (the user's G1 feedback — the expressive/colorful icons were correct); the
> SceneDescriptor.icon family + vite-svg-loader infrastructure this wave built is the
> substrate H.W10 refines.

### The W5 monochrome family (today, `assets/icons/*.svg`) — what to RE-COLOR

All 7 are `viewBox="0 0 32 32" fill="none" stroke="currentColor"` line glyphs:

- **cube.svg** — a hexagon-outline cube with the 3-edge interior fork (the iso-cube line
  drawing). Good FORM to keep; recolor 3 faces (magenta top / yellow left / red right).
- **amiga.svg** — a circle + ellipse + two filled `currentColor` quadrant arcs (the
  checker hint). Recolor → the red/white checker sphere.
- **square.svg** — a single rounded `rect` rotated 15°. Recolor → periwinkle fill.
- **easing.svg** — the SAME arc + endpoint-dot form as the killed `easing-icon-sm.svg`,
  but `stroke="currentColor"` (W5 literally re-drew the violet glyph as monochrome).
  Recolor → restore `hsl(248, 88%, 71%)` (or the design-token violet).
- **spring.svg** — a damped-oscillation curve + dashed rest line + endpoint dot.
- **sequence.svg** — four ascending bars + a baseline (a staggered-step glyph).
- **motion-path.svg** — the ACTUAL `PATH_D` from `motionPathGeometry.ts:17` scaled into
  the glyph + a traveller dot (the most DRY icon — one geometry source). Keep the DRY
  trick; recolor the path + dot.

### THE INFRA IS ALREADY COLOR-READY — no substrate change needed (KISS/inv-16)

`vite.config.ts:190-205` configures `vite-svg-loader` with SVGO `convertColors: false` +
`removeViewBox: false`:

```ts
const svgLoaderPlugin = svgLoader({
    defaultImport: "component",
    svgoConfig: { plugins: [{ name: "preset-default", params: { overrides: {
        convertColors: false,   // never rewrite `currentColor`/`fill="none"`.
        removeViewBox:  false,  // keep the `viewBox` so the glyph scales.
    }}}]},
});
```

`convertColors: false` means SVGO will **faithfully preserve any baked hue** in the
source SVG — it will NOT collapse `hsl(...)`/`#hex`/`fill` into anything. So a colorful
SVG drops straight through the `?component` seam to an inline `<svg>` with its colors
intact, scalable, themable-where-it-uses-currentColor. **H.W10 G1 = swap the icon ASSETS
(re-color the 7 + add any new primitives) + revise the gate. ZERO infra change** — the
`SceneDescriptor.icon` family (`scenes.ts:8-14,88-141`), the `?component` import, the
`ChromeDock.vue:195 <component :is="scene.icon">` render, and the SVGO flags all carry
colorful SVGs unchanged.

**Coverage note (G1 "all primitives"):** the 7 mapped scenes today are
cube/amiga/square/easing/spring/sequence/motion-path (`scenes.ts:88-141`). The user names
"cube/amiga/square/easing/spring/sequence/motion-path" — that is the EXACT current set
(no NEW scene to ink). The `home` descriptor alone has no icon (falls back to `<Home>`).

---

## (b) G3/G6 — was the easing scene EVER on the standard controls component?

**NO. The easing scene has been BESPOKE since inception.** It never used
`AnimationControlsGroup` / the standard `controls/*` ribbon — it forked its own
`EasingSidebar` + `EasingTarget` from day one.

`f1d4fe6` (2026-04-04) — "feat(demo): add interactive easing function demo scene" —
created the WHOLE bespoke pair in one commit (1028 insertions):

```
demo/easing/EasingSidebar.vue   | 177 +++
demo/easing/EasingTarget.vue    | 382 +++
demo/easing/easingGroups.ts     | 125 +++
demo/easing/useEasingDemo.ts    | 333 +++
```

The original `EasingSidebar.vue` (`f1d4fe6:demo/easing/EasingSidebar.vue`) opens with a
hand-rolled `<div class="glass-card p-3 grid gap-3">` holding a hero `EasingCurveCanvas`,
a CSS-value `Card`, an `EasingSelect`, step inputs, and a duration slider — **none of the
standard `AnimationControlsControls` / `PlaybackRibbon` plumbing.** It was bespoke markup
against the easing demo's own `useEasingDemo` composable.

The scene WRAPPER, `EasingScene.vue`, was introduced at W1 (`256f6fe`) and is bespoke too
— it builds the playback buttons by hand in a render function (`ribbonContent`), NOT via
the standard `PlaybackRibbon`. Today's `EasingScene.vue:60-101`:

```js
const ribbonContent = (slotProps) =>
  slotProps.selectedControl === "easing"
    ? h("div", { class: "grid grid-cols-2 gap-2 w-full" }, [
        h(Button, { variant: "outline",
            class: "btn-playback btn-playback-accent",     // ← Pause: the standard accent class
            onClick: () => demo.togglePlay() }, { ... "Pause"/"Play" ... }),
        h(Button, { variant: "outline",
            class: "h-8 w-full rounded-full gap-2 text-body btn-interactive",  // ← Reset: a DIFFERENT class
            onClick: () => demo.reset() }, { ... "Reset" ... }),
      ])
    : null;
```

### The G3/G7 root cause — a PARTIAL copy that drifted

This bespoke ribbon **half-copied** the standard `PlaybackRibbon.vue`. Compare
`demo/@/components/custom/animation-controls/controls/PlaybackRibbon.vue:23-50` (the
NORMALIZATION TARGET):

```html
<div class="grid grid-cols-2 gap-2 w-full">
  <Button class="btn-playback btn-playback-accent" variant="outline" @click="emit('togglePlay')">
    <span>{{ isAnimPlaying ? 'Pause' : 'Play' }}</span>
    <Pause v-if="isAnimPlaying" class="icon-md" /> <Play v-else class="icon-md pl-px" />
  </Button>
  <Button :class="['h-8 w-full rounded-full gap-2 text-body btn-interactive',
                   'aria-pressed:bg-primary/10 aria-pressed:border-primary/40']"
          :aria-pressed="userReversed" variant="outline" @click="emit('toggleReverse')">
    <span>Reverse</span> <ArrowLeftRight class="icon-lg …" />
  </Button>
</div>
```

So: the easing scene's **first button (Pause) uses the standard `btn-playback
btn-playback-accent` class** — that one DOES match. But the **second button (Reset) uses
`h-8 w-full rounded-full gap-2 text-body btn-interactive`** which is the standard's
SECONDARY button class (the one the standard applies to *Reverse*). The mismatch the user
sees is real and structural:

1. **G3 (buttons don't match + don't reuse the component):** the easing ribbon is a
   hand-built `h(...)` render-fn that DUPLICATES the standard `grid grid-cols-2` ribbon
   shape instead of mounting `PlaybackRibbon`. The standard ribbon offers
   **Pause + Reverse**; the easing fork swaps in **Reset** with no Reverse — a different
   button SET and a different second-button class.
2. **G7 (unequal width/height):** the two `h(Button)` children carry DIFFERENT class
   strings, so they do not inherit identical box metrics. The first (`btn-playback
   btn-playback-accent`) and the second (`h-8 w-full rounded-full …`) only coincidentally
   share width via the `grid-cols-2`; their heights/paddings come from divergent classes.
   The standard ribbon's two buttons ALSO use two different class strings but were
   co-designed to match metrics; the fork copied one and improvised the other.

**The fix lineage:** there is a SHARED button skin already —
`controls/playback-button.css` (the `.btn-playback*` global rules, imported at
`PlaybackRibbon.vue` top: "the .btn-playback* classes land on reka-ui's `<Button>` DOM
shared across this ribbon and the scene play buttons"). So the *button skin* is already a
shared primitive; the easing scene just didn't mount the standard *component* that
composes it. G3/G6 = mount `PlaybackRibbon` (or the standard `AnimationControlsControls`
sidebar) in the easing scene, deleting the bespoke `ribbonContent`/`EasingSidebar`
duplication — REUSE, not re-skin.

### G6/G5 — the easing sidebar nesting + size lineage

`EasingSidebar.vue` (and its `EasingScene.vue` sibling, the duplicative second editor)
carries excess nesting: `glass-resting cartoon-surface p-3 grid gap-3` wrapping a hero
canvas + a `Card surface="cartoon"` (CSS-value) + `EasingSelect` + a `Card
surface="cartoon"` (steps) + a duration row. Each `Card` is its own inner container. The
standard `AnimationControlsControls.vue` is the FLATTER, LARGER-control reference. Note
H.W9 S3 (`82c37c8`) ALSO touches the row shape (label-LEFT/value-RIGHT, ONE column) — so
G6's flatten MUST compose with H.W9's row idiom, not re-fork it. G5's "controls too
small" is the same root: the bespoke sidebar uses `size="sm"` sliders + `text-mono-caption`
inputs (`EasingSidebar.vue:82,49,92`), whereas the standard controls use the larger
default control rung. Normalizing onto the standard component resolves G5 + G6 together.

**Note — TWO easing editors exist (the duplication the user feels):** the sidebar canvas
lives in `EasingScene.vue:9` (the `EasingSidebar`-equivalent tab content) AND the stage
re-draws the same curve in `EasingTarget.vue:46-59` (singular mode). See (c)/G4.

---

## (c) G4 — the "Singular" view-mode: what view modes exist, when added, what each shows

`git log -S 'Singular'` traces it to `f1d4fe6` (the original easing scene) — the view-mode
dropdown was born with the bespoke `EasingTarget`. The modes today
(`EasingTarget.vue:145-153, 202-223`):

```js
// "singular" = just the selected curve (scrubber), family names = comparison, "all" = everything
const viewMode = ref("singular");
```

| Mode | What it shows (`EasingTarget.vue`) |
|------|------------------------------------|
| **`singular`** (default) | The SELECTED curve only. If bezier-editable: a SECOND copy of `EasingCurveCanvas` promoted to stage (`:46-59`) — **the same curve the sidebar already draws**. If named/steps: a bare `Slider` scrubber (`:63-80`). |
| family name (e.g. `quad`, `back`, `elastic`) | A scrollable list of comparison TRACKS — one ball per curve in that family riding a `.progress-rail` (`:83-119`). |
| **`all`** | Every curve across all families as comparison tracks (`:205-213`). |

### The G4 defect, ALREADY root-caused in the prior audit

`docs/tranches/H/audit/a-scene-square-easing.md:236-252` (the W5-era scene audit) caught
this BEFORE the user did:

> Live: `.easing-target` (the RIGHT column, `EasingTarget.vue:4`) = **704 × 953 px**
> (overflows the 900 px viewport), and in **singular** view-mode its only content is the
> `.t-scrubber` Slider — measured **638 × 6 px**, a hairline. … That is a huge dead pane
> for a 6 px control.
>
> **Root cause:** `EasingTarget.vue:39-56` — singular mode is *just* a centered `Slider`
> in a `flex-1` card. … The interesting content (the traveling dot, the comparison
> tracks) only appears in non-singular view modes.

And the prescribed gestalt fix (option b) is EXACTLY the user's G4:

> (b) make the singular pane carry a real animated subject (a box eased by the selected
> curve — dogfooding) instead of a bare 6 px slider. … This also feeds D11
> interactivity: drag the dot ON the curve.

So G4 ("Singular should NOT be a duplicated bezier view — it should be ONE large ball") is
the SAME finding the W5 audit already reached: the singular stage is either (i) a
duplicate curve (bezier-editable case, `:46-59`) or (ii) a near-empty hairline scrubber
(named case, `:63-80`). Both are wrong. **G4 = the singular stage becomes ONE large
animated ball traversing under the selected easing** — the dogfood (inv ζ): the engine's
`AnimationVisualizer.vue`
(`demo/@/components/custom/animation-controls/controls/AnimationVisualizer.vue`, exists) /
`NumericAnimation` driving a ball's position by `f(progress)`. This shows the curve in
MOTION (the demonstration), and de-duplicates: the curve EDITOR stays in the
sidebar/controls; the STAGE shows the result. (Reconcile with H.W9 F2, which fits the
bezier PANEL — that is a distinct surface; G4 changes the STAGE.)

### W5 touched EasingTarget but did NOT fix this

`db90cbb` modified `demo/easing/EasingTarget.vue` (+42 lines) — S4 "the easing curve
promoted to stage (the :bezier-points/@update:bezierPoints two-way wire)". That promotion
is precisely the `:46-59` duplicate-curve-on-stage the user now calls "useless and
duplicative." W5 made the stage show the curve; G4 says the stage should show the BALL.

---

## (d) G8 — any prior full-bleed / card-bg-less easing stage in history?

**NO prior full-bleed easing form exists.** The easing STAGE has been a bordered glass
CARD since inception:

- `f1d4fe6:demo/easing/EasingTarget.vue:4` (the ORIGINAL): `<div class="glass-card w-full
  flex-1 min-h-0 flex flex-col overflow-hidden">` — a `glass-card` plate from day one.
- `1ec7773` (W2) flipped the surface class but KEPT the card:
  `git show 1ec7773` diff —
  `- <div … class="glass-card easing-target …">` → `+ <div … class="glass-resting
  cartoon-surface easing-target …">`. Same card, new surface tokens.
- Today (`EasingTarget.vue:4`): `glass-resting cartoon-surface easing-target w-full
  flex-1 min-h-0 flex flex-col overflow-hidden`. Still a card.

So G8 has **no "previous correct" full-bleed form to restore** — the user's G8 is a
FORWARD design call, and the precedent to follow is the SIBLING scenes, which ARE
full-bleed:

- **AmigaScene.vue:1-11** — `<div class="scene-root relative h-full w-full"><canvas
  class="amiga-canvas h-full w-full rounded-lg">` — NO card bg; the canvas fills the
  `.stage-cell` grid track directly (just a `rounded-lg` corner on the canvas itself).
- The cube scene is likewise a full-bleed subject in the stage cell.

### The layout primitive (G8's "proper LAYOUT-LEVEL primitive")

The clip the user sees is structural. The rail·stage·rail grid
(`AnimationControlsGroup.vue:360-390`) gives the subject its OWN `[stage]` column/row:

```css
@media (min-width: 1024px) {
  .controls-layout {
    grid-template-columns: [rail] var(--rail-track) [stage] 1fr;
    grid-template-rows: [top] auto [stage] 1fr [bottom] auto;
  }
  .stage-cell { grid-column: stage; grid-row: stage; }
}
```

The `[stage]` row is the `1fr` BETWEEN the `[top]` auto (hero/dock) and `[bottom]` auto
(timeline + menubar reserve). The `.controls-layout` height is bounded to the work-area:

```css
/* AnimationControlsGroup.vue:335-341 */
.controls-layout {
  width:  min(100dvw, var(--work-area-max-width, 100dvw));
  height: min(100dvh, var(--work-area-max-height, 100dvh));
}
```

And the dock-band reserves are derived tokens, NOT magic numbers
(`style.css:95-130`):

```css
--work-area-vertical-slack: max(calc(100dvh - var(--work-area-height)), 0px);
--work-area-top-offset:    calc(var(--work-area-vertical-slack) * var(--work-area-vertical-bias-top));    /* 0.42 */
--work-area-bottom-offset: calc(var(--work-area-vertical-slack) * var(--work-area-vertical-bias-bottom)); /* 0.58 */
--dock-band-reserve: calc( /* cycle-free dock + safe-area band */ … );
```

**Why amiga/cube DON'T clip and easing DOES:** the sibling scenes mount their subject
DIRECTLY into `.stage-cell` (`scene-root h-full w-full` → fills the bounded `[stage]`
track). The easing scene instead wraps its content in an EXTRA layer —
`EasingTarget.vue:2`:

```html
<div class="flex flex-col … h-full w-full px-6 lg:px-8 max-w-3xl mx-auto overflow-hidden dock-inset">
  <div ref="easingTargetEl" class="glass-resting cartoon-surface easing-target w-full flex-1 min-h-0 …">
```

The `.easing-target` CARD sits inside a `max-w-3xl mx-auto … dock-inset` wrapper, and the
card's intrinsic content (the §2.3 audit measured it at **704 × 953 px**, overflowing the
900 px viewport) exceeds the bounded stage track, so the card's bottom edge runs UNDER the
bottom dock. The `.dock-inset` class (`design-idioms.css:498-500`,
`padding-bottom: var(--dock-band-reserve)`) was MEANT to clear the dock band but was
applied to the OUTER wrapper while the card itself is `flex-1` and overflows.

The prior audit `a-scene-square-easing.md:255-268` (§2.4) already flagged the conflict:

> The `dock-inset` + `max-w-3xl` clamp fights the full-width sibling layout (LOW) …
> Combined with the viewport-filling sizing the constraints partially cancel — the card
> is centered-and-clamped yet still overflows vertically.

**G8 resolution paths (both idiomatic, no magic numbers):**
1. **Drop the card bg → full-bleed like cube/amiga** (the user's preferred lean). The
   easing stage becomes a bare subject in `.stage-cell` — the same `h-full w-full` form
   the siblings use. This composes naturally with G4 (the ONE large ball as the
   full-bleed subject) and G6 (the controls move to the standard sidebar, so the stage
   no longer needs to BE a panel). The `dock-inset`/`max-w-3xl`/extra-wrapper layers
   delete.
2. **OR contain the card between the docks at the layout primitive** — ensure the
   `.stage-cell` content respects the `[stage]` track's bounded height
   (`min-h-0` + the work-area offsets) so the card can never exceed the inter-dock band.
   This is the `proof:stage-not-clipped` lineage (cited in `AnimationControlsGroup.vue:45-52`
   — "the B.W3 'cube half-clipped' invariant is the proof:stage-not-clipped gate's
   subject").

Path (1) is the KISS gestalt answer (matches the sibling primitive, dissolves the bespoke
card, composes with G4/G6) and introduces zero hardcoded numbers — the `[stage]` track +
work-area offsets ALREADY do the containment for the siblings.

---

## Summary table — the "previous form" + the H.W10 move per item

| Item | Previous correct form (commit:path) | When/why killed | H.W10 recovery |
|------|-------------------------------------|-----------------|----------------|
| **G1** | Colorful PNGs (`74abd2b`: magenta/yellow/red cube · red-white checker amiga · violet square) + violet easing SVG `hsl(248,88%,71%)` (`db90cbb^:easing-icon-sm.svg`) | `db90cbb` W5 → monochrome `currentColor` (D8 theme-blind `<img>` fix over-corrected) | Re-color the 7 W5 SVGs (keep their forms, add the palette) — infra is color-ready (`vite.config.ts:198` `convertColors:false`); REVISE `proof:scene-icons` G1+G4 clauses (they forbid color today) |
| **G2** | n/a (forward fix) | — | Root-cause the un-rounded card (a Card missing the rounded surface variant — see R1 lane) |
| **G3** | Standard `PlaybackRibbon.vue:23-50` (`grid grid-cols-2`, shared `.btn-playback*` skin) | NEVER used — easing bespoke since `f1d4fe6`; `EasingScene.vue:60-101` hand-built `ribbonContent` half-copied it | Mount the standard `PlaybackRibbon`/controls; delete the `h(...)` fork |
| **G4** | n/a — singular ALWAYS showed curve/scrubber, never a ball | Born wrong (`f1d4fe6`); W5 `db90cbb` promoted the DUPLICATE curve to stage | The audit's option-b: ONE large dogfooded ball (`AnimationVisualizer`/`NumericAnimation`, inv ζ) under the selected easing |
| **G5** | Standard controls' default control rung | Bespoke `EasingSidebar` used `size="sm"` + `text-mono-caption` (`f1d4fe6`) | Normalize onto the standard sidebar → larger controls |
| **G6** | Standard `AnimationControlsControls.vue` (flat) + `AssetPropertiesPanel.vue:6` row idiom (per H.W9 r2) | Bespoke nested `Card`-in-`Card` since `f1d4fe6` | Flatten + reuse the standard sidebar (compose with H.W9 S3 row shape) |
| **G7** | Standard ribbon's co-designed two-button metrics | Fork copied button #1's class, improvised #2 (`EasingScene.vue:80-94`) | Equal width/height via the standard ribbon (G3 fixes it) |
| **G8** | NO prior full-bleed easing form — the SIBLING `AmigaScene.vue:1-11` full-bleed `scene-root h-full w-full` is the precedent | Easing was a `glass-card` from `f1d4fe6`, surface-flipped at `1ec7773`, never full-bleed | Drop the card bg → full-bleed subject in `.stage-cell` (or contain at the `[stage]` track); work-area offsets already do it for siblings, zero magic numbers |

**Cross-wave reconcile (H.W9 ↔ H.W10):** H.W9 (`82c37c8`, F1-F9) already addresses the
controls ROW shape (F1 — label-left/value-right, ONE column, via `AssetPropertiesPanel.vue:6`)
and the bezier PANEL fit (F2). H.W10's G6 normalization MUST land on the SAME standard
component H.W9 tunes (not a third fork); H.W10's G4 changes the easing STAGE to a ball
(distinct surface from H.W9 F2's bezier panel). The icon palette (G1) reverses W5's
monochrome but leaves the W5 `SceneDescriptor.icon` + `vite-svg-loader` substrate intact.
