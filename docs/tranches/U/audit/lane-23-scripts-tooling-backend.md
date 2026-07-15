# Lane 23 — scripts / tooling / backend

**Fleet:** Tranche U development audit (lane 23/32)
**Charter:** the "backend" per the grand edict — `scripts/` (~230 `.mjs`), `scripts/lib/`, deploy/capture helpers, `vite.config.ts`, api-extractor, the build pipeline. Audit the long flat `scripts/` dir (colocation edict), proof-script duplication (shared-harness extraction), build simplicity, dead scripts. Propose the target structure + shared-lib consolidation. LOC counted as evidence.
**Discipline:** read-only; this report is the sole writable artifact.

---

## The shape of the backend, counted

| Measure | Value | Evidence |
|---|---|---|
| `scripts/**/*.mjs` files | **230** | `find scripts -name '*.mjs'` |
| `scripts/proof-*.mjs` (flat, top level) | **209** | `ls scripts/proof-*.mjs` |
| Subdirs under `scripts/` | **only** `lib/`, `baselines/` | `find scripts -type d` |
| `proof:*` keys in `package.json` | **226** distinct | `grep -oE '"proof:[a-z0-9-]+"'` |
| Declared `ROSTER_CEILING` | **120** (born-RED backlog) | `scripts/gate-bands.mjs:595` |
| Scripts hand-rolling `const failures = []` reporter | **133** | `grep -l "const failures\|function fail"` |
| Scripts re-implementing an inline static server | **48** | `grep -l "createServer\|serveDist"` |
| Browser-driving scripts (via `lib/demo-driver.mjs`) | **77** | `grep -l "demo-driver"` |
| Pure source-static scripts (no browser) | **125** | set difference |
| `scripts/lib/demo-driver.mjs` LOC | **1043** | `wc -l` |
| Total `scripts/**` LOC | **~73,600** | `wc -l` sum |
| `.github/workflows/ci.yml` | **756 lines / 61 KB, 150 steps, 134 `npm run proof:`, 3× `ubuntu-latest`** | `wc -l`, `grep runs-on` |
| `vite.config.ts` | **747 lines, 4 inline plugins** | `wc -l`, read |
| `FROZEN_SET` size (RED-authorized appearance/layout gates) | **91** | `grep -c '"proof:' scripts/gate-bands.mjs` |

The one sentence: **the backend is a 209-file flat directory of near-cloned scripts with no shared harness, a 226-gate roster explicitly capped at 120, and a 756-line CI that hand-lists every gate on a runner the owner has ruled superfluous** — the grand colocation + no-legacy + performance edict lands on this directory with more force than anywhere else in the repo.

---

## Findings

### F1 (CRITICAL) — `scripts/` is a 209-file flat directory; the colocation edict's backend arm is entirely unmet
**Evidence:** `find scripts -type d` returns only `scripts/lib` + `scripts/baselines`. All 209 `proof-*.mjs` sit flat at `scripts/*.mjs` alongside `capture.mjs`, `demo-roster.mjs`, `gate-bands.mjs`, `pages-deploy.sh`, 9 `*-decision.json`. The ORIGINAL-PROMPT (line 34): *"Similar treatment and enforcement should be applied to all backend files, too — abstracted and made befitting for those languages."* The demo has `proof:colocation` / `proof:no-flat-siblings` / `proof:scene-colocated` **standing gates** enforcing exactly this on `src/` and `demo/` — but `scripts/` itself, the enforcer's home, is the single largest flat sibling-pile in the repo and has **no** analogous gate.

The scripts already cluster into obvious families by their imports and mechanism: **surface/boundary** (`proof-boundary`, `proof-published-surface`, `proof-engine-subpath-mirror`, `proof-dts-rollups-agree`, `proof-claude-paths-live`, `proof-alias-dropped`), **source-shape/hygiene** (`proof-colocation`, `proof-no-flat-siblings`, `proof-decomposition`, `proof-zone-cohesion`, `proof-idioms`, `proof-no-dead-*`), **library-correctness** (node/jsdom value-proofs), **live/browser** (77 via `demo-driver`), **demo-appearance/layout** (the 91-member FROZEN_SET — dock/stage/cartoon/hero), **perf** (`proof-perf-*`, `proof-portable-perf`, `proof-scene-perf-budget`), **meta/ledger** (`proof-ci-coverage`, `proof-gate-authority`, `proof-roster-ceiling`, `proof-chronic-closure`).

