# Q.WC1 — DemoControlPoint built in over LIGHT drag2D: the DM-2 NINTH-carry terminates (P-invariant-28 ABSOLUTE)

**Band:** C — the demo-fleet (the chronic build-ins the impl drive deferred; this is the spine the whole Band-C fleet stands on).
**Phase:** NOW — kf-internal, zero sibling dependency, executable on authorization. `drag2D` is ALREADY a LIGHT barrel export (`src/animation/index.ts:88,93`); no enabling library wave is needed (the old "drag2D must be exported first" friction is OBSOLETE — the export shipped, the Q.WA2 enabler is a NO-OP confirmation).
**Sequence (DAG edges):** `Q.WA3 master-merge (FIRST) ─► Q.WA2 drag2D-LIGHT-export-confirm (NO-OP) ─► Q.WC1 DemoControlPoint (this wave) ─► Q.WC2 easing-editor dogfood`. Q.WC1 is the HARD precondition of Q.WC2 (the easing curve-editor dogfoods this handle) and is independent of every other Band-C wave (Q.WC3 mobile/N-Stage, Q.WC4 MorphSVG scene, Q.WC5 amiga). (`Q.md:54,76`; the DAG edge `Q.WA2 → Q.WC1 → Q.WC2`.)
**Owning chronic/DM:** **DM-2 GlassControlPoint → DemoControlPoint** — declared **"ABSOLUTE FINAL / no 8th ride"** at O.W5 AND **"ABSOLUTE FINAL"** again at P.W7, yet **never built** — the worst P-inv-28 violation in the constellation (a NINTH carry: born E, carried E→F→G→H→I→J→K→L→M→O→P). This wave is that carry's terminus: a kf-owned **BUILD-IN** over the published LIGHT `drag2D`, no sibling gate. (`Q.md:38,54,132`; audit lane `B2-pw7-democontrolpoint`, `B5-kf-demo-arch`, `B3-chronic-ledger`.)

This wave **supersedes O.W5 (the original build-in spec, never implemented) + P.W7's substrate dependency**. O.W5 was DEVELOPED but its build-in was never landed (the impl drive's commit 97afd32 "P.W5/W6/W7 Band C: demo-fleet polish" touched ONLY `demo/easing/EasingSidebar.vue` +184 lines of telemetry + a name-that-curve egg — it did NOT build `DemoControlPoint.vue`, did NOT author `proof:demo-control-point.mjs`, did NOT promote the editor to the hero). Q.WC1 is the *implementation* spec; it carries O.W5's design verbatim and deltas the ONE fact that changed: `drag2D` is now confirmed a LIGHT barrel export with the `springOptions` pass-through probe-verified present (`drag.ts:56→:169`), so the build-in is a pure-NOW demo-construction with no library handoff.

---

## Context

### The chronic, and why it must die here (the NINTH carry)

`proof:control-point-live` (`scripts/proof-control-point-live.mjs`, still present on the tree — `ls` confirms) is a born-RED-BY-DESIGN tripwire authored gate-first at L.W9 S4 (DL-K7). It asserts a `GlassControlPoint` — an SVG control-point handle + pointer-drag composable — is importable from the published `@mkbabb/glass-ui` barrel. It has stayed RED because glass-ui has never published the primitive (`grep GlassControlPoint node_modules/@mkbabb/glass-ui/dist/` → ZERO). glass-ui BC answered the standing ask ASK#5 = **NO** (the `<EasingPicker>` handles are INTERNAL; the ≥2-consumer bar is unmet; "kf closes the chronic by building its own `DemoControlPoint`" — `KF-INBOUND.md:16,30`). So the gate's closure mechanism **can never fire** — keeping it is stale-gate dishonesty AND it carries a **naming-collision hazard** the audit flags: `proof:control-point-live` is the glass-ui-handoff tripwire, NOT the kf DemoControlPoint-over-drag2D gate; an implementer could wire the wrong one (`B5-kf-demo-arch` "GATE NAMING COLLISION RISK").

O.W5 chartered the build-in as "the forbidden 8th carry's terminus." The impl drive carried it AGAIN (a 9th carry) while shipping a passive sidebar telemetry readout in place of the protagonist direct-manipulation instrument. Under Q's no-deferral / P-inv-28 precept this is the single clearest violation in the constellation and must die HERE, with no 10th ride.

### kf already owns the substrate — the build-in is a consolidation, not net-new (and the export already shipped)

