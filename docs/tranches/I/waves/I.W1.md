# I.W1 — THE FSM SUSPEND/RESUME BIND-PROOF TRANSPOSITION (Band 1 · the keystone repair — suspend without throwing)

- **Phase:** DEV — spec authored, awaits IMPL+auth · **Class:** SHIP-in-I (CRITICAL; the
  `this._gen` unbound-method crash throws inside a Vue reactive flush on a scene-switch /
  tab-hide while a raw-rAF scene plays → the render flush aborts → BLANK controls. ONE defect,
  two faces.) · **Scope (engine UNFENCED + demo composables):** `src/animation/playback.ts`
  (`RAFPlayback` control surface → bind-proof) + a NEW `demo/.../useRafScene.ts` composable
  (consolidate the duplicated raw-rAF scene recipe) + `demo/easing/useEasingDemo.ts` +
  `demo/spring/useSpringDemo.ts` (the two UNBOUND call sites) + the order-independent
  control-panel mount (SHARED with I.W2). The pure reducer `sceneMachine.ts` is **CORRECT and
  is NOT rewritten** — the keystone algebra is sound; only the EFFECT layer throws. ·
  **DAG-deps:** after **I.W0** (the `"......"` storm must be dead so this gate's console
  oracle is readable). Shares the order-independent control-mount with **I.W2** (B4's reka
  latch); that single-authority is authored ONCE (I.W2 owns the surface; I.W1 consumes it for
  the resumed/entered scene). Folds B3's stale-controls-on-switch (the empty-controls + leaked
  pause glyph on easing→amiga is B2 surfacing on that scene — `rc-amiga §Scope notes`).

## §Provenance (the folded root causes + investigation)

- `rootcause-rc-dfa-gen.md` — the CONFIRMED root cause, one defect two triggers. `b2/b14`
  (unbound `playback.stop`) is ADJUDICATED CORRECT over `b12`'s stale-group race (ruled out by
  the error-message semantics): `useEasingDemo.ts:227` and `useSpringDemo.ts:365` pass the
  UNBOUND instance method `playback.stop` (a bare `RAFPlayback.prototype.stop` value with its
  receiver dropped) as the `pause` callback to `useSceneVisibilityPause(...)`. The watcher
  invokes it free-standing → `this === undefined` → `this._gen++` (`playback.ts:216`) throws
  `TypeError: undefined is not an object (evaluating 'this._gen')`. The throw lands inside a
  Vue reactive flush (`watch` job → `flushJobs`), aborting the in-flight component-update of
  the scene swap → the incoming scene's control panel half-mounts → BLANK controls.
- `rootcause-rc-dfa-gen.md §1b` — the decisive adjudication: the user's message names
  `this._gen` (Safari's phrasing for reading `_gen` off an `undefined` `this` INSIDE `stop`).
  The ONLY other `_gen` deref reachable on a switch, `createGroupAdapter.suspend()`
  (`scenePlaybackAdapters.ts:72-73`), is a MEMBER call (`group.playback.stop()`) — `this` is
  the playback object, never `undefined`. A member call cannot enter `stop` with
  `this===undefined`. Therefore the throw is an unbound free call, NOT a stale-group deref.
- `rootcause-rc-dfa-gen.md §2` — WHY the user saw it on a SCENE SWITCH: the dock "Scene"
  select routes through `useSceneTransition`'s `startViewTransition`, which co-fires a
  `visibilitychange`/blur tick; `@vueuse`'s `useDocumentVisibility` (which `useSceneVisibilityPause`
  rides) flips reactive, the watch job flushes, and calls the UNBOUND `playback.stop`. The
  user's "via scene switch" stack and the deterministic "via tab-hide" stack are the SAME
  unbound `RAFPlayback.stop`, differing only in which watcher fired it. Hash-NAVIGATE alone
  does NOT co-fire the visibility tick — exactly why `rc-gen-captureactive.mjs`/`dev-gen-repro.mjs`
  show `genError:false` on every hash path. The bug needs the VT/visibility co-fire (a
  `visibilitychange` OR the real dock gesture). **The born-RED-of-record is the synthetic
  `visibilitychange` (NO dock gesture) — see §The dist-vs-dev oracle below.**

