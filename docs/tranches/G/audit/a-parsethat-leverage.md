# Tranche G — lane `a-parsethat-leverage`

**Lane scope.** How keyframes.js + value.js **leverage `@mkbabb/parse-that 0.9.0`** now
that the four F hand-off waves (PT-WAVE-1 state-threading, PT-WAVE-2 packrat isolation,
PT-WAVE-3a span-dist reconcile, §1.5 `parseSingleValue`/`parseFunctionArgs` expose) have
**LANDED + PUBLISHED** (`parse-that 0.9.0`, npm). The lane audits three surfaces as their
own (inv-16 relaxed for G impl, each repo audited + HAND-OFF-tagged): (1) **kf**, which
consumes parse-that through exactly one direct import; (2) **value.js**, the principal
parse-that consumer; (3) **parse-that 0.9.0 itself**, to confirm what shipped and what is
still under-leveraged downstream.

**inv ε — verify, do not assert.** Every claim is `file:line`-grounded against the live
trees (audit time 2026-06-06):
- parse-that `0.9.0` source `/Users/mkbabb/Programming/parse-that/typescript/src/parse/`
  (HEAD `6fb9de2`), npm `0.9.0` (`npm view @mkbabb/parse-that version`).
- value.js `0.11.0` source `/Users/mkbabb/Programming/value.js/src/parsing/`.
- kf `4.0.0` source `/Users/mkbabb/Programming/keyframes.js/src/` (branch `tranche-g-dev`).

**Boundary with sibling G lanes (diff, never repeat).** The **headline re-pin**
(`@mkbabb/value.js ^0.10.0→^0.11.0`, parse-that transitively) is OWNED by
`a-prompt-recap §pin-lag` and `a-valuejs-leverage F-VJ-1`. I do **not** re-derive the
value.js consumption numbers or the bare re-pin. **This lane is the parse-that-specific
half:** the one *direct* kf→parse-that edge the value.js-transitive framing misses, the
breaking-change verification that makes the re-pin safe, the dispatch/span/diagnostics
0.9.0 surface that kf+value.js still under-leverage, and the parse-that-HANDOFF residue.

---

## §0 — The headline verdict

> **parse-that 0.9.0 is published and the four F waves landed clean; the consume-leg is
> the only open kf-side item, and it is nearly-free + PROVEN non-breaking.** The 0.9.0
> BREAKING change (the `.memoize()`/`.mergeMemos()` method removal) touches NEITHER kf
> NOR value.js — both reach packrat through zero call-sites — so the re-pin to `^0.9.0`
> is a transitive consume, not a migration. The genuinely under-leveraged 0.9.0 surfaces
> are (a) the `dispatch` LUT (value.js: 62 `any(` sites, 2 `dispatch(` — A-tier
> value.js-HANDOFF, in flight), and (b) the **new per-state diagnostics channel**
> (`enableDiagnostics`/`getCollectedDiagnostics`/`Diagnostic`/`state.furthest`) that
> 0.9.0 ships and that BOTH value.js's `tryParse` AND kf's parse path currently ignore —
> the seed for a kf parse-error channel (the F BOOK NEW-18/PX-5/VJ-F2 now has its
> producer half). The parse-that leaf tier remains ALREADY-SOTA; manufacture no work there.

**The five lane findings:**

