# valuejs-boundary-judge — the kf↔value.js BOUNDARY verdict (the seam judge)

**Role:** THE BOUNDARY JUDGE for the kf↔value.js BOUNDARY-ALLOCATION fleet. Reads the four lane
docs (`valuejs-census.md`, `valuejs-frontier-allocation.md`, `valuejs-fold-in.md`,
`valuejs-fold-out.md`) + `K-SEED.md`, rules on every digest item, dedups cross-lane overlaps,
sequences the DOs, and emits the two seeds (the value.js next-tranche seed + the kf consume-edge
ledger). Written into the KF corpus; READ-ONLY on both source repos.

**Provenance + re-verification (NOT trusted from the lanes):** every load-bearing fact re-checked
at both repos' HEAD on 2026-06-10:
- value.js `0.11.2`, git HEAD `0cb5dd2` ("value.js 0.11.2 — parseCSSValueUnit empty-input
  contract"), parse-that pin `^0.8.2`, `exports` map = `{".": …}` ONLY (no subpaths).
- kf `tranche-j-dev`, pins `@mkbabb/value.js@^0.11.2` (installed `0.11.2`) + `@mkbabb/parse-that@^0.9.0`
  → the **pin skew is real and internal to value.js** (parse-that is value.js's bundled dep).
- value.js SHIPS + exports `lerpArray` (`math.ts:48`), `reverseAnimationShorthand`
  (`animation-shorthand.ts:262`), `deltaEOK` (`gamut.ts:53`) — **0 kf consumers each** (grep=0).
- value.js has `cssLinear` (`easing.ts:33`, the EVALUATOR) but **NO string `linear()` parser**;
  kf owns `parseLinearStops` (3 hits in kf `src/`).
- value.js has **ZERO** spring/decay code (`stiffness/damping/SpringProgress/decayRest` grep=0) and
  **ZERO** typed scroll grammar (`animation-timeline/CSSTimelineOptions/scroll()` in parsing/ = 0).
  kf owns `spring.ts`/`decay.ts`/`springLinearStops.ts`/`springTimingFunction.ts`.
- kf `src/` = `animation/` + `env.d.ts` ONLY — **no `src/units/`, no `src/parsing/`**. The
  stale-CLAUDE.md-tree corrections (FI-A "kf @keyframes grammar", FI-N "two normalize.ts") are
  CONFIRMED fiction; the grammar + DOM-resolution already live wholly in value.js.

**Date:** 2026-06-10.

---

## §1 — THE PRINCIPLE (charter law, the boundary refined against what the lanes found)

> **value.js owns VALUES; keyframes.js owns TIME — and the two contested questions resolve
> ASYMMETRICALLY in favor of reality, not the hypothesis.**
>
> **value.js (VALUES)** owns the parse↔serialize round-trip of CSS values, units, colors, the
> animation shorthand, and the stylesheet/@keyframes AST; unit conversion + DOM-aware computed-value
> resolution; color science (oklab/ΔE/gamut/mix); easing/bezier MATH and its `linear()` evaluator;
> the interpolation kernels (`lerp`/`lerpArray`/`lerpValue`/`lerpColorValue`); and the CSS grammars
> (via parse-that, value.js's bundled dep). **keyframes.js (TIME)** owns animation semantics —
> frame compilation, playback/scheduling, group/sequence/stagger orchestration, the WAAPI/CSS-compile
> delegation tiers, DOM write strategies, the CSSOM walk, and the physics that schedules motion.
>
> **The GRAMMAR question is settled in value.js's favor and ALREADY SHIPPED:** every CSS grammar —
> @keyframes, the animation shorthand, the stylesheet AST, the value/color parsers — lives in
> value.js and kf consumes it (kf has NO grammar). kf's identity is not "owns the @keyframes grammar"
> but "owns the round-trip SEMANTICS" (`parse → compile-to-frames → play → serialize`). New CSS
> grammar (the `linear()` string parser, the scroll vocabulary) is value.js's by this law, NOT kf's.
>
> **The DOM-DEPENDENCE question is settled and UNCONTESTED:** there is exactly ONE `normalize.ts`
> (value.js's, 494 LoC) and value.js ALREADY accepts DOM-dependence (reads `getComputedStyle`,
> installs a resize listener). So DOM/SVG dependence is NOT a value.js fold-blocker — the arc-length
> path sampler (needs `getTotalLength()`) can live in value.js. The kf-legitimate DOM half is the
> CSSOM/`getAnimations()` WALK + the write strategy; the PARSE of whatever the walk extracts is
> value.js's. The "contested middle" is a phantom of the stale tree.
>
> **Where the hypothesis was WRONG, reality is the better design (two permanent corrections):**
> (1) **SPRING/decay MATH does NOT belong in value.js.** value.js ships none; kf owns it entirely;
> glass-ui already consumes the spring FROM kf — moving it INVERTS an established cross-repo edge for
> zero functional gain. Physics rides the time engine that schedules it. (2) **animation-composition
> add/accumulate is NOT a value.js `accumulate()` primitive** — it is iteration-stacking (a TIME
> concept) coupled to kf's frame/blend model, with exactly one consumer. Both are TIME, not VALUE.
>
> **The cross-seam discipline (the I lesson, non-negotiable):** every cross-repo edge is a PUBLISHED
> consume, born-RED-gated kf-side. No vaporware parks; no kf-side patching of value.js logic; no fold
> that is tidiness-not-value (the >1-real-consumer-OR-structural-win bar). value.js's own trajectory
> (the doc-lineage M → v1.0.0) is **aspirational and stalled** (M never dispatched); the live
> substrate K plans against is `0.11.2` = F-handoff + two patches, and its round-trip half is
> **~90% already shipped**.

---

## §2 — RULINGS (every digest item: uphold/override, dedup, with reason)

The digest carried **44 rows** across five source sections with heavy intentional cross-lane
overlap. Deduplicated to **17 canonical items** below; each names its canonical owner-lane and folds
the duplicate rows. Verdicts use the disposition vocabulary. All UPHELD unless flagged OVERRIDE.

### The canonical DOs (work that ships)

- **[VJ-1] Fold the `linear()` string parser into value.js — UPHOLD · DO (S).** Canonical owner:
  **fold-in FI-1** (richest: adds the `cssLinearFromString` convenience-API + the K1 pull). Dedups
  census-VJ-1, frontier-VJ-1, fold-out-VJ-1/EF-3. value.js ships `cssLinear` (the evaluator,
  `easing.ts:33`) but NO string→`LinearStop[]` parser (re-verified grep=0); kf's `parseLinearStops`
  (`utils.ts:106-130`) does the string parse. The parse half is value-domain CSS-Easing-L2 grammar —
  it belongs beside the evaluator and the `LinearStop` type value.js already owns. Ripened by
  `linear()` Baseline (2026-06-11) and pulled by K1 (live CSSOM carries
  `animation-timing-function: linear(...)`). **The ONE genuine net-new kf→value.js FOLD in the
  frontier.** kf deletes ~30 LoC on consume.

- **[VJ-SO1] Scroll-grammar typed extractor + serializer — UPHOLD · DO (M–L).** Canonical owner:
  **frontier-allocation §3 / SO-1**. The ONE genuine net-new value.js GRAMMAR handoff. value.js
  already captures `animation-timeline`/`-range`/`-trigger` as RAW declarations in the stylesheet AST
  (`stylesheet.ts:17-21`) but has NO typed extractor (`applyLonghand` has no case for them; re-verified
  grep=0) and no `scroll()`/`view()`/range-phase value parsers. value.js gains `CSSTimelineOptions`
  {timeline/range/trigger} typed fields + the `applyLonghand` cases + the value parsers + the inverse
  serializer. Squarely value.js's grammar territory (it owns `animation-shorthand` + the AST). kf owns
  the `ScrollScene` driver consuming the typed shape (SO-2/3, KEEPS).

- **[VJ-CC2] `sampleColorRamp`/`densifyOklab` — UPHOLD · DO-IF-MEASURED (M).** Canonical owner:
  **frontier-allocation §1 / CC-2**. The ONLY net-new value.js COLOR work in the frontier. value.js has
  the per-pair `lerpColorValue` (`interpolate.ts:104`) + `gamutMapOKLab` but NO ramp sampler returning
  N `oklab()` value-strings on the perceptual path. `sampleColorRamp(from,to,n,{space,hueMethod}):
  string[]` beside `mix.ts` — pure color VALUE math. Gated on the CC-2 pixel proof (MEASURE-FIRST: the
  densified CSS must track the JS curve within ΔE). kf owns deciding N + the densify-emit + the gate.

- **[VJ-4] Bound the parse-cache memos — UPHOLD · DO (S).** Canonical owner: **fold-out §2 / VJ-4**.
  Dedups census-VJ-4, frontier-VJ-4, fold-out-VJ-4. The ledger's "build an LRU (L)" was a
  MISDIAGNOSIS: value.js `memoize` (`utils.ts:114,147-150`) ALREADY has `maxCacheSize` + FIFO eviction;
  every parse-cache call site defaults `Infinity` (`parseCSSValueUnit`, `parseCSSColor`,
  `parseCSSStylesheet:514`, …). **The fix is CONFIG (`{maxCacheSize: N}` at ~6 sites), not
  construction.** S, not L. Tripwire: K1 ingestion walks the whole CSSOM → makes unbounded caches a
  real hazard → land WITH or just-before K1.

- **[VJ-6] Refresh value.js parse-that pin `^0.8.2`→`^0.9.0` — UPHOLD · DO-IF-MEASURED (S).** Canonical
  owner: **fold-out §2 / VJ-6**. Re-verified skew at HEAD. parse-that is value.js's BUNDLED dep so the
  skew is internal to value.js's build (kf's `^0.9.0` governs nothing value.js-side). Align up + re-run
  the parser bench (must not regress) + confirm API-compat. Low urgency unless `^0.9.0` carries a fix.

- **[KF-1] Consume `lerpArray` (SoA) in `NumericAnimation` — UPHOLD · DO-IF-MEASURED→DO (S).** Canonical
  owner: **fold-out §1 / KF-1** (it RAN the bench and split the two hot paths — the sharpest read).
  Dedups census-KF-1, fold-out-KF-1. The fold-out lane's local bench (`node bench/numeric-soa.mjs`,
  2026-06-10) BITES: 0.52× at K=1 (SLOWER), 1.59× K=2, 2.61× K=4, 2.95× K=8, 4.57× K=16, 4.19× K=64.
  **The bench MET the bar** → DO, but **ONLY the `NumericAnimation` path** (already SoA-shaped:
  parallel `startVals`/`stopVals`, `numeric.ts:139-140`) — convert to `Float64Array` once in
  `buildSegment`, one `lerpArray` call + scatter in `at()`, **gated `keys.length >= 2`** (K=1 keeps
  scalar). **OVERRIDE the digest's `frame-compiler.ts`/`interpFrames` framing:** the CSS path is AoS
  over `ValueUnit[]` — consuming `lerpArray` there needs a Float64Array carrier = the
  ValueUnit-monomorphization ARCH-KILL neighborhood. **CSS path is OUT, permanently.** A HOT-PATH SWAP,
  not a dedup (nothing fully deleted — scalar `lerp` stays for K=1).

- **[KF-CC1] Consume `reverseAnimationShorthand` for CC-1/K1 emit — UPHOLD · DO-IF-MEASURED (S).**
  Canonical owner: **fold-out §1 / KF-2** (clearest on "it's a NEW emit shape, not a deletion").
  Dedups census-KF-2, frontier-CC-1's value-half, fold-out-KF-2, fold-in-FI-3. SHIPPED, exported,
  kf-unconsumed (re-verified grep=0); already emits `composition` (`:277`, relevant to WL2-B/CC-1).
  kf's `animationOptionsToString` hand-emits LONGHANDS (correct for the editor's per-property rows —
  KEEP); `reverseAnimationShorthand` is the SHORTHAND twin CC-1's compact mode + K1's round-trip-replay
  want. **The "measured" gate is PRODUCT, not perf:** land it when CC-1 actually needs the compact form
  (K.W3). Until then BOOK-for-K. **Reconcile FI-3's "retire duplicate emit grammar" framing: PARTIALLY
  OVERRIDE** — the longhand emitter is NOT retired (different surface), so this is additive, not a
  dedup; FI-3's deletion claim is downgraded to "additive new emit mode."

