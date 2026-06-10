# valuejs-frontier-allocation — every K-SEED frontier item, split across the kf↔value.js seam

**Lane:** FRONTIER-ITEM ALLOCATION (the kf↔value.js BOUNDARY-ALLOCATION fleet · 2026-06-10).
**Question:** for each K-SEED frontier item, where is the kf-half and where is the value.js-half,
with file-level precision — what value.js must REFINE/UPGRADE, what to FOLD IN (kf→value.js),
what to FOLD OUT (value.js→kf consumption), and what stays put.

**Provenance:** direct source survey of both repos at HEAD — value.js `tranche-f-handoff` (`0cb5dd2`,
published `0.11.2`, parse-that pin `^0.8.2`) + kf `tranche-j-dev` — cross-checked against the
verified census (`valuejs-census.md`) and the four cited frontier lane docs (`css-compiler.md`,
`live-stylesheet-ingestion.md`, `scroll-orchestration.md`, `physics-frontier.md`). READ-ONLY on both
source repos. Every allocation carries `file:line` in BOTH repos.

**The boundary, restated and re-verified:** value.js owns VALUES (parse/serialize of CSS
values+units+colors, conversion/normalization, color science, easing/bezier MATH, interpolation
kernels, grammars via parse-that). kf owns TIME (animation semantics, frames compilation, playback,
orchestration, WAAPI delegation, DOM write strategies). **Two corrections from the census stand:**
spring/decay PHYSICS is wholly kf-local and value.js has NONE — reality is the better design (physics
rides the time engine); and the DOM-resolution "contested middle" is uncontested (value.js's single
`normalize.ts`, kf consumes it opaque). This lane finds **one more structural fact that reshapes the
allocation:** value.js already ships a COMPLETE stylesheet AST + serializer + animation-shorthand
round-trip (`parsing/stylesheet.ts`, `serialize.ts`, `animation-shorthand.ts`). The K round-trip's
value-half is **mostly already published** — the net-new value.js work is small and specific.

---

## §0 — The decisive structural fact: value.js's round-trip substrate is ALREADY built

The K spine is "make the CSS round-trip TOTAL." Half of that — the **value half** (text↔AST↔text for
CSS values, keyframes, and the animation shorthand) — is shipped in `0.11.2` and kf already consumes
most of it. The allocation must not re-plan what exists:

| Round-trip leg | value.js TODAY (file:line) | kf consumes it? |
|---|---|---|
| CSS text → typed `Stylesheet` AST | `parseCSSStylesheet` (`stylesheet.ts:514`) — emits `StylesheetItem[]`: `keyframes` / `property` / `style` / `unknown` (`stylesheet.ts:43-58`) | YES — `adapter.ts` via `parseCSSStylesheet` |
| Keyframes / props / style-rules extraction | `extractKeyframes` (`extract.ts:34`), `extractProperties` (`extract.ts:57`), `extractStyleRules` (`extract.ts:71`), `extractAnimationOptions` (`extract.ts:189`) | YES — `adapter.ts` (`extractKeyframes/Properties`, `extractAnimationOptions`) |
| `animation` shorthand → typed options | `parseAnimationShorthand` (`animation-shorthand.ts:200`) | YES (transitively, via `extractAnimationOptions` → `extract.ts:118`) |
| typed options → `animation` shorthand string | **`reverseAnimationShorthand`** (`animation-shorthand.ts:262`) | **NO — kf-unconsumed** (the emit direction CC-1/K1 wants) |
| `Stylesheet` AST → CSS text | `serializeStylesheet` (`serialize.ts:116`), `stylesheetToString` (`serialize.ts:155`), `formatCSS` (`serialize.ts:131`, Prettier) | kf has its OWN `formatCSS`/`unflattenObjectToString` consume (`format.ts`) |
| keyframe-rule / declaration single-node serialize | `serializeKeyframeRule` (private, `serialize.ts:22`), `serializeDeclaration` (`serialize.ts:17`), `serializeKeyframeSelector` (`serialize.ts:12`) | partial |

**Consequence:** the CSS-compiler's (CC-1) and ingestion's (K1) value-half is **consume-existing +
one fold**, not net-new grammar. The net-new value.js work across the whole frontier reduces to four
specific items (the linear() string parser VJ-1, the scroll-grammar typed extractor for SO-1, an
oklab ramp-sampler for CC-2, the parse-cache bound VJ-4) — everything else is kf-local engine
semantics or consume-existing-value.js.

