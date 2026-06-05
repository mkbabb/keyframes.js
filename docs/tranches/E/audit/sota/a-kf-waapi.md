# SOTA Audit — keyframes.js WAAPI Delegation Completeness

**Lane:** `src/animation/waapi.ts` eligibility + delegation. Cross-reference against
the modern Web Animations API surface (Easing L2 `linear()`, CSS Color L4 keyframe
interpolation, `KeyframeEffect.composite`/`iterationComposite`, scroll-driven
`AnimationTimeline`). Which rejections are now *liftable*? How much more could ride
the compositor thread?

**Inputs read (file:line grounded):**
- `src/animation/waapi.ts:35-127` (eligibility), `:132-157` (keyframe emit), `:173-211` (options emit), `:223-265` (delegation)
- `src/animation/engine.ts:778-814` (play dispatcher), `:159-165` (`usesDefaultRenderer`), `:140-165`
- `src/animation/constants.ts:67-72,117-143,172-182` (Easing, options, defaults)
- `src/animation/easing.ts` (`toEasing`, `cssTwinFor`, `resolveEasing`), `src/animation/frame-compiler.ts:42-76,150-196`
- `src/animation/springTimingFunction.ts`, `springLinearStops.ts`
- value.js: `src/units/constants.ts:54` (`COMPUTED_UNITS = ["var","calc"]`), `src/units/color/dispatch.ts:277` (`mixColors`), `src/easing.ts:427+` (`timingFunctions`)

**Guidance / spec cites:**
- modern-web-guidance `css` guide (§9 Transitions & animations; Baseline guidance, retrieved 2026_05_16-c5e7870): "Most animations can be performed by using just two properties: opacity and transform" — compositor-friendly set.
- MDN `KeyframeEffect.composite` / `iterationComposite` (Baseline: `composite` widely available; `iterationComposite` limited — Firefox-only at audit date).
- CSS Easing L2 `linear()` — Baseline widely available 2023+ (Chrome 113 / Safari 17.2 / Firefox 112).
- CSS Color L4 keyframe interpolation + `color-mix(in oklab, …)` — Baseline widely available 2023+. WAAPI keyframe color values interpolate in **sRGB by default** unless an explicit interpolation color space is named.

---

## Verdict (headline)

**Mostly SOTA, with one correctness defect and three genuine liftability gaps.** The
eligibility gate is conceptually sound and notably faithful (it refuses to delegate
curves that would silently run bare-linear on the compositor — a discipline most
libraries lack). But: (1) the computed-unit rejection **does not actually reject the
units its docstring claims** (`vh`/`cqw`/`%` slip through — a real isomorphism bug);
(2) color and the perceptual-space rejection is now **liftable via CSS Color L4 keyframe
interpolation** (`color-mix`/explicit endpoints with an interpolation space), which
WAAPI honors natively; (3) the keyframe emitter samples only at stop times, leaving
mid-segment fidelity on the table; (4) `composite: add` is unused — the `add`/`weighted`
blend modes in `AnimationGroup` could ride the compositor for pure-transform layers.

---

## Findings

### F1 — Computed-unit rejection is a NO-OP for `vh`/`vw`/`cqw`/`%` — docstring & CLAUDE.md overstate coverage · **FOLD-E** (correctness)

**File:** `src/animation/waapi.ts:5-9` (`isComputedUnit`), `:104-115` (the rejection
loop), docstring `:27-28` and `:113`. CLAUDE.md (`src/animation/`) also claims "no
computed units (`vh`/`calc`/`var`/`cqw`)".

**Gap:** `isComputedUnit` tests membership in value.js `COMPUTED_UNITS`, which is
**`["var", "calc"]` ONLY** (`value.js src/units/constants.ts:54`). `vh`, `vw`, `vmin`,
`cqw`, `cqi`, `%` are in `RELATIVE_LENGTH_UNITS` / `PERCENTAGE_UNITS`, **not**
`COMPUTED_UNITS`. So the loop at `waapi.ts:104-115` does **not** reject a `vh`/`cqw`/`%`
animation — it passes eligibility and is delegated to WAAPI. The docstring (lines 27,
113: "`vh`, `cqw`, etc.") and the CLAUDE.md narrative are simply wrong about what the
guard catches. The only thing actually rejected here is literal `var(…)` and `calc(…)`.

