# Frontier fleet — JUDGE LANE 2 (the RANKING judge)

**Role:** the ranking judge over all ten frontier lane docs
(`docs/tranches/J/audit/frontier/{scroll-orchestration, css-compiler, live-stylesheet-ingestion,
waapi-level-2, physics-frontier, ecosystem-distribution, compositor-eligibility,
engine-perf-frontier, text-ranges-stagger, view-transitions}.md`) + the structured proposal
digest. Produces: (a) the TOP-3 K-HEADLINE candidates ranked; (b) the coherent K-tranche SHAPE
they imply (4-6 waves + one charter sentence); (c) the conservative J-FOLD list; (d) the BOOK
list; (e) the dependency/synergy graph; (f) the anti-charter (what K must NOT do). Method:
impact × uniqueness × feasibility, weighted by the binding on-brand test (extend one of kf's
three unique axes — CSS-@keyframes round-trip / perceptual oklab / weighted layer blending — or
close a named gap in a way only a CSS-source-of-truth engine could). Every internal claim cites
a lane doc; the platform facts are inherited verified from the lanes.

---

## §0 The six K-HEADLINE candidates on the board (the ranking field)

The fleet returned SIX proposals tagged K-HEADLINE-CANDIDATE. They are not equal — three are the
spine of a coherent tranche, two are real-but-narrower, one is structurally over-scoped relative
to its on-brand reach. The field:

| id | proposal | lane | effort | the on-brand claim |
|---|---|---|---|---|
| **SO-1** | scroll-grammar round-trip (parse `animation-timeline`/`-range`/`animation-trigger`, dispatch native↔JS, serialize back) | scroll-orchestration | L | axis-1 at the #1 NAMED capability gap; the only library that round-trips scroll-driven CSS |
| **CC-1** | compile `AnimationGroup`/`Sequence`/`stagger` → zero-runtime pure CSS + honest ineligibility report | css-compiler | XL | axis-1 inverted; the parser run backward; structurally impossible for any non-CSS-model competitor |
| **K1** | `fromStyleSheets()` / `fromLiveAnimations()` — the CSSOM-walk ingester | live-stylesheet-ingestion | M | axis-1 from editor-input to LIVE-PAGE-input; one adapter from animating the whole web's CSS |
| **WL2-B** | FB-1: honor author-declared `animation-composition` (add/accumulate) on rAF AND WAAPI | waapi-level-2 | M | axis-1 × axis-3 at once; the CSS source declares a composite op the engine throws away today |
| **PHYS-C** | spring-driven blend weight — physical layer crossfades on the weighted axis | physics-frontier | M | axis-3 fused with the spring algebra; the substrate (weighted blend) exists ONLY in kf |
| **ED-1** | agent-consumable surface: `llms.txt` + proof-as-public-artifact | ecosystem-distribution | M | axis-1 + the proof culture made agent-legible; only a proof-gated library can gate its agent index |

**The decisive sort key.** All six pass the on-brand test. The differentiator is the
**uniqueness ceiling** — *how structurally impossible is this for the field?* — crossed against
**feasibility** (effort × born-RED clarity × dependency depth). On that cross:

- **CC-1, K1, SO-1, WL2-B** all rest on the SAME structural moat: kf's internal model *is* parsed
  CSS keyframes, so each is the parser pointed at a new domain (backward → CSS artifact; forward
  → live page; sideways → scroll grammar; inward → the composite operator already captured). This
  is the deepest, most-defensible moat in the fleet (`css-compiler.md §4`: "only kf's internal
  model IS parsed CSS keyframes"; `live-stylesheet-ingestion.md §5`: "one thin adapter away").
- **PHYS-C** rests on a DIFFERENT moat (the weighted-blend axis nobody else has), equally unique
  but narrower in addressable surface — it is one beautiful capability, not a tranche spine.
- **ED-1** rests on the proof-culture moat — unique, but it is a DISTRIBUTION play, not an engine
  capability; its value is gated on the publish J already owns landing first.

---

## §1 (a) THE TOP-3 K-HEADLINE CANDIDATES, RANKED

### #1 — CC-1: the CSS compiler (`css-compiler.md`, K-HEADLINE-CANDIDATE, XL)

**The case to anchor Tranche K.** This is the single frontier seam in the whole fleet that NO
competitor can *structurally* occupy, and the reason is airtight: GSAP/Motion/anime author in a
bespoke tween-object model, so "export to CSS" is for them a lossy re-derivation no one ships
(`css-compiler.md §4`, verified WebSearch: Animista/Workik author CSS from scratch, no JS lib
inverts its own graph). kf's input is a string of CSS and its frame model is the parsed form of
CSS keyframes — so the compiler is `keyframes.ts` run backward over the SAME data structure
(`css-compiler.md §1`), and HALF of it already ships and is test-gated: `CSSKeyframesToString`
(`format.ts:124-194`) emits from declared template values, `springLinearStops` already compiles a
spring → `linear()`, and `serializeEasing` already THROWS a typed error at a custom-closure refusal
— the ineligibility-report idiom the whole compiler generalizes. The platform crossed the
threshold that makes the multi-animation compile *faithful for the common case in 2026*:
`linear()` Baseline (2026-06-11), `animation-composition` Baseline (2026-01-04), `@property`
Baseline. Three properties make it a TRANCHE not a wave, each itself frontier-grade: (CC-2) it
can bake kf's perceptual-oklab curve into N pre-sampled `oklab()` stops, shipping a perceptually-
correct gradient a hand-authored two-stop `@keyframes` gets WRONG (axis-2 projected into the
artifact — the one place the compiler OUT-expresses naive CSS); (CC-S) stagger compiles uniquely
well, materializing the eased, origin-aware distribution into literal `nth-child` delays a
`sibling-index()` one-liner cannot express; (CC-3/§3e) the compiler is STRICTLY BETTER than WAAPI
for `vh`/`cqw`/`calc()` — it emits them verbatim and the browser re-resolves on every layout
change, where WAAPI must freeze-to-px (axis-4 preserved more faithfully than the compositor). The
ineligibility report (CC-3) is the trust surface AND the marketing: it PROVES axes 2/3 are beyond
CSS *from the other side* — refusing weighted-blend and perceptual-color teaches the user exactly
where kf's uniqueness lives. The "Export CSS" button (CC-4) turns the demo into a category the
field lacks: not a CSS *generator* (authors from scratch) but a CSS *compiler* (inverts a played
animation). It brushes NO ARCH kill (it is a pure author-time text emit; the shipped page has ZERO
kf bytes — the opposite of a perf hazard), and it does not overlap J (J ships the runtime; CC-1 is
the inverse product — author with it, then don't ship it). The only gate is non-negotiable and
clean: the compiled CSS replayed pixel-against the JS playback (the chrome-devtools screenshot-diff
idiom J already runs). **Why #1:** maximum uniqueness (structurally impossible for the field),
maximum on-brand (the PUREST instance of axis-1), and it is the natural CONSUMER of three other
headline candidates' outputs (stagger compile ⊃ structural-stagger; ingest+compile = the full
round-trip; the ineligibility report is the same refusal shape as WL2-B's composition honoring).
Its only deduction is effort (XL) — which is exactly why it should ANCHOR a tranche rather than ride
a wave.

### #2 — K1: live-stylesheet ingestion, `fromStyleSheets()` (`live-stylesheet-ingestion.md`, K-HEADLINE-CANDIDATE, M)

**The case to anchor Tranche K.** This is the highest impact-per-effort headline in the fleet and
the cleanest "only kf could do it THIS way." The structural fact (`live-stylesheet-ingestion.md
§1`): the engine's input is already a string of CSS (`adapter.ts:97` eats exactly what
`CSSKeyframesRule.cssText` emits), and the live page exposes strings of CSS through the CSSOM — so
the bridge from "live page" to "kf object" is NOT a new parser, it is a thin CSSOM-walk that
reconstructs the text `resolveKeyframes` already consumes. No grammar work, no WASM (the ARCH kill
is not even brushed), M-effort for a reach that is the *whole web's CSS*. The prior-art ceiling is
the proof of uniqueness: Chrome DevTools' Animations panel and the Motion DevTools extension
already SCRUB a page's animations — **none of them round-trips back to author CSS, re-times via
spring, re-interpolates color perceptually, or re-serializes a modified `@keyframes`**
(`§2.4`). They inspect; they do not transform-and-emit. That gap is precisely kf's three axes:
ingest a page's `@keyframes pulse`, swap its `ease` for a SwiftUI spring + `linear()` twin, re-color
in oklab, and hand back valid `@keyframes pulse` the author pastes. It carries the diagnostics
channel (K3) as a *prerequisite not an add-on* — the CORS-gated CSSOM read MUST report skipped
cross-origin sheets, never silently drop, which is the proof culture productized as a runtime
channel. **Why #2 not #1:** it is M-effort and structurally cleaner than CC-1, but its uniqueness
ceiling is one notch below — DevTools/Motion-DevTools occupy the *adjacent* inspect-only space, so
the differentiation must be EARNED by the round-trip output rather than being categorically
impossible for them; and it is the FORWARD twin of CC-1's BACKWARD compile (they are the two halves
of one round-trip axis, `css-compiler.md §5`), which means CC-1 is the more general anchor and K1 is
its most valuable companion. It is the strongest standalone headline if effort is the binding
constraint.

### #3 — SO-1: the scroll-grammar round-trip (`scroll-orchestration.md`, K-HEADLINE-CANDIDATE, L)

**The case to anchor Tranche K.** SO-1 is the only headline aimed at the field's #1 NAMED
capability gap (`sota-landscape.md §4 BEHIND-1`: "nothing in ScrollTrigger's class — pin, scrub,
snap, enter/leave, batch — the single largest capability gap"), and it closes it in the one shape
no imperative library can: scroll orchestration AS CSS. Every competitor expresses scroll binding
in a proprietary imperative API (`ScrollTrigger.create({trigger, start, end, scrub, pin})`); only
kf could express it as the CSS the platform itself standardized — parse `animation-timeline:
scroll()/view()`, `animation-range`, `timeline-scope`, and the 2026 `animation-trigger`/
`timeline-trigger` layer, dispatch native-where-eligible / JS-where-not, and serialize back
(`scroll-orchestration.md §2`). The platform read makes the round-trip MORE valuable over time, not
less: the CSS WG is itself absorbing ScrollTrigger's `toggleActions` into `animation-trigger`
(Chrome 145, Dec 2025) — so kf becomes the cross-browser interpreter of the very syntax the WG is
shipping, on Firefox-today AND non-DOM targets AND with physics the platform structurally lacks
(scrub-smoothing, physics-snap, velocity — none of which native scroll-driven can do,
`scroll-orchestration.md §1`). And the hard pieces are mostly SHIPPED: scrub = `SmoothProgress`
(already the `ScrollTimeline` default), snap = `decayRest`/`SpringProgress` (the closed-form fling
projection), pin = a `position: sticky` CSS-EMIT helper (NOT a transform engine — that path is a
sibling-confirmed KILL, `§3.1`). It is decisively NOT the ARCH ScrollTimeline-native-REPLACE kill:
it ADDS a tier above the JS driver and keeps it as the universal fallback (`§0`, the distinction is
cleared three ways). **Why #3:** it is the most STRATEGICALLY important headline (it closes the
gap that "disqualifies SOTA-as-product" most visibly) and it is genuinely net-new orchestration —
but it ranks third because (i) it is L-effort with a value.js extractor HANDOFF dependency (the
grammar subset lives where `animation-*` parsing already lives, upstream), (ii) two of its four
pieces COMPOSE shipped primitives rather than invent (the novel work is concentrated in the
grammar), and (iii) its physics-snap consumes the physics lane's `snapDecay` and its enter-batching
folds to an existing idiom — so it is more an INTEGRATOR of the tranche than its purest novelty. It
is the headline most likely to be what users *ask for*, which is its own argument for inclusion.

