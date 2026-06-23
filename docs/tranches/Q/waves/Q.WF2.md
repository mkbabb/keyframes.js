# Q.WF2 — The group.ts SoA decomposition: extract the `_soaPlans`/`_compositeBuf`/`SoALayerPlan` fold machinery into `group-soa.ts`, restore `proof:decomposition` to green

**Band:** F — Engine-split (the architectural transposition)
**Phase:** NOW — kf-internal, executable on authorization. No cross-repo gate. Sequenced BEFORE Q.WF1 (engine-seam split) to establish a clean `proof:decomposition` baseline.
**Sequence (the DAG edge):** `Q.WA3 master-merge-reconcile → Q.WF2` (this wave, restores `proof:decomposition` to green) `→ Q.WF1` (engine-seam split, inherits the clean baseline). Q.WF2 resolves the group.ts over-cap failure so Q.WF1's born-RED witness (the engine.ts override removal) is ISOLATED as the sole remaining failure.
**Owning chronic/DM:** DF-11-B (the co-deferred group.ts compositor-seam split — P-invariant-28; `proof-decomposition.mjs:200-205` BORN-RED HANDOFF verbatim: "the deep compositor-seam split … still rides WITH the engine.ts transposition the D.W4 audit named … deferred to the same future tranche"). `proof:decomposition` is currently RED on HEAD (exit 1, naming group.ts at 1083L — 263L over the 820L override cap). Audit lanes: B1-kf-soa, B2-ow7-enginesplit.

---

## Context

The P.W2 SoA compositor fold shipped (commit `495484a`) and is genuine, measured (3.7×, bit-identical, K-monotone) — a real strength. But the same commit grew `group.ts` from 812L to **1083L**, which is **263L over** its 820L `LIBRARY_CEILING_OVERRIDE` cap. The B2-ow7-enginesplit audit lane (2026-06-23) confirmed:

- `proof:decomposition` exits 1 on HEAD naming `src/animation/group.ts: 1084L exceeds the 820L library ceiling`.
- The P impl drive ALSO pushed `load-engine.ts` to 565L (over the 550L base) and `frame-compiler.ts` to 553L (over the 550L base), contributing to two additional `proof:decomposition` failures. Q.WA3 (master-merge reconcile) addresses these; Q.WF2 addresses the group.ts failure specifically.
- `group-layer-springs.ts` already exists (10 974 bytes) as a precedent INTERNAL module — the K.W11 PHYS-C spring-weight helpers were already externalized there. Q.WF2 follows the same extraction pattern.

The SoA fold machinery is the natural decomposition seam: `SoALayerPlan` (the type), `_soaPlans: SoALayerPlan[] | null`, `_compositeBuf: Float64Array | null`, `soaBlendLayer(plan)` (the per-layer fold), and `buildSoAPlans(entries)` (the plan builder) form a self-contained, cohesive unit — 130–140L — that rides the structural-change seam (`_groupedKeysDirty`) and the per-frame fold, but has NO dependency on the managed-child lifecycle, the scheduler-yield batching, or the spring-weight concerns that are the reason group.ts's remaining inline code must stay inline. The extraction is evidence-driven, not line-count-for-its-own-sake: the `proof:spring-blend-weight` and `proof:blend` gates LOCK the composite STATEMENTS (the `?? layer.weight` read, `layer.weightSpring = spring`, the per-frame `spring.tickDt(dt)`, the settle commit/clear) ON the group.ts seam. Those stay. The SoA fold machinery (`SoALayerPlan`, `soaBlendLayer`, `buildSoAPlans`, `_soaPlans`, `_compositeBuf`) does NOT need to be inline — it is purely additive plumbing `group.ts` calls at the `_groupedKeysDirty` seam and the per-frame fold invocation site.

The B1-kf-soa audit lane additionally confirms: the K-scaling verdict is under-witnessed in the durable `soa-composite-decision.json` (it records only K=8; the K=3/K=12 monotonicity is never durably recorded). Q.WF2 takes the opportunity to extend `proof:soa-composite` with a `k-ladder-monotone` clause as part of the gate repair — this is the gate-honesty obligation the B1-kf-soa lane identified.

