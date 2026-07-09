# Critique — S.A Truth & Gates (the keystone band)

**Agent:** adversarial critique · **Band:** S.A (S.A0–S.A5) · **Track:** gates
**Probe evidence:** p08-gate-retaxonomy (confirms Q8) · p12-demo-gate-triage (adjusts Q12)
**Verdict:** the band is well-researched and p08 broadly confirms the re-taxonomy lands, but p12
**refutes the band's central causal model** (the "device-dependence plane") and the keystone gate is
**outcome-shaped, not cause-shaped** — it is satisfiable by the exact masking anti-pattern T1/r8-F1
condemn. Convergence **58%**.

---

## 1. What the probes ADJUSTED that SPEC-v1 has not absorbed (the load-bearing corrections)

SPEC-v1 predates p08/p12. Two facts in the spec are now falsified by reproduced signatures.

### 1.1 The "device-dependence plane" is REFUTED (p12) — the band's model is wrong

§2.1 point 2 (SPEC-v1:69-70) asserts: *"The rest is the device-dependence plane (LoAF exit-code
flake … 14 blocking demo-smoke gates …)."* Fold-table rows 5/10/11/13 inherit this. **p12 reproduced
every red it sampled on fast macOS** (p12:48-62): 11 gates verified, **true device-dependence
render-races = 0** (p12:139). The discriminator is decisive and cheap: a gate that reds identically
off the slow Linux runner is deterministic, full stop (p12:23). The 14 blocking reds are a
*fix-by-cause* surface — genuine source (2) + genuine demo/born-RED (5, incl. `cold-entry`,
`drag-gesture`, `easing-sidebar-minimal`, `scene-perf-budget`-A2, `icon-paint-live`, DM-14) + one
shared harness importmap bug (2 gates) + one gate-staleness false-positive (`demo-usability`) + the
LoAF exit-decouple (p12:139). **S.A0/S.A2 must be recast from "device-dependence reclassification" to
"fix-by-cause sweep."** This is not a mechanical row edit — it re-sizes the band (p12:181: "cheaper in
false-positives/harness than the spec assumes, and more expensive in genuine source/demo fixes").

### 1.2 The three named rows are mis-disposed (p12) — two are the r8-F1 mislabel, live

- **Row 12 DM-13** `engine-no-throw-on-play` = harness importmap subpath gap. ✅ as spec predicted
  (p12:86-91). The probe HTML maps only bare `@mkbabb/value.js`; the lazy engine chunk imports
  `@mkbabb/value.js/math` (value.js-O subpath split) → hard resolve failure in-browser (p12:89-91).
- **Row 10 DM-11b** `subject-animates` is **NOT** "fix or calibrate" the subject-write path — it is the
  **SAME** importmap bug seen through a second gate; the 30 s timeout is a *swallowed* deterministic
  module-load throw (`__kfReady` never runs → `waitForFunction` times out) (p12:93-94). DM-13 + DM-11b
  are the **only two** gates using the vendor importmap lib-probe; the blast radius is exactly two and
  they collapse to **one shared fix** (p12:94,167).
- **Row 13 DM-14** `fsm-suspend-resume-live` is **NOT** "timing calibrate" — it is a **genuine
  deterministic** spring pause/resume-continuity defect (`springPausedAfterClick=false`: the spring
  scene does not pause), reproducing at full macOS speed (p12:96-102). The spec's "timing calibrate"
  row *repeats the r8-F1 error verbatim* (p12:102): shipping a masking change (widen timeout) over a
  deterministic bug. The r8-F1 lesson is **live, not historical** (p12:159).

**These are direct hits on the critique charge "would THIS gate have caught the R residue" — DM-14
proves the spec's own pre-written disposition would have re-committed R's failure mode.**

---

## 2. Challenge-axis findings, wave by wave

### S.A0 — CI-GREEN in one convergent pass (THE KEYSTONE)

**Gate-honesty (axis 2) — FAIL. The keystone gate is outcome-shaped, not cause-shaped.** S.A0's gate
is *"`gh run list` shows a green push run"* (SPEC-v1:249-250). A green run is **satisfiable by
masking** — loosen a threshold, widen a timeout, or leave `continue-on-error` in place — which is
precisely the anti-pattern T1 (SPEC-v1:786) and p12:176-179 name as R's re-committed failure mode.
The keystone's oracle does not forbid the cheat it exists to prevent. It must be **cause-shaped**:
each of the 14 blocking reds discharged by a named cause verified against a locally-reproduced
signature, with masking (threshold-loosen / timeout-widen / continue-on-error) explicitly forbidden.
The substance lives in S.A2's "zero continue-on-error masking" — but S.A0's own gate text does not
inherit it, so as-written the keystone can close dishonestly. **-15.**

**Scope/DAG (axis 3) — the keystone cannot green first.** S.A0 lists only three fixes (2 source reds +
LoAF decouple) and then "drive the full chain to a verdict." But **CI-green requires greening ~6
genuine demo/source born-REDs** whose fixes are real behavioural work (DM-14 spring ≈½–1 day,
`cold-entry` resume-totality ≈½ day — p12:170-171) and whose *natural owning waves are DAG-downstream*
(spring → S.E; `cold-entry`/`drag-gesture` → S.D/S.E; `scene-perf-budget` → S.G). The DAG says
`S.A0 ──► S.A4 ──► S.D1 ──► S.E1` (SPEC-v1:586-591) — so S.A0's *own gate* depends on waves that
depend on S.A0. **The keystone cannot actually close first; the ordering is a fiction unless
resolved.** SPEC-v2 must either (a) expand S.A0 to own the fix-by-cause work explicitly (it is then a
multi-day wave, not "fix 2 reds"), or (b) declare the genuine demo born-REDs authorized-RED under
their downstream waves and re-scope S.A0's gate to "green **modulo the enumerated born-RED
backlog**." Splitting demo-smoke (S.A2) will **not** green them — they are correctness/gate-bug reds,
not device noise (p12:157). **-10 (unresolved design uncertainty).**

**Missing item — the importmap harness fix is not in S.A0.** grep of the spec confirms the importmap
fix appears **only** in fold-row 12 ("WAVE S.A1+S.A2") and Q12 — **never in S.A0's wave text**. Yet it
is a hard prerequisite for S.A0's gate (CI green): two gates fail on it deterministically (p12:167).
Assign the shared fix (importmap subpath namespace + serve the value.js `dist/` subtree, one change
replicated across `proof-engine-no-throw-on-play.mjs` + `proof-subject-animates.mjs`, ~10–20 LOC) to
S.A0. **-10.**

*Grounded positives:* the "159-member hygiene-chain" number is **accurate** (verified: hygiene-chain
= 159 members; 189 total proof keys). `.morph-ghost--from` (p12:106-110) and PIN-LEDGER staleness are
real, deterministic one-liners (PIN-LEDGER lives at `docs/tranches/Q/PIN-LEDGER.json` — S.A0 should
name the path). The LoAF exit-decouple is correctly diagnosed (green metric, red step — p12:130-137).

### S.A1 — Chronic ledger R→S + VERIFY-ONLY terminal-ization

**Gate-honesty (axis 2) — WEAK. The gate polices the verb, not the substance → laundering-prone.**
`proof:chronic-closure` **already exists** and its disposition vocabulary **already accepts**
`VERIFY-ONLY` *and* `VERIFY-ONLY-TERMINATED` (verified: scripts/proof-chronic-closure.mjs:64-86).
S.A1's new clause "REDs any row whose disposition is a bare re-verify verb" therefore only forces a
**rename** `VERIFY-ONLY → VERIFY-ONLY-TERMINATED` — which is T3 deferral-laundering (SPEC-v1:792) if
no real deterministic gate backs the terminal word. A row can read "VERIFY-ONLY-TERMINATED" while
pointing at nothing. DM-14 is the live proof: the spec pre-labeled it terminal ("timing calibrate")
yet it is a genuine open defect (p12:96-102). **S.A1 must (a) RED any `*-TERMINATED` row that does not
cite a deterministic re-shaped gate or a ratified KILL, and (b) mandate each terminal disposition be
re-derived from a reproduced signature — never inherit the spec's pre-written guess** (p12:159). As
written, S.A1 would stamp rows 10/13 terminal and ship the mislabel. **-15.**

**Prune (axis 6):** S.A1's "re-run DM-8…DM-15 on the REAL runner" and Q12's "Linux-shaped
environment (container/act)" are unnecessary ceremony. p12 shows local macOS reproduction IS the
device-dependence discriminator (p12:23,48); no Linux/act apparatus is needed. Drop it.

### S.A2 — Device-dependence exits via a system

**Missing item (axis 5) — no bucket for gate-staleness.** S.A2's per-gate triad is
"genuine → FOLD; absolute-threshold → relative budget; binary-absent → install-or-observe"
(SPEC-v1:263-264). p12 found a **fourth class the model does not name**: `demo-usability` is a
**false positive** — `router.ts:23-31` generates routes as `name: s.id` (a computed expression) while
`proof-demo-usability.mjs:75` scans for string literals `/\bname:\s*"([^"]+)"/g`, finds zero, and
declares all 9 scenes UNROUTED over a correctly-routed demo (p12:125). Add: **stale-gate → re-point
the gate's parser/selector; a green demo must not red on a gate's own obsolescence** (p12:157).
Splitting demo-smoke into correctness/observe will NOT green this — it is a gate bug, not device
noise. **-10.**

*Note:* S.A2's core moves (demo-correctness/demo-device-observe split; the ~50-gate shared-chromium
net-deletion; ban numeric `waitForTimeout`) are sound and confirmed idiomatic-gestalt, not band-aids —
the net-deletion is the transposition the charter demands. The split's *premise* ("device-dependence")
is wrong (§1.1), but the split's *mechanism* survives; it simply carries fewer gates than the spec
assumes.

