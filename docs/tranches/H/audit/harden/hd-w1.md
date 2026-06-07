# DEEP HARDEN — Lane hd-w1 · H.W1 (the scene+playback STATE MACHINE, the keystone)

**Charge:** red-team the FSM DESIGN for correctness + feasibility, not doc-consistency.
**Verdict:** the architecture is **SOUND and feasible** — `createGlobalState` + a pure
`transition(state,event)` reducer genuinely CAN collapse the 5 scene + 3 playback
authorities + the `isStableFire` heuristic, and the live D12 defect is fully real (I
reproduced the storm, the control leak, the `next()` flood, the `"......"` parse error on
the running :5173 tree). The one-way-projection move is the correct fix at the source. But
the wave ships with **one HIGH gate-bite defect (the keystone gate does NOT bite — it
passes vacuously on the broken tree TODAY), one HIGH under-specification (S2 deletes the
easing `contractAnim` adapter without naming the transport-contract replacement), and
several MED/LOW anchor + scope corrections.** None is a BLOCKER: every claimed API exists
(`createGlobalState` is re-exported from `@vueuse/shared` through `@vueuse/core` and is
already the demo's standard; the per-scene `defineExpose({animationGroup,superKey,isPlaying,
isStarted})` contract every scene already implements makes the `SCENE_READY` lifecycle
event feasible; the engine fields the `serialize()` identity set names all exist).

---

## VERIFIED-SOUND (no finding — honest credit, inv ε)

So the skepticism is calibrated, here is what I checked and found genuinely correct:

- **The facility exists and is idiomatic.** `createGlobalState` is exported (`@vueuse/shared/dist/index.d.ts`) and re-exported by `@vueuse/core@14.3.0`; the demo already uses it (`controlOptionsStore.ts:2,35`, `animationOptionsStore.ts`, `useAssetManager.ts`). `useStateMachine` is genuinely ABSENT from vueuse (grep empty) — so the §Design-decision "pure reducer NOT XState" is correctly motivated. **The §2.1 adjudication (createGlobalState over Pinia) is faithfully binding in the wave — no hedge.**
- **`SCENE_READY` is feasible and strictly better than `isStableFire`.** Every scene `defineExpose`s a uniform contract (`{animationGroup, superKey, isPlaying, isStarted}` — verified across all 8 scenes). `CubeScene` calls `setTargets()` inside its OWN `onMounted` (`CubeScene.vue:178-186`, post child-ref resolve). So a scene-owned `SCENE_READY` emitted from the scene's `onMounted` is genuinely AFTER targets are set — exactly the lifecycle point the cross-component double-watcher `isStableFire` (`useSceneGroupSync.ts:54`) only *approximated*. S4's design is sound.
- **The home↔cube split is feasible.** The alias is real (`App.vue:198-211`: `activeSceneComponent`/`activeSceneKey`/`activeSceneProps` all special-case `isHome || 'cube' → CubeScene, key='cube'`). `CubeScene` already takes a `hideLoader` prop and persists transform across home↔cube (`CubeScene.vue:189-201`), so splitting into two FSM states (home = no group; cube = its group) is a clean transposition, not a rewrite.
- **The 8-field hand-poke and the markRaw constraint are real.** `usePlaybackSnapshot.ts:52-83` re-seats `started/lastTickTime/managed/started/reversed/iteration/startTime/t/paused/pausedTime` then `transformFramesGrouped`+`resume()`; the engine objects ARE `markRaw` (`App.vue:188`, `useEasingDemo.ts:131,135,268,279`). The S6 engine-HANDOFF (`serialize()/hydrate()`) correctly targets this layering smell. The `proof:group-snapshot-identity` field set `{t,reversed,iteration,playing,started}` is the right serializable subset — `startTime`/`pausedTime`/`lastTickTime` are clock-derived runtime state reconstructable from `t + now` (the existing restore already does exactly that, `:65`), so they correctly need NOT be in the snapshot.
- **The `next()` flood is real in vue-router 5.1.0.** Live: **14×** `[Vue Router warn]: The next() callback in navigation guards is deprecated. Return the value instead.` The repo is on vue-router **5.1.0** (not 4.x) where `next()` IS deprecated — so S5's "drop to a returned value" is correct and `proof:no-deprecated-guard` will bite.
- **The control leak (D12 corruption) is real and root-caused correctly.** Live: under the drifted route the panel showed `blend`+`z-index`+8× `duration` (cube's group under a non-cube route). `AnimationControlsGroup.vue:148,155` confirmed: `superKey` is destructured from `defineProps` and `getStoredAnimationGroupControlOptions(superKey)` is resolved ONCE at setup off the lagging key. (Side-note: this destructure also violates the project's own props-destructure precept — but that is H.W3/ACG's surface, not W1's.)

---

## FINDINGS

### [HIGH · gate does not bite] `proof:no-route-storm` passes VACUOUSLY on the broken tree — the keystone gate's §spine-bar claim is FALSE for this clause
**Loc:** `H.W1.md §Hard gate` clause 2 (`:55`) + `§spine bar :62`; `_SYNTHESIS-gap-scorecard.md §3 H.W1 :131`.

**Defect (LIVE evidence).** The gate is specified as: *"load `#/easing`, idle 2s with a pushState/replaceState history trap, assert ≤1 nav entry and the resting hash still `#/easing`."* I installed exactly that trap on the live :5173 tree and idled — **TWICE — 0 nav entries, resting hash `#/easing` unchanged.** The storm does NOT fire on pure idle. It fires only on **interaction / re-render**: when I forced re-renders (successive `evaluate`s), the route walked `easing → cube → / → cube → amiga` autonomously with 5 `replace` entries in the trap (the `#/cube`→`#/cube?anim=Rotations` PAIRS the audit described). The audit ITSELF says so: *"It is NOT on a timer (1.2s idle poll showed moved:false) — it advances on re-render/interaction, a reactive feedback loop"* (`a-scene-state-machine.md:51-52`). So the gate as written observes the system in exactly the regime where the bug is QUIET. It would pass GREEN on the broken tree today — i.e. it does NOT bite. This directly contradicts `§spine bar`'s assertion "Every clause RED on the live tree TODAY."

