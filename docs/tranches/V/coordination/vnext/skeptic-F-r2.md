# Skeptic F (r2, TRUE-FABLE) — the keyframes.js gates/proof/tests challenge

**Seat:** Lane F r2 · **Model:** Fable (claude-fable-5, declared + actual) · **Date:** 2026-07-18
**Protocol:** union-with-demarcation. Phase 1 written before any read of the prior (Opus) report.

## G0-prime tree pins

| Tree | Path | Branch | HEAD |
|---|---|---|---|
| keyframes.js (canonical) | /Users/mkbabb/Programming/keyframes-v-exec | master | `0dac636b` (v6.0.0) |
| keyframes.js W9 staging | same repo | v/w9-staging | `b920b190` (2 commits over `5a9183a7`) |
| value.js | /Users/mkbabb/Programming/value.js | tranche-u | `db77dbd8` (pinned; not read for evidence this lane) |

All evidence below is from the canonical tree at `0dac636b` unless marked `v/w9-staging`.
Prior record engaged per charter: `docs/tranches/V/audit/R2-07-gate-test-prune.md` (Model: opus,
2026-07-17 — itself Opus-authored and therefore ALSO under challenge here), plus the W9 staging
commits `95e53f5e` + `b920b190`, `docs/tranches/V/PROGRESS.md`, `DISPOSITIONS.md`, `FOLD-FORWARD.md`.

---

## PHASE 1 — fresh findings

### F1. What LANDED on master vs staged-only (the W9 ground truth)

Verified by direct inspection of `0dac636b` and `git log`/`git show` on `v/w9-staging`:

**Landed on master (pre-W9, via other waves):**
- `test/support/mirror.test.ts` PRUNED at `fe42c6f9` "chore(test): prune the topology-only mirror test (W4, XB-04)" — the one R2-07 PRUNE row that is already real on master.
- `scripts/baselines/visual-lock/` (GS-05, 44 diff PNGs) — does NOT exist on this tree (`ls scripts/baselines` → no such dir); the W9 commit message itself records "Already absent … nothing to remove". The R2-07 PRUNE row was already-vacuous when staged.
- `proof:structure` gate born (W4): `scripts/gates/structure/index.mjs` (755L), wired into local `check` only.

