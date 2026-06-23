# Q.W0 — record-hygiene + shipped-truth reconcile + CHRONIC_LEDGER re-pin

**Band:** A — Apparatus (the floor every Q wave stands on).
**Phase:** NOW (DEV; the ONLY phase this wave touches — Q.W0 authors artifacts + applies the
record-hygiene edit-spec; it writes NO engine/demo/library source). · **Class:** INFRASTRUCTURE
(the charter substrate + the 31-lane audit digest every Band-A…Z wave rides).
**Sequence (the DAG edge):** `Q.W0 (this) ─► A{Q.WA1 lint-tier || Q.WA2 drag2D-cert || Q.WA3 CI-green+merge || Q.WA4 wave-charter+DAG}`.
Q.W0 LEADS the tranche — the born-RED gate (`proof:record-truth`) and the dev→impl boundary witness
must both close before any Band-A wave opens. This is exactly the O.W0 / P.W0 dev→impl boundary,
carried forward unchanged. inv-16 holds throughout: NO kf source is authored here.
**Owning-DM-or-idea:** the post-impl-drive record-staleness cluster (audit **B7-shipped-regression**
+ **B7-honesty-record** — the IMPL-RUN-BOARD internal contradiction, the dual deploy-hash, the stale
P/O PROGRESS headers, the un-merged 4.4.0 tip) + the **B6-band-structure** Q-charter synthesis ask +
the `proof:chronic-closure` P→Q LEDGER re-point (the parse-target moves forward in ONE motion at the
Q open, as it did I→J→L).

This wave is the **record reconciliation**, not a strategy change: it makes the on-disk tranche
record tell the truth about the just-shipped 4.4.0 impl drive, lands the Q charter substrate, and
re-points the chronic-ledger parse target P→Q. It ships ZERO engine/demo/library source. It mirrors
O.W0/P.W0 exactly, re-phased for the post-drive reality: where O.W0 opened a fully-unbuilt dev
tranche, Q.W0 opens over a tree that **already shipped** (kf 4.4.0 + value.js 1.1.0 + parse-that
0.12.0 + a verified deploy), so its primary load is *reconciling the record to the shipped truth*.

---

## §Context — why this wave, what audit evidence it folds

The 4.4.0 impl drive shipped the constellation critical path (3 publishes + a verified CF-Pages
deploy of `keyframes.babb.dev`) but left the **tranche record systematically stale** — the exact
failure mode the `record-as-built` precept guards against. The audit (`docs/tranches/Q/audit/AUDIT-31.md`,
lanes **B7-shipped-regression** + **B7-honesty-record**) caught six concrete record defects, NONE
of which is a code regression (the code/deploy/pin layer is sound — all 4 named kf gates PASS on
HEAD, pins are registry-consistent, the live origin serves the locally-built bundle):

1. **`docs/tranches/P/IMPL-RUN-BOARD.md` internal contradiction** — the Phase ledger TABLE (lines 16–18)
   still marks rows 3a/3b/4 as `⬜ PENDING` (confirmed live — `grep -c "⬜ PENDING"` == 3), while the
   banner directly below (lines 20–25) declares "DRIVE COMPLETE. All 4 phases shipped + verified + live."
   A self-contradiction in the *primary* impl record. (`AUDIT-31.md` B7-shipped-regression,
   RECORD-HONESTY FAILURE HIGH.)
2. **Dual deploy-hash, both labeled authoritative** — `docs/tranches/P/IMPL-RUN-BOARD.md`:22 cites
   `index-e9_Uza8v.js` as "the exact deployed hash" while :24 cites `index-DwKmrGBp.js` "hash-verified".
   The live site serves `DwKmrGBp`; `e9_Uza8v` is a superseded intermediate. (B7-shipped-regression, MEDIUM.)