| Substrate (LIGHT, value.js-free) | file:line | Shape the control-point binds to |
|---|---|---|
| `drag2D` barrel export — **ALREADY LIGHT** | `src/animation/index.ts:88` (`export { drag, Draggable, drag2D } from "./drag"`), `:93` (`Drag2DHandle` type) | a single front-door over two one-axis `Draggable`s; ZERO static `@mkbabb/value.js` edge (`drag-2d.ts:8-10`) |
| `Drag2DHandle` | `src/animation/drag-2d.ts:22-46` | `value: {x,y}`, `velocity: {x,y}`, `settled`, `subscribe(fn(x,y,vx,vy))`, `dispose()` — the EXACT (x,y) handle a curve control-point reads |
| `DragOptions.springOptions` pass-through | `src/animation/drag.ts:56→:169` | `springOptions` forwards `DragOptions → SpringProgress`; probe-confirmed present (`B2-pw7-democontrolpoint`) — the critically-damped construction is a pure component option |
| `DragOptions.bounds` / `transform` | `src/animation/drag.ts:46,70,306-316` | a `[min,max]` hard clamp (rubberBand 0) + a client-px→value-domain map — the normalization the curve handle needs to stay in `[0,1]` |

The demo today **hand-rolls** exactly what `drag2D` models. `EasingCurveCanvas.vue:20` binds `@pointerdown="startDragging"` on raw `<circle class="control-point handle">` handles (`:119/:126`); the bespoke pointer→SVG-CTM transform + hit-test + rubber-band live in a hand-rolled handler. That bespoke pipeline IS the LIGHT `drag2D` primitive — the build-in **consolidates** it onto the published primitive (KISS, no-legacy). And it discharges a live no-legacy violation: `drag2D`/`Drag2DHandle` are exported from the barrel with **ZERO live consumers** (`grep drag2D demo/ src/ test/ bench/` → only the export line). The CONTRIVANCE-AUDIT RE-SCOPED this ("no barrel export without a live consumer"); `DemoControlPoint.vue` becomes that consumer and discharges the RE-SCOPE (`B5-kf-demo-arch`, `B2-pw7-democontrolpoint`).

### The component seam (the boundary law)

```
  curve-MATH (cubic-bezier sample, named→bezier)  ── value.js / kf demo math (parseCSSValue — present)
        ▲
        │  normalized (x,y) v-model
  DemoControlPoint  (THIS WAVE)                    ── kf DEMO component over LIGHT drag2D
        ▲
        │  springOptions:{ dampingFraction: 1 }   ← critically damped (the precision contract — pure demo construction;
        │                                            pass-through confirmed at drag.ts:56→:169)
  drag2D  (pointer-capture, spring follow)         ── kf LIGHT (src/animation/drag-2d.ts) — re-exported through drag.ts
        │                                            ZERO value.js edge
        ▲
        │  glass tokens (--trace / --trace-glow specular)
  glass  (handle polish)                           ── glass-ui published @mkbabb/glass-ui/styles CSS (NO component import)
```

`DemoControlPoint.vue` is a **demo** primitive (`demo/@/components/custom/`), NOT a library export (`src/animation/`). The library already exports the `drag2D` substrate; a library control-point is a keyframes-vue concern, not the engine. **inv-16 holds**: this wave writes only keyframes.js; the glass-ui ASK is WITHDRAWN, not a foreign-tree edit.

### Audit evidence

