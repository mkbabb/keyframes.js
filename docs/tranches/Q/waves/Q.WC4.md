# Q.WC4 — the MorphSVG demo scene + the on-DOM render contract O.W6 left as VAPOR + orient-along-path

**Band:** C — the demo-fleet (the library-built MorphSVG finally demoed; the honest render half O.W6 deferred; the orient-along-path follow-on).
**Phase:** NOW — kf-internal, zero sibling dependency, executable on authorization. `fromMorphSVG`/`MorphSVG` are ALREADY BUILT + barrel-wired (`src/animation/morph-svg.ts`, `index.ts:143-150`, `load-engine.ts:46-47`, gated by `proof:morphsvg-consume`); value.js's `PathGeometry.sampleAtLength` (the orient tangent) is ALREADY PUBLISHED + installed (`node_modules/@mkbabb/value.js/dist/transform/path.d.ts:54`). The render-contract fix + the demo scene + orient are all kf-internal over an installed substrate.
**Sequence (DAG edges):** `Q.WA3 master-merge (FIRST) ─► Q.WC4-MORPH-RENDER (the render contract) ─► {Q.WC4-MORPH-ORIENT ‖ Q.WC4-MORPH-SCENE}`. The scene (`Q.WC4-MORPH-SCENE`) consumes the render contract (a target-bearing morph that actually writes a renderable `d`); orient is independent of the scene but rides the same `morph-svg.ts`. Q.WC4 is independent of every other Band-C wave (Q.WC1/Q.WC2 easing, Q.WC3 mobile, Q.WC5 amiga). (`Q.md:54`; audit lanes `B1-kf-morphsvg`, `B5-kf-demo-arch`, `B6-dag-ordering`.)
**Owning ideas:** the audit **B1-kf-morphsvg** verdict ("O.W6 shipped as the engine-compatibility FLOOR with four named extensions BOOKED-OUT and one honesty gap; the most acute defect is the `--morph-d` target-write that the docstring promises but the code never performs") + **B5-kf-demo-arch** ("`fromMorphSVG` is a DEAD HEAVY export demo-side — the library exports it, the test consumes it, but NO demo scene showcases it; P.md promised a morph scene"). The frontend-design + gate-blindspot precept: a green source-shape gate (`proof:morphsvg-consume`) misses appearance/interaction — the 3rd HEAVY geometry front door must be witnessed in the running demo.

This wave terminalizes the three open MorphSVG items in one coherent pass: **(1) the render-contract VAPOR** — `morph-svg.ts:67-76` documents that a `target`-bearing morph writes the interpolated `d` onto `--morph-d` each frame, but the code (`fromMorphSVG` at `:237-239`) only calls `setTargets(target)`, which makes the engine write the ~130 numeric `--morph-{i}-x/y` coordinate keys, NOT the reassembled `--morph-d` string. The promised channel is documented-but-never-written. **(2) the demo scene** — no `MorphSVGScene.vue` exists (`ls demo/app/scenes/` → Cube/Amiga/Square/Easing/MotionPath/Sequence/Spring, no Morph). **(3) orient-along-path** — `PathGeometry.sampleAtLength` already publishes the tangent `angle` (`path.d.ts:54`), which O.W6 left unconsumed (a BOOKED follow-on, now terminalized with no deferral).

---

## Context

### The render-contract VAPOR (the honesty gap O.W6 left — verified `file:line`)

`fromMorphSVG`'s `MorphSVGOptions.target` JSDoc (`src/animation/morph-svg.ts:67-76`) reads verbatim:

> Optional target the morph drives. When given, the morph writes the interpolated polyline `d` (`MorphSVG.sampleD`) onto the target's `--morph-d` CSS custom property each frame so an author can render it (e.g. `<path d="" style="d: var(--morph-d)">` or a JS reader).

But the implementation (`:237-239`) is:

```ts
if (target != null) {
    animation.setTargets(target as unknown as HTMLElement);
}
```

