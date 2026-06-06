# Tranche F deep-SOTA audit — lane `vj-parser-aug`

**Lane scope.** The value.js PARSER augmentation proposal, as a hand-off (inv-16:
propose, never write value.js). Builds on the E hand-off **Wave A** (`any()`→`dispatch()`
O(1) first-char, the `any()` sites, single-pass, span-preserving) + the **WASM/Rust**
angle (re-examine the declined full rewrite with current evidence) + the **`linear()`
parser** half (completes the W7 round-trip).

**Disposition vocabulary.** SHIP-in-F (kf doc, no value.js write needed) /
value.js-HANDOFF (propose a value.js change) / MEASURE-FIRST / BOOK / KILL / RECORD /
ALREADY-SOTA. This lane writes **only this doc**; every value.js item is a *proposal*
the value.js owner sequences. The single keyframes.js-side item this lane finds
(F-PARSE-1) is RECORDED for a kf wave — it is not written here.

**Grounding.** Every value.js / parse-that / kf claim below is `file:line`-cited against
the live trees (`/Users/mkbabb/Programming/value.js`,
`/Users/mkbabb/Programming/parse-that/typescript/src/parse`, and this repo's
`src/animation`). Every SOTA claim is web-grounded (sources at the end). Re-grounded
2026-06-06.

---

## 0. Headline — what changed since the E hand-off, and what this lane adds

The E hand-off's **Wave A** (parse fast tier) and **Wave E1** (`linear()` parser) remain
the correct shape and are **re-confirmed live** — nothing here overturns them. This lane
contributes **four** things the E hand-off did not have:

1. **The `linear()` round-trip is now severed on ONE end, not both.** The E hand-off and
   `a-vj-parser.md` C1 both state the round-trip is "severed on BOTH ends — kf's
   `getTimingFunction` has no `linear()` branch either" (handoff §1.3, §E1; FINAL.md line
   325). **That is now stale.** kf's E.W7 S5 LANDED: `getTimingFunction`
   (`src/animation/utils.ts:148`) now carries a `LINEAR_LITERAL` branch (`:96`, `:190-193`)
   feeding value.js's `cssLinear`. The kf end is **whole**. The value.js end is the **only**
   remaining gap — and kf currently bridges it with a **hand-rolled regex+`split`** shim
   (`parseLinearStops`, `utils.ts:106-130`) that duplicates grammar value.js should own.
   This *sharpens* E1 from "two-ended gap" to "one-ended gap + a kf shim awaiting the
   value.js parser." (§3.)

2. **`linear()` crosses into Baseline Widely-Available on 2026-06-11** — five days from
   this audit. The E hand-off cited the *newly-available* date (2023-12-11); the
   *widely-available* milestone lands now, which raises E1 from MED to MED-HIGH leverage:
   the parser value.js lacks is for a curve that is, this month, table-stakes CSS. (§3, §6.)

