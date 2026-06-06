# F.W0 — The assay-fold and the path forward (the dev/impl boundary)

**Phase:** DEV (this is TRANCHE DEVELOPMENT — docs ONLY, ZERO source edits) ·
**Class:** SYNTHESIS (the band-0 lead wave: it folds the 27+5-lane phase-1 assay
into the authored wave structure and draws the dev→impl line) · **Scope:**
`docs/tranches/F/**` (the charter + the wave specs; NOT `src/`) · **DAG-deps:**
none — W0 LEADS the entire F DAG; it confirms the assay is on disk and that
`F.md` (the canonical charter, authored by the lead from `F-CHARTER-DRAFT.md`) is the
deliverable every other F wave is grounded in.

**Title.** The assay is on disk; this tranche AUTHORS the path forward from it —
nothing here touches the engine, the demo, the library, the parser, the tests, or
the benches. The boundary between *development* (this tranche) and *implementation*
(a later tranche the lead sequences) is stated as the spine, so no wave below
mistakes a spec for a patch.

This wave exists to make three things unambiguous, each VERIFIED not asserted
(inv ε): (1) the deep-SOTA assay genuinely ran — 27 phase-1 lanes + 5 synthesis
lanes are on disk under `docs/tranches/F/audit/`; (2) `F.md` (the canonical charter the
lead authored from `F-CHARTER-DRAFT.md`) is the single synthesized path forward this
band's wave specs descend from — the §Mandate, the band→wave map, the DAG, the
§ALREADY-SOTA record are its load-bearing sections; (3) F is **tranche development**: it
produces *specs* (falsifiable gates, dispositions, folds), and the IMPLEMENTATION of
those specs — the one-line bench import fix, the stable-key buffer fold, the endpoint
cache — is a DIFFERENT, later motion the lead sequences and commits. The §Mandate is the
spine of every wave; W0 states it once, plainly, so F.W1..F.W16 can carry it by reference.

---

## § Mandate (the binding spine — stated once, carried by every F wave)

Re-asserted verbatim-in-substance from `E/E.md:26-53` and re-confirmed HONORED
A→F by `_SYNTHESIS-prompt-recap.md` §Precepts; `F.md §Mandate` is the
authoritative restatement. BINDING on every F wave, gate, fold, and hand-off:

- **NO quick solutions, NO workarounds** — idiomatic, gestalt only. No wave pins
  a bug as a "documented contract", patches a symptom at the wrong seam, or offers
  a weaker escape hatch beside the real fix. Hard gates pass ONLY the transposition.
  (F-specific: the delete-loop fold is the V8-correct stable-key null-fill, **NOT**
  "revert to fresh-`{}`" — `p-runtime-perf-F §1.2`.)
- **Architectural transpositions for elegance · simplicity · performance are
  NECESSARY AND DESIRABLE** — this is a development product. F's Band-1
  transpositions: the stable-key buffer clear (perf), the single-frame alias
  (perf), the computed-endpoint cache (perf).
- **NO legacy** — no compat alias, no deprecated path beside its replacement, no
  polyfill (feature-detect with the JS path as the genuine fallback). A replaced
  surface is replaced in one motion.
- **Measure-first** — every perf claim lands behind a shaped biting bench or is
  recorded-withheld WITH the measurement (the `d3-changed-keys.measure.test.ts`
  D-3 gold-standard bar). **Isomorphic** — pixels/behaviour stable unless a
  befitting delta is NAMED. **KISS** — the §ALREADY-SOTA record (`F.md
  §ALREADY-SOTA`) is BINDING; manufacture NO work where the kernel already leads. **inv-16** —
  F writes only keyframes.js; value.js + parse-that items are HAND-OFFs (propose,
  never write).

**ENFORCEMENT (inv ε):** every code claim in every F wave cites a `file:line` or a
named phase-1 lane; every item is disposition-tagged (SHIP-in-F / MEASURE-FIRST /
BOOK / KILL / RECORD / value.js-HANDOFF / parse-that-HANDOFF / glass-ui-HANDOFF).

---

## § The state, verified (not asserted)

