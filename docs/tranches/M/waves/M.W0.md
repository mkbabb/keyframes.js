# M.W0 — Audit-fold + path forward

**Phase:** DEV (now; the ONLY phase this wave touches — M.W0 authors artifacts, writes no
engine/demo/library source) · **Class:** INFRASTRUCTURE (the charter substrate + the 32-lane
evidence base every Band-A/B/C/D/E wave rides) · **Leads the tranche** — the born-RED gate
(`proof:audit-artifacts-M`) and the deploy oracle re-observation must both close before M.W1
(the keystone runner) opens. inv-16 holds throughout: NO kf source is authored here. This is
exactly the L.W0 dev→impl boundary, carried forward unchanged.

---

## §Context — why this wave, what audit evidence it folds

L **CLOSED + committed** on `tranche-l-dev` (`529fcfd` the WZ close; `proof:chronic-closure`
re-pointed K→L; `4b3d2eb` seeds the M gate-apparatus verdict). L was not a partial close — it
totalized the bi-directional CSS round-trip (replay-equality across `@property` /
per-stop-composition / named-selectors / multi-color / scroll), made the gate-suite
device-honest, shipped SOTA-perf increments + the agent-authoring verb, closed the dogfood
loop, dispatched + armed the constellation, and refined the instrument-language design. Every
L Band-A boundary was signed by a born-RED oracle re-run GREEN at the close (`L/FINAL.md
§S1–§S4`). Band B closed **entirely un-consumed** — all five consume-edges PENDING their named
sibling publish, each with a born-RED kf gate RE-RUN RED-by-design.

M is chartered by the owner (2026-06-17): **DEEPLY audit (32 agents) the original plan + all
changes; consider the value.js + parse-that + glass-ui-BB tranches; devise a path forward
holding NO quick solutions / NO workarounds / idiomatic-gestalt / NO legacy /
architectural-transpositions-for-elegance-simplicity-performance; fold the
chronically-deferred + deferred items; recap all prompts; "what of our performance numbers?"**

The audit ran as a **32-lane deep re-audit** (`docs/tranches/M/audit/lane-01..32-*.md`, 15,010
lines) that re-verified L against ground truth and caught what L's gates **structurally could
not see** — the inv-ε payoff. The five open frontiers it surfaced are the M premise (`M.md
§premise`):

