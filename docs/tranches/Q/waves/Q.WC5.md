# Q.WC5 — amiga telemetry + the residual scene refinements (the decay() physics made visible)

**Band:** C — the demo-fleet (the residual scene refinements the impl drive's P.W5.S2 deferred; the dogfood made witnessable).
**Phase:** NOW — kf-internal, zero sibling dependency, executable on authorization. Everything rides today's installed tree: the LIGHT `decay()` already consumed by `useSphereSpin.ts` (`demo/amiga/useSphereSpin.ts:10`), the already-tracked `velX`/`velY`/`glideX`/`glideY` velocity state, Three.js's installed material set — NO library publish, NO sibling dependency.
**Sequence (DAG edges):** `Q.WA3 master-merge (FIRST) ─► Q.WC5 amiga + residual refinements (this wave)`. Q.WC5 is independent of every other Band-C wave (Q.WC1/Q.WC2 easing, Q.WC3 mobile, Q.WC4 MorphSVG) and of every engine-perf / correctness / consume wave. (`Q.md:54`; audit lane `B5-kf-demo-arch`.)
**Owning ideas:** the audit **B5-kf-demo-arch** verdict ("the AMIGA scene's P.W5.S2 cures did NOT ship — no `AmigaTelemetry.vue` so the `decay()` physics is still invisible, the scene's entire 'engine drives a non-DOM Three.js target' dogfood claim is unwitnessed; the material is still `MeshLambertMaterial`, the flat unlit ball"). The frontend-design + dogfood precept: the engine's analytic `decay()` glide must be VISIBLE (a telemetry readout makes the physics legible), and the scene's surface should look intentional (a lit specular material, not a flat sphere).

This wave terminalizes the residual Band-C scene refinements the impl drive deferred. The amiga scene is the constellation's clearest "engine drives a non-DOM target" dogfood — `useSphereSpin.ts` flicks the sphere and the SHIPPED analytic `decay()` glide (`x(t) = x0 + (v0/k)(1 − e^(−kt))`) coasts the spin to rest — but the glide is INVISIBLE (no readout shows the angular velocity decaying), so the dogfood claim is unwitnessed. P.W5.S2 specced the cures (telemetry readout + specular material + the post-teardown race fix); the impl drive shipped none of them. Q.WC5 lands them with a born-RED gate over the REAL runtime observable (the telemetry value decays after a flick — an APPEARANCE-axis assertion, not a grep).

---

## Context

### The dogfood is wired but INVISIBLE (verified `file:line`)

`demo/amiga/useSphereSpin.ts` is a genuine engine dogfood: it imports the LIGHT `decay()` (`:10` `import { decay, type DecaySample } from "@mkbabb/keyframes.js"`), tracks running angular velocity `velX`/`velY` in rad/s (`:86-87,148-149`), seeds a per-axis `decay()` sampler on release (`:171-172` `glideX = seed(velX)` / `glideY = seed(velY)`), and advances the glide by wall-clock to coast the spin to rest (`:194-209`). The release angular speed is already computed as `Math.hypot(velX, velY)` (`:183`) for the flick-to-boing threshold.

But **nothing in the scene shows the glide decaying**. There is no telemetry readout — `AmigaCrtOverlay.vue` renders scanlines/grille/vignette/flash (a CRT aesthetic egg, `:17-20`), NOT an angular-velocity readout. So the engine's analytic `decay()` is running invisibly: a viewer sees the sphere coast to rest but has no witness that the LIGHT `decay()` curve is what drives it. The scene's entire "engine drives a non-DOM Three.js target" dogfood claim is unwitnessed (`B5-kf-demo-arch`).

### The flat unlit material (the surface looks unintentional)

`demo/amiga/utils.ts:61` constructs the sphere with `MeshLambertMaterial` — a flat, diffuse-only (no specular highlight) material. The sphere reads as a flat ball, not an intentionally-lit surface. P.W5.S2 specced the swap to a specular material (`MeshPhongMaterial` — adds a specular highlight + shininess) so the lit sphere reads as a deliberate object, not a placeholder (`B5-kf-demo-arch` "the flat unlit ball").

### The post-teardown boing race (a correctness residual)

The flick-to-boing fires via `options.onFlick?.()` (`:184`) — the scene owns the boing arc + its teardown (`:180-181`). P.W5.S2 named a post-teardown `setTimeout` race: a flick fired just before scene-unmount could schedule a boing callback that runs after the scene's Three.js target is torn down (a write to a disposed object). The cure: the scene's boing arc must be cancelable on unmount (an `onUnmounted`-cleared handle), so a late boing never writes to a disposed target.

### Audit evidence

| Ref | Source location | Fact (verified this session, 2026-06-23) |
|-----|-----------------|------------------------------|
| decay dogfood wired | `demo/amiga/useSphereSpin.ts:10,171-172,194-209` | imports LIGHT `decay()`, seeds a per-axis sampler on release, advances the glide by wall-clock — the engine drives the non-DOM Three.js spin |
| velocity already tracked | `demo/amiga/useSphereSpin.ts:86-87,148-149,183` | `velX`/`velY` (rad/s) accumulated; `Math.hypot(velX, velY)` is the release angular speed — the telemetry value is ALREADY computed, just unshown |
| no telemetry readout | `demo/amiga/AmigaCrtOverlay.vue:17-20` + `ls demo/amiga/` (no `AmigaTelemetry.vue`) | the overlay renders scanlines/grille/vignette/flash (a CRT egg), NOT an angular-velocity readout — the glide is invisible |
| flat material | `demo/amiga/utils.ts:61` | `new THREE.MeshLambertMaterial(...)` — diffuse-only, no specular highlight (the flat unlit ball) |
| boing seam | `demo/amiga/useSphereSpin.ts:184` (`options.onFlick?.()`) | the scene owns the boing arc + teardown — the post-teardown `setTimeout` race P.W5.S2 named |
| telemetry precedent | `demo/easing/EasingSidebar.vue` (the +184-line telemetry block the impl drive shipped), `demo/spring/SpringHeatmap.vue` | the readout/telemetry idiom this wave's `AmigaTelemetry.vue` mirrors |
| scene-runtime harness | `scripts/lib/demo-driver.mjs` (`withPage`/`navToScene`) | the runtime gate lifecycle the born-RED `proof:amiga-decay-visible` rides |

---

## Scope

Each S-clause is a concrete, falsifiable deliverable. **S1** builds `AmigaTelemetry.vue` — an angular-velocity readout (via the already-tracked `Math.hypot(velX, velY)`) so the engine's `decay()` glide is VISIBLE (the dogfood witnessed). **S2** swaps the flat `MeshLambertMaterial` → a specular material (`MeshPhongMaterial`) so the lit sphere reads as intentional. **S3** fixes the post-teardown boing race (an `onUnmounted`-cancelable boing arc). **S4** authors the born-RED `proof:amiga-decay-visible` over the REAL runtime observable (the telemetry value decays after a flick — an APPEARANCE-axis assertion, not a grep). Every move is kf-internal over today's installed tree — NONE a sibling wait, NONE a workaround, NONE a deferral.

---

### S1 — `AmigaTelemetry.vue`: the angular-velocity readout (the decay() glide made visible)

**Breach.** The engine's analytic `decay()` glide runs INVISIBLY — `useSphereSpin.ts` seeds + advances a per-axis `decay()` sampler (`:171-172,194-209`) but nothing in the scene shows the angular velocity decaying. The "engine drives a non-DOM Three.js target" dogfood claim is unwitnessed (`B5-kf-demo-arch`).

**Cure.** Author `demo/amiga/AmigaTelemetry.vue` — a small readout overlay that surfaces the already-tracked angular velocity. The composable owns the velocity it already tracks (`velX`/`velY` at `:86-87`, the `decay()` glide samples at `:201-209`); `useSphereSpin.ts` exposes a reactive `angularVelocity` (the live `Math.hypot(velX, velY)` during a drag, the live `Math.hypot(glide samples)` during the post-release glide). `AmigaTelemetry.vue` renders it (rad/s, a digit readout or a small bar) so a viewer SEES the `decay()` curve coast to rest: drag the sphere (the readout climbs), release (the readout decays exponentially to zero — the visible `decay()` glide). The scene mounts `AmigaTelemetry.vue` beside `AmigaCrtOverlay.vue` (the CRT aesthetic + the physics readout coexist).

**Constraint (no second writer; single source of velocity).** The telemetry READS the velocity the composable already tracks — it never re-computes or re-tracks (no second velocity integrator). The composable exposes the value via its return surface (a `readonly ref` or a getter snapshot fed via an `onTick`-style hook, the SquareScene `onTick` snapshot precedent — never a second writer). KISS: the readout is a pure consumer of the existing state.

**Gate bite (S4 coverage).** `proof:amiga-decay-visible` `amiga-telemetry-live` clause: drag + release the sphere, assert the `.amiga-telemetry` readout shows a non-zero angular velocity at release that DECAYS toward zero over the glide window (the visible `decay()`). Today: no telemetry element exists → red.

---

### S2 — Swap the flat material to a specular material (the surface reads as intentional)

**Breach.** `demo/amiga/utils.ts:61` constructs the sphere with `MeshLambertMaterial` — diffuse-only, no specular highlight. The sphere reads as a flat placeholder ball, not a deliberately-lit object (`B5-kf-demo-arch`).

**Cure.** Swap `MeshLambertMaterial` → `MeshPhongMaterial` (adds a specular highlight + `shininess`), or `MeshStandardMaterial` (PBR metalness/roughness) if the scene's lighting rig supports it. The lit sphere gains a specular highlight that reads as an intentional surface. Confirm the existing scene lighting (the `light`/`Light` rig in `utils.ts`) produces a visible highlight on the chosen material (a specular material with no light source is no better than Lambert).

**Constraint (visual intent, not gratuitous).** The material swap is a one-line surface refinement that makes the sphere look deliberate; it is NOT a new shader/material pipeline. If the scene's lighting rig does not produce a visible highlight, the swap also adjusts the light (a point/directional light positioned to read on the sphere) — the surface refinement is complete, not a half-measure that swaps the material but leaves it unlit.

**Gate bite (S4 coverage).** `proof:amiga-decay-visible` `specular-material` clause (a corroborator — the appearance axis): the scene's sphere material is a specular material (`MeshPhongMaterial`/`MeshStandardMaterial`), not `MeshLambertMaterial`. (Source-shape corroborator over `utils.ts`; the live keystone is S1's telemetry.) BITE: revert to `MeshLambertMaterial` → red.

