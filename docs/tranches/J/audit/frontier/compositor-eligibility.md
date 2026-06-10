# Frontier lane — WIDENING COMPOSITOR DELEGATION (@property registration + per-property splits)

**Lane:** `compositor-eligibility` (FRONTIER-RESEARCH fleet, K-tranche seeding · 2026-06-10,
ATTEMPT 2). **Charter:** can kf's conservative-correct WAAPI delegation (`waapi.ts`) be
*widened* — (a) register `@property` typed customs to make `var()`/`calc()` color/length
animations compositor-runnable; (b) split ONE animation across the delegation boundary
(transform/opacity → WAAPI, color/layout → rAF, phase-locked); (c) emit color stops
PRE-INTERPOLATED in oklab as a multi-keyframe sRGB ramp so WAAPI plays a perceptually-correct
crossfade on the compositor? Method: source surface (cited `file:line`) + the verified June-2026
platform facts (every external claim linked, §Sources) + the J ground-truth corpus
(`audit/sota-landscape.md`, `J.md §WAVE MAP`, the `waapi.ts` header decision-record).

The on-brand test (binding): a proposal earns a K verdict only if it **extends one of kf's
three unique axes** — (1) CSS `@keyframes` round-trip; (2) perceptual oklab interpolation; (3)
weighted layer blending — or its conservative-correct WAAPI-delegation discipline, in a way only
kf could. **The headline finding is adversarial to the lane's own premise:** the widest, most
seductive framings (a) and (c) are KILLs *on the platform physics* — the very properties that
carry kf's unique axes (color, computed length, registered customs) are exactly the ones the
2026 compositor still refuses to accelerate — and the one survivor (b, the per-property split) is
a SMALL, real, on-brand fidelity-and-jank win that the source is already 90% shaped for. A
researched KILL of (a)/(c) is the valuable result: it converts the `waapi.ts` header's terse
decision-note (lines 20-23) into a fleet-verified, frontier-aware permanent boundary.

---

## §0 The decisive prior fact — the source already RECORDED this frontier and pre-decided half of it

Before proposing anything: `waapi.ts:20-23` carries an explicit, frontier-aware decision-record
that the lane brief asks me to research:

> "`var()`/`calc()` stay out for a deliberate, lasting reason beyond 'needs DOM resolution': a
> registered `@property` custom does not composite anyway (it rasterizes per frame), so this
> rejection remains correct even as `@property` reaches Baseline — it is not an incidental
> limitation to revisit."

And the engine ALREADY registers parsed `@property` descriptors with the platform
(`engine.ts:1321` `registerProperties()`, the D-LIB-1 work) — not to composite them, but to make
the native path interpolate a typed custom *smoothly* rather than discretely (the comment at
`engine.ts:1297-1303`). So the `CSS.registerProperty` half of framing (a) is **already shipped**,
for a different and correct reason, and the compositor-eligibility half of (a) was **already
researched and rejected** in the source itself. My job is to (i) VERIFY that decision against the
June-2026 platform (it holds — §1), (ii) check whether anything has changed that reopens it (it
has not), and (iii) find what, if anything, in the *widening* direction is real (only (b) — §3).

**This is not a re-litigation of the Typed-OM-carrier ARCH kill.** That kill was about the
INTERNAL interpolation representation (carrying interp values as `CSSNumericValue` instead of
`ValueUnit`). This lane is about the DELEGATION BOUNDARY — which already-interpolated values get
handed to `Element.animate()` vs ticked on rAF. Distinct surface, distinct decision; called out
explicitly per the charter's "if your direction brushes a kill, distinguish it" requirement
(§4 does the full brush-check).

---

## §1 The platform constraints (verified, June 2026 — the hard edges that kill (a) and (c))

