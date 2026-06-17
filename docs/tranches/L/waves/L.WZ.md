# L.WZ — Close

> **STATUS (2026-06-17 — close-docs LANDED, held to inv ε):** `FINAL.md` (S1–S9), the terminal
> `PROGRESS.md §"Open deferrals"` (DL-L1–L13 + the 45 DLL rows), and `prompt-recap-L.md` (zero drops,
> §8–§11 the L-impl terminal) are ON DISK and CROSS-CONSISTENT — every boundary cites its observed
> oracle; every Band-B consume-edge is NAMED with its sibling tripwire (UN-CONSUMED at close); the
> deploy round-trip is HANDOFF (NOT observed); the version `5.0.0` is RECOMMENDED (NOT cut). The
> coherence+honesty audit (2026-06-17) CORRECTED one inv ε overclaim in place — the DL-L13 "collapse
> the lattice language deleted/absent" claim did NOT reproduce (`grep precepts-k.md` → 2 hits, §3 T1
> 246/253); the T1 terminal now correctly cites the WIRED `proof:gate-is-runtime` derivation rule
> (K-decision option (b)), not a language-deletion that did not happen. **STILL PENDING (the
> orchestrator/USER-DOMAIN finale):** (1) the `proof:all` three roster reds cleared
> (`proof:gate-is-runtime`/`proof:agent-surface`/`proof:decomposition` — verified exit 1 on this tip,
> the orchestrator's close-impl motion); (2) the `proof:chronic-closure` substrate re-point K→L (the
> atomic non-vacuity motion — `CHRONIC_LEDGER` still points at K, verified); (3) the USER-DOMAIN
> version cut + npm publishes + glass-ui BB consume → deploy round-trip; (4) the TASTE verdict. This
> wave's spec remains the authoritative S1–S7 structure below.
>
> The `proof:all` deploy signal, the substrate re-point, and the version cut are NOT this DOCS-ONLY
> close's to fire — they are the named finale. Nothing below is asserted done that a re-run cannot
> reproduce.

- **Phase:** DEV — spec authored, close-docs LANDED, awaits the orchestrator close-impl + USER-DOMAIN
  finale · **Class:** BOOK (the close docs —
  `docs/tranches/L/FINAL.md`) + **USER-DOMAIN** (the version cadence decision + npm publish +
  the close-merge deploy — version owner **Mike Babb** `mbabb@ncsu.edu`, confirm-first) +
  **RECORD** (the deferred ledger TERMINATED — BOTH the 13 DL-L PROGRESS cluster rows, the
  `proof:chronic-closure` parse target, AND the 45 deferred-ledger DLL rows that refine them;
  the prompt-recap confirmed; the chronic-closure
  substrate transition K→L). · **Scope (docs + the substrate-transition wiring + USER-DOMAIN
  release; NO new behaviour source):** `docs/tranches/L/FINAL.md` (NEW — the L boundary close
  report held to inv ε, both bands) + the prompt-recap TOTAL (`prompt-recap-l.md` extended
  through the close: every MANDATE row, every fold row, the L-born finding cluster rows
  dispositioned) + the chronic-closure **SUBSTRATE TRANSITION** (the meta-gate's parse target
  moves `K/PROGRESS.md §"Open deferrals"` → `L/PROGRESS.md §"Open deferrals"` in ONE motion,
  the gate re-run proving non-vacuity on the new substrate — three deliberately-malformed planted
  rows must RED before the clean terminal L ledger greens) + the version cadence decision (MAJOR
  `5.0.0` vs MINOR `4.4.0` — USER-DOMAIN, criteria proposed here) + the npm publish via
  `release.yml` (USER-DOMAIN, confirm-first) + the close-merge auto-deploy RE-observation (the
  K.W0/J.W0 round-trip oracle re-witnessed on the L close merge itself: CI → deploy → live bytes)
  + the `proof:lighthouse-mobile` re-verification on the L dist (the DL-L12 floor re-assertion) +
  the AFTER screenshot capture against the K-close corpus. **ZERO `src/**` / `test/**` /
  `.github/**` / `demo/**` BEHAVIOUR edit** — the only non-doc motions are the chronic-closure
  parse-target re-point (a single `CHRONIC_LEDGER` path constant in
  `scripts/proof-chronic-closure.mjs:110`, itself gated by the non-vacuity re-run) and the
  USER-DOMAIN `changeset version` / `npm publish` this wave authors the trigger for and the
  owner fires. · **DAG: LAST in L** — the close runs after every Band-A wave (L.W1–L.W8) lands +
  green CI **AND** the Band-B dispatches (L.W9 L.W10) have either consumed their sibling publish
  OR honestly circled back with a named un-consumed tripwire; it consumes `proof:all == CI` (the
  full `proof:correctness` + `proof:hygiene` rosters, `package.json:173-175`), the OBSERVED
  green-CI→auto-deploy round-trip primitive (the K.W0 oracle, re-witnessed on the L close merge
  itself), and the `proof:chronic-closure` GREEN on the new L ledger.

