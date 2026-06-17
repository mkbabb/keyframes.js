# M.WZ — Close (recap · deferred terminal · 5.0.0 prep · deploy)

- **Band:** — (the close) · **Class:** BOOK (the close docs — `docs/tranches/M/FINAL.md`)
  + **RECORD** (the deferred ledger TERMINATED L→M; the `proof:chronic-closure` substrate
  re-pointed; the prompt-recap confirmed) + **DEV→IMPL** (ONE gate authored —
  `proof:changelog-5.0.0` — wired into `release.yml`; ONE path constant re-pointed —
  `CHRONIC_LEDGER`) + **USER-DOMAIN** (the version cadence decision + the `@mkbabb/keyframes.js`
  / `@mkbabb/keyframes-vue` npm publishes — version owner **Mike Babb**, confirm-first). IMPL
  opens on explicit authorization. **Dep: LAST in M** — runs after Band A+B green, Band C
  consumed-or-circled, and **gated on M.W8** (the glass-ui BB consume) for the deploy round-trip
  observable; the version cut + publishes are USER-DOMAIN and INDEPENDENT of the site deploy.
- **Gate (born-RED, the close roster):**
  - `proof:changelog-5.0.0` — **does NOT exist today** (`ls scripts/proof-changelog*` → no
    matches; `grep changelog package.json` → 0; verified 2026-06-17). The gate is AUTHORED in
    this wave, born-RED on the missing CHANGELOG entries for ALL FIVE breaking changes (the FOUR
    type/symbol renames — inv-ε under-count viol-M4 CORRECTED from the FINAL's "three" — plus the
    multi-color refusal semantic break).
  - `proof:chronic-closure` — EXISTING; `CHRONIC_LEDGER` points at `docs/tranches/L/PROGRESS.md`
    today (`scripts/proof-chronic-closure.mjs:114`, verified). This wave re-points it L→M in the
    atomic non-vacuity motion (S4), proving the M ledger TERMINAL + non-vacuous.
  - `proof:all` — GREEN on the M consolidated runner (the M.W1 report-all roster) is the deploy
    signal.
- **Folds (lane #):** lane-27 §3/§5/§6/§8 (the FOUR-breaking-change correction, the M-owned-vs-
  USER-DOMAIN partition, the `proof:changelog-5.0.0` authoring, the deploy dependency graph) ·
  lane-28 §1/§2/§4/§10 (the L→M chronicity-increment table, the DM-1..DM-20 open-deferrals
  substrate, the P-invariant-28 roll-up, the `proof:chronic-closure` substrate transition) ·
  lane-08 §2-S4/§4/§5.1 (the four-rename ground truth, the publish/version cadence, the inv-ε
  under-count precept finding).
- **Precept cure:** **viol-M4** (lane-27 §7 PV-1, lane-28 §3, lane-08 §5.1) — `FINAL.md:141-142`
  + `:274-275` state "THREE breaking type changes" but the source documents FOUR
  (`engine.ts:1192`, `timeline.ts:163`, `timeline.ts:209`, `animations.ts:133`). This wave's
  `proof:changelog-5.0.0` is the inv-ε cure: the CHANGELOG must name all four (plus the fifth,
  behavioural, multi-color refusal) or the gate REDs. M's `FINAL.md` states FOUR, not three.

---

## Context

M is the consolidation tranche. By the time M.WZ runs, the M waves have transposed the gate
apparatus (Band A — M.W1 report-all runner, M.W2 LINT tier, M.W3 integration tier, M.W4 synthetic
clock), totalized the round-trip correctness the L gates missed (Band B — M.W5 compile-surface,
M.W6 multi-color densify, M.W7 ingest deepening), consumed the constellation and unblocked the
deploy (Band C — M.W8 glass-ui BB, M.W9 value.js O, M.W10 parse-that, M.W11 CSS-parity), measured
performance honestly (Band D — M.W12, M.W13), and exited the terminal belt (Band E — M.W14). M.WZ
is the close: it terminates the chronic ledger L→M, authors the 5.0.0 changelog gate over the
corrected breaking-change count, confirms the prompt-recap total, and RE-observes the deploy
round-trip the L close left as a HANDOFF.

The L close (`tranche-l-dev` tip `529fcfd`) shipped honest but **did not deploy** — and the L
FINAL §S6 explicitly HANDOFFs the deploy round-trip (gated on `proof:all` GREEN + the glass-ui BB
peer fix + the USER-DOMAIN version cut). All three preconditions are M obligations: (1) `proof:all`
GREEN on the consolidated M runner (M.W1); (2) `proof:peer-satisfied` GREEN via M.W8 (the glass-ui
BB consume — the SOLE deploy blocker, lane-23 §0 verdict); (3) the USER-DOMAIN version cut. M.WZ is
where they close and the round-trip is OBSERVED with exact bytes, or where M honestly states what
blocked it.

### The chronic terminal (lane-28)

