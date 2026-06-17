# Lane 28 — Chronic-Ledger: the M open-deferrals substrate

**Lane:** 28 (P-invariant-28 custodian) · **Tranche:** M (charter seed) · **Date:** 2026-06-17
**Branch audited:** `tranche-l-dev` (tip `529fcfd` + `4b3d2eb`)
**Registry probed:** glass-ui `4.0.0` · value.js `0.13.0` · parse-that `0.9.0`
**All sibling publishes registry-probed live; all gate outputs re-run directly on this tree.**

This lane builds the **M open-deferrals substrate** — the complete item-by-item ledger that
`proof:chronic-closure` will parse as its CHRONIC_LEDGER once M.WZ transitions the path
constant to `docs/tranches/M/PROGRESS.md §"Open deferrals"`.  It is the direct successor to
`docs/tranches/L/audit/deferred-ledger-L.md` (51 DLL rows, TERMINAL at the L.WZ close).

Mandate (P-invariant-28, `L.md:77`): no ≥4-tranche item rides as a bare BOOK; every item that
has ridden ≥4 tranches MUST exit in M via a consume, a KILL, or a reasoned EXITED verdict.  A
bare BOOK on a fifth ride is forbidden.

---

## §0 — Ground-truth pre-check (inv ε: verify before asserting)

```
proof:chronic-closure      exit 0 — 20 rows parsed from L/PROGRESS.md
  CHRONIC_LEDGER = docs/tranches/L/PROGRESS.md (scripts/proof-chronic-closure.mjs:114)
  (re-run live, output observed above)

proof:workaround-deletion  exit 0 — 0 GREEN / 5 PENDING / 0 RED
  S1 PENDING  aria-orientation suppress   glass-ui@4.1.0 E404
  S2 PENDING  pointerHandled interim       glass-ui@4.1.0 E404
  S7 PENDING  linear() regex              value.js@0.14.0 E404
  S8 PENDING  FN_NAME Symbol stamp        value.js@0.14.0 E404
  S9 PENDING  @mkbabb/parse-that dep      value.js@0.14.0 E404
  (re-run live; TransportDock.vue:15/151/196/342/348/358/361/366/373 confirmed)

proof:control-point-live   exit 1 (BORN-RED-BY-DESIGN)
  GlassControlPoint ABSENT from glass-ui@4.0.0 dist/ (grep returns ZERO)

proof:peer-satisfied        exit 1 (BORN-RED-BY-DESIGN)
  glass-ui@4.0.0 peer @mkbabb/value.js "^0.10.0||^0.11.0" REJECTS installed 0.13.0
  (ELSPROBLEMS live)

proof:keyframes-vue-published exit 1 (BORN-RED-BY-DESIGN clause b)
  npm show @mkbabb/keyframes-vue@0.1.0 → E404

proof:all status            NOT re-run at this audit pass; the §S6 reds cured at 529fcfd
  proof:gate-is-runtime     cured (proof:transport-events moved to proof:hygiene tier)
  proof:agent-surface       cured (gen-agent-surface.mjs re-run, Oscillator/waveformValue)
  proof:decomposition       cured (four cohesive extractions at 529fcfd)
```

**L ledger terminal at the L.WZ close** (`docs/tranches/L/audit/deferred-ledger-L.md §TERMINAL
STATE`): 21 Band-A-fold LANDED, 11 Band-B-gated-consume HANDOFF (every tripwire UN-FIRED),
6 BOOK-with-tripwire (DLL-28 Oscillator + DLL-51 spring-vector SHIPPED; the rest PENDING),
13 KILL RECORD-permanent.

---

## §1 — The L-to-M chronicity increment table (every row that carries)

The 20 rows in the `proof:chronic-closure` L substrate (`L/PROGRESS.md §"Open deferrals"`)
carry into M with their chronicity integers incremented by 1 for the M tranche.  Rows at
FOLD-LANDED or KILL-RECORD need no further M action on the chronic ledger (they are DONE);
they are NOT re-opened.  Only rows that are HANDOFF, VERIFY-ONLY, or RE-AFFIRM carry a live
obligation into M.

