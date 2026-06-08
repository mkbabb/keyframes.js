# g-r3-reconcile — Component + Layout-Primitive Reconciliation (Research Lane R3)

**Tranche H · H.W10 feedback fold (G1–G8) · DOCS-ONLY · read-only · NO dist build.**

Scope of this lane: resolve **idiomatically** (a) G3/G6/G7 — the easing/new scenes REUSE the
standard controls component so buttons + sidebar match cube/amiga EXACTLY; (b) G1 — the
colorful-icon idiom that still adapts to dark/light; (c) G4 — the easing stage as ONE large
engine-driven ball (inv ζ dogfood); (d) G8 — the LAYOUT-PRIMITIVE containment so no scene clips the
docks; (e) G2/G5 — rounding + sizing via the standard tokens. Grounded on SOURCE READS + git history
+ `modern-web-guidance` (citations inline). Composes with — does NOT contradict — the **H.W9 spec**
(F1–F9, landed `82c37c8`, not yet implemented).

---

## 0. The seam map (what reuses what TODAY, measured)

The "standard controls component" is not one file — it is a slot-driven shell with a per-animation
playback ribbon. Three facts decide the whole normalization:

1. **The scene → shell contract is `defineExpose` slot-render functions.** Every scene
   (`CubeScene.vue:208-219`, `AmigaScene.vue:203-206`, `EasingScene.vue:92-110`) exposes
   `animationGroup`, `superKey`, `isPlaying`/`isStarted`, and OPTIONAL slot thunks
   (`tabsTrigger`, `tabsContent`, `ribbonContent`, `headerLeft`, `startScreen`, `extraControlTabs`).
   `App.vue` mounts the scene under `AnimationControlsGroup` and forwards these into the named slots
   (`AnimationControlsGroup.vue:32-40` → `ControlsPaneWrapper` → `RibbonBar`).

2. **The STANDARD playback ribbon is `controls/PlaybackRibbon.vue` — rendered PER-ANIMATION by
   `AnimationControlsControls.vue:164-176`.** It is the canonical Play/Reverse + scrub-slider +
   `AnimationVisualizer` row, skinned by `playback-button.css` (`.btn-playback`,
   `.btn-playback-accent`). It mounts when the group has a `selectedAnimation`. Props:
   `animation, currentT, isAnimPlaying, isAnimStarted, userReversed`; emits
   `togglePlay, toggleReverse, sliderUpdate, scrubStart, scrubEnd, scrubbed`.

3. **The `ribbon-content` slot is for EXTRA scene controls, NOT playback.** Its real job
   (`RibbonBar.vue:94-103`) is the per-scene tab's auxiliary buttons — cube's Matrix Reset/Lock
   (`CubeScene.vue:157-176`). It is rendered ONLY for non-default tabs. Cube/amiga get their
   Play/Reverse from `PlaybackRibbon`, NOT from `ribbon-content`.

**The divergence root-cause (the through-line).** The easing/spring scenes use a
`NumericAnimation`/`SpringProgress` driver (`useEasingDemo.ts`) that is NOT surfaced as a scrubbable
group animation in `AnimationControlsControls`, so `PlaybackRibbon` never mounts for them. To get a
play button at all, they hand-rolled a SECOND playback ribbon inside `ribbonContent`
(`EasingScene.vue:56-90`: Play + Reset; `SpringScene.vue:95-…`: Play + … ). This second ribbon is the
source of G3 (mismatched buttons), G7 (unequal button dims), and part of G6 (excess components). It
is a FORK of `PlaybackRibbon` — exactly the KISS·DRY violation the charter forbids.

---

## (a) G3 + G6 + G7 — REUSE the standard controls component (the normalization path)

### G3/G7 — the bespoke ribbon is a partial fork; the fix is to consume `PlaybackRibbon`

**Measured asymmetry (the G7 born-RED fact).** `EasingScene.vue:56-90` renders two buttons in a
`grid grid-cols-2 gap-2`:

- Play: `class="btn-playback btn-playback-accent"` — the STANDARD skin (`playback-button.css:16-24`
  gives it `height:2rem; width:100%; border-radius:var(--radius-pill)`).
- Reset: `class="h-8 w-full rounded-full gap-2 text-body btn-interactive"` — a BESPOKE skin. It is
  NOT `.btn-playback`, so its font-family (`--font-serif`), letter-spacing (`0.02em`), and
  focus/active/`aria-pressed` states all DIVERGE. The `h-8` (2rem) matches Play's height by
  coincidence, but the typography + interaction skin do not. This is precisely "these buttons are
  different and don't match the controls panel."

**The idiomatic resolution — two moves, in priority order:**

