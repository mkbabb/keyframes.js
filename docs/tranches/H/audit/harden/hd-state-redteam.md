# Tranche H DEEP harden — lane `hd-state-redteam`

**Charge:** DEEP adversarial red-team of the D12 scene+playback state-machine ARCHITECTURE
(H.W1, the keystone). Not doc-consistency — *substantive*: is the FSM design CORRECT and
FEASIBLE; does the gate regime BITE; does the architecture survive the real code +
browser-owns-the-URL reality; is `createGlobalState`+reducer genuinely sufficient or is
the user's Pinia instinct right.

**Method:** read the 3 D12 lanes (`a-scene-state-machine`, `a-store-architecture`,
`a-demo-architecture` F3/F6/F8), the adjudication (`_SYNTHESIS-gap-scorecard §2.1`), and
H.W1. Verified every load-bearing claim against the SOURCE (`App.vue`,
`useSceneRouter.ts`, `useSceneUrl.ts`, `useSceneGroupSync.ts`, `usePlaybackSnapshot.ts`,
`scenePlayback.ts`, `useSceneVisibilityPause.ts`, `useEasingDemo.ts`, `group.ts`,
`router.ts`, `scenes.ts`) and against the RUNNING demo at `:5173` (history-trap + idle
poll + stack capture).

**Verdict (headline):** The DIAGNOSIS is sound and the gestalt move (one authority, one
reducer, one-way projections) is the right call — the route storm REPRODUCED live with the
exact `popStateHandler`/`finalizeNavigation` stack the audit named. BUT the wave as
written contains **two architecture-level errors that will surface at implementation
time** and one **mis-framed gate that does not bite for the worst-affected scenes**:

1. **BLOCKER** — the "route is a read-only PROJECTION of `machine.activeScene`" framing
   inverts ownership. The browser owns the URL; the route is a *peer source of truth*, not
   a projection. A pure reducer cannot own "active scene" without a reconcile rule for the
   one input it does not control (back/forward/popstate). The storm is *caused by* a
   reconcile gap, and the projection framing hides — does not solve — it.
2. **HIGH** — the `serialize()/hydrate()` engine seam (S6) is defined ONLY for
   `AnimationGroup`, but the worst-corrupted scenes (easing — and by the same pattern
   spring/sequence/path) DON'T USE AnimationGroup playback. Their truth is a private
   `isPlaying` ref + a raw `RAFPlayback` loop + `startTime`. `group.serialize()` snapshots
   a *dummy* group. S2 says "delete the dummy + each scene round-trips its own state via a
   contract method," but S6's gate (`proof:group-snapshot-identity`) tests only the group
   API — it is GREEN-able while the raw-rAF scenes still lose state.
3. **HIGH** — `proof:scene-machine-irrefragable` asserts "byte-identical playback round-trip
   / suspend→restore is an identity," but for raw-rAF scenes that have no engine clock to
   serialize there is no engine-level identity to assert; the matrix can pass on the
   AnimationGroup scenes (cube/amiga/square) and never exercise the scenes the user
   actually reported broken. The gate's bite is on the *easy* half of the matrix.

Plus MED/LOW findings on the deep-link race, the markRaw/reactivity question, the
`SCENE_READY` ordering, the `next()` guard, and a steelman of Pinia that the adjudication
under-weights. The Pinia adjudication itself is **CORRECT** (I concur) — but for a reason
the wave does not state, and with a caveat the wave should add.

---

## §A. The diagnosis is REAL — reproduced live (so the rest of the red-team is fair)

I will not manufacture doubt where the audit is right. The route storm is genuine.

- **Live, PURE idle (one `setInterval` inside ONE evaluate — no automation round-trips
  between samples):** from `#/easing` the hash walked
  `#/easing → #/ → #/?anim=Rotations → #/cube` and **settled at `#/cube`** within ~3.5 s.
  Sample trace (250 ms cadence): `easing, /, /?anim=Rotations ×3, cube ×7`.
- **The stack traces match the audit verbatim.** The captured `history.replaceState`
  origins were:
  - `popStateHandler @ vue-router 4949 → replace("#/")`  (the FIRST of each pair)
  - `finalizeNavigation @ vue-router 6228 → replace("#/?anim=Rotations")` (the SECOND —
    `useSceneUrl`'s debounced `router.replace({query})` appending the *lagging* superKey's
    anim)
  - `popStateHandler @ 4949 → replace("#/cube")`
  This is exactly `a-scene-state-machine §1` (`vue-router 4949` + `6228`). The lane did the
  forensics correctly.