The L `PROGRESS.md §"Open deferrals"` is the current `proof:chronic-closure` substrate
(`scripts/proof-chronic-closure.mjs:114` → `docs/tranches/L/PROGRESS.md`, verified). Its 20 rows
carry into M with chronicity incremented by one tranche (lane-28 §1). The substrate transition is
the M.WZ atomic final motion: `CHRONIC_LEDGER` re-points L→M simultaneously with the M ledger
(DM-1..DM-20, lane-28 §2) becoming authoritative and TERMINAL — proven non-vacuous by the
planted-row RED discipline (the K.WZ/L.WZ precedent). **`docs/tranches/M/PROGRESS.md` does not
exist today** (verified) — it is authored as the substrate before the re-point.

**The P-invariant-28 terminal belt at M (lane-28 §4).** Two 7-tranche items are ABSOLUTE terminal
(no 8th ride): DL-L7 GlassControlPoint (E→M) and DL-L8 MorphSVG (C→M) — both EXIT via M.W14
(build-in/KILL/consume), not via the close. Three more newly hit ≥4-tranche (DL-L6 RF-17 4-tranche,
CH-6 DFA 4-tranche, scene-control-dfa 4-tranche). M.WZ does not RE-DECIDE these — they exit in
their owning waves (M.W8/M.W14); M.WZ records their terminal disposition into the M ledger and
proves the whole ledger TERMINAL through `proof:chronic-closure`.

### The 5.0.0 prep (lane-27 §3, lane-08 §2-S4)

The tree carries `package.json version: 4.3.0` (verified). The L FINAL recommends `5.0.0` but
asserts nothing — and **under-counts the breaking changes as THREE** (`FINAL.md:141-142`). Ground
truth: FOUR symbol renames are documented `@deprecated`/`BREAKING (5.0.0)` in source, plus a fifth
behavioural break:

| # | Symbol | Old → New | Source location (verified) | Surface |
|---|--------|-----------|----------------------------|---------|
| 1 | class | `Animation` → `KeyframesAnimation` | `engine.ts:1192` (`@deprecated`; alias `engine.ts:1205`) | HEAVY |
| 2 | class | `ScrollTimeline` → `KeyframesScrollTimeline` | `timeline.ts:209` (`@deprecated`; alias `timeline.ts:218`) | LIGHT |
| 3 | interface | `ScrollTimelineOptions` → `KeyframesScrollTimelineOptions` | `timeline.ts:163` (`@deprecated`; alias `timeline.ts:171`) | LIGHT type |
| 4 | preset | `presets.flip` → `presets.flipPreset` | `animations.ts:133` (`BREAKING (5.0.0)`) | HEAVY |
| 5 | behaviour | `compileToCSS` REFUSES multi-color (was silently-lossy `eligible:true`) | `compile-color.ts:225-226` (⚠28/⚠29) | compile contract |

`release.yml` runs `check:lib → build:lib → test → proof:boundary → proof:published-surface →
proof:deps-current → [report-all] proof:peer-satisfied → npm publish` (verified `release.yml:54-79`)
— **no CHANGELOG completeness gate**. A publish with an absent or under-counted CHANGELOG is not
blocked. `proof:changelog-5.0.0` is the missing gate, authored here and wired into `release.yml`
as a pre-publish step.

### The user-domain finale (lane-27 §2/§5)

The version cut + both npm publishes are USER-DOMAIN — Mike Babb fires them. The published packages
are `@mkbabb/keyframes.js` (`package.json:2`) and `@mkbabb/keyframes-vue`
(`packages/keyframes-vue/package.json:2`); the latter is E404 today (clause b of
`proof:keyframes-vue-published` RED-by-design, verified). The `release.yml` `publish-keyframes-vue`
job (`needs: publish`) fires both on a `v*.*.*` tag. M.WZ authors the CHANGELOG gate + the version
criteria; the user fires the tag.

### The L.W11 TASTE verdict (lane-27 §10)

The L.W11 design refinement (`L.W11 — Design refinement (the instrument language)`) closes on a
USER-DOMAIN TASTE verdict — "the design verdict is USER-DOMAIN" per the K TASTE-boundary invariant
(`L.W11.md:94-96`). There is NO gate for taste (`proof:taste-packet` only asserts the before/after
packet is well-formed). M.WZ CAPTURES the verdict — the user's explicit "meets the bar" — as a
RECORD row in the FINAL, never as an agent "designer-eye PASS" (the inv-ε boundary).

### Audit evidence M.WZ inherits