3. **P/PROGRESS.md + P.md + O/PROGRESS.md stale headers** — P/PROGRESS.md line 13 reads "Version in
   tree: 4.3.0 (the K close cut, unchanged through O dev phase)" (actual tree is 4.4.0, tag v4.4.0
   exists); the headers still read "DEVELOPMENT PHASE — DOCS ONLY" though the owner authorized the
   impl drive 2026-06-23. (B7-honesty-record, HIGH/MEDIUM.)
4. **The 4.4.0 tip is NOT merged to master** — the v4.4.0 release commit is `c69bbb0` (tag `v4.4.0`),
   the drive tip is `df78088` (3 commits later); `git merge-base --is-ancestor c69bbb0 master` = NO (and
   `… df78088 master` = NO); master tip is `aef3ef3` (the M consume-edge); `master...tranche-p-dev` = 0/21
   (re-confirmed live; was 0/18 at the audit snapshot, +3 Q-doc commits since). The published 4.4.0 + the
   live deploy were cut from `tranche-p-dev`. (B7-shipped-regression PROCESS REGRESSION HIGH; B1-deploy-ci
   BLOCKER.) *The merge itself is the subject of Q.WA3 — Q.W0 records the divergence as a tracked
   obligation, not a silent gap. The Q.WA3 `proof:published-on-master` gate keys on the `v4.4.0` tag
   commit (c69bbb0), NOT a frozen hash.*
5. **`proof:no-deprecated-guard` is a misnomer** — it gates the vue-router `next()`-callback removal
   (H.W1 S5), NOT the @deprecated `Animation`/`ScrollTimeline` kf aliases. A reviewer scanning the
   gate roster would assume the deprecated-alias surface is covered when it is not. (B7-shipped-regression
   RECORD-HONESTY TRAP MEDIUM.) *The actual alias gate (`proof:alias-dropped`) is **Band-E / Q.WE1** work
   (the single owner, gate-first); Q.W0 names the misnomer + dispatches the coverage to its owning wave.*
6. **Uncommitted device-dependent decision-JSONs** — `scripts/soa-composite-decision.json` +
   `scripts/spring-vector-decision.json` are dirty in the working tree (re-measurements written on
   gate run). (B7-shipped-regression RECORD-HYGIENE SMELL LOW; confirmed live — `git status` shows BOTH
   `M scripts/soa-composite-decision.json` AND `M scripts/spring-vector-decision.json`.)

Beyond the record-truth cluster, Q.W0 lands the **Q charter substrate** (the `B6-band-structure`
deliverable) and re-points the **chronic-ledger parse target**: `proof:chronic-closure` parses
`<tranche>/PROGRESS.md §"Open deferrals"` and moves the target forward at each close (verified —
`scripts/proof-chronic-closure.mjs` lines 53–62 record the I→J substrate transition; the P→Q
re-point is the same motion). The `CHRONIC_LEDGER` is pinned **3 tranches stale** (Q.md:41) — Q.W0
authors `docs/tranches/Q/PROGRESS.md §"Open deferrals"` as the new parse target and the
`audit/chronic-ledger-Q.md` companion, so every Q chronic has a terminal row before any cure is authored.

**The shipped substrate Q.W0 rides** (the floor Q inherits — Q.W0 records the deploy oracle live,
does NOT re-certify the code): kf 4.4.0 (tag v4.4.0) published; value.js 1.1.0 + parse-that 0.12.0
published + consumed green; `keyframes.babb.dev` serves the locally-built single bundle
`index-DwKmrGBp.js` (round-trip genuine — B7-shipped-regression STRENGTH). These stand; Q.W0 records
the deploy origin as the Q tranche opening oracle and re-states the boundary. *The* code *is sound;
the* record *is stale — Q.W0 cures the record.*

