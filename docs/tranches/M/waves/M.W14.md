# M.W14 — The terminal-belt handoff exits (P-invariant-28)

- **Band:** E · **Class:** DEV (docs); IMPL opens on explicit authorization. **Dep:**
  value.js **0.13.0** (already pinned `^0.13.0`) — `PathGeometry` + `getPointAtLength`
  are ALREADY PUBLISHED in the installed surface (verified live this session,
  `index.d.ts:50`). **NO sibling publish gates this wave.** This is the ABSOLUTE
  terminal-belt wave: three ≥4-tranche P-invariant-28 items (DL-L7 GlassControlPoint
  7-tranche, DL-L8 MorphSVG 7-tranche, DL-L9 packrat 6-tranche) EXIT here — build-in
  or named KILL — with NO 8th ride. The re-BOOK is CLOSED for all three since L.WZ.
- **Gate (born-RED, the keystone):** `proof:morphsvg-consume` (NEW — does NOT exist in
  `scripts/` today, verified: `ls scripts/proof-morphsvg*.mjs` → no matches). A build-in
  gate, NOT a sibling-consume gate: born-RED because `fromMorphSVG` is UNIMPLEMENTED in
  kf (the export is absent: `grep -rn "fromMorphSVG" src/animation/` → zero), NOT because
  the value.js API is absent (it is present — the inv-ε correction of viol-M5). The REAL
  observable (inv-M-observable-truth): a live morph over two `d` strings produces a frame
  count > 0 that ACTUALLY interpolates the sampled point-pairs — verified by running the
  built barrel, not by grepping the export name.
- **Companion dispositions (no new sibling gate):**
  - **DL-L9 packrat → KILL** (recorded in `M/PROGRESS.md §"Open deferrals"` as DM-4): the
    unsound id-only LR-grow tier has ZERO production consumers (value.js's grammar never
    calls `memoize()`); the KILL invariant is "no kf/value.js parser opts into the packrat
    LR-grow tier." No `proof:packrat-sound` is authored (it never existed — the L "gate-first
    BOOK" claim was an inv-ε over-claim, lane-28 §3); the KILL record IS the exit form.
  - **DL-L7 GlassControlPoint → build-in Option B** (DM-2): a `DemoControlPoint` Vue
    component in `demo/@/components/` over the LIGHT `Draggable`/`drag2D` primitive (NO new
    glass-ui import; the visual polish is glass-ui CSS tokens from `@mkbabb/glass-ui/styles`).
    `proof:control-point-live` (the RED-by-design glass-ui-publish tripwire) is RETIRED — its
    premise (glass-ui must ship the primitive) is killed by the build-in decision; a
    `proof:demo-control-point` born-RED build-in gate replaces it.

---

## Context

Three deferred items reach their **ABSOLUTE terminus** at M (P-invariant-28, `M.md:150-156`,
lane-28 §4): each has ridden ≥4 tranches as a bare HANDOFF whose tripwire NEVER fired, and the
re-BOOK option is CLOSED since the L.WZ close. P-invariant-28 forbids a fifth bare BOOK. The
32-lane re-audit (lane-25 §0, lane-28 §2) found that for ALL THREE, the sibling-gated framing
was either FACTUALLY WRONG (MorphSVG — the prerequisite is already published) or MOOT (packrat —
the defect is off every production path; GlassControlPoint — kf already owns the substrate). So
this wave EXITS each by the path the ground truth dictates, NONE waiting on a sibling publish.

### (a) DL-L8 MorphSVG — the build-in over the ALREADY-PUBLISHED `PathGeometry` (viol-M5 corrected)

The L deferred ledger (DLL-21) records the tripwire as "value.js `PathGeometry` absent at
0.13.0 — the full arc-length sampler is the VJ.W4 remainder." **This is a factual error**
(viol-M5, `M.md:140`; lane-25 §3, §6). Verified live this session against the INSTALLED
`@mkbabb/value.js@0.13.0`:

```
node_modules/@mkbabb/value.js/dist/index.d.ts:50:
  export { PathGeometry, getTotalLength, getPointAtLength } from './transform/path';
```

`PathGeometry` is a published, working, DOM-free arc-length sampler (the runtime alias `Jd`,
`dist/value.js:4948-4994`). Its `transform/path.d.ts` surface is RICHER than the lane noted —
it carries exactly the kernel `fromMorphSVG` needs:

| value.js 0.13.0 API (verified `dist/transform/path.d.ts`) | Shape | Use in `fromMorphSVG` |
|---|---|---|
| `new PathGeometry(d: string)` | parses `d` ONCE; builds the cumulative arc-length table at construction | one allocation per source/target path |
| `.totalLength: number` | read-only total arc-length | uniform-arc-length step size |
| `.getPointAtLength(length): Point` | `{x,y}` at absolute arc-length, clamped `[0,totalLength]` | sample a path at a step |
| `.getPointAtT(t): Point` | `{x,y}` at normalized `t ∈ [0,1]` of total length | the per-step uniform sample |
| `.sampleAtLength(length): PathSample` | `{x,y,angle}` — adds the tangent angle | reserved for orient-along-path (BOOK; not this wave) |
| module-level `getPointAtLength(d, length): Point` | parses on each call (the convenience form) | NOT used (we construct `PathGeometry` once and reuse) |

