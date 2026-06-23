# Q.WA4 — proof:wave-charter (the 7-question smell-test gate) + the Q DAG manifest + the constellation pin-ledger witness

**Band:** A — Apparatus.
**Phase:** NOW — kf-internal, zero sibling dependency, executable on authorization.
**Sequence (the DAG edge):** `Q.W0 (charter substrate) ─► Q.WA4` (this wave — author the contrivance
smell-test ENFORCER + the machine-readable DAG manifest + the pin-ledger witness) `─► [lands FIRST
among the perf-relevant Band-A waves: every Q Band-B perf wave (Q.WB1/WB3/WB4) authors its born-RED
gate UNDER proof:wave-charter's 7-question discipline]`. Q.WA4 is parallel to Q.WA1/Q.WA2/Q.WA3 (no
inter-dependency) but is the GATE-PROTECTOR that must exist before any Band-B perf charter so the
"aggressively optimize" trap (the transplanted-ratio failure mode) cannot re-arm in Q.
**Owning-DM-or-idea:** the **B6-completeness-critic** lane's Q.W-CHARTER ("the contrivance enforcer
never landed — `proof:wave-charter` ABSENT", `AUDIT-31.md` B6-completeness-critic MEASUREMENT-NOT-TAKEN
GATE) + the **B6-dag-ordering** Q DAG manifest ask (the acyclic-spine witness) + the **B7-shipped-regression**
Q.W0c CONSTELLATION PIN-LEDGER WITNESS (pre-empt future pin drift).

This wave is the **contrivance backstop + the DAG/pin witness**, not a strategy change: it makes the
7-question smell-test a CI gate (so no transplanted-ratio charter escapes), crystallizes the Q DAG into
a machine-readable manifest (so the acyclic-spine + the ordering edges are checkable), and witnesses the
shipped pin set (so pin drift is caught). It ships ZERO engine code.

---

## §Context — the contrivance enforcer that never landed + the un-witnessed DAG + the drift-prone pins

Three apparatus gaps, each verified live:

1. **`proof:wave-charter` is ABSENT** (`AUDIT-31.md` B6-completeness-critic): the CONTRIVANCE-AUDIT's
   durable preventive — the 7-question pre-charter smell-test + the transplanted-ratio bite
   (`docs/tranches/P/CONTRIVANCE-AUDIT.md:144–154`) — was authored as a DISCIPLINE but never wired as a
   GATE. Confirmed: `ls scripts/proof-wave-charter.mjs` → No such file. So the "aggressively optimize"
   trap is re-armed for Q: a perf wave could charter on a TRANSPLANTED ratio (the 3.86× reused across
   paths — the exact trap the impl drive hit and reverted, `spring-vector-decision.json` lineage) with
   no gate to bite it. The smell-test (CONTRIVANCE-AUDIT.md:144–152) is the 7 questions: MEASURED-BOTTLENECK,
   DEFAULT-PATH, IN-REALM-SOLVABLE, SINGLE-PATH, SMALLEST-CHANGE, SAME-REPORT-RATIO, EXTERNAL-BEHAVIOR-DELTA
   — with the load-bearing clause: "a perf wave's born-RED bench baseline path MUST be the wave's own
   target function (asserted by name in the wave header), and the decision-JSON `baselineCase`
   name-matches the wave's declared target."
2. **The Q DAG manifest is DEV-authored but UN-ASSERTED (no gate parses it)** — `Q.md §3` draws the four
   internal ordering chains + the cross-repo publish chain in PROSE; the DEV-authoring lane has ALSO
   committed the machine-readable manifest `docs/tranches/Q/DAG.md` (confirmed on the tree — a fenced
   `json` node+edge block). BUT **no gate parses it**: `ls scripts/proof-wave-charter.mjs` → No such file
   (confirmed), so nothing asserts the manifest is acyclic or that no kf wave consumes an unpublished
   sibling surface. The manifest is a static artifact with no enforcement — the born-RED here is the
   ABSENT GATE, not an absent manifest. (Neither `docs/tranches/O/DAG.md` nor `docs/tranches/P/DAG.md`
   exists — Q introduced the machine-readable-DAG pattern; O/P drew their DAGs in prose only.)
