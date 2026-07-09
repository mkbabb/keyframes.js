# Lane 23 — Panel / DFA / Adapter Architecture

> **Scope.** The MACHINERY behind lane 10's panel-facility design (VERDICT #12 "Square
> used to have a proper keyframes, controls, etc section but that was removed?" · #25
> "Why do we not properly have a keyframes, controls, etc view for the other
> sub-animations? It's like we forgot about that facility entirely?"). Lane 10 owns the
> panel DESIGN and lane 08 owns the dock GRAMMAR; **this lane owns the load-bearing
> architecture underneath both** — `controlSurfaceDFA.ts`, `scenePlaybackAdapters.ts`,
> `useContractAnimGroup.ts`, `useSceneMachine.ts`, the SceneExposedApi/shell-binding seam
> — traces the G2 commit trail that deleted square's panel, and delivers the target
> architecture as an implementable spec. Where I touch lane 10/08 surface (the honest
> group, elision) I cite them and go one layer deeper: the *type shapes and migration
> mechanics*, not the design verdict.

Everything below is READ-ONLY forensics against `tranche-s-impl` @ `929ef0e`.

---

## 1. The machinery as-built (the map)

There are **three panel-bearing concepts**, all bound to a single `AnimationGroup`:

| Concept | File | Bound to | Gated by |
|---|---|---|---|
| The **rail panel** (per-surface, per-sub-animation) | `controls/AnimationControls.vue` | one `KeyframesAnimation` (the selected sub-animation) | the DFA (`controlSurfaceDFA.ts`) |
| The **bottom transport** (play/select/reset) | `TransportDock.vue` | the whole `AnimationGroup` | always mounts when a group exists |
| The **control-surface DFA** (scene → valid surfaces) | `controlSurfaceDFA.ts` | the `SceneId` | static table |

Playback is a **separate** state machine (`sceneMachine.ts` pure reducer +
`useSceneMachine.ts` effect layer) that owns `(activeScene × playback-status)` and calls a
per-scene `ScenePlayback` adapter contract (`snapshot/restore/suspend/resume/isPlaying`).
The DFA is documented as "the THIRD orthogonal axis" bolted on beside the machine
(`controlSurfaceDFA.ts:2`).

The panel is mounted per sub-animation, keyed by animation id:
`ControlsPaneWrapper.vue:61-66` iterates `animationGroup.animations` and mounts one
`AnimationControls` per entry; `AnimationControlsGroup.vue:166-176` keeps a
`animControlRefs` registry keyed by name; the active sub-animation is
`storedControls.selectedAnimation`. **This is the facility the owner wants uniform.**

---

## 2. Root cause — the group/raf bifurcation and the dummy `contractAnim`

Every scene hands `AnimationControlsGroup` a `markRaw(new AnimationGroup(...))`. But that
group means **two structurally different things**:

**(A) Real-group scenes — cube, amiga.** The group holds N *real, painting*
`CSSKeyframesAnimation`s. Editing keyframes/controls/timeline re-drives the subject. The
panel is HONEST. DFA = `["controls","keyframes","timeline"]`
(`controlSurfaceDFA.ts:92-93`). Adapter = `createGroupAdapter` (`scenePlaybackAdapters.ts:37`).

**(B) Light-surface scenes — easing, spring, square, sequence.** The subject is driven
off the **LIGHT** surface (`SpringProgress` / `NumericAnimation` / `Sequence` — no
value.js). The `AnimationGroup` they hand up is a **fiction manufactured solely to satisfy
the transport contract**:

- `useContractAnimGroup.ts:9-58` builds an **opacity-only** `CSSKeyframesAnimation`
  (`fromVars([{opacity:0},{opacity:1}])`) wrapped in an `AnimationGroup`, pre-set
  `started=true`, and describes itself verbatim: *"it drives no scene motion and is NOT a
  playback authority… Deleting the group outright would strand the entire bottom-bar
  contract"* (`useContractAnimGroup.ts:20-26`).
