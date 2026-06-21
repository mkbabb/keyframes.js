# P.W7 — the frontend-design fleet, scene 3: the EASING curve-editor as the DemoControlPoint showcase

**Band:** C — the demo-frontend-design fleet (the 29-idea design pass; this wave is the **easing** scene's curve-editor UX over the O-built `DemoControlPoint`).
**Phase:** NOW — kf-internal, zero sibling dependency, executable on authorization. The curve-editor refinements ride glass-ui's *published* `@mkbabb/glass-ui/styles` tokens + kf's own LIGHT `drag2D` primitive (`src/animation/index.ts:88`) — NO glass-ui component publish, NO value.js publish, NO parse-that dep.
**Sequence:** `P.W1 apparatus (NOW) ─► O.W5 DemoControlPoint (the substrate) ─► C{P.W5 cube+amiga ‖ P.W6 square+spring ‖ P.W7 curve-editor (this wave) ‖ P.W8 N-Stage+mobile}` — the four Band-C waves are independent of each other. **P.W7 sequences ATOP O.W5**: O.W5 builds `DemoControlPoint.vue` over the LIGHT `drag2D` and consolidates the bespoke `useEasingCurveDrag.ts` onto it (`O/waves/O.W5.md:81-124`); P.W7 is the *design* layer over that built primitive — it does NOT re-build the handle, it makes the curve-editor it powers the demo's headline direct-manipulation instrument. (`P.md:137,163-164`; the DAG edge is `O.W5 → P.W7`, NOT a sibling gate.)
**Owning ideas:** the AUDIT-DIGEST **D5-easing** lane (`AUDIT-DIGEST.md:818-855`) + the **K4 / K5 demo-engine** dogfood framing (`AUDIT-DIGEST.md:564-567,625-628`) — the curve-editor UX (drag precision, snap, clarity), the hero-stage direct-edit promotion, the comparison-DIFF overlay, and the separable "unify all demo drag handles onto `drag2D`" follow-on. The frontend-design precept: distinctive direct-manipulation instrument, not a sidebar slider; usability/clarity/correctness above novelty.

This wave **sequences atop** O.W5 (the `DemoControlPoint` build-in + its `proof:demo-control-point` keystone) and L.W11's easing trace/self-draw delight. It does NOT re-do O.W5's consolidation; it closes the **D5 design gaps the O work does not touch** (the read-only hero, the un-tuned `drag2D` spring ring, the absent comparison reference, the read-only numeric readout), and it adds the precision-authoring layer (critically-damped drag, snap, keyboard fine/coarse, ghost-diff) that turns the editor from a sidebar widget into the demo's protagonist instrument. Every refinement is grounded in a verified `file:line` from the digest.

---

## Context

### What O.W5 already builds (the substrate this wave dresses)

O.W5 (NOW, no sibling gate) lands four things this wave assumes present (`O/waves/O.W5.md:76-124`):

| O.W5 deliverable | file | Shape P.W7 builds on |
|---|---|---|
| `DemoControlPoint.vue` | `demo/@/components/custom/DemoControlPoint.vue` (NEW at O.W5) | a curve-editor handle over the LIGHT `drag2D` — renders an SVG `<circle>` + optional control-line, binds `drag2D(handleEl, {x,y})`, emits a normalized `(x,y)` via `update:modelValue`, constrains via per-axis `DragOptions.transform`/`bounds` (`O.W5.md:85-90`) |
| `EasingCurveCanvas` consolidation | `demo/@/components/custom/EasingCurveCanvas.vue` | the two bespoke `<circle class="control-point handle">` (`:114-128`) replaced by two `<DemoControlPoint v-model>` instances; `useEasingCurveDrag.ts` DELETED (`O.W5.md:99-107`) |
| `proof:demo-control-point` | `scripts/proof-demo-control-point.mjs` (NEW at O.W5) | the live-drag keystone (`live-drag` clause: a real `page.mouse.down→move→up` re-shapes the bezier `d` AND the sampled easing-at-fixed-`t` differs) + a `keyboard-operable` arrow-nudge clause (`O.W5.md:115-124`) |
| DM-2 terminal record | `docs/tranches/O/PROGRESS.md` | the 7-tranche chronic EXITS as a build-in/WITHDRAWN terminal (`O.W5.md:128-144`) |

So the handle, its consolidation, and its live-drag gate are O.W5's. **P.W7 owns the UX one layer up**: where the editor lives (hero vs sidebar), how the drag *feels* (the spring ring), what `f(t)=` means (the ghost reference), and how a designer authors precisely (keyboard fine/coarse + numeric).

### The D5 design gaps the re-audit found still open (verified `file:line`)

The easing scene is "the demo's headline interactive surface and is genuinely well-built" (`AUDIT-DIGEST.md:818`) — but D5 names four load-bearing UX holes the O work does not confront:

| Gap | Source location | The defect (verified 2026-06-20) |
|---|---|---|
| **drag2D default spring RINGS** (a curve-editor precision regression) | `src/animation/drag.ts:234` (`this.spring.subscribe((v,vel)=>this.emit(...))`) + `src/animation/spring.ts:108-109` (default `dampingFraction: 0.86`, under-damped) | a bezier handle released mid-drag would **overshoot past where the user dropped it** — the exact opposite of the bespoke smoothing O.W5's consolidation replaces. A curve editor must land EXACTLY on the release point. (`AUDIT-DIGEST.md:824-826`, flagged a **BLOCKER for O.W5 impl**.) |
| **the HERO stage is read-only** | `demo/easing/EasingHeroStage.vue:48-68` renders the projected curve `aria-hidden="true"` with `pointer-events:none` (`:208`); the editable canvas is exiled to the sidebar at `clamp(260px,64cqi,360px)` (`EasingSidebar`) | you cannot edit the curve where it is largest — you edit in a ~300px sidebar while a separate big ball moves. The single highest-leverage demo improvement. (`AUDIT-DIGEST.md:827-829`.) |
| **no comparison reference** — `f(t)=` is opaque | `EasingCurveCanvas.vue:38` draws only the `f(t)=t` diagonal-ref; no ghost of the *named* curve the custom edit departed from | editing a named curve into custom (`useEasingDemo.ts:328-330` switches name→cubic-bezier) loses the reference — you see an absolute curve, not how far you pulled from `ease-out`. (`AUDIT-DIGEST.md:837-840`.) |
| **read-only numeric + coarse-only keyboard** | the readout at `EasingSidebar.vue:123-131` is read-only; O.W5's `keyboard-operable` clause gives a single arrow-nudge step (`O.W5.md:120`) | designers cannot type exact `(x1,y1,x2,y2)` NOR nudge fine vs coarse — the `parseCSSValue` path already exists (`useEasingDemo.ts:337-371`) but the readout never feeds it back. (`AUDIT-DIGEST.md:849-852`.) |

### The two correctness deltas the digest also surfaces (folded in, not separate)

- **the 17-sample viewBox overshoot scan is a numeric proxy** — `EasingCurveCanvas.vue:217-226` samples the fn 17× to find y-extrema; for a cubic bezier the displayed PATH's y-extrema are exactly `min(0,1,y1,y2)`/`max(0,1,y1,y2)` (the convex-hull property), so 17 fn-evals per pointermove are replaceable by a closed-form clamp (`AUDIT-DIGEST.md:841-844`). This is KISS + a per-move perf win, folded into S2 (the editor consolidation already touches the viewBox).
- **the per-axis CTM caveat** D5 flags on O.W5's `transform` claim — `drag2D.transform` is a **per-axis SCALAR** map, and the hero stage uses `preserveAspectRatio="none"` (`EasingHeroStage.vue:54`), i.e. NON-uniform scale; the per-axis CTM decouples cleanly (no shared-scale assumption) — exactly why two one-axis `Draggable`s (`drag-2d.ts`) is the right substrate (`AUDIT-DIGEST.md:835,853`). This is a precondition note, not a new gap.

### The seam (the boundary law — unchanged from O.W5, dressed up one layer)

```
  curve-MATH (cubic-bezier sample, named→bezier)  ── value.js / kf demo math (parseCSSValue — present)
        ▲
        │  normalized (x,y) v-model
  DemoControlPoint  (the O.W5 handle)             ── kf DEMO component over LIGHT drag2D
        ▲
        │  springOptions:{dampingFraction:1}  ← P.W7's tuning (the precision fix)
  drag2D  (pointer-capture, spring follow)        ── kf LIGHT (src/animation/drag-2d.ts) — ZERO value.js edge
        ▲
        │  glass tokens (--trace / --trace-glow specular)
  glass  (handle polish)                          ── glass-ui published @mkbabb/glass-ui/styles CSS (NO component import)
```

P.W7 writes only the **demo** layer (`demo/easing/`, `demo/@/components/custom/`) + the gate (`scripts/`) — inv-16 holds, NO library source, NO sibling publish. The one library-shaped fact P.W7 *uses* (not writes) is that `drag2D` forwards a `springOptions` through to its per-axis `Draggable`'s `SpringProgress`; if that pass-through is absent on the installed library, the precision fix is a **born-RED handoff to O.W5's impl** (the S1 clause names it) — NOT a P.W7 library edit.

### Audit evidence

| Ref | Source location | Fact (verified 2026-06-20) |
|-----|-----------------|------------------------------|
| ring-risk | `src/animation/drag.ts:234` + `src/animation/spring.ts:108-109` | `drag2D` emits off the rAF spring settle; default `dampingFraction: 0.86` is under-damped → overshoot past the release point |
| critically-damped | `src/animation/spring.ts:31` | `dampingFraction: 1` = critically damped, NO overshoot — the curve-editor-correct spring |
| hero read-only | `demo/easing/EasingHeroStage.vue:48-68,208` | the projected curve is `aria-hidden="true"` + `pointer-events:none` — un-editable |
| hero non-uniform | `demo/easing/EasingHeroStage.vue:54` | `preserveAspectRatio="none"` — per-axis scale; the per-axis CTM decouples cleanly |
| sidebar editor | `demo/@/components/custom/EasingCurveCanvas.vue:110-135` | the editable canvas (`editable && controlPointsSvg`) renders the two handles + traveling dot |
| bezier path | `EasingCurveCanvas.vue:198-202` (`bezierPathD`) | `M 0 1 C c1 c2, 1 0` recomputed from `controlPointsSvg` — the live-drag observable |
| viewBox 17-sample | `EasingCurveCanvas.vue:217-226` | samples the fn 17× per recompute to find y-extrema (the numeric-proxy overshoot scan) |
| diagonal ref only | `EasingCurveCanvas.vue:38` | the `f(t)=t` diagonal is the ONLY reference; no named-curve ghost |
| named→bezier | `demo/easing/useEasingDemo.ts:328-330,337-371` | editing a named curve switches it to `cubic-bezier`; `parseCSSValue` resolves named/bezier/steps |
| read-only readout | `demo/easing/EasingSidebar.vue:123-131` | the `(x1,y1,x2,y2)` readout is display-only, never an input |
| painter discipline | `demo/easing/useEasingDemo.ts:189-228` (`registerDotPainter`) | the hot path is already off the Vue render graph — the design layer must not regress it |
| live precedent | `scripts/proof-easing-editor-live.mjs:38-44` | a `page.mouse` drag over `.control-point.handle` asserting the bezier `d` mutates + the subject re-animates — the live-drag harness shape this wave's hero clause mirrors |
| substrate | `src/animation/index.ts:88` + `src/animation/drag-2d.ts:22-46` | LIGHT `drag2D` + `Drag2DHandle` ({x,y}, velocity, settled, subscribe, dispose) — the O.W5 substrate, present today |
| O.W5 keystone | `O/waves/O.W5.md:115-124` | `proof:demo-control-point` `live-drag` + `keyboard-operable` clauses — P.W7 extends, never re-authors, this gate |

---

## Scope

Each S-clause is a concrete, falsifiable deliverable. **S1** tunes the `DemoControlPoint` drag to critically-damped (the D5 BLOCKER — a curve handle must not ring). **S2** promotes the editor onto the HERO stage (the highest-leverage gap) + folds the closed-form viewBox clamp. **S3** adds the comparison-DIFF ghost (so `f(t)=` reads as a delta). **S4** adds fine/coarse keyboard + a writable numeric readout (precision authoring). **S5** authors the born-RED `proof:easing-curve-editor` over the REAL hero-drag observable + records the separable "unify all drag handles on `drag2D`" follow-on. Every move is the design layer over O.W5's built handle — NONE a sibling wait, NONE a workaround, NONE a re-build of O.W5.

---

### S1 — Critically-damp the `DemoControlPoint` drag (the D5 BLOCKER — a curve handle must not ring)

**Breach.** `drag2D`'s default spring is under-damped (`spring.ts:108-109` `dampingFraction: 0.86`) and the handle emits off the spring settle (`drag.ts:234`). A bezier control point released mid-drag would **overshoot past the drop point** before settling back — a precision regression for a curve editor (`AUDIT-DIGEST.md:824-826`, named a BLOCKER for O.W5 impl). The bespoke `useEasingCurveDrag.ts` O.W5 deletes did NOT ring (it tracked the pointer directly); the consolidation must not introduce ringing it never had.

**Cure.** `DemoControlPoint.vue` constructs `drag2D` with a **critically-damped** spring: pass `springOptions: { dampingFraction: 1 }` (`spring.ts:31` — no overshoot) per axis — OR a near-instant `response` if the editor wants a touch of follow-lag without overshoot. The control point tracks the pointer 1:1 while down (the live target is pointer-pinned — `drag-2d.ts:30-33`) and lands EXACTLY on the release point on settle (no ring-back). This is the curve-editor's correctness contract: where you drop the handle is the curve you authored.

**Constraint (precondition — the inv-16 fence).** This requires `drag2D` to forward a `springOptions` (or per-axis `DragOptions.springOptions`) through to its `Draggable`'s `SpringProgress`. If the installed LIGHT library already forwards it (verify: `grep -n "springOptions\|SpringProgress" src/animation/drag.ts src/animation/drag-2d.ts`), S1 is a pure demo-construction change (the component passes the option). If it does NOT, the forward is a **library-shaped need** — a born-RED HANDOFF to O.W5's impl (a one-line `DragOptions.springOptions` pass-through in `drag.ts`), NOT a P.W7 library edit (inv-16). The gate's `damped-no-overshoot` clause (S5) reds either way until the option lands; the handoff is recorded, not silently absorbed.

**Gate bite (S5 coverage).** `proof:easing-curve-editor` `damped-no-overshoot` clause: drag a handle to a measured offset, release, sample the bound `(x,y)` over the settle window, assert it is **monotonic to the release value** (no sample exceeds the release-point coordinate by > a tight epsilon). Today: the default-spring handle overshoots → red. After the critically-damped construction: green.

---

### S2 — Promote the editor onto the HERO stage + fold the closed-form viewBox clamp (the highest-leverage gap)

**Breach.** The headline hero curve is read-only (`EasingHeroStage.vue:48-68` `aria-hidden` + `pointer-events:none` at `:208`); you edit in a ~300px sidebar while the big ball moves elsewhere. "This is the single highest-leverage demo improvement and the natural home for `DemoControlPoint`" (`AUDIT-DIGEST.md:827-829`). Separately, the sidebar canvas recomputes the viewBox by sampling the fn 17× per pointermove (`EasingCurveCanvas.vue:217-226`) — a numeric proxy for a bound the cubic-bezier convex-hull gives in closed form.

**Cure.**

1. **Promote** two `<DemoControlPoint v-model>` handles onto the HERO projection (`EasingHeroStage.vue:63-68` already renders the live `demo.svgPath` full-bleed) bound to `demo.bezierControlPoints`. The hero curve becomes **directly draggable** — grab the curve where it is largest, watch the ball's traversal re-time in real time. The `preserveAspectRatio="none"` non-uniform scale (`:54`) decouples cleanly through the per-axis CTM (each `DemoControlPoint` axis maps client-px→curve-`[0,1]` against the hero SVG's `getScreenCTM()`, x and y independently — exactly the per-axis-scalar `drag2D.transform` contract, `AUDIT-DIGEST.md:835`). The hero loses `aria-hidden`/`pointer-events:none` on the handle layer ONLY (the trace path stays decorative); the handles carry the O.W5 a11y (focusable, `role="slider"`, arrow-nudge).
2. **Dual-host invariant.** The sidebar `EasingCurveCanvas` editor stays (small-form authoring + the in-panel `TimingFunctionPanel` host) — both hosts share the SAME `demo.bezierControlPoints` model, so a hero drag and a sidebar drag are the SAME edit (`AUDIT-DIGEST.md:854` — the gate must exercise both hosts or rely on the shared canvas). The hero is the *primary* edit surface; the sidebar is the *precision* surface (S4's numeric readout lives there).
3. **Fold the closed-form viewBox clamp** (`AUDIT-DIGEST.md:841-844`): replace the 17-sample scan (`EasingCurveCanvas.vue:217-226`) with the analytic bound `Math.min(0, 1, y1, y2)` / `Math.max(0, 1, y1, y2)` (the cubic-bezier convex-hull is exact for the displayed PATH, and TIGHTER than 17 samples) — KISS, and it eliminates 17 fn-evals per pointermove during a drag.

**Constraint (no-regress — the painter discipline).** Promoting handles to the hero must NOT pull the hot painter path back onto the Vue render graph — the dot painters stay imperative (`useEasingDemo.ts:189-228`); the `DemoControlPoint` emit drives `bezierControlPoints` (a few-Hz reactive edit during drag), not a 60Hz render write. The hero handles ride the same `body.is-dragging` select-suppression seam O.W5 wires (`O.W5.md:103`).

**Gate bite (S5 coverage).** `proof:easing-curve-editor` `hero-editable` clause: navigate `#/easing` (singular mode), assert ≥2 draggable handles exist ON the hero stage element (not only the sidebar), then a real drag of a hero handle re-shapes the hero curve `d` AND re-times the subject ball. Today: the hero is `pointer-events:none` → no draggable handle on it → red.

---

### S3 — The comparison-DIFF ghost: make `f(t)=` read as a delta from the named curve

**Breach.** When a user edits a named curve into custom (`useEasingDemo.ts:328-330` switches name→cubic-bezier), the reference vanishes — only the `f(t)=t` diagonal remains (`EasingCurveCanvas.vue:38`). You see an absolute curve, not how far you pulled from `ease-out` (`AUDIT-DIGEST.md:837-840`). Editing is illegible without a baseline.

**Cure.** When the active curve was edited FROM a named easing into custom, render a second, ghosted `.bezier-path--ghost` path behind the edited one carrying the ORIGINAL named curve's `d` (the original bezier is already resolved — `useEasingDemo.ts` resolves named→cubic-bezier; capture it at the name→custom transition). The ghost is a pure-additive static SVG path (one path, no per-frame cost — `AUDIT-DIGEST.md:839`), styled with a low-opacity `--trace`-family token (the editor already styles `.bezier-path` with the scope-local `--trace`/`--trace-glow` specular — `EasingHeroStage.vue:208+`, `EasingCurveCanvas.vue:414-443`). Editing becomes legible: "the purple curve SHAPES the path; you pulled it THIS far from ease-out."

**Constraint (clarity, gate-against-clutter).** The ghost renders ONLY when an edit departed from a named curve (not for a from-scratch custom curve, where there is no baseline) — the gate (S5) asserts the ghost is ABSENT for a from-scratch custom curve and PRESENT after a named→custom edit, so the diff is never visual clutter. PRM: the ghost is static (no motion), so it carries through reduced-motion unchanged.

**Gate bite (S5 coverage).** `proof:easing-curve-editor` `diff-ghost` clause: select `ease-out`, drag a handle (forcing named→custom), assert a second `.bezier-path--ghost` path with the ORIGINAL `ease-out` `d` is present; then reset to a from-scratch custom curve and assert NO ghost. Today: no ghost path exists at all → red.

---

### S4 — Fine/coarse keyboard + a writable numeric readout (precision authoring)

**Breach.** O.W5's `keyboard-operable` clause gives a single arrow-nudge step (`O.W5.md:120`); the `(x1,y1,x2,y2)` readout is read-only (`EasingSidebar.vue:123-131`). A designer cannot nudge fine vs coarse NOR type an exact curve — yet `parseCSSValue` already resolves `cubic-bezier(...)`/named/steps (`useEasingDemo.ts:337-371`); the path exists, the readout just never feeds back (`AUDIT-DIGEST.md:849-852`).

**Cure.**

1. **Fine/coarse keyboard nudge** on the focused `DemoControlPoint`: `ArrowKey` = coarse (0.01), `Shift+ArrowKey` = fine (0.001). This EXTENDS O.W5's single-step `keyboard-operable` (it does not replace it) — the handle stays focusable + `role="slider"` with the per-axis `aria-valuenow` updating on nudge.
2. **Writable numeric readout**: make the `EasingSidebar.vue:123-131` readout an editable `(x1,y1,x2,y2)` input (or a full `cubic-bezier(...)` text field) that round-trips through `parseCSSValue` (`useEasingDemo.ts:337-371`) back into `bezierControlPoints`. Type `cubic-bezier(.17,.67,.83,.67)`, the curve + handles move; drag a handle, the readout updates. The numeric surface and the drag surface are two views of ONE model.

**Constraint (no-regress — round-trip parity).** The numeric input must round-trip: a value typed in, then read back from a drag-untouched handle, must serialize identically (no float drift in the display). The parse failure path (a malformed `cubic-bezier`) must NOT clobber the live curve — it holds the last-valid value (the `:user-invalid` form-validation idiom, not a crash). This is the same `parseCSSValue` fall-through the editor already uses.

**Gate bite (S5 coverage).** `proof:easing-curve-editor` `precision-author` clause: focus a handle, `Shift+ArrowRight`, assert `x` nudges by 0.001 (not 0.01); then type `cubic-bezier(.17,.67,.83,.67)` into the readout, assert the handles + the bezier `d` move to match. Today: the readout is read-only and only the coarse single-step nudge exists → red.

---

### S5 — `proof:easing-curve-editor` born-RED over the REAL hero-drag observable + the unify-handles follow-on record

**Breach.** No gate covers the curve-editor *design* layer (the hero edit, the critically-damped drag, the ghost-diff, the precision authoring). O.W5's `proof:demo-control-point` covers the handle's existence + a sidebar live-drag + a single keyboard nudge (`O.W5.md:115-124`) — it does NOT cover the hero promotion, the no-overshoot precision, the diff-ghost, or the fine/coarse author path. Those are P.W7's design deltas and need their own born-RED gate over the REAL observable.

**Cure.** Author `scripts/proof-easing-curve-editor.mjs`, a **RUNTIME (interaction) gate** over the BUILT `dist/gh-pages/`, mirroring the `proof:easing-editor-live` / `proof:demo-control-point` harness (`scripts/lib/demo-driver.mjs` `withPage` + `navToScene`). Wire it into the `proof:correctness` roster (`package.json`, beside `proof:easing-editor-live` / `proof:demo-control-point`) — the BLOCKING runtime tier (it is a kf-side build-in over O.W5's handle, no sibling dependency, so it CAN be hard-gated). Four clauses, the keystone being `hero-editable`:

1. **`hero-editable`** (THE KEYSTONE — observable-truth): navigate `#/easing` singular mode, assert ≥2 `DemoControlPoint` handles are present ON the hero stage element (NOT only the sidebar — a sidebar-only edit passes O.W5's gate but must RED this one), then drive a REAL `page.mouse.down → move → up` over one HERO handle and assert BOTH: (i) the hero bezier `d` mutated (`bezierPathD` recomputes — `EasingCurveCanvas.vue:198-202`), AND (ii) the subject ball re-times (the sampled easing at a fixed `t` differs after the drag). BITE: a hero curve that only repaints but does not re-time the ball reds.
2. **`damped-no-overshoot`** (the S1 precision contract): drag a handle to a measured offset, release, sample the bound `(x,y)` across the settle window, assert it is monotonic to the release value (no overshoot past the drop point beyond a tight epsilon). BITE: the default under-damped `drag2D` spring overshoots → red (this is the clause that reds until S1's `springOptions:{dampingFraction:1}` lands — or, if the library pass-through is absent, until the O.W5-impl handoff lands).
3. **`diff-ghost`** (the S3 clarity contract): select `ease-out`, drag a handle (named→custom), assert a `.bezier-path--ghost` with the original `ease-out` `d` is present; reset to a from-scratch custom curve, assert NO ghost. BITE: a permanently-present ghost (clutter) OR a never-present ghost both red.
4. **`precision-author`** (the S4 authoring contract): focus a handle, `Shift+ArrowRight`, assert `x` nudges by 0.001; type a `cubic-bezier(...)` into the readout, assert the handles + `d` match. BITE: a read-only readout or a coarse-only nudge reds.

**Record the separable follow-on** (NOT built this wave — `O.W5.md:204` correctly EXCLUDES it, D5 re-affirms it as "a separate tranche"): the **unify-all-demo-drag-handles-onto-`drag2D`** refactor (timeline diamonds, motion-path anchors, sequence rows all ride bespoke per-surface `pointerToSVG`/hit-test composables over `useDragCapture`; `DemoControlPoint` generalizes to a `{transform, bounds}`-parameterized handle — `AUDIT-DIGEST.md:845-848`). Record it in `docs/tranches/P/PROGRESS.md` as a deferred **follow-on idea** with a NAMED future gate (`proof:drag-primitive-unified` — "ZERO bespoke `pointerToSVG`/hit-test composables remain") so it is a terminal-homed deferral, not an orphan. P.W7 does NOT build it: each surface has subtly different physics (frame-snap, unbounded, bounded) and conflating them now would be the opposite of KISS.

**Constraint (observable-truth — the keystone).** The gate MUST bite the GENUINE defect, not a proxy. The proxy trap here is asserting only that a hero handle EXISTS (a `<DemoControlPoint>` rendered on the hero) — which a non-functional decorative handle would pass. The `hero-editable` clause forbids that: a hero handle that does not re-shape the curve AND re-time the ball reds. A green "handle present on hero" over a non-editing decoration must STILL red `hero-editable`. This is the inv-two-axis classification: a UI/interaction design refinement closes via a RUNTIME gate over the live observable, never a source-shape stand-in.

**Gate bite.** `node scripts/proof-easing-curve-editor.mjs` → exit 1 today (the hero is read-only, the drag rings, no ghost, the readout is read-only — ALL absent). After S1–S4 land: every clause greens; the `hero-editable` clause confirms a real HERO handle drag re-shapes the curve AND re-times the ball, `damped-no-overshoot` confirms the handle lands on the drop point, `diff-ghost` confirms the named-curve reference, `precision-author` confirms the fine-nudge + numeric round-trip.

---

## Born-RED gate

**Gate:** `proof:easing-curve-editor` (NEW — `scripts/proof-easing-curve-editor.mjs`; this wave authors it) — born-RED over four clauses, the keystone being `hero-editable` (the REAL runtime observable: a HERO-stage handle drag re-shapes the curve AND re-times the subject ball). It **extends** (does not duplicate) O.W5's `proof:demo-control-point` (which covers the handle's existence + a sidebar live-drag + a single keyboard nudge).

**The REAL observable (observable-truth).** Each clause bites the GENUINE defect, witnessed born-RED on today's tree — NOT a proxy:

| Gate / clause | Witness on today's tree | Failure mode today (the REAL observable) | Expected after the design layer |
|---|---|---|---|
| `hero-editable` (**KEYSTONE**) | `#/easing` singular + `page.mouse.down→move→up` over a HERO handle | the hero curve is `aria-hidden`+`pointer-events:none` (`EasingHeroStage.vue:208`) — NO draggable handle on the hero; the only editor is the ~300px sidebar | ≥2 draggable `DemoControlPoint` handles on the hero stage; a real hero drag mutates `bezierPathD` AND re-times the ball |
| `damped-no-overshoot` | drag-release a handle, sample the settle window | `drag2D` default `dampingFraction: 0.86` (`spring.ts:108-109`) overshoots past the drop point | the bound `(x,y)` is monotonic to the release value (critically-damped, S1) |
| `diff-ghost` | select `ease-out`, drag, grep the pseudo-tree for `.bezier-path--ghost` | only the `f(t)=t` diagonal exists (`EasingCurveCanvas.vue:38`); no named-curve reference | a `.bezier-path--ghost` with the original `ease-out` `d` present on a named→custom edit, ABSENT on a from-scratch custom |
| `precision-author` | focus a handle, `Shift+ArrowRight`; type into the readout | the readout is read-only (`EasingSidebar.vue:123-131`); only a coarse single-step nudge exists | `Shift+Arrow` nudges 0.001 (fine); a typed `cubic-bezier(...)` moves the handles + `d` |
| unify-handles follow-on (no extra gate this wave) | `docs/tranches/P/PROGRESS.md` follow-on row | the radical "unify all drag handles on drag2D" idea has no terminal home | a recorded deferred follow-on with a NAMED future gate (`proof:drag-primitive-unified`) |

**Born-RED kf-side TODAY (the keystone).** Verified this session: the hero curve is `pointer-events:none`/`aria-hidden` (`EasingHeroStage.vue:208`) so NO hero-stage handle is draggable; `drag2D`'s default spring is under-damped (`spring.ts:108-109`); no `.bezier-path--ghost` exists (`EasingCurveCanvas.vue:38` draws only the diagonal); the readout is read-only (`EasingSidebar.vue:123-131`). The `hero-editable` clause's RED is the GENUINE defect (you cannot edit the curve where it is largest), not a proxy.

**Plant-a-failure (born-RED proof).** Before the design layer: `proof:easing-curve-editor` exits 1 because the hero has no draggable handle (`hero-editable` reds), the drag rings (`damped-no-overshoot` reds), no ghost exists (`diff-ghost` reds), and the readout is read-only (`precision-author` reds). The dual born-RED structure: even if a future stub renders a decorative `<DemoControlPoint>` on the hero that greens a name-only presence check, the `hero-editable` clause STILL reds (the decoration does not re-shape the curve OR re-time the ball) — the gate NEVER false-greens on a name-only proxy.

**Green condition.** The `DemoControlPoint` drag critically-damped (S1), the editor promoted onto the hero + the closed-form viewBox folded (S2), the comparison-DIFF ghost wired (S3), the fine/coarse keyboard + writable numeric readout (S4), `proof:easing-curve-editor` four clauses GREEN incl. a live HERO drag re-shaping the curve AND re-timing the ball (S5), and the unify-handles follow-on recorded with a named future gate. The easing scene becomes the demo's headline direct-manipulation INSTRUMENT — grab the curve, watch the ball re-time.

---

## Dependencies

- **O.W5 `DemoControlPoint` — the substrate (the DAG edge `O.W5 → P.W7`).** P.W7 dresses the handle O.W5 builds + consolidates; it does NOT re-build it. If O.W5 is not yet implemented, P.W7's clauses red on the absent handle (the same RED as O.W5's `proof:demo-control-point`). This is a NOW→NOW intra-repo sequence, NOT a sibling publish gate.
- **LIGHT `drag2D` `springOptions` pass-through (the S1 precondition).** The critically-damped fix needs `drag2D`/`DragOptions` to forward `springOptions` to the per-axis `SpringProgress`. If present on the installed library → pure demo construction. If absent → a born-RED HANDOFF to O.W5's impl (a one-line `drag.ts` pass-through), NOT a P.W7 library edit (inv-16). The `damped-no-overshoot` clause reds until the option lands.
- **glass-ui published `@mkbabb/glass-ui/styles` tokens — already a demo dep.** The `--trace`/`--trace-glow` specular for the handle + ghost is CSS (`EasingCurveCanvas.vue:414-443`); NO new glass-ui component import, NO new peer obligation (inv-16).
- **`parseCSSValue` — present (the S4 numeric round-trip).** `useEasingDemo.ts:337-371` already resolves named/bezier/steps; the writable readout reuses it. No value.js publish dep.
- **Independent of every other Band-C wave** (P.W5 cube/amiga, P.W6 square/spring, P.W8 N-Stage) and of the engine-perf (P.W2–P.W4) / correctness (P.W9) / consume (P.W12) waves. File surfaces: `demo/easing/EasingHeroStage.vue` (hero handles + de-decorate the handle layer), `demo/@/components/custom/EasingCurveCanvas.vue` (closed-form viewBox + ghost path), `demo/@/components/custom/DemoControlPoint.vue` (springOptions construction — O.W5's file, P.W7 sets the option), `demo/easing/EasingSidebar.vue` (writable readout), `demo/easing/useEasingDemo.ts` (named-curve capture for the ghost), `scripts/proof-easing-curve-editor.mjs` (NEW), `package.json` (gate roster), `docs/tranches/P/PROGRESS.md` (the unify-handles follow-on record). It BENEFITS from P.W1's portable-perf-gate infra (the viewBox fold is a per-move alloc/time win the apparatus can witness) but does not depend on it.
- **NO glass-ui publish dep, NO value.js publish dep, NO parse-that dep.** Pure-NOW Band-C — it fires entirely on today's installed tree atop O.W5's built handle.

---

## dev→impl boundary

This file is the Tranche P DEVELOPMENT spec for P.W7 — DOCS ONLY. It writes zero engine/demo/library source (inv-16: kf writes only keyframes.js; the one library-shaped need — the `drag2D` `springOptions` pass-through — is a born-RED HANDOFF to O.W5's impl, never a foreign-tree edit). The IMPLEMENTATION (the critically-damped construction, the hero promotion + closed-form viewBox, the diff-ghost, the precision authoring, the `proof:easing-curve-editor` authoring) opens only on the owner's explicit authorization, DAG-ordered AFTER O.W5. When it opens it is gate-first (S5 `proof:easing-curve-editor` authored born-RED BEFORE S1–S4 land), observable-truth (the `hero-editable` keystone over the real hero-drag re-timing the ball), no-legacy (no bespoke pointer handler re-introduced — the handle is O.W5's consolidated `drag2D` path), KISS (the closed-form viewBox replaces the 17-sample proxy; the numeric + drag are two views of one model), gestalt (ONE bezier model behind hero + sidebar + numeric; the unify-handles follow-on terminal-homed not orphaned), and P-invariant-28 (the separable drag-unification is a recorded deferral with a named future gate, never a bare carry).

---

## Bite — what regression each clause catches

| Clause | Regression it prevents |
|--------|------------------------|
| S1 `damped-no-overshoot` | The consolidated `drag2D` handle RINGS past the release point — a curve editor where the curve you authored is NOT where you dropped the handle (a precision regression the bespoke smoothing never had; the D5 BLOCKER) |
| S2 `hero-editable` | The headline curve stays read-only in a ~300px sidebar exile while the protagonist plate is a decorative `pointer-events:none` projection — the single highest-leverage demo improvement left unbuilt |
| S2 closed-form viewBox | 17 fn-evals per pointermove persist as a numeric proxy for a bound the cubic-bezier convex-hull gives exactly — a per-move perf + clarity regression (KISS violation) |
| S3 `diff-ghost` | Editing a named curve into custom loses all reference — `f(t)=` reads as an opaque absolute curve, not a legible delta from `ease-out` (the editor is illegible without a baseline) |
| S4 `precision-author` | The editor is drag-only + coarse-only — a designer cannot type an exact `cubic-bezier(...)` NOR fine-nudge, despite `parseCSSValue` already owning the path (a usability regression) |
| S5 unify-handles follow-on record | The radical "unify all demo drag handles on drag2D" idea rides as an orphan with no terminal home (P-inv-28: a deferral without a named future gate) |

---

## Excluded from this wave

- **Re-building `DemoControlPoint` or the `EasingCurveCanvas` consolidation** — that is O.W5 (`O.W5.md:81-124`). P.W7 dresses the built handle; it does not author it.
- **Editing the LIGHT library** (`src/animation/drag.ts` / `drag-2d.ts`) — the `springOptions` pass-through, IF absent on the installed library, is a born-RED HANDOFF to O.W5's impl (inv-16), NOT a P.W7 edit.
- **The unify-all-demo-drag-handles refactor** (`proof:drag-primitive-unified`) — a separable tranche (`O.W5.md:204`, `AUDIT-DIGEST.md:845-848`); recorded as a terminal-homed follow-on (S5), not built. Each surface (timeline frame-snap, motion-path unbounded, sequence-row) has distinct physics; conflating now violates KISS.
- **Promoting `DemoControlPoint` to a LIBRARY export** — out of scope (it is a kf-demo primitive over the existing LIGHT `drag2D`; a library control-point is a keyframes-vue concern, `O.W5.md:201`).
- **The N-Stage scene-switcher + mobile** — that is P.W8 (a SEPARATE Band-C wave over the `scene-stage` subtree + the N-prototype unshelf).
