# SPEC-B4 — Track B convergence loop, pass 4: THE TERMINAL CLOSE SPECIFICATION

> **SUPERSESSION: SPEC-B4 REPLACES SPEC-B3.** This revision is **ERRATA-THIN in
> totality** — PASS-3 §7, binding (R14's logic carries whole): EXACTLY the seven
> PASS-3 §4 errata (E7–E13 below) + rulings 16–19 folded as standing law + the
> three pass-4 close/execute charters restated from PASS-3 §7. **NO re-synthesis
> of any converged section.** Where this document is silent, SPEC-B3's text
> governs unchanged (and through it SPEC-B2 and SPEC-B1 — the canonical chain of
> SPEC-B3 E5 holds: the library ruling table is SPEC-B1 §2 as amended by
> SPEC-B2 §2; the demo table SPEC-B1 §3 as amended by SPEC-B2 §3; **SPEC-B4
> amends those tables NOWHERE**).
>
> Step 2 (synthesis) of the owner 5-step loop — OWNER-ASKS rows 6–7;
> OD-U15..U21. Pass 4 is the loop's **close-and-execute pass**: six items are
> frozen evidence (P1–P6, R15), four iterate (N1/N2/N3 + this spec). Step 1
> (research) is a NO-OP this pass — every residue is line-located or carries a
> verified in-tree manifest (PASS-3 §7). Plain language throughout; terms of art
> glossed at first use (ruling 6). Every count below marked *(measured)* was
> verified against the trees at PASS-3 agglomeration time — never inherited.

Sections: **§E** — the seven errata over SPEC-B3 (E7–E13) · **§R** — rulings
16–19 folded as standing law · **§C4** — the three pass-4 charters (P7 close;
P8/P9 execute; P1–P6 frozen) · **§Q** — questions for the pass-4 critique
fleet · the exit condition.

---

## §E — The seven errata over SPEC-B3 (numbering continues from E1–E6)

Each erratum states the defective SPEC-B3 text, the verified fact, and the
corrected reading. These are the ONLY amendments to SPEC-B3's settled surface.

**E7 — N2.1 row 5's "leave it there" → the seam-comment trim rule.**
SPEC-B3 §N2.1 row 5 says each decision JSON's frozen design verdict "ALREADY
lives as a code comment at its seam … — leave it there." Taken verbatim, that
leaves dangling paths: *(measured)* `src/animation/group/soa.ts:8,108` and
`bench/taxonomy.json:320`'s `$note` cite `…-decision.json` file paths BY NAME —
live today (the files exist), stale the moment the deletes land. Corrected
reading (the SPEC-B3 critique's strongest finding, folded into P8's pass-4
order): **the durable verdict TEXT stays; the dead `…-decision.json` path
citation TRIMS in the same commit as each delete** (R11's 8th doc/prose class;
R12's surviving-source rule — a stale mention in surviving source blocks 100).
The stale-citation watchlist *(measured, PASS-3 §6)*: `group/soa.ts:8,108`
(`soa-composite-decision.json`), `bench/taxonomy.json:320` `$note`
(`spring-vector-decision.json`), `bench/group-composite.bench.ts` prose.

**E8 — D1/D5 owner-ride routing (ruled at R17: they do NOT execute).**
SPEC-B3 §N3.1's D1 row orders a unilateral "EXCISE" with a self-adjudicated
canonicality ruling, and §N3.2 step 6 has the D1/D5 visual deltas merely
"eyeballed and recorded" by the prototype. Both amend per R17 (the S.E lesson
as law — critic consensus ≠ owner verdict): **D1 and D5 are RATIFIED OWNER
RIDES, not pass-4 work.** The D1 row's verdict becomes **OWNER RIDE (R17)** —
the easings.net→CSS-spec curve swap on the gallery whose raison d'être is those
curves executes only on the owner's canonicality call; P9's RECORDED
disposition is the correct form. D5's landed mid-tone delta STAYS as evidence
(endpoints proven bit-exact, the delta declared) and joins the same ride as an
eyeball item. The owner-ride queue is now, in full: `demo/DESIGN.md` KEEP · the
`@`-dissolution one-word confirm (gates the ratified N1 keystone step ①) ·
**D1 easing-curve canonicality** · **D5 oklab palette-sweep eyeball**.

**E9 — the blur A/B clause labels (hairline).** SPEC-B3 §N2.1 row 3 describes
the surviving `proof-blur-not-resampled.mjs` clauses as "A/B — the actual
frozen-backdrop probes." Label fix: *(measured)* **(A) is a structural
renders-outside-filtered-subtree assertion; only (B) is the frozen-backdrop
toggle-delta probe.** Substance unchanged: A and B SURVIVE live; clause (C) —
the `LEDGER = demo/glass-ui-gaps.ts` read — retired with the specimen (done at
P8, past-tense narration in the P3-precedent allowed form at `:112-114`).

**E10 — the value.js subpath wording (hairline).** SPEC-B3 §N3's entry ruling
says installed value.js 3.1.0 "ships exactly these" five subpath exports
(`/math`, `/color`, `/units`, `/parsing`, `/easing`). *(measured)* 3.1.0 ships
**EIGHT** subpaths — also `/transform`, `/quantize`, `/root`. Corrected
wording: "**these five, among its eight**." The entry ruling's substance
(Option A — demo excisions import value.js subpaths directly; zero kf
pass-through re-exports) is unchanged.

**E11 — N2.1 row 4's ratchet arithmetic: 16 → 13 becomes 26 → 23.**
SPEC-B3's "backlog 16 → 13" inherited P5's frozen-WORKTREE backlog state.
*(measured — P8's G11 correction, independently confirmed at PASS-3 §6)*: the
base tree's `proof:no-dead-export` backlog is **26**, → **23** after the 3
glass rows (`GlassCapKey`/`GlassUiGap`/`GlassUiGapId`) die. Gate re-run PASS at
23. Corrected wherever cited.

**E12 — N2.1 row 2's whole-file DELETE of `proof-workaround-deletion.mjs` →
the S1–S4-only retire (R16).** The row's premise — "no referent once the
ledger dies" — was measured FALSE for arms S7–S9: they key on the gate's own
inline `vjsCaps` probe and guard real value.js/parse-that consume-seam cures
against recurrence. Corrected per R16: **S1–S4 + `scripts/lib/glass-caps.mjs`
died with the specimen; S7–S9 + the `proof:workaround-deletion` gate key
SURVIVE** *(measured: 111 lines removed; the gate runs 3 GREEN over S7/S8/S9
post-surgery)*. Rider: SPEC-B3 §N1.3's dock-gate parenthetical ("the last
[workaround-deletion] dies anyway at §N2") corrects with it — the gate
survives, so its `app/dock` literal re-anchors like the other 13 (P7 in fact
re-anchored all 14).

**E13 — N3.1 D2's `hyphenToCamelCase` premise; D-GAP-2 RETIRED; the P9 ledger
base-commit correction.** SPEC-B3's D2 row orders key-space reconciliation
"via the shipped `hyphenToCamelCase` (demo keys kebab; value.js may key
camelCase)". *(measured — P9)*: value.js `timingFunctionDescriptions` keys are
**ALREADY kebab** and its blurbs byte-match the demo's dead copy — **no
reconciliation exists to do**; the consume is direct. **D-GAP-2 is RETIRED**
(the one absent row was a dead `smooth-step3` alias; no value.js letter row
books for it — D-GAP-1, the quart/quint `bezierPresets` gap, still books).
Companion record correction: P9's ledger header claims base `12e5a583`; the
tree says `e0eaf863` — *(measured)* the source planes are byte-identical
(`git diff e0eaf863 12e5a583 -- src demo scripts test bench package.json` is
EMPTY; the divergence is U-docs only), so no re-do, but **the header corrects
at the P9 close** (R19: a record states what is true). P8 shares the same base;
same immateriality.

---

## §R — PASS-3 rulings 16–19, folded as standing spec law

Numbering continues from rulings 1–15 (folded into SPEC-B2/B3). Binding form
restated; full arguments in `PASS-3.md` §5.

- **R16 — the partial retire of a chartered DELETE is RATIFIED** (the R9/G11
  family: a measured refutation of a charter premise AMENDS the charter). A
  chartered DELETE whose no-referent premise fails measurement retires only the
  mooted arms, and the correction is NAMED in the ledger (P8 did both — E12 is
  the applied instance). No lane re-litigates.
- **R17 — owner-visible behavior deltas ride to the OWNER, even when
  "correct."** An excision that visibly changes what the owner sees is routed
  to the owner-ride queue — never self-adjudicated by spec assertion or critic
  consensus (the S.E lesson as loop law). Applied: E8's D1/D5 routing; the
  queue as E8 states it.
- **R18 — a deferral with a verified manifest is diligence, not discharge.**
  The convergence bar's "executed and green" stands; U's no-deferral ethos
  applies INSIDE the loop. Pass 4 executes the manifests as written — P8's
  ledger §4 and P9's D6/D8/D9 paragraphs are now the best-verified work orders
  in the tranche, and §C4 charters them verbatim.
- **R19 — fleet self-containment is enforced at step 4, not discovered at
  step 5.** The step-4 dispatcher must reject/re-run any critique that fails
  self-containment (placeholder, unverifiable, absent) BEFORE step 5 convenes
  (R10's scoring rule stands beneath it); and every prototype ledger must state
  its ACTUAL base commit (E13's correction is the applied instance).

---

## §C4 — The pass-4 charters (close and execute; from PASS-3 §7, binding)

Common law carries unchanged from SPEC-B3 Part II (fresh-worktree evidence,
never merged; ring-fences; zero published-surface change; zero new standalone
gates; G10/G11/G12; in-tree verdicts per ruling 5; hard half first; every count
re-measured at execution time). Each item iterates on its EXISTING P7/P8/P9
worktree.

| item | mode | exhaustive pass-4 work |
|---|---|---|
| **N1 / P7** (`…d7f-11`) | **close** | The two-line spec close, nothing else (the executed dock slice is CLOSED): add the config-file plane — `vite.config.ts` · `vitest.config.ts` · `tsconfig.json` — to `N1-MOVE-SCRIPT.md` §①.6's class-8 doc/prose sweep path list (or, equivalently, name `vitest.config.ts:10`'s illustrative `demo/@/utils/kfEngine.ts` comment in §①.2's rider). Without it, the comment drifts stale at the owner-gated keystone step ①. |
| **N2 / P8** (`…d7f-12`) | **execute** | Run the ledger's OWN §4 executable order for the **6 surviving gated decision JSONs** (`soa-composite`, `color-soa`, `processframe-soa`, `spring-vector`, `waapi-densify`, `typed-om`), per JSON: ① author the re-homed `test/group/` assertion / confirm the `bench/taxonomy.json` `budgeted` row — **GREEN FIRST** (no silent drop); ② delete the JSON + strip the gate's write/compare (typed-om: delete the bench's `writeFileSync` block); ③ retire the emptied gate key (G12, **same commit**) including `proof:record-truth`'s decision-JSON dirty-check clause + the `proof-wave-charter`/`lib/portable-perf` reads; ④ trim the seam citations (E7's watchlist) under R11's 8th class — verdict text survives, dead path dies; ⑤ record each re-home in `N2-DELETION-LEDGER.md` §1. Correct the ledger's base-commit line (R19/E13). |
| **N3 / P9** (`…d7f-13`) | **execute** | Three table rows, all at CURRENT-tree paths: **D6 inline sweep** — the ~30 `Math.max(min, Math.min(max, x))` sites re-measured at sweep time, each re-pointed to value.js `clamp` with per-site bounds verified (`clamp(x, min, max)` takes arbitrary bounds — the "not [0,1]" deferral reason does not block; no wrapper). **D8 re-base** — `flattenVars` body → value.js `flattenObject`, KEEPING the thin key-transform wrapper (`camelCaseToHyphen` glue) AND gaining a value-stringification bridge (P9's measured facts inherited: `flattenObject` yields ValueUnit-valued entries where the demo consumers expect strings, and has no `transformKey`); the timeline export/import round-trip verified; the module's 2-consumer KEEP untouched. **D9 route** — `getCurvePath`'s `cubic-bezier` branch → `cubicBezierToSVG`; the generic fn→SVG sampler stays (D-GAP-3, accepted glue). **D1/D5 do NOT execute — ratified owner rides (E8/R17).** Correct the ledger header's base commit (R19/E13). |
| **SPEC-B3→B4** | **errata** | THIS document: the seven §E errata + rulings 16–19 folded. Nothing else. Discharged by its existence; scored by the §Q fleet for errata honesty. |
| **P1 · P2 · P3 · P4 · P5 · P6** | **FROZEN** | Read-only evidence (R15 extended at PASS-3 §3). All six pass-1/2 worktrees closed. |

**Convergence bars (scored against THIS charter surface; hard half first):**

- **P7 100%** = the config-file plane in the move script's §①.6 sweep (or the
  §①.2 rider), verified against `vitest.config.ts:10`; zero other change to the
  closed slice.
- **P8 100%** = all 6 dissolves executed with every re-home named AND green
  (assertion/bench-row green BEFORE its delete lands) + all G12 retirements in
  the same commits as their moots + the E7 watchlist citations trimmed with
  verdict text surviving + the ledger's §1 rows and base-commit line true.
- **P9 100%** = D6/D8/D9 executed per the table and green (`npm run check` ·
  vitest incl. `test/demo` · `npm run gh-pages` · zero published-surface
  change) + D1/D5 untouched beyond their recorded ride disposition + the ledger
  header true.

---

## §Q — Questions the pass-4 critique fleet must score (step 4 on the four touched items ONLY; R10 + R19 bind — the dispatcher rejects a non-self-contained critique before step 5 convenes)

1. **P7** — does §①.6's sweep (or §①.2's rider) now cover the config-file
   plane, verified against `vitest.config.ts:10`? Did ANYTHING else change on
   the closed slice? (Anything short of 100 needs a named, tree-verified
   defect.)
2. **P8** — for EACH of the six JSONs: was the re-home green BEFORE the delete?
   did the gate key, the `proof:record-truth` clause, and the
   `proof-wave-charter`/`portable-perf` reads retire in the SAME commit as
   their moot (G12)? are the E7 watchlist citations trimmed with the verdict
   text surviving (R11/R12)? does the ledger state the true base commit and
   carry one §1 row per re-home?
3. **P9** — D6: every inline site re-pointed, bounds verified per site, count
   re-measured (G11)? D8: the round-trip verified, the ValueUnit
   string-bridge honest, the module KEEP untouched? D9: the branch routed, the
   generic sampler intact? D1/D5: untouched beyond the ride record?
4. **This spec** — errata honesty: E7–E13 each claim a *(measured)* fact;
   spot-check them against the trees (the standing class the SPEC-B2/B3
   critiques both caught — the spec must not mint fresh imprecision while
   curing it).
5. **G11 discipline** — every count in §C4 re-measured at execution time; a
   stale count voids the verdict it produced.

**Exit condition (OD-U18, unchanged):** step 4 on the four touched items, then
step 5 agglomerates. At **100% across ALL TEN items** the loop TERMINATES and
the terminal pass record writes **"## The wave-set development order"** — the
re-charter mapping the converged evidence (SPEC-B4 + the NINE frozen prototype
worktrees + the `loop/` records) onto the final U wave set (PASS-3 §8's shape:
P2/P3/P5 → the U.B recut + CLAUDE.md/doc waves; P1's template + 8th class =
standing law for every U.C move; P7's move script = the U-restructure keystone
wave pending the owner's `@`-confirm; P8 §§1+4 and P9 §§1–3 = the meta-legacy
and dogfood waves' work orders verbatim). It is NOT ratified until termination.
**The owner-ride queue (E8) discharges before any owner-visible wave lands.**
Standing lessons intact: score against the charter; execute the hard half
first; leave the record in-tree; verify — never inherit — every number; a
manifest is not a discharge; and what the owner can SEE, the owner rules on.