---

## Context

K closed **DEPLOYED 2026-06-16** — `4.3.0` live on keyframes.babb.dev, master `9bbc227`,
`release.yml` run `27640592021`, CI run `27655766822`, CF Pages serving `index-43okVJtx.js`. K
answered *"can the authoring object BE CSS, round-tripped?"* — yes, for a DEFINED SUBSET (core
animation grammar; per-kf easing; single-color oklab track; scroll parse+dispatch; CSSOM ingest →
replay-equal). K's FINAL was honest on the subset status; inv ε held. L was chartered by that
honesty.

L's two bands:

- **Band A** (kf-internal TOTALITY, 4.3.0-sufficient) — the five replay-equality breaches
  closed (L.W1 + L.W2), the ingest gaps sealed (L.W3), the gate-suite transposed to device-honest
  posture (L.W4), the orchestration-tier DX completed (L.W5), the agent-authoring verb shipped
  (L.W6), SOTA-perf increments (L.W7), barrel-dogfood + keyframes-vue published (L.W8).
- **Band B** (constellation coordination, gated on sibling publishes) — the cross-repo dispatch
  (L.W9), the true-CSS-parity frontier research-spike + coordinated grammar (L.W10).

L.WZ closes when **Band A is green** and **Band B's edges have consumed OR honestly circled
back** with a named un-consumed tripwire (P-invariant-28 — a named sibling tripwire IS
exit-shaped, not a perpetual punt).

### Audit evidence L.WZ inherits

The 36-lane audit (`audit/audit-32-skeleton.txt` + `audit/completion-lanes-32-36.txt`) is the
evidence base L.WZ cites. The close wave owns two audit-seam obligations:

**DL-L13 / T1 formal resolution** — `⚠9`; `K.WZ.md:524` claimed T1 "RESOLVED" without naming
the chosen option; `FINAL.md` was silent; "collapse the lattice" language persisted uncancelled in
`precepts-k.md:253`. L.W0 resolved T1 in the dev phase by WIRING the derivation rule:
`proof:gate-is-runtime` is AUTHORED + WIRED into `proof:hygiene` (verified `package.json:106`/`:190`)
as the formal T1 resolution — the K-decision option (b) "formally own the corpus", the gate set
DERIVED from `proof:correctness` membership rather than declared. **inv ε note (the language was NOT
deleted):** `precepts-k.md §3 T1` lines 246/253 still carry the "collapse the lattice" wording
(`grep` → 2 hits) — a prior draft asserted the language "deleted/absent", which does NOT reproduce.
L.WZ CITES the resolved state with its TRUE oracle — the wired derivation gate — not a
language-deletion that did not happen.

**DL-L12 / mobile Lighthouse re-verification** — the K floors (home 68 / cube 66 / amiga 52 /
square 65 / easing 63 / spring 55, from `K/FINAL.md §5`) are the floor. L.WZ re-runs
`proof:lighthouse-mobile` with `KF_REQUIRE_LH=1` on the L dist; any regression RED. The
mechanism is non-gate (runner-calibrated, wall-clock category per inv-L-device-honesty); the
result is RECORDED, not hard-gated, per the K.WZ precedent.

