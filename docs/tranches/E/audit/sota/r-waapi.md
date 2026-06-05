# SOTA Audit — Web Animations API (WAAPI) forward-SOTA research

**Lane:** WAAPI SOTA — the modern WAAPI *surface* (KeyframeEffect, composite modes,
`Animation.timeline` binding, `commitStyles`/`persist`, native `ScrollTimeline`/
`ViewTimeline` constructors, `getComputedTiming`/`getKeyframes`, CSS Color L4 keyframe
interpolation, `@property` typed customs). **Question:** where could keyframes.js
delegate MORE to the compositor, and which now-Baseline WAAPI features does the engine
not yet use? Forward-research lane — complements the in-tree review lane
`a-kf-waapi.md` (do **not** re-litigate its F1/F2/F3/F4/F5/F6; this lane names what
*that* lane did not, and sharpens two of its findings with spec-default detail).

**inv-16:** keyframes.js findings → `FOLD-E`; value.js findings →
`FOLD-VALUEJS-HANDOFF` (never propose writing value.js). This file only.

**Code read (file:line grounded):**
- `src/animation/waapi.ts:35-127` (eligibility), `:132-157` (`toWAAPIKeyframes`),
  `:159-211` (`toWAAPIOptions`), `:223-265` (`playWAAPI` delegation + `finally`).
- `src/animation/engine.ts:778-814` (play dispatcher), `:738-759` (`_playWAAPI` /
  `_cancelWAAPI`), `:486-516` (`fillForwards`/`paintRest`/`restPosition`),
  `:637-652` (`onEnd` → `paintRest`), `:828-844` (resume nudge to compositor).
- `src/animation/timeline.ts:36-152` (`Timeline`), `:163-180` (`ScrollTimeline` —
  JS rAF sampler), `:182-197` (`ManualTimeline`).
- `src/animation/constants.ts:54` boundary; value.js `src/units/constants.ts:54`
  (`COMPUTED_UNITS = ["var","calc"]`), `:1-41` (relative/viewport/container units).
- `src/animation/group.ts:37-60` (`AnimationGroup`, blend modes; JS-side composite).

**Spec / guidance / Baseline cites (dated at retrieval, June 2026):**
- MDN *Animation.commitStyles()* — **Baseline widely available since July 2020.** Pattern:
  `await anim.finished; anim.commitStyles(); anim.cancel();`. "Using indefinitely
  filling animations is discouraged. Animations take precedence over all static
  styles, so an indefinite filling animation can prevent the target element from ever
  being styled normally."
  <https://developer.mozilla.org/en-US/docs/Web/API/Animation/commitStyles>
- MDN *Animation.persist()* — the explicit opt-out of auto-removal of filling
  animations (complement to `commitStyles`).
- MDN *ScrollTimeline* / *ViewTimeline* constructors — **NOT Baseline** (Chrome-only +
  partial elsewhere at audit date). caniuse `mdn-api_scrolltimeline_scrolltimeline`,
  `mdn-api_viewtimeline_viewtimeline`.
- WebKit commit *"Support extended color animation interpolation"* (1140e61): WebKit
  animates non-sRGB colors using **OKLab as the default interpolation method** when a
  keyframe uses non-legacy color syntax. CSS Color L4 `<color-interpolation-method>`
  default = `oklab`. color-mix() Baseline (Chrome 111 / Safari 16.2 / FF 113, May 2023).
- web.dev *@property Baseline* — **`@property` Baseline 2024-07-09.** MDN: registered
  customs interpolate by computed value per `syntax`, **but custom properties do NOT
  animate on the compositor** (rasterized per frame). modern-web-guidance
  `scrollytelling` (Baseline-progressing; Safari 26 Sep 2025) — native
  `animation-timeline: scroll()/view()` runs off the main thread; `@supports
  ((animation-timeline: scroll()) and (animation-range: 0% 100%))` feature-detect +
  `prefers-reduced-motion` kill-switch MANDATORY.
- MDN *KeyframeEffect.composite* (Baseline widely available) / *iterationComposite*
  (**NOT Baseline** — limited at audit date).

---

## Verdict (headline)