**Why this is a wave, not a preamble.** Q is an eight-band terminal tranche with a DAG whose Band-A
leads unblock every later band. Before any cure is authored, the charter (`Q.md`), the 31-lane audit
digest (`AUDIT-31.md`), the Q chronic-ledger parse-target substrate (`Q/PROGRESS.md §"Open
deferrals"`), the chronic-fold ledger with a real terminal per item (`audit/chronic-ledger-Q.md`), the
prompt-recap (zero-drops), and the record-truth reconciliation must ALL be on disk and re-runnable —
AND the dev→impl boundary must be checkable at the tranche level. That checkability is the Q.W0
deliverable, gated born-RED.

---

## §Scope — the S-clauses (each a concrete falsifiable deliverable)

### S1 — Reconcile `docs/tranches/P/IMPL-RUN-BOARD.md` to the shipped truth (the primary impl record)

**Breach.** `docs/tranches/P/IMPL-RUN-BOARD.md` self-contradicts: the Phase ledger table (lines 16–18)
shows rows 3a/3b/4 `⬜ PENDING` (confirmed live — `grep -c "⬜ PENDING"` == 3) while the banner below
(lines 20–25, the "CORE DAG COMPLETE (2026-06-23)" block at :20) declares "DRIVE COMPLETE. All 4 phases
shipped + verified + live." (B7-shipped-regression).

**Deliverable.** Edit `docs/tranches/P/IMPL-RUN-BOARD.md` so the Phase ledger table marks 3a/3b/4
`✅ DONE`, the stale "Phase 3a IN PROGRESS" last-leg narrative is collapsed to the completed state, and
the dual deploy-hash is resolved: mark `index-e9_Uza8v.js` (line 22, "the exact deployed hash")
**SUPERSEDED**, assert `index-DwKmrGBp.js` (line 24, "hash-verified") as the single live hash
(gate-witnessed by the live `curl` in S5). DOCS-ONLY — no source change.

**Falsifiable.** `grep -c "⬜ PENDING" docs/tranches/P/IMPL-RUN-BOARD.md` within the Phase-ledger block
== 0; the surviving `e9_Uza8v` row carries a `SUPERSEDED` annotation;
`grep -c "DwKmrGBp" docs/tranches/P/IMPL-RUN-BOARD.md` ≥ 1 with a "single live hash" assertion.
`proof:record-truth` (§Born-RED) clause (a) asserts this against the FULL path (a bare
`IMPL-RUN-BOARD.md` resolves from repo-root and finds nothing — the path MUST be qualified).

### S2 — Re-header the stale P/O development-phase boards to "PARTIALLY IMPLEMENTED in 4.4.0"

**Breach.** `docs/tranches/P/PROGRESS.md` (lines 12–13) carries `**Version in tree:** \`4.3.0\` (the K
close cut, unchanged through O dev phase)` (markdown-formatted, NOT the bare literal — the audit's
"line 13 verbatim" quote predates a re-flow; the load-bearing observable is the **`4.3.0` version claim
with ZERO `4.4.0` mention**, confirmed live: `grep -c "4.4.0" docs/tranches/P/PROGRESS.md` == 0);
`docs/tranches/P/P.md` + `docs/tranches/P/PROGRESS.md` + `docs/tranches/O/PROGRESS.md` carry
"DEVELOPMENT PHASE" headers (confirmed live: `grep -c "DEVELOPMENT PHASE" docs/tranches/P/PROGRESS.md`
== 1) though the impl drive shipped (B7-honesty-record).

**Deliverable.** Re-header P/PROGRESS.md + O/PROGRESS.md to "PARTIALLY IMPLEMENTED in 4.4.0"; correct
the in-tree version line from `4.3.0` to `4.4.0` across both boards; add a one-line banner to P.md noting
the owner authorized impl 2026-06-23 and the 4.4.0 cut shipped a *subset* of P's developed waves (the
rest are Q terminals — point at this charter). The boards become record-honest about what shipped vs.
what Q carries forward.

