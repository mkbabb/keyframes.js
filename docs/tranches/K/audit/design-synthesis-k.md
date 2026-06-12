# Tranche K — Audit Lane: design-synthesis-k.md

**Lane:** THE design-language synthesis — per-pane hierarchy verdicts, the
suffusion gap map, the glass-ui ADOPT/REFINE/ABSTRACT tables. DOCS ONLY (no
source/test/gate/CI edits).
**Branch:** `tranche-j-dev` == `master` @ `4f1fc4c` (Tranche J closed; 4.2.0).
**Method:** screenshots over the BUILT dist (`dist/gh-pages`, built Jun 11
23:52) via `scripts/lib/demo-driver.mjs withPage`,
`KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/glass-ui`, Chromium headless;
computed-style facts via `page.evaluate(getComputedStyle)`; the glass-ui 3.13.0
surface read from the currency-lane tarball at
`/tmp/glass-ui-3.13.0/package/dist/`. Re-runnable harness:
`docs/tranches/K/audit/design-synthesis-probe.mjs` + `ds-probe2.mjs`.
**Screenshots:** `screenshots-k/ds-{hero-desktop,hero-wide-2560,hero-mobile,
cube-controls-desktop,cube-controls-mobile,spring-desktop,spring-mobile}.png`.

**Relation to sibling lanes (verify + extend, do NOT duplicate):**
- `styling-typography-k.md` owns the font-voice authority (the `--font-serif`≡
  `--font-display` dual-token root, the `.dock-label` sans fall-through). I CITE
  its roots where a pane verdict needs them; I do not re-derive them.
- `live-glassui-currency.md` owns the 3.11.2→3.13.0 re-pin mechanics. I read the
  3.13.0 surface FROM its tarball and name the ADOPT targets; I do not re-audit
  the re-pin.
- `live-dock-tabs-selects.md` owns U-K12/U-K16 (tabs-vs-pills + single-option
  totality). I extend it with the VISUAL hierarchy verdict (the green/serif
  register problem), not the count-guard.
- `live-session-gap-analysis.md` owns the cold-path P0 (U-K2/K3/K5) and the
  amiga liveness (U-K4). Those are ENGINE defects, out of this lane; I record
  only the DESIGN consequence (a frozen subject reads as a hierarchy failure).

---

## §0 — THE ONE-LINE SYNTHESIS

The demo has a **coherent display-language at the HERO** (giant Instrument-Serif
title + rainbow cube + two-tier graph-paper grid + the glass pill dock) that
**does not propagate inward**. Every control pane drops to a flatter, greener,
more uniform-but-quieter register that (a) loses the audacious-typography pop,
(b) swaps the hero's RED-dashed motion-language for a disliked GREEN, (c) gives
equal visual weight to chrome and to data, and (d) does not re-cluster on
pathological widths. The fix is not per-pane patching — it is **propagating the
hero's three signals (serif display, red-dashed motion ball, math-grid
substrate) into the panes as a deliberate tier ladder**, then adopting four
3.13.0 primitives that already encode that ladder (`MetricCell`/`MetricStack`
appearance tiers, `SegmentedTabs variant="pill"`, `Configurator`, `DockRail`).

---

## §1 — PER-PANE HIERARCHY VERDICTS

Each pane is graded on the **tier contract**: is there exactly ONE loud element
(the display anchor), a clear MID tier (the primary control), and a QUIET tier
(secondary data/chrome)? A pane fails when tiers collapse (everything equal
weight) or invert (chrome louder than content).

### 1.1 HERO / start screen — VERDICT: COHERENT (the reference)
Screenshot `ds-hero-desktop.png`; facts: `h1` = `"Instrument Serif"`
**177.4px** (the live computed size — an enormous, correct display anchor),
`color rgb(28,25,23)`; the dock = `border-radius: 9999px`, `backdrop blur(11px)`,
`bg srgb …/0.3` (the glass pill). The rainbow cube is the colorful pop; the
two-tier graph grid is the math substrate.
- **LOUD:** the serif title (177px). **MID:** the cube + axes. **QUIET:** the
  prose subtitle (sans) + dock. Tier ladder is INTACT. This is the only pane
  that fully honors the design language — it is the template the others must
  inherit.
