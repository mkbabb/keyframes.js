# P.WZ — Close + the 5.1.x cut (the tranche terminal · the live-byte deploy oracle)

**Band:** Z — Close + the 5.1.x cut
**Phase:** NOW-author · USER-DOMAIN publish (the LAST wave — author the gates + the close docs
NOW; the version cut + npm publish are USER-DOMAIN — Mike Babb fires the tag)
**Sequence:** P.W1…P.W12 all at terminal disposition → *(Bands A+B+C+D+E green) + (Band F
P.W11 WeakMap early-cure + O.W7 engine-seam) + (Band G S2 consumed, S1 on guard or contingency)
+ (codegen-consume on sibling publishes OR ADOPT/KILL verdict)* → **P.WZ close** → USER-DOMAIN
`v5.1.x` tag → `release.yml` publish → `deploy-pages.yml` round-trip observed
**Owning chronic/DM:** DM-7 keyframes-vue (4-tranche, P-inv-28 belt ACTIVE — USER-DOMAIN
publish here, NO 5th carry); DM-20 deploy round-trip (3-tranche, USER-DOMAIN); DM-16 5.0.0
cut (3-tranche — inherits from O.WZ; P.WZ inherits if O.WZ carried); the VERIFY-ONLY/RE-AFFIRM
roster (DM-8…DM-15) re-verifies here; the P-inv-28 S1 contingency (DM-5 S1, chronicity 4 at
P — MUST exit here if BC SFC guard did not ship)

---

## Context

P.WZ is the tranche terminal. It sequences atop O.WZ (the 5.0.0 cut, the no-legacy renames,
the Oscillator publish, the chronic-ledger M→O re-point). By the time P.WZ runs, the O
substrate is closed and the P bands have built the optimization + frontend-design layer:
SoA-compositor + Typed-OM write path (Bands B), the demo-fleet design passes (Bands C), the NaN
cure + differential oracle (Band D), the leaves.ts externalization transposition (Band E), the
VJ-L1 WeakMap early-cure + O.W7 engine-seam (Band F), and the glass-ui 4.1.0 consume (Band G).

