# Tranche F deep-SOTA audit — lane `r-css-parsers-wasm`

> **Scope.** CSS-parsing SOTA for the keyframes.js stack: value.js's
> `@mkbabb/parse-that`-combinator CSS grammar (the heavy surface keyframes consumes),
> the SOTA parse *architecture* (single-pass / span-preserving / zero-copy
> tokenization / error recovery), the compile-to-WASM/Rust angle, and the
> `any()`-combinator dispatch cost (E handoff Wave A).
>
> **What F adds over E.** Tranches D + E are CLOSED. The four E parser lanes
> (`r-css-parsers`, `r-wasm-compile-perf`, `a-vj-parser`, `d-vj-parse`) are deep and
> correct; I do **not** re-derive them. F's job: (1) **re-MEASURE** E's Wave A claim
> against the *installed* `@mkbabb/value.js@0.10.0` dist with cold-parse
> microbenchmarks, (2) re-examine the **WASM decline** with current (2026-06)
> evidence, (3) find what is **STILL not-SOTA AFTER D+E landed** — and the one thing
> that is: **E.W7 S5 grew a kf-PRIVATE CSS-easing parser** (three hand-rolled regex
> matchers in `src/animation/utils.ts`) because the value.js half (Wave E1/E2) never
> shipped. That is a NEW, live, file:line-grounded F finding, not in any E doc.
>
> **inv-16.** value.js is dirty + active (branch
> `docs/constellation-grand-audit-2026-06-03`, **tranche M open** — verified live;
> the parser is **unchanged** since E synthesis: 58 `any()` sites, `dispatch`
> unused in `src/parsing`, no `linear()` parser, `convertToPixels` still no-ops the
> 24 units). Every value.js item below is a **value.js-HANDOFF** proposal — F writes
> only this keyframes.js doc and makes ZERO source edits.

---

## 0. Headline + disposition index

| # | Finding | New vs E? | Disposition |
|---|---------|-----------|-------------|
| F-1 | **kf grew a private CSS-easing parser** — 3 hand-rolled regex matchers + manual `split` in `utils.ts:80-194` (E.W7 S5), because value.js Wave E1/E2 never landed | **NEW (F)** | **RECORD + value.js-HANDOFF** (the consolidation is gated on vj E1/E2) |
| F-2 | **Re-measured Wave A: the cost ranking is A2 > A1**, not A1 > A2 as E claimed. Cold-parse cost scales **monotonically with unit array position** (`px` 583 ns → `cqmax` 2435 ns, 4.2×) — the per-dimension `any(istring)` dominates the *dominant value shape* | **NEW measurement (F)** | **value.js-HANDOFF** (re-prioritize Wave A2 ahead of A1) |
| F-3 | **The memo erases all of it in kf's real workload** — kf parses at *compile* time, not per rAF frame (except computed units). Steady-state = ~30 ns memo-hit. The cold cost matters for first-paint + editor-keystroke + the computed-unit per-frame path only | confirms E F1.3/F7, **measured** | **MEASURE-FIRST / honest-scoping** |
| F-4 | **WASM decline HOLDS** with 2026 evidence — `lightningcss-wasm@1.30.1` ships, but its wins are whole-stylesheet (Bootstrap 4 / 4.16 ms); parse-that's Rust crate still has no `cdylib`/`wasm_bindgen`. **Plus:** CSS Typed OM `CSSStyleValue.parse()` is **STILL not Baseline** in 2026 — the platform's own parser is not an option either | re-grounds E §6/F1 | **KILL (decline recorded) + RECORD** |
| F-5 | **C5 (the 24 no-op length units) survives D+E** — `50dvh`→`50px` silently, live in installed `value.js@0.10.0` `units/utils.ts:255-355`. A *wrong-pixels* correctness bug, not perf | confirms handoff C5, **re-verified live** | **value.js-HANDOFF (correctness)** |
| F-6 | **ALREADY-SOTA, do not churn** — the parse-that engine, the identity-keyed result memo, the `linear()` *evaluator*, and (the part E landed) the kf-side `linear()` round-trip closure | confirms E | **ALREADY-SOTA / RECORD** |
| F-7 | **The `console.error` custom-color-name leak** (E §4 / handoff F7) — re-verified shipped in installed `parse-that@0.8.2` dist + triggered by `color.ts` fallback | confirms E, **re-verified live** | **value.js-HANDOFF** |

