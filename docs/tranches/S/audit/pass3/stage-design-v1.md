# stage-design-v1 — THE SCENE STAGE (DK-64 barrel select, first principles)

**Lane:** Fable design (Tranche S · pass 3) · **Date:** 2026-07-03 · **Status:** DESIGN — buildable without questions
**Supersedes:** SPEC-v3 §S.E (`docs/tranches/S/audit/pass1/SPEC-v3.md:864-937`) — its three guardrails are KEPT verbatim (single authority · commit-on-settle · chrome outside the VT subject); its wave skeleton is replaced by §18.
**Inputs:** `docs/tranches/N/STAGE-SPEC.md` + `N/IMPL-BLUEPRINT.md` (the owner's referent), `S/audit/pass1/research/r7-scene-switcher-glassui.md` (archaeology), `r1-session-history.md` (owner corpus, Finding 6), `prototypes/p05-nstage-rebase.md` (salvage proven compilable), the live tree (`demo/app/App.vue`, `useSceneTransition.ts`, `useSceneSwap.ts`, `scene-transition.css`, `scenes.ts`, `sceneExposedApi.ts`), `demo/DESIGN.md` + `demo/@/styles/design-idioms.css`, design-fleet baselines (`pass1/design/{home,cube,easing}.md`), and the shelf source (`git show n-stage-impl:demo/@/components/custom/scene-stage/…`).

---

## 0. Thesis — why THIS design gets built and works

Two attempts died for reasons that are now fully named (r7 A-9):

1. **Q.WC3 `SceneSwitcherCarousel`** — a phone-only scroll-snap strip whose `onScroll` was a
   documented no-op (`void nearestCenterId`): a swipe never committed. Mounted INSIDE the
   `scene-subject` VT. A `max-width:720px` second authority. R excised it.
2. **N-era `n-stage-impl` shelf** — the ENGINE was right (single-spring orbit, shared-clock LOD,
   Teleport-sibling DOM position — r7 A-2/A-3/A-6) but it re-rolled a bespoke
   `TransportDock`→arrows dock surface (a second dock authority, r7 A-8) and was shelved on
   scope/timing before the choreography was ever tuned ("awful" ×2, "totally and unmeasurably
   wrong" — r1 §3, N rows; the rejections were about **execution quality, never the concept**,
   r1 Finding 6).

This design keeps the shelf's proven engine (p05: rebases with 5 files / 23 import lines,
`tsc` 0-error, `proof:boundary` green), **rewrites the two layers that were never right** — the
invocation/commit spine and the theatrical look — and **cuts the two things that killed the
prior attempts**: no dock morph dependency (stage chrome owns its own arrows), no implicit
"maybe it commits" path (ONE settle-funnel with a failsafe and a gate-readable observable).

The one structural idea that is NEW here, and is simultaneously the perf answer and the
aesthetic answer: **light = life.** Only the stages near the drop light are alive. The front
stage runs full-rate under the beam; the two flanks idle at 18 fps in the penumbra; the rear
stages are **unlit** — their previews unmounted, showing a dark diorama silhouette (glyph +
name) exactly the way DK-64's unentered lobbies sit dark until you walk up. Nine live previews
was the N-era perf cliff (STAGE-SPEC S6); three live previews under a lighting story is the
first-principles fix, not a throttle bolted on.

---

## 1. Aesthetic direction — MATINEE: the drafting table dims to a theater

The demo's identity is a daylight drafting table: engineering graph paper
(`--graph-pitch`/`--graph-major`, design-idioms.css:298-302), glass plates, Instrument Serif
poster type, crayon `--rainbow-*` pops (design-idioms.css:79-90, DESIGN.md). The stage is the
demo's ONE theatrical moment — the house lights dim on that same paper. Committed direction:

- **The paper never leaves.** The dim is a vignette *over* `.grid-background` — in dark mode a
  clean darkening to dusk (never black — the N correction, r1 §3 "darkened areas far too dark
  … grid paper background not pure black"); in light mode a **vellum fog** (the white paper
  frosts toward the edges and stays crisp only under the light). Same mechanism, two readings,
  both theatrical.
- **The light is tungsten, off the gold ramp.** The demo already owns a metallic gold family
  (`--color-gold-light`/`--color-gold-dark`, design-idioms.css:134-142). The drop light is a
  warm tungsten white derived beside it (`--stage-key`, §7) — NOT the progress green the shelf
  accidentally keyed the beam to (`var(--color-progress, #f5f0e6)` — the fallback reveals the
  intent was warm white; the token was wrong. Fixed here).
- **The marquee.** The nameplate is Instrument Serif at display scale — the scene's name as a
  theater marquee — with the count in Fira Code mono-caption. Each scene's crayon accent
  survives as its **footlight**: the front card's contact pool tints toward the scene's
  `--ball-tone` seam (design-idioms.css:552-564), so Easing sits in a violet-warmed pool,
  Sequence in green — the icon palette's promise kept on the stage floor.
- **Glass where it earns it.** Card shells are glass (`glass-resting` register per the
  §STAGE-CARD ruling, design-idioms.css:695-738); specular/refract on the FRONT card only
  (CONTROL-on-plate, no PLATE-on-PLATE — N/IMPL-BLUEPRINT §glass-ui).

What someone remembers: *the page goes to dusk, a warm shaft drops, and eight little living
dioramas swing past under it — the one in the light is actually running.*

---

## 2. The charter guardrails (absolute — carried from SPEC-v3 §S.E)

