# Frontier lane — THE CSS COMPILER (the round-trip axis, inverted and weaponized)

**Lane:** `css-compiler` (FRONTIER-RESEARCH fleet, K-tranche seeding · 2026-06-10).
**Question:** kf already serializes ONE `Animation` → `@keyframes` + `animation-*` longhands
(`format.ts`) and ONE spring → `linear()` (`springLinearStops.ts`). The frontier inverts the
round-trip and aims it at the WHOLE orchestration graph: compile a `Sequence` /
`AnimationGroup` / `stagger` authored interactively in JS into a **pure, zero-runtime CSS
artifact** — `@keyframes` blocks + per-element `animation-*` longhands +
`animation-composition` for layering + `@starting-style` for entry — that a human pastes into
a stylesheet and ships with ZERO kf bytes on the page. Author in the IDE, export the CSS, drop
the library.

Method: source surface (cited `file:line`) + the verified June-2026 CSS platform
(external claims linked, §Sources) + the J ground-truth corpus (`audit/sota-landscape.md`,
`J.md §WAVE MAP`, the two sibling frontier docs). Verdict vocabulary per the fleet charter.

**The on-brand test (binding):** a K verdict requires extending one of kf's three unique
axes — (1) CSS `@keyframes` as a parseable, round-trippable source of truth; (2) perceptual
oklab interpolation; (3) weighted layer blending — or closing a named gap in a way ONLY a
CSS-source-of-truth engine could. This lane is the PUREST instance of axis (1): the engine's
internal model already IS CSS keyframes, so compiling back to CSS is not a translation layer —
it is the inverse of the parser that already exists.

**Headline finding (stated up front, skeptically):** the compiler is a genuine
**K-HEADLINE-CANDIDATE** — the one frontier seam in the whole fleet that NO competitor can
structurally occupy (their authoring model is not CSS, so they have nothing to invert). But
its value is gated entirely on the HONESTY of the ineligibility report (the `weighted` blend,
custom renderers, computed-unit drift, and the perceptual-oklab axis ALL have no faithful CSS
twin), and the proof gate is non-negotiable: the compiled CSS replayed side-by-side vs the JS
playback, pixel-compared. It is NOT one wave — it is a tranche with a born-honest refusal
surface. The body below partitions it into the compilable core (K-HEADLINE), the stagger
sub-question (the genuinely novel CSS-2026 research), and the four named refusals (each a KILL
of a tempting over-reach, recorded so the K tranche does not re-litigate them).

---

## §1 The decisive prior fact — half the compiler already exists, and it is the parser run backward

The serialize-back half is REAL, symmetric, and recently hardened. This is not greenfield;
it is the extension of an existing, test-gated seam.

- **The single-animation serializer is done and honest.** `CSSKeyframesToString`
  (`format.ts:124-194`) emits a complete `.class { animation-* }` block + a `@keyframes`
  block from the **declared template values** (`format.ts:155` — the I.W0 S2 fix: serialize
  from `parsedVars[i]`, the parsed-but-unresolved var map, NEVER a DOM-resolving `at(progress)`
  sample, so a `var()`/`matrix3d()` round-trips VERBATIM and never hits the empty-var read-back
  throw). `animationOptionsToString` (`format.ts:84-110`) emits `animation-name/-duration/
  -timing-function/-iteration-count/-direction/-fill-mode/-delay`. The per-stop easing
  round-trips (`format.ts:164-169` — emits `animation-timing-function` inside a keyframe ONLY
  when it differs from the top-level default, keeping a uniform animation byte-identical).
- **The easing→CSS path is already fail-explicit.** `serializeEasing` (`format.ts:30-45`)
  emits a CSS-twinned easing's `.css` VERBATIM (a spring's `linear()`, a `cubic-bezier()`
  literal), reverse-looks-up registry easings (`easeOutCubic` → `ease-out-cubic`), and
  **THROWS a typed `AnimationOptionError`** for a custom closure with no faithful CSS twin
  rather than silently emitting a wrong `"linear"`. This is the ineligibility-report idiom the
  whole compiler generalizes — fail-EXPLICIT at a real structural limit is already house law.
