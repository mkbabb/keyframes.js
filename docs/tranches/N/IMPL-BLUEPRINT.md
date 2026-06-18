# Tranche N — the Stage switcher IMPLEMENTATION blueprint (baked, real demo)

> The owner authorized full implementation ("fully bake this now") on branch `n-stage-impl`.
> This is the REAL feature in `demo/`, using the actual scene **target** components as LIVE
> LOD previews + real glass-ui dock. inv-16 (kf repo only). Grounded in the real files + a
> live-verified geometry. The standalone prototype is dead; this supersedes it.

## The choreography (the owner's exact ask — from the cube view)

1. **Invoke** (click the dock scene Select / a dedicated "switch" affordance while in any scene,
   cube being the canonical demo): the current scene + its controls do NOT just disappear — they
   **zoom out**, grand + sweeping + smooth.
2. **Zoom-out + fade**: the live scene scales/recedes into the ring's FRONT slot; the scene's
   control panels (AnimationControlsGroup / the editor controls) **fade out**; the top
   `ChromeDock` chrome **fades**; the bottom `TransportDock` **morphs** — its transport cells give
   way to the two **L/R carousel arrows** (same dock shell, new contents).
3. **Scenes fan into place**: the OTHER scenes animate into the ring with their **idle live
   previews** running (real running animations, NOT icons/posters), staggered in.
4. **Carousel**: the disk is tilted **back-higher ~15°** (verified: `rotateX(-15deg)` on the ring,
   `perspective: 1100px`, `perspective-origin: 50% 42%`); cards `rotateY(a) translateZ(R)
   rotateY(-a)` (counter-rotated to face the user); front (a=0) = nearest/largest/lowest, back =
   smallest/highest. Arrows / flank-click / keyboard spin the chosen card to front via
   `SpringProgress` (shortest signed delta, interruptible). Hover a flank → the downlight slides
   toward it + the centre de-emphasises.
5. **Commit**: spin-to-front → the front preview **zooms back IN** to become the live scene
   (reverse of the zoom-out), the controls + docks **fade back in**, state preserved. Routes
   through the existing `runSceneSwitch` / `startViewTransition` (`useSceneTransition`).

Every beat dogfoods the engine (inv ζ — `SpringProgress` on `RAFPlayback`, no hand-rolled rAF);
`respectReducedMotion` snaps (no zoom/orbit, instant). All `SpringProgress`/`NumericAnimation`/
`stagger`/`decay` are LIGHT-barrel imports (the picker stays value.js-free; `proof:boundary` holds).

## The LIVE preview LOD architecture (the hard part — REAL targets, throttled)

Each scene already has a **live subject "target" component** — the actual animated thing, separable
from the heavy controls:
`CubeTarget.vue` · amiga sphere (in `AmigaScene.vue`, Three.js) · `SquareInstrument.vue` ·
`EasingTarget.vue` · `SpringTarget.vue` · `SequenceTarget.vue` · `MotionPathTarget.vue`.

- **`ScenePreviewHost.vue`** mounts a scene's target component scaled into a card, with a MINIMAL
  self-contained idle state (NOT the full scene machine/stores — a thin per-scene adapter feeds the
  props the target needs to run an idle loop). The host is **fully interactive in small form**
  (pointer events pass to the target; hover/drag work).
- **LOD throttling** (`useLivePreviewLOD.ts`): ONE shared throttled clock. The FRONT card runs at
  full fps; flank cards run at a reduced cadence (~15–20fps) via a frame-skip gate; off-screen/rear
  cards get `content-visibility: auto` + their loop **paused** (`contentvisibilityautostatechange`,
  IntersectionObserver `@supports-not` fallback). Cap concurrent full-detail loops.
- **Amiga (Three.js) is special**: one WebGL preview is the perf ceiling — render it at a low fps
  when not front, pause when not visible; if still too heavy, the rear amiga falls back to a static
  last-frame poster (the ONLY allowed poster, and only for the WebGL outlier when off-front).
- Idle states are **distinct + interactive** per scene (the N.W5 requirement, realized here): cube
  slow-tumble, amiga bob, square drift, easing curve-sweep, spring needle-ring, sequence stagger
  wave, path traveller — each the target's own engine animation, gently driven.

## glass-ui (real components, the owner's "proper glass-ui")

- The bottom dock that morphs to arrows IS the real `TransportDock` (glass-ui `Dock`/`GlassDock`
  context, `demo/@/components/custom/animation-controls/TransportDock.vue`) — swap its transport
  slot contents for two glass dock-buttons (the arrows) during stage mode, same shell, animated.
- The ring cards + the stage chrome use glass-ui glass surfaces (`GlassPanel`/`.glass-floating`/
  `.glass-card`) + `.glass-refract` + specular ONLY on the front card + arrows (CONTROL-on-plate ok;
  no PLATE-on-PLATE). The downlight is pure-CSS (cone + floor pool + `@property --stage-light`) over
  the existing `.grid-background` paper (NOT a black void) — dimmed, never near-black.

## Component / file plan (NEW under `demo/@/components/custom/scene-stage/`)

```
scene-stage/
├── SceneStage.vue          # the overlay: the zoom-out container + downlight + the disk + name-plate; Teleport sibling to the keyed <Suspense> (never a KeepAlive wrapper)
├── CarouselDisk.vue        # the ring geometry (rotateX(-15deg) back-higher) + the SpringProgress orbit + per-card falloff
├── ScenePreviewHost.vue    # mounts a scene target as a scaled, interactive, LOD-throttled live preview
├── StageArrows.vue         # the two glass dock-arrows that the TransportDock hosts in stage mode
├── previews/               # 7 thin per-scene adapters: feed each target the minimal idle-state props (cube/amiga/square/easing/spring/sequence/motion-path)
├── composables/
│   ├── useSceneStage.ts     # open/close state, invoked from the dock; commit via runSceneSwitch; the zoom choreography orchestration
│   ├── useCarouselOrbit.ts  # SpringProgress ring-angle, shortest-delta spin, per-card transform derivation
│   ├── useLivePreviewLOD.ts # the shared throttled clock + content-visibility loop gating + the concurrent-loop cap
│   └── useStageLight.ts      # the --stage-light hover-brighten / focus-shift
└── sceneStageRegistry.ts   # id → { target component, the minimal idle-state adapter, the preview LOD tier }
```

Integration (owned by the core model, the high-blast-radius coupling):
- `App.vue` — Teleport `<SceneStage>` sibling to the scene host; the zoom-out transform on the scene
  host; fade the controls + `ChromeDock`; drive open from the dock; commit via `runSceneSwitch`.
- `TransportDock.vue` — the stage-mode arrow swap.
- the scene machine — `machine.activeScene` reads/commits; state preserved via the snapshot (NOT KeepAlive).

## Verified facts (do not re-derive)

- Tilt: `rotateX(-15deg)` → back higher (measured: back.top 155 < front.top 293). `+deg` is INVERTED (the prior bug).
- Targets are the live subjects; the heavy controls are separate (mount the target, not the scene).
- The keyed `<Suspense>` host stays BARE — no KeepAlive/Transition wrapper (the B.W3 async-loader blocker).
- LIGHT-barrel only in the picker; `proof:boundary` (library) + a stage import-graph walk (N.W2) guard it.
