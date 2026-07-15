# SPEC-B5 — Track B convergence loop, pass 5: THE TERMINAL ERRATA REVISION

> **SUPERSESSION: SPEC-B5 REPLACES SPEC-B4.** This revision is **ERRATA-ONLY in
> totality** — PASS-4 §7, row SPEC-B4→B5, binding: **EXACTLY THREE errata
> (E14–E16 below), folding rulings 20–21 as standing spec law, and NOTHING
> ELSE.** Where this document is silent, SPEC-B4's text governs unchanged (and
> through it SPEC-B3, SPEC-B2, and SPEC-B1 — the canonical chain of SPEC-B3 E5
> holds: the library ruling table is SPEC-B1 §2 as amended by SPEC-B2 §2; the
> demo table SPEC-B1 §3 as amended by SPEC-B2 §3; **SPEC-B5 amends those tables
> NOWHERE**). SPEC-B4's errata E7–E13 stand, except that E15 corrects E10's
> arithmetic; SPEC-B4 §R (rulings 16–19) stands whole and rulings 20–21 join it
> here; SPEC-B4 §C4 stands, except as E14 amends its P9 row and E16 amends its
> P7 row; SPEC-B4 §Q and its exit condition govern pass 5's step 4 unchanged.
>
> Step 2 (synthesis) of the owner 5-step loop — OWNER-ASKS rows 6–7;
> OD-U15..U21 · **Date:** 2026-07-10. Pass 5 is the loop's **terminal one-liner
> close** (PASS-4 §7, the binding work order): seven items are frozen evidence
> (P1–P6 + N3, R15), two close (N1/P7 by two move-script edits; N2/P8 by one
> comment-only commit + one gate re-run), and this spec revises by these three
> errata. Pass 5 contains ZERO execution work; step 1 (research) is a no-op.
> The pass-5 critique fleet scores THIS revision for errata honesty per
> SPEC-B4 §Q4's standing class (the spec must not mint fresh imprecision while
> curing it); critique dispatch runs under ruling 22's sharpened
> self-containment form — loop-process law recorded at PASS-4 §5, pointed to
> here, not restated as spec content. Plain language; terms of art glossed at
> first use (ruling 6). Every count marked *(measured)* was verified against
> the trees or the installed packages at PASS-4 agglomeration time — never
> inherited.

Sections: **§E** — the three errata over SPEC-B4 (E14–E16), each folding its
ruling. Nothing else.

---

## §E — The three errata over SPEC-B4 (numbering continues from E7–E13)

Each erratum states the defective SPEC-B4 text, the verified fact, and the
corrected reading. These are the ONLY amendments to SPEC-B4's settled surface.

### E14 — The D8/D9 refutations RATIFIED (R20 folded): the §C4 P9 row amends to KEEP-with-disposition; D-GAP-5/D-GAP-6 book as U.F value.js letter rows.

**Defective text.** SPEC-B4 §C4's P9 row charters two executions: "**D8
re-base** — `flattenVars` body → value.js `flattenObject`, KEEPING the thin
key-transform wrapper … AND gaining a value-stringification bridge" and "**D9
route** — `getCurvePath`'s `cubic-bezier` branch → `cubicBezierToSVG`"; the P9
convergence bar reads "D6/D8/D9 executed per the table and green."

**Verified fact.** Both premises were measured FALSE at execution. P9 executed
the chartered re-base/route as measurement probes and REFUTED both as
false-positive duplications, and each refutation was reproduced independently
TWICE — by the step-4 critique against the built dist, and by the pass-4
agglomerator against the installed value.js (PASS-4 §3, §6). The reproductions
of record, frozen as evidence with P9:

- *(measured)* `flattenObject({transform:{translateX,translateY},opacity})`
  yields keys `["transform.translateX","transform.translateY","opacity"]` —
  the composite `transform` DECOMPOSES, breaking the one-valid-CSS-property
  contract the consumer's `fromKeyframes` path requires. The demo's hand-rolled
  `valueOf`-leaf guard is what keeps the composite whole; it is not a
  re-implementation of shipped functionality.
- *(measured)* `cubicBezierToSVG(0.4,0,0.2,1)` returns a full
  `<path d="M0 0 L0 0 …">` ELEMENT in raw un-flipped coordinates, where the
  demo binds bare path DATA to `:d` y-flipped (`1 - v`) like every sibling
  branch of `getCurvePath`.

Executing either as chartered would require a workaround the precept forbids.

**Corrected reading — the §C4 P9 row's D8 and D9 cells amend to
KEEP-with-disposition-comment:** `flattenVars` KEEPS its composite-preserving
body; `getCurvePath`'s bezier branch KEEPS its flipped bare-data sampler; each
carries its in-tree disposition comment so no future pass re-hunts the
"duplication" *(in-tree: the `flattenVars.ts` doc block;
`timingCurveUtils.ts:37-44`)*, and the corrections are NAMED in P9's ledger.
The gaps book as constellation asks — **D-GAP-5**: value.js has no
shallow/leaf-predicate `flattenObject` mode; **D-GAP-6**: value.js has no
bare-path-data/flipped-coords bezier sampler — **as U.F value.js letter rows**,
per SPEC-B3 §N3's own law (a gap is a library ask; only a re-implementation of
SHIPPED functionality is a demo defect). The U.F value.js letter-row set is
now, in full: **D-GAP-1** (the quart/quint `bezierPresets` gap, per E13) +
**D-GAP-5** + **D-GAP-6** (D-GAP-2 retired at E13; D-GAP-3 is accepted glue,
not a letter row).

