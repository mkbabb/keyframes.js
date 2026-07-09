# Lane 04 — square (VERDICT #11, #12 · shot 10)

**Design authority lane.** Frontend-design skill loaded; aesthetic direction committed below.
Owner rulings for this surface: the caption block is "superfluous nonsense" — REMOVE (#11);
"what even happened to this — totally a mess and unusable"; "Square used to have a proper
keyframes, controls, etc section but that was removed?" — **the S.G2 honest-collapse is
REJECTED; the full controls/keyframes/timeline panel must return** (#12). Adjacent rulings
that bind this surface: #7 (the surrounding pane is superfluous), #8 (gesture-legend stamps
die wholesale), #5 (the cube's on-stage numeric readout dies — the same genus as square's
x/y strip), #16 ("latent red theme" rejected), #17 (single-option dock elision), #18
(bespoke pill/tab shells → glass-ui components), #19 (performance), #24 (fonts/sizes via
glass-ui).

## Evidence captured (this lane)

- `docs/tranches/T/audit/lanes/shots-04-square/square-desktop-idle.png` — 1440×900, built dist
- `docs/tranches/T/audit/lanes/shots-04-square/square-desktop-midtumble.png` — Play pressed (tumble fires)
- `docs/tranches/T/audit/lanes/shots-04-square/square-mobile-idle.png` — 375×812 (post-resize state)
- Owner shot: `docs/tranches/T/audit/owner-review/shots/10.png` (the caption block)
- The "used to be" reference, in-tree today: `scripts/baselines/visual-lock/square-desktop-open-controls.png`
  (the pre-G2 open panel: duration/delay/iterations/direction/fill/easing labeled rows +
  advanced + the visualizer/Play/Reverse/scrub card)
- DOM probes (playwright, built dist) — measurements inline below.

---

## Findings

### F1 — The S.G2 collapse amputated the scene's editor; the owner rules it back. The G2 dilemma must be resolved the OTHER way: make Play honest, don't remove the panel.

