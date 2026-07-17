# Lane R1-12 — PERFORMANCE TRUTH

Finding-ID prefix: `PF-`. Auditor: R1-12. Date: 2026-07-16. Repo: `/Users/mkbabb/Programming/keyframes.js` (working tree carries the uncommitted Value-4 transposition).

## Verdict

The per-frame hot paths are genuinely well-engineered and survive the Value-4 (value.js 4.0.0) transposition intact: `processFrame` folds numeric slots through a compile-time-cached `_numericPlan`, the group compositor reuses long-lived buffers and rebuilds SoA plans only on structural change, and `parse()` does all value.js parsing once at compile time — no per-frame re-parse anywhere I read. Every bench suite typechecks clean (`tsc -p tsconfig.test.json`, which includes `bench/`, EXIT=0) and the two benches I ran (`resolve.bench.ts`, `group-soa-integration.mjs`) execute against the current source. The deleted `group-soa-validate.mjs` was replaced by `group-soa-integration.mjs`, which runs.

BUT the bench manifest is a lie for one suite. `bench/interp-buffer.bench.ts` was gutted in this transaction (−503 lines, now 91 lines): it generates 7 cases, but `bench/taxonomy.json` still lists **23** interp-buffer cases and **not one name matches**. Three of the deleted rows were `budgeted` floors (`colorTail SoA · K=3/8/12` @4.0×, `K=8 … SoA Float64Array+lerpArray` @1.2×, `warmEngine …` @1000 hz). This went undetected because **nothing consumes `taxonomy.json`** — no gate, script, workflow, or test reads it — so the "budgeted" regime it declares is inert, and a source comment (`interpolate.ts:259`) still cites one of the deleted rows as the ADOPT provenance for a shipped code path. That is the P1 of this lane; the rest are P2/P3.

---

## PF-1 — `taxonomy.json` references 23 deleted/renamed interp-buffer cases (0 of 23 match)

- Severity: **P1**
- Family: stale-manifest / deleted-code-provenance

`bench/interp-buffer.bench.ts` diff in this transaction: `503 ++++------ (mostly deletions)`, file is now 91 lines. Actual generated cases (from `grep -nE "bench\(|for \(const" bench/interp-buffer.bench.ts`):

- L41/L45: `` K=${keys} · 600-frame steady window `` for `keys ∈ [2,5,12]` → 3 cases
- L60/L74: `` NumericFoldPlan · K=${keys} · 600-frame window `` for `keys ∈ [3,8,12]` → 3 cases
- L85: `memoized heavy surface` → 1 case

Total **7** cases. `bench/taxonomy.json` still lists **23** interp-buffer cases (verified: `python3 … [c for c in cases if 'interp-buffer' in c.suite]` → 23). The taxonomy names, none of which exist in the file:

- `colorTail residual/SoA · K=3/8/12 · 600-frame window` (6) — **DELETED**; the `colorTail SoA · K=3/8/12` rows are `budgeted` (floorFraction 4.0, baselineCase `colorTail residual …`).
- `processFrame residual/SoA · K=3/8/12 · 600-frame window` (6) — **DELETED** (the surviving cases are renamed `NumericFoldPlan · K=…` with no residual twin).
- `K=8 (translate3d+scale3d+rotateZ+opacity) · per-channel _lerp (current)` + `· SoA Float64Array+lerpArray` (2) — **DELETED**; the SoA arm is `budgeted` (floorFraction 1.2).
- `K=10 (rotate expands ×3) · …` (2), `K=8 · dispatch-only · …` (2), `calc() leaf · 600-frame steady window` (1) — **DELETED**.
- `warmEngine — loadAnimationEngine resolves before first animate` — `budgeted` (floorHz 1000) — the actual case is named `memoized heavy surface` (L85). **Name mismatch.**
- `K=2/5/12 · 600-frame steady window (threaded buffer)` — the `(threaded buffer)` suffix does not exist in the file (actual: `K=2 · 600-frame steady window`).

