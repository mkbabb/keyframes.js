# J.W3 — IMPL RECORD (the estate industrialized · net-deletion EXECUTED · fix round 1 folded)

- **Spec:** `J.W3.md` (BINDING). **Branch:** `j-impl-w3` (worktree `kf-j-w3`, based on the J.W0
  commit `09a56bf`). **Dates:** 2026-06-10 (S1–S7 impl + corpus run) · fix round 1 (the
  chronic-closure detector cure + S2c + the taxonomy doc + this record).
- **Status:** S1 (lib lifecycle + ~56-gate migration) · S2 (ci-env one-authority + postures +
  taxonomy doc + S2c enforcement) · S3 (two-way `proof:all == CI`) · S4 (derived meta-gate
  roster) · S5 (demo-fonts Option A SWITCH leg) · S6 (repin-safe KILL, floors, stale-refs purge,
  W7-1 lib-seam rule) · S7 (the two proxy re-labels) — LANDED, witnessed below,
  ADVERSARIALLY VERIFIED (pass=true; §The adversarial verification), and COMMITTED at the
  wave close (2026-06-10). Never pushed.

## §The net-deletion ledger (§Hard leg-3 — the recorded measurement)

BEFORE measured at `09a56bf` (`/tmp/w3-baseline.txt`; spec §The-state row where it differs is
noted); AFTER measured at the fix-round-1 close of this tree.

