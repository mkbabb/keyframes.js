# Lane FA-2 — Disposition Completeness Walk (no-silent-drop verification)

**Date:** 2026-07-17 · **ID prefix:** FA2- · **Posture:** read-only except this file.
**Charter:** every audit-lane top_finding ID → ≥1 owner (wave scope row / PROMPT-RECAP row / DISPOSITIONS row / outbound packet row). Any orphan = P1 silent drop.

Evidence law honored: every claim carries file:line or command+output.

---

## Verdict

The formation's disposition bookkeeping is **substantially complete but not airtight**. The
family→blueprint→wave wholesale-execution model correctly carries the large structural
families (LC/DC/DM/GS/TC/PF/DR — see §Negatives). Three real gaps survive:

1. **FAM-10 (a11y, AY-1..AY-5) is asserted-owned but ownerless** — DISPOSITIONS delegates it to
   "W4–W11" yet no wave scope contains any a11y build row. Whole commissioned lens dropped. **P1.**
2. **CT-03 / CT-04 / CT-05 never entered the family registry** — R1-09 findings that FAM-01 took
   only CT-01/CT-02 from; the other three have no family, no wave, no disposition. **P1 (CT-04) / P2 / P3.**
3. **Two BANKED-row bookkeeping contradictions** between `V.md` and `DISPOSITIONS.md`. **P2 ×2.**

Items (2)–(5) of the charter (prompt-recap sentence coverage, DISEASE terminality, outbound
bi-directional bookkeeping, inbound ownership) verified **sound**.

---

## 1 · The ID → owner walk (harvested from every lane's finding sections)

Native finding IDs per lane (harvested from `## <ID>` headers):
R1-01 PL-1/2 · R1-02 GS-01..06 · R1-03 WT-01..03 · R1-04 LC-01..09 · R1-05 DC-01..07 ·
R1-06 TC-1..6 · R1-07 DD-1..6 · R1-08 DR-1..4 · R1-09 CT-01..05 · R1-10 CH-01..06,GCF-03 ·
R1-11 PR-1..6 · R1-12 PF-1..5 · R1-13 AY-1..05 · R1-14 DP-01..03 · R1-15 XR-1..06 ·
R2-01 DP2-01..07 · R2-02 BV-1..3 · R2-03 CH2-01..04 · R2-04 AV-1..09 · R2-05 LT-01..16 ·
R2-06 DT-01..11 · R2-07 MR1..4(+GP table) · R2-08 DM-01..19 · R2-09 CC-01..07,GCF-01/02 ·
R2-10 PB-1/2 · R3-01 FE-1..4 · R3-02 EE-01..03 · R3-03 RG-1..3 · R3-04 XB-01..08.

**Ownership model (as declared, DISPOSITIONS.md:5):** fresh-build members of FAM-05/06/07/09/10/14/15
are NOT re-listed in DISPOSITIONS; they are BUILD rows "owned by W4–W11 in the wave charter."
The wave specs execute the R2 adjudicated blueprints **wholesale** — V.B `LT-01..16 … total src/
coverage` (V.B.md:4), V.C `DT-01..11 … total demo/ coverage` (V.C.md:4), V.E `DM-01..19` (V.E.md:3),
V.D `GP rows, 69-row … table = the mechanism of record` (V.D.md:3). This is the transitive-coverage
chain and it is legitimate: R1 IDs are folded into R2 blueprint rows the waves execute in full.

**Covered (directly cited or transitively via family/blueprint/range wholesale execution):**

