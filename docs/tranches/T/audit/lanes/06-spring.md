# Lane 06 — spring (VERDICT #17, #18; shots 14, 15, 16)

**Lane protocol:** DESIGN lane (frontend-design loaded). Surface: the spring scene —
the KfPillTabs pills, the presets panel, the dock's Spring|Spring duplication, the
panel facility, the derby. Live state captured against the built `dist/gh-pages`
via the checked-in harness (`scripts/lib/demo-driver.mjs` withPage, 1440×900 +
375×812); evidence shots in `lanes/shots-06/` (`spring-1440-open.png`,
`spring-1440-derby.png`, `spring-1440-discrete.png`, `spring-1440-dock.png`,
`spring-375-open.png`). Owner shots 14/15/16 read and cited.

---

## 0. The current state, measured

At 1440 the spring page renders: a floating cartoon side pane (drag-grip + the
`Live solver │ Discrete transition` pill strip + two masked sliders + a ~250px
unlabeled red gradient block + a two-line ALL-CAPS legend + four preset chips each
carrying its own miniature race track + an "@keyframes (editable) / ⟲ RE-SAMPLE"
micro-header + an embedded per-stop editor) beside a stage card stamped
"⁚⁚ DOUBLE-TAP THE RAIL: DERBY", a giant red `x 1.000` numeral, the rail, a helper
paragraph, the sweep sampler, and the linear() trace (`spring-1440-open.png`). The
top dock at rest is an unreadable blur-blob (`spring-1440-dock.png` — VERDICT #4,
owned by the dock lane; noted here because every spring shot inherits it).
Expanded, the dock reads `[⊞] │ ∿ Spring │ ∿ Spring ⌄ │ @mbabb` (owner shot 14).
Every accent on the page — ball, rail, target ring, trace, heatmap wash, preset
rings, readout numeral, dismiss link — is the same red (`spring-1440-open.png`,
`spring-1440-discrete.png`): the "latent red theme" the owner named on easing is at
its most saturated HERE.

The meta-defect: **five gates guard this page** (proof:easing-sidebar-normalized's
flatten clause, the DFA totality rule, the a11y roving-tabindex tests, the heatmap
bench, the painter no-reactive-hot-path invariant) **and all are green** — none of
them can see that the page reads as a cluttered red instrument with a duplicated
dock and a bespoke pill strip. The gate-blindspot lesson, again, at surface scale.

---

## 1. Findings

### F1 — The dock's `∿ Spring │ ∿ Spring ⌄` duplication (VERDICT #17, shot 14)

**Defect.** On the spring page the dock renders TWO adjacent "Spring" items: the
single-surface STATIC control label (`ChromeDock.vue:249-266`, the K.W4 S6
"static label instead of a dead dropdown" cure) and the scene `<Select>` trigger
(`ChromeDock.vue:271-307`). Both wear near-identical glyphs — the control tab's
icon is `Activity` (`demo/@/state/controlSurfaceDFA.ts:190` — `spring: { value:
"spring", label: "Spring", icon: "Activity" }`) and the scene icon is the spring
∿ SVG. The bottom TransportDock does the same class of thing: the lone animation
renders its name "Spring Preview" (`useSpringDemo.ts:379`) as a static label
(`TransportDock.vue:53-58,109`).

**Root cause.** K.W4 S6 correctly diagnosed the dead 1-item dropdown (U4
dead-chrome) but half-cured it: it swapped the dropdown for a static label instead
of asking whether the item earns dock space at all. A static label that repeats
the scene name IS dead chrome — the U4 verdict applies to the replacement. The
owner's ruling is the full cure: *"the dock should not show an extra
'spring'/'easing' item — elide that intelligently if there's only ONE option. Same
for animations."*

**Recommendation.** The rule becomes ternary by construction: `count > 1 ⇒
Select · count == 1 ⇒ NOTHING (the panel-toggle icon alone carries the facility)
· count == 0 ⇒ no affordance`. Applied at both docks: ChromeDock drops the
`.dock-static-label` branch and its separator (`ChromeDock.vue:217,249-268,340-352`
all die); TransportDock drops the single-animation static name. The dock on a
single-surface scene reads `[⊞] │ ∿ Spring ⌄ │ @mbabb` — one Spring, ever.

### F2 — KfPillTabs: a hand-rolled tab engine where a glass-ui component belongs (VERDICT #18, shot 16)

