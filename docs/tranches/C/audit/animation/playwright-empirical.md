# Tranche C — EMPIRICAL animation audit (local Playwright)

**Lane:** empirical animation measurement via local playwright-core (`/tmp/kf-audit`, chromium-1223).
**Date:** 2026-06-04 · **Author:** C (empirical lane)
**Build under test:** `dist/gh-pages` from `npm run gh-pages` (built clean, `✓ built in 1.32s`).
**Harnesses (checked into the repo, re-runnable):**
- `scripts/audit-empirical.mjs` — dock / scene-nav / spring / cube / reduced-motion sweep
- `scripts/audit-empirical-2.mjs` — focused dock-from-collapsed + spring-ball trajectory
- `scripts/audit-prm.mjs` + `scripts/audit-prm-diag.mjs` — idle-bob under reduced-motion
- `scripts/audit-spring-prm.mjs` — JS `SpringProgress` under reduced-motion
- `scripts/audit-slides.mjs` — slides-system slide transition (serves `/Users/mkbabb/Programming/slides/dist`)

All raw numbers + PNG frames live in `./captures/` (`measurements-consolidated.json` is the merged record; 19 PNG frames). Every claim below is a **measured value off the running build**, not a code read.

---

## TL;DR — the measured verdict

| # | Surface | Engine actually driving it | iOS-grade? | Measured |
|---|---------|---------------------------|:----------:|----------|
| 1 | **Dock expand** | CSS `transition` + spring-snappy `linear()` + grid/FLIP | **partial** | padding springs (8.13px peak → 8.00px settle, real overshoot); **width HARD-JUMPS 102→192px in ~19ms** |
| 2 | **Scene navigation** | nothing — keyed `<Suspense>`, no `<Transition>` | **HARD CUT** | scene-host opacity pinned `1.0` across the whole swap; swap ~185ms; `.scene-*` CSS confirmed **dead** |
| 3a | **Spring scene** (`SpringProgress`) | **keyframes.js engine (JS rAF)** ✅ | **YES** | ball tweens 621→560px, overshoot **0.31px = 0.5%**, settle ~327ms — matches analytic solver to 1e-3 |
| 3b | **Cube idle-bob** | CSS `@keyframes`, NOT the engine | n/a (linear-ish) | translateY 0→5px, `cubic-bezier(0.4,0,0.2,1)`, 3s, median frame 8.3ms (60fps, no jank) |
| 4 | **prefers-reduced-motion** | **demo gates NOTHING itself** | **FAIL** | demo CSS has **0** PRM rules; survives only via glass-ui's vendored `*` reset; **JS spring still tweens 20 positions under `reduce`** |
| 5 | **Slides** (consumer) | CSS transition (`opacity 0.5s` + `transform 0.6s` ease-out) | **YES** | clean cross-dissolve + slide, measured **~473ms**, PRM-gated — *better motion than the keyframes.js demo's own scenes* |

**The headline irony, measured:** the repo that *ships* the iOS spring engine **dogfoods it in exactly one scene** (the Spring rail). Its scene router **hard-cuts** (no transition at all), its hero motion (cube idle-bob) is a **plain CSS keyframe**, and its **flagship JS spring ignores `prefers-reduced-motion`** because the demo never passes `respectReducedMotion: true`. Meanwhile the downstream *consumer* (`slides`) does a textbook cross-dissolve and gates reduced-motion correctly.

---

## 1 — Dock expand / collapse (KEY PRINCIPLE: morphing, timing, follow-through)

**Capture:** `scripts/audit-empirical-2.mjs` → `captures/measurements-2.json` (`dock`), frames `dock2-expand-{000..400}ms.png`.

The dock's CSS transition list (read off the live `.glass-dock`):

```
transition-property:  padding, box-shadow, transform, background, border-color
transition-duration:  0.3s ×5
transition-timing:    linear(0, 0.10438 2.041%, 0.32622 4.082%, … 1.06804 16.327% … 1)   ← spring-snappy
```

This `linear()` IS a real spring approximation — it **peaks at 1.068 (16.3%)** then rings down to 1.0. Empirically the **padding** confirms it overshoots:

```
t=2.8ms   padL=6.00px   (collapsed)
t=75.2ms  padL=7.92px
t=93.9ms  padL=8.13px   ← OVERSHOOT peak (settle is 8.00)
t=125ms   padL=8.00px   ← settled
```

So the dock's *padding/box-shadow/transform* layer is genuinely springy (good — anticipation + follow-through present).

