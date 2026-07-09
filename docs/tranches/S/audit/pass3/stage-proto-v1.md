# stage-proto-v1 — THE SCENE STAGE, working prototype (round 1)

**Lane:** Fable prototype (Tranche S · pass 3) · **Date:** 2026-07-03 · **Status:** WORKING PROTOTYPE
**Design:** `docs/tranches/S/audit/pass3/stage-design-v1.md` (built from, in the design's wave order)
**Worktree (KEPT — round-2 substrate):** `/Users/mkbabb/Programming/keyframes.js/.claude/worktrees/wf_2fbb9dbc-c40-1`
**Screenshots:** `docs/tranches/S/audit/pass3/proto-shots/` (18 PNGs — dark · light · mobile × closed/opening/carousel/browsing/committing/entered)

---

## TL;DR

A live, driveable SceneStage. The DK-64 barrel select is real: the page dims to a
warm-dusk theater, a tungsten shaft drops, eight dioramas swing on a tilted 3-D
ring, and **the three under the beam are actually running** (shared kf clock;
rear cards dark + unmounted). **The commit chain — the thing both dead attempts
never wired — fires end-to-end** via keyboard, front-tap, AND is observable
(`window.__stageLastCommit` + hash move + scene mount). Zero console errors across
all three viewports; `tsc --noEmit` exit 0; geometry gate values all pass.

Run it:
```sh
cd /Users/mkbabb/Programming/keyframes.js/.claude/worktrees/wf_2fbb9dbc-c40-1/demo/stage-proto
npx vite --config vite.config.ts     # → http://localhost:5231/  (strict port 5231)
```
Drive: click the bottom **scene pill** to open. Arrows/‹›, wheel/trackpad, and
drag spin the ring; tap the **front** card (or Enter/Space) to commit; Esc/× to
cancel. Deep-link a starting scene with `#spring` etc. Toggle
`localStorage.vueuse-color-scheme` = `dark`|`light` for the two theater readings.

---

## What was built, per milestone (design §18 waves)

### W1 — salvage lift + registry re-derive  ✅
- **Verbatim-lifted from `n-stage-impl` (git show):** `useCarouselOrbit.ts`,
  `useStageLight.ts`, `useLivePreviewLOD.ts` — the proven engine (r7 A-2/A-3/A-5),
  0 edits.
- **Registry re-derived** (`sceneStageRegistry.ts`): membership + order **enumerate
  the 8 scenes from `demo/app/scenes.ts`** (home excluded) — cube · amiga · square ·
  easing · spring · sequence · motion-path · morph; each carries `lodTier`, crayon
  `tone` (the footlight seam), and glyph. Not a frozen list.
- Files live under the design's home `demo/@/components/custom/scene-stage/`.

### W2 — overlay + lighting + geometry at rest  ✅
- `SceneStage.vue` (Teleport-to-body, `role=dialog aria-modal`, focus-on-open),
  `CarouselDisk.vue` (perspective viewport + `rotateX(-15deg)` ring, per-card
  transform off `orbit.derive()`), `StageCard.vue` (glass shell · lit/unlit tier ·
  footlight · specular · `role=option` ARIA).
- **The full lighting layer stack** (design §7): `--stage-base` warm-dusk theater →
  `--stage-dim` vignette → `--stage-beam` tungsten cone (`clip-path` polygon +
  feather mask + `screen`) → `--stage-pool` floor puddle → per-card contact shadow
  (front tinted toward `--tone`). The **`--stage-key`** token (warm tungsten white,
  NOT the shelf's accidental progress-green) + the two `@property` registrations
  (`--stage-light`/`--stage-pool-x`) so the gradients interpolate as the light
  spring moves.
- **`proof:stage-geometry` values (live, `geom.mjs`, dark @1440):**
  overlay is a direct **body child**; **no `view-transition-name`** on the overlay
  or any card (guardrail 3); ring transform = `matrix3d(…cos15…sin15…)` =
  `rotateX(-15°)`; `perspective: 1100px`; **back-card top 278 < front-card top 468**
  (back higher); **width recede 508 > 430 > 290 > 192 > 136** monotone; **min card
  opacity 0.50** (floor, never <0.4).

### W3 — choreography (open · fan-in · orbit · gestures)  ✅
- `open()` → `zooming-out` drives ONE `SpringProgress` (`response .6/damp .85`);
  its **settle** advances the machine to `fanning-in`; the `stagger(from:"center")`
  fan-in reveals cards, then `carousel`. Scene-host zoom-out (`scale`+`opacity` off
  the `zoom` emit) + dock fade/`inert` bound in `ProtoApp`.
- `useStageGestures.ts` (NEW): pointer drag w/ 8px slop + `setPointerCapture`,
  live slot-follow, **release-velocity → `decayRest` slot projection** (LIGHT
  barrel), wheel/trackpad accumulation (±120 → step) w/ 160ms idle clear, tap
  semantics, arrow auto-repeat, keyboard (←/→/Home/End/Enter/Esc/type-ahead).
- **Live-verified** browsing across dark/light/mobile (`04-browsing.png`).

### W4 — the commit funnel + `stage` VT type  ✅  (THE headline)
- `useSceneStage.ts` **rewritten**: the NEW `committing` armed state
  (`data-stage-phase="committing"` + `data-stage-armed`), `requestCommit(id)` as the
  ONE funnel, a settle watcher `(!spinning ∧ front===armed) → fire()`, a **1200ms
  failsafe belt** (the anti-Q.WC3: the commit cannot be lost), and `fire()`
  idempotent → caller `runSceneSwitch(id,{stage:true})` + writes the observable.
- `ProtoApp.runSceneSwitch` = the View-Transition wrapper (object-form
  `startViewTransition({update,types:['stage']})`); the `stage` VT keyframe
  (`kf-scene-stage-enter`) grows the new scene out of the stage.
- **Commit chain proven END-TO-END, both input paths, all viewports** (drive logs):
  - keyboard (ArrowRight→Enter): `committing` observed · `__stageLastCommit.id=square`
    · `hash=#square` · scene mounted · stage closed.
  - **front-tap** (pointer): `committing` observed · armed=`motion-path` ·
    `__stageLastCommit.id=motion-path` · `hash=#motion-path` · `scene=motion-path` ·
    **`stageGone=true`** (close completes). See `05-committing.png` → `06-entered.png`.
  - Cancel (Esc/×) is structurally distinct: no `runSceneSwitch`, no observable.

### W5 — mobile @375  ✅
- Same component/authority/funnel; parameter deltas only (`perspective:900px`,
  `R=clamp(150,52vw,220)`, marquee BELOW the ring at `display` scale, narrower beam,
  safe-area close). **Front-only live** (LOD `maxConcurrentFull:1`).
- **Mobile commit gate reborn:** open → browse → **front-tap commit** →
  `__stageLastCommit.id=motion-path` + hash + scene mount, on the 375×667 context
  (`mobile-05/06.png`). `lit:1` confirmed.

### W6 — LOD hardening / light = life  ✅ (structural)  · fps trace ⚠ deferred
- **The "light = life" cap is STRUCTURAL, live-measured:** desktop `lit:3`
  (cadences `[full, full, flank]`), mobile `lit:1`; **rear cards mount NO
  preview-host** (`unlitHosts:0` — v-if unmounted, silhouette only). ONE shared
  `RAFPlayback` clock; `content-visibility:auto` pause wired.
- **Live-render assertion (not mere presence):** the front `preview-host`
  `data-tick` **advances** (e.g. 62→77) AND the front spring ball's computed `top`
  **moves** (67→77px) over 400ms — real DOM mutation off the shared kf clock, on
  every viewport.

---

## Live assertion outputs (verbatim from the playwright drivers)

| Viewport | phase settles | tick advances | ball moves | lit cap | committing seen | `__stageLastCommit` | hash | scene mounted | stage closed | console errors |
|---|---|---|---|---|---|---|---|---|---|---|
| desk-dark  | carousel | 62→77 | 67→77px | 3 (full,full,flank) | yes | `{id:motion-path}` | `#motion-path` | motion-path | yes | 0 |
| desk-light | carousel | 84→102 | 80→34px | 3 | yes | `{id:motion-path}` | `#motion-path` | motion-path | yes | 0 |
| mobile 375 | carousel | 81→99 | 55→29px | 1 (full) | yes | `{id:motion-path}` | `#motion-path` | motion-path | yes | 0 |

Geometry (dark @1440): body-child ✓ · no VT-name (overlay+cards) ✓ · rotateX(-15°) ✓ ·
perspective 1100px ✓ · back-higher ✓ · width recede 508→136 ✓ · minOpacity 0.50 ✓.

`npm run check` (`tsc --noEmit`, demo/ in include): **exit 0, 0 errors** — the
lifted + new `.ts` composables typecheck against the repo config.

---

## Screenshot index (`proto-shots/`)

`{desk-dark,desk-light,mobile}-{01-closed,02-opening,03-carousel,04-browsing,05-committing,06-entered}.png`.
Highlights: `desk-dark-03-carousel.png` (the vision shot — warm shaft, Spring lit +
running, Easing/Sequence flanks live, rear dioramas dark), `desk-light-03-carousel.png`
(vellum-frosted front card on dusk — both theater readings work),
`desk-dark-05-committing.png` (Path armed, gold footlight, live path dot),
`*-06-entered.png` (committed scene grown out of the stage, dock pill updated).

---

## Deviations from the design (each justified)

1. **Live previews are engine-clock-driven MINIATURES, not the 8 real scene targets
   (except `square`).** `square` mounts the **real `SquareInstrument`** target;
   the other 7 render distinct kf-clock-driven mini-scenes (cube 3-D, easing ball on
   bezier, spring bob, sequence bars, path dot, morph blob, amiga sphere). *Why:* the
   real provide-targets (easing/spring/sequence/motion-path/morph) need the full app
   plugin context (pinia stores, glass-ui, per-scene demo composables) that a
   standalone prototype root can't cheaply stand up; amiga is a live WebGL context.
   The load-bearing round-1 claims — geometry, the LOD "light = life" engine, the
   lighting stack, and **the commit funnel** — are all proven with real kf primitives
   and real DOM mutation. **Round-2 integration** wires the real targets via the
   shelf's provide-adapter registry (p05's ~23-line re-path) inside App.vue.

2. **Standalone `demo/stage-proto/` harness instead of App.vue integration.** *Why:*
   the prototype's job is to prove the engine + choreography + commit spine end-to-end
   as an iteration substrate, not to perform the App.vue surgery (dock pill rewire,
   Suspense siblinghood, real `useSceneTransition`). `ProtoApp` stands in for App.vue
   with a faithful VT-wrapped `runSceneSwitch` (the one commit edge) + a background
   scene-host carrying `view-transition-name: scene-subject`.

3. **Light-mode = warm-dusk theater, not literal vellum-white fog.** The design's
   §7-L1 light reading (edges frost white) rendered white-on-white glass cards
   invisible. Unifying both themes on a warm-dusk base scrim (dark lifts to charcoal,
   light darkens to the same dusk) makes the stage legible in both AND fixes the
   dark-mode "corners too black" note ("dusk, never pure black" — r1 §3). The literal
   vellum treatment is a round-2 refinement (would require darkened card shells in
   light theme). Stage chrome text is theater-light regardless of page theme.

4. **Drag = live slot-follow + decay projection, not continuous angle-follow.** To
   keep `useCarouselOrbit` VERBATIM (design mandate; no new spring-target setter), drag
   maps dx→`round(downIndex − dx/cardWidth)` per move and projects extra coasting slots
   from release velocity via `decayRest`. Reads as a real turntable; the continuous
   angle-follow is a round-2 orbit-API addition.

---

## What was NOT reached

- **`proof:*` gate wiring** (`proof:stage-geometry`/`proof:scene-stage-commits` as
  named CI gates on the shared chromium). The prototype proves their *contracts* live
  (values above) but does not add the gate scripts to `scripts/` / `package.json` — a
  round-2 integration task.
- **Formal fps/scripting local trace** (design §8/§17 W6 chrome-devtools-mcp ≥55fps /
  <8ms). The 3-live cap is structural and runs clean (0 errors, smooth), but no
  recorded perf trace. The synthetic amiga also means the **real WebGL GL-context
  lifecycle** (`renderer.dispose()` debounce, ≤1 context) is stubbed as a poster-kind,
  not exercised.
- **PRM (`prefers-reduced-motion`) snap** is wired (every spring `respectReducedMotion`;
  fan-in collapses to 0ms; MiniPreview freezes) but **not screenshot-verified** under an
  emulated PRM media (no `06-prm` shot). Round-2: add a `reducedMotion` context run.
- **Real dock pill rewire** (retire the scene listbox; `open-stage` emit on the existing
  `DockSelectTrigger`) — the prototype uses a stand-in pill.

---

## File manifest (worktree)

```
demo/@/components/custom/scene-stage/
  SceneStage.vue            NEW  overlay · lighting stack · marquee · arrows · close · wiring
  CarouselDisk.vue          NEW  perspective ring · per-card derive · LOD provide · fan-in
  StageCard.vue             NEW  glass shell · lit/unlit tier · footlight · specular · ARIA
  ScenePreviewHost.vue      NEW  LOD registration · content-visibility · tick → mini
  MiniPreview.vue           NEW  per-scene engine-clock miniatures (+ real SquareInstrument)
  sceneStageRegistry.ts     re-derived from scenes.ts (order/membership/tone/tier/glyph)
  composables/
    useCarouselOrbit.ts     VERBATIM salvage (n-stage-impl)
    useStageLight.ts        VERBATIM salvage
    useLivePreviewLOD.ts    VERBATIM salvage
    useSceneStage.ts        SALVAGE + commit-funnel REWRITE (committing · requestCommit · failsafe · observable)
    useStageGestures.ts     NEW  gesture grammar (drag/decay/wheel/tap/keys)
    lodKey.ts               NEW  shared-LOD injection key
demo/stage-proto/           NEW  standalone harness: vite.config.ts · index.html · main.ts · ProtoApp.vue · proto.css
```

All primitives are LIGHT-barrel (`SpringProgress`, `RAFPlayback`, `stagger`,
`decayRest`) — value.js-free (inv ζ / proof:boundary intent held).
