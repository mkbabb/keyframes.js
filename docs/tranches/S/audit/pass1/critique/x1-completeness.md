# Critique x1 — Cross-cutting completeness

**Agent:** x1-completeness (adversarial) · **Scored:** SPEC-v1.md whole-spec against the owner
directive, element by element · **Date:** 2026-07-02 · **Mode:** analysis only (no source/test/git
touched).

**Verdict:** SPEC-v1 is *substantively complete* — all 5 critical audit findings folded, the r8 §6
ledger covered row-by-row, and every owner-directive axis (challenge-R, layout aggression, no-legacy,
glass-ui 5.0.0 awareness, SOTA both repos, scene-switcher tranche-set, prompt-recap, dev-only) has a
present, idiomatic home. But the §4 fold table's own load-bearing claim — *"Every open item from r8
§6 + the audit lanes. No un-dispositioned rows"* — is **falsified in three places**, and one Q
deferral cohort (DQ-4/5/6/7) is dropped entirely. Because this critique's charge IS completeness, the
falsified totality claim is scored, not waved.

**convergence_pct: 82.**

---

## 1. Element-by-element score against the owner directive

| Directive axis | Present? | Home | Assessment |
|---|---|---|---|
| Challenge/refine R | ✅ | C-14 per-wave REWRITE/REFINE; §2.1 credits R honestly + names residue | Idiomatic. Not a rubber-stamp; not a re-litigation. |
| Library + demo layout aggression | ✅ | S.B (lib sub-zone) + S.D (demo gestalt) + REWRITE-default for structure waves (C-14) | Aggressive and census-backed (T9 overturns R's "do-not-touch" fiat). |
| NO-legacy totality | ⚠️ | S.C1–C4 (animate.ts, no-silent-fallback teeth, dead deps, stale narration) + T6 | Strong, but see §3.1 — the shadcn purge names only `ui/menubar`; no census that it is the *only* shadcn island. |
| glass-ui 5.0.0 awareness | ✅ | C-12, S.E6, T12; §1 "glass-ui 5.0.0 does not exist yet" | Best-handled axis. Tilde-never-caret, consume-edge specified-fires-later, structured-HANDOFF exit. |
| SOTA both repos | ✅ | kf: S.F (VT/SplitText/@starting-style/animation-trigger, r5) · parse-that: S.H (packrat-arming/1.0.0-cut/Pratt, r6) | Complete for the two in-scope repos. value.js is deliberately consume+dispatch only (row 46) — consistent with "both repos" = kf + parse-that. Flag §3.4. |
| Scene-switcher tranche-set | ✅ | Band S.E (6 waves), C-7 DM-24 REVIVED, r7 salvage, three absolute guardrails | The oldest ask, given a real multi-wave band with live-verified acceptance gates. |
| Chronic fold TOTAL (§4 vs r8) | ⚠️ | §4 fold table (70 rows) | r8 §6 fully covered; **but r8-F2's DQ-4/5/6/7 dropped; a12's KfPillTabs absent from the table** (§2). |
| Prompt-recap plan | ✅ | §5 + S.Z1 born-RED `proof:prompt-recap-s`; charter-precept→band mapping clause; mid-S-ask append rule; the spirit column | Total and gated. Re-verify-not-chain-trust discipline present. |
| Dev-only boundary | ✅ | §1 "Not implementation"; T4; every wave ships born-RED/born-SPECIFIED; "CLOSED only on re-run green" | Held honestly. No wave smuggles an impl step. |

---

## 2. The fold-table completeness cross-check (§4 vs r8 §6, row-by-row)

**r8 §6 consolidated table — every row's coverage in §4:**

| r8 §6 item | §4 row | ✓/✗ |
|---|---|---|
| Master CI red since K | 1 (S.A0) | ✓ |
| styling-idioms orphan `.morph-ghost--from` | 2 (S.A0) | ✓ |
| LoAF bench exit-code flake | 4 (S.A0/A2) | ✓ |
| 14 demo-smoke blocking gates | 5 (S.A2) | ✓ |
| DM-11b subject-animates | 10 | ✓ |
| DM-13 engine-no-throw | 12 | ✓ |
| DM-14 fsm-suspend-resume | 13 | ✓ |
| DM-12 perf-frame-budget | 11 | ✓ |
| DM-8 lighthouse | 6 | ✓ |
| DM-9 / DM-10 / DM-11a / DM-15 | 7 / 8 / 9 / 14 | ✓ |
| DM-5 S8 FN_NAME | 15 | ✓ |
| glass-ui aria-ask / peer-satisfied | 51 / 52 | ✓ |
| DQ-1 packrat / DQ-2 dead-API | 47 / 48 | ✓ |
| Auto-deploy DM-20 | 16 | ✓ |
| 6 colorTail benches | 42 | ✓ |
| color2Into cross-repo WATCH | 46 | ✓ |
| 189-gate roster granularity | 20 + 70 | ✓ |

The **r8 §6 table is fully absorbed.** The completeness failures are one level deeper, in what §4
claims to also cover ("+ the audit lanes") and in r8's *sub-findings* (r8-F2):

### 2.1 DROPPED: DQ-4/5/6/7 — un-dispositioned anywhere (true drop) — BLOCKING

r8-F2 (r8:120-125, DIGEST:509) states: *"R folded DQ-3/VJ-Q9 but DQ-1, DQ-2, **DQ-4, DQ-5, DQ-6,
DQ-7 do NOT appear as R rows** … S should confirm each landed."* The spec folds DQ-1 (row 47) and
DQ-2 (row 48) — exactly the two r8-F2 named as SOTA-parsing-feeding — but **DQ-4 (false-RED S1/S2),
DQ-5 (ci-coverage), DQ-6 (emerging-CSS-P2), DQ-7 (wave-charter) appear nowhere in SPEC-v1** (grep of
`SPEC-v1.md` for `DQ-4|DQ-5|DQ-6|DQ-7|false-RED|wave-charter|emerging-CSS-P2` → zero hits). The §4
header's "No un-dispositioned rows" is false for these four. They are plausibly closed-in-Q, but the
charter's own bar (S folds *every* open deferral) demands at minimum a one-line disposition
("assumed FOLD-LANDED in Q; S.Z1 recap re-verifies landing") — the same treatment DQ-1/DQ-2 got.
**This is a genuine completeness hole, not a table-hygiene nit.** (−10)

### 2.2 ABSENT FROM TABLE: KfPillTabs keyboard-broken (a12 F1, HIGH) — BLOCKING

The task named this as a NEW debt to check. It **is** dispositioned in *waves* — S.B7
(SPEC:356-357: `KfPillTabs.test.ts + the interaction-axis fixes (arrow-moves-focus, keyup actuation,
press-origin guard) … a12 F1–F3`) and S.E5 (SPEC:460-462) — but it has **no §4 fold-table row.**
a12 F1 is HIGH severity (DIGEST:946: *"roving-tabindex moves selection but never moves focus —
keyboard traversal collapses after one hop … a 3rd tab is unreachable by keyboard"*), and a12 F2
(TransportDock keydown rapid-toggle on auto-repeat) is the sibling. The §4 table lists DM-5 S8
source-probe (row 15) but not the live keyboard *defect* the DM-1/DM-5 KILLs *spawned*. Because §4
claims to be the tranche's terminal disposition ledger, a HIGH defect present only in prose-waves but
absent from the ledger is exactly the "gate-follows-code / co-edit every naming" class T7 condemns.
Add row: **"KfPillTabs roving-tabindex keyboard-broken + TransportDock auto-repeat (a12 F1/F2) →
S.B7 (tests+fix) + S.E5 (promote)."** (−5; planned in waves, so half-weight.)

### 2.3 The "open item" scope is unstated (honesty nit) — non-blocking

§4 omits r8 §1a's five *already-ratified-terminal* R rows (DM-7, DM-1, DM-5 S1, DQ-3, VJ-Q9). That
is defensible — they are closed KILL/RECORD, not open — but the header says "Every open item" without
defining "open" as "open-at-R-close." One sentence ("closed-terminal R rows excluded by definition;
see r8 §1a") makes the totality claim auditable rather than trust-me. Cross-checked and clean
otherwise: all 5 critical audit findings (gate-shaped-not-runtime, LIBRARY_CEILING_OVERRIDE,
no-green-CI, src/animation/CLAUDE.md, pin-ledger RED) are folded (T1/S.A4; row 32/S.B5; row 1; row
41; row 3).

---

## 3. The eight named NEW debts — fold-table coverage

| NEW debt (Pass-1 surfaced) | Lane | §4 row | In a wave? | Status |
|---|---|---|---|---|
| waapi-densify stale types | a15 | **39** | S.B7 | ✅ folded |
| orphaned proof:scene-switcher-mobile gate | a23 | **18** | S.A4 + S.E4/E5 | ✅ folded (retire+reborn) |
| pin-ledger RED | a31 | **3** | S.A0 + C-4/S.C4 | ✅ folded |
| KfPillTabs keyboard-broken | a12 | **— MISSING —** | S.B7 + S.E5 | ⚠️ in waves, absent from table (§2.2) |
| mobile-sheet systemic | design | **66** | S.G1 | ✅ folded (one contract) |
| CLAUDE.md authority inversion | a30 | **41** | S.A5 + S.B8 | ✅ folded (gate-first C-8) |
| 5-scene zero-test-coverage | a25 | **40** | S.B7 | ✅ folded |
| resolve/ unbenched | a26 | **45** | S.F5 | ✅ folded |

**7 of 8 have fold rows; KfPillTabs is the lone omission** — and it is the highest-severity of the
eight. This is the single most concrete completeness defect and confirms the task's suspicion.

### 3.1 No-legacy totality — one census gap

S.C3 deletes `ui/menubar/` (16 files) + `utils.ts(cn)` as *the* shadcn island. No importer census
proves menubar is the *only* shadcn scaffold (T9's own principle: census before a totality claim).
If other `ui/*` shadcn primitives survive, "NO legacy anywhere" is unmet. Cheap SPEC-v2 addition:
S.C3 gate clause = a repo-wide grep for shadcn-idiom markers (the `cn(` util, `class-variance-
authority`, `@radix-*`) returns empty post-purge, not just menubar-absent.

### 3.4 value.js SOTA — confirm the "both repos" reading

"SOTA both repos" is served for kf + parse-that. value.js gets only consume (row 55 pin) + dispatch
(row 46 color2Into WATCH, VJS_PARAM_BUG row 61). If the owner meant the full constellation (3 repos),
there is no value.js SOTA lane and that is a −10 open question. If "both" literally = the two SOTA
research lanes (r5 kf, r6 parse-that), the spec is complete. **Flag for owner confirmation; no
deduction taken pending the ruling** (the r5/r6 lane structure supports the two-repo reading).

---

## 4. Probe adjustments the spec must absorb (cross-cutting)

p08 (Q8, gate re-taxonomy — the load-bearing evidence for S.A4's 190→~120 completeness claim)
returned **confirms-spec** but with three adjustments SPEC-v1 predates (p08:268-291). These belong
primarily to the sa-truth-gates band, but they bear on *this* band because S.A4's roster diet is the
mechanism that makes the whole fold-table→gate migration land:

1. p08 §5.1 — S.A4's gate line must name the **5-artifact atomic co-edit set** (package.json,
   proof-ci-coverage.mjs `:141-192`+`:238-239`, proof-gate-is-runtime.mjs `:82`/`:108`/`:248`,
   run-all.mjs `:42`, gate-taxonomy.md). SPEC-v1 says "reformed proof:gate-is-runtime" without the
   lockstep set — the clause-0b third-tier union is the airtightness linchpin (p08:74, p08:311).
2. p08 §5.2 — a **symmetric mis-tier clause** (a library-correctness member must NOT carry
   browser-harness anchors) is required to fully satisfy S.A4's "planted mis-tiered gate REDs" — today
   only the node-masquerading-as-DC direction is caught (p08:107-115).
3. p08 §5.3 — `proof:demo-correctness` MUST stay a direct `&&` chain (gate-is-runtime has no
   resolveTier indirection) — a hard manifest-design constraint (p08:89-94).

All three are **mechanically absorbable** into S.A4's gate line (no design uncertainty) → no
convergence deduction, but they are SPEC-v2 edits the completeness of the roster-diet claim depends on.

---

## 5. What is complete and should NOT be padded (prune / no-change)

- **§5 prompt-recap** is total as written — the charter-precept→band mapping clause (§5.3) and the
  mid-S-ask append rule (§5.4) close the two ways a recap leaks. Do not expand.
- **Dev-only boundary** needs no reinforcement — T4 + per-wave born-RED is airtight.
- The **already-terminal R KILLs** (DM-7/DM-1/DM-5S1/DQ-3/VJ-Q9) should NOT be re-added as fold rows
  (that would re-litigate settled KILLs — a §2.3 scope-note is the correct fix, not rows).
- Do not add a value.js SOTA band speculatively — resolve §3.4 by owner ruling first.

---

## 6. Deductions ledger

| # | Deduction | Class | Points |
|---|---|---|---|
| 1 | DQ-4/5/6/7 un-dispositioned anywhere (r8-F2 flagged; §4 "no un-dispositioned rows" false) | missing evidence-demanded item (true drop) | −10 |
| 2 | KfPillTabs a12 F1/F2 (HIGH) absent from §4 fold table (present in waves) | fold-table totality claim falsified | −5 |
| 3 | §4 "open item" scope undefined (totality claim un-auditable) | honesty nit | −3 |
| — | value.js SOTA absence | open question, pending owner reading | 0 (flagged) |
| — | no-legacy shadcn census gap (§3.1) | absorbable gate-clause add | 0 (folded into blocking) |

**100 − 10 − 5 − 3 = 82.**

---

## 7. BLOCKING edits for SPEC-v2 (must land before impl authorization)

1. Add §4 fold row: **KfPillTabs roving-tabindex keyboard-broken + TransportDock auto-repeat (a12
   F1/F2, HIGH) → S.B7 (KfPillTabs.test.ts + arrow-moves-focus/keyup-actuation/press-origin fixes) +
   S.E5 (promote to tested panel primitive)** — so the fold table's "every open item" holds.
2. Add §4 fold row (or one-line disposition): **DQ-4 (false-RED S1/S2), DQ-5 (ci-coverage), DQ-6
   (emerging-CSS-P2), DQ-7 (wave-charter) — assumed FOLD-LANDED in Q; S.Z1 recap re-verifies each
   landed** — closing r8-F2 totally, not just DQ-1/DQ-2.
3. Add a §4-header sentence defining "open item" as "open-at-R-close; the five already-ratified R
   KILL/RECORD terminals (r8 §1a) are excluded by definition" — makes the totality claim auditable.
4. S.C3: add a shadcn-census gate clause (repo-wide grep for `cn(`/`class-variance-authority`/
   `@radix-*` returns empty post-purge) so "NO legacy anywhere" is proven, not menubar-scoped (T9).
5. S.A4 gate line: absorb p08's three confirmed adjustments — name the 5-artifact atomic co-edit set
   (esp. the proof-ci-coverage.mjs:238-239 third-tier union), add the symmetric mis-tier clause,
   pin `proof:demo-correctness` as a direct `&&` chain.
6. Resolve the "SOTA both repos" reading by owner ruling (kf+parse-that vs full constellation); if the
   latter, a value.js SOTA lane is a missing band (−10 latent).