### S.A3 — Deploy-of-record revived

Not probe-tested. Inherits the S.A0/S.A2 DAG contradiction: S.A3's gate ("one auto-path deploy run
`success` … demo-correctness green") cannot fire until demo-correctness is green, which — given the
genuine born-REDs owned by S.D/S.E/S.G — is late in the tranche, not after A2. Flag: the auto-deploy
revival is real, but its *timing* rides the resolution of the S.A0 keystone-ordering question.

### S.A4 — Gate-roster diet + 54-gate migration (Q8: p08 confirms)

**Gate-honesty (axis 2) — the reformed `proof:gate-is-runtime` catches only ONE mis-tier direction.**
S.A4's gate says "a planted mis-tiered gate REDs" (SPEC-v1:279-280). p08 proves this is **half-true as
specified**: a node gate posing as demo-correctness reds (`missingHarnessAnchors`, verified present at
scripts/proof-gate-is-runtime.mjs:59,189-192), but a **browser gate mis-filed into
library-correctness → no gate catches it** (p08:105-115). Q8's success bar is not met without a
**symmetric clause**: an LC member's script must NOT carry browser-harness anchors (~15 LOC,
p08:284-288). Without it the born-RED oracle is unfalsifiable in the dangerous-reverse direction. **-15.**

**Missing item (axis 5) — the co-edit set and airtightness linchpin are unstated.** p08 enumerates a
**5-artifact lockstep edit** the spec does not name (p08:268-291), two points of which are load-bearing
and *verified*: (a) `run-all.mjs:42` hardcodes `["proof:correctness","proof:hygiene"]` — **the
easily-missed third consumer**; if not updated, `proof:all` silently stops scheduling two tiers
(verified: the literal is exactly as p08 reports); (b) `proof-ci-coverage.mjs:238-239` clause-0b tier
union — **the airtightness linchpin**; omit it and all 39 LC gates red as `ciOnly` (p08:62). Plus the
hard constraint: **`proof:demo-correctness` MUST stay a direct `&&` chain** (verified:
`proof:correctness` is a direct `&&` chain today at package.json:234), because gate-is-runtime regex-
matches the raw tier string with no `resolveTier` indirection — a run-all delegator yields an empty
roster → RED (p08:89-94,289-291). **-10.**

