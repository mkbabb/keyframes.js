# Tranche N — prototype round-2 refinement (the owner's 8-point critique)

**Date:** 2026-06-17. The first prototype was rejected ("completely awful"). This round rebuilt
it to a much higher bar via a **3-candidate judge panel** (the owner's "batches of three"),
core-model-judged from live screenshots, with the winner promoted to
`prototype/switcher-prototype.html`.

## The 8 critiques → how the rebuild answers each

| # | Critique | Fix in the promoted prototype (candidate A — "Volumetric Theatre") |
|---|---|---|
| 1 | Not 3D | `perspective: 1000px` + a turntable `rotateX(22deg)` + per-card `translate3d` Z-depth on an elliptical platter — a true physical carousel (see `screenshots/05-mid-spin.png`). |
| 2 | Should be LIVE previews | 7 genuinely-animating faithful mini-scenes (real CSS-3D cube, checker Boing ball with squash, drifting Square, SVG bezier + sweeping ball, spring needle ring, stagger cascade, offset-path traveller). |
| 3 | Angle 15–30° at the user | the platter is tilted **22°** toward the viewer (within range), the laid-flat platter ellipse + grooves sell it. |
| 4 | Darks far too dark | flank floor lifted to opacity 0.5 / brightness 0.78; the vignette is a soft warm shade, never near-black — flanks + their previews clearly read. |
| 5 | Background = grid-paper, not black | the **real demo grid-paper** (verbatim `--graph-*` CSS) is the substrate, lit under the beam + softly dimmed at the edges — visible in dark AND light. |
| 6 | Smooth single-view → stage entry | a live single-scene landing recedes/dims/blurs while the beam + stage + ring bloom in (View Transitions + CSS fallback; `screenshots/02-entry-mid.png`). |
| 7 | Lighting not active/dynamic | a genuinely volumetric god-ray (stacked clip-path cones + drifting dust motes + floor-pool bloom) that **breathes** (sine on intensity) and whose pool **slides toward the hovered flank**. |
| 8 | Carousel janky + blurry | a single rAF loop integrating a **critically-damped spring** (shortest signed delta, clamped dt, interruptible); blur capped ~1px on the far rear only — depth via scale/opacity/brightness. |

Round-2 also fixed the cross-theme card flaw the first build had: cards are now **theme-adaptive
liquid glass** (smoked in dark, frosted on the cream paper in light) with a specular catch-light +
a thin glass rim — never the black slabs that clashed on the light grid-paper.

## The judge panel (3 candidates, core-model-judged)

- **A — Volumetric Theatre** ✅ **PROMOTED.** Best volumetric cone + best 3D depth (the platter) +
  warm theatrical premium feel + glass cards that hold in both themes. Strongest on all 8.
- **B — Engineering Blueprint.** Good glass cards + machinist ticks + the least-garish previews,
  but a cooler, less dramatic cone and shallower depth than A.
- **C — Liquid-Glass Gallery.** The most premium glass slabs, but read flat (weak 3D) with a soft
  cone and a garish front preview.

## Live verification of the promoted prototype

Served over a local HTTP server (Playwright, deviceScaleFactor 2):
- Runs clean — **0 console errors / 0 page errors**.
- The carousel spins correctly via `#next`/`#prev` + keyboard: **Cube 1/7 → Amiga 2/7 → Square
  3/7 → Easing 4/7 → (prev) Square 3/7** — the nameplate + index update, smooth, no jank.
- 7 states captured (`screenshots/01..07`): landing, entry-morph, stage-default, hover-flank
  (light slides toward the flank), mid-spin (crisp, deep), light-mode (frosted glass on cream),
  PRM (snapped, light frozen).

## Residual polish (impl-phase, minor)

- The volumetric cone is inherently fainter in **light mode** than dark (screen-blend over bright
  paper) — present + clearly a shaft, but less dramatic; tune at impl.
- The front cube preview is the most saturated element — but the cube's crayon facets are the
  scene's genuine identity (the crayon-preservation discipline KEEPS those hues), so this is
  on-brand, not garish.