The live facts, read- and grep-confirmed on `tranche-e-impl`, so the band's framing
is honest:

1. **The assay is on disk — 27 phase-1 + 5 synthesis lanes.** `docs/tranches/F/audit/`
   holds the 27 phase-1 lane docs (`r-*`, `a-*`, `p-*`, `vj-*`); the `audit/parsing/` px
   sub-fan (`px-kf-grammar` et al., 5 `px-*` lanes) is the parsing sub-assay alongside.
   The 5 synthesis lanes: `_SYNTHESIS-gap-scorecard.md`, `_SYNTHESIS-deferred-ledger.md`,
   `_SYNTHESIS-prompt-recap.md` (under `audit/`), `audit/parsing/_SYNTHESIS-parsing-sota.md`
   (the parsing sub-fan synthesis), and `a-tranche-retro-F.md` (the retro spine). The
   inv-16 `valuejs-sota-handoff-v2.md` (under `docs/tranches/F/`) is a DEVELOPMENT artifact
   (Band V), NOT an assay lane (`F.md §Phase`). Verified: the `audit/` listing shows 30
   top-level docs (27 phase-1 + 3 `_SYNTHESIS-*`) + the `audit/parsing/` sub-fan (5 `px-*` +
   1 synthesis). **The assay ran; it is not a claim.**

2. **`F.md` is the synthesized path forward (the canonical charter).** The lead authored
   it from `F-CHARTER-DRAFT.md` (the synthesis draft); `F.md` carries the §Mandate, the
   §invariant set, the §Thesis, the §band → wave map, each band's findings + dispositions
   + gates (the per-`### F.Wn` rows), the §DAG, the §ALREADY-SOTA record, and the inv-16/
   inv ε compliance block. **Verified: `F.md` is the canonical charter** (`F.md:1-33` —
   PROGRESS.md names it "the canonical charter") — F.W0..F.W16 are the wave specs that
   descend from it; `F-CHARTER-DRAFT.md` remains on disk as the synthesis provenance.

3. **The deferred ledger is CLEAN — zero KFE.** `_SYNTHESIS-deferred-ledger.md §0` +
   `a-tranche-retro-F §1` verify D was the terminal home for all chronic keyframes-owned
   debt; E manufactured none. **P-invariant-28 is VACUOUS for F** — F folds NO inherited
   chronic debt; every F item is a post-E assay finding (a net-new gap or an E withhold
   RE-MEASURED). This is the honest provenance the §ALREADY-SOTA record protects.

4. **F is development, not implementation.** Every audit lane states "Research/audit
   only — ZERO source edits" (e.g. `r-v8-cost-model.md:9`, `a-runtime-remeasure.md:15`,
   `a-engine-post-e.md:14`). The charter wrote ONLY docs under `docs/tranches/F/` — ZERO
   source edits (`F.md §inv-16 / inv ε compliance`). **The dev/impl boundary is real and load-bearing:**
   the band-0/band-1 wave specs below SPECIFY the folds (the bench import fix, the
   stable-key buffer, the endpoint cache) with falsifiable gates; they do not APPLY
   them. The lead verifies + sequences the implementation tranche.

The wave's job: fold the assay into the authored band structure, state the §Mandate
once as the spine, and draw the dev/impl line — so the implementation tranche knows
exactly what each spec demands and exactly where the gate bites.

---

## § Goal

**What lands (docs only):**
- **The assay-fold CONFIRMED** — a re-runnable presence check that the 27+5-lane
  assay is on disk and that `F.md` is the path-forward synthesis the
  wave specs cite. This is the band-0 lead artifact: the charter is the deliverable,
  the wave specs are its descent.
- **The §Mandate STATED ONCE as the spine** — so F1..F16 carry it by reference, not
  by re-derivation. Every wave below opens with a one-line "the §Mandate (F.W0) is
  the spine" and cites the clause it most tests.
- **The dev/impl boundary NAMED** — F is *development* (specs + gates + dispositions);
  the *implementation* of every SHIP-in-F fold is a later motion the lead sequences.
  No F wave applies a source edit; each wave's hard gate is the contract the
  implementation tranche must satisfy.