The extraction DOES NOT change the blend's observable semantics. `proof:blend` (byte-exact oracle over `test/blend.test.ts` + `test/group.test.ts` + `test/iw0-cube-composite.test.ts`) is the regression authority. `proof:spring-blend-weight` (the K.W11 PHYS-C weighted-blend gate) stays GREEN. `proof:soa-composite` extends with the `k-ladder-monotone` clause (not a new gate — an existing gate gaining an additional arm).

### The over-cap breach and its seam

`group.ts` grew from 812L (the K.W11 pre-drive cap, under 820) to 1083L post-P.W2 because `buildSoAPlans` (~100L) and `soaBlendLayer` (~25L) landed inline. The 820 override was authored when the SoA machinery DID NOT YET EXIST — the override `why` at `proof-decomposition.mjs:174-206` explicitly defers the "deep compositor-seam split" pending the engine transposition, but it does NOT justify keeping the SoA fold machinery inline — that is a separable cohesive module the group.ts inline body does not NEED to hold for the spring/composite STATEMENTS to stay locked on the seam.

The SoA machinery's natural INTERNAL home is `src/animation/group-soa.ts` (beside `group-layer-springs.ts`) — statically imported by `group.ts`, never re-exported.

### Current state and the B1-kf-soa K-ladder witness gap

`scripts/group-soa-decision.json` records only K=8 (add `1.973×` / weighted `2.325×` — a recent re-run value). The original bench measured K=3/K=8/K=12 (K-monotone: add 2.25×/2.29×/2.38×; weighted 2.19×/2.27×/2.34×) but the decision JSON captures only K=8. The `proof:soa-composite` gate (`scripts/proof-soa-composite.mjs:149-152`) reads only the K=8 pair and writes only K=8 to the decision JSON. Q.WF2 extends the gate to durably record ALL THREE K-rungs and assert K-monotonicity in the decision JSON — the B1-kf-soa `k-ladder-monotone` clause.

### Audit evidence

| Ref | Source location | Fact (verified 2026-06-23) |
|-----|-----------------|----------------------------|
| B2-ow7-enginesplit | `node scripts/proof-decomposition.mjs` on HEAD | **exit 1** — `src/animation/group.ts: 1084L exceeds the 820L library ceiling` |
| B1-kf-soa | `wc -l src/animation/group.ts` | **1083L** — 263L over the 820L cap |
| B1-kf-soa | `proof-decomposition.mjs:174-206` | 820L cap entry with BORN-RED HANDOFF text for the deep compositor-seam split |
| B1-kf-soa | `group.ts:56-75` | `SoALayerPlan` interface definition |
| B1-kf-soa | `group.ts:177,185` | `private _soaPlans: SoALayerPlan[] | null = null` + `private _compositeBuf: Float64Array | null = null` |
| B1-kf-soa | `group.ts:536-556` | `private soaBlendLayer(plan: SoALayerPlan): void` — 22L, self-contained |
| B1-kf-soa | `group.ts:575-666` | `private buildSoAPlans(entries: AnimationGroupEntry<V>[]): SoALayerPlan[]` — 92L, self-contained |
| B1-kf-soa | `scripts/group-soa-decision.json` | records K=8 only (add `1.973×` / weighted `2.325×`); K=3/K=12 missing from durable record |
| B1-kf-soa | `scripts/proof-soa-composite.mjs:149-152` | reads only K=8 pair, writes only K=8 — the k-ladder-monotone witness gap |
| extraction precedent | `src/animation/group-layer-springs.ts` (10 974 bytes) | the existing INTERNAL companion module — the exact extraction pattern this wave extends |
| oracle | `package.json:84` (`proof:blend`) | `scripts/proof-blend.mjs` + `test/blend.test.ts` + corpus `test/group.test.ts` + `test/iw0-cube-composite.test.ts` — the byte-exact regression authority |

---

## Scope

Each S-clause is a concrete, falsifiable deliverable.