- **One defect (U-K20):** a `<FourierField>` canvas mounts bottom-left
  (`ds-hero-desktop.png` shows the rect `{w:416,h:252,x:24,y:654}` — a stray
  canvas under the grid). The user wants it removed; the hero lane owns the
  removal. DESIGN note: it competes with the grid substrate for the "math
  texture" role — two math-backgrounds is one too many; the grid alone is the
  stronger, quieter choice.

### 1.2 CUBE control pane (the MAIN-controls grammar) — VERDICT: MID, the BEST inner pane
Screenshot `ds-cube-controls-desktop.png`. This is the richest, most-correct
control surface and the SOURCE of the language the other panes should copy:
- The **left controls card**: mono labels (`duration`/`delay`/`iterations`) in a
  uniform label column, glass input pills (`bg …`, `radius 9999px`,
  `backdrop blur`). Clean MID/QUIET separation.
- The **playback ribbon** (the U-K17 ANCHOR, see §3): solid **RED** scrub thumb
  (`bg-accent-red`, `AnimationVisualizer.vue:21`) + a **dashed red destination
  twin** (`border-2 border-dashed border-accent-red/40`,
  `AnimationVisualizer.vue:35`). THIS is the motion-language the user prefers —
  it already exists here.
- The **bottom transport dock**: "Rotations" dropdown + reset/trash icons +
  rainbow play. The icon-family + rainbow CTA are the colorful pops.
- **DEFECTS:** (1) the "Pause" label is SERIF, the sibling "Reverse" is SANS in
  the same `grid-cols-2` row (U-K10 — rooted by the typography lane at
  `playback-button.css:22`). (2) The scrub track above the ribbon is GREEN
  (`.timeline-green`, `PlaybackRibbon.vue:156`) — the disliked green INSIDE the
  same ribbon that carries the preferred red ball. **Red ball + green track in
  one control is the core incongruence (§3).** (3) No display-tier element: the
  pane has no serif anchor, so it reads as all-MID/QUIET — acceptable for a dense
  control card, but it means the hero's voice dies at the pane boundary.

### 1.3 SPRING pane — VERDICT: FAIL (flattened, green-saturated, no display anchor)
Screenshots `ds-spring-desktop.png` + `ds-spring-mobile.png` (the mobile shot is
the legible one — it shows the full content). This is the pane the user calls
inadequate (U-K11/K13/K16) and it is the worst hierarchy offender:
- **Everything is one tier.** The "Live solver / Discrete transition" tab strip,
  the `response`/`damping` sliders, the 2×2 preset grid (Smooth/Snappy/Bouncy/
  Gentle), and the `linear()`/`@keyframes` code block all sit at the same visual
  weight in a single quiet `Card surface="cartoon" tier="quiet"`
  (`SpringSidebar.vue:22`). There is no loud anchor, no clear primary.
- **Green saturation (U-K17).** Every active affordance is the disliked green:
  the slider thumbs (`--slider-thumb-bg: var(--color-progress)`,
  `PlaybackRibbon.vue:159` register; `--color-progress: hsl(142 71% 45%)`,
  `style.css:275`), the preset-cell active ring (`shadow-[inset_0_0_0_1px_
  var(--color-progress)]`, `SpringSidebar.vue:80`), and the in-cell track balls
  (`--ball-tone, var(--color-progress)`, `design-idioms.css:465`). The big
  central "SpringProgress" panel's solver ball is ALSO green
  (`ds-spring-desktop.png`).