So **every** `budgeted` interp-buffer floor in the manifest (`colorTail SoA` ×3, `K=8 SoA lerpArray`, `warmEngine`) points at a bench case that was deleted or renamed in this transaction. By contrast I reconciled the other loop-generated suites and they are current: `compile` (profiles `[2,6,11,50,200]` + `[50,200]×2` = 9 ✓), `group-composite` (`replace/add residual/add SoA/weight residual/weight SoA × K=3/8/12` = 15 ✓), `spring-tick` (3 regimes + reseat + scalar/vector + reseatToSpring/decayRest = 8 ✓), `parser`/`interpolation`/`cold-import`/`sync-step`/`resolve` (no loops, exact ✓). The staleness is isolated to interp-buffer.

Disposition: **build** a V-wave that reconciles `taxonomy.json`'s interp-buffer block against the 7 surviving cases (rename `processFrame …` → `NumericFoldPlan …`, drop the deleted `colorTail`/`K=10`/`dispatch-only`/`calc() leaf`/`translate3d SoA` rows, rename `warmEngine …` → `memoized heavy surface`, drop the `(threaded buffer)` suffix). Then decide: either re-author the deleted comparative SoA-vs-residual benches (they were the evidence for the ADOPT floors — see PF-3) or formally retire the floors. Pair with PF-2 (make the manifest enforceable) so the next transposition cannot silently strand it again.

---

## PF-2 — `taxonomy.json` is inert: no consumer, so `budgeted` floors cannot fail (vacuous)

- Severity: **P2**
- Family: vacuous-gate / green-over-broken

`grep -rl "taxonomy"` across the repo (excluding `node_modules` and `bench/taxonomy.json` itself) returns only: four bench files that mention it *in comments* (`group-composite`, `resolve`, `cold-import`, `spring-tick`), `test/presets/spring-presets.test.ts` (the word "taxonomy" in an unrelated context), `scripts/gates/surface/index.mjs:7` (a comment: "not a public gate taxonomy"), and docs. **No script, gate, `.github/workflows/*.yml`, or test reads `bench/taxonomy.json`.** `npm run bench` = `vitest bench` (package.json) — it runs suites and prints `hz`; it never loads the manifest.

The manifest declares a budget regime — `category: "budgeted"`, `floorFraction`, `baselineCase`, and prose like *"Each SoA arm **must run** >= 4.0x its residual twin"* (S.F5a section) — but the bench files contain **no floor assertions** (`grep "expect\|floorHz\|floorFraction\|throw.*floor"` in the budgeted suites finds only `throw new Error("unreachable")` sinks and warm-up guards, no budget predicate). `floorHz` is not even a top-level key (`'floorHz' in d` → False). So "budgeted" is documentation with no runner: a 2× regression prints a slower number and the suite stays green. This is exactly why PF-1 went unnoticed — an unread manifest cannot detect that its rows no longer match the code.

Disposition: **build or retire.** Either add a `scripts/bench/verify-taxonomy.mjs` that (a) asserts every `cases[].name` maps to a real generated bench case (would have caught PF-1) and (b) enforces `floorFraction` against a recorded bench run under the declared `declarePosture` (observe-in-CI / HARD-on-device the $comment already claims exists), or downgrade the manifest's language from "budgeted / must run" to honestly-observe-only and delete the floor fields. The current state — enforcement-shaped fields with zero enforcement — is the vacuous-gate anti-pattern.

---

## PF-3 — Shipped code cites a deleted bench row as its ADOPT provenance

- Severity: **P2**
- Family: deleted-code-provenance / dangling-evidence

`src/animation/engine/interpolate.ts:257-259` (the live `processFrame` numeric-SoA fold, on the dominant single-animation hot path):

```
// Q.WB3 S2 — the numeric SoA fold (ADOPT-verdicted; the interp-equal +
// fold-taken oracles live in `test/engine/processframe-soa-identity.test.ts`,
// the ADOPT floor in `bench/taxonomy.json`'s budgeted K=8 SoA-lerpArray row).
```

That "`budgeted K=8 SoA-lerpArray row`" is `K=8 (translate3d+scale3d+rotateZ+opacity) · SoA Float64Array+lerpArray · 600-frame window` — one of the interp-buffer cases **deleted in this transaction** (PF-1). The comparative bench that produced the ADOPT verdict (the `per-channel _lerp (current)` twin measured against the `SoA Float64Array+lerpArray` arm) no longer exists; the surviving `NumericFoldPlan · K=8` case is an absolute run-check with no residual twin to divide against, so the 1.2× ADOPT floor is no longer reproducible from the tree. The identity test (`processframe-soa-identity.test.ts`) still proves *correctness*, but the *perf* justification the comment claims is stranded. A reader auditing why the SoA fold ships is pointed at a bench row that isn't there.

