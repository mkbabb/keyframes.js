# PASS-3 — Track B convergence loop, agglomeration record (step 5, pass 3)

**Date:** 2026-07-10 · **Authority:** OWNER-ASKS rows 6–7 (verbatim mandates) +
OD-U15..U21 · **Inputs:** SPEC-B3, the three Part-I close worktrees
(`worktree-wf_ca7d0632-287-{10,16,18}`), the three NEW-item prototype worktrees
(`worktree-wf_645e7d37-d7f-{11,12,13}` — P7/P8/P9), the pass-3 critique reports
(step 4), and — where a critique was void or absent (§2) — the agglomerator's own
direct verification against the trees. Prototype branches remain EVIDENCE, never
merged (OD-U18). PASS-2 rulings 9–15 were BINDING on this pass and are cited
where applied. Plain language; every term of art glossed at first use (ruling 6).

---

## 1. The cumulative convergence table (ALL items, all passes)

| Item | Pass-1 | Pass-2 | **Pass-3** | Basis (pass 3) | Status |
|---|---:|---:|---:|---|---|
| P1 — compile-easing-carve | 55% | 95% | **100%** | critique (valid; sweep independently extended to the full active tree — empty) | **EXITS (pass 3)** |
| P2 — small-module-inline-sweep | 35% | 100% | — | frozen (R15) | EXITED (pass 2) |
| P3 — claudemd-fold | 72% | 100% | — | frozen (R15) | EXITED (pass 2) |
| P4 — known-violations-fix | 95% | 96% | **100%** | critique (valid; both deliverables tree-verified, zero `eslint-disable` repo-wide, `roundtrip-easing` 8/8) | **EXITS (pass 3)** |
| P5 — demo-component-recut | 84% | 100% | — | frozen (R15) | EXITED (pass 2) |
| P6 — readme-redesign | 88% | 95% | **100%** | critique (valid; both README gates green; diff exactly 2 insertions / 2 deletions) | **EXITS (pass 3)** |
| SPEC (B1→B2→B3) | 85% | 92% | **96%** | critique (valid; every *(measured)* claim spot-checked TRUE; two substantive charter-disposition gaps + two hairlines) | iterates (errata-thin) |
| **N1 — one-component-home (P7)** | — | — | **97%** | critique (valid; born-RED independently reconstructed; the ONE gap tree-confirmed by the agglomerator at `vitest.config.ts:10`) | iterates (one-line close) |
| **N2 — meta-legacy-delete (P8)** | — | — | **82%** | critique **VOID** (placeholder — §2) → agglomerator direct verification | iterates (execution close) |
| **N3 — duplication-excise (P9)** | — | — | **85%** | critique **ABSENT** (§2) → agglomerator direct verification | iterates (execution close) |

**Overall pass-3 convergence: 96%** (mean of the ten scored items; pass 1 was
73%, pass 2 was 97% over seven). The apparent dip is arithmetic honesty, not
regression: the settled seven average **99.4%**; the three OD-U19..U21 items
entered THIS pass at their own pass-1 and already sit at 82–97 — far above the
original items' pass-1 entry (35–95). The loop iterates one more pass — pass 4
is a **close-and-execute pass**: mechanical one-liners for N1 and the spec,
real (but fully manifested) execution for N2/N3's deferred halves.

---

## 2. The two critique anomalies, adjudicated (binding)

Two of the six step-4 inputs failed the loop's own record standard (ruling 10):

- **The N2 critique was a PLACEHOLDER** (analysis: "test"; gaps: "a", "b"; a bare
  70%). **Ruled VOID — the 70% is discarded, never inherited** (R10). This is the
  SECOND consecutive pass in which one fleet critique arrived as a placeholder
  (P5 at pass 2). R10 already covers scoring; the recurrence is now a fleet-harness
  defect: **step 4's dispatcher must reject a non-self-contained critique before
  step 5 ever sees it** (ruling 19 below).
- **The N3 critique was ABSENT entirely** — P9 executed four commits of real work
  (`7b191f22` head) and received no score. VOID/absent per R10.

**The substitute basis (agglomerator, direct, against the trees):**

