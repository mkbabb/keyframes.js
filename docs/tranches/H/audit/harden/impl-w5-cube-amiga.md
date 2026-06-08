# impl-w5-cube-amiga — the CUBE/AMIGA perf + AMIGA rebuild lane (H.W5 S6)

**Lane:** H.W5 S6 — the cube/amiga scene-quality + demo-perf budget. Owns the two
ORIGINAL stage scenes the icon family rides over: A3 (SHIP), A2 (MEASURE-FIRST),
A5 (REBUILD — lead verdict), G1 (SHIP+MEASURE), G5 (SHIP+MEASURE), DC-8 (grep=0).
**Touched ONLY** amiga/cube scene files + the scene-host style in App.vue. Did
NOT touch `scenes.ts`/`router.ts` (foundation/other lanes own those). tsc-clean
(`tsc --noEmit` AND `check:lib`, both exit 0); `npm run gh-pages` builds green; NO
git commit.

---

## Files touched

- `demo/amiga/utils.ts` — A3 tessellate tile-loop fix.
- `demo/app/scenes/AmigaScene.vue` — A2 dpr cap; A5 sphere-spin wiring; G5
  content-visibility on the scene root + the `contentvisibilityautostatechange`
  WebGL-pause; `touch-action:none` on the canvas.
- `demo/amiga/useSphereSpin.ts` — **NEW.** The A5 drag→impulse→`decay()` glide
  composable (the engine driving the non-DOM mesh; the cube dogfood idiom).
- `demo/cube/CubeTarget.vue` — G5 transient `will-change` discipline.
- `demo/app/App.vue` — G1 `contain: paint` on the `.scene-host` style block ONLY
  (the narrow style target the contract granted; no template/script edit).
- `test/amiga-sphere-spin.test.ts` — **NEW.** Locks the A5 engine-drives-mesh
  contract (5 tests, all green).

---

## A3 (SHIP) — the `tesselateSphere` off-canvas fillRect bug

The former loop iterated the **1024×1024 PIXEL grid** issuing `fillRect(x*64, …)`
with `x`/`y` up to 1023 — `524,288` `fillRect` calls of which all but the first
16×16 (`x<16 && y<16`) landed WHOLLY OFF the 1024×1024 canvas. A genuine bug
(~524k off-canvas draws every amiga mount), not just waste. Fixed to iterate the
**16×16 TILE grid** (`for ty<16 for tx<16 fillRect(tx*64, ty*64, 64, 64)`).

**MEASURE-FIRST (call-count + pixel-identity, pre-jsdom pure sim):**

| | fillRect calls | on-canvas tiles drawn |
|---|---|---|
| BEFORE (pixel grid) | **524,288** | 128 |
| AFTER (16×16 tile grid) | **128** | 128 |

Checkerboard **PIXEL-IDENTICAL** on the visible board (every dark tile coordinate
matches; set-equality verified). `proof:amiga-tessellate-tilecount ≤256` →
**128 ≤ 256 GREEN.** Live screenshot confirms a crisp red/white checkerboard
sphere (no visual degradation).

## A2 (MEASURE-FIRST) — the dpr cap

`AmigaScene.vue` was `setPixelRatio(window.devicePixelRatio * 2)` → a 4× CSS-pixel
drawing buffer on a dpr=2 retina surface (16× the fragments vs CSS pixels; 4× vs
the cap). Capped to `setPixelRatio(Math.min(window.devicePixelRatio, 2))`. MSAA
(`antialias:true`) already carries edge quality, so the super-sample was pure
fill-rate waste.

**MEASURE-FIRST, dpr=2, 800×600 stage (proxy fill cost @0.18ns/shaded-fragment):**

| | setPixelRatio | drawing buffer | fragments | proxy GPU fill |
|---|---|---|---|---|
| BEFORE | 4 | 3200×2400 | 7,680,000 | ~1.38 ms/frame |
| AFTER | 2 | 1600×1200 | 1,920,000 | ~0.35 ms/frame |

**4× fragment reduction (−75%).** LIVE (Playwright, real dpr=2 surface, 752×704
CSS canvas): buffer `1504×1408`, **effectivePixelRatio = 2.0** (was 4 → 3008×2816).
`proof:amiga-pixel-cap` (`getPixelRatio() ≤ 2`) → **GREEN.**

## A5 (REBUILD — lead verdict) — the sphere is the interactive subject

