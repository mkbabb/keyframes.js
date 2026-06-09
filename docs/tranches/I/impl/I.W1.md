# I.W1 — IMPL record (the FSM suspend/resume bind-proof transposition)

**Status:** LANDED · gate `proof:fsm-suspend-resume-live` GREEN (live) · `tsc` 0 · 683 tests pass ·
branch `tranche-i-dev`. CONSUMES I.W2's order-independent control mount.

## What landed (file:line)

- **S1 — bind-proof the engine (PRIMARY).** `src/animation/playback.ts` — `RAFPlayback`'s four
  public control methods (`play`, `drive`, `loop`, `stop`) are now **arrow class-fields** (bound
  by construction), so `const { stop } = playback`, `playback.stop` passed as a callback, AND a
  member call are all safe FOREVER for every consumer — binding correctness lives ONCE in the
  engine. The private `_run`/`_cleanup` stay prototype methods (only ever `this._run(...)`). This
  closes the ENTIRE unbound-method crash class, not just B2's two sites. (Few + long-lived
  instances — one per scene — so the instance-field allocation is the right trade.)
- **S2 — `useRafScene` consolidation (STRUCTURAL).** NEW `demo/app/useRafScene.ts` (122 lines)
  owns the `markRaw(new RAFPlayback())`, the BOUND `startLoop`/`stopLoop`, the `createRafAdapter`
  wiring, the `onScopeDispose(stopLoop)`, AND the `useSceneVisibilityPause` registration with
  BOUND callbacks. `demo/easing/useEasingDemo.ts` (439→420) + `demo/spring/useSpringDemo.ts`
  (466→443) refactor onto it; the unbound `playback.stop` references (the former
  `useEasingDemo.ts:227`/`useSpringDemo.ts:365`) are DELETED in the same motion — the binding +
  visibility-pause correctness is now STRUCTURAL, not per-author discipline.
- **S3 — consume I.W2's mount (no new code).** `<Tabs> :model-value` binds
  `machine.selectedControlSurface(...)` — a pure projection of (active scene's DFA set × preferred
  pick) that depends ONLY on `activeScene`, never on flush ordering. The pre-fix blank was the
  `_gen` throw aborting the mount flush; with S1/S2 removing the throw, the flush completes and
  I.W2's single-authority renders the resumed/entered scene non-blank. Verified live (no gap).
- **S4 — HYGIENE static guard.** A grep clause (d) in the gate (eslint is not in the toolchain;
  the spec's `proof:`-grep alternative) reds on a bare `.stop/.suspend/.pause/.play/.drive/.loop`
  member passed as a callback, with a non-vacuity BITE self-test against the historical defect
  shape. HYGIENE tier — corroborates, never substitutes for a red runtime clause.
- **S5 — `sceneMachine.ts` PRESERVED** (the resume-iff-was-playing reducer — the keystone H got
  right).

## The gate (proof:fsm-suspend-resume-live) — live GREEN

Born-RED verified (the stale dist throws `_gen` on the synthetic tick). GREEN on fix:
- **(a)** the SYNTHETIC `visibilitychange→hidden` on a PLAYING easing scene → ZERO `_gen`/throw
  /flush-abort. ✓ (Born-RED-of-record: the DETERMINISTIC reproduction is the source-mapped dev
  server `:5174`; the dist throws it INTERMITTENTLY; the GREEN property is dist-verifiable.)
- **(b)** a live easing(PLAYING)→amiga switch with the visibility co-fire → the destination DFA
  control set renders NON-BLANK (pane opacity 1.00) + the source controls unmount; zero throws —
  I.W2's mount covers the resumed scene. ✓
- **(c)** resume-iff-was-playing holds across A→B→A in the MODE-PERSIST persistent context (the
  reducer EXECUTED, not just serialized). ✓
- **(d) HYGIENE** zero bare unbound-method callbacks across 199 files; the BITE self-test reds on
  the historical defect shape. ✓

The dock-Select integration leg (clause b2) is ASPIRATIONAL-post-B8 (the dock becomes
hit-testable after I.W4/I.W6) — de-coupled from the B2 born-RED witness, which is the synthetic
visibility tick (no dock gesture required).