- **§The dist-vs-dev oracle (RED-3, resolved firsthand on `dist/gh-pages/`).** b10 §B2 read
  "`this._gen` is dev-only" — that is a HALF-TRUTH that must not mislead IMPL. Re-verified
  first-hand against the BUILT `dist/gh-pages/` via `probes/b2-dist-visibility-suspend.mjs`
  (result `probes/b2-dist-visibility-suspend.result.json`):
  - The unbound site **survives minification into the lazy chunk** —
    `EasingScene-DpL60cpI.js: ie(()=>v.running, v.stop, w)` (and
    `SpringScene-BWoFfuSD.js: ae(()=>C.running, C.stop, D)`), where `v.stop`/`C.stop` are the
    bare unbound `playback.stop`.
  - The `_gen` field name **survives minification** — `engine-Do5bTwuK.js: stop(){this._gen++,…}`.
    So the BUILT-dist throw message ALSO reads `Cannot read properties of undefined (reading '_gen')`
    (verbatim stack captured: `at stop (engine-Do5bTwuK.js:1:2437)` from the
    `useSceneVisibilityPause` watcher). What b10 meant by "dev-only" was the SOURCE-MAPPED stack
    FRAME NAMES (`stop`/`playback.ts:156`), not the field or the throw.
  - **The throw IS reproduced on the built dist** via the synthetic `visibilitychange→hidden`
    while the easing raw-rAF scene plays (captured verbatim: `at stop
    (engine-Do5bTwuK.js:1:2437)`, reading `_gen`) — **but INTERMITTENTLY**: across repeated
    harness runs the dist's `@vueuse` `useDocumentVisibility` ref does not reliably flip on a
    HARNESS-synthesised `visibilitychange` (it reads a captured/cached visibility), so the
    watcher's `r==='hidden'` branch is not always taken. The easing loop itself stays live
    (`playback.loop(frame)` is continuous — `useEasingDemo.ts:168/213` — and the scene rAF was
    measured running), so the flakiness is the synthetic-event reactivity, not a settled loop.
    On the source-mapped dev server `:5174` the same defect is **DETERMINISTIC** ("every
    tab-hide while a raw-rAF scene plays", `b2-dfa-gen-crash.md`, captured live with the
    source-mapped stack `at stop (playback.ts:156)`).
  - **Resolution (the gate honesty fix):** the synthetic-tick witness runs on the BUILT dist
    (RED-3 path a — `_gen` is NOT dev-only), AND the DETERMINISTIC born-RED-of-record for the
    suspend leg is permitted to run against the source-mapped dev server `:5174` as a NAMED,
    JUSTIFIED exception to the built-dist harness rule (RED-3 path b), because the dist's
    auto-play timing makes the synthetic-tick witness flaky. The bind-proof fix (S1) greens BOTH.
- `rootcause-rc-dfa-gen.md §3` — the BLANK-controls symptom is DOWNSTREAM of the throw (the
  flush-abort, `shots/sw2_easing_to_amiga.png` — the leaving panel frozen ~0.3 opacity
  mid-VT). A clean hash switch with NO co-fired visibility tick renders the destination
  controls correctly (`b14 §3`) — proving the blank is the flush-abort, not a DFA mis-mapping
  (the DFA table + per-scene render are CORRECT, `b14` verdict).
- `b12-scene-switching-matrix.md` band B — a SEPARATE `{easing,spring}→square` blank via a
  `selectedAnimation`/teleport seam, distinct from the `_gen` flush-abort but sharing the cure
  principle (order-independent control mount). `recap-chronic §2 B2`, `recap-precepts §1.2` —
  B2 is the H.W1 keystone re-opened: `proof:scene-machine-irrefragable` round-tripped a
  localStorage SNAPSHOT (stubbing the live adapter), never fired `visibilitychange`, never
  drove the real dock-select while playing.

## §The state, verified (file:line / live anchors)