| Ref | Source location | Fact (verified this session unless noted) |
|-----|-----------------|-------------------------------------------|
| lane-27 §3 / lane-08 §5.1 | `engine.ts:1192`, `timeline.ts:163`/`:209`, `animations.ts:133` | FOUR `@deprecated`/`BREAKING` annotations — the FINAL's "THREE" is an inv-ε under-count (viol-M4) |
| lane-27 §1 | `FINAL.md:141-142` + `:274-275` | the under-count source — both passages say "THREE breaking type changes" |
| lane-27 §3 / lane-08 §2-S4 | `compile-color.ts:225-226` | the fifth (behavioural) break — multi-color REFUSE, was `eligible:true` silently-lossy |
| lane-27 §12 | `ls scripts/proof-changelog*` → no matches; `grep changelog package.json` → 0 | `proof:changelog-5.0.0` ABSENT — the missing gate this wave authors |
| lane-27 §1 / §12 | `release.yml:54-79` | publish roster has NO changelog gate; the new gate wires as a pre-publish step |
| lane-28 §0 / §10 | `scripts/proof-chronic-closure.mjs:114` | `CHRONIC_LEDGER = docs/tranches/L/PROGRESS.md` — the constant this wave re-points L→M |
| lane-28 §0 | `node scripts/proof-chronic-closure.mjs` | exit 0, 20 rows parsed from the L ledger (re-run live) |
| — | `ls docs/tranches/M/PROGRESS.md` | ABSENT — the M substrate is authored before the re-point |
| lane-28 §2 | the DM-1..DM-20 substrate (lane-28 §2a/§2b/§2c/§2d) | the proposed M `§"Open deferrals"` table M.WZ finalizes |
| lane-28 §4 | DL-L7 (7-tranche), DL-L8 (7-tranche) | ABSOLUTE terminal at M — EXIT via M.W14, recorded by M.WZ |
| lane-27 §5 / lane-08 §2-S2 | `package.json:2`, `packages/keyframes-vue/package.json:2` | the two USER-DOMAIN publish targets; keyframes-vue E404 today |
| lane-27 §10 | `L.W11.md:94-96` | the TASTE verdict is USER-DOMAIN — no gate; M.WZ captures the user's "meets the bar" |
| precedent | commit `4f1fc4c` (J-close) | the deploy round-trip oracle SHAPE: `CI 27378354065 → deploy 27379501160 → live serves index-xIYGAIrv.js exact` — the exact-byte observable S6 re-observes |
| precedent | `package.json:191` | `proof:all = proof:correctness && proof:hygiene` — the consolidated M runner (M.W1 report-all) is the deploy signal |

---

## Scope

Each S-clause is a concrete, falsifiable deliverable. Together they close M: the FINAL held to
inv-ε, the chronic ledger terminated L→M non-vacuously, the prompt-recap total, the 5.0.0 changelog
gate authored over the CORRECTED breaking-change count + wired into the publish path, the
USER-DOMAIN version cut + publishes triggered, the deploy round-trip RE-observed on the M.W8
consume, and the L.W11 TASTE verdict captured.

---

### S1 — `FINAL.md` held to inv-ε (every boundary cites its observed oracle)

**Deliverable:** `docs/tranches/M/FINAL.md` — the M boundary close report, both bands, held to
inv-ε.

Every boundary claim CITES its observed oracle, not a re-assertion of intent:

- **Band A boundary — the apparatus transposition.** Cites the M.W1 report-all runner GREEN on a
  planted multi-red tree (ALL reds in ONE pass, the O(N²) kill); the M.W2 `proof:lint-tier`
  subsuming the ~33 source-shape gates; the M.W3 integration tier (the 72 runtime gates parallel +
  warm, NO coverage lost); the M.W4 synthetic-clock settle (zero wall-clock `waitForTimeout`). The
  DX number cited as MEASURED (the 3-hour iterate-to-green → single-digit minutes), not asserted.
- **Band B boundary — round-trip totality.** Cites `proof:replay-equality` extended GREEN
  (`@property` into `compileToCSS`; named-selector frames throw OR resolve, never NaN-always-active
  — M.W5); `proof:compile-replay` extended GREEN (oklch emits `oklch(`; non-color survives the
  densified block — M.W6); `proof:ingest-replay` extended GREEN (cross-depth sibling linkage —
  M.W7). Each cited by gate name + the REAL observable the L gates missed.
- **Band C boundary — the constellation consume + deploy.** Cites `proof:peer-satisfied` GREEN (the
  M.W8 glass-ui BB consume — F-2 cleared) OR honestly NAMED-HANDOFF with its tripwire if BB has not
  published by close; `proof:workaround-deletion` arm-by-arm state (S1/S2 on the glass-ui track,
  S7/S8/S9 on the value.js track — each GREEN-on-consume or PENDING-with-named-tripwire); the
  `proof:css-parity` born-RED status (HONEST — RED today if the coordinated grammar has not
  published).
- **Band D boundary — performance.** Cites the M.W12 gap benches budgeted; the `postTask` probe
  GREEN on a real-browser INP measurement OR stays KILLed (no un-measured claim); the M.W13
  `proof:decomposition` (engine.ts under ceiling WITHOUT the override) GREEN or HANDOFF on
  value.js VJ-L1.
- **Band E boundary — the terminal belt.** Cites M.W14: DL-L8 MorphSVG build-in over the PUBLISHED
  value.js `PathGeometry` (the L-ledger "absent API" premise CORRECTED — viol-M5, lane-28 DM-3);
  DL-L9 packrat KILL (unsound tier, zero consumers); DL-L7 GlassControlPoint build-in or KILL.
- **The version cadence oracle.** Cites the USER-DOMAIN chosen version string, OBSERVED in
  `package.json` AFTER the cut (S5) — never an assertion of `5.0.0` before the cut fires.
- **The deploy round-trip oracle.** Cites the observed CI run ID → `deploy-pages.yml` run ID →
  live `index-*.js` hash equal to the freshly-built artifact for the merge SHA (S6, the J-close
  exact-byte form).