- **The "two panes look awful" (U-K13).** On desktop the spring scene splits
  into a CRAMPED left sidebar (the whole `SpringSidebar` squeezed into ~290px,
  tiny labels + a jammed code block) and a LARGE near-empty central
  "SpringProgress" stage panel with one green dot. The information is
  inverted — the dense editable controls get the small pane, the low-information
  readout gets the big pane (U-K18).
- **"No proper keyframes editor" (U-K11/K16).** The `@keyframes` artifact is a
  READ-ONLY 5-stop generated string in a tiny `CSSCodeEditor` (`height:132px`,
  `SpringSidebar.vue:118-125`) — it DISPLAYS a keyframes block but offers no
  per-stop editing, no visual curve, no add/remove. It is an artifact viewer, not
  an editor. The cube scene HAS a real `KeyframesEditor`/`KeyframeTimeline`
  (`animation-controls/keyframes/` + `/timeline/`); the spring scene does not
  reuse it.
- **The artifact "underline" tab fork (U-K13) reads as an unlabeled divider** —
  `variant="underline"` at `text-mono-caption` (`SpringSidebar.vue:113` +
  scoped `:282`) is so quiet it doesn't register as a control (the dock-tabs lane
  §1 names this).

### 1.4 EASING / SQUARE / SEQUENCE / MOTION-PATH panes — VERDICT: UNVERIFIED-BLANK
Screenshots `ds-{easing,square,sequence,motionpath,amiga}-desktop.png` rendered
**blank white** — a concurrent rebuild emptied `dist/gh-pages` mid-run (the probe
threw `ENOENT …/index.html` on the easing leg; the cold-path lane independently
proves the cube renders, so the blanks are a HARNESS artifact under concurrent
builds, NOT a per-scene render proof). I therefore do NOT assert a hierarchy
verdict on these from pixels. SOURCE-level note (not a live verdict): the easing
gallery + square share the same green `--color-progress` ball idiom
(`design-idioms.css:455-466`), so the green-saturation finding (§3) generalizes
to them by construction. U-K5 ("none of the animations work properly /square")
is an ENGINE finding owned by the cold-path lane (frozen subject = engine off),
not a design defect — recorded for the fold, not graded here.

### 1.5 PATHOLOGICAL WIDTH (2560px) — VERDICT: FAIL (no max-cluster)
Screenshot `ds-hero-wide-2560.png`. At 2560px the title stays left-pinned at its
default size, the cube + axes float centered, and the dock pills shrink to tiny
stranded islands at the top-center and bottom-center. **Nothing clusters past a
max-width** (U-K7): the dock + controls do not converge into a bounded cluster;
they just float in a sea of grid. The hero serif does NOT scale up to fill the
wider canvas (it is a fixed `clamp` ceiling, not container-driven). This is the
single clearest U-K7 evidence: the layout has no `max-inline-size` cluster
container and no `container`-query fluid type for the audacious-display axis.

### 1.6 MOBILE (390px) — VERDICT: ACCEPTABLE structure, INHERITS the green/serif defects
Screenshots `ds-hero-mobile.png`, `ds-cube-controls-mobile.png`,
`ds-spring-mobile.png`. The mobile stacking is sound (the controls sheet rises
from the bottom, the dock is a bottom pill). But: the mobile dock-band shows the
SAME serif/sans split (the "Cube" pill is serif, the transport labels sans), the
spring presets are still green-ringed, and the controls sheet on cube
(`ds-cube-controls-mobile.png`) clips the controls card under the subject — the
duration/delay rows are half-covered by the cube. Mobile is structurally OK but
carries every register defect.

---

## §2 — THE SUFFUSION GAP MAP

The user's directive: suffuse **glass / grid / math / large-audacious-typography
/ colorful-pops-from-icons** within proportion. The map below grades each
suffusion axis: where it LIVES, where it DIES, and the gap.