**Defect.** The `Live solver │ Discrete transition` strip is `KfPillTabs.vue` +
`useKfPillTabs.ts` (`demo/@/components/custom/`) — a kf-internal 120-line pill
tablist with its own roving-tabindex composable, its own scoped pill CSS
re-deriving the glass-track look from tokens, mounted at two sites
(`SpringSidebar.vue:45-50`, `AnimationControls.vue`). The owner's verdict is
verbatim: *"wtf are most of these items? KfPillTabs.vue?? KF? Pills? Why aren't
these just glass-ui components?"*

**Root cause.** The R.W6 / DM-5 contingency kill: glass-ui 4.0.1's `SegmentedTabs`
emits `aria-orientation` unconditionally on its `role=group` pill variant (a WCAG
breach), the suppress band-aid was forbidden a 9th carry (P-inv-28), so the demo
re-authored the component instead of fixing it upstream. That was the wrong
direction of travel: the cure for a broken dependency component is a dependency
fix, not a parallel in-repo clone. glass-ui's own `SegmentedTabs`
(`node_modules/@mkbabb/glass-ui/dist/components/custom/tabs/SegmentedTabs.vue.d.ts`)
is strictly richer — pill/underline variants, vertical orientation, responsive
Select collapse, the BB liquid draggable indicator — and BG/BH are in development,
the natural landing for the one-line aria fix.

**Recommendation.** (a) HANDOFF to glass-ui BG/BH: `aria-orientation` emitted only
when valid for the rendered role (or the pill variant becomes `role=tablist`).
(b) On the consume edge: delete `KfPillTabs.vue` + `useKfPillTabs.ts` + its test,
re-consume `SegmentedTabs` at the AnimationControls site. (c) At the SPRING site
the strip doesn't get replaced — it gets DISSOLVED (F3): the view fork stops being
chrome at all.

### F3 — The bespoke `['spring']` mega-pane vs the panel facility (VERDICT #18, #25; shot 15)

**Defect.** The spring scene is the DFA's single bespoke surface —
`CONTROL_SURFACES.spring = ['spring']` (`controlSurfaceDFA.ts:101`) — so the
controls/keyframes/timeline triad the cube/amiga panels carry does not exist here.
Everything crams into ONE 313-line scrolling sidebar (`SpringSidebar.vue`): view
fork + params + heatmap + presets + a capped-scroll embedded keyframes editor
(`SpringSidebar.vue:127-148`, `.keyframes-editor-scroll { max-height: 26rem }`).
The owner: *"If we're to have a keyframes option, it should be like the core
cube/amiga/square (how it used to be) with sub options for the controls,
keyframes, timeline, etc."* — and #25 generalizes it: *"Why do we not properly
have a keyframes, controls, etc view for the other sub-animations? It's like we
forgot about that facility entirely."*

**Root cause.** The scene-specific-surface mechanism (built for easing) was
applied to spring as an exclusive REPLACEMENT for the triad rather than an
addition beside it. Once the pane was the only surface, every spring concern had
to live inside it — the mega-pane is the structural consequence of the DFA row,
not a styling accident. The ingredients for the triad already exist: the editor
animation is a REAL two-way `CSSKeyframesAnimation`
(`useSpringKeyframesEditor.ts:36-40`), the contract animation + group already ride
`useContractAnimGroup` (`useSpringDemo.ts:372`).

**Recommendation.** Restore the facility: `CONTROL_SURFACES.spring = ['controls',
'keyframes', 'timeline']`. The Keyframes tab hosts `springEditAnim` through the
STANDARD KeyframesEditor pane (uncapped — the tab owns its height; the 26rem
scroll cap dies with the pane); the Timeline tab binds the same animation; the
Controls tab carries the standard duration/easing block plus ONE spring-physics
domain section (F5's single field instrument + the two LabeledSliders — already
glass-ui). `SpringSidebar.vue`, `useSpringPaneDrag.ts` (168L of bespoke
pane-dragging), and the DFA's `spring` ControlSurface member all die. The
draggable-pane gimmick is not replaced — panels live in the panel facility.

### F4 — The view fork is data, not chrome: `Live solver │ Discrete transition` dissolves into the animation roster

**Defect.** The pill strip forks the STAGE between two targets
(`SpringScene.vue:10-11` — `SpringTarget` v-if solver, `StartingStyleTarget`
v-else), while the transport dock already owns exactly this concept: selecting
WHICH animation of a scene is on stage (`TransportDock.vue:53-58` renders a
Select when `animationNames.length > 1`). Spring registers only "Spring Preview"
(`useSpringDemo.ts:379`), so the transport facility idles while a bespoke pill
strip duplicates it above the sliders.