| Ref | Source location | Fact (verified this session, 2026-06-23) |
|-----|-----------------|------------------------------|
| born-RED #1 | `find demo src scripts -iname '*ControlPoint*'` + `grep -rn "DemoControlPoint" demo/ src/ scripts/` | ZERO — the component is UNBUILT (the gate's RED cause); the NINTH carry |
| born-RED #2 | `ls scripts/proof-demo-control-point.mjs` | no file — the gate to author is ABSENT |
| stale-gate + collision | `scripts/proof-control-point-live.mjs` (present) | the glass-ui `GlassControlPoint` tripwire whose premise BC killed (ASK#5=NO); a naming-collision hazard with the kf gate |
| substrate already LIGHT | `src/animation/index.ts:88,93` | `export { drag, Draggable, drag2D } from "./drag"` + `Drag2DHandle` type — LIGHT, value.js-free, SHIPPED |
| substrate handle | `src/animation/drag-2d.ts:22-46` | `Drag2DHandle` — `value:{x,y}`, `velocity:{x,y}`, `settled`, `subscribe(fn(x,y,vx,vy))`, `dispose()` |
| springOptions pass-through | `src/animation/drag.ts:56→:169` | `DragOptions.springOptions` forwards to `SpringProgress` — probe-confirmed; the critically-damped construction is a component option, NO library edit |
| orphan-export RE-SCOPE | `grep -rn "drag2D" demo/ src/ test/ bench/` | only the `index.ts:88` export line — ZERO live consumers (the CONTRIVANCE-AUDIT RE-SCOPE violation this wave discharges) |
| bespoke handle | `demo/@/components/custom/EasingCurveCanvas.vue:20,119,126` | `@pointerdown="startDragging"` + raw `<circle class="control-point handle">` — the build-in consolidates these |
| live precedent | `scripts/proof-easing-editor-live.mjs:38-44` | a `page.mouse` drag over `.control-point.handle` asserting the bezier `d` mutates + the subject re-animates — the live-drag observable this wave's gate mirrors |
| harness | `scripts/proof-drag-gesture.mjs:22-44`, `scripts/lib/demo-driver.mjs` (`withPage`/`navToScene`) | `page.mouse.down→move→up` over the BUILT `dist/gh-pages/` — the runtime gate lifecycle |

---

## Scope

Each S-clause is a concrete, falsifiable deliverable. **S1** builds `DemoControlPoint.vue` over the LIGHT `drag2D`, critically damped. **S2** consolidates the bespoke `EasingCurveCanvas` handle onto it (no-legacy: the hand-rolled drag retires) and discharges the drag2D orphan-export RE-SCOPE. **S3** authors `proof:demo-control-point` born-RED over the REAL runtime observable — the keystone is an APPEARANCE/INTERACTION-axis assertion (a live `page.mouse` drag re-shapes the bezier curve AND re-times the subject ball), NOT a grep. **S4** retires `proof:control-point-live` (premise killed, collision hazard removed) + records the DM-2 terminal disposition. Every move is the EXIT of the NINTH-carry P-inv-28 chronic — a kf-side build-in over a PUBLISHED LIGHT primitive — NONE a sibling wait, NONE a workaround.

---

### S1 — `DemoControlPoint.vue`: a critically-damped curve-editor handle over the LIGHT `drag2D` (DM-2 build-in)

**Breach.** The curve-editor control-point primitive (DM-2, NINTH carry) is unbuilt (`find … '*ControlPoint*'` → ZERO). kf hand-rolls the bespoke pointer drag (`EasingCurveCanvas.vue:20,119,126`) yet owns the LIGHT `drag2D` primitive that models it — which sits orphan-exported with zero consumers.

**Cure.** Author `demo/@/components/custom/DemoControlPoint.vue` — a self-contained, reusable curve-editor handle that:

- **Renders** an SVG `<circle>` handle (+ an optional control-line `<line>` from its anchor) inside the parent's `<svg>` coordinate space — the curve-editor handle shape, identical to the `.control-point.handle` markup it supersedes.
- **Binds** the handle's position to a LIGHT `drag2D(handleEl, { x, y })` (`src/animation/index.ts:88` import — from the kf barrel, NOT a deep path). It reads `Drag2DHandle.value: {x,y}` and wires `subscribe(fn(x,y,vx,vy))` to emit a **normalized** `(x,y)` (in `[0,1]` curve space, modulo a declared overshoot band) via `v-model`-style `update:modelValue` of `{x,y}` on every pointer-move.
- **Critically damps the spring (the precision contract).** Construct `drag2D` with `springOptions: { dampingFraction: 1 }` per axis (`spring.ts:31` — no overshoot; or `{ response: ~0.15, dampingFraction: 1 }` for an iOS-canonical near-instant ring-free feel). A bezier handle released mid-drag MUST land EXACTLY on the release point — a curve editor where the curve you authored is NOT where you dropped the handle is a precision regression. The pass-through is probe-confirmed (`drag.ts:56→:169`) so this is a pure component option, NO library edit.
- **Constrains** the emitted value via `drag2D`'s per-axis `DragOptions` (`drag.ts:46,70,306-316`): `transform` maps client-px → curve-`[0,1]` against the parent SVG's `getScreenCTM()` (the CTM math moves INTO the component as the `transform` fn), `bounds: {min,max}` holds `x ∈ [0,1]` hard while `y` permits the declared overshoot. The library owns the gesture physics; the component owns ONLY the coordinate map. The per-axis CTM decouples cleanly under non-uniform scale (`preserveAspectRatio="none"`, the easing hero's geometry — Q.WC2's concern).
- **Styles** the handle with glass-ui design TOKENS via CSS classes from `@mkbabb/glass-ui/styles` (the `--trace`/`--trace-glow` specular already on `.control-point.handle`) — **NO `GlassControlPoint` component import, NO new glass-ui peer obligation** (inv-16).
- **A11y (carry-forward, not regress):** the handle is keyboard-focusable (`tabindex`, `role="slider"` with `aria-valuenow`/`aria-valuemin`/`aria-valuemax` per axis or a labelled group) and **arrow-key-nudgeable** — a control point that drags but cannot be keyboard-driven is a regression the gate's a11y corroborator (S3) reds.

**Constraint (LIGHT, value.js-free, idiomatic).** `drag2D` carries ZERO static value.js edge (`drag-2d.ts:8-10`); importing it into the demo never pulls value.js onto the demo's light path (`proof:boundary` gates the library barrel, unaffected). The component is a **demo** primitive, not a library export. KISS: the gesture is the library's; the component is ~the `<circle>` + the coordinate map + the emit.

**Gate bite (S3 coverage).** `proof:demo-control-point` `component-built` + `light-substrate` clauses: `DemoControlPoint.vue` exists and imports `drag2D` from the kf barrel. Today: the component does not exist → RED.

---

### S2 — Consolidate the `EasingCurveCanvas` bespoke handle onto `DemoControlPoint` + discharge the drag2D RE-SCOPE (no-legacy)

**Breach.** `EasingCurveCanvas.vue:20,119,126` hand-rolls `@pointerdown="startDragging"` + raw `<circle class="control-point handle">` handles + a bespoke pointer→SVG-CTM transform/hit-test/rubber-band that `drag2D` + the `DemoControlPoint` coordinate-map already provide. Leaving both is duplicated drag surface (no-legacy / KISS violation). Separately, `drag2D`/`Drag2DHandle` are barrel-exported with ZERO live consumers (the CONTRIVANCE-AUDIT RE-SCOPE).

**Cure.** Replace the two bespoke `<circle … data-index>` handles in `EasingCurveCanvas.vue` with two `<DemoControlPoint>` instances (one per bezier control point, bound `v-model` to the canvas's `bezierControlPoints`). Retire the hand-rolled gesture: the bespoke `pointerToSVG` CTM transform + the `startDragging`/hit-test path fold into the component's `drag2D` `transform` option (S1); the drag-in-flight state is driven by the `DemoControlPoint`'s emission (a `@dragstart`/`@dragend`-style event or the `velocity ≠ 0` read). The component continues to ride the shared `body.is-dragging` select-suppression token (`drag2D`'s `Draggable` uses `setPointerCapture` but does NOT set the global token, so `DemoControlPoint` wraps its `pointerdown` to set `body.is-dragging` — the `gestureSelectSuppression` seam, demo-wide contract), preserving the select-suppression law (`proof:drag-gesture` stays green).

**Constraint (no-legacy, single-seam).** After this cure there is ONE drag path for the curve handle: `DemoControlPoint` → `drag2D` → `SpringProgress`. The bespoke `startDragging`/CTM handler is DELETED (not kept beside the new path). `DemoControlPoint.vue` becomes the live `drag2D` consumer that **discharges the orphan-export RE-SCOPE** (record the discharge in `docs/tranches/Q/PROGRESS.md`). The `proof:no-dup-utility` / `proof:composable-encapsulation` hygiene gates stay green (no duplicated drag composable left behind).

**Gate bite.** `proof:demo-control-point` `consolidated` clause: `EasingCurveCanvas.vue` renders `<DemoControlPoint>` (not the bespoke `<circle class="control-point handle">` + `@pointerdown="startDragging"`), and the bespoke CTM handler is gone. Today: the bespoke handle + handler are present → RED. (This is the no-legacy corroborator; the live observable is S3's `live-drag`.)

---

### S3 — `proof:demo-control-point` born-RED over the REAL runtime observable (the keystone — APPEARANCE/INTERACTION axis, NOT a grep)

**Breach.** No `proof:demo-control-point` gate exists (`ls scripts/proof-demo-control-point.mjs` → no file; `grep demo-control-point package.json` → none). The demo design waves are appearance/interaction/state axes that green source-shape gates MISS (the gate-blindspot lesson — `B5-kf-demo-arch`, MEMORY feedback). A wave that ships a component but no runtime interaction gate would false-green on a decorative non-functional handle.

**Cure.** Author `scripts/proof-demo-control-point.mjs`, a **RUNTIME (interaction) gate** over the BUILT `dist/gh-pages/`, mirroring the `proof:easing-editor-live` / `proof:drag-gesture` harness (`scripts/lib/demo-driver.mjs` `withPage` = serveDist + `resolveChromium` + context/teardown; `navToScene` = the per-EXPECTED-state settle). Wire it into the **`proof:correctness`** roster (`package.json`, beside `proof:easing-editor-live` / `proof:drag-gesture`) — the BLOCKING runtime tier (a kf-side build-in with no sibling dependency, so it CAN be hard-gated; this is the structural distinction from the retired report-all `proof:control-point-live`). Four clauses:

1. **`component-built`** (source-shape corroborator): `demo/@/components/custom/DemoControlPoint.vue` exists. BITE: rename/drop the file → red.
2. **`light-substrate`** (source-shape corroborator): `DemoControlPoint.vue` imports `drag2D` from the kf barrel (NOT a deep path, NOT a bespoke pointer handler); `EasingCurveCanvas.vue` renders `<DemoControlPoint>` and the bespoke `startDragging` CTM handler is absent (the S2 consolidation). BITE: re-introduce a bespoke `<circle class="control-point handle">` drag or a hand-rolled `pointerToSVG` → red.
3. **`live-drag`** (THE KEYSTONE — the APPEARANCE/INTERACTION-axis observable): navigate `#/easing` (in from another scene, exercising the editor-mount path), assert ≥2 `DemoControlPoint` handles are present, then drive a REAL `page.mouse.down → move → up` over one handle to a measured non-trivial offset and assert BOTH: (i) the bound normalized `(x,y)` **changed** (read via the bezier path `d` mutating — `EasingCurveCanvas`'s `bezierPathD` recomputes from the control points), AND (ii) the curve **re-times the subject** — the sampled easing value at a fixed `t` is DISTINCT after the drag (a drag that only repaints the `<circle>` but does not re-shape the curve OR re-time the ball still REDs). The probe drives the real `drag2D`-backed handle, not a grep of the component name.
4. **`damped-no-overshoot`** (the S1 precision contract — an APPEARANCE-axis assertion): drag a handle to a measured offset, release, sample the bound `(x,y)` across the settle window, assert it is **monotonic to the release value** (no sample exceeds the release-point coordinate beyond a tight epsilon). BITE: the default under-damped `drag2D` spring (`dampingFraction: 0.86`) overshoots past the drop point → red until S1's `springOptions:{dampingFraction:1}` lands.
5. **`keyboard-operable`** (a11y corroborator — the inv-two-axis appearance/interaction blind-spot): focus a handle, press an arrow key, assert the normalized `(x,y)` nudges (the bezier `d` mutates) — the handle is not drag-only. BITE: a handle that lacks `tabindex`/arrow-key nudge → red.

**Constraint (observable-truth — the keystone).** The gate MUST bite the GENUINE defect, not a proxy. The proxy trap is asserting only `component-built` (the `.vue` file exists) — which a stub rendering an inert `<circle>` would pass. The `live-drag` clause forbids that: a hero handle that does not re-shape the curve AND re-time the ball reds. A green `component-built` over a non-dragging stub must STILL red `live-drag`. This is the inv-two-axis classification: a UI/interaction chronic closes via a RUNTIME gate over the live observable, never a source-shape stand-in.

**Gate bite.** `node scripts/proof-demo-control-point.mjs` → exit 1 today (the component, the consolidation, the live drag, the no-overshoot, the keyboard nudge are ALL absent). After S1+S2 land: every clause greens; `live-drag` confirms a real handle drag re-shapes the bezier curve AND re-times the ball, `damped-no-overshoot` confirms the handle lands on the drop point, `keyboard-operable` confirms arrow-key nudge.

---

### S4 — Retire `proof:control-point-live`; record the DM-2 terminal disposition (the P-inv-28 close + the collision-hazard removal)

**Breach.** `proof:control-point-live` (still present on the tree) is the glass-ui-publish tripwire whose premise (glass-ui must ship `GlassControlPoint`) is KILLED by BC ASK#5 = NO + the S1 build-in. Keeping it RED-by-design forever asserts a gap kf DECIDED not to close via glass-ui — a false-pending tripwire AND a naming-collision hazard with the new kf gate (`B5-kf-demo-arch` "GATE NAMING COLLISION RISK").

**Cure.**

1. **Retire `proof:control-point-live`:** delete `scripts/proof-control-point-live.mjs` + its `package.json` script entry; remove its CI footprint (the born-RED tripwire step + the check-failures arm + the note); remove it from the `EXCLUDED` set in `scripts/proof-ci-coverage.mjs` (the exclusion set shrinks by one; `proof:ci-coverage` stays green because the gate is fully gone, not silently dropped). It is in NEITHER `proof:correctness` NOR `proof:hygiene` (the blocking aggregators are untouched).
2. **Record the DM-2 terminal disposition** in `docs/tranches/Q/PROGRESS.md §"Open deferrals"` (the substrate `proof:chronic-closure` reads at Q.WZ, after the Q.WZ-LEDGER-REPIN points it at the Q ledger) as a net-new Q row:

   > **DM-2 GlassControlPoint → BUILD-IN + glass-ui ask WITHDRAWN (TERMINAL).** Chronicity 9 (born E; carried E→F→G→H→I→J→K→L→M→O→P), the worst P-inv-28 violation (declared ABSOLUTE-FINAL at O.W5 AND P.W7, never built). glass-ui BC answered ASK#5 = NO (`KF-INBOUND.md:16,30`). kf built `demo/@/components/custom/DemoControlPoint.vue` over the LIGHT `drag2D` (`index.ts:88`) at Q.WC1, critically damped; `EasingCurveCanvas.vue` consolidated onto it (bespoke `startDragging` CTM handler deleted); the drag2D orphan-export RE-SCOPE DISCHARGED. `proof:control-point-live` RETIRED (premise killed + collision hazard removed); `proof:demo-control-point` GREEN on the live drag. The `KF-TO-GLASSUI §GlassControlPoint` ask is WITHDRAWN. No 10th ride.

**Constraint (P-invariant-28, no superfluous gate).** The exit form for the glass-ui ask is the WITHDRAWAL record + the LIVE `proof:demo-control-point` over the kf-built component. No forever-green grep-gate ("zero `GlassControlPoint` imports") is authored — the live runtime gate over the real observable IS the standing proof. `proof:chronic-closure` at Q.WZ reads DM-2 as a build-in/withdrawn terminal (a ≥4-tranche item with a BUILD-IN verdict is NOT a bare-BOOK violation — the planted-probe at Q.WZ confirms a bare BOOK reds while a build-in greens).

**Gate bite.** `proof:control-point-live` is GONE (premise killed, CI footprint removed, EXCLUDED set shrunk, collision hazard eliminated); `proof:demo-control-point` exits 1 today (the component absent) and greens after S1+S2. The DM-2 disposition row is recorded for `proof:chronic-closure` to read as terminal.

---

## Born-RED gate

**Gate:** `proof:demo-control-point` (NEW — `scripts/proof-demo-control-point.mjs`; this wave authors it) — born-RED over five clauses, the keystone being `live-drag` (the REAL runtime APPEARANCE/INTERACTION-axis observable: a `page.mouse` drag re-shapes the bezier curve AND re-times the subject ball). It **replaces** the RETIRED `proof:control-point-live`.

**The REAL observable (observable-truth).** Each clause bites the GENUINE defect, witnessed born-RED on today's tree — NOT a proxy:

| Gate / clause | Witness on today's tree | Failure mode today (the REAL observable) | Expected after the build-in |
|---|---|---|---|
| `component-built` | `grep -rn "DemoControlPoint" demo/ src/` | ZERO — `DemoControlPoint.vue` absent (the NINTH carry) | the component file present in `demo/@/components/custom/` |
| `light-substrate` | `grep "drag2D" demo/@/components/custom/DemoControlPoint.vue` | the file does not exist; the curve handle rides the bespoke `@pointerdown="startDragging"` CTM path, not `drag2D` | imports `drag2D` from the kf barrel; bespoke handler deleted |
| `live-drag` (**KEYSTONE**) | `#/easing` mount + `page.mouse.down→move→up` over a `DemoControlPoint` handle | NO `DemoControlPoint` handle exists; a stub `<circle>` that does not re-shape the curve OR re-time the ball would pass a name-only proxy — the genuine observable is "the drag re-shapes the curve AND re-times the ball" | the handle drag mutates the bezier `d` AND the sampled easing-at-fixed-`t` differs after the drag (a real curve edit re-timing the ball) |
| `damped-no-overshoot` | drag-release a handle, sample the settle window | `drag2D` default `dampingFraction: 0.86` overshoots past the drop point (a precision regression) | the bound `(x,y)` monotonic to the release value (critically-damped, S1 — `springOptions:{dampingFraction:1}` confirmed passable) |
| `keyboard-operable` | focus a handle + arrow key | no `DemoControlPoint` handle to focus; the bespoke `<circle>` is not keyboard-nudgeable | a focused handle nudges the normalized `(x,y)` on arrow-key (a11y carried, not regressed) |
| DM-2 terminal record (no extra gate) | `Q/PROGRESS.md §"Open deferrals"` DM-2 row | the 9-carry item rides as a bare glass-ui-HANDOFF (P-inv-28 forbidden) | the DM-2 BUILD-IN + ask-WITHDRAWN row recorded; `proof:chronic-closure` accepts it as terminal |

**Born-RED kf-side TODAY (the keystone).** Verified this session: `DemoControlPoint` is absent (`find … '*ControlPoint*'` → ZERO; `grep -rn "DemoControlPoint" demo/ src/ scripts/` → ZERO), `proof:demo-control-point` is absent (`ls` → no file), `proof:control-point-live` is present + RED-by-design (BC ASK#5 = NO means it NEVER greens), `drag2D`/`Drag2DHandle` are LIGHT-exported with ZERO live consumers. The LIGHT `drag2D` substrate IS present (`index.ts:88`) — so the RED is the UNIMPLEMENTED kf component, NOT an absent substrate. The `live-drag` clause's RED is the GENUINE defect (the control point does not exist / does not re-shape the curve), not a proxy.

**Plant-a-failure (born-RED proof).** Before the build-in: `proof:demo-control-point` exits 1 on a clean tree because the component file is absent — `component-built` reds, and `light-substrate`/`live-drag`/`damped-no-overshoot`/`keyboard-operable` red because there is no handle to import-check, drag, or focus. The dual born-RED structure: even if a future stub renders an inert `<circle>` that greens `component-built`, the `live-drag` clause STILL reds (the stub does not re-shape the curve OR re-time the ball) — the gate NEVER false-greens on a name-only proxy.

**Green condition.** `DemoControlPoint.vue` authored over the LIGHT `drag2D`, critically damped (S1); the `EasingCurveCanvas` bespoke handle consolidated onto it + the orphan-export RE-SCOPE discharged (S2); `proof:demo-control-point` five clauses GREEN incl. a live drag re-shaping the curve + re-timing the ball + no overshoot + an arrow-key nudge (S3); `proof:control-point-live` retired + the DM-2 BUILD-IN/WITHDRAWN row recorded (S4). The NINTH-carry P-invariant-28 chronic EXITS — `proof:chronic-closure` at Q.WZ reads DM-2 as a build-in/withdrawn terminal, with NO bare BOOK and no 10th ride.

---

## Dependencies

- **LIGHT `drag2D` / `Draggable` — already shipped + already LIGHT-exported** (`src/animation/index.ts:88,93`, value.js-free; `drag-2d.ts:22-46` `Drag2DHandle`; `springOptions` pass-through at `drag.ts:56→:169`). The build-in needs NO new library surface, NO new value.js edge, NO sibling publish. The old "drag2D must be exported first" ordering-friction is OBSOLETE (the export shipped); **Q.WA2 is a NO-OP confirmation**, not a blocking enabler.
- **glass-ui BC ASK#5 = NO — already answered** (`KF-INBOUND.md:16,30`). A *decision*, not a publish dependency: it WITHDRAWS the glass-ui ask. The build-in fires entirely on today's installed tree; glass-ui's published `@mkbabb/glass-ui/styles` CSS tokens (already a demo dep) supply the polish with no new component import.
- **HARD precondition of Q.WC2.** Q.WC2 (the easing curve-editor dogfood + hero promotion) sequences ATOP this wave — it dresses the handle this wave builds, it does NOT re-build it. Both `DemoControlPoint.vue` AND `proof:demo-control-point.mjs` are ABSENT today; Q.WC2 CANNOT be authorized until Q.WC1 lands. This is a NOW→NOW intra-repo sequence, NOT a sibling gate.
- **Couples to Q.WZ (the chronic terminal).** Q.WZ's `proof:chronic-closure` (re-pointed at the Q ledger by Q.WZ-LEDGER-REPIN) reads the DM-2 terminal disposition this wave records.
- **Independent of every other Band-C wave** (Q.WC2 dogfoods it; Q.WC3 mobile/N-Stage, Q.WC4 MorphSVG scene, Q.WC5 amiga are file-disjoint). File surfaces: `demo/@/components/custom/DemoControlPoint.vue` (NEW), `EasingCurveCanvas.vue` (consolidate + delete bespoke handler), `scripts/proof-demo-control-point.mjs` (NEW, replaces `proof-control-point-live.mjs`), `package.json` (gate roster), `.github/workflows/ci.yml` (remove the tripwire), `scripts/proof-ci-coverage.mjs` (shrink EXCLUDED), `docs/tranches/Q/PROGRESS.md` (DM-2 disposition + RE-SCOPE discharge).
- **NO glass-ui publish dep, NO value.js publish dep, NO parse-that dep.** A pure-NOW Band-C wave — it fires entirely on today's installed tree.

---

## dev→impl boundary

This file is the Tranche Q DEVELOPMENT spec for Q.WC1 — DOCS ONLY. It writes zero engine/demo/library source (inv-16: kf writes only keyframes.js; the glass-ui ASK is WITHDRAWN, never a foreign-tree edit). The IMPLEMENTATION (the `DemoControlPoint.vue` build, the `EasingCurveCanvas` consolidation, the `proof:demo-control-point` authoring, the `proof:control-point-live` retirement, the DM-2 record) opens only on the owner's explicit authorization, DAG-ordered AFTER Q.WA3 master-merge (`drag2D` is already LIGHT — no library handoff). When it opens it is gate-first (S3 `proof:demo-control-point` authored born-RED BEFORE S1's component lands), observable-truth (the `live-drag` keystone over the real `drag2D`-backed handle, an APPEARANCE/INTERACTION-axis assertion not a grep), no-legacy (the bespoke `startDragging` CTM handler DELETED, the orphan-export RE-SCOPE discharged), KISS (the gesture is the library's; the component is the `<circle>` + coordinate-map + emit), gestalt (ONE drag path for the curve handle, consolidated onto the published primitive), and P-invariant-28 ABSOLUTE (the NINTH-carry DM-2 chronic EXITS here — build-in + WITHDRAWN — with NO 10th ride).

---

## Bite — what regression each clause catches

| Clause | Regression it prevents |
|--------|------------------------|
| S1 `DemoControlPoint` build-in | The DM-2 9-carry item rides a 10th tranche waiting on a glass-ui `GlassControlPoint` that BC DECIDED never to ship (ASK#5 = NO), while kf already owns the LIGHT `drag2D` substrate orphan-exported with zero consumers (P-inv-28 forbidden; KISS) |
| S1 critically-damped | The consolidated `drag2D` handle RINGS past the release point — a curve editor where the curve you authored is NOT where you dropped the handle (a precision regression the bespoke smoothing never had) |
| S2 consolidate + RE-SCOPE discharge | Two drag paths for one curve handle persist (the bespoke `startDragging` CTM handler BESIDE the new `drag2D` primitive) — duplicated drag surface; AND `drag2D` stays orphan-exported (the CONTRIVANCE-AUDIT RE-SCOPE recurs every audit) |
| S3 `live-drag` keystone | A STUB `DemoControlPoint` (the `.vue` file exists, renders an inert `<circle>`) passes a name-only proxy gate while the handle does NOT re-shape the curve OR re-time the ball — the EXACT green-source-shape-gates-miss-interaction trap (observable-truth) |
| S3 `damped-no-overshoot` | The handle overshoots the drop point — the precision contract silently broken (an APPEARANCE-axis regression a source gate misses) |
| S3 `keyboard-operable` | The build-in control point ships drag-only, dropping the live editor's keyboard operability (the appearance/interaction blind-spot) |
| S4 retire `proof:control-point-live` + record DM-2 | A stale glass-ui-publish tripwire reds FOREVER (a false-pending tripwire + a naming-collision hazard with the new kf gate), OR the DM-2 chronic rides a 10th tranche as a bare glass-ui-HANDOFF instead of a recorded BUILD-IN/WITHDRAWN terminal (P-inv-28 forbidden) |

---

## Excluded from this wave

- **The easing hero promotion + diff-ghost + precision authoring** — that is Q.WC2 (the design layer over THIS wave's handle; P.W7 verbatim). Q.WC1 builds + consolidates the handle; Q.WC2 makes the curve-editor it powers the demo's protagonist instrument.
- **Promoting `DemoControlPoint` to a LIBRARY export** (`src/animation/`) — out of scope. It is a kf-DEMO primitive over the existing LIGHT `drag2D`; a library control-point is a keyframes-vue concern.
- **The unify-all-demo-drag-handles-onto-`drag2D` refactor** — a separable follow-on (timeline diamonds, motion-path anchors, sequence rows have distinct physics); recorded as a Q-LEDGER BOOK note WITHOUT a named-gate obligation (per the CONTRIVANCE-AUDIT SIMPLIFY verdict). NOT built.
- **The glass-ui `GlassControlPoint` ask** — WITHDRAWN by the S1 build-in + BC ASK#5 = NO (recorded in `Q/PROGRESS.md` DM-2).
- **The MorphSVG / amiga / mobile scenes** — those are Q.WC4 / Q.WC5 / Q.WC3 (separate Band-C waves over disjoint file surfaces).
