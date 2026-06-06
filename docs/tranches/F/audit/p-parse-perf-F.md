# Tranche F deep-SOTA audit — lane `p-parse-perf-F`

**Scope.** The PARSE-time *performance* of the kf parse hot path the engine drives
through `@mkbabb/value.js` — `parseAndFlattenObject` (`src/animation/utils.ts:205`),
its `tryParse` over `any(FunctionArgs, CSSValues.Value)`, the `any()`-combinator
dispatch in value.js's grammar (the E-handoff Wave A `any()`→`dispatch()` lever), and
the kf-local `tryParseCache` (the E.W5 measure-first WITHHELD). The F disposition this
lane owes: **which parse wins are kf-side** (the consumption seam + the cache) **vs
value.js-handoff**, quantified against the live `tranche-e-impl` tree and the installed
`@mkbabb/value.js@0.10.0` + its bundled `@mkbabb/parse-that`.

**Method (inv ε — verify, do not assert).** Every kf claim is `file:line`-grounded
against the live tree. Every value.js claim is grounded against the installed dist (the
exact code kf runs) AND the live source at `/Users/mkbabb/Programming/value.js` (HEAD
`62f7e00`, tranche M open). The perf claims are **measured** with a shaped bench run in
the kf realm (vitest/jsdom, node 26, the same realm `bench/parser.bench.ts` uses) — I do
NOT re-cite the E SOTA estimates; I re-measure them. **inv-16:** value.js items are
HANDOFFs (proposals); this lane writes ONLY this doc and makes ZERO source edits.

**Relationship to the E evidence + sibling F lanes (diff, do not repeat).** The E lanes
`a-vj-parser.md` (§A1–A3, B1) and `d-vj-parse.md` (§2.1–2.3, §3) and the
`valuejs-sota-handoff.md` Wave A already MAPPED the value.js-side parse-perf
opportunities (dispatch, spans, single-pass, the numeric fast-path). The sibling F lanes
`a-parsing-post-e.md` and `a-vj-consumption-F.md` cover the consumption *correctness*
seam (composition/options/named-selectors drop, the `linear()` round-trip) and the
*named-surface* cross-repo edge. **This lane is the missing third axis: the parse-time
PERFORMANCE re-measure with a shaped bench, and the kf-side-vs-value.js split the F
charter asks for.** It does not re-derive the dispatch finding — it *quantifies* it on
the installed parse-that and locates where in the kf pipeline the cost actually lands.

---

## §0. The headline (one sentence each)

1. **The kf parse cost is COMPILE-TIME, not per-frame** — `parseAndFlattenObject` runs
   in `FrameCompiler.parse()` (`frame-compiler.ts:314`), once per compile / per editor
   keystroke; the per-frame rAF tick is `lerpValue(eased, iv)` (`engine.ts:629`) over
   pre-computed `interpVars` and parses NOTHING. This re-frames every parse-perf finding:
   the win is on **editor latency / cold first-paint**, not on steady-state animation
   FPS. (The per-frame computed-unit `calc()`/`var()` re-parse is value.js's
   `getComputedValue`, not kf — covered by the handoff Wave C / A6, not this lane.)

2. **The `any()`→`dispatch()` lever is REAL and now MEASURED in the kf realm** — on the
   installed parse-that, a last-branch match costs **206 ns vs dispatch's 56 ns = 3.65×**;
   first-branch is a tie (~50 ns). In the kf inner-parse, branch position dominates: `12px`
   (Length, branch 1/11) = **551 ns**, `50%` (Percentage, branch 7/11) = **3173 ns**, `0`
   (number, branch 10/11) = **1916 ns**. This is a **value.js-HANDOFF** (Wave A, unchanged)
   — kf cannot fix it (the `any()` forks are value.js-owned), and it is purely a
   compile-time cost. Carry it forward; do NOT manufacture kf work for it.