- **`localStorage` probe:** `keyframes-js-active-scene = "cube"`; the storm's fixed point
  is `#/cube` — i.e. it converges *to the localStorage scene* via the home redirect
  (`#/` → `useSceneRouter.ts:21-31` redirects `home`→`cube`). So the deep-link-loses bug
  (§5 of the lane) and the storm are the SAME failure: a popstate knocks the route to
  `home`, the redirect fires, and `?anim=` re-stamps it.

**Refinement the wave should absorb (NIT→MED):** the storm is **damped, not divergent** —
it CONVERGES to the localStorage scene in a few hundred ms, it does not oscillate forever.
The audit calls it a loop "with no damping fixed point" (`a-scene-state-machine.md:75`).
That is imprecise: there IS a fixed point (the localStorage scene), the system just walks
to it noisily through several wrong intermediate scenes, re-rendering each. This matters
for the gate: `proof:no-route-storm`'s "≤1 nav entry, resting hash unchanged" is the right
shape, but the wave should note the failure is "N spurious intermediate navs before
settling on the WRONG scene," not "perpetual motion" — otherwise an implementer who only
checks "did it stop moving" (it does) will think it's fixed.

---

## §B. BLOCKER — "route as read-only projection" inverts ownership; a pure reducer cannot own activeScene alone

**Location:** H.W1 §Goal (`:32`), S3 (`:40`), §Design-decisions "The route is a PROJECTION,
written once" (`:79`); `a-scene-state-machine §6a` (`:209-220`); `_SYNTHESIS-gap-scorecard
§3 H.W1` (`:130`).

**The claim under attack:** *"The route, the dock Select model, the `?anim=` param, and
localStorage all become read-only one-way projections of `machine.activeScene` — killing
the feedback loop at the source (the param/route can never write back into scene
selection)."*

**Why this is wrong as written.** The dock model, `?anim=`, and localStorage *can* be
demoted to pure projections — the app owns those writers. **The route cannot.** The URL is
owned by the browser, and the user (and the automation harness, and a bookmark, and
back/forward) writes it through a channel the reducer does not control: **popstate**. The
live storm PROVES this — the FIRST nav of every pair was `popStateHandler` (vue-router
reacting to a history event), NOT an app writer. If the route were truly a downstream
projection of `machine.activeScene`, a popstate would have nowhere to land; instead it
drove the whole storm.

So the route is not a projection — it is a **second source of truth that must be
RECONCILED into the machine**, exactly the case the charge flagged ("can a pure reducer own
'active scene' when the route is also a source of truth?"). The honest model is:

- `machine.activeScene` is the **single INTERNAL authority** for everything downstream
  (component, group, controls, dock model, `?anim=`).
- The route is an **EXTERNAL input** on the same footing as a click: a popstate/deep-link
  is a `NAVIGATE(routeScene)` event *into* the reducer. The reducer, not the route, decides
  the resting state; then it writes the route ONCE to match (the projection direction).

This is a real architectural distinction, not pedantry, because the wave's phrasing leads
an implementer to the WRONG fix: "make the route read-only" suggests *removing* the
`router.push` writers and letting the route follow `activeScene`. But you cannot remove the
popstate INPUT — and if the reducer doesn't subscribe to it, deep-links and back/forward
break (the route says `#/spring`, the machine still shows `cube`). The correct fix is the
opposite of "read-only route": keep exactly ONE writer (`NAVIGATE`→`router.push`) AND add
exactly ONE reader (a `router.afterEach`/popstate→`NAVIGATE` *guarded against echoing its
own write*). The storm dies not because the route became read-only but because there is now
**one write path and one idempotent read path with a generation/echo guard**, so the
`popStateHandler`→`?anim=`→`replace` PAIR can no longer form.

**Concrete doc edit (BLOCKER — H.W1 must say this or the implementer will mis-build it):**

In §Goal and S3, replace *"the route … become read-only one-way projections … the route
can never write back into scene selection"* with:

> The route is an EXTERNAL source of truth the browser owns (popstate/deep-link/back-forward
> write it through a channel the reducer cannot suppress). The machine reconciles it via
> exactly ONE reader — a single `router.afterEach` (or popstate) handler that dispatches
> `NAVIGATE(route.name)` into the reducer — and exactly ONE writer — the `NAVIGATE`
> transition's single `router.push`/`replace` that re-projects `activeScene` to the URL.
> An echo guard (the reducer no-ops `NAVIGATE(to)` when `to === activeScene`) breaks the
> write→read→write cycle so a route change the machine itself caused cannot re-enter as a
> new event. The dock model, `?anim=`, and localStorage ARE pure downstream projections
> (the app owns those writers); the route is the one input that is bidirectional and is
> made safe by the single-reader/single-writer + echo-guard discipline, NOT by pretending
> it is read-only.