3. **The `any()`→`dispatch()` count and the prefix-match hazard are re-grounded with
   exact live numbers**, and one of them (A2's maximal-munch) is shown to be a **latent
   correctness** bug, not only perf — the `istring` leaf is **non-anchored** under a sticky
   engine, so a unit can match as a prefix of the input's continuation. (§2.)

4. **The WASM decline holds and is *strengthened* by 2025-26 evidence** — lightningcss's
   own WASM build documents string↔typed-array marshalling (`TextEncoder`/`TextDecoder`)
   as "the main overhead," which is precisely fatal to the per-token keyframes workload
   (vs. whole-stylesheet ingestion). The forward path remains pure-TS single-pass. (§4.)

**ALREADY-SOTA, stated plainly (manufacture no work):** the parse-that engine —
mutable single-state with offset-rewind (`state`/`parser.ts`), zero-alloc `regex`/`string`/
whitespace leaves (`leaf.ts:138-176`, `:180-232`, `:235-254`), the `Int8Array(128)`
`dispatch` primitive (`leaf.ts:60-104`), and the **complete hand-written single-pass
first-char-dispatched CSS value reader** `parseSingleValue` (`parsers/css/value.ts:11-87`)
+ its charCode scanners (`scan.ts`). value.js's grammar *coverage* is broad and modern
(15 color spaces, RCS, full L4 math, `@property`). The gap is **adoption**, not invention.
This is unchanged from the E synthesis and I re-confirm it.

---

## 1. The dormant SOTA machine — re-confirmed live (context, no new work)

The decisive structural fact, re-grounded: **parse-that ships the exact SOTA reader the
field converged on, and value.js imports none of it.**

- `parse-that/.../parsers/css/value.ts:11-87` — `parseSingleValue` is a branchless
  first-char dispatch: `35 '#'`→hex (`:16-22`), `34/39`→string (`:25-28`), `44 ','`→comma
  (`:31`), `47 '/'`→slash with comment-guard (`:34-37`), `digit/-/+/.`→number→`%`|unit|bare
  (`:43-57`), `33 '!'`→`!important` (`:60-69`), ident→function|ident (`:72-84`). This is
  tokenize-once · first-char-dispatch · typed-value-per-shape — lightningcss/csstree's
  architecture, hand-written in TS.
- `parsers/css/scan.ts` — all charCode scanners (`parseNumber:87`, `parseUnit:91`,
  `parseIdent:79`, `parseString:83`, `skipWsAndComments:34`) operate on `charCodeAt`, no
  substring materialization until a token is captured.
- **value.js imports none of it** (re-confirmed: no `value.js/src` file imports
  `parsers/css`, `cssParser`, or `parseSingleValue`). value.js's `src/parsing/units.ts`,
  `index.ts`, `color.ts` reimplement CSS value parsing over the slower `any()` combinator
  layer.

**Disposition: ALREADY-SOTA (the engine) + value.js-HANDOFF (the adoption).** The
strategic adoption of `cssParser` as value.js's value layer is the E hand-off's
GAP-NAMED multi-week tranche; I re-confirm it as correct and correctly sequenced *after*
the cheap isomorphic Wave-A wins. No change.

---

## 2. The `any()` fast-tier — re-grounded counts + a sharpened correctness finding

### 2.1 `any()` site census (re-grounded live) — value.js-HANDOFF (MED, the structural perf win)

Live count, `grep -rEn "\bany\(" value.js/src/parsing`: **58** `any(` call-sites
(index.ts 15, color.ts 20, units.ts 11, math.ts 7, stylesheet.ts 5). The E hand-off's
"65 `any()` sites" was an earlier count; **the live number is 58** — record the diff, the
finding is unchanged in substance.

The two hottest forks, re-grounded:
- `units.ts:78` — top-level `Value = any(Length, Angle, Time, Frequency, Resolution,
  Flex, Percentage, Color, Slash, number, none)` — **11 sequential trials**. A `12px`
  length re-enters `utils.number` (`utils.ts:16`) inside *every* dimension parser tried
  before `Length` succeeds — and `Length` is first, so the common case is cheap, but a
  bare `Color` keyword (`red`) falls through all of `Length…Flex…Percentage` first.
- `color.ts:556` — `Value = any(colorMix, colorFunction, hex, kelvin, rgbParser,
  hslParser, hsvParser, hwbParser, labParser, lchParser, oklabParser, oklchParser,
  xyzParser, nameParser)` — **14 sequential trials**. A bare `red` (`nameParser`, last)
  fails 13 speculative descents first; each touches `mergeErrorState` (`leaf.ts:40`).

**The dispatch table already exists** (`leaf.ts:60-104`) and `parseSingleValue`'s switch
(`value.ts:16-84`) *is* the proven first-char table. The transposition: front `color.ts:556`
with `dispatch({ "#": hex, "r": rgbParser, "o": <oklab|oklch>, "h": <hsl|hsv|hwb>,
"l": <lab|lch>, "c": <colorMix|colorFunction>, "x": xyzParser, "k": kelvin,
digit: kelvin, default: nameParser })`, retaining the inner `any` ordering inside each
bucket (so `srgb-linear` before `srgb` priority survives). Same for `units.ts:78` on
first char (digit/sign/dot→dimension subtree, letter→Color/keyword, `/`→Slash).

- **Falsifiable gate:** parse-output **deep-equal** vs current over the full value.js +
  kf `parsing`/`units`/`editor-parsing` corpora; bench the color/value hot loop (the
  largest single parse win).
- **Iso:** isomorphic — dispatch selects the *same* parser `any` would reach; priority
  preserved inside buckets.
- **Cross-repo edge:** the per-frame computed-unit resolver re-parses a fresh
  `getComputedStyle` string every tick via `parseCSSValueUnit`/`parseCSSValue`
  (`value.js/src/units/normalize.ts:145,170`) — so dispatch on `units.ts:78` cuts
  per-frame parse cost on kf's D-3 hot path. Compounds with the E hand-off's Wave C
  endpoint cache.

**Disposition: value.js-HANDOFF (MED).** Unchanged from E's A3 in substance; re-grounded
counts (58, not 65) + the explicit dispatch-table sketch keyed to `parseSingleValue`.

### 2.2 The unit `any(...UNITS.map(istring))` is non-anchored — a LATENT CORRECTNESS bug, not only perf — value.js-HANDOFF (MED, sharpened)

This is the finding I can sharpen hardest. `units.ts:20-26` builds each unit class as
`any(...LENGTH_UNITS.map(utils.istring))`. The `istring` leaf (`value.js/src/parsing/utils.ts:5-8`)
is:

```
export const istring = (str: string) => {
    const re = new RegExp(str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    return regex(re);   // ← no ^ anchor
};
```

`regex` (`leaf.ts:180-232`) re-flags this to **sticky `y`** (`:185`), which anchors the
match at `state.offset` — but the pattern itself has **no right boundary**. So
`istring("vh")` matches the **prefix** `vh` of an input continuation. Combined with `any`
trying units **in declared order** (`RELATIVE_LENGTH_UNITS`, `constants.ts:2-41`:
`… "vw","vh","vmin","vmax","vb","vi","svw"…`), the first prefix-match wins:

- The current declared order happens to be **safe for the viewport family** (the `sv*`/
  `lv*`/`dv*` triples diverge at char 3, and `vmin`/`vmax` after `vh` diverge at char 2),
  so there is **no active wrong-unit bug today** — I verified the ordering (`constants.ts:2-41`).
- But the construction is **fragile**: it is correct only by accident of declaration
  order. Add a unit whose name is a prefix of a later one (or reorder), and a longer unit
  silently parses as the shorter prefix. And the **boundary** is genuinely loose now:
  `all(utils.number, lengthUnit)` (`units.ts:32`) does not require the unit to be followed
  by a value boundary, so `100vming` tokenizes `100` + `vmin` + leaves `g` for the outer
  grammar rather than failing the dimension.

**The SOTA fix (and it is also faster):** one combined unit regex with **maximal-munch
ordering** + a `Set` classification, OR — better — adopt `parseUnit` (`scan.ts:91` →
`cssUnitRe`, a single alternation regex) which is already the right shape. Replace the 43
sequential `istring` trials per dimension with one regex + a `Set.has(unit)` superType
lookup.

- **Falsifiable gate:** a **longest-match** test (`vmin` vs `vmax` vs `vb`, `svw` vs `s`,
  `100vmin` boundary vs `100vming` reject) + full round-trip equivalence on the existing
  corpus.
- **Iso:** perf **plus a latent-correctness hardening** — the maximal-munch form removes
  the order-dependence and tightens the boundary; the *changed* outputs (if any) are
  cases that are currently mis-tokenized.

**Disposition: value.js-HANDOFF (MED).** This is E's A2 with the live evidence that the
hazard is *latent-correctness* (non-anchored sticky `istring`), not only the perf framing
the E hand-off gave it.

### 2.3 The `console.error` custom-color-name leak — re-confirmed live — value.js-HANDOFF (HIGH, cheap)

Re-grounded: `parseCSSColor` (`color.ts:613-628`) runs the rich `Value` parser
(`utils.parseResult`, `:615`) **first**, then falls back to `customColorNames`
(`:621-624`). So for a registered custom color name, the first attempt **must** fail —
and parse-that's top-level `parseState` (`parser.ts:59,63`, per `a-vj-parser.md` A1)
fires `console.error(state.toString())` on that failure, serializing a formatted
ANSI error tree to the console on **every** parse of a registered custom color name +
the cold un-memoizable path. **Fix (b)** is the elegant one: reorder `parseCSSColor` to
try `customColorNames.get(key)` *before* the speculative `parseResult` — the custom-name
map is a cheap `Map.get`, and trying it first means the rich parser's failure log never
fires on the expected-failure path. **Fix (a)** (route diagnostics to an opt-in sink in
parse-that) is the deeper one and belongs to the engine.

- **Falsifiable gate:** no console I/O on the custom-color-name path; diagnostics behind
  `isDiagnosticsEnabled()`.
- **Iso:** pure observability + a strictly-faster reorder; changes no parse output.

**Disposition: value.js-HANDOFF (HIGH).** Unchanged from E's A1 / hand-off F7; re-confirmed
live and the **reorder fix (b)** is named as the bounded, isomorphic move.

### 2.4 The dead packrat machinery — re-confirmed, KILL not wire — value.js-HANDOFF (MED)

Re-confirmed: `parser.ts`'s `.memoize()` packrat path has zero call-sites in value.js;
the per-parse `MEMO.clear()`/`LEFT_RECURSION_COUNTS.clear()` pays packrat's cost with none
of its benefit, and the grammar has **no left recursion** (calc is iterative `.many()`,
`math.ts:74-95`). CSS value grammars are LL(1)-ish once first-char dispatch (§2.1) removes
the speculative `any()` retries — the LL(1) single-token-lookahead frame is the
parser-combinator literature's own non-backtracking result (Semantic-Domain, linear-time
combinators). **Dispatch obviates packrat.** Disposition: **KILL** the dead surface (the
KISS choice), do NOT wire `.memoize()`.

