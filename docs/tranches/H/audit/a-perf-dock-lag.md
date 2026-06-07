# Tranche H Deep Audit — lane `a-perf-dock-lag`

**Charge:** D5 — root-cause the dock "broken / slow / laggy" + the demo's general
animation smoothness. Is it glass-ui's dock springs, the demo's rAF loops, the
glass/blur paint cost, layout thrash, or a G-session regression? MEASURE-FIRST.
Demo-side fixes vs glass-ui-HANDOFF.

**Method:** live instrumentation against the running demo (`http://localhost:5174/`,
kf 4.1.0 + Tranche G, `@mkbabb/glass-ui@3.4.0`) via Playwright + a self-contained
rAF/PerformanceObserver harness; source reads of the demo composables and the
**published** glass-ui dock CSS in `node_modules`. Headless Chrome 149 on Apple
Silicon — note this GPU absorbs compositor cost, so paint-bound defects show up in
the *structure* (raster area, layer count, promotion hints), not in dropped frames
on this box. That asymmetry is itself the finding: main thread is clean; the cost
is on the GPU/raster path, which is exactly where a weaker machine drops frames.

---

## TL;DR — the lag is PAINT, not SCRIPT

Every main-thread measurement is clean. The demo's rAF loops are already gated SOTA
(G-session). The perceived lag has **two distinct roots**, both about glass paint
cost and the dock's collapse-state model — neither is a JS-spring stall and neither
is a demo rAF regression:

1. **F1 (the dominant smoothness defect):** the controls panel stacks **3 large
   `backdrop-filter` glass cards (~1.05M px²) directly over the continuously-
   animating scene host** (cube/easing/amiga). Every animation frame re-samples and
   re-blurs all three regions. 13 backdrop-filter layers total, ~1.12M px². This is
   the "general animation smoothness" tax. **Demo-side composition fix** (the demo
   owns the layering); the blur primitive is glass-ui.
2. **F2 (the "dock broken / @mbabb no longer opens", D5+D9):** the dock starts
   **collapsed**; in the collapsed state the entire `dock-layer--full` (which holds
   the @mbabb `DockDropdownTrigger`, dark-mode, about) is
   `visibility:hidden; opacity:0; pointer-events:none` — *unreachable until a
   hover-expand completes.* The popover IS wired and DOES open once expanded
   (measured). The symptom "no longer opens / laggy" is the hover-expand gate +
   the `collapse-delay: 2500` + the overshoot spring duration sitting in front of
   every full-layer action. **glass-ui-HANDOFF** on the collapse contract;
   **demo-side** on whether critical actions should live behind the collapse veil.

---

## MEASUREMENTS (live, reproducible)

### M1 — Idle baseline (scene `/easing`, animation running)
`mean 8.34ms · p50 8.30 · p95 9.60 · max 10.2ms · 0 frames >20ms · 0 long tasks`,
270 rAF schedules / ~750ms, `liveRafIds: 2` at sample end. Idle is smooth; multiple
concurrent rAF loops exist but are cheap and gated.

### M2 — Dock hover-expand (collapsed top dock → expanded)
`mean 8.33ms · p95 9.9 · max 16.6ms · 0 dropped · 0 long tasks`, **0 inline style
writes** observed on `.dock-layers`/chassis during the transition. → The dock
size morph is **CSS-transition-driven** (`transition: width var(--dock-motion-resize)`,
glass-ui `dock.css:466`), NOT a per-frame JS spring writing inline width. So the
JS `SpringProgress`/FLIP driver is not stalling the main thread; the motion is a
compositor concern.

### M3 — Scene swap (`home → cube` via hash router)
`mean 8.3ms · p95 9.5 · max 10.3ms · 0 dropped · 0 long tasks`. The View-Transition /
SpringProgress cross-dissolve (`useSceneSwap.ts`) is clean on the main thread.

### M4 — Backdrop-filter census (the smoking gun)
`13 visible backdrop-filter elements · ~1,116,770 px² total backdrop area`. Largest:
- `glass-card … flex-1` **704×740 = 520,960 px²** `blur(10px) saturate(1.05) brightness(1.02)`
- `rounded-card …` **724×343 = 248,332 px²**
- `rounded-card …` **1298×168 = 217,996 px²**
- two `glass-dock` chassis **`blur(11px)`** (top + bottom menubar dock, both live)
- plus ~8 `glass-wash`/`input-pill` `blur(1px)` fields.

### M5 — Overlap with the animating scene (the cost multiplier)
`scene-host 1354×792`, `sceneHasAnimatedTransform: true`. **3 large `glass-card`
backdrop surfaces (724×608, 704×740, 1298×66) all overlap the scene host.** A
moving transform behind a `backdrop-filter` invalidates that region's backdrop
every frame → continuous re-blur of ~1M px² while any scene animates. This is the
mechanism behind "general animation smoothness."

