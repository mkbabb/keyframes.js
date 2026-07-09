# stage-critique-tech — TECHNICAL CRITIC, the Scene Stage prototype (Tranche S · pass 3)

**Lane:** Fable technical critic · **Date:** 2026-07-03 · **Status:** ADVERSARIAL REVIEW
**Design:** `docs/tranches/S/audit/pass3/stage-design-v1.md`
**Build report:** `docs/tranches/S/audit/pass3/stage-proto-v1.md`
**Prototype audited:** `.claude/worktrees/wf_2fbb9dbc-c40-1` — `demo/@/components/custom/scene-stage/` (5 `.vue` + 6 composables + registry) + `demo/stage-proto/` harness.
**Live trace:** NOT obtained — the chrome-devtools MCP profile was locked by a concurrent browser instance and `playwright-core` is unresolvable in the worktree. The §4 paint audit is source-based; the fps trace is RULED a hard round-2 blocker (§4·F6-perf).

---

## Verdict in one paragraph

The engine is real and the headline claim holds: the commit **fires** and is observable — the Q.WC3 "swipe that never committed" defect is genuinely cured for the happy path. But the funnel is **not race-free**: `committing` still accepts browse verbs, and `armedId` is latched-and-never-reconciled, so any ring motion after arming (a flick, or Enter pressed mid-spin) desynchronizes `front` from `armed`, the settle-watch never matches, and the 1200 ms failsafe **commits a stale scene while the ring visibly rests on a different one** (§1·H1 — HIGH). Two further HIGH issues are structural, not cosmetic: the stage does **not** exit inside the VT frame as the design's §10 mandates, so the un-named overlay is double-captured (root snapshot + still-live) during the commit VT (§5·H2); and the round-2 "wire the real scene targets via a ~23-line re-path" plan is **not feasible as sold** because the scenes are module-global singletons (`createGlobalState`, not "pinia") and the origin scene stays mounted behind the dim — N live instances would alias one store (§3·H3). I RULE the miniatures the honest LOD tier-2 contract for round-2, with the cost enumerated. The two gates are the right shape but the commits-gate as specified will **not** catch the stale-arm hole and must be made adversarial (§7).

---

## 1. The commit funnel — the event × state matrix and its holes

`useSceneStage.ts` is the spine. States: `closed · zooming-out · fanning-in · carousel · committing · zooming-in`. The full transition matrix, verified against the source (guards at lines 133/149/153/162/212/227):

| state \ event | `open` | `close` (Esc/×) | `requestCommit` | `step`/`centerIndex` | zoom/fan advancers |
|---|---|---|---|---|---|
| **closed** | →zooming-out | — | — | — | — |
| **zooming-out** | — | →zooming-in (cancel) | — (dropped) | — (dropped) | onZoomOutDone→fanning-in |
| **fanning-in** | — | →zooming-in (cancel; `fanTimer` **leaks** until it self-fires no-op) | **— (dropped!)** | — (dropped) | onFanInDone→carousel |
| **carousel** | — | →zooming-in | →committing | spin | — |
| **committing** | — | →zooming-in (**cancels an armed commit**) | re-arm | **spin — the divergence hole** | fire→zooming-in |
| **zooming-in** | — (blocked ~600 ms) | — | — | — | onZoomInDone→closed |

Idempotence and the belt are correct: `fire()` guards `phase === "committing"` and clears both the failsafe and the settle-watch on entry; the three fire triggers (settle-watch, 1200 ms failsafe, immediate `queueMicrotask`) all funnel through it and the later ones no-op. Rapid re-taps, ESC-during-commit, and double-fire are all *deterministic*. But the matrix exposes real holes:

### H1 — `committing` accepts browse verbs → the failsafe commits a STALE scene. **[HIGH]**
`step()`/`centerIndex()` guard `phase === "carousel" || phase === "committing"` (lines 150/154) — so a gesture is legal *during* committing. `requestCommit` latches `armedId` once (line 164) and the settle-watch matches on `front === armedId.value` (line 179). Sequence that breaks it:

1. User taps front card **A** → `requestCommit("A")`, `armed=A`, spin-to-front (already there).
2. Before settle, user flicks (or the design's "mid-spin input is always legal" Enter-during-flick path fires `requestCommit(centeredSceneId)` while a decay projection is coasting). Ring now heads to **B**.
3. `front` becomes **B ≠ A** → the settle-watch **never matches**.
4. At 1200 ms the failsafe fires unconditionally → `runSceneSwitch("A")` — **commits A while the ring rests on B.** The user sees B lit under the beam and lands on A.

The funnel "provably fires" (the report's headline) but can fire the *wrong* scene. This is the subtle successor to Q.WC3 — not "never commits" but "commits the stale arm." Same failure class the tranche exists to kill.
**Prescription:** while `committing`, LOCK browse verbs (return early unless the verb is cancel), OR abort `committing`→`carousel` on any browse verb, OR (weakest) have `fire()` commit the LIVE `centeredSceneId` at fire-time rather than the latched `armedId`. The lock is the strong form: it makes `armed === target === front` an invariant and turns the failsafe into a true belt rather than the primary commit path for the divergent case.

### H1b — Enter/Space during a flick arms a moving target. **[HIGH, same root]**
`onKeydown` Enter/Space → `requestCommit(centeredSceneId.value)` (line 259). `centeredSceneId` is the *rounded* front at the instant of the keypress. If a decay flick is coasting through several slots, the arm latches a slot the ring is passing through, then coasts past it → the divergence of H1 without any second gesture. The `centeredSceneId` read is a snapshot of a moving quantity.

### H2-adjacent — Esc during `committing` silently cancels a REQUESTED commit. **[LOW, undocumented]**
`close()` is not guarded against `committing`, so Esc after a front-tap (but before settle) runs the cancel path — no `runSceneSwitch`, no observable. Deterministic and arguably correct (Esc means abort), but the design's §5 matrix never states `committing × Esc`. Document it, or (if a tapped commit should be uncancelable once armed) guard it.

### H3-fan — `fanning-in × requestCommit` is silently dropped. **[LOW]**
A user who presses Enter during the fan-in (a plausible fast-path) gets nothing (guard rejects non-carousel). Either buffer the request to fire on `onFanInDone`, or accept-and-arm during fan-in.

### H4-timer — `fanTimer` not cleared on cancel-during-fan-in. **[LOW]**
`close()` doesn't clear `fanTimer` (SceneStage.vue:95/106). Harmless (the late `onFanInDone` no-ops via its guard) but a dangling timer; clear it in `close()` for hygiene.

### H5-failsafe-window — 1200 ms may be SHORTER than a large flick's settle. **[MEDIUM]**
The belt's premise ("a spring ALWAYS settles ≪1.2 s") is false for a multi-slot decay-projected flick: a `SpringProgress(response .55, damping .9)` re-seated across 3–4 slots (135–180°) can take ≳1 s to settle. If the failsafe fires while the ring is still visibly moving, the commit snapshots a mid-motion frame (and, combined with H1, an even-more-stale target). Either (a) make the failsafe generous (≥2 s) *and* make it a true last-resort by locking browse (H1), or (b) reset the failsafe timer on each re-arm/target change.

### H6-gate-paint — the `committing` DOM attr never PAINTS on the immediate path. **[LOW, gate honesty]**
When the armed card is already front-and-settled, `requestCommit` does `queueMicrotask(fire)` (line 186). Vue's render flush and the fire microtask both drain before the browser paints, so `data-stage-phase="committing"` is written and overwritten to `zooming-in` within one microtask cycle — the browser never paints `committing`. A screenshot- or paint-observing gate cannot see it. Rely on `__stageLastCommit` + an armed-history log, never on catching the `committing` attribute (bears on §7).

---

## 2. `useCarouselOrbit` correctness (verbatim salvage)

The shortest-signed-delta re-seat (lines 127–157) is correct and interruptible; `mod`/`signedAngle` are right; PRM snaps via `respectReducedMotion` and the code mirrors `liveAngle`/`spinning` synchronously under PRM. `onScopeDispose(spring.dispose)` is present. No orbit-level correctness defect. One perf note carried to §4 (P3): the salvage's own comment says "the per-card painter reads the spring directly," but the impl routes the whole ring through a reactive `computed cards` (CarouselDisk:58) recomputed every frame from `orbit.angle` — 8 component re-renders + 8 inline-style writes per frame while spinning. That is heavier than the zero-alloc direct-write the comment implies.

---

## 3. The miniatures decision — RULING

The build shipped engine-clock **miniatures** for 7/8 scenes (only `square` mounts the real `SquareInstrument`). The design promised **live scene previews** (real targets scaled into cards, via "the shelf's provide-adapter registry, p05's ~23-line re-path"). I RULE against the real-target path for round-2 and FOR miniatures-as-contract, on four grounds the proto only half-names:

### H3 — the real-target path is not a "~23-line re-path"; it is a per-scene refactor. **[HIGH, feasibility]**
- **The scenes are module-global singletons.** Per `demo/CLAUDE.md`: stores are `vueuse createGlobalState + useStorage` — "never Pinia." (The proto-report's and the task's "pinia stores" is a misnomer; the barrier is worse than pinia, which at least supports scoped instances.) `createGlobalState` is a *module-level* singleton: mounting `EasingTarget` into a card and into the live scene shares ONE reactive store. Two instances fight the same selection/playback state.
- **The origin scene stays mounted behind the dim.** `ProtoApp`/design bind the scene-host to `scale + opacity + pointer-events:none` — it is *not* unmounted or paused. So opening the stage from Easing leaves the live Easing scene running behind the scrim; an Easing card that mounts the real target is a *second* instance aliasing the same global store → visible conflict, plus wasted rAF behind an opaque dim.
- **The design's own §8 escape ("provide-adapters build ONE fresh demo context per card — never the live scene's singleton") requires each scene to accept dependency-injected state** — which today it does not. Retrofitting 8 scenes to take injected stores is the real cost, not a re-path.
- **Only `square` is genuinely instance-local** (custom transform fn, no global store) — which is exactly why it was the one real target the proto could stand up.

**THE RULE the wave spec should mandate:** ship purpose-built per-scene **miniatures** as the honest LOD tier-2 preview contract. Keep `square` live (proven). Optionally allow `amiga` real GL *only at front-settled* (§5-GL). **The cost, stated honestly:**
1. The 8 miniatures are a *parallel artifact* to the 8 scenes and can drift from the real look. The spec must own the drift with a **screenshot-diff acceptance that pairs each miniature against its scene's hero shot**, and a maintenance rule: a scene redesign updates its miniature in the same change.
2. Miniatures must share NO global store and own no rAF (they read the shared LOD `tick` — the proto already does this correctly).
3. The marketing line changes from "the previews are the real scenes, running" to "living dioramas that *evoke* each scene" — a smaller but honest promise. Do not let the design keep claiming "the one in the light is *actually running* [the real scene]"; that is only true for `square`.

Miniatures are not a shortfall to apologize for — they are the correct architecture given the singleton constraint. The design's error was promising real targets without costing the singleton barrier.

---

## 4. Perf posture — the lighting/compositing stack

The fixed overlay stacks, bottom→top, all `position:absolute; inset:0` unless noted:

| Layer | Cost signature |
|---|---|
| `.stage-base` | solid fill, animated `opacity` — 1 compositor layer, cheap |
| `.stage-dim` | radial-gradient **+ `backdrop-filter: blur(3px) saturate(.92)` over the FULL viewport** — a per-frame backdrop readback+blur of everything beneath (grid paper + scene-host) while `openP` animates |
| `.stage-beam` | linear-gradient + `clip-path` polygon + `mask-image` + `filter: blur(3px)` + **`mix-blend-mode: screen`** — offscreen buffer (filter) that must blend against the composited backdrop (screen) |
| `.stage-pool` | radial-gradient + `filter: blur(10px)` + `mix-blend: screen`, `translateX` tracking a spring — a 10px-blur layer re-rastered as it moves + a second screen blend |
| `.stage-card__shadow` ×8 | radial-gradient + `filter: blur(5px)` — **8** blurred layers, always rendered (shells render for all 8 cards) |
| `.stage-card__shell` ×3 lit | **`backdrop-filter: blur(6px) saturate(1.05)`** — 3 MORE backdrop-filters stacked over dim/beam/pool |
| `.stage-card__specular` (front) | `mix-blend: screen` — a 3rd screen-blend element |
| the ring | `will-change: transform,opacity,filter` on **all 8 cards** → 8 permanently-promoted layers; rear cards carry `filter: blur()` re-rastered each spin frame |

### P-perf — this is a legitimately heavy stack; the trace is missing. **[MEDIUM, must-run round-2]**
The expensive interactions: **one full-viewport `backdrop-filter` (dim) + three card `backdrop-filter`s + three `mix-blend-mode: screen` elements**. `backdrop-filter` does not compose cheaply (each is a separate readback+blur of the backdrop), and `mix-blend: screen` defeats the isolated-layer optimization (the element must sample the composited backdrop every frame). Layer over a 60fps spinning 3-D ring (§2·P3's per-frame reactive style writes to 8 cards) and this is a real paint/composite budget on desktop and a risk on mid mobile GPUs (mobile mitigates only by dropping to 1 lit card). The design already CUT floor reflections for exactly this reason (§6.8) — good — but the stacked backdrop-filters + screen blends remain uncosted.
**Prescription:** round-2 MUST land the deferred chrome-devtools fps trace (design §8/§17 W6): ≥55fps carousel-open, <8 ms scripting/frame, a mid-spin trace clean of LOD-churn long tasks — recorded in the wave doc, per C-10 kept LOCAL (never a CI fps threshold). Concretely: measure whether the full-viewport `backdrop-filter` on `.stage-dim` can be dropped to a plain semi-opaque scrim (the blur of paper-behind-dim is barely legible under the vignette anyway), and whether the 3 card `backdrop-filter`s can be static `background` glass instead of live backdrop reads. Budget the `will-change` on 8 cards — promote only the lit ≤3.

### P3 — the ring binds transforms through Vue reactivity at 60fps. **[MEDIUM]**
`CarouselDisk` `computed cards` depends on `orbit.angle` (reactive, ticked every frame) → 8 `StageCard` style recomputes + inline writes per frame while spinning, plus `angleOf` recompute. Consider a rAF-driven direct-write ring (the `useAnimationSync` pattern the repo already uses for `markRaw` animations) so the spin does not round-trip the Vue scheduler 8× per frame.

---

## 5. VT interplay

### H2 — the stage does NOT exit inside the VT frame; the un-named overlay is double-captured. **[HIGH]**
Design §10 step 3 mandates `stage.phase = "closed"` *inside* the `startViewTransition` update callback so the overlay is gone before the VT snapshots. The proto does not do this: `fire()` merely sets `phase = "zooming-in"` and calls `runSceneSwitch`; the overlay then closes on the *independent* `openSpring` zoom-in (~600 ms, driven in SceneStage.vue:85-93), while the VT runs 420 ms in `ProtoApp`. Two unsynchronized timelines. Consequence, given the overlay carries **no** `view-transition-name` (correctly, guardrail 3): the still-live overlay is captured into the **`::view-transition-old(root)`** snapshot AND remains live on top → the dim/beam/cards render **twice** during the commit VT, and the openSpring fade vs the VT vs the focus-move-to-scene-host all race. `dockInert` also releases at `zooming-in` (ProtoApp:39) so the dock fades back *while the overlay is still closing*.
**Prescription:** implement §10 step 3 literally — the `runSceneSwitch` VT `update` callback must set the machine AND drop the stage to `closed` in the same synchronous mutation, so the overlay is torn down inside the captured frame. The zoom-in openSpring then becomes redundant for the commit path (keep it only for the cancel-close path, which has no VT).

### VT-2 — the proto passes only `types: ['stage']`, dropping forward/backward. **[MEDIUM, integration]**
`ProtoApp.runSceneSwitch` sets `types = ['stage']`. The real `useSceneTransition` composes `['forward'|'backward']`; the design says `stage` composes INTO the set. Integration must **merge**, not replace, or every stage commit loses directional choreography.

### VT-3 — `::view-transition-old(scene-subject) { animation: none }` holds the old frame. **[LOW]**
`animation: none` on the old means the old scene snapshot holds full-opacity for 420 ms then pops, rather than cross-fading beneath. Verify this reads as "new grows over a held old" and not a hard pop at the end; the design's prose said the old "cross-fades beneath."

---

## 6. Integration risks the standalone harness hides

- **VT + async Suspense scene (the big one). [HIGH-integration]** The real scene-host wraps a keyed bare `<Suspense><component :is>` with lazy scene chunks. `startViewTransition`'s `update` callback mutates the machine, but if the target scene's chunk/async setup has not resolved, the callback returns before the new scene renders → the VT captures an *empty/suspended* scene-host and "grows a spinner out of the stage," not the scene. The proto's synchronous div swap cannot surface this. The hover-warm (design §3) mitigates but does not *guarantee* resolution before capture. Round-2 must `await` the scene-ready (or warm-then-gate) before entering the VT — a real ordering problem the harness hides entirely.
- **Origin scene not paused behind the dim. [MEDIUM]** The live scene keeps its rAF running behind the scrim, competing with the orbit/light springs + LOD clock for frame budget during the carousel. Wire `useSceneVisibilityPause` (or the machine's pause) on `open`.
- **The dock-pill rewire may need a glass-ui affordance. [MEDIUM]** Retiring the `DockSelectTrigger` listbox while keeping the pill means "a Select trigger that opens the stage instead of its own popover." glass-ui's Select may not support trigger-without-popover; per MEMORY (`glass_ui_root_changes`), that belongs in glass-ui, not a demo patch. Scope it before W4-integration.
- **Glass shells are hand-rolled, not the `glass-resting` register the design mandated. [LOW]** `StageCard` uses ad-hoc `backdrop-filter`/`box-shadow`, not glass-ui `glass-resting`/specular. Integration must dogfood the tokens (also relevant to §4's backdrop-filter budget).
- **Hash-router re-entrancy. [MEDIUM]** Proto uses `history.replaceState`; the real path is vue-router hash → `useSceneMachineRouter` → machine reconcile. Routing a commit through `runSceneSwitch(machine mutate)` that also writes the hash, watched by the router that reconciles the machine again, risks a double-switch / double-VT. Verify one commit = one VT = one machine write.
- **Pill re-click is a no-op, not cancel. [LOW]** Design §5 lists "dock-pill re-click → cancel-close." `open()` early-returns when already open (useSceneStage:134) and the proto has no toggle, so re-click does nothing. Wire the pill to `stage.close()` when open.
- **`prefers-reduced-motion` never screenshot-verified** (proto acknowledges); wire a PRM context run in round-2.

---

## 7. The two named gates — falsifiable and runtime-honest?

### `proof:stage-geometry` (playwright-core, shared chromium) — SOUND, one blind spot.
Falsifiable and runtime-honest: concrete computed-style/rect assertions against served dist (body-level sibling; no `view-transition-name`; `rotateX(-15°)`/perspective within tolerance; back.top < front.top; front>flank>rear width; no card opacity <0.4; at 375 + desktop). The `depth`-proxy assertions are a reasonable 3-D witness. **Blind spot:** it is an *at-rest* gate — it cannot see the §5·H2 "no VT-name held DURING a commit" defect (the overlay double-capture), and it does not assert geometry mid-spin. Add a during-commit assertion: while `data-stage-phase` is transitioning, the overlay still carries no `view-transition-name` AND is absent from the live tree by the time the VT captures (i.e., encode the §10-step-3 fix as a gate clause).

### `proof:scene-stage-commits` (born-RED) — RIGHT SHAPE, UNDER-SPECIFIED. **[must strengthen]**
As specified ("open → wheel/arrow to a different scene → tap front → assert activeScene + `__stageLastCommit` + hash + focus; a drag-flick variant asserts the decay projection commits after settle") it validates only the *happy* path and will pass even with the §1·H1 stale-arm hole intact. It must be made **adversarial** to be honest:
1. **Interleave a gesture during `committing`:** arm scene A (front-tap), then `step`/flick toward B *before settle*, then assert the COMMITTED id equals the RESTED front — not the latched arm. Against today's code this FAILS (commits A, rests B), which is the point: the gate should force H1's fix.
2. **Enter-during-flick:** start a decay flick, press Enter mid-coast, assert the committed id equals where the ring actually settles.
3. **Do not assert the `committing` attribute** as a paint/DOM observable (§1·H6 — it never paints on the immediate path). Assert `__stageLastCommit.id` + an armed-transition log only.
4. Keep the fps budget LOCAL (design correctly does — C-10), not a CI threshold.

Both gates are still **unwired** (no `scripts/*.mjs`, no `package.json` entry) — the proto proves the contracts live but the CI closure is round-2 work, as the report states.

---

## Round-2 blocking list (what MUST change or be proven)

1. **Close the stale-arm hole (§1·H1/H1b):** lock browse verbs during `committing` (or re-arm to live front / commit live front at fire-time). This is the tranche's raison d'être — the funnel must commit the scene the user is looking at.
2. **Exit the stage inside the VT frame (§5·H2):** phase→closed in the `startViewTransition` update callback; kill the double-overlay + focus/inert race.
3. **Adopt miniatures as the mandated LOD tier-2 contract (§3):** with the screenshot-diff-vs-hero acceptance + the maintenance rule; drop the design's "real scenes running" claim (keep only `square`, optionally front-only `amiga` GL). Re-cost the "real target" line — it is a per-scene DI refactor, not a re-path.
4. **Add LOD lit-boundary hysteresis (§8 below / carried):** a mount/unmount band (e.g., mount ≤1.5·step, unmount >2.5·step) or keep-alive pooling — a multi-slot flick currently mounts/destroys every crossed card; catastrophic once real targets / the amiga GL context are in play.
5. **Build + prove the amiga GL lifecycle (§8-GL):** poster-at-flank, live-only-at-front-settled, debounced `renderer.dispose()`, ≤1 context, never create mid-transit; the current unmount-on-rear + no-poster architecture actively fights it.
6. **Run and record the fps/scripting trace (§4·P-perf):** ≥55fps, <8ms/frame, no LOD-churn long task; and re-evaluate the full-viewport `backdrop-filter` + 3 card backdrop-filters + 3 screen-blends against that budget.
7. **Make `proof:scene-stage-commits` adversarial (§7):** the gesture-during-committing + Enter-during-flick interleavings.
8. **Resolve the VT + async-Suspense ordering (§6):** warm-then-gate the scene-ready before capture, or the "grow out of stage" animates a spinner.

## Round-2 polish (lower severity)

- Merge `stage` into the VT type set, don't replace forward/backward (§5·VT-2).
- Pause the origin scene while the stage is open (§6).
- Wire pill-re-click → cancel-close (§6).
- Dogfood glass-ui `glass-resting` instead of hand-rolled glass (§6).
- LOD concurrency deviation: impl runs **2 full + 1 flank**; design said **1 full + 2 flank@18** — reconcile the "only the front is full-rate under the beam" story with maxConcurrentFull (§8 below).
- `content-visibility` pause is effectively inert (all cards on-screen; real gating is v-if) — either honest-document it or drop the machinery (§8 below).
- Clear `fanTimer` in `close()`; remove the `void d` dead depth-proxy in `StageCard.shadowStyle`.
- Generous/re-armable failsafe window ≥2s (§1·H5).
- Document `committing × Esc` = cancel in the state matrix (§1·H2-adjacent); decide `fanning-in × requestCommit` (buffer vs drop).

---

## 8. LOD contract — leaks, bounds, thrash (the §2 challenge, detailed)

- **Leaks: clean at rest.** `ScenePreviewHost.onUnmounted → detach() + reg.release()`; `useContentVisibility.onScopeDispose(detach)`; `useLivePreviewLOD.onScopeDispose(clock.stop)`; the two `watch`es auto-stop with the component scope. The shared clock self-stops (`frame()` returns false when no active card) and re-arms via `ensureRunning` (guarded against double-loop by `if (running.value) return`). Springs in SceneStage setup persist for app life but their managed loops park when settled (stage closed ⇒ no resident rAF). No listener/rAF leak found at rest.
- **Thrash on fast rotation — the real leak vector. [HIGH once real / GL]** `lit = a < litRadius` (CarouselDisk:56/64) flips at a hard threshold with NO hysteresis. A decay flick sweeping several slots crosses the lit boundary repeatedly → `v-if` mounts/unmounts `ScenePreviewHost` (⇒ register/release + IntersectionObserver + 2 watches + MiniPreview) on every crossing. Cheap for a MiniPreview; **ruinous for round-2 real targets** (store wiring, composables) and for **the amiga WebGL context** (creation ~10–50ms; browsers cap ~16 live contexts then drop the oldest). The design's "no-overshoot orbit prevents flank flapping" is true only at the *settle point*, not in transit. Add a hysteresis band or a mount debounce.
- **The WebGL lifecycle is entirely unbuilt AND the architecture fights it. [HIGH, round-2]** The proto's amiga is a fake CSS sphere. The design wants: live-only-at-front, static poster at flank, `renderer.dispose()` ~2s debounced after leaving front, ≤1 context. The current pieces contradict this: `resolveCadences` gives webgl `cost=2` (so amiga-at-front eats the whole budget, dropping both flanks to 18fps — a *reasonable* policy), but there is NO poster-at-flank swap (ScenePreviewHost mounts MiniPreview regardless of tier) and NO debounced dispose — and the unmount-on-rear policy would create+destroy a GL context on every lit-boundary crossing (see thrash). Round-2 must special-case tier `webgl`: create the renderer only when amiga becomes front AND settled; render a poster (the checkerboard-derived asset the BLUEPRINT allows) at flank; dispose on a ~2s debounce; listen `webglcontextlost` once → poster-permanent for the session. None of this exists.
- **Concurrency deviation. [LOW]** `maxConcurrentFull: props.mobile ? 1 : 2` ⇒ desktop **2 full + 1 flank** (matches the report's `[full,full,flank]`), not the design §8 **1 full + 2 flank@18**. The impl runs one flank at 60fps — a *higher* budget than "only the front is full-rate under the beam." Reconcile the number with the "light = life" narrative (either set maxConcurrentFull=1, or update the design's prose).
- **content-visibility is a near-no-op here. [LOW, honesty]** All cards sit centered in the viewport, so `content-visibility: auto` never skips them and `contentvisibilityautostatechange` never fires "skipped" — the pause is carried entirely by the `v-if` unmount, not by content-visibility. The IO/CV machinery is inert scaffolding as wired. Either drive it off actual off-screen geometry or drop it and state plainly that v-if is the pause authority.

---

### Evidence index
`useSceneStage.ts` (funnel: 133/149/162/179/186/212/227), `useCarouselOrbit.ts` (127-157, onScopeDispose 207), `useLivePreviewLOD.ts` (resolveCadences 161-181, frame/ensureRunning 122-149, content-visibility 240-299), `useStageGestures.ts` (arm/flick 74-148), `SceneStage.vue` (openSpring 79-93, phase watch 96-113, 85-93 zoom-in advance), `CarouselDisk.vue` (lit 56/64, reactive cards 58), `StageCard.vue` (v-if lit 66, will-change 101, backdrop-filter 114, dead `void d` 44), `ScenePreviewHost.vue` (register/release 34-57), `MiniPreview.vue` (tick-derived), `ProtoApp.vue` (runSceneSwitch 45-62, types 54, dockInert 39, VT CSS 107-123). Design `stage-design-v1.md` §5/§8/§10/§11/§17; report `stage-proto-v1.md` deviations 1-4 + "not reached." Live fps trace: NOT obtained (MCP profile locked; no playwright-core in worktree) — §4·P-perf ruled a hard round-2 blocker.