Add to §Design-decisions a RESOLVED line: *"Route reconcile — RESOLVED: one
`afterEach`→`NAVIGATE` reader + one `NAVIGATE`→`push` writer + an `activeScene`-equality
echo guard. The popstate input cannot be removed (the browser owns it); it is made
idempotent."*

**Steelman of the wave's framing (is it salvageable as-is?):** One could argue "route as
projection" is shorthand for "the reducer is upstream of the route." True in spirit. But
the live storm is *driven by an external popstate the reducer must consume*, and the wave's
gate `proof:no-route-storm` installs a history trap and idles — if the implementer builds
"route follows activeScene, no route reader," the deep-link gate `proof:deep-link-wins`
(load `#/spring`) FAILS because nothing dispatches the URL into the machine. The two gates
are in tension under the wave's own framing; only the single-reader/single-writer model
satisfies BOTH. So the framing must change.

---

## §C. HIGH — the engine seam (S6) does NOT cover the raw-rAF scenes, which are the worst-corrupted; the gate tests the wrong half

**Location:** H.W1 S2 (`:38`), S6 (`:46`), `proof:group-snapshot-identity` (`:60`);
`a-scene-state-machine §6b` (`:222-227`); `a-demo-architecture F8` (`:376-389`).

**Verified against source.** Two playback architectures coexist:

- **AnimationGroup scenes** (cube/amiga/square): truth = `group.started` + `group.playing()`
  + per-anim `t/reversed/iteration`. `restoreGroupPlaybackState` (`usePlaybackSnapshot.ts:49-84`)
  re-seats these. `group.serialize()/hydrate()` (S6) is the right seam for THESE.
- **Raw-rAF scenes** (easing — verified; spring/sequence/path use the same `RAFPlayback`
  primitive per `_SYNTHESIS-gap-scorecard §1.1` modes row): truth is a **private
  `isPlaying = ref(true)`** (`useEasingDemo.ts:53`), a **raw `RAFPlayback` loop**
  (`:135`), a closure `startTime` (`:136`) and `progress.value` (the actual position), and
  a DUMMY `AnimationGroup(contractAnim)` (`:268-279`) whose `paused` flag is hand-synced
  (`:288-289`) purely so the bottom playback bar's group-toggle has something to toggle.

The `frame()` callback (`useEasingDemo.ts:138-144`) computes phase from
`(now - startTime) / (duration*2) % 1` — **the position lives in `startTime` +
`progress.value`, NOT in any AnimationGroup**. So:

- `group.serialize()` on the easing scene serializes the **dummy contractAnim**, which
  carries NO position — its `t` is meaningless; the real position is `progress.value`.
- `saveCurrentPlaybackState` (`usePlaybackSnapshot.ts:24-42`) iterates
  `group.animations` — for easing that's the dummy, so the saved snapshot is the dummy's
  `t≈0`, not the sweep phase.
- The audit's own §3a console crash (`serializeEasing` throwing on `contractAnim`'s
  closure `timingFunction`) is the SAME dummy leaking into a serializer — confirming the
  dummy group is a position-less stub.

**Therefore S6's gate does not bite the broken scenes.** `proof:group-snapshot-identity`
asserts `g.hydrate(g.serialize())` is identity on `{t,reversed,iteration,playing,started}`.
For cube that's meaningful. For easing the group is a dummy with no real `t`; the gate
passes vacuously (identity of an empty/meaningless snapshot) while the *actual* easing
position (`progress.value`, `startTime`) is never round-tripped. **The keystone gate is
green-able with the user-reported defect still present.**

S2 gestures at the fix — *"EACH scene … round-trips its OWN full state via a scene contract
method, not a dummy contract anim"* — but:

(a) it is under-specified (no named contract interface, no gate on the raw-rAF path), and
(b) S6 + its gate are written ONLY for the `AnimationGroup` API, so the wave's *gate
regime* enforces the group seam and leaves the contract-method path ungated.

**Concrete doc edits (HIGH):**