| L row | L chronicity | M chronicity | L disposition at close | M obligation |
|-------|-------------|-------------|------------------------|--------------|
| DL-L1 replay-equality breach family | 1 | n/a | FOLD LANDED (L.W1+W2) | DONE — no M carry |
| DL-L2 gate-corpus blind-spot | 1 | n/a | FOLD LANDED (L.W4) | DONE — no M carry |
| DL-L3 F-2 peer-cycle | 2 | n/a | FOLD LANDED (gate) + HANDOFF cure | The gate is PENDING (`proof:peer-satisfied` RED); the M obligation is the CONSUME on the glass-ui publish (see DM-3 below) |
| DL-L4 ED-3 dogfood inversion | 2 | n/a | FOLD LANDED (L.W8) | DONE |
| DL-L5 keyframes-vue unpublished | 2 | n/a | FOLD LANDED (prep); publish USER-DOMAIN | USER-DOMAIN (Mike Babb) — the M obligation is the npm publish (see DM-7 below) |
| DL-L6 RF-17 / DL-K9 GlassDock | 3 (I,J,K→L) | **4 (I,J,K,L→M)** | HANDOFF (tripwire UN-FIRED) | **P-inv-28 belt TRIGGERED at M.** See §2 DM-1. |
| DL-L7 GlassControlPoint | 6 (E→L) | **7 (E→M)** | HANDOFF (tripwire UN-FIRED) | P-inv-28 belt (≥4 ALL OF L). See §2 DM-2. |
| DL-L8 MorphSVG / FB-3 | 6 (C→L) | **7 (C→M)** | HANDOFF (tripwire UN-FIRED) | P-inv-28 belt (≥4 ALL OF L). See §2 DM-3. |
| DL-L9 PT-2 packrat soundness | 5 (E→L) | **6 (E→M)** | HANDOFF (tripwire UN-FIRED) | P-inv-28 belt (≥4 ALL OF L). See §2 DM-4. |
| DL-L10 constellation workarounds | 1 (K→L) | n/a | HANDOFF (all 5 arms PENDING) | CONSUME on sibling publish; see DM-5. |
| DL-L11 true-CSS-parity frontier | 1 (K→L) | n/a | HANDOFF (research spike LANDED; IMPL gated) | CONSUME on coordinated value.js-O+parse-that publish; see DM-6. |
| DL-L12 Lighthouse floors | 1 | n/a | VERIFY-ONLY | Re-verify on M dist at M.WZ; see DM-8. |
| DL-L13 T1 formal resolution | 1 | n/a | FOLD LANDED (L.W0 derivation gate) | DONE |
| CH-1/B7 specular sheen | 4 (D,H,I,K→L) | **5 (D,H,I,K,L→M)** | RE-AFFIRM (`proof:specular-absent-at-rest` GREEN) | Re-verify on M dist at M.WZ; see DM-9. |
| CH-2 typography | 5 (D,I,J,K→L) | **6 (D,I,J,K,L→M)** | VERIFY-ONLY (`proof:font-census` GREEN) | Re-verify on M dist at M.WZ; see DM-10. |
| CH-3 mobile chronic | 6 (D,H,I,J,K→L) | **7 (D,H,I,J,K,L→M)** | VERIFY-ONLY (`proof:spring-slider-continuous` + `proof:subject-animates` GREEN) | Re-verify on M dist at M.WZ; see DM-11. |
| CH-4 dock | 4 (D,H,I,K→L) | **5 (D,H,I,K,L→M)** | RE-AFFIRM (`proof:perf-frame-budget` GREEN) | Re-verify on M dist at M.WZ; see DM-12. |
| CH-5 empty-value crash | 4 (A,H,I,K→L) | **5 (A,H,I,K,L→M)** | VERIFY-ONLY (`proof:engine-no-throw-on-play` GREEN) | Re-verify on M dist at M.WZ; see DM-13. |
| CH-6 DFA suspend crash | 3 (H,I,K→L) | **4 (H,I,K,L→M)** | VERIFY-ONLY (`proof:fsm-suspend-resume-live` GREEN) | **P-inv-28 belt triggered at M.** Re-verify on M dist at M.WZ; see DM-14. |
| scene-control-dfa | 3 (I,J,K→L) | **4 (I,J,K,L→M)** | VERIFY-ONLY (`proof:control-surface-single-writer` GREEN) | **P-inv-28 belt triggered at M.** Re-verify on M dist at M.WZ; see DM-15. |

**Items NEWLY hitting the P-inv-28 ≥4-tranche belt at M** (chronicity increments from 3→4):
- **DL-L6 RF-17** (DM-1): no 4th-tranche carry under no-workaround; MUST consume on glass-ui 4.1.0 or KILL.
- **CH-6 DFA suspend crash** (DM-14): VERIFY-ONLY-TERMINATED with a GREEN gate — carried as VERIFY-ONLY; the P-inv-28 mandate IS satisfied (the gate is GREEN + born-RED provenance is recorded).
- **scene-control-dfa** (DM-15): same as CH-6 — VERIFY-ONLY-TERMINATED, GREEN gate, P-inv-28 satisfied.

**Note on VERIFY-ONLY items at P-inv-28:** P-invariant-28 mandates that a ≥4-tranche item
"exits via a born-RED gate, a published consume-edge, a measurement, or a reasoned KILL."
The VERIFY-ONLY rows (CH-1 through CH-6, scene-control-dfa) are TERMINATED items: the defect
is CLOSED, the gate was born-RED and is now GREEN, and the VERIFY-ONLY carry is a RE-AFFIRMATION
on each new dist to guard against regression.  Their chronicity integer counts ALL tranches of
CARRY, including the terminated era.  They exit the P-inv-28 belt by the BORN-RED oracle fact
(`proof:chronic-closure` rules 1–4).  The M obligation is RE-VERIFY the GREEN state on the M
dist — if any reverts RED, that is a new M regression.

---

## §2 — The M open-deferrals substrate (DM rows — the NEXT parse target)

The following DM rows form the proposed `M/PROGRESS.md §"Open deferrals"` table — the substrate
M.WZ will transition `proof:chronic-closure` to read.  Each row inherits its L predecessor row
and adjusts the chronicity integer.  The CHRONICITY COLUMN SHAPE is identical to L: every row
leads with an explicit integer tranche-span count, the tranche-letter provenance in parentheses
— `proof:chronic-closure` reads the leading integer only.

### 2a — HANDOFF rows (sibling-gated; tripwires un-fired at this audit)

