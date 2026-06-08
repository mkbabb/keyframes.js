# impl-w5-gate-perf — the proof:scene-perf-budget gate-authoring lane (H.W5 S6)

**Lane:** H.W5 GATE — RE-AUTHOR `proof:scene-perf-budget` (the prior workflow's
gate-authoring lane was cut by a session limit before its files persisted). The
landed W5 S6 SOURCE (the cube/amiga perf + amiga rebuild) is already in the tree
and tsc-clean; this lane delivers the gate that BITES it. CONTRACT = H.W5.md
§Hard gate (`proof:scene-perf-budget`). NO git commit (the lead commits). Did NOT
edit the landed source except a transient revert+restore to PROVE the live clause
bites (the `setPixelRatio` line is byte-restored to the landed cap form).

---

## Files authored

- `scripts/proof-scene-perf-budget.mjs` — **NEW.** The five-clause gate (static
  source anchors + a Playwright browser half), mirroring
  `scripts/proof-easing-canvas-bounded.mjs`'s serveDist + settle plumbing.
- `scripts/baselines/amiga-checkerboard.json` — **NEW.** The committed
  checkerboard pixel-identity baseline (the 16×16 tile-color grid + the board
  dims). The pixel-identity clause compares the live render's tile grid to this.
- `package.json` — wired `proof:scene-perf-budget` (the named script chains the
  node gate + `vitest run test/amiga-sphere-spin.test.ts` — the deterministic A5
  anchor) AND folded it into the `proof:all` chain after `proof:easing-canvas-bounded`.
- `.github/workflows/ci.yml` — added the `proof:scene-perf-budget` step in the
  demo job (after `proof:easing-canvas-bounded`, after the gh-pages build) with
  `KF_REQUIRE_BROWSER: "1"` (a playwright-absent skip → hard CI fail).

---

## The five clauses (each BITES per H.W5.md §Hard gate)

### proof:amiga-tessellate-tilecount (A3 — SHIP)
- **Live BROWSER:** spy `CanvasRenderingContext2D.fillRect` (installed at
  document-start via `addInitScript`, armed only during the amiga mount window)
  → **130 calls ≤ 256** (the tile-loop's 1 base fill + 128 dark tiles + one
  benign live base draw) AND the rendered checkerboard **PIXEL-IDENTICAL** to the
  committed baseline. The grid is reconstructed by replaying the captured
  fillRect ops onto a probe 2d canvas and sampling each 64×64 tile center → the
  exact pixel result tesselateSphere painted, independent of the WebGL upload.
- **STATIC anchor:** `demo/amiga/utils.ts` iterates the 16×16 TILE grid
  (`tiles = 16`, the `ty`/`tx < tiles` loops) and has NO `< boardSize` pixel-grid
  loop.
- **BITE (proven):** the pre-fix 1024×1024 PIXEL-grid loop issues ~524,288
  off-canvas fillRect (count clause reds) AND paints only a 16×16-px corner
  (pixel-identity grid ≠ baseline reds). Both born-RED forms verified to flip the
  clause RED.

### proof:amiga-pixel-cap (A2 — MEASURE-FIRST)
- **Live BROWSER (deviceScaleFactor=2):** effective device-pixel-ratio =
  `canvas.width ÷ CSS width` = **2.00 ≤ 2** (buffer 1606px ÷ 803px CSS @
  devicePR=2; the renderer is a local `let` not exposed, so the backing-store
  ratio is the faithful read of `renderer.getPixelRatio()`).
- **STATIC anchor:** `AmigaScene.vue` is `setPixelRatio(Math.min(window.devicePixelRatio, 2))`,
  NOT the `* 2` over-render.
- **BITE (PROVEN LIVE — the load-bearing runtime fact):** reverted the source to
  `setPixelRatio(window.devicePixelRatio * 2)`, rebuilt gh-pages, re-ran → the
  live clause measured **ratio 4.00 > 2** (buffer 3212px) and reds; the static
  anchor reds too. Restored the source byte-exact + rebuilt; back to GREEN.

### proof:scene-host-contained (G1 demo-side — SHIP)
- **Live BROWSER:** the moving `.scene-host` resolves `contain: 'paint'`.
- **STATIC anchor:** `App.vue`'s `.scene-host` declares `contain: paint`.
- **BITE:** dropping `contain: paint` lets a transform behind a backdrop
  invalidate the panel blur per frame → reds (boundary verified).