1. **S2** — name the contract explicitly: define a `ScenePlayback` interface every scene
   exposes — `{ snapshot(): unknown; restore(s: unknown): void; suspend(): void;
   resume(): void; isPlaying: Ref<boolean> }` — where AnimationGroup scenes implement it
   over `group.serialize/hydrate/pause/resume` and raw-rAF scenes implement it over
   `{startTime, progress, isPlaying}` + `playback.stop()/loop()`. The machine calls the
   CONTRACT, never the group directly. State the deletion: the dummy `contractAnim`
   (`useEasingDemo.ts:268-289`) dies WITH the contract (the bottom bar subscribes to
   `machine.status` instead of a fake group's `paused`).

2. **S6 + its gate** — split the seam. The engine `AnimationGroup.serialize()/hydrate()`
   HANDOFF covers the GROUP scenes only; ADD a `proof:scene-contract-identity` clause that
   round-trips a **raw-rAF scene** (easing): PLAY to `progress≈0.4`, `NAVIGATE` away,
   `NAVIGATE` back, `SCENE_READY` — assert `progress≈0.4` AND `isPlaying` preserved.
   Without this, `proof:scene-machine-irrefragable` (§D) does not exercise the broken half.

3. **§State-verified** — add the raw-rAF authority to the verified list: *"`useEasingDemo`
   position lives in `startTime`+`progress.value`, not an AnimationGroup; the
   `AnimationGroup(contractAnim)` is a position-less dummy (`:268-279`) — the engine
   serialize seam does NOT capture it; the per-scene contract must (S2)."*

---

## §D. HIGH — `proof:scene-machine-irrefragable` bites the AnimationGroup scenes, not the reported-broken ones

**Location:** H.W1 §Hard-gate `proof:scene-machine-irrefragable` (`:54`); `a-scene-state-machine
§7` (`:250-251`); `a-demo-architecture F3` (`:193-198`).

The matrix "drive every ordered pair × {playing,paused}, assert byte-identical playback
round-trip." For cube↔amiga↔square the assertion has teeth (real engine clocks). For ANY
pair involving easing/spring/sequence/path the "byte-identical playback" assertion has
**no engine quantity to compare** (per §C) unless the implementer reads the scene's private
`progress`/`isPlaying`. As written it will be implemented against the group snapshot (the
only typed surface), so the cells the USER reported — *"easing→cube→back leaves controls
invalid"* (the literal D12 repro, `a-scene-state-machine §2`) — are the cells most likely
to be asserted vacuously.

This is the gate-blindspot pattern the tranche itself warns about (`_SYNTHESIS §0` M1:
"issue-level close masquerading as system-level close"). The keystone gate must assert
across BOTH playback architectures or it polices the column, not the product.

**Concrete doc edit (HIGH):** in `proof:scene-machine-irrefragable`, state that the
round-trip assertion reads each scene's `ScenePlayback.snapshot()` (the §C contract), NOT
`group.serialize()`, so easing's `progress`/`isPlaying` and cube's `t` are BOTH asserted;
and require the matrix include ≥2 raw-rAF↔group cross pairs explicitly (e.g.
`easing→cube→easing`, `cube→easing→cube`) as named must-pass rows. Add the bite line:
*"reds today because easing's snapshot is the position-less dummy group; greens only when
every scene implements the contract."*

---

## §E. MED — the deep-link / localStorage / `?anim=` first-load reconcile is a 3-way race the wave hand-waves

**Location:** H.W1 S5 "deep-link wins" (`:44`); `a-scene-state-machine §6c` (`:229-233`);
`router.ts:42-54` (the `?state=` `beforeEach`); `useSceneRouter.ts:19-32` (the `isReady`
localStorage redirect); `useSceneUrl.ts:57-58` (`applyAnimFromUrl` at setup).

On first load there are THREE async inputs that all want to write the initial scene/anim:
1. `router.isReady().then(...)` — if `route.name==='home'`, redirect to localStorage scene
   (`useSceneRouter.ts:21-25`).
2. `router.beforeEach` — if `?state=` present, decode and `next({name: result.activeScene})`
   (`router.ts:43-50`).
3. `useSceneUrl.applyAnimFromUrl()` at setup — read `?anim=` into the controls store
   (`useSceneUrl.ts:24-33,58`), keyed off `currentSuperKey` which at t=0 is seeded from
   `currentScene` (`App.vue:189`) — and may be the WRONG scene if (1) or (2) is about to
   redirect.

The wave says "the initial `idle → NAVIGATE` transition is seeded from the URL; localStorage
consulted only for bare `#/`." That collapses (1) correctly. But it does NOT say how the
`?state=` shared-state path (2) and the `?anim=` apply (3) ORDER against the seed. Today the
`?anim=` apply at setup reads the lagging superKey (the documented storm seed). If the FSM's
`SCENE_READY` is what sets the real superKey, then `applyAnimFromUrl` must run AFTER
`SCENE_READY`, not at composable setup — otherwise the same lag re-appears on first load
even with the storm fixed.

**Concrete doc edit (MED):** S5 must specify the initial-transition ORDER as a single
deterministic sequence: `(a)` reducer reads `route.name` + `route.query.state` + (only if
bare home) localStorage → resolves `activeScene` ONCE; `(b)` `NAVIGATE(activeScene)` →
`loading`; `(c)` on `SCENE_READY`, apply `?anim=` against the NOW-correct superKey (move
`applyAnimFromUrl` out of `useSceneUrl` setup into the `SCENE_READY` handler). Add a gate
clause to `proof:deep-link-wins`: also load `#/spring?anim=Foo` with `localStorage=cube` and
assert resting scene `spring` AND `selectedAnimation==='Foo'` (i.e. the `?anim=` lands on the
deep-linked scene, not the localStorage one). The `?state=` `beforeEach` (router.ts) folding
into the reducer should be named, or explicitly PRESERVED with a note on its ordering vs the
seed (it currently mutates the store before the machine exists).

---

## §F. MED — markRaw + reducer-holds-engine-refs: the wave never states whether the FSM context holds the live group, and it must NOT

**Charge question:** *"the markRaw engine objects — does the FSM hold refs to them, and does
suspend/restore preserve the rAF/WAAPI handle correctly?"*

**Verified.** The current restore is already snapshot-based, not handle-based:
`ScenePlaybackState` (`scenePlayback.ts:3-14`) is PLAIN DATA `{playing, started,
animations: {name → {t, reversed, iteration}}}` — no engine refs. `restoreGroupPlaybackState`
applies that data onto a **freshly-mounted** group (`useSceneGroupSync.ts:46,84` — the group
from the new `sceneRef`, not a held one). This is correct and the wave should KEEP it: the
engine objects are `markRaw` (`App.vue:188`, `useEasingDemo.ts:131,135,279`) precisely so Vue
doesn't deep-proxy them; the reducer must hold **serializable snapshots**, never the live
`markRaw` instances, because (a) the leaving scene's group is unmounted/disposed on swap (no
KeepAlive — `App.vue:109-118`), so any held ref would dangle; (b) the rAF handle is owned by
`RAFPlayback`/the group's own loop and is torn down on `onScopeDispose`
(`useEasingDemo.ts:185`) — a snapshot cannot and must not preserve a live rAF handle; the new
scene re-arms its OWN loop on `RESUME`.

