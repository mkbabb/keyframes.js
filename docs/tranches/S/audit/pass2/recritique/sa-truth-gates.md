# Re-critique (Pass-2 convergence) — S.A Truth & Gates (the keystone band)

**Agent:** re-critique · **Band:** S.A (S.A0–S.A5) · **Track:** gates
**Pass-1 score:** 58% · **Pass-1 blocking edits:** 10 (SA-1…SA-10) · **Probes:** p08, p12 (Pass-1 prototypes)
**Verdict:** all ten Pass-1 blocking edits are REALLY absorbed in the v3 band text (verified against
band lines, not merely the disposition table). The p12 recast survived intact: the keystone is
cause-shaped, the born-RED backlog is enumerated with named owning waves, and masking is explicitly
forbidden. The two Pass-1 residual design uncertainties (D4 keystone-ordering, D9 unvalidated
heuristic) are structurally resolved (green-modulo-backlog + Z3 full-green precondition; heuristic
DROPPED). **Convergence: 100%. Blocking: none.**

---

## 1. Pass-1 blocking-edit absorption — verified line by line

Every edit was checked against the v3 S.A band text (SPEC-v3:457-569) — not the §9 table's claim.

### SA-1 (D5, blocking #1) — strike "device-dependence plane"; recast rows 10/13 — ABSORBED ✅
- §2.1-2 recast, SPEC-v3:106-107: *"the red plane is DETERMINISTIC, not device-dependent (p12)."*
  SPEC-v3:130: *"True device-dependence render-races in the verified sample: **zero.**"*
- DM-11b=DM-13 one importmap fix, SPEC-v3:114-118: *"DM-13 `engine-no-throw-on-play` AND DM-11b
  `subject-animates` both ship a probe HTML mapping only bare `@mkbabb/value.js` … DM-11b's 30 s-timeout
  signature is a *swallowed* deterministic module-load throw, not a render race."*
- DM-14 spring defect, SPEC-v3:119-122: *"DM-14 … the spring scene does not pause … a real
  pause/resume-continuity defect, NOT a timing calibrate."*
- Fold row 10 (SPEC-v3:1321): *"the SAME importmap-subpath harness bug as row 12 … NOT 'fix or
  calibrate'."* Fold row 13 (SPEC-v3:1324): *"a GENUINE spring pause/resume-continuity source defect …
  NOT a timing calibrate — v1's row repeated the r8-F1 error verbatim."* The "device-dependence plane"
  narrative is gone from §2.1/§4. Real, not merely claimed.

### SA-2 (D8, blocking #2) — importmap fix scoped INTO S.A0 — ABSORBED ✅
- S.A0 item (4), SPEC-v3:465-470: *"**the shared importmap harness fix** — teach the vendor importmap
  the value.js subpath namespace … replicated across `scripts/proof-engine-no-throw-on-play.mjs` +
  `scripts/proof-subject-animates.mjs` (~10–20 LOC, ONE change ×2 — greens **both** DM-13 and DM-11b;
  this fix is a hard prerequisite of S.A0's own gate and lives HERE, not in a downstream row)."*
  Verbatim to the Pass-1 prescription; no longer parked only in fold-row 12.

### SA-3 (D1, blocking #3) — keystone gate cause-shaped, masking forbidden — ABSORBED ✅
- S.A0 gate, SPEC-v3:486-490: *"**Gate (cause-shaped, falsifiable both ways):** each blocking red is
  discharged by a **named cause verified against a locally-reproduced signature** … discharging via
  threshold-loosen, timeout-widen, residual `continue-on-error`, or observe-reclassification is
  FORBIDDEN (a discharge of that shape REDs)."* The outcome-shaped "gh run list shows green" of v1 is
  replaced. Cross-referenced by §7 T1 (SPEC-v3:1511-1514) and T11 (SPEC-v3:1556).

### SA-4 (D4, blocking #4) — keystone-ordering resolved; green-modulo-backlog — ABSORBED ✅
- Ownership split, S.A0 item (6), SPEC-v3:473-477: `cold-entry` + **DM-14** owned by A0.
- Enumerated backlog, SPEC-v3:479-482: *"`drag-gesture` → S.G3 · `easing-sidebar-minimal` → S.G2 ·
  `scene-perf-budget` A2 → S.G2 … `icon-paint-live` → S.G2"* — each authorized-RED under a **named**
  owning wave, NOT re-tiered.
- Re-scoped gate, SPEC-v3:488-492: *"the CI run's failing steps must be ⊆ the enumerated backlog set
  (any red outside the backlog REDs the keystone; a backlog row without a named owning wave REDs it) …
  Master push CI turns fully green when the last backlog row's owning wave closes — that full-green is
  re-asserted at S.Z3."*
- **The DAG contradiction is genuinely dissolved.** In v1 the keystone's own gate depended on
  downstream waves (S.A0→S.A4→S.D1→S.E1). In v3 S.A0 closes first with a *green-modulo-backlog* gate,
  the backlog rows are owned by S.G2/S.G3, and the full-green precondition is relocated to S.Z3
  (SPEC-v3:1285 `Z3 pre-gated on master-green at the FINAL SHA`). No circular edge remains. This is a
  structural fix, not a paper-over. D4 was Pass-1's residual design uncertainty — now RESOLVED.

### SA-5 (D6, blocking #5) — fourth S.A2 disposition bucket — ABSORBED ✅
- S.A2, SPEC-v3:511-514: *"**Per-gate dispositions use FOUR buckets:** genuine → FOLD by cause;
  absolute-threshold → relative budget; binary-absent → install-or-observe; **stale-gate → re-point
  the gate's parser/selector** (a green demo must not red on a gate's own obsolescence — the
  `demo-usability` class, p12)."*
