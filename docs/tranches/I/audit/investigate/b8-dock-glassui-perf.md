# B8 — Dock animations "supremely broken, slow, errored" · glass-ui slow

INVESTIGATION AGENT [b8-dock-glassui-perf]. Live Playwright over the BUILT
`dist/gh-pages` (Chromium + WebKit), harness modelled on
`scripts/proof-no-orphan-specular.mjs` (serveDist :0 + `KF_PLAYWRIGHT_DIR=
/Users/mkbabb/Programming/value.js` → `playwright-core` + `${base}/#/${scene}`).

## TL;DR (the verdict that matters for root-cause + authoring)

**The dock spring is NOT broken in any way I can reproduce in a clean harness.**
Across Chromium (VT path), Chromium-with-View-Transitions-neutered (forced
`SpringProgress` FLIP path), AND WebKit, the dock morph runs **smoothly** —
~60fps under WebKit, ~95–120fps under Chromium, **zero severe jank**, **zero
dock-originated `pageerror`s**, and the `--spring-dock` token is correctly tuned
(+4.5% overshoot, well under the +6% ceiling). The `proof:dock-morph-settled`,
`proof:dock-zorder`, `proof:dock-popover-opens` gates are GREEN — and the
harness CONFIRMS they are not lying about smoothness.

The ONLY "errored" signal that fires while exercising the dock is **the B1
"......" parse crash bleeding into the shared page console** — it is NOT a dock
fault; it is the global B1 crash polluting every surface's console on cube load.

This is itself the headline gate-blindspot evidence: a green-and-genuinely-smooth
dock in the harness, reported by the user as "supremely broken." The breakage the
user feels is **environmental / perceptual / cross-the-page**, not a dock-spring
source defect — see "Root-cause hypothesis" for the four candidate mechanisms a
headless harness on a fast machine structurally cannot reproduce.

## Reproduction steps

All probes under `docs/tranches/I/audit/investigate/probes/`; run with
`KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js node <probe>.mjs`. JSON
dumps + screenshots written to `../` and `../shots/`.

1. `b8-dock-glassui-perf.mjs` — Chromium, cube scene. Exercise: hover+click to
   expand the dock, sample frames across the morph, open the scene popover,
   profile the backdrop-filter element cost, capture longtasks.
2. `b8-dock-stress.mjs` — 6× rapid collapse↔expand cycles, VT path vs
   FORCED-SpringProgress path (deletes `document.startViewTransition`).
3. `b8-dock-morph-real.mjs` — click the collapsed pill + toggle the Controls
   panel + cycle the controls-tab selector; capture per-frame inline `width`
   writes on `.dock-layers` (the SpringProgress `b(r,`${e}px`)` writes).
4. `b8-webkit.mjs` — the SAME exercise under **WebKit** (the user's macOS/Safari
   engine) + a backdrop-filter compositor-cost stress (spin the cube behind 30
   live glass surfaces).
5. `b8-spring-engine.mjs` — VT neutered + a real width delta (collapse→expand +
   scene switch cube→sequence) to force the engine FLIP to write frames.

## Captured behavior vs intended

### Dock-spring smoothness — MEASURED SMOOTH everywhere

| Path / engine | morph dur | mean | max | p95 | dropped >33ms | >50ms | fps |
|---|---|---|---|---|---|---|---|
| Chromium VT (expand) | ~367ms | 10.46 | 50.1 | 25.3 | 4 | 1 | 95.6 |
| Chromium VT (6× stress) | — | 8.83 | 42.6 | 9.2 | 1 | 0 | 113.2 |
| Chromium forced-Spring (6× stress) | — | 8.32 | 16.9 | 9.1 | 0 | 0 | 120.2 |
| WebKit (dock morph) | 358ms | 16.41 | 21.0 | 18.0 | 0 | 0 | 60.9 |
| WebKit (glass backdrop spin) | — | 16.51 | 26.0 | 18.0 | 0 | 0 | 60.6 |

The 4 dropped frames in the FIRST Chromium expand are **startup churn** (two
longtasks at t=20ms 111ms + t=224ms 61ms — route mount + Monaco/glass init), not
the spring. Once warm, every path is clean. The intended behavior (a tight ~360ms
settle, no lag) is exactly what the harness shows.

### The SpringProgress engine FLIP barely runs — the morph is effectively a no-op