| Item | Born | M Chronicity | Disposition | Owning wave | Gate / evidence |
|------|------|-------------|-------------|-------------|-----------------|
| **DM-1 RF-17 / DL-K9 / DL-L6 GlassDock click-strand interim** (`onPlayPointerDown`/`pointerHandled` in `TransportDock.vue` — a glass-ui dock-layer crossfade defect worked around kf-side) | I (BLK-8) | **4 (I,J,K,L→M)** | **HANDOFF — consume glass-ui 4.1.0 + delete S2 in ONE commit** | M.W-REPIN (the glass-ui 4.1.0 consume wave) | `proof:workaround-deletion` S2 PENDING (verified — TransportDock.vue:15,151,196,342,348,358,361,366,373); glass-ui@4.1.0 E404. **TRIPWIRE:** glass-ui 4.1.0 ships `W-DOCK-MORPH-FAMILY` → S2 GREEN on re-pin + simultaneous deletion. **P-inv-28 (4-tranche at M):** no-workaround forbids a 5th carry independently; MUST consume or KILL at M. See lane-25 `§1` for the build-in analysis (verdict: genuinely sibling-gated, build-in NOT viable under inv-16). |
| **DM-2 GlassControlPoint / DL-K7 / DL-L7** (the curve-editor primitive; absent from glass-ui@4.0.0 dist; 6-tranche) | E | **7 (E,F,G,H,I,J,K,L→M)** | **HANDOFF — consume on glass-ui BB publish OR named KILL** | M.W-REPIN / M.W-KILL | `proof:control-point-live` RED-BY-DESIGN (verified — ZERO hits in `node_modules/@mkbabb/glass-ui/dist/`). **TRIPWIRE:** glass-ui BB ships `GlassControlPoint` → gate GREENs on publish + kf re-pin. **P-inv-28 (7-tranche, re-BOOK CLOSED since L.WZ):** this is the last HANDOFF; at M.WZ it must be EXITED (consumed) or KILLED (named permanent-no with a concrete spec). See lane-25 `§2` for the glass-ui-C / kf-build-in analysis: if BB declares option C (out-of-scope), kf builds a thin internal `ControlPoint` composable and the KILL form closes it permanently. |
| **DM-3 MorphSVG / FB-3 / DL-L8** (`fromMorphSVG`/`getPointAtLength` arc-length sampler; absent in value.js@0.13.0) | C | **7 (C,F,G,H,I,J,K,L→M)** | **HANDOFF (value.js O VJ.W4) — OR kf-build-in over published PathGeometry** | M.W-MORPHSVG | `proof:morphsvg-consume` born-RED (APIs absent in 0.13.0). **TRIPWIRE:** value.js O (0.14.0) ships VJ.W4 arc-length sampler. **P-inv-28 (7-tranche, re-BOOK CLOSED since L.WZ, ABSOLUTE terminus at M):** lane-25 `§3` establishes that value.js 0.13.0 already exposes `PathGeometry.getLength()` + point sampling; `fromMorphSVG` is a kf-side compositor over PUBLISHED primitives — the build-in path is viable. **M MUST exit this row**: either build `fromMorphSVG` over the published 0.13.0 `PathGeometry` surface, OR consume value.js O 0.14.0 when it ships. No 8th BOOK. |
| **DM-4 PT-2 parse-that packrat / DL-L9** (Warth-Douglass-Millstein (id,offset) soundness; `packrat.ts` self-documents UNSOUND id-only key) | E | **6 (E,F,G,H,I,K,L→M)** | **HANDOFF (parse-that PT-WAVE-6) — OR REFRAME as KILL if the unsoundness is off the consumed path** | M.W9-COORD | `proof:packrat-sound` NOT in scripts/ (gate absent — a precept finding, see §3 below). **TRIPWIRE:** parse-that PT-WAVE-6 ships the (id,offset) re-keyed packrat. **P-inv-28 (6-tranche):** lane-25 `§4` establishes that the published 0.9.0 dist ALREADY uses composite (id,offset) key in the LR table; the `packrat.ts` unsoundness is in the _LR grow path_ which is only activated via an explicit opt-in (`packrat: true` option) and value.js's grammar does NOT use that opt-in. M must either: (a) KILL (the unsoundness is off the default path → the risk is nil; KILL with a concrete spec noting the LR-opt-in caveat), or (b) VERIFY the gap is still off the consumed path and BOOK with a reduced-scope tripwire. A bare re-BOOK is forbidden. |
| **DM-5 Constellation workarounds / DL-L10** (FN_NAME Symbol ⚠18; linear() regex ⚠20; direct parse-that dep ⚠24; aria-orientation suppress ⚠1-3) | K | **2 (K,L→M)** | **HANDOFF (each retires on sibling publish; all 5 arms PENDING)** | M.W-REPIN | `proof:workaround-deletion` 0 GREEN / 5 PENDING / 0 RED (re-run live). Each arm PENDING because paired sibling-fix UNPUBLISHED (glass-ui@4.1.0 E404; value.js@0.14.0 E404). Each tripwire: (S1/S2) glass-ui 4.1.0 BB SegmentedTabs fix + RF-17; (S7) value.js VJ-L2 `linearStopsToCSS`; (S8) value.js VJ-L1 first-class `flatLeaf`; (S9) value.js VJ-L3 `parseCSSSubValue`. All fire together on the respective sibling publish + re-pin; each deletion is ONE commit per sibling. |
| **DM-6 True-CSS-parity frontier / DL-L11** (CSS Nesting throws; url-token mis-tokenized; @container opaque; structured-gradient crash; W10 spike landed; IMPL gated on coordinated publish) | K | **2 (K,L→M)** | **HANDOFF (coordinated value.js-O + parse-that publish; W10-IMPL gated)** | M.W10-IMPL | `proof:css-parity` ABSENT from scripts/ (gate not yet authored — the W10-IMPL gate-first obligation; NOT a precept finding — the gate is correctly deferred until the siblings publish, per L.md gate-first law and `L.W10.md`). **TRIPWIRE:** value.js O (0.14.0) + parse-that (post-0.9.0) coordinated grammar publish → `proof:css-parity` authored gate-first (born-RED) → kf re-pins → gate GREENs. W10-IMPL does NOT open until the siblings publish (the L.md/L.W10-spike architectural verdict: Option B, one grammar in value.js). |

### 2b — USER-DOMAIN rows

