# Pass 1 · Research — Suppression Census (lane: suppression-census)

> OD-U17 mandate: `.dependency-cruiser-known-violations.json` and **every other
> suppression surface** removed — the violation FIXED or the rule HONESTLY
> re-scoped, never re-suppressed. This lane inventories every surface, states
> what it suppresses, and gives a die-by-fixing plan (or an honest re-scope with
> rationale). READ-ONLY census; no edits made.
>
> Method: static grep + read across `src/ demo/ test/ scripts/ *.config.* .github/ tsconfig*` on `tranche-u-dev` @ `c6a19ed`. Evidence is `file:line`.

---

## The headline finding

**The OD-U17 named target is already EMPTY and is pure vestige.**
`.dependency-cruiser-known-violations.json` = `[]` (3 bytes, `.dependency-cruiser-known-violations.json:1`). The R.W1/R.W2 zone-partition + DI carves broke every engine-cluster runtime cycle (`known-violations 26→0`, per MEMORY `project_tranche_r_impl_drive_shipped`). So the ratchet suppresses **nothing** today — yet the flag `--ignore-known` and eight documentation/gate references still cite it as a live baseline. This is the single cleanest OD-U17 kill: delete the file, drop the flag, and the depcruise no-cycle rule keeps biting (an empty baseline ignores nothing, so any new cycle already reds). The only real work is un-wiring the stale references (§A).

The broader census finds **no hidden debt-by-ledger** of significance beyond that vestige: the remaining surfaces are (1) dead directives for an uninstalled linter, (2) an honest self-verifying `any` ratchet, (3) legitimate per-gate justified-exception maps that mostly **die with their gate** under the OD-U1 CI dissolution, and (4) two owner-named surfaces (cspell, api-extractor.json) that **do not exist** here.

---

## A. The OD-U17 target — `.dependency-cruiser-known-violations.json`

**What it is:** dependency-cruiser's known-violations baseline, consumed via `depcruise src --ignore-known` (`package.json:237`). Content today: `[]`.

**What it suppresses:** nothing. It was authored (Q.WA1) to grandfather the engine cluster's co-recursive runtime cycles so the lint floor could land without refactoring the engine; R broke all of them, leaving `[]`.

**Full reference graph (must all be un-wired on delete):**
- `package.json:237` — `"lint": "depcruise src --ignore-known"`
- `.dependency-cruiser.cjs:124-125` — no-cycle rule comment claims cycles are "recorded in the known-violations BASELINE" (now FALSE — file is empty)
- `scripts/proof-lint-clean.mjs:36-37,61,76,84,108-109,130,149-152,199` — asserts the file exists, runs `depcruise src --ignore-known`, and clause (b) plants a NEW cycle expecting it to red "THROUGH the baseline"
- `scripts/proof-no-flat-siblings.mjs:62,161,167,173,180,225` — reads the file, asserts `count < PRE_RW1_KNOWN_VIOLATIONS (15)` (a migration-era ratchet, satisfied at 0)
- `scripts/proof-no-silent-fallback.mjs:279,292,296,302,471` — runs `depcruise src --ignore-known` as its "lint GREEN" clause 2
- `scripts/proof-any-ceiling.mjs:35`, `scripts/proof-no-dead-export.mjs:34` — cite it only as *precedent* for their own ratchets (comment-only; no read)
- `.github/workflows/ci.yml:226` — the proof:no-flat-siblings step label

**Die-by-fixing plan (the honest cure):**
1. Delete `.dependency-cruiser-known-violations.json`.
2. `package.json:237` → `"lint": "depcruise src"` (drop `--ignore-known`). With no baseline, depcruise's live `no-cycle` rule (`.dependency-cruiser.cjs:112-149`) reds on **any** cycle — strictly stronger than today.
3. Drop `--ignore-known` from `proof-lint-clean.mjs:84` and `proof-no-silent-fallback.mjs:279`; delete the "baseline ratchets N entries" clauses (`proof-lint-clean.mjs:108-109,130,199`). The planted-cycle clause (b) still works unchanged (a fresh cycle reds against an absent baseline).
4. `proof-no-flat-siblings.mjs`: its known-violations `count < 15` clause is **itself vestigial** — the "no new cycle" invariant is now fully owned by depcruise's live no-cycle rule at 0. Retire that clause (or the whole gate under OD-U1; see §D). Remove the CI label's "known-violations dissolved" phrasing.
5. `.dependency-cruiser.cjs:124-125` — strike the "recorded in the known-violations BASELINE" sentence; the rule now greens on the clean tree with **zero** swallowed debt, which is the truth.
6. Update the `precedent` citations in `proof-any-ceiling.mjs:35` / `proof-no-dead-export.mjs:34` (they reference a mechanism about to not exist).