**BUT `width` is the load-bearing dimension of an expand, and `width` is NOT in the transition list.** It is driven by CSS-grid track sizing + the FLIP/view-transition path (see `GlassDock.vue` `dockId` + `view-transition-name`, lines ~197-211). Measured from a true collapsed baseline:

```
t=2.8ms   w=102.41px  (collapsed)
t=19.4ms  w=102.41px  ← still collapsed
t=38.2ms  w=191.72px  ← +89px in ONE ~19ms step  (HARD JUMP)
t=75.2ms  w=195.53px
t=93.9ms  w=195.97px  (settles)
```

`deltaWidth = 93.31px`, `measuredTransitionMs = 73.7ms` total — but **~95% of the width delta lands in a single sub-20ms frame**. The width *snaps*; the *chrome* (padding/shadow) springs around it. To a user this reads as the dock "popping" wide and the padding catching up — a split personality, not one cohesive morph. The `linear()` spring is applied to the *wrong properties*.

> **Finding D1 (timing/morph):** the dock expand is a **discontinuous morph** — width hard-jumps (~19ms) while padding/shadow spring (0.3s, 1.068 peak). The spring-snappy `linear()` should drive the *size* delta, not just the chrome. Frames `dock2-expand-000ms.png` vs `…-050ms.png` show the dock already near-full-width 50ms in, confirming the snap.
> **Route → glass-ui** (`GlassDock.vue`): make the collapsed↔expanded *box* the spring carrier (the view-transition group exists; it should own the width interp end-to-end), so width and chrome share one curve.

**A secondary observed artefact** (frames `dock2-expand-000/050ms.png`): a doubled **"Cube / Cube"** label during the crossfade — the collapsed summary label and the expanded layer label are both painted mid-transition (FLIP crossfade overlap). Cosmetic, but it betrays the FLIP seam.

---

## 2 — Scene navigation: HARD CUT (KEY PRINCIPLE: continuity, staging — absent)

**Capture:** `scripts/audit-empirical.mjs` → `captures/measurements.json` (`sceneNav`), frame `scene-after-nav-spring.png`.

B.W3 removed the `<Transition>` around the keyed `<Suspense>` (App.vue:103-129 documents why — a `Transition`/`KeepAlive` over a `defineAsyncComponent`-in-`Suspense` broke the async loader → blank viewports). **The removal is correct; the leftover is the bug.** Measured switching **cube → spring**:

```
scene-host opacity across the swap:  t=4ms→229ms  ALL = "1"   (no ramp, ever)
swapDetectedMs: 185
opacityRampObserved: false
→ "scene host opacity pinned ~1 across swap → HARD CUT (no enter animation)"
```

The scene content is **replaced instantly** — zero opacity/scale ramp. There is no staging, no shared-element morph, no enter choreography between scenes.

**Dead CSS confirmed empirically + statically:**
- `App.vue:407-424` defines `.scene-enter-active / .scene-leave-active / .scene-enter-from / .scene-leave-to` (with `--ease-decelerate` / `--ease-spring` / scale 0.97↔1.02).
- The rule **exists in the shipped CSS** (`sceneCssLive.ruleExistsInCSS: true`) but **no element ever carries it**: `grep -c 'name="scene"'` in `App.vue` = **0**; there is no `<Transition name="scene">` anywhere in `demo/`. The classes are orphaned — Vue only emits `*-enter-active` etc. for a `<Transition name="scene">`, which was deleted with B.W3.

> **Finding S1 (continuity):** scene navigation is a **hard cut**, and the `.scene-*` block (App.vue:407-424) is **provably dead** — a ~18-line CSS tombstone. Either (a) delete it, or (b) revive a *correct* enter-only transition that doesn't fight the async loader (e.g. transition the inner resolved content on `ready`, not the `<Suspense>` boundary; or adopt the cross-document/`startViewTransition` route the dock already uses). The intended motion was a spring scale-in (0.97→1) — that is exactly the `SpringProgress`/`springTimingFunction` the package ships and the scene router does not use.

---

## 3a — Spring scene: the ONE place the engine is dogfooded ✅ (KEY PRINCIPLE: physical motion)

**Capture:** `scripts/audit-empirical-2.mjs` → `measurements-2.json` (`spring`); `audit-spring-prm.mjs`; frames `spring-scene-idle.png`, `spring-scene-after-tap.png`.