**Defect.** `CONTROL_SURFACES.square: []` (`demo/@/state/controlSurfaceDFA.ts:99`) — the
full triad the scene carried through every prior tranche
(`git show 021f0eb~1:demo/@/state/controlSurfaceDFA.ts` line 83: `square: ["controls",
"keyframes", "timeline"]`) was collapsed at commit `021f0eb` ("S.G2 S2: square honest
controls — collapse the lying panel"). What remains on stage is a mono caption block
(shot 10) standing in for an entire editor.

**Root cause — measured, not vibes.** The panel was "lying" because Play painted nothing.
I reproduced the mechanical kill:

- The per-animation interpolation path passes the transformFunc **nested `frame.vars` whose
  leaves are ValueUnits** (`src/animation/engine/interpolate.ts:285` —
  `frame.transform(anim.unflatten ? frame.vars : frame.flatVars, t)`; `unflatten` defaults
  `true` at `src/animation/engine/animation.ts:139`; `frame.vars` built nested at
  `src/animation/compile/frame-compiler.ts:410`).
- The scene's transformFunc (`demo/scenes/square/useSquareDemo.ts:63-100`) is written for
  the spring loop's **raw-number** diet: it does `` `translate(${tx}px, …)` `` and
  `scale * sx` arithmetic. Verified against the installed value.js:
  `` `${new ValueUnit(42,'px')}px` `` → `"42pxpx"`. One such leaf makes the whole
  `el.style.transform` string invalid CSS → CSSOM **silently discards the assignment** →
  the box never moves. (Arithmetic via `valueOf` works — `v * 2` → 84 — but the `d` leaf is
  authored `"100%"`/`"112%"`, so even a unit-fixed read would scale ×100 without a
  percent normalization.)
- Compounding: the contract keyframes themselves are motionless —
  `useSquareDemo.ts:337-348` authors `x: "0px" → "0px"`, `y: "0px" → "0px"`; only the
  nested `d` swells 100%→112% plus a color sweep. Even a working Play would show near-zero
  motion, so duration/easing/direction edits could never visibly govern anything.

S.G2 read "Play paints nothing" and amputated the panel (option (b) of the recorded
dilemma, `SquareScene.vue:103-114`). The owner's ruling selects option (a): **Play honestly
drives the keyframes animation — obeying panel duration/easing/direction — and the panel
returns.** The fix is one thin, honest seam (a unit normalizer at the transformFunc
boundary) plus real keyframes; the amputation was never necessary.

**Recommendation.** SQ-T1 below. Note the oracle inversions the wave must carry: 
`scripts/proof-square-honest.mjs` (231 L, asserts the collapse), 
`scripts/proof-scene-control-dfa.mjs:187` (`square: { hasPanel: false }`),
`scripts/proof-live-session.mjs` (square trigger `null`),
`test/demo/control-surface-dfa.test.ts` (square in the empty-set group) — all currently
gate-lock the REJECTED state. They flip to born-RED oracles for the restoration.

### F2 — The on-stage annotation layer is triple-stacked clutter, and two of its members visibly collide.

**Defect.** Desktop idle shot: the serif "Transform" telemetry title renders **on top of**
the gesture-legend stamp ("DRAG: MOVE ON TWO AXES / DOUBLE-TAP: TUMBLE") — an unreadable
z-collision in the top-left corner, live right now.

**Root cause.** Two absolutely-positioned layers claim the same corner of the same stage:
`GestureLegend.vue:64-66` (`top: 0.75rem; left: 0.75rem`) vs. `.square-telemetry`
(`SquareInstrument.vue:172-181`, `top: 1rem; left: 1.25rem`). S.G3 landed the legend after
L.W11 landed the telemetry; no gate reads corner occupancy (the gate-blindspot lesson, at
small scale). Meanwhile the bottom-right holds the ruled-dead caption block
(`SquareInstrument.vue:35-57` — the shot-10 "superfluous nonsense"), and the x/y readout +
SETTLED pill are the same genus the owner struck on cube (#5, "rx 0° ry 0° — Remove this
as well").

**Recommendation.** SQ-T2: the stage keeps exactly THREE things — the coordinate field
(quiet drafting-paper structure), the live tether (motion feedback, visible only in
flight), and the box. Legend, telemetry strip, caption: all die. Any readout worth keeping
lives in the restored panel, not on the stage.

### F3 — An EMPTY controls sheet renders on mobile for a scene whose surface set is [].

**Measurement** (fresh nav to `#/square` at 375×812, built dist):
`.controls-pane-wrapper` **renders** at `{x:0, y:639.5, w:375, h:64}` with classes
`controls-pane--mobile controls-pane--stage-subject`, containing a `.sheet-grab-handle`
(375×28) + grab pill + a `.controls-pane` of **375×36 with zero content**. After a
desktop→mobile resize the stub is worse: the captured `square-mobile-idle.png` shows an
expanded empty sheet occupying the bottom ~40% of the viewport around one empty rounded
field. A grab handle that opens nothing, occluding the stage the DFA said should own the
whole viewport.

**Root cause.** The S.G2 collapse emptied the DFA set but the pane wrapper/sheet chassis
mounts unconditionally — the chrome outlived its content. This is the mobile-sheet
occlusion systemic (S ledger) recurring in a new costume.

**Recommendation.** SQ-T3 (shared with the panel-facility lane): the wrapper mounts **iff**
`controlSurfacesFor(scene).length > 0`. For square this becomes moot once SQ-T1 restores
the triad — but the invariant must hold for home and any future empty-set scene.

### F4 — The restored panel must NOT resurrect the rejected chrome: no outer wrapper pane, no bespoke pill-tabs, no latent red.

**Evidence.** Shot 07 (the cube controls pane): the owner struck the outer wrapper ("remove
the surrounding pane — it's superfluous") — the pre-G2 square panel had the identical
double-plate (visual-lock baseline). #18 strikes `KfPillTabs.vue` ("why aren't these just
glass-ui components?"). #16 strikes the latent red — and square participates: the tether
stroke is `var(--color-progress)` (`SquareInstrument.vue:162`), the drag aura ring blooms
"the red motion-authority" (`SquareScene.vue:379-403`), the x/y numerals render red
(`readout-accent`, desktop shot).

**glass-ui 4.0.1 census (real, installed — `node_modules/@mkbabb/glass-ui`).** The
components the restored panel needs already exist as subpath exports:
`SegmentedTabs` (`./tabs`) — the Controls·Keyframes·Timeline switcher;
`LabeledField`/`LabeledInput`/`LabeledSelect`/`LabeledSlider`/`LabeledSwitch`
(`./labeled-field`) — the option rows; `NumberField` (`./number-field`) — duration/delay/
iterations; `EasingPicker`/`EasingConfigurator` + `useEasingPicker` (`./easing`) — the
easing row; `InstrumentChassis`/`ChassisDivider` (`./instrument-chassis`) — the panel
chassis; `Sheet` (`./sheet`) — mobile; `MetricBadge`/`StatusDot`/`AnimatedDigit` — if any
readout survives, it lives here. **Genuine glass-ui gaps** (delineate, don't fake): the
draggable-diamond `KeyframeTimeline` (glass-ui's `GlassTimeline` is a segment DISPLAY, not
an editor) and the Monaco keyframes editor remain demo-owned — BG/BH upstream candidates,
not blockers.

### F5 — Dock adjacencies observed from this surface (cross-lane, recorded for the dock lane).

Probe of visible dock buttons on square: `["Share animation", "Show keyboard shortcuts",
"Switch to dark mode", "", "", "Play animation"]` — the reset and clear icon buttons carry
**no accessible name** (empty aria-label/text). The dock shows a "Transform" animation
select for a scene with exactly ONE animation (#17: elide), and Play sits last (#6: Play
first). Owned by the dock lane; the square design below assumes those rulings land.

### F6 — Square's hot path does per-frame Vue reactive writes for decoration.

**Evidence.** `SquareScene.vue:145-154` — the `onTick` hook writes 4 refs
(`deflX/deflY/settled/tetherActive`) **every frame** the loop runs; each write re-runs the
`tetherPath` computed (`SquareInstrument.vue:84-98`) and patches an SVG `d` attribute
through the Vue reactivity graph. The loop itself is well-behaved (self-terminates on
settle — `useSquareDemo.ts:259`), but under #19 ("performance… rethought from the ground
up") the idiom is wrong: decorative geometry should ride the same imperative rAF write the
transform does, not the component update queue.

**Recommendation.** SQ-T5: the tether consumes two CSS custom properties
(`--defl-x`/`--defl-y`) written imperatively in the same `frame()` that paints the box;
Vue refs update only at gesture boundaries (start/settle). Zero component re-renders
during a steady drag.

---

## The target design (precise enough to implement)

**Aesthetic direction — "the drafting bench":** one quiet paper-grid stage carrying one
saturated subject, with ALL instrumentation in a single glass editor column. Refined
minimalism on the stage; density lives in the panel. Consonant with glass-ui: chassis,
tabs, labeled fields, and type rungs are glass-ui's — the demo contributes only the
subject, the physics, and the keyframes content.

**Layout (≥1024px).** The cube/amiga two-column register: stage `Card` (existing,
`surface=glass`, fills) left; the editor column right, fixed ~380px. The editor column is
**bare cards — no surrounding pane** (#7): `SegmentedTabs` (Controls · Keyframes ·
Timeline) directly above the active surface card, then the transport/visualizer card.
Chassis option: `InstrumentChassis` if the panel-facility lane adopts it fleet-wide —
square must not fork its own register. **Mobile:** glass-ui `Sheet` carrying the same
triad; the sheet exists only because content exists (F3 invariant).

**Stage (what remains).** The coordinate field (as-is, `--border` hairlines); the box
(`--subject-teal` chip, `text-display` Instrument Serif "drag me" — the scene's ONE display
moment); the tether, restroked from red to the subject's own authority:
`stroke: color-mix(in oklab, var(--subject-teal) 65%, var(--foreground))` — motion feedback
belongs to the subject, not a global red (#16). The drag aura/pulse rings re-key the same
mix. **Dies:** `GestureLegend` (node + import, `SquareScene.vue:16-23,95` — ruling #8), the
telemetry strip (`SquareInstrument.vue:21-33`), the caption/legend block
(`SquareInstrument.vue:35-57` — ruling #11). SquareInstrument shrinks to field + tether
(~90 lines) or folds into the scene SFC.

**Type ramp.** Panel field labels: `text-mono-small text-muted-foreground`, lowercase
(matches the loved shot-07 register). Values: Fira Code `tabular-nums` via
`LabeledInput`/`NumberField`. Tab labels: `SegmentedTabs` defaults (glass-ui owns them).
No `text-mono-caption` blocks anywhere on the stage; no serif anywhere but the chip.

**The honest Play (the G2 inversion, exact semantics).**

1. *Unit-honest transformFunc.* One normalizer at the boundary the two writers share:
   `num(v) = typeof v === "number" ? v : v.value`, percent-aware for the nested scale leaf
   (`d.unit === "%" ? d.value / 100 : d.value`). The spring loop's raw numbers and the
   engine's ValueUnit leaves both resolve; the `"0pxpx"` kill class becomes impossible.
2. *Real keyframes.* A four-corner diamond tour with a full rotation, the nested primitive
   doing visible work: `0%` center/0°/`d:100%` → `25%` (+90px,−90px)/90°/`d:108%` → `50%`
   (0,+90px)/180°/`d:100%` → `75%` (−90px,−90px)/270°/`d:108%` → `100%` center/360°;
   `backgroundColor` riding the sanctioned `--rainbow-*` stops (mount-resolved, the egg's
   existing idiom, `useSquareDemo.ts:131-147`). ±90px sits inside the ±110px spring travel
   envelope, so drag and playback share one coordinate world. Now duration, easing,
   direction, fill, iterations — every panel knob — visibly governs the paint.
3. *One paint authority per instant — a 3-state FSM.* `authority ∈ {idle, drag, playback}`.
   Play → `playback` (the group plays; springs dormant). Pointerdown on the box mid-play →
   `drag`: the group **pauses** (the existing scrub-pause-resume machine), the springs are
   seated from the box's current painted pose (`new DOMMatrix(getComputedStyle(box).transform)`
   → `springX.value = tx/TRAVEL`, target = same) — a seamless takeover, the library's own
   adopt/temporal-takeover idea dogfooded at demo scale. Release → springs settle → `idle`;
   Play resumes from the paused clock. The tumble double-tap egg stays (it is a gesture, not
   the Play verb); `isPlaying→tumble()` (`SquareScene.vue:114,165-167`) dies with the
   dishonest Play.
4. *DFA + oracles.* `CONTROL_SURFACES.square → ["controls","keyframes","timeline"]`; invert
   `proof:square-honest`, `proof-scene-control-dfa` EXPECT, `proof-live-session`, and the
   DFA unit test (F1 list). The Keyframes tab round-trip for nested-object vars
   (fromKeyframes ↔ serialized string) gets an explicit assertion in the inverted oracle.

**Motion.** Panel enter/tab switch: glass-ui's own transitions only. During playback the
existing `AnimationVisualizer` ball + timeline playhead track progress
(`useAnimationProgress` — already built, cube/amiga-proven). No bespoke entrance
choreography.

---

## T recommendations

1. **SQ-T1 — Restore the square editor triad with an honest Play (the G2 inversion).**
   Scope: DFA flip to the triad; unit-honest `num()` normalizer at the transformFunc
   boundary; the four-corner tour keyframes (motion + rotation + nested-`d` + rainbow
   stops); the {idle, drag, playback} single-authority FSM with pose-capture takeover;
   delete `isPlaying→tumble`; invert the four collapse-locked oracles.
   Gate: born-RED `proof:square-honest` v2 — triad tabs render on square; Play displaces
   the box ≥60px within one duration; editing duration 2000→500ms changes the measured
   tour period accordingly; easing change alters the mid-tour sample; pointerdown mid-play
   pauses the group and the box tracks the pointer with no frame jump; keyframes-string
   round-trips the nested shape. Size **M**.

2. **SQ-T2 — De-annotate the stage (rulings #5/#8/#11/#16 applied to square).**
   Scope: GestureLegend, telemetry strip, and caption block deleted; SquareInstrument
   reduced to field + tether; tether/aura restroked from `--color-progress` red to the
   subject-teal mix. Gate: on-stage text census for square = exactly {"drag me"}; zero
   `.square-legend`/`.square-telemetry`/GestureLegend nodes; computed tether stroke ≠ the
   progress-red token. Size **S**.

3. **SQ-T3 — No chrome without content: the pane wrapper/sheet mounts iff the scene's
   surface set is non-empty.** Scope: shared `ControlsPaneWrapper`/sheet mount condition on
   `controlSurfacesFor(scene).length` (square becomes a consumer, home stays the proof of
   emptiness); kills the measured 375×64 empty sheet stub + the post-resize expanded empty
   sheet. Gate: for every DFA-empty scene, zero `.controls-pane-wrapper` nodes at 375×812
   AND after a 1440→375 resize. Size **S** (coordinate with the panel-facility lane).

4. **SQ-T4 — glass-ui-first panel composition on the square path.** Scope: `SegmentedTabs`
   for the triad switcher (KfPillTabs dies here per #18), `LabeledInput`/`LabeledSelect`/
   `NumberField` for option rows, `EasingPicker` for the easing row, bare cards (no outer
   wrapper, #7); demo-owned Monaco editor + KeyframeTimeline remain, named as glass-ui
   BG/BH upstream candidates. Gate: component census on square's rendered panel — zero
   `KfPillTabs`, ≥1 `SegmentedTabs`, zero double-plate wrapper (no `Card` whose sole child
   is another `Card`). Size **M** (shared wave with the panel-facility lane; square is the
   proving scene).

5. **SQ-T5 — De-Vue the hot path.** Scope: tether geometry via `--defl-x`/`--defl-y` custom
   properties written imperatively inside the one `frame()`; Vue refs only at gesture
   boundaries; `onTick` shrinks to the settle signal. Gate: an instrumented 60-frame drag
   window records 0 SquareInstrument/SquareScene component updates (onUpdated counter)
   while the tether endpoint tracks the box within 1px. Size **S**.