**Why it bites (isomorphism):** When a `vh`/`cqw` animation *is* delegated,
`toWAAPIKeyframes` (`:146-153`) samples `interpFrames(t)` at stop times and emits the
**already-resolved pixel values** via `unflattenObjectToString`. So for a *static*
viewport the pixels happen to match — but the endpoints are frozen at
`play()`-time pixels. On viewport resize / container resize mid-animation, the rAF path
(which re-resolves computed units every frame via DOM, per MEMORY.md's computed-value
pipeline) and the WAAPI path **diverge**: WAAPI holds the stale px endpoints, rAF
tracks the live box. That is a real behavioral non-isomorphism between the two
playback modes for exactly the unit class the comment claims to exclude.

**Disposition — FOLD-E.** Two coherent resolutions, pick one and make the code +
docstring + CLAUDE.md agree:
  - **(a) Honest exclusion:** widen the reject predicate to the full computed/relative
    set that needs live DOM resolution (`var`, `calc`, and the viewport/container
    relative units `vh/vw/vmin/vmax/vb/vi/sv*/lv*/dv*/cq*`, plus `%` where the
    percentage basis is layout-derived). This restores the documented contract and
    kills the resize-divergence. *This is the KISS, isomorphism-preserving choice.*
  - **(b) Honest inclusion:** if static-viewport delegation is *intended* as an
    optimization, rewrite the docstring/CLAUDE.md to say "computed units are delegated
    with px endpoints frozen at play()-time; not resize-stable" and gate it behind a
    flag. Riskier; (a) is preferred.

**Isomorphism note:** (a) is strictly isomorphism-restoring. (b) documents a known,
opt-in divergence.

---

### F2 — Color rejection is now liftable via CSS Color L4 keyframe interpolation space · **GAP-NAMED** (partial lift) + **FOLD-VALUEJS-HANDOFF**