- **[KF-DELTAE] Consume `deltaEOK` for ED-4 harness + CC-2 ΔE gate — UPHOLD · DO (S).** Canonical
  owner: **frontier-allocation §6 / ED-4**. SHIPPED, exported (`gamut.ts:53` + `dispatch.ts:51` +
  barrel), kf-unconsumed (re-verified grep=0), `DELTA_E_OK_JND` ships beside it. The ΔE ruler for TWO
  frontier items (ED-4 color-fidelity harness + CC-2 densify pixel-proof). Zero net-new value.js color
  work. kf builds the harness (its proof corpus), consumes value.js's primitive as the ruler.

### The KEEPS (kf-local — no value.js half; the boundary holds)

- **[CC-3] Ineligibility vocabulary (the four refusals) — UPHOLD · DO (kf-local, S).** Canonical:
  **frontier CC-3**. The four refusals are statements about kf ENGINE capabilities (BlendMode, custom
  closures, oklab default, DOM-resolution). Not a shared enum; generalize `waapiIneligibleReason`. No
  value.js half.

- **[K1] Live-stylesheet CSSOM walk — UPHOLD · DO (kf-local DOM, M).** Canonical: **frontier K1**.
  ZERO net-new value.js: `parseCSSStylesheet`+`extractKeyframes`+`extractStyleRules` all exist +
  kf-consumed; `CSSKeyframesRule.cssText` emits exactly what `resolveKeyframes` eats. The CSSOM walk +
  per-sheet CORS try/catch + `animation-name`→rule linkage is the kf-legitimate DOM half. The emit-back
  side wants KF-CC1 (already allocated).