**Falsifiable (matched to the ACTUAL markdown, not the bare literal).**
`grep -E "Version in tree.{0,8}4\.3\.0" docs/tranches/P/PROGRESS.md` → ZERO matches after cure (the
`4.3.0` version claim is gone — this pattern tolerates the `**…**`/backtick formatting that broke the
audit's bare-literal grep); `grep -c "4.4.0" docs/tranches/P/PROGRESS.md` ≥ 1;
`grep -c "PARTIALLY IMPLEMENTED" docs/tranches/P/PROGRESS.md docs/tranches/O/PROGRESS.md` ≥ 2. Clause
(b) asserts this. *Born-RED witness today: the `Version in tree.{0,8}4\.3\.0` pattern MATCHES (1 hit)
and `4.4.0` count is 0 — the board is provably stale.*

### S3 — The Q charter substrate on disk (the band-structure synthesis)

**Deliverable.** `docs/tranches/Q/Q.md` committed (authored by the charter wave; Q.W0 records its
presence + canonical phrasing) + the 31-lane digest `docs/tranches/Q/audit/AUDIT-31.md` re-runnable.
The charter names the eight bands (`Q.md §2`), the phase axis (NOW/DISPATCH/GATED/USER-DOMAIN), the
DAG (`Q.md §3`), the version narrative (`Q.md §4`), the no-deferral mandate (`Q.md §1`), and the
dev→impl boundary (`Q.md §8`). Every Q wave's born-RED witness traces to an `AUDIT-31.md` lane anchor.

**Falsifiable.** `ls docs/tranches/Q/Q.md docs/tranches/Q/audit/AUDIT-31.md` exits 0; `Q.md` names
Q.W0 through Q.WZ in the §2 band table; `grep -c "no-deferral\|no deferral\|NO deferrals" Q.md` ≥ 1
(the terminal mandate named, non-re-litigable). Clause (c) asserts this.

### S4 — The Q chronic-ledger parse-target substrate + the P→Q re-point (the no-silent-drop oracle)

**Breach.** `CHRONIC_LEDGER` is pinned 3 tranches stale (Q.md:41); `proof:chronic-closure` still
parses an older `<tranche>/PROGRESS.md §"Open deferrals"`. The parse target must move P→Q in ONE
motion (the I→J substrate-transition discipline, `scripts/proof-chronic-closure.mjs:53–62`).

**Deliverable.** Author `docs/tranches/Q/PROGRESS.md §"Open deferrals"` — the complete item-by-item
Q deferred ledger (the direct successor to P's, built from the `proof:chronic-closure` substrate),
naming the **P-invariant-28 terminal register**: every deferred + chronic item the impl drive left
(DM-2 DemoControlPoint the NINTH carry; DM-22 NaN-frame; the @deprecated aliases; the S1/S2 false-RED
arms; the dead 0.12.0 API; the leaves.ts duplicates) gets a row with (tag, owning Q wave, tripwire).
Author the `docs/tranches/Q/audit/chronic-ledger-Q.md` companion (the P-inv-28 chronic register — this
is the DEV-authored ledger file already on the tree; there is NO separate `deferred-ledger-Q.md`).
The `proof:chronic-closure` LEDGER re-point P→Q is recorded here as Q.W0's clause (the re-point itself
lands when the gate's parse target is repointed — Q.WZ confirms the close; Q.W0 authors the substrate
it will parse).

**Falsifiable.** `ls docs/tranches/Q/PROGRESS.md docs/tranches/Q/audit/chronic-ledger-Q.md` exits 0;
`grep -c "Open deferrals" docs/tranches/Q/PROGRESS.md` ≥ 1; `grep -c "DM-2" docs/tranches/Q/PROGRESS.md`
≥ 1 (the NINTH-carry DemoControlPoint named, not silently dropped);
`grep -Ec "P-invariant-28|P-inv-28" docs/tranches/Q/PROGRESS.md` ≥ 1. Clause (c) asserts this. *These
artifacts are DEV-authored already on the tree — Q.W0's gate confirms they STAY present (a regression
guard), it does NOT claim they are born-absent; the born-RED rests on the gate-script + the
reconciliation edits being absent, not these DEV docs — see §Born-RED witness.*

