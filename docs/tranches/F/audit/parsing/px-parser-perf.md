# Tranche F PARSING-SOTA deep-dive — lane `px-parser-perf`

**Lane scope.** PARSE-TIME *performance* across all three layers, **parse-that-first**:
`@mkbabb/parse-that` (the combinator engine — per-combinator closure alloc, the `any()`
linear re-scan, the `dispatch()` LUT, span vs substring) →
`@mkbabb/value.js` (the CSS parser built on it — the backtracking re-scan of `utils.number`,
the `flattenObject` re-walk, the memo) → keyframes.js (`parseAndFlattenObject` +
`FrameCompiler.parse`, the `tryParseCache` + clone tax). **The deliverable the charter
names me:** the **SHAPED parser bench** (the realistic keyframes/value workload) + a
**cross-layer cost-attribution model** with measured numbers + the honest disposition per
win (kf-side vs parse-that-HANDOFF vs value.js-HANDOFF).

**inv-16.** parse-that AND value.js are SEPARATE `@mkbabb` repos — every parse-that /
value.js item is a **HANDOFF PROPOSAL** the owner sequences. This lane writes ONLY this
keyframes.js doc and makes **ZERO** source edits to any repo. **inv ε.** Every claim is
`file:line`-cited against the live trees (re-grounded 2026-06-06); every perf number is a
**measured** figure from an ephemeral bench run in the kf realm (the project's own
`node_modules/@mkbabb/value.js@0.10.0` + bundled `@mkbabb/parse-that@0.8.2`, node 26,
`process.hrtime` over 100k–1M ops with warmup); the benches were run from the project root
and **removed** (inv-16 / no source edit). Every SOTA claim is web-sourced (end).

**Relationship to the sibling parsing lanes (DIFF + EXTEND, never repeat).** Four lanes
cover adjacent ground; I cite and go DEEPER on the parse-PERF axis they each defer:
- `p-parse-perf-F.md` — **the kf-side parse-perf re-measure** (the consumption seam, the
  `tryParseCache` 116×, `splitPathKey`, the `any()`→`dispatch` 3.65×-at-tail). I **extend**
  it: it measured the *consumer* path and the *isolated* fork; I add (a) the **closure-call
  cost model** isolated to 21× at the leaf tier, (b) the **`utils.number` backtracking
  re-scan** as the dominant value.js-internal cost (a dimension it did not isolate), (c) the
  **end-to-end `fromString` cross-layer attribution** (the 2.6× cache-busting spread), and
  (d) the **checked-in SHAPED bench design** (it used ephemeral scripts; the charter assigns
  me the durable bench).
- `px-vj-css-parser.md` — the value.js CSS parser, the 3-pass stylesheet, PX-1 the unsound
  id-keyed MEMO. **Orthogonal** (its axis is the value.js grammar *structure*; mine is the
  *cost*). I cite PX-1/PX-3/PX-4, do not re-derive.
- `px-parse-that-arch.md` — the parse-that *engine* architecture (the closure model §2
  ruled "RECORD, build-time"; the dead packrat §3; the global error state §4). I **sharpen
  its §2**: it concluded the closure-alloc cost is build-time-invisible and declined to
  measure — I **measure both halves** (build-time AND the per-invocation `any()` linear-scan
  closure-call tax) and show the §2 verdict is right for *build* but the *call-time* `any()`
  re-scan IS a hot-path cost the dispatch lever removes.
- `px-kf-grammar.md` — kf grammar/round-trip/diagnostics. **Orthogonal** (correctness, not
  perf); PX-3 there explicitly defers the perf axis to `p-parse-perf-F` and me.

---

## §0. Headline — the cost model in one breath, measured

The kf parse cost is **COMPILE-TIME, not per-frame** (`p-parse-perf-F` §1, re-confirmed:
the rAF tick reads pre-built `interpVars` via `interpFrames`/`lerpValue`,
`engine.ts:629` — it parses nothing). So every number below bites **cold first-paint and
editor-keystroke latency**, never steady-state FPS. Within that compile step, the parse
cost decomposes across the three layers, and the **measured** attribution is:

| Layer | Cost mechanism | Measured | Disposition |
|---|---|---|---|
| **parse-that** | `any()` N-way **linear re-scan** — closure-call tax, isolated | **132.7 ns** (11-way, last branch) vs **6.2 ns** dispatch = **21×** | parse-that-HANDOFF (expose) + value.js-HANDOFF (adopt) |
| **value.js** | `utils.number` **re-parsed 1–6×** inside failing dimension branches before the unit fork lands (the *backtracking re-scan*) | `12px` **197 ns** → `50%` **2691 ns** = **13.6×** spread | **value.js-HANDOFF (the dominant internal cost; NEW isolation)** |
| **value.js** | `CSSValues.Value` (4-way) **stacked over** `CSSValueUnit.Value` (11-way) `any()` | `50%` inner-parse **3054 ns** vs `12px` **400 ns** | value.js-HANDOFF (dispatch both forks) |
| **kf** | `tryParseCache` get/set **clone tax** + double memo | 116× cache win (load-bearing); clone is the price | RECORD (withhold holds; FOLD post-adopt) |
| **kf** | `flattenObject` re-walk per template frame | **613 ns** / frame | RECORD (value.js-owned; modest) |
| **end-to-end** | `fromString` 11-stop, warm vs cache-busting | **94 µs** warm → **247 µs** fresh = **2.6×** parse-attributable | the bench gate for all the above |

**The single sharpest NEW finding (PXP-2):** the value.js cost is **not merely** "the
right branch is 7 deep" (the prior framing) — it is that **branches 1–6 each *succeed* at
`utils.number`** (every dimension parser is `all(utils.number, <unit>)`, `units.ts:32-62`),
so a `50%` parse **re-scans and re-allocates the number `50` six times** before `Percentage`
matches, then a seventh in `Percentage` itself. The cost is **redundant successful
sub-parses**, not failed prefix probes — which is *exactly* what a first-char dispatch
(`digit → the number-prefixed dimension subtree, classified by the trailing unit`) collapses
to **one** number-scan. This re-frames the `any()`→`dispatch` handoff from "reorder the
trials" to "stop re-parsing the number N times."

**ALREADY-SOTA, stated plainly (manufacture no work):** the parse-that leaf tier
(mutable single-state offset-rewind, zero-alloc `string`/`regex`/whitespace leaves,
`leaf.ts:138-262`) and the `dispatch` primitive (`leaf.ts:60-104`) are at the JS-combinator
frontier; the kf consumption seam (one parse fn, one hot caller, parse-free tick) is the
ideal consumer shape; the `tryParseCache` 116× is non-negotiable and already ships. The gap
is **adoption of the dispatch the engine already exports**, not invention — and the
**durable SHAPED bench** (§5) that gates it.

---

## §1. PXP-1 · The `any()` linear re-scan IS a hot-path closure-call cost — `px-parse-that-arch` §2 sharpened — **parse-that-HANDOFF (expose) + value.js-HANDOFF (adopt)**

`px-parse-that-arch` §2 concluded the per-combinator closure allocation is "build-time, not
hot-path… RECORD, ALREADY-SOTA for the JS workload." That verdict is **correct for the
*allocation*** — the closures are minted once at grammar construction. But it left a second
cost unmeasured: the **per-invocation cost of the `any()` closure's linear for-loop**, which
*is* on the hot path. I isolate both halves.

### The mechanism (file:line)

`any()` (`leaf.ts:28-49`) is a closure over a `for (const parser of parsers)` loop that, on
each failed arm, saves/restores `state.offset` and re-runs the next arm's `.parser(state)`
(`:32-39`). `dispatch()` (`leaf.ts:60-104`) reads `state.src.charCodeAt(state.offset)` once,
indexes an `Int8Array(128)` LUT, and jumps straight to the one parser (`:89-94`). The leaf
tier is identical; the only difference is **N sequential closure-calls vs one LUT read +
one closure-call**.

### The measure (kf realm, 11-way fork of trivial `string()` leaves, 1M ops)