---

### S3 — Fix the post-teardown boing race (a correctness residual)

**Breach.** The flick-to-boing fires via `options.onFlick?.()` (`:184`); the scene owns the boing arc + its teardown. A flick fired just before scene-unmount could schedule a boing callback that runs AFTER the scene's Three.js target is torn down — a write to a disposed object (the post-teardown `setTimeout` race P.W5.S2 named).

**Cure.** The scene's boing arc must be cancelable on unmount: hold the boing arc's handle (the rAF/timeout/`RAFPlayback` handle that drives the boing), and clear it in `onUnmounted` so a late boing never writes to a disposed target. If the boing rides a `RAFPlayback` loop, `stop()`/`settle()` it on unmount; if it rides a `setTimeout`, `clearTimeout` it. The boing is a transient effect — a teardown-cancelable handle is the correct lifecycle.

**Constraint (lifecycle correctness, no leak).** The fix is a teardown-cancel, not a guard-on-every-write (a guard that checks "is the target disposed?" on every boing frame is a band-aid; canceling the arc on unmount is the gestalt fix). The scene-RAF-leak gate (`proof:scene-raf-leak`) stays green (the boing arc is released on unmount).

**Gate bite (S4 coverage).** `proof:amiga-decay-visible` `boing-teardown-safe` clause (a corroborator): flick the sphere, navigate away (unmount) within the boing window, assert NO post-teardown write error (the console carries no "write to disposed" / no leaked rAF). BITE: a flick-then-unmount that schedules a late write → red. (This reuses the `proof:scene-raf-leak` harness shape.)

