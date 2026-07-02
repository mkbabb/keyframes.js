# p08 — Gate-tier re-taxonomy + diet dry-run (Pass-1E prototype)

**Probe:** p08-gate-retaxonomy · **Question:** SPEC-v1 §6 **Q8** · **Branch:** `tranche-s-dev`
**Mode:** READ-ONLY + dry-run (no repo file mutated; only this report written) · **Date:** 2026-07-02

---

## 1. The question + the spec's assumption

**Q8 (SPEC-v1 §6):** *"Can the gate-tier re-taxonomy land without breaking ci-coverage's
airtightness? Author the gate-tiers manifest (3 tiers) + re-scope gate-is-runtime in a worktree; run
proof:ci-coverage + gate-is-runtime. SUCCESS: both green with the new manifest; a planted mis-tiered
gate REDs; zero gates orphaned. FAILURE: the 15-clause coverage model resists a third tier → stage
the split (library-correctness first)."*

The spec's assumption is set by **S.A4** (§3) and **a27 F1/F4** (audit32): the harness-defined
`proof:correctness` tier ("opens-a-browser") is a misnomer that exiles genuine library-value proofs
(`replay-equality`, `engine-correctness`, `zero-alloc`, `grammar-fuzz`…) to `hygiene`. The plan is a
**three severity-axis taxonomy** replacing the two-tier harness model:

- **`proof:library-correctness`** — node/jsdom value-computing proofs (was `hygiene-chain`).
- **`proof:demo-correctness`** — browser actuators (the current `proof:correctness` set, renamed);
  `proof:gate-is-runtime` re-scoped to police THIS tier.
- **`proof:hygiene`** — structure / boundary / lint / absence-guards only.

S.A4's gate line asserts: *"proof:ci-coverage + reformed proof:gate-is-runtime green over the new
manifest; a planted mis-tiered gate REDs."* This probe tests whether that is mechanically achievable
and enumerates the exact co-edit set.

---

## 2. What I actually did (commands + exit codes)

No file under the repo was changed — this is a simulation/dry-run per the probe brief ("simulate:
which membership lists/env each script reads"). `git diff --stat` = empty (only this report added,
untracked).

| # | Command | Exit | Result |
|---|---------|------|--------|
| 1 | `node scripts/proof-gate-is-runtime.mjs` | **0** | BASELINE GREEN — 24 demo-correctness gates shape-valid, I.W0–I.W7 floor met |
| 2 | `node scripts/proof-ci-coverage.mjs` | **0** | BASELINE GREEN — 15/15 clauses pass |
| 3 | classifier (scratchpad node heredoc over `package.json`) | 0 | all **190** keys classified, none dropped |
| 4 | grep of hardcoded tier tokens in the 3 consumer scripts | 0 | pinned every read-point (§3) |

Read-only source read: `scripts/proof-ci-coverage.mjs`, `scripts/proof-gate-is-runtime.mjs`,
`scripts/run-all.mjs`, `docs/tranches/J/gate-taxonomy.md`, `docs/tranches/S/audit/pass1/audit32/a27-gate-roster.md`, `SPEC-v1.md`.

---

## 3. Findings — the composition contracts and their exact read-points

