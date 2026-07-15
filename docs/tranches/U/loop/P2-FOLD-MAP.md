# P2-FOLD-MAP — U.B14 small-module inline record

This is the ratified target ledger for OD-U16's demo-side inline direction. The
fold-time census originates in frozen prototype `wf_ca7d0632-287-11` (`287-11`);
current implementation must re-measure importer edges against the post-U.B1 tree
before each row lands. A filename/token grep is not an importer count.

## Executed target

| target | consumer evidence | disposition | current proof |
|---|---|---|---|
| `demo/scenes/cube/matrix-editor/index.ts` | one runtime consumer (`CubeScene.vue`); barrel re-exported one symbol | **INLINE + DELETE**; `CubeScene.vue` imports `./matrix-editor/MatrixEditor.vue` directly | `npm run check`; `proof:scene-colocated` |

The target is a ceremony barrel, not a shared module. Its deletion removes only
indirection; `MatrixEditor.vue` and `useTransformState.ts` remain colocated in the
scene-private directory. No public export or runtime behavior changes.

## Named keeps / routed rows

These rows remain explicitly named rather than bulk-swept:

- `demo/scenes/cube/orbital-drag/types.ts` — fold into the module's eventual
  `constants.ts` only after the four in-module import edges are re-measured.
- `demo/components/instrument/timeline/timelineTypes.ts` — nine in-module
  consumers; keep or rename to `constants.ts` as a target-by-target move, not an
  inline duplication.
- `demo/scenes/cube/cubeKeys.ts`, `square/squareKeys.ts`,
  `amiga/amigaKeys.ts` — multi-consumer scene registry contracts; KEEP and
  backstop with `proof:scene-superkey-single-source`.
- `demo/components/instrument/timeline/utils/{flattenVars.ts,contenteditable.ts}`
  and `demo/app/runtime/rafConstants.ts` — importer counts earn the shared seat;
  re-measure only if their consumer graph changes.

## Acceptance discipline

Every subsequent row must record the exact importer set, inline destination, and
the focused test/proof result in this table. A row with two genuine consumers is
not an inline target. No standalone gate is introduced; `proof:colocation` and
the existing demo Vitest mirror are the oracles.