- **The throw site:** `src/animation/playback.ts:216` — `this._gen++;` (the first statement
  of `RAFPlayback.stop()`), `this === undefined`.
- **The unbound caller:** `demo/app/useSceneVisibilityPause.ts:45` — `pause();` (invokes the
  stored reference free-standing).
- **The two UNBOUND call sites (THE DEFECT):** `demo/easing/useEasingDemo.ts:227` +
  `demo/spring/useSpringDemo.ts:365` —
  `useSceneVisibilityPause(() => playback.running, playback.stop, startLoop);`.
- **Correct bound siblings on the SAME instance (proof the object is alive, only the binding
  is lost):** `useEasingDemo.ts:171` (`stopLoop = () => playback.stop()`), `:219`
  (`onScopeDispose`). `playback` is `markRaw(new RAFPlayback())` (`:150` / `:165`) — never
  disposed before the tick; `playback.stop` extracts the function VALUE off the instance, and
  JS does not auto-bind methods. Minimal isolation (b14 ran it): `const pb = new RAFPlayback();
  const bare = pb.stop; bare();` ⇒ `TypeError: ... reading '_gen'`.
- **The group-adapter suspend (MEMBER call — SAFE, rules out b12):** `scenePlaybackAdapters.ts:72-73`
  — `if (group.started && !group.paused) group.pause(); else group.playback.stop();` (both
  invoked WITH a receiver). The RAF-adapter suspend (`scenePlaybackAdapters.ts:185
  handle.stopLoop`) is a bound arrow — also SAFE.
- **The CORRECT machinery (do NOT rewrite):** the pure reducer `sceneMachine.ts:106-196`
  (`SCENE_READY → status: snap.playing ? "playing" : "paused"` — the resume-iff-was-playing
  algebra is correct, `b12 §5` verified live); `captureActive (useSceneMachine.ts:141-157`
  snapshots-then-suspends on leave); the VT wrap (`useSceneTransition.ts:32 → App.vue:291`).
- **The duplication seam:** easing + spring HAND-WIRE the identical "raw-rAF scene" recipe —
  own a `RAFPlayback`, expose `startLoop`/`stopLoop`, build a `createRafAdapter`, register it,
  AND wire `useSceneVisibilityPause` — and BOTH made the same binding mistake at the same line.
  The bug is the duplication's symptom (`rc-dfa-gen §5b`).

## §Goal

Make a PLAYING raw-rAF scene survive a tab-hide (the synthetic `visibilitychange` — the
born-RED-of-record) AND a within-session scene-switch with **zero throw**, the leaving scene
SUSPEND+SAVE, the entering scene RESUME iff it was playing (else paused) — the user's exact
spec — and the destination's control panel mount NON-BLANK regardless of which adapter family
preceded it. (The user's REAL dock-Select gesture is proven clean as an ADDITIONAL,
aspirational-post-B8 assertion — clause (b2) — once I.W4/I.W6 make the dock hit-testable; it is
NOT the born-RED witness, because the broken dock obstructs the gesture before the suspend can
throw.) The cure is a transposition at the engine seam, NOT a per-call-site arrow patch (that
leaves the foot-gun live for the next consumer).
Three nested altitudes; the wave lands the deepest two and the contract-preserving third:

1. **Bind-proof the engine (the primary transposition):** `RAFPlayback`'s control surface is
   bound-by-construction, so `const s = pb.stop; s()` can NEVER lose `this`. This closes the
   ENTIRE unbound-method crash class, not just B2's two instances.
2. **Consolidate the raw-rAF scene boilerplate into ONE composable (the structural
   transposition):** the duplicated recipe — and its duplicated binding mistake — collapses
   into `useRafScene`, so no scene can re-introduce the unbound reference.
3. **Make the control-panel mount a PURE FUNCTION of the DFA set + active group, order-
   independent (the contract hardening, SHARED with I.W2):** so neither the `_gen` flush-abort
   NOR the `selectedAnimation`/teleport seam (b12 band B) can ever blank a panel the DFA says
   exists. The pure reducer algebra is PRESERVED untouched.

## §Scope

