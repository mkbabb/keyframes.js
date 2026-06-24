# R.W8 — Close (deferred-ledger re-point Q→R · prompt-recap confirmed · release)

**Phase:** IMPL (LAST — runs after every prior R wave gate is GREEN)
**Band:** E — docs + close
**Depends on:** All R.W1–R.W7 gates GREEN; the R `## Open deferrals` table in
`PROGRESS.md` finalized with real dispositions for all 10 fold items.

---

## 1. Scope

R.W8 is the terminal tranche close. It executes five concrete motions, in order:

1. **Fold #1 — `proof:chronic-closure` re-pointed Q→R** (`CHRONIC_LEDGER` +
   `LEDGER_LABEL` in `scripts/proof-chronic-closure.mjs:117,493`). DM-7 re-stated
   as owner-ratified KILL (no dangling `proof:keyframes-vue-published` reference).
   The gate goes GREEN on the R substrate. This discharges the entry tripwire that
   has kept `proof:chronic-closure` RED since R.W0 (`audit/retro-deferred-ledger.md
   §Group 1` + `R.W0.md §2a`).

2. **10-item fold discharge** — each of the binding fold items in
   `PROGRESS.md §"Open deferrals"` reaches a terminal verdict in R (per the
   P-inv-28 reckoning in `audit/retro-deferred-ledger.md §P-invariant-28
   re-reckoning`): the BC-gated trio (DM-1 S2, DM-5 S1, DM-24) must either LAND
   their BC delete OR fire the contingency KILL; the dropped Q dispatches
   (DQ-3, VJ-Q9, DM-5 S8) must resolve; the ×8 VERIFY-ONLY chronics must be
   re-run on the R dist; DQ-5 ci-coverage re-verified.

3. **Prompt-recap confirmed zero-dropped** — `audit/retro-prompt-recap.md §6`
   verdict re-checked against the R-shipped tree (not chain-trusted from the DEV
   doc claim).

4. **FINAL.md** authored at `docs/tranches/R/FINAL.md` — records the R version
   number, the P-inv-28 register, the Q→R keyframes-vue KILL entry (so the belt
   does not silently revert to "open"), the `proof:chronic-closure` substrate
   provenance (`audit/retro-deferred-ledger.md §Structural lesson`), and the
   publish leg (owner hand).

5. **Version named — `5.1.0`** (owner-ratified 2026-06-24: "5.0 is fine" → stay in
   the 5.x line). The `/engine` subpath is additive and the `.` barrel is unchanged
   (the restructure is internal); the zero-adoption trims (`animate()`, the granular
   `load*` accessors) are recorded as removals, not used to force a major. See §S5.
   The publish leg is the owner hand. **No 6.0.0.**

No library or demo source is refactored in this wave.

---

## 2. Concrete work

### S1 — `proof:chronic-closure` re-pointed Q→R (fold #1, the gate tripwire)

**Breach.** `scripts/proof-chronic-closure.mjs:117` sets
`CHRONIC_LEDGER = path.join(REPO, "docs/tranches/Q/PROGRESS.md")` and `:493`
sets `LEDGER_LABEL = "Q/PROGRESS.md"`. The Q ledger's DM-7 row cites
`proof:keyframes-vue-published` as the closure oracle — a gate that was deleted
at R.W0 (`23a6867`). Running the gate today exits 1:

```
✗ [[C] DM-7 keyframes-vue 0.1.0 unpublished] sibling/historical band names
  `proof:keyframes-vue-published` as present but it does NOT resolve —
  a DANGLING reference.
```

(`audit/retro-deferred-ledger.md §Group 1`, `R.W0.md §2a`,
`proof-chronic-closure.mjs:550` success branch unreachable while this RED stands.)

**Cure (ONE atomic commit, the no-skip discipline).** In the same commit:

(a) Re-point `CHRONIC_LEDGER` from `docs/tranches/Q/PROGRESS.md` to
`docs/tranches/R/PROGRESS.md` (`:117`).

(b) Correct `LEDGER_LABEL` from `"Q/PROGRESS.md"` to `"R/PROGRESS.md"` (`:493`).

(c) Correct the success-branch console message (`:550`) to read `R ledger` instead
of `Q ledger`.

