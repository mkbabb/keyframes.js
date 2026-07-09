# H3 — CONFLICTS · DAG · NON-GOALS (adversarial harden lane 3)

> Scope: (a) no two bands OWN the same scope; (b) T.md §2 DAG consistent with every wave's
> stated edges; (c) no wave violates §4 non-goals; (d) OD-gated waves have no un-gated
> siblings that moot the ruling; (e) glass-ui asks in wave docs ⇔ `KF-TO-GLASSUI-BG.md`.
> Read against `tranche-t-impl`-dev corpus @ 2026-07-05 (T.md was being edited live during
> this pass — §4 shifted "only library touches" → "other" + a colocation-edict clause; the
> findings below re-grepped their anchors at report time).
>
> Method: every finding cites files, the exact defect, and the exact fix. CONFIRMED only.

---

## CONFIRMED-1 — KfPillTabs deletion is TRIPLE-OWNED with contradictory postures (axis a)

**Files.**
- `waves/T.B.md` T.B6 (`:325-376`): title "KfPillTabs dies"; scope `:334` "**Delete
  `KfPillTabs.vue` + `useKfPillTabs.ts`**"; gate `:359` `proof:panel-glass-kit` (**born-RED**)
  = "`grep -r "KfPillTabs" demo/` = 0 (fork gone)".
- `waves/T.H.md` T.H5 (`:238-273`): "Excise `KfPillTabs` (gated on BG-1 + BG-3)", **GATED-ON-PUBLISH
  tripwire, NOT born-RED**; `:257` "deleting KfPillTabs now re-breaks aria"; disposition (`:264`)
  "T.H5 owns the *component* deletion + the SegmentedTabs adoption".
- `waves/T.F.md` T.F16 (`:598-628`, note 5 `:901-911`): renames the fork
  (`KfPillTabs.vue`→`PillTabStrip.vue`), and `:622`/`:908` "**it does NOT delete the fork (a11y
  necessity until upstream)** … T.H owns the … gated-on-publish final DELETION".
- Charter `T.md` §1 T.H row (`:51`): "gated-on-publish excisions (**KfPillTabs**, usePlayActuation,
  MbabbMenu synthesis) specified terminal-on-publish".
- `KF-TO-GLASSUI-BG.md` §0 BG-1 (`:33`, `:109`): "**BG-1 is a precondition for BG-3 (deleting
  KfPillTabs)**"; BG-3 (`:34`) retires "`KfPillTabs.vue` (121L) + `useKfPillTabs.ts` (90L) in
  totality" → owning wave **T.H6/T.H5**.
- `waves/T.E.md` note 3 (`:600-608`): "The `KfPillTabs.vue` component itself … is T.B/T.C/T.H".

**Defect.** THREE waves dispose of the SAME component with mutually inconsistent postures:
T.B6 authors a **born-RED** gate demanding the fork be **gone now** (`grep KfPillTabs = 0`);
T.H5 says the deletion is **gated-on-publish** (deleting now re-breaks WAI-ARIA because BG-1/BG-3
are unpublished); T.F16 says the fork must be **kept** (renamed) as an a11y necessity until
upstream ships. Charter §1 T.H, `KF-TO-GLASSUI-BG.md` BG-1/BG-3, and T.E note 3 all place the
DELETION at T.H (gated-on-publish) — so T.B6's born-RED deletion is the outlier. Two concrete
failures: (i) T.B6's gate can never green inside T's own tree (the fix is owner-domain glass-ui
publish, outside T) yet it is authored born-RED, not gated-on-publish; (ii) T.B6's gate
(`grep "KfPillTabs" demo/` = 0) is **accidentally satisfiable by T.F16's rename**
(`KfPillTabs`→`PillTabStrip`) with the fork still alive — a green that certifies the wrong state.
The prompt's own flag: "which wave owns the deletion vs the gated-on-publish path — must be ONE
owner + cross-refs."