The kf-side `fromMorphSVG` is ABSENT (`grep -rn "fromMorphSVG" src/animation/` → zero;
`ls src/animation/morph-svg.ts` → no file). `motion-path.ts:17` records the OLD design decision
("the heavier SVG-geometry half — MorphSVG … — is value-domain geometry math, routed OUT to
value.js (VJ-F1) and BOOKED, NOT manufactured here") — but the value-domain half **shipped** in
value.js 0.13.0. The remaining gap is the kf-domain compositor: sample two paths at N uniform
arc-length intervals, lerp the per-step point-pairs, emit a `@keyframes` block. That is exactly
the `fromMotionPath`/`fromDrawSVG` HEAVY pattern (`motion-path.ts:105`, `draw-svg.ts:121`) — a
thin compositor over `CSSKeyframesAnimation` behind `loadAnimationEngine()`. **No new value.js
edge** beyond the engine it already composes (engine.ts already statically imports
`@mkbabb/value.js`); the barrel keeps it HEAVY (`proof:boundary` stays green).

`fromMorphSVG` is NOT `ElementMorph` (`morph.ts` / `test/morph.test.ts` — rect-to-rect transform
interpolation, a SEPARATE primitive). The new file is `src/animation/morph-svg.ts`; the new test
is `test/morph-svg.test.ts` (no name collision with the existing `test/morph.test.ts`).

### (b) DL-L9 packrat — the KILL (unsound id-only tier, ZERO production consumers)

The L ledger (DLL-22) frames packrat as a sibling-gated HANDOFF on parse-that PT-WAVE-6, with a
"gate-first BOOK: author `proof:packrat-sound` first." The re-audit (lane-25 §4, lane-28 §5)
found two facts that collapse this framing:

1. **The unsoundness is off every production path.** parse-that's packrat LR-grow tier keys its
   MEMO cache on `parser.id` only (`packrat.ts:61,76,82,99,112,114`), latently unsound for the
   same-parser-at-two-offsets case. BUT this tier is reached ONLY via an explicit `memoize()`
   opt-in, and value.js's CSS grammar NEVER opts in:
   `grep -n "memoize" node_modules/@mkbabb/value.js/dist/value.js` → ZERO. kf consumes value.js,
   which consumes parse-that's DEFAULT (non-packrat) parse path. The practical impact on kf is
   nil, and has been across all 6 tranches.
2. **The `proof:packrat-sound` gate NEVER existed.** `ls scripts/proof-packrat-sound.mjs` → not
   found (verified). The L "authored gate-first" claim is an inv-ε over-claim (lane-25 §6,
   lane-28 §3) — the gate is a documented INTENT, not an artifact.

Per KISS and P-invariant-28: a 6-tranche item with ZERO production impact and a never-written
gate EXITS via a named KILL, not a 7th ride waiting on a theoretical parse-that fix. The KILL
form is the off-the-consumed-path invariant.

### (c) DL-L7 GlassControlPoint — the build-in (Option B over the LIGHT `Draggable`)

`proof:control-point-live` (`scripts/proof-control-point-live.mjs`) is RED-by-design: it asserts
`GlassControlPoint` is importable from the published glass-ui barrel as a draggable-SVG-handle.
glass-ui 4.0.0 dist has ZERO hits (verified, lane-25 §2). The item is 7-tranche; the re-BOOK is
CLOSED since L.WZ. The re-audit (lane-25 §2, lane-28 DM-2) found that kf ALREADY owns the
substrate Option B needs:

- `drag` / `Draggable` / `drag2D` are LIGHT barrel exports (value.js-free): `index.ts:88`
  `export { drag, Draggable, drag2D } from "./drag"`. `drag2D` returns a `Drag2DHandle`
  (`drag-2d.ts:22-33`) with `value: {x, y}`, `velocity: {x, y}`, and a `subscribe(fn(x,y,vx,vy))`
  — the EXACT (x,y) handle a curve control-point binds to.
- The demo already HAND-ROLLS this: `EasingCurveCanvas.vue:7-132` carries a bespoke
  `startDragging` pointer handler + raw `<circle class="control-point handle">` SVG handles +
  `controlPointsSvg` state. That bespoke pointer drag is precisely what the LIGHT `drag2D`
  primitive models — the build-in is a CONSOLIDATION, not net-new surface.
- glass-ui's only differentiated value for a `GlassControlPoint` is visual polish (specular,
  token shadows), achievable with CSS classes from `@mkbabb/glass-ui/styles` (already imported,
  `demo/@/styles/*.css`) — NO component import is needed for a `<circle>` + line.