- **P8 (`…d7f-12`, head `af3ebbd9`):** `demo/glass-ui-gaps.ts` DELETED;
  `proof-glass-ui-gap-tripwire.mjs` (176L) + `lib/glass-caps.mjs` (194L) DELETED
  with the `proof:glass-ui-gap-tripwire` key + `ci.yml` step retired (G12,
  verified in `package.json` + `.github/workflows/ci.yml:431` narration); the 8
  workaround comments verified at their sites (incl. `App.vue:375`); blur gate
  clause (C) retired with A/B live (`proof-blur-not-resampled.mjs:112-114`
  past-tense narration — the P3-precedent allowed form); the 3 no-dead-export
  ledger rows gone (grep empty). **Independent gate re-runs:**
  `proof:no-dead-export` PASS at backlog **23** (matching the ledger's 26→23
  correction), `proof:workaround-deletion` PASS **3 GREEN over S7/S8/S9**,
  `proof:bench-taxonomy` PASS, `npm run check` exit 0. The two deleted decision
  JSONs (`leaves-externalization`, `reseat-vs-decay`) have ZERO surviving active
  readers (grep: narration-only); `docs/color-fidelity-data.json` relocated to
  `test/engine/` with **three** consumers re-pointed (the third,
  `color-fidelity-harness.mjs:35`, measured by P8 — the spec named two).
- **P9 (`…d7f-13`, head `7b191f22`):** the square trio excised —
  `useSquareDemo.ts:11-12` imports `parseCSSValueUnit`/`parseCSSColor`
  (`/parsing`) + `RGBColor`/`sampleColorRampAt`/`color2` (`/color`); `sweepHue`
  survives as ramp TOPOLOGY only (verified at `:234-251` — the mix is
  value.js oklab; the /255↔*255 CSS-scale bridge is honest glue);
  `toRGB` deleted; all four `clamp01` defs deleted (survivors are deliberate
  narration comments); `AmigaScene.vue:27` imports value.js `lerp`;
  `easingGroups.ts:7` imports `timingFunctionDescriptions`;
  `NAMED_EASING_BEZIER` survives exactly once (D1 deferred — §4/§5).
  **Independent re-runs:** `npm run check` clean; `vitest run test/demo` —
  **141/141 pass**. Zero published-surface change by construction (demo-only).