**Exact fix.** Make T.H5 the SINGLE owner of the DELETION (per charter §1 T.H). In T.B6:
delete the born-RED `grep -r "KfPillTabs" demo/ = 0` clause from `proof:panel-glass-kit`; replace
the scope line "Delete KfPillTabs.vue + useKfPillTabs.ts" with a cross-ref: "the fork's demo-side
rename lands in **T.F16** (now); its terminal DELETION is **T.H5** (gated on BG-1+BG-3)". Re-anchor
T.B6's kit gate to what it actually owns NOW — "the panel's tab switcher resolves through
`SegmentedTabs` / the dock `Select` / the shared `useRovingTabindex` primitive (T.F16), never a
hand-forked roving core" — with NO deletion assertion. Result: one deletion owner (T.H5,
gated-on-publish), one rename owner (T.F16, now), T.B6 a pure consumer — cross-referenced both
ways.

---

## CONFIRMED-2 — T.C6 mints the FORBIDDEN synonym cap `dockClickIntegrity` (axes b, e)

**Files.**
- `waves/T.C.md` T.C6: `:375` "actuates single-click through the crossfade
  (`glassCaps.dockClickIntegrity === true`)"; gate `:381` "keyed on the glassCaps probe:
  `dockDismissHold` and `dockClickIntegrity`"; lockstep `:398` greps "`dockDismissHold` /
  `dockClickIntegrity`" (3 occurrences total).
- `KF-TO-GLASSUI-BG.md` §1 crosswalk (`:57`, `:65-70`): "GU-4 click-integrity …
  `glassCaps.dockStrandKeepalive` (**exists**, S2) … **Lane 08/T.C6 proposed a second name,
  `dockClickIntegrity`, for the same defect. Reuse `dockStrandKeepalive`. Do not mint a synonym
  cap; a single defect gets a single probe (else the two gates can disagree).**"
- `waves/T.H.md` T.H1 (`:75`) + T.H6 (`:292`) + §4 note 1 (`:407`) all use the coded cap
  `glassCaps.dockStrandKeepalive` (= `proof:workaround-deletion` S2, `proof-workaround-deletion.mjs:255`).

**Defect.** T.C6 is the ONE wave doc that still keys GU-4's scaffolding-excision tripwire on
`dockClickIntegrity` — the exact synonym cap `KF-TO-GLASSUI-BG.md` §1 names by its lane-08/T.C6
origin and rules SUPERSEDED, and that T.H1/T.H6 correctly implement as the already-coded
`dockStrandKeepalive`. Two caps for one defect means the two gates (T.C6's and
`proof:workaround-deletion` S2) read different probes and can disagree — the precise failure the
cap-name discipline forbids.

**Exact fix.** In T.C6, replace all three `glassCaps.dockClickIntegrity` occurrences (`:375`,
`:381`, `:398`) with `glassCaps.dockStrandKeepalive`; state that T.C6's GU-4 excision row IS
`proof:workaround-deletion` **S2** (already coded), matching T.H6 and the letter §1 crosswalk. The
new caps T.C6 introduces are then exactly `dockDismissHold` (GU-3, genuinely new); GU-4 reuses the
existing `dockStrandKeepalive`.

---

## CONFIRMED-3 — T.E8 routes 3 glass-ui asks that are ABSENT from the letter (axis e)

**Files.**
- `waves/T.E.md` T.E8 edges (`:354-357`): "**Three glass-ui asks routed to T.H**: (1)
  named-catalogue coverage beyond bezier presets, (2) an externally-driven-`progress` example in
  `EasingPicker` docs, (3) `ToggleChip cell` with a live-animating preview slot."
- `waves/T.E.md` cross-band table (`:503`): "T.E8 → T.H: … + **3 BG/BH gap-letter asks** (bounce
  catalogue, external-progress docs, `ToggleChip` live-preview slot)".
- `KF-TO-GLASSUI-BG.md` §0 (`:25`): "The ask roster (**nine asks** + one retired duplicate)" —
  GU-1..4, BG-1/3/4/5/6/7. None of T.E8's three appears.