So GlassControlPoint as a glass-ui PRIMITIVE is declared OUT-OF-SCOPE for kf's demo (the glass-ui
component was the ENABLER, never the product). kf builds a `DemoControlPoint` Vue component over
`drag2D`. `proof:control-point-live` is RETIRED (its premise — glass-ui must ship — is killed),
and `proof:demo-control-point` (a born-RED build-in gate) replaces it.

### Audit evidence

| Ref | Source location | Fact (verified this session) |
|-----|-----------------|------------------------------|
| viol-M5 / lane-25 §3 | `node_modules/@mkbabb/value.js/dist/index.d.ts:50` | `export { PathGeometry, getTotalLength, getPointAtLength }` — the "absent API" premise is FALSE |
| lane-25 §3 | `dist/transform/path.d.ts` | `PathGeometry`: `getTotalLength()`, `getPointAtLength(length)`, `getPointAtT(t)`, `sampleAtLength(length): {x,y,angle}`; module `getPointAtLength(d, length)` |
| lane-25 §3 | `dist/value.js:4948-4994` | runtime `PathGeometry` (alias `Jd`); `Xd`=`getPointAtLength(d,t)`, `Yd`=`getTotalLength(d)` |
| lane-25 §3 / lane-28 DM-3 | `grep -rn "fromMorphSVG" src/animation/` | ZERO — the kf-side function is UNIMPLEMENTED (the born-RED cause) |
| lane-25 §3 | `ls src/animation/morph-svg.ts` | no file — the new HEAVY file to author |
| precedent | `src/animation/motion-path.ts:105` `fromMotionPath`; `src/animation/draw-svg.ts:121` `fromDrawSVG` | the HEAVY-compositor-behind-`loadAnimationEngine()` pattern `fromMorphSVG` mirrors |
| boundary | `load-engine.ts:33-38,133-137` | `MotionPath`/`fromMotionPath`/`DrawSVG`/`fromDrawSVG` typed on `AnimationEngine`, ride `loadAnimationEngine()` |
| precedent | `scripts/proof-motion-path.mjs:18-45`, `scripts/proof-drawsvg.mjs:182-209` | the build-in gate shape: primitive-exists + value.js-free static surface + barrel-wired + behaviour proof in `test/*.test.ts` |
| lane-25 §4 | `grep -n "memoize" node_modules/@mkbabb/value.js/dist/value.js` | ZERO — value.js's grammar never opts into the packrat LR-grow tier |
| lane-25 §4 | `packrat.ts:61,76,82,99,112,114` (id-only MEMO) vs `:36-38` (composite `getCijKey`) | the unsoundness is in the LR-grow MEMO, reached only via `memoize()` opt-in |
| lane-25 §6 / lane-28 §3 | `ls scripts/proof-packrat-sound.mjs` | not found — the "gate-first" claim is an inv-ε over-claim; KILL, do not author |
| lane-25 §2 | `node_modules/@mkbabb/glass-ui/dist/` (grep `GlassControlPoint`) | ZERO — `proof:control-point-live` RED-by-design |
| lane-25 §2 / lane-28 DM-2 | `src/animation/index.ts:88` | `export { drag, Draggable, drag2D } from "./drag"` — LIGHT, value.js-free |
| lane-25 §2 | `src/animation/drag-2d.ts:22-33` | `Drag2DHandle` — `value:{x,y}`, `velocity:{x,y}`, `subscribe(fn(x,y,vx,vy))` |
| lane-25 §2 | `demo/@/components/custom/EasingCurveCanvas.vue:7-132` | bespoke `startDragging` + raw `<circle class="control-point handle">` + `controlPointsSvg` — the build-in consolidates this |
| gate-roster | `package.json:185` | `proof:control-point-live` is wired but in NEITHER `proof:correctness` NOR `proof:hygiene` (the demo-smoke continue-on-error tripwire arm) — retiring it touches the demo-smoke surface, not the blocking roster |

---

## Scope

Each S-clause is a concrete, falsifiable deliverable. S1–S3 build-in `fromMorphSVG` + the
born-RED `proof:morphsvg-consume` (the keystone). S4 records the packrat KILL. S5–S6 build-in
`DemoControlPoint` + retire `proof:control-point-live`. Each move is an exit of a P-invariant-28
terminal-belt item — build-in over a PUBLISHED substrate or a named KILL — NONE a sibling wait,
NONE a workaround.

---

### S1 — `src/animation/morph-svg.ts`: `fromMorphSVG` over the published `PathGeometry` (DL-L8 build-in)

**Breach.** `fromMorphSVG` is absent (`grep -rn "fromMorphSVG" src/animation/` → zero); the SVG
path-morph capability (GSAP MorphSVGPlugin / Flubber parity) is unbuilt. The L ledger blocked it
on a value.js publish that ALREADY shipped (viol-M5).

**Cure.** Author `src/animation/morph-svg.ts` (new HEAVY file, alongside `motion-path.ts` /
`draw-svg.ts`):

