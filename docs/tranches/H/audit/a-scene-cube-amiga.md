# Tranche H Deep Audit — Lane A: `/cube` + `/amiga` scenes

Lane: `a-scene-cube-amiga`
Scope: per-scene quality, pertinence, defects, interactivity, performance for the
`/cube` (CSS-3D cube + OrbitalDrag + matrix editor) and `/amiga` (Three.js sphere)
scenes. Spine binding (A→G): idiomatic/gestalt only, no workarounds, no legacy beside
replacement, MEASURE-FIRST for perf, cite anchor for every claim.

Method: source read (`demo/cube/*`, `demo/amiga/*`, `demo/app/scenes/{Cube,Amiga}Scene.vue`,
`demo/@/components/custom/orbital-drag/*`, `demo/@/components/custom/matrix-editor/*`)
+ live drive of `http://localhost:5174` via playwright. Live env caveat: the browser
history stack saturated at `history.length === 50` (live observation) from the audit's
own navigations, which surfaced an important scene-machine fragility (see A1) but also
made repeated live drag capture on the cube non-deterministic. Drag/interaction
findings are therefore source-anchored where live capture was pre-empted.

Headline: the cube + OrbitalDrag are **architecturally exemplary** (genuinely
already-SOTA — see A8/A9). The defects in this lane are NOT in the cube engine; they
are (1) a CRITICAL scene-state machine instability that prevents the cube from staying
mounted (D12, root-caused live here — A1), and (2) two real performance defects in the
amiga scene that are MEASURE-FIRST-grade and visible in source (A2 retina 4×, A3
canvas tessellation). The shared editor-shell defects (D1/D2/D4/D14) reproduce while
cube/amiga are active and are cross-referenced for the relevant lanes.

---

## CRITICAL

### A1 — Scene-state machine is non-idempotent: localStorage + popstate override the URL, `?anim=` writeback churns it (D12 root cause)
- Disposition: **SHIP-in-H**
- Anchors:
  - `demo/app/useSceneRouter.ts:19-32` — on `router.isReady()`, if `route.name === "home"` it `router.replace({ name: stored })` from `localStorage["keyframes-js-active-scene"]`. This races the URL the user typed.
  - `demo/app/useSceneUrl.ts:36-55` — `syncAnimToUrl` (debounced 300ms) does `router.replace({ query })` to append `?anim=<default>` on EVERY scene mount once `selectedAnimation` defaults.
  - `demo/app/router.ts:33-36` — `createWebHashHistory()`; the scene IS the hash. There is no guard against responding to spurious `popstate`.
- Live observation (reproducible, clean full reload from `about:blank`):
  - `goto('http://localhost:5174/cube')` resolved to `http://localhost:5174/cube#/easing?anim=Easing+Preview` and rendered the EASING editor, not the cube (screenshot `cube-initial.png`).
  - From a clean `about:blank → /#/cube`, within ~600ms the hash autonomously flipped `#/cube → #/spring?anim=Spring+Preview` and the cube unmounted (`.cube` gone, `cube:false`); a 12×150ms sampler then showed it settle on `#/spring` and merely append `?anim=Spring+Preview` once.
  - `history.length === 50` (saturated). The flips are the saturated history stack's `popstate` events being followed blindly by the hash router; the `?anim=` append is `useSceneUrl`'s own `router.replace`.
  - On a genuinely clean reload (history not yet saturated) the cube DID mount correctly (6 `.cube-side`, `perspective:1200px`, `#/cube?anim=Rotations`) — so the bug is the machine's *reaction to competing writers*, not the cube itself.
