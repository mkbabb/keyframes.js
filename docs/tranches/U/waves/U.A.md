# U.A — THE APPARATUS DISSOLUTION

> **Status: DEVELOPMENT. Implementation NOT authorized.** Docs-only wave specs.
>
> **Charter sentence (U.md §2).** Dissolve the 227-gate / 73.5k-LOC enforcement
> apparatus into three honest mechanisms — `npm test` (all correctness) +
> `proof:publish` (boundary/surface/deps) + the owner-golden review loop — by
> deleting whole gate GENRES (not shaving a count), collapsing `ci.yml` to a
> tier-manifest run-all, retiring the per-push Linux browser runner to nightly +
> on-device, redesigning the deploy-of-record, restructuring the `scripts/` backend
> to the colocation edict, and standing up an anti-sprawl covenant — with the gate
> re-anchoring CO-SCHEDULED against every U.B/U.C move in ONE coordinated pass.
>
> **Provenance lanes:** 07 (ci-tautology — the five tautology classes + trimmed
> roster), 08 (ci-runtime-and-pipeline — the pipeline cost + the coverage-contract
> forcing function + deploy coupling), 09 (gate-apparatus-meta — the apparatus IS
> the legacy; the three-mechanism cure), 10 (test-suite-audit — the source-grep
> halves + vitest projects + the characterization net), 23 (scripts-tooling-backend
> — `scripts/gates/<family>/`, `lib/gate.mjs`, tier-as-data, the CI/build collapse).
>
> **Ring-fences honored (U.md §4):** the owner-golden mechanism SURVIVES — the
> appearance genre dissolves INTO it (fence 3); the LIGHT/HEAVY boundary is
> preserved (fence 2 — `proof:boundary` is one of the three surviving mechanisms);
> net gate count only goes DOWN and a new standalone `proof-*.mjs` requires owner
> sign-off (§6 anti-sprawl). DEVELOPMENT ONLY — this is the charter, not the edit.

---

## §A.0 — The measured ground truth (read from the tree @ 5.2.0, `tranche-u-dev`)

| Fact | Value | Source (verified) |
|---|---|---|
| distinct `proof:*` keys | **227** | `node -e` over `package.json.scripts` |
| `proof-*.mjs` on disk | **209** | `ls scripts/proof-*.mjs \| wc -l` |
| `scripts/` LOC vs `src/` LOC | **73,563 : 22,054 (3.3:1)** | lane 09 (`wc -l`) |
| gates carrying real product-regression value | **~40** | lane 07 verdict |
| `ci.yml` | **756 lines / 3× `ubuntu-latest` (`:50`, `:635`, `:679`) / 134 `proof:` invocations** | `wc -l`, `grep runs-on` |
| `proof-ci-coverage.mjs` | **1,216 lines / 13 clauses** | `wc -l` |
| `gate-bands.mjs` | **761 lines**; `FROZEN_SET`=36, `DISCHARGE`=17, `REGRESSION_GUARDS`=10, `RETIREMENT_LEDGER`=19, `T_BORNRED_BACKLOG`=8, `ROSTER_CEILING`=120 | `import()` over the module |
| `CORRECTNESS_ROSTER` (browser gates) | **77 (76 unique — `dfa-derived` dup at `demo-roster.mjs:176` & `:279`)** | lane 08 F8 |
| `proof:publish` | **DOES NOT EXIST YET** — the target aggregator U.A authors | `package.json` grep (MISSING) |
| self-policing meta-gates | **27** | lane 07 CLASS 1 |
| `node .mjs && vitest` doublings | **~25** | lane 07 CLASS 3 / lane 10 F1 (24) |
| line-anchored demo-appearance gates | **77** (58 hard-code `demo/…` paths, 15 anchor a `*Target.vue` line) | lane 07 CLASS 2 |
| no-legacy / regression-guard greps | **~16** | lane 07 CLASS 4 |
| hand-rolled `failures=[]` reporters | **133** | lane 23 F3 |
| inline static servers re-implemented | **48** | lane 23 F4 |

The one sentence (lane 09): **the apparatus outweighs the library it defends 3.3:1,
adds gates faster than any tranche retires them, and ~25% of it exists only to police
itself.** The owner's "most of it's likely tautological" is confirmed and then some.

**The forcing function (lane 08 F2 — the keystone fact).** `ci.yml` cannot be
trimmed by editing `ci.yml`: `proof-ci-coverage.mjs` CLAUSE 0 (`:7-14`) reds if any
`proof:*` key is not invoked as a literal step in the workflow. Every born-RED oracle
each tranche authored mechanically grew `ci.yml` by a step; the bloat is
self-reinforcing BY DESIGN. **No trim is legal until this contract is inverted or the
gate deleted.** That is U.A1.

---

## §A.1 — The wave table