| Fact | Status | Source |
|---|---|---|
| Compositor-accelerated properties (default) | **`transform`, `opacity`, `filter`** — and `clip-path` per the Motion tier-list; SVG + percentage-transforms gained it (Chromium 89+) | Chrome HW-accel blog; Motion tier-list; anime.js |
| `color` / `background-color` animation composites | **NO.** `color` is paint-triggering (Motion tier-list C-tier); `background-color` compositor support is "coming soon" in **Chrome ONLY**, still main-thread / paint elsewhere | Chrome HW-accel blog ("coming soon"); Motion tier-list; anime.js (color absent) |
| Registered `@property` custom animates on the compositor | **NO.** Registered customs substitute as their COMPUTED VALUE → every frame triggers style invalidation + recalc + repaint on the **main thread**; the compositor cannot do `var()` substitution | Bram.us (Rune Lillesveen, Chromium); Motion tier-list ("custom properties always trigger paint") |
| `var()` substitution on the compositor | **NOT IMPLEMENTED.** "Doesn't seem impossible, but would require a substantial amount of work" (Chromium eng.); tracked as Chromium #1411864, unshipped | Bram.us |
| `@property <length-percentage>` resolving `vh`/`cqw` to px AT the compositor | **NO** (follows from the above — it does not composite at all; the px resolution is the LEAST of it) | derived; Bram.us |
| Multiple `Element.animate()` on the same element, DISJOINT properties | **SAFE** under default `composite: "replace"` — replace only collides when two effects touch the SAME property; transform-effect and color-effect coexist | CSS-Tricks additive; Chrome animation-composition |
| WAAPI animations + rAF timestamps share ONE clock | **YES** — `document.timeline.currentTime` is the same monotonic clock the rAF `timestamp` reads; `startTime`/`currentTime` are in that frame; "you can be sure they won't drift" | MDN WAAPI concepts; Smashing precise-timing |
| `linear()` easing prevents hardware acceleration in **Safari** | **YES — confirmed regression.** Safari (desktop + mobile) will NOT trigger HW acceleration when the animation carries a custom `linear()` easing — *even for transform/opacity* | anime.js HW-accel docs |
| `linear()` easing Baseline | Widely Available **2026-06-11** (syntax); the Safari HW-accel exclusion above is an ENGINE behaviour, not a syntax-support gap | linear-easing Baseline; anime.js |

**The two load-bearing structural facts:**

