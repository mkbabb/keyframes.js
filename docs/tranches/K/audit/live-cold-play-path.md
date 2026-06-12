# K AUDIT — the COLD play path (U-K2 / U-K3 / U-K5 + U-K1)

**Lane:** live-cold-play-path · **Date:** 2026-06-11 · **Tree:** `tranche-j-dev @ 4f1fc4c` (== master, Tranche J closed).
**Method:** built dist (`dist/gh-pages`, mtime 23:39 — post-audit), driven via `scripts/lib/demo-driver.mjs withPage`,
chromium 1440×900, `KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/glass-ui`, `localStorage.clear()` before every probe
(the genuine COLD context). Probe scripts committed beside this doc:
`probe-cold-play.mjs`, `probe-cold-vs-warm.mjs`, `probe-cold-precise.mjs`, `probe-trace-cold.mjs`, `probe-dock-default.mjs`.
Every claim cites file:line + observed output (inv ε).

---

## VERDICT

The orchestrator's triage (a) is CONFIRMED in symptom but its **suspect is DISPROVEN**: the cold play path IS broken,
but **the J.W7c U4 conditional-select deletion did NOT cause it**. U4 was a pure `v-if` template gate on the dock select
(`TransportDock.vue:39`) and touched nothing in the play-driver chain (git diff `377eb3e`, below). The real defect is a
**pre-existing Tranche-H-W1 latent race** between the machine's `PLAY` effect and the cube group binding: on the cold
home→cube handoff the engine group is `play()`-ed by NEITHER driver, so the machine records `playing:true started:true`
over an EMPTY/unstarted `AnimationGroup`, the subject freezes, the slider parks at 0, and the rainbow never goes vivid.
A SECOND click (now the group is bound) plays normally — the tell that the FIRST gesture was structurally lost.

The gates never caught it because (1) they pre-seed `{isControlsPanelOpen:true}` and (2) their "cube draw loop is LIVE"
oracle counts the `.idle-hover` CSS bob — which runs **at rest** — as motion (41 distinct transforms with NO play).

---

## P0-1 — COLD home-rainbow-play → cube FREEZES (subject static, slider stuck at 0, rainbow not vivid)

**Repro (`probe-cold-play.mjs`, `probe-cold-precise.mjs`):** fresh context, land on `#/` hero, press the bottom-dock
rainbow play once (real pointerdown→up), sample for ~1.9 s.

```
HOME: hasStartScreen:true  hasCube:true  hash:#/  rainbowCount:2
POST-CLICK SERIES (every 120ms, 16 samples):
  {t:120, hash:#/cube, slider:"0", isPlaying:false}
  ... (identical) ...
  {t:1920, hash:#/cube, slider:"0", isPlaying:false}
DISTINCT cubeTransform=1  slider=1  finalHash=#/cube
```

The navigation works (`#/` → `#/cube`) but the slider NEVER advances (distinct=1, value `"0"`) and `.rainbow-vivid`
never appears (`vividEver:false`). Screenshot `screenshots-k/cold-cube-2s.png` (captured 2 s after the click): the cube
sits in a static tilt, the transport shows the **Play** triangle (NOT Pause), both sliders parked at the start.

**The control discriminant — cold-ENTERED `/square` PLAYS, cold-home→cube does NOT** (`probe-cold-precise.mjs`):

```
/        : vivid:false  dSlider:1   sliders:["0"]                          ← BROKEN (home→cube)
/square  : vivid:true   dSlider:14  sliders:["150","283","408",...,"1900"] ← WORKS (already on route)
```

So the defect is UNIQUE to the home→cube transition handoff, not to play in general nor to the dock.

### Root chain (file:line)

The cold gesture flow:

1. `TransportDock` rainbow play `@pointerdown`/`@click` → `togglePlay` →
   `AnimationControlsGroup.toggleAnimationGroup` (`useAnimationGroupPlayback.ts:56`). Home group is empty →
   `Object.keys(animations).length === 0` → `syncPlayState(true)` → `emit("playStateChange", true)` (`:65-67`, `:37`).
2. `App.onPlayStateChange(true)` (`useSceneMachineApp.ts:155`): `isHome && isHomeEmptyGroup` →
   `autoPlayNext.value = true; getRunSceneSwitch()("cube")` (`:161-164`) → `switchScene("cube")` →
   `dispatch({NAVIGATE, to:"cube"})` (`:191-193`).
3. CubeScene mounts; the `watch(() => sceneRef.value?.animationGroup, markSceneReady)` (`App.vue:136`) fires
   `markSceneReady` (`useSceneMachineApp.ts:100`). It `bindSceneAdapter()` (binds the REAL cube group into
   `currentAnimationGroup`, auto-picks the first animation, registers the group adapter — `:55-86`), then
   `dispatch({SCENE_READY})` (`:119`), then — because `autoPlayNext` is true — `dispatch({PLAY})` (`:128-129`).