**Why it matters (beyond pedantry).** A vacuously-passing keystone gate is worse than no gate: H.W1 could "close GREEN" against a tree that still storms, which is the exact M1 "issue-level close masquerading as system-level close" failure the H.W8 chronic-closure discipline exists to forbid. The storm is the load-bearing D12 symptom.

**Concrete doc edit.** Rewrite the clause to drive the feedback loop inside the window:
> `proof:no-route-storm` — load `#/easing`, install the history trap, then **trigger the reactive loop the storm rides** (do NOT idle): fire ≥3 forced re-renders/interactions inside a 2s window — e.g. toggle `?anim=` via the dock Select, hover-warm a sibling scene, OR `await page.evaluate(() => triggerRef(...))` — and assert the hash is STILL `#/easing` and the trap recorded **0** *scene-changing* navigations (the only permitted entry is the single `NAVIGATE`-driven `?anim=` projection write for the current scene). BITE-PROOF: this exact sequence walked easing→cube→amiga with 5 trap entries on the live tree (`hd-w1` repro, 2026-06-07); a pure-idle window records 0 even on the broken tree (so idle is the wrong observation regime).

Also correct `§spine bar :62` ("`no-route-storm` asserts an EXACT nav-entry count (≤1)") to name the interaction trigger, not idle.

---

### [HIGH · under-specified, feasibility gap] S2 deletes the easing `contractAnim` but does not name the transport-contract REPLACEMENT it provides
**Loc:** `H.W1.md §Scope S2 :38` ("`useEasingDemo`'s … dummy `AnimationGroup` are DELETED — easing becomes a driver whose `RAFPlayback` loop gates on `machine.status === 'playing'`") + §state `:20` + §3a leak framing.