- **S1 — bind-proof `RAFPlayback` at the engine seam (KFI, engine, inv-16 unfenced — the
  PRIMARY).** Locus: `src/animation/playback.ts`. Define `RAFPlayback`'s control methods
  (`stop`/`play`/`drive`/`loop` — whichever lose `this` when passed as a value) as
  **bound-by-construction**: arrow class-fields (`stop = () => { this._gen++; … }`) OR bound in
  the constructor. Then `const { stop } = playback`, `playback.stop` passed as a callback, and
  a member call are ALL safe, FOREVER, for every consumer — the binding correctness lives ONCE,
  in the engine, not re-asserted per call site. **WHY:** the class of bug is *"an
  `RAFPlayback`/`AnimationGroup` control method loses `this` when passed as a value"* — a
  RECURRENCE (the H stack already carried a `Function.prototype.bind`-drops-the-tag bug noted
  in `animation/CLAUDE.md` WAAPI section). inv-16 puts the engine in scope. **Cost note
  (measure-first):** arrow fields move methods onto the instance, not the prototype — a
  per-instance allocation. `RAFPlayback` instances are FEW and long-lived (one per scene), so
  this is the right trade; the engine owns its own binding invariant either way. If a bench
  says the prototype matters for a hot path, constructor-bind only the control methods that
  escape as callbacks.

- **S2 — `useRafScene(frame, opts)`: consolidate the duplicated raw-rAF recipe (KFI, demo
  composable, the STRUCTURAL transposition).** Locus: NEW `demo/.../useRafScene.ts`;
  refactors `useEasingDemo.ts` + `useSpringDemo.ts`. The composable OWNS the `RAFPlayback`,
  the BOUND `startLoop`/`stopLoop`, the `createRafAdapter` wiring, AND the
  `useSceneVisibilityPause` registration **with bound callbacks** — so no scene can
  re-introduce the unbound reference, and the visibility-pause is registered correctly in ONE
  place. The two ~440-line demo composables shrink and converge. **WHY:** this is the KISS /
  no-legacy move — the binding + visibility-pause correctness becomes STRUCTURAL, not
  per-author-discipline. S1 and S2 are complementary: S1 makes the engine method safe even if
  misused; S2 removes the duplicated misuse surface. Do BOTH (defense in depth at the engine
  seam AND elimination of the duplication). The unbound `playback.stop` references at
  `useEasingDemo.ts:227`/`useSpringDemo.ts:365` are DELETED in the same motion (no-legacy — no
  stray arrow-wrap left beside the composable).

