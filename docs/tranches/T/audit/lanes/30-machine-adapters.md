# Lane 30 — the scene machine + transport suite (behind the dock grammar)

**Surface traced**: `demo/@/state/sceneMachine.ts` (pure reducer) + `useSceneMachine.ts` (effect
layer) + `scenePlaybackAdapters.ts` (the dual `ScenePlayback` contract) + `controlSurfaceDFA.ts`
(the third axis) + the transport suite (`useSceneTransport.ts`, `usePlayActuation.ts`,
`TransportDock.vue`, `useAnimationGroupPlayback.ts`, `AnimationControlsGroup.vue`) + the shell
bindings (`useSceneMachineShellBinding.ts`, `useSceneMachineRouterBinding.ts`) + the per-scene
persisted stores (`controlOptionsStore.ts`, `animationOptionsStore.ts`, `storeUtils.ts`).

This is a **data-layer** audit: the visual dock-grammar defects it grounds (VERDICT #6, #10, #17,
#18) are owned by lanes 08/10/23 for their rendering fix; this lane traces *why* the data those
docks read is shaped the way it is, and where the state duplicates itself well enough that no
single-dock fix can resolve what the owner actually asked for.

---

## Finding 1 — the D12 "shadow playback authority" sweep was declared complete for 4 of 8 scenes; `useAnimationGroupPlayback.ts` is the untouched 5th carrier

**The precedent, in the codebase's own words.** Four raw-rAF scene composables carry an explicit,
identical comment recording a defect class and its cure:

- `demo/scenes/spring/useSpringDemo.ts:165-169` — *"The former private `isPlaying = ref(true)` +
  the dummy-group paused-mirror were the SHADOW playback authority (the D12 smell).
  `useSceneTransport` (R.W5 B.2) projects `isPlaying` read-only off `machine.status` and routes
  play/pause/togglePlay to dispatch — the machine is the single authority."*
- `demo/scenes/sequence/useSequenceDemo.ts:49-53` — *"The former private `isPlaying = ref(false)`
  (a shadow playback authority nothing could suspend — the D12 smell) is DELETED."*
- `demo/scenes/motion-path/useMotionPathDemo.ts:62-64` — *"MACHINE-NATIVE, not a private shadow
  (S5c / D12) … The former `isPlaying = ref(false)` was the un-migrated D12 SHADOW-AUTHORITY."*
- `demo/scenes/easing/useEasingDemo.ts:66-69` — same pattern.

All four now derive `isPlaying` as `computed(() => machine.status.value === "playing")` via
`useSceneTransport.ts` (39 lines total, read in full) and dispatch `PLAY`/`PAUSE`/`SCRUB` straight
to the machine — the machine mutates nothing on its own; the scene's own rAF loop *gates* on
`machine.status.value` and the `ScenePlayback` adapter (`createRafAdapter`,
`scenePlaybackAdapters.ts:186-219`) is the only thing that starts/stops it.

**The untouched carrier.** `demo/@/components/custom/animation-transport/composables/
useAnimationGroupPlayback.ts:19` — the composable every group-family scene (cube, amiga, square)
rides via `AnimationControlsGroup.vue` — still opens with:

```ts
const isPlaying = ref(getAnimationGroup().playing());
```

— the exact shape the D12 sweep named and deleted four times over, with **zero** `D12`/`shadow`
comment anywhere in this file or its host (`grep -n "D12|shadow" useAnimationGroupPlayback.ts
AnimationControlsGroup.vue` → no hits). `toggleAnimationGroup()` (lines 56-81) and
`onScrubStart`/`onScrubEnd` (83-98) call `animationGroup.play()` / `.toggle()` / `.pause()` /
`.resume()` **directly**, then call `syncPlayState()` (24-39), which only **emits**
`playStateChange`/`startStateChange` — a notification, not a request. The App's
`useSceneMachineShellBinding.onPlayStateChange` (196-218) is the *only* place that turns that
notification into `machine.dispatch({ type: playing ? "PLAY" : "PAUSE" })` (line 207) — three
component hops downstream (`AnimationControlsGroup` → `EditorShell` → `App.vue`, wired at
`EditorShell.vue:72-73` and `App.vue:34-35`).

So the codebase runs **two playback-mutation disciplines** for the one machine, split by scene
family, with no comment anywhere claiming this is deliberate:

| | raw-rAF (easing/spring/sequence/motion-path/morph/compose) | group (cube/amiga/square) |
|---|---|---|
| `isPlaying` source | `computed` off `machine.status` | private `ref`, hand-synced |
| write direction | dispatch → adapter effect → engine | engine mutation → emit → dispatch (echo) |
| who starts/stops the engine | `createRafAdapter`/the scene's own gated loop, *only* | `useAnimationGroupPlayback` **and** `createGroupAdapter`, both |

**Why it hasn't visibly broken (yet), and why that's fragile, not fine.** `createGroupAdapter`'s
`resume()`/`suspend()` (`scenePlaybackAdapters.ts:95-99, 86-93`) are written defensively idempotent
(`if (!group.started) group.play(); else if (group.paused) group.resume();`), so when the machine's
downstream echo-dispatch drives `applyEffects` → `adapter.resume()`/`adapter.suspend()` a moment
after `useAnimationGroupPlayback` already mutated the group directly, the guard usually finds the
group already in the target state and no-ops. **Correctness here is an accident of two independent
idempotency guards happening to agree**, not a designed single-writer contract — the same shape of
accidental-alignment class the repo's git history calls "the arming-audit lesson" (recurring a 3rd
time per the current HEAD commit message on `pressPlayToggle`). A future change to either guard
(e.g. `AnimationGroup.toggle()` growing a side effect, or `resume()` losing its `paused` check for
a startup-race fix) can silently reopen a double-fire.