**The L.WZ arbiter (as K.WZ stated its own):** the running product across every boundary L
taught it to cross — the COLD axis (L.W1/L.W2 breach inputs exercised from first parse), the
PUBLISH surface (L.W8 barrel-dogfood + keyframes-vue), the device-honest gate corpus (L.W4
settle-primitive + report-all), the replay-equality TOTAL (L.W1 + L.W2 all five breach inputs
RED→GREEN) — never a prior FINAL, never an agent "designer-eye PASS".

---

## Scope

### S1 — `FINAL.md` held to inv ε

**Deliverable:** `docs/tranches/L/FINAL.md` — the L boundary close report.

**inv ε** (the K/J precedent): every boundary claim in the FINAL **cites its observed oracle**,
not a re-assertion of intent. The FINAL:

- **Band A boundary — replay-equality TOTAL.** Cites `proof:replay-equality` GREEN on all five
  breach inputs: an `opacity:0 !important` keyframe (⚠31; `adapter.ts` `declsToVarMap` cure); a
  `@property --x <number>` block (⚠15; `engine.ts:1225` → `serializeStylesheetItem` wired); a per-stop
  `animation-composition: add` (⚠16; `format.ts:81-103` cure); an `entry`-selector rule (⚠17;
  `frame-compiler.ts:179-188` cure); the scroll-driven compile fixture (W12; `compile.ts` zero
  timeline emit → cure). Cites `proof:compile-replay` GREEN on the multi-color refusal/densify
  fixture (⚠28/⚠29; `compile-color.ts:188-190` cure).
- **Band A boundary — gate-suite device-honesty.** Cites `proof:all` GREEN with zero
  `waitForTimeout()` sleeps (W28; the 259 replaced by `waitForRender/settle`); cites
  `proof:peer-satisfied` GREEN (the F-2 ELSPROBLEMS peer-cycle sealed — `completion-lanes-32-36.txt
  §Lane 36`; `⚠8`); cites report-all posture in the demo-smoke job (W27).
- **Band A boundary — barrel-dogfood + publish.** Cites `proof:demo-on-published-surface` GREEN
  (`grep @mkbabb/keyframes demo/` → N hits, not 0; the 63 `@src` imports flipped — W125; ★
  `audit-32-skeleton.txt §HIGH-severity`). Cites `@mkbabb/keyframes-vue` `0.1.0` on npm (the
  K.W12 ED-2 discharge; `packages/keyframes-vue/package.json`; W15/W56).
- **Band B boundary — constellation dispatches.** Cites each L.W9 cross-repo dispatch document
  filed; each born-RED workaround-deletion gate named with its tripwire (the sibling publish that
  lights it); honestly declares which Band-B consume-edges are un-consumed at close (with their
  named tripwire from `PROGRESS.md §"Open deferrals"`).
- **Band B boundary — true-CSS-parity frontier.** Cites the L.W10 research-spike decision record
  (the architectural decision, Option A vs B, written and accepted); cites `proof:css-parity`
  RED-today status (the six gap-class inputs still RED on today's sibling versions — this is the
  HONEST state; the FINAL does not overclaim parity-closure unless value.js O has published and kf
  re-pinned).
- **The version cadence oracle.** Cites the USER-DOMAIN decision (S5 below) — the chosen version
  string from `changeset version`, OBSERVED in `package.json` after the cut.
- **The deploy round-trip oracle.** Cites the observed CI run ID → deploy-pages.yml run ID → live
  origin byte match (the J.W0/K.W0/K.WZ round-trip discipline, re-witnessed on the L close merge
  itself).

**Anti-overclaim discipline (the ⚠9 lesson).** T1 is cited as RESOLVED-WITH-ORACLE (the
`proof:gate-is-runtime` derivation gate WIRED into `proof:hygiene`, `package.json:106`/`:190` — the
K-decision option (b) "own the corpus"). **The T1 terminal does NOT claim the "collapse the lattice"
language was deleted** — `grep` of `precepts-k.md` returns 2 hits (§3 T1 lines 246/253); the prior
"language absent" assertion did not reproduce and was corrected for inv ε. The Band-B un-consumed
edges are named, not asserted closed. The `proof:lighthouse-mobile` scores are RECORDED, not claimed
hard-gated. The FINAL does NOT assert `5.0.0` shipped until the version cut is OBSERVED.

