# iOS animation — general + the HIG animation-audit framework

**Tranche C · audit/animation · inv ζ (dogfood the engine) · inv-16 (read-all, write keyframes.js)**

**Lane.** The *general* iOS-animation lane: the Apple HIG motion principles, the
12 classic animation principles applied to UI, the iOS spring model, and a
reusable **animation-audit framework** (the rubric) — then that rubric applied
to the constellation's animatable surfaces (the keyframes demo scenes — the
cube idle-bob, the spring/easing demos; the dock; the slides). The dock and
slides get their own deep dives in the sibling reports
(`ios-dock-animation.md`, `dock-harden.md`, `slides-facility.md`); this report
is the **framework they all hang off**, plus the demo-scene findings nobody
else owns, plus the **concrete spring-preset / curve table per interaction
class** the whole constellation should standardize on.

**Scope (inv-16):** READ across all repos. WRITE only under `keyframes.js`.
glass-ui / value.js / slides are vendor-owned; their findings are AUDIT +
RECOMMENDATIONS routed outward (asks), never patches.

**Grounding.** Every finding is `file:line`. The spring metrics are computed
from the analytic solver in `src/animation/spring.ts` (script below; numbers
reproduced in §4).

---

## TL;DR — the thesis in one breath

**keyframes.js already ships the iOS spring engine.** `SpringProgress`
(`src/animation/spring.ts:82`) is the analytic SwiftUI
`.spring(response, dampingFraction)` solver — the underdamped / critical /
overdamped closed form, re-seatable mid-flight for interruptible gestures
(`spring.ts:158` `set target`), settling via threshold (`spring.ts:299`), with
a free **reduced-motion snap** baked into the one `withReducedMotion` gate
(`spring.ts:170`). `springTimingFunction` (`springTimingFunction.ts:65`) turns
any `(response, dampingFraction)` into a typed `Easing` — a callable JS curve
**and** its CSS `linear()` twin, one curve in two forms — so the same spring
drives `ElementMorph`, `NumericAnimation`, `Animation.addFrame`, AND a WAAPI
compositor delegation. The four canonical presets exist
(`demo/spring/springPresets.ts:17`).

**The constellation under-routes its motion through that engine.** Across the
demo, the dock, and the slides, the *high-frequency, high-visibility* motion —
panel reveals, the cube idle-bob, header morphs, every UI-chrome transition —
rides **monotone cubic-bezier CSS tokens** (`var(--ease-standard)`), not the
spring. The spring is dogfooded in exactly the places built to *show off the
spring* (the Spring scene) and almost nowhere it would *feel like iOS*. And the
single biggest accessibility lever — `respectReducedMotion`, which the engine
implements and gates centrally — is invoked in **zero** demo sites
(grep: `respectReducedMotion` in `demo/**` non-dist → 0 hits). The CSS-keyframe
idle-bob and the `var(--ease-standard)` transitions get **no** reduced-motion
treatment at all unless the consumer hand-writes a `@media` block, which none
do.

The gestalt to recommend: **route all motion through the engine** — adopt the
preset table in §6, drive interruptible/continuity motion with `SpringProgress`
or `springTimingFunction`, and flip `respectReducedMotion: true` everywhere so
reduced-motion comes for free from the one gate the engine already owns.

---

## Part I — The HIG motion principles (research)

Apple's [Motion HIG](https://developer.apple.com/design/human-interface-guidelines/motion)
is short and prescriptive. The load-bearing directives:

| HIG directive | Phrasing (paraphrased from the HIG) | Audit consequence |
|---|---|---|
| **Purposeful motion** | "focus on intentional animations that keep people oriented, provide clear feedback…and help them learn your interface without getting overwhelmed." | Motion must *mean* something — a state change, a spatial relationship. Decorative loops that don't telegraph state (an infinite idle-bob) are the first thing reduced-motion should kill. |
| **Communicate through motion** | "show how things change, what will happen when people perform an action, and what they can do next." | A press should *lift*; a panel should come *from* its trigger (shared-element). A cross-dissolve that erases the spatial relationship under-communicates. |
| **Realism / credibility** | "motion that…appears to defy physical laws can make them feel disoriented." | This is the spring mandate. A spring *is* physics; a fixed-duration cubic-bezier approximating a spring is a forgery that breaks the moment it's interrupted. |
| **Avoid excessive / frequent motion** | "avoid adding motion to interactions that occur frequently. The system already provides subtle animations." | The highest-frequency interactions (hover, press) want the *least* but *snappiest* motion — short response, near-critical damping — not a 3 s alternating loop. |
| **Make animations optional** | "When the option to reduce motion is enabled…minimize or eliminate application animations." | `prefers-reduced-motion: reduce` is non-negotiable. Apple's substitute is a **cross-dissolve** (opacity-only), never a hard cut. The engine's snap-to-final is the keyframes equivalent. |