---

## §1 — CC: the CSS COMPILER (the K anchor) — split

### CC-1 — compile `AnimationGroup`/`Sequence`/`stagger` → pure CSS

**kf half (the orchestration→CSS PLANNING — the bulk):** the group/sequence/stagger walker that
emits multi-animation CSS, maps `BlendMode` (`constants.ts:184`) → `animation-composition`
(`group.ts:307-345`: replace→replace, add→add, weighted→REFUSE), materializes stagger delays
(`stagger.ts:167` `.delays(total)`), and decides eligibility. This is animation-semantic; it stays
kf. The single-`Animation` serializer already exists (`format.ts:124-194`, `CSSKeyframesToString`).

**value.js half (the SERIALIZATION primitives CC-1 emits THROUGH):**
- **`reverseAnimationShorthand`** (`animation-shorthand.ts:262`) — the typed-options→`animation`
  shorthand emitter. kf's CC-1 produces a `CSSAnimationOptions` per child and wants the shorthand
  string back. **SHIPPED, exported, kf-UNCONSUMED.** This is item **KF-CC1** below (VJ→KF-consume).
- `serializeStylesheet` / `stylesheetToString` / `formatCSS` (`serialize.ts:116,155,131`) — if CC-1
  builds a `Stylesheet` AST and emits via value.js's serializer (instead of kf's `format.ts`
  string-concat), the Prettier pass + round-trip symmetry come for free. **OPTIONAL** — kf already
  has its own `formatCSS` consume; choosing the AST path is a kf design call, not a VJ change.

**Allocation verdict:** CC-1 is **~90% kf** (the walker, the eligibility, the blend mapping, the
stagger materialization). The value half is **consume `reverseAnimationShorthand`** (zero VJ work) +
optionally route emit through the existing `serializeStylesheet`. **No net-new value.js work for CC-1.**

### CC-2 — perceptual-oklab densify → N intermediate `oklab()` CSS stops

This is the one CC leg with a genuine net-new value.js primitive. The §3c densify bakes kf's JS oklab
curve into 8–16 sampled `oklab()` stops so the browser's piecewise-linear fill tracks the perceptual
curve.

- **value.js has the per-pair color lerp** (`lerpColorValue`, `interpolate.ts:104` — the
  `ColorChannelPlan`-driven perceptual interp kf already installs at compile). It does **NOT** have a
  **ramp sampler** that returns N intermediate `oklab()` *value strings* at parametric `t ∈ [0,1]`.
- The honest API: **`sampleColorRamp(from, to, n, { space, hueMethod }): string[]`** (or
  `densifyOklab`) living beside `mix.ts`/`interpolate.ts` — it is pure color VALUE math (sample the
  oklab path, gamut-map each via the existing `gamutMapOKLab`/`gamut.ts`, serialize each to an
  `oklab()` literal). This is squarely value.js color territory (the census moat). **Net-new VJ, S–M.**
- kf's half: deciding N (reuse the `WAAPI_SUBSEGMENT_STOPS` bench idiom, `waapi.ts:221`), emitting the
  densified `@keyframes`, and the ΔE pixel-proof gate (MEASURE-FIRST). The ΔE check itself uses
  **`deltaEOK`** which value.js **already exports** (`gamut.ts:53`, re-exported `dispatch.ts:51` +
  barrel) — see ED-4.

**Allocation verdict:** CC-2 splits cleanly — **net-new VJ ramp-sampler (`sampleColorRamp`)** + kf
densify-emit + the ΔE gate (consuming the already-shipped `deltaEOK`). Gated on the pixel proof; the
VJ primitive is the only net-new value-side work in the whole CC leg.

### CC-3 — the ineligibility VOCABULARY (the four refusals)