---

### S2 — Deferred ledger TERMINATED

**Deliverable:** `docs/tranches/L/PROGRESS.md §"Open deferrals"` with every row at a terminal
disposition.

**The terminate-target is TWO coupled surfaces:**

1. The **13 DL-L PROGRESS cluster rows** (DL-L1 through DL-L13; `PROGRESS.md §"Open
   deferrals"`) — the `proof:chronic-closure` PARSE TARGET (the gate reads this table; it
   is the substrate the `CHRONIC_LEDGER` constant points at). These 13 cluster rows are
   what the gate greens or reds.
2. The **45 deferred-ledger DLL rows** (DLL-1 through DLL-45; `audit/deferred-ledger-L.md`)
   that REFINE the 13 cluster rows item-by-item — the consolidated K→L deferred/chronic
   substrate, each DLL row cross-linking the `DL-Ln` cluster row it refines. The cluster
   rows SUMMARIZE; the DLL rows carry the per-item `file:line` / `audit-W#` / `⚠#` / named
   tripwire evidence.

Both must reach terminal disposition: the 13 cluster rows green `proof:chronic-closure`; the
45 DLL rows are the evidence base each cluster terminal cites. A cluster row at FOLD whose
refining DLL rows are not all dispositioned is an incomplete termination.

Terminal disposition vocabulary per the substrate grammar: FOLD (landed in an L wave, gate
GREEN), HANDOFF (sibling-owned, named tripwire, born-RED kf-gate), KILL, RECORD, OUT,
VERIFY-ONLY, USER-DOMAIN.

**Required terminal shape for each:**

| Row | Expected terminal at close |
|-----|---------------------------|
| DL-L1 (replay-equality breach family) | **FOLD** → L.W1 + L.W2 LANDED; `proof:replay-equality` GREEN; `proof:compile-replay` (multi-color + scroll fixture) GREEN |
| DL-L2 (gate-corpus blind-spot: 259 sleeps + fail-fast) | **FOLD** → L.W4 LANDED; `waitForRender/settle` replaces all 259 `waitForTimeout` hits; `proof:all` GREEN with zero fixed-ms sleeps in the render-wait seam |
| DL-L3 (F-2 peer-cycle) | **FOLD** → L.W4 (`proof:peer-satisfied` GREEN) + **HANDOFF** Band B: glass-ui BB ships widened peer range + kf re-pins; OR: HANDOFF with named tripwire if BB has not published by close |
| DL-L4 (ED-3 dogfood inversion) | **FOLD** → L.W8 LANDED; `proof:demo-on-published-surface` GREEN |
| DL-L5 (keyframes-vue unpublished) | **FOLD** → L.W8 LANDED; `@mkbabb/keyframes-vue` 0.1.0 on npm |
| DL-L6 (RF-17 / DL-K9 GlassDock interim) | **HANDOFF** → glass-ui 4.1.0 RF-17 fix; born-RED `proof:rf17-net-deletion` RED until consume; OR: FOLD if glass-ui 4.1.0 ships before close |
| DL-L7 (GlassControlPoint / DL-K7) | **HANDOFF** → glass-ui BB future minor; `proof:control-point-live` gate-first BOOK; chronicity 6 (E,F,G,H,I,J,K,L → M) at close |
| DL-L8 (MorphSVG / FB-3) | **HANDOFF** → value.js O VJ.W4 remainder; `proof:morphsvg-consume` born-RED; chronicity 6 (C,F,G,H,I,J,K,L → M) at close |
| DL-L9 (parse-that packrat / PT-2) | **HANDOFF** → parse-that PT-WAVE-6; `proof:packrat-sound` gate-first; chronicity 5 (E,F,G,H,I,K,L → M) at close |
| DL-L10 (kf-owned constellation workarounds) | **FOLD** if sibling publishes before close (each workaround-deletion gate GREEN); **HANDOFF** with named tripwire if any sibling publish outstanding |
| DL-L11 (true-CSS-parity frontier) | **FOLD** (research-spike decision record written; `proof:css-parity` authored RED) + **HANDOFF** Band B: value.js O + parse-that coordinated grammar pending; RED status is the HONEST state at close if siblings have not published |
| DL-L12 (mobile Lighthouse floors) | **VERIFY-ONLY** → L.WZ re-runs `proof:lighthouse-mobile` on the L dist; the K floors are the hard floor; result RECORDED |
| DL-L13 (T1 formal resolution) | **FOLD** → L.W0 LANDED; `proof:gate-is-runtime` AUTHORED + WIRED into `proof:hygiene` (the derivation rule — K-decision option (b)); T1 non-re-litigable. (NB: the "collapse the lattice" language is NOT deleted from `precepts-k.md §3 T1` — the terminal rests on the wired gate; `proof:gate-is-runtime` is RED-local at the close tip per §S6) |