**The two headlines that ranked OUT of the top 3 (and why they still matter):**

- **WL2-B (FB-1 composition honoring)** — ranked just below the line. It is the most *ripe* of all
  six (M-effort, substrate already built by G.W17, born-RED witnessable: `engine.ts fromString`
  1267-1293 never reads `resolved.composition`; `waapi.ts` emits no `composite`), and it extends
  TWO axes at once. It is downgraded from a top-3 ANCHOR to a top-tier WAVE because it is a
  *correctness-honoring of one captured operator*, not a tranche-spanning capability — it is the
  perfect FIRST wave of a K tranche (it lands the round-trip's missing fidelity before the compiler
  inverts it), not the charter sentence. See §2: it leads the engine-fidelity wave.

- **PHYS-C (spring-driven blend weight)** — the most *beautiful* single capability in the fleet and
  the only one that fuses physics with the weighted-blend axis nobody else has. It is downgraded
  from anchor because its addressable surface is narrow (it is one capability — physical layer
  crossfades — not a spine), and it brushes the same axis (axis-3) that CC-3 PROVES is beyond CSS,
  which makes it a natural *companion* to the compiler's refusal surface rather than a competing
  anchor. It is the headline DEMO MOMENT of the tranche (a crossfade that overshoots and settles),
  which is exactly where it belongs — a flagship wave, not the charter.

- **ED-1 (agent surface)** — genuinely frontier and uniquely kf (only a proof-gated library has a
  proof corpus to expose as `proof:agent-surface`), but it is a DISTRIBUTION facet, gated on J.W5's
  publish landing first, and it does not create an engine capability. It is the tranche's
  *externalization* wave — it ships the new surfaces to humans/frameworks/agents — and it reads
  better as the CLOSING posture of K than its anchor.

---

## §2 (b) THE K-TRANCHE SHAPE the top-3 imply

**The single charter sentence:**

> **Tranche K makes kf's CSS-@keyframes round-trip TOTAL — the engine reads the live web's CSS,
> drives it with physics and perceptual color the platform lacks, and emits it back as
> zero-runtime CSS — closing the scroll-orchestration gap and honoring every operator the source
> declares, all proven by replay-pixel-equality and an honest refusal surface.**

The top-3 are not three separate products — they are the FORWARD (K1: ingest the page), the
SIDEWAYS (SO-1: the scroll grammar), and the BACKWARD (CC-1: emit pure CSS) of ONE round-trip axis,
with WL2-B (honor the composite operator) and PHYS-C (drive the weighted axis with springs)
completing the engine's fidelity, and ED-1 externalizing the whole surface. The coherent shape is
**six waves**, ordered by dependency (the round-trip must be FAITHFUL before it is INVERTED or
DISTRIBUTED):