**Defect.** The wave treats `contractAnim` purely as a LEAK to delete. It is not — it is a structural **adapter**. Read `useEasingDemo.ts:262-290`: the bottom-bar transport (`AnimationControlsGroup`) *requires* an `AnimationGroup` to render play/pause/scrub; the easing scene's real motion is a light `NumericAnimation` (`:131-133`) driven by a raw `RAFPlayback` (`:135`). The `contractAnim`/dummy `AnimationGroup` (`:268-290`) exists SO THAT the shared transport has a group to bind — `animationGroup.started=true; paused=false` (`:283-284`) is hand-synced to `isPlaying` so the play button reflects+toggles the preview. Every scene `defineExpose`s `animationGroup` because ACG mounts against it (`EditorShell.vue:62 :key=superKey :animation-group`). **If S2 deletes the dummy group without replacing the transport contract, the easing scene's bottom-bar play/pause/scrub has nothing to bind and breaks.** "Easing becomes a driver whose loop gates on `machine.status`" describes the PLAY-GATE half but is silent on how the shared `AnimationControlsGroup` transport now drives a group-less scene. The §Design-decision "EACH scene round-trips its OWN full state via a contract method, not a dummy contract anim" gestures at this but names no mechanism.

**Why it matters.** This is the difference between S2 being implementable and being a regression: the implementer will either (a) re-introduce a dummy group (no-legacy violation, the bug persists) or (b) discover mid-wave that ACG's contract assumes an `AnimationGroup` and stall. Measure-first: the contract surface is `AnimationGroup` today across all 8 scenes; the FSM must define what a raw-rAF scene (easing) and an AnimationGroup scene both satisfy.

**Concrete doc edit.** In S2, add an explicit sub-clause:
> **S2a — the scene-playback CONTRACT (the dummy-group replacement).** Define ONE interface the machine drives, satisfied by BOTH an `AnimationGroup` scene (cube/amiga/square/spring/sequence/motion-path/starting-style) AND a raw-rAF scene (easing): `{ status: 'playing'|'paused'|'cold', play(), pause(), scrub(t), snapshot(): PlaybackSnapshot, hydrate(s) }`. `AnimationControlsGroup` binds to THIS contract, not to a concrete `AnimationGroup` — so deleting easing's dummy group is sound because the transport now binds the contract the easing driver implements directly (its `play/pause/togglePlay` at `useEasingDemo.ts:153-168` ALREADY match the shape; only the `animationGroup`-typed prop on ACG/EditorShell must widen to the contract). RECORD that widening `AnimationControlsGroup`'s `:animation-group` prop type to the contract is part of S2's one motion (else the dummy group cannot be deleted without a transport break).

---

### [MED · wrong anchor, repeated] `scenePlayback.ts` is NOT at `demo/app/scenePlayback.ts` — every "fold the bare Map" anchor points at a non-existent path
**Loc:** `H.W1.md §header :3` ("`scenePlayback.ts` (the bare `Map`)"), `§Scope S1 :36` ("collapsing the bare `Map` of `scenePlayback.ts`"), `§Folds :72` ("H-A9 … `scenePlayback.ts`'s plain module `Map` folds INTO the new store"), `§Goal :32`.

**Defect.** The file is at **`demo/@/components/custom/animation-controls/stores/scenePlayback.ts`** (verified: `find demo -name scenePlayback.ts`), re-exported via that directory's `stores/index.ts` barrel and consumed by `usePlaybackSnapshot.ts` (`import … from "@components/custom/animation-controls/stores"`). It is NOT a sibling of `useSceneRouter.ts` in `demo/app/`. The audit anchor `scenePlayback.ts:16` (`a-store-architecture.md:29`) is correct for line-16-in-that-file, but the wave's repeated framing implies it lives beside the other `demo/app/` composables it folds. An implementer reading "fold `scenePlayback.ts` (the bare Map) into the machine" will look in `demo/app/` and not find it.

**Second-order:** folding the `Map` (and its `ScenePlaybackState`/`AnimationPlaybackSnapshot` types, `scenePlayback.ts:3-14`) means the barrel `stores/index.ts` re-exports and the `usePlaybackSnapshot.ts` imports must be re-pointed too. The wave's "ONE motion" must include re-homing the TYPE exports the rest of the store tree consumes, not just the `Map`.

**Concrete doc edit.** In §header, §Scope S1, §Goal, §Folds, replace every bare `scenePlayback.ts` with the full path `demo/@/components/custom/animation-controls/stores/scenePlayback.ts`, and add to S7: "re-point the `ScenePlaybackState`/`AnimationPlaybackSnapshot` type exports (`scenePlayback.ts:3-14`) and the `stores/index.ts` barrel re-export onto the machine in the same motion (the types travel with the `Map`)."

---

