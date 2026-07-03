# Re-critique (Pass-2) — Band S.H (parse-that dispatch)

**Agent:** re-critique / convergence check · **Band:** S.H · **Date:** 2026-07-02
**Inputs:** Pass-1 critique (`pass1/critique/sh-parse-that.md`, 5 deductions → 7 tabled edits
SH-1..SH-7), probe p11 (`pass1/prototypes/p11-packrat-arming.md`), SPEC-v3 band + rulings +
residue + DAG + §9 disposition tables. **Pass-2 residual probes** (p2-1 demo carve, p2-2
starting-style) do NOT touch S.H — no Pass-2 fold owed to this band.

**Verdict: 100% converged. blocking = ∅. All 7 Pass-1 edits verified absorbed in v3 band text.**

---

## 1. Per-edit absorption verification (quoting v3 band text, not the table)

### SH-1 / D1 (−15) — chain() semantics UNFALSIFIABLE — **ABSORBED (real)**
Pass-1's sharpest finding: v1 shipped Option B's shape (`!state.isError || chainError`, resurrecting
a live continue-on-error path) with Option A's risk claim and a gate testing neither.
v3 RULES **Option A** and dissolves the concern by *removing* the untested path entirely:
- C-16 (line 361-368): *"fix only the falsy-seed bug — `if (state.isError) return state; return
  fn(state.value).parser(state);` — and **retire the now-moot `chainError` param in the same 1.0.0
  breaking cut**"*, gate = *"the `0`/`''`/`false`-seed regression test (red-then-green) + a
  genuine-error short-circuit test + the recorded 0-hit caller scan."*
- S.H2 (line 1180-1185) carries the identical fix + retirement + the three-part regression suite.

The critique's exact objection ("the gate cannot falsify the change it ships") is eliminated:
Option A ships NO `chainError=true`-on-error path, so there is nothing untested left. The gate now
falsifies precisely what it ships (falsy-seed threading + genuine-error short-circuit). Clean.

### SH-2 / D2 (−10) — probe-mandated type ripple — **ABSORBED (real)**
S.H1 (line 1167-1169): *"`packratEnter(): PackratEpoch | null` (or a shared sentinel);
`packratExit(saved)` null-guards; `resetPackrat()` (`packrat.ts:230`) early-returns when unarmed
(decided: yes, for symmetry)."* All three p11-§4-ref-3 surfaces present, incl. the `resetPackrat`
decision the critique demanded be *decided* (ruled: early-return). Line-number nit (:230 vs the
critique's :231) is immaterial — p11 itself cites both.

### SH-3 (gate process-isolation, non-deducted obs → mandated edit) — **ABSORBED (real)**
S.H1 (line 1170-1174): *"**Gate isolation requirement (sh-#3):** the retained-heap born-RED clause
… must run in a **memoize-free process** — arming is a process-global latch that never disarms; a
stray `memoize()` construction anywhere in the gate's process false-REDs the flat-heap probe."*
The latch-flake caveat is stated as a gate requirement, not just narrated.

### SH-4 / D3 (−10) — two recorded decisions + WDM re-grounding — **ABSORBED (real)**
S.H4 (line 1195-1202): both missing r6 entries present — *"r6 #6 — do NOT zone-partition parse-that
(the subpath map IS the zone map; splitting the 707-LOC parser.ts is net-negative) — and r6 #8 —
zero-copy is deliberately delegated to value.js's scanner layer"* — and the §4 idiomatic-gestalt
correction: *"The WDM/LR keep is recorded as PROVISIONAL pending the bbnf-lang LR-consumer question
… NOT the process-latching 'made free' claim (arming never disarms; 'free' holds only for
memoize-free processes)."* This is exactly the honest keep-rationale the critique demanded, replacing
the weaker process-latching claim.

### SH-5 / D4 (−10) — "E6 is the ONLY external wave" is false — **ABSORBED (real)**
Corrected in all three cited locations plus T12:
- §1 (line 80-85): *"**Exactly TWO external consume-edges, named (revised T12).** (1) S.E6 … (2)
  S.H4 — the owner-controlled parse-that 1.0.0 publish-then-re-pin; its gates are **born-SPECIFIED**
  … SPEC-v1's 'E6 is the only externally-gated wave' was false and is corrected throughout."*
- T12 (line 1563-1568): *"**Exactly two** external consume-edges exist (corrected from v1's false
  'exactly one'): **S.E6** … and **S.H4** … gates born-SPECIFIED, firing at the impl drive's publish
  step."*
- S.H preamble (line 1160-1162) + S.H4 (line 1191, 1202-1204): H4 gate framed born-SPECIFIED.
- H3's own external (value.js sign-off) gate dissolved by its §8 de-scope (S.H3 line 1187-1190),
  so no third edge survives. Consistent with DAG note (line 1293-1294): *"the two external edges are
  E6 (third-party) and H4 (owner-controlled, born-SPECIFIED) — no others."*

### SH-6 / D5 (−10) — intra-band DAG mis-order — **ABSORBED (real)**
S.H preamble (line 1158): *"**H1, H2 parallel; H1 + H2 → H4 → (1.0.0 publish → kf re-pin) → before
S.Z.** H3 is de-scoped."* DAG block (line 1284) identical. The v1 "H1..H4 parallel" that would let a
cut precede its content is gone.

### SH-7 (fold row 46 + single-publish clarity) — **ABSORBED (real)**
- Fold row 46 now carried in wave text: S.H4 (line 1192-1193) *"**verify fold-row 46 (color2Into
  value.js WATCH) at the re-pin** — carried in this wave's text, not just the table (sh-#7)"*; fold
  row 46 (line 1357) updated to *"verified at S.H4 re-pin (carried in H4's wave text, sh-#7); if
  unverifiable there, the named exit fires — never silently re-WATCHed."*
- Single-publish: preamble (line 1159) *"one 1.0.0 publish (no interim release; kf re-pins exactly
  once)."* The patch(H1)+breaking(H2) → one major is now explicit.

---

## 2. Non-deducted observations & probe refinements — folded

- **Changelog honesty** (p11 §4 ref.2): S.H1 (line 1175-1177) *"'~30 ns / 3-Map alloc per top-level
  parse; mid-teens % on short CSS values, negligible on long strings; ~34% less retained heap' —
  never a flat 18%."* ✓
- **Heap-gate-not-%** (p11 ref.1 / critique §3 record-future): S.H1 (line 1174) *"**No throughput-%
  gate** (probe-confirmed flake trap …)"* + §8 recorded-future line 1609. The credited-RIGHT gate
  choice is preserved; no % gate added. ✓
- **H3 prune** (critique §3): de-scoped to §8, no wave/gate, not counted as closable born-RED
  (S.H3 line 1187-1190; §8 line 1583). ✓
- **Q11 closed** (§6.1 line 1449-1450): *"Q11 (packrat arming) — CLOSED (p11 confirms-spec …
  heap-gate-not-% absorbed into S.H1; C-16 rules the chain semantics)."* ✓

---

## 3. Admissibility scan for NEW blocking items (per binding scoring clarifications)

- **(i) mis-absorption** (table claims it, band text doesn't deliver): none — every SH-1..SH-7 row's
  claim is delivered verbatim in the band text quoted above.
- **(ii) new v3-introduced contradiction** (cross-band collision from the EN-a/EN-b hoist or a broken
  DAG edge): none affecting S.H. The EN-a/EN-b hoist lands in S.B3 (compile zone), disjoint from S.H.
  The "exactly two external edges" reframe is now internally consistent across §1 / T12 / DAG / S.H
  preamble / S.H4 — no residual "exactly one" survives in S.H's scope.
- **(iii) dropped evidence**: none — p11's F1–F7 and all three §4 refinements are folded; the two
  Pass-2 probes do not concern this band, so nothing owed.

The C-16 Option-A ruling is a recorded RULING with the fix shape, the retirement, and a falsifiable
gate — a correct development-phase disposition, not an open design uncertainty (clarification (a)).
No deduction.

---

## 4. Score

Pass-1: 50% (held down by one design decision D1 + four mechanical/framing edits D2–D5).
All five deductions + both non-deducted mandated edits (SH-3, SH-7) are verified absorbed in v3 band
text with real quotes; the load-bearing D1 concern is *dissolved* (Option A removes the untested
path). blocking = ∅.

**convergence_pct = 100.**
