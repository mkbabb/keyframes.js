# value.js SOTA hand-off — a tranche-augmentation charter

**What this is.** A clean, top-level **hand-off charter** the value.js owner
formalizes: the consolidated FOLD-VALUEJS-HANDOFF items the keyframes.js Tranche E
deep-SOTA audit surfaced (30 lanes under `docs/tranches/E/audit/sota/`), de-duplicated
into one coherent proposed value.js tranche. It is **promoted** from the synthesis
lane (`audit/sota/_SYNTHESIS-valuejs-handoff.md`) + the keyframes-side E-HANDOFF
index (the `_SYNTHESIS-E-augmentation.md` §E-HANDOFF section) into the form the
value.js owner reads first: a headline, a proposed wave shape (each a falsifiable
gate + a perf rationale + an isomorphism note + the cross-repo edge to keyframes
**E.W9**), and the inv-16 compliance statement.

**inv-16 (hard — the whole point of this file).** This is a **HAND-OFF, not a
directive, not a write.** value.js is **dirty + active** — branch
`docs/constellation-grand-audit-2026-06-03`, **tranche M open** (post-L deep audit).
keyframes.js does **not** edit value.js. Every item below is a *proposal* the
value.js owner sequences, scopes, accepts, defers, or re-scopes against value.js's
own tranche discipline. keyframes.js's paired FOLD-E work (the right-hand column of
§3) is owned by Tranche E (largely **E.W9**) and lands independently — most of it
consumes the published value.js surface unchanged. **This file is the only thing
this lane writes** (inv-16: write ONLY `docs/tranches/E/valuejs-sota-handoff.md`).

> Every cross-repo `file:line` cite below was re-grounded against the live value.js
> tree at synthesis time (`src/units/{normalize,interpolate,utils}.ts`,
> `src/units/color/index.ts`, `src/easing.ts`, `src/parsing/*`, `src/math.ts`). The
> six re-exec'd forward-SOTA lanes (`r-css-color` · `r-css-values` · `r-css-parsers`
> · `r-waapi` · `r-interpolation` · `r-cwv-perf`) **deepened** the wave structure
> and overturned nothing.

---

## 0. The headline — what value.js is, and where the gaps are

**value.js is at or ahead of SOTA on color science and spec breadth**, and the
parse-that engine under it is genuinely modern (mutable single-state, zero-alloc
leaves, an unused-but-real `dispatch`/packrat tier, and a real Rust/WASM CSS parser
~90% built — a benchmarked typed-AST Rust parser missing only the WASM bridge: no
`cdylib` crate-type and no `#[wasm_bindgen]` in any source file, per `r-css-parsers`
§6). The gaps are **not in the science** — they are in a handful of places the audit
names repeatedly and independently:

1. **The parse architecture is one SOTA generation behind its own engine.** The
   value.js grammar trials `any()` where parse-that ships O(1) `dispatch()`;
   materializes substrings where spans are free; and *reimplements* a CSS value layer
   that parse-that already ships scannerless and charCode-driven (`cssParser`). The
   faster machine exists in-tree, dormant. The forward-SOTA frame: every fast CSS
   parser (lightningcss, Servo `cssparser`, csstree, `@csstools`) shares
   **tokenize-once · token-stream · typed-value-per-property · borrow ·
   forgiving-no-throw · first-token dispatch** — value.js inverts four of the six,
   while parse-that's own `parsers/css/` (`scan.ts`+`value.ts`) *already hand-writes
   the exact single-pass first-char-dispatched reader the field converged on*. The
   move is **"adopt the shape parse-that already proved," not "invent a tokenizer."**
   The **90%-built Rust/WASM parser** is unbuilt scaffolding for WASM — and even built,
   WASM pays off only for whole-stylesheet ingestion, not the per-token keyframes
   workload (marshalling dominates). And a shipped `console.error` **leaks on the
   custom-color-name path** (every parse of a registered custom color name spams a
   formatted ANSI error tree). (Wave A + F7.)

2. **The per-frame interpolation hot path crosses into value.js and pays for it.**
   The computed-unit endpoint resolution (**the real D-3 win lives HERE**), the
   megamorphic `ValueUnit` carrier, the `Color.toString()` 3-array/73-char
   serialization, and the per-channel `unwrapDeep` re-walk are all value.js-owned, all
   per-frame, and all re-derive an invariant in the inner loop — the one discipline
   the rest of this stack has surgically eliminated everywhere else. (Waves B + C + D.)

3. **A few real spec/correctness gaps:** the `linear()` parser (the evaluator exists,
   the parser does not — and the round-trip is severed on **both** ends, kf's
   `getTimingFunction` has no `linear()` branch either); exactly **24 of the 43**
   declared length units silently no-op in `convertToPixels` (the whole `sv*`/`lv*`/
   `dv*` family + `vi`/`vb`/`cap`/`ic`/`lh`/`rlh` — `50dvh`→`50px`); the `calc`
   result-type heuristic mis-types real dimensional algebra; a family of
   context-dependent color keywords (`currentColor`/`light-dark()`/system colors/
   `contrast-color()`) that resolve at use-time but do not parse at all; the unbounded
   memo caches; the `@property` `syntax`/`inherits` lossless round-trip; and the
   `AnimationOptions → CSSAnimationOptions` rename seam kf has never executed.
   (Waves C5 + E + F.)