- **[K2] `adopt()` running-CSS-animation takeover — UPHOLD · DO (kf-local, L).** Canonical: **frontier
  K2**. Wholly kf: `getAnimations()` reads, `currentTime` continuity, the `commitStyles` precedence
  trap (kf solved the inverse at `waapi.ts:386-398`), phase reconstruction. Value-touch is entirely
  through K1's already-allocated consume. No value.js half. (Absorbs WL2-C overlap.)

- **[WL2-B] animation-composition honoring (add/accumulate) — UPHOLD · DO (kf-local, M).** Canonical:
  **frontier §4**. NO value.js `add`/`accumulate`/`composite` primitive (re-verified: `interpolate.ts`
  has only lerp kernels). The capture is already kf-side (`adapter.ts:120-126`); honoring it is reading
  that map in the rAF-accumulate + WAAPI-composite paths = engine wiring. The per-type arithmetic
  (`base+delta` / list-concat / spec-space color) is a few lines coupled to the frame/blend model. A
  value.js `accumulate()` would have exactly ONE consumer and inverts the boundary (TIME math into the
  VALUE substrate). Engine compositor semantics. No value.js half.

- **[SO-2/3] ScrollScene JS driver + sticky-synthesis — UPHOLD · DO (kf-local, L).** Canonical:
  **frontier §3**. Composes SHIPPED kf primitives (`SmoothProgress`, `decay`/`SpringProgress`,
  `snapDecay` J-FOLD). Pure animation semantics. No value.js half.