**Open design question (axis 1) — the "post-actuation DOM-read heuristic" is unvalidated.** S.A4
mandates "upgrade `proof:gate-is-runtime` (post-actuation DOM-read heuristic …)" (SPEC-v1:277-278).
**No probe tested this**, and p08 explicitly **kept the existing browser-harness-import anchor** and
added a symmetric inversion — it did not validate a DOM-read heuristic (verified: the gate anchors on
`missingHarnessAnchors`, the lib-lifecycle import, not a DOM-read). S.A4 smuggles an unproven
mechanism. Either cite validating evidence or specify the upgrade as the existing anchor + the
symmetric clause. **-10.**

*Grounded positives:* p08 **confirms** Q8's FAILURE condition is NOT triggered — the 15-clause model
is tier-count-agnostic; no staging needed (p08:258-266). The 190→~120 arithmetic checks out
(p08:117-124). The morph-triple / emerging-css-triple merges are safe; the constellation fold is the
only merge touching a born-RED tripwire (`BORNRED_TRIPWIRES` at ci-coverage clause 6 — retarget it).
Recorded-future: the ~54→single-digit FROZEN fold is the load-bearing half of the ~120 headline and is
tested by **Q4/p04, not p08** (p08:318) — S.A4 should cite that dependency, not re-assert the count.

