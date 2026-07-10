# Lane 25 — design-demo-coherence (Tranche U audit)

**Charter**: read the six scenes + the instrument + the dock as ONE product; audit
visual/interaction coherence, design-token discipline, the T-redesign seams,
typography/spacing/motion consistency. Design lane (frontend-design skill loaded).
Evidence: source-read of `demo/` + the 12 blessed owner goldens
(`docs/tranches/T/goldens/golden/*.png`) + the gate scripts that pin the design facts.

---

## 0. The verdict in one paragraph

The demo's design system is, at the token and idiom level, among the most disciplined
this auditor has read: ONE violet motion authority (`--accent-kf` → `--color-progress`,
style.css:122–164), ONE display voice at its honest weight (Instrument Serif 400,
style.css:42–68 + the `@layer demo-typography` rung override, style.css:264–295), a
mono-as-data contract enforced by census (`@/styles/font-roles.json`), a promoted
rail/ball/badge/field idiom family (design-idioms.css:128–239), φ-derived dock
geometry (layout.css:56–136), and a z-order contract (style.css:18–40). The seams are
NOT in the tokens — they are one level up: (a) the design LANGUAGE has no home (the
authoritative spec lives scattered in CSS comments + a JSON manifest while DESIGN.md
is a 28-line pre-S stub); (b) the product splits into two unreconciled genres —
four "instrument" scenes wearing the full specimen grammar vs two "immersive" 3D
scenes (cube, amiga) with no live readout at all, an asymmetry currently codified as
an enforcement *exception* rather than a designed rule; (c) the blessed appearance
authority is incomplete (no sequence golden) and internally state-inconsistent (the
pane idle-fade contaminates the reference set); (d) the gesture-affordance grammar is
spelled four different ways or absent.

---

## 1. What coheres (the baseline the findings sit on)

Verified in-tree, not board-trusted:

- **Color discipline is near-total.** A raw-literal sweep of `demo/scenes/` finds
  only: CubeTarget's material-lighting whites/blacks (CubeTarget.css:115–133),
  amiga's token-fallback arms (`var(--muted, hsl(0 0% 96%))`, AmigaScene.vue:260–261),
  and SpringHeatmap's last-resort fallback AFTER two token reads
  (SpringHeatmap.vue:113–120 — the comment explicitly rides `--ball-tone`/
  `--color-progress`). Everything else is token-derived, including the sequence
  rows' rainbow map with its *mixed* bridge stop
  (`color-mix(in oklab, var(--rainbow-cyan) 45%, var(--rainbow-green))`,
  SequenceTarget.vue:164–170) — a genuinely elegant "never a new literal" move.
- **Motion durations ride tokens.** The only hardcoded scene durations are
  CubeTarget.css:79 (`--lit 160ms` — a registered-property transition) and the
  sequence power-on keyframes (SequenceTarget.css:222–225); everything else is
  `var(--duration-fast)/var(--ease-standard)` shaped (e.g. SquareScene.css:66,
  EasingTarget.css:36–39 with a PRM suppression block at :48–53).
- **The specimen grammar converges across the T-touched scenes.** The T.E6 gallery
  (EasingTarget.vue:11–109) and the spring presets (SpringPhysicsFacet.vue:66–78)
  both speak glass-ui `ToggleChip` cells; easing/spring/square/sequence all carry the
  serif `text-display` scene title + mono `tabular-nums` readout + `.status-badge`
  tri-state (EasingTarget.vue:23–37, SpringTarget.vue:33–52, SquareInstrument.vue:21–33,
  SequenceTarget.vue:12–45); the `.progress-rail`/`.progress-ball`/`--ball-tone` seam
  is consumed identically on all four (design-idioms.css:158–189).
- **The two-register card rule holds everywhere.** Control panels are
  `Card surface="cartoon" tier="quiet"` (AnimationControlsControls.vue:3,
  EasingSidebar.vue:14, SpringPhysicsFacet.vue:21, MatrixEditor.vue:2, RibbonBar.vue:3);
  stage plates are glass `tier="resting"` `:shadow="false"` (SpringTarget.vue:10–13,
  SquareScene.vue:10–13, SequenceTarget.vue:8, EasingTarget.vue:11–13). No violations found.
- **The dock is one voice.** Scene icons single-sourced on descriptors
  (ChromeDock.vue:35–40), tab metadata derived from ONE `SURFACE_META` registry
  (ChromeDock.vue:42–52), labels on the Jakarta body register (font-roles.json
  `dock-label`), affordance presence DFA-projected (ChromeDock.vue:105–116).

This baseline matters: the findings below are gestalt-level, not hygiene-level.

---

## 2. Findings

