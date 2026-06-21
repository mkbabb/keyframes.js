# P.W12 — glass-ui 4.1.0 consume: S2 delete NOW + S1 GATED on aria-guard

**Band:** G — glass-ui BC consume
**Phase:** GATED (two-speed: S2 NOW-actionable on re-pin to `~4.1.0`; S1 GATED on the pending
aria-guard SFC wave — the O.W11 dispatch)
**Sequence:** O.W11 (BC aria-orientation SFC dispatch COMMUNICATED) → **P.W12** → P.WZ close
**Owning chronic/DM:** DM-1 (RF-17 dock click-strand interim, chronicity **6 at P** — the
P-inv-28 CRITICAL belt; NO 7th carry; the contingency KILL record from `deferred-ledger-O.md §6`
carries forward, VOID the instant BC ships); DM-5 S1 (aria-orientation suppress, chronicity 4 at
P — HANDOFF on BC SFC guard; separately tracked from S2)

O-substrate: **O.W12** (the full BC-cut atomic consume design). Delta from O.W12 to P.W12:

- O.W12 was authored against the glass-ui BC cut (version placeholder `~<BC>.x`). P.W12
  CORRECTS the premise: **glass-ui 4.1.0 IS published** (`npm show @mkbabb/glass-ui version →
  4.1.0`; confirmed 2026-06-20). The BC cut IS 4.1.0. kf is currently pinned to `~4.0.0`
  (`package.json optionalDependencies`).
- O.W12 treated S1 and S2 as a single atomic delete. **P.W12 SPLITS them**: S2 is deletable NOW
  (the `useDockClickIntegrity` content-present check fires on the 4.0.1 dist already; the re-pin
  to `~4.1.0` makes it fully actionable); S1 is **NOT** — `SegmentedTabs.vue:406` at 4.1.0 still
  emits `:aria-orientation` unconditionally on `role=group`. Deleting S1 on the current 4.1.0
  would reintroduce the ARIA-1.2 §6.3 violation (attribute prohibited on `role=group`).
- Gate hygiene corrected (AUDIT-DIGEST F1/K5 + P PROGRESS §4 `DP-1`): the live
  `proof-workaround-deletion.mjs` S1 and S2 arms BOTH probe `glass-ui@4.1.0` as the sibling
  sentinel. Since 4.1.0 IS now published, the gate now shows `PUBLISHED` for both — but the S1
  arm would go RED on the aria-guard that is NOT in 4.1.0. P.W12 replaces both version-sentinel
  probes with **content-present probes**: the S2 tripwire becomes `grep 'useDockClickIntegrity'`
  in the installed dist; the S1 tripwire becomes the presence of the conditional aria-guard
  (`grep 'aria-orientation.*tablist'` or the equivalent SFC conditional expression) in the
  installed `tabs.js`.
- The crossfade-strand verification (O.W12 §S3 constraint) is the same: before deleting S2,
  run `proof:live-session` S5 (motion-path PLAY through a dock collapse/expand) on the
  4.1.0-consumed demo to confirm `useDockClickIntegrity` actually cures the strand. This is a
  verification step at impl time, not a CI gate — the AUDIT-DIGEST A3 finding holds.

---

## Context

The state at P authoring (2026-06-20):

- glass-ui **4.1.0 IS published** (the BC cut). kf `package.json` is `~4.0.0`. The re-pin to
  `~4.1.0` is the S2 gate event.
- `useDockClickIntegrity` IS present in the **installed** glass-ui 4.0.1 dist at
  `node_modules/@mkbabb/glass-ui/dist/dock.js:534` (AUDIT-DIGEST A2 confirmed; live grep
  confirms 1 hit). The workaround IS deletable — the dock crossfade cure has been in the dist
  since 4.0.1; the kf-side delete just needed the BC re-pin to anchor the consume record.
- `SegmentedTabs.vue:406` in the 4.1.0 published package STILL emits `:aria-orientation`
  unconditionally (audit PROGRESS.md §4 `DP-1` + K5/F1 findings). The S1 suppress lines at
  `demo/spring/SpringSidebar.vue:43` AND
  `demo/@/components/custom/animation-controls/controls/AnimationControls.vue:72` are **still
  correct and must NOT be deleted** until the BC SFC guard lands in a subsequent glass-ui release.