The wave's context type `{ activeScene, perScene: Record<SceneId, PlaybackSnapshot> }`
(`a-scene-state-machine.md:203`) is right — `PlaybackSnapshot` is data. But the wave never
explicitly forbids holding the live group, and S2 ("collapse the three authorities") could
be mis-read as "the machine holds the one true group." It must not.

**Concrete doc edit (MED):** add a §Design-decision RESOLVED line: *"The reducer context
holds SERIALIZABLE snapshots only — never the live `markRaw` AnimationGroup/RAFPlayback
instances. The engine objects are mounted-scene-scoped and disposed on swap (no KeepAlive);
the rAF handle is owned by the scene's loop and re-armed on RESUME, never carried across a
NAVIGATE. SUSPEND = `scene.suspend()` (stop the loop) + write the data snapshot; RESUME =
re-arm + `scene.restore(snapshot)`. A held engine ref would dangle (the leaving scene
unmounts)."* This also makes the `@vueuse/useStorage` persistence (S7) correct-by-construction
— you can only persist serializable data, which the snapshot already is.

---

## §G. MED — `SCENE_READY` solves the double-fire, but the wave doesn't address WHEN targets are actually ready (the original reason the heuristic existed)

**Location:** H.W1 S4 (`:42`); `useSceneGroupSync.ts:50-53,78-87` (the comment explaining the
double-fire); `a-store-architecture §1.2` (`:46-54`).