- **The spring→`linear()` compiler is done.** `springLinearStops` (`springLinearStops.ts:46-73`)
  samples a `SpringProgress` ODE into a CSS `linear()` string with overshoot preserved
  (`linear()` honors `> 1` natively). Springs — the thing GSAP cannot even do in JS — already
  compile to a pure-CSS timing function.
- **The eligibility-report pattern is proven at the WAAPI seam.** `isWAAPIEligible`
  (`waapi.ts:98-208`) returns `{ eligible: false; reason: string }` for exactly the cases that
  cannot be delegated: custom renderer (`waapi.ts:117`), non-uniform per-frame easing
  (`waapi.ts:131`), CSS-twinned easing across multiple segments (`waapi.ts:143`), every
  layout-dependent unit (`waapi.ts:191`), and color interpolation (`waapi.ts:197`). **The CSS
  compiler's ineligibility report is the same shape, a wider domain.** `waapiIneligibleReason`
  is the precedent: a queryable, honest refusal, never a wrong pixel.
- **The parse path already captures the layering metadata.** `resolveKeyframes`
  (`adapter.ts:107-133`) lifts per-stop `animation-composition` onto a `composition` map
  (F.W8, `adapter.ts:120-126`) and parses `@property` descriptors. The engine round-trips
  metadata the compiler must EMIT — the two directions share the same data model.

**The structural asymmetry the lane exploits:** kf's input is a string of CSS and its internal
frame model is the parsed form of CSS keyframes. So "compile back to CSS" is the parser's
inverse over the SAME data structure — `format.ts` is literally `keyframes.ts` run backward.
GSAP/Motion/anime author in a bespoke tween object model; "export to CSS" for them is a
lossy re-derivation, which is why none of them ship it (§4). **This is the moat.**

---

## §2 What is expressible in pure CSS 2026 (the compilable core — K-HEADLINE)

The platform reached a threshold in early 2026 that makes the multi-animation compile
*faithful* for the common case, not a toy. Verified facts:

| CSS capability | Status (June 2026) | What the compiler emits |
|---|---|---|
| `@keyframes` + multiple `animation-*` per element | Baseline (long-standing) | The core. Each `Animation` → one `@keyframes` + one `animation` shorthand; multiple animations on one element via comma-separated `animation-name`. |
| `linear()` arbitrary easing / springs | **Baseline Widely Available 2026-06-11** ([web-features](https://web-platform-dx.github.io/web-features-explorer/features/linear-easing/)) | `springLinearStops` output, verbatim. Springs compile to zero-JS CSS — the headline demo. |
| `animation-composition: replace \| add \| accumulate` | **Baseline Widely Available 2026-01-04** ([web-features](https://web-platform-dx.github.io/web-features-explorer/features/animation-composition/), [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-composition)) | The LAYERING substrate. `AnimationGroup` blend `replace`→`replace`, `add`→`add` (see §3a). |
| `@starting-style` (entry from `display:none`/insert) | Baseline Newly Available (Firefox 129+; [web.dev](https://web.dev/blog/baseline-entry-animations)) | Entry animations. Note the platform nuance (§3d): `@starting-style` is a TRANSITION construct, not an `@keyframes` one — the compiler emits it only for the entry-transition case, not for every animation. |
| `@property` registered custom-property animation | Baseline | Custom-property keyframes (`--x` interpolated as a typed `<length>`/`<number>`) compile faithfully — the one case where animating a `var()` IS expressible in pure CSS. |
| `animation-timeline: scroll() / view()` | **NOT Baseline** (Chrome/Edge + Safari 26, Firefox flagged; [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations)) | A scroll-variant EXPORT is a progressive-enhancement emit (a `@supports (animation-timeline: scroll())` block), never the default — and brushes the scroll-orchestration K candidate, kept distinct (§5). |
| `sibling-index()` / `sibling-count()` stagger | **NOT Baseline** (Chromium-only; Firefox Q2 2026; Safari unknown — [SitePoint](https://www.sitepoint.com/css-siblingindex-and-siblingcount-native-list-staggering-without-javascript/), [Smashing](https://www.smashingmagazine.com/2026/05/mathematical-layouts-sibling-index-sibling-count/)) | The stagger sub-question — kf's compiler has a UNIQUE answer that side-steps the Baseline gap (§3b). |

**The compilable core, stated precisely.** A `Sequence`/`AnimationGroup`/`stagger` graph
compiles FAITHFULLY to pure CSS when, for every child animation:
1. it uses the default DOM renderer (a custom `transform` closure cannot be CSS — same gate as
   `waapi.ts:117`);
2. every interpolated property is a CSS-animatable property OR a registered `@property` custom;
3. no color interpolation crosses the perceptual-oklab axis (§3c — the deepest refusal);
4. the layering reduces to `replace`/`add`/`accumulate`, never `weighted` (§3a);
5. computed units (`vh`/`calc`/`var`/`cq*`) are emitted as their AUTHORED unit strings (CSS
   re-resolves them natively — and here the compiler is STRICTLY BETTER than WAAPI, §3e).

This is a STRICTLY WIDER eligible set than WAAPI: the compiler can emit `vh`/`cqw`/`calc()`
VERBATIM (CSS resolves them at use, no freeze), where WAAPI must reject them
(`waapi.ts:30-40`) because it freezes-to-px once. **The CSS compiler is the engine's most
faithful output target for computed units — more faithful than the compositor.** That is a
real, non-obvious result and a strong on-brand argument: only a CSS-source-of-truth engine
discovers that the best place to send a `calc(100cqw - 100%)` animation is back to CSS.

---

## §3 The four named refusals + the stagger novelty (the honesty surface)

A compiler is only as trustworthy as its refusal report. Each sub-section is either a NOVEL
capability or a recorded KILL of a tempting over-reach.

### §3a — `weighted` blend has no CSS twin (REFUSE; the axis-3 boundary)

kf's `BlendMode` is `replace | add | weighted` (`constants.ts:184`). CSS
`animation-composition` is `replace | add | accumulate`. The mapping is partial and the
non-match is the load-bearing refusal:

- `replace` → `replace` — exact (`group.ts:307`).
- `add` → `add` — exact, and `group.ts:320-321` even documents that kf's `add` is UN-CLAMPED
  to match CSS `animation-composition: add` ("`0.8 + 0.8 → 1.6`"). The semantics were
  deliberately aligned to CSS. This is a clean compile.
- `weighted` (`group.ts:345`, lerp-by-weight) → **NO CSS TWIN.** `animation-composition` has
  no per-layer scalar weight; `accumulate` is iteration-stacking, not a weighted blend. A
  `weighted` group is kf's UNIQUE axis-3 capability precisely BECAUSE the platform has no
  equivalent (`sota-landscape.md §4`). The compiler must refuse it with a typed reason:
  `"weighted layer blend has no animation-composition equivalent (replace/add/accumulate only)"`.

This is not a defeat — it is the compiler PROVING axis-3's uniqueness from the other side. The
refusal report is the receipt that `weighted` is genuinely beyond CSS. A nuance worth a BOOK:
a `weighted` blend with STATIC weights could in principle be PRE-MULTIPLIED into the keyframe
values at compile time (bake `w` into each stop's value, emit `replace`), collapsing the weight
into the data. That is a real partial-compile and a candidate K wave — recorded, not claimed.

### §3b — STAGGER: the genuinely novel CSS-2026 research (PARTIAL-COMPILE; on-brand)

`sibling-index()`/`sibling-count()` would express stagger in ONE line of pure CSS
(`animation-delay: calc(sibling-index() * 50ms)`) — but they are **NOT Baseline** (Chromium
only, Firefox Q2 2026, Safari unknown). So a compiler that emitted `sibling-index()` would
ship a Chromium-only artifact — anti-house (kf serves the certified, not the bleeding edge).

kf's compiler has a UNIQUELY BETTER answer because `stagger` is a *construction-time delay
distribution* (`stagger.ts:127-171` — "pure construction-time, the returned function does only
arithmetic"). The compiler MATERIALIZES the distribution at export and emits **per-element
literal delays**:

```css
/* compiled from stagger(8, { each: 50, from: "center", ease: easeOutCubic }) */
.item:nth-child(1) { animation-delay: 175ms } /* delays already eased + reshaped */
.item:nth-child(2) { animation-delay: 125ms }
/* ... materialized via stagger.delays(total) — stagger.ts:167 */
```

The novelty: kf's stagger supports `from: "center"/"edges"/index` AND an EASING reshape
(`stagger.ts:161` — `reshape(distance/max) * each * max`). `sibling-index()` cannot express an
EASED, origin-aware distribution in pure CSS without nested `calc()` that no engine ships.
kf's compiler bakes the eased distribution into literal `nth-child` delays — pure CSS, Baseline
everywhere, and expressing a curve `sibling-index()` cannot. **This is the on-brand stagger
answer: the engine that computes the distribution is the engine that can FREEZE it into CSS.**
A `@supports (sibling-index: 1)` progressive-enhancement variant (the one-liner where
supported) is an optional emit — BOOK, behind a flag, because it is Chromium-only today and
the literal-delay form is universal.

`stagger.delays(total)` already materializes the array (`stagger.ts:167`) — the compiler
consumes the EXISTING public API. Near-zero new surface for the stagger leg.

### §3c — PERCEPTUAL OKLAB color: the deepest refusal (REFUSE-or-DEGRADE; axis-2)

kf interpolates color perceptually by default (`colorSpace: "oklab"`, `sota-landscape.md §4`).
CSS keyframe color interpolation between two `oklab()` stops is NOT the same curve: the browser
interpolates in the `@keyframes`-declared color values' space per the CSS Color 4
interpolation rules, which is NOT guaranteed to match kf's JS oklab lerp across all stops, and
crucially kf's `hueMethod` (shorter/longer/increasing/decreasing) controls the hue path in a
way bare `@keyframes` cannot encode. Two honest options, both recorded:

- **REFUSE** (the conservative default, mirroring `waapi.ts:197` "color interpolation requires
  perceptual lerp"): a color-interpolating animation is reported ineligible with
  `"perceptual oklab interpolation has no faithful @keyframes equivalent"`.
- **DEGRADE-by-densification** (a K wave, MEASURE-FIRST): bake the perceptual curve into N
  intermediate color stops sampled from kf's JS oklab lerp — the SAME idiom WAAPI uses for
  curve fidelity (`waapi.ts:221` `WAAPI_SUBSEGMENT_STOPS`, "the 24-stop emit `springLinearStops`
  proves"). Emit `@keyframes` with 8-16 pre-sampled `oklab()` stops so the browser's
  piecewise-linear-per-segment fill tracks kf's perceptual curve. This is the one place the
  compiler can OUT-EXPRESS naive CSS — it can ship a perceptually-correct gradient that a
  hand-authored `@keyframes` (two stops, RGB lerp) gets wrong. **The proof gate decides which
  ships:** pixel-compare the densified CSS vs JS playback; if ΔE under a threshold, ship the
  degrade; else refuse. This is the on-brand color answer and a strong second headline.

### §3d — `@starting-style` is a TRANSITION construct, not a keyframe one (SCOPE, don't over-claim)

The brief lists `@starting-style` for entry. The platform fact ([web.dev](https://web.dev/blog/baseline-entry-animations),
search result: "When using CSS animations to implement such effects, `@starting-style` is not
needed") is that `@starting-style` governs CSS **transitions** from `display:none`/insertion —
an `@keyframes` animation with a `0%` stop already animates from its declared start without it.
So the compiler's `@starting-style` emit is NARROW: only for an entry animation modeled as a
transition (the FLIP/enter-from-removed case), NOT a blanket wrapper on every compiled
`@keyframes`. Over-claiming `@starting-style` on every export would be a correctness bug.
Recorded so the K tranche scopes it right: `@starting-style` is the FLIP/entry-transition leg,
not the keyframe-animation leg.

### §3e — computed units: the compiler is STRICTLY BETTER than WAAPI (a real result)

Where WAAPI must reject `vh`/`cqw`/`calc()`/`var()` (`waapi.ts:30-40` — it freezes them to px
once and cannot track a resize), the CSS compiler emits them VERBATIM and the browser
re-resolves them natively at use, on every layout change — exactly the property the rAF path
preserves (`waapi.ts:14-18`). So the compiler is the engine's MOST faithful output for the
container-query-unit axis (kf's unique axis-4, `sota-landscape.md §4`). A `calc(100cqw - 100%)`
ball animation (the demo's `AnimationVisualizer` workload, per MEMORY.md) compiles to pure CSS
with FULL container-resize fidelity that WAAPI cannot offer. This is the single most surprising
and most on-brand finding in the lane: the best target for kf's hardest unit class is CSS itself.

---

## §4 The competitive moat (verified) — no one else can do this

WebSearch (June 2026) confirms: NO mainstream JS animation library compiles its OWN authored
animation graph to zero-runtime CSS.

- The only "export to CSS" tools are SEPARATE GUI generators (Animista) or AI code generators
  (Workik) that author CSS from scratch — they do not invert an existing JS animation object
  ([brightcoding toolkit](https://www.blog.brightcoding.dev/2026/05/04/awesome-web-animation-the-essential-2024-developer-toolkit), [Workik](https://workik.com/css-animation-code-generator)).
- GSAP/Motion/anime animate via a JS ticker over a bespoke tween model; their authoring object
  is not CSS, so "export to CSS" is a lossy re-derivation no one ships ([ICS comparison](https://ics.media/en/entry/14973/), [LogRocket](https://blog.logrocket.com/best-react-animation-libraries/)).
- GSAP's whole VALUE PROPOSITION is positioned AGAINST CSS ("a superior alternative to CSS",
  [Medium](https://medium.com/four-nine-digital/revolutionizing-web-animation-with-gsap-a-superior-alternative-to-css-and-javascript-e823ba0d5f4b)) — they have a structural disincentive to compile to the thing they sell against.

**Only kf can do this because only kf's internal model IS parsed CSS keyframes.** The compiler
is the inverse of a parser that already exists. This is the cleanest "only a CSS-source-of-truth
engine could do it THIS way" in the entire fleet. The on-brand test is met maximally.

---

## §5 Boundary checks — kills NOT brushed, ownership NOT overlapped

- **The ARCH kill list:** this lane brushes NOTHING on it. It is not ScrollTimeline-native-
  REPLACE (it emits no scroll timeline by default; the optional `@supports (animation-timeline)`
  variant is an EXPORT artifact, not a runtime sampler swap — and is BOOK, not core). Not
  Worker/Houdini/WASM/Typed-OM/bit-packing/monomorphization. It is a pure-text emit: a string
  generator beside `format.ts`. Zero runtime hazard surface — it RUNS at author time and emits
  text; the shipped page has no kf code at all (the opposite of a perf risk).
- **Tranche J ownership:** J.W5/WZ owns PUBLISHING THE JS LIBRARY to npm (the 16-export tier,
  the README). That is "ship the runtime." THIS lane is "emit an artifact that needs NO
  runtime" — the inverse product. They do not overlap; if anything the compiler is the ultimate
  expression of why the published library matters (you author with it, then you don't ship it).
  `format.ts` is touched by J.W1 (ENG-1: unify the per-card serializer onto serialize-from-
  template) — the compiler BUILDS ON that unified serializer, so it must land AFTER J.W1
  closes (a clean dependency, not a conflict). The compiler is K-tranche, post-J.
- **Sibling frontier lanes:** `live-stylesheet-ingestion` is the parser-FORWARD over the live
  page (ingest third-party `@keyframes`); this lane is the parser-BACKWARD over the JS graph
  (emit CSS). They are the two halves of the round-trip axis and COMPOSE — ingest a page's
  animation, scrub/spring-ify it in the IDE, recompile to CSS. `view-transitions` is a
  different surface (DOM-mutation choreography). No overlap.

---

## §6 The demo gain — the editor becomes a CSS animation IDE

The single most valuable product consequence: an **"Export CSS" button** turns the demo editor
from "a thing that plays animations" into "a CSS animation IDE." The author:
1. builds a `Sequence`/`AnimationGroup`/`stagger` interactively (the existing editor),
2. clicks Export CSS,
3. gets a pure-CSS artifact + an HONEST ineligibility report for anything that did not compile
   (the `weighted` blend, the custom renderer, the perceptual color — each named with its
   reason, the `serializeEasing`/`waapiIneligibleReason` idiom generalized).

This is a category the field does not have: not "a CSS generator" (authors from scratch) but
"a CSS COMPILER" (inverts a played animation). It dogfoods the round-trip axis as a USER-FACING
feature, and the ineligibility report TEACHES the user exactly where kf's unique axes (weighted
blend, perceptual color) exceed what pure CSS can hold — the refusal is marketing for the moat.

---

## §7 Effort, the proof gate, the wave shape

**Effort: L–XL** (a tranche, not a wave). The single-`Animation` serializer exists
(`format.ts`); the new surface is: (a) the GROUP/SEQUENCE/STAGGER walker that emits multi-
animation CSS + `animation-composition` + materialized stagger delays; (b) the ELIGIBILITY
report generalizing `waapiIneligibleReason` to the wider CSS domain (the four refusals of §3);
(c) the perceptual-color densify-or-refuse decision (§3c, MEASURE-FIRST); (d) the editor Export
button + report UI. Legs (a)+(b) are the K-HEADLINE core; (c) is a K wave gated on the pixel
proof; (d) is the demo leg.

**The proof gate (non-negotiable, and the lane's whole credibility):** the compiled CSS is
replayed in a real browser side-by-side vs the JS playback and **pixel-compared** (the
chrome-devtools-mcp screenshot-diff idiom the J gates use). For every compilable input, the
zero-JS CSS artifact must be visually isomorphic to the kf JS playback within an ε threshold;
for every refused input, the report must name the reason and the JS playback must be the only
faithful path. This is the same born-RED → green discipline as `proof:engine-no-throw-on-play`,
applied to the COMPILE: a planted custom-renderer/weighted-blend/oklab input must RED the
compile (force the refusal); a clean spring+stagger+replace-group input must compile and
pixel-match. The gate is the entire point — a compiler that drifts is worse than no compiler.

**MEASURE-FIRST probes named:** the perceptual-color densify (§3c) ships ONLY if the N-stop
`oklab()` emit pixel-matches kf's JS oklab lerp under ΔE-ε (else refuse); the stop-count N is
chosen by the same densification bench `WAAPI_SUBSEGMENT_STOPS` (`waapi.ts:221`) already
justifies. No perf claim is made about the EMIT (it is author-time text); the only measurement
is FIDELITY (the pixel/ΔE proof).

---

## §8 Verdict ledger

| ID | Proposal | Verdict | Why |
|---|---|---|---|
| CC-1 | Compile `AnimationGroup`/`Sequence`/`stagger` → pure CSS (`@keyframes` + `animation-*` + `animation-composition` + materialized stagger delays) with a honest ineligibility report | **K-HEADLINE-CANDIDATE** | The purest instance of axis-1; no competitor can structurally do it (§4); half exists (`format.ts`); gated on the pixel proof |
| CC-2 | Perceptual-oklab densify-to-CSS-stops (the one place the compiler out-expresses naive `@keyframes`) | **K-CANDIDATE** | Extends axis-2 into the artifact; MEASURE-FIRST (ΔE pixel proof decides ship-vs-refuse) |
| CC-3 | The eligibility/ineligibility report generalizing `waapiIneligibleReason` to the CSS domain (the four refusals of §3) | **K-CANDIDATE** | The trust surface; the four refusals PROVE the uniqueness of kf's axes from the other side |
| CC-4 | Editor "Export CSS" button → the demo becomes a CSS animation IDE | **K-CANDIDATE** | The user-facing dogfood; depends on CC-1; the demo leg |
| CC-5 | Pre-multiply STATIC `weighted` weights into keyframe values → emit `replace` (partial-compile of axis-3) | **BOOK** | A real partial-compile, but premature; record so the K tranche evaluates it, don't claim it |
| CC-6 | `@supports (sibling-index)` / `@supports (animation-timeline: scroll())` progressive-enhancement EXPORT variants | **BOOK** | Both NOT Baseline (Chromium-only); the universal literal-delay form is the default; the PE variant is a flagged extra |
| CC-7 | Treat `@starting-style` as a blanket wrapper on every compiled `@keyframes` | **KILL** | Platform-wrong: `@starting-style` is a TRANSITION construct; an `@keyframes 0%` stop already animates from start (§3d). Emit it ONLY for the entry-transition/FLIP leg |
| CC-8 | Compile `weighted` blend to CSS directly | **KILL** | No `animation-composition` equivalent (§3a); refusing it is correct and PROVES axis-3's uniqueness |

---

## §9 Sources

Internal (file:line): `src/animation/format.ts:30-194` (serializer + `serializeEasing`
fail-explicit), `src/animation/springLinearStops.ts:46-73` (spring→`linear()`),
`src/animation/waapi.ts:30-40,98-208,221` (the ineligibility-report precedent + densification
idiom), `src/animation/stagger.ts:127-171` (construction-time distribution + `.delays`),
`src/animation/sequence.ts` (the orchestration graph to compile), `src/animation/group.ts:307-345`
(blend modes ↔ `animation-composition`), `src/animation/adapter.ts:107-133` (the F.W8
`composition` capture — the parse direction the compiler inverts), `src/animation/constants.ts:184`
(`BlendMode`). Lane docs: `audit/sota-landscape.md §4` (the three unique axes), `J.md §WAVE MAP`
(J.W1 unifies `format.ts`; J.W5/WZ publishes the runtime — distinct from this lane),
`audit/frontier/live-stylesheet-ingestion.md` (the parser-forward sibling), `MEMORY.md` (the
`calc(100cqw - 100%)` demo workload).

External: [animation-composition Baseline 2026-01-04 (web-features)](https://web-platform-dx.github.io/web-features-explorer/features/animation-composition/) · [MDN animation-composition](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-composition) · [linear() Baseline 2026-06-11 (web-features)](https://web-platform-dx.github.io/web-features-explorer/features/linear-easing/) · [sibling-index()/sibling-count() NOT Baseline (SitePoint)](https://www.sitepoint.com/css-siblingindex-and-siblingcount-native-list-staggering-without-javascript/) · [sibling-index stagger (Smashing)](https://www.smashingmagazine.com/2026/05/mathematical-layouts-sibling-index-sibling-count/) · [@starting-style is a transition construct (web.dev)](https://web.dev/blog/baseline-entry-animations) · [MDN @starting-style](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@starting-style) · [scroll-driven NOT Baseline (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations) · [no JS lib exports-to-CSS (ICS)](https://ics.media/en/entry/14973/) · [CSS generators are separate tools (BrightCoding)](https://www.blog.brightcoding.dev/2026/05/04/awesome-web-animation-the-essential-2024-developer-toolkit) · [GSAP positioned against CSS (Medium)](https://medium.com/four-nine-digital/revolutionizing-web-animation-with-gsap-a-superior-alternative-to-css-and-javascript-e823ba0d5f4b)
</content>
</invoke>