### M6 — Dock motion DNA (perceived-speed audit)
- `--dock-motion-resize` = `0.3s` × `--spring-dock` (overshoot `linear()`, peaks
  **1.16292 at 14.286%** — a pronounced bounce).
- chassis transitions **5 properties at once**: `padding, box-shadow, transform,
  background, border-color` (glass-ui `dock.css:262-268`).
- `backdrop-filter: var(--dock-surface-blur)` → `blur(11px)` on the chassis
  (`dock.css:90`).
- `will-change: auto` and `contain: none` on BOTH `.glass-dock` and `.dock-layers`
  — **no GPU promotion, no paint containment** on the animating surfaces.

### M7 — @mbabb popover state machine (D9 root cause)
Collapsed: trigger `pointer-events:none`, ancestor `dock-layer--full`
`visibility:hidden, opacity:0, pointer-events:none`. After programmatic hover-expand
(~450ms): trigger `pointer-events:auto`, `visibility:visible`, click → `data-state:
open`, `[role=menu]` present. **The popover works; it is gated behind the collapse.**

### Negative result — demo rAF loops are NOT the regression
`useAnimationProgress` runs through `useRafLoop({ guard: isPlaying })`;
`useAnimationSync` runs `useRafFn` with a 30-frame settle-window idle + visibility
gate (`controls/composables/useAnimationSync.ts:25-89`). These are exemplary —
they idle when static and resume on inputs they don't own. **ALREADY-SOTA.** Not
the lag.

---

## FINDINGS

### F1 — `backdrop-filter` glass stack continuously re-blurs over the animating scene  ·  DISPOSITION: SHIP-in-H (demo composition) + MEASURE-FIRST
**Anchor:** M4/M5 live — 3 large `glass-card` backdrop surfaces (~1.05M px²) overlap
`scene-host` (`demo/app/App.vue:119-137`), which holds a continuously-animated
transform; 13 backdrop layers / ~1.12M px² total.
**Why it's the gestalt root of D5 "smoothness":** a `backdrop-filter` region is
re-rastered whenever content behind it changes. With the cube/easing/amiga animation
permanently running *behind* the controls panel, the GPU re-blurs ~1M px² every
frame for the panel's whole lifetime. Apple-Silicon headless hides it; a laptop iGPU
/ Windows / older Mac drops frames — exactly the user's report.
**Gestalt fix (idiomatic, not a workaround):** the controls panel should not sit as a
huge translucent sheet *over* the live scene. Either (a) the controls panel occupies
its own column so it is NOT over the moving scene (the panel's backdrop then samples
a static background → no per-frame re-blur), or (b) where overlap is intentional,
promote the panel to its own composited layer and **clip the backdrop's invalidation
region** with `contain: paint` so a moving scene outside the panel's box does not
dirty it. This is a layering/architecture decision the demo owns; the blur primitive
stays glass-ui's.
**Falsifiable instrument — `proof:demo-backdrop-budget`:** a Playwright gate that
sums visible `backdrop-filter` area overlapping `scene-host` while an animation
plays and fails if it exceeds a budget (e.g. > 200k px² of *moving-background*
backdrop). Lock the census from M4/M5 as the baseline.

### F2 — Dock collapse veil hides ALL `dock-layer--full` actions (@mbabb popover, dark-mode, about)  ·  DISPOSITION: glass-ui-HANDOFF (contract) + SHIP-in-H (demo: don't bury critical actions)
**Anchor:** M7 live + glass-ui `dock.css:540-545` (`.dock-layer:not(.layer-active){
opacity:0; visibility:hidden; pointer-events:none }`); ChromeDock
`:start-collapsed="true"` `:collapse-delay="2500"` (`demo/@/components/custom/dock/ChromeDock.vue:116`).
**Symptom mapping:** D9 "@mbabb no longer opens" = it's behind the collapse veil; D5
"broken/laggy" = the hover-expand gate (0.3s overshoot spring) + 2500ms auto-collapse
sit in front of every action, so first clicks miss and re-expands feel sluggish.
**Gestalt fix:**
- *glass-ui-HANDOFF:* the dock's collapsed↔expanded model is correct architecture
  (FLIP + SpringProgress + VT, one-owner-per-concern, `dock.css:446-484`), but the
  expand should feel instant on intent. Recommend glass-ui (a) drop the overshoot for
  the *expand* arm (overshoot is the part read as "wobble/lag"; keep it only on
  collapse if at all), (b) expose a faster `collapse-delay` default or honor a
  pointer-intent (expand on `pointerdown` not just hover dwell). TAG: glass-ui AW
  dock tranche.