**Why:** the band-0 lead must establish, before any perf or verification spec, that
(a) the assay is real (inv ε — verify, do not assert), (b) the charter is the single
grounded source, and (c) this tranche authors rather than implements. Without W0,
a reader could mistake F4's stable-key buffer spec for a landed fold, or re-table a
KILLed item the assay already settled. W0 is the frame that makes the rest legible.

---

## § Scope

### S1 — Confirm the assay is on disk (the presence check) — `a-tranche-retro-F §4`

**WHAT:** a re-runnable confirmation that `docs/tranches/F/audit/` carries the 27
phase-1 lane docs + the 5 synthesis lanes enumerated in `PROGRESS §W0 audit evidence`
(the four `_SYNTHESIS-*` + the `a-tranche-retro-F` retro spine).
The lane→doc mapping is 1:1 and disposition-tagged (`a-tranche-retro-F §4`:
"each lane writes exactly `docs/tranches/F/audit/<id>.md`, inv-16 single-file
discipline"). **No code, no source — a docs-presence assertion.**

**WHY:** inv ε demands the assay be VERIFIED, not asserted. The charter's authority
rests on the lanes existing and saying what it cites; S1 makes that falsifiable
(delete a lane → the check reds). This is the "the assay IS the deliverable" clause
(`F.md §F.W0`).

### S2 — State the §Mandate as the spine + carry the dev/impl boundary — `F.md §Mandate`

**WHAT:** the §Mandate restated once (above), with the binding clause-list, and the
explicit statement that F is development: the wave specs SPECIFY folds with
falsifiable gates; they do not apply source edits. Each downstream wave references
F.W0's mandate rather than re-deriving it.

**WHY:** the §Mandate is "the spine of every wave" (the F ask). Stating it once,
authoritatively, with the inv ε enforcement clause, gives F1..F16 a single
reference and makes the no-manufacture discipline (the §ALREADY-SOTA record is
BINDING) impossible to lose across 16 specs. The dev/impl boundary prevents the
implementation tranche from over-reading a spec as a done fold.

### S3 — Carry the §ALREADY-SOTA record forward as a no-manufacture guard — `F.md §ALREADY-SOTA`

**WHAT:** record that the bulk of the post-E stack is exemplary and BINDING-untouched
(the engine kernel, the interpolation core, the spring/decay/drag analytics, the
WAAPI harness, the FrameCompiler split, the value.js boundary, the modern-web demo
surface, the color science, the parse-that fast tier, the test bite-discipline, the
process). Every F wave's §Folds must cite the KILL/RECORD items in its band so no
future lane re-raises them.

**WHY:** KISS + measure-first demand that F manufacture NO work where the kernel
leads. The §ALREADY-SOTA record is the binding ledger that keeps F net-new and
narrow — "F proves itself by what it leaves untouched as much as by what it ships"
(`F.md §The honest bottom line`). W0 carries it so each band wave inherits the guard.

---

## § Hard gate (falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES (each BITES — a real presence-check, not
narration):

1. **The assay is on disk.** `proof:assay-fold` (a docs-presence check): assert
   `docs/tranches/F/audit/` carries the 27 phase-1 + 5 synthesis lane docs the
   charter cites, AND `docs/tranches/F/F.md` (the canonical charter) is present. BITES: remove
   a cited lane doc or the charter → the check reds. (Proof instrument: a grep/ls
   over the audit dir + the charter path; re-runnable, env-independent.)
2. **The band-0/band-1 wave specs descend from the charter.** Assert
   `docs/tranches/F/waves/F.W{0..6}.md` each cite `F.md` and at least
   one named phase-1 lane in their § State. BITES: a wave spec with no charter/lane
   grounding → reds (inv ε: cite for every claim).
3. **No source edit in F.** Assert `git status` over `src/`, `test/`, `bench/`,
   `demo/` shows ZERO modifications attributable to F's authoring (F is docs-only).
   BITES: a staged source edit in an F-authoring commit → reds (the dev/impl boundary
   is a hard line, not advisory).