- `fromMorphSVG<V>(from: string, to: string, opts?: MorphSVGOptions): CSSKeyframesAnimation`
  where `MorphSVGOptions extends Partial<InputAnimationOptions>` carries an optional
  `samples?: number` (the uniform-arc-length step count; a sensible default, e.g. 64).
- Construct `const fromGeo = new PathGeometry(from)` and `const toGeo = new PathGeometry(to)`
  ONCE (the arc-length table is built at construction — repeated sampling is then a binary
  search + lerp, per `path.d.ts`). Reject a degenerate path (`totalLength === 0`) with a named
  `AnimationOptionError`, NOT a silent zero-frame animation (the honest-or-refuse law).
- For each step `i ∈ [0, samples]`, take the normalized `t = i / samples`, sample
  `fromGeo.getPointAtT(t)` and `toGeo.getPointAtT(t)` to get the source/target point-pairs, and
  build the per-keyframe interpolation target (the `from`-path point array at `0%`, the
  `to`-path point array at `100%`, linearly traversed) — the morph drives the sampled
  `(x,y)` arrays from the source polyline to the target polyline. The lerp uses the existing kf
  numeric path (plain `lerp` / `NumericAnimation`), NOT a new geometry home.
- Return a `CSSKeyframesAnimation` (the `fromMotionPath` construction shape) whose frames
  interpolate the sampled point set; the consumer plays/serializes it exactly as any kf
  animation.

**Constraint (boundary — HEAVY, no new value.js edge).** `morph-svg.ts` constructs
`CSSKeyframesAnimation` so it statically imports `./engine` (exactly like `motion-path.ts`); it
imports `PathGeometry` from `@mkbabb/value.js` — a value.js edge, but the file is HEAVY and rides
`loadAnimationEngine()`, so a LIGHT-only consumer never pulls it (`proof:boundary` stays green).
The barrel re-exports ONLY the option/target TYPES statically (`export type { MorphSVGOptions }`),
mirroring `motion-path.ts`'s `export type { MotionPathOptions, OffsetPath }` (`index.ts:139`).

**Gate bite.** `proof:morphsvg-consume` `primitive-exists` clause: `morph-svg.ts` exports
`fromMorphSVG`. Today: the file does not exist → RED. After cure: present → GREEN. (This is the
source-shape half; the REAL-observable half is S3.)

---

### S2 — Wire `fromMorphSVG` behind `loadAnimationEngine()` (the HEAVY barrel surface)

**Breach.** Even authored, `fromMorphSVG` is unreachable until it rides the heavy boundary like
`MotionPath`/`DrawSVG`.

**Cure.** Add `fromMorphSVG` (and any `MorphSVG` class form, if the implementation mirrors the
`MotionPath`/`DrawSVG` class+factory pair) to the `AnimationEngine` interface (`load-engine.ts`,
beside `fromMotionPath`/`fromDrawSVG` at `:133-137`) and assign it on the engine surface so
`const { fromMorphSVG } = await loadAnimationEngine()` resolves. The barrel exposes ONLY its
types statically (S1). `engine.ts` re-exports it onto the heavy surface the same way it re-exports
`fromMotionPath`/`fromDrawSVG`.

**Constraint (acyclic + boundary).** The dynamic `import("./morph-svg")` edge lives in the
load-engine module (the runtime edge), NOT on the static barrel entry — identical to the
`./motion-path` / `./draw-svg` wiring (`proof:drawsvg` barrel-wired clause precedent,
`proof-drawsvg.mjs:182-209`). `proof:boundary` and `proof:published-surface` stay green (the
new symbol is on the HEAVY `AnimationEngine` surface, diffed by `proof:published-surface`
clause (d)).

**Gate bite.** `proof:morphsvg-consume` `barrel-wired` clause: `fromMorphSVG` rides
`loadAnimationEngine()` (the load-engine module imports `./morph-svg`, assigns it on the engine
surface), and NO static value-export of it leaks onto the LIGHT barrel. Today: RED (no such
wiring). After cure: GREEN.

---

### S3 — `proof:morphsvg-consume` born-RED over the REAL observable (the keystone — inv-M-observable-truth)

**Breach.** No `proof:morphsvg-consume` gate exists (`ls scripts/proof-morphsvg*.mjs` → no match;
`grep -n "morphsvg" package.json` → none). The L ledger named it as "born-RED (APIs absent in
0.13.0)" — an inv-ε error (the API is present; the RED cause is the UNIMPLEMENTED kf function).

**Cure.** Author `scripts/proof-morphsvg-consume.mjs`, mirroring the `proof:motion-path` /
`proof:drawsvg` shape (source-shape clauses + a behaviour proof), and wire it into the
`proof:correctness` roster (`package.json:189`, beside `proof:motion-path` / `proof:drawsvg`).
Clauses:

1. **`primitive-exists`** (source-shape): `morph-svg.ts` exports `fromMorphSVG`. BITE:
   rename/drop the export → red.