**P-invariant-28 check.** DL-L7 (chronicity 6, E→L), DL-L8 (chronicity 6, C→L), DL-L9
(chronicity 5, E→L) are ≥4-tranche HANDOFF rows. The invariant requires these to EXIT — a named
sibling tripwire with a born-RED kf-side gate IS exit-shaped (the K.WZ precedent; the gate is the
proof the item is tracked, not drifted). Any row entering L.WZ without a named tripwire and a
born-RED kf gate is a P-invariant-28 VIOLATION; the close does not proceed.

---

### S3 — Prompt-recap confirmed (`prompt-recap-l.md` TOTAL)

**Deliverable:** `docs/tranches/L/audit/prompt-recap-l.md` extended through the close —
every MANDATE row, every L-fold row (DL-L1 through DL-L13), the L-born finding-cluster rows
(`PROGRESS.md §2`), and the Band-B dispatch rows — each at a terminal verdict.

**Terminal-verdict vocabulary (per the K/J precedent):** ADDRESSED (shipped in an L wave + gate
GREEN), RECORD (documented but not an action item), HANDOFF (sibling-owned with a named
tripwire), USER-DOMAIN (Mike Babb, the version owner), OUT (permanently out of scope).

**Zero drops.** The A→K prompt ledger closed with zero drops
(`audit-32-skeleton.txt §Lane prompt-ledger-A→K`). The L prompt-recap carries that discipline
forward: no user request from A through L may have an un-dispositioned verdict at close. The
prompt-recap is the audit's internal HONESTY instrument — it is not a per-commit log; it is a
terminal disposal of every distinct request the user made. A request that is ADDRESSED by a
wave is cited by gate name, not asserted closed. A request that is HANDOFF is named with its
tripwire. A request that has no terminal disposition is a close blocker.

---

### S4 — Chronic-closure substrate transition K→L (non-vacuous)

**Deliverable:** `scripts/proof-chronic-closure.mjs:110` `CHRONIC_LEDGER` path constant
re-pointed from `docs/tranches/K/PROGRESS.md` to `docs/tranches/L/PROGRESS.md` in ONE motion,
simultaneously with the L ledger becoming authoritative (DL-L1 through DL-L13 all at terminal
disposition per S2).

**Non-vacuity protocol (the K.WZ precedent; P-SUBSTRATE from `K/audit/precepts-k.md §3 T6`).**
The substrate transition MUST be proven non-vacuous: the gate must RED on three deliberately-malformed
planted L-ledger rows — one of each failing clause shape — before the clean terminal L ledger
greens the gate. The three planted-row shapes are:

1. **A FOLD row citing a source-shape gate** (a `proof:*` backtick that resolves to a grep or
   file-existence check rather than an invocation of a real browser over the built dist) — the
   gate grammar's `RUNTIME-BAND CITATION CONTRACT` clause in `PROGRESS.md §"Open deferrals"` must
   catch this and RED.