**Disposition: value.js-HANDOFF (MED) — delete, not wire.** Unchanged from E's A2.

---

## 3. The `linear()` parser — the W7 round-trip's last open end — value.js-HANDOFF (MED-HIGH)

This is the lane's highest-leverage-per-line finding, and the one most changed by what
landed in E.

### 3.1 What landed (the diff the E hand-off doesn't reflect)

The E hand-off and `a-vj-parser.md` C1 describe the round-trip as severed on **both**
ends. **The kf end has since landed** (E.W7 S5). Re-grounded:

- `src/animation/utils.ts:96` — `LINEAR_LITERAL = /^\s*linear\s*\(\s*(.+)\s*\)\s*$/i`.
- `src/animation/utils.ts:106-130` — `parseLinearStops(inner)`: splits on `,`, splits each
  part on whitespace, `parseFloat`s the output + 1–2 `%`-stripped input positions, returns
  `LinearStop[]` or `undefined`.
- `src/animation/utils.ts:190-193` — `getTimingFunction` matches `LINEAR_LITERAL`, runs
  `parseLinearStops`, and on success returns value.js's `cssLinear(stops)` (`utils.ts:6`
  import). **The kf read-back is whole.**

So the round-trip today is: kf **emits** `linear()` (spring → `springLinearStops`) and kf
**reads** `linear()` back — but the read-back uses a **kf-local hand-rolled regex+`split`
stop-parser** (`parseLinearStops`), because **value.js still has no `linear()` parser**.
value.js has only the *evaluator* `cssLinear` (`easing.ts:33`) and the `LinearStop` shape
(`easing.ts:28`) — confirmed by grep: no parser in `value.js/src/parsing` produces
`LinearStop[]`; `linear` appears there only as a bare keyword token
(`animation-shorthand.ts:63,74`).