Isolating the *dispatch overhead alone* (trivial leaves, so the leaf cost is ~constant and
the delta is pure fork-selection cost):

| fork | match = branch 1 | match = branch 11 |
|---|---|---|
| `any()` | **4.5 ns** | **132.7 ns** |
| `dispatch()` | 5.6 ns | **6.2 ns** |

**21× at the tail** (132.7 / 6.2), and dispatch is *flat* across branch position while
`any()` is linear in it. This is a **larger** ratio than `p-parse-perf-F`'s 3.65× because
that figure included the (constant) leaf-parse cost in both numerator and denominator; my
probe isolates the **fork-selection closure-call tax** itself, which is what dispatch
actually removes. Both numbers are correct and complementary: 3.65× is the *end-to-end*
shape ratio at the real value fork, 21× is the *pure dispatch lever* at the engine tier.

### Disposition

**parse-that-HANDOFF (expose) + value.js-HANDOFF (adopt).** `dispatch` is built, exported
(`index.ts`), and proven in parse-that's own reference JSON parser (per `px-parse-that-arch`
§1). kf cannot reach it — it passes `CSSValues.Value` as an opaque `Parser` (`utils.ts:258`)
— so this is **value.js-side adoption** at the two stacked forks (§2). The `px-parse-that-arch`
§2 RECORD on the *allocation* stands unchanged; my contribution is that the **call-time
re-scan is a real, measured, branch-position-linear hot-path cost** (21× at the tail), so the
dispatch adoption is a perf lever, not just an elegance one. Iso: dispatch reaches the same
parser `any` would (priority preserved per bucket), so output is byte-identical.

---

## §2. PXP-2 · The `utils.number` backtracking re-scan is the DOMINANT value.js-internal cost — **value.js-HANDOFF (NEW isolation, MED-HIGH)**

The sharpest new finding, and the one no prior lane isolated: the value.js cost is
**redundant *successful* sub-parses**, not failed prefix probes.

### The mechanism (file:line)

`CSSValueUnit.Value = any(Length, Angle, Time, Frequency, Resolution, Flex, Percentage,
Color, Slash, number, none)` (`units.ts:78-90`) — and **each of the first six dimension
parsers is `all(utils.number, <unit>)`** (`units.ts:32,42,46,52,56,60`). `all` (`leaf.ts:107-135`)
runs `utils.number` (`utils.ts:16`, a substring-materializing `regex` over the numeric shape)
**to success**, then runs `<unit>`, and only the unit fails — at which point `any()` restores
the offset and the **next** dimension parser **re-parses the same number from scratch.** So
for `50%` (Percentage is branch 7):

> `utils.number` parses `50` and **succeeds** in Length, Angle, Time, Frequency, Resolution,
> Flex — **six redundant successful number-scans + six substring allocations** — each
> failing only at the unit, before `Percentage` (branch 7) parses `50` a **seventh** time
> and matches `%`.

This is categorically worse than a "fail-fast prefix probe" (which would bail on char 1):
every failed dimension branch does the **full** number sub-parse, the most expensive leaf in
the chain, and throws the result away.

### The measure (kf realm, bare `CSSValueUnit.Value`, 100k ops)

| value | branch | ns | what dominates |
|---|---|---|---|
| `12px` | Length (1/11) | **197** | one number-scan, matches immediately |
| `0` | number (10/11) | **1482** | **9 failed dimension descents**, each a full number-scan |
| `50%` | Percentage (7/11) | **2691** | **6 redundant number-scans** + the 7th that matches |

**13.6× spread** (`50%` / `12px`), and the gradient is monotonic in branch depth. The
ubiquitous keyframe values — `50%` (every two-keyframe stop), bare `0`/`1` (opacity, scale) —
are the **slowest**, paying for number-scans they discard.

### Why dispatch is the exact fix (and why it is more than "reorder")