---

### S4 — `proof:amiga-decay-visible` born-RED over the REAL runtime observable (the keystone — APPEARANCE axis, NOT a grep)

**Breach.** No gate covers the amiga decay-dogfood visibility, the specular material, or the boing-teardown safety. The demo design refinements are appearance/interaction/state axes that green source-shape gates MISS (the gate-blindspot lesson).

**Cure.** Author `scripts/proof-amiga-decay-visible.mjs`, a **RUNTIME (interaction) gate** over the BUILT `dist/gh-pages/`, mirroring the scene-runtime harness (`scripts/lib/demo-driver.mjs` `withPage`/`navToScene`). Wire it into the `proof:correctness` roster. Clauses:

1. **`amiga-telemetry-live`** (THE KEYSTONE — the APPEARANCE-axis observable): navigate `#/amiga`, drive a REAL drag + release over the sphere, assert the `.amiga-telemetry` readout shows a non-zero angular velocity at release that DECAYS toward zero over the glide window (the visible `decay()` curve — the engine dogfood witnessed). BITE: no telemetry element, or a telemetry that does not decay (a static / non-`decay()`-driven readout) reds.
2. **`specular-material`** (appearance corroborator — source-shape): the sphere material is a specular material (`MeshPhongMaterial`/`MeshStandardMaterial`), not `MeshLambertMaterial`. BITE: the flat material reds.
3. **`boing-teardown-safe`** (state corroborator): flick + unmount within the boing window, assert NO post-teardown write error. BITE: a leaked late write reds.