`setTargets(target)` makes the engine animate the keyframes — which carry ONLY the ~130 numeric `--morph-{i}-x` / `--morph-{i}-y` custom properties (`:90-91`, `:219-226`). **There is NO `--morph-d` write anywhere** (`grep "morph-d" src/animation/morph-svg.ts` → only the two docstring lines `:70-71`; `grep "setProperty\|onRender\|onTick" morph-svg.ts` → none). So a target-bearing morph paints 130 invisible numeric custom props and NEVER the renderable `d` the docstring promises. Unlike `fromDrawSVG`/`fromMotionPath` — which animate a REAL CSS property the browser renders (`stroke-dashoffset` / `offset-distance`) — `fromMorphSVG`'s animated channel is NOT renderable as a shape without an author-side reader, and the documented author-side channel (`--morph-d`) does not exist. This is the no-target-render-path gap + the false-docstring honesty gap (`B1-kf-morphsvg`).

### The dead demo-side export (the gate-blindspot)

`fromMorphSVG`/`MorphSVG` ARE built + barrel-wired + gated (`proof:morphsvg-consume` is GREEN with a live triangle→square keystone). But `proof:morphsvg-consume` has **ZERO demo/scene clauses** (`grep "scene\|demo\|Scene" scripts/proof-morphsvg-consume.mjs` → nothing), and no `MorphSVGScene.vue` exists. The 3rd HEAVY geometry front door (after MotionPath + DrawSVG) is library-built but never demoed — a green source-shape gate misses that the primitive is unobserved in the running demo (the exact gate-blindspot lesson, MEMORY feedback). P.md promised "a morph scene showcases `fromMorphSVG`" (`B5-kf-demo-arch`).

### Orient-along-path: the published tangent, unconsumed (the BOOKED follow-on)

`PathGeometry.sampleAtLength(length): PathSample` returns `{ x, y, angle }` where `angle` is the tangent in radians (`path.d.ts:28-29,54` — "for `rotate: auto`"). O.W6 sampled `getPointAtT(t)` (position only) and explicitly BOOKED orient-along-path as a quality follow-on. The enabling input is ALREADY PUBLISHED — so orient is a complete terminal NOW (no deferral): add an `orient` option that, when true, also samples the tangent and emits an `--morph-angle` channel so a consumer can `rotate` a glyph along the morphed shape.

### The on-DOM render path (the cure that dissolves the vapor + enables the scene)

The render contract fix (the honest half O.W6 left as vapor):

1. **Make `--morph-d` REAL via the engine's RENDERER seam.** The engine exposes NO `onTick`/`onFrame` hook; the per-frame write seam is the `transform?: TransformFunction<V>` renderer that `fromKeyframes` accepts (`engine.ts:1245,1217-1229`; invoked per frame under `interpFrames(t, apply=true)`, `:606`). When `target` is given, build the morph with a custom `transform` renderer that, each frame, reassembles the interpolated polyline into a `d` string (reusing `MorphSVG.sampleD`'s `pointsToD` core — `morph-svg.ts:278-289`) and writes `target.style.setProperty('--morph-d', dString)` + `setProperty('d', \`path("${dString}")\`)`. Write BOTH the `d:` CSS property (`<path style="d: var(--morph-d)">` — Chromium + recent Safari render `path()` in `d`) AND retain the `--morph-d` custom property + expose a JS reader (`MorphSVG.sampleD(t)`) for the Firefox-lags case — the documented-fallback render path is honest, not a single-browser bet. (Supplying a custom renderer makes the morph WAAPI-ineligible by construction — the desired rAF-always behavior.)
2. **Avoid the per-frame alloc.** The renderer reassembles points each frame; hoist its scratch point-array out of the per-frame closure (an instance-level reused `MorphPoint[]`) so the render path is zero-alloc on the steady frame — contrast `MorphSVG.sampleD` (`:280`), which mints a fresh `new Array(samples+1)` per call (fine for a one-off manual pull, NOT a 60Hz render). KISS, and it pre-empts a "morph is too heavy" perf deferral.

This is the seam that lets the demo scene render an actual morphing shape (not 130 invisible numeric props), and it CORRECTS the false docstring (the no-legacy honesty law — delete the claim that does not hold; replace the write with the one the docstring promises).

### Audit evidence