3. **The constellation pins are drift-prone + un-witnessed** (`AUDIT-31.md` B7-shipped-regression Q.W0c;
   B6-crossrepo-versions): kf pins value.js `^1.1.0` (a caret — a future 1.2.0 is auto-consumed with NO
   re-pin, NO consume-edge observable — B6-crossrepo-versions). There is no single machine-readable
   record of the SHIPPED pin set (kf 4.4.0 → value.js ^1.1.0 → parse-that ^0.12.0 transitive; glass-ui
   ~4.0.0 installs 4.0.1) that a gate can regenerate-and-compare to catch silent drift.

**Why this is a wave, not a preamble.** Q's no-deferral mandate REQUIRES that no perf wave escape on a
speculative/transplanted charter (the `Q.md §7` contrivance re-check: "Every Q perf wave carries a
measure-first born-RED gate on its OWN target path — the `proof:wave-charter` discipline, Q.WA4 — so no
transplanted-ratio charter escapes"). The smell-test gate is the named enforcer; it must land BEFORE
the Band-B perf waves charter. The DAG manifest makes the no-deferral spine (acyclic, no-unpublished-
consume) checkable, not asserted. The pin-ledger witnesses the shipped truth so the caret-pin drift is
caught.

---

## §Scope — the S-clauses

### S1 — author `proof:wave-charter`: the 7-question smell-test + the transplanted-ratio bite

**Breach.** `scripts/proof-wave-charter.mjs` is absent; the 7-question smell-test is a discipline with
no gate. A perf wave can charter on a transplanted ratio unchecked.

**Cure.** Author `scripts/proof-wave-charter.mjs` (a docs-and-presence gate — KISS, no engine surface).
It parses every `docs/tranches/Q/waves/Q.W*.md` and asserts THREE real regressions are caught:
- **(i) a perf wave with no smell-test answers** — every wave whose header or scope makes a PERF claim
  (a born-RED bench, a ratio, a "perf" headline) MUST answer the 7 questions (CONTRIVANCE-AUDIT.md:144–152)
  in its header/context. A perf wave missing the answers → RED.
- **(ii) the transplanted-ratio trap (the load-bearing bite)** — a perf wave's born-RED bench
  `baselineCase` MUST name-match the wave's DECLARED target function (asserted by name in the wave
  header). A wave that charters on a ratio measured on a DIFFERENT path (the 3.86× / spring-vector
  transplant) → RED. The decision-JSON `baselineCase` name-matches the declared target.
- **(iii) a `[radical]` wave with no MEASURE-FIRST/DEMOTE-TO-SPIKE disposition** — any "no" on questions
  1/3/4/6 must be dispositioned DEMOTE-TO-SPIKE or MEASURE-FIRST before charter (CONTRIVANCE-AUDIT.md:154).
Wire `proof:wave-charter` into `proof:hygiene` so every Band-B perf charter is gate-protected.

### S2 — author the Q DAG manifest `docs/tranches/Q/DAG.md` (the acyclic-spine witness)

**Breach.** `Q.md §3` draws the DAG in prose; no machine-readable manifest a gate can parse for
acyclicity + the no-unpublished-consume invariant.

**Cure.** Author `docs/tranches/Q/DAG.md` — a machine-readable manifest (a fenced edge-list or a small
JSON block) encoding the four internal ordering chains + the cross-repo publish chain from `Q.md §3`:
- `Q.WA3 master-merge ─► parse-that 0.13.0 (Q.WG1) ─► value.js 1.1.1/1.2.0 (Q.WG2) ─► kf GATED consumes
  (Q.WG4)`;
- `Q.WA2 drag2D-cert ─► Q.WC1 DemoControlPoint ─► Q.WC2 easing-editor dogfood`;
- `Q.WD1-bind attach-seam ─► Q.WD1 play-time guard` (the L.W1 S4 floor);
- `Q.WE1 alias-drop ─► Q.WF1 engine-split ─► Q.WZ 5.0.0 cut`;
- `glass-ui BC publish (Q.WG3) ─► kf S1/S2 delete (GATED) ─► Q.WZ`.
Each GATED kf consume edge (Q.WB2/WE2/WB3-color/WG4) names the EXACT sibling publish that fires it.

### S3 — the Q DAG gate clauses: acyclicity + no-unpublished-consume

