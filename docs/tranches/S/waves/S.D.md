# S.D — Demo gestalt (app/ partition · @/ carve · playground fold · taxonomy truth)

> **This is a TRANCHE-DEVELOPMENT phase, NOT implementation.** This document is the
> wave-spec for band **S.D** of Tranche S, transcribed with zero load-bearing loss from the
> converged **SPEC-v3** (`docs/tranches/S/audit/pass1/SPEC-v3.md`, 1,833 lines — the standalone
> source of truth). Every gate definition, co-edit set, DAG edge, cost estimate, born-RED clause,
> ruling reference, and fold-row this band carries is reproduced here; an implementer must NOT need
> to read SPEC-v3. Nothing runs until the owner authorizes an impl drive. A wave is CLOSED only
> when its born-RED gate is GREEN **re-run on the merged tree** (T4, inv-16), and S.Z2 re-executes
> that oracle at close. **Branch:** `tranche-s-dev` · **Track:** demo.

**Charter.** S.D rewrites the demo's altitude — the debt R declared out of scope by fiat. R fused
scenes (R.W5) but never partitioned the demo's shared substrate: `demo/app/` is a mixed-concern
drawer, the global state layer is buried four levels deep inside a 74-file / 10,093-line
`animation-controls/` monolith R declared "do not touch" with no importer census, four "shared"
modules are single-area-private (~3,076L misfiled), and the playground is a dead standalone app with
an un-pinned `outDir` landmine (SPEC §2.1-10, §2.1-9, fold rows 29/30/31). S.D executes the two
probe-validated partitions (p04 for `app/`; **P2-1 confirms-spec** for the `@/` carve), folds the
playground in as the ninth scene (`scenes/compose/`, p06-confirmed), and makes the demo's own
inventory docs tell the truth again — each move gated by a born-RED structural predicate, not a
rubric.

**Mode declarations (C-14 — every wave states REWRITE or REFINE):**
- **S.D1 — REWRITE** (structure/layout partition).
- **S.D2 — REWRITE** (structure/layout partition; the monolith carve).
- **S.D3 — REWRITE** (structure/layout — the playground fold).
- **S.D4 — REFINE** (docs truth + rename convention).

**Band DAG (from SPEC §3 "The DAG"):**

```
S.A0 ─────────────────────────► S.D1                       (D1 runs parallel to A4 — sd-#10)
S.A4 + S.D1 ──► S.G1 ──► S.D2 ──► S.D3 ──► S.G2(compose items)
(band S.E SHELVED by owner ruling 2026-07-03 — its former S.D2/S.D3 out-edges are removed)
```