3. **The `tryParseCache` (E.W5 WITHHELD) is LOAD-BEARING and the withhold HOLDS** — a
   cold kf inner-parse of `50%` = **3114 ns**; a memoized hit = **27 ns** → **116×**. The
   cache is not speculative; it is the single biggest kf-side parse win and it already
   ships. The E withhold was about *eviction*, and the re-measure confirms eviction stays
   WITHHELD for the library/demo (bounded working set); the unbounded-memo hazard's
   terminal home is value.js's result cache, not this kf mirror. **RECORD.**

4. **One genuine kf-side micro-win exists** — `splitPathKey` (`utils.ts:52-54`) calls
   `key.split(".")` **twice** per parsed leaf (two array allocations) where `indexOf`/
   `lastIndexOf` are zero-alloc. Compile-time, tiny, but a clean **SHIP-in-F** (MEASURE-
   FIRST gated) — the only parse-perf item this lane finds that is wholly kf-owned and
   actionable without value.js.

5. **The parse-that fast tier is ALREADY-SOTA and dormant in value.js, NOT kf** — the
   `dispatch` primitive, zero-alloc leaves, and identity-keyed result cache are exemplary
   and already in the installed dist. kf consumes them transparently. Manufacture no kf
   work; the adoption is value.js's (Wave A).

---

## §1. The kf parse hot path — what it is, and WHERE it runs

The one kf parse entry is `parseAndFlattenObject` (`utils.ts:205-281`). Its inner
`parse` (`utils.ts:210-270`):

1. `splitPathKey(key)` → `{ mainKey, childKey }` (`utils.ts:211`).
2. fast-returns for already-typed `ValueUnit`/`FunctionValue`/`ValueArray` inputs
   (`:213-237`) — the `fromVars`/`fromKeyframes` paths that pre-parsed.
3. for a STRING value: builds `cacheKey = `${childKey}:${strValue}`` (`:240`), checks
   `tryParseCache` (`:241`), and on a miss runs
   `tryParse(any(CSSFunction.FunctionArgs, CSSValues.Value), strValue)` (`:257-260`),
   then caches `parsed.clone()` (`:267`).

**Where it runs — the load-bearing fact.** `parseAndFlattenObject` has exactly one
hot caller: `FrameCompiler.parse()` maps it over `templateFrames` (`frame-compiler.ts:
314-317`). `parse()` is the COMPILE step — invoked from `addFrame`/`fromString`/the
editor recompile, NOT the rAF loop. Verified: the per-frame tick `interpFrames →
lerpValue(eased, iv)` (`engine.ts:629`) reads `frame.interpVars` (pre-built
`InterpolatedVar`s minted at compile by `createInterpVarValue`, `utils.ts:283-341`) and
never re-enters `parseAndFlattenObject`. So:

> **Every parse-perf finding in this lane is a COMPILE-TIME / editor-keystroke cost.**
> It bites cold first-paint and editor-typing latency; it does NOT bite steady-state FPS.

(The one per-frame parse in the whole stack is value.js's `getComputedValue` re-parsing
the `getComputedStyle` read-back for an animating `calc()`/`var()` — `normalize.ts` —
which is the handoff Wave C / A6 territory, value.js-owned, and out of kf's hands. See
the sibling `a-vj-consumption-F.md` §2 C5 and the E `d-vj-parse.md` §3.)

---

## §2. The findings

### F-P1 · `any()`→`dispatch()` — RE-MEASURED in the kf realm — **value.js-HANDOFF** (Wave A, unchanged)