THE key structural finding. The dock is `fit-content` + `start-collapsed`. The
`useLayerTransition` driver (glass-ui `dock.js:150`+) bails the spring when the
measured width delta is sub-pixel: `if (b(r,`${h}px`), r.offsetWidth, !o &&
Math.abs(t - h) < .5){ … l.value=null; return; }` (`dock.js:225`).

- `b8-spring-engine.mjs` (VT neutered, real collapse→expand + scene switch):
  `springEngineEngaged: false`, `widthWriteCount: 0`, and `data-morphing`
  toggled **on→off at the SAME timestamp** (`t=4065` on, `t=4065` off).
- `b8-dock-morph-real.mjs`: `widthWriteCount: 0` in BOTH paths; spring
  `morphDurationMs: 0`.

So on the engine path the spring writes **zero** width frames — the morph is a
clip-aperture reveal that settles instantly. This means: **the keyframes.js
`SpringProgress` engine is NOT a live jank source for this dock in this layout**
— it is structurally short-circuited. Whatever the user feels, it is not the
engine spring chugging.

### glass-ui backdrop-filter cost

`backdropFilterCount: 30` live backdrop-filter surfaces on the cube route (the
dock `blur(11px)`, the two stage Cards `blur(10px) saturate brightness`, ~25
`input-pill` `blur(1px) saturate(1.05)` fields). The synchronous reflow loop over
all 30 measured `reflowLoopMs: 4.5` in Chromium (cheap there). Under WebKit the
backdrop-spin stress held a steady 60fps (no drop) — but WebKit's real-device
backdrop-filter recomposite cost is materially higher than headless Playwright
WebKit on this machine reports; 30 simultaneous blurred surfaces IS a legitimate
"glass-ui feels slow" candidate on a loaded/older Mac (see hypothesis H3).

### Console while exercising the dock (verbatim)

Captured on EVERY probe, EVERY engine, on cube load — NOT triggered by any dock
action:

```
[error]  Err x     0
 1 |
     ^^^
[warning] [KeyframesString] could not serialize the animation to CSS: Parse error at offset 0: "......"
```

Source: `demo/@/components/custom/animation-controls/keyframes/KeyframesStringControls.vue:96`
(`CSSKeyframesToString(...)`) → catch at `:106`. This is **B1** — it fires
automatically on cube mount (the keyframes editor surface serializes the active
animation), independent of the rainbow group-play button. It pollutes the dock's
shared console; the user reads "the dock is errored" because the console is full
of errors WHILE the dock is on screen. Owned by the B1 agent — recorded here as
the source of B8's "errored" half.

Also captured (Chromium only, x35+, verbose): `Rendering was performed in a
subtree hidden by content-visibility.` Source:
`demo/@/components/custom/animation-controls/controls/AnimationControls.vue:333`
(`B-2: cache the inactive force-mounted Monaco pane { content-visibility: hidden }`).
A demo-side render-cost note (the force-mounted Monaco keyframes pane is being
laid out while content-visibility-hidden), not a dock fault — but it is a real
"wasted work behind the glass" signal for the perf lane.

No `pageerror`s from the dock on any run. No dock-spring throw. No `this._gen`
(that is B2, the FSM, a different surface).

## Source trace (file:line)

- Dock SFC: `demo/@/components/custom/dock/ChromeDock.vue` — `<GlassDock
  :collapse-delay="2500" :start-collapsed="true" :fit-content="true">` (`:147`).
- Spring driver: `node_modules/@mkbabb/glass-ui/dist/dock.js:150`
  `useLayerTransition` — `import { SpringProgress as te } from
  "@mkbabb/keyframes.js"` (`:11`); VT branch `a = "startViewTransition" in
  document` (`:156`); engine branch constructs `new te({ response: .32,
  dampingFraction: .7, … })` (`:228`); the sub-0.5px no-op bail (`:225`).
- Spring token: `node_modules/@mkbabb/glass-ui/dist/styles/tokens.css:163`
  `--spring-dock: linear(0, … peak 1.04501 @18.367% …)` → +4.5% overshoot.
  `--dock-resize-spring: var(--spring-dock)` (`:1303`).
- Dock transition wiring: `node_modules/@mkbabb/glass-ui/src/styles/dock.css:304`
  (`:not(.vertical)` transitions padding/box-shadow/transform/background/border on
  `--dock-motion-resize`; width is FLIP-driven, deliberately NOT transitioned).
- B1 leak: `KeyframesStringControls.vue:96/106` (the "......" serialize crash).
- content-visibility spam: `AnimationControls.vue:333`.

## Root-cause hypothesis

