# V.W9 — Prune Tombstones

The prune-sweep unit's deletion/fold ledger (executes R2-07's PRUNE/FOLD rows).
One line per removal, with the live-consumer grep that cleared it. Staged on
`v/w9-staging` for post-W2 landing. Every target was grepped across
`src/ test/ bench/ scripts/ .github/` before removal — a live consumer would
have vetoed the delete (none did).

## Deletions (files)

- **`bench/taxonomy.json`** (654 L) — PF-1/PF-2. Inert (no gate/script/test READS
  it) AND wrong (23 interp-buffer rows, 0 matching the 7 live cases). The 5 prose
  references (`src/animation/engine/interpolate.ts:259`,
  `bench/resolve.bench.ts:6`, `bench/group-composite.bench.ts:29`,
  `bench/cold-import.bench.ts:25`, `bench/spring-tick.bench.ts:233`) are COMMENTS,
  not reads → orphaned prose routed to the DOC wave (XB-05 / PF-3), not W9.
- **`bench/group-soa-integration.mjs`** (66 L) — PF-5. Orphan spike; no runner,
  zero content references (`grep -rn group-soa-integration` = none). Compositor
  SoA decision sealed.
- **`bench/typed-om-validate.mjs`** (184 L) — R2-07 orphan row. No runner; the only
  external reference was `bench/taxonomy.json` (deleted here too).
- **`bench/d3-changed-keys.measure.test.ts`** (63 L) — R2-07 orphan row. Matches
  neither the `bench/*.bench.ts` benchmark glob nor `test/**` → no runner; nothing
  imports it.
- **`bench/sync-step.measure.test.ts`** (199 L) — R2-07 orphan row. Same: orphan
  `.measure.test.ts`, no runner. The two references
  (`test/physics/sync-step.test.ts:24`, `bench/sync-step.bench.ts:129`) are PROSE
  comments (already citing a stale `test/…` path) → doc-wave cleanup, not a
  consumer. `sync-step.bench.ts` (the live perf bench) is untouched.
- **`scripts/probe-webkit-linear-accel.mjs`** — R2-07 orphan-instrument row +
  V-32. Self-labeled "NOT a CI gate"; no runner/reference (`grep` = file only).

## Already absent (recorded, no deletion made)

- **`scripts/baselines/visual-lock/` (the 44 diff PNGs, GS-05)** — the directory
  does NOT exist on this tree (no tracked files: `git ls-files | grep visual-lock`
  = empty; no untracked dir). Already gone; nothing to delete. `gates/visual/`
  references `visual-lock` only in PROSE (describing the retired `proof:visual-lock`
  it superseded), not as a live path.

## Folds (edits, not deletions)

- **`test/engine/zero-alloc.test.ts` — the gc arm PRUNED (TC-3).** Removed the
  `it("heap-delta over a steady-state window ≈ 0 …")` block: without `--expose-gc`
  it was a permanent `expect(true).toBe(true)` tautology. The deterministic
  buffer-identity arms (the real, portable bite) STAY.
- **`test/group/group-snapshot-identity.test.ts` — the `it.fails` wrapper FOLDED
  (TC-6).** Removed the `it.fails("g.hydrate(g.serialize()) is an identity …")`
  round-trip + its orphaned `clockOf` helper. The positive control
  (`typeof g.serialize !== "function"`) STAYS — it already flips RED the instant
  the engine ships the seam, so the HANDOFF signal is preserved without the
  double-count R2-07 forbade. Seam confirmed absent this tree (grep
  `src/animation/group/` for `serialize`/`hydrate` = only an unrelated comment).

## Relabel (GS-03 — out of the proof namespace)

- **`proof:owner-golden` → `review:owner-golden`.** `package.json` script key +
  the 6 self-label strings in `scripts/gates/visual/index.mjs` (its enforcing dHash
  leg runs in no workflow — it is a manual review harness, not a proof gate). The
  14-frame owner blessing set is untouched; MR1's per-scene render assert covers
  the "blank ships green" boundary more cheaply. `demo/DESIGN.md`'s prose "owner-
  golden" reference is demo-scope (do-not-touch) → doc wave.

## V-32 — scripts-tree residual re-measure (post-U)

`wc -l` + colocation scan over `scripts/**` (31 files). Every surviving file is an
R2-07 KEEP with a live runner/reference and sits under a purposeful subtree
(`build/vite/`, `gates/{structure,surface,visual}/`, `lib/`, `observe/{demo,}`,
`release/`) — no flat orphan, no mis-colocation. The ONLY residual orphan the
sweep surfaced was `probe-webkit-linear-accel.mjs` (pruned above). U cleared the
tree as expected; no additional prune.