keyframes.js's WAAPI delegation is **architecturally mature** (the shadow-tick
lifecycle and easing-faithfulness gate are genuinely SOTA — already affirmed by
`a-kf-waapi.md` F5/F6, not re-argued here). The **one forward-SOTA defect this lane
surfaces that the review lane missed** is the **`commitStyles()`/`persist()` gap**
(W1): the delegated WAAPI animations are left as **indefinitely-filling** compositor
animations that are never committed and never cancelled — the exact anti-pattern MDN
calls out — producing a real cascade/lifecycle non-isomorphism vs the rAF path, plus
unbounded compositor retention for long-lived `forwards` animations. Beyond that: the
color rejection is liftable because **WAAPI's own default interpolation space is now
oklab** (W2, sharpens `a-kf-waapi.md` F2 with the spec-default fact); native
`AnimationTimeline` binding is a *named, not-yet-Baseline* opportunity (W3); and
`@property` customs are correctly out of the compositor's reach, so the gate's
`var()` rejection is right to keep them on rAF (W4, ALREADY-SOTA-by-reasoning). DX
introspection (`getComputedTiming`/`getKeyframes`) is unused but optional (W5).

---

## Findings

### W1 — Delegated WAAPI animations are never `commitStyles()`'d **or** cancelled — indefinitely-filling compositor leak + cascade non-isomorphism · **FOLD-E** (correctness + perf)

**File:** `src/animation/waapi.ts:200,208` (`toWAAPIOptions` emits `fill: forwards`
from `FILL_MAP`), `:255-265` (`playWAAPI`'s `try/finally` — the `finally` calls
`animation.playback.stop()` and clears `_waAnimations = []` but **does NOT cancel the
WAAPI animations and never calls `commitStyles()`**). Compare the rAF completion path:
`engine.ts:637-640` (`onEnd` → `paintRest()`) → `engine.ts:510-516` writes the rest
frame as **inline element styles** via `interpFrames(t, true)`, then `settle()`.

**Gap (two compounding problems):**

1. **Indefinitely-filling animation, never committed.** On normal WAAPI completion the
   `wa.finished` promise resolves and the `finally` runs — but it leaves each
   `globalThis.Animation` **alive with `fill: forwards`**. Per MDN
   (`commitStyles`, Baseline July 2020): an indefinitely filling animation *takes
   precedence over all static styles* and "can prevent the target element from ever
   being styled normally." So after a delegated play completes, the target's effective
   style is owned by a dangling compositor animation, not by the inline `paintRest()`
   write or any later author CSS. The SOTA pattern is exactly three lines:
   `await wa.finished; wa.commitStyles(); wa.cancel();` — bake the final computed style
   into the `style` attribute, then drop the animation so the cascade is normal again.
   keyframes.js does the *first* part conceptually (the shadow-tick's `paintRest()`
   writes inline styles) but **leaves the WAAPI animation un-cancelled on the happy
   path** — so two forward-fills now fight: the inline rest write AND the live
   compositor fill, with the compositor winning by cascade order.

2. **Lifecycle non-isomorphism with the rAF path.** The rAF path ends in `settle()`
   with the rest frame painted as inline style and **no residual animation object**.
   The WAAPI path ends with the rest frame painted as inline style **plus** N residual
   filling `globalThis.Animation`s. These diverge observably: `getAnimations()` on the
   target returns the dangling animations (WAAPI path) vs none (rAF path); a subsequent
   author style change is overridden (WAAPI) vs honored (rAF); and the dangling
   animations retain compositor memory for the lifetime of the element. The two
   playback modes are supposed to be pixel- and lifecycle-isomorphic (the whole point
   of the `isWAAPIEligible` discipline); this is a real seam.

**Why it bites (perf):** for short fire-and-forget animations the leak is small but
*accumulates* (every completed delegated play adds residual filling animations); for
**`iterationCount: Infinity`** animations `wa.finished` never resolves, so the
`finally` never runs and the compositor animation is correctly long-lived — fine — but
for **finite `forwards`** animations the residue is pure waste. The committed-then-
cancelled pattern is strictly lighter: one style write, zero retained animations.

