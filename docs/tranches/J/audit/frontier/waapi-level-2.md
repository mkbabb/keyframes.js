# Frontier lane — kf as the WAAPI-Level-2 ORCHESTRATION layer + animation-composition honoring

**Lane:** waapi-level-2 (FRONTIER-RESEARCH fleet, K-tranche seeding · 2026-06-10).
**Charter:** the Web Animations **Level 2** spec — `GroupEffect` / `SequenceEffect` /
`ParallelEffect` and the child-synchronization model — has been a Working Draft for a decade
and Chrome/Safari/Firefox have shipped **none** of it. kf's `AnimationGroup` (spatial blend
compositor) and `Sequence` (temporal master-playhead) ALREADY implement these semantics in
userland, over real WAAPI children where eligible. The proposal to evaluate: **position kf as
the production `GroupEffect`/`SequenceEffect` the platform never shipped** — a thin
*named-correspondence* alignment pass against the L2 semantics (NOT slavish API copying) — plus
the booked **FB-1 animation-composition honoring** (composite:add/accumulate respected when
capturing + delegating) and **`getAnimations()` interop** (kf animations discoverable /
coordinatable with foreign page animations — the adopt/takeover seam tied to `adapter.ts`).

**Honest verdict up front (skeptical of own lane):** the L2 *API-mimicry* framing is a **KILL**
— the spec is mid-redesign (SequenceEffect is being *deleted* in favor of an `align` timing
option; a parallel *declarative CSS* GroupEffect effort is live), so copying its current shape
chases a moving, unshipped target and adds bloat. But the lane decomposes into three sub-items
of very different value: **FB-1 composition honoring is a real, ripe, S/M K-CANDIDATE** (the
substrate is already built; only the wiring is missing, and it extends the *unique* weighted-blend
axis); **`getAnimations()` interop is a small, genuinely-only-kf-can-do-it K-CANDIDATE**
(adopt/takeover ties the round-trip-CSS axis to foreign animations); and the **positioning /
docs framing is a J.W5-FOLD** (a README sentence, not a tranche). The headline is NOT "build the
GroupEffect spec"; it is **"honor the composite operation the CSS source already declares, and
make kf interoperable with the platform's own animation registry."**

---

## §0 The decisive prior fact — the L2 spec is NOT a stable target to mirror

Before proposing alignment to L2, the single most important external fact: **the Level 2 group
model is being actively re-architected, and the part the lane brief names (`SequenceEffect`) is
slated for removal.**

