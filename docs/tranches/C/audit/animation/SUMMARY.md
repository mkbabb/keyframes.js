# Animation audit — the synthesis (dock · slides · demo · iOS principles)

The consolidation of the 6-lane dock+slides+animation hardening
(`audit/animation/{dock-harden,slides-facility,ios-dock-animation,ios-animation-general,playwright-empirical,affordance-hierarchy}.md`).
Read-only across the constellation; authored in keyframes.js, routed outward
(inv-16). Every motion claim is grounded in a MEASURED value off the running
build (the `playwright-empirical` lane, local playwright at `/tmp/kf-audit`).

## §0 — The one-breath thesis

keyframes.js **ships the iOS spring** — `SpringProgress` is the analytic
SwiftUI `.spring(response, dampingFraction)` solver (`src/animation/spring.ts`),
and `springTimingFunction`/`springLinearStops` turn it into a typed `Easing`
(a callable JS curve AND its CSS `linear()` twin). The constellation's
`--spring-snappy/-smooth/-bouncy/-gentle` tokens ARE `springLinearStops()`
output. **The engine that ships iOS-grade motion is the constellation's own —
yet its motion is dogfooded HALF-way: the one place that runs `SpringProgress`
at runtime (the spring scene) is measurably iOS-grade (0.5% overshoot, settles
to 1e-3); everywhere else hand-rolls CSS/bezier that either forges a spring
(the dock's VT path) or has no spring at all (the scenes, the slide
transitions), and reduced-motion is honored almost nowhere.** The audit's
gestalt — the motion half of C's inv ζ — is: route the constellation's motion
through the engine it already ships, for iOS-grade quality and free
reduced-motion.

## §1 — The measured verdict (empirical, off the running build)

| Surface | Drives it | iOS-grade? | Measured |
|---|---|---|---|
| **Spring scene** | **keyframes `SpringProgress` (JS rAF)** ✅ | **YES** | ball 621→560px, overshoot **0.31px = 0.5%**, settle ~327ms — matches the analytic solver to 1e-3 |
| **Slides transition** (`slides` repo) | CSS `opacity 0.5s` + `transform 0.6s` ease-out | partial | clean cross-dissolve+slide ~473ms, **PRM-gated** — *better motion than the keyframes demo's own scenes*, but ZERO spring (the bundled `--spring-*` tokens go unused) |
| **Dock expand/collapse** | CSS `--dock-motion-resize` (FLIP=spring, **VT=bezier**) | **PARTIAL — forked** | padding springs (real overshoot 8.13→8.00px) but **width HARD-JUMPS 102→192px in ~19ms**; the *VT path* (what modern Chromium shows) plays `--ease-apple-spring` cubic-bezier (+27.5%, **no settle**), NOT the spring |
| **Scene navigation** | nothing — keyed `<Suspense>`, no `<Transition>` | **HARD CUT** | scene-host opacity pinned 1.0 across a ~185ms swap; the `.scene-*` CSS at `App.vue:407-421` confirmed **dead** |
| **Cube idle-bob** | CSS `@keyframes` (NOT the engine) | n/a | translateY 0→5px, `cubic-bezier(0.4,0,0.2,1)`, 3s — a decorative infinite loop reduced-motion should kill |
| **prefers-reduced-motion** | **demo gates NOTHING itself** | **FAIL** | demo CSS has **0** PRM rules; **the JS spring STILL tweens 20 positions under `reduce`** (the demo never sets `respectReducedMotion`); survives only via glass-ui's vendored `*` reset |

## §2 — The iOS principles + the canonical spring presets

From the HIG/UIKit/SwiftUI research (`ios-animation-general.md`,
`ios-dock-animation.md`), the rubric and the preset table keyframes'
`SpringProgress` reproduces exactly:

| SwiftUI preset | response (s) | dampingFraction | bounce | use for |
|---|---|---|---|---|
| `.smooth` | 0.5 | ~0.85 | ~0.15 | panel/sheet present, no overshoot |
| `.snappy` | ~0.35 | ~0.85 | ~0.15 | dock collapse↔expand, quick UI state |
| `.bouncy` | 0.5 | ~0.7 | ~0.3 | playful confirmation, visible overshoot |
| `.interactiveSpring` | 0.15 | 0.86 | 0.14 | **gesture-tracking** (drag, scrub) — interruptible/re-targetable |