- **The lever (value.js-owned).** kf's inner parse wraps the value in
  `any(CSSFunction.FunctionArgs, CSSValues.Value)` (`utils.ts:258`).
  `CSSValues.Value = any(CSSWideKeyword, CSSValueUnit.Value, Function_, CSSString)`
  (`value.js/src/parsing/index.ts:235`), and `CSSValueUnit.Value` is an **11-way**
  `any(Length, Angle, Time, Frequency, Resolution, Flex, Percentage, Color, Slash,
  number, none)` (`value.js/src/parsing/units.ts:78-90`). value.js uses the `dispatch`
  primitive **nowhere** in its parser (grep `dispatch` over `value.js/src/parsing/` →
  only an unrelated color-space table + an at-rule comment). The handoff's "**65 any()
  sites**" is **re-confirmed live** (`grep -c "any(" value.js/src/parsing/*` = 65).
  `any` is a sequential for-loop that resets the offset and retries on each failure
  (`parse-that dist parse.js:500-514`); `dispatch` is an `Int8Array(128)` first-char LUT
  (`:520-558`). Both are exported from the installed dist (parse.js:2460, :2469).

- **The MEASURE (kf realm, installed parse-that, node 26, 2M ops).** An isolated 11-way
  fork, match in the worst position:

  | shape | `any()` | `dispatch()` | speedup |
  |---|---|---|---|
  | match = first branch | 49.3 ns | 51.4 ns | 0.96× (tie — LUT adds nothing) |
  | match = last (11th) branch | **206.0 ns** | **56.4 ns** | **3.65×** |

  And in the **actual kf inner-parse** (`tryParse(any(FunctionArgs, CSSValues.Value),
  …)`, no cache, 100k ops, jsdom):

  | value | branch in `units.ts:78` | ns/op |
  |---|---|---|
  | `12px` | Length (1/11) | **551** |
  | `45deg` | Angle (2/11) | 2226 |
  | `50%` | Percentage (7/11) | **3173** |
  | `#ff0000` | Color (8/11, hex-early) | 897 |
  | `red` | Color → name (last in CSSColor) | 1704 |
  | `rgb(1,2,3)` | Color → rgb fn | 2485 |
  | `0` | number (10/11) | **1916** |
  | `none` | CSSString fallthrough | 1777 |
  | `calc(100cqw - 100%)` | Function_ → MathFunction | **10412** |
  | `translateX(10px)` | Function_ → transform | 6959 |

  The branch-position signal is unambiguous: a `50%` (a *ubiquitous* keyframe value)
  costs ~6× a `12px` purely because Percentage is 7 branches deep and each prior branch
  runs `all(utils.number, <unit>)` and fails. A bare `0` (the single most common opacity/
  scale keyframe value) pays for 9 failed speculative descents before `number` matches.
  A first-char dispatch (`#`→hex, digit/`.`/`-`/`+`→number-prefixed dimension, letter→
  function/keyword/color-name) collapses each of these to one LUT read + the right branch.

- **Disposition — value.js-HANDOFF (carry Wave A forward UNCHANGED). It is NOT kf-side.**
  The `any()` forks are entirely value.js-owned; kf cannot dispatch them from the
  consumer side (it passes `CSSValues.Value` as an opaque `Parser`). The F re-measure
  *strengthens* the handoff's quantitative case (the prior lanes asserted the structure;
  this lane measures 3.65× at the tail and the steep branch-position gradient) and
  *bounds its value*: because the cost is compile-time (§1), the win is **editor-latency /
  cold-paint**, not FPS. The handoff gate ("parse-output deep-equal over the corpus +
  bench the color/value hot loop") is the right one; F adds the realm-grounded number.

- **Isomorphism.** As the handoff notes: dispatch selects the *same* parser `any` would
  reach; priority is preserved inside each bucket. Isomorphic, value.js-gated.

### F-P2 · `tryParseCache` — RE-MEASURED (E.W5 WITHHELD) — the cache is load-bearing, eviction still WITHHELD — **RECORD**

- **file:line.** `tryParseCache = new Map<string, ValueArray>()` (`utils.ts:203`),
  module-level (persists across every `parseAndFlattenObject`/`fromString` in the
  process), keyed `` `${childKey}:${strValue}` `` (`:240`), get-with-clone (`:243`),
  set-with-clone (`:267`). E recorded eviction as measure-first WITHHELD (`FINAL.md`
  §Recorded-WITHHELD: "a small working set; an LRU would be speculative complexity").

- **The MEASURE.** A cold kf inner-parse of `50%` = **3114 ns**; a memoized-hit
  (`parseCSSValue("50%")`, value.js's identity-keyed result cache, used here as the
  Map.get+clone proxy) = **27 ns** → **116×**. The cache is doing enormous work: it
  turns the 7-deep `any()` re-walk into a `Map.get` + a `ValueArray.clone()`. **This is
  the single biggest kf-side parse win and it already ships** — the E.W5 disposition to
  KEEP the cache is firmly vindicated.

- **Re-measure of the *eviction* question (the actual withhold).** The working set is
  the distinct `(childKey, value-string)` pairs across a process. For the library and
  any fixed animation set this is bounded by the CSS *authored*, not by time — it never
  grows per-frame (the per-frame path is `lerpValue`, never `parseAndFlattenObject`,
  §1). The one unbounded driver is an **editor generating fresh CSS per keystroke**
  (each distinct value string → a new permanent key). But: (a) per keystroke the *new*
  keys are few (one changed value), so the growth is O(distinct-values-ever-typed), not
  O(keystrokes); (b) the same hazard's terminal home is value.js's own result-cache
  layer — the handoff already names a bounded-LRU there (`valuejs-sota-handoff` F3 /
  the E `a-vj-parser.md` D1 memo). Growing a *second* eviction policy in this kf mirror
  while value.js's `parseCSSValue`/`parseCSSValueUnit` caches stay unbounded would be the
  wrong place — two policies, one drift surface. **Disposition: RECORD — the withhold
  HOLDS; if a bounded LRU lands, land it ONCE in value.js (the handoff names it) and let
  this kf cache inherit the shape, not fork its own.** No F write. (This concurs with the
  sibling `a-parsing-post-e.md` F-5; F-P2 adds the 116× measurement that proves the cache
  itself is non-negotiable, sharpening *why* only eviction — not existence — was ever the
  question.)

### F-P3 · `splitPathKey` double-`split(".")` — the one genuinely kf-side parse-perf win — **SHIP-in-F** (MEASURE-FIRST, LOW)

- **file:line.** `splitPathKey` (`utils.ts:52-62`):
  ```
  const childKey = key.split(".").pop();
  const mainKey  = key.split(".").shift();
  ```
  Two full `String.split(".")` calls per invocation → **two transient arrays allocated**
  for every parsed leaf, to extract the first and last path segment. It is called once
  per leaf in `parse` (`utils.ts:211`) and again inside the `ValueUnit`/`FunctionValue`/
  `ValueArray`/string branches (every `applyPropertyContext` consumer).

- **Why it is genuinely kf-side.** This is kf-owned code (`src/animation/utils.ts`), not
  value.js. The fix is local and zero-dependency: replace the two splits with
  `key.indexOf(".")` / `key.lastIndexOf(".")` + `slice` (zero array allocation, single
  string scan), or a single `split` reused for both ends. `flattenObject` (value.js)
  produces dotted keys like `transform.translateX`, so the slot extraction is hot during
  any multi-property keyframe compile.

- **Disposition — SHIP-in-F (MEASURE-FIRST, LOW). Honest sizing.** This is a compile-time
  micro-allocation, not a per-frame cost — its absolute impact is small (it rides the
  same compile pass dominated by the value.js `any()` walk, F-P1). So it ships only with
  a bench that BITES (extend `bench/parser.bench.ts` with a multi-property keyframe
  compile, assert the alloc/time delta) — per the §Mandate's measure-first clause, no
  speculative win. It is recorded here as the *only* parse-perf item wholly in kf's
  hands; if a wave has room it is a clean, isomorphic, zero-risk fold (the output
  `{ mainKey, childKey }` is byte-identical), otherwise it is a fair RECORD. **The honest
  call: SHIP if measured > noise, else RECORD — do not assert the win unmeasured.**

### F-P4 · The cache-key string allocation per miss — **RECORD** (subsumed by F-P2)

- **file:line.** Every cache MISS builds `` `${childKey}:${strValue}` `` (`utils.ts:240`)
  — a fresh string concat per first-time parse. On the cache-HIT path the same key is
  rebuilt (`:240` runs before the `.get`). This is a per-leaf string allocation on both
  hit and miss.
- **Disposition — RECORD.** It is dwarfed by the parse it guards (a hit saves ~3087 ns
  for the cost of one ~tens-of-ns key concat — F-P2's 116×). Eliminating the concat would
  need a nested `Map<childKey, Map<value, …>>`, which trades one string alloc for a Map
  alloc + two lookups — not obviously a win, and it muddies the simple keying. **No
  action; the simple flat-string key is correct.** Recorded for completeness so a future
  pass does not "optimize" it into a regression.

### F-P5 · `console.error` leak on parse failure — does it bite the kf hot path? — **value.js-HANDOFF** (Wave A diagnostics, RE-SCOPED by F)

- **The leak (value.js engine).** `parse-that dist parse.js:708` and `:712` call
  `console.error(state.toString())` whenever a top-level `parseState` ends in error —
  materializing the full caret/context render to a string + I/O. kf's inner parse goes
  through value.js's `tryParse`, which calls `parser.parseState(input)`
  (`value.js/src/parsing/utils.ts:42`) — so **the leak DOES fire on the kf path whenever
  a top-level parse genuinely fails.**
- **F's re-scope (the honest correction to the prior A1 framing).** The E `a-vj-parser`
  A1 claimed this is "on the *success* path of real stylesheets." For the **kf inner
  parse it is NOT**, because kf's grammar `any(FunctionArgs, CSSValues.Value)` ends in
  `CSSValues.Value`'s `CSSString` catch-all (`index.ts:222,235`: `regex(/[^()\{\}\s,;]+/)`)
  — almost every real keyframe value (including `none`, unknown idents, opaque tokens)
  *succeeds* via that fallthrough, so the top-level `parseState` does NOT error and the
  `console.error` does NOT fire. The leak bites kf only on a genuinely malformed
  top-level value (e.g. an unbalanced `(`) — rare on the compile path, and never
  per-frame (§1). **So for kf the leak is a real but LOW-frequency tax, not the
  "catastrophic hot-path" the A1 estimate implied.** Where A1's "spams on every custom
  color name" claim DOES hold is value.js-internal speculative branches (`fail()` inside
  `nameParser`, the `parseResult` fallback in `parseCSSColor`) — those reach
  `mergeErrorState` but only the *top-level* `parseState` logs, and kf's top level
  succeeds. **Disposition: value.js-HANDOFF (gate the two `console.error` behind the
  existing `isDiagnosticsEnabled()` flag — Wave A A1, carry forward). F's contribution is
  the RE-SCOPE: for the kf consumer the severity is LOW-on-malformed-input, not
  hot-path-catastrophic — correct the estimate, keep the fix.**

### F-P6 · Per-dimension `any(...UNITS.map(istring))` — the latent longest-match bug is also a kf correctness concern — **value.js-HANDOFF** (Wave A2, unchanged)

- **file:line.** `value.js/src/parsing/units.ts:20-26` — `lengthUnit =
  any(...LENGTH_UNITS.map(istring))` and six siblings; `LENGTH_UNITS` is the full
  relative+absolute set. Sequential `istring` alternation can match a *prefix* unit
  before a longer one depending on the const-array order (the handoff A2's `vmin` vs
  `vmax` vs `vb`, `svw` vs `s` note). This is the only Wave-A item that is *also* a
  correctness risk, and it reaches kf: kf animates these units (`50dvh` etc.) through the
  same `CSSValueUnit.Value` fork.
- **Disposition — value.js-HANDOFF (Wave A2, unchanged).** A single maximal-munch unit
  regex + `Set` classification is both faster and more correct; value.js-owned. Note the
  cross-ref: the sibling `a-vj-consumption-F.md` §2 C5 shows the *downstream* of this —
  `convertToPixels` no-ops 24-of-43 units (`50dvh→50px`); A2's parse fix and C5's convert
  fix are paired value.js correctness items kf consumes unchanged. No kf edge.

### F-P7 · The Rust/WASM stylesheet tier — **value.js-HANDOFF / WASM DECLINED** (carry forward, unchanged)

- The E handoff DECLINED WASM (the win is *architectural* — tokenize-once · dispatch ·
  typed values — all achievable in pure TS via parse-that's already-hand-written
  `parsers/css/`). F re-confirms this is the right call **specifically for the kf
  consumer**: kf's parse cost is per-value compile-time (§1), and the WASM call boundary
  (string in, struct out) loses for short per-value inputs and only pays for
  whole-stylesheet ingestion — which kf does NOT do on the hot path (it parses one value
  at a time via `parseAndFlattenObject`, not `parseCSSStylesheet` per frame). **The TS
  single-pass dispatch reader (Wave A) is exactly right for kf; WASM stays DECLINED.**
  value.js-HANDOFF, unchanged.

---

## §3. Disposition summary

| # | Finding | file:line | kf-side or value.js | Disposition |
|---|---------|-----------|---------------------|-------------|
| F-P1 | `any()`→`dispatch()` — 3.65× at tail, 6× branch-position spread (re-measured kf realm) | `value.js units.ts:78`, `index.ts:235`; kf `utils.ts:258` | **value.js** | **value.js-HANDOFF** (Wave A, unchanged; F adds the realm number + the compile-time bound) |
| F-P2 | `tryParseCache` — 116× (cache load-bearing); eviction stays withheld | `utils.ts:203,240-243,267` | **kf** (cache) / value.js (eviction home) | **RECORD** (withhold holds; eviction → value.js) |
| F-P3 | `splitPathKey` double-`split(".")` (2 allocs/leaf) | `utils.ts:52-62` | **kf** | **SHIP-in-F** (MEASURE-FIRST, LOW) — or RECORD if unmeasurable |
| F-P4 | Per-miss cache-key string concat | `utils.ts:240` | kf | **RECORD** (dwarfed by the parse it guards; do not "optimize") |
| F-P5 | `console.error` on parse failure — bites kf only on malformed top-level input | `parse-that parse.js:708,712`; via `value.js utils.ts:42` | value.js | **value.js-HANDOFF** (A1) — F RE-SCOPES severity to LOW for kf |
| F-P6 | Per-dimension `any(istring)` longest-match (perf + correctness) | `value.js units.ts:20-26` | value.js | **value.js-HANDOFF** (A2, unchanged) |
| F-P7 | Rust→WASM tier | `value.js` / parse-that rust | value.js | **value.js-HANDOFF / WASM DECLINED** (unchanged) |

**The F parse-perf split, stated plainly.** The dominant parse-perf lever (`any()`→
`dispatch()`, F-P1) is **value.js-side** and kf cannot touch it — it is the Wave A
handoff, carried forward UNCHANGED, now with a realm-grounded 3.65×-at-tail measurement
and the crucial bound that it is a **compile-time / editor-latency** cost, not a
per-frame FPS cost (§1). The biggest kf-side win — the `tryParseCache` — **already
ships** and is worth 116× per repeated value; the E.W5 *eviction* withhold holds and its
terminal home is value.js's result cache, not a second kf policy. The **only**
genuinely-kf-side, actionable parse-perf item is the `splitPathKey` double-split (F-P3),
a LOW micro-alloc that ships only if a bench bites — honest measure-first, not a
manufactured win. Everything else (F-P4, F-P6, F-P7) is RECORD or value.js-handoff.

---

## §4. ALREADY-SOTA — manufacture no kf work here

- **The kf parse seam is single-entry and clean.** One parse function
  (`parseAndFlattenObject`), one hot caller (`FrameCompiler.parse`), the per-frame tick
  parse-free. The cache is correct (clone-on-get + clone-on-set guards the value.js
  shared-instance memo contract — locked by `equivalence.test.ts`, cited in the sibling
  `a-parsing-post-e.md` §0). There is no kf-side parse refactor to propose beyond F-P3.
- **The parse-that fast tier kf transitively rides is exemplary** — `dispatch`
  (`parse.js:520`), the zero-alloc `string`/`regex`/whitespace leaves, the identity-keyed
  result cache. All ALREADY-SOTA (E `a-vj-parser` A4, D1; `d-vj-parse` §1). kf benefits
  the moment value.js adopts Wave A; nothing waits on kf.
- **kf does the right thing by NOT re-implementing the grammar.** It consumes value.js's
  `CSSValues.Value`/`CSSFunction.FunctionArgs` as opaque parsers and layers only the
  flatten + property-context + cache (`utils.ts`). The post-E barrel deletion (the
  sibling `a-vj-consumption-F.md` §0.3) means there is no kf parse-wrapper surface at all
  — kf imports value.js parsers directly. This is the ideal consumer shape. Do not churn.

---

## §5. Measured-bench provenance (re-runnable)

All numbers above were produced in the kf realm (the project's own
`node_modules/@mkbabb/value.js@0.10.0` + its bundled `@mkbabb/parse-that`), node 26:

- **Isolated `any` vs `dispatch`** — 11-way fork of `string()` leaves, 2M ops, warmup
  50k; first-branch tie (~50 ns), last-branch 206 ns vs 56 ns = 3.65×. (Ephemeral script
  run from the project root so the package resolves; NOT checked in — inv-16 / no source
  edit. Reproduce: `PT.any(...11)` vs `PT.dispatch(table)` over `'a'` and `'k'`.)
- **kf inner-parse by shape** — `tryParse(any(CSSFunction.FunctionArgs.map(setSubProperty),
  CSSValues.Value), str)` mirroring `utils.ts:251-260`, 100k ops, jsdom — the per-shape
  table in F-P1.
- **Cache 116×** — cold kf inner-parse `50%` = 3114 ns vs `parseCSSValue("50%")` memo hit
  = 27 ns. (F-P2.)
- The checked-in `bench/parser.bench.ts` already benches cold `fromString` (2-stop +
  11-stop); the F-P3 gate would extend it with a multi-property keyframe and a
  warm/editor-keystroke reparse shape — the natural home for the measure-first gate.

---

## inv-16 / inv ε compliance

This lane wrote ONLY `docs/tranches/F/audit/p-parse-perf-F.md`. ZERO source edits to
keyframes.js or value.js; the benches were ephemeral, run from the project root, and
removed. Every kf claim is `file:line`-grounded against live `tranche-e-impl`; every
value.js/parse-that claim against the installed `@mkbabb/value.js@0.10.0` dist (the code
kf runs) AND the live value.js source (HEAD `62f7e00`). Every perf claim is a measured
number from the kf realm, not a re-cited estimate. value.js items (F-P1, F-P5, F-P6,
F-P7) are HANDOFFs the value.js owner sequences against its own tranche discipline.

## Sources
- E SOTA parse lanes DIFFED (not repeated): `audit/sota/a-vj-parser.md` (A1 console.error,
  A2 packrat, A3 dispatch, B1 cssParser), `audit/sota/d-vj-parse.md` (§2.1 dispatch,
  §2.2 unit istring, §2.3 spans, §3 per-frame), `valuejs-sota-handoff.md` Wave A.
- Sibling F lanes cross-ref'd: `a-parsing-post-e.md` (F-5 tryParseCache, the consumption
  seam), `a-vj-consumption-F.md` (§2 C5 24-of-43 unit no-op, the single-dispatch seam).
- Live grounding: kf `src/animation/{utils,frame-compiler,engine}.ts`; value.js
  `src/parsing/{units,index,utils}.ts`; installed `parse-that dist/parse.js`
  (`any`:500, `dispatch`:520, `console.error`:708/712, `MEMO.clear`:696).
- `FINAL.md` §Recorded-WITHHELD (E.W5 tryParseCache eviction).