- **S1 — Extract `SoALayerPlan`, `soaBlendLayer`, `buildSoAPlans`, `_soaPlans`, and `_compositeBuf` into `src/animation/group-soa.ts`.** The new module is a colocated INTERNAL `group-soa.ts` (beside `group-layer-springs.ts`), statically imported by `group.ts`, never re-exported. Exports: the `SoALayerPlan` interface + `buildSoAPlans` function + `soaBlendLayer` function. The `_soaPlans: SoALayerPlan[] | null` and `_compositeBuf: Float64Array | null` fields remain on `AnimationGroup` (they are instance state, not free-function concerns) — what moves is the TYPE definition and the two FUNCTIONS that construct and fold the plans. `group.ts` calls `buildSoAPlans` (imported) and `soaBlendLayer` (imported) at the same structural-change seam and per-frame invocation site as today. ZERO semantic change — purely a file-boundary move.

- **S2 — Re-write the `group.ts` override entry in `proof-decomposition.mjs`.** Post-extraction `group.ts` must fall to ≤ 820L (re-verified by `wc -l`). The `LIBRARY_CEILING_OVERRIDE` entry for `group.ts` (cap 820, the `proof-decomposition.mjs:174-206` entry) is EITHER removed (if post-extraction ≤ 550L base — unlikely) OR re-written to a measured post-extraction cap at or below 820 with a revised `why` that replaces the BORN-RED HANDOFF text with "the SoA fold machinery extracted to `group-soa.ts`; the deep compositor-seam split (buffer/blend/lifecycle/batch fully separated) remains the named future work, pending Q.WF1's engine re-threading." The stale-override guard (`proof-decomposition.mjs:381-389`) ensures the override is re-pointed accurately — it REDS if the entry cap exceeds the actual file size.

- **S3 — Extend `proof:soa-composite` with the `k-ladder-monotone` clause.** Extend `scripts/proof-soa-composite.mjs` to (a) run the K=3/K=8/K=12 bench ladder and record ALL THREE rungs in `scripts/group-soa-decision.json`, and (b) assert K-monotonicity: `add_K8 ≥ add_K3` AND `add_K12 ≥ add_K8` (and the same for `weighted`). The ratio must be a SAME-REPORT (same-pass, device-independent) measurement per P.W1's `ratioGate` discipline — no absolute `floorHz` predicate. This closes the B1-kf-soa K-ladder witness gap.

- **S4 — Behavioral gate suite GREEN through the move.** `proof:blend`, `proof:soa-composite`, `proof:spring-blend-weight`, `proof:zero-alloc`, `proof:engine`, `proof:decomposition`, and the full vitest compositor suite (`test/blend.test.ts`, `test/group.test.ts`, `test/iw0-cube-composite.test.ts`) ALL stay GREEN. The composite STATEMENTS that gate-lock `add`/`weighted` to stay inline in `group.ts` (the `?? layer.weight` read, the `layer.weightSpring?.value` read, the per-frame `spring.tickDt(dt)`) remain in `group.ts` — `group-soa.ts` exports only the PLANNING and FOLDING functions, not the composite STATEMENT decisions. Zero semantic change; zero new approximation.

---

## Born-RED gate

**Gate:** `proof:decomposition` (EXISTING — exits 1 TODAY naming group.ts:1084L over 820L) + `proof:soa-composite` extension (`k-ladder-monotone` clause, NEW arm on the existing gate) + `proof:blend` (EXISTING byte-exact oracle, must stay GREEN through the move).

**The REAL observables (not proxy greps).**

