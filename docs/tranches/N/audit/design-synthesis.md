# Tranche N — design synthesis · the Stage scene-switcher

> **Core-model synthesis** of the 3-lane research triumvirate (`research-visual-motion.md`,
> `research-technical-feasibility.md`, `research-glass-vt-modernweb.md`), 2026-06-17. This
> locks the design direction, the component architecture, the motion choreography, and the
> wave skeleton that `N.md` formalizes and the prototype demonstrates. **DEV + PROTOTYPE
> only.** Implementation opens on explicit authorization (the established dev→impl boundary;
> inv-16 — the demo writes only this repo, consumes published glass-ui).

## The feeling (the DK64 reference, distilled)

A theatrical **downlight stage**: a top-wide → bottom-narrow volumetric spotlight cone
descends to a hot elliptical **floor pool**; ONE scene stands lit center-stage performing a
**living idle**; the ring neighbours fade into shadow on the flanks; an Instrument-Serif
**name-plate** and two **glassy arrows** sit below. Depth is read entirely through darkness.
We render this **redolent, not replicated** — no pixel-art, no DK gradient: a sleek, subtle,
*liquid-glass* theatre that reads in both light and dark.

## The seven locked decisions

1. **LIGHT-barrel discipline (the boundary law).** The entire picker imports ONLY light
   exports — `SpringProgress`, `NumericAnimation`, `SmoothProgress`, `stagger`, `decay`. It
   NEVER imports `loadAnimationEngine` / `fromMotionPath` / `value.js`. The ring orbit is a
   `SpringProgress`/`NumericAnimation` over a **ring-angle scalar** + CSS trig transforms —
   NOT `fromMotionPath` (which is HEAVY and would pull value.js into a light interaction
   layer). `proof:boundary` must stay green with the picker present. (Resolves the R1↔R2/R3
   tension: R1's `fromMotionPath` idea is rejected for the boundary; the motion-path scene's
   *idle preview* traces its shape with a light `NumericAnimation`, not the heavy engine.)

2. **Overlay, never a wrapper (the KeepAlive hard rule).** The stage mounts as a
   **Teleport-to-body Popover-API top-layer overlay** at the modal z-layer, with its OWN
   `view-transition-name`. The keyed `<Suspense>` scene host stays BARE — no `KeepAlive` /
   `<Transition>` wrapper may return (the B.W3 async-loader blank-viewport blocker). The
   selected scene's "state preserved + active" rides the existing **`sceneMachine` snapshot**,
   never a kept-alive vnode.

3. **Motion split — engine for the continuous, VT for the discrete.** The continuous ring
   orbit + spin-to-front + falloff + arrow micro-motion are **engine-driven** (`SpringProgress`
   on `RAFPlayback`, inv ζ — no hand-rolled rAF). **View Transitions** are reserved for the
   TWO discrete morphs only: (a) the dropdown→stage liquid-glass **entry/exit**, and (b) the
   **fade-into-scene commit**. Commit routes through the EXISTING `runSceneSwitch` /
   `startViewTransition` (`useSceneTransition`) — never a forked second nav path; the
   `SpringProgress` cross-dissolve (`useSceneSwap`) remains the no-VT fallback.

4. **Downlight — pure CSS.** A `.stage-plane` with `perspective: 1200px` + `rotateX(15deg)`
   (the ~15° downward tilt). The cone = a `clip-path` trapezoid filled with a `linear-gradient`
   (`mix-blend-mode: screen`, slight blur); the floor pool = a `radial-gradient` ellipse. ONE
   registered `@property --stage-light` (number, 0–1+) scales the cone+pool intensity — the
   hover-brighten variable. A theme-invariant `--stage-void` dark scrim sits under the glass
   cards in BOTH themes; only the cards/arrows pick up the light/dark specular cohort.

5. **Living previews — content-visibility-gated bespoke idle loops (the hard problem).** Each
   ring item is a **bespoke lightweight idle preview**, NOT a real scaled scene (Three.js/Monaco
   are too heavy ×7). Each dogfoods ONE light primitive (spring→needle, motion-path→traveller
   tracing its curve, easing→curve-draw, sequence→stagger wave, cube→tumble, amiga→bob,
   square→drift). `content-visibility: auto` + a `contentvisibilityautostatechange`-gated loop
   pauses off-front previews (only the front + adjacent ~3–5 run); distant ring members render
   as a STATIC poster. `@supports not` → IntersectionObserver fallback; cap concurrent loops.