1. **PREFERRED (full normalization, KISS·DRY): make the easing/spring demos surface a standard
   scrubbable animation so `PlaybackRibbon` mounts for them like every cube/amiga animation does.**
   The easing demo ALREADY owns a `CSSKeyframesAnimation` + `AnimationGroup` + `RAFPlayback`
   (`useEasingDemo.ts:12-15`) and a `scenePlayback` adapter (`EasingScene.vue:105`). The normalized
   form registers the easing ball-traversal animation into the group under a `selectedAnimation`, so
   `AnimationControlsControls` renders the SAME `PlaybackRibbon` (Play/Reverse + scrub + visualizer)
   it renders for cube. The hand-rolled `ribbonContent` is DELETED (no legacy beside its
   replacement). This is the strongest gestalt: the easing scene's transport becomes byte-identical
   to cube's because it IS cube's component, not a copy.

2. **FLOOR (if the demo cannot surface a group animation this wave): consume `PlaybackRibbon`
   directly from `ribbonContent`, OR — strictly minimal — drop the bespoke Reset skin onto the
   `.btn-playback` base.** Even the minimal floor must make both buttons share ONE skin:
   `btn-playback` on BOTH (Play keeps the `-accent` modifier; Reset takes the bare `.btn-playback`).
   `playback-button.css` is already a SHARED non-scoped partial imported by `PlaybackRibbon`
   (`playback-button.css:6-13` explicitly notes the scene play buttons are co-consumers), so this is
   the intended reuse seam — the easing Reset button is simply not USING it yet. This guarantees
   equal width (`width:100%` in a 2-col grid) AND equal height (`height:2rem`) AND identical
   typography/focus/active — closing G7 by construction.

**Recommendation:** path 1 (surface the animation, mount the real `PlaybackRibbon`, delete the
fork). Path 2 is the documented fallback if surfacing slips the wave — but path 2 alone leaves a
second ribbon component in the tree (a partial G6 miss), so path 1 is the gestalt close.

**Reverse vs Reset (a real reconcile, not a paint).** The STANDARD ribbon is **Play / Reverse**
(`PlaybackRibbon.vue:24-51`). The easing fork is **Play / Reset**; spring is **Play / … / Reset**.
The bottom-dock menubar (`AnimationMenuBar`, wired via `AnimationControlsGroup.vue:79-90`) ALREADY
owns Reset/Clear for every scene (`@reset` → `reset()`/`clear()`). So Reset in the easing ribbon is
DUPLICATIVE with the dock. **Normalize to Play/Reverse in the ribbon** (matching cube/amiga) and let
the dock own Reset — this both matches the standard component AND removes a duplicate control (the
G3 "they should match EXACTLY" intent). The easing demo already exposes a `reset()`; it stays wired
to the dock, not a second ribbon button.

### G6 — flatten the easing layout, reuse the standard controls sidebar

**Measured nesting (the born-RED fact).** `EasingSidebar.vue` is a bespoke sidebar:
`div.easing-editor` → `h2` + `EasingCurveCanvas` + `Card(CardContent)` (CSS value bar) +
`EasingSelect` + `Card(CardContent)` (steps, conditional) + `div`(duration row). Inside the
shell it ALSO sits in a `TabsContent` (`EasingScene.vue:49-54`). That is: TabsContent → easing-editor
grid → two more `Card`/`CardContent` shells → grid rows. The standard controls sidebar
(`AnimationControlsControls.vue`) is ONE `Card surface="cartoon"` with `LabeledInput`/`LabeledSelect`
rows (the H.W9 F1 row idiom: `grid grid-cols-[auto_1fr]` label-left/value-right).

**The idiomatic resolution:**

- **Reuse the row primitive, not a new container per field.** The duration row
  (`EasingSidebar.vue:78-96`), the steps grid (`:40-75`), and the CSS-value bar (`:19-30`) should be
  `LabeledInput`/`LabeledSelect` rows inside the SAME single `Card surface="cartoon" tier="quiet"`
  (the H.W9 F1+S1 register) the standard sidebar uses — NOT nested `Card → CardContent` shells per
  field. This deletes ~2 levels of container per field and makes each row label-left/value-right by
  the SAME mechanism cube uses (H.W9 S3, `AssetPropertiesPanel.vue:6` precedent
  `grid grid-cols-[auto_1fr] items-center`).
- **Compose with H.W9, do not re-decide.** H.W9 S1 already adds `tier="quiet"` to
  `EasingSidebar.vue:19,40` (the two inner Cards). H.W10 G6 must RECONCILE: the flatten REMOVES those
  two inner Cards (folding their fields into the parent sidebar Card), so the H.W9 site list for
  EasingSidebar SHRINKS to the single parent Card. Note this explicitly in the H.W10 spec as a
  named composition with H.W9 (the `tier="quiet"` decision survives; only the container COUNT drops).