| Clause | Witness on today's (2026-06-23) tree | Failure mode (the REAL observable) | Expected after cure |
|--------|--------------------------------------|-------------------------------------|---------------------|
| S1/S2 `group.ts ≤ 820L` (**KEYSTONE**) | `proof:decomposition` exit 1 — `group.ts: 1084L exceeds the 820L library ceiling` | the genuine over-cap — the SoA fold machinery landed inline without re-triggering the cap gate | exit 0 — `group.ts` ≤ 820L; `group-soa.ts` present with `SoALayerPlan` + `buildSoAPlans` + `soaBlendLayer` |
| S3 `k-ladder-monotone` | `scripts/group-soa-decision.json` records K=8 only — `proof-soa-composite.mjs:149-152` reads only K=8 | exit 1 on the `k-ladder-monotone` clause: K=3 and K=12 are absent from the durable verdict | exit 0 — ALL THREE K-rungs recorded + K-monotonicity asserted per-pass |
| S4 `proof:blend` (**discriminating bite**) | `proof:blend` GREEN today (the SoA blend is byte-exact) | plant an off-by-one in `soaBlendLayer` during the move (e.g., seed from `incomings[s]` instead of `carriers[s]`) → `proof:blend` exits 1 even though line count dropped — proving the byte-exact oracle guards against a semantically-wrong extraction that happens to shrink the file | GREEN through the move — `soaBlendLayer` behavior byte-identical |
| S4 `proof:spring-blend-weight` | GREEN today | the composite STATEMENTS (the spring `tickDt` / `?? layer.weight` read) accidentally migrate to `group-soa.ts`, breaking the lock | GREEN — composite STATEMENTS stay in `group.ts` |

**How it is born-RED today (plant-a-failure):** `node scripts/proof-decomposition.mjs` exits 1 immediately naming `group.ts: 1084L exceeds 820L` — the REAL over-cap of the un-extracted SoA machinery against the measured base ceiling, no exception possible until the extraction reduces the file. Additionally, `node scripts/proof-soa-composite.mjs` exits with ONLY the K=8 ratio recorded — the `k-ladder-monotone` clause fails because `group-soa-decision.json` has no K=3 or K=12 entries.

**Green condition:** `group.ts` ≤ 820L; `src/animation/group-soa.ts` present with `SoALayerPlan` interface, `buildSoAPlans`, and `soaBlendLayer`; the `LIBRARY_CEILING_OVERRIDE` group.ts entry re-written to the measured post-extraction cap with the BORN-RED HANDOFF text replaced; `proof:decomposition` exits 0 (group.ts failure resolved — load-engine.ts and frame-compiler.ts resolved by Q.WA3); `proof:blend` byte-exact; `proof:spring-blend-weight` GREEN; `proof:soa-composite` exits 0 with ALL THREE K-rungs recorded and K-monotonicity asserted.

---

## Dependencies

- **Q.WA3 (master-merge reconcile) — prerequisite for a CLEAN baseline.** `proof:decomposition` currently also fails for `load-engine.ts:565L` and `frame-compiler.ts:553L`. Q.WA3 resolves those; Q.WF2 resolves the group.ts failure. Together they restore `proof:decomposition` to green, which Q.WF1 then needs for its override-retire step.
- **`group-layer-springs.ts` extraction precedent — already proven.** `src/animation/group-layer-springs.ts` is the exact structural template: an INTERNAL module beside `group.ts` that `group.ts` statically imports and never re-exports. `group-soa.ts` follows the same pattern.
- **`proof:blend` — already shipped, stays the oracle.** The byte-exact blend oracle (`scripts/proof-blend.mjs` + `test/blend.test.ts` corpus) is the regression authority for the SoA extraction. The extraction adds NO new oracle — it RIDES the existing one. Green before, green after.
- **`proof:soa-composite` — existing gate, extended by S3.** The K-ladder extension (S3) is an additive arm on an existing gate. It does NOT change the ADOPT/KILL verdict for the SoA fold (that is already ADOPT, durably recorded). It only closes the K=3/K=12 witness gap.
- **Q.WF1 (engine-seam split) — sequenced AFTER.** Q.WF2 must land before Q.WF1 so that `proof:decomposition`'s group.ts failure is resolved before Q.WF1 authors the engine.ts override-removal born-RED witness (S1 of Q.WF1 needs the engine.ts override to be the ONLY `proof:decomposition` failure for isolation clarity). No other hard dependency.
- **No cross-repo dep, no glass-ui dep, no parse-that dep.** The extraction is entirely kf-internal; `group-soa.ts` imports only from `@mkbabb/value.js` (for `ValueUnit`, `lerp`) and `./constants` (for `AnimationLayerConfig`) — the same imports `group.ts` already carries for these types.

