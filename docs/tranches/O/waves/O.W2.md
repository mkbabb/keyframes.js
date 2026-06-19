# O.W2 — The honest-correction wave (ledger re-point + stale-gate retarget)

**Band:** A — Apparatus + ledger hygiene
**Phase:** NOW (kf-internal; no sibling publish gate)
**Sequence:** O.W0 (charter) → **O.W2** (parallel with O.W1) → B{O.W3, O.W4}
**Owning chronic/DM:** DM-4 (FIX→FOLD update), DM-17 (RESOLVED-BY-KILL → RESOLVED-BY-FIX),
DM-24 (add row), DM-5 S1/S2 (version retarget), proof:control-point-live (RETIRE)

M-substrate: **M.W8.md** (the BB→BC edit-spec, §1 of M-RECONCILIATION.md), **M.W14.md** (the
GlassControlPoint build-in / control-point-live retirement), and the deferred ledger (the
DM-4/DM-17/DM-24 corrections from M-RECONCILIATION.md §4/§7). This wave implements the
CORRECTION actions M-RECONCILIATION documented but marked IMPL-OPEN — the honest-repair items
that live in docs and gate scripts, not in the library source. It is called the "honest-correction
wave" because its sole mandate is to make the living docs and gate scripts reflect the real
observable state of the tree — nothing more, nothing less.

---

## Context

The re-audit (32-lane, 2026-06-19) found five material stale-gate / ledger discrepancies that
are kf-internal, require zero sibling publish, and are immediately correctable. They are grouped
here because they share a single theme: docs and gates that assert a phantom state (a version
that never shipped, a decision that has since been reversed, a wrong DM number) rather than the
genuine observable truth.

### Finding 1 — proof:workaround-deletion S1/S2 probe a phantom version

**Evidence:** `scripts/proof-workaround-deletion.mjs:216` and `:228` hard-code:

```js
sibling: { pkg: "@mkbabb/glass-ui", version: "4.1.0", name: "BB SegmentedTabs aria fix" }
sibling: { pkg: "@mkbabb/glass-ui", version: "4.1.0", name: "BB W-DOCK-MORPH-FAMILY click-strand cure" }
```

`@mkbabb/glass-ui@4.1.0` was **never published**. BB closed at 4.0.1; the BC cut is USER-DOMAIN
(≥4.1.0). Audit lanes A2, G32, C14 confirm: `npm show @mkbabb/glass-ui versions --json` →
`["4.0.0", "4.0.1"]` only; `4.1.0` → E404 (confirmed live 2026-06-19). The `probePublish()`
function returns `"UNPUBLISHED"` for 4.1.0 — the arms are PENDING because the probe fires on a
version that can NEVER be published. The gate is structurally sound (three-state model is
correct) but probes the wrong version — an observable-truth violation.

**A2 additional finding (BLOCKER):** For S1 (aria-orientation), the BC resolution is not
merely a version bump. ASK#2 in KF-BC.md was declared "CONFIRMED — emitting a real axis-derived
value" but `SegmentedTabs.vue:406` on BC HEAD still emits `:aria-orientation` unconditionally
including on `role=group`, where ARIA 1.2 disallows it. The S1 delete premise (BC ships the
conditional guard) is therefore UNMET and the S1 arm must be retargeted to a content-probe (does
the installed dist guard `aria-orientation` to tablist-only?) rather than a version-publish-only
probe. O.W11 (Band E) dispatches the corrected aria-orientation ask to glass-ui BC. S1 stays
PENDING in `proof:workaround-deletion` until the content-probe GREENs.

**For S2 (dock RF-17):** `useDockClickIntegrity` already ships in 4.0.1 dist (grep confirmed
by audit A2/A3). S2 could be deleted against the installed 4.0.1 NOW — but the TransportDock
comment at line 313 records the crossfade-strand case that `useDockClickIntegrity` does NOT
cure. S2 interim is correctly retained, but the version sentinel "4.1.0" must be updated to
a content-aware probe (does the installed dock export `useDockClickIntegrity` AND does the
buttery BC engine cure the crossfade-strand root?). The BC cut is the real unblock event for S2.

**Cure (O.W2 S1):** Retarget both S1 and S2 arms in `proof-workaround-deletion.mjs`:
- S1: replace the hard-coded `version: "4.1.0"` probe with a **content-probe** — check the
  installed `@mkbabb/glass-ui` dist for a `aria-orientation`-conditional guard in
  `SegmentedTabs` (grep for `isUnderline.*aria-orientation` or equivalent conditional), NOT a
  version-number sentinel. The arm stays PENDING until the content-probe finds the guard.
