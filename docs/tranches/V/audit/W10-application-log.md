# V.W10 — Doc-Canon Application Log (the NOW subset)

**Wave:** V.W10 (doc-canon unit) · **Branch:** `v/w10-canon` · **Date:** 2026-07-17
**Baseline:** rebased on `origin/master` (W4's tree — the `./engine` mirror-test prune
`fe42c6f9` is a fact this log's mirror-note records). `npm ci` clean.

**Subset applied:** every correction-manifest row that touches NEITHER `demo/**` NOR
`ci.yml`. The `demo/**` rows land post-W2 with the V.C waves; the `ci.yml` rows land
after W9 merges (the single-writer chain). Both are DEFERRED below with reasons.

**Tree drift note (DM-01):** the manifest was written against `a59d3a22` where
`llms.txt`/`llms-full.txt` were committed. Post-R.W7 (`22de623c`, "llms reclassify —
gitignore + generate-before-assert") they are **gitignored build artifacts**;
Tranche-U `70b32501` ("dissolve the proof apparatus") then removed the
`scripts/proof-agent-surface.mjs` gate that asserted them — the exact DR-1 drift DM-01
targets. DM-01 is therefore applied in the generate-before-assert spirit (regen +
real `--check` + one wired gate), not as a "commit the pair" edit.

---

## Row-for-row disposition

| Row | Disposition | Note |
|---|---|---|
| **DM-01** agent surface | **APPLIED** | (a) `llms.txt`/`llms-full.txt` regenerate fresh (gitignored) with getTimingFunction=0; (b) `gen-agent-surface.mjs --check` rewritten as a REAL diff-and-exit (regenerate → byte-diff on-disk → exit 1 on drift/absence; was print-and-exit-0); (c) wired at ONE site — new `scripts/gates/surface/agent-surface.mjs` added to `proof:publish`'s `checks` array (generate-before-assert + curated-export-reality invariant + getTimingFunction guard). NOT ci.yml, NOT a new proof genre, NOT package.json. |
| **DM-02** `README.md:428` `weighted-blend`→`weight-blend` | **APPLIED** | manifest's exact replacement (backtick token + column-preserving trailing spaces). The one genuine code-value drift. |
| **DM-03** `README.md:322` "weighted blending" | **GUARDED** | live-feature prose — verified UNTOUCHED (see guard verifications below). |
| **DM-04** `README.md:433` "(weighted blending, perceptual color)" | **GUARDED** | live-feature prose — verified UNTOUCHED. |
| **DM-05** `README.md:764` "with weighted blending and a transport" | **GUARDED** | live-feature prose — verified UNTOUCHED. |
| **DM-06** `docs/published-surface.md` "(`weighted` blend …)" | **GUARDED** | live-feature refusal-axis prose — verified UNTOUCHED (text now at `:158`, shifted by the Scope-11 pin note inserted ABOVE it; content byte-identical). |
| **DM-07** `demo/DESIGN.md:67` `Card surface="cartoon"`→`Card cartoon` | **DEFERRED** | the only `DESIGN.md` is `demo/DESIGN.md` (root `DESIGN.md` does not exist) → under `demo/**`, a STANDING-LAW no-touch and part of the deferred demo subset. Lands post-W2 with V.C. (The task's APPLY shorthand "DESIGN.md:67" assumed a root file; the file is demo-scoped.) |
| **DM-08** `CHANGELOG.md` 6.0.0 two breaking bullets | **APPLIED** | inserted at the XB-08-corrected anchor: AFTER the "One authored interpolation model" bullet (ends `paths.` at `:21`) and BEFORE the blank `:22` preceding `### Dependency Changes` (`:23`). `printWidth`-removed + `BlendMode`/`"weighted"`-op-removed bullets, verbatim per manifest (the second bullet's live-feature clause preserved). |
| **DM-09** README `getTimingFunction` | **NEGATIVE (no edit)** | `grep -n getTimingFunction README.md` → 0; the drift is llms-only (cured by DM-01). Booked so no blind "also fix README". |
| **DM-10** `FINAL-U.md:114` constellation boundary | **APPLIED (annotation)** | SUPERSEDED block inserted immediately ABOVE the SCI/Atlas block; original prose verbatim below. Points at handoff §5; states the true rail (Value 4 → kf 6 → Glass 7 → atlas 7.0.0). |
| **DM-11** `FINAL-U.md:124` "V inherits no U backlog" | **APPLIED (annotation)** | SUPERSEDED block above the sentence (npm shipped 5.3.5/6.0.0; handoff carries the de-facto V inheritance). |
| **DM-12** `FINAL-U.md:161` "terminal 5.3.4" | **APPLIED (annotation)** | SUPERSEDED block above the 5.3.3-baseline paragraph (`npm view … dist-tags → latest: 6.0.0` verified this wave). |
| **DM-13** `FINAL-U.md:118` MbabbMenu reword row | **APPLIED (annotation, RETIRED)** | merged into the DM-10 block. Evidence re-verified this wave: `grep -nE '\[' demo/app/dock/MbabbMenu.vue` → a single bracket literal `min-w-[var(--dock-panel-width)]` at **`:27`** on a real `<DropdownMenuContent>` (the manifest's pre-transaction `:6` has drifted). CHANGELOG 5.3.5 already records the reword DONE. |
| **DM-14** `FINAL-U.md:43` "10,776 across 77 files" | **APPLIED (annotation)** | per the formation's annotate-never-rewrite ruling (FINAL-U is frozen history), NOT the manifest's default in-place cell edit. SUPERSEDED block placed above the dissolution table (a `>` line inside the table would break its rendering); names the specific row and the corrected 10,846/32-tracked-files figure. |
| **DM-15** `FINAL-U.md:53` "six nightly" | **APPLIED (annotation)** | cadence relabel as an annotation (not in-place), consistent with DM-10..14. cron `17 3 * * 1` (dow=1) verified = weekly Monday. |
| **DM-16** `ci.yml` 4 "nightly"→"weekly" comments | **DEFERRED** | `ci.yml` is the single-writer chain (lands after W9) and a STANDING-LAW no-touch this wave. |
| **DM-17** `docs/dogfood-inversion.md:48` past tense | **APPLIED** | "npm does NOT yet carry…/K.WZ does the republish" → "npm now carries those exports (published from K.WZ onward through 6.0.0)". (Task's defer line lumps "DM-16/17 ci.yml"; DM-17 is the dogfood row, explicitly in the APPLY list — only the ci.yml part, DM-16, is deferred.) |
| **DM-18** glass-provenance version comments | **DEFERRED** | every listed site is under `demo/**` (deferred subset); also the XB-03/E3 ordering edge — the demo transaction + DT moves shift the anchors, so the version-token re-grep rides with the demo waves. |
| **DM-19** MEMORY "Atlas 2" re-pin | **OUT-OF-REPO** | session-side auto-memory, not repo bytes (Scope 10 → orchestrator output: atlas 2.0 → atlas 7.0.0; the Glass consume-edge note). `docs/tranches/U/KF-TO-GLASSUI-U.md:58` is a SEALED U letter — NOT edited; the "atlas 7.0.0" correction routes to the V outbound packet. |
| **XB-05** 4 bench taxonomy comments + `interpolate.ts:257-259` | **APPLIED** | `interpolate.ts` (the ONE src touch W10 owns) re-pointed from the DELETED `bench/taxonomy.json` "budgeted K=8 SoA-lerpArray row" to the surviving `NumericFoldPlan · K=8 · 600-frame window` run-check at `bench/interp-buffer.bench.ts` (PB-1's exact target), dropping the "ADOPT floor" (no-residual-twin) framing. The 4 bench headers (`resolve`, `group-composite`, `cold-import`, `spring-tick`) re-homed off `taxonomy.json` to their own file headers/run-checks — forward-compatible with the GP taxonomy prune (taxonomy.json still exists in this tree; the reword does not assert it is already gone), and drops "floor" where it implied a reproducible ratio (group-composite keeps its same-report ratio, which has a real residual twin, but relocated off taxonomy.json). |
| **GS-04** `.dependency-cruiser.cjs` no-cycle comment | **APPLIED** | the fictional `known-violations` BASELINE paragraph replaced with the true post-R.W1 acyclic invariant (R.W1 broke the co-recursive cycle ring via the getGroupFactory DI seam + leaf extraction; `depcruise src` greens with ZERO violations; no `.dependency-cruiser-known-violations.json` exists or is wired; `lint` is a bare `depcruise src`). |
| **Scope 11** exact-pin rationale | **APPLIED** | new paragraph in `docs/published-surface.md` after the intro machine-check paragraph (NOT at the guarded refusal-axis line): the exact `@mkbabb/value.js@4.0.0` pin is a measured, integrity-pinned constellation consume-edge; patches reach consumers via the smallest honest keyframes successor, never range drift. |
| **Scope 9** retired mirror convention | **APPLIED** | "Structural conventions" note appended to `docs/published-surface.md` (the manifest-named canon home; commit `fe42c6f9` designated it "a W10 docs note"): the test-area mirror convention (test dirs mirror `src/animation/` zones, root-module tests in `test/_root`) survives as documented expectation after `test/support/mirror.test.ts` — a topology-only, zero-runtime assertion — was pruned at W4. |
| **Scope 9** phantom-gate rows `demo/DESIGN.md:238,253` | **DEFERRED** | under `demo/**` (deferred subset). |
| **Scope 12 / CT-03** `demo/kf-engine.ts` self-alias prose | **DEFERRED** | `kf-engine.ts` lives at `demo/kf-engine.ts` → `demo/**` (deferred subset), exactly as the task's DEFER clause anticipated. |

---

## Guard verifications (the four DO-NOT-EDIT rows, verified UNTOUCHED after all edits)

1. **DM-03 · `README.md:322`** — `grep` → line 322 present verbatim:
   `2. **Drive** — run it through the engine: physics-shaped springs, perceptual `oklab` color, scroll-driven progress, weighted blending.` — UNTOUCHED.
2. **DM-04 · `README.md:433`** — `grep` → line 433 present verbatim:
   `…it names exactly the kf axis (weighted blending, perceptual color) that exceeds pure CSS.` — UNTOUCHED.
3. **DM-05 · `README.md:764`** — `grep` → line 764 present verbatim:
   `…running over real WAAPI children where eligible, with weighted blending and a transport the spec lacks.` — UNTOUCHED.
4. **DM-06 · `docs/published-surface.md`** — `grep` → the refusal-axis line present verbatim (now at `:158`, shifted down by the Scope-11 pin paragraph inserted ABOVE it; the guarded text itself is byte-identical):
   `…the four CC-3 refusals (`weighted` blend / custom renderers / perceptual oklab beyond densify / computed-unit drift)…` — UNTOUCHED.

---

## Gate results (this wave)

- `node scripts/gen-agent-surface.mjs --check` → **exit 0** (byte-identical to a fresh generation); drift-injection test → exit 1 (the check bites).
- `grep -c getTimingFunction llms.txt llms-full.txt` → **0 / 0**.
- `npm run check:lib` → clean (tsc, comment-only src edit typechecks).
- `npm run lint` → **✔ 0 dependency violations** (148 modules, 656 dependencies).
- `npm run proof:structure` → **PASS** (scope=src clean, R1–R5).
- `npm run proof:publish` → **PASS** including the new `agent-surface` sub-gate
  ("/llms.txt + /llms-full.txt match a fresh generation; all 22 curated exports are
  published; getTimingFunction absent").
- `git diff --check` → **clean**.
- `git status --porcelain` → only the intended paths (no `node_modules`, no `dist`,
  no `demo/**`, no `ci.yml`, no `package.json`; `llms.txt`/`llms-full.txt` correctly
  untracked/gitignored).

## llms regen diff summary

The artifacts are gitignored + generate-before-assert, so no repo bytes change. The
generator's output cures the flagship stale export: committed-era `llms-full.txt`
carried one `getTimingFunction` hit; the regenerated pair carries **0** (verified).
