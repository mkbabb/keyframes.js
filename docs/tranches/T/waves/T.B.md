# Tranche T · Band B — THE FACILITY (`SceneFacility` + the triad everywhere)

> **The band thesis (root cause #2, `T.md` §0).** Light scenes hand the transport a
> fake, non-painting `AnimationGroup` (`useContractAnimGroup`, a self-confessed "escape
> hatch") — so their panels could only *lie* or *vanish*; S.G2 chose vanish for square and
> the owner rejected the vanish (VERDICT #12/#25). The control-surface DFA is an **exclusion
> table over a decoy** instead of a **derivation over honest channels**. This band replaces
> the decoy with `SceneFacility`: every channel paints, the triad + single-option elision
> **derive**, and the panel facility the owner said we "forgot entirely" is uniform across
> every surviving scene.
>
> **Lanes owned:** 23 (panel/DFA/adapter architecture — ALL; `T-PA-1` is the band keystone),
> 10 (panel facility — ALL), 06 (spring — recs 2,3,6,7), 04 (square — recs 3,4), 30 (machine
> + transport suite — recs 1,2,5), 21 (legacy sweep — rec 3 `TransportSource`).
>
> **The keystone merge (band guidance).** Lane 23 `T-PA-1`/`T-PA-2`, lane 10 rec 1, and lane
> 21 rec 3 are **one** cure named from three angles (architecture / facility / transport
> typing) → **T.B1**. Single-option elision (lane 23 `T-PA-5`, lane 10 rec 5, lane 30 recs
> 3&4, lane 06 rec 1) is **one** model-cardinality rule → **T.B5**; lane 08's `DockSection`
> host *renders* it (edge to **T.C**, not duplicated here). Elision (lane 10 rec 5 / 23
> `T-PA-5` / 30 recs 3,4) is ONE model rule; lane 08's `DockSection` host consumes it.
>
> **Read against** `tranche-s-impl` @ `929ef0e` (source facts below verified live).

---

## The band DAG (intra-band ordering)

```
T.B1 (SceneFacility keystone — delete the decoy, every channel paints) ── the whole band rides this
  ├── T.B2 (DFA inverts table → derivation)
  │      └── T.B5 (elision = ONE model-cardinality rule)  ──edge→ T.C renders it
  ├── T.B3 (restore square's panel HONESTLY + re-charter 4 inverted gates) ──edge→ T.A (honest Play)
  ├── T.B7 (spring/easing bespoke sidebars DISSOLVE → channels + one facet) ──edge→ T.E/T.D/T.A
  └── T.B8 (machine single-writer: finish D12 + collapse adapter dual-family)
T.B4 (surrounding pane REMOVED — two floating GlassPanels)  [OD-5, parallel]
T.B6 (glass-ui-first panel kit + register cure)  [OD-6, edge→ T.H/T.D]
T.B9 (one keyspace: superKey → SceneId)  [data-layer, parallel]
T.B10 (ordered transport-action model — play-first as data)  [parallel] ──edge→ T.C
```

Every wave-close rides **T.M**'s `proof:owner-verdict-recorded`; the appearance/design waves
(**T.B4** replacement composition, **T.B6** register, **T.B7** aesthetics) are **BORN-OWNER**
— per T.M's mechanism (lane 26 rec 1) their born-RED oracle is **not authored** until the OD
row (§3) carries an owner token.

---

## T.B1 — The `SceneFacility` keystone: delete the decoy; every channel paints

**id** T.B1 · **size** L · **BORN-RED**
**lanes** 23 rec `T-PA-1` + `T-PA-2` · 10 rec 1 · 21 rec 3 (the three-angle keystone merge)

**Scope.** Replace the `SceneExposedApi.animationGroup?` + `scenePlayback?` pair
(`demo/app/scene/sceneExposedApi.ts:17-34`) and the ad-hoc "does this scene expose an
adapter" branch (`useSceneMachineShellBinding.ts:87-88`) with **one** descriptor every scene
returns:

```ts
interface SceneFacility {           // the unification seam
  channels: ChannelHandle[];        // ≥1 for any live scene; NEVER a decoy
  facets: SceneFacet[];             // additive scene surfaces (easing Curve, spring Physics, cube Matrix)
  playback: ScenePlayback;          // ONE adapter, built FROM the channels
}
interface ChannelHandle {
  name: string;                     // the transport-select label
  animation?: KeyframesAnimation<any>;   // present ⇒ triad is HONEST for this channel
  surfaces?: ControlSurface[];      // physics/light channel's honest subset (spring → ["controls"])
  progress(): number; setProgress(t: number): void;   // the raf round-trip, uniform
}
```

A channel **carries a painting `animation`** (→ triad honest) **or declares the honest subset
of surfaces it supports** (spring's Physics = a `controls` facet; no fictional keyframes).
There is no third "decoy" state — this is lane 21 rec 3's `TransportSource` interface named
from the transport-typing angle (`{paused, started, t, duration, play/pause}` is exactly what
`progress()`/`setProgress()` + `playback` expose; the light `SpringProgress`/sweep IS the
authority, so no impersonation).

Concretely, in **this** wave (facet *content* richness lands in T.B2/B3/B7):
1. **Delete `demo/app/runtime/useContractAnimGroup.ts` in totality** (the opacity-only
   `fromVars([{opacity:0},{opacity:1}])` placeholder, self-described at `:15-27` as an escape
   hatch that "drives no scene motion and is NOT a playback authority") and its three call
   sites — `useEasingDemo.ts:336`, `useSpringDemo.ts:372`, `useSequenceDemo.ts:164`.
2. **Delete the inline square decoy** — the `singleTarget=false` opacity anim at
   `useSquareDemo.ts:331-349` + `SquareScene.vue:169-176` (the grouped interpolation that
   paints nothing).
3. **`TransportDock`/`AnimationControlsGroup` take `channels`/`playback`, not
   `AnimationGroup`** — `animationNames` (`TransportDock.vue:361-367`,
   `AnimationControlsGroup.vue:91`, today `Object.keys(animationGroup.animations)`) becomes
   `channels.map(c => c.name)`.
4. **Migrate all 9 (surviving) scenes to expose ≥1 painting channel:** cube/amiga wrap their
   already-real group members as channels (`useCubeDemo.ts:44,74,85`,
   `useAmigaDemo.ts:151-157`); square binds its nested-keyframes twin
   (`useSquareDemo.ts:26-30`, which already carries the real `transformFunc`) as a real
   channel; spring/easing/sequence expose their light channels directly.

**Gate.** `proof:scene-facility` (born-RED — new): (a) `grep -r useContractAnimGroup demo/` = 0
(**11 hits today**, verified); (b) every non-home scene exposes ≥1 channel; (c) **zero channels
carry a non-painting `animation`** — the *edit-to-paint oracle*: for each channel with
`.animation`, within N frames of `playback` start the channel's target shows a
`getComputedStyle` delta (no `opacity 0→1` keyframe string appears in any scene's readout).
RED today because `useContractAnimGroup` exists and easing/spring/sequence/square feed the
transport a decoy that paints nothing.

**Edges.** Feeds **T.B2** (DFA reads `channels`), **T.B3** (square's honest channel),
**T.B5** (elision reads `channels.length`), **T.B7** (spring/easing channels), **T.B8**
(playback built from channels). **T.C** lane 08's `DockSection` transport reads `channels`.
**T.F** — the facility descriptor is the seam the demo re-taxonomy composes around.

**Lockstep.** The `SceneExposedApi` type change ripples the contract-shape gates:
`proof:scene-contract-identity` (`test/demo/scene-contract-identity.test.ts`),
`proof:scene-raf-leak` (`test/demo/scene-raf-leak.test.ts`),
`proof:group-snapshot-identity`, `proof:scene-machine-irrefragable` — each currently asserts
the `animationGroup?`/`scenePlayback?` duck-typing; re-anchor them to `SceneFacility` in the
**same motion**. Never leave a gate asserting the decoy contract (the lane-18 rule).

---

## T.B2 — The DFA inverts: exclusion table → derivation; fold the conditional axis + triplicated tab metadata

**id** T.B2 · **size** M · **BORN-RED** · rides T.B1
**lanes** 23 rec `T-PA-3` · 10 rec 2

**Scope.** Delete the hand-maintained `CONTROL_SURFACES: Record<SceneId, ControlSurface[]>`
(`demo/@/state/controlSurfaceDFA.ts:90-113` — nine literal rows, verified) and the parallel
`CONDITIONAL_SURFACES` (`:124-126`). Replace with a derivation:

```ts
function surfacesFor(facility: SceneFacility, selected: ChannelHandle): ControlSurface[] {
  const triad = selected.animation ? BUILT_IN_SURFACES : (selected.surfaces ?? []);
  return [...triad, ...facility.facets.map(f => f.surface)];
}
```

- **The triad half is *computed*** from "does the selected channel paint," never declared —
  so no row can deny a painting group the triad; the owner's #25 asymmetry vanishes by
  construction.
- **Cube's `matrix-controls` conditional collapses in**: it is a `facet` on the Matrix
  channel's descriptor, absent on the others — selection-gating is just "which channel is
  selected." Delete the `activeConditionals` argument threaded through
  `extraControlTabsFor`/`selectedControlSurfaceFor` (`controlSurfaceDFA.ts:211-225,265-288`)
  and the second-table lookups (`:138,153,218,282`).
- **Collapse the triplicated tab metadata** into ONE `SURFACE_META` registry: today the
  surface→`{label,icon}` map exists three times — `SCENE_SURFACE_TABS`
  (`controlSurfaceDFA.ts:188-198`), `BUILT_IN_TAB_META` (`AnimationControls.vue:293-297`),
  `BUILT_IN_CONTROL_TABS`+`TAB_ICONS` (`ChromeDock.vue:33-47`). One source, consumed by both
  docks and the rail.

The only hand-data left is the scene-facet registry (label/icon/surface per additive facet) —
three rows once compose/morph/motion-path are pruned (**T.E** ruling #23). `home` derives `[]`.

**Gate.** `proof:dfa-derived` (born-RED — new): no literal `Record<SceneId, ControlSurface[]>`
in `controlSurfaceDFA.ts` (source grep, **fails today** — the literal is at `:90`); every scene
with a painting-channel group renders the full triad (browser census); a surface `{label,icon}`
resolves from exactly **one** module (grep the three former sites → one). RED today because the
exclusion table and both conditional/triplicated axes are live.

**Edges.** Rides **T.B1** (needs `channels`); complements **T.B5** (the derived surface set is
what elision counts). Cube's Matrix-as-facet is the same generalization **T.A** cube work
touches — coordinate the Matrix channel's descriptor.

**Lockstep.** `proof:scene-control-dfa` (`scripts/proof-scene-control-dfa.mjs` +
`test/demo/control-surface-dfa.test.ts`) asserts the *table* including
`easing/spring: {noBuiltInTriad:true}` (`:188-189`, verified) — re-charter it to assert the
*derivation* (easing/spring now derive the triad). `proof:control-surface-single-writer`
(`scripts/proof-control-surface-single-writer.mjs`) reads `selectedControlSurfaceFor` — keep
its single-writer invariant but re-point it at the derived selector. Do NOT green either by
re-introducing the table.

---

## T.B3 — Restore square's panel HONESTLY; re-charter the four collapse-locked gates

**id** T.B3 · **size** M · **BORN-RED** · rides T.B1/T.B2
**lanes** 23 rec `T-PA-4` · 04 (the VERDICT #12 close; #25 by generalization)

**Scope.** This is the VERDICT #12 close ("Square used to have a proper keyframes, controls,
etc section but that was removed?"). The G2 forensics: commit `021f0eb` flipped
`CONTROL_SURFACES.square` from the triad to `[]` (`controlSurfaceDFA.ts:99`, verified) because
Play painted nothing — a *locally-correct* move (a lying panel is worse than none) that
**cured the symptom and entrenched the disease** (the decoy). With T.B1/B2 landed, square's
channel is its real nested-keyframes/tumble driver, so the triad is honest by construction.

This wave owns the **facility-restoration + gate-inversion** half:
1. Square exposes `channels` whose selected channel carries a painting `animation` → the triad
   (Controls/Keyframes/Timeline) derives; the tumble stays a **discovered gesture egg, NOT the
   Play verb** (retire `isPlaying→tumble()`, `SquareScene.vue:114,165-167`).
2. **Re-charter the FOUR born-RED-inverted gates** that currently gate-lock the *rejected*
   state (verified today):
   - `proof:square-honest` (`scripts/proof-square-honest.mjs`, 231 L — asserts the collapse)
   - `proof:scene-control-dfa` EXPECT — `square: { hasPanel: false }`
     (`proof-scene-control-dfa.mjs:187`)
   - `proof:live-session` — square trigger → `null`
   - `test/demo/control-surface-dfa.test.ts` — square in the empty-set group
   All four flip from `hasPanel:false` to **panel-present-AND-honest** (an edit-to-paint
   oracle: an edit through the Keyframes facet changes the subject's painted transform
   cadence; the nested-object `fromKeyframes ↔ serialized string` round-trip is asserted).

**Gate.** `proof:square-honest` **v2** (born-RED handoff — this band *authors the new red*, S's
green was the wrong assertion, per T.M's "a green gate can assert the wrong invariant"): the
rail mounts Controls+Keyframes+Timeline on square; an edit through the Keyframes facet changes
the measured painted-transform cadence; the old `hasPanel:false` assertion is **deleted** (grep
proves it gone). RED today because the current gate asserts the panel is absent.

**Edges.** **T.A** owns the *scene-correctness* half — the unit-honest `num()` normalizer at
the transformFunc boundary (curing the `"0pxpx"` CSSOM-discard, `useSquareDemo.ts:63-100`), the
real four-corner keyframes (±90px tour inside the ±110px spring envelope), and the
`{idle, drag, playback}` single-authority FSM with pose-capture takeover (lane 04 recs 1/2/5 =
SQ-T1/T2/T5). T.B3 restores the *panel/facility*; T.A makes *Play honest*. **They must land in
one lockstep motion** — the gate-inversion asserts paint that only T.A's honest Play produces.

**Lockstep.** The four gates above co-move with the DFA inversion (T.B2). Never leave
`proof:square-honest` asserting the collapse while the panel is restored (the born-RED handoff
the S.G2 collapse created — `T.md` §0.1 counts this among the ≥9 gates enforcing the rejected
state).

---

## T.B4 — Remove the surrounding pane: two floating GlassPanels on a naked rail; no chrome without content

**id** T.B4 · **size** S · **BORN-RED** (removal) **+ BORN-OWNER** (replacement composition — **OD-5**)
**lanes** 10 rec 4 · 04 rec 3 (SQ-T3)

**Scope.** VERDICT #7 ("remove the surrounding pane — it's superfluous"). Owner shot 07 is
three nested containers around two cards:
1. the outer `.controls-pane` `glass-wash rounded-card` subject-stage wrap
   (`ControlsPaneWrapper.vue:47`);
2. the `.controls-content` border/tint/radius block (`ControlsPaneWrapper.css:32-44`, the
   K.W4-F2 "ONE SUBTLE BORDER" cure);
3. the actual instruments (controls Card + playback ribbon).

Delete tiers 1 & 2. The rail becomes a plain column (`display:flex; flex-direction:column;
gap:0.75rem`) — **no border, no background, no radius, no glass on the column itself**. Exactly
**two floating instruments** remain, both glass-ui `GlassPanel` (`./glass-panel`): the facet
body + the playback ribbon; no cartoon offset-stamp shadows (the heavy-card read K.W4 cured).

**The K.W4-F2 ↔ T-#7 reconciliation (do NOT re-litigate — lane 10 §1.5):** K's cure targeted
two *heavy cartoon-stamped* cards competing; T's target is *light* glass cards that don't read
as heavy — which removes the need for the grouping wrapper. Ship floating light cards, zero
wrappers; **resurrect neither failed pole** (heavy twin cards / bordered enclosure).

**SQ-T3 folded in (no chrome without content):** the pane wrapper/sheet mounts **iff**
`surfacesFor(scene).length > 0`. Measured today (lane 04 F3): navigating to `#/square` at
375×812 renders a `.controls-pane-wrapper` at `{x:0,y:639.5,w:375,h:64}` with a grab handle
opening onto **zero content** — a mobile-sheet occlusion recurrence. Moot for square once T.B3
restores the triad, but the invariant must hold for `home` and any future empty-set scene.

**Gate.** `proof:panel-naked-rail` (born-RED — new): a computed-style probe between the rail
grid cell and the two cards finds **no** ancestor with a visible border or background
(border-alpha 0, no glass class on the column); card count in the rail == 2; and for every
DFA-empty scene, **zero** `.controls-pane-wrapper` nodes at 375×812 AND after a 1440→375 resize.
RED today because `.controls-pane` glass-wash + `.controls-content` border render, and the empty
square sheet mounts. **BORN-OWNER (OD-5):** the *replacement* composition (two floating
GlassPanels) is a taste disposition — #7 ruled the pane OUT (born-RED), but the two-panel
replacement needs the OD-5 sign-off before its appearance oracle is authored (T.M / lane 26).

**Edges.** **T.M** OD-5 owner token; **T.C** (the dock is the third chrome island — the pane
removal + dock recut settle the panel/dock seam together); the mobile `Sheet` (glass-ui
`./sheet`, sound — survives) becomes the ONE mobile container.

---

## T.B5 — Single-option elision as ONE model-cardinality rule (both docks read it)

**id** T.B5 · **size** M · **BORN-RED** · rides T.B1/T.B2
**lanes** 23 rec `T-PA-5` · 10 rec 5 · 30 recs 3 & 4 · 06 rec 1 (T-SPR-1)

**Scope.** VERDICT #17 ("when we have a page with ONE option… elide that intelligently…
Same for animations — not displayed if an animation only has ONE sub-animation") and #6
(the superfluous divider). The elision is **half-built, duplicated across three sites, and
substitutes a static label instead of eliding** — the three sites reading three projections
of one fact (lane 30 F3, verified):
- `ChromeDock.vue:116` `multipleControlTabs = allControlTabs.length > 1` → `<Select>`; else
  `:249-266` a **static label** `soleControlTab` (owner shot 14's second "Spring").
- `TransportDock.vue:58` `animationNames.length > 1` → `<Select>`; else `:109-114`/`:175-176`
  a **static name span**.
- `AnimationControls.vue:332-337` `isSingleSurfaceScene` — a *third* predicate over the same
  axis, read by calling `useSceneMachine()` directly.

Introduce **ONE** derived cardinality model, single-sourced on the DFA/machine projection
(`controlSurfaceDFA.ts` grows `hasSingleControlSurface`/`soleControlSurfaceTab`/
`hasSingleAnimation` — lane 30 rec 3), consumed identically by both docks:

```ts
const controlZone = tabs.length > 1 ? {kind:"select", tabs}
                  : tabs.length === 1 ? {kind:"inline", tab: tabs[0]}   // NO static-label dupe
                  : {kind:"absent"};
const channelZone = channels.length > 1 ? {kind:"select", channels} : {kind:"absent"};
```

`kind:"absent"` renders **no node and no flanking separator**; `kind:"inline"` renders the tab
body with zero dock chrome. Delete the static labels (`ChromeDock.vue:249-266`,
`TransportDock.vue:108-114,175-176`) and the per-dock `.length` arithmetic. Separators derive
from *inhabited* zones (cures the `TransportDock.vue:119` unconditional `dock-separator` that
sits next to an empty span on home — lane 30 F4, VERDICT #6).

**The cross-axis clause (lane 30 rec 4).** VERDICT's literal ask is a *cross-dock* fact: the
control-surface label is redundant **because the adjacent scene-select already says "Spring."**
The model exposes "is the control-surface identity a strict subset of the scene identity already
shown?" — resolved from the *same* DFA projection so the answer is **render nothing**, not a
demoted label. (lane 06 rec 1 T-SPR-1 is the spring proof surface: dock text → exactly one
"Spring".)

**Gate.** `proof:dock-elision` (born-RED — new): dock innerText on a 1-surface scene contains
**no duplicated adjacent token** (the measured `"Spring\nSpring"` → `"Spring"`, `"Easing\nEasing"`
→ `"Easing"`, both live today per lanes 10/30); zero `.dock-static-label` nodes render; no
leading/adjacent `dock-separator` on any scene census. RED today by measurement.

**Edges → T.C (do NOT duplicate).** Lane 08 `T-DOCK-1` owns the `DockSection`/`DockSeparator`/
`DockRail` grammar that *renders* `controlZone`/`channelZone`; this wave supplies the **model**
it reads. The separator-from-inhabited-zones rule is co-owned (the model guarantees "nothing to
separate"; the grammar draws the divider). **T.B10** feeds the same dock its ordered actions.

**Lockstep.** `proof:no-single-option-select` **currently ENFORCES the rejected state** — it
asserts the single-item case renders a **STATIC LABEL** (`scripts/proof-no-single-option-select.mjs`
header, verified: *"the single-item case renders a STATIC label"*). Deleting the label reds this
gate; **re-charter it in the same motion** from "single ⇒ static label present" to "single ⇒
NOTHING (no static-label node)". This is the lane-18 landmine: never green a gate by resurrecting
rejected UI, never leave the gate pointing at the deleted tell. (`T.md` §0.1 counts this gate
among the ≥9 enforcing the rejected state.)

---

## T.B6 — glass-ui-first panel kit; the register cure (KfPillTabs dies; de-red; type ramp)

**id** T.B6 · **size** M · **BORN-RED** (KfPillTabs deletion, glass-ui consumption) **+ BORN-OWNER** (register/accent — **OD-6**)
**lanes** 10 rec 6 + rec 7 · 04 rec 4 (SQ-T4, square is the proving scene)

**Scope.** VERDICT #18 ("wtf are most of these items? KfPillTabs.vue?? Why aren't these just
glass-ui components?") and #24 (fonts/sizes via glass-ui).

*The kit (born-RED, mechanical):*
- **Delete `KfPillTabs.vue` + `useKfPillTabs.ts`** (verified two call sites:
  `SpringSidebar.vue`, `AnimationControls.vue:74`). The fork exists only because glass-ui
  4.0.1's `SegmentedTabs` emits `aria-orientation` unconditionally on its `role=group` pill
  variant — a **named glass-ui gap**, filed to BG/BH (edge → **T.H**), not forked around. Any
  surviving strip is `SegmentedTabs` (`./tabs`); machine hosts use the dock Select, so the
  strip may not need to exist at all.
- Adopt the glass-ui census (4.0.1, real subpath exports verified — lane 04 F4, lane 10 §3.3):
  `LabeledInput`/`LabeledSelect`/`LabeledSlider`/`LabeledSwitch` (`./labeled-field`),
  `NumberField` (`./number-field`), `EasingPicker` (`./easing`), `GlassPanel` (`./glass-panel`),
  `ToggleChip variant="cell"` (`./toggle-chip`) for presets. **Delineate the genuine gaps**
  (do NOT fake): the draggable-diamond `KeyframeTimeline` and the Monaco keyframes editor stay
  demo-owned (glass-ui `GlassTimeline` is a segment *display*, not an editor) — BG/BH upstream
  candidates, not blockers. **SQ-T4** proves the kit on the square path (SegmentedTabs +
  LabeledInput/Select + EasingPicker + bare cards, no double-plate).

*The register (born-OWNER, OD-6):*
- Labels → glass-ui text stack (sentence case, `--muted-foreground`); mono confined to
  values/code; buttons → glass-ui `Button` defaults (no serif, no red — cures the red serif
  "Play" of shot 07). All panel interactive states ride `--primary`.
- `--accent-red` (`@/styles/style.css:346`) **exits the panel facility** — the red-kill is
  RULED (§3 OD-6), so the *removal* is born-RED, but the replacement accent ramp is OD-6
  owner-gated. The spring parameter-space heatmap → a perceptual oklch ramp anchored on
  `--primary`. Fix the light-theme black-blob sliders via `LabeledSlider` (subsumed by T.B7's
  Physics facet).

**Gate.** `proof:panel-glass-kit` (born-RED — new): `grep -r "KfPillTabs" demo/` = 0 (fork
gone); zero double-plate wrappers (no `Card` whose sole child is another `Card`); the panel's
tab switcher resolves to `SegmentedTabs`/the dock Select, never the fork. `proof:panel-register`
(**BORN-OWNER, OD-6**): a computed-style audit over the open panel — zero elements resolve
`--accent-red` in any consumed property; zero `font-family` resolutions to the display serif
inside the facility; label nodes resolve the text stack, value nodes the mono stack. The
register oracle is **not authored until OD-6 carries an owner token** (T.M / lane 26 rec 1).

**Edges.** **T.H** owns the glass-ui SegmentedTabs `aria-orientation` handoff (the fork's cause;
consolidated into T.H's gap ledger + version tripwire — lane 21 rec 1/2) and the consume-edge
re-pin. **T.D** owns the sitewide `--accent-red`/`--color-progress` token authority (the ONE
violet accent ramp + red→destructive-only); T.B6 *consumes* it panel-locally. **T.F** — the kit
lands inside the `instrument/` facility re-taxonomy.

**Lockstep.** KfPillTabs deletion co-moves its test + the a11y probe (`proof:brittleness`). The
de-red co-moves `proof:appearance-suffusion`, `proof:demo-fonts`, `proof:font-census` — re-anchor
them to the new register, don't let them green on the old red.

---

## T.B7 — Spring/easing bespoke sidebars DISSOLVE into channels + one scene facet

**id** T.B7 · **size** L · **BORN-RED** (the dissolve) **+ BORN-OWNER** (the parameter-field/stage aesthetic — **OD-6**)
**lanes** 10 rec 3 · 06 recs 2, 3, 6, 7

**Scope.** VERDICT #18/#25 — the spring scene *rebuilt bespoke inside its sidebar* the very
facility it walled off (the smoking gun for #25): `useSpringKeyframesEditor`
(`useSpringDemo.ts:140-151`) constructs a REAL two-way `CSSKeyframesAnimation` (`springEditAnim`)
and renders it through a hand-rolled "@keyframes (editable)" card while the shared editor sits
unused; `SpringSidebar.vue` (313 L) crams view-fork + params + heatmap + presets + a capped
keyframes editor into one pane because `CONTROL_SURFACES.spring = ['spring']` excluded the triad.

- **Restore the triad for spring (lane 06 rec 2, T-SPR-2).** With T.B2's derivation, spring
  exposes two real channels — **Sweep** (`springEditAnim`, its Keyframes facet IS the shared
  Monaco editor, killing the bespoke card; the 26rem scroll cap dies) and **Entry** (the
  compiled `@starting-style` animation from `useCompiledEntry`). Timeline binds the same
  animation. **`SpringSidebar.vue` + `useSpringPaneDrag.ts` (168 L bespoke pane-dragging) die.**
- **The view fork becomes data, not chrome (lane 06 rec 3, T-SPR-3).** "Live solver / Discrete
  transition" (`KfPillTabs`, `SpringSidebar.vue`) is exactly "which animation is on stage" —
  register `@starting-style` as the SECOND channel beside `SpringProgress`; the transport
  Select forks the stage (`SpringScene.vue`'s view ref keys off selection). The pill strip
  vanishes without replacement — the same elision law as T.B5 running in the pluralization
  direction (chrome appears when data pluralizes).
- **ONE parameter-field instrument (lane 06 rec 6, T-SPR-6).** Merge sliders + heatmap +
  preset grid into a single Physics *scene facet*: a compact axis-labeled canvas with the four
  canonical presets as clickable named points in (response, ζ) space (`springPresets.ts:17-41`),
  a live marker, two `LabeledSlider`s below for precise entry. The four per-frame preset-cell
  ball painters + the standalone ALL-CAPS legend die — **registered panel painter census drops
  5 → 0.**
- **Easing → Sweep channel + Curve facet (lane 10 rec 3).** One real `CSSKeyframesAnimation`
  on the preview target whose `timingFunction` is the edited easing (Controls-facet
  duration/direction edits drive it — honest by construction); the curve editor becomes the
  **Curve** scene facet.
- **Readouts ride glass-ui registers (lane 06 rec 7, T-SPR-7 — the panel/register slice).**
  `.spring-readout-primary`/badge scoped CSS (`SpringTarget.vue:291-298`) → `MetricStack` +
  `StatusDot`; scoped type CSS shrinks to placement.

**Gate.** `proof:spring-easing-facility` (born-RED — new): all three triad tabs reachable on
spring AND easing; a per-stop edit in the Keyframes tab persists and re-shapes the painted
stage sweep; the transport Select on spring lists 2 channels and selecting flips
SpringTarget ↔ StartingStyleTarget; `grep -r "SpringSidebar\|KfPillTabs\|useSpringPaneDrag"
demo/scenes` = 0; registered panel painter count on spring == 0. RED today (the bespoke sidebar
+ single `['spring']` surface + 5 painters are live). **BORN-OWNER (OD-6):** the parameter-field
composition + the stage aesthetic ("the laboratory bench") are taste dispositions — those
oracles wait on the OD-6 token.

**Edges.** **T.E** owns the *stage de-cluttering* half of T-SPR-7 — the `GestureLegend` spring
mount + helper paragraph + section captions die under T.E's fleet-wide gesture-legend/caption
prune (VERDICT #8/#11); the derby stays a discovered egg (`useDoubleTap`,
`SpringTarget.vue:250-256`). **T.D** owns the `--color-progress`→green un-red token flip (spring
is its most-saturated proof surface — lane 06 F7). **T.A** owns easing/spring stage correctness
+ the autoplay contract. **T.M** OD-6 token gates the aesthetic oracle.

**Lockstep.** The bespoke-sidebar gates guard exactly what dissolves — `proof:easing-sidebar-
normalized`, `proof:easing-sidebar-minimal`, `proof:easing-stage-is-ball`, `proof:spring-slider-
continuous`, `proof:spring-heatmap` (all verified live). Each must be **re-chartered onto the
facility or retired as feature-coupled** (a T.M concern: "feature-coupled gate retirement") in
the same motion — never leave a gate asserting the sidebar it now describes a deleted surface.

---

## T.B8 — Machine single-writer: finish the D12 sweep; collapse the adapter dual-family + play-truth back-channels

**id** T.B8 · **size** M · **BORN-RED** · rides T.B1
**lanes** 30 rec 1 · 23 rec `T-PA-6`

**Scope.** The codebase runs **two playback-mutation disciplines** for one machine, split by
scene family with no comment claiming it deliberate (lane 30 F1, verified). The D12 "shadow
playback authority" sweep was declared complete for the raw-rAF scenes (each carries an explicit
D12-cure comment — `useSpringDemo.ts:165-169`, `useSequenceDemo.ts:49-53`,
`useMotionPathDemo.ts:62-64`, `useEasingDemo.ts:66-69`) but **`useAnimationGroupPlayback.ts:19`
is the untouched 5th carrier** — `const isPlaying = ref(getAnimationGroup().playing())`, the
exact shape the sweep named and deleted four times, with zero D12/shadow comment. Its
`toggleAnimationGroup`/`onScrubStart`/`onScrubEnd` call `animationGroup.play()/.pause()/.toggle()
/.resume()` **directly**, then only *emit* — correctness is "an accident of two independent
idempotency guards happening to agree" (the arming-audit class, recurring).

Finish the sweep:
- Delete the private `isPlaying` ref; project it `computed(() => machine.status.value ===
  "playing")` via `useSceneTransport`; route `toggleAnimationGroup`/`onScrubStart`/`onScrubEnd`
  through `machine.dispatch({type:"PLAY"|"PAUSE"|"SCRUB"})` — cube/amiga/square the same way
  easing/spring already do. **`createGroupAdapter` becomes the ONLY code path that touches
  `AnimationGroup` playback methods.** Keep per-child selection/scrub (`findAnimationGroupObject`,
  `sliderUpdate`, `cycleAnimation`) as-is — only the whole-group play/pause axis unifies.
- This **closes the scrub-persistence gap for free** (lane 30 F1: no group scene ever
  dispatches `SCRUB` — verified, only `useSequenceDemo.ts:284,347` do — so cube/amiga/square
  persist scrub *coarser*, refreshed only at `captureActive()`/`NAVIGATE`-away).
- **Collapse the adapter dual-family (T-PA-6).** With channels painting, build `playback` FROM
  the channels uniformly (a channel is engine-clocked or progress-scalar — the adapter reads the
  channel, not a per-scene choice). Re-evaluate `machinePlaying`
  (`AnimationControlsGroup.vue:125-140`) and the S.A0 empty-snapshot special-case
  (`scenePlaybackAdapters.ts:63-84`) now that `started` reflects a channel that paints on tick 0
  — turning the S.A0 queue guarantee from *incidental* to *structural*. **Keep**
  `createGroupAdapter`'s eight-field re-seat as the still-open engine `serialize()/hydrate()`
  born-RED handoff (`scenePlaybackAdapters.ts:10-13` — verified) — **do NOT invent a codec.**

**Gate.** `proof:no-shadow-playback-authority` (born-RED — new): no file outside
`scenePlaybackAdapters.ts` / the scene-owned rAF loops calls
`AnimationGroup.prototype.{play,pause,resume,toggle}` directly (grep — `useAnimationGroupPlayback.ts`
hits today); plus a test asserting a cube scrub (no play/pause bracket) updates
`useSceneMachine().perScene.cube.animations[...].t` **without** a `NAVIGATE`/`SUSPEND` between
(RED today — the direct-mutation path never dispatches SCRUB). Plus `proof:one-adapter`: a single
adapter builder consumes any `SceneFacility`; the per-scene "expose scenePlayback or fall back to
group" branch (`useSceneMachineShellBinding.ts:87-88`) = 0.

**Edges.** Rides **T.B1** (channels); hardens the S.A0 queue **T.B5**'s dock relies on. The
`serialize()/hydrate()` seam stays a library born-RED handoff (non-goal ring-fence, `T.md` §4).

**Lockstep.** Re-anchor `proof:control-surface-single-writer` and
`proof:scene-machine-irrefragable` to the unified discipline; `machinePlaying` is either removed
or justified by a failing throttled probe attached to the gate (never silently kept).

---

## T.B9 — One keyspace: collapse `superKey` into `SceneId`

**id** T.B9 · **size** M · **BORN-RED** · parallel (data-layer)
**lanes** 30 rec 2

**Scope.** Two independently-declared per-scene keyspaces with no mechanical link (lane 30 F2,
verified): the scene machine keys `perScene` by `SceneId` (`"cube"`, `scenes.ts`); the sibling
control/option stores key by `superKey` — a *second* constant per scene from each `<name>Keys.ts`
(`CUBE_SUPER_KEY = "Cube"`, verified; and for one scene a *total* divergence: `id:"compose"` vs
`COMPOSE_SUPER_KEY = "playground"`). Case diverges for every scene; the conflation has already
leaked into prose (`useSceneMachineRouterBinding.ts:49-50` comments "prune orphan superKeys"
while passing `SceneId`s). **Consequence: only one keyspace self-heals** — `gcOrphans` prunes
stale `SceneId` entries on boot; `controlOptionsStore`/`animationOptionsStore` have no per-key
GC, so a retired/renamed scene's `superKey` bucket sits in `localStorage` until the blunt 7-day
whole-store TTL.

- Retire the `<name>Keys.ts` `*_SUPER_KEY` constants; `controlOptionsStore`/
  `animationOptionsStore` key on the registry `SceneId` directly. Where a sub-key is genuinely
  needed (per-animation options in a multi-animation scene), derive `` `${sceneId}:${animName}` ``
  from the registry + live group — never a second hand-authored constant.
- Extend `gcOrphans` (or a shared `gcOrphans(validSceneIds, ...tables)`) to prune all three
  tables in one call. Migrate the one `compose`/`playground` stored bucket once via a dated
  one-shot script (rather than carrying the alias forever) — the exception becomes structurally
  impossible.

**Gate.** `proof:scene-superkey-single-source` (born-RED — new): no file declares a `*_SUPER_KEY`
constant (grep — 9+ hits today: cube/amiga/easing/spring/morph/motion-path/compose/… verified);
`getStoredAnimationGroupControlOptions`/`getStoredAnimationOptions` accept only a `SceneId` from
the registry's id set. RED today because every scene declares its own SUPER_KEY.

**Edges.** Independent of the facility waves (pure store/key layer); coordinates with **T.F**
(the single global-store registry) — this is the *reason* a superKey can drift, one level up
from lane 22's single-scene DRY findings.

**Lockstep.** The key-type change touches every scene's key import + both stores' key type;
migrate the persisted `compose`/`playground` bucket in the same commit that drops the alias so
no returning user's state orphans silently.

---

## T.B10 — An ordered transport-action model (play-first as data)

**id** T.B10 · **size** S · **BORN-RED** · parallel
**lanes** 30 rec 5

**Scope.** VERDICT #6's second clause ("the play button should be the first element") has **no
data-layer lever today** — `TransportDock.vue` renders persistent controls in fixed markup order
(name/select `:44-116`, separator, Reset `:121-128`, Clear-all `:130-137`, **then** Play
`:139-157`); nothing in `useSceneTransport.ts`/`usePlayActuation.ts` expresses "primary action,"
so reordering Play is a per-dock markup edit every redesign pays again. Expose an ordered model
off `useSceneTransport` (or a co-located `useTransportActions`):

```ts
{ primary: { kind:"play", … }, secondary: [ { kind:"reset" }, { kind:"clear" }, … ] }
```

so "play first" and any future reorder is a **data change**, consumed uniformly by whatever
dock-grammar component **T.C** lands on.

**Gate.** `proof:transport-action-order` (born-RED — new): a snapshot of the exposed action
array asserts `primary.kind === "play"`; the dock renders play from `actions.primary`, never a
hardcoded template position (grep: no play button emitted after Reset/Clear in template order).
RED today because Play is markup-last with no action model.

**Edges → T.C.** Lane 08 `T-DOCK-1` renders `primary` first (play-FIRST rail-core); this wave
supplies the *model*, T.C draws it. Additive to `useSceneTransport` — no consumer forced to
migrate before T.C consumes it.

**Lockstep.** When T.C re-renders the dock from `actions`, the `proof:dock-grammar` "first
interactive element is play" clause (lane 08 `T-DOCK-1`) and this model's snapshot must agree —
one source of order truth.

---

## Disposition of lane recommendations

Every "## T recommendations" item in the assigned lanes maps to a wave, a cross-band cross-ref
(owning band per `T.md` §1), or a scoped-out row. Zero silent drops.

### Lane 23 — panel/DFA/adapter architecture (ALL)
| Rec | Disposition |
|---|---|
| `T-PA-1` SceneFacility unification seam | **T.B1** (keystone) |
| `T-PA-2` delete `useContractAnimGroup` + square decoy; transport binds channels | **T.B1** (merged into the keystone per band guidance) |
| `T-PA-3` invert DFA table→derivation; fold conditional + triplicated metadata | **T.B2** |
| `T-PA-4` restore square's panel honestly; re-charter 3 inverted gates | **T.B3** |
| `T-PA-5` elision as single model-cardinality rule | **T.B5** |
| `T-PA-6` collapse adapter dual-family + play-truth back-channels | **T.B8** |

### Lane 10 — panel facility (ALL)
| Rec | Disposition |
|---|---|
| 1 THE HONEST GROUP — delete the placeholder host | **T.B1** |
| 2 THE UNIFORM FACILITY GRAMMAR — DFA inverts to derivation | **T.B2** |
| 3 SPRING/EASING reshaped as channels + one facet | **T.B7** |
| 4 REMOVE THE SURROUNDING PANE — two floating GlassPanels | **T.B4** |
| 5 SINGLE-OPTION ELISION at presentation | **T.B5** |
| 6 GLASS-UI-FIRST PANEL KIT — KfPillTabs dies | **T.B6** (kf side); glass-ui handoff → **T.H** |
| 7 PANEL REGISTER CURE — type ramp + de-red | **T.B6** (panel-local); token authority → **T.D** |

### Lane 06 — spring (assigned recs 2,3,6,7)
| Rec | Disposition |
|---|---|
| 2 T-SPR-2 restore the panel triad for spring | **T.B7** |
| 3 T-SPR-3 discrete transition becomes a second channel; pill fork dies | **T.B7** |
| 6 T-SPR-6 ONE parameter-field instrument | **T.B7** |
| 7 T-SPR-7 strip stage to instrument; readouts ride glass-ui registers | **T.B7** (readout/register half) + cross-ref **T.E** (gesture-legend/caption/stage-verbiage prune) + **T.D** (registers) |
| 1 T-SPR-1 dock single-option elision *(out of assigned scope; band guidance folds it in)* | **T.B5** |
| 4 T-SPR-4 KfPillTabs → SegmentedTabs (aria handoff) *(out of assigned scope)* | cross-ref **T.B6** (kf deletion) + **T.H** (glass-ui aria fix / ledger) |
| 5 T-SPR-5 un-red the motion accent *(out of assigned scope)* | cross-ref **T.D** (sitewide `--color-progress`/`--accent-red` token authority) |

### Lane 04 — square (assigned recs 3,4)
| Rec | Disposition |
|---|---|
| 3 SQ-T3 no chrome without content (pane/sheet mounts iff surfaces>0) | **T.B4** |
| 4 SQ-T4 glass-ui-first panel composition on square path | **T.B6** (square is the proving scene) |
| 1 SQ-T1 restore square editor triad with an honest Play *(out of assigned scope)* | **T.B3** owns the panel/gate half; the honest-Play FSM + normalizer + keyframes → **T.A** (edge) |
| 2 SQ-T2 de-annotate the stage *(out of assigned scope)* | cross-ref **T.A**/**T.E** (stage de-clutter, gesture legend) |
| 5 SQ-T5 de-Vue the hot path *(out of assigned scope)* | cross-ref **T.G** (perf hot-path) / **T.A** |

### Lane 30 — machine + transport suite (assigned recs 1,2,5)
| Rec | Disposition |
|---|---|
| 1 finish the D12 sweep onto `useAnimationGroupPlayback` | **T.B8** |
| 2 collapse `superKey` into `SceneId` | **T.B9** |
| 5 ordered transport-action model (primary/secondary) | **T.B10** |
| 3 single-source the elision predicate in the DFA *(folded by band guidance)* | **T.B5** |
| 4 cross-axis "is this label redundant" selector *(folded by band guidance)* | **T.B5** (the cross-axis clause) |

### Lane 21 — legacy sweep (assigned rec 3)
| Rec | Disposition |
|---|---|
| 3 replace the placeholder `AnimationGroup` with a `TransportSource` interface | **T.B1** (same cure; the channel `progress()`/`setProgress()` + `playback` IS the TransportSource contract) |
| 1 glass-ui-gap ledger + version tripwire *(out of assigned scope)* | cross-ref **T.H** |
| 2 retire `KfPillTabs` onto SegmentedTabs *(out of assigned scope)* | cross-ref **T.B6** (kf side) + **T.H** |
| 4 DRY the hot/cold readout throttle *(out of assigned scope)* | cross-ref **T.F**/**T.G** |
| 5 sweep `demo` `any` under a ceiling gate *(out of assigned scope)* | cross-ref **T.F** |
| 6 `proof:no-dead-export` + excise dead symbols *(out of assigned scope)* | cross-ref **T.F** |
| 7 de-defer/build the DM-22 named-selector resolution *(out of assigned scope; src, non-goal ring)* | cross-ref **T.S** |

### Charter conflicts / reconciliations spotted
- **K.W4-F2 ↔ VERDICT #7** (lane 10 §1.5): the K-era "ONE SUBTLE BORDER" cure and T's "remove
  the surrounding pane" are **not** contradictory — K targeted two *heavy cartoon* cards; T
  ships *light* glass cards that need no grouping wrapper. Recorded in **T.B4** so no impl agent
  re-litigates or resurrects either failed pole (heavy twin cards / bordered enclosure).
- **`proof:no-single-option-select` actively enforces the rejected state** (VERDICT #17): it
  asserts the single-item case renders a *static label* — the very substitution the owner
  rejected. **T.B5** re-charters it in lockstep (a `T.md` §0.1 "gate enforces the rejected UI"
  instance; the lane-18 landmine flagged explicitly).
- **Square panel restoration is split T.B3 (facility/gates) ↔ T.A (honest Play)** — the gate
  inversion asserts paint only T.A's normalizer/keyframes/FSM produce; flagged as a *must-land-
  together* lockstep, not a silent cross-band dependency.
- **The de-red is dual-owned** — the *removal* of `--accent-red`/`--color-progress` from the
  panel/spring is RULED (born-RED, T.B6/T.B7), but the *replacement* accent ramp is **OD-6**
  owner-gated (T.D authority). No conflict; the ownership line is drawn (kf consumes T.D's
  token).
