# Lane 29 — T impl batches ①–⑥ quality re-review (against the CURRENT tree)

**Fleet:** Tranche U development · **Lane:** 29/32 (`t-quality-batches-1-6`)
**Scope:** re-review, as-merged on master (`8ed0e63` merge + T.Z close-fixups), the
major changes of T impl batches ①–⑥: the T.M mechanism (T_BORNRED_BACKLOG +
owner-golden), the T.E prune, T.A cube/amiga, the square joint motion, the T.D theme
core, the T.D hero + T.C dock recut, and the decoy-terminal deletion (T.B1-β/T.B7).
**Discipline:** every finding carries a file:line read from the live tree; every cure is
the idiomatic gestalt transposition, never a patch.

---

## Headline

The batch-⑥′ "keystone" (`proof:scene-facility` DISCHARGED) deleted the *decoy* but NOT
the *duality*: the `SceneFacility` was declared "the unification seam that replaces
`animationGroup?` + `scenePlayback?` + decoy" yet both survivors are still exposed as
first-class fields and the shell still branches on scene-family in three seams — a
half-measure the NO-legacy edict forbids. Around it sit two chronic dependency
deferrals still carried as in-tree workarounds (the engine `serialize()/hydrate()`
hand-reseat; the value.js-boxing `plain-vars` projection) and a CI apparatus that GREW
during T to ~2× its own declared ceiling.

---

## Findings (severity-ranked)

### F1 — [MAJOR] The SceneFacility "unification" is a half-measure: the legacy `animationGroup`/`scenePlayback` duality survives, and the shell still branches on scene-family in three seams

`sceneFacility.ts:4` states the descriptor "replaces the `animationGroup?` +
`scenePlayback?` + decoy triple with ONE descriptor." The tree does not honor it.
Every group scene exposes BOTH `facility` (whose `facilityFromGroup` always sets
`.group`, `sceneFacility.ts:112`) AND a redundant `animationGroup`
(`CubeScene.vue:249`, `AmigaScene.vue:237`, `SquareScene.vue:316`), self-labeled "the
legacy `animationGroup`" in each. `SceneExposedApi` keeps both survivors and admits it:
"The legacy `animationGroup?`/`scenePlayback?` fields below remain"
(`sceneExposedApi.ts:24-31`). The shell then branches on family in three places:

- **Dead fallback:** `useSceneMachineShellBinding.ts:67` — `facility?.group ??
  sceneRef.value?.animationGroup`. Since `facility.group` is always set whenever
  `animationGroup` is (verified: all three group scenes route through
  `facilityFromGroup`; no scene exposes `animationGroup` without `facility`), the `??`
  arm is unreachable dead code.
- **Ready-guard identity:** `:163-165` reads `animationGroup ?? scenePlayback` as the
  stable per-entry identity for the once-per-(entry×group) guard — the sole *live*
  reason the parallel exposure exists.
- **Play authority split:** `onPlayStateChange` `:266-268` writes
  `sceneRef.value.isPlaying = playing` for group scenes but must NOT for rAF scenes
  ("would throw 'computed value is readonly'"), discriminating on
  `!!sceneRef.value?.scenePlayback`. So a group-scene Play fires TWO coupled writes
  (the machine adapter via `facility.playback` → `group.play()`, AND the direct
  `isPlaying` prop write), while an rAF scene fires one — two play authorities, gated
  by the very "legacy" field the facility was meant to subsume.

**Failure surface:** the `ownsPlayback`/`"isPlaying" in ref` guard is a readonly-computed
landmine (write the wrong family and Vue throws at runtime); the dead `??` arm masks
the fact that `animationGroup` has no live consumer beyond identity; a fourth scene
family added later must re-derive all three branches.

**Proposal (gestalt):** make the facility the SOLE seam. Give `SceneFacility` a stable
`identity` (build it once per entry — `facility.group ?? facility.playback`, both stable
anchors — rather than as a churning `computed`), and make scene "playing" a *uniform*
readonly projection of `facility.playback.isPlaying()` for BOTH families (kill the
group-only writable `isPlaying` prop; CubeTarget reads the derived value). Then delete
`animationGroup?` and `scenePlayback?` from `SceneExposedApi`, the `?? animationGroup`
fallback, and the `ownsPlayback` discriminator. One descriptor, one play authority, one
identity — the unification the keystone claimed.

---

### F2 — [MAJOR] Chronic deferral carried as a live workaround: the demo hand-reseats eight engine private clock fields for want of an `AnimationGroup.serialize()/hydrate()` codec (the S6 handoff)