`demo/spring/useSpringDemo.ts` genuinely constructs `new SpringProgress({ response, dampingFraction })` (lines 60, 73, 184) and `springTimingFunction({ response, dampingFraction })` (line 102) — the real engine. The scene shows live `response=0.50s / dampingFraction=0.86` sliders, 4 canonical presets (Smooth/Snappy/Bouncy/Gentle), the `springLinearStops() → CSS` `linear()` output, and a `springTimingFunction` sweep (`spring-scene-idle.png`).

**Measured ball trajectory** after re-seating the live target to the right rail (real `PointerEvent` dispatch on `.spring-rail`):

```
t=12.8ms  ballX=621.38       (start, far right)
t=99ms    ballX=591.69
t=221ms   ballX=569.16
t=327ms   ballX=560.48       (≈ settled, target center)
t=413ms+  ballX=560.00–560.19 (rest, flat)
spanPx=61.19   overshootPx=0.31   overshootRatio=0.005   settleTimeMs≈327
```

The ball moves with a clean monotone-ish settle and **0.31px overshoot**. Is that *correct* for `response=0.5, dampingFraction=0.86`? I ran the **analytic SwiftUI solver** (replicating `spring.ts::evaluateAt`) to ground-truth it:

```
response=0.5 damping=0.86 → peak=1.00502  overshoot=0.50%  settle~408ms   (the iOS "smooth" preset)
response=0.5 damping=1.0  → peak=1.00000  overshoot=0.00%  settle~742ms
response=0.5 damping=0.5  → peak=1.16292  overshoot=16.29% settle~767ms
```

The predicted 0.50% overshoot on a 61px span = **0.31px** — **exactly the measured value**. The `SpringProgress` solver is **mathematically faithful** and the demo drives it correctly. The default preset *barely* overshoots by design; tap "Bouncy" (0.5/0.45) to see the dramatic 16% ring. (Frame `spring-scene-after-tap.png`: ball + target marker coincident, badge reads `SETTLED`.)

> **Finding SP1 (positive):** the Spring rail is **the exemplar** — physically faithful, dogfoods both `SpringProgress` and `springTimingFunction`, and the empirical trajectory matches the closed-form solution to 1e-3. This is the motion bar every *other* surface should clear.
> **Caveat (layout, not motion):** at 1440px the spring sidebar panel overlaps the rail viewport (`spring-scene-idle.png` — the control card covers the left ~⅔ of the rail). The motion is right; the responsive layout clips it. Route to the demo lane.

## 3b — Cube idle-bob: NOT the engine (KEY PRINCIPLE: ambient life — present but not dogfooded)

**Capture:** `measurements.json` (`cubeIdleBob`), `audit-prm.mjs`.

```
animationName: idle-bob-cb248207
duration: 3s   timingFunction: cubic-bezier(0.4, 0, 0.2, 1)   (CSS @keyframes)
translateY: 0 → 5px  (full range 5px measured over the 3s cycle)
median frame: 8.3ms   p95 frame: 8.5ms   → smooth 60fps, zero jank
```

The idle bob is **buttery (60fps, 8.3ms median frame)** — but it is a hand-rolled CSS `@keyframes idle-bob` (`CubeTarget.vue:133-146`), **not** `SpringProgress`/`NumericAnimation`. It is ambient affordance done with a 2-stop linear-ish curve; a spring/ease idle (subtle ease-in-out breathing) would read more alive, and would dogfood the engine the page is built to advertise.

> **Finding CB1:** the hero scene's ambient motion bypasses keyframes.js entirely. Cheap win: drive the bob via a `SpringProgress` (or a `NumericAnimation` with `springTimingFunction`) so the landing page demonstrates its own product.

---

## 4 — prefers-reduced-motion: the CRITICAL dogfood failure (KEY PRINCIPLE: accessibility/affordance)

**Capture:** `audit-prm.mjs`, `audit-prm-diag.mjs`, `audit-spring-prm.mjs` → `measurements-prm.json`, `measurements-spring-prm.json`; frames `reduced-motion-cube.png`, `reduced-motion-spring.png`. Emulated via `browser.newContext({ reducedMotion: "reduce" })` (`matchMedia('(prefers-reduced-motion: reduce)').matches === true` confirmed).

**The demo gates reduced-motion NOWHERE in its own source:**
- `demo/@/styles/style.css` + `utils.css`: **0** `prefers-reduced-motion` rules.
- `CubeTarget.vue` idle-bob: `animation: idle-bob 3s … infinite alternate` — **no** PRM carve.
- `useSpringDemo.ts`: `new SpringProgress({ response, dampingFraction })` — **no** `respectReducedMotion: true` (the engine *supports* it, `spring.ts:40-45`, default `false`).