### F1 (MAJOR) — The design language has no authoritative home; DESIGN.md is a pre-S stub

**Evidence.** `demo/DESIGN.md` is 28 lines: a token-override note naming Instrument
Serif/Fira Code/axis colors/`--accent-red`/`--filter-brand-color` (DESIGN.md:5–7), the
`tab-trigger-*`/`btn-playback` utilities (:11–20), and a "Migration Tasks: Minimal —
this demo is already well-aligned" close (:22–28). Meanwhile the ACTUAL language —
the violet accent authority and its light-dark arm-swap (style.css:122–137), the
red-is-destructive-only rule (style.css:115–119), the rainbow signal family + its
consumption law (design-idioms.css:9–28), the graph-paper substrate + φ dock geometry
(layout.css:28–36, 56–136), the two-register card rule (§1 above, stated only in
per-file comments like SpringTarget.vue:2–9), the display-voice/mono-as-data
contracts (style.css:42–56; font-roles.json `_monoContract`), the specimen-card
grammar (stated nowhere as a rule — only enacted) — lives in CSS comments, a JSON
manifest, and gate scripts. DESIGN.md doesn't even mention the violet accent that
defines the product's identity, and still frames Plus Jakarta Sans-era migration as
"minimal." Under the owner's NO-legacy edict this is the one legacy artifact on the
design axis: a stale spec beside a living system.

**Proposal (gestalt).** Charter THE DESIGN CODEX wave: promote DESIGN.md to the
single authoritative design-language spec — the voices (display/body/mono and their
rung contracts), the color authorities (violet-motion, red-destructive, rainbow-signal,
gold-sparkle, the six crayons), the two-register card rule, the specimen-card grammar
(title rung + readout + badge + hint), the stage-field/graph-paper substrate, the φ
dock geometry, the z-contract, the idiom catalog with their file homes. The doc
becomes the artifact the gates CITE (proof:idioms, proof:font-census,
proof:accent-census anchor their clauses to codex sections, the way font-roles.json
already half-does) — spec-first, gates-derive, comments-reference. This is the
architectural transposition: today the gates pin facts whose rationale is
unrecoverable without archaeology; the codex inverts that.

### F2 (MAJOR) — Two unreconciled scene genres: the instrument grammar stops at the 3D border

**Evidence.** Four scenes carry the full specimen grammar (serif title + live
engine readout + status badge on a stage plate — citations in §1). The two 3D
scenes carry none of it: **amiga** is a bare full-bleed canvas whose telemetry
readout, gesture legend, and CRT overlay were all DELETED at T.A10
(AmigaScene.vue:5–17 — "there is nothing on the DOM stage between the canvas and
the page"), and **cube** has neither a readout nor even a stage plate — it is the
only scene floating bare on the page grid (CubeScene.vue:9–23), while the square's
J.W7a rationale for GAINING the plate was explicitly "the SAME plate
easing/spring/sequence stand on … instead of floating bare on the page grid — the
subject finally has a stage" (SquareScene.vue:2–13). The asymmetry is *enforced* as
an exception: proof:appearance-suffusion clause (b) asserts "the amiga stage carries
NO display title (the binding headerless exception — enforced, not assumed)"
(scripts/proof-appearance-suffusion.mjs:31–34). So the product's core identity —
*the instrument reads the engine live* (spring shows x/v, square x/y, sequence
progress, easing the literal) — goes silent on exactly the two most spectacular
scenes, where the engine is doing its most impressive work (a 3-channel additive
group pose, a decay() glide with live angular velocity — exposed today only to a
window probe, AmigaScene.vue:184–198).

**Proposal (gestalt).** This is an owner-review-shaped fork, and U should charter it
AS a design wave with renders, not decide it: **(a)** design the *telemetry whisper*
register for subject scenes — the square's asymmetric corner-instrument composition
(SquareInstrument.vue:168–201: serif title top-left, quiet legend bottom-right,
`pointer-events: none`) promoted to a shared idiom and applied to amiga (spin ω, pose
y) and cube (the active channel + live matrix cell or Euler triple), keeping the
canvas full-bleed under a floating whisper — the instrument voice carried into the
immersive genre without a plate; or **(b)** bless the two-genre rule (instrument
scenes speak; immersive scenes are silent theater) in the F1 codex and RE-CUT the
suffusion clause from "exception" to "rule," and give cube its explicit
plate-lessness rationale (the page-wide axis lines ARE its coordinate field — the
stage-field idiom at page scale). Either way the current state — a design decision
expressible only as a gate exception — dies.

### F3 (MAJOR) — The blessed appearance authority is incomplete (no sequence golden) and state-contaminated (the idle-fade)

**Evidence.** The owner-golden matrix is "6 owner-cited scenes × 2 themes = 12
goldens: home · cube · amiga · square · easing · spring" (goldens/README.md:13–19;
BLESSED.json has exactly those 12 entries; proof-owner-golden.mjs:45,75). **Sequence
— a shipping scene, and one carrying substantial T-era design work (the storyboard
containment, the rainbow row map, the phosphor playhead) — has no blessed reference
at all**: it is the one scene whose appearance can silently drift with no oracle.
Second: the goldens disagree on pane state. The controls rail rest-dims to
`--controls-idle-opacity: 0.35` after 10s of global inactivity (layout.css:38–41;
usePaneHover.ts:7 `IDLE_MS = 10_000`) — and visual inspection of the blessed set
shows amiga-light captured with the pane LIT while easing/spring/square/cube-light
were captured REST-DIMMED. The reference set therefore pins two different chrome
states across scenes: cross-scene appearance comparison is unsound, and the
idle-fade itself (a real, owner-visible behavior) is pinned in some frames and
invisible in others — a regression in either direction reads as "matches the golden"
somewhere.

