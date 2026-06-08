# H.W10 — SCENE NORMALIZATION + EXPRESSIVE ICONS + the STAGE LAYOUT-PRIMITIVE (the consolidated G1–G8 feedback fold)

**The PLAN lane synthesis** of the user's 8 live-observed feedback items (G1–G8) on the
landed `tranche-h-impl` demo (W0–W6 + W5 landed at `db90cbb`; the H.W9 spec `82c37c8`
authored-but-NOT-implemented). Grounded on the feedback triumvirate's three research lanes:

- **R1** (`g-r1-source-rootcause.md`) — the `file:line` root-cause of each item on the
  CURRENT committed source (HEAD `db90cbb`); the through-line verdict; the standard-component
  spine; the gate ledger.
- **R2** (`g-r2-git-archaeology.md`) — the "previous correct" forms: the killed colorful PNG
  icons (`74abd2b`) + the original violet easing SVG (`db90cbb^:easing-icon-sm.svg`); the
  easing scene's born-bespoke lineage (`f1d4fe6`); no prior full-bleed easing form exists.
- **R3** (`g-r3-reconcile.md`) — the idiomatic + modern-web reconcile: the `PlaybackRibbon`
  reuse path; the fixed-vivid-palette icon idiom (reusing `--rainbow-*`); the engine-ball
  stage (inv ζ); the `[stage]`-track containment primitive; the H.W9 composition.

> **The through-line (the gestalt verdict — read first).** G2/G3/G4/G5/G6/G7/G8 are ONE root
> cause wearing six faces: **the easing scene (and the stage-card scene family — spring,
> starting-style) DIVERGED from the standard cube/amiga controls component + the
> rail·stage·rail layout.** Born bespoke at `f1d4fe6`, the easing scene forks the entire
> standard sidebar chain (`ControlsPaneWrapper → AnimationControls → AnimationControlsControls
> + PlaybackRibbon`), hand-rolls a bespoke `EasingSidebar`/`EasingTarget`, hand-rolls a
> bespoke `ribbonContent` (Play + Reset, not the standard Play/Reverse ribbon), wraps its
> stage in a bare-class `glass-resting cartoon-surface` `<div>` (which carries NO
> `rounded-card` — the literal G2/G4 square-corner defect), and offsets it with a `dock-inset`
> that pads only the BOTTOM band (the G8 top-clip). **NORMALIZATION onto the standard
> component + a real `[stage]`-track containment primitive is the gestalt fix — REUSE, do not
> fork a second sidebar/ribbon (KISS·DRY, G3/G6 explicit).** G1 is a SEPARATE axis: a W5
> course-correction to recover the killed colorful icons as scalable vector.

---

## §0 — Structure decision: ONE new corrective wave H.W10 (compose with, do not merge into, H.W9)

These eight items are **course-corrections on LANDED waves** (W5 — icons, stage-curve-promote;
W3 — the rail·stage·rail grid + the row shape; W2 — the cartoon surface) observed by the user
AFTER the visual waves landed. Per `H.md §Mandate` (no legacy beside its replacement; the
chronic-closure discipline; supersede with a CITED ledger), the cleanest idiomatic home is **a
NEW corrective wave H.W10** that SUPERSEDES the specific landed decisions it corrects, each
supersede cited with why precept-consistent.

**Why a SEPARATE H.W10, not folded into H.W9 (the normalization cluster):**

- **H.W9's headline is the MATERIAL register** (F3/F6/F8 — `tier="quiet"` + remove the tracked
  specular) + the controls-pane refinements (F1 rows, F2 bezier panel, F7 shadow clip, F4/F5
  dock menu, F9 idle-fade). **H.W10's headline is COMPONENT + STAGE NORMALIZATION** (the easing/
  spring scenes adopt the standard controls component; the stage becomes a contained full-bleed
  ball) + the EXPRESSIVE ICON reversal. These are distinct gestalts at distinct altitudes — the
  panel-material-tuning wave vs the scene-architecture-normalization wave. Two waves keeps each
  coherent and each supersede-map honest.
- H.W10 is born AFTER H.W9 (it COMPOSES with H.W9's just-landed surfaces — see §H.W9
  reconciliation), so it must be a separate sequenced wave, not a retro-edit of the H.W9 spec.