The amiga built an `AnimationGroup` it never `.play()`s; the only interactivity
was stock `OrbitControls` on the CAMERA. Rebuilt (feature-preserving — KEEPS the
route/descriptor + the playback-registered rotation group): a pointer-drag on the
SPHERE spins the mesh, and on RELEASE the engine's SHIPPED analytic `decay()` glide
coasts the spin to rest — **the engine driving a non-DOM (Three.js) target**.

- **inv-ζ dogfood, REUSE not new gesture code:** `useSphereSpin.ts` consumes
  `decay()` from `@src/animation/decay` — the SAME closed-form the cube's orbital
  inertia rides (`useOrbitalInertia.ts:11,69`). Per-axis `decay({velocity, friction})`
  sampler advanced by wall-clock seconds in the present loop; the per-frame angle
  DELTA drives `mesh.rotation`.
- **Disjoint gesture landlords (no collision, the BLK-6-style arbitration):** a
  capture-phase `pointerdown` RAYCASTS the sphere. A HIT → spin gesture (orbit
  stands down via `controls.enabled=false` for the drag); a MISS → falls through
  to OrbitControls (camera orbit, untouched). The two never race.
- **Independent of camera orbit:** the spin drives `mesh.rotation` directly; the
  camera orbit is a separate concern. `proof:amiga-engine-drives-mesh` (WV-W5-MED-3:
  "after a pointer-drag-RELEASE the mesh continues to change for ≥N frames under
  `decay()` glide — NOT autoplay") is met by the release glide, not the group.

**LOCKED by `test/amiga-sphere-spin.test.ts` (5 tests, all green):** center-grab
hit-tests the sphere + suppresses orbit; a miss falls through (orbit stays on);
drag mutates rotation live; **RELEASE seeds a decay() glide that drives the mesh
for ≥10 frames, slows MONOTONICALLY (decay, not constant spin), then rests**; a
static tap arms no glide. LIVE Playwright flick on the dpr=2 amiga also showed the
canvas changing across post-release frames (confounded by orbit damping there —
the isolation test is the rigorous proof).

## G1 (SHIP + MEASURE) — `contain: paint` on the scene-host

Added `contain: paint` to the `.scene-host` style block (App.vue). H.W3's
rail·stage·rail column separation already moved the glass panels off this host's
stacking context (the architectural half); `contain: paint` then walls the host's
transforms off so a moving subject (the cube/amiga spin) cannot force the sibling
panels' `backdrop-filter` to re-sample per scene frame. **LIVE: `.scene-host`
resolves `contain: paint`** → `proof:scene-host-contained` GREEN.

## G5 (SHIP + MEASURE) — transient will-change + content-visibility

- **Transient `will-change` (cube, `CubeTarget.vue`):** the former code held
  `will-change: transform` RESIDENT on `.cube` AND all six `.cube-side` faces (the
  G5 anti-pattern — a resident hint pins compositor layers forever). The faces
  carry STATIC per-face transforms (they never re-transform — only the parent
  `.cube`/OrbitalDrag container animates), so the face hints were six permanent
  layers for nothing → **dropped**. `.cube`'s hint is now TRANSIENT — applied only
  `.idle-hover.playing .cube` / `.graph:hover .cube`, dropped at rest. **LIVE
  (verified): at rest `will-change: auto` on `.cube` AND all 6 faces; while playing
  `.cube` → `transform`; after rest → `auto`.** No resident `will-change` survives
  a settled frame → `proof:offscreen-cv` (the will-change half) GREEN.
- **`content-visibility:auto` (amiga, `AmigaScene.vue`):** the amiga scene root
  (`.scene-root`) carries `content-visibility: auto` + (MANDATORY per the
  modern-web guidance, else 0px collapse) `contain-intrinsic-size: auto none auto
  600px`. When occluded (mobile sheet over the stage, scrolled off-screen) the
  browser skips its render AND the `contentvisibilityautostatechange` listener
  stands the WebGL present loop down (composing with the existing tab-visibility
  pause). **LIVE: `.scene-root` resolves `content-visibility: auto`,
  `contain-intrinsic-size: auto none auto 600px`** → `proof:offscreen-cv` (the cv
  half) GREEN.
- **DESIGN DECISION — the cube scene root deliberately does NOT take
  `content-visibility:auto`.** The cube uses `overflow-visible` + `perspective:
  1200px` + `1000vw`-wide axis lines that extend FAR beyond the scene box, and it
  is the HOME backdrop (always above-the-fold on `/`). `content-visibility:auto`
  forces `contain: layout style paint` — the `paint` containment would CLIP the 3D
  faces/axis lines (a visual regression), and the guidance explicitly forbids
  applying it to above-the-fold elements (it delays critical render). The amiga (a
  flat WebGL canvas) is the content-visibility carrier; the cube satisfies the
  "no resident will-change" half. The single-mount scene-host architecture (one
  `<Suspense :key>` scene in the DOM at a time) means "inactive scene root" is an
  existential clause — the amiga root satisfies the cv requirement.

## DC-8 (SHIP, grep=0) — the dead scene-swap CSS

**grep for dead scene-swap CSS rules in source = 0** (`grep '\.scene-swap|@keyframes
[a-z-]*swap|scene-swap-enter|scene-swap-leave|scene-dissolve'` over `demo/`, excl
dist/node_modules → no matches). The DC-8 disposition was "KILL the dead CSS or
RESTORE via VT." The VT path is ALREADY LIVE (`useSceneTransition` +
`view-transition-name: scene-subject` on the scene-host, E.W11) — the "RESTORE via
VT" arm — and the spring `useSceneSwap` is the live no-VT fallback (its
`sceneSwapStyle` is consumed in App.vue:128/233). The only `scene-swap` source
references are the LIVE composable name + descriptive comments. **No dead CSS rule
exists to remove — the grep=0 gate is structurally satisfied** (no vacuous edit
made; documenting the satisfied condition is the correct disposition).

