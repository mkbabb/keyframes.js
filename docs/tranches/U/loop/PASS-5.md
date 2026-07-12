# PASS-5 — Track B convergence loop, TERMINAL agglomeration record (step 5, pass 5)

**Date:** 2026-07-10 · **Authority:** OWNER-ASKS rows 6–7 (verbatim mandates) +
OD-U15..U21; the binding work order was PASS-4 §7 (executed completely, and
nothing else) · **Inputs:** SPEC-B5, the two pass-5 close commits
(`worktree-wf_645e7d37-d7f-11` N1 @ `3ab43987`; `worktree-wf_645e7d37-d7f-12`
N2 @ `03ec6758`; `worktree-wf_645e7d37-d7f-13` N3 frozen @ `0512a505`), the two
pass-5 critique reports (N1, N2 — both valid and self-contained), and — the
SPEC-B5 critique being ABSENT (§2) — the agglomerator's own direct verification
of all three errata against the trees and the installed packages (R10).
Prototype branches remain EVIDENCE, never merged (OD-U18). PASS-4 rulings 20–22
were BINDING on this pass and are cited where applied. Plain language; every
term of art glossed at first use (ruling 6).

**A count correction, applied before use (the E10/E15 discipline — verify,
never inherit, every number):** the evidence set is **NINE frozen worktrees
carrying the TEN scored items** — `wf_ca7d0632-287-{10,11,12,16,17,18}` =
P1–P6 in that order (verified by head-commit subject per tree) and
`wf_645e7d37-d7f-{11,12,13}` = P7/N1 · P8/N2 · P9/N3; the SPEC iterates as a
document, not a worktree. PASS-3 §"terminal shape" said NINE correctly; the
pass-5 dispatch prompt said "ten worktrees" — a conflation with the ten items,
corrected here.

---

## 1. THE FINAL CUMULATIVE TABLE (all items, all passes)

| Item | Pass-1 | Pass-2 | Pass-3 | Pass-4 | **Pass-5** | Basis (pass 5) | Terminal status |
|---|---:|---:|---:|---:|---:|---|---|
| P1 — compile-easing-carve (U.C8) | 55% | 95% | 100% | — | **100** | frozen (R15) | **EXITED (pass 3)** — evidence @ `287-10` |
| P2 — small-module-inline-sweep (OD-U16) | 35% | 100% | — | — | **100** | frozen (R15) | **EXITED (pass 2)** — evidence @ `287-11` |
| P3 — claudemd-fold (OD-U15/U.E7) | 72% | 100% | — | — | **100** | frozen (R15) | **EXITED (pass 2)** — evidence @ `287-12` |
| P4 — known-violations-fix (OD-U17/U.E8) | 95% | 96% | 100% | — | **100** | frozen (R15) | **EXITED (pass 3)** — evidence @ `287-16` |
| P5 — demo-component-recut (U.B) | 84% | 100% | — | — | **100** | frozen (R15) | **EXITED (pass 2)** — evidence @ `287-17` |
| P6 — readme-redesign | 88% | 95% | 100% | — | **100** | frozen (R15) | **EXITED (pass 3)** — evidence @ `287-18` |
| SPEC (B1→B2→B3→B4→**B5**) | 85% | 92% | 96% | 97% | **100** | critique ABSENT → **agglomerator direct verification of all three errata (§2)** — E14/E15/E16 each reproduced against the installed value.js, the trees, and the manifests; errata-only-in-totality confirmed; zero fresh imprecision found | **EXITS (pass 5)** — SPEC-B5 is the governing spec |
| N1 — one-component-home (P7, OD-U19) | — | — | 97% | 90% | **100** | critique (valid, 100; every freshly-minted number independently reproduced by the critic) + agglomerator re-verification (§2): both ordered edits in-tree at `3ab43987`, 1 file, 43 ins/4 del; the 72-file measurement reproduced; `components.json` consumerless confirmed | **EXITS (pass 5)** — evidence @ `d7f-11` |
| N2 — meta-legacy-delete (P8, OD-U20) | — | — | 82% | 97% | **88** | critique (valid, 88; the ordered close executed EXACTLY — 3 files, comment/doc-only, all three named cures in-tree) — but the residue CLASS re-measured per R21 survives in surviving source; agglomerator-reproduced (§4); the flipped-floor coverage note DISCHARGED by an independent agglomerator re-run (§2) | **CLOSES BY CHARTER (ruling 23)** — evidence @ `d7f-12`; residue = one measured sweep clause in the meta-legacy wave |
| N3 — duplication-excise (P9, OD-U21) | — | — | 85% | 100% | **100** | frozen (R15) | **EXITED (pass 4)** — evidence @ `d7f-13` |

