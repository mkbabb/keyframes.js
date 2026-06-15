# K.W0 — THE COLD-ENTRY TRUTH (LEADS · P0 · the gate-ORACLE's first oracle on the COLD axis: the first gesture a human makes WORKS)

- **Phase:** DEV — spec authored, awaits IMPL+auth · **Class:** SHIP-in-K (CRITICAL; the
  product's PRIMARY FIRST-RUN GESTURE is broken on the live site TODAY — the hero rainbow-play
  navigates `#/` → `#/cube` and resumes via **`scenePlaybackAdapters.ts:76-79` — a `resume()`
  NO-OP on a never-started group** — so the FSM enters `playing`, the progress UI polls `anim.t`,
  and `interpFrames` never writes a subject. The user drove the J-closed product hours after the
  close and found exactly this (`K.md` lead; `PATH-FORWARD.md §2`). WORSE: the certifying oracle
  was VACUOUS against the defect — `proof:live-session` B1 greens on **41–101 distinct transforms
  produced by the `.idle-hover` CSS bob at REST with the engine OFF** — a liveness oracle that
  cannot tell an ENGINE write from a decorative CSS animation (`live-session-gap-analysis.md §1`,
  `live-cold-play-path.md P1-1`). This is the ≥9-tranche gate-blindspot meta-chronic DL-K2, and the
  ≥4-tranche cold-path rider DL-K1, both RE-OPENED for terminal exit under P-invariant-28
  (`deferred-ledger-k.md §0`, DL-K1/DL-K2).) · **Scope (the demo playback seam + ONE gate, both
  halves of the one move):** the adapter resume made TOTAL at the SINGLE seam
  (`scenePlaybackAdapters.ts:76-79` — autoplay-intent + a freshly-bound group ⇒ `group.play()`, NOT
  a demo-side `play()` sprinkle) + the hero-CTA → scene → engine-play chain born-correct with the
  SMOOTH no-loading transition + U-K1 the bottom TransportDock shrunken by default + U-K4 the amiga
  float/flash/cold-resume cured at root + the per-scene cold-mount defaults (CubeScene dead
  `startScreen`, SquareScene Play-does-nothing, MotionPath shadow-`isPlaying`) + the
  `proof:cold-entry` born-RED gate with the ENGINE-WRITE-CHANNEL assertion (B1 DE-VACUOUSED). ·
  **DAG-deps:** **LEADS the tranche** — the `proof:cold-entry` oracle and the de-vacuoused B1 are
  CONSUMED by every later wave's verification (`K.md §WAVE MAP`: "its `proof:cold-entry` oracle and
  the de-vacuoused B1 are consumed by every later wave's verification"). K.W1 (the glass-ui consume
  edge) runs IMMEDIATELY AFTER W0 lands locally; K.W2/W3/W4 build their design verification on the
  de-vacuoused liveness oracle. No later wave's "subject animates / looks alive" verification can be
  trusted until B1 reads the engine's own hand instead of the idle bob (DL-K2 is the false-GREEN
  mechanism for the whole band — `deferred-ledger-k.md §0`).

## §Provenance (the four lanes this wave consumes + the booked roots)

- **`live-cold-play-path.md` — THE decisive input, wave-ready (U-K2/K3/K5 + U-K1).** The exact root
  chain (§P0-1, file:line): hero play → `togglePlay` → `toggleAnimationGroup`
  (`useAnimationGroupPlayback.ts:56`) → home group empty → `syncPlayState(true)` →
  `emit("playStateChange", true)` → `onPlayStateChange(true)` (`useSceneMachineApp.ts:155`) →
  `isHome && isHomeEmptyGroup` → `autoPlayNext.value=true; runSceneSwitch("cube")` →
  `NAVIGATE`; CubeScene mounts; `markSceneReady` (`useSceneMachineApp.ts:100`) `bindSceneAdapter()`
  + `dispatch(SCENE_READY)` + (because `autoPlayNext`) `dispatch(PLAY)`; the SCENE_READY restore is
  SKIPPED (first-ever cube entry → `INITIAL_SNAPSHOT {playing:false, started:false}`,
  `sceneMachine.ts:96`); the PLAY effect (`useSceneMachine.ts:182-184`) `if (changed)
  adapter?.resume()` → the group adapter `resume()` (`scenePlaybackAdapters.ts:76-79`) is
  `if (group.started && group.paused) group.resume()` → `group.started === false` → **NO-OP, the
  engine group is never started.** The live machine proof (§Live machine proof,
  `probe-trace-cold.mjs`): `machine={"cube":{"playing":true,"started":true,"animations":{}}}` while
  the dock reads "Play animation" and the slider parks at 0 — the FSM believes a thing the engine
  never did. The control discriminant (§P0-1): cold-ENTERED `/square` PLAYS (`vivid:true dSlider:14`)
  while home→cube does NOT (`vivid:false dSlider:1`) — the defect is UNIQUE to the home→cube handoff.
  The git-blame DISPROOF (§NOT W7c): the seam is H.W1 provenance (`256f6fe`), the J.W7c U4
  conditional-select suspect is innocent. U-K1 (§P1-2): the bottom TransportDock renders its FULL
  layer at rest (only the TOP dock collapses), rooted at the observed `dock-layer--full is-active`
  (y:770) vs `TransportDock.vue:23` `:always-expanded="false"`. The suggested-fix seam (§Suggested
  fix): "autoplay intent + freshly bound group ⇒ `group.play()`."