4. **SCENE_READY effect** (`useSceneMachine.ts:171-180`) restores ONLY `if (snap && (snap.started || snap.playing))`.
   First-ever cube entry → snapshot is `INITIAL_SNAPSHOT {playing:false, started:false, animations:{}}`
   (`sceneMachine.ts:96`) → **restore SKIPPED, group not started.**
5. **PLAY effect** (`useSceneMachine.ts:182-184`): `if (changed) adapter?.resume()`. The group adapter `resume()`
   (`scenePlaybackAdapters.ts:76-79`) is `if (group.started && group.paused) group.resume()`. The group was never
   `play()`-ed → `group.started === false` → **`resume()` is a NO-OP. The engine group is never started.**

**The second autoplay driver also misses:** `AnimationControlsGroup.onMounted` (`:219-223`) only autoplays
`if (autoPlay && Object.keys(animationGroup.animations).length > 0)`. The component is keyed `:key="superKey"`
(`EditorShell.vue:63`) so it remounts on the cube superKey, but at THAT mount tick `animationGroup` is still the EMPTY
placeholder (`App.vue:253` — `markRaw(new AnimationGroup())`); the real cube group binds LATER via `bindSceneAdapter`.
So `onMounted` sees `length === 0` and skips. The `watch(() => animationGroup, …)` (`:211-216`) only `syncPlayState()`
`if (group.started)` — never true here. **No driver ever calls `group.play()` for the pending autoplay.**

### Live machine proof (`probe-trace-cold.mjs`)

```
POST hash=#/cube  slider=0  vivid=false
POST containerT=matrix3d(0.933…)        ← static idle orbital pose, not advancing
POST machine={"activeScene":"cube","perScene":{"cube":{"playing":true,"started":true,"animations":{}}}}
                                          ↑ machine SAYS playing+started, but animations:{} — the group is hollow
AFTER 2nd click  slider=1240.5  vivid=true   ← the SECOND click plays (group now bound, toggleAnimationGroup .play()s it)
```

The machine's pure reducer wrote `playing:true started:true` (`sceneMachine.ts:128-132`), but the engine
`AnimationGroup` was never started — `resume()` cannot START a fresh group, only un-pause a started one. This is the
classic "the FSM believes a thing the engine never did" split.

### NOT W7c — Tranche-H provenance (git blame, disproves orchestrator suspect)

```
useSceneMachine.ts:182-184  (PLAY→resume)        256f6fe  feat(tranche-H W1): the scene+playback state machine
scenePlaybackAdapters.ts:76-79 (resume no-op)    256f6fe  feat(tranche-H W1): …
AnimationControlsGroup.vue:219-223 (autoPlay)    79ed8e1  refactor(demo): use getter pattern …
```

The W7c U4 diff (`git show 377eb3e -- …/TransportDock.vue`) added ONLY
`<Select v-if="animationNames.length > 1">` + the `<span v-else>` static label + the pointerdown actuation — zero
play-driver edits. **U4 is innocent.** The defect has been latent since H.W1; it surfaces to a human only on the COLD
hero CTA, which no gate exercises.

### Suggested fix (for the impl wave — NOT applied here)

Make the machine `PLAY` effect START an unstarted group, not just `resume()`: either the group adapter gains a `play()`
that does `if (!group.started) group.play(); else if (group.paused) group.resume();`, OR `markSceneReady` routes the
pending `autoPlayNext` through `toggleAnimationGroup` / `currentAnimationGroup.value.play()` after `bindSceneAdapter`
instead of (or in addition to) the machine `PLAY`. The single source of truth should be: "autoplay intent + freshly
bound group ⇒ `group.play()`."

---

## P1-1 — the live-session GATE cannot see this (the unexercised-axis + idle-bob false positive)

`proof-live-session.mjs` B1 leg (`:380-411`) IS labelled "Run on HOME (the empty group E1 repro)", yet it is GREEN.
Two reasons, both observed:

1. **It pre-seeds the warm state.** `seedControlsOpen(page)` (`:225-228`) injects
   `localStorage{isControlsPanelOpen:true}` before navigating — state the genuine cold user never has.
2. **Its motion oracle counts the idle CSS bob.** B1 samples `getComputedStyle(".cube"|".graph"|".idle-hover").transform`
   and asserts `distinct >= 3` (`:393-411`). But `.idle-hover` runs `animation: idle-bob 3s … infinite alternate`
   **at rest** (`CubeTarget.vue:207-208`; `.idle-hover.playing { animation: none }` `:210-211` — it stops only WHEN
   playing). Observed at REST with NO play (`/tmp/probe-idle.mjs`):

   ```
   IDLE-HOVER distinct transforms at REST (no play): 40
   B1-formula distinct at REST (.cube/.graph/.idle-hover): 41   ← gate needs >=3; idle bob alone gives 41
   ```

   The "cube draw loop is LIVE" assertion is satisfied by the idle wobble even if the keyframe group never starts. Plus
   B1's SECOND `clickRainbowPlay` (`:409`) starts the real group, so any residual signal is from the warm second click.