- Hard clause "split will NOT green gate-bug reds", SPEC-v3:514-517. The concrete `demo-usability`
  instance is greened in S.A0 item (5), SPEC-v3:471-472 — consistent (demo-usability is one of the 14
  blocking reds A0 must discharge; it is NOT in the backlog, so A0 owns it).

### SA-6 (D2, blocking #6) — S.A1 substance clause — ABSORBED ✅
- S.A1, SPEC-v3:499-504: *"**Substance clause:** `proof:chronic-closure` currently *accepts*
  `VERIFY-ONLY`/`VERIFY-ONLY-TERMINATED` vocabulary (`scripts/proof-chronic-closure.mjs:64-86`) — the
  re-shaped gate REDs any `*-TERMINATED` row that does not cite a deterministic re-shaped gate or a
  ratified-KILL ledger row (a renamed verb alone REDs), and REDs any disposition containing deferral
  verbs (observe/watch/re-affirm/verify) without a paired re-shape/KILL row."*
- Re-derive-from-signature mandate, SPEC-v3:494-497. The DM-14 live-proof rationale carries via C-20
  (SPEC-v3:390-396). The bare rename → T3-laundering hole is closed.

### SA-7 (blocking #7) — drop the Linux/act apparatus — ABSORBED ✅
- S.A1, SPEC-v3:495-497: *"macOS reproduction IS the device-dependence discriminator — the 're-run on
  the REAL runner' and Linux-container/act apparatus are DROPPED, p12."* Also §6.1 Q12
  (SPEC-v3:1451-1453) and §8-19 per the table.

### SA-8 (D7, blocking #8) — full 5-artifact lockstep co-edit — ABSORBED ✅
- S.A4, SPEC-v3:528-541 enumerates all five, each verified against p08:
  (a) `package.json` **keep it a direct `&&` chain** (SPEC-v3:529-531) — the linchpin against a
  run-all delegator yielding an empty roster;
  (b) `proof-ci-coverage.mjs` EXCLUDED add + **clause-0b three-tier union at `:238-239`** (the
  airtightness linchpin — SPEC-v3:533-534);
  (c) `proof-gate-is-runtime.mjs` retarget + **membership-count non-vacuity floor** (SPEC-v3:535-537);
  (d) **`run-all.mjs:42` — the easily-missed third consumer** (SPEC-v3:538-539);
  (e) `gate-taxonomy.md` stale-row deletes (SPEC-v3:540-541).

### SA-9 (D3, blocking #9) — symmetric mis-tier clause — ABSORBED ✅
- S.A4, SPEC-v3:542-544: *"**The symmetric mis-tier clause (p08 §5.2, ~15 LOC):** a
  `proof:library-correctness` member's script must NOT carry browser-harness anchors — so 'a planted
  mis-tiered gate REDs' is falsifiable in BOTH directions (today only node-masquerading-as-DC is
  caught)."* Gate line SPEC-v3:560-561: *"a planted mis-tiered gate REDs **in both directions**."*
  Also elevated to a template mandate in §7 T1 (SPEC-v3:1511-1514).

### SA-10 (D9, blocking #10) — validate-or-drop the DOM-read heuristic — ABSORBED ✅
- S.A4, SPEC-v3:544-547: *"The 'post-actuation DOM-read heuristic' of v1 is **DROPPED** (no probe
  validated it; p08 kept the browser-harness-import anchor) — the reformed gate is the existing anchor
  + the symmetric inversion."* D9 (Pass-1's second residual design uncertainty) is closed by removal of
  the unproven mechanism.

