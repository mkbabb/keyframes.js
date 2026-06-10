# Frontier lane — LIVE STYLESHEET INGESTION + the diagnostics frontier

**Lane:** `live-stylesheet-ingestion` (FRONTIER-RESEARCH, tranche-development; seeds a future K
tranche). **Question:** can kf ingest the *live page* — its existing `document.styleSheets`,
its *running* CSS animations — turning the parse-text engine into a round-trip engine over
animations it did not author? And can the proof culture be *productized* as a structured
diagnostics + frame-health channel? Method: source surface (cited `file:line`) + the verified
2026 platform facts (external claims linked) + the J ground-truth corpus
(`audit/sota-landscape.md`, `J.md §WAVE MAP`, `audit/recap-deferred.md`).

The on-brand test (binding): a proposal earns a K verdict only if it **extends one of kf's
three unique axes** — (1) CSS `@keyframes` as a parseable, round-trippable source of truth;
(2) perceptual oklab interpolation; (3) weighted layer blending — or closes a named gap
**in a way only a CSS-source-of-truth engine could**. "DevTools has an animation inspector" is
not a reason; "only an engine that round-trips author CSS back to author CSS could scrub +
spring-ify + re-serialize a *third party's* `@keyframes`" is.

---

## §1 The seam that already half-exists (internal evidence)

kf parses `@keyframes` **TEXT**. The entire ingestion pipeline is text-in:

- `CSSKeyframesAnimation.fromString(css)` (`engine.ts:1227`) → `resolveKeyframes(css)`
  (`adapter.ts:94`) → value.js `parseCSSStylesheet` (a string parser, `adapter.ts:97`).