- `waves/T.H.md` T.H2 scope (`:120`): "The letter carries **nine asks** (GU-1..4 …, BG-1/BG-3
  tabs, BG-4 …, BG-5 …, BG-6 …, BG-7 …)"; disposition `:345` "expanded to nine asks".

**Defect.** T.E8 (and the T.E cross-band summary) explicitly frame three `EasingPicker`/`ToggleChip`
items as **BG/BH gap-letter asks routed to T.H**, but the consolidated letter
`KF-TO-GLASSUI-BG.md` carries only nine asks and T.H2's scope enumerates exactly those nine — the
three T.E8 asks have no home in the letter. This breaks the (e) round-trip: a wave-doc glass-ui ask
must appear in `KF-TO-GLASSUI-BG.md` (the "single source of the consolidated ask naming", letter §1;
inv-16 "every cross-repo need is a dispatch").

**Exact fix.** Add three ask rows to `KF-TO-GLASSUI-BG.md` §0 (e.g. **BG-8** EasingPicker
named-catalogue/bounce coverage, **BG-9** externally-driven-`progress` docs example, **BG-10**
`ToggleChip variant="cell"` live-preview slot), each with its kf-side acceptance/consumption note
citing lane 05 F6, and update T.H2's "nine asks" → "twelve asks" + the T.H2 disposition line. OR, if
these are intended as forward-looking non-blocking notes rather than dispatched asks, downgrade the
T.E8 wording from "3 BG/BH gap-letter asks routed to T.H" to "3 consumption notes (not letter asks)"
so the letter round-trip is exact. Either edit closes the gap; the first is the honest-dispatch
choice given the letter is "the consolidated cross-repo ask letter."

---

## CONFIRMED-4 — T.E9's born-RED easing hue window contradicts T.D7's OD-6 window (axes b, d)

**Files.**
- `waves/T.E.md` T.E9 gate (`:379-384`): "a fill whose hue ∈ **[240°,320°]**"; "The red-KILL is
  owner-ruled (#16, born-RED); the specific violet hue-family value rides **T.D/OD-6**." Wave posture
  `:44`/`:365`: **BORN-RED**, easing-scoped (lands now).
- `waves/T.D.md` T.D7 oracle (`:246`): "resolve oklch hue ∈ the blessed accent window (lane 09:
  **[280°,330°]**)"; posture `:240` **BORN-OWNER (OD-6)** — "the born-RED oracle is NOT authored
  until OD-6 carries an owner token".
- Charter §3 OD-6 / `OWNER-DECISIONS.md` OD-6: the violet ramp CHOICE (hue/chroma arms) is
  PENDING-OWNER; only the red-KILL is RULED.