- **`GroupEffect`/`SequenceEffect` never shipped in ANY browser.** Available only through the
  archived `web-animations-js` polyfill; Chrome/Safari/Firefox implement zero of it
  ([w3.org WA-2 WD](https://www.w3.org/TR/web-animations-2/);
  [GroupEffect explainer](https://yi-gu.github.io/group_effect/)). It has been a Working Draft
  since the original 2015 era ([danielcwilson WAAPI pt.4](https://danielcwilson.com/blog/2015/09/animations-part-4/)).
- **`SequenceEffect` is being PROPOSED FOR DELETION.** CSSWG issue #9557 ("Propose a new timing
  option `align` to replace `SequenceEffect`") would fold sequential ordering into an
  `EffectTiming.align: start | end | sequence | sequence-reverse` longhand and **remove the
  `SequenceEffect` class entirely** — "make the definition of `GroupEffect` more clear and
  separated from child synchronization"
  ([csswg-drafts #9557](https://github.com/w3c/csswg-drafts/issues/9557)). Open since Nov 2023,
  still under design.
- **A PARALLEL declarative-CSS GroupEffect effort is live** (#9554 "Declarative syntax for
  GroupEffects") — the platform's own bet is that grouping should be *declarative CSS*, not a
  JS class tree ([csswg-drafts #9554](https://github.com/w3c/csswg-drafts/issues/9554)).

**Implication for this lane.** A "name-correspond to L2" pass that pins kf's API to `GroupEffect`/
`SequenceEffect` class shapes would be **mirroring a target that is mid-redesign and may not
survive**. The brief's own guard — "named correspondence, not slavish API copying" — is correct,
but the honest reading is stronger: there is no *settled* L2 surface to correspond TO. kf already
made the right call: it named its classes `AnimationGroup` and `Sequence` for its own reasons
(`sequence.ts:5-30` — "`Timeline` is already a shipped public class … `Sequence` is the distinct
name"), NOT to copy a spec. **Renaming or restructuring to track the spec is a KILL** (re-litigates
nothing; just records the spec is not a stable mirror). What kf CAN honestly claim is *positioning*
— see §3.

---

## §1 The platform constraints (verified, June 2026)

| Fact | Status | Source |
|---|---|---|
| `GroupEffect` / `SequenceEffect` / `ParallelEffect` | **Shipped in ZERO browsers** — polyfill-only; L2 WD | [w3.org WA-2](https://www.w3.org/TR/web-animations-2/), [explainer](https://yi-gu.github.io/group_effect/) |
| `SequenceEffect` future | **Proposed for REMOVAL** — folded into `EffectTiming.align` (#9557, open, undecided) | [csswg #9557](https://github.com/w3c/csswg-drafts/issues/9557) |
| Declarative CSS GroupEffect | **Active competing direction** (#9554) — platform may favor CSS over JS class tree | [csswg #9554](https://github.com/w3c/csswg-drafts/issues/9554) |
| CSS `animation-composition` (`replace`/`add`/`accumulate`) | **Baseline** — Chrome 112, Edge 112, Safari 16.0, Firefox 115 (2023); ~90% global | [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-composition), [caniuse](https://caniuse.com/mdn-css_properties_animation-composition) |
| `KeyframeEffect.composite` / `element.animate(..., { composite })` | **Baseline** (same UA matrix) — JS twin of the CSS property | [MDN KeyframeEffect.composite](https://developer.mozilla.org/en-US/docs/Web/API/KeyframeEffect/composite) |
| Per-keyframe `composite` (composite on a keyframe object) | Supported; "used for each property in that keyframe then the next" | [MDN animation-composition](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-composition) |
| `document.getAnimations()` | **Baseline Widely Available** since Sep 2020 — returns ALL `Animation`s on the document incl. CSS + WAAPI | [MDN Document.getAnimations](https://developer.mozilla.org/en-US/docs/Web/API/Document/getAnimations) |
| `Element.getAnimations()` | Supported; not yet "Widely available" badge but cross-engine present | [MDN Element.getAnimations](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAnimations) |

**Two of the three sub-items are platform-ready.** `composite` is Baseline (the FB-1 WAAPI half
can delegate today); `getAnimations()` is Baseline-widely-available (the interop half is real).
Only the L2-class *mimicry* leans on something unshipped — and that is the part this lane KILLS.

---

## §2 Internal evidence — what kf ALREADY is, vs the L2 model

kf is not "missing" the L2 group model; it **occupies the same semantic space with a deliberately
distinct API**, and on TWO axes (weighted blend, CSS-source-of-truth) it exceeds what L2 specifies.

**Spatial composition = `AnimationGroup` (`group.ts`).** Many animations on one target, blended
per-frame into a single transform. This is L2's *parallel* group case (every child shares the
clock and the paint), with TWO things L2 does NOT have:
- **`weighted` blend** (`group.ts:345-375`) — lerp-by-weight per numeric leaf. L2's group model
  has no weighted axis; even the CSS `composite` keyword set is `replace`/`add`/`accumulate` only.
  This is the sota-landscape "weighted layer blending — unique, no mainstream JS library exposes it"
  axis (`sota-landscape.md §4.3`).
- a zero-alloc null-fill composite buffer (`group.ts:101-117`, `257-414`) and `scheduler.yield`
  INP batching (`YIELD_BATCH=32`, `group.ts:76`, `advanceTo` `469-498`) — engine discipline L2
  does not specify and no polyfill demonstrates.

**Temporal sequencing = `Sequence` (`sequence.ts`).** Many animations positioned at offsets along
one master playhead, each painting its own targets. This is L2's `SequenceEffect` + position-insertion
semantics — and it ALREADY covers the model #9557 is migrating TOWARD: `align: sequence` is exactly
`Sequence`'s auto-append default (`sequence.ts:211-219`), `align: start` is `at: 0` on every entry,
and `Sequence` *additionally* has the GSAP transport L2 lacks entirely — `timeScale`/`reverse`
(`sequence.ts:568-592`), `repeat`/`yoyo` (`sequence.ts:599-617`), labels + `"+=n"` relative
positions (`sequence.ts:230-247`). **kf's `Sequence` is a strict superset of the L2 sequence model,
and it already drives real WAAPI children** (each entry's `animation` delegates to `playWAAPI`
when eligible — `sequence.ts` drives `Animation.advanceTo` / `interpFrames`, and `Animation.play`
routes to WAAPI per `waapi.ts` eligibility).

**The over-WAAPI-children claim is REAL today.** A `Sequence` entry or `AnimationGroup` child that
is WAAPI-eligible (`isWAAPIEligible`, `waapi.ts:98-208`) runs compositor-thread via `playWAAPI`
(`waapi.ts:341-408`) while the JS orchestrator owns the clock. This IS "the production GroupEffect
over real WAAPI children where eligible" — **it is built, not aspirational.** What is missing is
not capability; it is (a) the composite operation honoring (§4), (b) interop with foreign
animations (§5), and (c) the positioning sentence (§3).

**The FB-1 substrate is already built and the dead-leaf bug already fixed.** Critically: the rAF
blend leaf that FB-1 honoring would route `add`/`accumulate` through was a DEAD-CODE bug (collapsed
to `replace`) until G.W17 fixed it (`group.ts:316-375` element-wise loop; recorded
`G/audit/a-group-layering.md §GL-4`, `recap-deferred.md:262`). So **FB-1's rAF accumulation
substrate is live and correct as of the tranche-I tip** — only the *wiring from the captured
composition Map to that substrate* is missing.

---

## §3 Sub-item A — "position kf as the production GroupEffect/SequenceEffect" → **J.W5-FOLD** (a docs sentence, not a tranche)

**Finding.** The capability is shipped (§2). The "positioning" is therefore a *documentation and
naming-rationale* move, not an engineering one. The honest deliverable is:

1. A README/docs paragraph: "`AnimationGroup` and `Sequence` are the production realization of
   Web Animations Level 2's `GroupEffect`/`SequenceEffect` model — semantics the platform has
   never shipped — over real WAAPI children where eligible, with weighted blend and a GSAP-class
   transport the spec lacks." (Named correspondence, evidence-anchored.)
2. A short doc table mapping L2 concept → kf surface (`GroupEffect.parallel` → `AnimationGroup`;
   `SequenceEffect` / `align:sequence` → `Sequence` auto-append; `EffectTiming.align:start` →
   `at:0`) so the correspondence is *legible* without changing one line of API.

**Why a FOLD, not a wave.** J.W5 (THE PUBLISHED SURFACE) already owns "README §Beyond CSS completes
— all ~13 primitives taught" (`J.md` J.W5 row) and `Sequence` is one of the untaught primitives
(`SCOPE-5`, README teaches 4/~13). The L2-correspondence paragraph is *exactly* the kind of
on-brand framing J.W5's `Sequence`/`AnimationGroup` doc sections should carry. **It costs one
paragraph + one table inside an already-scheduled wave.** Manufacturing a K wave for a docs
sentence would be bloat.

**Why renaming to track the spec is a KILL.** Per §0, `SequenceEffect` is being deleted from the
spec; the `align` longhand and the declarative-CSS direction are unsettled. Pinning kf's public
API to a class name the CSSWG is actively removing would be the *opposite* of frontier — it would
be legacy-chasing. kf's `sequence.ts:5-30` already records the principled naming decision; honor it.
**KILL: any API rename/restructure to mirror L2 class shapes.**

> **Verdict A: J-FOLD into J.W5** (the positioning paragraph + correspondence table) · **with a
> KILL rider** on API mimicry. NOT a K wave.

---

## §4 Sub-item B — FB-1 `animation-composition` honoring → **K-CANDIDATE (the headline of this lane)**

This is the real frontier content. It is **ripe, on-brand, and small**, and it extends kf's
*unique* weighted-blend axis into the CSS-source-of-truth axis — the only-kf-can-do-it test passes
cleanly.

### §4.1 The exact gap (file:line)

The composition operator is **CAPTURED and then DROPPED**:
- `adapter.ts:24-29` captures per-keyframe `animation-composition` (`replace`/`add`/`accumulate`)
  onto `ResolvedKeyframes.composition: Map<string,string>` — value.js lifts it onto
  `rule.composition`; `adapter.ts:120-126` populates the Map. The docstring is explicit: "honoring
  it (→ WAAPI `composite` / rAF accumulate) is BOOKed, not half-wired."
- **`engine.ts fromString` never reads `resolved.composition`** — verified: the `for` loop
  (`engine.ts:1267-1293`) consumes `resolved.keyframes` and `resolved.timingFunctions` but
  the `.composition` Map is dead on arrival.
- **`toWAAPIOptions` never emits `composite`** — verified: zero `composite` references in
  `waapi.ts` (only the prose "does not composite anyway"). The delegated `element.animate(...)`
  call (`waapi.ts:347-349`) passes `toWAAPIKeyframes` + `toWAAPIOptions` with NO composite —
  so a CSS-declared `animation-composition: add` runs as silent `replace` on the compositor.

So today: a user authors `@keyframes x { 50% { transform: translateX(10px); animation-composition: add } }`,
kf parses the operator, stores it in a Map, and **throws it away** — the animation runs `replace`
on both the rAF and WAAPI paths. The CSS source of truth is silently NOT honored. This is a
correctness gap on kf's *signature* axis (parse author CSS, animate faithfully).

### §4.2 Why ONLY a CSS-source-of-truth engine does this THIS way (the on-brand test)

GSAP/Motion/anime have no `@keyframes` parser, so they have no `animation-composition` to honor —
they invent their own composition syntax. The native platform honors `animation-composition` for
CSS animations but **cannot animate arbitrary JS objects, cannot blend perceptually in oklab, and
exposes no `weighted` axis**. kf is the unique point where: *the author's declared CSS composite
operator* drives *the engine's already-unique weighted/add blend leaf* across *DOM OR plain-object
targets* — and, where eligible, *delegates the same operator to the compositor via WAAPI's Baseline
`composite`*. That round-trip (author CSS → faithful JS blend → faithful WAAPI delegation → faithful
re-serialize) is the CSS-source-of-truth axis. **No competitor has the parse half; the platform
has neither the object-target half nor the weighted half. The on-brand test passes.**

### §4.3 The two halves, both already substrated

**(a) rAF / object-target half — wiring, not new machinery.** The blend leaf in
`transformFramesGrouped` (`group.ts:316-375`) ALREADY does element-wise `add` (un-clamped, per the
CSS spec — `group.ts:320-321`) and `weighted` lerp. FB-1's rAF half is: route a per-keyframe
`composition: add|accumulate` from the captured Map into a per-frame blend mode on the engine's
interpolation, so a single animation's `add` keyframe accumulates onto the underlying value the way
the group's `add` layer does. The `accumulate` operator (repeat-aware accumulation) is the one new
semantic — but it is a bounded leaf, not a new pipeline. **This is the G.W17-recorded "FIX, not a
green-field add"** (`a-group-layering.md §GL-4`).

**(b) WAAPI half — pass-through of a Baseline keyword.** `composite` is Baseline
(Chrome/Edge 112, Safari 16, Firefox 115 — §1). The wiring is: `toWAAPIKeyframes` emits per-keyframe
`composite` onto the Keyframe objects (or `toWAAPIOptions` emits a top-level `composite`), and the
eligibility gate admits `add`/`accumulate` (today it does not reject them because it never sees
them). **No polyfill, no new platform dependency** — it is forwarding a keyword the browser already
honors. Per the existing eligibility discipline (`waapi.ts`), color/computed-unit cases still stay
on rAF, so the WAAPI composite path only ever runs where it is pixel-correct.

### §4.4 The semantic question (the one real design cost)

The named blocker (NEW-39, `a-group-layering.md:170-173`): **what does `add` mean for a
non-numeric leaf** — a color, a transform LIST, a `<custom-ident>`? The CSS spec answers per
property type (numeric add, transform-list concatenation, discrete = replace-at-50%). kf's leaf
already falls back to `replace` for non-numeric units (`group.ts:339-341`, `367-369`), which is
the *safe* subset. The K wave must decide: ship the numeric+transform-list subset (matching where
WAAPI `composite` is well-defined) and `replace`-fallback the rest, with a queryable diagnostic —
OR book the transform-list concat case. **This is a contained decision, not a research project.**

### §4.5 MEASURE-FIRST + the gate

Per the fleet charter, every perf-flavored claim names its probe. FB-1 is correctness-flavored, not
perf-flavored — but it carries one perf-adjacent risk: the per-frame blend-mode branch in
`interpFrames`'s hot path. **Probe:** extend the existing `interpFrames` zero-alloc/ops-bench
(`bench/interpolation.bench.ts`; the recorded 996k ops/s 2-frame opacity baseline,
`sota-landscape.md §5`) with a `composite:add` keyframe row; the FB-1 branch must not regress the
`replace` path (a predictable branch on a per-keyframe constant should be free). **Gate:**
`proof:composition` (named in `recap-deferred.md:262`, "presupposes `proof:blend`, green") — a
2-keyframe `composite:add` whose mid-frame value = SUM not replace, asserted on BOTH the rAF path
and the WAAPI path (parity), plus the `accumulate` repeat-aware row and the non-numeric
`replace`-fallback row.

### §4.6 Does it brush an ARCH kill?

No. FB-1 is **not** per-property keyframe *easing* (the killed thing) — it is per-keyframe
*composite operation*, a distinct CSS longhand with Baseline WAAPI support. It does not touch
Typed-OM (the blend stays on `ValueUnit`), does not monomorphize `ValueUnit`, does not bit-pack,
does not introduce a Worker/WASM path. It is forwarding a Baseline CSS keyword to a Baseline WAAPI
keyword and routing it through an already-built blend leaf. **Clear of every kill.**

> **Verdict B: K-CANDIDATE** (the lane headline). Effort **M** (rAF wiring + WAAPI passthrough +
> the accumulate leaf + the `proof:composition` gate). On-brand (CSS-source-of-truth × weighted-blend
> axes). Substrate already built (G.W17). Could anchor a K wave titled "honor the composite operator
> the source declares." NOT a J fold — it is net-new engine capability the J charter explicitly
> **re-affirms as a BOOK, not a J wave** (`J.md:345`: "F.W8 composition-honoring → the FB-1 BOOK
> re-affirmed").

---

## §5 Sub-item C — `getAnimations()` interop / adopt-takeover → **K-CANDIDATE (small, genuinely-only-kf)**

### §5.1 The seam

`document.getAnimations()` is Baseline-widely-available and returns **every** live `Animation` on
the document — CSS animations, CSS transitions, and WAAPI animations alike
([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/getAnimations)). kf already exposes
its delegated WAAPI handles on `animation._waAnimations` (`engine.ts:125`, `waapi.ts:353/471`) and
already has an **`adoptCompiled`** primitive (`engine.ts:303-336`, gated by `proof:adopt-compiled`)
that re-binds one animation's compiled state into a live animation as one atomic motion. The pieces
for interop exist; the *coordination surface* does not.

### §5.2 The two genuinely-only-kf moves

**(i) DISCOVER + TAKEOVER a foreign CSS animation.** A page declares a CSS `@keyframes`/`animation`
on an element (authored by a designer, a CMS, a framework). Today kf cannot see it. With
`getAnimations()`, kf could enumerate the foreign animations on a target, **read the CSS source the
animation came from** (the `KeyframeEffect.getKeyframes()` + the `@keyframes` rule via CSSOM),
parse it through `resolveKeyframes` (`adapter.ts`), and **adopt it** — cancel the native animation,
re-drive it through the kf engine to gain oklab color, computed-unit resolution, weighted blend,
springs, and the round-trippable source. This is the "animate anything from author CSS" axis pointed
at *animations the author already declared in CSS the browser is running* — **only an engine that
parses `@keyframes` AND round-trips it could take over a foreign CSS animation losslessly.** GSAP/
Motion/anime cannot read a CSS animation's source; the platform can read it but cannot upgrade its
interpolation. Unique.

**(ii) COORDINATE with foreign animations (non-destructive).** A `Sequence`/`AnimationGroup` could
*query* `getAnimations()` to discover sibling animations on its targets and either (a) wait on their
`finished` promises as sequence positions (a kf `Sequence` entry whose `at` is "after the page's
existing hero animation"), or (b) avoid double-driving a property a foreign animation owns. This is
the L2 "synchronization model" applied to *the platform's own animation registry* rather than only
to kf-internal children — the one place the L2 group model and `getAnimations()` actually meet.

### §5.3 Why this is small and bounded

The adopt path reuses `resolveKeyframes` + `adoptCompiled` (both shipped). The discover path is a
read of a Baseline API. The risk surface is the takeover *cancel* semantics (cancel the native
animation cleanly, commit its current value, hand off without a frame gap) — which is exactly the
discipline `playWAAPI`'s commit-on-finish already demonstrates (`waapi.ts:386-398`,
`commitStyles` + `cancel`). **No new physics; a coordination + adoption surface over two Baseline
APIs and two shipped kf primitives.**

### §5.4 ARCH-kill check + the honest caveat

Not a kill: it does not replace the JS progress driver (it ADOPTS foreign animations INTO it),
does not use Typed-OM, no Worker/WASM. **Honest caveat (why this is a K-CANDIDATE not a HEADLINE):**
reading a foreign CSS animation's *source* from CSSOM is fiddly (matching a running `Animation` back
to its `@keyframes` rule text is not a first-class API — `getKeyframes()` gives the computed keyframe
list, not the authored CSS), and the takeover use-case is narrower than FB-1's. It earns a K wave
only if a concrete consumer demand appears (e.g. the demo or a framework adapter wants to upgrade
designer-authored CSS animations). **Without a demand signal it is closer to BOOK.**

> **Verdict C: K-CANDIDATE** (lean toward small K wave or BOOK-pending-demand). Effort **M**
> (discover = S; adopt-takeover = M; the coordinate-as-sequence-position = S). On-brand (the adopt
> half uniquely fits the parse+round-trip axis). Bounded by the CSSOM source-recovery friction.

---

## §6 What this lane KILLS (researched rejections — valuable results)

| Killed | Why (researched) |
|---|---|
| **Rename/restructure kf's API to mirror L2 `GroupEffect`/`SequenceEffect` class shapes** | The spec is mid-redesign: `SequenceEffect` is proposed for *deletion* in favor of `EffectTiming.align` (#9557), and a competing *declarative-CSS* GroupEffect direction (#9554) may win. There is no settled surface to mirror. kf's `Sequence`/`AnimationGroup` names are principled (`sequence.ts:5-30`) and a strict superset of the unsettled model. Mirroring an unshipped, changing spec is legacy-chasing — the opposite of frontier. |
| **Implement L2's `ParallelEffect`/`StaggerEffect`/`GroupEffect` class tree as new kf types** | `AnimationGroup` (parallel) and `Sequence` (sequence) already cover the model; `stagger` already ships (`index.ts`, the E→I tier). Adding a class tree to match a polyfill no browser ships is pure bloat (anti-KISS) for zero capability gain. |
| **Build a `GroupEffect`/`SequenceEffect` *polyfill* for the missing native API** | The platform may never ship it (it is being redesigned). Polyfilling a moving spec is the worst of both worlds; kf's userland orchestrators are the *better* answer and already exist. |
| **A standalone K "WAAPI-L2 positioning" wave** | The positioning is one README paragraph + one correspondence table → folds into J.W5 (already owns `Sequence`/`AnimationGroup` docs). A tranche for a paragraph is bloat. |

---

## §7 Synthesis — the lane in one paragraph

The "align kf to WAAPI Level 2" framing is mostly **a positioning claim kf has already EARNED by
construction**: `AnimationGroup` (parallel blend, with a *weighted* axis L2 lacks) and `Sequence`
(master-playhead, a strict superset of the `align`-model #9557 is migrating toward, with GSAP-class
transport) are the production `GroupEffect`/`SequenceEffect` the platform never shipped, already
driving real WAAPI children where eligible. So the positioning is a **J.W5 docs FOLD**, and any
API-mimicry of the *changing, unshipped* L2 class shapes is a **KILL**. The real frontier content
is the two booked engine seams: **FB-1 animation-composition honoring** is the headline — ripe
(substrate built G.W17), on-brand (CSS-declared composite operator × kf's unique weighted/add blend
× WAAPI's Baseline `composite`), and the *only* engine that could honor an author's `animation-composition`
across object targets AND delegate it to the compositor; and **`getAnimations()` adopt/takeover**
is a small, genuinely-only-a-parse-and-round-trip-engine-can-do-it interop seam (upgrade a foreign
CSS animation's interpolation to oklab/computed-units/springs by reading its source), bounded by
CSSOM source-recovery friction. **The K seed is "honor the composite operator the source declares
(FB-1), and make kf interoperable with the platform's own animation registry (`getAnimations()`
adopt)" — NOT "build the GroupEffect spec."**

---

## §8 Sources

**Spec / API status:**
[W3C Web Animations Level 2 WD](https://www.w3.org/TR/web-animations-2/) ·
[GroupEffect explainer (yi-gu)](https://yi-gu.github.io/group_effect/) ·
[csswg-drafts #9557 — `align` replaces SequenceEffect](https://github.com/w3c/csswg-drafts/issues/9557) ·
[csswg-drafts #9554 — declarative GroupEffect](https://github.com/w3c/csswg-drafts/issues/9554) ·
[danielcwilson WAAPI pt.4 (GroupEffects/SequenceEffects)](https://danielcwilson.com/blog/2015/09/animations-part-4/) ·
[waapi.guide GroupEffect](http://waapi.guide/effects/group/)

**Composition / composite (Baseline):**
[MDN animation-composition](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-composition) ·
[MDN KeyframeEffect.composite](https://developer.mozilla.org/en-US/docs/Web/API/KeyframeEffect/composite) ·
[caniuse animation-composition](https://caniuse.com/mdn-css_properties_animation-composition) ·
[Chrome dev — CSS animation-composition](https://github.com/GoogleChrome/developer.chrome.com/blob/main/site/en/articles/css-animation-composition/index.md)

**getAnimations interop:**
[MDN Document.getAnimations](https://developer.mozilla.org/en-US/docs/Web/API/Document/getAnimations) ·
[MDN Element.getAnimations](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAnimations)

**Internal anchors:** `src/animation/group.ts` (blend leaf 316-375, composite buffer 101-117/257-414,
YIELD_BATCH 76) · `src/animation/sequence.ts` (naming 5-30, auto-append 211-219, transport 568-617) ·
`src/animation/adapter.ts` (composition capture 24-29/120-126) · `src/animation/waapi.ts` (eligibility
98-208, playWAAPI 341-408, commit-on-finish 386-398; NO composite emitted) · `src/animation/engine.ts`
(`_waAnimations` 125, `adoptCompiled` 303-336, `fromString` drops `resolved.composition` 1267-1293) ·
`docs/tranches/I/PROGRESS.md:226` (FB-1 BOOK, un-blocked, SHIP-if-elected) ·
`docs/tranches/G/audit/a-group-layering.md §GL-4` (FB-1 rAF half is a FIX) ·
`docs/tranches/J/J.md:345` (J re-affirms FB-1 as a BOOK, NOT a J wave) ·
`docs/tranches/J/audit/sota-landscape.md §3-§4` (weighted-blend + CSS-round-trip unique axes).