**Proposal (gestalt):** transpose the flat pile into `scripts/gates/<family>/` module directories mirroring the tier taxonomy — `gates/surface/`, `gates/hygiene/`, `gates/correctness/`, `gates/live/`, `gates/appearance/`, `gates/perf/`, `gates/meta/` — each with an `index.mjs` barrel that the tier manifest (F5) imports. `scripts/lib/` stays the shared-harness tier; `scripts/build/` and `scripts/deploy/` (capture, pages-deploy, roster) get their own dirs. Then author `proof:scripts-colocated` as the STANDING gate (the backend twin of `proof:colocation`) so the flat pile cannot re-form. This is not a cosmetic move: the family boundary is what lets F3/F4/F5 (shared harness, shared server, tier-as-data) land without re-touching 200 files.

---

### F2 (CRITICAL) — the gate roster is 226 keys against a declared ceiling of 120; the owner ruled CI "substantially tautological" — U must EXECUTE the retirement fold, not carry it as a born-RED row
**Evidence:** `package.json` declares **226** distinct `proof:*` keys. `scripts/gate-bands.mjs:595` `export const ROSTER_CEILING = 120;`. `scripts/proof-roster-ceiling.mjs:9-14`: *"COUNT CEILING (BORN-RED backlog) — the total proof:* count must not exceed ROSTER_CEILING … Today ~204 > 120 → RED. This CONVERGES as M7's ~15 feature-coupled retirements + the FROZEN discharge land."* The ORIGINAL-PROMPT (line 8): *"our CI needs to be trimmed substantially (most of it's likely tautological)"* and readings §1: *"the gate roster (227 proof:* keys vs the declared 120 ceiling …) is presumed substantially tautological. U owns a CI/gate-apparatus reduction band."*