**One-sentence verdict.** The parse *architecture* gap E named is real and **un-moved**
(value.js's tranche M did not touch the parser), my re-measurement **re-ranks** the
Wave A items (the unit-alternation cost A2 beats the `any()`-dispatch cost A1 for the
dominant dimension shape), the WASM decline is **doubly confirmed** (lightningcss-wasm
is whole-sheet-only; Typed OM is not-Baseline) — and the one genuinely NEW post-E
finding is that **keyframes.js itself sprouted a third private CSS parser** (the
easing-literal regexes) as the visible scar of the un-landed value.js `linear()`/`steps()`
parsers.

---

## F-1 · NEW — keyframes.js grew a PRIVATE CSS-easing parser (E.W7 S5's scar)

This is the finding no E doc contains, because it is a *consequence* of an E wave
landing while its value.js counterpart did not.

**The E synthesis said the `linear()` round-trip was "severed on BOTH ends"**
(`_SYNTHESIS-scorecard.md:96`; `valuejs-sota-handoff.md` E1 cross-repo edge): kf's
`getTimingFunction` had no `linear()` branch *and* value.js had no `linear()` parser.
**E.W7 S5 closed the kf end** — but by **hand-rolling a CSS parser in keyframes.js**
rather than waiting for the value.js grammar:

- `src/animation/utils.ts:80-81` — `CUBIC_BEZIER_LITERAL` regex (parses
  `cubic-bezier(x1,y1,x2,y2)`).
- `src/animation/utils.ts:86-87` — `STEPS_LITERAL` regex (parses `steps(n, jump-*)`
  + the `start/end/both` aliases).
- `src/animation/utils.ts:96` — `LINEAR_LITERAL` regex (`/^\s*linear\s*\(\s*(.+)\s*\)\s*$/i`).
- `src/animation/utils.ts:106-130` — `parseLinearStops()`: a hand-written stop-list
  reader doing `inner.split(",")` → per-part `trim().split(/\s+/)` →
  `Number.parseFloat` → `%`-strip → `LinearStop[]`, fed to value.js `cssLinear`
  (`utils.ts:193`).

**Why this is a NOT-SOTA seam after E.** keyframes.js's whole architecture rests on
*delegating CSS parsing to value.js* — `tryParseTime` (`engine.ts:55`) correctly calls
value.js `parseCSSTime`; `frame-compiler.ts:143` calls `parseCSSValueUnit`;
`parseAndFlattenObject` (`utils.ts:205`) routes through value.js. The easing literals
are the **one place kf re-implements CSS syntax itself**, with regex + manual string
splitting — the exact "re-scan source, no token stream, no typed value" anti-pattern
the SOTA field (lightningcss/csstree/@csstools) and E's own §0 reference architecture
reject. It is a *third* hand-rolled CSS parser in the dependency graph (after
value.js's combinator grammar and parse-that's dormant `parsers/css/` scanner).

The parsing is also subtly **less correct than a grammar**: `parseLinearStops`
accepts `linear(0, abc, 1)`-class malformed positions only by `Number.isFinite`
guards (`utils.ts:112,125`), splits on bare `,`/whitespace (no comment / nested-paren
awareness — fine for `linear()` today, fragile under any grammar drift), and the
`LINEAR_LITERAL` `(.+)` is greedy-non-validating. It works for the curves kf emits
(`springLinearStops`) but is not the typed-stop parser the spec defines.

**The right end-state (gestalt, no-legacy).** value.js ships the structured
`linear()`/`steps()` parsers (handoff **Wave E1/E2** — the *evaluators* `cssLinear`
[`value.js/src/easing.ts:33`] and `steppedEase` already exist; only the parse bridge
is missing). Then kf's `getTimingFunction` deletes its three regex matchers +
`parseLinearStops` and asks value.js: "parse this timing-function string to a typed
easing." One CSS parser, owned by value.js; kf consumes typed output. That is the
isomorphic transposition — **not** "keep the kf regexes beside a future value.js
parser" (that would be the legacy the Mandate forbids).

- **Disposition: RECORD (kf-side, live) + value.js-HANDOFF.** The kf regexes are
  *correct enough to ship* (E gated them; do not rip them out unilaterally — that
  would re-sever the round-trip). They are **booked for deletion** the moment
  value.js Wave E1/E2 lands. Until then they are a named, justified, but
  architecturally-foreign seam. This is the cross-repo edge made **concrete and
  LIVE** — the handoff predicted the dependency; F records that kf paid for it in
  source.
- **Isomorphism:** the eventual consolidation must be byte-identical — value.js's
  `linear()` parser must reproduce kf's `parseLinearStops` semantics (positional
  distribution, `%`-magnitude vs 0–1 fraction — note `utils.ts:119-124`, kf passes
  the percent magnitude un-normalized to `cssLinear`, which the value.js parser must
  match) over kf's own emitted `springLinearStops` corpus.