A first-char dispatch on `units.ts:78` routes `digit | '.' | '-' | '+'` → **one**
number-prefixed dimension subtree (parse the number **once**, then classify by the trailing
unit token), `letter` → Color/keyword, `'/'` → Slash. The number is scanned **once**, the
unit classified once. This collapses the `50%` path from seven number-scans to one — a
structural win the "branch reordering" framing undersells. The `px-vj-css-parser` PX-4 names
the unit-classifier longest-match fix; **PXP-2 adds the upstream root**: the number itself is
re-scanned, and dispatch fixes that before the unit even matters.

### Disposition

**value.js-HANDOFF (NEW, MED-HIGH).** This is the value.js-side dispatch adoption (§1's
consumer) with the **measured root cause** the prior lanes did not isolate: the cost is the
re-scanned `utils.number`, 6× for `50%`, 9× for `0`. Falsifiable gate: deep-equal over the
value/unit corpus **+ a number-scan-count assertion** (instrument `utils.number` invocation
count: `50%` must scan the number once post-dispatch, not seven times). Iso: dispatch reaches
the same `ValueUnit`; the only change is the count of discarded sub-parses. **Sequence:** this
is the highest-leverage isomorphic value.js parse-perf win and should lead the value.js
adoption wave.

---

## §3. PXP-3 · kf stacks a 4-way `any()` over the 11-way — and the `tryParseCache` clone tax is the price of the cross-realm seam — **RECORD + kf-FOLD (post-adopt)**

### The stacked forks (file:line)

