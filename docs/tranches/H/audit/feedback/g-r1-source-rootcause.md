# G-R1 — Source Root-Cause (G1–G8)

Lane **R1** (SPEC-DEVELOPMENT triumvirate #2) · read-only source root-cause of
the user's eight feedback items **G1–G8**, observed LIVE on the `tranche-h-impl`
demo AFTER W5 landed (the monochrome scene icons + the easing scene with its
bespoke sidebar + a duplicative center stage). Every finding is anchored to a
`file:line` in the CURRENT committed source (HEAD `db90cbb` — "tranche-H W5";
the H.W9 spec `82c37c8` is authored-but-NOT-implemented, so all anchors are the
*landed* state). NO build run, NO source edited. Anchors are the demo `@/`, the
`app/` entry/scenes, the easing/spring scenes, the repo-root `assets/icons/`, and
the consumed `@mkbabb/glass-ui` dist (inv-16 — the demo CONSUMES; a glass-ui
anchor marks where a HANDOFF would land, not a demo patch).

**The through-line (the gestalt verdict, up front).** G2/G3/G4/G5/G6/G7/G8 are
ONE root cause wearing six faces: **the easing scene (and the new stage-card
scenes generally — spring) DIVERGED from the standard cube/amiga controls
component + the rail·stage·rail layout.** The easing scene forks the entire
standard sidebar chain (`ControlsPaneWrapper → AnimationControls →
AnimationControlsControls + RibbonBar`), hand-rolls a bespoke
`EasingSidebar`/`EasingTarget`, hand-rolls a bespoke `ribbonContent`, wraps its
stage subject in a bare-class `glass-resting cartoon-surface` `<div>` (which —
unlike a glass-ui `<Card>` — carries NO `rounded-card`, the literal G2/G4
square-corner defect), and offsets that stage with a `dock-inset` that pads only
the BOTTOM band (the G8 top-clip). **NORMALIZATION onto the standard component +
a real stage-containment layout primitive is the gestalt fix.** G1 is a SEPARATE
axis (a W5 course-correction: recover the killed colorful icons as vector).

---

## Summary verdict

| # | Item | Root cause one-liner | Fix locus |
|---|------|----------------------|-----------|
| **G1** | icons watered down | W5.S2 replaced the killed *expressive/colorful* PNG/SVG icons with **monochrome `currentColor`-stroke** SVGs (`assets/icons/*.svg`); `proof:scene-icons` G1-SHAPE + G4-THEMING **ENFORCE** `fill="none"` + `stroke="currentColor"` + ZERO baked hue — the OPPOSITE of colorful | swap the icon ASSETS to colorful vectors (reuse the `SceneDescriptor.icon` + `?component` substrate); REVISE `proof:scene-icons` shape+theming clauses |
| **G2** | a card is not rounded | `cartoon-surface` (glass-ui `@utility`) carries border/shadow/lift **but NO `border-radius`** (`cards.css:33-48`); radius lives on the `<Card>` root's `rounded-card` (`CardFooter-…js:37`). The bare-class `<div class="glass-resting cartoon-surface">` surfaces miss it | round the bare-class stages (drop them onto `<Card>` / the stage primitive) |
| **G3** | playback buttons bespoke + mismatched | easing's `ribbonContent` (`EasingScene.vue:56-90`) hand-rolls `Pause`/`Reset` `<Button>`s **instead of** the standard `PlaybackRibbon` (`PlaybackRibbon.vue` — `Play`/`Pause` + `Reverse` + the `AnimationVisualizer` ball); spring forks too (`SpringScene.vue` ribbon) | REUSE `PlaybackRibbon` / the standard ribbon chain |
| **G4** | "Singular" duplicates the curve | `EasingTarget.vue:15-35` view-mode `<Select>` defaults `"singular"`, which renders a **second `EasingCurveCanvas`** (`:46-59`) the sidebar already shows (`EasingSidebar.vue:9-16`). Stage should host the `AnimationVisualizer`-style ball under the easing. AND the stage card (`EasingTarget.vue:4`) is the bare-class square-corner surface (the G2 twin) | stage = ONE big ball (dogfood inv ζ); delete the duplicate-curve view; round the stage |
| **G5** | sidebar controls too small | `EasingSidebar.vue` uses `text-admin-label`/`text-mono-caption` + `size="sm"` sliders + `p-2`/`gap-1` — a TIGHTER rung than the standard `AnimationControlsControls` (`text-mono-small` labels, `px-4 py-3`, `gap-2`) | normalize sizing onto the standard sidebar rung |
| **G6** | too many inner containers | `EasingSidebar.vue` nests root `.easing-editor` div → ×3 `<Card>/<CardContent>` + ad-hoc `<div class="grid gap-1">` rows — depth/forks the flat standard `Card>CardContent>panel-stack>panel-row>panel-content` | FLATTEN + REUSE the standard sidebar component |
| **G7** | pause/reset unequal size | easing ribbon's two `<Button>`s carry DIFFERENT class strings (`EasingScene.vue:63` vs `:79`) — only the standard ribbon's `grid-cols-2` + shared `btn-playback` skin guarantees equal w/h | equal-size via the standard ribbon idiom (`playback-button.css`) |
| **G8** | easing area clips into the docks | `dock-inset` reserves **bottom only** (`design-idioms.css:498-500`, `padding-bottom: var(--dock-band-reserve)`); the `[stage]` row track is `[top] auto [stage] 1fr` (`AnimationControlsGroup.vue:364`) with **no top/bottom dock inset**; the `flex-1` stretch card fills `[stage]` and its top edge slides under the affixed top ChromeDock | a LAYOUT PRIMITIVE: a symmetric `--dock-band-reserve` stage inset (top+bottom), OR drop the stage card bg → full-bleed like cube/amiga |

---

## The STANDARD component (what G3/G6 say to reuse) — and how easing diverges

This is the spine of G2/G3/G4/G5/G6/G7, so it is established once, here.

### The standard controls component chain (cube/amiga)

`AnimationControlsGroup.vue` is the ONE controls host. Its layout (`:335-390`):
the `rail·stage·rail` grid — `[rail] var(--rail-track) [stage] 1fr` /
`[top] auto [stage] 1fr [bottom] auto` (`:363-364`). It composes:

- **`ControlsPaneWrapper.vue`** (the `[rail]` track) → for each animation:
  - **`AnimationControls.vue`** — the `Controls | Keyframes | Timeline` tab panel.
    - **`AnimationControlsControls.vue:3`** — the controls Card:
      `<Card surface="cartoon" class="w-full overflow-visible">` (ROUNDED, via
      the Card root's `rounded-card`), `<CardContent class="… px-4 py-3">`
      (`:4`), a `.panel-stack` → `.panel-row` → `.panel-content flex flex-col
      gap-2` (`:6,8,9`) of `LabeledInput`/`LabeledSelect` rows (`:10-65`).
    - It **teleports** the standard **`PlaybackRibbon.vue`** into
      `#controls-ribbon-target` (`AnimationControlsControls.vue:163-177`).
  - **`RibbonBar.vue:3`** — the persistent ribbon Card (`<Card surface="cartoon">`,
    `:7` `id="controls-ribbon-target"` the teleport target).

- **`PlaybackRibbon.vue`** — the STANDARD playback ribbon:
  - a `<Slider variant="timeline">` scrubber (`:10-20`),
  - a **`grid grid-cols-2 gap-2 w-full`** (`:24`) of TWO equal cells:
    `Play/Pause` (`.btn-playback btn-playback-accent`, `:25-33`) +
    `Reverse` (`:34-50`),
  - the **`AnimationVisualizer`** — the big draggable progress **ball**
    (`bg-accent-red rounded-full h-12 w-12` riding a track,
    `AnimationVisualizer.vue:18-29`) — the G4 "ball" already exists in the kit.
  - The equal-size guarantee is `playback-button.css:16-24`
    (`.btn-playback { height:2rem; width:100%; … }`) shared across BOTH cells.

- The **bottom transport** (`AnimationMenuBar.vue`) — the shared bottom dock with
  the **rainbow** play (`:97-111`, `rainbow-vivid`/`rainbow-pastel`), reset
  (`RotateCcw`, `:79-86`), and trash (`Trash`, `:88-95`). This is ALREADY
  standard for every scene (easing included) — the G3 "bottom-dock colorful
  play/reset/trash" is the SHARED one; the BESPOKE part is the IN-SIDEBAR ribbon
  (below).

### How the easing scene diverges (the fork inventory)

`EasingScene.vue` does NOT compose the standard sidebar. It:

1. Renders **only `EasingTarget`** in its template root (`EasingScene.vue:2-4`),
   then provides **`EasingSidebar`** as the `tabsContent` slot
   (`EasingScene.vue:49-54`, `h(EasingSidebar, { demo })`).
2. Hand-rolls a bespoke **`ribbonContent`** (`EasingScene.vue:56-90`): a
   `grid grid-cols-2` of a `Pause/Play` `<Button class="btn-playback
   btn-playback-accent">` (`:60-74`) and a `Reset` `<Button class="h-8 w-full
   rounded-full gap-2 text-body btn-interactive">` (`:75-88`) — NOT the
   `PlaybackRibbon`, NO scrubber, NO `Reverse`, NO `AnimationVisualizer` ball.
3. **`EasingSidebar.vue`** is a wholly bespoke panel (the G5/G6 target):
   root `<div class="easing-editor glass-resting cartoon-surface p-3 grid gap-3">`
   (`:2`) → an `<h2>` (`:6`) + `EasingCurveCanvas` (`:9-16`) + three `<Card
   surface="cartoon">` blocks (`:19,40` + the steps card) + ad-hoc grid rows
   (`:42-73`) + a hand-rolled duration row (`:78-96`).
4. **`EasingTarget.vue`** is a wholly bespoke stage (the G2/G4/G8 target):
   `dock-inset` wrapper (`:2`) → bare-class card `<div class="glass-resting
   cartoon-surface easing-target …">` (`:4`) with a view-mode `<Select>` (`:15`)
   that re-draws the curve (`:46-59`).

`SpringScene.vue`/`SpringTarget.vue`/`StartingStyleTarget.vue` carry the SAME
fork shape (bespoke `SpringSidebar`, bare-class `glass-resting cartoon-surface`
stages — `SpringTarget.vue:4`, `StartingStyleTarget.vue:9`, both `dock-inset`).
**The fork is a scene-class pattern, not an easing one-off** — the normalization
must cover the stage-card scene family.

---

## G1 — icons watered down (revises W5.S2 + `proof:scene-icons`)

**The user's ask.** "The previous icons were the correct ones — EXPRESSIVE,
COLORFUL — do not water these down. Make new ones for the other primitives in the
same way." Recover the colorful style; extend to ALL primitives.

**Root cause — W5 deliberately replaced colorful with monochrome.**

- The current icon family is **monochrome `currentColor` stroke** SVGs.
  `assets/icons/easing.svg` (the live one):
  `fill="none" stroke="currentColor" stroke-width="3"` + two `fill="currentColor"
  … opacity="0.4"` endpoint dots — zero hue. Same shape across `cube.svg`,
  `amiga.svg`, `square.svg`, `spring.svg`, `sequence.svg`, `motion-path.svg`
  (8 files in `assets/icons/`).
- They import via the W5 substrate: `scenes.ts:8-14`
  (`import CubeIcon from "@assets/icons/cube.svg?component"` … ×7), bound on
  `SceneDescriptor.icon?: Component` (`scenes.ts:40`), rendered in the dock as
  `<component :is="scene.icon" class="icon-sm shrink-0 text-muted-foreground">`
  (`ChromeDock.vue:172,195,211`). **This `?component` + descriptor-`icon`
  infra IS the substrate to keep** — the icons are inline themable `<svg>`,
  single-sourced on the descriptor; only the ASSET *content* must change.

**The W5 gate ENFORCES monochrome — it must be REVISED, not just satisfied.**
`scripts/proof-scene-icons.mjs` actively forbids color:

- **G1 SHAPE** (`:189-253`): every `assets/icons/*.svg` (≠ favicon) MUST be
  `fill="none"` (`:219`) + carry `stroke="currentColor"` (`:223`) + `viewBox="0 0
  32 32"` (`:215`) + have **ZERO baked `#hex`/`hsl(`/`rgb(`** on any stroke/fill
  AND globally (`:205-207,229-238`). A colorful vector trips `:234-238` directly.
- **G4 THEMING** (browser half, `:303-570`): the AUTHORITY clause — a mounted
  icon's computed `stroke` MUST equal the host `currentColor` AND **DIFFER**
  between `.dark` and light (`:539-569`). A colorful icon (concrete fills that
  do NOT track `currentColor`, identical in both themes) reds `:548-554`
  (`stroke !== color`) and `:563-569` (`light.stroke === dark.stroke`).

**What "the previous icons" looked like (the recover-target).** The killed
assets (`git show 74abd2b:…`, added by "feat(demo): add scene icons" — the
ORIGINAL colorful family; killed at W5 `db90cbb`):

- `cube-icon-lg.png` (256×256) — a literal 3D cube with **magenta top / yellow
  left / red right** faces (the actual cube-demo face palette).
- `amiga-icon-lg.png` — a **red-and-white checkered sphere** (the actual amiga
  3D sphere).
- `square-icon-lg.png` — a **periwinkle/purple rounded square** reading "heyyyy"
  (the square demo).
- `easing-icon-sm.svg` (`git show db90cbb~1:assets/icons/easing-icon-sm.svg`) —
  the ONE prior *vector*, an ease curve stroked + dotted in **`hsl(248,88%,71%)`**
  (the indigo the W5 hue-grep names as the thing it killed).

They were rendered theme-blind via `<img :src>` from a dock-local
`sceneIcons: Record<string,string>` of imported PNG URLs
(`db90cbb~1:ChromeDock.vue:20-25,171,194,210`) — the D8 drift the W5 SVG swap
correctly cured. **G1 recovers the COLORFUL expression as scalable vector while
KEEPING the W5 themable-inline-`<svg>` mechanism + the descriptor single-source**
— a colorful vector family on `SceneDescriptor.icon` (still `<component :is>`,
not `<img>`). The gate REVISION must drop/loosen the G1-SHAPE no-baked-hue clause
and the G4-THEMING dark≠light equality (those two clauses are now WRONG for the
user's intent) while KEEPING the structural wins (inline `<svg>` not `<img>`,
coverage, no-raster, favicon-resolve).

---

## G2 — a card is NOT rounded

**The user's ask.** "Why is this card not rounded?" Some card lacks the
border-radius its siblings have.

**Root cause — `cartoon-surface` carries NO `border-radius`; the bare-class
surfaces miss `rounded-card`.**

- The glass-ui `<Card>` root ALWAYS applies `rounded-card`, independent of
  `surface`: `CardFooter-C390imy7.js:37` —
  `class: …("rounded-card text-card-foreground …", \`glass-${tier}\`, surface ===
  "cartoon" && "cartoon-surface", …)`. So `<Card surface="cartoon">` = `rounded-card`
  + `glass-{tier}` + `cartoon-surface`.
- `cartoon-surface` is a **decoration-only `@utility`** carrying ONLY three
  deltas — a 2px border, an offset-stamp `box-shadow`, a `translate` hover-lift
  (`@mkbabb/glass-ui/dist/styles/cards.css:33-48`). It explicitly does **NOT set
  `border-radius`** (the comment `:30-32` — "carries ONLY the three real deltas
  over a bare tier"). Neither does `glass-resting` (the glass tier sets bg/blur/
  border-color, not radius).

**Which card.** Two bare-class surfaces in the easing scene assemble the cartoon
look from raw classes instead of a `<Card>`, so they get the depth but NOT the
radius:

1. **`EasingTarget.vue:4`** — the main **stage card**:
   `<div class="glass-resting cartoon-surface easing-target w-full flex-1 min-h-0
   flex flex-col overflow-hidden">`. This is the G4 "main area card is not
   rounded either" — square corners.
2. **`EasingSidebar.vue:2`** — the sidebar root:
   `<div class="easing-editor glass-resting cartoon-surface p-3 grid gap-3">` —
   also square. (Its inner `<Card surface="cartoon">` children at `:19,40` ARE
   rounded — the visible mismatch the user sees: rounded inner cards inside a
   square outer panel.)

The SAME defect is in `SpringTarget.vue:4` and `StartingStyleTarget.vue:9` (both
bare `glass-resting cartoon-surface` flex stages). **Fix: route these onto a
`<Card>` (gets `rounded-card`) or onto a stage primitive that includes
`rounded-card` / `@apply rounded-card` — never a bare `cartoon-surface` div.**

---

## G3 — playback buttons bespoke + don't match the standard controls

**The user's ask.** "Why are these buttons different, and do not match the
controls panel of the standard cube/amiga/animation controls? They should match
EXACTLY, and RE-USE that component."

**Root cause — the easing scene hand-rolls a `ribbonContent` instead of mounting
`PlaybackRibbon`.**

- **The standard ribbon** (cube/amiga): `PlaybackRibbon.vue` — a `Slider`
  scrubber (`:10`), a `grid grid-cols-2` of `Play/Pause` (`.btn-playback
  btn-playback-accent`, `:25-33`) + `Reverse` (`:34-50`), and the
  `AnimationVisualizer` ball (`:53-60`). Mounted via teleport from
  `AnimationControlsControls.vue:163-177` into the `RibbonBar` target.
- **The easing scene** never reaches that chain. `EasingScene.vue:56-90`
  defines `ribbonContent` = a `grid grid-cols-2` of:
  - a `Pause/Play` `<Button variant="outline" class="btn-playback
    btn-playback-accent">` (`:60-74`) — borrows the accent skin but is a SEPARATE
    button, and
  - a `Reset` `<Button variant="outline" class="h-8 w-full rounded-full gap-2
    text-body btn-interactive">` (`:75-88`) — a DIFFERENT class string, a
    DIFFERENT verb (`Reset`, not `Reverse`).
  No scrubber, no `AnimationVisualizer`, no shared sizing. This is **the bespoke
  in-sidebar Pause/Reset** the user names (distinct from the shared rainbow
  bottom-dock play/reset/trash in `AnimationMenuBar`, which IS standard).
- `SpringScene.vue` carries the same bespoke-`ribbonContent` fork (it imports
  `Pause, Play, RotateCcw, Shuffle` for its own ribbon buttons).

**Fix: mount `PlaybackRibbon` (or route the easing playback through the standard
ribbon chain), deleting the hand-rolled `ribbonContent`.** The standard ribbon's
two cells are intrinsically equal-size (G7) and identical to cube/amiga (G3) by
construction.

---

## G4 — "Singular" duplicates the curve; the stage should be ONE big ball

**The user's ask.** The "Singular" view-mode (top-right dropdown in the easing
stage) is "useless and duplicative" — it re-draws the SAME bezier curve the
sidebar already shows. "Singular should NOT be a duplicated bezier view — it
should be ONE large ball" (the curve demonstrated in MOTION). AND "this main area
card is not rounded either."

**Root cause — the stage's `singular` view renders a second `EasingCurveCanvas`.**

- `EasingTarget.vue:15-35` — the header `<Select>` with `viewMode` defaulting to
  `"singular"` (`:146` `const viewMode = ref("singular")`), options
  `Singular | <family groups> | All` (`:23-33`).
- When `viewMode === 'singular'` AND the curve is bezier-editable, the stage
  renders a SECOND **`EasingCurveCanvas`** (`:46-59`, `class="easing-stage-curve
  w-full"`, `:editable="true"`) — the EXACT component the sidebar already shows
  at `EasingSidebar.vue:9-16`. Two copies of the curve editor on screen.
- For named/steps curves, `singular` instead shows a bare `<Slider
  variant="glass-scrubber">` (`:63-80`) — a scrubber, not a ball.
- The other view-modes (`:83-119`) render comparison **tracks** with small
  `progress-ball`s — proof the ball idiom is already in the file, just not the
  primary singular surface.

**The "ONE large ball" already exists in the kit (dogfood inv ζ).** The standard
`AnimationVisualizer.vue` is a big `bg-accent-red rounded-full h-12 w-12`
draggable ball riding a track (`:18-29`), driven by the engine. The easing scene
should host ONE large ball traversing under the selected easing — i.e. the
`AnimationVisualizer` / a `NumericAnimation`-driven ball (the inv-ζ dogfood), NOT
a second curve editor. The view-mode dropdown's `singular` value should BE the
ball; the curve stays in the sidebar only.

**The G4 stage-rounding twin.** "This main area card is not rounded either" = the
G2 root cause on `EasingTarget.vue:4` (bare `glass-resting cartoon-surface`, no
`rounded-card`). Same fix.

---

## G5 — the easing sidebar controls should be LARGER

**The user's ask.** The easing sidebar's controls are too small vs the standard
controls sidebar.

**Root cause — `EasingSidebar` uses a tighter type/spacing rung than the standard
`AnimationControlsControls`.**

| Aspect | Standard (`AnimationControlsControls.vue`) | Easing (`EasingSidebar.vue`) |
|--------|--------------------------------------------|------------------------------|
| Card content padding | `px-4 py-3` (`:4`) | `p-3` root (`:2`); inner cards `p-2` (`:20,41`) |
| Row gap | `gap-2` (`:9`) | `gap-3` root, inner `gap-1`/`gap-2` (`:42,53,78`) |
| Label rung | `text-mono-small` (`:13,21,…`) | `text-admin-label` (`:43,54,79`) — a SMALLER rung |
| Value rung | LabeledInput default | `text-mono-caption` (`:23,46,67,92`) |
| Slider size | (PlaybackRibbon) default timeline slider | `size="sm"` (`:82`) — 4px track / 12px thumb (`:177`) |

`text-admin-label` and `size="sm"` are the smallest rungs in the system; the
standard sidebar uses `text-mono-small` + default-size controls + `px-4 py-3`.
**Fix: normalize onto the standard rung** (falls out of G6's component reuse — a
normalized sidebar inherits the standard sizing).

---

## G6 — too many inner-containers; FLATTEN + use a NORMALIZED component

**The user's ask.** "There are too many inner-containers here — FLATTEN this —
match more of the normal controls sidebar — this should use a NORMALIZED
COMPONENT."

**Root cause — `EasingSidebar` is a bespoke nested assembly, not the flat
standard sidebar.**

`EasingSidebar.vue` nesting depth (`:2-97`):

```
.easing-editor (root div · glass-resting cartoon-surface · :2)
├── <h2> (:6)
├── <EasingCurveCanvas> (:9)  →  GlassPanel > svg (its own nesting)
├── <Card surface="cartoon" p-0> (:19)
│   └── <CardContent flex items-center gap-2 p-2> (:20)
│       ├── <Input> + <CopyButton>
├── <EasingSelect> (:33)
├── <Card surface="cartoon" p-0> (:40, v-if steps)
│   └── <CardContent grid grid-cols-2 gap-2 p-2> (:41)
│       ├── <div grid gap-1> (:42)  · label + Input
│       └── <div grid gap-1> (:53)  · label + Select(Trigger/Content/Item)
└── <div flex items-center gap-2 px-1> (:78)  · label + .duration-slider div + Input
```

That is THREE `<Card>/<CardContent>` wrappers + several ad-hoc `grid gap-1`/`flex
gap-2` row containers nested inside a bare-class root. Compare the FLAT standard:
`<Card surface="cartoon">` → `<CardContent>` → `.panel-stack` → `.panel-row` →
`.panel-content flex flex-col gap-2` → uniform `LabeledInput`/`LabeledSelect`
rows (`AnimationControlsControls.vue:3-9`). The standard renders every field as
ONE `Labeled*` row in one flow; the easing sidebar wraps each concern in its own
card + grid.

**Fix: REUSE the standard sidebar component** (the "NORMALIZED COMPONENT" the
user names = `AnimationControls`/`AnimationControlsControls` + the `Labeled*`
rows). The easing-specific controls (the curve canvas, the steps/duration fields)
become `Labeled*` rows / a slot inside the standard sidebar, NOT a forked panel.
This is the KISS·DRY G3/G6 directive: REUSE, do NOT fork a second sidebar.

---

## G7 — Pause/Reset (and Reverse) buttons must be the SAME width + height

**The user's ask.** The Pause and Reset (and Reverse) buttons have unequal
dimensions; normalize them (equal width + height).

**Root cause — the easing ribbon's two buttons carry DIFFERENT class strings,
unlike the standard ribbon's shared skin.**

- `EasingScene.vue:60-74` — button 1 (`Pause/Play`): `class="btn-playback
  btn-playback-accent"` → `playback-button.css:16-24` sets `height:2rem;
  width:100%`.
- `EasingScene.vue:75-88` — button 2 (`Reset`): `class="h-8 w-full rounded-full
  gap-2 text-body btn-interactive"` — a SEPARATE class string. `h-8` (2rem) ≈
  the `.btn-playback` height, but the two paths are unrelated, so any future tweak
  to one drifts the other; padding/gap differ; one carries the accent fill, the
  other doesn't.
- The standard ribbon avoids this by construction: `PlaybackRibbon.vue:24` wraps
  BOTH cells in `grid grid-cols-2 gap-2 w-full` (equal-width tracks) and gives
  both the `.btn-playback` height (`playback-button.css:16`,
  `height:2rem; width:100%`). The `grid-cols-2` + shared height = equal w/h by
  the layout idiom, not a per-button magic number.

**Fix: G7 dissolves into G3** — reusing `PlaybackRibbon` (its `grid-cols-2` +
shared `.btn-playback` skin) makes the buttons equal-size automatically. (No
hardcoded per-button width/height — the grid track + the one shared class.)

---

## G8 — the easing area CLIPS INTO THE DOCKS (a LAYOUT-PRIMITIVE change)

**The user's ask.** "The easing area CLIPS INTO THE DOCKS — reconcile this
cleanly — perhaps remove the card bg from the easing area to better match how the
cube/amiga/etc works? Or better contain the card between the two docks? Do so
idiomatically … WITHOUT overfit, overcomplex hardcoded items. This should be a
proper LAYOUT-LEVEL PRIMITIVE change."

**Root cause — the stage track + `dock-inset` reserve the BOTTOM dock band only;
the easing/spring stretch-card fills `[stage]` and its TOP edge slides under the
affixed top dock.**

The geometry chain:

1. **The two affixed docks.** The TOP `ChromeDock` is `fixed` at `top:
   calc(max(--work-area-top-offset, env(safe-area-inset-top)) + --dock-margin/4)`
   (`ChromeDock.vue:108-109`). The BOTTOM `AnimationMenuBar` is `fixed` at
   `bottom: var(--work-area-bottom-offset)` (`AnimationMenuBar.vue:7`). Both
   occupy a band of height `--dock-band-reserve` (`style.css:119-122` =
   `--dock-icon-height + --dock-margin + safe-area`).
2. **The `[stage]` track has NO dock inset.** `AnimationControlsGroup.vue:364` —
   `grid-template-rows: [top] auto [stage] 1fr [bottom] auto`. The `[top]` auto
   row is reserved for the hero/dock, but the docks are `fixed` (out of flow), so
   `[top] auto` collapses to 0 when empty and `[stage] 1fr` spans nearly the full
   viewport height — UNDER both fixed docks.
3. **`dock-inset` pads BOTTOM only.** `design-idioms.css:498-500` —
   `.dock-inset { padding-bottom: var(--dock-band-reserve); }`. It reserves the
   bottom menubar band but NOT the top ChromeDock band. The easing wrapper
   (`EasingTarget.vue:2`) is `… overflow-hidden dock-inset`, and its child stage
   card (`:4`) is `flex-1 min-h-0` — it STRETCHES to fill the wrapper's full
   height, so the card's TOP edge runs to the top of `[stage]`, under the top
   dock. (Spring is identical — `SpringScene.vue:2` `… dock-inset`,
   `SpringTarget.vue:4` `flex-1`.)
4. **Why cube/amiga DON'T clip.** Their stage subjects are CENTERED with slack,
   not stretched to a card: cube is `grid … items-center justify-center
   overflow-visible` with the 3D cube centered (`CubeScene.vue:2-15`); amiga is a
   bare `<canvas h-full w-full rounded-lg>` (`AmigaScene.vue:6-9`); square is a
   centered flex stage (`SquareScene.vue:2`). No full-bleed card edge to clip —
   the subject floats in the middle, clear of both bands. `proof:stage-not-clipped`
   pins THIS subject (`.stage-cell`, `scripts/proof-stage-not-clipped.mjs:207-242`)
   at 1280/1440 — but it measures the `.stage-cell` GRID CELL, not the easing
   card inside it, so the easing card's clip slips past that gate (a gate
   blind-spot to note for the W8 amend).

