# Tranche J audit — LANE: wave-I.W1 (plan-vs-delivery, B2 DFA suspend/resume _gen crash)

**Scope.** Commit `8a40cf4` (I.W1) against spec `docs/tranches/I/waves/I.W1.md` and impl note
`docs/tranches/I/impl/I.W1.md`. Verified against the current `master` tip `4072af9` (clean tree).
Read-only; no source modified.

**Headline verdict.** The delivery is COMPLETE and CORRECT against the spec. S1–S5 all land at the
right seam; the gate `proof:fsm-suspend-resume-live` is honest, bites on the right oracle, and is
integrated into `proof:correctness` and CI. Two P2 findings merit J attention: (1) the gate's
clause (a) weakens to a `note` rather than a `fail` when the easing scene's rAF loop has settled
before the synthetic tick fires, making the born-RED oracle for that run vacuously green; (2) the
`sequence` scene (present at W1's time) has the SAME raw-rAF + `useSceneVisibilityPause` recipe
but was NOT migrated to `useRafScene` — it is ALREADY bound-correct (uses local arrow wrappers,
not bare `playback.stop`), but the structural consolidation is incomplete. One BOOK finding: the
bind-proof property has no explicit unit test.

---

## §1 — Scope delivery: S1–S5 verified

| Scope item | Spec requirement | Delivered | Evidence |
|---|---|---|---|
| **S1** — bind-proof `RAFPlayback` engine | `play/drive/loop/stop` as arrow class-fields, closing the whole unbound-method class | ✓ All four are `field = (...) =>` arrow fields | `src/animation/playback.ts:160,204,224,230` |
| **S2** — `useRafScene` consolidation | NEW `demo/.../useRafScene.ts`; easing+spring refactored; unbound `playback.stop` refs deleted | ✓ `demo/app/useRafScene.ts` 122 lines; easing/spring drop their direct `RAFPlayback` import | `demo/app/useRafScene.ts:1-122`; `useEasingDemo.ts:225`; `useSpringDemo.ts:204` |
| **S3** — order-independent control mount (SHARED with I.W2) | consume I.W2's `selectedControlSurface`; no new code in W1 | ✓ I.W2 committed at 20:33, W1 at 20:49 on the same day; W1 correctly consumed the already-landed surface | `git log --format="%H %ai %s"` shows `e2085c8` (W2) earlier than `8a40cf4` (W1); impl note: "S3 — consume I.W2's mount (no new code)" |
| **S4** — static lint guard (HYGIENE) | grep clause (d) RED on bare `.stop`/`.pause`/`.play`/`.drive`/`.loop` as a callback argument | ✓ Implemented as `clauseD_staticGuard()` in gate script; non-vacuous BITE self-test included | `scripts/proof-fsm-suspend-resume-live.mjs:96-164` |
| **S5** — `sceneMachine.ts` PRESERVED | Pure reducer untouched — the resume-iff-was-playing algebra was correct | ✓ `sceneMachine.ts` not in `git show 8a40cf4 --stat` | commit stat shows only 7 files changed; `sceneMachine.ts` absent |

---

## §2 — Gate honesty audit

**Gate script:** `scripts/proof-fsm-suspend-resume-live.mjs` (743 lines). Registered as
`"proof:fsm-suspend-resume-live"` in `package.json:89`. In `proof:correctness` aggregator
(`package.json:147`). Present in CI at `.github/workflows/ci.yml:244` with
`KF_REQUIRE_BROWSER: "1"`.

**Static clause (d) runs without Playwright.** Output on master (no dist, no Playwright):

```
✓ clause (d) HYGIENE: ZERO bare .stop/.suspend/... across 201 files
✓ clause (d) BITE self-test: reds on historical defect shape
○ browser half skipped — playwright not resolvable
proof:fsm-suspend-resume-live — PASS
```

With `KF_REQUIRE_BROWSER=1` and no Playwright it fails hard (exit 1): the guard at
`scripts/proof-fsm-suspend-resume-live.mjs:194-197` is correct and enforced in CI.

**Oracle class: RUNTIME/INTERACTION** (CORRECTNESS tier). The gate:

- Clause (a): loads the easing scene, asserts `playback.running` via `liveLoopMoving()` (reads
  the live DOM sweep, not localStorage), dispatches a SYNTHETIC `visibilitychange→hidden`, asserts
  ZERO `pageerror`/`console.error` matching `/_gen|Cannot read propert/.
- Clause (b): easing(PLAYING)→amiga switch with the visibility co-fire; asserts destination
  controls NON-BLANK (`panelTextHitCount > 0 && maxOpacity > 0.5`) and source controls unmounted.
- Clause (c): MODE-PERSIST context; PLAY easing → switch to spring → PAUSE → switch to easing →
  switch back to spring → assert spring resumed PAUSED (live adapter state, not localStorage proxy).
- Clause (d): HYGIENE static grep; BITE self-test.

The `proof:live-session` gate-of-gates also references this gate at
`scripts/proof-live-session.mjs:927,939`, completing the two-tier taxonomy integration.

---

## §3 — Quick-solution/workaround residue

**None found.** The fix is at the engine seam (arrow class-fields are the idiomatic TypeScript
bind-proof pattern). No try/catch floors, no `Function.prototype.bind` call-site patches, no
magic-timeout settle-sleeps in the production code. The gate script uses `page.waitForTimeout`
for Playwright settle waits, which is the correct Playwright API for these pauses (not a `setTimeout`
hack; documented by the spec under H-6 `settleMs=1600`). The `navByHash(page, sceneId, settleMs)`
pattern is identical to the sibling gate `proof-no-orphan-specular.mjs`.

**No TODO/FIXME/HACK in W1-touched files** (`src/animation/playback.ts`,
`demo/app/useRafScene.ts`, `demo/easing/useEasingDemo.ts`, `demo/spring/useSpringDemo.ts`).

---

## §4 — Legacy residue

**None found.** The two unbound sites are deleted in the same motion:

- `demo/easing/useEasingDemo.ts`: `RAFPlayback` import removed; the former
  `useSceneVisibilityPause(() => playback.running, playback.stop, startLoop)` line is gone; no
  stale `stopLoop = () => playback.stop()` remains.
- `demo/spring/useSpringDemo.ts`: same pattern, same deletion.

Both files now import `useRafScene` from `../app/useRafScene` and use the returned `startLoop` /
`scenePlayback` directly. The `onScopeDispose` in each has been trimmed to only the scene-specific
disposal (gallery timers for easing; derby timers for spring); the `RAFPlayback` teardown is owned
by `useRafScene`'s `onScopeDispose(stopLoop)`.

---

## §5 — Raw-rAF scene coverage: what migrated and what did not

The W1 spec explicitly scoped S2 to "the two UNBOUND call sites"
(`useEasingDemo.ts:227`/`useSpringDemo.ts:365`). The other raw-rAF scenes are each examined below:

| Scene / file | Has raw RAFPlayback? | useSceneVisibilityPause callbacks | Bound? | Migrated to useRafScene? |
|---|---|---|---|---|
| `demo/app/useRafScene.ts` | yes (owns it) | `stopLoop`, `startLoop` (local arrows) | ✓ | IS useRafScene |
| `demo/easing/useEasingDemo.ts` | via useRafScene | n/a (delegated) | ✓ | ✓ W1 |
| `demo/spring/useSpringDemo.ts` | via useRafScene | n/a (delegated) | ✓ | ✓ W1 |
| `demo/sequence/useSequenceDemo.ts` | yes (`mirror = markRaw(new RAFPlayback())`) | `stopLoop`, `startLoop` (local arrows, `line 443-446`) | ✓ pre-W1 | ✗ NOT migrated — structurally ineligible |
| `demo/app/scenes/AmigaScene.vue` | no — raw `requestAnimationFrame` (not RAFPlayback) | `stopRenderLoop`, `startRenderLoop` (plain functions, not method extractions) | ✓ | ✗ Out of scope — amiga has no ScenePlayback adapter pattern |
| `demo/cube/useCubeAnimations.ts` | via AnimationGroup | `() => animationGroup.value.pause()`, `() => animationGroup.value.resume()` (arrow wraps) | ✓ | ✗ Out of scope — AnimationGroup, not raw-rAF |
| `demo/square/useSquareAnimations.ts` | yes (idle spring loop — no visibility-pause) | none | n/a | ✗ Out of scope — self-terminating spring loop |
| `demo/@/.../useRafLoop.ts` | yes (infrastructure composable) | none | n/a | ✗ Out of scope — infrastructure wrapper |
| `demo/@/.../AnimationVisualizer.vue` | yes (`coastPlayback`) | none — member calls only (`coastPlayback.stop()` at lines 205, 255) | ✓ | ✗ Out of scope |

**Sequence non-migration detail (P1).** `useSequenceDemo.ts` has the same three-part recipe
(`new RAFPlayback()` + `createRafAdapter` + `useSceneVisibilityPause`) but is NOT eligible for
`useRafScene` as designed: its `startLoop` drives a `Sequence` engine (calling
`sequence.resume()`/`sequence.play()`) and a MIRROR `RAFPlayback` loop — the `useRafScene`
interface (`onArm`, `frame`, `getProgress`, `setProgress`, `getPlaying`) assumes the composable
owns the only RAFPlayback driving the scene, which is not true for sequence. Pre-W1 it was ALREADY
correctly bound (uses `stopLoop`/`startLoop` local arrows at line 443-446, NOT bare `playback.stop`
or `mirror.stop`). So the defect class was NOT present here; migration was correctly skipped by the
spec. However, the three-part recipe is still duplicated at the scene level — a structural debt J
should evaluate.

---

## §6 — Gate oracle depth analysis

**The clause (a) precondition weakness.** The born-RED oracle reads:

```js
// scripts/proof-fsm-suspend-resume-live.mjs:472-478
if (!live.moving) { … live = await liveLoopMoving(page); }
if (live.moving) {
    ok("clause (a) precondition: easing rAF scene is PLAYING …");
} else {
    note("clause (a) precondition WEAK: live preview motion not observed on dist …
         — proceeding; the synthetic-tick no-throw assertion still holds even if the sweep had settled.");
}
```

If the easing scene's rAF loop has already SETTLED (sweep completed, `playback.running === false`),
`stop()` on a non-running loop is a no-op — `this._gen++` still runs but there is no Vue reactive
flush context to absorb the non-throw, so the `pageerror` collector trivially sees zero errors even
on the PRE-FIX tree. The gate correctly proceeds and notes this; the spec acknowledged the dist's
intermittent auto-play timing. But a `note` means the gate CAN pass its clause (a) without ever
proving the born-RED property on that run. The born-RED-of-record is preserved by the DETERMINISTIC
dev-server path (clause a, `KF_DEV_SERVER=1`), which is SKIPPED in normal CI runs.

**Risk for J.** If the dist's easing scene starts settling faster (e.g. a performance improvement
shortens the sweep loop), the dist clause (a) will increasingly pass vacuously on both the broken
and fixed tree. The gate's correctness authority should migrate toward `KF_DEV_SERVER=1` runs in CI
or a forced-play + immediate-tick path in the dist harness. Currently this is documented but not
enforced.

**The `liveLoopMoving` oracle.** It reads `f(0.NN)` from `document.body.innerText` or falls back
to a computed transform on `.progress-ball`. This is a live DOM read, not a localStorage proxy —
passes the gate-ORACLE precept. However the fallback (`getComputedStyle(ball).transform`) on a
non-moving loop would return a static string and correctly signal `moving=false`.

---

## §7 — Bind-proof completeness: public surface vs prototype

**All four public control methods are bound.** `play`, `drive`, `loop`, `stop` are arrow
class-fields (`src/animation/playback.ts:160,204,224,230`). The private `_run` and `_cleanup`
remain prototype methods — correct per the spec (they are never extracted as values; only reached
as `this._run(...)`).

**`AnimationGroup.playback` transitively safe.** `group.playback` is a `RAFPlayback` instance.
`scenePlaybackAdapters.ts:73`: `group.playback.stop()` is a member call — safe before and after
S1. With S1, even `const { stop } = group.playback; stop()` would now be safe.

**No explicit unit test for the bind-proof property.** Neither `test/engine-modern-web.test.ts`
nor any test file contains a `const bare = pb.stop; bare()` assertion. The spec intended the gate
to be the correctness proof; the static guard (clause d) is the second altitude. A unit test that
explicitly exercises `const { stop } = new RAFPlayback(); stop()` as the third altitude would make
the invariant executable in jsdom without Playwright.

---

## §8 — Gestalt: is the fix at the RIGHT seam?

Yes. The spec's design decision "bind-proof the engine, NOT wrap the two call sites" is correctly
executed. The alternatives were:

1. Arrow-wrap the two call sites: `useSceneVisibilityPause(() => playback.running, () => playback.stop(), startLoop)` — leaves the foot-gun live for the next consumer.
2. Constructor-bind only the escaping methods — equivalent to arrow fields for correctness; arrow fields are more idiomatic TypeScript for "instance-scoped by construction."
3. Arrow class-fields (chosen) — binding correctness lives once in the engine, inherited everywhere.

The `useRafScene` structural consolidation (S2) is also correctly placed: it removes the only
surface where the misuse recurred, making the binding correct BY STRUCTURE for all future raw-rAF
scenes that use the composable. The `sequence` scene's ineligibility is genuine (different topology)
and correctly documented.

**S3 consuming rather than re-implementing I.W2's mount** is architecturally sound. W2 committed
16 minutes before W1; the consumed surface was present and stable. The wave ordering (spec says W2
owns the surface, W1 consumes it) is honoured in the actual commit timestamps.

---

## §9 — Findings

| ID | Severity | Title | Evidence | Disposition |
|---|---|---|---|---|
| W1-1 | P2 | Gate clause (a) degrades to `note` when easing loop has settled — vacuous pass on a pre-fix tree is possible | `proof-fsm-suspend-resume-live.mjs:472-478`; the `note` path proceeds without failing even though the born-RED oracle is not exercised | FOLD (J should add a forced-play ping or require `KF_DEV_SERVER=1` in CI for clause a) |
| W1-2 | P2 | `sequence` scene has the same raw-rAF + `useSceneVisibilityPause` three-part recipe but was not migrated to `useRafScene` | `demo/sequence/useSequenceDemo.ts:202,419,443`; `useRafScene` interface assumes sole-RAFPlayback ownership — structurally ineligible as-is | FOLD (J should either extend `useRafScene` to cover the mirror-RAFPlayback topology, or document the exclusion as a design boundary) |
| W1-3 | BOOK | No unit test for the bind-proof invariant — `const { stop } = new RAFPlayback(); stop()` is not asserted | `test/engine-modern-web.test.ts` (no such test); the spec relies on the gate + static guard as the two altitudes | BOOK (add a third altitude: a jsdom unit test `const bare = pb.stop; bare()` → no throw) |

---

## §10 — Fold candidates for J

| Item | Origin | Status today | Must fold? |
|---|---|---|---|
| Clause (a) vacuous-pass risk (gate uses `note` not `fail` when loop settled) | W1 impl | OPEN — no mitigation in current tree | Yes — P2 |
| `sequence` scene structural debt (own raw-rAF + `useSceneVisibilityPause` recipe, not in `useRafScene`) | W1 scope boundary (was CORRECTLY excluded by spec) | OPEN — `useSequenceDemo.ts:202,419,443` still hand-wires the recipe | Evaluate — if J adds new raw-rAF scenes, the pattern gap compounds |
| Bind-proof unit test (third altitude) | BOOK | Missing | No (BOOK; hygiene only) |