| Ref | Source location | Fact (verified this session, 2026-06-23) |
|-----|-----------------|------------------------------|
| render VAPOR | `src/animation/morph-svg.ts:70-71` (docstring) vs `:237-239` (impl) | the docstring promises a per-frame `--morph-d` write; the impl only `setTargets(target)` — the engine writes ~130 `--morph-{i}-x/y` numeric props, NEVER `--morph-d` |
| no `--morph-d` write | `grep "morph-d\|setProperty\|onTick\|onRender" src/animation/morph-svg.ts` | ONLY the two docstring lines; ZERO write call site (the honesty gap). NB: the engine has NO `onTick`/`onFrame` hook either — the per-frame write seam is the `transform` renderer arg (`engine.ts:1245,255,259` `TransformFunction`/`_defaultTransform`/`usesDefaultRenderer`), invoked per frame under `interpFrames(t, apply=true)` (`:606`) |
| renderer seam | `src/animation/engine.ts:255` (`_defaultTransform`), `:1245` (`fromKeyframes(keyframes, transform?)`), `constants.ts:53` (`TransformFunction<V> = (v, t) => void`) | the custom-renderer the morph supplies to `fromKeyframes` to write `--morph-d` per frame (closes over `target`; reuses `pointsToD` at `morph-svg.ts:107`) |
| sampleD exists | `src/animation/morph-svg.ts:278-289` (`MorphSVG.sampleD`) | reassembles the interpolated points into a `d` string — the render value, present but only as a manual pull |
| sampleD per-call alloc | `src/animation/morph-svg.ts:281` (`interpFrames(ms, false)`) | allocates a fresh result object per call (no hoisted buffer) — fine for a one-off, a per-frame render needs the buffer arg |
| orient input published | `node_modules/@mkbabb/value.js/dist/transform/path.d.ts:28-29,54` | `sampleAtLength(length): { x, y, angle }`, `angle` = tangent in radians ("for `rotate: auto`") — the orient enabler, UNCONSUMED by O.W6 |
| O.W6 sampled position only | `src/animation/morph-svg.ts:98-104` (`samplePolyline` via `getPointAtT`) | the morph samples position; the tangent `angle` is never read (the BOOKED orient follow-on) |
| no demo scene | `ls demo/app/scenes/` → Cube/Amiga/Square/Easing/MotionPath/Sequence/Spring | NO `MorphSVGScene.vue` — the primitive is undemoed (the gate-blindspot) |
| gate has no scene clause | `grep "scene\|demo\|Scene" scripts/proof-morphsvg-consume.mjs` → nothing | `proof:morphsvg-consume` is GREEN but covers ONLY the library primitive, never the running demo |
| scene registration shape | `demo/app/scenes.ts:92-165` (`scenes[]` descriptors: id/label/superKey/icon/component via `lazyScene`) | the `MotionPath`/`Sequence` precedent a `morph` scene mirrors |
| scene gate roster | `package.json` (`proof:scene-contract-identity`, `proof:scene-parity`, `proof:scene-machine-irrefragable`, `proof:scene-transition-perf`) | the scene-registration gates a new scene must satisfy |

---

## Scope

Each S-clause is a concrete, falsifiable deliverable. **S1** terminalizes the morph's on-DOM render contract — DELETE the false `--morph-d` docstring claim and REPLACE the bare `setTargets` with the per-frame `--morph-d` (+ `d:`) write the docstring promises, zero-alloc on the steady frame. **S2** adds orient-along-path — consume `PathGeometry.sampleAtLength`'s published tangent `angle` behind an `orient` option, emitting an `--morph-angle` channel. **S3** authors `MorphSVGScene.vue` — a triangle→square→star morph subject + registers it in the scene machine, with the born-RED gate over the REAL runtime observable (an APPEARANCE/INTERACTION-axis assertion: the rendered path `d` at mid-`t` differs from both endpoints in the LIVE demo, not a grep). Every move is kf-internal over an installed substrate — NONE a sibling wait, NONE a workaround, NONE a deferral (the three BOOKED-out items terminalized here).

---

### S1 — Terminalize the morph's on-DOM render contract (the honest half O.W6 left as VAPOR)

**Breach.** `morph-svg.ts:67-76` documents a per-frame `--morph-d` write a target-bearing morph never performs; the impl (`:237-239`) only `setTargets(target)`, so the engine writes ~130 invisible `--morph-{i}-x/y` numeric props and NEVER the renderable `d`. A target-bearing morph cannot be rendered as a shape — the documented author channel does not exist (a no-legacy honesty violation + a missing render path).

**Cure.**