2. **A HANDOFF row targeting an unpublished future version** (a sibling-dep version not yet on
   npm: e.g. `value.js 0.15.0`, not yet released) — the HANDOFF grammar's tripwire validation
   must catch this and RED.
3. **A bare BOOK row with a chronicity ≥4** (a row whose disposition is BOOK and whose
   chronicity count is ≥4, violating P-invariant-28's exit-shaped requirement) — the gate's
   P-invariant-28 check must catch this and RED.

Procedure: (a) plant the three malformed rows in `PROGRESS.md §"Open deferrals"`; (b) run
`node scripts/proof-chronic-closure.mjs` — confirm it REDs on all three; (c) remove the planted
rows + confirm the gate GREENs on the clean terminal ledger; (d) in the same commit, re-point the
`CHRONIC_LEDGER` constant. This is NOT a split motion: re-point + non-vacuity proof + L ledger
terminal are ONE atomic commit.

---

### S5 — Version cadence decision: MAJOR `5.0.0` vs MINOR `4.4.0` (USER-DOMAIN)

**Deliverable:** a USER-DOMAIN decision record (one paragraph, naming the chosen version string
and the three evidence points that drove it) written BEFORE the `changeset version` cut. The
agent proposes the criteria; the user fires the cut.

**The case for MAJOR `5.0.0` (the round-trip-totality + barrel-dogfood + keyframes-vue-publish
set; `L.md §WZ`; `completion-lanes-32-36.txt §Lane 36`):**

`5.0.0` is warranted when the cumulative change set constitutes a BREAKING surface shift for
consumers of the published API — not merely additive, but changing what the published API
GUARANTEES. The L wave set does this in three orthogonal axes:

1. **Replay-equality TOTAL (L.W1 + L.W2).** The `format.ts`/`compile.ts` output surface now
   emits `!important` declarations it previously silently dropped (⚠31; `adapter.ts` `declsToVarMap`),
   emits `@property` blocks it previously omitted (⚠15; `engine.ts:1225`), emits per-stop
   `animation-composition` it previously lost (⚠16; `format.ts:81-103`), and REFUSES multi-color
   tracks it previously shipped silently lossy (⚠28/⚠29; `compile-color.ts:188-190`). A consumer
   that depended on the old silent-drop behavior — e.g. round-tripping `!important` and getting
   clean output — gets a DIFFERENT output string. The honest-refusal is a NEW behavior on the
   multi-color path. This is a BREAKING behavioral change on the `CSSKeyframesToString` and
   `compileToCSS` surface.
2. **Barrel-dogfood complete (L.W8 ED-3).** The demo is now on the PUBLISHED barrel; the
   `@mkbabb/keyframes-vue` adapter is published. Consumers who were waiting for the Vue adapter
   can now depend on it. The package graph changes shape: `@mkbabb/keyframes-vue` is a NET-NEW
   published package, not a version bump. This argues for a version boundary.
3. **`validate()` verb shipped (L.W6).** A net-new export on the HEAVY dynamic surface
   (`loadAnimationEngine()` accessor set). Not additive-only: it changes the shape of the
   `loadAnimationEngine()` return type. A consumer who was destructuring the return object gains
   a new field; a consumer who was pattern-matching the return shape sees a new key.

**The case for MINOR `4.4.0`:** no existing IMPORT path is removed; no existing exported
symbol's TYPE changes (new fields added, old fields unchanged). `!important` being emitted is
additive behavior at the string output level. A consumer that was NOT relying on the silent-drop
behavior is unaffected. The `validate()` verb is additive. `@mkbabb/keyframes-vue` is a NEW
package, not a version bump to the existing one.

**Proposed criteria for the USER-DOMAIN decision (Mike Babb to resolve):**

The agent's recommendation is **`5.0.0`** if the multi-color refusal behavior (L.W2
`compile-color.ts` honest-refusal) breaks any DOCUMENTED consumer workflow — i.e., any consumer
that was shipping multi-color animations with `eligible:true` and expecting no `CompileRefusal`
now gets a refusal. This is a semantic contract break on the COMPILE surface, not just an additive
feature. If the user judges that no consumer in the wild was relying on the silent-lossy behavior
(it was undocumented and incorrect), the MINOR `4.4.0` path is defensible.