2. **`light-static`** (source-shape): `morph-svg.ts` carries no value.js import EXCEPT
   `PathGeometry` (the HEAVY edge it legitimately needs); the BARREL re-export of it is
   type-only. BITE: a static value-export of `fromMorphSVG` on the LIGHT barrel → red.
3. **`barrel-wired`** (source-shape): `fromMorphSVG` rides `loadAnimationEngine()` via the
   load-engine `import("./morph-svg")` + engine-surface assign. BITE: drop the wiring → red.
4. **`live-morph`** (THE REAL OBSERVABLE — inv-M-observable-truth): import `fromMorphSVG` from
   the BUILT barrel through `loadAnimationEngine()`, run a live morph over two non-trivial `d`
   strings (e.g. a triangle → a square, distinct geometries), and assert the produced animation
   has a frame count > 0 AND that the interpolated mid-`t` sample is DISTINCT from BOTH
   endpoints (the morph actually moves the points — not a degenerate or identity animation). The
   probe runs the real compositor, not a grep of the export name.

The gate is born-RED on today's tree: clauses 1–3 red because the file/wiring are absent;
clause 4 reds because the import throws (no such export). The behaviour half lives in
`test/morph-svg.test.ts` (NEW, the `test/motion-path.test.ts` / `test/draw-svg.test.ts`
precedent) — the gate's `live-morph` clause runs a vitest assertion over the round-trip.

**Constraint (inv-M-observable-truth — the keystone).** The gate MUST bite the GENUINE defect:
the L.W1 S4 lesson (`M.md:88`) is that a gate testing a proxy (no-throw + string round-trip)
missed the real NaN-frame breach. Here the proxy trap is asserting only `typeof fromMorphSVG ===
"function"` (the export EXISTS) — which a stub returning an empty animation would pass. The
`live-morph` clause forbids that: it asserts the morph PRODUCES interpolating frames whose mid
sample differs from both endpoints, the observable a real consumer sees. A green
`primitive-exists` over a stub `fromMorphSVG` must STILL red `live-morph`.

**Gate bite.** `node scripts/proof-morphsvg-consume.mjs` → exit 1 today (the export, the wiring,
and the live morph are all absent). After S1+S2 land: every clause greens, the `live-morph`
clause confirms a real triangle→square morph interpolates. This is the wave's keystone gate; it
is a BUILD-IN gate (no sibling consume), exactly as the M.md M.W14 row specifies
("`proof:morphsvg-consume` (build-in, no sibling gate)").

---

### S4 — Record the packrat KILL (DL-L9 / DM-4) — no gate authored

**Breach.** DL-L9 is a 6-tranche P-invariant-28 item carried as a bare HANDOFF on parse-that
PT-WAVE-6, with a never-written `proof:packrat-sound` gate (inv-ε over-claim). A 7th bare ride is
forbidden.

**Cure.** Record the KILL in `M/PROGRESS.md §"Open deferrals"` as DM-4, with the exact form
(lane-28 §5):

> **DM-4 PT-2 packrat soundness — KILL.** The parse-that packrat LR-grow tier keys its MEMO
> cache on `parser.id` only (latently unsound for the same-parser-at-two-offsets case,
> `packrat.ts:61,76,82,99,112,114`), reached ONLY via an explicit `memoize()` opt-in. value.js's
> CSS grammar NEVER opts in (`grep memoize node_modules/@mkbabb/value.js/dist/value.js` → ZERO),
> and kf consumes only that default non-packrat path. The unsoundness is OFF every production
> code path in the constellation. The KILL invariant: no kf/value.js parser opts into the packrat
> LR-grow tier; any FUTURE opt-in consumer must author `proof:packrat-sound` as its OWN
> gate-first obligation before using that path. No `proof:packrat-sound` is authored here (it
> never existed — the L "gate-first" claim was an inv-ε over-claim). The KILL record IS the exit
> form (P-invariant-28: a reasoned KILL with a concrete spec).

**Constraint (no workaround, no gate).** This is a DOCUMENTATION-only exit — no kf source change,
no gate authored, no parse-that wait. Authoring a forever-green grep-gate ("zero `memoize()`
calls in value.js") would be a superfluous gate (the `proof:gate-is-data-model` / superfluity
precept, M.W4) — the KILL record carries the invariant; the absence of any `memoize()` opt-in is
the standing fact. The KILL is recorded in `M/PROGRESS.md`, parsed by `proof:chronic-closure` at
M.WZ as a KILL-RECORD row (rule: a KILL row needs no tripwire/consume-edge).

**Gate bite.** No gate. The exit is the `M/PROGRESS.md` DM-4 KILL row, which
`proof:chronic-closure` accepts as a terminal disposition (a ≥4-tranche item with a KILL verdict
is NOT a bare-BOOK violation — the planted-probe at M.WZ confirms a bare BOOK reds while a KILL
greens).

---

### S5 — `DemoControlPoint.vue` over the LIGHT `drag2D` (DL-L7 build-in, Option B)