Disposition: **fold** into the PF-1 reconciliation wave — either re-author the comparative `SoA vs per-channel _lerp` interp-buffer case (restoring the evidence the comment names) or amend `interpolate.ts:259` to cite whatever surviving artifact carries the ADOPT number (`NumericFoldPlan` run-check, or `group-composite`'s SoA rows). Do not leave a shipped hot path citing a deleted measurement.

---

## PF-4 — Coverage-completeness claim is false: two on-disk `.bench.ts` suites are uncovered

- Severity: **P3**
- Family: stale-manifest / coverage-claim

`taxonomy.json`'s `$comment` asserts *"This manifest maps each bench case to ONE category."* The `suites` array lists 10 files. But `bench/*.bench.ts` on disk is 12 files (`vitest.config.ts:35` includes `bench/*.bench.ts`). The two missing from both `suites` and `cases`:

- `bench/computed-real-dom.bench.ts` — has real `bench()` cases (L269) under `describe("G.W16 S2 — the real-DOM computed-unit corpus…")`.
- `bench/playwright.bench.ts` — has `bench()` cases (L331) under `describe("LoAF >50ms-trace gate…")`.

Both self-skip without a browser (`process.env.KF_PLAYWRIGHT_DIR` / jsdom guard) and are meant to run separately, so the omission is *arguably* intentional — but the manifest's blanket "each bench case" claim is then false, and these two suites (which `vitest bench`'s glob **does** pick up) are silently uncategorized. If the intent is "vitest-runnable cases only," the $comment should say so and the two browser suites should be listed with an explicit `browser-only`/excluded category (mirroring how `cross-repo` cases are explicitly enumerated).

Disposition: **fold** into the PF-1/PF-2 wave — add the two suites with an explicit exclusion category, or narrow the $comment's completeness claim to the vitest-runnable set.

---

## PF-5 — `group-soa-integration.mjs` is an orphan measurement (no runner), same as the file it replaced

- Severity: **P3**
- Family: orphan-artifact / unenforced-measurement

`bench/group-soa-validate.mjs` was **deleted** (−159 lines) and `bench/group-soa-integration.mjs` was modified (its replacement, per the header: *"the isolated blend is 3.7x faster (group-soa-validate.mjs); this measures the blend's SHARE…"*). It runs against current source — I executed it:

```
$ npx tsx bench/group-soa-integration.mjs
… "layers_3": { "wholeFrameWin": 1.09, "verdict": "MODEST (1.05-1.15x …)" },
   "layers_4": { "wholeFrameWin": 1.09, "verdict": "MODEST …" }
```

It exercises the real API (`AnimationGroup.transformFramesGrouped`, `getEntries`, `interpFrames` — all present) and is honest (verdict = MODEST, not a win claim). But it hardcodes `BLEND_SPEEDUP = 3.67` and — like the deleted `validate.mjs` — has **no runner**: `grep` finds no npm script, workflow, or gate that invokes any `.mjs` bench. It is a manual, documentation-grade artifact. Worth noting because the whole-frame SoA win it measures is only **1.09×** (blend is ~11% of the frame), which is materially weaker than the 3.67× isolated-blend headline the compositor SoA transposition is justified by — a reader should not mistake the isolated-arm ratio for the delivered speedup.

Disposition: **retire or wire.** Either give the `.mjs` measurements a `bench:mjs` npm script so they're reproducible on demand, or delete them as one-shot spikes (the compositor SoA decision is already sealed). Do not leave orphan speedup scripts implying enforcement.

---

## Negatives (checked and found sound)