**Staged-ONLY on `v/w9-staging` (2 commits, pushed, NOT on master):**
- MR1 pageerror-keying: master `scripts/observe/demo/smoke.mjs` still keys `console.error` only (`smoke.mjs:129-131` collector, `:182-184` assert); zero `pageerror` hits (grep reproduces: `grep -n pageerror scripts/observe/demo/smoke.mjs` → none).
- MR2 oracle wiring: all 5 browser oracles still `describe.skipIf` and appear in NO workflow step on master (`grep entry-roundtrip .github/workflows/*` → empty); w9 ci.yml has the step (`git show v/w9-staging:.github/workflows/ci.yml:87-95`).
- MR3 dispatch bypass: master `deploy-pages.yml:38,41` still `if: github.event_name != 'workflow_dispatch'` on both preflight asserts; no `require_demo_green` input. The break-glass bypass defect class is LIVE on the deploy path of record today.
- MR4: no `test:demo` script in master package.json; no demo step in master ci.yml.
- Prune set: `bench/taxonomy.json` (654L), `bench/group-soa-integration.mjs` (66L), `bench/typed-om-validate.mjs` (184L), `bench/d3-changed-keys.measure.test.ts` (63L), `bench/sync-step.measure.test.ts` (199L), `scripts/probe-webkit-linear-accel.mjs` (218L) — ALL still present on master (~1,384L of adjudicated superfluity un-pruned).
- zero-alloc `gc` arm still on master (`test/engine/zero-alloc.test.ts:117` `expect(true).toBe(true)`); `it.fails` witness still on master (`test/group/group-snapshot-identity.test.ts:75`, the suite's "1 expected fail").
- `proof:owner-golden` still under the `proof:` namespace on master package.json (relabel to `review:` staged only).

**Verdict F1:** W9 is AUTHORED+STAGED, landing folded forward (`FOLD-FORWARD.md:24`); every
defect class the make-real quartet guards is live on master TODAY. The V-next tranche's first
kf gate action is a landing (rebase over the W2-landed `deploy-pages.yml`, per FOLD-FORWARD),
not a re-adjudication.

### F2. Gate-by-gate challenge (named catch or unique defect class, else abrogate)

**SURVIVES — the merge/release spine.** Independently re-run, not inherited:
- `test:lib`: 98 files run / 1040 pass / 1 expected fail / 14 skipped, **4.6s** (my run, this tree). Fast, green, behavior-bearing (census F3).
- `proof:structure --selftest`: every rule R1–R6 proven CAN-pass + CAN-fail on fixtures (my run; non-vacuity is self-demonstrated). Named catches at birth: the seventh dir-stutter, the 35 unused exports (R6 class — commit-record `docs/tranches/V`).
- `proof:publish` spine (boundary 740L / published-surface 873L / consume-bundle 101L / readme-runs 497L): guards the tarball==exports==dts==runtime + light/heavy split boundary. Unique defect class with a NAMED sibling bite: the value.js `development`-exports condition that broke Vite consumers (MEMORY project_valuejs_dev_export_gotcha) and re-bit as the staged-MR4 red witness (`95e53f5e`: '"." is not exported under ["node","development","import"]'). KEEP.
- `release.yml`: tag==version assert + spine + `release:changelog` (named catch: the `getTimingFunction` removal → migration doc, R2-07:266, consistent with tranche record). KEEP.
- depcruise `lint`: 0 violations now; guards the cycle class with real history (R-tranche ring break, known-violations 26→0, MEMORY). KEEP — but see F2-GAP1.

**[F2-GAP1 — FABLE-NEW, the headline]: the two structural guards are enforcement-free.**
Neither `lint` (depcruise) nor `proof:structure` runs in ANY workflow — not on master, not
in the staged W9 ci.yml either. Reproduce: `grep -rn "lint\|depcruise\|proof:structure"
.github/workflows/` → **zero hits**; `git log -S depcruise -- .github/workflows/` → empty
(never wired, ever). CI runs `check:lib`, which excludes `proof:structure` (that lives only
in the local `check` script). So the anti-re-drift gate born in V "so the settled tree cannot
re-drift" (index.mjs:6) and the cycle-ban both bind only contributors who remember to run
them. On the eve of a total restructure tranche this is the single cheapest real wire
available: two one-line steps, each sub-2s. R2-07 flagged no-CI-job for the oracles and demo
tests but NOT for lint (its own R1-02 framing counted lint in "the merge spine" — false), and
R2-07 does not adjudicate proof:structure at all (the gate postdates its inventory; the owner
addendum explicitly subjects it to the test).

**[F2-GAP2 — FABLE-NEW]: "nightly" is actually WEEKLY.** `ci.yml:16` cron `"17 3 * * 1"` =
Mondays only. Every label ("nightly roster", U.A7 comment, R2-07's "nightly appearance
roster") overstates cadence 7×. Consequence: `last-demo-green` advances at most weekly, so
the deploy-ancestry gate certifies "a demo was green within ~a week", not "this demo state
is green". Not a vacuous gate (ancestry is still enforced on the workflow_run path,
`deploy-pages.yml:38-46`), but the freshness claim in the apparatus prose is wrong.
W10's DM-16/17 (ci.yml relabel) partially anticipates this; the cadence-vs-claim gap is
sharper than a relabel.

**SURVIVES with the staged fix — the observe fleet:**
- `smoke.mjs` (200L): step-5 DOES assert `#app` non-trivial children + home hero text
  (:137-168) — it is not purely console-keyed; but it observes ONLY the home route, and its
  error channel is `console.error` only. The masked-pageerror class (5/7 scenes throwing a
  caught `timingFunction` pageerror while rendering — the R2-04 record) is invisible to it by
  construction on BOTH axes (wrong route, wrong channel). MR1 (staged) is the cure; survives
  the challenge on a demonstrated unique defect class.
- `occlusion.mjs` (327L) / `usability.mjs` (410L) / `subject-animates.mjs` (341L): the only
  appearance/interaction-axis signal; the S-tranche mobile-sheet occlusion systemic (12→72%
  cure) and the K live-audit F1–F6 are the named catch record (MEMORY). These guard the exact
  gate-blindspot class the owner's own feedback note names (green source-shape gates miss
  appearance). KEEP.