### [MED · gate field-set gap] `proof:scene-machine-irrefragable` asserts "byte-identical playback" but does not enumerate the identity FIELD SET — the matrix can pass while losing `selectedAnimation`/`selectedControl`/panel-open
**Loc:** `H.W1.md §Hard gate clause 1 :54` ("playback state is byte-identical to before the round-trip").

**Defect.** "byte-identical playback" is under-defined. The corruption D12 demonstrates is NOT only `t/playing` drift — the LIVE repro shows the WRONG scene's *control panel* rendering (`selectedAnimation`, the blend/z-index controls, panel-open state, the `?anim=` projection). The snapshot today carries only `{playing, started, animations:{t,reversed,iteration}}` (`scenePlayback.ts:9-14`, `usePlaybackSnapshot.ts:29-41`). If the matrix asserts identity only over THAT set, an A→B→A round-trip can preserve `t` yet still leak `selectedAnimation`/`selectedControl` (which live in `controlOptionsStore`, a SEPARATE store) — i.e. the corruption the gate is meant to catch slips through. Clause (a) "route/superKey/component/group mutually consistent" covers the route axis but not the control-panel projection.

**Concrete doc edit.** In clause 1, enumerate the identity set explicitly:
> (b) the playback snapshot is identity-preserving over the EXACT set `{playing, started, per-anim (t, reversed, iteration)}` AND the control projection `{selectedAnimation, selectedControl, isControlsPanelOpen}` round-trips unchanged (the latter is the leak `proof:scene-isolation` catches at the route boundary — assert it here at the round-trip boundary too, since the control store is keyed by superKey and the superKey is what lagged).

---

### [MED · scope hazard, RECORD] S1's "merge the playback concern with the scene concern in ONE store keyed by scene" risks the very god-module the spine forbids — name the measure-first split
**Loc:** `H.W1.md §Scope S1 :36` ("merging the playback concern with the scene concern in ONE store keyed by scene"); §Design-decision `:76`.

**Defect.** The store-architecture lane's OWN recommended shape was TWO stores + one reducer (`a-store-architecture.md:97-104`: `useSceneStore` + `usePlaybackStore`). The wave collapses to "ONE store" without addressing whether scene-lifecycle and playback-lifecycle are one cohesive concern or two. The spine bars "NO god modules (measure-first)." A single `useSceneMachine` that owns the active-scene fact, the per-scene playback snapshot map, the persistence/GC, the route projection, the dock projection, the `?anim=` projection, AND the tab-visibility fold is a plausible cohesion-by-axis (all keyed by scene) — but the wave ASSERTS it rather than measuring it. The adjudication (§2.1) settled facility (createGlobalState vs Pinia), NOT granularity (one store vs two).

