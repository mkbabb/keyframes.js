# CONSTELLATION-DAG — the three-tranche dependency map + the cadence + the precepts-adherence checklist

**Author:** keyframes.js Tranche-K DEVELOPMENT (the constellation-consistency lane). **Scope:**
the end-to-end coherence of the acyclic spine across the three in-flight tranches —
**glass-ui BA → 4.0.0**, **value.js N → 0.13.0 / v1.0.0**, **keyframes.js K** — verified against
each tranche's authored specs. **DOCS ONLY:** this record edits no source, no test, no CI, no
wave spec; it READS the three trees and reports the DAG + any inconsistency fixed. It is the kf-side
mirror of glass-ui's `BA/coordination/CONSTELLATION-CADENCE-2026-06-15.md` and value.js's
`N/EXECUTION-ORCHESTRATION.md §4`, reconciled into one map.

**Date:** 2026-06-15. **Phase:** all three repos are in DEVELOPMENT (BA GREENLIT/executing Batch 7;
N RATIFIED, awaiting the one BA-cut wait; K authored-now-run-later). The dev/impl boundary holds in
every repo: full wave SPECS, no source/test/CI edits.

**Sources of record** (every claim below cites one):
- glass-ui: `BA/BA.md`, `BA/EXECUTION-DAG.md`, `BA/coordination/CONSTELLATION-CADENCE-2026-06-15.md`
- value.js: `N/N.md`, `N/EXECUTION-ORCHESTRATION.md`, `N/GRAMMAR-FOLD.md`, `N/waves/N.W11.md`,
  `N/waves/N.W11-prime.md`, `N/waves/N.W18.md`, `N/waves/N.W9-prime.md`
- keyframes.js: `K/K.md`, `K/KF-TO-VALUEJS-GRAMMAR-ASKS.md`, `K/VALUEJS-N2-ASKS.md`,
  `K/waves/K.W1.md`, `K/waves/K.W9.md`, `K/waves/K.W10.md`
- the precept: `docs/precepts/cross-repo-dev-resolution.md` (invariant 30, contract-v2)

---

## §1 — The DAG (the published-library spine — strictly acyclic)