- `live-session.mjs` (1612L) + `live-session-mobile.mjs` (1202L): the two largest scripts in
  the repo — 2,814L, 34% of the whole gate+observe apparatus (8,204L total). They are the
  round-trip backbone (K Band II replay-equality class). KEEP but they are the maintenance
  mass; if any observe artifact deserves a future carve/dedup pass it is this pair (shared
  drive logic vs viewport is largely parallel). Flag, not a prune.
- `audit:lighthouse` (343L): **CHALLENGED.** Masked `|| echo` at ci.yml:100 — it CANNOT fail
  the job by construction, runs weekly, and I find no named catch in any tranche record I
  read. R2-07 kept it as "honest observe-only". Under the owner's parsimony edict an
  unfailable, uncatching, unread log line is process weight: DEMOTE to a local instrument
  (keep the script, drop the 2 ci.yml steps) or name a catch. This is my one over-keep
  challenge to R2-07 that changes a verdict.
- `proof:owner-golden` (375L): enforcing dHash leg runs in no workflow; static leg only.
  R2-07's FOLD-to-`review:` is correct and staged; on master the `proof:` name is still a
  pretense today. Confirmed by inspection.

### F3. The test-corpus census by family (fresh; counts + LOC measured, not inherited)

Totals: **130 `.test.ts` files / 22,097 LOC / ~1,207 tests** (my runs: library 1,055
incl. 14 skipped + 1 expected-fail; demo 152) — matches the addendum's 130/1210 frame.