---

## Verification run

- `npx tsc --noEmit` → clean (exit 0)
- `npm run check:lib` (`tsc --noEmit -p tsconfig.lib.json`) → clean (exit 0)
- `npm run gh-pages` → built green (`✓ built in 1.38s`, exit 0)
- `npx vitest run` → **67 files, 671 passed | 2 expected-fail** (no regressions;
  `test/amiga-sphere-spin.test.ts` integrated, 5/5 green)
- LIVE (Playwright, served dist @ dpr=2): amiga `effectivePixelRatio=2`,
  `.scene-host contain:paint`, `.scene-root content-visibility:auto`,
  canvas `touch-action:none`, **0 console errors / 0 warnings** on both amiga and
  cube; cube `will-change` transient (rest→playing→rest = auto→transform→auto);
  cube 3D faces + axis lines render uncl­ipped; amiga checkerboard sphere crisp.

## Cross-lane notes

- The `proof:scene-perf-budget` gate scripts (`proof:amiga-tessellate-tilecount`,
  `proof:amiga-pixel-cap`, `proof:scene-host-contained`, `proof:offscreen-cv`,
  `proof:amiga-engine-drives-mesh`) are H.W8's to AUTHOR — they do not exist in
  `scripts/` yet (correct per the wave). This lane delivers the SOURCE surfaces
  those gates assert against, all measured GREEN above. Anchors for the gate lane:
  - tilecount: spy `CanvasRenderingContext2D.fillRect` during an amiga mount →
    expect ≤256 (lands 128). Or assert `demo/amiga/utils.ts` iterates `tiles=16`.
  - pixel-cap: `renderer.getPixelRatio() ≤ 2` (live = 2 at dpr=2). Source anchor:
    `AmigaScene.vue` `setPixelRatio(Math.min(window.devicePixelRatio, 2))`.
  - scene-host-contained: `getComputedStyle('.scene-host').contain` includes `paint`.
  - offscreen-cv: `getComputedStyle('.scene-root').contentVisibility === 'auto'`
    (amiga) AND no resident `will-change` on `.cube`/`.cube-side` at rest.
  - engine-drives-mesh: the `useSphereSpin` post-release glide; `test/amiga-sphere-
    spin.test.ts` is the deterministic isolation proof.
- `useSphereSpin.ts` lives in `demo/amiga/` (an amiga scene file — in-lane). It
  imports `decay` from `@src/animation/decay` (the light surface, zero value.js
  edge) — NO engine code authored (inv-16).
- The amiga `useAmigaAnimations` rotation/bounce `AnimationGroup` is PRESERVED
  (registered via `createGroupAdapter` for ribbon playback). The drag-spin is the
  idle interactivity story; when the group plays, the group owns rotation. Both
  coexist (the lead verdict: REBUILD feature-preserving, not kill).
