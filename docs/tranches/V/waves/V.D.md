# V.D — GATE/TEST TRUTH (W9)

Executes the prune blueprint `../audit/R2-07-gate-test-prune.md` (R2-07's
69-row keep/make-real/fold/prune table; rows cited by their originating
GS-/TC-/PF- IDs where R2-07 left them unnumbered), as amended
by XB-04 (mirror prune deferred to W4) and XB-05 (the 4 bench taxonomy
comments route to W10 with PF-3).

---

# V.W9 - Make-Real Quartet & Prune Sweep

**Name**: W9 - Make-Real Quartet & Prune Sweep
**Opens after**: tranche open for authoring; the yml/package edits LAND post-W2
(the W2 → W9 → W7/W8 single-writer chain). **MR4 executes FIRST** (first-after-W2;
hard precondition of the V.C band — XB-06); MR1's green flip waits on W1 landing.
**Agents**: 2 parallel (make-real unit; prune unit)
**Hard gate**: each MAKE-REAL carries a recorded red-case witness (it
demonstrably fails on its defect class); the prune set is deleted; battery
green
**Status**: planned (MR1 born RED against the current blank transaction —
witness already on record in `../audit/R2-04-adversarial-verify.md`)

### Goal criterion

Exactly four gates become real and everything vacuous is gone: after this
wave, no gate exists that cannot fail, and no boundary that bit us in this
audit is unguarded.

### Scope

1. **MR4** (first — meaning first-after-W2, since the yml/package edits land on
   the successor, not the stale base): `test:demo` script + CI gates-job step
   (`npx vitest run --project demo`, ~2s — AV-3 witness).
2. **MR1**: pageerror-key the render assert — `page.on('pageerror')`
   collector + per-scene `pageerror==0` in `scripts/observe/demo/smoke.mjs`,
   plus the PB-2 hooks in `usability.mjs` and `occlusion.mjs` (the three
   shape-only scripts). Red witness: the blank-transaction run (already
   recorded); the `[object Object]` text-scan from W1's harness folds in.
3. **MR2**: the 5 browser oracles into the weekly demo-correctness job
   (install chromium, `vitest run --project library` on the 5 files with the
   skipIf env satisfied). They pass 14/14 under a browser (AV-2) — the make-real
   is the SIGNAL, not a fix. Runner parity risk (system-Chrome vs pinned
   revision) recorded as the wave's watch item.
4. **MR3**: `deploy-pages.yml` — `require_demo_green` boolean input (default
   true); the two preflight asserts run under dispatch unless the input is
   explicitly false (documented break-glass). Non-dispatch path unchanged
   (AV-4: it already enforces).
5. **The prune set** (each a deletion with a one-line tombstone in the wave
   record): `bench/taxonomy.json` (PF-1/PF-2 — inert AND wrong); the
   zero-alloc gc arm (TC-3; buffer-identity arms stay); the 4 orphan bench
   artifacts (PF-5 + R2-07's orphan-artifact rows);
   `scripts/baselines/visual-lock/` 44 PNGs (GS-05);
   `probe-webkit-linear-accel.mjs` (R2-07's orphan-instrument row); the
   `it.fails` wrapper fold (TC-6; positive control stays); `proof:owner-golden`
   relabels to a manual review harness (GS-03: `review:owner-golden`, dropped
   from the proof namespace; the 14-frame blessing set is untouched).
6. TC-5: the shared `withSetup` mount harness for lifecycle-registering
   composable tests (three named test files move onto it).
7. BV-2 golden (from DISPOSITIONS): a born-checked numeric golden for the
   static-weight composite — symmetric triangle layers with `op:add` +
   `weight:0.5` must yield a symmetric composite (the observed monotonic
   growth past the peak is the red witness; `../audit/R2-02-behavior-claims.md`
   probe7). If the golden proves the growth is the K.W11 weight-spring ramp
   working as designed, record the semantics and close it as documentation.
8. Scripts-tree residual re-measure (PROMPT-RECAP V-32 gap): `wc -l` +
   colocation scan over `scripts/**` post-U; prune any residual orphan the
   sweep surfaces (expected small — U cleared the tree).

### Triumvirate Dispatch

Triggers: an MR that cannot produce a red witness (vacuity — halt, redesign);
CI runner divergence on MR2 (device-dependence archaeology: one pass, not
one-red-per-round); any prune with a live consumer discovered late; a third
diagnostic loop on one unit of work halts into triumvirate.

### File Bounds

| File | Access |
|---|---|
| `package.json` (test:demo, review:owner-golden keys), `.github/workflows/ci.yml`, `deploy-pages.yml` | modify |
| `scripts/observe/demo/{smoke,usability,occlusion}.mjs` | modify |
| the prune paths (Scope 5) | delete |
| `test/support/withSetup.ts` + the three composable test files | create/modify |

Do NOT touch: `proof:publish` spine (crown jewel — GP negative),
`mirror.test.ts` (W4 owns), the 122-file library suite bulk.

### Disjointness

Make-real unit: Scope 1–4, 6. Prune unit: Scope 5. Disjoint paths.

### Worktree Plan

Parallel units either commit-before-parallelize on the shared line or take
sibling worktrees `/Users/mkbabb/Programming/keyframes-v-w9<unit>` per
WAVE_SPEC §4b; the orchestrator runs `git worktree list` before dispatch.

### Agent Units

#### V.W9.a Make-Real Quartet
- Goal: the four boundary gates become real and loud (Scope 1–4, 6).
- Sub-gate: four red-case witnesses recorded (one per MAKE-REAL, per the Hard Gate).

#### V.W9.b Prune Sweep
- Goal: nothing vacuous survives (Scope 5).
- Sub-gate: tombstone list complete, battery green.

### Hard Gate

1. Four red-case witnesses on record (MR1: the blank-tree run; MR2: a
   deliberately-skipped-env run showing the old silent skip vs the new loud
   signal; MR3: a dry dispatch run showing the gate now evaluates; MR4: a
   deliberately-broken demo test run red in CI once, then reverted).
2. Prune tombstone list complete; `grep -r taxonomy.json bench/ scripts/`
   hits only W10's rewritten comments.
3. Battery green; the six observe scripts still run.

### Format And Lint Cadence

Battery after each unit; workflow YAML validated (`gh workflow view` or
actionlint if present).

### Verification Artefacts

Red-witness logs ×4; tombstone list; CI run links.

### Commit Plan

`feat(gates): the make-real quartet` + `chore(prune): gate/test superfluity`
(bodies list every deletion).

### Dependencies

- **Depends on**: W2 (the workflow files W9 edits are slice-carried; MR1's
  harness may be AUTHORED earlier against the audit copy, but the yml/package
  edits land post-W2).
- **Blocks**: W7/W8 (via MR4), W10 (ci.yml), W13.