1. **Make `--morph-d` REAL (the per-frame write — via the engine's RENDERER seam, NOT a fictitious `onTick`).** The engine has NO `onTick`/`onFrame` hook (`grep onTick|onFrame|onRender engine.ts` → none). The per-frame write seam is the `transform?: TransformFunction<V>` renderer arg `fromKeyframes` accepts (`engine.ts:1245,1217-1229` `resolveTransform` — "a supplied transform is the consumer's renderer; vars arrive unflattened"; `interpFrames(t, apply=true)` invokes it per frame, `engine.ts:606`). When `target` is given, build the morph with a **custom `transform` renderer** passed to `fromKeyframes` (instead of the bare default DOM-style renderer the `setTargets`-only path uses) that, each frame, reassembles the interpolated `--morph-{i}-x/y` points into a `d` string and writes BOTH `target.style.setProperty('--morph-d', d)` AND `target.style.setProperty('d', \`path("${d}")\`)` (the `d:` CSS property — Chromium + recent Safari render `path()` in `d`; the `--morph-d` custom property is the cross-browser author channel + the JS-reader fallback for Firefox). The `sampleD` reassembly logic already exists (`MorphSVG.sampleD`, `:278-289`); the renderer reuses its point→`d` core (`pointsToD`). **Boundary note:** supplying a custom `transform` renderer flips `usesDefaultRenderer` false, so the morph is WAAPI-INELIGIBLE by construction and always runs the rAF path where the renderer fires — which is the desired behavior (custom props are not the default DOM renderer's WAAPI-animatable set anyway).
2. **Zero-alloc on the steady frame.** The renderer is invoked WITH the interpolated vars per frame (the play loop already owns its `interpFrames` output buffer via `_interpOut`, `engine.ts:929` — the renderer reads it, it does not re-pull `interpFrames`). So the zero-alloc target is the RENDERER's own scratch: hoist the reassembly point-array + the `d`-string builder out of the per-frame closure (a module/instance-level scratch `MorphPoint[]` reused each frame) so the steady-frame render mints nothing — contrast `MorphSVG.sampleD` (`:280-284`), which allocates a fresh `new Array(samples+1)` per call (fine for a one-off manual pull, NOT for a 60Hz render). Pre-empts a "morph is too heavy at 64 samples" perf deferral. (The separate `sampleD` manual-reader path MAY also gain the `interpFrames(ms, false, buffer)` third-arg buffer, `:281`, but that is the reader's concern, not the per-frame render path.)
3. **CORRECT the docstring (no-legacy honesty).** The `morph-svg.ts:67-76` docstring is now TRUE (the `--morph-d` write exists). Where the dual `d:` + `--morph-d` channels are described, the docstring states the browser-support split honestly (the `d:` property renders directly on Chromium/Safari; the `--morph-d` custom prop + `MorphSVG.sampleD` reader is the Firefox-lags fallback).

**Constraint (boundary — HEAVY, single value.js edge unchanged; inv-16).** The render write is a kf-side per-frame DOM write on the target's style — it adds NO value.js edge (`morph-svg.ts` keeps its single `PathGeometry` import). The morph stays WAAPI-ineligible by construction (the custom `transform` renderer flips `usesDefaultRenderer` false; custom props are not the default DOM renderer's animatable set) so it always runs the rAF path where the per-frame renderer fires cleanly. This is a library source edit on `morph-svg.ts` (NOT a demo edit) — the honest render contract is a LIBRARY correctness fix.

**Gate bite (S3 coverage).** `proof:morph-renders-d` (NEW) `d-written` clause: a target-bearing morph, driven one frame, writes a `--morph-d` (and `d:`) onto the target whose value reassembles to a `d` distinct from both endpoint polylines. Today: NO `--morph-d` write exists → red.

---

### S2 — Orient-along-path: consume `PathGeometry.sampleAtLength`'s published tangent (the BOOKED follow-on, terminalized)