The `isStableFire` heuristic exists for a REAL reason the wave under-acknowledges: restore
calls `anim.interpFrames(snap.t, false)` (`usePlaybackSnapshot.ts:71`) which for CSS-computed
scenes (cube uses `calc()`/computed units per MEMORY) **requires the DOM targets to be set**
— and targets are set by the scene component AFTER its mount + ACG's keyed remount. The
heuristic was a (brittle) proxy for "targets are now set." Replacing it with `SCENE_READY` is
correct ONLY IF the scene emits `SCENE_READY` *after* its targets are attached, not merely on
`onMounted`. The wave says "the scene emits SCENE_READY on mount (after its targets are set)"
(`:42`) — the parenthetical is the entire load-bearing requirement and it's buried.

**Concrete doc edit (MED):** S4 must state the contract precisely: *"`SCENE_READY` is emitted
by the scene only after its animation targets are attached to the DOM (the same condition the
`isStableFire` second-fire was a proxy for) — for `AnimationGroup` scenes that is after the
group's targets are set so `interpFrames` resolves computed (`calc`/`vh`/`var`) values; for
raw-rAF scenes it is after the loop's render target exists. Emitting on bare `onMounted`
before targets attach would re-introduce the exact race the heuristic worked around. A gate
clause: restore at a computed-unit frame (cube) resolves non-NaN values on the first
`SCENE_READY`."* Pair with `proof:no-timing-heuristic` from `a-store-architecture` ST-4
(perturb the mount timing) — H.W1 dropped that clause; re-add it.

---

## §H. The Pinia vs createGlobalState adjudication — CONCUR, but for a different reason + one caveat

**Location:** `_SYNTHESIS-gap-scorecard §2.1` (`:92-106`); H.W1 §Design-decisions (`:76`).

I steelman BOTH and land on the adjudication's verdict (`createGlobalState`+reducer) — but
the *stated* rationale is weaker than the real one, and one of the dissent's points is mis-
dismissed.

**Steelman Pinia (`a-store-architecture`):** the strongest Pinia argument is NOT devtools or
the persist plugin (both replaceable). It is **`$subscribe` + a single store INSTANCE as the
natural host for an FSM with actions+getters**, and the discipline that actions are the only
mutators (which is exactly what a reducer wants). Pinia would make "the engine is a *driver*
of the store, not a parallel authority" structurally enforced.

**Steelman createGlobalState (the adjudication):** the binding mandate is "NO legacy beside
its replacement / no parallel system." The demo runs `createGlobalState`+`@vueuse/useStorage`
at 3 stores + the keyboard registry. Adding Pinia = a second reactive-store paradigm; porting
all 6 homes + ~30 call-sites in one motion is a LARGER transposition than the FSM itself.

**Where the adjudication's rationale is WEAK (NIT, but worth fixing):** it says Pinia's unique
wins "are achievable in createGlobalState (`@vueuse/useStorage` already gives persistence)."
That conflates two things. `useStorage` gives PERSISTENCE; it does NOT give Pinia's
action-only-mutation discipline or `$subscribe`. The honest reason to reject Pinia is the
no-parallel-system spine + the migration COST, NOT "createGlobalState can do everything Pinia
does" (it can't — it has no action layer). The wave repeats this weak claim verbatim
(`:76`). **Edit:** replace "whose only unique wins are achievable here" with "whose unique
wins (action-only mutation, `$subscribe`) are real but do not outweigh the no-parallel-system
spine + the one-motion migration cost; the reducer supplies the discipline Pinia would
structurally enforce, as a convention rather than a framework."

**The caveat the adjudication OMITS (MED):** `createGlobalState` gives you a single shared
instance but NO mutation boundary — any consumer can write `machine.activeScene` directly,
re-creating the multi-writer problem the FSM is meant to kill. The reducer-as-the-only-mutator
discipline is therefore CONVENTION, not enforced. The wave must add a guard: **export only
`dispatch(event)` + readonly refs from `useSceneMachine`; never expose a writable
`activeScene`.** Without this, the "one authority" is one authority *by politeness*. Add a
gate: `proof:single-writer` — grep that no file outside `useSceneMachine.ts` assigns
`machine.activeScene`/`.status` (the createGlobalState analogue of `a-store-architecture`'s
`proof:single-authority`).

**Verdict:** adjudication stands (createGlobalState+reducer). Add the readonly/`dispatch`-only
boundary + `proof:single-writer`, and fix the "useStorage = Pinia" rationale.

---

## §I. LOW / NIT