**S.A5** was un-critiqued in Pass-1 (the one clean gate) and is unchanged in substance
(SPEC-v3:563-569) — `proof:claude-paths-live`, born-RED by construction. No absorption owed.

---

## 2. p12 recast integrity (the special charge) — SURVIVED INTACT

1. **Cause-shaped keystone** — S.A0's gate (SPEC-v3:486-490) requires each red discharged by *"a named
   cause verified against a locally-reproduced signature"*; the failing steps must be ⊆ the backlog.
   Not outcome-shaped. ✅
2. **Enumerated born-RED backlog** — SPEC-v3:479-482 lists all four backlog rows with their named
   owning waves (S.G2/S.G3), *"authorized-RED under named downstream waves, NOT re-tiered."* ✅
3. **Masking forbidden** — SPEC-v3:489-490 explicitly forbids threshold-loosen / timeout-widen /
   residual `continue-on-error` / observe-reclassification, each REDs the keystone. Re-stated as the
   T11 structural compensation (SPEC-v3:1556: *"the cause-shaped keystone with masking forbidden
   (S.A0)"*). ✅

The p12 defect-not-device recast is fully load-bearing across §2.1-2, fold rows 5/10/12/13, and
S.A0/A1/A2 — matching the §9 probe-absorption index (SPEC-v3:1798-1800).

---

## 3. Probe-adjustment fold check (p08, p12) — all folded

- **p08** grounded positives / adjustments beyond the blocking set are present: the ~54→single-digit
  FROZEN fold is cited to Q4/p04, *not re-asserted* (SPEC-v3:557-558 + fold row 70, SPEC-v3:1381); the
  `BORNRED_TRIPWIRES` clause-6 retarget for the `peer-satisfied` merge (SPEC-v3:554-556); no-staging /
  tier-count-agnostic (SPEC-v3:526-528); the 190→~138→~120 arithmetic (SPEC-v3:557).
- **p12** discriminator (macOS reproduction), the 11-gate taxonomy, the `demo-usability` false-positive
  cause (`router.ts` `name: s.id` vs literal-regex), the LoAF exit-decouple, the 159-member
  hygiene-chain (SPEC-v3:478), the PIN-LEDGER path `docs/tranches/Q/PIN-LEDGER.json` (SPEC-v3:462), and
  `MorphTarget.vue:71` (SPEC-v3:461) all appear verbatim. Zero p08/p12 adjustments dropped.

(The Pass-2 residual probes P2-1/P2-2 belong to bands S.D2/S.F3, not S.A — no S.A adjustments there.)

---

## 4. New-contradiction / mis-absorption / dropped-evidence sweep — NONE

- **Mis-absorption:** none. Every §9 sa-truth-gates row claim delivers in the band text (checked above).
- **New v3 contradiction:** none. The EN-a/EN-b hoist (C-25) lands in S.B3, untouched by S.A. The
  green-modulo-backlog re-scope makes S.A0→S.A3 (SPEC-v3:1276), S.A2's *"modulo S.A0's enumerated
  backlog"* gate (SPEC-v3:517-518), and S.A3's *"timing rides the keystone"* note (SPEC-v3:521-523)
  mutually consistent; the S.A0 DAG-circularity that Pass-1 flagged is removed, not reintroduced.
- **Dropped evidence:** none. Every Pass-1 grounded positive is carried.

---

## 5. Polish (non-blocking)

- S.A2's gate (SPEC-v3:517) is "green modulo S.A0's enumerated backlog" — it would read cleaner to
  state explicitly which backlog rows are demo-correctness-tier (blocking, gated by S.G2/S.G3) vs
  demo-device-observe-tier, so the reader can see demo-correctness cannot green until S.G closes. This
  is an impl-time tiering detail already implied by the shared backlog reference; not a defect.
- `icon-paint-live`'s conditional (SPEC-v3:481-482) — *"if the `::view-transition-*` residue KILL
  target is glass-ui-owned, that clause becomes a named HANDOFF"* — is a correct pre-booked
  decision-point-with-default (per scoring clarification (a)), not an open uncertainty.

---

## 6. Score

All 10 Pass-1 blocking edits verified absorbed in band text; the p12 recast survived intact; both
Pass-1 residual design uncertainties (D4, D9) structurally resolved; no mis-absorption, no new v3
contradiction, no dropped evidence. Empty blocking + every edit absorbed.

**Convergence: 100%. Band: converged.**