**The fix is a LAYOUT PRIMITIVE — two clean options (no magic numbers):**

- **(A) symmetric stage containment.** Promote `dock-inset` (or a sibling
  `.stage-inset`) to reserve BOTH bands — `padding-block:
  var(--dock-band-reserve)` (top via `--work-area-top-offset`-aware term, bottom
  via the existing `--dock-band-reserve`). The card then sits BETWEEN the two
  docks. Both terms already exist as cycle-free tokens (`--dock-band-reserve`,
  `--work-area-top-offset`) — NO new hardcoded value.
- **(B) full-bleed, drop the card bg.** Make the easing/spring stage subject
  full-bleed + centered like cube/amiga (no `glass-resting cartoon-surface` card
  wrapping the whole stage) — which ALSO dissolves G2/G4-rounding (no square card
  to round) and matches "how cube/amiga works." This is the user's own preferred
  lean ("perhaps remove the card bg").

Either is a LAYOUT-LEVEL primitive (the stage-containment token / the full-bleed
stage idiom), NOT an overfit per-scene patch. Reconcile with the `[stage]` track
form (`AnimationControlsGroup.vue:360-390`).

---

## Composition with the authored-but-unimplemented H.W9 spec (F1–F9)

H.W10 (G1–G8) must COMPOSE with H.W9 (F1–F9, spec `82c37c8`), not contradict it.
The named seams:

- **H.W9 F1 (rows label-left/value-right) vs G6 (normalize the easing sidebar).**
  F1 restores an intra-row `[auto_1fr]` split in the STANDARD
  `AnimationControlsControls`/`LayerConfigPanel` rows (H.W9.md §S3), keeping ONE
  column. G6 says the easing sidebar should BE that standard sidebar. They
  reinforce: normalizing easing onto the standard component (G6) makes it inherit
  F1's row shape for free — no second authoring. **Reconcile: G6's normalization
  is the vehicle; F1 is the row idiom the normalized sidebar carries.**

- **H.W9 F2 (fit the bezier PANEL) vs G4 (the easing STAGE = a ball).** Distinct
  surfaces. F2 fits the `TimingFunctionPanel`'s in-panel `EasingCurveCanvas`
  (the detail Card in the RAIL, `AnimationControlsControls.vue:331-334` cap; H.W9.md
  §S4). G4 changes the easing STAGE (`EasingTarget`) from a duplicate curve to a
  ball. Different components (`TimingFunctionPanel` in the rail vs `EasingTarget`
  in the stage), different fixes — no collision. **Reconcile: F2 sizes the
  in-rail bezier panel; G4 replaces the in-stage curve with the ball.**

- **H.W9 F8 (`tier="quiet"` on `surface="cartoon"` cards, incl.
  `EasingSidebar.vue:19,40`) vs G2/G6 (round + normalize).** F8 adds `tier="quiet"`
  to the easing sidebar's INNER `<Card>`s. If G6 normalizes EasingSidebar onto the
  standard component, those inner cards may dissolve into standard rows — H.W10
  must carry the `tier="quiet"` register onto whatever the normalized form
  becomes. F8 does NOT touch the bare-class `EasingTarget.vue:4` stage (no `<Card>`
  there) — G2/G8 own that surface. **Reconcile: H.W10's normalized surfaces
  inherit H.W9's quiet-cartoon register; the bare-class stage is H.W10's exclusive
  province (round or full-bleed).**