1. **The gate apparatus is over-engineered in IMPLEMENTATION** (the owner's flag, quantified
   in `audit/lane-13-apparatus-sota.md` + `audit/lane-14-serial-o-n2-.md` +
   `audit/lane-15-two-harness.md`): 142 leaf gates in `proof:all`; 72 (51%) spawn a fresh
   chromium with **zero warm reuse**, chained as a **serial `&&` of 141 clauses with no
   report-all** → an **O(N²) iterate-to-green** loop (the owner's flagged 3 hours). 264
   `waitForTimeout` settle-sleeps × an 8-scene sweep are the wall-clock; eslint +
   dependency-cruiser are **absent**. The PRINCIPLE (runtime actuation, device-honesty,
   the no-silent-drop oracle) is sound and caught real bugs jsdom/grep cannot — the
   consolidation is the transposition to **one parallel three-tier vitest architecture**.

2. **The round-trip is not yet TOTAL — the L gates tested the wrong observables**
   (`audit/lane-01..03`): `@property` re-emits from `CSSKeyframesToString` but **NOT
   `compileToCSS`**; named-selectors no longer throw but produce **NaN frame-times → every
   frame always-active** (`NAMED_SELECTOR_NO_TIMELINE` is typed at `errors.ts:46` but
   **never thrown** — a placeholder masquerading as wiring); multi-color densify emits
   `oklab()` even for `oklch` space and **drops non-color properties** while returning
   `eligible:true`; nested `@keyframes` can't find a top-level sibling `animation` rule.

3. **The constellation is dispatched but UN-CONSUMED, the deploy is BLOCKED**
   (`audit/lane-09/lane-19..26`): value.js 0.13.0 with zero Tranche-O items shipped (two P0
   hard-crashes on Baseline CSS); glass-ui 4.0.0 (BB 4.1.0 unpublished), its **F-2
   peer-cycle the SOLE deploy blocker** (`proof:peer-satisfied` RED → demo-smoke RED → no
   auto-deploy); parse-that 0.9.0 carries the structural-`cssParser` KISS violation. Five kf
   workarounds sit PENDING at the consume seam (correctly STAGED, not violations).

4. **Performance shipped real wins but with un-measured claims + a doc error**
   (`audit/lane-29/lane-30`): measured — SoA heavy-pipeline 16.6×, NumericAnimation
   Float64Array zero-alloc, spring-vector 3.85×@K=8; gaps — no kf bench covers the value.js
   color-math alloc claims, `warmEngine`'s `postTask` adoption un-measured, `L.W7.md`
   mis-attributes value.js's 1.56× SoA number as kf's.

5. **Chronic + deferred items reach their terminal belt, one premise was factually wrong**
   (`audit/lane-25/lane-28`): two 7-tranche items (DL-L7 GlassControlPoint, DL-L8 MorphSVG)
   are ABSOLUTE terminal at M (P-invariant-28); DL-L8's L-ledger premise ("value.js
   `PathGeometry` absent at 0.13.0") is a FACTUAL ERROR — it is PRESENT; FINAL.md's "three
   breaking type changes" is an inv-ε under-count (four).

**The L substrate M.W0 rides** (the floor M inherits — M.W0 does not re-certify it, it records
the deploy oracle live): master `9bbc227` green → `deploy-pages.yml` auto-fires → CF Pages
(`keyframes.babb.dev`) serves `index-43okVJtx.js` (re-observed live at this wave open;
`audit/lane-12-close-reconciliation.md`). `proof:chronic-closure` GREEN on the L substrate (20
rows). `proof:workaround-deletion` exit 0 (0 GREEN / 5 PENDING / 0 RED). These stand; M.W0
records the deploy origin as the M tranche's opening oracle and re-states the boundary.

**Why this is a wave, not a preamble.** M is a 14-wave consolidation across five bands with a
DAG whose keystone (M.W1) unblocks every other wave. Before any cure is authored, the charter
substrate, the 32-lane evidence, the chronic-ledger substrate (the `proof:chronic-closure` M
parse-target), the prompt recap (zero-drops, the audit's honesty instrument), and the
consume-edge sequencing (the acyclic spine the Band-C waves consume against) must ALL be on
disk and re-runnable — and the dev→impl boundary must be checkable at the tranche level. That
checkability is the M.W0 deliverable, gated born-RED.

---

## §Scope — the S-clauses (each a concrete falsifiable deliverable)

### S1 — The 32-lane audit evidence base on disk (the charter ground truth, re-runnable)

**Deliverable:** `docs/tranches/M/audit/` holds the complete 32-lane evidence base —
`lane-01-w1-replay-equality.md` through `lane-32-prompt-recap.md`, each anchored to a verified
tree (`tranche-l-dev` tip `529fcfd`/`4b3d2eb`) with file:line ground truth and re-run gate exit
codes. The lanes are committed and diff-stable; every ⚠M finding (`M.md §precept reckoning`)
traces to a lane's file:line anchor.

**Falsifiable:** `ls docs/tranches/M/audit/lane-*.md | wc -l` = 32 (no lane dropped); the
aggregate `wc -l` over the lane corpus ≥ 14,000 lines (no silent truncation — the authored
total is 15,010); the five frontier lanes each exist (`lane-13`, `lane-14`, `lane-15`,
`lane-28`, `lane-32`). `proof:audit-artifacts-M` (S6) asserts this.

**Regression it catches:** a future wave that strips or overwrites the audit evidence base
loses the file:line traceability the no-workaround precept's enforcement relies on. Every ⚠M
cure (M.W5–M.W14) cites a lane anchor; the gate asserts the lane set is stable.

### S2 — The M charter: five bands, 14-wave map, the three M-born invariants, the precept reckoning

**Deliverable:** `docs/tranches/M/M.md` committed. The charter names the three M-born
invariants (`M.md §invariant set`), the 14-wave DAG (`M.md §bands + wave map`, M.W1 the
keystone), the precept reckoning (⚠M1–⚠M9, each file:line-anchored to its lane + named M cure),
and the KILL anti-charter (L's 12 carried + W100 incremental-parse re-affirmed + `generate()` +
the parse-that packrat KILL candidate).

**Falsifiable:** `grep -c "inv-M-one-runner" M.md` ≥ 1, `grep -c "inv-M-observable-truth" M.md`
≥ 1 (the keystone invariant — multiple hits expected), `grep -c "inv-M-two-axis" M.md` ≥ 1;
`grep -c "KILL" M.md` ≥ 12; the wave map names M.W0 through M.WZ (the 14 numbered waves + W0 +
WZ present in the `§bands + wave map` table).

### S3 — The chronic-ledger substrate (`proof:chronic-closure` M parse-target) authored

**Deliverable:** `docs/tranches/M/PROGRESS.md §"Open deferrals"` authored — the complete
item-by-item M deferred ledger, the direct successor to
`docs/tranches/L/audit/deferred-ledger-L.md`, built from the L `proof:chronic-closure`
substrate with each row's chronicity integer incremented by one tranche
(`audit/lane-28-chronic-ledger.md §1`). It names the **P-invariant-28 terminal belt** — the
items hitting ≥4-tranche at M that MUST exit via consume/KILL/reasoned-EXITED: DL-L6 RF-17
(I,J,K,L→M = 4), DL-L7 GlassControlPoint (E→M = 7, ABSOLUTE terminal), DL-L8 MorphSVG (C→M = 7,
ABSOLUTE terminal), DL-L9 packrat (E→M = 6), CH-6 DFA (4), scene-control-dfa (4). The
five-arm `proof:workaround-deletion` PENDING rows fold arm-by-arm on their sibling publish
(M.W8 glass-ui track · M.W9 value.js track).

**Falsifiable:** `ls docs/tranches/M/PROGRESS.md` exits 0; the file contains an `Open
deferrals` heading; `grep -c "DL-L7\|DL-L8" PROGRESS.md` ≥ 2 (the two ABSOLUTE-terminal
7-tranche items are named, not silently dropped); `grep -c "P-invariant-28" PROGRESS.md` ≥ 1.
The ledger is the `proof:chronic-closure` parse target M.WZ re-points L→M (the re-point itself
is M.WZ's clause, not W0's — W0 authors the substrate it will parse).

### S4 — The prompt-recap ledger (A→L zero-drops confirmed, M session opens)

**Deliverable:** `docs/tranches/M/audit/prompt-recap-M.md` committed — confirming the A→L
prompt-ledger zero-drops finding from `audit/lane-32-prompt-recap.md` (which chain-trusts
`prompt-recap-L.md` → `prompt-recap-k.md`) and opening the M session row. Every distinct owner
request across the campaign (begin-the-tranche · NO-quick-solutions · the apparatus critique
[why-so-slow, why-not-in-`test/`, what-are-proof-scripts] · consider-value.js+parse-that+glass-ui
· this 32-lane M-audit · "what of our performance numbers") is dispositioned ADDRESSED (cite
wave/commit) / HANDOFF (sibling-gated) / USER-DOMAIN (the 5.0.0 cut) / FOLD-INTO-M — **zero
drops**. The recap's first M row is this W0 (date 2026-06-17; subject audit-fold + path forward;
outcome charter + 32-lane evidence + ledger substrate + recap + consume-edge sequencing on disk
+ deploy re-observation).

**Falsifiable:** `ls docs/tranches/M/audit/prompt-recap-M.md` exits 0; its first M-session row
references `M.W0`; `grep -c "what of our performance numbers\|performance numbers" prompt-recap-M.md`
≥ 1 (the owner's perf question is an explicit recap row, not folded silently).

### S5 — The cross-repo consume-edge sequencing (the acyclic spine, dispatched)

**Deliverable:** the three L dispatch docs **stand unchanged** (`docs/tranches/L/{KF-TO-GLASSUI-BB-ASKS.md,
KF-TO-VALUEJS-O-ASKS.md, KF-TO-PARSE-THAT-ASKS.md}` — verified on disk; they are the
ground-truth ask surface). M adds the **consume-edge sequencing addendum**
(`docs/tranches/M/KF-CONSUME-SEQUENCING-M.md`) that fixes the acyclic spine ordering and names,
per edge, the born-RED kf-side gate that fires on consume (`M.md §cross-repo dispatch`;
`audit/lane-09/lane-22/lane-26`):

- **parse-that 0.9.1 → value.js O 0.14.0 → kf re-pin → glass-ui BB consume** (the acyclic
  order; no cycle).
- **glass-ui BB 4.1.0** (deploy unblock, HIGHEST URGENCY): peer-widen to admit value.js 0.13.0+
  (§3 F-2), SegmentedTabs pill-aria guard (§1), RF-17 (§2) → M.W8's atomic consume →
  `proof:peer-satisfied` GREEN → deploy. Gate: `proof:workaround-deletion` S1+S2.
- **value.js O 0.14.0**: the 2 P0 crash fixes (§9 nesting THROW, §13 bare-gradient crash);
  VJ-L1 flatLeaf, VJ-L2 linear()-serialize, VJ-L3 parseCSSSubValue; §14 `./math` subpath.
  Gate: `proof:workaround-deletion` S7+S8+S9 + `proof:boundary` W96 parse-that-scan.
- **parse-that 0.9.1+**: typesVersions surgery (ships first, lowest-risk); the
  `parseSingleValue`/`parseFunctionArgs` reader API; packrat soundness OR KILL; the structural
  `cssParser` retirement (Option B — value.js owns the ONE CSS grammar).

**Falsifiable:** `ls docs/tranches/L/KF-TO-GLASSUI-BB-ASKS.md docs/tranches/L/KF-TO-VALUEJS-O-ASKS.md
docs/tranches/L/KF-TO-PARSE-THAT-ASKS.md` all exit 0 (the standing ask surface is intact);
`ls docs/tranches/M/KF-CONSUME-SEQUENCING-M.md` exits 0; `grep -c "born-RED\|workaround-deletion\|proof:peer-satisfied"
docs/tranches/M/KF-CONSUME-SEQUENCING-M.md` ≥ 1 (every consume edge names its kf-side gate).

**Regression it catches:** if the consume-edge sequencing is absent, Band-C waves (M.W8–M.W11)
have no single-document ground-truth for the acyclic spine ordering — a consume could be
attempted out of order (glass-ui before value.js 0.14.0, breaking the peer chain), and the
workaround-deletion gates lose their named cure-surface (inv-L-acyclic-purity unchartable).

### S6 — The deploy round-trip re-observation (the M opening oracle)

**Deliverable:** the L close deploy round-trip is re-observed live at the M.W0 open and recorded
here: master `9bbc227` green → `deploy-pages.yml` (`workflow_run`-on-`push`) → CF Pages
(`keyframes.babb.dev`) serves `index-43okVJtx.js`. The live origin was probed at this wave
authoring and returns `index-43okVJtx.js` (the K/L deploy chunk — unchanged because no M source
has shipped; the M deploy re-observation on the glass-ui BB consume is M.WZ's clause, gated on
M.W8). This observation is the M tranche's opening oracle — the floor M consolidates above.

**Falsifiable:** the deploy observation cites the served chunk hash (`index-43okVJtx.js`) and
the live origin (`keyframes.babb.dev`); both are reproducible — `curl -s https://keyframes.babb.dev/`
returns the chunk. The gate (S7 clause d) asserts these are recorded in this file.

### S7 — born-RED gate: `proof:audit-artifacts-M` (the M.W0 hard gate)

See §Born-RED gate below (standalone per the tranche discipline). It tests the REAL observable
per **inv-M-observable-truth**: the actual on-disk artifact set + the dev→impl boundary witness
+ the deploy oracle — not a proxy.

---

## §Born-RED gate — `proof:audit-artifacts-M` (over the REAL observable, inv-M-observable-truth)

**Gate name:** `proof:audit-artifacts-M` (NEW — does not exist today; wired to
`npm run proof:audit-artifacts-M` + prepended to the `proof:hygiene` roster in `package.json`).
A pure node repo-structure gate (`scripts/proof-audit-artifacts-M.mjs`, ~50 LOC) — no
playwright, no DOM. **AXIS-3 STATIC** per inv-M-two-axis (a source-shape/repo-structure
invariant belongs in a sub-second static rule, not a browser).

**The REAL observable it bites (NOT a proxy):** the genuine defect this gate catches is *the M
tranche opening on an absent/truncated charter substrate, or on an un-verified deployed build,
or with a kf source file authored in the DEV-phase wave* — i.e. the dev→impl boundary breached.
The L.W1 S4 lesson is the keystone warning: that gate asserted no-throw + string round-trip
(proxies) while the real breach was NaN frame-times. Here the gate asserts the ACTUAL artifact
bytes on disk, the ACTUAL `git diff --stat` over `src/`, and the ACTUAL served chunk hash —
each the genuine observable, each independently falsifiable.

**What it asserts (five clauses):**

**(a) The 32-lane evidence base + charter on disk (S1, S2).**
```
assert (ls docs/tranches/M/audit/lane-*.md | wc -l) == 32
assert (cat docs/tranches/M/audit/lane-*.md | wc -l) >= 14000      # floor; authored 15,010
assert ls docs/tranches/M/M.md            → exits 0
assert ls docs/tranches/M/waves/M.W0.md   → exits 0                # this file
```
BITE: reds if any lane is deleted, the corpus is truncated below floor, or the charter/this
wave spec is absent — the evidence base for ⚠M1–⚠M9 cannot be stripped without breaking CI.

**(b) The three M-born invariants + the KILL anti-charter named in the charter (S2).**
```
grep -c "inv-M-one-runner"        docs/tranches/M/M.md >= 1
grep -c "inv-M-observable-truth"  docs/tranches/M/M.md >= 1
grep -c "inv-M-two-axis"          docs/tranches/M/M.md >= 1
grep -c "KILL"                    docs/tranches/M/M.md >= 12
```
BITE: reds if the charter drops a M-born invariant or any of the carried-forward KILLs — the
anti-charter is non-re-litigable, its removal from the charter is a gate failure.

**(c) The ledger substrate + prompt recap + consume-edge sequencing present (S3, S4, S5).**
```
assert ls docs/tranches/M/PROGRESS.md                    → exits 0
grep -c "DL-L7\|DL-L8"               PROGRESS.md          >= 2     # the ABSOLUTE-terminal items
grep -c "P-invariant-28"            PROGRESS.md           >= 1
assert ls docs/tranches/M/audit/prompt-recap-M.md        → exits 0
grep -c "M.W0"                       prompt-recap-M.md    >= 1     # the M session opens
assert ls docs/tranches/M/KF-CONSUME-SEQUENCING-M.md     → exits 0
grep -c "born-RED\|workaround-deletion\|proof:peer-satisfied"
                                     KF-CONSUME-SEQUENCING-M.md >= 1
# the three L dispatch docs STAND (the ground-truth ask surface):
assert ls docs/tranches/L/KF-TO-GLASSUI-BB-ASKS.md docs/tranches/L/KF-TO-VALUEJS-O-ASKS.md \
          docs/tranches/L/KF-TO-PARSE-THAT-ASKS.md       → all exit 0
```
BITE: reds if the chronic-ledger substrate, the recap, or the consume-edge sequencing is
missing — Band-E (chronic terminal) has no parse target, the recap loses its zero-drops anchor,
and Band-C consumes have no acyclic-spine ground truth.

**(d) The dev→impl boundary witness — NO M source authored (inv-16, the boundary's REAL observable).**
```
assert (git diff --stat <M.W0-base>..HEAD -- src/ demo/) == EMPTY
# the DEV-phase wave touches docs/ + scripts/<the gate> ONLY; zero engine/demo/library source
```
BITE: reds if ANY file under `src/` or `demo/` is modified by this DEV-phase wave — this is the
dev→impl boundary made checkable at the tranche level. M.W1–M.W14 implementation opens ONLY on
explicit authorization (the L.W0 boundary, carried forward). This clause is the REAL observable
of inv-16 — not a comment claiming "docs only" but the actual diff.

**(e) The deploy oracle recorded (S6).**
```
grep -c "index-43okVJtx" docs/tranches/M/waves/M.W0.md >= 1
grep -c "9bbc227"        docs/tranches/M/waves/M.W0.md >= 1
grep -c "keyframes.babb.dev" docs/tranches/M/waves/M.W0.md >= 1
```
BITE: reds if the deploy oracle is not recorded in this wave spec — M would open on an
un-verified deployed build, overclaiming the inv-ε guarantee for the tranche opening.

**Witness input that REDs on today's tree (pre-cure):**

Today's tree (`tranche-l-dev`, `4b3d2eb`): `docs/tranches/M/waves/` did not exist before this
wave (confirmed: the directory was created at this authoring). Therefore on the pre-cure tree —
- Clause (a): `ls docs/tranches/M/waves/M.W0.md` → non-zero exit → **RED** (this wave spec did
  not exist).
- Clause (c): `ls docs/tranches/M/PROGRESS.md`, `…/prompt-recap-M.md`, `…/KF-CONSUME-SEQUENCING-M.md`
  → non-zero exit → **RED** (none of the substrate docs existed; only `M.md` + the 32 lanes were
  on disk).
- Clauses (b), (d), (e) piggyback: (b) passes already (M.md present with the three invariants —
  `grep -c inv-M-observable-truth M.md` = 3 confirmed); (d) passes only while no source is
  touched; (e) reds because `M.W0.md` was absent.

This is a GENUINE born-RED on the real observable: the artifact set is the thing that does not
exist, not a proxy for it.

**Greens on the cure:** committing `M.W0.md` (this file) + `PROGRESS.md` + `prompt-recap-M.md` +
`KF-CONSUME-SEQUENCING-M.md` — with zero `src/`/`demo/` diff — closes all five clauses → the
gate exits 0.

**Implementation locus:** `scripts/proof-audit-artifacts-M.mjs` (NEW node script). Add under
`proof:audit-artifacts-M` in `package.json` and prepend to the `proof:hygiene` chain — so every
subsequent M wave's CI run exercises clauses (a)/(d)/(e) and confirms this wave's record + the
dev→impl boundary are undisturbed.

---

## §Deps

**No sibling publish gate.** M.W0 is entirely kf-repo-internal (charter + ledger + recap +
sequencing docs + one node gate script). The consume-edge sequencing doc DESCRIBES asks to
siblings — it does not CONSUME anything; no sibling is required to have published. Band-C waves
(M.W8 glass-ui BB · M.W9 value.js O · M.W10 parse-that · M.W11 coordinated) open only after the
relevant sibling publishes; M.W0 only orders the spine.

**Prerequisite (already met):** master `9bbc227` green → CF Pages deployed → live serves
`index-43okVJtx.js` (re-observed live at this wave open at `keyframes.babb.dev`). This is the
L close oracle; M.W0 records it, does not re-derive it.

**The standing L substrate M.W0 rides (verified, not re-certified):** `proof:chronic-closure`
GREEN (20-row L substrate); `proof:workaround-deletion` exit 0 (0 GREEN / 5 PENDING / 0 RED);
the three L dispatch docs on disk; the 32-lane evidence base on disk (15,010 lines).

**Consumed by M.W1+:** `proof:audit-artifacts-M` enters the `proof:hygiene` chain (which
`proof:all` runs) — every later wave's CI run exercises clause (d) and re-confirms the dev→impl
boundary held. **M.W1 (the keystone) reads this wave's charter + the lane-13/14/15 anchors** to
construct the parallel report-all runner that kills the O(N²) iterate-to-green wound the owner
flagged. Band-B waves (M.W5–M.W7) read the lane-01/02/03 file:line breach anchors for their
born-RED `proof:replay-equality`/`compile-replay`/`ingest-replay` extensions. Band-C waves read
the consume-edge sequencing (S5) for the acyclic spine ordering.

---

## §Bite — what each clause gate catches

| Clause | The REAL observable it bites (inv-M-observable-truth) |
|---|---|
| (a) evidence base + charter | A future wave strips/truncates the 32-lane evidence; the file:line anchors for ⚠M1–⚠M9 are lost; the M cures (M.W5–M.W14) lose their ground truth. |
| (b) M-born invariants + KILL | A wave edits `M.md` to drop `inv-M-one-runner`/`inv-M-observable-truth`/`inv-M-two-axis` or a carried KILL without the non-re-litigable discipline. |
| (c) ledger + recap + sequencing | The `proof:chronic-closure` M parse-target, the zero-drops recap anchor, or the acyclic-spine ground truth is absent — Band-E has no terminal substrate, Band-C consumes out of order. |
| (d) dev→impl boundary (inv-16) | ANY `src/`/`demo/` file is touched in the DEV-phase wave — the genuine boundary breach, caught on the actual `git diff`, not a "docs only" comment. M.W1+ implementation opens only on explicit authorization. |
| (e) deploy oracle | The L close deploy round-trip is never recorded; M opens on an un-verified deployed build; the inv-ε guarantee for the tranche opening is overclaimed. |

The five clauses jointly enforce the gate-first / born-RED discipline at the **TRANCHE OPEN**
level: no M Band-A wave (M.W1 the keystone included) can open until the charter substrate + the
chronic-ledger parse-target + the consume-edge spine + the deploy oracle are on disk AND the
dev→impl boundary is provably held by the diff. This is the M equivalent of L.W0's
`proof:audit-artifacts` lead-gate — sharpened by inv-M-observable-truth (clause (d) bites the
ACTUAL diff, not a proxy) — and it is what makes the dev→impl boundary checkable at the tranche
level, not merely asserted in prose.
