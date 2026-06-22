# P.W5 — the frontend-design fleet, scene 1: the CUBE + AMIGA scenes (affordance · telemetry · earned eggs)

**Band:** C — the demo-frontend-design fleet (the 29-idea design pass over the O-built chronic terminals).
**Phase:** NOW — kf-internal, zero sibling dependency, executable on authorization. (The cube/amiga refinements ride glass-ui's *published* `@mkbabb/glass-ui/styles` tokens + kf's own LIGHT primitives — NO glass-ui component publish, NO value.js publish, NO parse-that dep.)
**Sequence:** `P.W1 apparatus (NOW) ─► C{P.W5 cube+amiga (this wave) ‖ P.W6 square+spring ‖ P.W7 curve-editor+DemoControlPoint ‖ P.W8 N-Stage+mobile}` — the four Band-C waves are independent of each other; all sequence atop O Band C (O.W5 `DemoControlPoint` is the substrate P.W7 dogfoods, not this wave). P.W5 reads O.W7's `useSphereSpin`-glide pose as the amiga substrate but writes only the demo layer. (`P.md:137,163-164`.)
**Owning ideas:** the AUDIT-DIGEST **D1-cube** + **D2-amiga** lanes (`AUDIT-DIGEST.md:634-723`) — the medium-impact design gaps the O work left after L.W11, refined into one coherent INSTRUMENT language with one *earned* on-aesthetic easter-egg per scene. The frontend-design precept: distinctive, not AI-slop; usability/clarity/correctness above novelty.

This wave **sequences atop** L.W11's `proof:design-refinement` (the nine shipped instrument eggs — `scripts/proof-design-refinement.mjs:1-40`, S2 cube / S3 amiga) and O Band C. It does NOT re-do L.W11; it closes the *remaining* D1/D2 gaps the 32-lane re-audit found still open on the live tree (the ghost `.rainbow-wrapper`, the missing grab/release affordance, the invisible amiga `decay()` physics, the engine-unaware `setTimeout` boing race), and adds ONE earned egg per scene (cube: keyboard axis-lock-reveal; amiga: **flick-to-boing**). Every refinement is grounded in a verified `file:line` from the digest.

---

## Context

### The two scenes, and the gap the re-audit found still open

L.W11 did real design work on both scenes (the cube's per-face `--lit` relighting + `--spin-energy` bloom + euler readout; the amiga's CRT phosphor overlay + PRM-gated boing/boot eggs). The 32-lane re-audit (`AUDIT-DIGEST.md` D1/D2) verified those landed but found a band of **medium-impact gaps the O work did not close** — and the through-line is **discoverability + legibility**: the cube signals nothing about being draggable/double-clickable/scrubbable (`AUDIT-DIGEST.md:636` "Discoverability is the most critical gap"), and the amiga's entire dogfood claim ("the engine drives a non-DOM Three.js target") is **invisible** — there is no telemetry, no specular pop, and the boing egg has no progressive-disclosure hint (`AUDIT-DIGEST.md:681`).

The frontend-design mandate (`CONSTITUTION §1`, `P.md:137`) is precise: *usability / clarity / correctness* — distinctive, not generic. So this wave's spine is NOT "add more chrome"; it is **(1) fix the one confirmed correctness defect per scene** (the ghost shimmer class; the engine-unaware boing race), **(2) make the existing-but-invisible physics legible** (grab/release cursor + the amiga angular-velocity telemetry), and **(3) earn one egg by gesture** (the flick-to-boing — promote the hidden dblclick trap to an emergent physics discovery).

### The cube — the gaps (D1, verified `file:line`)

| Gap | Source location | The defect (verified 2026-06-20) |
|---|---|---|
| ghost `.rainbow-wrapper` | `demo/cube/CubeTarget.vue:54-60` (the `rainbow-wrapper` class binding) + `:180-186` (`rainbowTimings` writes `animationDelay`/`animationDuration`) | the class + per-face timings exist but NO `.rainbow-wrapper` keyframe rule is authored — the shimmer **never plays** (a dangling `animation-*` with no `animation-name`). A pure correctness defect: the design intent is dead. |
| no grab/release affordance | `demo/cube/CubeTarget.vue` (`.cube-side` carries `transition: --lit 160ms linear` at `:331`; the container has `cursor: move` but it never swaps to `grabbing`) | `useOrbitalPointer`'s `isDragging` is not reflected to a `[data-dragging]` attribute → the cursor never confirms the grab; touch users get NO affordance at all (`AUDIT-DIGEST.md:636,675`). |
| matrix-label near-invisible in light mode | the matrix editor's `opacity-20` axis labels | light-mode labels are near-invisible; the selected cell lacks a per-axis-color ring (`AUDIT-DIGEST.md:675`). |
| axis-tag confusion | the top-face `−Y` axis-tag (CSS-Y-down correct, but reads wrong to a Y-up reader) | a clarity (not correctness) gap; deferred to a tooltip, not a re-label (the convention IS correct — `AUDIT-DIGEST.md:636`). |