| # | Finding | Disposition |
|---|---|---|
| **G-PT-1** | The re-pin is non-breaking — verified: 0.9.0's only breaking change (`.memoize()` method→free-fn) has zero kf/value.js call-sites; the one direct kf import (`any`) is still exported | **SHIP-in-G** (the parse-that-side verification under the headline re-pin) |
| **G-PT-2** | kf's lone direct parse-that import (`any as parseAny`, `utils.ts:1,258`) builds a value.js-parser alternation across a node_modules realm boundary — the §1.5 expose + a deduped realm is the idiomatic replacement | **MEASURE-FIRST → BOOK** (kf-local micro-fold; see body) + **RECORD** (the realm-dedup is a dep-graph property, not a kf edit) |
| **G-PT-3** | The 0.9.0 diagnostics surface (`Diagnostic`/`state.furthest`/`enableDiagnostics`) is shipped + root-exported but consumed by NOBODY — value.js's `tryParse` reads `state.offset`, not `state.furthest`; kf has no parse-error channel at all | **value.js-HANDOFF (HIGH)** + **kf SHIP-in-G (seam, gated on the value.js sink)** |
| **G-PT-4** | The `dispatch` LUT is under-leveraged in value.js (62 `any(` vs 2 `dispatch(`); the A-tier value.js-HANDOFF is in flight (color top-level landed at `color.ts:593`) — kf rides it transitively on re-pin | **value.js-HANDOFF** (carried from F Wave A; not kf scope) |
| **G-PT-5** | value.js could adopt parse-that's now-exposed `parseSingleValue`/`parseFunctionArgs` instead of re-implementing the single-value reader (the §1.5 producer half is now reachable) | **value.js-HANDOFF (BOOK, strategic)** — kf benefits transitively, ZERO kf edit |

---

## §1 — G-PT-1: the re-pin is PROVEN non-breaking (the parse-that-side verification)

The headline re-pin is owned by `a-prompt-recap §pin-lag` (row 2: kf pins
`@mkbabb/parse-that ^0.8.2` while `0.9.0` is published) and `a-valuejs-leverage F-VJ-1`
(parse-that rides the value.js re-pin transitively). **This lane verifies the one claim
those lanes assert but do not prove: that 0.9.0 is non-breaking for both consumers.**