- **The canvas/curve does NOT belong in the sidebar after G4.** Under G4 (below) the big curve
  becomes the STAGE's ball, and the sidebar keeps the small editable bezier curve ONLY for the
  cubic-bezier/named families (the H.W9 F2 bezier-panel idiom is the precedent — title + tight
  canvas). The sidebar's `EasingCurveCanvas` (`EasingSidebar.vue:9-16`) stays as the EDITOR
  affordance; the duplicate STAGE curve dies (G4).

**Net G6 shape:** one `Card surface="cartoon" tier="quiet"`, label-left rows for css-value /
steps / duration, the editable bezier curve as the lone hero element, NO per-field sub-Cards. This
is "match more of the normal controls sidebar" literally.

---

## (b) G1 — the EXPRESSIVE, COLORFUL icon idiom (reverses the W5 monochrome decision)

### What "the previous correct ones" were (git archaeology)

The W5 wave (`db90cbb`) replaced TWO prior icon lineages with one monochrome `currentColor` family:

- **3 PNG screenshots** (`cube/amiga/square-icon-sm.png`, 32×32 RGBA) — literal colorful raster
  thumbnails of the running scenes. These are the "expressive, colorful" icons the user remembers.
  KILLed in `db90cbb` (they were theme-blind `<img :src>` rasters + double-shipped — the legit W5
  complaint), but the COLOR was the baby thrown out with the bathwater.
- **1 hand-SVG** (`easing-icon-sm.svg`, `db90cbb~1`): a curve stroked
  `hsl(248,88%,71%)` (a vivid indigo) with two `hsl(248,…) opacity:0.4` endpoint dots. This is the
  EXEMPLAR shape the family converged on — but W5 rewrote its `hsl(248…)` → `currentColor`
  (`assets/icons/easing.svg` today), draining the color.

The W5 family today (`assets/icons/*.svg`): `fill="none" stroke="currentColor"` 32×32 stroke glyphs.
Enforced by `proof:scene-icons` G1 (no baked `hsl(`/`rgb(`/`#hex`) + G4 (computed stroke == host
`currentColor`, dark≠light). **G1 of the user feedback DIRECTLY REVERSES proof:scene-icons G1+G4's
theming clause.**

### The decisive recommendation — a fixed VIVID palette per primitive that reads on both themes

The problem the W5 author was solving (theming) is REAL — but the answer is not "drain to one
inherited color." The modern idiom is **a fixed, per-icon vivid palette baked into the inline SVG,
chosen to read on BOTH light and dark canvases**, with the SVG referenced inline (`<component :is>`)
so it remains scalable vector — colorful, NOT monochrome.

**Why a fixed vivid palette (not `currentColor`, not per-theme variants):**

- A scene-nav glyph is a BRAND MARK / category color, not body text. modern-web's
  `component-specific-light-dark-theme` guide is explicit: forcing `color-scheme`/inheritance is for
  "shallow containers," whereas "design tools, maps, visualizations, games, illustrations" are
  exactly the case where a fixed identity color is correct — an illustration should keep its own
  palette. A category icon is an illustration, not a control glyph.
