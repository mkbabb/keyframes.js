# stage-proto-v2 — THE SCENE STAGE, round-2 prototype (binding delta applied)

**Lane:** Fable prototype (Tranche S · pass 3, round 2) · **Date:** 2026-07-03 · **Status:** ROUND-2 DELTA IMPLEMENTED + PROVEN
**Delta applied:** `stage-design-v2.md` (D1–D11 + §P + exit bar) — absorbing `stage-critique-tech.md` (H1/H1b/H2/H5/H6, §3–§8) + `stage-critique-design.md` (S1–S6, P1–P6).
**Worktree (edited IN PLACE; kept intact):** `/Users/mkbabb/Programming/keyframes.js/.claude/worktrees/wf_2fbb9dbc-c40-1`
**Shots + film strips:** `docs/tranches/S/audit/pass3/proto-shots-v2/` · **Runnable gate drivers:** `demo/stage-proto/gates/`

---

## TL;DR

Every round-2 **blocking** item is cured and PROVEN live in-browser:

- **H1/H1b stale-arm — CURED (the tranche's raison d'être).** Browse verbs are LOCKED during
  `committing`; a coasting Enter arms the decay **destination** slot. The adversarial gate
  (clauses A–F) is GREEN: a gesture-during-committing and an Enter-during-flick both commit
  **the scene the ring rests on**, never a stale arm. Transcripts verbatim below.
- **H2 VT-frame exit — CURED.** The overlay tears down INSIDE the `startViewTransition` update
  callback (`overlayInDomAtUpdate === false`); no `view-transition-name` anywhere in the stage
  tree; no double-overlay frame; commit path never enters `zooming-in`.
- **Lighting v2 (S1/S2), commit payoff (S3), unlit legibility (S4), affordances (S5), mobile
  v2 (S6)** — all implemented and re-screenshot (dark/light/mobile × browse/committing/entered
  + hint + grid over the **real `.grid-background`**).
- **LOD v2** — hysteresis band, `maxConcurrentFull=1`, content-visibility dropped, the WebGL
  TIER lifecycle (poster-at-flank · create-only-at-front-settled · debounced dispose · ≤1
  context) proven via `__stageGLLog`.
- **PRM** — emulated; snap verified (open 61ms, commit 75ms, dwell=0).
- **FPS trace** — on real GPU (Apple M5 Max / ANGLE-Metal): **min 56–60fps, avg ~120fps
  (120Hz panel), max frame 16–18ms, 0 frames >50ms, LoAF scripting ≈0ms** — within the
  ≥55fps/<8ms budget. Diagnostic proves the deficit under software raster is compositing, not JS.
- **Motion evidence** — fan-in (10-frame strip) + commit payoff (before→dwell→entered).

`vue-tsc --noEmit`: **0 errors** (whole demo). Zero console errors across every scripted run.
Round-1's geometry numbers are pixel-stable (§P held): 508→430→290→192 recede, back 281 <
front 468, minOpacity 0.50, `rotateX(-15°)`, perspective 1100px.

Run it:
```sh
cd /Users/mkbabb/Programming/keyframes.js/.claude/worktrees/wf_2fbb9dbc-c40-1/demo/stage-proto
npx vite --config vite.config.ts        # → http://localhost:5231/  (strict port)
```

---

## 1. THE STALE-ARM CURE (D1 · tech H1/H1b/H5/H6) — the headline

### The structural cure (`useSceneStage.ts`, rewritten)

- **The LOCK (D1):** `step`/`centerIndex` guard `phase === "carousel"` ONLY — during
  `committing` they return early (silent no-op, dev-logged). `armed === orbit.target ===
  rested front` is now an invariant. The failsafe is a true belt, not the divergent-case
  commit path.
- **The moving-target arm (D1.1):** `onKeydown` Enter resolves the id at the call site — a
  coasting ring (`orbit.spinning`) arms `sceneAt(orbit.targetIndex)` (the decay **destination**),
  a settled ring arms `centeredSceneId`. `orbit.targetIndex` was newly exposed for this.
  Pointerdown halts a coast (`grab()` → re-seat to the rounded front) so a ≤slop tap commits
  the halted front — no arm-in-transit path exists for pointer input.