**Proposal (gestalt).** Charter the golden-matrix completion + protocol hardening as
one wave: add `sequence-{light,dark}` through the born-OWNER blessing flow; amend the
capture protocol (goldens/README.md) to PIN the pane state — freeze the idle clock at
a named state (canonically LIT, the state the owner actually reviews in) the same way
PRM is already frozen — and re-capture/re-bless the frames whose pane state deviates.
The protocol change is one clause beside the existing PRM freeze; the payoff is a
reference set that means one thing.

### F4 (MINOR) — The gesture-affordance grammar is spelled four ways, or not at all

**Evidence.** Every scene's subject is manipulable, but the "you can touch this"
message has no shared register: **spring** — an explicit in-card centered caption
("Tap or drag the rail…", SpringTarget.vue:126–130); **square** — a corner legend
with progressive-disclosure hints ("drag the box, or press Play to tour it" /
"double-click to tumble" / "press C…", SquareInstrument.vue:35–56) plus the
serif "drag me" ON the subject (SquareScene.vue:44–76); **amiga** — `cursor: grab`
alone (AmigaScene.vue:252–256), its legend deleted at T.A10, so drag-to-spin and the
decay() glide (a library headline feature being dogfooded!) are undiscoverable on
touch, where no cursor exists; **cube** — the hint lives only in the HOME hero
("or drag M. cubert", App.vue:48) and vanishes on the cube scene proper, where
orbital drag + the matrix subject are unadvertised. Sequence and easing are fine
(visible handles / pressed tiles are self-evident).

**Proposal (gestalt).** Promote the square's legend into ONE shared `.stage-legend`
idiom (design-idioms.css — position register, caption rung, progressive-disclosure
timing, PRM/touch behavior) and give every manipulable scene its verb line in that
register — amiga ("drag the ball — release to coast") and cube ("drag to orbit")
included. If the owner prefers designed silence for the immersive genre, that is the
F2(b) fork — but the current mix (explicit / progressive / cursor-only / home-only)
is four grammars, not a rule.

### F5 (MINOR) — Token homes: the idiom/geometry partition has drifted pointers and a fuzzy boundary

**Evidence.** layout.css declares itself "geometry — lengths, ratios, viewport
clamps — only" (layout.css:6) yet owns `--graph-opacity`/`--graph-major-opacity`
(appearance ink strengths, layout.css:34–35) and `--controls-idle-opacity` (an
appearance behavior magnitude, layout.css:41). Two live comments point at the wrong
home: usePaneHover.ts:22–24 says the idle opacity lives in "design-idioms.css"
(it is layout.css:41); EditorShell.vue:229–231 says the `--graph-*` tokens live in
"design-idioms.css" (layout.css:32–36). Meanwhile design-idioms.css hosts three
GEOMETRY tokens (`--rail-width`/`--panel-max-h`/`--mask-fade`,
design-idioms.css:40–52) with the stated reason "proof:idioms anchors these" — the
gate's anchor location dictating the token's home rather than the concern.

**Proposal (gestalt).** In the F1 codex wave, re-partition by concern (signal/
appearance → design-idioms.css; length/ratio → layout.css), move the four strays,
re-anchor proof:idioms to the new homes (gates follow the spec, not vice versa), and
correct the two stale pointers. One pass, cascade-order-neutral (both files import
before `@custom-variant`, style.css:14–15).

### F6 (MINOR) — NO-legacy drift on the documentation plane: the dead red authority and the pruned scenes survive in comments and gate prose

