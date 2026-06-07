# Tranche H Deep Audit — Lane: a-demo-architecture

**Scope:** the demo shell's *structural spine* — `EditorShell`, the controls layout
(one-column), the dual dock (top/bottom, mobile-affixed), the scene-swap, the
responsive/mobile model. The gestalt that makes **D1 / D4 / D10** cohesive and
**seeds the H band structure**. Sibling lanes own the leaf depth
(`a-controls-sidebar` D1, `a-timeline-width` D4, `a-mobile-architecture` D10,
`a-scene-state-machine`/`a-store-architecture` D12, `a-perf-dock-lag`/`a-historical-dock`
D5/D9). This lane is the **load-bearing frame they all hang on.**

All anchors verified live (Vite dev server `:5174`, kf 4.1.0 + Tranche G, viewport
1440×900) and by source read on `tranche-h-dev`.

---

## A. The shell as it stands (the measured map)

The demo composes **three** layout authorities, and the friction in this band is
almost entirely the seams *between* them being under-specified:

1. **`app/App.vue`** (342L) — the scene SHELL: owns `ChromeDock` (top), `EditorShell`,
   the keyed `<Suspense>` scene host, and the scene/playback reconcile wiring
   (`useSceneRouter` + `useSceneSwap` + `usePlaybackSnapshot` + `useSceneGroupSync` +
   `useSceneTransition` + `useSceneUrl` — *six* colocated composables).
2. **`editor-shell/EditorShell.vue`** (181L) — the WORK-AREA shell: grid background,
   `HeaderRibbon`, start-screen overlay, the single `<main>`, and
   `AnimationControlsGroup`.
3. **`animation-controls/AnimationControlsGroup.vue`** (342L) → `ControlsPaneWrapper`
   (the sidebar) + `AnimationMenuBar` (the BOTTOM dock) + the timeline-expanded target.

So there are **already two docks** (top `ChromeDock`, bottom `AnimationMenuBar`, both
`GlassDock` instances — App.vue:2 + AnimationMenuBar.vue:17) and a left **sidebar**
(`ControlsPaneWrapper`). The desktop layout is a 3-column grid
(`AnimationControlsGroup.vue:5`):

```
grid-cols-[var(--controls-pane-width)_1fr_1fr]   /* 400px | 1fr | 1fr */
```

Measured live on `/#/cube` (controls closed, no selection):
`grid-template-columns: 1353.59px 0px 0px` — the `1fr 1fr` tracks **collapse to zero**
when the pane is hidden, and the stage spans `col-1..4` to stay centred
(AnimationControlsGroup.vue:54-57). This is a *clever workaround for a structural
problem*: the grid's right two tracks exist only to size the centred stage, never to
hold content. **The 3-track grid is vestigial** — it encodes "sidebar + everything-else"
in three tracks where two would do, and the collapse-to-zero dance + the
`col-start-1 col-end-4` stage span is the toll. This is the root of why D1/D4/D10 feel
incohesive: there is no single named layout that says *sidebar-rail | stage | bottom-rail*.

---

## B. The findings

### F1 — D1: the controls sidebar packs TWO fields per row (the subgrid auto-flow) · SHIP-in-H

**Anchor (root cause, live-confirmed):** `AnimationControlsControls.vue:4` —
`CardContent` is `grid grid-cols-[auto_1fr]` (a single **label|field** pair of tracks).
The panel rows are `grid-cols-[subgrid]` (`AnimationControlsControls.vue:6,9,294`), so
they inherit those 2 tracks. Each field is a **self-contained `display:block`
`.labeled-field`** (glass-ui `LabeledInput`/`LabeledSelect`, label-OVER-field) that
occupies **one** subgrid cell. Auto-flow therefore packs **two fields per row**:

> Live `getComputedStyle` of `.panel-content` children: `[duration][delay]`,
> `[iterations][direction]`, `[fill mode][easing]` — each `.labeled-field` is
> `display:block`, `grid-column: auto`. Exactly the two-column packing the user reports.