**Overall pass-5 convergence: 98.8%** (mean of the ten; pass 4 was 98.4%).
Nine of ten items stand at 100. The one non-100 is N2, whose defect is a
line-located, disposition-named comment/prose class in surviving source — fully
measured in §4 and chartered into the wave order (§7) under ruling 23.

---

## 2. The verification record (what THIS agglomerator reproduced — nothing inherited)

**The SPEC-B5 critique never arrived** — the pass-5 dispatch carried critiques
for N1 and N2 only. This is the FIFTH self-containment/coverage incident in
five passes (P5 pass 2; N2 placeholder + N3 absent pass 3; SPEC-B4 placeholder
pass 4; SPEC-B5 absent here), and ruling 22's sharpened re-dispatch did not
reach this agglomeration. Per R10 (a placeholder/missing critique is VOID —
never trusted, never inherited), the fallback of record ran: **direct
verification of all three errata.**

- **E14 (D8/D9 refutations ratified — R20 folded).** Both refutations
  reproduced a THIRD independent time, against the installed value.js 3.1.0
  from the main tree: `flattenObject({transform:{translateX,translateY},opacity})`
  → keys `["transform.translateX","transform.translateY","opacity"]` (the
  composite `transform` DECOMPOSES — byte-identical to the frozen reproduction
  of record); `cubicBezierToSVG(0.4,0,0.2,1)` → a full
  `<path d="M0 0 L0 0 L0.0011982016 …">` ELEMENT in raw un-flipped coordinates
  (byte-identical prefix to the record). Both KEEP-with-disposition comments
  verified in-tree at `d7f-13`: the `flattenVars.ts` doc block (names the
  leaf-predicate decomposition + D-GAP-5) and `timingCurveUtils.ts:37-44`
  (names the element-vs-bare-data + y-flip mismatch + D-GAP-6). The "letter-row
  set in full = D-GAP-1 + D-GAP-5 + D-GAP-6" claim checked for undercount:
  D-GAP-2 retired (E13), D-GAP-3 AND D-GAP-4 are settled accepted-demo-glue
  (SPEC-B3 D10 row + N3 ledger §4) — correctly not letter rows. No mint.
- **E15 (subpath arithmetic).** `node_modules/@mkbabb/value.js/package.json`
  (version 3.1.0) read directly: the `exports` table has EIGHT entries —
  `.` `./color` `./parsing` `./math` `./easing` `./transform` `./units`
  `./quantize` — of which **SEVEN are subpaths**; the eighth is the root `.`;
  **no `/root` subpath exists**. E15's correction ("these five, among its
  SEVEN"; the two beyond the original five = `/transform` + `/quantize`) is
  exact; 5+2=7 checks.
