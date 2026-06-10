# Frontier lane — View Transitions as a first-class kf target

**Lane:** view-transitions (FRONTIER-RESEARCH fleet, K-tranche seeding · 2026-06-10).
**Charter:** is the same-document View Transitions API (Baseline Newly Available, 2025-10-14)
a frontier-defining, on-brand surface for keyframes.js — and if so, WHICH seam only a
CSS-source-of-truth engine could occupy. Method: internal source surface (`file:line`) +
the SIBLING glass-ui evidence (kf consumes its VT helper today) + WebSearch/WebFetch-verified
platform facts (§Sources). Verdict vocabulary per the fleet charter. **Skeptical of its own
lane:** the headline finding is that the obvious framing (b) is a KILL and the obvious framing
(a) is largely ALREADY SHIPPED by glass-ui — the one genuinely on-brand, frontier seam is (c),
spring-`linear()`-driven VT pseudos, and it is small.

---

## §0 The decisive prior fact — glass-ui already owns the VT helper, and kf CONSUMES it

Before proposing anything, the single most important piece of evidence: **the
`startViewTransition` helper, the `{types}` API, the `view-transition-class` group recipe, the
PRM degrade, and the focus-routing a11y MANDATORY are ALREADY SHIPPED in glass-ui** and kf
already consumes them.

- glass-ui `src/composables/motion/useViewTransition.ts:100-134` — `startViewTransition(mutate,
  { types })`, feature-detected object-form `{ update, types }` overload (Chrome 140+),
  `vt.ready?.catch(() => {})` skip-swallow, `finished` that never rejects. The full helper.
- glass-ui `src/styles/view-transition.css` — the `.gl-list-item` `::view-transition-group`
  group recipe, `--vt-duration`/`--vt-ease` tokens (default `var(--spring-bouncy)`), the
  `:only-child` slide-in/out, the PRM `animation: none` degrade, `::view-transition {
  pointer-events: none }`. Loaded into the demo via `@import "@mkbabb/glass-ui/styles"`.
- kf `demo/app/useSceneTransition.ts:1-39` — kf's scene-swap ALREADY routes through
  glass-ui's `startViewTransition`, with the engine-dogfooding `SpringProgress` cross-dissolve
  (`useSceneSwap.ts`) as the explicit no-VT fallback. **The "one API, two backends" pattern
  the lane brief asks for already exists at the scene-swap seam** — native VT where supported,
  kf `SpringProgress` ramp where not.
- glass-ui dock (`node_modules/@mkbabb/glass-ui/dist/dock.js:600-602`) emits per-route
  `view-transition-name` + `view-transition-class: gl-dock-layer` for the consumer's route
  geometry morph.

The J charter records this: the `{types}` VT helper is on the **glass-ui AX-owned ledger,
consumed on publish, never kf-patched** (J.md §chronic-fold: "the `{types}` VT helper … all
AX-owned, consumed on publish"). **inv-16 binds:** a VT *helper* (the rAF-free DOM-mutation
wrapper, focus routing, types feature-detect, the group CSS substrate) is glass-ui's domain,
not kf's. kf is the interpolation/parse engine; glass-ui is the UI motion substrate. **Any kf
VT proposal that re-implements the helper is an inv-16 breach and is KILLED on sight.**

This reframes the entire lane. The lane brief's four framings are evaluated against ONE bar:
*does it belong in the ENGINE (kf) rather than the UI substrate (glass-ui), AND does only a
CSS-source-of-truth / perceptual-color / spring engine make it possible?*

---

## §1 The platform constraints (verified, June 2026)