---

## F-2 · Re-MEASURE Wave A — the cost ranking is A2 > A1 (NEW measurement)

E's Wave A ranked **A1 (`any()`→first-char `dispatch`)** as "the single biggest
structural win" (`r-css-parsers.md:128`; `d-vj-parse.md:124`) and A2 (the
per-dimension `any(istring)`) as a secondary perf+correctness fold. **I re-measured
against the installed `value.js@0.10.0` dist** (cold-parse, unique input strings to
defeat the result-memo — i.e. the editor-keystroke / generated-CSS / first-paint
path). The measurement **inverts the ranking for the dominant value shape.**

**Cold-parse cost vs. `LENGTH_UNITS` array position** (unique `<n><unit>`, memo
defeated; `node`, warm JIT, 60k iters/unit):

| unit | array idx | ns/op |
|------|-----------|-------|
| `px`   | 0  | 583 |
| `cm`   | 1  | 681 |
| `pt`   | 6  | 1117 |
| `em`   | 7  | 827 |
| `rem`  | 8  | 1110 |
| `ch`   | 13 | 996 |
| `vh`   | 20 | 1050 |
| `vmin` | 23 | 1176 |
| `svh`  | 26 | 2005 |
| `lvh`  | 32 | 1703 |
| `dvh`  | 38 | 1973 |
| `dvmax`| 42 | 2376 |
| `cqmin`| 47 | 2440 |
| `cqmax`| 48 | 2435 |

The cost scales **monotonically with the unit's position in the array** — `px` (idx 0)
to `cqmax` (idx 48) is a **4.2× spread**, driven purely by
`any(...LENGTH_UNITS.map(istring))` (`value.js/src/parsing/units.ts:20`) trying each
`istring` (a fresh case-insensitive `RegExp.test`, `value.js/src/parsing/utils.ts:5`)
**sequentially in array order**. The grounding: `LENGTH_UNITS = [...ABSOLUTE,
...RELATIVE]` (`value.js/src/units/constants.ts:42`), and the `dv*`/`sv*`/`lv*`/`cq*`
families sit at the **end** of `RELATIVE_LENGTH_UNITS`.

**Why this re-prioritizes A2 above A1:**
1. **The slowest-to-parse units are the most modern + increasingly common** — the
   `dv*`/`sv*`/`lv*` dynamic-viewport family (Baseline 2022-2023) and `cq*` container
   units (Baseline 2023) are *exactly* the units a current animation library is asked
   to interpolate, and they are the worst case (1.7-2.4 µs each).
2. **The dimension path is the *dominant* keyframe value shape** — every
   `translateX(20px)`, `width: 100dvh`, `gap: 2rem` hits `Length` first
   (`units.ts:78` `Value = any(Length, Angle, Time, …)`), so the dimension cost is
   paid far more often than the color cost A1 mostly targets.