### 3.2 The proposal

Add a `linear()` *parser* to value.js feeding the existing `cssLinear`:
`linear( <linear-stop> (',' <linear-stop>)* )` where
`<linear-stop> = <number> <percentage>{0,2}` per CSS Easing L2. The structural fit is
exact and idiomatic in value.js's combinator vocabulary — it is a `sepBy(comma)` of
`all(utils.number, percentage.opt(), percentage.opt())`, mirroring how `createCalcParser`
(`math.ts:48-98`) composes `utils.number` / `Percentage` (`units.ts:64`) with `.many()`/
`.map`. Emit `LinearStop[]` directly; the spec's two-percentage flat-segment form
(`0.5 25% 75%`) expands to two stops with the same output, which `cssLinear` (`easing.ts:33`)
already gap-fills. Wire it into both `index.ts`'s function dispatch and value.js's easing
surface so `parseCSSValue("linear(0, 0.5 25%, 1)")` round-trips.

**The flat-segment tie-break (E3, re-grounded).** `cssLinear`'s segment search
(`easing.ts:80-99`) returns the **left** stop's output at a shared input (`:92-95`); CSS
Easing L2's algorithm returns the **last** matching point's output. This is non-iso only
at a measure-zero shared-input sample — bundle the spec-correct tie-break with the parser.