| Suffusion axis | Lives (strong) | Dies (gap) | The gap, named |
|---|---|---|---|
| **Glass** (backdrop-blur translucent surfaces) | The docks (`backdrop blur(11px)`, `radius 9999px`), the spring readout badge (`backdrop blur(10px) saturate brightness`), input pills | The control CARDS render `bg rgba(0,0,0,0)` / `backdrop none` (`ds-cube` controls-panel fact: `backdrop:"none"`) — the big panes are FLAT, not glass | **The chrome is glass; the content panels are not.** Glass should mark the floating/transient tier (docks, popovers); the dense panes are correctly opaque — BUT the spring central "SpringProgress" stage panel is a large flat card that reads as dead space. It wants either glass-lift or demotion. |
| **Grid / math substrate** | The hero + every scene's two-tier graph-paper (`--graph-pitch 1rem` / `--graph-major 5rem`, `EditorShell.vue:202`) + the cube's dashed XYZ axes | Inside the panes the math texture vanishes — the spring `linear()`/`@keyframes` are TEXT, not a plotted curve; the easing curve canvas exists but the spring scene has no curve plot | **The math is decorative (background grid) but never functional (no curve/phase plot in the spring/control panes).** The biggest pop-from-math opportunity — plotting the spring displacement curve over the grid — is unused; the spring shows a number, not a graph. |
| **Large audacious typography** | ONLY the hero `h1` (177px serif) and scene-card numbers | EVERY pane: the loudest pane text is `~16-20px`. The "SpringProgress" panel title is a modest serif at body-ish size; no pane has a display anchor | **The audacious type is a hero-only event.** There is no display-tier inside any pane. A pane's primary readout (the live spring displacement, the cube's current frame %) deserves a `MetricCell`-style big-number in the display voice — that is the propagation the design language is missing. |
| **Colorful pops from icons** | The rainbow play CTA (the taste anchor), the scene-pill icons (cube/spring glyphs), the reset/trash icons | The icons are monochrome-on-glass EXCEPT the rainbow play; no other accent color punctuates the panes; the one non-grey color INSIDE panes is the disliked GREEN | **The only in-pane color is the wrong color (green).** The icon family is the sanctioned color source; the panes should borrow icon-hue accents (or the red-dashed motion hue) rather than introducing a separate green progress palette. |
| **Proportion / restraint** | The hero respects it (one loud thing) | The spring pane violates it (everything equal) + the wide-screen layout violates it (no max cluster) | **Proportion holds at the hero, breaks at the panes.** The fix is the tier ladder + a max-cluster container (§1.5). |

**The synthesis of the gap map:** the five axes all LIVE at the hero and all DIE
at the same boundary — the pane edge. There is a missing **"pane suffusion
contract"**: when a pane mounts, it should inherit (1) a display-voice anchor for
its primary datum, (2) the red-dashed motion language for any progress/ball, (3)
a functional math-plot where it currently shows a number, (4) icon-hue accents
instead of the green palette. Today the panes inherit NONE of these.

---

## §3 — THE U-K17 INCONGRUENCE: GREEN vs RED-DASHED (the load-bearing color finding)

This is the single highest-leverage design unification, and it is verifiable to
the line:

- **The user's PREFERRED anchor already exists** in the main-controls
  AnimationVisualizer: a **solid red** ball (`bg-accent-red`,
  `AnimationVisualizer.vue:21`) chasing a **dashed-red destination twin**
  (`border-2 border-dashed border-accent-red/40 bg-accent-red/15`,
  `AnimationVisualizer.vue:35`). Visible in `ds-cube-controls-desktop.png` (the
  bottom ribbon: filled red dot at center, dashed-outline circle at right). This
  is exactly the "main-controls red with dashed outline for the final state" the
  user named.
- **The disliked GREEN** is a SEPARATE palette: `--color-progress: hsl(142 71%
  45%)` (`style.css:275`) drives the spring slider thumbs, the preset-cell active
  ring (`SpringSidebar.vue:80`), the progress-ball idiom default
  (`design-idioms.css:455,465`), and the scrub track `.timeline-green`
  (`PlaybackRibbon.vue:156`).