The load-bearing principles: **realism** (a spring IS physics; a fixed-duration
bezier approximating a spring is a forgery that breaks the moment it's
interrupted — the dock's VT bezier is exactly this); **communicate through
motion** (a press should *lift*, a panel should come *from* its trigger —
shared-element, not cross-dissolve); **purposeful motion** (a decorative
infinite idle-bob telegraphs no state — reduced-motion's first casualty);
**make animations optional** (PRM is non-negotiable; the substitute is a
cross-dissolve, never a hard cut — the engine's snap-to-final IS the keyframes
equivalent). The highest-frequency interactions (hover/press) want the
snappiest, least motion (short response, near-critical damping), not a 3s loop.

## §3 — The per-target folds (with the hardening corrections)

### keyframes-OWNED (lands in tranche C — extends inv ζ to motion quality)
1. **Scenes morph, not hard-cut.** Restore the cross-scene swap (C.W3 already
   plans this) — driven by the engine (`Timeline`/`SpringProgress` toggling a
   class on a real element), NOT a bare `<Transition>` that re-breaks async
   loading. Remove the dead `.scene-*` CSS (`App.vue:407-421`). iOS substitute
   under PRM: a cross-dissolve, not a cut.
2. **Cube idle-bob on the engine.** Replace the CSS `@keyframes` bob with a
   `NumericAnimation`/`SpringProgress` loop — and gate it on reduced-motion (a
   decorative infinite loop is PRM's first casualty).
3. **Reduced-motion honored — the FAIL.** The demo sets `respectReducedMotion`
   NOWHERE, so even the `SpringProgress` scene tweens under `reduce`. Wire the
   engine's reduced-motion gate through every demo scene (C.W3's
   "reduced-motion honored in the demo" item — the empirical lane proves it is
   currently a hard FAIL, not a soft gap).
4. **Interaction springs = affordance.** Per the affordance lane: a press
   should *lift* (a `.interactiveSpring` scale), telegraphing interactivity
   through motion — dogfood `SpringProgress` for the demo's interactive
   surfaces.

### glass-ui-OWNED (routed outward — the dock-forward plan, CORRECTED)
5. **[CORRECTION to dock-forward WAVE-1] The touch-gate fix is shape B′, not
   shape (A).** The hardening REFUTED shape (A): keyframes' `AnimationMenuBar`
   renders a **live one-tap play button in the collapsed slot** (the iOS
   Now-Playing mini-bar pattern), which shape (A) ("pill = expand-only, no live
   controls") would DELETE — and the plan's citation of that consumer as proof
   shape (A) is safe was a category error (the dock is `always-expanded`, so the
   gate never runs for it). The correct fix (**B′**, which the plan missed):
   on the resolved-TAP branch, do NOT `preventDefault` the touchend — let the
   native compatibility `click` flow to the inner control, and expand the dock
   on that real click (a capture-phase root listener). No `elementFromPoint`,
   no synthetic dispatch, no frame sequencing — it rides the browser's own
   tap→click. Shape (A) becomes an OPT-IN `collapsedDisclosure` mode for docks
   whose summary is genuinely a summary (keyframes `TopDock`, fourier's three).
   The hard gate is a mounted-`GlassDock` INTEGRATION test (the existing
   `useTouchGate.test.ts` unit-tests the gate in isolation and PASSES with the
   bug present — so a gate-level test can never catch it; the
   `GlassDock`↔gate integration is what's untested).
6. **[NEW dock motion headline] VT-path spring parity — the most-seen dock
   animation is non-iOS-grade.** The dock's collapsed↔expanded morph forks its
   timing per engine: the FLIP fallback rides keyframes' `--spring-snappy`
   `linear()` (+6.8%, settles), but the **native View-Transitions path** (the
   default on modern Chromium — what users actually see) uses
   `--ease-apple-spring` = `cubic-bezier(0.175,0.885,0.32,1.275)` (+27.5%, **no
   settle/ring**) — a bezier forgery of a spring, 4× the overshoot, on the
   exact browsers the constellation targets. The fix: point `--vt-ease` for
   `.gl-dock-layer` at the keyframes-derived spring (emit the `linear()` form of
   the same `(response, dampingFraction)` for the VT path). glass-ui's own AT
   tranche books this as `W6-dock-c proof:dock-motion-parity` but it is NOT
   landed (`grep dock-resize-spring` → 0). **This is the single highest-value
   dock MOTION fix — elevate it to the dock-forward WAVE-6 headline; the
   123-LOC `layerProps` fork-deletion is the secondary benefit.**
7. **Press/hover spring lift + the collapse↔expand as a re-targetable spring.**
   The dock's most-frequent interactions (icon press/hover) should ride a short
   `.interactiveSpring` lift; the collapse↔expand, ideally, a runtime
   `SpringProgress` (re-targetable mid-gesture) rather than a frozen CSS
   transition — the iOS dock's defining feel.

### slides-OWNED (routed outward — the slides repo's own tranche)
8. **Slides dogfood the spring it already bundles.** The slide-to-slide
   transition is a hand-rolled CSS `opacity 0.5s`+`translateX 0.6s` ease-out
   with ZERO overshoot — while the `--spring-*` tokens (keyframes
   `springLinearStops` output) ALREADY ship in the slides bundle, unused. Route
   the slide transition through `SpringProgress`/`Timeline` (or at minimum the
   `--spring-smooth` `linear()` token) for an iOS-grade slide morph, and add
   shared-element continuity (a slide should come *from* its trigger, not
   cross-dissolve). slides already PRM-gates — keep that.

## §4 — The other hardening corrections (folded honestly, inv ε)

The adversarial pass corrected several of MY dock-plan claims (recorded so the
plan doesn't ship a known-wrong figure):
- **"zero touch coverage" is FALSE** — `useTouchGate.test.ts` ships (4 tests);
  the real gap is the `GlassDock`↔gate INTEGRATION (corrected in §3.5).
- **"sub-44px coarse-pointer" is already fixed** (`dock.css:1134-1137`) — strike
  it from dock-forward WAVE-5 (the divergence-map §6 had this; the dock-harden
  lane re-confirmed against live source).
- **"keyframes has TWO mutex copies" is FALSE** — `useExclusiveSelect.ts` does
  NOT exist; keyframes has ONE inline mutex. Correct dock-forward WAVE-2's
  retires + the convergence's "2 copies in one repo" claim.
- **WAVE-4 "fourier proves the shape"** overstates — fourier proved the
  *workaround*, not the primitive (a nuance for the wave's framing).

These are folded into the dock-forward plan via a hardening note; the corrected
WAVE-1 ranking (B′) is the substantive edit.

## §5 — Affordance + design hierarchy (the unifying lens)

Per the `affordance-hierarchy` lane: motion is a **design channel**, and the
engine that ships the iOS spring is the channel's source. The two axes —
STATIC (form/layout/type/color — the φ-ladder, the glass tiers) and KINETIC
(motion/spring/choreography) — must agree: a control's visual prominence (its
size, its place on the φ-ladder) should be matched by its motion prominence
(what springs first/most). Today the constellation's STATIC hierarchy is
forked (the φ-ladder, C.W2) and its KINETIC hierarchy is absent (hard cuts, a
bezier-forged dock spring, no PRM). The unifying recommendation: **express
affordance through motion (a press lifts via `.interactiveSpring`) and
hierarchy through choreography (staged `Timeline`, primary-before-secondary),
both dogfooding the engine** — so the design language is one thing, static and
kinetic, sourced from keyframes' spring.

## §6 — The single most important move

**Route the constellation's motion through keyframes' `SpringProgress` /
`springTimingFunction` / `Timeline`** — the engine that already ships the iOS
spring. Concretely, ranked:
1. **keyframes demo:** honor reduced-motion (the measured FAIL), restore the
   scene swap as an engine-driven morph, move the cube bob onto the engine
   (C.W3, extends inv ζ to motion quality).
2. **glass-ui dock:** VT-path spring parity (the most-seen dock animation is
   non-iOS-grade) + the corrected WAVE-1 fix (B′) — routed outward.
3. **slides:** dogfood the spring tokens it already bundles for iOS-grade slide
   transitions — routed outward.

The constellation does not need a new animation system — it needs to use the
one it ships.