**Constraint (observable-truth — the keystone).** The `amiga-telemetry-live` clause MUST bite the GENUINE defect (the `decay()` glide is invisible), not a proxy. The proxy trap is asserting only that a `.amiga-telemetry` element EXISTS — which a static "0 rad/s" readout would pass. The clause forbids that: it drives a REAL drag + release and asserts the readout shows a non-zero velocity that DECAYS — the observable a viewer sees (the engine's `decay()` curve coasting to rest). A green "telemetry element present" over a static readout must STILL red `amiga-telemetry-live`. This is the inv-two-axis classification: a dogfood-visibility refinement closes via a RUNTIME gate over the live decaying value, never a source-shape stand-in.

**Gate bite.** `node scripts/proof-amiga-decay-visible.mjs` → exit 1 today (no telemetry element, the flat material, the unguarded boing). After S1–S3 land: `amiga-telemetry-live` confirms a real flick shows a decaying angular velocity, `specular-material` confirms the lit surface, `boing-teardown-safe` confirms no post-teardown write.

---

## Born-RED gate

**Gate:** `proof:amiga-decay-visible` (NEW — `scripts/proof-amiga-decay-visible.mjs`; this wave authors it) — born-RED over three clauses, the keystone being `amiga-telemetry-live` (the REAL runtime APPEARANCE-axis observable: a flick shows the engine's `decay()` glide as a decaying angular-velocity readout).

**The REAL observable (observable-truth).** Each clause bites the GENUINE defect, witnessed born-RED on today's tree — NOT a proxy:

| Gate / clause | Witness on today's tree | Failure mode today (the REAL observable) | Expected after the wave |
|---|---|---|---|
| `amiga-telemetry-live` (**KEYSTONE**) | `#/amiga`, drag + release the sphere, read `.amiga-telemetry` | NO telemetry element (`AmigaCrtOverlay.vue` is the CRT egg; no `AmigaTelemetry.vue`); the `decay()` glide runs invisibly | a `.amiga-telemetry` readout shows a non-zero angular velocity at release that DECAYS to zero over the glide window |
| `specular-material` | the sphere material in `demo/amiga/utils.ts` | `MeshLambertMaterial` (`:61`) — flat, no specular highlight (the flat unlit ball) | a specular material (`MeshPhongMaterial`/`MeshStandardMaterial`) with a visible highlight |
| `boing-teardown-safe` | flick + unmount within the boing window | the boing fires via `options.onFlick?.()` (`:184`); a late callback could write to a disposed target (the post-teardown race) | the boing arc is canceled on unmount; no post-teardown write error |

**Born-RED kf-side TODAY (the keystone).** Verified this session: no `AmigaTelemetry.vue` (`ls demo/amiga/` → no telemetry); the `decay()` glide is wired (`useSphereSpin.ts:171-172,194-209`) but invisible; the material is `MeshLambertMaterial` (`utils.ts:61`); the boing fires via `options.onFlick?.()` (`:184`) with no teardown-cancel. The `amiga-telemetry-live` clause's RED is the GENUINE defect (the engine's `decay()` glide is invisible — the dogfood unwitnessed), not a proxy.

**Plant-a-failure (born-RED proof).** Before the wave: `proof:amiga-decay-visible` exits 1 because no `.amiga-telemetry` element exists (`amiga-telemetry-live` reds), the material is `MeshLambertMaterial` (`specular-material` reds), and the boing is unguarded (`boing-teardown-safe` cannot witness a cancel). The dual born-RED structure: even if a future stub adds a static "0 rad/s" `.amiga-telemetry` element that greens a name-only presence check, `amiga-telemetry-live` STILL reds (the readout does not show a non-zero decaying value after a real flick) — the gate NEVER false-greens on a name-only proxy.

**Green condition.** `AmigaTelemetry.vue` built — the angular-velocity readout made visible from the already-tracked `Math.hypot(velX, velY)` (S1); the specular material swap (S2); the post-teardown boing race fixed (S3); `proof:amiga-decay-visible` three clauses GREEN incl. a live flick showing the decaying angular velocity (S4). The engine's analytic `decay()` dogfood is finally WITNESSED — a viewer sees the LIGHT `decay()` curve coast the spin to rest.

---

## Dependencies

- **LIGHT `decay()` — already consumed by the scene** (`demo/amiga/useSphereSpin.ts:10`). The telemetry READS the velocity the composable already tracks (`velX`/`velY`/`glideX`/`glideY`); NO new library surface, NO sibling publish.
- **Three.js — installed.** The material swap (`MeshLambertMaterial` → `MeshPhongMaterial`/`MeshStandardMaterial`) is over the installed Three.js material set; NO new dependency.
- **Independent of every other Band-C wave** (Q.WC1/Q.WC2 easing, Q.WC3 mobile, Q.WC4 MorphSVG are file-disjoint). File surfaces: `demo/amiga/AmigaTelemetry.vue` (NEW), `demo/amiga/useSphereSpin.ts` (expose the reactive `angularVelocity` — a READ surface, no second writer), `demo/amiga/utils.ts` (the material swap + any light adjustment), `demo/app/scenes/AmigaScene.vue` (mount `AmigaTelemetry.vue` + the `onUnmounted` boing-cancel), `scripts/proof-amiga-decay-visible.mjs` (NEW), `package.json` (gate roster).
- **NO glass-ui dep, NO value.js publish dep, NO parse-that dep.** A pure-NOW Band-C wave — it fires entirely on today's installed tree.

---

## dev→impl boundary

This file is the Tranche Q DEVELOPMENT spec for Q.WC5 — DOCS ONLY. It writes zero engine/demo/library source (inv-16: kf writes only keyframes.js — `decay()` is a PUBLISHED LIGHT export the demo already consumes, never a foreign-tree edit). The IMPLEMENTATION (the `AmigaTelemetry.vue` build, the specular material swap, the boing-teardown fix, the `proof:amiga-decay-visible` authoring) opens only on the owner's explicit authorization, DAG-ordered AFTER Q.WA3 master-merge. When it opens it is gate-first (S4 `proof:amiga-decay-visible` authored born-RED BEFORE S1–S3 land), observable-truth (the `amiga-telemetry-live` keystone over the LIVE decaying angular velocity, an APPEARANCE-axis assertion not a grep), no-legacy (the telemetry READS the existing velocity state, no second integrator; the boing fix is a teardown-cancel, not a per-frame guard band-aid), KISS (the readout is a pure consumer of the existing `Math.hypot(velX, velY)`; the material swap is one line + a light), gestalt (the engine's `decay()` dogfood made witnessable beside the CRT egg), and P-invariant-28 (the residual P.W5.S2 refinements are terminalized HERE with no deferral).