**Disposition — FOLD-E.** In `playWAAPI`'s completion path (the non-cancel, non-error
branch of the `try`), before/at the `finally`, for each finished `wa`:
`wa.commitStyles(); wa.cancel();` (feature-detect `commitStyles` — Baseline 2020, but
SSR/jsdom may lack it; the engine already SSR-guards capability elsewhere). This
**removes** the need to emit `fill: forwards` to the compositor at all (MDN: "no `fill`
needed in modern browsers" once you commit), which also sidesteps the
`backwards`/`both` fill nuance. Keep the `paintRest()` inline write as the
value.js-resolved source of truth, OR let `commitStyles()` be the single writer and
drop the shadow-tick `paintRest()` double-write — pick one writer to preserve a single
rest-position contract (`engine.ts:494-507`). Distinguish the **cancel-on-halt** path
(already correct: `_cancelWAAPI` rejects `finished` → AbortError swallow, `:257-261`)
from the new **commit-on-finish** path (currently missing).

**Isomorphism note:** strictly isomorphism-*restoring* — after the fix, both paths end
with the rest frame as inline style and zero residual animations. `getAnimations()`,
cascade precedence, and compositor retention all converge. This is the single highest-
value WAAPI correctness item in the lane and is **not** covered by `a-kf-waapi.md`
(which audits eligibility/emit/lifecycle-start but not the *finish-commit* seam).

---

### W2 — Color rejection is liftable because WAAPI's DEFAULT keyframe interpolation space is now oklab — sharpens `a-kf-waapi.md` F2 · **GAP-NAMED** + **FOLD-VALUEJS-HANDOFF**

**File:** `src/animation/waapi.ts:116-121` ("color interpolation requires perceptual
lerp"), `:30` docstring. Engine default `colorSpace: "oklab"` (`constants.ts`).

**Spec sharpening (the new fact this lane adds):** the review lane's F2 said color is
"liftable via CSS Color L4 *if you author an explicit interpolation space*." The
forward-SOTA fact is stronger: **WAAPI's interpolation default is already oklab** for
any keyframe authored with non-legacy color syntax (WebKit commit 1140e61; CSS Color L4
`<color-interpolation-method>` default = `oklab`). So when `options.colorSpace ===
"oklab"` — the **engine default** — a delegated color animation whose keyframe
endpoints are emitted in **non-legacy syntax** (`oklch(...)`, `lab(...)`, `rgb(... )`
modern, or `color-mix(in oklab, ...)`) interpolates **on the compositor in oklab by
default**, matching keyframes.js's JS perceptual lerp *with no explicit space keyword
needed*. The rejection's premise ("WAAPI only does sRGB RGB-lerp") is obsolete.

**The blocker is the EMIT, not the gate.** `toWAAPIKeyframes` (`:146-153`) flattens
through `unflattenObjectToString`, which (per `a-kf-waapi.md` F2 + MEMORY) produces the
resolved/flattened color string — likely **legacy sRGB syntax**, which would trigger
WAAPI's *legacy* sRGB interpolation (muddy midpoint) and NOT match the JS oklab lerp.
So lifting color is gated on emitting **non-legacy, space-preserving** color endpoints.

**value.js hand-off (FOLD-VALUEJS-HANDOFF):** same surface `a-kf-waapi.md` F2 names —
a `(colorSpace, hueMethod) → CSS-L4 keyword | undefined` lookup AND a serializer that
emits a `Color`/`ValueUnit` to its **non-legacy CSS-L4 string form** (`oklch(...)` /
`color-mix(in oklab, ...)`). This lane adds the precise *acceptance criterion*: the
emitted endpoint must use **non-legacy syntax** so WAAPI's oklab default engages —
emitting legacy `rgb(r g b)` would silently fall back to sRGB interpolation and break
isomorphism. **value.js owner formalizes; do not write value.js here.**

**Caveat carried forward:** `background-color`/`color` are paint properties Chromium
runs on the main thread even under WAAPI — so the win is "correct perceptual color via
WAAPI's native oklab default + unified code path," not raw thread-offload (same honest
caveat as F2). For `filter: drop-shadow(<color>)` the compositor story is better.

**Disposition:** GAP-NAMED (keyframes.js eligibility lift, depends on the hand-off);
FOLD-VALUEJS-HANDOFF for the non-legacy L4-preserving color serializer.

**Isomorphism note:** WAAPI's oklab default is *defined to match* the JS oklab lerp —
isomorphic within rounding **only if** the emit is non-legacy syntax. Legacy-syntax
emit is NOT isomorphic. The acceptance test must assert the emitted endpoint parses as
non-legacy.

---

### W3 — Native `AnimationTimeline` (`ScrollTimeline`/`ViewTimeline`) binding for DOM-target scroll animations — the `Animation.timeline` delegation surface · **GAP-NAMED** (not Baseline)

**File:** `src/animation/timeline.ts:163-180` — `ScrollTimeline` is a **JS rAF sampler**
(`getScrollY`/`getViewportHeight` injectable, `:171-173`), entirely decoupled from the
native platform. No native `AnimationTimeline` anywhere; the WAAPI delegation in
`playWAAPI` always passes time-based `KeyframeEffectOptions` (`:202-211`) — it never
sets `Animation.timeline` to a native `ScrollTimeline`/`ViewTimeline`.

**Modern WAAPI surface (the spec feature):** WAAPI lets you construct
`new ScrollTimeline({ source, axis })` / `new ViewTimeline({ subject, axis })` and bind
it via the `Animation` constructor's second arg or `animation.timeline = scrollTimeline`
— giving a scroll-driven animation that runs **off the main thread** with the same
`KeyframeEffect`. This is the scroll-driven analogue of the time-based WAAPI delegation
the engine already does. For a **DOM target** whose progress is genuinely scroll-linked,
keyframes.js could attach a native timeline and let the compositor drive it, exactly as
`waapi.ts` delegates time-based playback today.

**Honest Baseline gate:** native `ScrollTimeline`/`ViewTimeline` **constructors are NOT
Baseline** (Chrome-shipped, partial/absent elsewhere at audit date — caniuse
`mdn-api_scrolltimeline_scrolltimeline`). So this is **opt-in / progressive enhancement
only**, never a default. The engine's JS `ScrollTimeline` stays the universal,
non-DOM-capable, testable fallback (its injectable callbacks are a *feature* — it works
on any object, not just elements). The native path is a fast-lane for the DOM-target,
feature-present case.

**Why GAP-NAMED not FOLD-E:** (a) not Baseline → can't be a default; (b) it's a new
delegation surface (a `WAAPIEligibility`-style predicate for "scroll-linked + DOM target
+ native timeline present + `@supports`") with its own lifecycle (no `finished`
resolution for an infinite scroll timeline — ties back into W1's commit/cancel
discipline), not a tweak to the existing time-based gate. Pairs naturally with the demo
showcase the `r-modern-web-digest`/`scrollytelling` lanes already booked (§2.1 there).

**Disposition — GAP-NAMED.** Named opportunity; design behind a feature-detect, scope
in a dedicated item. Engine-side complement to the demo's declarative `scroll()`/`view()`
showcase.

**Isomorphism note:** additive. JS `ScrollTimeline` is the fallback; native is an opt-in
fast lane for DOM targets where the platform is present. Progress values must be checked
to match between the JS sampler's `threshold`/easing pipeline and the native
`animation-range` — they are NOT trivially equal (the JS one applies `SmoothProgress`
smoothing + boundary snap, `timeline.ts:80-111`; native scroll-driven has none), so an
isomorphism test must reconcile the smoothing or accept a documented divergence.

---

### W4 — `@property`-registered customs and `var()` rejection — the gate is correct by reasoning, NOT just by accident · **ALREADY-SOTA** (clarify the docstring)

**File:** `src/animation/waapi.ts:104-115` (`isComputedUnit` → rejects `var`/`calc`).

**Forward-SOTA fact:** one might think `@property`-registered custom properties
(Baseline 2024-07-09) could now be delegated to WAAPI — registration gives them a
`syntax` so they interpolate by computed value rather than discretely. **But registered
custom properties do NOT animate on the compositor** (MDN / Bram.us: they rasterize per
frame, trashing layout/paint). So delegating a `var(--x)` animation to WAAPI would NOT
move it off the main thread even when `--x` is `@property`-registered — and worse, the
engine resolves `var()` via live DOM (`COMPUTED_UNITS`, MEMORY computed-value pipeline),
which the compositor can't replicate. **Conclusion: the gate's `var()` rejection is
correct on BOTH counts** (no compositor benefit + needs DOM resolution), and the arrival
of `@property` does **not** open a delegation lift here. This is the *honest negative
result* this lane was asked to produce — a now-Baseline feature that looks like a lift
but isn't.

**One doc nit (not a code change):** the `waapi.ts:27-28,113` docstring + CLAUDE.md
narrative still imply the predicate catches `vh`/`cqw` — `a-kf-waapi.md` F1 already
owns that bug (the predicate only catches `var`/`calc`). This lane *adds* the rationale
for why **even a corrected** predicate keeps `var()` out: not just "needs DOM
resolution" but "registered customs don't composite anyway." Fold that reasoning into
F1's docstring rewrite so the contract reads as *deliberate*, not incidental.

**Disposition — ALREADY-SOTA** (rejection is right; defer the docstring to F1).

**Isomorphism note:** N/A — no behavior change; this finding *prevents* a tempting but
wrong lift.

---

### W5 — `getComputedTiming()` / `getKeyframes()` introspection unused — minor DX, not a delegation lift · **BOOK**

**File:** `playWAAPI` (`:223-265`) constructs WAAPI animations and tracks `_waAnimations`
but never reads `wa.effect.getComputedTiming()` (resolved
`duration`/`activeDuration`/`progress`/`currentIteration`) or
`wa.effect.getKeyframes()` (the computed, offset-filled keyframe list). The engine
re-derives all of this from its own state machine in the shadow tick.

**Opportunity (small):** the shadow tick exists *because* the JS state machine must stay
coherent with the compositor. For the read-only lifecycle facts (`currentIteration`,
`progress`, `localTime`), `getComputedTiming()` is the platform's *canonical* source —
reading it could let the shadow tick reconcile against the compositor's truth (e.g.
detect compositor/JS clock drift) rather than running a fully parallel clock. `getKey
frames()` (with browser-filled offsets) is a useful **test/DX** affordance: assert the
emitted keyframes round-trip. Neither is a *delegation* lift — they're correctness/DX
instrumentation.