- **All benches typecheck against current source.** `npx tsc --noEmit -p tsconfig.test.json` (include: `["test/", "bench/", "demo/env.d.ts"]`) → EXIT=0, 0 `error TS`. Every modified bench (`compile`, `computed-real-dom`, `group-composite`, `interp-buffer`, `parser`, `resolve`, `waapi-densify`, `playwright`) resolves its imports against the Value-4 tree. `residualBlendArm` (compositor.ts:225), `groupSoABlendLayer`/`buildSoAPlans` (soa.ts:23/59), `resolveKeyframes` (adapter.ts:266), `densifyInteriorTimes` (waapi/densify.ts:239), `warmEngine`/`loadAnimationEngine` (load-engine.ts:123/127, re-exported index.ts:308) all present.
- **`resolve.bench.ts` runs clean** — 7 cases, both `demo` and `library` vitest projects, positive `hz` throughout.
- **No per-frame re-parse of Value-4.** `frame-compiler.ts` `parse()` calls `parseAndFlattenObject` once per template frame (L367) at compile time; `finalizeFrameVars` (L403) builds `_numericPlan` once. Nothing in `interpolate.ts`/`interp-slot.ts`/`soa.ts`/`compositor.ts` re-parses a string per frame.
- **Hot paths are allocation-lean.** `interpolate.ts` `interpFrames`/`processFrame` are module functions (no per-frame closure), reuse the `out` buffer via stable-key null-fill (`clearBuffer`, L228 — no `delete`), and the numeric fold writes into the compiled `Float64Array` `plan.out` (L269-275). `compositor.ts` `compositeFrame` rebuilds SoA plans only on the `groupedKeysDirty` structural seam (L59-74, L152-160), never per steady-state frame; buffers (`state.grouped`, `state.compositeBuf`) are long-lived. `interp-slot.ts` computed slot caches on `getLayoutEpoch()` (L280-299) so `getComputedStyle` is not re-read per frame.
- **Taxonomy names for the 8 other suites reconcile** with actual generated `bench()` names (loop-expanded counts verified: compile 9, group-composite 15, spring-tick 8, plus the non-loop exact suites).
- **Monaco lazy-load intact; no library-into-demo duplicate.** A real, non-vacuous eager-leak gate (`scripts/gates/surface/index.mjs:36`, `forbiddenEntryEdges = ["vendor-monaco","vendor-highlight","vendor-three","worker-"]`) reads the built demo `index-*.js` and hard-fails if the entry chunk references any editor/vendor chunk (L41-44). `vite.config.ts` `modulePreload.resolveDependencies` (L280-287) strips `lazyChunks` from `<link modulepreload>`, and `advancedChunks.groups` (L301-338) isolate monaco/three/prettier/highlight. The library build externalizes `vue` + the six `@mkbabb/value.js/*` subpaths (L183-191), so value.js is not bundled into the library. (Caveat, not a finding: the eager-leak gate is `deferred` — skipped — when `dist/gh-pages` is absent on the library publish path, L60; it bites only when the demo is built.)

### Minor observation (folded here, not a standalone finding)

- `interp-slot.ts:262-265` allocates a fresh options object `{ space, ...(hue?…) }` per frame per color slot inside `interpolateSlot`'s `case "color"`, plus the `mixColors` Result. This is a per-frame allocation, but only on the color path — the dominant numeric path folds through the pre-allocated `_numericPlan`, so it does not touch the steady-state translate/scale/opacity hot loop. Candidate micro-opt if color-heavy animations ever profile hot; not urgent.

## Coverage gaps

- Did **not** run the full `vitest bench` suite, the playwright bench, or `computed-real-dom.bench.ts` (browser-only, and the lane forbids long/browser suites). Runnability of those two is inferred from EXIT=0 typecheck + their self-skip guards, not observed execution.
- Did **not** measure runtime perf against a prior-tranche baseline — the manifest carries no `floorHz` numbers and there is no recorded baseline in-tree to diff against, so "no regression" is unverifiable by this lane. This is itself part of PF-2 (the budget regime is unenforced).
- Did **not** audit value.js 4.0.0 internal allocation behavior (sibling repo, read-only; out of lane).
- The demo bundle byte-size was **not** measured (no `dist/gh-pages` built; building it was out of scope). Only the structural anti-duplication config + eager-leak gate were verified, not actual chunk byte budgets (there is no byte-budget gate in-tree; `chunk-analyzer.ts` is an opt-in `KF_ANALYZE=1` diagnostic, not an assertion).