P.WZ does the close: it records the portable perf-delta (the optimization payoff, measured ratio);
re-points `proof:chronic-closure` O→P; resolves DM-7 (keyframes-vue, P-inv-28 belt at 4); cuts
**5.1.x** (perf is non-breaking, rides after O's 5.0.0 major); and observes the deploy
round-trip as **live-byte equality** — the bytes the site serves, not a gate exit code.

The audit grounds every one of these in live file:line evidence (lanes K3, K4, D3, F1/K5, G31):

### The perf-delta record — the missing P payoff measurement

The optimization campaign produces a suite of ratio-bench verdicts. P.WZ consolidates them into a
**`scripts/spring-vector-decision.json`-adjacent `perf-delta-P.json`** (the optimization payoff
record, measured ratio per transposition):

| Transposition | Gate | Expected ratio | Decision file |
|---|---|---|---|
| SoA Float64Array interp (P.W2) | `proof:soa-interp` SoA-hz / per-channel-hz at K=8 | ≥1.20× | `perf-delta-P.json` ADOPT/KILL row |
| Typed-OM write path (P.W3) | `proof:typed-om-bench` Typed-OM / string-serialize at 200 frames | ≥1.15× | `perf-delta-P.json` row |
| SoA AnimationGroup compositor (P.W2) | `proof:zero-alloc` heap-delta arm extended | zero fresh allocs per blend | `perf-delta-P.json` row |
| reconcileVars O(1) Map (P.W2 micro-edit) | `bench/compile.bench.ts` N=1000 vs N=10 | ratio ≤1.05× (linear, not quadratic) | `perf-delta-P.json` row |
| Codegen-consume (P.W4, GATED) | `proof:codegen-consume` | ≥1.5× throughput vs combinator | `codegen-consume-decision.json` ADOPT/KILL |

Each ratio is measured on the P dist (`dist/keyframes.js`) via the portable
`baselineCase×floorFraction` discipline (P.W1 infra): all ratios are normalized to a baseline
case on the same machine, device-independent. The record is committed alongside P's close docs
so the "P is 1.2× faster on the SoA path" claim is verifiable from any machine, not asserted
from a hidden baseline.

The `spring-vector-decision.json` precedent (the J.W6 S2 SoA arm at 3.86×, bench-only, never
adopted into the engine) is the ancestor pattern — P.WZ is where the adoption verdict is
recorded and the ratio is observed on the REAL engine path, not the bench prototype.

### The `proof:chronic-closure` substrate re-point O→P

`scripts/proof-chronic-closure.mjs:114` currently points at `docs/tranches/L/PROGRESS.md` (the
L substrate, pre O.WZ re-point). The chain of re-points: O.WZ re-points L→O; P.WZ re-points O→P.

At P.WZ execution, the O.WZ re-point (L→O) is a precondition — O.WZ must have completed. Then
P.WZ re-points `CHRONIC_LEDGER` from `docs/tranches/O/PROGRESS.md` to
`docs/tranches/P/PROGRESS.md §"Open deferrals"` (the P substrate — the DM/DO/DP rows in
`P/PROGRESS.md §2`) in ONE motion, simultaneously with the P ledger becoming authoritative +
TERMINAL.

The non-vacuity protocol (the K.WZ/L.WZ/M.WZ/O.WZ precedent) MUST be observed here exactly
as O.WZ specified. Three planted P-ledger rows RED on all three clause shapes before the clean
terminal P ledger greens it.

### The TWO-SPEED Band G close (S2 consumed, S1 pending-or-contingency)

`proof:workaround-deletion` at P.WZ close:

- **S2 arm**: GREEN (the atomic P.W12 commit deleted the dock interim + re-pinned to `~4.1.0`).
  DM-1 RF-17 dock interim exits the ledger at chronicity 6. CLOSED.
- **S1 arm**: one of two states:
  - **GREEN** (if BC shipped the SFC aria-guard in a post-4.1.0 release and kf consumed it):
    DM-5 S1 exits at chronicity 4. CLOSED.
  - **CONTINGENCY-CLOSED** (if BC did NOT ship the SFC guard before P.WZ): kf executes the
    P-inv-28 contingency — NOT a carry, NOT a new workaround shape:
    (a) author a kf-internal ARIA-compliant replacement that is NOT a `.vue` template bind of
    `aria-orientation` to `undefined` (the workaround shape) but instead a scoped conditional
    that omits the attribute on the `role=group` render path (a `v-if="isTablist"` wrapper or a
    CSS `content-visibility` / ARIA `presentation` approach on the pill strip); (b) the
    `proof:workaround-deletion` S1 arm pattern is updated to match the old workaround shape and
    confirm it is ABSENT; (c) `proof:a11y-aria-group` (born-RED gate: pill SegmentedTabs strips
    must have zero `aria-orientation` attributes) asserts the replacement is compliant. The
    contingency CLOSES the workaround shape — it is a KILL of the band-aid, not a 5th carry.
    The contingency is documented in `P/FINAL.md` with the rationale.

### DM-7 keyframes-vue publish (P-inv-28 belt at 4 — USER-DOMAIN, MUST close here)

`proof:keyframes-vue-published` clause (b) was RED-by-design (E404) at O close if O.WZ did not
fire. At P.WZ this resolves: the USER-DOMAIN publish fires if it has not already (the
`publish-keyframes-vue` job in `release.yml:103-129`, `needs: publish`). The peer floor must
be bumped to the P cut version:

- `packages/keyframes-vue/package.json peerDependencies['@mkbabb/keyframes.js']` → `>=5.1.0`
  (tracking the P cut)
- `scripts/proof-keyframes-vue-published.mjs:63 PEER_FLOOR` → `"5.1.0"` (or the exact P version)

**No 5th carry under any scenario.** DM-7 closes at P.WZ. The P-inv-28 belt is explicit.

### Audit evidence (live-probed 2026-06-20)

| Lane / ref | Source location | Fact (live-probed 2026-06-20) |
|---|---|---|
| K3, D3 | `scripts/spring-vector-decision.json` | the J.W6 S2 SoA arm at 3.86× bench-only prototype — P.WZ commits the engine-path ADOPT verdict |
| K5, F1 | `demo/spring/SpringSidebar.vue:43`, `demo/@/components/…/AnimationControls.vue:72` | S1 suppress lines PRESENT at P dev-phase |
| F1 | `node_modules/@mkbabb/glass-ui/dist/tabs.js` | conditional-guard absent from 4.1.0; S1 PENDING |
| P PROGRESS §2 DM-7 | `scripts/proof-keyframes-vue-published.mjs:63,:121` | `PEER_FLOOR = "4.3.0"` (stale since K close); E404 on `0.1.0`; P-inv-28 belt at 4 |
| G31 (O.WZ) | `npm view @mkbabb/keyframes.js dist-tags` | `latest: 4.3.0` (or 5.0.0 if O.WZ fired) — P cuts 5.1.x atop |
| O.WZ S6 | `deploy-pages.yml:44-46` | `workflow_run` success on master push → auto round-trip |
| O.WZ S3 | `scripts/proof-chronic-closure.mjs:114` | `CHRONIC_LEDGER` — to be re-pointed O→P here |
| P PROGRESS §3 | `P/PROGRESS.md §3` | P-inv-28 terminal register — DM-7 at chronicity 4; DM-1 at 6 |

---

## Scope

### S1 — `perf-delta-P.json` — the optimization payoff record (AUTHORED HERE, gate-first)

**Breach.** No consolidated per-transposition ratio record exists. The J.W6 S2 SoA prototype
was the last ratio-bench decision record (`spring-vector-decision.json`). The P campaign's
perf claims (SoA-hz ≥1.2×, Typed-OM ≥1.15×) are asserted in wave docs but never committed as
observed on the REAL engine path.

**Cure.** Author `scripts/perf-delta-P.json` FIRST (gate-first, before any perf wave impl).
The file starts as a PRECOMMIT with all rows in `state: "RED"` (placeholder ratios that the
real bench must beat). After each perf wave impl, the matching row is updated with the OBSERVED
ratio (measured on the P dist via the wave's `proof:*` gate). P.WZ cannot close until every
row is either `state: "ADOPT"` (ratio met) or `state: "KILL"` (bench failed — the wave's
transposition is reverted or deferred with rationale).

The record format mirrors `spring-vector-decision.json` (the established precedent):

```json
{
  "P.W2.SoA-interp": {
    "state": "ADOPT | KILL | PENDING",
    "measured_ratio": null,
    "floor_ratio": 1.20,
    "bench": "bench/numeric-soa.bench.ts SoA-hz/per-channel-hz at K=8",
    "date": null,
    "git_sha": null
  },
  "P.W2.compositor": { ... },
  "P.W2.reconcileVars": { ... },
  "P.W3.typed-om": { ... },
  "P.W4.codegen-consume": { "state": "GATED", ... }
}
```

**Non-proxy discipline.** The ratios are measured on the REAL engine path (not bench prototypes),
on the P dist, via the `proof:*` gates. An ADOPT verdict requires the ratio to be observed on
the ACTUAL production path; a bench-only prototype is NOT sufficient (the J.W6 S2 lesson).

**Gate bite (born-RED today).** `scripts/perf-delta-P.json` does NOT exist today (the J.W6
predecessor `spring-vector-decision.json` does not include the P transpositions). Authoring
the PRECOMMIT file with all rows `state: "PENDING"` is born-RED: every `proof:bench-taxonomy`
assert that reads this file finds unfinished rows. The file GREENs row-by-row as the P waves
land their ADOPT/KILL verdicts.

---

### S2 — `proof:chronic-closure` re-pointed O→P (non-vacuous, ONE atomic motion)

**Breach.** After O.WZ: `scripts/proof-chronic-closure.mjs:114` is re-pointed to
`docs/tranches/O/PROGRESS.md`. P.WZ re-points it to `docs/tranches/P/PROGRESS.md §"Open
deferrals"` (the P substrate). The P substrate is the DM/DO/DP rows in `P/PROGRESS.md §2`.

**Cure (the ORCHESTRATOR'S ATOMIC FINAL MOTION).** Re-point `CHRONIC_LEDGER` from
`docs/tranches/O/PROGRESS.md` to `docs/tranches/P/PROGRESS.md` in ONE motion, simultaneously
with the P ledger becoming authoritative + TERMINAL.

**Non-vacuity protocol (the K.WZ/L.WZ/M.WZ/O.WZ precedent).** Three planted P-ledger rows
RED on all three clause shapes BEFORE the clean terminal P ledger greens it:

```
# Planted row 1 — FOLD citing a source-shape gate
| DP-PLANT-1 | P | 1 (P) | FOLD → P.W1 | P.W1 | `proof:boundary` (source-shape grep) |
```
→ must RED: `[runtime-band] FOLD row 'DP-PLANT-1' cites a source-shape gate 'proof:boundary' — not a RUNTIME gate`.

```
# Planted row 2 — HANDOFF targeting an unpublished future version
| DP-PLANT-2 | P | 1 (P) | HANDOFF → value.js 3.0.0 | P.WZ | value.js 3.0.0 not yet on npm |
```
→ must RED: `[tripwire] HANDOFF row 'DP-PLANT-2' targets an unpublished sibling version — tripwire is not a published-consume-edge`.

```
# Planted row 3 — bare BOOK, chronicity ≥4
| DP-PLANT-3 | K | 5 (K..P) | BOOK (future decide) | — | — |
```
→ must RED: `[p-invariant-28] bare BOOK row 'DP-PLANT-3' has chronicity 5 ≥ 4 — must EXIT (FOLD/HANDOFF/KILL/OUT), not BOOK`.

**Procedure (ONE atomic commit).** (a) plant the three rows in `P/PROGRESS.md §2`; (b)
`node scripts/proof-chronic-closure.mjs` → confirm RED on all three; (c) remove the planted
rows + confirm GREEN on the clean terminal P ledger; (d) in the SAME commit, re-point
`CHRONIC_LEDGER` O→P. Output: `✓ proof:chronic-closure — the P ledger is TERMINAL`.

**The P-invariant-28 belt at P close.** Every ≥4-tranche row must exit with a named verdict:

- DM-1 RF-17 dock interim (6): **CLOSED** via P.W12 S3 delete. HANDOFF consumed.
- DM-2 GlassControlPoint (9): **BUILD-IN** via O.W5 / P.W7 dogfood. ABSOLUTE terminal.
- DM-3 fromMorphSVG (9): **BUILD-IN** via O.W6 / P.W5 dogfood. ABSOLUTE terminal.
- DM-5 S1 aria-suppress (4): **CLOSED** via P.W12 S4 (BC SFC-guard consumed) OR **CONTINGENCY-CLOSED** (kf-internal ARIA-compliant replacement). No 5th carry.
- DM-5 S8/S9 FN_NAME/parse-that (4): **CLOSED** via O.W16 (VJ-L1 + VJ-L3 published consume) OR **P.W11 WeakMap early-cure** (kf-internal, inferior but P-inv-28-compliant). Named terminal.
- DM-7 keyframes-vue (4): **USER-DOMAIN** publish at P.WZ. P-inv-28 belt mandates resolution here. No 5th carry.
- DM-8…DM-15 (VERIFY-ONLY / RE-AFFIRM): all TERMINATED — GREEN gate re-verified on P dist.
- DM-10, DM-11 (chronicity ≥8): VERIFY-ONLY TERMINATED. Green re-verify satisfies P-inv-28.

---

### S3 — DM-7 keyframes-vue publish + peer floor (USER-DOMAIN, P-inv-28 belt ACTIVE)

**Breach.** `proof:keyframes-vue-published` clause (b) RED-by-design (E404) if not already
fired at O.WZ. P is the P-inv-28 mandated exit — NO 5th carry.

**Cure (USER-DOMAIN — Mike Babb fires).** Before the P cut:

- Bump `packages/keyframes-vue/package.json peerDependencies['@mkbabb/keyframes.js']` → `>=5.1.0`
  (tracking the P version cut; if O.WZ cut 5.0.0 and P cuts 5.1.0, the floor is `>=5.1.0`).
- Bump `scripts/proof-keyframes-vue-published.mjs:63 PEER_FLOOR` → `"5.1.0"`.
- The `publish-keyframes-vue` job (`release.yml:103-129`, `needs: publish`) fires on the P tag.

**The pre-cut compat check.** Run `npm run check` in `packages/keyframes-vue/` against the P
named types before the cut — if the adapter references types renamed in O.WZ (the four BREAKING
renames) or new P types, the check fails on the P tree and must be resolved first.

**Gate bite.** `proof:keyframes-vue-published` clause (b) flips E404 → GREEN. The CI
`check-failures` step drops this tripwire (if it was still active post-O.WZ). DM-7 exits at
chronicity 4. No 5th carry.

---

### S4 — The 5.1.x version cut (USER-DOMAIN — criteria proposed, user fires)

**Breach.** P's perf + demo-design transpositions are non-breaking (no API renames, no removed
exports). The cut is therefore **MINOR or PATCH** (`5.1.0` if the Oscillator / additive tail
already shipped at O.WZ 5.0.0; or `5.0.1`/`5.1.0` depending on O.WZ's exact cut). The codegen
consume (P.W4) is GATED and may not be included if parse-that B / value.js P have not shipped
by close — P.WZ records the ADOPT/KILL verdict in `codegen-consume-decision.json` instead.

**The version rationale.** Perf-non-breaking = MINOR per semver. The case for `5.1.0`: the P
public API is unchanged; the SoA compositor and Typed-OM path are internal; `springLinearStopsArray()`
(added to the LIGHT surface in P.W6) is additive; the `DemoControlPoint` and `fromMorphSVG`
BUILD-INs (O.W5/O.W6) are demo-only. The chosen string is RECORDED in a one-paragraph version-
decision note BEFORE `changeset version` cuts it.

**The cut/deploy decoupling (the J/K/O precedent).** The npm publish and the Cloudflare deploy
are decoupled: the close-merge → auto-deploy fires on `master push` + CI success; the version
tag fires `release.yml`. They occur in either order. The P.WZ FINAL cites the OBSERVED
`package.json` version + the registry presence AFTER the tag — NEVER asserted before.

---

### S5 — `proof:all` GREEN + the VERIFY-ONLY re-verify roster on the P dist

**Gate.** `npm run proof:all` GREEN on the P close tree (the consolidated runner including all
P-era `proof:*` scripts, the P.W1-extended `proof:bench-taxonomy`, and the re-pointed
`proof:chronic-closure`).

**VERIFY-ONLY / RE-AFFIRM roster (DM-8…DM-15) re-verified on the P dist (5.1.x).** Each
carried K-chronic is TERMINATED (O.WZ re-verified on the O dist); P.WZ obligation is RE-VERIFY
the GREEN state on the P 5.1.x dist. Re-run:

- `proof:lighthouse-mobile` (DM-8, `KF_REQUIRE_LH=1` — if the Typed-OM path affects LCP)
- `proof:specular-absent-at-rest` (DM-9)
- `proof:font-census` (DM-10)
- `proof:spring-slider-continuous` + `proof:subject-animates` (DM-11)
- `proof:perf-frame-budget` (DM-12 — re-verify with the SoA compositor in place; a regression
  here means the SoA path has an undetected overhead)
- `proof:engine-no-throw-on-play` (DM-13)
- `proof:fsm-suspend-resume-live` (DM-14)
- `proof:control-surface-single-writer` (DM-15)

Any gate that reverts RED is a NEW P regression to wave-assign, NOT a close. A regressed
VERIFY-ONLY gate halts P.WZ until the wave is addressed.

**The codegen-consume (P.W4, GATED).** If parse-that B + value.js P have NOT shipped the
codegen pipeline by P.WZ, `proof:codegen-consume` stays born-RED (the codegen parser does not
exist). P.WZ records `state: "KILL"` in `codegen-consume-decision.json` with the rationale
(sibling publish timing — the P-inv-28 terminal: the codegen gate does NOT carry to a next
tranche as a born-RED obligation; it is KILLED and re-authorized as a fresh ask when both
siblings publish).

---

### S6 — The deploy round-trip as LIVE-BYTE equality (the observable-truth keystone)

**Gate.** The deploy is "observed" ONLY when the live-served `index-<hash>.js` is shown EQUAL
to the freshly-built `dist/gh-pages` artifact for the merge SHA — the J-close / K-close /
O-close oracle shape. A green local `proof:all` is NOT the deploy claim.

**Deploy round-trip re-observation (each link OBSERVED):**

1. `proof:all` GREEN on the consolidated P runner — observe the run.
2. Close-merge to `master` → CI run N GREEN — observe the run ID.
3. `deploy-pages.yml` fires as a `workflow_run` consequence
   (`conclusion == 'success' && head_branch == 'master' && event == 'push'`,
   `deploy-pages.yml:44-46`) — observe the run ID.
4. The live `keyframes.babb.dev` `index-<hash>.js` filename equals the freshly-built
   `dist/gh-pages` hash for the merge SHA — observe the hash equality.

The FINAL cites all four with their run IDs / filenames — never an assertion, always an oracle.

---

### S7 — The close docs (P/FINAL.md + the VERIFY-ONLY re-verify + the prompt-recap)

**Deliverable:** `docs/tranches/P/FINAL.md` — the P boundary close report, held to
inv-O-observable-truth (every boundary claim CITES its observed oracle).

- **The `perf-delta-P.json` ADOPT/KILL roster** — all rows resolved; the SoA and Typed-OM
  ratios observed on the P dist; the codegen-consume row ADOPT or KILL.
- **DM-1 RF-17 close record** — S3 delete commit hash cited; chronicity 6 confirmed CLOSED.
- **DM-5 S1 close record** — either the BC SFC-guard consume (GREEN arm) or the
  contingency-closed ARIA-compliant replacement (CONTINGENCY-CLOSED arm), with the rationale.
- **DM-7 keyframes-vue close record** — the USER-DOMAIN publish observed;
  `proof:keyframes-vue-published` clause (b) GREEN cited.
- **The VERIFY-ONLY / RE-AFFIRM roster re-verified** on the P dist — each DM-8…DM-15 gate
  re-run result cited (GREEN or new P regression wave-assigned).
- **The prompt-recap TOTAL** (`docs/tranches/P/audit/prompt-recap-P.md`) — every distinct
  owner request across A→P at a terminal verdict (ADDRESSED / RECORD / HANDOFF / USER-DOMAIN /
  FOLD / OUT); zero drops.
- **The 5.1.x version cut RECORDED** — the observed `package.json` version + the registry
  presence of `@mkbabb/keyframes.js@5.1.x`, cited AFTER the user fires the tag.
- **The deploy round-trip RECORDED** as the four-link live-byte oracle (S6).

---

## Born-RED gate

**Three gates: one new (S1) + two existing re-targeted/observed (S2, S6).**

`perf-delta-P.json` (AUTHORED HERE — S1, born-RED on today's tree). The file does NOT exist and
none of the P perf ratios are recorded on the REAL engine path. Authoring the file with all rows
`state: "PENDING"` produces an immediate signal in `proof:bench-taxonomy` — every ratio arm
that references the file finds unresolved rows. Born-RED by construction.

`proof:chronic-closure` (EXISTING — re-pointed O→P in the atomic non-vacuity motion, S2).
Born-pointing-at-O (after O.WZ re-point); the three planted P-rows RED on all three clause
shapes before the clean terminal P ledger greens it.

`proof:all` + the deploy round-trip (EXISTING — S6). Born-blocked (by any un-resolved P wave
gate or carry) until all P bands reach terminal disposition; the live site serves the O-era
`index-<hash>.js` until the P round-trip fires.

| Gate / clause | Witness on today's tree | Failure mode today | Expected at P close |
|---|---|---|---|
| S1 `perf-delta-P.json` (AUTHORED) | file does NOT exist; SoA + Typed-OM ratios undocumented on the REAL engine path | no consolidated payoff record; a P close with undocumented perf claims is un-verifiable | file AUTHORED as PRECOMMIT (all rows PENDING); each P perf wave updates its row; P.WZ records the final ADOPT/KILL roster |
| S2 `proof:chronic-closure` (re-pointed) | `proof-chronic-closure.mjs:114` → `docs/tranches/O/PROGRESS.md` (post O.WZ) | the P ledger has no terminal substrate; a chronic could silently drop across the O→P boundary | re-pointed O→P; the three planted P-rows RED on all three clause shapes; the clean terminal P ledger greens; output `✓ the P ledger is TERMINAL` |
| S3 `proof:keyframes-vue-published` | clause (b) E404 (`:121`); `PEER_FLOOR` stale at `4.3.0` (or `5.0.0` if O.WZ fired) | the adapter is unpublished — the P-inv-28-active deploy-tripwire (DM-7) | clause (b) GREEN on the USER-DOMAIN P publish; `PEER_FLOOR` bumped; CI tripwire cleared |
| S5 VERIFY-ONLY roster | DM-8…DM-15 gates GREEN on O dist | a P perf transposition that degrades frame budget or font loading regresses a terminated chronic | all re-verified GREEN on P 5.1.x dist; any RED = new P regression, wave-assigned |
| S6 `proof:all` + deploy | all P wave gates at terminal disposition; live site at O-era hash | any un-resolved P gate exits 1 → CI failure → deploy blocked | P close-merge → CI GREEN → `deploy-pages.yml` fires → live `index-<hash>.js` hash EQUALS merge-SHA `dist/gh-pages` artifact |

**Born-RED on today's tree (the keystone).** `perf-delta-P.json` does not exist AND no P perf
ratio is observed on the REAL engine path. The `proof:bench-taxonomy` gate extension (P.W1) is
born-RED on unresolved ratio arms. The chronic-closure substrate is born-pointing-at-O (post O.WZ);
the P close does not proceed until the re-point + non-vacuity proof runs.

**Green condition.** `perf-delta-P.json` AUTHORED + every row ADOPT/KILL (no PENDING rows at
close); `proof:chronic-closure` re-pointed O→P with non-vacuous planted-probe RED; DM-7
(keyframes-vue) USER-DOMAIN published + `PEER_FLOOR` bumped; `proof:all` GREEN on the
consolidated P runner; VERIFY-ONLY roster (DM-8…DM-15) re-verified GREEN on P dist; Band G
S2 GREEN (dock interim DELETED + re-pinned to `~4.1.0`) + S1 GREEN or CONTINGENCY-CLOSED;
the deploy round-trip OBSERVED as the four-link live-byte equality; `codegen-consume-decision.json`
ADOPT or KILL. The version cut + keyframes-vue publish are USER-DOMAIN — the FINAL cites the
OBSERVED `package.json` version + registry presence AFTER the user fires the P tag.

---

## Dependencies

This is the tranche terminal — it depends on **every prior P wave at terminal disposition**:

| Dep | Required state | Phase / status |
|---|---|---|
| **Band A (P.W1)** | lint-tier GREEN; bench-taxonomy extended with ratio floors; portable perf-gate infra | NOW |
| **Band B (P.W2/W3/W4)** | SoA compositor + computed-unit cache + Typed-OM write path GREEN; codegen-consume ADOPT or KILL | W2/W3 NOW; W4 GATED (parse-that B + value.js P) |
| **Band C (P.W5/W6/W7/W8)** | demo-fleet design passes + N-Stage mobile GREEN; DemoControlPoint / fromMorphSVG dogfooded | NOW (kf-owned) |
| **Band D (P.W9)** | NaN-frame cure + grammar fuzz + differential oracle GREEN | NOW |
| **Band E (P.W10)** | leaves.ts bundle-externalization + deprecated-alias purge + cross-realm-seam gate GREEN | NOW (TRAP-aware) |
| **Band F (P.W11)** | VJ-L1 WeakMap early-cure landed; O.W7 engine-seam split (engine.ts ≤900L) GREEN | NOW (kf-internal WeakMap) + O.W7 (VJ-L1-gated or WeakMap arm) |
| **Band G (P.W12)** | S2 dock interim DELETED + `~4.1.0` re-pin; S1 PENDING (BC SFC-guard) or CONTINGENCY-CLOSED | S2 GATED on `proof:live-session` S5 pass; S1 on BC SFC-guard or contingency |
| **O.WZ 5.0.0 cut** | O.WZ USER-DOMAIN publish fired; the Oscillator + additive tail on npm; O chronic ledger L→O re-pointed | USER-DOMAIN (O.WZ precondition) |
| **DM-7 keyframes-vue (P-inv-28 belt)** | `proof:keyframes-vue-published` clause (b) GREEN | USER-DOMAIN (Mike Babb, P.WZ — NO 5th carry) |
| **The acyclic spine (inv-16)** | parse-that B → value.js P → kf re-pin → glass-ui BC consume | kf writes only keyframes.js; both cross-repo needs are GATED consumes, never foreign-tree edits |

**The close criteria (the binding terminal conditions).** P closes when: all NOW gates GREEN
(Bands A+B+C+D+E) + **Band F WeakMap cure + O.W7 seam** + **Band G S2 consumed + S1 resolved**
+ **DM-7 USER-DOMAIN publish** + the deploy round-trip observed as live-byte equality. If the
BC SFC-guard or value.js P slip past the close window, the FINAL honestly NAMES the contingency
paths taken (the L/M/O close discipline) — it does NOT assert them closed without evidence.

---

## dev→impl boundary

This wave is **NOW-author · USER-DOMAIN publish**. The `perf-delta-P.json` PRECOMMIT authoring
(S1), the chronic re-point (S2), the peer-floor bumps (S3), and the close docs (S7) are
kf-internal — they open for implementation when P's prior waves reach terminal disposition.
**The version cut (S4), the USER-DOMAIN publish (S3/S4), and the live-byte deploy observation
(S6) are USER-DOMAIN** — Mike Babb fires the P tag; the agent proposes the criteria and authors
the gates, never actuates the publish. The FINAL cites the OBSERVED `package.json` version +
the registry presence AFTER the tag, never an assertion before it.

The O.WZ substrate (`docs/tranches/O/waves/O.WZ.md`) is the authoritative deep-context reference
for the close mechanics (the inv-eps anti-overclaim discipline, the chronic-closure non-vacuity
protocol, the live-byte deploy oracle shape, the keyframes-vue peer-floor bump procedure).
P.WZ deltas O.WZ on: the ledger re-point target (O→P, not M→O); the version cut (5.1.x perf-
non-breaking, not 5.0.0 MAJOR); the perf-delta record as the new close obligation (the
`perf-delta-P.json` payoff document has no O.WZ analogue); and the Band G two-speed close
(S2 consumed at re-pin, S1 contingency-path if BC SFC guard missed the window).