**Why BOOK not FOLD-E:** the shadow tick is already correct (`a-kf-waapi.md` F6 affirms
it). Introducing `getComputedTiming` reconciliation is a *refinement* with its own
risk (cross-browser timing-model quirks); worth a backlog note, not a tranche mandate.

**Disposition — BOOK.** Optional DX/diagnostics; the lifecycle is already SOTA without it.

**Isomorphism note:** N/A (read-only diagnostics).

---

### W6 — `KeyframeEffect.composite: add` for AnimationGroup additive layers — confirms `a-kf-waapi.md` F4, with the Baseline split · **BOOK** (cross-ref)

**File:** `toWAAPIOptions` (`:202-211`) never sets `composite`; `AnimationGroup` blend
modes composite in JS (`group.ts:37-60`, `constants.ts` `BlendMode`).

**This lane's only addition to F4:** the Baseline split is the gating fact —
**`KeyframeEffect.composite` ("replace"/"add"/"accumulate") is Baseline widely
available**, but **`iterationComposite` ("accumulate" across iterations) is NOT
Baseline** (limited at audit date). So an `AnimationGroup`-level lift to native additive
composition (sum pure-transform/opacity layers on the compositor via `composite: "add"`)
is **viable today** for the *segment* composite; the *per-iteration* accumulate analogue
is **not** portable yet. F4 already books the group-level delegation surface; this lane
confirms it and pins which half is Baseline.

