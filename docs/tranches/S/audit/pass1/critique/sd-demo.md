# CRITIQUE — sd-demo (Band S.D: Demo gestalt)

**Agent:** adversarial critique · **Band:** S.D (app/ partition · @/ partition + state hoist +
animation-controls carve · playground→scenes/compose/ · taxonomy + docs truth) · **Date:** 2026-07-02
**Probe evidence:** p04-demo-app-partition (VERDICT confirms-spec, cost-adjust) · p06-playground-fold
(VERDICT adjusts-spec). **Substrate re-verified live** (repo greps + gate/file existence) before scoring.

**Verdict headline:** the band's *spine is validated* — p04 proves the app/ partition is mechanical and
cheap, p06 proves the playground fold mounts/code-splits/renders with 0 errors. But S.D carries **one
genuinely defective born-RED gate that cannot reach GREEN as worded** (proof:app-is-shell), **one
scope-misclassification that directly contradicts the a23 Layout C the probe validated** (the "five
scene-tier files"), the band's **largest and riskiest wave (D2, the 10k-line monolith carve) is
UNPROTOTYPED**, and the two probes each surface a gate-touch undercount the spec predates. Convergence:
**35%** — the intent is sound and evidence-grounded, but the D1 gate and D1 scope must be re-authored,
not just cost-adjusted, before impl authorization.

---

## 0. Live-tree verification (done before critiquing)

- `proof:app-shell-thinness` **does not exist** (only `proof-demo-shell-grid.mjs` in `scripts/`) —
  confirms a23 F2 / fold-table #21: the gate S.D1 must "author or delete-citations."
- The five so-called "scene-tier" files **live in `demo/app/`** today (`rafConstants.ts`,
  `useRafScene.ts`, `useSceneVisibilityPause.ts` at root; `useContractAnimGroup.ts`,
  `useSceneTransport.ts` in `app/composables/`) and are imported **across ≥6 scenes**
  (`grep -rln` → easing, square, cube, amiga, sequence, spring). They are **cross-scene recipes, not
  scene-private** — this is load-bearing for §2.1 and §2.2 below.
- a24 confirms the D2 census evidence is real: `animation-controls/` = 74 files / 10,093 L = 55% of `@`;
  `ControlsPaneWrapper` 497L, `AnimationControlsGroup` 477L; four single-area-private modules; **zero
  DEAD files**.

---

## 1. What is SOUND (bank it — do not re-litigate)

- **D1 partition is mechanical (p04 confirms-spec).** No gate encodes a structural assumption the move
  invalidates by meaning; every red is a hardcoded source-path string discharged by find-replace
  (p04 F1). The ~54 a27 appearance gates are layout-invariant to a *source* move — they read the built
  `dist/gh-pages` DOM, not source paths (p04 F4). This is a real, important corollary: **the file
  partition alone reds ~7 source-path gates, NOT the FROZEN appearance set.**
- **D3 fold-as-scene is viable and cheap (p06 confirms C-4).** Builds clean, code-splits to a lazy
  `ComposeScene-*.js` chunk, mounts at `#/compose`, dock shows compose, 0 console errors; stores reset
  hook survives (`resetAllStores` already calls `_resetAssetManagerStore` — not playground-private);
  asset-manager drags no playground-only deps; the scene machine does NOT hardcode 8 (`SceneId = string`,
  `controlSurfacesFor` total). Both FAILURE branches of Q6 are *not* triggered (p06 G).
- **D2's census-over-fiat is correct method (T9).** a24's importer census legitimately overturns R's
  "do not touch" — the evidence is shipped, not asserted.
- **D4's `@/`-keep ruling is right.** Alias churn buys nothing; document-and-keep is the cohesion call.

---

## 2. BLOCKING — the two non-mechanical defects (re-author, not cost-adjust)

### 2.1 `proof:app-is-shell` is a DEFECTIVE gate — it cannot reach GREEN as worded (-15)

S.D1's born-RED gate: *"no file under app/ has zero **app-shell importers**."* The predicate
"app-shell importer" is undefined, and **both readings break**:

- **Reading A** ("imported by a file *within* `demo/app/`"): the five cross-scene runtime files
  (`useRafScene`, `useSceneVisibilityPause`, `rafConstants`, `useContractAnimGroup`, `useSceneTransport`)
  are imported by **scenes**, not by app-shell files (verified: 6 scene importers, live). Under a23's
  Layout C — which S.D1 adopts and p04 validated — these files stay in `app/runtime/`. So the gate would
  **RED them permanently**: they can never acquire an "app-shell importer." A born-RED gate that its own
  adopted layout can never turn GREEN is **not falsifiable-to-closure** — the exact r2 anti-pattern.
- **Reading B** ("imported by anything in the demo graph, incl. scenes"): then it is **near-vacuous** —
  any imported file passes. `cubeTransformStore.ts` (imported by its cube scene) would PASS, so the gate
  would **not catch the very mis-home a23 F3 flags** — the violation the wave exists to fix.

The gate S.D1 actually needs is *directional*, matching a24/a23's classification: **"no file in `app/`
is imported by exactly one non-app area (mis-home); cross-area files (≥2 scenes, or app-shell) may
reside in `app/`."** That is the inverse of `proof:shared-has-n-consumers` applied to `app/`. As written,
proof:app-is-shell is the single most serious hole in the band.

### 2.2 S.D1's "evict the five scene-tier files to their real homes" CONTRADICTS a23/p04 (-10)

S.D1 prose (and fold-table #30) call `useRafScene · rafConstants · useSceneVisibilityPause ·
useContractAnimGroup · useSceneTransport` **"scene-tier files"** to be **"evict[ed] … to their real
homes."** This is **wrong on the evidence**:

- a23 classifies all five as **cross-scene recipes** (`a23:225-226`: "Scene rAF runtime … cross-scene
  recipe (easing+spring)"; "Cross-scene transport … the only two in composables/") whose home is
  **`app/runtime/`** — they *stay in app/*. Only `cubeTransformStore.ts` (scene-private → `scenes/cube/`)
  is evicted OUT (a23 F3).
- **p04 executed exactly this** (a23 Layout C): it sub-zoned the five INTO `app/{scene,transition,
  runtime}/` and evicted *only* `cubeTransformStore.ts` → `scenes/cube/`. p04's typecheck+build are green
  on that layout. **S.D1's "evict the five to real homes" is the ONE thing the validated probe did NOT
  do — and a23 explicitly argues against.**

This is not a mechanical cost-line fix; it is a **scope error**: the wave must be re-authored to
(a) evict `cubeTransformStore.ts` OUT, (b) sub-zone the five cross-scene files *within* `app/runtime/`,
and (c) reconcile the gate (§2.1) so those five don't false-RED. Left as-is, D1 and its gate disagree
about where five files go.

---

## 3. BLOCKING — probe undercounts the spec predates (mechanical, but mandatory)

### 3.1 D3's "the two gate clauses" is a ~6-item + fail-loud-fleet undercount (p06 A/B/C/D/E)

Registering compose in `scenes.ts` auto-enrolls it into an **82-gate runtime fleet** via
`demo-driver.mjs`'s `SCENE_GATE_META` bidirectional key-equality guard that **throws at module load**
until a `SCENE_GATE_META.compose` entry is added (p06:83-98, `demo-driver.mjs:294-311`). The true touch
set (p06 §4.1) that must replace *"the two gate clauses that read playground/App.vue"*:

1. **`SCENE_GATE_META.compose`** in `scripts/lib/demo-driver.mjs` — **name it FIRST; without it all 82
   demo-driving gates throw at import** (the highest-leverage line in the wave).
2. the DFA triple in `controlSurfaceDFA.ts` (`assets` surface + `CONTROL_SURFACES.compose` +
   `SCENE_SURFACE_TABS.assets`).
3. `proof:scene-colocated` `SCENE_DIRS += compose` — today it passes **BLIND** (8 hardcoded dirs;
   compose invisible → unchecked, p06 C). Requires a `demo:` peer-filename decision → couples to D4 (§4).
4. `proof:published-surface` dir-list **minus `"playground"`** + root CLAUDE.md tree regen.
5. `proof:design-refinement` S9 egg re-pointed to compose source — an **upgrade** (now live-drivable in
   the SPA, p06 B).
6. the literal "8 scenes" prose sweep (p06 E: font-census ×5, no-single-option-select:34, demo-driver:57
   comment, scene-colocated:134).

### 3.2 The DAG is wrong: `proof:compose-scene` cannot CLOSE at D3 (p06 #2)

Today's DAG: `A4 → D1 → D2 → D3, E1`. But the instant compose is registered it **must PASS** the
occlusion / a11y / font-census / mobile-single-page / stage-visible fleet — work scoped to **S.G1/S.G**.
So `proof:compose-scene` is **born-RED at D3 but cannot go GREEN until G lands** (p06:104, 181-187).
**MANDATORY DAG edit:** add `S.G1 → compose runtime-fleet green`; D3 *registers* (manifest/DFA/colocated/
published re-points), G *discharges* the fleet, `proof:compose-scene` **closes after G** — else the wave
born-GREENs-then-reds mid-band (the T4 violation).

### 3.3 D1 missing the `scenes.ts` depth-bump + same-commit atomicity (p04 F2 + sequencing)

- `demo/app/scenes.ts` reaches the sibling `demo/scenes/` tree through **16 `../scenes/…`** static+lazy
  imports; moving it into `app/scene/` silently repoints them to the nonexistent `app/scenes/` — **8×
  TS2307** until bumped `../scenes/`→`../../scenes/` (p04 F2). This is **the only non-alias edit** in the
  whole partition and the one that reds `tsc` if forgotten; S.D1 does not mention it.
- **Atomic-commit constraint:** `scripts/lib/demo-driver.mjs:83` feeds **5 gates**; land the gate/lib
  path-swaps **in the SAME commit as the file moves** — there is no intermediate green (p04 §5 sequencing
  note). S.D1 must name this.
- **Born-RED clause addition (p04 §4):** proof:app-is-shell (once §2.1 is fixed) should also assert **no
  moved file's relative import escapes into a stale depth** — catches F2 by construction.

---

## 4. Open design questions (each -10)

- **4.1 `proof:shared-has-n-consumers` "consuming area" granularity is undefined.** Is each scene an
  "area," or is `scenes/` collectively one area? It is load-bearing: `useRafScene` is used by
  easing+spring — **two scenes** → shared (keep in app) under per-scene counting, but **one "scenes"
  area** → would RED under collective counting. a24's census column says "consumer areas =
  scenes·app·playground·@-internal" (collective) — which would mis-RED legitimately cross-scene
  helpers. The gate cannot be authored until this is pinned; it decides every colocation ruling in D2.
- **4.2 `App.vue ≤ ~360L` is a numeric target inside a born-RED gate — the arithmetic the charter
  forbids.** C-5 / T2 ("cohesion-first; 500L is a tripwire, not a target"; "a cap … is a hard RED")
  are contradicted by baking `≤360L` into a *pass condition*. The shell-ness predicate must be
  structural (imports/concern), with any line count as an *observed tripwire*, not the gate's GREEN
  criterion. Decide the cohesion predicate that replaces the number.
- **4.3 Compose's composable name is settled at D3 before D4 settles the rule.** D3 must register
  `use<X>` NOW (p06 needs a `demo:` peer for scene-colocated), but S.D4 (`Deps: D1–D3`) settles the
  `use<Name>Demo` vs `use<Name>Animations` taxonomy AFTER. The probe itself is inconsistent — it created
  `useComposeAnimations.ts` (p06 §2) but recommends `useComposeDemo.ts` (p06 §4/§5). **Resolve the
  taxonomy rule BEFORE D3 registers compose** (move the D4 naming sub-item earlier, or have D3 defer the
  filename to the D4 ruling) — else guaranteed rename churn.

---

## 5. MISSING evidence-demanded item (-10)

**D2 — the 10k-line `animation-controls/` carve + the state hoist — is UNPROTOTYPED.** The spec cites
*"Prototype Q4 costs the gate fallout"* for D2, but Q4 (p04) executed **only D1** (a23 Layout C); it
never ran "a slice of D2: the stores hoist" that Q4's own success criterion names (SPEC §6 Q4). So the
band's **largest, highest-risk wave** — hoisting `stores/` to `@/state/`, sub-zoning the 74-file
monolith into transport/keyframes-editor/timeline peers, carving `ControlsPaneWrapper` (497L) and
`AnimationControlsGroup` (477L), and six single-consumer colocations — has **zero measured gate/import
fallout**. a24 supplies the *census* (what belongs where) but not the *migration cost* (what breaks). D2
must either be prototyped in Pass-1E-bis or its born-RED gate authored against an explicit,
importer-census-derived touch-set before impl authorization.

---

## 6. Cost / DAG honesty (soft — record, no separate deduction)

- **a23's D1 cost line is a ~3× undercount** (p04 F3): measured touch-set is **~38 files / ~60 lines**
  (16 moved + ~10 source import sites + 2 test files + 8 gate/lib path-constant sites), not "4 files /
  6 import lines." SPEC-v2 should carry p04's measured number, and note **no vite/tsconfig/vitest alias
  edit is needed** — only `@app/*` *subpaths* move (p04 §5).
- **`A4 → D1` DAG edge is over-constrained.** The stated constraint ("A4's FROZEN-set precedes any demo
  wave that reds a layout gate") does not apply to D1: p04 F4 proves the partition reds **no** FROZEN
  appearance gate — only 7 source-path gates disjoint from the FROZEN set. D1 can run parallel to A4;
  only D3/E/G (which red appearance gates) truly need A4. Relax the edge or re-justify it.
- **Q4's SUCCESS/FAILURE dichotomy is miscalibrated.** It equates "reds outside the FROZEN set" with
  "unknown coupling → re-inventory." p04 found reds *outside* the FROZEN set (the 7 source-path gates)
  that are **perfectly known and mechanical** — yet the probe correctly verdicted confirms-spec. SPEC-v2
  should re-state: the partition reds a **known source-path gate set** (7 + driver), disjoint from the
  FROZEN appearance set; only reds outside *both* signal unknown coupling.

---

## 7. Cross-band coherence note (record)

`proof:scene-colocated` is mutated by **three** waves: **S.A4** (delete ASSERTION 3's carousel clause),
**S.D2** (add the reference-count clause), **S.D3** (add compose to `SCENE_DIRS`). Three waves across two
bands editing one gate script is a merge-coordination hazard; T7 permits it, but SPEC-v2 should name the
single canonical edit order (A4 → D2 → D3) so the clauses compose rather than clobber.

---

## 8. Scoring

| # | Deduction | Class | Pts |
|---|---|---|---|
| 1 | `proof:app-is-shell` cannot reach GREEN as worded; predicate undefined (§2.1) | dishonest/unfalsifiable gate | −15 |
| 2 | D1 "evict five scene-tier files" contradicts a23 Layout C + p04 (§2.2) | non-mechanical scope conflict | −10 |
| 3 | D2 (10k-line carve + state hoist) UNPROTOTYPED; Q4 only ran D1 (§5) | missing evidence-demanded item | −10 |
| 4 | `proof:shared-has-n-consumers` "area" granularity undefined (§4.1) | open design question | −10 |
| 5 | `App.vue ≤360L` numeric target in gate vs C-5/T2 (§4.2) | open design question | −10 |
| 6 | Compose composable-name settled at D3 before D4 rule (§4.3) | open design question | −10 |

**Convergence: 35%.** The band's *spine is validated by both probes* (partition mechanical, fold viable
with 0 errors) — so this is a design-completeness gap, not a spine failure. But two defects are
**non-mechanical** (the app-is-shell gate must be re-authored to a directional predicate; the five-file
scope must be reconciled with the layout the probe validated), the biggest wave is untested, and three
open questions block gate authoring. The §3 undercounts are mechanically absorbable but MANDATORY.
Above ~80% requires: fix the gate predicate, reclassify the five files, pin the "area" definition,
de-numeric the shell gate, resolve the naming order, and either prototype D2 or author its gate against
an explicit census-derived touch-set.

---

## BLOCKING edits for SPEC-v2 (must land before impl authorization)

1. Re-author `proof:app-is-shell` to a directional predicate — "no `app/` file is imported by exactly
   one non-app area; ≥2-scene cross-area files may reside in `app/runtime/`" — so it is both born-RED
   AND reachable-to-GREEN; add p04's stale-depth clause.
2. Reclassify D1's five files as **cross-scene → sub-zone into `app/runtime/`** (a23 Layout C, p04);
   evict **only** `cubeTransformStore.ts` OUT to `scenes/cube/`. Delete "evict the five scene-tier files
   to their real homes."
3. Replace D3's "the two gate clauses" with the six-item touch set, naming `SCENE_GATE_META.compose`
   (`demo-driver.mjs`) FIRST as the fail-loud all-82-gate blocker.
4. Add DAG edge `S.G1 → compose runtime-fleet green`; `proof:compose-scene` CLOSES after G, not at D3.
5. Add to D1: the `scenes.ts` `../scenes/`→`../../scenes/` depth-bump (16 lines) and the same-commit
   atomicity constraint (gate/lib path-swaps + file moves land together; `demo-driver.mjs` feeds 5 gates).
6. Define "consuming area" for `proof:shared-has-n-consumers` (per-scene vs collective) — decides D2's
   colocation rulings.
7. De-numeric the shell gate: make shell-ness structural; treat any line count as an observed tripwire,
   not the GREEN criterion (C-5/T2).
8. Settle the `use<Name>Demo` taxonomy (D4) BEFORE D3 registers compose, or have D3 defer the filename
   to D4's ruling; add compose to `proof:scene-colocated` `SCENE_DIRS` with the chosen peer name.
9. Prototype D2 (stores hoist + monolith sub-zone + the two ≥477L carves) OR author its born-RED gate
   against an explicit a24-census-derived touch-set (the largest untested wave in the band).
10. Carry p04's measured D1 cost (~38 files/~60 lines) and relax/​re-justify the `A4 → D1` DAG edge
    (partition reds no FROZEN gate — p04 F4).
```