- S2: replace `version: "4.1.0"` with a content-probe — check that the installed dock dist
  contains `useDockClickIntegrity` (already true at 4.0.1) AND that the BC-cut buttery engine
  ships (a BC-cut sentinel such as a known BC.W-DOCK-ENGINE symbol or ≥4.1.0 semver as a
  *secondary* check after the content probe). Until BC cuts, arm stays PENDING.

The three-state model (ABSENT→GREEN / PRESENT+UNPUBLISHED→PENDING / PRESENT+PUBLISHED+API→RED)
is correct and unchanged. Only the probe predicate is retargeted from a phantom-version probe to
a content-aware probe.

**M-RECONCILIATION edit-spec reference:** M-RECONCILIATION.md §1 (the BB→BC retarget) specifies
this correction; it was left IMPL-OPEN. O.W2 closes it.

---

### Finding 2 — proof:control-point-live asserts a premise BC decided is DEAD

**Evidence:** `scripts/proof-control-point-live.mjs` (289 lines) asserts:
`GlassControlPoint` is importable from the published `@mkbabb/glass-ui` barrel as a
draggable-SVG-handle. `glass-ui/docs/tranches/BC/coordination/KF-BC.md:75` records:
"ANSWER: NO — BC ships NO standalone GlassControlPoint primitive." (Audit lane D17 BLOCKER,
audit lane A5 confirms.) The gate is permanently RED on a premise that will never be fulfilled:
glass-ui BC has decided NOT to ship GlassControlPoint.

A gate that will NEVER green is not a tripwire — it is noise that blocks the auto CI round-trip
(audit D19: both `proof:keyframes-vue-published` and `proof:control-point-live` are in
`check-failures`; the auto round-trip cannot fire until both clear). Keeping it asserts a gap
kf has decided NOT to close via glass-ui.

**Cure (O.W2 S2):** RETIRE `proof:control-point-live`:
1. Delete `scripts/proof-control-point-live.mjs`.
2. Remove its `package.json:189` script entry (`"proof:control-point-live": …`).
3. Remove it from `ci.yml:1595-1596` `check-failures` block (the demo-smoke tripwire arm).
4. Record the retirement in `docs/tranches/M/audit/deferred-ledger-M.md` DM-2 row: the
   `GlassControlPoint` ask is **WITHDRAWN** (BC said NO; the build-in Option B — DemoControlPoint
   over LIGHT `drag2D` — supersedes it). The build-in gate is `proof:demo-control-point`
   (authored at O.W5, Band C — the chronic terminal wave).

**Constraint:** `proof:demo-control-point` (O.W5) is NOT authored here — O.W2 only retires the
dead tripwire. The CI auto round-trip is NOT unblocked by this retirement alone: the second
blocker (`proof:keyframes-vue-published`, DM-7) clears only at O.WZ (USER-DOMAIN publish).
However, retiring `proof:control-point-live` removes one permanent RED from `check-failures`,
which is prerequisite to the auto round-trip eventually clearing.

**M.W14 edit-spec reference:** M.W14 S6 ("Retire `proof:control-point-live`; author
`proof:demo-control-point` born-RED") specified this retirement. M.W14 was not implemented;
O.W2 performs the retirement (the docs/gate half), O.W5 performs the build-in (the
implementation half).

---

### Finding 3 — DM-4 disposition: KILL → FIX/FOLD (packrat fix SHIPPED)

**Evidence:** `docs/tranches/M/audit/deferred-ledger-M.md:133` DM-4 records: "KILL (the
unsoundness is off the value.js-consumed path; the risk is nil)". But M-RECONCILIATION.md
§4 ("D4 — the owner decision") documents the owner's correction: **FIX, not KILL** — parse-that
Tranche A (`A.W2`) shipped the `(id,offset)` composite key (WDM) in `0.11.0`; the unsoundness
is genuinely fixed, not merely declared off-path. `proof:packrat-sound` is GREEN (confirmed live,
2026-06-19: the fix shipped). The DM-4 ledger row says KILL; the reality is FIX/FOLD-LANDED.

**Cure (O.W2 S3):** Update `docs/tranches/M/audit/deferred-ledger-M.md` DM-4 row:
- Disposition: `KILL (the unsoundness is off the value.js-consumed path)` →
  `FOLD-LANDED — FIX per D4 owner decision: parse-that A.W2 shipped (id,offset) composite key
  in 0.11.0; proof:packrat-sound GREEN; the 6-tranche item is CLOSED`
- Evidence: add `M-RECONCILIATION.md §4 (D4 owner decision); proof:packrat-sound GREEN on
  0.11.0 (WDM fix confirmed)`

Also update `docs/tranches/M/PROGRESS.md §"Open deferrals"` DM-4 row to match.

---

