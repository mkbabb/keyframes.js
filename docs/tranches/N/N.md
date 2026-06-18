# Tranche N — the Stage scene-switcher · the theatrical downlight carousel

> **DEVELOPMENT PHASE ONLY.** This charters
> `docs/tranches/N/{N.md, PROGRESS.md, waves/N.W0–N.WZ.md}`. No engine or demo source
> is written here. N.W1–N.WZ implementation opens only on explicit authorization —
> exactly the L.W0 / M.W0 dev→impl boundary. inv-16 holds throughout.

## Provenance

Tranche M **chartered 2026-06-17** (the 32-lane deep audit, the gate-apparatus
consolidation, the constellation consume-edge sequencing, the chronic terminal belt).
Tranche N is initiated the same session: the owner's DK64 barrel-selector reference
image (`/Users/mkbabb/Downloads/Donkey+Kong+64_Character+Barrel_2.png.webp` — pure-black
void, a top-narrow → bottom-wide trapezoidal downlight cone, a hot-white elliptical floor
pool, ONE protagonist lit full-scale at centre, shadowed half-scale neighbours fading to
black at the flanks, a ghosted '?' behind, bold nameplate at bottom-centre, red/yellow
chevron arrows flanking) was studied visually. A **3-lane research triumvirate** was
commissioned (visual-motion, technical-feasibility, glass-VT-modern-web), followed by a
**core-model synthesis** (`audit/design-synthesis.md`, 2026-06-17), which locks every
design decision named below. N is **kf-internal** (inv-16 — the demo writes only this
repo, consumes published glass-ui). It is **independent of M** but its gates follow the
M discipline; if M lands first, N's gates migrate to the M report-all runner (the
inv-M-one-runner spine — M.W1).

The synthesis is the authority. This charter formalizes it.

## The premise — the Stage scene-switcher

N builds a **sleek, subtle, liquid-glass theatrical downlight Stage scene-switcher** for
the keyframes.js demo. The design is **redolent of the DK64 barrel selector, not a
replica** — no pixel-art, no DK gradient: a dark-void theatre that reads in both themes,
a CSS spotlight cone descending to a glowing floor pool on a ~15° tilted plane, a 7-item
carousel ring carrying living idle previews, two glassy intent-arrows below, and an
Instrument Serif nameplate. Invoked from the dock scene Select; commits through the
existing `runSceneSwitch` / View-Transitions path.

The Stage is the **showcase instrument** — every primitive it dogfoods is a LIGHT-barrel
export, every idle preview is an advertisement for the library primitive behind it, and
the motion choreography is the engine's finest continuous-motion demonstration.

## The seven locked decisions (non-negotiable)

These decisions are finalized in `audit/design-synthesis.md §"The seven locked decisions"`.
They are not subject to per-wave revision.

### Decision 1 — LIGHT-barrel discipline (the boundary law)

The entire picker imports ONLY light-barrel exports: `SpringProgress`, `NumericAnimation`,
`SmoothProgress`, `stagger`, `decay`. It NEVER imports `loadAnimationEngine`,
`fromMotionPath`, `value.js`, or any heavy-surface symbol. The ring orbit is a
`SpringProgress`/`NumericAnimation` over a **ring-angle scalar** + CSS trig transforms —
NOT `fromMotionPath` (HEAVY, pulls value.js into a light interaction layer). Every idle
preview uses a LIGHT primitive. `proof:boundary` must stay GREEN with the picker present.

### Decision 2 — Overlay, never a wrapper (the KeepAlive hard rule)

The stage mounts as a **Teleport-to-body Popover-API top-layer overlay** with its OWN
`view-transition-name`. The keyed `<Suspense>` scene host stays BARE — no `KeepAlive`,
no `<Transition>` wrapper may return (the B.W3 async-loader blank-viewport blocker is the
recorded footgun). Selected scene state rides the existing **`sceneMachine` snapshot**,
never a kept-alive vnode.

### Decision 3 — Motion split: engine for the continuous, VT for the discrete

The continuous ring orbit, spin-to-front, falloff, and arrow micro-motions are
**engine-driven** (`SpringProgress` on `RAFPlayback`, inv ζ — no hand-rolled rAF). **View
Transitions** are reserved for the TWO discrete morphs only: (a) the dropdown→stage
liquid-glass **entry/exit**, and (b) the **fade-into-scene commit**. Commit routes through
the EXISTING `runSceneSwitch` / `startViewTransition` (`useSceneTransition`) — never a
forked second nav path. `SpringProgress` cross-dissolve (`useSceneSwap`) is the no-VT
fallback (already wired).