| # | Title | Substance | Size | Gate / oracle | Edges |
|---|---|---|---|---|---|
| **U.A1** | Target ratification + the coverage-contract inversion (KEYSTONE) | Ratify the three-mechanism target in `package.json`; AUTHOR `proof:publish` = `boundary && published-surface && deps-current`; INVERT `proof-ci-coverage.mjs` CLAUSE 0 to reachability-from-a-TIER (transitional — the gate itself dies in U.A5) so every subsequent deletion is legal | L | `proof:publish` green; one-shot witness: delete a throwaway `proof:*` key WITHOUT `proof:ci-coverage` reding | FIRST in band; needs U.H (characterization net exists BEFORE any move, DAG); before every A-deletion |
| **U.A2** | CLASS 3 collapse — the ~25 `node .mjs && vitest` doublings → the vitest oracle alone | Drop the source-grep `.mjs` halves of the ~25 belt-and-suspenders gates; the `.test.ts` value proof is the oracle; widen the test where the grep uniquely covered a behavior | M | the surviving vitest tests (npm test); the deleted keys drop from `ci.yml` under A1's inverted contract | A1; co-sched U.H (vitest library/demo project split); before A5 |
| **U.A3** | CLASS 4 collapse — the ~16 no-legacy/regression greps → lint rules | Fold the `REGRESSION_GUARDS` band + kin (16 hand-rolled AST-by-regex scripts) into `proof:lint-clean` as `no-restricted-syntax`/custom rules; no-legacy is the linter's job | M | `proof:lint-clean` (existing) carries the folded rules; a one-shot re-introduction witness reds in lint | A1; co-sched U.E (legacy-zero); before A5 |
| **U.A4** | CLASS 2 dissolution — the 77 line-anchored appearance/geometry gates → owner-golden + ONE `demo-smoke` | Retire all 77 demo-geometry greps CONCURRENT with the U.B restructure that deletes their subject files; replace with `proof:owner-golden` (taste) + one behavioral `demo-smoke` (each scene mounts/plays/switches) | L | `proof:owner-golden` (SURVIVES — fence 3) + `proof:demo-smoke` | A1; **CO-SCHEDULED with U.B** (structural gates re-anchor WITH the move, never lag); U.G (owner-golden authority); before A5 |
| **U.A5** | CLASS 1 + the lifecycle-ledger + the meta-gate layer — DELETE WHOLESALE | Delete the 27 self-policing gates; `gate-bands.mjs` IN FULL (all five registers); `proof-ci-coverage.mjs` (1,216L); `proof-gate-is-runtime.mjs`, `proof-roster-ceiling.mjs`, `proof-chronic-closure.mjs`, `proof-retirement-ledger.mjs`, `proof-decomposition.mjs`; `gate-taxonomy.md`. Coverage becomes true-by-construction | L | NONE (deletion) — the surviving `npm test` + `proof:publish` ARE the coverage | A2+A3+A4 (population must collapse first); before A6 |
| **U.A6** | Tier-manifest-as-data + the `ci.yml` collapse + `demo-device-observe` deletion + the device-honesty subsystem | `scripts/lib/tiers.mjs` (arrays, not `&&` mega-strings); collapse `ci.yml` 756L/134 steps/3 jobs → ONE fast job / `run-all --all` over the manifest; DELETE `demo-device-observe` (continue-on-error, gates nothing); delete `ci-env.mjs` posture machinery + `portable-perf.mjs` + `cdp-perf.mjs` + clause-4 posture manifest (the Linux runner justified them) | L | the single `gates` job green; no browser/Monaco/chromium on the merge path | A5; lane 23 F5/F6 |
| **U.A7** | The browser roster re-homing — nightly + on-device | Move the 77-gate `run-demo-roster` suite off the merge path to a `schedule:` cron + `workflow_dispatch` (writes `last-demo-green=<sha>`) + on-device pre-push (fast macOS, where MEMORY says browser correctness actually holds); fold `demo-device-observe`'s LoAF/lighthouse into the nightly; dedupe `dfa-derived` | M | the nightly run green + `last-demo-green` ref written | A6 |
| **U.A8** | Deploy-of-record redesign (OD-U3) | `deploy-pages.yml` gates on library-`ci`-green on master AND `last-demo-green` an ancestor of the deploy SHA (`merge-base --is-ancestor`); RETIRE the single-sourced `DEMO_CORRECTNESS_JOB` literal + the preflight coupling; a red nightly freezes the deploy ref (opens an issue), never blocks every push | M | a deploy-of-record dry-run on the redesigned trigger | A7; OD-U3 ruling |
| **U.A9** | The `scripts/` backend restructure (the colocation edict's backend arm) | Transpose the 209 flat `proof-*.mjs` into `scripts/gates/<family>/` (surface/hygiene/correctness/live/appearance-residual/perf) with `index.mjs` barrels the tier manifest derives from; `scripts/lib/gate.mjs` (one `Gate()` clause/report/exit — migrate the 133 reporters); `scripts/lib/serve.mjs` (the 48 inline servers); decompose `demo-driver.mjs` (1043L) → `lib/driver/{launch,scene,serve,cdp,assert}.mjs`; colocate the 4 `vite.config.ts` plugins → `scripts/build/vite/`; externalize `api-extractor.json`; delete dead artifacts (0-ref decision JSONs, retired `baselines/visual-lock/`); author `proof:scripts-colocated` (the backend twin of `proof:colocation`) | L | `proof:scripts-colocated` (the ONE new gate — owner-signed per anti-sprawl); `tiers.mjs` derives from the barrels | A5 (population settled); lane 23 F1/F3/F4/F7/F8 |
| **U.A10** | The anti-sprawl covenant (STANDING) | Ratify the precept: additions expensive, deletions FREE (`git rm` + drop the key — no witness, no discharge, no successor-migration proof); new enforcement lands as a vitest test OR a `proof:publish` clause; a new standalone `proof-*.mjs` requires owner sign-off. Net gate count only goes DOWN | S | the covenant recorded in `DESIGN.md`/`U.md §6`; verified at U.Z close (roster ≤ target, monotone-down) | rides throughout; ratified at U.Z |

---

## §A.2 — The fold-map: ~40 real product gates → `npm test` / `proof:publish`

The trimmed roster (lane 07 cluster map) keeps the VALUE ORACLE of each family and
deletes the witnesses/greps/meta around it. Everything a **value test** can prove
folds into `npm test`; everything only a **source grep of the built artifact** can
prove folds into `proof:publish`; everything **taste** folds into owner-golden.

| Invariant family | Now | Target | Mechanism | Fold |
|---|---|---|---|---|
| Library value (interp/compile/blend/roundtrip/spring/color/soa) | ~37 | **~16 tests** | `npm test` | keep the vitest oracles; drop the 25 `.mjs` grep halves (U.A2); fold the roundtrip cluster (`compile-replay`/`replay-equality`/`roundtrip-fidelity`/`roundtrip-easing`/`entry`/`vt`/`trigger`/`scroll`/`ingest`) into 2 property tests (U.H) |
| Boundary / published surface | ~10 | **2 gates** | `proof:publish` | `proof:boundary` + `proof:published-surface`; fold `engine-subpath-mirror`, `dts-rollups-agree`, `no-any-default`, `alias-dropped`, `in-is-importable`, `demo-on-published-surface`, `agent-surface`, `claude-paths-live` (all re-read the built d.ts/exports — ONE invariant asserted 8×) |
| Dependency floor | ~1 | **1 gate** | `proof:publish` | `proof:deps-current` (the `@mkbabb/*` floor — the only source-static thing a test can't prove) |
| Zone / decomposition / colocation | ~8 | **2 gates** | hygiene tier | `proof:colocation` (real import-graph walk, re-authored for the U tree) + `proof:scripts-colocated` (U.A9); drop `no-flat-siblings`/`zone-cohesion`/`decomposition`/`no-nested-self-dependency` (tsc + graph cover) |
| No-legacy / regression greps | ~16 | **0 standing** | `proof:lint-clean` | U.A3 |
| Demo appearance / geometry | ~77 | **1 oracle + 1 smoke** | owner-golden + `demo-smoke` | U.A4 |
| Demo behavioral (renders/plays) | ~26 | **~5 nightly** | nightly roster | `subject-animates`, `easing-gallery`, `drag-gesture`, `spring-slider-continuous`, one scene-switch smoke (U.A7) |
| Performance (grand edict) | ~12 | **~5** | `npm test` (headless harness, U.D) + nightly | `perf-counters`/`interp-fastprops`/`scene-perf-budget` as vitest-runnable; `epf1-measure`/`perf-frame-budget` OBSERVE dups drop |
| Constellation / consume-edge | ~11 | **2** | `proof:publish` + `release.yml` | `proof:deps-current` + `proof:consume-bundle`; pin/repin/ledger provenance → `release.yml` steps (U.F) |
| Self-policing meta | 27 | **0** | — | DELETE (U.A5) |
| Lint / hygiene | ~3 | **2** | hygiene tier | `proof:lint-clean` + the folded no-silent-fallback rule |

**Net: 227 → ~36 gates**, banded by PRODUCT PROPERTY (does the library interpolate
correctly / is the surface honest / does the demo work / is it fast), never by
tranche wave. Wave-coupled gates are process telemetry — they live in `docs/`, not
`package.json`.

---

## §A.3 — Wave detail

### U.A1 — Target ratification + the coverage-contract inversion (KEYSTONE)

**Substance.** (a) Author `proof:publish` in `package.json` as
`npm run proof:boundary && npm run proof:published-surface && npm run proof:deps-current`
— the ONLY structural oracle a source grep can prove that a test cannot (the
LIGHT/HEAVY split, tarball==exports==d.ts, the `@mkbabb/*` floor). This is the second
of the three surviving mechanisms; it does not exist today (verified MISSING). (b)
Invert `proof-ci-coverage.mjs` CLAUSE 0 (`:156-448`): from *"every `proof:*` appears
as a literal `ci.yml` step"* to *"every `proof:*` is reachable from a tier
aggregator"* (CLAUSE 0b `:15-22` already asserts the converse). This is
**transitional** — it makes trimming legal; `proof:ci-coverage` itself is deleted in
U.A5 once the population collapses to true-by-construction.

**Why FIRST.** Lane 08 F2: *"the CI file cannot be trimmed by editing the CI file —
the coverage gate will red."* Every downstream deletion (A2–A6) reds against the
un-inverted contract. This is the one move that unblocks the band.

**Gate/oracle.** `proof:publish` green on the built tree; a one-shot witness — delete
a throwaway `proof:*` key and confirm `proof:ci-coverage` (still transitionally live)
does NOT red. No new standing gate.

**Edges.** Needs U.H's characterization net in place FIRST (U.md DAG: *"BEFORE any
move"*) — the net goldens observable behavior through the two package "ins" so A2's
test-half survival is provable. Blocks every A-deletion.

**Evidence.** `proof-ci-coverage.mjs:7-14` (CLAUSE 0 forcing function), `:15-22`
(0b converse); `package.json` (`proof:publish` MISSING, `proof:boundary`/
`proof:published-surface`/`proof:deps-current` EXIST).

---

### U.A2 — CLASS 3 collapse: the ~25 `node .mjs && vitest` doublings → the vitest oracle alone

**Substance.** ~25 keys run `node scripts/proof-X.mjs && vitest run test/X.test.ts`
where the `.mjs` half is a SOURCE-GREP asserting the fixed code SHAPE and the
`.test.ts` half is the real value proof. Drop the grep halves; keep the tests. The
list (lane 07/10): `blend`, `grammar-fuzz`, `nan-frame`, `composition-honored`,
`diagnostics-channel`, `scroll-roundtrip`, `drawsvg`, `finished`, `adopt-compiled`,
`interpolate-anything`, `roundtrip-fidelity`, `ingest-replay`, `orbital-rotate3d`,
`morph`, `emerging-css-resolve`, `replay-equality`, `compile-replay`,
`spring-blend-weight`, `color-fidelity`, `agent-validate`, `platform-adopt`,
`scene-control-dfa`, `no-shadow-playback-authority`, `scene-perf-budget`.

**Why gestalt.** The grep reds on a behavior-preserving refactor — a false positive
BY CONSTRUCTION, and exactly the "architectural transposition for elegance" the owner
mandates. `proof-blend.mjs:12-16` self-describes as "A SOURCE-GREP gate" whose
`array-guard` clause reds unless the source literally contains
`Array.isArray(existing) && Array.isArray(incoming)`; `test/group/blend.test.ts:11-18`
asserts the actual blended numbers (add→1.0, weighted→0.25). Where a grep covered a
behavior the test misses (rare), WIDEN the test — never re-add the syntax check.

**Gate/oracle.** `npm test` (the surviving value tests). Keys drop from `ci.yml`
under A1's inverted contract.

**Edges.** A1; co-scheduled with U.H's vitest library/demo project split (F2 — so the
surviving tests land in the right project). Before A5.

**Evidence.** `scripts/proof-blend.mjs:12-40`; `test/group/blend.test.ts:11-18`; the
24–25-key belt-and-suspenders list (package.json grep, lane 10 F1).

---

### U.A3 — CLASS 4 collapse: the ~16 no-legacy/regression greps → lint rules

**Substance.** `gate-bands.mjs:404-419` bands 10 "keep-a-deleted-thing-deleted" greps
+ ~6 outside the band; each locks a single historical excision now permanent. Fold
the whole band into `proof:lint-clean` (already runs, `package.json:235`) as
`no-restricted-syntax`/custom-rule entries. The list: `no-deprecated-guard`,
`alias-dropped` (also covered by `published-surface`), `no-cross-realm-cast`,
`no-foreign-symbol-stamp`, `no-dup-utility`, `no-brittle-selector`,
`no-single-option-select`, `no-silent-fallback`, `no-hand-rolled-cursor-tracker`,
`workaround-deletion`, `no-dead-export`, `no-dead-dependency`, `any-ceiling`,
`no-collision-rename`, `no-flat-siblings`.

**Why gestalt.** These are 16 bespoke Node scripts implementing what is structurally
a lint rule — each re-implements comment-blanking + regex sweeps by hand
(`proof-no-deprecated-guard.mjs:3-11` "comment-BLANKS the file then matches `next(`").
`proof-no-deprecated-guard` polices that `router.ts` no longer calls vue-router 4's
`next(value)` — a `tsc` error under the vue-router 5 floor, not a standing gate. The
no-legacy edict belongs to the linter.

**Gate/oracle.** `proof:lint-clean` carries the folded rules; a one-shot witness
re-introduces a banned pattern and confirms lint reds.

**Edges.** A1; co-scheduled with U.E (legacy-zero — the excisions those greps guarded
are the same ones U.E terminally adjudicates). Before A5.

**Evidence.** `gate-bands.mjs:404-419` (`REGRESSION_GUARDS` band);
`proof-no-deprecated-guard.mjs:3-11`; `proof-alias-dropped.mjs:3-11`;
`package.json:235` (`proof:lint-clean` exists).

---

### U.A4 — CLASS 2 dissolution: the 77 line-anchored appearance gates → owner-golden + `demo-smoke`

**Substance.** 58 gate scripts hard-code `demo/{scenes,@,app}/…` paths and 15 anchor a
specific `*Target.vue` line number; together they encode the pixel geometry of ONE
demo composition (rounded corners, subgrid labels, rail width, dock z-order, hero
focal placement, cartoon-shadow clipping, drawer spring). Retire ALL 77 CONCURRENT
with the U.B restructure that deletes their subject files; replace with (a)
`proof:owner-golden` (the owner-blessed perceptual reference — taste), and (b) the
EXISTING `proof:demo-smoke` gate RE-ARMED (it already exists in `package.json`; each
scene mounts, plays, switches without throwing).

**The assert-non-empty contract (lane 29 F6).** Every SURVIVING DOM-asserting gate — the
one `proof:demo-smoke` + the ~5 nightly roster survivors (U.A7) — adopts a shared
assert-non-empty helper: an empty selector match FAILS, never vacuous-greens. It folds as
a CLAUSE of the `demo-smoke` helper, NOT a new standalone gate; the 77-gate deletion MOOTS
the contract for the retired genre (a deleted gate cannot vacuous-green — the helper binds
only the survivors).

**Why gestalt + CO-SCHEDULING.** A geometry grep cannot survive its subject's rewrite;
re-authoring 77 against the new layout is exactly the "no quick fixes" anti-pattern the
owner forbade. Two of the anchors (`proof-card-rounded-primitive.mjs:6-9`) already
point at `MotionPathTarget.vue`, PRUNED at OD-1 — the gate's own `gate-bands.mjs:541`
witness says so, yet the anchor lingers. This is the DAG's central discipline (U.md
§3, lane 32): **structural gates re-anchor WITH the move, never lag** — U.A4 lands in
the SAME pass as the U.B scene/transport/editor moves, not before (dangling anchors)
and not after (a window of green-against-moved-files).