**Overlap-to-MERGE flag (the one item that lives BETTER inside H.W9).** G2 ("a card is not
rounded") and G5 ("controls too small") are NOT independent fixes — they DISSOLVE into G6/G8
(see §G2, §G5). The only genuinely H.W9-adjacent fragment is the `tier="quiet"` register the
G6-normalized sidebar must inherit: H.W9 S1 already sets `tier="quiet"` on
`EasingSidebar.vue:19,40` (two inner Cards). **H.W10 G6 deletes those two inner Cards** (folds
their fields into the parent), so the H.W9 S1 site-inventory for `EasingSidebar` SHRINKS to the
single parent Card — a NAMED amendment to H.W9 S1, NOT a contradiction (the `tier="quiet"`
DECISION survives on the surviving Card). This is stated as a cross-wave amendment in
§H.W9-reconciliation, not a merge of the whole item.

**Sequencing.** H.W10 lands AFTER H.W9 (it composes with H.W9's normalized rows + quiet
register) and BEFORE H.W8's GOLDEN `proof:visual-lock` baseline capture — so the colorful
icons, the normalized easing scene, and the full-bleed contained stage are the FINAL rendered
state the named-region matrix locks. The convergent order: **H.W9 → H.W10 → H.W8 golden
capture** (R3 §composition).

**DAG-deps:** H.W10 depends on **H.W1** (the FSM resting — every browser gate settle-gates on
it; the easing/spring scenes route through the machine via `scenePlayback`), **H.W3** (the
rail·stage·rail grid + `[stage]` track G8 reconciles + the row shape G6 inherits), **H.W5**
(the `SceneDescriptor.icon` + `vite-svg-loader` substrate G1 reuses; the stage-curve-promote G4
reverses), **H.W9** (the normalized rows G6 consumes + the `tier="quiet"` register G6/G2
inherit + the bezier-panel-fit F2 G4 reconciles with). Pure demo CSS/markup/Vue — NO engine
source (it CONSUMES public `NumericAnimation`/`SmoothProgress`/`AnimationVisualizer` for the inv
ζ dogfood), NO glass-ui patch in kf (inv-16), NO dist build.

**Class:** SHIP-in-H (corrective). Net-deletion-leaning on the scene side (delete the bespoke
`ribbonContent`, the duplicate stage curve, the `dock-inset` per-scene class, ~2 container
levels per field), additive on the icon side (re-color the 7 SVG assets).

---

## §1 — The cross-cutting gestalt (how the 8 collapse)

| Cluster | Items | The one move |
|---------|-------|--------------|
| **Scene normalization (the spine)** | G3 + G6 + G7 + G5 | the easing/spring scenes REUSE the standard controls component — mount `PlaybackRibbon` (deleting the bespoke `ribbonContent`), flatten `EasingSidebar` onto the standard `AnimationControlsControls`/`Labeled*` rows (which lifts the control sizing + makes the buttons equal by construction) |
| **The stage = a ball** | G4 | the easing `singular` stage hosts ONE large engine-driven ball (`AnimationVisualizer`/`NumericAnimation`, inv ζ) under the selected easing — DELETE the duplicate stage `EasingCurveCanvas`; the editable curve lives in the sidebar only |
| **The stage layout-primitive** | G8 + G2 | the `[stage]` grid track is the SINGLE dock-safe containment primitive (reserve via the EXISTING work-area/dock tokens, delete the per-scene `dock-inset`); the easing/spring stage drops its card bg → full-bleed like cube/amiga, which dissolves G2's un-rounded card (no card to round) |
| **Expressive icons** | G1 | recover the killed COLORFUL icons as scalable inline SVG painting from the demo's dual-theme `--rainbow-*`/`--accent-*`/`--color-progress` tokens — REUSE the W5 `SceneDescriptor.icon` + `?component` substrate, swap the ASSETS, REVISE `proof:scene-icons` (monochrome → expressive-colorful) |

**The deepest collapse is G3+G6+G7+G5 → ONE normalization decision** (the spine). Reusing the
standard `PlaybackRibbon` makes the buttons match cube/amiga EXACTLY (G3) AND equal-size by the
`grid-cols-2` + shared `.btn-playback` skin (G7) automatically. Reusing the standard sidebar
component flattens the nesting (G6) AND lifts the control sizing to the standard rung (G5)
automatically. G2 and G8 collapse together (the full-bleed stage removes the un-rounded card).
G4 and G8 collapse together (the ball IS the full-bleed subject). Only G1 is a standalone axis.

---

## §2 — Per-item scope clauses (WHAT + WHY · target file:line · approach · supersede · gate)

### G1 — recover the EXPRESSIVE, COLORFUL icons (reverses W5.S2 + `proof:scene-icons`)

- **WHAT.** Recover the killed colorful icon expression as SCALABLE inline VECTOR, extended to
  ALL primitives (cube/amiga/square/easing/spring/sequence/motion-path). KEEP the W5 stroke
  GEOMETRY (the shape language is sound) and RE-COLOR it — colorful, NOT monochrome.
- **WHY (the user's ask).** "The previous icons were the correct ones — EXPRESSIVE, COLORFUL —
  do not water these down. Make new ones for the other primitives in the same way."
- **The previous correct form (R2).** TWO killed generations: (1) the colorful Playwright-
  screenshot PNGs (`74abd2b`) — `cube-icon-lg.png` (magenta top / yellow left / red right 3D
  cube), `amiga-icon-lg.png` (red-and-white checker sphere), `square-icon-lg.png` (periwinkle/
  violet "heyyyy" card); (2) the original violet easing vector
  (`db90cbb^:assets/icons/easing-icon-sm.svg`) — the SAME arc+endpoint-dot form as today's
  `easing.svg` but stroked `hsl(248, 88%, 71%)` (vivid indigo). The unifying read was
  **expressive + colorful**, not a monochrome line set.
- **Why W5 over-corrected (R2).** W5 (`db90cbb`) cured a REAL defect (D8 — the old
  `Record<string,string>` `<img :src>` raster registry was theme-blind, covered 4/9 scenes)
  by moving to a per-descriptor inline-`<svg>` family — but threw the COLOR out with the
  bathwater, making every icon `fill="none" stroke="currentColor"` monochrome. The W5 commit
  body ITSELF flags this: *"the inline-SVG icon STYLE (monochrome currentColor) is superseded
  by H.W10 (the user's G1 feedback — the expressive/colorful icons were correct); the
  SceneDescriptor.icon family + vite-svg-loader infrastructure this wave built is the substrate
  H.W10 refines."* G1 is the cited, pre-authorized supersede.
- **Target (R1/R2).** The 7 monochrome assets `assets/icons/{cube,amiga,square,easing,spring,
  sequence,motion-path}.svg` (each `viewBox="0 0 32 32" fill="none" stroke="currentColor"`).
  Substrate to KEEP UNCHANGED: `demo/app/scenes.ts:8-14,40,88-141` (`?component` imports +
  `SceneDescriptor.icon`), `demo/@/components/custom/dock/ChromeDock.vue:172,195,211`
  (`<component :is="scene.icon">`), `vite.config.ts:190-205` (svgLoader `convertColors:false`
  + `removeViewBox:false`). The exemplar to re-color from: `assets/icons/easing.svg` (live
  monochrome) → restore the violet.
- **Idiomatic approach (R3, Form A RECOMMENDED).** Inline SVG that paints from the demo's CSS
  custom properties — `stroke="var(--rainbow-blue)"`/`fill="var(--rainbow-violet)"` resolved
  at the host. The `--rainbow-*`/`--accent-*`/`--color-progress` tokens
  (`design-idioms.css:46-58`) are ALREADY theme-validated (they paint the rainbow play-button +
  progress rail in both themes), so each icon is colorful AND tracks the dual-theme token
  definitions — the most DRY (the icon palette IS the demo palette; ZERO new color decisions,
  KISS·DRY). `convertColors:false` (`vite.config.ts:198`) faithfully preserves any baked
  hue/`var()` through the `?component` seam — ZERO infra change. **Form B fallback** (a baked
  fixed vivid hue chosen to read on both canvases) ONLY if a token-referenced fill proves
  brittle under the SVGO pipeline.
  - **Suggested per-primitive palette (R3, the lead/IMPL finalizes the exact map):**
    easing→violet (restore `hsl(248,88%,71%)`/`--rainbow-violet`), spring→green
    (`--color-progress`, the settling tone), sequence→blue, motion-path→cyan, cube→orange (or
    the 3-face magenta/yellow/red of the killed PNG via a `<linearGradient>` of `--rainbow-*`
    stops — the same technique as the `#rainbow-gradient` def at
    `AnimationControlsGroup.vue:98-108`), amiga→red (`--accent-red`, the amiga sphere is red),
    square→yellow (or periwinkle to match the killed card). Endpoint/texture dots inherit the
    same token at `opacity:0.4`.
- **Supersedes:** **W5.S2** (the survivor-SVG family authored `fill="none" stroke="currentColor"`,
  the easing hue `hsl(248…)`→`currentColor` flip) + the **W5.S2 BLK-7/WV-W5-MED-2** "G4 is the
  authority — a baked hue FAILS" clause. Precept-consistent: W5 itself named G1 as the
  superseder; the SUBSTRATE (inline-`<svg>` on the descriptor, full coverage, no-raster,
  favicon-resolve) is KEPT — only the asset COLOR + the gate's monochrome-enforcement clauses
  reverse. No-legacy: the monochrome assets are replaced once, in place.
- **Gate — REVISE `proof:scene-icons`** (`scripts/proof-scene-icons.mjs`):
  - **G1-SHAPE (`:17-23`, the no-baked-color clause) → INVERT to a POSITIVE expressive-palette
    assertion.** Replace "ZERO baked `hsl(`/`rgb(`/`#hex` on any stroke/fill" with: every
    `assets/icons/*.svg` (≠ favicon) is inline vector (`viewBox="0 0 32 32"`, the `fill="none"`
    stroke-drawn shape language PRESERVED) AND carries an EXPRESSIVE color — each stroke/fill
    references a demo `--rainbow-*`/`--accent-*`/`--color-progress` custom property (Form A) OR
    a fixed vivid hue (Form B). **Born-RED inversion:** a `stroke="currentColor"`-ONLY icon now
    FAILS (it is monochrome — the very thing the user rejected). Bites the W5 monochrome family
    TODAY (`easing.svg` et al. carry NO color token), greens on the colorful re-author.
  - **G4-THEMING (`:40-57`, the browser half: "computed stroke == host `currentColor`,
    dark≠light") → REPLACE with "SVG + inline + expressive + legible-on-both".** KEEP the
    load-bearing structural bite (the mounted icon is a REAL inline `<svg>` with a colored
    geometry node, NOT an `<img>` — the D8 theme-blind-raster defense, still correct). DROP the
    "stroke == host color" + "dark≠light" equality clauses (they now FAIL the colorful family
    by design). ADD: (a) the resolved stroke/fill is NOT equal to the host `color` (proving it
    carries its OWN identity color — the inverse of the old assertion); (b) OPTIONAL contrast
    check — the resolved color clears a minimum ΔL against BOTH the light AND dark surface (the
    legitimate "reads on both" kernel of the old theming concern). Bites the monochrome family
    (stroke == host color) TODAY, greens on the colorful icons.
  - **G2-COVERAGE (`:25-31`) + G3-NO-RASTER/FAVICON-404 (`:32-38`) — KEPT UNCHANGED.** Every
    non-`home` descriptor still carries `icon:`; `assets/icons/` still holds zero non-favicon
    PNG (the icons remain SVG, just colorful); the favicon `rel=icon` still resolves (no 404).
  - **NEW companion clause "icons carry color"** (folds into the SHAPE half): at least one
    stroke/fill per icon resolves to a non-monochrome value (a `var(--rainbow*/accent*/progress)`
    reference or a baked vivid hue). Mirrors the existing resolve-or-red parse plumbing.

### G2 — a card is NOT rounded (dissolves into G8's full-bleed stage)

- **WHAT.** Root-cause + eliminate the un-rounded card the user named ("why is this card not
  rounded?").
- **WHY (root cause, R1).** `cartoon-surface` is a glass-ui DECORATION-ONLY `@utility`
  (`@mkbabb/glass-ui/dist/styles/cards.css:30-48`) carrying ONLY a 2px border + an offset-stamp
  `box-shadow` + a hover-lift — it explicitly does **NOT set `border-radius`** (the comment
  `:30-32`). The radius lives on the glass-ui `<Card>` ROOT's `rounded-card` class
  (`CardFooter-C390imy7.js:37`, applied for ALL surfaces). The easing/spring stages assemble
  the cartoon look from RAW classes on a bare `<div>` (`glass-resting cartoon-surface`) instead
  of mounting a `<Card>` — so they get the depth but MISS the radius.
- **Which cards (R1).** `EasingTarget.vue:4` (the main stage card — the G4 "main area card is
  not rounded either"), `EasingSidebar.vue:2` (the bespoke sidebar root — square outer panel
  with rounded inner Cards = the visible mismatch), `SpringTarget.vue:4`,
  `StartingStyleTarget.vue:9`, `SpringScene.vue:8` (the view-switch). All bare-class
  `glass-resting cartoon-surface` surfaces.
- **Idiomatic approach (R3).** G2 is a CONSEQUENCE of the bespoke stage/sidebar (G6/G8), not a
  standalone fix. Under G8 the stage CARD is DROPPED (full-bleed) — so the un-rounded stage card
  simply ceases to exist (the cleanest close, no card to round). Under G6 the sidebar root div
  becomes the standard `Card surface="cartoon" tier="quiet"` COMPONENT — inheriting the
  `rounded-card` token by construction. For any surface that SURVIVES (e.g. the spring
  view-switch, the comparison-list container), normalize it to the glass-ui `Card` COMPONENT,
  never a hand-classed `<div>` + ad-hoc `rounded-*`. DRY: one Card primitive, one radius token.
- **Supersedes:** no landed DECISION (a forward defect-fix); it rides the W2 surface-flip
  architecture (cartoon = decoration over a glass tier) by routing the bare-class surfaces onto
  the `<Card>` component. Precept-consistent: REUSE the glass-ui primitive, no ad-hoc literal.
- **Gate — NEW `proof:scene-card-rounded`** (or fold a static+computed clause into the G6/G8
  gate). Every scene-stage/sidebar surface that carries `cartoon-surface`/`surface="cartoon"`
  resolves a non-zero computed `border-radius` (== the glass-ui Card token), OR is the
  full-bleed bg-less stage (no card). **Born-RED today:** reds on `EasingTarget.vue:4`,
  `EasingSidebar.vue:2`, `SpringTarget.vue:4`, `StartingStyleTarget.vue:9` (computed radius 0 —
  bare `cartoon-surface`, no `rounded-card`). Greens on the full-bleed stage (no card) + the
  Card-component sidebar (radius token resolves).

### G3 — playback buttons bespoke + don't match the standard controls (revises W5/the born-bespoke fork)

- **WHAT.** The easing/spring playback buttons must match cube/amiga EXACTLY and RE-USE that
  component — delete the bespoke `ribbonContent`.
- **WHY (the user's ask).** "Why are these buttons different, and do not match the controls
  panel of the standard cube/amiga/animation controls? They should match EXACTLY, and RE-USE
  that component."
- **Root cause (R1/R2).** `EasingScene.vue:56-90` hand-rolls a `ribbonContent` render-fn — a
  `grid grid-cols-2` of a `Pause/Play` `<Button class="btn-playback btn-playback-accent">`
  (`:60-74`, borrows the standard accent skin) + a `Reset` `<Button class="h-8 w-full
  rounded-full gap-2 text-body btn-interactive">` (`:79-88`, a DIFFERENT class string, a
  DIFFERENT verb). NO scrubber, NO `Reverse`, NO `AnimationVisualizer` ball. It is a PARTIAL
  fork of the standard `PlaybackRibbon` (copied button #1's class, improvised button #2 with
  the standard's SECONDARY/Reverse class). `SpringScene.vue:95-…` carries the same fork shape.
  The easing scene has been bespoke since `f1d4fe6` — it NEVER reached the standard ribbon chain.
- **The standard component (R1, the normalization TARGET).** `PlaybackRibbon.vue` — a `Slider`
  scrubber (`:10-20`), a `grid grid-cols-2 gap-2 w-full` (`:24`) of `Play/Pause`
  (`.btn-playback btn-playback-accent`, `:26-33`) + `Reverse` (`:34-50`), and the
  `AnimationVisualizer` ball (`:53-60`). Mounted via teleport from
  `AnimationControlsControls.vue:163-177` into `#controls-ribbon-target`. The bottom-dock
  rainbow play/reset/trash (`AnimationMenuBar`) is ALREADY shared by every scene — the bespoke
  part is ONLY the in-sidebar/ribbon Pause/Reset.
- **Idiomatic approach (R3, path 1 PREFERRED — the gestalt close).** The easing demo ALREADY
  owns a `CSSKeyframesAnimation` + `NumericAnimation` + `AnimationGroup` + a `scenePlayback`
  adapter (`useEasingDemo.ts:12-15`, exposed at `EasingScene.vue:105`). **Surface the easing
  ball-traversal animation into the group under a `selectedAnimation`**, so
  `AnimationControlsControls` renders the SAME `PlaybackRibbon` (Play/Reverse + scrub +
  visualizer) it renders for cube — the transport becomes byte-identical to cube's because it
  IS cube's component. DELETE the hand-rolled PLAYBACK transport from `ribbonContent` (the
  Play/Pause + Reset cells — no legacy beside its replacement). This pairs with G4 (the ball in
  the group IS the stage visualizer — one transport, one ball, all engine — the inv ζ dogfood).
  **`ribbonContent` is NOT itself the defect (harden):** it is the STANDARD scene-extension slot
  (`RibbonBar.vue:96-101` `<slot :selected-control>`) that cube ITSELF uses for DOMAIN extras
  (`CubeScene.vue:157` — a Matrix Reset + a Lock/fixed toggle, ALONGSIDE the standard
  `PlaybackRibbon`, not replacing it). The defect is easing/spring put their PRIMARY playback
  transport INSIDE the slot instead of surfacing an animation; so only the PLAYBACK transport
  moves out. Spring's legitimate DOMAIN verbs (Reveal/Dismiss for the discrete sub-view,
  Re-seat — `SpringScene.vue:104-165`) MAY REMAIN as `ribbonContent` domain extras (the cube
  model).
  - **FLOOR (R3, if surfacing slips the wave):** consume `PlaybackRibbon` directly from
    `ribbonContent`, OR at minimum put BOTH buttons on the shared `.btn-playback` skin
    (`playback-button.css` is already a shared non-scoped partial — the intended reuse seam).
    Path 2 alone leaves a second ribbon in the tree (a partial G6 miss), so path 1 is the close.
  - **Reverse vs Reset (R3, a real reconcile).** The standard ribbon is Play/**Reverse**; the
    fork is Play/**Reset**. The bottom-dock menubar ALREADY owns Reset/Clear for every scene
    (`AnimationControlsGroup.vue:79-90`), so the ribbon Reset is DUPLICATIVE. **Normalize to
    Play/Reverse in the ribbon** (matching cube/amiga) and let the dock own Reset — matches the
    standard component AND removes a duplicate control (the "match EXACTLY" intent). The easing
    demo's `reset()` stays wired to the dock, not a second ribbon button.
- **Supersedes:** the born-bespoke `ribbonContent` fork (`f1d4fe6` lineage; W1 `256f6fe`
  introduced the scene wrapper). No prior CORRECT form to restore — the standard
  `PlaybackRibbon` is the recover target it should have used from inception. Precept-consistent:
  KISS·DRY — REUSE the standard component, do not re-skin a fork.
- **Gate — NEW `proof:scene-uses-standard-ribbon`** (covers G3 + G7). At `#/easing` and
  `#/spring` desktop, the scene's PRIMARY transport IS the standard `PlaybackRibbon` — assert a
  scrubber `Slider` IS present, the two transport cells are an EQUAL `grid-cols-2` of
  `.btn-playback`-skinned Play/Reverse buttons (same DOM/component identity as the cube ribbon —
  measure the ribbon's component class/structure equals cube's), an `AnimationVisualizer` ball IS
  present, and the hand-rolled Play/Pause+Reset PLAYBACK transport NO LONGER lives in
  `ribbonContent` (Play/Reverse, not Play/Reset). **NOT over-constrained (harden):** the gate
  does NOT forbid `ribbonContent` per se — cube uses it for domain extras (`CubeScene.vue:157`),
  and spring's Reveal/Dismiss/Re-seat domain verbs MAY remain there; what reds is the PRIMARY
  playback transport living in the slot instead of the standard ribbon. **Born-RED today:** reds
  on `EasingScene.vue:56-90` / `SpringScene.vue:95-183` (no `PlaybackRibbon`, no scrubber, no
  visualizer, unequal class strings, the Play/Pause+Reset transport hand-rolled in the slot).
  Settle-gated on H.W1; mirrors the `proof:scene-contract-identity` / `proof:single-column-pack`
  measurement plumbing.

### G4 — "Singular" duplicates the curve; the stage = ONE large engine ball (revises W5.S4)

- **WHAT.** Replace the easing `singular` stage (currently a SECOND copy of the curve editor)
  with ONE large animated ball traversing under the selected easing — the curve in MOTION.
- **WHY (the user's ask).** The "Singular" view-mode dropdown is "useless and duplicative" — it
  re-draws the SAME bezier curve the sidebar already shows. "Singular should NOT be a duplicated
  bezier view — it should be ONE large ball." AND "this main area card is not rounded either."
- **Root cause (R1/R2).** `EasingTarget.vue:146` defaults `viewMode = ref("singular")`; at
  `:47-59`, when `singular && isBezierEditable`, the stage renders a SECOND `EasingCurveCanvas`
  (`:editable="true"`) — the EXACT component the sidebar already shows at
  `EasingSidebar.vue:9-16`. Two copies of the curve editor on screen. For named/steps curves,
  `singular` shows a bare `<Slider>` (`:64-80`) — a hairline scrubber. W5.S4 PROMOTED the curve
  to the stage (`db90cbb`, +42 lines — "the easing curve promoted to stage") — exactly the
  duplicate the user now calls useless. The W5-era audit `a-scene-square-easing.md:236-252`
  caught this BEFORE the user (the singular pane = a 704×953 dead area for a 6px scrubber) and
  prescribed option-b = "a real animated subject (a box eased by the selected curve —
  dogfooding)" — IDENTICAL to G4.
- **The "ONE large ball" already exists (inv ζ, R1/R3).** The standard `AnimationVisualizer.vue`
  is the demo's canonical big traversing ball (`bg-accent-red rounded-full h-12 w-12` on a
  rail, `:21`, driven by `SmoothProgress`/`RAFPlayback`, `:47-49`). The easing multi-track rows
  ALREADY animate a ball via `getBallX(fn,…) = fn(progress)*maxX` (`EasingTarget.vue:236-241`)
  over the shared `.progress-ball`/`.progress-rail` idiom. The kit has the ball; the singular
  surface just doesn't use it.
- **Idiomatic approach (R3, path 1 PREFERRED — true dogfood).** Drive the singular ball off a
  REAL engine animation under the selected easing: the ball's `translateX` is the engine's
  `effectiveT` mapped through the selected timing function — i.e. the easing function BECOMES the
  animation's timing function and the ENGINE samples it (the strongest inv-ζ statement, reusing
  the same `AnimationVisualizer`/`NumericAnimation` primitives cube/amiga use). **Pairs with G3
  path 1:** the easing animation in the group → `PlaybackRibbon` mounts AND the stage ball IS
  the visualizer. **FLOOR:** keep `demo.progress` as the linear time axis and position one large
  `.progress-ball` via `fn(progress)*maxX` at hero size (the existing `getBallX` math). DELETE
  the duplicate stage `EasingCurveCanvas` (`:47-59`); the editable curve lives in the SIDEBAR
  only. The view dropdown: `singular` → the big ball; the comparison views (a family / All) MAY
  stay (genuinely additive — many curves at once), or reduce to Singular(ball) + All for max
  KISS (lead's call). The "main area card not rounded" twin = G2/G8 (the stage goes full-bleed).
- **Supersedes:** **W5.S4** (the easing curve promoted to the stage — the
  `:bezier-points`/`@update:bezierPoints` two-way wire that produced the `:47-59` duplicate).
  Precept-consistent: the curve EDITOR stays in the sidebar (one home); the STAGE shows the
  RESULT (the ball in motion) — de-duplication + the inv ζ dogfood; reconcile, don't fork.
- **Gate — NEW `proof:easing-stage-is-ball`.** At `#/easing` `singular`, the stage's primary
  element is a `.progress-ball`/`AnimationVisualizer` whose x-position TRACKS `fn(progress)`
  over time (sample two frames, assert the position changes), AND there is NO `EasingCurveCanvas`
  in the STAGE subtree (the duplicate curve is gone; the editable canvas exists ONLY in the
  sidebar). **Born-RED today:** reds on `EasingTarget.vue:47-59` (a second `EasingCurveCanvas`
  in the stage). Greens on the ball. Mirrors the `proof:easing-canvas-bounded` Playwright
  plumbing; settle-gated on H.W1.

### G5 — the easing sidebar controls should be LARGER (closed by G6)

- **WHAT.** Lift the easing sidebar's control sizing to the standard controls sidebar scale.
- **WHY (the user's ask).** "The easing sidebar controls should be LARGER" — too small vs the
  standard sidebar.
- **Root cause (R1).** `EasingSidebar` uses the TIGHTEST rungs in the system: `text-admin-label`
  labels (`:43,54,79`), `text-mono-caption` values (`:23,49,67,92`), `size="sm"` sliders (`:82`
  → 4px track / 12px thumb), `p-2`/`p-3` padding, `gap-1`/`gap-3`. The standard
  `AnimationControlsControls` uses `text-mono-small` labels, default-size controls, `px-4 py-3`,
  `gap-2`.
- **Idiomatic approach (R3).** G5 is CLOSED by G6 — when the easing sidebar adopts the standard
  `LabeledInput`/`LabeledSelect` rows + default control sizes (drop `size="sm"`, drop
  `text-admin-label`), the controls size up to the standard scale AUTOMATICALLY (DRY: same
  components → same sizes). NO per-control size override.
- **Supersedes:** rides on G6 (the bespoke sidebar's `size="sm"`/`text-admin-label` rung dies
  with the fork). Precept-consistent: REUSE the standard sizing tokens via the standard
  components, not a per-control magic.
- **Gate — folds into `proof:easing-sidebar-normalized` (G6).** Add a clause: the easing
  sidebar's control rung matches the standard sidebar's (Slider track height / input font-size
  equals the `AnimationControlsControls` value within tolerance). Reds on the `size="sm"` /
  `text-admin-label` tightness; greens on the normalized rows.

### G6 — too many inner-containers; FLATTEN + use a NORMALIZED component (revises W5 easing layout)

- **WHAT.** Flatten the easing sidebar's excess nesting and REUSE the standard controls sidebar
  component.
- **WHY (the user's ask).** "There are too many inner-containers here — FLATTEN this — match
  more of the normal controls sidebar — this should use a NORMALIZED COMPONENT."
- **Root cause (R1/R2).** `EasingSidebar.vue:2-97` nests a bare-class root `.easing-editor div`
  → `<h2>` + `EasingCurveCanvas` + THREE `<Card>/<CardContent>` wrappers (`:19,40` + steps) +
  ad-hoc `grid gap-1`/`flex gap-2` row containers — depth/forks the FLAT standard
  `Card>CardContent>panel-stack>panel-row>panel-content` (`AnimationControlsControls.vue:3-9`)
  of uniform `Labeled*` rows. The easing sidebar wraps each concern in its own Card + grid; the
  standard renders every field as ONE `Labeled*` row in one flow. Bespoke since `f1d4fe6`.
- **Idiomatic approach (R3).** ONE `Card surface="cartoon" tier="quiet"` (the H.W9 register)
  with `LabeledInput`/`LabeledSelect` label-left rows (the H.W9 F1 row idiom — see
  reconciliation) for css-value / steps / duration — DELETE the per-field sub-Cards (folding
  their fields into the parent Card; ~2 container levels per field gone). The editable bezier
  curve (`EasingCurveCanvas`) stays as the lone HERO element in the sidebar (the H.W9 F2
  bezier-panel idiom is the precedent — title + tight canvas). The duplicate STAGE curve dies
  (G4). Net G6 shape: one quiet-cartoon Card, label-left rows, the editable curve hero, NO
  per-field sub-Cards — "match more of the normal controls sidebar" literally. The same
  normalization extends to `SpringSidebar` (the parallel fork).
- **Supersedes:** the born-bespoke `EasingSidebar` AND `SpringSidebar` nested assemblies
  (`f1d4fe6`). **NAMED amendment to H.W9 S1:** H.W9 S1 adds `tier="quiet"` to
  `EasingSidebar.vue:19,40` (two inner Cards) AND `SpringSidebar.vue:4,60,81` (three inner
  Cards) — G6 DELETES all FIVE of those inner Cards, so the H.W9 EasingSidebar site-list SHRINKS
  to one parent Card AND the H.W9 SpringSidebar site-list SHRINKS to one parent Card; the
  `tier="quiet"` DECISION survives on each surviving parent Card, only the container COUNT drops.
  Precept-consistent: KISS·DRY — REUSE the standard sidebar, do not fork a second one; flatten by
  adopting the standard row primitive.
- **Gate — NEW `proof:easing-sidebar-normalized`** (covers G5 + G6). The easing (and spring)
  sidebar reuses the standard `AnimationControls(Controls)` rung: assert (a) the label rung is
  `text-mono-small` (not `text-admin-label`) + content padding `px-4 py-3` + no `size="sm"`
  slider (the G5 sizing clause); (b) BOUNDED nesting depth from the sidebar root to a leaf field
  (≤ the standard sidebar's depth — no ×3 sub-Card chain); (c) every field is a `Labeled*` row,
  not a hand-classed `grid gap-1` div. **Born-RED today:** reds on `EasingSidebar.vue`
  (`text-admin-label`, `p-2`/`gap-1`, ×3 `<Card>` + ad-hoc grids, `size="sm"`). Greens on the
  normalized sidebar. Settle-gated on H.W1.

### G7 — Pause/Reset (and Reverse) buttons must be the SAME width + height (dissolves into G3)

- **WHAT.** The transport buttons must be equal width + height.
- **WHY (the user's ask).** "These buttons should be the SAME WIDTH and HEIGHT, for pause/reset."
- **Root cause (R1/R2).** `EasingScene.vue:60-74` (Pause: `btn-playback btn-playback-accent` →
  `playback-button.css:16-24` `height:2rem; width:100%`) vs `:79-88` (Reset: `h-8 w-full
  rounded-full gap-2 text-body btn-interactive` — a SEPARATE class string). The `h-8` (2rem) ≈
  the `.btn-playback` height by COINCIDENCE, but the two paths are unrelated, so typography /
  padding / focus / `aria-pressed` states DIVERGE and any future tweak drifts them. The standard
  ribbon avoids this by construction: `PlaybackRibbon.vue:24` wraps BOTH cells in `grid
  grid-cols-2 gap-2 w-full` (equal-width tracks) and both carry `.btn-playback`
  (`height:2rem; width:100%`) — equal w/h by the LAYOUT IDIOM, not a per-button magic number.
- **Idiomatic approach (R3).** G7 DISSOLVES into G3 — reusing `PlaybackRibbon` (its
  `grid-cols-2` + shared `.btn-playback` skin) makes the buttons equal-size automatically, with
  NO hardcoded per-button width/height. The minimal floor (both buttons on `.btn-playback`)
  also closes it; the gestalt close is the standard ribbon.
- **Supersedes:** rides on G3 (the fork's two divergent class strings die with the
  `ribbonContent` deletion). Precept-consistent: equal-size via the layout idiom (the grid track
  + the one shared class), NOT an overfit per-button magic number (NO-overfit precept).
- **Gate — folds into `proof:scene-uses-standard-ribbon` (G3).** Add the EQUAL-DIMS clause: the
  two transport cells have equal `getBoundingClientRect()` width AND height (within tolerance) —
  a `proof:equal-transport-buttons`-equivalent assertion. **Born-RED today:** reds on the
  easing fork (divergent class strings → unequal box metrics under inspection). Greens on the
  standard ribbon's `grid-cols-2` + shared `.btn-playback`.

### G8 — the easing area CLIPS INTO THE DOCKS (a LAYOUT-PRIMITIVE change) (revises W3 stage track)

- **WHAT.** Fix the easing/spring stage overflowing past the affixed top/bottom docks — at the
  LAYOUT primitive (the `[stage]` track containment) AND/OR by dropping the stage card bg to
  full-bleed. No overfit, no hardcoded magic numbers.
- **WHY (the user's ask).** "The easing area CLIPS INTO THE DOCKS — reconcile this cleanly —
  perhaps remove the card bg from the easing area to better match how the cube/amiga/etc works?
  Or better contain the card between the two docks? Do so idiomatically, cleanly, and WITHOUT
  overfit, overcomplex hardcoded items. This should be a proper LAYOUT-LEVEL PRIMITIVE change."
- **Root cause (R1/R2).** The geometry chain: (1) the TOP `ChromeDock` (`fixed`,
  `ChromeDock.vue:108-109`) and the BOTTOM `AnimationMenuBar` (`fixed bottom:
  var(--work-area-bottom-offset)`, `AnimationMenuBar.vue:7`) each occupy a `--dock-band-reserve`
  band. (2) The `[stage]` track (`AnimationControlsGroup.vue:364`, `grid-template-rows: [top]
  auto [stage] 1fr [bottom] auto`) has NO dock inset — the `[top]` auto row collapses to 0 when
  the dock is `fixed` (out of flow), so `[stage] 1fr` spans nearly the full viewport UNDER both
  docks. (3) `dock-inset` (`design-idioms.css:498-500`) pads BOTTOM ONLY
  (`padding-bottom: var(--dock-band-reserve)`); the easing wrapper (`EasingTarget.vue:2`,
  `dock-inset`) has a `flex-1 min-h-0` child card (`:4`) that STRETCHES to fill — its TOP edge
  runs under the top dock. Spring is identical (`SpringScene.vue:2`/`SpringTarget.vue:2`).
  (4) cube/amiga DON'T clip because their subjects are CENTERED full-bleed in `.stage-cell`
  (`CubeScene.vue:2-15`, `AmigaScene.vue:6-9` — bare `canvas h-full w-full`), no card edge to
  clip. **Gate blind-spot:** `proof:stage-not-clipped` measures `.stage-cell` (the GRID CELL),
  NOT the easing CARD inside it, so the clip slips past today's gate (`:198-242`).
- **Idiomatic approach (R3, BOTH at their right altitude).**
  - **(1) PRIMITIVE (the binding layout fix, no magic numbers):** make the `.stage-cell` /
    `[stage]` track the SINGLE dock-safe containment envelope for ALL scenes. The grid's
    `[top] auto [stage] 1fr [bottom] auto` rows, sized to `--work-area-max-height`
    (`AnimationControlsGroup.vue:336-341`), are the dock-safe skeleton; the defect is easing/
    spring OPT OUT of it via `dock-inset` + `max-w-3xl` + a double-reserving card. Promote the
    dock-band reserve onto the `[bottom]`/`[top]` rows or onto a `--stage-*-inset` on
    `.stage-cell` derived from the EXISTING `--dock-band-reserve` / `--work-area-top-offset` /
    `--work-area-bottom-offset` tokens (`style.css:108-131`), then DELETE `dock-inset` from
    `EasingTarget.vue:2` + `SpringScene.vue:2`/`SpringTarget.vue:2`/`StartingStyleTarget.vue:3`
    — the band is reserved by the grid, once, for every scene (DRY; no per-scene class; zero
    hardcoded numbers — every term resolves to an existing token).
  - **(2) FULL-BLEED (the surface consequence):** the easing/spring stage drops its
    `glass-resting cartoon-surface` card → a transparent full-bleed subject in `.stage-cell`
    (the ball floats like the cube floats — `h-full w-full`, no card). This matches "how
    cube/amiga works" (the user's preferred lean), ALSO dissolves G2/G4's "main area card not
    rounded" (no card to round), and composes with G4 (the ball is the full-bleed subject) and
    G6 (the controls move to the standard sidebar, so the stage no longer needs to BE a panel).
    The `dock-inset`/`max-w-3xl`/extra-wrapper layers delete. (`max-w-3xl mx-auto` MAY stay as
    an optical max-measure for the comparison LIST only; the singular ball uses the full width.)
  - **Land BOTH:** (1) is the binding primitive (no future scene can clip the docks — the
    charter's "layout-PRIMITIVE, not a patch"); (2) is the easing scene CONSUMING it
    idiomatically (full-bleed like its siblings). modern-web grounding (R3): `css-layout §3`
    named-row header/main/footer skeleton; §7 `dvh`/`100%` for dock-aware containers (never
    `100vw`); the affixed-dock safe-area idiom = reserve via named rows + `env(safe-area-inset-*)`
    (already in `--dock-band-reserve`, `style.css:121`), NOT a per-component padding patch.
- **Supersedes:** the **W3 `[stage]`-track form** (`AnimationControlsGroup.vue:360-390` — it
  reserved the dock bands only implicitly via `--work-area-max-height`, leaving the per-scene
  `dock-inset` to patch the bottom; the top was never reserved) + the easing/spring `dock-inset`
  per-scene patch. Precept-consistent: a LAYOUT PRIMITIVE (the single containment envelope), not
  an overfit per-scene patch; reconcile with the `[stage]` track, don't fork; the full-bleed
  stage matches the sibling primitive (no prior full-bleed easing form existed — R2 — so the
  precedent to follow is the full-bleed siblings, a forward design call).
- **Gate — NEW/AMEND `proof:stage-within-docks`** (amends `proof:stage-not-clipped` to bite the
  CARD, not just `.stage-cell`). At `#/easing` and `#/spring` (desktop 1280/1440 + mobile), the
  stage SUBJECT's `getBoundingClientRect()` top is BELOW the top dock's bottom edge AND bottom
  is ABOVE the bottom dock's top edge (contained in the dock-safe band), AND a STATIC clause:
  ZERO `dock-inset` class in the easing/spring scene markup (the containment comes from the
  grid, not a per-scene patch). **Born-RED today:** reds (the `flex-1` card top runs under the
  top dock; `dock-inset` is present and pads bottom only — `design-idioms.css:498-500`). Greens
  on the primitive + full-bleed. Mirrors `proof:stage-not-clipped`'s viewport-containment
  plumbing; settle-gated on H.W1.

---

## §3 — The gate ledger (the born-RED bites H.W10 authors — each BITES today + cites a file:line/live anchor)

Gate-authoring home: per `H.W8.md §Scope` the gate-regime wave OWNS gate authoring; H.W10's NEW
born-RED clauses are wired into the `proof:*` set + `proof:all`, and the H.W8 `proof:visual-lock`
named-region matrix captures the H.W10 colorful-icon / normalized-easing / full-bleed-stage
GOLDEN state AFTER H.W10 lands. Every browser gate settle-gates on the H.W1 FSM resting.

| Gate | Item(s) | Disposition | BITE (born-RED on `tranche-h-impl` today → green on the H.W10 fix) |
|------|---------|-------------|---------------------------------------------------------------------|
| `proof:scene-icons` | G1 | **REVISE** (G1-SHAPE invert: drop no-baked-hue → assert expressive color; G4-THEMING replace: drop "stroke==host color"/dark≠light → assert SVG+inline+expressive+legible-on-both; KEEP coverage/no-raster/favicon-404) | the monochrome family TODAY (`assets/icons/easing.svg` et al., `stroke="currentColor"`, NO color token) reds the new expressive-color clause + the new "stroke≠host-color" clause; greens only on the colorful re-author |
| `proof:scene-card-rounded` | G2 | **NEW** (static + computed) | reds on `EasingTarget.vue:4`, `EasingSidebar.vue:2`, `SpringTarget.vue:4`, `StartingStyleTarget.vue:9`, `SpringScene.vue:8` (computed `border-radius:0` — bare `cartoon-surface`, no `rounded-card`); greens on the full-bleed stage (no card) + the Card-component sidebar (radius token resolves) |
| `proof:scene-uses-standard-ribbon` | G3 + G7 | **NEW** | reds on `EasingScene.vue:56-90` / `SpringScene.vue:95-183` (no `PlaybackRibbon`, no scrubber, no `AnimationVisualizer`, the PRIMARY Play/Pause+Reset transport hand-rolled inside `ribbonContent`, divergent class strings → unequal box metrics); greens when the PRIMARY transport IS the standard ribbon (scrubber + equal `grid-cols-2 .btn-playback` Play/Reverse cells + visualizer, same component identity as cube). Includes the G7 equal-w/h clause. NOT over-constrained: `ribbonContent` domain extras (cube's Matrix Reset/Lock at `CubeScene.vue:157`; spring's Reveal/Dismiss/Re-seat) are PERMITTED — only the PRIMARY playback transport must move to the standard ribbon. |
| `proof:easing-stage-is-ball` | G4 | **NEW** | reds on `EasingTarget.vue:47-59` (a second `EasingCurveCanvas` in the stage subtree); greens when the stage's primary element is a `.progress-ball`/`AnimationVisualizer` whose x tracks `fn(progress)` over time AND no `EasingCurveCanvas` is in the stage subtree |
| `proof:easing-sidebar-normalized` | G5 + G6 | **NEW** | reds on `EasingSidebar.vue` (`text-admin-label`, `text-mono-caption`, `size="sm"`, `p-2`/`gap-1`, ×3 `<Card>` + ad-hoc `grid gap-1` rows); greens on the standard rung (`text-mono-small`, `px-4 py-3`, default-size controls, bounded depth, `Labeled*` rows) |
| `proof:stage-within-docks` | G8 | **NEW/AMEND** (`proof:stage-not-clipped`) | reds today (the easing/spring `flex-1` stage card top runs under the top ChromeDock; `dock-inset` present + pads bottom only — `design-idioms.css:498-500`; the gate currently measures `.stage-cell`, missing the card); greens when the stage subject is bounded between the dock bands at 1280/1440 + mobile AND ZERO `dock-inset` class remains in the scene markup |

**The §Mandate bar — MUST bite, no vacuity.** Each gate asserts an EXACT live measurement or
static fact the lanes captured: the monochrome `stroke="currentColor"` icons, the `border-radius:
0` bare cartoon stages, the bespoke `ribbonContent` (no `PlaybackRibbon`/scrubber/visualizer +
unequal buttons), the second `EasingCurveCanvas` in the stage, the `text-admin-label`/`size="sm"`
tightness + ×3 sub-Card nesting, the `dock-inset`-bottom-only clip. None passes vacuously — the
REVISE inverts the icon assertions (monochrome reds, colorful greens), the NEWs each red TODAY
and green only on the H.W10 fix. No gate is satisfied by a `display:none`/`!important`
suppression — the duplicate curve dies because the subtree is DELETED, the buttons match because
they ARE the standard component, the stage is contained because the layout primitive reserves the
bands.

---

## §4 — The supersede-map (which landed W5/W3/W2 decision each item revises + why precept-consistent)

H.W10 SUPERSEDES specific landed decisions; this map is the honest ledger (editing the landed
wave docs' §Goal would rewrite the record of what was DECIDED vs what was REVISED).

| Item | Landed decision SUPERSEDED | The revision | Why consistent with the precepts |
|------|---------------------------|--------------|----------------------------------|
| **G1** | **W5.S2** — the survivor-SVG family authored `fill="none" stroke="currentColor"` monochrome (the easing `hsl(248…)`→`currentColor` flip) + the WV-W5-MED-2 "G4 is the authority, a baked hue FAILS" clause | re-color the 7 SVG assets (KEEP the W5 stroke geometry + `?component` substrate) painting from the demo's dual-theme `--rainbow-*`/`--accent-*`/`--color-progress` tokens (Form A) | W5 ITSELF named G1 as the superseder (the `db90cbb` commit body); the SUBSTRATE (inline-`<svg>` on the descriptor, coverage, no-raster, favicon-resolve) is KEPT — only the asset COLOR + the gate's monochrome-enforcement clauses reverse; `convertColors:false` already carries colorful SVGs unchanged (KISS, zero infra change) |
| **G2** | (no landed decision) the bare-class `cartoon-surface` stages miss `rounded-card` | full-bleed stage (no card to round — G8) / Card-component sidebar (inherits the radius token — G6) | REUSE the glass-ui `<Card>` primitive (one radius token), no ad-hoc `rounded-*` literal; dissolves into G6/G8 |
| **G3** | the born-bespoke `ribbonContent` fork (`f1d4fe6`/W1 `256f6fe`) — Play/Reset, a partial copy of `PlaybackRibbon` | surface the easing animation → mount the standard `PlaybackRibbon` (Play/Reverse + scrub + visualizer); delete the `h(...)` fork; Reset owned by the dock | KISS·DRY — REUSE the standard component, do not re-skin a fork; no legacy beside its replacement; Reset de-duplicated against the dock that already owns it |
| **G4** | **W5.S4** — the easing curve PROMOTED to the stage (the `:bezier-points` two-way wire, the `:47-59` duplicate-curve-on-stage) | the `singular` stage = ONE large engine-driven ball (`AnimationVisualizer`/`NumericAnimation`, inv ζ) under the selected easing; the editable curve stays in the sidebar | the EDITOR has one home (the sidebar); the STAGE shows the RESULT (the curve in motion) — de-duplication + the inv ζ dogfood; reconcile, don't fork; the W5-era audit (`a-scene-square-easing.md:236-252`) already prescribed this option-b |
| **G5** | the bespoke `EasingSidebar` `size="sm"` + `text-admin-label`/`text-mono-caption` rung (`f1d4fe6`) | adopt the standard `Labeled*` rows + default control sizes (closed by G6) | DRY — same components → same sizes; no per-control size override; REUSE the standard sizing tokens |
| **G6** | the born-bespoke `EasingSidebar` nested assembly (`f1d4fe6`) — ×3 `<Card>`-in-`<div>` + ad-hoc grids | ONE `Card surface="cartoon" tier="quiet"` with `Labeled*` label-left rows; the editable curve the lone hero; delete the per-field sub-Cards | KISS·DRY — REUSE the standard "NORMALIZED COMPONENT" the user named; **NAMED amendment to H.W9 S1** (the two inner Cards it set `tier="quiet"` on are deleted → the H.W9 EasingSidebar site-list shrinks to the single parent Card; the decision survives, the count drops) |
| **G7** | the fork's two divergent button class strings (`EasingScene.vue:60-74` vs `:79-88`) | equal w/h via the standard ribbon's `grid-cols-2` + shared `.btn-playback` skin (closed by G3) | NO-overfit — equal-size via the layout idiom (the grid track + the one shared class), not a per-button magic number |
| **G8** | the **W3 `[stage]`-track form** (`AnimationControlsGroup.vue:360-390`, dock bands not reserved on the track; the per-scene `dock-inset` patch — bottom only) | the `[stage]` track is the SINGLE dock-safe containment envelope (reserve via the EXISTING work-area/dock tokens, delete `dock-inset`) + the easing/spring stage drops its card bg → full-bleed like cube/amiga | a LAYOUT PRIMITIVE (the charter's "layout-LEVEL primitive, not a patch"), no hardcoded magic numbers (every term resolves to an existing token); the full-bleed stage matches the sibling primitive; reconcile with the `[stage]` track, don't fork |

---

## §5 — Reconciliation with H.W9 (the pending feedback wave F1–F9 — COMPOSE, do not contradict)

H.W10 changes the SAME rendered surfaces H.W9 tunes (the easing scene, the controls sidebar, the
icons, the stage). The composition seams (mirrors R1 §composition + R3 §composition):

- **H.W9 F1 (rows label-LEFT/value-RIGHT, ONE column) ⟂ H.W10 G6 (flatten + normalize the easing
  sidebar) — SAME DIRECTION, G6 CONSUMES F1.** F1 restores the intra-row `grid-cols-[auto_1fr]`
  split in the STANDARD `AnimationControlsControls`/`LayerConfigPanel` rows (H.W9 S3, the
  `AssetPropertiesPanel.vue:6` precedent), keeping ONE column. G6 says the easing sidebar should
  BE that standard sidebar — so normalizing easing onto the standard component (G6) makes it
  INHERIT F1's row shape for free (no second authoring). H.W10 EXTENDS F1's row idiom to
  `EasingSidebar`/`SpringSidebar` (which F1's site-list did not cover). **State: G6's
  normalization is the vehicle; F1 is the row idiom the normalized sidebar carries.**

- **H.W9 S1 (`tier="quiet"` on `EasingSidebar.vue:19,40` AND `SpringSidebar.vue:4,60,81`) ⟂
  H.W10 G6 (delete all five inner Cards) — NAMED AMENDMENT.** The G6 flatten REMOVES the two
  inner easing Cards AND the three inner spring Cards (folding their fields into one parent Card
  per sidebar). So the H.W9 EasingSidebar site-list SHRINKS from 2 inner Cards to 1 parent Card
  AND the H.W9 SpringSidebar site-list SHRINKS from 3 inner Cards to 1 parent Card. The
  `tier="quiet"` DECISION SURVIVES (each surviving parent Card carries it); only the container
  COUNT drops. **State as a named amendment to H.W9 S1's site inventory — H.W10's normalized
  surfaces INHERIT H.W9's quiet-cartoon register.**

- **H.W9 F2 (fit the bezier PANEL + bake the back into the header right) ⟂ H.W10 G4 (the easing
  STAGE = a ball) — DISTINCT SURFACES.** F2 fits the `TimingFunctionPanel`'s in-panel
  `EasingCurveCanvas` (the detail Card in the RAIL); G4 changes the easing SCENE STAGE
  (`EasingTarget`) from a duplicate curve to a ball. Different components, different fixes, no
  collision. BUT both involve a bezier canvas — the reconcile: the bezier CANVAS lives in (1)
  the standard controls detail panel (F2's tight in-panel ceiling) and (2) the easing SIDEBAR
  (the editable curve, G6). The STAGE shows the BALL (G4), NOT a bezier canvas. **State
  explicitly: ONE editable bezier canvas per host (panel + sidebar), ZERO on the stage — no
  third bezier-canvas instance.**

- **H.W9 F7 (cartoon shadow clearance inside the load-bearing CONTROLS-pane clip) ⟂ H.W10 G8
  (the STAGE-track containment) — COMPATIBLE, different clipping ancestors.** F7 is the
  `ControlsPaneWrapper` clip (the rail); G8 is the `[stage]` track (the stage). No conflict.

- **H.W9 ordering ("BEFORE H.W8's GOLDEN baseline") ⟂ H.W10 (the SAME surfaces).** H.W10 must
  ALSO land BEFORE the H.W8 golden capture, AFTER H.W9. **State the sequencing: H.W9 → H.W10 →
  the H.W8 golden capture**, so the lock captures the FINAL (colorful-icon, normalized-easing,
  full-bleed-stage) state. The H.W9 gates KEEP `proof:stage-not-clipped` + `proof:easing-canvas-
  bounded` unchanged — H.W10 AMENDS `proof:stage-not-clipped` to bite the easing CARD (G8) and
  composes with `proof:easing-canvas-bounded` (the editable canvas stays in the sidebar/panel,
  the stage is the ball).

**Fold-INTO-H.W9 recommendation (the explicit call).** RECOMMEND H.W10 as a SEPARATE wave for
the whole normalization cluster (G1–G8) — its gestalt (component+stage normalization +
expressive icons) is a distinct altitude from H.W9's material-register refinement, and two waves
keeps each supersede-map honest (§0). The ONLY fragment with genuine H.W9 overlap is the
`tier="quiet"` register the G6 sidebar inherits — handled as the NAMED H.W9 S1 amendment above,
not a merge. No item should move WHOLLY into H.W9.

---

## §6 — USER-DECISION forks (genuine forks needing the user's call)

Two genuine forks (everything else R1/R2/R3 are decisive on); both have a RECOMMENDED default
the IMPL wave adopts unless the user pivots:

- **FORK A — G8: contained-card vs full-bleed-no-bg.** The user offered both ("contain the card
  between the docks" OR "remove the card bg to better match cube/amiga"). **RECOMMENDED default:
  land BOTH at their right altitude** — the `[stage]`-track containment is the binding PRIMITIVE
  (it fixes the clip for ALL scenes, the charter's "layout-LEVEL primitive"), AND the easing/
  spring stage drops its card bg to full-bleed (the surface consequence — matches cube/amiga,
  the user's preferred lean, dissolves G2/G4 rounding, composes with the G4 ball). The pure
  contained-card-with-bg alternative is documented for the user's pivot only (it keeps a card to
  round — G2 then needs the Card-component route — and a card edge that can still graze the
  bands under content growth). **This fork needs the user's call ONLY if they reject full-bleed.**

- **FORK B — G1: the exact colorful idiom + per-primitive palette.** Form A (token-referenced
  `var(--rainbow-*)` fills — DRY, follows the demo palette, dual-theme for free) is RECOMMENDED;
  Form B (baked fixed vivid hues) is the fallback if `var()` proves brittle under SVGO. The
  per-primitive palette ASSIGNMENT (easing→violet, spring→green, sequence→blue, path→cyan,
  cube→orange/3-face-gradient, amiga→red, square→yellow) is a SUGGESTED map the lead/IMPL
  finalizes — a TUNING decision, not a hard fork (the binding decision is "fixed-vivid-per-icon
  from the demo palette, inline-referenced, NOT monochrome `currentColor`"). **The user MAY want
  to name the exact hues / whether to recover the killed PNG palettes literally (the
  magenta/yellow/red cube, the red-white checker amiga, the periwinkle square) vs the
  `--rainbow-*` token assignment** — flagged for the user's preference, default = the token map.

No other item needs a user decision — R1/R2/R3 are decisive on G2/G3/G4/G5/G6/G7 (the
component/stage normalization is the unambiguous KISS·DRY gestalt fix). The G4 stage-ball
implementation (engine-true path 1 vs the `getBallX` floor path 2) and the view-dropdown reduction
(keep Singular+family+All vs Singular+All) are MEASURE-FIRST/lead tuning calls set during impl,
not user forks.

---

## §7 — Sequencing (the convergent landing within H.W10)

1. **G1 (expressive icons) — independent.** Re-color the 7 SVG assets (Form A token fills);
   REVISE `proof:scene-icons` (G1-SHAPE invert + G4-THEMING replace). The standalone axis; no
   dependency on the scene-normalization spine.
2. **G3 + G7 (the standard ribbon) — the spine, first among the scene cluster.** Surface the
   easing/spring animation into the group → mount the standard `PlaybackRibbon`; delete the
   bespoke `ribbonContent`. Closes G3 (match) + G7 (equal-size) together.
3. **G4 (the stage ball) — pairs with G3.** The surfaced animation's visualizer IS the
   full-bleed stage ball; delete the duplicate stage `EasingCurveCanvas`.
4. **G6 + G5 (the normalized sidebar) — composes with H.W9 F1/S1.** Flatten `EasingSidebar`/
   `SpringSidebar` onto the standard `Card surface="cartoon" tier="quiet"` + `Labeled*` label-
   left rows (inheriting H.W9's row idiom + quiet register); the control sizing lifts (G5)
   automatically. Closes G2's sidebar-square-corner (the Card component carries `rounded-card`).
5. **G8 + G2 (the stage layout-primitive) — the binding primitive, lands last among scenes.**
   The `[stage]`-track containment envelope (reserve via the existing tokens, delete
   `dock-inset`) + the easing/spring stage drops its card bg → full-bleed. Closes G2's
   stage-square-corner (no card to round).

**All AFTER H.W9, BEFORE H.W8's GOLDEN `proof:visual-lock` baseline capture** (so the colorful
icons / normalized easing+spring / full-bleed contained stage are what the named-region matrix
locks). The born-RED clauses (the 5 NEW gates + the 1 REVISE) red TODAY on `tranche-h-impl`,
green on the H.W10 fixes — every gate BITES and cites a `file:line`/live anchor.

---

## §8 — Anchor index (every file:line cited; verified against HEAD `db90cbb` live source)

- **G1:** `assets/icons/easing.svg` (live monochrome) + `assets/icons/{cube,amiga,square,spring,
  sequence,motion-path}.svg` · `demo/app/scenes.ts:8-14,40,88-141` · `demo/@/components/custom/
  dock/ChromeDock.vue:172,195,211` · `vite.config.ts:190-205` (`convertColors:false`) ·
  `demo/@/styles/design-idioms.css:46-58` (the `--rainbow-*` palette) ·
  `demo/@/components/custom/animation-controls/AnimationControlsGroup.vue:98-108`
  (`#rainbow-gradient` def) · `scripts/proof-scene-icons.mjs:17-23` (G1-SHAPE), `:40-57`
  (G4-THEMING), `:25-31` (G2-COVERAGE), `:32-38` (G3-NO-RASTER) · killed:
  `git show 74abd2b:assets/icons/{cube,amiga,square}-icon-{sm,lg}.png`,
  `git show db90cbb^:assets/icons/easing-icon-sm.svg`
- **G2:** `@mkbabb/glass-ui/dist/styles/cards.css:30-48` · `@mkbabb/glass-ui/dist/
  CardFooter-C390imy7.js:37` · `demo/easing/EasingTarget.vue:4` · `demo/easing/
  EasingSidebar.vue:2,19,40` · `demo/spring/SpringTarget.vue:4` · `demo/spring/
  StartingStyleTarget.vue:9` · `demo/app/scenes/SpringScene.vue:8`
- **G3:** `demo/app/scenes/EasingScene.vue:56-90,105` · `demo/app/scenes/SpringScene.vue:95-…,183`
  · `demo/@/components/custom/animation-controls/controls/PlaybackRibbon.vue:10-20,24,26-33,34-50,
  53-60` · `…/controls/AnimationControlsControls.vue:163-177` · `…/controls/playback-button.css:16-24`
  · `…/AnimationControlsGroup.vue:79-90` (dock Reset/Clear) · `demo/easing/useEasingDemo.ts:12-15`
- **G4:** `demo/easing/EasingTarget.vue:47-59,64-80,146,236-241` · `demo/easing/
  EasingSidebar.vue:9-16` · `…/controls/AnimationVisualizer.vue:21,47-49` ·
  `demo/@/styles/design-idioms.css:413-424` (the `.progress-ball`/`.progress-rail` idiom) ·
  `docs/tranches/H/audit/a-scene-square-easing.md:236-252` (the prior root-cause + option-b)
- **G5:** `demo/easing/EasingSidebar.vue:23,43,49,54,67,79,82,92` vs
  `…/controls/AnimationControlsControls.vue:4` (`px-4 py-3`)
- **G6:** `demo/easing/EasingSidebar.vue:2-97` vs `…/controls/AnimationControlsControls.vue:3-9` ·
  `…/components/ControlsPaneWrapper.vue` · `…/controls/AnimationControls.vue` · `demo/spring/
  SpringSidebar.vue`
- **G7:** `demo/app/scenes/EasingScene.vue:60-74,79-88` · `…/controls/PlaybackRibbon.vue:24` ·
  `…/controls/playback-button.css:16-24`
- **G8:** `demo/@/styles/design-idioms.css:498-500` (`dock-inset` bottom-only) ·
  `…/AnimationControlsGroup.vue:336-341,360-390` (`.controls-layout` + the `[stage]` track) ·
  `…/dock/ChromeDock.vue:108-109` (top dock fixed) · `…/AnimationMenuBar.vue:7` (bottom dock
  fixed) · `demo/@/styles/style.css:108-131` (`--work-area-*-offset`, `--dock-band-reserve`) ·
  `demo/easing/EasingTarget.vue:2,4` · `demo/spring/SpringScene.vue:2` · `demo/spring/
  SpringTarget.vue:2` (dock-inset) · `demo/spring/StartingStyleTarget.vue:3` · `demo/app/scenes/
  CubeScene.vue:2-15` · `demo/app/scenes/AmigaScene.vue:6-9` · `scripts/proof-stage-not-clipped.mjs:198-242`
- **The standard component (G2–G7 spine):** `…/AnimationControlsGroup.vue:335-390` · `…/components/
  ControlsPaneWrapper.vue` · `…/controls/AnimationControls.vue` · `…/controls/
  AnimationControlsControls.vue:3-9,163-177` · `…/components/RibbonBar.vue:3,7` · `…/controls/
  PlaybackRibbon.vue` · `…/controls/AnimationVisualizer.vue`
- **H.W9 reconcile:** `docs/tranches/H/waves/H.W9.md` (§Scope S1/S3/S4, §Hard gate, §supersede-map,
  §sequencing) — F1 (S3, rows), S1 (`tier="quiet"` sites incl. `EasingSidebar.vue:19,40`), F2 (S4,
  bezier panel), F7 (S2, controls-pane shadow clip)
- **Research lanes:** `g-r1-source-rootcause.md`, `g-r2-git-archaeology.md`, `g-r3-reconcile.md`