**Breach.** `PathGeometry.sampleAtLength` already publishes the tangent `angle` (`path.d.ts:54`), but O.W6 sampled `getPointAtT` (position only) and left orient-along-path BOOKED-out — a follow-on with no terminal home (a P-inv-28 risk under Q's no-deferral precept).

**Cure.** Add an `orient?: boolean` option to `MorphSVGOptions`. When `orient: true`, `samplePolyline` additionally reads the tangent `angle` at each step. **The arc-length conversion (correctness):** the morph samples positions by NORMALIZED `t` via `getPointAtT(i/n)` (`morph-svg.ts:101`), but `sampleAtLength(length)` takes an arc-LENGTH — so the tangent at the same point is `geo.sampleAtLength(geo.totalLength * (i/n)).angle` (multiply the normalized step by `totalLength`, `path.d.ts:38` exposes `readonly totalLength`), NOT `sampleAtLength(i/n)` (which would read the tangent a fraction of a pixel along the path — a degenerate near-origin angle). The keyframes then carry an `--morph-angle` channel (the interpolated tangent in radians) so a consumer can `rotate` a glyph along the morphed shape (the `rotate: auto` semantic). Gate the orient channel BEHIND the option (default `false`) so a position-only morph stays at ~130 keys — the orient adds ~65 angle keys (~195 total at `samples=64`) ONLY when requested, pre-empting a "morph is too heavy" perf deferral.

**Constraint (single value.js edge, no second geometry home).** `sampleAtLength` is on the SAME `PathGeometry` already imported (`morph-svg.ts:45`) — NO second value.js specifier, NO hand-rolled tangent math. The orient is a one-flag extension over the published sampler.

**Gate bite (S3 coverage).** `proof:morph-orients` (NEW) `angle-channel` clause: with `orient: true`, the keyframe set carries an `--morph-angle` channel whose interpolated value tracks the tangent; with `orient: false` (default), the angle channel is ABSENT (the position-only floor unchanged). Today: no `orient` option, no angle channel → red.

---

### S3 — `MorphSVGScene.vue` + the born-RED gate over the REAL runtime observable (the keystone — APPEARANCE/INTERACTION axis, NOT a grep)

**Breach.** No `MorphSVGScene.vue` exists (`ls demo/app/scenes/` → no Morph). The library-built `fromMorphSVG` is a DEAD demo-side export; `proof:morphsvg-consume` is GREEN but has ZERO scene clauses — a green source-shape gate misses that the 3rd HEAVY geometry front door is unobserved in the running demo (the gate-blindspot lesson).

**Cure.**

1. **Author `demo/app/scenes/MorphSVGScene.vue`** beside `MotionPathScene.vue` — a morph subject that dogfoods `fromMorphSVG` (via `loadAnimationEngine()`) over a triangle→square→star sequence, rendering the morphed shape through the S1 render contract (`<path style="d: var(--morph-d)">`). Register it in `demo/app/scenes.ts` (id `morph`, a label/superKey/icon/`lazyScene` descriptor like `MotionPath`/`Sequence`) + the dock + the scene machine. Optionally dogfood orient (S2) by orienting a small glyph along the morphed outline (the `--morph-angle` channel).
2. **Author `scripts/proof-morph-scene.mjs`** (playwright-headless, born-RED) over the BUILT `dist/gh-pages/`, mirroring the scene-runtime harness (`scripts/lib/demo-driver.mjs` `withPage`/`navToScene`). Wire it into the `proof:correctness` roster. **CI-coverage wiring (mandatory, for ALL THREE new gates):** `proof:morph-renders-d` + `proof:morph-orients` (node/jsdom gates, wired into a tier + given explicit `run: npm run …` steps in the **gates** job of `.github/workflows/ci.yml`) and `proof:morph-scene` (runtime, wired into the **demo-smoke** job) each need an explicit `npm run <gate>` line in `ci.yml` — per `proof:ci-coverage.mjs:198-209`, chain-membership alone reds the coverage gate. Clauses:
   - **`scene-registered`** (source-shape corroborator): the scene machine carries a `morph` scene; `MorphSVGScene.vue` exists and consumes `fromMorphSVG`. BITE: drop the registration → red.
   - **`morph-renders`** (THE KEYSTONE — the APPEARANCE/INTERACTION-axis observable): navigate `#/morph`, play the morph, and assert the subject's RENDERED path `d` (the `getAttribute('d')` or the resolved `d:` style) at mid-`t` is DISTINCT from BOTH endpoint shapes (the triangle AND the square/star) — a real morphing shape, not a static path or 130 invisible numeric props. BITE: a scene that mounts but renders a static / endpoint-only shape (the render contract not wired) reds; a scene that only writes the numeric props but no `--morph-d`/`d:` reds.
3. **EXTEND `proof:morphsvg-consume` with a demo-scene SOURCE-SHAPE corroborator clause** (per `B6-dag-ordering`): `proof:morphsvg-consume` is a node/jsdom gate (its `live-morph` keystone runs the compositor through `loadAnimationEngine()` in jsdom, NOT over the built `dist/gh-pages/` in a browser — `proof-morphsvg-consume.mjs:18,63`), so the extension is a SOURCE-SHAPE corroborator: assert `MorphSVGScene.vue` exists + imports/consumes `fromMorphSVG` — the LIVE rendered-morph observable lives in the separate `proof:morph-scene` runtime gate (clause 2). This LINKS the library gate to the demo gate (the primitive is never again library-built-but-undemoed) without trying to drive a browser scene from a jsdom harness.

**Constraint (observable-truth — the keystone; scene-registration hygiene).** The `morph-renders` clause MUST bite the GENUINE defect: a green `scene-registered` over a scene that mounts a static path (the render contract not wired) must STILL red `morph-renders`. Registering a new scene touches `proof:scene-contract-identity`, `proof:scene-parity`, `proof:scene-machine-irrefragable`, and the dock — the scene must satisfy those existing gates (the new scene is a full first-class scene, not a stub). This is the inv-two-axis classification: the demo showcase closes via a RUNTIME gate over the live rendered shape, never a source-shape stand-in.

**Gate bite.** `node scripts/proof-morph-scene.mjs` → exit 1 today (no `MorphSVGScene.vue`, no `morph` scene, no rendered morph). After S1–S3 land: the scene mounts, plays a triangle→square→star morph whose RENDERED `d` at mid-`t` differs from both endpoints, and `proof:morphsvg-consume` gains the scene clause.

---

## Born-RED gate

**Gate:** THREE born-RED gates this wave authors — `proof:morph-renders-d` (S1, the render contract), `proof:morph-orients` (S2, the orient channel), and `proof:morph-scene` (S3, the demo showcase, the KEYSTONE with the APPEARANCE/INTERACTION-axis `morph-renders` clause) — plus the EXTENDED `proof:morphsvg-consume` demo-scene clause. The keystone is `proof:morph-scene`'s `morph-renders` (the REAL runtime observable: the LIVE demo's rendered path `d` at mid-`t` differs from both endpoint shapes).

