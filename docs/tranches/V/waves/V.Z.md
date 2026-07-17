# V.Z — CLOSE (W13)

---

# V.W13 - Close Ceremony

**Name**: W13 - Close Ceremony
**Opens after**: W1–W12 terminal
**Agents**: 1 orchestrator + 3 read-only audit lanes (the canonical
close-audit exception to the implementation ceiling)
**Hard gate**: the close-honesty checklist; ι integrity sweep clean; zero
un-terminal ledger rows
**Status**: last

### Goal criterion

FINAL-V reconciles the tranche's aim against the landed work with every claim
grounded — and, having audited U's close from the outside, V's own close
survives the same adversarial reading.

### Scope

1. Ledger walk: `PROMPT-RECAP-V.md` (68 rows: 42 charter V- rows + 10 U-carry +
   6 handoff + 5 formation-time incl. the FM-4/FM-5 ratification addendum +
   5 inbound) + `DISPOSITIONS.md` (52 rows) +
   `coordination/INBOUND-LEDGER.md` — zero un-terminal rows; goal-misses
   close `complete_with_misses`, never silently.
2. π/DELTA archive verification: the BEFORE set copied from
   `audit/design-captures/` (40 PNGs) into `screenshots/before/` at W11 open,
   AFTER captures in `screenshots/after/`, + `DELTA.md` complete per page; the
   W3 native-matrix record present. Declared captures missing on disk are a
   close-blocker.
3. ι integrity sweep: `git reflog --since=<open>` for agent-attributed
   mutating operations; `git stash list` across the repo and any worktrees;
   `git log --since=<open> -- docs/precepts/` empty; extended to the
   successor clone.
4. Close-audit lanes (3, read-only): plan-vs-landed; gate-can-fail re-probe
   (each MAKE-REAL's red witness re-checked); doc/ledger drift.
5. FINAL-V: outcome, measured tables (re-measured live, never inherited —
   the PL-1 lesson), release/deploy packets if any cut occurred, constellation
   boundary state, the verification record, closure checklist.
6. Close prose discipline: absolute wave/close counts re-measured at close
   time; no "no backlog" claims — name the standing external boundaries
   explicitly (the CH-01 lesson).

### Triumvirate Dispatch

Triggers: ι red (any unauthorized mutation); a close-audit lane returning
P0/P1; any evidence path failing to resolve during the walk.

### File Bounds

| File | Access |
|---|---|
| `docs/tranches/V/**` | create/modify |

Do NOT touch: everything else.

### Hard Gate

1. Close-honesty checklist walked in FINAL-V (every MET gate's evidence path
   resolves; status words match latest runs).
2. ι clean (zero unauthorized mutations, zero agent stashes, precepts
   untouched).
3. The 3 close-audit lanes return; findings absorbed BEFORE FINAL-V is final.

### Verification Artefacts

FINAL-V.md; the ι log; close-audit lane reports under `audit/`.

### Commit Plan

`docs(V·close): FINAL-V` after absorption; PROGRESS matches reality first.

### Dependencies

- **Depends on**: everything. **Blocks**: nothing (W-next inherits only named
  external boundaries).