**Disposition — BOOK** (defer to `a-kf-waapi.md` F4; this is the Baseline annotation).

**Isomorphism note:** as F4 — native `composite:"add"` composes transform lists by
*concatenation*; verify the group's `add` blend semantics match before delegating, or
restrict to scalar properties (opacity, single-axis) where concatenation == summation.

---

### W7 — Easing-faithfulness gate + shadow-tick lifecycle are ALREADY-SOTA — do not "improve" · **ALREADY-SOTA** (carry forward)

**File:** `waapi.ts:62-102` (uniform-TF + CSS-twin-across-segments reject + no-CSS-twin
reject), `:223-265` (shadow-tick lifecycle). Already fully argued in `a-kf-waapi.md`
F5/F6 — **not re-derived here.** Re-affirmed from the forward-SOTA angle: the refusal to
delegate a curve with no faithful CSS twin (would run bare-linear on the compositor) and
the spring → `linear()` (Easing L2, Baseline 2023) twin are the canonical modern WAAPI
idioms, used correctly. The shadow-tick `wa.finished` + AbortError-swallow lifecycle is
a mature delegation harness. **No change.** (W1 is the *one* completion-path seam this
otherwise-SOTA harness is missing.)

**Disposition — ALREADY-SOTA.** Flagged so the tranche doesn't churn a correct gate.