**Gate/oracle.** `proof:owner-golden` (SURVIVES — ring-fence 3) + `proof:demo-smoke`
(an EXISTING gate RE-ARMED — NOT new; the NEW-gate set in U is exactly
`proof:scripts-colocated` (U.A9) + `proof:chunk-graph` (U.D6)). Neither is 77 greps.

**Edges.** A1; **CO-SCHEDULED with U.B** (every scene/transport/editor move); needs
U.G (the owner-golden authority + idle-state capture protocol). Before A5.

**Evidence.** `proof-scene-card-rounded.mjs:6-9` (anchors `EasingTarget.vue:4` etc.);
`proof-card-rounded-primitive.mjs:6-9` (anchors the PRUNED `MotionPathTarget.vue`);
`gate-bands.mjs:27-97` (`FROZEN_SET`, self-declared discharge trigger = "the demo
rewrite, S.G1/S.D3" = U); `gate-authority.mjs:208-214` (`proof:owner-golden`).

---

### U.A5 — CLASS 1 + the lifecycle-ledger + the meta-gate layer — DELETE WHOLESALE

**Substance.** With the population collapsed by A2/A3/A4, the machinery that MANAGED
the population has nothing left to manage. Delete, in one wave:

- **The 27 self-policing gates** (lane 07 CLASS 1): `roster-ceiling`, `ci-coverage`,
  `gate-is-runtime`, `gate-authority`, `retirement-ledger`, `chronic-closure`,
  `peer-satisfied`, `manifest-sourced`, `board-live`, `prompt-recap-t`,
  `wave-charter`, `record-truth`, `report-all`, `owner-verdict-recorded`,
  `owner-review-gate`, `repin-witness`, `pin-ledger-current`, `published-on-master`,
  `deploy-roundtrip`, `changelog`, `readme-runs`, `readme-paths-live`,
  `claude-paths-live`, + kin. Provenance concerns (changelog/published/deploy)
  collapse to `release.yml` steps, not standing `proof:*` keys.
- **`scripts/gate-bands.mjs` IN FULL** (761L) — all five registers (`FROZEN_SET` 36,
  `DISCHARGE` 17, `REGRESSION_GUARDS` 10 [folded to lint at A3], `RETIREMENT_LEDGER`
  19, `T_BORNRED_BACKLOG` 8) + `ROSTER_CEILING`. It is a deletion-BUREAUCRACY that
  made addition cheap and deletion expensive — the exact inversion a trimming regime
  needs.
- **`proof-ci-coverage.mjs`** (1,216L, 13 clauses) — coverage is now true by
  construction (`npm test` runs all of vitest; `proof:publish` runs the structural
  oracle; CI runs exactly those two). Nothing to cross-check.
- **`proof-gate-is-runtime.mjs`, `proof-roster-ceiling.mjs`,
  `proof-chronic-closure.mjs` (723L), `proof-retirement-ledger.mjs`,
  `proof-decomposition.mjs` (875L)** — the meta-gate layer; `docs/tranches/J/
  gate-taxonomy.md` (the clause-4 posture manifest).

**Why after A2–A4.** The ledger's ONLY subjects were the demo-appearance genre (A4)
and the born-RED-defer genre (terminated by the edict). Remove the subjects first;
the five registers then evaporate along with clauses 9/10/11 of the meta-gate. This
is the "delete the subject, not trim the ledger" gestalt (lane 09 F2).

**NO-DEFERRALS discharge.** `T_BORNRED_BACKLOG` (8 rows) is the "honest defer" device
the owner terminated. Partition at deletion (co-owned with U.E): the 5
external-blocked rows (`no-collision-rename` → value.js; `dock-rest-crisp`/
`dock-morph-continuity`/`dock-zorder`/`blur-not-resampled` → glass-ui) become ONE
consume-edge covenant letter (U.F); the 3 self-inflicted rows (`stage-inventory`,
`subject-legible`, `roster-ceiling`) are fixed in-U or owner-re-judged not-a-defect
(the count "defect" vanishes once the population collapses). The register carries to
V never.

**Gate/oracle.** NONE — this is pure deletion. The surviving `npm test` +
`proof:publish` ARE the coverage; there is nothing to assert about a roster that no
longer needs rationing.

**Edges.** A2+A3+A4 (population must collapse first). Before A6 (`ci.yml` collapse
must not re-list deleted meta-gates). Co-owned with U.E (`T_BORNRED_BACKLOG` partition).

**Evidence.** `gate-bands.mjs` register counts (verified via `import()`);
`proof-ci-coverage.mjs:1023-1204` (clauses 9/10/11 police the registers), `:547-751`
(clause 4 reads `gate-taxonomy.md`); lane 09 Findings 1–3, 8.

---

### U.A6 — Tier-manifest-as-data + the `ci.yml` collapse + `demo-device-observe` deletion

**Substance.** (a) `scripts/lib/tiers.mjs` — tier membership as ARRAYS, replacing the
~10KB single-line `&&` mega-strings in `package.json` (`:269-272`) that `run-all.mjs`
re-parses by `.split("&&")`. (b) Collapse `ci.yml` 756L / 134 hand-listed steps / 3
`ubuntu-latest` jobs → ONE fast deterministic job (target <90s cached):
`npm ci` → `check:lib` → `build:lib` → dts-check → `npm test` (full suite ONCE) →
`proof:publish` → the fast STRUCTURAL edict gates (colocation/scripts-colocated —
sub-second static). **No browser. No Monaco. No chromium.** (c) DELETE
`demo-device-observe` (`ci.yml:672-751`) — job-level `continue-on-error: true`
(`:678`): it provisions chromium+lighthouse on every PR to produce numbers that BY
CONSTRUCTION can never fail the workflow. (d) Delete the device-honesty subsystem the
Linux runner justified: `ci-env.mjs` posture machinery, `portable-perf.mjs` (419L),
`cdp-perf.mjs`, the observe-only posture manifest.

**Why gestalt.** Lane 08 F2/F6, lane 09 F6, lane 23 F5/F6: the 134 hand-listed steps
duplicate the `proof:hygiene-chain` roster that already lives (as a string) in
`package.json` — two sources of truth. `run-all.mjs:96-106` already accumulates all
exit codes and names every failure; CI becomes `node scripts/run-all.mjs --all` over
the manifest. macOS-parity render-races cannot fail a CI that no longer runs a browser.

**Gate/oracle.** the single `gates` job green; a one-shot: confirm the merge path
downloads chromium 0× and builds Monaco 0×.

**Edges.** A5 (deleted meta-gates must not appear in the collapsed workflow); lane 23
F5 (tier manifest) + F6 (CI collapse). `tiers.mjs` is refined in A9 to DERIVE from the
`gates/<family>/` barrels.

**Evidence.** `ci.yml:672-751` (`demo-device-observe`), `:678` (`continue-on-error`);
`package.json:269-272` (the `&&` chains); `run-all.mjs:53-64` (`.split("&&")`),
`:96-106` (accumulator); `scripts/lib/portable-perf.mjs` (419L), `ci-env.mjs`.

---

### U.A7 — The browser roster re-homing: nightly + on-device

**Substance.** The 77-gate `run-demo-roster` suite is the right SUITE run in the wrong
PLACE (MEMORY: browser gates that pass on macOS fail on the slow Linux runner). Move
it: (a) a `schedule:` cron + `workflow_dispatch` nightly that runs the full roster on
a shared chromium (built ONCE) + the folded `demo-device-observe` LoAF/lighthouse, and
writes `last-demo-green=<sha>` on success; (b) `npm run demo:correctness` on-device
pre-push (fast macOS — where MEMORY says browser correctness actually holds). The
`run-demo-roster.mjs` driver is ALREADY device-agnostic (shared chromium + served
snapshot), so no rewrite. Dedupe `dfa-derived` (`demo-roster.mjs:176` & `:279`).

**The assert-non-empty contract (lane 29 F6).** The ~5 nightly roster survivors adopt the
SAME shared assert-non-empty helper as `proof:demo-smoke` (U.A4): an empty selector match
FAILS, never vacuous-greens — folded as a clause of the shared `demo-smoke` helper, not a
new standalone gate.

**Gate/oracle.** the nightly run green + the `last-demo-green` ref written (consumed
by A8).

**Edges.** A6 (the per-push browser job is gone; this re-homes its content).

**Evidence.** lane 08 F1/F3/F8; `scripts/demo-roster.mjs:71-280` (the 77-roster + the
dup); `scripts/run-demo-roster.mjs:104-150` (device-agnostic driver).

---

### U.A8 — Deploy-of-record redesign (OD-U3)

**Substance.** `deploy-pages.yml` today welds the deploy to the browser job by a
single-sourced literal NAME (`env.DEMO_CORRECTNESS_JOB` = the exact 50-char job-name
string, `:54`; the preflight `:62-90` greps the triggering run's jobs API for it).
Deleting that job (A6) leaves the `select(.name == $n)` empty → every deploy blocked.
Redesign: deploy-of-record gates on **(a) library-`ci`-green on master** + **(b)
`last-demo-green` an ancestor of the deploy SHA** (`git merge-base --is-ancestor`, the
ref written by A7). RETIRE the `DEMO_CORRECTNESS_JOB` literal + the preflight coupling.
A red nightly FREEZES the deploy ref (opens an issue), never blocks every push on a
40-min browser job. Break-glass `workflow_dispatch` stays.

**Gate/oracle.** a deploy-of-record dry-run exercising the redesigned trigger +
ancestor assertion (one-shot witness, not a standing gate).

**Edges.** A7 (`last-demo-green` exists); OD-U3 ruling (PRE-RATIFIED runner; the
gating redesign needs the owner ruling — lane 08's design adopted).

**Evidence.** `deploy-pages.yml:22-29` (the coupling rationale), `:54`
(`DEMO_CORRECTNESS_JOB`), `:62-90` (preflight), `:100-104` (the `ci`-success `if`);
lane 08 F5.

---

### U.A9 — The `scripts/` backend restructure (the colocation edict's backend arm)

**Substance.** The 209-file flat `scripts/` pile is the single largest flat
sibling-pile in the repo — and the enforcer's own home violates the colocation edict
it polices everywhere else. Transpose:

- **`scripts/gates/<family>/`** — surface/hygiene/correctness/live/appearance-residual/
  perf module dirs mirroring the tier taxonomy, each with an `index.mjs` barrel the
  tier manifest (A6) DERIVES from (so membership can't drift from the directory).
  `scripts/build/` (capture, pages-deploy, roster) + `scripts/deploy/` get their own
  dirs.
- **`scripts/lib/gate.mjs`** — one `Gate(name)` harness (`.clause(id, ok, detail)`,
  `.note()`, `.report()` → uniform banner + accumulated exit) replacing the 133
  hand-rolled `failures=[]` reporters. The backend twin of the library's "one shape,
  enforced" idiom; it also gives the roster a structural anchor (a gate is anything
  calling `Gate()`), replacing the regex-scrape.
- **`scripts/lib/serve.mjs`** — one static server + port allocation + teardown,
  replacing the 48 inline `http.createServer` copies; decompose the 1043-LOC
  `demo-driver.mjs` → `lib/driver/{launch,scene,serve,cdp,assert}.mjs` behind a barrel.
- **`vite.config.ts` (747L)** → colocate the 4 inline plugins into
  `scripts/build/vite/` (one module per plugin behind a barrel); externalize the
  `@microsoft/api-extractor` literal to `api-extractor.json`; DERIVE the critical-CSS
  tokens from the built bundle (`ctx.bundle`) instead of the hand-typed duplicate
  (`:248-283`) that silently rots when tokens move.
- **Dead artifacts** — `git rm` the 0-reference decision JSONs (`typed-om-decision.json`,
  `leaves-externalization-decision.json`, `reseat-vs-decay-decision.json`), the retired
  `scripts/baselines/visual-lock/_diff/` (44 orphaned `*.diff.png`, retired at T.M3);
  relocate live decision records + the `typing-dots-harness/` fixture into their owning
  gate's family dir.
- **`proof:scripts-colocated`** — the ONE new standing gate (owner-signed per
  anti-sprawl), the backend twin of `proof:colocation`, so the flat pile cannot re-form
  and a decision-JSON with zero readers reds.

**Gate/oracle.** `proof:scripts-colocated` (the sole new gate); the tier manifest
deriving from the barrels is self-witnessing.

**Edges.** A5 (population settled — restructure the survivors, not the deleted). Lane
23 F1/F3/F4/F7/F8. Runs after the deletions so it moves ~36 scripts, not 209.

**Evidence.** lane 23 F1 (`find scripts -type d` = only `lib/`+`baselines/`), F3 (133
reporters), F4 (48 servers, `demo-driver.mjs` 1043L), F7 (`vite.config.ts` 747L, no
`api-extractor.json` on disk, tokens hand-typed `:248-283`), F8 (0-ref JSONs, retired
baselines).

---

### U.A10 — The anti-sprawl covenant (STANDING)

**Substance.** Ratify the precept that prevents the ratchet from re-forming (lane 09
F2 root cause: the apparatus made *addition cheap and deletion expensive*). The
covenant, recorded in `DESIGN.md` + `U.md §6`:

1. **Deletion is FREE** — `git rm scripts/proof-X.mjs` + drop the `package.json` key.
   No witness, no discharge record, no successor-migration proof. (The five lifecycle
   registers that made deletion expensive are gone at A5.)
2. **Addition is EXPENSIVE** — new enforcement lands as a vitest test OR a clause of
   `proof:publish`. A new standalone `proof-*.mjs` requires OWNER SIGN-OFF.
3. **Net gate count only goes DOWN** — verified at U.Z close (monotone-down from 227).

**Why not a gate.** A ceiling is symptom-treatment (lane 09 F1: the count game
diverged 190→203→236→228→227 against a ceiling of 120 that was "about to be reached"
for three tranches). U charters a target SHAPE (three mechanisms), not a target
NUMBER. The covenant is a PRECEPT enforced socially + at close review, not a
`proof-*.mjs` (which would itself be sprawl).

**Gate/oracle.** recorded in `DESIGN.md`/`U.md §6`; the U.Z close verifies the roster
is at the ~36 target and every U wave's net gate delta is ≤ 0.

**Edges.** rides throughout the band; ratified at U.Z close.

**Evidence.** lane 09 F1 (the divergence trajectory), F2 (the deletion-bureaucracy
root cause); U.md §6 (the anti-sprawl clause).

---

## §A.4 — The one-coordinated-pass sequencing (against U.B/U.C)

Lane 32 / U.md §3: the CI trim and the restructure touch the SAME path-pinned gate
scripts — ONE pass, never two. A's deletions go FIRST wherever a gate would otherwise
be re-anchored twice.

```
U.A1 (coverage inversion) ─── unblocks everything ───┐
U.A2 doublings→vitest ───────┐                        │
U.A3 greps→lint  ────────────┤ population collapse    │
U.A4 appearance→golden ──────┘ (CO-SCHED U.B moves)   │
        │                                             │
U.A5 meta+ledger DELETE (after collapse) ─────────────┤
        │                                             │
U.A6 tiers + ci.yml collapse + device-observe kill ───┤
U.A7 roster → nightly + on-device ────────────────────┤
U.A8 deploy-of-record redesign ───────────────────────┤
U.A9 scripts/gates/<family>/ restructure (survivors) ─┘
U.A10 anti-sprawl covenant (standing) ─── ratified at U.Z
```

- **U.A4 ⇄ U.B**: the 77 appearance gates retire in the SAME commit as the U.B scene/
  transport/editor moves that delete their subject files — the gate re-anchoring rides
  WITH the move (never a dangling-anchor window, never a green-against-moved window).
- **U.A2 ⇄ U.H**: the doubling collapse lands after U.H's vitest project split so the
  surviving value tests home in the `library` project (glass-ui never in scope).
- **U.A3 ⇄ U.E**: the legacy greps fold to lint as U.E terminally adjudicates the same
  excisions.
- **U.C library carves**: the `proof:library-correctness` .mjs value-proofs fold into
  vitest as part of U.H; U.C's carves red no source-grep gate because A2 already
  removed the shape-locking halves.

---

## Risks + the re-arm map

The stale-era re-arm class is EXPECTED (U.md §5): every U.A deletion invalidates some
gate's expectation. The disposition is DELETE (the genre is dissolved) or RE-ANCHOR
(the gate survives, re-pointed at the new tree) — cited per wave.

| Wave | Invalidates / at risk | Disposition |
|---|---|---|
| **A1** | `proof:ci-coverage` CLAUSE 0 literal-step contract | RE-ANCHOR transitionally (reachability-from-tier); DELETE at A5 |
| **A2** | the ~25 `.mjs` source-grep halves; `proof:ci-coverage` CLAUSE 0 membership | DELETE the halves; the vitest oracle survives (re-armed by U.H's project split) |
| **A3** | the ~16 `REGRESSION_GUARDS`/kin greps | DELETE as `proof:*`; RE-ARM as `proof:lint-clean` rules |
| **A4** | the 77 line-anchored appearance gates + `FROZEN_SET`(36)/`DISCHARGE`(17) | DELETE the genre; RE-ARM `proof:owner-golden` (survives) + the EXISTING `proof:demo-smoke` (re-armed, NOT new — the NEW-gate set is `proof:scripts-colocated`+`proof:chunk-graph`) (CO-SCHED U.B) |
| **A5** | 27 self-policing gates; `gate-bands.mjs` full; `proof-ci-coverage.mjs`; `proof-decomposition`/`chronic-closure`/`retirement-ledger`/`roster-ceiling`/`gate-is-runtime`; `gate-taxonomy.md`; `T_BORNRED_BACKLOG`(8) | DELETE wholesale (coverage true-by-construction); `T_BORNRED_BACKLOG` PARTITION → U.F letter (external) / fix-or-re-judge (self) — co-owned U.E |
| **A6** | `ci.yml` 134-step enumeration; `demo-device-observe`; `ci-env.mjs` posture / `portable-perf.mjs` / `cdp-perf.mjs`; the `package.json` `&&` mega-strings | DELETE the enumeration+observe job+device-honesty subsystem; RE-ARM membership as `scripts/lib/tiers.mjs` data |
| **A7** | the per-push `demo-correctness` browser job; the `dfa-derived` dup | RE-HOME to nightly + on-device (same driver, no rewrite); DEDUPE |
| **A8** | `deploy-pages.yml` `DEMO_CORRECTNESS_JOB` literal + preflight coupling | DELETE the literal coupling; RE-ARM as library-green + `last-demo-green` ancestor assertion (OD-U3) |
| **A9** | the 209-flat layout; 133 reporters; 48 inline servers; `demo-driver.mjs` monolith; `vite.config.ts` inline plugins; 0-ref JSONs + retired baselines | RE-STRUCTURE survivors into `gates/<family>/` + `lib/gate.mjs`/`serve.mjs`/`driver/`; DELETE dead artifacts; ONE new gate `proof:scripts-colocated` (owner-signed) |
| **A10** | `ROSTER_CEILING`(120) / the count game | DELETE the ceiling; RE-ARM as a PRECEPT (target shape, not number), verified at U.Z |

**Standing invalidation the band CREATES, not clears (forwarded):** U.A4's
`proof:demo-smoke` and `proof:owner-golden` depend on U.G ratifying the owner-golden
authority + idle-state capture protocol; if U.G slips, the 77-gate retirement has no
re-arm target — so A4 is HARD-GATED on U.G, not merely co-scheduled. U.A6's
`tiers.mjs` is a data manifest in A6 but only DERIVES from directory barrels after A9;
the interim (A6→A9 window) carries a hand-maintained array that A9 makes
self-witnessing — a bounded, in-band exposure, not a deferral.

**Net gate delta (the band's headline):** 227 → ~36. Every row above is DOWN or
flat; the ONLY NEW standing gate this band adds is the owner-signed
`proof:scripts-colocated` (U.A9; the tranche's other new gate, `proof:chunk-graph`, is
U.D-owned) — the appearance genre re-arms onto the EXISTING `proof:demo-smoke` + the
surviving `proof:owner-golden`, each REPLACING 36–77 deleted gates.