| Fact | Status | Source |
|---|---|---|
| Same-document VT (`document.startViewTransition`) | **Baseline Newly Available** 2025-10-14 (Chrome 111, Safari 18, Firefox 144) | web.dev, MDN |
| `view-transition-class` | **Baseline Newly Available** 2025-10-14 (Firefox 144 closed the gap) | MDN group-transitions guide |
| `transition.types` + `:active-view-transition-type()` | **Chrome 140+ ONLY** — Firefox 144 ships VT WITHOUT types | Chrome blog 2025; glass-ui `useViewTransition.ts:46-50` |
| VT pseudos accept custom CSS `animation-*` incl. `animation-timing-function` | **YES** — set on `::view-transition-group()`, inherited by `-image-pair`/`-old`/`-new` | Chrome blog 2025 |
| `linear()` easing valid on VT pseudo animations | **YES** — `linear()` is a CSS `<easing-function>`; Baseline Widely Available 2026-06-11 | MDN; linear-easing Baseline |
| WAAPI `element.animate(..., { pseudoElement: "::view-transition-new(root)", easing })` | **YES** — the documented JS customization path; `easing` accepts a `linear()` string | Chrome same-document docs |
| `document.getAnimations()` returns VT pseudo `Animation` objects; modifiable after `transition.ready` | **YES** — read/scrub/replace; create NEW animations on the pseudo via WAAPI | MDN getAnimations; VT toolkit |
| `::view-transition-old(x)` is a **frozen screenshot**; a running animation FREEZES in the snapshot | **YES** — the structural snapshot/raster constraint | Chrome docs; group guide ("DO NOT transition elements with active animations") |
| Cross-document `@view-transition { navigation: auto }` | **Chromium + Safari 18.2 ONLY; Firefox flagged** — progressive enhancement, NOT Baseline | CSS-Tricks 2026; MDN @view-transition |
| Scoped `element.startViewTransition()`, `document.activeViewTransition`, `ViewTransition.waitUntil()` | **Chrome 142-147, experimental** — too early | Chrome blog 2025 |

**The load-bearing structural constraint (it kills two framings):** VT animates **rasterized
snapshots**, not live DOM. `::view-transition-old` is a screenshot; the morph is a crossfade
of two bitmaps inside a `::view-transition-group` whose box is interpolated. kf's entire value
proposition — *interpolate live property values from parsed CSS, resolve computed/container
units against the DOM each frame, blend layers by weight* — operates on LIVE values, which the
VT model has already thrown away by the time the pseudo tree exists. **kf cannot drive the
*content* of a VT; it can only shape the *timing* of the snapshot crossfade.** That timing seam
is exactly one property wide: `animation-timing-function`.

---

## §2 The sibling-project SCAR — glass-ui already TRIED VT for layout morph and RETIRED it

The strongest single piece of evidence in this lane is a recorded failure in the sibling repo.
glass-ui `view-transition.css` (the `AX.W01` comment block) documents that the dock team built
a `::view-transition-group(.gl-dock-layer)` recipe with `:active-view-transition-type` direction
forks for the dock collapse/expand — **and then DELETED it**, replacing it with a single
`--dock-morph-t` spring scalar:

> "VT crossfades RASTERIZED snapshots — the wrong primitive for a layout morph (the
> 'taffy'-stretch + text-blur + uncaptured-animating-ancestor desync + the co-mounted-docks
> snapshot-DROP). The dock collapse↔expand … now morphs off the ONE `--dock-morph-t` spring
> scalar."

This is a *measured-in-production* verdict from the closest possible adjacent codebase: **for a
real layout morph with live content, a spring-driven scalar BEAT native VT.** It directly
informs every framing below. It is also a point of pride for kf's axes: glass-ui's cure was a
SPRING — kf's home turf. The lesson is not "VT is bad"; it is "VT is for snapshot crossfades
between discrete states, and the moment content must stay live/sharp/animating, the spring
scalar wins." A K tranche must not re-make the dock's mistake at the kf layer.

---

## §3 The four framings, evaluated

### (a) `flipShared` → VT-native shared-element, with rAF FLIP as fallback ("one API, two backends")

**On-brand test:** the WAAPI-delegation philosophy (conservative-correct delegate-to-platform,
always-correct fallback) is genuinely a kf signature (`waapi.ts`, sota-landscape §1). Extending
it to "delegate the shared-element morph to native VT, fall back to `flipShared`'s rAF
`ElementMorph`" is the natural shape.