**Breach.** Even with a manifest, nothing asserts it is ACYCLIC or that no kf wave consumes an
unpublished sibling surface (the no-deferral spine's two correctness invariants).

**Cure.** Extend `proof:wave-charter` (or a sibling clause) to parse `DAG.md` and assert: (a) the edge
graph is ACYCLIC (a topological sort succeeds — the B6-dag-ordering "acyclic and fully sequenceable"
verdict, made checkable); (b) every kf GATED-consume edge names a sibling publish that is EITHER already
published OR carries a DISPATCH-with-terminal-or-KILL (no kf wave consumes an unpublished surface with
no dispatch — the `Q.md §3` friction-chain-4 invariant).

### S4 — the constellation pin-ledger witness `docs/tranches/Q/PIN-LEDGER.json`

**Breach.** The caret pin (value.js `^1.1.0`) auto-consumes a future 1.2.0 with no consume-edge
observable (B6-crossrepo-versions); no single record of the shipped pin set.

**Cure.** Author `docs/tranches/Q/PIN-LEDGER.json` recording the SHIPPED pins (kf 4.4.0 → value.js
`^1.1.0` [package.json:221]; value.js 1.1.0 → parse-that ^0.12.0; glass-ui `~4.0.0` [package.json:224]
installs 4.0.1) AND the Q TARGET pins (value.js ^1.2.0 + glass-ui BC + parse-that 0.13.0 — the consume
edges Q.WG4 re-pins). Author `proof:pin-ledger-current` (NEW). **The HARD assertion is device-independent**:
the gate reads the LOCAL `package.json` declared pins + the LOCAL installed tree (`node_modules/<pkg>/package.json`
version + the lockfile) and COMPARES to the ledger's `shipped` set — RED on drift, a pure-filesystem read
(no network). **The `npm view @mkbabb/keyframes` registry cross-check is OBSERVE-ONLY** (the same posture
Q.WA3 applies to the deploy-roundtrip live leg — `declarePosture("observe-only", {reason: "registry
network dependence"})`): it is REPORTED, never blocking, so the gate does not flake offline / on the slow
Linux runner (the device-dependence-greening law). This makes the caret-pin consume an OBSERVABLE edge (a
future audit can tell whether the 1.2.0 features are actually wired, B6-crossrepo-versions friction)
WITHOUT importing a network dependency into the HARD CI path.

---

## §Born-RED gate — `proof:wave-charter` + `proof:pin-ledger-current` (over the REAL observable, inv-observable-truth)

**Gate names:** `proof:wave-charter` (NEW — `scripts/proof-wave-charter.mjs`, a docs-and-presence +
DAG-parse gate; AXIS-3 STATIC) + `proof:pin-ledger-current` (NEW — `scripts/proof-pin-ledger-current.mjs`).
Both wired into `proof:hygiene`.

**The REAL observable they bite (NOT a proxy):** the genuine defect is *a Q perf wave chartering on a
transplanted/speculative ratio with no smell-test answers, a DAG that is silently cyclic or consumes an
unpublished sibling, or a pin that drifts off the shipped/target set with no observable edge*. The gate
parses the ACTUAL wave-spec headers (the 7-question answers + the name-matched baseline), the ACTUAL
DAG manifest (topological sort + the consume-edge dispatch check), and the ACTUAL package.json pins vs
the ledger — each the genuine observable, not a grep of intent.

**What they assert (four clauses):**

**(a) the 7-question smell-test + the transplanted-ratio bite (S1).**
```
every perf-claiming Q.W*.md answers the 7 questions (CONTRIVANCE-AUDIT.md:144-152) in its header
a perf wave's born-RED bench baselineCase name-matches the wave's DECLARED target function
a [radical] wave with a "no" on Q1/3/4/6 carries a DEMOTE-TO-SPIKE/MEASURE-FIRST disposition
```
BITE: reds if a Band-B perf wave (e.g. a SoA-redux) charters on a ratio measured on a DIFFERENT path
(the transplant) — the load-bearing clause. *PLANT: a fixture wave header claiming "2.5× faster" with a
baselineCase naming a non-target function → the gate reds.*

**(b) the DAG manifest is present + acyclic + no-unpublished-consume (S2, S3).**
```
assert ls docs/tranches/Q/DAG.md                          → exits 0   # DEV-authored — a regression guard
parse the fenced json block; topological sort of nodes×edges succeeds   → acyclic
every node phase=="GATED" carries gatedOn.siblingPublish that is published OR has a non-null dispatchDoc
the dissolvedEdges[] (drag2D→Q.WC1) are asserted ABSENT from edges[]
```
BITE: reds if the DAG goes cyclic, a `GATED` node consumes an unpublished surface with no DISPATCH (the
no-deferral spine breached), or a dissolved edge reappears. *The manifest is DEV-present (the `ls` is a
standing guard); the LIVE bite is the topo-sort + the consume-edge dispatch check — those are what no
gate runs today.*

**(c) the pin-ledger witnesses the shipped + target pins (S4).**
```
assert ls docs/tranches/Q/PIN-LEDGER.json                          → exits 0
HARD (device-independent): local package.json + installed-tree pins == the ledger's `shipped` set (no drift)
OBSERVE-ONLY: `npm view @mkbabb/keyframes` registry pins == the ledger (reported, never blocking — network)
```
BITE (HARD): reds if the LOCAL pins drift off the witnessed `shipped` set (the caret-pin silent-consume
the lane found) — a pure-filesystem read, no network, no Linux-runner flake.

**(d) the gates are aggregator-reachable (no dead gate).**
```
proof:ci-coverage: proof:wave-charter + proof:pin-ledger-current reachable from proof:hygiene
```
BITE: reds if either gate is authored-but-unwired.

**Witness input that REDs on today's tree (pre-cure) — the HONEST born-RED (the gate scripts + the
PIN-LEDGER are absent; `DAG.md` is DEV-authored already):**
- Clause (a): `ls scripts/proof-wave-charter.mjs` → No such file (confirmed) → the gate cannot run →
  **RED**; a planted transplanted-ratio fixture wave passes unchecked today (no enforcer).
