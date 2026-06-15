# KF-TO-VALUEJS-GRAMMAR-ASKS — the kf-side OUTBOUND grammar ask (the dispatch: VJ.W1 scroll grammar + VJ.W2 perceptual ramp; the mirror of the inbound `VALUEJS-N2-ASKS.md`)

**Provenance:** authored 2026-06-15 by the kf Tranche-K Band-II FRONTIER-FOLD fleet (the
value.js-coordination lane). This is the **OUTBOUND** ask — the kf-side spec value.js's **post-N
tranche** consumes, the MIRROR of the INBOUND `VALUEJS-N2-ASKS.md` (which recorded the 0.12.0
edges kf consumes). It dispatches the **two genuine net-new grammar items** that gate K Band II's
scroll wave (K.W9) and the compile wave's oklab densify (K.W10's CC-2), per the binding charter's
acyclic-spine law. Evidence of record, kf side: `docs/tranches/K/K.md §value.js coordination`,
`docs/tranches/K/waves/K.W9.md`, `docs/tranches/K/waves/K.W10.md`, `docs/tranches/K/L-SEED.md §7`,
the inbound `docs/tranches/K/VALUEJS-N2-ASKS.md §3` (which RECORDED both items ABSENT in 0.12.0).

**The acyclic-spine law (charter-binding — `K.md §invariant set`).** value.js ships VALUES
(grammar, parse/serialize, color science, interp kernels); kf consumes ONE tranche behind,
born-RED-gated kf-side. The two items below land in value.js's tree (its own repo/authorization);
kf consumes them one tranche behind on the PUBLISH. **K's impl never blocks on an unpublished
symbol** — the kf source half (the K.W9 `ScrollScene` consumer / the K.W10 CC-2 densify consumer)
lands against the recorded born-RED, the consume edge lights when value.js publishes (the J.W7b
published-consume-edge idiom). **This dispatch is NEVER a `file:` link or a vendored copy** — it is
a PUBLISHED consume across the constellation spine. No cycle: value.js → kf (grammar); kf →
glass-ui (spring); no back-edge.

**Who consumes this:** value.js's post-N tranche. Tranche N (live on `tranche-f-handoff`) recorded
BOTH items for its post-N successor (`VALUEJS-N2-ASKS.md §3`, the value.js `X-KF.md §3.2/O5`); this
doc is the kf-side SPEC that successor consumes. It adds NO kf wave, re-litigates NO kf decision,
and duplicates NO kf spec — it is the outbound edge of the dispatch the charter names.

---

## §0 — The dispatch in one table (what kf asks, why now, the gate it lights)

| Ask | What value.js ships | The kf consume edge (the wave + the gate) | Status (registry-probed 2026-06-15) |
|---|---|---|---|
| **VJ.W1 SCROLL GRAMMAR** | the typed `CSSTimelineOptions` value extractor + inverse serializer (`scroll()`/`view()`/range-phase) — the typed VALUE grammar, NOT the property names | **K.W9** SCROLL-AS-CSS — `proof:scroll-roundtrip` clause (b) (the PARSE round-trip) | **OPEN** — DISPATCHED (§1) |
| **VJ.W2 PERCEPTUAL RAMP** | `sampleColorRamp(from, to, n, {space, hueMethod})` beside `mix.ts`, reusing `lerpColorValue` + `gamutMapOKLab` | **K.W10** COMPILE — `proof:compile-replay-equal` clause (d) (CC-2 oklab densify) | **OPEN** — DISPATCHED (§2) |