The dock-spring source is sound and the runtime is smooth in the harness, so B8's
"supremely broken, slow, errored" is a COMPOSITE of these (ranked by confidence):

- **H1 (high) — the "errored" half is B1 bleed-through, NOT a dock fault.** The
  B1 "......" parse crash fires on cube mount and floods the shared console while
  the dock is on screen. "the dock is errored" ≡ "the console is full of errors
  and the dock is visible." Fix = B1; the dock needs nothing here.

- **H2 (high) — gate-blindspot: every dock gate is green AND the dock IS smooth
  in the harness, yet the user calls it broken.** This is the tranche's headline:
  the gates (`dock-morph-settled` token-peak, `dock-zorder`, `dock-popover-opens`)
  + my own runtime probes all pass, because the dock morph is structurally a
  near-no-op (sub-0.5px width delta → spring short-circuits, H4). A token-shape
  gate + a fast-machine headless probe cannot witness the felt-jank the user
  reports on real hardware. The new gate-regime must drive the dock on a
  throttled CPU and assert a frame-budget under load, not just a token peak.

- **H3 (medium) — glass-ui backdrop-filter compositor cost on real WebKit.** 30
  simultaneous live `backdrop-filter` surfaces (dock + 2 stage Cards + ~25
  input-pills). Headless Playwright WebKit on this Mac holds 60fps, but Safari on
  a loaded/older machine pays a much steeper backdrop recomposite per frame —
  every dock hover-scale + cube spin forces all 30 to re-blur. This is the most
  likely "glass-ui elements are slow" mechanism and warrants a real-device or
  CPU-throttled probe + a backdrop-surface-count budget. The
  `content-visibility`-hidden Monaco pane being laid out (AnimationControls:333)
  compounds it (wasted layout behind the glass).

- **H4 (medium) — the dock morph is a near-no-op, so its motion reads as
  "broken/dead" rather than "springy."** Because the `fit-content` layer-width
  delta is sub-0.5px, `useLayerTransition` bails the spring and the dock just
  clip-reveals instantly. The user may perceive "the dock does not animate
  smoothly" because it barely animates at all — the springy morph the design
  intends never engages. If the intended feel is a visible spring, the layout
  needs a real width delta to drive (an architectural question for the dock
  composition, NOT a token retune).

- **H5 (low) — "ALL dock animations" may include the BOTTOM Rotations dock + the
  popover open/close**, not just the top nav dock. Both render and open cleanly
  in my probes (`sceneOpened: true`, popover frame stats clean), but the user's
  superset phrasing suggests auditing every `GlassDock` instance on a throttled
  CPU, not only the top one.

## Screenshots

- `docs/tranches/I/audit/investigate/shots/b8-dock-cube-expanded.png` — Chromium,
  dock expanded, rendering correctly.
- `docs/tranches/I/audit/investigate/shots/b8-dock-stress-vt.png` /
  `…-spring.png` — post-stress, dock intact.
- `docs/tranches/I/audit/investigate/shots/b8-webkit-dock.png` — WebKit, dock +
  bottom Rotations dock both clean.
- `docs/tranches/I/audit/investigate/shots/b8-spring-engine.png` — VT-neutered.

## Dispositions for the authoring phase

1. **B8 "errored" → fold into B1.** The dock console errors are B1 bleed; no dock
   source change closes them. Cross-reference the B1 surface doc.
2. **B8 "slow / supremely broken" → a NEW runtime-perf gate on a THROTTLED CPU.**
   The headline gate-regime overhaul must add a CDP-throttled (4–6× slowdown)
   dock-morph + glass-backdrop frame-budget gate that CLICKS the dock and asserts
   dropped-frames-under-load, because the token-peak gate + fast-machine probe
   structurally miss the felt jank (H2).
3. **Backdrop-surface budget (H3).** Add a gate counting live `backdrop-filter`
   surfaces per route (30 on cube is the candidate ceiling) + audit the
   `content-visibility`-hidden Monaco pane's wasted layout.
4. **Dock morph engagement (H4) — design question.** Decide whether the dock is
   meant to visibly spring; if so the `fit-content` layout must yield a real
   width delta so `SpringProgress` actually drives (currently it short-circuits).
   This is an engine-adjacent architectural call (inv-16: engine NOT fenced).
5. **glass-ui version (B7-adjacent).** Pinned `~3.5.1`; the `--spring-dock` token
   is the retuned one. No version bump is indicated FOR the dock spring — it is
   correct. (The specular/sheen version question is B7's, not B8's.)