The `--lit` relight is computed in a Vue `computed` off the live rotation (`demo/cube/useCubeRelit.ts:71-73` `faceLit`) — the radical Houdini-paint-worklet transposition (`AUDIT-DIGEST.md:662-665`) would move it off the main thread, but **`CSS.paintWorklet` is Chromium-only** (no Firefox/Safari as of 2026) — so it is **OUT of this wave's required scope**; it rides as a documented progressive-enhancement EXCLUSION (below), never a Baseline regression.

### The amiga — the gaps (D2, verified `file:line`)

| Gap | Source location | The defect (verified 2026-06-20) |
|---|---|---|
| no boing-egg hint | `demo/app/scenes/AmigaScene.vue:168` (`onBoing` dblclick) — NO hint span analogous to `SquareInstrument.vue`'s "double-click to tumble" | the boing is a hidden trap, not a discoverable affordance (`AUDIT-DIGEST.md:685-687`). |
| invisible `decay()` physics | `demo/amiga/useSphereSpin.ts:61-70,131-140` tracks `velX`/`velY` (drag) + `glideX`/`glideY` (the engine glide) but projects only to the CRT phosphor bloom — NO numeric readout | the scene's whole dogfood claim ("engine drives a non-DOM target") is unwitnessed; cube has a euler readout, square has x/y, amiga has **nothing** (`AUDIT-DIGEST.md:688-690`). |
| engine-unaware boing race | `demo/app/scenes/AmigaScene.vue:175-183` `boingTimer = setTimeout(() => { animationGroup.stop(); … }, 4200)` + `useAmigaBoot.ts:47-57` `bootTimer` | a raw `setTimeout` drives the boing/boot stop — if the scene unmounts mid-arc the timer fires post-teardown writing `sphereMesh.position.set(...)` on a torn-down mesh (a silent post-teardown write — `AUDIT-DIGEST.md:691-693`). |
| flat unlit ball | `demo/amiga/utils.ts:61` `new THREE.MeshLambertMaterial({...})` | a flat unlit look, NOT the specular "demo ball" pop the 1984 Boing Ball had — a `MeshPhongMaterial({ shininess, specular })` swap restores it (`AUDIT-DIGEST.md:681,722`). |
| hand-rolled spin (the dogfood seam) | `demo/amiga/useSphereSpin.ts:90-151` hand-rolls pointer capture + NDC hit-test + velocity accumulation + `decay()` glide | the scene could DOGFOOD the LIGHT `drag2D` primitive (the exact surface `DemoControlPoint` uses) instead of reimplementing it — `AUDIT-DIGEST.md:697-700`. |

### The frontend-design spine (the two scenes' coherent identity)

Both scenes already wear the `--ball-tone` scene-identity contract (`AUDIT-DIGEST.md:1130` X5). This wave keeps that — it does NOT invent a new palette. The cube's egg is **spatial** (axis-lock reveal — it grounds an already-implemented but invisible feature). The amiga's egg is **physical** (flick-to-boing — it earns the boing by gesture). Both are *surgical refinements of the kept subject*, never abrogations (the L.W11 instrument-egg law, `proof-design-refinement.mjs:6-8`). The radical/Chromium-only ideas (cube paint-worklet; cube scroll-timeline hero) are documented as progressive-enhancement EXCLUSIONS — present as *enhancement*, never as the Baseline floor (modern-web guidance: scroll-driven animations + Houdini paint are not yet Baseline widely available — feature-detect-or-skip).

---

## Scope

Each S-clause is a concrete, falsifiable deliverable. **S1** cures the ghost cube shimmer + wires the grab/release affordance + the matrix-label legibility (D1 correctness/affordance). **S2** cures the amiga boing race + restores the specular material + makes the `decay()` physics visible via a telemetry overlay (D2 correctness/legibility). **S3** earns the two eggs (cube keyboard axis-lock-reveal; amiga **flick-to-boing**). **S4** authors `proof:amiga-flick-boing` (+ the cube-affordance browser corroborator) born-RED over the REAL live observable. inv-16: every move writes only keyframes.js (the demo layer + a kf gate); no sibling tree is touched.

---

### S1 — the cube: cure the ghost shimmer, wire grab/release, lift the matrix-label legibility (D1 correctness + affordance)