- **S3 — the order-independent control-panel mount (KFI, SHARED with I.W2 — the contract
  hardening).** Locus: the control-pane surface (`AnimationControls.vue` / `ControlsPaneWrapper.vue`
  / the per-scene render). Make the panel a PURE FUNCTION of the active scene's DFA
  control-surface set + the active group — order-independent, so the resumed/entered scene's
  controls ALWAYS mount regardless of which adapter family preceded it. This is the SAME
  reconcile I.W2 (B4) wants (FSM ↔ controls-surface single authority); **author it ONCE in
  I.W2 and consume it here.** It ensures neither the `_gen` flush-abort (this wave's primary)
  NOR the `selectedAnimation`/teleport seam (b12 band B) can blank a panel the DFA says
  exists. **WHY:** the blank is the symptom; the durable cure is that the control mount cannot
  depend on flush-completion or adapter-family ordering. (`rc-dfa-gen §5c`, `b12 band B`.)

- **S4 — the static guard (the second altitude of the same class).** Enable
  `@typescript-eslint/unbound-method` (or a `proof:` grep) so a bare `.stop`/`.suspend`/`.pause`
  passed as a callback REDS at lint/source time — the bug class is caught at TWO altitudes
  (the runtime gate of §Hard gate + this static lint), never again behind a source-shape
  green. **WHY:** the unbound-method class is statically LINTABLE and was not linted; a whole
  bug class shipped invisible (`rc-dfa-gen §4`). This is a HYGIENE-tier gate (per I.W7), valued
  as the cheap second net — it does NOT carry correctness authority (the runtime gate does).

- **S5 — PRESERVE the pure reducer untouched (the contract clarification).** The user's spec
  (*"first scene SUSPEND+SAVE, next RESUMES iff it was playing before, else paused"*) is
  ALREADY implemented correctly in `sceneMachine.ts` (`SCENE_READY → status: snap.playing ?
  "playing" : "paused"`; `captureActive` snapshots-then-suspends). The fix must NOT rewrite
  that algebra — the keystone is correct; what S1/S2 restore is the EFFECT layer's ability to
  EXECUTE the suspend without throwing. **WHY:** the FSM contract is sound (the reducer is the
  keystone H got right); the defect is orthogonal (an unbound callback on a visibility watcher
  two scenes wired). Rewriting the reducer would be churn that risks the correct algebra.

## §Hard gate (the proof:* that BITES — born-RED on `b934a08`, GREEN-on-fix · RUNTIME/INTERACTION)

**`proof:fsm-suspend-resume-live`** — a Playwright session modelled on the
`proof-no-orphan-specular.mjs` harness. **Two harness modes, named explicitly (RED-3 + H-6):**

- **MODE-PERSIST (the suspend/resume/switch matrix — H-6).** ONE persistent browsing context
  that carries FSM + localStorage state across the whole leg: `load → play → switch →
  switch-back → replay`. The resume-iff-was-playing property is a CROSS-SCENE, WITHIN-SESSION
  continuity property — a fresh-context-per-scene RESETS the machine + localStorage between
  scenes and DESTROYS exactly the suspend→resume continuity this gate must observe. Clauses
  (a), (b), and (c) run in this single accumulating context.
- **MODE-FRESH (the independent per-scene legs).** Fresh context per scene (the
  `proof-no-orphan-specular.mjs` default) for the load/play/icon-paint/non-blank-mount legs that
  carry NO cross-scene state. Clause (b)'s destination non-blank check reads a single switch in
  MODE-PERSIST; the load-and-render-clean baseline is MODE-FRESH.

**The harness target (the dist-vs-dev split — RED-3, named per leg).** The DEFAULT target is the
BUILT `dist/gh-pages/`. The SUSPEND leg's deterministic born-RED witness is the one NAMED,
JUSTIFIED exception: it runs the synthetic-tick clause (a) against the SOURCE-MAPPED dev server
`:5174`, because on the built dist the `_gen` throw is INTERMITTENT (it fires only when the rAF
loop is live at the tick — `b2-dist-visibility-suspend.result.json`), whereas on `:5174` it is
DETERMINISTIC. The dist run of clause (a) is ALSO kept (it reproduces the throw — `_gen` is NOT
dev-only — just flakily), so the gate witnesses B2 on BOTH artifacts; the dev-server run is the
deterministic born-RED-of-record. Every other clause runs on the dist.

Across the (scene→scene) matrix where the source scene is a raw-rAF scene (easing/spring) and is
PLAYING:

- **clause (a) — THE BORN-RED-OF-RECORD: PLAYING + SYNTHETIC visibility tick = no throw (NO dock
  gesture).** Load a raw-rAF scene → let it AUTO-PLAY (or click play) → assert `playback.running`
  → dispatch a SYNTHETIC `visibilitychange → hidden` while the loop is live → assert **ZERO**
  `pageerror`/`unhandledrejection` across the transition. **This is the keystone witness and it
  requires NO dock gesture** — the bind-proof fix (S1) is independently provable by the synthetic
  tick on a playing easing scene. **BITE:** reds TODAY — the unbound `playback.stop` throws
  `Cannot read properties of undefined (reading '_gen')` at `stop` (DETERMINISTIC on `:5174`
  per `b2-dfa-gen-crash.md`; reproduced on the BUILT dist verbatim — `at stop
  (engine-Do5bTwuK.js:1:2437)` — INTERMITTENTLY, `b2-dist-visibility-suspend.result.json`);
  greens on S1 (bind-proof) + S2 (the consolidated composable's bound registration). Runs in
  MODE-PERSIST; the deterministic born-RED-of-record run targets `:5174`, the corroborating run
  targets the dist.
- **clause (b) — non-blank destination on a live SWITCH (the switch FACE of the same defect).**
  In MODE-PERSIST, with the source scene PLAYING, drive a scene-switch and assert the
  destination's DFA control set renders NON-BLANK (opacity ≈ 1, expected panel text present) AND
  the source's controls fully unmount. The switch is driven by the SYNTHETIC visibility co-fire
  + hash-route (the deterministic path) — NOT the dock gesture. **BITE:** reds TODAY (the `_gen`
  throw aborts the flush → blank controls, `shots/sw2_easing_to_amiga.png`); greens on S1+S2 (no
  throw) + S3 (order-independent mount).
- **clause (b2) — ADDITIONAL integration assertion (ASPIRATIONAL, post-B8): real dock-Select
  co-fires the VT tick.** Once I.W4/I.W6 make the dock hit-testable, drive a REAL dock-Select
  scene-switch (hover-expand the morphing dock → open the reka combobox → pick the destination —
  the user gesture, which co-fires the VT visibility tick) and assert the same no-throw +
  non-blank outcome. **This clause is DE-COUPLED from the B2 born-RED-of-record:** on `b934a08`
  the dock trigger is `visibility:hidden` mid-animation (B8 directly obstructs the gesture —
  `rc-dock-dom.mjs`, b12 §4), so `force`-click never opens the reka popper; the born-RED witness
  here would be "the gesture didn't fire," NOT "the suspend threw." Therefore (b2) is marked
  **aspirational-post-B8** — it greens only AFTER I.W4/I.W6's dock is hit-testable, and it does
  NOT carry the B2 correctness authority. The bind-proof correctness oracle is clauses (a)/(b)
  via the synthetic tick; (b2) proves the user's REAL gesture is clean once the dock is fixed.
- **clause (c) — resume-iff-was-playing holds across the live transition (MODE-PERSIST).** In the
  ONE persistent context: PLAY scene A → switch to B → assert B resumes iff B was playing before
  (else paused); switch BACK to A → assert A's state matches the carried snapshot; a switch FROM a
  PAUSED scene leaves the entering scene paused. Assert the LIVE playback state of each entered
  scene matches the spec (the snapshot algebra EXECUTED, not just serialized). **BITE:** reds
  TODAY because the suspend throws BEFORE the snapshot can be honored on the effect layer; greens
  when S1/S2 let `captureActive`'s suspend complete. **This is the live-object oracle** — it reads
  the live adapter's playing state across a WITHIN-SESSION switch, NOT a localStorage round-trip
  (the proxy `proof:scene-machine-irrefragable` used, `rc-dfa-gen §4`, `recap-precepts §1.2`).
  The cross-scene continuity is exactly what MODE-FRESH would destroy — hence H-6's persistent
  context is load-bearing for this clause.
- **clause (d) — static lint (HYGIENE tier):** `@typescript-eslint/unbound-method` (or the
  grep) REDs on a bare `.stop`/`.suspend`/`.pause` passed as a callback. **BITE:** reds TODAY
  on `useEasingDemo.ts:227`/`useSpringDemo.ts:365`; greens when S2 deletes them. *(Labeled
  HYGIENE — the cheap second altitude; it does NOT carry correctness authority. The wave's GREEN
  depends on the RUNTIME clauses (a)/(b)/(c) ALONE — this hygiene clause may NOT substitute for a
  red runtime clause, per the I.W7 two-tier taxonomy / H-4.)*

**The §spine bar — MUST bite.** The CORRECTNESS oracle is clauses (a)/(b)/(c): they PLAY a real
scene, fire the SYNTHETIC visibility tick (NO dock gesture required for born-RED), and read the
LIVE adapter (no throw, non-blank mount, resume-iff-was-playing across a within-session switch) —
the exact path `proof:scene-machine-irrefragable` stubbed behind a localStorage snapshot
(`rc-dfa-gen §4`). Revert S1 → (a)/(b) throw; revert S3 → (b) blanks; revert the reducer (do NOT)
→ (c) fails. RED on `b934a08` (the live `_gen` crash + blank controls), GREEN only when the
bind-proof engine + consolidated composable + order-independent mount land. Clause (b2) (the real
dock gesture) is ASPIRATIONAL-post-B8 and is NOT part of the born-RED-of-record. This gate is a
CLAUSE of the I.W7 `proof:live-session` battery (the suspend/switch leg), inherits the I.W7
structured error budget (H-2), and is enforced runtime-driven by the I.W7 `proof:gate-is-runtime`
meta-gate.

## §Folds

- **B2** (the `_gen` crash + blank controls — ONE defect, two faces) — S1 (bind-proof engine)
  + S2 (consolidated composable) + S3 (order-independent mount).
- **B3's stale-controls-on-switch** (the empty-controls + leaked pause glyph on easing→amiga,
  `shots/b3-amiga-06/07`) — this is B2 surfacing on the amiga destination, handed FROM
  `rc-amiga §Scope notes`; closed by S1+S2+S3. (The amiga GEOMETRY float is I.W3, independent.)
- **b12 band B** (`{easing,spring}→square` control-panel blank via the `selectedAnimation`/
  teleport seam) — a DISTINCT cause from `_gen`, folded under the S3 order-independent
  control-mount cure. (`rc-dfa-gen §7 CARRIED`.)
- **RECORD (do NOT rewrite):** the pure reducer `sceneMachine.ts` — the resume-iff-was-playing
  algebra is CORRECT (`b12 §5` live-verified). The keystone H got right; I restores the effect
  layer's ability to execute it.
- **RED-3 gate-honesty fold (the witness specification).** The B2 born-RED-of-record is the
  SYNTHETIC `visibilitychange→hidden` on a playing easing scene (clause a, NO dock gesture) —
  de-coupled from the B8 dock obstruction (clause b2 is aspirational-post-B8). The `_gen`
  dist-vs-dev oracle is resolved firsthand: the throw reproduces on the BUILT dist (the unbound
  site + `_gen` field both survive minification — `probes/b2-dist-visibility-suspend.{mjs,result.json}`)
  but INTERMITTENTLY; the DETERMINISTIC born-RED-of-record run targets the source-mapped dev
  server `:5174` as a NAMED, justified exception. (Closes harden-review RED-3.)
- **H-6 fold (the harness continuity).** The suspend/resume/switch legs (clauses a/b/c) run in
  ONE persistent browsing context (MODE-PERSIST) carrying FSM + localStorage state so
  resume-iff-was-playing is observable; fresh-context-per-scene (MODE-FRESH) applies only to the
  independent load/play/non-blank-mount legs. (Closes harden-review H-6.)

## §Design decisions (trade-offs RESOLVED)

- **Bind-proof the engine, NOT wrap the two call sites — RESOLVED.** Wrapping
  `useSceneVisibilityPause(() => playback.running, () => playback.stop(), startLoop)` is the
  minimal patch and it leaves the foot-gun live for the next consumer. The class of bug recurs
  (the H WAAPI bind note). The durable cure is the engine seam (S1) — binding correctness ONCE,
  inherited everywhere. The arrow-field allocation cost is accepted (few, long-lived instances;
  measure-first if a bench bites).
- **Consolidate AND bind-proof (defense in depth) — RESOLVED.** S1 (engine) and S2 (composable)
  are complementary, not redundant: S1 makes the method safe even if misused; S2 removes the
  duplicated misuse surface and the ~880L of duplicated recipe. Doing only one leaves either
  the duplication (re-introducible) or the foot-gun (re-passable). Do both.
- **The pure reducer is PRESERVED, not rewritten — RESOLVED.** The keystone algebra is sound
  (the adjudication ruled out the b12 reducer-race hypothesis). Rewriting it would churn the
  one thing H got right and risk regressing resume-iff-was-playing. The fix is strictly the
  effect layer (the unbound callback) + the control-mount contract.
- **The order-independent control mount is authored in I.W2, consumed here — RESOLVED.** B4's
  reka `<Tabs>` latch and B2's flush-abort both blank a panel the DFA says exists; the cure is
  the SAME single-authority surface mount. To avoid two waves re-inventing it, I.W2 owns the
  surface single-authority (it is the easing-editor wave where the latch lives) and I.W1
  consumes it for the resumed/entered scene. The §Hard gate clause (b) here asserts the
  destination mounts non-blank; I.W2's gate asserts the easing panel un-hides on switch — the
  same cure, two witnesses.
- **The static lint is a second altitude, not the cure — RESOLVED.** `unbound-method` would
  have caught the class at source time; it is enabled as the cheap net (S4), but it is labeled
  HYGIENE (I.W7) and does NOT carry correctness authority — the runtime gate that PLAYS a scene
  and fires the visibility tick is the correctness oracle. Two altitudes, one of them the
  product.

- **The B2 born-RED-of-record is the SYNTHETIC visibility tick, NOT the dock gesture (RED-3) —
  RESOLVED.** The headline `proof:live-session` keystone must bite born-RED on the broken tree.
  The dock-Select user gesture CANNOT do that for B2: on `b934a08` the dock trigger is
  `visibility:hidden` mid-animation (B8 obstructs it — `rc-dock-dom.mjs`, b12 §4), so a
  `force`-click never opens the reka popper, and the born-RED witness would be "the gesture
  didn't fire" rather than "the suspend threw." So the bind-proof fix is proven by the SYNTHETIC
  `visibilitychange→hidden` on a PLAYING easing scene (clause a) — NO dock gesture required.
  The "real dock-Select co-fires the VT tick" is split out as clause (b2), an ADDITIONAL
  integration assertion that greens only AFTER I.W4/I.W6's dock is hit-testable (aspirational-
  post-B8). This DE-COUPLES the B2 correctness oracle from the unrelated B8 dock fix — the B2
  gate turns green on S1/S2/S3 alone, not entangled with another wave's deliverable.