### Decision 4 — Downlight: pure CSS

A `.stage-plane` with `perspective: 1200px` + `rotateX(15deg)` (the ~15° downward tilt).
The cone = a `clip-path` trapezoid filled with a `linear-gradient` (`mix-blend-mode:
screen`, `filter: blur(2px)`); the floor pool = a `radial-gradient` ellipse. ONE
registered `@property --stage-light` (`<number>`, 0–1+) scales the cone+pool intensity
(the hover-brighten variable). A theme-invariant `--stage-void` dark scrim (`hsl(0 0% 4%)`)
sits under the glass cards in BOTH themes — the stage void is a constant-dark, never
inheriting the cream substrate. Only the cards and arrows pick up the light/dark specular
cohort.

### Decision 5 — Living previews: content-visibility-gated bespoke idle loops

Each ring item is a **bespoke lightweight idle preview**, NOT a real scaled scene
(Three.js / Monaco are too heavy ×7). Each dogfoods ONE light primitive per scene
identity. `content-visibility: auto` + a `contentvisibilityautostatechange`-gated loop
pauses off-front previews (only the front + adjacent ~3–5 run); distant ring members
render as a STATIC poster. `@supports not` → IntersectionObserver fallback; cap
concurrent loops.

### Decision 6 — Glass: the existing ladder, no new recipes

Stage shell = `.glass-overlay`; ring cards = `.glass-floating`/`.glass-card`; arrows +
the front plate = `.glass-floating` + `.glass-refract` + the pointer-tracked specular
`::before`. CONTROL-on-plate is sanctioned; PLATE-on-PLATE is banned — `.glass-refract`
ONLY on arrows + front plate, `@supports`-gated, degrading to plain blur. Wire
`--mouse-x/--mouse-y` per refractive surface, computed from the surface's OWN post-transform
`getBoundingClientRect` (the 15° tilt breaks the naive plane mapping). Counter-rotate the
front card to face the user flat.

### Decision 7 — a11y + reduced-motion first-class