---

## Mid-tranche-friction pre-emption

- **FRICTION: `AmigaTelemetry.vue` re-tracking velocity would create a second velocity integrator (a no-legacy duplication + a drift risk).** **PRE-EMPT:** S1 mandates the telemetry READS the composable's already-tracked `velX`/`velY`/glide samples via a `readonly ref`/`onTick`-snapshot surface (the SquareScene `onTick` precedent) — a pure consumer, never a second writer.
- **FRICTION: the material swap to a specular material with no light source is no better than Lambert (a half-measure).** **PRE-EMPT:** S2 confirms the scene lighting rig produces a visible highlight, adjusting the light if needed — the surface refinement is complete, not a swap that leaves the sphere unlit.
- **FRICTION: the boing fix as a per-frame "is target disposed?" guard is a band-aid that leaves the late callback scheduled.** **PRE-EMPT:** S3 mandates a teardown-CANCEL (`onUnmounted`-cleared handle / `RAFPlayback.stop()`), the gestalt fix — the late boing never fires at all.
- **FRICTION: the demo refinements are appearance/state axes a green source-shape gate MISSES (the gate-blindspot lesson) — a wave that ships `AmigaTelemetry.vue` but no runtime gate would false-green on a static readout.** **PRE-EMPT:** S4's `amiga-telemetry-live` keystone drives a REAL flick and asserts the readout DECAYS — the live observable, never a presence-grep.