**R20, folded as standing law** (the R16 family — a measured refutation of a
charter premise AMENDS the charter; these are the second and third applied
instances): a lane's measured refutation is ratified at step 5, never
self-certified — the lane records, the critique verifies, the agglomerator
ratifies. No lane re-litigates D8 or D9. Status note: **N3/P9 EXITED at 100 at
pass 4 under this amended charter** (PASS-4 §3) and is frozen evidence (R15);
this erratum makes the spec's record match what was ratified — the amended row
is what the terminal wave-order maps (P9's ledger §§1–3 + the R20 dispositions
= the dogfood wave's work order, with D-GAP-1/5/6 as the U.F rows).

### E15 — E10's subpath arithmetic corrected: these five, among SEVEN — no `/root` subpath exists. Origin: PASS-3 §4.4.

**Defective text.** SPEC-B4 E10 states that installed value.js 3.1.0 "ships
**EIGHT** subpaths — also `/transform`, `/quantize`, `/root`" and corrects
SPEC-B3's wording to "these five, among its eight."

**Verified fact.** *(measured, installed package — PASS-4 §2, §6)*: the
`exports` table has eight ENTRIES of which **SEVEN are subpaths** — `./color`
`./parsing` `./math` `./easing` `./transform` `./units` `./quantize`; the
eighth entry is the root `.`, which is the package's main entry and not a
subpath, and **NO `/root` subpath exists**.

**Corrected reading.** SPEC-B3 §N3's entry-ruling wording becomes: "**these
five, among its SEVEN**" — the two subpaths beyond SPEC-B3's original five
being `/transform` and `/quantize`. E10's substance is unchanged: the entry
ruling stands (Option A — demo excisions import value.js subpaths directly;
zero kf pass-through re-exports).

**Origin, traced** (the exact class §Q4 warns of): the error was minted in
**PASS-3 §4 item 4** — this loop's own agglomeration record, which listed
"also `transform`, `quantize`, `root`" — and SPEC-B4 inherited it verbatim.
The standing lesson — verify, never inherit, every number — cuts both ways:
**the loop's own records are not exempt from it.**

### E16 — R21 folded: `components.json` is DEAD SCAFFOLD (disposition `git rm` at keystone step ①), and sweep-as-measurement is standing law for every move script.

**R21's first clause — the disposition.** *(measured — PASS-4 §6)*:
`components.json` — the shadcn-vue scaffold config carrying two path-VALUED
`demo/@` references (`:8` `"css": "demo/@/styles/style.css"`; `:14`
`"components": "demo/@/components"`) — references NOTHING and is referenced by
NOTHING in the active tree; `package.json` carries no shadcn dependency; it is
the scaffold whose `ui/` output died at S.C3b and whose `@`
alias-materialization is OD-U2's condemned vestige. Read by no gate, at
keystone step ① both paths would drift stale SILENTLY — the false-clean
failure mode pass 4 existed to eliminate. **Disposition: `git rm`, chartered
in `N1-MOVE-SCRIPT.md` §①.1** — it rides the already-owner-gated keystone
commit; its two `demo/@` paths die with it (no re-point).

**R21's second clause — THE CLASS LAW, binding on every move script this spec
governs:** **a doc/prose sweep is DEFINED BY MEASUREMENT, never enumeration.**
Every sweep clause in a move script states its whole-tree measurement
(`git grep -l '<pattern>'` over the repo minus `docs/tranches/**`, the
archive) and disposes of EVERY hit BY NAME — swept, moved, deleted, or
exempted. A hardcoded path list is how BOTH the pass-3 AND pass-4 N1 residues
were minted (G11 applied to sweeps; twice-proven).

**Applied amendment — the §C4 P7 row.** SPEC-B4's P7 charter ("add the
config-file plane — `vite.config.ts` · `vitest.config.ts` · `tsconfig.json` —
to §①.6's sweep path list") was itself an ENUMERATION and is superseded by the
pass-5 close (PASS-4 §7, binding): two edits to `N1-MOVE-SCRIPT.md`, nothing
else — **(a)** the §①.1 `git rm components.json` charter above; **(b)** §①.6's
sweep REDEFINED per R21 to the measured whole-tree grep, every hit disposed by
name, with **`.github/workflows/ci.yml:496`**'s step-name prose ("every
demo/@ module is genuinely shared") named as a class-8 re-word in the keystone
commit (its gate script is already in the 37-literal sweep). *(measured —
PASS-4 §6)*: the complete out-of-sweep `demo/@` carrier set in the active
tree, after P7's widened list, is exactly `components.json` +
`.github/workflows/ci.yml:496` — everything else is a swept plane, a
P3/N2-chartered delete, or archive. The P7 convergence bar amends
accordingly: **P7 100% = both edits landed in `N1-MOVE-SCRIPT.md`, verified
against the measured carrier set; zero other change to the closed slice.**

---

**Exit condition (OD-U18, unchanged — SPEC-B4 §Q governs):** step 4 re-runs on
the three touched items only (N1, N2, this spec; ruling 22's sharpened
dispatch form enforced), then step 5 agglomerates. At **100% across ALL TEN
items** the loop TERMINATES and the terminal pass record writes **"## The
wave-set development order"** (PASS-4 §7's settled shape; NOT ratified until
termination). **The owner-ride queue (E8, unchanged per R17) discharges before
any owner-visible wave lands:** `demo/DESIGN.md` KEEP · the `@`-dissolution
one-word confirm (gates the ratified N1 keystone step ① — which now also
carries the R21 `components.json` rm) · D1 easing-curve canonicality · D5
oklab palette-sweep eyeball. Standing lessons intact, twice-proven again at
pass 4: score against the charter; execute the hard half first; leave the
record in-tree; verify — never inherit — every number (E15 shows the loop's
own records are not exempt); a manifest is not a discharge; what the owner can
SEE, the owner rules on; and now: **a sweep is a measurement, not a list.**