**Verdict:** DELETE. No functionality lost — the no-cycle guard strengthens. This is a pure vestige removal, not a re-scope.

---

## B. Every other suppression surface

### B1. `eslint-disable` directives — DEAD (no eslint installed)
Five occurrences suppress a linter that **is not installed and never runs**: `node_modules/.bin/eslint` absent; `eslint` absent from `package.json` (the KILL-DOWN was deliberate — `.dependency-cruiser.cjs:10-17` records "eslint is NOT installed").
- `test/physics/sync-step.measure.test.ts:173`, `test/engine/d3-changed-keys.measure.test.ts:48` — `// eslint-disable-next-line no-console`
- `scripts/proof-accent-census.mjs:300`, `scripts/proof-font-census.mjs:215` — `// eslint-disable-next-line no-eval`
- `scripts/proof-kf-differential.mjs:560` — `// eslint-disable-next-line no-new-func`

**Fix shape:** delete all five comments — they suppress nothing (vestige of a scaffold-era eslint). NO-legacy edict target. Trivial; low risk.

### B2. `@ts-expect-error` — HONEST, test-only, KEEP
16 occurrences, **all in `test/`** (`test/ingest/platform-adopt.test.ts` ×9, `test/waapi/waapi-lifecycle.test.ts:64`, `test/compile/default-easing-css-twin.test.ts:42`, and 4 in stagger/timeline/morph/numeric tests asserting "string names are rejected by the type AND at runtime"). `@ts-expect-error` is **self-verifying** — if the error it suppresses ever disappears, tsc reds — so it cannot rot into hidden debt. Zero in `src/` or `demo/`.

**Fix shape:** none. These are assertions (type-rejection tests + global-stub teardown), not suppressions. KEEP. This is the idiomatic form the edict *wants*.

### B3. The `any` ceiling ratchet — `scripts/proof-any-ceiling.mjs`
`const CEILING = 99` (`:52`), a one-way ratchet grandfathering 99 `any`s in the tree; reds on any increase, demands you lower it on any decrease (`:90-116`). Equality-enforced, so it is a *tight* ratchet, not a loose cap.

**What it suppresses:** the obligation to type 99 existing `any` seams.

**Fix shape (die-by-fixing, aligned to OD-U16):** the convergence loop's per-module assay drives the real count toward 0 (each module's `any` seams typed or justified as genuine dynamic seams). When it reaches 0, delete the gate. **Honest re-scope alternative:** if some `any`s are irreducible cross-realm/dynamic seams, convert the numeric ceiling into per-site `// @ts-expect-error`-style *named* justifications co-located at each seam (self-verifying, no global counter) — but the edict's "NO legacy" pushes toward the sweep-to-zero. This is a Track-B module-assay deliverable, not a standalone fix.