**The REAL observable (observable-truth).** Each gate bites the GENUINE defect, witnessed born-RED on today's tree — NOT a proxy:

| Gate / clause | Witness on today's tree | Failure mode today (the REAL observable) | Expected after the wave |
|---|---|---|---|
| `proof:morph-renders-d` `d-written` | a target-bearing morph driven one frame; read `target.style` | NO `--morph-d` / `d:` write exists (`grep morph-d morph-svg.ts` → only the docstring); the engine writes ~130 invisible numeric props | a `--morph-d` (and `d:`) on the target whose value reassembles to a `d` distinct from both endpoints |
| `proof:morph-orients` `angle-channel` | `fromMorphSVG(from, to, { orient: true })` | no `orient` option exists; the tangent `angle` (`sampleAtLength`) is unconsumed | with `orient: true`, an `--morph-angle` channel tracks the tangent; with `orient: false` (default), it is ABSENT |
| `proof:morph-scene` `morph-renders` (**KEYSTONE**) | navigate `#/morph`, play the morph, read the rendered path `d` at mid-`t` | NO `morph` scene exists (`ls demo/app/scenes/` → no Morph); the primitive is undemoed | the LIVE subject's rendered `d` at mid-`t` is DISTINCT from BOTH endpoint shapes (a real morphing shape, not static / numeric-only) |
| `proof:morphsvg-consume` (extended) `demo-scene` | `grep "scene\|Scene" scripts/proof-morphsvg-consume.mjs` → nothing | the library gate has ZERO demo clauses (library-built-but-undemoed) | the gate asserts `MorphSVGScene.vue` exists + consumes `fromMorphSVG` |

**Born-RED kf-side TODAY (the keystone).** Verified this session: NO `--morph-d` write exists (`grep "morph-d\|setProperty" src/animation/morph-svg.ts` → only the two docstring lines `:70-71`; the impl `:237-239` is a bare `setTargets`); NO `orient` option / `--morph-angle` channel; NO `MorphSVGScene.vue` (`ls demo/app/scenes/`); `proof:morphsvg-consume` has zero scene clauses. The `morph-renders` clause's RED is the GENUINE defect (the primitive is undemoed AND a target-bearing morph renders nothing), not a proxy.

**Plant-a-failure (born-RED proof).** Before the wave: `proof:morph-renders-d` reds (no `--morph-d` write), `proof:morph-orients` reds (no `orient` option), `proof:morph-scene` reds (no `morph` scene — the nav 404s, the rendered `d` read throws). The dual born-RED structure: even if a future stub registers a `morph` scene that mounts a STATIC path (the render contract not wired), `morph-renders` STILL reds (the rendered `d` at mid-`t` equals an endpoint, or never changes) — the gate NEVER false-greens on a name-only proxy.