**Breach.** The curve-editor control-point primitive (DL-L7, 7-tranche) is blocked on a glass-ui
`GlassControlPoint` that has NEVER published (`proof:control-point-live` RED-by-design). Yet kf
already hand-rolls the bespoke pointer drag (`EasingCurveCanvas.vue:7-132`) and owns the LIGHT
`drag2D` primitive that models it.

**Cure.** Author a `DemoControlPoint` Vue component in `demo/@/components/` (e.g.
`demo/@/components/custom/DemoControlPoint.vue`) that:

- Renders an SVG `<circle>` handle (+ the optional control-line) — the curve-editor handle shape.
- Binds the handle's position to a LIGHT `drag2D(...)` handle (`Drag2DHandle.value: {x,y}`,
  `subscribe(fn(x,y,vx,vy))`), with pointer capture, emitting a normalized `(x,y)` output to the
  parent (the bezier/easing curve consumes it).
- Styles the handle with glass-ui design TOKENS via CSS classes from
  `@mkbabb/glass-ui/styles` (specular/shadow polish) — NO `GlassControlPoint` component import,
  NO new glass-ui peer obligation (inv-16: kf writes no glass-ui source; this is a kf-demo
  component over kf's own LIGHT primitive + glass-ui's published CSS tokens).
- Consolidates the bespoke `startDragging` / raw `<circle>` drag in `EasingCurveCanvas.vue` onto
  the `drag2D`-backed `DemoControlPoint` (the build-in is a consolidation — the hand-rolled
  pointer handler is retired in favor of the LIGHT primitive).