- **The TASTE oracle.** Cites the user's explicit "meets the bar" on the L.W11 design packet
  (S7) — a USER-DOMAIN RECORD, never an agent PASS.

**Anti-overclaim discipline (the inv-ε keystone).** The breaking-change count is FOUR, not three
(viol-M4 corrected). The Band-C un-consumed edges are NAMED with tripwires, not asserted closed.
The `proof:lighthouse-mobile` scores are RECORDED, not hard-gated. The FINAL does NOT assert
`5.0.0` shipped until the cut is OBSERVED. The deploy is "observed" ONLY when the live-byte hash
equality is shown — a green local `proof:all` is NOT the deploy claim (local `proof:all` excludes
`proof:peer-satisfied`, lane-23 §5.2; CI red can coexist with local green).

---

### S2 — Deferred ledger TERMINATED L→M (`M/PROGRESS.md §"Open deferrals"`)

**Deliverable:** `docs/tranches/M/PROGRESS.md §"Open deferrals"` (NEW — does not exist today) with
every row at a terminal disposition; the DM-1..DM-20 substrate (lane-28 §2) finalized.

**The substrate (lane-28 §2):** the 20 L rows carry into M with chronicity incremented by one
(lane-28 §1); the column shape is identical to L (every row leads with an explicit integer
tranche-span count — `proof:chronic-closure` reads the leading integer only). Terminal disposition
vocabulary: FOLD, HANDOFF (sibling-owned, named tripwire, born-RED kf-gate), KILL, RECORD,
VERIFY-ONLY, USER-DOMAIN.

**Required terminal shape (lane-28 §2/§4):**

| DM row | Expected terminal at M close |
|--------|------------------------------|
| DM-1 RF-17 / DL-L6 (4-tranche) | **HANDOFF→FOLD** on M.W8 — `proof:workaround-deletion` S2 GREEN on the glass-ui 4.1.0 consume; no 5th carry (no-workaround) |
| DM-2 GlassControlPoint / DL-L7 (7-tranche, ABSOLUTE) | **EXIT** via M.W14 — build-in (Option B over LIGHT `Draggable`) OR named KILL; re-BOOK CLOSED |
| DM-3 MorphSVG / DL-L8 (7-tranche, ABSOLUTE) | **EXIT** via M.W14 — build-in over PUBLISHED value.js `PathGeometry` (viol-M5 premise corrected) OR consume value.js O |
| DM-4 PT-2 packrat / DL-L9 (6-tranche) | **KILL** (lane-28 §5 — unsoundness off the value.js-consumed path; zero consumers) |
| DM-5 constellation workarounds / DL-L10 | **FOLD** arm-by-arm on sibling publish (S1/S2 glass-ui M.W8; S7/S8/S9 value.js M.W9) OR named HANDOFF |
| DM-6 CSS-parity / DL-L11 | **HANDOFF** — coordinated value.js-O + parse-that publish; `proof:css-parity` born-RED until consume |
| DM-7 keyframes-vue 0.1.0 / DL-L5 | **USER-DOMAIN** — the npm publish (Mike Babb); clause b GREENs on publish |
| DM-8..DM-15 (VERIFY-ONLY / RE-AFFIRM terminated chronics) | **VERIFY-ONLY** — re-verify the GREEN gate on the M dist; any revert is a NEW M regression |
| DM-16 5.0.0 cut | **USER-DOMAIN** — version criteria proposed (S5); FOUR breaking changes (viol-M4) |
| DM-17 `proof:packrat-sound` absent | **KILL-with-caveat** (M.W14 — gate never authored; off-path) OR authored-on-consume |
| DM-18 `proof:css-parity` absent | the CORRECT gated-on-sibling BOOK state — author gate-first WHEN siblings publish (M.W11) |
| DM-19 `proof:rf17-net-deletion` name | **canonicalize** — S2 arm subsumes it; retire the name (lane-28 DMM-A, the KISS path) |
| DM-20 deploy round-trip | **observed** (S6) OR honestly NAMED-blocked — the L HANDOFF form is NOT carried to M |

**P-invariant-28 check (lane-28 §4).** No ≥4-tranche row may enter M.WZ as a bare BOOK. The
7-tranche absolutes (DM-2, DM-3) MUST be EXITED (the M.W14 commit hash or a named KILL spec). The
4-tranche newcomers (DM-1, DM-14, DM-15) exit via HANDOFF-consume (DM-1) or VERIFY-ONLY-TERMINATED
born-RED oracle (DM-14, DM-15). The KILL path is the KISS choice for DM-4 (off-consumed-path) and
DM-17. A row entering M.WZ without a named tripwire + a born-RED kf gate is a P-invariant-28
VIOLATION; the close does not proceed.

---

### S3 — Prompt-recap CONFIRMED (`prompt-recap-M.md` TOTAL)

**Deliverable:** `docs/tranches/M/audit/prompt-recap-M.md` (ABSENT today — verified) extended
through the close; every distinct owner request across the campaign at a terminal verdict.