**A concrete, currently-live consequence: scrub position is not persisted for group scenes.**
`grep -rn '"SCRUB"'` across `demo/` returns exactly two production call sites, both in
`demo/scenes/sequence/useSequenceDemo.ts:284,347` — a raw-rAF scene. **No group scene ever
dispatches `SCRUB`.** `onScrubStart`/`onScrubEnd` (`useAnimationGroupPlayback.ts:83-98`) mutate
`animationGroup.pause()/.resume()` directly and only `syncPlayState()` (which relays the
play/pause axis, not `t`). The machine's persisted `perScene[scene].animations[name].t`
(`sceneMachine.ts:40-44`) for cube/amiga/square is therefore only ever refreshed at
`captureActive()` time (`useSceneMachine.ts:177-193`, fired on `NAVIGATE`-away/`SUSPEND`) — **a mid-
session scrub that never crosses a NAVIGATE/tab-hidden boundary is invisible to `localStorage`
until the next genuine leave.** Sequence and spring persist continuously (every scrub dispatches);
cube/amiga/square persist only at scene-leave. This is an even, gate-invisible asymmetry across
the 8-scene roster produced by the exact two-discipline split above — not a deliberate design
choice (nothing documents "group scenes persist scrub coarser than raw-rAF scenes").

---

## Finding 2 — two independent per-scene keyspaces (`SceneId` vs `superKey`) with no mechanical link; the maintainers' own vocabulary already conflates them

The scene machine keys every persisted playback snapshot by `SceneId` — the lowercase registry id
(`"cube"`, `"compose"`, …) declared once in `demo/app/scene/scenes.ts`. The sibling control/option
stores (`controlOptionsStore.ts`, `animationOptionsStore.ts`) key by `superKey` — a **second,
independently-declared** string per scene, sourced from each scene's own `<name>Keys.ts`
(`CUBE_SUPER_KEY = "Cube"`, `AMIGA_SUPER_KEY = "Amiga"`, `SPRING_SUPER_KEY = "Spring"`, …;
`getAnimationSuperKey`, `storeUtils.ts:23-34`, is the only bridge, and it is a pass-through, not a
derivation from `SceneId`).

