# a26 — bench/ + taxonomy.json discipline audit (Tranche R deep audit, lane a26)

## Executive summary

The bench/taxonomy discipline that Tranche L established and Tranche P/Q extended survived Tranche R **intact and honestly maintained**. All 75 classified cases across the 8 gated suites are covered by `bench/taxonomy.json`; `proof:bench-taxonomy` runs clean (verified live — see §1). The one R-caused regression (bench files importing pre-refactor paths after the 7-zone partition + `animate()` excision + the `KeyframesAnimation` rename) was caught and fixed same-day by commit `6f2493d` ("R-fallout"), and the 6 `colorTail` SoA/boxed rows flagged by the orchestrator are correctly classified `observe-only`, consistent with their sibling boxed/SoA K=3/8/12 rows. R.W2's bench-hygiene promise (stop monkey-patching `AnimationGroup` private methods via `as any` from `bench/group-composite.bench.ts`) was also delivered as specified — the bench now calls `groupSoABlendLayer`/`boxedBlendArm` directly as exported internals.

The residue Tranche S inherits is not a broken gate — it's an **uncovered frontier**: the 887-line emerging-CSS `resolve/` pipeline (`if()`/`@function`/`env()` — a full HEAVY zone with its own barrel) has **zero** bench coverage anywhere in the 10 `*.bench.ts` files, and no bench measures the `./engine` subpath / dynamic-import cost model beyond the single `warmEngine` pre-resolve microtask case. There is also a stale-prose smell: the taxonomy's own header comment and `proof-bench-taxonomy.mjs`'s docstring still narrate the warmEngine case as "BORN-RED TODAY" / "unimplemented," when the case itself has been SHIPPED and PASSING since L.W7 S6 — comment rot Tranche R's fusion passes did not touch (out of R's scope, but S should sweep it while it's touching this file).

## Findings

### 1. proof:bench-taxonomy is GREEN and its coverage claim holds (verified live)