The defect report's read ("subgrid") is the *mechanism*; the *cause* is that
`LabeledInput` is a vertical (stacked) field, so the `auto 1fr` track-pair is the wrong
substrate — it was designed for a horizontal `label | field` row, but the field
component stacks its own label, so the second track is free real-estate that auto-flow
fills with the next field.

**Gestalt fix (one motion, not a width hack):** the controls card is **one column of
full-width stacked fields**. Drop the `[auto_1fr]` + `subgrid` pairing entirely; the
panel becomes a plain single-column flow (`grid` / `flex flex-col` with a gap). The
`Separator` (`col-span-2`) and the "advanced" row (`col-span-2`) that currently
*fight* the 2-track grid become natural full-width children — their `col-span-2`
escapes vanish (KISS/DRY). This is **isomorphic** to glass-ui's own
labeled-field stacking idiom; no new tokens.

> **Note the coupling to F4:** once the sidebar is one column, its *natural* width is
> the field width, which is what `--controls-pane-width` (400px,
> design-idioms.css:106) should single-source. Do F1 and F4 in the same band so the
> rail width and field width co-derive.

**Falsifiable instrument:** `proof:controls-one-column` — a layout test (vitest +
jsdom or a Playwright visual lock) asserting that in the open controls pane every
`.labeled-field` shares the same `getBoundingClientRect().left` (single column) and
no two fields share a `top` (one per row). Gate: zero same-row field pairs.

*(Leaf depth — exact markup + the `col-span-2` cleanups — is `a-controls-sidebar`'s
charge; this lane fixes it as the sidebar-rail track of the unified grid.)*

---

### F2 — D4: the FULL-WIDTH element is the *expanded timeline*, not the PlaybackRibbon · SHIP-in-H

**Anchor:** the PlaybackRibbon is **already sidebar-width** — it teleports to
`#controls-ribbon-target` (`AnimationControlsControls.vue:154`), which lives in
`RibbonBar.vue:7`, *inside* `.controls-content` (the sidebar, col-1). So D4 as literally
worded ("PlaybackRibbon full-width") is **already satisfied** for the ribbon.

The genuinely full-width element is `#timeline-expanded-target`
(`AnimationControlsGroup.vue:63-72`): `col-span-full row-start-3` — it spans the entire
3-col grid when the timeline expands. *That* is the full-width scrubber the user sees.
The bottom `AnimationMenuBar` is a `fit-content` dock centred in a full-width fixed
band (AnimationMenuBar.vue:2-8), so it is *not* full-width either.

**Gestalt fix:** in the unified grid (F6), the timeline-expanded surface becomes the
**bottom-rail track aligned to the sidebar-rail track** — `grid-column: 1` (the
sidebar-rail column), not `col-span-full`. The scrubber then reads as a vertical
extension of the controls rail, the same width as the sidebar — which is precisely the
"same width as the controls sidebar" the user asks for. No magic numbers: it inherits
the rail track width.

**Falsifiable instrument:** `proof:timeline-rail-width` — Playwright: expand the
timeline, assert `#timeline-expanded-target.getBoundingClientRect().width ===
.controls-content.width` (±1px). Gate on equality.

*(Leaf depth = `a-timeline-width`.)*

---

### F3 — D12: there is NO formal scene+playback state machine; the corruption is structural · SHIP-in-H (architecture seed)

**This is the keystone finding of the band — D1/D4/D10 are layout, but D12 is the
*behavioral* spine, and the layout redesign must not re-litigate it.**

**Anchors (the hand-rolled state choreography):**
- `App.vue:198-211` — `activeSceneComponent`/`activeSceneKey`/`activeSceneProps`
  **alias home AND cube to the same CubeScene with `key='cube'`**. Home is not a real
  state; it is "cube with the loader hidden + start-screen shown". This aliasing is the
  source of the "impossible routed state": the route says `home`, the store super-key
  resolves `__home__`, but the mounted component + its group are `Cube`'s.