- easing (`useEasingDemo.ts:336`), spring (`useSpringDemo.ts:372`), sequence
  (`useSequenceDemo.ts:164`) each construct one. Their keyframes are `opacity 0→1` — pure
  transport plumbing with no relation to what paints.
- square is the same pattern hand-rolled inline: `useSquareDemo.ts:331-349` builds a
  nested-object `CSSKeyframesAnimation` **that paints nothing** because
  `singleTarget=false` and the grouped interpolation passes flat ValueUnits that don't
  match the box's nested transformFunc (`SquareScene.vue:169-176`), plus a light
  `SpringProgress` pair that actually owns the box (`useSquareDemo.ts:51-52, 180-272`).

**This bifurcation is the whole problem.** The panel facility is wired to a
`CSSKeyframesAnimation` (`AnimationControls.vue:257` — `animation: KeyframesAnimation<any>`).
For family (A) that animation IS the paint authority → honest panel. For family (B) the
animation is a decoy → any panel over it LIES. So the demo has exactly two options for a
family-(B) scene: **show a lying panel, or hide the panel.** Square once did the former;
G2 chose the latter (§3). Neither is what the owner wants. The owner wants the panel back
AND honest — which is impossible while the panel is bound to a decoy. **The fix is not in
the DFA table; it is in dissolving the decoy so every scene's group carries real,
painting animations** (lane 10 rec 1; I spec the mechanics in §7).

---

## 3. Finding A — square's panel loss: the G2 forensics

**The commit.** `021f0eb` "S.G2 S2: square honest controls (fold row 69) — collapse the
lying panel" flipped `CONTROL_SURFACES.square` from `["controls","keyframes","timeline"]`
to `[]` (`controlSurfaceDFA.ts:99`, diff confirmed). The message is candid: the square
*"projected the full editor triad over a CSSKeyframesAnimation whose grouped interpolation
painted NOTHING (singleTarget=false, mismatched nested-object structure) — a lying panel."*
It co-moved `test/demo/control-surface-dfa.test.ts:56-61` (square → empty-set group),
`proof-scene-control-dfa.mjs` EXPECT.square=`{hasPanel:false}`, and `proof-live-session`
square trigger→null, plus a new born-RED `proof-square-honest.mjs`.

**The follow-on damage.** `8d3a47c` then re-grounded the *cold-entry arming audit's square
leg* onto "the scene's REAL post-collapse engine-write channel — the one-shot spring
tumble" — i.e. the honest-collapse forced the Play verb itself to be redefined as a tumble
(`SquareScene.vue:103-114`, `useSquareDemo.ts:280-286`). The gate lineage now *asserts the
panel is absent* — so restoring it per the owner is a **born-RED handoff against three
gates** (`proof:square-honest`, `proof:scene-control-dfa`, the dfa unit test), not a free
edit. T must re-charter these, not fight them.

**The verdict.** G2 was a locally-correct move (a lying panel is worse than no panel) that
**cured the symptom and entrenched the disease.** The disease is the decoy animation. The
owner's #12/#25 is the disease surfacing: square, sequence, motion-path, morph all lost or
never had the facility because none of them drives its subject through an editable engine
animation. The G2 commit even *names the cure it declined to take*: make the group's
animation actually paint. `useSquareDemo.ts:26-30` already carries the SAME nested-object
keyframes + the SAME `transformFunc` the box reads — the tumble/Play path is a
`SpringProgress` spin that could instead be (or drive) a real animation. The honest square
panel is reachable; G2 chose the cheaper collapse under a green-gate deadline.

---

## 4. Finding B — the DFA is an exclusion table, not a derivation

`CONTROL_SURFACES` (`controlSurfaceDFA.ts:90-113`) is a hand-maintained `Record<SceneId,
ControlSurface[]>` — nine literal rows the author must keep in sync with reality. Three
structural smells:

1. **It encodes the bifurcation as data.** Whether a scene "has a panel" is a *property of
   whether its group paints*, but the table restates it per scene as a literal. cube/amiga
   get the triad; square/sequence/path/morph get `[]`; easing/spring/compose get a bespoke
   single surface. The table is the bifurcation frozen into a lookup — exactly the shape
   that drifts (the MEMORY gate-blindspot lesson: green table, wrong pixels).

2. **The conditional surface is a second special-cased table.** cube's `matrix-controls`
   can't live in the static row (it's selection-gated), so it needs a *parallel*
   `CONDITIONAL_SURFACES` record (`:124-126`), an `activeConditionals` argument threaded
   through `extraControlTabsFor`/`selectedControlSurfaceFor` (`:211-225, 265-288`), and a
   caller predicate. One conditional surface across the whole app spawned a whole second
   axis of API.

3. **Tab metadata is triplicated.** The surface→`{label,icon}` map exists THREE times:
   `SCENE_SURFACE_TABS` (`controlSurfaceDFA.ts:188-198`), `BUILT_IN_TAB_META`
   (`AnimationControls.vue:293-297`), and `BUILT_IN_CONTROL_TABS`+`TAB_ICONS`
   (`ChromeDock.vue:33-47`). Three sources for "what does the Keyframes tab look like."