- **E16 (R21 folded).** `components.json` read directly in the main tree: `:8`
  is `"css": "demo/@/styles/style.css"`, `:14` is
  `"components": "demo/@/components"` — exact. Consumers:
  `git grep components.json` (excluding the archive) → EMPTY; `package.json`
  carries no shadcn dependency. The `git rm` charter verified in-tree at
  `d7f-11` (§①.1, the R21 rationale + "rides THIS owner-gated keystone
  commit"). The §①.6 redefinition verified: the measured grep
  (`git grep -l 'demo/@' -- . ':(exclude)docs/tranches/**'`) **reproduced by
  this agglomerator = 72 files**, the six disposition buckets sum
  38+16+3+1+5+9=72, and `.github/workflows/ci.yml:496` is exactly the
  `proof:shared-has-n-consumers` step-name prose, named as a class-8 re-word.
- **Errata-only-in-totality.** SPEC-B5 contains the supersession header, §E
  (E14–E16), and the carried exit-condition/owner-ride footer — nothing else;
  it amends the library/demo ruling tables NOWHERE; the owner-ride queue is
  carried verbatim (R17/E8). Confirmed by direct reading. **SPEC-B5 = 100.**

**N1 (spot-verified on top of a valid 100-critique):** close commit `3ab43987`
touched ONLY `docs/tranches/U/loop/N1-MOVE-SCRIPT.md` (43 ins/4 del); the
`git rm components.json` charter sits in §①.1 (L78); the R21 sweep
redefinition in §①.6 (L216); the 72-file count reproduced fresh.

**N2 (verified on top of a valid 88-critique):** close commit `03ec6758`
touched exactly `proof-portable-perf.mjs` + `proof-morphsvg-consume.mjs` +
`N2-DELETION-LEDGER.md`, comment/doc-only. The three ordered cures are in-tree
(header `:5-8` and fixture comment `:103-105` now name
`proof:perf-counters` + `lib/cdp-perf.mjs` / `ratioGateValue`;
`proof-morphsvg-consume.mjs:61` reads "since-retired `proof:soa-composite`
gate established" — the past-tense tombstone form). Both deleted gate scripts
confirmed ABSENT; both `package.json` keys gone. **The coverage note is now
DISCHARGED:** this agglomerator re-ran `npm run proof:bench-taxonomy` in
`d7f-12` independently — **PASS, exit 0, 86 cases covered, every budgeted
floor held**, including the two U.N2 flipped floors: `add SoA · K=8` at
2,451,354.9 hz vs a 595,440.8 hz floor (≈4.94× the boxed baseline vs the 1.2×
floor) and `weighted SoA · K=8` at 2,214,506.1 hz vs 591,389.3 hz (≈4.49×).
The residue that holds N2 below 100 is §4.

**One critique-precision adjudication (changes no disposition):** the N1
critique's non-blocking gap called `demo/app/main.ts:25` "a THIRD out-of-sweep
carrier" contradicting PASS-4 §6's "exactly two". Adjudicated by reading the
PRE-close §①.6 (`3ab43987~1`): the old verification grep enumerated
`src/ demo/ scripts/ test/ bench/ …` — `demo/app/main.ts` was therefore
**inside the old sweep's search space** (PASS-4 §6's "exactly two"
out-of-SWEEP carriers — `components.json` + `ci.yml`, both outside the grep
paths — holds under its stated definition, and E16 carries no stale fact).
The critique's substantive point survives in corrected form: `main.ts:25` was
in-sweep-space but **un-disposed** — no old disposition bucket named it — and
the R21 measurement-defined sweep now disposes it by name (class-8d). The
distinction (search space vs disposition list) is exactly why R21 demands
every hit be disposed BY NAME, not merely grepped over.

---

## 3. What exits this pass

- **SPEC-B5 = 100.** All three errata verified directly (§2); zero fresh
  imprecision; the canonical chain (B1 §2/§3 as amended by B2, E7–E16, rulings
  16–21 folded) is the governing spec for the wave order in §7.
- **N1/P7 = 100.** Both ordered edits landed byte-exact against the measured
  carrier set; the move script is now measurement-defined end-to-end and
  serves as the U-restructure keystone wave order (§7). Frozen evidence with
  P1–P6 + N3 (R15 extends: read-only from here).

---

## 4. The honest residue — N2 at 88, measured in full (R21 applied)

The pass-5 order was executed exactly; the defect is that the PASS-4 §4 N2
census ENUMERATED the residue (two docstrings) instead of MEASURING the class
(the same G11/R21 failure N1 was docked for one pass earlier — this record
runs the sweep the census owed). The class: surviving-source references naming
the two N2-DELETED gates (`proof-soa-composite.mjs`, `proof-spring-vector.mjs`)
in present tense. The whole-tree measurement
(`git grep -nE 'proof:soa-composite|proof:spring-vector|proof-(spring-vector|soa-composite)\.mjs' -- scripts src test bench package.json`,
archive excluded), **every hit disposed by name**:

| Hit | Adjudication | Disposition (chartered — §7, meta-legacy wave) |
|---|---|---|
| `scripts/proof-portable-perf.mjs:419` — "The existing gates (proof-spring-vector.mjs, …) are" | **RESIDUE** (present tense, names a deleted gate as existing) | re-word to the surviving gate set (`proof-bench-taxonomy.mjs`) |
| `scripts/proof-portable-perf.mjs:426` — live `KNOWN_PRIOR_ART` Set entry `"proof-spring-vector.mjs"` | **RESIDUE — CODE** (behaviorally inert: the lint never matches a deleted file; but a comment-only commit could not remove it — the pass-4 order under-specified) | delete the Set entry (one-line code change; lint output unchanged by construction) |
| `scripts/proof-portable-perf.mjs:455` — "proof-spring-vector.mjs is excluded from the lint, tracked for S3 refactor" | **RESIDUE** (present tense) | re-word/delete with `:426` |
| `bench/taxonomy.json:393` — "the ratio gate proof:soa-composite owns the HARD predicate" | **RESIDUE** (present tense; contrast `:401`/`:439`, correctly "retired") | re-word to the retired form (the floor now lives in this same manifest's budgeted rows) |
| `src/animation/group/soa.ts:24` — "so `proof:soa-composite`'s `soa-path-taken` monkey-patch … still bites" | **RESIDUE** (present tense; the oracle now lives in `test/group/soa-composite-identity.test.ts`) | re-attribute to the re-homed test |
| `src/animation/group/soa.ts:46` — "proof:zero-alloc + proof:soa-composite green" | **RESIDUE** (present tense "green" for a deleted gate) | drop the deleted gate's name |
| `src/animation/group/compositor.ts:13` — "proof:soa-composite's `soa-path-taken` source clause all grep THIS module" | **RESIDUE** (present tense — nothing greps it anymore) | re-attribute to the surviving anchors (proof:blend / proof:spring-blend-weight) + the re-homed test |
| `src/animation/physics/spring/progress.ts:389` — "(ADOPT @ K=8, `proof:spring-vector`)" | **BORDERLINE** — historical ADOPT attribution ("the W122 probe measured"), reconciles to the tombstone form but lacks the retired marker | add the retired marker in the same sweep |
| `bench/group-composite.bench.ts:34` ("the former") · `bench/taxonomy.json:320` ("dissolved") · `:401`/`:431`/`:439` ("retired") · `proof-morphsvg-consume.mjs:61` ("since-retired") · `test/group/soa-composite-identity.test.ts:5,:97` (the re-home itself) · `test/physics/spring.test.ts:292` ("probe measured", past) | **TOMBSTONE — allowed shape** | none (the P3-precedent past-tense form) |

Also confirmed with the critique: the ledger's affirmative "The one
surviving-source residue … CURED" (`N2-DELETION-LEDGER.md:238`) asserts a
completeness it does not have — it was not "the one". The ledger correction
rides the same chartered sweep. **Nothing else about N2 is open**: all six
dissolves executed and green, the oracle re-homes live, the bench floors
independently re-verified (§2).

---

## 5. Agglomerator rulings (terminal) — numbering continues from 20–22

23. **A terminal pass closes measured residue by CHARTER, never by re-score.**
    N2's residue class — measured in full, every hit disposed by name (§4) —
    graduates from loop work to WAVE work: the §4 table is a verbatim clause of
    the meta-legacy wave's work order (§7), and U.Z's certifying sweep re-runs
    the §4 grep on the terminal tree as its closing witness. A pass 6 would
    re-run the full loop to cure eight comment lines whose fixes are already
    stated to the line — zero new information; the loop's own
    smallest-possible-pass logic bottoms out here. What a terminal pass may
    NOT do is score the residue away: N2 stands at 88 in the final table, and
    the 100 it lacks is earned at impl, witnessed at U.Z.
24. **In-sweep-space ≠ disposed** (the §2 adjudication, made law for every
    wave sweep): a grep whose paths cover a file has not DISPOSED of it. R21's
    by-name clause is the operative half — the U.Z closing sweeps verify
    per-hit dispositions, not empty-grep-after-exemptions alone.
25. **The self-containment pathology is a LOOP-PROCESS fact, five-for-five**
    (P5 pass 2; N2 + N3 pass 3; SPEC-B4 pass 4; SPEC-B5 absent here), and
    R19/R22's dispatcher-side enforcement never held once. Carried into U.L's
    methodology record for the impl drive: every critique fleet dispatch gets
    an ARRIVAL check before step 5 convenes, and the step-5 agent budgets
    direct verification as the DEFAULT for at least one item per pass, not the
    fallback. R10 (verify, never trust a missing critic) remains the floor —
    it carried this terminal pass.

---

## 6. THE TERMINATION VERDICT

**TERMINATED — with the residue recorded honestly, not scored away.** Nine of
ten items stand at 100 (P1–P6, N1, N3, SPEC-B5). N2 stands at **88**: its
pass-5 order was executed exactly, its dissolves are green and independently verified,
and its remaining defect is the §4 comment/prose class — fully measured,
line-located, disposition-named, and chartered into the meta-legacy wave under
ruling 23, with U.Z's certifying sweep as the closing witness. OD-U18's 100%
exit condition is met in the only form that does not corrupt the record: the
convergence LOOP terminates (no further pass can mint information the record
does not already carry), and the un-earned 12 points convert to chartered,
witnessed impl work rather than a terminal-pass self-certification — the exact
failure mode (an agglomerator scoring its own closure at 100) this loop
existed to prevent. The wave-set development order below is hereby RATIFIED
(PASS-4 §8's settled shape, executed).

**The loop's yield, in one line each:** nine frozen evidence worktrees; a
governing spec (SPEC-B5 over the B1→B4 chain) with 16 errata all measured;
25 binding rulings; four work-order artifacts (`N1-MOVE-SCRIPT.md`,
`N2-DELETION-LEDGER.md`, `N3-EXCISION-LEDGER.md`, `P3-FOLD-MAP.md`); two
constellation gap rows booked; and a four-item owner-ride queue, intact.

---

## The wave-set development order

**How SPEC-B5 + the nine frozen evidence worktrees re-charter the U waves.**
Binding on the impl drive (which remains NOT authorized until the owner says
so — U.md ring-fence 4). Sequencing respects the U.md §3 DAG; "absorbs" means
the wave's work order IS the named evidence artifact, executed from the frozen
worktree's record, not re-derived.

**0 — Standing law, active in EVERY wave below (no sequencing).**
P1's re-anchor template + the 8th site class (R11) governs every move in U.B
and U.C; **R21 sweep-as-measurement + ruling 24's by-name clause** governs
every sweep in every move script; R16/R20 (a measured refutation AMENDS the
charter, ratified at step 5) governs every wave that meets a false premise;
the fold-map zero-loss discipline (OD-U1, P3/P8's form) governs every
deletion. Ruling 25's arrival-check rides U.L's methodology record.

**1 — The owner-ride queue discharges FIRST (before any owner-visible wave
lands; carried verbatim per R17/E8):**
(i) `demo/DESIGN.md` **KEEP** — feeds U.G's codex promotion;
(ii) **the `@`-dissolution ONE-WORD CONFIRM** — gates keystone step ① below;
(iii) **D1 easing-curve canonicality** (`NAMED_EASING_BEZIER` — owner-taste,
N3 ledger §3 D1);
(iv) **D5 oklab palette-sweep eyeball** (the D5 hue-sweep excision's visual
sign-off, N3 ledger §2 D5).

**2 — U.H (the characterization net) — unchanged, BEFORE any move** (U.md
DAG). No loop item absorbs into it; the keystone may not land before it.

**3 — THE KEYSTONE WAVE (U.B first move, OD-U2/OD-U19): P7's
`N1-MOVE-SCRIPT.md` §①–⑤ IS the wave order, verbatim** (absorbs N1 @ 100,
evidence `d7f-11` @ `3ab43987`):
step ① owner-gated on (ii) — dissolve `demo/@/` + `custom/` + the riders +
**`git rm components.json`** (R21/E16) + the six-bucket 72-file measured sweep
(re-measured in-commit, G11) + the `ci.yml:496` step-name re-word; step ② the
dock re-home (already EXECUTED as evidence — P7 `9c257575` — replays from the
manifest); step ③ singleton re-homes; step ④ the interior recut (owner-gated
point 2); step ⑤ `demo/CLAUDE.md` deletes LAST (couples to wave 6 below). The
~34-gate re-anchor pass is co-scheduled per U.md §3.

**4 — The U.B recut waves (after the keystone):** P5's responsibility-recut
pattern (evidence `287-17` — actuation hoisted to the host, options form
purified, the Channel-lexicon naming rule from its pass-2 close) is the
TEMPLATE for the transport/editors/scenes recut waves (transport's 15 private
composables into their owners; editors on ONE keyframe-authoring core; the
scene-facet loading model OD-U12); P2's demo half (evidence `287-11`'s
fold-map + the G3/G9 per-target adjudication form) becomes the **NEW
small-module-inline wave** (OD-U16's inline direction, U.B+U.C paired) — cut
target-by-target from the P2 fold-map, never as a bulk sweep.

**5 — The U.C library waves:** P1 absorbs into **U.C8** (the compile/easing
carve — evidence `287-10`, the template proven on its hard case at pass 3);
the remaining U.C carves (U.C7, the spring/solver + emit carves, the surface
collapse, the OD-U14 compositor re-charter U.C3/U.C14/U.C15/U.C16) each
execute under P1's template + standing law 0; P2's library constants fold
(byte-clean at `287-11`) rides the constants wave.

**6 — The U.E waves:** P3 = **U.E7's work order** (OD-U15 CLAUDE.md total
removal: redistribute → re-home readers → delete-last, with the fold-map —
evidence `287-12` + `P3-FOLD-MAP.md`); P6 = the README/doc wave (the re-home
half — evidence `287-18`, both README gates green); P4 = **U.E8's work order**
(OD-U17 suppression-dies-by-fixing — evidence `287-16`, the archetype: baseline
deleted, lint strictly stricter, planted violations red).

**7 — THE META-LEGACY WAVE (U.A/U.E): P8's `N2-DELETION-LEDGER.md` §§1+4
verbatim + the §4 residue clause of THIS record (ruling 23).** All six gated
decision-JSON dissolves are already EXECUTED as evidence (`d7f-12`, oracles
re-homed to vitest, independently green twice — the critique's 13/13 and this
record's bench-taxonomy PASS); the wave replays them from the ledger, then
executes the §4 table (eight hits, disposed by name — including the one
one-line CODE deletion at `proof-portable-perf.mjs:426` and the ledger's own
completeness-claim correction) and closes with the §4 grep run empty-or-
tombstone-only. **This clause is N2's missing 12 points; U.Z witnesses it.**

**8 — THE DOGFOOD WAVE: P9's `N3-EXCISION-LEDGER.md` §§1–3 + the R20
dispositions verbatim** (absorbs N3 @ 100, evidence `d7f-13`): the D2–D7
excisions (clamp class complete, 43 sites on value.js `/math`), the D8/D9
KEEPs with their in-tree disposition comments (nothing re-hunts them), D1 held
for owner ride (i)/(iii), D10/D-GAP-3/D-GAP-4 stay accepted demo glue.

**9 — U.F (constellation): the value.js letter rows are, in full, D-GAP-1 +
D-GAP-5 + D-GAP-6** (E14: the quart/quint `bezierPresets` gap; the
shallow/leaf-predicate `flattenObject` mode; the bare-path-data/flipped-coords
bezier sampler) — booked in `KF-TO-VALUEJS-U.md`, consume-edge only
(ring-fence 1). E15's seven-subpath table is the transposition's ground truth.

**10 — U.Z (the close):** the certifying sweep re-runs EVERY measured sweep
this loop minted — the §①.6 72-file grep (expect: the 9 provenance files
only), the §4 residue grep (expect: tombstones only), P3's fold-map witnesses,
P4's stricter-lint red-on-plant — on the terminal tree; N2's chartered clause
is DONE only when that witness is green. Zero open deferrals; the 5.3.0 cut
per OD-U8.

**Impl sequencing in one line:** owner-ride queue → U.H → keystone (①,
owner-gated) → B/C recuts + carves with co-scheduled re-anchors (A's deletions
first where a gate would re-anchor twice) → meta-legacy + dogfood waves ride
the same passes → D after C settles the hot paths → F letters from day 1 →
G codex early → E terminal adjudication → U.Z.

---

**Standing lessons, final form (five passes, each proven at least twice):**
score against the charter; execute the hard half first; leave the record
in-tree; verify — never inherit — every number (the loop's own records
included: E10, E15, and this record's worktree count); a manifest is not a
discharge; what the owner can SEE, the owner rules on; a sweep is a
measurement, not a list — and its hits are disposed BY NAME; a missing critic
is never trusted (R10 carried the terminal pass); and a terminal close
charters its residue — it never scores it away.
