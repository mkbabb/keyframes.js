# O.W5 — DemoControlPoint built in: the 7-tranche DM-2 chronic terminates (P-invariant-28 ABSOLUTE)

**Band:** C — the chronic terminals (P-inv-28 ABSOLUTE).
**Phase:** NOW — kf-internal, zero sibling dependency, executable on authorization.
**Sequence:** `O.W0 charter ─► A{W1 lint, W2 ledger} ─► B{W3 nan-frame, W4 ingest} ─► C.W5 DemoControlPoint` (this wave) ‖ `C.W6 fromMorphSVG`. The two Band-C chronics are independent of each other and of D.W9; O.WZ's `proof:chronic-closure` reads this wave's DM-2 terminal disposition (`O.md:84,109`).
**Owning chronic/DM:** **DM-2 GlassControlPoint** — 7 tranches (G→M), declared "ABSOLUTE terminal at M — no 8th BOOK" in the deferred ledger, **never built**. This wave is the forbidden 8th carry's terminus: a kf-owned **BUILD-IN**, no sibling gate. (`O.md:55-56,109`; `deferred-ledger-M.md` DM-2 'ABSOLUTE terminus at M… no 8th ride'.)

This wave **supersedes M.W14 §(c) + §S5–S6** (the GlassControlPoint slice — `M.W14.md:104-127,307-374`). M.W14 was DEVELOPED but its terminal-belt was **never implemented** (`AUDIT-DIGEST.md` C16/D17/F28 lanes, verified live 2026-06-19: `DemoControlPoint` absent, `proof:demo-control-point` absent, `proof:control-point-live` unchanged on disk). O.W5 is the *implementation* spec; it references M.W14's design and deltas the ONE fact that changed: glass-ui BC **answered ASK#5 = NO** (a decision M.W14 anticipated but could not cite), so the build-in is now the *only* path — not "Option B," the only option. The `fromMorphSVG`/packrat halves of M.W14 are NOT this wave (MorphSVG → O.W6; packrat KILL → folded at O.W2 per the D4 reconciliation).

---

## Context

### The chronic, and why it must die here

`proof:control-point-live` (`scripts/proof-control-point-live.mjs`) is a born-RED-BY-DESIGN tripwire authored gate-first at L.W9 S4 (DL-K7). It asserts a `GlassControlPoint` — an SVG control-point handle + pointer-drag composable — is importable from the published `@mkbabb/glass-ui` barrel and carries the draggable-SVG-handle shape the keyframes curve editor consumes (`proof-control-point-live.mjs:13-23,143-176`). It has stayed RED for **7 tranches** (G→M) because glass-ui has never published the primitive (`grep GlassControlPoint node_modules/@mkbabb/glass-ui/dist/` → ZERO, `proof-control-point-live.mjs:132-137`).

The gate's premise is now **dead**, not pending. glass-ui BC answered the standing ask:

> **ASK#5 — GlassControlPoint (the 7-tranche DM-2 chronic) — yes/no.** … **ANSWER: NO** (decision). The live BB `<EasingPicker>` component … carries draggable handles INTERNAL to the picker; it does NOT export a standalone `GlassControlPoint` primitive (the ≥2-consumer bar is unmet — kf is the only named consumer). **kf closes the chronic by building its own `DemoControlPoint`.**
> — `glass-ui/docs/tranches/BC/inbound/KF-INBOUND.md:16,30`

So `proof:control-point-live`'s closure mechanism **can never fire** (`AUDIT-DIGEST.md` D17 §1, `proof-control-point-live.mjs` would red forever asserting a gap kf has *decided* not to close via glass-ui). Keeping it is stale-gate dishonesty (`O.md:69-72`). P-invariant-28 forbids an 8th bare ride; the re-BOOK is CLOSED since L.WZ (`M.W14.md:8-9,35-37`). The exit is a kf-side BUILD-IN with NO sibling wait — kf **already owns the entire substrate**.

### kf already owns the substrate (the build-in is a consolidation, not net-new)

| Substrate (LIGHT, value.js-free) | file:line | Shape the control-point binds to |
|---|---|---|
| `drag2D` barrel export | `src/animation/index.ts:88` (`export { drag, Draggable, drag2D } from "./drag"`) | a single front-door over two one-axis `Draggable`s; ZERO static `@mkbabb/value.js` edge (`drag-2d.ts:8-10`) |
| `Drag2DHandle` | `src/animation/drag-2d.ts:22-46` | `value: {x,y}`, `velocity: {x,y}`, `settled`, `subscribe(fn(x,y,vx,vy))`, `dispose()` — the EXACT (x,y) handle a curve control-point reads |
| `Draggable` pointer-capture core | `src/animation/drag.ts:127-437` | `attach(el)` binds `pointerdown`; the down captures the pointer + binds `pointermove`/`pointerup`; release re-seats the spring (`drag.ts:267-370`) |
| `DragOptions.bounds` / `transform` | `src/animation/drag.ts:46,70,306-316` | a `[min,max]` hard clamp (rubberBand 0) + a client-px→value-domain map — the normalization the curve handle needs to stay in `[0,1]` |