- `useSceneGroupSync.ts:44-97` — a watcher that **fires twice per switch** and uses an
  `isStableFire = currentSuperKey === superKey` *heuristic* (line 54) to decide which
  fire restores playback. Plus a `nextTick` autoPlay clear (line 92-94). This is a race
  dressed as a codec.
- `usePlaybackSnapshot.ts:49-84` — `restoreGroupPlaybackState` imperatively pokes
  `anim.managed/started/reversed/iteration/startTime/t/paused/pausedTime` and calls
  `group.resume()`. Reconstructing the engine's internal clock by hand is exactly where
  "play/pause not restored/suspended" leaks.
- `scenePlayback.ts:16` — playback snapshots live in a **bare non-reactive `Map`**,
  while control options live in a vueuse `createGlobalState`+`useStorage`
  (`controlOptionsStore.ts:35`). **Two storage models, two lifetimes, manually kept in
  sync.** The split is the corruption surface.
- `useSceneRouter.ts:54-59`, `App.vue:256-304 (switchScene)` — switching also strips
  `?state=`, branches on `wasHome`, pokes `getStoredAnimationGroupControlOptions("Cube")`
  by literal string. Scene-switch logic is spread across router + App + three
  composables with literal super-keys.

**Live confirm of the failure class:** loading bare `/` redirects to `/#/cube`
(useSceneRouter.ts:21-31 restores localStorage scene), and the home↔cube alias means
the "home" hero state and the "cube" playing state share one component instance and one
group — so a switch sequence (easing→cube→back) cannot deterministically restore
play/pause: the suspend (`saveCurrentPlaybackState`, App.vue:262) reads
`currentAnimationGroup` *before* `rawSwitchScene` mutates the route, but the restore
(`useSceneGroupSync`) runs on the *second* watcher fire after a full unmount/remount,
gated by a string-equality heuristic. Any reorder of reactive flushes desynchronizes it.

**Gestalt fix (the irrefragable machine the user explicitly asks for):** model the demo
as a **formal, declarative state machine over two orthogonal axes**:
- **scene axis:** `home | cube | amiga | square | easing | spring | sequence | path |
  discrete` — driven by the router (single source: the route IS the scene state; kill
  the localStorage scene-restore *and* the home↔cube alias — home becomes a real,
  distinct state with no group, cube a real state with its group).
- **playback axis (per scene):** `idle → playing ⇄ paused → (suspended)` — where
  `suspended` is the saved snapshot entered on scene-LEAVE and exited (`restore`) on
  scene-ENTER.

Recommendation on the *facility* (the user asked us to evaluate + recommend):
**vueuse `createGlobalState` + an explicit reducer, NOT Pinia, NOT XState-as-dep.**
Rationale, MEASURE-FIRST: the demo already runs `createGlobalState`+`useStorage`
(controlOptionsStore.ts) and `@vueuse/core ^14.3.0` is the only state dep — adding Pinia
(a second reactive store system) or XState (a 40kb runtime) violates the
no-new-god-dep / KISS spine for a demo. The *machine* is small and finite; a
**single typed reducer** (`transition(state, event) → state`) inside one
`createGlobalState` store, with the per-scene playback snapshot **moved INTO that
reactive store** (collapsing the bare `Map` of `scenePlayback.ts` and the
`createGlobalState` of `controlOptionsStore.ts` into ONE store keyed by scene), is the
idiomatic gestalt. The engine already owns the hard part: `SpringProgress`/`Animation`
have suspend/resume; the demo store needs only to hold `{ scene, perScene: { playback,
controls } }` and emit declarative transitions. The imperative clock-poking in
`restoreGroupPlaybackState` should reduce to **one engine call** (the engine exposing a
single `serialize()`/`restore(snapshot)` on `AnimationGroup` — *that* half is a
**value.js/engine-HANDOFF** candidate: see F8).

