# S.Z — Close (the re-derivation-shaped close band)

> **This is a TRANCHE-DEVELOPMENT phase, NOT implementation.** This document is the
> wave-spec for band **S.Z** of Tranche S, transcribed with zero load-bearing loss from the
> converged **SPEC-v3** (`docs/tranches/S/audit/pass1/SPEC-v3.md`, 1,833 lines — the standalone
> source of truth). Every gate definition, co-edit set, DAG edge, cost estimate, born-RED clause,
> ruling reference, and fold-row this band carries is reproduced here; an implementer must NOT need
> to read SPEC-v3. Nothing runs until the owner authorizes an impl drive. A wave is CLOSED only
> when its born-RED gate is GREEN **re-run on the merged tree** (T4, inv-16), and **S.Z2 re-executes
> that oracle at close**. **Branch:** `tranche-s-dev` · **Track:** close.

---

## 0. Band charter — the close

S.Z is the **close band**: it is the machinery that proves S actually landed what it claimed, over
a *from-clean* tree, and that turns every close claim from prose into a re-runnable oracle. It
carries four load-bearing pieces (SPEC §3 S.Z):

1. **The re-derivation-shaped close gates.** S.Z's gates do not read asserted exit codes — they
   **re-execute** the underlying oracle. `proof:prompt-recap-s` (S.Z1) reds any `ADDRESSED` row
   whose cited oracle is absent or red in the S.Z3 from-clean run; `proof:tranche-template` (S.Z2)
   **re-runs** the closure oracle of every wave marked CLOSED and reds on an exit-code mismatch;
   S.Z3's FINAL runs the whole closeable roster from a clean checkout at the exact SHA. Row-shape
   and cited-green-string alone can no longer green a close claim (the Q-mode cure — SPEC §3 S.Z2,
   X2-4).
2. **The T-mandate plant table.** S.Z2 codifies r2's failure/success taxonomy (T1–T12, SPEC §7) as
   `docs/tranches/TEMPLATE.md` + a partitioned `proof:tranche-template` gate, with a **per-mandate
   non-vacuity plant table** — one deliberately-malformed FINAL per directly-checked clause, each
   with its expected RED message (SPEC §3 S.Z2, r2 S5; SZ-3).
3. **The closeable-roster reconciliation.** C-21 reconciles T10 (no FINAL table smaller than the
   full roster) with T12 (external gates are named, not assumed): the FINAL runs the **closeable
   roster** = the full roster MINUS owner-ratified external HANDOFF gates, each rendered in the
   FINAL table as an explicit third state `HANDOFF — external — row N`, never omitted, never counted
   green (SPEC §2.2 C-21, §3 S.Z3, §7 T10/T12).
4. **The Z3 master-green pre-gate.** S.Z3's born-RED precondition is a **green master push CI run on
   the FINAL SHA** (`gh run list --workflow ci.yml --branch master`) — the S.A0 keystone re-gated at
   close. The tranche is **not closable over a red master**; the Q/R mode (both shipped via manual
   `workflow_dispatch` over a red master — SPEC §2.1-2) is structurally forbidden, not merely cited
   (SPEC §3 S.Z3, X2-4, §7 T11).
5. **The version-owner questions.** The version decision is an **OWNER RULING with its inputs
   surfaced, not glossed** (sz-B8): additive-minor by default, but two inputs can force major — the
   `=any → =Vars` d.ts narrowing (S.B6) and the 126-leaked-private API-Extractor strip (SPEC §3
   S.Z3, §6.3, SZ-9). Both are pre-booked §6 owner questions.

**Mode declarations (C-14, one per wave):** S.Z1 REWRITE (of the prompt-recap gate); S.Z2 REWRITE
(new template + meta-gate); S.Z3 REWRITE (of the FINAL/close discipline).

**Intra-band + cross-band DAG (SPEC §3 "The DAG").**

```
ALL bands ──► S.Z1 ──► S.Z2 ──► S.Z3     (Z3 pre-gated on master-green at the FINAL SHA)

S.H1, S.H2 parallel ;  S.H1 + S.H2 ──► S.H4 ──► (1.0.0 publish → kf re-pin) ──► before S.Z
```

- **S.Z1 deps:** all bands (the recap dispositions every owner ask against every band's landed
  gates). **S.Z2 deps:** Z1. **S.Z3 deps:** Z1, Z2.
- **S.H4 must complete before S.Z** (SPEC §3 DAG): the owner-controlled parse-that 1.0.0
  publish-then-re-pin lands, and only then does the close band run — S.H4's gates are
  **born-SPECIFIED**, firing at the impl drive's publish step (SPEC §1, §7 T12). Its cross-repo rows
  are dispositioned in S.Z1 via the kf-side CONSUME gate (see S.Z1 scope).