**Green condition.** The `--morph-d`/`d:` per-frame render contract wired + the false docstring corrected + zero-alloc on the steady frame (S1); orient-along-path behind the `orient` option over the published `sampleAtLength` tangent (S2); `MorphSVGScene.vue` authored + registered + `proof:morph-scene` GREEN incl. the LIVE rendered morph distinct-at-mid-`t` + `proof:morphsvg-consume` extended with the demo-scene clause (S3). The 3rd HEAVY geometry front door is finally demoed; the render-contract VAPOR is dissolved; the orient follow-on is terminalized with no deferral.

---

## Dependencies

- **`fromMorphSVG`/`MorphSVG` — already built + barrel-wired + gated** (`src/animation/morph-svg.ts`, `index.ts:143-150`, `load-engine.ts:46-47`; `proof:morphsvg-consume` GREEN). The render-contract fix is a LIBRARY edit on `morph-svg.ts`; the scene CONSUMES the built primitive through `loadAnimationEngine()`. NO new sibling publish.
- **value.js `PathGeometry.sampleAtLength` — already published + installed** (`path.d.ts:54`, `{ x, y, angle }`). The orient channel consumes the SAME `PathGeometry` already imported (`morph-svg.ts:45`) — NO new value.js edge, NO sibling publish.
- **The render-contract fix is the precondition of the scene** (the DAG edge `Q.WC4-MORPH-RENDER → Q.WC4-MORPH-SCENE`). A scene built before the render contract would mount a non-rendering subject (130 invisible numeric props) — the scene CONSUMES the `--morph-d`/`d:` channel S1 wires. Orient (S2) is independent of the scene.
- **Scene registration touches existing scene gates.** A new `morph` scene must satisfy `proof:scene-contract-identity`, `proof:scene-parity`, `proof:scene-machine-irrefragable`, and the dock — the scene is a full first-class scene (not a stub).
- **Independent of every other Band-C wave** (Q.WC1/Q.WC2 easing, Q.WC3 mobile, Q.WC5 amiga are file-disjoint). File surfaces: `src/animation/morph-svg.ts` (the render contract + orient — a LIBRARY edit), `test/morph-svg.test.ts` (lock the render + orient), `demo/app/scenes/MorphSVGScene.vue` (NEW), `demo/app/scenes.ts` + the dock + the scene machine (registration), `scripts/proof-morph-renders-d.mjs` / `proof-morph-orients.mjs` / `proof-morph-scene.mjs` (NEW), `scripts/proof-morphsvg-consume.mjs` (extend), `package.json` (gate roster), `.github/workflows/ci.yml` (the 3 new-gate `npm run` steps — gates job for the jsdom gates, demo-smoke job for `proof:morph-scene`).
- **NO glass-ui dep, NO parse-that dep, NO value.js PUBLISH dep.** A pure-NOW Band-C wave — it fires entirely on today's installed tree (the substrate — `fromMorphSVG` + `sampleAtLength` — is already there).

---

## dev→impl boundary