**Constraint (LIGHT, value.js-free, idiomatic).** `drag2D` is a LIGHT barrel export
(`index.ts:88`, value.js-free) — the demo imports it from the kf barrel, not a deep path. The
component is a kf-DEMO primitive, not a library export (it lives in `demo/@/`, not
`src/animation/`). The keyboard-operability + tap-target a11y of the handle is preserved (the
control point is keyboard-focusable + arrow-key-nudgeable, mirroring the existing editor's a11y).

**Gate bite (S6 coverage).** `proof:demo-control-point` `live-drag` clause: the
`DemoControlPoint` renders a draggable SVG handle backed by `drag2D` that emits a normalized
`(x,y)` on pointer drag. Today: the component does not exist → RED.

---

### S6 — Retire `proof:control-point-live`; author `proof:demo-control-point` born-RED

**Breach.** `proof:control-point-live` (`scripts/proof-control-point-live.mjs`,
`package.json:185`) is the glass-ui-publish tripwire — its premise (glass-ui must ship
`GlassControlPoint`) is KILLED by the S5 build-in decision (Option B). Keeping it RED-by-design
forever would assert a gap kf has decided NOT to close via glass-ui — a stale tripwire.

**Cure.**

1. **Retire `proof:control-point-live`:** delete `scripts/proof-control-point-live.mjs` and its
   `package.json:185` script entry; remove it from the demo-smoke continue-on-error tripwire arm
   (it is in NEITHER `proof:correctness` NOR `proof:hygiene` — verified — so the blocking roster
   is untouched; only the demo-smoke report-all surface loses the stale tripwire). Record the
   retirement in `M/PROGRESS.md` DM-2: the glass-ui `GlassControlPoint` ask is WITHDRAWN (the
   build-in supersedes it; the `KF-TO-GLASSUI-BB-ASKS.md §4` ask is closed as
   built-in-not-needed).
2. **Author `proof:demo-control-point`** (NEW, born-RED): a gate asserting the `DemoControlPoint`
   component exists, imports `drag2D` from the kf barrel (the LIGHT primitive), renders an SVG
   handle, and — the REAL observable — a live pointer-drag of the handle emits a normalized
   `(x,y)` that updates (the runtime-axis gate per inv-M-two-axis: a UI/interaction chronic gets
   a RUNTIME browser probe, M.W4). Born-RED on today's tree (the component is absent). Wire it
   into the demo-smoke / interaction surface (the runtime axis), NOT the blocking node roster.

**Constraint (inv-M-observable-truth + inv-M-two-axis).** `proof:demo-control-point` is a RUNTIME
(interaction) gate — the control point is a UI primitive whose REAL observable is the handle
moving under a live drag and the `(x,y)` output updating. A source-shape stand-in ("the component
file exists") is the proxy trap forbidden by inv-M-observable-truth — the gate must drive a live
pointer drag and observe the emitted value change. This is the inv-M-two-axis classification (a
UI/interaction chronic closes via a RUNTIME gate, `M.md:90-93`).

**Gate bite.** `proof:control-point-live` is GONE (its premise killed); `proof:demo-control-point`
exits 1 today (the component absent) and greens after S5 — a live drag of the
`drag2D`-backed handle emits an updated normalized `(x,y)`.

---

## Born-RED gate

**Gates:**
- `proof:morphsvg-consume` (NEW — `scripts/proof-morphsvg-consume.mjs`; this wave authors it;
  the M.md M.W14 keystone "build-in, no sibling gate") — born-RED over four clauses, the keystone
  being `live-morph` (the REAL observable).
- `proof:demo-control-point` (NEW — replaces the RETIRED `proof:control-point-live`) — born-RED
  RUNTIME gate over the live-drag observable.
- DL-L9 packrat: NO gate (KILL record in `M/PROGRESS.md` DM-4 — the exit form).

**The REAL observable (inv-M-observable-truth).** Each gate bites the GENUINE defect, witnessed
born-RED on today's tree — NOT a proxy:

| Gate / clause | Witness on today's tree | Failure mode today (the REAL observable) | Expected after the build-in |
|---|---|---|---|
| `proof:morphsvg-consume` `primitive-exists` | `grep -rn "fromMorphSVG" src/animation/` | ZERO — `morph-svg.ts` / `fromMorphSVG` absent | export present in `morph-svg.ts` |
| `proof:morphsvg-consume` `barrel-wired` | `grep "morph-svg" src/animation/load-engine.ts` | absent — not on the `AnimationEngine` surface, not behind `loadAnimationEngine()` | rides `loadAnimationEngine()`; types-only on the LIGHT barrel |
| `proof:morphsvg-consume` `live-morph` (**KEYSTONE**) | `await loadAnimationEngine()` then `fromMorphSVG(triangle, square)` | THROWS (no such export) — and would STILL fail if stubbed (zero/identity frames); the genuine observable is "the morph interpolates the sampled point-pairs" | frame count > 0 AND mid-`t` sample DISTINCT from both endpoints — a real triangle→square morph |
| `proof:demo-control-point` `live-drag` | `DemoControlPoint` mount + live pointer drag | the component does NOT exist; the bespoke `EasingCurveCanvas` handle is not the consolidated `drag2D` primitive | a live drag of the `drag2D`-backed SVG handle emits an updated normalized `(x,y)` |
| DL-L9 KILL (no gate) | `M/PROGRESS.md` DM-4 absent | the 6-tranche item rides as a bare HANDOFF (P-inv-28 forbidden) | the DM-4 KILL row recorded; `proof:chronic-closure` accepts it as terminal |

**Born-RED kf-side TODAY (the keystone).** Verified this session: `fromMorphSVG` is absent
(`grep` zero), `morph-svg.ts` is absent (`ls` no file), `proof:morphsvg-consume` is absent
(`ls scripts/proof-morphsvg*.mjs` no match), `DemoControlPoint` is absent. The value.js
`PathGeometry`/`getPointAtLength` ARE present (`index.d.ts:50`) — so the RED is the UNIMPLEMENTED
kf compositor, NOT an absent API (the inv-ε correction of viol-M5). The `live-morph` clause's RED
is the GENUINE defect (the morph does not exist / does not interpolate), not a proxy for it.

**Green condition.** `morph-svg.ts` authored with `fromMorphSVG` over the published
`PathGeometry` (S1), wired behind `loadAnimationEngine()` (S2), `proof:morphsvg-consume` four
clauses GREEN incl. the live triangle→square morph interpolating (S3); the packrat KILL recorded
in `M/PROGRESS.md` DM-4 (S4); `DemoControlPoint` built over `drag2D` (S5); `proof:control-point-live`
retired + `proof:demo-control-point` GREEN on a live drag (S6). All three P-invariant-28
terminal-belt items EXIT — `proof:chronic-closure` at M.WZ reads DM-2 (build-in/withdrawn), DM-3
(MorphSVG build-in commit), DM-4 (KILL) as terminal, with NO bare BOOK.

---

## Dependencies

- **value.js 0.13.0 — already pinned (`^0.13.0`); NO new sibling publish.** `PathGeometry` +
  `getPointAtLength` + `getTotalLength` are in the INSTALLED surface (`index.d.ts:50`, verified).
  This is the wave's defining fact: it has NO sibling tripwire — every exit is a kf-side build-in
  or a kf-side KILL. (Contrast M.W8/M.W9, which are pure-wait HANDOFFs on glass-ui/value.js
  publishes.)
- **LIGHT `drag2D` / `Draggable` — already shipped** (`index.ts:88`, value.js-free). The
  `DemoControlPoint` build-in needs NO new library surface.
- **Independent of every Band-A/B/C/D wave.** File surfaces: `src/animation/morph-svg.ts` (NEW),
  `src/animation/load-engine.ts` + `index.ts` (the HEAVY barrel wiring, additive — beside the
  existing `fromMotionPath`/`fromDrawSVG` rows), `scripts/proof-morphsvg-consume.mjs` (NEW),
  `test/morph-svg.test.ts` (NEW), `package.json` (gate roster — add `proof:morphsvg-consume`,
  remove `proof:control-point-live`), `demo/@/components/custom/DemoControlPoint.vue` (NEW) +
  `EasingCurveCanvas.vue` (consolidate the bespoke handle), `scripts/proof-demo-control-point.mjs`
  (NEW, replaces the deleted `proof-control-point-live.mjs`), `M/PROGRESS.md` (DM-2/DM-3/DM-4
  dispositions). No collision with the engine/compile correctness waves (M.W5–W7) or the gate
  apparatus (M.W1–W4) — though it BENEFITS from M.W1's report-all runner (its new gate reds are
  reported alongside others in one pass) and from M.W4's two-axis taxonomy (the
  `proof:demo-control-point` RUNTIME-axis classification).