6. **Glass — the existing ladder, no new recipes.** Stage shell = `.glass-overlay`; ring cards
   = `.glass-floating`/`.glass-card`; arrows + the front plate = `.glass-floating` +
   `.glass-refract` + the pointer-tracked specular `::before` (CONTROL-on-plate is sanctioned;
   PLATE-on-PLATE is banned — keep `.glass-refract` ONLY on arrows + front plate, `@supports`
   gated, degrading to plain blur). Wire `--mouse-x/--mouse-y` per refractive surface, computed
   from the surface's OWN post-transform `getBoundingClientRect` (the 15° tilt breaks the naive
   plane mapping — counter-rotate the front card to face the user).

7. **a11y + reduced-motion first-class.** Keyboard carousel (←/→ spin, Home/End, Enter commits),
   focus routed into the stage on open and to the new scene host on commit, `aria-live` announces
   the centered scene + index ("Cube, 1 of 7"), ≥44px arrow hit-targets. PRM: snap the ring (no
   orbit), freeze `--stage-light` at 1, VT `animation: none` + static specular (glass-ui's PRM
   brackets), the helper's instant-under-PRM entry. The no-VT engine fallback already exists.

## The motion choreography (the beats)

- **Invoke** (dropdown click → stage): a VT shared-element morph "grows" the stage from the
  dock Select trigger; the dimmed live scene recedes behind a smoked-glass scrim; the cone +
  floor pool bloom up; the ring fans in with a `stagger(from:'center')` reveal. ~Liquid, subtle.
- **Orbit / spin-to-front**: a flank click or arrow press sets the ring-angle `SpringProgress`
  target by the **shortest signed delta** (response ~0.55, damping ~0.82 — a hair of overshoot
  = click-into-place); interruptible (re-seats from current x,v). Each item's
  scale/opacity/blur/brightness re-derive per-frame from its live effective angle — ONE
  coherent motion (incoming grows+brightens into the pool, outgoing dims+shrinks+blurs).
- **Arrows express intent**: idle specular shimmer (~3.2s) + a ±3px directional drift loop;
  hover → swell 1.0→1.12 + +18% glass brightness + drift doubles; press → recoil 0.92→1.06→1.0
  + an 8px directional lunge that `decay()`s as it throws the ring.
- **Hover-brighten / focus-shift**: hovering a ring item lifts `--stage-light` toward it (+~0.22)
  and de-emphasises the centre (−~0.12) via a translating fill-light — subtle, ~200ms.
- **Commit** (click center / Enter): spin-to-front (if not already) → the front card morphs into
  the live scene host via the existing `runSceneSwitch` VT → the stage exits → the new scene is
  active with its NEW idle state. State preserved via the `sceneMachine` snapshot.

## Component architecture (proposed)

```
demo/@/components/custom/scene-stage/        # the new picker (LIGHT-barrel only)
├── SceneStage.vue            # the Teleport/Popover overlay shell + downlight + VT entry/exit
├── StageDownlight.vue        # the CSS cone + floor pool + @property --stage-light
├── CarouselRing.vue          # the 7-item turntable; owns the ring-angle SpringProgress + falloff
├── RingItem.vue              # one barrel: glass card + the living preview + counter-rotated face
├── StageArrows.vue           # the two glassy intent-arrows (shimmer/swell/recoil/decay-lunge)
├── ScenePreview.vue          # dispatches a scene id → its bespoke idle-loop preview
├── previews/                 # 7 bespoke idle-loop preview units (one per scene, light dogfood)
├── composables/
│   ├── useRingOrbit.ts       # SpringProgress ring-angle + shortest-delta spin + per-item falloff
│   ├── useStageLight.ts      # the --stage-light hover-brighten/focus-shift authority
│   ├── usePreviewVisibility.ts # content-visibility / IO loop-gating
│   └── useStageA11y.ts       # keyboard carousel + focus + aria-live
└── useSceneStage.ts          # open/close state; invoked from ChromeDock Select; commits via runSceneSwitch
```
Invoked from `ChromeDock`'s scene Select trigger; mounted as a Teleport in `App.vue`; commits
through the existing `runSceneSwitch`. The dock Select stays as the keyboard/AT fallback control.