**Concrete doc edit.** Add to §Design-decisions a RESOLVED note:
> **One reducer, store granularity measure-first — RESOLVED-as-default-with-escape.** The reducer (`transition(state,event)`) is ONE pure function (the deliverable). The store may be ONE `useSceneMachine` (scene + playback co-keyed by scene) by default; IF the reducer + context exceeds a measured cohesion ceiling (the store-architecture lane's two-store shape, `a-store-architecture.md:97-104`), split scene-lifecycle from playback-lifecycle along the keyed seam — both consume the same reducer. The split is a granularity call, NOT a facility call; it does not reopen §2.1.

---

### [LOW · gate phrasing] `proof:no-deprecated-guard` grep "`next(` absent from `router.ts`" can false-GREEN if the guard keeps an unused `next` PARAMETER
**Loc:** `H.W1.md §Hard gate clause 6 :59`; `a-scene-state-machine.md:258`.

**Defect.** The fix "drop to a returned value" may leave `router.beforeEach((to, _from, next) => { … return … })` with `next` still in the signature (unused). The grep target is `next(` (a CALL) — an unused parameter named `next` does NOT match `next(`, so the grep is technically correct. BUT the live warning fires PER `next()` CALL, and an implementer who renames the param to `_next` but leaves one `next(...)` call site mid-refactor would still flood. The grep is sound; the risk is the gate reads as "no `next` anywhere." Minor.

**Concrete doc edit.** Tighten to: "grep gate: zero `next(` CALL sites in `router.ts` (the guard returns its value; an unused `next`/`_next` parameter is permitted but MUST NOT be invoked). Live baseline: 14× `next() callback … is deprecated` on the :5173 tree (`hd-w1` repro)." (Note: the audit said "7-8×"; the live count is 14× — bump the cited number to 14 or "≥7×" so the baseline matches reality.)

---

### [LOW · stale console-count anchors] cited `next()` warning count understates the live flood
**Loc:** `H.W1.md §state :26` ("7-8× per load"), §Hard gate clause 6 ("7-8×"), `a-store-architecture.md:141` ("×5 per load").

**Defect.** Three different counts across the docs (5×, 7×, 7-8×); live is **14×** on a single :5173 session (and climbing with each nav). Not load-bearing, but inv ε wants the anchor to match. Fold into the clause-6 edit above ("≥7×" or "14× live").

---

## ANSWERS TO THE LANE'S POSED QUESTIONS

- **Does ONE createGlobalState + a pure reducer actually collapse the 5+3 authorities + isStableFire, or does route-projection still race?** YES it collapses them, and the route-projection does NOT race PROVIDED the one-way rule is enforced at the type level (no write path back from route/param/dock/localStorage into scene selection). The live storm is precisely the bidirectional `?anim=`-write keyed off the lagging `currentSuperKey` (`useSceneUrl.ts:36-55,64-67`) racing `popStateHandler`; removing the write paths (S3) kills it at the source. The reducer being PURE means no async-mount lag can desync it (unlike `currentSuperKey` which only advances inside the `sceneRef.animationGroup` watcher). Sound.
- **Is `idle|loading|playing|paused|suspended` sufficient — where do scrub/reverse/seek live?** Sufficient as STATES; scrub/reverse/seek are correctly EVENTS, not states — `SCRUB(t)` is already in the event list (`§Scope S1`), and reverse/seek are field mutations within `playing|paused` (the engine's `reversed`/`t` are context, not lifecycle). `usePlaybackToggle`'s `userReversed`/`prevT` bookkeeping (`usePlaybackToggle.ts:25-27`) folds into context. No missing state. (RECOMMEND the wave name reverse/seek explicitly as `playing|paused`-internal context mutations so the implementer doesn't add spurious states.)
- **Is suspend→restore genuinely an identity given markRaw + no engine serialize() yet?** YES, given the store-first-then-swap order is sound: the existing imperative `restoreGroupPlaybackState` (`usePlaybackSnapshot.ts:49-84`) ALREADY achieves the round-trip (it reconstructs `startTime` from `t+now`), so the store landing first against it leaves NO gap — the FSM just makes the call site explicit (`SCENE_READY`) instead of heuristic (`isStableFire`). The engine `serialize()/hydrate()` swap is a LAYERING improvement, not a correctness prerequisite. The born-RED `proof:group-snapshot-identity` correctly locks the engine half so the HANDOFF can't be column-migrated closed. Sound — and the store-first order is the right sequencing.
- **Is the Pinia-vs-createGlobalState adjudication faithfully binding (no hedge)?** YES — §Provenance, §Scope S1 WHY, and §Design-decisions all state createGlobalState as RESOLVED/BINDING with Pinia BOOKED only on a future measured need. No hedge. (The granularity question — one store vs two — is the only un-adjudicated sub-point; see MED finding above.)
- **Does proof:scene-machine-irrefragable + sub-gates truly cover the corruption?** MOSTLY — but the keystone `no-route-storm` gate does NOT bite as written (HIGH finding 1), and the matrix's "byte-identical playback" must enumerate the control-projection field set or it leaves the panel-leak path uncovered (MED finding 4). With those two edits the coverage is complete: storm (1, fixed), control leak (scene-isolation + matrix-fieldset), deep-link (deep-link-wins), orphan rAF (suspend-no-orphan-raf), deprecation (no-deprecated-guard), engine seam (group-snapshot-identity born-RED). The clauses otherwise have stated, non-vacuous bites.

## BOTTOM LINE
The FSM is the right architecture, every API it leans on exists, and the D12 defect it
targets is live-real. Ship it — AFTER fixing the keystone gate so it actually bites (HIGH
1), naming the easing transport-contract replacement so S2 is implementable without a
regression (HIGH 2), correcting the `scenePlayback.ts` path (MED 3), enumerating the
matrix identity field-set (MED 4), and recording the store-granularity measure-first
escape (MED 5). No BLOCKER.