**The cross-repo edge that defines this hand-off.** The keyframes computed-unit perf
(kf's D-3 / E-RT-4, the headline of kf E.W9's color/platform adoption) cannot land
its full win **without** the value.js `normalize`/`interpolate` change. keyframes can
cache resolved endpoints on its own seam (FOLD-E), but the *memo, the round-trip, and
the `toString()` key* live in value.js. **The real D-3 win lives here** (Wave C).

---

## 1. The proposed waves

Ordered by leverage × isomorphism-safety. Each is a coherent unit the value.js owner
can adopt, defer, or re-scope. Each item carries a **falsifiable gate**, a **perf
rationale**, an **isomorphism** note, and the **cross-repo edge** to keyframes E.W9
where one exists.

### Wave A — Parse-time fast tier (dispatch · spans · single-pass · diagnostics)

The biggest *structural* parse win, fully isomorphic, leveraging primitives
parse-that already ships.

| # | Item | Where (value.js) | Falsifiable gate | Iso |
|---|------|------------------|------------------|-----|
| **A1** | Replace speculative `any()` fronts with O(1) first-char `dispatch(table)` at the color/value/function/math forks — the SOTA "dispatch before attempting a production" invariant. **65 `any()` sites** in `src/parsing/*`; a `12px` length re-enters `utils.number` up to **7×**, a `#fff` hex tries `colorMix`→`colorFunction` before reaching `#`. The dispatch table *is* parse-that's own `parseSingleValue` switch (`parsers/css/value.ts:11-87`) | `color.ts:556`, `units.ts:78`, `index.ts:224,235`, `math.ts` fn-set | parse-output **deep-equal** vs current over the full value.js + kf `parsing`/`units`/`editor-parsing` corpus; bench the color/value hot loop (largest single win) | **Isomorphic** — dispatch selects the *same* parser `any` would reach; priority preserved inside each bucket (`srgb-linear` before `srgb`, `infinity`/`-infinity` inside their sub-parser) |
| **A2** | Single combined unit regex + `Set` classification, replacing `any(...UNITS.map(istring))` per dimension | `units.ts:20-26`; `LENGTH_UNITS` 43 entries `units/constants.ts:42` | round-trip equivalence + a **longest-match** test (`vmin` vs `vmax` vs `vb`, `svw` vs `s`) | **Perf + a latent correctness fix** — sequential `istring` can match a prefix unit before the longer one; maximal-munch is more correct |
| **A3** | Span/charCode leaves where substrings are materialized then immediately consumed (number-parse, unit-classify, keyword-match) — the *no-tokenizer* root; the stylesheet path re-scans twice (`balancedText` then `CSSValues.Values` re-parses the substring, `stylesheet.ts:212`) | `leaf.ts:213`; `utils.ts:14,16`; uses `regexSpan`/`stringSpan` already in `span.ts` | output value-equal; allocation-rate drop on large keyframe sheets | **Isomorphic** — only intermediate string garbage removed |
| **A4** | Inline comment-skip during whitespace consumption, replacing the `stripCSSComments` whole-input regex pre-pass | `stylesheet.ts:87,516`; parse-that ships `skipWsAndComments` | identical AST; **error offsets stay true** (the pre-strip destroys offset fidelity) | **Isomorphic AST, *better* diagnostics** |
| **A5** | One shared `splitBalanced`/`containsDelimiter` replacing 4 bespoke balanced-scan loops | `stylesheet.ts:99,411`, `animation-shorthand.ts:11,210`, `index.ts:26` | identical splits on nested `var(--a, var(--b, calc(1px + 2px)))`; comma-free fast-path | **Isomorphic** (the no-delimiter short-circuit is the perf bit) |
| **A6** | **Numeric charCode fast-path in `parseCSSValueUnit`** for the dominant `<number><unit>`/bare-`<number>` shape `getComputedStyle` returns — A1/A3 **on the per-frame hot path**: the computed resolver re-parses a fresh string per tick for an animating `calc(100cqw - 100%)`, so dispatch/span wins cut per-frame allocation. Pairs with Wave C | `normalize.ts` (`parseCSSValueUnit(computed)` in `getComputedValue`); `units.ts` value grammar | **mandatory round-trip equivalence gate** — fast-path output **deep-equal** to grammar output (the one finding where a regression shows *in pixels*); per-frame parse-alloc drops | **Byte-identical for the shapes it claims**; everything else falls through to the grammar |

**Cross-repo edge (E.W9):** A6 cuts the per-frame parse cost of the computed-unit
resolver kf E.W9 leans on; the win compounds with Wave C's endpoint cache.

**The big strategic option (GAP-NAMED, owner-scoped — WASM DECLINED).** parse-that
ships a complete scannerless, charCode-driven CSS parser (`parsers/css/`,
`scan.ts`+`value.ts`, exported `cssParser`; `parseSingleValue` *is* the exact
first-char-dispatched single-pass reader A1/A3/A6 recommend) **and value.js imports
none of it** — it maintains a parallel, slower combinator reimplementation. Adopting
`cssParser` as the value layer (combinators retained for relative-color / Kelvin /
the `ValueUnit` mapping) is the single biggest elegance+perf lever, but it is a
**multi-week, parity-gated** transposition — sequence it *after* Wave A's cheap
isomorphic wins. The Rust→WASM tier (`rust/parse_that/`) is a **real typed-AST CSS
parser, benchmarked against lightningcss/`cssparser`/nom/winnow/pest** — but verified
**unbuilt for WASM** (no `cdylib`, no `#[wasm_bindgen]`; the `wasm-bindgen` in
`Cargo.lock` is a transitive dev entry). **Disposition: WASM DECLINED** — the SOTA win
is *architectural* (tokenize-once · dispatch · typed values · no re-scan), all
achievable in pure TS, all already hand-written in `parsers/css/`. **Adopt the TS
single-pass reader; do not compile Rust to WASM** (`r-css-parsers` §6,§9; `r-wasm` F1,F6).