- Clause (b): `docs/tranches/Q/DAG.md` is PRESENT (DEV-authored — confirmed `ls` exits 0), but **no gate
  parses it** until `scripts/proof-wave-charter.mjs` lands → the acyclicity + no-unpublished-consume
  invariants are UN-ASSERTED → **RED** (un-runnability, not absence). The clause is a STANDING guard once
  the script exists (it reds if the manifest goes cyclic or grows an un-dispatched consume edge).
- Clause (c): `ls docs/tranches/Q/PIN-LEDGER.json` → No such file (confirmed) → **RED**; the caret pin
  `^1.1.0` (confirmed `package.json:221`) auto-consumes a 1.2.0 with no observable edge. *(Unlike DAG.md,
  the PIN-LEDGER.json was NOT DEV-pre-authored — it is genuinely born-absent, the cleanest born-RED here.)*
- Clause (d): neither gate exists → cannot be wired → red the moment authored-but-unwired.

This is a GENUINE born-RED on the real observable: the absent enforcer SCRIPTS + the un-PARSED DAG (the
manifest exists but nothing checks it) + the genuinely-absent PIN-LEDGER + the drift-prone pins — never a
proxy a stub could green, and NOT a false "the DAG manifest is missing" claim (it is not — it is
DEV-authored; what is missing is the gate that bites it).

**Greens on the cure:** `proof:wave-charter` authored + the 7-question discipline enforced + the
transplanted-ratio bite tested against a planted fixture (S1) + `DAG.md` authored, acyclic, no-unpublished-
consume (S2, S3) + `PIN-LEDGER.json` authored + `proof:pin-ledger-current` GREEN (S4) + both gates wired
+ `proof:ci-coverage` green (d).

**Implementation locus:** `scripts/proof-wave-charter.mjs` + `scripts/proof-pin-ledger-current.mjs`
(NEW gates), `docs/tranches/Q/DAG.md` + `docs/tranches/Q/PIN-LEDGER.json` (NEW manifests), `package.json`
(the two gate entries + `proof:hygiene` wiring). NO `src/` or `demo/` source change.

---

## §Dependencies

- **`docs/tranches/P/CONTRIVANCE-AUDIT.md` — already on disk** (the 7-question smell-test source,
  lines 144–154, confirmed). Q.WA4 wires the discipline into a gate; it does not re-author the smell-test.
- **Q.W0 (charter) — leads.** Q.WA4 reads `Q.md §3` (the DAG) + `Q.md §7` (the contrivance re-check) +
  the `AUDIT-31.md` B6-completeness-critic finding. No dependency on the other Band-A waves.