| Family | Files | LOC | Disposition |
|---|---|---|---|
| Behavior-bearing library contract + regression witnesses (tranche-named: w0-crashes, iw0-cube-composite, c6-correctness, en-fix …) + property/fuzz (grammar-fuzz, fixtures corpus) | ~95 | ~16,900 | KEEP — the bulk is honest. Files carry provenance headers naming the bite (sampled: standalone-zero-alloc "BITE: revert `_frame`…reds"; binary-search off-by-one rationale; replay-equality's five parity holes). Probed the duplicative-looking pairs (frame-compiler vs -value4, zero-alloc vs standalone, replay-equality vs roundtrip-fidelity): each is a distinct documented facet, NOT duplication. |
| Browser oracles, skip-masked in CI | 5 | 1,165 | KEEP + WIRE (= staged MR2). entry-roundtrip 273, trigger-oracle 303, split-a11y 249, view-transition-roundtrip 181, en-fix 159. All `describe.skipIf(!chromium)`, zero CI steps on master. |
| Demo suite (state machines, transport, scenes, sharing) | 27 | 3,799 | KEEP + WIRE (= staged MR4). 152 tests, 1.3s. Ungated on master. NOTE: in this checkout 1 file (`test/demo/app/e-w1-encapsulation.test.ts`) fails to LOAD — `@mkbabb/glass-ui/motion-core` unresolvable because glass-ui is not installed here; environment artifact of the audit checkout (demo graph is devDependency), NOT product truth — but it demonstrates MR4's gate can fail on exactly the consume-edge class. |
| Source-text/shape-asserting | 1 | 86 | `test/engine/boundary-cohesion.test.ts`: regex-greps src file TEXT for open-coded clamps with HARDCODED paths (`physics/smooth.ts`, `orchestration/timeline/index.ts`, sweeps `waapi/`). Same defect class as the pruned mirror.test.ts (topology/source-text, reds a restructure on paths, no runtime behavior). R2-07 never itemized it (its own admitted gap: "did not line-audit all 131"). Verdict: FOLD the clamp-cohesion invariant into proof:structure (which already does source-text law honestly, with selftest) or delete at the V-next restructure. UNDER-PRUNE in R2-07. |
| Characterization/snapshot | 1 | 108 | `characterization/stable-surfaces.test.ts` — inline-snapshot of PUBLIC compiled CSS bytes. The only snapshot usage in the corpus (grep: 1 file). Deliberate characterization of a published surface = behavior-bearing. KEEP. No snapshot-theatre family exists. |
| Vacuous arms (residue, staged-fixed) | 2 arms | ~50 | zero-alloc gc arm (`:112-131`, tautology without `--expose-gc`); `it.fails` snapshot-identity wrapper (`:75-102`, greens on any throw). Both still on master; both W9-staged (prune/fold). Confirmed by direct read. |
| Zone-orphaned runner-globless (bench) | 2 | 262 | `d3-changed-keys.measure.test.ts`, `sync-step.measure.test.ts` — match neither `bench/*.bench.ts` nor the test glob; verified no runner picks them up. Staged-pruned. |
| Parity sweeps (behavioral, not textual) | 1 | ~60 | `internal/leaves-parity.test.ts` — numeric grid parity of the deliberate byte-copy vs value.js canon. Guards a real drift class. KEEP (distinct from the shape family: it executes, not greps). |

**Census verdict:** the presumption "MOST of the test corpus is overfit nonsense" is
**REFUTED on this tree**. The overfit/vacuous/orphaned residue is ~400 LOC (~1.8%) plus one
86L shape-test, and W9 already staged nearly all of it. What the corpus IS coupled to is
internal module PATHS (imports like `../../src/animation/compile/emit/format` — 57 files
import `src/animation/engine` alone): a restructure-churn cost, not assertion overfit.
The V-next restructure must budget a mechanical import-rewrite sweep, and that is the true
reason MR4/MR2 must land FIRST (green witnesses before the churn).

### F4. R2-07 under-pruned or over-kept?

- **Core verdict independently re-derived:** the apparatus is largely honest; the residue is
  short and sharp; the make-real set of exactly 4 is correctly aimed (each defect class
  verified live on master by me: miskeyed smoke, skip-masked green oracles, dispatch bypass,
  ungated demo suite). The blueprint survives the Opus-provenance challenge on the tree
  evidence — with the following corrections.
- **UNDER-PRUNED / MISSED (4):** (1) `boundary-cohesion.test.ts` shape-test un-itemized
  (F3); (2) lint/proof:structure enforcement-free — R2-07's "merge spine" framing asserts
  lint is on the spine when no workflow has ever run it (F2-GAP1); (3) proof:structure not
  adjudicated at all (postdates the inventory; the owner addendum explicitly demands it);
  (4) the weekly-labeled-nightly cadence claim (F2-GAP2).
- **OVER-KEPT (1):** `audit:lighthouse` in CI — unfailable by construction, no named catch;
  demote out of ci.yml (F2).
- **Already-vacuous row (1):** GS-05 visual-lock PNGs were already absent from the exec tree
  when W9 staged — a stale-inventory row, harmless but recorded.

### F5. The minimal HONEST gate set (proposal)

**Merge (PR/push, target <60s incremental):** `check:lib` + `build:lib` + `test:lib` +
`test:demo` (MR4) + `proof:publish` + **`lint`** + **`proof:structure`** (the two new
one-line wires, F2-GAP1).
**Release (tag):** tag==version + the same spine + `release:changelog` + provenance publish
(unchanged — real, named catches).
**Weekly roster (relabel from "nightly"; blocking only for deploy ancestry):** the 6-observation
roster with MR1 pageerror-keying + the 5 browser oracles (MR2) + post-build `proof:publish`
(already present) + `record last-demo-green`. Drop the 2 lighthouse steps.
**Deploy:** preflight with MR3's `require_demo_green` default-true break-glass.
**Retire/demote:** the W9 prune set as staged (~1,384L bench/scripts cruft + the 2 vacuous
arms), `proof:owner-golden`→`review:` relabel as staged, lighthouse→local instrument,
`boundary-cohesion.test.ts`→fold into proof:structure at the restructure.
Net: ZERO new gate infrastructure beyond the staged W9 + two one-line CI steps + two step
deletions; the apparatus after this is ~6,800L of scripts guarding named classes only.

---

## PHASE 2 — union with the prior (Opus) report

Prior report read (after Phase 1 was on disk): `scratchpad/vnext-draft/skeptic-F-kf-gates-tests.md`
(pinned at `c2c8915f`, one docs-only commit behind my `0dac636b` — source-identical trees).
Every material finding presumed INCORRECT and tested against my own on-disk evidence.

### Demarcation ledger

**UNION-CONFIRMED (12)** — in the Opus report AND independently re-derived; survive on MY evidence:
1. **The headline: R2-07's prune never landed.** W9 staged-only on `v/w9-staging`; only proof:structure (W4), the R6 sweep (W6), and the mirror.test.ts prune (W4 `fe42c6f9`) landed. My F1 target-by-target verification reproduces the Opus table exactly.
2. **lint (depcruise) runs in no workflow** (Opus catalog row = my F2-GAP1 core fact).
3. **proof:structure KEEP-EARNED with real catch archaeology.** I verified: born-RED logs exist on disk (`docs/tranches/V/audit/gates/W4-red-R1-stutter.log`, `-R2-fragment.log`, `-R3-barrel.log`, `W6-red-R6-unused-exports.log`); commit `e7fcff3f` IS the AM-1 seventh stutter (`drag-2d.ts → drag/2d.ts`); `--selftest` non-vacuity re-run green by me. Also both of us independently found R2-07 omits proof:structure entirely.
4. **proof:publish spine KEEP-EARNED** (orchestration + LOC verified; the dev-export defect class is the named bite).
5. **proof:owner-golden FOLD → `review:`** — enforcing dHash leg in no workflow; static leg is sha256-vs-BLESSED.json of its own candidates (read: `gates/visual/index.mjs:105,148,241-253`).
6. **boundary-cohesion.test.ts is implementation-shape and R2-07/R1-06 over-kept it** (my F3 row, independently derived pre-read). Classification confirmed; see REFUTED #2 for the rationale correction.
7. **Three partial source-read shape-asserts** the Opus seat found and my Phase-1 grep missed: `test/physics/oscillator.test.ts:196,212`, `test/demo/instrument/resize-tracks.test.ts:137`, `test/demo/scenes/orbital-rotate3d.test.ts:160` — all `readFileSync` source-text asserts, verified by my re-grep. **Census amended:** shape family = 1 pure file (86L) + 3 partial arms. FLAG each at the restructure.
8. **The zone-orphan test coupling.** My own greps over `demo/` reproduce: `ScrollScene`/`parseScrollCSS`/`morphSVG`/`drawSVG`/`motionPath`/`fromStyleSheets`/`fromLiveAnimations`/`adoptRunning`/`densify`/`splitText`/`flip(` = **0 files each**; only `Draggable` (2 files). ~3.5–4.3k test LOC (scroll 800, svg 807, ingest 1027, waapi 737, parts of orchestration) are KEEP-IF-ZONE-SURVIVES — bind the test verdict to the zone decision; do not let them survive as orphaned green. (Confirmed on disk-evidence alone; no other seat's report read.)
9. **The MR quartet is the missing enforcement, not contrivance — LAND** (each defect class live on master, my F1/F2).
10. **The still-live contrivance residue** (taxonomy.json, 2 orphan `.measure.test.ts`, 2 orphan `.mjs`, probe-webkit, gc arm, it.fails, owner-golden pretense) — each verified present by me.
11. **No material duplication in the library suite** — my probes of the same suspect pairs agree (documented distinct facets; tranche-prefix naming accretion is cosmetic).
12. **The minimal honest gate set is subtraction + wiring, not construction** — convergent conclusion.

**OPUS-REFUTED (3)** — tested and wrong:
1. **GS-04 "the depcruise comment cites a known-violations baseline file that does not exist — fix the comment" (Opus §2 lint row + §6.9).** WRONG at the Opus seat's own pin: `.dependency-cruiser.cjs:126-131` reads *"There is NO known-violations baseline: the historical `.dependency-cruiser-known-violations.json` ratchet was never created and is not wired"* — the comment already states the truth, honestly. Disproof reproduces: `git show c2c8915f:.dependency-cruiser.cjs | grep -c "NO known-violations"` → 1. The claim was inherited from R2-07's blueprint (where GS-04 was real at the time) without reading the current file. Consequence if unrefuted: a phantom doc-fix row booked into the successor tranche.
2. **Sub-claim: boundary-cohesion is "duplicative of lint (depcruise leaf/light rules) + proof:structure R6."** False as stated: depcruise checks IMPORT EDGES and R6 checks UNUSED EXPORTS — neither enforces the no-open-coded-clamp SOURCE-TEXT invariant, which is guarded nowhere else. The import-tier half IS duplicated (boundary.mjs light/heavy + depcruise); the clamp-single-site half is not. The prune-the-file verdict can stand on shape-class grounds, but honestly: pruning LOSES the clamp-cohesion invariant unless folded into proof:structure. My disposition (F3) is the precise one.
3. **Minor count: "proof:publish (6 sub-gates)."** `gates/surface/index.mjs:17-21` orchestrates FIVE (boundary, published-surface, consume-bundle, readme-runs, agent-surface); `verify-diff.mjs` is a `--diff` mode of published-surface, not an orchestrated sub-gate. (R2-07's "4 sub-gates" is also stale — agent-surface joined the battery later.)

**OPUS-UNVERIFIABLE (2)** — neither provable nor refutable here; EXCLUDED from the union product, listed for the record:
1. "R1-06 kept boundary-cohesion **without reading it**" — process attribution about a prior lane; not provable from disk.
2. The DR-1 agent-surface llms.txt-drift catch "after the U dissolution" — no on-disk witness located this session; agent-surface.mjs's KEEP stands on battery membership regardless.

### The union product (FABLE-NEW + UNION-CONFIRMED only)

The 12 UNION-CONFIRMED rows above, plus the 7 FABLE-NEW findings from Phase 1:
- **[FABLE-NEW-1]** The two structural guards are ENFORCEMENT-FREE and always were: `git log -S depcruise -- .github/workflows/` is empty (never wired in repo history); `proof:structure` likewise; and **the staged W9 ci.yml does not add either** — the make-real wave itself misses the two cheapest real wires (2 one-line steps, each <2s). The Opus report catalogs "not in any workflow" but never elevates it to a landing item; the R1-02/R2-07 "merge spine includes lint" framing is false against every workflow that ever existed.
- **[FABLE-NEW-2]** "Nightly" is WEEKLY: `ci.yml:16` cron `17 3 * * 1` (Mondays). Every roster label overstates cadence 7×; `last-demo-green` freshness is ≤7 days. Relabel + decide the cadence deliberately.
- **[FABLE-NEW-3]** `audit:lighthouse` DEMOTE from CI (vs the Opus/R2-07 KEEP): unfailable by construction (`ci.yml:100` masked `|| echo`), zero named catches anywhere in the record — under the owner's named-catch standard it is process weight; keep the script as a local instrument, drop the 2 ci.yml steps.
- **[FABLE-NEW-4]** R2-07's GS-05 row (visual-lock PNGs) was already-vacuous when W9 staged it — the dir does not exist on the exec tree (`b920b190` records "Already absent"). Stale-inventory nuance for the successor's re-ratification.
- **[FABLE-NEW-5]** The corpus's real restructure exposure is PATH COUPLING, not assertion overfit: 57 files import `src/animation/engine` alone; the suites import internal module barrels throughout. Therefore MR4/MR2 must land BEFORE the V-next restructure (green witnesses before the import-rewrite churn) — sequencing, not just wiring. The demo-suite load-fail I hit (glass-ui uninstalled → `e-w1-encapsulation.test.ts` cannot resolve `@mkbabb/glass-ui/motion-core`) is an environment artifact AND a live demonstration that MR4 reds on the consume-edge drift class.
- **[FABLE-NEW-6]** `live-session.mjs` + `live-session-mobile.mjs` = 2,814L, 34% of the 8,204L apparatus — the maintenance mass; a dedup-carve flag (shared drive logic vs viewport), not a prune.
- **[FABLE-NEW-7]** The snapshot-theatre family is EMPTY: exactly 1 snapshot-bearing file in 130 (`characterization/stable-surfaces.test.ts`, inline-snapshot of PUBLIC compiled CSS bytes — deliberate characterization, KEEP). The addendum's presumed family does not exist on this tree.

**Final lane verdict:** the owner's presumption ("most gates and most tests are overfit
nonsense") is **REFUTED on this tree** for the corpus (~98% behavior/contract-bearing;
overfit residue ~500 LOC across 130 files) and **half-right for the apparatus** — not
because the gates assert the wrong things, but because the honest adjudication (R2-07→W9)
was never landed, two real gates were never enforced anywhere, one gate wears a `proof:`
pretense, one CI observer cannot fail, and the roster's cadence label is 7× wrong. The
successor's kf gate work is: land W9 (rebase per FOLD-FORWARD), add the 2 structural wires,
demote lighthouse, relabel the weekly roster, fold-or-lose the clamp invariant, bind the
zone tests to the zone verdicts, FLAG the 3 partial source-read asserts. Zero new gate
construction.