The version string the user chooses is recorded in the decision record before `changeset version`
is run. The L FINAL cites the chosen string + the observed `package.json` version AFTER the cut.

---

### S6 — `proof:all` GREEN + deploy round-trip RE-observed

**Gate:** `npm run proof:all` GREEN on the L close tree (`package.json:175` — the full
`proof:correctness` + `proof:hygiene` roster). This is the deploy signal.

**Deploy round-trip re-observation.** The J.W0/K.WZ discipline: the CI run that carries the L
close merge must AUTO-DEPLOY via `deploy-pages.yml` (the `workflow_run` green-CI gate on master
push), and the live origin at `keyframes.babb.dev` must serve the new dist bytes. The oracle:

1. CI run N on master is GREEN — observe run ID.
2. `deploy-pages.yml` fires as a `workflow_run` consequence — observe run ID.
3. The live origin's `index-*.js` filename changes — observe the new hash.
4. A cold-origin probe (`proof:cold-entry` re-run on the L dist) confirms the engine starts on
   first gesture.

The FINAL cites all four observations with their run IDs / filenames — never an assertion, always
an oracle.

---

### S7 — Lighthouse re-verification (DL-L12)

**Deliverable:** `proof:lighthouse-mobile` re-run with `KF_REQUIRE_LH=1` on the L dist. The K
floors are the hard floor:

| Scene | K score | L ≥ |
|-------|---------|-----|
| home | 68 | 68 |
| cube | 66 | 66 |
| amiga | 52 | 52 |
| square | 65 | 65 |
| easing | 63 | 63 |
| spring | 55 | 55 |

Any regression RED. Result RECORDED in the FINAL (non-gate, wall-clock category per
inv-L-device-honesty — the scores are runner-calibrated, never CI-hard-gated per the K.WZ
precedent). The mechanism: a measured-quiet artifact; the floor is the gate; the runner variance
is the `observe-only` annotation.

---

## Born-RED gate

**Gate name:** `proof:chronic-closure` — the EXISTING gate, re-pointed from K's ledger to L's.

**Exact witness that REDs on today's tree:** today's `scripts/proof-chronic-closure.mjs:110`
points to `docs/tranches/K/PROGRESS.md`. Running the gate against the L ledger
(`docs/tranches/L/PROGRESS.md §"Open deferrals"`) with the three planted malformed rows produces
RED on all three clause shapes (the planted FOLD-citing-source-shape, the HANDOFF-targeting-unpublished,
the bare-BOOK-≥4-tranche).

**RED oracle (the three planted-row shapes):**

```
# Planted row 1 — FOLD citing a source-shape gate
| DL-PLANT-1 | L | 1 (L) | FOLD → L.W0 | L.W0 | `proof:boundary` (source-shape grep: holdsValueJsSpecifier) |
```
→ `proof:chronic-closure` must RED with `[runtime-band] FOLD row 'DL-PLANT-1' cites a
source-shape gate 'proof:boundary' — not a RUNTIME gate (no browser opened over the dist)`.

```
# Planted row 2 — HANDOFF targeting unpublished future version
| DL-PLANT-2 | L | 1 (L) | HANDOFF → value.js 0.15.0 | L.W9 | value.js 0.15.0 not yet on npm |
```
→ `proof:chronic-closure` must RED with `[tripwire] HANDOFF row 'DL-PLANT-2' targets an
unpublished sibling version — tripwire is not a published-consume-edge`.

```
# Planted row 3 — bare BOOK, chronicity ≥4
| DL-PLANT-3 | B (B,C,D,E,F,G,H,I,J,K,L) | 11 (B,C,D,E,F,G,H,I,J,K,L) | BOOK (future decide) | — | — |
```
→ `proof:chronic-closure` must RED with `[p-invariant-28] bare BOOK row 'DL-PLANT-3' has
chronicity 11 ≥ 4 — must EXIT (FOLD/HANDOFF/KILL/OUT), not BOOK`.