1. **The compositor accelerates a TINY property set — `transform`/`opacity`/`filter`(`/clip-path`)
   — and EVERY property that carries a kf unique axis is OUTSIDE it.** Color (axis 2, perceptual
   oklab) is paint-triggered. Computed/container length (the `cqw`/`vh`/`calc` axis) needs main-
   thread layout. A registered `@property` custom (the axis-1 round-trip's typed customs) rasterizes
   per frame. **The frontier the lane wants to widen INTO is, property-for-property, the set the
   compositor structurally cannot reach.** This is not a Chrome-version-away gap; it is the
   computed-value-substitution architecture (Bram.us / Lillesveen). The `waapi.ts:20-23` note is
   *exactly right* and *frontier-durable*.

2. **Safari's `linear()` HW-accel exclusion is a live hazard for kf's EXISTING delegation, not just
   the widening.** kf delegates only easings with a faithful `.css` twin (`waapi.ts:160-165`), and
   the headline twin is a spring's `linear()` (`toWAAPIOptions`, `waapi.ts:316-318`). On Safari that
   `linear()` *disables the compositor* — so kf's spring-WAAPI path, on Safari, is delegating to a
   MAIN-THREAD WAAPI animation that is strictly worse than the rAF path it could have run (an extra
   keyframe-effect object, the shadow tick loop AND the un-accelerated WAAPI playback). This is a
   MEASURE-FIRST finding about the *current* engine, surfaced by this lane — see §3.0.

---

## §2 What "widening" would even mean — the three framings, stated precisely

The `waapi.ts` ineligible set (`WAAPI_INELIGIBLE_UNITS`, `waapi.ts:30-40`) rejects, per frame:
all viewport/container units, `%` (minus the `offset-distance` path-relative exemption), `var`/
`calc`, and color interpolation. "Widening" = moving some rejected class onto the compositor.

- **(a) `@property` registration → composite `var()`/`calc()`/registered customs.** Register a
  `<color>` or `<length-percentage>` custom, animate IT, let the browser interpolate the typed
  value natively. *Premise:* registration makes the typed value compositor-runnable. **§1 fact 1
  refutes the premise: registered customs do not composite.**
- **(b) Per-property delegation split.** One kf `Animation` whose frames touch BOTH a compositable
  property (`transform`/`opacity`) AND a non-compositable one (a color, a `cqw` width): delegate the
  compositable subset to WAAPI, tick the rest on rAF, phase-locked on the shared clock. *Premise:*
  the split lets the transform ride the compositor while color/layout stay correct on rAF. **§1
  facts 6+7 support the premise — disjoint-property effects coexist, and the clock is shared.**
- **(c) Oklab pre-interpolation as multi-keyframe sRGB.** kf interpolates the color path in oklab on
  the JS side, samples it at N stops, emits those as N sRGB `Keyframe`s, and hands them to WAAPI —
  so the compositor plays a perceptually-correct ramp by piecewise-linear sRGB fill between
  oklab-correct stops (the SAME densification idiom `springLinearStops` and `WAAPI_SUBSEGMENT_STOPS`
  already use for EASING — `waapi.ts:221`). *Premise:* this gives kf compositor-offloaded perceptual
  color, an industry-first. **§1 fact 2 refutes the premise: color does not composite, so the
  "compositor-offloaded" claim is false — the ramp plays on the main thread either way.**

---

## §3 The proposals

### CE-1 — Per-property delegation split (the one survivor)

**What.** Today eligibility is ALL-OR-NOTHING per `Animation`: one ineligible unit anywhere in any
frame sends the WHOLE animation to rAF (`isWAAPIEligible` returns the first failure,
`waapi.ts:98-208`). CE-1 makes eligibility **per-property-partition**: split a frame's `interpVars`
into the COMPOSITABLE subset (transform components + opacity, all uniform-easing, no ineligible
units, no color) and the REMAINDER. Delegate the compositable subset to a WAAPI animation; tick the
remainder on the existing rAF `interpFrames` path; phase-lock both on the shared document clock. A
`fromString` animation that translates a card (compositable) AND fades its `background-color`
perceptually (rAF) AND nudges a `cqw` width (rAF) today rides 100% rAF; under CE-1 the translate
rides the compositor and survives main-thread jank, while color stays oklab-correct and layout stays
pixel-correct on rAF.

**Why only kf.** This is the conservative-correct WAAPI-delegation discipline — kf's recorded
signature (`sota-landscape.md §4` verdict 5; the always-correct-fallback philosophy) — taken from
animation-granularity to **property-granularity**. Motion's hybrid delegates whole animations and is
RGB-naive on color; GSAP doesn't delegate at all. kf is the only engine that (i) already classifies
every interp value by unit/property at frame-compile time (the `interpVars` map keyed by property,
`waapi.ts:167-205`), (ii) already has a per-frame zero-alloc rAF path for the remainder
(`interpFrames`), and (iii) already proved the WAAPI lifecycle handoff (`playWAAPI` shadow tick +
commit-on-finish, `waapi.ts:341-408`). The split is the natural product of kf's existing
per-property classification — no competitor's architecture is shaped for it.

**kfAxis.** Extends the conservative-correct WAAPI-delegation axis (engine-discipline, verdict 5)
from per-animation to per-property; PRESERVES axis 2 (the color subset stays on the rAF oklab path —
the split is the mechanism by which a color-bearing animation finally gets ANY compositor offload
for its transform, which today it forgoes entirely) and the computed-unit axis (cqw stays rAF-
resolved).

**Effort: L.** The eligibility gate becomes a PARTITION function (returns
`{ compositable: PropertySet, remainder: PropertySet, reason? }`) instead of a boolean — a real but
contained refactor of `isWAAPIEligible`. `toWAAPIKeyframes` filters to the compositable subset
(skip the rest in `unflattenObjectToString`, `waapi.ts:264-272`). `playWAAPI` runs the WAAPI subset
AND drives `interpFrames` for the remainder in the shadow tick (today the shadow tick deliberately
does NO `interpFrames` — `waapi.ts:358` — because WAAPI owns ALL visuals; CE-1 makes it own the
remainder's visuals). The lifecycle (pause/resume/stop/reset, the commit-on-finish trap) must hold
across BOTH lanes. **The hazards are real and named below.**

**The hazards (the brief's sync question — answered).**
- *Clock drift: NOT the hazard.* The WAAPI lane and the rAF lane read the SAME clock
  (`document.timeline.currentTime` == the rAF `timestamp`, §1 fact 7). kf's shadow tick already
  calls `advanceTo(now)` with the rAF `now` (`waapi.ts:360-362`); the rAF remainder would sample
  `interpFrames(now)` at that same `now`. There is no two-clock drift to reconcile — the brief's
  feared "WAAPI clock vs rAF clock" is, on the platform, ONE clock. (The genuine 1-frame phase
  question is the *offset alignment*: WAAPI's `easing`/`offset` mapping must match the rAF lane's
  time→progress mapping. Since CE-1 emits the compositable subset through the SAME
  `toWAAPIKeyframes` densification — the true-curve sampling at `waapi.ts:232-275` — the two lanes
  are sampling the same curve; the offset alignment is by-construction, the same isomorphism the
  current whole-animation path already relies on.)
- *Composition collisions: avoided by construction.* Disjoint properties → default `replace` never
  collides (§1 fact 6). The PARTITION guarantees the WAAPI subset and the rAF subset touch
  DISJOINT properties, so the rAF lane writing `style.backgroundColor` never fights the WAAPI lane
  animating `transform`. (The one subtlety: if a single CSS `transform` carries BOTH a compositable
  translate AND a non-compositable computed-unit translate — `translateX(50px) translateY(50cqh)` —
  `transform` is ONE property and cannot be split; that whole `transform` stays on rAF. The
  partition is per-PROPERTY, and `transform` is atomic. Named, not hand-waved.)
- *Safari `linear()` exclusion (§1 fact 8): the partition makes it WORSE if naive, BETTER if
  honest.* On Safari, delegating a spring-`linear()` transform to WAAPI gets a MAIN-THREAD WAAPI
  animation — so CE-1's split would put the transform on un-accelerated WAAPI while the rAF
  remainder runs separately: two main-thread loops where rAF-everything was one. **CE-1 must carry a
  Safari `linear()` guard** (feature-probe HW-accel-with-linear, or UA-gate the spring-`linear()`
  delegation), which is ALSO a fix the current whole-animation path needs (§3.0). This is the
  measure-first gate's core.

**Measure-first gate (the brief's DevTools-tracing requirement).** Two probes, both via
chrome-devtools-mcp performance tracing (the memory rule: chrome-devtools-mcp for live debugging,
headless playwright-core for CI):
1. *Compositor-residence proof.* Trace a translate+color+cqw `fromString` animation under a busy
   main thread (a planted long-task storm). Assert the translate stays 60fps (compositor frames in
   the trace's "Compositor" track, ZERO main-thread style/paint for the transform) while the color
   ramp + cqw width tick on rAF. Born-RED witness: on the pre-CE-1 tree the SAME animation drops
   frames on the transform under the storm (it's 100% rAF today). This is the whole justification —
   if the trace does NOT show the transform surviving the storm, CE-1 buys nothing and is KILLED.
2. *The Safari guard bites.* On WebKit (Playwright's `webkit` channel), assert that a
   spring-`linear()` transform is NOT delegated to WAAPI (the guard holds it on rAF), because Safari
   would run it main-thread anyway — verified by the absence of a WAAPI animation on the element AND
   the rAF path's frame budget.

**ARCH-kill distinction.** NOT ScrollTimeline-native-REPLACE (no scroll, no native-timeline replace
of the JS driver — the JS progress driver is untouched; this is wall-clock WAAPI delegation, the
SAME surface `playWAAPI` already occupies). NOT Worker/OffscreenCanvas/Houdini (no worklet, no paint
API — it's `Element.animate()`). NOT WASM-parser. **NOT Typed-OM-as-carrier** — the interp values
stay `ValueUnit`; CE-1 changes only WHICH already-interpolated property strings get handed to
`Element.animate()` vs written by `interpFrames`. NOT per-property *easing* (the kill was about
per-stop timing functions WITHIN a property; CE-1 keeps one uniform easing per delegated property
and delegates only uniform-easing properties — it's per-property DELEGATION, not per-property
easing). NOT bit-packing, NOT monomorphization. Brushes nothing.

**Verdict: K-CANDIDATE.** Real, on-brand (the delegation-discipline axis at finer grain),
only-kf-shaped, and the source is 90% there (per-property classification exists; the WAAPI lifecycle
exists; the shared clock removes the feared hazard). Held back from HEADLINE by: L-effort across a
delicate dual-lane lifecycle, the Safari `linear()` complication, and an honest measure-first
question of *how often a real kf workload mixes a compositable transform with a non-compositable
color/layout property in the SAME animation* — if the common case is "transform-only" (already fully
eligible) or "color-only" (nothing to delegate), the split's addressable workload is thin. The
measure-first gate must FIRST establish that the mixed-property animation is a real corpus, not a
constructed one. **K-CANDIDATE, gated on a workload census + the compositor-residence trace.**

---

### §3.0 (folded finding) — the Safari `linear()` HW-accel hazard in the CURRENT path → J.W6

Surfaced by this lane, independent of any widening: kf's existing spring-WAAPI delegation emits
`linear()` (`waapi.ts:316-318`), and Safari refuses HW acceleration for `linear()`-eased animations
(§1 fact 8). So TODAY, on Safari, a delegated spring animation runs on un-accelerated WAAPI — an
extra effect object + the shadow tick loop wrapping a main-thread animation that is *no faster than,
and structurally heavier than, the rAF path it bypassed*. This is a conservative-correctness LEAK
(the delegation is supposed to only ever trade a perf opportunity, never make things worse —
`waapi.ts:24-28`). The cure is a Safari `linear()`-HW-accel feature-probe that holds spring-`linear()`
delegation on rAF for WebKit (or, more precisely, a probe of "does this UA hardware-accelerate a
`linear()`-eased transform"). **This is a measure-first item with a clear born-RED witness (trace a
Safari spring-WAAPI animation, show it main-thread) and a clear cure.** It is NOT a K capability —
it is a correctness-tightening of the existing delegation, and it sits naturally in **J.W6**
(TERMINATIONS / measure-first), which already owns the `parseLinearStops`/`linear()`-Baseline
re-verification (EF-3, `J.md §J.W6`). **J-FOLD → J.W6** as a measure-first sub-item: "verify the
Safari `linear()` HW-accel exclusion; if confirmed, the spring-`linear()` WAAPI delegation gains a
WebKit guard or is recorded as a known no-accel-on-Safari with the rAF path as the correct fallback."

---

### CE-2 — `@property` registration to composite `var()`/`calc()` color/length

**What.** Register the parsed `@property` customs (already done, `engine.ts:1321`) AND THEN admit
`var()`/registered-custom-bearing animations to the WAAPI delegation, expecting the typed
registration to make the native interpolation compositor-runnable.

**Why it does NOT hold.** §1 facts 3+4: a registered custom substitutes as its computed value, so
animating it triggers style invalidation + recalc + repaint *per frame on the main thread*; the
compositor cannot perform `var()` substitution (Chromium #1411864, unshipped, "substantial work" —
Rune Lillesveen). Registering the property makes the native path interpolate SMOOTHLY (the D-LIB-1
benefit kf already banks, `engine.ts:1297-1303`) — but smoothly *on the main thread*, NOT on the
compositor. So admitting `var`/`calc` to WAAPI delegation would (i) gain ZERO compositor offload and
(ii) RE-INTRODUCE the computed-unit freeze bug the ineligible set exists to prevent (`waapi.ts:8-18`:
WAAPI computes the keyframe's units to px ONCE and does not track a resize; the rAF path re-emits the
unit string each frame). The `waapi.ts:20-23` decision-record states this exactly, and it is
frontier-verified: **the rejection is correct and durable, not an incidental limitation.**

**ARCH-kill distinction.** Even setting aside the platform refutation, naively this would brush the
Typed-OM kill's neighborhood (typed customs) — but it does NOT, because CE-2 doesn't change the interp
CARRIER (still `ValueUnit`); it would change the DELEGATION admission. The kill is moot anyway: the
platform makes the proposal pointless before the kill-distinction matters.

**Verdict: KILL** — researched and rejected on platform physics. Registered customs do not composite
(verified, two independent sources); admitting them to WAAPI buys no offload and reintroduces the
computed-unit freeze. The `CSS.registerProperty` work kf already does is correct *for its actual
reason* (smooth native interpolation of typed customs, D-LIB-1) and must NOT be over-read as a
compositor-eligibility lever. This KILL upgrades the `waapi.ts:20-23` source-note from a terse
in-code decision to a fleet-verified, externally-cited permanent boundary — the valuable result.
**Re-open ONLY IF** Chromium #1411864 ships compositor `var()`-substitution AND it reaches Baseline
(neither imminent; "substantial work", unshipped) — recorded as a BOOK-tripwire, not a live item.

---

### CE-3 — Oklab pre-interpolation as a multi-keyframe sRGB ramp ("the linear()-for-color trick")

**What.** kf interpolates the color path in oklab JS-side (its axis-2 strength), samples it at N
stops, emits N sRGB `Keyframe`s, and delegates them to WAAPI so the compositor's piecewise-linear
sRGB fill between oklab-correct stops reproduces the perceptual ramp — the exact densification idiom
kf already runs for easing (`WAAPI_SUBSEGMENT_STOPS = 8`, the true-curve sampling at
`waapi.ts:232-275`; the `springLinearStops` 24-stop emit). The pitch: kf becomes the ONLY engine
with *compositor-offloaded perceptual color*.

**Why the "compositor-offloaded" half does NOT hold.** §1 fact 2: **color does not composite.**
`color` is paint-triggering (Motion tier-list C-tier; absent from anime.js's accelerated set);
`background-color` compositor support is "coming soon" in CHROME ONLY and unshipped elsewhere. So the
oklab-stops ramp, handed to WAAPI, plays on the **main thread** (style → paint per frame) exactly as
a CSS color animation does. kf's rAF path ALREADY interpolates that color in oklab on the main thread
— at the SAME thread placement, with a SMOOTHER curve (the rAF path runs the continuous oklab path,
not a piecewise-linear sRGB approximation of it). **The trick trades kf's exact continuous oklab ramp
for a piecewise-linear sRGB approximation of it, and gains NO compositor offload in return, because
the property it offloads to does not composite.** It is strictly equal-or-worse than the status quo.

**The subtle survivor, and why it's still not worth it.** Could the oklab-stops emit be useful NOT
for offload but to ride a NATIVE scroll/view timeline (`attachNativeScrollTimeline`, `waapi.ts:440`)
— where the win is "scroll-sampled WITHOUT main-thread sampling" even if color paints? Partially: a
scroll-driven color crossfade via the native timeline would be sampled by the compositor from scroll
position (no rAF sample) even though the paint is main-thread. BUT: (i) the native scroll timeline is
NOT Baseline (Chromium + Safari 26 only, Firefox flagged — `sota-landscape.md §2`); (ii) the color
PAINT is still main-thread, so under main-thread jank the color ramp stalls regardless of who samples
it — the offload is illusory for the visible result; (iii) this is a TINY sliver (scroll-driven
perceptual color crossfade on Chromium-only) of an already-additive surface; (iv) it would need a
fidelity probe (how many sRGB stops to make a `red→blue` oklab ramp visually indistinguishable from
the continuous path — the literature says "more stops removes the gray midpoint" but the exact N is a
measure-first question, and at high N the keyframe set bloats). The sliver does not justify the
machinery.

**ARCH-kill distinction.** Not Typed-OM (the stops are plain sRGB `Keyframe` strings, no
`CSSNumericValue`). Not per-property easing. Not WASM. It's the existing densification idiom applied
to a new value class — but applied to a class that doesn't composite, so it has no payoff.

**Verdict: KILL** (the compositor-offload framing) — researched and rejected: color does not
composite (verified), so "compositor-offloaded perceptual color" is unreachable; the oklab-stops emit
is strictly equal-or-worse than kf's existing continuous-oklab rAF path at the same (main-thread)
placement. The scroll-timeline sliver is BOOK-able but tiny, Chromium-only, paint-still-main-thread,
and fidelity-probe-gated — recorded for completeness, not elected. **The valuable result: the most
seductive framing in the brief ("the ONLY engine with compositor-offloaded perceptual color") is
false on the platform, and saying so stops a future tranche from building a perceptual-ramp emitter
that buys nothing.** Re-open ONLY IF `color`/`background-color` reach Baseline compositor
acceleration (Chrome's `background-color` work is the leading edge; still unshipped + Chrome-only) —
BOOK-tripwire.

---

## §4 Adversarial self-check — did I miss a real kf-only seam, or mis-kill a survivor?

- **Does CE-1 (the survivor) brush the ARCH ScrollTimeline-native kill?** No. CE-1 is wall-clock
  delegation; it neither introduces a native timeline nor replaces the JS progress driver. The
  ADDITIVE native-scroll bridge (`attachNativeScrollTimeline`) is a separate, already-shipped, ARCH-
  kill-respecting surface; CE-1 would COMPOSE with it (a per-property split could attach its
  compositable subset to a native scroll timeline) but does not require or replace it. Explicitly
  distinct (charter-mandated brush-check: clean).
- **Is there a fourth framing — delegate transform to WAAPI but keep COLOR on rAF as today, without
  a "split" refactor, by just... not rejecting the whole animation?** That IS CE-1. There's no
  lighter version: the current gate is all-or-nothing precisely because the WAAPI lane today owns
  ALL visuals (the shadow tick does no `interpFrames`, `waapi.ts:358`); making it own only a SUBSET
  is the refactor. No free lunch.
- **Could `opacity` + a perceptual color be co-delegated by animating opacity on WAAPI and
  cross-fading two color layers?** That's a layer-blending trick (axis 3) — but it doubles the DOM
  (two color layers) to fake a crossfade the rAF path does in one value, and the color layers still
  paint main-thread. Strictly worse; a non-starter. No seam.
- **Did I mis-kill CE-2/CE-3 by missing a Chrome-only shipped feature?** The most generous reading:
  Chrome's `background-color` compositor work. Even if it ships in Chrome, it's Chrome-only and
  unshipped today (§1) — so a delegation that admits color would be a Chrome-only fast lane behind a
  feature-probe, which is exactly the additive-when-available shape kf already uses for native
  scroll. That's a future BOOK-tripwire on CE-3, NOT a present capability. Recorded. (And it would
  STILL be sRGB compositor interpolation, not oklab — the compositor has no oklab color-interp knob —
  so even then kf's oklab continuous ramp on rAF stays the higher-fidelity path; the trick's whole
  point, perceptual correctness, is the part the compositor can't do.)
- **The honest synthesis self-check:** the lane's premise was "widen the delegation boundary." The
  finding is that the boundary is drawn EXACTLY where the platform's compositor-accelerable set ends,
  and that boundary is correct and durable for color/computed-units/registered-customs. The only real
  movement is GRANULARITY (per-animation → per-property, CE-1), not REACH (no new value class becomes
  compositable). That is an honest, narrow, on-brand yield.

---

## §5 Verdict ledger

| id | title | kfAxis | effort | verdict |
|---|---|---|---|---|
| CE-1 | Per-property delegation split (transform→WAAPI, color/layout→rAF, shared-clock phase-lock) | conservative-correct WAAPI-delegation axis, per-animation → per-property | L | **K-CANDIDATE** (workload-census + compositor-trace gated) |
| §3.0 | Safari `linear()` HW-accel hazard in the CURRENT spring-WAAPI path | delegation-correctness tightening (existing path) | S | **J-FOLD → J.W6** |
| CE-2 | `@property` registration → composite `var()`/`calc()`/registered customs | (would extend axis-1 typed customs) | — | **KILL** (registered customs don't composite; BOOK-tripwire on Chromium #1411864) |
| CE-3 | Oklab pre-interpolation as multi-keyframe sRGB ramp ("compositor-offloaded perceptual color") | (would extend axis-2) | — | **KILL** (color doesn't composite → no offload; BOOK-tripwire on `background-color` compositor Baseline) |

---

## §6 The synthesis line

The lane's premise — *widen kf's conservative WAAPI delegation onto more property classes* — runs
straight into a platform wall the source had already half-seen: the 2026 compositor accelerates a
TINY set (`transform`/`opacity`/`filter`/`clip-path`), and **every property carrying a kf unique
axis is outside it** — color (perceptual oklab) is paint-triggered, computed/container length needs
main-thread layout, and a registered `@property` custom rasterizes per frame because the compositor
cannot do `var()` substitution (Chromium #1411864, "substantial work", unshipped). So framing (a) —
`@property` registration as a compositor-eligibility lever — is a **KILL** that upgrades the
`waapi.ts:20-23` decision-note into a fleet-verified permanent boundary; and framing (c) — oklab
pre-interpolation as a multi-keyframe sRGB ramp — is a **KILL** because color does not composite, so
"compositor-offloaded perceptual color" is unreachable and the trick is strictly equal-or-worse than
kf's existing continuous-oklab rAF path at the same main-thread placement. The lone survivor is
framing (b): the **per-property delegation split** (CE-1, K-CANDIDATE) — taking kf's signature
conservative-correct delegation from animation-granularity to PROPERTY-granularity so a card's
translate finally rides the compositor while its perceptual color and container-unit layout stay
correct on rAF, phase-locked by the SINGLE shared document clock (the brief's feared "WAAPI vs rAF
drift" dissolves — it is one clock). It is L-effort, gated on a workload census (does a real kf
animation mix a compositable transform with a non-compositable color/layout property?) and a
chrome-devtools-mcp compositor-residence trace, and it forces a Safari `linear()`-HW-accel guard that
ALSO fixes a latent leak in the CURRENT path (§3.0, **J-FOLD → J.W6**). The honest yield: one
K-CANDIDATE at finer delegation granularity, one J.W6 correctness fold, and two researched KILLs that
draw a frontier-verified, externally-cited line under the `waapi.ts` ineligible set — the line is
correct, the platform put it there, and kf already knew.

---

## §Sources

Internal: `src/animation/waapi.ts:8-28` (the ineligible-set + `@property` decision-record) ·
`waapi.ts:30-40` (`WAAPI_INELIGIBLE_UNITS`) · `waapi.ts:98-208` (`isWAAPIEligible`) ·
`waapi.ts:221-275` (`WAAPI_SUBSEGMENT_STOPS` + `toWAAPIKeyframes` densification) ·
`waapi.ts:316-318` (`toWAAPIOptions` emits `Easing.css`) · `waapi.ts:341-408` (`playWAAPI` shadow
tick + commit-on-finish) · `waapi.ts:440-473` (`attachNativeScrollTimeline`) ·
`src/animation/engine.ts:1297-1352` (`registerProperties`, D-LIB-1) ·
`src/animation/adapter.ts:30-31,134` (`@property` registry capture) ·
`src/animation/utils.ts:283-341` (`createInterpVarValue` oklab path) ·
`docs/tranches/J/audit/sota-landscape.md` §1/§4 (WAAPI delegation, the 3 unique axes, verdict 5) ·
`docs/tranches/J/J.md` §J.W6 (EF-3 `linear()`/Baseline re-verification home) ·
`docs/tranches/J/audit/frontier/view-transitions.md` §3(c) (the spring-`linear()`-into-platform
precedent) · `docs/tranches/J/audit/frontier/live-stylesheet-ingestion.md` §2.2 (the `playWAAPI`
commit-on-finish handoff discipline).

External:
[Chrome — Updates in hardware-accelerated animation capabilities](https://developer.chrome.com/blog/hardware-accelerated-animations) ·
[Motion — The Web Animation Performance Tier List](https://motion.dev/magazine/web-animation-performance-tier-list) ·
[anime.js — Hardware-accelerated animations (the Safari linear() exclusion)](https://animejs.com/documentation/web-animation-api/hardware-accelerated-animations/) ·
[Bram.us — The gotcha with animating custom properties (@property doesn't composite; Lillesveen on var() substitution)](https://www.bram.us/2023/02/01/the-gotcha-with-animating-custom-properties/) ·
[MDN — Registering custom properties (animation type = computed value)](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Properties_and_values_API/Registering_properties) ·
[MDN — Web Animations API Concepts (shared document timeline, startTime/currentTime)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Web_Animations_API_Concepts) ·
[Smashing — Precise Timing With the Web Animations API](https://www.smashingmagazine.com/2022/06/precise-timing-web-animations-api/) ·
[CSS-Tricks — Additive Animation with the Web Animations API (composite replace/add, disjoint properties)](https://css-tricks.com/additive-animation-web-animations-api/) ·
[Chrome — Combine effects with animation-composition](https://developer.chrome.com/docs/css-ui/css-animation-composition) ·
[Motion — How to hardware-accelerate GSAP easings with WAAPI (linear() densification)](https://motion.dev/magazine/how-to-use-your-favourite-gsap-easings-with-waapi) ·
[linear() easing Baseline](https://web-platform-dx.github.io/web-features-explorer/features/linear-easing/) ·
[Chromium issue #1411864 — compositor var() substitution (unshipped)](https://issues.chromium.org/issues/1411864)