### S5 — The deploy round-trip re-observation (the Q opening oracle)

**Deliverable.** The 4.4.0 deploy round-trip is re-observed live at the Q.W0 open and recorded here:
the live origin `keyframes.babb.dev` serves `index-DwKmrGBp.js` (the locally-built single bundle —
B7-shipped-regression STRENGTH). This observation is the Q tranche opening oracle — the floor Q
converges above. The Q deploy re-observation on the 5.0.0 cut + the auto round-trip restoration is
Q.WZ's clause (gated on the master-merge in Q.WA3 + the USER-DOMAIN publish).

**Falsifiable.** This file cites the served live origin (`keyframes.babb.dev`) + the served bundle
hash (`index-DwKmrGBp.js`); both reproducible — `curl -s https://keyframes.babb.dev/` returns the
served bundle reference. Clause (e) asserts these are recorded.

### S6 — Commit-or-revert the dirty decision-JSONs + name the `proof:no-deprecated-guard` misnomer

**Breach.** `scripts/soa-composite-decision.json` + `scripts/spring-vector-decision.json` are dirty
in the tree (device-dependent re-measurements — `git status` confirms BOTH are `M`: `M scripts/soa-composite-decision.json`
+ `M scripts/spring-vector-decision.json`); `proof:no-deprecated-guard` is misleadingly named (gates
vue `next()`, not the kf aliases).

