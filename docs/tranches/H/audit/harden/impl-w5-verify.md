# impl-w5-verify — the VERIFY lane (H.W5 §Hard gate)

**Lane:** H.W5 VERIFY. Runs builds/tests, drives EVERY new gate (browser where
browser), runs the no-regression set, and BITES the two contract seams. Integrates
ONLY obvious gate-seam breaks — NO source edits were needed (the landed W5
implementation + the gate-authoring lanes' scripts both persisted this session;
nothing to re-author). NO git commit (the lead commits).

Branch: `tranche-h-impl`. Package version: `4.1.0`. Playwright 1.60.0 + chromium
present; `vite-svg-loader` resolvable.

---

## Result table (the six required runs, verbatim)

| # | Run | Result | Verbatim headline |
|---|---|---|---|
| 1 | `npx tsc --noEmit` | **GREEN (exit 0)** | the `*.svg?component` imports resolve via the `src/env.d.ts` ambient decl — clean |
| 2 | `npx vitest run` | **GREEN** | `Test Files 67 passed (67)` · `Tests 671 passed \| 2 expected fail (673)` — no size-ceiling test shifted; no update needed |
| 3 | `npm run gh-pages` | **GREEN (exit 0)** | `✓ built in 1.52s`; the 7 `?component` imports build through svgLoader; `favicon-lzj0QcBq.svg` (0.87 kB) emits; built `index.html` `rel=icon` serves HTTP 200 |
| 4a | `proof:scene-icons` (KF_REQUIRE_BROWSER=1) | **GREEN** | coverage 7/7 · shape (fill=none + currentColor + viewBox 0 0 32 32, zero baked) · no-raster (0 png) · favicon-resolve + favicon-served 200 · **G4 theming: stroke == host currentColor, light rgb(108,106,96) ≠ dark rgb(163,161,153)** |
| 4b | `proof:scene-parity` (KF_REQUIRE_BROWSER=1) | **GREEN** | no starting-style route/descriptor · survivors {spring,sequence,motion-path} · springLinearStops EXACTLY 1 call-site · **motionpath-drag 50.39%** · **square-drag (target ref + spring converged)** · **easing-curve-onstage (the three-name wiring fired)** |
| 4c | `proof:scene-perf-budget` (KF_REQUIRE_BROWSER=1) | **GREEN** | all 5 sub-gates + `test/amiga-sphere-spin.test.ts` 5/5 (see MEASURE-FIRST below) |
| 5 | `proof:ci-coverage` | **GREEN** | all 64 proof:* gates invoked in CI (4 recorded exclusions) — the 3 new gates accounted; concurrency + version-literal + registry hygiene clauses pass |
| 6a | `proof:scene-machine-irrefragable` (KF_REQUIRE_BROWSER=1) | **GREEN** | 6/6 ordered (A→B→A) matrix cells identity-preserving over [cube,easing,amiga]; **`#/cube?state=` rests on 'square' — no starting-style resurrection after the merge** |
| 6b | `proof:demo-console-clean` (KF_REQUIRE_BROWSER=1) | **GREEN** | no H-A1 serializeEasing throw resting on /#/amiga or /#/easing |
| 6c | `proof:cartoon-is-panel-depth` (KF_REQUIRE_BROWSER=1) | **GREEN** | ≥5 cartoon Cards rest at --shadow-cartoon-md, grow to -lg on hover |
| 6d | `proof:demo-shell-grid` (KF_REQUIRE_BROWSER=1) | **GREEN** | ONE named rail·stage·rail grid, ONE --rail-width token |
| 6e | `proof:phi-leaf-zero` | **GREEN** | zero raw rungs + hero on text-display-mega |
| + | `proof:easing-canvas-bounded` (collateral, KF_REQUIRE_BROWSER=1) | **GREEN** | the easing-curve stage promotion did NOT break the ≤280px canvas ceiling (160px ≤ 280px, ratio 0.391 ≤ 0.55) |
| + | `proof:dock-popover-opens` (collateral, KF_REQUIRE_BROWSER=1) | **GREEN** | the ChromeDock rewire off `sceneIcons` did NOT break the @mbabb popover |

---

## MEASURE-FIRST perf numbers (lifted from the live perf-budget run)

- **A3 tessellate tile-count:** **129 fillRect** during the amiga mount ≤ 256
  (was ~524,288 on the 1024×1024 pixel-grid loop). Checkerboard **PIXEL-IDENTICAL**
  to the committed baseline (the A3 fix is isomorphism-preserving).
- **A2 pixel-cap:** **effective device-pixel-ratio = 2.00 ≤ 2** (buffer 1606px ÷
  803px CSS @ devicePixelRatio=2; was 4 → ~3008px on the `dpr*2` over-render —
  a 4× fragment reduction).
- **G1 scene-host-contained:** the moving `.scene-host` resolves `contain: 'paint'`.
- **G5 offscreen-cv:** the amiga `.scene-root` resolves `content-visibility: auto`
  (`contain-intrinsic-size: auto none auto 600px`); NO resident `will-change`
  survives a settled frame (`.cube` + 6 faces all `auto`).