The campaign requests (M.md §"Prompt recap"): begin-the-tranche · NO-quick-solutions ·
maximal-parallelism+workflows · batches-of-3 · the crayons-by-register design verdict ·
wait-on-glass-ui · complete-in-totality · the apparatus critique (why-so-slow, why-not-in-`test/`,
what-are-proof-scripts) · consider-value.js+parse-that+glass-ui · the 32-lane M-audit ·
"what of our performance numbers".

**Terminal-verdict vocabulary (the K/J/L precedent):** ADDRESSED (shipped in an M wave + gate
GREEN, cited by name), RECORD (documented, not an action item), HANDOFF (sibling-owned, named
tripwire), USER-DOMAIN (Mike Babb — the version cut + publishes + the TASTE verdict),
FOLD-INTO-M (absorbed into a wave), OUT (permanently out of scope).

**Zero drops.** The A→L prompt ledger closed with zero drops (the L discipline). The M prompt-recap
carries it forward: no user request from A through M may have an un-dispositioned verdict at close.
A request ADDRESSED by a wave is cited by gate name, not asserted closed; a HANDOFF is named with
its tripwire; an un-dispositioned request is a close blocker. The recap is the audit's internal
HONESTY instrument — a terminal disposal of every distinct request, not a per-commit log.

---

### S4 — Chronic-closure substrate transition L→M (non-vacuous, ONE atomic motion)

**Deliverable:** `scripts/proof-chronic-closure.mjs:114` `CHRONIC_LEDGER` re-pointed from
`docs/tranches/L/PROGRESS.md` to `docs/tranches/M/PROGRESS.md` in ONE motion, simultaneously with
the M ledger (S2) becoming authoritative + TERMINAL.

**Non-vacuity protocol (the K.WZ/L.WZ precedent; the gate's own rule set,
`proof-chronic-closure.mjs:110-111`).** The transition MUST be proven non-vacuous: the gate must
RED on three deliberately-malformed planted M-ledger rows — one of each failing clause shape —
before the clean terminal M ledger greens it:

```
# Planted row 1 — FOLD citing a source-shape gate
| DM-PLANT-1 | M | 1 (M) | FOLD → M.W0 | M.W0 | `proof:boundary` (source-shape grep) |
```
→ must RED: `[runtime-band] FOLD row 'DM-PLANT-1' cites a source-shape gate 'proof:boundary' —
not a RUNTIME gate (no browser opened over the dist)`.

```
# Planted row 2 — HANDOFF targeting an unpublished future version
| DM-PLANT-2 | M | 1 (M) | HANDOFF → value.js 0.15.0 | M.W9 | value.js 0.15.0 not yet on npm |
```
→ must RED: `[tripwire] HANDOFF row 'DM-PLANT-2' targets an unpublished sibling version — tripwire
is not a published-consume-edge`.

```
# Planted row 3 — bare BOOK, chronicity ≥4
| DM-PLANT-3 | B (B..M) | 12 (B..M) | BOOK (future decide) | — | — |
```
→ must RED: `[p-invariant-28] bare BOOK row 'DM-PLANT-3' has chronicity 12 ≥ 4 — must EXIT
(FOLD/HANDOFF/KILL/OUT), not BOOK`.

**Procedure (ONE atomic commit, NOT a split motion):** (a) plant the three malformed rows in
`M/PROGRESS.md §"Open deferrals"`; (b) `node scripts/proof-chronic-closure.mjs` — confirm RED on
all three; (c) remove the planted rows + confirm GREEN on the clean terminal M ledger; (d) in the
SAME commit, re-point `CHRONIC_LEDGER` L→M. Re-point + non-vacuity proof + M ledger terminal are
ONE commit. The gate output then reads `✓ proof:chronic-closure — the M ledger is TERMINAL`.

**Why re-point, not a new gate:** `proof:chronic-closure` IS the substrate-transition mechanism —
the gate that catches "chronic silently dropped across a tranche boundary" (the P-invariant-28
mis-termination H→J caught by K.W0). Its non-vacuity proof is the planted-row RED discipline. A new
gate would duplicate its grammar; the re-point is the intended usage.

---

### S5 — `proof:changelog-5.0.0` authored born-RED + the version cadence (USER-DOMAIN)

