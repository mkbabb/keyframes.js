# V.E — DOC CANON (W10)

Executes the correction manifest `../audit/R2-08-doc-manifest.md` (DM-01..19:
file:line → exact replacement text, with DO-NOT-EDIT guards DM-03..06), as
amended by XB-03 (DM-18 ordering vs the V.C moves; re-grep by token) and
XB-08 (DM-08's anchor corrected to :21/:22/:23) and extended by XB-05 (the 4
bench taxonomy-comment folds ride with PF-3/PB-1).

---

# V.W10 - Doc Canon Corrections

**Name**: W10 - Doc Canon Corrections
**Opens after**: tranche open; the DM-18 subset runs before or inside W7/W8
(XB-03)
**Agents**: 1
**Hard gate**: the manifest applied row-for-row with the guards intact; llms
artifacts regenerated and the agent-surface check green; battery green
**Status**: planned

### Goal criterion

Every documentary surface tells the truth about the 6.0.0/Value-4/Glass-7
reality — corrected surgically, with the live weighted-blend feature prose
untouched.

### Scope

1. DM-01: regenerate `llms.txt`/`llms-full.txt` via `gen-agent-surface.mjs`;
   make `--check` a real diff-and-exit; wire it as the agent-surface check
   (one site — inside `proof:publish`'s battery or the CI gates job, not a
   new proof genre).
2. DM-02/07/08(as amended)/DR rows: README `weighted-blend` → `weight-blend`;
   DESIGN.md:67 `Card cartoon`; CHANGELOG 6.0.0 two breaking bullets
   (printWidth; BlendMode/'weighted' op) at the corrected anchor.
3. GUARDS DM-03..06 honored: README:322/433/764 + published-surface.md:151
   weighted prose is LIVE feature copy — NOT edited (CH-03 refuted the
   handoff's blanket list).
4. DM-10/11/12/13/14/15: FINAL-U SUPERSEDED annotations (boundary → the
   Glass-7/K6/atlas-7.0.0 rail; "no V backlog" → the handoff ledger;
   "terminal 5.3.4" → 6.0.0; MbabbMenu row RETIRED with the :6 evidence;
   the 77-file measurement corrected via annotation — FINAL-U is
   frozen-history, so annotate, never rewrite originals).
5. DM-16/17: ci.yml weekly relabel (4 comment lines); dogfood-inversion.md:48
   past tense.
6. DM-18 (token-grepped at execution): the ~15 stale glass-ui 3.4/4.0.x era
   comments → Glass-7 baseline; the two modelValue rationale comments stay
   pending the Glass-side contract check (tracked in the glass packet).
7. XB-05: the 4 bench taxonomy comments + `interpolate.ts:257-259` provenance
   line re-pointed to the surviving `NumericFoldPlan · K=8` case (PB-1's
   exact wording), dropping the 'floor' framing.
8. GS-04: the depcruise known-violations paragraph replaced with the true
   post-R.W1 acyclic invariant statement.
9. Docs note recording the retired mirror convention (from W4) and the
   phantom-gate rows in demo/DESIGN.md:238,253.
10. MEMORY re-pins recorded as a wave output for the orchestrator (Atlas
    2.0 → atlas 7.0.0; the glass consume-edge note) — memory is
    session-side, not repo bytes.
11. The exact-pin rationale line (IN-ATLAS-2, confirmed by CC-02) lands in
    `docs/published-surface.md`: the exact `@mkbabb/value.js@4.0.0` pin is
    deliberate — every constellation consume-edge is a measured,
    integrity-pinned edge; value patches reach consumers via the smallest
    honest keyframes successor, never range drift.
12. CT-03 (R1-09): `kf-engine.ts`'s "consumes the PUBLISHED barrel" prose
    reworded to the true self-alias mechanics (the alias serves glass-ui
    dedup; demo consumes src).

### Triumvirate Dispatch

Triggers: a manifest row whose anchor no longer exists (halt, re-derive by
token); any edit touching a DO-NOT-EDIT guard row.

### File Bounds

| File | Access |
|---|---|
| the DM manifest's named files (R2-08 table) | modify |
| `llms.txt` / `llms-full.txt` | regenerate |
| `bench/*.bench.ts` comment lines (XB-05) | modify |
| `src/animation/engine/interpolate.ts:257-259` | modify (comment only) |
| `ci.yml` (DM-16/17 weekly relabel) + demo `.vue` DM-18 provenance comments + `kf-engine.ts` CT-03 prose | modify (comment/prose only) |

Do NOT touch: the guarded README/published-surface lines; sealed U letters
(KF-TO-*-U.md bodies — annotations go in V docs, not U's sealed packets).

### Hard Gate

1. Row-for-row application log (row → applied/guarded/deferred-with-reason).
2. `node scripts/gen-agent-surface.mjs --check` exits 0; getTimingFunction
   absent from llms artifacts.
3. Battery green; `git diff --check` clean.

### Format And Lint Cadence

Battery at close (comment-only source edits still typecheck).

### Verification Artefacts

The application log; llms regen diff summary.

### Commit Plan

`docs(canon): the V correction manifest` (+ separate
`chore(bench): taxonomy comment folds` if bench files move with it).

### Dependencies

- **Depends on**: none (DM-18 subset coordinates with W7/W8).
- **Blocks**: W13.
