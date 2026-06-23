# Q.WC2 — the EASING curve-editor as the DemoControlPoint showcase (P.W7 verbatim, the hero promotion)

**Band:** C — the demo-fleet (the frontend-design headline; this wave is the **easing** scene's curve-editor UX over the Q.WC1-built `DemoControlPoint`).
**Phase:** NOW — kf-internal, zero sibling dependency, executable on authorization. The curve-editor refinements ride glass-ui's *published* `@mkbabb/glass-ui/styles` tokens + kf's own LIGHT `drag2D` primitive (`src/animation/index.ts:88`) — NO glass-ui component publish, NO value.js publish, NO parse-that dep.
**Sequence (DAG edges):** `Q.WA3 master-merge (FIRST) ─► Q.WC1 DemoControlPoint (the substrate) ─► Q.WC2 easing curve-editor (this wave)`. Q.WC2 sequences HARD-ATOP Q.WC1: Q.WC1 builds `DemoControlPoint.vue` over the LIGHT `drag2D` and consolidates the bespoke `EasingCurveCanvas` handle onto it; Q.WC2 is the *design* layer over that built primitive — it does NOT re-build the handle, it makes the curve-editor it powers the demo's headline direct-manipulation instrument. (`Q.md:54,76`; the DAG edge is `Q.WC1 → Q.WC2`, an intra-repo NOW→NOW sequence, NOT a sibling gate.)
**Owning ideas:** the audit **B5-kf-demo-arch** verdict ("the frontend-design HEADLINE of P Band C was substituted: the easing scene was specced as the demo's protagonist DIRECT-MANIPULATION instrument and shipped instead as a passive sidebar TELEMETRY readout") + **B2-pw7-democontrolpoint** (P.W7's three D5 design gaps still open on the shipped tree). The frontend-design precept: distinctive direct-manipulation instrument, not a sidebar slider; usability/clarity/correctness above novelty.

This wave is **P.W7 verbatim**, re-anchored to the post-impl-drive reality: the impl drive's commit 97afd32 ("demo-fleet polish") touched ONLY `demo/easing/EasingSidebar.vue` (+184 lines of telemetry + a name-that-curve egg) — it did NOT promote the hero, build the diff-ghost, or wire the precision authoring. So all of P.W7's S2–S5 are STILL open on the shipped tree exactly as its born-RED witnesses predicted. Q.WC2 closes the D5 design gaps the Q.WC1 substrate does not touch (the read-only hero, the absent comparison reference, the read-only numeric readout) + the precision-authoring layer (snap, keyboard fine/coarse, ghost-diff) that turns the editor from a sidebar widget into the demo's protagonist instrument. Every refinement is grounded in a verified `file:line`.

---

## Context

### What Q.WC1 already builds (the substrate this wave dresses)

Q.WC1 (NOW, no sibling gate) lands the things this wave assumes present:

| Q.WC1 deliverable | file | Shape Q.WC2 builds on |
|---|---|---|
| `DemoControlPoint.vue` | `demo/@/components/custom/DemoControlPoint.vue` (NEW at Q.WC1) | a critically-damped (`springOptions:{dampingFraction:1}`) curve-editor handle over the LIGHT `drag2D` — renders an SVG `<circle>` + optional control-line, binds `drag2D(handleEl,{x,y})`, emits a normalized `(x,y)` via `update:modelValue`, constrains via per-axis `DragOptions.transform`/`bounds` |
| `EasingCurveCanvas` consolidation | `demo/@/components/custom/EasingCurveCanvas.vue` | the two bespoke `<circle class="control-point handle">` + `@pointerdown="startDragging"` replaced by two `<DemoControlPoint v-model>` instances; the bespoke CTM handler DELETED |
| `proof:demo-control-point` | `scripts/proof-demo-control-point.mjs` (NEW at Q.WC1) | the live-drag keystone (a real `page.mouse.down→move→up` re-shapes the bezier `d` AND re-times the ball) + `damped-no-overshoot` + `keyboard-operable` clauses |
| DM-2 terminal record | `docs/tranches/Q/PROGRESS.md` | the NINTH-carry chronic EXITS as a build-in/WITHDRAWN terminal |

So the handle, its consolidation, its critically-damped construction, and its live-drag gate are Q.WC1's. **Q.WC2 owns the UX one layer up**: where the editor lives (hero vs sidebar), what `f(t)=` means (the ghost reference), and how a designer authors precisely (keyboard fine/coarse + numeric).

### The D5 design gaps the audit found STILL open on the shipped tree (verified `file:line`)

| Gap | Source location | The defect (verified 2026-06-23) |
|---|---|---|
| **the HERO stage is read-only** | `demo/easing/EasingHeroStage.vue:53` `preserveAspectRatio="none"` + `:54` `aria-hidden="true"` on the curve SVG + `:210` `pointer-events: none`; the editable canvas is exiled to the sidebar | you cannot edit the curve where it is largest — you edit in a ~300px sidebar while a separate big ball moves. The single highest-leverage demo improvement. (`B5-kf-demo-arch` "the easing HERO stage remains read-only".) |
| **no comparison reference** — `f(t)=` is opaque | `EasingCurveCanvas.vue` draws only the `f(t)=t` diagonal-ref; no ghost of the *named* curve the custom edit departed from | editing a named curve into custom loses the reference — you see an absolute curve, not how far you pulled from `ease-out`. |
| **read-only numeric + coarse-only keyboard** | the readout at `EasingSidebar.vue` is read-only; Q.WC1's `keyboard-operable` clause gives a single arrow-nudge step | designers cannot type exact `(x1,y1,x2,y2)` NOR nudge fine vs coarse — the `parseCSSValue` path already exists but the readout never feeds it back. |

### The correctness delta the digest also surfaces (folded in, not separate)

- **the 17-sample viewBox overshoot scan is a numeric proxy (FOR THE BEZIER MODE)** — `EasingCurveCanvas.vue:209-228` (`viewBox` computed) samples the fn `i ≤ 16` (17 evals) to find y-extrema; **for a cubic-bezier** the displayed PATH's y-extrema are exactly `min(0,1,y1,y2)`/`max(0,1,y1,y2)` (the convex-hull property), so 17 fn-evals per pointermove are replaceable by a closed-form clamp. **SCOPE GUARD (soundness):** the convex-hull bound is valid ONLY when the active easing resolves to a cubic-bezier (the `cubic-bezier` mode + named curves, which `useEasingDemo.ts:90,96-98` resolves through `NAMED_EASING_BEZIER` to a bezier — `controlPointsSvg` is the `(y1,y2)` source). For the `steps()` mode (`useEasingDemo.ts:99,124-125` `generateStepSVGPath`) the path is a bounded staircase with extrema exactly `[0,1]` (no overshoot), so the bound is the trivial `[0,1]` — NOT the `1-y1/1-y2` formula (`controlPointsSvg` is undefined in steps mode). The cure therefore branches: bezier/named-bezier → the convex-hull closed form; steps → `[0,1]`. This is KISS + a per-move perf win, folded into S1, and it MUST keep `proof:easing-canvas-bounded` (`package.json:150`) green. **y-domain inversion note:** `EasingHeroStage.vue:66` renders `demo.svgPath.value` with y inverted (the canvas uses `1 - easingFn`, `viewBox` pushes `1 - props.easingFn(t)`); the closed-form clamp must operate on `1-y1`/`1-y2` in the SVG y-domain: `Math.min(0, 1, 1-y1, 1-y2)` / `Math.max(0, 1, 1-y1, 1-y2)` (bezier mode only).

### The seam (the boundary law — Q.WC1's, dressed up one layer)

```
  curve-MATH (cubic-bezier sample, named→bezier)  ── value.js / kf demo math (parseCSSValue — present)
        ▲
        │  normalized (x,y) v-model
  DemoControlPoint  (the Q.WC1 handle, critically damped)  ── kf DEMO component over LIGHT drag2D
        ▲
        │  per-axis CTM (preserveAspectRatio="none" → non-uniform scale decouples cleanly)
  drag2D  (pointer-capture, spring follow)         ── kf LIGHT (src/animation/drag-2d.ts), ZERO value.js edge
        │
        ▲
        │  glass tokens (--trace / --trace-glow specular)
  glass  (handle + ghost polish)                   ── glass-ui published @mkbabb/glass-ui/styles CSS (NO component import)
```

Q.WC2 writes only the **demo** layer (`demo/easing/`, `demo/@/components/custom/`) + the gate (`scripts/`) — inv-16 holds, NO library source, NO sibling publish.

### Audit evidence

| Ref | Source location | Fact (verified 2026-06-23) |
|-----|-----------------|------------------------------|
| hero read-only | `demo/easing/EasingHeroStage.vue:54,210` | the projected curve is `aria-hidden="true"` + `pointer-events: none` — un-editable |
| hero non-uniform | `demo/easing/EasingHeroStage.vue:53` | `preserveAspectRatio="none"` — per-axis scale; the per-axis CTM decouples cleanly |
| hero path | `demo/easing/EasingHeroStage.vue:66` | renders `demo.svgPath.value` (y inverted) full-bleed — the live-drag observable host |
| diagonal ref only | `EasingCurveCanvas.vue` | the `f(t)=t` diagonal is the ONLY reference; no named-curve ghost |
| read-only readout | `EasingSidebar.vue` | the `(x1,y1,x2,y2)` readout is display-only, never an input (the impl drive's +184-line telemetry block) |
| named→bezier | `demo/easing/useEasingDemo.ts` | editing a named curve switches it to `cubic-bezier`; `parseCSSValue` resolves named/bezier/steps |
| painter discipline | `demo/easing/useEasingDemo.ts` (`registerDotPainter`) | the hot path is already off the Vue render graph — the design layer must not regress it |
| live precedent | `scripts/proof-easing-editor-live.mjs:38-44` | a `page.mouse` drag over `.control-point.handle` asserting the bezier `d` mutates + the subject re-animates — the live-drag harness this wave's hero clause mirrors |
| Q.WC1 substrate | `demo/@/components/custom/DemoControlPoint.vue` (NEW at Q.WC1) + `scripts/proof-demo-control-point.mjs` | the built handle + its live-drag gate — Q.WC2 extends, never re-authors, this gate |

---

## Scope

Each S-clause is a concrete, falsifiable deliverable. **S1** promotes the editor onto the HERO stage (the highest-leverage gap) + folds the closed-form viewBox clamp. **S2** adds the comparison-DIFF ghost (so `f(t)=` reads as a delta). **S3** adds fine/coarse keyboard + a writable numeric readout (precision authoring). **S4** authors the born-RED `proof:easing-curve-editor` over the REAL hero-drag observable (an APPEARANCE/INTERACTION-axis assertion, not a grep). Every move is the design layer over Q.WC1's built handle — NONE a sibling wait, NONE a workaround, NONE a re-build of Q.WC1. (The critically-damped construction itself is Q.WC1's S1 — Q.WC2 inherits it, it does not re-spec it.)

---

### S1 — Promote the editor onto the HERO stage + fold the closed-form viewBox clamp (the highest-leverage gap)

**Breach.** The headline hero curve is read-only (`EasingHeroStage.vue:54` `aria-hidden` + `:210` `pointer-events: none`); you edit in a ~300px sidebar while the big ball moves elsewhere — the single highest-leverage demo improvement and the natural home for `DemoControlPoint` (`B5-kf-demo-arch`). Separately, the sidebar canvas recomputes the viewBox by sampling the fn 17× per pointermove — a numeric proxy for a bound the cubic-bezier convex-hull gives in closed form.

**Cure.**

1. **Promote** two `<DemoControlPoint v-model>` handles onto the HERO projection (`EasingHeroStage.vue:66` already renders the live `demo.svgPath` full-bleed) bound to the demo's bezier control points. The hero curve becomes **directly draggable** — grab the curve where it is largest, watch the ball's traversal re-time in real time. The `preserveAspectRatio="none"` non-uniform scale (`:53`) decouples cleanly through the per-axis CTM (each `DemoControlPoint` axis maps client-px→curve-`[0,1]` against the hero SVG's `getScreenCTM()`, x and y independently — exactly the per-axis-scalar `drag2D.transform` contract). **De-decorate the handle layer ONLY**: drop `aria-hidden`/`pointer-events:none` on the handle layer (the trace path stays decorative); the handles carry the Q.WC1 a11y (focusable, `role="slider"`, arrow-nudge).
2. **Dual-host invariant.** The sidebar `EasingCurveCanvas` editor stays (small-form authoring + the in-panel host) — both hosts share the SAME bezier model, so a hero drag and a sidebar drag are the SAME edit. The hero is the *primary* edit surface; the sidebar is the *precision* surface (S3's numeric readout lives there).
3. **Fold the closed-form viewBox clamp (bezier mode)**: replace the 17-sample scan (`EasingCurveCanvas.vue:209-228`) with the analytic bound `Math.min(0, 1, 1-y1, 1-y2)` / `Math.max(0, 1, 1-y1, 1-y2)` (SVG y-domain; the cubic-bezier convex-hull is exact for the displayed PATH, and TIGHTER than 17 samples) **WHEN the active easing resolves to a cubic-bezier** (`cubic-bezier` + named-bezier modes, `controlPointsSvg` present); for the `steps()` mode the bound is the trivial `[0,1]` (a bounded staircase, no overshoot, `controlPointsSvg` undefined). Keeps `proof:easing-canvas-bounded` green. KISS, and it eliminates 17 fn-evals per pointermove during a bezier drag.

**Constraint (no-regress — the painter discipline).** Promoting handles to the hero must NOT pull the hot painter path back onto the Vue render graph — the dot painters stay imperative (`useEasingDemo.ts registerDotPainter`); the `DemoControlPoint` emit drives the bezier model (a few-Hz reactive edit during drag), not a 60Hz render write. The hero handles ride the same `body.is-dragging` select-suppression seam Q.WC1 wires.

**Gate bite (S4 coverage).** `proof:easing-curve-editor` `hero-editable` clause: navigate `#/easing`, assert ≥2 draggable handles exist ON the hero stage element (not only the sidebar), then a real drag of a hero handle re-shapes the hero curve `d` AND re-times the subject ball. Today: the hero is `pointer-events:none` → no draggable handle on it → red.

---

### S2 — The comparison-DIFF ghost: make `f(t)=` read as a delta from the named curve

**Breach.** When a user edits a named curve into custom (`useEasingDemo.ts` switches name→cubic-bezier), the reference vanishes — only the `f(t)=t` diagonal remains. You see an absolute curve, not how far you pulled from `ease-out`. Editing is illegible without a baseline.

**Cure.** When the active curve was edited FROM a named easing into custom, render a second, ghosted `.bezier-path--ghost` path behind the edited one carrying the ORIGINAL named curve's `d` (the original bezier is already resolved — `useEasingDemo.ts:90,96-98` resolves named→cubic-bezier via `NAMED_EASING_BEZIER`; capture it at the name→custom transition). **This is DISTINCT from the existing stage-floor "ghost"** (`.easing-stage-curve`, `EasingHeroStage.vue:197-225`) — that one projects the LIVE curve at 8% opacity onto the stage floor; the NEW `.bezier-path--ghost` is a comparison reference (the PRE-edit named curve) rendered IN the editor canvas as a BEM modifier of the existing `.bezier-path` (`EasingCurveCanvas.vue:104,107` the path elements, `:384` the style rule). The ghost is a pure-additive static SVG path (one path, no per-frame cost), styled with a low-opacity `--trace`-family token (the editor already styles `.bezier-path` with the scope-local `--trace`/`--trace-glow` specular). Editing becomes legible: "the purple curve SHAPES the path; you pulled it THIS far from ease-out."

**Constraint (clarity, gate-against-clutter).** The ghost renders ONLY when an edit departed from a named curve (not for a from-scratch custom curve, where there is no baseline) — the gate (S4) asserts the ghost is ABSENT for a from-scratch custom curve and PRESENT after a named→custom edit, so the diff is never visual clutter. PRM: the ghost is static (no motion), so it carries through reduced-motion unchanged.

**Gate bite (S4 coverage).** `proof:easing-curve-editor` `diff-ghost` clause: select `ease-out`, drag a handle (forcing named→custom), assert a second `.bezier-path--ghost` path with the ORIGINAL `ease-out` `d` is present; then reset to a from-scratch custom curve and assert NO ghost. Today: no ghost path exists at all → red.

---

### S3 — Fine/coarse keyboard + a writable numeric readout (precision authoring)

**Breach.** Q.WC1's `keyboard-operable` clause gives a single arrow-nudge step; the `(x1,y1,x2,y2)` readout is read-only (`EasingSidebar.vue`). A designer cannot nudge fine vs coarse NOR type an exact curve — yet `parseCSSValue` already resolves `cubic-bezier(...)`/named/steps (`useEasingDemo.ts`); the path exists, the readout just never feeds back.

**Cure.**

1. **Fine/coarse keyboard nudge** on the focused `DemoControlPoint`: `ArrowKey` = coarse (0.01), `Shift+ArrowKey` = fine (0.001). This EXTENDS Q.WC1's single-step `keyboard-operable` (it does not replace it) — the handle stays focusable + `role="slider"` with the per-axis `aria-valuenow` updating on nudge.
2. **Writable numeric readout**: make the `EasingSidebar.vue` readout an editable `(x1,y1,x2,y2)` input (or a full `cubic-bezier(...)` text field) that round-trips through `parseCSSValue` back into the bezier model. Type `cubic-bezier(.17,.67,.83,.67)`, the curve + handles move; drag a handle, the readout updates. The numeric surface and the drag surface are two views of ONE model.

**Constraint (no-regress — round-trip parity).** The numeric input must round-trip: a value typed in, then read back from a drag-untouched handle, must serialize identically (no float drift in the display). The parse failure path (a malformed `cubic-bezier`) must NOT clobber the live curve — it holds the last-valid value (the `:user-invalid` form-validation idiom, not a crash). This is the same `parseCSSValue` fall-through the editor already uses.

**Gate bite (S4 coverage).** `proof:easing-curve-editor` `precision-author` clause: focus a handle, `Shift+ArrowRight`, assert `x` nudges by 0.001 (not 0.01); then type `cubic-bezier(.17,.67,.83,.67)` into the readout, assert the handles + the bezier `d` move to match. Today: the readout is read-only and only the coarse single-step nudge exists → red.

---

### S4 — `proof:easing-curve-editor` born-RED over the REAL hero-drag observable (the keystone — APPEARANCE/INTERACTION axis, NOT a grep)

**Breach.** No gate covers the curve-editor *design* layer (the hero edit, the ghost-diff, the precision authoring). Q.WC1's `proof:demo-control-point` covers the handle's existence + a sidebar live-drag + the no-overshoot + a single keyboard nudge — it does NOT cover the hero promotion, the diff-ghost, or the fine/coarse author path. Those are Q.WC2's design deltas and need their own born-RED gate over the REAL observable.

**Cure.** Author `scripts/proof-easing-curve-editor.mjs`, a **RUNTIME (interaction) gate** over the BUILT `dist/gh-pages/`, mirroring the `proof:easing-editor-live` / `proof:demo-control-point` harness (`scripts/lib/demo-driver.mjs` `withPage` + `navToScene`). Wire it into the `proof:correctness` roster (`package.json`, beside `proof:easing-editor-live` / `proof:demo-control-point`) — the BLOCKING runtime tier (a kf-side build-in over Q.WC1's handle, no sibling dependency, so it CAN be hard-gated). **CI-coverage wiring (mandatory):** also add an explicit `run: npm run proof:easing-curve-editor` step to the **demo-smoke** job in `.github/workflows/ci.yml` (per `proof:ci-coverage.mjs:198-209` — chain-membership alone reds the coverage gate). Three clauses, the keystone being `hero-editable`:

1. **`hero-editable`** (THE KEYSTONE — the APPEARANCE/INTERACTION-axis observable): navigate `#/easing`, assert ≥2 `DemoControlPoint` handles are present ON the hero stage element (NOT only the sidebar — a sidebar-only edit passes Q.WC1's gate but must RED this one), then drive a REAL `page.mouse.down → move → up` over one HERO handle and assert BOTH: (i) the hero bezier `d` mutated (`demo.svgPath` recomputes), AND (ii) the subject ball re-times (the sampled easing at a fixed `t` differs after the drag). BITE: a hero curve that only repaints but does not re-time the ball reds.
2. **`diff-ghost`** (the S2 clarity contract): select `ease-out`, drag a handle (named→custom), assert a `.bezier-path--ghost` with the original `ease-out` `d` is present; reset to a from-scratch custom curve, assert NO ghost. BITE: a permanently-present ghost (clutter) OR a never-present ghost both red.
3. **`precision-author`** (the S3 authoring contract): focus a handle, `Shift+ArrowRight`, assert `x` nudges by 0.001; type a `cubic-bezier(...)` into the readout, assert the handles + `d` match. BITE: a read-only readout or a coarse-only nudge reds.

**Constraint (observable-truth — the keystone).** The gate MUST bite the GENUINE defect, not a proxy. The proxy trap here is asserting only that a hero handle EXISTS (a `<DemoControlPoint>` rendered on the hero) — which a non-functional decorative handle would pass. The `hero-editable` clause forbids that: a hero handle that does not re-shape the curve AND re-time the ball reds. A green "handle present on hero" over a non-editing decoration must STILL red `hero-editable`. This is the inv-two-axis classification: a UI/interaction design refinement closes via a RUNTIME gate over the live observable, never a source-shape stand-in. **No gate-duplication:** the `hero-editable` clause must not re-implement Q.WC1's sidebar `live-drag` assertion — it asserts the HERO host specifically (a sidebar-only editor reds this gate while greening Q.WC1's).

**Gate bite.** `node scripts/proof-easing-curve-editor.mjs` → exit 1 today (the hero is read-only, no ghost, the readout is read-only — ALL absent). After S1–S3 land: every clause greens; `hero-editable` confirms a real HERO drag re-shapes the curve AND re-times the ball, `diff-ghost` confirms the named-curve reference, `precision-author` confirms the fine-nudge + numeric round-trip.

---

## Born-RED gate

**Gate:** `proof:easing-curve-editor` (NEW — `scripts/proof-easing-curve-editor.mjs`; this wave authors it) — born-RED over three clauses, the keystone being `hero-editable` (the REAL runtime APPEARANCE/INTERACTION-axis observable: a HERO-stage handle drag re-shapes the curve AND re-times the subject ball). It **extends** (does not duplicate) Q.WC1's `proof:demo-control-point` (which covers the handle's existence + a sidebar live-drag + the no-overshoot + a single keyboard nudge).

**The REAL observable (observable-truth).** Each clause bites the GENUINE defect, witnessed born-RED on today's tree — NOT a proxy:

| Gate / clause | Witness on today's tree | Failure mode today (the REAL observable) | Expected after the design layer |
|---|---|---|---|
| `hero-editable` (**KEYSTONE**) | `#/easing` + `page.mouse.down→move→up` over a HERO handle | the hero curve is `aria-hidden`+`pointer-events:none` (`EasingHeroStage.vue:54,210`) — NO draggable handle on the hero; the only editor is the ~300px sidebar | ≥2 draggable `DemoControlPoint` handles on the hero stage; a real hero drag mutates `demo.svgPath` AND re-times the ball |
| `diff-ghost` | select `ease-out`, drag, grep the pseudo-tree for `.bezier-path--ghost` | only the `f(t)=t` diagonal exists; no named-curve reference | a `.bezier-path--ghost` with the original `ease-out` `d` present on a named→custom edit, ABSENT on a from-scratch custom |
| `precision-author` | focus a handle, `Shift+ArrowRight`; type into the readout | the readout is read-only (`EasingSidebar.vue`); only a coarse single-step nudge exists | `Shift+Arrow` nudges 0.001 (fine); a typed `cubic-bezier(...)` moves the handles + `d` |

**Born-RED kf-side TODAY (the keystone).** Verified this session: the hero curve is `pointer-events:none`/`aria-hidden` (`EasingHeroStage.vue:54,210`) so NO hero-stage handle is draggable; no `.bezier-path--ghost` exists (only the diagonal); the readout is read-only (the impl drive's +184-line telemetry block). The `hero-editable` clause's RED is the GENUINE defect (you cannot edit the curve where it is largest), not a proxy.

**Plant-a-failure (born-RED proof).** Before the design layer: `proof:easing-curve-editor` exits 1 because the hero has no draggable handle (`hero-editable` reds), no ghost exists (`diff-ghost` reds), and the readout is read-only (`precision-author` reds). The dual born-RED structure: even if a future stub renders a decorative `<DemoControlPoint>` on the hero that greens a name-only presence check, the `hero-editable` clause STILL reds (the decoration does not re-shape the curve OR re-time the ball) — the gate NEVER false-greens on a name-only proxy.

**Green condition.** The editor promoted onto the hero + the closed-form viewBox folded (S1), the comparison-DIFF ghost wired (S2), the fine/coarse keyboard + writable numeric readout (S3), `proof:easing-curve-editor` three clauses GREEN incl. a live HERO drag re-shaping the curve AND re-timing the ball (S4). The easing scene becomes the demo's headline direct-manipulation INSTRUMENT — grab the curve, watch the ball re-time — closing the substituted-headline finding (`B5-kf-demo-arch`).

---

## Dependencies

- **Q.WC1 `DemoControlPoint` — the substrate (the DAG edge `Q.WC1 → Q.WC2`). HARD PRECONDITION.** Q.WC2 dresses the handle Q.WC1 builds + consolidates; it does NOT re-build it. Both `DemoControlPoint.vue` AND `scripts/proof-demo-control-point.mjs` are ABSENT on today's tree; Q.WC2 CANNOT be authorized until Q.WC1 implements them. If Q.WC1 is not yet implemented, Q.WC2's clauses red on the absent handle. This is a NOW→NOW intra-repo sequence, NOT a sibling publish gate. The born-RED gate is a genuine non-duplicative superset of `proof:demo-control-point` — but it opens only after Q.WC1 lands.
- **LIGHT `drag2D` `springOptions` pass-through (CONFIRMED PRESENT, consumed by Q.WC1).** `drag.ts:56→:169` — the critically-damped construction is Q.WC1's; Q.WC2 inherits it. No library edit.
- **glass-ui published `@mkbabb/glass-ui/styles` tokens — already a demo dep.** The `--trace`/`--trace-glow` specular for the handle + ghost is CSS; NO new glass-ui component import, NO new peer obligation (inv-16).
- **`parseCSSValue` — present (the S3 numeric round-trip).** `useEasingDemo.ts` already resolves named/bezier/steps; the writable readout reuses it. No value.js publish dep.
- **Independent of every other Band-C wave** (Q.WC3 mobile/N-Stage, Q.WC4 MorphSVG scene, Q.WC5 amiga) and of every engine-perf / correctness / consume wave. File surfaces: `demo/easing/EasingHeroStage.vue` (hero handles + de-decorate the handle layer), `demo/@/components/custom/EasingCurveCanvas.vue` (closed-form viewBox + ghost path), `demo/easing/EasingSidebar.vue` (writable readout), `demo/easing/useEasingDemo.ts` (named-curve capture for the ghost), `scripts/proof-easing-curve-editor.mjs` (NEW), `package.json` (gate roster), `.github/workflows/ci.yml` (the new-gate `npm run proof:easing-curve-editor` step in the demo-smoke job).
- **NO glass-ui publish dep, NO value.js publish dep, NO parse-that dep.** Pure-NOW Band-C — it fires entirely on today's installed tree atop Q.WC1's built handle.

---

## dev→impl boundary

This file is the Tranche Q DEVELOPMENT spec for Q.WC2 — DOCS ONLY. It writes zero engine/demo/library source (inv-16: kf writes only keyframes.js). The IMPLEMENTATION (the hero promotion + closed-form viewBox, the diff-ghost, the precision authoring, the `proof:easing-curve-editor` authoring) opens only on the owner's explicit authorization, DAG-ordered AFTER Q.WC1 (both `DemoControlPoint.vue` and `scripts/proof-demo-control-point.mjs` are ABSENT today; the hard precondition is Q.WC1's landing). When it opens it is gate-first (S4 `proof:easing-curve-editor` authored born-RED BEFORE S1–S3 land), observable-truth (the `hero-editable` keystone over the real hero-drag re-timing the ball, an APPEARANCE/INTERACTION-axis assertion not a grep), no-legacy (no bespoke pointer handler re-introduced — the handle is Q.WC1's consolidated `drag2D` path), KISS (the closed-form viewBox replaces the 17-sample proxy; the numeric + drag are two views of one model), gestalt (ONE bezier model behind hero + sidebar + numeric), and P-invariant-28 (no new deferral — the whole substituted-headline finding closes here).

---

## Bite — what regression each clause catches

| Clause | Regression it prevents |
|--------|------------------------|
| S1 `hero-editable` | The headline curve stays read-only in a ~300px sidebar exile while the protagonist plate is a decorative `pointer-events:none` projection — the single highest-leverage demo improvement left unbuilt; the substituted-headline finding recurs |
| S1 closed-form viewBox | 17 fn-evals per pointermove persist as a numeric proxy for a bound the cubic-bezier convex-hull gives exactly (bezier mode); OR the convex-hull formula is mis-applied to a `steps()`/non-bezier easing where `controlPointsSvg` is undefined (a soundness break the scope-guard prevents) — a per-move perf + clarity regression (KISS violation) |
| S2 `diff-ghost` | Editing a named curve into custom loses all reference — `f(t)=` reads as an opaque absolute curve, not a legible delta from `ease-out` (the editor is illegible without a baseline) |
| S3 `precision-author` | The editor is drag-only + coarse-only — a designer cannot type an exact `cubic-bezier(...)` NOR fine-nudge, despite `parseCSSValue` already owning the path (a usability regression) |
| S4 keystone (no-duplication) | A sidebar-only edit greens Q.WC1's `live-drag` while the hero stays read-only — the gate that should bite the HERO host specifically is silently absent, so the headline promotion is never witnessed |

---

## Excluded from this wave

- **Re-building `DemoControlPoint` or the `EasingCurveCanvas` consolidation** — that is Q.WC1. Q.WC2 dresses the built handle; it does not author it.
- **The critically-damped construction itself** — that is Q.WC1's S1 (`springOptions:{dampingFraction:1}`). Q.WC2 inherits it; the `damped-no-overshoot` clause lives in Q.WC1's gate.
- **Editing the LIGHT library** (`src/animation/drag.ts` / `drag-2d.ts`) — the `springOptions` pass-through is probe-confirmed present; no library edit is needed (inv-16 holds as pure demo construction).
- **The unify-all-demo-drag-handles refactor** — a Q-LEDGER BOOK note WITHOUT a named-gate obligation (per the CONTRIVANCE-AUDIT SIMPLIFY verdict), recorded at Q.WC1, not built.
- **The N-Stage scene-switcher + mobile** — that is Q.WC3 (a SEPARATE Band-C wave over the `scene-stage` subtree). The MorphSVG scene is Q.WC4; the amiga refinements are Q.WC5.