**Do NOT add packrat** — `parser.ts:83 .memoize()` is a real packrat called nowhere;
it should *stay* unused. CSS value grammars are LL(1)-ish once first-char dispatch
(A1) removes the speculative `any()` retries, and packrat's per-parser `state.clone()`
can exceed the re-parse it saves on shallow grammars. **Dispatch obviates packrat** —
flagged so a future pass does not reach for it first (`r-css-parsers` §7).

**ALREADY-SOTA (do not touch):** the parse-that engine itself — mutable state,
zero-alloc `regex`/`string`/whitespace leaves, the identity-keyed result cache, the
at-rule dispatcher.

### Wave B — Color-interpolation hot path (the color hot-path serializer + output-space targeting)

A color property is **~40× a numeric property per frame**, and ~2/3 of that is
serialization, not science. Measured (node, built `dist`, 500k iters warm): hex sRGB
lerp = 98 ns; lerp + `toString` = **294 ns**; `Color.toString` alone = **191 ns**
emitting a **73-char full-precision** string the browser re-parses every frame.

| # | Item | Where (value.js) | Falsifiable gate | Iso |
|---|------|------------------|------------------|-----|
| **B1** | **Zero-alloc, fixed-precision color serializer** for the apply path (`toAnimationString`/`toCSSFast`; precision arg on `formatColor`); keep high-precision `toString` for round-trip/format | `color/index.ts:191-199` (3 arrays + join), `:18` `formatColor` | apply-path serialize ns drops; output ≤ ~28 chars (`oklab(54% 0.0962 -0.0928)`) vs 73 | **Sub-JND visible string change** — 4–5 sig-figs is ~10⁴× under `DELTA_E_OK_JND=0.02`; the rounded form is the *apply/WAAPI* serializer only |
| **B2** | **Output-space targeting** — serialize a stored-oklab color *as* a requested output space: compact `rgb()` for legacy-sRGB pairs, `color(display-p3 …)` for wide-gamut; decouple storage from emit space | `color/index.ts` `toString` + `outputSpace` option; `gamut.ts:299` exists | round-trip parity per space; legacy-sRGB pairs emit shorter `rgb()` the browser parses faster | **More isomorphic to platform** — CSS Color 4 §12 interpolates legacy↔legacy in sRGB by default; emitting in the source family is the conservative default |
| **B3** | **Channel-plan precompute** — extend `prepareInterpVar` to freeze a closure-free numeric channel plan; flatten `lerpColorValue` to a flat `for` over a numeric array | `interpolate.ts:57-104`, `:140-148` | byte-identical lerp output; per-frame closures/`unwrapDeep`/`keys()` realloc → 0; bench the ~85 ns floor | **Pure refactor — byte-identical.** Mirrors the `_lerp` precompute already there |
| **B4** | **Egress gamut target** — gamut-map to the egress RGB space's *own* gamut, not unconditionally sRGB; preserve wide-gamut outputs | `conversions/xyz-extended.ts:74`, `direct.ts:79,157` | a `color(display-p3 …)` animation stays in P3; identical on sRGB displays | **More isomorphic** — current sRGB-clip silently desaturates P3-only colors; `display-p3` Baseline 2023 |
| **B5** | **`interpolateHue` degree-domain overload** — drop the per-hue-channel `÷360 … ×360` round-trip; fold into B3's `isHue` plan | `interpolate.ts:73-81`, `dispatch.ts:234-268` | algebraically identical; per-hue div/mul/double-mod removed | **Isomorphic within FP epsilon**; bundle with B3 |

**Cross-repo edge (E.W9 — mechanism CORRECTED).** B1/B2 unlock kf's WAAPI native
color lift (kf E.W9 S4). `r-css-color` F5 **corrects** the old D-6 mechanism:
`background-color`/`color` are **NOT compositor-accelerated** (only `transform`/
`opacity`/`filter`/`backdrop-filter` are) — a WAAPI color animation runs on the
**main thread**, same as the rAF loop. The win is NOT thread-offload; it is that the
browser's native `<color-interpolation-method>` interp **eliminates value.js's
per-frame JS `lerpColorValue` + 73-char serialize + reparse churn**, and lets the UA
batch the style update in its own tick. B2's output-space targeting is what makes
the eligibility gate *match the platform default* — CSS Color 4 §12 interpolates
**OKLab for non-legacy / sRGB for legacy**, so emitting legacy pairs as `rgb()` is
what lets the UA's legacy-sRGB default match value.js's intent. kf E.W9 emits
non-legacy `oklch(...)`/`color-mix(in oklab,...)` endpoints + admits color only on a
`(colorSpace, hueMethod)` default-match; this hand-off provides the
`cssColorInterpKeyword(space, hueMethod)` + the L4-space-preserving non-legacy
serializer.

**ALREADY-SOTA (do not touch):** one-time space collapse at frame-prep (no per-frame
conversion); analytical Ottosson gamut map (**ahead of shipping browsers**);
premultiplied-alpha + `none`/NaN + four hue methods; XYZ-D65 hub + `DIRECT_PATHS`;
`deltaEOK`+JND; **the full L4/L5 functional color surface** (`oklab`/`oklch`/`lab`/
`lch`/`color()`/`color-mix()`, relative-color `from`, 15 spaces, wide-gamut,
`none`/`transparent`, runtime color-name registry — `r-css-color` SS1–SS8).

