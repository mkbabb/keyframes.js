# Frontier lane — TEXT + RANGES + structural stagger (the SplitText question, the CSS way)

**Lane:** text-ranges-stagger (FRONTIER-RESEARCH fleet, K-tranche seeding · 2026-06-10).
**Charter:** GSAP SplitText (now free, Webflow-owned) dominates text animation; kf has none.
Is text animation a frontier-defining, on-brand surface for keyframes.js — or is the on-brand
move not "split text" at all but the **structural-stagger compiler** (a kf stagger that emits
`sibling-index()`-based pure-CSS delays — round-trippable, the css-compiler lane's twin), with
text splitting demoted to a docs recipe or KILLED as off-brand bloat? Method: the platform
frontier verified first (`sibling-index()`, the Custom Highlight API, the split-DOM a11y
hazard) crossed against kf's source surface (`file:line`) and the sibling lanes. **Skeptical of
its own lane:** the headline finding is that **text splitting is a KILL** (off-brand DOM
mutation + a 2026-documented a11y hazard kf cannot honestly carry as a library primitive), and
the one genuinely frontier, only-kf seam is the **structural-stagger → `sibling-index()` CSS
emitter** — a K-CANDIDATE that folds the stagger primitive kf *already ships* into the
round-trip axis. Plus one small J-FOLD docs recipe.

---

## §0 The decisive prior fact — kf ALREADY ships `stagger`, and it is value.js-free LIGHT

Before proposing anything: kf is not stagger-less. `src/animation/stagger.ts` is a
construction-time per-index delay generator on the **LIGHT** barrel (zero static value.js edge,
reads `clamp` from `internal/leaves`, accepts a callable `TimingFunction` or typed `Easing`).
It has `first`/`last`/`center`/`edges`/numeric origins, an `ease` reshape, and a `.delays(total)`
materializer (`stagger.ts:40-171`). The delay flows to the substrate that already carries it —
`AnimationGroup`'s per-child `delay`, which already reaches `toWAAPIOptions` (`stagger.ts:5-8`).
It is in the published-surface enumeration as one of the E→I orchestration exports
(`index.ts:62`; sota-landscape §1; capability matrix marks Stagger **HAS** for kf).

**This reframes the lane.** The question is NOT "should kf get stagger" (it has it). It is
**"what is the on-brand FRONTIER extension of the stagger kf already owns"** — and whether
splitting text into per-glyph DOM is a primitive kf should grow toward at all. The stagger
primitive is the asset; text-splitting is the candidate liability; `sibling-index()` is the
platform lever that turns the asset into a round-trip artifact only kf can emit.

---

## §1 The platform frontier (verified, June 2026)

| Fact | Status | Source |
|---|---|---|
| `sibling-index()` / `sibling-count()` | **Chrome/Edge 138 (Jun 2025), Safari 26.2; Firefox NOT yet stable** (positive spec position, impl underway). **NOT Baseline** — expected mid-late 2026; Chrome+Safari ≈ 75-80% | MDN; Smashing 2026-05; chromestatus 6225478530367488; caniuse wf-sibling-count |
| `sibling-index()` inside `calc()` for `animation-delay` | **YES** — `animation-delay: calc(sibling-index() * 100ms)` is the canonical CSS-only stagger; returns a real 1-based `<integer>`, type-coerces to `<time>` | Smashing 2026-05; LogRocket; Frontend Masters |
| `sibling-index()` inside `@keyframes` | **NO — explicitly cannot be used inside `@keyframes`** (only in regular declarations) | Smashing 2026-05 |
| Inheriting `sibling-index()` to a parent var | **Backfires** — evaluates on the parent, all children get the same value; the fix is `@property --i { syntax: "<integer>"; inherits: true }` registered per-child | Smashing 2026-05; Ollie Williams |
| `display:none` siblings still count toward the index | **YES** — gaps in filtered layouts | Smashing 2026-05 |
| `sibling-index()` is visual-only — does NOT change reading/tab order | **YES** — screen readers + Tab follow DOM source order regardless | Smashing 2026-05 |
| `reading-flow` / `reading-order` (could re-sync a11y order to visual) | **Experimental, NOT Baseline** — not in widely-used browsers | MDN reading-flow / reading-order |
| CSS Custom Highlight API (`Highlight`, `HighlightRegistry`, `::highlight()`) | **Baseline (works across latest since Mar 2026)** | MDN; W3C css-highlight-api-1 |
| `::highlight()` settable properties | **ONLY paint:** `color`, `background-color`, `text-decoration` (+ assoc), `text-shadow`, `-webkit-text-stroke-*`/`-fill-*`. **`background-image` IGNORED.** No box/transform/geometry | MDN ::highlight |
| Animating a highlight | **Indirect only** — `::highlight()` paint props transition; geometry (which glyphs) changes only by JS re-setting `Range`s, or by transitioning a registered `@property` the rule references. The highlight is a paint mask over live text, NOT a transformable box | MDN; FrontendMasters; freeCodeCamp |
| `text-wrap: balance`/`pretty` | Baseline 2024 (`balance`) / `pretty` Chrome 117+/Safari 26+, **not Firefox** | MDN text-wrap; Savvy |
| `::first-letter` / `::first-line` | Long-Baseline, but limited property set; **single** letter/line only — not a per-glyph animation substrate | MDN (background) |

**The two load-bearing platform facts:**

1. **The CSS-only stagger ceiling is exactly `animation-delay`/`transition-delay`.**
   `sibling-index()` cannot enter `@keyframes` and cannot carry the *curve* — only the
   per-element **offset**. So a pure-CSS stagger is: one shared `@keyframes`, one shared
   `animation`, and a per-sibling `calc(sibling-index() * each)` delay. That is precisely the
   shape kf's `stagger.delays()` already computes — a per-index delay number. The platform
   frontier and the kf primitive **meet at the same data**.

2. **The Custom Highlight API is a paint mask, not a motion substrate.** It can style
   character ranges *without DOM mutation* (the a11y-safe promise), but its animatable surface
   is four paint properties, and the *which-glyphs* dimension is not a continuously
   interpolatable value — it is a discrete `Range` set you re-`set()` from JS. It is structurally
   the wrong primitive for the motion kf does (live property interpolation, springs, oklab over a
   continuous box). It is the *right* primitive only for "sweep a highlight color across text,"
   which is a `background-size` trick that needs no kf (§3, K-T3 KILL).

---

## §2 The text-splitting a11y SCAR — a 2026-documented hazard, not a folklore caveat

The strongest single piece of evidence against a kf text-splitting primitive is a **February
2026** accessibility analysis (Adrian Roselli, *"You Know What? Just Don't Split Words into
Letters"*) that tested the actual split-DOM pattern — including **GSAP SplitText's own
recommended markup** — across the real screen-reader matrix:

| SR + browser | Result on letter-split text |
|---|---|
| JAWS / Chrome | text **never announced** |
| Narrator / Edge | **only first letter** announced |
| VoiceOver / macOS | letters read **individually** |
| TalkBack / Firefox | text **inaccessible** |
| NVDA / Firefox | works (the **exception, not the rule**) |

The root cause is structural and unfixable by configuration: a split wraps glyphs in `<div>`/
`<span>` that map to the **`generic` role**, and **"the generic role does not allow itself to be
named by the author — which means `aria-label` is prohibited on it"** (Roselli 2026, corroborated
in the GSAP forum thread). GSAP's demo applies `aria-label` to the split divs **anyway**,
producing non-functional accessibility markup. The 2026 verdict on GSAP SplitText's a11y claim
is explicit: it *"asserts screen reader support that doesn't stand up to use."* Roselli's
recommendation is unambiguous: *"If you need to split words into their constituent letters…
well, no you don't. Find another method."*

The mitigations that DO work — `aria-label` on a true container element (not a `generic`),
`aria-hidden` on every fragment, or a visually-hidden screen-reader duplicate when the source
contains links/`<strong>`/`<em>` (GSAP's own `aria:"none"` escape hatch) — are **DOM-topology
obligations on the consumer's markup**, not interpolation. They are exactly the class of concern
the view-transitions lane already established belongs to glass-ui (the UI substrate), NOT to kf
(the interpolation/parse engine) under inv-16 (`view-transitions.md §0`: *"a VT helper … is
glass-ui's domain, not kf's. kf is the interpolation/parse engine; glass-ui is the UI motion
substrate"*). A SplitText primitive is a **DOM-mutation + ARIA-topology** helper, the same shape.

**This is the lane's KILL spine** (§3, K-T1): a kf-owned text splitter would (a) mutate the DOM
(kf does not own DOM topology — it animates targets the consumer hands it), (b) ship a
known-hazardous a11y pattern as a *library primitive* (the proof-gated engine discipline cannot
honestly gate "this is accessible" when the 2026 field consensus is that it is not), and (c)
duplicate a substrate-layer concern that, if it belongs anywhere in this constellation, belongs
to glass-ui. **None of kf's three axes (CSS round-trip / oklab / weighted blend) is even touched
by the act of splitting a string into spans.** Splitting is off-axis by construction.

---

## §3 The proposals

### K-T1 — A kf-owned `splitText()` / SplitText primitive — **KILL** (off-brand, a11y-hazardous, off-axis)

**What (the rejected thing).** A `splitText(el, { by: "chars"|"words"|"lines" })` that mutates
`el` into per-fragment spans, applies the aria-label/aria-hidden pattern, and returns the
fragments for kf `stagger`/`SpringProgress` to drive — the GSAP SplitText shape, ported.

**Why KILL.**
1. **It mutates DOM topology kf does not own.** Every kf engine animates *targets the consumer
   supplies* (`setTargets`, `engine.ts`); none reaches in and rewrites a node's children. A
   splitter inverts that contract. The closest precedent — installing a per-target
   `ResizeObserver` for `cq*` units — was itself a **recorded BOOK, not SHIP** precisely because
   "a per-target observer + a layout-coupled side effect … is a boundary breach" the consumer's
   topology owns (`animation/CLAUDE.md §Computed-unit container contract`). DOM mutation is a
   strictly larger breach.
2. **It ships a 2026-documented a11y hazard as a primitive** (§2). The engine's proof culture
   (sota-landscape §4.5) cannot gate "accessible" on a pattern the field has measured as broken
   across 4 of 5 SR/browser pairs. A born-RED a11y gate would be *honest* — and would stay RED.
3. **It is off all three axes** (§2 close). Splitting touches neither parse-round-trip, nor
   oklab, nor weighted blend. "GSAP has it" is the charter's explicitly-disallowed reason.
4. **If it belongs in the constellation at all, it is glass-ui's** (the UI/DOM substrate, per
   inv-16 and the view-transitions precedent), not kf's. A handoff BOOK, not a kf wave.

**Verdict: KILL.** The researched rejection IS the result. kf does not split text.

---

### K-T2 — `staggerCSS()` — the structural-stagger → `sibling-index()` emitter (**THE HEADLINE**)

**What.** A pure-function emitter on kf's existing stagger surface that compiles a `StaggerFn`
(`stagger.ts`) into the **CSS-only `sibling-index()` form** — turning a JS construction-time
delay distribution into a round-trippable stylesheet artifact. Concretely, a sibling to
`stagger().delays()` (`stagger.ts:167`):

```ts
// Today (JS-driven; the delay lives in AnimationGroup per-child options):
const d = stagger(n, { each: 50, from: "center" });
group = new AnimationGroup(items.map((el, i) => ({ animation: fadeIn(el),
                                                   options: { delay: d(i, n) } })));

// K-T2 (CSS-driven; the delay lives in the stylesheet, no per-child JS, no rAF for the offset):
staggerCSS(d, { selector: ".item", animationName: "fadeIn" })
// →  .item { animation-delay: calc(sibling-index() * 50ms); }                    // from:"first", linear
// →  .item { animation-delay: calc(abs(sibling-index() - <mid>) * 50ms); }       // from:"center"
// →  .item { animation-delay: calc((sibling-count() - sibling-index()) * 50ms); } // from:"last"
```

For the **eased** distributions (`stagger`'s `ease` reshape, `stagger.ts:143`) — which
`sibling-index()` math cannot express, since the curve cannot enter `calc()` cleanly and
`@keyframes` is closed to `sibling-index()` (§1) — the emitter degrades **honestly** to an
enumerated `@supports`/`:nth-child(k)` fallback table built from `d.delays(total)` (a finite,
known list), OR refuses with a typed error naming the limitation (the fail-explicit idiom,
`stagger.ts:136`). The **linear / symmetric** origins (`first`/`last`/`center`/`edges`, the
common case) compile to the closed `sibling-index()` form; the eased ones round-trip only as the
enumerated table. Either way the output is **valid, paste-able author CSS**.

**Why only kf.** This is **axis (1) — the CSS round-trip — extended from a single animation to a
COLLECTION's orchestration.** Today kf serializes one animation's `@keyframes` + options block
from declared template values (`format.ts:131-189`, the I.W0 S2 serialize-from-template
authority); it does NOT emit per-element `animation-delay` — stagger lives only as a JS number
in `AnimationGroup` options and **vanishes on serialization** (the round-trip is currently
lossy at exactly the orchestration seam). K-T2 closes that: kf becomes the only engine whose
*stagger* — not just its keyframes — is emittable as author CSS, and (the platform-frontier
payoff) emittable as the **native `sibling-index()`** form, so the compiled animation runs with
**zero JS and zero rAF for the per-element offset** (the offset is now compositor-adjacent CSS;
only the shared `@keyframes` curve animates, WAAPI-eligible by construction). DevTools and Motion
DevTools *scrub* a page's animations; none *emits a stagger as native CSS* (live-stylesheet lane
§2.4: they *"inspect; they do not transform-and-emit"*). This is the same transform-and-emit
frontier the css-compiler lane (`live-stylesheet-ingestion.md §3 K1`) owns for foreign
`@keyframes`, pointed at **the orchestration layer** — its natural twin. The two compose: a page
ingested via `fromStyleSheets()` whose siblings stagger could be re-emitted with a `staggerCSS()`
delay rule.

**kfAxis.** Extends axis (1) (round-trip) from per-animation to per-collection orchestration;
the emitted artifact is native-CSS (zero-runtime), the on-brand "only a round-trip engine could
do it THIS way" form.

**Not an ARCH kill.** This does NOT touch ScrollTimeline-native-REPLACE (it is an *emitter*, not
a progress-driver swap; kf's JS stagger path survives intact for the eased/unsupported cases and
for non-`sibling-index()` browsers). It is not Houdini-paint, not WASM, not Typed-OM-carrier (it
emits a *string*; nothing rides Typed-OM), not per-property keyframe easing (it emits per-element
*delay*, the orchestration offset — not a per-property curve inside `@keyframes`). It is a new
**string emitter** beside `format.ts`, the cheapest possible surface.

**MEASURE-FIRST.** The perf claim ("zero rAF for the offset, WAAPI-eligible") is the bench:
a `staggered-css-vs-js.bench` — N-element stagger, JS-`AnimationGroup`-delay path vs the emitted
`sibling-index()` CSS path — measuring (a) main-thread frames spent on offset bookkeeping (the
CSS path should be ~0; the offset is no longer ticked), (b) the LoAF profile at N=200 against
the existing 200-cell group gate (sota-landscape §5), (c) byte cost of the emitter on the LIGHT
barrel (must stay value.js-free — it reads only `d.delays()` numbers + string templating). The
correctness bench is round-trip: emit → re-parse the emitted CSS via the existing pipeline →
the recovered per-element delays equal `d.delays(total)` (within the `sibling-index()` integer
grid). **Born-RED today:** a probe that serializes a staggered `AnimationGroup` and greps for any
`animation-delay` — it is ABSENT (the lossy seam).

**Effort: M** (a pure emitter + a fallback table + a round-trip test; no engine/hot-path change;
the data — `d.delays()` — already exists). **Risk:** `sibling-index()` is not Baseline until
~late 2026 (the `@supports` guard + the enumerated fallback are mandatory, not optional);
`display:none` siblings shift the index (the emitter must document the topology contract — same
class as the `cq*` container contract, consumer-owned). The eased-distribution gap is real and
must be stated, not hidden.

---

### K-T3 — Custom-Highlight-API range animation — **KILL** (paint mask, not a motion substrate, off-axis)

**What (the rejected thing).** A kf surface that animates `::highlight()` ranges — e.g. a
reading-progress sweep, a per-word reveal — using the Custom Highlight API so text is styled
*without DOM mutation* (the a11y-safe answer to K-T1's hazard).

**Why KILL.** The API's animatable surface is **four paint properties** (`color`,
`background-color`, `text-decoration`, `text-shadow`; `background-image` ignored — §1). The
*which-glyphs* dimension is a **discrete `Range` set re-`set()` from JS**, not a continuously
interpolatable value, so there is no box, no transform, no geometry, and nothing for kf's
interpolation engine (lerp/oklab/spring over a continuous value) to bite. The one genuinely nice
effect — a highlight color *sweeping* across text — is the documented `background-size: 0%→100%`
+ `will-change: transform` trick (search corpus), a **compositor-friendly CSS gradient animation
that needs no kf at all.** kf would add a dependency to wrap a four-property paint mask whose
motion the platform already does better in pure CSS. It touches **no kf axis** (the round-trip
emits `@keyframes`, not highlight registries; oklab over a *paint mask* is the same lerp kf
already does on any color, no new ground; weighted blend is irrelevant to a binary paint mask).
A docs note that "perceptual oklab color is available if you animate `::highlight()` colors via
a registered `@property`" is the *most* this deserves — and even that is a fold into K-T4, not a
primitive.

**Verdict: KILL** (as a kf primitive). Honest researched rejection: the platform already owns
range-highlight motion in pure CSS; kf has nothing axis-aligned to add.

---

### K-T4 — The "structural stagger, the CSS way" docs recipe — **J-FOLD → J.W5**

**What.** A README §Beyond-CSS recipe (NOT a primitive — zero new code) teaching the on-brand
text/stagger story the lane's research establishes: (1) **don't split into letters** — cite the
a11y matrix; if you must reveal text, reveal at the **word or line** granularity with an
`aria-label` on a true container + `aria-hidden` fragments, or a visually-hidden duplicate (the
working mitigations, §2); (2) drive the reveal with kf's **existing** `stagger` + `SpringProgress`
over those (consumer-owned) fragments — the primitive kf already ships; (3) when `sibling-index()`
is available, **emit the stagger as native CSS** via K-T2 for a zero-runtime version; (4) for
perceptual color across the reveal, kf's default oklab already applies (axis 2, free). This is the
honest "CSS-keyframes engine's answer to SplitText": **we don't split your DOM; we stagger and
spring over structure you own, and we can compile that stagger to the CSS the platform now
speaks.**

**Why J-FOLD.** J.W5 already owns README §Beyond-CSS completion (*"all ~13 primitives taught"* —
J.md §WAVE-MAP J.W5) and the `stagger` export is one of the untaught ones in scope. This recipe
is the *teaching* of a primitive that exists, plus an honest a11y framing — exactly J.W5's
charter, no new surface. **It folds whether or not K-T2 ships** (without K-T2 it teaches the JS
stagger story; with K-T2 it gains the CSS-emit paragraph). Name the wave: **J.W5 (THE PUBLISHED
SURFACE)** — the stagger teaching entry, with the a11y framing as its distinguishing content.

**Effort: S** (docs only). **Risk:** none beyond keeping the a11y citation current.

---

## §4 The synthesis line

The SplitText question answered the CSS way: **kf does not split text** (K-T1 KILL — off-brand
DOM mutation, a 2026-measured a11y hazard kf's proof culture cannot honestly gate, off all three
axes; a glass-ui/substrate concern if it is anyone's), and **kf does not wrap the Highlight API**
(K-T3 KILL — a four-property paint mask the platform already animates better in pure CSS, with no
axis-aligned seam). The one frontier-defining, only-kf move is **K-T2: compile the stagger kf
already ships into the native `sibling-index()` CSS form** — extending axis (1) (round-trip) from
a single animation to a collection's *orchestration offset*, the seam where kf's serialization is
currently lossy, emitting zero-runtime author CSS the platform newly speaks. It is the
orchestration-layer twin of the css-compiler lane's foreign-`@keyframes` transform-and-emit, and
the two compose. Around it, one **J.W5 docs recipe** (K-T4) teaches the honest "stagger-and-spring
over structure you own, then compile to CSS" story — the on-brand answer to the SplitText
pressure that needs no new primitive. **Net: one K-CANDIDATE (M, measure-first, born-RED today
at the lossy serialization seam), two researched KILLs, one J-fold.** The brand-true reading: a
CSS-keyframes engine does not need text splitting; it needs its *stagger* to round-trip.

---

## §5 External sources

[MDN sibling-index()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/sibling-index) ·
[MDN sibling-count()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/sibling-count) ·
[Smashing — Mathematical layouts with sibling-index/count (2026-05)](https://www.smashingmagazine.com/2026/05/mathematical-layouts-sibling-index-sibling-count/) ·
[chromestatus 6225478530367488](https://chromestatus.com/feature/6225478530367488) ·
[caniuse wf-sibling-count](https://caniuse.com/wf-sibling-count) ·
[LogRocket — Native CSS stagger with sibling-index()](https://blog.logrocket.com/native-css-stagger-sibling-index/) ·
[Frontend Masters — Staggered animation with sibling-* functions](https://frontendmasters.com/blog/staggered-animation-with-css-sibling-functions/) ·
[Ollie Williams — Inheriting sibling-index() for staggered animation](https://olliewilliams.xyz/blog/inheriting-sibling-index/) ·
[MDN ::highlight()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::highlight) ·
[MDN CSS Custom Highlight API](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Custom_highlight_API) ·
[W3C css-highlight-api-1](https://www.w3.org/TR/css-highlight-api-1/) ·
[Frontend Masters — Using the Custom Highlight API](https://frontendmasters.com/blog/using-the-custom-highlight-api/) ·
[freeCodeCamp — Programmatically highlight text](https://www.freecodecamp.org/news/how-to-programmatically-highlight-text-with-the-css-custom-highlight-api/) ·
[Adrian Roselli — Just Don't Split Words into Letters (2026-02)](https://adrianroselli.com/2026/02/you-know-what-just-dont-split-words-into-letters.html) ·
[GSAP SplitText docs](https://gsap.com/docs/v3/Plugins/SplitText/) ·
[GSAP forum — SplitText and aria-label/role](https://gsap.com/community/forums/topic/45079-splittext-and-aria-label-role/) ·
[CSS-IRL — How to accessibly split text](https://css-irl.info/how-to-accessibly-split-text/) ·
[MDN reading-flow](https://developer.mozilla.org/en-US/docs/Web/CSS/reading-flow) ·
[MDN reading-order](https://developer.mozilla.org/en-US/docs/Web/CSS/reading-order) ·
[MDN text-wrap](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-wrap)