- `proof:workaround-deletion` S1 arm: **PENDING** (2 PRESENT suppress sites; the S1 version
  sentinel at `glass-ui@4.1.0` now shows PUBLISHED — but the aria guard is NOT in that version;
  the arm needs the content-present probe correction before it can accurately track).
- `proof:workaround-deletion` S2 arm: **PENDING** (9 PRESENT interim hits in `TransportDock.vue`;
  the S2 version sentinel at `glass-ui@4.1.0` now shows PUBLISHED + `useDockClickIntegrity`
  IS in the dist → after gate correction, S2 becomes **RED** (overdue delete), which is correct:
  the root cure IS published, kf has NOT consumed).

### Audit evidence

| Ref | Source location | Fact (verified 2026-06-20) |
|-----|-----------------|---------------------------|
| AUDIT-DIGEST F1, K5 | `SegmentedTabs.vue:406` at 4.1.0 dist | `:aria-orientation` bound unconditionally — `isUnderline` conditional guard ABSENT |
| AUDIT-DIGEST A2 | `node_modules/@mkbabb/glass-ui/dist/dock.js:534` | `useDockClickIntegrity` — 1 hit confirmed; cure IS in the installed dist |
| AUDIT-DIGEST A3 | `demo/@/components/custom/animation-controls/TransportDock.vue:313` | K.W1 RE-OBSERVED: `useDockClickIntegrity` guards identity-changed click but does NOT subsume the crossfade-strand case; S2 correctly retained until crossfade-strand verified cured |
| AUDIT-DIGEST A2 | `scripts/proof-workaround-deletion.mjs:216,228` | both S1 + S2 sibling probes at `glass-ui@4.1.0` — now shows PUBLISHED; the content-present probe is the correct replacement |
| P PROGRESS §4 DP-1 | P PROGRESS.md §4 | `DP-1` records the S1 false-RED risk + S2 now-deletable finding as an explicit net-new P obligation |
| npm registry | `npm show @mkbabb/glass-ui version → 4.1.0` | BC cut IS published; `package.json ~4.0.0` needs bump to `~4.1.0` |
| O.W11 | `docs/tranches/O/waves/O.W11.md` | O.W11 dispatch COMMUNICATED (O.md RATIFIED header — `KF-O-ARIA-CORRECTION.md` dropped in BC inbound); BC owns the net-new SFC-guard wave; kf S1 delete gates on it |
| DM-1 | `P/PROGRESS.md §3` | DM-1 RF-17 dock interim at chronicity **6** at P — P-inv-28 CRITICAL belt; NO 7th carry |

---

## Scope

### S1 — Correct `proof:workaround-deletion` gate arms (pre-consume, gate hygiene NOW)

**Breach.** Both S1 and S2 arms in `scripts/proof-workaround-deletion.mjs` carry
`sibling: { pkg: '@mkbabb/glass-ui', version: '4.1.0' }`. Since 4.1.0 IS now published, the
version sentinel fires PUBLISHED for both arms. For S2 this is correct — the root cure IS in
the dist. For S1 this produces a **false RED**: the S1 aria-guard (`role=group` conditional) is
NOT in 4.1.0, so the S1 arm going RED would demand a delete that would reintroduce the ARIA
violation. The gate must accurately distinguish the two arms.

**Cure.** Replace BOTH version sentinels with **content-present probes** in the S1 and S2 arm
`sibling` / `apiPresent` configurations:

- **S2 probe (dock fix present):** `grep 'useDockClickIntegrity'` over the installed
  `node_modules/@mkbabb/glass-ui/dist/dock.js`. If hit count > 0, the fix is present → PUBLISHED
  for S2. This probe already reflects the real 4.0.1+ dist rather than a version number.
- **S1 probe (aria-guard present):** `grep` the installed
  `node_modules/@mkbabb/glass-ui/dist/tabs.js` (or equivalent compiled output of
  `SegmentedTabs.vue`) for a conditional expression that gates `aria-orientation` on
  `isUnderline`/`role===tablist` (e.g., the pattern `aria-orientation.*isUnderline` or
  `isVertical.*isUnderline` near the role binding). Absence of this guard → fix NOT present →
  PENDING. Presence → fix landed → S1 becomes actionable.