- The demo ALREADY OWNS a vivid, theme-validated palette: the `--rainbow-*` family
  (`design-idioms.css:46-58`: red `hsl(0 85% 60%)`, orange `hsl(30 90% 55%)`, yellow
  `hsl(55 90% 55%)`, green `hsl(130 70% 50%)`, blue `hsl(210 80% 55%)`, violet `hsl(300 75% 60%)`,
  cyan `hsl(180 80% 50%)`) plus `--color-progress` (the canonical green) and the `--accent-*`
  family. These are CHOSEN to read on both themes (they paint the rainbow play-button + progress
  rail in both). Assigning each scene one (or a small gradient of two) of these tokens gives an
  expressive, COHERENT, already-dual-theme palette with ZERO new color decisions (KISS·DRY — REUSE
  the demo's own palette, do not invent magic hexes).

**Mechanism (keeps it scalable + colorful + dual-theme):** two valid forms, recommend form A.

- **Form A (RECOMMENDED) — inline SVG that paints from the demo's CSS custom properties via
  `stroke`/`fill` referencing the token, resolved at the host.** Because the icon is referenced
  inline (`?component` → `<component :is>`, the W5 substrate we KEEP), an SVG node can read CSS
  custom properties from the cascade: `stroke="var(--rainbow-blue)"` resolves against the
  demo's `:root` tokens. The `--rainbow-*` tokens are theme-validated, so each icon is colorful AND
  the colors track the (already dual-theme) token definitions. This is the most DRY: the icon palette
  IS the demo palette; if the demo re-tunes a rainbow stop for contrast, every icon follows. (If a
  small number of icons need a richer read, a per-icon `<linearGradient>` of two `--rainbow-*` stops
  — the same technique as `design-idioms.css:347-353`'s rainbow gradient and the
  `#rainbow-gradient` SVG def in `AnimationControlsGroup.vue:98-108` — is the idiomatic escalation.)
- **Form B (acceptable fallback) — a baked fixed vivid hue per icon chosen to clear contrast on
  both canvases** (e.g. a mid-lightness, mid-chroma OKLCH/HSL that reads on both white and the dark
  surface). Simpler (no var() resolution), but it forfeits the "follows the demo palette" DRY and
  re-introduces baked hues. Use ONLY if a token-referenced fill proves brittle under the
  `?component`/SVGO pipeline.

**Per-primitive palette assignment (expressive + coherent, reusing the existing tokens):**
keep the W5 STROKE GEOMETRY (the shape language is sound — easing curve, spring damped-sine,
sequence bars, path figure-loop, cube/amiga/square glyphs) and re-color it. Suggested mapping (one
identity color each, drawn from the dual-theme `--rainbow-*`/`--accent`/`--color-progress` set):
easing→violet, spring→green (`--color-progress`, the settling/progress tone), sequence→blue,
motion-path→cyan, cube→orange, amiga→red (`--accent-red`, the amiga subject is a red sphere),
square→yellow. The endpoint/texture dots inherit the same token at `opacity:0.4` (the easing
exemplar's pattern, now colorful again). The lead/IMPL wave finalizes the exact assignment; the
binding decision is **fixed-vivid-per-icon from the demo palette, inline-referenced** — NOT
monochrome `currentColor`.

### How `proof:scene-icons` MUST change (the theming clause RELAXED/replaced)

The gate's G1 (no baked color) + G4 (stroke == host `currentColor`, the monochrome theming clause)
ENFORCE the exact thing G1-feedback reverses. The revision:

- **G1 SHAPE — RELAX the no-baked-color clause to a POSITIVE expressive-palette assertion.** Replace
  "ZERO baked `hsl(`/`rgb(`/`#hex` on any stroke/fill" with: every `assets/icons/*.svg` is inline
  vector (`viewBox="0 0 32 32"`, `fill="none"` stroke-drawn shape language PRESERVED) and carries an
  EXPRESSIVE color — assert each icon's stroke/fill references either a demo `--rainbow-*` /
  `--accent-*` / `--color-progress` custom property (Form A) OR a fixed vivid hue (Form B). The
  born-RED inversion: a `stroke="currentColor"`-ONLY icon now FAILS (it is monochrome — the very
  thing the user rejected). This makes the gate bite the W5 monochrome family TODAY and green only on
  the colorful re-author.
- **G4 THEMING — REPLACE "stroke == host currentColor, dark≠light" with "SVG + inline + expressive +
  legible-on-both."** Keep the load-bearing structural bite (the icon is a REAL inline `<svg>`, NOT
  an `<img>` — that defended against the theme-blind raster regression and is STILL correct). Drop
  the "dark==light reds" clause (it now FAILS the colorful family by design). Add instead: (a) the
  mounted icon is an inline `<svg>` with a colored geometry node (not `<img>`, not monochrome
  inherit); (b) the resolved stroke/fill is NOT equal to the host `color` (proving it carries its
  OWN identity color, the inverse of the old assertion); (c) OPTIONAL contrast check — the resolved
  color clears a minimum ΔL against BOTH the light surface and the dark surface (the "reads on both"
  guarantee, the legitimate kernel of the old theming concern). This asserts SVG+inline+expressive,
  per the lane brief, not currentColor-monochrome.
- **G2 COVERAGE + G3 NO-RASTER — UNCHANGED.** Every non-home descriptor still carries `icon:`
  (the D8 cure stands); `assets/icons/` still holds zero non-favicon PNG (the inline-vector idiom
  stands — the icons remain SVG, just colorful). The favicon 404 guard stands.

**The W5 substrate is REUSED, the assets + the theming clause are swapped** — exactly the lane brief:
"the W5 SceneDescriptor.icon family + vite-svg-loader infra is the SUBSTRATE — reuse it, swap the
icon ASSETS + revise the gate." SVGO config note: W5 set `convertColors:false` (H.W5.S1) so it does
NOT rewrite colors — that ALREADY protects a fixed/var() palette through the `?component` pipeline;
keep it.

---

## (c) G4 — the easing stage as ONE large engine-driven ball (inv ζ dogfood)

### What the stage is TODAY (the duplicative-curve fact)

`EasingTarget.vue` is the easing STAGE. Its `viewMode` Select (`:15-35`) offers Singular / a family /
All. **Singular** (`:46-80`) renders, for an editable curve, a SECOND `EasingCurveCanvas`
(`:50-58`) — the exact curve the sidebar already shows (`EasingSidebar.vue:9-16`); for a named/steps
curve, a glass scrubber Slider (`:67-79`). The multi-track modes render rows of
`.progress-ball`/`.progress-rail` (`:88-117`). So Singular = a duplicate curve editor, and the view
dropdown is the "useless and duplicative" control the user named.

### The recommendation — Singular IS one large ball traversing under the selected easing

Replace the Singular center stage with **ONE large ball sweeping a horizontal rail, eased by the
selected timing function** — demonstrating the curve in MOTION (not a static second copy of it). This
is the inv-ζ dogfood: the ball is driven by the ENGINE, not by ad-hoc view math.

- **The dogfood seam already exists.** The multi-track rows ALREADY animate a ball:
  `getBallX(fn, …) = fn(demo.progress.value) * maxX` (`EasingTarget.vue:236-241`), positioning the
  shared `.progress-ball`/`.progress-rail` idiom (`design-idioms.css:413-424`). And the standard
  `AnimationVisualizer.vue` (`controls/AnimationVisualizer.vue`) IS the demo's canonical big
  traversing ball (the red `h-12 w-12` puck on a rail, `:18-37`), driven by the engine
  (`SmoothProgress`/`SpringProgress`/`RAFPlayback`, `:47-50`) — the inv-ζ component the brief names.
- **Two idiomatic implementations, recommend the engine-true one:**
  1. **PREFERRED (true dogfood): drive the ball off a real engine animation under the selected
     easing.** `useEasingDemo` already builds a `CSSKeyframesAnimation` + `NumericAnimation` +
     `AnimationGroup` (`useEasingDemo.ts:12-14`). The Singular stage hosts ONE large ball whose
     `translateX` is the engine's `effectiveT` mapped through the selected easing — i.e. the easing
     function becomes the animation's timing function and the ENGINE samples it. This is "the curve
     in motion" produced by the curve actually driving the engine — the strongest inv-ζ statement,
     and it reuses the SAME `AnimationVisualizer`/`NumericAnimation` primitives cube/amiga use. Pairs
     with (a)-path-1 above: if the easing animation is in the group, `PlaybackRibbon` mounts AND the
     stage ball is the visualizer — one transport, one ball, all engine.
  2. **FLOOR (minimal): keep `demo.progress` as the linear time axis and position one large
     `.progress-ball` via `fn(progress) * maxX`** (the EXISTING `getBallX` math at hero size). Still
     engine-adjacent (the rAF sweep already drives `progress`), reuses the shared ball idiom, and is
     a small delta from today's multi-track code — but less "dogfood" than path 1.
- **The view dropdown.** "Singular should NOT be a duplicated bezier view — it should be ONE large
  ball." So Singular → the big ball. The comparison views (a family / All) are the LEGITIMATE
  non-duplicative use of the multi-track grid (many curves at once — genuinely additive vs the
  sidebar's single curve), so they MAY stay. But if the lead wants maximum KISS, the dropdown can be
  reduced to Singular(ball) + All(comparison), dropping the per-family middle (the family is already
  inferable). Recommend: keep Singular(ball) and the comparison modes; the editable curve lives in
  the SIDEBAR only (no stage duplicate).
- **G4 also says "this main area card is not rounded either"** — see G2/G8 below; the stage card
  rounding/full-bleed decision is the G8 layout-primitive call.

**Gate:** a NEW born-RED `proof:easing-ball-stage` — at `#/easing` Singular, assert the stage's
primary element is a `.progress-ball` (or `AnimationVisualizer`) whose x-position tracks
`fn(progress)` over time, AND there is NO `EasingCurveCanvas` in the STAGE subtree (the duplicate
curve is gone; the editable canvas exists ONLY in the sidebar). Reds today (Singular renders a second
`EasingCurveCanvas`); greens on the ball. Mirror the `proof:easing-canvas-bounded` Playwright
plumbing.

---

## (d) G8 — the LAYOUT-PRIMITIVE containment (the docks-clip fix)

### Root-cause (measured)

The easing stage overflows past the affixed top/bottom docks. Two facts:

1. **The standard scenes are FULL-BLEED into the `[stage]` grid track.** Cube
   (`CubeScene.vue:2-15`) and amiga (`AmigaScene.vue:1-11`) render directly into the
   `.stage-cell` (`AnimationControlsGroup.vue:56-60`), which on desktop occupies
   `grid-row: stage` of the `[top] auto [stage] 1fr [bottom] auto` rows
   (`AnimationControlsGroup.vue:360-390`). They wear NO card background — the subject floats in the
   stage track. They do NOT clip the docks because the `[stage]` track is bounded by the `[top]`/
   `[bottom]` auto rows AND the whole grid is sized to `--work-area-max-height`
   (`AnimationControlsGroup.vue:336-341`).
2. **The easing/spring stages add a CARD + a `dock-inset` that the standard scenes don't.**
   `EasingTarget.vue:2` wraps the stage in `max-w-3xl mx-auto … dock-inset` and `:4` a
   `glass-resting cartoon-surface easing-target` CARD with `flex-1 min-h-0`. `SpringScene.vue:2`
   mirrors this (`dock-inset` + view-switch card). `dock-inset` (`design-idioms.css:498-500`) adds
   `padding-bottom: var(--dock-band-reserve)` — a per-scene patch that reserves the bottom-dock band.
   So the easing scene reserves the bottom band via a CLASS, while the standard grid reserves it via
   the `[bottom]` row + `--work-area-max-height`. The two mechanisms are NOT the same magnitude, and
   the card's `flex-1` can exceed the inset → the clip the user sees.

### The decision — make the `[stage]` track the SINGLE containment primitive; drop the per-scene card bg

The brief offers two options. They are NOT mutually exclusive — the cleanest answer is **both at
their right altitude**, with the layout PRIMITIVE doing the containment and the easing card dropping
to full-bleed.

**Recommendation:**

1. **PRIMITIVE (the layout-level fix, no magic numbers): the `[stage]` track already IS the
   containment — every scene must render into it WITHOUT a competing inset.** The grid's
   `[top] auto [stage] 1fr [bottom] auto` rows, sized to `--work-area-max-height`, are the
   dock-safe envelope. The defect is that easing/spring OPT OUT of it (their `dock-inset` +
   `max-w-3xl` + card double-reserve). The primitive fix: the `.stage-cell` is the ONLY thing that
   reserves dock clearance — promote the bottom-dock reserve onto the `[bottom]` row / stage-cell
   contract so NO scene needs `dock-inset`. Concretely: ensure the `[bottom]` auto row (or a
   `--stage-bottom-inset` on `.stage-cell` derived from the EXISTING `--dock-band-reserve` /
   `--work-area-bottom-offset` tokens) reserves the menubar band for ALL scenes uniformly. Then
   DELETE `dock-inset` from `EasingTarget.vue:2` and `SpringScene.vue:2` — the band is reserved by
   the grid, once, for every scene (DRY; no per-scene class). This is the "[stage] track contained
   within `--work-area-*-offset` between the docks" grid-primitive option — and it reuses the EXISTING
   `--work-area-bottom-offset`/`--dock-band-reserve`/`--dock-menubar-reserve` tokens
   (`style.css:108-131`), so NO hardcoded numbers.
2. **FULL-BLEED (the surface fix): the easing stage drops its card bg to match cube/amiga.** Per the
   brief's "remove the card bg from the easing area to better match how the cube/amiga works." The
   `glass-resting cartoon-surface easing-target` CARD (`EasingTarget.vue:4`) becomes a transparent
   full-bleed stage (the BALL is the subject, floating in the `[stage]` track like the cube floats).
   This also resolves G4's "this main area card is not rounded" — there is no card to round; the
   subject is the ball. With G4 turning the stage into a single ball + comparison list, the card is
   no longer load-bearing (the multi-track comparison list can keep a light scroll container, but the
   Singular stage is bg-less). The `max-w-3xl mx-auto` may stay as an optical max-measure for the
   comparison list, but the Singular ball uses the full stage width.

**Why both, and which is the "cleaner primitive":** the PRIMITIVE (option 1) is the structural cure —
it makes the `[stage]` track the single dock-safe envelope so NO future scene can clip the docks
(the permanent fix, the charter's "layout-PRIMITIVE, not a patch"). The FULL-BLEED (option 2) is the
SURFACE consequence that makes easing match cube/amiga AND resolves the G2/G4 rounding complaints by
removing the offending card. **Land both: option 1 is the binding primitive; option 2 is the easing
scene consuming it idiomatically (full-bleed like its siblings).** No hardcoded numbers — every
reserve resolves to the existing work-area/dock tokens.

modern-web grounding: `css-layout §7` is explicit — use `dvh`/`100%` for dock-aware containers (NOT
`100vw`), and the grid `[top]/[stage]/[bottom]` named-row skeleton (`css-layout §3`) is the
layout-first primitive for a "header + main + footer" page where main must NOT overlap the affixed
chrome. The affixed-dock safe-area idiom = reserve via named rows + `env(safe-area-inset-bottom)`
(already in `--dock-band-reserve`, `style.css:121`), NOT a per-component padding patch.

**Gate:** AMEND/REUSE `proof:stage-not-clipped` (the B.W3 cube-not-clipped subject the layout grid
already gates) to ALSO assert the easing + spring stages: at `#/easing` and `#/spring` desktop +
mobile, the stage subject's `getBoundingClientRect()` bottom is ABOVE the bottom dock's top edge AND
its top is BELOW the top dock — i.e. contained in the dock-safe band — with NO `dock-inset` class in
the scene markup (a static clause: `dock-inset` is deleted; the containment comes from the grid).
Born-RED today (easing clips + carries `dock-inset`); green on the primitive + full-bleed.

---

## (e) G2 + G5 — rounding + sizing via the standard tokens

### G2 — a card is NOT rounded

The likely subject is the easing STAGE card (`EasingTarget.vue:4`,
`glass-resting cartoon-surface easing-target`) and/or the spring view-switch
(`SpringScene.vue:8`). The `glass-resting cartoon-surface` primitive is shared with the standard
panels, but `EasingTarget.vue:4` adds NO explicit `rounded-*` and relies on whatever the
`cartoon-surface`/`easing-target` rules set; the standard `Card surface="cartoon"` (used by
`AnimationControlsControls`, `RibbonBar.vue:3`) carries the glass-ui Card radius by default. The
easing stage is a bare `<div>` with the surface CLASSES but NOT the glass-ui `Card` COMPONENT, so it
misses the Card's `border-radius` token — that is "why is this card not rounded."

**Resolution (idiomatic, ties into G8):** under G8 option 2 the easing stage CARD is DROPPED
(full-bleed) — so the unrounded card simply ceases to exist (the cleanest close). For any card that
SURVIVES (e.g. the comparison-list container, the spring view-switch), normalize it to the glass-ui
`Card surface="cartoon" tier="quiet"` COMPONENT (the H.W9 register) instead of a hand-classed `<div>`
— inheriting the standard radius token by construction (DRY: one Card primitive, one radius). Do NOT
add an ad-hoc `rounded-lg` literal; consume the Card.

**Gate:** a static clause (fold into `proof:single-column-pack` or a small `proof:scene-card-radius`):
any surviving scene surface that carries `surface="cartoon"`/`cartoon-surface` resolves a non-zero
`border-radius` (== the glass-ui Card token), OR is the full-bleed bg-less stage (no card). Reds on a
bare hand-classed surface with `border-radius:0`.

### G5 — the easing sidebar controls should be LARGER

The easing sidebar uses the `text-admin-label` / `text-mono-caption` / `size="sm"` Slider rungs
(`EasingSidebar.vue:44-95`) — a TIGHTER scale than the standard controls sidebar
(`AnimationControlsControls` uses the body/`LabeledInput` default rungs). The size mismatch is a
consequence of the bespoke sidebar (G6) NOT consuming the standard row primitives.

**Resolution:** G5 is CLOSED by G6 — when the easing sidebar adopts the standard `LabeledInput`/
`LabeledSelect` rows + the default control sizes (not `size="sm"` / `text-admin-label`), the controls
size up to the standard sidebar scale automatically (DRY: the same components → the same sizes). No
per-control size override — REUSE the standard sizing tokens via the standard components. The
duration Slider drops `size="sm"`; the labels drop `text-admin-label` for the standard label rung.

**Gate:** the H.W9 `proof:single-column-pack` amendment (label-left rows) already measures the
easing/spring sidebar rows once normalized; add a clause that the easing sidebar's control rung
matches the standard sidebar's (e.g. the Slider track height / input font-size equals the
`AnimationControlsControls` value within tolerance) — reds on the `size="sm"` tightness, greens on
the normalized rows.

---

## Composition with H.W9 (explicit reconciliation — do NOT contradict)

H.W9 (F1–F9, landed spec `82c37c8`, not yet implemented) and H.W10 (G1–G8) overlap on the easing/
controls surfaces. The reconciliations the H.W10 spec MUST state:

- **H.W9 F1 (label-left/value-right rows, ONE column) ⟂ H.W10 G6 (flatten + normalize the easing
  sidebar).** SAME DIRECTION. G6 ADOPTS the F1 row idiom for the easing sidebar (which F1's site
  list — `AnimationControlsControls`, `LayerConfigPanel` — did NOT cover). H.W10 EXTENDS F1's row
  shape to `EasingSidebar`/`SpringSidebar`. State it as "G6 consumes F1's row primitive."
- **H.W9 S1 (`tier="quiet"` on `EasingSidebar.vue:19,40`) ⟂ H.W10 G6 (delete those two inner
  Cards).** The G6 flatten REMOVES the two inner easing Cards (folding fields into the parent). So
  the H.W9 EasingSidebar site list shrinks from 2 inner Cards to 1 parent Card. The `tier="quiet"`
  DECISION survives (the parent Card carries it); only the container count drops. State as a named
  amendment to H.W9 S1's site inventory.
- **H.W9 F2 (fit the bezier panel + header-right back) ⟂ H.W10 G4 (the easing STAGE becomes a
  ball).** DISTINCT SURFACES. F2 is the cubic-bezier DETAIL PANEL inside the standard controls
  (`TimingFunctionPanel.vue`); G4 is the easing SCENE STAGE. They do not collide — but BOTH involve a
  bezier canvas. The reconcile: the bezier CANVAS lives in (1) the standard controls detail panel
  (F2's tight in-panel ceiling) and (2) the easing SIDEBAR (the editable curve, G6). The STAGE shows
  the BALL (G4), NOT a bezier canvas. So: ONE editable bezier canvas per host (panel + sidebar), zero
  on the stage. State explicitly to avoid a third bezier-canvas instance.
- **H.W9 F7 (cartoon shadow clearance inside the load-bearing clip) ⟂ H.W10 G8 (stage containment).**
  COMPATIBLE — F7 is the CONTROLS-PANE clip (`ControlsPaneWrapper`), G8 is the STAGE track. Different
  clipping ancestors; no conflict.
- **H.W9 ordering ("BEFORE H.W8's GOLDEN proof:visual-lock baseline").** H.W10 changes the SAME
  rendered surfaces (easing scene, icons, stage) — so H.W10 MUST also land BEFORE the H.W8 golden
  baseline, OR the baseline is re-captured after H.W10. State the sequencing: H.W9 then H.W10 then
  the H.W8 golden capture, so the lock captures the FINAL (colorful-icon, normalized-easing,
  full-bleed-stage) state.

---

## Decisive recommendations (one-line each)

- **G3/G7:** delete the hand-rolled easing/spring ribbon; surface the easing animation into the group
  so the STANDARD `PlaybackRibbon` (Play/Reverse + scrub + visualizer) mounts (path 1); FLOOR =
  consume `PlaybackRibbon` from `ribbonContent` or at minimum put BOTH buttons on the shared
  `.btn-playback` skin. Reset is owned by the dock menubar, not a second ribbon button.
- **G6:** one `Card surface="cartoon" tier="quiet"` with `LabeledInput`/`LabeledSelect` label-left
  rows (the H.W9 F1 idiom) — delete the per-field sub-Cards; the editable bezier curve is the lone
  hero in the sidebar.
- **G1:** EXPRESSIVE COLORFUL inline-SVG icons painting from the demo's dual-theme `--rainbow-*`/
  `--accent-*`/`--color-progress` tokens (Form A) — REUSE the W5 stroke geometry + `?component`
  substrate, swap the colors back in, REVISE `proof:scene-icons` G1+G4 to assert
  SVG+inline+expressive+legible-on-both (NOT currentColor-monochrome).
- **G4:** Singular stage = ONE large engine-driven ball (`AnimationVisualizer`/`NumericAnimation`,
  inv ζ) traversing under the selected easing — DELETE the duplicate stage `EasingCurveCanvas`; the
  editable curve lives in the sidebar only.
- **G8:** the `[stage]` grid track is the SINGLE dock-safe containment primitive (reserve via the
  EXISTING `--work-area-*-offset`/`--dock-band-reserve` tokens, delete the per-scene `dock-inset`),
  AND the easing stage drops its card bg to full-bleed like cube/amiga. No magic numbers.
- **G2:** the unrounded card dies with the full-bleed stage (G8); any surviving surface uses the
  glass-ui `Card surface="cartoon" tier="quiet"` COMPONENT (inherits the radius token) — no ad-hoc
  `rounded-*`.
- **G5:** closed by G6 — adopting the standard row components + sizes lifts the easing controls to the
  standard sidebar scale; drop `size="sm"`/`text-admin-label`.

## modern-web citations

- `css-layout` (skill `modern-web-guidance@2026_05_16`): §3 grid named-rows for header/main/footer
  page skeletons (the `[top]/[stage]/[bottom]` primitive — G8); §1 intrinsic sizing / no hardcoded
  dimensions (G8 no-magic-numbers); §7 `dvh`/`100%` for dock-aware containers, never `100vw` (G8).
- `component-specific-light-dark-theme`: design tools / visualizations / illustrations legitimately
  carry their OWN palette rather than forcing inheritance — the basis for fixed-vivid scene icons
  over `currentColor` (G1); the `light-dark()` inheritance gotcha (do NOT register icon-color tokens
  as `<color>`, keep them live custom properties) informs Form A's token-referenced fills.
- `dark-mode`: `--token-light`/`--token-dark` custom-property pairs + `prefers-color-scheme` fallback
  — the demo's `--rainbow-*` already follow this dual-theme pattern (`design-idioms.css`), so reusing
  them gives the "reads on both" guarantee for free (G1 Form A).