| Family | R1/R2 IDs | Owner chain |
|---|---|---|
| FAM-05 lib structure | LC-01..09, PR-3/4 | R2-05 LT-01..16 → V.B (W4–W6) `total src/ coverage` |
| FAM-06 demo structure | DC-01..05/07, PR-1/5 | R2-06 DT-01..11 → V.C (W7–W8) `total demo/ coverage`; DC-06 also PROMPT-RECAP U→V-04 |
| FAM-07 dead-export | DD-1..4, DD-6 | V.B W4/W6 + DISPOSITIONS (DD-4, DD-6); DD-5 → DM-18 (V.E) + glass packet G-3 |
| FAM-08 doc-drift | DR-1..4, CH-03/04/06, XR-5, DD-5, PR-6 | V.E DM-01..19 (DR rows cited V.E.md:33; XR-5 = Atlas-2.0 rename in DM + V.E scope 10) |
| FAM-03/04 gate-test | GS-01/02/03/06, TC-1..6, PF-1..5, PB-1/2, DP-03 | R2-07 GP table + MR1..4 → V.D (W9); GS-04→V.E, TC-4→W4/XB-04 |
| FAM-09 bench-truth | PF-1..5 | V.D prune set (PF-1/2 taxonomy, PF-4/5 = GP-05 orphan bench); PF-3/PB-1 → V.E |
| FAM-13 close-prose | PL-1/2, PR-6, WT-02 | V.Z close-prose re-measure (PL-1 cited; PL-2/PR-6 same discipline) |
| FAM-14 easing | EE-01/02/03, DP2-02/03 | V.A W1 (DP2-02=EE-01 CopyButton; DP2-03=pageerror flock=MR1) |
| FAM-15 design | DP2-01/04/05/06/07 | V.F W11 + PROMPT-RECAP V-38/39/40 |
| FAM-01 rail | CH-01/02, CT-01/02, DD-6, XR-1/4, WT-01..03, PR-2, DP-02, CH2-02, CC-05 | DISPOSITIONS §A + V.A |
| FAM-11 coord | XR-2/3/6, CC-01..07, GCF-01/02/03, IN-* | V.G W12 + INBOUND-LEDGER + 3 packets; GCF-01/02 = glass-owned dock items in CC-05 watchlist (R2-09:234) |
| adversarial | AV-1..09 | confirmations: AV-5→LC-04(W4), AV-7→CH-02(DISP), AV-9→CT-01(DISP) inherit; AV-2/3/4→V.D; AV-6/8→PROMPT-RECAP/DISP |
| behavior | BV-1/2/3, RG-1/2/3, FE-1..4 | DISPOSITIONS §D + V.A/V.F; FE-3→W1, FE-4→W11 |
| blueprint | LT-01..16, DT-01..11, DM-01..19, XB-01..08, MR1..4 | V.B/V.C/V.E/V.D directly |

**Orphans (no owner anywhere in the disposition corpus):** AY-1..AY-5, CT-03, CT-04, CT-05.
These are the findings below.

---

## FA2-01 — FAM-10 a11y (AY-1..AY-5): asserted-owned, but no wave owns them (P1)

`DISPOSITIONS.md:5`: *"Fresh build findings (FAM-05/06/07/09/**10**/14/15 non-chronic members) are
BUILD rows owned by W4–W11 in the wave charter, not re-listed here."* `AUDIT-REGISTRY.md:24` confirms
FAM-10 = AY-1..AY-5, verdict *"CONFIRMED, small builds."*

But no wave scope, disposition row, PROMPT-RECAP row, or `V.md` line contains any a11y build:

```
$ grep -rniE 'AY-[0-9]|prefers-reduced-motion|unlabeled|accessibilitySupport|TimelineCaret|aria-errormessage|aria-invalid|MatrixEditor' waves/ DISPOSITIONS.md PROMPT-RECAP-V.md V.md
  (no matches)
```

The five dropped findings (`R1-13-a11y.md`):
- **AY-1** (P2) Amiga scene ignores `prefers-reduced-motion` (3 infinite animations) — `R1-13:29`
- **AY-2** (P2) Monaco CSS editor `accessibilitySupport:"off"` — `:64`
- **AY-3** (P2) MatrixEditor 16 unlabeled value-cell inputs — `:83`
- **AY-4** (P3) TimelineCaret edit input unlabeled; click-to-edit pointer-only — `:103`
- **AY-5** (P3) `aria-errormessage` without `aria-invalid` on z-index input — `:121`

This is exactly the class the charter forbids: *"Silent drops are forbidden"* (`ORIGINAL-PROMPT.md:53`).
The a11y lens was commissioned under V-19 (`PROMPT-RECAP-V.md:49`) and ran, but its output was
delegated to a wave band ("W4–W11") that no scope row realizes.

**Fix instruction:** Add an a11y build row to a concrete wave (W11 Proportion & Affordance is the
natural home — it already owns demo-side small-UI refinement; AY-1 reduced-motion belongs with the
`scenes/amiga/` work, AY-3/AY-4/AY-5 are demo-component label fixes), OR add an explicit FAM-10 block
to `DISPOSITIONS.md` giving each AY a terminal state (BUILD-named-wave or RETIRE-with-rationale).
Do not leave the "owned by W4–W11" claim standing without a scope row.

---

## FA2-02 — CT-04: deep-import public-surface bypass (BUILD) never entered the registry (P1)