**Breach.** Three D1 gaps remain on the live tree: (a) `.rainbow-wrapper` is a **ghost class** — `CubeTarget.vue:54-60` applies it + `:180-186` writes per-face `animationDelay`/`animationDuration`, but NO `.rainbow-wrapper` keyframe rule exists, so the shimmer never plays (a dangling `animation-*` with no `animation-name` — a pure correctness defect); (b) no grab/release cursor feedback — `useOrbitalPointer`'s `isDragging` never reaches the DOM, so `cursor: move` never swaps to `grabbing` and touch users get zero affordance; (c) the matrix editor's `opacity-20` light-mode axis labels are near-invisible (`AUDIT-DIGEST.md:636,675`).

**Cure.**
- **(a) author the `.rainbow-wrapper` shimmer** as a scoped rule in `CubeTarget.vue` keying a real keyframe (a diagonal `background-position` / `--shimmer-x` sweep — driven by a registered `@property --shimmer-x { syntax: '<length-percentage>'; inherits: false }` so the sweep interpolates cleanly; `@property` is Baseline Widely Available). The existing `rainbowTimings` per-face stagger (`:180-186`) becomes the `animation-delay`/`animation-duration` for the now-real keyframe. NO new rAF (the L.W11 inv-ζ anti-rAF law, `proof-design-refinement.mjs:14-16`) — the shimmer is pure CSS.
- **(b) the grab/release affordance:** reflect `useOrbitalPointer`'s `isDragging` to a `[data-dragging]` attribute on the OrbitalDrag container; add `cursor: grabbing; scale: 0.98` under `[data-dragging]` and `cursor: grab` at rest (`AUDIT-DIGEST.md:675`). For touch (no cursor): a transient first-visit gesture-hint overlay (dismissed to `localStorage` via the demo's existing `vueuse` storage seam) signaling "drag to rotate · double-click to roll" (`AUDIT-DIGEST.md:675`). Add `role="application" aria-label="3D cube — drag to rotate, double-click to roll" tabindex="0"` to OrbitalDrag (the a11y carry-forward — a draggable surface MUST be keyboard-reachable; the `chrome-devtools-mcp:a11y-debugging` axis).
- **(c) matrix-label legibility:** raise the light-mode axis-label opacity from `opacity-20` to `opacity-40` and add a per-axis-color ring (`color-mix` of `--axis-x/y/z`) on the selected cell (`AUDIT-DIGEST.md:675`).

**Constraint (no-legacy, KISS, idiomatic).** Pure CSS for (a)+(c) — zero new JS, zero new rAF. (b) is a single attribute reflect + a cursor rule + a one-time hint (no new gesture machinery — `useOrbitalPointer` already owns `isDragging`). All glass-ui token-driven (`--axis-*`, `--ball-tone`), never ad-hoc CSS (the design-system precept, MEMORY feedback). The axis-tag `−Y` convention is KEPT (it is CSS-Y-down correct) — clarified by a tooltip, not re-labelled.

**Gate bite (S4 coverage).** `proof:amiga-flick-boing` carries a `cube-affordance` corroborator clause: load `#/cube`, assert `.rainbow-wrapper` has a non-`none` resolved `animation-name` (the shimmer is real, not a ghost), and a synthetic `pointerdown` on the OrbitalDrag container flips `[data-dragging]` + the computed cursor to `grabbing`. Today: the shimmer is a ghost (no keyframe), the cursor never swaps → RED.

---

### S2 — the amiga: cure the boing race, restore the specular ball, make the `decay()` physics visible (D2 correctness + legibility)

**Breach.** Three D2 gaps: (a) the boing/boot stop is driven by a raw `setTimeout` (`AmigaScene.vue:175-183` `boingTimer`; `useAmigaBoot.ts:47-57` `bootTimer`) — engine-unaware, racing the mesh teardown on unmount (a silent post-teardown `sphereMesh.position.set(...)`); (b) `MeshLambertMaterial` (`demo/amiga/utils.ts:61`) produces a flat unlit ball, not the specular Boing Ball pop; (c) the `decay()` physics (`useSphereSpin.ts` `velX`/`velY`/`glideX`/`glideY`) are projected ONLY to the CRT bloom — invisible as numbers, so the scene's "engine drives a non-DOM target" dogfood claim is unwitnessed (`AUDIT-DIGEST.md:688-693,722`).