These are not the same string for the same scene — case alone diverges for every scene
(`"cube"` vs `"Cube"`), and for one scene the divergence is total: `id: "compose"`
(`scenes.ts:239`) vs `COMPOSE_SUPER_KEY = "playground"` (`composeKeys.ts:15`) — a residue of the
S.D3 fold that merged the standalone `playground/` app into `scenes/compose/`. The mismatch is
**named and deliberate** (`scenes.ts:40-41`: *"Compose keeps the `"playground"` superKey … a
rename would orphan a returning user's playground state"*) — which is exactly the point: keeping
two independent keyspaces in sync across a rename requires a person to notice, decide, and leave a
comment, every time. A unified keyspace has no such decision to make or forget.

The conflation has already leaked into the maintainers' own terminology: the boot-time garbage
collector is invoked as

```ts
// useSceneMachineRouterBinding.ts:49-50
// ── boot GC: prune orphan superKeys from prior sessions (ST-7) ──
machine.gcOrphans(allScenes.map((s) => s.id));
```

— the comment says *"superKeys"*; the argument passed and the map it prunes
(`useSceneMachine.ts:237-249`, `machine.value.context.perScene`) are keyed by **`SceneId`**, not
`superKey`. The two axes are already interchangeable in prose even though they are not
interchangeable in code — the exact confusion a future edit (e.g. "let me also GC the stale
control-options entries the same way") would walk straight into and get wrong, because
`gcOrphans` only knows the `SceneId` axis.

**Consequence: only one of the two keyspaces self-heals.** `gcOrphans` prunes stale `SceneId`
entries from the scene-machine's persisted map on every boot. `controlOptionsStore.ts` and
`animationOptionsStore.ts` have **no analogous per-key GC** — `grep -rn "gcOrphans"` finds it
nowhere outside `useSceneMachine.ts`/its one call site. A retired or renamed scene's `superKey`
bucket sits in `localStorage["animation-groups-control-options-store"]` forever, pruned only by
the blunt 7-day whole-store TTL (`storeUtils.ts:11-21`) — an orphan class the scene machine already
solved for its own table and never extended to its two siblings that key on the *other* axis. (See
lane 22 F4/F5 for the adjacent single-scene DRY finding on `useAmigaDemo.ts`'s orphaned
`SUPER_KEY` literal and the `resetAllStores()` live-ref asymmetry — this finding is the structural
cause one level up: the *reason* a superKey can drift from its scene at all is that nothing
derives it from the registry.)

---

## Finding 3 — three independent single-option-elision implementations, none sharing a selector, which is why VERDICT #17/#18's "Spring / Spring" duplicate survives K.W4's fix

The lane brief asks specifically where "scene/animation option counts live." They live in **three
different places**, each reading a different projection of what is conceptually one fact ("does
this scene have more than one of X to choose between"):

1. **`TransportDock.vue:58`** — `v-if="animationNames.length > 1"` — the **animation-name** axis.
   `animationNames` is a prop computed fresh on every render at the call site,
   `AnimationControlsGroup.vue:91`: `:animation-names="Object.keys(animationGroup.animations)"` —
   sourced from the **live engine object**, not from any machine/DFA projection.

2. **`ChromeDock.vue:105-122`** — `multipleControlTabs = computed(() =>
   allControlTabs.value.length > 1)` plus `soleControlTab` — the **control-surface** axis, built
   from two *props* (`controlSurfaces`, `extraControlTabs`) that `App.vue:9-10` threads down from
   `machine.controlSurfaces` / `machine.extraControlTabs(...)`.

3. **`AnimationControls.vue:332-337`** — `isSingleSurfaceScene = computed(() =>
   tabsExternallyManaged && machine.controlSurfaces.value.length === 1 && builtInTabs.value.length
   === 0)` — the **same control-surface axis as #2**, but read by calling `useSceneMachine()`
   **directly** (bypassing the prop chain #2 uses) and combined with yet a third local computed
   (`builtInTabs`, lines 300-304) that duplicates `builtInSurfacesFor()` — a selector
   `controlSurfaceDFA.ts:164-167` already exports and neither call site uses.

`controlSurfaceDFA.ts` bills itself in its own header as *"THE control-surface DFA … the
AUTHORITY"* and already exports the shape this needs (`controlSurfacesFor`,
`selectedControlSurfaceFor`, `builtInSurfacesFor`) — but no `hasSingleControlSurface(sceneId,
activeConditionals)` / `soleControlSurfaceTab(...)` selector exists there, so sites #2 and #3
each grew their own local, slightly different predicate (`length > 1` over a *prop*-threaded union
vs `length === 1 && builtInTabs.length === 0` over a *directly-injected* singleton), and site #1
grew an entirely separate one over a different data source for a different axis.

**This is mechanically why VERDICT #17/#18 is still open despite K.W4 S6's fix.** K.W4 (site #2)
correctly demotes a 1-tab `<Select>` to a static label — that part works exactly as designed
(lane 08's D5 census confirms the *label* renders, not a dead dropdown). But VERDICT's actual ask
(*"the dock should not show an extra 'spring'/'easing' item — elide that intelligently"*) is a
**cross-dock** fact: the control-surface label is redundant **because the adjacent scene-select
trigger already says "Spring"** — and no single-dock elision predicate can see that, because the
scene-select label lives in a completely different reactive source (`currentLabel`/`currentIcon`,
`ChromeDock.vue:49-74`) that none of the three elision sites read. Fixing any one of the three
predicates in isolation cannot produce "render nothing" — only a shared model that spans *both*
axes (which item is the scene identity, which item is genuinely additional information) can.

---

## Finding 4 — the animation-count elision exists at the exact call site the "superfluous divider" (VERDICT #6) needed and is simply not reused three lines later

`TransportDock.vue:44-116` computes the count-gated animation name/select block correctly
(`animationNames.length > 1 ? <Select> : <span>{{ storedControls.selectedAnimation }}</span>`).
Immediately after it, **unconditionally**:

```html
<!-- line 119 -->
<div class="dock-separator"></div>
```

— no `v-if` of any kind. On `home` (or any scene with zero animations),
`animationNames.length` is `0`, the `v-else` branch renders, and
`storedControls.selectedAnimation` is `""` — `controlOptionsStore.ts:32`'s own documented default
— so the span is empty, and the separator after it renders a divider next to nothing: exactly
VERDICT shot #6, *"what's this superfluous dividing line when on the home screen?"* Compare
`ChromeDock.vue:203-217`, where the analogous separators are explicitly gated on `hasControlPanel`
— a DFA-derived boolean built for precisely this purpose. `TransportDock.vue` has the identical
fact available two lines earlier (`animationNames.length`) and does not reuse it three lines later
for the separator that sits in the same visual row. This is a one-line consistency gap in the same
file, not a missing capability.

**Play-first (VERDICT #6's second clause) has no data-layer lever today.** `TransportDock.vue`'s
persistent controls render in fixed markup order — name/select (44-116), separator, Reset
(121-128), Clear-all (130-137), **then** Play (139-157). Nothing in `useSceneTransport.ts` or
`usePlayActuation.ts` expresses a notion of "this is the primary action"; reordering Play to first
today is a markup edit with no composable to drive it, which means every future dock redesign
(lane 08's "two quiet instruments" target) that wants a different order pays the same manual-reorder
cost again.

---

## The `pressPlayToggle` contract + the S.A0 queue-then-arm cure — traced, and holding

`usePlayActuation.ts` (85 lines, read in full) is sound: `pressedPointers`/`spaceArmed`
press-origin tracking correctly mirrors native `<button>` semantics (Space fires on `keyup`, Enter
on `keydown` guarded by `e.repeat`, `pointerup` gated on a `pointerdown`-on-this-control set +
`isPrimary`). `scripts/lib/demo-driver.mjs:933-960`'s `pressPlayToggle` dispatches a genuine
`pointerdown`+`pointerup` pair with `isPrimary: true` (the current HEAD commit's fix — synthetic
`PointerEvent`s default `isPrimary` to `false`, which the F3 press-origin guard correctly rejected
as a secondary touch before this fix) so the gate harness now exercises the *real* actuation path,
not a bypassed one.

The `sceneMachine.ts:128-150` `PLAY`/`PAUSE` queue-on-`loading` cure (S.A0) is a clean, scene-
family-agnostic reducer rule: an event arriving while `status === "loading"` is recorded onto the
target scene's snapshot (`playing: true/false`) without dropping it, and the arriving
`SCENE_READY` reads `snap.playing` to decide whether to start. Tracing where a `PLAY` dispatch can
actually land during `loading`: `EditorShell`/`AnimationControlsGroup`/`TransportDock` are a
**separate** `:key="superKey"`-scoped remount boundary from the scene content's own
`:key="activeSceneKey"` `<Suspense>` (`App.vue:26-92`) — so the dock can already show the *new*
scene's (empty, freshly-reset) `AnimationGroup` while the content pane still reads "Loading
scene…". A press in that window hits `toggleAnimationGroup`'s empty-group branch
(`useAnimationGroupPlayback.ts:65-68`, `if (Object.keys(animationGroup.animations).length === 0) {
syncPlayState(true); return; }`), which — usefully — does **not** call `animationGroup.play()` on
nothing; it only calls `syncPlayState()`, which relays through the same emit chain as every other
group-scene play toggle, landing on `machine.dispatch` while `status` is still `"loading"`. So the
empty-group short-circuit happens to route this specific race through the queue correctly today.
That is a coincidence of the same shape as Finding 1's idempotency-guard alignment, not a
documented contract — the queue cure is provably correct at the **reducer** level (pure, tested:
`proof:cold-entry`/`fsm`/`subject-animates`/`live-session` per the current branch's gate roster)
but its correctness for the *group* family still depends on `useAnimationGroupPlayback` continuing
to defer-not-mutate on an empty group. Finding 1's fix (route group scenes through
`machine.dispatch` before touching the engine, matching the raw-rAF family) would make this
guarantee structural instead of incidental.

---

## THE TARGET — a machine/transport spec the T dock grammar can render from

The redesigned dock (lane 08's "two quiet instruments") needs three facts, single-sourced, that
today are each computed ad hoc per consumer:

1. **One playback-mutation discipline, for all 8 scenes.** Finish the D12 sweep:
   `useAnimationGroupPlayback` stops calling `animationGroup.play()/.pause()/.toggle()/.resume()`
   directly. Cube/amiga/square dispatch `PLAY`/`PAUSE`/`SCRUB` to the machine the same way
   easing/spring/sequence/motion-path already do (`useSceneTransport`); `createGroupAdapter`
   becomes the *only* code path that ever touches `AnimationGroup` playback methods. The
   genuinely group-specific concern — per-child selection/scrub (`onSelectAnimation`,
   `sliderUpdate`, `cycleAnimation`) — stays exactly where it is; only the whole-group play/pause
   *axis* unifies. This also closes Finding 1's scrub-persistence gap for free (SCRUB dispatch
   becomes uniform) and turns the S.A0 queue guarantee from incidental to structural.

2. **One keyspace.** Every per-scene persisted table (`sceneMachine.perScene`,
   `controlOptionsStore`, `animationOptionsStore`) keys on `SceneId` — the one string the registry
   (`scenes.ts`) already declares once per scene. Where a sub-key beneath the scene is genuinely
   needed (per-animation options within a multi-animation scene), derive it as
   `` `${sceneId}:${animationName}` `` from the registry + the live group, never a second
   hand-authored constant. One `gcOrphans(validSceneIds)` call prunes all three tables in the same
   motion a scene is retired or renamed — the `compose`/`playground` class of exception becomes
   structurally impossible rather than a documented one-off.

3. **One elision selector, spanning both axes.** `controlSurfaceDFA.ts` grows
   `hasSingleControlSurface(sceneId, activeConditionals)` and `soleControlSurfaceTab(...)` beside
   its existing `controlSurfacesFor`/`selectedControlSurfaceFor`; a parallel
   `hasSingleAnimation(sceneId)` is exposed off the machine/adapter registry (not a raw
   `Object.keys(group.animations)` re-derivation at three call sites). Every dock/tab host
   (`TransportDock`, `ChromeDock`, `AnimationControls`) consumes these, never a local `.length >
   1`. Critically, the redesigned dock also asks a **cross-axis** question this lane's Finding 3
   shows no current selector can answer: *"is the control-surface identity a strict subset of the
   scene identity already shown elsewhere in this dock cluster?"* — when yes (spring/easing today),
   the answer is VERDICT's literal ask: render **nothing**, not a demoted label. This requires the
   scene-select label and the control-surface label to be resolved from the *same* projection
   (both keyed by `activeScene` through the DFA) so the redesign can diff them, rather than two
   independently-sourced strings that happen to collide.

4. **An ordered action model, not markup order.** `useSceneTransport` (or a new co-located
   `useTransportActions`) exposes `{ primary: {kind:"play", ...}, secondary: [...] }` so "play
   first" (VERDICT #6) and any future reordering is a data change, consumed uniformly by whatever
   dock-grammar component T lands on (a glass-ui `DockSection`, per lane 08's target), not a
   per-dock template edit.

---

## T recommendations

1. **Finish the D12 sweep onto `useAnimationGroupPlayback`** — delete the private `isPlaying`
   `ref`; project it `computed(() => machine.status.value === "playing")` via `useSceneTransport`;
   route `toggleAnimationGroup`/`onScrubStart`/`onScrubEnd`/`onSelectAnimation` through
   `machine.dispatch({type:"PLAY"|"PAUSE"|"SCRUB"})` instead of direct `AnimationGroup` calls;
   `createGroupAdapter` becomes the sole caller of `group.play/pause/resume/toggle`. Keep
   per-child selection/scrub (`findAnimationGroupObject`, `sliderUpdate`, `cycleAnimation`) as-is —
   only the group-wide play/pause axis unifies.
   **Falsifiable**: a new `proof:no-shadow-playback-authority` grep — no file outside
   `scenePlaybackAdapters.ts`/`createRafAdapter`'s scene-owned loops calls
   `AnimationGroup.prototype.{play,pause,resume,toggle}` directly; plus a test asserting a cube
   scrub (no play/pause bracket) updates `useSceneMachine().perScene.value.cube.animations[...].t`
   without a `NAVIGATE`/`SUSPEND` in between (RED today, GREEN after).
   **Size: M** (one composable rewrite + 3 scene smoke-checks; no new architecture).

2. **Collapse `superKey` into `SceneId`** — retire the parallel `<name>Keys.ts` `SUPER_KEY`
   constants; `controlOptionsStore`/`animationOptionsStore` key on the registry `SceneId`
   directly; extend `machine.gcOrphans` (or a shared `gcOrphans(validSceneIds, ...tables)`) to
   prune all three tables in one call; retire the compose/playground exception by migrating that
   one stored bucket once, in a dated one-shot script, rather than carrying the alias forever.
   **Falsifiable**: `proof:scene-superkey-single-source` — no file declares a `*_SUPER_KEY`
   constant; `getStoredAnimationGroupControlOptions`/`getStoredAnimationOptions` accept only a
   `SceneId` from the registry's own id set.
   **Size: M** (touches every scene's key import + both stores' key type; mechanical, low-risk).

3. **Single-source the elision predicate in `controlSurfaceDFA.ts`** — add
   `hasSingleControlSurface`/`soleControlSurfaceTab`/`hasSingleAnimation`; migrate
   `ChromeDock.vue`, `AnimationControls.vue`, `TransportDock.vue` onto them; delete the three local
   `.length > 1`/`.length === 1` computeds this lane found.
   **Falsifiable**: `proof:single-elision-authority` — grep for `.length > 1`/`.length === 1`
   outside `controlSurfaceDFA.ts` touching `controlSurfaces`/`animationNames`/`allControlTabs`
   returns empty.
   **Size: S** (3 call-site swaps behind 2 new pure selectors).

4. **A cross-axis "is this label redundant with the scene identity" selector**, consumed by
   whatever dock component T lands on, so a single-surface scene renders **no** control-surface
   item at all (not a demoted static label) when its DFA set duplicates the active scene's own
   name. Depends on #3.
   **Falsifiable**: a live-session probe on `/spring` and `/easing` asserting the dock cluster
   contains exactly ONE node whose text is "Spring"/"Easing" (today: two).
   **Size: S** (one boolean gate once #3 lands; the visual removal is lane 08's).

5. **An ordered transport-action model** (`primary`/`secondary`) off `useSceneTransport`, so dock
   control order is data, not markup — "play first" becomes a one-line array reorder.
   **Falsifiable**: a snapshot test of the exposed action array's `primary.kind === "play"`;
   `TransportDock`/whatever T-redesign renders play from `actions.primary`, never a hardcoded
   template position.
   **Size: S** (additive to `useSceneTransport`; no consumer is forced to migrate immediately).