### Wave C — The computed-unit boundary (the REAL D-3 win — cross-repo edge)

**The headline cross-repo finding.** kf traced D-3 (the computed-unit DOM round-trip)
*into value.js* and correctly withheld it because the fix surface is value.js-owned.
The keyframes-side endpoint cache (FOLD-E, kf E.W9) removes the value.js memo call
from the hot path *for prepared vars*; this wave is the value.js half that makes the
memo *hit* cheap for the unprepared/external path AND fixes the layout-thrash +
staleness + unit-coverage correctness the round-trip carries. **kf consumes all of
this unchanged — `lerpValue` already dispatches through `iv._lerp`.**

The hot path, re-grounded live:
- `lerpComputedValue` calls `getComputedValue(start)` + `getComputedValue(stop)` **every
  frame** for every `var`/`calc` leaf (`interpolate.ts:28-29`).
- `getComputedValue` is `memoize`d but the **key is rebuilt every call**:
  `` `${value.toString()}-${getElementId(target)}` `` (`normalize.ts:195-196`) — two
  full `ValueUnit` serializations + two `Map` hashes + a `Date.now()` + a
  `WeakMap.get`, **per hit**, to retrieve an O(1)-invariant pair.
- The cold path writes inline style, `getComputedStyle().getPropertyValue` (a **forced
  synchronous layout flush**), then restores (`normalize.ts:159-168`) — one reflow per
  computed leaf per distinct expression.