**GREEN condition:** the three planted rows are removed; every row in `PROGRESS.md §"Open
deferrals"` is at a terminal disposition per the vocabulary; the `CHRONIC_LEDGER` path constant
is re-pointed to `docs/tranches/L/PROGRESS.md` in the same commit; the gate output reads `✓
proof:chronic-closure — the L ledger is TERMINAL`.

**Why this gate (and not a new one):** the `proof:chronic-closure` gate IS the substrate
transition mechanism — it is the gate that catches the "chronic silently dropped across a
tranche boundary" failure mode (the P-invariant-28 mis-termination that H→J carried, caught by
K.W0's oracle rebuild). Its non-vacuity proof is the planted-row RED discipline. A new gate would
duplicate its grammar; the re-point is the intended usage.

---

## Deps

| Dep | Required state | Status at dev-phase |
|-----|---------------|---------------------|
| Band A (L.W1–L.W8) | ALL green CI | DEVELOPED, impl opens on auth |
| Band B dispatches (L.W9 L.W10) | dispatched; each born-RED consume-edge named with tripwire; consumed OR honestly circled-back | DEVELOPED; L.W9 dispatches filed; L.W10 research-spike decision record written |
| `proof:all == CI` | the full roster from `package.json:173-175` must pass | GREEN today on K close tree — L waves must not RED any existing gate |
| `proof:chronic-closure` non-vacuity proof | three planted rows must RED before clean ledger greens | non-vacuous by construction (the grammar enforces it) |
| USER-DOMAIN version cut | Mike Babb fires `changeset version` + `npm publish` | confirm-first; version decision per S5 |
| value.js `^0.13.0` | Band A sufficient (sampleColorRamp/deltaEOK/reverseCSSTime/serializeStylesheetItem all published at 0.13.0) | `^0.13.0` already in `package.json:194` |
| glass-ui `~4.0.0` | Band A sufficient | `~4.0.0` already in `package.json` |

**No new sibling publish is required for Band A.** The L.WZ close does NOT block on value.js O
(0.14.0) or glass-ui 4.1.0. Band-B edges that have not consumed by L.WZ close as HANDOFF with
named tripwires; that is the honest state, not a punt.

---

## Bite (what regression each S-clause gate catches)

| S-clause | Gate | Regression it catches |
|----------|------|-----------------------|
| S1 — FINAL.md inv ε | Authored boundary claims must each cite an observed oracle | Prevents a FINAL that asserts replay-equality TOTAL without a `proof:replay-equality` GREEN witness — exactly the ⚠9 overclaim shape in `K.WZ.md:524` / K's T1 |
| S2 — deferred ledger TERMINATED | `proof:chronic-closure` GREEN on the L ledger | Prevents a chronic silently drifting across the L→M tranche boundary without a terminal disposition — the H→J P-invariant-28 mis-termination pattern (`audit-32-skeleton.txt ⚠4`) |
| S3 — prompt-recap confirmed | Zero drops — every user request at a terminal verdict | Prevents a user request from A→L being un-dispositioned at the close — the "A→K zero drops" discipline carried forward |
| S4 — substrate transition non-vacuous | `proof:chronic-closure` REDs on the three planted row shapes before the clean ledger greens | Prevents the substrate transition from being a vacuous path-swap that clears a gate over a malformed ledger — the K.WZ planted-probe discipline |
| S5 — version cadence decision | USER-DOMAIN; the FINAL cites the OBSERVED `package.json` version after the cut | Prevents the FINAL from asserting a version string that was never cut — the INVE-1 overclaim shape from `J/final-vs-tree-inv-epsilon.md` |
| S6 — `proof:all` GREEN + deploy round-trip | `npm run proof:all` + observed CI→deploy→live bytes | Catches any Band-A wave regression that the full roster flags; catches a deploy stub that never auto-fires — the CI-was-dead `ci.yml`-YAML-invalid pattern from H–J |
| S7 — Lighthouse re-verification | `proof:lighthouse-mobile` with K-floor hard floor | Catches any L.W8 barrel-dogfood or L.W4 gate-suite change that degrades mobile performance below the K floor — the DL-L12 regression guard |