kf's inner parse (`utils.ts:257-260`) is `tryParse(any(CSSFunction.FunctionArgs,
CSSValues.Value), str)`, and `CSSValues.Value = any(CSSWideKeyword, CSSValueUnit.Value,
Function_, CSSString)` (`value.js index.ts:235`). So a bare `50%`:
- enters kf's outer `any(FunctionArgs, Value)` — `FunctionArgs` fails (no `(`),
- enters `CSSValues.Value`'s 4-way — `CSSWideKeyword` fails (not `inherit`/…), then
- enters `CSSValueUnit.Value`'s 11-way (§2) — the 6× number re-scan,
- and only if **all** fail does `CSSString` (`index.ts:222`, `regex(/[^()\{\}\s,;]+/)`) catch.

**Measured inner-parse** (kf realm, no cache, 100k ops): `50%` = **3054 ns**, `12px` =
**400 ns**, `translateX(20px)` = **6319 ns** (the function path), `red` = **1497 ns** (Color
name, last in the 14-way color fork). The stacked-fork overhead is the §1 21× lever applied
twice (4-way then 11-way), atop the §2 re-scan.

### The clone tax (file:line)

`tryParseCache` (`utils.ts:203`) keys `` `${childKey}:${strValue}` `` (`:240`) and clones the
`ValueArray` on **both** get (`:243`) and set (`:267`) — because the cached value is mutated
downstream by `applyPropertyContext`/`setSubProperty` (`:251-255`). The cache itself is
**load-bearing** (`p-parse-perf-F` F-P2: 116× — re-confirmed, my `parseCSSValueUnit` memo-hit
= **24 ns** vs cold inner-parse 3054 ns), but it pays a **deep `ValueArray.clone()` per
hit**, and runs a **second** memo layer atop value.js's own identity-keyed result cache. The
cross-realm `as any` cast on the parser (`:251,258`) exists because kf and value.js bundle
**separate** `@mkbabb/parse-that` realms (the comment `:246-250`).

### Disposition

**RECORD + kf-FOLD (post-adopt).** The clone is NOT a free delete — it guards value.js's
shared-instance memo contract (locked by `equivalence.test.ts`). The right sequencing
(concurring with `px-vj-css-parser` PX-6): once value.js ships a dispatch/typed-value reader
(§2), kf can cache the **immutable typed value** and apply property-context as a
**non-mutating projection** — collapsing to one memo, no clone. That is a **kf wave** gated on
the value.js adoption, not this lane's write. The dual-realm parse-that is a
`package.json`-dedupe concern (hoist a single `@mkbabb/parse-that`) — out of parsing-perf
scope, RECORDED. The 116× cache win and its eviction-withhold (E.W5) both **hold** unchanged.

---

## §4. PXP-4 · The span/zero-copy lever — measured per-frame relevance, and the SOTA frontier — **value.js-HANDOFF (RIDE the dispatch wave)**

`px-vj-css-parser` PX-5 and `px-parse-that-arch` §5 inventory the unused `span.ts` surface
(17 span combinators, `takeUntilAnySpan`'s `Uint8Array(128)` byte-class scanner). I add the
**parse-perf-specific measure of where it bites** and the **honest sizing**.

### Where substring-materialization actually costs (file:line + measure)

Every value leaf materializes a substring then discards it: `utils.number` (`utils.ts:16`)
`regex`-matches the numeric substring (`leaf.ts:213` `state.src.substring(...)`) then
`.map(Number)` throws it away. Per §2, for `50%` that substring is allocated **seven times**.
So the span lever and the dispatch lever **compound**: dispatch removes 6 of the 7
*invocations*; span removes the *allocation* from the surviving one (`Number(src.slice(...))`
defers to the single consumption, or a charCode `parseNumber` needs no substring at all).

**The one place this touches the frame budget** (not just compile): the per-frame computed-unit
path. An animating `calc(100cqw - 100%)` re-parses a fresh `getComputedStyle` read-back **per
rAF tick** via `parseCSSValueUnit` (value.js `normalize.ts`) — each tick allocating the number
+ unit substrings. `flattenObject` treats `calc()` as **atomic** (value.js
`index.ts:50-53`, the `MEMO.md` calc-atomicity note) so the calc body is re-parsed whole. This
is the *only* parse-alloc that shows up in the frame budget, and it is value.js-owned (Wave C
/ A6 territory, `p-parse-perf-F` §1, `vj-units-compute-aug`).

### The SOTA frontier (web-grounded)

The field has converged exactly where parse-that's `span.ts` already sits:
- **csstree** encodes tokens as `(type, start, end)` **offset spans in typed arrays**
  (`Uint8Array`/`Uint32Array`), evolved from 9→5 values/token (8.8MB→4.9MB for ~983k tokens),
  and separates tokenization from parsing because "string-to-tokens takes more time than
  parsing" — 24 ms on bootstrap.css (vs PostCSS 38 ms). [csstree]
- **projectwallace/css-parser** (2025) is **zero-allocation** with all memory allocated
  upfront on heuristics (GC-avoidant), **Data-Oriented contiguous memory**, first-class
  location. [projectwallace]
- **winnow** (`dispatch` macro): "when alternatives have unique prefixes, dispatch offers
  better performance" than `alt` via a deterministic first-token match — i.e. §1/§2 in Rust.
  [winnow]

All three are the **span + first-token-dispatch** model parse-that *exports* and value.js
*does not consume*. The frontier confirms the path is **adopt the in-language primitives**,
not WASM.

### Disposition

**value.js-HANDOFF — RIDE the §2 dispatch wave.** Span-ifying the leaves is the A3/PX-5
isomorphic win; its standalone value is modest (the dispatch wave removes most of the
*invocations* that would allocate), so it should **ride** the dispatch tranche, not stand
alone — except the **per-frame computed path** (the one frame-budget bite), which is its own
value.js Wave C item. Honest sizing: the full `parseSingleValue`/`span.ts` adoption is the
multi-week parity-gated transposition (`px-vj-css-parser` PX-2); the cheap isomorphic dispatch
(§2) is the lead win. **WASM stays DECLINED** — re-confirmed from the parse-perf angle: the
marshalling tax (`TextEncoder`/`TextDecoder`) is paid **per value** on kf's per-token workload
(`parseCSSValueUnit("12px")`, the per-frame computed re-parse), dwarfing the 200 ns–3 µs it
would replace; the win is whole-buffer, which kf never does on the hot path
(`vj-parser-aug` §4, `px-vj-css-parser` PX-8, `p-parse-perf-F` F-P7 — all concur).

---

## §5. The SHAPED parser bench — the charter deliverable — **SHIP-in-F (kf doc; the durable bench)**

`p-parse-perf-F` used **ephemeral** scripts (run from root, removed). The charter assigns me
the **durable, checked-in** shaped bench. The existing `bench/parser.bench.ts` benches only
cold `fromString` (2-stop + 11-stop) — it does **not** isolate the layers, does **not**
exercise the cache-busting (truly-cold) path, and does **not** carry the per-shape value
table that makes a regression visible. The design (a kf-side SHIP — it is the project's own
bench harness, vitest bench, no source-logic change):

**Shape 1 — the realistic value corpus (the parse-time workload).** A `bench` per value
*shape*, mirroring `utils.ts:257-260`, over the values kf actually animates: `0`, `1`, `0.5`
(bare numbers), `50%`/`100%` (percentages — the ubiquitous stop), `12px`/`20px` (length),
`45deg` (angle), `#ff0000`/`red` (color), `translateX(20px)`/`translateY(10px)` (functions),
`calc(100cqw - 100%)` (computed). This makes the §2 branch-position gradient a **visible,
regressing** signal: a value.js dispatch adoption must collapse the `50%`/`0` rows toward the
`12px` row, and the bench *proves* it.

**Shape 2 — the cache-buster (the editor-keystroke / cold-paint reality).** A `fromString`
bench that generates **distinct value strings each call** (cache-busting the `tryParseCache`
+ value.js memo), so the bench measures the **true parse cost**, not the 24 ns memo-hit. My
measure: 11-stop **warm 94 µs → cache-busting 247 µs** (**2.6×**). The warm number flatters
the parser; the cache-buster is what an editor user types feels. **Both** belong in the
bench, side by side, labelled.

**Shape 3 — the layer-isolation micro-bench (the regression guard for the handoffs).** A
`bench` comparing `any(...11)` vs `dispatch(table)` on the kf realm's parse-that (the §1 21×
lever) and bare `CSSValueUnit.Value` per shape (the §2 13.6× spread). When value.js ships the
dispatch wave, these micro-benches are the **falsifiable proof** the adoption landed (the
ratios collapse). This is the bench form of `p-parse-perf-F`'s F-P3 "MEASURE-FIRST" gate,
made durable.