**Base-commit provenance (recorded, immaterial):** P8/P9 sit on `e0eaf863` (the
T-terminal master commit), NOT `tranche-u-dev` HEAD `12e5a583` as P9's ledger
header claims — the two trees' source planes are byte-identical (measured:
`git diff e0eaf863 12e5a583 -- src demo scripts test bench package.json` is
EMPTY; the divergence is U-docs only). No re-do; the ledger header corrects at
the P9 close (a record must state what is true — ruling 19's ethos).

---

## 3. What converged to 100 — EXITS the loop

P1, P4, P6 join P2/P3/P5 as **frozen evidence** (R15 extends: read-only from
here). All six pass-1/2 prototype worktrees are now closed.

- **P1 — the carve, closed.** Commit `e3994e0b`: exactly the three chartered
  one-liner fixes at their chartered lines (`compile/emit/index.ts:40` →
  `./view-transition`; both orchestration sites → `compile/emit/view-transition.ts`)
  + the 8th site class in `P1-REANCHOR-TEMPLATE.md` with all four R11 sub-shapes,
  the self-reference caveat, a §1.1 grep-sweep, and the P3×P1 `format.ts`
  merge-order case as sub-shape (d)'s example. The critique's extended sweep
  (full active tree, broadened pattern) found only site-class-5 self-references
  (test files naming their own paths + the `proof-vt-roundtrip` oracle constant).
  R12's block condition fully cleared.
- **P4 — the violations fix, closed.** Commit `4ffe713c`: the 3 directives
  converted to plain intent comments (repo-wide `eslint-disable` count now ZERO);
  VJ-L2 provenance unified per R13 (`package.json`'s value.js 3.1.0 as the one
  authority; `easing-registry.ts:105`, `roundtrip-easing.test.ts:28`, and the
  gate's display-only tripwire field all point at it). Only non-comment change
  is a display string; nothing can flip a gate.
- **P6 — the README, closed.** "Shared across zones" landed with the re-measured
  8-consuming-zone fact (6 HEAVY + 2 LIGHT); the barrel-blanket intro scoped to
  zone dirs + the barrel-less `internal/` leaf tier; both README gates green;
  the P6-after-P3 merge-order constraint continues to govern ratification order
  (unchanged); the drag2D sentence byte-exact to P3's.

---

## 4. What remains, and WHY

### N1 / P7 (97%) — one two-line spec close
The executed dock slice is flawless and fully verified (born-RED reconstructed
by the critique from the pre-move layout — both clauses fired verbatim; 14 gate
literals re-anchored in-commit; decomposition clause-9 conflict resolved by
narrowing with the law recorded; zero keystone leak). The ONE residue, confirmed
against the tree: **`N1-MOVE-SCRIPT.md` §①.6's doc/prose (R11 class-8) sweep
grep omits the config-file plane** — `vitest.config.ts:10`'s illustrative
comment (`demo/@/utils/kfEngine.ts`) is covered by neither §①.2 (alias-RHS edits
only) nor §①.6's grep, so at the owner-gated keystone step ① it would drift
stale. Fix: add `vite.config.ts vitest.config.ts tsconfig.json` to §①.6's sweep
path list (or name the line-10 comment in §①.2's rider). A defect in the
specification of an UN-executed future step — lighter than P1's pass-2 live
stale refs, hence 97 not 95.

### N2 / P8 (82%) — the gated decision-JSON dissolve is manifested, not executed
The charter's stage 1 (the hard half by its own ordering) is **done and
independently green**: specimen + full cascade + two principled census
corrections the spec must fold (§5 R16, §6). The trims/relocate and the ledger
(`N2-DELETION-LEDGER.md` — exemplary, with G11 corrections NAMED) are done.
What remains is the convergence bar's own words — *"the decision-JSON class
executed with every re-home named **and green**"*:

- **6 of 8 decision JSONs survive** (`soa-composite`, `color-soa`,
  `processframe-soa`, `spring-vector`, `waapi-densify`, `typed-om`). P8's ledger
  §4 defers them with an honest argument (each is a compare-gate wrapping a LIVE
  invariant; rushing risks a silent drop) and a **fully verified executable
  manifest** (every re-home target confirmed present: the `test/group/` homes,
  the `bench/taxonomy.json` `budgeted` rows, the seam prose). That manifest is
  diligence, not discharge (ruling 18): no new `test/group/` assertion was
  authored, no gate key of the five was retired, `proof:record-truth`'s
  dirty-check clause still reads two of the JSONs.
- **The R11-class trims ride the dissolve:** `group/soa.ts:8,108` and
  `bench/taxonomy.json:320`'s `$note` cite `…-decision.json` paths BY NAME —
  live today (the files exist), stale the moment the delete lands. The SPEC-B3
  critique's strongest finding ("leave it there" verbatim leaves dangling
  paths) folds here: keep the durable verdict text, trim the dead citation, in
  the same commit as each delete (R11 8th class; R12's surviving-source rule).

### N3 / P9 (85%) — three table rows deferred; D1's deferral is RATIFIED, the rest is work
Stages 1–3 are excellent and independently verified (§2): the square trio as ONE
motion with the perceptual-oklab correction and endpoints proven bit-exact; D2
consumed with TWO measured spec-premise corrections (value.js keys are ALREADY
kebab — no `hyphenToCamelCase` reconciliation exists to do; D-GAP-2 is RETIRED,
the one absent row was a dead `smooth-step3` alias); the D6/D7 named copies
excised with no wrapper. The ledger is in-tree and honest. Residues against the
charter bar ("D1–D9 executed per the table"):

- **D1 — NOT a residue after ruling 17.** P9 deferred the easings.net→CSS-spec
  curve swap to an owner-taste call, contra the spec's unilateral "EXCISE".
  The SPEC-B3 critique independently reached the same position (its gap 2: the
  S.E lesson — critic consensus ≠ owner verdict; a visible curve change on the
  gallery whose raison d'être is those curves is an owner call). **Ratified
  (R17): P9's RECORDED disposition is the correct form.** D1 joins the owner
  rides; D5's landed mid-tone delta joins the same ride as an eyeball item
  (it stays landed as evidence — endpoints bit-exact, the delta declared).
- **D6's inline sweep** (~30 `Math.max(min, Math.min(max, x))` sites) —
  chartered ("re-point every inline clamp site"), deferred. The stated reason
  (some sites are not [0,1]) does not block: value.js `clamp(x, min, max)` takes
  arbitrary bounds. Mechanical; per-site verification as chartered.
- **D8 re-base + D9 route** — chartered, not executed. P9's measurements are
  genuine and pass 4 inherits them (value.js `flattenObject` yields
  ValueUnit-valued entries where the demo consumers expect strings, and has no
  `transformKey` — so the re-base keeps the thin key-transform wrapper AND gains
  a value-stringification bridge, with the timeline export/import round-trip
  verified). They complicate the re-base; they do not refute it. Both execute
  at CURRENT-tree paths (the merge-order note covers paths, not execution).

### SPEC-B3 (96%) — errata-thin close to SPEC-B4
Every *(measured)* claim held under spot-check — the spec did not mint fresh
imprecision. Seven errata close it (nothing else — R14's logic carries):

1. **N2.1 row 5's "leave it there"** → the seam-comment trim rule (the critique's
   gap 1, now folded into P8's pass-4 order): durable verdict text stays; the
   `…-decision.json` path citation trims in the delete commit (R11/R12).
2. **D1/D5 owner-ride routing** (the critique's gap 2) → ruled at R17; the spec's
   D1 row and P9 step-6 wording amend accordingly.
3. Hairline (a): blur clauses — (A) is a structural renders-outside-filtered-
   subtree assertion; only (B) is the frozen-backdrop toggle-delta. Label fix.
4. Hairline (b): value.js 3.1.0 ships **8** subpaths (also `transform`,
   `quantize`, `root`); "exactly these" → "these five, among its eight".
5. **N2.1 row 4's "16 → 13"** → **26 → 23** (P8's G11 correction: the spec
   inherited P5's frozen-worktree backlog; the base tree carries 26).
6. **N2.1 row 2's whole-file DELETE of `proof-workaround-deletion.mjs`** → the
   S1–S4-only retire (R16; the S7–S9 premise was measured FALSE).
7. **N3.1 D2's `hyphenToCamelCase` premise** → keys already kebab; **D-GAP-2
   RETIRED**; plus P9's ledger header base-commit correction (§2).

---

## 5. Agglomerator rulings (binding on pass 4) — numbering continues from 9–15

16. **The workaround-deletion partial retire is RATIFIED** (the R9/G11 family:
    a measured refutation of a charter premise AMENDS the charter). The spec's
    "no referent once the ledger dies" premise was FALSE for arms S7–S9 — they
    key on the gate's own inline `vjsCaps` probe and guard real value.js/
    parse-that consume-seam cures against recurrence. S1–S4 + `glass-caps.mjs`
    died with the specimen; **S7–S9 + the `proof:workaround-deletion` key
    SURVIVE.** General form: a chartered DELETE whose no-referent premise fails
    measurement retires only the mooted arms, and the correction is NAMED in
    the ledger (P8 did both). No lane re-litigates.
17. **Owner-visible behavior deltas ride to the OWNER, even when "correct."**
    The S.E lesson enters the loop as law: an excision that visibly changes what
    the owner sees (D1's gallery curves; D5's palette mid-tones) is routed to
    the owner-ride queue — it is never self-adjudicated by spec assertion or
    critic consensus. The owner-ride queue is now: `demo/DESIGN.md` KEEP · the
    `@`-dissolution one-word confirm (gates N1 keystone ①) · **D1 canonicality**
    · **D5's oklab sweep (eyeball)**. P9's D1 RECORDED disposition is the
    correct form; D5 stays landed as evidence with its delta declared.
18. **A deferral with a verified manifest is diligence, not discharge.** The
    convergence bar's "executed and green" stands: P8's ledger §4 (and P9's
    D6-inline/D8/D9 paragraphs) score as residue, not as completion, however
    well-evidenced. U's no-deferral ethos applies INSIDE the loop; pass 4
    executes the manifests as written — they are now the best-verified work
    orders in the tranche.
19. **Fleet self-containment is enforced at step 4, not discovered at step 5.**
    Two consecutive passes shipped a placeholder critique (P5 at pass 2, N2
    here) and pass 3 also shipped an ABSENT one (N3). R10's scoring rule stands;
    additionally the step-4 dispatcher must reject/re-run any critique that
    fails self-containment BEFORE step 5 convenes, and every prototype ledger
    must state its ACTUAL base commit (P9's header says `12e5a583`; the tree
    says `e0eaf863` — materially empty diff, but the record states what is true).

---

## 6. Newfound context pass 4 carries (verified facts, not claims)

- **P8's census corrections, both independently confirmed:** the no-dead-export
  backlog on the base tree is 26 (→23 after the 3 glass rows die) — the spec's
  16 was P5-worktree state; `proof-workaround-deletion.mjs` runs 3 GREEN over
  S7/S8/S9 post-surgery (111 lines removed; the glass arms + `glassCaps` gone).
- **P8's relocate found a third consumer** the census missed:
  `scripts/color-fidelity-harness.mjs:35` — all three re-pointed, gate PASS.
- **P9's measured value.js facts:** `timingFunctionDescriptions` keys are kebab
  and its blurbs byte-match the demo's dead copy; `bezierPresets` covers 23/29
  demo rows (the 6 quart/quint rows = D-GAP-1/BG-8); `flattenObject` yields
  ValueUnit values and takes no `transformKey`; `Color`'s model is
  internal-normalized (no CSS-string serializer for arbitrary spaces) — the
  /255↔*255 bridge in `sweepHue` is honest glue. Two orbital-drag files import
  `clamp` from the value.js ROOT barrel — a future tidy to `/math`, not a defect.
- **The stale-citation watchlist for the N2 dissolve:** `group/soa.ts:8,108`
  (`soa-composite-decision.json`), `bench/taxonomy.json:320` `$note`
  (`spring-vector-decision.json`), `group-composite.bench.ts` prose — live now,
  trimmed in the delete commits (R11 8th class).
- P8/P9's base `e0eaf863` is source-plane-identical to `tranche-u-dev` HEAD
  `12e5a583` (measured empty diff over `src demo scripts test bench
  package.json`) — the frozen evidence composes cleanly with the wave set.
- P1's extended sweep result stands for the wave set: the only
  `compile/{backward/,entry,view-transition}` mentions in the active tree are
  test files' own names + the `proof-vt-roundtrip` oracle constant (site class
  5 — they move only if the tests move).

---

## 7. THE PASS-4 FOCUS — close and execute

**Six items are frozen (P1–P6). Four iterate. No research fan-out (step 1 is a
no-op — every residue is line-located or carries a verified in-tree manifest).**
SPEC-B3 revises to SPEC-B4 as the seven §4 errata + rulings 16–19 folded,
NOTHING else.

| Item | Mode | Pass-4 work — exhaustive |
|---|---|---|
| **N1 / P7** (`…d7f-11`) | **close** | Add the config-file plane (`vite.config.ts` · `vitest.config.ts` · `tsconfig.json`) to `N1-MOVE-SCRIPT.md` §①.6's class-8 sweep (or name `vitest.config.ts:10` in §①.2's rider). Nothing else — the executed slice is closed. |
| **N2 / P8** (`…d7f-12`) | **execute** | Run the ledger's OWN §4 executable order for the 6 gated JSONs, per JSON: ① author the re-homed `test/group/` assertion / confirm the `taxonomy.json` `budgeted` row, GREEN first; ② delete the JSON + strip the gate's write/compare (typed-om: delete the bench's `writeFileSync` block); ③ retire the emptied gate key (G12, same commit) incl. `proof:record-truth`'s dirty-check clause + the `proof-wave-charter`/`lib/portable-perf` reads; ④ trim the seam citations (§6 watchlist) under R11's 8th class; ⑤ record each re-home in ledger §1. Correct the ledger's base-commit line (R19). |
| **N3 / P9** (`…d7f-13`) | **execute** | The D6 inline sweep (~30 sites re-measured, per-site bounds verified — `clamp(x,min,max)` takes arbitrary bounds); the D8 re-base (body → `flattenObject` + string-bridge + `camelCaseToHyphen` glue; timeline export/import round-trip verified); the D9 route (`cubic-bezier` branch → `cubicBezierToSVG`). All at current-tree paths. D1/D5 do NOT execute — they ride to the owner (R17). Correct the ledger header's base commit. |
| **SPEC-B3→B4** | **errata** | The seven §4 errata + rulings 16–19 folded. Nothing else. |
| **P1 · P2 · P3 · P4 · P5 · P6** | **FROZEN** | Read-only evidence (R15). |

**Owner-ride queue (carried, updated per R17):** `demo/DESIGN.md` KEEP · the
`@`-dissolution one-word confirm (gates the ratified N1 keystone ①) · **D1
easing-curve canonicality** · **D5 oklab palette-sweep eyeball**.

---

## 8. THE TERMINATION VERDICT

**NOT TERMINATED.** Three items sit below 100 with real, chartered work
remaining (N2's six-oracle dissolve, N3's three table rows, N1's two-line spec
close) and the spec carries seven errata. Under OD-U18's exit condition — 100%
across ALL items — the loop runs **pass 4**: step 4 re-runs on the four touched
items only (self-contained critiques, enforced at dispatch per ruling 19), then
step 5 agglomerates.

At 100 across all ten, the terminal pass record writes **"## The wave-set
development order"** — the re-charter mapping the converged evidence (SPEC-B4 +
the NINE frozen prototype worktrees + the `loop/` records) onto the final U
wave set. Its shape is already visible and pass 4 should execute with it in
view, but it is NOT ratified until termination: the P2/P3/P5 patterns feed the
U.B recut and the CLAUDE.md/doc waves; P1's template + the 8th class is the
standing law for every U.C move; P7's move script (§①–⑤) IS the U-restructure
keystone wave pending the owner's `@`-confirm; P8's ledger §§1+4 and P9's
ledger §§1–3 are the meta-legacy and dogfood waves' work orders verbatim; the
owner-ride queue discharges before any owner-visible wave lands.

**Standing lessons, intact and twice-proven this pass:** score against the
charter; execute the hard half first; leave the record in-tree; verify — never
inherit — every number; and now: a manifest is not a discharge, and what the
owner can SEE, the owner rules on.