---

## Liftability matrix (this lane's forward-SOTA delta over `a-kf-waapi.md`)

| WAAPI feature (modern surface) | Now-Baseline? | keyframes.js uses it? | Lift / disposition |
|---|---|---|---|
| **`commitStyles()` / `persist()`** (Baseline 2020) | **Yes** | **No** — WAAPI anims left filling, never committed/cancelled on finish | **W1 · FOLD-E (headline, new)** |
| CSS Color L4 **oklab-default** keyframe interp | Yes (color-mix 2023; WebKit oklab default) | No — rejects color; emit is legacy sRGB | **W2 · GAP-NAMED + VALUEJS-HANDOFF** (sharpens F2) |
| Native `ScrollTimeline`/`ViewTimeline` ctor + `Animation.timeline` bind | **No** (Chrome-only) | No — JS rAF sampler only | **W3 · GAP-NAMED** (progressive enhancement) |
| `@property` registered customs on compositor | `@property` yes (2024-07); **compositor: no** | N/A — `var()` stays on rAF | **W4 · ALREADY-SOTA** (correct negative result) |
| `getComputedTiming()` / `getKeyframes()` introspection | Yes | No | **W5 · BOOK** (DX/diag) |
| `KeyframeEffect.composite:"add"` | **Yes**; `iterationComposite` **No** | No | **W6 · BOOK** (confirms F4 + Baseline split) |
| Easing-faithful gate + shadow-tick lifecycle | — | **Yes** | **W7 · ALREADY-SOTA** (= F5/F6) |

**How much more could ride the compositor?** The biggest *correctness* win is W1
(stop leaking indefinitely-filling animations; commit-then-cancel on finish) — it costs
nothing on the compositor and *removes* retained animations. W2 unifies color onto
WAAPI's native oklab default (more-correct, not more-off-thread for paint props). W3 is
a real but not-yet-Baseline off-thread scroll lift (opt-in). W6's additive transforms
are Baseline-viable for the segment composite. W4 is the honest *negative*: `@property`
does **not** open a `var()` lift. The easing/lifecycle machinery (W7) is SOTA — leave it.

---

## Dispositions roll-up

- **FOLD-E (do):** **W1** — `commitStyles() + cancel` on WAAPI finish; drop the
  `fill: forwards` compositor leak; single rest-writer to preserve the rest-position
  contract. *(New; not in `a-kf-waapi.md`.)*
- **GAP-NAMED:** **W2** — color eligibility lift gated on non-legacy L4-syntax emit
  (sharpens F2 with the oklab-default fact); **W3** — native `AnimationTimeline` binding
  for DOM scroll targets (progressive enhancement; not Baseline).
- **BOOK:** **W5** — `getComputedTiming`/`getKeyframes` diagnostics; **W6** —
  `composite:"add"` group delegation (Baseline split annotation on F4).
- **ALREADY-SOTA:** **W4** — `var()` rejection correct (registered customs don't
  composite — a now-Baseline feature that is *not* a lift); **W7** — easing-faithful
  gate + shadow-tick lifecycle (= F5/F6).
- **FOLD-VALUEJS-HANDOFF:** **W2** — value.js serializer must emit colors in
  **non-legacy** CSS-L4 syntax (`oklch(...)`/`color-mix(in oklab, ...)`) so WAAPI's
  oklab default engages; legacy `rgb()` emit would silently break isomorphism. *(Same
  surface F2 names; this lane adds the non-legacy-syntax acceptance criterion. value.js
  owner formalizes — do not write value.js here.)*