---

## Bite — what regression each clause catches

| Clause | Regression it prevents |
|--------|------------------------|
| S1 `amiga-telemetry-live` | The engine's analytic `decay()` glide runs INVISIBLY — the scene's "engine drives a non-DOM Three.js target" dogfood claim is unwitnessed (a viewer sees the sphere coast but has no witness the LIGHT `decay()` curve drives it) |
| S2 `specular-material` | The sphere reads as a flat unlit placeholder ball (`MeshLambertMaterial`) — the scene surface looks unintentional |
| S3 `boing-teardown-safe` | A flick fired just before unmount schedules a boing callback that writes to a disposed Three.js target (the post-teardown `setTimeout` race) — a leaked late write |
| S4 `amiga-telemetry-live` keystone | A static "0 rad/s" `.amiga-telemetry` element greens a presence-grep while the readout does not show the decaying `decay()` value after a real flick — the green-source-shape-gates-miss-appearance trap; the dogfood-visibility refinement is never witnessed |

---

## Excluded from this wave

- **A new amiga scene or a rebuild of the spin/orbit physics** — the `useSphereSpin.ts` `decay()` dogfood is GENUINE and shipped; this wave makes it VISIBLE + refines the surface, it does not re-architect the scene.
- **Promoting `AmigaTelemetry.vue` to a shared component** — it is an amiga-scene-local readout over the scene's own velocity state; a generalized telemetry component is out of scope.
- **The easing curve-editor / DemoControlPoint** (Q.WC1/Q.WC2), the mobile scene-switcher (Q.WC3), the MorphSVG scene (Q.WC4) — separate Band-C waves over disjoint file surfaces.
- **Any library edit** — `decay()` is consumed as-published; this wave is pure demo construction (inv-16). (Contrast Q.WC4, whose render-contract fix IS a library edit on `morph-svg.ts`.)
