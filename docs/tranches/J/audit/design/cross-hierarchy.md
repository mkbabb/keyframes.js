# Tranche-J — Cross-pane HIERARCHY + INCONGRUENCE synthesis (shell-chrome lane)

Lane: `hierarchy-synthesis`. Read-only audit of all 48 screenshots
(`/docs/tranches/J/audit/design/screenshots/`) across 8 scenes × 3 viewports ×
{closed, open}. This is the ONE lane that sees every scene, so the focus is the
CROSS-SCENE single-product illusion: does the chrome speak one voice, do the 8
stages share one compositional grammar, does the rail·stage·rail grid hold.

Note on the checkerboard: the screenshot harness captured against a transparent
page alpha (the demo's grid-dot background did not rasterize), so the
checkerboard is the alpha mat, NOT a design surface. All findings judge
composition, surface, type, and placement — never the mat.

---

## Verdict (the state of the chrome)

The shell chrome (the two docks + scene-switcher) is genuinely single-voiced and
strong: one top GlassDock scene-switcher pill, one bottom morphing transport dock,
consistent rainbow play button, consistent expressive per-scene icon. The home
hero ("Select an animation...") is the design high-water mark — audacious
Instrument-Serif display type, a clean φ-ladder descent (display → italic subhead
→ caption), the trailing "..." dogfooded as motion-trail ghosts. That voice is the
brand.

The break is BELOW the chrome, in the stage + controls grammar. There are
deliberately THREE stage registers (`stageMode` = `subject` | `editor` |
`storyboard`, `demo/app/scenes.ts:190-207`) — defensible as content-shape
families — but the registers leak: (1) the `storyboard` group is NOT internally
consistent (spring has a full left-rail control panel; sequence + motion-path have
an EMPTY ghost rail and put controls inside the stage); (2) the left rail renders a
hollow 400px glass shell for the two no-control scenes; (3) the stage SURFACE
diverges — easing/spring/sequence/motion-path are rounded flat glass plates, but
amiga is a hard-edged unrounded desaturated gray slab, and cube/square/home float
bare on the grid; (4) two scenes float stage-level chrome (easing's metric header,
spring's mode toggle) in the top-center band where they COLLIDE with the
scene-switcher pill on mobile; (5) the home hero's editorial type voice appears on
home ALONE — the other 7 scenes never echo the φ-ladder display register, so the
landing promises a typographic identity the product then drops.

Top incongruences ranked below; the worst three (empty ghost rail, storyboard
control-placement schism, amiga gray-slab stage) most visibly break the
single-product illusion.

---

## Architectural map (root causes, attributed)

- **Two docks, two label affordances.** Top: `ChromeDock.vue` GlassDock pill shows
  the SCENE name + icon (Cube/Spring/Path). Bottom: `AnimationMenuBar.vue` GlassDock
  shows the ANIMATION name (Rotations/Spring Preview/Path traversal). Both are
  glass-ui `GlassDock` + `DockSelectTrigger` — consistent surface, but two
  separate name-bearing dropdowns is a latent duplication users must learn.
- **Three stage registers** declared in `scenes.ts` `STAGE_MODES`: `subject`
  (home/cube/amiga/square — subject floats on grid, no card), `editor` (easing —
  glass card), `storyboard` (spring/sequence/motion-path — glass card). The
  §STAGE-CARD register note (`design-idioms.css:480-523`, I5) converged
  easing/spring/sequence/motion-path onto ONE `<Card surface="glass"
  tier="resting" :shadow="false">` plate — this DID land (the rounded flat plates).
  amiga is NOT in that set (its Three.js canvas is the stage), which is why it is
  the lone unrounded gray rectangle.
- **The empty rail.** `AnimationControlsGroup.vue:11` always mounts
  `ControlsPaneWrapper`, `v-show`'d only on `selectedAnimation && !hideControls`
  (`ControlsPaneWrapper.vue:3`). Sequence + motion-path HAVE a selected animation
  ("Sequence Preview" / "Path traversal") but contribute NO `AnimationControls`
  panel content (DFA control-surface set is `[]` — `ChromeDock.vue:88-92`), so the
  wrapper renders its grab-handle pill + an empty `.controls-content` card,
  reserving the full `--rail-width: 400px` (`design-idioms.css:112`) as dead space.
- **Stage-level floating chrome.** easing's `ease F(t)=…` + `Singular` header and
  spring's `Live solver / Discrete transition` toggle live ABOVE/inside the stage,
  in the top-center band — the same band the top GlassDock occupies.

---

## TOP-10 incongruences (ranked by how visibly they break the single-product illusion)

1. **Empty 400px ghost rail (sequence, motion-path).** [P1] A hollow rounded glass
   bar floats top-left with nothing in it; the rest of the 400px [rail] track is
   void, shoving the stage card right and leaving a vast asymmetric empty column.
   `sequence-desktop.png` / `motion-path-desktop.png` top-left; identical in the
   `-open` variants (open changes nothing — proof the rail has no content).
2. **Storyboard control-placement schism.** [P1] The three `storyboard` scenes
   disagree on where playback lives: spring has a FULL left-rail control panel +
   playback card (`spring-desktop.png` left); sequence puts transport INSIDE the
   stage as a flat text row (Play/Reverse/1×/Reset, `sequence-desktop.png` bottom
   of stage); motion-path puts it in the bottom dock only. Same declared register,
   three different control architectures.
3. **amiga stage = hard-edged gray slab.** [P2/P1] Every other contained stage
   (easing/spring/sequence/motion-path) is a rounded flat GLASS plate; amiga's
   Three.js "room" is an unrounded, full-saturation-gray rectangle
   (`amiga-laptop.png` / `amiga-desktop.png` stage). It is the heaviest, least-glass,
   least-colorful surface in the set — neither calm glass field nor a saturated pop.
4. **Top-band collision (easing, spring) on mobile.** [P1] easing's `ease … Singular`
   header (`easing-mobile.png` top) and spring's `Live solver/Discrete` toggle
   (`spring-mobile.png` top) overlap the centered scene-switcher pill — two chrome
   layers stacked in the same top-center band.
5. **Home hero voice is orphaned.** [P2] The audacious φ-ladder serif hero appears
   on home ONLY (`home-laptop.png`, `home-desktop.png`); all 7 other scenes lead
   with mono labels + a stage card and never echo the display register. The landing
   promises a type identity the product drops.
6. **Stage-header pattern present on 3 of 8.** [P2] easing/spring/sequence/motion-path
   carry a `TITLE  metric=val · metric=val` header (+ right-side action/pill);
   cube/amiga/home/square have NONE. Half the scenes brand the stage, half don't —
   so the stage header reads as a per-scene decision, not a system.
7. **Home subject collides with hero type on mobile.** [P1] The cube overlaps the
   word "animation" and the instruction line "from the list… press Play"
   (`home-mobile.png`) — type and subject fight for the same pixels; the
   "or drag M. cubert" caption is buried under the yellow face.
8. **Subject vertical placement drifts across `subject` scenes.** [P2] cube sits
   center-right with axes bleeding off-canvas (`cube-desktop.png`); square sits
   lower center-right (`square-desktop.png`); amiga's sphere is dead-center in its
   room. No shared framing baseline for the three bare-subject scenes.
9. **Mobile sheet covers the subject (square, amiga).** [P2] The bottom controls
   sheet clips the lower edge of the green square (`square-mobile.png`) and crowds
   the amiga sphere (`amiga-mobile.png`); on the no-control scenes the sheet is a
   hollow grab-handle-only shell peeking up (`sequence-mobile.png`,
   `motion-path-mobile.png`).
10. **Sequence stage header wraps/clips on mobile.** [P2] `STAGGER × 5 · PROGRESS 0%`
    collides with the clapperboard + READY pill on the right; the `%` is cut to
    `0` (`sequence-mobile.png` header).

---

## Sub-audits

### (a) The SHELL — single voice? Mostly yes.
Top GlassDock scene-switcher pill is identical across all 8 scenes (icon + label +
chevron, `ChromeDock.vue:240-247`). Bottom transport dock is identical (reset /
trash / rainbow play, `AnimationMenuBar.vue`). The rainbow play button
(`rainbow-pastel` idle → `rainbow-vivid` playing) and the expressive per-scene SVG
icons are the strongest single-voice elements — the chrome itself is NOT the
problem. The two divergences are: the dual name-bearing dropdowns (scene name top,
animation name bottom — a learnable but real duplication), and the stage-level
floating chrome (#4/#6) that breaks the "all chrome lives in the two docks"
contract.

### (b) The STAGE pattern — 8 dialects, not one grammar.
- **No card, bare on grid:** home, cube, square (subject floats; axes/subject bleed).
- **Rounded flat glass plate + metric header:** easing, spring, sequence, motion-path.
- **Hard gray unrounded slab:** amiga (the outlier; #3).
That is three surface treatments and a header that appears on 4 of 8. The
`stageMode` registers explain the card/no-card split intentionally, but amiga's
slab and the header's half-presence are un-systematized.

### (c) The CONTROLS pattern — at least three register dialects.
- **Dual-card left rail** (timing panel + playback card): cube, amiga, square,
  easing, spring.
- **Empty ghost rail** (grab-handle + void): sequence, motion-path (#1).
- **Playback affordance forks THREE ways:** left-rail pill buttons ("Play ▷ /
  Reverse ⇄" + 3-dot scrubber); sequence's in-stage flat text row
  ("Play / Reverse / 1× / Reset"); the bottom dock's rainbow button. Three
  playback registers for one play action.
- Easing's left rail = curve-canvas card + easing-select + a duration-slider
  playback card — a 4th rail composition distinct from the cube/square timing panel.

### (d) The GRID — rail·stage·rail traces cleanly, except the void.
The named `grid-template-columns: [rail] var(--rail-width) [stage] 1fr`
(`AnimationControlsGroup.vue:460`) holds at desktop/laptop. The fall-off-grid case
is the empty rail (#1): the [rail] track is reserved at 400px even when its content
is hollow, so sequence/motion-path render a 400px void left of a right-shoved stage.
On mobile the rail collapses into the bottom sheet correctly — but for no-control
scenes the sheet is an empty grab-handle shell (#9).

### (e) Vertical rhythm / density — spring cramped, cube/square/amiga sparse.
- **Densest:** spring left rail (a tall single panel — sliders + 4 preset chips + 4
  preset rails + a code block — pushes the playback card below the fold,
  `spring-laptop.png`). Reads cramped.
- **Sparsest:** cube/amiga/square left rail bottoms out at the playback card with a
  large empty lower half; easing's stage is near-empty white with one green ball
  (`easing-laptop.png`). Reads under-filled.
- The median is the cube/square timing-panel rhythm; spring is the louder outlier
  above it, easing's empty stage the quieter outlier below.

### (f) See TOP-10 ranking above.

---

## Suffusion opportunities (audacious type + color, in proportion — chrome lane)

- **Echo the home hero's display register into every stage header.** The
  metric-header titles (`SpringProgress`, `MotionPath`, `Sequence`) are currently
  mono/sans bold; rendering the title word in the Instrument-Serif display face
  (the φ-ladder display step) would carry the home brand voice into the 7 inner
  scenes that orphan it (#5) — proportionate (one word per stage), not decorative.
- **Make the empty rail a typographic moment, not a void.** For sequence/motion-path,
  the freed 400px could host a large serif scene-title + a one-line φ-ladder
  description (the brand voice), turning dead space into editorial hierarchy rather
  than a ghost pill (#1).
- **The amiga slab wants the glass register, not gray.** A glass-plate frame (or a
  tinted, less-desaturated room) would let the checkered sphere read as the
  saturated pop against a calm field instead of a flat gray rectangle (#3).

---

## glass-ui handoff items (ALL changes land in glass-ui repo, never patched here)

- **`GlassDock` no-occlusion in the top-center band.** The stage-level floating
  chrome collision (#4) is partly a band-contention problem: glass-ui's dock owns
  the top-center safe band; a documented "reserved band" the app can query would
  let scenes place their metric header WITHOUT manual collision math.
- **`cartoon-surface` / card-rounding primitive** (already a BOOKed inv-16 handoff,
  `design-idioms.css:515-523`): a `cartoon-surface`-only element can still render
  square; the durable fix (default `border-radius: var(--radius-card)` or a
  `cartoon-card` primitive) belongs in glass-ui. Relevant because the stage-plate
  rounding is currently guaranteed only by the `<Card>` swap, not the utility.
- **`LabeledField orientation="horizontal"` subgrid participation** (BOOKed,
  `design-idioms.css:561-566`): the demo carries a parent-subgrid wrapper
  (`.labeled-field-grid`) to get one uniform label column; born-subgrid fields
  would retire that wrapper. The cross-scene label-rhythm consistency depends on it.