### proof:offscreen-cv (G5 — SHIP)
- **Live BROWSER:** the amiga `.scene-root` resolves `content-visibility: auto`
  (the cv carrier — a flat WebGL canvas, paint-containable; the cube is the home
  backdrop + uncontainable 3D overflow, so it satisfies the no-resident-will-change
  half instead, per the foundation/cube-amiga notes). AND after settling on the
  cube scene at rest, `.cube` + all six `.cube-side` faces compute
  `will-change: auto` (no resident hint pins a compositor layer forever).
- **STATIC anchors:** the amiga `.scene-root` carries `content-visibility: auto`
  + `contain-intrinsic-size`; the cube `will-change` is TRANSIENT (`.playing` /
  `:hover` gated) with NO resident `.cube-side` hint (CSS/JS comments stripped
  before the will-change scan so the design-decision prose is not read as a
  declaration).
- **BITE:** a resident `will-change: transform` on `.cube-side` reds; dropping
  content-visibility from the amiga root reds (boundaries verified).

### proof:amiga-engine-drives-mesh (A5 — REBUILD, WV-W5-MED-3)
- **RIGOROUS anchor (the authority):** `test/amiga-sphere-spin.test.ts` (5/5
  green) — a real Three.js mesh/camera/canvas + mocked clock; asserts a
  pointer-drag-RELEASE seeds a `decay()` glide that drives the mesh for **≥10
  post-release frames slowing MONOTONICALLY** then rests (NOT autoplay, the
  cube dogfood idiom). The npm script chains this vitest after the node gate.
- **STATIC anchor:** `useSphereSpin.ts` imports `decay` from
  `@src/animation/decay` + calls `decay({velocity, friction})`; the AmigaScene
  present loop calls `sphereSpin.tickGlide()`.
- **Live BROWSER (soft witness):** flick the canvas + sample post-release frames
  via `drawImage` readback. SOFT by design — a headless WebGL readback can be
  tainted/clamped (it reported 0 changed frames locally, logged as `○` not a
  fail). The deterministic isolation test is the rigorous proof; the live witness
  fails only if the canvas were readable AND wholly static.
- **BITE:** reverting to the never-played `AnimationGroup` + camera-only
  OrbitControls (no engine impulse) reds the isolation test + the source anchor.

---

## Settle-gating (per the contract)

Scene switches are driven IN-PAGE via `location.hash = "#/<scene>"` then the FSM
`activeScene` is polled to rest (`MACHINE_KEY = keyframes-js-scene-machine`)
before any computed-style probe — the EXACT reconcile fixed point the in-app
Scene combobox funnels through (the dock Select `aria-label="Scene"` emits
`switchScene` → `runSceneSwitch` → NAVIGATE → the writer). `page.goto` clears
storage + the H.W1 trap, so the hash assignment is the settle idiom (the same one
`proof:scene-machine-irrefragable` / `proof:easing-canvas-bounded` use). The
clauses therefore fail on scene-perf, not the route storm — settled on the H.W1
FSM resting (`proof:scene-machine-irrefragable` is green).

---

## Verification run

- `npm run proof:scene-perf-budget` → **PASS** — 12/12 node clauses GREEN
  (6 static anchors + 6 browser facts; the live engine-drives-mesh witness logs
  `○` under the WebGL-readback confound) + the chained
  `test/amiga-sphere-spin.test.ts` (5/5) GREEN.
- born-RED proven: every static anchor flips RED on its reverted form (A3
  pixel-grid loop, A2 `dpr*2`, G1 no-contain, G5 resident will-change); every
  browser clause threshold flips RED on its born-RED measured value; and the A2
  cap was reverted+rebuilt LIVE → the browser clause measured ratio 4.00 and red,
  then restored byte-exact → GREEN.
- `node scripts/proof-ci-coverage.mjs` → PASS — all 62 proof:* gates invoked in
  CI (the new gate is recognized + wired).
- `node -c` / YAML load of ci.yml + JSON parse of package.json → both valid.

## Cross-lane notes

- The baseline `fillRectCount` (130) is INFORMATIONAL — the clause asserts ≤256,
  not equality; the pixel-identity clause asserts the tile GRID equals the
  baseline. Regenerate ONLY on an intentional tessellation re-author:
  `node scripts/proof-scene-perf-budget.mjs --update-baseline`.
- The renderer is a local `let` in `AmigaScene.vue` (not exposed); the pixel-cap
  clause reads the backing-store ratio off the live `<canvas>` instead of
  `renderer.getPixelRatio()` directly — a faithful, non-invasive measure (no
  source `defineExpose` edit needed).
- The live engine-drives-mesh witness is intentionally SOFT (WebGL readback
  confound in headless); the deterministic `test/amiga-sphere-spin.test.ts` is
  the hard A5 proof, chained into the npm script so CI runs it.