Keyboard carousel (←/→ spin, Home/End, Enter commits, Escape dismisses), focus routed
into the stage on open and to the new scene host on commit, `aria-live` announces the
centered scene + index ("Spring, 5 of 7"), ≥44px arrow hit-targets. Brightness/blur
falloff is decorative; the nameplate + mono index counter + aria-live + discrete focus
ring carry the selection truth. PRM: snap the ring (no orbit), freeze `--stage-light`
at 1, `animation: none` on VT pseudos (glass-ui's bracket), static specular, instant
stage entry (the helper's `instantUnderReducedMotion`).

## The invariant set carried into N

N carries the full J/K/L/M spine intact. The load-bearing N-bound additions are:

| Invariant | Statement |
|---|---|
| **inv-16** | The demo writes only this repo (inv-16 — kf-internal). Consumes published glass-ui `~4.0.0`; independent of Tranche M. |
| **LIGHT-barrel law** (inv-N-boundary) | The stage picker imports ONLY light exports. The NEW `proof:n-stage-boundary` (N.W2) walks the bundled DEMO import graph rooted at the stage and reds born-RED if any heavy specifier is a STATIC edge reachable from the stage component tree. The existing library-only `proof:boundary` stays GREEN as the library-surface regression floor (it does NOT cover `demo/`). |
| **no-KeepAlive hard rule** | No `KeepAlive` / wrapping `<Transition>` may touch the keyed `<Suspense>` scene host. The B.W3 blank-viewport blocker is the recorded consequence. |
| **gate-first / born-RED** (inv-M-observable-truth) | Every wave authors its gate over the REAL observable FIRST, witnessed born-RED on today's tree. A gate that tests a proxy is not a gate. |
| **inv ζ (engine-dogfood)** | Every continuous loop rides a LIGHT primitive on `RAFPlayback`. No hand-rolled rAF. No `requestAnimationFrame` call outside `RAFPlayback`. |
| **no-legacy / KISS** | No second nav path, no forked VT machinery, no new glass material recipes, no anchor-positioning (not shipped). Reuse the proven substrate. |
| **inv ε** | Every count, evidence anchor, and gate observable is verified against the live tree. No under-count. No proxy substituted for the genuine defect. |

The M-born invariants (`inv-M-one-runner`, `inv-M-observable-truth`, `inv-M-two-axis`)
are inherited as-is; N's gates follow their discipline.

## The motion choreography (the beats)

The reference is the DK64 barrel: darkness is depth, ONE protagonist is protagonist, the
floor pool is the stage, the arrows telegraph. Our translation:

- **Invoke** (dropdown click → stage): a VT shared-element morph grows the stage from the
  dock Select trigger; the dimmed live scene recedes behind a smoked-glass scrim
  (`blur(24px) saturate(0.6) brightness(0.35)`); the cone + floor pool bloom up; the ring
  fans in with `stagger(from:'center')`. ~520ms. Liquid, subtle.
- **Orbit / spin-to-front**: a flank click or arrow press advances the ring-angle
  `SpringProgress` target by the shortest signed delta (response ~0.55, dampingFraction
  ~0.82 — a hair of overshoot = satisfying click-into-place); each item's
  scale/opacity/blur/brightness re-derives per-frame from its live effective angle — ONE
  coherent motion. Interruptible mid-spin (spring re-seats from current x,v).
- **Arrows express intent**: idle specular shimmer (~3.2s) + ±3px directional drift loop;
  hover → swell 1.0→1.12 + +18% glass brightness + drift doubles; press → recoil
  0.92→1.06→1.0 + 8px directional lunge that `decay()`s as it throws the ring.
- **Hover-brighten / focus-shift**: hovering a ring item lifts `--stage-light` toward it
  (+~0.22) and de-emphasises the centre (−~0.12) via a translating fill-light — subtle,
  ~200ms; fires `warmScene(id)`.
- **Commit** (click centre / Enter): spin-to-front → ring settles → lock-in beat (floor
  pool +0.15 brightness one pulse) → front card morphs into the live scene host via the
  existing `runSceneSwitch` VT → stage exits → new scene active. State preserved via
  `sceneMachine` snapshot. Focus routes to scene-host on `finished`.

## The component architecture

```
demo/@/components/custom/scene-stage/        # the new picker (LIGHT-barrel only)
├── SceneStage.vue            # the Teleport/Popover overlay shell + downlight + VT entry/exit
├── StageDownlight.vue        # the CSS cone + floor pool + @property --stage-light
├── CarouselRing.vue          # the 7-item turntable; owns the ring-angle SpringProgress + falloff
├── RingItem.vue              # one barrel: glass card + the living preview + counter-rotated face
├── StageArrows.vue           # the two glassy intent-arrows (shimmer/swell/recoil/decay-lunge)
├── ScenePreview.vue          # dispatches a scene id → its bespoke idle-loop preview
├── previews/                 # 7 bespoke idle-loop preview units (one per scene, light dogfood)
│   ├── CubePreview.vue       # slow 3D tumble — rotateY+rotateX, --face-* colors
│   ├── AmigaPreview.vue      # Boing-ball sine hop — translateY + squash scaleY (2D, NOT three.js)
│   ├── SquarePreview.vue     # breathing box — border-radius + rock + decay() fling on hover
│   ├── EasingPreview.vue     # bezier self-draw (stroke-dashoffset) + ball traces it
│   ├── SpringPreview.vue     # SpringProgress needle flicking to random targets
│   ├── SequencePreview.vue   # stagger wave — dots up, stagger from:'first', 120ms each
│   └── MotionPathPreview.vue # CSS offset-path traveller (NumericAnimation, rotate:auto)
├── composables/
│   ├── useRingOrbit.ts       # SpringProgress ring-angle + shortest-delta spin + per-item falloff
│   ├── useStageLight.ts      # the --stage-light hover-brighten/focus-shift authority
│   ├── usePreviewVisibility.ts # content-visibility / IO loop-gating
│   └── useStageA11y.ts       # keyboard carousel + focus + aria-live
└── useSceneStage.ts          # open/close state; invoked from ChromeDock Select; commits via runSceneSwitch
```

Mounted as a Teleport in `App.vue`. Invoked from `ChromeDock`'s scene Select trigger.
Commits through the existing `runSceneSwitch`. The dock Select stays as the keyboard/AT
fallback control during the N window.

## The bands + the full wave map

**Gate-first / born-RED throughout** (inv-M-observable-truth). Every wave authors its gate
over the REAL breach FIRST, witnessed born-RED on today's tree, before the cure. A gate
that tests a proxy is not a gate.

| Wave | Title | Band | Born-RED gate / observable |
|---|---|---|---|
| **N.W0** | Design synthesis + research fold + prototype spec (DEV, now) | — | the synthesis + 3 briefs + the runnable prototype spec + this charter + the PROGRESS board on disk (inv-16 — src/demo unwritten at W0) |
| **N.W1** | The Stage shell — Teleport/Popover overlay + downlight (CSS cone+pool, `@property --stage-light`, 15° plane) + the liquid-glass entry/exit VT, invoked from the dock Select | A | clicking the dock Select opens a top-layer stage rendering the cone+pool; the stage closes; the keyed Suspense host is BARE (no KeepAlive inserted — `proof:no-keepalive` RED if KeepAlive appears in the stage tree) |
| **N.W2** | The carousel ring engine (LIGHT-barrel dogfood) — 7-item turntable, `SpringProgress` ring-angle + trig falloff, shortest-delta interruptible spin-to-front, `stagger` reveal | A | a flank click spins it to centre via SpringProgress (the angle scalar settles ≤ ε of target); `proof:boundary` GREEN with the picker present (born-RED: a planted `import { loadAnimationEngine }` in any stage module reds the boundary gate — the REAL import-graph observable, not a grep) |
| **N.W3** | The two glassy intent-arrows — `.glass-refract` chevrons, idle shimmer+drift, hover swell, press recoil + `decay()` lunge, ≥44px, keyboard | A | arrows render glassy; hover swell fires (SpringProgress response 0.4); press lunge fires + ring advances; ≥44px hit-target measured on the post-transform rect (born-RED: tap-target area < 44px) |
| **N.W4** | The living previews — 7 bespoke idle loops (each a LIGHT dogfood), content-visibility-gated loop pause, distant static poster | B | each visible ring item shows a living idle loop running on `RAFPlayback`; a ring member scrolled off-front has its loop paused (the `contentvisibilityautostatechange` event.skipped observable — not a tick-count proxy); born-RED: a distant card's RAF continues to tick while content-visibility reports skipped |
| **N.W5** | The per-scene NEW interactive idle states in the LIVE scenes (the selected/active scene gains a distinct interactive idle — the "wake" pose) | B | each of the 7 live scenes has a new, distinct, interactive idle state; `proof:scene-idle-states` asserts each scene component exposes an idle entry that differs from the cold-mounted default (the behaviour-observable: the idle loop is running after mount, not a static screenshot) |
| **N.W6** | Hover-brighten + focus-shift + the commit handoff — `--stage-light` lifts toward hover; commit → spin-to-front → fade-into-scene via `runSceneSwitch`, state preserved | B | hover measurably lifts `--stage-light` (the CSS custom property value read from `getComputedStyle` on the hovered card's ancestor — the REAL observable, not a class-toggle proxy); commit routes through `runSceneSwitch` (the existing VT path — `proof:commit-routes-through-runsceneswitch`, born-RED: commit that forks a second nav path) + preserves scene state (the `sceneMachine` snapshot survives) |
| **N.W7** | a11y + reduced-motion + the no-VT fallback + the perf budget | B | PRM snaps the ring (no orbit animation fires under `prefers-reduced-motion: reduce`) + freezes `--stage-light` at 1 (born-RED: ring spring ticks under PRM); keyboard carousel + focus + aria-live operable; ≥44px arrows confirmed; frame budget held (relative-threshold, not absolute-ms — the CI device-dependence lesson) |
| **N.WZ** | Close — production integration (the stage supersedes the dropdown as the primary scene-selection surface), FINAL, deferred ledger, version cut, deploy round-trip | — | the production demo switch IS the stage (the dock Select triggers it; the old dropdown is demoted or removed); `proof:all` GREEN; the deploy round-trip OBSERVED (CI → deploy → live serves `index-<hash>.js` exact — the live-byte equality, not the gate exit code) |

**DAG:**
N.W0 (now, dev) → **Band A** (N.W1 LEADS — the overlay shell must exist before ring +
arrows; N.W2 ∥ N.W3 follow; N.W3 deps N.W2 for ring-throw) → **Band B** (N.W4 deps N.W2
for visibility-gating; N.W5 ∥ N.W6 ∥ N.W7 after N.W4; N.W5 is kf-scene-internal and
can parallel) → N.WZ (closes when Band A+B green, stage supersedes dropdown, `proof:all`
GREEN, deploy observed).

## The deferred-fold note

N is a NEW tranche — it has no inherited L/M chronic rows. The deferred items it must NOT
re-introduce: the KeepAlive blocker (hard rule, Decision 2), the PLATE-on-PLATE glass
nesting (Decision 6), the hand-rolled rAF (inv ζ), the heavy-engine import (Decision 1).
Any N-born deferred item at N.WZ enters `N/PROGRESS.md §"Open deferrals"` as the
`proof:chronic-closure` N-substrate per the P-invariant-28 protocol. N.WZ re-points the
`CHRONIC_LEDGER` constant from the M substrate to the N substrate in ONE atomic motion.

## The constellation / inv-16 note

N is kf-internal (inv-16). It consumes published glass-ui `~4.0.0` (`.glass-overlay`,
`.glass-floating`, `.glass-refract`, `motion-core` `startViewTransition`,
`view-transition.css` PRM brackets, the spring token set). It requires NO glass-ui
changes — the existing ladder, the shipped refract filter, and the shipped specular
pointer-track machinery are sufficient.

N is **independent of Tranche M** but the two are coordinated as follows:

- If M ships before N's impl opens: N's gates migrate to the M report-all runner
  (`inv-M-one-runner`). The N wave spec files are authored to be runner-agnostic (each
  gate is a `package.json` key in `proof:*`).
- If N's impl opens before M: the N gates ride the current `proof:*` serial runner, and
  the M.W1 migration is the atomic re-point.
- N does NOT wait on M. N does NOT wait on any sibling publish — it is a
  kf-internal demo feature consuming already-published glass-ui 4.0.0.

## The precept reckoning

The N.W0 synthesis found NO precept violations in the existing tree that N introduces.
The following precepts are the live risks N must not violate:

| # | Risk | Precept | N guard |
|---|---|---|---|
| ⚠N1 | Importing `loadAnimationEngine` or `fromMotionPath` into the stage component tree (the HEAVY import into a LIGHT interaction layer) | LIGHT-barrel law / inv-N-boundary | A NEW `proof:n-stage-boundary` (N.W2) walks the bundled DEMO import graph rooted at `SceneStage.vue` and reds on any static heavy edge. **NB:** the existing `proof:boundary` covers the *library* barrel only — it does NOT traverse `demo/` and would stay GREEN on a heavy import in a stage component; the demo-graph walk is the genuine oracle. A bare directory grep is a proxy (greens on an aliased/re-exported import — the L.W11 trap). |
| ⚠N2 | Wrapping the keyed `<Suspense>` host in a `KeepAlive` or `<Transition>` to preserve stage state (the B.W3 blank-viewport blocker re-break) | no-KeepAlive hard rule | `proof:no-keepalive` born-RED: KeepAlive anywhere in the stage or scene-host subtree reds the gate |
| ⚠N3 | Forking a second nav path at commit (duplicating `runSceneSwitch` / `startViewTransition` logic) | no-legacy / KISS | `proof:commit-routes-through-runsceneswitch` — the commit path calls the existing function, verified by a spy on the VT entry point |
| ⚠N4 | Assigning `view-transition-name` to >1 element concurrently (the silent-skip VT name collision) | inv-M-observable-truth | the transient name is assigned immediately before the mutation and removed in `.finished.finally()` — gate asserts no two elements share the name mid-transition |
| ⚠N5 | Running all 7 idle loops simultaneously including rear cards (the frame-budget death + CI device-dependence regression) | inv-L-device-honesty / perf budget | `proof:stage-perf-budget` (N.W7) + `proof:stage-previews-live` (N.W4) use a RELATIVE threshold — a concurrent-`RAFPlayback`-count cap (≤5) and computed-style checks, NOT absolute-ms; `contentvisibilityautostatechange` loop-gating is a gate observable |
| ⚠N6 | Using brightness/blur falloff as the sole selection signal (a11y invisible to AT; fails contrast) | a11y first-class | the nameplate + mono index + `aria-live` + focus ring carry the truth; brightness is decorative |
| ⚠N7 | Hand-rolling a `requestAnimationFrame` loop in the stage or any preview (the inv ζ violation) | inv ζ (engine-dogfood) | `proof:no-raw-raf` born-RED: any `requestAnimationFrame(` call outside `RAFPlayback` in the stage tree reds the gate |
| ⚠N8 | Using CSS anchor-positioning (not shipped in any major browser as of 2026-06-17) | no-legacy / no-polyfill-on-critical-path | no `anchor()` / `position-anchor` / `position-area` CSS in the stage; the `@oddbird/css-anchor-positioning` polyfill is not added |