`scenePlaybackAdapters.ts:10-13` names it: "The engine `serialize()/hydrate()` seam is
the S6 born-RED HANDOFF — when it ships, the restore body reduces to two calls." Until
then `restoreGroupPlaybackState` (`:120-158`) reaches into engine internals by hand —
`group.started`, `group.lastTickTime`, and per-child `anim.managed/started/reversed/
iteration/startTime/t/paused/pausedTime` (`:123-151`) — a demo poking eight private
clock fields the engine should own. This is the exact chronically-deferred item the
owner folds into U (S6 has ridden multiple tranches as a "born-RED HANDOFF").

**Failure surface:** any engine change to the clock representation silently breaks the
demo's restore (no type coupling — the fields are poked positionally in the demo); the
"cold restore" ST-5 path and the S.A0 empty-queue race (`:64-90`) are re-implemented in
the demo instead of the engine.

**Proposal (gestalt):** land `KeyframesAnimation`/`AnimationGroup` `serialize(): Snapshot`
+ `hydrate(Snapshot)` in the engine (the codec, owning ST-5 cold-snapshot + the S.A0
fresh-play semantics). The adapter's `snapshot`/`restore` collapse to
`group.serialize()` / `group.hydrate(snap)`; `restoreGroupPlaybackState` and the
eight-field poke are DELETED. This is a library wave, not a demo patch.

---

### F3 — [MAJOR] `compile/plain-vars.ts` is 128 lines of workaround residue compensating for a value.js boxing regression at the "animate any object" seam

`plain-vars.ts:1-27` documents its own reason for existing: "Under value.js ≥ 2.0.1 a
frame's `vars` delivers **array-boxed internal leaves** — a unitless number authored as
`rotation.x: 1.5` arrives at the consumer as a one-element `ValueUnit[]` … A consumer
doing arithmetic … yields `NaN` (the amiga mesh vanishes mid-boing)." So a
previously-working seam broke on a value.js representation change, and kf carries a
per-frame un-boxing projection (`:88-107`, both `engine/interpolate.ts` and
`group/compositor.ts` consumers) to restore authored shape. value.js's tranche is
ACTIVE (the owner scopes U to charter its consume-edge); the 3.1.0 pin still boxes, so
the workaround is live, not stale.

**Failure surface:** the "animate any object" contract — a headline capability — is only
correct because of a downstream un-boxer; every new consumer of interpolated `vars` must
route through `plain-vars` or hit `NaN`; the projection is a second source of truth for
leaf shape that must track value.js's internal `ValueUnit` layout.

**Proposal (gestalt):** charter the value.js consume-edge letter (U owns it) to deliver
authored-shape plain values AT THE SEAM — numbers where the author wrote numbers,
strings where a unit/color demands one — so `unflattenObject`/the frame `vars` are
consumer-ready. On the re-pin, `plain-vars.ts` is retired in totality (a born-RED
tripwire rides the re-pin, per the T.S3 pattern). kf must not permanently own a
compensation layer for a dependency's internal representation.

---

### F4 — [MAJOR] The CI apparatus GREW during T to ~2× its own declared ceiling — the tautological-gate proliferation the owner's first U reading targets

`ROSTER_CEILING = 120` (`gate-bands.mjs:595`); the live roster is **227** `proof:*`
scripts (`package.json`). `proof:roster-ceiling` is itself a born-RED backlog row
(`gate-bands.mjs` T_BORNRED_BACKLOG) whose reason concedes the mechanism: "each altitude
band had kept authoring MORE born-RED oracles than the M7 retirements removed, so the
count converges SLOWLY." Batches ①–⑥ are net contributors — each authored born-OWNER
oracles (`proof:owner-golden`, `proof:hero-two-focal`, `proof:accent-census`,
`proof:easing-gallery`, `proof:perf-counters`, `proof:zone-cohesion`, GU-1/GU-2 dock
gates, `proof:scene-facility`, …) while retiring fewer. The owner's binding reading #1:
"our CI needs to be trimmed substantially (most of it's likely tautological)."

**Proposal (gestalt):** U owns a CI-reduction band that inverts the ratchet — collapse
the per-appearance-axis born-OWNER oracle family into a small set of *behavioral*
gates (one golden-perceptual, one perf-counter, one boundary, one published-surface),
delete the surface-lock/inventory/census micro-gates whose signal is subsumed, and set
the ceiling to the trimmed count as a HARD gate (no born-RED escape hatch). Measure each
gate's marginal signal; a gate that only re-asserts a source shape another gate already
covers is deleted, not ceilinged.

---

### F5 — [MAJOR] `T_BORNRED_BACKLOG` IS the "honest defer" device the owner terminates for U — and it still carries in-tranche (non-external) deferrals