`R1-09-consumer-truth.md:67` **CT-04** — *"demo bypasses the public surface with 11 deep
`@src/animation/*` imports reaching internals"*; disposition **BUILD (small)**: promote the reusable
helpers (`debounce`, `convertPixelsToCh`, `reverseCSSTime`, `serializeTimingFunction`,
`namedSelectorToFraction`) to a public surface and repoint, OR delete the false "not the deep `@src`"
claim in `kf-engine.ts` (`R1-09:83`).

CT-04 appears in **no family** in the registry:

```
$ grep -nE 'CT-0[345]' AUDIT-REGISTRY.md
  (none — CT-03/04/05 unassigned to any family)
```

FAM-01 RAIL took only `CT-01 CT-02` (`AUDIT-REGISTRY.md:15`). CT-04 fell out entirely. This one
matters beyond a doc nit: it intersects V's **frozen-public-surface invariant** (`V.md:44` — exports
stay exactly `.` + `./engine`). A demo that reaches 11 internals via `@src` is precisely the consumer-
truth surface the settlement claims to have closed, yet it is neither built nor consciously accepted.

**Fix instruction:** Fold CT-04 into V.C W8 (demo encapsulation sweep) as a BUILD row, or into V.E
W10 as a doc-truth FOLD if the owner accepts the demo-private `@src` imports — but decide it, and add
it to the AUDIT-REGISTRY family table so it stops being invisible.

---

## FA2-03 — CT-03: dogfood-cosmetic self-alias reword (FOLD) dropped (P2)

`R1-09:55` **CT-03** — *"vite self-alias shadows the published package; the 'dogfood the PUBLISHED
barrel' claim is cosmetic"*; disposition **FOLD**: reword `kf-engine.ts` so the prose stops claiming
published-tarball dogfood. Unassigned to any family (grep above), absent from every wave/disposition.
(The `dogfood` hits in V.E/DISPOSITIONS are `dogfood-inversion.md:48` = CH-06, unrelated.)

**Fix instruction:** Route CT-03 into V.E W10's doc-canon manifest as a one-line prose FOLD alongside
the other consumer-truth corrections, or RETIRE it with rationale in DISPOSITIONS.

---

## FA2-04 — `V.md` and `DISPOSITIONS.md` name disjoint BANKED sets (P2)

`V.md:127` (Cross-tranche debt): *"The only BANKED rows are external-producer-gated (**the Glass 7
packet; the D-GAP-6 ship-or-decline answer** from value.js)."*

`DISPOSITIONS.md:107`: *"BANKED 2 … **design-capture baseline** … **GCF-03**."* (`:98`, `:99`).

The two documents name **disjoint** BANKED sets. In the ledger the Glass-7 rail rows are **BUILD W2**
(DISPOSITIONS §A) and D-GAP-6 (=CC-01) is **FOLD W12** (`DISPOSITIONS.md:101`) — neither is BANKED.
The actual BANKED rows (design-captures, GCF-03) go unmentioned in `V.md`'s debt section. A close-time
reader reconciling the plan against the ledger hits a contradiction.

**Fix instruction:** Rewrite `V.md:125-129` to name the true BANKED rows (design-capture baseline +
GCF-03) and describe the Glass-7 packet / D-GAP-6 as the external **producer gates** on BUILD/FOLD
rows, not as BANKED rows.

---

## FA2-05 — design-capture BANKED re-trigger is internal, not external-producer-shaped (P2)

`DISPOSITIONS.md:98`: design captures → **BANKED**, *"re-trigger = **W11 open**."* `:107` then calls it
*"external-producer-gated."* But W11 is an **internal wave**, not an external producer. The formation's
own invariant P-inv-28 (`V.md:65`) permits BANKED *"only on a named external producer trigger."* An
evidence baseline consumed by a later internal wave is not a bank — it is an internal hand-off.

**Fix instruction:** Reclassify the design-capture baseline. Either fold it into W11's scope as its
BEFORE-baseline input (it already is — `V.F.md:6`), dropping the BANKED label, or keep BANKED and
correct the "external-producer-gated" characterization at `:107`. GCF-03's re-trigger ("integrated
native reproduction" from sci-report) is genuinely external and stays.

---

## FA2-06 — CT-05 residue RETIRE not re-stated in the V ledger (P3)

`R1-09:85` **CT-05** parse-that 1.0.0 orphan residue → **RETIRE** (prune on clean install). Terminal in
the lane report but never carried into `DISPOSITIONS.md`. Trivial (node_modules residue), but the
DISPOSITIONS charter is "every … item carries exactly one terminal state" — a RETIRE decided in a lane
report but absent from the ledger is technically an un-recorded terminal.