**This is kf-LOCAL, not a shared enum, and not value.js.** The four refusals — `weighted` blend has
no `animation-composition` twin, custom renderer, perceptual-oklab axis, computed-unit drift — are all
statements about **kf engine capabilities** (`group.ts` BlendMode, kf's custom-transform closures, kf's
oklab default, kf's DOM-resolution). The precedent (`waapiIneligibleReason`, `waapi.ts:98-208`) is
already a kf-side queryable-refusal idiom. value.js has no stake in "can this kf orchestration compile
to CSS." The enum lives where the capabilities live: **kf.**

**Allocation verdict:** CC-3 is **kf-KEEPS** (engine-capability vocabulary, generalize
`waapiIneligibleReason`). No value.js half.

---

## §2 — K1/K2/K3: live-stylesheet INGESTION — split

### K1 — `fromStyleSheets()` / `fromLiveAnimations()` (the CSSOM walk)

The census + the lane doc agree this is **M-effort because there is NO parser work.** Confirmed at
source: `CSSKeyframesRule.cssText` emits exactly the text `parseCSSStylesheet` (`stylesheet.ts:514`)
already eats, and `resolveKeyframes` (`adapter.ts`) already wraps it.

**kf half (ALL of the net-new code):** the CSSOM walk (`document.styleSheets` →
`CSSKeyframesRule`/style-rule linkage), per-sheet `try/catch` for the CORS edge, `animation-name`→rule
linkage, feeding `rule.cssText` into the existing pipeline. This is **DOM-dependent** — it is the
contested-middle's kf-LEGITIMATE half: walking the live DOM/CSSOM is kf's job (kf owns DOM write/read
strategies), the *parsing* of the extracted text is value.js's (already consumed).

**value.js half:** **ZERO net-new.** `parseCSSStylesheet` + `extractKeyframes` + `extractStyleRules`
(`extract.ts:71`, which K1 needs to find the sibling style rule that references the `@keyframes` via
`animation-name`) all exist and are kf-consumed. The emit-back side wants **`reverseAnimationShorthand`**
(same KF-CC1 consume as CC-1).

**Allocation verdict:** K1 is **kf-local DOM walk consuming already-shipped value.js parse/extract.**
No value.js work. (This is the census's key efficiency: the value substrate for the round-trip's
forward direction is complete.)

### K2 — `adopt()` (seamless takeover of a running CSS animation)

**Wholly kf.** `getAnimations()` reads, `currentTime` continuity, the `commitStyles` precedence trap
(kf already solved the inverse at `waapi.ts:386-398`), phase reconstruction — all DOM/temporal/engine
semantics. The lane doc's own discipline (reconstruct keyframes from the CSSOM `@keyframes` rule via
K1, use `getAnimations()` only for playhead) means K2's value-touch is entirely through K1's
already-allocated value consume. **value.js half: NONE.**

**Allocation verdict:** K2 is **kf-KEEPS** (temporal/DOM takeover). No value.js half.

### K3 — `ResolvedKeyframes.diagnostics` channel

This is the contested one for the seam, and the census already half-resolved it (VJ-3 BOOK). Split:

- **The CONSUMER/sink half is kf** — `ResolvedKeyframes.diagnostics: Diagnostic[]` is a kf type
  (`adapter.ts`); the cross-origin-skip row (K1's honesty), the WAAPI-ineligibility rows
  (`waapi.ts` reasons), the empty-parse + unknown-timing-fn rows are all surfaced kf-side. Two of
  these (EMPTY_PARSE / UNKNOWN_TIMING_FN) already J-FOLD into J.W1 (K-SEED §4).
- **The PRODUCER half is value.js (BOOK, VJ-3)** — a structured warning channel in value.js's parse
  path (so `parseCSSStylesheet`/`parseCSSValueUnit` can emit a `Diagnostic` instead of throwing or
  returning typed-empty silently). The census confirms value.js has NO `DiagnosticSink`/`onWarn`
  today (grep=0). This is the VJ-F2/LD-DIAG sink — **speculative until K1's honest-failure surface
  exists to consume it.** value.js can today be honest by THROWING (kf catches per-sheet); the
  structured upstream sink is an upgrade, not a prerequisite.

**Allocation verdict:** K3 sink is **kf** (rides J.W1 for the two engine rows + K.W0 for the full
channel); the value.js producer sink stays **VJ-REFINE BOOK** (VJ-3) — elect only if/when a second
consumer (beyond kf-catch) materializes. The seam: kf owns the diagnostics TYPE and most rows; value.js
optionally provides a parse-path producer later.

---

## §3 — SO: scroll orchestration AS CSS — the one genuine net-new value.js grammar

### SO-1 — the scroll-grammar round-trip (parse `animation-timeline`/`-range`/`timeline-scope`/`animation-trigger`)

This is the frontier item with the **clearest, cleanest value.js half** — and the lane doc named it a
sibling HANDOFF (`scroll-orchestration.md §2`). Verified at source:

- **What value.js captures TODAY:** the `style` `StylesheetItem` keeps `declarations: Declaration[]`
  as **raw `{name, value: ValueArray, important}`** (`stylesheet.ts:17-21,46-50`). So a
  `.card { animation-timeline: view(); animation-range: entry 0% cover 40% }` rule's declarations are
  **already parsed into the AST as generic declarations** by `parseCSSStylesheet`. The grammar at the
  declaration-capture level exists.
- **What value.js does NOT have:** a **TYPED extractor** that recognizes the scroll vocabulary —
  `extractAnimationOptions` (`extract.ts:189` → `applyLonghand:108-173`) handles
  `animation-name/-duration/-delay/-iteration-count/-direction/-fill-mode/-timing-function/-composition`
  and the `animation` shorthand, but has **no case for `animation-timeline`, `animation-range`,
  `timeline-scope`, `animation-trigger`, `timeline-trigger`**, and no parser for the `scroll()`/`view()`
  timeline functions or the `entry/exit/cover/contain` range phases. (Note: `KeyframeSelector` already
  models `entry/exit/cover/contain` named selectors — `stylesheet.ts:23-28` — but that is the keyframe
  selector, not the `animation-range` phase; the range parser is net-new.)

**The split, with the typed AST handoff shape:**

- **value.js half (net-new VJ grammar — this is the sibling HANDOFF):** extend `CSSAnimationOptions`
  (or a sibling `CSSTimelineOptions`) with `timeline?`, `range?`, `trigger?` typed fields, and add the
  `applyLonghand` cases + the `scroll()`/`view()`/`animation-range`/`animation-trigger` value parsers
  in `parsing/` (where `animation-shorthand.ts` already lives). The typed AST handoff:
  ```ts
  // value.js parsing/ — net-new typed extraction
  type CSSTimelineOptions = {
    timeline?: { kind: "scroll" | "view"; axis?: "block"|"inline"|"x"|"y"; scroller?: "nearest"|"root"|"self" }
             | { kind: "named"; name: string };
    range?: { start: { phase: "entry"|"exit"|"cover"|"contain"|"normal"; offset?: ValueUnit };
              end:   { phase: ...; offset?: ValueUnit } };
    trigger?: { axis: string; behavior: string[] };  // animation-trigger/timeline-trigger
  };
  ```
  Effort **M–L** (it is bounded grammar — the exact `animation-*` shape value.js already parses, a few
  new functions). This is **value.js's grammar territory** unambiguously: it owns
  `animation-shorthand`, the stylesheet AST, the value parsers. The scroll grammar is more of the same.
- **kf half:** the `ScrollScene` adapter that consumes the typed `CSSTimelineOptions`, the
  native↔JS dispatch (`attachNativeScrollTimeline` `waapi.ts:440` where eligible, the JS `ScrollTimeline`
  `timeline.ts:162` otherwise), and the round-trip emit (kf's `format.ts` re-serializes the timeline
  declarations from the typed options — or value.js's serializer gains the inverse). The
  serialize-back inverse (`CSSTimelineOptions → declarations`) is a small VJ companion to the parser.

**Allocation verdict:** SO-1 is the **one genuine KF→VJ grammar HANDOFF in the frontier** — value.js
gains the typed scroll-grammar extractor + serializer (net-new VJ, M–L); kf owns the `ScrollScene`
driver + dispatch + round-trip wiring. This is item **VJ-SO1** below.

### SO-2 / SO-3 — `ScrollScene` JS driver + `sticky`-synthesis pin

**Wholly kf.** SO-2 composes SHIPPED kf primitives (`SmoothProgress` smooth.ts, `decay` decay.ts,
`SpringProgress` spring.ts) into a scroll driver — pure animation semantics, value.js has no stake.
SO-3 emits `position: sticky` CSS (a kf authoring helper; the platform does the pinning). The
`snapDecay` primitive SO-2 consumes is the physics-lane's J-FOLD (`decayRest` `decay.ts:94` +
`SpringProgress.reset`) — **kf-local** (census §5: spring/decay is kf's). **value.js half: NONE.**

**Allocation verdict:** SO-2/SO-3 are **kf-KEEPS**. No value.js half.

---

## §4 — WL2-B / WL2-C: composition honoring — pure kf (no value.js primitive)

### WL2-B — honor author-declared `animation-composition` (add/accumulate)

The question posed: does accumulate-composition math (value addition/accumulation per type) need a
value.js `add`/`accumulate` primitive on `ValueUnit`?

**Answer: NO — it is kf engine semantics, and the per-type math is trivial.** Verified at source:

- value.js's `interpolate.ts` has `lerpValue`/`lerpColorValue`/`lerpNumericValue`/`prepareInterpVar`
  (`interpolate.ts:104,171,187,217`) — interpolation kernels — but **NO `add`/`accumulate`/`composite`
  function** (grep confirmed). 
- The capture is already kf-side: `adapter.ts:120-126` (F.W8) lifts per-stop `animation-composition`
  onto a `composition` map; `engine.ts` never reads it (the WL2-B defect). Honoring it is reading that
  map in the rAF accumulate path + the WAAPI composite path — **engine wiring, not value math.**
- The actual "addition" for `add`/`accumulate` is: for a numeric leaf, `base + delta` (and kf's
  `group.ts:320-321` already documents un-clamped `add` aligned to CSS); for a transform list,
  list-concatenation per the CSS spec; for a color, the spec defines composition in the declared space.
  These are **per-type rules the ENGINE applies at blend time** — the same place `group.ts:345`'s
  weighted lerp lives. They are not a reusable value-domain primitive (they are coupled to the frame
  model and the blend tier).

**Could a value.js `accumulate(a, b, type)` exist?** In principle, yes — but it has **zero pull**: it
would have exactly one consumer (kf's engine), it is coupled to kf's frame/iteration model (accumulate
is iteration-stacking, which is a TIME concept), and the per-type arithmetic is a few lines. Folding it
into value.js inverts the boundary (TIME math into the VALUE substrate) for no functional gain — the
same verdict as the spring (census §5). **Reality: composition honoring is kf engine semantics.**

**Allocation verdict:** WL2-B is **kf-KEEPS** (engine compositor semantics). No value.js primitive.
WL2-C (overlap/adopt) folds into K2 (also kf). No value.js half for the whole WL2 cohort.

---

## §5 — PHYS: the physics frontier — spring/decay stays kf (the census verdict, re-confirmed)

### PHYS-C / PHYS-B2 / PHYS-E — spring-driven blend, reseat-to-spring, intensity-scaled PRM

The directive's question: where is the spring ODE today, where SHOULD the spring/decay math live per
the boundary hypothesis (easing MATH is VJ territory) — and is moving it worth it?

**Where it is:** `spring.ts:341-386` (analytic `SpringProgress.evaluateAt`, all three damping
regimes, exact `currentVelocity`), `decay.ts:59-100` (closed-form `decay`/`decayRest`),
`springLinearStops.ts` + `springTimingFunction.ts` (the dual CSS twins). value.js has **NONE** of it
(census §5, grep=0). `decay.ts:17` self-flags a VJ-1 fold-out that has never landed.

**Where it SHOULD live — the honest verdict (census-aligned, re-confirmed):** **leave it in kf.** The
boundary hypothesis ("value.js owns easing/bezier/SPRING MATH") is FALSE on the spring leg, and reality
is the better design:
1. The spring/decay math is pure and DOM-free (a legitimate VJ candidate IN ISOLATION) — BUT it has
   zero pull: glass-ui already consumes the spring FROM kf (`M.md §3`), so a cross-repo consumer exists
   and is sourced from kf. Moving to value.js INVERTS an established edge for no functional gain.
2. The frontier PHYS items prove the physics belongs WITH the time engine: PHYS-C drives the
   weighted-blend tier (`group.ts:362-365` — a kf compositor concept value.js has no notion of);
   PHYS-B2 `reseatToSpring` finite-differences the kf `interpFrames` interp stream (a TIME-domain
   velocity probe); PHYS-E rides kf's single `withReducedMotion` gate (`internal/reduced-motion.ts:101`).
   All three are spring×kf-axis fusions — the physics is inseparable from the engine that schedules it.
3. The ONE clean future fold is the closed-form `decay` SAMPLER (pure math, no clock) — but it is
   ≥2-consumer-gated and not pulled now.

**The one value.js TOUCH in the PHYS cohort:** PHYS-B2's `reseatToSpring` finite-differences the interp
stream to extract velocity, then hands the spring's `linear()` twin back to the engine. The `linear()`
EVALUATION uses value.js's `cssLinear` (`easing.ts:33`) which kf already consumes — and the spring→stops
SAMPLING is kf's `springLinearStops` (census §4: kf-owned, animation-semantic). **No new value.js work.**
(If PHYS-B2's velocity probe wants the SoA `lerpArray` for the per-property finite-diff, that is the
already-tracked KF-1 consume, not a new VJ item.)

**Allocation verdict:** PHYS-C / PHYS-B2 / PHYS-E are **kf-KEEPS** (physics rides the time engine). The
boundary hypothesis is wrong on spring MATH and the existing design is correct. No value.js half. This
re-confirms census item **VJ-7 (KILL — keep spring in kf).**

---

## §6 — ED: the agent/ecosystem surface — ED-4 is the value.js-touching one

### ED-4 — the public color-FIDELITY conformance harness

The directive's question: does value.js export `deltaE` today? Where does the harness live?

**value.js exports `deltaEOK` TODAY** — `gamut.ts:53` (`export function deltaEOK`), re-exported via
`dispatch.ts:51` (`export { deltaEOK, isInSRGBGamut, DELTA_E_OK_JND }`) and through the barrel. The
JND constant `DELTA_E_OK_JND` ships beside it. **kf is currently UN-consuming it** (census §6:
`deltaEOK` has 4 value.js-src + 1 demo + 1 test consumers, 0 kf consumers). So the correctness
primitive for the harness exists and is published — the harness does NOT need net-new VJ color science.

**Where the harness lives — the split:**
- **The PRIMITIVE is value.js** (`deltaEOK` — shipped) + the oklab conversion/interp it tests against
  (`interpolate.ts` `lerpColorValue`, the conversions/ tree). value.js OWNS the color-science ground
  truth.
- **The HARNESS is kf** — it is a kf-specific conformance claim: "kf's midpoint color (its
  perceptual-oklab interp output) vs CSS Color 4's defined interpolation, measured in ΔE_OK." It tests
  KF's curve, consumes value.js's `deltaEOK` as the ruler, and is published as the kf benchmark
  (K-SEED ED-4: "the one benchmark only kf can publish honestly"). It lives in the **kf** repo
  (the proof corpus is kf's), consuming the value.js primitive across the package boundary.

**Allocation verdict:** ED-4 is **kf harness consuming value.js's already-shipped `deltaEOK`.** The
one action: kf should **consume `deltaEOK`** (it is the ΔE ruler for both ED-4 AND the CC-2 densify
pixel-proof gate). This is item **KF-DELTAE** below (VJ→KF-consume, S). No net-new value.js color work.

### ED-1 / ED-2 / ED-3 — agent surface, Vue adapter, dogfood inversion

**Wholly kf / distribution.** ED-1 (llms.txt + proof corpus) is kf's artifact; ED-2
(`@mkbabb/keyframes-vue`) is a NEW kf-adjacent adapter; ED-3 (demo consumes the published barrel) is the
kf package boundary. value.js has no half. **value.js half: NONE.**

**Allocation verdict:** ED-1/2/3 are **kf-KEEPS** (distribution). No value.js half.

---

## §7 — The value.js REFINE/UPGRADE ledger (independent of the frontier split, re-verified at HEAD)

These are value.js-internal upgrades the census surfaced; they enable or harden the frontier but are
not split across the seam (they are wholly VJ). Re-verified against `0.11.2`:

| Item | What | Verdict | Note |
|---|---|---|---|
| VJ-1 | Fold the **linear() string parser** into value.js — retire kf's `parseLinearStops` shim (`utils.ts:106`). value.js ships the `cssLinear` EVALUATOR (`easing.ts:33`) but NO string→`LinearStop[]` parser; `linear(t)` (`easing.ts:11`) is the trivial identity. | **DO** (KF→VJ fold) | The parse half is value-domain CSS-grammar work; it belongs beside `cssLinear`. kf collapses to a thin caller. |
| VJ-4 | Bound the **parse-cache memos** — `memoize` (`utils.ts:114,147-150`) HAS `maxCacheSize`+FIFO; every call site defaults `Infinity` (`parseCSSValueUnit`, `parseCSSColor`, `parseCSSStylesheet:514`, …). Fix is CONFIG not construction. | **DO** | S, not L (census correction). Long-lived-page hygiene; the ingestion frontier (K1 walks many sheets) makes it matter MORE. |
| VJ-6 | Refresh value.js's **parse-that pin** `^0.8.2` → `^0.9.0` (align to kf's `^0.9.0`). Confirmed skew at HEAD (`package.json`). | **DO-IF-MEASURED** | Internal to value.js (parse-that is bundled). Align + re-run the parser bench. |
| KF-CC1 | kf **consume `reverseAnimationShorthand`** (`animation-shorthand.ts:262`) for CC-1/K1 emit. Shipped, exported, kf-unconsumed. | **DO-IF-MEASURED** | The emit direction for the round-trip; zero VJ work. |
| KF-DELTAE | kf **consume `deltaEOK`** (`gamut.ts:53`) for ED-4 harness + CC-2 densify ΔE gate. Shipped, exported, kf-unconsumed. | **DO** | The ΔE ruler for two frontier items; zero VJ work. |
| VJ-CC2 | Net-new value.js **`sampleColorRamp`/`densifyOklab`** for CC-2 — N oklab() stop strings on the perceptual path (uses existing `lerpColorValue` + `gamutMapOKLab`). | **DO-IF-MEASURED** | The only net-new VJ COLOR work in the frontier; gated on the CC-2 pixel proof. |
| VJ-SO1 | Net-new value.js **scroll-grammar typed extractor + serializer** for SO-1 — `animation-timeline`/`-range`/`timeline-scope`/`animation-trigger` (the sibling HANDOFF). | **DO** | The one genuine net-new VJ GRAMMAR in the frontier; raw declarations already captured, typed extraction is net-new. |
| VJ-3 | value.js parse-path **diagnostics sink** (VJ-F2/LD-DIAG) — the K3 producer half. | **BOOK** | Speculative until a second consumer beyond kf-catch exists. |
| VJ-2 | **VJ-F1 arc-length path sampler** (motion-path/draw-svg route it OUT, BOOK it). | **DO** (if MorphSVG/numeric-MotionPath is elected) | The one real competitor-gap; still absent. NOT a frontier-K item but the geometry it unblocks (numeric motion paths) is K-adjacent. |
| KF-1 | kf **consume `lerpArray` (SoA)** (`math.ts:48`) in frame-compiler/interpFrames. | **DO-IF-MEASURED** | Bench-or-KILL; bites at K≥8, absent K=1. PHYS-B2's per-property velocity probe is a second potential consumer. |

---

## §8 — The synthesis: the seam after the frontier split

**The frontier's value-half is overwhelmingly already-published.** The K round-trip
(forward-ingest + backward-compile) rests on value.js's **complete stylesheet AST + serializer +
animation-shorthand round-trip** — all shipped in `0.11.2`, mostly kf-consumed. The frontier's net-new
value.js work is **exactly two grammar/color items** (VJ-SO1 scroll grammar, VJ-CC2 oklab ramp) plus
**one fold** (VJ-1 linear parser) plus **two kf-consumes of already-shipped exports** (KF-CC1
`reverseAnimationShorthand`, KF-DELTAE `deltaEOK`). Everything else is kf engine semantics.

**The boundary holds and is the better design where it contradicts the hypothesis:**
- **VALUES → value.js:** the scroll grammar (VJ-SO1), the oklab ramp (VJ-CC2), the linear parser
  (VJ-1), `deltaEOK` (consumed), `reverseAnimationShorthand` (consumed) — all CSS-value/color/grammar
  work, correctly value.js.
- **TIME → kf:** the CSS-compiler walker (CC-1), the CSSOM walk (K1), takeover (K2), composition
  honoring (WL2-B), the spring×blend physics (PHYS-C/B2/E), the scroll driver (SO-2/3), the
  diagnostics sink + harness (K3/ED-4) — all animation-semantic/DOM/temporal, correctly kf.
- **The two corrections stand:** spring MATH does NOT belong in value.js (PHYS re-confirms it — the
  physics is inseparable from the blend tier and interp stream it drives); the DOM-resolution middle is
  uncontested (K1's CSSOM walk is the kf-legitimate DOM half; the parse it feeds is value.js's).

**The single largest allocation insight:** the K-SEED frontier asked for a TOTAL round-trip, and the
value substrate for it is **already 90% shipped** — the census's "value.js's own trajectory is
aspirational and stalled (M never dispatched)" is true of M's PLAN, but the F-handoff substrate
(`0.11.2`) already contains the round-trip primitives the frontier needs. K plans against a SOLID
value-half, with four small, specific, well-bounded value.js deltas — not a value.js rewrite.