- **The incongruence in ONE control:** the cube playback ribbon carries the RED
  ball ON a GREEN track — two motion-color languages in one widget
  (`ds-cube-controls-desktop.png`).

**The unification (a token-level fix, like the typography lane's display
collapse):** the demo has TWO motion-color identities (red-dashed for the
visualizer, green-progress for sliders/balls/presets). The user wants ONE — the
red-dashed. The seam is `--color-progress` / `--color-slider-track` /
`--ball-tone` (`style.css:275-296`, `design-idioms.css:455-466`): repoint them to
the `--accent-red` family (and make the "settled/final" state the dashed-outline
treatment everywhere, mirroring `AnimationVisualizer.vue:35`). This is the
spatial-color analog of the typography lane's "ONE display token" fix: **ONE
motion-color authority, the red-dashed, suffused across every ball/track/ring.**

---

## §4 — glass-ui ADOPT / REFINE / ABSTRACT (against the 3.13.0 surface)

All targets verified present in `/tmp/glass-ui-3.13.0/package/dist/`. These
presuppose the re-pin the currency lane owns (`~3.11.2 → ~3.13.0`); the design
value of each is named here.

### 4.1 ADOPT — new 3.13.0 primitives the panes should consume

| Primitive (subpath) | Surface evidence | What it fixes | Maps to |
|---|---|---|---|
| **`MetricCell`** (`./metric-cell`) | `MetricCellProps { icon, label, value, unit, appearance }`; `appearance: "dashboard"\|"compact"\|"bare"` (`metric-cell/MetricCell.vue.d.ts`) | Gives a pane a DISPLAY-tier big-number readout with an icon-color pop, in three explicit weight tiers — the missing "audacious type in the pane" (§2). `dashboard` = the loud anchor; `compact` = the quiet readout; `bare` = host-styled | U-K18 (hierarchy w/ less useless info), §2 type gap |
| **`MetricStack` / `MetricRow`** (`./metric-stack`) | `MetricRowProps { icon, label, value, unit, phaseColor, digitCount, colorTinted, active }`; container-queried (`@container metric-stack (min-width: 32rem)`, `metric-stack/*.d.ts`) | A single primitive for the spring scene's "two readout panes" (U-K13/K18) — one tinted, container-responsive stack replaces the cramped sidebar + the empty stage-panel readout split. `phaseColor` is the icon-hue accent hook (§2 color gap) | U-K13, U-K18 |
| **`SegmentedTabs variant="pill"`** (`./tabs`) | `SegmentedTabsVariant = "segmented"\|"pill"\|"underline"` (`tabs/SegmentedTabs.vue.d.ts`); new `segmented-tabs.css` with the liquid `--stretch` indicator | The user's "pills if tabs at all" (U-K12). The spring view switcher currently uses `variant="segmented"` and the artifact fork uses the near-invisible `variant="underline"` (`SpringSidebar.vue:33,113`); both should move to `pill` for a legible, on-brand chip | U-K12, U-K13 |
| **`Configurator`** (`./configurator`) | `Configurator.vue` + `ConfiguratorRow.vue` + `ConfiguratorLayer.vue` + `density.d.ts` + `useConfiguratorState` (`configurator/*.d.ts`) | A density-aware row-based parameter editor — the structural answer to "no proper keyframes editor / real options" (U-K11/K16). The spring params + per-stop keyframe rows fit the Configurator row grammar instead of the ad-hoc `labeled-field-grid` + read-only code block | U-K11, U-K16 |
| **`DockRail`** (`./dock`) | `DockRail.vue { items, v-model:context, @advance }` renders OUTSIDE the dock clip aperture (currency lane §3.7) | Multi-context dock navigation without inflating the dock box — the structural seam for the U-K7 dock/controls cluster refinement and the U-K12 "dock-dropdown items instead of tabs" | U-K7, U-K12 |