**The derivation that replaces the table.** `surfaces(scene) = (group has ≥1 painting
animation ? TRIAD : []) ∪ sceneFacets(scene)`. The group-cardinality half is *computed*,
never declared; only the additive scene-specific facets (easing's Curve, spring's Physics,
cube's Matrix) remain data — and those become one small registry, not a per-scene
exclusion row (lane 10 rec 2). Once every scene's group paints (§7.1), the triad half is
uniformly present and the owner's #25 asymmetry vanishes *by construction* — there is no
row where a painting group is denied the triad.

---

## 5. Finding C — the adapter dual-family and dishonest play semantics

`scenePlaybackAdapters.ts` ships two adapter builders for the ONE `ScenePlayback` contract:

- `createGroupAdapter` (`:37-106`) — reads the live `AnimationGroup`, hand-re-seats **eight
  clock fields** on restore (`restoreGroupPlaybackState:117-158`). The header flags this as
  a born-RED handoff: *"when the engine serialize()/hydrate() seam ships, the restore body
  reduces to two calls"* (`:10-13`).
- `createRafAdapter` (`:186-219`) — round-trips `progress`/`isPlaying` for scenes with **no
  group position** (`:15-20`).

The two families exist *because of the same bifurcation*: group-scenes restore engine
clocks; raf-scenes restore a scalar `progress`. But note the incoherence — the light-surface
scenes hand up BOTH a raf adapter (easing: `useEasingDemo.ts:229`; the `useRafScene.ts:97`
seam) AND a dummy group (for the transport). The group they expose is snapshot by
`createGroupAdapter` for *some* scenes (morph/motion-path/compose:
`useMorphDemo.ts:65`, `useMotionPathDemo.ts:96`, `useComposeDemo.ts:96`) and *ignored* for
others (easing/spring/sequence expose `scenePlayback` so the shell prefers it —
`useSceneMachineShellBinding.ts:87-88`). **Which adapter wins is decided by whether the
scene bothered to expose one** — an implicit, per-scene contract, not a uniform rule.

**Dishonest play semantics, concretely:**

- **square's Play doesn't play — it tumbles.** Because `group.play()` paints nothing
  (§2), S5b redefined the Play verb: a rising edge on `isPlaying` fires a one-shot
  `tumble()` and self-clears on settle (`SquareScene.vue:103-114, 165-167`). The transport
  Play button is wired to a decoy group whose only honest response is "do a barrel roll."
  This is a workaround the owner would reject on sight if they knew (it is not in the 22
  items only because the tumble happens to look intentional).
- **The `machinePlaying` back-channel.** Because the group's `started` flips only on the
  first rAF tick, a machine-initiated start leaves the transport's local `isPlaying` stale;
  S.A0 threads a `machinePlaying` prop the whole way down to force-sync
  (`AnimationControlsGroup.vue:125-140, 230-237`). A second play-truth channel exists
  purely to correct the first.
- **The S.A0 queue-then-start.** `sceneMachine.ts:140-149` records a play intent onto the
  snapshot during `loading` and `scenePlaybackAdapters.ts:63-84` special-cases an
  empty-animations snapshot as "a START, not a restore." Real complexity — but it is
  complexity *managing a group whose start is invisible until it paints*, which the honest
  group makes moot.

The dual-family + the dummy group + the three play-truth channels are all epicycles around
one missing invariant: **every group member paints, and playback is the group's own state.**

---

## 6. Finding D — single-option elision is duplicated presentation logic

VERDICT #17: *"when we have a page with ONE option… the dock should not show an extra
'spring'/'easing' item — elide that intelligently if there's only ONE option. Same for
animations — not displayed if an animation only has ONE sub-animation."*

The elision is **half-built and duplicated across two components**:

- `ChromeDock.vue:116` `multipleControlTabs = allControlTabs.length > 1` → renders a
  `<Select>`; else `:249-266` renders a **static label** `soleControlTab`.
- `TransportDock.vue:57` `animationNames.length > 1` → `<Select>`; else `:109-114` a
  **static label** span.

Two problems. **(1) It replaces the dropdown with a static label, not nothing.** The owner
wants the item *elided* — shot 14's `∿ Spring │ ∿ Spring ⌄` is the readout showing "Spring"
twice (the scene name AND the sole-surface label). The static label at
`ChromeDock.vue:249-266` is the second "Spring." It must be *deleted*, not downgraded (lane
10 rec 5, lane 08 rec 1 both name this — I add the mechanism below). **(2) The `> 1` rule
is duplicated presentation arithmetic.** Each dock re-derives cardinality from a different
list (`allControlTabs` vs `animationNames`). The elision should be a **property of the
model** — a facility exposes `channels` and `facets`, each with a `.length`, and the dock
renders `n>1 ? select : n===1 ? (inline, no chrome) : absent`. One rule, one place, both
docks consume it. Elision "at the dock grammar level" (my charter) means: the dock's
*grammar* (rail-core / conditional-section / nav) reads a facility's cardinality and a
section with `n≤1` **is structurally absent** — not conditionally labelled.

Also note the **separator debt** this creates (VERDICT #6 "superfluous dividing line"):
`ChromeDock.vue:217,268,309` emit `dock-separator` divs flanking groups that may be elided,
so an elided middle group leaves a doubled/leading rule. Separators must be a function of
*inhabited* zones, which only a cardinality-aware grammar can guarantee (lane 08 rec 1).

---

## 7. The target architecture (implementable spec)

The through-line: **one facility abstraction that unifies group-scenes and raf-scenes, so
the panel, the transport, the DFA, the adapters, and the elision all read from ONE model.**

### 7.1 The `SceneFacility` descriptor — the unification seam

Replace the `SceneExposedApi.animationGroup?` + `scenePlayback?` pair
(`sceneExposedApi.ts:17-34`) and the ad-hoc "does this scene expose an adapter" branch
(`useSceneMachineShellBinding.ts:87-88`) with a single descriptor every scene returns:

```ts
interface SceneFacility {
  /** The playing/scrubbable models the transport drives. ≥1 for any live scene.
   *  A CHANNEL is a real, painting engine animation OR a light tracker wrapped in
   *  a uniform ChannelHandle — never a decoy. */
  channels: ChannelHandle[];
  /** The additive, scene-specific editor surfaces (easing Curve, spring Physics,
   *  cube Matrix). The TRIAD is NOT listed here — it is derived from channels. */
  facets: SceneFacet[];
  /** ONE playback adapter, built FROM the channels — not a per-scene choice. */
  playback: ScenePlayback;
}

interface ChannelHandle {
  name: string;                       // the transport-select label
  /** The editable model backing the rail panel's surfaces. */
  animation?: KeyframesAnimation<any>;// present ⇒ triad is honest for this channel
  /** For a physics/light channel with no keyframes: the honest surfaces it DOES
   *  carry (e.g. spring → ["controls"] editing response/damping). */
  surfaces?: ControlSurface[];
  progress(): number; setProgress(t: number): void; // the raf round-trip, uniform
}
```

The point: a channel either **carries a painting `animation`** (→ the triad is honest) or
**declares the honest subset of surfaces it supports** (spring's Physics = a `controls`
facet editing response/damping; no fictional keyframes). There is no third "decoy" state.

### 7.2 The DFA inverts from table to derivation

Delete the `CONTROL_SURFACES` exclusion table (`controlSurfaceDFA.ts:90-113`) and the
parallel `CONDITIONAL_SURFACES` (`:124-126`). Replace with:

```ts
function surfacesFor(facility: SceneFacility, selectedChannel: ChannelHandle): ControlSurface[] {
  const triad = selectedChannel.animation ? BUILT_IN_SURFACES
              : (selectedChannel.surfaces ?? []);
  return [...triad, ...facility.facets.map(f => f.surface)];
}
```

Cube's `matrix-controls` conditional collapses into this: it is a `facet` present on the
Matrix channel's descriptor and absent on the others — the selection-gating is just
"which channel is selected," no `activeConditionals` argument, no second table. The
`SCENE_SURFACE_TABS`/`BUILT_IN_TAB_META`/`BUILT_IN_CONTROL_TABS` triplication (§4.3)
collapses into ONE `SURFACE_META` registry consumed by both docks and the rail.

### 7.3 The transport binds a facility, not a group — delete `useContractAnimGroup`

`AnimationControlsGroup` and `TransportDock` take `channels`/`playback`, not
`AnimationGroup`. The `animationNames` prop (`TransportDock.vue:361-367`,
`AnimationControlsGroup.vue:91`) becomes `channels.map(c => c.name)`. This **deletes
`useContractAnimGroup.ts` outright** (lane 10 rec 1) and the inline decoy at
`useSquareDemo.ts:331-349` — the transport no longer needs a group to exist, so a
light-surface scene provides its light channels directly and NO opacity fiction. The
`singleTarget=false` decoy at `SquareScene.vue:169-176` dies with it.

Consequence for §5's dishonesty: square's channel becomes its real nested-keyframes/tumble
driver, so `group.play()` → the box actually animates; Play stops meaning "tumble."
`machinePlaying` (`AnimationControlsGroup.vue:125-140`) and the S.A0 empty-snapshot
special-case (`scenePlaybackAdapters.ts:63-84`) can be reconsidered once `started` reflects
a channel that paints on tick 0.

### 7.4 The rail panel becomes model-agnostic

`AnimationControls.vue` today hard-binds `animation: KeyframesAnimation<any>` (`:257`) and
gates the triad panes on `hasSurface` (`:96-144`). Retarget it at the **selected
`ChannelHandle`**: the Controls facet edits `channel.animation?.options` when present, else
the channel's declared control model (spring params); the Keyframes/Timeline facets mount
only when `channel.animation` exists (honest by construction — a physics channel simply
declares `surfaces:["controls"]` and no keyframes pane is reachable). This also lets the
three mount topologies (`isSingleSurfaceScene` flat mount `:15-35`, the standalone
`extraTabs` seam `:262-271`, the managed Tabs branch) collapse toward one, since "flat vs
tabs" is now `facets.length + (channel.animation ? 3 : 0) <= 1` — a cardinality read, the
SAME arithmetic §7.5 uses (lane 10 rec 2).

### 7.5 Elision as a model cardinality property (dock grammar level)

Introduce one derived shape both docks consume:

```ts
// on the facility/machine projection, ONE place:
const controlZone = tabs.length > 1 ? { kind:"select", tabs }
                  : tabs.length === 1 ? { kind:"inline", tab: tabs[0] } // NO static-label dupe
                  : { kind:"absent" };
const channelZone = channels.length > 1 ? { kind:"select", channels }
                  : { kind:"absent" };  // 1 channel ⇒ the name lives in the collapsed pill only
```

`ChromeDock`/`TransportDock` render `kind:"absent"` as **no node and no flanking
separator**; `kind:"inline"` as the tab body with zero dock chrome (no duplicated label).
This deletes `ChromeDock.vue:249-266`, `TransportDock.vue:108-114`+`175-176`, the
`multipleControlTabs`/`soleControlTab` computeds (`ChromeDock.vue:116-122`), and lets the
separators derive from inhabited zones (VERDICT #6). Elision is now one rule keyed on model
cardinality, consumed identically by both docks — the "dock grammar level" the charter asks
for. (Lane 08 rec 1 designs the DockSection grammar that hosts this; I supply the
cardinality model it renders.)

### 7.6 Migration mechanics & gate re-charter

1. **Land `SceneFacility` beside the existing exposes** (additive), migrate scenes one at a
   time: cube/amiga (already honest — wrap their group members as channels); square (bind
   the nested-keyframes twin as a real channel, drop the decoy); spring/easing/sequence
   (light channels + a `controls`/Curve facet, delete their `useContractAnimGroup` call).
2. **Invert the DFA** (`surfacesFor` derivation) once every scene exposes channels; delete
   `CONTROL_SURFACES`/`CONDITIONAL_SURFACES` and the two `activeConditionals` params.
3. **Delete `useContractAnimGroup.ts`** and the square decoy; retarget the transport.
4. **Re-charter the born-RED-inverted gates**: `proof:square-honest` currently asserts
   `hasPanel:false` (`proof-square-honest.mjs`), `proof:scene-control-dfa` EXPECTs
   `square={hasPanel:false}`, `control-surface-dfa.test.ts:56-61` groups square with the
   empty set. All three must flip to assert **panel present AND honest** (an edit-to-paint
   oracle: change duration/keyframes via the panel → measured computed-style cadence delta
   on the subject). This is the born-RED handoff the S.G2 collapse created; T authors the
   new red, S's green was the wrong assertion.

---

## T recommendations

1. **T-PA-1 · The `SceneFacility` unification seam — one descriptor replaces
   `animationGroup?`+`scenePlayback?`+the dummy group.** Scope: introduce `SceneFacility`
   (`channels[]` + `facets[]` + one `playback`) as the SceneExposedApi surface; a channel
   carries a painting `animation` (triad honest) OR declares its honest `surfaces`
   (physics → `["controls"]`); migrate all 9 scenes; delete the per-scene "expose an
   adapter or not" branch (`useSceneMachineShellBinding.ts:87-88`). *Falsifiable gate:*
   `proof:scene-facility` — every non-home scene exposes ≥1 channel; **zero channels have a
   non-painting `animation`** (runtime: each channel with `.animation` shows a
   computed-style delta on its target within N frames of `group.play()`); grep
   `useContractAnimGroup` = 0. *Size:* **L** (this is the keystone lanes 10/08 both ride).

2. **T-PA-2 · Delete `useContractAnimGroup` + the square decoy; the transport binds
   channels, not a group.** Scope: remove `useContractAnimGroup.ts`, the
   `singleTarget=false` decoy (`SquareScene.vue:169-176`), the inline decoy anim
   (`useSquareDemo.ts:331-349`); `TransportDock`/`AnimationControlsGroup` take
   `channels`/`playback`; square's channel becomes its real nested-keyframes/tumble driver
   so Play *plays* (retires the Play=tumble redefinition). *Gate:* `grep -r
   useContractAnimGroup demo/` = 0; runtime — on the square scene, dock Play produces a
   translate/scale delta on `.demo-box` (not only a 360° tumble); no `opacity 0→1` keyframe
   string appears in any scene's Keyframes readout. *Size:* **M** (rides T-PA-1).

3. **T-PA-3 · Invert the DFA from exclusion table to derivation; fold the conditional axis
   and the triplicated tab metadata.** Scope: replace `CONTROL_SURFACES` +
   `CONDITIONAL_SURFACES` with `surfacesFor(facility, selectedChannel)`; cube's
   matrix-controls becomes a facet on the Matrix channel (delete `activeConditionals` from
   `extraControlTabsFor`/`selectedControlSurfaceFor`); collapse
   `SCENE_SURFACE_TABS`/`BUILT_IN_TAB_META`/`BUILT_IN_CONTROL_TABS`+`TAB_ICONS` into one
   `SURFACE_META`. *Gate:* `proof:dfa-derived` — no literal `Record<SceneId,
   ControlSurface[]>` in `controlSurfaceDFA.ts` (source grep); every scene with a
   painting-channel group renders the full triad (browser census); surface `{label,icon}`
   resolves from exactly one module (grep the three former sites → one). *Size:* **M**
   (rides T-PA-1; complements lane 10 rec 2).

4. **T-PA-4 · Restore square's panel HONESTLY — re-charter the three born-RED-inverted
   gates.** Scope: square exposes channels(triad honest via its nested-keyframes twin) +
   the tumble as an egg, NOT the Play verb; flip `proof:square-honest` /
   `proof:scene-control-dfa` EXPECT.square / `control-surface-dfa.test.ts:56-61` from
   `hasPanel:false` to panel-present-and-honest. *Gate:* `proof:square-honest` v2 — the rail
   mounts a Controls+Keyframes+Timeline facet on square; an edit through the Keyframes facet
   changes the subject's painted transform cadence (edit-to-paint oracle); the old
   `hasPanel:false` assertion is deleted (grep). *Size:* **M** (the VERDICT #12 close;
   documents the S.G2 lesson — a green gate can assert the wrong invariant).

5. **T-PA-5 · Elision as a single model-cardinality rule consumed by both docks.** Scope:
   one `controlZone`/`channelZone` derivation (`n>1 ⇒ select · n===1 ⇒ inline, no chrome ·
   n≤0 ⇒ absent`) on the machine/facility projection; delete the static labels
   (`ChromeDock.vue:249-266`, `TransportDock.vue:108-114,175-176`) and the
   `multipleControlTabs`/`soleControlTab`/`animationNames.length>1` per-dock arithmetic;
   separators derive from inhabited zones. *Gate:* `proof:dock-elision` — dock innerText on a
   1-surface scene contains no duplicated adjacent token (measured `"Spring\nSpring"` →
   `"Spring"`); zero `dock-static-label` nodes render; no leading/adjacent `dock-separator`
   on any scene census. *Size:* **S** (the model; lane 08 rec 1 owns the DockSection host it
   feeds — coordinate, don't duplicate).

6. **T-PA-6 · Collapse the adapter dual-family + the play-truth back-channels once channels
   paint.** Scope: with T-PA-1/2 landed, build `playback` FROM the channels uniformly (a
   channel is either engine-clocked or progress-scalar — the adapter reads the channel, not
   a per-scene choice); re-evaluate `machinePlaying` (`AnimationControlsGroup.vue:125-140`)
   and the S.A0 empty-snapshot special-case (`scenePlaybackAdapters.ts:63-84`) now that
   `started` reflects a painting channel; keep `createGroupAdapter`'s eight-field re-seat as
   the still-open engine `serialize()/hydrate()` born-RED handoff (`scenePlaybackAdapters.ts:10-13`)
   — do NOT invent a new codec. *Gate:* `proof:one-adapter` — a single adapter builder
   consumes any `SceneFacility`; grep for a per-scene "expose scenePlayback or fall back to
   group" branch = 0; `machinePlaying` prop either removed or justified by a failing
   throttled probe attached to the gate. *Size:* **M** (rides T-PA-1/2).