**Deliverable.** Commit (or revert to the recorded verdict) the decision-JSONs to a FINAL committed
state, with a note that the gates rewrite them on run (a deterministic-write or .gitignore disposition
is a Q.WA3 CI-harden concern — Q.W0 records the obligation). Name the `proof:no-deprecated-guard`
misnomer in `docs/tranches/P/IMPL-RUN-BOARD.md` + this wave + the Q.W0c gate-name-honesty handoff, and DISPATCH the
actual deprecated-alias gate (`proof:alias-dropped`) to its owning no-legacy wave (**Q.WE1** authors it
gate-first AND drops the aliases — the single owner) — Q.W0 does NOT author the alias gate (Band E's terminal),
it records the coverage gap + names the owner.

**Falsifiable.** `git status --porcelain scripts/*-decision.json` is EMPTY (committed/reverted);
`grep -c "no-deprecated-guard.*next\|misnomer\|gates vue" docs/tranches/P/IMPL-RUN-BOARD.md docs/tranches/Q/waves/Q.W0.md`
≥ 1 (the misnomer named). Clause (f) asserts this.

---

## §Born-RED gate — `proof:record-truth` (over the REAL observable, inv-observable-truth)

**Gate name:** `proof:record-truth` (NEW — does not exist today; wired to `npm run proof:record-truth`
+ prepended to the `proof:hygiene` roster in `package.json`). A pure-node repo-structure + record-grep
gate (`scripts/proof-record-truth.mjs`, ~70 LOC) — no playwright, no DOM, **AXIS-3 STATIC** (a
record-honesty invariant belongs in a sub-second static rule).

**The REAL observable it bites (NOT a proxy):** the genuine defect this gate catches is *the Q tranche
opening on a self-contradictory primary impl record, a stale version line, an absent chronic-ledger
parse target, or a kf source file authored in the DEV-phase wave* — i.e. the record lies about the
shipped truth, or the dev→impl boundary is breached. The O.W0 / L.W1 S4 lesson is the keystone: a gate
that asserts a proxy misses the real breach. Here the gate asserts the ACTUAL record bytes on disk, the
ACTUAL `git diff --stat` over `src/`/`demo/`, the ACTUAL chronic-ledger substrate, and the ACTUAL
served live origin — each the genuine observable, each independently falsifiable.

**What it asserts (six clauses):**

**(a) IMPL-RUN-BOARD reconciled (S1, S6).**
```
grep -c "⬜ PENDING"  <Phase-ledger block of docs/tranches/P/IMPL-RUN-BOARD.md>  == 0   # 3a/3b/4 cured
grep -c "DwKmrGBp"    docs/tranches/P/IMPL-RUN-BOARD.md                          >= 1   # single live hash
grep    "SUPERSEDED"  docs/tranches/P/IMPL-RUN-BOARD.md  near the e9_Uza8v row    present # stale hash demoted
git status --porcelain scripts/*-decision.json                                  == ""  # JSONs committed
```
BITE: reds if the primary impl record still self-contradicts or carries a dual authoritative hash, or
a device-dependent decision-JSON dirties the tree.

**(b) P/O boards re-headered to the shipped truth (S2).**
```
grep -Ec "Version in tree.{0,8}4\.3\.0"  docs/tranches/P/PROGRESS.md    == 0   # tolerant of **…**/backtick
grep -c "4.4.0"                          docs/tranches/P/PROGRESS.md    >= 1
grep -c "PARTIALLY IMPLEMENTED"  docs/tranches/P/PROGRESS.md docs/tranches/O/PROGRESS.md  >= 2
```
BITE: reds if the dev-phase boards still claim the stale 4.3.0 in-tree version or a "DEVELOPMENT PHASE"
header after the impl drive shipped — the systematic-staleness the honesty-record lane found. *The
`-E "…{0,8}4\.3\.0"` pattern is REQUIRED: the bare `"Version in tree: 4.3.0"` literal does NOT match the
live `**Version in tree:** \`4.3.0\`` markdown, so a bare-literal grep would FALSE-GREEN on today's stale
tree (the exact proxy-trap the gate exists to avoid).*

**(c) The Q charter + chronic-ledger substrate present (S3, S4).**
```
assert ls docs/tranches/Q/Q.md                              → exits 0
assert ls docs/tranches/Q/audit/AUDIT-31.md                 → exits 0
assert ls docs/tranches/Q/waves/Q.W0.md                     → exits 0   # this file
assert ls docs/tranches/Q/PROGRESS.md                       → exits 0
grep -c  "Open deferrals"          docs/tranches/Q/PROGRESS.md   >= 1
grep -c  "DM-2"                    docs/tranches/Q/PROGRESS.md   >= 1   # the NINTH carry named
grep -Ec "P-invariant-28|P-inv-28" docs/tranches/Q/PROGRESS.md   >= 1
assert ls docs/tranches/Q/audit/chronic-ledger-Q.md         → exits 0   # the DEV-authored companion
grep -Ec "no-deferral|NO deferrals" docs/tranches/Q/Q.md         >= 1
```
BITE: reds if the charter substrate, the chronic-ledger parse target, or the no-deferral mandate is
missing — the `proof:chronic-closure` Q parse-target has no terminal substrate.

**(d) The dev→impl boundary witness — NO Q source authored (inv-16, the boundary's REAL observable).**
```
assert (git diff --stat <Q.W0-base>..HEAD -- src/ demo/) == EMPTY
# the DEV-phase wave touches docs/ + scripts/<the gate> ONLY; zero engine/demo/library source
```
BITE: reds if ANY file under `src/` or `demo/` is modified by this DEV-phase wave — the dev→impl
boundary made checkable at the tranche level. Q.WA1…Q.WZ implementation opens ONLY on explicit
authorization. This is the REAL observable of inv-16 — not a "docs only" comment but the actual diff.

**(e) The deploy oracle recorded (S5).**
```
grep -c "keyframes.babb.dev"  docs/tranches/Q/waves/Q.W0.md  >= 1
grep -c "index-DwKmrGBp.js"   docs/tranches/Q/waves/Q.W0.md  >= 1
```
BITE: reds if the deploy oracle is not recorded — Q would open on an un-witnessed deployed build.

**(f) The gate-name misnomer named + the alias-gate coverage dispatched (S6).**
```
grep -c "no-deprecated-guard"  docs/tranches/Q/waves/Q.W0.md  >= 1   # the misnomer is on record
grep -c "proof:alias-dropped"  docs/tranches/Q/waves/Q.W0.md  >= 1   # the real gate dispatched to its owner
```
BITE: reds if the deprecated-alias coverage gap is left unowned — a reviewer would assume the alias
surface is gated when it is not.

**Witness input that REDs on today's tree (pre-cure) — the HONEST born-RED (the gate-script + the
reconciliation edits are what is absent; the DEV docs are already authored):**

The DEV-authoring lane has ALREADY committed the charter substrate (`Q.md`, `DAG.md`, `Q/PROGRESS.md`,
`prompt-recap-Q.md`, `audit/chronic-ledger-Q.md`, this `Q.W0.md` — all on the tree, confirmed). So
clause (c)'s presence-asserts are GREEN. The genuine born-RED is at the IMPL layer:
- **The gate cannot even RUN** — `scripts/proof-record-truth.mjs` does NOT exist (confirmed:
  `ls scripts/proof-record-truth.mjs` → No such file). A gate that does not exist is the keystone RED —
  every clause is un-runnable until the script lands.
- **Clause (a): RED** — `docs/tranches/P/IMPL-RUN-BOARD.md` still shows 3× `⬜ PENDING` rows + the dual
  hash (confirmed: `grep -c "⬜ PENDING"` == 3; both `e9_Uza8v` + `DwKmrGBp` present, neither annotated
  SUPERSEDED); AND `scripts/soa-composite-decision.json` + `scripts/spring-vector-decision.json` are
  dirty (`git status --porcelain` → 2× `M`).
- **Clause (b): RED** — `grep -E "Version in tree.{0,8}4\.3\.0" docs/tranches/P/PROGRESS.md` matches
  (1 hit) and `grep -c "4.4.0"` == 0; the "DEVELOPMENT PHASE" header is still present (1 hit). Provably stale.
- **Clause (c): the presence-asserts GREEN** (the DEV docs exist) BUT the clause is un-runnable until
  the gate script lands — so it counts as RED-by-un-runnability today, GREEN-by-presence once the script
  exists. The clause is a STANDING REGRESSION GUARD (it reds if a later wave DELETES one of these docs),
  not a born-absent assertion.
- **Clause (d): GREEN-while-undisturbed** — passes only while no `src/`/`demo/` diff exists; the IMPL
  edits touch `docs/` + `scripts/<the gate>` ONLY.
- **Clauses (e)/(f): GREEN-by-presence** once this spec is committed (the deploy oracle + the misnomer +
  `proof:alias-dropped` dispatch are all recorded in THIS file — confirmed below); un-runnable until the
  gate script lands.

This is a GENUINE born-RED on the real observable: **the absent gate script + the un-reconciled primary
impl record + the stale P/O version line + the dirty decision-JSONs** — NOT a claim that the
already-authored DEV charter docs are missing (they are not). The honesty here IS the point: a false
"the docs are absent" born-RED would be the very record-lie this wave exists to kill.

**Greens on the cure:** reconciling IMPL-RUN-BOARD + the P/O boards + committing this wave spec + the
charter + the chronic-ledger substrate + committing/reverting the decision-JSONs — with zero
`src/`/`demo/` diff — closes all six clauses → the gate exits 0.

**Implementation locus:** `scripts/proof-record-truth.mjs` (NEW node script). Add under
`proof:record-truth` in `package.json` and prepend to the `proof:hygiene` chain — so every subsequent
Q wave's CI run exercises clauses (a)/(b)/(c)/(d)/(e)/(f) and re-confirms this wave's record + the
dev→impl boundary are undisturbed.

---

## §Dependencies

**No sibling publish gate.** Q.W0 is entirely kf-repo-internal (charter + ledger + recap + the
record-reconciliation edits + one node gate script). The digest DESCRIBES asks to siblings — it does
not CONSUME anything; no sibling is required to have published.

**Prerequisite (already met):** kf 4.4.0 published + the CF-Pages deploy live (re-observed at this
wave open at `keyframes.babb.dev` serving `index-DwKmrGBp.js`). This is the impl-drive oracle; Q.W0
records it, does not re-derive it.

**Feeds Q.WA1+:** `proof:record-truth` enters the `proof:hygiene` chain (which `proof:all` runs) —
every later wave's CI run exercises clause (d) and re-confirms the dev→impl boundary held. Q.WA3
(CI-green + master-merge) consumes Q.W0's recorded master-divergence obligation (S1 clause 4 of the
context); Q.WA4 (`proof:wave-charter` + the DAG manifest) reads this charter's band table + the
`AUDIT-31.md` anchors. Band E (Q.WE1 alias-drop) is the named owner of the `proof:alias-dropped` gate
Q.W0 dispatched (S6).