- **Couples to M.WZ (the chronic terminal).** M.WZ's `proof:chronic-closure` substrate transition
  reads the DM-2/DM-3/DM-4 terminal dispositions this wave produces. The three P-invariant-28
  exits MUST be recorded before M.WZ's planted-probe (a ≥4-tranche bare BOOK must red; these three
  green as build-in/KILL). MorphSVG's commit hash, the GlassControlPoint build-in/withdrawal, and
  the packrat KILL are the M.WZ ledger rows.
- **No glass-ui dep, no parse-that dep, no value.js publish dep.** This is the ONLY Band-E wave
  that fires entirely on today's installed tree.

---

## Bite — what regression each clause catches

| Clause | Regression it prevents |
|--------|------------------------|
| S1 `fromMorphSVG` build-in | The DL-L8 7-tranche item rides an 8th tranche as a bare HANDOFF on a value.js publish that ALREADY shipped (P-inv-28 forbidden; the viol-M5 factual error perpetuated) |
| S2 barrel-wiring | `fromMorphSVG` leaks as a STATIC value-export on the LIGHT barrel (a value.js edge pulled into a light-only consumer's graph — a `proof:boundary` breach), or is unreachable (not on the `loadAnimationEngine()` surface) |
| S3 `proof:morphsvg-consume` `live-morph` | A STUB `fromMorphSVG` (export exists, returns an empty/identity animation) passes a name-only proxy gate while the morph does NOT interpolate — the EXACT L.W1 S4 proxy trap (inv-M-observable-truth); the gate that should bite the real observable (frames that move) is silently green |
| S4 packrat KILL | The DL-L9 6-tranche item rides a 7th tranche as a bare HANDOFF on a never-firing parse-that tripwire (P-inv-28 forbidden), OR a superfluous forever-green grep-gate is authored where a KILL record suffices (the superfluity precept) |
| S5 `DemoControlPoint` build-in | The DL-L7 7-tranche item rides an 8th tranche waiting on a glass-ui primitive that has never published, while kf already owns the LIGHT `drag2D` substrate (P-inv-28 forbidden; KISS — kf waits on a sibling for a component it can build in ~20 LOC) |
| S6 retire `proof:control-point-live` + `proof:demo-control-point` | A stale glass-ui-publish tripwire reds forever asserting a gap kf decided NOT to close via glass-ui (a false-pending tripwire), OR the build-in control point ships with no runtime gate over its REAL observable (a source-shape stand-in that misses a broken drag — the gate-blind-spot/appearance-axis lesson) |

---

## Excluded from this wave

- **Orient-along-path for `fromMorphSVG`** (the `PathGeometry.sampleAtLength` tangent `angle`) —
  BOOK. This wave's morph interpolates POSITIONS (the `{x,y}` point-pairs); the `rotate: auto`
  tangent-orient half is a follow-on over the published `sampleAtLength(length): {x,y,angle}` and
  is not required for the P-inv-28 exit (the position morph IS the MorphSVG capability).
- **Topology-aware vertex correspondence** (the Flubber "matched point counts / shape
  resampling" refinement for paths with wildly different command counts) — BOOK. Uniform
  arc-length sampling at a fixed `samples` count is the correct floor; the smart-correspondence
  refinement is a quality follow-on, not the exit.
- **A library `MorphSVG` PRESET or `animate({morph})` dispatch arm** — out of scope; this wave
  ships the `fromMorphSVG` factory + its HEAVY barrel surface. An `animate()` shape-dispatch
  branch (like the `fromMotionPath` `{path}` branch, `animate.ts:170`) is a separable follow-on.
- **Promoting `DemoControlPoint` to a LIBRARY export** (`src/animation/`) — out of scope. It is a
  kf-DEMO primitive (`demo/@/`) over the existing LIGHT `drag2D`; the library already exports the
  `drag2D` substrate. A library control-point component is a Vue-adapter concern (keyframes-vue),
  not the engine.
- **The parse-that PT-WAVE-6 (id,offset) re-key** — NOT consumed (the packrat KILL declares the
  tier off-limits; parse-that's fix, if it ever ships, is parse-that's concern, not a kf consume).
- **The glass-ui `GlassControlPoint` ask** (`KF-TO-GLASSUI-BB-ASKS.md §4`) — WITHDRAWN by the S5
  build-in (recorded in `M/PROGRESS.md` DM-2); glass-ui need not deliver it for kf's demo to work.