**Deliverable:** a NEW gate `scripts/proof-changelog-5.0.0.mjs` (born-RED on today's tree) wired
into `package.json` scripts + `release.yml` as a pre-publish step; a USER-DOMAIN version decision
record (one paragraph naming the chosen string + the evidence) written BEFORE the `changeset
version` cut.

**The gate (lane-27 §8 M.WZ-prep).** `proof:changelog-5.0.0` reads `CHANGELOG.md` (or the changeset
files) and asserts an entry exists for EACH of the FIVE breaking changes — the gate REDs on any
missing entry:

| Clause | Asserts present | Born-RED today |
|--------|-----------------|----------------|
| (a) | `Animation → KeyframesAnimation` | RED — no CHANGELOG 5.0.0 entry exists (gate absent) |
| (b) | `ScrollTimeline → KeyframesScrollTimeline` | RED |
| (c) | `ScrollTimelineOptions → KeyframesScrollTimelineOptions` | RED |
| (d) | `presets.flip → presets.flipPreset` | RED |
| (e) | multi-color compile refusal (`compileToCSS` REFUSES, was `eligible:true`) | RED |

The gate is the inv-ε cure for **viol-M4**: the FINAL's "three" is structurally impossible to
re-assert — the CHANGELOG must name all FOUR type renames (+ the fifth, behavioural) or the publish
is BLOCKED. The gate must wire into `release.yml` as a pre-`npm publish` step, NOT just a local gate
(lane-27 §8 precept note — `release.yml` has no CHANGELOG completeness gate today; a publish with an
incorrect CHANGELOG is currently un-blocked).

**The version decision (USER-DOMAIN — Mike Babb fires).** The agent proposes the criteria; the user
fires the cut. The case for MAJOR `5.0.0` (lane-08 §4.1): the multi-color refusal is a SEMANTIC
CONTRACT BREAK on the compile surface (a consumer shipping multi-color with `eligible:true` now
gets a `CompileRefusal`); the FOUR type renames change the d.ts canonical names; `keyframes-vue`
0.1.0 is a net-new published package. The case for MINOR `4.4.0`: no import path is removed; the
deprecated aliases preserve the value paths; the refusal is defensible-as-additive only if no
documented consumer relied on the silent-lossy behaviour. The chosen string is recorded BEFORE
`changeset version`; the FINAL cites the OBSERVED `package.json` version AFTER the cut.

**The keyframes-vue 5.0.0 compat pre-check (lane-27 §7 PV-4).** Before the cut, run `npm run check`
in `packages/keyframes-vue/` against the 5.0.0 named types — if the adapter source references the
OLD names directly (not through `loadAnimationEngine()`'s return type), the check fails on the
version-cut tree. This is an un-verified pre-cut obligation, not an assumption.

---

### S6 — `proof:all` GREEN on the M consolidated runner + deploy round-trip RE-observed (gated on M.W8)

**Gate:** `npm run proof:all` GREEN on the M close tree — the consolidated M runner (the M.W1
report-all roster, `proof:correctness && proof:hygiene`, `package.json:191`). This is the deploy
signal.

**Deploy round-trip re-observation (gated on M.W8 — the glass-ui BB consume).** The J.W0/K.WZ
discipline, RE-observed on the M close. The round-trip is OBSERVABLE only AFTER M.W8 clears the F-2
peer-cycle (`proof:peer-satisfied` GREEN; lane-23 §1 — the SOLE deploy blocker). The oracle, each
link OBSERVED:

1. `proof:all` GREEN on the consolidated runner — observe the run.
2. Close-merge to master → CI run N GREEN (the `demo-smoke` job PASSES — `proof:peer-satisfied` no
   longer adds to `$failed`, `ci.yml:1581`) — observe run ID.
3. `deploy-pages.yml` fires as a `workflow_run` consequence (`conclusion == 'success' &&
   head_branch == 'master'`, `deploy-pages.yml:44-46`) — observe run ID.
4. The live `keyframes.babb.dev` `index-*.js` filename equals the freshly-built `dist/gh-pages`
   hash for the merge SHA — observe the hash equality.

The FINAL cites all four with their run IDs / filenames — never an assertion, always an oracle.

**Constraint (inv-M-observable-truth on the deploy).** The deploy is "observed" ONLY when the
live-served `index-*.js` hash is shown EQUAL to the freshly-built artifact for the merge SHA (the
J-close shape, commit `4f1fc4c`: `CI <run-id> → deploy <run-id> → live serves index-<hash>.js
exact`). A green local `proof:all` is NOT the deploy claim: local `proof:all` excludes
`proof:peer-satisfied` (lane-23 §5.2), so local green can coexist with CI red and a stale site. The
REAL observable is the bytes the site serves, not the gate exit code.

**The version-cut/deploy decoupling (lane-23 §4).** The deploy round-trip is SEPARATELY sequenced
from the npm publish. The close-merge → auto-deploy fires on the M.W8 re-pin landing (the
`proof:peer-satisfied` blocker is on the close-merge path). The `v5.0.0` tag fires the separate
`release.yml` publish jobs. They can occur in either order (the J.W0/K.WZ precedent is deploy-first,
publish-second — the version bump is not needed to serve the demo).

---

### S7 — L.W11 TASTE verdict CAPTURED (USER-DOMAIN, no gate)

**Deliverable:** a RECORD row in `M/FINAL.md` capturing the user's explicit TASTE verdict on the
L.W11 design packet — "meets the bar" or the user's actual words — never an agent "designer-eye
PASS" (lane-27 §10).

The L.W11 design refinement closed on the K TASTE-boundary invariant: the design verdict is
USER-DOMAIN (`L.W11.md:94-96`). `proof:taste-packet` only asserts the before/after packet is
well-formed (the K.W5 generator) — it is NOT a taste judgement. M.WZ does NOT manufacture a verdict;
it CAPTURES the user's. If the user has not rendered the verdict at close, M.WZ records it as
USER-DOMAIN-PENDING with the packet cited — the honest state, not an agent stand-in. The inv-ε
boundary: a "meets the bar" claim that the user did not make is an overclaim; the agent pass is
corroboration only.

---

## Born-RED gate

**Gates:** `proof:changelog-5.0.0` (NEW — authored in this wave, born-RED on today's tree) AND
`proof:chronic-closure` (EXISTING — re-pointed L→M in the atomic non-vacuity motion, S4) AND
`proof:all` (EXISTING — GREEN on the consolidated M runner is the deploy signal, S6). The keystone
born-RED of the wave is `proof:changelog-5.0.0` — it bites the REAL inv-ε under-count, NOT a proxy.

**The REAL observable (inv-M-observable-truth).** Each gate bites the GENUINE defect, verified live
this session — NOT a proxy:

| Gate / clause | Witness on today's tree | Failure mode today (the REAL observable) | Expected at M close |
|---------------|-------------------------|------------------------------------------|---------------------|
| S5 `proof:changelog-5.0.0` | `ls scripts/proof-changelog*` → **no matches**; `grep changelog package.json` → **0** | the gate does NOT exist; `release.yml` has NO CHANGELOG completeness gate (`release.yml:54-79`) — a publish with an absent/under-counted CHANGELOG is UN-BLOCKED; the FINAL's "THREE breaking changes" (`FINAL.md:141-142`) is the inv-ε under-count (viol-M4) the missing gate would catch | the gate AUTHORED, born-RED on the missing CHANGELOG entries; GREEN only when ALL FIVE entries present (4 renames + the multi-color refusal); wired into `release.yml` pre-`npm publish` |
| S4 `proof:chronic-closure` | `scripts/proof-chronic-closure.mjs:114` → `docs/tranches/L/PROGRESS.md`; `node scripts/proof-chronic-closure.mjs` → exit 0, 20 L rows | the substrate still points at L; the M ledger does not yet exist (`ls docs/tranches/M/PROGRESS.md` → ABSENT) — the M chronics have no terminal substrate; a chronic could silently drop across the L→M boundary | re-pointed L→M; the three planted M-ledger rows RED on all three clause shapes; the clean terminal M ledger GREENs; output `✓ the M ledger is TERMINAL` |
| S6 `proof:all` + deploy | `proof:peer-satisfied` exit 1 (the F-2 ELSPROBLEMS, gated on M.W8); the site is stale | the deploy `if` is FALSE (`ci` concludes failure on the F-2 red) → `keyframes.babb.dev` does not re-ship; the L close left the round-trip a HANDOFF, never observed | `proof:all` GREEN on the consolidated runner → CI `success` → `deploy-pages.yml` fires → live `index-*.js` hash EQUALS the merge-SHA artifact (the exact-byte oracle) |

**Born-RED on today's tree (the keystone).** `proof:changelog-5.0.0` is born-RED because it does
not exist AND there is no CHANGELOG 5.0.0 entry to satisfy it — the missing-gate state IS the
genuine inv-ε breach (viol-M4: the source documents FOUR renames; the FINAL says three). There is
NO source-shape stand-in: the gate reads the real CHANGELOG/changeset content and asserts the real
breaking-change entries. The chronic-closure substrate is born-pointing-at-L; the deploy is
born-blocked on M.W8.

**GREEN condition.** `proof:changelog-5.0.0` authored + the CHANGELOG records all FIVE breaking
changes (4 renames + the multi-color refusal) + wired into `release.yml`; `proof:chronic-closure`
re-pointed L→M with the M ledger TERMINAL + non-vacuous; `proof:all` GREEN on the consolidated M
runner; the deploy round-trip OBSERVED (the live-byte hash equality, gated on M.W8) OR honestly
NAMED-blocked; the prompt-recap total with zero drops; the L.W11 TASTE verdict captured (or
recorded USER-DOMAIN-PENDING). The version cut + publishes are USER-DOMAIN — the FINAL cites the
OBSERVED `package.json` version + the registry presence AFTER the user fires the tag.

---

## Dependencies

| Dep | Required state | Status at dev-phase |
|-----|----------------|---------------------|
| Band A (M.W1–M.W4) | the consolidated report-all runner GREEN; the apparatus transposed | DEVELOPED; impl opens on auth |
| Band B (M.W5–M.W7) | kf-internal round-trip totality GREEN (value.js-0.13.0-sufficient) | DEVELOPED; impl opens on auth |
| **M.W8 (glass-ui BB consume) — the deploy unlock** | `proof:peer-satisfied` GREEN | DEVELOPED; HANDOFF-gated on glass-ui BB 4.1.0 (E404 today — the deploy round-trip S6 is GATED on this) |
| Band C (M.W9–M.W11) | consumed-or-circled; each born-RED edge named with tripwire | DEVELOPED; HANDOFF on value.js O / parse-that publishes |
| Band E (M.W14) | DL-L7 + DL-L8 EXITED (build-in/KILL/consume); DL-L9 KILL | DEVELOPED; the P-inv-28 absolute exits |
| `proof:all == CI` | the full consolidated roster passes on the M close tree | M waves must not RED any existing gate |
| `proof:chronic-closure` non-vacuity | three planted M rows RED before the clean ledger greens | non-vacuous by construction (the gate's grammar enforces it) |
| `proof:changelog-5.0.0` | AUTHORED born-RED + wired into `release.yml` | does NOT exist today (verified) — this wave authors it |
| USER-DOMAIN version cut + publishes | Mike Babb fires `changeset version` + the `v*.*.*` tag | confirm-first; criteria proposed (S5); INDEPENDENT of the site deploy |
| L.W11 TASTE verdict | the user's "meets the bar" | USER-DOMAIN; captured (S7) or recorded PENDING |
| value.js `^0.13.0` / glass-ui (M.W8 re-pin) | the M close pins; M.W8 advances glass-ui to `~4.1.x` | `^0.13.0` pinned; glass-ui pin advances on M.W8 |

**The acyclic spine (M.md §"cross-repo dispatch").** parse-that 0.9.1 → value.js O 0.14.0 → kf
re-pin → glass-ui BB consume. M.WZ consumes the SITE-deploy edge (M.W8 → `proof:peer-satisfied`
GREEN) and the publish edge (USER-DOMAIN `v5.0.0` tag) — both downstream of the spine, neither
introducing a cycle. The deploy round-trip does NOT block on value.js O or the npm publish; M.W8
(glass-ui BB) is the sole gating sibling for the SITE deploy (lane-23 §4).

---

## Bite — what regression each S-clause catches

| S-clause | Gate | Regression it prevents |
|----------|------|------------------------|
| S1 — FINAL.md inv-ε | Authored boundary claims must each cite an observed oracle | Prevents a FINAL that asserts round-trip totality / deploy / parity-closure without a GREEN witness — exactly the L FINAL's "THREE breaking changes" under-count (viol-M4) and the deploy-HANDOFF-as-done overclaim |
| S2 — deferred ledger TERMINATED | `proof:chronic-closure` GREEN on the M ledger | Prevents a chronic drifting across the L→M boundary un-dispositioned — the H→J P-invariant-28 mis-termination; forces the 7-tranche absolutes (DL-L7/L8) to EXIT, not BOOK a fifth ride |
| S3 — prompt-recap confirmed | Zero drops — every user request at a terminal verdict | Prevents a user request from A→M (the apparatus critique, "what of our performance numbers", consider-value.js+parse-that+glass-ui) un-dispositioned at close — the A→L zero-drops discipline carried forward |
| S4 — substrate transition non-vacuous | `proof:chronic-closure` REDs on the three planted M-row shapes before the clean ledger greens | Prevents a vacuous path-swap that clears the gate over a malformed M ledger — the K.WZ/L.WZ planted-probe discipline; catches a re-point that greens a never-validated substrate |
| S5 — `proof:changelog-5.0.0` + version | The NEW gate REDs on any missing CHANGELOG entry; wired into `release.yml` | Prevents a 5.0.0 publish with an under-counted CHANGELOG (the inv-ε under-count viol-M4 — three stated, FOUR + the multi-color refusal actual) reaching npm; prevents the FINAL asserting a version never cut |
| S6 — `proof:all` GREEN + deploy round-trip | `proof:all` on the consolidated runner + the observed CI→deploy→live-byte equality | Catches any M-wave regression the full roster flags; prevents a green local `proof:all` mistaken for a shipped deploy (local roster excludes `proof:peer-satisfied`; CI red can coexist with local green and a stale site — the inv-ε deploy overclaim) |
| S7 — TASTE verdict captured | USER-DOMAIN RECORD, no gate | Prevents an agent "designer-eye PASS" substituting for the user's TASTE verdict — the K TASTE-boundary invariant (the verdict is USER-DOMAIN, never agent-manufactured) |

---

## Excluded from this wave

- **The 5.0.0 cut + npm publishes themselves** — USER-DOMAIN (Mike Babb fires `changeset version`
  + the `v*.*.*` tag). M.WZ authors the CHANGELOG gate + the criteria; the user actuates. The cut
  is INDEPENDENT of the SITE deploy (lane-23 §4).
- **The glass-ui 4.1.0 source cure** (peer-widen + SegmentedTabs aria + RF-17) — glass-ui-owned
  (inv-16); M.W8 is the consume. M.WZ's deploy round-trip is GATED on M.W8 firing, not on writing
  glass-ui source.
- **The value.js O / parse-that consumes** (S7/S8/S9 workaround deletions; the coordinated grammar)
  — M.W9/M.W10/M.W11, gated on value.js 0.14.0 / parse-that 0.9.1 publishes. NOT on the SITE-deploy
  critical path (the deploy unblocks on glass-ui BB alone — lane-27 §9).
- **The DL-L7/L8/L9 terminal-belt EXITS** — M.W14 (build-in/KILL/consume over the PUBLISHED
  value.js `PathGeometry`). M.WZ RECORDS their terminal disposition into the M ledger; it does not
  re-decide them.
- **The keyframes-react scaffold** — a SHIP-in-M candidate (lane-27 §8, lane-08 §9) gated on the
  5.0.0 cut (peer floor `>=5.0.0` per the L.W8-react BOOK); authored gate-first
  (`proof:keyframes-react-published` born-RED) in its own wave, NOT the close.