**What actually happens under `reduce`, measured two ways:**

**(a) CSS idle-bob — accidentally safe (via the vendored consumer):**
```
normal:  translateY range = 5.0px   (animating, full 3s cycle, 409 samples)
reduce:  translateY range = 0.0px   (pinned, 409 samples)   animationDuration resolves to 1e-05s
```
It IS suppressed under `reduce` — but **not by the demo**. The diagnostic (`audit-prm-diag.mjs`) shows the resolved `animation-duration: 1e-05s` comes from glass-ui's **universal reset** at `glass-ui/src/styles/utilities.css:997-1001`:
```css
@media (prefers-reduced-motion: reduce) {
  *:not([data-allow-motion]) { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
}
```
The demo inherits PRM safety **transitively from the vendored design system**, not by design. (21 PRM media rules exist in the shipped bundle — all from glass-ui, none from the demo.) Pull glass-ui out, or animate via JS, and the safety evaporates — which is exactly what (b) shows.

**(b) JS `SpringProgress` — STILL ANIMATES under `reduce` (the real failure):**
```
prefers-reduced-motion: reduce
spring ball span: 64.12px   distinctIntermediatePositions: 20
t=0 bx=624 → t=51 bx=617 → t=88 bx=602 → t=146 bx=589 → … (tweened, NOT snapped)
→ "JS SpringProgress STILL ANIMATES under reduce … demo omits respectReducedMotion;
   glass-ui CSS reset cannot touch the JS rAF loop"
```
A CSS `* { animation-duration }` reset **cannot reach a JS `requestAnimationFrame` loop**. The flagship spring tweens through 20 positions under `reduce` because the demo never opts into the engine's own gate. **This is the motion-dogfood CRITICAL: the package's headline `respectReducedMotion` feature is OFF in the package's own showcase.**

> **Finding RM1 (CRITICAL):** the demo honors reduced-motion **only by accident of vendoring glass-ui**, and its **JS-driven spring ignores it outright**. Fixes, all in-lane (keyframes.js demo):
> 1. `useSpringDemo.ts` — pass `respectReducedMotion: true` to every `SpringProgress` (and the `NumericAnimation` spring sweep). The engine already snaps-to-target under PRM (`spring.ts:170-185, 372-383`) — the demo just has to ask.
> 2. `CubeTarget.vue` — add an explicit `@media (prefers-reduced-motion: reduce) { .idle-hover { animation: none } }` so the hero scene doesn't depend on glass-ui's blanket reset.
> 3. Add a project-level `@media (prefers-reduced-motion: reduce)` to `demo/@/styles/` so the demo owns its accessibility contract rather than borrowing it.

---

## 5 — Slides facility: the consumer out-classes the engine's own demo (KEY PRINCIPLE: choreography)

**Capture:** `scripts/audit-slides.mjs` (serves `/Users/mkbabb/Programming/slides/dist`) → `measurements-slides.json`; frames `slide-01.png`, `slide-02-after-advance.png`. Deck: `til-briefing` (unprotected). **Zero page errors.**

The slides system DOES consume keyframes.js (`slides/src/deck/useDeckNav.ts:7-10` dynamically imports `springTimingFunction({ response: 0.5, dampingFraction: 0.8 })` for stat count-ups). The **slide-to-slide transition** itself is CSS (`slides/src/styles/deck.css:200`), and it is **excellent** — measured per-slide opacity+translateX across a Next click:

```
transition: opacity 0.5s cubic-bezier(0.4,0,0.2,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)
outgoing slide: opacity 1.000 → 0.324, translateX 0 → -79.5px   (ease-out, leaving left)
incoming slide: opacity 0.002 → 0.676, translateX +72 → +6.9px  (ease-out, arriving from right)
measuredTransitionMs ≈ 473
opacityRampObserved: TRUE   (clean cross-dissolve, both slides ramping simultaneously)
```

A textbook **cross-dissolve + directional slide** with a strong `cubic-bezier(0.16,1,0.3,1)` ease-out on transform (the iOS-feeling "arrive decisively, settle softly" curve). It is **PRM-gated** (`deck.css:487`: `.slide,[data-reveal]{transition:none!important;animation:none!important;opacity:1!important}`) and has reveal keyframes (`rise/fade/wipe-x/grow-y`, deck.css:471-474).