### 3.3 Why it matters now

- `linear()` reaches **Baseline Widely-Available 2026-06-11** (~88% support Oct 2025; in
  all majors since Dec 2023) — the curve the parser would read is table-stakes CSS this
  month, not a frontier feature. That raises E1 from MED to **MED-HIGH**.
- It **completes the W7 round-trip cleanly**: once value.js parses `linear()`, kf's
  `parseLinearStops` shim (`utils.ts:106-130`) — a hand-rolled regex+`split`
  reimplementation of grammar value.js should own — can be **retired** in favor of the
  value.js parser (no-legacy: the kf shim is replaced in the same motion, not kept beside
  it). This is the cross-repo FOLD-F pair.

- **Falsifiable gate (value.js):** `parseCSSValue("linear(0, 0.5 25% 75%, 1)")` →
  structured `LinearStop[]` → `cssLinear`; round-trips kf's own emitted spring
  `linear(0, 0.234 4.17%, …, 1)`; the flat-segment shared-input tie-break returns the
  later stop.
- **Iso:** additive (degenerate `linear()` was an opaque `CSSString` passthrough before;
  now structured) + the E3 tie-break is a befitting spec fix.

**Disposition: value.js-HANDOFF (MED-HIGH)** for the parser + tie-break.
**RECORDED for a kf wave (F-PARSE-1):** retire kf's `parseLinearStops` shim
(`utils.ts:106-130`) onto the value.js parser once it lands — the no-legacy collapse that
closes W7. (Not written here; inv-16 — this lane writes only this doc.)

### 3.4 `steps()` argument parser (E2) — the same shape, lower urgency — value.js-HANDOFF (LOW-MED)

The identical pattern: kf's `getTimingFunction` parses `steps(n[, term])` with a kf-local
regex (`STEPS_LITERAL`, `utils.ts:86-87`) + a kf-local `steppedEase`; value.js has the
`steppedEase`/`jump-*` evaluator vocabulary but no `steps()` *argument* parser. Mirror E1:
a `{count, jumpTerm}` parser feeding the existing evaluator. Lower urgency than `linear()`
because `steps()` has been Baseline far longer and the regex shim is trivial; bundle with
E1 if the value.js owner takes the easing-parser pair. **Disposition: value.js-HANDOFF
(LOW-MED).**

---

## 4. The WASM/Rust angle — the decline HOLDS and is strengthened — RECORD (WASM-DECLINED)

The E hand-off and `r-css-parsers.md` §6 verified the `rust/parse_that/` parser is a real,
benchmarked typed-AST CSS parser (vs lightningcss/cssparser/nom/winnow/pest) that is
**unbuilt for WASM** — no `cdylib` crate-type, no `#[wasm_bindgen]` in source (the
`wasm-bindgen` in `Cargo.lock` is a transitive dev entry). I re-examined the decline
against **current (2025-26) evidence** and it not only holds — it strengthens:

