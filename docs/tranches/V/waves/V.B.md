# V.B — LIBRARY SETTLEMENT (W4–W6)

Executes the Fable-adjudicated library blueprint `../audit/R2-05-lib-target-tree.md`
(LT-01..16: the complete move/merge/split/rename table with total src/
coverage), as amended by `../audit/R3-04-blueprint-consistency.md`
(XB-01: the DD-4 demo sweep is struck from this band; XB-04: mirror prune
owned here alone; XB-07: FENCE E echoed in every batch). The blueprint's
tables are this band's mechanism of record; the waves below bind them to
gates and bounds. Standing decisions (owner may veto any): 500-raw-line
ceiling, allowlist empty; exactly two cohesion carves (play-lifecycle,
value-ast); KEEP `easing.ts` and `internal/` names (depcruise-load-bearing);
KEEP `compiled-frame.ts` name and contract; ONE grammar — pure index barrel +
eponymous primary + kind-named siblings.

**Band fences (every wave):** exports map byte-frozen (`.` + `./engine`);
`./engine` 44-key mirror re-verified; `TimingFunction` frozen at
`constants/types.ts:45` (atlas IN-ATLAS-3); dist d.ts roster identical after
every batch (`npm run build:lib` + roster diff — XB-07); depcruise green;
`test/` moves in lockstep with `src/` moves.

---

# V.W4 - Structure Gate & Openers

**Name**: W4 - Structure Gate & Openers
**Opens after**: tranche open (independent of the rail)
**Agents**: 2 parallel (gate unit; movers unit)
**Hard gate**: `proof:structure` exists, demonstrably RED against the pre-move
tree on each rule class, GREEN after the opener moves; full battery green
**Status**: planned

### Goal criterion

The single standing structure gate exists and the cheap settlement rows land:
stutter renames, hollow-shim folds, fragment fold, dead deletes.

### Scope

1. PRUNE `test/support/mirror.test.ts` (topology-only; R2-07's mirror row =
   TC-4; XB-04 — owned here alone; convention survives as a docs note in W10).
2. BUILD `proof:structure` (ONE script, `scripts/gates/structure/index.mjs` +
   package key). **Birth scope: `src/` only.** Three src-live rules, each
   carrying a named live red witness recorded against the pre-move tree:
   dir-prefix stutter; single-consumer fragment / hollow shim outside its
   consumer's module; impure-barrel ban. The 500-raw ceiling (allowlist empty)
   and the kind-dir ban are authored in the SAME script but PREVENTIVE on src
   — no live src witness exists (src max is 484L; src has zero kind-dirs).
   Their red witnesses are STAGED AT W8, where the gate's scope extends to
   `demo/` and `ChannelOptions.vue` (609L) + the instrument kind-dirs are the
   live reds.
3. The LT opener batches (blueprint Batches 0–2): 6 stutter renames
   (`compile/easing/easing-option.ts` → `option.ts`,
   `compile/easing/easing-registry.ts` → `registry.ts`,
   `compile/emit/easing-serialize.ts` → `serialize.ts`,
   `waapi/waapi-options.ts` → `options.ts`, `resolve/resolve-function.ts` →
   `function.ts`, `resolve/resolve-if.ts` → `if.ts`, `engine/css/css-animation.ts`
   → `animation.ts` — exact set per the LT table); presets hollow-shim fold
   (delete classic.ts/spring.ts/taxonomy.ts shims, repoint index at catalog,
   fix the misdescribing doc-comment); `internal/transport/core.ts` →
   `internal/transport-core.ts`; `binarySearch.ts` → `binary-search.ts`;
   DD-1/DD-2 deletes (`isObject`, `cloneInterpSlot`); the 4 phantom
   `proof:no-flat-siblings` comment folds (+ demo/DESIGN.md:238,253 rows to
   W10).

### Triumvirate Dispatch

Triggers: any rename that surfaces in the exports map or d.ts roster (fence
breach — halt); proof:structure rule that cannot be made to fail (vacuity);
a third red loop on depcruise.

### File Bounds

| File | Access |
|---|---|
| `scripts/gates/structure/index.mjs`, `package.json` (one key) | create/modify |
| the LT Batch 0–2 paths (blueprint table) + their `test/` mirrors | modify-carve |
| `test/support/mirror.test.ts` | delete |

Do NOT touch: `demo/**`, exports maps, `constants/types.ts`.

### Disjointness

Gate unit owns `scripts/gates/structure/` + the package key; movers own the
rename/fold set. No overlap.

### Worktree Plan

Parallel units either commit-before-parallelize on the shared line or take
sibling worktrees `/Users/mkbabb/Programming/keyframes-v-w4<unit>` per
WAVE_SPEC §4b; the orchestrator runs `git worktree list` before dispatch.

### Agent Units

#### V.W4.a proof:structure
- Goal: the one standing structural check, born RED.
- Sub-gate: per-rule red witness on the pre-move tree; green post-moves;
  wired into `npm run check` chain or CI gates job (one site).

#### V.W4.b Opener moves
- Goal: LT Batches 0–2 landed.
- Sub-gate: battery green; d.ts roster + engine-mirror identical (FENCE E
  echo); depcruise 0 violations.

### Hard Gate

1. proof:structure red-witness log for each of the 3 src-live rules + a green
   post-openers run (the ceiling + kind-dir rules are preventive on src — their
   red witnesses belong to W8, against the pre-move demo tree, not W4).