**Recommendation.** Register the discrete `@starting-style` transition as a
SECOND named entry beside the live solver ("Live solver" / "Discrete entry" — or
better: "SpringProgress" / "@starting-style", the API names, matching the amiga
convention of naming sub-animations after what they demonstrate). The transport
dock's existing `>1 ⇒ Select` rule then renders the animation Select — the fork
becomes a legitimate, already-designed facility; the pill strip's spring site
vanishes without replacement. This is the same elision rule as F1 running in the
opposite direction: chrome appears exactly when the data pluralizes.

### F5 — Three control surfaces for two numbers: sliders + heatmap + preset grid (shot 15)

**Defect.** The pane presents (response, ζ) three times: two `LabeledSlider`s
(`SpringSidebar.vue:56-77`), the 20×20 canvas heatmap + its two-line ALL-CAPS
legend (`SpringHeatmap.vue`, legend "← UNDERDAMPED (RINGS) / CRITICAL /
OVERDAMPED →" — wrapping awkwardly at rail width, owner shot 15), and four
`ToggleChip` preset cells (`SpringSidebar.vue:96-118`) each carrying its OWN live
mini race-track ball driven by a per-frame painter
(`SpringSidebar.vue:188-204`). The mini-tracks duplicate the derby (the actual
racing surface, F6); the unlabeled red wash reads as decoration, not instrument
(no axis labels on the field itself); the preset cells' `0.5 / 0.86` mono pairs
duplicate the heatmap header's readout two inches above.

**Root cause.** Accretion — P.W6 added the heatmap beside the sliders, K.W4
re-cut the presets beside both; each wave composed politely with its
predecessors and nobody collapsed the redundancy.

**Recommendation.** ONE parameter-field instrument: the canvas field, compact
(~9rem tall), axis-labeled on the field edges (response →, ζ ↑, the mono-caption
rung), overshoot-tinted in the scene accent, with the four canonical presets as
NAMED, clickable points ON the field (they are literally points in (response, ζ)
space — `springPresets.ts:17-41`). Click a point = apply the preset; the live
marker shows where you are; the two LabeledSliders below remain the precise
entry. The separate preset grid, its four ball painters, and the standalone
legend die. Panel painter census drops from 5 per-frame subscribers to 0 (the
field marker is discrete — `SpringHeatmap.vue` already documents it as inv-ζ
reactive-correct).

### F6 — Stage verbiage: the legend, the caption, the micro-labels (VERDICT #8/#11 register)

**Defect.** The stage card carries: the drafting-stamp gesture legend
"⁚⁚ double-tap the rail: derby" (`SpringTarget.vue:16-20`, `GestureLegend`); the
helper paragraph "Tap or drag the rail — the ball springs to the new target.
Adjust response / dampingFraction in the panel." (`SpringTarget.vue:133-137`);
"springTimingFunction sweep" + "linear() — 26 stops plotted" captions; and the
sidebar's "@keyframes (editable) / ⟲ RE-SAMPLE" micro-header. The discrete face
adds "EASED BY SPRINGLINEARSTOPS()" and a footer "EASED BY Smooth (0.50/0.86)"
(`spring-1440-discrete.png`). The owner's rulings on the identical registers
elsewhere: gesture legends removed wholesale (#8), caption blocks are
"superfluous nonsense" (#11).

**Recommendation.** The stage strips to the instrument: title, readout, rail,
sweep, trace. The GestureLegend mount dies (the derby stays a DISCOVERED egg —
double-tap keeps working, `useDoubleTap` at `SpringTarget.vue:250-256`; its
in-race ζ tags survive because they are data shown during the race, not standing
instructions). The helper paragraph dies. The section captions reduce to single
quiet mono words where a label is genuinely load-bearing ("sweep", "linear()"),
or nothing. Re-sample survives as an action in the Keyframes tab toolbar (F3's
standard pane has a toolbar row; it stops being a bespoke micro-header).

### F7 — The red drench: the spring's declared identity is GREEN (VERDICT #16 generalized)

**Defect.** Every motion accent on the page resolves to red:
`--color-progress: var(--accent-red)` (`demo/@/styles/style.css:388` and `:409`,
both themes — the K.W4 Lane B repoint). The spring surface consumes it at ~12
sites: `--ball-tone` (`SpringTarget.vue:282`), the readout numeral
(`SpringTarget.vue:291-298`), target marker + settle line + trace, the heatmap
tint, the preset-cell dashed rings + hovers (`SpringSidebar.vue:275-289`, with
two `!important`s). Yet the scene's own code records the OPPOSITE identity:
*"The spring icon's rest dot IS the progress green (spring.svg →
--rainbow-green family)"* (`SpringTarget.vue:276-284`) — and the derby's lane
map (`useSpringDerby.ts:11-16`) assigns green to *snappy*, reserving
`--color-progress` for *gentle* — which now paints the critically-damped lane
the color the design system reserves for DESTRUCTIVE actions (`DESIGN.md:7` —
"`--accent-red` for destructive actions"). "Dismiss" in the discrete face and
the spring ball wear the same hue (`spring-1440-discrete.png`).

**Recommendation.** Kill the repoint: `--color-progress` returns to the glass-ui
motion accent (the green family the spring glyph already wears). Red returns to
its `--accent-red` destructive register only. The derby's four rainbow lane
tokens (`design-idioms.css:117-120`) survive as the ONE polychrome moment,
re-pointing `--spring-lane-gentle` off the progress token to a proper lane hue
(e.g. `--rainbow-red` as a lane color distinct from the destructive accent, or
amber). This is a ONE-token cure with sitewide reach — coordinate with the
easing/theme lane (VERDICT #16 names it there); spring is the proof surface
because it is the most saturated consumer.

### F8 — Typography: hand-rolled registers where glass-ui registers exist (VERDICT #24)

**Defect.** The primary readout is a scoped custom class —
`.spring-readout-primary { font-size: clamp(2.25rem, 6cqi, 3.25rem); font-weight:
650; … }` (`SpringTarget.vue:291-298`) — re-deriving exactly what glass-ui's
metric registers own (`MetricStack`/`MetricRow`: the audacious-poster value
clamp, tabular-nums, the label/value lockup, the `--phase-color` tint cascade —
`dist/components/custom/metric-stack/MetricStack.vue.d.ts`). The settled badge is
scoped CSS (`status-badge`/`settled-badge`/`tracking-badge`) where glass-ui ships
`StatusDot` (already imported by ChromeDock) and `MetricBadge`. The J.W7a pass
HAD promoted these readouts to MetricBadge; K.W4 S5 demoted them back to scoped
CSS to re-tier sizes — the right instinct (hierarchy) executed at the wrong
altitude (a bespoke class instead of the register's size prop).

**Recommendation.** The readout block becomes one `MetricStack` (rows: `x` hero,
`v` quiet; `--phase-color` = the scene accent), the settled state one
`StatusDot` + mono caption. Scoped type CSS in `SpringTarget.vue` shrinks to
placement only. Same sweep over `StartingStyleTarget.vue` (its `Hello, spring.`
card + artifact block keep the display/mono rungs from tokens, no local
font-size authoring).

---

## 2. The target design (precise enough to implement)

**Aesthetic direction — "the laboratory bench":** one calm glass instrument on
the stage, all authoring in the standard panel facility, ONE accent. The spring
page's memorable thing is the PHYSICS — the ball's overshoot and settle — so
everything that is not physics recedes: glass-ui resting-tier surfaces, the
demo's Instrument-Serif display voice for the title only, mono captions for
data, and a single green motion accent that the derby briefly explodes into four
rainbow lanes. No stamps, no instructions, no red.

- **Stage (right, the protagonist):** the existing resting-glass Card. Top row:
  `SpringProgress` in `text-display` (Instrument Serif), right-aligned
  `MetricStack` — hero row `x 0.498` (tabular, scene accent via
  `--phase-color`), quiet rows `v 0.00` + `StatusDot` settled/tracking. Below:
  the rail (unchanged geometry — `.stage-field-x` ticks, ghost target ring,
  36px ball, dashed target line + settle pulse), then the sweep sampler
  (caption: `sweep`, mono-caption rung), then the SpringTrace plot (caption:
  `linear()`). Nothing else: no GestureLegend, no helper paragraph. The derby
  stays double-tap-discovered; during the race the four lanes + ζ tags overlay
  exactly as today, in the rainbow lane tokens.
- **Panel (the standard facility):** the AnimationControls triad —
  **Controls** = standard timing block + one "spring" section: the
  parameter-field instrument (axis-labeled canvas, preset points, live marker)
  over two `LabeledSlider`s (response, damping ζ). **Keyframes** = the standard
  KeyframesEditor over `springEditAnim`, with `Re-sample` as a toolbar action.
  **Timeline** = the standard KeyframeTimeline over the same animation.
- **Stage fork:** the transport dock's animation Select — "SpringProgress" /
  "@starting-style" — replaces the pill strip; each entry keeps its domain verb
  in the ribbon (Re-seat / Reveal–Dismiss) exactly as `SpringScene.vue:131-174`
  already forks them.
- **Docks:** `[⊞] │ ∿ Spring ⌄ │ @mbabb` up top (no static control label);
  transport dock shows the animation Select (now legitimately >1) + play — no
  static name row.
- **What dies:** `KfPillTabs.vue`, `useKfPillTabs.ts`, `SpringSidebar.vue`,
  `useSpringPaneDrag.ts`, the DFA `spring` surface member + its tab metadata,
  the preset ToggleChip grid + its 4 ball painters, the standalone heatmap
  legend, GestureLegend's spring mount, the helper paragraph, the
  `.spring-readout-primary`/badge scoped CSS, the `--color-progress` red
  repoint.

---

## 3. Cross-lane notes

- The blur-blob dock at rest (`spring-1440-dock.png`) is VERDICT #4 — dock lane;
  spring only inherits it.
- The `--color-progress` red repoint is sitewide (VERDICT #16 names it on
  easing); F7 here is the same token — ONE wave should own the token flip, with
  spring + easing as its two proof surfaces.
- F1's elision rule and F4's pluralization rule are the same law
  (`chrome ⇔ count > 1`) — worth stating once in the T design precepts so every
  scene inherits it.
- Performance (#19): spring is comparatively healthy (painter-positioned balls,
  analytic canvas heatmap, no Monaco in the pane) — this lane adds no perf
  finding beyond the painter-census reduction in F5.

---

## T recommendations

1. **T-SPR-1 — Dock single-option elision (both docks)** · ChromeDock drops the
   static control label + separator; TransportDock drops the single-animation
   static name; rule `>1 ⇒ Select, 1 ⇒ nothing, 0 ⇒ no affordance` ·
   Gate: harness probe on `#/spring` — dock text census contains exactly one
   "Spring"; zero `.dock-static-label` nodes site-wide · **S**
2. **T-SPR-2 — Restore the panel triad for spring** · DFA `spring →
   ['controls','keyframes','timeline']`; Keyframes tab hosts `springEditAnim`
   via the standard pane; Timeline binds the same; physics section moves into
   Controls; `SpringSidebar.vue` + `useSpringPaneDrag.ts` + the DFA `spring`
   surface die · Gate: probe — all three tabs reachable on spring; a per-stop
   edit in the Keyframes tab persists and re-shapes the stage sweep; grep zero
   `SpringSidebar` refs · **L**
3. **T-SPR-3 — The discrete transition becomes a second animation; the pill
   fork dies** · register "@starting-style" beside "SpringProgress" in the
   scene's animation roster; the transport Select forks the stage;
   `SpringScene.vue`'s view ref keys off the selection · Gate: probe — no
   `role=tablist` inside the spring panel; transport Select lists 2 entries;
   selecting flips SpringTarget ↔ StartingStyleTarget · **M**
4. **T-SPR-4 — KfPillTabs → glass-ui SegmentedTabs (upstream aria fix,
   BG/BH handoff)** · glass-ui emits `aria-orientation` only when role-valid;
   kf deletes `KfPillTabs.vue` + `useKfPillTabs.ts` + tests and re-consumes
   `SegmentedTabs` at the remaining AnimationControls site · Gate: grep zero
   `KfPillTabs` refs; axe/lighthouse a11y green on the consuming pane; the
   glass-ui version bump recorded on the consume edge · **S** (kf) + handoff
5. **T-SPR-5 — Un-red the motion accent; spring wears its green identity** ·
   kill `--color-progress: var(--accent-red)` (`style.css:388,409`) sitewide
   (coordinate with the easing/theme lane); re-point `--spring-lane-gentle`
   off the progress token; red returns to destructive-only · Gate:
   computed-style probe — the spring ball background ≠ the `--accent-red` hue
   in both themes; the capture contrast table stays ≥4.5:1 · **S** (token) /
   **M** (with the sitewide sweep)
6. **T-SPR-6 — ONE parameter-field instrument** · merge heatmap + preset grid:
   axis-labeled compact field with the four presets as clickable named points;
   sliders remain the precise entry; the preset ToggleChip grid + its 4
   per-frame ball painters + the standalone legend die · Gate: probe — clicking
   a preset point sets (response, ζ) exactly; registered panel painter count
   == 0; the field carries visible axis labels · **M**
7. **T-SPR-7 — Strip the stage to the instrument; readouts ride glass-ui
   registers** · GestureLegend spring mount + helper paragraph + micro-headers
   die; readout block → `MetricStack`/`StatusDot`; scoped type CSS reduced to
   placement · Gate: probe — stage text census contains no imperative strings
   ("Tap or drag", "DOUBLE-TAP"); zero `GestureLegend` nodes on spring; the
   `x` readout element is a glass-ui metric row · **M**