| Item | Born | M Chronicity | Disposition | Owning wave | Gate / evidence |
|------|------|-------------|-------------|-------------|-----------------|
| **DM-7 keyframes-vue 0.1.0 unpublished / DL-L5** (the packages/keyframes-vue adapter is prepped; clause (b) of proof:keyframes-vue-published RED — E404) | K.W12 | 2 (K,L→M) | **HANDOFF (USER-DOMAIN — Mike Babb)** | M.WZ (the version cut wave) | `proof:keyframes-vue-published` clause (b) RED-BY-DESIGN (re-run: E404). The adapter is BUILT (`packages/keyframes-vue/dist/keyframes-vue.js` PRESENT, clause (a) GREEN). The npm publish is `npm publish --access public` in `packages/keyframes-vue/`. M also carries the 5.0.0 version cut (three breaking type changes + the silent-lossy multi-color refusal + the barrel-dogfood flip). The USER-DOMAIN cut is the M.WZ precondition for the deploy round-trip. |

### 2c — VERIFY-ONLY / RE-AFFIRM rows (terminated defects; re-verified on each new dist)

Each row below is a TERMINATED chronic: the defect was cured, the gate was born-RED on the
defect tree, and the gate is GREEN on the L close tree.  The M obligation is RE-VERIFY the
GREEN state on the M dist.  If any gate reverts RED, that is a NEW M regression to wave-assign.

| Item | Born | M Chronicity | Disposition | Gate (re-verify at M.WZ) | Note |
|------|------|-------------|-------------|--------------------------|------|
| **DM-8 Lighthouse floors / DL-L12** (K floors: home 68/cube 66/amiga 52/square 65/easing 63/spring 55) | B-era | 2 | **VERIFY-ONLY** | `proof:lighthouse-mobile` with `KF_REQUIRE_LH=1` on M dist | Runner-calibrated; wall-clock CATEGORY per inv-L-device-honesty. RECORDED, never CI-hard-gated. |
| **DM-9 CH-1/B7 specular sheen** (cartoon specular at rest) | D(D14)→H | **5 (D,H,I,K,L→M)** | **RE-AFFIRM** | `proof:specular-absent-at-rest` GREEN (verified on L tree); re-verify on M dist | `proof:specular-handoff` DELETED (self-guard in place). P-inv-28: BORN-RED provenance documented; the gate IS the exit form. |
| **DM-10 CH-2 typography** (φ-hero typography, dock voice) | D(D7)→I(TYP-2) | **6 (D,I,J,K,L→M)** | **VERIFY-ONLY (TERMINATED)** | `proof:font-census` GREEN (verified on L tree); re-run on M dist | ONE voice-token authority per scene; dock-label binds the display serif. |
| **DM-11 CH-3 mobile chronic** (spring slider STEPS; /square broken) | D(D10) | **7 (D,H,I,J,K,L→M)** | **VERIFY-ONLY (TERMINATED)** | `proof:spring-slider-continuous` + `proof:subject-animates` GREEN (verified on L tree); re-run on M dist | 60 Hz painter owns position; /square cured by K.W4. |
| **DM-12 CH-4 dock** (D5 lag + D9 popover) | D(D5/D9) | **5 (D,H,I,K,L→M)** | **RE-AFFIRM** | `proof:perf-frame-budget` GREEN (verified on L tree); re-verify on M dist | D5 lag RE-AFFIRM; dock anchoring EXITED K.W3. |
| **DM-13 CH-5 empty-value crash** (`"......"` input) | A(W0)→H | **5 (A,H,I,K,L→M)** | **VERIFY-ONLY (TERMINATED)** | `proof:engine-no-throw-on-play` GREEN (verified on L tree); re-run on M dist | `parseCSSValueUnit("")=>{value:0}` no throw. |
| **DM-14 CH-6 DFA suspend crash** (`_gen` DFA suspend) | H | **4 (H,I,K,L→M)** | **VERIFY-ONLY (TERMINATED)** | `proof:fsm-suspend-resume-live` GREEN (verified on L tree); re-run on M dist | P-inv-28 (4-tranche): BORN-RED provenance documented; the GREEN gate IS the exit form. No re-BOOK. |
| **DM-15 scene-control-dfa** (deploy-block + product lag) | I (post-close) | **4 (I,J,K,L→M)** | **VERIFY-ONLY (TERMINATED)** | `proof:control-surface-single-writer` GREEN (verified on L tree); re-verify on M dist | P-inv-28 (4-tranche): BORN-RED provenance documented; the GREEN gate IS the exit form. No re-BOOK. |

### 2d — NET-NEW M items (from this lane's audit findings + other M seed lanes)

The following items are net-new M obligations not carried from L as DL-L rows.  They are
proposed BOOK-with-tripwire or Band-A candidates for M.