3. **A2 is a smaller, lower-risk fold than A1** — one combined unit regex +
   `Set`/`Map` classification (the exact transposition value.js *already applied to
   color names* per `d-vj-parse.md:78`, but not to units) is O(1)-per-dimension and
   *also* fixes the latent maximal-munch correctness smell (`s` before `svw`).

By contrast, the color `any()` ordering (A1's headline) re-measured **cheap**: a color
*name* is 34 ns (the 155-name regex+Set transposition already landed AND names are
memoized), `hsl()` is 111 ns, `oklch()` 97 ns — the deep-in-`any()` color branches are
NOT the cost E's narrative implied. The genuine color outliers are `hex` (712 ns) and
`rgb()` (1339 ns) — but those are heavy *inside* their own parser (hex digit decode /
rgb 3-channel + alpha grammar), not `any()` selection depth, so A1 (first-char
dispatch) does **not** fix them; only their own sub-parser would.

- **Disposition: value.js-HANDOFF** — **re-order Wave A so A2 (the unit regex) leads
  A1 (the color/value dispatch).** A2 is the larger *measured* cost on the dominant
  shape, the smaller fold, and carries a correctness fix. A1 remains correct and
  isomorphic but its measured payoff is concentrated on the color-name path that the
  name-regex transposition already largely captured. **Gate (re-statable):** a
  per-unit cold-parse bench asserting the `px`→`cqmax` spread collapses to flat after
  the combined-regex fold.
- **Isomorphism:** identical `ValueUnit` output; the maximal-munch fix is a *flagged*
  befitting correctness delta on ambiguous-prefix units.
- **Honesty note (binds the above):** these are **microbenchmark** µs — see F-3 for
  whether they matter in kf's real workload. They do, but only on three paths.

*(Re-measurement harness: a throwaway ESM script importing the installed
`node_modules/@mkbabb/value.js/dist/value.js`, unique-string inputs per call, 2-3k
warm iters then 60-200k timed; the script was deleted, not committed — F makes no
source edits.)*

---

## F-3 · The memo erases the cold cost in kf's REAL workload (honest scoping)

F-2's cold µs only bite where the result-memo *misses*. The discipline of this lane is
to say plainly where it does and does not.

**kf does NOT re-parse on the rAF hot path.** The parse happens at **compile time**:
`frame-compiler.ts:143` (`parseCSSValueUnit(start)`/`(stop)` once per variable
endpoint), `parseAndFlattenObject` (`utils.ts:205`) once per `addFrame`, behind the
module-level `tryParseCache` (`utils.ts:203`). Per frame, the engine interpolates
already-parsed `ValueUnit`s through `iv._lerp` — **zero re-parse**. The memo-HIT floor
I measured is ~28-39 ns (`#abcdef` steady = 38 ns; `42px` steady = 28 ns).

**So the cold cost matters on exactly three paths:**
1. **First-paint / first-`fromString`** — every distinct keyframe value parsed once.
   Real, but one-shot; the F-2 µs sum across a handful of values is sub-millisecond.
2. **Editor per-keystroke** — the demo editor re-parses generated CSS on each
   keystroke; unique strings → memo miss → the F-2 cold cost is paid live. This is
   where A2's `dvh`/`cqmin` 2.4 µs is felt under typing.
3. **The computed-unit per-frame path** — `calc()`/`var()`/bare `vh` route through
   value.js `getComputedValue` → `parseCSSValue(computed)` *every frame* for an
   animating expression (the computed string changes per tick), per the handoff
   **Wave C** / E's `d-vj-parse §3`. This is the ONE place the F-2 cold cost recurs
   at 60 Hz — and it is the handoff's **A6 numeric fast-path** target.

- **Disposition: MEASURE-FIRST / honest-scoping.** F-2's win is real but **localized**
  to first-paint, the editor, and the computed-unit frame path — *not* the general rAF
  loop (which is already SOTA, F7 in E). kf should NOT manufacture a parser-perf gate
  for the steady-state loop; the meaningful kf-side instrument is the editor-keystroke
  parse cost + the computed-unit per-frame parse count (the handoff's
  `proof:computed-frame`). **This is the measure-first guardrail E's W7/W8 honored —
  F re-affirms it.** No kf source work is warranted here beyond what Wave C/A6
  (value.js-owned) and the editor instrument unlock.

---

## F-4 · WASM decline HOLDS — re-grounded 2026-06 (KILL recorded)

E declined Rust→WASM for the parser (`r-css-parsers §6,§9`; `r-wasm-compile-perf F1`).
F re-examined "with current evidence" as the brief demands. **The decline is
*doubly* reinforced.**

**(a) lightningcss-wasm exists and is whole-sheet-only.** Current release
`lightningcss-wasm@1.30.1` (npm, 2026) — a real, shipping WASM build of the SOTA Rust
parser (built on Mozilla's `cssparser`/`selectors`). Its published benchmarks remain
**whole-stylesheet**: Bootstrap 4 minified in 4.16 ms, tailwind.css in 43 ms — inputs
of *thousands of rules*. keyframes.js parses *small strings* (a 2-stop block, a
`translateX(20px)` value, a `linear()` literal — the kf bench tops out at 11 stops,
`bench/parser.bench.ts`). The WASM↔JS boundary (string copy into linear memory +
**graph reconstruction** of `ValueUnit`/`FunctionValue`/`Color` back across the
boundary — value.js returns live mutable object graphs, not byte strings like
lightningcss) dominates for small/frequent calls. The cost-benefit E named is
**unchanged**.

**(b) parse-that's Rust crate is still unbuilt for WASM.** Re-verified the E claim
holds at the architectural level: the SOTA win is *structural* (tokenize-once,
first-char dispatch, typed values, no re-scan) — all achievable in pure TS, all
**already hand-written** in parse-that's `parsers/css/` (`scan.ts`+`value.ts`,
exported `cssParser`), which value.js still imports nowhere (re-confirmed: 58 `any()`
sites live, `dispatch` unused in `value.js/src/parsing`). "Adopt the TS reader, don't
compile Rust" stands.

**(c) NEW 2026 grounding — the platform's own parser is ALSO not an option.** I checked
whether the *native* CSS parser (CSS Typed OM `CSSStyleValue.parse()` / the Houdini
CSS Parser API) could replace value.js's grammar. Per MDN (2026): **`CSSStyleValue.parse()`
and the CSS Typed OM API are NOT Baseline** — "does not work in some of the most
widely-used browsers" (Firefox lacks Typed OM `parse`). So delegating to the browser's
own zero-cost parser is **not viable** in 2026 either. This *strengthens* the case for
the pure-TS `dispatch`/span adoption: there is no platform shortcut.

- **Disposition: KILL (WASM decline recorded, do not re-litigate) + RECORD (Typed OM
  not-Baseline).** Revisit WASM only if a future product parses whole stylesheets
  (not a keyframes.js workload). The Typed-OM avenue is BOOK pending Baseline.
- **Isomorphism:** N/A (decline = no change).

---

## F-5 · C5 survives D+E — `50dvh`→`50px` silently (re-verified live, correctness)

The handoff's highest-confidence correctness item. **Re-verified in the installed
`value.js@0.10.0` source** (`units/utils.ts:255-355`): `convertToPixels` resolves only
`em rem vh vw vmin vmax % ch ex` + the six `cq*` (`:283-349`); **everything else falls
to `convertAbsoluteUnitToPixels` (`:255-272`), which handles only the 6 absolute units
and `return pixels` (= raw value) for all relative ones.** So the entire
`sv*`/`lv*`/`dv*` family + `vi`/`vb`/`cap`/`ic`/`lh`/`rlh` (24 of the 43 declared
length units) **silently resolve to their raw number as px** — `50dvh` animates to
`50px`, not `0.5 × dynamic-viewport-height`.

This is a **wrong-pixels** bug (worse than a parse failure — it's silent), and D+E did
not touch it (D/E were keyframes-side; this is value.js-owned). It pairs with F-2: the
`dv*`/`sv*` units are both the **slowest to parse** (F-2, end of the array) AND the
**wrongest to resolve** (F-5, no-op). The fill is the handoff's "fill-the-`cq*`-pattern"
path (`dv*`/`lv*` = `vw`/`vh` math on `innerWidth`/`innerHeight`; `sv*` via
`visualViewport`; `vi`/`vb` writing-mode selections the code already computes for
`cqi`/`cqb` at `:331`).

- **Disposition: value.js-HANDOFF (correctness, was Wave C5).** Note the keyframes
  consumer edge: WAAPI **excludes** computed units (`waapi.ts` eligibility — verified
  in `src/animation/CLAUDE.md` WAAPI Eligibility), so the *only* consumer of this
  resolution is the rAF computed-unit resolver — kf inherits the wrong pixels with no
  workaround available on its side. **Gate:** a 39-unit endpoint-resolution test where
  any unit returning `value` unchanged is a failure.
- **Isomorphism:** fixes wrong pixels — befitting; the changed outputs are currently
  incorrect.

---

## F-6 · ALREADY-SOTA — manufacture NO work (record + credit)

Per the Mandate's KISS clause, state plainly where the post-E state is exemplary:

- **The parse-that combinator engine** — mutable single-state, zero-alloc
  `regex`/`string`/whitespace leaves, the `Int8Array(128)` `dispatch` LUT, the span
  family, identity-keyed result memo. Genuinely current; the gap is *value.js's
  non-adoption*, not the engine (E `r-css-parsers §1`, re-confirmed). **Do not add
  packrat** — `.memoize()` is real but dispatch obviates it for LL(1)-ish CSS value
  grammars (E §7). **ALREADY-SOTA.**
- **The `linear()` *evaluator*** (`value.js/src/easing.ts:33` `cssLinear`) — fully
  spec-faithful; only the *parser* is missing (F-1). Credit it.
- **The kf-side `linear()` round-trip closure** — E.W7 S5's `getTimingFunction`
  branch (`utils.ts:190-194`) genuinely closed the half the E scorecard flagged as
  severed (`_SYNTHESIS-scorecard.md:96`). The *only* residue is its
  hand-rolled-parser form (F-1), not its existence. **This is an E win F credits, and
  refines.**
- **kf delegates time/value/keyframe parsing to value.js correctly** — `tryParseTime`
  → `parseCSSTime` (`engine.ts:55`), `frame-compiler.ts:143` → `parseCSSValueUnit`,
  `parseAndFlattenObject` → value.js. The boundary discipline (`proof:boundary`,
  light bundle carries no static value.js edge) is intact. The easing literals (F-1)
  are the lone exception. **ALREADY-SOTA except F-1.**

---

## F-7 · The `console.error` custom-color-name leak — re-verified live

E §4 / handoff F7's NEW finding, re-grounded for F. `@mkbabb/parse-that@0.8.2`'s
shipped dist calls `console.error(state.toString())` on **every** top-level parse
failure (`parser.ts:59,63` → `dist/parse.js:708,712`), and value.js's `parseCSSColor`
(`color.ts:613-628`) tries the rich parser **first**, falling back to the custom-color
map only on failure — so **every parse of a registered custom color name emits a
formatted ANSI error tree** + pays the `statePrint` cost, un-memoizably, on the cold
path. SOTA parsers (csstree `Raw`/`onParseError`, `@csstools` callback) treat failure
as a returned value, never I/O.

- **Disposition: value.js-HANDOFF (unchanged).** Fix in parse-that (route `parseState`
  to an opt-in diagnostic sink) **or** reorder `parseCSSColor` to try the custom-name
  map before the speculative `parseResult`. **No kf consumer trigger** (kf does not
  register custom color names in the audited surface), so this is value.js-internal —
  recorded for completeness + because it taxes any keyframes app that *does* use the
  custom-color feature.
- **Isomorphism:** pure observability — removes the log, changes no parse output.

---

## 8. What F deliberately does NOT do (anti-gold-plating)

- **No kf source edits.** F-1's kf regexes stay (ripping them out re-severs the
  round-trip; they're booked for deletion *when* value.js E1/E2 lands, not before).
- **No new kf parser-perf gate for the rAF loop** — F-3 proves the steady-state loop
  is memo-served and already SOTA; a gate there would be manufactured work.
- **No WASM, no Typed-OM adoption** — F-4 records both as declined/not-Baseline.
- **No re-derivation of E's per-grammar findings** — A1/A3/A4/A5/E1-E7/F2/F3 stand as
  written in `valuejs-sota-handoff.md`; F only **re-ranks A2↑/A1↓** (F-2), **re-verifies
  C5/F7 live** (F-5/F-7), and **adds F-1** (the kf-private parser).

---

## 9. The value.js-HANDOFF delta this lane contributes (append to the charter)

The existing `valuejs-sota-handoff.md` Wave A/C/E are correct; F's measured evidence
sharpens the *sequencing* and confirms two live items:

1. **Wave A re-order: A2 before A1.** The per-dimension `any(istring)` is the larger
   *measured* cold cost (F-2: 4.2× position-driven spread, `cqmax` 2435 ns vs `px`
   583 ns) on the dominant value shape; the combined-unit-regex fold is also the
   smaller, lower-risk change and carries the maximal-munch correctness fix. A1
   (color/value dispatch) remains correct + isomorphic but its measured payoff is
   smaller than E implied (color names already 34 ns via the name-regex; hex/rgb cost
   is sub-parser-internal, not `any()`-selection).
2. **C5 re-confirmed live** (`value.js@0.10.0` `units/utils.ts:255-355`) — the 24-unit
   no-op is a *wrong-pixels* bug surviving D+E; pairs with F-2 (same units, slowest +
   wrongest).
3. **E1/E2 are now keyframes-BLOCKING in spirit** — F-1 shows kf carries a private
   easing parser *because* E1/E2 didn't land. When value.js ships structured
   `linear()`/`steps()` parsers, the paired kf FOLD-E is **delete** `utils.ts:80-130`'s
   three regexes + `parseLinearStops` and delegate, byte-matched against kf's
   `springLinearStops` emission corpus.
4. **F7 re-confirmed shipped** in `parse-that@0.8.2` dist.

---

### Sources
- value.js (sibling repo, live) — `src/parsing/{units,color,index,stylesheet}.ts`,
  `src/units/{utils,constants}.ts`, `src/easing.ts`; installed
  `node_modules/@mkbabb/value.js@0.10.0/dist/value.js` (the F-2/F-3/F-5 measurements).
- keyframes.js (live) — `src/animation/utils.ts:80-201` (F-1), `frame-compiler.ts:143`,
  `engine.ts:55`, `src/animation/CLAUDE.md` (WAAPI eligibility, boundary).
- parse-that (sibling) — `parser.ts:59,63`; `dist/parse.js:708,712` (F-7); the
  `parsers/css/` scanner (F-4).
- E grounding (diffed, not re-derived) — `docs/tranches/E/audit/sota/{r-css-parsers,
  r-wasm-compile-perf,a-vj-parser,d-vj-parse,_SYNTHESIS-scorecard}.md`;
  `docs/tranches/E/valuejs-sota-handoff.md` (Waves A/C/E).
- SOTA field (2026-06) — lightningcss + `lightningcss-wasm@1.30.1` (npm; Bootstrap-4
  4.16 ms whole-sheet bench); Mozilla `cssparser`/`selectors`; csstree
  (tokenize-once); MDN `CSSStyleValue.parse()` + CSS Typed OM **not-Baseline 2026**.
- modern-web-guidance `physics-based-easing` (`linear()` easing, Baseline 2023-12-11,
  similarity 0.72) — confirms the corpus has **no** CSS-parser-internals guide (top
  similarity 0.50), grounding the "no platform parser guidance" point.