- **The two external consume-edges (SPEC §1, §7 T12):** (1) **S.E6** — third-party glass-ui 5.0.0;
  may close S as a structured HANDOFF, in which case fold rows 51/52/53 are recorded as an **explicit
  non-terminal RESIDUAL CARRY** (never presented as terminals) and rendered in the S.Z3 FINAL as
  `HANDOFF — external — row N` (C-21). (2) **S.H4** — the owner-controlled parse-that publish. No
  other wave may acquire an external dependency; these are the **only** two edges the closeable
  roster subtracts.

**T11 (the risk signature) — this band's structural compensators (SPEC §7 T11).** S is deliberately
broad; S.Z carries three of the structural (not cited) compensators that de-risk it: **closure
re-execution** (S.Z2 re-runs every CLOSED wave's oracle), the **master-green-on-FINAL-SHA
precondition** (S.Z3), and the **contingency-KILL belt with the rows-51/52/53 residual-carry
honesty** (C-20/C-21). These pair with S.A's cause-shaped keystone and machine-distinguishable
FROZEN discharge.

**Rulings this band executes (SPEC §2.2).**

- **C-11 — `proof:engine-seam-split` formally KILLED.** Superseded by proof:engine's body-span
  clause + the S.B2 recursive-scan fix + the no-re-export-bridge clause. **Recorded in the S ledger;
  the KILL is ratified at S.Z** (fold row 22). *S.Z3 owns the ratification.*
- **C-18 — the generalized changelog gate's diff mechanism.** `docs/published-surface.md` is a single
  current file with no per-release history. The gate checks out the previous published tag's copy
  (`git show v<prev>:docs/published-surface.md`), diffs against HEAD, and REDs on any removed row
  lacking a matching `docs/MIGRATION-<new>.md` entry. The previous tag is resolved from npm
  `dist-tags.latest` (falling back to the highest `v*` tag). *S.Z3 references this as the mechanism
  any close-time surface removal must satisfy.*
- **C-20 — "Terminal" is defined structurally.** A chronic/deferral disposition is terminal ONLY if
  it is (a) a **deterministic re-shaped gate** — device-dependence folded OUT so the gate REDs
  honestly on any runner — or (b) an owner-**ratified KILL** with a re-run witness. "Observe-in-CI",
  "hard-on-device", WATCH, and re-verify verbs are NOT terminals. Every terminal disposition is
  re-derived from a **reproduced signature**, never inherited from the spec's pre-written guess.
  T3's deferral-verb meta-gate extends to the S ledger's disposition column. *S.Z1 clause (i) reds
  any recap row lacking a C-20 terminal disposition; S.Z2's T3 check runs the deferral-verb grep over
  the S ledger's disposition column.*
- **C-21 — the closeable roster (T10 ⊥ T12 reconciled).** S.Z3's from-clean full-roster run and
  T10's "no FINAL table smaller than the full roster" are satisfied against the **closeable roster**:
  the full roster MINUS owner-ratified external HANDOFF gates (each named by its §4 ledger row), with
  those gates rendered as `HANDOFF — external — row N` — an explicit third state, never omitted. The
  table still lists every gate; T10's airtightness and T12's escape coexist in one definition. *S.Z3
  owns the roster.*

---

## S.Z1 — The prompt-recap, total — with oracle-resolving teeth

**Mode: REWRITE (of the prompt-recap gate).** **Deps: all bands.**

### Charter

S's close must prove **every owner ask hitherto is ADDRESSED or explicitly dispositioned** —
against **r1's corpus** (the 100+ session-message mining), not against S's own charter alone (SPEC
§5). The recap re-derives, it does not chain-trust: it re-measures the two R reversals (keyframes-vue
KILL; the lint-tier retraction), the decomposition-spirit gap, **and r1's own ADDRESSED-map** (whose
device-dependence framing p12 refuted) against concrete oracles — every `ADDRESSED` row cites an
oracle that resolves and is green in the S.Z3 closeable-roster run (SPEC §3 S.Z1, §5; SZ-1/SZ-8). The
spirit column is the point: a recap that lists letter-compliance while the same mechanism leaks (r1's
headline) fails S's own bar (SPEC §5.5; sz-B1/B2/B6/B7).

### Scope items