4. **The §ALREADY-SOTA record is carried, not contradicted.** Assert no F wave §Goal
   manufactures work against a §7 exemplary surface (the kernel, the steppers, the
   WAAPI harness, the FrameCompiler, the boundary, the color science, the parse-that
   tier). BITES: a wave that proposes re-touching an ALREADY-SOTA surface → reds.

---

## § Folds

Retires (by finding id / charter section):
- **W0 — assay confirmation** (`F.md §F.W0`) — S1 + gate clause 1.
- **The §Mandate restatement** (`F.md §Mandate`) — S2.
- **The dev/impl boundary** (the F ask; `a-tranche-retro-F §0/§4`) — S2 + gate clause 3.
- **The §ALREADY-SOTA carry** (`F.md §ALREADY-SOTA`) — S3 + gate clause 4.

**RECORDED (carried into the band waves, so no future lane re-raises):**
- **The clean deferred ledger (zero KFE)** — `_SYNTHESIS-deferred-ledger §0`,
  `a-tranche-retro-F §1`. P-invariant-28 is VACUOUS for F; F folds no chronic debt.
  RECORDED so no wave re-tables inherited debt that does not exist.
- **The library line-ceiling DECISION** (`NEW-3`/`a-engine-post-e F-ENG-5`) —
  **MEASURE-FIRST → BOOK.** The library is exempt from the 350L demo ceiling;
  `Animation` is ~913L and at its cohesive gestalt (`a-engine-post-e F-ENG-5`:
  a split would be legacy-shaped). The gap is the ABSENCE of a *gated decision*,
  not the line count. Band 0 should DECIDE: extend the ceiling to `src/animation/**`
  OR record an explicit gated exception with rationale. **Do not reflexively split.**
  RECORDED here as the band-0 standing decision; carried as a BOOK.
- **The orchestration-tier was NOT re-tabled as open** (`a-tranche-retro-F §0/§6.5`) —
  F-1…F-5 from the A→E retro LANDED in E.W10; F starts from the post-E state, not the
  pre-E projection. RECORDED so no wave re-derives a discharged gap.

---

## § Design decisions

1. **The charter is the deliverable; the wave specs are its descent — RESOLVED.**
   The §Mandate forbids manufacturing work; the most honest band-0 lead is one that
   CONFIRMS the assay and STATES the spine rather than re-doing the synthesis. The
   deferred-ledger / prompt-recap / gap-scorecard / valuejs-handoff-v2 are ALREADY
   authored (audit synthesis) — W0 does NOT re-author them; it folds them into the
   wave structure and points each band wave at its grounding. Trade-off: W0 ships no
   code — but a band-0 that re-synthesized would duplicate the charter and risk drift;
   the discipline is to confirm-and-frame, not re-derive.

2. **The dev/impl boundary is a HARD line, not advisory — RESOLVED.** F is tranche
   development: it produces falsifiable specs. The implementation of every SHIP-in-F
   fold (F1's bench fix, F4's buffer fold, F6's endpoint cache) is a SEPARATE motion
   the lead sequences and commits. The gate clause 3 (zero source edit in F) makes the
   boundary falsifiable. Trade-off: a reader wanting "the fix" must wait for the impl
   tranche — but conflating spec and patch is exactly the workaround the §Mandate
   forbids; the spec must stand on its gate, not on a premature edit.

3. **The §ALREADY-SOTA record BINDS every band wave — RESOLVED + HONEST (inv ε).**
   The post-E stack is ~90% SOTA (`_SYNTHESIS-gap-scorecard §0`); the engine kernel,
   the spring/decay analytics, the WAAPI harness, the FrameCompiler, the value.js
   boundary, the modern-web demo, the color science, and the parse-that tier are
   exemplary and must not be re-touched. W0 carries this as a no-manufacture guard
   into every band wave's §Folds. Trade-off: a narrow tranche reads as "less work" —
   but manufacturing a deficit where the kernel leads is the anti-KISS failure the
   §Mandate most forbids; F's narrowness IS the discipline.