- **S.D1** deps A0 only; runs **parallel to S.A4** — D1 reds NO frozen appearance gate (p04 F4: the
  FROZEN set reads built DOM, not source paths), so the A4→D1 edge is RELAXED (sd-#10).
- **S.D2** deps D1, **G1** — the D2⟵G1 edge is CONFIRMED load-bearing and **not relaxable** (C-24;
  P2-1 F8): `proof:stage-visible` does not exist pre-G1, so its stays-green clause is unexercisable
  earlier; G1 lands FIRST on the current tree (its 78+/18− diff is probe-proven), D2's carve follows
  and re-runs `proof:stage-visible` green on the post-carve tree.
- **S.D3** deps D2, **A4** — D3 reds appearance gates (font/occlusion/a11y/stage-visible), so it
  needs A4's FROZEN-set declaration first.
- **S.D4** deps D1–D3.
- **Cross-band constraint:** `proof:scene-colocated` has a **canonical edit order A4 → D2 → D3**
  (SPEC §3 DAG; §3 S.A4) — every wave that touches this gate edits it in that sequence.

**Fold rows this band terminalizes (SPEC §4):** row 21 (app-shell phantom → D1), row 30
(cubeTransformStore + five cross-scene files → D1), row 31 (animation-controls "do not touch" fiat →
D2), row 71 (KfPillTabs promotion → D2; its TEST is B7's), row 29 (playground identity/outDir → D3).

**Rulings this band executes (SPEC §2.2):** C-4 (playground FOLD as `scenes/compose/`), C-17
(`use<Name>Demo` naming), C-23 ("consuming area" = per-scene counting), C-24 (G1-before-D2
sequencing).

---

## S.D1 — app/ partition (a23 Layout C · the real app-shell gate)

**Mode: REWRITE.** p04 confirms — mechanical, **~38 files / ~60 lines** (SPEC §3 S.D1, §2.1-10).

### Charter

`demo/app/` is a mixed-concern drawer (a23, a24). R.W5/6 left `cubeTransformStore.ts` misfiled in
`app/` (single-scene state) and five cross-scene recipes un-zoned; the `proof:app-shell-thinness`
gate cited in R docs is a **phantom** — it never existed, its citations are dangling (fold row 21).
S.D1 sub-zones `demo/app/` per a23 **Layout C**, evicts exactly the one genuinely-misfiled store,
authors the REAL directional app-shell gate, and does it as a single atomic move (gate path-swaps in
the same commit as the file moves — there is no intermediate green).

### Scope items

- **S1 — Sub-zone `demo/app/` per a23 Layout C:** `scene/` · `transition/` · `runtime/` (+ shell
  files at root; `diagnostics/` as needed). Only `@app/*` subpaths move — **no vite/tsconfig/vitest
  alias edit is needed** (SPEC §3 S.D1).
- **S2 — The five cross-scene files STAY in `app/runtime/`.** `useRafScene`, `rafConstants`,
  `useSceneVisibilityPause`, `useContractAnimGroup`, `useSceneTransport` are cross-scene recipes
  (**≥6 scene importers, verified**) and are legitimately shared. v1's "evict the five scene-tier
  files to their real homes" **contradicted the layout p04 validated and is DELETED** (sd-#2; fold
  row 30 rewritten). Per C-23, a helper consumed by ≥2 scenes is legitimately shared, so these
  belong in `app/runtime/`.
- **S3 — Evict ONLY `cubeTransformStore.ts` OUT → `scenes/cube/`.** It is single-scene-consumed and
  is the one genuine mis-home (this is what makes the D1 gate **born-RED today**).
- **S4 — The one non-alias source edit — the `scenes.ts` depth bump.** `scenes.ts` reaches the
  sibling tree through **16 `../scenes/…` imports**; the move requires the `../scenes/` →
  `../../scenes/` depth bump (**8× TS2307 if missed**) (SPEC §3 S.D1; SD-5).
- **S5 — Extract the `@mbabb` dropdown → `dock/MbabbMenu.vue`.**
- **S6 — Author the REAL app-shell gate** (`proof:app-is-shell`) — the phantom
  `proof:app-shell-thinness` citations resolved (fold row 21; SD-1).
- **S7 — Rename the `useSceneMachineApp`/`useSceneMachineRouter` collision.**

### The enumerated same-commit co-edit set

**Same-commit atomicity (SD-5):** the gate/lib path-swaps land in the **SAME commit** as the file
moves — there is **no intermediate green**:
- **7 proof scripts** (the source-path gates that reference `@app/*` file paths), plus
- **`scripts/lib/demo-driver.mjs:83`** — which feeds **5 gates** (a single path-swap here fans out
  to five demo-driving gates).

(This is the SD-5 mandate: the demo-driver feeds 5 gates, so its path-constant must move atomically
with the tree.)

### The HARD GATE — `proof:app-is-shell` (born-RED, directional — sd-#1/#7)

**Gate name:** `proof:app-is-shell` (NEW; re-authored from the phantom `proof:app-shell-thinness`).

**What it asserts (three clauses):**
- **(i) No mis-home** — no file under `app/` is imported by **exactly one non-app area** (a
  single-non-app-consumer file is misfiled). Cross-area files — **≥2 scenes per C-23**, or
  app-shell — MAY reside in `app/runtime/` (this is what keeps the five cross-scene recipes legal in
  S2 and reds `cubeTransformStore` in S3).
- **(ii) No stale-depth escape** — no moved file's relative import escapes into a stale depth
  (**catches the S4 depth-bump class by construction** — the `scenes.ts` `../scenes/` →
  `../../scenes/` failure surfaces here, not only at `tsc`).
- **(iii) Shell-ness is structural** — measured by imports / concern membership, NOT by line count.
  **App.vue's line count is an OBSERVED TRIPWIRE recorded in this wave doc, NOT a GREEN criterion**
  (SD-7; §2.1-5; T2 corollary — no numeric line count is a born-RED gate's GREEN criterion).

**Born-RED witness plan.** The gate is born-RED **today** via `cubeTransformStore.ts` — it lives in
`app/` yet is single-scene-consumed (imported by exactly one non-app area: `scenes/cube/`), which
trips clause (i). After S3 evicts it to `scenes/cube/`, clause (i) greens. A non-vacuity plant: move
any legitimately-shared `app/runtime/` recipe down into a single scene → clause (i) REDs; re-add a
stale `../scenes/` depth after S4 → clause (ii) REDs.

**Falsifiability.** The gate is directional (born-RED yet reachable-to-GREEN — SD-1): it reds on a
real mis-home today and greens only when the tree is honestly zoned. Clause (iii)'s structural basis
means the gate cannot be satisfied by cosmetic line-shrinking of App.vue — falsifiable both ways.

### Cost (carried from p04)

**~38 files / ~60 lines total:** ~16 moved files + ~10 source-edit sites + 2 test files + 8 gate/lib
sites (SPEC §3 S.D1). Mechanical; LOW risk.

### DAG

**Deps: A0.** Runs **parallel to A4** (DAG relaxed — sd-#10; p04 F4: D1 reds no frozen appearance
gate because the FROZEN set reads built DOM, not source paths). **D1 ──► S.G1** (with A4).

### Verification

Impl sequence: (1) author `proof:app-is-shell` and the 7-script + demo-driver:83 path-swaps FIRST
(born-RED on the current tree via `cubeTransformStore`); (2) sub-zone `app/` into
scene/transition/runtime; keep the five recipes in `runtime/`, evict `cubeTransformStore` →
`scenes/cube/`; apply the `scenes.ts` depth bump; extract `MbabbMenu.vue`; rename the sceneMachine
collision — **all in one commit**; (3) run `proof:app-is-shell` (must be GREEN); (4) run `check`
(catches any residual TS2307 from the depth bump) + the 5 demo-driver-fed gates; (5) confirm no
FROZEN appearance gate reds (p04 F4 — expected clean).

---

## S.D2 — @/ partition: the state hoist + the monolith carve (probe-VALIDATED — P2-1)

**Mode: REWRITE.** **probe-VALIDATED — P2-1 confirms-spec:** every move-caused red is path-anchored;
no unknown coupling; no `@/` re-inventory; **~3–4 days, gate-repoint-dominated, LOW risk** (SPEC §3
S.D2, §2.1-10, §6.2 P2-1).

### Charter

R declared the 74-file / 10,093-line `animation-controls/` monolith "do not touch" **by fiat** — no
importer census (a24 F8; T9: no keep-verbatim verdict on a shared directory without a census as
evidence). The a24 census overturns it: the demo's global state layer is buried four levels deep,
and four "shared" modules are single-area-private. **P2-1 executed the core carve in a worktree**
(stores hoist + transport peer move + ControlsPaneWrapper seam analysis): `check`/`gh-pages`/58
tests green; every move-caused red path-anchored; the FAILURE branch (unknown coupling →
re-inventory `@/`) did **not** fire (SPEC §2.1-10, §6.2). S.D2 hoists the state layer to a
first-class peer and sub-zones the monolith — the real cost is **gate-repoint-dominated**.

### Scope items

- **S1 — Hoist `animation-controls/stores/` → `demo/@/state/`** as a first-class peer (the keystone
  that de-monoliths — a24 F2).
- **S2 — Sub-zone `animation-controls` into `transport` / `keyframes-editor` / `timeline` peers**
  (a24 F1).
- **S3 — Single-consumer colocations per the a24 census:** `CSSPasteDialog`→`timeline`;
  `AnimatedText`/`TypingDots`/`KeyboardShortcutsModal`→`editor-shell`; the easing-editor
  cluster→`easing-editor/`; `orbital-drag`+`matrix-editor`→`scenes/cube/`; `dock/`→app-adjacent;
  `useTypedTrigger`→`scenes/sequence/`.
- **S4 — KfPillTabs promotion to the standard panel primitive** within the controls carve lands here
  (fold row 71; se-B6 — it is a panel primitive, not scene-nav). **Its TEST is B7's**
  (`KfPillTabs.test.ts` + the a12 F1/F2 keyboard fixes live in S.B7, not here).
- **S5 — `cubeKeys.ts` for 8/8 parity** (a10).
- **S6 — The cross-module `_resetAssetManagerStore` reach** (`state/index.ts`) gets the a24-F2
  **app-level reset composer**.

The R "do not touch" fiat is overturned by the importer census (a24 F8, T9).

### The P2-1 binding cost model — the two move operations have OPPOSITE fallout profiles

- **Stores hoist — HIGH source / ~ZERO structural gate reds (~0.5 day).** ~**46 edit sites**
  (9 moved + 3 config + 22 demo import-swaps + 7 test-swaps + 1 injectionKeys + 4 gate
  path-constants); all four stores-referencing gates are `demo/`-rooted walkers that **follow the
  moved files**; `demo-driver.mjs`'s only stores mention is a comment.
- **Transport peer move (6 shells) — LOW source / HIGH gate (~1 day).** **1 real external import
  edge** (`EditorShell.vue`) + 9 intra-shell rewrites — **the a24 census over-counted comment/JSDoc
  mentions as import edges** (a recorded census-method residue). But **~7–10 gates hardcode the
  shell paths as curated scope-file SETS invisible to the census:**
  `control-surface-single-writer:89`, `drawer-spring`, `mobile-single-page`,
  `no-single-option-select`, `demo-shell-grid` S1–S4, `cartoon-is-panel-depth` S1,
  `idioms:603-605`. **Author `proof:shared-has-n-consumers` AND repoint those shell-path gates in
  the SAME commit** (the p04 same-commit-atomicity rule extends here — no intermediate green).
- **The 497L/477L `ControlsPaneWrapper` carve, REFRAMED (P2-1 F6; ~0.5 day, decoupled).**
  ControlsPaneWrapper = **298L scoped CSS + 71L script + 123L template** — the carve is a
  **scoped-CSS/template split, import-neutral by construction** (the public SFC keeps its
  name/interface; zero external importer changes), **NOT a logic decomposition**. Do **not** expect
  it to relieve any logic-complexity gate.

### The walker-root arming-audit (T7; P2-1 F5)

A peer move is blindspot-safe **ONLY while the structural walkers root at `demo/`**. D2 audits every
structural gate's walk root before the move; **`proof:decomposition` (roots at
`animation-controls/`, `:79`) is the NAMED one** to verify does not silently drop the peer-moved
files (T7; §7 T7 — the p10 arming-audit class generalizes here).

### The two config facts (P2-1 F7 — both load-bearing)

- **The `@state` alias needs the bare + wildcard tsconfig pair** — `"@state"` AND `"@state/*"`. The
  wildcard alone leaves the bare barrel import at **8× TS2307** — across vite/vitest/tsconfig.
- **`tsc --noEmit` does NOT type-check `.vue` SFCs** — so **the D2 gate run MUST include
  `gh-pages`** (two broken `.vue` `./stores` imports passed `check` in the probe and were caught
  only by vite), **plus vitest after `build:lib`**.

### The HARD GATE — `proof:shared-has-n-consumers` (born-RED)

**Gate name:** `proof:shared-has-n-consumers` (NEW).

**What it asserts.** Any `@/` module with **<2 consuming areas REDs** — using **C-23 per-scene
counting**: each `demo/scenes/<name>/` is its own area; `app/` is one area; each `@/` top-level
module is one area. A helper consumed by ≥2 scenes is legitimately shared (so `useRafScene`
— easing+spring — stays put); a module consumed by exactly one non-`@` area is misfiled and REDs.
Collective counting (all scenes = one area) is **rejected** — it would mis-RED legitimately
cross-scene helpers (C-23).

**The `scene-colocated` co-edit.** A reference-count clause is added to `proof:scene-colocated`
following the canonical **edit order A4 → D2 → D3** (SPEC §3 DAG, §3 S.A4).

**Born-RED witness plan.** The census-shaped gate reds today on the single-area-private modules S3
relocates (e.g. `CSSPasteDialog` consumed by exactly one area). After the colocations land, each
targeted module either has ≥2 consuming areas or lives inside its sole consumer's directory → green.

### Falsifiability

Plant: move a genuinely cross-scene recipe into one scene → it drops to <2 consuming areas → REDs.

### Verification

**The mandatory triple (P2-1 F7):** `check` **AND** `gh-pages` **AND** the vitest set (after
`build:lib`). `check` alone is insufficient (it does not see `.vue` imports). Development-only;
born-RED; re-run at S.Z2.

### DAG

**Deps: D1, G1.** The **D2 ⟵ G1 edge is CONFIRMED load-bearing, NOT relaxable** (C-24; P2-1 F8):
G1 lands FIRST on the current tree; D2's carve follows and **re-runs `proof:stage-visible` green on
the post-carve tree** (`proof:stage-visible` does not exist pre-G1, so its stays-green clause is
unexercisable earlier — the vacuity in the probe tree is itself the confirmation the edge must not
be relaxed). **D2 ──► S.D3.**

---

## S.D3 — Playground → scenes/compose/ (p06 · the six-item touch set)

**Mode: REWRITE.** p06 adjusts-spec — the six-item touch set (SPEC §3 S.D3, C-4, C-17, fold row 29).

### Charter

Execute **C-4**: FOLD the dead standalone playground in as the **ninth scene** `scenes/compose/`.
p06 confirmed the fold builds, code-splits to a lazy chunk, mounts at `#/compose`, and renders with
0 console errors; neither Q6 FAILURE branch fires (the machine is `SceneId = string`; asset-manager
drags no playground-only deps; `resetAllStores` already covers it). This kills the playground's
identity crisis, its blank build, its un-pinned `outDir` landmine, and the 9.6MB dist debris (fold
row 29).

### Scope items

- **S1 — Register the ninth scene.** `SceneExposedApi` via the existing `tabsContent` render-fn slot
  — **no contract change needed** (p06 §4.3); `useComposeDemo.ts` per **C-17** (the `use<Name>Demo`
  convention, ruled NOW before D3 registers compose); **superKey kept** for stored-options
  migration.
- **S2 — Relocate `asset-manager/` + `EditableLabel`.**
- **S3 — Delete `demo/playground/`** (the app, its vite mode, the un-pinned `outDir` landmine, the
  9.6MB dist debris) **+ the `dev:playground` script**.
- **S4 — The Image/SVG asset-kind decision** — make real or drop the menu items — an **independent
  D3 sub-item, orthogonal to the mount path** (p06 §4.4).
- **S5 — The design lane's foundry fixes** land as the scene's W1: chrome-red selection tokens,
  Fraunces source kill, empty-state recast.

### The six-item touch set (replaces v1's "two gate clauses"; p06 §4.1 — SD-3)

1. **`SCENE_GATE_META.compose` in `scripts/lib/demo-driver.mjs` — FIRST** (fail-loud: without it
   **all 82 demo-driving gates throw at module load**).
2. **The DFA triple in `controlSurfaceDFA.ts`** — `assets` surface + `CONTROL_SURFACES.compose` +
   `SCENE_SURFACE_TABS.assets`.
3. **`proof:scene-colocated` `SCENE_DIRS += compose`** with the `demo: useComposeDemo.ts` peer
   (today it passes **BLIND** at 8 hardcoded dirs) — edited in the canonical A4→D2→**D3** order.
4. **`proof:published-surface` dir-list minus `"playground"`** + root CLAUDE.md tree regen.
5. **`proof:design-refinement` S9 egg re-pointed to compose source** — an **UPGRADE** (the egg
   becomes live-drivable in the SPA for the first time).
6. **The literal "8 scenes" prose sweep** — font-census ×5, `no-single-option-select:34`,
   `demo-driver:57`, `scene-colocated:134`.

### The HARD GATE — `proof:compose-scene` (born-RED, CLOSES after S.G — sd-#4)

**Gate name:** `proof:compose-scene` (NEW).

**What it asserts.** The scene **mounts in the SPA**; the **standalone entry is GONE** (repo grep +
vite modes — no `demo/playground/`, no `dev:playground`); the **ignition moment drives a real
DrawSVG**.

**Born-RED witness plan.** Authored at D3, the gate is red until the compose scene mounts and the
standalone entry is removed. But it **CLOSES after S.G**, not at D3: compose auto-enrolls in the
occlusion / a11y / font / stage-visible runtime fleet. **DAG edge: S.G1/G2 → compose-fleet-green →
`proof:compose-scene` close.** Closing it at D3 would born-GREEN-then-red the wave mid-band — a **T4
violation** (a wave is CLOSED only when its gate is GREEN re-run on the merged tree, and it must not
flip back to red later in the band). The close-after-G DAG edge is absorbed here (SPEC §6.2 P2-1
note; SD-4).

**Falsifiability.** The gate reads the running SPA (runtime-tier — T1); a source-shape stub cannot
satisfy the "ignition drives a real DrawSVG" clause. Plant: leave `demo/playground/` on disk → the
repo-grep clause REDs.

### Verification

`proof:compose-scene` GREEN **re-run on the merged tree after the S.G close** (the close-after-G DAG
edge — compose auto-enrolls in the occlusion/a11y/font/stage-visible runtime fleet, and
compose-fleet-green precedes this gate's close; runtime-tier — T1); the repo-grep clause confirms
`demo/playground/` and `dev:playground` are gone. Development-only; born-RED; re-run at S.Z2.

### DAG

**Deps: D2, A4** (A4 because D3 reds appearance gates — font/occlusion/a11y/stage-visible). **D3
──► S.G2 (compose items)**. `proof:compose-scene`
close is gated on **S.G1/G2** (compose-fleet-green).

---

## S.D4 — Demo taxonomy + docs truth

**Mode: REFINE** (SPEC §3 S.D4, C-17).

### Charter

Make the demo's own inventory docs tell the truth, and land the fleet-wide naming convention. The
convention (`use<Name>Demo`, C-17) was ruled **before** D3 registered compose (so compose is born as
`useComposeDemo.ts`); D4 executes the renames for the stragglers and regenerates `demo/CLAUDE.md`
against the real tree.

### Scope items

- **S1 — Execute C-17's fleet-wide renames** (the `use<Name>Demo` convention — the rule was made
  BEFORE D3 registered compose; D4 sweeps the `use<Name>Animations` stragglers).
- **S2 — Regenerate `demo/CLAUDE.md`'s `@` section from the real tree** — kill the three phantom
  files (a24 F7) — **+ a doc-drift clause**.
- **S3 — Sweep stale gate-comment/baseline paths** (a10).
- **S4 — The `demo/@`→`shared` rename decision, made terminally.** **RULING: keep `@/`** (alias
  churn buys nothing; document it).

### The HARD GATE — `proof:claude-paths-live` extended over `demo/CLAUDE.md`

**Gate name:** `proof:claude-paths-live` (authored born-RED at S.A5; **extended** here over
`demo/CLAUDE.md`).

**What it asserts.** Every backtick path/symbol in `demo/CLAUDE.md` resolves on disk / in the built
surface — plus the **doc-drift clause** (S2): the `@` section matches the real tree; the three
phantom files red until deleted.

**Born-RED witness plan.** The three phantom `@`-section files (a24 F7) and any stale
`use<Name>Animations` reference make the extended gate red until S1/S2 land. Plant: re-add a phantom
file path to `demo/CLAUDE.md` → REDs.

**Falsifiability.** Resolves each path against the disk/built surface — a doc that names a
nonexistent file cannot pass; the rename convention is enforced by the same resolve (a stale
composable name fails to resolve).

### Verification

`proof:claude-paths-live` (extended over `demo/CLAUDE.md`) GREEN on the merged tree — every backtick
path/symbol resolves, the `@` section matches the real tree (the doc-drift clause), zero
`use<Name>Animations` stragglers. Development-only; born-RED; re-run at S.Z2.

### DAG

**Deps: D1–D3** (the tree must be final before the doc regenerates against it).

---

## Cross-wave provenance (SPEC §9 absorption — sd-demo + P2-1 addendum)

Every §9 blocking edit and Pass-2 probe adjustment this band absorbs, for traceability:

| §9 edit | Substance | Home in this doc |
|---|---|---|
| SD-1 | Re-author `proof:app-is-shell` to a directional predicate (born-RED yet reachable-to-GREEN) + p04's stale-depth clause | S.D1 gate clauses (i)/(ii) |
| SD-2 | Reclassify the five files as cross-scene → `app/runtime/`; evict ONLY `cubeTransformStore.ts`; delete "evict the five" | S.D1 S2/S3 (fold row 30 rewritten) |
| SD-3 | Replace "two gate clauses" with p06's six-item touch set, `SCENE_GATE_META.compose` FIRST | S.D3 touch set 1–6 |
| SD-4 | DAG edge S.G→compose-fleet-green; `proof:compose-scene` closes after G, not at D3 | S.D3 gate + DAG |
| SD-5 | Add the `scenes.ts` `../scenes/`→`../../scenes/` depth bump (16 lines) + same-commit atomicity (demo-driver feeds 5 gates) | S.D1 S4 + co-edit set |
| SD-6 | Define "consuming area" for `proof:shared-has-n-consumers` | S.D2 gate (C-23 per-scene) |
| SD-7 | De-numeric the App.vue shell gate — structural shell-ness; line count = observed tripwire | S.D1 gate clause (iii) |
| SD-8 | Settle the `use<Name>Demo` taxonomy BEFORE D3 registers compose; add compose to SCENE_DIRS with the chosen peer | C-17 → S.D3 S1 + S.D4 S1 |
| SD-9 | Prototype D2 OR author its born-RED gate against an a24-census-derived touch-set | S.D2 (census-derived gate) — the P2-1 probe executed both branches |
| SD-10 | Carry p04's measured D1 cost (~38 files/~60 lines) + relax/re-justify the A4→D1 edge | S.D1 cost + DAG (edge relaxed — D1 ∥ A4) |
| P2-1.1 | Split D2's cost by operation (stores hoist HIGH source/~ZERO gate; transport move LOW source/HIGH gate); author gate + repoint shell-path gates in SAME commit | S.D2 binding cost model + same-commit rule |
| P2-1.2 | Add the T7 walker-root arming-audit; flag `proof:decomposition` (roots at `animation-controls/`, `:79`) | S.D2 walker-root arming-audit |
| P2-1.3 | The `@state` alias needs the bare + wildcard tsconfig pair; `tsc` does not check `.vue` — the gate run MUST include `gh-pages` (+ vitest after `build:lib`) | S.D2 two config facts + verification triple |
| P2-1.4 | Reframe the 497L/477L carve as a scoped-CSS/template split, import-neutral — not a logic decomposition | S.D2 cost model (the reframed carve) |
| P2-1.5 | KEEP the D2 ⟵ G1 DAG edge (`proof:stage-visible` does not exist pre-G1) | S.D2 DAG (edge CONFIRMED, not relaxable) + C-24 |

**Rulings referenced:** C-4 (playground fold — p06), C-14 (per-wave mode declaration), C-17
(`use<Name>Demo`; `useComposeDemo.ts` from birth), C-23 (per-scene "consuming area" counting), C-24
(G1 before D2; `proof:stage-visible` re-run after the carve). **Tenets referenced:** T1 (runtime-tier
closure — D3), T2 corollary (no numeric line count as GREEN — D1), T4 (DEVELOPED ≠ SHIPPED; no
born-GREEN-then-red — D3), T7 (gate follows code; walker-root audit — D2), T9 (census before fiat —
D2). **Probes:** p04 (D1 measured cost; FROZEN set reads built DOM not source paths), p06 (D3 six-item
set; close-after-G; `SceneExposedApi` fit), **P2-1** (D2 carve — confirms-spec, executed).

---

## Appendix C — DEV→IMPL boundary (binding for every S.D wave)

Every wave above is **DEVELOPMENT ONLY** (SPEC §1 "What S is NOT"). Each ships a falsifiable
**born-RED gate**; nothing runs until the owner authorizes an impl drive (inv-16). A wave is **CLOSED
only when its born-RED gate is GREEN re-run on the merged tree** (T4, r2 F4), exit code recorded in
PROGRESS.md; **S.Z2 re-executes that oracle at close** (a re-run, not a re-read). Parallel drives
re-run every touched gate from a clean independent checkout — "pre-existing" claims are verified by
triage, never accepted (T5, a15); node_modules symlinks are never git-added. **Every S.D wave depends
— directly (D1) or transitively (D2–D4) — on S.A0** (the CI surface must be honest before the demo
carve lands).