**Disposition — SHIP-in-F (kf doc).** Extend `bench/parser.bench.ts` with the three shapes
above. It is wholly kf-owned (the bench harness), zero library-logic change, and it is the
**measurement substrate** every value.js parse-perf handoff (§1/§2/§4) must pass before it is
called done. It also subsumes `p-parse-perf-F`'s F-P3 `splitPathKey` gate (the multi-property
keyframe compile) — Shape 1's `translateX(20px) translateY(10px)` row exercises the
double-`split(".")` path the F-P3 micro-win needs to bite against.

---

## §6. The genuinely-kf-side parse-perf items (the only ones kf can ship without a handoff)

Both are RECORDED by `p-parse-perf-F`; I re-confirm sizing and gate them to Shape 1/3.

- **`splitPathKey` double-`split(".")`** (`utils.ts:52-54`) — two array allocations per parsed
  leaf where `indexOf`/`lastIndexOf`+`slice` are zero-alloc. **SHIP-in-F (MEASURE-FIRST, LOW)**
  — gated on the Shape-1 multi-property row biting above noise (per `p-parse-perf-F` F-P3,
  unchanged; my bench is the gate). Iso: `{mainKey, childKey}` byte-identical.
- **The cache-key string concat per leaf** (`utils.ts:240`) — **RECORD**, dwarfed by the
  116× parse it guards; "optimizing" it into a nested Map trades one string-alloc for a
  Map-alloc + two lookups (`p-parse-perf-F` F-P4, concur — do not touch).

Everything else is a parse-that-HANDOFF (§1 expose) or value.js-HANDOFF (§2 dispatch, §4
span/per-frame) — kf cannot reach the `any()` forks from the consumer side.

---

## §7. Disposition index