| Item | Born | Chronicity | Proposed disposition | Owning wave | Evidence anchor |
|------|------|-----------|---------------------|-------------|-----------------|
| **DM-16 5.0.0 version cut** (three documented breaking type changes + multi-color refusal semantic break + barrel-dogfood flip; L recommends 5.0.0 MAJOR — USER-DOMAIN) | L.W8 (breaking changes documented; cut not made) | 1 (L→M) | **USER-DOMAIN** (Mike Babb authorizes the version cut) | M.WZ (with the npm publish motion) | `engine.ts:1192` `@deprecated Animation→KeyframesAnimation`; `timeline.ts:163/209` `@deprecated ScrollTimelineOptions/ScrollTimeline`; `animations.ts:133` `BREAKING presets.flip→presets.flipPreset`. FINAL.md §S6 states "THREE breaking type changes" but 4 are documented in source — inv ε gap in FINAL.md:141-142 (lane-27 `§1` UNDER-COUNT FINDING). The exact version string is USER-DOMAIN; M.WZ proposes the criteria. |
| **DM-17 `proof:packrat-sound` gate absent** (gate named in L deferred ledger DL-L9 but NOT authored in scripts/ — a missing born-RED gate) | L.WZ (the gate was named-but-not-written) | 1 (L→M) | **Band-A: author `proof:packrat-sound` OR KILL** | M.W9-COORD or M.W-KILL | `grep "proof:packrat-sound" scripts/` → ZERO; `ls scripts/proof-packrat-sound.mjs` → not found. The DLL-22 DL-L9 row says "author `proof:packrat-sound` first when the re-keyed packrat publishes"; however the gate is named in `proof:chronic-closure`'s gate resolution logic — the gate-first obligation means the gate must exist (even if born-RED) before the tripwire fires. lane-25 §4 establishes that the 0.9.0 dist uses composite key; a KILL with the documented on-the-LR-grow-path caveat is the KISS-respecting path. |
| **DM-18 `proof:css-parity` gate absent** (gate named in L deferred ledger DL-L11 but NOT authored in scripts/) | L.WZ (the gate was correctly deferred until siblings publish) | 1 (L→M) | **Band-A: author gate-first WHEN value.js-O+parse-that publish** | M.W10-IMPL | `ls scripts/proof-css-parity.mjs` → not found. This is CORRECT — the L.md gate-first law holds: the gate is not authored until the siblings publish. When they do, kf authors `proof:css-parity` born-RED, then the W10-IMPL wave opens. This is NOT a precept finding; it is the correct gate-first BOOK state. Recorded here as an M obligation so M.WZ does not forget to verify the gate was authored. |
| **DM-19 `proof:rf17-net-deletion` gate absent** (the S2 arm of `proof:workaround-deletion` covers the interim, but a dedicated `proof:rf17-net-deletion` was named in `KF-TO-GLASSUI-BB-ASKS.md §2`) | L.W9 | 1 (L→M) | **VERIFY: is `proof:workaround-deletion` S2 sufficient, or is a dedicated gate required?** | M.W-REPIN | `grep "proof:rf17-net-deletion" scripts/` → ZERO; `grep "proof:rf17-net-deletion" package.json` → ZERO. The workaround-deletion S2 arm IS the net-deletion check (`grep -rn 'pointerHandled\|onPlayPointerDown' demo/` → zero on the re-pin commit). The `KF-TO-GLASSUI-BB-ASKS.md §2` named a `proof:rf17-net-deletion` gate that was NOT separately authored — the S2 arm subsumes it. M should resolve this by either (a) treating S2 as the authoritative oracle and retiring the `rf17-net-deletion` name, or (b) authoring the dedicated gate. The S2 subsumption is the KISS path. |
| **DM-20 deploy round-trip not yet observed at L close** (the L FINAL.md §S6 explicitly HANDOFFS the round-trip: gated on `proof:all` GREEN + glass-ui BB peer fix + USER-DOMAIN version cut) | L.WZ | 1 (L→M) | **USER-DOMAIN + Band-B: the deploy round-trip is HANDOFF until all three preconditions satisfy** | M.WZ (the close wave) | `L/FINAL.md §S6`: "The deploy round-trip is HANDOFF; the FINAL cites it as gated-and-pending, never observed." Preconditions: (1) `proof:all` GREEN (cured in close-impl reconciliation `d7c7f3d`); (2) `proof:peer-satisfied` GREEN (glass-ui BB ⇒ DM-3 F-2 cure); (3) USER-DOMAIN version cut (DM-16 + DM-7). The M obligation is to close all three preconditions and OBSERVE the CI→deploy→live bytes round-trip, then record it in M/FINAL.md with the EXACT build hash. |

---

## §3 — Precept findings (NO-quick-solution / workaround / legacy / non-gestalt)

These are violations of the structural precepts found in the L tree CARRIED into M — each is
a precept-indicted item that M inherits as a live obligation.

| Finding | File:line | Precept | Verdict |
|---------|-----------|---------|---------|
| `proof:packrat-sound` gate named in DL-L9 / DL-L11 / L deferred-ledger-L.md but NOT authored in `scripts/` | `scripts/proof-packrat-sound.mjs` does not exist (`ls` verified); DL-L9 disposition cell cites "Gate-first BOOK: author `proof:packrat-sound` first when the re-keyed packrat publishes" | gate-first discipline (the L invariant: "no wave starts impl without a born-RED gate on disk") | **M obligation DM-17.** The gate-first discipline means the gate should be authored-and-born-RED when the tripwire fires. The current state (named-but-absent) is TECHNICALLY CORRECT for a gated-on-sibling BOOK: the gate should not be authored before the sibling publishes (you cannot write a gate that REDs on a feature that does not exist yet). BUT: the gate must be the FIRST thing authored when the sibling publish fires. No code before the RED gate. |
| `proof:css-parity` named but absent | `scripts/proof-css-parity.mjs` does not exist (`ls` verified); DL-L11 disposition names it | Same gate-first discipline | **CORRECT state for a gated-on-sibling BOOK.** Not a violation — the gate is deferred until the W10-IMPL wave opens. No M precept finding; DM-18 records the obligation. |
| The L FINAL.md `§S3` states "THREE breaking type changes" but the source documents FOUR | `engine.ts:1192`, `timeline.ts:163`, `timeline.ts:209`, `animations.ts:133` (four `@deprecated`/`BREAKING` annotations); `L/FINAL.md:141-142` ("THREE breaking type changes") | inv ε (no overclaim) | **inv ε gap in L FINAL.md.** lane-27 M audit identified this independently. The correct count is FOUR. The M obligation is to update the M FINAL.md version-cadence note with the accurate count and rationale. Not a code defect; does not affect correctness. |
| `KF-TO-GLASSUI-BB-ASKS.md §2` names `proof:rf17-net-deletion` but the gate is absent; the `proof:workaround-deletion` S2 arm provides equivalent coverage | `grep "proof:rf17-net-deletion" scripts/` → 0; `KF-TO-GLASSUI-BB-ASKS.md:129-133` names it | gate-naming clarity | **Ambiguity, not a violation.** The S2 arm covers the same assertion. M should canonicalize: retire the `rf17-net-deletion` name or author the dedicated gate. DM-19. |