- **`live-session-gap-analysis.md` — THE gate-blindspot lane (the meta-finding + the axis-coverage
  map).** §0: the gate battery is structurally blind on three axes — the COLD-entry path is
  unexercised (`goto #/` ∧ clickPlay ∧ ¬seedControlsOpen → 0 gates), the hero-CTA actuation gap (the
  hero gates are pure static/visual), and the B1 liveness oracle is satisfied by INDEPENDENT idle
  motion. §1: `k-isolate.mjs` — distinct computed transforms per element after a SINGLE click:
  **COLD `.cube`(engine-write)=0** / `.idle-hover`(CSS bob)=85 / `.graph`=13, dock aria "Play
  animation" never flips; `k-verify-gate-blindspot.mjs`: the verbatim B1 oracle reds 101 distinct →
  PASS while the engine is OFF. §2: the axis-coverage map (the K gate roster's source) — the COLD-
  ENTRY gate spec (item 1: fresh context, NO seed, `goto #/`, click the hero rainbow play, assert
  `dock play aria` flips Play→Pause AND the playback slider/`--ball-p` advances AND the per-scene
  engine-write subject traverses ≥3 distinct, NOT `.idle-hover` — "the element-isolation is the
  load-bearing fix"); item 2: de-noise B1 (drop `.idle-hover` + the decorative orbital churn, add a
  play-aria-flip precondition); item 3: an amiga engine-started oracle. §FOLD F1–F6 root the W0 cuts.
  **The two source lanes disagree on the cube's engine-write ELEMENT** — `live-session-gap-analysis.md
  §2` names `.cube` (excl. `.graph`); `gate-estate-k.md §3/§4/§9` names the **OrbitalDrag wrapper
  `.graph`** (the `apply-transform-to-container` matrix3d), excl. `.cube` (the "static face"). The
  live data adjudicates BOTH single-element choices as unfit for the load-bearing assert: `.cube`=0
  distinct on the COLD path (`k-isolate.mjs`) AND 0/1 on the WARM CHOREO path (`gate-estate-k.md §4` —
  so NOT reliably GREEN-on-fix), while `.graph`=13 distinct on the broken COLD path (the orbital/
  perspective churn runs engine-off — so NOT born-RED). **The §Hard gate resolves this** (clause (a)):
  the engine-ATTRIBUTABLE signals (the `--ball-p`/slider advance from "0" + the aria flip) carry
  CORRECTNESS (provably 0/Play engine-off, advancing/Pause engine-on across every probe); the
  single-element transform count is a CORROBORATOR read on the element the engine mutates WHEN
  PLAYING (the OrbitalDrag wrapper for cube/amiga, GATED on aria="Pause"/`apply-transform-to-container`),
  with `.idle-hover` excluded — never a single-element count standing alone.
- **`live-amiga-breakage.md` — U-K4 (three compounding defects).** K4-A the flash:
  `material.color = setHSL(colorT,1,0.95)` multiplied INTO the checkerboard `.map` texture
  (`useAmigaAnimations.ts:54-58` × `utils.ts:35-37`) → `map × color` desaturate/resaturate cycle
  (measured satRange 0.216/4s, `colorT` lives ONLY in `rotations`). K4-B the float: the bounce
  envelope sweeps 69%w/37%h of the canvas (`BOUNCE = BOX_SIZE/2-1 = 5`, `useAmigaAnimations.ts:24`;
  `BOUNCE_FIT_MARGIN = 0.95`, `AmigaScene.vue:62` — the fit targets edge-kiss BY DESIGN). K4-C the
  "constantly": the scene-machine persists `perScene.amiga.playing:true` to localStorage
  (`useSceneMachine.ts:45/51/58/70`, `sceneMachine.ts:67-68/123`); a COLD RELOAD with NO gesture
  resumes the float+flash (travel 60/36, `restoreGroupPlaybackState` → `group.resume()`
  `scenePlaybackAdapters.ts:134` on the restored-as-started group). The two suspects (J.W6 PF-1
  named imports; J.W7a D2/D3 stage) are FALSIFIED. §FOLD K4-A/B/C/D + the gate-gap.
- **`demo-scenes-k.md` — the per-scene cold-mount/default-state census.** §0 the scene-contract
  grammar (the `defineExpose` surface the App reads); §1 the per-scene wiring audit; §4 the cross-
  scene cold-mount band: the defect is PER-SCENE-FAMILY (group-adapter scenes cube/amiga/square fail
  on first visit; rAF scenes easing/spring/sequence/motion-path use `createRafAdapter.resume()` which
  calls `startLoop()` unconditionally so they do NOT carry the no-op). §FOLD S1 (the cold-play
  resume no-op, P0) + S2 (MotionPath shadow `isPlaying`, P1) + S3/S4/S5 (the three amiga U-K4
  defects, P1) + S6 (CubeScene dead `startScreen` export, P2) + S7 (SquareScene Play-does-nothing,
  P2) + S8 (`Math.random()` in CubeTarget reactive style, P2) + S9 (spring slider steps → glass-ui
  3.13.0, OUT→K.W1) + S10 (sequence cold slider, re-probe).
- **The booked invariant roots:** `K.md §invariant set` — the **COLD-axis invariant** (a certified
  surface is exercised from its COLD/DEFAULT entry; it gates FIRST) + the **engine-write
  disambiguation rule** (a liveness oracle reads the engine's own write channel, never bare
  `getComputedStyle` churn; the cure is to DISAMBIGUATE, NOT raise the distinct-count). DL-K1 (the
  ≥4-tranche cold-path rider) + DL-K2 (the ≥9-tranche gate-blindspot meta-chronic) RE-OPENED for
  terminal exit (`deferred-ledger-k.md §0`).

## §The state, verified (file:line / live anchors / observed output)

- **The dead seam — the group adapter `resume()` is a no-op on an unstarted group (CONFIRMED
  against the tree):** `scenePlaybackAdapters.ts:76-79` —
  ```js
  resume(): void {
      const group = getGroup();
      if (group.started && group.paused) group.resume();   // :78 — guard on `started`
  },
  ```
  The engine surface confirms the no-op is structural, not incidental: `AnimationGroup.resume()`
  (`src/animation/group.ts:681-682`) is `if (!this.started || !this.paused) return this;` — resuming
  a never-started group is a documented no-op ("Resuming a … not-yet-started group is a no-op, NOT a
  resume", `group.ts:676-678`); only `AnimationGroup.play()` (`group.ts:581`) sets `started = true`
  (`group.ts:617` `anim.started = true`, the children; the group itself flips `started` on the first
  rAF tick / on `play()`). So `adapter.resume()` on a fresh group CANNOT start it — that is the P0.
- **The PLAY effect that calls it (CONFIRMED):** `useSceneMachine.ts:182-184` —
  `case "PLAY": if (changed) adapter?.resume(); break;`. The machine calls the CONTRACT
  (`adapter.resume`), never `group.play()` — by design (`scenePlaybackAdapters.ts:1-21` header: "the
  machine calls the CONTRACT … never the group directly"). The cure must live IN the contract.
- **The SCENE_READY restore is SKIPPED on first cube entry (CONFIRMED):**
  `useSceneMachine.ts:171-180` — `if (snap && (snap.started || snap.playing)) adapter.restore(snap);`.
  First-ever cube entry's snapshot is the `INITIAL_SNAPSHOT {playing:false, started:false,
  animations:{}}` (`sceneMachine.ts:96`) → both false → restore SKIPPED → the group is never seated
  → `adapter.resume()` then no-ops. So neither path (`SCENE_READY` restore nor `PLAY` resume) starts
  the group on the cold home→cube handoff.
- **The markSceneReady chain that drives both (CONFIRMED):** `useSceneMachineApp.ts:100-132` —
  `markSceneReady()` → `bindSceneAdapter()` (binds the REAL cube group) → `dispatch(SCENE_READY)`
  (`:119`) → `const autoPlays = sceneRef.value?.autoPlays === true; if (!isHome.value && (autoPlays ||
  autoPlayNext.value)) machine.dispatch({type:"PLAY"});` (`:127-130`) → `autoPlayNext.value = false`
  (`:131`). The home↔cube shared-Suspense-key path drives this synchronously via
  `watch(currentSceneId, … if (shared(id) && shared(prev)) markSceneReady())` (`:143-147`), NOT the
  `<Suspense>@resolve`/group-watcher remount path (the keys are shared, no remount fires).
- **The SECOND-click WORKS — the tell the FIRST gesture was structurally lost (CONFIRMED):**
  `useAnimationGroupPlayback.ts:65-75` — `toggleAnimationGroup()` when the group is now bound and
  `!animationGroup.started` calls `animationGroup.play()` (`:75`) + `syncPlayState(true)`. So the
  second dock click reaches `group.play()` and the cube animates; the FIRST gesture routed through
  the machine `PLAY`→`resume()` no-op and was lost. `probe-trace-cold.mjs`:
  `AFTER 2nd click slider=1240.5 vivid=true`.
- **The B1 oracle is VACUOUS — it counts the idle bob (CONFIRMED against the gate source):**
  `proof-live-session.mjs:380-413` (the B1 leg) — `seedControlsOpen(page)` (`:387`, pre-seeds
  `localStorage{isControlsPanelOpen:true}` — state the genuine cold user never has), `goto #/`
  (`:388`), `clickRainbowPlay` (`:390`), then samples `getComputedStyle(sel).transform` over
  `[".cube", ".graph", ".idle-hover"]` for 100 ticks (`:398-407`), asserts `distinct >= 3`
  (`:411`), then `clickRainbowPlay` a SECOND time (`:409`). The `.idle-hover` element runs
  `animation: idle-bob 3s … infinite alternate` at REST (`CubeTarget.vue:207-208`; stops only
  `.idle-hover.playing { animation: none }` `:210-211`). Observed: `IDLE-HOVER distinct transforms
  at REST (no play): 40`; `B1-formula distinct at REST: 41`; gate needs `>=3`. The engine-write
  channel the oracle SHOULD read is the synthetic `proof:subject-animates` target's discipline:
  `proof-subject-animates.mjs:84-96` drives the BUILT `dist/keyframes.js` `Animation.play()` and
  asserts `interpFrames(t, true, …)` (the apply=true SUBJECT-WRITE half, `:17`) mutates the inline
  `style.left` — but that gate is SYNTHETIC (`<div id="raf-subject" style="…left:0px">`,
  `:84`) and never touches the demo cube (`live-session-gap-analysis.md §0` finding 3, F4).
- **U-K1 — the bottom TransportDock renders FULL at rest (CONFIRMED live, `probe-dock-default.mjs`):**
  cube, mouse parked 20,20, 600 ms settle: `TOP dock (y:43): dock-layer--summary is-active →
  COLLAPSED`; `BOTTOM (y:770): dock-layer--full is-active {visible,1} → EXPANDED, w:315`. The W7c U2
  "shrunken pill" claim (`TransportDock.vue:23` `:always-expanded="false"`) does not hold live for
  the transport.
- **U-K4 — amiga (CONFIRMED live):** COLD at-rest stable (2 distinct center pixels, sphere static);
  ON PLAY `floatXpct:69 floatYpct:37 offFrameFrames:1 satRange:0.216`; COLD RELOAD after one play
  `travelXpct:60 travelYpct:36` with `machine={"amiga":{"playing":true,"started":true}}` (the
  persisted `playing:true` resumes the float with ZERO gesture). The flash root
  `useAmigaAnimations.ts:54-58`; the float root `useAmigaAnimations.ts:24` + `AmigaScene.vue:62`;
  the cold-resume root `useSceneMachine.ts:177` restore-on-`playing||started`.
- **The pre-existing harness K.W0 builds on (CONFIRMED):** `navToScene` + `SCENE_MACHINE_KEY` already
  landed in `scripts/lib/demo-driver.mjs:650/671` (J.W0 S2); `EXPECT` already owns the per-scene
  labels (`proof-scene-control-dfa.mjs:163-170`: `cube/amiga/square {hasPanel:true,
  trigger:"Controls"}`, `easing {trigger:"Easing"}`, `spring {trigger:"Spring"}`, `sequence /
  motion-path {hasPanel:false}`). `proof:cold-entry` consumes `navToScene` (for the direct-hash leg)
  and adds the cold-HERO leg + the engine-write assertion.

## §Goal

Make the COLD axis tell the TRUTH: **the first thing a human does — click the rainbow play on the
cold landing hero — starts the engine, smoothly, on the first try, on every scene; and the liveness
oracle reads the engine's own hand, never the idle bob that fooled it.** The one move has two
halves (the mandate's named correction, `K.md §MANDATE`): (1) kill the P0 at the ADAPTER seam — the
resume made TOTAL — so autoplay-intent + a freshly-bound group ⇒ `group.play()`; (2) de-vacuous the
liveness oracle by engine-write DISAMBIGUATION — born-RED on today's tree. Six moves, each at the
gestalt altitude the mandate demands (NO demo-side `play()` sprinkle, NO raised distinct-count, NO
longer settle, NO per-scene patch where ONE seam carries the family):

1. **The adapter resume made TOTAL (S1 — the P0 cure, the SINGLE seam).** The group adapter's
   `resume()` becomes a play/resume split: `if (!group.started) group.play(); else if (group.paused)
   group.resume();` — at `scenePlaybackAdapters.ts:76-79`, the ONE contract seam the machine calls.
   Autoplay-intent + a freshly-bound group ⇒ `group.play()`. NOT a demo-side `play()` sprinkle in
   `markSceneReady`/`AnimationControlsGroup` (the mandate's named forbidding).
2. **The hero-CTA → scene → engine-play chain born-correct + the SMOOTH no-loading transition (S2).**
   The hero rainbow-play handoff is born-correct end-to-end: the home→cube shared-key path that
   drives `markSceneReady` synchronously produces a STARTED engine on the destination, with NO
   loading gap visible (the `<Suspense>` shared-key transition resolves smooth, no flash-of-empty).
3. **U-K1 — the bottom TransportDock shrunken by default (S3).** The transport dock's default detent
   is decided (it carries the PRIMARY play CTA — collapsing it fully may be wrong; the W7c
   always-expanded posture the user disliked is cured at the dock-collapse policy, coordinated with
   the K dock-layout owner K.W3, NOT a retuned magic offset).
4. **U-K4 — the amiga float/flash/cold-resume cured at ROOT (S4).** K4-A: the `material.color`
   hue-cycle no longer multiplies the `.map` texture (drop the multiply / use `emissive`/dedicated
   tint, or remove `colorT` from the default group). K4-B: the bounce amplitude reduced so the rest
   pose dominates and the bounce is a tasteful excursion (NOT edge-kiss). K4-C: the playback-
   persistence policy decided so a cold reload with no gesture does NOT auto-resume the bounce.
5. **The per-scene cold-mount defaults (S5).** CubeScene's dead `startScreen` export deleted;
   SquareScene's Play-does-nothing (the contract anim has no DOM target) given a contextual
   affordance or honest no-verb; MotionPath's shadow `isPlaying` ref migrated to machine-native;
   the `Math.random()`-in-reactive-style flicker fixed (generate-once).
6. **`proof:cold-entry` born-RED + B1 DE-VACUOUSED (S6 — the gate half, the W5 lead leg landing WITH
   W0).** The new gate drives the COLD hero CTA (fresh context, NO seed) AND every scene cold-entered
   both ways (hero CTA + direct hash), asserts the LOAD-BEARING engine-attributable pair (the dock
   aria flips Play→Pause + the slider/`--ball-p` advances from "0") + the aria-GATED engine-write
   corroborator (the OrbitalDrag-wrapper/per-scene subject transform ≥3 distinct WHILE aria="Pause",
   `.idle-hover` excluded). B1 is de-vacuoused by reading the engine's own write channel — excluding
   the idle bob + gating the wrapper count on the aria + asserting the `--ball-p` advance (the
   disambiguation rule), NOT by raising the threshold, NOT by a bare single-element count. Born-RED on
   today's tree; budget 0.

## §Scope

- **S1 — the adapter resume made TOTAL (the P0 cure; the SINGLE seam, inv-16 UNFENCED on the demo
  half).** Locus: `scenePlaybackAdapters.ts:76-79` (`createGroupAdapter().resume`). The cure
  (`live-cold-play-path.md §Suggested fix`, `demo-scenes-k.md §4` fix-seam):

  ```js
  resume(): void {
      const group = getGroup();
      if (!group.started) group.play();          // START a fresh group (the P0 cure)
      else if (group.paused) group.resume();     // un-pause a started one (the extant behavior)
  },
  ```

  **WHY this seam and not another:** the machine calls the CONTRACT (`adapter.resume`,
  `useSceneMachine.ts:183`), never `group.play()` directly — by the adapter's own design
  (`scenePlaybackAdapters.ts:1-21`). The PLAY intent's single source of truth is "autoplay intent +
  a freshly-bound group ⇒ `group.play()`"; the adapter is the ONE place that owns the group's
  start/resume disambiguation, so the cure is one seam serving the whole group-adapter family
  (cube/amiga/square — `demo-scenes-k.md §4` finding 1). The rAF adapter
  (`scenePlaybackAdapters.ts:188-191`) already does the equivalent (`resume()` →
  `handle.setPlaying(true); handle.startLoop()` unconditionally — that is why easing/spring/sequence
  do NOT carry the no-op, `demo-scenes-k.md §4` finding 1). **The alternative routing** (markSceneReady
  routes `autoPlayNext` through `toggleAnimationGroup`/`currentAnimationGroup.value.play()` after
  `bindSceneAdapter`) is the lane's named secondary option — the impl picks the seam that keeps the
  machine the single playback authority; the adapter `play/resume` split is the default because it
  keeps the cure inside the contract the machine already owns and does not re-introduce a demo-side
  play path. **NO-WORKAROUND:** NOT a `group.play()` call sprinkled into `markSceneReady` or
  `AnimationControlsGroup.onMounted` beside the machine (the `K.md §MANDATE` named forbidding: "the
  cold-path P0 dies at the ADAPTER seam (the resume-made-total), NOT a demo-side `play()` sprinkle").
  Engine code is NOT authored here (inv-16: the seam is in the demo; the `AnimationGroup.play/resume`
  surface is consumed PUBLISHED, `group.ts:581/681`, unchanged).

- **S2 — the hero-CTA → scene → engine-play chain born-correct + the SMOOTH no-loading transition.**
  Locus: the cold home→cube handoff (`useSceneMachineApp.ts:100-165` `markSceneReady`/
  `onPlayStateChange` + the home↔cube shared-Suspense-key path `:143-147`). **Root-cause confirmation
  FIRST (born-RED discipline):** before any edit, re-confirm the P0 LIVE on the BUILT
  `dist/gh-pages/` from a `localStorage.clear()` context — `goto #/`, click the hero rainbow play
  ONCE, sample the dock play aria + the slider/`--ball-p` (the load-bearing engine-attributable pair)
  + the aria-gated engine-write subject transform over the play window; assert aria === "Play
  animation" (never flips), slider === "0" (never advances), and the aria-gated wrapper count === 0
  (the precondition never holds) — the `live-cold-play-path.md §P0-1` / `live-session-gap-analysis.md
  §1` observed shape.
  THEN the cure (S1) makes the engine START; this S2 leg confirms the WHOLE chain produces a started
  engine on the destination AND that the transition is SMOOTH — NO loading gap visible to the user
  (the shared-key `<Suspense>` resolves without a flash-of-empty; the cube renders its first engine
  frame as the transition completes). **WHY:** the user's verbatim (U-K2) is "no smooth transition to
  cube animating" — the cure is not only "the engine starts" but "the first gesture produces the
  advertised animation, smoothly." **NO-WORKAROUND:** NOT a fixed `setTimeout`/`nextTick` to "let the
  group bind" before PLAY (a timing band-aid — the J.W0 `§Design-decisions` "NO `nextTick` re-assert"
  precept carries: the chain is made born-correct, not late-correct). The shared-key markSceneReady
  ordering already binds the adapter BEFORE the PLAY dispatch (`:116` then `:119/:128`) — S1 makes
  that ordering SUFFICIENT (the resume now starts the bound group).

- **S3 — U-K1: the bottom TransportDock shrunken by default (the dock-collapse policy).** Locus:
  `TransportDock.vue:23` (`:always-expanded="false"`) + the glass-ui `GlassDock` collapse policy
  (consumed from 3.13.0 after K.W1 re-pins — see the cross-wave boundary below). The observed defect:
  the bottom transport renders its FULL layer (`dock-layer--full is-active`) at rest while only the
  TOP dock honors the collapse (`probe-dock-default.mjs`). **The decision is NAMED, not assumed:** the
  transport carries the PRIMARY play CTA, so collapsing it to a `Rotations ▶` pill MAY be wrong (the
  user wants it "shrunken" — but the rainbow play must remain reachable). The K dock-layout owner
  (K.W3) owns the anchoring/grid tier; W0 owns ONLY the transport's DEFAULT DETENT (does it collapse
  at all, and to what — a collapsed state that keeps the rainbow play visible). **WHY here, not W3:**
  the cold-mount default state is a COLD-axis property (the first thing the user sees on entry) — it
  is the W0 cold-entry truth's appearance half. **NO-WORKAROUND:** the detent is decided at the dock-
  collapse policy (glass-ui `GlassDock`, K.W1-consumed), NOT a retuned hardcoded `always-expanded`
  toggle that re-creates the per-component magic the `K.md §MANDATE` forbids ("the dock layout dies
  at the GRID/anchoring system, NOT retuned magic offsets"). **BINDING boundary:** the dock detent
  appearance verdict is a TASTE-boundary item — it does NOT close green; it closes on the user's
  review packet (the TASTE invariant; see §Hand-off).

- **S4 — U-K4: the amiga float/flash/cold-resume cured at ROOT (the three compounding defects).**
  - **K4-A (the flash):** `useAmigaAnimations.ts:54-58` writes `sphereMesh.material.color =
    new THREE.Color().setHSL(colorT,1,0.95)` every frame `rotations` ticks, multiplied INTO the
    checkerboard `.map` (`utils.ts:35-37`) → `map × color` desaturate/resaturate (satRange 0.216/4s).
    The cure: drop the `.color` multiply (use `emissive`/a dedicated tint channel that does not
    multiply the map, OR remove the `colorT` hue cycle from the DEFAULT group — `colorT` appears ONLY
    in `rotations`, so removing it from the default group is surgical).
  - **K4-B (the float):** `useAmigaAnimations.ts:24` `BOUNCE = BOX_SIZE/2-1 = 5` with
    `AmigaScene.vue:62` `BOUNCE_FIT_MARGIN = 0.95` (the fit targets edge-kiss BY DESIGN) → 69%w/37%h
    sweep. The cure: reduce the authored `BOUNCE` and/or lower `BOUNCE_FIT_MARGIN` so the rest pose
    dominates and the bounce is a tasteful excursion (a design-amplitude call, NOT a math bug — the
    fit math is correct for its over-ambitious target).
  - **K4-C (the "constantly"):** the scene-machine persists `perScene.amiga.playing:true`
    (`useSceneMachine.ts:45/51/58/70`); `useSceneMachine.ts:177` restores when `snap.started ||
    snap.playing`; `restoreGroupPlaybackState` (`scenePlaybackAdapters.ts:97-136`) re-seats the group
    as `started` then `group.resume()`s on `snap.playing` (`:131-135`) → the bounce runs on a cold
    reload with ZERO gesture. The cure: the playback-persistence policy decided — a group scene does
    NOT auto-resume its bounce on a cold load with no gesture (the amiga snapshot carries a "requires
    user gesture" discriminator, OR the bouncing group resets `playing:false` on its natural end /
    on cold mount). **CROSS-LANE (BINDING):** K4-C touches the SAME `scenePlaybackAdapters.ts`/
    `sceneMachine.ts` restore wiring as S1; the cold-FREEZE (S1) and the cold-RESUME-of-float (K4-C)
    are two faces of the SAME restore/playback policy and are fixed as ONE playback-policy wave-class
    (`live-amiga-breakage.md §Cross-lane`; `k-seed-reconciliation.md §Shape B` REJECTED the file-
    disjoint split for exactly this reason). **TASTE-boundary:** K4-A/B are appearance/amplitude calls
    — they corroborate green (no float at rest, contained excursion, no satRange churn) but the
    "tasteful" verdict closes on the user's review packet.

- **S5 — the per-scene cold-mount defaults (the demo-scenes census cuts).** Locus: per-scene
  (`demo-scenes-k.md §FOLD` S6/S7/S2/S8):
  - **CubeScene dead `startScreen` export (S6, P2):** `CubeScene.vue:138-141` defines + exposes a
    `startScreen` render fn identical to the App's `#start-screen` default (`App.vue:115-117`); the
    App never reads `sceneRef.startScreen`. DELETE the render fn + the expose entry (no-legacy).
  - **SquareScene Play-does-nothing (S7, P2):** the rainbow play fires the contract anim group whose
    anim has NO DOM target (`useSquareAnimations.ts:192-210`) → no visual change; the box is drag-
    autonomous. The cure: a contextual `ribbonContent` "drag the box" affordance OR an honest verb
    (a "tumble" play that animates the box) OR remove the play-host from the scene contract — the
    decision is NAMED (the user's U-K5 "none of the animations work properly /square" is the
    Play-button-does-nothing surface).
  - **MotionPath shadow `isPlaying` (S2, P1):** `useMotionPathDemo.ts:48` `isPlaying = ref(false)`
    mutated at four gesture callsites (`useMotionPathGesture.ts:232,240,258,304`) bypassing the
    machine — the un-migrated D12 shadow-authority. Migrate to machine-native (`useSceneMachine` +
    `createGroupAdapter`-based or `useRafScene`-based adapter, expose `scenePlayback`) so the
    traveller position round-trips and the cold-mount play state is machine-honest.
  - **`Math.random()` in CubeTarget reactive style (S8, P2):** `CubeTarget.vue:60-63` calls
    `Math.random()` per render in an inline `:style` binding → rainbow timing flickers. Generate the
    random delays ONCE at setup, bind a static array.

  **WHY in W0:** these are the per-scene cold-mount/default-state defects the cold-entry truth covers
  (`K.md` K.W0 cluster: "per-scene cold-mount/default-state defects (`demo-scenes-k.md`)"). They are
  the appearance/state half of the COLD axis. **NO-WORKAROUND:** the MotionPath migration is a real
  machine-native transposition (NOT a fourth shadow-ref patch); the others are net-deletions / fix-at-
  source.

- **S6 — `proof:cold-entry` born-RED + B1 DE-VACUOUSED (the gate half; the W5 lead leg landing WITH
  W0; the device-INDEPENDENT correctness oracle).** Locus: a NEW `scripts/proof-cold-entry.mjs`
  (consuming `scripts/lib/demo-driver.mjs` `withPage`/`navToScene`/`SCENE_MACHINE_KEY`/`serveDist`)
  wired to `npm run proof:cold-entry` + added to the `proof:all` roster + the demo-smoke job; PLUS
  the de-vacuousing edit to `proof-live-session.mjs:380-413` (B1) + the extension of
  `proof:subject-animates` from the synthetic `<div>` to the REAL scenes (`live-session-gap-analysis.md
  §What the K gate roster needs` items 1-2; `K.md` K.W5 cluster: "`proof:subject-animates` extended
  from synthetic pages to the REAL scenes"). The gate (the axis-coverage map's item 1):
  - **The COLD-HERO leg:** fresh context (`localStorage.clear()` — the genuine cold context, NO
    `seedControlsOpen`), `goto #/`, find + click the hero rainbow play as the FIRST gesture, then
    assert across the play window: (i) the dock play aria flips **Play → Pause**; (ii) the playback
    slider / `--ball-p` advances from "0" — the LOAD-BEARING engine-attributable signal (provably "0"
    engine-off, advancing engine-on across every probe); (iii) the per-scene **engine-write subject**
    transform traverses ≥3 distinct **GATED on aria="Pause"** (a CORROBORATOR — read on the element
    the engine MUTATES when playing: the OrbitalDrag wrapper carrying `apply-transform-to-container`
    for cube/amiga), with `.idle-hover` EXCLUDED (the CSS bob that fooled B1). The element-isolation
    excludes the IDLE BOB and the engine-off orbital churn — NOT a single decorative element standing
    in for the engine (`live-session-gap-analysis.md §2` item 1 "the element-isolation is the load-
    bearing fix"; reconciled with `gate-estate-k.md §3/§4` per §Provenance — the engine-write element
    is the `.graph`/OrbitalDrag wrapper read GATED on engine-on, NOT bare `.cube` nor bare `.graph`).
  - **Every scene cold-entered BOTH ways:** the hero-CTA path (home→cube) AND the direct-hash path
    (`navToScene(page, id, EXPECT[id].hasPanel ? EXPECT[id].trigger : null)`) for cube/amiga/square
    (the group-adapter family) — assert the engine-write channel asserts on the per-scene subject
    (the OrbitalDrag wrapper carrying the engine `matrix3d` for cube/amiga; the box transform for
    square), NOT the idle bob.
  - **B1 de-vacuoused (the disambiguation rule applied):** drop `.idle-hover` from the B1 distinct-
    count sample (the CSS bob moves independent of the engine — 40+ distinct at rest); GATE the
    OrbitalDrag-wrapper distinct-count on the `play-aria-flips Play→Pause` PRECONDITION (the wrapper
    carries decorative orbital/perspective churn engine-OFF — 13 distinct on the broken cold path,
    `k-isolate.mjs`; the aria gate is what makes its motion engine-ATTRIBUTABLE, not the bare element
    choice); remove the `seedControlsOpen` pre-seed on the cold leg; and — the LOAD-BEARING assert —
    the slider/`--ball-p` advances from "0" under ONE gesture (NO second `clickRainbowPlay`). The cure
    is to DISAMBIGUATE (exclude the idle bob + gate the wrapper count on aria + assert the engine-
    attributable `--ball-p` advance), NOT raise the distinct-count (`K.md §MANDATE`; the engine-write
    disambiguation rule).
  - **`proof:subject-animates` extended to the REAL scenes:** the synthetic `<div>` discipline
    (`interpFrames(apply=true)` mutates inline `style`, `proof-subject-animates.mjs:84-96`) is
    extended so the gate ALSO drives the demo cube's matrix/CSS-var transform path on the built dist
    — the engine-write channel read on the real subject, closing F4.

  **WHY (the meta-chronic exit):** DL-K2 (the ≥9-tranche gate-blindspot) is the false-GREEN mechanism
  for the whole band — terminating it (the oracle reads the engine's hand) un-blinds DL-K1/K3/K4/K10
  (`deferred-ledger-k.md §0`). This gate is the LEAD because every later wave's "subject animates /
  looks alive" verification depends on it. **NO-WORKAROUND:** NOT a raised distinct-count threshold
  (the named forbidding), NOT a longer settle, NOT a `seedControlsOpen` on the cold leg (that re-
  introduces the warm-state vacuity).

## §Hard gate (the proof:* that BITES — born-RED on the live P0 TODAY · the gate-ORACLE on the COLD axis)

**The oracle (per the gate-ORACLE precept + the COLD-axis + engine-write-disambiguation invariants):**
`proof:cold-entry` drives the COLD/DEFAULT entry — the hero CTA from a `localStorage.clear()` context
— and reads the ENGINE's own write channel, never the idle bob. The wave's GREEN depends on the
CORRECTNESS clauses (a)-(d); clause (e) is a HYGIENE corroborator; the appearance clauses (S3/S4-A/B
taste) close on the user's review packet (the TASTE boundary), NOT green.

- **clause (a) — the COLD hero-CTA chain STARTS the engine (the P0 cure; CORRECTNESS).** Fresh
  context (`localStorage.clear()`, NO `seedControlsOpen`), `goto #/`, click the hero rainbow play
  ONCE; assert across the play window the **LOAD-BEARING engine-attributable pair** + a gated
  corroborator: (i) the dock play aria flips **"Play animation" → "Pause animation"**; (ii) the
  playback slider / `--ball-p` advances from "0" — the engine-attributable scalar that is provably
  "0" engine-OFF and advances ONLY when the engine drives the playhead (across every probe); (iii) —
  the CORROBORATOR — the **engine-write subject** transform (the OrbitalDrag wrapper carrying the
  engine `matrix3d` via `apply-transform-to-container` for cube/amiga) traverses ≥3 distinct values
  **GATED on aria="Pause animation"**, with `.idle-hover` EXCLUDED from the sample. **Why the
  transform count is a corroborator, NOT the load-bearing assert (the live adjudication —
  §Provenance):** bare `.cube`=0 distinct on the COLD path (`k-isolate.mjs`) AND 0/1 on the WARM
  CHOREO path (`gate-estate-k.md §4`) → reading `.cube` alone is NOT reliably GREEN-on-fix; bare
  `.graph`=13 distinct on the broken COLD path (engine-off orbital churn) → reading `.graph` alone is
  NOT born-RED. The aria-gate on the wrapper count + the `--ball-p`-advance is what makes the assert
  both born-RED today and GREEN-on-fix. **BORN-RED WITNESS (concrete):** on today's tree
  `k-verify-gate-blindspot.mjs` greens the verbatim B1 oracle (101 distinct) while the dock reads
  "Play animation" and the slider is parked at "0" (`live-session-gap-analysis.md §1`,
  `probe-cold-play.mjs`: 16 samples `slider:"0"`, `isPlaying:false`); the aria-GATED wrapper count
  is `0` because the precondition (aria="Pause") never holds. The new clause reads the slider ("0") +
  the aria (never flips) + the gated wrapper count (0, precondition fails) → RED. **BITE:** reds on
  the pre-cure tree (the `resume()` no-op on the unstarted group leaves the slider "0", the aria
  "Play", the precondition false); greens on S1 (the resume made total starts the group → the slider
  advances, the aria flips, the wrapper composites the engine matrix) + S2 (the chain born-correct).
  **NO escape:** the disambiguation is the EXCLUSION of `.idle-hover` + the aria-GATE on the wrapper
  count + the engine-attributable `--ball-p` advance — NOT a bare single-element count, NOT a raised
  threshold, NOT a seed. **The IMPL binds the corroborator selector to the element the engine
  actually mutates** (the audit flags `gate-estate-k.md §4` F6 — choreo `.cube`=1 while the slider
  advances — as SUSPECTED-real; the cold oracle's `--ball-p` load-bearer settles the wave regardless
  of which element the IMPL confirms carries the write, and the gated wrapper corroborator binds to
  it).
- **clause (b) — every scene cold-entered BOTH ways asserts the ENGINE write channel (CORRECTNESS).**
  For cube/amiga/square (the group-adapter family): the COLD hero-CTA path (home→cube) AND the
  direct-hash path (`navToScene(page, id, EXPECT[id].trigger)`) each START the engine — the per-scene
  subject's engine-driven transform (the OrbitalDrag wrapper's engine `matrix3d`, NOT the idle bob)
  traverses ≥3 distinct, the aria flips, the slider advances. **BITE:** reds on the pre-cure tree for
  cube/amiga/square first-visit (all carry the `createGroupAdapter.resume()` no-op,
  `demo-scenes-k.md §4` finding 1); greens on S1. **NO escape:** the per-scene subject is the
  engine-write element, never the idle CSS bob.
- **clause (c) — B1 DE-VACUOUSED: it reds on the engine-OFF state (the disambiguation rule;
  CORRECTNESS).** The rewritten B1 leg (no `seedControlsOpen` on the cold leg, no `.idle-hover`/
  `.graph` in the sample, a `play-aria-flips` precondition, ONE gesture, the engine-write channel +
  the slider advance) is RED on the pre-cure tree (the cold path never starts the engine → aria never
  flips → the precondition fails → RED) and GREEN on the cure. **BORN-RED WITNESS:** the verbatim B1
  is GREEN today on the broken path (101 distinct from the idle bob); the de-vacuoused B1 must be RED
  on that same broken path. **BITE:** reds whenever the engine is off but the idle bob churns —
  exactly the vacuity class the rule forbids. **NO escape:** the cure is DISAMBIGUATION (element-
  isolation + aria precondition), NOT a raised distinct-count (`K.md §MANDATE`).
- **clause (d) — `proof:subject-animates` reads the engine write channel on the REAL scenes
  (CORRECTNESS).** The gate, extended from the synthetic `<div>` to the demo cube's matrix/CSS-var
  path on the built dist, asserts the engine's `interpFrames(apply=true)` write reaches the real
  subject. **BITE:** the synthetic-only gate today never exercises the demo's matrix/CSS-var transform
  path (`live-session-gap-analysis.md §F4`); the extended gate reds if the real subject does not
  receive the engine write (the cold-path no-op surface). **NO escape:** the assertion is on the
  ENGINE-attributable write, not bare `getComputedStyle` churn.
- **clause (e) — U-K1/U-K4 cold-default STATE asserts (boundary corroborator; HYGIENE — labeled).**
  The bottom TransportDock's default detent is asserted at the decided state (S3 — collapsed/shrunken
  per the named decision, the rainbow play still reachable); the amiga COLD RELOAD with NO gesture
  does NOT auto-resume the bounce (K4-C: `machine.amiga.playing` is NOT `true` on a fresh-from-cold
  reload, the sphere does not float at rest); the amiga at-rest is stable (no satRange churn, no
  float). **BITE:** reds on the pre-cure tree (the transport renders FULL at rest,
  `probe-dock-default.mjs`; the persisted `playing:true` resumes the float, travel 60/36
  `live-amiga-breakage.md §K4-C`). *(Labeled HYGIENE — it corroborates the COLD-axis truth (no
  uninstructed motion at rest; the default detent is the decided state) but the APPEARANCE verdict —
  is the detent / amplitude / tint TASTEFUL — is NOT carried by this clause; that closes on the
  user's review packet, the TASTE boundary.)*

**The §spine bar — MUST bite.** Clauses (a)-(d) are the COLD-axis correctness oracle: the gate drives
the real cold hero CTA over the BUILT dist, reads the ENGINE's own write channel (the isolated
subject transform attributable to `interpFrames`/the group composite, the aria flip, the slider
advance), and the de-vacuoused B1 + the real-scene `subject-animates` extension assert the engine
write on the demo. Each asserts an EXACT property (the engine STARTS on the cold first gesture; every
group scene starts both ways; B1 reds on engine-off; the real subject receives the engine write).
Revert S1 → (a)(b)(c)(d) all red (the `resume()` no-op returns; the engine never starts on the cold
path); revert the disambiguation → (c) greens vacuously on the idle bob (the vacuity returns) — so
the disambiguation is load-bearing. **The born-RED witness is CONCRETE:** today's tree greens the
verbatim B1 (101 distinct) while the dock reads "Play animation" and the slider is "0"
(`k-verify-gate-blindspot.mjs`; `probe-cold-play.mjs`: 16 samples `slider:"0"`, `isPlaying:false`;
`k-isolate.mjs`: COLD `.cube`=0 / `.graph`=13 / `.idle-hover`=85 — so the gate's RED is carried by
the engine-attributable pair (slider="0" + aria never flips), NOT by a single-element transform
count, which alone is unfit in BOTH directions per §Provenance); the new clauses red on exactly that
observed shape. **Two-tier taxonomy:** the wave's GREEN depends on the correctness
clauses (a)-(d); clause (e) is a HYGIENE corroborator (it supports the cold-axis truth but may NEVER
substitute for a red correctness clause); the APPEARANCE verdicts (the transport detent's beauty,
the amiga amplitude/tint's taste) are USER-DOMAIN — they close on the review packet, never on green.
**P6 posture (declared):** clauses (a)-(d) are device-INDEPENDENT correctness gates (the engine
write reaches the subject / the aria flips / the slider advances — DOM-membership + computed-CSS
facts, device-independent) → they hard-gate on the Linux runner; the play-window sample uses a
per-EXPECTED predicate (the aria FLIP, the slider VALUE change), NOT a fixed `settleMs`, so it is
load-independent (the J.W0 settle-precept carries). **Budget 0** (the `proof:cold-entry` leg adds NO
new error budget — the cold path threw NOTHING on the broken tree; the defect is a SILENT no-op, so
the gate asserts a POSITIVE product property, not an error count — `live-session-gap-analysis.md §3`
"No console errors on the cold path"). This is the headline-prerequisite gate of the tranche: until
B1 reads the engine's hand, NO later wave's "subject animates / looks alive" verification can be
trusted (DL-K2 is the false-GREEN mechanism for the band).

## §No-workaround prohibitions (BINDING — the mandate's named forbiddings for this wave)

- **NO demo-side `play()` sprinkle (the P0).** The cold-path P0 dies at the ADAPTER seam
  (`scenePlaybackAdapters.ts:76-79` — the resume made total), NOT a `group.play()` call sprinkled into
  `markSceneReady` (`useSceneMachineApp.ts`) or `AnimationControlsGroup.onMounted` beside the machine
  (`K.md §MANDATE`). The machine calls the contract; the contract owns the start/resume
  disambiguation. A demo-side sprinkle re-introduces a second playback authority beside the machine —
  the exact divided-authority class the H.W1 state machine exists to abolish.
- **NO raised distinct-count threshold (the B1 vacuity); NO bare single-element count as the
  load-bearer.** B1 is de-vacuoused by DISAMBIGUATING engine writes from CSS animation: drop
  `.idle-hover` (the pure CSS bob — 40+ distinct at rest); GATE the OrbitalDrag-wrapper count on the
  `play-aria-flips Play→Pause` precondition (the wrapper's bare distinct-count is NOT engine-
  attributable — it carries decorative orbital churn engine-OFF, 13 distinct on the broken cold path,
  `k-isolate.mjs`); and make the engine-attributable `--ball-p`/slider advance from "0" the
  LOAD-BEARING assert — NOT by raising the `distinct >= 3` bar (`K.md §MANDATE`: "the B1 vacuity dies
  by DISAMBIGUATING engine writes from CSS animation in the oracle, NOT by raising the distinct-count
  threshold"). Raising the threshold leaves the oracle blind to the engine-off state — the idle bob
  alone gives 40+ distinct (`live-cold-play-path.md §P1-1`). **And NO bare `.cube`-only count as the
  load-bearer either:** `.cube`=0 distinct on the COLD path AND 0/1 on the WARM CHOREO path
  (`gate-estate-k.md §4`) — a `.cube`-only correctness clause is not reliably GREEN-on-fix; the
  load-bearer is the engine-attributable `--ball-p`/aria pair, the wrapper count a gated corroborator
  (§Provenance reconciles `live-session-gap-analysis.md §2` with `gate-estate-k.md §3/§4`).
- **NO `seedControlsOpen` on the cold leg.** The cold-entry gate runs from a genuine `localStorage.clear()`
  context with NO pre-seed of `isControlsPanelOpen` — the genuine cold user never has that state
  (`live-cold-play-path.md §P1-1` finding 1; `live-session-gap-analysis.md §0` finding 1). Seeding
  the warm state on the cold leg re-creates the vacuity the gate exists to close.
- **NO fixed-time settle / `nextTick` band-aid on the product chain.** The hero→engine chain is made
  born-correct (S1's resume-made-total makes the existing markSceneReady ordering SUFFICIENT), NOT a
  `setTimeout`/`nextTick` to "let the group bind" before PLAY (the J.W0 `§Design-decisions` "NO
  `nextTick` re-assert" precept carries to K). The cold-entry gate's play-window sample is a per-
  EXPECTED predicate (the aria FLIP, the slider VALUE change), NOT a fixed `settleMs` (the J.W0 NO-
  `settleMs`-bump precept carries — a fixed settle is a load-dependent oracle).
- **NO retuned magic offset for the dock detent (U-K1).** The transport's default detent is decided at
  the dock-collapse policy (glass-ui `GlassDock`, K.W1-consumed), NOT a retuned hardcoded
  `:always-expanded` toggle (`K.md §MANDATE`: "the dock layout dies at the GRID/anchoring system, NOT
  retuned magic offsets"). The W3 anchoring tier owns the offset system; W0 owns only the detent
  decision (does it collapse, to what state).
- **NO per-scene patch where ONE seam carries the family.** The cold-play P0 affects cube/amiga/square
  (the group-adapter family) — the cure is the ONE adapter seam (S1), NOT three per-scene fixes. The
  amiga K4-C cold-resume and the cold-FREEZE are the SAME restore/playback policy — fixed as ONE
  wave-class (`k-seed-reconciliation.md §Shape B` REJECTED the file-disjoint split). MotionPath's
  shadow `isPlaying` is migrated to the machine-native pattern (NOT a fourth shadow-ref patch).

## §Folds (every K.md-assigned fold, with its audit-lane + U-K citation)

- **DL-K1** (the ≥4-tranche cold-path rider — the cold home→play→subject-animates race) — S1 (the
  adapter resume made total) + S6 clause (a)/(b) (the born-RED cold-path gate driving the hero CTA
  from a `localStorage.clear()` context, asserting `slider advances` + `aria flips Play→Pause`, NOT
  idle-transform count). `deferred-ledger-k.md` DL-K1; `live-cold-play-path.md §P0-1`;
  `live-session-gap-analysis.md §1`; `scenePlaybackAdapters.ts:76-79`. **RE-OPENED → terminal EXIT
  via the born-RED system gate** (P-invariant-28 — or it rides a 5th time).
- **DL-K2** (the ≥9-tranche gate-blindspot meta-chronic — source-shape/idle-CSS oracles false-GREEN
  engine-start defects) — S6 clause (c)/(d) (B1 de-vacuoused by engine-write disambiguation;
  `subject-animates` extended to the real scenes; the oracle counts ONLY engine-driven transforms,
  excludes `.idle-*`, drives the COLD path, reads the ribbon value). `deferred-ledger-k.md` DL-K2;
  `MEMORY.md` gate-blindspot note; `live-session-gap-analysis.md §0/§2`. **MAXIMALLY EXPOSED — the
  ROOT exit; terminating it un-blinds DL-K1/K3/K4/K10** (P-invariant-28). The engine-write
  disambiguation rule (`K.md §invariant set`) is its codified cure.
- **EC-13 (DL-K33 — the engine-side root-cause twin of the P0)** — `engine-core-k.md §FOLD EC-13`:
  "Group cold-path `NOOP_TRANSFORM` survives when the animation is un-parsed at `play()` time; likely
  root of U-K2/U-K3 subject-freeze" (`group.ts:133` + `useSceneMachineApp.ts:128`). This is the
  ENGINE-side companion to the adapter no-op (`scenePlaybackAdapters.ts:76-79`): S1's cure is
  total only if the freshly-bound group is PARSED before `play()` (no `NOOP_TRANSFORM` survives the
  cold handoff). W0's S6 cold oracle (the engine-write disambiguation) is the born-RED witness — a
  group that plays an un-parsed `NOOP_TRANSFORM` produces 0 engine-write transforms, exactly what the
  cold-entry gate bites. The engine-core lane's P0-adjacent finding folds HERE (the P1 hygiene
  remainder EC-2/EC-4/EC-6/EC-8..EC-12 ride W0 fold-on-touch; EC-5 ≡ DL-K18, EC-7 ≡ DL-K16). `PROGRESS.md
  §"Open deferrals" DL-K33`.
- **U-K2 / U-K3 / U-K5** (hero rainbow-play → no smooth transition / rainbow play broken while slider
  progresses / none of the animations work properly) — S1 (the P0 cure) + S2 (the smooth chain) +
  S6 clause (a)/(b). `live-cold-play-path.md §P0-1` (U-K2/3/5); `live-session-gap-analysis.md §2`
  (the axis-coverage map rows).
- **U-K1** (the dock not shrunken by default) — S3 (the transport default detent decided at the
  dock-collapse policy). `live-cold-play-path.md §P1-2`; `live-session-gap-analysis.md §2` (U-K1
  uncovered axis). The APPEARANCE verdict closes on the TASTE review packet.
- **U-K4** (amiga floats + flashes constantly) — S4 (K4-A flash root, K4-B float amplitude, K4-C
  cold-resume policy) + S6 clause (e) (the cold-default no-float-at-rest + no-cold-resume corroborator).
  `live-amiga-breakage.md §K4-A/B/C`; `demo-scenes-k.md §FOLD` S3/S4/S5. The amplitude/tint TASTE
  verdict closes on the review packet.
- **The per-scene cold-mount defects (S6/S7/S2/S8 of `demo-scenes-k.md`)** — S5 (CubeScene dead
  `startScreen` deleted; SquareScene Play-verb decided; MotionPath shadow-`isPlaying` migrated;
  CubeTarget `Math.random()` flicker fixed). `demo-scenes-k.md §FOLD` S6 (U-K-none, housekeeping),
  S7 (U-K5 square Play), S2 (D12 MotionPath shadow authority), S8 (cube rainbow flicker).
- **F1–F6 (`live-session-gap-analysis.md §FOLD`)** — F1 (cold engine-never-starts) → S1; F2 (B1
  greens on idle motion) → S6 clause (c); F3 (no gate drives the hero CTA cold) → S6 clause (a); F4
  (`subject-animates` synthetic-only) → S6 clause (d); F5 (amiga engine-started oracle) → S6 clause
  (b)/(e) for amiga; F6 (CHOREO cube near-static, SUSPECTED — `.cube`=1 distinct while the slider
  advances) → the S6 cold oracle settles it: the engine-attributable `--ball-p`/slider advance is the
  load-bearer (it is RED today regardless of which element carries the visible write), and the IMPL's
  aria-gated corroborator binds to the element the engine actually mutates (the OrbitalDrag wrapper)
  over a full cycle — settling whether F6 is a real cube-write defect or a sub-threshold window.
- **OUT / sibling (do NOT touch in W0):** U-K15 the spring slider STEPS (`demo-scenes-k.md §FOLD`
  S9) → K.W1 (glass-ui ~3.11.2 → 3.13.0 slider granularity, `S9` root is the glass-ui slider, NOT
  scene wiring); the glass-ui re-pin itself → K.W1; the U-K16 single-option-select totality sweep →
  K.W4 (W0 deletes the CubeScene dead export only, not the per-scene select sweep); the sequence
  cold-slider (`demo-scenes-k.md §FOLD` S10) → the sequence lane re-probe (A-1 hand-off,
  `live-cold-play-path.md §ADJACENT`); the TASTE review-packet GENERATOR → K.W5 (rides the W3-lib
  capture harness; W0 produces the COLD-axis appearance packet rows but the generator instrument is
  W5).

## §Hand-off / cross-wave boundaries (BINDING)

- **→ K.W1 (the consume edge, BINDING):** K.W1 re-pins glass-ui `~3.11.2 → 3.13.0` IMMEDIATELY AFTER
  W0 lands locally (`K.md §WAVE MAP`). The U-K1 transport-detent decision (S3) consumes the 3.13.0
  `GlassDock` collapse policy — W0 DECIDES the detent (the COLD-axis default state), K.W1 supplies
  the published `GlassDock` it consumes. The spring-slider STEPS (U-K15, `demo-scenes-k.md §FOLD` S9)
  is OUT of W0 — it is a glass-ui consume-edge K.W1 owns. The RF-17 click-strand/cold-play swallow
  class (DL-K9) → K.W1 consumes the 3.13.0 `click-integrity` composable (W0 does NOT carry a kf
  `pointerHandled` interim).
- **→ K.W2 / K.W3 (the design waves, BINDING):** W0's de-vacuoused B1 + `proof:cold-entry` are the
  LIVENESS oracle every design wave's "the subject still animates after the re-cut" verification
  consumes — W2/W3/W4 build their verification on the engine-write-channel oracle, NOT the idle bob.
  The U-K1 transport detent's ANCHORING/offset (where the dock sits, the grid tier) is K.W3's; W0
  owns only the COLLAPSE DETENT (the cold-default state). The amiga K4-A/B appearance amplitude is
  W0's root cure; the broader amiga visual re-cut (if any) rides the design waves.
- **→ K.W4 (the panes, BINDING):** the U-K16 single-option-select totality sweep is K.W4's
  (`live-dock-tabs-selects.md`); W0 deletes ONLY the CubeScene dead `startScreen` export (S5), not the
  per-scene select census. The SquareScene Play-verb (S7) decision is W0's cold-mount-default call;
  the square pane's broader re-cut rides W4 if the verb decision implies a contextual ribbon.
- **→ K.W5 (the gate-truth wave, BINDING):** `proof:cold-entry` (S6) is W0's OWN hard gate — it lands
  WITH W0 (the LEAD leg of the K.W5 partition: `K.md §WAVE MAP` "the cold-entry oracle is W0's own
  hard gate (lands WITH W0)"). The remaining gate-truth legs (the single-option-select gate, the
  TASTE review-packet GENERATOR, release.yml F-1, the demo-smoke wall-clock) land at their owning
  waves / W5. W0 produces the COLD-axis review-packet ROWS (the U-K1 detent, the amiga amplitude/tint
  before/after); the generator INSTRUMENT is W5 (rides the W3-lib capture harness).
- **→ K.WZ (the close, BINDING):** the U-K1 dock-detent APPEARANCE verdict + the U-K4 amiga
  amplitude/tint TASTE verdict close on the USER's review packet (the TASTE invariant, `K.md
  §invariant set`) — a named USER-DOMAIN step scheduled BEFORE the version cut, never after. W0's
  CORRECTNESS clauses (a)-(d) close green; the APPEARANCE verdicts are recorded as TASTE-boundary
  rows the WZ packet carries.
- **OUT / sibling (do NOT touch):** the engine `AnimationGroup.play/resume` surface (consumed
  PUBLISHED, `group.ts:581/681`, inv-16 — W0 authors NO engine code); the value.js frontier grammar
  half (VJ.W1 scroll / VJ.W2 ramp — sibling-DISPATCHED via `KF-TO-VALUEJS-GRAMMAR-ASKS.md`, born-RED
  kf-side until the publish; the frontier ITSELF folds into K Band II K.W7–K.W12, NOT a residual L);
  the version cut + publish (USER-DOMAIN, confirm-first, Mike Babb, K.WZ).

## §Design decisions (trade-offs RESOLVED)

- **The P0 dies at the ADAPTER seam, NOT a demo-side sprinkle — RESOLVED.** The machine calls the
  contract (`adapter.resume`); the contract is the ONE place that owns the group's start/resume
  disambiguation. The resume made total (`if (!group.started) group.play(); else if (group.paused)
  group.resume();`) is one seam serving the whole group-adapter family (cube/amiga/square) and keeps
  the machine the single playback authority. A demo-side `group.play()` sprinkle re-introduces a
  second authority — forbidden (`K.md §MANDATE`).
- **B1 dies by DISAMBIGUATION, NOT a raised threshold — RESOLVED.** The idle bob alone gives 40+
  distinct transforms at rest with the engine off (`live-cold-play-path.md §P1-1`); raising the bar
  leaves the oracle structurally blind to engine-off. The cure is element-isolation (read the
  engine-write element, drop `.idle-hover`/`.graph`) + a `play-aria-flips` precondition — the oracle
  reads the engine's own hand (`K.md §invariant set` engine-write disambiguation rule).
- **The cold-FREEZE and the amiga cold-RESUME are ONE playback-policy wave-class — RESOLVED.** Both
  ride the same `scenePlaybackAdapters.ts`/`sceneMachine.ts` restore wiring; `k-seed-reconciliation.md
  §Shape B` REJECTED the file-disjoint split for exactly this reason (it re-creates the divided-
  attention failure mode that let the P0 ship). S1 (the resume-made-total) and S4-K4-C (the
  persistence policy) are designed together as the one restore/playback policy.
- **The transport detent is DECIDED, not assumed — RESOLVED.** The transport carries the PRIMARY play
  CTA, so a full collapse to a `Rotations ▶` pill MAY be wrong (the rainbow play must remain
  reachable). W0 decides the detent (collapse to a state that keeps the play visible) at the dock-
  collapse policy (glass-ui `GlassDock`, K.W1-consumed); the W3 anchoring tier owns the offset
  system. The APPEARANCE verdict closes on the TASTE packet, not green.
- **The amiga K4-A/B are amplitude/appearance calls, K4-C is a correctness/policy call — RESOLVED.**
  K4-C (the cold reload resumes the float with no gesture) is a CORRECTNESS defect (uninstructed
  motion at rest) — clause (e) reds on it, the policy fix greens it. K4-A (the texture-multiply
  flash) and K4-B (the edge-kiss amplitude) are TASTE/amplitude calls — the root cure (no satRange
  churn, contained excursion) corroborates, but the "tasteful" verdict closes on the review packet.
- **`proof:cold-entry` LEADS, lands WITH W0, asserts a POSITIVE product property — RESOLVED.** The
  cold path threw NOTHING on the broken tree (`live-session-gap-analysis.md §3`) — error-budget gates
  are blind to a silent no-op. The cold-entry oracle asserts a POSITIVE product property (the engine
  STARTS, the aria flips, the slider advances, the engine-write reaches the subject), budget 0. It is
  the LEAD because it is the false-GREEN mechanism's exit (DL-K2) — every later wave's liveness
  verification depends on it (`K.md §WAVE MAP`).
- **The MotionPath shadow `isPlaying` migrates to machine-native, NOT a fourth shadow-ref patch —
  RESOLVED.** The D12 shadow-authority pattern (`useMotionPathDemo.ts:48` mutated at 4 gesture
  callsites) is the un-migrated H.W1 hold-out; W0 migrates it (machine-derived `isPlaying` +
  `scenePlayback` adapter) so the cold-mount play state is machine-honest and the traveller position
  round-trips (`demo-scenes-k.md §FOLD` S2) — a real transposition, not another patch.