| # | Finding | `file:line` | Layer | Disposition |
|---|---------|-------------|-------|-------------|
| **PXP-1** | `any()` linear re-scan is a **hot-path closure-call** cost (21× at the tail, branch-position-linear) — sharpens `px-parse-that-arch` §2's build-time-only verdict | `leaf.ts:28-49` (any), `:60-104` (dispatch); kf `utils.ts:258` | parse-that → value.js | **parse-that-HANDOFF (expose) + value.js-HANDOFF (adopt)** |
| **PXP-2** | **`utils.number` re-parsed 1–6× per value** before the unit fork lands — the *redundant successful sub-parse* is the dominant value.js cost (13.6× `50%`/`12px` spread); NEW isolation | `units.ts:32-62,78-90`; `all` `leaf.ts:107-135` | value.js | **value.js-HANDOFF (NEW, MED-HIGH — leads the dispatch wave)** |
| **PXP-3** | kf stacks 4-way over 11-way `any()`; `tryParseCache` clone-tax + double memo is the cross-realm-seam price (cache 116×, load-bearing) | kf `utils.ts:203,240,243,257-267`; `value.js index.ts:235` | kf | **RECORD + kf-FOLD (post-adopt; concur PX-6)** |
| **PXP-4** | Span/zero-copy lever compounds with dispatch (removes the alloc from the surviving scan); the one per-frame parse-alloc is `calc()` computed re-parse; WASM re-declined | `utils.ts:16`, `leaf.ts:213`; value.js `normalize.ts`, `index.ts:50-53`; `span.ts` | value.js | **value.js-HANDOFF (RIDE §2) + WASM-DECLINED** |
| **PXP-5** | **The SHAPED parser bench** (value-corpus + cache-buster + layer-isolation) — the durable measurement substrate every handoff must pass | `bench/parser.bench.ts` | kf | **SHIP-in-F (kf doc; the charter deliverable)** |
| **PXP-6** | `splitPathKey` double-split (LOW) / cache-key concat (RECORD) — the only kf-owned items | `utils.ts:52-54,240` | kf | **SHIP-in-F (MEASURE-FIRST, gated to PXP-5) / RECORD** |

