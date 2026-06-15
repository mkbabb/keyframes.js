# K.W9 — THE SCROLL-AS-CSS (∥ W8 · value.js-GATED · the field's #1 gap closed the only-kf way: parse + round-trip + dispatch the scroll grammar the platform is still shipping)

- **Phase:** DEV — spec authored, awaits IMPL+auth · **Class:** SHIP-in-K (Band II · NET-NEW
  capability; born-RED in the FRONTIER sense AND value.js-GATED. The born-RED is DOUBLE-rooted and
  both roots are probe-verified against the tree 2026-06-15: **(1)** kf has NO scroll-grammar PARSE
  and NO scroll DRIVER today — `grep -rnE "animation-timeline|animation-range|animation-trigger|timeline-scope|ScrollScene|parseAnimationTimeline|CSSTimelineOptions"
  src/` returns ZERO declaration/identifier hits; the ONLY matches are two PROSE comments inside the
  SHIPPED native bridge (`waapi.ts:462`, `timeline.ts:221` — both narrate the native
  `animation-range` lane, NEITHER is a parser; §State-verified), so the scroll grammar is unparsed
  and `createScrollScene` does not exist. **(2)** the typed scroll-VALUE grammar it would consume
  does not yet exist in value.js — `@mkbabb/value.js@0.12.0` ships the property *names*
  (`STYLE_NAMES` lists `animationTimeline`/`animationRange`/`animationRangeStart`/`animationRangeEnd`/
  `timelineScope`/`scrollTimeline`/`viewTimeline`, `dist/units/constants.d.ts:33`) but has NO typed
  `scroll()`/`view()`/range-phase value extractor and NO `CSSTimelineOptions`/`parseAnimationTimeline`
  (`grep -rcE "CSSTimelineOptions|parseAnimationTimeline|rangePhase" node_modules/@mkbabb/value.js/dist/`
  → ZERO; §State-verified). The capability is absent BOTH because the kf surface does not exist AND
  because the typed value grammar it consumes is not yet published — the PARSE consume edge lights on
  value.js's PUBLISH, born-RED-gated kf-side, NEVER a `file:` link or a vendored copy.) ·
- **Scope (a NEW scroll module + `timeline.ts`/`format.ts` edges; the value.js VJ.W1 consume edge):**
  SO-1 parse + round-trip `animation-timeline`/`-range`/`timeline-scope`/`animation-trigger`
  (consuming the dispatched value.js `CSSTimelineOptions` typed extractor + inverse serializer) +
  DISPATCH (native compositor ScrollTimeline via the SHIPPED `attachNativeScrollTimeline`
  (`waapi.ts:470`) where eligible, the kf `ScrollScene` JS driver SO-2 where not — Firefox/non-DOM/
  scrub-smoothing/physics-snap) + SO-3 `position:sticky` pin SYNTHESIS (SO-4 transform-pinning KILLED)
  + SO-5 entry-batching (the `AnimationGroup.YIELD_BATCH` idiom — a `ScrollScene` sub-item) + PHYS-D
  snapDecay (the `decayRest`+`SpringProgress` snap primitive — a `.snap()` sub-item) + the
  `proof:scroll-roundtrip` gate (born-RED in the frontier sense + value.js-gated; the source half
  lands against the recorded born-RED, the consume edge lights on the publish). ·
- **DAG-deps:** **FOLLOWS K.W7** (the fidelity floor leads Band II; `K.md §WAVE MAP`) and runs **∥
  K.W8 (ingest)** — file-disjoint (W9 a new scroll module + `timeline.ts`/`format.ts` edges; W8 a
  new ingest module + `adapter.ts`/`index.ts` edges; both follow W7). **value.js-GATED:** the typed
  scroll-VALUE grammar is VJ.W1, DISPATCHED to value.js's post-N tranche via the kf-side outbound ask
  (`../KF-TO-VALUEJS-GRAMMAR-ASKS.md §VJ.W1` — the mirror of the inbound `../VALUEJS-N2-ASKS.md`; the
  ask doc is the parallel value.js-coordination lane's deliverable). The source half (the kf
  `ScrollScene` driver + the dispatch matrix + the pin synthesis) lands born-RED against the recorded
  absence; the PARSE consume edge lights when value.js publishes the `CSSTimelineOptions` extractor
  (the J.W7b published-consume-edge idiom — `K.md §WAVE MAP`: "the source half lands born-RED, the
  consume edge lights when value.js publishes"). **K.W10 (compile) optionally EMITS the scroll
  grammar** as a `@supports (animation-timeline: view())` progressive-enhancement variant (CC-6 BOOK,
  `../L-SEED.md §6`) — W9 PARSES the scroll declarations, W10's PE-variant EMITS them; a read-then-emit
  compose, not a co-edit (both touch `format.ts`-lineage code on DISJOINT concerns — §Hand-off). **W9
  NEVER re-enters the ScrollTimeline-native-REPLACE ARCH kill** (§Design-decisions) — it ADDS a
  parse+dispatch tier ABOVE the JS driver, it deletes no driver.

## §Provenance (the frontier lane this wave consumes + the booked roots)

- **`../L-SEED.md §1 #3` — THE decisive frontier input (the §body→K.W9 map row).** The body-item
  map (`../L-SEED.md` "§body-item → K wave map"): "**SO-1 / SO-2 / SO-3** — SCROLL ORCHESTRATION AS
  CSS (§1 #3) | parse + round-trip + dispatch the scroll grammar; `ScrollScene` driver; sticky-pin
  synthesis (**VJ.W1-gated**) | **K.W9** SCROLL-AS-CSS". The §1 TOP-3 body (`../L-SEED.md §1`): "SO-1
  — SCROLL ORCHESTRATION AS CSS — The field's #1 named gap, closed the only-kf way: parse +
  round-trip the scroll grammar (animation-timeline: scroll()/view(), animation-range, timeline-scope,
  the animation-trigger layer the CSS WG is absorbing FROM ScrollTrigger) and DISPATCH per the
  conservative-correct delegation philosophy — native compositor ScrollTimeline where eligible, the
  kf ScrollScene JS driver (SO-2: SmoothProgress scrub + snapDecay physics, composing shipped
  primitives) where the platform falls short (Firefox-today, pin smoothing, snap). Pin = position:sticky
  SYNTHESIS (SO-3 — kf authors the platform's pin; transform-pinning SO-4 is KILLED: cross-thread
  jitter). NOT the ScrollTimeline-native-replace ARCH kill: this ADDS a parse+dispatch tier above the
  JS driver and never deletes it."
- **`../audit/frontier/scroll-orchestration.md §0-§6` — the wave-ready engineering detail.** §0
  (the decisive distinction — this is NOT the kill): "The killed thing is precise: **replacing kf's
  JS `Timeline` progress driver with the native `animation-timeline` so the JS sampler ceases to
  exist.** … This lane is squarely inside that grant. Three reasons it is categorically not the
  killed thing: (1) It ADDS a tier above the driver; it replaces no driver. … (2) The orchestration
  capabilities the platform CANNOT do are JS-only by construction … (3) The headline is a PARSE
  capability, orthogonal to the driver entirely." §2 (the HEADLINE seam): "the grammar gap is one
  extractor away. value.js's stylesheet extractor (`/value.js/src/parsing/extract.ts:114-176`)
  already parses `animation-name`, `-duration`, …, `-composition`, AND the `animation:` shorthand. It
  does **NOT** parse `animation-timeline`, `animation-range`, `scroll()`/`view()` functions,
  `timeline-scope`, or the new `animation-trigger` / `timeline-trigger`. That is the precise, bounded
  grammar subset kf would add — and because kf already serializes back from the declared template
  (`format.ts`, the serialize-from-template authority), it would be the **only library that
  round-trips a scroll-driven stylesheet**." §3 (the JS-only band — COMPOSES shipped primitives):
  scrub-smoothing → `SmoothProgress` (`smooth.ts` — the `ScrollTimeline` pipeline ALREADY runs it,
  `timeline.ts:60-105`; "kf's scrub-smoothing is a STRICT capability native scroll-driven lacks");
  snap → `decay`/`SpringProgress` (the snap DECISION layer is thin); enter/leave → `AnimationGroup` +
  the threshold detector DERIVED from the parsed `animation-range`. §3.1 (PIN — the researched
  HALF-KILL): transform-pinning REJECTED ("scroll repaints run on a different thread, so
  transform-tracked pins jitter/desync against the compositor" — "the SAME structural lesson the
  glass-ui dock-VT scar records"); `position:sticky` synthesis WINS ("kf's role is NOT to reimplement
  sticky — it is to emit the sticky CSS as part of the parsed `ScrollScene` and drive the pinned
  interval's animation through the dispatch"). §4 (the delegation matrix — the WAAPI eligibility gate
  generalized to the scroll clock). §5 (the KISS surface sketch:
  `createScrollScene(spec|css).pin().scrub().snap().on().attach()` + `get nativeAttachment`). §6
  verdicts: SO-1 K-HEADLINE-CANDIDATE; SO-2/SO-3 K-CANDIDATE; SO-4 KILL; SO-5 J-FOLD (→ K.W9
  sub-item); SO-6 (native REPLACE) KILL re-affirm.
- **`../audit/frontier/physics-frontier.md §4` — the snapDecay primitive (PHYS-D, the `.snap()`
  composition root).** §4 "Momentum scrolling / snap physics — J-FOLD the primitive, DEFER the
  orchestration to the scroll lane": the snap primitive composes the SHIPPED `decay`/`decayRest`
  (`decay.ts:59-100`, the closed-form projected rest point) + `SpringProgress` settle; the
  ORCHESTRATION (the scroll-idle snap DECISION) is explicitly DEFERRED to THIS scroll lane. The
  primitive itself needs no net-new value.js grammar (it composes kf's own physics — `decayRest` +
  `SpringProgress.reset`), distinct from the MotionPath path-sampler (DL-K21/VJ-F1, RIPE in 0.12.0,
  `../VALUEJS-N2-ASKS.md §2 row 9`) which is MotionPath product, NOT the scroll snap.
- **The value.js dispatch (the OPEN gate — the acyclic spine in motion).** `../VALUEJS-N2-ASKS.md §3`:
  "**VJ.W1 SCROLL GRAMMAR + VJ.W2 `sampleColorRamp`** — the two genuine L gates remain net-new and
  un-scheduled; value.js has recorded them for its post-N successor tranche; L re-confirms their
  status at its open" (and the §body line: "VJ.W1 / VJ.W2 — OPEN, the two genuine L gates, recorded
  value.js-side"). `K.md §value.js coordination`: "**VJ.W1 SCROLL GRAMMAR** (gates K.W9): the
  `CSSTimelineOptions` typed extractor + inverse serializer (`animation-timeline`/`-range`/
  `timeline-scope`/`animation-trigger`, `scroll()`/`view()`/range-phase) — the ONE genuine net-new
  grammar. Confirmed ABSENT in 0.12.0 (orchestrator-probed 2026-06-15)." The outbound ask is
  `../KF-TO-VALUEJS-GRAMMAR-ASKS.md §VJ.W1` — the kf-side spec value.js's post-N tranche consumes.
- **The booked invariant roots:** `K.md §invariant set` — the **acyclic-spine invariant** (W9's
  source half lands born-RED against the recorded VJ.W1 absence; the PARSE consume edge lights on
  value.js's publish, born-RED-gated kf-side, NEVER a `file:` link or vendored grammar) + the
  **replay-equality invariant** (the round-trip is proven: a scroll-driven stylesheet parses, drives
  — native where eligible, JS where not — and serializes BACK to valid CSS, faithful both ways; OR is
  REFUSED with a named reason, never silently approximated). The ScrollTimeline-native-REPLACE ARCH
  kill (carried `C.md:265` / `I.md:421` / `J.md:335`) is RE-AFFIRMED, never re-litigated (§0 of the
  lane; SO-6 KILL `../L-SEED.md §5`).

## §The state, verified (file:line / grep / version anchors — all probed against the tree 2026-06-15)

- **NO scroll-grammar PARSE and NO `ScrollScene` in kf (CONFIRMED — born-RED root 1):**
  `grep -rnE "animation-timeline|animation-range|animation-trigger|timeline-scope|parseAnimationTimeline|CSSTimelineOptions|ScrollScene|createScrollScene"
  src/` → the ONLY hits are two PROSE comments inside the SHIPPED native bridge: `waapi.ts:462`
  ("native `animation-range` lane has NEITHER. This bridge attaches the RAW …") and `timeline.ts:221`
  ("smoothing + boundary snap the native `animation-range` path has none of"). These narrate the
  native lane; NEITHER is a parser, and NO `ScrollScene`/`createScrollScene` symbol exists. **kf does
  not parse `animation-timeline`/`-range`/`-trigger`/`timeline-scope`, and has no scroll DRIVER — the
  capability is genuinely net-new.**
- **The SHIPPED native-attach bridge is NOT the killed thing (CONFIRMED — the §0 distinction):**
  `attachNativeScrollTimeline` is exported at **`waapi.ts:470`** (`export function
  attachNativeScrollTimeline<V extends Vars>(`) — it attaches an eligible DOM animation to a native
  `ScrollTimeline`/`ViewTimeline`, calling `isWAAPIEligible` at `waapi.ts:474`. `createNativeTimeline`
  (`timeline.ts:227`) feature-detects the native globals (`"ScrollTimeline" in globalThis`, per the
  `:232-237` comment) and returns `null` (caller keeps the JS sampler). The JS `ScrollTimeline` class
  (`timeline.ts:162` `export class ScrollTimeline extends Timeline`) + its `SmoothProgress` smoothing
  (constructed `timeline.ts:63`, run through `applyPipeline` `:79` → the smoother tick `:100-105`) are
  SHIPPED and KEPT — W9 ADDS a parse+dispatch tier ABOVE them; it deletes no driver. **W9 is squarely
  inside the fleet's "NET-NEW scroll ORCHESTRATION is fair game" grant**
  (`../audit/frontier/scroll-orchestration.md §0`). **HARDENING-5 HAZARD-2 line-drift CORRECTED:** the
  frontier lane's frozen `waapi.ts:440` shorthand has DRIFTED — the current export is `:470` (the
  comment narrating the native lane is `:462`); the IMPL re-greps current line numbers, never copies
  the frozen lane's nor an earlier draft's.
- **The JS-only physics primitives the driver COMPOSES are SHIPPED (CONFIRMED):** `SmoothProgress`
  (`smooth.ts`, the scrub smoother — the `ScrollTimeline` pipeline already runs it via the
  `timeline.ts:63` smoother), `decay`/`decayRest` (`decay.ts` — the snap projection), `SpringProgress`
  (`spring.ts` — the settle). The scroll DRIVER (SO-2 `ScrollScene`) COMPOSES these — "two of the four
  hard pieces (scrub, snap) are SHIPPED primitives awaiting a driver"
  (`../audit/frontier/scroll-orchestration.md §3`). The new part is the DRIVER + the dispatch + the
  PARSE, not the physics.
- **The `format.ts` serialize-from-template authority is SHIPPED (CONFIRMED — the S1 serialize half):**
  `format.ts:53-85` is "THE one declared-template projection (J.W1 S1 — ENG-1)" — it renders a stop
  from the parsed-but-unresolved template, never a live-DOM sample ("a serializer must not need a
  live, fully-styled DOM to emit"). The scroll round-trip's SERIALIZE half extends THIS authority to
  emit the `animation-timeline`/`-range` declarations from the template — the round-trip is the
  parser run BACKWARD over the same data model.
- **VJ.W1 scroll-VALUE grammar ABSENT in value.js 0.12.0 (CONFIRMED — born-RED root 2; the SHARP
  form):** `@mkbabb/value.js@0.12.0` is published on npm (`npm view @mkbabb/value.js version` →
  `0.12.0`); the installed pin is `^0.11.2` (`package.json:179`) — K.W1 re-pins to `^0.12.0` BEFORE
  Band II. value.js 0.12.0 RECOGNIZES the scroll property *NAMES* (`STYLE_NAMES` in
  `dist/units/constants.d.ts:33` lists `animationTimeline`, `animationRange`, `animationRangeStart`,
  `animationRangeEnd`, `timelineScope`, `scrollTimeline`, `scrollTimelineAxis`, `scrollTimelineName`,
  `viewTimeline`, `viewTimelineAxis`, `viewTimelineInset`, `viewTimelineName`) — but ships NO typed
  scroll-VALUE extractor: `grep -rcE "CSSTimelineOptions|parseAnimationTimeline|rangePhase"
  node_modules/@mkbabb/value.js/dist/` → **ZERO**. So the property names parse to bare ValueUnits;
  the `scroll()`/`view()` FUNCTION grammar, the `<range-phase> <pct>` range grammar, and the typed
  `CSSTimelineOptions` extractor + inverse serializer DO NOT EXIST. **The PARSE consume edge cannot
  light until value.js publishes VJ.W1.** This is the SHARP born-RED: not "value.js knows nothing
  about scroll" (it knows the names) but "value.js has no typed scroll-VALUE grammar to consume."
- **The dispatch precedent is SHIPPED (CONFIRMED):** the WAAPI eligibility gate
  (`isWAAPIEligible`, `waapi.ts:109`) returns an eligibility verdict with a reason — the "delegate
  where provably correct, fall back to the always-correct JS driver, query the reason" discipline W9
  generalizes to the scroll clock (`../audit/frontier/scroll-orchestration.md §4`).

## §Goal

Close the field's #1 named gap (`../audit/sota-landscape.md` the Scroll-driven row: kf is "PARTIAL
(progress driver + `createNativeTimeline`; **no pin/scrub/snap orchestration**)" vs GSAP "HAS — gold
standard (ScrollTrigger + ScrollSmoother)") the ONLY-kf way: **kf treats scroll-driven CSS as a
parseable, round-trippable source of truth — it parses the `animation-timeline`/`-range`/`-trigger`
the platform itself standardized, drives it on the compositor where the platform allows AND on its
shipped physics primitives where the platform falls short (Firefox-today, non-DOM targets,
scrub-smoothing, physics-snap), and hands back valid CSS that degrades into the native engine as
browsers catch up.** Every competitor expresses scroll binding in a PROPRIETARY imperative API
(`ScrollTrigger.create({trigger, start, end, scrub, pin})`); only kf could express it as the CSS the
WG is shipping, and round-trip it. The 2026 platform makes the gap real and durable: scroll-driven
timelines are Chrome/Edge 115+, Safari 26 shipped, Firefox behind a flag; `animation-trigger` is
Chrome-145-only; NONE covers Firefox-default, scrub-smoothing, physics-snap, or non-DOM targets — the
exact band kf's SHIPPED `SmoothProgress`/`SpringProgress`/`decay` inhabit
(`../audit/frontier/scroll-orchestration.md §1`). Three moves:

1. **SO-1 — the scroll-grammar round-trip (S1 — value.js-GATED).** kf parses
   `animation-timeline: scroll()/view()`, `animation-range: <range-phase> <pct> …`, `timeline-scope`,
   and the 2026 `animation-trigger`/`timeline-trigger` layer (consuming the dispatched value.js
   `CSSTimelineOptions` typed extractor — the source half lands born-RED, the consume lights on the
   publish), and serializes them BACK faithfully from the declared template (`format.ts:53-85` — the
   serialize-from-template authority). The ONLY library that round-trips a scroll-driven stylesheet.
2. **SO-2 — the `ScrollScene` JS driver + the dispatch (S2 — value.js-INDEPENDENT).** The "one
   declaration, two backends" dispatch (the WAAPI seam pointed at the scroll clock): native
   ScrollTimeline via the SHIPPED `attachNativeScrollTimeline` (`waapi.ts:470`) where eligible
   (compositor sampling, zero main-thread); the kf `ScrollScene` JS driver (scrub via `SmoothProgress`,
   snap via `decay`/`SpringProgress`, enter/leave from the parsed `animation-range`) where not
   (Firefox-default, non-DOM targets, scrub-smoothing, physics-snap, the WAAPI-ineligible set). The
   `ScrollScene` exposes a queryable `nativeAttachment`/`ineligibleReason` — the `waapiIneligibleReason`
   honesty idiom. SO-5 entry-batching (the `AnimationGroup.YIELD_BATCH`/`scheduler.yield` idiom
   applied to enter callbacks) + PHYS-D snapDecay (the `decayRest`+`SpringProgress` snap primitive)
   are `ScrollScene` sub-items, not separate wave-legs.
3. **SO-3 — the `position:sticky` pin SYNTHESIS (S3 — value.js-INDEPENDENT).** kf EMITS the
   `position:sticky` + range CSS from a `pin()` author intent and drives the pinned interval's
   animation through the dispatch — kf authors the platform's pin; it owns no pin MECHANISM (SO-4
   transform-pinning is KILLED: cross-thread jitter; the browser does the pinning on the compositor).

## §Scope

- **S1 — SO-1 the scroll-grammar round-trip (value.js-GATED; the acyclic-spine source half).**
  Locus: a NEW `src/animation/scroll.ts` (HEAVY — it needs the parser; reached via
  `loadAnimationEngine()`, the static/dynamic boundary HOLDS) that consumes the dispatched value.js
  `CSSTimelineOptions` typed extractor + an inverse-serializer extension to `format.ts`. The PARSE
  half: `animation-timeline: scroll()/view()`, `animation-range: <range-phase> <pct> …`,
  `timeline-scope`, `animation-trigger`/`timeline-trigger` → a typed `CSSTimelineOptions`. The
  SERIALIZE half: round-trip those declarations BACK from the declared template (`format.ts:53-85` —
  the J.W1 S1 ENG-1 serialize-from-template authority, never a DOM-resolved sample). **WHY
  value.js-GATED:** the grammar lives where the `animation-*` parsing already lives — value.js's
  stylesheet extractor (`extract.ts:114-176`); value.js 0.12.0 knows the property NAMES (`STYLE_NAMES`)
  but has NO typed `scroll()`/`view()`/range-phase value extractor and no `CSSTimelineOptions`
  (§State-verified). The `CSSTimelineOptions` extractor is VJ.W1, ABSENT in 0.12.0, DISPATCHED to
  value.js's post-N tranche. **The acyclic-spine handling (BINDING):** the kf source half (the
  `ScrollScene` consumer that CALLS `CSSTimelineOptions`) lands born-RED against the recorded VJ.W1
  absence — the consume edge born-RED-gates kf-side, NEVER a `file:` link to value.js's WIP tree and
  NEVER a vendored copy of the grammar in kf's tree; the edge lights when value.js publishes (the
  J.W7b published-consume-edge idiom). **NO-WORKAROUND:** NOT a kf-local scroll-grammar parser (the
  grammar is value.js's — `K.md §value.js coordination`; a kf-local parser breaches the acyclic spine
  AND re-introduces the "kf has a local grammar" fiction the J.W5 audit corrected,
  `../audit/frontier/scroll-orchestration.md §2`); NOT a `file:` link or vendored grammar (the
  acyclic-spine invariant's named forbidding).
- **S2 — SO-2 the `ScrollScene` JS driver + the dispatch (value.js-INDEPENDENT; composes shipped
  primitives).** Locus: the NEW scroll module + `timeline.ts` edges (it composes the SHIPPED
  `ScrollTimeline` `timeline.ts:162` / `SmoothProgress` `timeline.ts:63`). The driver:
  `createScrollScene(spec | css)` → `.scrub(seconds)` (→ `SmoothProgress` damping — SHIPPED),
  `.snap(ranges, spring)` (→ `decayRest`/`SpringProgress` settle on scroll-idle — the PHYS-D snapDecay
  primitive composing `decayRest` + `SpringProgress.reset`, SHIPPED), `.on('enter'|'leave', cb)` (the
  threshold detector DERIVED from the parsed `animation-range`, IntersectionObserver-class but
  CSS-sourced; SO-5 batches enter callbacks via `AnimationGroup.YIELD_BATCH`/`scheduler.yield`),
  `.attach()` (runs the dispatch). The dispatch matrix (`../audit/frontier/scroll-orchestration.md §4`):
  DOM target + WAAPI-eligible + native `ScrollTimeline` present → **NATIVE** via
  `attachNativeScrollTimeline` (`waapi.ts:470`); native present BUT scrub/snap/velocity requested →
  **JS** `ScrollScene` (native `animation-range` has no smoother — `timeline.ts:221`); native ABSENT
  (Firefox-default, jsdom, SSR; `createNativeTimeline → null` `timeline.ts:227`) → **JS**; non-DOM
  target (plain object, canvas, WebGL uniform) → **JS**; computed-unit (`cqw`/`calc`/`var`) or
  color-interp animation → **JS** (the WAAPI-ineligible set). The `ScrollScene` exposes
  `get nativeAttachment` / `ineligibleReason` (the `waapiIneligibleReason` honesty idiom). **WHY
  value.js-INDEPENDENT:** the driver composes SHIPPED kf primitives
  (`SmoothProgress`/`decay`/`SpringProgress`/`ScrollTimeline`) + the SHIPPED `attachNativeScrollTimeline`
  — it needs no net-new grammar; only S1's PARSE needs VJ.W1. So the SPEC-fed construction
  (`createScrollScene(spec)`) is fully un-blocked the moment K.W7 lands; only the CSS-fed construction
  (`createScrollScene(css)`) born-RED-gates on VJ.W1. **NO-WORKAROUND:** NOT transform-pinning (SO-4
  KILLED — §S3); NOT re-implementing `sticky` (the browser owns it on the compositor — §S3); NOT
  deleting the JS `ScrollTimeline` driver (SO-6 ARCH kill re-affirmed — the dispatch ADDS a tier, the
  JS sampler is the universal fallback).
- **S3 — SO-3 the `position:sticky` pin synthesis (value.js-INDEPENDENT).** Locus: the scroll
  module's `pin(selector?)` → EMITS `position:sticky` + the range CSS (kf authors the platform's pin)
  and drives the pinned interval's animation through the §S2 dispatch. **WHY sticky, not transform:**
  the web consensus + the glass-ui dock-VT scar are decisive — "scroll repaints run on a different
  thread, so transform-tracked pins jitter/desync against the compositor; `position:sticky`/`fixed`
  deliver better performance overall" (`../audit/frontier/scroll-orchestration.md §3.1`). kf owns no
  pinning MECHANISM — it owns the CSS AUTHORING of the platform's pinning mechanism. **NO-WORKAROUND:**
  SO-4 transform-pinning is KILLED (the named anti-charter row — `../L-SEED.md §5` SO-4 "scroll
  repaints on a different thread; transform-tracked pins jitter/desync; position:sticky synthesis is
  the only correct pin"; the SAME structural lesson the glass-ui dock-VT-snapshot DELETE recorded);
  the spec re-affirms the kill, it does not re-litigate it.

## §Hard gate (the proof:* that BITES — born-RED in the FRONTIER sense + value.js-GATED · the scroll round-trip oracle)

**The oracle (per the replay-equality + acyclic-spine invariants + the gate-ORACLE precept):**
`proof:scroll-roundtrip` parses a scroll-driven stylesheet, dispatches it (native where eligible, JS
where not), drives the JS path, and asserts the round-trip is faithful BOTH ways (the parsed
`CSSTimelineOptions` re-serializes to valid CSS that re-parses equivalent; the JS driver scrubs the
parsed range through the smoother). Born-RED is DOUBLE-rooted: (1) the FRONTIER sense (no scroll-parse
surface and no `ScrollScene` exist); (2) value.js-GATED (the typed scroll-VALUE extractor is
unpublished — the PARSE clauses born-RED-gate on VJ.W1; the consume edge lights on the publish).

- **clause (a) — SO-2 the JS driver scrubs + snaps a SPEC-fed scroll scene (CORRECTNESS ·
  value.js-INDEPENDENT — lands WITHOUT VJ.W1).** `createScrollScene({ range, scrub, snap })` over a
  non-DOM / Firefox-fallback target: the JS `ScrollScene` drives the engine's progress from a
  scroll-position input through `SmoothProgress` (the scrub smoothing the native lane lacks), and
  `.snap()` settles to the nearest range boundary via `decayRest`/`SpringProgress` on scroll-idle.
  **BORN-RED WITNESS:** there is no `createScrollScene` to call today (the §State-verified ZERO grep
  — the surface is absent) → the gate reds by construction. **BITE:** reds until S2 ships the driver;
  greens when the spec-fed scene scrubs (the engine progress tracks the scroll input through the
  smoother) AND snaps (the progress settles to the nearest range boundary). **NO escape:** the assert
  reads the ENGINE's progress write tracking the scroll input through the smoother (the engine-write
  disambiguation rule carried into the frontier band) — a decorative bob cannot produce a
  scroll-correlated, smoother-damped progress. **This clause is value.js-INDEPENDENT — it lands the
  moment K.W7 lands, proving SO-2 born-correct BEFORE VJ.W1 publishes (the un-blocked half).**
- **clause (b) — SO-1 the PARSE round-trips a scroll-driven stylesheet (CORRECTNESS · value.js-GATED
  — born-RED-gates on VJ.W1).** A stylesheet `@keyframes reveal { from { opacity: 0; translate: 0 40px }
  to { opacity: 1; translate: 0 0 } } .card { animation: reveal linear both; animation-timeline:
  view(); animation-range: entry 0% cover 40% }` parses to a typed `CSSTimelineOptions`, and
  `format.ts` re-serializes it to valid CSS that re-parses to a template-equivalent (the round-trip's
  faithfulness — parse → serialize → re-parse equivalence). **BORN-RED WITNESS (the acyclic-spine
  form):** the typed scroll-VALUE extractor + `CSSTimelineOptions` are ABSENT in value.js 0.12.0
  (`grep -rcE "CSSTimelineOptions|parseAnimationTimeline|rangePhase" node_modules/@mkbabb/value.js/dist/`
  → ZERO, §State-verified) → the parse cannot run → the clause REDS against the RECORDED born-RED (the
  kf source half lands; the consume edge is dark). **The consume edge LIGHTS when value.js publishes
  VJ.W1** — the clause greens on the publish, born-RED-gated kf-side, NEVER a `file:` link. **BITE:**
  reds until BOTH S1 ships the consumer AND value.js publishes the extractor; greens when the
  round-trip is faithful. **NO escape:** the assert is the parse → serialize → re-parse equivalence,
  not a "did it not throw" check — a lossy round-trip (a dropped range phase, a `scroll()` collapsed to
  `view()`) reds even though it "parsed."
- **clause (c) — the DISPATCH is conservative-correct, with a queryable reason (CORRECTNESS ·
  value.js-INDEPENDENT for the matrix).** An ELIGIBLE DOM scroll animation with a native
  `ScrollTimeline` present dispatches to NATIVE (`attachNativeScrollTimeline`, `waapi.ts:470`); the
  SAME animation with scrub-smoothing requested, OR a non-DOM target, OR native absent (jsdom:
  `createNativeTimeline → null`, `timeline.ts:227`), dispatches to the JS `ScrollScene`; the
  `nativeAttachment`/`ineligibleReason` reports WHICH backend and WHY. **BITE:** reds if an ineligible
  animation is silently dispatched to native (a wrong-pixel scrub on a computed-unit/color-interp
  animation) or an eligible one is needlessly driven by JS (a perf regression with no reason); the
  queryable reason makes the dispatch decision auditable. **NO escape:** the reason string is the
  honesty surface (the `waapiIneligibleReason` idiom generalized to the scroll clock — the same
  conservative-correct discipline `isWAAPIEligible` `waapi.ts:109` already practices).
- **clause (d) — SO-3 the pin is `position:sticky` SYNTHESIS, never transform-tracking (CORRECTNESS ·
  the anti-jitter assert).** `pin()` emits `position:sticky` + the range CSS; the gate asserts the
  emitted pin CSS uses `position:sticky` (NOT `transform: translateY`), so the pinned element cannot
  jitter against the compositor. **BITE:** reds if the pin emits a transform-tracking primitive (SO-4,
  KILLED — the cross-thread jitter class). **NO escape:** the assert is the EMITTED CSS property
  (`position:sticky`), a structural fact the transform-pin provably violates.
- **clause (e) — SO-6 the JS driver is NOT deleted (HYGIENE — the ARCH-kill guard, labeled).** The JS
  `ScrollTimeline` (`timeline.ts:162`) / `ScrollScene` driver is the universal fallback; the dispatch
  ADDS a tier above it and never replaces it (the ScrollTimeline-native-REPLACE kill re-affirmed —
  `createNativeTimeline → null` still keeps the JS sampler). *(Labeled HYGIENE — it guards the ARCH
  kill; the wave's GREEN depends on the round-trip clauses (a)-(d).)*

**The §spine bar — MUST bite.** Clauses (a)-(d) are the scroll round-trip oracle: clause (a) (the JS
driver) is value.js-INDEPENDENT and lands FIRST (proving SO-2 born-correct on K.W7's substrate before
VJ.W1 publishes); clause (b) (the PARSE round-trip) born-RED-gates on VJ.W1 (the consume edge lights
on value.js's publish — the acyclic-spine form); clause (c) (the dispatch) asserts the
conservative-correct backend choice with a queryable reason; clause (d) (the pin) asserts
`position:sticky` synthesis, never transform-tracking. **The born-RED witness is DOUBLE-rooted and
CONCRETE:** no scroll-parse surface or `ScrollScene` exists in kf (the §State-verified
two-comments-only grep) AND the typed scroll-VALUE extractor + `CSSTimelineOptions` are ABSENT in
value.js 0.12.0 (registry + dist-grep verified) — the clauses red on exactly that observed shape.
**Two-tier taxonomy:** the wave's GREEN depends on the correctness clauses (a)-(d); clause (e) is a
HYGIENE corroborator (the ARCH-kill guard; it may NEVER substitute for a red correctness clause).
**Acyclic-spine posture (declared — the BINDING handling):** the source half (the kf `ScrollScene` +
the dispatch + the pin synthesis + the consumer that CALLS `CSSTimelineOptions`) lands born-RED
against the recorded VJ.W1 absence; clauses (a)/(c)/(d) GREEN on K.W7's substrate (value.js-INDEPENDENT);
clause (b) GREENS only when value.js PUBLISHES the extractor (born-RED-gated kf-side, NEVER a `file:`
link or vendored grammar). **K's impl never blocks on the unpublished symbol** — SO-2/SO-3 + clauses
(a)/(c)/(d) run regardless; only the PARSE (b) waits for the publish (`K.md §value.js coordination`:
"K can authorize and run Band I + the un-blocked frontier while value.js ships the two grammar
items"). **Replay-equality posture (declared):** the round-trip is proven both ways (parse → drive →
serialize back to valid CSS — clause (b)); what cannot round-trip faithfully is REFUSED via the
`ineligibleReason` surface (clause c), never silently approximated. **P6 posture (declared):** the
JS-driver leg (a) + the dispatch matrix (c) + the pin-CSS-emit (d) are device-INDEPENDENT (the engine
progress / the backend choice / the emitted CSS property are computed facts) → they hard-gate on the
Linux runner (jsdom: `createNativeTimeline → null` forces the JS path, exercising (a)/(c) directly);
the native-attach leg of (c) that needs a real compositor runs on the headed chrome-devtools-mcp tier
with a per-EXPECTED predicate (the backend attribution), NOT a fixed settle. **Budget 0** (the gate
asserts POSITIVE product properties — the driver scrubs+snaps, the round-trip is faithful, the
dispatch is correct, the pin is sticky — not an error count; the pre-cure tree threw nothing, the
capability simply does not exist). **value.js gate status:** VJ.W1 OPEN — DISPATCHED via
`../KF-TO-VALUEJS-GRAMMAR-ASKS.md §VJ.W1`; clause (b) born-RED-gates on the publish; clauses (a)/(c)/(d)
are un-blocked. Unlike K.W7 (RIPE-consumed) and K.W8 (RIPE-with-tripwire), W9 is the FIRST genuinely
value.js-GATED frontier wave — the acyclic-spine's OPEN form.

## §No-workaround prohibitions (BINDING — the mandate's named forbiddings for this wave)

- **NO kf-local scroll-grammar parser (S1).** The scroll grammar lives in value.js (where the
  `animation-*` parsing already lives — `extract.ts:114-176`); kf consumes the dispatched typed
  `CSSTimelineOptions` extractor, born-RED-gated kf-side. A kf-local parser breaches the acyclic-spine
  invariant (`K.md §invariant set`) AND re-introduces the "kf has a local grammar" fiction the J.W5
  audit corrected (`../audit/frontier/scroll-orchestration.md §2`; `K.md §MANDATE`). value.js knows
  the property NAMES already (`STYLE_NAMES`) — kf does NOT re-derive a parallel name table either.
- **NO `file:` link or vendored grammar (S1 — the acyclic-spine's named forbidding).** The VJ.W1
  consume edge is a PUBLISHED consume (value.js publishes; kf consumes one tranche behind on the
  publish, born-RED-gated kf-side), NEVER a `file:` link to value.js's WIP tree and NEVER a vendored
  copy of the scroll grammar in kf's tree (`K.md §invariant set`: "the frontier's value.js edges are
  PUBLISHED consumes, born-RED-gated kf-side, NEVER a `file:` link or a vendored copy"; `K.md §MANDATE`).
- **NO transform-pinning (S3 — SO-4 KILLED).** The pin is `position:sticky` synthesis; transform-
  tracking is the KILLED primitive (cross-thread repaint jitter; the glass-ui dock-VT scar —
  `../L-SEED.md §5` SO-4). The spec re-affirms the kill, it does not re-litigate it.
- **NO ScrollTimeline-native-REPLACE (S2 — SO-6 ARCH kill re-affirmed).** W9 ADDS a parse+dispatch
  tier ABOVE the JS `ScrollTimeline` driver and NEVER deletes it. The killed thing is "replacing the
  JS `Timeline` progress driver with the native `animation-timeline` so the JS sampler ceases to exist"
  (`../audit/frontier/scroll-orchestration.md §0`; `C.md:265`/`I.md:421`/`J.md:335`); W9 keeps the JS
  sampler as the universal fallback (the dispatch matrix's last four rows are all JS). A proposal
  re-enters the kill ONLY if it argues "delete the JS `ScrollTimeline`, native is enough now" — W9
  never does.
- **NO blocking K's impl on the unpublished VJ.W1 symbol (S1).** SO-2/SO-3 + the gate's clauses
  (a)/(c)/(d) are value.js-INDEPENDENT and run on K.W7's substrate; only the PARSE (clause b)
  born-RED-gates on the publish. K authorizes and runs the un-blocked frontier while value.js ships
  VJ.W1 in its own interval (`K.md §value.js coordination`) — the same acyclic cadence value.js's
  0.12.0 just demonstrated.
- **NO inventing scroll physics (S2 — the COMPOSE discipline).** Scrub = `SmoothProgress` (SHIPPED),
  snap = `decay`/`SpringProgress` (SHIPPED), enter/leave = the range-derived detector, entry-batch =
  `AnimationGroup.YIELD_BATCH` (SHIPPED). "Two of the four hard pieces (scrub, snap) are SHIPPED
  primitives awaiting a driver" (`../audit/frontier/scroll-orchestration.md §3`); the new part is the
  DRIVER, not the physics. No coupled vector springs, no novel snap math (the PHYS-A coupled form is
  KILLED, `../L-SEED.md §5`).

## §Folds (every K.md-assigned fold, with its frontier-lane + L-SEED/N2 citation)

- **SO-1** (the scroll-grammar round-trip — value.js-GATED) — S1. `../L-SEED.md §1 #3` + the
  §body→K.W9 map; `../audit/frontier/scroll-orchestration.md §2,§6` (SO-1 K-HEADLINE-CANDIDATE, the
  genuine novel work); the value.js dispatch `../KF-TO-VALUEJS-GRAMMAR-ASKS.md §VJ.W1` (the OPEN gate);
  `src/` two-comments-only grep (born-RED root 1 — no parse, no `ScrollScene`); value.js 0.12.0
  `CSSTimelineOptions` absent / property-NAMES-only (born-RED root 2, the sharp form).
- **SO-2** (the `ScrollScene` JS driver + the dispatch — value.js-INDEPENDENT) — S2.
  `../audit/frontier/scroll-orchestration.md §3,§4,§5,§6` (SO-2 K-CANDIDATE, composes shipped
  primitives); `SmoothProgress` (`smooth.ts`) / `decay` (`decay.ts`) / `SpringProgress` (`spring.ts`)
  / `ScrollTimeline` (`timeline.ts:162`) / `attachNativeScrollTimeline` (`waapi.ts:470`) — all SHIPPED;
  `createNativeTimeline` (`timeline.ts:227`) the feature-detect fallback.
- **SO-3** (the `position:sticky` pin synthesis) — S3.
  `../audit/frontier/scroll-orchestration.md §3.1,§6` (SO-3 K-CANDIDATE, folds into SO-1's
  `ScrollScene`); SO-4 transform-pinning KILLED (`../L-SEED.md §5`).
- **SO-5 (scroll-entry batching)** — a `ScrollScene` SUB-ITEM (S2's `.on('enter')`). J-judged a
  K.W9 sub-item (`../L-SEED.md §4`: "the judge OVERRODE … SO-5 scroll-entry batching … presuppose the
  K.W2[→K.W9] ScrollScene driver — they are K.W9[→W9] sub-items"); reuses
  `AnimationGroup.YIELD_BATCH`/`scheduler.yield` (`group.ts`). NOT a separate wave-leg — a sub-item of
  SO-2's `ScrollScene` if elected at impl.
- **PHYS-D snapDecay** — a `.snap()` SUB-ITEM (S2). `../audit/frontier/physics-frontier.md §4`
  (J-FOLD the primitive, DEFER the orchestration to THIS scroll lane); composes the SHIPPED `decayRest`
  (`decay.ts:59-100`) + `SpringProgress.reset` — no value.js edge (distinct from the MotionPath
  path-sampler DL-K21/VJ-F1, RIPE in 0.12.0 `../VALUEJS-N2-ASKS.md §2 row 9`, which is MotionPath
  product, NOT the scroll snap).

## §Hand-off (the BINDING file-ownership boundary — §4B of the README, restated)

W9 runs ∥ W8 (both follow W7). Its loci (`waves/README.md §4B`):

- **W9 owns a NEW scroll module (`src/animation/scroll.ts`) + `timeline.ts` (`ScrollTimeline`)
  edges + the `format.ts` scroll-declaration serialize extension.** The scroll module
  (`createScrollScene`/`pin`/`scrub`/`snap`/`on`/`attach`) is NET-NEW; it composes the SHIPPED
  `ScrollTimeline` (`timeline.ts:162`) + `attachNativeScrollTimeline` (`waapi.ts:470`). It does NOT
  edit `engine.ts`'s interp path (W7's honoring read) and does NOT edit `group.ts` (W11's blend-weight
  tier).
- **W9 ∥ W8 are file-disjoint.** W9 a new scroll module + `timeline.ts`/`format.ts` edges; W8 a new
  ingest module + `adapter.ts`/`index.ts` edges. They run in parallel without touching each other's
  files.
- **`format.ts` is touched by W9 (the scroll-declaration round-trip serialize) and W10 (the compile
  module over the serialize lineage) on DISJOINT concerns.** W9 round-trips the SCROLL declarations
  (`animation-timeline`/`-range` from the template); W10 compiles the GROUP/SEQUENCE/STAGGER graph
  FORWARD into zero-runtime CSS (and OPTIONALLY emits the scroll grammar W9 parses as a CC-6 `@supports`
  PE-variant — a read-then-emit compose). If both touch `format.ts` directly, they land as separable
  commits, each gate reding only on its half. **W10's PE-variant CONSUMES W9's parse** — a temporal
  read-then-emit dependency, not a co-edit.
- **The value.js VJ.W1 consume edge is a PUBLISHED consume, NEVER a `file:` link or vendored
  grammar** (the acyclic-spine invariant). The typed `CSSTimelineOptions` extractor lands in value.js's
  tree (its own repo/authorization); kf consumes it one tranche behind on the publish. The dispatch is
  `../KF-TO-VALUEJS-GRAMMAR-ASKS.md §VJ.W1`.

## §Design-decisions (the named calls this spec makes, so the impl does not re-litigate)

- **W9 is NOT the ScrollTimeline-native-REPLACE kill.** It ADDS a parse+dispatch tier ABOVE the JS
  driver; it deletes no driver; the JS `ScrollTimeline` (`timeline.ts:162`) is the universal fallback
  (the dispatch matrix's last four rows). The §0 distinction is BINDING — the impl never argues
  "native is enough now, delete the JS sampler" (`../audit/frontier/scroll-orchestration.md §0`).
- **The acyclic-spine is handled by SPLITTING the wave's gate into a value.js-INDEPENDENT half
  (clauses a/c/d — SO-2/SO-3) and a value.js-GATED half (clause b — SO-1's PARSE).** The un-blocked
  half lands on K.W7's substrate and proves the driver born-correct BEFORE VJ.W1 publishes; the PARSE
  consume edge lights on the publish. This is the J.W7b published-consume-edge idiom made concrete:
  K's impl never blocks on the unpublished symbol. W9 is the FIRST OPEN-form acyclic-spine wave in
  Band II (W7 RIPE-consumed, W8 RIPE-with-tripwire) — the spec carries the OPEN-gate posture
  explicitly so the impl recognizes the new shape.
- **The born-RED root is the SHARP form: value.js knows the property NAMES, not the VALUE grammar.**
  value.js 0.12.0's `STYLE_NAMES` recognizes `animationTimeline`/`animationRange`/`timelineScope`/etc.
  (the longhand vocabulary), so the names parse to bare ValueUnits — what is ABSENT is the typed
  `scroll()`/`view()`/range-phase VALUE extractor + `CSSTimelineOptions` (dist-grep ZERO). The dispatch
  ask (`../KF-TO-VALUEJS-GRAMMAR-ASKS.md §VJ.W1`) is for the typed extractor + inverse serializer, NOT
  for the property names (which value.js already ships). The impl does not re-ask for what is shipped.
- **The pin is `position:sticky` synthesis, NOT a kf pin mechanism.** kf authors the platform's pin
  (emits the CSS); the browser does the pinning on the compositor. SO-4 transform-pinning is KILLED
  (the glass-ui dock-VT scar) — the spec re-affirms it.
- **The driver COMPOSES shipped primitives — it invents no physics.** Scrub = `SmoothProgress`
  (shipped), snap = `decay`/`SpringProgress` (shipped, PHYS-D), enter/leave = the range-derived
  detector, entry-batch = `AnimationGroup.YIELD_BATCH` (shipped, SO-5). "Two of the four hard pieces
  (scrub, snap) are SHIPPED primitives awaiting a driver" (`../audit/frontier/scroll-orchestration.md §3`)
  — the new part is the DRIVER + the PARSE + the dispatch, not the physics.
- **The line-drift is corrected (HARDENING-5 HAZARD-2).** `attachNativeScrollTimeline` is exported at
  `waapi.ts:470` (NOT the frontier lane's frozen `:440`, NOR the `:462` comment that narrates the
  native lane); `ScrollTimeline` is `timeline.ts:162`; `createNativeTimeline` is `timeline.ts:227`;
  the SmoothProgress smoother is constructed `timeline.ts:63` and run `:79`/`:100-105`. The impl
  re-greps current line numbers, never copies the frozen frontier lane's nor an earlier draft's.