- **H.W9 amends `proof:single-column-pack`, NEW `proof:bezier-no-scroll`, etc.**;
  it KEEPS `proof:stage-not-clipped` + `proof:easing-canvas-bounded` UNCHANGED
  (H.W9.md §gates "KEPT UNCHANGED"). G8's clip is NOT caught by the current
  `proof:stage-not-clipped` (it measures `.stage-cell`, not the easing card) —
  **H.W10 must add/amend a gate that bites the easing-card-into-dock clip**, and
  G1 must REVISE `proof:scene-icons` (the monochrome shape+theming clauses).

---

## Gate ledger (the born-RED bites H.W10 must author — for R3/the planner)

Each must bite TODAY on `tranche-h-impl` and green on the H.W10 fix, citing a
`file:line`/live anchor:

| G | Gate move | Born-RED bite (today) |
|---|-----------|----------------------|
| G1 | REVISE `proof:scene-icons` (drop no-baked-hue + dark≠light; KEEP inline-`<svg>`/coverage/no-raster/favicon) + NEW "icons carry color" assertion | the new colorful assets RED the existing G1-SHAPE (`:234-238`) + G4-THEMING (`:548-569`) until those clauses are revised; a colorful-icon assertion reds on today's monochrome |
| G2 | NEW `proof:stage-card-rounded` — every scene-stage/sidebar surface has computed `border-radius > 0` | reds on `EasingTarget.vue:4`, `EasingSidebar.vue:2`, `SpringTarget.vue:4`, `StartingStyleTarget.vue:9` (computed radius 0 — bare `cartoon-surface`, no `rounded-card`) |
| G3/G7 | NEW `proof:scene-uses-standard-ribbon` — the easing/spring playback ribbon mounts `PlaybackRibbon` (a scrubber + equal `grid-cols-2` cells), not a bespoke `ribbonContent` | reds on `EasingScene.vue:56-90` / `SpringScene.vue` (no `PlaybackRibbon`, no scrubber, unequal class strings) |
| G4 | NEW `proof:easing-stage-is-ball` — the easing `singular` stage hosts a moving ball (an `AnimationVisualizer`/`NumericAnimation` subject), NOT a second `EasingCurveCanvas` | reds on `EasingTarget.vue:46-59` (a second curve canvas in the stage) |
| G5/G6 | NEW `proof:easing-sidebar-normalized` — the easing sidebar reuses the standard `AnimationControls(Controls)` rung (label `text-mono-small`, `px-4 py-3`) + bounded nesting depth | reds on `EasingSidebar.vue` (`text-admin-label`, `p-2`/`gap-1`, ×3 `<Card>` + ad-hoc grids) |
| G8 | NEW/AMEND `proof:stage-within-docks` — the easing/spring STAGE CARD (not just `.stage-cell`) is bounded between the top + bottom dock bands at 1280/1440 | reds today (the `flex-1` card top runs under the top ChromeDock; `dock-inset` pads bottom only — `design-idioms.css:498-500`) |