The re-taxonomy is a **rename + split of tier aggregators**. Three scripts consume the tier
membership as load-bearing tokens; each is a co-edit point, not a hazard, but **airtightness is
preserved ONLY if all three are edited in lockstep**. The 15-clause model does **not** structurally
resist a third tier (Q8's FAILURE condition is NOT triggered).

### 3.1 `proof:ci-coverage.mjs` — what it reads, and the co-edits

| Clause | Reads | Tier-aware? | Effect of re-taxonomy |
|--------|-------|-------------|-----------------------|
| 0 forward-coverage (`:194-214`) | all `proof:*` keys minus `EXCLUDED` (`:141-192`); demands each `npm run <gate>` in ci.yml | **YES** | **CO-EDIT:** add `proof:library-correctness` + `proof:demo-correctness` to `EXCLUDED` (they are chains of already-wired members, exactly like `proof:correctness`/`proof:hygiene` today). Rename the `proof:correctness` EXCLUDED entry. |
| 0b converse-coverage (`:221-279`) | `resolveTier("proof:correctness")` + `resolveTier("proof:hygiene")` (`:238-239`); every CI-invoked gate must be in `correctness ∪ hygiene ∪ EXCLUDED` | **YES — THE CRITICAL ONE** | **CO-EDIT:** union all THREE tiers. If missed, all ~39 library-correctness gates (now removed from hygiene-chain) are CI-invoked but in neither resolved tier → flagged `ciOnly` → **RED**. This is the #1 implementation risk. |
| 0c raw-node (`:288-307`) | ci.yml step shapes | no | unaffected |
| 1 version-literal (`:317-349`) | `@mkbabb/*` ranges vs workflow literals | no | unaffected |
| 2 clone-DRY (`:358-382`) | workflow glass-ui refs | no | unaffected |
| 3 concurrency (`:387-404`) | workflow blocks | no | unaffected |
| 4a IN_CI authority (`:423-455`) | every `scripts/*.mjs` for `process.env.CI` | no | unaffected by re-tier |
| 4b observe-only manifest (`:457-528`) | `declarePosture("observe-only")` in gate scripts ⇄ rows in `docs/tranches/J/gate-taxonomy.md` | **indirectly** | **CO-EDIT (lockstep):** any observe-only gate the diet **merges/deletes** (`glassui-aria-ask`, and the frozen `visual-lock`/`drawer-spring` if deleted) leaves a **stale taxonomy row** → RED. Delete the row in the same motion. Re-tiering alone (no delete) is inert here. |
| 4-ext device-honesty (`:530-609`) | 5-col observe-only rows | same as 4b | same |
| 5 publish-path (`:621-668`) | release.yml gate order | no | unaffected |
| 6 bornred-tripwire (`:700-741`) | `BORNRED_TRIPWIRES=[proof:peer-satisfied]` present in pkg (`:701-703`) | **YES** | **CO-EDIT if merged:** if `peer-satisfied` folds into `proof:constellation-consume-edge`, retarget this literal (or the born-RED arm moves into the consolidated gate's state machine). |
| 7 static-gate-placement (`:757-835`) | ci.yml job spans; `STATIC_DEMO_CARVEOUT` (`:758-771`) | no | unaffected by tier NAMES (it classifies by browser-harness import, not tier) |

**Verdict on ci-coverage:** airtight after **two mechanical edits** (EXCLUDED add at `:141-192`;
third-tier union at `:238-239`), plus **lockstep taxonomy-doc maintenance** for any deleted
observe-only gate. The 15-clause model is tier-count-agnostic everywhere except clauses 0 and 0b,
both trivially extensible.

### 3.2 `proof:gate-is-runtime.mjs` — what it reads, and the co-edits

| Read-point | Line | Effect |
|-----------|------|--------|
| `SCRIPTS["proof:correctness"]` (roster derivation) | `:82`, `:108` | **CO-EDIT (required):** → `SCRIPTS["proof:demo-correctness"]`. If left as-is after rename, `SCRIPTS["proof:correctness"]` is `undefined→""`, `WAVE_HARD_GATES` = **empty**, non-vacuity floor fires `[coverage] roster is EMPTY` → **RED**. This IS the "re-scope gate-is-runtime" step S.A4 names. |
| `inCorrectness = inChain(PROOF_CORRECTNESS, gate)` | `:163` | follows the rename automatically once `:82` is retargeted |
| `PROOF_HYGIENE` — "§Hard gate must NOT be in hygiene" | `:139`, `:164`, `:171-176` | inert; demo-correctness gates were never in hygiene. Library-correctness gates are NOT in the roster (only demo-correctness is derived), so they are never shape-audited — **exactly why re-scoping to a single tier (not a union) is essential**: LC gates are node/jsdom and would fail the browser-harness anchor check. |
| `EXPECTED_WAVES = [I.W0…I.W7]` frozen floor | `:248` | **CO-EDIT (mandated by a27 F4 / S.A4 "drop the frozen I-wave floor"):** replace with a membership-count non-vacuity floor (non-empty + every member shape-valid). NOTE: my disposition keeps all 10 I-floor gates in demo-correctness, so the floor stays GREEN even if left unedited — but the spec mandates the drop regardless. No risk either way. |
| `WAVE_ANNOTATION` (I-era provenance) | `:94-105` | stale-provenance only (a27 F4); regenerate or drop; does not gate membership. |

**Delegation trap (subtle):** `gate-is-runtime` reads the raw tier string and regex-matches
`proof:*` tokens (`:108`) — it has **no** `resolveTier` indirection (unlike ci-coverage `:231-235`).
Therefore **`proof:demo-correctness` MUST stay a direct `&&` chain** in package.json. If it is made a
run-all delegator (`node scripts/run-all.mjs --tier=proof:demo-correctness-chain`), the raw string
contains zero `proof:*` members → empty roster → RED. Either keep it direct (recommended; the current
`proof:correctness` already is) OR port ci-coverage's `resolveTier` helper into gate-is-runtime.

### 3.3 `scripts/run-all.mjs` — the third, easily-missed consumer

`run-all.mjs:42` hardcodes the `--all` tier list: `["proof:correctness", "proof:hygiene"]`.
`proof:all => node scripts/run-all.mjs --all`, so this IS the scheduler for the whole roster.
**CO-EDIT (required):** → `["proof:library-correctness", "proof:demo-correctness", "proof:hygiene"]`.
If missed, `proof:all` silently stops scheduling the demo-correctness (renamed) tier and never
schedules library-correctness → a **coverage LIE that ci-coverage clause 0b would then also flag**
(the two failures reinforce, so it cannot ship silently — but it must be fixed here).

### 3.4 Is the "planted mis-tiered gate REDs" success criterion met?

**Partially — one direction is airtight, the reverse needs a new clause (spec ADDITION).**

- Node/jsdom gate mis-filed into `proof:demo-correctness` → `gate-is-runtime` `missingHarnessAnchors`
  fires (`:199-207`) → **RED**. ✅ (the dangerous direction: a fake "correctness" gate.)
- Browser-actuating gate mis-filed into `proof:library-correctness` → **no gate catches it**.
  `gate-is-runtime` only derives its roster from demo-correctness, so LC is unaudited. Recommend a
  **symmetric clause**: a `proof:library-correctness` member's script must NOT carry browser-harness
  anchors (invert `missingHarnessAnchors`). Cheap (~15 LOC in gate-is-runtime). Makes mis-tier
  bidirectional and fully satisfies Q8's success bar.

### 3.5 Roster-diet arithmetic (validates a27's 190→~120 target)

190 keys − 1 KILL (`animate-orchestration`) − 6 MERGE-collapse (morph 3→1, emerging-css 3→1,
constellation 3 stubs→1) − ~45 FROZEN-fold (51 pixel/layout locks → ~6 system-property gates) + 1
new LC aggregator ≈ **~138 immediate, → ~120 once the frozen fold fully discharges**. Consistent with
a27 §"Tranche-S implications" (190→~120, zero live properties lost). `scene-switcher-mobile` is
retired but reborn as `proof:scene-stage-commits` (C-6/S.E4) — net-neutral on count, new gate.

---

## 4. Machine-readable disposition table (all 190 keys)

Legend — **tier:** `LC`=library-correctness, `DC`=demo-correctness, `HY`=hygiene, `AGG`=aggregator.
**disposition:** `keep` · `re-tier` · `merge` · `kill` · `freeze-migrate` · `rename`.
`[OO]` = observe-only posture (taxonomy manifest, orthogonal to tier).

```
disposition=rename (aggregators)  [6]
  proof:correctness       AGG  rename→proof:demo-correctness
  proof:hygiene           AGG  keep (LC members split off)
  proof:hygiene-chain     AGG  keep (LC members split off)
  proof:all               AGG  keep (= library-correctness && demo-correctness && hygiene via run-all)
  proof:all:demo          AGG  keep
  proof:browser           AGG  keep
  [NEW] proof:library-correctness  AGG  create (direct && chain of the 39 LC gates below)

disposition=re-tier→DC (was proof:correctness; keep, demo-correctness)  [23]
  proof:engine-no-throw-on-play   DC  keep [I-floor]
  proof:fsm-suspend-resume-live   DC  keep [I-floor]
  proof:easing-editor-live        DC  keep [I-floor]
  proof:amiga-subject-is-pivot    DC  keep [I-floor]
  proof:drag-gesture              DC  keep [I-floor]
  proof:perf-frame-budget         DC  keep [I-floor][OO] (or migrate→portable-perf ratio, F8)
  proof:icon-paint-live           DC  keep [I-floor]
  proof:specular-absent-at-rest   DC  keep [I-floor]
  proof:demo-fonts                DC  keep [I-floor]
  proof:live-session              DC  keep [I-floor]
  proof:subject-animates          DC  keep
  proof:cold-entry                DC  keep
  proof:control-surface-single-writer DC keep
  proof:sheet-reopen-scroll       DC  keep
  proof:font-census               DC  keep
  proof:live-session-mobile       DC  keep [OO clause row]
  proof:appearance-suffusion      DC  keep
  proof:spring-slider-continuous  DC  keep
  proof:spring-heatmap            DC  keep
  proof:demo-control-point        DC  keep
  proof:easing-curve-editor       DC  keep
  proof:amiga-decay-visible       DC  keep
  proof:morph-scene               DC  keep

disposition=re-tier→LC (was hygiene-chain; library value-proofs)  [39]
  proof:replay-equality           LC   proof:engine-correctness        LC
  proof:compile-deterministic     LC   proof:compile-replay            LC
  proof:zero-alloc                LC   proof:standalone-zero-alloc     LC
  proof:roundtrip-fidelity        LC   proof:roundtrip-easing          LC
  proof:nan-frame                 LC   proof:grammar-fuzz              LC
  proof:interpolate-anything      LC   proof:composition-honored       LC
  proof:interp-fastprops          LC   proof:sync-step                 LC
  proof:event-ordering            LC   proof:adapter-capture           LC
  proof:diagnostics-channel       LC   proof:scroll-roundtrip          LC
  proof:motion-path               LC   proof:blend                     LC
  proof:spring-blend-weight       LC   proof:drawsvg                   LC
  proof:finished                  LC   proof:adopt-compiled            LC
  proof:ingest-replay             LC   proof:orbital-rotate3d          LC
  proof:kf-differential           LC   proof:spring-vector             LC
  proof:orchestration             LC   proof:transport-events          LC
  proof:soa-composite             LC   proof:color-soa                 LC
  proof:processframe-soa          LC   proof:waapi-adaptive-densify    LC
  proof:color-fidelity            LC   proof:cohesion                  LC
  proof:scheduler-posttask        LC
  proof:morphsvg-consume          LC   MERGE-survivor → proof:morph (see below)
  proof:emerging-css-resolve-now  LC   MERGE-survivor → proof:emerging-css-resolve (see below)

disposition=merge  [7 keys → 3 survivors]
  proof:morph-renders-d           → fold into proof:morph (one vitest boot, 3 node clauses)  [LC]
  proof:morph-orients             → fold into proof:morph                                     [LC]
    survivor: proof:morph  (F6: 3 morph gates re-boot test/morph-svg.test.ts 3×; collapse to 1)
  proof:emerging-css-resolve-p2   → fold into proof:emerging-css-resolve (vitest glob)        [LC]
  proof:emerging-css-resolve-fn   → fold into proof:emerging-css-resolve                      [LC]
    survivor: proof:emerging-css-resolve  (F7; do at compile/resolve/ sub-zoning, S.B4/S.B3)
  proof:glassui-aria-ask   [OO]   → fold into proof:constellation-consume-edge (state machine)
  proof:peer-satisfied            → fold into proof:constellation-consume-edge
    survivor: proof:constellation-consume-edge  (F5; workaround-deletion generalizes; the
    pin-ledger-current npm-view LEG folds as a clause — pin-ledger-current itself stays HY)

disposition=kill  [2]
  proof:animate-orchestration     KILL  C-3/S.C1 (animate.ts excision: file+2 tests+gate+docs)
  proof:scene-switcher-mobile     KILL  C-6/S.A4 retire → reborn proof:scene-stage-commits (S.E4)

disposition=freeze-migrate (FROZEN demo-appearance set; red-authorized by S; discharge via
  delete-with-cause OR migration to a layout-invariant system-property gate)  [51]
  proof:idioms  proof:phi-leaf-zero  proof:icon-idiom  proof:styling-idioms  proof:scene-parity
  proof:typing-dots  proof:dogfood-hero  proof:easing-canvas-bounded  proof:scene-uses-standard-ribbon
  proof:easing-sidebar-normalized  proof:easing-sidebar-minimal  proof:easing-stage-is-ball
  proof:scene-card-rounded  proof:stage-glass-card  proof:card-rounded-primitive
  proof:stage-within-docks  proof:mobile-single-page  proof:bezier-no-scroll  proof:bezier-single-card
  proof:bezier-grown  proof:pp-logo-svg  proof:hero-rung  proof:hero-balance  proof:hero-cls
  proof:cartoon-is-panel-depth  proof:glass-and-cartoon  proof:dock-popover-opens  proof:single-toggle
  proof:darkmode-row-toggle  proof:idle-fade  proof:single-column-pack  proof:label-subgrid
  proof:timeline-rail-width  proof:demo-shell-grid  proof:layout-cluster  proof:stage-not-clipped
  proof:cartoon-shadow-unclipped  proof:dock-zorder  proof:drawer-spring[OO]  proof:crayon-preserved
  proof:design-refinement  proof:sequence-rows-draggable  proof:motion-path-editable
  proof:motion-path-copy  proof:easter-egg  proof:demo-no-oversize  proof:demo-usability
  proof:demo-elevate  proof:taste-packet  proof:occlusion  proof:visual-lock[OO]
  → target system-property replacements (a27 F2 / S.G1): proof:stage-visible, proof:demo-occlusion-free,
    proof:demo-a11y, proof:demo-dogfoods-engine, + re-authored-against-new-demo keepers (phi-leaf etc.)

disposition=keep, HY regression-guard band (F9: band under a "# regression-guard" header)  [9]
  proof:no-deprecated-guard  proof:alias-dropped  proof:no-silent-fallback  proof:no-cross-realm-cast
  proof:no-foreign-symbol-stamp  proof:no-flat-siblings  proof:no-dup-utility  proof:no-brittle-selector
  proof:no-single-option-select

disposition=keep, HY [OO] (migrate wall-clock→portable-perf ratio where possible, F8; target OO 8→≤3)
  proof:lighthouse-mobile  proof:bench-taxonomy  proof:epf1-measure  proof:scene-transition-perf  [4]

disposition=keep, HY (structure / boundary / absence / meta)  [49]
  proof:boundary  proof:published-surface  proof:changelog-5  proof:agent-surface  proof:in-is-importable
  proof:agent-validate  proof:demo-on-published-surface  proof:readme-runs  proof:readme-paths-live
  proof:deps-current  proof:repin-witness  proof:dogfood  proof:engine  proof:decomposition
  proof:brittleness  proof:modern-web  proof:platform-adopt  proof:bench-runs  proof:asset-store-singleton
  proof:scene-raf-leak  proof:scene-contract-identity  proof:group-snapshot-identity  proof:resize-tracks
  proof:computed-real-dom  proof:demo-smoke  proof:lighthouse-a11y  proof:gate-is-runtime
  proof:scene-machine-irrefragable  proof:scene-control-dfa  proof:single-writer
  proof:composable-encapsulation  proof:scene-colocated(*delete ASSERTION 3, C-6)  proof:scene-perf-budget
  proof:ci-coverage  proof:report-all  proof:css-parity  proof:packrat-sound  proof:consume-bundle
  proof:settle-is-predicate  proof:manifest-sourced  proof:chronic-closure  proof:portable-perf
  proof:record-truth  proof:lint-clean  proof:drag2d-light-certified  proof:published-on-master
  proof:deploy-roundtrip  proof:wave-charter  proof:pin-ledger-current
```

*Note on classification boundaries (judgment calls for the impl wave):* the demo-composable vitest
gates (`asset-store-singleton`, `scene-raf-leak`, `scene-contract-identity`,
`group-snapshot-identity`, `resize-tracks`) are left in **HY** here — they assert demo-layer
composable invariants, not published-library value; the impl wave may promote them to LC if it deems
them library-surface. `scene-perf-budget` / `computed-real-dom` are borderline LC/HY. These do not
affect the composition-contract analysis (both meta-gates are indifferent to the LC↔HY split as long
as clause 0b unions all three tiers).

---

## 5. VERDICT: **confirms-spec**

The three-tier re-taxonomy **can land without breaking `proof:ci-coverage`'s airtightness or
`proof:gate-is-runtime`'s enforcement** — Q8's FAILURE condition ("the 15-clause model resists a
third tier → stage the split") is **NOT triggered**. The 15 clauses are tier-count-agnostic
everywhere except clauses 0 (EXCLUDED add) and 0b (tier union), both mechanically extensible; the
meta-gates stay green after a bounded, fully-enumerated co-edit set. **No staging is required** —
library-correctness and demo-correctness can be introduced in one wave (S.A4). Both meta-gates verify
GREEN at baseline (exit 0) so the "stays green" claim rests on a measured floor.

**Adjustments to fold into SPEC-v2 (three, all additive to S.A4 — none refute the plan):**

1. **Name the exact co-edit set in the wave (5 artifacts, atomic diff — T7 "gate follows code").**
   The re-taxonomy is not "edit package.json"; it is a lockstep edit of:
   (a) `package.json` — rename `proof:correctness`→`proof:demo-correctness` (**keep it a direct `&&`
   chain**), add `proof:library-correctness` chain, thin `proof:hygiene-chain`;
   (b) `scripts/proof-ci-coverage.mjs` — `EXCLUDED` add (`:141-192`) + **third-tier union at
   `:238-239`** (the airtightness linchpin);
   (c) `scripts/proof-gate-is-runtime.mjs` — retarget `:82`/`:108` to `proof:demo-correctness`,
   drop the frozen `EXPECTED_WAVES` floor (`:248`) for a membership-count floor, regenerate/drop
   `WAVE_ANNOTATION`;
   (d) `scripts/run-all.mjs:42` — the `--all` tier list → 3 tiers (**the easily-missed third
   consumer**);
   (e) `docs/tranches/J/gate-taxonomy.md` — delete observe-only rows for any merged/deleted
   observe-only gate (clause 4b/4-ext stale-row RED otherwise).

2. **Add a symmetric mis-tier clause to satisfy Q8's "planted mis-tiered gate REDs" fully.** Today
   `gate-is-runtime` only catches a node gate masquerading as demo-correctness. Add: a
   `proof:library-correctness` member's script must NOT carry browser-harness anchors — making
   mis-tier bidirectional (~15 LOC).

3. **`proof:demo-correctness` MUST remain a direct `&&` chain** (or port ci-coverage's `resolveTier`
   helper into gate-is-runtime, which reads the raw tier string with no delegation-resolution). This
   is a hard constraint the manifest design must honor.

**Secondary confirmation (a27 targets validated):** the diet reaches ~138 keys immediately and ~120
once the 51-gate FROZEN set discharges into ~6 system-property gates — matching a27's 190→~120 with
zero live properties lost. The morph-triple and emerging-css-triple merges are safe (F6/F7); the
constellation stub fold (F5) is the only merge touching a born-RED tripwire (`peer-satisfied`) and
must update ci-coverage clause 6's `BORNRED_TRIPWIRES` literal.

---

## 6. Implementation-cost estimate for the real wave (S.A4)

- **Files touched (core re-tier):** 5 — `package.json`, `proof-ci-coverage.mjs`,
  `proof-gate-is-runtime.mjs`, `run-all.mjs`, `docs/tranches/J/gate-taxonomy.md`. Plus `ci.yml` for
  every renamed/merged/killed gate's `npm run` step (clauses 0 + 0b demand key⇄step parity). This is
  a **mechanical, contained diff** — no library or demo source touched by the re-tier itself.
- **Gates directly affected:** 24 renamed (correctness→demo-correctness), 39 re-tiered (hygiene→LC),
  7 merged→3 survivors, 2 killed, 51 frozen (red-authorized, discharged by S.G1/S.D across the demo
  rewrite — **not** in S.A4). The FROZEN discharge is the large downstream cost and belongs to the
  demo bands, not the re-tier wave.
- **Risk:** **LOW for the re-tier mechanics** (both meta-gates green today; the co-edit set is fully
  enumerated and small). **The single highest risk is omitting the clause-0b third-tier union**
  (`proof-ci-coverage.mjs:238-239`) — that alone reds all 39 LC gates as `ciOnly`; it is caught
  immediately by re-running ci-coverage, so it fails loud, not silent. **MEDIUM risk** lives in the
  FROZEN-set discharge (S.G1/S.D/S.E): each red must be closed by deletion-with-cause or migration to
  a system gate, and the a27-projected "~54→single-digit" fold is the load-bearing assumption behind
  the 190→~120 headline — prototype p04 (Q4: does the demo partition survive the 54-gate migration
  cheaply) is the direct dependency; this probe confirms the *taxonomy* half but not the *migration*
  half.
- **Sequencing:** S.A4 blocks S.D/S.E/S.G red-declarability (DAG). The re-tier itself has only S.A0
  (CI-green) as a hard predecessor — it can land early, and should, so every later wave's born-RED
  gate is declared against the honest tier names.