- *demo-side (SHIP):* critical, frequently-needed actions (@mbabb menu / dark-mode /
  about / scene + controls selectors) should NOT all live inside the collapsing
  `full` layer. Decide which belong in the always-visible summary vs the expand. This
  is a demo composition call in `ChromeDock.vue` / `App.vue`, not a glass-ui patch.
**Falsifiable instrument — `proof:dock-actions-reachable`:** a test that, from the
dock's DEFAULT (collapsed) state, asserts the @mbabb trigger is hit-testable within
one intent gesture and the popover reaches `data-state="open"`; lock M7's
expanded-state success and the collapsed-state `pointer-events:none` as the
documented contract boundary.

### F3 — Dock chassis animates 5 properties + `blur(11px)` with no GPU promotion / paint containment  ·  DISPOSITION: glass-ui-HANDOFF
**Anchor:** M6 — `dock.css:262-268` transitions `padding,box-shadow,transform,
background,border-color`; `dock.css:90` `backdrop-filter: blur(11px)`; computed
`will-change:auto`, `contain:none` on `.glass-dock` and `.dock-layers`.
**Why:** a `backdrop-filter` chassis animating `padding`/`transform` forces the
backdrop to re-sample each frame with no layer promotion to amortize it. `box-shadow`
+ `background` + `border-color` transitions are extra per-frame paint. On a strong
GPU it's invisible (M2 was clean); on a weak one this is the dock's own lag.
**Gestalt fix (glass-ui):** during the resize transition only, promote the chassis
(`will-change: transform` scoped to the animating window) and add `contain: paint`
so the backdrop invalidation is clipped to the dock box; consider animating fewer
properties (the `padding` morph could be a `transform: scale`/`translate` FLIP that
the compositor handles without re-layout). TAG: glass-ui AW dock tranche.
**Falsifiable instrument — `proof:dock-promotion`:** assert the chassis carries a
compositing hint (`will-change`/`contain:paint`) during the resize transition; this
is a glass-ui-side gate, recorded here as the handoff spec.

### F4 — Two live `glass-dock` chassis (top ChromeDock + bottom AnimationMenuBar dock) each carry `blur(11px)`  ·  DISPOSITION: RECORD (demo) + MEASURE-FIRST
**Anchor:** M4 — two `glass-dock … blur(11px)` regions visible simultaneously
(`demo/app/App.vue` ChromeDock at top; the `menubar-safe-pb` dock at bottom). Both
are fixed and overlap whatever scrolls/animates beneath.
**Why noted:** two compounding backdrop bands top and bottom add to the F1 budget.
Lower individual cost than F1's large cards, but two more always-on blur layers.
**Disposition:** RECORD — fold into the F1 backdrop budget instrument; only act if
M-first profiling on a weak GPU shows these bands are material after F1 is fixed.

### NON-FINDING (ALREADY-SOTA) — demo rAF orchestration
`useRafLoop({ guard })` + `useRafFn` settle-window idling
(`controls/composables/useAnimationSync.ts:9-89`,
`composables/useAnimationProgress.ts`). Gated, idle-aware, no busy-spin. The
G-session hardened this correctly. No action. Honest credit per inv ε.

---

## DEMO-SIDE vs glass-ui-HANDOFF (the charge's split)

| Concern | Owner | Disposition |
|---|---|---|
| Glass stack re-blurs over moving scene (general smoothness) | **demo composition** (layering of panel over `scene-host`) | SHIP-in-H + MEASURE-FIRST (F1) |
| Critical actions buried in collapse `full` layer | **demo composition** (`ChromeDock.vue`/`App.vue`) | SHIP-in-H (F2 demo arm) |
| Collapse veil `pointer-events:none` / overshoot expand / 2500ms collapse | **glass-ui** dock collapse contract & spring | glass-ui-HANDOFF (F2 + F3) |
| Chassis: 5-prop transition + blur, no promotion/containment | **glass-ui** dock chassis CSS | glass-ui-HANDOFF (F3) |
| Two stacked blur bands | demo (compose) | RECORD (F4) |
| rAF loops | demo | ALREADY-SOTA, none |

**Bottom line for D5:** the dock JS springs are NOT stalling (M2: 0 inline writes,
clean main thread). The demo rAF loops are NOT regressed (gated SOTA). The lag is
GPU/raster: (1) the demo stacking ~1M px² of `backdrop-filter` over a perpetually
animating scene (F1, demo-fixable now), and (2) the dock's collapse-state model +
overshoot-spring expand gating every full-layer action and re-blurring on a
non-promoted chassis (F2/F3, glass-ui-HANDOFF for the contract, demo-fixable for
*what* lives behind the veil). MEASURE-FIRST on a representative weak GPU before
declaring any single fix sufficient; lock the F1 backdrop-budget and F2
actions-reachable instruments so H can gate the result.