---

## dev→impl boundary

This file is the Tranche Q DEVELOPMENT spec for Q.WF2 — DOCS ONLY (inv-16: kf writes only keyframes.js). The IMPLEMENTATION (the `group-soa.ts` extraction, the override re-write, the `proof:soa-composite` K-ladder extension) opens ONLY on the owner's explicit authorization, in DAG order: Q.WA3 baseline reconcile → Q.WF2. Gate-first (the `proof:decomposition` group.ts failure is born-RED today, observable with a single `node scripts/proof-decomposition.mjs` invocation), observable-truth (the `proof:blend` byte-exact oracle + the `proof:spring-blend-weight` gate are the behavioral acceptance oracles, not the line count), no-legacy (the BORN-RED HANDOFF text in the group.ts override entry replaced with the accurate post-extraction state), KISS (the fourth extraction from the `group-layer-springs.ts` precedent — no new patterns, no new public surface, no new value.js edge), no-deferral (DF-11-B discharged at the SoA machinery seam; the "deep compositor-seam split" HANDOFF text updated to name Q.WF1's engine re-threading as the remaining precondition for the FULL split).

---

## Mid-tranche friction pre-emption

- **FRICTION: the `proof:decomposition` failure for load-engine.ts + frame-compiler.ts (Q.WA3's job) and the group.ts failure (Q.WF2's job) are INDEPENDENT but CI reports them together — an implementer seeing the multi-failure output might address only one.** PRE-EMPT: Q.WF2's S2 explicitly names the group.ts failure as its SOLE responsibility; Q.WA3 owns the other two. The ordering (Q.WA3 first, then Q.WF2) means Q.WF2's implementer sees a clean gate with exactly ONE remaining failure.
- **FRICTION: the composite STATEMENTS (the `?? layer.weight` / spring `tickDt` inline reads) are `proof:spring-blend-weight`-locked to stay in `group.ts`. A careless extraction might move them too.** PRE-EMPT: S1 NAMES the excluded items explicitly: `_soaPlans`, `_compositeBuf` FIELDS stay on `AnimationGroup` (instance state); ONLY `SoALayerPlan` (the type), `buildSoAPlans` (the builder), and `soaBlendLayer` (the fold) move. The `proof:spring-blend-weight` gate exits 1 immediately if the spring `tickDt` / weight-read statements migrate out of `group.ts`.
- **FRICTION: the K-ladder extension to `proof:soa-composite` (S3) re-runs the K=3/K=8/K=12 bench on a slow Linux CI runner, which was historically the source of absolute-hz flakes.** PRE-EMPT: S3 explicitly mandates SAME-REPORT ratio-normalized measurement via P.W1's `ratioGate` — the K-monotonicity assertion is a RATIO comparison (`add_K8 ≥ add_K3`) made WITHIN the same run, not an absolute-hz floor. This is device-independent by construction (the CI-device-dependence-greening lesson).
- **FRICTION: `group-soa.ts` needs `ValueUnit` from `@mkbabb/value.js` for `isNumericUnit` (the typed guard in `buildSoAPlans`) and `lerp` for `soaBlendLayer`. This is a HEAVY import edge — `group.ts` already carries it, but a standalone module check on `group-soa.ts` would show a value.js dependency.** PRE-EMPT: `group-soa.ts` is INTERNAL (never exported from the barrel), so the `proof:boundary` gate does not scan it as a light-surface entry. The boundary gate scans LIGHT barrel exports; `group.ts` (and its internal companions) are already on the HEAVY side. No boundary regression.
- **FRICTION: Q.WF1 (engine-seam split) uses `proof:decomposition`'s overall exit code as a health signal before authoring the born-RED override-removal.** If Q.WF2 partially lands (group.ts extracted but override not re-written), `proof:decomposition` still exits 1 (the over-cap error remains until the override cap is corrected). PRE-EMPT: S1 and S2 are a SINGLE ATOMIC COMMIT — the extraction AND the override re-write land together, leaving `proof:decomposition` in the same pass/fail state before and after (not transiently worse).