Ran `node scripts/proof-bench-taxonomy.mjs` (read-only; spawns `vitest bench --run` for the 8 named suites). Full PASS:
```
✓ [cross-repo] VJ.L1–VJ.L8 dispatched
✓ [run] vitest bench --run over 8 suites exited 0
✓ [coverage] every reported bench case is classified; every classified case is reported (75 cases)
✓ [non-empty] every classified case reported a finite positive hz
✓ [budgeted] K=8 SoA float64 case held 222418.0 hz >= 17097.0 hz floor
✓ [budgeted] vector K=8 SpringVectorProbe held 52075.3 hz >= 11518.8 hz floor
✓ [budgeted] warmEngine pre-resolve held 12131578.4 hz >= 1000.0 hz floor
```
Category distribution: `observe-only` 40, `run-check` 32, `budgeted` 3 (verified via `python3 -c` count over `bench/taxonomy.json`). No orphan cases, no stale manifest entries. Severity: info (confirms the gate is not cosmetic — the orchestrator's brief specifically asked to verify this, and it holds).

### 2. All 6 colorTail rows are correctly classified — no post-R miscategorization

`bench/taxonomy.json` lines for `colorTail boxed/SoA · K=3/8/12 · 600-frame window` (all 6) are `observe-only`, matching `bench/interp-buffer.bench.ts:425` (`describe("colorTail — channel-plan SoA vs boxed (Q.WB3 S4, measure-first)"`). This is consistent with the sibling plain-numeric `processFrame boxed/SoA · K=3/8/12` rows, which are also `observe-only` (measure-first, no floor asserted yet — correct posture for a case still gathering baseline data, per the taxonomy's own `observe-only` semantics: "bench runs; result recorded; no floor; re-run sets a new baseline"). Severity: info — no finding, confirms orchestrator's suspicion was unfounded.

### 3. Bench realism: all 8 gated suites import the CURRENT post-R API surface

Grepped every `import … from "../src/animation/…"` across the 10 `*.bench.ts` files. All resolve to post-partition zone paths: `../src/animation/engine`, `/group`, `/group/soa`, `/group/compositor`, `/physics/spring`, `/physics/playback`, `/physics/smooth`, `/waapi`, `/easing`. None reference the pre-R flat `animation.ts`/`group.ts` locations or the excised `animate()` free function. The one regression this produced — `bench/interp-buffer.bench.ts` and `bench/waapi-densify.bench.ts` broke against `CSSKeyframesAnimation`'s new home and the `KeyframesAnimation` rename — was caught and fixed same-day in `6f2493d` ("R-fallout — interp-buffer touches CSSKeyframesAnimation (animate() excised R.W4); waapi-densify uses KeyframesAnimation type (renamed 5.0.0)"), which is an honest, correctly-scoped fix commit (2 files, 4+/2- lines). Severity: info.

### 4. R.W2's bench-hygiene fix (kill the `as any` monkey-patch) was delivered as promised

`docs/tranches/R/waves/R.W2.md:199-209` calls out `group.ts:505-507`'s `soaBlendLayer` private wrapper as existing "only for bench/group-composite.bench.ts monkey-patch via `as any`" and mandates excising it in favor of the bench calling `groupSoABlendLayer` directly. Verified in the shipped tree: `bench/group-composite.bench.ts:45-46` imports `groupSoABlendLayer` from `../src/animation/group/soa` and `boxedBlendArm` from `../src/animation/group/compositor` directly — no `as any`, no private-method reach-around. `PROGRESS.md:49` confirms this landed at R.W2 (`81a5114`). SPEC = SHIPPED here, cleanly. Severity: info.

### 5. GAP — zero bench coverage of the `resolve/` zone (emerging-CSS `if()`/`@function`/`env()`)

`src/animation/resolve/` is 887 lines across `index.ts` (289L), `resolve-function.ts` (265L), `resolve-if.ts` (199L), `env.ts` (134L) — a full HEAVY zone with its own barrel, gated by three correctness proofs (`proof:emerging-css-resolve-now`, `-p2`, `-fn`). No `*.bench.ts` file imports anything from `resolve/`; grepping all 10 bench files for `resolve/`, `emerging-css`, `resolveKeyframes` finds zero suite-level hits (only `loadAnimationEngine` reference in `interp-buffer.bench.ts`, which is the barrel-level dynamic import, not the resolve pipeline itself). This is a real perf-frontier blind spot: `if()`/`@function` resolution runs per-frame for any keyframe using CSS conditional values, and its cost (recursive AST walk + env lookups) is entirely unmeasured. Severity: medium — not a regression (this gap predates R; R didn't introduce it, and R's charter was structural, not perf-frontier expansion), but it is squarely in-scope for S per the mission brief ("perf-frontier benches S should ADD… resolve pipeline").

### 6. GAP — no bench isolates the `./engine` subpath / dynamic-import cost beyond one microtask case

R.W-era work added the `@mkbabb/keyframes.js/engine` static subpath (39-key mirror, per MEMORY.md Tranche R record) specifically to give consumers a static-import alternative to `loadAnimationEngine()`. The only bench touching import cost is `interp-buffer.bench.ts`'s single `warmEngine — loadAnimationEngine resolves before first animate` case, which measures the *microtask resolve* after warm, not the *cold import weight* of the subpath vs. the dynamic loader, nor the chunk-split boundary cost the barrel/`load-engine.ts` split was built to amortize. There is no bench comparing `import { CSSKeyframesAnimation } from "@mkbabb/keyframes.js/engine"` (static) against `await loadAnimationEngine()` (dynamic) for cold-start latency — the exact tradeoff the R.W1 boundary design is supposed to let consumers make an informed choice about. Severity: medium — the taxonomy's own $comment block flags "every bench-backed SOTA claim... is un-budgeted" as a known gap (pre-R, L.W7); this is a specific, unaddressed instance of that same category that R's subpath work created new surface for without a matching bench.

### 7. Comment rot: taxonomy.json header + proof-bench-taxonomy.mjs docstring narrate a stale "BORN-RED" state

`bench/taxonomy.json:30-33` ("BORN-RED today: proof:bench-taxonomy does not exist... this manifest's `budgeted` cases name bench arms that L.W7's cures have not shipped yet (warmEngine pre-resolve)") and `scripts/proof-bench-taxonomy.mjs:39-47` (same claim, plus "the gate cannot find the case in the report and fails the budgeted-coverage clause") both describe a state that is no longer true: the `warmEngine` case's own `$note` at `bench/taxonomy.json:351` says "SHIPPED at S1... + S6 (this arm); was the born-RED pendingBudgeted witness until both landed," and the live run in Finding 1 shows it PASSING at 12.1M hz. This is pre-R rot (L.W7-era), not something R introduced, but R's fusion/decomposition passes touched adjacent files (`bench/interp-buffer.bench.ts`, `bench/waapi-densify.bench.ts` in `6f2493d`) without sweeping this stale narration in the same file family. Low severity (doesn't affect gate correctness — `pendingBudgeted: []` is empty and correct), but it is exactly the kind of prose-drifts-from-reality residue the mission brief asks S to fold.

### 8. Minor: `CLAUDE.md`'s "seven cohesive zone directories" undercounts — `waapi/` is an unlisted 8th HEAVY zone with its own bench

`/Users/mkbabb/Programming/keyframes.js/CLAUDE.md:20-22` claims "seven cohesive zone directories (R.W1)" and enumerates `physics/`, `orchestration/` (LIGHT) + `engine/`, `group/`, `compile/`, `resolve/`, `ingest/`, `scroll/` (HEAVY) — that's 8 already, not counting `presets/`/`svg/` mentioned in the same sentence as riding the engine surface. `src/animation/waapi/` (5 files: `delegation.ts`, `densify.ts`, `eligibility.ts`, `emission.ts`, `index.ts`) is a real zone at the same directory depth with its own barrel and is directly benched by `bench/waapi-densify.bench.ts` — but it's absent from the zone list, and line 104 of the same file still refers to it as a single file (`waapi.ts`) rather than the directory it now is. This is a docs-accuracy defect adjacent to the bench lane (an agent reading CLAUDE.md to find "what to bench next" would miss `waapi/` as a zone entirely) but is primarily a docs-audit-lane finding; flagged here for cross-reference since it directly affects "does bench coverage map onto the documented zone structure."

## Tranche-S implications

1. **Add a `resolve/` pipeline bench suite** (`bench/resolve.bench.ts`, `observe-only` to start): `if()` single-condition, `if()` nested/multi-branch, `@function` with args, `env()` lookup miss/hit — mirrors the interpolation.bench.ts realism ladder (cold vs. full-pipeline). Wire into `bench/taxonomy.json` `suites[]` + `cases[]`; this closes Finding 5.
2. **Add a static-subpath-vs-dynamic-loader cold-import bench** distinct from the existing warm microtask case — e.g. spawn-per-iteration or `performance.now()` around a fresh dynamic `import()` of `./engine` vs. the barrel's `loadAnimationEngine()`, `observe-only` (import timing is process/cache-state-dependent, not a stable `hz` floor candidate). Closes Finding 6 and gives the SoA-compositor-adjacent "does the boundary pay for itself" claim (R.W1's core thesis) an actual number.
3. **Sweep the stale "BORN-RED TODAY" narration** in `bench/taxonomy.json`'s header `$comment` and `scripts/proof-bench-taxonomy.mjs`'s docstring (lines ~30-47 and ~39-47 respectively) to reflect the shipped/passing state — low effort, do it as a fold-in when S next touches either file (don't spin a standalone wave for prose alone).
4. **Reconcile the zone count** in top-level `CLAUDE.md` (7-vs-actual-8-plus HEAVY zones, `waapi.ts`-vs-`waapi/`) — hand to the docs-audit lane, but note the bench-mapping angle here so S's zone-sub-partition wave (`compile/backward/`, `compile/easing/`, `engine/css/` per the mission brief) also decides where `waapi/` sits and updates the bench-to-zone map in the same pass.
5. No structural fix needed to `proof-bench-taxonomy.mjs` itself or the category semantics (`run-check`/`observe-only`/`budgeted`/`cross-repo`) — they are sound, correctly enforced, and correctly device-honest (`declarePosture`). S should extend the manifest, not rearchitect it.