**Cure.**
- **(a) engine-driven boing completion:** replace both raw `setTimeout`s with a single engine-driven completion path — either `animationGroup`'s existing completion hook or a kf `SmoothProgress`-tracked arc-duration, so the stop rides the engine, not a wall-clock timer. Guard EVERY post-boing/post-boot mesh write with `if (!sphereMesh || !scene) return` (`AmigaScene.vue:178-181`, `useAmigaBoot.ts`) — no silent post-teardown write (`AUDIT-DIGEST.md:692-693,722`).
- **(b) the specular pop:** swap `MeshLambertMaterial` → `MeshPhongMaterial({ shininess: 80, specular: '#888' })` at `demo/amiga/utils.ts:61` (a three-character-class swap that restores the 1984 ball's specular highlight — `AUDIT-DIGEST.md:681,722`). Set `--ball-tone: var(--amiga-red)` on the scene-root so the controls-panel scrubber ball inherits the Boing Ball crayon-red identity (the `--ball-tone` contract, `AUDIT-DIGEST.md:722`).
- **(c) the telemetry overlay (the legibility win):** expose `angularVelocity(): number` from `useSphereSpin` (`Math.hypot(velX, velY)` during drag; `Math.hypot(glideX?.velocity ?? 0, glideY?.velocity ?? 0)` during glide — both already tracked, `useSphereSpin.ts:61-70`). Author a colocated `AmigaTelemetry.vue` rendering an angular-velocity readout (rad/s, 2 decimals) + a "gliding / settled" status badge — analogous to the square's spring readout + the cube's euler display (`AUDIT-DIGEST.md:690,702`). Replace the inline `spinBloom += (target - value) * 0.08` lerp (`AmigaScene.vue:338-356`) with the engine's LIGHT `SmoothProgress` primitive (one more dogfood; `AUDIT-DIGEST.md:722`). Add `aria-label="Interactive Amiga Boing Ball — drag to spin, double-click to boing" tabindex="0" @keydown.enter="onBoing"` to the canvas (a11y carry).

**Constraint (KISS, dogfood-first, no-legacy).** (a) deletes the two raw timers (no parallel impl — a no-legacy purge). (b) is a material-constructor swap, not a re-architecture. (c) reads ALREADY-tracked velocity (zero new physics) and renders it; `SmoothProgress` replaces the inline lerp (no hand-rolled smoothing left beside). The hand-rolled-spin → `drag2D` transposition (`AUDIT-DIGEST.md:697-700`) is **deferred to a separable refactor** (it dogfoods the same surface `DemoControlPoint`/P.W7 owns, but is not THIS wave's correctness/legibility floor) — recorded as a BOOK below, not band-aided in.

**Gate bite (S4 coverage).** `proof:amiga-flick-boing` carries an `amiga-telemetry-live` clause: navigate to `#/amiga`, drag the sphere, release, assert the DOM contains a `.amiga-telemetry` element with numeric angular-velocity content > 0 that decays toward 0 (the `decay()` glide made visible). Today: no `.amiga-telemetry` element → RED.

---

### S3 — earn the two eggs: cube keyboard axis-lock-reveal · amiga **flick-to-boing** (the on-aesthetic egg per scene)

**Breach.** Both scenes carry implemented-but-undiscoverable physics: the cube's OrbitalDrag already tracks `pressedKeys.x/y/z` (axis-lock drag) but the axis lines never visually respond (`AUDIT-DIGEST.md:650-653`); the amiga's boing is a hidden dblclick trap with no emergent path (`AUDIT-DIGEST.md:705-707`). The frontend-design ask: ONE earned, on-aesthetic egg per scene that REVEALS the kept physics rather than adding decoration.

**Cure.**
- **the cube egg — keyboard axis-lock-reveal (spatial):** when X/Y/Z is held, OrbitalDrag exposes `pressedKeys` to the parent (slot-prop or emit — already an internal ref, `OrbitalDrag.vue:185-203`); the matching axis line (`CubeTarget.vue:113-115`) brightens via a `--axis-active` custom property + a drop-shadow bloom, making the already-implemented single-axis constraint *spatially legible* (`AUDIT-DIGEST.md:650-653`). Rides the existing `syncRotationToModel` cadence — NO second rAF (inv-ζ).
- **the amiga egg — flick-to-boing (physical, the headline):** in `useSphereSpin.ts:endDrag` (`:131`), measure the release angular speed `Math.hypot(velX, velY)`; if it exceeds a **named, calibrated threshold constant `FLICK_BOING_RAD_S`** AND the boing is not already active, trigger `onBoing()` autonomously — NO double-click required (`AUDIT-DIGEST.md:705-707`). The threshold is NOT a magic `≈ 8 rad/s` literal — it is a named `const FLICK_BOING_RAD_S` derived from observing the actual drag-speed distribution over real flick gestures (instrument the release `velX`/`velY` in development before fixing the value, so the threshold neither mis-fires on gentle drags nor never-fires on hard flicks). The FULL-LOOP-LEDGER probe (spring-heatmap-probe, bench session) confirms the velocity units come from NDC drag accumulation in `useSphereSpin`; the S4 `flick-boing` gate fixture asserts the synthetic flick clears `FLICK_BOING_RAD_S` by ≥ 1.5× margin. This **elevates the boing from a hidden trap to an emergent physics interaction**: the discovery is *earned by a hard flick*. The existing dblclick path is KEPT (both paths coexist; the flick is additive). PRM-gated like the existing boing (the reduced-motion law — `AUDIT-DIGEST.md:681`).

**Constraint (frontend-design — distinctive, earned, on-aesthetic).** Neither egg is decoration: the cube egg makes an invisible constraint visible; the amiga egg makes a hidden interaction emergent. Both are surgical refinements of the kept subject (the L.W11 egg law, `proof-design-refinement.mjs:6-8`) — the flick reads the velocity the engine ALREADY tracks; the axis-reveal reads `pressedKeys` OrbitalDrag ALREADY owns. No hand-rolled rAF in either egg's region (inv-ζ). KISS: each egg is a threshold + a CSS state flip, not new machinery. The flick threshold is the named `FLICK_BOING_RAD_S` const — NOT an in-line magic number — so it is auditable, debuggable, and the S4 gate fixture can assert the synthetic flick clears it by ≥1.5× margin.

**Gate bite (S4 coverage).** `proof:amiga-flick-boing`'s KEYSTONE `flick-boing` clause: synthesize a hard pointer flick (dx≈20px per 16ms for 8 frames) over the sphere, release WITHOUT a double-click, and assert the boing arc engages (the mesh enters its bounce trajectory — `boinging` true / the position departs `SPHERE_HOME`). The fixture ALSO computes the resulting release rad/s and asserts it clears `FLICK_BOING_RAD_S` by ≥1.5× margin (robust to slow-runner device-dependence). Today: no flick path exists (only dblclick) → RED. The cube egg's `cube-axis-lock` corroborator: hold X, assert `.axis-line.x` carries `--axis-active` > 0.

---

### S4 — `proof:amiga-flick-boing` born-RED over the REAL live observable (the keystone — observable-truth)

**Breach.** No gate probes the flick-to-boing egg, the amiga telemetry, or the cube affordance/shimmer cure — `ls scripts/proof-amiga-flick-boing.mjs` → no file; `grep amiga-flick-boing package.json` → none. A green source-shape gate (the component exists) would miss the appearance/interaction axis entirely (the gate-blind-spot lesson — MEMORY `feedback_gate_blindspot_appearance_axis`): a flick handler that is wired but never fires, or a telemetry div that renders `0` and never updates, would pass a name-only proxy.

**Cure.** Author `scripts/proof-amiga-flick-boing.mjs`, a **RUNTIME (interaction) gate** over the BUILT `dist/gh-pages/`, mirroring the `proof:design-refinement` / `proof:drag-gesture` harness (`scripts/lib/demo-driver.mjs` `withPage` = serveDist + env-driven `resolveChromium` + context/teardown; `navToScene` = the per-EXPECTED-state settle — `demo-driver.mjs:24-30,38`). Wire it into the demo-runtime roster beside `proof:design-refinement` (the report-all demo-smoke surface; it is a NOW kf-side gate with no sibling dependency, so it CAN be hard-gated — but it follows the `KF_REQUIRE_BROWSER` lib seam so it is a tripwire where Chromium is absent, blocking where present). Clauses:

1. **`shimmer-real`** (cube correctness — the ghost cure): `#/cube` mount, assert `.rainbow-wrapper`'s resolved `animation-name` is NOT `none` (the keyframe is authored — the shimmer plays). BITE: drop the `.rainbow-wrapper` keyframe → `animation-name: none` → red.
2. **`cube-affordance`** (cube interaction): synthetic `pointerdown` on the OrbitalDrag container flips `[data-dragging]` + the computed cursor reads `grabbing`; assert `role="application"` + `tabindex="0"` present. BITE: remove the `[data-dragging]` reflect → cursor stays `move` → red.
3. **`cube-axis-lock`** (the cube egg): hold X, assert `.axis-line.x` carries `--axis-active` > 0 and a drop-shadow. BITE: the axis line never responds to `pressedKeys` → red.
4. **`amiga-specular`** (amiga correctness): assert `sphereMesh.material` is a `MeshPhongMaterial` (or carries `shininess`/`specular`) — the flat-Lambert look is cured. BITE: revert to `MeshLambertMaterial` → red.
5. **`amiga-telemetry-live`** (amiga legibility — the `decay()` made visible): drag + release the sphere, assert `.amiga-telemetry` exists with a numeric angular-velocity > 0 that **decreases** over ~500ms (the glide bleeds off — the engine physics witnessed). BITE: no telemetry element, OR a static `0` → red.
6. **`flick-boing`** (THE KEYSTONE — observable-truth): synthesize a hard pointer flick (dx≈20px/16ms × 8 frames) over the sphere, release WITHOUT a double-click, assert the boing arc engages (the mesh departs `SPHERE_HOME` / `boinging` true) within a settle window. The fixture computes the resulting release rad/s and asserts it clears `FLICK_BOING_RAD_S` by ≥1.5× margin (guards against threshold mis-set and slow-runner device-dependence; logs the computed rad/s for debuggability). A flick handler that is WIRED but never fires (threshold mis-set), or a stub that only repaints, REDs. BITE: remove the `endDrag` flick-threshold branch → red.

**Constraint (observable-truth — the keystone; the appearance/interaction axis).** The gate MUST bite the GENUINE defect, not a proxy (the gate-blind-spot lesson — MEMORY `feedback_gate_blindspot_appearance_axis`; "green source-shape gates miss appearance/interaction/state"). The proxy trap here: asserting only that `AmigaTelemetry.vue` exists, or that the `endDrag` handler contains the string `onBoing` — a wired-but-never-fired flick passes that. The `flick-boing` + `amiga-telemetry-live` clauses forbid it: they drive a REAL synthetic flick through the live `decay()` physics and assert the boing engages + the velocity decays — the observable a real user sees. This is the inv-two-axis classification (`AUDIT-DIGEST.md` C16 lineage; `O.W5.md:122`): a UI/interaction refinement closes via a RUNTIME gate over the live observable, never a source-shape stand-in.

**Gate bite.** `node scripts/proof-amiga-flick-boing.mjs` → exit 1 today (the shimmer is a ghost, the cursor never swaps, the axis line is inert, the ball is Lambert-flat, there is no telemetry, and the only boing path is dblclick). After S1+S2+S3 land: all six clauses green — the shimmer plays, the cursor confirms the grab, the axis line reveals the lock, the ball pops specular, the telemetry shows the decaying glide, and a hard flick boings the ball without a double-click.

---

## Born-RED gate

**Gate:** `proof:amiga-flick-boing` (NEW — `scripts/proof-amiga-flick-boing.mjs`; this wave authors it; the headline `flick-to-boing` egg + the cube affordance/shimmer corroborators) — born-RED over six clauses, the keystone being `flick-boing` (the REAL live observable: a hard flick engages the boing arc with no double-click).

**The REAL observable (observable-truth).** Each clause bites the GENUINE defect, witnessed born-RED on today's tree — NOT a proxy:

| Gate / clause | Witness on today's tree | Failure mode today (the REAL observable) | Expected after the refinement |
|---|---|---|---|
| `shimmer-real` | `#/cube` + read `.rainbow-wrapper` `animation-name` | `none` — the keyframe is NEVER authored (`CubeTarget.vue:54-60,180-186` bind the class + timings but no rule exists); the shimmer is a ghost | a real `@keyframes` sweep keyed; `animation-name` ≠ `none`; the shimmer plays |
| `cube-affordance` | synthetic `pointerdown` on OrbitalDrag | cursor stays `move`; no `[data-dragging]`; touch users get zero affordance | `[data-dragging]` flips; cursor reads `grabbing`; `role="application"`/`tabindex="0"` present |
| `cube-axis-lock` (egg) | hold X key | `.axis-line.x` is inert — `pressedKeys` is tracked but never reflected visually | `--axis-active` > 0 + a drop-shadow bloom on the locked axis |
| `amiga-specular` | read `sphereMesh.material` type | `MeshLambertMaterial` — flat, unlit, no specular pop | `MeshPhongMaterial` (`shininess`/`specular`) — the 1984 ball's highlight restored |
| `amiga-telemetry-live` | drag + release the sphere | NO `.amiga-telemetry` element — the `decay()` physics are invisible | a numeric angular-velocity > 0 that DECAYS over ~500ms (the glide witnessed) |
| `flick-boing` (**KEYSTONE**) | synthetic hard flick (dx≈20px/16ms × 8), release, NO dblclick | the boing fires ONLY on `dblclick` (`AmigaScene.vue:168`); a flick does nothing — the egg is a hidden trap, not emergent | a hard flick exceeding `FLICK_BOING_RAD_S` (named calibrated const, ≥1.5× gate-fixture margin) engages the boing arc autonomously (mesh departs `SPHERE_HOME`); the dblclick path still works |

**Born-RED kf-side TODAY (the keystone).** Verified this session (2026-06-20): `.rainbow-wrapper` has no keyframe (`grep -n "rainbow-wrapper" demo/cube/CubeTarget.vue` → the class binding + timings exist, no `@keyframes`), `proof-amiga-flick-boing.mjs` is absent (`ls` → no file), the amiga material is `MeshLambertMaterial` (`utils.ts:61`), the boing fires only on dblclick (`AmigaScene.vue:168`), and there is no `.amiga-telemetry` element (`grep -rn "amiga-telemetry" demo/` → ZERO). The substrate IS present (the velocity is tracked in `useSphereSpin.ts:61-70`; `SmoothProgress`/`drag2D` are LIGHT exports) — so the RED is the UNBUILT refinement, not an absent substrate.

**Plant-a-failure (born-RED proof).** Before the refinement: `proof:amiga-flick-boing` exits 1 on a clean tree — `shimmer-real` reds (the keyframe is absent), `cube-affordance`/`cube-axis-lock` red (no `[data-dragging]`/`--axis-active`), `amiga-specular` reds (Lambert), `amiga-telemetry-live` reds (no element), `flick-boing` reds (no flick path). The dual born-RED structure (per the `proof:design-refinement` synthetic-trigger lesson): even if a future stub renders an inert `.amiga-telemetry` div showing a static `0`, the `amiga-telemetry-live` clause STILL reds (the value never decays) — the gate NEVER false-greens on a name-only proxy.

**Green condition.** The cube shimmer authored + grab/release affordance wired + matrix labels lifted (S1), the amiga boing race cured + specular material restored + telemetry overlay built (S2), both eggs earned — cube axis-lock-reveal + amiga flick-to-boing (S3), `proof:amiga-flick-boing` six clauses GREEN incl. a real hard flick engaging the boing + the telemetry decaying (S4). The D1/D2 design gaps CLOSE — the cube signals its affordances and the amiga's `decay()` physics become visible and discoverable.

---

## Dependencies

- **LIGHT `SmoothProgress` / `drag2D` — already shipped** (`src/animation/index.ts:88` `drag2D`; `SmoothProgress` LIGHT static — `CLAUDE.md` LIGHT surface). The amiga telemetry + the `SmoothProgress` lerp replacement need NO new library surface, NO value.js edge, NO sibling publish. This is the wave's defining fact: every refinement is a kf-side NOW move.
- **glass-ui `@mkbabb/glass-ui/styles` tokens — already a demo dependency** (`~4.1.0`). The cube matrix-ring `color-mix`, the `--ball-tone`/`--amiga-red`/`--axis-*` tokens, the telemetry chip styling ride the *published* CSS tokens with NO new component import (the design-system precept — MEMORY `feedback_design_system`). NO glass-ui publish dependency, NO BC gate (the cube/amiga refinements are token-CSS + kf-primitive only).
- **Three.js — already a demo dependency.** The `MeshPhongMaterial` swap + the post-teardown mesh-write guards are demo-layer Three.js edits (`demo/amiga/utils.ts`, `AmigaScene.vue`), not a kf library change. inv-16 holds.
- **Sequences atop O Band C.** O.W5's `DemoControlPoint` is NOT this wave's substrate (that is P.W7's). This wave reads O.W7's `useSphereSpin`-glide pose only as a non-blocking precondition (the glide already ships; the flick-to-boing reads its `velX`/`velY`). If O is not yet implemented, P.W5 still fires — the cube/amiga substrate (`useSphereSpin`, `useOrbitalPointer`, `useCubeRelit`) is L.W11-era, present on today's tree.
- **Couples to P.W1 (the apparatus).** P.W1's demo-runtime gate apparatus + the report-all runner host this wave's new gate; the `KF_REQUIRE_BROWSER` lib seam (`demo-driver.mjs:369`) governs its tripwire-vs-block posture. The flick-boing/telemetry clauses are interaction-axis (not perf) — no portable-ratio bench is required here (those are Band B's), but the runtime observable IS the proof.
- **Independent of P.W6/W7/W8 and every Band-B/D/E/F/G wave.** File surfaces: `demo/cube/CubeTarget.vue` (shimmer keyframe + `[data-dragging]` + matrix ring), `demo/cube/useCubeRelit.ts`/OrbitalDrag (axis-lock reveal), `demo/amiga/utils.ts` (material swap), `demo/app/scenes/AmigaScene.vue` (boing-race cure + telemetry + a11y), `demo/amiga/useSphereSpin.ts` (flick-threshold + `angularVelocity()`), `demo/amiga/AmigaTelemetry.vue` (NEW), `scripts/proof-amiga-flick-boing.mjs` (NEW), `package.json` (gate roster). No collision with P.W6's square/spring files (a SEPARATE scene set) or P.W7's `EasingCurveCanvas`.
- **NO value.js publish dep, NO parse-that dep, NO glass-ui component dep.** This is a pure-NOW Band-C wave — it fires entirely on today's installed tree (kf LIGHT primitives + glass-ui published tokens + Three.js).

---

## dev→impl boundary

This file is the Tranche P DEVELOPMENT spec for P.W5 — DOCS ONLY. It writes zero engine/demo/library source (inv-16: kf writes only keyframes.js; the cube/amiga refinements ride PUBLISHED glass-ui tokens + kf LIGHT primitives, never a foreign-tree edit; NO glass-ui ASK). The IMPLEMENTATION (the cube shimmer/affordance, the amiga boing-race cure + telemetry + material swap, the two eggs, the `proof:amiga-flick-boing` authoring) opens only on the owner's explicit authorization — exactly O's dev→impl boundary. When it opens it is gate-first (S4 `proof:amiga-flick-boing` authored born-RED BEFORE S1–S3 land), observable-truth (the `flick-boing` + `amiga-telemetry-live` keystones over the real `decay()` physics, never a source-shape proxy — the appearance/interaction axis the gate-blind-spot lesson demands), no-legacy (the two raw `setTimeout` boing timers DELETED, the inline `spinBloom` lerp REPLACED by `SmoothProgress` — not kept beside), KISS (each egg is a threshold + a CSS state flip; the material is a one-line swap), gestalt (both scenes wear the same `--ball-tone` identity + the coherent INSTRUMENT language L.W11 established), distinctive-not-AI-slop (the eggs REVEAL kept physics — the cube's invisible axis-lock, the amiga's hidden boing — never decoration), and P-invariant-28 (no chronic re-rides here; the D1/D2 gaps close in one pass).

---

## Bite — what regression each clause catches

| Clause | Regression it prevents |
|--------|------------------------|
| S1 cube shimmer/affordance | The `.rainbow-wrapper` ghost class ships forever (a dangling `animation-*` with no keyframe — the shimmer silently never plays), and the cube signals nothing about being draggable (cursor never swaps to `grabbing`; touch users get zero affordance) — the discoverability gap D1 names as most critical |
| S2 amiga boing-race/specular/telemetry | A raw `setTimeout` writes `sphereMesh.position.set(...)` on a torn-down mesh after unmount (a silent post-teardown crash risk), the ball stays flat-Lambel without the Boing Ball's specular pop, and the `decay()` physics stay invisible (the scene's entire "engine drives a non-DOM target" dogfood claim unwitnessed) |
| S3 cube egg / amiga flick-to-boing | The cube's implemented-but-invisible axis-lock constraint stays inert (the user never learns X/Y/Z constrains rotation), and the boing stays a hidden dblclick trap with no emergent physics path (the discovery is never earned by gesture) |
| S4 `proof:amiga-flick-boing` `flick-boing`/`amiga-telemetry-live` | A STUB refinement (the `.amiga-telemetry` div renders `0` and never updates; the flick handler is wired but its threshold is mis-set so it never fires) passes a name-only proxy gate while the live observable is dead — the EXACT appearance/interaction blind-spot (a green source-shape gate misses that the egg never fires + the physics never show); the runtime gate that should bite the real observable (a hard flick boings the ball, the velocity decays) is silently green |

---

## Excluded from this wave

- **The cube `--lit` Houdini Paint-Worklet transposition** (`AUDIT-DIGEST.md:662-665`) — OUT of scope: `CSS.paintWorklet` is **Chromium-only** (no Firefox/Safari as of 2026; modern-web guidance: not Baseline widely available). It is a documented **progressive-enhancement EXCLUSION** — a `@supports`-gated enhancement a future wave MAY add behind feature detection, never the Baseline floor (the cube must relight correctly with the Vue `computed` path on every browser). Recorded as a BOOK, not band-aided.
- **The cube scroll-timeline hero** (`AUDIT-DIGEST.md:670-673`) — scroll-driven animations (`animation-timeline: scroll()/view()`) are not yet Baseline widely available (modern-web guidance: feature-detect-or-skip). kf's `ScrollTimeline` is a LIGHT export, so the JS path is available, but the hero scroll-drive is a separable enhancement (a P.W8 mobile/shell concern, not the cube's correctness floor). BOOK.
- **The amiga hand-rolled-spin → `drag2D` transposition** (`AUDIT-DIGEST.md:697-700`) — a separable refactor that dogfoods the same LIGHT `drag2D` surface P.W7's `DemoControlPoint` consolidates. It is NOT this wave's correctness/legibility floor (the flick-to-boing reads the EXISTING `velX`/`velY`; it needs no `drag2D` migration). BOOK for a later Band-C unification pass (the same "unify all demo drag handles onto `drag2D`" radical the `O.W5.md:204` exclusion names).
- **The amiga texture hot-swap / SphereGeometry LOD egg** (`AUDIT-DIGEST.md:709-720`) — additional Three.js material-explorer ideas; out of scope for the one-earned-egg-per-scene discipline (the flick-to-boing IS the amiga egg). BOOK.
- **The square + spring scenes** — that is P.W6 (a SEPARATE scene set, SEPARATE files, SEPARATE gates `proof:spring-heatmap-navigable` etc.). This wave is ONLY cube + amiga.
- **The easing-curve-editor + `DemoControlPoint` showcase** — that is P.W7 (over O.W5's build-in). NOT this wave.