- **A5 engine-drives-mesh:** the deterministic anchor `test/amiga-sphere-spin.test.ts`
  is 5/5 GREEN (center-grab hits + suppresses orbit; miss falls through; drag mutates
  rotation; RELEASE seeds a decay() glide driving the mesh ≥10 frames, slowing
  MONOTONICALLY, then rests; a static tap arms no glide).

---

## RED-that-should-be-GREEN (diagnosed)

- **`amiga engine-drives-mesh (live)` printed `○ only 0 changed frame(s)`** in the
  `proof:scene-perf-budget` run — this is **NOT a failure**. The clause is a SOFT
  (`○`) informational marker, not a `✗`; the script exits 0 / PASSES. It documents
  the well-known **headless WebGL readback confound** (a headless GL surface does
  not reliably surface canvas pixel deltas frame-to-frame). The gate explicitly
  defers the A5 contract to the deterministic isolation proof
  `test/amiga-sphere-spin.test.ts` (5/5 GREEN above), which is the rigorous anchor.
  No diagnosis-action needed; behaving as authored.

- No other RED. No gate that should be GREEN came up RED.

---

## BITE proof (born-RED on revert, GREEN on the landed impl)

1. **`git stash push -- demo/amiga/utils.ts`** (reverts to the HEAD pixel-grid
   loop: `for y<boardSize for x<boardSize fillRect(x*64,…)`) →
   `proof:scene-perf-budget` **FAILs (exit 1)**:
   `✗ A3 source — tesselateSphere must iterate the 16×16 TILE grid, not the
   1024×1024 PIXEL grid (tilesLoop:false, pixelGridLoop:true)`. `git stash pop`
   restored the tile loop → A3 source clause GREEN again, gate PASS, amiga test 5/5.
   (Note: the runtime tile-count clause stayed green on the revert because it runs
   against the already-built dist; the STATIC A3 source-shape clause is the one that
   bites the un-rebuilt source revert — the parent gate correctly reds either way.)

2. **the scene-icon SVGs are UNTRACKED** (`??`), so `git stash` cannot capture them
   — bit equivalently by injecting a baked hue into `assets/icons/spring.svg`
   (`stroke="currentColor"` → `stroke="hsl(248,88%,71%)"`, the exact wart the wave
   names) → `proof:scene-icons` **FAILs (exit 1)**:
   `✗ shape — spring.svg: no stroke="currentColor" (the themable reference); baked
   color on a stroke/fill attr: hsl(248,88%,71%)`. Restored from an exact byte
   backup → shape clause GREEN again, gate PASS. (The contract's `git stash`
   verb assumes a tracked file; the content-bite of the same clause is the faithful
   equivalent for an untracked SVG and reds the identical assertion.)

---

## Structural confirmations (contract closing checks)

- **The 6 PNGs deleted:** `git status` shows `D` for
  `{cube,amiga,square}-icon-{sm,lg}.png`; live `assets/icons/*.png` count = **0**.
- **Favicon resolves (no 404):** `index.html` `rel=icon` →
  `../../assets/icons/favicon.svg` (exists); the BUILT dist `rel=icon` →
  `./assets/favicon-lzj0QcBq.svg` **serves HTTP 200** (the gate's live probe).
- **starting-style route/descriptor GONE:** `demo/app/router.ts` + `scenes.ts`
  contain ONLY explanatory COMMENTS mentioning the removed `/starting-style`
  (no live route path / `name:` / `id:` declaration); `StartingStyleScene.vue`
  is deleted.
- **springLinearStops 2→1 fold:** the ONLY actual call-site is
  `demo/spring/useSpringLinearStops.ts:29`; the other grep hits
  (`SpringSidebar.vue:84`, `StartingStyleTarget.vue:13`,
  `useSpringLinearStops.ts:8`) are template prose / doc comment, not calls — the
  gate's comment-blanked count reads EXACTLY 1.
- **currentColor survives SVGO into the build:** `grep currentColor
  dist/gh-pages/assets/*.js` HITS (the Foundation `convertColors:false` config
  held — G4 the authority over G1).
- **No source edits** were made by this VERIFY lane (the BITE stashes/backups were
  popped/restored to the exact prior state). The only working-tree `M` on
  `.github/workflows/ci.yml` + the gate scripts were authored by the prior lanes,
  not this one.

## Verdict

H.W5 §Hard gate is **VERIFIED GREEN**. tsc 0 · vitest 671/2-xfail · gh-pages
built · all 3 new gates (+ all sub-gates) GREEN under KF_REQUIRE_BROWSER=1 ·
ci-coverage accounts for the new gates · the 5 no-regression gates STILL GREEN ·
both BITEs born-RED on revert / GREEN on the landed impl · 6 PNGs killed · favicon
200 · starting-style gone. No RED-that-should-be-GREEN (the one `○` is the
documented headless-WebGL soft marker, deferred to the deterministic test).