(d) Land any gate-code co-edits required by R-substrate shape differences (the
Q.WZ S1 protocol: teach the gate the R ledger's vocabulary before declaring GREEN
— no vacuous swap). The R `## Open deferrals` table in `PROGRESS.md` is authored
in the SAME flat-table shape the parser already accepts (`parseChronicTable`
`:199–225`): one flat table under an EXACT `## Open deferrals` heading, no `§N —`
prefix, no `### sub-section` splits. No parser change needed if the R substrate
honors the Q shape (it does, per PROGRESS.md as authored). Verify by running
`node scripts/proof-chronic-closure.mjs` against the R substrate.

(e) Re-state DM-7 in the R ledger as a KILL (owner-ratified, R.W0 `23a6867`)
with NO citing of the deleted `proof:keyframes-vue-published` gate — the KILL row
exits via the non-gate terminal mechanism "owner-ratified retraction, npm-unpublished,
packages/keyframes-vue/ deleted, all refs scrubbed" (the `KILL` band of the gate
already handles this: `BAND(a) => "KILL"` when `DISP.kill(a.disposition)` — no
runtime gate required for a KILL row). The dangling reference is excised.

**Non-vacuity protocol.** Before the clean R ledger greens the gate, plant THREE
malformed rows in `PROGRESS.md §"Open deferrals"` (exactly Q.WZ S1's procedure):

```
| RQ-PLANT-1 | R | 1 (R) | FOLD → R.W0 | R.W0 | `proof:boundary` |
```
→ must RED: `[runtime-band] FOLD row cites a source-shape gate`.

```
| RQ-PLANT-2 | R | 1 (R) | HANDOFF → value.js 9.0.0 | R.W8 | value.js 9.0.0 not on npm |
```
→ must RED: `[tripwire] HANDOFF targets an unpublished sibling version`.

```
| RQ-PLANT-3 | E (E..R) | 10 (E..R) | BOOK (future decide) | — | — |
```
→ must RED: `[p-invariant-28] ≥4-tranche row (chronicity 10) carries NO EXIT-shaped
disposition`.

Confirm all three RED, remove the planted rows, confirm GREEN on the clean R ledger.
Output: `✓ proof:chronic-closure — the R ledger is TERMINAL`. This is ONE atomic
commit (re-point + co-edits + non-vacuity proof + terminal R ledger).

**The EXPECTED coverage array update.** The R ledger carries the same DM-N chronic
identities as the Q ledger (DM-9 through DM-15) at their VERIFY-ONLY/RE-AFFIRM
dispositions. The `EXPECTED` array (`:507–514`) already greps these DM-N tokens; no
change required unless the R ledger renames any row. If R renames a chronic (e.g.
DM-24 N-Stage formally KILLED), replace its EXPECTED entry with a `KILL` coverage
token or drop it from the required-present set (a KILLED chronic is not "silently
dropped" — it is explicitly terminated; update the array accordingly).

---

### S2 — 10-item fold discharge (the P-inv-28 belt at R close)

The binding fold list is `audit/retro-deferred-ledger.md §Disposition summary`,
items 1–10. Each must reach a terminal verdict before R.W8 closes. Ownership:

**Item 1 — DM-7.** DISCHARGED by S1 above (KILL recorded, dangling gate excised).

**Item 2 — DM-1 S2 dock click-strand (8th carry, HARD STOP).**
Owned by R.W6. The 9 `pointerHandled`/`onPlayPointerDown` workaround sites
(`demo/@/components/custom/animation-controls/TransportDock.vue`, 9 live sites
re-counted in `audit/retro-deferred-ledger.md §Group 2`) must exit via ONE of:
- (A) The glass-ui-BC `DockDropdownTrigger` fix lands and the S2 kf delete fires
  atomically (`proof:workaround-deletion` S2 born-RED; flips GREEN); OR
- (B) The contingency KILL: a kf-internal ARIA/pointer-clean replacement is
  authored, the band-aid excised, `proof:workaround-deletion` S2 GREEN.

A 9th carry is a direct P-invariant-28 breach (the Q register said "NO 8th carry";
this IS the 8th carry — `audit/retro-deferred-ledger.md §Group 2`). R.W8 CANNOT
close with S2 PENDING. If R.W6's IMPL window passes without the BC cut landing,
R.W8 fires the contingency KILL before it closes. HARD STOP: no 9th carry under
any scenario.

**Item 3 — DM-5 S1 aria-orientation suppress (6th carry).**
`demo/spring/SpringSidebar.vue:43` `:aria-orientation="undefined"`. Owned by R.W6.
Same fork as S2: BC SFC-guard publish + kf delete, OR contingency kf-internal
ARIA-compliant replacement (KILL of the band-aid). `proof:workaround-deletion`
S1 must be GREEN at R.W8 close. No 7th carry.

**Item 4 — DM-24 N-Stage unshelf (about to cross the ≥4 belt).**
Owned by R.W5/R.W6. R must RULE: either (a) the BC cut lands, the ~3,500-LOC
`n-stage-impl` branch rebases off the 5.0.0 constellation pins, and unshelfs; or
(b) formal KILL (the mobile shelf-driver already shipped at Q.WC3 — the unshelf
may be redundant). Record the chosen verdict in the R ledger. A silent re-BOOK
is forbidden.

**Item 5 — DQ-3 value.js `contrast-color()` consume.**
value.js 1.2.0 shipped the `contrast-color` parser (FINAL.md:11); zero kf source
references it (`audit/retro-deferred-ledger.md §Group 3`). Owned by R.W4. Either:
- Author `proof:contrast-color-consume` + wire the resolve, OR
- Ratify a KILL with a reason (e.g. "browser support too narrow for the demo scope;
  the value.js parser is available but kf has no demo use-case for it at this time").
The WATCH status from Q is not a terminal; a reasoned KILL is. Record in the R
ledger.

**Item 6 — VJ-Q9 color-serialization consume-edge.**
The `color(display-p3 …)` serialization shape is the Q re-pin edge; no gate pins
the round-trip (`audit/retro-deferred-ledger.md §Group 3`). Owned by R.W3/R.W4.
Either author a consume-shape lock (assert kf parses the new form round-trip) or
record terminally. A "WATCH" that survives a close is an un-discharged deferral.

**Item 7 — DM-5 S8 FN_NAME cure (VERIFY-ONLY).**
`src/animation/utils.ts` still references `fnName`; value.js 1.2.0 shipped VJ-Q4
`.fnName`. Owned by R.W3. Confirm `proof:workaround-deletion` S8 is GREEN (not
PENDING) on the 1.2.0 dist. If it remains PENDING, fold the consume.

**Item 8 — ×8 VERIFY-ONLY chronics (DM-9…DM-15 + DM-8 Lighthouse).**
Re-run each gate on the R dist. Any RED revert is a NEW R regression wave:
- `proof:specular-absent-at-rest` (DM-9)
- `proof:font-census` (DM-10)
- `proof:spring-slider-continuous` + `proof:subject-animates` (DM-11)
- `proof:perf-frame-budget` (DM-12) — WITH SoA-processFrame + engine split
- `proof:engine-no-throw-on-play` (DM-13) — WITH NaN-guard interlock
- `proof:fsm-suspend-resume-live` (DM-14)
- `proof:control-surface-single-writer` (DM-15)
- `proof:lighthouse-mobile` (DM-8, `KF_REQUIRE_LH=1`)

These are NOT verified in the DEV spec — the R-dist build must exist before they
run. The R.W8 IMPL step verifies each and records the result in FINAL.md.

**Item 9 — Root-file deletions (clean tree).** DISCHARGED at R.W0 (the four
load-bearing files restored, two junk deletions committed). The tree is clean.
Confirm with `git status` at R.W8 entry. If any uncommitted deletion survives,
rule it (restore or commit) before authoring FINAL.md.

**Item 10 — DQ-5 ci-coverage re-verify.**
R.W0 edited the `proof:ci-coverage` roster (keyframes-vue removed). Confirm
`proof:ci-coverage` GREEN post-R.W0 + any roster changes made in R.W1–R.W7.
Re-run `node scripts/proof-ci-coverage.mjs`. If any new R gate was not wired into
CI, wire it before the close commit.

---

### S3 — Prompt-recap confirmed zero-dropped

Re-check `audit/retro-prompt-recap.md §6` verdict against the R-shipped tree:

- **The decomposition ask (DF-11, the chain's one PARTIAL):** `proof:decomposition`
  must exit GREEN on the R dist (R.W1 + R.W2 discharged the backlog). If it reds,
  R is not closed.
- **The keyframes-vue KILL (Q4 REVERSED):** recorded in FINAL.md §P-inv-28 register
  — the belt is explicitly closed as an owner KILL, not silently open.
- **The lint-tier open (M1 / Q.WA1):** the `.dependency-cruiser.cjs` restore at
  R.W0 re-affirms the M1 lint-tier ask; the dep-cruiser cycles will shrink as
  R.W1/R.W2 eliminate the 15 circular-import violations in
  `.dependency-cruiser-known-violations.json`. At R.W8 close, `npm run lint` must
  be GREEN (0 new violations above the known baseline, which itself shrinks with
  each cycle eliminated).
- **The 4 PARTIALs** (decomposition DF-11, 5.1.x cut P1, N-Stage N1,
  element-dependent CSS P3): each must reach a terminal verdict in R (not
  chain-trusted). Record in FINAL.md.

FINAL.md records the prompt-recap verdict: "zero DROPPED, zero PARTIAL outstanding"
OR lists any surviving PARTIAL with a named terminal disposition.

---

### S4 — FINAL.md authored

Path: `docs/tranches/R/FINAL.md`. Required sections:

1. **Version** — `@mkbabb/keyframes.js` **5.1.0** (owner-ratified; the publish leg is
   the owner hand).
2. **P-inv-28 register at R close** — per-item terminal record for every DM/DQ
   that rode to R: DM-1 S2 (8th carry HARD STOP — EXITED via [A] BC or [B] KILL),
   DM-5 S1 (6th carry EXITED), DM-7 (KILLED R.W0 — recorded), DM-24 (unshelved
   or KILLED — recorded), DM-5 S8 (VERIFIED or FOLDED), DQ-3 (consumed or KILLED),
   VJ-Q9 (locked or RECORDED). No row survives as a bare BOOK.
3. **Chronic ledger substrate provenance** — records that R.W8 re-pointed
   `CHRONIC_LEDGER` Q→R atomically, the non-vacuity protocol was run (three
   planted RED rows confirmed, then removed), and the gate exited GREEN. The entry
   cites `proof-chronic-closure.mjs:117,493` exact lines (so the next tranche
   locates them without a grep). Records that the M/O/P skip discipline was
   honored (not skipped again).
4. **The keyframes-vue KILL record** — explicitly closes the DM-7 P-inv-28 belt
   as an owner-ratified KILL (not a published exit); cites R.W0 commit `23a6867`
   and the `23a6867` commit message. This ensures the belt does not silently revert
   to "open" if a future tranche re-opens the question.
5. **VERIFY-ONLY re-verification results** — each of the ×8 chronics run on the R
   dist, gate name + exit code + any regressions found.
6. **Prompt-recap verdict** — the final zero-dropped / zero-partial-outstanding
   confirmation (or named residuals).
7. **Version cut + publish runbook** — the owner-hand steps: `npm version X.Y.Z`,
   `git tag vX.Y.Z`, `git push --tags`, `CI release.yml fires`. No source edits
   in the publish leg.

---

### S5 — Version named — **5.1.0 (owner-ratified 2026-06-24: "5.0 is fine")**

**The owner ruled: stay in the 5.x line — R is `5.1.0`.** A semver purist would call
the surface trims breaking; the owner waives a major for them because their real-world
impact is nil:

- **The headline is additive** — `@mkbabb/keyframes.js/engine` (R.W4) is a NEW `exports`
  entry; the `.` barrel's public surface is UNCHANGED (the directory restructure is
  internal, re-exported through the same barrel paths). That alone is a **minor**.
- **The removals are zero/near-zero-adoption trims the owner accepts within 5.x:** the
  `loadEngine`/`loadCompiler`/`loadIngest` collapse (4→1; **0 call sites**, the audit
  verified) and the **`animate()` excision** (R.W4, **0/32 adoption** — owner-directed
  "remove animate() in favor of our more idiomatic solutions"). They are recorded as
  removals in the `## 5.1.0` CHANGELOG entry (the no-wave-codes format), not used to
  force a 6.0.0.

So: **`5.1.0`** — the subpath "in" + the internal restructure as the minor; the dead-
surface trims (`animate()`, the granular `load*` accessors) noted as removals. The
`loadAnimationEngine()` + `warmEngine()` public accessors stay (they ARE the real surface).
The owner fires the tag (`npm version 5.1.0 && git tag v5.1.0 && git push --tags`); record
in FINAL.md §1. **No 6.0.0.**

---

## 3. The falsifiable born-RED gate

**Gate name:** `proof:chronic-closure` (existing gate, assertion change)

**What it asserts (after S1's re-point):** `CHRONIC_LEDGER` reads
`docs/tranches/R/PROGRESS.md §"Open deferrals"`; every row's closure oracle resolves
to an existing `package.json` script key that runs in the CORRECTNESS tier and is a
RUNTIME gate that BIT; every ≥4-tranche row carries an EXIT-shaped disposition;
every KILL/RECORD row exits without a runtime gate (correct per the `BAND()` logic);
and the ≥4-tranche coverage clause finds DM-9 through DM-15 present in the R ledger.

**Why it is RED today (the NON-VACUOUS plant test).** On `tranche-r-dev` at the
time of authoring, running the gate produces:

```
✗ [[C] DM-7 keyframes-vue 0.1.0 unpublished] sibling/historical band names
  `proof:keyframes-vue-published` as present but it does NOT resolve —
  a DANGLING reference.
✗ proof:chronic-closure — the chronic ledger is not closed to RUNTIME discipline
```

This RED is structural, not a flaky test. The cause is concrete and unique to the
R context: R.W0 deleted `scripts/proof-keyframes-vue-published.mjs` (the DM-7
closure oracle in the Q ledger) but `CHRONIC_LEDGER` still points at the Q ledger
(`proof-chronic-closure.mjs:117`). The Q ledger's DM-7 row cites the now-deleted
gate by name. The gate's RESOLVE assertion fails (rule 1: "every load-bearing cited
`proof:*` gate resolves to an authored `package.json` script key").

**How it goes GREEN only under the correct fix.** The gate goes GREEN when and only
when:
- `CHRONIC_LEDGER` is re-pointed to `docs/tranches/R/PROGRESS.md` (else the
  dangling reference persists);
- the R ledger's DM-7 row carries a KILL disposition with NO `proof:*` gate cited
  (the KILL band requires the non-gate terminal mechanism, not a resolving gate);
- AND every other R-ledger row satisfies the runtime-gate-that-BIT contract or
  its band-appropriate alternative.

A re-point that lands ONLY the path change (without the DM-7 KILL re-statement, or
without the R ledger's other rows being correctly formed) still RED. A re-point to
a malformed R ledger RED on the planted-rows protocol. The non-vacuity proof
(three planted rows confirmed RED before the clean ledger greens) ensures the gate
bites on the R substrate, not a vacuous swap.

**Assertion change vs new gate.** This is an existing gate (`proof:chronic-closure`
exists in `package.json`, runs in `proof:hygiene-chain`, CI-reachable). The
assertion change is:
- `CHRONIC_LEDGER`: `docs/tranches/Q/PROGRESS.md` → `docs/tranches/R/PROGRESS.md`
- `LEDGER_LABEL`: `"Q/PROGRESS.md"` → `"R/PROGRESS.md"`
- Console message `:550`: `Q ledger` → `R ledger`

The gate's CONTRACT (runtime-gate-that-BIT, ≥4-tranche EXIT-ONLY, no-vaporware-
HANDOFF, no-silent-drop coverage) is UNCHANGED. This is not a new gate — it is the
same meta-gate taught the R substrate's vocabulary, exactly as Q.WZ S1 taught it
the Q substrate's vocabulary.

---

## 4. Challenge-tempered cautions (R.md §2 overrides, relevant to R.W8)

- **P-inv-28 belt MUST BITE — no "ABSOLUTE FINAL" without a system-gate exit.**
  DM-1 S2 at the 8th carry is a HARD STOP (`audit/retro-deferred-ledger.md
  §P-inv-28 re-reckoning`): no close until S2 has either (A) the BC KILL or (B)
  the contingency kf-internal KILL. Referencing R.W6 as the owner is NOT a release
  valve — if R.W6 finishes without a terminal, R.W8 fires the contingency KILL
  directly. A 9th carry is a direct invariant breach; DM-1 entered R already past
  the belt.

- **DM-7 is an owner-ratified KILL, not a published exit.** The P-inv-28
  belt for DM-7 closed as a KILL (R.W0), not as a published `proof:*` gate. The
  KILL band in the gate (`DISP.kill(a.disposition)`) requires NO runtime gate —
  the non-gate terminal mechanism (npm-unpublish + delete + all-refs-scrubbed) IS
  the closure. Do not invent a `proof:keyframes-vue-retracted` gate to replace
  `proof:keyframes-vue-published`; the KILL row exits without a gate.

- **The re-point is ONE atomic commit.** The M/O/P re-points were all specced but
  NONE executed (`audit/retro-deferred-ledger.md §Structural lesson`; Q.WZ S1
  found the pointer TRIPLE-STALE). R.W8 must land the re-point + the co-edits +
  the non-vacuity proof + the terminal R ledger in ONE commit — not spread across
  the close to allow partial states.

- **The 3 gate co-edits with re-RED tests are R.W1's, not R.W8's.** R.W8 does NOT
  touch `proof-boundary.mjs` or `proof-engine.mjs`. Those gate co-edits
  (`R.md §2`: `isHeavyEngine` regex widen, `DYNAMIC_ACCESSORS` drop, engine.ts
  retarget) are R.W1 steps. R.W8 owns ONLY the chronic-closure re-point.

- **The simple keystone, not a meta-gate.** The `proof:chronic-closure` re-point
  is a two-constant edit + a non-vacuity protocol + an updated R ledger. Do not
  build governance machinery around it (rejected in R.W0 §4: "the keystone is the
  simplest possible gate fix").

- **Version DECIDED — `5.1.0`** (owner-ratified 2026-06-24: "5.0 is fine"). The
  earlier "6.0.0 vs 5.1.0" fork is closed: stay in the 5.x line; the subpath is
  additive, the restructure internal, the zero-adoption trims recorded as removals.
  See §S5.

---

## 5. Verification + DEV/IMPL boundary

**This spec is authored now (DEV phase).** IMPL opens on explicit authorization,
after R.W1–R.W7 gates are GREEN.

**R.W8 is IMPL-complete when all of the following hold:**

1. `node scripts/proof-chronic-closure.mjs` exits 0 — the R ledger is TERMINAL.
   The success output reads `R ledger` (not `Q ledger`). The non-vacuity protocol
   was run: three planted rows confirmed RED, then removed, then the clean ledger
   GREEN.

2. Every item in `PROGRESS.md §"Open deferrals"` carries a terminal verdict — no
   bare BOOK, no un-dispositioned carry, no surviving "WATCH."

3. `node scripts/proof-ci-coverage.mjs` exits 0 — the CI coverage roster reflects
   all R gates.

4. `npm run lint` exits 0 — `proof:lint-clean` GREEN (the dep-cruiser lint tier
   restored at R.W0 is green; known-violations baseline at or below the R.W1/R.W2
   post-carve floor).

5. `FINAL.md` exists at `docs/tranches/R/FINAL.md` with all 7 required sections
   populated.

6. `audit/retro-prompt-recap.md §6` verdict confirmed against the R-shipped tree:
   zero DROPPED, zero PARTIAL outstanding (or named residuals with terminal
   dispositions).

7. The ×8 VERIFY-ONLY chronics were re-run on the R dist and each result recorded
   in FINAL.md. Any RED revert that was not already a wave assignment is a NEW R
   regression — stop, wave-assign it, and close R only after it is GREEN.

**The DEV/IMPL boundary.** This spec names what IMPL does. The version cut and npm
publish are owner-hand (USER-DOMAIN): `npm version X.Y.Z && git tag vX.Y.Z &&
git push --tags` — then CI release.yml fires. No source edits in the publish leg.
