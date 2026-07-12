# PASS-4 — Track B convergence loop, agglomeration record (step 5, pass 4)

**Date:** 2026-07-10 · **Authority:** OWNER-ASKS rows 6–7 (verbatim mandates) +
OD-U15..U21 · **Inputs:** SPEC-B4, the three iterating prototype worktrees
(`worktree-wf_645e7d37-d7f-{11,12,13}` — P7 @ `9d47916e`, P8 @ `2edf2425`,
P9 @ `0512a505`), the pass-4 critique reports (step 4), and — where a critique
was void (§2) — the agglomerator's own direct verification against the trees.
Prototype branches remain EVIDENCE, never merged (OD-U18). PASS-3 rulings 16–19
were BINDING on this pass and are cited where applied. Plain language; every
term of art glossed at first use (ruling 6).

---

## 1. The cumulative convergence table (ALL items, all passes)

| Item | Pass-1 | Pass-2 | Pass-3 | **Pass-4** | Basis (pass 4) | Status |
|---|---:|---:|---:|---:|---|---|
| P1 — compile-easing-carve | 55% | 95% | 100% | — | frozen (R15) | EXITED (pass 3) |
| P2 — small-module-inline-sweep | 35% | 100% | — | — | frozen (R15) | EXITED (pass 2) |
| P3 — claudemd-fold | 72% | 100% | — | — | frozen (R15) | EXITED (pass 2) |
| P4 — known-violations-fix | 95% | 96% | 100% | — | frozen (R15) | EXITED (pass 3) |
| P5 — demo-component-recut | 84% | 100% | — | — | frozen (R15) | EXITED (pass 2) |
| P6 — readme-redesign | 88% | 95% | 100% | — | frozen (R15) | EXITED (pass 3) |
| SPEC (B1→B2→B3→B4) | 85% | 92% | 96% | **97%** | critique **VOID** (placeholder — §2) → agglomerator direct verification (one minted hairline found: E10's subpath arithmetic; two amendment errata pend from pass-4 measurements) | iterates (errata-thin) |
| N1 — one-component-home (P7) | — | — | 97% | **90%** | critique (valid; the chartered fix landed exactly, but the residue CLASS re-measured against the tree surfaces `components.json:8,:14` — agglomerator-confirmed) | iterates (one-commit close) |
| N2 — meta-legacy-delete (P8) | — | — | 82% | **97%** | critique (valid; all six dissolves executed and independently green; ONE surviving-source docstring names the two deleted gates — agglomerator-confirmed at `proof-portable-perf.mjs:7,:103`) | iterates (comment-only close) |
| N3 — duplication-excise (P9) | — | — | 85% | **100%** | critique (valid at 97; its two holds adjudicated here: the D8/D9 refutations RATIFIED at R20 — both agglomerator-REPRODUCED; the ledger-prose hairline DISMISSED on direct reading) + agglomerator green re-runs | **EXITS (pass 4)** |

**Overall pass-4 convergence: 98.4%** (mean of the ten scored items; pass 3 was
96%). The N1 97→90 movement is measurement depth, not tree regression: P7's
tree strictly improved (the chartered fix landed byte-exact), but the pass-4
critique re-measured the residue CLASS the pass-3 score had only sampled — the
same `git grep -l 'demo/@'` run at pass 3 would have found `components.json`
then too. The score describes what is now known to be true; the pass-3 97 was
an undercount of the same defect class (§4).

---

## 2. The critique anomaly, adjudicated (binding)

**The SPEC-B4 critique was a PLACEHOLDER** (analysis: "Test parse."; gaps:
"one", "two", "three"; a bare 98%). **Ruled VOID — the 98 is discarded, never
inherited** (R10). This is the FOURTH self-containment failure in four passes
(P5 at pass 2; N2 placeholder + N3 absent at pass 3; SPEC-B4 here) and the
first AFTER ruling 19 ordered dispatcher-side rejection — R19's enforcement did
not hold (§5, ruling 22).

**The substitute basis (agglomerator, direct, against the trees):** SPEC-B4's
structure is EXACTLY the PASS-3 §7 order — the seven errata (E7–E13), rulings
16–19 folded, the three §C4 charters restated, §Q, nothing else (R14's logic
honored). Spot-checks of its *(measured)* claims: E7's watchlist facts and
E11's 26→23 ratchet were verified at pass 3 and their applied trims/re-runs
confirmed in P8's pass-4 commits; **E12's rider verified NOW** —
`proof-workaround-deletion.mjs` in P7 carries the re-anchored
`demo/app/dock/…` literals (`:296-297`, `:317-318` — all 14 dock gates
re-anchored, as the rider states); E13's kebab-key and base-commit facts
confirmed in both ledgers' landed corrections. **ONE minted imprecision found
(the exact class §Q4 warns of): E10 says value.js 3.1.0 "ships EIGHT subpaths —
also `/transform`, `/quantize`, `/root`". *(measured, installed package)*: the
`exports` table has eight ENTRIES of which SEVEN are subpaths — `./color`
`./parsing` `./math` `./easing` `./transform` `./units` `./quantize`; the
eighth entry is the root `.`, which is not a subpath, and NO `/root` subpath
exists.** The error originates in PASS-3 §4 item 4 (this loop's own record) and
was inherited — the standing lesson cuts both ways. Corrected at E15 (§7).
Score: zero substantive authoring gaps, one hairline mint, two amendment errata
pending from pass-4 measurements (E14/E16) → **97**.

---

## 3. What converged to 100 — EXITS the loop

**N3 / P9 joins P1–P6 as frozen evidence** (R15 extends: read-only from here).
Its critique was valid at 97 with two holds; both are adjudicated CLOSED here:

- **The D6 inline sweep, landed completely** (agglomerator-confirmed): ZERO
  nested `Math.max/Math.min` clamp patterns survive in `demo/`; all four
  `clamp01` definitions + the fifth `clampSweep` are gone; 43 sites across 21
  files re-pointed to value.js `clamp` via the `/math` subpath (Option A), the
  critique's bit-identity check across the bound families accepted.
- **Hold 1 — the D8/D9 charter reversal — RATIFIED at R20** (§5). P9 executed
  the chartered re-base/route as measurement probes and REFUTED both as
  false-positive duplications. The agglomerator REPRODUCED both refutations
  directly against the installed value.js:
  `flattenObject({transform:{translateX,translateY},opacity})` yields keys
  `["transform.translateX","transform.translateY","opacity"]` — the composite
  `transform` DECOMPOSES, breaking the one-valid-CSS-property contract the
  consumer's `fromKeyframes` path requires (the hand-rolled `valueOf`-leaf
  guard keeps it whole); `cubicBezierToSVG(0.4,0,0.2,1)` returns a full
  `<path d="M0 0 L0 0 …">` ELEMENT in raw un-flipped coordinates, where the
  demo binds bare path DATA to `:d` y-flipped (`1 - v`) like every sibling
  branch. Executing either as chartered would require a workaround the precept
  forbids. The KEEP-with-disposition-comment form is in-tree
  (`flattenVars.ts` doc block; `timingCurveUtils.ts:37-44`), the corrections
  are NAMED in the ledger, and the gaps book as constellation asks
  (**D-GAP-5**: no shallow/leaf-predicate `flattenObject` mode; **D-GAP-6**:
  no bare-path-data/flipped-coords bezier sampler) — the R16 form, executed
  exactly.
- **Hold 2 — the ledger mechanism-prose "muddle" — DISMISSED on direct
  reading.** `N3-EXCISION-LEDGER.md:172-175` chains
  `flattenObject → transform.translateX → (re-joined) transform-translate-x →
  the consumer's hyphenToCamelCase → transformTranslateX` — each step is
  attributed correctly (the dot-decomposition to `flattenObject`; the re-join
  to the CHARTERED separator bridge; the camelCase to the CONSUMER, never to
  `flattenObject`). The in-tree record states what is true (R19's ethos); the
  commit message's terser rendering is not surviving source (R12's
  distinction). No correction owed.
- **Greens re-run by the agglomerator:** `npm run check` exit 0 ·
  `vitest run test/demo` **141/141** · `git diff e0eaf863 -- src bench
  package.json` EMPTY (zero published-surface change by construction) · ledger
  base-commit line corrected and true (R19/E13). D1/D5 untouched beyond their
  recorded ride disposition (R17).

---

## 4. What remains, and WHY

### N1 / P7 (90%) — the residue CLASS was enumerated, not measured
The chartered pass-4 fix landed exactly and cleanly (commit `9d47916e`,
docs-only, 7 ins/2 del: `vitest.config.ts:10` named as a class-8d re-point AND
the three config files added to §①.6's sweep list; the executed dock slice
untouched per R15). The defect is that the work order's three-file enumeration
of "the config-file plane" was INHERITED, not re-measured (contra §Q7's G11
discipline). The agglomerator re-ran the measurement and confirms the critique
exactly: `git grep -l 'demo/@'` over the active tree, minus the swept planes
and the `docs/tranches/**` archive, leaves precisely TWO files outside the
widened sweep —

- **`components.json:8` and `:14`** — the shadcn-vue scaffold config, carrying
  two path-VALUED `demo/@` references (`"css": "demo/@/styles/style.css"`,
  `"components": "demo/@/components"`). Git-tracked, read by NO gate, referenced
  by NOTHING in the active tree, and `package.json` carries no shadcn
  dependency — the scaffold whose `ui/` output died at S.C3b and whose `@`
  alias-materialization is OD-U2's condemned vestige. At keystone step ① both
  paths would drift stale SILENTLY — the false-clean failure mode pass 4
  existed to eliminate. **Ruled at R21: dead scaffold; disposition = `git rm`,
  chartered in §①.1** (it rides the already-owner-gated keystone commit).
- **`.github/workflows/ci.yml:496`** — the `proof:shared-has-n-consumers`
  step-name prose ("every demo/@ module is genuinely shared"). Secondary (a
  descriptive label), but a genuine class member: it goes stale at dissolution
  and the `.github/` plane sits outside the enumerated list. It re-words in the
  keystone commit (its gate script is already in the 37-literal sweep).

The root cause is now cured as LAW, not as a fourth path appended to a list:
R21's second clause — a sweep is DEFINED BY MEASUREMENT, never enumeration.

### N2 / P8 (97%) — one surviving-source docstring, comment-only
All six gated decision-JSON dissolves are EXECUTED and independently green
(the critique re-ran the two new correctness oracles 13/13, `check` clean,
`proof:record-truth`/`proof:wave-charter`/`proof:blend` PASS; the G12
retirements and E7 watchlist trims landed in-commit; the ledger's §1 rows and
base line are true). The residue, agglomerator-confirmed in surviving source
(R12 — blocks 100): **`scripts/proof-portable-perf.mjs:7`** ("A consumer gate
(proof:soa-composite, proof:spring-vector) imports ratioGate / absoluteGate
directly") and **`:103`** ("The shape proof:spring-vector / proof:soa-composite
read from --outputJson") name the two DELETED gates in present tense. The
sweep trimmed `lib/portable-perf.mjs` but not its self-test gate. *(measured)*
The surviving importers are `scripts/proof-perf-counters.mjs` +
`scripts/lib/cdp-perf.mjs` — the fix names those instead. Borderline rider:
`proof-morphsvg-consume.mjs:60` cites "the `proof:soa-composite` precedent" —
historical pattern-narration that reconciles to the past-tense tombstone form
(the P3-precedent allowed shape). One coverage note carried, not a defect:
`proof:bench-taxonomy` was asserted-green in-commit but not independently
re-run (the two flipped `budgeted` floors hold at 4.47×/4.46× vs 1.2× per the
commit); pass 5 re-runs it once for the record.

### SPEC-B4 (97%) — three errata to SPEC-B5
E10's subpath arithmetic (§2 — the one minted hairline) + two amendments the
pass-4 measurements now require: the D8/D9 refutation-ratification fold (the
§C4 P9 row's premise was measured FALSE at execution — R20) and the
components.json/R21 fold (mirroring N1's close). Nothing else — R14's logic
carries; every other *(measured)* claim held under spot-check.

---

## 5. Agglomerator rulings (binding on pass 5) — numbering continues from 16–19

20. **The D8 re-base and D9 route are REFUTED and their KEEP dispositions
    RATIFIED** (the R16 family: a measured refutation of a charter premise
    AMENDS the charter — second and third applied instances). Both refutations
    were reproduced independently TWICE (the step-4 critique against the built
    dist; the agglomerator against the installed value.js — §3). `flattenVars`
    KEEPS its composite-preserving body; `getCurvePath`'s bezier branch KEEPS
    its flipped bare-data sampler; each carries its in-tree disposition comment
    so no pass re-hunts; **D-GAP-5 and D-GAP-6 book as value.js letter rows via
    U.F** (a gap is a library ask; only a re-implementation of SHIPPED
    functionality is a demo defect — SPEC-B3 §N3's own law). A lane's measured
    refutation is ratified at step 5, never self-certified — P9 recorded,
    pass 4 critiqued, this ruling closes the form. No lane re-litigates.
21. **`components.json` is DEAD SCAFFOLD (disposition: `git rm` at keystone
    step ①), and — the class law — a doc/prose sweep is DEFINED BY MEASUREMENT,
    not enumeration.** Every sweep clause in a move script states its
    whole-tree measurement (`git grep -l '<pattern>'` over the repo minus
    `docs/tranches/**`, the archive) and disposes of EVERY hit — swept, moved,
    deleted, or exempted BY NAME. A hardcoded path list is how both the pass-3
    AND pass-4 N1 residues were minted (G11 applied to sweeps; twice-proven).
22. **R19's dispatcher enforcement FAILED its first live test** (SPEC-B4's
    placeholder critique reached step 5 — the fourth incident in four passes).
    The rule stands and sharpens: at pass 5 (terminal), a critique failing
    self-containment re-dispatches ONCE, immediately, before step 5 convenes;
    step-5 direct verification remains the fallback of record (it worked —
    §2 — but a terminal pass must not lean on it by default).

---

## 6. Newfound context pass 5 carries (verified facts, not claims)

- **value.js 3.1.0's exports table (installed, measured):** SEVEN subpaths —
  `./color ./parsing ./math ./easing ./transform ./units ./quantize` — plus
  the root `.`; **no `/root` subpath exists.** PASS-3 §4.4 and SPEC-B4 E10's
  "eight" both mis-counted by including the root entry.
- **`components.json` (measured):** references NOTHING and is referenced by
  NOTHING in the active tree; no shadcn dependency in `package.json`; its two
  `demo/@` path values are `:8` (`css`) and `:14` (`aliases.components`).
- **The complete out-of-sweep `demo/@` carrier set** (active tree, after P7's
  widened list): exactly `components.json` + `.github/workflows/ci.yml:496`.
  Everything else is a swept plane, a P3/N2-chartered delete, or archive.
- **`portable-perf`'s measured consumer set (P8 tree):**
  `scripts/proof-perf-counters.mjs` + `scripts/lib/cdp-perf.mjs` (+ the
  self-test `proof-portable-perf.mjs` itself) — the docstring fix names these.
- **The refutation reproductions of record:** `flattenObject` →
  `["transform.translateX","transform.translateY","opacity"]`;
  `cubicBezierToSVG(0.4,0,0.2,1)` → `<path d="M0 0 L0 0 L0.0011982016 …">`
  (a full element, raw coords). Frozen as evidence with P9.
- **P9 greens at agglomeration:** `check` exit 0 · `test/demo` 141/141 ·
  zero `src`/`bench`/`package.json` diff vs base `e0eaf863`.
- **E12's rider held:** P7 re-anchored all 14 dock-literal gates including
  `proof-workaround-deletion.mjs` (`demo/app/dock/…` at `:296-297`,
  `:317-318`).

---

## 7. THE PASS-5 FOCUS — the terminal one-liner close

**Seven items are frozen (P1–P6 + N3). Two close, one revises. No research
fan-out (step 1 is a no-op — every residue is line-located with its fix stated
here). No execution work of any kind remains — pass 5 is comment/doc lines and
errata only.**

| Item | Mode | Pass-5 work — exhaustive |
|---|---|---|
| **N1 / P7** (`…d7f-11`) | **close** | Two edits to `N1-MOVE-SCRIPT.md`, nothing else: **(a)** charter `git rm components.json` in §①.1 (R21: dead scaffold; its two `demo/@` paths die with it — no re-point; rides the owner-gated keystone commit); **(b)** REDEFINE §①.6's sweep per R21 — the measured whole-tree grep (`git grep -l 'demo/@'` minus `docs/tranches/**`), every hit disposed by name — and name `.github/workflows/ci.yml:496`'s step-name prose as a class-8 re-word in the keystone commit. |
| **N2 / P8** (`…d7f-12`) | **close** | ONE comment-only commit: `proof-portable-perf.mjs:7` + `:103` re-word to the measured surviving consumers (`proof-perf-counters.mjs`, `lib/cdp-perf.mjs`); `proof-morphsvg-consume.mjs:60`'s precedent citation → past-tense tombstone form. Then ONE independent `proof:bench-taxonomy` re-run, result recorded in the ledger (discharges the flipped-floor coverage note). |
| **SPEC-B4→B5** | **errata** | THREE errata, nothing else: **E14** — the D8/D9 refutation ratification (R20) folded; the §C4 P9 row amends to KEEP-with-disposition; D-GAP-5/D-GAP-6 book as the U.F value.js letter rows. **E15** — E10 corrected: five subpaths among SEVEN (no `/root`); origin traced to PASS-3 §4.4. **E16** — R21 folded (components.json's disposition + sweep-as-measurement as standing law for every move script). |
| **N3 / P9** | **FROZEN** | EXITED at 100 (§3). Read-only evidence (R15). |
| **P1 · P2 · P3 · P4 · P5 · P6** | **FROZEN** | Read-only evidence (R15). |

**Owner-ride queue (carried, unchanged per R17/E8):** `demo/DESIGN.md` KEEP ·
the `@`-dissolution one-word confirm (gates the ratified N1 keystone step ① —
which now also carries the R21 `components.json` rm) · **D1 easing-curve
canonicality** · **D5 oklab palette-sweep eyeball**.

---

## 8. THE TERMINATION VERDICT

**NOT TERMINATED.** Two items sit below 100 with real (if one-line) defects in
surviving artifacts — N1's move script would false-clean at the owner-gated
keystone (`components.json`), N2 carries a present-tense docstring naming
deleted gates — and the spec owes three errata. Under OD-U18's exit condition —
100% across ALL items — the loop runs **pass 5**: step 4 re-runs on the three
touched items only (self-containment enforced at dispatch, ruling 22's
sharpened form), then step 5 agglomerates. Pass 5 contains ZERO execution work;
it is the loop's smallest possible pass, and the agglomerator does not shortcut
it — uncritiqued self-fixed work scored at 100 by its own fixer is the exact
failure mode this loop exists to prevent.

At 100 across all ten, the terminal pass record writes **"## The wave-set
development order."** Its shape is settled and pass 5 executes with it in view
(NOT ratified until termination): the P2/P3/P5 patterns feed the U.B recut and
the CLAUDE.md/doc waves; P1's template + the 8th class + R21's
sweep-as-measurement are the standing law for every U.C move; P7's move script
(§①–⑤) IS the U-restructure keystone wave, gated on the owner's `@`-confirm
and now carrying the `components.json` rm; P8's ledger §§1+4 is the meta-legacy
wave's work order verbatim (all six dissolves already executed as evidence);
P9's ledger §§1–3 + the R20 dispositions are the dogfood wave's work order,
with D-GAP-1/5/6 as the U.F value.js letter rows; the owner-ride queue
discharges before any owner-visible wave lands.

**Standing lessons, intact and again twice-proven this pass:** score against
the charter; execute the hard half first; leave the record in-tree; verify —
never inherit — every number (E10 shows the loop's own records are not exempt);
a manifest is not a discharge; what the owner can SEE, the owner rules on; and
now: a sweep is a measurement, not a list.
