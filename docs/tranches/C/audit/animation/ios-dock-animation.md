# iOS dock-like animation — research → applied to glass-ui's dock

**Tranche C · audit/animation · inv ζ (dogfood the engine)**

**Scope (inv-16):** READ across all repos; WRITE only under `keyframes.js`.
The glass-ui dock is glass-ui-OWNED. This is an AUDIT of the iOS/iPadOS/macOS
dock animation *language*, mapped onto glass-ui's current dock, with
RECOMMENDATIONS routed outward (asks), never a patch of vendor source. Every
finding is grounded in `file:line` and, where empirical, a measurement captured
with the local chromium (`/tmp/kf-audit`, chromium-1223).

**Thesis.** keyframes.js *ships the iOS spring* — `SpringProgress` is the
analytic SwiftUI `.spring(response, dampingFraction)` solver
(`src/animation/spring.ts`), and `springTimingFunction` / `springLinearStops`
already emit it as a callable `Easing` and a CSS `linear()` twin. glass-ui's
dock *already consumes* that engine for ONE interaction (the collapse↔expand
width-morph rides `--spring-snappy`, a token sampled FROM keyframes'
`springLinearStops`). But the consumption is **half-applied and forked three
ways**: (1) the spring is frozen into a fixed-duration CSS `transition`, so it
cannot track a live target (no interruptible gesture) and is time-compressed
3× below its physical settle; (2) the native View-Transition path swaps the
real spring for a *different* hand-tuned cubic-bezier overshoot
(`--ease-apple-spring`), so the same morph has two divergent curves; (3) the
highest-frequency interaction — every icon hover and press — uses a **monotone
cubic-bezier with no spring character at all**. The dock reads as "CSS-eased
glass," not "iOS-grade motion." The fix is to make the dock dogfood the engine
it is one import away from: drive the morph with live `SpringProgress`, unify
on ONE spring authority (the keyframes twin), and give the icon press/hover the
spring lift iOS gives it.

---

## Part I — The iOS dock animation language (research)

The iOS/iPadOS/macOS dock is not one animation; it is a *vocabulary* of six,
each a distinct application of the animation principles. Below: what Apple
does, the principle it serves, and the spring/timing surface it implies.

### I.1 — Magnification (the parabolic hover) · `macOS dock`

