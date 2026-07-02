# Critique — S.Z Close (prompt-recap · template · FINAL/version/memory)

**Agent:** adversarial critique · **Band:** S.Z (S.Z1–S.Z3) · **Track:** close
**Probe evidence:** none direct (no prototype tested the close band). Evidence base = r1
(session-history corpus), r2 (tranche-genealogy / the F1–F6 failure catalogue + T1–T12 source),
r8 (gate roster / FINAL-table falsification). Cross-band probe **p12** (via sibling critique
`sa-truth-gates.md`) materially adjusts the recap's *inputs* and is treated as absorbable evidence.
**Verdict:** the band faithfully absorbs r1's recap-integrity guard and r2's T1–T12, but **both of
its born-RED gates suffer the exact falsifiability diseases the band exists to abolish** (a recap
gate that checks row-*shape* not cited-oracle-*truth*; a template gate whose scope is prose), and the
close is **literally unrunnable-as-written** because T10 (full-roster green) collides with T12 (the
E6 external HANDOFF gate lives inside `proof:all`). Convergence **33%**.

The damning frame for this band specifically: *would S.Z's own gates have caught R's residue?* Two of
R's six residue classes (r2 Part VI) slip straight through S.Z's gates as-written — see §2.3.

---

## 1. What the band gets RIGHT (credit, per the r2 S6 temper-mandate)

- **The three mandated re-verifications are the correct three.** S.Z1 / §5.2 names keyframes-vue
  KILL, lint-tier, decomposition-spirit — a verbatim absorption of r1's recap-integrity guard
  (`r1:439-441`). The insistence on re-measure-not-chain-trust is exactly r2 S4.
- **T10 correctly indicts R's 6-gate FINAL table.** S.Z2's "no FINAL gate-state table smaller than
  the full roster" is the precise cure for r8-F5 (`r8:208-214`: R's `FINAL.md:183-192` ran 6 gates,
  never the 159-member hygiene-chain, and shipped over the RED `proof:styling-idioms`). This is the
  band's strongest single clause.
- **The spirit-column doctrine (§5.5) is load-bearing and must survive.** "A recap that lists
  letter-compliance while the same mechanism leaks fails S's own bar" is the direct answer to r1's
  headline finding (`r1:52-56`: the gate machine is now the primary place spirit leaks). Do not prune.
- **T2/T3 caps-and-deferral clauses are well-sourced** (r2 F2/F3) and mechanically checkable.

---

## 2. Challenge findings, gate by gate

### 2.1 `proof:prompt-recap-s` — UNFALSIFIABLE-IN-SPIRIT (the recap re-commits r2 F1 on itself)