### Finding 4 — DM-17 disposition: RESOLVED-BY-KILL → RESOLVED-BY-FIX

**Evidence:** `docs/tranches/M/audit/deferred-ledger-M.md:175` DM-17 records: "RESOLVED-BY-KILL
(DM-4)". But since DM-4 is now FOLD-LANDED/FIX (Finding 3 above), DM-17's resolution form must
update accordingly. DM-17 was the `proof:packrat-sound` gate-absent item; it is moot because the
gate shipped (proof:packrat-sound is GREEN in parse-that 0.11.0) and the defect was genuinely
fixed (not merely killed/declared off-path).

**Cure (O.W2 S4):** Update `deferred-ledger-M.md` DM-17 row:
- Disposition: `RESOLVED-BY-KILL (DM-4)` → `RESOLVED-BY-FIX (D4 → parse-that A.W2; proof:packrat-sound GREEN on 0.11.0; gate shipped, defect fixed)`

---

### Finding 5 — DM-24 row absent from deferred-ledger-M.md

**Evidence:** M-RECONCILIATION.md §7 specifies the DM-24 row (N Stage HANDOFF) must be added
to `docs/tranches/M/audit/deferred-ledger-M.md` and `docs/tranches/M/PROGRESS.md §"Open
deferrals"`. Audit C13 confirms these rows were NOT applied (marked IMPL-OPEN in
M-RECONCILIATION.md). The DM-24 HANDOFF is referenced in O.md (Band F, O.W15 "N Stage unshelf,
DM-24") but is absent from the ledger, leaving the O.W15 wave with no ledger row to point at.

**Cure (O.W2 S5):** Apply M-RECONCILIATION.md §7 edit-spec: add DM-24 to
`deferred-ledger-M.md` and `PROGRESS.md §"Open deferrals"`:

```
| DM-24 | N Stage scene-switcher HANDOFF | N (2026-06-18) | Chronicity 0 (net-new) |
  HANDOFF (BC-gated: fires when glass-ui BC cut publishes with Band-2 dock redesign) |
  O.W15 (Band F) | M-RECONCILIATION.md §7; n-stage-impl branch carries the impl;
  DM-21 transposition in M.W-DESIGN-PAINT.md (wrongly cites "DM-21"; correct ref is DM-24
  per M-RECONCILIATION.md §7). |
```

Also fix the DM-21 transposition error in `docs/tranches/M/waves/M.W-DESIGN-PAINT.md`
(lines ~189 and ~279): replace `DM-21 HANDOFF fires` with `DM-24 HANDOFF fires`.

---

### Born-RED gate

**Gate name:** `proof:no-phantom-version` — NEW. Does not exist in `package.json` or `scripts/`.
Verified absent 2026-06-19: `grep "no-phantom-version" package.json` → no match;
`ls scripts/proof-no-phantom-version.mjs` → no such file.

**What it asserts (the REAL observable):** No `proof:*` script probes a version of a sibling
package that is VERIFIABLY UNPUBLISHED AND STRUCTURALLY CANNOT PUBLISH (i.e., the version is in
a released tranche's past — the BB tranche closed at 4.0.1, so `@mkbabb/glass-ui@4.1.0` is a
phantom). The gate distinguishes between:

1. **PENDING-on-future-publish** (legitimate): a probe on a version that has not published yet
   but WILL publish (e.g., the BC cut, value.js P). These are the three-state PENDING arms that
   must stay.
2. **PHANTOM** (stale): a probe on a version that the owning tranche's close-record proves can
   never publish (BB closed at 4.0.1; no BB version above 4.0.1 will ever publish).

**The phantom probe is the stale gate this wave cures.** The gate asserts: scanning
`scripts/proof-*.mjs` for hard-coded `@mkbabb/glass-ui` version sentinels finds ZERO entries
probing a version `≤4.0.1` that is stranded in a closed tranche (BB). After O.W2 S1 retargets
both arms to content-probes, the version-sentinel search finds zero stale entries → GREEN.

**Plant-a-failure (born-RED today, GREEN after cure):**

- **Born-RED today:** `scripts/proof-workaround-deletion.mjs` contains
  `"@mkbabb/glass-ui", version: "4.1.0"` at lines 216 and 228. Running
  `proof:no-phantom-version` finds these two matches in a closed-tranche version check →
  exits 1 (RED). The gate scans `scripts/proof-*.mjs` for the phantom sentinel pattern.
- **Green condition:** Both lines are retargeted to content-probes (no hard-coded `"4.1.0"`
  sentinel remains in any `proof:*` script); `proof:no-phantom-version` finds zero phantom
  version probes → exits 0.
- **Regression-catch:** If a future wave re-introduces a hard-coded version sentinel for a
  closed tranche, the gate reds. The gate does NOT red on legitimate future-version probes
  (a sentinel like `"version": "5.0.0"` in a PENDING arm for BC is acceptable — BC is not yet
  closed).

**Scope of the scan:** `scripts/proof-*.mjs` for patterns matching
`version:\s*["']\d+\.\d+\.\d+["']` where the version is provably below the current
published latest of the same package AND the owning tranche is CLOSED. The initial list is
anchored by the known closed-tranche versions at O authoring time:
- `@mkbabb/glass-ui` BB tranche closed at `4.0.1` → any sentinel `< 4.1.0` that is NOT
  the content-probe form is PHANTOM.

**Wire into:** `proof:hygiene` roster (a source-shape / data-model gate — the static axis per
inv-M-two-axis). It is NOT a browser gate and runs in < 1s.

**Gate file:** `scripts/proof-no-phantom-version.mjs` (NEW — this wave authors it born-RED).

---

## Dependencies

- **No sibling dep.** Every action in O.W2 is kf-internal: editing `scripts/` source files and
  `docs/tranches/M/` ledger files. Zero sibling publish gates this wave.
- **Parallel with O.W1.** O.W1 (lint tier) and O.W2 (honest correction) are independent Band-A
  waves; neither blocks the other.
- **O.W5 (Band C) companion.** O.W2 S2 retires `proof:control-point-live`; O.W5 builds
  `DemoControlPoint` and authors `proof:demo-control-point`. O.W2 must precede O.W5 (the
  retirement must happen before the build-in gate can claim the ground). O.W2 does NOT depend
  on O.W5 — the retirement is independently correct even before the build-in exists.
- **O.W12 (Band F) forward seam.** O.W2 S1 retargets S1/S2 probes to content-probes. O.W12
  (the BC consume wave) is the event that causes S1/S2 to flip GREEN. O.W2 only ensures the
  probes point at the right observable; O.W12 performs the deletions.
- **M-RECONCILIATION.md edit-specs.** O.W2 closes these IMPL-OPEN items:
  `M-RECONCILIATION.md §1` (S1/S2 retarget), the DM-4/DM-17 ledger updates (§4 D4 owner
  decision), and the DM-24 row addition (§7).

---

## Bite — what regression each S-clause catches

| S-clause | Regression it prevents |
|----------|----------------------|
| S1 — S1/S2 probe retarget | The workaround-deletion gate NEVER reds S1/S2 even after BC ships the actual fix, because the `"4.1.0"` sentinel blocks on a version that never publishes → the deletions are OVERDUE but the gate stays PENDING forever (observable-truth violation: the gate hides the overdue state) |
| S2 — retire proof:control-point-live | A permanently-RED CI tripwire blocks the auto deploy round-trip on a gap kf decided NOT to close via glass-ui (noise that masks real failures); removes one of the two `check-failures` blockers on the round-trip |
| S3 — DM-4 KILL→FIX | The ledger claims a 6-tranche item is KILLED (off-path) when the defect was actually FIXED (A.W2 shipped the WDM cure); a KILL that should read FIX misleads the next tranche about whether a sibling action is still owed |
| S4 — DM-17 RESOLVED-BY-KILL→FIX | Same incorrect resolution form as DM-4 propagated to the gate-absent tracking row |
| S5 — DM-24 add | O.W15 (Band F, N Stage unshelf) has no ledger row to point at; `proof:chronic-closure` at O.WZ has no DM-24 row to classify as HANDOFF (the missing row leaves P-inv-28 tracking incomplete for the N Stage item) |
| gate — proof:no-phantom-version | A future wave re-introduces a hard-coded version sentinel for a closed tranche, silently holding a workaround in PENDING on a version that can never publish; this gate reds immediately and names the phantom |

---

## dev→impl boundary

This is the implementation-authorization wave for the honest-correction actions. The actions are:
1. Edit `scripts/proof-workaround-deletion.mjs` S1/S2 arms (lines 216, 228) — retarget from
   version sentinel to content-probe.
2. Delete `scripts/proof-control-point-live.mjs`; remove its `package.json` + `ci.yml` entries.
3. Update `docs/tranches/M/audit/deferred-ledger-M.md` DM-4 and DM-17 rows.
4. Add DM-24 row to `deferred-ledger-M.md` + `PROGRESS.md §"Open deferrals"`.
5. Fix the DM-21 transposition in `M.W-DESIGN-PAINT.md`.
6. Author `scripts/proof-no-phantom-version.mjs` born-RED (the gate-first obligation).
7. Wire `proof:no-phantom-version` into `package.json` and `proof:hygiene`.

IMPLEMENTATION opens on the owner's explicit authorization. No engine, demo, or library source
is modified.