When the cursor traverses the macOS dock, the icon under it scales up and its
neighbours scale down with smooth falloff, so the dock surface reads as a
**continuous elastic ribbon** rather than discrete buttons popping. The naïve
implementation (linear size ramp by index distance) *jitters* — icons appear
to shake as they cross size thresholds; Apple's fix is a **cosine falloff**:
each icon's size is `min + (max−min)·cos(θ)` where θ is derived from the
cursor-to-icon distance over the effect width
([Juankpro teardown](https://juankproblog.wordpress.com/2011/02/02/the-magnifying-effect-in-the-mac-os-x-dock/)).
The canonical web reconstruction
([buildui Magnified Dock](https://buildui.com/recipes/magnified-dock)) maps
**cursor distance ∈ [−110px, 0, +110px] → scale ∈ [1, 2.25, 1]** through a
smooth transform, **nudges** neighbours up to 40px away from the cursor, and
animates the size change with a spring (`mass 0.1, stiffness 170, damping 12`).

- **Principle:** *design/motion hierarchy* (the focused icon is largest),
  *affordance* (the ribbon telegraphs which icon a click will hit), *follow-
  through* (neighbours displace and recover).
- **iOS surface:** physical spring `(m 0.1, k 170, c 12)` →
  `ω₀ = √(k/m) = 41.2 rad/s`, `ζ = c/(2√(km)) = 1.46` → **(response ≈ 0.15,
  dampingFraction ≈ 1.46)** — i.e. a *fast, overdamped* tracker (no overshoot;
  the magnification snaps and settles). This is essentially SwiftUI's
  `.interactiveSpring` register (response 0.15), tuned overdamped so the
  ribbon never rings under a moving cursor.
  *(Conversion computed in `/tmp/spring-convert.mjs`: buildui `(0.1,170,12) →
  response 0.1524, ζ 1.4552`.)*

### I.2 — App-launch shared-element morph (icon → full screen) · `iOS / iPadOS`

Tapping a home-screen icon does not cut to the app; the icon **morphs** — its
rounded rect expands and the icon artwork cross-dissolves into the launch
screen, which is the same shape and continues into the running app. iOS 18
generalised this as the **Zoom transition** (the tapped cell morphs into the
incoming view, the same API backing `fullScreenCover` / `sheet`)
([WWDC24 — Enhance your UI animations](https://developer.apple.com/videos/play/wwdc2024/10145/)).
The reverse (close → home) morphs the window back down into the icon's slot.

- **Principle:** *shared-element / morphing* (one continuous object, never a
  cut), *spatial continuity* (the eye tracks the icon's identity through the
  scale), *anticipation* (a tiny scale-down on press precedes the launch).
- **iOS surface:** a position+size+corner-radius **spring morph** in the
  `.spring()`→`.smooth` register (response ≈ 0.5, ζ ≈ 0.86–1.0 — settle without
  visible ring, because a launch overshoot would feel unstable).

### I.3 — Genie / suck minimize · `macOS`

Minimizing a window *sucks* it into its dock slot: the bottom edge shears and
narrows while the top edge lags, the body contorts down a funnel-shaped bezier
path, then collapses into the icon
([Harshil Shah — Recreating the Genie](https://harshil.net/blog/recreating-the-mac-genie-effect/)).
The motion is **non-uniform**: rows are eased along a bezier so the leading
edge accelerates into the slot while the trailing edge follows.

- **Principle:** *morphing* under a non-rigid deformation, *follow-through &
  overlapping action* (top edge trails the bottom), *staging* (the eye is led
  to the destination slot).
- **iOS surface:** a longer, *eased* (not springy) curve — genie is a
  deliberate `ease-in-out`-family deformation, ~0.5–0.7s; the "Scale" alternate
  is a faster spring. For a web dock this is the heavyweight; the *Scale*
  variant (icon-rect scale into slot) is the achievable, principled analogue.

### I.4 — Press / lift spring feedback · `iOS Liquid Glass`

Touching any iOS control scales it down (~0.96) under the finger and **springs
back** on release with a small overshoot — the control feels *physically
depressed and released*, not opacity-toggled. iOS 17+ Liquid Glass controls
add a subtle hover *lift* (scale up + shadow) on pointer devices.

- **Principle:** *affordance* (the control answers the touch), *anticipation*
  (press-down precedes action), *follow-through* (the spring-back overshoot).
- **iOS surface:** `.snappy` / `.interactiveSpring` — **response 0.15–0.3,
  dampingFraction 0.7–0.86**. The press-DOWN is fast and near-critically
  damped; the release-UP rings slightly (ζ ≈ 0.7) so it reads as elastic.

### I.5 — Dock show/hide slide · `macOS auto-hide / iPad`

The auto-hidden dock **slides** up from the screen edge on cursor-approach and
retracts on leave — a translate (+ slight fade), edge-anchored, with an
ease-out reveal and ease-in conceal.

- **Principle:** *staging* (enters from where it lives), *easing asymmetry*
  (decelerate-in on reveal, accelerate-out on hide).
- **iOS surface:** `.smooth` translate, response ≈ 0.35–0.5, ζ = 1 (no
  overshoot — a dock that bounced past its rest edge would read as broken).

### I.6 — The canonical iOS spring presets (the tuning surface)

The whole vocabulary above reduces to one designer surface: SwiftUI's
`(response, dampingFraction)` — exactly the surface `SpringProgress` exposes.
The documented anchors
([Amos Gyamfi](https://medium.com/@amosgyamfi/learning-swiftui-spring-animations-the-basics-and-beyond-4fb032212487),
[createwithswift](https://www.createwithswift.com/understanding-spring-animations-in-swiftui/)):

| SwiftUI preset | response | dampingFraction ζ | character | dock use |
|---|---|---|---|---|
| `.spring()` (default) | **0.55** | **0.825** | balanced, faint ring | full-layer morph |
| `.interactiveSpring()` | **0.15** | **0.86** | fast, gesture-tracking | magnification, drag-follow |
| `.smooth` (dur 0.5, bounce 0) | ~0.5 | ~1.0 | no overshoot | show/hide, launch settle |
| `.snappy` (dur 0.5, bounce 0.15) | ~0.5 | ~0.85 | tiny overshoot | press-back, expand |
| `.bouncy` (dur 0.5, bounce 0.3) | ~0.5 | ~0.70 | clear overshoot | playful affordance |

*(`.spring()` = (0.55, 0.825) and `.interactiveSpring()` = (0.15, 0.86) are the
two values Apple's docs pin numerically; the named presets are duration+bounce
forms that map into this same surface — `bounce ≈ 1 − ζ` for ζ < 1.)*

---

## Part II — What glass-ui's dock does TODAY (grounded + measured)

### II.0 — The engine is already in the building (the good news)

glass-ui's four spring tokens are **generated from keyframes'
`springLinearStops`**. I recovered the exact `(response, dampingFraction)`
behind each token by reproducing the published `linear()` peaks with the
keyframes solver (`/tmp/recover-presets.mjs`, `/tmp/snappy-pin.mjs`):

| token (`tokens.css:158-161`) | published peak | keyframes preset | match |
|---|---|---|---|
| `--spring-smooth` | 1.00502 @ 24.5% | response 0.5, **ζ 0.86** | exact (comment `tokens.css:150-157` confirms ζ=0.86) |
| `--spring-snappy` | 1.06804 @ 16.3% | response 0.5, **ζ 0.65** | exact |
| `--spring-bouncy` | 1.20482 @ 14.3% | response 0.5, **ζ 0.45** | exact |
| `--spring-gentle` | 1.00000 (monotone) | response 0.5, **ζ 1.0** | exact |

So the dock is NOT starting from zero — the spring DNA is shared. The problem
is *how* the dock applies it.

### II.1 — Collapse ↔ expand: a real spring, but FROZEN and TIME-COMPRESSED

The outer collapsed↔expanded width-morph is the dock's headline motion
(`GlassDock.vue:186-194` drives it via `useLayerTransition`). Its CSS authority:

```
dock.css:22   --dock-motion-resize: var(--duration-normal) var(--spring-snappy);
dock.css:383  .dock-layers { transition: width var(--dock-motion-resize); }
```

i.e. **`transition: width 0.3s linear(<snappy stops>)`** (`--duration-normal =
0.3s`, `tokens.css:73`).

**Empirical (`/tmp/dock-motion-probe.mjs`, local chromium, real snappy
stops):** a collapsed→expanded morph (60px → 420px) renders:
- **peak width 444.03px at t = 61ms** — a **+24px (+6.7%) overshoot**, matching
  the snappy spring's 1.068 peak at 16.3% of 0.3s ≈ 49–61ms. *The dock DOES
  visibly spring* — this is genuinely good and rare.
- first within 0.5px of target at **t = 136ms**, then the linear() tail holds
  flat to the 300ms transition end.

**Finding II.1a — the spring is FROZEN into a fixed-duration `transition`.**
A CSS `transition` cannot track a *changing* target. `springTimingFunction`'s
whole point (and `SpringProgress.set target` — `spring.ts:160-180`, the
"re-seat the closed-form solution from current (x,v)" path) is *interruptible*
motion: collapse-mid-expand, drag-follow, gesture. The frozen transition
restarts from 0 on every interruption — the iOS magnification/drag register
(I.1) is unreachable by construction.

**Finding II.1b — the spring is TIME-COMPRESSED ~3×.** `--spring-snappy`'s
`linear()` was sampled over `maxDuration = response × 4 = 2.0s`
(`springLinearStops.ts:50`) and *settles* (reaches and holds 1.000) at ~44.9%
of the curve ≈ **0.90s of true physical time**. The dock plays that same curve
over **0.3s** — a **3.0× compression** (`/tmp/snappy-pin.mjs`). The overshoot
survives (II.1a) but the physical *settle shape* — the slow asymptotic
approach iOS springs are loved for — is crushed into a flat clamp. The curve is
"spring-shaped" but not "spring-paced."

### II.2 — TWO divergent motion authorities for ONE morph (FLIP vs VT)

The width-morph forks on `startViewTransition` support
(`useLayerTransition.ts:56, 121-133`):

- **FLIP fallback** → animates `width` via the `transition` above →
  `--spring-snappy` (the keyframes spring, ζ 0.65).
- **Native View-Transition path** → the browser morphs the snapshot under
  `view-transition.css:53-56`:
  ```
  ::view-transition-group(.gl-dock-layer){
    animation-timing-function: var(--vt-ease, var(--ease-apple-spring)); }
  ```
  with `--vt-ease = var(--ease-apple-spring) = cubic-bezier(0.175, 0.885, 0.32,
  1.275)` (`tokens.css:1240, 177`).

**Finding II.2 — divergence.** The SAME collapse↔expand morph has **two
different curves** depending on browser engine: the keyframes snappy spring
(`ζ 0.65`, peak +6.8%) on the FLIP path, and a hand-tuned cubic-bezier
overshoot (`cubic-bezier(...,1.275)`, a different overshoot magnitude/timing)
on the VT path. The `view-transition.css:51` comment even *claims* "the
`--dock-motion-resize` spring maps here to `--vt-ease`" — but it does not: one
is the keyframes spring, the other is an unrelated bezier. iOS-grade means ONE
motion identity per gesture, engine-independent. (And `cubic-bezier` cannot
express a *settling ring* — only a single overshoot hump — so the VT path is
strictly less faithful than the spring twin it should be using.)

### II.3 — Icon hover / press: NO spring at all (the affordance gap)

The dock's most-touched motion is every icon hover and press
(`dock.css:743-751`):

```
dock.css:729  transition: ... scale var(--dock-motion-fast), ...   /* = 0.2s ease-standard */
dock.css:746  .dock-icon-button:hover  { scale: var(--scale-hover-dock); } /* 1.1 */
dock.css:750  .dock-icon-button:active { scale: var(--scale-press-dock); } /* 0.92 */
```

`--dock-motion-fast = var(--duration-fast) var(--ease-standard) = 0.2s
cubic-bezier(0.4,0,0.2,1)` (`dock.css:20`, `tokens.css:72,164,169`).

**Empirical (`/tmp/icon-scale-probe.mjs`):** the hover scale 1.0→1.1 is
**monotone — peak 1.1000, no overshoot**, settling at ~210ms. Press is the
symmetric monotone case.

**Finding II.3 — the press/lift is non-springy.** This is the largest gap vs
iOS (I.4). On iOS every control press *springs back* with a small overshoot;
here it's a flat `cubic-bezier(0.4,0,0.2,1)` ramp. There's no anticipation, no
follow-through — the affordance principle is half-served (the scale *direction*
is right; the *feel* is not). The engine already has the exact tool:
`springTimingFunction({response:0.3, dampingFraction:0.7})` is the iOS press
register, and its `.css` is a `linear()` string that drops straight into
`transition-timing-function`.

### II.4 — Other interactions, briefly

- **Layer crossfade** (`dock.css:413-446`): opacity 0.2s + a `visibility 0s
  linear` delay hack to hold the leaving pane painted. This is a *cut*, not a
  shared-element morph — correct as a fallback, but the active/leaving panes
  could cross-*morph* (I.2) under the VT group they already tag
  (`gl-dock-layer`). Today the VT group animates the box size but the panes
  hard cross-fade.
- **Show/hide / collapse-delay** (`useDockState.ts`, `collapseDelay 2000`):
  state-machine timing only; the *reveal* itself is the II.1 width-morph. No
  edge-slide register (I.5) — acceptable for an inline dock, but a `fixed`
  bottom dock (`GlassDock.vue:324`) entering/leaving has no spring slide.
- **Reduced motion:** handled globally (`utilities.css` strips `width` from
  transition-property under PRM; `view-transition.css` PRM-zeroes the VT
  animation; comment `dock.css:370-373`). The keyframes engine's own
  `withReducedMotion` gate (`spring.ts:165-180`,
  `internal/reduced-motion.ts`) would give the SAME snap-to-target semantics if
  the dock drove `SpringProgress` directly — so adopting the engine does NOT
  regress PRM; it inherits the canonical gate.

---

## Part III — How it SHOULD animate (iOS-grade, dogfooding the engine)

The mandate: each interaction maps to a keyframes primitive + an iOS
`(response, dampingFraction)` preset. Two adoption tiers — **Tier A** is a
pure-token/CSS change (low risk, no JS), **Tier B** is the live-spring upgrade
(`SpringProgress` driving the morph, unlocks interruption).

### III.1 — Press / lift spring (Tier A — ship first, highest ROI)

The cheapest, highest-impact fix. Replace the monotone scale curve with the
keyframes press-spring twin. No JS — just a token whose value is
`springTimingFunction(...).css`:

```
/* keyframes emits this; glass-ui stores it as a token */
--dock-spring-press: springTimingFunction({response:0.3, dampingFraction:0.7}).css   /* linear(...) */
--dock-motion-press: 0.42s var(--dock-spring-press);   /* 0.42s ≈ response×1.4 settle window */

.dock-icon-button { transition: scale var(--dock-motion-press), ...; }
```

- **press-down (`:active` → 0.92):** snappy, near-critical — use `--spring-snappy`-register (ζ 0.7) so it bites fast.
- **release (back to 1.0) + hover lift (→ 1.1):** the SAME spring rings back ~+3% past rest → the iOS elastic release.
- **Principle served:** affordance + anticipation + follow-through, in one token swap.
- **Empirical target:** peak scale ≈ 1.13 on release-from-press (overshoot past 1.1), settling ~400ms — vs today's flat 1.1000.

### III.2 — Collapse ↔ expand morph (Tier B — live spring)

Make the width-morph a **live `SpringProgress`**, not a frozen transition.
`useLayerTransition` already measures from/to widths (`useLayerTransition.ts:62,
142, 158`); instead of pinning inline `width` and handing off to a CSS
`transition`, drive it:

```ts
const morph = new SpringProgress({ response: 0.5, dampingFraction: 0.65,   // = --spring-snappy
                                   respectReducedMotion: true });
morph.target = toWidth;                       // re-seats from current (x,v) — interruptible
morph.play(w => el.style.width = `${w}px`);   // managed RAFPlayback loop, auto-settles
```

- **Unlocks interruption (Finding II.1a):** collapse-mid-expand re-seats the
  closed-form solution from the live `(width, velocity)` — no restart-from-0.
- **Restores physical pacing (Finding II.1b):** the solver runs in *real
  seconds* (response 0.5 → ~0.9s honest settle), not a 3×-compressed
  `linear()`. The overshoot AND the asymptotic settle both read.
- **PRM:** `respectReducedMotion: true` routes through the engine's
  `withReducedMotion` → snaps to target, one paint (`spring.ts:165-180`) —
  same semantics the global CSS PRM gate gives, now owned by the engine.
- **Preset:** response **0.5**, ζ **0.65** (the existing `--spring-snappy`
  identity) for the expand; consider ζ **0.86** (`--spring-smooth`) for the
  *collapse* (a closing dock shouldn't overshoot inward — asymmetric easing,
  principle I.5).

### III.3 — Unify the VT path on the keyframes spring (Tier A — kill the divergence)

Resolve Finding II.2: point `--vt-ease` (for the dock group) at the **keyframes
spring twin**, not `--ease-apple-spring`:

```
/* the dock VT group should ride the SAME curve as the FLIP path */
::view-transition-group(.gl-dock-layer){
  animation-timing-function: var(--dock-vt-ease, var(--spring-snappy));   /* the keyframes linear() */
  animation-duration: 0.9s;   /* the spring's honest settle, not --duration-normal 0.3s */
}
```

One morph, one curve, engine-independent. The `linear()` twin is *strictly more
faithful* than the cubic-bezier (it can express the settling ring; the bezier
cannot). This also makes the `view-transition.css:51` comment finally TRUE
("the `--dock-motion-resize` spring maps here").

### III.4 — Magnification (Tier B — the iPadOS register, optional/aspirational)

If the dock ever wants the parabolic hover (I.1) — e.g. a media-scrubber or
app-launcher dock — the engine already models it: a per-icon `SpringProgress`
in the **`.interactiveSpring` register (response 0.15, ζ 1.46 overdamped)**
tracking a `scale` target computed from cursor-distance via a **cosine
falloff** over a ~110px window (NOT linear — Apple's anti-jitter lesson, I.1).
`NumericAnimation` over `{scale, nudgeX}` per icon, targets updated on
pointermove, is the zero-alloc primitive for this. Scope this as a *new dock
variant* (`magnify`), not a change to the default dock.

### III.5 — App-launch / icon→panel morph (Tier B — `ElementMorph`)

For a dock icon that opens a panel/popover (the I.2 shared-element register),
`ElementMorph` (`src/animation/morph.ts`) interpolates icon-rect → panel-rect
with `timingFunction: springTimingFunction({response:0.5, dampingFraction:0.86})`
(the `.smooth` launch settle — no overshoot on a launch). This is the principled
upgrade over the current hard opacity crossfade (II.4).

### III.6 — Choreography & staging (the gestalt)

Stagger the layer's children on expand so the dock *unfurls* rather than
snapping wholesale — `NumericAnimation` per child with a per-index delay
(`delay = index × 30ms`), each on the `--spring-snappy` register. iOS docks
stage their contents; a single width-spring with instant-visible children is
the "everything at once" anti-pattern. Principle: staging + design hierarchy.

---

## Part IV — Recommendation summary (routed outward as asks)

| # | interaction | today (file:line, measured) | should be | primitive | preset (resp, ζ) | tier |
|---|---|---|---|---|---|---|
| 1 | **icon press/hover** | monotone `cubic-bezier(0.4,0,0.2,1)`, peak 1.1000, no ring (`dock.css:729,746,750`; II.3) | spring lift + elastic release | `springTimingFunction().css` token | 0.3, 0.7 | **A** |
| 2 | **collapse↔expand** | frozen `transition`, 3× time-compressed, not interruptible (`dock.css:22,383`; II.1) | live spring, interruptible, honest pacing | `SpringProgress` | 0.5, 0.65 (expand) / 0.86 (collapse) | **B** |
| 3 | **VT vs FLIP divergence** | two curves: `--spring-snappy` vs `--ease-apple-spring` (`view-transition.css:55`; II.2) | one curve — the keyframes `linear()` twin | `springLinearStops` token | 0.5, 0.65 | **A** |
| 4 | **layer crossfade** | hard opacity cut (`dock.css:413-446`; II.4) | shared-element morph | `ElementMorph` | 0.5, 0.86 | B |
| 5 | **magnification** | none | cosine-falloff parabolic hover | `SpringProgress` / `NumericAnimation` | 0.15, 1.46 | B (new variant) |
| 6 | **stagger on expand** | all-at-once | unfurl, per-child delay | `NumericAnimation` | 0.5, 0.65 | B |

**Adoption posture (inv ζ).** The dock is ONE import from iOS-grade:
`import { SpringProgress, springTimingFunction } from "@mkbabb/keyframes.js"`.
glass-ui already eats the engine's *output* (the four spring tokens are
`springLinearStops` strings); the next step is eating the engine's *runtime* —
`SpringProgress` for the interruptible morphs (asks 2, 5, 6) and
`springTimingFunction().css` tokens for the CSS-driven ones (asks 1, 3). Tier A
(asks 1 + 3) is pure token/CSS, zero new JS, and removes the worst gaps (dead
press affordance, two-curve divergence) — ship those first. Reduced-motion is
*inherited*, not re-implemented: the engine's `withReducedMotion` gate gives
the dock the same snap-to-target it has today.

---

## Appendix — empirical harnesses (reproducible)

All run against the local chromium (`/tmp/kf-audit`, chromium-1223) and the
keyframes solver. Throwaway probes live in `/tmp`; the measurements:

- `/tmp/spring-convert.mjs` — physical-spring → `(response, ζ)` conversion.
  buildui dock `(m 0.1, k 170, c 12) → response 0.1524, ζ 1.4552`.
- `/tmp/recover-presets.mjs` + `/tmp/snappy-pin.mjs` — recover the
  `(response, ζ)` behind glass-ui's `--spring-*` tokens via keyframes'
  `springLinearStops` (smooth 0.86, snappy 0.65, bouncy 0.45, gentle 1.0 —
  all exact peak matches). Snappy true settle ≈ 0.90s; dock plays it over 0.3s
  → **3.0× compression**.
- `/tmp/dock-motion-probe.mjs` — renders the real `width 0.3s var(--spring-
  snappy)` recipe; collapsed→expanded (60→420px): **peak 444.03px (+6.7%
  overshoot) @ 61ms**, within 0.5px @ 136ms. (Spring overshoot present; settle
  tail compressed.)
- `/tmp/icon-scale-probe.mjs` — renders the real icon `scale 0.2s
  ease-standard` recipe; hover 1.0→1.1: **peak 1.1000, MONOTONE (no spring),
  settle ~210ms**. (The affordance gap.)

### Sources
- [macOS Dock magnification — cosine falloff teardown (Juankpro)](https://juankproblog.wordpress.com/2011/02/02/the-magnifying-effect-in-the-mac-os-x-dock/)
- [buildui — Magnified Dock recipe (SCALE 2.25, DISTANCE 110, NUDGE 40, spring m0.1/k170/c12)](https://buildui.com/recipes/magnified-dock)
- [frontend.fyi — macOS dock hover with CSS](https://www.frontend.fyi/tutorials/macos-dock-hover-animation-with-css)
- [WWDC24 — Enhance your UI animations and transitions (iOS 18 Zoom / shared-element)](https://developer.apple.com/videos/play/wwdc2024/10145/)
- [WWDC23 — Animate with springs](https://developer.apple.com/videos/play/wwdc2023/10158/)
- [Harshil Shah — Recreating the macOS Genie effect (bezier funnel)](https://harshil.net/blog/recreating-the-mac-genie-effect/)
- [macos-defaults — Dock minimize effect (genie vs scale)](https://macos-defaults.com/dock/mineffect.html)
- [Apple Developer — spring(response:dampingFraction:blendDuration:)](https://developer.apple.com/documentation/swiftui/animation/spring(response:dampingfraction:blenduration:))
- [Apple Developer — interactiveSpring(response:dampingFraction:blendDuration:)](https://developer.apple.com/documentation/swiftui/animation/interactivespring(response:dampingfraction:blendduration:))
- [Amos Gyamfi — Learning SwiftUI Spring Animations (.spring 0.55/0.825, .interactiveSpring 0.15/0.86)](https://medium.com/@amosgyamfi/learning-swiftui-spring-animations-the-basics-and-beyond-4fb032212487)
- [createwithswift — Understanding Spring Animations in SwiftUI](https://www.createwithswift.com/understanding-spring-animations-in-swiftui/)
- [GetStream — swiftui-spring-animations reference](https://github.com/GetStream/swiftui-spring-animations)
