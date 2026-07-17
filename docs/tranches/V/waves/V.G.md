# V.G — COORDINATION (W12)

The bi-directional channel. The FORMATION-TIME packets (glass batch letter,
value.js coordination letter, atlas reply) ship at formation close — they are
formation deliverables, already drafted from CC/RG/EE evidence and delivered
as bounded inbox files per the constellation convention. W12 owns the
EXECUTION-TIME half.

---

# V.W12 - Constellation Packets & Ledger Terminal

**Name**: W12 - Constellation Packets & Ledger Terminal
**Opens after**: tranche open (standing; discharge points at W2/W3 and close)
**Agents**: 1
**Hard gate**: every inbound row terminal in `../coordination/INBOUND-LEDGER.md`;
every outbound ask carries a sibling-side owner row or a recorded MISSING
escalation; the execution-time relays delivered
**Status**: planned

### Goal criterion

Nothing crosses the constellation silently in either direction: every packet
is marked, owned, and answered at its boundary.

### Scope

1. Execution-time relays: W3's evidence tuple → the atlas inbox
   (`sci-report/atlas/docs/tranches/P/coordination/`, the two-atlas
   disambiguation honored); consume confirmations → glass + value inboxes at
   the same boundary.
2. At the Glass 7 packet's arrival: verify the formation-time glass batch
   letter's rows acquired Glass-side owner rows (their INBOUND-MARKS
   discipline); record MISSING rows for escalation rather than re-sending
   piecemeal.
3. GCF-03 status confirm (DISPOSITIONS gap): read-only check that it is a
   decided SCI row, not a kf-side orphan; record the verdict.
4. Value.js boundary: record their D-GAP-6 ship-or-decline answer when it
   arrives (BANKED row's re-trigger); confirm W17b ordering alignment at
   their boundary.
5. Terminalize `INBOUND-LEDGER.md` (every row → DONE/ANSWERED/ESCALATED) and
   record the MEMORY re-pins (W10 Scope 10) as executed.

### Triumvirate Dispatch

Triggers: a sibling-side owner row still MISSING after two of their boundaries;
GCF-03 unresolvable read-only; a third loop on any relay.

### File Bounds

| File | Access |
|---|---|
| `docs/tranches/V/coordination/**` | modify |
| one bounded file per sibling inbox per boundary | create |

Do NOT touch: sibling files (new inbox files only, never edits); sealed U
packets.

### Hard Gate

1. INBOUND-LEDGER walk: zero un-terminal rows.
2. Outbound ledger: every ask → sibling owner row citation or MISSING record.
3. Delivered inbox files listed with paths.

### Verification Artefacts / Commit Plan

The ledger walks; `docs(V·W12)` commits.

### Dependencies

- **Depends on**: W2/W3 for the relays. **Blocks**: W13.