- **Feeds every Band-B perf wave (Q.WB1/WB3/WB4) + the GATED consume edges (Q.WB2/WE2/WB3-color/WG4).**
  Every Band-B perf charter answers the 7 questions UNDER `proof:wave-charter`; every GATED consume edge
  is checked by the DAG no-unpublished-consume clause. Q.WA4 lands FIRST among the perf-relevant Band-A
  waves so the trap cannot re-arm.
- **Independent of every sibling publish — pure NOW.** The smell-test gate, the DAG manifest, and the
  pin-ledger witness fire entirely on today's installed tree (the pin-ledger TARGET rows track the
  cross-repo frontier WITHOUT waiting on it — the crossRepo discipline).

---

## §dev→impl boundary

This file is the Tranche Q DEVELOPMENT spec for Q.WA4 — DOCS ONLY. It writes zero engine/demo/library
source (inv-16). The IMPLEMENTATION (the `proof-wave-charter.mjs` + `proof-pin-ledger-current.mjs`
gates, the `DAG.md` + `PIN-LEDGER.json` manifests, the CI wiring) opens only on the owner's explicit
authorization. When it opens it is gate-first (both gates authored born-RED BEFORE the manifests land),
observable-truth (the gate parses the actual wave-spec headers + the actual DAG topological sort + the
actual package.json pins, never a grep of intent; the transplanted-ratio bite is tested against a
planted fixture), no-legacy (the smell-test discipline is wired into a GATE, not left as prose; the
caret-pin silent-consume becomes an OBSERVABLE edge), KISS (a docs-and-presence gate — no engine
surface; the DAG is an edge-list, the pin-ledger a JSON record), gestalt (ONE contrivance enforcer over
ALL Q perf waves; ONE machine-readable DAG witness; ONE pin record), and P-invariant-28 (every Q perf
wave's verdict gets a durable measure-first terminal home; the DAG's no-unpublished-consume invariant
forbids the perpetual-punt a GATED-on-vapor wave would become).

---

## §Mid-tranche-friction pre-emption

**Friction this wave could spawn:** any Q perf wave (a SoA-redux, a new compositor path, a typed
channel) could re-charter on a transplanted ratio and force a mid-tranche measure-first reversal — the
exact 3.86× trap the impl drive hit (`AUDIT-31.md` B6-completeness-critic friction). **PRE-EMPT:** Q.WA4
lands the `proof:wave-charter` enforcer FIRST among the perf-relevant Band-A waves, so EVERY Band-B perf
charter is gate-protected at authoring time — the transplanted-ratio bite reds the charter before it
ships, not after a mid-tranche reversal. This is the named redress for the "measurement-not-taken gate"
the completeness-critic flagged.

**Second friction:** a kf GATED-consume wave (Q.WB2 @function inline, Q.WE2 leaves externalize) could
silently consume a not-yet-shipped sibling surface, recreating the P.W13 mid-tranche stall. **PRE-EMPT:**
the DAG no-unpublished-consume clause (S3) asserts every GATED edge names a published-or-dispatched
sibling — a wave that consumes vapor reds the DAG gate, not the build, mid-tranche.

**Third friction:** the caret pin `^1.1.0` auto-consumes value.js 1.2.0 with NO observable edge — a
future audit cannot tell whether the 1.2.0 features are actually wired (B6-crossrepo-versions friction).
**PRE-EMPT:** the pin-ledger TARGET rows (S4) record the Q re-pin to `^1.2.0` as an explicit consume
edge; `proof:pin-ledger-current`'s HARD clause reds if the LOCAL `package.json` + installed tree drifts
off the witnessed `shipped` set — the silent-consume becomes an observable, gated edge.

**Fourth friction:** `proof:pin-ledger-current` could import a NETWORK dependency if its drift-compare
ran `npm view` as a HARD assertion — it would flake offline / on the slow Linux runner (the exact
device-dependence class the CI-greening memory warns of). **PRE-EMPT:** the HARD assertion is a
pure-filesystem read of `package.json` + the installed tree (device-independent BY CONSTRUCTION); the
`npm view @mkbabb/keyframes` registry cross-check is OBSERVE-ONLY (`declarePosture`), reported but never
blocking — the SAME posture Q.WA3 applies to the deploy-roundtrip live leg.