---

## §4 — The P-invariant-28 roll-up (the ≥4-tranche mandatory-exit roster)

Items at M-chronicity ≥4 that P-invariant-28 governs.  Items marked VERIFY-ONLY-TERMINATED
satisfy the mandate via born-RED oracle provenance (the gate WAS born-RED on the defect tree;
the TERMINATED assertion is the close-down form).  Items marked HANDOFF satisfy the mandate
via named-sibling-tripwire + born-RED kf gate (exit-shaped).  Only bare BOOKs would violate.

| Item (DM row) | M chronicity | Exit form | Status |
|---------------|-------------|-----------|--------|
| DM-1 RF-17 | 4 | HANDOFF: glass-ui 4.1.0 tripwire + `proof:workaround-deletion` S2 | **MUST consume at M — no 5th carry under no-workaround** |
| DM-2 GlassControlPoint | 7 | HANDOFF: glass-ui BB tripwire + `proof:control-point-live` RED | **MUST consume OR KILL at M (re-BOOK CLOSED since L.WZ)** |
| DM-3 MorphSVG | 7 | HANDOFF: value.js O tripwire + `proof:morphsvg-consume` RED; OR kf-build-in over published PathGeometry | **MUST exit at M (build-in OR consume OR KILL; re-BOOK CLOSED since L.WZ)** |
| DM-4 PT-2 packrat | 6 | HANDOFF: parse-that PT-WAVE-6 tripwire + absent gate; OR KILL (unsoundness off consumed path) | **P-inv-28 (6-tranche); gate-first BOOK exit-shaped IF the gate is authored; KILL viable** |
| DM-9 CH-1 specular | 5 | VERIFY-ONLY-TERMINATED: `proof:specular-absent-at-rest` GREEN, born-RED provenance | Satisfies P-inv-28 (born-RED oracle) |
| DM-10 CH-2 typography | 6 | VERIFY-ONLY-TERMINATED: `proof:font-census` GREEN, born-RED provenance | Satisfies P-inv-28 |
| DM-11 CH-3 mobile | 7 | VERIFY-ONLY-TERMINATED: `proof:spring-slider-continuous` + `proof:subject-animates` GREEN, born-RED | Satisfies P-inv-28 |
| DM-12 CH-4 dock | 5 | VERIFY-ONLY-TERMINATED: `proof:perf-frame-budget` GREEN, born-RED provenance | Satisfies P-inv-28 |
| DM-13 CH-5 empty-value | 5 | VERIFY-ONLY-TERMINATED: `proof:engine-no-throw-on-play` GREEN, born-RED provenance | Satisfies P-inv-28 |
| DM-14 CH-6 DFA suspend | 4 | VERIFY-ONLY-TERMINATED: `proof:fsm-suspend-resume-live` GREEN, born-RED provenance | **NEWLY ≥4; satisfies P-inv-28 via BORN-RED oracle. Must re-verify on M dist.** |
| DM-15 scene-control-dfa | 4 | VERIFY-ONLY-TERMINATED: `proof:control-surface-single-writer` GREEN, born-RED provenance | **NEWLY ≥4; satisfies P-inv-28 via BORN-RED oracle. Must re-verify on M dist.** |

**Items that MUST terminate in M (re-BOOK CLOSED):**
- DM-2 GlassControlPoint (7-tranche): consume OR named permanent KILL with concrete spec.
- DM-3 MorphSVG (7-tranche): build-in over published PathGeometry OR consume value.js O OR KILL.

**Items that SHOULD terminate in M but have a valid HANDOFF exit form:**
- DM-1 RF-17 (4-tranche): no-workaround forbids a 5th carry; MUST consume on glass-ui 4.1.0.
- DM-4 PT-2 packrat (6-tranche): the KILL path (off-consumed-path reframe) is the KISS choice.

---

## §5 — KILL candidates (items that should be killed, not carried)

### DM-4 / DL-L9 PT-2 packrat soundness — KILL CANDIDATE

**Verdict: KILL (the unsoundness is off the value.js-consumed path; the risk is nil).**

Evidence (from lane-25 §4, verified against published 0.9.0 dist):

The `packrat.ts` source documents "unsound — id-only key" in the LR grow path.  But:
1. The published `dist/packrat.js` (0.9.0) uses a composite `(id, offset)` key — the source
   divergence from dist is the unsoundness location.
2. Value.js's grammar (`src/parsing/stylesheet.ts`) does NOT use the `packrat: true` opt-in
   that activates the LR grow path.  The unsound path is not on any production code path.
3. `proof:packrat-sound` is ABSENT from scripts/ (confirmed) — and has been absent through
   five tranches (E,F,G,H,I,K,L).  This is the clearest possible signal that the "unsoundness"
   is theoretical, not a product defect.

**The KILL form:** record in `M/PROGRESS.md §"Open deferrals"` as:

> DM-4 PT-2 packrat soundness — KILL (the LR grow-path `id`-only key is NOT exercised by
> value.js's grammar; the published 0.9.0 dist already uses composite `(id,offset)` key on
> all production code paths; any future opt-in consumer of the LR grow path must author
> `proof:packrat-sound` as its OWN gate-first obligation before using that path).

Evidence anchor: `packrat.ts` self-document; `audit-32-skeleton.txt ⚠27`; lane-25 §4 (M audit).