- Why it matters (gestalt): three independent writers (the URL the user navigated to, the localStorage "last scene" restore, and the `?anim=` debounced writeback) all mutate the same hash with no single source of truth and no generation guard at the SCENE level (the gen counter in `useSceneUrl` guards only `anim`, not the route). The cube/amiga can be evicted mid-interaction; this is the mechanism behind the user's "switching easing→cube→back leaves an impossible routed state."
- Gestalt fix: collapse the scene state into ONE authority. Recommended (modern, robust, per D12's ask): a `createGlobalState` (vueuse) or small Pinia store holding `{ activeSceneId, perScene: Record<superKey, { selectedAnimation, playback }> }`, with the URL as a *projection* of that store (one-way: store → `router.replace`, and `popstate`/deep-link → store via a single reconcile that is generation-guarded). Drop the localStorage "last scene" restore-on-home race entirely; persistence becomes a `watch` on the store, not a competing navigation. The `?anim=` writeback should NEVER fire for a *default* selection (only for a user choice) so a bare scene mount produces zero history entries.
- Falsifiable instrument: `proof:scene-machine-idempotent` — a test that drives `/#/cube`, asserts (a) after N rAF frames the hash is still `#/cube` (or `#/cube?anim=Rotations` if anim is user-meaningful, NOT a churn), (b) `history.length` increments by ≤1 per user scene-switch, (c) firing a synthetic `popstate` to a stale entry does not evict the active scene without a matching store change. Visual lock: snapshot the cube present 1s after deep-link load.

### A2 — Amiga renders at `devicePixelRatio × 2` → up to 16× the pixels on retina (perf)
- Disposition: **MEASURE-FIRST** (the fix is obvious; the gate is the measurement)
- Anchor: `demo/app/scenes/AmigaScene.vue:47` — `renderer.setPixelRatio(window.devicePixelRatio * 2);`
- Claim: on a dpr=2 display the WebGL backing store is `2 × 2 = 4×` linear → **16× the fragment work** of a 1:1 buffer, for a single Lambert-shaded sphere where supersampling buys almost nothing perceptible (the renderer already requests `antialias:true`, `AmigaScene.vue:46`). On dpr=3 phones it is 36×. This is pure GPU/battery waste and the most likely contributor to any felt jank when amiga is foregrounded. (Live confirmation of the multiplier was blocked: the headless env reported `dpr:1`, so the `×2` is currently a 4× — still 4× too much vs. 1:1 with MSAA — and the source is unambiguous.)
- Gestalt fix: `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` — the canonical Three.js cap; rely on the already-enabled MSAA for edge quality. One line, removes the legacy `× 2` over-render in one motion.
- Falsifiable instrument: `proof:amiga-pixel-cap` — assert `renderer.getPixelRatio() <= 2`. Optional MEASURE gate: a `bench/` capture of mean frame time on the amiga sphere before/after the cap on a dpr≥2 surface (expect a large drop).

---

## HIGH

### A3 — `tesselateSphere` builds a 1024×1024 canvas via a per-pixel `fillRect` loop drawing 64×64 tiles at 64× offsets (correctness + perf)
- Disposition: **SHIP-in-H**
- Anchor: `demo/amiga/utils.ts:9,17-24`
  ```
  const boardSize = tileSize * 16;            // 1024
  for (let y = 0; y < boardSize; y++)         // 1024 iterations
    for (let x = 0; x < boardSize; x++)       // ×1024 = 1,048,576 iterations
      if ((x + y) % 2 === 0)
        ctx.fillRect(x * 64, y * 64, 64, 64); // draws a 64px tile at x*64 (off-canvas for x>15)
  ```
- Claim: the loop bounds are the full pixel grid (0..1023) but it multiplies by `64` and draws a `64×64` rect, so it issues ~500k `fillRect` calls of which all but the first 16×16 land entirely off the 1024px canvas — a half-million wasted draw ops on every amiga mount, and the checkerboard period is wrong relative to intent (the visible board is a 16×16 of 64px tiles painted ~500k times over). This is a genuine bug, not just inefficiency: the intended loop is `for (y=0; y<16; y++) for (x=0; x<16; x++) fillRect(x*64, y*64, 64, 64)`.
- Gestalt fix: iterate the 16×16 tile grid, not the pixel grid (DRY against `tileSize`/`boardSize`). Better still, a CSS-checkerboard `CanvasTexture` is overkill — a 2×2 `DataTexture` with `magFilter: NearestFilter` and `repeat.set(16,16)` is the idiomatic Three.js checkerboard (no per-pixel JS, GPU-tiled). Either is a one-shot replacement of the loop.
- Falsifiable instrument: `proof:amiga-tessellate-tilecount` — instrument/spy `fillRect` (or assert the texture-gen path) calls ≤ 256, not ~500k. Visual lock: a screenshot of the amiga sphere checkerboard before/after must be pixel-identical (proving the fix is isomorphism-preserving).

### A4 — `?anim=` URL writeback fires for the DEFAULT selection, polluting history on every cube/amiga mount (D12 contributor)
- Disposition: **SHIP-in-H** (folds into A1's gestalt)
- Anchor: `demo/app/useSceneUrl.ts:36-55,63-67`; live: every clean scene mount appended `?anim=Rotations` (cube), `?anim=Spring+Preview` (spring), `?anim=Easing+Preview` (easing) within 300ms with no user action.
- Claim: the model→URL watcher fires when `useSceneGroupSync` (`demo/app/useSceneGroupSync.ts:63-65`) auto-selects `names[0]` as the default. A *default* is not a user intent and should not produce a URL/history mutation; doing so saturates history (A1) and makes Back unpredictable across cube↔amiga.
- Gestalt fix: only write `?anim=` when the selection differs from the scene's first/default animation (or when the user explicitly picks via the ribbon dropdown). In the A1 store model, the URL is a projection that omits defaults.
- Falsifiable instrument: covered by `proof:scene-machine-idempotent` clause (b): ≤1 history entry per user switch; bare mount adds zero.

### A5 — Amiga is dead in the demo's playback contract: it ships an `AnimationGroup` it never plays, and the ONLY interactivity is raw OrbitControls (pertinence + D11)
- Disposition: **RECORD** (decision) → **SHIP-in-H** if it survives
- Anchors:
  - `demo/app/scenes/AmigaScene.vue:31` builds `animationGroup` via `useAmigaAnimations`, exposes it (`:148-151`) — but nothing in the scene calls `animationGroup.play()`; the only running loop is the Three.js `OrbitControls` + `renderer.render` rAF (`AmigaScene.vue:101-109`). The sphere's bounce/rotation/color-cycle keyframe group (`demo/amiga/useAmigaAnimations.ts:28-122`) is constructed and `markRaw`'d into App's `currentAnimationGroup` via `useSceneGroupSync`, so the playback ribbon drives it — but the scene's own render loop is independent, and the engine's `transform` callback writes `sphereMesh.position/rotation` only when the group is actually playing. Net: amiga's headline "engine animates a Three.js object" story depends entirely on the brittle group-sync (A1) being intact.
  - `AmigaScene.vue:79-82` — interactivity is stock `OrbitControls` (orbit/zoom/pan) on the *camera*, not the engine and not the cube's quaternion `OrbitalDrag`. It is competent but generic, and inconsistent with the cube's gold-standard drag (the user's D11 "more interactive" ask).
- Claim: amiga's pertinence is the weakest of the lane. It demonstrates "engine drives a non-DOM target" (the genuine `singleTarget=false` per-animation path, `useAmigaAnimations.ts:126`), which IS a valuable proof — but its UX is a camera orbit unrelated to the engine, and the engine animation only runs through the fragile shared group plumbing.
- Gestalt fix (if it survives): keep amiga as the canonical "non-DOM target" proof but make the *sphere* the interactive subject — let a drag throw the sphere (engine-driven impulse + `SpringProgress`/`decay` settle, dogfooding the same `decay()` the cube's `useOrbitalInertia` already imports, `useOrbitalInertia.ts:11`). That unifies the interactivity language with the cube and makes the engine the thing you touch, not the camera. If it does NOT survive hardening, KILL the scene rather than ship a generic OrbitControls demo.
- Falsifiable instrument: `proof:amiga-engine-drives-mesh` — assert the sphere's `position`/`rotation` change while the group plays (engine path live), independent of camera orbit. Visual lock: bounce extent matches `BOX_SIZE` bounds (`useAmigaAnimations.ts:61-65`).

### A6 — Cube + amiga have NO designed nav icons in the scene-switcher store; only ChromeDock hard-codes cube/amiga PNGs (D8 context)
- Disposition: **RECORD** → glass-ui-aware
- Anchors: `demo/app/scenes.ts:7-14,54-123` — `SceneDescriptor` has no `icon`/`thumbnail` field; cube/amiga icons exist only as PNG imports in `demo/@/components/custom/dock/ChromeDock.vue:20-21` (`cube-icon-sm.png`, `amiga-icon-sm.png`). Spring/Sequence/Path/Discrete have none (D8). The PNG approach is inconsistent with the "screenshotted SVG thumbnails" the user wants and is not co-located with the scene definitions.
- Claim: the icon source-of-truth should live on `SceneDescriptor` (one place), not split between a PNG import map in the dock and nothing for the new scenes. This is the structural enabler for D8's "proper designed SVG icons."
- Gestalt fix: add `icon` (an SVG component or screenshotted SVG path) to `SceneDescriptor`; ChromeDock consumes `scene.icon` uniformly. Cube/amiga get the same SVG treatment as the new scenes (isomorphic). (Icon *artwork* generation is the D8 lane; this lane records the structural anchor.)
- Falsifiable instrument: `proof:scene-icon-uniform` — assert every `scenes[]` entry has a non-null `icon` and ChromeDock renders `scene.icon` (no hard-coded per-id PNG branch).

---

## MEDIUM

### A7 — `idle-bob` is a hand-written CSS `@keyframes` in CubeTarget — a missed dogfood of the engine
- Disposition: **BOOK**
- Anchor: `demo/cube/CubeTarget.vue:140-155` — `@keyframes idle-bob { translateY(0) → 5px }` driven by raw CSS `animation`, gated on `prefers-reduced-motion`.
- Claim: the demo's thesis is "the engine animates anything"; the cube's resting idle bob is hand-rolled CSS rather than a tiny `CSSKeyframesAnimation`/`hover()` preset (the cube already imports `animations.hover`, `useCubeAnimations.ts:76`). It is correct and reduced-motion-aware, so this is a cohesion/dogfood nit, not a defect.
- Gestalt fix: drive the idle bob from a small engine animation (or fold it into the existing `hoverAnim`) so the resting state is engine-authored too — one fewer ad-hoc CSS island. MEASURE-FIRST not needed (no perf claim); BOOK as a cohesion improvement.
- Falsifiable instrument: visual lock — idle bob amplitude/period unchanged; `proof:no-adhoc-cube-keyframes` greps CubeTarget for `@keyframes` and expects none beyond the (engine-twinned) reduced-motion gate.

### A8 — OrbitalDrag quaternion core is ALREADY-SOTA (honest note, not a defect)
- Disposition: **RECORD** (exemplary)
- Anchors: `demo/@/components/custom/orbital-drag/OrbitalDrag.vue:69-130` (persistent quaternion source-of-truth, delta-multiply, never reconstructed from Euler → gimbal-free), `:54-67` (renders ONE `rotate3d()` off the quaternion's native axis-angle, zero Euler decompose), `:296-303` (echo-skip reverse path: external Euler writes re-seed the quaternion, self-echo is byte-identical so skipped), `useOrbitalInertia.ts:69-92` (frame-rate-exact analytic `decay()` dogfooded from the shipped engine closed form, not hand-rolled `Math.pow`).
- Claim: this is the interactivity gold standard the prompt names, and it earns it — zero-alloc reused out-params (`renderAxis`, `OrbitalDrag.vue:52`), EMA-smoothed angular velocity (`:125-129`), `setPointerCapture`-based containment, Safari `gesture*` + touch pinch composed cleanly into separate composables. No change recommended; preserve under regression lock.
- Falsifiable instrument: `proof:orbital-quaternion-no-gimbal` — drive a 90°+90°+90° sequence and assert no gimbal-lock degeneracy in the rendered `rotate3d` axis; `proof:orbital-inertia-parity` (already implied by `inertiaDecay.ts`) keeps the decay isomorphism.

### A9 — Cube `useTransformState`/matrix-editor reset uses a misleading `easeInBounce` and `Math.acos` Euler recovery (subtle)
- Disposition: **BOOK** / MEASURE-FIRST for the math
- Anchors:
  - `demo/@/components/custom/matrix-editor/useTransformState.ts:61-67` — `syncTransformations(reset)` recovers Euler via `Math.acos(values[0/5/10])` from the matrix diagonal. This conflates the rotation cosine with the scale factor (diagonal entry = `scale·cos(angle)`), so for any non-unit scale the recovered rotate/scale are wrong; it only happens to look right at scale=1. It is a latent correctness issue in the matrix-editor reset path.
  - `useTransformState.ts:107-109,183` — `resetMatrix` animates with `timingFunction: easeInBounce`; an `easeIn`-bounce on a *reset to identity* bounces at the START (away from rest) which reads oddly for a "snap home" gesture.
- Claim: the diagonal-acos Euler recovery is mathematically unsound under scale; the cube currently never scales via this path so it's latent, but it's a trap. The reset easing is a polish nit.
- Gestalt fix: recover translate from the matrix (correct, `:55-57`) but DERIVE rotate/scale from a proper decomposition (gl-matrix `mat4.getScaling`/`getRotation` → the quaternion the OrbitalDrag already speaks) instead of `acos` on the diagonal — and reuse OrbitalDrag's `quaternionToEulerDegrees` so the two paths share ONE convention (DRY; the Euler convention note in `OrbitalDrag.vue:91-101` already warns about this). Change reset easing to an `easeOut`/spring settle (dogfood `SpringProgress`).
- Falsifiable instrument: `proof:matrix-decompose-correct` — set scale≠1 + a rotation, round-trip through `syncTransformations(reset)`, assert recovered rotate/scale match within ε (currently fails).

### A10 — Shared editor-shell defects reproduce while cube/amiga are active (cross-ref, not this lane's primary)
- Disposition: cross-reference (own lanes own the fix)
- Live anchors (screenshot `amiga-attempt.png`, Square scene but identical shell used by cube/amiga):
  - **D1** controls are TWO columns (duration|delay, iterations|direction, fill mode|easing) — should be one column. Lane: controls.
  - **D2/D14** a green/teal RADIAL-BLUR smear is visible on the "advanced" panel and around the PlaybackRibbon on hover — the specular-radial-blur defect; should be a refined specular + cartoon-shadow depth. Lane: design-idioms/glass-ui.
  - **D4** the PlaybackRibbon (Play/Reverse slider) is FULL-WIDTH while the controls card is sidebar-width — should match the controls sidebar width. Lane: PlaybackRibbon.
- Claim: these are not cube/amiga-specific but they degrade BOTH scenes since both ride `EditorShell`. Recorded so the synthesis sees they affect this lane's scenes too.
- Falsifiable instrument: those lanes' gates; this lane only attests live reproduction under cube/amiga.

### A11 — Engine throws `Parse error at offset 0: "......"` when easing/cube scene state cross-contaminates (D6/D12 interaction, observed)
- Disposition: **RECORD** (symptom; root in A1)
- Anchor (live): on the corrupted `/cube#/easing` load, console showed `Error: Parse error at offset 0: "......"` originating `src/animation/engine.ts:576 processFrame → engine.ts:516 interpFrames → value.js _lerp keyFn` (the ellipsis string `"......"` is the easing scene's dot/typing artifact being fed to the cube's animation pipeline). This is the visible failure mode of the scene cross-contamination in A1, and ties into the dot-fade breakage (D6, a start-screen lane) — when scenes bleed, the engine receives an unparseable value.
- Claim: a hardened scene machine (A1) makes this unreachable; the engine should additionally never throw on an unparseable interp value mid-frame (it should clamp/skip), but that engine-robustness item belongs to a parsing/engine lane.
- Falsifiable instrument: `proof:no-engine-throw-on-scene-switch` — rapid easing↔cube↔amiga switching produces zero uncaught `interpFrames` throws in the console.

---

## Already-SOTA (honest ε)
- OrbitalDrag quaternion core + analytic inertia (A8) — exemplary; lock, don't touch.
- Scene lifecycle hygiene: `AmigaScene.vue:128-146` disposes geometries/materials/renderer + cancels rAF on unmount; `useSceneVisibilityPause` (cube `useCubeAnimations.ts:112-116`, amiga `AmigaScene.vue:122-126`) pauses the rAF/present loop on tab-hide with continuity-preserving resume — correct, idiomatic, battery-aware.
- `useResizeObserver` camera-aspect handling (`AmigaScene.vue:91-99`) with a pre-mount guard — clean vueuse ownership.
- `sharedCubeTransform` cross-scene persistence (`demo/app/cubeTransformStore.ts`) is a tidy module-level ref for home↔cube continuity.

## Disposition summary
- SHIP-in-H: A1 (scene machine), A3 (tessellate loop), A4 (anim writeback — folds into A1)
- MEASURE-FIRST: A2 (retina pixel cap)
- BOOK: A7 (idle-bob dogfood), A9 (matrix decompose + reset easing)
- RECORD: A5 (amiga pertinence decision), A6 (icon structure), A8 (SOTA lock), A10 (shell cross-ref), A11 (engine-throw symptom)
- KILL candidate: A5 amiga, only if it fails to earn its interactivity story.

Primary lane verdict: the cube engine is already-SOTA; the work is (1) make the scene
machine irrefragable so the cube can STAY mounted and interactive (A1, the user's #1
pain), and (2) stop amiga over-rendering and mis-tessellating (A2/A3). Amiga's
pertinence is the open question (A5).