**File:** `src/animation/waapi.ts:116-121` ("color interpolation requires perceptual
lerp"), `:30` docstring. Color space machinery: `constants.ts:32,140-142,181`
(`colorSpace: "oklab"` default, `COLOR_SPACES`, `HUE_METHODS`). value.js `mixColors`
exists and is exported (`value.js src/units/color/dispatch.ts:277`,
`src/index.ts:123`).

**Spec reality:** The rejection's premise — "WAAPI only does RGB lerp" — is **no longer
true**. CSS Color L4 (Baseline widely available 2023+) gives keyframes an
*interpolation color space*. A WAAPI keyframe whose property value is authored as
`color-mix(in oklab, …)` or whose endpoints carry an explicit color space is
interpolated **by the compositor in that space**, not sRGB. The CSS guide (§8.3) treats
`color-mix(… in oklab …)` as the standard perceptual-mix primitive. So an animation
whose only disqualifier is color interpolation *in a CSS-expressible space* (oklab,
oklch, lab, lch, srgb, hsl, hwb) could now ride the compositor — the exact perceptual
result keyframes.js computes in JS.

**Two sub-cases:**
  - **Liftable (FOLD-E, eligibility widening):** when `options.colorSpace` (and
    `hueMethod` for cylindrical spaces) maps to a CSS L4 interpolation keyword
    (`oklab`/`oklch`/`lab`/`lch`/`srgb`/`hsl`/`hwb` + `shorter|longer|increasing|decreasing`
    hue) — which is *every* member of `COLOR_SPACES`/`HUE_METHODS` that derives from
    value.js `COLOR_SPACE_RANGES` and the CSS L4 union — the compositor can do the
    perceptual interpolation. The lift: stop rejecting color, and in
    `toWAAPIKeyframes`/`toWAAPIOptions` emit endpoints that carry the interpolation
    space. WAAPI keyframes can be expressed per-property in any CSS color syntax; the
    color space rides on the value, not on a single effect option, so two adjacent
    stops in oklab interpolate in oklab on-thread.
  - **Not liftable (stays rejected):** any value.js *internal* color space with no CSS
    L4 twin (if value.js has perceptual spaces beyond the L4 set), or a `hueMethod`
    with no CSS keyword. Those keep the JS perceptual lerp.

**value.js hand-off (FOLD-VALUEJS-HANDOFF):** to make F2 land *faithfully* we need a
value.js surface that, given a `(colorSpace, hueMethod)` pair, answers **"is this a CSS
Color L4 interpolation space, and what is its CSS keyword?"** — the color analogue of
`Easing.css`. Concretely propose a value.js tranche adding a small lookup
(e.g. `cssColorInterpKeyword(space, hueMethod): string | undefined`) and a serializer
that emits a `ValueUnit`/`Color` to its **CSS-L4 string form preserving the authored
space** (so `toWAAPIKeyframes` can emit `oklch(…)`/`color-mix(in oklab …)` endpoints
rather than the flattened sRGB string `unflattenObjectToString` currently produces).
Without that, keyframes.js cannot tell which of its color spaces round-trip to the
compositor. **value.js owner formalizes; do not write value.js here.**

**Perf rationale:** color/background animations are common in the demo presets
(`animations.ts` fades/pulses). Lifting them moves real paint work off the main thread.
**Caveat to name honestly:** `background-color` is frequently a *paint* property that
Chromium runs on the **main thread** even under WAAPI (only `opacity`/`transform`/
`filter`/`backdrop-filter` are reliably compositor-accelerated — CSS guide §9.1, MDN
WAAPI concepts). So F2's win is "correct perceptual color via WAAPI's native L4 interp +
unified code path," not necessarily "off the main thread for `background-color`." For
`color`-carrying `filter`/`box-shadow`-adjacent cases the compositor story is better.

**Disposition:** GAP-NAMED for the keyframes.js eligibility lift (depends on the
hand-off); FOLD-VALUEJS-HANDOFF for the `cssColorInterpKeyword` + L4-preserving color
serializer.

**Isomorphism note:** Native L4 oklab interpolation is *defined to match* the perceptual
lerp keyframes.js does in JS (same space, same premultiplied-alpha rules per
`mixColors`). Pixels should be isomorphic within rounding. The current sRGB-endpoint
emit would NOT be isomorphic (muddy midpoint) — which is precisely why the lift must go
through the L4-space-preserving serializer, not the existing flatten.

---

### F3 — Keyframe emitter samples only at stop times — mid-segment curve fidelity left on the table · **FOLD-E** (perf/fidelity)

**File:** `src/animation/waapi.ts:138-156` (`toWAAPIKeyframes` builds `timePoints` from
`frame.time.start`/`.stop` only, then emits one keyframe per stop).

**Observation:** The emitter walks the **stop boundaries** and samples `interpFrames(t)`
at each, producing exactly N keyframes for N stops. Between two adjacent emitted
stops, WAAPI interpolates **linearly** (the option easing is `linear` unless a single
uniform `.css` twin covers the whole effect — `:198-200`). For animations whose
per-segment values are *not* linear in the property (e.g. a property driven through a
bespoke `easeOutCubic` that has no `.css` twin), eligibility already *rejects* them
(`:97-102`), so they never reach here — good. But for a segment that *is* eligible yet
whose interpolation is non-linear because of **unit conversion or multi-component
interpolation** (transform lists, where the rAF path interpolates each component then
re-serializes), the two emitted endpoints + WAAPI linear-lerp can drift from the rAF
path mid-segment.

**Lift:** dense intermediate sampling — emit additional `offset` stops *within* each
segment (e.g. sample `interpFrames` at a fixed sub-cadence) so WAAPI's piecewise-linear
fill tracks the JS curve to sub-pixel tolerance. This is exactly the technique
`springLinearStops.ts` already uses to turn a continuous spring ODE into a faithful CSS
`linear()` (24 stops) — the same pattern applied to keyframe *value* emission. KISS:
reuse the established "sample-the-true-curve-into-stops" idiom the spring code proves.

**Perf rationale:** more stops = more compositor work at setup but **zero** per-frame
main-thread cost (the whole point of WAAPI). The tradeoff favors fidelity. Bound the
stop count (spring code caps at `sampleCount + 2`).

**Disposition — FOLD-E.** Self-contained in `toWAAPIKeyframes`; no value.js dependency.

**Isomorphism note:** strictly fidelity-improving — denser sampling can only move the
WAAPI path *closer* to the rAF path, never further. Name a tolerance (e.g. match
spring's 24-sample default) so it's a deliberate, tested bound.

---

### F4 — `KeyframeEffect.composite: add` unused — AnimationGroup `add`/`weighted` layers could ride the compositor · **BOOK** (architectural opportunity)

**File:** delegation never sets `composite` (`waapi.ts:173-211` `toWAAPIOptions` emits
only `duration/delay/iterations/direction/fill/easing`). `AnimationGroup` blend modes:
`constants.ts:184-209` (`BlendMode = "replace" | "add" | "weighted"`); group composites
in JS on the main thread (per CLAUDE.md `group.ts` layer blending).

**Spec reality:** `KeyframeEffect.composite = "add"` (Baseline widely available — MDN)
is *the* native primitive for additive animation: two `transform` effects with
`composite: "add"` compose as `translateX(...) rotate(...)` on the compositor, no JS
blend (CSS-Tricks "Additive Animation with the WAAPI"). This is precisely the `add`
blend mode `AnimationGroup` implements in JS today. `iterationComposite: "accumulate"`
(limited Baseline — Firefox-only at audit date) is the per-iteration analogue.

**Opportunity:** for an `AnimationGroup` of pure-transform/opacity layers with `add`
blend, uniform timing, and WAAPI-eligible children, the *group* could delegate by
attaching each child effect with `composite: "add"` and letting the compositor sum
them — moving the entire layer-blend off the main thread. The `weighted` mode maps less
cleanly (no native weighted composite; would need pre-scaled keyframe values, which is
expressible but more work).

**Why BOOK not FOLD-E:** this is a *new delegation surface for `AnimationGroup`*, not a
tweak to the existing per-`Animation` gate. It needs its own eligibility predicate (all
children WAAPI-eligible AND additive-composable AND same target set), interplay with the
group's `managed`/scheduler.yield batching, and a fallback when any child disqualifies.
Sizeable; book it as a Tranche-E (or later) workstream rather than fold it into the
waapi.ts gate.

**Disposition — BOOK.** Named opportunity; design + scope in a dedicated item.

**Isomorphism note:** native `composite:"add"` for transforms composes by *concatenation*
("translateX rotate"), whereas a JS `add` blend may compose by *numeric summation* of
like components. These can differ for transform lists — verify the group's `add`
semantics match `composite:"add"` concatenation before delegating, or restrict the lift
to scalar properties (opacity, single-axis transform) where they coincide.

---

### F5 — Eligibility's easing-faithfulness discipline is ALREADY-SOTA · **ALREADY-SOTA**

**File:** `src/animation/waapi.ts:62-102` (uniform-TF check, CSS-twin-across-segments
reject, no-CSS-twin reject); `springTimingFunction.ts` / `springLinearStops.ts` (the
`linear()` twin); `easing.ts` `cssTwinFor` (`linear`/`ease*`/`cubic-bezier`/`steps`
twins); `frame-compiler.ts:42-76` (per-frame `.css` resolution).

**Assessment:** This is genuinely state-of-the-art and *ahead* of most libraries. Three
things stand out:
  - **It refuses to silently run bare-linear on the compositor.** A bespoke value.js
    curve (`easeOutCubic`, `bounceInEase` — no CSS twin) is kept on the rAF path
    (`:97-102`) rather than delegated and degraded. Motion/GSAP-style delegation often
    *does* lose the curve. keyframes.js's `Easing.css` (`constants.ts:67-72`) makes
    "this curve round-trips to CSS" a *type-system fact*, not a guess.
  - **The spring → `linear()` pipeline is exactly the Easing L2 idiom.** `springTiming
    Function` returns `{ fn, css: linear(...) }` (one curve, two forms) so a spring runs
    the *true* overshoot/settle on the compositor — the canonical modern technique
    (Easing L2 `linear()`, Baseline widely available). This is SOTA and correctly used.
  - **The per-segment-restart hazard is handled** (`:75-85`): a CSS-twinned easing
    spanning 2+ segments is rejected because WAAPI restarts its single easing per
    segment — a subtle correctness trap most implementers miss.

**Disposition — ALREADY-SOTA.** No change. Flagging it so the tranche doesn't
"improve" a correct, faithful gate. (The one adjacent caveat: `cssTwinFor` is
allow-list string logic for value.js's *named* registry curves — if value.js ever adds
a curve with a faithful CSS twin not in the regex, the twin is missed and it falls to
rAF. That's a safe-direction miss, not a correctness bug.)

---

### F6 — Shadow-tick + `wa.finished` lifecycle delegation is ALREADY-SOTA · **ALREADY-SOTA**

**File:** `src/animation/waapi.ts:223-265` (`playWAAPI`): a parallel rAF "shadow tick"
(`:242-253`) drives the JS state machine (events/iteration/pause) while WAAPI owns the
visuals; `Promise.all(wa.finished)` (`:256`) with AbortError-swallow on cancel
(`:257-261`); handles exposed on the instance (`:235`) so `stop()`/`reset()` cancel the
compositor animations (`engine.ts:838` resume nudge, `:831-839`).

**Assessment:** The hard part of WAAPI delegation — keeping `animationstart`/`iteration`/
`animationend`, `paused`, and `pausedTime` coherent while the *visuals* run off-thread —
is done correctly via a shadow loop that does **no** `interpFrames` (no main-thread
interpolation; WAAPI paints). Pause/resume forwards to the compositor (`:243-251`,
`engine.ts:831-839`) rather than racing an rAF loop. Cancellation rejects `finished`
and is treated as a deliberate halt. This is a mature, correct delegation harness.

**Disposition — ALREADY-SOTA.** No change.

---

## Liftability summary (the lane's core question)

| Current rejection (`waapi.ts`) | Liftable now? | How | Disposition |
|---|---|---|---|
| no DOM targets / no `.animate` (`:38-46`) | No — fundamental | — | correct |
| custom transform renderer (`:54-59`) | No — JS-only semantics | — | correct (bind-proof ref check is SOTA) |
| non-uniform per-frame TF (`:62-74`) | No — WAAPI = 1 easing/effect | (dense value sampling F3 mitigates) | correct |
| CSS-twin easing across segments (`:80-85`) | No — per-segment restart | — | correct (subtle, right) |
| easing w/ no CSS twin (`:97-102`) | No — would run bare linear | — | correct + SOTA |
| **computed unit `var`/`calc` (`:104-115`)** | No (DOM resolution) — **but guard mislabels coverage** | F1: fix predicate to actually catch `vh`/`cqw`/`%` | **FOLD-E (bug)** |
| **color (`:116-121`)** | **YES (partial)** — CSS Color L4 native L4-space keyframe interp | F2: emit L4-space-preserving endpoints; needs value.js `cssColorInterpKeyword` | **GAP-NAMED + FOLD-VALUEJS-HANDOFF** |
| *(not a rejection)* stop-time-only sampling (`:138-156`) | — | F3: dense sub-segment stops (spring-stops idiom) | **FOLD-E** |
| *(not in scope of per-Animation gate)* `AnimationGroup` add/weighted | **YES (add, transforms)** — `composite:"add"` | F4: group-level WAAPI delegation | **BOOK** |

**How much more could ride the compositor?** Honestly: *more correctly*, not
necessarily *more off-thread*. The biggest real wins are (F1) closing the
computed-unit isomorphism hole, (F2) native L4-space color interpolation through a
unified WAAPI path, and (F4) additive transform groups via `composite:"add"`. The
easing-faithfulness and lifecycle machinery (F5, F6) are already SOTA and should be left
alone. Note the standing platform ceiling: even when delegated, only `opacity`/
`transform`/`filter`/`backdrop-filter` are reliably compositor-accelerated — color/
layout properties still touch the main thread under WAAPI (CSS guide §9.1), so the lift
is about correctness + code unification more than raw thread offload for those.

---

**FOLD-E items:** F1 (computed-unit predicate fix + docstring/CLAUDE.md), F2-keyframes.js-half
(eligibility widening for L4 color spaces, gated on the hand-off), F3 (dense sub-segment
sampling).
**FOLD-VALUEJS-HANDOFF:** F2 — value.js tranche for `cssColorInterpKeyword(space, hueMethod)`
+ an L4-space-**preserving** color serializer (the `Easing.css` analogue for color), so
`toWAAPIKeyframes` can emit `oklch(…)`/`color-mix(in oklab …)` endpoints instead of
flattened sRGB.
**BOOK:** F4 — `AnimationGroup` compositor delegation via `KeyframeEffect.composite:"add"`.
**ALREADY-SOTA:** F5 (easing faithfulness / `Easing.css` / spring `linear()`), F6 (shadow-tick lifecycle).