1. **lightningcss's own WASM build documents the marshalling tax.** `lightningcss-wasm`
   converts code string↔typed-array via `TextEncoder`/`TextDecoder`, and this marshalling
   "is the main overhead when using the WASM version" (lightningcss docs, npm). For
   **whole-stylesheet** ingestion (lightningcss's actual workload) that overhead amortizes
   over a large parse. For kf's workload — **per-token, per-frame** re-parse of a single
   `getComputedStyle` string (`value.js/src/units/normalize.ts:145,170`) and per-keystroke
   editor parses — the marshalling cost is paid *per tiny parse* and **dominates**. WASM
   is the wrong tool for a per-token hot path; the cost model is unchanged.

2. **The 2025 WASM-perf consensus matches the decline.** WASM's win is "raw,
   computationally intensive, CPU-bound tasks"; for small operations it adds a 40-50KB
   binary+glue floor and the narrative "WASM is always faster" is "a dangerous
   oversimplification" (byteiota 2025-benchmarks; Medium 2025 guide). A per-token CSS value
   parse is neither CPU-bound-at-scale nor large enough to amortize the floor.

3. **The SOTA win is architectural, and pure-TS already in-tree.** lightningcss/csstree's
   defining traits — tokenize-once · first-char dispatch · typed-value-per-property ·
   no-re-scan — are **all** realized by parse-that's `parseSingleValue`
   (`value.ts:11-87`) + `dispatch` (`leaf.ts:60-104`), in pure TS, already shipping in
   value.js's dependency graph. The forward path is **adopt the TS single-pass reader**
   (§1, §2.1), not compile Rust to WASM.

**Disposition: RECORD — WASM-DECLINED (re-confirmed, strengthened).** Do not build the
Rust→WASM bridge for the value.js/keyframes parser. The architectural win is pure-TS and
in-tree. This is the E verdict, re-grounded with current marshalling/cost-model evidence —
nothing changed it.

---

## 5. The span/single-pass / diagnostics nits — re-confirmed, no new substance

Re-confirmed as still-correct E hand-off items, recorded so they aren't lost (no new
grounding needed beyond E's):
- **A3 span/charCode leaves** where substrings are materialized then immediately consumed
  (`leaf.ts` `regex` does `substring` at `:213`); the stylesheet path re-scans
  (`balancedText` then re-parse). value.js-HANDOFF (the no-tokenizer root; adopt the
  `cssParser` reader to remove it).
- **A4 inline comment-skip** during whitespace consumption (parse-that ships
  `skipWsAndComments`, `scan.ts:34`), replacing a whole-input `stripCSSComments` pre-pass —
  preserves error-offset fidelity. value.js-HANDOFF.
- **A5 one shared `splitBalanced`** replacing the bespoke balanced-scan loops + `handleVar`'s
  recursive-regex paren-balancer (`index.ts:26-48`). value.js-HANDOFF (LOW).

These are unchanged; the §2.1 dispatch + the §1 `cssParser` adoption subsume most of their
value, so they should ride those tranches, not stand alone.

---

## 6. Disposition index

| # | Finding | `file:line` (value.js / parse-that / kf) | Disposition |
|---|---------|------------------------------------------|-------------|
| §1 | `cssParser` single-pass reader exists, value.js adopts none | `parsers/css/value.ts:11-87`, `scan.ts` | ALREADY-SOTA (engine) + value.js-HANDOFF (adopt — multi-week, gated) |
| §2.1 | `any()` → `dispatch()` at the 14-way color / 11-way value forks; **58** live `any(` sites | `color.ts:556`, `units.ts:78`; table = `value.ts:16-84`, `leaf.ts:60-104` | value.js-HANDOFF (MED) |
| §2.2 | `istring` non-anchored under sticky `y` → latent maximal-munch / loose boundary; replace with maximal-munch regex + `Set` (or adopt `scan.ts` `parseUnit`) | `utils.ts:5-8`, `units.ts:20-26`, order `constants.ts:2-41`; `scan.ts:91` | value.js-HANDOFF (MED — latent-correctness, not only perf) |
| §2.3 | `console.error` fires on every custom-color-name parse; reorder `parseCSSColor` to try the name map first | `color.ts:613-628`; `parser.ts:59,63` | value.js-HANDOFF (HIGH, cheap, iso) |
| §2.4 | Dead packrat cleared per parse; no left recursion; dispatch obviates it | `parser.ts` `.memoize()`; calc iterative `math.ts:74-95` | value.js-HANDOFF (MED — KILL, don't wire) |
| §3 | `linear()` parser — round-trip now severed on the **value.js end only**; kf shim awaits it; Baseline-WA 2026-06-11 | evaluator `easing.ts:33`, shape `:28`; kf shim `src/animation/utils.ts:106-130,190-193` | value.js-HANDOFF (MED-HIGH) + RECORDED kf F-PARSE-1 (retire the shim) |
| §3.2 | `cssLinear` flat-segment tie-break: returns left, spec wants last | `easing.ts:80-99` | value.js-HANDOFF (bundle with §3) |
| §3.4 | `steps()` argument parser — same shape as `linear()` | `easing.ts` `steppedEase`; kf `STEPS_LITERAL` `utils.ts:86` | value.js-HANDOFF (LOW-MED, bundle) |
| §4 | Rust→WASM parser real + benched but unbuilt for WASM; marshalling fatal to per-token workload | `rust/parse_that/` (no `cdylib`/`wasm_bindgen`) | RECORD — WASM-DECLINED (re-confirmed, strengthened) |
| §5 | A3 spans / A4 comment-skip / A5 `splitBalanced` | `leaf.ts:213`; `scan.ts:34`; `index.ts:26-48` | value.js-HANDOFF (LOW — ride §1/§2.1) |

**Net:** zero value.js writes from this lane (inv-16). One kf-side item RECORDED
(F-PARSE-1, retire `parseLinearStops`), not written. The E hand-off's Wave A + E1 shapes
are **re-confirmed and sharpened**, not overturned. The headline diffs F adds: (1) the
`linear()` round-trip is now one-ended (kf landed E.W7 S5), (2) `linear()` hits Baseline-WA
this month, (3) the `istring` hazard is latent-correctness, (4) the WASM decline is
strengthened by lightningcss's own documented marshalling tax.

---

## Sources

- parse-that engine + CSS reader: `/Users/mkbabb/Programming/parse-that/typescript/src/parse/{leaf.ts,parser.ts,parsers/css/value.ts,parsers/css/scan.ts}`
- value.js parser: `/Users/mkbabb/Programming/value.js/src/parsing/{units.ts,index.ts,color.ts,math.ts,utils.ts}`, `src/easing.ts`, `src/units/{constants.ts,normalize.ts}`
- kf consumers: `src/animation/{utils.ts,easing.ts,frame-compiler.ts}`, `src/animation/CLAUDE.md`
- Prior audit: `docs/tranches/E/audit/sota/{a-vj-parser.md,r-css-parsers.md,r-wasm-compile-perf.md}`, `docs/tranches/E/valuejs-sota-handoff.md`, `docs/tranches/E/FINAL.md`
- `linear()` Baseline: MDN `linear()` easing; web-platform-dx web-features-explorer (Baseline Widely-Available 2026-06-11); caniuse `mdn-css_types_easing-function_linear-function`
- WASM cost model: lightningcss-wasm (npm) + lightningcss docs (marshalling = main overhead); byteiota "Rust WebAssembly Performance 2025"; Medium "WebAssembly in 2025" (40-50KB floor, CPU-bound caveat)
- LL(1)/non-backtracking combinator theory: Semantic-Domain "Linear-time parser combinators"; Wikipedia "Parser combinator"