1. **ONE nav authority.** The scene machine + `runSceneSwitch` is the only commit edge
   (App.vue:382-386); the ChromeDock is the only invoker; no `max-width` visibility fork.
2. **Commit-on-settle, wired and observable.** Never a `void`-discarded read (the Q.WC3
   cardinal defect). §10 spells the funnel; `proof:scene-stage-commits` actuates it.
3. **Stage chrome OUTSIDE the VT scene-subject.** Teleport-to-body sibling of the keyed
   `<Suspense>`; no `view-transition-name` anywhere in the stage tree (r7 A-6; the shelf
   already got this right — `SceneStage.vue:217`).
4. **Dogfood inv ζ.** Every load-bearing motion is a kf LIGHT-barrel primitive on
   `RAFPlayback` (§16). No hand-rolled rAF, no eyeballed CSS transitions for load-bearing motion.
5. **PRM snaps every beat** (§14). **Live-verified stages** — chrome-devtools-mcp acceptance
   per beat, never source-shape (N/STAGE-SPEC working method; the MEMORY.md gate-blindspot cure).
6. **No scratch `*.mjs` probes** — the named real gates (§17) replace them.
7. **LIGHT barrel only** in the stage tree (`SpringProgress`, `RAFPlayback`, `stagger`,
   `decayRest`, `NumericAnimation`) — value.js-free; `proof:boundary` stays green (p05 F1/F3).

---

## 3. THE AUTHORITY RULING — the stage IS the switcher's new face

**RULED: the ChromeDock scene pill (the existing `DockSelectTrigger` scene Select,
`ChromeDock.vue:269-305`) keeps its pixel identity — same pill, same label, same icon, same
44px target — but its actuation becomes `stage.open(currentSceneId)`. The Select's dropdown
listbox for scenes is RETIRED.** There is no "Select vs stage" coexistence question because
there are not two browse surfaces: the stage is the scene Select's new open state.

Why this and not a second dock button beside a kept listbox:

- The R-audit's single-authority sin was two *parallel* nav surfaces with independent
  order/commit paths. One trigger → one browse surface → one commit edge is the strong form of
  the cure. A kept listbox beside a stage is the weak form — two browse surfaces that must be
  kept in sync forever.
- The owner's ask has always been "the scene switcher" (N corpus: "activating the scene
  switcher" — r1 §3 N rows), not "an extra gallery."
- The home-page audit's cardinal finding (pass1/design/home.md §2 — the collapsed dock pill
  "reads as a blurred gray smudge") is *worsened* by hiding the demo's best moment behind a
  second, even less discoverable button.

Consequences, handled:

- **Hover-warm survives.** The pill's `@warm-scene` hover prefetch (App.vue:13,
  scenes.ts:120-123) re-targets: opening the stage warms ALL scene chunks (8 × ~small; the
  previews mount targets from the same chunks — the warm is the preview's own preload).
- **Programmatic nav is untouched.** The router hash path (`useSceneMachineRouter`), the
  SharePopover restore (App.vue:48), and every gate's `navToScene`-by-hash keep working — the
  authority is the machine, and the machine's writers are unchanged.
- **Keyboard quick-pick is preserved in-stage:** `←/→` steps, `Home/End` jumps, and
  type-ahead (§9/§13) — the listbox's power-user affordance moves inside, not away.
- **The dock's other controls (controls-panel select, transport, @mbabb) are untouched.**
  While the stage is open the dock fades + `inert` (§5); Esc restores it.

The glass-ui 5.0.0 dock-morph dogfood (r7 B-2) is an OPTIONAL later refinement of the pill's
open *animation*, not a dependency of anything here — this design ships against glass-ui 4.0.x
as pinned (package.json:260). No `stageDockKey`, no `TransportDock` swap, no `StageArrows`-in-
dock: the L/R arrows are stage-internal chrome (§4), which deletes the shelf's second-authority
dock surface instead of re-homing it.

---

## 4. Component map

All NEW/salvaged files under `demo/@/components/custom/scene-stage/` (the shelf's home;
outside `demo/scenes/` so `proof:scene-colocated` clauses are unaffected — p05 §5).

| File | Origin | Responsibility |
|---|---|---|
| `SceneStage.vue` | SALVAGE, reworked | The Teleport-to-body overlay: dim/beam/pool lighting layers, the disk mount gate, the marquee nameplate, the close (×) button, the L/R arrow buttons, keyboard routing, focus trap. Owns NO animation loop. |
| `CarouselDisk.vue` | SALVAGE, reworked | The perspective viewport + tilted ring; per-card transform binding off `useCarouselOrbit.derive()`; fan-in reveal (`stagger`); hosts `StageCard`s; the drag/wheel gesture surface (delegates to `useStageGestures`). |
| `StageCard.vue` | **NEW** | One diorama: glass shell, contact-shadow ellipse, the lit/unlit tier switch (live `ScenePreviewHost` vs the unlit silhouette: scene icon ghost + label at `brightness(.5)`), front-card specular, per-scene `--ball-tone` footlight, ARIA option semantics. |
| `ScenePreviewHost.vue` | SALVAGE | Mounts a scene target scaled into a card via its registry adapter (prop / provide shapes); binds the LOD registration (`tick`/`cadence`); passes pointer events through ONLY when front. |
| `composables/useCarouselOrbit.ts` | SALVAGE **verbatim** | ONE `SpringProgress` over the ring angle (deg); shortest-signed-delta `setTargetIndex`, interruptible; pure-function per-card falloff; PRM snap. (r7 A-2; source quoted §6.) |
| `composables/useLivePreviewLOD.ts` | SALVAGE, retuned | ONE shared `RAFPlayback` clock; per-card cadence gates; `content-visibility` pause + IO fallback; concurrency cap (§8 policy changes: rear = UNMOUNTED, mobile = front-only). |
| `composables/useSceneStage.ts` | SALVAGE + **commit-funnel REWRITE** | The phase machine (§5) + `requestCommit` settle-funnel (§10) + ARIA prop builders. Routes commit through caller-provided `runSceneSwitch` only. |
| `composables/useStageLight.ts` | SALVAGE | A `SpringProgress` driving `--stage-light` + `--stage-pool-x` on the overlay root (hover-brighten / focus-shift). |
| `composables/useStageGestures.ts` | **NEW** | The gesture grammar (§9): pointer drag with slop + capture, release-velocity → `decayRest` slot projection, wheel accumulation + idle-snap, tap semantics. Emits only `step(dir)` / `centerIndex(i)` / `requestCommit(id)` / `dragAngle(deg)`. |
| `previews/*.ts` (9) | SALVAGE ×7 re-pathed + **NEW** `morph.ts` (+ compose when S.D3 lands) | Thin per-scene idle adapters (prop/provide shapes per the shelf registry contract). |
| `sceneStageRegistry.ts` | SALVAGE, re-derived | id → { target component, adapter, LOD tier }. **Order + membership enumerate from `demo/app/scenes.ts` `scenes[]`** (home excluded — home is a machine state, not a stage; App.vue:314-332) — never a frozen list (p05 F5). |
| `App.vue` (delta ~40L) | edit | Mount `<SceneStage>` as the LAST template sibling (Teleport body); bind phase → scene-host zoom-out style + dock fade/inert; hand `runSceneSwitch` in. |
| `ChromeDock.vue` (delta) | edit | The scene pill's actuation → emit `open-stage`; retire the scene listbox content (§3). |
| `scene-transition.css` (delta) | edit | The `stage` VT type keyframes (§11). |
| `demo/@/styles/design-idioms.css` (delta) | edit | `--stage-key` token + `.dark` parity (§7). |

**NOT lifted, deleted with prejudice:** `StageArrows.vue`, `stageDockKey.ts`, the shelf's
`TransportDock.vue` +86 / `App.vue` +117 wiring (r7 A-8, p05 F6), the scratch
`probe*.mjs`/`verify-*.mjs` scripts.

---

## 5. The state machine

States (the shelf's phases, kept — `useSceneStage.ts` shelf source):

```
closed ──open(fromId)──▶ zooming-out ──zoomOutSettled──▶ fanning-in ──lastCardSettled──▶ carousel
                                                                                        │  ▲
                                                              (spin/drag/wheel — stays) ┘  │
carousel ──requestCommit(id)──▶ committing(armed) ──[settled ∧ front===armed] ∨ failsafe──▶ zooming-in
zooming-in ──VT finished──▶ closed
any non-closed ──Esc / close(×) / dock-pill re-click──▶ zooming-in(cancel: armed=fromSceneId, no machine mutation) ──▶ closed
```

- `committing` is NEW (the shelf lacked it — the commit was a bare method call). It is the
  armed state the gate can read: `data-stage-phase="committing"` +
  `data-stage-armed="<id>"` on the overlay root.
- **Phase → App bindings:** `zooming-out|fanning-in|carousel|committing`: `.scene-host` gets
  the zoom-out style (§6.4) and ChromeDock + EditorShell controls get
  `opacity 0` + `inert` (real `inert` attribute — focus cannot leak behind the modal).
  `zooming-in`/`closed`: released.
- **Cancel ≠ commit:** Esc/× runs the same zoom-in choreography but calls NO machine mutation
  (the origin scene never left — its host un-dims). Distinguish in code: `close()` vs
  `commit()` both set `zooming-in`; only `commit()` calls `runSceneSwitch`.
- Advancers are settle-driven, not timer-driven: `zoomOutSettled` = the zoom spring's
  `settled`; `lastCardSettled` = the fan-in's final stagger delay + orbit `spinning === false`.

---

## 6. Geometry + transform math (pinned — do NOT re-derive)

The N-era numbers are live-verified (IMPL-BLUEPRINT §Verified facts; re-deriving reopens the
`+deg` inversion bug):

1. **Viewport wrapper** (`CarouselDisk` root):
   `perspective: 1100px; perspective-origin: 50% 42%;` (desktop) · `perspective: 900px` ≤640px.
2. **Ring container:** `transform: rotateX(-15deg)` — negative → **back higher** (measured
   back.top 155 < front.top 293). `transform-style: preserve-3d`.
3. **Card i** (N = `scenes.length`, today 8 → `step = 360/N = 45°`; angle
   `a = signedAngle(i·step − ringAngle)` normalized to (−180,180]):
   `transform: rotateY(a) translateZ(R) rotateY(−a) scale(s)` — counter-rotated to face the
   viewer (the cards are billboards on a turntable, not a bent filmstrip — this is the "full
   3D, not a flat strip" mandate: real Z depth, real perspective scaling, correct occlusion).
4. **Radius:** `R = clamp(240, 0.38 × min(vw, 1200), 440)` px desktop;
   `R = clamp(150, 0.52 × vw, 220)` px ≤640 (§12).
5. **Card size:** desktop `width: clamp(220px, 24vw, 320px); aspect-ratio: 3/2`;
   mobile `width: 72vw` (§12).
6. **Falloff** (pure function of `depth = |a|/180`, quadratic ease — shelf `derive()`,
   lifted verbatim): scale `1 − 0.38·d²`, opacity `1 − 0.5·d²` (floor 0.5 — never invisible),
   brightness `1 − 0.22·d²` (darks LIFTED; the unlit tier adds its own 0.5 on the card
   *content*, not the shell), blur `0` until `d > 0.55` then ramp to 1px cap,
   `z-index = round((1−d)·1000)` (occlusion without `preserve-3d` z-fighting).
7. **Zoom-out (the open beat):** ONE `SpringProgress` (`response 0.6, dampingFraction 0.85,
   respectReducedMotion: true`) drives `p: 0→1`; `.scene-host` gets
   `transform: scale(lerp(1, 0.86, p)); opacity: 1−p` while `.stage-dim` opacity = `p`. The
   front card (the origin scene's live preview) fades in during fan-in — an approximate
   hand-off, deliberately NOT a rect-perfect morph (the rect-morph is what made N "janky";
   the VT owns the pixel-perfect morph on the way back IN, §11).
8. **Reflections: CUT.** A `-webkit-box-reflect`/gradient-mask floor reflection doubles every
   live preview's paint cost — the exact S6 "SLOW" failure vector. The floor story is carried
   by the pool + per-card contact shadows (§7 L4), which are static-cost.

---

## 7. The lighting model — exact layer stack + tokens

### Tokens (design-idioms.css `:root` + `.dark`; the two `@property` registrations live in
`SceneStage.vue`'s style block as on the shelf, since they are stage-scoped)

```css
:root {
    /* The drop-light chroma — warm tungsten white beside the gold ramp
       (NOT --color-progress: the shelf keyed the beam to the progress GREEN
       by accident; its own #f5f0e6 fallback shows the warm-white intent). */
    --stage-key: hsl(46 85% 88%);
}
.dark { --stage-key: hsl(45 70% 82%); }

@property --stage-light  { syntax: "<number>"; inherits: true; initial-value: 1; } /* ∈ [0.78, 1] */
@property --stage-pool-x { syntax: "<number>"; inherits: true; initial-value: 0; } /* card-index units */
```

Registered `@property` so the gradients INTERPOLATE as `useStageLight`'s spring moves them
(the whole point of registration — shelf A-5, kept).

### The stack (inside the overlay, bottom → top; all `aria-hidden` + `pointer-events: none`
except the disk):

| # | Layer | Recipe | Theme deltas |
|---|---|---|---|
| L0 | the page | the existing `.grid-background` graph paper shows THROUGH — no new paint | — |
| L1 | `.stage-dim` | the radial vignette scrim, hole tracking the pool: `radial-gradient(130% 105% at calc(50% + (var(--stage-pool-x) − (N−1)/2) · 5%) 70%, color-mix(in srgb, var(--background) 8%, transparent) 0%, … 30% @34%, … calc(84% + (1 − var(--stage-light)) · 10%) @74%, … 96% @100%)` + `backdrop-filter: blur(3px) saturate(0.9)` (shelf recipe, lifted; the `(N−1)/2` centering generalizes the shelf's hardcoded `− 3`) | dark: dusk (bg is near-black → edges darken). light: **vellum fog** (edges frost white). NEVER black — the 96% mix cap is the "never-black" floor. |
| L2 | `.stage-beam` | the drop cone: `clip-path: polygon(40% 0, 60% 0, 96% 100%, 4% 100%)`; `linear-gradient(to bottom, color-mix(in srgb, var(--stage-key) calc(var(--stage-light)·34%), transparent) 0%, …·17% @52%, transparent 92%)`; horizontal feather mask (`transparent 0/18% black/82% black/100% transparent`); `filter: blur(3px)` | `.dark`: `mix-blend-mode: screen` (light adds). light: `mix-blend-mode: normal` at HALF the mix percentages (a warm cast on paper; `screen` over white is invisible). |
| L3 | `.stage-pool` | the floor puddle the ring stands in: `radial-gradient(62% 100%, key·(light·40%) → key·(light·16%) @42% → transparent @74%)`; `blur(10px)`; slides `translateX(calc(-50% + (var(--stage-pool-x) − (N−1)/2) · 6%))` | same blend split as L2 |
| L4 | per-card `.stage-card__shadow` | the grounding ellipse under each card (DK-64 diorama contact shadow): `radial-gradient(50% 100%, rgb(0 0 0 / calc((1−depth) · 0.35)) , transparent 70%)`, width `85%` of card, positioned at the card's floor, scaled with card scale. **Front card only:** the ellipse is tinted `color-mix(in srgb, var(--ball-tone, var(--color-progress)) 20%, black)` — the scene's crayon **footlight** (§1). | light theme alpha 0.22 |
| L5 | the disk (cards) | §6; front card additionally `glass-refract` + specular (glass-ui, CONTROL-on-plate) | — |
| L6 | marquee + chrome | nameplate (Instrument Serif `display-3`, `aria-live=polite`), `n / N` counter (Fira Code `mono-caption`, `text-muted-foreground`), the two glass arrow buttons (≥44px) at pool level flanking the ring, the × close (≥44px, top-right, safe-area-inset aware) | — |

### The light DRIVER (`useStageLight`, salvaged)

ONE `SpringProgress` (`response 0.3, dampingFraction 0.9, respectReducedMotion: true`) per
axis: hovering/focusing flank card *k* targets `--stage-light → 0.86` (the house dims a hair)
and `--stage-pool-x → k` (the pool slides toward it, per L1/L3 transforms); leaving re-targets
`1` and `frontIndex`. On spin, `--stage-pool-x` tracks `frontIndex` — the light follows the
turntable. Values land as `el.style.setProperty("--stage-light", v)` on the overlay root.

---

## 8. The live-preview LOD contract — light = life

Tiers are a pure function of `|a|` (the orbit angle) + the registry's cost tier
(`SceneLodTier: "css" | "svg" | "webgl"` — shelf registry):

| Ring position | Desktop (≥640px) | Mobile (<640px) | What runs |
|---|---|---|---|
| FRONT (`|a| < step/2`) | **LIVE, full** — the shared clock's native cadence (60fps cap) | LIVE, full | the real target, interactive (pointer events pass through) |
| FLANK (`step/2 ≤ |a| < 1.5·step`, the two neighbours) | **LIVE, throttled** — 18fps frame-skip via the per-card `tick` token | **UNLIT** | the real target, idle-driven, `pointer-events: none` |
| REAR (everything else) | **UNLIT** | UNLIT | preview **unmounted** (`v-if`); the card shows the silhouette: scene icon ghost (the colorful inline-SVG from `scenes.ts` at `opacity .35`) + label, whole content `brightness(.5)` — a dark diorama awaiting its light |

Contract specifics (mostly shelf `useLivePreviewLOD`, retuned):

- **ONE clock.** A single `RAFPlayback` loop (engine-owned, inv ζ) publishes `epoch`/`nowMs`;
  each registration's `tick` ref advances only on due frames. No preview owns a rAF. The clock
  self-stops when all cards are paused/unlit and re-arms on demand (shelf behavior, kept).
- **Concurrency bound:** max **3 live** loops desktop (1 full + 2 flank), **1 live** mobile.
  This replaces the shelf's `maxConcurrentFull: 2` demotion dance — the unlit-rear policy makes
  the bound structural, not corrective.
- **The WebGL outlier (amiga, tier `"webgl"`):** LIVE **only at front**; at flank it shows a
  static poster (its card renders `scenes/amiga` checkerboard.jpg-derived poster asset or the
  icon ghost — the ONLY poster allowed, N/IMPL-BLUEPRINT); the Three renderer + context are
  created on entering front and `renderer.dispose()`d ~2s after leaving it (debounced so a
  one-step overshoot doesn't thrash the context). Memory bound: ≤1 GL context ever.
- **Pause correctness:** each live card carries `content-visibility: auto` and pauses on
  `contentvisibilityautostatechange`; `@supports not` → IntersectionObserver fallback (shelf).
  Tab-hidden: `RAFPlayback` already parks with the rAF clock.
- **Isolation:** provide-adapters build ONE fresh demo context per card
  (`sceneStageRegistry` provide contract) — never the live scene's singleton; disposed with
  the card scope. Prop-adapters (cube, square) pass static idle props.
- **Memory bound:** unlit cards hold only the shell + icon (the async target component chunk
  stays warm in Vite's module cache — memory cost is the component instance, which is freed).
  Worst-case resident: 3 live targets + 1 GL context + 8 shells.
- **Acceptance (LOCAL, chrome-devtools-mcp — NOT a CI closure, C-10/se-B4):** perf trace with
  the carousel open ≥55fps; per-frame scripting < 8ms; a mid-spin trace shows no long task
  from LOD churn (the no-overshoot orbit register exists exactly to prevent flank-tier
  flapping — r7 A-2).

---

## 9. Gesture grammar (`useStageGestures`, NEW)

All gestures converge on FOUR verbs: `step(dir)`, `centerIndex(i)`, `dragAngle(deg)`,
`requestCommit(id)`. Nothing else mutates the ring.

| Input | Behavior |
|---|---|
| **Pointer drag** (mouse/touch/pen, anywhere on the disk incl. flank/rear cards; front card only after 8px slop — below slop a front pointerup is a tap) | `setPointerCapture`; live: `dragAngle = angleAtDown + dx · k` fed straight to the orbit spring's target each move (`k = step / (0.55 · cardWidth)` — a card-width swipe ≈ one slot, tuned constant). Select-suppression via the shared `gestureSelectSuppression` seam (`body.is-dragging`, design-idioms.css:849-874). On release: project the landing angle from release velocity with **`decayRest(velocity·k, angle)`** (LIGHT barrel), snap to `round(rest/step)` → `setTargetIndex(nearest)` — a flick travels multiple slots and settles like a real turntable. |
| **Wheel / trackpad** (on the overlay) | Normalize `deltaMode`; accumulate `deltaX` (fallback `deltaY` when `|deltaX| < |deltaY|` — vertical wheels also spin the ring; there is nothing else to scroll in a modal). Every ±120 accumulated units → `step(±1)` (interruptible; the spring re-seats). A 160ms wheel-idle timer clears the accumulator. `preventDefault` (the overlay is modal; no page scroll to preserve). |
| **Click / tap: flank or rear card** | `centerIndex(i)` — browse, never commit (rotate-to-browse). |
| **Click / tap: FRONT card** (≤ slop) | `requestCommit(frontId)` — **commit-by-entering** (the DK-64 verb: you walk into the lit stage). |
| **Arrow buttons (L/R)** | `step(∓1)`; hold = auto-repeat at 280ms after a 400ms delay. |
| **Keys** (overlay keydown) | `←/→` step; `Home/End` jump to first/last; `Enter`/`Space` `requestCommit(centeredId)`; `Esc` cancel-close; printable chars = type-ahead (match scene label prefix → `centerIndex`) — the retired listbox's quick-pick, kept (§3). |
| **Hover / focus a flank** | `useStageLight` dip + pool slide (§7); NO ring motion. |

Mid-spin input is always legal: every verb re-seats the ONE spring from live (value, velocity)
— interruptible by construction (r7 A-2).

---

## 10. THE COMMIT CHAIN — one funnel, provably fires

Every commit-shaped input converges on `requestCommit(id)`. The exact chain:

```
1. requestCommit(id)                     [front-tap | Enter/Space | (nothing else)]
     armedId = id; phase = "committing"
     overlay: data-stage-phase="committing" data-stage-armed=id
     if (frontId !== id) orbit.setTargetIndex(indexOf(id))     // spin-to-front first
     failsafe = setTimeout(fire, 1200)                          // the anti-Q.WC3 belt:
                                                                // a spring ALWAYS settles ≪1.2s,
                                                                // but the commit CANNOT be lost
2. watchEffect: (!orbit.spinning && orbit.frontId === armedId) → fire()
3. fire()   [idempotent: guards phase === "committing"]
     clearTimeout(failsafe); phase = "zooming-in"
     runSceneSwitch(armedId, { stage: true })                   // THE one commit edge — App.vue:382
       └─ useSceneTransition: types = ["stage", forward|backward]   // §11
          startViewTransition(() => {                          // glass-ui motion-core two-arg shape
              machine mutation (switchScene)                   //   (mutate, { types }) — useSceneTransition.ts:78
              stage.phase = "closed"                            // stage exits INSIDE the same VT frame
          }, { types })
     window.__stageLastCommit = { id: armedId, t: performance.now() }   // the gate observable
4. finished.finally → sceneHost.focus()                          // the existing a11y route — useSceneTransition.ts:82-84
     dock un-inerts, controls fade back (phase === "closed" bindings release)
```

- **Cancel path** (Esc/×/pill re-click): same choreography, `runSceneSwitch` is NEVER called,
  `__stageLastCommit` is NOT written — cancel and commit are structurally distinct.
- **Gate contract** (`proof:scene-stage-commits`, browser-actuating, demo-correctness tier):
  open stage → wheel/arrow to a different scene → tap front → assert
  `machine.activeScene === picked` AND `__stageLastCommit.id === picked` AND the URL hash
  moved AND focus is on `.scene-host`. A drag-flick variant asserts the decay projection
  commits after settle. This is the cure for "the swipe that never committed."
- `useSceneTransition.runSceneSwitch` gains the optional `{ stage: true }` second arg
  (backward-compatible; all existing callers unchanged).

---

## 11. DOM placement vs the VT subject + the `stage` transition type

- `<SceneStage>` renders via `Teleport to="body"` as a top-layer FIXED overlay
  (`z-index: var(--z-overlay, 50)`, `isolation: isolate`) — a SIBLING of the app tree, hence
  **outside** `.scene-host`'s `view-transition-name: scene-subject` (App.vue:470-479). No
  element in the stage tree carries any `view-transition-name` — the stage participates only
  in the root snapshot group (r7 A-6, the shelf's load-bearing correctness, preserved).
- The keyed `<Suspense>` stays BARE (no KeepAlive/Transition wrapper — the B.W3 blocker,
  App.vue:139-148). The stage never wraps it; it only styles the sibling `.scene-host` div.
- **The `stage` VT type** (scene-transition.css addition): the commit's reverse-zoom rides the
  View Transition itself — the new scene GROWS out of the stage:

```css
@keyframes kf-scene-stage-enter {
    from { transform: scale(0.9); opacity: 0; }
}
html:active-view-transition-type(stage)::view-transition-new(scene-subject) {
    animation-name: kf-scene-stage-enter;
    animation-duration: 420ms;
    animation-timing-function: var(--ease-out-quart, cubic-bezier(0.25, 1, 0.5, 1));
}
html:active-view-transition-type(stage)::view-transition-old(scene-subject) {
    animation: none; /* the old root (the dimmed carousel frame) cross-fades beneath */
}
```

  `stage` composes with the existing `forward`/`backward` types (types is a set); where
  `view-transition-type` is unsupported the glass-ui wrapper drops types → untyped cross-fade;
  where VT is entirely absent, `useSceneSwap`'s `SpringProgress` dissolve is the free dogfood
  fallback (useSceneSwap.ts:32-51) — three-deep degrade, all pre-existing.

---

## 12. Mobile — the 375px experience, first-class

Same component, same authority, same commit funnel — **no `max-width` fork** (guardrail 1).
Parameter deltas only:

- **Geometry:** `perspective: 900px; perspective-origin: 50% 45%`; `R = clamp(150, 52vw, 220)px`;
  card `width: 72vw; aspect-ratio: 3/2`; ring still `rotateX(-15deg)`. Visible read: the front
  diorama dominant, the two flanks peeking ~12–14% each side, rear cards occluded behind — a
  REDUCED ring, still genuinely 3D (mandate 4's degrade), never a flat strip.
- **LOD:** front-only live (§8) — flanks unlit. On a phone the beam narrows
  (`.stage-beam` width 78% → 96%, clip apex 40/60 → 34/66) so the single lit stage reads
  deliberate, not impoverished.
- **Gestures:** drag-flick with `decayRest` projection is the primary verb; tap flank =
  center; tap front = commit; the L/R arrows remain (44px, at the pool line, thumb-reachable);
  `touch-action: none` on the disk (the overlay is modal — no scroll conflict).
- **Chrome:** the × close button top-right honors `env(safe-area-inset-top/right)`; the
  marquee sits BELOW the ring (`bottom: calc(env(safe-area-inset-bottom) + 12px)`), name at
  `display-4` scale — the mobile type stays audacious (the fleet's mobile audits repeatedly
  flag hollowed-out phone experiences, e.g. easing.md §3; this page must not join them).
- **Invocation:** the same dock scene pill (it is already the mobile scene switcher).
- **Perf honesty:** one live preview + static neighbors ≈ a single scene's cost — the phone
  budget is the current app's budget, not 3×.
- **Gate:** the reborn mobile commit gate at 375px — open → drag-flick → tap front →
  committed (SPEC-v3 S.E5's gate, kept verbatim).

---

## 13. A11y

- **Overlay:** `role="dialog" aria-modal="true" aria-label="Scene stage"`; on open, focus
  moves to the overlay root (`tabindex="-1"`, `nextTick` — shelf pattern); background app tree
  gets `inert` (§5) so the tab order cannot leak; on close, the existing VT `finished` focus
  route lands on `.scene-host` (useSceneTransition.ts:82-84).
- **The ring:** `role="listbox" aria-orientation="horizontal" aria-label="Scenes"` on the
  disk; each card `role="option"`, `aria-selected` = front, `aria-label` = "«Label», n of N".
  Roving focus: the front card is the single tab stop (`tabindex 0`, others −1); arrows move
  the RING (focus stays on the ring per the listbox pattern) — visual focus and `aria-selected`
  always agree because both derive from `frontIndex`.
- **Announcements:** the marquee is `aria-live="polite"` — settling announces
  "Spring, 5 of 8" (shelf pattern, kept). Commit announces nothing extra: the focus move to
  the scene host IS the context-change announcement.
- **Tab order inside the dialog:** ring → previous arrow → next arrow → close. Four stops,
  documented, no traps.
- **Contrast:** unlit-card labels stay ≥4.5:1 (the `brightness(.5)` applies to the icon ghost,
  not the label — the label re-mixes toward `--foreground` per the `.status-badge` AA lineage,
  design-idioms.css:636-641); the falloff opacity floor 0.5 + brightness floor 0.78 keep every
  flank readable (the N "far too dark" correction, structurally).
- **Touch targets:** arrows/close ≥44px; cards are far larger.

---

## 14. Degrade matrix

| Condition | Behavior |
|---|---|
| `prefers-reduced-motion` | **Static lit cards.** Every spring has `respectReducedMotion: true` → orbit/zoom/light SNAP in one emit (kf's own PRM authority); the fan-in stagger collapses to instant mount; the `stage` VT keyframe is inside the existing PRM `animation: none` bracket (scene-transition.css:54-58 + glass-ui view-transition.css) → cut; the beam/pool render at rest values (static theatrical lighting — the LOOK survives, the motion doesn't). |
| No View Transitions | Commit falls to the `SpringProgress` cross-dissolve (useSceneSwap — pre-existing, dogfooded); stage close rides its own opacity spring. |
| No `view-transition-type` (FF/Safari 2026) | glass-ui wrapper drops `types` → untyped cross-fade (pre-existing). |
| No `contentvisibilityautostatechange` | IntersectionObserver pause fallback (shelf, kept). |
| Mobile <640px | §12: reduced ring, front-only live, same authority/commit. |
| WebGL unavailable / context-lost (amiga) | The amiga card falls to its poster tier permanently for the session (listen `webglcontextlost` once); everything else unaffected. |
| JS gesture failure (belt) | Arrows + keys are plain buttons/keydown on the same funnel — the commit path never depends on the pointer grammar. |

---

## 15. Salvage table — n-stage-impl vs authored fresh

| Piece | Disposition | Why |
|---|---|---|
| `useCarouselOrbit.ts` | **VERBATIM** (re-path only) | The canonical dogfood; shortest-delta interruptible single-spring ring; PRM built in (r7 A-2; p05 F1: zero API drift). |
| `useLivePreviewLOD.ts` | **SALVAGE, retuned** | Clock/tick/pause machinery kept; policy changes: rear = unmounted-unlit (not paused-mounted), mobile front-only, GL dispose debounce (§8). |
| `useSceneStage.ts` | **SALVAGE + rewrite of commit** | Phase machine + ARIA builders kept; `commit()` becomes the `requestCommit` settle-funnel + `committing` state + failsafe + observable (§10). |
| `useStageLight.ts` | **VERBATIM** | Already the registered-`@property` spring driver. |
| `SceneStage.vue` lighting CSS | **SALVAGE, re-keyed** | dim/beam/pool recipes kept; beam/pool re-keyed `--color-progress` → `--stage-key` (§7); per-theme blend split added; `(N−1)/2` centering generalized. |
| `CarouselDisk.vue` / `ScenePreviewHost.vue` | **SALVAGE, reworked** | Geometry/reveal/host kept; card shell extracted to `StageCard.vue`; gesture surface delegated. |
| `sceneStageRegistry.ts` + `previews/*` | **SALVAGE, re-pathed + extended** | p05's proven 5-file/23-line re-path; membership re-derived from `scenes.ts`; `previews/morph.ts` authored NEW (p05 F5). |
| `stagger` fan-in | **KEPT** | `stagger(from:'center')` distributes reveal delays (STAGE-SPEC S5). |
| `StageArrows.vue` / `stageDockKey.ts` / `TransportDock` +86 / shelf `App.vue` +117 | **NOT LIFTED — dead** | The second-authority dock surface (r7 A-8); arrows are stage-internal now (§3/§4). |
| `SceneSwitcherCarousel.vue` (Q.WC3) | already excised at R | verify no residue at build. |
| scratch `probe*.mjs` etc. | **NOT LIFTED** | replaced by the named gates (§17). |
| `useStageGestures.ts`, `StageCard.vue`, the `stage` VT type, `--stage-key`, the commit funnel, the unlit tier, ChromeDock pill rewire | **AUTHORED FRESH** | The layers the shelf never had right / never had. |

---

## 16. Dogfood map — which kf primitive drives what (inv ζ)

| Motion | Primitive (all LIGHT barrel) |
|---|---|
| Ring orbit / spin-to-front / drag-follow | `SpringProgress` (angle-space; `response .55 / damping .9`) |
| Zoom-out / zoom-in choreography | `SpringProgress` (`response .6 / damping .85`) |
| Drop-light dip + pool slide | `SpringProgress` (`response .3 / damping .9`) → registered `@property` |
| Fan-in reveal delays | `stagger(from: "center")` |
| The shared LOD clock | `RAFPlayback` (the ONE loop; every preview `tick` derives from it) |
| Flick-release slot projection | `decayRest(velocity, angle)` |
| Preview idle loops (cube/square adapters) | `NumericAnimation` (shelf adapters) |
| No-VT commit dissolve | `SpringProgress` (pre-existing `useSceneSwap`) |
| The commit morph itself | native View Transitions via glass-ui `startViewTransition` (the platform seam the engine round-trips to — not hand-rolled) |

Zero raw `requestAnimationFrame`; zero guessed CSS transitions on load-bearing motion
(the beam/pool statics + card shells are CSS; their *changes* ride the springs).

---

## 17. Gates + acceptance (no scratch probes)

| Gate | Tier | Asserts |
|---|---|---|
| `proof:boundary` | existing, must stay GREEN | LIGHT-barrel/value.js-free stage tree (p05-proven). |
| `proof:stage-geometry` (NEW, playwright-core, shared harness) | demo-correctness | overlay is a body-level sibling with NO `view-transition-name`; ring computed transform matches `rotateX(-15deg)`/`perspective` within tolerance; back-card `rect.top` < front-card `rect.top`; front width > flank width > rear width; no card opacity < 0.4; runs at 375 AND desktop viewports. |
| `proof:scene-stage-commits` (NEW, born-RED until built) | demo-correctness | the §10 gate contract: arrow-commit AND drag-flick-commit both land `machine.activeScene` + `__stageLastCommit` + hash + focus. |
| mobile commit gate @375 (NEW) | demo-correctness | open → flick → tap front → committed, on touch events. |
| fps / scripting budget | **LOCAL chrome-devtools-mcp acceptance** (recorded in the wave doc; NEVER a raw CI fps threshold — C-10) | ≥55fps carousel-open trace; <8ms scripting/frame; no LOD-churn long task mid-spin. |
| lighting look | screenshot acceptance, dark AND light, desktop AND 375 (STAGE-SPEC S10 method) | the beam reads as a shaft; paper visible at edges; no murk; unlit cards legible. |

CI budget: the two browser gates + geometry ride S.A2's ONE shared chromium + served dist
(SPEC-v3 §S.E CI-accounting) — no new launches.

---

## 18. Build order (atomic, each beat live-verified before the next — the owner's own
prescription, N/STAGE-SPEC §Working method)

1. **W1 — salvage lift + re-path + registry re-derive** (p05's mechanical move + `morph.ts`
   + enumerate-from-`scenes.ts`). Gate: `check` 0-error; `proof:boundary` green; each of the
   8 rows mounts a non-error idle preview standalone (runtime, dev harness page).
2. **W2 — the overlay + lighting + geometry at rest** (SceneStage/StageCard/light layers,
   `--stage-key`, unlit tier). Gate: `proof:stage-geometry` green; S10 screenshot acceptance.
3. **W3 — choreography** (pill rewire → open; zoom-out spring; fan-in stagger; orbit +
   gestures incl. drag/wheel/decay). Acceptance: local traces (S2/S5/S7 measurables).
4. **W4 — the commit funnel + `stage` VT type + dock fade/inert**. Gate:
   `proof:scene-stage-commits` flips GREEN (born-RED until here).
5. **W5 — mobile pass @375** (params of §12). Gate: the mobile commit gate.
6. **W6 — LOD hardening + amiga GL lifecycle + the fps local acceptance** (S6's number GREEN).

Each wave commits atomically; no wave starts until the prior wave's gate/acceptance passes.

---

### Evidence index

Shelf: `git show n-stage-impl:demo/@/components/custom/scene-stage/{composables/useCarouselOrbit.ts,composables/useLivePreviewLOD.ts,composables/useSceneStage.ts,SceneStage.vue,sceneStageRegistry.ts}` (HEAD `e2375b8`). Specs: `docs/tranches/N/{STAGE-SPEC.md,IMPL-BLUEPRINT.md}`; `docs/tranches/S/audit/pass1/{SPEC-v3.md §S.E,research/r7-scene-switcher-glassui.md,research/r1-session-history.md §3/Finding 6,prototypes/p05-nstage-rebase.md}`. Live tree: `demo/app/{App.vue,useSceneTransition.ts,useSceneSwap.ts,scene-transition.css,scenes.ts,sceneExposedApi.ts}`; `demo/@/styles/design-idioms.css`; `demo/DESIGN.md`. Baselines: `docs/tranches/S/audit/pass1/design/{home,cube,easing}.md`.
