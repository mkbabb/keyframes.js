# Lane 10 — the panel facility (controls / keyframes / timeline)

**VERDICT items owned:** #12 (square's collapsed panel), #18 (spring pills / "should be like the
core cube/amiga/square with sub options for controls, keyframes, timeline"), #25 ("why do we not
properly have a keyframes, controls, etc view for the OTHER sub-animations? It's like we forgot
that facility entirely"), #7 ("remove the surrounding pane — it's superfluous"), with #17 (single-
option elision) at the panel/dock seam.
**Owner shots read:** 07, 14, 15, 16. **Lane captures:** `docs/tranches/T/audit/lanes/shots-10/`
(`cube.png`, `cube-pane.png`, `spring-pane.png`, `easing-pane.png` — live dev server, 1440×900,
light theme, panel open).

---

## 0. Design commitment (the aesthetic direction for this surface)

**The instrument rack.** The panel facility is a vertical stack of *floating glass instruments* on
the stage — no enclosure, no chassis around the set. Every animation in the demo — every
sub-animation of every scene — is a **channel**; every channel exposes the same **facets**
(Controls · Keyframes · Timeline, plus at most one scene facet). Chrome is neutral glass in
glass-ui's own voice: glass surfaces, glass-ui's native type stack, ONE accent drawn from
glass-ui's `--primary`, mono reserved strictly for values and code. The current register — red
accents threaded through every interactive element, all-lowercase mono labels, serif buttons,
three coexisting tab idioms — dies. The memorable move is the *uniformity itself*: one grammar so
total that switching scenes never changes how you edit an animation, only what you're editing.

---

## 1. Current state — the measured map

### 1.1 The mount chain (six shells deep)

`App.vue` → `EditorShell.vue:62` → `AnimationControlsGroup.vue:12` → `ControlsPaneWrapper.vue:68`
→ `AnimationControls.vue` (one instance **per sub-animation**, keyed v-for at
`ControlsPaneWrapper.vue:62-105`) → facet panes (`AnimationControlsControls` /
`KeyframesStringControls` / `KeyframeTimeline`). Six component layers between the app shell and
one form. The facet switcher for machine-driven hosts is NOT in the panel at all —
`App.vue:147` provides `TABS_EXTERNALLY_MANAGED_KEY = true`, hiding the in-panel strip
(`AnimationControls.vue:56` `v-if="!tabsExternallyManaged"`) and hoisting facet choice into the
top dock's `<Select>` (`ChromeDock.vue:225-247`). Channel choice (sub-animation) lives in a THIRD
cluster, the bottom `TransportDock` (`TransportDock.vue:57-108`). One facility, three chrome
islands, six shells.

### 1.2 The DFA as-built — a censorship table, not a facility

`demo/@/state/controlSurfaceDFA.ts:90-113`:

| scene | surfaces | sub-animations in the group | facility? |
|---|---|---|---|
| cube | `[controls, keyframes, timeline]` (+ conditional `matrix-controls`) | Matrix, Rotations, Hover (`useCubeDemo.ts:44,74,85`) | FULL, per channel |
| amiga | `[controls, keyframes, timeline]` | Rotations, Bouncing X/Y/Z (`useAmigaDemo.ts:151-157`) | FULL, per channel |
| square | `[]` (S.G2 "honest collapse", `controlSurfaceDFA.ts:94-99`) | 1 real nested-keyframes anim (`useSquareDemo.ts:325-348`) | **NONE — owner-rejected (#12)** |
| easing | `[easing]` — the triad is EXCLUDED (`:100`) | 1 FAKE placeholder ("Easing Preview", `useEasingDemo.ts:336-341`) | bespoke sidebar only — **#25** |
| spring | `[spring]` (`:101`) | 1 FAKE placeholder ("Spring Preview", `useSpringDemo.ts:372-380`) | bespoke sidebar only — **#18/#25** |
| sequence / motion-path / morph | `[]` | (sequence: own transport) | none |
| compose | `[assets]` | per-asset preset groups | bespoke — **pruned by ruling #23** |

The key structural fact: **the per-sub-animation facility ALREADY EXISTS and works** — 
`ControlsPaneWrapper.vue:62-105` mounts a full `AnimationControls` per group member, and
`TransportDock` selects among them. Cube and amiga prove the grammar. The defect is that the DFA
was used to *remove* the facility wherever the panel would have lied (square) or where the scene
grew a bespoke sidebar instead (easing/spring). The owner's #25 is literally true: the facility
wasn't extended to the other animations — it was walled off from them, scene by scene.

### 1.3 The root lie: the placeholder contract group

`demo/app/runtime/useContractAnimGroup.ts:15-27` confesses it in-source: *"WV-W1 LANE ESCAPE
HATCH … the group is a minimal opacity-only placeholder retained ONLY as the transport host — it
drives no scene motion."* Easing and spring feed the entire panel/transport machinery a fake
`{opacity: 0→1}` animation. Square's variant (`useSquareDemo.ts:325-348`) carries the REAL nested
keyframes and even a working `transformFunc` — but "drives no box paint." S.G2's response to
"the panel edits an animation that paints nothing" was to delete the panel (DFA row → `[]`).
**T must invert this: make the group true, not the panel absent.** Every gate passed because the
gates measured the collapse, not the loss — the owner measured the loss.

### 1.4 The facility, rebuilt bespoke inside the spring sidebar (the smoking gun for #25)

The spring scene REBUILT what it walled off:

- `useSpringKeyframesEditor` (`useSpringDemo.ts:140-151`) constructs a REAL two-way
  `CSSKeyframesAnimation` (`springEditAnim`) — "the PRIMARY authoring path" — and renders it via
  the bespoke "@keyframes (editable)" card (owner shot 15), a hand-rolled mini keyframes editor,
  while the shared `keyframes-editor/` (Monaco, parsing, ops) sits unused on this scene.
- `SpringSidebar.vue:176-184` hand-rolls a view switcher ("Live solver / Discrete transition",
  owner shot 16) with `KfPillTabs` — a second animation-selection idiom competing with the
  transport's channel select.
- A `springTimingFunction`-driven sampler animation already exists (`useSpringDemo.ts:212-215`,
  `:154-160`) — real keyframe material with no facility over it.

This is #18 verbatim: the scene has keyframes, controls, and a timeline-shaped concern, and
presents ALL of them through one 313-line bespoke sidebar instead of the facility.

### 1.5 The surrounding pane (#7) — three nested containers around two cards

Anatomy of owner shot 07 (confirmed in `cube-pane.png`):

1. **The outer pane** — `.controls-pane` gets `glass-wash rounded-card` on desktop subject stages
   (`ControlsPaneWrapper.vue:47`), wrapping everything in a big rounded glass slab.
2. **The group border** — `.controls-content` carries a border + tint plate + radius
   (`ControlsPaneWrapper.css:32-44`, the K.W4 F2 "ONE SUBTLE BORDER" cure).
3. **The actual instruments** — the controls Card (`surface="cartoon" tier="quiet"`,
   `AnimationControlsControls.vue:3`) and the playback ribbon card.

**Verdict archaeology that T must not re-litigate:** K.W4 F2 was ITSELF an owner cure ("ONE
SUBTLE BORDER wrapping the two control elements, NOT two heavy separate glass cards"). T #7 now
rules the wrapper "superfluous." These reconcile: the K-era complaint was about two *heavy
cartoon-stamped* cards competing; the T target is *light* glass cards that don't read as heavy —
which removes the need for the grouping wrapper. Ship floating light cards, zero wrappers; do not
resurrect either failed pole (heavy twin cards / bordered enclosure).

### 1.6 The three tab idioms + the dock duplication (measured)

Three coexisting idioms for "pick one of N": the dock `<Select>` (machine hosts), `KfPillTabs`
(standalone host strip `AnimationControls.vue:74-80` + spring sidebar view switch), and bespoke
preset pill-buttons (`SpringSidebar.vue:101-104`). `KfPillTabs` exists only because glass-ui
4.0.1's `SegmentedTabs` emits its orientation attribute unconditionally (the DM-5 contingency
kill, `AnimationControls.vue:66-73`) — a fork of a glass-ui component the owner explicitly wants
used (#18: "Why aren't these just glass-ui components?").

Live dock probe (dev server, this lane): easing dock innerText = `"Easing\nEasing\n@mbabb"`,
spring = `"Spring\nSpring\n@mbabb"` — the sole-surface static label (`ChromeDock.vue:116-122,
255-266`) duplicates the scene name verbatim, flanked by two separators (`:217, :268`). Owner
shot 14 (`∿ Spring │ ∿ Spring ⌄`) reproduced exactly. `TransportDock.vue:58` already elides the
channel *Select* at 1 animation but substitutes a static name span (`:108-114`, again at
`:175-176`) — so a 1-channel scene still prints its (fake) animation's name twice in the bottom
bar. #17's ruling is elision, not substitution.

### 1.7 Register defects inside the panel (the #16/#24 slice that is panel-local)

- **The latent red**: `--accent-red: hsl(0 72% 63%)` (`@/styles/style.css:346`) rides the Play
  label, sliders, progress fill, preset dots, easing-telemetry numerals, and the spring
  parameter-space wash (shots 07/15; `spring-pane.png`, `easing-pane.png`).
- **Fonts**: field labels are lowercase mono (`text-mono-small` on every label,
  `AnimationControlsControls.vue:21,29,41`), buttons render in the Instrument Serif display face
  (`style.css:70` demo override) — "Play" in red serif (shot 07). Mono-as-label + serif-as-button
  is exactly the "fonts are not right at all" read.
- **Live paint defect**: in light theme the spring response/damping sliders render as solid dark
  blobs (`shots-10/spring-pane.png`, top) — the bespoke slider skin is broken in one theme.
- **Monaco pane**: force-mounted + `content-visibility` cached (`AnimationControls.vue:127-144`,
  `:417-428`) — this part is sound and should survive the rebuild.

---

## 2. The owner's model vs. the built model

| Owner's model (VERDICT) | Built model | Gap |
|---|---|---|
| EVERY animation gets controls/keyframes/timeline (#25, #18) | Only cube/amiga; DFA excises the triad elsewhere | The DFA is a per-scene censorship table over a facility that already generalizes |
| Spring/easing "like the core cube/amiga/square" (#18) | Bespoke sidebars re-implement the facility badly | Placeholder group + sidebar shadow-copies |
| Square's panel "must return" (#12) | DFA `square: []` (S.G2) | The honest-collapse cured the symptom by amputation |
| 1 sub-animation ⇒ don't display it (#17) | Static label substitution (dock + transport) | Elide, don't substitute |
| "Remove the surrounding pane" (#7) | 3 nested containers | Two wrapper tiers to delete |
| "Just glass-ui components" (#18, #27) | KfPillTabs fork, bespoke pills, bespoke mini-editor | glass-ui 4.0.1 already ships the whole kit (§3.3) |

---

## 3. Target design — precise enough to implement

### 3.1 The grammar: Channel × Facet

```
Scene
└─ AnimationGroup — REAL animations only (the placeholder host is deleted)
   ├─ Channel = one sub-animation        (cube: Matrix/Rotations/Hover; spring: Sweep/Entry; …)
   │    selector: TransportDock Select   — rendered IFF channels > 1, else NOTHING
   └─ Facets per channel, always the same set:
        Controls  — duration/delay/iterations/direction/fill/easing form
        Keyframes — the Monaco editor (shared keyframes-editor/)
        Timeline  — the keyframe timeline (shared keyframe-timeline/)
        [+ ≤1 scene facet, additive]     — cube: Matrix (conditional) · easing: Curve · spring: Physics
        selector: the dock facet Select  — rendered IFF facets > 1 (with the triad it always is)
```

The DFA table inverts from hand-authored exclusion to derivation:
`surfacesFor(scene) = (group has ≥1 animation ? TRIAD : []) ∪ sceneFacets(scene)`. The only
hand-data left is the scene-facet registry (label/icon/conditional predicate — today's
`SCENE_SURFACE_TABS` + `CONDITIONAL_SURFACES`, kept). `home` derives `[]` naturally. With
compose/morph/motion-path pruned (ruling #23), the registry is three rows. The
single-surface flat-mount topology, the `extraTabs` standalone seam, and the
`isSingleSurfaceScene` branch in `AnimationControls.vue` (three mount topologies in one 452-line
host) all collapse to ONE topology.

Per-scene honest groups (feasibility, all from existing material):

- **square** — the nested-keyframes twin (`useSquareDemo.ts:332-348`) already carries the real
  keyframes AND `transformFunc`; bind it as the actual paint driver of the Play/tumble path.
  The drag-spring stays a LIGHT gesture layer, independent of the group (gestures are not
  channels). DFA row: `[] → TRIAD`.
- **spring** — two real channels: **Sweep** (`springEditAnim`, the already-two-way
  `CSSKeyframesAnimation` from `useSpringKeyframesEditor` — its keyframes facet IS the Monaco
  editor, killing the bespoke "@keyframes (editable)" card) and **Entry** (the compiled
  `@starting-style` animation from `useCompiledEntry`). "Live solver / Discrete transition"
  pills die; those views become the two channels. Response/damping/presets/heatmap become the
  **Physics** scene facet.
- **easing** — one real channel **Sweep**: a `CSSKeyframesAnimation` on the preview target whose
  `timingFunction` is the edited easing. The curve editor becomes the **Curve** scene facet.
  Controls-facet edits (duration/direction) drive the visible sweep — honest by construction.
- **sequence** — its rows are real animations; enroll them as channels with the master-playhead
  stage kept as the scene's instrument (cross-check with the sequence lane; sized L, separable).

### 3.2 Layout, spacing, containers (what #7 becomes)

- **Rail**: keep `--rail-width: clamp(20rem, 26cqi, 30rem)`; the rail is a plain column,
  `display:flex; flex-direction:column; gap: 0.75rem;` — **no border, no background, no radius,
  no glass on the column itself**.
- **Delete**: the `.controls-pane` `glass-wash rounded-card` subject-stage wrap
  (`ControlsPaneWrapper.vue:47`) and the `.controls-content` K.W4-F2 border/tint/padding block
  (`ControlsPaneWrapper.css:32-44`).
- **Cards**: exactly two floating instruments, both `GlassPanel` (glass-ui `./glass-panel`):
  the facet body and the playback ribbon. Padding `1rem`; radius `var(--radius-card)`; the
  lightest glass tier on subject stages (stage bleeds through), standard tier on editor stages.
  No cartoon offset-stamp shadows in the panel (the heavy-card read K.W4 cured returns otherwise).
- **Mobile**: the sheet spring (detents, `--sheet-t`) is sound and survives; the sheet becomes the
  ONE container on mobile (it already is) — the inner wrappers die there too.

### 3.3 glass-ui components by name (census: 4.0.1 installed, real exports verified)

| Concern | Today | Target (glass-ui 4.0.1 export) |
|---|---|---|
| Any tab strip | `KfPillTabs` fork | `SegmentedTabs` (`/tabs`) — the orientation-attr defect is a **named BG/BH gap**, filed, not forked around; until the fix lands the strip need not exist at all (machine hosts use the dock Select) |
| Controls form rows | `LabeledInput/LabeledSelect` (already) | keep; adopt `LabeledSlider`/`LabeledSwitch` (`/labeled-field`) for the spring Physics facet — cures the black-blob bespoke sliders |
| Advanced disclosure | bespoke panel-row swap | `ExpandableContainer` (`/expandable-container`) or `Collapsible` |
| Spring presets | bespoke pill buttons + red dots | `ToggleChip variant="cell"` (`/toggle-chip`) — icon-over-label cells, active = `--primary` ring |
| Panel container | Card cartoon/quiet + 2 wrappers | `GlassPanel` (`/glass-panel`) |
| Timeline scrubber/ribbon | bespoke | evaluate `ScrubberTimeline`/`GlassTimeline` (`/timeline`) for the ribbon + timeline facet rails; keep kf's diamond editor logic (zoom-pan, ops) — skin only |
| Dense multi-row option panes | ad-hoc grids | `Configurator/ConfiguratorRow` (`/configurator`) where a facet grows >6 rows |

### 3.4 Type ramp and color (panel-local; consonant with lane 24)

- **Labels**: glass-ui text stack (`--font-text`), `0.75rem`, weight 500, `--muted-foreground`,
  sentence case ("Duration"). Mono label register dies.
- **Values**: `--font-mono` (Fira Code) `0.8125rem` — inputs, numeric readouts,
  `cubic-bezier(…)`, keyframe code ONLY.
- **Headings** (rare; facet bodies are mostly headingless — the dock names the facet):
  `--font-stack-display`, 600, `0.875rem`.
- **Buttons**: glass-ui `Button` defaults — no serif, no red label.
- **Accent**: all interactive states ride `--primary`. `--accent-red` exits the panel facility
  entirely (legitimate only as destructive semantics). The spring parameter-space heatmap becomes
  a perceptual oklch ramp anchored on the `--primary` hue, not a red wash.

### 3.5 Elision (#17, the presentation rule — never facility removal)

- channels == 1 → TransportDock renders **no channel UI at all** (no Select, no static name —
  `TransportDock.vue:108-114` and `:175-176` both go).
- facets == 1 → the dock renders **no facet item** (no Select, no static label —
  `ChromeDock.vue:249-266` goes); with the restored triad this case survives only on `home`.
- No separator renders beside an elided group (dock lane owns the divider ruling; the elision
  contract here guarantees it nothing to separate).

### 3.6 Motion

Facet switch: 200ms fade + 4px slide on the incoming panel (`--spring-smooth` curve token);
channel switch: 150ms cross-fade; ribbon progress continuous (no layout thrash); the mobile sheet
keeps its SpringProgress detents; `prefers-reduced-motion` snaps all of the above.

### 3.7 What dies (the roll-up)

`useContractAnimGroup.ts` (the escape hatch, in totality) · `KfPillTabs.vue` + `useKfPillTabs.ts`
· the spring sidebar's bespoke @keyframes mini-editor + view-switch pills + preset pill-buttons ·
the `.controls-pane` glass-wash wrap + `.controls-content` group border · the sole-facet static
dock label + the 1-channel static transport name · the `extraTabs`/standalone/flat-mount triple
topology in `AnimationControls.vue` · `--accent-red` consumption inside the panel · the mono
label + serif button register.

---

## T recommendations

1. **THE HONEST GROUP — delete the placeholder transport host; every scene's AnimationGroup
   carries its real, painting animations.**
   Scope: delete `useContractAnimGroup.ts`; square binds its existing nested-keyframes twin as
   the tumble/Play paint driver; spring registers Sweep (`springEditAnim`) + Entry
   (`useCompiledEntry`); easing registers the real preview Sweep; gestures stay LIGHT and
   group-external. Fail-explicit: no group member may drive zero paint.
   Gate: runtime probe per scene — while playing, each group animation's target shows a computed-
   style delta ≥1 frame apart (the edit-to-paint oracle: set duration via the Controls facet →
   measured paint-cadence change on the subject); `grep -r useContractAnimGroup demo/` = 0.
   Size: **L**.

2. **THE UNIFORM FACILITY GRAMMAR — Channel × Facet; the DFA inverts from exclusion table to
   derivation + a 3-row scene-facet registry.**
   Scope: `surfacesFor = (group nonempty ? TRIAD : []) ∪ sceneFacets`; square/easing/spring gain
   the triad; easing's Curve, spring's Physics, cube's Matrix ride as additive scene facets;
   `AnimationControls.vue` collapses to ONE mount topology (flat/standalone/managed branches +
   `extraTabs` seam deleted); compose/morph/motion-path rows die with the #23 pruning.
   Gate: browser probe per surviving scene — facet set rendered ⊇ {Controls, Keyframes, Timeline}
   and each facet body mounts + accepts an edit; no `CONTROL_SURFACES` literal excluding a triad
   member from a scene with a nonempty group (source grep).
   Size: **M** (rides on 1).

3. **SPRING/EASING RESHAPED AS CHANNELS + ONE SCENE FACET — the bespoke sidebars dissolve.**
   Scope: kill `SpringSidebar`'s KfPillTabs view switch, bespoke @keyframes card, bespoke preset
   pills; Physics facet = response/damping (`LabeledSlider`) + presets (`ToggleChip cell`) +
   heatmap (oklch ramp); easing sidebar becomes the Curve facet over the real Sweep channel.
   Gate: shot-parity probe — spring scene shows the standard facet chrome; `grep KfPillTabs
   demo/scenes` = 0; the keyframes facet on spring round-trips an edit into the painted sweep.
   Size: **L**.

4. **REMOVE THE SURROUNDING PANE — two floating GlassPanel instruments on a naked rail.**
   Scope: delete the `.controls-pane` subject-stage `glass-wash rounded-card` wrap
   (`ControlsPaneWrapper.vue:47`) and the `.controls-content` border/tint block
   (`ControlsPaneWrapper.css:32-44`); facet body + playback ribbon become `GlassPanel`s,
   `gap: 0.75rem`, no cartoon stamps (records the K.W4-F2 ↔ T-#7 reconciliation: light cards,
   zero wrappers).
   Gate: computed-style probe — between the rail grid cell and the two cards, no ancestor has a
   visible border or background (border-alpha 0, no glass class); card count in the rail == 2.
   Size: **S**.

5. **SINGLE-OPTION ELISION AT PRESENTATION — 1 channel ⇒ nothing; 1 facet ⇒ nothing.**
   Scope: delete the static sole-facet dock label (`ChromeDock.vue:249-266`) and the static
   1-channel name spans (`TransportDock.vue:108-114, 175-176`); separators never flank an elided
   group.
   Gate: dock innerText probe on a 1-channel scene contains no duplicated adjacent token (the
   measured `"Spring\nSpring"` becomes `"Spring"`); no `dock-static-label` node renders anywhere.
   Size: **S**.

6. **GLASS-UI-FIRST PANEL KIT — KfPillTabs dies; the fork's cause is a named BG/BH handoff.**
   Scope: delete `KfPillTabs.vue`/`useKfPillTabs.ts`; remaining strips (if any survive the dock-
   Select model) are `SegmentedTabs`; file the orientation-attribute defect as a glass-ui BG/BH
   item (born-RED handoff per the established consume-edge pattern — no local fork, no suppress).
   Gate: `grep -r "KfPillTabs" demo/` = 0; the handoff item exists in the T ledger with the
   glass-ui version that closes it; on that version bump, `SegmentedTabs` renders with zero
   undefined-attr suppression.
   Size: **S** (kf side) + the glass-ui dispatch.

7. **PANEL REGISTER CURE — type ramp + de-red.**
   Scope: labels → glass-ui text stack (sentence case, `--muted-foreground`); mono confined to
   values/code; buttons → glass-ui Button defaults (no serif, no red); all panel interactive
   states → `--primary`; the spring heatmap → perceptual oklch ramp; fix or replace the
   light-theme black-blob sliders via `LabeledSlider` (subsumed by 3).
   Gate: computed-style audit over the open panel — zero elements resolve `--accent-red` in any
   consumed property; zero `font-family` resolutions to the display serif inside the facility;
   label nodes resolve the text stack, value nodes the mono stack.
   Size: **M**.