**Disposition nuance:** the *store unification + reducer* is SHIP-in-H (demo-side). The
*engine snapshot/restore API* is **value.js-HANDOFF / engine-RECORD** (so the demo stops
reconstructing the clock by hand). Sequence H so the store lands first against the
existing imperative restore, then swaps to the engine API when it ships.

**Falsifiable instrument:** `proof:scene-machine-irrefragable` — a Playwright matrix
test driving every ordered pair of scene switches × {playing, paused} and asserting,
after each round-trip A→B→A: (a) the route, super-key, mounted component, and group are
mutually consistent (no impossible routed state); (b) playback state is byte-identical
to before the round-trip (suspend→restore is an identity). Gate: 100% of the
(scenes² × 2) cells are identity-preserving.

*(Leaf depth on the machine + store split = `a-scene-state-machine` + `a-store-architecture`;
this lane's job is to mandate the machine as the spine the layout sits on so the redesign
doesn't reintroduce the home↔cube alias.)*

---

### F4 — The 3-track grid is vestigial; collapse to a named 2-rail + stage layout · SHIP-in-H (the spine)

**This is the structural transposition that makes D1, D4, D10 cohesive.**

**Anchor:** `AnimationControlsGroup.vue:5` (`grid-cols-[var(--controls-pane-width)_1fr_1fr]`)
+ `:54-57` (stage spans `lg:col-start-1 lg:col-end-4`, i.e. it ignores the tracks and
overlays them) + `ControlsPaneWrapper.vue:7` (pane is `col-start-1 row-start-1`,
`z-controls`, overlays the stage). The grid pretends to be three columns but actually
behaves as **"a centred stage with a left rail overlaid on top of it."** The `1fr 1fr`
split exists only so the geometric centre of the stage falls where the designer wanted —
a fragile encoding (measured: it collapses to `0px 0px` when the pane is closed).

**Gestalt fix — one named layout, the "rail · stage · rail" frame:**

```
.demo-shell {
  display: grid;
  grid-template-columns: [rail] var(--rail-width) [stage] 1fr;
  grid-template-rows:    [top] auto [stage] 1fr [bottom] auto;
}
```

- **`--rail-width`** single-sources the controls SIDEBAR width (F1), the
  timeline-expanded scrubber width (F4/F2), AND the mobile bottom-sheet width. ONE token,
  replacing `--controls-pane-width` (400px) + the `col-span-full` timeline + the
  bottom-band centring. This is the DRY core: the sidebar, the scrubber, and the mobile
  drawer are **the same rail** in three positions.
- The **stage** is its own track — no overlay, no collapse-to-zero, no
  `col-start-1 col-end-4` hack. When the pane is closed, the rail track animates to `0`
  via the existing `grid-template-columns` transition (the same idiom
  `ControlsPaneWrapper.vue:147-155` already uses for *rows*), and the stage reflows
  smoothly — the cube no longer needs to span four tracks to stay centred.
- The **top rail** = `ChromeDock`; the **bottom rail** = `AnimationMenuBar` +
  timeline. Both already exist as two `GlassDock`s — this layout just gives them
  declared grid tracks instead of `position: fixed` + manual `--work-area-*-offset`
  exclusion-zone math (style.css:95-130 is an entire algebra of
  `--work-area-vertical-bias-top/bottom` + `--dock-menubar-reserve` whose *only* job is
  to keep fixed docks from occluding the centred stage — a grid with real top/bottom
  tracks **deletes that algebra**, MEASURE-FIRST: ~40 lines of token cycle-avoidance
  commentary in style.css disappear).

**Why this is the seed for H's band structure:** every other H finding plugs into a
named slot of this frame:
- D1 sidebar → `[rail]` track, one column.
- D4 scrubber → `[rail][bottom]` cell, rail-width.
- D5/D9 dock → `[top]`/`[bottom]` tracks (glass-ui-HANDOFF for the dock internals; the
  *placement* is ours).
- D10 mobile → the **same** grid with `grid-template-rows: [top]auto [stage]1fr
  [bottom]auto` and `grid-template-columns: 1fr` (rail becomes a bottom-sheet over the
  bottom track) — see F5.
- D7 hero → the `[stage]` track's empty state (start-screen overlay stays, but now
  centred in a *real* stage box, not a `w-screen h-0` absolute hack —
  EditorStartScreen.vue:3).