> **Finding SL1 (cross-repo benchmark):** the **consumer (`slides`) has better navigation motion than the engine's own demo** — it cross-dissolves + slides (473ms, ease-out) AND gates reduced-motion, where the keyframes.js scene router hard-cuts and ignores PRM. The keyframes.js demo should adopt the slides' transition discipline for its scene router (Finding S1). And both could go further: the slide swap is hand-tuned CSS — routing it through `springTimingFunction`'s `linear()` twin (which slides *already imports* for count-ups) would unify the curve with the spring engine the constellation is standardizing on.

---

## Cross-lane grounding (numbers other lanes can cite)

| Principle claim | Empirical anchor |
|---|---|
| "dock expand is a discontinuous morph" | width +89px in one ~19ms frame (`measurements-2.json` dock.samples t=19→38ms) vs padding 0.3s spring |
| "dock chrome IS springy" | padding 8.13px peak → 8.00px settle = real `linear()` overshoot |
| "scene nav hard-cuts" | scene-host opacity = `1.0` for all samples t=4→229ms; ramp=false |
| "`.scene-*` CSS is dead" | rule in CSS but `grep -c 'name="scene"'`=0; no `<Transition name="scene">` in `demo/` |
| "spring engine is faithful" | measured 0.31px overshoot = analytic 0.50% × 61px span, to 1e-3 |
| "idle-bob is 60fps but not the engine" | median frame 8.3ms; `animationName: idle-bob` CSS `@keyframes` |
| "demo ignores PRM" | demo CSS PRM rules = 0; JS spring tweens 20 positions under `reduce` |
| "demo is only PRM-safe via glass-ui" | resolved `animation-duration: 1e-05s` from `utilities.css:997` `*` reset |
| "slides out-class the demo" | slide swap cross-dissolves 473ms ease-out + PRM-gated; demo scene = hard cut |

## Recommendations, routed by ownership (inv-16)

**In-lane (keyframes.js demo — writable here):**
1. **[CRITICAL]** `demo/spring/useSpringDemo.ts` — pass `respectReducedMotion: true` to all `SpringProgress`/spring sweeps (dogfood the engine's own gate; engine already implements the snap).
2. `demo/cube/CubeTarget.vue` — add `@media (prefers-reduced-motion: reduce){ .idle-hover{animation:none} }`; optionally re-drive the bob through `SpringProgress`/`NumericAnimation` to dogfood the engine.
3. `demo/app/App.vue:407-424` — **delete** the dead `.scene-*` block, OR revive a correct enter-only spring transition (transition the resolved content on `ready`, not the `<Suspense>` boundary) using `springTimingFunction`.
4. `demo/@/styles/` — add a demo-owned `@media (prefers-reduced-motion: reduce)` so accessibility isn't borrowed from glass-ui.
5. Spring scene responsive layout: sidebar overlaps the rail at ≥1440px (`spring-scene-idle.png`).

**Routed OUTWARD (audit only):**
- **glass-ui** `GlassDock.vue` — make the collapsed↔expanded *box* (width) the spring carrier, not just padding/shadow; the width should ride the same spring-snappy `linear()` end-to-end (Finding D1). Kill the doubled-label crossfade seam.
- **slides** — already the benchmark; consider routing the slide-swap transform through `springTimingFunction`'s `linear()` (already imported) to unify with the engine's curve (Finding SL1).

## Reproduce
```sh
cd /Users/mkbabb/Programming/keyframes.js && npm run gh-pages
KF_PLAYWRIGHT_DIR=/tmp/kf-audit node scripts/audit-empirical.mjs       # dock/scene/spring/cube/PRM sweep
KF_PLAYWRIGHT_DIR=/tmp/kf-audit node scripts/audit-empirical-2.mjs     # dock-from-collapsed + spring ball
KF_PLAYWRIGHT_DIR=/tmp/kf-audit node scripts/audit-prm.mjs             # idle-bob under reduce (3s cycle)
KF_PLAYWRIGHT_DIR=/tmp/kf-audit node scripts/audit-spring-prm.mjs      # JS spring under reduce
KF_PLAYWRIGHT_DIR=/tmp/kf-audit node scripts/audit-slides.mjs          # slides transition (needs slides/dist)
```
Outputs → `docs/tranches/C/audit/animation/captures/` (`measurements-consolidated.json` + 19 PNG frames).