**The parse-perf split, stated plainly (the charter's question).** The **dominant** parse
cost is **value.js-internal** — the `utils.number` backtracking re-scan (PXP-2, 13.6×) under
the stacked `any()` forks (PXP-3) — and kf **cannot touch it** (opaque `Parser`). The lever
is the `dispatch` parse-that **already exports** (PXP-1, 21× isolated), adopted **once in
value.js** at the two forks, which removes the re-scan at its root. The **span** lever (PXP-4)
compounds but rides that wave; **WASM stays declined** (per-token marshalling). The **only**
kf-owned parse-perf action is the `splitPathKey` micro-win (PXP-6, gated). And the **durable
SHAPED bench** (PXP-5) is the kf-side deliverable that makes every one of these falsifiable.
No work is manufactured: the leaf tier, the `dispatch` primitive, the `tryParseCache` 116×,
and the parse-free per-frame tick are **ALREADY-SOTA** and untouched.

---

## §8. Measured-bench provenance (re-runnable)

All numbers produced in the kf realm (`node_modules/@mkbabb/value.js@0.10.0` + bundled
`@mkbabb/parse-that@0.8.2`), node 26, `process.hrtime` over the iteration counts noted, with
warmup. Ephemeral scripts run from the project root and **removed** (inv-16 / no source edit):
- **§1 any vs dispatch** — 11-way fork of trivial `string()` leaves, 1M ops, warmup 50k:
  `any()` first-branch 4.5 ns / last-branch 132.7 ns; `dispatch()` 5.6 / 6.2 ns → **21× at
  the tail**. (Reproduce: `any(...11 string leaves)` vs `dispatch({a..k})` over `'a'`/`'k'`.)
- **§2 number re-scan** — bare `CSSValueUnit.Value`, 100k ops: `12px` 197 ns, `0` 1482 ns,
  `50%` 2691 ns → **13.6×**.
- **§3 inner-parse by shape** — `any(FunctionArgs, CSSValues.Value)` mirroring `utils.ts:258`,
  100k ops: `12px` 400, `50%` 3054, `translateX(20px)` 6319, `red` 1497, `#ff0000` 702 ns;
  `parseCSSValueUnit` memo-hit 24 ns.
- **§4/end-to-end** — `fromString` 11-stop via `engine.ts` (`tsx`): warm 94 µs, cache-busting
  (distinct values/call) 247 µs → **2.6×**. `flattenObject(frameVars)` 613 ns/frame;
  300-combinator construction 18 µs (one-time, build-side — confirms `px-parse-that-arch` §2's
  build-time-only allocation verdict).
- The checked-in `bench/parser.bench.ts` is the SHIP target (PXP-5); these ephemeral shapes
  are its design source.

---

## inv-16 / inv ε compliance

This lane wrote ONLY `docs/tranches/F/audit/parsing/px-parser-perf.md` and made **ZERO**
source edits to keyframes.js, value.js, or parse-that. Every parse-that item (PXP-1 expose
`dispatch`) is a **parse-that-HANDOFF**; every value.js item (PXP-2 dispatch the unit fork,
PXP-4 span leaves / per-frame compute) is a **value.js-HANDOFF**; the kf items (PXP-3 FOLD,
PXP-5 bench, PXP-6 `splitPathKey`) are kf-side, with only PXP-5/PXP-6 actionable now (PXP-3
FOLD is gated on the value.js adoption). Every claim is `file:line`-cited against the live
trees (`/Users/mkbabb/Programming/parse-that/typescript/src/parse`,
`/Users/mkbabb/Programming/value.js/src/parsing`, `keyframes.js/src/animation`), re-grounded
2026-06-06; every perf number is a measured figure from an ephemeral kf-realm bench (removed);
every SOTA claim is web-sourced. Sibling lanes (`p-parse-perf-F`, `px-parse-that-arch`,
`px-vj-css-parser`, `px-kf-grammar`, `vj-parser-aug`) are **cited and diffed, never
re-derived** — this lane is the cross-layer parse-PERF cost-model + the durable SHAPED bench
beneath them.

## Sources

- **parse-that engine:** `typescript/src/parse/{leaf.ts (any:28, dispatch:60, all:107),
  parser.ts (combinator closures :149-224, MEMO :19-44), state.ts, span.ts}`.
- **value.js parser:** `src/parsing/{units.ts (Value:78, all(number,unit):32-62),
  index.ts (CSSValues.Value:235, calc-atomic:50-53), color.ts, utils.ts (number:16, istring:5)}`,
  `src/units/normalize.ts` (per-frame computed re-parse).
- **kf consumers:** `src/animation/{utils.ts (parseAndFlattenObject:205, tryParseCache:203,
  splitPathKey:52, inner-parse:257-260), frame-compiler.ts (parse:309, parseAndFlatten:315),
  engine.ts (per-frame lerpValue:629)}`, `bench/parser.bench.ts`.
- **Sibling F lanes** DIFFED + EXTENDED (not repeated): `p-parse-perf-F.md` (the kf-side
  re-measure — I add closure-call isolation, number-rescan, e2e attribution, durable bench),
  `px-parse-that-arch.md` (§2 closure model — I sharpen with the call-time measure),
  `px-vj-css-parser.md` (PX-2/4/5/8 — cited), `px-kf-grammar.md` (orthogonal),
  `vj-parser-aug.md` (§2/§4 — cited). E `valuejs-sota-handoff.md` Wave A.
- **SOTA frontier (web, 2025-26):**
  - winnow `dispatch` (first-token > `alt` for unique prefixes):
    <https://docs.rs/winnow/latest/winnow/combinator/macro.dispatch.html>,
    <https://epage.github.io/blog/2023/07/winnow-0-5-the-fastest-rust-parser-combinator-library/>
  - csstree (separate tokenization; `(type,start,end)` typed-array offset spans; 24 ms
    bootstrap.css): <https://github.com/csstree/csstree>,
    <https://github.com/csstree/csstree/blob/master/docs/parsing.md>
  - projectwallace/css-parser (2025; zero-allocation upfront, Data-Oriented contiguous memory,
    GC-avoidant): <https://github.com/projectwallace/css-parser>
  - CSS Syntax Module Level 3 (the tokenizer the field implements):
    <https://www.w3.org/TR/css-syntax-3/>