**The problem:** the helper that does the delegation ALREADY EXISTS in glass-ui and kf already
consumes it for the scene swap (§0). kf's `flipShared` (`flip.ts:146-176`) is a LIVE
`ElementMorph` (translate/scale of the real element via rAF) — it is the *fallback that is
better than the primitive* in exactly the dock's situation: it keeps content live and sharp
where VT would taffy-stretch a bitmap. **There is no kf-side "delegate to VT" layer to build
that isn't (i) glass-ui's job per inv-16, or (ii) worse than the rAF path it would fall back
to.** A `flipShared(a, b, { preferViewTransition: true })` flag would be a thin wrapper around
`document.startViewTransition` — i.e. re-implementing glass-ui's helper inside the engine, an
inv-16 breach, to opt INTO the rasterized primitive the dock just proved inferior.

**Verdict: KILL** (the dispatch layer) — inv-16 breach (helper is glass-ui's) + the §2 scar
(the rAF fallback is the better primitive for live shared elements, not the degraded one). The
"one API two backends" pattern the brief wants is REAL but it lives at the scene-swap seam and
is already shipped (§0). What survives is NOT a VT dispatcher but a documentation/positioning
truth: **`flipShared` IS the kf answer to shared-element transitions for live content; VT is the
answer for snapshot crossfades; they are complementary, not a fallback pair.** That belongs in
J.W5's README teaching of `flip`/`flipShared` (the EP-3 "flip/drag exported with no demo,
untaught" finding), not a K wave. → see §5 J-FOLD note.

### (b) kf PARSING / serializing `::view-transition-group/-old/-new` @keyframes — VT customization as round-trippable CSS (the "unique axis!" framing)

This is the framing the brief flags as the unique-axis play, so it gets the most scrutiny.

**The pitch:** kf parses `@keyframes` and serializes back (the #1 unique axis, sota-landscape
§4). VT customization is authored as CSS `@keyframes` applied to `::view-transition-*` pseudos.
So kf could parse a VT customization block, let you edit it (in the demo's Monaco editor),
re-serialize it, round-trip it — "VT customization as round-trippable CSS, unique axis."

**Why it does NOT hold up:**

1. **kf does not parse SELECTORS at all.** The entire parsing surface is `@keyframes`
   *bodies* — re-exported wholesale from value.js (`src/parsing/*` are one-line re-export
   barrels; the only LOCAL parse logic is the `@keyframes` grammar in value.js, consumed via
   `CSSKeyframesAnimation.fromString`). kf's grammar takes a keyframes NAME and a list of
   percent-stop blocks; it has no concept of a `::view-transition-group(name)` selector, an
   `animation-name:` binding, or the rule that wires a `@keyframes` to a pseudo. Parsing
   "VT customization" means parsing a STYLESHEET FRAGMENT (selector + declaration block + the
   `@keyframes` it references) — a CSS-rule parser, which is a NEW, much larger grammar, and
   value.js's job if anywhere. The "@keyframes round-trip" axis does NOT extend to
   "stylesheet-rule round-trip" for free.
2. **The `@keyframes` it would round-trip are ALREADY plain `@keyframes`.** A VT customization
   `@keyframes slide-in { from { translate: -100vw } }` is an ordinary keyframes block. kf can
   already parse and serialize it TODAY via `CSSKeyframesAnimation.fromString` — there is
   nothing VT-specific to add. The VT-specific part is the SELECTOR wiring
   (`::view-transition-new(.x):only-child { animation-name: slide-in }`), which is the part kf
   does NOT and structurally should NOT parse.
3. **Nothing animates through kf here.** Even if kf round-tripped the selector wiring, the
   animation runs on the COMPOSITOR via the browser's CSS engine against rasterized snapshots
   (§1). kf's interpolation engine, color engine, layer engine — every unique axis — is
   bypassed. kf would be a CSS pretty-printer for a stylesheet fragment it doesn't execute.
   That is not "only a CSS-source-of-truth engine could do this"; it is "any CSS formatter could
   do this, and kf isn't even a stylesheet formatter."
4. **The round-trip has no consumer.** Who edits VT customization `@keyframes` in a kf editor
   and round-trips them? The demo's editors animate a SUBJECT; VT customization is page-chrome
   choreography with no kf subject. There is no workload.

**Verdict: KILL** — researched and rejected. The axis "parse + round-trip `@keyframes`" is real
and unique, but it does NOT extend to "parse + round-trip VT stylesheet RULES": that needs a
selector/rule grammar kf doesn't have, would belong to value.js not kf, bypasses every kf
engine axis (the animation runs on the compositor against snapshots), and has no workload. This
is the lane's most seductive framing and the most clearly wrong one — a researched KILL is the
valuable result here. (Sub-note: it also brushes nothing on the ARCH kill list, so the kill is
purely on-brand-failure + no-consumer, not a re-litigation.)

### (c) Spring-driven VT — inject kf's spring `linear()` into the VT pseudo animations

**This is the one that survives.** And it is small.

**The mechanism (verified §1):** the documented JS customization path is
`element.animate(keyframes, { pseudoElement: "::view-transition-new(root)", easing, duration })`
after `transition.ready`, and the `easing` field accepts a `linear()` string. kf ALREADY emits
spring `linear()` strings: `springLinearStops(opts)` →
`"linear(0, 0.234 4.17%, …, 1)"` (`springLinearStops.ts:46-73`) and
`springTimingFunction(opts).css` (the typed `Easing.css` twin). The WAAPI delegation already
proves kf emits these into `Element.animate` (`waapi.ts` `toWAAPIOptions` emits `Easing.css`).
So: **the SAME spring `linear()` kf already computes for `transition-timing-function` and the
WAAPI path can drive the timing of a native VT pseudo crossfade — giving a View Transition a
real SwiftUI-grade spring curve, including overshoot, which `ease`/`cubic-bezier` cannot
express** (a `linear()` honors values > 1, §1 / `springLinearStops.ts` "values may exceed 1
(overshoot)"). No competitor's VT helper does this: Motion's VT helpers and the native default
use duration+bezier easing; **a spring-shaped View Transition is genuinely novel and is exactly
kf's spring axis pointed at a new surface.**

**Why it is on-brand AND only-kf:** (1) it extends the spring + `linear()`-twin axis
(sota-landscape: "SwiftUI-grade springs with linear() CSS twins") to the VT surface; (2) it is
the WAAPI-delegation philosophy literally re-applied (emit `Easing.css` into a platform
`animate()` call); (3) GSAP has no springs at all and no VT; Motion has basic VT helpers with
no spring-into-VT. The overshoot point is the differentiator — a VT that *settles* like iOS.

**Why it is small, and where the line is (inv-16):** the *helper* (wrapping
`startViewTransition`, feature-detect, focus routing, the `transition.ready` hook) is glass-ui's
(§0). kf's contribution is purely the CURVE: a spring → `linear()` string, which kf ALREADY
SHIPS. The K work is not new engine code — it is (i) a documented RECIPE/example that the
`springTimingFunction(...).css` output feeds the `easing` of a
`documentElement.animate(..., { pseudoElement })` call (or a `--vt-ease` custom property the
glass-ui group recipe already reads — `view-transition.css` `--vt-ease` default
`var(--spring-bouncy)`); (ii) OPTIONALLY a glass-ui HANDOFF: a `springEase` token/param on the
glass-ui VT helper that takes a kf-computed `linear()`. The kf-side surface is a 0-line
re-use of an existing export plus docs; the glass-ui-side surface is sibling-coordination.

**Effort: S** (recipe + example + one HANDOFF asking glass-ui to accept a `--vt-ease` spring
string — which `view-transition.css` ALREADY reads via `--vt-ease`). **Measure-first gate:** none
needed for correctness (it's CSS the platform executes), BUT the on-brand CLAIM ("spring VT
feels better") needs a perceptual probe — a side-by-side of `ease-in-out` VT vs
`springTimingFunction({response: .5, dampingFraction: .8}).css` VT on the demo scene swap,
recorded as a GIF/screenshot pair (the demo already swaps scenes via VT, so the probe is a
one-line `--vt-ease` change). If the overshoot reads as "wobbly/cheap" rather than "settled",
KILL the spring default and keep it an opt-in example only.

**Verdict: K-CANDIDATE (small) / J-FOLD-adjacent.** It is barely a K wave — it is a recipe over
an existing export plus a glass-ui handoff. Recorded as a K-CANDIDATE because the *demonstration*
(a spring-driven VT as a headline demo moment) and the *handoff* want a deliberate wave, but if
the K tranche is scoped tight it could fold into J.W7a's design-suffusion (the scene-swap is a
named design moment) as "the scene-swap VT carries the scene's spring." I record it as
K-CANDIDATE to keep it out of J's frozen DEV scope while flagging it is nearly J-sized.

### (d) Cross-document VT (`@view-transition`) posture

**Status (§1):** Chromium + Safari 18.2; Firefox flagged. NOT Baseline. Pure progressive
enhancement.

**The kf angle:** cross-document VT is an MPA navigation feature — `@view-transition {
navigation: auto }` plus `view-transition-name` CSS. There is **zero JavaScript animation seam**:
the browser owns the entire transition across a document swap; no `startViewTransition` callback,
no `transition.ready`, no `getAnimations()` you can reliably reach across the navigation boundary
(the new document's script runs after). kf is a JS animation engine; an MPA cross-document
transition is CSS-only, compositor-only, and the JS that would inject a spring `linear()` runs in
a document that is being torn down or not yet built. **There is no kf insertion point.** The most
kf could offer is the same spring `linear()` string written into a `::view-transition-group(...)
{ animation-timing-function: ... }` CSS rule in the page's stylesheet — but that is a static CSS
authoring act (write the string once), not an engine capability, and kf the library is not
loaded in the transition window. The demo is an SPA (one document), so kf has no cross-document
workload either.

**Verdict: BOOK** — record, premature. Re-evaluate when (1) `@view-transition` reaches Baseline
(Firefox ships it un-flagged), AND (2) the JS-driven cross-document customization seam exists
(today there is none). Even then the kf contribution is the same spring `linear()` string as
(c), authored statically — likely never more than a doc note. Not a capability kf can own.
(Does not brush the ScrollTimeline-native kill or any ARCH kill; the BOOK is purely "no
insertion point yet.")

---

## §4 Adversarial self-check — did I miss a real kf-only seam?

- **getAnimations()-reshape mid-transition.** §1 confirms you can `getAnimations()` the VT
  pseudos and reshape them after `transition.ready`. Could kf own a "reshape the VT crossfade
  with kf's interpolation each frame" engine? **No** — the moment you drive the pseudo per-frame
  from JS you are running an rAF loop against a rasterized snapshot, which is (i) the exact
  taffy-stretch the dock retired (§2), and (ii) strictly worse than `flipShared` driving the
  LIVE element. The VT pseudo is a bitmap; kf interpolating bitmap geometry per-frame is a
  downgrade from kf interpolating live element geometry. KILL-adjacent; folded into (a)'s kill.
- **Perceptual-color crossfade.** kf's oklab axis (unique #2): could kf make a VT crossfade
  perceptual? **No** — the crossfade between `-old` and `-new` is a compositor `mix-blend`/opacity
  raster blend; CSS `::view-transition` has no `color-interpolation` knob kf could feed, and the
  blend is of full-color BITMAPS not single color values. kf's oklab interpolates ONE color
  value's path; it cannot recolor a bitmap crossfade. No seam.
- **Weighted layer blending (unique #3) into VT groups.** Nested VT groups (Chrome 140+) are a
  pseudo-element TREE, not a weighted accumulation; the blend is replace/opacity, not kf's
  `weighted` lerp-by-weight over property values. No seam — different meaning of "layer."
- **Does spring-into-VT (c) brush the ScrollTimeline-native kill or WAAPI kill?** No. The ARCH
  kill list contains no VT entry. (c) is the WAAPI-delegation philosophy (which is ALIVE and a
  kf signature, not killed) applied to a new platform `animate()` target. Explicitly distinct.

The self-check confirms: **every unique kf axis except the spring/`linear()` twin is structurally
locked out of VT by the snapshot/raster model.** Only the timing curve is reachable, and kf
already ships the curve. The lane's real yield is therefore narrow and honest.

---

## §5 J-FOLD note (not a K item — belongs to an existing J wave)

The §3(a) survivor — *`flipShared` is the live-content shared-element answer; VT is the
snapshot-crossfade answer; they are complementary* — is a **documentation truth, not a
capability.** It folds into **J.W5** (THE PUBLISHED SURFACE), which already owns teaching
`flip`/`flipShared` (the EP-3 "flip/drag/draw-svg exported with no demo, README 4/13" finding,
J.md §finding-cluster → J.W5). The README's `flipShared` teaching should state the VT
relationship (one sentence: "for live-content shared-element morphs use `flipShared`; for
discrete-state snapshot crossfades use the platform's `startViewTransition` — glass-ui ships the
helper"). This is a J.W5 README line, authored in DEV, costing nothing, and it preempts a future
contributor re-proposing framing (a). **J-FOLD → J.W5.**

---

## §6 Synthesis — the one-paragraph reading

View Transitions look like a rich frontier for a CSS-source-of-truth engine, and they are a poor
one — because the API operates on **rasterized snapshots**, discarding exactly the live property
values, computed units, and per-value color paths that are kf's reason to exist. The sibling
proof is decisive: glass-ui BUILT a VT layout-morph for its dock and DELETED it for a spring
scalar (§2), and glass-ui already OWNS the VT helper kf consumes (§0), so the helper-shaped
framings (a, the dispatcher) are an inv-16 breach over a primitive that loses to kf's own rAF
fallback. The parse/round-trip framing (b) — the seductive "unique axis" one — is a clean KILL:
kf parses `@keyframes` bodies, not stylesheet RULES, the VT `@keyframes` are already ordinary
keyframes kf handles today, the selector wiring belongs to value.js if anywhere, the animation
bypasses every kf engine axis, and no workload exists. Cross-document (d) has no JS insertion
point and isn't Baseline — BOOK. **The single genuinely on-brand, only-kf seam is (c): feeding
kf's spring `linear()` twin into a native VT pseudo's `animation-timing-function` — a
SwiftUI-spring-shaped View Transition with real overshoot, which no competitor offers and which
kf already has the curve for.** It is a recipe over an existing export plus a glass-ui handoff,
not new engine code — a SMALL K-CANDIDATE (nearly J-sized), gated only on a perceptual
side-by-side probe. The lane's honest yield: one small spring-into-VT recipe, one J.W5 README
line, and three researched KILLs/BOOKs that stop a future tranche from re-making the dock's
mistake.

---

## §Sources

Internal: `src/animation/flip.ts:146-176` · `src/animation/format.ts:30-122` ·
`src/animation/springLinearStops.ts:46-73` · `src/animation/waapi.ts` (CLAUDE.md §WAAPI) ·
`demo/app/useSceneTransition.ts` · `demo/app/useSceneSwap.ts` ·
glass-ui `src/composables/motion/useViewTransition.ts:46-134` ·
glass-ui `src/styles/view-transition.css` (the AX.W01 dock-retire comment) ·
glass-ui `dist/dock.js:600-602` · `docs/tranches/J/audit/sota-landscape.md` §1/§4 ·
`docs/tranches/J/J.md` §finding-cluster/§chronic-fold.

External:
[web.dev — same-document VT Baseline](https://web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available) ·
[Chrome — What's new in view transitions (2025)](https://developer.chrome.com/blog/view-transitions-in-2025) ·
[Chrome — same-document VT customization](https://developer.chrome.com/docs/web-platform/view-transitions/same-document) ·
[MDN — ::view-transition-new()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::view-transition-new) ·
[MDN — Element.getAnimations()](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAnimations) ·
[MDN — group transitions + view-transition-class](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using) ·
[MDN — @view-transition (cross-document)](https://developer.mozilla.org/en-US/docs/Web/CSS/@view-transition) ·
[CSS-Tricks — cross-document VT gotchas](https://css-tricks.com/cross-document-view-transitions-part-1/) ·
[linear() easing Baseline](https://web-platform-dx.github.io/web-features-explorer/features/linear-easing/) ·
[CSS View Transitions Module Level 2 (draft)](https://drafts.csswg.org/css-view-transitions-2/)