The B1 oracle measures the WRONG element-set for "the group is animating." It must read the **animated container**
(the OrbitalDrag wrapper carrying the engine `matrix3d`), exclude `.idle-hover`/`.cube` static faces, AND assert the
**transport slider advances from 0** under the COLD single gesture (no `seedControlsOpen`, no second click).

---

## P1-2 — U-K1: the bottom TransportDock is NOT shrunken by default (only the TOP dock collapses)

**Repro (`probe-dock-default.mjs`):** cube, no hover (mouse parked at 20,20), 600 ms settle.

```
TOP dock  (y:43):  dock-layer--full {visibility:hidden, opacity:0},  dock-layer--summary is-active {visible,1}  → COLLAPSED
BOTTOM    (y:770): dock-layer--full is-active {visible,1},           dock-layer--summary {hidden,0}            → EXPANDED, w:315
```

The W7c U2 claim (`J.W7c-impl.md:40-53`, `TransportDock.vue:23` `:always-expanded="false"`) is that the bottom dock
collapses to a `Rotations ▶` pill when unhovered. **Live, it does not** — the bottom transport renders its FULL layer
(Rotations select | undo | trash | rainbow play, `screenshots-k/cold-cube-2s.png`) at rest. Only the TOP dock honours
the collapse. This is U-K1 ("dock not shrunken by default") rooted at the OBSERVED layer state: the always-expanded
posture the user disliked is live for the transport dock specifically. Seam: glass-ui `GlassDock` collapse policy
(3.11.2) vs the bottom dock's hover/active-content hold — needs the K dock-layout lane to decide the intended default
detent and whether the transport should collapse at all (it carries the primary play CTA — collapsing it may be wrong).

---

## ADJACENT OBSERVATIONS (cold-entered, for the owning lanes — rooted enough to hand off)

- **`/sequence` cold play: vivid:TRUE but master slider stuck at 0** (`probe-cold-precise.mjs`:
  `vivid:true, dSlider:1, sliders:["0"]`). The play STATE engages (rainbow vivid) but the master playhead never
  advances — a sequence-transport defect distinct from P0-1 (here the group DID start). Hand to the sequence lane
  (U-K13/U-K16 adjacency).
- **`/spring` cold play: slider `0.5` static, vivid:false** — the single-animation spring scene did not engage play on
  the cold rainbow click (`dSlider:1`). Consistent with U-K15 (spring slider steps / inadequate) — hand to the spring lane.
- **`/easing` cold: auto-plays** (`autoPlays:true`, `useSceneMachineApp.ts:127-130`); slider sits at a preview value and
  the `.hero-ball` transform is present — easing's playback model differs (raw-rAF adapter), not part of this defect.

---

## §FOLD

| # | Finding | Sev | The seam (file:line) | Wave-class |
|---|---------|-----|----------------------|-----------|
| P0-1 | COLD home-rainbow-play → cube freezes: machine `PLAY` effect `resume()`s an unstarted group (no-op); `onMounted` autoplay missed (empty group at mount); group never `play()`-ed. Slider stuck 0, rainbow not vivid; 2nd click plays. NOT W7c U4 (H.W1 provenance). | **P0** | `useSceneMachine.ts:182-184` (PLAY→resume) + `scenePlaybackAdapters.ts:76-79` (resume no-op on unstarted) + `useSceneMachineApp.ts:119-130` (markSceneReady order) + `AnimationControlsGroup.vue:219-223` (onMounted autoplay guard) | **cold-play-engine fix** — make autoplay-intent + freshly-bound group ⇒ `group.play()` (adapter `play()` or markSceneReady routes through toggle) |
| P1-1 | `proof:live-session` B1 is GREEN over the broken cold path: pre-seeds `isControlsPanelOpen`, counts the `.idle-hover` idle-bob (41 distinct at REST) as "loop LIVE", and clicks play TWICE. Hero CTA cold path unexercised. | **P1** | `proof-live-session.mjs:225-228` (seed) + `:393-411` (B1 idle-counting oracle); `CubeTarget.vue:207-211` (idle-bob runs at rest) | **gate fix** — born-RED cold-hero leg: no seed, read the animated container, assert slider advances from 0 under ONE gesture |
| P1-2 | U-K1: bottom TransportDock renders its FULL layer at rest (only the TOP dock collapses); the W7c U2 "shrunken pill" claim does not hold live for the transport. | **P1** | `TransportDock.vue:23` (`:always-expanded="false"`) vs observed `dock-layer--full is-active` (y:770); glass-ui `GlassDock` collapse policy 3.11.2 | **dock-layout** (K) — decide transport default detent; coordinate with the dock-refinement lane (U-K7) |
| A-1 | `/sequence` cold: play engages (vivid) but master slider stuck at 0 — playhead never advances. | P1 | `SequenceTarget.vue` master transport; `useSequenceDemo` | sequence lane (hand-off) |
| A-2 | `/spring` cold: rainbow click does not engage play (single-anim scene, slider 0.5 static). | P2 | `SpringScene`/`SpringSidebar.vue`; single-animation play path | spring lane (hand-off) |