---

## Anchor index (every `file:line` cited)

- **G1:** `assets/icons/easing.svg` (live monochrome) · `assets/icons/{cube,amiga,square,spring,sequence,motion-path}.svg` · `demo/app/scenes.ts:8-14,40` · `demo/@/components/custom/dock/ChromeDock.vue:172,195,211` · `scripts/proof-scene-icons.mjs:189-253,303-570` (SHAPE `:215,219,223,234-238`; THEMING `:539-569`) · killed: `git show 74abd2b:assets/icons/{cube,amiga,square}-icon-{sm,lg}.png`, `git show db90cbb~1:assets/icons/easing-icon-sm.svg`, `git show db90cbb~1:demo/@/components/custom/dock/ChromeDock.vue:20-25,171,194,210`
- **G2:** `@mkbabb/glass-ui/dist/CardFooter-C390imy7.js:37` · `@mkbabb/glass-ui/dist/styles/cards.css:30-48` · `demo/easing/EasingTarget.vue:4` · `demo/easing/EasingSidebar.vue:2,19,40` · `demo/spring/SpringTarget.vue:4` · `demo/spring/StartingStyleTarget.vue:9`
- **G3:** `demo/app/scenes/EasingScene.vue:56-90` · `demo/@/components/custom/animation-controls/controls/PlaybackRibbon.vue:24-50,53-60` · `…/controls/AnimationControlsControls.vue:163-177` · `…/components/RibbonBar.vue:3,7` · `…/controls/playback-button.css:16-24` · `…/controls/AnimationVisualizer.vue:18-29` · `demo/app/scenes/SpringScene.vue:45`
- **G4:** `demo/easing/EasingTarget.vue:4,15-35,46-59,63-80,146` · `demo/easing/EasingSidebar.vue:9-16` · `…/controls/AnimationVisualizer.vue:18-29`
- **G5:** `demo/easing/EasingSidebar.vue:2,20,41,43,46,54,67,79,82,92,177` vs `…/controls/AnimationControlsControls.vue:4,9,13`
- **G6:** `demo/easing/EasingSidebar.vue:2-97` vs `…/controls/AnimationControlsControls.vue:3-9` · `…/components/ControlsPaneWrapper.vue:26-84` · `…/controls/AnimationControls.vue:27-110`
- **G7:** `demo/app/scenes/EasingScene.vue:60-74,75-88` · `…/controls/PlaybackRibbon.vue:24` · `…/controls/playback-button.css:16-24`
- **G8:** `demo/@/styles/design-idioms.css:498-500` · `demo/@/components/custom/animation-controls/AnimationControlsGroup.vue:56-57,364,379-382` · `demo/@/components/custom/dock/ChromeDock.vue:108-109` · `demo/@/components/custom/animation-controls/AnimationMenuBar.vue:7` · `demo/@/styles/style.css:108-109,119-122` · `demo/app/scenes/CubeScene.vue:2-15` · `demo/app/scenes/AmigaScene.vue:6-9` · `demo/app/scenes/SquareScene.vue:2` · `demo/easing/EasingTarget.vue:2,4` · `demo/spring/SpringScene.vue:2` · `scripts/proof-stage-not-clipped.mjs:207-242`
- **Standard component (G2-G7 spine):** `…/AnimationControlsGroup.vue:335-390` · `…/components/ControlsPaneWrapper.vue` · `…/controls/AnimationControls.vue` · `…/controls/AnimationControlsControls.vue` · `…/components/RibbonBar.vue` · `…/controls/PlaybackRibbon.vue`
- **H.W9 reconcile:** `docs/tranches/H/waves/H.W9.md` (§Scope, §S3 F1, §S4 F2, §S1 F8, §gates)