**Falsifiable instrument:** `proof:demo-shell-grid` — assert the shell root resolves to
exactly the named 2-col × 3-row template; assert `--rail-width` is the *only* width
token referenced by the sidebar, the expanded timeline, and the mobile sheet (grep gate:
zero occurrences of `--controls-pane-width` and `col-span-full`/`col-end-4` in the
controls tree after the transposition).

---

### F5 — D10: mobile must be ONE page, affixed top+bottom docks, stage = background · SHIP-in-H

**Anchor (today's mobile is a stacked-rows compromise, not a single page):**
`AnimationControlsGroup.vue:5` mobile branch is
`grid-cols-1 grid-rows-[auto_1fr_auto]` — controls-pane row (auto), stage row (1fr),
timeline row (auto), with the bottom menubar `position: fixed`
(AnimationMenuBar.vue:6). `ControlsPaneWrapper.vue:137-165` makes the mobile pane a
`grid-template-rows: 0fr→1fr` collapsible band that **pushes the stage down** (it is a
flow row, `row-start-1`, above the `row-start-2` stage). So on mobile the controls are a
*top accordion that displaces the cube*, not an overlay over a full-bleed stage. That is
the inverse of D10's ask.

**Gestalt fix (the same frame as F4, re-parameterized):** mobile is the **identical
rail·stage·rail grid** with:
- `grid-template-columns: 1fr` (no side rail),
- `grid-template-rows: [top]auto [stage]1fr [bottom]auto`,
- the **stage track fills the viewport as the background** (the cube/amiga/etc.) — it is
  the `1fr` middle row, full-bleed,
- the **top dock** (`ChromeDock`) and **bottom dock** (`AnimationMenuBar`) are the
  `[top]`/`[bottom]` tracks, *affixed* (they are grid tracks, so they reserve space
  without `position:fixed` occlusion math),
- the **controls** become a **bottom SHEET over the stage** (overlaying the `[stage]`
  track from the `[bottom]` edge), NOT a top accordion that displaces the stage —
  driven by the *same* `--rail-width`-as-sheet-width and the springy collapse from D13.
- the page "contextually changes by mode" because the `[stage]` track IS the scene host
  (the keyed `<Suspense>` of App.vue:125) — switching scene swaps the background.

This is **byte-cohesive with desktop**: desktop rail = left column; mobile rail = bottom
sheet. One grid, two media parameterizations — the `@media (min-width:1024px)` /
`@media (max-width:1023px)` split in `ControlsPaneWrapper.vue:168-246` becomes a clean
*track-placement* swap, not two different layout philosophies.

**D13 coupling:** the mobile drawer collapse/expand currently rides
`grid-template-rows: 0fr↔1fr` with `--duration-panel` easing
(`ControlsPaneWrapper.vue:148-154`) — a *duration/easing* transition, NOT a spring, and
"too slow." The user wants it springy + fast → **dogfood `SpringProgress`** (the engine
already drives the scene-swap dissolve this exact way, `useSceneSwap.ts:45-50`). The
bottom-sheet open/close should drive its transform via a `SpringProgress` ramp (iOS
"snappy" preset), not a CSS `transition`. *(Leaf depth = `a-mobile-architecture` + the
D13 spring item; this lane mandates the single-grid model that lets the sheet exist.)*

**Falsifiable instrument:** `proof:mobile-single-page` — Playwright at 390×844:
(a) the scene host (`.scene-host`) bounding box === viewport (full-bleed background);
(b) `ChromeDock` and `AnimationMenuBar` are both affixed (their rects stay constant on
scroll / are within `[top]`/`[bottom]` reserved bands); (c) opening controls overlays
(does NOT shift) the stage box. Gate: stage box unchanged ±0px on controls toggle.

---

### F6 — App.vue carries SIX scene composables + the home↔cube alias; decompose by the machine, not by file · MEASURE-FIRST → SHIP-in-H

**Anchor:** `App.vue:168-321` imports and wires `useSceneRouter`, `useSceneUrl`,
`usePlaybackSnapshot`, `useSceneSwap`, `useSceneTransition`, `useSceneGroupSync` —
plus `switchScene` (App.vue:256-304, the home/cube branching) and the inline
`onPlayStateChange`/`onStartStateChange` codecs (App.vue:224-253). App.vue is 342L and
is the *de-facto* scene state machine, spread across six composables held together by
ordering assumptions (the comments at App.vue:109-118, 230-237, 244-253 are *each*
documenting a fragile-ordering workaround).

This is **NOT a god-module-by-length** problem (it is already decomposed into
composables) — it is a **decomposed-along-the-wrong-axis** problem. The six composables
are split by *mechanism* (router, url, swap, snapshot, transition, sync) but the *state*
is the cross-cutting concern that leaks between all of them. MEASURE-FIRST: the
fragility is in the SEAMS (the `isStableFire` heuristic, the `nextTick` clears, the
double-watcher), not in any one file's size.

**Gestalt fix:** once F3's formal machine + unified store land, the six composables
collapse to **two**: `useSceneMachine` (the router-bound reducer: scene + per-scene
playback, owning suspend/restore declaratively) and `useSceneSwap` (the pure visual
cross-dissolve, already clean — `useSceneSwap.ts`). `usePlaybackSnapshot`,
`useSceneGroupSync`, the inline `switchScene`/`onPlayStateChange` all fold INTO the
machine (their imperative pokes become reducer transitions). `useSceneUrl` +
`useSceneRouter` merge (the route IS the scene state). App.vue drops from 342L to a thin
template + machine-bind.

**Falsifiable instrument:** `proof:app-shell-thinness` — assert App.vue `<script>` has
≤2 scene composables imported and contains zero `nextTick`/`isStableFire`-class ordering
workarounds (grep gate). Pair with F3's `proof:scene-machine-irrefragable`.

---

### F7 — D7 hero + D5/D9 dock + D6 dots: where they sit in the frame (cross-lane stitch) · RECORD / cross-ref

These are owned by sibling lanes; recorded here only as **slots in the F4/F5 frame** so
the shell redesign reserves their space:

- **D7 hero** (`a-hero-typography`): `EditorStartScreen.vue:3` is
  `absolute left-0 top-0 ... w-screen h-0 mt-28` — an absolutely-positioned overlay
  *floating over* the (non-existent in home state) stage. In the F4 frame it becomes the
  **`[stage]` track's empty-state content** — centred in a real box, free to use the φ-ladder
  `text-display`/`text-title` at full size (style.css:41-54, Instrument Serif). The
  current `h-0` + `mt-28` magic offsets vanish once it lives in a real stage cell.
- **D5/D9 dock** (`a-perf-dock-lag`, `a-mbabb-popover`, `a-historical-dock`): the
  `@mbabb` popover is a reka `DropdownMenu` inside `ChromeDock`'s `#items` slot
  (App.vue:18-72) — its non-opening is tied to the dock's `keepOpen`/`release` mutex
  (ChromeDock.vue:99-102) and is **glass-ui-HANDOFF** (the dock is being reworked in
  glass-ui's AW tranche). The frame's job: keep `[top]` a real reserved track so the
  portalled popover (`z-modal`, App.vue:22) has stable anchor geometry.
- **D6 typing dots** (`a-typing-dots`): the hero ellipsis `:text="..."`
  (EditorStartScreen.vue:18-19) splits to `["..."]` — ONE word — through
  `AnimatedText.vue:62` (word-granular split), so `.dot-fade` (AnimatedText.vue:93)
  applies to a single span with `duration = text.length*0.2 + 2 = 2.6s`. The break is
  that the word-granular refactor (F.W16) left the `.dot-fade` keyframe a whole-span
  opacity pulse, not the per-dot cascade it reads as. Owned by `a-typing-dots`; the frame
  just hosts the hero. **RECORD** here.

---

### F8 — Engine seam for D12: `AnimationGroup.serialize()/restore()` · value.js/engine-HANDOFF

**Anchor:** `usePlaybackSnapshot.ts:49-84` reconstructs an `AnimationGroup`'s clock by
hand (`anim.startTime = now - snap.t; anim.paused = true; anim.pausedTime = now;` …) and
`group.transformFramesGrouped(now)`. The demo should not know the engine's internal
clock representation. The idiomatic gestalt: the **engine** owns
`group.serialize(): GroupSnapshot` + `group.restore(snap)`, and the demo's suspend/restore
(F3) reduce to two calls. This is the engine half of the irrefragable state machine.

**Falsifiable instrument:** `proof:group-snapshot-identity` (engine test) —
`g.restore(g.serialize())` is an identity on `{t, reversed, iteration, playing, started}`
for every animation; round-trips through JSON. Gate: identity.

---

## C. Dispositions (band roll-up)

| # | Defect | Finding | Disposition |
|---|--------|---------|-------------|
| F1 | D1 | sidebar two-fields-per-row = `[auto_1fr]`+subgrid auto-flow | **SHIP-in-H** |
| F2 | D4 | full-width is the *expanded timeline*, not the ribbon | **SHIP-in-H** |
| F3 | D12 | no formal scene+playback machine; 2 storage models + double-watcher race | **SHIP-in-H** (store+reducer) · engine API **HANDOFF** |
| F4 | D1/D4/D10 | 3-track grid vestigial → named `rail·stage·rail` + one `--rail-width` | **SHIP-in-H** (the spine) |
| F5 | D10/D13 | mobile single-page, affixed docks, stage-as-background, springy sheet | **SHIP-in-H** |
| F6 | D12 | App.vue's six composables split by mechanism not state | **MEASURE-FIRST → SHIP** (folds into F3) |
| F7 | D7/D5/D9/D6 | hero/dock/dots slots in the frame | **RECORD / cross-ref** (sibling lanes own) · dock = **glass-ui-HANDOFF** |
| F8 | D12 | `AnimationGroup.serialize()/restore()` | **value.js/engine-HANDOFF** |

## D. The one-paragraph gestalt (the seed for H)

**Collapse the demo shell to a single named `rail · stage · rail` grid whose rail width
is one `--rail-width` token, and bind scene+playback to one formal reducer-over-vueuse
state machine that makes home and cube *distinct* states (killing the home↔cube alias)
and makes suspend/restore a declarative identity.** Every Tranche-H demo finding then
plugs into a *named slot*: D1 = the rail's one-column controls; D4 = the rail-width
timeline; D10 = the same grid with the rail as a springy bottom-sheet over a full-bleed
stage; D7 = the stage's empty state in φ-typography; D5/D9 = the top/bottom dock tracks
(glass-ui-HANDOFF). The current layout's collapse-to-zero `1fr 1fr` tracks, the
`col-span-full`/`col-end-4` stage-span hacks, the `--work-area-*-bias` occlusion algebra,
and the `isStableFire`/`nextTick` watcher race are all **deleted** by this one
transposition — fewer lines, one source of truth per axis, MEASURE-FIRST elegance.