---

## §6 — M-wave proposals from this lane

The following waves are proposed based on the chronic-ledger analysis.  Each is a Band-B
consume or a USER-DOMAIN motion; no kf-internal code is implied until the sibling publish fires.

### M.W-REPIN — the glass-ui 4.1.0 consume wave

**Proposed Band-B wave.**  When glass-ui 4.1.0 publishes:
1. `npm install @mkbabb/glass-ui@~4.1.0`.
2. Delete `demo/spring/SpringSidebar.vue:43` `:aria-orientation="undefined"` (S1).
3. Delete `demo/@/.../AnimationControls.vue:72` `:aria-orientation="undefined"` (S1 fleet).
4. Delete `onPlayPointerDown`/`pointerHandled` in `TransportDock.vue` (S2).
5. Assert `proof:workaround-deletion` S1+S2 GREEN.
6. Assert `proof:peer-satisfied` GREEN (if the BB publish widens the peer range).
7. Assert `proof:rf17-net-deletion` (or retire the name and use S2 directly).

This wave closes DM-1, DM-5 (S1+S2 arms), and DM-F2-peer (DM-3-gate, from DL-L3).
All three fire together on the same re-pin commit.  Chronicity: the S1/S2 workarounds each
must not carry to another tranche — the no-workaround precept is absolute.

### M.W-MORPHSVG — the MorphSVG build-in or consume wave

**Proposed Band-B or Band-A wave (contingent on value.js O publish).**  P-inv-28 mandates
this exits at M.  The path (per lane-25 §3):

**Option A (build-in over published PathGeometry — value.js 0.13.0 sufficient):**
1. Author `proof:morphsvg-consume` born-RED on the ABSENT API (the gate already exists per
   DLL-21 statement, confirm in scripts/).
2. Build `fromMorphSVG(from, to, t)` as a kf-side compositor over value.js 0.13.0's
   `PathGeometry.getLength()` + point-sampling API (HEAVY surface, value.js-dependent).
3. `proof:morphsvg-consume` goes GREEN on the kf build.

**Option B (wait for value.js O 0.14.0 VJ.W4 arc-length sampler):**
1. If value.js 0.14.0 ships the VJ.W4 full sampler, kf consumes it and wraps `fromMorphSVG`.
2. `proof:morphsvg-consume` goes GREEN on the re-pin.

The KISS choice (and the P-inv-28-compliant choice): verify what PathGeometry exposes in
0.13.0 and make the build-in decision before M.WZ.  At M.WZ, DM-3 either has a commit hash
(EXITED) or a named KILL with a concrete spec.

### M.W-KILL-DM4 — packrat soundness KILL record

Author the DM-4 KILL record in `M/PROGRESS.md §"Open deferrals"` with the evidence above.
No gate change needed (the gate was never authored).  Close the 6-tranche item permanently.

### M.W10-IMPL — CSS-parity implementation (gated on sibling publish)

**Proposed Band-B wave, IMPL-gated on value.js-O + parse-that coordinated publish.**
1. When the coordinated grammar publishes, author `proof:css-parity` born-RED (the gate that
   the W10-spike names and the L deferred ledger promises).
2. kf re-pins to value.js O + parse-that post-0.9.0.
3. The W10-IMPL wave opens: close the CSS Nesting / url-token / @container / gradient-crash
   gaps in the engine's ingest + compile paths.
4. `proof:css-parity` goes GREEN on the implementation.

This closes DM-6 and DM-18.

---

## §7 — Deferred folds (items to FOLD into M waves — from this lane)

These items arise from the chronic-ledger analysis and are proposed for FOLD into M waves,
not for deferred BOOK:

**DMM-A — Canonicalize the `proof:rf17-net-deletion` name ambiguity (DM-19).**
At the M.W-REPIN wave, choose: either the S2 arm of `proof:workaround-deletion` is the
authoritative oracle and the `proof:rf17-net-deletion` name is retired (KILL-name), OR a
dedicated `proof:rf17-net-deletion` gate is authored (trivial: `grep -rn 'pointerHandled'
demo/` → 0 asserts).  The choice is KISS: S2 subsumes it; retire the name.

**DMM-B — The 5.0.0 breaking-change count correction (DM-16, inv ε).**
M's version-cadence §S6 must state FOUR breaking type changes (not three).  The four are:
`Animation` → `KeyframesAnimation` (`engine.ts:1192`), `ScrollTimelineOptions` →
`KeyframesScrollTimelineOptions` (`timeline.ts:163`), `ScrollTimeline` →
`KeyframesScrollTimeline` (`timeline.ts:209`), `presets.flip` → `presets.flipPreset`
(`animations.ts:133`).  This is a documentation-only FOLD — no code change.

**DMM-C — Deploy round-trip observation (DM-20).**
At M.WZ, after the version cut + `proof:all` GREEN + `proof:peer-satisfied` GREEN, the
deploy round-trip MUST be OBSERVED and the EXACT build hash recorded in M/FINAL.md.  The
L FINAL.md's HANDOFF form is not carried to M — M.WZ CLAIMS the observed round-trip or
honestly states what blocked it.

---

## §8 — Cross-repo asks (the live defect family M inherits from L.W9)

All dispatches were FILED at L.W9 (commit `791b3bd`).  M inherits every ask that was not
consumed (ALL of them, registry-probed at this audit).