The `FROZEN_SET` alone is **91** appearance/layout gates (`gate-bands.mjs:27`) that S authorized as an *ossifying* set to be discharged by MIGRATION-to-a-successor-system-gate or KILL. That discharge has been chronically deferred tranche-over-tranche (the count *inverted* from S.A4's promised 190→120 up to 226). Under U's NO-MORE-DEFERRALS edict this is the headline backend fold: ~106 keys must retire or fuse.

**Proposal (gestalt):** treat the 91-member FROZEN_SET as the retirement worklist. Most are per-property demo-appearance assertions (`proof:dock-rest-crisp`, `proof:cartoon-shadow-unclipped`, `proof:subject-legible`, `proof:stage-glass-card`…) — collapse each family into ONE parametric system gate that asserts the property across all scenes from a data table (a `proof:demo-appearance` that walks the scene roster × property matrix), the successor-migration path S.A4 already sanctioned. The 209→~110 script reduction and the 226→~120 roster reduction are the SAME move: a gate that is one row in a table, not one file. Retire the `proof:roster-ceiling` born-RED row by making it GREEN through actual deletion, per NO-DEFERRALS.

---

### F3 (MAJOR) — 133 proof scripts each hand-roll the `failures=[]` / fail / pass / summary / exit-1 reporter; there is no shared gate harness
**Evidence:** `grep -l "const failures\|function fail"` → **133** scripts. `scripts/lib/` has only `gate-shape.mjs` (harness-signature detection + actuation-primitive lists — `gate-shape.mjs:33-89`) and `ci-env.mjs` (`observeOnlyInCI` / `declarePosture` posture helpers — `ci-env.mjs:64,86`). Neither is a reporter. So every gate re-implements: collect failures → per-clause `if (bad) failures.push(...)` → print PASS/FAIL banner → `process.exit(failures.length ? 1 : 0)`. Sampled identical shapes at `proof-colocation.mjs`, `proof-no-flat-siblings.mjs`, `proof-boundary.mjs`, `proof-idioms.mjs` (all open `const failures = []`).

**Proposal (gestalt):** author `scripts/lib/gate.mjs` exporting a `Gate(name)` harness — `.clause(id, ok, detail)`, `.note()`, `.assert()`, and a single `.report()` that prints the uniform banner and exits with the accumulated code. Every gate becomes `const g = Gate("colocation"); g.clause("kind", …); g.report();`. This is the backend twin of the library's own "one shape, enforced" idiom. It also gives the CI-coverage/roster machinery a structural anchor (a gate is anything that calls `Gate(...)`), replacing the current regex-scrape of `node scripts/proof-*.mjs` strings.

---

### F4 (MAJOR) — 48 scripts re-implement an inline static file server; the serve seam is un-extracted even though the browser-launch seam IS shared
**Evidence:** `grep -l "createServer\|serveDist\|serveStatic"` → **48** proof scripts spin up their own `http.createServer` to serve `dist/gh-pages`. The browser-launch half is already centralized (77 scripts import `lib/demo-driver.mjs`), which proves the extraction pattern works — but the `serveDist` half leaked back out into 48 copies. `lib/demo-driver.mjs` is itself **1043 LOC** carrying launch + scene-open + CDP + assertions all in one file.

**Proposal (gestalt):** extract `scripts/lib/serve.mjs` (one static server + port allocation + teardown) and have `demo-driver` + all live gates consume it. Then decompose the 1043-LOC `demo-driver.mjs` (the "long file → encapsulate into common modules" edict, applied to the backend's own shared lib) into `scripts/lib/driver/{launch,scene,serve,cdp,assert}.mjs` behind a barrel. A shared server + a decomposed driver is what lets the 77 live gates shrink to their actual per-gate logic.

---

### F5 (MAJOR) — the `package.json` scripts block is a 240-line God-object; the tier rosters are ~10 KB single-line `&&` literals hand-maintained in JSON
**Evidence:** `package.json:269` `proof:library-correctness` is one `&&` chain of ~40 keys; `:270` `proof:demo-correctness` ~26 keys; `:272` `proof:hygiene-chain` is a **single line concatenating ~130 `npm run proof:*` invocations** (≈10 KB). `run-all.mjs:53-64` re-parses these strings by `.split("&&")` to recover tier membership — i.e. the tier roster is authored as a mega-string in JSON purely so a script can regex it back apart. The comment at `run-all.mjs:14-17` even documents this ("The SCHEDULE moves here, the MEMBERSHIP stays in package.json").

**Proposal (gestalt):** move tier membership to a data manifest — `scripts/lib/tiers.mjs` exporting `{ correctness: [...], hygiene: [...], live: [...] }` as arrays (ideally derived from the F1 `gates/<family>/index.mjs` barrels, so membership can't drift from the directory). `run-all.mjs` imports the manifest directly; `package.json` collapses to a handful of entrypoints (`proof:all`, `proof:hygiene`, `check`, `build`, `dev`). This kills the 10 KB literal, ends the string→split→string round-trip, and makes `proof:ci-coverage` derive its roster from data instead of scraping a concatenation.

---

### F6 (MAJOR) — CI `ci.yml` is 756 lines hand-listing 134 gates across 3 `ubuntu-latest` jobs; the owner ruled the Linux runner superfluous and the roster tautological
**Evidence:** `.github/workflows/ci.yml` = **756 lines / 61 KB**, `grep -cE "^\s+- name:"` = **150** steps, **134** distinct `npm run proof:` invocations, three `runs-on: ubuntu-latest` (lines 50, 635, 679). ORIGINAL-PROMPT line 8: *"that runner is entirely superfluous — our CI needs to be trimmed substantially (most of it's likely tautological)."* MEMORY notes a multi-round "CI device-dependence greening" epic: macOS-green gates that fail only on the slow Linux runner (render-races, absolute frame/ms thresholds). The 134 hand-listed steps duplicate the `proof:hygiene-chain` roster that already lives (as a string) in `package.json` — two sources of truth for the same list.

**Proposal (gestalt):** collapse CI to a single job that runs `node scripts/run-all.mjs --all` driven by the F5 tier manifest — one source of truth, the accumulator run-all already implements (`run-all.mjs:96-106` collects all exit codes and names every failure). Drop the Linux-runner device-dependent live/perf gates per the owner ruling (or gate them behind an explicit opt-in matrix leg), so CI stops re-deriving frame-budget verdicts on a runner whose timing was never the target. The 756-line hand-list becomes ~30 lines: checkout, install, `run-all --all`.

---

### F7 (MAJOR) — `vite.config.ts` is a 747-line file with 4 inline build plugins and an inline api-extractor config; the build's simplicity edict applies
**Evidence:** `vite.config.ts` = **747 lines**. It inlines `engineDtsRollupPlugin` (`:38-183`, a full tsc-emit + `@microsoft/api-extractor` `Extractor.invoke` pipeline — there is NO `api-extractor.json` on disk; `find -name api-extractor*.json` empty, the config is a 50-line `IConfigFile` literal at `:102-153`), `deferLazyCSSPlugin` (`:190`), `criticalCSSPlugin` (`:219`), `assetExtension404Plugin` (`:425`). `criticalCSSPlugin` **hand-duplicates the design tokens** as a string literal (`:248-283` — `--background`, `--foreground`, `--glass-*` re-typed from the real theme), a legacy-copy that silently rots when the tokens move.

**Proposal (gestalt):** colocate the build plugins into `scripts/build/vite/` (or `vite/plugins/`) as one module per plugin behind a barrel, leaving `vite.config.ts` a thin composition root. Lift the api-extractor config out of the plugin literal into an `api-extractor.json` the plugin loads (the tool's own idiom, re-usable by a `check:dts` gate). Replace the hand-typed critical-CSS token block with an extraction from the built CSS (the plugin already receives `ctx.bundle`) so first-paint tokens can't diverge from the theme. This is the "long file → encapsulated common modules" edict applied to the build.

---

### F8 (MINOR) — dead artifacts under `scripts/`: orphaned decision JSONs and a retired visual-lock baseline tree the NO-LEGACY edict targets
**Evidence:** `grep -rl` across `scripts/ test/ src/` for each `*-decision.json`: `typed-om-decision.json` → **0** references, `leaves-externalization-decision.json` → **0**, `reseat-vs-decay-decision.json` → **0** (referenced by nothing but itself). `scripts/baselines/visual-lock/_diff/` holds **44** `*.diff.png` — but `gate-bands.mjs:95` records *"proof:visual-lock RETIRED at the T.M3 blessing — script/baselines/mask deleted"*, and commit `71e0fb4` confirms visual-lock was retired. The 44 diff PNGs are debris the retirement left behind. `scripts/lib/typing-dots-harness/` (an `index.html` + `main.ts` fixture) also sits under `lib/` — a fixture, not a library module.

**Proposal (gestalt):** delete the 0-reference decision JSONs and the orphaned `baselines/visual-lock/` tree outright (NO legacy code). Move live decision-record JSONs (spring-vector, soa-composite, waapi-densify — the ones still read) into a `scripts/decisions/` dir beside their owning gate, and relocate `typing-dots-harness/` into the typing-dots gate's family dir (F1). The standing `proof:scripts-colocated` gate (F1) should also red on a decision-JSON with zero readers, so dead data can't re-accrete.

---

## What U must charter

1. **CHARTER `scripts/gates/<family>/` restructure** — transpose the 209 flat `proof-*.mjs` into family module dirs (surface, hygiene, correctness, live, appearance, perf, meta) mirroring the tier taxonomy; author `proof:scripts-colocated` as the standing backend twin of `proof:colocation`.
2. **CHARTER the roster retirement fold to green** — collapse the 91-member FROZEN_SET of per-property demo-appearance gates into parametric scene×property system gates; drive 226→≤120 by actual deletion/fusion, retiring the `proof:roster-ceiling` born-RED row per NO-DEFERRALS.
3. **CHARTER `scripts/lib/gate.mjs`** — one `Gate(name)` clause/report/exit harness; migrate all 133 hand-rolled reporters onto it.
4. **CHARTER `scripts/lib/serve.mjs` + `demo-driver` decomposition** — extract the static server shared by 48 gates; split the 1043-LOC `demo-driver.mjs` into `lib/driver/{launch,scene,serve,cdp,assert}.mjs`.
5. **CHARTER tier-membership as data** — `scripts/lib/tiers.mjs` (derived from the F1 family barrels); collapse the ~10 KB `&&` literals in `package.json` and let `run-all` + `proof:ci-coverage` consume the manifest directly.
6. **CHARTER the CI collapse** — reduce `ci.yml` from 756 hand-listed lines to a single `run-all --all` job over the tier manifest; drop/opt-in-gate the device-dependent Linux live/perf legs per the owner's superfluous-runner ruling.
7. **CHARTER the build-config decomposition** — colocate the 4 inline vite plugins into `scripts/build/vite/`, externalize the api-extractor config to `api-extractor.json`, and derive the critical-CSS tokens from the built bundle instead of the hand-typed duplicate.
8. **CHARTER dead-artifact deletion** — remove the 0-reference decision JSONs and the retired `baselines/visual-lock/` tree; relocate live decision records + fixtures into their owning gate's family dir.
