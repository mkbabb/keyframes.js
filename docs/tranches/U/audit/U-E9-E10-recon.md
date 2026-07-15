# U.E9/U.E10 implementation reconnaissance

Measured on `tranche-u-impl` at `8ecc3db4` (2026-07-12). This is a
reconnaissance artifact only: it does not delete the U.E9 gate apparatus,
CLAUDE.md files, suppression ledgers, or glass-ui consume-edge material.
Those edits remain sequenced after U.E7/U.E8 and their required re-anchoring.

## U.E9 residue census

The exact sweep prescribed by PASS-5 §4 currently returns 39 source/config
hits (excluding archived worktrees). They divide into:

- **Gate apparatus still live (must be removed by U.A5/U.E9):** the two
  scripts `scripts/proof-soa-composite.mjs` and
  `scripts/proof-spring-vector.mjs`, their `package.json` commands, and the
  `proof:library-correctness` command entries.
- **Present-tense or stale references requiring named disposition:**
  `scripts/proof-portable-perf.mjs` (header, `KNOWN_PRIOR_ART`, and lint
  diagnostic), `bench/taxonomy.json` (SoA and spring notes),
  `src/animation/group/soa.ts`, `src/animation/group/compositor.ts`, and
  `src/animation/physics/spring/progress.ts`.
- **Historical/tombstone references that may remain after the sweep:**
  `bench/group-composite.bench.ts`, `bench/spring-tick.bench.ts`,
  `scripts/proof-color-soa.mjs`, `scripts/proof-processframe-soa.mjs`,
  `scripts/proof-morphsvg-consume.mjs`, `scripts/proof-waapi-adaptive-densify.mjs`,
  `test/physics/spring.test.ts`, and the retired decision notes in
  `bench/taxonomy.json`. Each must be checked against the final tombstone
  wording rather than blanket-deleted.

The one code residue explicitly named by ruling 23 is the
`"proof-spring-vector.mjs"` member of `KNOWN_PRIOR_ART` in
`scripts/proof-portable-perf.mjs`; it is behaviorally inert while the deleted
script is absent, but must be removed when the U.E9 gate deletion lands.

## U.E10 dogfood census

The demo still has hand-written numeric clamps in the following behavior
paths, so no broad “43 sites are complete” claim is warranted on this SHA:

- `demo/components/playback/AnimationVisualizer.vue`
- `demo/components/instrument/timeline/TimelineCaret.vue`,
  `TimelineTrack.vue`, `composables/useTimelineBuild.ts`,
  `composables/useTimelineOps.ts`, and `composables/useZoomPan.ts`
- `demo/components/instrument/transport/AnimationControlsGroup.vue`,
  `AnimationControlsGroup/useAnimationGroupPlayback.ts`,
  `AnimationControlsGroup/useAnimationProgress.ts`, and
  `channel-controls/ChannelOptions.vue`
- `demo/composables/scene-facility/index.ts`
- `demo/scenes/easing/EasingScene.vue` and `useEasingDemo.ts`
- `demo/scenes/spring/SpringPhysicsFacet.vue`

The current tree already dogfoods `@mkbabb/value.js` in the square color/unit
path and in cube orbital drag. Those are anchors for the headless witness;
they do not justify changing unrelated clamps before the D2–D7 carve is
opened. `flattenVars` and the bezier branch of `getCurvePath` remain the
measured D8/D9 keep cases and need disposition comments, not excision.

## Safe next slice and gates

The only safe slice before U.E7/U.E8 close is this inventory. The subsequent
implementation order is:

1. complete U.E7/U.E8 inventories and re-anchored gates;
2. delete the two U.E9 gate scripts/keys and remove each residue by name;
3. run the exact PASS-5 grep, expecting only approved tombstones;
4. perform U.E10 D2–D7 in bounded batches, with demo Vitest after each batch;
5. run `npm run proof:bench-taxonomy`, the published-surface checks, and the
   headless dogfood witness on the merged SHA.

No glass-ui dependency or consume-edge was changed by this reconnaissance.