The demo today **hand-rolls** exactly what `drag2D` models. `EasingCurveCanvas.vue:114-128` renders raw `<circle class="control-point handle" data-index="…">` SVG handles; `useEasingCurveDrag.ts:43-134` carries a bespoke `pointerToSVG` CTM transform + a hit-test + a hand-rolled rubber-band/smoothing pass, driving the shared `useDragCapture` seam (`useEasingCurveDrag.ts:3,128-131`). That bespoke pointer→value pipeline is **precisely** the LIGHT `drag2D` primitive — the build-in **consolidates** the hand-rolled handler onto the published primitive (KISS, no-legacy: the demo stops re-implementing what the library exports).

glass-ui's only differentiated value for a control-point handle was visual polish (specular, token shadows). That is CSS, reachable via `@mkbabb/glass-ui/styles` classes already imported demo-wide (`EasingCurveCanvas.vue` already styles `.control-point.handle` with token vars — `:414-443`). NO component import is needed for a `<circle>` + line. So **GlassControlPoint as a glass-ui PRIMITIVE is OUT-OF-SCOPE** (the component was the *enabler*, never the product); kf builds `DemoControlPoint` over its own LIGHT `drag2D` + glass-ui's published tokens.

### The component seam (designed carefully — the boundary law)

The three layers the audit's "boundary" note mandates (`O.md:55-56`), each owned by exactly one repo:

```
  curve-MATH (bezier sample, cubic-bezier literal)  ── value.js / kf demo math (NOT this wave's concern)
        ▲
        │  normalized (x,y) emission
  drag  (pointer-capture, spring follow, fling)      ── kf LIGHT  ` drag2D ` (src/animation/drag-2d.ts) ── ZERO value.js edge
        ▲
        │  Drag2DHandle.subscribe(fn(x,y,vx,vy))
  glass (specular / shadow / handle polish)          ── glass-ui published @mkbabb/glass-ui/styles CSS tokens (NO component import)
```