**Axis 2 — FAIL.** The gate as authored (§5.3, SPEC:702-704) "parses the ask ledger; REDs on any row
without a terminal disposition." That is a **source-shape check over a doc artifact**: it asserts
each row has a non-empty disposition *cell*, not that the disposition is *true*. §5.2 states the
intent in prose ("every 'ADDRESSED' row cites a re-run gate exit code or a live observation, not a
doc claim — r2 S4") but **the gate clause does not encode it.** As-written, the ledger is greenable by
writing `ADDRESSED (proof:foo green)` in every row while `proof:foo` is red or nonexistent. This is
literally r2 F1 (gate-shaped-but-not-runtime, `r2:52-75`) and r2 S4 (transcript-trust) applied to the
recap whose entire purpose is to forbid them. A recap gate that trusts its own cited exit codes
without resolving them is the doc-claim-trusting artifact r2 condemns.

**Second defect in the same gate — "the nine" is undefined (SPEC:703).** The clause "REDs if any
S-charter verbatim precept (the nine in the kickoff) lacks a band mapping" cannot be evaluated: r1 §5
(`r1:333-356`) enumerates **twelve** kickoff asks, not nine; the standing mandate is a separate
7-clause spine (`r1:60-87`); the precept-frequency table lists ~14 (`r1:95-113`). There is no defined
set of "nine." A gate cannot check membership against an undefined set — the clause is unfalsifiable
until the canonical precept set is bound by citation.

**Deduction: -15** (one gate, two falsifiability defects). Both are mechanically fixable (see
blocking B1, B2) — but as-written the gate is dishonest.

### 2.2 `proof:tranche-template` — SCOPE IS PROSE, NOT A PREDICATE; non-vacuity under-specified

**Axis 2 — FAIL.** S.Z2 says the gate "parses S's own FINAL and REDs on any violation" of the T1–T12
mandates (§7). But T1–T12 are **not uniformly parseable from a FINAL**:

- Checkable from FINAL/ledger/roster: **T2** (caps only shrink), **T3** (deferral-verb prose ⇒ ledger
  row), **T4/T5** (exit codes recorded), **T10** (full-roster table + clean SHA).
- **NOT** checkable from FINAL: **T1** (runtime-tier — needs `proof:gate-is-runtime`), **T6** (cosmetic
  excision — needs `proof:no-orphan-module`; a FINAL that says "excised" reads identically whether the
  corpse is gone or not — this is exactly how R's `animate.ts` zombie passed, `r2:226-235`), **T7**
  (gate-follows-code), **T8** (interaction tests), **T9** (census-before-fiat), **T11** (risk
  signature), **T12** (external gates).

So "REDs on any violation" is either an **overclaim** (the gate cannot see T6/T8/T9 violations) or
**vacuous** (it checks nothing specific). The gate whose job is to abolish prose-scoped oracles is
itself prose-scoped. It must be re-specified as: *the template gate enforces the FINAL-parseable
subset {T2,T3,T4,T5,T10}; the artifact mandates {T1,T6,T7,T8,T9} are enforced by their named sibling
gates, and the template gate asserts only that each such sibling gate is PRESENT and green in the
close roster.* Without that partition the scope is unfalsifiable.

**Non-vacuity under-specified.** S.Z2 says "plant one → RED." r2 S5 (`r2:198-201`, R's model) is a
*multi-row* protocol — one deliberately-malformed plant per checked mandate, each with its expected
message. A single generic plant proves one clause bites and says nothing about the others.

**Deduction: -15.**

### 2.3 The acid test — would S.Z's gates have caught R's residue? (partial NO)

Enumerating r2 Part VI against the two S.Z gates:

| R residue (r2) | Caught by S.Z gate? |
|---|---|
| Zombie `animate.ts` (F6 cosmetic excision) | **NO** by `proof:tranche-template` (invisible in FINAL prose); caught only by `proof:no-orphan-module` (S.C1) — which the template gate must be made to *require the presence of* |
| 6-gate FINAL table over a red chain (r8-F5) | **YES** — T10, the band's best clause |
| `engine-seam-split` silently dropped (F3-adjacent) | **PARTIAL** — T3 catches *booked* deferrals, not *silent drops*; a never-authored mandated gate leaves no prose to grep. Caught instead by the recap's decomposition-spirit re-verify + C-11's ledgered KILL |
| Post-close `6f2493d` R-fallout (F5/W-weak-3) | **PARTIAL** — T10 asserts the FINAL SHA's roster was green, but a gate parsing the FINAL **cannot see a future commit**; preventing post-close fallout needs a *separate post-hoc guard* (see blocking B5), not a FINAL parser |

Two of four are NO/PARTIAL. The band's own gates would re-admit two of the exact residue classes it
was chartered to terminate — the sharpest possible indictment for a close band.

---

## 3. Structural blocker — the close is UNRUNNABLE as written (T10 ⊥ T12)

**Axis 1 + 3 — FAIL (blocking).** S.Z3 (SPEC:577) demands FINAL "over a **from-clean full-roster
run**"; T10 (SPEC:813-815) demands "**full `proof:all`** … no FINAL gate-state table smaller than the
full roster." But `proof:peer-satisfied` is (fold-table row 52, SPEC:662) a **born-RED HANDOFF** whose
re-entry is the glass-ui 5.0.0 publish, and it is inside the S.E6 external-gated wave (SPEC:463-470),
which T12 (SPEC:822-825) explicitly permits to close **as an unfired HANDOFF**. Therefore:

> If glass-ui 5.0.0 has not published at S close, `proof:all` **cannot be green** (it contains at
> least one born-RED external gate), so S.Z3's "from-clean full-roster run" and T10's "full green"
> are unsatisfiable — yet T12 says S may close anyway.

The spec asserts both T10 and T12 and **never reconciles them at the close.** As-written, either the
FINAL cannot be authored (T10 unsatisfiable) or the roster table must exclude the external gate
(violating T10's "no table smaller than the full roster"). This is not hypothetical: the whole point
of T12 is that 5.0.0 *may not land in time* (r7 B-1: BG+BH are dev-complete/unbuilt). The close needs
an explicit **"closeable roster"** definition: the full roster MINUS the owner-ratified external
HANDOFF gates (named by ledger row), with those gates rendered in the FINAL table as
`HANDOFF — external — row N` (a third state, neither green nor a hidden omission). This preserves T10's
airtightness (the table still lists every gate) while honoring T12.

**Deduction: -10** (open design question; owner-resolvable but genuinely unresolved).

---

## 4. Version ruling (S.Z3) — the `=any → =Vars` flip slips between the two clauses

**Axis 5 — MISSING.** S.Z3 pre-books version as "additive-minor by default; any **surface removal**
must ride a MIGRATION doc." Two S changes are neither pure additions nor removals:

- **S.B6 flips 11 `= any` generic defaults to `= Vars`** and unifies SVG generics to `extends Vars`
  (SPEC:341-342). For a consumer who wrote `KeyframesAnimation` with no type argument, the default
  narrows `any → Vars`; code that passed arbitrary property bags now type-errors. Under
  semver-for-types this is a **source-breaking d.ts change** even though runtime is identical — i.e.
  potentially a **major (6.0.0)**, contradicting "additive-minor by default."
- The API-Extractor trimmed roll-up (S.B6) strips 126 leaked privates — removing symbols from the
  *rolled-up d.ts surface*. Are leaked privates "surface"? The changelog gate (generalized in S.C1 to
  fire on "any published-surface removal") may or may not fire on them; undefined.

The version ruling is stated as OWNER RULING, which is correct — but the spec must **surface these two
specific questions to the owner** rather than gloss them under "additive-minor by default." A version
ruling that hasn't priced its own band's type-narrowing is not yet a ruling.

**Deduction: -10** (open design question).

---

## 5. Probe adjustment the band must absorb (p12, via the input ledger)

No probe tested S.Z, but **p12 refuted the "device-dependence plane" model** (per `sa-truth-gates.md`
§1.1: 11 sampled reds reproduced on fast macOS; true device-dependence render-races = 0). r1's Finding
3 (`r1:229-238`) and r1's ADDRESSED-map row *"Device-dependent demo gate greened — PARTIAL/chronic"*
(`r1:380`) both carry the device-dependence framing. **The recap ledger must NOT inherit r1's framing**
— it must re-disposition the apparatus/device rows to cite S.A0/S.A2's *fix-by-cause* dispositions
(post-p12), exactly as it re-measures the R reversals rather than chain-trusting them. This is
mechanically absorbable (edit the row citations) but the spec, predating p12, still points the recap at
r1's model. This is the recap eating its own dogfood: the recap that forbids chain-trusting R's claims
must equally not chain-trust r1's superseded narrative.

Not a deduction (mechanical edit — blocking B6), but load-bearing.

---

## 6. Missing / unfalsifiable items (evidence-demanded)

- **B-miss-1 — no re-verify ORACLE for the keyframes-vue KILL.** §5.2 names it as a mandated
  re-measurement but spells no oracle. r1:375 gives the observable: `npm view @mkbabb/keyframes-vue`
  → 404 **and** repo-grep zero. Without a named oracle "re-measure the KILL" is the very chain-trust
  it condemns. **-10.**
- **B-miss-2 — the mid-S ask-capture guard (§5.4) is unfalsifiable.** "Owner asks arriving mid-S are
  appended … never absorbed silently (the F3 laundering guard)" — but there is no mechanism/gate. r1
  itself needed 120 MB jq-mining + human judgment to recover the corpus (`r1:4-8`); "detect an
  un-appended owner ask" is not mechanically gateable. Either specify a lightweight artifact
  (`docs/tranches/S/OWNER-ASKS.md` the gate asserts is fully dispositioned) or demote §5.4 honestly to
  a *process discipline the orchestrator owns*, not a gate. As-written it is an aspirational guard
  masquerading as enforcement. **-10.**

Lower-severity (folded into blocking edits, not separately scored):
- The ask-ledger artifact **path is unnamed** (proof:prompt-recap-s "parses the ask ledger" — needs a
  fixed path, e.g. `docs/tranches/S/PROMPT-RECAP.md`).
- **Cross-repo rows** (parse-that S.H, value.js dispatches) can only be dispositioned via the kf-side
  *consume gate*, not the sibling's internal gate — the recap must say so, else those rows are
  necessarily chain-trusted to a sibling publish.
- **MEMORY truth (S.Z3)** is non-gated (auto-memory is user-domain) — legitimate, but list it as
  observe-tier so it is not dressed as gated work.

---

## 7. Deduction ledger (explicit)

| # | Deduction | Class | Pts |
|---|---|---|---|
| 1 | `proof:prompt-recap-s` checks row-shape not cited-oracle-truth (r2 F1 on itself) + "the nine" undefined | unfalsifiable gate | −15 |
| 2 | `proof:tranche-template` scope is prose over non-uniformly-parseable T1–T12; non-vacuity under-specified | unfalsifiable gate | −15 |
| 3 | T10 (full-roster green) ⊥ T12 (E6 external HANDOFF inside `proof:all`) — close unrunnable | open design Q | −10 |
| 4 | Version ruling doesn't price S.B6's `=any→=Vars` type-narrowing (breaking?) | open design Q | −10 |
| 5 | keyframes-vue KILL named as re-verify but no oracle | missing item | −10 |
| 6 | §5.4 mid-S ask-capture guard unfalsifiable (no mechanism) | missing item | −10 |
| | **Total** | | **−70 → 33%** |

(Credit held above the raw arithmetic only insofar as the charter absorption of r1's guard + r2's
T1–T12 is genuinely strong; the two hard blockers #3/#4 are owner-resolvable, and #1/#2/#5/#6 are all
mechanical spec edits. The band is not conceptually broken — it is under-specified at precisely the
falsifiability seam it exists to police.)

---

## 8. BLOCKING edits for SPEC-v2 (must land before impl authorization)

- **B1.** Rewrite `proof:prompt-recap-s`'s clause: every `ADDRESSED` disposition must name an oracle
  that (a) resolves to a real gate/observation and (b) matches a **green exit in the S.Z3 from-clean
  roster run** (or a live-observation artifact); a cited oracle that is absent or red REDs the row.
  Bind the three re-verifications to concrete oracles: keyframes-vue → `npm view` 404 + repo-grep
  zero (r1:375); lint-tier → dep-cruiser baseline `[]` + the enforcer file exists (r1:290, S.C4);
  decomposition-spirit → S.B5's empty-override + max-file-≤460L + no-re-export-bridge exit (SPEC:340).
- **B2.** Replace "the nine in the kickoff" with the **cited** precept set: r1 §5's twelve kickoff
  asks (`r1:333-356`) + the 7-clause standing mandate (`r1:60-71`); the gate checks band-mapping over
  that enumerated union.
- **B3.** Re-specify `proof:tranche-template`: enumerate the FINAL-parseable mandates it *directly*
  checks {T2,T3,T4,T5,T10}; for the artifact mandates {T1,T6,T7,T8,T9} it asserts only the *presence
  and green state* of the named sibling gate (`proof:gate-is-runtime`, `proof:no-orphan-module`, etc.)
  in the close roster. Add a per-mandate non-vacuity plant table (r2 S5), one malformed FINAL per
  checked clause with its expected message.
- **B4.** Define the **closeable roster** for S.Z3/T10: full roster MINUS owner-ratified external
  HANDOFF gates (named by ledger row); render those in the FINAL table as an explicit third state
  (`HANDOFF — external — row N`), never omitted. Reconcile T10 and T12 in one sentence in §7.
- **B5.** Add a **post-close fallout guard** distinct from the FINAL parser: any commit between the
  FINAL SHA and the version tag that touches `src/`/`bench/`/`scripts/` REDs (the mechanical form of
  T10's "post-close fallout patch falsifies the close" — the FINAL parser cannot see the future, per
  §2.3 row 4).
- **B6.** Re-point the recap ledger's apparatus/device-gate rows from r1's (p12-refuted)
  "device-dependence plane" framing to S.A0/S.A2's fix-by-cause dispositions; add a recap-integrity
  clause that r1's own ADDRESSED-map is re-measured, not chain-trusted (symmetric with the R-reversal
  re-verification).
- **B7.** Name the ask-ledger artifact path; either give §5.4 a concrete mechanism
  (`OWNER-ASKS.md` fully-dispositioned check) or demote it to a stated orchestrator discipline.
- **B8.** Surface the two version questions (S.B6 `=any→=Vars` d.ts-narrowing; the 126-private
  roll-up strip) to the owner as explicit ruling inputs, not glossed under "additive-minor."

---

## 9. Prune / recorded-future

- **Record-future (not a close blocker):** fold-table row 65 "docs/precepts/audits/ ownership" —
  S.Z3's "fold or freeze" is a non-decision (names two options, chooses neither). It is docs-ownership,
  not correctness; move it to an owner record-future item rather than a close deliverable.
- **Record-future:** the `docs/tranches/TEMPLATE.md` artifact itself risks becoming the next
  stale-doc-authority (the R.W7 CLAUDE.md inversion, `r2` finding 4, applied to the template) — give
  it an amendment/version discipline so a future T13 mandate can land without the template ossifying.
- **Keep (do NOT prune):** the spirit-column doctrine (§5.5) and T10's full-roster clause — the two
  load-bearing wins.
- **Prune** the phrase "the nine in the kickoff" (unsourced) — replaced by B2's cited enumeration.