The version-number field in the S2 arm shifts to the INSTALLED package version (checked via
`node_modules/@mkbabb/glass-ui/package.json`) compared against `4.1.0` as the floor for the
re-pin record. The sibling name clarifies: `name: 'BC dock crossfade-strand cure (useDockClickIntegrity, content-present)'`.

**Gate bite.** After the hygiene fix: S2 arm transitions to RED (the cure IS in the dist; the
workaround is PRESENT and the delete is OVERDUE). S1 arm stays PENDING (the aria-guard is NOT in
4.1.0; the probe accurately reports UNPUBLISHED). This is the correct born-RED form: S2 demands
action, S1 correctly holds.

---

### S2 — Re-pin glass-ui to `~4.1.0` (the atomic gate event)

**Breach.** `package.json optionalDependencies['@mkbabb/glass-ui']` is `~4.0.0`. The BC cut
(4.1.0) is published. kf is not consuming the latest glass-ui.

**Cure.** Bump `~4.0.0` → `~4.1.0` in `package.json optionalDependencies`. Re-install so the
lockfile resolves 4.1.0. This is the atomic gate event that fires the S3 dock delete.

**Gate bite.** `proof:peer-satisfied` exits 0 on the 4.1.0 pin (the peer range `>=4.0.0`
admits 4.1.0; the peer-cycle is clear from the M consume). `proof:workaround-deletion` S2 arm
transitions: PUBLISHED + fix content-present + workaround PRESENT → **RED** (signalling the
delete is now SAFE and OVERDUE). The delete (S3) follows in the same commit.

---

### S3 — Delete the `pointerHandled`/`onPlayPointerDown` RF-17 dock interim (S2 arm consume)

**Gating condition:** re-pin to `~4.1.0` done (S2) + `proof:live-session` S5 (motion-path PLAY
through a dock collapse/expand cycle on the 4.1.0-consumed demo) passes — confirming the
crossfade-strand root cause is eliminated by `useDockClickIntegrity` in 4.1.0.

**Breach.** `TransportDock.vue` carries 9 hits of `pointerHandled`/`onPlayPointerDown` (lines
15, 151, 196, 342, 348, 358, 361, 366, 373 per O.W12 / M.W8 audit; verified live grep confirms
pattern present 2026-06-20). DM-1 chronicity is **6 at P** (I,J,K,L,M,O→P). P-inv-28 CRITICAL
belt: **no 7th carry under any scenario.** The contingency KILL record from
`deferred-ledger-O.md §6` carries forward and voids the moment BC ships (which it has at 4.1.0).

**Cure (GATED on re-pin + crossfade-strand verification).** Delete the entire interim in ONE
atomic commit with S2:

- `pointerHandled` flag declaration (`TransportDock.vue:348`) and all assignment/read sites
- `onPlayPointerDown` declaration (`TransportDock.vue:358-373`) + all template bindings
  (lines 151, 196)
- `if (pointerHandled) return` guard in `onPlayClick`
- The K.W1 RE-OBSERVED documentation comment block (`TransportDock.vue:313-338`)

The play-button toggle reverts to a plain `@click="onPlayClick"` directly emitting
`emit("togglePlay")`. `useDockClickIntegrity` (already in the 4.1.0 dist) handles the
identity-changed-click case at the glass-ui layer.

**Crossfade-strand verification constraint (AUDIT-DIGEST A3).** `useDockClickIntegrity` guards
identity-changed clicks but the TransportDock.vue:313 comment (K.W1 RE-OBSERVED) documents the
crossfade-strand case as a distinct live root. Before deleting S2, run `proof:live-session` S5
on the 4.1.0-consumed demo: actuate the motion-path scene PLAY button through a dock
collapse/expand cycle. ONLY if the dock does not double-toggle does the 4.1.0 dock engine
eliminate the strand root. If the strand persists, S3 is held and a new BC dispatch is filed
per the contingency — but the P-inv-28 6-tranche belt means the contingency KILL record voids
immediately on that outcome (the dock interim is KILLED, not carried, under the no-workaround
precept; a fresh minimal click handler with no workaround shape is the replacement).