- **LOW — `next()` guard removal interacts with the `?state=` restore.** `router.ts:42-54`'s
  `beforeEach` uses `next({name, query})` to REDIRECT during `?state=` restore, not just
  `next()`. The wave says "drop `next()` to a returned value" (S5). Returning a route LOCATION
  from a guard IS supported in vue-router 4 (`return { name, query }`), so this is feasible —
  but the wave should note the guard *returns the redirect target*, not merely `true`, so the
  implementer doesn't naively delete the redirect. (`proof:no-deprecated-guard` greps `next(`
  absent — fine, but verify the `?state=` redirect still works: add it to
  `proof:deep-link-wins` as a `#/cube?state=...` row.)

- **LOW — `useSceneVisibilityPause` fold is sound; preserve its honesty contract verbatim.**
  Verified `useSceneVisibilityPause.ts:36-50`: it only resumes what IT paused (`autoPaused`
  flag). Folding it into the reducer as `TAB_HIDDEN/TAB_SHOWN` (S1) is correct, but the
  reducer MUST preserve "only RESUME if the SUSPEND was tab-caused, not user-caused" —
  otherwise tab-return force-plays a user-paused scene. The wave says "fold," not "preserve
  the autoPaused semantics." Add the note. (NIT-adjacent but a real regression risk.)

- **NIT — scene count / manifest.** `scenes.ts` ships 8 routed scenes + home = 9 entries
  (`scenes.ts:54-124`, `router.ts:16-30`); the discrete/starting-style merge (H.W5) reduces
  the NAV to 3 sub-entries under spring but `starting-style` remains a distinct FSM state +
  route. The FSM's `SceneId` union must enumerate all 8 (cube/amiga/square/easing/spring/
  sequence/motion-path/starting-style) + home as a DISTINCT state (the home↔cube split, S5).
  H.W1 §Scope says "states idle|loading|playing|paused|suspended" — that's the PLAYBACK axis;
  the wave should be explicit that `activeScene: SceneId` is a SEPARATE orthogonal axis with 9
  values (as `a-demo-architecture F3` correctly frames it: "two orthogonal axes"). The single
  flat `idle|loading|playing|paused|suspended` enum in S1 reads as if scene and playback are
  ONE axis — they are not. **Edit:** S1 state the two orthogonal axes explicitly (scene ∈ 9;
  playback ∈ {idle,loading,playing,paused,suspended}), matching `a-demo-architecture.md:166-169`.

- **NIT — "six → two composables" (S7/F6) is achievable but the count is optimistic.**
  `useSceneSwap` + `useSceneTransition` are BOTH preserved (App.vue:215,310 wire both;
  `useSceneTransition` wraps the VT around the swap). That's already two PRESERVED drivers
  before counting `useSceneMachine`. So the floor is THREE composables
  (`useSceneMachine` + `useSceneSwap` + `useSceneTransition`), not two — unless
  `useSceneTransition` folds into `useSceneSwap` (defensible, both are the dissolve), which the
  wave should state. `proof:app-shell-thinness` ("≤2 scene composables") would RED on the
  honest three. **Edit:** either relax the gate to ≤3, or name the `useSceneTransition`→
  `useSceneSwap` fold explicitly.

---

## §J. What is SOUND (no finding — honest credit, inv ε)

- The **diagnosis** (5 authorities, 3 playback authorities, the storm mechanism, the
  double-fire heuristic, no genuine SUSPEND, deep-link-loses) is ACCURATE and reproduced.
- **`createGlobalState`+reducer over Pinia** is the right call (§H — concur, with the boundary
  caveat).
- **Snapshot-based restore over handle-based** is already the design and is correct (§F).
- The **`SCENE_READY` event replacing `isStableFire`** is the right move (§G — with the
  targets-attached precondition stated).
- **Preserving `useSceneSwap`** (the VT+SpringProgress dissolve as a driver, not a store) is
  correct — it is genuinely outside store scope.