### B4. depcruise config carve-outs — LEGITIMATE boundary scoping, KEEP-with-review
`.dependency-cruiser.cjs` carries two allowlists that are **precise boundary carve-outs, not debt**:
- `LIGHT_BARREL_MODULES` (`:54-79`) — the 24-module LIGHT named-export set (rule 3's `from`). Authored as an allowlist (not blocklist) so a new HEAVY module can't false-green; mirrors `proof:boundary`'s self-derived entry set.
- `pathNot: VALUEJS_MATH_SUBPATH` (`:103,174,217`) — exempts the W97 `@mkbabb/value.js/math` leaf, which `proof:boundary` independently bundle-proves grammar-free.

**Fix shape:** none on the suppression axis — both are the boundary's *definition*, backstopped by the runtime `proof:boundary` oracle. Flag for OD-U1's charter only: the *whole* depcruise static-preflight tier is a trim candidate (it duplicates the bundle oracle one tier earlier); if OD-U1 dissolves it, these lists die with it. That is OD-U1's call, not a suppression-census verdict.

### B5. Per-gate JUSTIFIED / allowlist maps — mostly DIE-WITH-GATE
Named justified-exception maps embedded in gate scripts. The substantive ones:
- `scripts/proof-zone-cohesion.mjs:95` `const JUSTIFIED = new Map(...)` — the >400L files exempted as single-indivisible-concern (hot paths, flat data tables, cohesive core classes). Each carries a recorded rationale; a stale entry reds (`:84-91`). This is explicitly **NOT** a ceiling-raiser (it contrasts itself against the R.W0 `LIBRARY_CEILING_OVERRIDE` anti-pattern).
- `scripts/proof-shared-has-n-consumers.mjs:74,105` — `ALLOWLIST` Map + `EXEMPT_MODULES`
- `scripts/proof-single-writer.mjs:53` `ALLOWED_WRITERS`
- `scripts/proof-no-shadow-playback-authority.mjs:58` `ALLOWED`
- `scripts/proof-decomposition.mjs:177` `ASYNC_ALLOWLIST`
- `scripts/proof-brittleness.mjs:75,565` `LISTENER_ALLOWLIST` / `CB_ALLOWLIST`
- `scripts/proof-dogfood.mjs:74` `ALLOWLIST`
- `scripts/proof-portable-perf.mjs:422` `KNOWN_PRIOR_ART`
- `scripts/proof-scene-rests.mjs:54` `EXEMPT = ["home"]` (the Aurora hero, measured-not-gated per OD-2)

**Fix shape:** these are honest, rationaled, self-reddening-on-staleness maps — not hidden debt. But under OD-U16 the `zone-cohesion` JUSTIFIED entries encode "keep" granularity verdicts that the convergence loop must **re-adjudicate** module-by-module (carve/keep/inline), and under OD-U15 their rationales belong **inline as docstrings**, not in a gate map. The dominant disposition: most of these gates are OD-U1 dissolution candidates (source-shape/demo-shape tautologies), so **the map dies with the gate** and its load-bearing rationale re-homes into an inline docstring at the module it describes. Where a gate survives into `proof:publish`, audit each allowlist entry for real-exemption vs. latent debt as a follow-up. No entry found here is a disguised debt-grandfather.

**NON-suppressions (exclude from census):** the ubiquitous `SKIP_DIR = new Set(["dist","node_modules",".git","coverage"])` (in ~20 scripts) are directory-traversal filters, not suppressions.

### B6. Perf / visual baselines — `scripts/baselines/*.json` — accepted-value ratchets
`amiga-checkerboard.json`, `crayon-preserved.json`, `lighthouse-mobile-{after,t-open}.json`. Consumed with `--update-baseline` re-record flags (`proof-scene-perf-budget.mjs:105`, `proof-crayon-preserved.mjs:58`, `proof-lighthouse-mobile.mjs:139`). These are legitimate regression snapshots (a form of accepted-value ratchet), not violation-suppression.

**Fix shape:** keep the *mechanism* where the consuming gate survives OD-U1 (perf regression needs a baseline). Where the demo-correctness gate dissolves, the baseline JSON is orphaned data → delete with the gate.

### B7. `scripts/baselines/visual-lock/_diff/` — VESTIGE, DELETE
44 `*.diff.png` artifacts including **retired scenes** (`motion-path-*`, pruned at T.E1/T.E3; the visual-lock gate itself RETIRED at T.M3 → owner-golden, per commit `71e0fb4` "visual-lock RETIRED … script/baselines/mask deleted"). No gate references this `_diff/` subtree anymore.

**Fix shape:** DELETE the directory — dead output of a retired gate, containing diffs for scenes that no longer exist. Pure NO-legacy vestige.

### B8. `tsconfig.json:15` `skipLibCheck: true` — JUSTIFIED, KEEP
Suppresses type-checking of dependency `.d.ts` (value.js, glass-ui, vue). Universal TS hygiene (you don't own deps' declarations); `strict: true` is on for owned code (`tsconfig.json:7`).

**Fix shape:** none — keep. Standard practice; not project debt.

### B9. Test `skipIf` guards — split verdict
- **Environment-conditional (KEEP):** `describe.skipIf(!chromium)` / `!bundle` in `test/scroll/trigger-oracle.test.ts:143`, `test/compile/view-transition-roundtrip.test.ts:74`, `test/compile/entry-roundtrip.test.ts:66`, `test/orchestration/split-a11y-oracle.test.ts:140`, `test/engine/en-fix-oracle.test.ts:67`. These skip browser oracles when chromium is unavailable — honest capability guards, not suppressions.
- **PENDING-guard / deferral (FIX under OD-U1 "no more deferrals"):** `test/compile/roundtrip-easing.test.ts:164,170` `it.skipIf(!vjL2LinearLanded)` — skips pending external value.js VJ-L2. This is a *deferral* tied to a constellation dep. Fix shape: confirm whether VJ-L2 landed against the U consume edge (glass-ui 5.0.0 / value.js active tranche) and un-skip; else fold the deferral explicitly per the OD-U1 "chronic + current, all folded in" edict rather than leaving a silent conditional skip.

### B10. Owner-named surfaces that DO NOT EXIST here
- **cspell words file** — cspell is not installed (`node_modules/.bin/cspell` absent), no `.cspell*`/`cspell.json`, no spellcheck gate. Surface ABSENT — nothing to census.
- **api-extractor overrides** — `@microsoft/api-extractor` is a devDep (`package.json:303`) but there is **no `api-extractor.json` config file**. The d.ts rollup uses `vite-plugin-dts` plus a programmatic `Extractor`/`ExtractorConfig` inline in `vite.config.ts:12-15,38` (the `engineDtsRollupPlugin`, built in-code for the second `./engine` entry). So there is **no override/bundledPackages suppression surface**. (Minor adjacent flag for the no-dead-dependency lane: verify api-extractor is reached only through that inline plugin — it is, so it is a live dep, not dead.)

---

## C. Surfaces checked and found CLEAN (no suppression)
- No `@ts-ignore` / `@ts-nocheck` anywhere in `src/ demo/ test/ scripts/` (grep: 0).
- No `@ts-expect-error` in `src/` or `demo/` (all 16 are test assertions — §B2).
- `vitest.config.ts` — no `exclude`, no `allowOnly`, no skipped globs; the aliases are resolution wiring, not suppression.
- No `it.only`/`describe.only`, one legitimate env-`skipIf` family (§B9).
- `.gitignore` — no known-violations/baseline suppression entries.

## D. Interaction with the OD-U1 CI dissolution (scope note for synthesis)
Most JUSTIFIED/allowlist maps (§B5) and perf/visual baselines (§B6) live inside the ~180-gate `proof:hygiene-chain` roster that OD-U1 rules is "substantially trimmed … most gates tautological", collapsing to three mechanisms (`npm test` + `proof:publish` + owner-golden). **The dominant remediation is therefore deletion-with-gate, not per-map surgery** — a suppression map inside a dissolved gate needs no honest cure of its own; it dies, and any load-bearing rationale re-homes inline per OD-U15. This lane's *independent* obligations (survive the trim regardless) are: §A (the known-violations kill), §B1 (dead eslint directives), §B3 (the `any` sweep), §B7 (the visual-lock `_diff` vestige), §B9 PENDING-guard. Everything else is contingent on which gates OD-U1 keeps.

---

## Rules/verdicts for the spec

1. **DELETE `.dependency-cruiser-known-violations.json`** (it is `[]`; suppresses nothing) and drop `--ignore-known` from `lint` (`package.json:237`), `proof-lint-clean.mjs`, `proof-no-silent-fallback.mjs`. The depcruise live no-cycle rule strengthens (empty baseline → any cycle reds). Un-wire all 8 references listed in §A; strike the false "recorded in the BASELINE" comment in `.dependency-cruiser.cjs:124-125`. This is the terminal OD-U17 act — a vestige removal with **zero** functionality loss. (Whether the depcruise *tier* survives at all is OD-U1's call.)
2. **`proof-no-flat-siblings`'s `count < 15` known-violations clause is itself vestige** (satisfied at 0; its invariant is now owned by the live no-cycle rule). Retire the clause with the file; do not re-baseline it.
3. **Delete the 5 dead `eslint-disable` directives** (§B1) — eslint is uninstalled; they suppress nothing. NO-legacy.
4. **Delete `scripts/baselines/visual-lock/_diff/`** (§B7) — dead output of the T.M3-retired visual-lock gate, holding diffs for pruned scenes (motion-path). No live reference.
5. **The `any` ceiling (CEILING=99) is a suppression-by-ratchet** — the convergence loop's per-module assay (OD-U16) drives it to 0, then the gate deletes. Do not merely lower the number; type the seams or convert irreducible ones to co-located named justifications.
6. **`@ts-expect-error` (test-only, self-verifying) and `skipLibCheck` are the HONEST forms — keep both.** They cannot rot into hidden debt; they are the idiom the edict wants, not targets.
7. **Per-gate JUSTIFIED/allowlist maps (§B5) are rationaled and self-reddening, not hidden debt** — but under OD-U15 their rationales belong inline (docstrings at the module), and under OD-U16 the `zone-cohesion` JUSTIFIED "keep" verdicts must be re-adjudicated per-module by the loop. Default disposition: die-with-gate under OD-U1, rationale re-homed inline. No disguised debt-grandfather found among them.
8. **cspell words + api-extractor.json overrides — surfaces ABSENT.** Neither exists (cspell uninstalled; the d.ts rollup is a programmatic inline `vite.config.ts` plugin, no config file). Nothing to remove; note the absence so a future lane doesn't hunt a phantom.
9. **One deferral-suppression to fold, not keep:** `it.skipIf(!vjL2LinearLanded)` (`test/compile/roundtrip-easing.test.ts:164,170`) is a PENDING-guard on external value.js VJ-L2 — resolve against the U consume edge and un-skip, or fold explicitly per OD-U1 "no more deferrals". Distinguish it from the honest `skipIf(!chromium)` capability guards (keep those).
10. **Principle for the spec:** the census finds the codebase already carries suppression honestly (self-verifying `@ts-expect-error`, rationaled reddening maps, a tight `any` ratchet) — the genuine debris is *vestige* (empty ledger, dead eslint directives, retired-gate artifacts), not *disguised debt*. The OD-U17 cure is therefore mostly deletion, and the standing rule is: **a suppression surface must be either self-verifying (reds when the suppressed condition clears) or die with the concern it served — no static ledger of grandfathered violations survives U.**