### 4.2 REFINE — glass-ui idioms the demo ALREADY uses but renders sub-optimally

| Idiom (in use) | Current use | Refinement |
|---|---|---|
| **`ToggleChip variant="cell"`** (`./toggle-chip`) | Spring preset cells (`SpringSidebar.vue:74-97`) ringed in GREEN (`--color-progress`) | Repoint the active ring to the red-dashed motion authority (§3); the cell's own track ball (`design-idioms.css:465`) follows the same token. The chip GRAMMAR is right; the COLOR is wrong |
| **`SegmentedTabs`** (`./tabs`) | Spring view + artifact (`SpringSidebar.vue:29,110`) at serif-leaking font + underline-too-quiet | `variant="pill"` (§4.1) + ensure the tab font resolves the controls register (not the serif leak the typography lane roots at `tab-trigger.css:28`) |
| **`Card surface="cartoon" tier="quiet"`** (`@mkbabb/glass-ui`) | The whole spring panel is ONE quiet card (`SpringSidebar.vue:22`) — tiers collapse | Split into tiers: a `tier` loud header card (the MetricCell anchor) + a `quiet` body. The single-card-for-everything is what flattens the hierarchy (§1.3) |
| **`MetricBadge`** (`./metric-badge`) | Spring header readouts (`SpringTarget.vue:31-39`) | Promote the PRIMARY datum from a small badge to a `MetricCell appearance="dashboard"` big-number; keep `MetricBadge` for the QUIET secondaries. Today both the primary and secondary are the same small badge size (U-K18) |
| **The graph-paper grid** (`EditorShell.vue:202`) | Background-only decoration | Make it FUNCTIONAL in the spring/easing panes: plot the curve over the same grid (the easing scene's `EasingCurveCanvas` proves the demo can do this) — closes the §2 math gap |

### 4.3 ABSTRACT — patterns the demo hand-rolls that glass-ui should own (gap report)

| Demo hand-roll | Where | What glass-ui SHOULD own (the abstraction gap) |
|---|---|---|
| **The progress-ball + dashed-destination motion language** | `AnimationVisualizer.vue:21,35`, `design-idioms.css:455-466` (red AND green variants hand-CSS'd) | A glass-ui **`MotionBall`/progress-ball primitive** with a `state: "active"\|"settled"` and a single `tone` token — so the red-dashed vs green-progress split (§3) cannot recur. Today every scene re-CSS's the ball; the dashed-rest treatment lives only in one component |
| **The `.labeled-field-grid` uniform-label subgrid** | `design-idioms.css §LABEL-subgrid`, consumed by spring/cube/easing | The `Configurator` row grammar (§4.1) is glass-ui's version — the demo's hand-rolled subgrid should be ABSTRACTED onto it (the 3.13.0 `ConfiguratorRow` + `density` is exactly this), removing the demo-owned idiom |
| **The two-tier graph-paper substrate** | `EditorShell.vue:202-224` + 4 `--graph-*` tokens | glass-ui ships `paper-backdrop` (`./paper-backdrop`) — the demo's hand-rolled grid could ABSTRACT onto it (or `paper-backdrop` should gain the two-tier major/minor pitch the demo needs). Gap: `paper-backdrop`'s API vs the demo's `--graph-pitch`/`--graph-major` two-tier needs verification before adopt |
| **The serif-on-dock-pill override** | `ChromeDock.vue:300` `.dock-scene-title { font-family: var(--font-display) }` | glass-ui's `.dock-label` has NO family knob (typography lane §2) — glass-ui SHOULD expose a `--dock-label-font` token so the display-voice dock (U-K6) is a consumer token, not a demo CSS override. This is a glass-ui ROOT gap (per MEMORY: dock/font root changes belong in glass-ui, not the demo) |
| **The `linear()`/`@keyframes` artifact viewer** | `SpringSidebar.vue:118` read-only `CSSCodeEditor` | glass-ui ships `motion-curves` with `SPRING_PRESETS` + `useLiquidFlex` (currency lane §3.6) — the spring scene should ABSTRACT its preset registry + curve sampling onto it rather than hand-rolling `springTimingFunction` sampling in the Vue component |

---

## §5 — THE TASTE-ANCHOR LEDGER (the four the user named, verified)

| Anchor | Status in the built tree | Action |
|---|---|---|
| **The rainbow play** | PRESENT + CORRECT — the bottom-dock CTA (`ds-cube-controls-desktop.png`, rainbow gradient on the play glyph). The taste anchor is intact | PRESERVE — it is the one sanctioned multi-color pop; do not flatten it |
| **The icon family** | PRESENT — scene-pill glyphs (cube/spring), reset/trash, the dock dropdown carets | PRESERVE + EXTEND — use the icon hues as the in-pane accent source (§2 color gap) instead of the green palette |
| **The hero serif** | PRESENT + CORRECT — `h1` Instrument Serif **177px** (live fact). The display anchor | PROPAGATE — give each pane a display-tier datum in this voice (§2 type gap, via `MetricCell appearance="dashboard"`) |
| **Main-controls red-with-dashed-outline (U-K17)** | PRESENT but ISOLATED — only `AnimationVisualizer.vue:21,35`; the rest of the app uses the disliked green | UNIFY — make the red-dashed the ONE motion-color authority (§3); it is the user's explicit preference over the green |

---

## §6 — WHAT IS ALREADY CORRECT (do not "refine")

- **The hero pane** (§1.1) — the reference; only the FourierField removal (hero
  lane) + grid-opacity tune (typography lane §7) touch it.
- **The dock GLASS chrome** — `backdrop blur(11px)`, `radius 9999px`,
  translucent — the glass idiom is right ON the floating tier (the gap is that
  it doesn't reach the panes, §2, not that the dock is wrong).
- **The cube controls card GRAMMAR** (§1.2) — the uniform mono-label column +
  glass input pills are the correct MID/QUIET control register; the defects are
  the serif/sans split (typography lane) and the green track (§3), not the
  card grammar.
- **The rainbow play CTA** (§5) — preserve verbatim.
- **The `.labeled-field-grid` subgrid idiom** — it WORKS (the cube/spring/easing
  share it); the §4.3 ABSTRACT note is a future-consolidation onto `Configurator`,
  not a defect.

---

## §FOLD

| Finding | Sev | The seam | Suggested wave-class |
|---|---|---|---|
| **U-K17 — TWO motion-color identities: red-dashed (preferred) vs green-progress (disliked). Same control (cube ribbon) carries red ball ON green track.** Red-dashed already proven at `AnimationVisualizer.vue:21,35`; green at `--color-progress hsl(142 71% 45%)` (`style.css:275`) drives sliders/preset-rings/balls/track. | **P1** | `style.css:275-296` (`--color-progress`/`--color-slider-track`) + `design-idioms.css:455-466` (`--ball-tone`) + `PlaybackRibbon.vue:156` (`.timeline-green`). Repoint to the `--accent-red` family; make "settled" the dashed-outline everywhere (mirror `AnimationVisualizer.vue:35`). ONE motion-color authority. | **K.W-color-unify** — token-collapse (sibling of the typography lane's display-token collapse) |
| **U-K11/K13/K16 — SPRING pane fails hierarchy: one flat quiet card, everything equal weight, green-saturated, NO display anchor, read-only keyframes "editor", inverted info (dense controls in small pane, empty readout in big pane).** | **P1** | `SpringSidebar.vue:22` (single `Card tier="quiet"`), `:118` (read-only editor), `SpringTarget.vue` (big empty readout panel). Re-tier with `MetricCell`/`MetricStack` + `Configurator` rows + `SegmentedTabs variant="pill"`. | **K.W-spring-ui** (the spring redesign wave — adopt 3.13.0 primitives) |
| **§2 — Suffusion DIES at the pane edge: glass/grid/audacious-type/icon-color all live at the hero, none propagate inward. No "pane suffusion contract."** | **P1** | The missing pattern: pane mount should inherit a display-tier anchor (`MetricCell dashboard`), the red-dashed motion language, a functional grid-plot, icon-hue accents. Today panes inherit none. | **K.W-design-language** (cross-cutting: the tier-ladder + pane contract, pairs with the typography lane's voice collapse) |
| **U-K7 / §1.5 — Pathological width (2560px): no max-cluster container, dock+controls strand as tiny islands, serif does not scale up.** `ds-hero-wide-2560.png`. | **P1** | No `max-inline-size` cluster + no `container`-query fluid type for the display axis. Per modern-web-guidance `css-layout` §3/§4: a `max-inline-size` cluster grid + `container: inline-size` + `clamp(…, Ncqi, …)` display type. | **K.W-layout** (the dock/stage/controls grid-refinement wave) |
| **U-K18 — Equal-weight readouts: primary + secondary data both render as same-size `MetricBadge`; no big-number display tier; two readout panes carry redundant info.** | **P2** | `SpringTarget.vue:31-39` (both badges same size). Promote primary to `MetricCell appearance="dashboard"`; demote secondaries to `compact`/`bare`. | **K.W-spring-ui** (same wave) |
| **U-K12/K13 — SegmentedTabs in the wrong register: `variant="segmented"` (view) + `variant="underline"` (artifact, near-invisible) instead of the user's preferred pills.** | **P2** | `SpringSidebar.vue:33,113` → `variant="pill"` (3.13.0 surface confirmed `"pill"` exists). Pairs with the typography lane's serif-leak fix at `tab-trigger.css:28`. | **K.W-spring-ui** / **K.W-typography** |
| **§4.1 ADOPT — five 3.13.0 primitives (`MetricCell`, `MetricStack`, `SegmentedTabs pill`, `Configurator`, `DockRail`) close the §2 gaps; all verified in the 3.13.0 tarball.** | **P2** | Presupposes the currency lane's re-pin (`~3.11.2→~3.13.0`). Consume at the spring/control/dock seams. | **K.W-repin** (enables) → **K.W-spring-ui** / **K.W-layout** (consume) |
| **§4.3 ABSTRACT — demo hand-rolls the progress-ball, the grid substrate, the dock-serif override, the labeled-field subgrid; glass-ui should own a `MotionBall` primitive + a `--dock-label-font` token + the `paper-backdrop`/`Configurator` abstractions (glass-ui ROOT gaps).** | **P2** | glass-ui repo (per MEMORY: root changes never patched in demo). `AnimationVisualizer.vue:21`, `EditorShell.vue:202`, `ChromeDock.vue:300`, `design-idioms.css §LABEL-subgrid`. | **glass-ui ROOT** (born-RED handoff to the glass-ui repo) |
| **U-K20 (design half) — TWO math-backgrounds compete (FourierField canvas + graph grid); the grid alone is the stronger quiet substrate.** | **P2** | `ds-hero-desktop.png` (FourierField rect bottom-left). Removal owned by the hero lane; this is the DESIGN rationale (one math-texture, not two). | **K.W-hero** (FourierField removal — design rationale recorded) |
| **§1.4 — easing/square/sequence/motion-path/amiga panes UNVERIFIED-BLANK (concurrent-rebuild harness artifact, not a render proof). U-K5 "/square broken" is an ENGINE finding (cold-path lane), not design.** | **(none — recorded)** | Re-probe under a quiesced dist for a live hierarchy verdict on these panes; the green-saturation finding generalizes to them by the shared `--color-progress` idiom. | **(re-probe note for the implementing wave)** |

---

*Audit complete. No source, test, gate, or CI files were modified. Screenshots
+ re-runnable probes under `docs/tranches/K/audit/screenshots-k/` +
`design-synthesis-probe.mjs`/`ds-probe2.mjs`.*