- The **engine `serialize()/hydrate()` HANDOFF being born-RED-paired** (S6) is the correct
  chronic-closure discipline — the seam genuinely does NOT exist on `AnimationGroup` (verified
  `group.ts` — no serialize/hydrate methods), so the gate is honestly born-RED. (The defect is
  only that it doesn't COVER the raw-rAF scenes — §C.)
- The **home↔cube split** (S5) is correctly identified as load-bearing and verified
  (`App.vue:198-211` aliases both to CubeScene with `key='cube'`).

---

## §K. Severity-ranked summary (the deliverable)

| # | Sev | Location | Defect | Fix |
|---|-----|----------|--------|-----|
| B | **BLOCKER** | H.W1 §Goal/S3/§Design-dec; `a-scene-state-machine §6a` | "Route = read-only projection" inverts ownership; a pure reducer can't own activeScene while the browser owns the URL (popstate). Live: storm's FIRST nav is always `popStateHandler`. | Reframe: route is an EXTERNAL input reconciled via ONE `afterEach`→`NAVIGATE` reader + ONE `NAVIGATE`→`push` writer + an `activeScene`-equality echo guard. Dock/`?anim=`/localStorage ARE projections; the route is not. |
| C | **HIGH** | H.W1 S2/S6 + `proof:group-snapshot-identity` | Engine seam covers only `AnimationGroup`; easing/spring/sequence/path keep state in a private `isPlaying`+`RAFPlayback`+`startTime`/`progress` (dummy `contractAnim` has no position). Gate green-able while the reported-broken scenes still lose state. | Define a `ScenePlayback` contract every scene implements; machine calls the contract not the group; add `proof:scene-contract-identity` round-tripping easing's `progress`/`isPlaying`. |
| D | **HIGH** | H.W1 `proof:scene-machine-irrefragable` | Matrix asserts "byte-identical playback" but has no engine quantity for raw-rAF scenes → bites cube/amiga/square, passes vacuously on easing (the literal D12 repro). | Assert via `ScenePlayback.snapshot()` (§C), require named `easing↔cube` cross-pair rows. |
| E | **MED** | H.W1 S5; router.ts/useSceneRouter/useSceneUrl | First-load deep-link vs localStorage vs `?state=` vs `?anim=` is a 3-way async race; wave doesn't order it; `applyAnimFromUrl` at setup still reads a lagging superKey. | Specify the initial sequence: resolve activeScene ONCE (route+state, localStorage only for bare home) → NAVIGATE → apply `?anim=` on SCENE_READY. Add `#/spring?anim=Foo` w/ localStorage=cube gate row. |
| F | **MED** | H.W1 (unstated) | Wave never forbids the reducer holding the live `markRaw` group; S2 mis-readable as "machine holds the one true group" (would dangle on unmount). | Add RESOLVED: context holds serializable snapshots only; rAF handle re-armed on RESUME, never carried. |
| G | **MED** | H.W1 S4 | `SCENE_READY` correct only if emitted AFTER targets attach (the real reason `isStableFire` existed — `interpFrames` needs DOM for computed units). Parenthetical buries the load-bearing requirement. | State the targets-attached precondition; re-add `a-store-architecture` ST-4's `proof:no-timing-heuristic` (perturb mount timing). |
| H | **MED/NIT** | `_SYNTHESIS §2.1`; H.W1 §Design-dec | createGlobalState has NO mutation boundary → "one authority" is by politeness; "useStorage=Pinia" rationale conflates persistence with action discipline. | Export `dispatch()`+readonly refs only (no writable activeScene); add `proof:single-writer` grep; fix the rationale wording. |
| I1 | LOW | router.ts:42-54 | `next()` removal must preserve the `?state=` REDIRECT (returns a location, not `true`). | Note guard returns redirect target; add `#/cube?state=…` row to `proof:deep-link-wins`. |
| I2 | LOW | S1; useSceneVisibilityPause | TAB_HIDDEN/TAB_SHOWN fold must preserve "only resume what IT paused" (`autoPaused`). | Add the honesty-contract preservation note. |
| I3 | NIT | S1 | Scene axis (9 values) and playback axis (5 states) are ORTHOGONAL; S1's flat enum reads as one axis. | State two orthogonal axes (matches `a-demo-architecture F3`). |
| I4 | NIT | S7/F6; proof:app-shell-thinness | "six→two" optimistic — `useSceneSwap`+`useSceneTransition` are both preserved → floor is three. | Relax gate to ≤3 OR name the `useSceneTransition`→`useSceneSwap` fold. |

**Bottom line:** H.W1's *diagnosis* and its *strategic move* (one authority + one reducer +
collapse the playback authorities + explicit SCENE_READY + createGlobalState over Pinia) are
CORRECT and will fix the storm. But the wave will be MIS-BUILT at implementation time on two
counts unless edited: (1) the "route as read-only projection" framing must become
"one-reader/one-writer/echo-guard reconcile of an external input" (BLOCKER — the live storm is
popstate-driven), and (2) the engine seam + its keystone gate must cover the raw-rAF scenes
(easing/spring/sequence/path), which keep their state OUTSIDE any AnimationGroup, or the
gate greens with the literal D12 repro still broken (HIGH×2). The Pinia adjudication holds;
add a `dispatch`-only mutation boundary so "one authority" is enforced, not merely polite.