2. `npm run check && npm test -- --run && npm run lint && npm run build:lib`
   green; d.ts roster diff empty; engine-mirror 44 keys.
3. `find src -name '<dir>-*'` stutter scan = 0 for the named dirs.

### Format And Lint Cadence

Battery after each batch and at close; `git diff --check`.

### Verification Artefacts

Red/green gate logs; roster diffs; the move-commit list.

### Commit Plan

Per-batch commits (`refactor(lib/structure): …` with mechanism scope), gate
commit separate (`feat(gates): proof:structure`).

### Dependencies

- **Depends on**: none.
- **Blocks**: W5.

---

# V.W5 - Module Carves

**Name**: W5 - Module Carves
**Opens after**: W4
**Agents**: 2 serial-batched (per blueprint Batches 3 then 4)
**Hard gate**: FENCE B/E verification green after EACH batch; battery green
**Status**: planned

### Goal criterion

The four adjudicated modules exist — `compile/frame/`, `compile/value/`,
`emit/backward/` + `emit/format/`, `engine/play-lifecycle/` — with pure
barrels and no public-surface drift.

### Scope

1. Batch 3: `compile/frame/` (frame-compiler + compiled-frame + interp-slot +
   numeric-plan fold + barrel); `compile/value/` split of value-ast.ts
   (types/parse/compile/sinks per the LT-05 cut-set, re-derived by codemod at
   execution as the blueprint requires) — includes THE ONE engine-surface
   touch: `public.ts:172` repoint to `./compile/value`; run FENCE B+E
   immediately.
2. Batch 4: `emit/backward/` (backward + backward-color + backward-walk) and
   `emit/format/` (format + format-options) with `public.ts:171` resolving
   through the pure format barrel; `engine/play-lifecycle/` module (the 24
   free functions carved per LT-07's seam list; DD-3 members become
   module-internal, barrel-excluded).

### Triumvirate Dispatch

Triggers: FENCE B/E diff non-empty after a batch; a carve that demands
signature change (halt — fence 1); test-mirror lockstep breaks more than the
mechanical path updates; a third diagnostic loop on one unit of work halts
into triumvirate.

### File Bounds

The LT Batch 3–4 path sets + `src/animation/public.ts` (lines 171–172 only) +
`test/` mirrors. Do NOT touch: exports maps, `constants/types.ts`, demo.

### Disjointness

Batch 3 and Batch 4 are serial; within a batch one agent per module dir.

### Agent Units

#### V.W5.a Frame + value modules (Batch 3)
- Goal: `compile/frame/` and the `compile/value/` split land as pure-barrel
  modules through the single engine-surface repoint, with zero public drift.
- Sub-gate: FENCE B (public.ts:172 sole specifier, grep -c = 1) + FENCE E
  (build:lib; d.ts roster + engine 44-key mirror identical) + battery green.

#### V.W5.b Backward/format + play-lifecycle modules (Batch 4)
- Goal: the `emit/backward/` + `emit/format/` and `engine/play-lifecycle/`
  modules land with DD-3 members made barrel-excluded module-internals.
- Sub-gate: same fence echo + battery green; proof:structure green.

### Hard Gate

1. Both batches' fence logs (d.ts roster diff empty; engine mirror 44/44).
2. Battery + depcruise + proof:structure green.
3. Barrels pure (the W4 gate's impure-barrel rule enforces).

### Format And Lint Cadence

Battery after each batch; `git diff --check`.

### Verification Artefacts

Fence logs per batch; module barrels; commit list.

### Commit Plan

One commit per module (`refactor(lib/<module>): carve …`), body carrying the
fence witness.

### Dependencies

- **Depends on**: W4. **Blocks**: W6.

---

# V.W6 - Library Encapsulation Sweep

**Name**: W6 - Library Encapsulation Sweep
**Opens after**: W5
**Agents**: 1
**Hard gate**: the recomputed DD-3 set demoted; a standing no-unused-exports
check green; battery green
**Status**: planned

### Goal criterion

No src symbol is exported beyond its consumers: the over-export leak is
closed on the SETTLED tree and stays closed by one standing check.

### Scope

1. Recompute the DD-3 set post-move (the R1-07 list was computed flat;
   LT-13/XB-01: library symbols only — the demo half is W8's). For every
   symbol: consumers re-grepped across `src/ test/ bench/` (the XB-02 lesson:
   test consumers count); demote true file-locals; barrel-exclude
   module-internals.
2. Extend proof:structure (or depcruise, whichever is the one home) with the
   no-unused-exports rule; red-witness it.

### Triumvirate Dispatch

Triggers: the recomputed DD-3 set diverging >20% from R1-07's flat-tree list;
a demotion breaking check twice; a third diagnostic loop on any symbol.

### Hard Gate

1. The demotion table (symbol → verdict → evidence) in the wave record.
2. Battery + proof:structure green; red-witness for the new rule.

### File Bounds

| File | Access |
|---|---|
| `src/**` export statements + barrels | modify |
| the gate script (`scripts/gates/structure/` or the depcruise home) | modify |

Do NOT touch: public surface members (the `.`/`./engine` roster is the freeze
list).

### Format And Lint Cadence / Artefacts / Commit Plan

Battery at close; demotion table artifact; one commit
(`refactor(lib): encapsulation sweep`).

### Dependencies

- **Depends on**: W5. **Blocks**: W13.
