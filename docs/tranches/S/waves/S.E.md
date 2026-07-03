# S.E — Scene-stage resurrection · SHELVED (owner ruling 2026-07-03)

> **This band is SHELVED by owner ruling (2026-07-03) — it is NOT part of the implementable
> S wave set.** After a live review of the working pass-3 prototype the owner ruled:
> **"Looks awful. Scrap the scene selector for now, shelf it, and then remove those plans
> from the current wave set."** This document is the shelf RECORD that replaces the former
> S.E wave spec (the superseded spec's full design/build/critique corpus survives intact
> under `audit/pass3/` — frozen audit evidence). **No S.E waves exist; no S.E gate is
> authored, planted, or owed; nothing in Tranche S may depend on this band.** Re-opening
> requires a NEW owner ruling — no wave, recap row, or ledger disposition may treat this
> shelf as a deferral to be silently revived. **Branch:** `tranche-s-dev` (docs-only).

## What was built and converged (the honest record)

The pass-3 loop took DM-24 (the N-era DK-64 scene-switcher — dead twice at N, then shelved
with its spec) from first principles to a WORKING prototype: a drop-lighting DK-64 barrel
stage (tungsten key + warm pool + per-scene footlights), live LOD miniatures on one shared
`RAFPlayback` clock (1-full + 2-flank hysteresis), a full-3-D ring at the live-pinned
`rotateX(-15deg)` geometry, a Teleport-to-body overlay outside the `scene-subject` VT, and
the D1-locked commit funnel (browse verbs LOCKED during `committing`; destination-slot arm;
280ms dwell + 2000ms re-armable failsafe) that cured the H1 stale-arm class. It converged
**100/100 under paired design + technical critics across a 3-round loop** (70/~60 → 88/90 →
100/100 FROZEN) and the commit funnel was **adversarially proven by the A–G driver roster**
(clause G a real pointer-drag-during-committing, locked out by the ring). Every
load-bearing motion dogfooded LIGHT-barrel primitives; `proof:boundary` held; PRM snapped
every beat. The owner then reviewed the running prototype live (2026-07-03) and ruled it
scrapped-for-now. The convergence is real and stands as recorded; the ruling is about the
product, and the ruling governs.

## Shelf pointers (nothing vanishes)

- **Branch `scene-stage-proto-s` @ `63ccab0`** — the working v3 prototype + the runnable
  gate drivers (`demo/stage-proto/gates/`: adversarial A–G · geometry · gl-proof · fps ·
  prm · vt-proof · warm-suspense · shots-v3). This branch is the durable shelf.
- **`audit/pass3/`** — the frozen design/build/critique corpus: `stage-design-v{1,2}.md`,
  `stage-proto-v{1,2,3}.md`, `stage-critique-*` / `stage-recritique-*`,
  `stage-final-design.md` + `stage-final-tech.md` (the dual 100/100); run instructions and
  A–G transcripts in `stage-proto-v3.md`.
- The p05 salvage probe (`audit/pass1/prototypes/p05-nstage-rebase.md`) and the N-era spec
  (`docs/tranches/N/STAGE-SPEC.md`) remain where they were.

## Consequences across the S doc set (executed with this record)

- **Fold row 17 (DM-24) → RECORD — owner-ruled SHELF** (`PROGRESS.md`): built, converged,
  live-reviewed, ruled scrapped-for-now — NOT a silent re-deferral; the ruling is
  S-terminal.
- **The glass-ui consume-edge (the former S.E8) left the plan.** T12 now names exactly
  ONE external consume-edge — S.H4 (owner-controlled parse-that 1.0.0). Fold rows
  11/51/52/53/55 are re-homed as owner-domain HANDOFFs (rows 51/52 render
  `HANDOFF — external — row N` in the S.Z3 FINAL per C-21); the glass-ui pin posture
  (hold ~4.0.x, tilde never caret — C-12) rides S.C4.
- **C-6 re-corrected:** `proof:scene-switcher-mobile` is retired at S.A4 (ledgered KILL
  with re-run witness); the planned rebirth as `proof:scene-stage-commits` is shelved with
  the band; `proof:scene-colocated` ASSERTION 3 stays whole (the carousel-absence clause
  is truthful again under the no-stage status quo).
- **C-7 re-corrected:** the dock Select remains the SOLE scene-switching authority for S —
  the pre-stage status quo. No dock-pill rewire, no scene-Select retirement, no S.E8.

**OUT of the implementable S wave set — no S.E waves exist; nothing may depend on this
band.** Re-opening requires a new owner ruling.