The T.M mechanism (`gate-bands.mjs:609` `T_BORNRED_BACKLOG`) sanctions failing gates by
composing them into the expected-set (ci-coverage clause 11, "failing ⊆ backlog
exactly"). Of its ~10 rows, several are NOT external blocks but in-tranche deferrals: (a)
`proof:stage-inventory` stays red because "the browser RENDERED-set reconciliation … is
not yet implemented — **a later wave** opens the browser and asserts it"
(`gate-bands.mjs:617-627`); (b) `proof:roster-ceiling` (F4). The owner's reading #2:
"NO MORE DEFERRALS … The 'honest defer' device is terminated for U's scope." A backlog
that a gate is *allowed* to fail into is precisely that device.

**Proposal (gestalt):** dissolve `T_BORNRED_BACKLOG` in U. Every row is either
DISCHARGED by a real wave (stage-inventory → the browser reconciliation wave;
roster-ceiling → F4's trim) or the gate is DELETED as tautological. External-blocked
rows (glass-ui GU-1/GU-2/BG-5/BG-11, value.js KF-7) convert to a single
consume-edge coordination ledger with a re-pin tripwire — NOT a green-composing backlog
map. No gate may pass by being pre-declared to fail.

---

### F6 — [MINOR] False-green gates: T-authored oracles asserted against DOM hooks that never shipped, caught only at the T.Z close

The OD-7 gallery gates were pointed at selectors born unstyled/absent from the shipped
DOM: `proof:styling-idioms` had `.family-group`/`.family-item` "dead-ref hooks removed
(family-group/family-item were born unstyled, P-GALLERY-verbatim)" (`cf9b268`), and
`proof:easing-gallery` was "re-pointed to the accessible filter contract (aria-label,
not the dead `.family-item` hook)" (`9d03124`) — both fixups landed at close, meaning the
gallery gates ran VACUOUSLY green against non-existent hooks through the whole drive.
This is the tautological CI the owner names, in its most dangerous form (false
confidence, not merely redundancy).

**Proposal (gestalt):** every DOM-asserting gate must fail-hard when its target selector
matches zero nodes (an empty match is a RED, never a vacuous pass) — a single shared
`expectNonEmpty(selector)` helper in `scripts/lib/`, adopted across the runtime gates, so
a gate can never certify a hook that does not exist.

---

### F7 — [MINOR] The prune left a family-branched play/identity model that reads as three near-duplicate "group vs rAF" conditionals

Beyond F1's seams, the group-vs-rAF split recurs as a structural motif: `createGroupAdapter`
vs `createRafAdapter` (`scenePlaybackAdapters.ts:37/186`), `facilityFromGroup` vs the
per-scene hand-assembled facilities (sequence/easing/spring), and the `autoPlays`
readonly-vs-writable `isPlaying` fork. Each is individually defensible, but the pruned
6-scene set is small enough that the two families could be ONE.

**Proposal (gestalt):** unify on the rAF-progress model as the single scene-playback
substrate — a group scene's facility exposes its group members as channels but drives
playback through the same `ScenePlayback` progress contract the raf scenes use (the
adapter already normalizes both to `{snapshot, restore, suspend, resume, isPlaying}`).
One adapter constructor, one play authority, `autoPlays` uniform. This retires
F1/F2/F7's shared root at once.

---

## What U must charter

1. **Complete the SceneFacility unification (F1):** fold stable identity + sole play
   authority into the facility; make scene "playing" a uniform readonly projection;
   delete `animationGroup?`/`scenePlayback?` from `SceneExposedApi`, the dead `??`
   fallback, and the `ownsPlayback` discriminator. NO legacy fields survive.
2. **Land the engine `serialize()/hydrate()` codec (F2):** the S6 chronic handoff folds
   into U as a library wave; the demo's eight-field hand-reseat is DELETED.
3. **Charter the value.js consume-edge to deliver authored-shape at the "animate any
   object" seam (F3):** retire `compile/plain-vars.ts` on the re-pin; carry a re-pin
   tripwire, not a permanent compensation layer.
4. **Trim CI to a behavioral core and enforce a hard ceiling (F4):** invert the
   born-OWNER oracle ratchet; delete gates whose signal another gate already carries;
   set the ceiling to the trimmed count with NO born-RED escape.
5. **Dissolve `T_BORNRED_BACKLOG` (F5):** discharge every in-tranche row with a real
   wave (stage-inventory browser reconciliation; roster-ceiling); convert external rows
   to one consume-edge ledger with re-pin tripwires; no gate passes by pre-declared
   failure.
6. **Make DOM-asserting gates fail on empty matches (F6):** a shared `expectNonEmpty`
   contract so no gate certifies a non-existent hook.
7. **Unify the scene-playback substrate onto one adapter family (F7):** collapse the
   group-vs-rAF duality across facility construction, playback, and autoplay.