**Fix instruction:** One RETIRE line in DISPOSITIONS §C or a note that CT-05 self-resolves on clean
install. Lowest priority.

---

## Negatives (checked, found sound)

- **Charter item (2) — prompt-recap sentence coverage.** `PROMPT-RECAP-V.md:138` claims 66 rows
  (42 charter V-01..V-42 + 10 U→V + 6 H→V + 3 FM + 5 IN); 42+10+6+3+5 = 66 ✓. Walked ORIGINAL-PROMPT
  imperatives against §A rows: every imperative sentence (deep-lib/colocation→V-02, glass idioms→V-03,
  easing-prefix→V-04, compiled-frame→V-05, no-godmodules→V-07, not-impl→V-08, 32-agent audit→V-10,
  recap→V-12/17, no-legacy→V-15, chronics→V-16, portfolio→V-19, adversarial→V-22, partial→V-27,
  return-contract→V-28, GRAND-EDICT→V-29, composables-dir→V-30, long-dirs→V-31, backend→V-32,
  parsimony→V-33, prune-gates→V-35, glass-defects-batched→V-36, care-not-interrupt→V-37,
  proportionality→V-38, superfluous→V-39, converse→V-40, active-comms→V-41, value-coord→V-42) maps
  1:1. **No uncovered imperative found.** (Caveat: the a11y *lens directive* V-19 is recapped, but its
  *findings* are dropped — that is FA2-01, a disposition gap, not a sentence gap.)
- **Charter item (3) — DISEASE terminality.** 2 DISEASE rows, each cites a killing wave: CH2-02 (T→U
  ungated) → **W2** (`DISPOSITIONS.md:17`); CH-06/CH2-04 (K→U inside "COMPLETE") → **W10** (`:35`).
  No chronic is re-booked; the "watch" row CH-02 is FOLD W10 with an explicit re-DISEASE condition.
  Row counts internally consistent: 52 = 10+11+6+12+8+5 (`:107`).
- **Charter item (4) — outbound ↔ ledger.** Every ask in the 3 packets has a kf-side ledger row:
  Glass G-1→CC-04 (`DISPOSITIONS §D`), G-2→RG-2, G-3→DD-5/glass-packet (`V.E.md:48`), G-4→a11y
  assumption; Value exact-pin→CC-02/IN-ATLAS-2, D-GAP-6→CC-01, FAM-14→EE rows; Atlas replies→
  IN-ATLAS-1..4 (`INBOUND-LEDGER.md:26-29`). (G-4's a11y backing is weakened by FA2-01.)
- **Charter item (5) — inbound ownership.** All 5 INBOUND rows owned: IN-ATLAS-1→W13 methodology,
  IN-ATLAS-2→W12 packet + V.E:59, IN-ATLAS-3→W4–W8 fence (V.md:47), IN-ATLAS-4→W3/W12, IN-GLASS-1→W2
  (XR-4). Terminalized by V.G W12 (`V.G.md:41`).
- **Transitive coverage legitimate.** LC/DC/DM/GS/TC/PF/DR families are executed wholesale by their
  waves via the R2 blueprints (LT/DT/DM/GP) with explicit "total coverage" language — not silent drops.
- **AV confirmations inherit.** AV-5/7/9 are adversarial re-confirmations of already-owned findings
  (LC-04→W4, CH-02→DISPOSITIONS, CT-01→DISPOSITIONS); they need no independent disposition.
- **GCF-01/GCF-02 are glass-owned**, referenced in the CC-05 watchlist (`R2-09:234`, `BI.W-DOCK-FOLD`);
  the kf-side owner is CC-05 BUILD W2. CC-06 is a negative deliverable.

---

## Coverage gaps (this lane)

- Verified imperative/sentence coverage against §A rows, **not** R1-11's per-line-number anchor
  arithmetic (did not re-count all 163 charter lines against each V-row's line citation).
- Accepted family/blueprint/range wholesale execution as coverage for LC/DC/DM/GS/TC/PF/DR without
  enumerating every LT/DT/DM/GP sub-row back to its originating R1 ID — the blueprints assert total
  coverage; spot-checks (LC-04 phantom→W4, DR rows→V.E, PF-4/5→GP-05) held.
- GCF-03's external (sci-report) status is UNVERIFIED here (read-only sibling; W12 owns the confirm).