| Metric | BEFORE @ 09a56bf | AFTER | Direction |
|---|---|---|---|
| estate LoC (`wc -l scripts/proof-*.mjs`) | 35,191 (spec table: 35,227 @ tranche-j-dev HEAD) | **31,775** | strictly DOWN — the prime cell |
| all `scripts/*.mjs` LoC | 36,627 | **33,175** (lib growth — `demo-driver` lifecycle + `ci-env` + `console-budget` + `gate-shape` — included via consumers' deletions) | strictly DOWN |
| proof scripts on disk | 93 | **92** (−`proof-repin-safe.mjs`; S3d wrapped EXISTING scripts, none added) | strictly DOWN |
| `serveDist` inline copies | 43 (+1 lib decl) | **0** | strictly DOWN |
| `const MIME` inline | 51 | **0** | strictly DOWN |
| inline chromium-resolve (KF_PLAYWRIGHT_DIR, non-lib-importer) | 54 | **0 functional** (labeled residuals: a docstring in `proof-bench-runs.mjs`; meta-gate message prose) | strictly DOWN |
| `navByHash` copies | 5 (3 @ 09a56bf) | **0** | strictly DOWN |
| `IN_CI` re-implemented literal | 3 files | **0 functional** (labeled residual: the S2c enforcer's own detection/message text in `proof-ci-coverage.mjs` — the clause that POLICES the literal) | strictly DOWN |
| lib importers (`lib/demo-driver`) | 9 (7 @ spec authoring) | **60** (`withPage`/`withBrowser` consumers: 57) | strictly UP |
| CI gate invocations (raw-node ∪ `proof:*`) | 112 (109 keys + 3 raw-node steps) | **111** (−1 repin-safe; the 3 raw-node steps RELABELED count-neutral) | strictly DOWN (corroborator) |
| `proof:`-prefix keys | 109 | **111** | +2 NET BY DESIGN — the §Hard leg-3 carve-out (S3d registers 3 previously-uncounted raw-node CI gates; −1 KILL). Recorded for honesty, not gated. |

All cells are HYGIENE corroborators per the spec's labeling; the wave's green hangs on leg-1
below.

## §Leg-1 — bite-preservation witnesses (the correctness leg)

### (i) The per-gate ORACLE-INVARIANCE machine clause (covers EVERY migrated gate)

All **52** removed `fail(`-lines in the migration diff classify into the permitted harness band:
43 bare openers each immediately preceding the deleted `skipOrFail` template (49 `skipOrFail`
decls deleted), 6 single-line `REQUIRE_BROWSER` messages, 3 `else fail(label)` from the
triplicated `IN_CI` budgetMiss/renderMiss now routed through `declarePosture("observe-only",
{reason})` with identical semantics. **The only sanctioned oracle change in the whole wave:**
`proof:demo-fonts` +clause (d) — the S5 SWITCH actuation leg (witnessed biting, bite 4 below).
Assertion sets are otherwise byte-identical pre/post migration: no gate's bite was removed —
the machine fact the seeded sample corroborates.

### (ii) Correctness-tier born-RED witnesses (plants on the BUILT dist; dist restored cmp-identical)

| # | Gate (defect) | Plant | RED observed (named clause) | Restored |
|---|---|---|---|---|
| bite 1 | `proof:demo-smoke` (inv-γ; hygiene-tier, bonus) | blank-mount `index.html` plant | `✗ #app mounts with non-trivial children (blank mount)` + hero-text ✗ | GREEN |
| bite 2 | `proof:icon-paint-live` (B9 orphan class) | favicon asset rename (404 plant) | `✗ (a) icon-paint — 1 glyph(s) failed to paint` + `✗ (b) zero-asset-404 — /assets/favicon-…svg` | GREEN |
| bite 3 | `proof:specular-absent-at-rest` (B7) | specular `op=0.3` re-planted in dist CSS | `✗ [a] CORRECTNESS — 19 glass ::before catch-light(s) STILL paint a bloom at rest` | GREEN |
| bite 4 | `proof:demo-fonts` (brand-font leak + the NEW S5 SWITCH leg) | Plus Jakarta re-landed in dist CSS | `✗ (a) "Plus Jakarta Sans" still on 2 surface(s)` AND `✗ (d) the body font CHANGED across the cube→spring switch` — clause (d) IS the S5 leg, witnessed biting | GREEN |
| bite 5 | `proof:engine-no-throw-on-play` (B1/B5) | the `"......"` empty-value crash re-planted | `✗ [a] rainbow group-play on home threw: Parse error at offset 0: "......"` (×2 scenes) | GREEN |
| fix-round | `proof:easing-editor-live` (B4 blank panel) | `.easing-curve-canvas{display:none!important}` (the recorded reka-latch blank, re-introduced in dist CSS) | `✗ clause (a) cube→easing — the .easing-curve-canvas is NOT mounted+active+visible on switch-in` (+ the amiga→easing return leg) | GREEN, css cmp-identical |
| parity | `proof:perf-frame-budget` · `proof:scene-transition-perf` | pre/post-migration runs, same build | IDENTICAL clause-level verdicts (bite-parity witnesses) | — |
| S6d | `proof:live-session` harness rule (W7-1) | `KF_PLAYWRIGHT_DIR=/nonexistent KF_REQUIRE_BROWSER=1` | `HarnessRequiredError` → exit 1 (a note-skip under REQUIRE_BROWSER is a FAIL, at the lib seam); dev-leg `fail()` at `proof-live-session.mjs:761-765` | — |

**Honest coverage note:** the remaining migrated correctness gates
(`proof:fsm-suspend-resume-live` B2, `proof:amiga-subject-is-pivot` B3, `proof:drag-gesture` B6,
`proof:live-session` battery oracle) carry the clause-(i) machine coverage (oracle-set
byte-identical; harness-band-only diffs) rather than a fresh plant-witness — their recorded
defects live in engine/Three.js behavior not reachable by a dist-CSS plant without rebuilding a
stashed tree. Recorded as machine-fact coverage, not over-claimed as plant witnesses.

### (iii) THE SEEDED HYGIENE SAMPLE (S1c — the seed RECORDED, the sample auditable)

- **Population (45):** the migrated hygiene-tier browser gates — members of `proof:hygiene`
  whose script imports the lib lifecycle (`import { … withPage|withBrowser … } from
  "./lib/demo-driver.mjs"`), MINUS `proof:gate-is-runtime` (the static meta-gate; its regex
  "match" is its own error-message string, it consumes no browser), sorted lexicographically.
- **n = max(8, ⌈0.20 × 45⌉) = 9.** **SEED = 20260610.** **Algorithm:** `mulberry32(SEED)` +
  Fisher–Yates over the sorted population, take the first 9:

```js
function mulberry32(a){return function(){a|=0;a=(a+0x6d2b79f5)|0;let t=Math.imul(a^(a>>>15),1|a);
t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};}
const rand = mulberry32(20260610); const a = [...population /* sorted, 45 */];
for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
const sample = a.slice(0, Math.max(8, Math.ceil(0.2 * a.length)));
```

Each sampled gate: freshly-planted defect on its OWN oracle (dist-level; source for the static
clause), run through the MIGRATED lib path → RED with the named clause → restore → GREEN. The
dist CSS was byte-restored (`cmp` identical) after every plant.

| Sampled gate | Plant (freshly-planted defect) | RED observed (named clause) |
|---|---|---|
| `proof:dock-popover-opens` | `[role="menu"]{display:none!important}` | `✗ finalOpen:true — a trusted click did NOT open the @mbabb menu (aria-expanded:true, menuVisible:false)` |
| `proof:easing-sidebar-normalized` | `.slider-track{height:4px!important}` (the recorded `size="sm"` track) | `✗ easing/spring: NOT on the standard rung … min param-slider track:4.0px (want ≥5px — the size="sm" 4px track is the born-RED)` |
| `proof:cartoon-is-panel-depth` | `[data-surface="cartoon"]{box-shadow:none!important}` | `✗ computed-depth — only 0 cartoon Card(s) (of 8 seen) resolve resting box-shadow === --shadow-cartoon-md` + hover-grow dead |
| `proof:idle-fade` | `.controls-pane--idle:not(.controls-pane--hovered){opacity:1!important}` | `✗ idle-drop — the wrapper carries .controls-pane--idle but opacity is 1.000, not ≈ --controls-idle-opacity (0.35)` |
| `proof:single-column-pack` | `.controls-content .labeled-field{flex-direction:column…}` (the recorded W3 label-ABOVE stack) | `✗ label-left/value-right — 8 of 8 visible leaf rows STACK the label above the control` |
| `proof:bezier-grown` | `.easing-curve-canvas{block-size:160px;max-block-size:220px}` (the recorded W9 cap) | `✗ 1280×720 / 1440×900 grow — the canvas resolved block-size 160px ≤ the W9 220px ceiling` |
| `proof:drawer-spring` | `transition: grid-template-rows 0.55s cubic-bezier(…)` re-inserted in `ControlsPaneWrapper.vue` (the recorded 550ms CSS drawer); `git restore`d | `✗ static — ControlsPaneWrapper.vue still carries a CSS transition on the sheet's MOTION axis` |
| `proof:mobile-single-page` | `.controls-pane-wrapper{position:fixed;top:0;height:100dvh}` (sheet covers the stage) | `✗ cube/amiga/square (subject) 390×844 — (a) the subject is NOT the full-bleed background: UNOCCLUDED visible fraction -0.062 (need ≥ 0.45)` |
| `proof:easing-sidebar-minimal` | `.easing-curve-canvas{block-size:120px!important}` | `✗ B5 (J6) — the canvas block-size 120px is NOT above the W11 in-sidebar ~160px baseline (want ≥ 200px)` |

**9/9 sampled gates RED on their planted defect through the lib, 9/9 GREEN on restore — no
lobotomy in the sample; clause (i) extends the no-lobotomy fact to the full migrated set.**

## §Fix round 1 (the disqualifier + the three gaps — what changed and its bites)

1. **`proof:chronic-closure` detector break (the DISQUALIFIER) — CURED via one lib-aware
   authority.** The S1 migration moved the inline harness trio into the lib;
   `proof:gate-is-runtime` was taught the lib path but `proof:chronic-closure`'s private
   `HARNESS_SIGNATURE` was not — every chronic's cited, correctly-migrated gate "failed" the
   stale signature (12 ✗ clauses, exit 1 — a detector break, NOT a product finding). **Fix
   shape:** `scripts/lib/gate-shape.mjs` is the ONE detection authority
   (`LIB_LIFECYCLE_IMPORT` + `HARNESS_SIGNATURE` + `ACTUATION_PRIMITIVES`/`STRONG_ACTUATION` +
   `missingHarnessAnchors`/`actuationNamesOf`); BOTH meta-gates now import it and their local
   detector tables are DELETED — the inter-detector drift class is dead (one authority, two
   consumers). Post-fix: `proof:chronic-closure` exit 0 (all chronics' cited gates runtime),
   `proof:gate-is-runtime` exit 0 (all 10 correctness gates audited). **Detector still
   discriminates (no lobotomy):** probe — a static source-grep gate fails all 3 harness
   anchors; a synthetic lib-importing load-rest gate (harness ok, 0 actuations) still REDs
   rule 3.
2. **S2c — the declared-posture hygiene clause (was a GAP) — LANDED** as `proof:ci-coverage`
   clause 4 (no new gate; the gate count is untouched): (a) `scripts/lib/ci-env.mjs` is the
   ONLY `scripts/` file reading `process.env.CI`/`GITHUB_ACTIONS` (100 scripts scanned;
   self-excluded enforcer, its mentions being detection text); (b) the observe-only manifest is
   checked TWO-WAY against the taxonomy doc's posture table (declaration without a row → red;
   row without a declaration → red; empty reason → red). **Bites witnessed:** a planted
   `process.env.CI` literal in a scratch `scripts/tmp-s2c-bite.mjs` → RED `posture-authority`;
   dropping the visual-lock row → RED `posture-manifest` (unlisted); adding a `proof:hero-cls`
   observe-only row → RED `posture-manifest` (stale). All restored → GREEN.
3. **The taxonomy doc (was a GAP) — AUTHORED:** `docs/tranches/J/gate-taxonomy.md` — the three
   postures named (hard / observe-only / runner-calibrated), the THIRD STATE (**on-device**:
   correctness-tier-but-CI-observe-only, `proof:perf-frame-budget` canonical) named in prose,
   the machine-checked posture manifest table (3 observe-only gates with their declared
   reasons, byte-equal to the declarations), the named non-instances (`proof:scene-perf-budget`
   hard-by-decision with the ci-linux FLAG; the LoAF bench runner-calibrated;
   `proof:lighthouse-mobile` J.W4-owned), and the no-workaround prohibition.
4. **This wave note (was a GAP) — the seed, the sample, the witnesses, and the ledger are now
   RECORDED** (above), per the S1c binding ("the seed RECORDED in the wave note so the sample
   is auditable").

## §The corpus verdict + triaged reds (recorded; owners named — none is a migration break)

Fresh `npm run gh-pages` build; `KF_REQUIRE_BROWSER=1`, `KF_PLAYWRIGHT_DIR` set; 106-member
roster + `vitest run` (683 passed, 2 expected-fail, exit 0). GREEN includes `live-session`
(38.6s), `scene-control-dfa` (5.7s — the J.W0 navToScene cure), `scene-machine-irrefragable`,
`visual-lock`, `bench-runs`, `gate-is-runtime`, `ci-coverage`, and (post-fix-round)
`chronic-closure`. Triaged reds:

- `proof:perf-frame-budget` clause (d) — /easing drops 11–30 > 3 frames, REPRODUCIBLE solo AND
  pre-migration-identical (16 drops) → **real on-device perf finding** (observe-only in CI);
  product-owner lane.
- `proof:scene-transition-perf` round-trip identity — `selectedControl` easing↔cube returns
  `"controls"` not `"easing"`; pre-migration byte-identical red; the clause is a hard `fail()`
  → **CI-blocking, J.W0/J.W1-owner triage** (a pre-existing product finding at the J.W0
  baseline, handed back per the S1 no-workaround rule — NOT papered at the migration).
- `proof:lighthouse-a11y` — env-skip exit 2 in this worktree (lighthouse not installed;
  W7-1-honest); with `KF_LIGHTHOUSE_DIR` resolved it FAILS(6) on REAL unbucketed audits
  (`label-content-name-mismatch` sequence/motion-path; `aria-required-attr` motion-path) →
  **product/AX posture finding** (cf. the glassui-AX handoff lane).
- `proof:mobile-single-page` / `proof:bezier-grown` / `proof:hero-cls` — transient
  "browser has been closed" chromium crashes under a concurrent sibling worktree agent; all
  three GREEN solo (mobile-single-page + bezier-grown additionally re-witnessed RED→GREEN in
  the seeded sample above).
- `proof:modern-web` — guidance corpus absent in the worktree; GREEN under CI's
  `KF_MWG_OPTIONAL=1` posture.

## §Residuals (labeled)

- `scripts/capture.mjs` calls `chromium.launch` directly — a non-gate utility, lib-importing;
  acceptable.
- `proof-scene-perf-budget` declares NO ci-env posture by documented decision (header prose) —
  the ci-linux lane's Linux-posture FLAG stays OPEN for it.
- Grep residuals, all non-functional and labeled: the `proof-bench-runs.mjs` docstring
  (KF_PLAYWRIGHT_DIR); meta-gate failure-message prose naming the trio; the S2c enforcer's own
  detection text (`proof-ci-coverage.mjs`, self-excluded with an in-source rationale).
- The worktree is plant-clean: dist byte-identical to the fresh build (css `cmp` verified after
  every plant), `ControlsPaneWrapper.vue` git-restored, the scratch bite file deleted; the
  untracked files are the wave's own `scripts/lib/ci-env.mjs` + `console-budget.mjs` +
  `gate-shape.mjs` and the two docs (`gate-taxonomy.md`, this note).

## §The lib API (the four `scripts/lib/` authorities — the estate's single harness)

### `scripts/lib/demo-driver.mjs` (669 LoC; was 492 — grew the lifecycle, killed 5,461 LoC of copies)

| Export | Semantics |
|---|---|
| `withBrowser(fn, { launch, label })` | `resolveChromium()` → `launch` → `try fn(browser) finally close`; under `KF_REQUIRE_BROWSER=1` a harness-start failure throws `HarnessRequiredError` (exit 1), never a note-skip (W7-1, S6d) |
| `withPage(opts, fn)` | `withBrowser` → `serveDist(opts.distDir)` on port 0 → `newContext(opts.context)` → `newPage` → `try fn(page, { url, server }) finally` close context + server — the ONE open-server → resolve-chromium → run → finally-close lifecycle |
| `navToScene(page, sceneId, expectedTrigger, { timeout })` | the J.W0 nav primitive (per-EXPECTED-state wait predicate, ceiling-timeout, load-independent); the 5 `navByHash` copies route here |
| `serveDist(distDir, { onMiss })` | the ONE static server (the 43 inline copies + 51 `const MIME` tables deleted against it) |
| `resolveChromium()` | the ONE `KF_PLAYWRIGHT_DIR` chromium resolution (54 inline copies deleted) |
| `openControlsPanel(page)` / `subjectRect(page, sel)` | pre-existing actuation helpers, KEPT |
| `SCENES` / `SCENE_MACHINE_KEY` | the scene roster + the FSM localStorage key |
| `REQUIRE_BROWSER` / `class HarnessRequiredError` | the W7-1 regime rule's seam: a vacuous skip under `KF_REQUIRE_BROWSER=1` is structurally impossible for a lib-routed gate |

### `scripts/lib/ci-env.mjs` (105 LoC — S2, the ONE `process.env.CI` reader)

`IN_CI` · `POSTURES` (`["hard","observe-only","runner-calibrated"]`) · `observeOnlyInCI(label, reason, {fail, note})` · `declarePosture(posture, { reason, fail, note })`. Enforced by `proof:ci-coverage` clause 4a: NO other `scripts/` file may read `process.env.CI`/`GITHUB_ACTIONS`.

### `scripts/lib/console-budget.mjs` (130 LoC — S1b, `NAMED_BENIGN` promoted out of live-session)

`PARSE_FINGERPRINT` · `GEN_CRASH` · `PROMOTED_GPU` · `PROMOTED_CV` · `DEV_SERVER_LEG` · `NAMED_BENIGN_DEV_SERVER` · `NAMED_BENIGN_ALL_LEGS` · `NAMED_BENIGN` · `isNamedBenign(text, leg)` · `chargeBudget(kind, type, text, leg)` — the W7-2 leg-scoping is a guarantee: dev-server exclusions are INERT on dist legs by construction.

### `scripts/lib/gate-shape.mjs` (85 LoC — fix round 1, the ONE harness-detection authority)

`LIB_LIFECYCLE_IMPORT` · `HARNESS_SIGNATURE` · `ACTUATION_PRIMITIVES` · `STRONG_ACTUATION` · `missingHarnessAnchors(src)` · `hasBrowserHarness(src)` · `actuationNamesOf(src, primitives)` — BOTH meta-gates (`proof:gate-is-runtime`, `proof:chronic-closure`) import it; their private detector tables are DELETED (the inter-detector drift class is dead).

## §The per-batch migration ledger (summarized from `git diff --stat HEAD`)

68 tracked files changed, **+2,270 / −5,533** (scripts/ alone: 64 files, +2,186 / −5,461); plus the
3 NEW untracked lib authorities (`ci-env` 105 + `console-budget` 130 + `gate-shape` 85 = 320 LoC)
and the 2 docs. The 8 migration batches, grouped by gate family:

| Batch | Gates (files) | + / − |
|---|---|---|
| 1 — correctness tier (the actuating set) | engine-no-throw-on-play, fsm-suspend-resume-live, easing-editor-live, amiga-subject-is-pivot, drag-gesture, icon-paint-live, specular-absent-at-rest, live-session, perf-frame-budget, demo-fonts (10) | +358 / −878 |
| 2 — easing/bezier family | bezier-grown, bezier-no-scroll, bezier-single-card, easing-canvas-bounded, easing-sidebar-minimal, easing-sidebar-normalized, easing-stage-is-ball (7) | +161 / −694 |
| 3 — scene family | scene-card-rounded, scene-control-dfa, scene-machine-irrefragable, scene-parity, scene-perf-budget, scene-transition-perf, scene-uses-standard-ribbon (7) | +272 / −728 |
| 4 — stage/card/surface | card-rounded-primitive, cartoon-is-panel-depth, cartoon-shadow-unclipped, glass-and-cartoon, stage-glass-card, stage-not-clipped, stage-within-docks (7) | +183 / −696 |
| 5 — layout/hero/mobile | hero-balance, hero-cls, hero-rung, mobile-single-page, single-column-pack, label-subgrid, demo-shell-grid, timeline-rail-width (8) | +216 / −766 |
| 6 — dock/controls/interaction | dock-popover-opens, dock-zorder, drawer-spring, idle-fade, single-toggle, darkmode-row-toggle, sequence-rows-draggable, motion-path-copy, motion-path-editable, easter-egg, typing-dots (11) | +297 / −1,006 |
| 7 — estate gates + the S3d raw-node wraps | demo-smoke, occlusion-gate, lighthouse-gate, demo-usability, computed-real-dom, visual-lock, lighthouse-mobile (7) | +141 / −230 |
| 8 — meta-gates + estate authorities + the KILL | gate-is-runtime, chronic-closure, ci-coverage, deps-current, proof-browser, **proof-repin-safe (DELETED, −332)**, lib/demo-driver (+178/−1) (7) | +558 / −463 |

Every batch: per-gate `node --check` clean + spot-run GREEN; oracle lines byte-identical
(harness-band-only diffs), per the clause-(i) machine fact above.

## §The adversarial verification (pass=true — the four bite-preservation plants, verbatim)

The independent verifier returned **pass=true** with netDeletion `{gateCountBefore: 112,
gateCountAfter: 111, locBefore: 35191, locAfter: 31775}` and bite-preservation witnessed on
sampled gates — each plant RED with its named clause, then **byte-restored** → GREEN:

1. **icon-paint** — favicon-rename plant (asset 404) → RED → byte-restored GREEN
2. **easing-editor** — `display:none` plant → RED → byte-restored GREEN
3. **specular** — gradient plant → RED → byte-restored GREEN
4. **drag-gesture** — `user-select` plant → RED → byte-restored GREEN

## §The net-deletion record, FINAL (derived fresh from the tree at the close)

| Metric | BEFORE (09a56bf, `/tmp/w3-baseline.txt`) | AFTER (this commit) | Δ |
|---|---|---|---|
| estate LoC (`wc -l scripts/proof-*.mjs`) | 35,191 | **31,775** | **−3,416** |
| `scripts/proof-*.mjs` on disk | 93 | **92** | −1 (repin-safe KILLED) |
| top-level `scripts/*.mjs` | 97 | **96** | −1 |
| top-level `scripts/*.mjs` LoC | 36,627 | **33,175** | −3,452 |
| `scripts/lib/*.mjs` | 1 (demo-driver, 492 LoC) | **4** (989 LoC) | +3 authorities |
| `proof:` keys in package.json | 109 | **111** | +2 NET BY DESIGN (+3 S3d wraps, −1 KILL) |
| CI gate count (raw-node ∪ `proof:*`) | 112 (109 keys + 3 raw-node) | **111** | −1 (verifier-witnessed) |
| lib importers (`lib/demo-driver`) | 9 | **60** | +51 |

## §Per-item estate dispositions (reconstructed from the landed `proof-ci-coverage.mjs` clauses + `package.json`)

| Item | Disposition |
|---|---|
| `proof:repin-safe` | **KILLED** (S6a/GC-5) — see the kill record below |
| `scripts/demo-smoke.mjs` | wrapped as **`proof:demo-smoke`** (S3d/CICD-4), folded into `proof:hygiene`; raw-node step retired |
| `scripts/occlusion-gate.mjs` | wrapped as **`proof:occlusion`** (S3d), folded into `proof:hygiene` |
| `scripts/lighthouse-gate.mjs` | wrapped as **`proof:lighthouse-a11y`** (S3d), folded into `proof:hygiene` |
| `proof:dock-zorder`, `proof:scene-control-dfa`, `proof:scene-transition-perf` | the 3 CI-only orphans (GC-2/BP-4) folded into `proof:hygiene` — clause 0b (converse coverage) now holds; `proof:all == CI` both ways |
| `proof:all` / `proof:correctness` / `proof:hygiene` | RECORDED exclusions (aggregators; CI runs members distributed) — clause 0's EXCLUDED set |
| `proof:browser` | RECORDED exclusion (local dev meta-target, H.W8); its 3 retired CANDIDATE_GATES names DELETED (W7-5) |
| `proof:lighthouse-mobile` | RECORDED exclusion — runner-calibrated, J.W4-owned tier entry (the last orphan; leaves the set at J.W4) |
| `proof:ci-coverage` clause -1 | every workflow VALID YAML (`yaml` now a DECLARED devDep `^2.9.0` — the W0-booked ELSPROBLEMS fragility dispositioned) |
| `proof:ci-coverage` clause 1 (widened) | version-literal consistency across ALL 3 workflows, `^` AND `~` forms (CICD-5; the pre-J.W3 vacuous pass is dead) |
| `proof:ci-coverage` clause 4 (NEW, S2c) | (a) `ci-env.mjs` IN_CI single authority (100 scripts scanned); (b) observe-only manifest TWO-WAY vs `gate-taxonomy.md` |
| observe-only postures (the P6 manifest) | `proof:perf-frame-budget`, `proof:scene-transition-perf`, `proof:visual-lock` — each `declarePosture("observe-only", {reason})`, each a taxonomy-table row |
| deps floors (S6b/BP-5/BP-6) | `value.js ≥ 0.11.2` (the B1/B5 empty-input crash floor), `glass-ui ≥ 3.9.0` (the B7 specular floor), `parse-that ≥ 0.9.0` — match the tree pins `^0.11.2`/`~3.9.0`/`^0.9.0` (repin-safe advance) |
| stale refs (S6c) | `deploy-pages.yml` `^3.4.0` → `~3.9.0`; `ci.yml` `~3.5.1` → `~3.9.0`; retired-gate narration purged; phantom `no-route-storm` docstring refs purged (~8 scripts + the irrefragable console labels) |
| T3 relabels (S7) | `proof:scene-machine-irrefragable` → **reducer-algebra unit oracle** (NON-AUTHORITATIVE for FSM runtime; B2 correctness is `proof:fsm-suspend-resume-live`); `proof:visual-lock` → **appearance-drift tripwire** (pixel truth lives in live-session; baseline re-captured at J.W7a) |
| meta-gate roster (S4/T4) | `proof:gate-is-runtime` derives its correctness roster from `proof:correctness` membership (10 gates audited), not a hand-kept list |
| `proof:demo-fonts` (S5, Option A) | the SWITCH actuation leg landed as clause (d) — the wave's ONE sanctioned oracle change, witnessed biting (bite 4) |

## §The repin-safe kill record (S6a — GC-5, net-deletion)

`proof:repin-safe` was a one-shot G.W1 pre-stage gate for the `value.js ^0.10.0→^0.11.0` /
`parse-that ^0.8.2→^0.9.0` re-pin — HISTORY at this tree (`^0.11.2` / `^0.9.0`):
stale-by-construction. KILLED in ONE motion, per `J.md` §spine ("KILLED, not kept"):

1. `scripts/proof-repin-safe.mjs` **deleted** (−332 LoC);
2. the `package.json` `proof:repin-safe` key **deleted**;
3. its EXCLUDED entry in `proof-ci-coverage.mjs` **deleted** (the parenthetical tombstone at the
   exclusion list records the kill, not an exemption).

Not demoted, not RECORDED-as-template (P-invariant-28 — no perpetual punt). The floor protection
it nominally provided lives in `proof:deps-current`'s ADVANCED floors (S6b), which track the
correctness contract, not the re-pin history.