**Sources:**
[Apple HIG — Motion](https://developer.apple.com/design/human-interface-guidelines/motion),
[Apple HIG root](https://developer.apple.com/design/human-interface-guidelines/),
[iOS HIG animation (archive)](https://codershigh.github.io/guidelines/ios/human-interface-guidelines/visual-design/animation/index.html).

---

## Part II — The 12 classic principles, applied to UI

The Disney 12 (Thomas & Johnston) map cleanly onto interface motion. The ones
that *bind* on a glass/iOS surface:

1. **Slow-in / slow-out (ease)** — no UI motion is linear. iOS's default cubic
   is `(0.25, 0.1, 0.25, 1.0)` (UIKit `curveEaseInOut`'s underlying default,
   per the [UIKit curve teardown](https://medium.com/@RobertGummesson/a-look-at-uiview-animation-curves-part-1-191d9e6de0ab)).
   A spring delivers slow-in/out *for free* — the envelope *is* the ease.
2. **Squash & stretch → scale** — on UI, "squash" is a press scaling to ~0.96
   and springing back. It signals an object has *mass*.
3. **Anticipation** — a small counter-move before the main move (a sheet dips
   before rising). On a spring this is `initialVelocity` opposite the target.
4. **Follow-through / overlapping action** — the overshoot-and-ring of an
   underdamped spring. A neighbour displacing and *recovering* (dock nudge).
5. **Staging / choreography** — multi-element transitions are *staggered*, not
   simultaneous; the eye is led element-to-element (a list cascades in).
6. **Secondary action** — supporting motion (a chevron rotating *while* a panel
   expands) that reinforces the primary without competing.
7. **Timing** — the *response*. Short for frequent/small (100 ms feedback),
   longer for large/spatial (300–500 ms). Past ~500 ms motion reads as sluggish
   ([kvin.me spring guidance](https://www.kvin.me/posts/effortless-ui-spring-animations)).
8. **Arcs / continuity** — shared-element / morph: an element *travels* from A
   to B along a continuous path rather than fading out at A and in at B. iOS's
   signature is this *continuity* transition (the App Store card that grows
   from a tile). `ElementMorph` (`src/animation/morph.ts`) is exactly this
   primitive — rect-to-rect interpolation.

The keyframes engine has a primitive for each: spring (1, 3, 4, 7),
`NumericAnimation`/scale (2), `AnimationGroup` stagger + `scheduler.yield`
batching (5, 6), `ElementMorph` (8).

---

## Part III — The iOS spring model (the math the engine already implements)

SwiftUI exposes **two equivalent two-parameter surfaces** over the same
second-order ODE `x'' + 2ζω₀x' + ω₀²x = ω₀²·target`:

- **`(response, dampingFraction)`** — `ω₀ = 2π/response`, `ζ = dampingFraction`.
  This is **exactly** what `SpringProgressOptions` exposes (`spring.ts:21,27`)
  and how the solver derives `omega`/`zeta`/`omegaD` (`spring.ts:125–130`).
- **`(duration, bounce)`** — iOS 17's perceptual surface. The conversion is
  **`bounce = 1 − dampingFraction`** for `dampingFraction ≤ 1`
  ([kvin.me](https://www.kvin.me/posts/effortless-ui-spring-animations):
  `damping = (1 − bounce)·4π/duration`). So `bounce 0` ⇔ `ζ 1` (critical, no
  overshoot); `bounce 0.15` ⇔ `ζ 0.85` (the `.smooth`/`.snappy` family);
  `bounce 0.3` ⇔ `ζ 0.7`.

SwiftUI's shipped defaults, for calibration:

| SwiftUI | response (s) | dampingFraction | bounce | character |
|---|---|---|---|---|
| `.spring()` (legacy default) | 0.55 | 0.825 | 0.175 | gentle settle, ~1% overshoot |
| `.smooth` | 0.5 | ~0.85 | ~0.15 | no perceptible overshoot |
| `.snappy` | ~0.35 | ~0.85 | ~0.15 | quicker `.smooth` |
| `.bouncy` | 0.5 | ~0.7 | ~0.3 | visible overshoot |
| `.interactiveSpring()` | 0.15 | 0.86 | 0.14 | gesture-tracking, very fast |

**Sources:**
[GetStream SwiftUI spring reference](https://github.com/GetStream/swiftui-spring-animations),
[Animate with springs — WWDC23](https://developer.apple.com/videos/play/wwdc2023/10158/),
[spring(duration:bounce:)](https://developer.apple.com/documentation/SwiftUI/Animation/spring(duration:bounce:blendDuration:)),
[Apple — interactiveSpring](https://developer.apple.com/documentation/swiftui/animation/interactivespring(response:dampingfraction:blendduration:)).

> **Note — gap between the engine and SwiftUI:** `SpringProgress` does **not**
> yet expose the `(duration, bounce)` constructor or a `perceptualDuration`. A
> designer reaching for `.bouncy(duration: 0.4, extraBounce: 0.1)` has to
> hand-convert. A small static factory
> (`SpringProgress.fromBounce({ duration, bounce })`) would close the surface
> parity — **this is the one in-lane code recommendation (§7).**

---

## Part IV — THE ANIMATION-AUDIT FRAMEWORK (the rubric)

Six axes. Each surface scores 0–2 (✗ absent / ◐ partial / ✓ idiomatic). The
rubric is the deliverable; the scorecard (§5) is its application.

### R1 — Timing & easing
*Is the curve physical (spring/ease), and is its response calibrated to the
interaction class (frequent→fast, spatial→longer, never linear, rarely >500 ms)?*
- ✗ linear, or a fixed-duration approximation of a spring.
- ◐ a hand-tuned cubic-bezier ease (`--ease-standard`).
- ✓ a spring (`SpringProgress` / `springTimingFunction`) tuned per §6, with
  overshoot/settle that matches the class.

### R2 — Morphing / shared-element / continuity
*Does an element **travel** between states (arc, rect-to-rect), or does it
fade out here and in there (dissolve, discontinuity)?*
- ✗ cross-fade / hard swap with no spatial link.
- ◐ position transitions but no size/identity continuity.
- ✓ `ElementMorph` or a FLIP-style shared-element with one continuous spring.

### R3 — Choreography / staging
*Are multi-element transitions staggered and led, or do they fire
simultaneously (flat) — and do they yield to the main thread (INP)?*
- ✗ all-at-once, or janky cascade.
- ◐ stagger by hand-set delays.
- ✓ `AnimationGroup` with blend modes + `scheduler.yield` batching
  (`src/animation/group.ts`, `YIELD_BATCH`).

### R4 — Affordance (anticipation / follow-through / squash)
*Does interactive motion telegraph its target and confirm the action — press
lift, overshoot, anticipation dip?*
- ✗ binary on/off, no press feedback.
- ◐ a hover/press transition but monotone (no spring character).
- ✓ press scale + spring lift; overshoot as confirmation.

### R5 — Motion hierarchy / design
*Does motion reinforce focus — the focused element moves most/largest, support
motion is secondary — or does everything move equally (flat, distracting)?*
- ✗ uniform motion everywhere, or gratuitous decorative loops.
- ◐ some differentiation.
- ✓ clear primary/secondary; decorative motion is restrained and disabled under
  reduced-motion.

### R6 — Reduced-motion
*Under `prefers-reduced-motion: reduce`, is motion replaced by a cross-dissolve
/ snap — automatically?*
- ✗ no handling; full motion always.
- ◐ a hand-written `@media (prefers-reduced-motion)` block.
- ✓ `respectReducedMotion: true` → the engine's central `withReducedMotion`
  snap (`src/animation/internal/reduced-motion.ts`), no per-site CSS.

---

## Part V — The scorecard (rubric applied)

| Surface | file:line | R1 timing | R2 morph | R3 choreo | R4 afford | R5 hierarchy | R6 reduced | Verdict |
|---|---|---|---|---|---|---|---|---|
| **Spring scene** | `demo/spring/useSpringDemo.ts` | ✓ | n/a | ◐ | ✓ | ✓ | ✗ | The showcase. Drives `SpringProgress` + `springTimingFunction` live (`:13,14,133`). But shared rAF loop is hand-rolled (`:122`) instead of `RAFPlayback.drive`, and **no** `respectReducedMotion` — the one scene built on the spring still doesn't snap. |
| **Easing scene** | `demo/easing/*` | ◐ | n/a | n/a | n/a | n/a | ✗ | Demonstrates easings; spring curves shown alongside cubic-beziers. Educational, not an interaction surface. |
| **Cube idle-bob** | `demo/cube/CubeTarget.vue:134` | ✗ | n/a | n/a | n/a | ◐ | ✗ | **CSS keyframe** `idle-bob 3s var(--ease-standard) infinite alternate`. Decorative loop on a monotone token, NOT the engine — and the `hover` preset that *is* the engine (`animations.ts:658`, `ease-in-out`) is also un-sprung. No reduced-motion: the bob runs forever for vestibular-sensitive users. |
| **Cube matrix/rotation** | `demo/cube/useCubeAnimations.ts:26,44` | ◐ | n/a | ✓ | n/a | ✓ | ✗ | `AnimationGroup` of three `CSSKeyframesAnimation`s — good choreography, but eased by stored options (default `easeInOutCubic`), never a spring. `respectReducedMotion` not set on the group. |
| **`changeGraphPerspective`** | `useCubeAnimations.ts:90` | ◐ | n/a | n/a | n/a | n/a | ✗ | `easeInBounce` — a *keyframed* bounce, not a spring. Reads as "canned," fixed-duration; can't be interrupted. |
| **Demo UI chrome** (panels, header, timeline, AnimatedText) | `AnimationControlsGroup.vue:470,474`; `EditorHeader.vue:101`; `KeyframeTimeline.vue:429`; `AnimatedText.vue:61,85` | ◐ | ✗ | ✗ | ◐ | ◐ | ✗ | ~Every chrome transition is `var(--ease-standard)`. **One** spring site exists: the controls-group transform on `--spring-snappy` (`AnimationControlsGroup.vue:509`) — proof the path works, applied once. Header `max-width` morph (`:101`) is a *continuity* candidate begging for a spring. |
| **Dock** (glass-ui) | see `ios-dock-animation.md` | ◐ | ◐ | ◐ | ✗ | ◐ | ◐ | Covered in sibling report: spring half-applied, forked 3 ways; hover/press monotone. |
| **Slides** | see `slides-facility.md` | ◐ | ✗ | n/a | n/a | ◐ | ◐ | Covered in sibling report: paging is an opacity+translateX cross-dissolve on monotone cubics; spring tokens shipped but unused. |

**The pattern across all rows:** R1 hovers at ◐ (cubic-bezier, not spring), R6
is uniformly ✗ in the demo. The engine that would lift every ◐ to ✓ is
*already imported* in the same trees.

---

## Part VI — Concrete spring presets & curves per interaction class

This is the standard the whole constellation should converge on. Each row is a
`(response, dampingFraction)` for `SpringProgress` / `springTimingFunction` —
which also emits the `linear()` token via `springLinearStops`. The **measured**
overshoot and settle columns are computed from the analytic solver
(`spring.ts:252` `evaluateAt`; reproduction script in §8) — these are *this
engine's* numbers, not SwiftUI's, so they're load-bearing.

| Interaction class | preset | response | ζ (damping) | bounce (1−ζ) | overshoot | t_peak | settle (±1%) | rationale |
|---|---|---|---|---|---|---|---|---|
| **Hover / press (frequent, small)** | `interactive` | **0.15** | 0.86 | 0.14 | +0.5% | 147 ms | 148 ms | HIG "frequent interactions → subtle, fast." Near-critical so no distracting ring; sub-150 ms so it never gates the next tap. Maps to SwiftUI `.interactiveSpring()`. |
| **Toggle / selection / tab** | `snappy` | **0.35** | 0.65 | 0.35 | **+6.8%** | 230 ms | 359 ms | A *touch* of overshoot = affordance (the control "confirms"). The dock-icon press and tab-indicator slide want this. (`SPRING_PRESETS` already ships it, `springPresets.ts:25`.) |
| **Panel / sheet / reveal (spatial)** | `smooth` | **0.5** | 0.86 | 0.14 | +0.5% | 490 ms | 491 ms | iOS default settle, no perceptible overshoot — substantial spatial change without bounce. SwiftUI `.smooth`. Replaces `var(--ease-standard)` on every panel/header transition. |
| **Playful / emphasis / success** | `bouncy` | **0.5** | 0.45 | 0.55 | **+20.5%** | 280 ms | 452 ms | Pronounced, deliberate overshoot for celebratory/emphasis moments only (copy-confirm, a "done" pulse). Use sparingly (HIG: avoid excessive). |
| **Continuity / shared-element morph** | `smooth` (interruptible) | 0.5 | 0.86 | 0.14 | +0.5% | 490 ms | 491 ms | Drive via **`SpringProgress` live target** (not `springTimingFunction`) so a re-seat mid-flight stays continuous — the App-Store-card grow, the header `max-width` morph. |
| **Idle / ambient (decorative)** | — | — | — | — | — | — | — | **Not a spring.** Decorative loops (cube bob) should be a low-amplitude sine on `Timeline`/`NumericAnimation`, gated by reduced-motion so they *stop entirely* under `reduce`. |
| **Avoid** | `gentle` | 0.7 | 1.0 | 0 | +0.0% | 4587 ms | 3974 ms | Critically damped at this response **settles in ~4 s** — far past the 500 ms sluggish threshold. Keep in the demo as a teaching contrast; **never** ship it on an interaction. |

Two calibration notes from the measurements:
- The shipped `gentle` preset (`springPresets.ts:37`, `response 0.7 / ζ 1.0`)
  is a **teaching artifact, not a UI preset** — 4 s settle. Flag it so nobody
  copies it onto a real control.
- The shipped `smooth` (`ζ 0.86`) is *technically underdamped* — it overshoots
  by a measured +0.5%, imperceptible, matching SwiftUI's `.smooth`. Correct.

---

## Part VII — Recommendations

### In-lane (keyframes.js — WRITE permitted)

1. **`SpringProgress.fromBounce({ duration, bounce })` factory.** Close the
   SwiftUI surface-parity gap (Part III note): accept the iOS 17 perceptual
   `(duration, bounce)` pair, convert `ζ = 1 − bounce` and
   `response = duration` (perceptual), delegate to the existing constructor. No
   new solver — pure surface ergonomics. Mirror on `springTimingFunction`. This
   is the single code change that lets designers paste SwiftUI values verbatim.
2. **Ship the §6 preset table as named exports** beside `springPresets` —
   promote the demo's `SPRING_PRESETS` into the library (`src/animation/`) as
   `SPRING_PRESETS` / `interaction-class` map, so consumers import the curve by
   *intent* (`springTimingFunction(PRESETS.toggle)`) instead of re-deriving
   numbers. Annotate `gentle` as demo-only.
3. **Dogfood `respectReducedMotion` in the demo.** The Spring scene, cube group,
   and any `springTimingFunction`-driven scene should pass
   `respectReducedMotion: true` so the demo *demonstrates* the free
   reduced-motion path the README advertises. Zero today.
4. **Replace the cube idle-bob CSS keyframe** (`CubeTarget.vue:134`) with an
   engine-driven ambient loop (`NumericAnimation` / `Timeline`,
   `respectReducedMotion: true`) so the decorative bob *stops* under `reduce` —
   it's the textbook gratuitous-loop the HIG says to disable.
5. **Re-route the demo UI chrome** off `var(--ease-standard)` onto
   `springTimingFunction(...).css` tokens per §6 (panel/header = `smooth`,
   tab/indicator = `snappy`). The header `max-width` morph
   (`EditorHeader.vue:101`) should be a `SpringProgress`-driven continuity
   transition, not a CSS `transition`.

### Routed outward (asks — glass-ui / slides)

6. **One spring authority.** glass-ui's `--spring-*` tokens
   (`tokens.css:158`) are already keyframes' `springLinearStops()` output —
   good. But `--ease-apple-spring` (`theme.css:303`) is a *separate*
   hand-tuned cubic-bezier overshoot: a second, divergent spring identity.
   Collapse it onto the keyframes twin (detail in `ios-dock-animation.md`).
7. **slides paging → spring.** The highest-leverage dogfood site in the
   constellation; route the deck transition through `springTimingFunction`
   (`.css` twin) or `SpringProgress` for a gesture-swipe (detail in
   `slides-facility.md`).
8. **glass-ui's `--ease-standard` consumers** (the chrome path the demo
   inherits) should expose a spring variant for spatial transitions so
   downstreams get iOS-grade panel motion without per-site CSS.

---

## Part VIII — Empirical reproduction

The §6 overshoot/settle numbers are computed directly from the analytic
underdamped/critical/overdamped closed form in `src/animation/spring.ts:252`
(`evaluateAt`), `target = 1`, `x0 = −1`, `v0 = 0`, sampled at 1 ms:

```js
function peakAndSettle(response, zeta) {
  const w = (2 * Math.PI) / response;
  const wd = zeta < 1 ? w * Math.sqrt(1 - zeta * zeta) : 0;
  const x0 = -1, v0 = 0;                       // start at 0, target 1
  const p = (t) => {
    if (zeta < 1) { const d = Math.exp(-zeta*w*t), A = x0, B = (v0+zeta*w*x0)/wd;
      return 1 + d*(A*Math.cos(wd*t)+B*Math.sin(wd*t)); }
    if (zeta === 1) { const d = Math.exp(-w*t), A = x0, B = v0+w*x0;
      return 1 + d*(A+B*t); }
    const disc = w*Math.sqrt(zeta*zeta-1), r1 = -zeta*w+disc, r2 = -zeta*w-disc;
    const A = (v0-r2*x0)/(r1-r2), B = x0-A;
    return 1 + A*Math.exp(r1*t) + B*Math.exp(r2*t);
  };
  let peak = 0, tPeak = 0, settle = null;
  for (let t = 0; t <= 6; t += 0.001) {
    const v = p(t);
    if (v > peak) { peak = v; tPeak = t; }
    if (settle === null && t > tPeak && Math.abs(v-1) < 0.01 && Math.abs(p(t+0.001)-1) < 0.01)
      settle = t;
  }
  return { overshootPct: (peak-1)*100, tPeakMs: tPeak*1000, settleMs: settle*1000 };
}
```

Measured output (the §6 table):

```
interactive  r=0.15 ζ=0.86   overshoot=+0.5%   t_peak=147ms   settle=148ms
snappy       r=0.35 ζ=0.65   overshoot=+6.8%   t_peak=230ms   settle=359ms
smooth       r=0.5  ζ=0.86   overshoot=+0.5%   t_peak=490ms   settle=491ms
bouncy       r=0.5  ζ=0.45   overshoot=+20.5%  t_peak=280ms   settle=452ms
gentle       r=0.7  ζ=1.0    overshoot=+0.0%   t_peak=4587ms  settle=3974ms   ← demo-only
iOS.spring   r=0.55 ζ=0.825  overshoot=+1.0%   t_peak=487ms   settle=505ms
```

---

## Appendix — sources

- [Apple HIG — Motion](https://developer.apple.com/design/human-interface-guidelines/motion)
- [Apple HIG root](https://developer.apple.com/design/human-interface-guidelines/)
- [iOS HIG — Animation (archive)](https://codershigh.github.io/guidelines/ios/human-interface-guidelines/visual-design/animation/index.html)
- [Animate with springs — WWDC23](https://developer.apple.com/videos/play/wwdc2023/10158/)
- [spring(duration:bounce:blendDuration:)](https://developer.apple.com/documentation/SwiftUI/Animation/spring(duration:bounce:blendDuration:))
- [interactiveSpring(response:dampingFraction:)](https://developer.apple.com/documentation/swiftui/animation/interactivespring(response:dampingfraction:blendduration:))
- [GetStream — SwiftUI Spring Animations reference](https://github.com/GetStream/swiftui-spring-animations)
- [kvin.me — Effortless UI Spring Animations (bounce↔damping math)](https://www.kvin.me/posts/effortless-ui-spring-animations)
- [UIView Animation Curves teardown (Gummesson) — iOS default cubic](https://medium.com/@RobertGummesson/a-look-at-uiview-animation-curves-part-1-191d9e6de0ab)
- [UICubicTimingParameters](https://developer.apple.com/documentation/uikit/uicubictimingparameters)