The spine is acyclic **by VALUE LAYER, not by repo adjacency** (glass-ui's cadence doc, line 20).
The PUBLISHED-LIBRARY dependency graph — the edges that live in a `package.json` `dependencies` /
`peerDependencies` — has NO cycle:

```
            ┌──────────────────────────── publishes spring (SpringProgress, springLinearStops,
            │                              springTimingFunction — the kf LIGHT surface) ──────────┐
            │                                                                                      ▼
   value.js N  ──publishes grammar──▶  keyframes.js K  ──peered-by──▶  glass-ui BA
   (0.13.0: scroll +    (0.12.0 RIPE consumes + 0.13.0      (peers @mkbabb/keyframes.js
    color ramp;          scroll/ramp consumes; K.W9/K.W10)   ^2.2.0||^3.0.0||^4.0.0)
    v1.0.0 at N close)
```

**The three LIBRARY edges, each a PUBLISHED consume one tranche behind, born-RED-gated downstream,
NEVER a `file:` link or vendored copy:**

| # | Producer → Consumer | Value crossing the edge | The consume wave + gate | Cut |
|---|---|---|---|---|
| **E1** | value.js → keyframes.js | scroll-timeline grammar (`CSSTimelineOptions`) | **K.W9** `src/animation/scroll.ts` → `proof:scroll-roundtrip` (b) | value.js **0.13.0** (N.W11′) |
| **E2** | value.js → keyframes.js | perceptual ramp (`sampleColorRamp`) | **K.W10** `src/animation/compile.ts` color leg → `proof:compile-replay-equal` (d) | value.js **0.13.0** (N.W11.D) |
| **E3** | keyframes.js → glass-ui | spring (`SpringProgress`, the `linear()` stops) | glass-ui peers `@mkbabb/keyframes.js ^4.0.0`; consumed across the dock/morph springs | kf **4.2.0** (J) satisfies; K's cut keeps `^4.x` |

**Why no cycle.** kf→glass-ui (E3) is the SPRING value edge — kf is the PRODUCER of the spring math;
glass-ui's library DEPENDS on it (peer). glass-ui→kf in the other direction is NOT a library edge —
it is kf's DEMO (an application) consuming glass-ui COMPONENTS, not kf's published library taking a
glass-ui dependency (kf carries glass-ui in `optionalDependencies` for the demo only; `K.W1.md:83`
`package.json:182`). The published-library graph is therefore: value.js depends on nothing from a
sibling; kf depends on value.js (grammar); glass-ui depends on kf (spring). A → B → C with no
back-edge. Acyclic. (glass-ui's cadence doc states the same in its line-15 figure; value.js's
`EXECUTION-ORCHESTRATION.md:47` "The spine is acyclic: glass-ui → value.js → keyframes; each
consumes one tranche behind. No cycle.")

**Note on the two spine ORIENTATIONS in the prose.** value.js and glass-ui phrase the spine as
"glass-ui → value.js → keyframes" — that is the **COMPONENT/design-system consume direction**
(value.js's demo and kf's demo both consume glass-ui COMPONENTS; value.js's `N.W18` re-pins onto the
BA cut). The kf charter phrases the LIBRARY spine as "value.js → kf → glass-ui" — the **VALUE
producer direction** (grammar flows down, spring flows up). Both are correct; they describe
different edge classes (application-component consume vs published-library value consume). Neither
forms a cycle because the component-consume edges are demo-level, not library-graph edges. This
record states both explicitly so the two orientations are not read as a contradiction.

---

## §2 — The cadence (the version beats, end to end)

The constellation advances in ONE forward arc. Each beat is a PUBLISHED consume; the consumer's
source half lands born-RED against the recorded absence, and the consume edge LIGHTS on the publish
(the J.W7b published-consume-edge idiom, charter-binding as K's acyclic-spine invariant).

```
   glass-ui BA ───────cuts 4.0.0───────▶  value.js N.W18 consumes BA 4.0.0 ──────▶  value.js N.W9′ cuts v1.0.0
   (H4 DECIDED; the         (the abrogation sweep +          (the pin discharged by W18;
    U-fix mass; honest       adopt-π; inv-N-6 amended          the value layer reaches 1.0)
    major, no alias)         "3.13.0" → "the BA cut")

   value.js N.W11+N.W11.D+N.W11′ ──cuts 0.13.0──▶  kf K.W9 (scroll) + K.W10 (ramp densify) edges LIGHT
   (color-SOTA + scroll grammar + ramp)              (the source halves already born-RED; clauses (b)/(d) green)

   kf 4.2.0 (J) / K's cut ──peered-by──▶  glass-ui BA preserves @mkbabb/keyframes.js ^4.0.0 at the cut
```

### §2.1 — The version table (what each repo publishes, in order)

| Repo | Current `latest` | This-tranche cuts | Role at the cut | Spec anchor |
|---|---|---|---|---|
| **glass-ui** | `3.13.0` (AZ close) | **4.0.0** (H4 DECIDED) | the U-fix-mass + design-system PRODUCER | `BA.md` H4; `EXECUTION-DAG.md §0` |
| **value.js** | `0.12.0` | **0.13.0** (N.W11 + N.W11.D + N.W11′), then **v1.0.0** (N.W9′ close) | the BA-cut SINK + the grammar PRODUCER (scroll/ramp) | `N.md:140`, `:180-190`; `EXECUTION-ORCHESTRATION.md §4` |
| **keyframes.js** | `4.2.0` (J close) | K's cut (version TBD at K close — the spring PRODUCER stays `^4.x`) | the grammar CONSUMER + the spring PRODUCER | `K.md §value.js coordination`; `K.W1.md` |

### §2.2 — The task-statement cadence reconciled

The orchestrating ask names the cadence **"glass-ui 4.0.0 → value.js 0.13.0/v1.0.0 → kf K"**. This is
the FORWARD cadence and it is correct at every node:

- glass-ui ships **4.0.0** — confirmed (`BA.md` H4 DECIDED, `CONSTELLATION-CADENCE §1`). ✓
- value.js ships **0.13.0** (the grammar fold) then closes at **v1.0.0** — confirmed
  (`N.md:140` "`0.13.0 = N.W11 + N.W11.D + N.W11′` … **v1.0.0** at the N.W9′ close";
  `GRAMMAR-FOLD.md` status line). ✓
- kf consumes into **K** (Band II's K.W9/K.W10) — confirmed. ✓

**The one phrasing that could read as a discrepancy** (RESOLVED, not a defect): the kf charter's
local snapshot says K.W1 re-pins to **glass-ui 3.13.0** and **value.js 0.12.0** (`K.md §finding-cluster
ledger`, `K.W1.md`). That is the BASELINE K consumes at its FIRST consume wave (W1) — the predecessors
PUBLISHED today — not the forward cut. The forward cut (glass-ui 4.0.0, value.js 0.13.0/v1.0.0) is what
K's LATER waves (K.W9/K.W10) and value.js's close consume. Both numbers are true at different waves:
**K.W1 = consume-the-published-now (3.13.0 / 0.12.0); K.W9/K.W10 = consume-the-next-cut (value.js
0.13.0); the glass-ui 4.0.0 cut is K's OPTIONAL forward re-pin** (K.W1 explicitly leaves "pin 3.13.0 now
vs wait for BA" as the kf owner's call — `EXECUTION-ORCHESTRATION.md:43,149`). No inconsistency: the
two cadence statements describe the same spine at two time slices.

### §2.3 — The two genuinely cross-repo WAITS

Only TWO waits cross a repo boundary; both are PUBLISHED-consume waits (the work lands born-RED, the
edge lights on the publish — neither blocks the producing repo):

1. **value.js N.W18 + N.W9′ ON glass-ui BA 4.0.0** — value.js holds its close pin at the BA cut
   (`inv-N-6` amended "3.13.0" → "the BA cut"; `N.md:158`, `EXECUTION-ORCHESTRATION.md:43,168`). This
   gates only the PIN, not value.js's library/design work (which runs through R3 independent of BA).
2. **kf K.W9 + K.W10 ON value.js 0.13.0** — the scroll grammar (E1) and the ramp densify (E2). The kf
   source halves land NOW born-RED; clause (b)/(d) red until the publish, then light
   (`KF-TO-VALUEJS-GRAMMAR-ASKS.md §1.3/§2.3`, `GRAMMAR-FOLD.md §I.3/§II.5`).

Neither wait is on the critical path of the producing repo. glass-ui BA is already cutting (Batch 4
closed); value.js's grammar is RATIFIED into N's R2 library track (no demo/BA dependency).

---

## §3 — Reciprocity: every cross-repo ask has a named owner on BOTH sides

The constellation's coherence test: no ask is a one-sided hope. Each edge has a PRODUCER spec and a
CONSUMER spec that name each other's file:line.

| Edge | The ASK | Producer owner (spec) | Consumer owner (spec) | Reciprocal? |
|---|---|---|---|---|
| **E1 scroll grammar** | `CSSTimelineOptions` typed extractor + inverse serializer | value.js **N.W11′** (`N/waves/N.W11-prime.md`; `GRAMMAR-FOLD.md` PART II) names the kf consumer `src/animation/scroll.ts` + `proof:scroll-roundtrip` (b) | kf **K.W9** (`K/waves/K.W9.md §S1`; `KF-TO-VALUEJS-GRAMMAR-ASKS.md §1`) names the value.js producer beside `extract.ts` | **YES** — each names the other's seam |
| **E2 perceptual ramp** | `sampleColorRamp(from,to,n,{space,hueMethod})` | value.js **N.W11.D** (`N/waves/N.W11.md` lane D; `GRAMMAR-FOLD.md` PART I) names the kf consumer `compile.ts` color leg + `proof:compile-replay-equal` (d) | kf **K.W10** (`K/waves/K.W10.md §S2`; `KF-TO-VALUEJS-GRAMMAR-ASKS.md §2`) names the value.js producer beside `mix.ts` | **YES** — mutual file:line |
| **E3 kf spring peer** | glass-ui's 4.0.0 MUST keep `@mkbabb/keyframes.js ^4.0.0` | glass-ui (`CONSTELLATION-CADENCE §2.2`, §3 kf-peer row) — "BA owes: do NOT narrow below `^4.0.0`" | kf K.W1 verified `^4.0.0` admits 4.2.0 (`K.W1.md:108-110`) | **YES** — glass-ui names the obligation; kf verified the current admit |
| **value.js 0.12.0 RIPE consumes** | E1/E2 parsers, LRU bound, path sampler, `deltaEOK`, `ParseDiagnostic` | value.js **N.W7** shipped them in 0.12.0 (`N.md:156`) | kf **K.W1/K.W6/K.W7** consume (`VALUEJS-N2-ASKS.md §2`, the 12-row witness-flip slate) | **YES** — inbound `VALUEJS-N2-ASKS.md` is the receipt |
| **value.js → BA cut consume** | the U-fix mass (dark-material, emission, tabs, dock FLIP, surface axis) | glass-ui **BA** Batches 0–6 (`CONSTELLATION-CADENCE §1`) | value.js **N.W18.A** enumerates the consume set (`N/waves/N.W18.md`; `CONSTELLATION-CADENCE §2.1`) | **YES** — N.W18 names the producer rows |
| **easing-editor primitive** (3-way) | first-class `<EasingConfigurator>`: math=value.js, time/spring=kf, component=glass-ui | glass-ui books **W-EASING-PRIMITIVE** (arm B; `CONSTELLATION-CADENCE §2.1`) | kf is the DONOR study (`VALUEJS-N2-ASKS.md §4`); value.js N.W18.B consumes on publish | **YES, as a NAMED BOOK** — not authored by 4.0.0 NOR K; the home is glass-ui's W-EASING-PRIMITIVE, recorded on all three sides (see §5 gap) |

**Verdict: every cross-repo ask is reciprocal.** The two net-new grammars (E1/E2) carry mutual
file:line seams on producer and consumer. The spring peer (E3) is named as a glass-ui obligation and
verified kf-side. The easing-editor is the one ask authored by NEITHER current cut — but it is a
NAMED BOOK (`W-EASING-PRIMITIVE`), recorded on all three sides, not a silent drop.

---

## §4 — Precepts-adherence checklist (each tranche's specs cited conformant, or the gap named)

The standing precept spine (`cross-repo-dev-resolution.md` invariant 30; `instructions/README.md`
edicts): the acyclic spine; PUBLISHED consume one tranche behind, born-RED-gated downstream, NEVER a
`file:` link / vendored copy; NO workarounds; NO legacy beside replacement; idiomatic gestalt; KISS;
measure-first; the dev/impl boundary.

| Precept | keyframes.js K | value.js N | glass-ui BA |
|---|---|---|---|
| **Acyclic spine (no cycle)** | CONFORMANT — the acyclic-spine invariant is charter-binding (`K.md §invariant set`); value.js→kf grammar, kf→glass-ui spring, no back-edge (`KF-TO-VALUEJS-GRAMMAR-ASKS.md:23`) | CONFORMANT — `EXECUTION-ORCHESTRATION.md:47` "acyclic … No cycle"; `N.md:199` | CONFORMANT — `CONSTELLATION-CADENCE.md:20-25` "acyclic by VALUE LAYER … No cycle" |
| **PUBLISHED consume, one tranche behind** | CONFORMANT — K.W1 consumes value.js 0.12.0 + glass-ui 3.13.0 (both PUBLISHED); K.W9/K.W10 consume on value.js's 0.13.0 PUBLISH (`K.W1.md`, `KF-TO-VALUEJS-GRAMMAR-ASKS.md §4`) | CONFORMANT — N.W18 consumes the BA cut ON its PUBLISH; the pin discharges at the cut (`N.md:158`, `N.W18.md`) | CONFORMANT — BA consumes its `@mkbabb/*` from the REGISTRY, not local branches (`branch-recon-crossrepo.md:97`) |
| **born-RED-gated downstream** | CONFORMANT — K.W9 `proof:scroll-roundtrip` (b) + K.W10 `proof:compile-replay-equal` (d) RED against the recorded VJ.W1/VJ.W2 absence, light on publish (`KF-TO-VALUEJS-GRAMMAR-ASKS.md §1.3/§2.3`) | CONFORMANT — N.W11.D + N.W11′ born-RED probes RE-VERIFIED ZERO at 0.12.0 (`N.W11.md` SV-4, `N.W11-prime.md` §State; `GRAMMAR-FOLD.md:46`) | CONFORMANT — the producer-side EMISSION gate + `proof:ba-gestalt` born-RED against the R8 state (`BA.md` W-EMISSION, W-GESTALT-GATE) |
| **NEVER a `file:` link / vendored copy (cross-repo)** | CONFORMANT — explicitly forbidden in the charter ("NEVER a `file:` link or a vendored copy" — `K.md §MANDATE`); the consume is a re-pin on publish | **NAMED INTERIM, not a violation** — value.js HOLDS `file:../glass-ui` through W5 against a clean local dist, migrates to the registry pin at the BA cut (`N.md:131-135`). This is a DEV-mode local-dist hold the precept's contract-v2 permits for an in-flight sibling, scheduled to retire at N.W18; it is a bounded interim with a named restoration wave, NOT a checked-in `file:` resolution target | CONFORMANT — registry-only consume (`branch-recon-crossrepo.md:97`); inv-7 no-alias on the 4.0.0 major |
| **NO workarounds / NO legacy beside replacement** | CONFORMANT — the cold-path P0 dies at the ADAPTER seam not a `play()` sprinkle; the compiler is the parser run BACKWARD, not a lossy re-emitter (`K.md §MANDATE`); 12 KILLs as anti-charter | CONFORMANT — the blob/aurora forks DELETED and consumed from glass-ui (N.W5); `inv-N-10` abrogation sweep retires the legacy class | CONFORMANT — disco retirement, `/underline` fold, tabs/pager rebuilds are CLEAN BREAKS, no alias (`BA.md` H2/H4, inv-7) |
| **Idiomatic gestalt / KISS** | CONFORMANT — the design roots collapse to ONE font-voice authority + a derived grid (not magic offsets); architectural transposition over patch (`K.md §MANDATE`) | CONFORMANT — CRUD right-sizing (KISS, `N.W3`); the ramp is a COMPOSITION over shipped kernels (~40 LoC, zero new color science — `GRAMMAR-FOLD.md §I.1`) | CONFORMANT — ONE tab family/engine, ONE tone recipe, ONE wobble engine, tokens-first (`BA.md` W-TABS/W-FEEDBACK-TONE/W-HANDMARK) |
| **Measure-first** | CONFORMANT — the audit is the measure (32 lanes); the cold-path P0 is observed live, not asserted | CONFORMANT — VJ.W2 carries an EXPLICIT MEASURE-FIRST bench-is-the-gate clause (`GRAMMAR-FOLD.md §I.1`, "the bench is the gate, not a number asserted in advance"); VJ.W1 marked N/A (correctness grammar) | CONFORMANT — the dark-material ΔL step + the spring-clock are π-measured before/after; W-DARK-MATERIAL R9 LIVE-PROVEN |
| **Dev/impl boundary** | CONFORMANT — K is authored-now-run-later; "No engine, demo, gate, test, or CI source is written in development" (`K.md §Phase`) | CONFORMANT — "DOCS ONLY — nothing implemented; this is tranche development" (`GRAMMAR-FOLD.md`, `EXECUTION-ORCHESTRATION.md:9`) | CONFORMANT — the cadence doc "edits no BA wave spec, no source, no test, no CI" (`CONSTELLATION-CADENCE.md:3`) |
| **Reciprocal cross-repo ownership** | CONFORMANT — every kf ask names its value.js/glass-ui owner (`KF-TO-VALUEJS-GRAMMAR-ASKS.md`, `VALUEJS-N2-ASKS.md`) | CONFORMANT — N.W11.D/N.W11′ name the kf consume seams; N.W18.A enumerates the BA-cut consume set | **PARTIAL — see §5**: the value.js N2 ADDENDUM (register A′/F) is named by value.js N.W18.A as a BA-cut consume expectation but is UNCOVERED by any BA wave |

**One named gap (glass-ui side, already self-reported): §5.**

---

## §5 — The one named coverage gap (glass-ui BA's value.js-N2 ADDENDUM)

glass-ui's own cadence doc (`CONSTELLATION-CADENCE §3`) SELF-REPORTS the single coherence gap in the
constellation, so it is recorded here for completeness — it is NOT a kf-side or value.js-side defect,
and it does NOT break the acyclic DAG:

- **What:** the value.js N2 letter's ADDENDUM — register A′ (the perf producer cluster A′-1..A′-6)
  and register F (the standing carries F-1..F-4) — which value.js **N.W18.A** explicitly names as
  BA-cut consume expectations, but which the BA fold analysis (`audit/fleet/valuejs-fold.md`) never
  ingested and no BA wave folds.
- **Severity:** two are P0 (A′-2 the GooBlob visibility/PRM gate, A′-3 the card-shrink layout
  keyframes at CLS 1.03); F-2 (glass-ui's value.js peer `^0.10.0 || ^0.11.0` not admitting the
  published 0.12.0) has a live peer-warning blast radius TODAY.
- **The reciprocal-ownership consequence:** value.js's N.W18 abrogation sweep would assume a
  producer fix that is not at the 4.0.0 cut. The no-silent-drop law requires a BY-NAME disposition in
  BA's W-CLOSE value.js adopt book stating which addendum asks land at 4.0.0 and which book to a 4.x
  point release.
- **Owner:** glass-ui BA lead (the routing recommendation is `CONSTELLATION-CADENCE §4`; this is a
  BA-side close-debt item, dispatched within the BA tranche per the dev/impl boundary).
- **kf exposure: NONE.** No A′/F item is on a kf consume edge. kf's spring-peer row (E3) is the only
  kf-touching item in that gap table, and it is "preserved by default, ungated" — glass-ui's 4.0.0
  currently admits `^4.0.0`; the recommendation is to make W-CLOSE ASSERT the kf peer survives the
  major bump rather than leave it ungated. kf's K.W1 already verified the current admit
  (`K.W1.md:108-110`).

This gap is INSIDE glass-ui's tranche scope, self-reported, with a named owner and routing — exactly
the precepts' "no silent deferrals" path (a named destination, not a chronic drop). It is the one
ASK-WITHOUT-FULL-RECIPROCAL-COVERAGE in the constellation, and it is already in the open on the
producing side.

---

## §6 — The terminal reading (the DAG, in one paragraph)

The constellation is acyclic and moving as ONE forward arc. glass-ui cuts **BA 4.0.0** — an honest
major carrying the U-fix mass, no alias. value.js's **N.W18** consumes that cut (the pin discharges,
`inv-N-6` amended to the BA cut) and **N.W9′** closes the value layer at **v1.0.0**; in the same
constellation beat value.js's R2 library track ships **0.13.0** = the color-SOTA wave + the perceptual
ramp (N.W11.D) + the scroll grammar (N.W11′), the two net-new grammars kf's frontier dispatched.
keyframes.js **K** consumes value.js's 0.12.0 RIPE edges at K.W1 (one tranche behind, published) and
lights its scroll (K.W9) and ramp-densify (K.W10) consume edges on value.js's 0.13.0 publish — the
source halves land born-RED, the edges light on the cut, never a `file:` link. kf produces the spring
glass-ui peers (`^4.0.0`), closing the loop WITHOUT a cycle because that edge is a value-producer edge,
not a library back-dependency. Every cross-repo ask has a reciprocal owner naming the other's seam by
file:line; the two genuinely cross-repo waits (value.js ON the BA cut, kf ON value.js 0.13.0) are
PUBLISHED-consume waits that block only a final pin, never a producing repo's own progress. The one
coverage gap — glass-ui's un-folded value.js-N2 addendum — is self-reported on the producing side with
a named owner and a no-silent-drop routing, and touches no kf consume edge. The spine holds: glass-ui
→ value.js → keyframes (components/design down), value.js → keyframes → glass-ui (values up), no cycle,
each one tranche behind, each a published edge.