- **The re-armable belt + dwell (D1.3):** failsafe **2000ms** (reset on every arm); a **280ms
  minimum dwell** before `fire()` even when already front-and-settled (the D5 payoff breath),
  which makes `data-stage-phase="committing"` honestly paint (cures H6). Under PRM dwell = 0.
- **Buffered fan-in (D1.2):** `requestCommit` during `zooming-out`/`fanning-in` latches
  `pendingCommit` (last-write-wins), drained on `carousel`; cleared on cancel. `fanTimer`
  cleared on cancel (H4).
- **VT-frame exit (D2):** `fire()` pre-warms (`await warmScene`), then routes through
  `runSceneSwitch(id, { onUpdate })`; `onUpdate` runs `commitClose` INSIDE the VT update
  callback (scene-swap + `phase → closed` in one flush). Commit never enters `zooming-in`;
  that phase is cancel-close ONLY.
- **Observables (D1.4):** `window.__stageLastCommit` + `window.__stageArmedLog` (append-only
  `{id,t,cause}` at each arm and at fire — the gate's interleaving witness).

### A latent salvage bug the cure surfaced (and fixed)

`useCarouselOrbit`'s managed spring **parked without emitting a final settled frame** on a
no-move re-seat (the open's `setTargetIndex(frontIndex)`), leaving `spinning` stuck `true`
forever. Round-1's happy path masked it; the D1 settle-watch exposed it (only the 2000ms
failsafe ever fired). Fix: a no-move re-seat (`|best − current| < 1e-3`) sets `spinning = false`
+ mirrors the angle immediately. The same class of park-without-emit was fixed for the open
choreography under PRM (see §5).

### ADVERSARIAL PROOF — `proof:scene-stage-commits`, clauses A–F, GREEN (verbatim)

Driver: `demo/stage-proto/gates/adversarial.mjs` (playwright-core on the shared chromium,
live dev server). Output verbatim:

```
[PASS] A gesture-during-committing: {"A":"cube","phaseAfterTap":"committing","frontAfterTap":"cube","frontDuringDwell_restedFront":"cube","committed":"cube","scene":"cube","hash":"#cube","armedLogLast":{"id":"cube","t":2842,"cause":"tap"},"note":"browse (ArrowRight→step) during committing was a silent no-op; ring never left A"}
[PASS] B enter-during-flick: {"targetSlot":4,"destScene":"spring","passingFrontAtPress":"amiga","spinningAtPress":true,"armedLogLast":{"id":"spring","t":3843.9,"cause":"key"},"committed":"spring","scene":"spring","note":"arm latched the decay DESTINATION slot, never the passing front"}
[PASS] C observable-honesty: {"armedLog":[{"id":"cube","cause":"tap"},{"id":"cube","cause":"tap"}],"causes":["tap","tap"],"note":"arm+fire logged with cause taxonomy; gate reads logs, not the committing attr"}
[PASS] D cancel-distinctness: {"midPhase":"committing","switchCount":0,"vtCount":0,"hash":"#cube","phase":"closed","scene":"cube","note":"Esc during committing aborted the armed commit: no runSceneSwitch, no observable, no VT"}
[PASS] E buffered-fan-in: {"phaseAtEnter":"fanning-in","committed":"cube","scene":"cube","armedLog":[{"id":"cube","cause":"buffered"},{"id":"cube","cause":"buffered"}],"note":"Enter during fan-in BUFFERED then drained on carousel → committed normally"}
[PASS] F single-write: {"vtCount":1,"switchCount":1,"committed":"easing","scene":"easing","note":"one commit → exactly one VT + one machine write"}

===== ADVERSARIAL SUMMARY =====
PASS A · PASS B · PASS C · PASS D · PASS E · PASS F  →  ALL CLAUSES GREEN
```

**Reading the two killers:**
- **Clause A (the H1 killer):** armed `cube` → an `ArrowRight` step dispatched inside the
  dwell window → the ring **rested on `cube`** the whole time (`frontDuringDwell === "cube"`),
  the browse was a silent no-op, and the commit landed `cube === rested front`. Against the
  round-1 code this FAILS (it would commit the stale arm while the ring moved) — the assertion
  `committed === rested front` is exactly what round-1's failsafe-commits-stale violates.
- **Clause B (the H1b killer):** a 4-slot coast to `spring`; Enter pressed while **`amiga`**
  (a passing slot) was front and `spinning === true`; the arm latched `spring` (the
  destination `sceneAt(targetIndex)`), and `armedLog.last === committed === "spring" === rested
  front`, with `passingFront("amiga") !== armed`. The arm was never a passing slot.

---

## 2. VT-FRAME EXIT (D2 · tech H2/VT-2/VT-3) — PROVEN

Driver: `gates/vt-proof.mjs`. Verbatim:
```
VT-name in stage tree (must be []): []
__stageVT.overlayInDomAtUpdate (must be false): false
committed: {"id":"spring"} scene: spring
stage present after commit (must be false): false
console errors: []
VT-FRAME EXIT: PASS
```
- The overlay is **absent from the live DOM by the end of the update callback** — the un-named
  overlay can only ride `::view-transition-old(root)` (the intended payoff snapshot the scene
  grows out of), never a live double. No double-overlay frame is structurally possible.
- **No mid-VT screenshot is shown as evidence:** CDP screenshotting pauses the compositor and
  aborts the VT (`"Transition was aborted…"`) — a capture artifact, not a product defect. The
  `overlayInDomAtUpdate` witness is the sound proof; the payoff→entered burst (§7) captures the
  visible arc on either side of the VT.
- VT-2: `runSceneSwitch` MERGES `["stage", forward|backward]` (never replaces the direction).
- VT-3: `::view-transition-old(scene-subject)` now fades opacity→0 over 300ms (was a hard pop).
- The new **`proof:stage-geometry` during-commit clause** asserts this too (§8).

---

## 3. Per-blocking-item ledger

| Item | Cure | Proof |
|---|---|---|
| tech H1/H1b (stale arm) | D1 LOCK + D1.1 destination-slot arm | adversarial A/B GREEN (§1) |
| tech H5/H6 (failsafe/paint) | 2000ms re-armable belt + 280ms dwell | armedLog cause=`tap` fires at arm+280ms, not `failsafe` (§1) |
| tech H4/H3-fan/H2-adjacent | fanTimer clear · BUFFER row · documented Esc-cancel | clauses D + E GREEN |
| tech H2 (VT double-capture) | D2 in-update teardown | vt-proof + geometry during-commit clause |
| tech §3 (miniatures) | D3 adopted as contract | see §4 |
| design S1 (khaki beam / inverted hierarchy) | D4.1–D4.5 two-stop tungsten ramp + front key-wash + penumbra | `dark-browse.png`, `dark-committing.png` |
| design S2 (paper gone / gray film) | D4.6 `.stage-grid` over the REAL grid + plus-lighter beam in light | `light-grid-ghost.png`, `dark-browse.png` |
| design S3 (commit sag / gold wedge) | D5 flare + press + bloom; glyph only in unlit | `dark-committing.png` (no wedge, no ghost) |
| design S4 (unlit illegible / double-exposure) | D6 poster face + AA label + flank blur + rear fade | `dark-browse.png` rear posters |
| design S5 (discoverability) | D7 cursors + hover press + one-time hint | `dark-hint-firstopen.png` → dismiss verified |
| design S6 (mobile clutter) | D8 cull ±2 + 80vw + origin 52% | `mobile-browse.png` |
| tech §8 (thrash/concurrency/CV) | D9.1 hysteresis · D9.2 `=1` · D9.4 CV dropped | §4 |
| tech §8-GL (lifecycle) | D3.3 poster/create/dispose | `gates/gl-proof.mjs` GREEN (§4) |
| tech §4 (perf) | D9.3 cuts + fps trace | §6 |
| design P1/P2/P4/P6 | beam blur+mask · host front-load · marquee · PRM | shots + §5 |

---

## 4. LOD v2 + the WebGL TIER machinery (D9 + D3.3) — PROVEN

- **Hysteresis (D9.1):** lit MOUNT `≤1.5·step`, UNMOUNT `>2.5·step` (mobile front-only band);
  a multi-slot flick sweeps `[1.5,2.5]·step` with no mount/unmount cycle. Per-card sticky
  `litFlags`/`presentFlags` driven off `orbit.angle`.
- **Concurrency (D9.2):** `maxConcurrentFull = 1` (desktop AND mobile) — only the stage under
  the beam runs at full rate; flanks idle at 18fps. WebGL `cost = 2` policy kept.
- **content-visibility (D9.4):** the CV/IO pause path was DELETED from `ScenePreviewHost`
  (inert scaffolding — all cards are on-screen). `v-if` (the lit band) is the pause authority,
  stated in-code.
- **WebGL TIER lifecycle (D3.3)** — `gates/gl-proof.mjs` GREEN (fake-GL body, real machinery):
```
1. cube front, amiga flank   → no context (poster)
2. amiga mid-transit (spinning) → NO create   ✓ never create mid-transit
3. amiga front+settled       → create @ctx1, glLive   ✓ create only at front-settled
4. amiga left front          → poster immediately, dispose debounced   ✓
5. re-front within 2s        → dispose CANCELLED, context reused (no 2nd create)   ✓
6. left front > 2s           → debounced dispose fires → 0 contexts   ✓
creates:1 disposes:1 maxContexts:1   → ≤1 GL context EVER
```
  `webglcontextlost` listener wired → poster-permanent for the session. Events append to
  `window.__stageGLLog`.

---

## 5. PRM (D10 P6) — PROVEN

Driver: `gates/prm.mjs` (playwright `reducedMotion:'reduce'`).
```
PRM open→carousel ms (snap): 61     PRM arm→commit ms (dwell=0): 75/80
committed: cube · scene: cube · armedLog causes: [key, key] · errors: 0
PRM SNAP: PASS
```
The zoom-out/fan-in snap and the commit fires without the 280ms breath — **the LOOK survives,
the motion doesn't**. Shots: `prm-carousel.png`, `prm-entered.png`.

> A second latent salvage bug surfaced here: `openSpring` under `respectReducedMotion` snaps
> its value **without emitting a settled frame**, so `onZoomOutDone` never fired and the PRM
> open hung (which is exactly why round 1 never screenshot-verified PRM). Cured by driving the
> open/close beats by hand under PRM in the phase watch.

---

## 6. THE FPS TRACE (D9.3 · tech §4) — within budget on real hardware

The environment's default headless Chromium uses **SwiftShader (software rasteriser)**, which
makes `backdrop-filter`/blur/`mix-blend` pathologically slow (a CPU floor, not the GPU truth).
Two measurements, driver `gates/fps.mjs` (in-page rAF-delta probe + LoAF, continuous 7-slot
spin storm, dark @1440):

**On real GPU (Apple M5 Max via `--use-angle=metal --enable-gpu`):**
```
avgFps 119.6 · minFps 56–60 · medianFrame 8.3ms · maxFrame 16.7–17.8ms
framesOver50ms 0 · LoAF max scripting/frame ≈0ms · longtasks>50ms: 0 · errors: 0
```
→ **min ≥55fps, scripting <8ms, no LOD-churn long task** — budget MET.

**Diagnostic (why the software number was low):** neutralising ONLY the compositing
(`backdrop-filter/blur/mix-blend` off) under SwiftShader jumped fps 24→39 and dropped
long-frames 10→1, while **LoAF scripting stayed ≈0ms and long tasks stayed 0** the whole time.
The deficit is compositing (GPU-cheap), never JS — confirming the D9.3 cuts (dropped
full-viewport `backdrop-filter` on `.stage-dim`; backdrop only on the lit ≤3 cards; `will-change`
only on lit cards; CV path deleted) put the scripting budget comfortably in reach.

---

## 7. Motion evidence (P5)

- **Fan-in:** `fanin-burst-00..09.png` (10 frames @~85ms) — pill-click → zoom-out → stagger
  (`from:"center"`) fan-in → carousel; the live previews visibly advance between frames.
- **Commit payoff:** `payoff-burst-00.png` (browse) → `-01..04` (the flare/press/bloom dwell)
  → `-05-entered.png`. The single clean `dark-committing.png` (captured at ~150ms into the
  dwell) is the definitive payoff still: beam flare + `translateZ(+40)` press + ember footlight
  bloom + pool surge, marquee swapped to the armed scene, **no gold wedge, no host ghost**.
  (The dwell is only 280ms and screenshot wall-clock is ~90ms/frame, so the burst captures 1–2
  dwell frames before the fire — the single-shot is the richer payoff evidence.)

---

## 8. The two named gates (D11)

Both are implemented as runnable playwright-core drivers in `demo/stage-proto/gates/` and are
GREEN live:

- **`proof:scene-stage-commits`** = `adversarial.mjs` — the happy paths PLUS the adversarial
  clauses **A–F** (§1). Falsifiable by construction (A/B assert `committed === rested front`,
  which the pre-cure code violates).
- **`proof:stage-geometry`** = `geometry.mjs` — all at-rest clauses PASS (body-child; no
  `view-transition-name`; `rotateX(-15°)`; perspective 1100px; back 281 < front 468; width
  508→430→290→192; minOpacity 0.50) **plus the NEW during-commit clause**: `overlayInDomAtUpdate
  === false` (the overlay is gone by the end of the VT update callback).

**Deviation (justified):** they are NOT wired into the repo `package.json`/`scripts/*.mjs` as
`proof:*` roster entries. The prototype is a standalone harness (`demo/stage-proto/`), not the
App.vue integration; wiring the roster against a served **dist** build belongs to the round-3
integration wave (dock-pill rewire, real `useSceneTransition`, Suspense siblinghood), where the
gates run against the real app. They are proven-live here and preserved runnable — same posture
as round-1's "proven-live-but-unwired", now upgraded to adversarial + the during-commit clause.

---

## 9. Screenshot index (`proto-shots-v2/`)

`{dark,light,mobile}-{browse,committing,entered}.png` · `dark-hint-firstopen.png` +
`dark-hint-afterspin.png` (dismissal) · `light-grid-ghost.png` (paper over the real grid) ·
`prm-{carousel,entered}.png` · `fanin-burst-00..09.png` · `payoff-burst-00..05.png`.

**Grid-ghost acceptance (D4.6 condition 2):** the proto harness now includes the **REAL
`.grid-background`** rule (lifted verbatim from `EditorShell.vue`, reading the same demo-owned
`--graph-*` tokens; the EditorShell copy is `<style scoped>` and can't reach the proto root).
Confirmed painted: `{hasGridEl:true, gradientLayers:4}`. The `.stage-grid` ghost is masked to a
pool-matched ellipse (brighter inside the pool — the MATINEE image), visible in both themes.

---

## 10. Deviations from the delta (each justified)

1. **Miniatures kept (D3), real-target path retired.** As the delta rules — `square` stays the
   real `SquareInstrument`; the others are engine-clock dioramas; `amiga` is the proven TIER
   machinery over a fake-GL body. The `scene-stage/previews/` dir exists but the
   screenshot-diff-vs-hero pairing (D3.4) is a round-3 wave artifact, not built here.
2. **Mobile cull uses `v-show`, not `v-if` (D8.1).** The culled cards are unlit (no preview
   host mounted), so the shell is cheap; `v-show` removes the corner clutter visually while
   avoiding mount/unmount churn during a flick (aligned with the D9.1 anti-churn philosophy).
   Same observable result (no corner rectangles — see `mobile-browse.png`).
3. **The rAF direct-write ring (D9.3.4) was NOT implemented.** The ring still binds through the
   reactive `computed cards`. Justification: the GPU fps trace already clears the budget (§6,
   min ≥55fps, LoAF scripting ≈0ms, 0 long tasks) — the reactive round-trip is not the
   bottleneck. The direct-write is a pre-authorized cut that the measured trace did not require;
   deferring it avoids a large refactor with no budget payoff.
4. **Hysteresis can transiently light >3 cards after a multi-slot spin** (a swept card stays lit
   through `[1.5,2.5]·step`). This is D9.1 working as specified (no mount/unmount cycle); the
   `maxConcurrentFull=1` cadence cap bounds the render cost. Visible faintly as a desaturated
   recently-front card (e.g. `square` behind `easing` in `dark-committing.png`).
5. **Gate scripts not wired into `package.json`** — §8 (round-3 integration).
6. **`__stageDebug`** dev-only introspection seam added to `SceneStage.vue` (guarded by
   `import.meta.env.DEV`) so the gate can start deterministic coasts without reaching into Vue
   internals; never shipped.

---

## 11. Files touched (worktree)

```
demo/@/components/custom/scene-stage/
  composables/useSceneStage.ts      REWRITE — D1 lock · D1.1 dest-slot arm · dwell/failsafe · D2 in-update teardown · armedLog
  composables/useCarouselOrbit.ts   expose targetIndex; fix no-move-reseat spinning-stuck bug
  composables/useStageLight.ts      + flare() (D5 payoff / exhale; PRM-snap)
  composables/useStageGestures.ts   + grab() halt-coast · onSpin() hint-dismiss
  SceneStage.vue                    D4/D5/D7 lighting+payoff+hint · grid layer · PRM open/close · flare wire · __stageDebug
  CarouselDisk.vue                  D9.1 hysteresis · D8.1 cull · D9.2 =1 · penumbra/press/settled props · persp-origin
  StageCard.vue                     D4.4 key-wash · D4.5 penumbra · D5 press/bloom · D6 poster face/AA/flank-blur/rear-fade
  ScenePreviewHost.vue              D9.4 CV dropped · D3.3 WebGL lifecycle + __stageGLLog
  MiniPreview.vue                   amiga poster-vs-live (glLive prop)
demo/stage-proto/
  ProtoApp.vue                      D2 onUpdate/VT-merge/warm stub/instrumentation · D10 P2 host front-load · VT-3 old fade · pill toggle
  proto.css                         D4.1 tokens · the REAL .grid-background substrate
  gates/                            NEW — adversarial · geometry · gl-proof · fps · prm · vt-proof · shots · bursts + transcripts
```

---

## 12. What was NOT reached (round-3)

- Gate roster wiring into `package.json` + served-dist (needs App.vue integration).
- The miniature screenshot-diff-vs-hero pairing + maintenance rule (D3.4) as a wave artifact.
- The real App.vue integration itself: dock-pill rewire (glass-ui affordance scoping, D10),
  real `useSceneTransition` type-merge, Suspense-siblinghood warm-then-gate, origin-scene pause
  via `useSceneVisibilityPause` (proto stubs the warm + front-loads the host).
- The rAF direct-write ring (deviation 3 — not budget-required).
- A hardware-GPU chrome-devtools-mcp trace as the canonical C-10 local acceptance (the
  playwright ANGLE-Metal trace here is representative and within budget).

---

### Round-2 exit bar (design-v2) — status

(a) brightest-front warm-tungsten dark shot ✓ · (b) grid over the real `.grid-background`, both
themes ✓ · (c) committing payoff frame (flare+bloom+press, no wedge) ✓ · (d) rear silhouettes
name-legible ✓ · (e) mobile without corner clutter, 80vw ✓ · (f) hint present on first open ✓ ·
(g) `scene-stage-commits` A–F GREEN + `stage-geometry` during-commit GREEN ✓ (proven-live;
package.json wiring deferred to integration) · (h) fps/scripting within budget on GPU ✓ ·
(i) PRM pair + motion strips shipped ✓ · (j) §P pixel-stable ✓.