**Gate bite.** `proof:workaround-deletion` S2 arm asserts zero `/pointerHandled|onPlayPointerDown/`
in `TransportDock.vue`. After deletion: GREEN. DM-1 exits the ledger at chronicity 6 (CLOSED).

---

### S4 — S1 stays GATED (the split — NOT deleted in P.W12)

**The constraint.** `SegmentedTabs.vue:406` at 4.1.0 STILL emits `:aria-orientation`
unconditionally — the `isUnderline` conditional guard is absent from the published 4.1.0 dist
(`tabs.js`). Deleting either of the two kf S1 suppress lines on 4.1.0 would expose the
ARIA-1.2 §6.3 violation on every pill-strip render (attribute prohibited on `role=group`).

The O.W11 dispatch (COMMUNICATED, O.md RATIFIED header) filed the corrected ASK with BC:
emit `:aria-orientation` only when `isUnderline` / `role===tablist`; omit it when `role=group`.
That ASK must be received AND a net-new BC SFC-guard wave must ship before kf can safely delete.

**S1 state at P.W12 close:** PENDING — workaround PRESENT + BC SFC-guard NOT shipped. The gate
correctly holds. No kf-local guard is added (that would be a new workaround, not a deletion). S1
exits ONLY when the BC SFC-guard SFC wave publishes in a future glass-ui release (e.g., `4.2.x`
or later) AND the content-present probe confirms the conditional guard is in the dist.

**DM-5 S1 disposition:** HANDOFF → BC SFC-guard publish. Chronicity 4 at P (K,L,M,O→P).
Named terminal: BC authoring the `role=group` conditional wave (dispatched O.W11). P-inv-28
belt at 4 — no 5th carry; if BC does not ship the guard before P.WZ close, the contingency
path is: (a) author a kf-internal no-workaround replacement (a `v-if` / scoped CSS suppression
at the call site that is NOT a `.vue` template bind of the attribute to undefined, but a proper
aria-role guard) as a KILL of the workaround shape, clearly not a "set to undefined" band-aid;
(b) re-escalate the BC dispatch. The timeline pressure is explicit in the P.WZ close criteria.

---

## Born-RED gate

**Gates used (S1 EXISTING + S2 EXISTING, both corrected; no new gate script authored):**

- `proof:workaround-deletion` S1 arm — corrected from version-sentinel to content-present probe;
  stays PENDING after correction (BC SFC guard not in 4.1.0)
- `proof:workaround-deletion` S2 arm — corrected from version-sentinel to content-present probe;
  transitions to RED after correction (root fix IS in dist, workaround PRESENT, delete OVERDUE)
- `proof:peer-satisfied` — GREEN today (cleared at M-consume on glass-ui 4.0.1); must stay GREEN
  after the `~4.1.0` re-pin

**The S1 false-RED lesson (born-RED form).**

The REAL observable today: `npm show @mkbabb/glass-ui version → 4.1.0` is PUBLISHED, but the
installed `tabs.js` has no `aria-orientation.*isUnderline` conditional guard. If P.W12 S1 were
to check only the version, it would go RED and demand a delete that violates ARIA-1.2.
The content-present probe is the born-RED form — it is RED only when the FIX is genuinely
present AND the workaround is PRESENT. A PUBLISHED version without the fix stays PENDING.

**The S2 born-RED form.**

After gate correction: S2 arm shows PUBLISHED (content-present probe fires on dock.js) + PRESENT
(9 workaround hits in TransportDock.vue) → **RED**. This is the genuine born-RED state the gate
documents: the cure IS available, the deletion IS SAFE and OVERDUE. Impl is authorized to proceed
with S2 the moment the hygiene fix (S1) lands.