### S.A5 — Doc-authority restoration, gate-first

Not probe-tested, and it needs none. `proof:claude-paths-live` (every backtick path/symbol resolves
on disk / in the built surface; HEAVY export list ⊆ AnimationEngine keys) is **falsifiable, runtime-
honest, and born-RED by construction** — the one clean gate in the band. C-8's gate-first/regen-last
ruling is idiomatic (R.W0's keystone pattern applied to docs). No deduction.

---

## 3. Idiomatic-gestalt check (axis 1) — no band-aids smuggled

The band's *moves* are transpositions, not patches: the three-tier taxonomy replaces a harness-defined
misnomer (not a rename-over); the harness net-deletion is a structural consolidation; the doc-drift
gate makes drift structural. The one place a band-aid **is** smuggled is **inherited from the spec's
wrong model, not the wave design**: rows 10/13's "calibrate" dispositions are masking changes over
deterministic bugs (§1.2). Fixing the model (blocking #1) removes the smuggle.

---

## 4. Deduction ledger

| # | Issue | Axis | Δ |
|---|-------|------|---|
| D1 | S.A0 keystone gate outcome-shaped → masking-satisfiable | gate honesty | −15 |
| D2 | S.A1 gate polices the verb not substance → laundering-prone (DM-14 live proof) | gate honesty | −15 |
| D3 | S.A4 reformed gate catches only one mis-tier direction (Q8 half-unfalsifiable) | gate honesty | −15 |
| D4 | S.A0 keystone-ordering DAG contradiction (green depends on downstream waves) | design uncertainty | −10 |
| D5 | §2.1-pt2/rows-10/13 causal model refuted → non-mechanical re-sizing of S.A0/A2 | probe adjustment | −10 |
| D6 | S.A2 missing gate-staleness disposition bucket | missing item | −10 |
| D7 | S.A4 missing 5-artifact co-edit set + direct-&&-chain constraint | missing item | −10 |
| D8 | Importmap harness fix not scoped into S.A0 (its own gate's prerequisite) | missing item | −10 |
| D9 | S.A4 "post-actuation DOM-read heuristic" unvalidated | open design question | −10 |

Overlapping severity is consolidated; several deductions become **mechanical blocking edits** (§5)
that, once applied, close the gap — but D4 (keystone ordering) and D9 (unvalidated heuristic) are
**residual design uncertainties** and D5 is a **non-mechanical re-sizing**, which cap convergence
below the "implementable-as-written" bar. **Convergence: 58%.**

---

## 5. Blocking edits for SPEC-v2 (must land before impl authorization)

1. Rewrite §2.1 point 2 + fold rows 10/13: strike "the rest is the device-dependence plane"; DM-11b =
   the SAME importmap-subpath harness bug as DM-13 (one shared fix), DM-14 = a genuine spring
   pause/resume source defect (not "timing calibrate"); device-dependence render-races were 0/11 in
   the reproduced sample (p12:112-153).
2. Add the value.js-subpath importmap harness fix (shared across `proof-engine-no-throw-on-play.mjs` +
   `proof-subject-animates.mjs`) as an explicit S.A0 item — it is the prerequisite for S.A0's own
   CI-green gate yet appears only in fold-row 12 (p12:86-94,167).
3. Make S.A0's born-RED gate cause-shaped: require each of the 14 blocking reds discharged by a named
   cause verified against a locally-reproduced signature, and forbid closing via loosened thresholds /
   widened timeouts / residual continue-on-error (p12:176-179; T1).
4. Resolve the keystone-ordering contradiction: enumerate which genuine demo/source born-REDs
   (`cold-entry`, `drag-gesture`, `easing-sidebar-minimal`, `scene-perf-budget`-A2, `icon-paint-live`,
   DM-14) S.A0 owns vs. which stay authorized-RED under S.D/S.E/S.G, and re-scope S.A0's gate to "green
   modulo the enumerated born-RED backlog" so the keystone can actually close first (p12:170-174).
5. Add a fourth S.A2 disposition bucket — "gate-staleness → re-point the gate's parser/selector" —
   covering `demo-usability`'s literal-name regex vs the generated `name: s.id` routes; note that the
   demo-smoke split will NOT green correctness/gate-bug reds (p12:125,157).
6. Give S.A1 a substance clause: `proof:chronic-closure` must RED any `*-TERMINATED` row that cites no
   deterministic re-shaped gate/ratified KILL (the existing vocabulary already accepts VERIFY-ONLY at
   scripts/proof-chronic-closure.mjs:64-86), and mandate each terminal disposition be re-derived from a
   reproduced signature — never inheriting the spec's guess (p12:159).
7. Drop S.A1's "re-run on the REAL runner" and Q12's "Linux-shaped environment (container/act)"
   requirement — local macOS reproduction IS the device-dependence discriminator (p12:23,48).
8. Expand S.A4 with the full lockstep co-edit set: `package.json` (keep `proof:demo-correctness` a
   DIRECT `&&` chain), `proof-ci-coverage.mjs` EXCLUDED add + the clause-0b three-tier union (:238-239,
   the airtightness linchpin), `proof-gate-is-runtime.mjs` roster retarget + membership-count floor,
   `run-all.mjs:42` (the easily-missed third consumer), and `gate-taxonomy.md` stale-row deletes
   (p08:57-104,268-291).
9. Add the symmetric mis-tier clause to S.A4's reformed `proof:gate-is-runtime` (a library-correctness
   member must NOT carry browser-harness anchors) so Q8's "planted mis-tiered gate REDs" is falsifiable
   in both directions (p08:105-115,284-288).
10. Validate or drop S.A4's "post-actuation DOM-read heuristic" upgrade — no probe tested it; p08 kept
    the existing browser-harness-import anchor — so cite evidence or re-specify as anchor + symmetric
    clause (p08:79-95).

---

## 6. Prune / recorded-future

- **Prune** the "device-dependence plane" narrative language throughout §2.1/§4 and the "calibrate"
  verbs in rows 10/11/13 (replaced by fix-by-cause dispositions).
- **Prune** the Linux-container/act apparatus from S.A1/Q12 (blocking #7).
- **Record-future** (do not re-assert in S.A4): the ~54→single-digit FROZEN-fold count is validated by
  Q4/p04, not p08 — S.A4 cites the dependency; the ~120 headline is contingent on the S.D partition
  surviving migration (p08:318).