---

## §dev→impl boundary

This file is the Tranche Q DEVELOPMENT spec for Q.W0 — DOCS ONLY. It writes zero engine/demo/library
source (inv-16: kf writes only keyframes.js). The IMPLEMENTATION (the record-reconciliation edits, the
charter + chronic-ledger substrate, the `proof-record-truth.mjs` gate, the CI wiring) opens only on the
owner's explicit authorization. When it opens it is gate-first (`proof:record-truth` authored born-RED
BEFORE the edits land), observable-truth (the gate bites the actual record bytes + the actual `git diff`
+ the actual served origin, never a proxy), no-legacy (the stale `⬜ PENDING`/`4.3.0`/dual-hash framing
is DELETED, not annotated-beside), KISS (one node gate + targeted record edits), gestalt (the record
tells ONE truth — the shipped 4.4.0 reality), and P-invariant-28 (the chronic-ledger parse target moves
P→Q in ONE motion; every chronic gets a terminal row NOW — no "ABSOLUTE FINAL" without a system-gate
exit, the DM-2 NINTH-carry lesson).

---

## §Mid-tranche-friction pre-emption

**Friction this wave could spawn:** Q.W0's record-reconciliation touches IMPL-RUN-BOARD.md /
P-PROGRESS / O-PROGRESS — the SAME docs that other Q lanes' waves (Band-E no-legacy, the band-structure
charter wave) will re-edit. If sequenced naively, two waves could collide on the same Phase-ledger or
version line. **PRE-EMPT:** Q.W0 owns the *record-truth* edits (the Phase table, the hash, the version
line, the headers) as a SINGLE one-commit hygiene pass that lands FIRST in Band A; every later wave
edits only ITS band's rows in the now-honest ledger (the Q charter's DAG places Q.W0 at the band root).

**Second friction:** `proof:record-truth` clause (a)/(e) could become network-dependent if it curls
the live site (the device-dependence class the CI-greening memory warns of — it would flake offline /
on the slow Linux runner). **PRE-EMPT:** Q.W0's gate asserts the *recorded* hash bytes in this wave
spec (a static grep), NOT a live fetch; the live `curl` re-observation is a one-time human-authoring
oracle recorded in S5, mechanized only as the Q.WA3 deploy-round-trip leg (an observe-only CI posture).
Clause (e) greps the recorded string — device-independent BY CONSTRUCTION.

**Third friction:** clause (d) "no `src/`/`demo/` diff" will FAIL the moment a later Band-A/B/C wave
implements — but those waves are post-authorization IMPL, not this DEV wave. **PRE-EMPT:** the gate
diffs against the Q.W0-base (the DEV-phase commit range), so it witnesses only THIS wave's docs-only
discipline; the IMPL waves carry their OWN born-RED gates over their OWN source.