**The 0.9.0 BREAKING change, located + characterized.** The 0.9.0 release notes
(commit `c9338e4`, PT-WAVE-2) state the only API break: the **`.memoize()` /
`.mergeMemos()` Parser *methods* were removed** and re-homed as free functions in the new
`packrat.ts` module (the no-legacy cut — "the method-chain form is gone, the test migrates
to the free-function opt-in API"). Verified live: `grep -n "memoize" parser.ts` →
**zero matches** (the methods are gone from the class); the free functions are exported at
the root (`index.ts:8` — `export { memoize, mergeMemos, resetPackrat } from "./packrat.js"`).

**Why it touches neither consumer (verified, not asserted):**
- kf: `grep -rn "\.memoize\b\|memoize(" src/` → **zero parser-level matches**. The only
  `memoize` in kf is the value.js-level `memoizeDecorator`/`memoize` (a different symbol,
  `src/utils.ts`) — not the parser method.
- value.js: `grep -rn "\.memoize(" src/parsing/` → **zero matches**. value.js's
  `memoize` (`utils.memoize()`, `src/parsing/CLAUDE.md:66`) is its own result-cache
  decorator, not parse-that's packrat method.
- The F handoff already proved `.memoize()` was DEAD on every production path
  (`parse-that-sota-handoff §1 PT-WAVE-2`: "zero call-sites in parse-that src/, value.js
  src/, keyframes.js, or the BBNF generators — the only consumer is `test/memoize.test.ts`").
  G re-confirms it: removing a dead method cannot break a consumer that never called it.

**The one DIRECT kf→parse-that import survives 0.9.0.** kf imports exactly one parse-that
symbol: `import { any as parseAny } from "@mkbabb/parse-that"` (`src/animation/utils.ts:1`).
`any` is still root-exported in 0.9.0 (`leaf.ts:28`, re-exported `index.ts:9`). So the
re-pin breaks no kf import — the `a-valuejs-leverage F-VJ-1` claim ("`0.9.0` still exports
`any`") is hereby verified at the symbol level.

- **Disposition:** **SHIP-in-G** — the parse-that-side half of the headline re-pin. The
  re-pin itself is `a-prompt-recap §pin-lag` / `a-valuejs-leverage F-VJ-1`; this lane
  certifies it is safe.
- **Instrument (falsifiable):** after the re-pin, `npm run proof:boundary` stays green
  (the light barrel carries no static value.js/parse-that edge — the boundary is
  self-enforcing per `src/animation/CLAUDE.md`), AND a `grep -c "\.memoize(" src/` over
  kf source = 0 (the bite-control: a hypothetical `.memoize()` call would fail to compile
  against 0.9.0).

---

## §2 — G-PT-2: kf's lone direct parse-that edge + the node_modules realm seam

kf's single direct parse-that callsite (`src/animation/utils.ts:251-260`) is subtle and
worth naming because it is the ONLY place kf reaches under value.js to compose parsers
directly:

```ts
// utils.ts:246-260 (verbatim context)
// value.js and keyframes.js each ship their own copy of
// @mkbabb/parse-that under different node_modules realms,
// so the Parser<T> classes are nominally distinct from
// TypeScript's perspective. The runtime is the same. Cast
// to `any` to bypass the cross-realm type comparison.
const fnArgs = (CSSFunction.FunctionArgs as any).map(...);
const p = tryParse((parseAny as any)(fnArgs, CSSValues.Value), strValue) as ...;
```

**What this is.** kf builds an `any(fnArgs, CSSValues.Value)` alternation between two
**value.js** parsers (`CSSFunction.FunctionArgs`, `CSSValues.Value`) using
**parse-that's** `any` combinator. Because kf and value.js each resolve their own
`@mkbabb/parse-that` realm, `Parser<T>` is nominally two distinct classes to TS, forcing
the `as any` double-cast (`parseAny as any`, `CSSFunction.FunctionArgs as any`). The
runtime is identical (same combinator algebra), but the type system is defeated at this
seam.

**The idiomatic gestalt (per the Mandate — no workaround-by-cast).** Two convergent
levers, both off the kf source:

1. **The §1.5 expose makes this composition value.js-native.** 0.9.0 root-exports
   `parseSingleValue`/`parseFunctionArgs` (`parsers/css/index.ts` →
   `parsers/index.ts`). value.js's `cssParser`-adoption strategic option (value.js
   charter v2 VJ-WAVE-B) is precisely the move that would let value.js own this
   alternation *internally* — exposing a single `parseValueOrFunctionArgs`-shape entry kf
   calls without ever importing `any` itself. If value.js exposes the value-vs-function
   discrimination, kf's direct parse-that edge **disappears** (the `as any` cast with it),
   and kf reaches the whole parse surface through the value.js boundary alone — the SOTA
   posture the `src/animation/CLAUDE.md` boundary already aspires to (kf reaches value.js
   through one seam; this is the one leak under that).

2. **The realm dedup is a dependency-graph property, not a kf edit.** The cross-realm cast
   exists only because `npm` installs a separate parse-that under each. Verified: kf's tree
   has exactly one parse-that copy at audit time (`node_modules/@mkbabb/parse-that` →
   `0.8.2`, no nested value.js copy) — but that is because node_modules was a flat install
   here; under a stricter resolver (pnpm, or a peerDependency declaration) the realm split
   is real. The genuine fix is **declaring `@mkbabb/parse-that` a `peerDependency` of
   value.js** (so the consumer dedups it) — a value.js-HANDOFF, recorded so the cast is not
   patched at the wrong seam (kf must NOT "fix" a realm problem with a cast that pretends
   it away — that is the symptom-patch the Mandate forbids).

- **Disposition:** **MEASURE-FIRST → BOOK (kf-local).** The cast is correct + harmless at
  runtime today; removing it depends on value.js's VJ-WAVE-B exposing the discrimination
  (G-PT-5). Do NOT manufacture a kf rewrite of this seam in isolation — it would re-import
  more of parse-that, not less. **RECORD** the peerDependency option as the realm-dedup
  root (value.js-HANDOFF, dep-graph).
- **Instrument (when value.js VJ-WAVE-B lands):** kf's direct parse-that import count
  drops to 0 (`grep -c "from \"@mkbabb/parse-that\"" src/` = 0), and the `as any` casts
  at `utils.ts:251,258` are gone — both replaced by a single value.js call. The bite: the
  parse output for a CSS function value (e.g. `translate(10px, 20%)`) is byte-identical
  before/after.

---

## §3 — G-PT-3: the 0.9.0 diagnostics channel ships, and NOBODY consumes it

This is the lane's **net-new, highest-leverage finding** — it is the F BOOK NEW-18 /
PX-5 / VJ-F2 ("kf diagnostics-blindness on a malformed parse") whose **producer half just
landed in 0.9.0** but whose consumer half is wired nowhere.

**What 0.9.0 shipped (verified live).** PT-WAVE-1 threaded the entire error/diagnostic
substate onto `ParserState` and exposed a structured-diagnostic surface at the root:
- `ParserState.furthest` / `.expected` / `.suggestions` / `.secondarySpans` are now
  **instance fields** (`state.ts:43-53`), written in-place by `mergeErrorState`
  (`utils.ts:28-49`) — the Rust-port furthest-offset model.
- `enableDiagnostics()` / `disableDiagnostics()` / `getCollectedDiagnostics()` /
  `clearCollectedDiagnostics()` / `collectDiagnostic()` are root-exported (`index.ts:5`),
  with a structured `Diagnostic` type (`utils.ts:84-93`: `{offset, furthestOffset, line,
  column, expected[], suggestions[], secondarySpans[], found}`) — exactly the
  `onParseError`-shape sink the F charter VJ-F2 called for.
- `parseState` now gates the two `console.error`s behind `isDiagnosticsEnabled()`
  (`parser.ts:50` — the F7 leak root is closed at the architectural seam, as the handoff
  predicted).

**The two consumption gaps (verified):**

1. **value.js's `tryParse` ignores `state.furthest`.** `tryParse` (`value.js
   src/parsing/utils.ts:68-79`) reads `state.offset` for its error context window — NOT
   the new `state.furthest`. After a backtracking failure, `state.offset` has been
   *restored* to the backtrack point; `state.furthest` holds the *real* furthest position
   the parse reached (the actual derail point). So value.js's parse-error messages point
   at the wrong offset for any grammar with backtracking. The 0.9.0 `furthest` field is
   the strictly-better error locus and value.js leaves it on the table.
   `grep -rn "Diagnostic\|onParseError\|furthest\|enableDiagnostics" value.js/src/` →
   **zero matches**: value.js consumes none of the 0.9.0 diagnostic surface.

2. **kf has no parse-error channel at all.** kf parses CSS through value.js's `tryParse`
   (`src/animation/utils.ts:14,257`) and `parseCSSStylesheet` (the heavy adapter); a
   malformed `@keyframes` either throws a bare `Parse error at offset N` (value.js
   `tryParse`, no structured `expected`/`suggestions`) or silently collapses (the
   stylesheet path). kf surfaces NO `diagnostics` field on `ResolvedKeyframes` —
   `grep -rn "Diagnostic\|diagnostics" kf/src/` → only `tryParseCache` (an unrelated
   result memo). The F charter named this BOOK (NEW-18/PX-5); the producer half is now real.

**The idiomatic gestalt (per the Mandate — fail explicitly, no silent collapse).** Two
sequenced legs:
- **value.js (HANDOFF, HIGH):** (a) `tryParse` reads `state.furthest` (the real derail
  point) for its context window — a one-field swap, strictly-more-correct, isomorphic for
  non-backtracking parses; (b) value.js exposes a structured `parseResultWithDiagnostics`
  (or extends `parseResult`) that, under `enableDiagnostics()`, returns the 0.9.0
  `Diagnostic[]` — the `onParseError` sink VJ-F2 specified, now buildable on shipped
  primitives. This is value.js's surface; kf proposes, never writes it.
- **kf (SHIP-in-G, seam, gated on the value.js sink):** once value.js exposes the
  structured diagnostics, the kf adapter (`adapter.ts` `ResolvedKeyframes`) carries a
  `diagnostics?: Diagnostic[]` field populated on a malformed parse — the kf parse-error
  channel the editor demo can surface (replacing the silent collapse / bare throw). This
  is the kf half of the F BOOK, now unblocked. **Do not half-wire** (the F.W8 discipline):
  the field is populated end-to-end or not declared.

- **Disposition:** **value.js-HANDOFF (HIGH — `tryParse` furthest swap + the structured
  sink)** + **kf SHIP-in-G (the `ResolvedKeyframes.diagnostics` seam, gated on the
  value.js sink)**.
- **Instrument (kf side, falsifiable):** a `fromString` test over a malformed
  `@keyframes` (e.g. `@keyframes x { 50% { transform: } }`) asserts a non-empty
  `diagnostics` array with the `furthest`-correct offset/`expected` set — reds today
  (no field exists), greens when wired. Bite-control: a well-formed keyframes yields an
  empty/absent `diagnostics`.
- **Lanes/provenance:** extends F `parse-that-sota-handoff §6 row 5` (kf
  diagnostics-blindness roots in the then-module-global accumulator — now state-threaded);
  F charter v2 VJ-F2; F.W8 BOOK NEW-18/PX-5.

---

## §4 — G-PT-4: the `dispatch` LUT is under-leveraged in value.js (HANDOFF, in flight)

The F handoff's headline parse-that-consumption finding was value.js's non-adoption of the
`dispatch` LUT (`parse-that-sota-handoff §6 row 1`: the primitive exists + is exported, the
gap is value.js trialing `any()` where `dispatch()` would O(1)-discriminate). G re-grounds
the current state:

- value.js HAS adopted `dispatch` at the **top-level color value parser** (the A1
  transposition LANDED — `color.ts:593`, `const Value = dispatch(dispatchTable)...`, with
  the byte-identical letter-bucket fallback at `color.ts:570-592`). This is the largest
  single fork (the former 14-way `any()`).
- But **62 `any(` sites remain** vs **2 `dispatch(` sites** (verified
  `grep -rn "\bany(" value.js/src/ | wc -l` = 62; `dispatch(` = 2). The inner color-family
  buckets (`letterBuckets`, `color.ts:570` — `any(rgbParser, nameParser)` etc.) and the
  unit/length alternations are still `any()`-based.

**This is a value.js-HANDOFF, NOT kf scope.** It is value.js charter v2 Wave A, in flight
(A1 landed, A2/the inner forks pending). kf consumes the win transitively on the re-pin —
ZERO kf edit (kf reaches color parsing only through value.js). I record it to (a) confirm
the F finding is partially discharged (A1 landed) and (b) keep the residual on the value.js
ledger, not manufacture a kf fold.

- **Disposition:** **value.js-HANDOFF** (carried from F Wave A; A1 discharged at
  `color.ts:593`; A2 + inner forks pending). kf-transitive on re-pin.
- **Instrument (value.js side):** the value.js `any()`-site count drops as forks convert;
  a per-fork dispatch bench (the measured 21× tail / 3.65× end-to-end, `px-parser-perf
  PXP-1`) bites. The kf-side observable: the re-pin's `bench/parser.bench.ts` shows no
  regression and the color-heavy compile path tracks the value.js dispatch win.

---

## §5 — G-PT-5: value.js could adopt parse-that's exposed single-value reader (HANDOFF, BOOK)

The §1.5 expose (`parseSingleValue` / `parseFunctionArgs` now root-exported,
`parsers/index.ts`) is the **producer half** of value.js's deepest adoption: instead of
re-implementing a single-value CSS reader, value.js could adopt parse-that's
**already-hand-written, first-char-dispatch single-pass reader** (`parsers/css/value.ts:11`
`parseSingleValue`, `:89` `parseFunctionArgs`) and write a thin `CssValue → ValueUnit`
adapter (the shape map is mechanical: `dimension`→`ValueUnit`, `color`→constructors,
`function`→`FunctionValue` — per `parse-that-sota-handoff §1.5`).

**Why this matters for the lane.** This is the structural resolution of G-PT-2: if value.js
owns the value-vs-function discrimination via the exposed reader, kf's direct `any(...)`
import + cross-realm cast (`utils.ts:251-260`) vanishes — kf reaches the whole parse
surface through value.js alone. It is the gestalt move (one seam, no realm leak), not a
patch.

**But it is correctly a BOOK, not a SHIP.** Per the F charter: "Sequence the value.js
adoption AFTER its cheap isomorphic Wave-A wins; this expose is the gate that makes it
reachable" (`parse-that-sota-handoff §1.5`). value.js's grammar is dirty + active; the
`CssValue → ValueUnit` adapter is a real surface with byte-equivalence blast radius. It is
value.js's call to sequence.

- **Disposition:** **value.js-HANDOFF (BOOK, strategic — VJ-WAVE-B).** kf benefits
  transitively + sheds its direct parse-that edge; ZERO kf edit. Sequenced by the value.js
  owner after Wave A.
- **Instrument (value.js side):** the `CssValue → ValueUnit` adapter passes the full
  value.js parse corpus byte-identically; the JSON/CSS benches show no regression (the
  exposed reader is the SOTA single-pass form). kf-side: the realm cast at `utils.ts:251`
  is removable (the G-PT-2 instrument).

---

## §6 — ALREADY-SOTA (parse-that 0.9.0; manufacture NO work)

Re-confirmed live against 0.9.0 source — every F-recorded SOTA primitive HELD through the
0.9.0 waves, and the four F transpositions LANDED clean. Manufacture no parse-that work
here:

- **The leaf tier** — `string()` charCode fast path (`leaf.ts:145-176`), `regex()`
  sticky-`y` zero-alloc `test()` path (`leaf.ts:189-226`), `trimStateWhitespace` charCode
  loop with non-WS fast-exit (`leaf.ts:235-254`). At/beyond the JS-combinator frontier;
  the F handoff §5 binding-record holds.
- **The `Int8Array(128)` first-char `dispatch`** (`leaf.ts:60-104`) — the O(1) alternation
  the whole SOTA field converged on, with construction-time label pre-compute and `0-9`
  range syntax. Exported + proven. The gap is value.js's *non-adoption* (G-PT-4), not the
  primitive.
- **PT-WAVE-1 (state-threaded errors) LANDED CLEAN** — `ParserState.furthest`/`.expected`/
  `.suggestions`/`.secondarySpans` are instance fields (`state.ts:43-53`); `mergeErrorState`
  mutates in-place (`utils.ts:28-49`); `parseState` renders from the instance, not globals
  (`parser.ts:36-56`); the `console.error`s gate behind `isDiagnosticsEnabled()`
  (`parser.ts:50`). The re-entrancy soundness root is closed. **Leave it.**
- **PT-WAVE-2 (packrat isolation) LANDED CLEAN** — `memoize`/`mergeMemos`/`resetPackrat`
  in the opt-in `packrat.ts` (`packrat.ts:55,96,47`); default `parse()` carries no
  `MEMO.clear()` tax; the unsoundness is off the default path. **One residual recorded
  below.**
- **PT-WAVE-3a (span dist reconcile) LANDED** — `index.ts:10` exports all 15 span fns
  (`stringSpan`…`lookAheadSpan`); the 8-of-15 source↔dist drift is resolved at the
  `0.9.0` bump (`6fb9de2`). The dist now matches the source. **Leave it.**
- **§1.5 expose LANDED** — `parseSingleValue`/`parseFunctionArgs` root-exported
  (`parsers/css/index.ts`, `parsers/index.ts:3`). The producer half of VJ-WAVE-B is real
  (G-PT-5).

**RECORD-grade (no G action — parse-that-internal, off the consumer path):**
- **The packrat `MEMO` is still `id`-only-keyed**, not `(id,offset)` (`packrat.ts:61,82` —
  `MEMO.get(p.id)`). PT-WAVE-2 documented this as a KNOWN LIMITATION
  (`packrat.ts:16-26`) and BOOKED the sound Warth-Douglass-Millstein `(id,offset)` re-key
  as a dedicated packrat-soundness tranche, since it is off the default path with zero
  production consumers. This is **parse-that-internal** (neither kf nor value.js opts into
  packrat) — recorded so no G lane mistakes it for a consumer-facing defect. **Not kf/G
  scope.**

---

## §7 — inv-16 / inv ε compliance

This lane wrote ONLY this file under `docs/tranches/G/audit/`. ZERO source/test/CI edits to
kf, value.js, or parse-that. Every claim traces to a `file:line` against the live trees
(2026-06-06), verified not asserted: the `.memoize()` removal (parse-that `parser.ts` zero
matches + `index.ts:8` free-fn export + commit `c9338e4`); the kf direct import
(`kf src/animation/utils.ts:1,251-260`); the zero `.memoize(` call-sites in kf+value.js;
the 0.9.0 diagnostics surface (`parse-that state.ts:43-53`, `utils.ts:28-93`,
`index.ts:5`, `parser.ts:50`); value.js's `tryParse` reading `offset` not `furthest`
(`value.js src/parsing/utils.ts:68-79`); the 62-`any(`-vs-2-`dispatch(` count
(`grep` over value.js `src/`); the landed A1 dispatch (`value.js color.ts:593`); the §1.5
expose (`parse-that parsers/index.ts:3`); the span-dist reconcile (`index.ts:10`, commit
`6fb9de2`); the packrat id-only key (`packrat.ts:61,82` + the documented limitation
`:16-26`). The headline re-pin is OWNED by `a-prompt-recap §pin-lag` /
`a-valuejs-leverage F-VJ-1` — this lane EXTENDS them with the parse-that-side verification
+ the under-leveraged-0.9.0-surface findings, and does not re-derive the value.js
consumption numbers. Every cross-repo item is a HAND-OFF (value.js / parse-that) the
respective owner sequences (inv-16, relaxed for G impl but each surface audited as its own
+ HAND-OFF-tagged per the G mandate).

## Sources

- **parse-that 0.9.0 (live + npm):** `typescript/src/parse/{state,utils,leaf,parser,packrat,index}.ts`,
  `parsers/css/{index,value}.ts`, `parsers/index.ts`; commits `508aa6b`/`c9338e4`/`d02733e`/`6fb9de2`
  (the four F waves); `npm view @mkbabb/parse-that version` → `0.9.0`.
- **kf 4.0.0 (live):** `src/animation/utils.ts`, `src/animation/CLAUDE.md`, `package.json`.
- **value.js 0.11.0 (live):** `src/parsing/{utils,units,color,stylesheet}.ts`, `package.json`;
  `npm view @mkbabb/value.js version` → `0.11.0`.
- **F provenance (extended, not repeated):** `docs/tranches/F/parse-that-sota-handoff.md`
  (PT-WAVE-1/2/3, §1.5, §5 ALREADY-SOTA, §6 cross-link), `docs/tranches/F/valuejs-sota-handoff-v2.md`
  (Wave A, VJ-F2, the cssParser-adoption option), `docs/tranches/F/F.md` (the parse-that HAND-OFF note).
- **Sibling G lanes (boundary, not re-derived):** `docs/tranches/G/audit/a-prompt-recap.md §pin-lag`,
  `docs/tranches/G/audit/a-valuejs-leverage.md F-VJ-1/F-VJ-2`.
