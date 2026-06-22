# O.W6 — fromMorphSVG built in: the 7-tranche DM-3 chronic terminates (P-invariant-28 ABSOLUTE)

**Band:** C — the chronic terminals (P-inv-28 ABSOLUTE).
**Phase:** NOW — kf-internal, zero sibling dependency, executable on authorization (value.js 1.0.2's `PathGeometry` is ALREADY PUBLISHED + installed; the build-in needs NO sibling publish).
**Sequence:** `O.W0 charter ─► A{W1 lint, W2 ledger} ─► B{W3 nan-frame, W4 ingest} ─► C.W6 fromMorphSVG` (this wave) ‖ `C.W5 DemoControlPoint`. The two Band-C chronics are independent of each other and of D.W9; O.WZ's `proof:chronic-closure` reads this wave's DM-3 terminal disposition (`O.md:84,110`).
**Owning chronic/DM:** **DM-3 MorphSVG** — 7 tranches (G→M), declared **"ABSOLUTE terminal at M — no 8th BOOK"** in the deferred ledger, **never built** (the forbidden 8th carry). This wave is that carry's terminus: a kf-owned **BUILD-IN** over the published `PathGeometry`, no sibling gate. (`O.md:55-56,110`; `M.W14.md:5-9,35-37` "DL-L8 MorphSVG 7-tranche EXIT here — build-in or named KILL — with NO 8th ride".)

This wave **supersedes M.W14 §(a) + §S1–S3** (the MorphSVG slice — `M.W14.md:43-81,162-269`). M.W14 was DEVELOPED but its terminal-belt was **never implemented** (`AUDIT-DIGEST.md` C13/F28 lanes, verified live 2026-06-19: `grep -rn "fromMorphSVG" src/animation/` → ZERO, `ls src/animation/morph-svg.ts` → no file, `ls scripts/proof-morphsvg*.mjs` → no match). O.W6 is the *implementation* spec; it references M.W14's design and deltas the ONE fact that the constellation re-converged: the `PathGeometry` kernel `fromMorphSVG` needs is published at **value.js 1.0.2** (`index.d.ts:50`, the M.W14-era `^0.13.0` pin advanced through the constellation campaign to `1.0.0` — the API is unchanged, RICHER, and still DOM-free). The `DemoControlPoint`/packrat halves of M.W14 are NOT this wave (`DemoControlPoint` → O.W5; packrat KILL → folded at O.W2 per the D4 reconciliation).

---

## Context

### The chronic, and why it must die here

DM-3 MorphSVG is the SVG path-to-path morph capability (GSAP `MorphSVGPlugin` / Flubber parity): given two `<path>` `d` strings of differing geometry, produce a `@keyframes` animation that interpolates one polyline INTO the other. It has been BOOKED as a bare HANDOFF for **7 tranches** (G→M). The L deferred ledger (DLL-21) recorded the tripwire as "value.js `PathGeometry` absent — the full arc-length sampler is the VJ.W4 remainder," and M.W14 corrected that as **viol-M5** (`M.W14.md:43-53`): the premise was a **factual error** — the value-domain geometry half had *already shipped*. The re-audit re-confirms it on the constellation-converged tree (value.js 1.0.2, the campaign's `1.0.0` cut consumed):

```
node_modules/@mkbabb/value.js/dist/index.d.ts:50:
  export { PathGeometry, getTotalLength, getPointAtLength } from './transform/path';
node_modules/@mkbabb/value.js/dist/index.d.ts:51:
  export type { Point, PathSample } from './transform/path';
```

So the gate's premise — "wait on a value.js publish" — has been DEAD, not pending, since value.js 0.13.0; it is now doubly dead on 1.0.2 (the campaign's bidirectional/SOTA cut shipped `transform/path` whole, `AUDIT-DIGEST.md` B7/B8). P-invariant-28 forbids an 8th bare ride; the re-BOOK is CLOSED since L.WZ (`M.W14.md:8-9,35-37`). The exit is a kf-side BUILD-IN with NO sibling wait — kf **already composes the published `PathGeometry` engine** it needs (the engine surface statically imports `@mkbabb/value.js`; this file adds only the `PathGeometry` symbol, on the HEAVY chunk).

### kf already owns the seam (the build-in is the missing compositor, beside DrawSVG/MotionPath)

`fromMorphSVG` is **not** net-new architecture — it is the THIRD member of the existing HEAVY `from*`-over-geometry family, the one M.W14 named "the remaining kf-domain compositor: sample two paths at N uniform arc-length intervals, lerp the per-step point-pairs, emit a `@keyframes` block" (`M.W14.md:71-77`). The seam M.W14's "browser owns the geometry" note draws (`motion-path.ts:13-19`, `draw-svg.ts:13-20`) is precisely:

| Layer | Owner | What it does for `fromMorphSVG` |
|---|---|---|
| **path-`d` → arc-length sampler** | value.js `PathGeometry` (`transform/path.d.ts`) | parses `d` ONCE, builds the cumulative arc-length table at construction; `getPointAtT(t)` is then a binary-search + lerp |
| **N-step sample + per-step point-pair lerp → keyframes** | **kf `morph-svg.ts` (THIS WAVE)** | the kf-domain compositor: sample both paths at `samples` uniform `t`, lerp the `(x,y)` arrays, emit a `CSSKeyframesAnimation` |
| **play / serialize / WAAPI** | kf `engine` (`CSSKeyframesAnimation`) | the `from*` factory contract — `.play()`/`.pause()`/`.stop()`/`.finished` |

The two siblings that already exist prove the shape. `fromMotionPath` (`motion-path.ts:105`) and `fromDrawSVG` (`draw-svg.ts:121`) are each a thin compositor: construct `CSSKeyframesAnimation`, set the keyframe map, `setTargets`, `void play()` if `autoPlay`, return the handle. `fromMorphSVG` mirrors that exactly — the ONLY new piece is the per-step point-pair lerp over the `PathGeometry` samples (the MotionPath/DrawSVG "browser owns the geometry" had ZERO `d`-parse; MorphSVG's geometry is owned by `PathGeometry` instead of the browser, but the COMPOSITOR over it is identical). **No new value.js edge** beyond the engine the file already composes: `engine.ts` statically imports `@mkbabb/value.js`, and `morph-svg.ts` imports `PathGeometry` from `@mkbabb/value.js` — a value.js edge, but the file is HEAVY and rides `loadAnimationEngine()`, so a LIGHT-only consumer never pulls it (`proof:boundary` stays green; the new symbol is on the HEAVY `AnimationEngine` surface, like `fromMotionPath`/`fromDrawSVG`).

### `fromMorphSVG` is NOT `ElementMorph` (the name-collision guard)

`fromMorphSVG` (path-`d` → path-`d` polyline interpolation) is a SEPARATE primitive from `ElementMorph` (`morph.ts` / `test/morph.test.ts` — rect-to-rect position/scale interpolation, a LIGHT export). The new file is `src/animation/morph-svg.ts`; the new test is `test/morph-svg.test.ts` — NO collision with the existing `morph.ts` / `test/morph.test.ts` (`M.W14.md:79-81`). The barrel re-export is type-only and namespaced (`MorphSVGOptions`), beside `MotionPathOptions`/`DrawSVGOptions` (`index.ts:139,142`).

### Audit evidence

| Ref | Source location | Fact (verified this session, 2026-06-19) |
|-----|-----------------|------------------------------|
| born-RED #1 | `grep -rn "fromMorphSVG" src/animation/` | ZERO — `morph-svg.ts` / `fromMorphSVG` absent (only doc-comment mentions: `motion-path.ts:17`, `draw-svg.ts:18`); the gate's RED cause |
| born-RED #2 | `ls src/animation/morph-svg.ts` | no file — the new HEAVY file to author |
| born-RED #3 | `ls scripts/proof-morphsvg*.mjs` → no match; `grep -n "morphsvg" package.json` → none | the keystone gate is ABSENT (M.W14 named it but it was never authored) |
| viol-M5 corrected | `node_modules/@mkbabb/value.js/dist/index.d.ts:50` | `export { PathGeometry, getTotalLength, getPointAtLength } from './transform/path';` — the "absent API" premise is FALSE (and was FALSE since 0.13.0) |
| API surface | `node_modules/@mkbabb/value.js/dist/transform/path.d.ts:36-54` | `PathGeometry`: `constructor(d)`, `totalLength`, `getTotalLength()`, `getPointAtLength(length)`, `getPointAtT(t)`, `sampleAtLength(length): {x,y,angle}` — the `d`-parse-once + cumulative-table sampler |
| API DOM-free | `path.d.ts:5-10` | "the `getTotalLength`/`getPointAtLength`/`getPointAtPathLength` of `SVGGeometryElement` **without a DOM** — so a consumer (keyframes.js … MorphSVG …) can drive motion along a path with no `<path>` element" — value.js named kf MorphSVG as the consumer |
| installed version | `node_modules/@mkbabb/value.js/package.json` | `1.0.2` (the constellation campaign cut; `^0.13.0 \|\| ^1.0.0` peer satisfied) |
| precedent (factory shape) | `src/animation/motion-path.ts:105-156` `fromMotionPath`; `src/animation/draw-svg.ts:121-177` `fromDrawSVG` | the HEAVY-compositor-behind-`loadAnimationEngine()` pattern `fromMorphSVG` mirrors (construct `CSSKeyframesAnimation`, keyframe map, `setTargets`, `void play()`, return handle) |
| precedent (class form) | `motion-path.ts:164-191` `MotionPath`; `draw-svg.ts:185-214` `DrawSVG` | the thin class wrapper beside the factory (`.animation` is the handle) `MorphSVG` mirrors |
| boundary wiring | `src/animation/load-engine.ts:33-39,132-137,422-423,474-477` | `MotionPath`/`fromMotionPath`/`DrawSVG`/`fromDrawSVG` typed on `AnimationEngine`, dynamic-imported in the `Promise.all`, assigned on the engine surface — the wiring `fromMorphSVG` joins |
| barrel type re-export | `src/animation/index.ts:139,142` | `export type { MotionPathOptions, OffsetPath }` / `export type { DrawSVGOptions, SVGDrawTarget }` — the types-only LIGHT-barrel pattern `MorphSVGOptions` mirrors |
| gate shape | `scripts/proof-drawsvg.mjs:19-58` (clauses: `primitive-exists`, `no-valuejs-edge`→here `single-valuejs-edge`, `barrel-wired`, `test-locks`), `scripts/proof-motion-path.mjs` | the build-in gate shape: primitive-exists + value.js-edge-bounded + barrel-wired + behaviour proof in `test/*.test.ts` |
| roster slot | `package.json:83,86,194` | `proof:motion-path` / `proof:drawsvg` are script-defined at `:83`/`:86` and rostered in **`proof:hygiene`** (`:194`), NOT `proof:correctness` (`:193`) — full-loop roster correction; `proof:morphsvg-consume` joins them in `proof:hygiene` to genuinely sit beside |
| ledger (M.md delta) | `O.md:31,84,110` | "M.W14 terminal-belt: `fromMorphSVG` ABSENT … O Band C (the chronic terminals)"; "O.W6 (`fromMorphSVG` over value.js `PathGeometry`)" |
| ledger (DM-3) | `O.md:55-56,110` | "DM-3 MorphSVG (7-tranche) … declared ABSOLUTE terminal at M — no 8th BOOK — yet … never built. This is the forbidden 8th carry. O Band C builds … in (kf-owned, no sibling gate — value.js 1.0.2 already ships the `PathGeometry` `getTotalLength`/`getPointAtLength` that MorphSVG needs)" |

---

## Scope

Each S-clause is a concrete, falsifiable deliverable. **S1** builds `src/animation/morph-svg.ts` (`fromMorphSVG` + the `MorphSVG` class) over the published `PathGeometry`. **S2** wires it behind `loadAnimationEngine()` (the HEAVY barrel surface, beside `fromMotionPath`/`fromDrawSVG`). **S3** authors `proof:morphsvg-consume` born-RED over the REAL runtime observable — the keystone: a live triangle→square morph produces interpolating frames whose mid-`t` sample is DISTINCT from both endpoints. Every move is the EXIT of the 7-tranche P-inv-28 chronic — a kf-side build-in over a PUBLISHED substrate — NONE a sibling wait, NONE a workaround.

---

### S1 — `src/animation/morph-svg.ts`: `fromMorphSVG` over the published `PathGeometry` (DM-3 build-in)

**Breach.** `fromMorphSVG` is absent (`grep -rn "fromMorphSVG" src/animation/` → zero; `ls src/animation/morph-svg.ts` → no file). The SVG path-morph capability (GSAP `MorphSVGPlugin` / Flubber parity) is unbuilt. The L ledger blocked it on a value.js publish that ALREADY shipped (viol-M5, re-confirmed on 1.0.2).

**Cure.** Author `src/animation/morph-svg.ts` (new HEAVY file, alongside `motion-path.ts` / `draw-svg.ts`):

- **Signature.** `fromMorphSVG<V extends Record<string, any> = any>(from: string, to: string, opts?: MorphSVGOptions): CSSKeyframesAnimation<V>` where `MorphSVGOptions extends Partial<InputAnimationOptions>` carries `samples?: number` (the uniform-arc-length step count; default `64` — the `from`/`to`/`autoPlay` two-form contract of `DrawSVGOptions` is mirrored where applicable) and `target?: HTMLElement | SVGElement` (the morph drives a CSS custom-property / `d` channel the consumer renders; the default is target-less — the returned handle IS the control surface, exactly like `fromDrawSVG(target)` returns the handle).
- **Construct ONCE.** `const fromGeo = new PathGeometry(from)` and `const toGeo = new PathGeometry(to)` — the arc-length table is built at construction (`path.d.ts:31-35`), so repeated sampling is a binary-search + lerp, NOT a re-parse. The two `PathGeometry` allocations are the ONLY per-call geometry cost.
- **Refuse, don't fake.** Reject a degenerate path (`fromGeo.totalLength === 0` or `toGeo.totalLength === 0`) with a named `AnimationOptionError` (`internal/errors.ts`), NOT a silent zero-frame / identity animation — the honest-or-refuse law (the `fromDrawSVG`/`asFraction` fail-explicit precedent, `draw-svg.ts:77-95`). A morph between a zero-length path and anything is not a morph; it is a malformed input.
- **Sample + lerp.** For each step `i ∈ [0, samples]`, take the normalized `t = i / samples`, sample `fromGeo.getPointAtT(t)` and `toGeo.getPointAtT(t)` (`path.d.ts:47-48`) to get the source/target `(x,y)` point-pairs, and build the per-keyframe interpolation target — the `from`-path point array at `0%`, the `to`-path point array at `100%`, the engine's existing numeric `lerp` traversing between them (NOT a new geometry home; the lerp is the engine's `interpFrames` / `lerpValue`, exactly as MotionPath/DrawSVG lerp their scalars). The morph drives the sampled `(x,y)` arrays from the source polyline to the target polyline.
- **Return a handle.** Return a `CSSKeyframesAnimation<V>` (the `fromMotionPath`/`fromDrawSVG` construction shape — `new CSSKeyframesAnimation<V>(animOptions).fromKeyframes(keyframes)`, `setTargets` if a `target` is given, `void play()` if `autoPlay`, return the handle). The consumer plays/serializes it exactly as any kf animation.
- **The `MorphSVG` class** (beside the factory, `motion-path.ts:164-191` / `draw-svg.ts:185-214` precedent): `new MorphSVG(from, to, opts).animation` is the handle; `.play()`/`.pause()`/`.stop()`/`.finished` delegate. The factory is canonical; the class is the thin ergonomic wrapper.

**Constraint (boundary — HEAVY, single value.js edge).** `morph-svg.ts` constructs `CSSKeyframesAnimation` so it statically imports `./engine` (exactly like `motion-path.ts`/`draw-svg.ts`); it imports `PathGeometry` from `@mkbabb/value.js` — a value.js edge, but the file is HEAVY and rides `loadAnimationEngine()`, so a LIGHT-only consumer never pulls it (`proof:boundary` stays green; the boundary gate enumerates LIGHT barrel entries, and `fromMorphSVG` is never a static value-export on the barrel — only a type). This is the ONE distinction from DrawSVG (`draw-svg.ts` carries NO value.js import; `morph-svg.ts` legitimately needs the ONE `PathGeometry` import) — so its gate clause is `single-valuejs-edge` (exactly one specifier, `@mkbabb/value.js` for `PathGeometry`), not DrawSVG's `no-valuejs-edge`.

**Gate bite.** `proof:morphsvg-consume` `primitive-exists` clause: `morph-svg.ts` exports `fromMorphSVG` AND `MorphSVG`. Today: the file does not exist → RED. After cure: present → GREEN. (This is the source-shape half; the REAL-observable half is S3.)

---

### S2 — Wire `fromMorphSVG` behind `loadAnimationEngine()` (the HEAVY barrel surface)

**Breach.** Even authored, `fromMorphSVG` is unreachable until it rides the heavy boundary like `MotionPath`/`DrawSVG`. The barrel holds no static edge to `./morph-svg` (it would leak value.js onto the LIGHT path); the runtime edge lives in `load-engine.ts`.

**Cure.** Wire `fromMorphSVG` + `MorphSVG` onto the HEAVY surface exactly as `fromMotionPath`/`fromDrawSVG` are wired (`load-engine.ts`):

1. **Type surface** (`load-engine.ts:33-39` precedent): add `import type { MorphSVG as MorphSVGClass, fromMorphSVG as fromMorphSVGImpl } from "./morph-svg";` (an erased `import type`, no runtime edge), and add `MorphSVG: typeof MorphSVGClass; fromMorphSVG: typeof fromMorphSVGImpl;` to the `AnimationEngine` interface beside the DrawSVG rows (`load-engine.ts:135-137`).
2. **Dynamic edge** (`load-engine.ts:422-423` precedent): add `import("./morph-svg")` to the `Promise.all` in `loadAnimationEngine()`, destructure `morphMod`, and assign `MorphSVG: morphMod.MorphSVG, fromMorphSVG: morphMod.fromMorphSVG` in the `Object.assign` engine surface (`load-engine.ts:474-477` precedent).
3. **Barrel type-only** (`index.ts:139,142` precedent): `export type { MorphSVGOptions } from "./morph-svg";` — ONLY the option type on the LIGHT barrel (erased). NO static value-export of `fromMorphSVG`/`MorphSVG` anywhere on the barrel.

So `const { fromMorphSVG } = await loadAnimationEngine()` resolves, identical to `fromMotionPath`/`fromDrawSVG`.

**Constraint (acyclic + boundary).** The dynamic `import("./morph-svg")` edge lives in the load-engine module (the runtime edge), NOT on the static barrel entry — identical to the `./motion-path` / `./draw-svg` wiring (`proof:drawsvg` `barrel-wired` clause precedent, `proof-drawsvg.mjs:182-209`). `proof:boundary` and `proof:published-surface` stay green: the new symbol is on the HEAVY `AnimationEngine` surface (`proof:published-surface` clause (d) diffs the hand-maintained `AnimationEngine` interface against the runtime `Object.keys(engine)` — the two stay in lockstep when S2 adds `fromMorphSVG`/`MorphSVG` to BOTH).

**Gate bite.** `proof:morphsvg-consume` `barrel-wired` clause: `fromMorphSVG`/`MorphSVG` ride `loadAnimationEngine()` (the load-engine module imports `./morph-svg`, assigns them on the engine surface), and NO static value-export of them leaks onto the LIGHT barrel. Today: RED (no such wiring). After cure: GREEN.

---

### S3 — `proof:morphsvg-consume` born-RED over the REAL runtime observable (the keystone — observable-truth)

**Breach.** No `proof:morphsvg-consume` gate exists (`ls scripts/proof-morphsvg*.mjs` → no match; `grep -n "morphsvg" package.json` → none). M.W14 §S3 named it "born-RED (APIs absent in 0.13.0)" — an inv-ε error (the API was present at 0.13.0 and is present at 1.0.2; the RED cause is the UNIMPLEMENTED kf compositor, `M.W14.md:229-231`).

**Cure.** Author `scripts/proof-morphsvg-consume.mjs`, mirroring the `proof:motion-path` / `proof:drawsvg` shape (source-shape clauses + a behaviour proof), and wire it into the **`proof:hygiene`** roster (`package.json:194`, as `"proof:morphsvg-consume": "node scripts/proof-morphsvg-consume.mjs && vitest run test/morph-svg.test.ts"`, beside `proof:motion-path` / `proof:drawsvg` — which live in `proof:hygiene`, NOT `proof:correctness`; full-loop roster correction, ledger line 551). Clauses:

1. **`primitive-exists`** (source-shape): `morph-svg.ts` exports `fromMorphSVG` AND `MorphSVG`. BITE: rename/drop the export → red.
2. **`single-valuejs-edge`** (source-shape): `morph-svg.ts` carries EXACTLY ONE `@mkbabb/value.js` specifier — the `PathGeometry` import (the HEAVY edge it legitimately needs) — and NO second geometry home / second eligibility predicate of its own (it composes the engine + `PathGeometry` only). The BARREL re-export of `fromMorphSVG`/`MorphSVG` is type-only. BITE: a static value-export of `fromMorphSVG` on the LIGHT barrel, OR a second value.js specifier, OR a hand-rolled path-`d` parser instead of `PathGeometry` → red.
3. **`barrel-wired`** (source-shape): `fromMorphSVG`/`MorphSVG` ride `loadAnimationEngine()` via the load-engine `import("./morph-svg")` + engine-surface assign; only `MorphSVGOptions` is on the static barrel (type-only). BITE: drop the wiring, or static-export the value → red.
4. **`live-morph`** (THE REAL OBSERVABLE — observable-truth): import `fromMorphSVG` from the BUILT barrel through `loadAnimationEngine()`, run a live morph over two NON-TRIVIAL `d` strings of DISTINCT geometry (a triangle `"M 0 0 L 100 0 L 50 100 Z"` → a square `"M 0 0 L 100 0 L 100 100 L 0 100 Z"`), and assert BOTH: (i) the produced animation has a frame count `> 0`, AND (ii) the interpolated sample at mid-`t` (e.g. `0.5`) is DISTINCT from BOTH endpoints — the sampled `(x,y)` set at `50%` differs from the `from`-polyline AND the `to`-polyline (the morph actually MOVES the points, not a degenerate / identity / endpoint-snap animation). The probe runs the real compositor through `loadAnimationEngine()` against the BUILT `dist/` barrel, not a grep of the export name.

   **Distinctness over the FULL sampled set, NOT a single endpoint (CANON-adjacent precision).** The mid-`t`-DISTINCT assertion MUST compare the FULL sampled `(x,y)` point set (all `samples` pairs) — or, equivalently, an INTERIOR sample `s ∈ (0,1)` such as `getPointAtT(0.5)` of the polyline — between the `50%` frame and each endpoint frame. A single-endpoint-vertex comparison is DEGENERATE: a closed `triangle`→`square` morph SHARES the start vertex (`M 0 0`) and (because both paths begin/close at the same corner) can share other endpoint vertices, so the polyline's first/last sampled point can be IDENTICAL across `from`/mid/`to` even when the morph genuinely interpolates everywhere in between. Asserting distinctness only at a shared endpoint vertex would FALSE-RED a correct morph (or FALSE-GREEN a stub that only perturbs the endpoint). The clause therefore diffs the whole sampled array (or an interior `s`), so the witness is the morph's BODY moving, not its (possibly-shared) anchor.
5. **`test-locks`** (the behaviour proof): `test/morph-svg.test.ts` (NEW, the `test/motion-path.test.ts` / `test/draw-svg.test.ts` precedent) carries the locking assertions — the `PathGeometry`-once construction, the `samples`-count keyframe set, the degenerate-path `AnimationOptionError` refusal, and the triangle→square mid-`t`-distinct interpolation (the distinctness asserted over the FULL sampled `(x,y)` set / an interior `s`, NOT a single shared-endpoint vertex — per the clause-4 precision). BITE: delete a lock → red.

The gate is born-RED on today's tree: clauses 1–3,5 red because the file/wiring/test are absent; clause 4 reds because the import throws (no such export on the engine surface). The behaviour half lives in `test/morph-svg.test.ts`; the gate's `live-morph` clause runs the round-trip assertion (the `&& vitest run test/morph-svg.test.ts` chain, the `proof:drawsvg` combined-script precedent).

**Constraint (observable-truth — the keystone).** The gate MUST bite the GENUINE defect: the L.W1 S4 lesson (`M.md:88`, re-stated `M.W14.md:257-263`) is that a gate testing a proxy (no-throw + a string round-trip) missed the real NaN-frame breach. Here the proxy trap is asserting only `typeof fromMorphSVG === "function"` (the export EXISTS) — which a STUB returning an empty / identity / endpoint-only animation would pass. The `live-morph` clause forbids that: it asserts the morph PRODUCES interpolating frames whose mid-`t` sample differs from BOTH endpoints — the observable a real consumer sees. A green `primitive-exists` over a stub `fromMorphSVG` must STILL red `live-morph`.

**Gate bite.** `node scripts/proof-morphsvg-consume.mjs` → exit 1 today (the export, the wiring, the test, and the live morph are ALL absent). After S1+S2 land: every clause greens, the `live-morph` clause confirms a real triangle→square morph interpolates (mid-`t` distinct from both endpoints). This is the wave's keystone gate; it is a BUILD-IN gate (no sibling consume), exactly as the `O.md:84,110` O.W6 row specifies ("`proof:morphsvg-consume` born-RED on the absent export. No sibling gate.").

---

## Born-RED gate

**Gate:** `proof:morphsvg-consume` (NEW — `scripts/proof-morphsvg-consume.mjs`; this wave authors it; the `O.md:84,110` O.W6 keystone "build-in, no sibling gate") — born-RED over five clauses, the keystone being `live-morph` (the REAL runtime observable).

**The REAL observable (observable-truth).** Each clause bites the GENUINE defect, witnessed born-RED on today's tree — NOT a proxy:

| Gate / clause | Witness on today's tree | Failure mode today (the REAL observable) | Expected after the build-in |
|---|---|---|---|
| `proof:morphsvg-consume` `primitive-exists` | `grep -rn "fromMorphSVG" src/animation/` | ZERO — `morph-svg.ts` / `fromMorphSVG` / `MorphSVG` absent (only doc-comment mentions) | `fromMorphSVG` + `MorphSVG` exported in `morph-svg.ts` |
| `proof:morphsvg-consume` `single-valuejs-edge` | `ls src/animation/morph-svg.ts` | the file does not exist; no compositor + no `PathGeometry` import to bound | exactly one `@mkbabb/value.js` specifier (`PathGeometry`); no second geometry home; barrel re-export type-only |
| `proof:morphsvg-consume` `barrel-wired` | `grep "morph-svg" src/animation/load-engine.ts` | absent — not on the `AnimationEngine` surface, not behind `loadAnimationEngine()` | rides `loadAnimationEngine()`; only `MorphSVGOptions` on the LIGHT barrel (type-only) |
| `proof:morphsvg-consume` `live-morph` (**KEYSTONE**) | `await loadAnimationEngine()` then `fromMorphSVG(triangle, square)` | THROWS (no such export on the engine surface) — and would STILL fail if stubbed (zero / identity / endpoint frames); the genuine observable is "the morph interpolates the sampled point-pairs" | frame count `> 0` AND mid-`t` sample DISTINCT from BOTH endpoints — a real triangle→square morph |
| `proof:morphsvg-consume` `test-locks` | `ls test/morph-svg.test.ts` | no file — the `PathGeometry`-once / degenerate-refusal / mid-`t`-distinct locks are absent | `test/morph-svg.test.ts` locks the construction + refusal + interpolation assertions |

**Born-RED kf-side TODAY (the keystone).** Verified this session: `fromMorphSVG` is absent (`grep -rn "fromMorphSVG" src/animation/` → ZERO, only the two doc-comment mentions at `motion-path.ts:17` / `draw-svg.ts:18`), `morph-svg.ts` is absent (`ls` → no file), `proof:morphsvg-consume` is absent (`ls scripts/proof-morphsvg*.mjs` → no match; `grep morphsvg package.json` → none), `test/morph-svg.test.ts` is absent. The value.js `PathGeometry`/`getPointAtT`/`getTotalLength` ARE present (`index.d.ts:50`, `path.d.ts:36-54`, value.js 1.0.2 installed) — so the RED is the UNIMPLEMENTED kf compositor, NOT an absent API (the inv-ε correction of viol-M5, re-confirmed). The `live-morph` clause's RED is the GENUINE defect (the morph does not exist / would not interpolate if stubbed), not a proxy for it.

**Plant-a-failure (born-RED proof).** Before the build-in: `proof:morphsvg-consume` exits 1 on a clean tree because the file/wiring/test are absent — clauses `primitive-exists`/`single-valuejs-edge`/`barrel-wired`/`test-locks` red on the absent source, and `live-morph` reds because `await loadAnimationEngine()` resolves an engine surface with NO `fromMorphSVG` key (the destructure is `undefined`, the call throws). The dual born-RED structure (the keystone discipline): even if a future stub exports a `fromMorphSVG` that returns an empty / identity animation and greens `primitive-exists`, the `live-morph` clause STILL reds (the stub's mid-`t` sample equals an endpoint, or the frame count is 0) — the gate NEVER false-greens on a name-only proxy.

**Green condition.** `morph-svg.ts` authored with `fromMorphSVG`/`MorphSVG` over the published `PathGeometry` (S1), wired behind `loadAnimationEngine()` + only `MorphSVGOptions` type-exported on the LIGHT barrel (S2), `proof:morphsvg-consume` five clauses GREEN incl. the live triangle→square morph interpolating with a mid-`t` sample distinct from both endpoints (S3). The 7-tranche P-invariant-28 DM-3 chronic EXITS — `proof:chronic-closure` at O.WZ reads DM-3 as a BUILD-IN terminal (the MorphSVG build-in commit hash is the O.WZ ledger row), with NO bare BOOK.

---

## Dependencies

- **value.js 1.0.2 — already pinned + installed; NO new sibling publish.** `PathGeometry` + `getPointAtT` + `getTotalLength` are in the INSTALLED surface (`index.d.ts:50`, `path.d.ts:36-54`, verified). This is the wave's defining fact: it has NO sibling tripwire — the exit is a kf-side build-in over a PUBLISHED substrate. (Contrast the BC-gated Band-F waves `O.md:87` and the value.js-P-gated Band-G O.W16 `O.md:88`, which are pure-wait HANDOFFs.) The M.W14-era `^0.13.0` pin advanced through the constellation campaign to `1.0.0`/`1.0.2`; the `transform/path` API is unchanged + DOM-free across that range, so no re-pin is required for this wave.
- **The kf engine — already composes value.js.** `engine.ts` statically imports `@mkbabb/value.js`; `morph-svg.ts` constructs `CSSKeyframesAnimation` so it rides that same HEAVY chunk. The ONLY new value.js symbol is `PathGeometry` (on the HEAVY chunk, not the LIGHT barrel). The build-in needs NO new LIGHT library surface.
- **Couples to O.WZ (the chronic terminal).** O.WZ's `proof:chronic-closure` substrate transition (L/M → O re-point, `O.md:89`) reads the DM-3 terminal disposition this wave produces (`O/PROGRESS.md §"Open deferrals"` — the DM-3 MorphSVG BUILD-IN row, with the `morph-svg.ts` commit hash). The DM-3 BUILD-IN row MUST be recorded before O.WZ's planted-probe (a ≥4-tranche bare BOOK must red; DM-3 greens as a build-in). The three P-invariant-28 Band-C exits (DM-2 O.W5, DM-3 O.W6, DM-4 packrat KILL/FOLD at O.W2) are the O.WZ ledger rows.
- **Independent of every other Band-A/B/C/D wave.** File surfaces: `src/animation/morph-svg.ts` (NEW), `src/animation/load-engine.ts` + `index.ts` (the HEAVY barrel wiring, additive — beside the existing `fromMotionPath`/`fromDrawSVG` rows), `scripts/proof-morphsvg-consume.mjs` (NEW), `test/morph-svg.test.ts` (NEW), `package.json` (gate roster — add `proof:morphsvg-consume` to `proof:hygiene`, beside `proof:motion-path`/`proof:drawsvg`), `docs/tranches/O/PROGRESS.md` (DM-3 disposition). No collision with the engine/correctness waves (O.W3/W4), the gate apparatus (O.W1/W2), or the SIBLING Band-C chronic (O.W5 — a SEPARATE file `DemoControlPoint.vue`, a SEPARATE gate `proof:demo-control-point`). It BENEFITS from O.W1's report-all runner (its new gate's reds are reported alongside others in one pass).
- **NO glass-ui dep, NO parse-that dep, NO value.js PUBLISH dep.** This is a pure-NOW Band-C wave — it fires entirely on today's installed tree (the ONLY thing it consumes — the published `PathGeometry` — is already there).

---

## dev→impl boundary

This file is the Tranche O DEVELOPMENT spec for O.W6 — DOCS ONLY. It writes zero engine/demo/library source (inv-16: kf writes only keyframes.js; the `PathGeometry` it composes is a PUBLISHED value.js export consumed through the engine's existing edge, never a foreign-tree edit — and this wave issues NO dispatch, because the substrate already shipped). The IMPLEMENTATION (the `morph-svg.ts` build, the `load-engine.ts`/`index.ts` wiring, the `proof:morphsvg-consume` authoring, the `test/morph-svg.test.ts` locks, the DM-3 record) opens only on the owner's explicit authorization — exactly M's dev→impl boundary. When it opens it is gate-first (S3 `proof:morphsvg-consume` authored born-RED BEFORE S1's compositor lands), observable-truth (the `live-morph` keystone over the real `PathGeometry`-backed compositor through `loadAnimationEngine()`), no-legacy (a thin compositor beside `fromMotionPath`/`fromDrawSVG`, NOT a parallel geometry home), KISS (the geometry is value.js's; the file is the per-step sample + lerp + the `from*` factory contract), gestalt (the THIRD member of the existing HEAVY `from*`-over-geometry family, the same `CSSKeyframesAnimation`-handle return), isomorphic (the `PathGeometry` sampler is DOM-free, so the morph composes identically in jsdom + the browser), and P-invariant-28 ABSOLUTE (the 7-tranche DM-3 chronic EXITS here — build-in over a PUBLISHED substrate — with NO 8th ride).

---

## Bite — what regression each clause catches

| Clause | Regression it prevents |
|--------|------------------------|
| S1 `fromMorphSVG` build-in | The DM-3 7-tranche item rides an 8th tranche as a bare HANDOFF on a value.js publish that ALREADY shipped (P-inv-28 forbidden; the viol-M5 factual error perpetuated past 1.0.2) |
| S1 degenerate refusal | A morph over a zero-length path returns a silent zero-frame / identity animation (the honest-or-refuse law violated — a malformed input fakes success instead of throwing `AnimationOptionError`) |
| S2 barrel-wiring | `fromMorphSVG` leaks as a STATIC value-export on the LIGHT barrel (a value.js edge — via `PathGeometry` — pulled into a light-only consumer's graph, a `proof:boundary` breach), or is unreachable (not on the `loadAnimationEngine()` surface), or drifts from the `AnimationEngine` interface (`proof:published-surface` clause (d) reds) |
| S3 `proof:morphsvg-consume` `single-valuejs-edge` | A SECOND value.js specifier or a hand-rolled path-`d` parser is added instead of composing the published `PathGeometry` (a second geometry home — the no-second-geometry-home discipline `motion-path.ts:17` / `draw-svg.ts:19` names) |
| S3 `proof:morphsvg-consume` `live-morph` | A STUB `fromMorphSVG` (export exists, returns an empty / identity / endpoint-only animation) passes a name-only proxy gate while the morph does NOT interpolate — the EXACT L.W1 S4 proxy trap (observable-truth); the gate that should bite the real observable (frames whose mid-`t` sample moves between the polylines) is silently green |
| S3 `test-locks` | The behaviour proof is hollowed — the `PathGeometry`-once construction, the degenerate refusal, and the mid-`t`-distinct interpolation are unasserted, so a future regression of the compositor passes |

---

## Excluded from this wave

- **Orient-along-path for `fromMorphSVG`** (the `PathGeometry.sampleAtLength` tangent `angle`, `path.d.ts:49-54`) — BOOK. This wave's morph interpolates POSITIONS (the `{x,y}` point-pairs); the `rotate: auto` tangent-orient half is a follow-on over the published `sampleAtLength(length): {x,y,angle}` and is NOT required for the P-inv-28 exit (the position morph IS the MorphSVG capability). (`M.W14.md:460-463`.)
- **Topology-aware vertex correspondence** (the Flubber "matched point counts / shape resampling" refinement for paths with wildly different command counts) — BOOK. Uniform arc-length sampling at a fixed `samples` count is the correct floor; the smart-correspondence refinement is a quality follow-on, not the exit. (`M.W14.md:464-467`.) **Engine-compatibility note (full-loop, ledger line 551):** uniform-`samples` sampling is also the *engine-compatibility enabler* — interpolating a CSS `d:`/`path()` channel requires MATCHED command counts between the `0%` and `100%` frames, and uniform sampling guarantees this (both polylines emit exactly `samples`+1 points). That matched-count guarantee is the concrete reason topology-aware correspondence is correctly BOOKED rather than required for the exit: the floor already produces engine-valid frames; smart-correspondence only improves *quality*, never *validity*.
- **A library `MorphSVG` PRESET or an `animate({morph})` dispatch arm** — out of scope. This wave ships the `fromMorphSVG` factory + the `MorphSVG` class + their HEAVY barrel surface. An `animate()` shape-dispatch branch (like the `fromMotionPath` `{path}` branch, `animate.ts`) is a separable follow-on. (`M.W14.md:468-470`.)
- **`DemoControlPoint` + `proof:demo-control-point` (DM-2)** — that is O.W5 (the SIBLING Band-C chronic, over the LIGHT `drag2D`), a SEPARATE file + gate. This wave is ONLY the DM-3 MorphSVG/`fromMorphSVG` terminal. (`O.md:84,109`.)
- **The packrat KILL/FOLD (DM-4)** — folded at O.W2 per the D4 owner reconciliation (`AUDIT-DIGEST.md`: DM-4 KILL→FOLD-LANDED, `proof:packrat-sound` GREEN via parse-that A.W2 in 0.11.0). NOT this wave.
- **Promoting `morph-svg.ts` to a demo MorphSVG SCENE** — out of scope. This wave ships the LIBRARY primitive + its gate; a demo scene over it (a triangle→square morph showcase) is a demo-band follow-on, not the P-inv-28 exit (which is the build-in + the live runtime gate over it).

---

**Full-loop disposition (`docs/tranches/P/FULL-LOOP-LEDGER.md` O.W5-6-chronics / [ADOPT] O.W6,
line 543-551):** ADOPT — **the keystone is PROVEN, not merely planned.** The full-loop BENCHED the
EXACT triangle→square morph the `live-morph` gate will run (RAN: `npx tsx` from project root):

- **Export existence:** `PathGeometry` / `getTotalLength` / `getPointAtLength` are all `typeof
  function` on value.js 1.0.2 (`index.d.ts:50`); `PathGeometry.getPointAtT` / `sampleAtLength` are
  callable (`path.d.ts:36-54`).
- **Keystone measurement (the gate's exact distinctness assertion):** triangle
  `"M 0 0 L 100 0 L 50 100 Z"` → square `"M 0 0 L 100 0 L 100 100 L 0 100 Z"`, sampled at 64 uniform
  `t`, lerped at mid-`t` → **mid-`t` mean per-point distance 11.27 from EACH endpoint vs 22.54
  between the endpoints** (mid is exactly midway, DISTINCT from both — the S3 `live-morph` clause's
  precise assertion, MEASURED).
- **Clause-4 precision EMPIRICALLY VINDICATED:** `dist(from[0], to[0]) = 0.000000` — the start
  vertex `M 0 0` IS shared between triangle and square; a single-endpoint-vertex compare WOULD be
  degenerate (false-RED a correct morph or false-GREEN a stub). The full-set / interior-`s`
  distinctness the clause mandates is required, not optional.
- **Degenerate refusal feasible:** `PathGeometry('M 50 50 Z').totalLength === 0` and
  `PathGeometry('M 50 50').totalLength === 0` — the refuse-don't-fake law is implementable.
- **Wiring slots exact:** `load-engine.ts:34-39` (type imports), `:135-137` (interface rows),
  `:422-423` (Promise.all import), `:474-477` (engine-surface assign) are the
  `fromMotionPath`/`fromDrawSVG` precedent `fromMorphSVG` joins.

TWO corrections folded in: (1) **roster claim CORRECTED** — `proof:motion-path`/`proof:drawsvg` live
in `proof:hygiene` (`package.json:194`), NOT `proof:correctness` (`:193`); `proof:morphsvg-consume`
is wired into `proof:hygiene` to genuinely sit beside them. (2) **engine-compatibility note added** —
uniform-`samples` sampling guarantees matched command counts for a `d:`/`path()` channel, the
concrete reason topology-aware correspondence is correctly BOOKED. Implementation stays gate-first /
no-legacy / HEAVY-behind-`loadAnimationEngine()` as specified.