| Gate / clause | Witness today (glass-ui 4.0.1 installed, 4.1.0 published) | Failure mode today | Expected after P.W12 |
|---|---|---|---|
| S1 `proof:workaround-deletion` S1 arm | 2 PRESENT `:aria-orientation="undefined"` sites in `demo/` | With the corrected content-present probe: PENDING (BC guard absent from tabs.js) — with the stale version probe: false RED (4.1.0 published but guard not in it) | S1 arm PENDING-via-content-probe after hygiene fix; GREEN only when BC SFC guard ships |
| S2 `proof:workaround-deletion` S2 arm | 9 PRESENT `pointerHandled`/`onPlayPointerDown` hits in `TransportDock.vue` | With corrected probe: **RED** (useDockClickIntegrity IS in dock.js, workaround PRESENT) — delete is OVERDUE | S2 arm GREEN after atomic deletion + re-pin |
| S2 re-pin | `package.json ~4.0.0` | stale pin; 4.1.0 is live | `~4.1.0` bump → `proof:peer-satisfied` stays GREEN |
| `proof:live-session` S5 | not yet run on 4.1.0 | crossfade-strand case status unverified at 4.1.0 | S5 PASS → S3 delete authorized; S5 FAIL → contingency KILL path |

**Born-RED today (by construction):**
`proof:workaround-deletion` S2 arm transitions to RED after the gate hygiene fix — the
`useDockClickIntegrity` content-present probe fires on the installed dist, confirming the dock
root cure IS available, but 9 workaround hits remain in `TransportDock.vue`. S1 arm stays
PENDING (correct). The `~4.0.0` pin in `package.json` is the consume gap — the re-pin and
deletion are the impl actions.

**Green condition.**
1. Gate hygiene (S1): `proof:workaround-deletion` S2 arm corrected to content-present probe;
   S1 arm corrected to conditional-guard content-present probe.
2. `proof:live-session` S5 passes on the 4.1.0-consumed demo (crossfade-strand confirmed cured).
3. ONE atomic commit: re-pin `~4.1.0`; delete the 9 `pointerHandled`/`onPlayPointerDown` sites;
   delete the K.W1 RE-OBSERVED comment block.
4. `proof:workaround-deletion` S2 arm → GREEN. `proof:peer-satisfied` → GREEN.
5. S1 arm stays PENDING (correctly). DM-1 ledger entry closes at chronicity 6.

---

## Dependencies

- **O.W11 (glass-ui BC aria-orientation SFC dispatch COMMUNICATED)** — S4 (the S1 hold) is
  correctly gated on the O.W11 corrected ask propagating into a future BC wave. O.W11 is
  COMMUNICATED as of O.md RATIFIED header; BC owns the net-new SFC-guard wave.
- **glass-ui 4.1.0 (published, the BC cut)** — the S2/S3 atomic gate event. The BC cut IS
  published at 4.1.0 per registry (`npm show @mkbabb/glass-ui version → 4.1.0`, verified
  2026-06-20). The S2 gate is therefore OPEN — the pre-condition is met.
- **`proof:live-session` S5** — crossfade-strand verification on the 4.1.0-consumed demo.
  A verify step at impl time, NOT a CI gate.
- **P.WZ** — S1 PENDING state must resolve before P.WZ close (DM-5 S1 at chronicity 4 — the
  P-inv-28 belt is active). If BC does not ship the SFC guard before P.WZ, the contingency path
  (kf-internal no-workaround replacement or KILL escalation) is executed at P.WZ.

---

## dev→impl boundary

**Gate hygiene (S1 pre-delete hygiene):** kf-internal; may execute immediately on authorization.
Corrects `proof-workaround-deletion.mjs` S1 + S2 sibling probes from version-sentinel to
content-present probes. This is a gate-first action — it does not delete any workaround; it
only ensures the gate accurately reports the observable truth.

**S2 + S3 (re-pin + dock delete):** OPEN — the BC cut (4.1.0) IS published; `useDockClickIntegrity`
IS in the dist. Gate hygiene must precede. `proof:live-session` S5 must pass. Then ONE atomic
commit: re-pin + delete. Authorization to proceed requires the owner's explicit impl go.

**S4 (S1 hold):** NOT an impl action — it is a NON-action with a documented rationale. The
two suppress lines STAY. The gate must accurately show PENDING. No source change until the BC
SFC-guard wave publishes and the content-present probe fires.