**Defect.** Two waves gate the SAME accent authority with INCONSISTENT hue windows: T.E9 asserts
easing fill hue ∈ [240°,320°]; T.D7 (the OD-6 authority) asserts hue ∈ [280°,330°]. An owner ramp
choice in (320°,330°] passes T.D7 but **REDs T.E9**; a choice in [240°,280°) passes T.E9 but REDs
T.D7. Worse, T.E9's hue clause is **born-RED (authored now)** while the accent hue is OD-6
PENDING-OWNER — an un-gated sibling that pre-commits the accent hue before the owner token, exactly
what T.M2 forbids ("no design wave's born-RED oracle is authored until its OD row carries an owner
token"). The RED-KILL clause of T.E9 is legitimately born-RED; the [240°,320°] hue clause is not.

**Exact fix.** Split T.E9's gate: keep the "zero red-family pixels (ΔE<10 of the two reds)" clause
**born-RED** (the red-kill is RULED). Move the "fill hue ∈ [window]" clause to **BORN-OWNER (OD-6)**
and DERIVE its window from T.D7's single OD-6 blessed window rather than restating a different
literal — i.e. T.E9 asserts "hue ∈ (the OD-6 accent window T.D7 defines)", not a hard-coded
[240°,320°]. One source of the violet window (T.D7/OD-6); the easing gate consumes it.

---

## Checks that PASSED (no conflict — recorded so the impl drive does not re-litigate)

- **Elision: T.B model vs T.C host (axis a) — CLEAN.** T.B5 authors the ONE cardinality model +
  `proof:dock-elision` + the `proof:no-single-option-select` re-charter; T.C1 RENDERS the zones +
  `proof:dock-grammar` (structural absence). Cross-referenced both ways (T.B5 Edges→T.C; T.C1
  Edges←T.B5; T.C §Charter-conflicts note 2), and the `proof:no-single-option-select` re-charter is
  flagged "must-land-together T.B5+T.C1" in BOTH docs. No double-authoring of the `.length`
  arithmetic.
- **`usePlayActuation` excision (T.C6 ↔ T.H6) — CLEAN co-ownership.** Explicitly flagged
  "must-land-together, DO-NOT-DOUBLE-AUTHOR" in both (T.H6 note 2 `:299-304`; T.C6 edges); split is
  clear (T.H6 = ledger/tripwire + MbabbMenu half; T.C6 = dock-render side). [But its CAP NAME is
  wrong in T.C6 — see CONFIRMED-2.]
- **OD-1 (morph/motion-path FUSE vs PRUNE) — CLEAN gating.** T.E2 (FUSE) ∥ T.E3 (PRUNE) both
  BORN-OWNER, mutually exclusive, "author only the SELECTED wave's born-RED oracle" (T.E note 4).
  The only sibling that lands regardless — T.A14 (MorphSVG attribute-first, LIBRARY) — is
  owner-invariant correctness that "stands on its own" with no demo consumer if PRUNE (T.E note 5;
  T.E3 scope); T.M5's morph clause and T.F10's motion-path split are both explicitly CONDITIONAL on
  the OD-1 ruling. No un-gated sibling moots OD-1.
- **`DockSeparator`, styles-split, breakpoint, app/chrome→dock — CLEAN partitions.** DockSeparator
  subsumed by T.C1's grammar recut (T.H4 cross-ref only, no double-author). Styles split owned by
  T.D15 (T.F §4 note 6 defers). Breakpoint owned by T.F18 (T.D defers). Directory rename T.F3 vs
  component recut T.C1 partitioned (T.F §4 note 3). gesture-manifest retirement: mechanism T.M7,
  execution T.E11, per-scene DOM T.A2/T.A10/T.B — one lockstep motion, reciprocally flagged.
- **§4 non-goals (axis c) — no CONFIRMED violation.** T.S4's `frame-compiler.ts:341` (DM-22) and
  T.A6's `frame-compiler.ts:401-410` (plain-vars) are the two waves that touch that library file;
  the CURRENT §4 text (post 2026-07-05 edit) states the ring-fence "protects the zone-boundary
  DECISIONS, not the internals", and both are new-defect-driven — so they are in-scope. **Minor
  doc-hygiene note (not a finding):** §4's enumerated new-defect touches name only "T.A's plain-vars
  + MorphSVG"; for completeness it could also name T.S4 (frame-compiler DM-22) + T.S3's two
  library-correctness tripwire gates (`no-collision-rename`, `no-nested-self-dependency`) so an impl
  agent does not read T.S4 as re-litigating the carve. No wave re-carves a zone boundary or
  re-litigates C1/C2/C3a/C4.

## Open risk (not a conflict; flagged for T.M8)

- **Aggregate net-new gates vs the 203→~120 ceiling.** T.B (~12 new keys), T.C7 (+4), T.G6/T.G7/…,
  T.F (~13, self-flagged §4 note 1), T.S (2 tripwires) all add net-new gates while T.M8's
  `proof:roster-ceiling` is born-RED against >~120. Every band defers reconciliation to T.M8
  (clause-additions / composite folds), but no doc reconciles the ARITHMETIC — the sum of net-new
  keys plausibly exceeds what M7's ~15 retirements + M8's FROZEN discharge offset. Not an
  ownership/DAG/non-goal defect (it is explicitly coordinated), but the ceiling's achievability is
  unproven in the corpus.