- **[PHYS-C/B2/E] Spring-driven blend / reseat / intensity-PRM — UPHOLD · KILL the fold (kf-local).**
  Canonical: **frontier §5 / census §5**. Re-confirms VJ-7. value.js has ZERO spring/decay (re-verified
  grep=0). The PHYS items PROVE the physics is inseparable from the engine: PHYS-C drives the
  weighted-blend tier (a kf compositor concept value.js has no notion of); PHYS-B2 finite-differences
  the kf interp stream; PHYS-E rides kf's single PRM gate. The boundary hypothesis is WRONG on spring
  MATH and reality is the better design. The one value.js TOUCH (PHYS-B2's `linear()` twin EVALUATION)
  is the already-consumed `cssLinear`. No new value.js work.

- **[ED-1/2/3] Agent surface / Vue adapter / dogfood inversion — UPHOLD · DO (kf-local, M).**
  Canonical: **frontier §6**. ED-1 (llms.txt + proof corpus) is kf's artifact; ED-2
  (`@mkbabb/keyframes-vue`) is a NEW kf-adjacent adapter; ED-3 (demo consumes the published barrel) is
  the kf package boundary. No value.js half.

- **[FI-2] kf hand-builds @keyframes in `format.ts` vs value.js `serialize.ts` — UPHOLD · DO-IF-MEASURED
  (kf-side, M).** Canonical: **fold-in FI-2** (the lane's headline NEW finding; re-verified: kf consumes
  0 of value.js's keyframe serializers, grep=0). value.js SHIPS `serialize.ts` (160 LoC) — the
  structural inverse of `parseCSSStylesheet`; kf re-derives per-stop `animation-timing-function` emission
  + `@keyframes NAME {…}` wrapping by hand. **The win is NOT LoC (it's near-wash) — it's the round-trip
  INVARIANT** (`parseCSSStylesheet ∘ serializeKeyframes = id` enforced by value.js's own test, not
  re-proven in kf; today two emitters drift). **value.js side is a NO-OP — already ships.** The "measure"
  is the round-trip EQUIVALENCE test (byte-match across `test/format.test.ts` + `test/editor-parsing.test.ts`),
  AND the I.W0 declared-value contract (`format.ts:147-158`) must survive cleanly or **BOOK it instead**.
  Gated kf-side, value.js-unblocked, K.W3-adjacent.

### The KILLs (no item — anti-bloat / fiction-correction)

- **[FI-A] kf @keyframes grammar fold-in — UPHOLD · KILL (fiction).** Re-verified: kf has NO
  `src/parsing/`, no @keyframes grammar; the grammar lives in value.js `stylesheet.ts` and is
  kf-consumed. **The fold already happened.** No item.

- **[FI-N] "two normalize.ts, map the split" — UPHOLD · KILL (fiction).** Re-verified: kf has NO
  `src/units/`. The DOM-aware resolution + layoutEpoch cache + `bumpLayoutEpoch` are wholly value.js's;
  kf consumes them opaque. **One normalize.ts.** No item. (Precedent carried to VJ-2: value.js already
  DOM-depends.)

- **[VJ-7] "Keep spring/decay in kf" — UPHOLD · KILL the fold (KEEP).** = PHYS-C/B2/E ruling above.
  Permanent. The only ≥2-consumer-gated future fold is the closed-form `decay` SAMPLER (clock-free) —
  no second consumer today.

- **[FI-4] springLinearStops/springTimingFunction fold — UPHOLD · KILL (KEEP in kf).** The emitter
  SAMPLES a `SpringProgress` solver (kf-local); you can't fold the emitter without the solver. The
  generic sliver (`LinearStop[]→string` formatting, 6 LoC) is below any fold bar — tidiness-not-value.

- **[FI-5] demo `timingCurveUtils` fold — UPHOLD · KILL (demo presentation).** `generateCurveSVGPath`
  samples a callable into an SVG polyline — pure presentation (flips Y for SVG); the one generic
  primitive (`CSSCubicBezier`) is ALREADY imported from value.js. No generic core. Demo/charting, not
  the value substrate.

### The BOOKs (recorded, tripwire-gated — no premature park)

- **[VJ-9] Total partial-input contract (B1 class) — UPHOLD · BOOK (tripwire: K1 dispatch, M).**
  Canonical: **fold-out §2**. The 0.11.2 cut was ONE function's empty-input contract; K1's "ingest
  arbitrary live CSSOM" is the fuzzer that demands every public parse entry go typed-empty/diagnostic,
  never cryptic-throw. Precondition for VJ-3. No consumer demands totality beyond shipped until K1.

- **[VJ-3] Diagnostics sink (producer half of K3) — UPHOLD · BOOK (tripwire: K.W0/K3 dispatch, M).**
  Canonical: **frontier K3 / fold-out §2**. NO `DiagnosticSink`/`onWarn` in value.js (re-verified
  grep=0). The SINK half is kf (`ResolvedKeyframes.diagnostics` + the rows; two — EMPTY_PARSE/
  UNKNOWN_TIMING_FN — already J-FOLD into J.W1). The PRODUCER half (value.js parse path emits
  structured warnings) stays BOOK — value.js can be honest by THROWING (kf catches per-sheet) until a
  second consumer beyond kf-catch exists. Pairs with VJ-9.

- **[VJ-2] Arc-length path sampler (VJ-F1) — UPHOLD · BOOK (tripwire: MorphSVG/numeric-MotionPath
  parity becomes a charter goal, L).** Canonical: **fold-out §2**. The ONE real competitor-gap, still
  absent (re-verified: no path geometry in value.js). HONESTLY sized **L** (SVG `d` grammar +
  per-segment arc-length integration — Béziers have no closed-form — + length→t inverse + elliptical
  arc). Right value.js home (geometry is a value kernel; DOM/SVG dependence is no blocker per FI-N
  precedent), but NO current kf workload pulls it — kf does the CSS-native `offset-path`/`getTotalLength`
  sweep. NOT speculative; land when MorphSVG-parity is elected.

- **[MCI-5] Identity-aware arity pad — UPHOLD · BOOK (tripwire: the wired `it.fails` witness flips a
  real regression, S–M).** Canonical: **fold-out §2**. value.js interp kernel pads mismatched function
  arities with identity (`translate(x)`↔`translate(x,y)`). The `it.fails` witness at kf
  `test/interpolate-anything.test.ts:242-256` IS the consume signal — already wired.

- **[VJ-5] `unflattenObjectToString(flat, out?)` out-buffer overload — UPHOLD · BOOK (tripwire: a kf
  GC-pressure bench on the emit path, S).** Speculative GC relief; no measured pressure. The K-SEED
  emit-heavy CC-1 compiler could be that workload — re-evaluate when CC-1's emit is benched.

- **[VJ-8] Subpath exports map — UPHOLD · BOOK, KILL-leaning for the kf axis (M).** Re-verified:
  value.js `exports` = `"."` only; `dist/` has subpath `.d.ts` but no entries. **kf does NOT want this**
  (it relies on its own LIGHT/HEAVY static/dynamic boundary, not value.js subpaths). Only matters for a
  tree-shaking consumer value.js doesn't currently have. Out of kf scope; not on the kf critical path.

**Net dedup:** 44 digest rows → 17 canonical items (8 DOs, 7 KEEPS incl. 4 KILLs-as-KEEP, 5 fiction/
tidiness KILLs collapsed, 6 BOOKs). No cross-lane contradiction survived; the lanes converged.

---

## §3 — SEQUENCING THE DOs (what rides which value.js slice; which kf consume-edges gate on which publish)

### The value.js publish waves (the producer side — see §4a for the seed)

- **VJ slice N (the immediate, ripe-now):** **VJ-1** (linear() parser — ripe, Baseline-pulled) +
  **VJ-4** (cache bound — config, K1-tripwired) + **VJ-6** (parse-that pin — hygiene). All S, no
  frontier-gating. These can publish as a `0.11.3`/`0.12.0` independent of K.
- **VJ slice N+1 (K-frontier-pulled, K.W2/W3-aligned):** **VJ-SO1** (scroll grammar, M–L — gates
  K.W2 ScrollScene) + **VJ-CC2** (`sampleColorRamp`, M — gates K.W3 CC-2 densify, MEASURE-FIRST on the
  pixel proof). These ship when K elects the frontier waves.
- **VJ slice N+2 / on-tripwire (BOOK→DO only when the named tripwire fires):** **VJ-9** (totality,
  K1) → **VJ-3** (diagnostics producer, K.W0/K3) → **MCI-5** (arity pad, witness) → **VJ-2** (path
  sampler, MorphSVG-parity) → **VJ-5** (out-buffer, GC bench). VJ-8 KILL-leaning, off-path.

### The kf consume-edges (the consumer side — each gates on a value.js PUBLISH; born-RED kf-side)

| kf consume | gates on value.js PUBLISH | when |
|---|---|---|
| **KF-1** lerpArray→NumericAnimation | NONE — `lerpArray` SHIPPED in 0.11.2 | RIPE NOW (bench bit; the one immediately-actionable kf consume) |
| **KF-DELTAE** consume `deltaEOK` | NONE — SHIPPED in 0.11.2 | RIPE NOW (gates ED-4 + CC-2 gate) |
| **VJ-1 consume** retire `parseLinearStops` | VJ-1 publish (slice N) | on VJ-1 ship — kf flips to `cssLinearFromString`, deletes ~30 LoC |
| **KF-CC1** consume `reverseAnimationShorthand` | NONE — SHIPPED in 0.11.2 | K.W3 (product-gated on CC-1 needing compact emit) |
| **FI-2** consume `serialize.ts` | NONE — SHIPPED in 0.11.2 | K.W3-adjacent, gated on the round-trip EQUIVALENCE test (or BOOK) |
| **VJ-SO1 consume** ScrollScene reads `CSSTimelineOptions` | VJ-SO1 publish (slice N+1) | K.W2 |
| **VJ-CC2 consume** densify-emit + ΔE gate | VJ-CC2 publish (slice N+1) | K.W3, MEASURE-FIRST |

**The decisive sequencing insight:** **three kf consume-edges are RIPE NOW** — `lerpArray` (KF-1,
bench-proven), `deltaEOK` (KF-DELTAE), `reverseAnimationShorthand` (KF-CC1, product-gated) — all
SHIPPED in 0.11.2, all kf-unconsumed (grep=0). The frontier's value-half is ~90% already published;
only **two** net-new value.js items (VJ-SO1, VJ-CC2) + **one** fold (VJ-1) gate the K frontier. K
plans against a SOLID value-half.

---

## §4 — THE TWO SEEDS

### §4a — The value.js next-tranche SEED (the VJ-side work, 3–5 waves — DEVELOPED in value.js's own tranche process)

> **Charter sentence:** *The next value.js slice completes the CSS round-trip's VALUE half for the kf
> Tranche-K frontier — folding in the symmetric `linear()` string parser, growing the typed scroll
> grammar and the perceptual-oklab ramp the round-trip needs, and hardening the parse substrate for
> arbitrary live-web CSS (bounded caches, total partial-input, a diagnostics producer) — every item
> pure VALUE-domain, DOM-tolerant where the geometry demands, and each gated on a PUBLISHED kf
> consume, never vaporware.*

- **VJ.W0 — RIPEN (S, no frontier gate):** VJ-1 (`parseLinearStops`/`cssLinearFromString` beside
  `cssLinear`) + VJ-4 (bound the parse-cache memos via `{maxCacheSize}` config) + VJ-6 (parse-that
  `^0.8.2`→`^0.9.0`, bench-gated). Publishes `0.11.3`/`0.12.0`. Unblocks the kf VJ-1 consume.
- **VJ.W1 — SCROLL GRAMMAR (M–L, K.W2 gate):** VJ-SO1 — `CSSTimelineOptions` typed extractor
  (`animation-timeline`/`-range`/`timeline-scope`/`animation-trigger` + `scroll()`/`view()`/range-phase
  parsers) + the inverse serializer. The one genuine net-new GRAMMAR. Unblocks kf's ScrollScene.
- **VJ.W2 — PERCEPTUAL RAMP (M, K.W3 gate, MEASURE-FIRST):** VJ-CC2 — `sampleColorRamp(from,to,n,
  {space,hueMethod}):string[]` beside `mix.ts`, reusing `lerpColorValue`+`gamutMapOKLab`. Gated on the
  kf CC-2 pixel proof. Unblocks kf's densify-emit.
- **VJ.W3 — SUBSTRATE TOTALITY (M, K1/K3 tripwires):** VJ-9 (total partial-input contract across every
  public parse entry) → VJ-3 (diagnostics PRODUCER channel). Land when K1 ingests arbitrary CSSOM
  (VJ-9) / K3 surfaces the channel (VJ-3). VJ-9 is VJ-3's precondition.
- **VJ.W4 — THE BIG ROCK (L, parity-gated):** VJ-2 — the arc-length path sampler (the real competitor
  gap). MorphSVG/numeric-MotionPath parity case. Also: MCI-5 (arity pad, witness-gated) + VJ-5
  (out-buffer, GC-bench-gated) ride here when their tripwires fire. VJ-8 (subpaths) KILL-leaning, off
  the kf path.

### §4b — The kf-side consume-edge LEDGER (each: the VJ publish it gates on + what kf DELETES, born-RED)

| kf consume | gates on | kf DELETES on consume | born-RED gate |
|---|---|---|---|
| **KF-1** lerpArray→NumericAnimation | SHIPPED 0.11.2 | nothing fully (scalar `lerp` stays for K=1) — HOT-PATH SWAP | a `keys.length>=2` bench-parity test that FLIPS GREEN only when the SoA path lands + a K=1 regression guard |
| **KF-DELTAE** consume `deltaEOK` | SHIPPED 0.11.2 | nothing (new capability) | the ED-4 color-fidelity harness born-RED (kf midpoint vs CSS Color 4, ΔE_OK) + the CC-2 pixel-proof gate |
| **VJ-1 consume** retire `parseLinearStops` | VJ-1 (VJ.W0) | `parseLinearStops` (~25 LoC) + `LINEAR_LITERAL` body in the resolver (~30 LoC total) | the `getTimingFunction` linear-branch test stays GREEN through the swap to `cssLinearFromString` |
| **KF-CC1** consume `reverseAnimationShorthand` | SHIPPED 0.11.2 | nothing (longhand emitter KEPT for editor; shorthand is a NEW mode) | CC-1's compact-emit replay-pixel-equality gate (the K.W3 product gate) |
| **FI-2** consume `serialize.ts` keyframe serializers | SHIPPED 0.11.2 | hand-stitch in `CSSKeyframeToString`/`CSSKeyframesToString` (~50 LoC), ADDS `framesToKeyframeRules` bridge (~25) — near-wash | the round-trip EQUIVALENCE test (byte-match across `format.test.ts`+`editor-parsing.test.ts`) — AND the I.W0 declared-value contract must survive or BOOK |
| **VJ-SO1 consume** ScrollScene reads `CSSTimelineOptions` | VJ-SO1 (VJ.W1) | kf's would-be ad-hoc scroll-decl parsing (never written — born clean) | the SO-1 scroll-grammar round-trip replay gate |
| **VJ-CC2 consume** densify-emit | VJ-CC2 (VJ.W2) | nothing (new capability) | the CC-2 densify pixel-proof (ΔE within JND vs JS curve) |

**The discipline restated:** every row is a PUBLISHED consume (no row gates on unpublished value.js
except VJ-1/SO1/CC2, which carry explicit VJ-side publish waves), born-RED kf-side. Three rows are
RIPE TODAY (KF-1, KF-DELTAE, KF-CC1 — all 0.11.2-shipped, grep=0 unconsumed). No park survives without
a named publish + a born-RED gate.

---

## §5 — THE ANTI-BLOAT PASS (tidiness-not-value, KILLED)

The seam's I-lesson: every cross-repo edge must be a PUBLISHED consume, born-RED-gated. Applied:

- **KILLED — FI-A (kf @keyframes grammar fold):** fiction; the grammar is already value.js's. Zero
  work; correcting the stale-tree premise IS the deliverable.
- **KILLED — FI-N (two normalize.ts split):** fiction; one normalize.ts, wholly value.js's. No split
  to map.
- **KILLED — FI-4 (`serializeLinearStops` 6-LoC helper):** below the fold bar — a `LinearStop[]→string`
  formatter is tidiness, not a structural win. The emitter rides the kf-local spring solver; KEEP.
- **KILLED — FI-5 (demo curve-SVG sampler fold):** demo presentation; the generic core
  (`CSSCubicBezier`) is already value.js's. A charting helper is not the value substrate.
- **KILLED — VJ-7 / PHYS spring-MATH fold (both directions):** the hypothesis is FALSE; folding spring
  into value.js INVERTS an established edge (glass-ui consumes spring FROM kf) for zero gain. Physics
  rides the time engine. Permanent.
- **KILLED — WL2-B `accumulate()` value.js primitive:** one consumer, coupled to kf's frame/blend
  model, TIME-not-VALUE (iteration-stacking). Inverts the boundary for no gain.
- **DOWNGRADED — KF-1 CSS-path `lerpArray` consume:** the digest's `frame-compiler.ts`/`interpFrames`
  framing breaches the ValueUnit-monomorphization ARCH-kill (the CSS path is AoS-by-design). Only the
  `NumericAnimation` SoA path consumes; CSS path is OUT permanently.
- **DOWNGRADED — FI-3 "retire the longhand emitter":** the longhand emitter serves the editor's
  per-property rows and is KEPT; KF-CC1 is an ADDITIVE shorthand mode, not a deletion. The
  "duplicate-grammar retirement" framing is half-true and trimmed to additive.
- **HELD off the kf critical path — VJ-8 (subpath exports):** kf does not want it (LIGHT/HEAVY boundary,
  not value.js subpaths). BOOK KILL-leaning; not a kf gate.

The respected ARCH KILLs (permanent, not re-litigated): WASM-parser, Typed-OM carrier,
ValueUnit-monomorphization. The respected K-SEED KILLs (VT-A/B, CE-2/3, EPF-2, SO-4, etc.) stand.

---

## §6 — THE VERDICT (one paragraph)

The boundary HOLDS, is CLEANER than the working hypothesis stated, and is the better design exactly
where it contradicts the hypothesis. Both contested questions resolve in reality's favor:
**grammar is value.js's and already shipped** (kf owns the round-trip SEMANTICS, not the grammar);
**DOM-resolution is uncontested** (one `normalize.ts`, value.js's, DOM-tolerant — so the path sampler
can live there too). The two hypothesis errors are permanent corrections: **spring/decay MATH and
animation-composition add/accumulate are TIME, not VALUE** — they ride the engine that schedules them,
and folding either inverts an established edge. The K frontier's value-half is **~90% already published
in 0.11.2** — the net-new value.js work is exactly **two grammar/color items (VJ-SO1 scroll grammar,
VJ-CC2 oklab ramp) + one fold (VJ-1 linear parser)**, plus substrate-hardening on tripwires (VJ-4 now;
VJ-9/VJ-3/VJ-2 K-gated). Everything else is kf engine semantics (CC-1 walker, K1/K2, WL2-B, PHYS,
SO-2/3, ED-1/2/3) or **three RIPE-TODAY kf consumes of already-shipped exports** (KF-1 lerpArray,
KF-DELTAE deltaEOK, KF-CC1 reverseAnimationShorthand — all 0.11.2, all grep=0 unconsumed). The seam is
disciplined: no accidental duplication, no vaporware park, every cross-repo edge a published consume
born-RED-gated kf-side. K plans against a solid value-half with four small, well-bounded value.js
deltas — not a value.js rewrite.
