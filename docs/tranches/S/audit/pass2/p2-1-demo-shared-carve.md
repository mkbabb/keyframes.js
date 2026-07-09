# P2-1 — the S.D2 demo/@ shared-library carve probe

**Probe:** p2-1-demo-shared-carve · **Tranche:** S DEVELOPMENT (Pass 2) · **Date:** 2026-07-02
**Worktree:** `.claude/worktrees/wf_b438d3a8-c35-1` (throwaway; deliverable is THIS report)
**Charter:** SPEC-v2 §6.2 **P2-1** + S.D2 wave spec (SPEC-v2:706-724) + a24 (`audit32/a24-demo-shared-partition.md`).
**Question:** S.D2 is *the band's largest wave and the ONE big wave no probe ran* (sd-#9). Does the
`demo/@` shared-library carve behave as the spec assumes — a mechanical file-move + import-fix +
path-anchored gate-swap (like R.W5 / p04's app partition), with reds confined to the known
source-path/driver gate set and the census-predicted importer set — or does it surface *unknown
coupling* that mandates re-inventorying `@/` before D-band impl?

---

## 1. The question + the spec's assumption

- **S.D2** (SPEC-v2:706) is UNPROTOTYPED. Its born-RED gate (`proof:shared-has-n-consumers`) is
  authored against the a24 importer census; the wave is (a) the stores hoist
  (`animation-controls/stores/` → `demo/@/state/`), (b) sub-zoning animation-controls into
  transport/keyframes-editor/timeline peers, (c) single-consumer colocations, (d) the
  ControlsPaneWrapper (497L) / AnimationControlsGroup (477L) carve (a11 F1).
- **The assumption under test** (SPEC-v2:1302-1312): the carve is mechanical; reds are *path-anchored*
  (a hardcoded `demo/@/…` source string a gate reads), not *structural-by-meaning* (a gate encoding a
  layout assumption the move invalidates). **SUCCESS** = reds confined to source-path/driver gates +
  the census-predicted importers; `proof:stage-visible` (post-G1) stays green; touch-set within 2× of
  the census. **FAILURE** = reds outside both the FROZEN set and the source-path set.
- **p04's calibration correction (inherited):** reds *outside the FROZEN set but inside the known
  source-path set* are mechanical, NOT a re-inventory trigger. p04 also found the a-lane cost
  estimates miss whole *reference tiers* (test files; the shared `demo-driver.mjs` feeding N gates).

I executed **all three** probe items: (1) the stores hoist, (2) ONE peer sub-zone move (the spec's
exemplar: `transport/` out of animation-controls), (3) the ControlsPaneWrapper carve.

---

## 2. What I did (commands + exit codes)

| Step | Command | Exit |
|---|---|---|
| Add `@state` alias (vite + vitest + tsconfig; **bare `@state` + `@state/*`**) | Edit ×3 | 0 |
| **(1)** Move `animation-controls/stores/` (9 files) → `demo/@/state/` | `mkdir`+`mv` | 0 |
| Swap 33 importers `@components/…/animation-controls/stores{,/*}` → `@state{,/*}` (4 specifier forms: alias-barrel, alias-subpath, test `../demo/@/…`, gate `demo/@/…` + `@/…`) | `perl -0pi` | 0 |
| Fix internal relative `../stores`,`../../stores`,`./stores` in 8 anim-controls files (incl. 2 `.vue`) | `perl` | 0 |
| **(2)** Move 6 transport shells → `demo/@/components/custom/animation-transport/` (root: AnimationControlsGroup, TransportDock; `components/`: ControlsPaneWrapper, DemoGlobalChrome, RibbonBar, SheetGrabHandle) | `mv` | 0 |
| Rewrite shells' cross-boundary imports (`./composables/`, `../controls/`) → `@components/…/animation-controls/…`; repoint the 1 external importer (EditorShell.vue) | `perl` | 0 |
| **(3)** ControlsPaneWrapper carve — *analyzed the 497L seam* (see F6) | — | — |
| **Typecheck** | `npm run check` (`tsc --noEmit`) | **0** |
| **Demo build** | `npm run gh-pages` | **0** (only pre-existing `INEFFECTIVE_DYNAMIC_IMPORT` warning) |
| **Lib build** (vitest self-import) | `npm run build:lib` | 0 |
| **Tests** (p04's 2 + all 6 stores-consuming) | `npx vitest run` (8 files) | **0** — **58 passed** |
| Ran the affected gate roster directly (`node scripts/proof-*.mjs`), classified each | — | see §3 |

**`git diff --stat` (tracked, excl. `dist/`): 66 files changed, 65 insertions(+), 3210 deletions(-)**
— the 3210 deletions are the 15 moved files registering as deletes-at-old-path; the two new roots
(`demo/@/state/`, `demo/@/components/custom/animation-transport/`) are **untracked** (never
`git add`ed, per worktree rules). Edited (non-move) touch-set: **3 config + 22 demo source + 7 test +
4 gate scripts** (the last are stores-path constants I swapped; see F1).

---

## 3. Findings (file:line evidence)

### F1 — [SUCCESS-CONFIRMING] The stores hoist has HIGH source fallout, ~ZERO structural gate fallout — all consumers are `demo/`-rooted walkers or comment/non-moved refs.

The 33 stores importers split: **22 demo source** (7 app, 1 playground, 12 scenes, 2 `@`-internal) +
**7 test** + **4 gate scripts**. All four "stores-referencing" gates
(`proof-single-writer.mjs:73`, `proof-composable-encapsulation.mjs:93`,
`proof-scene-transition-perf`, `proof-scene-machine-irrefragable`) are **`readdirSync` walkers rooted
at `demo/`** (`proof-single-writer.mjs:48` `const DEMO = path.join(REPO, "demo")`) — they follow the
moved files to `demo/@/state/` and stayed **green**. `proof-scene-control-dfa.mjs:72` reads
`AnimationControls.vue` (which did NOT move) → green. `scripts/lib/demo-driver.mjs`'s only
stores mention is a **comment** (`:751`) — it does NOT hardcode a stores path, so — unlike p04's
`scenes.ts` case — the shared driver is **not** broken by the stores hoist. Net: the stores hoist,
despite 22 source importers, produces **zero ENOENT gate reds**; the 4 gate-script edits were
mechanical path-constant swaps that keep them green. **Every red is mechanical or absent.**

### F2 — [ADJUSTS] The a24 census OVER-counts the transport shells' source importers (comment refs miscounted as imports) — the real static/dynamic `.vue` import graph is 1 external edge.

a24's F1/importer-census implies the transport shells are broadly consumed (app + 2 scenes). But a
grep for *actual import statements* of the six shells
(`(import…from|import\()['"]…(Shell)\.vue`) across `demo/` returns **only**:
`editor-shell/EditorShell.vue:106` (imports `AnimationControlsGroup.vue`) + the shells' intra-cluster
edges. The other "importers" the census counted (composables, scenes, dock, kfEngine, App.vue) mention
the shell *names* in **comments / injection-key JSDoc / identifiers**, not imports. So the transport
peer move's **source** fallout is tiny: 1 external repoint + 9 intra-shell alias rewrites. **The
census's "consumer" column conflates textual mentions with import edges** — a method residue beyond
p04's "missing tiers": the census also *inflates* the tiers it does count.

### F3 — [ADJUSTS — the dominant D2 cost] The transport peer move's real fallout is a large GATE tier the census omits entirely: ~10 gates hardcode the shell SOURCE paths.

Where the census sees ~1 source edge (F2), the **gate roster** hardcodes the shell paths in ~17
scripts. Running them post-move, the **move-caused reds** are all path-anchored:

| Gate | Red kind | Evidence |
|---|---|---|
| `proof:control-surface-single-writer` | ENOENT | `:89` `…/animation-controls/components/RibbonBar.vue` |
| `proof:drawer-spring` | ENOENT | hardcodes `…/components/ControlsPaneWrapper.vue` |
| `proof:mobile-single-page` | ENOENT | hardcodes `…/AnimationControlsGroup.vue` |
| `proof:no-single-option-select` | ENOENT | hardcodes `…/TransportDock.vue` |
| `proof:demo-shell-grid` | scope-file MISSING (fail-loud) | `✗ no-legacy grep — scope file MISSING: …/AnimationControlsGroup.vue` + ControlsPaneWrapper |
| `proof:cartoon-is-panel-depth` | scope-file MISSING (fail-loud) | `✗ source-shape — panel Card MISSING: …/RibbonBar.vue` |
| `proof:idioms` | hardcoded-path constants | `:603-605` `GROUP`/`PANE`/`TABS` = old anim-controls paths |

**All seven are mechanical** (repoint a path constant / scope-set list) — none encodes a structural
assumption requiring re-architecture. This is p04-F3 recurring, but **larger and richer**: for the
demo-*shell* half, the gate tier (not the source tier) is the dominant cost, and the coupling is a
**curated scope-file SET** (the S1–S4 `demo-shell-grid` / S1 `cartoon-is-panel-depth` clauses assert
*these specific files ARE the demo shell*), not a lone path constant. The born-RED
`proof:shared-has-n-consumers` gate plus these ~7 existing gates must have their shell path-lists
repointed to `animation-transport/`.

### F4 — [SUCCESS-CONFIRMING] The DOM/dist-reading gates are layout-invariant (p04 F4 holds); the shells appear only in their comments.

`proof:dock-zorder`, `proof:timeline-rail-width`, `proof:idle-fade`, `proof:cartoon-shadow-unclipped`
all read the **built `dist/gh-pages/`** (`…:const DIST = path.join(REPO, "dist/gh-pages")`) and name
the shells only in header comments. A pure source move produces byte-equivalent bundle output, so
these stayed **green by construction**. The FROZEN a27 appearance set is untouched by the partition.

### F5 — [SUCCESS-CONFIRMING, with a caveat] The false-green blindspot is AVERTED — but only because the size-ceiling + structural walkers root at `demo/`, not `animation-controls/`.

The dangerous class for a *peer move* (files leaving a tree a gate sweeps → silently dropped → gate
passes vacuously) did **not** materialize: `proof:demo-no-oversize` walks `demo/` recursively
(`:35 const DEMO = path.join(REPO, "demo")`) and scanned **213 files incl. the moved ones**
(`✓ [ceiling] all 213 demo .vue/.ts files ≤ 500L`) — it followed ControlsPaneWrapper to its new home.
**Caveat / WATCH:** `proof:decomposition` hardcodes `demo/@/components/custom/animation-controls` as a
tree root (`:79`, `:200 fs.existsSync(CONTROLS)`); it stayed green here because its ceiling clause is
`src/animation/**`-only and the demo file-size ceiling was retired to `demo-no-oversize`. But **any
gate that roots a *structural* walk at `animation-controls/` would let peer-moved files escape its
sweep** — a T7 arming-audit obligation D2 must discharge (audit every walker root before the move; a
peer move is only blindspot-safe while the walkers root at `demo/`).

### F6 — [ADJUSTS the a11/S.D2 framing] The ControlsPaneWrapper "497L carve" is import-neutral and is a CSS-volume artifact, not a logic decomposition.

ControlsPaneWrapper.vue = **123L template + 71L `<script setup>` + 298L `<style scoped>`**
(`:1-124`, `:126-197`, `:199-497`). 60% is scoped CSS; the script is already fully extracted into
composables (`usePaneRegister`, `useSheetState`, `useControlsLayout`). So (a) the carve is
**import-neutral by construction** — the public SFC keeps its name/interface, zero external importer
changes; (b) the "497L near-miss" a11 F1 cites as a *decomposition* seam is dominated by **style
volume**, and its natural seam is CSS extraction (or template sub-componentry), not logic
de-nesting. Its only gate is `proof:demo-no-oversize` (F5, walker — sees the result at the new home).
**Adjustment:** S.D2 should frame the 497L/477L carve as a scoped-CSS/template split, and NOT expect
it to relieve any *logic*-complexity gate.

### F7 — [ADJUSTS] Two config facts the a24 target tree implies but doesn't state.

(i) `demo/@/state/` as a first-class peer needs a **new `@state` alias in 3 files** (vite:313,
vitest:10, tsconfig:32) — and tsconfig needs **both** `"@state": ["./demo/@/state/index.ts"]` (bare,
for the barrel import) **and** `"@state/*": […]` (the wildcard alone does NOT resolve bare `@state`;
8 TS2307 until the bare entry is added). (ii) **`tsc --noEmit` does NOT type-check `.vue` SFCs** — the
`./stores` imports in `TransportDock.vue:236` and `AnimationControlsGroup.vue:118` passed `npm run
check` (exit 0) while still pointing at the moved directory; **only `npm run gh-pages` (vite) caught
them.** Same lesson-*class* as p04 F5 (a build-state artifact masquerading), different mechanism: the
`.vue` blind spot means `check` is necessary-but-insufficient — the D2 gate MUST run `gh-pages`.

### F8 — [SUCCESS-CONFIRMING] `proof:stage-visible` is ABSENT in this tree; the "stays green" clause is vacuously satisfied.

The SUCCESS criterion "`proof:stage-visible` (post-G1 shape) stays green" references a gate that
**does not yet exist** (`grep -rn stage-visible scripts package.json` → 0 hits) — it is authored by
S.G1, and S.D2's C-24 sequencing (D2 lands *after* G1, re-runs it green) is precisely why. In this
Pass-2 tree the clause is **N/A**; the sequencing dependency (D2 ⟵ G1) is confirmed load-bearing:
this probe cannot exercise the stage-visible re-run, so the DAG edge D2-after-G1 must not be relaxed.

### F9 — Pre-existing / environmental reds correctly excluded (per p04 method).

Non-move reds observed and confirmed NOT partition-caused: `proof:demo-elevate`
(`--spring-snappy … linear() shadow` — p04 F1 already confirmed identical on master);
`proof:idioms`'s design-token portion (`scene-refork:tokenized` magic numbers, `--color-gold`) is
content, not path; `proof:modern-web` (`mwg-installed: guidance corpus absent` — environmental,
p04 F1 — plus a `dist/gh-pages not built` ordering artifact after `build:lib`). None references a
moved path as a *cause*.

---

## 4. VERDICT: **confirms-spec** (mechanical; no unknown coupling), with cost/method adjustments.

The spec's core assumption holds decisively. **Every move-caused red is path-anchored** — an ENOENT
on a hardcoded source string (F3), a fail-loud "scope-file MISSING" on a hardcoded scope-set (F3), or
a `.vue`-import build error (F7) — each discharged by a find-replace / path-list repoint. **No gate
encoded a structural assumption the move invalidated by meaning.** `npm run check`, `npm run
gh-pages`, and all **8 test files / 58 tests** are green. The false-green blindspot risk of a *peer*
move did not materialize (F5). Reds land **inside the FROZEN set (untouched — F4) ∪ the known
source-path/scope-set gate set (F3)** — the SUCCESS condition. No re-inventory of `@/` is triggered.

**Exact adjustments to S.D2 (not to the ruling):**

1. **Split D2's cost by operation — they have opposite fallout profiles.** *Stores hoist:* HIGH source
   (22 importers) / ~ZERO gate (all consumers are `demo/`-rooted walkers or comment refs — F1).
   *Transport peer move:* LOW source (1 real external edge — the census over-counts, F2) / HIGH gate
   (~7 gates hardcode the shell paths as curated **scope-file SETS**, F3). **D2's real cost is
   gate-repoint-dominated, and that tier is invisible to the a24 census** (which measured component
   imports). Author `proof:shared-has-n-consumers` AND repoint the ~7 existing shell-path gates in
   the SAME commit (no intermediate green — the p04 same-commit-atomicity rule extends here).

2. **Add the walker-root arming-audit to D2 (T7).** The peer move is blindspot-safe ONLY because
   `proof:demo-no-oversize` et al. root at `demo/` (F5). D2 must audit every structural gate's walk
   root; flag `proof:decomposition` (roots at `animation-controls/`, `:79`) as the one to verify does
   not silently drop the peer-moved files.

3. **Add the two config facts (F7):** the `@state` alias needs a **bare + wildcard** tsconfig pair;
   `tsc` does not check `.vue`, so D2's gate MUST run `gh-pages`, not only `check`.

4. **Reframe the 497L/477L carve (F6)** as a scoped-CSS/template split (import-neutral, CSS-volume),
   not a logic decomposition; do not expect it to relieve a logic-complexity gate.

5. **Keep the D2 ⟵ G1 DAG edge (F8):** `proof:stage-visible` does not exist pre-G1; the "stays green"
   success clause is unexercisable until G1 authors it — C-24 sequencing is confirmed necessary.

Touch-set vs census: within 2× on both axes (stores: 22 census → 32 edit sites incl. tests+config;
transport source: census-implied handful → 1+9, an *over*-count by the census, F2). **PASS.**

---

## 5. Implementation-cost estimate for the real S.D2 wave

This probe executed **3 of the ~10 D2 sub-moves** (stores hoist; transport peer; ControlsPaneWrapper
seam). Extrapolated:

- **Stores hoist:** 9 moved + 3 config (incl. bare-`@state`) + 22 demo import-swaps + 7 test-swaps +
  1 injectionKeys + 4 gate path-constants = **~46 edit sites; ZERO structural gate reds**. ~0.5 day.
- **Transport peer move (6 shells):** 6 moved + 9 intra-shell alias rewrites + 1 external (EditorShell)
  + **~7–10 gate scope-set/path repoints** + walker-root audit = **~25 edit sites; gate tier
  dominates**. ~1 day.
- **ControlsPaneWrapper/AnimationControlsGroup carve:** import-neutral scoped-CSS/template split;
  gated only by the `demo/`-walker size gate. ~0.5 day, decoupled from the moves.
- **Remaining D2 (NOT probed):** matrix-editor+orbital-drag→scenes/cube, dock→app, asset-manager→
  playground, useTypedTrigger→scenes/sequence, easing-editor cluster, editor-shell singles,
  keyframes-editor/timeline peers, cubeKeys.ts. Each is the same move+import+gate-repoint shape; the
  cross-module `_resetAssetManagerStore` reach (`state/index.ts:74`) needs the a24-F2 app-level
  reset composer. **Full D2 ≈ 3–4 days, gate-repoint-dominated, LOW risk.**
- **Sequencing:** land moves + gate/scope-set repoints in ONE commit (F3); run `check` **and**
  `gh-pages` **and** `vitest … after build:lib` (F7); D2 after G1 (F8).