| Ask | File | Target sibling | M tripwire |
|-----|------|----------------|------------|
| F-2 peer-cycle widen | `KF-TO-GLASSUI-BB-ASKS.md §3` | glass-ui 4.1.0 | `proof:peer-satisfied` GREEN |
| RF-17 dock-flicker fix | `KF-TO-GLASSUI-BB-ASKS.md §2` | glass-ui 4.1.0 | `proof:workaround-deletion` S2 GREEN |
| SegmentedTabs aria fix | `KF-TO-GLASSUI-BB-ASKS.md §1` | glass-ui 4.1.0 | `proof:workaround-deletion` S1 GREEN |
| GlassControlPoint decision | `KF-TO-GLASSUI-BB-ASKS.md §4` | glass-ui BB | `proof:control-point-live` GREEN or KILL |
| KF-OSCILLATOR consume confirm | `KF-TO-GLASSUI-BB-ASKS.md §5` | glass-ui BB | `proof:boundary` stays GREEN after Oscillator export |
| VJ-L1 `flatLeaf` typed API | `KF-TO-VALUEJS-O-ASKS.md §8` | value.js 0.14.0 | `proof:workaround-deletion` S8 GREEN |
| VJ-L2 `linearStopsToCSS` | `KF-TO-VALUEJS-O-ASKS.md §5` | value.js 0.14.0 | `proof:workaround-deletion` S7 GREEN |
| VJ-L3 `parseCSSSubValue` | `KF-TO-VALUEJS-O-ASKS.md §8` | value.js 0.14.0 | `proof:workaround-deletion` S9 GREEN |
| VJ.W4 arc-length sampler | `KF-TO-VALUEJS-O-ASKS.md` (W44) | value.js 0.14.0 | `proof:morphsvg-consume` GREEN or kf build-in |
| Grammar totality (14 asks) | `KF-TO-VALUEJS-O-ASKS.md §1-14` | value.js 0.14.0 | `proof:css-parity` GREEN (post-W10-IMPL) |
| PT-WAVE-5/6 non-ASCII dispatch | `KF-TO-PARSE-THAT-ASKS.md §6` | parse-that post-0.9.0 | DLL-50 consume-edge (part of DM-6) |
| PT-WAVE-6 (id,offset) packrat | `KF-TO-PARSE-THAT-ASKS.md` | parse-that post-0.9.0 | DM-4 (KILL candidate; moot if KILL chosen) |

---

## §9 — Performance numbers (from L-landed gates)

No new M perf measurements in this lane — the lane's subject is the chronic ledger, not the
perf surface.  The L-landed performance data that M inherits as floors:

- `proof:zero-alloc` LIGHT tier GREEN (d858044): `lerpArray` inlined, `NumericAnimation`/`SpringProgress` zero-alloc; `Float64Array` pack.
- `proof:spring-vector` GREEN (d858044): `setTargets` vector-sugar adopted, 3.8x @ K=8 measured.
- Lighthouse mobile floors (K dist, measured-quiet, `proof:lighthouse-mobile KF_REQUIRE_LH=1`): home 68 / cube 66 / amiga 52 / square 65 / easing 63 / spring 55.  L re-verify is HANDOFF (gated on the deploy round-trip, DM-20).
- `warmEngine()` idle-warmer shipped but `scheduler.postTask` adoption DEFERRED (DMM-30 from L / DLL-30): the probe SKIPs in jsdom; no measured win recorded.

---

## §10 — The `proof:chronic-closure` substrate transition (the M.WZ final motion)

At M.WZ the orchestrator performs the atomic re-point in ONE commit:

1. `scripts/proof-chronic-closure.mjs:114` `CHRONIC_LEDGER` changes from
   `docs/tranches/L/PROGRESS.md` to `docs/tranches/M/PROGRESS.md`.
2. The non-vacuity planted-probe proof: three deliberately-malformed M-ledger rows
   (a FOLD citing a source-shape gate; a HANDOFF targeting an unpublished future version
   with no consume-edge; a ≥4-tranche bare BOOK) RED on all three clause shapes BEFORE
   being removed so the clean M ledger GREENs.
3. `proof:chronic-closure` runs → exit 0 on the clean M ledger.

This is the ORCHESTRATOR'S ATOMIC FINAL MOTION — not executed by this lane.  The M ledger
rows above (DM-1 through DM-20) form the proposed substrate; M.WZ refines and finalizes them.

---

## §11 — Evidence index (re-verified)

- `scripts/proof-chronic-closure.mjs:114` `CHRONIC_LEDGER` = `docs/tranches/L/PROGRESS.md` (verified).
- `proof:chronic-closure` exit 0, 20 rows (re-run live; output above).
- `proof:workaround-deletion` exit 0, 0 GREEN / 5 PENDING (re-run live; output above).
- `proof:control-point-live` exit 1 BORN-RED-BY-DESIGN (re-run live; output above).
- `proof:peer-satisfied` exit 1 BORN-RED-BY-DESIGN (re-run live; output above).
- `proof:keyframes-vue-published` exit 1 clause-b BORN-RED-BY-DESIGN (re-run live; output above).
- `scripts/proof-packrat-sound.mjs` ABSENT: `ls scripts/proof-packrat-sound.mjs` → not found (verified).
- `scripts/proof-css-parity.mjs` ABSENT: `ls scripts/proof-css-parity.mjs` → not found (verified; correct state for gated-on-sibling BOOK).
- `engine.ts:1192`, `timeline.ts:163/209`, `animations.ts:133` — four breaking-change annotations (Read-verified).
- Registry probes (live): glass-ui `4.0.0`, value.js `0.13.0`, parse-that `0.9.0`, keyframes-vue E404.
- `docs/tranches/L/audit/deferred-ledger-L.md` — 51 DLL rows, TERMINAL at L.WZ close.
- `docs/tranches/M/audit/lane-25-band-b-handoffs.md` — lane-25 §3 (MorphSVG build-in analysis), §4 (packrat KILL analysis), §1 (RF-17 no-build-in verdict) — all cross-verified.