This file is the Tranche Q DEVELOPMENT spec for Q.WC4 — DOCS ONLY. It writes zero engine/demo/library source (inv-16: kf writes only keyframes.js; the `PathGeometry.sampleAtLength` it composes is a PUBLISHED value.js export consumed through the engine's existing edge, never a foreign-tree edit; this wave issues NO dispatch). The IMPLEMENTATION (the `--morph-d`/`d:` render contract + the docstring correction, the orient channel, the `MorphSVGScene.vue` build + registration, the three born-RED gates + the `proof:morphsvg-consume` extension, the `test/morph-svg.test.ts` locks) opens only on the owner's explicit authorization, DAG-ordered AFTER Q.WA3 master-merge. When it opens it is gate-first (the gates authored born-RED BEFORE the render/orient/scene land), observable-truth (the `morph-renders` keystone over the LIVE demo's rendered shape, an APPEARANCE/INTERACTION-axis assertion not a grep), no-legacy (the false docstring CORRECTED to match the wired write — the honest render contract; no second geometry home for orient), KISS (the render reassembles via the existing `sampleD`, zero-alloc on the steady frame; orient is a one-flag extension over the published sampler), gestalt (the scene is the THIRD HEAVY geometry front door's demo, beside MotionPath/DrawSVG), isomorphic (the `PathGeometry` sampler is DOM-free; the morph composes identically in jsdom + the browser), and P-invariant-28 (the three BOOKED-out MorphSVG follow-ons — render-vapor, orient, scene — are each terminalized HERE with no deferral).

---

## Mid-tranche-friction pre-emption

- **FRICTION: the `d:` CSS-property render path has uneven browser support (Chromium + recent Safari render `path()` in `d`; Firefox lags).** A single-channel `d:` write would silently fail on Firefox. **PRE-EMPT:** S1 writes BOTH the `d:` property AND the `--morph-d` custom property + exposes `MorphSVG.sampleD` as a JS reader — the documented-fallback render path is honest, not a single-browser bet.
- **FRICTION: orient at `samples=64` adds ~65 angle keys (~195 total) — could spawn a "morph is too heavy" perf deferral.** **PRE-EMPT:** S2 gates the orient channel BEHIND the `orient` option (default `false`), so a position-only morph stays at ~130 keys; AND S1 hoists the `interpFrames` buffer so the render path is zero-alloc on the steady frame.
- **FRICTION: registering a new `morph` scene touches `proof:scene-contract-identity` / `proof:scene-parity` / `proof:scene-machine-irrefragable` + the dock — an ad-hoc registration could red those gates mid-tranche.** **PRE-EMPT:** S3 mandates the scene satisfy those existing gates (a full first-class scene, the `MotionPath`/`Sequence` precedent), and the `proof:morph-scene` clause `scene-registered` asserts the machine registration explicitly.
- **FRICTION: `Q.WC4-MORPH-SCENE` built before `Q.WC4-MORPH-RENDER` would mount a non-rendering subject (130 invisible numeric props).** **PRE-EMPT:** the DAG hard-orders the render contract (S1) before the scene (S3) — the scene consumes the `--morph-d`/`d:` channel S1 wires.

---

## Bite — what regression each clause catches

| Clause | Regression it prevents |
|--------|------------------------|
| S1 `d-written` | The morph's `target` option documents a `--morph-d` write that does not exist (a no-legacy honesty violation) — a target-bearing morph paints 130 invisible numeric props and renders NO shape; the documented author channel is vapor |
| S2 `angle-channel` | The published `sampleAtLength` tangent stays unconsumed — orient-along-path rides as a BOOKED follow-on with no terminal home (a P-inv-28 risk under Q's no-deferral precept) |
| S3 `morph-renders` keystone | The library-built `fromMorphSVG` stays a DEAD demo-side export — the 3rd HEAVY geometry front door is unobserved in the running demo; a green source-shape gate (`proof:morphsvg-consume`) misses that the primitive renders nothing live (the gate-blindspot trap) |
| S3 `scene-registered` + scene-gates | A stub `morph` scene mounts a static path (the render contract not wired) and passes a name-only registration check while rendering no morph; OR the new scene reds the existing scene-contract/parity gates |
| S3 `proof:morphsvg-consume` (extended) | The library gate and the demo gate stay decoupled — the primitive can again be library-built-but-undemoed |

---

## Excluded from this wave

- **Topology-aware vertex correspondence** (the Flubber "matched point counts / shape resampling" for paths with wildly different command counts) — a DISPATCH if the matcher belongs in `PathGeometry` (a value.js arm); recorded as the separate `Q.WG2`-adjacent dispatch, NOT this wave. Uniform arc-length sampling at a fixed `samples` count is the correct floor (it guarantees engine-valid matched-count frames); smart-correspondence only improves quality, never validity.
- **The `animate({morph})` dispatch arm** — adding the morph shape to `animate.ts`'s construction-time dispatch (the from*-factory parity) is a separate NOW wave (`Q.W-MORPH-DISPATCH` in the audit), NOT folded here. Q.WC4 is the render-contract + orient + the demo scene.
- **Promoting `morph-svg.ts` to a LIGHT barrel export** — out of scope; it stays HEAVY behind `loadAnimationEngine()` (its `PathGeometry` import is a value.js edge).
- **The easing curve-editor / DemoControlPoint** (Q.WC1/Q.WC2), the mobile scene-switcher (Q.WC3), the amiga refinements (Q.WC5) — separate Band-C waves over disjoint file surfaces.