| # | Item | Where (value.js) | Falsifiable gate | Iso |
|---|------|------------------|------------------|-----|
| **C1** | **Cache resolved `(newStart, newStop, newUnit)` on the `InterpolatedVar`** at `prepareInterpVar` time; per-frame `lerpComputedValue` collapses to a bare `lerp(cachedStart, cachedStop, t)`. Invalidate on `setTargets`/box-change | `interpolate.ts:17-40,140-148`; `units/index.ts:238` | **`proof:computed-frame`** — a `toString`/`getComputedStyle` **call-counter** bench asserting **O(1)-per-frame** (paid once at prepare) + a wall-time delta; the `setTargets` invalidation re-resolves | **Pixel-identical** — same resolved values, cached |
| **C2** | **Stable-identity memo key** — key on a per-`ValueUnit` monotonic id (or WeakMap-keyed cache) so a cache *hit* doesn't re-serialize via `toString()`. The fallback for the external/unprepared path | `normalize.ts:195`; `utils.ts` `memoize` | a cache hit pays **0** `toString()`; byte-identical resolved px | **Pixel-identical** — cheaper key |
| **C3** | **Batched resolve** — a `getComputedValue` entry that resolves a *set* of leaves against a target in one write→read pass, cutting cold-path reflows from N-per-target-per-frame to 1 | `normalize.ts:136-205` | forced-reflow count drops to ~0 steady-state, 1-per-target cold | **Pixel-identical** — same used-value math, batched |
| **C4** | **`ttl===Infinity` fast path in `memoize`** — skip the `Date.now()` read on every hit when no TTL set (`getComputedValue`'s case). Bundle with C2 | `utils.ts:125` | clock read elided on the `ttl===Infinity` path | **Identical** |
| **C5** | **`convertToPixels` length-unit coverage — fix the ~24 no-op units.** Exactly **24 of the 43** declared length units silently no-op: `convertToPixels` resolves only `em rem vh vw vmin vmax % ch ex` + the six `cq*`; everything else (`cap ic lh rlh vi vb` + the 18-member `sv*`/`lv*`/`dv*` family) falls to `convertAbsoluteUnitToPixels`, which **returns the raw number unchanged**. This is the **fill-the-`cq*`-pattern** path: `dv*`/`lv*` = `vw`/`vh` math against `innerWidth`/`innerHeight`; `sv*` uses `visualViewport`; `vi`/`vb` are writing-mode selections (the code *already* computes `isVerticalWritingMode` for `cqi`/`cqb`); `lh`/`rlh`/`cap`/`ic` are metric reads. **Add a fail-loud branch** for unrecognized relative units | `units/utils.ts:255-355`; decls `units/constants.ts:5-44` | a **full 39-unit endpoint-resolution test** asserting non-identity conversion (any unit returning `value` unchanged is a bug) — the cleanest falsifiable gate in the set | **Fixes *wrong pixels*** — `50dvh`→`50px` today (silent, worse than a parse failure). Baseline units (`sv*`/`lv*`/`dv*` shipped 2022–2023). WAAPI excludes computed units, so the only consumer is the rAF resolver |
| **C6** | **`COMPUTED_UNITS` classification decision** — should bare `vh`/`cqw` be `computed` (re-resolve per frame like `calc`) or compile-time-frozen? Today they bake to px at compile and go **stale on resize**, diverging from the WAAPI path. **Owner decides**; kf owns the matching resize contract (FOLD-E) | `units/constants.ts:54`; `normalize.ts:400-410` | named + tested contract: bare viewport units documented-frozen or re-resolve | **Behavior change on resize** (toward spec + WAAPI parity) — flag for owner |
| **C7** | **`getComputedValue` memo eviction/invalidation** — unbounded + never busted on resize (a `100vh` animation paints pre-resize pixels for the page's life). Bound + scope to a **layout epoch** (a generation counter bumped on `ResizeObserver`/`resize`) | `normalize.ts:136-205`; `utils.ts:97` `maxCacheSize` exists | resize busts the relevant entries; cache bounded under long-lived cycling | **More correct on resize**, stable otherwise |

**Cross-repo edge (E.W9 / FOLD-E).** kf caches resolved endpoints on its own seam +
owns the resize contract + a `proof:computed-frame` integration test + the doc-truth
fix (the WAAPI `vh`/`cqw`-block docstring is currently false — kf E.W7 S3 corrects
it). The one sentence that defines the edge: *keyframes' computed-unit perf depends on
the value.js normalize memo — the real D-3 win lives in
`value.js/src/units/{normalize,interpolate}.ts`, and keyframes consumes it without a
single edit because `lerpValue` already dispatches through `iv._lerp`.*

**ALREADY-SOTA (do not touch):** `shouldCache` on `isConnected`; `getElementId` via
`WeakMap`; the dispatch pre-resolution; **DOM-correct, writing-mode-aware
container-unit resolution** (`cqi`/`cqb` select inline/block — only the `sv*` *sibling
units* C5 covers are missing).

### Wave D — The interpolation carrier (the deepest structural change · named tranche, gated)

The largest *structural* per-var win, and the riskiest — it touches the
`InterpolatedVar` contract kf consumes, so it must be a **named value.js tranche, not
a drive-by**. The numeric hot path does `value.value = lerp(start.value, stop.value,
t)` — 3 reads + 1 write on a **6-field megamorphic** `ValueUnit` (`value, unit,
superType, subProperty, property, targets`), minted in many shapes → the IC at the
mutation site tends polymorphic/megamorphic → dictionary-style lookup.

| # | Item | Where (value.js) | Falsifiable gate | Iso |
|---|------|------------------|------------------|-----|
| **D1** | **Lean interpolation carrier** behind `prepareInterpVar` — one of: a monomorphic `{value:number}` cell; a parallel `Float64Array` of current values (densest, SIMD-amenable); or a frozen-shape `ValueUnit` variant minted at prepare so all interp-time units share one hidden class. `ValueUnit` reconstituted only at serialize. **Preserve the `lerpValue` signature** | `units/index.ts:7-20`; `interpolate.ts:97,143` | bench `lerpNumericValue` over a megamorphic population vs the monomorphic cell at K=1/8/64; the win must survive the cell→unit serialize indirection | **Pixel-identical** (storage only) — the serialize-boundary reconstitution must round-trip exactly |
| **D2** | **General typed-array interp primitive** — a `lerpArray(Float64Array, Float64Array, t, out)` the heavy path and kf's `NumericAnimation` substrate (FOLD-E) can both adopt | new value.js primitive | typed-array win decisive at large K, no regression at K≤4 | **Pixel-identical** |

**Cross-repo edge (E.W8 / FOLD-E).** D2's typed-array primitive is what kf's
`NumericAnimation` `Float64Array` substrate would adopt; kf E.W8 transposes
`NumericAnimation`'s SoA discipline up to `FrameCompiler` but deliberately stops at
the time index + slot map (it does NOT flatten the rich leaves — that is *this* wave).

**ALREADY-SOTA (do not touch):** the pre-resolved monomorphic `_lerp` dispatch
itself — the *carrier* it mutates is the issue, not the dispatch.

### Wave E — Easing & math spec-coverage (parsers for existing evaluators · the `linear()` parser)

The highest-leverage-per-line wins in the lane: the *math is already written*, only
the parse/wire bridge is missing.

| # | Item | Where (value.js) | Falsifiable gate | Iso |
|---|------|------------------|------------------|-----|
| **E1** | **`linear()` parser** → `LinearStop[]` feeding the existing `cssLinear` evaluator. The evaluator (`easing.ts:33`) is fully implemented and the `LinearStop[]` shape **already exists** (`easing.ts:28`); **no parser produces stops** — `linear(0, 0.5 25% 75%, 1)` falls to generic `handleFunc` and loses the input-position %s + the flat-segment form | `easing.ts:33`, `:28`, `index.ts:230` | `parseCSSValue("linear(…)")` → structured stops → `cssLinear`; round-trips kf's own emitted spring `linear(0, 0.234 4.17%, …, 1)` | **Additive** — degenerate `linear()` becomes structured; nothing regresses. **Baseline 2023-12-11.** Round-trip severed on BOTH ends — pairs with kf FOLD-E |
| **E2** | **`steps()` argument parser** → `{count, jumpTerm}` feeding `steppedEase`. Mirrors E1 | `easing.ts:293`; `animation-shorthand.ts:73` | parsed args round-trip to `steppedEase` | **Additive** |
| **E3** | **`cssLinear` flat-segment tie-break** — at a shared input the spec (Easing L2) returns the **last** matching point's output; current code returns the **left** (`easing.ts:95`) | `easing.ts:80-99` | `linear(0, 0.5 25% 75%, 1)` sampled at the shared input yields the later stop | **Non-iso only at a measure-zero shared-input sample** — effectively iso, befitting (spec) |
| **E4** | **Precomputed sample-spline + slope-gated cubic-bezier solver** (WebKit `UnitBezier` pattern) — 11-sample `X(t)` table once at construction, O(1) bracket, Newton (4) gated on slope ≥ 0.001 else binary-subdivide. Current: Newton (8) + a **64-iter bisection fallback** that fires on the curves that matter | `easing.ts:136-170` | same root within 1e-7, fewer iterations; bisection essentially never fires | **Isomorphic within tolerance** — more accurate + faster |
| **E5** | **calc dimensional-type fold (perf + correctness, one change)** — `evaluateMathFunction` re-walks the AST **twice** (`:288` + `inferResultUnit` `:488`, "first unit-bearing leaf"); mis-types `calc(100px / 2px)` → `px` (should be **unitless** 50). One annotated `{value, unit, superType}` fold implementing the L4 §10.10 type algebra removes the second traversal **and** fixes the heuristic | `math.ts:473,488,503-506` | an L4 type-algebra table test (`calc(100px/2px)===50` unitless, `calc(100%/2)===50%`); one traversal | **Befitting** — mostly iso; the *changed* outputs are currently **wrong**. **Cross-repo:** kf pairs frames by `(property, subProperty)` and the resolved unit drives `getComputedValue` dispatch — a mis-typed `calc` routes to the wrong branch |
| **E6** | **`env()` parser** (grammar/runtime drift) + **structured `var()` capture** (`{name, fallback}`, feeds Wave C) + **realign the BBNF `attrFn` to the L4 `type()` grammar** | `index.ts:224,:26-48`; `css-values.bbnf:82,85` | `env(--x, fallback)` parses; `var()` exposes name+fallback; BBNF `attrFn` reflects L4 | **Additive** (env); `var()` structure is opt-in; `attr()` BBNF is a doc-fidelity fix |
| **E7** | **`calc-size()` parser** → math-function set: a basis arg (`auto`/`min-content`/…) + a `<calc-sum>` over the `size` keyword. **Re-scoped BOOK→FOLD** — a *clean, bounded* extension of `createCalcParser` (`math.ts:48`); parsing a value ≠ requiring browser support. The *engine* side (animating `height`→`auto`) stays **GAP-NAMED** (its own wave) | `math.ts:48,200` | `calc-size(auto, size + 20px)` parses to a structured node; round-trips | **Additive** new capability. THE native primitive for the most-requested animation the library can't do (height→auto) |

**Cross-repo edge (E.W7 / E.W9).** E1's parser pairs with kf E.W7 S5 (the kf-side
`LINEAR_LITERAL` branch in `getTimingFunction` — the round-trip is severed on BOTH
ends and whole only when both land). E7's parser pairs with kf E.W9's GAP-NAMED
intrinsic-size engine path (native `interpolate-size` delegation or JS-measure
fallback — `interpolate-size`/`calc-size()` is **limited availability** Chrome/Edge
129, so the engine path is a guarded enhancement, not a Baseline drop-in).

**ALREADY-SOTA (do not touch):** the full L4 math-function set + constants with
boundary guards; `steppedEase`/`jump-*` vocabulary; `cssLinear` core (gap-fill,
monotonicity, binary-search — modulo E3); `bezierPresets` single source of truth.

### Wave F — Surface, robustness & spec-completeness (lower priority, bundle)

| # | Item | Where (value.js) | Falsifiable gate / disposition | Iso |
|---|------|------------------|--------------------------------|-----|
| **F1** | **Unify the two matrix decompositions** — wire the rigorous `interpolateDecomposed`/`decomposeMatrix3D` (Gram-Schmidt, quaternion slerp, det-flip) into the live path and **delete** the naive Euler `unpackMatrixValues` 3D branch (gimbal-locks, double-counts skew) | `transform/decompose.ts:227` (orphan) vs `units/utils.ts:197-232` (live) | `matrix3d` rotation/skew interpolation matches the browser; re-baseline affected snapshots | **Non-iso — changes pixels** (toward browser behavior). **Net LOC drops.** Add the `slerp` `acos` domain clamp |
| **F2** | **Context-dependent color keywords** — `currentColor` (Baseline, hard parse-fails today), `light-dark(a,b)` (Baseline May 2024, in the `.bbnf` but absent from the live parser), system colors (`Canvas`/`ButtonText`/…, grammar-documented, unimplemented). Each → a **sentinel** the consumer resolves via the existing computed-value seam | `color.ts:556`, `:540-552`; `units/color/constants.ts`; BBNF `css-color.bbnf:90-124` | parser deep-equal + each sentinel resolves per-target via the computed seam (or an explicit typed reject, not a generic parse-fail) | **Befitting / additive** — resolving from the target's computed value is *more* isomorphic than today's hard failure |
| **F2b** | **`contrast-color()`** — the CSSWG dropped `color-contrast()` (the `vs`/list form the `.bbnf` still encodes) for single-arg `contrast-color(<color>)` (**Baseline 2026-04-10**). value.js owns the engine (`contrast.ts safeAccentColor`) but wires neither spelling. Wire `contrast-color(<color>)` to a `safeAccentColor`-backed resolver — a *competitive* opportunity | `color.ts:556`; `units/color/contrast.ts`; `css-color.bbnf:95-101` | `contrast-color(red)` parses + resolves | **Additive** (Baseline 2026-04) |
| **F2c** | **`.bbnf` color grammar drift** — the top-level `color` production advertises four features the live parser lacks (`colorContrast` [dead], `lightDark`, `systemColor`; omits `currentColor`). Best fix: close F2/F2b so the grammar becomes *true* | `css-color.bbnf:7,90-136` | grammar reflects the live parser (or annotates the gap) | **N/A — documentation.** Bundle with F2/F2b |
| **F3** | **Bounded LRU memo** — generous cap (e.g. 1024) + FIFO→true LRU (`delete`+`set` on hit) on the parse/normalize result caches; closes the unbounded-memory hazard for editor per-keystroke generated CSS. **The single most-named item** (merges FC-6, F3, D-4, `a-vj-*` F2, `d-vj-parse` dupes) | `utils.ts:108-153` `memoize` + its unbounded consumers | hits byte-identical, only cold-eviction timing changes | **Iso** |
| **F4** | **`@property` `syntax`/`inherits` lossless round-trip** — confirm/expose a lossless `syntax` string + normalized `inherits`, suitable for direct `CSS.registerProperty()`. If value.js drops `<color>+` multipliers or unwraps `\|` unions, kf's registration is lossy | `stylesheet.ts:377-407` | verification if already faithful; small surface add if not | **Parsing-stable** — enables kf's `@property`-native-interp (E.W9 S1) |
| **F5** | **Quantizer determinism + off-thread** — seedable PRNG (mulberry32) for k-means++ (`cluster.ts:199` `Math.random()` → non-reproducible palettes) + an async/yielding `quantizePixelsAsync` (3.2M distance-evals synchronously blows the INP budget) | `quantize/cluster.ts:199`; `quantize/index.ts:97` | reproducible palette for a fixed seed; quantize yields off the interaction critical path | **Iso** (seed makes nondeterminism deterministic; async is same-output-different-scheduling) |
| **F6** | **Surface hygiene / sub-path exports** — `quantize`/`transform/decompose` exported but no kf consumer imports them (tree-shake liability). Sub-path exports (`@mkbabb/value.js/quantize`) + a **parser-free easing sub-path** so kf can statically re-export named curve constructors without re-adding the static DOM/parser edge | `index.ts:294-310`; `easing.ts` | export-graph reshaping only | **Iso** — enables kf's playground image→palette demo + named-easing re-export (FOLD-E) |
| **F7** | **Diagnostics hygiene — the `console.error` custom-color-name leak.** The `console.error` fires on **every** top-level parse failure (`parser.ts:59,63`, shipped in `dist/parse.js:708,712`). Concrete bug: `parseCSSColor` (`color.ts:613-628`) runs the rich parser **first**, then falls back to the custom-color-name map — so the first attempt **must** fail for the fallback to run, and **every parse of a registered custom color name spams a formatted ANSI error tree** on the console + the cold un-memoizable path. Fix: (a) route `parseState` to an opt-in diagnostic sink (in parse-that); **or** (b) reorder `parseCSSColor` to try the custom-name map *before* the speculative `parseResult` | `parser.ts:59,63`; `color.ts:613-628`; `utils.ts:26`; `math.ts:34` | no console I/O on the expected-failure / custom-color-name path; diagnostics behind `isDiagnosticsEnabled()` | **Pure observability change** — removes the log, changes no parse output; strictly faster + quieter |

---

## 2. The one chronic cross-repo seam — the rename

**`AnimationOptions → CSSAnimationOptions`.** kf pins `@mkbabb/value.js ^0.10.0`;
value.js renamed `AnimationOptions → CSSAnimationOptions`, flattened
`Color.components.get("L") → Color.L`, and carries a precept-pin divergence — filed
in vj D/E/F/G/H, **never executed kf-side** because inv-16 blocks value.js from
writing keyframes and no kf tranche has owned it (`a-tranche-retro` §4.3, XR-1 — the
one chronic unowned cross-history item).

**Disposition: a kf-side verification + pin-bump sub-item when value.js publishes
v1.0.0** — the keyframes-side terminal home for the seam value.js has filed five
times. NOT urgent (the pin is current); a pin-bump + a rename-migration + a `Color.L`
migration, all isomorphic. The two ledgers (kf→vj here; vj→kf in value.js's own
coordination docs) should reconcile when value.js v1.0.0 publishes.

---

## 3. The cross-repo edge — what kf needs, what kf owns

The boundary is **architecturally sound** (kf keeps a light, value.js-free barrel;
CI `proof:boundary` guards the static edge). Each item below is value.js-owned; kf
consumes the surface unchanged or pairs a FOLD-E seam (largely in **E.W9**).

| Win | value.js owns (this hand-off) | keyframes.js owns (FOLD-E) |
|-----|-------------------------------|----------------------------|
| **Computed-unit perf (D-3)** | C1 endpoint cache; C2 stable-key memo; C3 batched resolve; C5 unit coverage; C7 eviction | endpoint cache on its own seam; resize contract; `proof:computed-frame`; the WAAPI doc-truth fix (E.W7 S3) |
| **Color hot path** | B1 fast serializer; B2 output-space; B3 channel plan; B4 egress gamut | WAAPI color eligibility lift (**E.W9 S4** — main-thread native interp, mechanism corrected); color bench case; color-interp demo scene |
| **WAAPI color faithfulness** | `cssColorInterpKeyword(space, hueMethod)` + L4-space-preserving serializer | admit color whose endpoints are CSS-string-expressible **AND** whose `(colorSpace, hueMethod)` match the UA default (**OKLab non-legacy / sRGB legacy**); emit L4 endpoints in `toWAAPIKeyframes`; keep custom-space on the JS path (**E.W9 S4**) |
| **Context-dependent color keywords** | F2 `currentColor`/`light-dark()`/system sentinels; F2b `contrast-color()`; F2c `.bbnf` fix | frame-prep resolution policy — resolve each sentinel per-target via the computed seam (**E.W9 S6**) |
| **`linear()`/spring** | E1 parser; E3 tie-break; D-VJS-2 positioned-stop round-trip parity | the `linear()` branch in `getTimingFunction` (**E.W7 S5** — no branch today → silent degrade to `easeInOutCubic`); whole only when both land. kf keeps its own value.js-free `springLinearStops` |
| **`@property` native interp** | F4 lossless `syntax`/`inherits` | `CSS.registerProperty()` + WAAPI wiring (**E.W9 S1**) |
| **`calc-size()` / intrinsic-size** | E7 `calc-size()` parser (FOLD, re-scoped) | engine intrinsic-size animation path (height→auto via native `interpolate-size` or JS-measure) — **GAP-NAMED**, its own wave (**E.W9 stretch**) |
| **Carrier (D1)** | lean interp cell / typed substrate behind `prepareInterpVar` | `NumericAnimation` `Float64Array` substrate (FOLD-E, keyframes-local); E.W8 transposes the SoA *scheduling* discipline but stops at the leaf boundary |

---

## 4. Proposed sequencing (owner-discretionary)

```
Wave A (parse fast tier) ─── isomorphic, leverages existing primitives ── FIRST
   └─ A6 + F7 are cheap standalone wins; unblocks the cssParser strategic decision (WASM declined)

Wave C (computed-unit boundary) ── the cross-repo D-3 win; pairs with kf E.W9 FOLD-E ── HIGH
   └─ C5 (the 24-of-43 unit coverage) is a standalone correctness fix, can lead

Wave B (color hot path) ──── ~40×-per-frame lane; B3 is pure refactor ── HIGH
   └─ B1/B2 unblock kf's WAAPI color lift (E.W9 S4, main-thread native interp) + cssColorInterpKeyword

Wave E (easing/math parsers) ── additive, math already written ── MED-HIGH
   └─ E1 linear() is the single highest-leverage-per-line spec win (round-trip severed BOTH ends — pairs with kf E.W7 S5)
   └─ E7 calc-size() re-scoped BOOK→FOLD (bounded grammar extension)

Wave D (interp carrier) ── deepest, riskiest; named tranche, measure-first ── MED (gated)

Wave F (surface/robustness) ── bundle the low-priority nits; F3/F7 cheap+iso ── LOW-MED
```

**Every wave is measure-first.** The deepest findings (D1 megamorphism, C1/C2
memo-key cost, B1 serialization) are **invisible to allocation-dominated
microbenchmarks** and only surface under long-running, buffer-reusing, INP-under-load
playback. The gates that matter: `proof:computed-frame` (call-counter + forced-reflow),
a color-interp bench (**absent in both repos today** — the most expensive lane is
unmeasured), a threaded-`out`-buffer interp variant (kf E.W7/E.W8 add it on the kf
side), and `%DebugPrint`/`--prof` fast-properties confirmation for the carrier work.

---

## 5. ALREADY-SOTA — manufacture NO work here

Consolidated, so the hand-off does not invent value.js work where it already leads:
the parse-that mutable-state engine + zero-alloc leaves (**and `parsers/css/` already
hand-writes the single-pass first-char-dispatched reader the SOTA field converged on**
— the gap is *adoption*); **do NOT add packrat** (dispatch obviates it); the
identity-keyed result cache; the broad correct grammar (15 color spaces, RCS,
`color()`, `color-mix()`, the full L4 math set, `@property`, scroll ranges); **the
full L4/L5 functional color surface** in the live parser; OKLab perceptual default +
one-time space collapse; analytical Ottosson gamut map (**ahead of shipping
browsers**); premultiplied-alpha + four hue methods; XYZ-D65 hub + `DIRECT_PATHS`;
`deltaEOK`+JND; pre-resolved monomorphic `_lerp` dispatch; 2D matrix decomposition;
DOM-correct writing-mode-aware container-unit resolution (only the `sv*` sibling
units C5 covers are missing); **the spring→`linear()` emission** (faithful, leads
GSAP/Motion; the only defect is the engine can't read its own emission back — kf
E.W7 S5 + this charter's E1); `steppedEase`/`jump-*`; `bezierPresets`; `shouldCache`
on `isConnected`; `WeakMap` element ids.

**BOOK (named, not folded):** `progress()`/`media-progress()`/`container-progress()`
(the highest-value BOOK item — the canonical scroll/anim-driven interpolation
primitive, *most* aligned with this project's domain, but early-WD); `sibling-index()`/
`sibling-count()` (native CSS stagger, limited availability); `random()` (WD); the
*engine-side* intrinsic-size animation path (paired with E7); typed `attr()` `type()`
beyond E6's BBNF realign (Chrome 133+ only); SVG/`offset-path` geometry sampler (on kf
MotionPath graduation); a spring/bounce→`linear()` generator in value.js (kf keeps the
canonical copy). *(Moved OUT of BOOK by the re-exec lanes: `calc-size()` → E7 FOLD,
`contrast-color()` → F2b FOLD — both bounded enough to land now.)*

---

## 6. inv-16 compliance statement

This is a **HAND-OFF charter**, not a write. value.js is **dirty + active** (branch
`docs/constellation-grand-audit-2026-06-03`, **tranche M open** — post-L deep audit).
Nothing here edits value.js; every item is a proposal the value.js owner sequences,
scopes, and writes against value.js's own tranche discipline. keyframes.js's paired
FOLD-E work (column 2 of §3) is owned by Tranche E — largely **E.W9** (platform
adoption: `@property` registration, native color, the scroll bridge, the
`currentColor`/`light-dark()` resolution policy), with the `linear()` consumption half
in **E.W7 S5** and the `NumericAnimation` substrate adjacency in **E.W8** — and lands
independently; most of it consumes the published value.js surface unchanged
(`lerpValue` already dispatches through `iv._lerp`). **Only this file was written by
this lane** (inv-16: write ONLY `docs/tranches/E/valuejs-sota-handoff.md`).