**Evidence.** The motion authority went violet at T.D7 (style.css:122–137,
design-idioms.css consumption comments), yet the square still narrates its tether and
focus ring as "the red motion-authority" in five places: SquareInstrument.vue:6,
SquareInstrument.vue:144, SquareScene.css:70, :79, :100 (the *values* are correct —
`var(--color-progress)` — the prose is legacy). font-roles.json's easing-curve-name
note still says the census enforces "all 7 scenes incl. easing" (six ship;
morph/motion-path/compose were pruned at T.E1/T.E3). proof-appearance-suffusion.mjs
clause (a) still specifies "motion-path traveller → --rainbow-cyan"
(proof-appearance-suffusion.mjs:22) for a scene that no longer exists.

**Proposal (gestalt).** A one-wave design-prose purge riding the F1 codex: every
design-rationale comment that names a dead authority, a dead scene, or a dead count
is re-pointed at the codex section that now owns the rationale (comments cite, the
codex states). The suffusion gate's clause table is re-cut against the shipping
scene set. This is the owner's NO-legacy edict applied where this lane found it
living: the documentation plane.

### F7 (MINOR) — Material lighting/specular literals lack a token family

**Evidence.** The system's only surviving raw color literals are "lighting":
CubeTarget's face sheen/shade gradients (`rgba(255,255,255,0.22)` …
`rgba(0,0,0,0.14)`, CubeTarget.css:115–133, including the elegant
`--lit`-parameterized specular at :132) and the sequence playhead cap's specular
edges mixed toward literal `white` (SequencePlayhead.vue:62–63). These are defensible
as material (a light source is not a theme signal), but they are the one class of
color the codex cannot currently name, and the white-specular reads differently
against the dark theme's near-black stage than the light theme's cream.

**Proposal (gestalt).** Name the material register in the F1 codex: a
`--specular` / `--shade` pair (foreground/background-mixed or literal by RULING),
consumed by the cube faces and the playhead cap — so the next lighting effect has a
vocabulary instead of a literal, and the "crayons are pinned, lighting is material"
distinction proof:crayon-preserved already implies becomes stated law.

---

## 3. Seams the T redesign did NOT leave (checked and clean)

- The easing gallery vs older scenes: NO register clash found — the gallery consumes
  the same Card/ToggleChip/rail/ball/`--ball-tone` idioms the pre-T scenes ride
  (EasingTarget.css:1–8, :159–180); its 1px rail is a *named* delta off the 2px
  idiom default (EasingTarget.css:135–141), exactly how a deviation should be made.
- Typography: the display rung appears only at sanctioned sites (font-roles.json
  roles; the four Target headers + square's "drag me" + the hero family); no rogue
  serif chrome found (the T.C "kill the serif chrome flip" held).
- The dock pair (ChromeDock top / TransportDock bottom) is one system: glass-ui dock
  primitives, DFA-projected affordances, body-register labels; the mobile dock-label
  rung step is a deliberate, documented fit (style.css:286–294).
- Z-order: one contract, one documented reconciliation (`--z-behind`,
  style.css:18–40, layout.css:25).

---

## What U must charter

1. **CHARTER THE DESIGN CODEX**: promote demo/DESIGN.md from the 28-line pre-S stub
   to the authoritative design-language spec (voices, color authorities, card
   registers, specimen grammar, idiom catalog, φ geometry, z-contract) that the
   design gates cite — spec-first, gates-derive. (F1)
2. **RECONCILE THE TWO SCENE GENRES under owner review**: design the subject-scene
   telemetry-whisper register for cube + amiga (the square corner-instrument idiom
   promoted) OR bless designed silence in the codex and re-cut the suffusion
   "headerless exception" into a rule; give cube's plate-lessness its stated
   rationale. (F2)
3. **COMPLETE AND HARDEN THE GOLDEN AUTHORITY**: add sequence-{light,dark} through
   the born-OWNER flow; pin the controls-pane idle state in the capture protocol
   (as PRM already is) and re-bless the state-inconsistent frames. (F3)
4. **PROMOTE ONE `.stage-legend` AFFORDANCE IDIOM** and give amiga + cube their verb
   lines (drag-to-spin/decay, orbit) — or fold designed silence into ask 2's fork. (F4)
5. **RE-PARTITION THE TOKEN HOMES by concern** (signal → design-idioms, geometry →
   layout), re-anchor proof:idioms, correct the two drifted home-pointers. (F5)
6. **PURGE DESIGN-PROSE LEGACY**: re-point the five "red motion-authority" comments,
   the "7 scenes" census note, and the suffusion gate's motion-path clause at the
   codex; comments cite, the codex states. (F6)
7. **NAME THE MATERIAL REGISTER**: a specular/shade token pair for the cube-face
   lighting and playhead cap, closing the last raw-literal class. (F7)

— lane 25, 2026-07-09