## The wave skeleton (N.W0 → N.WZ — gate-first / born-RED)

| Wave | Title | Born-RED gate / observable |
|---|---|---|
| **N.W0** | Design synthesis + research fold + prototype + the path forward (DEV, now) | the synthesis + 3 briefs + the runnable prototype + the wave specs on disk; src/demo unwritten (inv-16) |
| **N.W1** | The Stage shell — Teleport/Popover overlay + downlight (CSS cone+pool, `@property --stage-light`, 15° plane) + the liquid-glass entry/exit VT, invoked from the dock Select | clicking the dock Select opens a top-layer stage rendering the cone+pool; closes; the keyed Suspense host stays bare (no KeepAlive) |
| **N.W2** | The carousel ring engine (LIGHT-barrel dogfood) — 7-item turntable, `SpringProgress` ring-angle + trig falloff, shortest-delta interruptible spin-to-front, `stagger` reveal | a flank click spins it to centre via SpringProgress; `proof:boundary` GREEN with the picker present (no heavy import) |
| **N.W3** | The two glassy intent-arrows — `.glass-refract` chevrons, idle shimmer+drift, hover swell, press recoil + `decay()` lunge, ≥44px, keyboard | arrows render glassy, animate on hover/press, and throw the ring |
| **N.W4** | The living previews — 7 bespoke idle loops (each a LIGHT dogfood), content-visibility-gated loop pause, distant static poster | each visible ring item shows a living idle; off-front loops are paused (perf budget held) |
| **N.W5** | The per-scene NEW interactive idle states in the LIVE scenes (the selected/active scene gains a distinct interactive idle) | each of the 7 live scenes has a new, distinct, interactive idle state |
| **N.W6** | Hover-brighten + focus-shift + the commit handoff — `--stage-light` lifts toward hover / de-emphasises centre; commit → spin-to-front → fade-into-scene via `runSceneSwitch`, state preserved | hover measurably lifts `--stage-light`; commit routes through `runSceneSwitch` + preserves scene state |
| **N.W7** | a11y + reduced-motion + the no-VT fallback + the perf budget | PRM snaps the ring + freezes `--stage-light`; keyboard carousel + focus + aria-live; frame budget held |
| **N.WZ** | Close — production integration (the stage supersedes the dropdown), FINAL, deferred ledger, version cut, deploy round-trip | the production demo switch IS the stage; `proof:all` GREEN; the round-trip observed |

**Constellation note:** N is keyframes.js-internal (inv-16); it consumes published glass-ui
(`~4.0.0` — `.glass-overlay`/`.glass-floating`/`.glass-refract`/specular, `motion-core`
`startViewTransition`). N's gates follow the current discipline; if Tranche M (the gate-apparatus
consolidation) lands first, N's gates migrate to the M report-all runner. N is independent of M.

## Top risks carried into the waves (with their locked mitigations)

- **Heavy-chunk leak** → LIGHT-barrel-only picker; `proof:boundary` is an N.W2 gate.
- **KeepAlive re-break** → bare keyed Suspense; state via sceneMachine snapshot; overlay is separate.
- **8 live previews tank perf** → content-visibility loop-gating + distant static posters (N.W4).
- **VT name collisions** → assign the transient `view-transition-name` immediately before the
  mutation, REMOVE it in `.finished.finally()`.
- **backdrop-filter GPU cost / PLATE-on-PLATE muddiness** → `.glass-refract` only on arrows +
  front plate (`@supports`-gated); cards use plain ladder rungs; honour the depth-3 cap.
- **anchor-positioning unshipped** → Popover top-layer + VT shared-element morph, not `anchor()`.
- **15° tilt breaks hit-targets / specular math** → counter-rotate the front card; compute
  specular coords from the post-transform rect.
- **content-visibility recent Baseline (older Safari)** → `@supports not` → IntersectionObserver.