`DemoControlPoint.vue` is a **demo** primitive (`demo/@/components/`), NOT a library export (`src/animation/`). The library already exports the `drag2D` substrate; a library control-point component is a Vue-adapter concern (keyframes-vue), not the engine (`M.W14.md:471-474` — excluded, re-affirmed). **inv-16 holds**: this wave writes only keyframes.js (a kf-demo component over kf's own primitive); the glass-ui ASK is WITHDRAWN, not a foreign-tree edit.

### Audit evidence

| Ref | Source location | Fact (verified this session, 2026-06-19) |
|-----|-----------------|------------------------------|
| born-RED #1 | `grep -rn "DemoControlPoint" demo/ src/ scripts/` | ZERO — the component is UNBUILT (the gate's RED cause) |
| born-RED #2 | `ls scripts/proof-demo-control-point.mjs` | no file — the gate to author is ABSENT |
| stale-gate | `scripts/proof-control-point-live.mjs:132-137` | asserts `GlassControlPoint` in the glass-ui dist; ZERO hits → RED-by-design, premise now KILLED |
| roster | `package.json:189` | `"proof:control-point-live": "node scripts/proof-control-point-live.mjs"` — wired, to be removed |
| CI | `.github/workflows/ci.yml:402,1596,1687` | the born-RED tripwire step + the check-failures arm + the explanatory note — all to be retired |
| ci-coverage | `scripts/proof-ci-coverage.mjs:181-192` | `proof:control-point-live` in the `EXCLUDED` set (a CI-only continue-on-error tripwire, NOT a blocking aggregator member) — removing it shrinks the exclusion set by one |
| BC decision | `glass-ui/docs/tranches/BC/inbound/KF-INBOUND.md:16,30` | ASK#5 = **NO**; ≥2-consumer bar unmet; `<EasingPicker>` handles are INTERNAL; "kf closes the chronic by building its own `DemoControlPoint`" |
| substrate | `src/animation/index.ts:88` | `export { drag, Draggable, drag2D } from "./drag"` — LIGHT, value.js-free |
| substrate | `src/animation/drag-2d.ts:22-46` | `Drag2DHandle` — `value:{x,y}`, `velocity:{x,y}`, `settled`, `subscribe(fn(x,y,vx,vy))`, `dispose()` |
| bespoke | `demo/@/components/custom/EasingCurveCanvas.vue:114-128` | raw `<circle class="control-point handle" data-index="…">` handles — the build-in consolidates these |
| bespoke | `demo/@/components/custom/composables/useEasingCurveDrag.ts:43-134` | hand-rolled `pointerToSVG` CTM transform + hit-test + rubber-band — precisely what `drag2D` models |
| runtime precedent | `scripts/proof-easing-editor-live.mjs:38-44` clause (b) | a `page.mouse` drag over `.control-point.handle` asserting the bezier `d` mutates + the subject re-animates — the live-drag observable shape this wave's gate mirrors |
| runtime precedent | `scripts/proof-drag-gesture.mjs:22-44` | `page.mouse.down→move→up` over the BUILT `dist/gh-pages/` via the `scripts/lib/demo-driver.mjs` `withPage`/`navToScene` lifecycle — the harness |
| boundary | `O.md:55-56,109` | the build-in seam (curve-MATH=value.js, drag=kf LIGHT, glass=glass-ui CSS); "BC decided GlassControlPoint=NO so kf owns `DemoControlPoint`" |

---

## Scope

Each S-clause is a concrete, falsifiable deliverable. **S1** builds `DemoControlPoint.vue` over the LIGHT `drag2D`. **S2** consolidates the bespoke `EasingCurveCanvas` handle onto it (no-legacy: the hand-rolled drag retires). **S3** authors `proof:demo-control-point` born-RED over the REAL runtime observable (the keystone — a live drag emits an updated normalized `(x,y)`). **S4** retires `proof:control-point-live` + records the DM-2 terminal disposition. Every move is the EXIT of the 7-tranche P-inv-28 chronic — a kf-side build-in over a PUBLISHED LIGHT primitive — NONE a sibling wait, NONE a workaround.

---

### S1 — `DemoControlPoint.vue`: a curve-editor handle over the LIGHT `drag2D` (DM-2 build-in)

**Breach.** The curve-editor control-point primitive (DM-2, 7-tranche) is blocked on a glass-ui `GlassControlPoint` that **will never publish** (BC ASK#5 = NO). kf hand-rolls the bespoke pointer drag (`EasingCurveCanvas.vue:114-128` + `useEasingCurveDrag.ts:43-134`) yet owns the LIGHT `drag2D` primitive that models it.

**Cure.** Author `demo/@/components/custom/DemoControlPoint.vue` — a self-contained, reusable curve-editor handle that:

- **Renders** an SVG `<circle>` handle (+ an optional control-line `<line>` from its anchor) inside the parent's `<svg>` coordinate space — the curve-editor handle shape, identical to the `.control-point.handle` markup it supersedes.
- **Binds** the handle's position to a LIGHT `drag2D(handleEl, { x, y })` handle (`src/animation/index.ts:88` import — from the kf barrel, NOT a deep path). It reads `Drag2DHandle.value: {x,y}` and wires `subscribe(fn(x,y,vx,vy))` to emit a **normalized** `(x,y)` (in `[0,1]` curve space, modulo a declared overshoot band) to the parent on every pointer-move (`v-model`-style `update:modelValue` of `{x,y}`).
- **Constrains** the emitted value via `drag2D`'s per-axis `DragOptions` (`drag.ts:46,70,306-316`): `transform` maps client-px → curve-`[0,1]` against the parent SVG's `getScreenCTM()` (the CTM math currently in `useEasingCurveDrag.ts:50-62` moves INTO the component as the `transform` fn), and `bounds: {min,max}` holds `x ∈ [0,1]` hard while `y` permits the declared overshoot (the rubber-band band the editor already models — `useEasingCurveDrag.ts:29-41`). The library owns the gesture physics; the component owns ONLY the coordinate map.
- **Styles** the handle with glass-ui design TOKENS via CSS classes from `@mkbabb/glass-ui/styles` (the `--trace`/`--trace-glow` specular + shadow polish already on `.control-point.handle`, `EasingCurveCanvas.vue:428-443`) — **NO `GlassControlPoint` component import, NO new glass-ui peer obligation** (inv-16).
- **A11y (carry-forward, not regress):** the handle is keyboard-focusable (`tabindex`, `role="slider"` with `aria-valuenow`/`aria-valuemin`/`aria-valuemax` on each axis or a labelled group) and **arrow-key-nudgeable** — the live editor's keyboard operability + tap-target size are PRESERVED (`M.W14.md:331-333`). The `chrome-devtools-mcp:a11y-debugging` axis: a control point that drags but cannot be keyboard-driven is a regression the gate's a11y corroborator (S3) reds.

**Constraint (LIGHT, value.js-free, idiomatic).** `drag2D` carries ZERO static value.js edge (`drag-2d.ts:8-10`); importing it into the demo never pulls value.js onto the demo's light path (`proof:boundary` unaffected — it gates the library barrel, and the demo already imports the heavy engine elsewhere). The component is a **demo** primitive (`demo/@/`), not a library export (`src/animation/`). KISS: the gesture is the library's; the component is ~the `<circle>` + the coordinate map + the emit.

**Gate bite (S3 coverage).** `proof:demo-control-point` `component-built` + `light-substrate` clauses: `DemoControlPoint.vue` exists and imports `drag2D` from the kf barrel. Today: the component does not exist → RED.

---

### S2 — Consolidate the `EasingCurveCanvas` bespoke handle onto `DemoControlPoint` (no-legacy)

**Breach.** `EasingCurveCanvas.vue:114-128` hand-rolls two raw `<circle class="control-point handle">` handles; `useEasingCurveDrag.ts:43-134` hand-rolls the pointer→SVG CTM transform + hit-test + rubber-band/smoothing that `drag2D` + the `DemoControlPoint` coordinate-map already provide. Leaving both is duplicated drag surface (the precept's no-legacy / KISS violation, and the M.W14 consolidation intent — `M.W14.md:118-119,326-327`).

**Cure.** Replace the two bespoke `<circle … data-index>` handles in `EasingCurveCanvas.vue` with two `<DemoControlPoint>` instances (one per bezier control point, bound `v-model` to `bezierPoints[0..1]`/`[2..3]`). Retire the hand-rolled gesture: `useEasingCurveDrag.ts`'s `pointerToSVG` CTM transform folds into the component's `drag2D` `transform` option (S1); the `currentHandleIndex` drag-bend smear state (`useEasingCurveDrag.ts:47,89,103-124`) is driven instead by the `DemoControlPoint`'s drag-in-flight emission (an `@dragstart`/`@dragend`-style event or the `velocity ≠ 0` read). The component continues to ride the shared `body.is-dragging` select-suppression token — `drag2D`'s `Draggable` uses `setPointerCapture` (`drag.ts:273`) but does NOT set the global token, so the `DemoControlPoint` wraps its `pointerdown` to set `body.is-dragging` (the `gestureSelectSuppression` seam, demo-wide contract — `demo/@/composables/gestureSelectSuppression.ts`), preserving the B6-a select-suppression law (`proof:drag-gesture` clause (a) stays green).

**Constraint (no-legacy, single-seam).** After this cure there is ONE drag path for the curve handle: `DemoControlPoint` → `drag2D` → `SpringProgress`. The bespoke `useEasingCurveDrag.ts` is DELETED (not kept beside the new path) — a no-legacy purge, not a parallel impl. The `proof:no-dup-utility` / `proof:composable-encapsulation` hygiene gates stay green (no duplicated drag composable left behind).

**Gate bite.** `proof:demo-control-point` `consolidated` clause: `EasingCurveCanvas.vue` renders `<DemoControlPoint>` (not the bespoke `<circle class="control-point handle">`), and `useEasingCurveDrag.ts` is gone. Today: the bespoke handle + composable are present → RED. (This clause is the no-legacy corroborator; the live observable is S3's `live-drag`.)

---

### S3 — `proof:demo-control-point` born-RED over the REAL runtime observable (the keystone — observable-truth)

**Breach.** No `proof:demo-control-point` gate exists (`ls scripts/proof-demo-control-point.mjs` → no file; `grep demo-control-point package.json` → none). M.W14 §S6 named it but it was never authored (`AUDIT-DIGEST.md` C16/D17: "proof:demo-control-point absent: DemoControlPoint unimplemented, no gate authored").

**Cure.** Author `scripts/proof-demo-control-point.mjs`, a **RUNTIME (interaction) gate** over the BUILT `dist/gh-pages/`, mirroring the `proof:easing-editor-live` / `proof:drag-gesture` harness (`scripts/lib/demo-driver.mjs` `withPage` = serveDist + env-driven `resolveChromium` + context/teardown; `navToScene` = the per-EXPECTED-state settle). Wire it into the `proof:correctness` roster (`package.json:193`, beside `proof:easing-editor-live` / `proof:drag-gesture`) — the BLOCKING runtime tier, NOT a continue-on-error tripwire (it is a kf-side build-in with no sibling dependency, so it CAN be hard-gated; this is the structural distinction from the retired `proof:control-point-live`). Clauses:

1. **`component-built`** (source-shape): `demo/@/components/custom/DemoControlPoint.vue` exists. BITE: rename/drop the file → red.
2. **`light-substrate`** (source-shape): `DemoControlPoint.vue` imports `drag2D` from the kf barrel (`@mkbabb/keyframes.js` / the `@src` alias), NOT a deep path and NOT a bespoke pointer handler; `EasingCurveCanvas.vue` renders `<DemoControlPoint>` and `useEasingCurveDrag.ts` is absent (the S2 consolidation). BITE: re-introduce a bespoke `<circle class="control-point handle">` drag or a hand-rolled `pointerToSVG` → red.
3. **`live-drag`** (THE REAL OBSERVABLE — observable-truth): load `#/easing` (navigate in from another scene to exercise the editor-mount path), assert ≥2 `DemoControlPoint` handles are present, then drive a REAL `page.mouse.down → move → up` over one handle to a measured non-trivial offset and assert BOTH: (i) the emitted/bound normalized `(x,y)` **changed** (read via the bezier path `d` mutating — `EasingCurveCanvas.vue:198-202` `bezierPathD` recomputes from `bezierPoints`), AND (ii) the curve **re-animates** the subject — the sampled easing value at a fixed `t` is DISTINCT after the drag (a drag that only repaints the `<circle>` but does not update `bezierPoints` still REDs). The probe drives the real `drag2D`-backed handle, not a grep of the component name.
4. **`keyboard-operable`** (a11y corroborator — the inv-two-axis appearance/interaction blind-spot): focus a handle, press an arrow key, assert the normalized `(x,y)` nudges (the bezier `d` mutates) — the handle is not drag-only. BITE: a handle that lacks `tabindex`/arrow-key nudge → red. (Carries the `M.W14.md:333` a11y preservation into an executable assertion.)

**Constraint (observable-truth — the keystone).** The gate MUST bite the GENUINE defect, not a proxy. The proxy trap (the L.W1 S4 lesson — `M.md:88`, re-stated `M.W14.md:257-263`) here is asserting only `component-built` (the `.vue` file exists) — which a stub rendering an inert `<circle>` would pass. The `live-drag` clause forbids that: it asserts the handle, under a REAL pointer drag through the `drag2D` primitive, emits an updated normalized `(x,y)` that **re-shapes the curve** (the observable a real consumer sees). A green `component-built` over a non-dragging stub must STILL red `live-drag`. This is the inv-two-axis classification: a UI/interaction chronic closes via a RUNTIME gate over the live observable, never a source-shape stand-in (`M.W14.md:364-369`, `AUDIT-DIGEST.md` C16 "DM-2 … must exit at Tranche O via DemoControlPoint build-in over LIGHT Draggable").

**Gate bite.** `node scripts/proof-demo-control-point.mjs` → exit 1 today (the component, the consolidation, the live drag, the keyboard nudge are ALL absent). After S1+S2 land: every clause greens; the `live-drag` clause confirms a real handle drag re-shapes the bezier curve, and `keyboard-operable` confirms arrow-key nudge. This is the wave's keystone gate; it is a BUILD-IN gate (no sibling consume), exactly as the `O.md:84,109` O.W5 row specifies.

---

### S4 — Retire `proof:control-point-live`; record the DM-2 terminal disposition (the P-inv-28 close)

**Breach.** `proof:control-point-live` (`scripts/proof-control-point-live.mjs`; `package.json:189`; `ci.yml:402,1596,1687`; `ci-coverage.mjs:181-192` EXCLUDED) is the glass-ui-publish tripwire whose premise (glass-ui must ship `GlassControlPoint`) is KILLED by BC ASK#5 = NO + the S1 build-in. Keeping it RED-by-design forever asserts a gap kf has DECIDED not to close via glass-ui — a false-pending tripwire (`O.md:69-72`, `AUDIT-DIGEST.md` D17 §1 "the gate's closure mechanism can never fire").

**Cure.**

1. **Retire `proof:control-point-live`:**
   - Delete `scripts/proof-control-point-live.mjs` and its `package.json:189` script entry.
   - Remove its CI footprint: the born-RED tripwire step (`ci.yml:402-405`), the check-failures arm (`ci.yml:1596`), and the explanatory note (`ci.yml:1687`). It is in NEITHER `proof:correctness` NOR `proof:hygiene` (verified — the blocking aggregators are untouched); only the demo-smoke report-all surface loses the stale tripwire.
   - Remove `proof:control-point-live` from the `EXCLUDED` set in `scripts/proof-ci-coverage.mjs:192` (the exclusion set shrinks by one; `proof:ci-coverage` stays green because the gate is fully gone, not silently dropped).
2. **Record the DM-2 terminal disposition** in `docs/tranches/O/PROGRESS.md §"Open deferrals"` (the O substrate `proof:chronic-closure` reads at O.WZ) as a net-new O row (NOT the carried DM-2 glass-ui-HANDOFF framing — `AUDIT-DIGEST.md` F28 recommendation):

   > **DM-2 GlassControlPoint → BUILD-IN + glass-ui ask WITHDRAWN (TERMINAL).** Chronicity 7 (G,H,I,J,K,L→M), ABSOLUTE terminal. glass-ui BC answered ASK#5 = NO (`KF-INBOUND.md:16,30`; ≥2-consumer bar unmet, `<EasingPicker>` handles INTERNAL). kf built `demo/@/components/custom/DemoControlPoint.vue` over the LIGHT `drag2D` primitive (`index.ts:88`) at O.W5; `EasingCurveCanvas.vue` consolidated onto it (`useEasingCurveDrag.ts` deleted). `proof:control-point-live` RETIRED (premise killed); `proof:demo-control-point` GREEN on the live drag. The `KF-TO-GLASSUI-*-ASKS §GlassControlPoint` ask is WITHDRAWN (built-in supersedes it; glass-ui need not deliver it). No 8th ride.

**Constraint (P-invariant-28, no superfluous gate).** The exit form for the *glass-ui ask* is the WITHDRAWAL record (the build-in supersedes the cross-repo dependency) + the LIVE `proof:demo-control-point` over the kf-built component. No forever-green grep-gate is authored ("zero `GlassControlPoint` imports") — that would be a superfluous gate (the superfluity precept); the live runtime gate over the real observable IS the standing proof, and the WITHDRAWAL record is the ask's terminal home. `proof:chronic-closure` at O.WZ reads DM-2 as a build-in/withdrawn terminal (a ≥4-tranche item with a BUILD-IN verdict is NOT a bare-BOOK violation — the planted-probe at O.WZ confirms a bare BOOK reds while a build-in greens).

**Gate bite.** `proof:control-point-live` is GONE (its premise killed, its CI footprint removed, the EXCLUDED set shrunk); `proof:demo-control-point` exits 1 today (the component absent) and greens after S1+S2 — a live drag of the `drag2D`-backed handle re-shapes the curve. The DM-2 disposition row is recorded in `O/PROGRESS.md` for `proof:chronic-closure` to read as terminal.

---

## Born-RED gate

**Gate:** `proof:demo-control-point` (NEW — `scripts/proof-demo-control-point.mjs`; this wave authors it; the `O.md:84,109` O.W5 keystone "build-in, no sibling gate") — born-RED over four clauses, the keystone being `live-drag` (the REAL runtime observable). It **replaces** the RETIRED `proof:control-point-live`.

**The REAL observable (observable-truth).** Each clause bites the GENUINE defect, witnessed born-RED on today's tree — NOT a proxy:

| Gate / clause | Witness on today's tree | Failure mode today (the REAL observable) | Expected after the build-in |
|---|---|---|---|
| `proof:demo-control-point` `component-built` | `grep -rn "DemoControlPoint" demo/ src/` | ZERO — `DemoControlPoint.vue` absent | the component file present in `demo/@/components/custom/` |
| `proof:demo-control-point` `light-substrate` | `grep "drag2D" demo/@/components/custom/DemoControlPoint.vue` | the file does not exist; the curve handle rides the bespoke `useEasingCurveDrag.ts` CTM/hit-test, not `drag2D` | imports `drag2D` from the kf barrel; `useEasingCurveDrag.ts` deleted |
| `proof:demo-control-point` `live-drag` (**KEYSTONE**) | `#/easing` mount + `page.mouse.down→move→up` over a `DemoControlPoint` handle | NO `DemoControlPoint` handle exists; the bespoke `.control-point.handle` would pass a name-only proxy while a stub (`<circle>` that does not update `bezierPoints`) reds — the genuine observable is "the drag re-shapes the curve" | the handle drag mutates the bezier `d` AND the sampled easing-at-fixed-`t` differs after the drag (a real curve edit) |
| `proof:demo-control-point` `keyboard-operable` | focus a handle + arrow key | no `DemoControlPoint` handle to focus; the bespoke `<circle>` is not keyboard-nudgeable | a focused handle nudges the normalized `(x,y)` on arrow-key (a11y carried, not regressed) |
| DM-2 terminal record (no extra gate) | `O/PROGRESS.md §"Open deferrals"` DM-2 row | the 7-tranche item rides as a bare glass-ui-HANDOFF (P-inv-28 forbidden) | the DM-2 BUILD-IN + ask-WITHDRAWN row recorded; `proof:chronic-closure` accepts it as terminal |

**Born-RED kf-side TODAY (the keystone).** Verified this session: `DemoControlPoint` is absent (`grep -rn "DemoControlPoint" demo/ src/ scripts/` → ZERO), `proof:demo-control-point` is absent (`ls scripts/proof-demo-control-point.mjs` → no file), `proof:control-point-live` is present + RED-by-design (`grep GlassControlPoint node_modules/@mkbabb/glass-ui/dist/` → ZERO, and BC ASK#5 = NO means it NEVER greens). The LIGHT `drag2D` substrate IS present (`index.ts:88`) — so the RED is the UNIMPLEMENTED kf component, NOT an absent substrate. The `live-drag` clause's RED is the GENUINE defect (the control point does not exist / does not re-shape the curve), not a proxy for it.

**Plant-a-failure (born-RED proof).** Before the build-in: `proof:demo-control-point` exits 1 on a clean tree because the component file is absent — clause `component-built` reds, and clauses `light-substrate`/`live-drag`/`keyboard-operable` red because there is no handle to import-check, drag, or focus. The dual born-RED structure (per the `proof:drag-gesture` synthetic-drag lesson, `proof-drag-gesture.mjs:22-34`): even if a future stub renders an inert `<circle>` that greens `component-built`, the `live-drag` clause STILL reds (the stub does not re-shape the curve) — the gate NEVER false-greens on a name-only proxy.

**Green condition.** `DemoControlPoint.vue` authored over the LIGHT `drag2D` (S1), the `EasingCurveCanvas` bespoke handle consolidated onto it + `useEasingCurveDrag.ts` deleted (S2), `proof:demo-control-point` four clauses GREEN incl. a live drag re-shaping the curve + an arrow-key nudge (S3), `proof:control-point-live` retired + the DM-2 BUILD-IN/WITHDRAWN row recorded (S4). The 7-tranche P-invariant-28 chronic EXITS — `proof:chronic-closure` at O.WZ reads DM-2 as a build-in/withdrawn terminal, with NO bare BOOK.

---

## Dependencies

- **LIGHT `drag2D` / `Draggable` — already shipped** (`src/animation/index.ts:88`, value.js-free; `drag-2d.ts:22-46` `Drag2DHandle`). The `DemoControlPoint` build-in needs NO new library surface, NO new value.js edge, NO sibling publish. This is the wave's defining fact: every exit is a kf-side build-in. (Contrast the BC-gated Band-F waves — `O.md:87`.)
- **glass-ui BC ASK#5 = NO — already answered** (`KF-INBOUND.md:16,30`). This is a *decision*, not a publish dependency: it WITHDRAWS the glass-ui ask, it does not gate the build-in. The build-in fires entirely on today's installed tree; glass-ui's published `@mkbabb/glass-ui/styles` CSS tokens (already a demo dependency, `~3.9.0`) supply the visual polish with no new component import.
- **Couples to O.WZ (the chronic terminal).** O.WZ's `proof:chronic-closure` substrate transition (L/M → O re-point, `O.md:89`) reads the DM-2 terminal disposition this wave records (`O/PROGRESS.md §"Open deferrals"`). The DM-2 BUILD-IN/WITHDRAWN row MUST be recorded before O.WZ's planted-probe (a ≥4-tranche bare BOOK must red; DM-2 greens as build-in).
- **Couples to O Band F / the deploy round-trip.** Retiring `proof:control-point-live` removes ONE of the two born-RED tripwires that block the auto deploy round-trip (`on: workflow_run` success; `O.md:145-146`, `AUDIT-DIGEST.md` lane: "the auto round-trip cannot fire until keyframes-vue clears AND proof:control-point-live is resolved"). The other (`proof:keyframes-vue-published`, DM-7) clears USER-DOMAIN at O.WZ. After this wave, the control-point blocker is GONE.
- **Independent of every other Band-A/B/C/D wave.** File surfaces: `demo/@/components/custom/DemoControlPoint.vue` (NEW), `EasingCurveCanvas.vue` + `useEasingCurveDrag.ts` (consolidate + delete), `scripts/proof-demo-control-point.mjs` (NEW, replaces the deleted `proof-control-point-live.mjs`), `package.json` (gate roster — add `proof:demo-control-point` to `proof:correctness`, remove `proof:control-point-live`), `.github/workflows/ci.yml` (remove the tripwire step + arm + note), `scripts/proof-ci-coverage.mjs` (shrink the EXCLUDED set), `docs/tranches/O/PROGRESS.md` (DM-2 disposition). No collision with the engine/correctness waves (O.W3/W4) or the MorphSVG sibling chronic (O.W6 — a SEPARATE file `src/animation/morph-svg.ts`, a SEPARATE gate `proof:morphsvg-consume`). It BENEFITS from O.W1's report-all runner (its new gate's reds are reported alongside others) and O.W2's two-axis taxonomy (the RUNTIME-axis classification).
- **NO glass-ui publish dep, NO value.js publish dep, NO parse-that dep.** This is a pure-NOW Band-C wave — it fires entirely on today's installed tree.

---

## dev→impl boundary

This file is the Tranche O DEVELOPMENT spec for O.W5 — DOCS ONLY. It writes zero engine/demo/library source (inv-16: kf writes only keyframes.js; the glass-ui ASK is WITHDRAWN, never a foreign-tree edit). The IMPLEMENTATION (the `DemoControlPoint.vue` build, the `EasingCurveCanvas` consolidation, the `proof:demo-control-point` authoring, the `proof:control-point-live` retirement, the DM-2 record) opens only on the owner's explicit authorization — exactly M's dev→impl boundary. When it opens it is gate-first (S3 `proof:demo-control-point` authored born-RED BEFORE S1's component lands), observable-truth (the `live-drag` keystone over the real `drag2D`-backed handle), no-legacy (the bespoke `useEasingCurveDrag.ts` DELETED, not kept beside), KISS (the gesture is the library's; the component is the `<circle>` + coordinate-map + emit), gestalt (ONE drag path for the curve handle, consolidated onto the published primitive), and P-invariant-28 ABSOLUTE (the 7-tranche DM-2 chronic EXITS here — build-in + WITHDRAWN — with NO 8th/9th ride).

---

## Bite — what regression each clause catches

| Clause | Regression it prevents |
|--------|------------------------|
| S1 `DemoControlPoint` build-in | The DM-2 7-tranche item rides an 8th tranche waiting on a glass-ui `GlassControlPoint` that BC DECIDED never to ship (ASK#5 = NO), while kf already owns the LIGHT `drag2D` substrate (P-inv-28 forbidden; KISS — kf waits on a sibling for a component it builds in ~the `<circle>` + a coordinate map) |
| S2 consolidate `EasingCurveCanvas` | Two drag paths for one curve handle persist (the bespoke `useEasingCurveDrag.ts` CTM/hit-test BESIDE the new `drag2D` primitive) — duplicated drag surface, a no-legacy / KISS violation (`proof:no-dup-utility` / `proof:composable-encapsulation` regression) |
| S3 `proof:demo-control-point` `live-drag` | A STUB `DemoControlPoint` (the `.vue` file exists, renders an inert `<circle>` that does not update `bezierPoints`) passes a name-only proxy gate while the handle does NOT re-shape the curve — the EXACT L.W1 S4 proxy trap (observable-truth); the runtime gate that should bite the real observable (the drag re-animates the subject) is silently green |
| S3 `keyboard-operable` | The build-in control point ships drag-only, dropping the live editor's keyboard operability (the appearance/interaction blind-spot — a green source-shape gate misses that the handle cannot be arrow-nudged) |
| S4 retire `proof:control-point-live` + record DM-2 | A stale glass-ui-publish tripwire reds FOREVER asserting a gap kf DECIDED not to close via glass-ui (a false-pending tripwire that also blocks the auto deploy round-trip), OR the DM-2 chronic rides a 9th tranche as a bare glass-ui-HANDOFF instead of a recorded BUILD-IN/WITHDRAWN terminal (P-inv-28 forbidden) |

---

## Excluded from this wave

- **Promoting `DemoControlPoint` to a LIBRARY export** (`src/animation/`) — out of scope. It is a kf-DEMO primitive (`demo/@/`) over the existing LIGHT `drag2D`; the library already exports the `drag2D` substrate. A library control-point component is a Vue-adapter concern (keyframes-vue), not the engine (`M.W14.md:471-474`).
- **`fromMorphSVG` + `proof:morphsvg-consume` (DM-3)** — that is O.W6 (the SECOND Band-C chronic, over value.js 1.0.2 `PathGeometry`), a SEPARATE file + gate. This wave is ONLY the DM-2 GlassControlPoint/`DemoControlPoint` terminal.
- **The packrat KILL/FOLD (DM-4)** — folded at O.W2 per the D4 owner reconciliation (`AUDIT-DIGEST.md`: DM-4 flipped KILL→FOLD-LANDED, `proof:packrat-sound` GREEN via parse-that A.W2 in 0.11.0). NOT this wave.
- **A general-purpose / non-easing control-point** (timeline diamonds, motion-path anchors, sequence rows) — those drag seams ride `useDragCapture`/`useDragScrub` already and are not the curve-editor handle DM-2 names. A unification of ALL demo drag handles onto `drag2D` is a separable refactor, not the P-inv-28 exit.
- **The glass-ui `GlassControlPoint` ask** — WITHDRAWN by the S1 build-in + BC ASK#5 = NO (recorded in `O/PROGRESS.md` DM-2); glass-ui need not deliver it for kf's demo to work.
