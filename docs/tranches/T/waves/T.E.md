# T.E — THE PRUNE + THE SVG REDEMPTION

> **Status: DEVELOPMENT. Implementation NOT authorized.** Docs-only wave specs.
>
> **Band role.** T.E is the SUBTRACTIVE band — it shrinks the surface every other band
> then touches (charter §2 DAG: "T.E (prune + removals, early) — shrinks the surface every
> band touches"). Three motions: **(1) the prune** (compose deleted outright; morph +
> motion-path forked FUSE-vs-PRUNE under **OD-1**); **(2) the easing redemption** (the
> owner-ruled "just the easing balls" #14 made into the specimen-drawer gallery, the
> 1,082L hand-rolled editor replaced by glass-ui `EasingPicker`, the latent-red theme and
> wrong fonts cured on-surface); **(3) the lockstep discipline** — every ruled removal
> executed WITH its gates rewired in the SAME motion (lane 18's rule; the fleet-wide
> `gesture-manifest`/`easter-egg`/`design-refinement` retirement, feeding T.M7's ledger).
>
> **The band's own meta-fact.** T.E is where the divergence-manufacturing gates concentrate:
> five of lane 29's nine **inverted-oracle** gates (`gesture-manifest`, `easter-egg`,
> `design-refinement`, the easing surface-locks, `compose-scene`) live on surfaces this
> band removes. Removing the feature WITHOUT re-cutting the gate reds a gate on the
> *rejected UI's absence* — the exact lane-18 anti-pattern. **Every removal wave here
> carries an explicit lockstep clause; T.E11 is the fleet synchronization point.**
>
> **Lanes:** 07-prune-triage (recs 1, 2, 5, 6 — recs 3/4 are T.A14/T.A15), 05-easing (ALL),
> 18-brittle-selectors (rec 3 — the lockstep exemplar), 26-plan-vs-landed-FGH (recs 4, 6, 7),
> 29-gate-oracle-gap (T-GATE-RETIRE execution list; the mechanism is T.M7).
>
> **OD-1 is this band's fork.** Charter §3 OD-1 (morph + motion-path: PRUNE outright vs FUSE
> into `scenes/svg/`) is served HERE by spec'ing **both paths fully** — T.E2 (the fuse) and
> T.E3 (the prune-alt) — mutually exclusive, the owner ruling selecting which executes. Both
> are **BORN-OWNER** (cannot green without the OD-1 token, per T.M2). Compose is NOT forked:
> its deletion is owner-RULED (#23), so T.E1 is plain **BORN-RED**.

## Wave index

| id | title | size | born | OD | lanes |
|---|---|---|---|---|---|
| T.E1 | Prune the compose scene in totality | M | RED | — (#23 ruled) | 07 rec 1 |
| T.E2 | SVG fusion — one `scenes/svg/` (MotionPath · MorphSVG · DrawSVG) on the standard panel | L | **OWNER** | **OD-1 FUSE** | 07 rec 2; 26 rec 7 |
| T.E3 | OD-1 alternative — prune morph + motion-path outright | M | **OWNER** | **OD-1 PRUNE** | 07 rec 2 (alt); 26 rec 7 |
| T.E4 | Kill the utility-keyed-layout rule class (`.z-dock:has(> .pointer-events-auto)`) | S | RED | — | 07 rec 5 |
| T.E5 | Readout-truth — a live metric samples the engine or does not exist | S | RED | — | 07 rec 6 |
| T.E6 | The specimen-drawer gallery IS the easing scene | L | **OWNER** | (no OD row — rides T.M2; #14 direction ruled) | 05 rec 1 |
| T.E7 | Execute the easing removals (curve-physics #13 + gallery door #15) | S | RED | — | 05 rec 2 |
| T.E8 | ONE editor — glass-ui `EasingPicker` replaces the 1,082L hand-rolled cluster | M | RED | — | 05 rec 3 |
| T.E9 | De-red the motion tokens + one violet hue authority (easing-scoped) | S | RED | (hue value → T.D/OD-6) | 05 rec 4 |
| T.E10 | Type honesty — glass-ui font kit + rendered-rung assertions (easing-scoped) | M | RED | — | 05 rec 5 |
| T.E11 | The ruled-removal gate-rewire lockstep + the T.E-coupled retirement execution list | M | RED | — | 18 rec 3; 26 recs 4, 6; 29 rec 6 (exec) |

All eight BORN-RED waves red on today's `tranche-s-impl` tree (verified: the delete-targets,
the fragile rule, the frozen readouts, and every retire-target gate are all present — §"Verified
on the tree" below). The three BORN-OWNER waves (T.E2/T.E3 the OD-1 fork, T.E6 the easing design)
carry falsifiable born-RED oracles that MAY NOT BE AUTHORED until their owner token lands (T.M2).

**Verified on the tree (the born-RED plants).** `demo/scenes/compose/` present (12 files incl.
`asset-manager/`); `.z-dock:has(> .pointer-events-auto)` at `style.css:452`; scenes registry
descriptors `motion-path`:205 / `morph`:222 / `compose`:242 (`scenes.ts`); `SCENE_GATE_META`
`morph:`139 / `compose:`148 (`demo-driver.mjs`); DFA `square:`[]`:99 / `compose:["assets"]`:112 /
`assets` surface:197 (`controlSurfaceDFA.ts`); `demo/@/components/custom/easing-editor/` present
(4 SFCs, 1,082L); glass-ui ships `EasingPicker` at `@mkbabb/glass-ui/easing` (`package.json:354`,
`dist/components/custom/easing/`); `--color-progress: var(--accent-red)` `style.css:388` (light
`accent-red hsl(0 72% 63%)`:346, dark `hsl(5 55% 50%)`:404); `proof:{compose-scene, morph-scene,
motion-path, -copy, -editable, -scale, gesture-manifest, easter-egg, design-refinement,
easing-sidebar-minimal, -normalized, easing-stage-is-ball, easing-canvas-bounded}` all present in
`package.json`; `scripts/{gesture-manifest, proof-gesture-manifest, proof-easter-egg}.mjs` present;
retire-target keys referenced by the roster aggregators `demo-roster.mjs` + `gate-bands.mjs`.

---

## The prune (lane 07 recs 1, 2; lane 26 rec 7) — T.E1 … T.E3

### T.E1 — Prune the compose scene in totality
- **Scope.** Delete `demo/scenes/compose/` in full (**1,672L** — ComposeScene 165 +
  ComposeTarget 183 + useComposeDemo 110 + composeKeys 17 + `asset-manager/` 1,197, a
  half-built mini-Figma orthogonal to a library demo). The scene is **owner-ruled for
  deletion** (#23: "just straight up remove this crap") AND independently dead: the core
  loop (drop asset → see it → bind motion) is impossible — the moment the first asset lands,
  `.z-dock:has(> .pointer-events-auto)` (`style.css:452-455`) re-tethers the AssetViewport
  off its `inset-0` and collapses the asset layer to **height 0** (lane 07 F1: measured
  `(518,782) 878×0`, the added asset at `(618,882)` clipped below an h=0 ancestor,
  `elementFromPoint` at its center returns nothing). It **dogfoods nothing uniquely**:
  `presets` has homes in `scenes/cube/useCubeDemo.ts` + `KeyframesEditor.vue`; `fromDrawSVG`
  survives in the easing curve self-draw (→ becomes the SVG scene's Draw act, T.E2). Remove
  the scenes.ts descriptor (`:242`), the `SCENE_GATE_META compose:` entry
  (`demo-driver.mjs:148`), the DFA `compose:["assets"]` row + the `assets` tab wiring
  (`controlSurfaceDFA.ts:112,197`), and any persisted-state migration (a stored
  `activeScene:"compose"` must land on home, not a dead route). Routes 9 → 8.
- **Gate (BORN-RED).** `proof:manifest-sourced` green with **no `compose` id** in any registry;
  `grep -riE "compose" demo/ scripts/` → **0 product hits** (the scene-name string is gone from
  router/DFA/gate-meta/roster); the roster `proof:` count drops by exactly one (`compose-scene`
  retired via T.E11). **Reds today:** `demo/scenes/compose/` exists, the descriptor + DFA row +
  gate-meta entry all resolve, `proof:compose-scene` is in the roster.
- **Size.** M. **Lanes.** 07 rec 1 (T-PRUNE-COMPOSE).
- **Edges.** The `.z-dock:has` rule that killed compose is a whole **class** of fragile rule —
  its class-wide kill is **T.E4** (never leave the compose-killer's siblings alive). The
  at-rest "no compose route" is corroborated by **T.M4** stage-inventory (compose absent from
  every manifest). Persisted-state migration coordinates with the scene machine (**T.B**
  superKey → SceneId + machine reset).
- **Lockstep** (lane 18 rule). `proof:compose-scene` + `test/demo/asset-store-singleton.test.ts`
  are retired in the SAME motion the directory is deleted — the stale-key guard in
  `SCENE_GATE_META` **THROWS** until the entry is removed (good: loud, not silent). Retired via
  T.E11's ledger (feeds T.M7's no-orphan-key completion gate). **Do NOT** leave
  `proof:compose-scene` in `demo-roster.mjs`/`gate-bands.mjs` pointing at a deleted scene.

### T.E2 — SVG fusion: one `scenes/svg/` — MotionPath · MorphSVG · DrawSVG on the standard panel · **OD-1 FUSE path**
- **Scope.** Fuse `scenes/motion-path/` (1,281L) + `scenes/morph/` (631L) into ONE
  `scenes/svg/` scene (~450L, every module ≤500L) — **three library SVG factories as three
  sub-animations of one contract `AnimationGroup`** (superKey `"SVG"`), mirroring the library's
  own `src/animation/svg/` (one zone, three factories over a shared handle base). This is the
  **redemption** path: both scenes work live today but LOOK dead (motion-path "barely works"
  #20 — cold-enters paused, and every readout is frozen during playback because it reads the
  drag-local `distance`/`tangentDeg`, never the engine sweep, lane 07 F2; morph "does not work
  at all" #21 — the invisible-at-rest fragility, lane 07 F3, cured at the LIBRARY seam by
  **T.A14**). The three acts:
  1. **Path** — `fromMotionPath` traveller (a plain `.progress-ball` glass dot, **no emoji**)
     sweeping the fixed figure-loop, `offset-rotate:auto`, accent `--rainbow-cyan`. The
     traveller drag-scrub (`useDragScrub` + `ManualTimeline`) is KEPT (real dogfood). The
     9-point editable control net + tethers + ARIA-slider handles, the copy-`offset-path`
     artifact, the DrawSVG self-build intro, the marching-ants `mp-ants` permanent WAAPI loop
     (`MotionPathTarget.vue:341`), the emoji traveller + full-lap 😎 wink egg
     (`useMotionPathGesture.ts:276-301`) all **DIE**.
  2. **Morph** — `fromMorphSVG` subject breathing between ring shapes, accent `--rainbow-violet`,
     **attribute-first rendering** (consumes **T.A14**: the `from` shape rides the SVG `d`
     ATTRIBUTE; the scoped `d: var(--morph-d)` rule dies). Ghost outlines stay (they read well);
     the orient glyph + tangent badge die.
  3. **Draw** — `fromDrawSVG` self-drawing a stroke figure, accent `--rainbow-green` — a
     first-class DrawSVG exhibit at ~30L (today DrawSVG hides inside eggs).
  Act selection is the **standard dock animation Select** (3 real sub-animations → the #17
  elision rule shows it legitimately). Each act carries the **FULL standard panel** (controls
  · keyframes · timeline) — the group members are honest `CSSKeyframesAnimation`s, so the
  facility works with **zero bespoke panel code**. This single move answers #25/#18 ("forgot
  the panel facility") for this surface. The scene **cold-enters PLAYING** (consumes **T.A15**).
  One shared blueprint stage recipe (`aspect-ratio:1`, `min(100%,26rem)` — the dedup'd
  `.mp-stage`/`.morph-stage`); no captions (prose → `animationDescriptions.ts`); no telemetry;
  no eggs; no legends. **Design principle (lane 26 rec 7, F8):** each act consumes a NAMED
  engine primitive as a real library artifact — the VT-d/EN-d "real-artifact-in-a-scene"
  dogfood pattern, preserved as the model.
- **Gate (BORN-OWNER — OD-1 FUSE token required; then BORN-RED).** `proof:svg-scene` —
  `navToScene("svg")` → the dock Select lists **exactly 3** sub-animations; for each act the
  subject's rect / `d` / `stroke-dashoffset` **measurably changes within 1.5s of cold entry**
  with zero synthetic presses; the Controls tab projects for every act; every `scenes/svg/*`
  module ≤500L. Rides **T.M3** owner-golden for the per-act render fidelity. **May not be
  authored until OD-1 carries the FUSE token** (T.M2: the fuse-vs-prune disposition is
  crystallised the moment this oracle exists). **Reds today** (once authored, FUSE-selected):
  there is no `svg` scene, no `#/svg` route, no 3-act Select.
- **Size.** L. **Lanes.** 07 rec 2 (T-SVG-FUSION); 26 rec 7 (the dogfood-pattern model).
- **Edges.** **Consumes T.A14** (MorphSVG attribute-first — the morph act's visible-at-rest
  contract, a LIBRARY wave) and **T.A15** (autoplay — cold-enter playing). The full panel per
  act IS **T.B**'s SceneFacility triad (the group members are honest engine animations → the
  standard controls/keyframes/timeline mount with no bespoke code; T.B owns the facility, T.E
  is the consumer). The blueprint-stage color tokens (per-act rainbow accent) ride **T.D**'s
  look language + **T.M** capture sign-off (appearance). The frozen-readout cure is **T.E5**.
- **Lockstep** (lane 18 rule). `proof:morph-scene`, `proof:motion-path{,-copy,-editable,-scale}`
  are retired in the SAME motion (their scenes are gone) — ONE `proof:svg-scene` born; the
  `SCENE_GATE_META motion-path:`/`morph:` entries + scenes.ts descriptors (:205/:222) removed;
  `test/demo/{motion-path,morph}-scene.test.ts` → one `svg-scene` test. **LIBRARY gates
  survive untouched:** `proof:morph-renders-d` (extended by T.A14, not retired),
  `proof:morph-orients`, `proof:morphsvg-consume`, `test/svg/*` — the published
  `MotionPath`/`MorphSVG`/`DrawSVG` factories are unaffected (F6 ledger). Retirement executed
  via T.E11 / T.M7.

### T.E3 — OD-1 alternative: prune morph + motion-path outright · **OD-1 PRUNE path**
- **Scope.** The alternative fork the owner named FIRST (#23: "motion-path, morph, and compose
  **likely need to just be pruned**"). Delete `scenes/motion-path/` (1,281L) + `scenes/morph/`
  (631L) outright, exactly as T.E1 deletes compose — descriptors (`scenes.ts:205,222`),
  `SCENE_GATE_META` entries (`demo-driver.mjs:139` + motion-path), DFA rows, persisted-state
  migration, routes 8 → 6. **No `scenes/svg/` is created.** DrawSVG loses its only would-be
  exhibit; `fromMotionPath`/`fromMorphSVG`/`fromDrawSVG` remain published HEAVY engine keys with
  library tests + README (F6: published-surface claims unaffected in BOTH branches). **T.A14**
  (MorphSVG attribute-first) still lands as a LIBRARY correctness fix even here (README-documented,
  test-covered) — it simply has no demo consumer (flagged, §Charter conflicts note 5).
- **Gate (BORN-OWNER — OD-1 PRUNE token required; then BORN-RED).** `proof:manifest-sourced`
  green with **no `morph`/`motion-path` ids**; `grep -riE "motion-path|morph-scene" demo/app
  demo/scenes scripts/` → 0 product hits (library `MorphSVG`/`MotionPath` engine references
  survive); roster `proof:` count drops by the four motion-path + one morph demo gates. **May
  not be authored until OD-1 carries the PRUNE token** (T.M2). **Reds today** (once authored,
  PRUNE-selected): both scenes + their descriptors + gates resolve.
- **Size.** M. **Lanes.** 07 rec 2 (the PRUNE alternative); 26 rec 7.
- **Edges.** **Mutually exclusive with T.E2** — the OD-1 ruling selects exactly one; the impl
  drive authors the SELECTED wave's born-RED oracle only (never both). If PRUNE: **T.A14**'s
  demo-consumption edge (the morph act) evaporates; the library wave still lands. **T.M5**'s
  `subject-full` morph clause is retired (no morph scene to render), not reshaped.
- **Lockstep** (lane 18 rule). Same gate retirements as T.E2's motion-path/morph half
  (`morph-scene`, `motion-path{,-copy,-editable,-scale}`) — but here **no `svg-scene` replaces
  them**; the keys are pure deletions. `test/demo/{motion-path,morph}-scene.test.ts` deleted.
  Executed via T.E11 / T.M7.

---

## The structural rules (lane 07 recs 5, 6) — T.E4 … T.E5

### T.E4 — Kill the utility-keyed-layout rule class
- **Scope.** The compose-killer (`style.css:452-455`) is not a one-off — it is a **class** of
  rule: a layout/position declaration keyed onto a **generic z-index utility class** plus a
  `:has()` structural test. `.z-dock:has(> .pointer-events-auto)` was written for the top
  scene-switcher dock pill but fires on ANY `.z-dock` element with a `pointer-events-auto`
  child — which the AssetViewport root also was (`AssetViewport.vue:4,45`). **Fix:** the dock
  anchor-tether re-keys onto an explicit opt-in attribute (`[data-dock-tether]`) on the two
  real dock bands; **no layout/position rule may key on a `z-*` or `pointer-events-*` utility
  class**, and the whole class of `:has()`-driven repositioning on shared utility selectors
  dies (not just the one instance). This is the fragile-CSS defect genus #28 (brittle selector
  + fragile CSS), invisible to source-shape gates.
- **Gate (BORN-RED).** A `proof:brittleness` clause (extends lane 18's shape): **zero `:has(`
  selectors** carrying `position`/`top`/`bottom`/`inset`/`position-anchor` declarations keyed to
  a utility-class root, and zero `position`/`top`/`bottom` declarations rooted on a `z-*` or
  `pointer-events-*` class, in demo styles; the rule census is greppable. **Reds today:**
  `style.css:452` matches (`.z-dock:has(> .pointer-events-auto)` sets `position-anchor` + `top`).
- **Size.** S. **Lanes.** 07 rec 5 (T-NO-UTILITY-KEYED-LAYOUT).
- **Edges.** The compose deletion (**T.E1**) removes the *victim* (AssetViewport); this wave
  removes the *weapon* (the rule class) so no future utility-keyed reposition can re-fire on a
  survivor. The `[data-dock-tether]` opt-in coordinates with **T.C** (dock grammar recut) and
  **T.D**'s dock-anchor calc-labyrinth → anchor-positioning move (edge: T.D owns the anchor
  idiom; this wave supplies the explicit-attribute contract the tether keys on). The clause
  extends **T.M6**/lane-18's brittleness widening (T.F owns the broader brittle-selector
  hardening; this wave owns the specific class-kill).
- **Lockstep.** The `proof:brittleness` extension is authored WITH the rule kill (never green
  by loosening); the dock's `[data-dock-tether]` attribute is added to the two dock bands in the
  same motion the `.z-dock:has` rule is removed (never leave the dock un-tethered).

### T.E5 — Readout-truth: a live metric samples the engine or does not exist
- **Scope.** A displayed live numeric readout must sample the ENGINE, not a gesture-local ref.
  Motion-path's header `OFFSET-DISTANCE 0%` / `TANGENT -89°` badges read `distance`/`tangentDeg`
  (`useMotionPathGesture.ts:53-58`), written **only** by the drag/keyboard `applyDistance()`
  path (`:241-254`) — so under playback the ball moves while the instrument swears **0%** (lane
  07 F2 §3: the scene contradicts itself). **Fix:** one shared **playback-gated
  progress-sampling seam** (the existing `useAnimationProgress`/`useRafFn` pattern) for any
  surviving readout; the gesture-local frozen refs die. Paired honesty defect: morph's glyph
  poll `useRafFn(readGlyph)` is resumed on mount and **never gated on playback**
  (`MorphTarget.vue:167-174`) — a full `interpFrames(anim.t)` + `clientWidth` read every frame
  **forever, even paused** (#19 perf sibling). The poll becomes playback-gated (zero
  `interpFrames` calls per second at rest).
- **Gate (BORN-RED).** On the SVG scene under machine-playing, any rendered numeric readout
  **strictly advances across 3 samples 500ms apart**; with the machine paused, **zero
  `interpFrames` calls per second** (instrumentable via a dev counter). **Reds today:**
  motion-path's `OFFSET-DISTANCE` reads 0% mid-playback (frozen); morph's poll runs paused.
- **Size.** S. **Lanes.** 07 rec 6 (T-READOUT-TRUTH).
- **Edges.** The surviving readouts live in **T.E2**'s SVG scene (this wave supplies the
  sampling seam that scene's badges consume). The paused-poll cure is a **T.G** true-rest slice
  (edge: T.G owns the fleet true-rest oracle + CDP-counter methodology; this wave supplies the
  scene-local gate). If OD-1 = PRUNE (**T.E3**), this wave narrows to the shared-seam contract
  for any surviving readout (the motion-path/morph badges are gone with the scenes) — flagged.
- **Lockstep.** The playback-gated poll is an actuation-adjacent change: re-verify any gate/
  driver that observed the frozen readout or the always-on poll (none gate the frozen value
  today — that IS the defect — so this is a NEW dev counter, roster-added, not a retirement).

---

## The easing redemption (lane 05, ALL) — T.E6 … T.E10

### T.E6 — The specimen-drawer gallery IS the easing scene
- **Scope (the core, ruling #14).** The owner: "we should just have the easing balls previewed
  here" (#14) — and the balls preview **already exists, buried** behind `viewMode = ref("singular")`
  (`EasingTarget.vue:169`): switching the unlabeled "Singular" Select to "All" reveals every
  named curve with its own ball sweeping its own rail (lane 05 §1.2). The core T move is an
  **inversion, not an invention**: promote that mode to BE the scene, delete the singular hero.
  Replace `EasingHeroStage.vue` (390L), `useEasingGhost.ts` (44L), `useEasingTraceSmear.ts` (57L),
  the view-mode Select + `visibleCurves` row-list, the hero handle overlay, and the beam/smear/
  self-draw with **the specimen drawer**: a responsive grid (`repeat(auto-fill, minmax(150px,
  1fr))`) of easing **tiles** inside `FadingScroll`, each a glass-ui `ToggleChip variant="cell"`
  (single-select via a surrounding `ToggleGroup`) — upper region a hairline rail + a **14px
  violet ball** sweeping `x = fn(phase)·maxX` over the curve's static sparkline; lower region the
  curve name (`text-mono-caption`, room to breathe, no truncation at the 150px floor). Header:
  the selected curve's name in `text-display` Instrument Serif + its re-parseable literal
  (Fira Code 14px + `CopyButton`, never truncated) on the left; the **family-filter
  `ToggleGroup`** (All · Standard · Sine · Quad · … · Back · Bounce · Steps) replacing the
  "Singular" Select on the right. **ONE shared sweep clock** (the existing `demo.progress`
  contract sweep) drives every tile — all balls depart together, arrive per their curve (the
  comparative read that makes the classic form pedagogic). The `registerDotPainter` direct-write
  seam + the contract animation **SURVIVE** (I.W4 D4 proved direct `style.transform` off the
  render graph is the right engine for a 36-ball grid). Performance budget (#19): transforms
  only, zero per-frame `filter`/layout writes (the smear/beam die), IntersectionObserver gates
  the snapshot walk, `content-visibility:auto` on tile rows. Reduced motion: no sweep, balls rest
  at end state, the sparklines ARE the preview.
- **Gate (BORN-OWNER — rides T.M2 pre-authoring sign-off; then BORN-RED).** The **direction** is
  owner-ruled (#14), but the specimen-drawer DESIGN (drawer layout, tile treatment, the
  one-shared-clock comparative sweep) is a taste disposition → its born-RED oracle **may not be
  authored until an owner token covers a live prototype** (T.M2; the S.E lesson — "critic
  consensus ≠ owner verdict — inside the loop"). Then: browser probe — **≥30 tiles rendered**;
  two sampled tiles' ball `translateX` at phase 0.5 equals `fn(0.5)·maxX` ±1px; **zero per-frame
  `filter`/layout writes** in a 2s trace; a tile click updates the header name + literal; frame
  budget ≤4ms scripting median on the reference machine. Rides **T.M3** owner-golden for the
  gallery render. **Reds today:** the scene is the singular hero (~90% empty glass + one ball +
  duplicated handles); the balls-preview is a hidden, anemic 1-D row-list, not a gallery.
- **Size.** L. **Lanes.** 05 rec 1 (T-E1).
- **Edges.** The editor half of the sidebar is **T.E8** (`EasingPicker`); the de-red + violet
  authority is **T.E9**; the font honesty is **T.E10**. The tile painter is the same
  direct-write class as the SVG scene's — coordinate the render-budget methodology with **T.G**.
  The whole surface's appearance rides **T.M2/T.M3** owner tokens. Flag: no charter §3 OD row
  exists for the easing gallery (see §Charter conflicts note 2).
- **Lockstep** (lane 18 rule). The easing **surface-lock** gates freeze the rejected shape and
  **must be retired in the SAME motion** the gallery replaces the hero: `proof:easing-stage-is-ball`
  (asserts the singular hero), `proof:easing-sidebar-minimal`/`-normalized`,
  `proof:easing-canvas-bounded`, `proof:bezier-single-card`/`-grown`/`-no-scroll` — all
  lane-29 Class-A/self-baseline locks (they certify "the awful sidebar is correct"). New gates
  assert **computed rendered truth** (ball transforms sampled mid-sweep, tile count), not source
  shape. Retirement executed via **T.E11 / T.M7**; the ball-preview *intent* survives (#14), the
  surface-locks die.

### T.E7 — Execute the easing removals (curve-physics #13 + gallery door #15)
- **Scope.** Two owner-ruled removals. **(a) The curve-physics telemetry block (#13, "Remove
  all of this"):** delete `EasingCurvePhysics.vue` (234L) + its mount (`EasingSidebar.vue:124`)
  + the scoped-style remnants (peak velocity `2.29×` in red / overshoot / anticipation / the
  italic prose verdict + the "name this curve" dblclick egg — P.W7 instrument accretion). **No
  replacement — the ruling is removal.** **(b) The Gallery door + tour (#15, "remove this
  button"):** delete the button (`EasingSidebar.vue:58-69` + styles `:247-278`) +
  `useEasingGallery.ts` (69L) + the `gallery`/`galleryActive` seam in `useEasingDemo` — a
  full-width button (red glyph) promoting an easter-egg tour into primary chrome (S.G3 promoted
  a sealed dblclick egg to a visible button). The redesigned scene (T.E6) IS the gallery; a tour
  of it is moot.
- **Gate (BORN-RED).** Static — **zero references** to
  `curve-physics|gallery-door|galleryActive|useEasingGallery` under `demo/`; browser probe on
  the easing route — no element matching `[data-gesture-tell="easing:gallery"]`, **no text node**
  matching `/peak velocity|overshoot|anticipation/`. **Reds today:** `EasingCurvePhysics.vue` +
  the `.gallery-door` button + `useEasingGallery.ts` all resolve and render.
- **Size.** S. **Lanes.** 05 rec 2 (T-E2).
- **Edges.** These two removals are the easing-scene slice of the fleet ruled-removal discipline
  (**T.E11**); the at-rest "no telemetry / no gallery button" is corroborated by **T.M4**
  stage-inventory (the easing manifest excludes them). The curve-physics removal is the
  easing instance of lane 26 rec 6 (furniture-strip); the gallery-door is the easing instance of
  lane 18 rec 3 (the `easing:gallery` tell).
- **Lockstep (CRITICAL — the lane-18-rec-3 exemplar).** The `easing:gallery` tell
  (`gesture-manifest.mjs:82-84`) points at the `.gallery-door` button, and
  `proof:easter-egg` (`scripts/proof-easter-egg.mjs:131,500`) **clicks that exact selector** as
  its trigger; `proof:design-refinement` S5 mandates the easing drag-smear telemetry. Deleting
  the button/telemetry WITHOUT re-cutting the manifest + retiring `easter-egg`/`design-refinement`
  reds a gate on the *rejected UI's absence*. The `gesture-manifest` `easing:gallery` entry is
  re-cut and `proof:easter-egg` (gallery clause) + `proof:design-refinement` (S5) retired **in
  the SAME motion** — via **T.E11 / T.M7**. Never green by resurrecting the button.

### T.E8 — ONE editor: glass-ui `EasingPicker` replaces the 1,082L hand-rolled cluster
- **Scope (directive #27).** glass-ui 4.0.1 **already ships** an easing editor at
  `@mkbabb/glass-ui/easing` — `EasingPicker` (bezier + steps modes, draggable overshoot-clamped
  canvas, touch hit-radii, re-parseable readout + copy, a drivable `progress` ref + travel dot,
  footer slot) + `EasingConfigurator` over `useEasingPicker`. Meanwhile the demo hand-rolls the
  same thing across `demo/@/components/custom/easing-editor/`: `EasingCurveCanvas.vue` (499L) +
  `DemoControlPoint.vue` (328L) + `EasingSelect.vue` (136L) + `EasingEditor.vue` (119L) =
  **1,082L duplicating a shipped component** (three mounts today: sidebar canvas + hero overlay
  + TimingFunctionPanel). **Fix:** mount `EasingPicker` as the **sole** edit surface (sidebar
  panel), `progress` driven by the scene sweep, `modelValue` seeded from tile selection when
  bezier-expressible, steps mode replacing the hand-built steps/jump `LabeledInput`/`LabeledSelect`
  rows, its readout replacing the **truncated** copyable literal (`cubic-bezier(0.25, 0.10,
  0.25, 1.` — the closing paren clipped off a *copyable* literal, lane 05 §1.1/F7). Delete the
  `easing-editor/` cluster (1,082L); keep a thin name→`TimingFunction` catalogue adapter
  (`easingGroups.ts` + `timingFunctionsAnd` already exist).
- **Gate (BORN-RED).** Static — the `easing-editor/` dir is **gone** and `EasingPicker` is
  imported **exactly once** under `demo/scenes/easing/`; browser probe — dragging a picker
  handle re-times a sampled gallery ball within one frame; the readout literal is **complete +
  re-parseable** (a value.js round-trip parse, no `new Function`). **Reds today:** the cluster
  exists (4 SFCs), `EasingPicker` is imported **zero** times (verified), the literal truncates.
- **Size.** M. **Lanes.** 05 rec 3 (T-E3).
- **Edges.** `EasingPicker` is a glass-ui component — **T.H** owns the glass-ui consumption
  discipline (this wave is the easing consumer). The **honest gap** for the T.H BG/BH letter
  (lane 05 F6): `EasingPicker`'s catalogue is bezier + steps only, so the demo's **bounce
  family** (not expressible as one cubic-bezier) stays kf-owned — the division of labor is
  clean: the **gallery** (every named curve, T.E6) is the scene's; the **editor** (bezier/steps
  authoring) is `EasingPicker`'s. Three glass-ui asks routed to **T.H**: (1) named-catalogue
  coverage beyond bezier presets, (2) an externally-driven-`progress` example in `EasingPicker`
  docs, (3) `ToggleChip cell` with a live-animating preview slot. The hand-rolled editor is
  this surface's **"Kf-vanity"** (#18 genus) — its deletion satisfies the charter T.E row's
  Kf-vanity removal for the easing scene (§Charter conflicts note 3).
- **Lockstep.** The `:deep(.easing-curve-canvas)` clamps duplicated across `EasingSidebar.vue:215,
  228,235-236` + `TimingFunctionPanel.vue:244,258` (lane 18 F2 — two independently-derived
  pixel-arithmetic formulas for the same child) **die with the cluster**; do not re-home them
  onto `EasingPicker` via `:deep()` — consume its public sizing (the lane-18-rec-2 idiom, owned
  by T.F). `proof:bezier-*` gates retire with the hand-rolled canvas (via T.E11 / T.M7).

### T.E9 — De-red the motion tokens + one violet hue authority (easing-scoped)
- **Scope (ruling #16a).** `--color-progress` is **literally red**: `var(--accent-red)` at
  `style.css:388` (light `hsl(0 72% 63%)`:346; dark `hsl(5 55% 50%)`:404) — the K.W4 S3
  "motion-color collapsed to ONE: the RED-DASHED" ruling, now **owner-reversed** (#16: "I don't
  like this latent red theme"). On the easing surface the red rides into the PlaybackRibbon fill
  + red `Pause`, the telemetry accent (dies with T.E7), the gallery-door glyph (dies with T.E7),
  and every default `.progress-ball`/`.progress-rail`. Worse, the scene runs **four accent hues
  at once** (violet curve, magenta ball, red transport, warm-tan grid — no single authority,
  lane 05 §1.3). **Fix (easing-scoped):** collapse the easing scene to **ONE violet family**
  (the scene icon's promise, `--ppmycota-primary` 248°) — `--ball-tone` ← the brand violet; the
  magenta `--rainbow-violet` ball + red transport/telemetry accents leave the scene entirely.
  Also fix the **light-mode slider**: the duration range-fill rides light `--primary` = near-black
  `hsl(24 10% 10%)` (the ~90px black blob in `dev-easing-closed.png`; dark mode paints it violet
  correctly) — an asymmetric token, a glass-ui-vs-demo bridge defect to fix at the token.
- **Gate (BORN-RED, easing-scoped).** Browser probe — a rendered-pixel sweep of the easing route
  (light + dark) finds **zero pixels within ΔE<10** of `hsl(0 72% 63%)`/`hsl(5 55% 50%)`; the
  duration slider's track spans ≥90% of the panel inner width with a fill whose hue ∈
  [240°,320°]. **Reds today:** the ribbon fill + `.progress-ball` render red; the light-mode
  slider is a near-black blob. The **red-KILL is owner-ruled** (#16, born-RED); the **specific
  violet hue-family value** rides **T.D/OD-6** (the ONE oklch violet accent ramp — sign-off).
- **Size.** S (easing scope) / M with the sitewide half.
- **Lanes.** 05 rec 4 (T-E4).
- **Edges.** The **sitewide** repoint of `--color-progress` off `--accent-red` (returning
  `--accent-red` to destructive-only — the latent-red kill, ~168 refs) is **T.D**'s look
  language (charter D row: "ONE oklch violet accent authority; `--accent-red` returns to
  destructive-only"). This wave owns the **easing-scene assertions**; T.D owns the sitewide
  token move + OD-6 hue ramp. Coordinate so the token is repointed once (T.D), the easing gate
  asserts the on-surface result (here). `proof:crayon-preserved` audits against the redesign —
  the crayon idiom likely dies with the latent-red theme (retire via T.E11 / T.M7 if it does).
- **Lockstep.** The easing born-RED pixel gate is authored WITH the token consumption (never
  green by masking); coordinate the `--color-progress` repoint batch with T.D so the easing
  assertion and the sitewide token land together (never leave the easing gate asserting a hue
  the sitewide token hasn't moved to).

### T.E10 — Type honesty: glass-ui font kit + rendered-rung assertions (easing-scoped)
- **Scope (ruling #16b, #24, #27).** The fonts are a **claim-vs-render** defect the roster never
  caught (lane 05 §1.4): the view-mode SelectTrigger's comment claims "the governed
  `text-dropdown` (14px) scale" but `getComputedStyle` measures `ui-sans-serif, system-ui` at
  **16.4px**; body is system sans at **18.6px**; `--font-serif` resolves to the **sans** stack;
  sidebar labels/buttons render **Fira Code mono as general UI text** (the telemetry verdict line
  italic mono). Root cause: `--font-sans` is deliberately pinned to the native system stack
  (`style.css:70-78`) while **glass-ui 4.0.1 ships its own brand sans — Plus Jakarta Sans — in
  `dist/fonts/`** (export subpaths `./fonts/*`, `./styles/fonts`). **Fix (easing-scoped
  assertions; sitewide adoption → T.D):** consume glass-ui's Plus Jakarta Sans as `--font-sans`;
  delete the dead sans-resolving `--font-serif` token; demote Fira Code to **literals + tabular
  digits only** (labels/buttons go sans); verify the governed rungs actually LAND (the
  claimed-14px/measured-16.4px gap — assert COMPUTED styles, not source shape). Instrument Serif
  for the selected curve name is the one rung that already lands (41.9px ✓) — kept.
- **Gate (BORN-RED, easing-scoped).** Browser probe on the easing route — `getComputedStyle` of
  the filter pills + panel labels reports the **Jakarta** family; the curve-name display reports
  **Instrument Serif**; **no element outside literal/digit surfaces reports Fira Code**; the
  (former) dropdown surface measures its governed rung ±0.5px. **Reds today:** the Select
  measures 16.4px system-sans (claimed 14px); mono renders as UI text; `--font-serif` resolves
  to sans.
- **Size.** M. **Lanes.** 05 rec 5 (T-E5).
- **Edges.** The **sitewide** font-kit adoption (kill the system-stack pin, re-adopt Jakarta as
  the body register, demote mono to data, role-bound style-TUPLE font gate) is **T.D**'s charter
  row (type · theme). This wave owns the **easing-scoped rendered-rung assertions**; T.D owns the
  sitewide `--font-sans` swap + the family+size+weight+style tuple gate. The claim-vs-render
  assertion class (assert computed, not source) is the lane-29 Class-C cure — coordinate the
  methodology with **T.M** (owner-anchored, quality-shaped: rendered truth over census).
- **Lockstep.** `proof:demo-fonts`/`proof:font-census` are family **censuses** (font resolves ≠
  right register — lane 29 Class C); the easing gate ADDS a rendered-rung clause (family+size on
  the LIVE Select), it does not retire the census. Coordinate with T.D's sitewide tuple gate so
  the two do not double-assert the same rung.

---

## The lockstep discipline (lane 18 rec 3; lane 26 recs 4, 6; lane 29 rec 6) — T.E11

### T.E11 — The ruled-removal gate-rewire lockstep + the T.E-coupled retirement execution list
- **Scope.** This is **the lockstep wave** (lane 18's rule codified, the exemplar assigned to
  T.E) AND the **execution list** for the T.E-coupled half of T.M7's feature-coupled retirement
  ledger. The **mechanism** — the retirement ledger, the no-orphan-key completion gate, the
  band-coordination — is **T.M7** (cross-ref, not re-authored here). This wave owns **executing**
  the retirements whose features T.E (and its partner scene bands) remove, and being the **fleet
  synchronization point** so no gate is ever left pointing at a deleted tell and no gate is ever
  greened by resurrecting rejected UI. The T.E-coupled retirement list (each verified present):

  | Gate(s) retired | Owner ruling | Coupled removal (executed by) | Note |
  |---|---|---|---|
  | `proof:gesture-manifest` + `scripts/gesture-manifest.mjs` + the `GestureLegend.vue` layer + all 11 `[data-gesture-tell]` sites | #8/#11 "remove all elements like this" | per-scene DOM: cube/amiga → **T.A2/T.A10**; square/spring → **T.B**; easing:gallery → **T.E7** | **replaced by T.M4** stage-inventory (negative-space gate) — the inversion (`gesture-manifest` MANDATES the legend) is structurally reversed |
  | `proof:easter-egg` (the Gallery + 7 eggs) | #15 "remove this button" + the egg program | gallery-door → **T.E7**; scene eggs → their bands (T.A/T.B/T.E) | the S taste error made machine-mandatory; the whole key goes |
  | `proof:design-refinement` (9 instrument-eggs incl. S1 typing card, S5 easing smear) | #2/#13 "remove this crap"/"Remove all of this" | S5 easing smear → **T.E7**; S1 typing card → **T.D**; others → their bands | one key, retired when the LAST coupled egg is gone |
  | `proof:easing-stage-is-ball` / `-sidebar-minimal` / `-normalized` / `easing-canvas-bounded` / `bezier-{single-card,grown,no-scroll}` | #16 "re-designed with glass-ui in mind" | the easing surface-locks → **T.E6/T.E8** | ball-preview *intent* survives (#14); surface-locks die |
  | `proof:crayon-preserved` | #16 latent-red | audit vs redesign → **T.E9/T.D** | retire IF the crayon idiom dies with the theme |
  | `proof:compose-scene` | #23 prune | **T.E1** | pure deletion |
  | `proof:morph-scene` / `proof:motion-path{,-copy,-editable,-scale}` | #20/#21/#23 | **T.E2** (→ ONE `svg-scene`) OR **T.E3** (pure deletion) per **OD-1** | LIBRARY `morph-renders-d`/`-orients`/`morphsvg-consume` SURVIVE |

  **KEEP-but-WIDEN (not retired):** `proof:no-single-option-select` — the owner still sees the
  "∿ Spring │ ∿ Spring" dup (#17) because the gate guards only the `<Select>` count, not the
  **redundant dock label** (scene-name repeated as the lone control-tab). Widen the oracle to the
  dock-label elision (the dock-label widening is executed by **T.C**; this wave records it in the
  ledger so it is not mistaken for a retirement).

  **The re-solve-affordance question (lane 26 rec 4).** The owner rejected the drafting-stamp
  legends **wholesale**; the structural replacement is **T.M4** (stage-inventory: affordances are
  self-evident via the standard panel + transport, not via on-stage legends). **No bespoke
  affordance-hint system is rebuilt** unless the owner signs one via **T.M2** — the default
  disposition is removal, and the negative-space gate enforces "no un-manifested chrome at rest."
- **Gate (BORN-RED).** The retired keys are **absent** from `package.json` AND every roster
  aggregator (`run-all.mjs`, `demo-roster.mjs`, `run-demo-roster.mjs`, `proof:ci-coverage`,
  `proof:hygiene-chain`, `gate-bands.mjs`), the retired scripts + `GestureLegend.vue` + the 11
  `[data-gesture-tell]` sites are gone, AND `proof:ci-coverage` stays green with them removed (no
  dangling CI reference — the no-orphan-key clause, which T.M7 owns and this wave satisfies).
  **Reds today:** all listed keys + scripts + the legend layer + the tells are present and
  referenced by `demo-roster.mjs` + `gate-bands.mjs` (verified).
- **Size.** M. **Lanes.** 18 rec 3 (the lockstep exemplar); 26 recs 4 (gesture-manifest delete) +
  6 (furniture-strip discipline); 29 rec 6 (T-GATE-RETIRE — execution list here, mechanism → T.M7).
- **Edges (heavy cross-band).** The **mechanism** (retirement ledger + no-orphan-key completion
  gate) is **T.M7**; this wave is its T.E-coupled execution surface. **T.M4** installs the
  stage-inventory gate that REPLACES `gesture-manifest` (the retirement and the replacement are a
  paired motion). Per-scene DOM removals are executed by **T.A** (cube/amiga tells + captions),
  **T.B** (square/spring tells; the square-honest gate flip is T.A13+T.B's joint arming-audit
  motion, NOT retired here — it is INVERTED to born-RED for the panel restoration), **T.D** (the
  home typing card = `design-refinement` S1; the hero-rung trio + `appearance-suffusion`(c) +
  `demo-usability`(2) re-spec — those hero gates are **T.D**'s retirement, NOT this wave's). This
  wave owns the **gate-key deletion + census** for the fleet ruled-removal set; the bands own
  their per-scene DOM. **They are ONE motion** — see §Charter conflicts note 1.
- **Lockstep (this IS the lockstep wave).** A gate key is retired in the **batch where the LAST
  coupled feature-removal lands** — never earlier (would red on still-present UI), never later
  (would leave a gate mandating deleted UI). Before each retirement commit: grep `scripts/` +
  `package.json` + `demo-roster.mjs` + `run-all.mjs` + `gate-bands.mjs` + `proof-ci-coverage.mjs`
  for every retired basename (the drive lesson: gates anchor literal paths). Never "fix" a red by
  resurrecting rejected UI; never leave a manifest entry pointing at a deleted tell. Feed each
  discharge into T.M7's ledger + T.M8's roster-ceiling count.

---

## Cross-band edges (summary)

| From | To | What crosses |
|---|---|---|
| T.E2 (morph act) | **T.A14** | Consumes the MorphSVG attribute-first render contract (LIBRARY) — the morph subject visible-at-rest |
| T.E2, T.E3 | **T.A15** | Cold-enter-playing autoplay contract (the SVG scene / any survivor) |
| T.E2 (full panel per act), T.E6 (sidebar) | **T.B** | The SceneFacility triad (controls/keyframes/timeline) mounts over honest engine animations — T.B owns the facility, T.E consumes it |
| T.E2, T.E6 (render budget) | **T.G** | Direct-write painter budget + true-rest methodology (CDP-counter substrate); T.E5's paused-poll cure is a T.G true-rest slice |
| T.E4 (dock-tether attribute) | **T.C / T.D** | `[data-dock-tether]` opt-in for the dock grammar recut + the anchor-positioning idiom (T.D owns the anchor labyrinth cure) |
| T.E8 | **T.H** | glass-ui `EasingPicker` consumption discipline + 3 BG/BH gap-letter asks (bounce catalogue, external-progress docs, `ToggleChip` live-preview slot) |
| T.E9 (sitewide `--color-progress` repoint), OD-6 hue ramp | **T.D** | The latent-red kill (`--accent-red` → destructive-only, ~168 refs) + the ONE oklch violet accent authority (OD-6) |
| T.E10 (sitewide font kit), the style-tuple gate | **T.D** | Plus Jakarta Sans as `--font-sans`, mono-to-data demotion, the family+size+weight+style font gate |
| T.E6, T.E9, T.E10 (appearance), T.E2 stage tokens | **T.M2/T.M3** | Owner-token capture sign-off for every appearance disposition (the gallery design, the violet ramp, the fonts, the blueprint stage) — no born-RED appearance oracle authored without the token |
| T.E7, T.E11 (at-rest no-furniture) | **T.M4** | The stage-inventory negative-space gate enforces "no un-manifested chrome at rest" and STRUCTURALLY REPLACES `gesture-manifest` |
| T.E11 (retirement execution) | **T.M7 / T.M8** | The no-orphan-key completion gate + the retirement ledger (T.M7); the retired keys feed the 203→~120 roster-ceiling count (T.M8) |
| T.E1, T.E3 (persisted-state) | **T.B** | superKey → SceneId + machine reset (a stored dead-route lands on home) |

---

## Disposition of lane recommendations (zero silent drops)

Legend: **→ T.E#** = owned by a wave above · **↳ cross-ref** = owned by another band per the
charter (listed for completeness with the owning band; my assignment scopes me to specific recs).

### Lane 07 — prune-triage (recs 1, 2, 5, 6 assigned; 3, 4 are T.A)

| rec | disposition |
|---|---|
| 1 · T-PRUNE-COMPOSE | **→ T.E1** |
| 2 · T-SVG-FUSION | **→ T.E2** (OD-1 FUSE) **+ T.E3** (OD-1 PRUNE-alt) — both paths spec'd; the OD-1 ruling selects |
| 3 · T-MORPH-ATTRIBUTE-FIRST | ↳ cross-ref **T.A14** (LIBRARY; consumed by T.E2's morph act) |
| 4 · T-AUTOPLAY-CONTRACT | ↳ cross-ref **T.A15** (consumed by T.E2/survivor) |
| 5 · T-NO-UTILITY-KEYED-LAYOUT | **→ T.E4** |
| 6 · T-READOUT-TRUTH | **→ T.E5** |

### Lane 05 — easing (ALL recs assigned)

| rec | disposition |
|---|---|
| 1 · T-E1 (specimen-drawer gallery) | **→ T.E6** (BORN-OWNER; #14 direction ruled, design via T.M2 prototype) |
| 2 · T-E2 (execute removals #13/#15) | **→ T.E7** (lockstep → T.E11) |
| 3 · T-E3 (EasingPicker replaces cluster) | **→ T.E8** (glass-ui consumption + BG/BH asks → T.H) |
| 4 · T-E4 (de-red + violet authority) | **→ T.E9** (easing-scoped); sitewide token + OD-6 hue ↳ cross-ref **T.D** |
| 5 · T-E5 (type honesty) | **→ T.E10** (easing-scoped); sitewide font kit + tuple gate ↳ cross-ref **T.D** |

### Lane 18 — brittle-selectors (rec 3 assigned; 1, 2, 4, 5, 6 → T.F/T.B/T.H)

| rec | disposition |
|---|---|
| 3 · decouple gesture-manifest tell from the removed element (the lockstep exemplar) | **→ T.E11** (the fleet ruled-removal gate-rewire; T.E7 executes the easing:gallery slice) |
| *(1 · scope cross-component tab-panel selectors to their own root)* | ↳ cross-ref **T.F** (brittle-selector hardening / `:deep()` census — charter T.F row) |
| *(2 · prefer vendor public prop over `:deep()`; centralize per-vendor)* | ↳ cross-ref **T.F** (the `:deep()` census); T.E8's cluster deletion removes the duplicated `easing-curve-canvas` clamps as a side effect |
| *(4 · converge tab/roving-tabindex onto one primitive; delete KfPillTabs)* | ↳ cross-ref **T.B / T.C / T.H** (glass-ui `SegmentedTabs`; KfPillTabs is glass-ui consumption per T.M's disposition) |
| *(5 · widen brittle-selector gates to owned-ref vendor reaches + all of demo/)* | ↳ cross-ref **T.F** (gate widening) |
| *(6 · refcount the `#highlightjs-theme` singleton)* | ↳ cross-ref **T.F** (state/reactivity hardening) |

### Lane 26 — plan-vs-landed F/G/H (recs 4, 6, 7 assigned)

| rec | disposition |
|---|---|
| 4 · delete GestureLegend + `proof:gesture-manifest`; re-solve affordance discovery glass-ui-idiomatically | **→ T.E11** (gate + layer retirement); the re-solve = **T.M4** stage-inventory (affordances self-evident; no bespoke legend rebuilt unless owner-signed via T.M2) — cross-ref **T.M4** |
| 6 · strip telemetry/readout/caption furniture; scenes carry only subject + glass-ui controls | **SPLIT:** easing `EasingCurvePhysics` → **T.E7**; the fleet furniture-strip gate-rewire discipline → **T.E11**; cube `rx/ry/rz` readout + square/amiga captions DOM removal ↳ cross-ref **T.A** (T.A2/T.A10) / **T.B**; at-rest enforcement ↳ **T.M4** |
| 7 · prune morph/motion-path/compose; preserve the VT-d/EN-d real-artifact dogfood pattern | **→ T.E1** (compose) **+ T.E2/T.E3** (morph/motion-path per OD-1); the dogfood-pattern principle folded into T.E2 (each act consumes a named engine primitive) |
| *(1 · owner-taste sign-off as design-gate precondition)* | ↳ cross-ref **T.M2** (the mechanism; every T.E design wave — T.E2/T.E6 — rides it) |
| *(2 · hero per-char uplift)* | ↳ cross-ref **T.D** (hero; OD-4) |
| *(3 · demo-scoped absolute perceived-perf oracle)* | ↳ cross-ref **T.G** (perf); **T.M6** enforces blocking/OWNER status |
| *(5 · restore the square panel; make Play honest)* | ↳ cross-ref **T.A13 + T.B** (SceneFacility triad; the joint arming-audit motion) |
| *(8 · ring-fence band H + F primitives; board-live)* | ↳ cross-ref **charter §4 non-goals** (H + F-library out of scope) + **T.M9** (board-live) |

### Lane 29 — gate-oracle-gap (T-GATE-RETIRE assigned: execution list here, mechanism → T.M)

| rec | disposition |
|---|---|
| 6 · T-GATE-RETIRE (feature-coupled retirement) | **EXECUTION LIST → T.E11** (the T.E-coupled retire targets: compose-scene, morph/motion-path gates, easing surface-locks, gesture-manifest, easter-egg, design-refinement, crayon-preserved; the KEEP-but-WIDEN no-single-option-select record); **MECHANISM (ledger + no-orphan-key completion gate)** ↳ cross-ref **T.M7** |
| *(1 · T-GATE-OWNER owner-verdict-recorded)* | ↳ cross-ref **T.M1** |
| *(2 · T-GATE-GOLDEN perceptual reference oracle)* | ↳ cross-ref **T.M3** (consumed by T.E2/T.E6 renders) |
| *(3 · T-GATE-INVENTORY on-stage element manifest)* | ↳ cross-ref **T.M4** (enforces T.E7/T.E11 removals at rest) |
| *(4 · T-GATE-LEGIBLE legibility + fullness)* | ↳ cross-ref **T.M5** (its morph `subject-full` clause couples to T.E2 kept / T.E3 retired per OD-1) |
| *(5 · T-GATE-PERF whole-roster blocking perf)* | ↳ cross-ref **T.G** (gate) + **T.M6** (authority/blocking) |
| *(7 · T-GATE-META taste-authority axis)* | ↳ cross-ref **T.M6** |

---

## Charter conflicts / coordination notes spotted

1. **The fleet gesture-manifest re-cut is jointly owned (T.E11 discipline vs T.A/T.B per-scene
   DOM).** T.A's charter-conflict note 2 already flags the reciprocal: "T.A2/T.A10 EXECUTE the
   per-scene removal; T.E owns the fleet-wide ruled-removal + gate-rewire discipline (the
   `gesture-manifest` re-cut especially)." **Resolution encoded in T.E11:** T.E owns the
   **gate-key deletion + census + no-orphan verification** (the single motion that removes
   `gesture-manifest`/`easter-egg`/`design-refinement` and the scripts/legend layer); each scene
   band owns its **per-scene DOM tell removal**; the whole thing is ONE lockstep motion, batched
   so the gate key is retired only when the LAST coupled DOM removal lands. Flagged so the impl
   drive does not double-author the manifest re-cut (T.A and T.E each assuming the other holds
   it) NOR retire the key while a scene's tell still renders.

2. **The easing specimen-drawer gallery is BORN-OWNER but has NO charter §3 OD row.** Charter §3
   registers OD-1..OD-6; the easing gallery (T.E6) is owner-ruled in DIRECTION (#14 "just the
   easing balls") but its DESIGN (the drawer layout, tile treatment, one-shared-clock sweep) is a
   taste disposition requiring an owner token before its born-RED oracle is authored (T.M2). It
   currently rides **T.M2's general design-wave contract** (pre-authoring sign-off via a live
   prototype), NOT a dedicated OD row. **Recommendation:** add an OD-7 (easing gallery design) to
   `OWNER-DECISIONS.md`, OR explicitly document that T.E6 rides T.M2's general contract. Flagged
   so the impl drive does not author `proof:easing-gallery` without capturing the easing-design
   owner token (the exact S.E-shelf failure this tranche exists to prevent).

3. **"Kf-vanity" (charter T.E row) vs lane 18 rec 4's KfPillTabs (T.M-dispositioned to T.B/T.C/
   T.H).** The charter T.E row lists "Kf-vanity" among the ruled removals, but T.M dispositioned
   the KfPillTabs→`SegmentedTabs` migration (lane 18 rec 4) to **T.B/T.C/T.H** (glass-ui
   consumption). **Resolution:** on the EASING surface, the "Kf-vanity" is the **hand-rolled
   1,082L easing-editor cluster** — its deletion (**T.E8**, → glass-ui `EasingPicker`) satisfies
   the charter T.E Kf-vanity removal for this band. The `KfPillTabs.vue` component itself
   (SpringSidebar/AnimationControls) is T.B/T.C/T.H; T.E11's lockstep DISCIPLINE governs the
   gate-rewire whenever any Kf-vanity component is removed, but T.E does not own the KfPillTabs
   migration. Flagged so Kf-vanity is not double-claimed.

4. **OD-1 mutual exclusivity (T.E2 FUSE vs T.E3 PRUNE-alt).** Both paths are fully spec'd per the
   brief ("spec BOTH paths with the owner ruling as the fork"). They are MUTUALLY EXCLUSIVE —
   exactly one executes. **The impl drive must author only the SELECTED wave's born-RED oracle**
   (never both `proof:svg-scene` and the prune census — that would be self-contradictory). Flagged
   so the OD-1 ruling gates authoring, per T.M2's "no born-RED oracle before the OD token."

5. **T.A14 (MorphSVG attribute-first, LIBRARY) has no demo consumer if OD-1 = PRUNE.** T.A14 is a
   §4-sanctioned LIBRARY correctness fix (visible-at-rest morph render), consumed by T.E2's morph
   act if OD-1 = FUSE. If OD-1 = PRUNE (T.E3), the morph SCENE is deleted, so T.A14 lands as a
   pure library win (README + `test/svg/` covered) with no demo exhibit. **Not a conflict** —
   T.A14 is correctness, owner-invariant, and stands on its own; but flagged so the impl drive
   does not treat T.A14 as blocked-on or coupled-to the demo fusion (it is not).

6. **T.E9/T.E10 are half-owned (easing-scoped here, sitewide → T.D).** Lane 05 recs 4/5 explicitly
   split: "coordinate the sitewide half with the theme lane, own the easing-scene assertions
   here." **Resolution encoded in T.E9/T.E10:** T.E owns the easing-route rendered-pixel/rung
   assertions; **T.D** owns the sitewide `--color-progress` repoint (OD-6 violet ramp) + the
   `--font-sans` Jakarta swap + the style-tuple font gate. Flagged so the token/font changes land
   ONCE (T.D) and the easing gate asserts the on-surface result (T.E) — never two independent
   repoints, never an easing gate asserting a token T.D hasn't moved.