**The decisive ground truth (why these two, and ONLY these two).** value.js 0.12.0 (its Tranche N)
un-blocked FOUR of the six K frontier waves outright (`K.md §The frontier, un-blocked`); the RIPE
edges (`reverseAnimationShorthand` for K.W10's CC-1, `deltaEOK` for K.W12's ED-4 + CC-2's proof,
`ParseDiagnostic`/`OnParseError` for K.W7's channel, the path sampler for the MotionPath product)
ALL shipped (`VALUEJS-N2-ASKS.md §2`). The ONLY two genuine net-new grammar items remain OPEN —
the scroll VALUE grammar (VJ.W1) and the perceptual ramp (VJ.W2) — both confirmed ABSENT in 0.12.0
(`VALUEJS-N2-ASKS.md §3`, registry-re-probed below). This doc dispatches exactly those two.

---

## §1 — VJ.W1: the SCROLL GRAMMAR (gates K.W9 · the typed VALUE extractor, NOT the property names)

### §1.1 The precise gap (registry-probed 2026-06-15 — the value-grammar nuance)

value.js 0.12.0 ships the scroll-timeline property NAMES but NOT the typed scroll VALUE grammar.
The probe (against `node_modules/@mkbabb/value.js@0.12.0/dist/`):

- **PRESENT (the property names):** `STYLE_NAMES` (`dist/units/constants.d.ts:33`) lists
  `animationTimeline`, `animationRange`, `animationRangeStart`, `animationRangeEnd`,
  `timelineScope`, `scrollTimeline`, `scrollTimelineAxis`, `scrollTimelineName`, `viewTimeline`,
  `viewTimelineAxis`, `viewTimelineInset`, `viewTimelineName`. So value.js KNOWS these are CSS
  properties — it can name them in a flatten/extract.
- **ABSENT (the typed VALUE grammar):** `grep -rcE "CSSTimelineOptions|parseAnimationTimeline|rangePhase"
  node_modules/@mkbabb/value.js/dist/` → **ZERO**. value.js does NOT parse the `scroll()`/`view()`
  functions into typed options, does NOT parse `animation-range`'s `<range-phase> <percentage>`
  pairs into a typed range, and does NOT carry an inverse serializer for them. The
  `animation-trigger`/`timeline-trigger` 2026 layer (Chrome 145) is likewise unparsed.
- **The frontier-lane confirmation:** `../audit/frontier/scroll-orchestration.md §2` — "value.js's
  stylesheet extractor (`extract.ts:114-176`) already parses `animation-name`, `-duration`, …,
  `-composition`, AND the `animation:` shorthand. It does NOT parse `animation-timeline`,
  `animation-range`, `scroll()`/`view()` functions, `timeline-scope`, or the new `animation-trigger`
  / `timeline-trigger`. That is the precise, bounded grammar subset kf would add."

**So the ask is the typed VALUE extractor + inverse serializer over property names value.js already
knows** — not net-new property registration, but the typed parse/serialize of their VALUES.

### §1.2 What kf asks value.js to ship (VJ.W1 — the bounded grammar subset)

A typed `CSSTimelineOptions` extractor + its inverse serializer, beside the existing
`animation-shorthand`/`extract` grammar (where the `animation-*` value parsing already lives):

1. **`animation-timeline` value parse** — `scroll(<scroller> <axis>)` and `view(<axis> <inset>)`
   into a typed `CSSTimelineOptions` (the scroller/axis/inset, the named-timeline reference, the
   `auto`/`none`/`<dashed-ident>` cases). The MDN `animation-timeline` grammar.
2. **`animation-range`** — `<range-phase> <percentage>` pairs (`entry 0% cover 40%`,
   `cover`/`contain`/`entry`/`exit`/`entry-crossing`/`exit-crossing` + the bare `<length-percentage>`
   forms) into a typed range. The `rangePhase` type the probe confirmed absent.
3. **`timeline-scope`** — the `none`/`all`/`<dashed-ident>#` hoist list.
4. **`animation-trigger` / `timeline-trigger`** (the 2026 Chrome-145 discrete layer) — the
   `<single-animation-trigger>` (`play-forwards`/`play-backwards`/`play-once`/`alternate`/`repeat`/
   the `<dashed-ident>` reference) + the `timeline-trigger`'s `<timeline> <range>` exit/entry phases.
   This is forward-looking (the WG is still shipping it); value.js partitions it as a sub-item it may
   land after the scroll-timeline core.
5. **The inverse serializer** — emit each of the above BACK from the typed options to valid CSS (so
   kf's `format.ts` round-trip — the K.W9 SO-1 serialize half — has a faithful value.js producer to
   call; the serialize-from-template authority `format.ts:155` round-trips the declaration VERBATIM).

**The value.js seam (where it lands):** beside `extract.ts`/`animation-shorthand.ts` (where the
`animation-*` value parsing already lives); the typed `CSSTimelineOptions` mirrors the existing
typed `animation` options shape. **MEASURE-FIRST is NOT applicable** (this is a CORRECTNESS grammar,
not a perf claim — `../audit/frontier/scroll-orchestration.md §2` "none for the parse itself
(correctness, not perf)").

### §1.3 How kf consumes it (the acyclic-spine handling — born-RED-gated kf-side)

- **The kf source half lands NOW (born-RED against the recorded absence).** K.W9's `ScrollScene`
  driver + the dispatch matrix + the `position:sticky` pin synthesis are value.js-INDEPENDENT (they
  compose the SHIPPED `SmoothProgress`/`decay`/`SpringProgress`/`ScrollTimeline`/
  `attachNativeScrollTimeline`); they land and GREEN their gate clauses (a)/(c)/(d) on K.W7's
  substrate WITHOUT VJ.W1. The consumer that CALLS `CSSTimelineOptions` lands born-RED against the
  recorded VJ.W1 absence — `proof:scroll-roundtrip` clause (b) (the PARSE round-trip) REDS until
  value.js publishes.
- **The consume edge LIGHTS on the publish.** When value.js ships VJ.W1, kf's K.W1-style re-pin
  consumes the `CSSTimelineOptions` extractor one tranche behind; clause (b) greens. NEVER a `file:`
  link to value.js's WIP tree, NEVER a vendored copy of the grammar (the acyclic-spine invariant's
  named forbidding — `K.md §invariant set`).
- **K's impl never blocks.** SO-2/SO-3 + clause (a)/(c)/(d) run on K.W7's substrate regardless;
  only the PARSE (clause b) waits for the publish (`K.md §value.js coordination`: "K can authorize
  and run Band I + the un-blocked frontier while value.js ships the two grammar items in its own
  interval — the same acyclic cadence value.js's 0.12.0 just demonstrated").

---

## §2 — VJ.W2: the PERCEPTUAL RAMP (gates K.W10's CC-2 · `sampleColorRamp`)

### §2.1 The precise gap (registry-probed 2026-06-15)

`grep -rcE "sampleColorRamp" node_modules/@mkbabb/value.js@0.12.0/dist/` → **ZERO**.
`sampleColorRamp` is ABSENT in 0.12.0 (`VALUEJS-N2-ASKS.md:61` — "VJ.W2 `sampleColorRamp` … the two
genuine L gates remain net-new and un-scheduled … both confirmed ABSENT in 0.12.0"). value.js DOES
ship the kernels `sampleColorRamp` would reuse: `lerpColorValue` (the per-step perceptual lerp),
`gamutMapOKLab`/`gamutMap` (the egress mapping — `VALUEJS-N2-ASKS.md §2 row 7`), and `deltaEOK` (the
perceptual-distance kernel kf's CC-2 ΔE proof consumes — `VALUEJS-N2-ASKS.md §2 row 12`, the
§State-verified `.d.ts` grep printed `deltaEOK`). So the producer is a COMPOSITION over shipped
kernels, not net-new color science.

### §2.2 What kf asks value.js to ship (VJ.W2 — the ramp sampler)

`sampleColorRamp(from, to, n, { space, hueMethod })` beside `mix.ts`:

- **Signature:** `(from: Color, to: Color, n: number, opts: { space: "oklab" | "oklch" | …;
  hueMethod: "shorter" | "longer" | "increasing" | "decreasing" }) → Color[]` — N intermediate
  color stops sampled along the perceptual interpolation from `from` to `to`.
- **Reuses:** `lerpColorValue` (the per-step lerp value.js already ships) + `gamutMapOKLab`/`gamutMap`
  (the egress mapping, so each emitted stop is in-gamut — no silent sRGB clip). The `hueMethod`
  controls the hue path (the thing bare two-stop `@keyframes` cannot encode —
  `../audit/frontier/css-compiler.md §3c`).
- **MEASURE-FIRST (the value.js-side discipline):** `K.md §value.js coordination` — "reusing
  `lerpColorValue` + `gamutMapOKLab` (MEASURE-FIRST)"; value.js measures the sampler against its
  existing `mix.ts` path before shipping (no perf regression on the per-step lerp).

### §2.3 How kf consumes it (the acyclic-spine handling — the densify is a WIDENING, not a blocker)

- **The kf source half lands NOW (born-RED against the recorded absence).** K.W10's CC-2 oklab
  densify consumer (which CALLS `sampleColorRamp` to bake N `oklab()` stops) lands born-RED against
  the recorded VJ.W2 absence — `proof:compile-replay-equal` clause (d) (the densify) REDS until
  value.js publishes.
- **UNTIL the publish, K.W10 is GREEN via the honest REFUSAL.** This is the critical acyclic-spine
  nuance for VJ.W2: CC-3's perceptual-oklab REFUSAL is the FALLBACK — a color-interpolating
  animation REFUSES honestly ("perceptual oklab interpolation has no faithful @keyframes
  equivalent") until the densify lands. So the densify is a WIDENING that lights on VJ.W2's publish,
  NOT a blocker that reds the wave. CC-1 core + CC-3 refusals + the four-refusal report are RIPE
  (`reverseAnimationShorthand` shipped) and GREEN on K.W7's substrate WITHOUT VJ.W2.
- **The proof kernel is RIPE even while the producer is OPEN.** CC-2's ΔE-ε ship-vs-refuse PROOF
  consumes the RIPE `deltaEOK` (already shipped 0.12.0); only the densify PRODUCER (`sampleColorRamp`)
  is OPEN. So the moment value.js publishes `sampleColorRamp`, kf's densify consumer lights AND its
  ΔE proof is ready (the proof gate decides ship-vs-refuse on the published producer).
- **The consume edge LIGHTS on the publish.** NEVER a `file:` link, NEVER a vendored `sampleColorRamp`
  (the acyclic-spine invariant). K's impl never blocks — CC-1/CC-3 run regardless; only CC-2's
  densify waits, and the wave is green via the refusal until then.

---

## §3 — What this dispatch does NOT ask (the boundary held)

- **NOT the scroll DRIVER.** The `ScrollScene` JS driver (SO-2), the dispatch matrix, the
  `position:sticky` pin synthesis (SO-3) are kf's OWN (they compose shipped kf primitives —
  `SmoothProgress`/`decay`/`SpringProgress`/`ScrollTimeline`). value.js ships the VALUE grammar
  (the typed `CSSTimelineOptions` parse/serialize); kf owns TIME (the driver, the dispatch, the
  pin). The boundary principle (`../L-SEED.md §7`): "value.js owns VALUES … keyframes.js owns
  TIME." NOT a value.js scroll driver.
- **NOT the spring/decay math.** Spring/decay stays in kf PERMANENTLY (the VJ-owns-spring-math
  hypothesis was researched-FALSE — value.js ships zero spring/decay code; glass-ui consumes spring
  FROM kf — `../L-SEED.md §7`). The K.W9 snap (`decayRest` + `SpringProgress`) and the K.W11
  physics are kf's, NOT a value.js ask.
- **NOT the color INTERPOLATION kernels.** `lerpColorValue`/`gamutMapOKLab`/`deltaEOK` are SHIPPED
  (kf consumes them RIPE); VJ.W2 is ONLY the `sampleColorRamp` COMPOSITION over them, not net-new
  color science.
- **NOT VJ-9 full partial-input totality.** The K.W8 ingest robustness widening (VJ-9) is a recorded
  TRIPWIRE on the inbound `VALUEJS-N2-ASKS.md §3`, NOT a net-new ask here — value.js already
  recorded it; the ingest ships on the shipped partial contract and widens on VJ-9's publish.
- **NOT the easing-editor primitive.** The U27/U8 easing-editor hand-off (kf as DONOR → glass-ui
  first-class) is a GLASS-UI ask, seeded value.js-side (`VALUEJS-N2-ASKS.md §4`), NOT a kf→value.js
  grammar ask. The curve MATH substrate value.js KEEPS (`CSSCubicBezier`/`bezierPresets`/etc.); the
  editor COMPONENT is glass-ui's; kf KEEPS time/playback. Three-way ownership, no overlap with this
  dispatch.

---

## §4 — The cadence (the dispatch does not block K's authorization)

Per `K.md §value.js coordination`: **"The dispatch does not block K's authorization."** Band I
(K.W0–K.W6) is value.js-grammar-INDEPENDENT and leads; Band II's W7/W8/W11/W12 are un-blocked
today (RIPE consumes); only **W9 (VJ.W1) and W10's CC-2 (VJ.W2)** light on the publish. K can
authorize and run Band I + the un-blocked frontier while value.js ships the two grammar items in
its own interval — the same acyclic cadence value.js's 0.12.0 just demonstrated (it shipped the
four un-blocking edges in its Tranche N without kf blocking on them).

value.js's post-N tranche reconciles these against its then-current `value.js/docs/tranches/N/
PROGRESS.md` (Tranche N recorded both items for its post-N successor — `VALUEJS-N2-ASKS.md §3`).
The 0.12.0 RIPE edges (`lerpArray`, `deltaEOK`, `reverseAnimationShorthand`, `ParseDiagnostic`,
the path sampler) + the N2 witness-flip slate are K.W1/K.W6/K.W7/K.W10/K.W12 consumes, ALREADY
shipped. The acyclic spine holds: value.js publishes grammar; kf consumes one tranche behind; no
cycle, no contention, no `file:` link.

---

## §5 — Status ledger (for value.js's re-anchor at its post-N open)

| VJ item | What | Status | The kf consume edge | Born-RED-gated kf-side? |
|---|---|---|---|---|
| **VJ.W0 RIPEN** | E1/E2 parsers, LRU bound, parse-that `^0.9.0`, VJ-1 by composition | **LANDED** (0.12.0) | K.W1 re-pin + K.W6 DL exits | n/a (shipped) |
| **VJ.W1 SCROLL GRAMMAR** | the typed `CSSTimelineOptions` extractor + inverse serializer | **OPEN — DISPATCHED (§1)** | K.W9 `proof:scroll-roundtrip` (b) | YES — source half lands born-RED; PARSE edge lights on publish |
| **VJ.W2 PERCEPTUAL RAMP** | `sampleColorRamp` beside `mix.ts` | **OPEN — DISPATCHED (§2)** | K.W10 `proof:compile-replay-equal` (d) | YES — source half lands born-RED; densify edge lights on publish; GREEN via refusal until then |
| **VJ.W3 SUBSTRATE TOTALITY** | VJ-9 full partial-input + the diagnostics producer | **PARTIAL** (producer shipped; full totality open) | K.W7 channel (RIPE) + K.W8 VJ-9 tripwire | n/a (RIPE consume + recorded tripwire) |
| **VJ.W4 THE BIG ROCK** | the path sampler + MCI-5 + VJ-F4 | **PARTIAL** (sampler+tangent shipped; MorphSVG product is kf's) | K.W6 DL-K21 exit (RIPE) | n/a (RIPE consume) |

**The acyclic spine holds.** value.js publishes VALUES; kf consumes ONE tranche behind,
born-RED-gated kf-side; glass-ui consumes spring FROM kf. The two OPEN items (VJ.W1/VJ.W2) are
DISPATCHED to value.js's post-N tranche via this doc; K.W9/K.W10's consume edges light on the
publish. No cycle, no `file:` link, no vendored grammar.