- **The `_gen` dist-vs-dev oracle, resolved firsthand (RED-3) — RESOLVED.** b10 read "`this._gen`
  is dev-only"; re-verified against the BUILT `dist/gh-pages/`
  (`probes/b2-dist-visibility-suspend.{mjs,result.json}`): the unbound site survives minification
  into the lazy chunk (`EasingScene-DpL60cpI.js: ie(()=>v.running, v.stop, w)`), the `_gen` field
  name survives (`engine-Do5bTwuK.js: stop(){this._gen++…}`), and the throw REPRODUCES verbatim
  on the dist (`at stop (engine-Do5bTwuK.js:1:2437)`). What was "dev-only" was the source-mapped
  STACK FRAME names, not the field/throw. On the built dist the throw is INTERMITTENT (the
  `@vueuse` ref does not reliably flip on a harness-synthesised `visibilitychange`); on the
  source-mapped dev server `:5174` it is DETERMINISTIC. **Decision:** the synthetic-tick clause
  (a) runs on BOTH artifacts; the
  DETERMINISTIC born-RED-of-record run targets `:5174` as a NAMED, JUSTIFIED exception to the
  built-dist harness rule (the charter's "built dist for all legs" is corrected to allow this one
  named exception); the corroborating dist run keeps the gate honest that `_gen` is not dev-only.
  S1 greens both.

- **ONE persistent browsing context for the suspend/resume/switch matrix (H-6) — RESOLVED.** The
  resume-iff-was-playing property is a CROSS-SCENE, WITHIN-SESSION continuity property: you must
  PLAY scene A, switch to B in the SAME session, switch back, and replay — carrying FSM +
  localStorage state. The `proof-no-orphan-specular.mjs` "fresh context per scene" pattern RESETS
  the machine + localStorage between scenes and would DESTROY the very continuity clause (c)
  observes. So the gate names two harness modes: MODE-PERSIST (the single accumulating context for
  the suspend/resume/switch legs — clauses a/b/c) and MODE-FRESH (per-scene for the independent
  load/play/non-blank-mount legs). The persistent context is load-bearing for the resume-iff-was-
  playing assertion to be observable at all.