- **S1 — The ask ledger materializes at `docs/tranches/S/PROMPT-RECAP.md`** — the gate's **fixed
  parse target** (SPEC §3 S.Z1, §5.1; SZ-7). Row shape, per ask:
  **ask → origin → letter-status → spirit-status (r1's leak analysis) → S disposition**
  (wave / KILL / HANDOFF / RESIDUAL CARRY).
- **S2 — The precept set the gate maps is the CITED enumeration** (SPEC §3 S.Z1; SZ-2): r1 §5's
  **twelve** kickoff asks (`r1:333-356`) + the **7-clause standing mandate** (`r1:60-71`). v1's
  unsourced "the nine in the kickoff" is **pruned** (the phrase is deleted; SPEC §8-item within the
  sz prune). The gate REDs if any enumerated precept lacks a band mapping (clause iii).
- **S3 — The three mandated re-verifications, bound to CONCRETE ORACLES** (SPEC §3 S.Z1; SZ-1/SZ-6):
  - **keyframes-vue KILL** → `npm view @mkbabb/keyframes-vue` returns **404** AND **repo-grep zero**
    (`r1:375`).
  - **lint-tier** (the R retraction re-measured) → dep-cruiser baseline `[]` + **the enforcer file
    exists**.
  - **decomposition-spirit** → S.B5's **empty-override + max-file-≤460L + no-re-export-bridge** exit
    codes.
- **S4 — Recap integrity, symmetric** (SPEC §3 S.Z1; SZ-8): the ledger **re-points** the
  apparatus/device rows from r1's p12-refuted device-dependence framing to **S.A0/S.A2's fix-by-cause
  dispositions**, and **re-measures r1's own ADDRESSED-map** rather than chain-trusting it (the recap
  must not chain-trust its own input's superseded narrative).
- **S5 — Cross-repo rows are dispositioned via the kf-side CONSUME gate** (SPEC §3 S.Z1): S.H,
  value.js dispatches — the ledger says so; **a sibling's internal gate is never cited as the
  oracle** (S.H4's own gates are born-SPECIFIED at the sibling's publish step, but the kf-side row's
  oracle is the CONSUME gate on the re-pinned artifact).
- **S6 — Mid-S ask capture (concrete mechanism, sz-B7)** (SPEC §3 S.Z1, §5.4; SZ-7): owner asks
  arriving mid-S are appended to **`docs/tranches/S/OWNER-ASKS.md`** with a wave assignment or an
  owner-ratified deferral. `proof:prompt-recap-s` asserts that file is **fully-dispositioned** — an
  appended ask without a disposition REDs (the F3 laundering guard, now with a mechanism).
- **S7 — MEMORY updates are listed as observe-tier** (SPEC §3 S.Z1): user-domain, **non-gated** —
  stated, not dressed as gated work.
- **S8 — The spirit column stays** (SPEC §3 S.Z1, §5.5): per-ask, **what would falsify "addressed"**.
- **S9 — Fold row 72: re-verify the four Q-assumed-landed debts** (SPEC §4 fold row 72; X1-2). DQ-4
  (false-RED S1/S2), DQ-5 (ci-coverage), DQ-6 (emerging-CSS-P2), DQ-7 (wave-charter) were dropped
  from the R ledger (r8-F2). They are **assumed FOLD-LANDED in Q; S.Z1's recap re-verifies each
  actually landed** (the same treatment DQ-1/DQ-2 received — closing r8-F2 totally). Each is a recap
  row citing a resolving oracle, subject to clause (ii).

### The HARD GATE — `proof:prompt-recap-s` (born-RED, rewritten)

**Gate name:** `proof:prompt-recap-s` (rewritten — the fixed parse target is
`docs/tranches/S/PROMPT-RECAP.md`).

**Gate criterion (SPEC §3 S.Z1; SZ-1) — row-shape alone can no longer green it:**

1. **(i)** REDs any row **without a terminal disposition** (C-20's structural definition — wave /
   ratified-KILL-with-re-run-witness / HANDOFF-with-named-re-entry / explicit RESIDUAL CARRY; a
   deferral verb standing alone is NOT terminal).
2. **(ii)** Every `ADDRESSED` row must name an oracle that **resolves to a real gate or
   live-observation artifact AND matches a green exit in the S.Z3 from-clean closeable-roster run** —
   **a cited oracle that is absent or red REDs the row** (row-shape alone can no longer green).
3. **(iii)** REDs if **any enumerated precept** (the twelve kickoff asks + the 7-clause standing
   mandate) **lacks a band mapping**.
4. Asserts `docs/tranches/S/OWNER-ASKS.md` is **fully-dispositioned** (S6) — an appended ask without
   a disposition REDs.

### Born-RED witness plan

On day zero `docs/tranches/S/PROMPT-RECAP.md` does not exist (or is a skeleton with un-dispositioned
rows) → the gate HARD REDS. The gate is discharged only when: every one of the enumerated precepts
maps to a band; every `ADDRESSED` row cites an oracle that is **green in the S.Z3 closeable-roster
run** (this couples the recap to Z3 — the recap cannot green before Z3's roster run exists and passes
for the cited oracles); the three re-verifications resolve (keyframes-vue `npm view` → 404 + grep
zero; dep-cruiser baseline `[]` + enforcer present; S.B5 exit codes); and `OWNER-ASKS.md` carries a
disposition for every appended ask.

### Non-vacuity (falsifiability, both ways)

**A planted un-dispositioned row AND a planted row citing a red oracle must EACH RED** (SPEC §3
S.Z1). Concretely: (a) inject a recap row with an empty disposition column → clause (i) REDs; (b)
inject an `ADDRESSED` row citing an oracle name that is absent from the roster, or one that is present
but red in the Z3 run → clause (ii) REDs; (c) delete a precept's band mapping → clause (iii) REDs; (d)
append an ask to `OWNER-ASKS.md` with no disposition → S6 clause REDs. A single generic plant is
insufficient — each clause has its own planted RED.

### Cost

One authored ledger (`PROMPT-RECAP.md`) covering the 12 kickoff asks + 7-clause standing mandate +
the r1-corpus asks; the `OWNER-ASKS.md` scaffold; the rewritten `proof:prompt-recap-s` script (parse
target + the three clause checks + the OWNER-ASKS fully-dispositioned check + the four non-vacuity
plants). The three re-verification oracles are cheap shell/grep probes; the ADDRESSED-oracle
cross-check consumes the S.Z3 roster run's exit map.

### Verification

The gate above IS the verification. The recap is re-measured, never chain-trusted (SPEC §5.2): r1's
own ADDRESSED-map is re-measured, the apparatus/device rows re-pointed to S.A0/A2, the two R reversals
and the decomposition-spirit gap bound to the S3 oracles. **This wave is development-only: the gate
ships born-RED** and is CLOSED only when re-run GREEN on the merged tree (T4); **S.Z2 re-executes it
at close.**

---

## S.Z2 — The tranche-development TEMPLATE, re-specified

**Mode: REWRITE (new template + meta-gate).** **Deps: Z1.**

### Charter

r2's failure/success taxonomy (T1–T12), restated as **mandates** and codified as
`docs/tranches/TEMPLATE.md` + **`proof:tranche-template`** — enforced by direct checks + sibling-gate
presence, **not by prose** (SPEC §3 S.Z2, §7; sz-B3, x2-#4; SZ-3). The gate has an **honest,
partitioned scope**: some mandates are FINAL-parseable and are directly checked; others are artifact
mandates and are asserted only via the PRESENCE + GREEN state of a named sibling gate. The meta-gate's
teeth are the **RE-EXECUTION clause**: it re-runs the closure oracle of every CLOSED wave (the Q-mode
cure). A **per-mandate non-vacuity plant table** proves each directly-checked clause bites
independently.

### The mandate set (SPEC §7 — the T1–T12 the template codifies)

The template enforces r2's taxonomy verbatim. The partition below (S1) maps each to its enforcement
mode.

- **T1 (no gate-shaped closures).** Every chronic/charter closure oracle is a runtime-tier gate that
  opens the dist and actuates; the reformed `proof:gate-is-runtime` (with the symmetric mis-tier
  clause) REDs any source-shape gate cited as a runtime closure — in **BOTH** tier directions (r2 F1,
  p08).
- **T2 (no self-certifying gates).** Ceiling overrides may only shrink or be data-volume-justified
  with a machine-checkable ratio; a cap **RAISED** vs the prior tranche is a hard RED (r2 F2). S.B5
  targets an EMPTY override map. Corollary (§2.1-5): **no numeric line count is a born-RED gate's
  GREEN criterion.**
- **T3 (no deferral laundering).** Override/close prose containing deferral verbs is cross-checked
  against the ledger by a meta-gate; a booked deferral without a ledger row REDs (r2 F3).
  **Extended (x2-#8): the same grep runs over the S ledger's disposition column** — a row whose
  disposition contains observe/watch/re-affirm/verify without a paired deterministic-re-shape or KILL
  row REDs (C-20).
- **T4 (DEVELOPED ≠ SHIPPED).** A wave is CLOSED only when its born-RED gate is GREEN **re-run on the
  merged tree**, exit code recorded in PROGRESS.md (r2 F4) — and **S.Z2 re-executes** that oracle at
  close (a re-run, not a re-read). S is development-only: every wave doc states this and its gate
  ships born-RED or, for the publish-coupled external edges (S.E6's consume gate + the S.H4 gates),
  born-SPECIFIED.
- **T5 (no transcript trust).** Parallel drives re-run every touched gate from a **clean independent
  checkout**; "pre-existing" claims are verified by triage, never accepted (r2 F5, a15). Worktree
  hygiene: **node_modules symlinks never git-added.**
- **T6 (no cosmetic excision).** An excision deletes the body, its tests, its gates, and its doc
  mentions; the whole-tree symbol grep is a discharge-checklist step (r2 F6, a09). The hardened
  `proof:no-orphan-module` (dynamic-import-aware, pinned roots — S.C1) makes the class structural.
- **T7 (gate follows code — including docs and its own coverage set).** A structural wave co-edits
  every gate whose scan geometry it changes (the p01 lesson: 10 sites, not 1), regenerates its
  before/after box from the shipped tree, and treats the architecture MAP as a gated deliverable.
  When a wave deletes a UI surface or a behavior, it must reconcile EVERY gate naming it — including
  gates that ARM on the deleted behavior (the p10 arming-audit class). Cross-band edits to one gate
  follow a named canonical order (scene-colocated: A4→D2→D3).
- **T8 (interaction-axis tests for hand-rolled primitives).** Any replacement for a vendor primitive
  ships with a keyboard/focus/repeat test, not only a source-shape gate (a12; fold row 71) — the
  documented gate-blindspot cure; live verification via chrome-devtools-mcp for every stage of
  S.E/S.G.
- **T9 (census before fiat).** No "keep verbatim / do not touch" verdict on a shared directory
  without an importer census shipped as evidence (a24 F8). Totality claims (NO-legacy) are proven by
  census-shaped gates (the S.C3a shadcn census clause), not by naming one island.
- **T10 (clean close).** Full `proof:all` + bench-compile from clean, citing the exact SHA, BEFORE
  the version/FINAL commit; a post-close fallout patch falsifies the close — enforced mechanically by
  S.Z3's post-close guard (any src/bench/scripts commit between the FINAL SHA and the tag REDs). No
  FINAL gate-state table smaller than the full roster (r8 F5). **Reconciled with T12 in one sentence
  (C-21):** T10 is satisfied against the *closeable roster* — the full roster with owner-ratified
  external HANDOFF gates rendered as the explicit third state `HANDOFF — external — row N`, never
  omitted and never counted green.
- **T11 (the risk signature).** Breadth + chronic-folding + a headline close claim is the recorded
  danger pattern (r2 Part V). S is deliberately broad and compensates **structurally**, not by
  citation (the compensators enumerated in §0 above; SPEC §7 T11). The adversarial critique fleet's
  corrections OVERRIDE raw findings while crediting real wins (r2 S6).
- **T12 (external gates are named, not assumed).** **Exactly two** external consume-edges exist
  (corrected from v1's false "exactly one"): **S.E6** (third-party glass-ui 5.0.0 — specified now,
  fires later; may close S as a structured HANDOFF, in which case fold rows 51/52/53 are an explicit
  non-terminal RESIDUAL CARRY, never presented as terminals) and **S.H4** (the owner-controlled
  parse-that 1.0.0 publish-then-re-pin; gates born-SPECIFIED, firing at the impl drive's publish
  step). No other wave may acquire an external dependency without an owner ruling; S.C3b is explicitly
  constructed to be internally closable.

### Scope items — the partitioned gate scope (SPEC §3 S.Z2; SZ-3)

- **S1 — Directly checked (FINAL-parseable):** `{T2 caps-only-shrink, T3 deferral-verb⇄ledger
  (including the S ledger's disposition column), T4/T5 exit-codes-recorded + clean-checkout-re-runs,
  T10 closeable-roster table + clean SHA}`. These the template gate parses out of the FINAL directly.
- **S2 — Sibling-asserted (artifact mandates):** for `{T1, T6, T7, T8, T9}` the template gate asserts
  **only the PRESENCE and GREEN state of the named sibling gate** in the close roster:
  - **T1 → `proof:gate-is-runtime`**
  - **T6 → `proof:no-orphan-module`**
  - **T7 → `proof:ci-coverage`** (+ the co-edit evidence)
  - **T8 → the B7 interaction-test suite**
  - **T9 → the importer-census artifacts cited by D2/C3**

  **"REDs on any violation" of the un-parseable mandates is an overclaim and is DELETED** — the
  template gate cannot parse those semantics out of a FINAL; it asserts the sibling gate's presence
  and green state instead.
- **S3 — The RE-EXECUTION clause (x2-#4 — the meta-gate's teeth):** the template gate **re-executes
  the closure oracle of every wave marked CLOSED** (a re-run, not a re-parse of the asserted exit
  code) and **REDs on any exit-code mismatch** — a FINAL that cites a green gate that is actually red
  at the close commit REDs (the Q-mode cure).
- **S4 — Per-mandate non-vacuity plant table (r2 S5):** one deliberately-malformed FINAL **per checked
  clause**, each with its **expected RED message** — a single generic plant proves one clause bites
  and says nothing about the others. The plant table REDs **row-by-row**.

### The HARD GATE — `proof:tranche-template` (born-RED)

**Gate name:** `proof:tranche-template` (NEW — over `docs/tranches/TEMPLATE.md` and S's own FINAL).

**Gate criterion:** parse S's FINAL for the directly-checked clauses (S1); assert presence + green
state of the five sibling gates (S2); **re-execute the closure oracle of every CLOSED wave and RED on
mismatch** (S3); and RED row-by-row against the plant table (S4).

### Born-RED witness plan + the per-mandate plant table

On day zero `docs/tranches/TEMPLATE.md` and `proof:tranche-template` do not exist → the gate HARD
REDS. The **plant table** is the born-RED evidence — one malformed FINAL per directly-checked clause,
each with its expected RED message:

| Planted defect (malformed FINAL) | Clause bitten | Expected RED |
|---|---|---|
| A ceiling override RAISED vs the prior tranche | **T2** | cap-raised hard RED (caps may only shrink / data-volume-justified ratio) |
| A booked deferral verb in the close prose with no ledger row; a ledger disposition column carrying `observe`/`watch`/`re-affirm`/`verify` with no paired re-shape/KILL row | **T3** | deferral-verb⇄ledger mismatch RED (extends over the S ledger disposition column) |
| A wave marked CLOSED whose exit code is not recorded in PROGRESS.md / whose clean-checkout re-run does not reproduce the asserted exit code | **T4/T5** | DEVELOPED≠SHIPPED / transcript-trust RED |
| A FINAL gate-state table smaller than the closeable roster, or a missing exact SHA, or an external HANDOFF gate omitted rather than rendered `HANDOFF — external — row N` | **T10** | roster-incomplete / SHA-absent / HANDOFF-omitted RED (C-21) |
| A FINAL citing a green gate that is actually RED at the close commit (the RE-EXECUTION clause) | **S3 / T4** | exit-code-mismatch RED (the Q-mode cure) |

Each planted FINAL REDs **only** its own clause with its named message; the plant table is checked
**row-by-row** (SPEC §3 S.Z2).

### Cost

The `docs/tranches/TEMPLATE.md` authoring (the T1–T12 mandates + the amendment-discipline note booked
to §8 Recorded-future item 7); the `proof:tranche-template` script (the S1 FINAL parser, the S2
five-sibling presence/green assertion, the S3 CLOSED-wave oracle re-executor, the S4 plant harness);
and the per-clause malformed-FINAL fixtures.

### Verification

The gate above IS the verification. The RE-EXECUTION clause is what turns the template from a
prose-parser into a re-derivation gate — it re-runs, it does not re-read (SPEC §3 S.Z2, X2-4). **This
wave is development-only: the gate ships born-RED** and is CLOSED only when re-run GREEN on the merged
tree (T4); S.Z2 (itself) is the close meta-gate, so its own oracle is re-executed as part of the S.Z3
closeable-roster run.

---

## S.Z3 — FINAL + version ruling + the keystone re-armed

**Mode: REWRITE (of the FINAL/close discipline).** **Deps: Z1, Z2.**

### Charter

The FINAL over a **from-clean closeable-roster run** with the exact SHA, gated on a **green master
push CI run on that SHA** (the A0 keystone re-gated at close — the Q/R red-master mode structurally
forbidden), guarded against post-close fallout, and carrying the **version decision as an OWNER RULING
with its inputs surfaced** (SPEC §3 S.Z3; sz-B4/B5/B8, x2-#4). It ratifies the C-11 KILL, retires the
stale MEMORY specular note, records DM-24 REVIVED, and routes the ownerless docs/precepts/audits to
§8 Recorded-future.

### Scope items

- **S1 — The FINAL over the CLOSEABLE ROSTER (C-21).** FINAL over a **from-clean** run of the full
  roster **MINUS owner-ratified external HANDOFF gates** named by ledger row, each rendered in the
  FINAL table as `HANDOFF — external — row N` — **an explicit third state, never omitted; the table
  lists every gate** — with the **exact SHA** (SPEC §3 S.Z3, §2.2 C-21, §7 T10). The subtracted
  external gates are exactly the two edges (S.E6 → fold rows 51/52/53; S.H4) — no wave may add a
  third (T12). If glass-ui 5.0.0 has **not** published, fold rows 51/52/53 are rendered as an explicit
  **non-terminal RESIDUAL CARRY** (never as terminals) and shown as `HANDOFF — external — row 51/52/53`
  (SPEC §1, §7 T12, C-12/C-20).
- **S2 — The born-RED master-green precondition (x2-#4).** `gh run list --workflow ci.yml --branch
  master` shows a **green push run on the FINAL SHA** — the A0 keystone re-gated at close. **The
  tranche is not closable over a red master** (the Q/R mode is structurally forbidden, not cited —
  both shipped via manual `workflow_dispatch` over a red master, SPEC §2.1-2). This precondition is
  **born-RED**: on day zero master is red (or no green run exists at the candidate SHA) → the close
  gate REDs (SPEC §3 S.Z3; §7 T11).
- **S3 — The post-close fallout guard (distinct from the FINAL parser).** The FINAL parser cannot see
  the future; the fallout guard is a **separate** mechanism: **any commit between the FINAL SHA and
  the version tag that touches `src/` / `bench/` / `scripts/` REDs** — the mechanical form of "a
  post-close fallout patch falsifies the close" (the **6f2493d anti-pattern**; SPEC §3 S.Z3, §7 T10;
  SZ-5).
- **S4 — The version decision — an OWNER RULING with its inputs SURFACED, not glossed (sz-B8).** The S
  impl cut is **additive-minor by default**, BUT (SPEC §3 S.Z3, §6.3; SZ-9):
  - **(i)** S.B6's **`=any → =Vars`** flip is a **source-breaking d.ts narrowing** for consumers
    passing arbitrary property bags — **potentially major**.
  - **(ii)** the **126-leaked-private API-Extractor strip** removes symbols from the rolled-up d.ts —
    whether leaked privates are "surface" for the generalized changelog gate is the **owner's call**.

  Both are **pre-booked as §6 owner questions** (§6.3); the default remains additive-minor and the
  ruling lands at S.Z3. **Any surface removal rides a MIGRATION doc per C-18** (the changelog gate
  checks out `git show v<prev>:docs/published-surface.md`, diffs against HEAD, and REDs on any removed
  row lacking a `docs/MIGRATION-<new>.md` entry; previous tag from npm `dist-tags.latest`, falling
  back to the highest `v*` tag).
- **S5 — Ratify the C-11 KILL (fold row 22).** `proof:engine-seam-split` was **never authored** and is
  **superseded** (C-11: by proof:engine's body-span clause + the S.B2 recursive-scan fix + the
  no-re-export-bridge clause). The KILL is **ratified at S.Z** and recorded in the S ledger (SPEC §4
  fold row 22, §2.2 C-11).
- **S6 — MEMORY updates (observe-tier; user-domain).** Stale specular note **retired** (fold row 54 —
  the M-era "specular=off" expectation; BG resolves affirmatively; observe-tier); dock-doubleclick
  **sharpened** (+ the E6 contingency — the DM-1 R.W6-precedent kf-internal press handler authored at
  E5-time so the ≥4-belt terminal does not depend on an external publish, fold row 53); **DM-24
  REVIVED recorded** (the N-Stage scene-switcher, owner-reopened → band S.E, fold row 17). These are
  MEMORY writes, **non-gated** (SPEC §3 S.Z3, §4 fold rows 54/53/17).
- **S7 — Route ownerless docs to §8 (fold row 65).** `docs/precepts/audits/` ownership → **§8
  Recorded-future** (owner): "fold or freeze" is a **non-decision** — a non-decision does not ship as
  a close deliverable (SPEC §3 S.Z3, §4 fold row 65, §8 item 6).

### The HARD GATE — the FINAL close gate (born-RED)

**Gate criterion (SPEC §3 S.Z3; x2-#4, C-21):**

1. **The closeable-roster run is from CLEAN, at the exact SHA, and the FINAL table lists every gate**
   (no table smaller than the closeable roster; external HANDOFF gates rendered `HANDOFF — external —
   row N`, never omitted, never counted green) — T10/C-21.
2. **`gh run list --workflow ci.yml --branch master` shows a GREEN push run on the FINAL SHA** — the
   born-RED precondition (S2). Absent → RED.
3. **The post-close fallout guard REDs on any `src/`/`bench/`/`scripts/` commit between the FINAL SHA
   and the version tag** (S3).
4. **Any published-surface removal (from the S4 version inputs) without a matching
   `docs/MIGRATION-<new>.md` entry REDs** (C-18 changelog gate).

### Born-RED witness plan

On day zero: master push CI is **red** (the 14-blocking-red plane of §2.1-2 that S.A0 discharges) →
precondition (2) REDs; there is no from-clean closeable-roster FINAL table → (1) REDs; the changelog
gate reds on any yet-unaccompanied surface removal → (4). The close gate greens only after **S.A0's
keystone is green (master turns fully green when the last enumerated backlog row's owning wave
closes)**, the closeable-roster run passes from clean at the FINAL SHA, every external HANDOFF gate is
rendered as the third state, and no post-FINAL src/bench/scripts commit exists before the tag.

### Non-vacuity (falsifiability)

- Render an external HANDOFF gate as omitted (or as green) rather than `HANDOFF — external — row N` →
  clause (1) REDs (C-21).
- Point the SHA at a commit with no green master push run → clause (2) REDs (the red-master forbidden
  mode).
- Land a `src/`/`bench/`/`scripts/` commit between the FINAL SHA and the tag → clause (3) REDs (the
  6f2493d anti-pattern).
- Remove a published-surface row (e.g. via the `=any→=Vars` narrowing or the private strip) without a
  `docs/MIGRATION-<new>.md` entry → clause (4) REDs (C-18).

### Cost

The FINAL authoring (the closeable-roster gate-state table with the third-state HANDOFF rows + the
exact SHA); the master-green precondition probe (`gh run list`); the post-close fallout guard (the
`src/bench/scripts` commit-range diff between FINAL SHA and tag); the C-18 changelog-gate wiring for
any S4 surface removal; the C-11 KILL ledger row; the three MEMORY writes (S6, observe-tier); the §8
routing of docs/precepts/audits (S7). The two version-input questions (S4) are **owner rulings** — no
engineering cost, but the ruling must land before the tag.

### Verification

The FINAL close gate above IS the verification, and it is the **re-derivation** discipline made
total: from-clean, at the exact SHA, over the closeable roster, gated on a green master at that SHA,
guarded against the future by the post-close fallout mechanism (SPEC §3 S.Z3). The version decision is
an owner ruling with both inputs (S4) surfaced explicitly to the owner, not glossed (SZ-9). **This
wave is development-only: the gate ships born-RED** (master is red on day zero; the closeable-roster
FINAL does not exist) and is CLOSED only when the whole close discipline re-runs GREEN on the merged
tree at the FINAL SHA (T4/T10). S.Z2's RE-EXECUTION clause re-runs S.Z3's own oracles as part of the
close.

---

## Appendix — fold rows this band lands (SPEC §4)

| Fold row | Item | S-disposition (this band) |
|---|---|---|
| 22 | `proof:engine-seam-split` never authored | **KILL — ratified at S.Z3** (superseded, C-11) |
| 54 | Stale MEMORY specular=off expectation | **S.Z3 S6** (retire — BG resolves affirmatively; observe-tier) |
| 65 | `docs/precepts/audits/` ownerless | **S.Z3 S7 → §8 Recorded-future (owner)** — "fold or freeze" is a non-decision; not a close deliverable |
| 72 | DQ-4 (false-RED S1/S2) · DQ-5 (ci-coverage) · DQ-6 (emerging-CSS-P2) · DQ-7 (wave-charter) — dropped from the R ledger (r8-F2) | **S.Z1 S9** — assumed FOLD-LANDED in Q; the recap re-verifies each actually landed (closing r8-F2 totally) |
| 51 | glass-ui `proof:glassui-aria-ask` PENDING-BC | **HANDOFF (owner)** — re-entry: BC/5.0.0 publish → S.E6; if 5.0.0 does not publish in S, **explicit non-terminal RESIDUAL CARRY** rendered `HANDOFF — external — row 51` in the S.Z3 FINAL (C-21) |
| 52 | glass-ui `proof:peer-satisfied` born-RED peer-cycle | **HANDOFF (owner)** — re-entry: glass-ui peer-widen → S.E6; same RESIDUAL-CARRY clause; rendered `HANDOFF — external — row 52` (C-21) |
| 53 | Dock double-click chronic | **HANDOFF sharpened + kf-internal CONTINGENCY FALLBACK** (kf-internal press handler authored at E5-time; the ≥4-belt terminal does NOT depend on an external publish); MEMORY dock-doubleclick note **sharpened at S.Z3 S6** |

## Appendix — §9 disposition rows this band absorbs (SPEC §9 sz-close, 9 edits)

| # | Edit (condensed) | Landed at |
|---|---|---|
| SZ-1 | `proof:prompt-recap-s`: ADDRESSED rows must cite an oracle that resolves AND matches a green exit in the from-clean roster run; bind the three re-verifications to concrete oracles | **S.Z1** (gate clause ii + the bound oracles) |
| SZ-2 | Replace the undefined "nine in the kickoff" with r1 §5's twelve kickoff asks + the 7-clause standing mandate, cited | **S.Z1 S2** (the cited precept enumeration; the phrase pruned) |
| SZ-3 | `proof:tranche-template`: directly check only {T2,T3,T4,T5,T10}; sibling-presence+green for {T1,T6,T7,T8,T9}; per-mandate non-vacuity plant table | **S.Z2** (the partitioned scope + the plant table) |
| SZ-4 | Define the closeable roster reconciling T10⊥T12; external HANDOFF gates as an explicit third state, never omitted | **S.Z3 S1** (C-21) |
| SZ-5 | Post-close fallout guard distinct from the FINAL parser (src/bench/scripts commit between FINAL SHA and tag REDs) | **S.Z3 S3** |
| SZ-6 | Name the keyframes-vue KILL re-verify oracle (npm view 404 + repo-grep zero) | **S.Z1 S3** (bound oracle) |
| SZ-7 | Give §5.4 mid-S ask-capture a concrete mechanism (fully-dispositioned OWNER-ASKS.md) + name the ask-ledger path | **S.Z1 S1/S6** (`docs/tranches/S/PROMPT-RECAP.md` + `OWNER-ASKS.md`) |
| SZ-8 | Re-point the recap's apparatus/device rows to S.A0/A2 fix-by-cause; re-measure r1's own ADDRESSED-map | **S.Z1 S4** (recap integrity, symmetric) |
| SZ-9 | Surface the two version questions (`=any→=Vars` narrowing; 126-private strip) to the owner, not glossed | **S.Z3 S4** (+ §6.3 owner questions) |