- `resolveKeyframes` already returns a `ResolvedKeyframes` carrying not just the keyframe map
  but **side data the live page also exposes**: `timingFunctions` (per-stop
  `animation-timing-function`), `composition` (per-stop `animation-composition`, captured at
  `adapter.ts:122-126` — the F.W8 capture), `properties` (`@property` registry), and `options`
  (a sibling style rule's `animation` shorthand/longhands, `adapter.ts:135`).
- `fromString` consumes ALL of it: it layers the style-rule `animation` options as the base
  (`engine.ts:1244-1265`), registers parsed `@property` descriptors with the platform via
  `CSS.registerProperty` (`engine.ts:1321`), and round-trips per-stop easing with a faithful
  CSS twin (`engine.ts:1287-1291`).
- The serialize-back half is real and symmetric: `CSSKeyframesToString` (`format.ts:124`)
  emits from the **declared template values** (`format.ts:155` — I.W0 S2, never DOM-resolved),
  and `serializeEasing` (`format.ts:30`) round-trips the easing faithfully or throws explicit.

**The structural fact:** the engine's input is a *string of CSS*, and the live page exposes
*strings of CSS* through the CSSOM — `CSSKeyframesRule.cssText` and a style rule's
`style.cssText` are the serialized author rules
([MDN CSSKeyframesRule](https://developer.mozilla.org/en-US/docs/Web/API/CSSKeyframesRule)).
The bridge from "live page" to "kf object" is therefore **not a new parser** — it is a thin
CSSOM-walk that reconstructs the text `resolveKeyframes` already eats. No grammar work, no
WASM (the ARCH WASM-parser kill is not even brushed). This is the cheapest possible frontier
relative to its reach: kf is *one adapter* away from animating the page's own CSS.

**LD-DIAG is already booked.** `recap-deferred.md:268`: *"`ResolvedKeyframes.diagnostics`
channel — producer half landed (parse-that PT-1) — BOOK (kf seam) + value.js-HANDOFF (the
structured sink). CROSS-REF B1 — the cleanest surface for the empty-parse signal."* The
diagnostics frontier is a *recorded* deferral with a producer already shipped upstream; this
lane researches whether to elect it.

**Nothing in `src/` touches `styleSheets` / `getAnimations` / `cssRules` / `adoptedStyleSheets`
today** (grep: zero hits). The frontier is genuinely net-new capability, not a re-litigation.

---

## §2 The platform constraints (external evidence — the hard edges)

### 2.1 CSSOM read access is CORS-gated

`document.styleSheets[i].cssRules` throws a `SecurityError` for any **cross-origin** sheet
without `Access-Control-Allow-Origin` + `crossorigin` on the `<link>`
([codestudy.net](https://www.codestudy.net/blog/cannot-access-rules-in-external-cssstylesheet/),
[html2canvas#2197](https://github.com/niklasvh/html2canvas/issues/2197)). Same-origin sheets,
inline `<style>`, and `adoptedStyleSheets` (constructed in-page, always same-origin) are
readable. **Consequence for kf:** a "walk every sheet" ingester MUST `try/catch` per-sheet and
*report* the skipped cross-origin sheets — it cannot silently drop them (a silent drop is the
exact class the proof culture forbids). This makes the **diagnostics channel a prerequisite,
not an add-on**: ingestion's honest failure mode IS a diagnostic.

### 2.2 `getAnimations()` exposes the running animation, but takeover is delicate

`Element.getAnimations()` / `Document.getAnimations()` return live `Animation` objects for CSS
animations, transitions, and WAAPI — each with a writable `currentTime`, a `playState`, and an
`effect` whose `getKeyframes()`/`getTiming()` expose the computed keyframes
([MDN Using WAAPI](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API),
[cassidoo: pausing a CSS animation with getAnimations()](https://dev.to/cassidoo/pausing-a-css-animation-with-getanimations-557d)).
A CSS animation can be paused mid-flight (`anim.pause()`), its `currentTime` read, and a *new*
WAAPI animation seeded at that time. BUT: a CSS-originated `Animation`'s `replaceState`
becomes `removed` if the underlying `animation-name` is removed/replaced, and a `fill:forwards`
WAAPI animation "takes precedence over all static styles" until `commitStyles()` + `cancel()`
([MDN WAAPI concepts](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Web_Animations_API_Concepts)).
**kf already solved exactly this handoff** — `playWAAPI` commits-on-finish then cancels to
avoid the leaked-precedence trap (`waapi.ts:386-398`). The takeover therefore reuses a
discipline kf already proved, rather than inventing one.

### 2.3 The diagnostics platform: LoAF is powerful but Chrome-only

The **Long Animation Frames API** (`PerformanceObserver`, `entryType:
"long-animation-frame"`) reports frames delayed > ~50 ms with **per-script attribution** and
style/layout/paint phase breakdowns — exactly the engine-health signal kf's LoAF *gate*
already asserts in CI
([Chrome: Long Animation Frames](https://developer.chrome.com/docs/web-platform/long-animation-frames),
[MDN PerformanceLongAnimationFrameTiming](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceLongAnimationFrameTiming)).
**It shipped Chrome 123 and is NOT Baseline** (absent in Safari/Firefox)
([MDN long-animation-frame timing](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/Long_animation_frame_timing)).
So a productized LoAF API must feature-detect and degrade — it cannot be a load-bearing
correctness surface, only an *opt-in observability* surface.

### 2.4 The prior-art ceiling — and what it cannot do

Chrome DevTools' Animations panel and the **Motion DevTools** extension already *scrub* a
page's CSS/Motion-One animations on a timeline
([Chrome DevTools animations](https://developer.chrome.com/docs/devtools/css/animations),
[Motion DevTools](https://chromewebstore.google.com/detail/motion-devtools/mnbliiaiiflhmnndmoidhddombbmgcdk)).
**None of them round-trips back to author CSS, re-times via spring physics, re-interpolates
color perceptually, or re-serializes a modified `@keyframes`.** They inspect; they do not
*transform-and-emit*. That gap is precisely kf's three axes. The frontier is not "build an
inspector" (me-too, BOOK) — it is "make the page's own animations *editable as kf objects and
emittable back as CSS*," which only a round-trip CSS-source-of-truth engine can do.

---

## §3 The proposals

### K1 — `fromStyleSheets()` / `fromLiveAnimations()`: the CSSOM-walk adapter (the headline)

**What.** A thin, additive ingester on the HEAVY surface: `resolveKeyframes` gains a sibling
`resolveLiveKeyframes(doc | sheet[] | { animationName })` that walks `document.styleSheets`,
filters to `CSSKeyframesRule` (and the sibling style rules that reference them via
`animation-name`), serializes each via `rule.cssText`, and feeds that text into the *existing*
`parseCSSStylesheet` → `resolveKeyframes` pipeline — yielding `CSSKeyframesAnimation` objects
for animations **kf did not author**. The consumer then has the full kf surface on a
third-party animation: scrub (`advanceTo`), retime (`setDuration`), **spring-ify**
(`setTimingFunction(springTimingFunction(...))` — replace a CSS `ease` with a real SwiftUI
spring + its `linear()` twin), re-color (oklab), and **re-serialize** the modified animation
back to CSS (`CSSKeyframesToString`).

**Why only kf.** The CSSOM round-trip exists in every browser; *re-emitting author CSS after a
physics/perceptual transform* exists nowhere. DevTools scrubs; Motion DevTools plots. kf is the
only engine whose input AND output are author `@keyframes`, so it is the only one that can take
a page's `@keyframes pulse { ... }`, swap its timing for a spring, and hand back a valid
`@keyframes pulse { ... }` the author can paste. This is axis (1) — the round-trip — pointed at
*foreign* CSS instead of editor CSS.

**kfAxis.** Extends axis (1) (CSS `@keyframes` round-trip) from authored-input to
live-page-input; carries axes (2)/(3) along for free (re-color perceptually, re-blend).

**Effort: M.** No grammar work — the text bridge reuses `resolveKeyframes` whole. The new code
is: the CSSOM walk, per-sheet `try/catch` (the CORS edge, §2.1), and `animation-name`→rule
linkage. Lives behind `loadAnimationEngine()` (it needs the parser; the boundary holds). The
risk is entirely in *honest failure reporting* (→ K3), not in parsing.

**Measure-first gate.** Not perf-flavored at the engine level (it runs once, at ingest). The
gate is a *correctness* round-trip oracle: ingest a known same-origin `@keyframes`, assert the
reconstructed kf object's serialized output re-parses to a byte-equivalent template (the
`format.ts` symmetry already tested for authored input — extend the corpus to CSSOM-sourced
input). The cross-origin path asserts a *diagnostic*, not a throw.

**ARCH-kill distinction.** This is NOT ScrollTimeline-native-REPLACE, NOT Houdini, NOT
Typed-OM-as-carrier. It reads `cssText` (a string) and feeds the existing string parser. It is
additive capture, the same shape as the F.W8 composition capture (`adapter.ts:122`).

**Verdict: K-HEADLINE-CANDIDATE.** It is the single proposal that makes "CSS as source of
truth" mean *the whole web's* CSS, not just the editor's — and it is M-effort because the
engine already eats exactly the text the CSSOM emits.

---

### K2 — `adopt()`: seamless takeover of a *running* CSS animation via `getAnimations()`

**What.** Given a live element with a running CSS animation, `adopt(el, { animationName })`:
(1) `getAnimations()` on the element, (2) finds the matching `CSSAnimation`, (3) reads its
`currentTime` + `playState`, (4) reconstructs the kf `CSSKeyframesAnimation` from the
`@keyframes` rule (via K1), (5) `pause()`es the native animation and seeds the kf animation at
the captured `currentTime` so the visual is continuous, (6) hands control to the kf engine
(rAF or WAAPI). Inverse of `playWAAPI`'s commit-on-finish: a commit-on-*adopt* that bakes the
current computed frame inline before cancelling the native animation, so there is no flash.

**Why only kf.** Taking over a CSS animation mid-flight into a *physics-capable, perceptually-
correct, re-serializable* engine is the round-trip axis made *live and seamless*. The handoff
math (currentTime continuity, the `commitStyles`/precedence trap) is one kf already solved in
the opposite direction (`waapi.ts:386-398`) — this reuses that discipline.

**kfAxis.** Extends axis (1) into the *temporal* dimension: round-trip not just the static
keyframes but the *running playhead*. A page animation becomes a kf animation without a visible
seam.

**Effort: L.** The takeover semantics are delicate (§2.2): `replaceState` transitions, the
`commitStyles` precedence trap, alternate/iteration-count phase reconstruction from a single
`currentTime` scalar, and the fact that `getAnimations()` keyframes are the *computed* (px-
resolved) form, not the authored form — so K2 should reconstruct from the **CSSOM `@keyframes`
rule (K1)**, using `getAnimations()` only for the playhead + timing, never as the keyframe
source (the computed form has already lost `var()`/`cqw`/oklab — the very things kf's axes
preserve). That coupling is what pushes effort to L.

**Measure-first gate.** A live continuity oracle (chrome-devtools-mcp, per the memory rule):
adopt a running animation at a known `currentTime`; assert the computed style at the adopt
instant is within ε of the pre-adopt computed style (no flash), and that scrubbing thereafter
runs the kf curve. Born-RED witness: a naive seed-at-zero adopt flashes; the cure is the
currentTime-continuous seed.

**ARCH-kill distinction.** Not ScrollTimeline-native-REPLACE. This takes over a *time-based*
CSS animation; the JS progress driver is unaffected. `createNativeTimeline` already wraps
native timelines (`waapi.ts:440`) — this is the analogous wrap for native *clock* animations.

**Verdict: K-CANDIDATE.** Real and uniquely kf, but L-effort and strictly downstream of K1 (it
needs K1's CSSOM reconstruction to preserve the axes). A K wave, not the headline.

---

### K3 — `ResolvedKeyframes.diagnostics`: the structured parse-result channel (elect the BOOK)

**What.** Promote the booked LD-DIAG item (`recap-deferred.md:268`): give `ResolvedKeyframes`
a `diagnostics: Diagnostic[]` field where `Diagnostic = { severity, code, message, source? }`.
It carries: the **empty-parse signal** (today `resolveKeyframes` silently re-wraps and may
yield zero frames — `adapter.ts:100-103` — the B1-class crash's cleanest surface), the
**cross-origin-sheet skip** (§2.1, load-bearing for K1's honesty), **unrecognized per-stop
timing functions** (today silently fall back — `engine.ts:1281`), and **WAAPI-ineligibility
reasons** lifted from the eligibility gate (`waapi.ts` already returns structured `reason`
strings — fold them into the same channel). The producer half landed upstream (parse-that
PT-1, per `recap-deferred.md:268`); this elects the kf-side sink.

**Why only kf.** This is **the proof culture, productized** — the structured-result discipline
the engine enforces in CI (the LoAF gate, the boundary gate, the typed errors) exposed as a
*runtime* channel a consumer can read. No competitor ships a "why did my animation degrade?"
structured channel because no competitor has the proof culture to productize. It also makes K1
*honest by construction*: a cross-origin skip is a diagnostic row, never a silent drop.

**kfAxis.** Extends the engine-discipline axis (the 5th SOTA verdict, `sota-landscape.md §4`):
"competitors claim; kf proves." This makes the proof *legible to the consumer at runtime*.

**Effort: M.** A pure data channel — no engine behavior change. The risk is scope discipline:
keep it a *flat additive field* with stable `code`s, not a logging framework (KISS).

**Measure-first gate.** Not perf — a contract gate: each diagnostic `code` has a born-RED test
(empty parse emits `EMPTY_PARSE`; a CORS sheet emits `CROSS_ORIGIN_SKIP`; a bad timing fn emits
`UNKNOWN_TIMING_FN`). The channel is correct iff every silent-fallback site in
`adapter.ts`/`engine.ts` is mirrored by a diagnostic row.

**Cross-ref.** This is the cleanest channel for the empty-parse signal the J audit names
(`I-TOTALITY-ASSAY.md:95`, B1 cross-ref). It may be **small enough to J-FOLD** into J.W1 (the
engine-totality pass already makes the guards total — the diagnostic row is the natural
companion to the typed throw). See §4.

**Verdict: K-CANDIDATE** (or J-FOLD into J.W1 for the empty-parse + selector-guard rows — see
§4). The *full* channel (CORS skip, WAAPI reasons) is K-scoped because it presupposes K1.

---

### K4 — `instrument()`: the LoAF/long-task self-instrumentation API (the engine reports its own health)

**What.** An opt-in `Animation.instrument()` / `AnimationGroup.instrument()` that attaches a
`PerformanceObserver({ type: "long-animation-frame" })` (with a `longtask`/frame-budget
fallback where LoAF is absent — §2.3) and exposes a `frameHealth` readout: dropped frames,
LoAF count during playback, per-script attribution when available. The engine *reports its own
frame health* — the CI LoAF gate's signal, available to the running consumer.

**Why only kf (qualified).** kf is the only engine that *gates* itself on LoAF in CI
(`sota-landscape.md §1`: "the LoAF bench holds a 200-cell group, zero >50 ms blocking tasks").
Productizing that is on-brand. BUT: a generic `PerformanceObserver` wrapper is *not* uniquely
kf — any library could ship it, and the platform already exposes it directly. The on-brand
sliver is narrow: **attributing a LoAF to a specific animation/group** (kf knows which targets
it ticks; it can correlate a long frame to *this group's* `YIELD_BATCH` slice). Without that
attribution it is a me-too wrapper.

**kfAxis.** Engine-discipline axis — but only if it *attributes*, not if it merely observes.

**Effort: M** (the bare observer) / **L** (the attribution — correlating LoAF script-timing
entries to the engine's own tick is non-trivial and Chrome-only).

**Measure-first gate.** The attribution must be *demonstrated*: plant a deliberately janky
custom transform, assert the channel attributes the LoAF to that animation. If attribution
can't be made reliable cross-the-observer-boundary, the proposal collapses to the me-too
wrapper and should be KILLED.

**Verdict: BOOK.** Real upside, on-brand only at the attribution layer, Chrome-only (§2.3),
and the attribution is the hard part that may not pan out. Record it; do not anchor a wave on
it. Revisit if/when LoAF approaches Baseline AND K1/K3 have shipped (it composes with the
diagnostics channel).

---

### K5 — the embeddable INSPECTOR / bookmarklet positioning (the demo as a devtool)

**What.** Package K1+K2+K3 as a self-contained bookmarklet/extension: drop it on *any same-
origin page*, it walks the sheets, lists every `@keyframes`, lets you scrub/retime/spring-ify
each, and *copies the modified CSS back to the clipboard*. The kf demo becomes an embeddable
animation **inspector-and-editor** for the open web.

**Why only kf.** DevTools and Motion DevTools inspect-and-plot; only kf could inspect-*edit*-
**emit** (the round-trip). That is a genuinely differentiated devtool.

**kfAxis.** A *distribution/positioning* play riding axis (1), not a new engine capability.

**Effort: L–XL.** A bookmarklet hits the CORS wall hard (§2.1 — most real pages have cross-
origin sheets); an extension escapes CORS (content-script privileges) but is a whole separate
product with its own release/maintenance surface — explicitly the ecosystem/distribution gap
the J charter already owns elsewhere (`J.md` — J.W5/WZ own publish/distribution). Building an
extension is *scope creep into a second product*.

**Verdict: BOOK.** The positioning is real and worth recording as the *narrative* that
justifies K1–K3 (it answers "why ingest the live page?" — to be the web's animation round-trip
tool). But as a *deliverable* it is premature: it presupposes K1+K2+K3 shipped AND the npm
publish (J.W5) done. Record it as the K-tranche's north-star demo, not a wave. NOT a KILL —
the inspector framing is what makes K1 worth doing; it is simply downstream of everything.

---

## §4 J-fold candidates (tiny enough + in-scope now)

- **K3's empty-parse + selector-guard diagnostic rows → J.W1.** J.W1 (the engine-totality
  pass) already makes the `adapter.ts` guards total (SEAM-1 the selector guard, SEAM-2 the
  empty-input pin, per `J.md §finding-cluster`). A *structured diagnostic row* alongside the
  typed throw is the natural companion — `EMPTY_PARSE`/`UNKNOWN_TIMING_FN` rows are ~20 LoC and
  ride the same totality motion. The *full* diagnostics channel (CORS skip, WAAPI reasons)
  stays K-scoped (it needs K1). **Fold the two engine-internal rows; book the rest.**

Nothing else here is J-scoped: K1/K2/K4/K5 are all net-new capability the J charter explicitly
does NOT own (J owns boundary integrity, not new engine surface — `J.md §thesis`).

---

## §5 The synthesis line

kf is **one thin adapter away** from animating the live web's own CSS, because the engine's
input is already a string of CSS and the CSSOM emits strings of CSS (`adapter.ts:97` eats
exactly what `CSSKeyframesRule.cssText` produces). That adapter (**K1**, K-HEADLINE) turns the
"CSS as source of truth" axis from *the editor's* CSS into *any page's* CSS, and it is M-effort
precisely because no parser work is needed. On top of it: **K2** (seamless `getAnimations()`
takeover — K-CANDIDATE, L, reuses the `commitStyles` handoff kf already proved) and **K3** (the
booked `diagnostics` channel — K-CANDIDATE, with two rows J-foldable into J.W1) compose into a
coherent K wave: *ingest the page, take over its animations, report honestly what you found*.
**K4** (LoAF self-instrumentation) and **K5** (the embeddable inspector) are BOOKs — the first
on-brand only at the hard attribution layer and Chrome-only; the second a second-product scope
creep that presupposes the publish J already owns. The headline: **only a round-trippable
CSS-source-of-truth engine could scrub, spring-ify, re-color, and re-emit a third party's
`@keyframes` — and kf is that engine, one adapter short.**

---

## §6 Verdict ledger

| id | title | axis | effort | verdict |
|---|---|---|---|---|
| K1 | `fromStyleSheets()` CSSOM-walk ingester | axis-1 round-trip → live page | M | **K-HEADLINE-CANDIDATE** |
| K2 | `adopt()` running-animation takeover | axis-1 round-trip → temporal | L | **K-CANDIDATE** |
| K3 | `ResolvedKeyframes.diagnostics` channel | engine-discipline axis | M | **K-CANDIDATE** (2 rows J-FOLD → J.W1) |
| K4 | `instrument()` LoAF self-instrumentation | engine-discipline axis | M/L | **BOOK** |
| K5 | embeddable inspector / bookmarklet | distribution (rides axis-1) | L/XL | **BOOK** |

---

## §7 External sources

[MDN CSSKeyframesRule](https://developer.mozilla.org/en-US/docs/Web/API/CSSKeyframesRule) ·
[Cannot access cross-origin cssRules (codestudy.net)](https://www.codestudy.net/blog/cannot-access-rules-in-external-cssstylesheet/) ·
[html2canvas#2197 cross-origin cssRules SecurityError](https://github.com/niklasvh/html2canvas/issues/2197) ·
[MDN Using the Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API) ·
[MDN WAAPI Concepts (replaceState, commitStyles precedence)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Web_Animations_API_Concepts) ·
[cassidoo: pausing a CSS animation with getAnimations()](https://dev.to/cassidoo/pausing-a-css-animation-with-getanimations-557d) ·
[Chrome: Long Animation Frames API](https://developer.chrome.com/docs/web-platform/long-animation-frames) ·
[MDN PerformanceLongAnimationFrameTiming](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceLongAnimationFrameTiming) ·
[MDN long-animation-frame timing (browser support)](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/Long_animation_frame_timing) ·
[Chrome DevTools: inspect CSS animations](https://developer.chrome.com/docs/devtools/css/animations) ·
[Motion DevTools (Chrome Web Store)](https://chromewebstore.google.com/detail/motion-devtools/mnbliiaiiflhmnndmoidhddombbmgcdk)
