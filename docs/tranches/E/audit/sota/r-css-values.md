# SOTA Audit — CSS Values L4 + Easing L2 + @property + container/anchor (lane r-css-values)

> Tranche E · forward-SOTA research, **findings ONLY** (no implementation).
> Scope: the **spec-surface** of the keyframes.js + value.js stack against the
> live 2025–2026 CSS specs this stack lives on — **CSS Values & Units L4/L5**
> (`calc()` round/mod/rem/trig/clamp, `calc-size()`, typed `attr()`,
> `interpolate-size`, `sibling-index()`/`random()`/`progress()`), **CSS Easing
> L2** (`linear()` positioned stops — the project's spring primitive),
> **`@property`** registered customs, **container-query units** (the engine
> resolves `cqw`), and **anchor positioning**.
>
> **inv-16 (hard).** keyframes.js findings → **FOLD-E**. value.js findings →
> **FOLD-VALUEJS-HANDOFF** (a named tranche the value.js owner formalizes — this
> doc never proposes *writing* value.js). value.js is dirty + active. Only this
> file is written by this lane.
>
> **Sibling-lane dedup.** `d-vj-parse §5` already named the value.js `linear()`/
> `steps()`/`env()` parser gaps and the L5 math BOOK items; `d-modern-platform
> D-LIB-1`/`D-VJS-1` named `@property` registration + the `syntax` round-trip;
> `d-color-interp` owns the color hot path. **This lane does NOT re-derive those
> bodies.** It contributes the pieces those lanes did not reach: (a) the
> **keyframes-side** `linear()` *consumption* gap (the twin of value.js's
> *production* gap — the round-trip is broken on BOTH ends), (b) the **~24
> silently-no-op length units** in `convertToPixels` measured against the L4 unit
> set, (c) the spec-grounded **dimensional-type** correctness gap in `calc`
> evaluation, (d) `interpolate-size`/`calc-size()` as a **named engine
> capability gap** for height/auto animation, and (e) the L5 emerging-math map
> with falsifiable Baseline dates. Cross-refs are explicit; no body is duplicated.

Legend — disposition: **FOLD-E** · **FOLD-VALUEJS-HANDOFF** · **BOOK** (record;
not now) · **GAP-NAMED** (platform/spec gap, no baseline-safe action today) ·
**ALREADY-SOTA** (no work; we match or lead). Every Baseline date below is from
the modern-web-guidance corpus (`physics-based-easing`,
`animate-to-intrinsic-sizes`, `fluid-scaling`, `dynamic-sibling-animations`) or
MDN/web-features, cited inline.

---

## 0. Headline

The stack is **genuinely modern on the math it covers** and **ahead of SOTA on
spring-via-`linear()` emission** — keyframes.js *generates* CSS Easing L2
`linear()` strings from real spring physics (`springLinearStops.ts:72`), which
few libraries do natively. But the spec surface has **one structural defect and
a cluster of coverage gaps**, all in my lane:

1. **The `linear()` round-trip is severed on BOTH repos.** value.js has the
   `cssLinear` *evaluator* but no *parser* (`d-vj-parse §5.1`); keyframes.js has
   the `getTimingFunction` *resolver* but **no `linear()` branch** (this lane,
   §1) — so a `linear()` easing the engine itself emits, or one authored in
   `animation-timing-function: linear(…)`, **cannot be read back into a callable
   curve**. It silently degrades to `easeInOutCubic`. This is the single
   highest-leverage spec fix in the lane and it needs a paired fix in *both*
   repos.

2. **~24 of the 43 L4 length units silently no-op** in value.js
   `convertToPixels` — every viewport variant (`svh`/`lvw`/`dvh`/`vi`/`vb`…),
   `cap`/`ic`/`lh`/`rlh`, and the *parsed-but-unconverted* container units fall
   through to `convertAbsoluteUnitToPixels`, which returns the **raw number
   unchanged** for any unit it doesn't recognize (§3). A `50dvh` endpoint
   animates as if it were `50px`.

3. **`calc` result-typing is a first-leaf heuristic, not L4 dimensional
   algebra** — `calc(100% / 2)` and `calc(10px * 2)` are mis-typed (§4). (Named
   by `d-vj-parse §5.4`; this lane grounds it in the L4 *type* spec and adds the
   keyframes-pairing consequence.)

4. **`interpolate-size`/`calc-size()` — the native height/auto-animation
   primitive — is unmodeled** (§5). keyframes.js has no path to animate to
   `auto`/`max-content`; value.js doesn't parse `calc-size()`.

5. **Typed `attr()` (L4), `sibling-index()`/`random()`/`progress()` (L5)** are
   absent — correctly **BOOK/GAP** (not Baseline), but named so a future pass
   has the map (§6).

ALREADY-SOTA (do not manufacture work): the `<calc-sum>`/`<calc-product>` grammar
with correct precedence + the full L4 function set, the sign-correct `mod`/`rem`,
the trig angle-coercion, the `e`/`pi`/`infinity`/`NaN` ident-collision guard, the
DOM-aware container-unit *resolution* (writing-mode-aware `cqi`/`cqb`), and the
spring→`linear()` emitter. See §7.

---

## 1. keyframes.js `getTimingFunction` has no `linear()` branch — the consumption half of the broken round-trip — FOLD-E

- **file:line** — `src/animation/utils.ts:103-143` (`getTimingFunction`). It
  handles, in order: a callable (returned as-is, `:109`), a `cubic-bezier(...)`
  literal (`CUBIC_BEZIER_LITERAL`, `:114`), a `steps(n[,pos])` literal
  (`STEPS_LITERAL`, `:126`), the `step-start`/`step-end` keywords (`:135-136`),
  then a named lookup in `timingFunctions` (`:138`). There is **no `linear(`
  branch.** A `linear(0, 0.5 25%, 1)` string falls through every match, fails the
  `timingFunctions[...]` lookup (it is not a registry key), and returns
  `undefined` → the caller (`engine.ts` option setter) defaults to
  `easeInOutCubic`. Confirmed: `grep "linear("` across `utils.ts`/`format.ts`/
  `constants.ts` finds only comments; no literal-matcher exists.
- **the gap** — keyframes.js **emits** `linear()` from two places
  (`springLinearStops.ts:72`, and `springTimingFunction.ts:119` packs it as
  `Easing.css`) and **stores** per-keyframe `animation-timing-function` strings
  verbatim from parsed CSS (`adapter.ts:22` `timingFunctions: Map<string,
  string>`, populated at `:113` from `rule.timingFunction`). So a `linear()`
  authored in a `@keyframes` block, OR re-imported from this engine's own
  `format.ts` output (`format.ts:67` writes `options.timingFunction.css`
  verbatim — a `linear(…)` string), **round-trips out but not back in.** The
  emit path is faithful; the parse path drops it on the floor.
- **perf/elegance rationale** — This is the project's *own* spring primitive
  failing to deserialize. The fix is small and exact: a `LINEAR_LITERAL` regex
  (sibling to `CUBIC_BEZIER_LITERAL`/`STEPS_LITERAL` already at
  `utils.ts:80-85`) that extracts the stops and feeds value.js's `cssLinear`
  (which already exists, `easing.ts:33`) — OR, cleaner, route a `linear(...)`
  string through value.js's *parser* once it exists (§2 / `d-vj-parse §5.1`) and
  consume structured `LinearStop[]`. Either way keyframes.js gains the consuming
  half. Because `cssLinear` is value.js-owned and lives on the LIGHT surface's
  easing factory (`resolveEasing`, `easing.ts`), the cleanest seam is: parse the
  literal in `getTimingFunction` → `LinearStop[]` → `cssLinear(stops)`.
- **disposition** — **FOLD-E** (keyframes.js owns `getTimingFunction`). **Paired
  with** the value.js `linear()` parser (`d-vj-parse §5.1` /
  FOLD-VALUEJS-HANDOFF below) — but note the keyframes fix can land
  *independently* with a local literal-matcher, since `cssLinear` is already
  importable. The round-trip is only whole when **both** land.
- **isomorphism** — Strictly additive: a `linear()` easing that currently
  silently degrades to `easeInOutCubic` becomes the curve the author wrote. No
  existing input changes (no existing input is a `linear()` string today — it
  always degraded). The WAAPI path already *emits* the same `linear()` twin
  (`waapi.ts:191`), so the rAF JS curve and the compositor curve finally agree.
- **Baseline** — `linear()` easing: **Baseline newly available 2023-12-11**
  (Chrome/Edge 113, Firefox 112, Safari 17.2 — modern-web-guidance
  `physics-based-easing`). Widely-available ETA 2026-06-11 (web-features
  `linear-easing`). Safe to consume now; the engine's named/`cubic-bezier`
  fallback covers the gap-free degradation.

---

## 2. value.js `linear()` / `steps()` parsers — the production half — FOLD-VALUEJS-HANDOFF

- **Cross-ref (do not duplicate):** `d-vj-parse §5.1, §5.2` holds the full body —
  `easing.ts:33` `cssLinear` and `easing.ts:293` `steppedEase` are complete
  evaluators with **no parser**; `linear(…)` falls to generic `handleFunc`
  (`index.ts:230`) yielding a flat `FunctionValue("linear",[v0,v1,…])` that
  **drops the stop input-percentages and flat-segment form** (`0.5 25% 75%`).
- **This lane's contribution** — the structured `LinearStop[]` shape value.js
  must produce *already exists in value.js* (`easing.ts:28` `interface
  LinearStop { output; input? }`) and *already exists in keyframes.js's mental
  model* (it consumes the same shape via §1). So the hand-off is unusually
  cheap: a `linearFn` parser → `LinearStop[]` → fed to the **already-written**
  `cssLinear`. The two-position flat-segment form (`0.5 25% 75%` → two stops with
  the same output at 25% and 75%) is the only non-trivial bit, and `cssLinear`'s
  gap-fill + monotonicity logic (`easing.ts:46-75`) already tolerates it.
- **Spec** — CSS Easing L2 `<linear-easing-function>`: `linear() = linear( [
  <number> && <percentage>{0,2} ]# )`. The `<percentage>{0,2}` is exactly the
  flat-segment form. Baseline 2023-12-11 (as §1).
- **`steps()`** — same shape, smaller: `steps(<integer>, <step-position>?)` →
  `{ count, jumpTerm }` feeding `steppedEase` (`easing.ts:293`). The `jumpTerms`
  union (`easing.ts:266`) is the target vocabulary. keyframes.js *already* parses
  this locally (`utils.ts:126` `STEPS_LITERAL`), so a value.js parser would let
  keyframes drop its local regex and consume structured args uniformly.
- **disposition** — **FOLD-VALUEJS-HANDOFF** (parser production). Pairs with §1
  (keyframes consumption). The cross-repo invariant: a `linear()` value.js emits
  must re-parse to a curve byte-equal to the one keyframes.js sampled —
  `d-modern-platform D-VJS-2` already named this round-trip parity check; this
  lane confirms it is the *same* gate.
- **isomorphism** — additive; degenerate `linear()` values become structured.

---

## 3. ~24 of 43 L4 length units silently no-op in `convertToPixels` — the most concrete spec gap — FOLD-VALUEJS-HANDOFF

- **file:line** — value.js `src/units/utils.ts:274-355` (`convertToPixels`) +
  `:255-272` (`convertAbsoluteUnitToPixels`). The `RELATIVE_LENGTH_UNITS` set is
  **39 entries** (`units/constants.ts:5-44`): `em ex ch cap ic rem lh rlh vw vh
  vmin vmax vb vi svw svh svi svb svmin svmax lvw lvh lvi lvb lvmin lvmax dvw dvh
  dvi dvb dvmin dvmax cqw cqh cqi cqb cqmin cqmax`. `convertToPixels` resolves
  **only** `em rem vh vw vmin vmax % ch ex` + the six `cq*` units (`:283-349`).
  **Everything else** — every `s*`/`l*`/`d*` viewport variant, `vi`/`vb`,
  `cap`/`ic`/`lh`/`rlh` — hits the `else` branch (`:350`) → `convertAbsoluteUnit-
  ToPixels(value, unit)`, which has cases only for `cm mm Q in pt pc` (`:255-272`)
  and **returns `value` UNCHANGED** for any unit it doesn't recognize (`let
  pixels = value; … return pixels`).
- **the gap (quantified)** — that is **~24 length units** (the 18 `s*`/`l*`/`d*`
  viewport family minus none + `vi vb cap ic lh rlh`) that **silently pass through
  as raw numbers**. A keyframe endpoint of `50dvh` resolves to `50` *pixels*, not
  50% of the dynamic viewport height. The animation runs — wrong. This is worse
  than a parse failure (which would surface) because it is a *silent* numeric
  identity. The `svw…dvmax` family is **Baseline widely available** (small-vp /
  large-vp / dynamic-vp units shipped 2022–2023), so this is missing support for
  *shipping, common* units, not exotic ones.
- **perf/elegance rationale** — The viewport variants are nearly free to add: the
  dynamic (`dv*`) and large (`lv*`) families equal the existing `vw`/`vh` math
  against `innerWidth`/`innerHeight` (the UA collapses dynamic→large when toolbars
  retract; using `innerHeight` is the correct "largest" approximation and matches
  what `vh` already does); small (`sv*`) needs the visualViewport-minus-UA
  height, available via `window.visualViewport`. `vi`/`vb` are writing-mode
  selections over `vw`/`vh` (the code *already* computes `isVerticalWritingMode`
  for `cqi`/`cqb`, `:331` — the same selector applies). `lh`/`rlh` are
  `line-height` reads (one `getComputedStyle`). `cap`/`ic` are font-metric
  approximations (like the existing `ex`/`ch` approximations at `:300-322`). The
  shape is already established by the `cq*` block — this is **filling out a
  pattern the file already commits to**, not new architecture.
- **isomorphism** — A behavior-FIX, not a refactor: animations over these units
  go from *silently wrong* (raw-number passthrough) to *correct*. Gate: an
  endpoint-resolution test over the full 39-unit set asserting non-identity
  conversion (any unit returning `value` unchanged for `value≠resolved` is a
  bug). This is the cleanest falsifiable gate in the lane.
- **disposition** — **FOLD-VALUEJS-HANDOFF** (`convertToPixels` is value.js).
  Cross-ref `a-vj-other F1` / `_SYNTHESIS-valuejs-handoff §0.3` named "~24 length
  units silently no-op"; **this lane grounds the exact count + the L4/Baseline
  framing + the fill-the-`cq*`-pattern path.** keyframes.js consumes this purely
  through `getComputedValue` (`normalize.ts`) — no keyframes change needed once
  value.js resolves the units; FOLD-E is **not** required here (the engine just
  gets correct numbers).
- **Note** — the **WAAPI eligibility gate** (`waapi.ts`, "no computed units")
  already excludes these from the compositor path, so the only consumer is the
  rAF `getComputedValue` resolver — which is exactly where the silent-identity
  bug bites. No compositor-side risk.

---

## 4. `calc` result-typing is a first-unit-bearing-leaf heuristic, not L4 dimensional algebra — FOLD-VALUEJS-HANDOFF

- **file:line** — value.js `src/parsing/math.ts:473-509`. `evaluateMathFunction`
  folds to a number (`evaluateMathFunctionInternal`, `:288`) and *separately*
  walks the AST a second time (`inferResultUnit`, `:488`) which returns the
  **first unit-bearing `ValueUnit`** it finds (`:503-506` "for each arg, first
  `u` wins"). The doc-comment itself admits the heuristic (`:483-486` "the first
  unit found represents the result type").
- **the gap (spec-grounded)** — CSS Values L4 §10.10 defines a real **type
  algebra**: `*` multiplies types (`<length> * <number>` → `<length>`;
  `<length> * <length>` → `<length>²`, invalid as a final value), `/` divides
  (`<length> / <length>` → `<number>`, **unitless**), `+`/`-` require matching
  types. The first-leaf heuristic mis-types two common shapes:
  - `calc(100% / 2)` → first unit-bearing leaf is `%` → typed `%`. **Correct per
    L4 if the divisor is unitless** (50%) — *but* `calc(100% / 50%)` should be
    **unitless** 2, and the heuristic would type it `%`. Wrong.
  - `calc(10px * 2)` → first leaf `px` → `px`. Correct *here*, but
    `calc(2 * 10px)` finds `2` (unitless, skipped at `:490` since `unit` falsy)
    then `10px` → `px`. Also correct by luck; the heuristic is order-fragile.
  - The genuinely-wrong case: `calc(100% / 2)` is fine, but **division by a
    dimension** (`calc(100px / 2px)` → should be unitless `50`) types as `px`.
- **perf/elegance rationale** — `d-vj-parse §5.4` already named the **two-pass**
  waste (fold-then-infer walks the AST twice) and proposed a single annotated
  fold carrying `{value, unit, superType}`. **This lane adds the correctness
  half:** that single fold should implement the L4 `*`/`/` type *algebra* (mul
  combines exponents, div cancels, add/sub assert-equal), not re-find-the-first-
  leaf. The perf win (one traversal) and the correctness win (real dimensional
  types) are the *same* change. For this stack the consequence is concrete:
  keyframes pairs frames by `(property, subProperty)` and the resolved unit
  drives `getComputedValue` dispatch — a mis-typed `calc` result routes to the
  wrong interpolation branch.
- **disposition** — **FOLD-VALUEJS-HANDOFF** (math.ts). Sequence with the §3 unit
  fill (both are `units`/`math` and share the dimensional-type vocabulary).
- **isomorphism** — Mostly isomorphic (the common `length ± length`, `length *
  number` shapes are unchanged); the *changed* outputs are the ones that are
  currently **wrong** (`length/length` → unitless). Gate: an L4 type-algebra
  table test (`calc(100px/2px)===50` unitless, `calc(100%/2)===50%`,
  `calc(10px*2)===20px`).

---

## 5. `interpolate-size` / `calc-size()` — native height/auto animation is unmodeled end-to-end — GAP-NAMED (engine) + FOLD-VALUEJS-HANDOFF (parser)

- **file:line** — `grep -rni "interpolate-size\|calc-size"` across **both** repos
  → **zero hits** (value.js `math.ts:200` `allMathFunctions` has no `calc-size`;
  keyframes has no `auto`/intrinsic-keyword animation path). value.js *parses*
  `auto`/`min-content`/`max-content` only as opaque keyword strings (no
  interpolable representation).
- **the gap** — This is THE native primitive for the single most-requested
  animation the library *cannot* do: animate `height`/`block-size` to/from `auto`
  / `max-content` / `fit-content`. Historically requires the `max-height` hack or
  JS measurement; `interpolate-size: allow-keywords` + `calc-size(<basis>,
  <calc>)` let the browser interpolate intrinsic keywords natively
  (modern-web-guidance `animate-to-intrinsic-sizes`,
  `calculate-with-intrinsic-sizes`). For a keyframes engine this is squarely
  in-domain.
- **two distinct moves:**
  - **value.js (parser):** add `calc-size()` to the math-function set — basis
    arg (`auto`/`min-content`/`max-content`/`fit-content`/`any`/`<length-pct>`) +
    a `<calc-sum>` over the `size` keyword. `d-vj-parse §5.4` named `calc-size`
    as a BOOK item; **this lane re-scopes it to FOLD-VALUEJS-HANDOFF** because
    its basis-keyword + `size`-token grammar is a clean, bounded extension of the
    existing `createCalcParser` (`math.ts:48`), not an open-ended L5 feature.
  - **keyframes.js (engine):** a path that, when an endpoint is an intrinsic
    keyword and the target is a DOM element, either (a) emits
    `interpolate-size: allow-keywords` on an ancestor + delegates the size
    transition to the platform (WAAPI/CSS), or (b) measures the intrinsic size
    via `getComputedValue` and interpolates numerically as the value.js-free
    fallback. **GAP-NAMED** for the engine: it is a *new capability*, not a
    baseline-safe drop-in.
- **Baseline** — `interpolate-size` + `calc-size()`: **limited availability —
  Chrome/Edge 129 (Sep 2024) only; unsupported in Firefox & Safari**
  (modern-web-guidance `animate-to-intrinsic-sizes`). Progressive-enhancement
  only (unsupported UAs jump instantly). So: **value.js parser = safe to add now**
  (parsing a value ≠ requiring browser support); **engine native-delegation = a
  guarded enhancement with the JS-measure fallback as the floor.**
- **isomorphism** — additive new capability; nothing existing regresses.
- **disposition** — **FOLD-VALUEJS-HANDOFF** (`calc-size()` parser, re-scoped
  from BOOK) + **GAP-NAMED / BOOK** (engine intrinsic-size animation path —
  sizeable, its own wave).

---

## 6. L5 / leading-edge math + typed `attr()` — the named map — BOOK / GAP-NAMED

Not Baseline; **correctly absent**. Named with falsifiable dates so a future pass
inherits the map rather than re-discovering it. None is a Tranche-E directive.

| Feature | Spec | Where it would live | Baseline | Disposition |
|---|---|---|---|---|
| **`progress()`** / `media-progress()` / `container-progress()` | css-values-5 | value.js `allMathFunctions` (`math.ts:200`) | **No** (early WD, not shipping) | **BOOK** — the canonical scroll/anim-driven interpolation primitive; *most* aligned with this project's domain (the engine's `Timeline.sample()→progress` pipeline is the JS twin). Highest-value BOOK item. |
| **`sibling-index()` / `sibling-count()`** | css-values-5 | value.js parser; keyframes stagger | **Limited** — Chrome/Edge 138 (Jun 2025), Safari 26.2 (Dec 2025); **no Firefox** (modern-web-guidance `dynamic-sibling-animations`) | **BOOK** — the native CSS stagger primitive (`animation-delay: calc(sibling-index()*0.1s)`). The engine already staggers in JS (`animations.ts` presets, AnimationGroup); this is the CSS-native twin. `@supports`-gated. |
| **`random()`** | css-values-5 | value.js parser | **No** (WD) | **GAP-NAMED** — emerging; not actionable. |
| **typed `attr()`** (`attr(data-x type(<length>), …)`) | css-values-5 | value.js `Function_` (the BBNF `attrFn` at `grammars/css-values.bbnf:85` models the **old L3 untyped** form, NOT the `type()` form — a grammar/spec drift) | **No** — "not Baseline, experimental"; Chrome 133+ only, **no Safari/Firefox** for the typed form (MDN `type()`; CSS-Tricks). Detect via `@supports (x: attr(x type(*)))` | **GAP-NAMED** + a small **FOLD-VALUEJS-HANDOFF** to *realign the BBNF `attrFn` to the L4 `type()` grammar* (the grammar currently lies about what L4 `attr()` is). |
| **`env()`** | css-env-1 | value.js `Function_` (BBNF `envFn` exists `:82`, runtime branch does **not** — drift) | Baseline (the common `safe-area-inset-*` set) | **FOLD-VALUEJS-HANDOFF** — already named `d-vj-parse §5.3`; flagged here only because it's the *same BBNF/runtime drift class* as typed `attr()`. |

**Cross-ref:** `d-vj-parse §5.4` named `calc-size`/`progress`/L5 math as
BOOK/GAP; this lane (a) **promotes `calc-size()` to FOLD** (§5, bounded grammar),
(b) **elevates `progress()` to the highest-value BOOK** (domain alignment), and
(c) adds the **BBNF-vs-runtime drift** observation for typed `attr()` (the
grammar models the wrong, pre-L4 form).

---

## 7. ALREADY-SOTA — do NOT manufacture work here

- **7.1 · L4 math grammar + function set.** `math.ts:48-98` parses the full
  `<calc-sum>`/`<calc-product>` with correct precedence, unary ±, nested parens;
  `:200-223` covers min/max/clamp, round (4 strategies, `:137-154`), mod/rem with
  **sign-correct** semantics (mod→sign-of-divisor `:368`, rem→sign-of-dividend
  `:375`), abs/sign, the full trig set with **angle-unit coercion to radians**
  (`resolveToRadians`, `:266`), pow/sqrt/hypot/log/exp, and the
  `e`/`pi`/`infinity`/`NaN` constants **guarded against ident-prefix collision**
  (`.not(identContinuation)`, `:191-198` — a subtle correctness win most parsers
  miss). **At or ahead of @csstools for L4 coverage.** Disposition:
  **ALREADY-SOTA** (the §4 *typing* gap is orthogonal to this breadth).
- **7.2 · Container-unit RESOLUTION is DOM-correct and writing-mode-aware.**
  `units/utils.ts:323-349` — `findQueryContainer` walks ancestors for
  `container-type: inline-size|size` (`:238`), and `cqi`/`cqb` select
  inline/block size via `isVerticalWritingMode` (`:331,253`). This is **more
  correct than a naive `cqw`-only impl** and matches the spec's writing-mode
  semantics. The *resolution* is SOTA; only the §3 *sibling units* (`svh`…) are
  missing. Disposition: **ALREADY-SOTA** (resolution) — the §3 gap is a
  different unit family.
- **7.3 · Spring → `linear()` EMISSION leads the field.** `springLinearStops.ts`
  samples a real `SpringProgress` physics solver into Easing-L2 `linear()` stops
  with settle-threshold early-exit and overshoot (>1) preserved (`:66-67`) —
  exactly what CSS `linear()` honors. `springTimingFunction.ts:119` ships the
  **same curve in two forms** (`{ fn, css: linear() }`), and `waapi.ts:191` emits
  the twin to the compositor. GSAP/Motion *approximate* spring-on-compositor;
  this **emits a faithful `linear()`**. Disposition: **ALREADY-SOTA** — the only
  defect is that the engine can't read its *own* emission back (§1).
- **7.4 · CSS Easing L1 consumption is complete.** `getTimingFunction`
  (`utils.ts:103`) faithfully resolves `cubic-bezier()`, `steps()`,
  `step-start`/`end`, and the full named registry — "CSS Easing L1 complete" per
  the module's own contract. Disposition: **ALREADY-SOTA for L1**; the L2
  `linear()` consumption (§1) is the one missing rung.

---

## 8. Disposition summary

| # | Finding | Repo | Baseline | Disposition |
|---|---|---|---|---|
| 1 | `getTimingFunction` has no `linear()` branch — emitted curves don't re-parse (degrade to `easeInOutCubic`) | keyframes | 2023-12-11 | **FOLD-E** |
| 2 | `linear()`/`steps()` parser (evaluator exists; structured `LinearStop[]`) | value.js | 2023-12-11 | **FOLD-VALUEJS-HANDOFF** (pairs §1) |
| 3 | ~24/43 L4 length units silently no-op in `convertToPixels` (`svh`/`lvw`/`dvh`/`vi`/`vb`/`cap`/`ic`/`lh`/`rlh`) | value.js | widely avail | **FOLD-VALUEJS-HANDOFF** |
| 4 | `calc` result-typing is first-leaf heuristic, not L4 type algebra (`100px/2px`→`px`, should be unitless) | value.js | n/a (correctness) | **FOLD-VALUEJS-HANDOFF** (fold with `d-vj-parse §5.4` two-pass) |
| 5 | `interpolate-size`/`calc-size()` — height/auto animation unmodeled | both | limited (Chrome 129) | **FOLD-VALUEJS-HANDOFF** (parser, re-scoped from BOOK) + **GAP-NAMED** (engine) |
| 6 | `progress()` / `sibling-index()` / `random()` / typed `attr()` map; BBNF `attrFn` models pre-L4 form | value.js | no / limited | **BOOK** (`progress()` highest-value) / **GAP-NAMED** (+ small BBNF-realign handoff) |
| 7 | L4 math grammar, container-unit resolution, spring→`linear()` emission, Easing-L1 consumption | both | — | **ALREADY-SOTA** |

---

## 9. inv-16 compliance

Only this file written. **keyframes.js → FOLD-E**: §1 (the one keyframes
headline). **value.js → FOLD-VALUEJS-HANDOFF**: §2 (linear/steps parser), §3
(unit no-ops), §4 (calc type algebra), §5 (calc-size parser), §6 (attr BBNF
realign, env drift). **BOOK/GAP-NAMED**: §5 engine intrinsic-size path, §6 L5
map. **ALREADY-SOTA**: §7. No value.js edit is proposed — every value.js item is
a named hand-off the value.js owner sequences. Cross-refs to `d-vj-parse §5`,
`d-modern-platform D-LIB-1/D-VJS-1/D-VJS-2`, `a-vj-other F1`, and
`_SYNTHESIS-valuejs-handoff` are explicit; no sibling-lane body is duplicated —
this lane contributes the keyframes-side `linear()` *consumption* gap, the exact
unit-count + L4 framing, the dimensional-type *correctness* (vs the already-named
two-pass *perf*), the `calc-size` re-scope, and the `progress()`/`attr()` map.

### Cites

- modern-web-guidance: `physics-based-easing` (`linear()` Baseline newly avail
  **2023-12-11**; Chrome/Edge 113, FF 112, Safari 17.2; widely-avail ETA
  2026-06-11); `animate-to-intrinsic-sizes` + `calculate-with-intrinsic-sizes`
  (`interpolate-size`/`calc-size()` **limited** — Chrome/Edge 129 Sep 2024, no
  FF/Safari); `fluid-scaling` (container queries Baseline widely avail
  **2023-02-14**); `dynamic-sibling-animations` (`sibling-index()`/`count()`
  **limited** — Chrome/Edge 138 Jun 2025, Safari 26.2 Dec 2025, no FF).
- W3C **CSS Values & Units L4** §10 (calc grammar) + §10.10 (type algebra);
  **css-values-5** (`calc-size`, `progress()`, `sibling-index/count`, `random`,
  typed `attr`); **CSS Easing L2** `<linear-easing-function>` positioned stops.
- MDN `type()` / `attr()` — typed `attr()` **not Baseline**, experimental,
  Chrome 133+ only, no Safari/FF for the `type()` form; detect via
  `@supports (x: attr(x type(*)))`. web-features `linear-easing`,
  `registered-custom-properties`.
- Live code: keyframes.js `src/animation/{utils.ts:103-143, adapter.ts:22-113,
  springLinearStops.ts:46-72, springTimingFunction.ts:119, format.ts:60-76,
  waapi.ts:191}`; value.js `src/{easing.ts:28-100,266-310, parsing/math.ts:48-98,
  200-223,473-509, parsing/units.ts:20-90, units/utils.ts:255-355,
  units/constants.ts:5-44, parsing/grammars/css-values.bbnf:82-98}`.
