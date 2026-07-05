# Lane 07 — prune-triage: motion-path · morph · compose (VERDICT #20, #21, #23; shot 17)

**Charter.** The owner: motion-path "barely works" (#20); morph "does not work at all" — a bare
grid (#21, shot 17); compose "just straight up remove this crap" (#23); "motion-path, morph, and
compose likely need to just be pruned." This lane diagnoses each scene LIVE, adjudicates
PRUNE-vs-REDEEM per scene with dogfood evidence, and designs the target surface.

**Method.** Four playwright probes against BOTH the built dist (`scripts/lib/demo-driver.mjs
withPage`) and the dev server (localhost:5180), light+dark, 1440×900 / 900×900 / 534×740 (the
shot-17-ish crop), with per-scene console/pageerror capture, DOM rect/computed-style forensics,
`document.getAnimations()`, and interaction drives (play-press via `pressPlayToggle`, compose
add-a-shape). Probe scripts + screenshots preserved at
`/private/tmp/claude-504/-Users-mkbabb-Programming-keyframes-js/10dfa2b9-2e44-4e6b-a6c5-b028a506ba71/scratchpad/`
(`probe-lane07*.mjs`, `shots/*.png`, `shots/report*.json`).

---

## F1 — COMPOSE IS FUNCTIONALLY DEAD: the `.z-dock:has()` layout hijack collapses the asset layer to height 0 the moment the first asset exists

**Defect.** Click "Add a shape" → "Rectangle 1" appears in the Assets panel with live properties
(X 100, Y 100, W/H 120, BG `var(--rainbow-blue)`) — and **nothing ever renders on the floor**.
Play does nothing visible. The scene's entire core loop (drop asset → see it → bind motion) is
impossible. Measured (dev, 1440×900, `probe-lane07-foundry.mjs`):

- `[data-foundry]` (ComposeTarget root): `(518,118) 878×664` — correct.
- AssetViewport root (`absolute inset-0 z-dock …`, `AssetViewport.vue:4`): `(518,782) 878×0` —
  **zero height, pinned to the foundry's BOTTOM edge**, `overflow-hidden`.
- The added asset div: `(618,882) 120×120` — below the 900px fold, clipped by an h=0 ancestor.
  `elementFromPoint` at its center: nothing.

**Root cause** (exact, reproduced conditional): `demo/@/styles/style.css:452-455` — the desktop
anchor-positioning dock tether:

```css
.z-dock:has(> .pointer-events-auto) {
    position-anchor: --stage;
    top: calc(anchor(--stage top) + var(--dock-margin) / 4);
}
```

The rule was written for the top scene-switcher dock pill, but it keys on the **generic z-index
utility class** `.z-dock` plus "has a direct `pointer-events-auto` child". The AssetViewport root
also carries `z-dock` (`AssetViewport.vue:4`), and every rendered asset is a direct
`pointer-events-auto` child (`AssetViewport.vue:45`). Empty state does NOT match (the CTA card is
a grandchild under a `pointer-events-none` wrapper, `AssetViewport.vue:17-19`) — so the floor is
fine until the FIRST asset lands, then the `:has()` fires, `position-anchor`/`top` re-tether the
viewport off its `inset-0`, and the whole asset layer collapses to an h=0 strip. Verified both
states live: empty → computed `inset: 0px`, height 664px; one asset → rect h=0 at y=782.

**Why every gate stayed green** (evidence for lanes 26/29): `scripts/proof-compose-scene.mjs:153-159`
DOES click "Add a shape" — but its assertions are foundry-mounts + comet-tail-draws (the ignition
SVG is a *sibling* of the collapsed viewport, `ComposeTarget.vue:19-27`), never "the added asset
has a visible on-screen rect". The occlusion/capture gates ran compose in its EMPTY state. The
exact class of defect the owner's litany names: brittle selector + fragile CSS (#28), invisible to
source-shape gates.

**Secondary defects** (moot under prune, listed for the record): default spawn (100,100) is under
the Assets panel even if the layer rendered (`useAssetManager.ts` spawn constants vs the panel's
~(75..475, 80..580) rect); `BG COLOR` renders the raw string `var(--rainbow-blue)` in a text input
(no swatch — the deprecated-color-picker memory item's sibling); new assets bind `ANIMATION: None`
so play is a visual no-op even with a visible layer; a stray empty ghost card renders below the
panel (`shots/compose-after-add.png`); the pointer-tracked key-light (`ComposeTarget.vue:74-82` +
registered-property transitions on a full-viewport radial gradient) repaints a 878×664 layer on
every pointermove — a #19/#22 performance sibling.

**Scope census.** `demo/scenes/compose/` = **1,672 lines** (ComposeScene 165 + ComposeTarget 183 +
useComposeDemo 110 + composeKeys 17 + asset-manager/ 1,197) of pure demo-app code — a half-built
mini-Figma (layers, lock/visibility, multi-select, resize/rotate handles, grid snap, editable
labels) orthogonal to a library demo. **It dogfoods nothing uniquely**: `presets` has homes in
`scenes/cube/useCubeDemo.ts` + `keyframes-editor/KeyframesEditor.vue`; `fromDrawSVG` has a
surviving home in `scenes/easing/EasingHeroStage.vue:247-250` (the curve self-draw).

**Adjudication: PRUNE OUTRIGHT.** The owner's #23 is an explicit ruling; the evidence concurs
independently — dead core loop, zero unique dogfood, maximal maintenance surface.

---

## F2 — MOTION-PATH: the engine sweep works; the scene LOOKS dead because nothing on it tells the truth during playback

**"Barely works" decomposed, measured** (`probe-lane07-final.mjs`):

1. **No autoplay.** `useMotionPathGesture.ts:156` builds the traveller sweep `autoPlay: false`;
   the machine enters paused. Cold entry = a static card. First impression: broken.
2. **The engine sweep is actually fine.** After a play press, computed `offset-distance` advances
   0 → 6.25% → 93.1% over 3s and the traveller rect moves — rAF-driven (`getAnimations()` shows
   no WAAPI offset-distance animation; the only WAAPI entry is the decorative `mp-ants`
   strokeDashoffset loop, which runs **permanently**, `MotionPathTarget.vue:341`).
3. **Every readout is frozen during playback.** The header `OFFSET-DISTANCE 0%` / `TANGENT -89°`
   MetricBadges and the glyph's banking `--tangent` read `distance`/`tangentDeg`
   (`useMotionPathGesture.ts:53-58`) which are written **only** by `applyDistance()` — the
   drag/keyboard path (`:241-254`). No engine sampling exists (contrast morph's `useRafFn` poll).
   So under play the ball moves while the instrument swears 0% — the scene contradicts itself.
   (My first interaction probe read "0%" 3s into playback; the final probe proved the computed
   style advancing. Both are true. That IS the defect.)
4. **Instrument overgrowth.** 1,281 lines for one primitive: an editable 9-point cubic control
   net with tethers + ARIA-slider handles, a drag-scrub with `ManualTimeline`, a DrawSVG
   self-build intro, marching ants, a copy-paste `offset-path` artifact, an emoji traveller
   (🙂‍↔️) with a full-lap 😎 wink egg (`useMotionPathGesture.ts:276-301`). The owner's rulings
   #5/#11/#13 (telemetry/caption/egg purges) and #8 (gesture legends) apply to this scene's whole
   ornament layer; shot-pattern precedent says the eggs and the caption paragraph die.

**Unique dogfood at stake**: the scene is the ONLY demo home of `fromMotionPath`/`MotionPath` (the
WAAPI-eligible offset-path story). Library tests (`test/svg/motion-path.test.ts`) and README §MotionPath
(README.md:142-157) are library-level and survive any demo decision.

**Adjudication: REDEEM BY RADICAL SUBTRACTION — inside the SVG fusion (F5).** Prune the scene
directory as it stands; the primitive keeps a home as one act of ONE scene (below). Folding its
essence elsewhere (sequence/easing) would misfile a distinct library surface; deleting outright
orphans a published, README-documented factory.

---

## F3 — MORPH: the blank does NOT reproduce; the design carries an engineered invisible-at-rest fragility that produces EXACTLY shot 17

**Live truth.** Across five configurations (dist light 1440×900; dev dark 1440×900 + 900×900; dev
dark 534×740 — the shot-17 crop shape; interaction probes) morph **renders and animates**: the
violet subject breathes triangle⇄square, `MORPH`/`TANGENT` update, Next-shape advances the ring,
**zero console errors / pageerrors** (`shots/report*.json`, `shots/dev-dark-wide-morph.png`,
`shots/tiny-morph.png`). The owner's bare grid (shot 17 — no card, no ghosts, just the app
crosshatch) is real but was not reproducible on today's tree from a cold context.

**The engineered fragility that matches the symptom** (`MorphTarget.vue:271-276` +
`useMorphDemo.ts:102-106`): the stylesheet sets `d: var(--morph-d)` on the subject. A CSS `d:`
**overrides the SVG `d` attribute**; when `--morph-d` is unset/empty the declaration computes to
garbage → the subject renders as **nothing** — the code's own comment admits it ("would otherwise
read empty → `none`"). Visibility of the scene's protagonist therefore depends on a JS write
(`anim.interpFrames(0, true)` seed) having happened and never been lost. Any missed/failed write —
an engine throw inside `buildMorph`, an HMR re-mount ordering in a long-lived dev session (the
owner's audit context), a scene-swap race — yields precisely: subject gone, ghosts at 22%-alpha
dashed strokes (`MorphTarget.vue:246-265`) sub-perceptual on the dark theme from arm's length, a
dark glass card melting into the dark grid = "a bare grid, nothing else." The at-rest state must
never depend on a live engine write.

**Perf debt** (#19 evidence): `MorphTarget.vue:167-174` — the glyph poll `useRafFn(readGlyph)` is
resumed on mount and **never gated on playback**: `demo.readOrient()` → `anim.interpFrames(anim.t)`
runs a full interpolation pass + `clientWidth` read **every frame forever, even paused**.

**Unique dogfood at stake**: only demo home of `fromMorphSVG` (+ the orient channel). Library
gates `proof:morph-renders-d` / `proof:morph-orients` are library-level (they survive);
`proof:morph-scene` is the demo gate.

**Adjudication: REDEEM BY RADICAL SUBTRACTION — inside the SVG fusion (F5)**, with the
attribute-first render fix mandatory (T-rec 3).

---

## F4 — CROSS-CUTTING: all three scenes forgot the panel facility the owner demands back (#25, #18)

`demo-driver.mjs:866` states it plainly: motion-path (with home/sequence) has **no control panel**;
morph exposes none; compose's DFA surface is the bespoke `assets` tab only
(`controlSurfaceDFA.ts:112`). None of the three offers the standard controls/keyframes/timeline
view — the exact facility the owner rules must return ("It's like we forgot about that facility
entirely", #25; "it should be like the core cube/amiga/square… with sub options for the controls,
keyframes, timeline", #18). Each scene instead grew bespoke chrome (MetricBadge telemetry strips,
copy artifacts, an assets panel). The redemption path is therefore NOT per-scene patching — it is
re-seating the surviving primitives on the standard contract-group + panel spine every core scene
rides.

---

## F5 — THE TARGET DESIGN: one `scenes/svg/` — three factories, one stage, the standard panel

**Design direction** (committed, glass-ui-consonant): **"instrument on glass — the subject is the
only voice."** One standard glass `Card` plate (the same non-cartoon register the stage scenes
converged to), the existing blueprint-graph stage idiom KEPT (it is token-driven and good) tinted
by ONE scene-accent rainbow token per act, glass-ui type ramp ONLY (no bespoke display/mono
mixtures — #24), zero telemetry pills, zero captions, zero eggs, zero legends. The demo mirrors
the library's own architecture: `src/animation/svg/` is ONE zone holding three factories over a
shared handle base — the demo gets ONE scene holding the three factory exhibits over the shared
scene spine.

**Layout.** A single `Card` (`shadow={false}`) centered in the stage cell, `max-w-3xl`, exactly as
the current motion-path/morph plates sit. Header row: the scene title ("SVG") on the glass-ui
heading register + ONE quiet `Button variant="outline"` contextual action (Reset path / Next
shape — per act). Body: the square blueprint stage (`aspect-ratio:1`, `min(100%, 26rem)` —
the existing `.mp-stage`/`.morph-stage` recipe, deduplicated into one shared class). No footer
caption — the explainer sentence moves to `animationDescriptions.ts`, where the standard panel
already displays scene prose.

**The three acts = three sub-animations of ONE contract `AnimationGroup`** (superKey `"SVG"`):

1. **Path** — `fromMotionPath` traveller (a plain `.progress-ball` glass dot, no emoji) sweeping
   the fixed figure-loop, `offset-rotate: auto`, accent `--rainbow-cyan`. The traveller drag-scrub
   (`useDragScrub` + `ManualTimeline`) is KEPT — it is real dogfood; the 9-point editable net,
   tethers, copy artifact, self-build, marching ants, wink egg all DIE.
2. **Morph** — `fromMorphSVG` subject breathing between ring shapes, accent `--rainbow-violet`,
   **attribute-first rendering** (T-rec 3): the `from` shape lives in the SVG `d` attribute; the
   engine's per-frame write targets the attribute (or the CSS channel is applied only while a
   frame is in flight); the scoped `d: var(--morph-d)` rule dies. Ghost outlines stay (they read
   well); the orient glyph + tangent badge die.
3. **Draw** — `fromDrawSVG` self-drawing a stroke figure, accent `--rainbow-green`. This gives
   DrawSVG a first-class exhibit (today it hides inside eggs) at ~30 lines.

Act selection is the **standard dock animation Select** (three real sub-animations — which also
exercises the #17 elision rule correctly: >1 option, so the Select legitimately shows), and each
act carries the **full standard panel**: controls (duration/direction/iterations/easing),
keyframes, timeline — the group members are honest `CSSKeyframesAnimation`s, so the facility
works with zero bespoke panel code. This single move answers #25 for this surface.

**Motion.** The scene ENTERS PLAYING (T-rec 4). Micro-interactions restricted to glass-ui's own
transitions; PRM degrades per the existing house rules.

**What dies wholesale:** `scenes/compose/` (1,672L), `scenes/motion-path/` (1,281L),
`scenes/morph/` (631L) — 3,584 lines → ONE `scenes/svg/` at ≈450L (scene + target + composable +
shapes/geometry constants), every module ≤500L. Routes 9 → 7 (`#/svg` replaces `#/motion-path` +
`#/morph`; `#/compose` vanishes).

---

## F6 — PRUNE CONSEQUENCES LEDGER (what a T implementer must touch)

| Artifact | compose (prune) | motion-path + morph (fuse → `svg`) |
|---|---|---|
| `demo/app/scene/scenes.ts` | descriptor at :242 dies | :205 + :222 die; one `svg` descriptor born |
| `scripts/lib/demo-driver.mjs` SCENE_GATE_META | `compose:` (:148) dies — the stale-key guard THROWS until it does (good: loud) | `motion-path:` (:132) + `morph:` (:139) die; `svg` entry born; occlusion/capture/lighthouse auto-track via `proof:manifest-sourced` |
| proof roster (`package.json`, `demo-roster.mjs:132-201`, `gate-bands.mjs:74-75`) | `proof:compose-scene` dies | `proof:motion-path{,-copy,-editable,-scale}` + `proof:morph-scene` die; ONE `proof:svg-scene` born (gate shape in T-recs). `proof:morph-renders-d`, `proof:morph-orients`, `proof:morphsvg-consume` are LIBRARY gates — untouched |
| tests | `test/demo/asset-store-singleton.test.ts` dies | `test/demo/{motion-path,morph}-scene.test.ts` → one `svg-scene` test. `test/svg/*` (library) untouched |
| `demo/@/state/controlSurfaceDFA.ts` | `compose: ["assets"]` (:112) + the assets tab wiring (:196) die | `svg` rides the standard DFA rows |
| README | **no change** — §MotionPath/§DrawSVG/§MorphSVG (README.md:140-194) document the library surface, which is untouched | same |
| `demo/CLAUDE.md` + `docs` | scene tables re-rendered | same |
| gesture-manifest / hashSharing / sceneMachine persisted state | compose keys removed; a persisted `activeScene: "compose"` must land on home, not a dead route | same for the two old ids |

Published-surface claims are unaffected in BOTH branches: `MotionPath`/`DrawSVG`/`MorphSVG` remain
HEAVY engine keys with library tests and library proofs; what changes is only which demo scene
exhibits them — and after fusion all three retain a live exhibit (DrawSVG gains one).

---

## T recommendations

1. **T-PRUNE-COMPOSE — delete the compose scene in totality** · Remove `demo/scenes/compose/`
   (1,672L), the scenes.ts descriptor, SCENE_GATE_META entry, DFA `assets` surface,
   `proof:compose-scene`, `test/demo/asset-store-singleton.test.ts`, persisted-state migration for
   `activeScene: "compose"` · Gate: `proof:manifest-sourced` green with no `compose` id;
   `grep -ri compose demo/ scripts/` → 0 product hits; roster count drops by exactly one ·
   **Size M**

2. **T-SVG-FUSION — one `scenes/svg/` scene: MotionPath · MorphSVG · DrawSVG as three
   sub-animations of one contract AnimationGroup, on the STANDARD panel facility** · Kills
   `scenes/motion-path/` + `scenes/morph/` (1,912L) → ≈450L; per-act blueprint stage; traveller
   drag-scrub kept; nets/eggs/badges/captions/copy-artifact die; enters playing; full
   controls/keyframes/timeline per act (answers #25/#18 for this surface) · Gate:
   `proof:svg-scene` — navToScene(`svg`) → dock Select lists exactly 3 sub-animations; for each,
   the subject's rect/`d`/dashoffset measurably changes within 1.5s of cold entry; the Controls
   tab projects for every act; every `scenes/svg/*` module ≤500L · **Size L**

3. **T-MORPH-ATTRIBUTE-FIRST — the morph render contract must be visible-at-rest** · The subject's
   `from` shape rides the SVG `d` ATTRIBUTE; the engine writes the attribute (or applies the CSS
   channel only per-frame); no stylesheet `d: var(--morph-d)` whose unset state blanks the
   protagonist (the shot-17 failure class) — library `MorphSVG` render-contract change +
   demo consumption · Gate: extend `proof:morph-renders-d` — with ALL engine writes suppressed
   (build with `autoPlay:false`, no seed call), the target `<path>` still paints the `from` shape
   (client bbox area > 0) · **Size S**

4. **T-AUTOPLAY-CONTRACT — a time-driven scene enters PLAYING** · Machine-level default on
   SCENE_READY (not per-scene flags): any scene whose group has ≥1 time-driven member cold-enters
   playing; scrub/drag pause-for-gesture semantics unchanged · Gate: for every SCENES entry with a
   subject, cold-load → subject paint-state delta within 1.5s with zero synthetic presses ·
   **Size S**

5. **T-NO-UTILITY-KEYED-LAYOUT — kill the `.z-dock:has(> .pointer-events-auto)` class of rule** ·
   The dock anchor-tether (style.css:452-460) re-keys onto an explicit opt-in attribute
   (`[data-dock-tether]`) on the two dock bands; no layout/position rule may key on z-* or
   pointer-events-* utility classes (the compose-killer's whole class dies, not the one instance) ·
   Gate: a `proof:brittleness` clause — zero `:has(` selectors and zero `position`/`top`/`bottom`
   declarations keyed to utility-class selectors in demo styles; the rule census is greppable ·
   **Size S**

6. **T-READOUT-TRUTH — a displayed live metric must sample the engine, or not exist** · One shared
   progress-sampling seam (the existing `useAnimationProgress`/`useRafFn` pattern, playback-gated)
   for any surviving readout; gesture-local refs (the frozen `OFFSET-DISTANCE 0%`,
   `useMotionPathGesture.ts:53/241`) and ungated polls (the paused-morph `interpFrames`-per-frame,
   `MorphTarget.vue:167-174`) both die · Gate: on the svg scene under machine-playing, any
   rendered numeric readout strictly advances across 3 samples 500ms apart; with the machine
   paused, zero `interpFrames` calls per second (instrumentable via a dev counter) · **Size S**
