# H1 — COMPLETENESS (adversarial hardening lane 1)

Scope: verify (a) every VERDICT row 1–28 maps to ≥1 wave/OD row; (b) every ORIGINAL-PROMPT
operative clause (incl. the refactor litany) is owned by a **named wave**; (c) the S-residue set
is fully folded. Read: VERDICT.md (28 rows), ORIGINAL-PROMPT.md, T.md, all `waves/T.*.md`,
PROMPT-RECAP.md, OWNER-DECISIONS.md, SYNTHESIS-INDEX.md, plus `audit/lanes/21-legacy-sweep.md`
(the litany's audit source) and grep of `waves/` + `scripts/`.

## Verdict on the three checks

- **(a) VERDICT rows 1–28 → wave/OD: PASS (no orphan).** PROMPT-RECAP §3 maps all 28; each target
  wave/OD exists and substantively owns the row (spot-verified against the wave bodies). Sub-asks
  inside rows are also placed (e.g. #6 play-first→T.B10/T.C1, divider→T.B5/T.C1, ghost tooltip→T.C3;
  #17 animation-elision→T.B5 `hasSingleAnimation`; #3 sub-header font→T.D11).
- **(b) ORIGINAL-PROMPT operative clauses → named wave: PARTIAL — 6 confirmed gaps below.**
- **(c) S-residue (S.A3, drag-gesture, ledger carries, KF-7, S.Z unblock) → folded: PASS.** T.S's
  "S-residue → T-wave map" (21 rows) + PROMPT-RECAP §4 (15 rows) place every item on a named wave
  (S.A3→T.S6+T.S1; drag-gesture→T.S2; ledger carries/tier-bug/ci.yml literal/engine-seam ratify→T.S1;
  KF-7 + self-dep phantom + color2Into→T.S3; S.Z1/Z2/Z3 + OWNER-ASKS row-4 transfer→T.S7/T.S1/T.Z;
  DM-22→T.S4; session-log→T.S5; 3 orphaned S.B6 gates + roster-count→T.M8). No orphan.

---

## CONFIRMED FINDINGS (most-severe first)

### F1 — HIGH · Lane 21 recs 4/5/6 (throttle-DRY, `any`-ceiling, dead-export gate) have NO owning wave — dangling cross-refs to T.F

**Defect.** Three VERDICT-#28 litany items — "DRY the hot/cold readout throttle into one composable"
(rec 4 / "DRY. KISS."), "sweep `demo` `any` to a bounded ceiling under a gate" (rec 5 / "No effusive
dynamicism"), and "add `proof:no-dead-export` + excise the confirmed-dead symbols" (rec 6 / dead
exports) — are dispositioned **↳ cross-ref T.F** by all three bands that touch lane 21 (T.B, T.H,
T.S), but **T.F never receives them**:
- `waves/T.F.md:16` "Lanes owned" lists `13, 14, 15, 16, 22, 18, 19` — **lane 21 is absent**.
- grep of `T.F.md` for lane 21 / "legacy sweep" / these recs → **zero hits**; no wave-id F1–F20 owns
  the throttle composable, the `any`-ceiling ratchet, or `proof:no-dead-export`; T.F's §3 disposition
  tables cover lanes 13/14/15/16/22/18/19/25 only.
- Cross-ref sites that dead-end at T.F: `T.B.md:628-630`, `T.H.md:356-358`, `T.S.md:401-403`.
- Existing gates do NOT cover them: `scripts/proof-no-any-default.mjs` is the LIBRARY d.ts gate (one
  of the 3 S.B6 gates T.M8 folds), not the demo `any`-ceiling; `scripts/proof-no-dead-dependency.mjs`
  is module/dependency-granularity — lane 21 rec 6 explicitly asks for a NEW export-granularity gate.
- SYNTHESIS-INDEX blind spot: it counts these as "Covered" via cross-ref, contradicting its own
  definition ("Covered = ≥1 real owning **wave-id**, not merely a cross-ref target") — so its 200/206
  Covered count is overstated by (at least) these 3.

**File(s).** `waves/T.F.md` (missing owner); dangling refs at `waves/T.B.md:628-630`,
`waves/T.H.md:356-358`, `waves/T.S.md:401-403`; source of the recs `audit/lanes/21-legacy-sweep.md`
recs 4/5/6 (findings #6/#7/#8).

**Exact fix.** Add lane 21 (recs 4,5,6) to T.F's "Lanes owned" and author the three receiving waves
(or fold into the F4-note composite `proof:demo-*-hygiene` gates T.F §4 note 1 already proposes):
(i) `T.F21` — extract `useThrottledReadout(source, hz)` and repoint the 4 scenes
(`useEasingDemo.ts:218`, `useSpringDemo.ts:229`/`useSpringHotPath.ts:114`, `AmigaScene.vue:151`,
`useSequenceDemo.ts:194`); census gate = the throttle exists in exactly 1 file. (ii) `T.F22` —
`proof:demo-any-ceiling` ratchet (start at the swept demo `any` count, ratchet down; reds on a fresh
un-allowlisted `any`). (iii) `T.F23` — `proof:no-dead-export` (excise `kfEngineReady` + the 6 dead
types; wire into `proof:hygiene-chain` per T.M8). Update T.F §3 with a Lane-21 disposition table and
correct SYNTHESIS-INDEX's Lane-21 rows from "cross-ref" to the new wave-ids.

### F2 — MEDIUM · "Non-idiomatic Tailwind usage" (ORIGINAL-PROMPT styling-focus item 1) is owned by no wave or gate

**Defect.** `ORIGINAL-PROMPT.md:83` lists, as an explicit numbered styling-focus item, "(1)
non-idiomatic Tailwind usage" — echoed in the VERDICT #28 litany "non-idiomatic-tailwind … audits".
grep of `waves/` for `non-idiomatic tailwind|idiomatic tailwind|tailwind …audit` → **zero hits**. The
T.D style waves consume lane 17 but each targets a different concern (T.D15 de-archaeology/tokens,
T.D16 cascade-layer order + `*`-reset, T.D17 off-token literals, T.D18 anchor calc, T.D19 dvh, T.D20
glow tokens, T.D21 crosshair); T.F18 does only the breakpoint `theme()` swap. **None audits
non-idiomatic Tailwind** (arbitrary `[…]` bracket values, `!` important utilities, non-idiomatic
`@apply`, off-scale utilities). The clause is a dropped operative from the prompt's own enumerated list.

**File(s).** `waves/T.D.md` (the LOOK band, where the charter T.D row's "non-idiomatic-tailwind …
audits" belongs); the clause origin `ORIGINAL-PROMPT.md:83`, `VERDICT.md:46`.

**Exact fix.** Assign it to a named T.D wave (e.g. extend T.D16's scope, or add `T.D22 —
proof:tailwind-idiomatic`): a census that reds on demo arbitrary-value utilities (`class="…-[Npx]"`),
`!`-important utilities, and off-token color/size utilities outside an allowlist, complementing T.F18
(breakpoint) and T.D15 (idioms). If the audit finds the demo already idiomatic, record the
audited-clean disposition explicitly (as lane 21 did for test-files-in-src) so the clause is not silently
dropped.

### F3 — MEDIUM · T.E6 (BORN-OWNER easing-gallery design) has no OWNER-DECISIONS register row

**Defect.** T.E6 is **BORN-OWNER** — its born-RED oracle "may not be authored until an owner token
covers a live prototype" (`waves/T.E.md:272`) — yet `OWNER-DECISIONS.md` registers only OD-1..OD-6,
none covering the easing gallery (grep `OD-7` → absent). T.E's own charter-conflict note 2
(`waves/T.E.md:590-598`) flags this and recommends "add an OD-7 (easing gallery design) … OR
explicitly document that T.E6 rides T.M2's general contract." The wave index does say "rides T.M2," so
it is weakly handled — but the **register the owner reviews for pending design calls carries no
easing-gallery slot**, so the drawer-layout/tile-treatment/one-shared-clock-sweep fork is invisible in
`OWNER-DECISIONS.md`. This is the exact S.E-shelf failure class (a taste disposition without an
owner-in-the-loop vehicle) T.M2 exists to prevent.

**File(s).** `OWNER-DECISIONS.md` (missing OD-7 row); flagged at `waves/T.E.md:590-598`.

**Exact fix.** Add **OD-7 (easing specimen-drawer gallery design)** to `OWNER-DECISIONS.md` (fork:
the drawer layout / tile treatment / one-shared-clock comparative sweep), served by T.E6 + the live
easing prototype, ruling `PENDING-OWNER`; add it to the §3 cross-band index and the T.md §3 register.
(T.md §3 lists OD-1..OD-6; T.Z's "every slot filled" close-gate would otherwise never see the easing
design.)

### F4 — LOW · Lane 21 finding #9 (legacy-naming rename) dropped from every wave

**Defect.** Lane 21 finding #9 (a KEEP with a concrete action) recommends renaming
`cube/orbital-drag/composables/inertiaDecay.ts` `TARGET_DT → REFERENCE_FRAME_DT` and dropping the
"legacy per-frame friction" prose so it reads as a parity anchor, and notes the sibling
`motionPathGeometry.ts:76 LEGACY_PATH_D` (dies with motion-path if pruned). It has **no T-rec number**
and grep of `waves/` for `inertiaDecay|TARGET_DT|REFERENCE_FRAME_DT|LEGACY_PATH_D` → **zero hits** — not
folded into any wave. It is the one "legacy-NAMED but live" residue under the ORIGINAL-PROMPT "NO legacy
code" clause that was audited but never dispositioned onto a wave.

**File(s).** `audit/lanes/21-legacy-sweep.md:233-243` (finding #9); no owning wave.

**Exact fix.** Fold the rename into T.F19 (provenance/legacy-naming sweep) or a T.A cube wave: rename
`TARGET_DT → REFERENCE_FRAME_DT` in `inertiaDecay.ts` + de-"legacy" the prose; note `LEGACY_PATH_D`
retires with motion-path under OD-1 (T.E2/T.E3).

### F5 — LOW · "NO nested imports" (ORIGINAL-PROMPT:67) neither audited-clean nor owned

**Defect.** `ORIGINAL-PROMPT.md:67` "NO nested imports" appears in lane 21's litany surface
(`21-legacy-sweep.md:4`) but — unlike its litany siblings — is **never audited in lane 21's body**
(findings #1–9 don't touch it) and is owned by **no wave** (grep of `waves/` → the string surfaces only
in VERDICT/ORIGINAL-PROMPT quotes). Contrast: test-files-in-src was explicitly cleared
(`21-legacy-sweep.md:12` "zero test files in `src`") and effusive-dynamism became finding #7 → rec 5.
Nested imports got neither disposition. (Note: a blanket ban conflicts with the sanctioned dynamic
`loadAnimationEngine()` LIGHT/HEAVY boundary, so the honest disposition is likely "audited-clean modulo
the sanctioned boundary" — but that disposition was never made.)

**File(s).** clause origin `ORIGINAL-PROMPT.md:67`; unaudited in `audit/lanes/21-legacy-sweep.md`.

**Exact fix.** Add a nested-import disposition to T.F (structure) or T.S (legacy sweep): either a
`proof:no-nested-import` census excluding the sanctioned `loadAnimationEngine()`/lazy-barrel dynamic
imports, or an explicit audited-clean record (mirroring lane 21's test-in-src clearance) so the clause
is not silently dropped.

### F6 — LOW · "Run linting and type checking … at every interval" (ORIGINAL-PROMPT:71) owned by no named wave/orchestration clause

**Defect.** `ORIGINAL-PROMPT.md:71` (a standing-mandate process clause, restated in VERDICT #28
"lint+typecheck at every interval") is owned by no named wave and is **not** among charter §5's
orchestration clauses (T.md §5 lists merge-first, independent gate re-run T4/T5, board, push, arming
audit — not a lint/typecheck cadence). PROMPT-RECAP §1 folds the whole 7-clause mandate but does not
pin this precept to a wave or a per-batch orchestration step.

**File(s).** clause origin `ORIGINAL-PROMPT.md:71`; charter §5 `T.md:104-116` (no lint/typecheck
cadence clause).

**Exact fix.** Add an explicit clause to T.md §5 orchestration (a per-batch `npm run check` +
lint gate re-run alongside the T4/T5 independent gate re-run), OR record it as an existing standing
process constraint discharged by `proof:*`/`check:lib`. Minimally, make the mandate row in PROMPT-RECAP
§1 name its enforcement home rather than leaving it implicit.

---

## Method note

Checks (a) and (c) passed by full row-by-row trace against the wave bodies (not just the index).
Check (b) failures are the six above; F1 is the load-bearing one — it is a genuine coverage hole the
SYNTHESIS-INDEX's own Covered/Missing math masks (cross-ref-to-band ≠ owned-by-wave-id). F2 is a
dropped item from the prompt's explicitly enumerated styling list. F3 is a design-register gap T.E
self-flagged. F4–F6 are minor dropped/underspecified clauses.
