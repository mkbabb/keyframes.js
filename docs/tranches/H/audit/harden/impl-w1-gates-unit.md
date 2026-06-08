# H.W1 impl — UNIT-GATES lane (`impl-w1-gates-unit.md`)

The two vitest unit gates this lane owns, bound to the CORE+HEART surface
documented in `impl-w1-core-api.md`. Both authored against the existing harness
idioms (`test/scene-raf-leak.test.ts` for the controllable-rAF + effectScope
seam; `test/interpolate-anything.test.ts` §S3 for the MCI-5 `it.fails` born-RED
witness pattern). NOT committed — left in tree for the lead to review.

---

## 1. Files landed (left in tree)

| File | Role |
|---|---|
| `test/scene-contract-identity.test.ts` | NEW — `proof:scene-contract-identity` (WV-W1-HIGH-3): the raw-rAF `ScenePlayback` round-trip the group gate misses + the named easing↔cube / cube↔easing cross-pairs. 5 clauses, all GREEN-on-fix. |
| `test/group-snapshot-identity.test.ts` | NEW — `proof:group-snapshot-identity` (S6, born-RED HANDOFF): `g.hydrate(g.serialize())` identity as an `it.fails` witness, GREEN today (seam absent), FLIPS RED when the engine ships. |
| `package.json` | WIRED — two new `proof:*` scripts + both appended to `proof:all`. |
| `.github/workflows/ci.yml` | WIRED — both gates run in the library `gates` job (glass-ui-free, vitest), adjacent to `proof:scene-raf-leak`. |

---

## 2. `proof:scene-contract-identity` — what it asserts + why it BITES

Binds to `createRafAdapter` / `createGroupAdapter` / `RafSceneHandle` from
`stores/scenePlaybackAdapters.ts` and the live easing scene's exposed
`scenePlayback` adapter (`demo/easing/useEasingDemo.ts:198`).

Five clauses:
1. **Pure-handle round-trip** — `createRafAdapter` snapshot()/restore() re-seats
   `progress` (0.62) + `playing` intent + re-arms the loop; `snap.animations`
   is `{}` (the raw-rAF family has NO AnimationGroup position — the dummy
   `contractAnim` group could never witness this).
2. **Paused raw-rAF round-trip (ST-5 parity)** — a paused scene saves+restores
   its scrub position AND `restore()` STOPS the loop (no orphan rAF).
3. **The live D12 repro** — drives the ACTUAL easing scene inside an
   `effectScope` + the machine seeded to `playing`; scrubs to 0.5, snapshot()s,
   `suspend()`s (loop stops), then `restore()`s onto a moved-away state and
   asserts the scrub re-seats + the loop re-arms. The easing loop gates on
   `machine.status === 'playing'` (the private `isPlaying` shadow is DELETED).
4. **easing→cube cross-pair** — the raw-rAF snapshot (`progress`, no
   `animations`) and the group snapshot (`animations`, no `progress`) are
   DISJOINT + lossless; easing's `suspend()` does not touch the cube clock; the
   cube restore re-seats `{t,reversed,iteration}` without clobbering easing.
5. **cube→easing cross-pair** — the group `suspend()` does not strand the loop
   (`group.playing()===false`); easing restores a saved position + paused intent
   (loop stopped); the group clock is untouched by easing's restore.

**BITE — falsifiability VERIFIED.** Removing the `progress` re-seat from
`createRafAdapter.restore()` (the lost-progress regression) reds 4 of 5 clauses;
restoring it returns green. The gate is NOT vacuous: it asserts exact re-seated
values, not mere non-throw.

**Why this gate exists (WV-W1-HIGH-3):** `proof:group-snapshot-identity` passes
VACUOUSLY on the literal D12 repro (easing has no group). This gate bites the
actual raw-rAF loss — the seam the group gate structurally cannot reach.

## 3. `proof:group-snapshot-identity` — the born-RED HANDOFF witness

`it.fails` witness mirroring the MCI-5 pattern. VERIFIED: `AnimationGroup` has NO
`serialize`/`hydrate` (grep clean in `src/animation/`), so the inner identity
assertion throws (methods undefined) → `it.fails` is GREEN today. Plus a standing
positive control (`typeof g.serialize !== 'function'`) that bites if the witness
is deleted (HANDOFF un-watched) or if the engine ships the seam WITHOUT flipping
the witness (stale-witness signal).

**FLIP VERIFIED (falsifiability):** patching `serialize`/`hydrate` onto
`AnimationGroup.prototype` and running the witness body as a normal `it` PASSES —
i.e. the inner assertion holds, which flips `it.fails` to RED. The consume-leg
signal on flip: swap `restoreGroupPlaybackState`'s eight-field body for
`g.hydrate(g.serialize())` (`scenePlaybackAdapters.ts:97`) and delete the `it.fails`
wrapper. inv-16 honored: NO engine serialize/hydrate authored in `src/animation`
— the gate WITNESSES the absent seam; the imperative restore is the live codec.

Covers the AnimationGroup family ONLY (cube/amiga/square); the raw-rAF scenes are
covered by §2. inv-27 honored: NOT a perpetually-red gate — the suite stays green
while the HANDOFF is pending.

---

## 4. Wiring + verification

- `proof:ci-coverage` GREEN: "all 38 proof:* gates are invoked in CI" — both new
  gates recognized (the self-policing F.W2 coverage gate would red on an
  authored-but-unrun gate).
- `npm run proof:scene-contract-identity` → 5 passed.
- `npm run proof:group-snapshot-identity` → 1 passed | 1 expected fail (the
  `it.fails` witness).
- Scene-machine cohort (my two + reducer + e-w1-encapsulation + scene-raf-leak):
  24 passed | 1 expected fail — no regressions in the sibling lanes' gates.
- `test/` is not in the project `tsconfig` include set (`src/` + `demo/` only),
  consistent with every other test file; vitest's transform runs them clean.

## 5. NOT this lane

`proof:scene-machine-reducer` (the pure-reducer unit test — `test/scene-machine-
reducer.test.ts` exists but is NOT yet wired into package.json/ci) and the
Playwright matrix gates (`proof:scene-machine-irrefragable`, `proof:no-route-
storm`, `proof:scene-isolation`, `proof:deep-link-wins`, `proof:suspend-no-orphan-
raf`, `proof:dock-popover-opens`, etc.) are the GATES-browser / CORE lanes' charge
— not wired here. This lane is strictly the two unit gates named in the brief.