| Wave | Title | Owns | The gate it proves itself with |
|---|---|---|---|
| **K.W0** | **THE FIDELITY FLOOR** (leads — the round-trip must be honest before it is widened) | **WL2-B (FB-1)**: honor author-declared `animation-composition` (add/accumulate) on BOTH rAF and WAAPI — wire the captured `resolved.composition` Map (`adapter.ts:120-126`) into the engine (`engine.ts:1267-1293`) and emit `composite` in `toWAAPIOptions`; the `accumulate` leaf + non-numeric `replace`-fallback. **K3 (full diagnostics channel)**: `ResolvedKeyframes.diagnostics` carrying the empty-parse, CORS-skip, unknown-timing-fn, and WAAPI-ineligible reasons — the prerequisite for K1's honest ingestion. | `proof:composition` (a 2-keyframe `composite:add` mid-frame value == SUM not replace, on rAF AND WAAPI parity, + the `accumulate` row + non-numeric `replace`-fallback) born-RED on today's tree; every silent-fallback site mirrored by a diagnostic `code`. |
| **K.W1** | **INGEST THE LIVE PAGE** (the forward round-trip) | **K1**: `fromStyleSheets()`/`fromLiveAnimations()` — the CSSOM-walk ingester (filter `CSSKeyframesRule` + sibling style rules, `try/catch` per sheet, feed `cssText` into the existing `resolveKeyframes`). **K2 (adopt)**: seamless `getAnimations()` takeover of a RUNNING CSS animation (reconstruct from the CSSOM `@keyframes` rule via K1, use `getAnimations()` ONLY for the playhead + timing, commit-on-adopt inline before cancelling — the inverse of `playWAAPI`'s commit-on-finish). | Round-trip oracle: ingest a known same-origin `@keyframes`, assert the reconstructed kf object's serialized output re-parses byte-equivalent; the cross-origin path asserts a `CROSS_ORIGIN_SKIP` diagnostic NOT a throw. K2: a chrome-devtools live-continuity oracle — adopt at a known `currentTime`, computed style within ε (no flash). |
| **K.W2** | **SCROLL ORCHESTRATION AS CSS** (the sideways round-trip — the #1 gap) | **SO-1**: extend the (value.js HANDOFF) extractor to `animation-timeline`/`-range`/`timeline-scope`/`animation-trigger`; the kf-side `ScrollScene` adapter; the native↔JS dispatch matrix (`§4`); serialize back. **SO-2**: the `ScrollScene` JS driver — `.scrub()` over `SmoothProgress`, `.snap()` over `decayRest`/`SpringProgress`, `.on(enter/leave)` from the parsed `animation-range`. **SO-3**: the `sticky`-synthesis `.pin()` (emit `position: sticky` + range CSS; the browser owns the compositor pin). Consumes the physics lane's `snapDecay` primitive. | Parse correctness: a scroll-driven stylesheet round-trips byte-faithful. Dispatch: a chrome-devtools compositor-residence trace proves native delegation = zero main-thread where eligible, JS `ScrollScene` drives Firefox-today / non-DOM / physics-snap where not. `nativeAttachment`/`ineligibleReason` queryable (mirrors `waapiIneligibleReason`). |
| **K.W3** | **COMPILE TO ZERO-RUNTIME CSS** (the backward round-trip — the anchor) | **CC-1**: walk the `AnimationGroup`/`Sequence`/`stagger` graph → `@keyframes` + `animation-*` longhands + `animation-composition` (the W0 honoring inverted) + materialized stagger delays. **CC-2**: perceptual-oklab densify-to-`oklab()`-stops (MEASURE-FIRST: ΔE pixel proof decides ship-vs-refuse). **CC-3**: the ineligibility report generalizing `waapiIneligibleReason` to the CSS domain (the four refusals — weighted blend, custom renderer, perceptual color, computed-unit drift). **CC-S**: stagger materialized to literal `nth-child` delays. | The non-negotiable proof gate: compiled CSS replayed side-by-side vs JS playback, PIXEL-compared within ε; a planted custom-renderer/weighted-blend/oklab input MUST red the compile (force the refusal); a clean spring+stagger+replace-group input compiles and pixel-matches. CC-2 ships ONLY if the densified `oklab()` emit pixel-matches the JS oklab lerp under ΔE-ε. |
| **K.W4** | **PHYSICS ON THE UNIQUE AXES** (the flagship demo moment) | **PHYS-C**: spring-driven blend weight — `layer.weight` becomes an optional `weightSpring?` read (`group.ts:362-365` one nullish swap); `group.transitionLayer`/`crossfade` spring a layer's blend weight with overshoot. **PHYS-B2 (reseatToSpring)**: velocity-continuous interruption of a PARSED-CSS keyframe animation — finite-diff the interp stream at interruption, seed a per-property `SpringProgress`, hand its `linear()` twin back as the transition easing (axis-1 × the spring algebra). **PHYS-E**: intensity-scaled reduced motion — `withReducedMotion` takes a scale ∈ [0,1], amplitude-scaling the analytic spring while preserving the oklab opacity/color track (WCAG-aligned; nobody has it). | PHYS-C: the `??`-read adds zero measurable cost to the 200-cell LoAF group bench; a spring-driven crossfade overshoots and settles, velocity-carrying re-target lands without a kink. PHYS-B2: a `bench/interruption.bench.ts` proving the finite-diff probe is zero steady-state cost (runs only at interruption) + a retargeted `fromString` animation leaves at the measured velocity. PHYS-E: at intensity `s`, peak displacement == `s ×` full peak (analytic-assertable), opacity/color untouched. |
| **K.W5** | **EXTERNALIZE THE SURFACE** (distribution — closes the tranche) | **ED-1**: `/llms.txt` + `/llms-full.txt` (the round-trip recipe inline; the SAME runnable snippets `proof:published-surface` executes) + `proof:agent-surface` (the agent index can never drift from the published surface). **ED-2 (Vue)**: `@mkbabb/keyframes-vue` — the declarative `<Keyframes :css>` component + the ~40-line `useKfAnimation` kernel (React = BOOK). **ED-3 (dogfood inversion)**: the demo consumes the published barrel + the new `<Keyframes>` adapter, not deep `@src/animation/*`. **ED-4**: the public color-FIDELITY conformance harness (ΔE vs the CSS Color 4 oklab reference — un-spinnable; axis-2). | `proof:agent-surface` born-RED on the current tree (no `/llms.txt`); GREEN when the index's linked exports == `docs/published-surface.md` roster AND every cited `proof:*` gate ∈ `proof:all`. ED-2's own `proof:published-surface` (its own tarball==declaration, runnable snippets). ED-3: `proof:demo-on-published-surface` (zero `@src/animation/*` deep imports). ED-4: the midpoint ΔE under threshold vs the spec reference. |

**Why this DAG.** K.W0 LEADS because the round-trip must be HONEST before it is widened — you
cannot faithfully ingest (K1) or compile (CC-1) an `animation-composition: add` the engine silently
drops, and K1's CORS honesty *requires* the diagnostics channel. K.W1 (forward) and K.W2 (sideways)
are file-disjoint and run parallel after W0. K.W3 (the compiler anchor) consumes W0's composition
honoring (it inverts it) and composes with K1 (ingest-then-recompile is the full loop) — it follows
W0 and rides parallel to W1/W2. K.W4 (physics) is engine-internal and file-disjoint — it can run
parallel to W1/W2/W3 but its `reseatToSpring` consumes the parsed-CSS path and its blend-weight work
touches `group.ts` (coordinate with CC-1's group walker). K.W5 (distribution) is LAST by
construction — it externalizes surfaces the prior waves create, and it is gated on J.W5's publish
having landed (the npm 4.1.0 freeze must be broken FIRST, which J owns).

---

## §3 (c) THE J-FOLD LIST (conservative — J is sized; fold ONLY what is tiny AND truly in an existing J wave's scope)

The fleet proposed nine J-FOLDs. I uphold seven, with two SCOPE-TIGHTENED and one REROUTED. The
test applied: *is it ≤ ~20 LoC or docs-only, AND does it land inside a wave J.md already charters,
AND does it require no new wave-level gate?* I am deliberately conservative — a J-FOLD that forces a
J wave to grow is not a fold, it is a K wave wearing a fold hat.

| id | proposal | target wave | ruling |
|---|---|---|---|
| **ED-5** | remove the spurious `vue ^3.5.0` peerDependency from the Vue-free library + a `proof:published-surface` peer-dep clause ("every declared peer is imported by `src/`") | **J.W5** | **UPHOLD.** This is exactly the publish-boundary-lies-about-the-surface defect class J.W5 exists to kill (`ecosystem-distribution.md §3`); it sits beside BP-1/BP-9/BP-10 in J.W5's S4 BP-hygiene band; ~10-line clause. The single cleanest fold in the fleet. |
| **CE-1.0 / §3.0** | the Safari `linear()` HW-accel hazard in the CURRENT spring-WAAPI path — a WebKit guard or a recorded known-no-accel | **J.W6** | **UPHOLD.** A measure-first correctness-tightening of the EXISTING delegation (`compositor-eligibility.md §3.0`), born-RED witnessable (trace a Safari spring-WAAPI animation, show it main-thread), and J.W6 already owns the `parseLinearStops`/`linear()`-Baseline re-verification (EF-3). Same surface, same wave. |
| **WL2-A** | position `AnimationGroup`/`Sequence` as the production WAAPI-Level-2 GroupEffect/SequenceEffect (docs only) | **J.W5** | **UPHOLD.** One README paragraph + one correspondence table (`waapi-level-2.md §3`); J.W5 already owns teaching `Sequence`/`AnimationGroup` (untaught primitives, README 4/13). Carries the KILL rider on API-mimicry (the spec is mid-redesign, `§0`). |
| **K-T4** | the "structural stagger, the CSS way" README §Beyond-CSS recipe (the a11y matrix + stagger-and-spring over consumer-owned structure) | **J.W5** | **UPHOLD.** Docs-only (`text-ranges-stagger.md §K-T4); J.W5 owns README §Beyond-CSS completion and the `stagger` export is untaught. Folds with or without K-T2; the a11y framing is its distinguishing content. |
| **VT (a)-survivor** | the README line: `flipShared` is the live-content shared-element answer, VT is the snapshot-crossfade answer — complementary, not a fallback pair | **J.W5** | **UPHOLD.** One sentence in J.W5's `flip`/`flipShared` teaching (`view-transitions.md §5`, the EP-3 untaught-export finding); preempts a future contributor re-proposing the VT-dispatch KILL. |
| **PHYS-D** | `snapDecay` — the momentum-snap primitive (decayRest + SpringProgress.reset, ~15 LoC) | **J.W6** (as a primitive) **— but CONSUMED-BY K.W2** | **UPHOLD-WITH-FLAG.** The primitive is ~15 LoC composing two shipped primitives (`physics-frontier.md §4`), and `decay.ts` is a J.W1 test-fold target anyway — BUT its frontier VALUE is in the scroll lane (K.W2 consumes it). FOLD the primitive's *landing* only if J wants it; otherwise it lands inside K.W2. Conservative call: do NOT force it into J; it is a K.W2 dependency that CAN pre-land in J.W6 if cheap. (See §5 — this is the clearest cross-tranche synergy.) |
| **EPF-3 (SoA core)** | cross-element matrix composition — the numeric-batch CORE | **J.W6 (PF-8)** | **UPHOLD.** The SoA `lerpArray` core IS J.W6's already-chartered PF-8 (`engine-perf-frontier.md §3`); fold there, do not duplicate. The cross-element INCREMENT is BOOK (fails on-brand + bottleneck tests). |
| **SO-5** | scroll-entry batching (rAF-window enter callbacks) | **— NOT J; folds into K.W2** | **OVERRIDE → K-fold (into SO-2), not J-FOLD.** The lane tagged it J-FOLD because it reuses `AnimationGroup.YIELD_BATCH`/`scheduler.yield`, but there is NO scroll surface in J to fold it INTO — it presupposes the `ScrollScene` driver that is K.W2. It is too small for its own wave but it is a K.W2 sub-item, not a J one. **Conservative correction: this is not in any existing J wave's scope.** |
| **K3 (2 engine-internal rows)** | the `EMPTY_PARSE`/`UNKNOWN_TIMING_FN` diagnostic rows | **J.W1** | **UPHOLD (the 2 rows only).** J.W1 already makes the `adapter.ts` guards total (SEAM-1/SEAM-2); a structured diagnostic row beside the typed throw is the natural ~20-LoC companion (`live-stylesheet-ingestion.md §4`). The FULL channel (CORS-skip, WAAPI-reasons) stays K.W0 — it presupposes K1. Fold the two engine-internal rows; the rest is K. |

**The conservative line I am holding:** SO-5 is REMOVED from the J-FOLD list (no J wave owns scroll;
it is a K.W2 sub-item). PHYS-D is FLAGGED as cross-tranche, not forced into J. K3 is SPLIT (2 rows
J, the channel K). Everything else folds cleanly into J.W5 (docs/publish) or J.W6 (measure-first) —
the two waves whose charters are exactly "teach the surface" and "measure-or-kill the riders." No
fold forces a J wave to grow a new gate beyond a ~10-line clause.

---

## §4 (d) THE BOOK LIST (record, premature — re-evaluate on a named tripwire)

| id | proposal | lane | the tripwire that re-opens it |
|---|---|---|---|
| **CC-5** | pre-multiply STATIC weighted weights into keyframe values → emit `replace` (partial-compile of axis-3) | css-compiler | Re-evaluate INSIDE K.W3 once CC-1 lands: a static-weight `weighted` group is a real partial-compile, but build it only after the refusal path proves out. |
| **CC-6** | `@supports (sibling-index)` / `@supports (animation-timeline: scroll())` progressive-enhancement EXPORT variants | css-compiler | When `sibling-index()` / scroll-driven reach Baseline (both Chromium-only today); the universal literal-delay form is the K.W3 default. |
| **VT-D** | cross-document View Transitions (`@view-transition`) posture | view-transitions | When `@view-transition` reaches Baseline (Firefox un-flags) AND a JS-driven cross-document customization seam exists (today there is NO kf insertion point). |
| **WL2-C** | `getAnimations()` adopt/takeover of foreign animations | waapi-level-2 | This is K2 in K.W1 — UPGRADE from BOOK to K.W1 wave-item (the lane itself flagged "K-CANDIDATE pending demand"; the K tranche IS the demand). Recorded here as resolved. |
| **K4 / instrument()** | LoAF/long-task self-instrumentation (engine reports its own health) | live-stylesheet-ingestion | When LoAF approaches Baseline (Chrome-only today) AND the attribution layer (correlating a LoAF to a specific group's tick) is demonstrated reliable; composes with K.W0's diagnostics channel. Otherwise a me-too `PerformanceObserver` wrapper. |
| **K5 / inspector bookmarklet** | embeddable inspector/bookmarklet (the demo as a devtool for the open web) | live-stylesheet-ingestion | The K-tranche's NORTH-STAR demo, downstream of K1+K2+K3 shipped AND J.W5's publish. It is the NARRATIVE that justifies K.W1, not a wave — an extension escapes CORS but is a second product. |
| **ED-2 React adapter** | `@mkbabb/keyframes-react` | ecosystem-distribution | After the Vue adapter (ED-2) proves the `@mkbabb/keyframes-<fw>` pattern AND a React demo exists to dogfood against (the demo is Vue today; shipping a React adapter with no React consumer is the un-dogfooded surface the proof culture forbids). |
| **ED-5 throughput benchmark** | public kf-vs-GSAP/Motion THROUGHPUT benchmark | ecosystem-distribution | KEEP BOOKED indefinitely — the credibility trap (the author is the contestant) + perf is parity-not-differentiator. The color-FIDELITY harness (ED-4) is the on-brand survivor and rides K.W5. |
| **EPF-1 fastdom batching** | read/write phase separation (resolve-all-endpoints-then-paint-all) | engine-perf-frontier | When a K SCROLL tier (K.W2) pins many `cq*`-driven elements through a panel-resize — the multi-computed workload that makes the epoch-boundary thrash real. Currently no born-RED workload (`engine-perf-frontier.md §1`). A K.W2 RIDER, not a standalone wave. |
| **EPF-4 d2** | warm the parse/compile caches in idle time | engine-perf-frontier | When a 50+-stop corpus shows >4 ms cold compile (the win lives only at 50+ stops; the dominant 2-11-stop shape is sub-ms). The `warmEngine()` d1 half (idle-warm the `loadAnimationEngine()` boundary) is a real K-CANDIDATE — see §6 (it could ride K.W5 as a tiny public helper). |
| **EPF-5 adaptive-readout** | defer already-epoch-cached computed READOUT under measured LoAF pressure | engine-perf-frontier | When a born-RED LoAF scene exists (the gate is GREEN at 200 cells today); the general "shed blend layers" form is KILLED (degrades author-declared intent), only the narrow layout-input-defer is BOOK. |
| **CE-3 scroll sliver** | oklab-stops emit riding a NATIVE scroll/view timeline (Chromium-only, paint-still-main-thread) | compositor-eligibility | When `color`/`background-color` reach Baseline compositor acceleration (Chrome's `background-color` work is the leading edge, unshipped + Chrome-only). The general CE-3 is KILLED (color does not composite). |

**`warmEngine()` (EPF-4 d1) note:** the engine-perf lane returned it as a standalone K-CANDIDATE.
I down-rank it to a *rider*: it is NET-NEW public surface (a `warmEngine()` export) but it is one
tiny helper (idle-fire `loadAnimationEngine()` with a `setTimeout` fallback, the `yieldToMain`
shape). It does not deserve its own wave; it folds into K.W5 (the externalization wave) as a
public-surface convenience, OR — if K does not run — it is the rare item small enough to ride J.W6
as a measure-first export. Recorded as K.W5-rider / J.W6-fallback. Not a headline, not a wave.

---

## §5 (e) DEPENDENCIES & SYNERGIES (the graph that makes K coherent)

The top proposals are not independent — they form a tight dependency lattice that is itself the
argument for a single tranche:

**The round-trip spine (the load-bearing synergy):**
- **CC-1 ⊃ CC-S (structural stagger):** the compiler MATERIALIZES the stagger distribution into
  literal `nth-child` delays at export (`css-compiler.md §3b`); CC-S is a sub-leg of CC-1, not a
  separate wave. (And K-T2 `staggerCSS()` from the text lane is the `sibling-index()` variant of the
  same emit — the two are ONE stagger-compile surface, `text-ranges-stagger.md §K-T2` explicitly
  names the css-compiler twin.)
- **K1 (ingest) ∘ CC-1 (compile) = the full round-trip:** ingest a page's `@keyframes` via
  `fromStyleSheets()`, spring-ify/re-color it, recompile to CSS via the compiler — the two are the
  FORWARD and BACKWARD halves of one axis (`css-compiler.md §5`: "they compose — ingest a page's
  animation, scrub/spring-ify it in the IDE, recompile to CSS"). This composition IS the K5
  inspector north-star (BOOK).
- **K2 (adopt) ⊃ K1 (CSSOM reconstruction):** K2 reconstructs from the CSSOM `@keyframes` rule (K1),
  using `getAnimations()` ONLY for the playhead — because the computed keyframes have already lost
  `var()`/`cqw`/oklab, the very things kf's axes preserve (`live-stylesheet-ingestion.md §K2`). K2
  is strictly downstream of K1.
- **K.W0 (compose honoring) → CC-1 (inverts it):** the compiler emits `animation-composition` from
  the SAME data model WL2-B wires IN (`css-compiler.md §1`, `adapter.ts:107-133` is the parse
  direction the compiler inverts). WL2-B must land before CC-1 can faithfully compile a composited
  group. And WL2-B's WAAPI `composite` passthrough is the same delegation discipline CE-1 partitions.

**The physics-into-the-axes synergy:**
- **SO-1/SO-2 (scroll) consume PHYS-D (`snapDecay`):** the scroll lane's `.snap()` IS `decayRest` +
  `SpringProgress.reset` (`scroll-orchestration.md §3`, `physics-frontier.md §4` defers the K-weight
  to scroll). The physics lane SHIPS the primitive; the scroll lane OWNS the orchestration. This is
  the single clearest cross-lane dependency in the fleet.
- **PHYS-C (spring blend weight) ⊥ CC-3 (the refusal):** PHYS-C drives the weighted axis with a
  spring; CC-3 REFUSES to compile the weighted axis to CSS (no `animation-composition` twin). They
  are complementary proofs of axis-3's uniqueness — one makes it richer (physical crossfade), the
  other proves it is beyond CSS. Both belong in K; PHYS-C in K.W4, CC-3 in K.W3.
- **PHYS-B2 (`reseatToSpring`) reuses the spring `linear()` emitter** that VT-C, CE-1, and PHYS-C/E
  all consume (`physics-frontier.md §6`: "complementary consumers of one emitter,
  `springTimingFunction.ts`"). One emitter, five consumers — no duplication.

**The compositor-fidelity synergy (a J→K bridge):**
- **CE-1 (per-property split) composes with SO-1's native-attach:** a per-property split could attach
  its compositable subset to a native scroll timeline (`compositor-eligibility.md §4`). CE-1 is a
  K-CANDIDATE (workload-census gated); if K runs the scroll tier, CE-1's mixed-property workload is
  finally born — it becomes a K.W2/K.W4 rider. CE-1.0 (the Safari guard) is the J.W6 fold that CE-1
  presupposes.

**The distribution synergy (gated on J):**
- **ED-1/ED-2/ED-3/ED-4 (K.W5) all presuppose J.W5's publish** (the npm 4.1.0 freeze broken, the
  honest minor cut). The agent surface, the Vue adapter, the dogfood inversion, and the fidelity
  harness are all FACETS of "the proof culture made externally consumable" — they cohere as one wave
  precisely because they share `proof:published-surface`'s discipline (each its own tarball ==
  declaration, runnable snippets). ED-3 (dogfood inversion) RIDES ED-2 (the adapter is the seam the
  demo consumes to reach the published boundary).
- **EPF-1 (fastdom) + EPF-5 (adaptive-readout) are BORN by K.W2:** the engine-perf lane's honest
  finding (`engine-perf-frontier.md §6`) is that its two real disciplines are premature TODAY but
  become live the instant a scroll tier pins many `cq*` elements. The engine-perf frontier is the
  RIDER BATTERY the scroll headline activates — not an independent anchor.

---

## §6 (f) THE ANTI-CHARTER (what Tranche K must EXPLICITLY NOT do)

The fleet returned eleven researched KILLs and a clear set of seductions to forbid. The anti-charter
binds K:

1. **Do NOT replace the JS progress driver with native ScrollTimeline** (the permanent ARCH kill,
   re-affirmed `scroll-orchestration.md §0`/SO-6). SO-1 ADDS a tier above the driver and keeps it as
   the universal fallback for Firefox-today / non-DOM / physics. K never argues "native is enough
   now"; it is not (`§1`).

2. **Do NOT build transform-pinning** (track scroll via `transform: translateY`) — SO-4 KILL,
   sibling-confirmed wrong primitive (cross-thread repaint jitter; the glass-ui dock-VT scar,
   `scroll-orchestration.md §3.1`). The ONLY kf-shaped pin is `position: sticky` CSS-emit (SO-3); kf
   owns no pin MECHANISM.

3. **Do NOT chase WAAPI compositor breadth into color/computed-units/registered-customs** — CE-2 and
   CE-3 are platform-physics KILLs: registered `@property` customs do NOT composite, color does NOT
   composite (`compositor-eligibility.md §1`). The `waapi.ts:20-23` ineligible-set boundary is
   frontier-verified and durable. The compiler is the BETTER home for computed units (CC-3/§3e),
   not the compositor.

4. **Do NOT build a `splitText()`/SplitText primitive** — K-T1 KILL: off-brand DOM mutation kf does
   not own, a 2026-MEASURED a11y hazard (broken across 4 of 5 SR/browser pairs, `text-ranges-stagger.md
   §2`) the proof culture cannot honestly gate, and off all three axes. If it belongs anywhere it is
   glass-ui's (inv-16). Likewise do NOT wrap the Custom Highlight API (K-T3 KILL — a four-property
   paint mask the platform animates better in pure CSS).

5. **Do NOT re-implement glass-ui's View Transition helper** (VT-A KILL, inv-16 breach) — the
   helper, `{types}`, the group recipe, the PRM degrade, focus routing ALL ship in glass-ui and kf
   consumes them. And do NOT parse/serialize VT stylesheet RULES (VT-B KILL — kf parses `@keyframes`
   BODIES not selectors; the VT `@keyframes` are already ordinary keyframes; the wiring is value.js's
   if anyone's; the animation bypasses every kf axis; no workload). The ONLY VT seam is the spring
   `linear()` recipe (VT-C, a recipe over an existing export + a glass-ui handoff — nearly J-sized).

6. **Do NOT mirror the WAAPI-Level-2 GroupEffect/SequenceEffect API** (WL2 KILL) — `SequenceEffect`
   is proposed for DELETION (#9557), a competing declarative-CSS direction is live (#9554); there is
   no settled surface to mirror. kf's `Sequence`/`AnimationGroup` are a principled superset. The
   positioning is a J.W5 docs paragraph, not an API rename.

7. **Do NOT JIT/closure-compile the interp dispatch** (EPF-2 KILL) — it is ALREADY monomorphic-per-iv
   via value.js's `_lerp` at `compile()` (`engine-perf-frontier.md §2`); the residue is polymorphic-3
   (cheap band), not the megamorphic cliff. A `new Function` emitter is `eval`-class, CSP-hostile,
   boundary-gate-hostile bloat for a sub-25% predicted win. The monomorphization the brief wants
   already happened one layer down.

8. **Do NOT build LoAF-driven adaptive QUALITY** (EPF-5 general-form KILL) — shedding blend layers /
   coarsening sampling degrades AUTHOR-DECLARED intent silently (the weighted-blend axis IS the
   product). kf's `YIELD_BATCH` already sheds latency-not-work, the correct shape. Me-too game-engine
   buzzword chasing against KISS.

9. **Do NOT build coupled/shared-phase vector springs** (PHYS-A KILL) — a vector spring IS N
   independent scalar springs (unanimous game-dev literature); the coupled form is mass-spring-network
   physics-sim, ARCH-adjacent, no axis. The trivial `VectorSpring` sugar is a J-FOLD-sized demo
   helper at most, not a K wave.

10. **Do NOT publish to JSR** (ED-6 KILL) — provenance is already J.W5-owned via npm; JSR's
    transpile-on-publish would LOSE kf's hand-tuned static/dynamic boundary; dual-registry
    maintenance tax for a one-dev project. A researched KILL.

11. **Do NOT build the public THROUGHPUT benchmark** (ED-5 KILL/permanent-BOOK) — the credibility
    trap (the author is the contestant) + perf is parity-with-named-reserves, not a differentiator.
    The color-FIDELITY harness (ED-4) is the on-brand survivor.

**The anti-charter's spine:** K extends the three axes and the proof culture; it does NOT chase the
compositor where the platform refuses kf's axes, does NOT mutate DOM topology it doesn't own, does
NOT re-implement glass-ui's substrate (inv-16), does NOT mirror unshipped specs, does NOT micro-chase
V8, and does NOT shed author-declared intent. Every KILL above is a *result*, not a gap — they draw
the frontier-verified line K must stay inside.

---

## §7 The one-paragraph synthesis

The fleet's six K-HEADLINE candidates collapse into ONE thesis with three faces: **make kf's
CSS-@keyframes round-trip TOTAL.** The compiler (CC-1, #1 — structurally impossible for any
non-CSS-model competitor, the parser run backward) is the anchor; live ingestion (K1, #2 — one
adapter from the whole web's CSS) is the forward twin; scroll-as-CSS (SO-1, #3 — the #1 named gap
closed in the only shape no imperative library can) is the sideways extension. Around that spine,
composition-honoring (WL2-B) makes the round-trip FAITHFUL before it is widened, and spring-driven
blend weight (PHYS-C) plus reseat-to-spring (PHYS-B2) point kf's physics algebra at the unique axes
the field cannot replicate. The agent surface (ED-1) externalizes the whole thing to the consumer
the 2026 ecosystem actually rewards. Six waves: **fidelity floor → ingest → scroll → compile →
physics-on-the-axes → externalize**, gated throughout by replay-pixel-equality and an honest refusal
surface. The J-folds are seven small docs/measure-first items (chiefly into J.W5 and J.W6); the
books are tripwire-gated platform-waits; the anti-charter is eleven frontier-verified KILLs that draw
the line K stays inside. The honest read: kf is **architecturally SOTA-class on three axes no
competitor occupies, and one tranche from being SOTA-as-a-product** — and that tranche is K, the
total round-trip.
