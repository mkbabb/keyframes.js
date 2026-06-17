# KF → parse-that — the kf-side OUTBOUND dispatch to parse-that PT-WAVE-4+

**Authored 2026-06-16 (L.W0 — the dev phase).** parse-that is at v0.9.0
(PT-WAVE-3a, published 2026-06-07, branch `tranche-f-handoff`, 266 tests green).
This is the kf-side outbound dispatch: six asks, each with the defect evidence,
the specific ask, and the kf-side consume gate (born-RED on today's tree). The
foreign-tree fence HOLDS throughout — kf writes NO parse-that source. Evidence
cites `audit-32-skeleton.txt` (`⚠#`/`W#`/`★`), `completion-lanes-32-36.txt
§Lane #`, and file:line anchors in the kf tree.

**Dependency chain (acyclic-spine, inv-16).** parse-that `^0.9.0` → value.js
`^0.13.0` → kf `^4.3.0`. The only DIRECT kf → parse-that edge today is the `any`
combinator seam at `src/animation/utils.ts:1` (viol24/⚠24 — discussed in §4 below
and in `KF-TO-VALUEJS-O-ASKS.md §8`). L.W9 DELETES that edge via value.js §8; after
deletion kf has ZERO direct parse-that imports, and all remaining coordination flows
through value.js. kf does NOT re-pin parse-that independently; it follows value.js's
re-pin as the intermediate consumer.

The six asks below are chartered in `L.md §wave map` L.W9 (Band B — "**parse-that:**
packrat soundness `id,offset` (W93), permutation combinator (W105), typesVersions
surgery (W91)") plus three items the audit surfaced but the wave map held to L.W9 detail:
the `parseSingleValue`/`parseFunctionArgs` consumer gap (viol22/W92), the
architectural grammar-unification question (viol25/26/W97), and the permutation-adjacent
non-ASCII `dispatch()` fallback (W106 — `audit-32-skeleton.txt:178`).

---

## §0 — Dispatch in one table (six asks)

| # | Ask | PT producer seam | The kf↔value.js edge it closes | Audit anchor |
|---|---|---|---|---|
| **1** | **Architectural unification** — ONE CSS grammar in the spine | `parse-that/src/parse/parsers/css/` vs `value.js/src/parsing/stylesheet.ts` | L.W10 direction gate; `proof:css-parity` | viol25/26, W97, ★two-grammars |
| **2** | **Packrat soundness** — `(id, offset)` re-key (WDM) | `parse-that/src/parse/packrat.ts` | value.js perf + correctness; kf indirectly | viol27, W93, ★unsound-packrat |
| **3** | **Permutation combinator** — typed CSS `||` any-order | net-new `parse-that/src/parse/combinators.ts` | value.js shorthand grammar collapse; kf indirect via §8 of VJ-O | W105 |
| **4** | **typesVersions surgery** — delete stale `dist/src/` path, drop CJS | `parse-that/package.json` `typesVersions`/`exports` | kf proof:deps-current; the clean consume edge | viol21, W91, ★stale-types |
| **5** | **`parseSingleValue`/`parseFunctionArgs` consumer adoption** — value.js must be the first consumer | `parse-that/src/parse/parsers/css/index.ts:§1.5` exposed at root | value.js `parseCSSSubValue` (KF-TO-VALUEJS-O §8); kf deletes parse-that dep | viol22, W92 |
| **6** | **non-ASCII `dispatch()` fallback** — extend the `O(1)` jump table for non-ASCII first-char | `parse-that/src/parse/parser.ts` `dispatch()` jump table | value.js grammar totality (env()/attr()/identifiers with non-ASCII); kf indirect via the CSS grammar | W106, `audit-32-skeleton.txt:178` |

---

## §1 — The architectural question: TWO divergent CSS grammars in the spine

### §1.1 The precise gap (line-anchored)

Two independent CSS grammars coexist in the constellation:

1. **`parse-that/src/parse/parsers/css/`** — a structural AST grammar:
   selectors, specificity, `@media`/`@supports`, selector-list types. The
   `audit-32-skeleton.txt` live-probe confirms it handles structural CSS
   (selectors, at-rules as typed constructs). Its `types.ts` defines `Rule`,
   `Selector`, `AtRule`, `Declaration` — a structural/syntactic layer.

2. **`value.js/src/parsing/stylesheet.ts` + `src/parsing/index.ts`** — a
   TYPED VALUE grammar: `@keyframes`, `@property`, `calc()`, `ValueUnit`,
   CSS color spaces, all animation-relevant value types. Built on parse-that's
   LOW-LEVEL combinators (`map`, `seq`, `alt`, `many`, `LUT byte-scanners`),
   NOT on parse-that's CSS structural grammar above.

The relation: value.js re-implements its own CSS grammar OVER parse-that's
parser primitives, IGNORING parse-that's CSS module entirely. kf consumes
value.js's grammar and ALSO has the direct `any` seam into parse-that's
combinators (the seam §4 below deletes). kf has **zero** imports of
`parse-that/parsers/css/` — nothing in the constellation reaches it for
production use.

The audit (viol25): *"two independent CSS grammars coexist in the spine
(parse-that `typescript/src/parse/parsers/css/` AND value.js
`src/parsing/stylesheet.ts`), each typing a different slice (parse-that:
selectors+specificity+`@media`/`@supports`; value.js:
`calc`/`ValueUnit`/`@keyframes`). kf consumes only the value.js one;
parse-that's CSS module has no constellation consumer. True-CSS-parity cannot
be anchored across two divergent grammars."*

The replay-equality consequence (viol26): *"parse-that's CSS AST (`types.ts`)
carries no `Span`/`loc` on any node and there is NO serializer in
`parsers/css/`, so round-trip = parser-run-backward is structurally impossible
for the CSS layer."* This is not a fixable gap in parse-that's current module
— the absence of Span and a format-backward emitter makes replay-equality
STRUCTURALLY absent regardless of how complete the parser becomes.

The L.W10 headline (L.md §wave map L.W10): *"the architectural decision: unify
on ONE CSS grammar — delete `parse-that/parsers/css/` OR promote it to the
spec-complete tokenizer value.js's typed layer consumes (W97); the incremental/
streaming-parse SOTA research (W100)."*

### §1.2 The two options (the decision kf needs from parse-that)

kf does not make this decision unilaterally — it is a COORDINATED architectural
call between value.js and parse-that, with kf's L.W10 as the coordinated
consumer. The two options are:

**Option A — DELETE `parse-that/parsers/css/`.**
parse-that's CSS structural grammar is dead-code (no production consumer). Its
selector/at-rule types (`Rule`, `Selector`, `AtRule`) provide no capability
value.js's animation-typed grammar needs. Option A removes the module entirely,
leaving parse-that as a PURE COMBINATOR library (the `O(1)` dispatch, LUT
byte-scanners, zero-alloc `ParserState` — the SOTA core the audit confirmed).
value.js builds ALL CSS structure itself over parse-that's combinators, as it
does today. The grammar unification is achieved by REMOVAL — one grammar
(value.js's) survives.

Consequence for replay-equality (L.md §invariant set `inv-L-totality`): the
serializer and Span machinery go entirely in value.js (the L.W10 `proof:css-parity`
capability matrix gates that). parse-that carries no CSS-layer obligation.

**Option B — PROMOTE `parse-that/parsers/css/` to the TOKENIZER LAYER.**
parse-that's CSS module becomes the SPEC-COMPLETE tokenizer (CSS Syntax Level 3
tokenization: ident, string, url, function, at-keyword, whitespace, comment) +
basic structural grammar (qualified rules, at-rules, declaration lists) with
**Spans on every node** and a **format-backward emitter**. value.js's typed
layer (value types, `@keyframes`, colors, transforms) consumes parse-that's
tokenized structural AST as its INPUT — replacing the hand-rolled
`stylesheet.ts` structural outer shell with parse-that's typed tokens, while
retaining value.js's rich typed value grammar above that.

Consequence for replay-equality: Spans from parse-that's tokenizer → preserved
through value.js's typed layer → kf's `CSSKeyframesToString` can emit
source-faithful output (W99). This is the path to `parse(serialize(ast)) ===
ast` at the tokenizer level.

**Option B is the architecturally richer option but is a larger coordinated
surface.** Option A is the safe, cleanup-only option. **kf asks parse-that for
a NAMED DISPOSITION on this choice BEFORE L.W10's implementation spike** — the
spike is a research-and-challenge gate (`L.md §wave map` L.W10: *"a
research-and-challenge spike FIRST (no code)"*) whose direction depends on
whether the tokenizer layer is Option A (no parse-that CSS changes needed) or
Option B (parse-that adds Span + emitter).

### §1.3 kf-side gate

`proof:css-parity` (the L.W10 capability matrix): a table asserting which CSS
features parse → serialize → re-parse identically. The gate is RED today on
named-keyframe-selectors, CSS Nesting, `url()`, `@container`, `@layer` (all
failing in the live-probe — audit ★). The gate GREENS incrementally as
value.js Tranche O closes each row; its final row (Span-level author-fidelity)
gates on Option B shipping OR on the honest declaration that Option A is the
call and Span-level fidelity is out-of-scope for this spine. **The gate cannot
be green on an un-decided architecture — kf needs the named disposition to
author the right gate predicate.**

**L wave.** `L.W10` (Band B, coordinated) — W97, viol25/26.

---

## §2 — Packrat soundness: `(id, offset)` re-key (Warth-Douglass-Millstein)

### §2.1 The precise gap

`parse-that/src/parse/packrat.ts` ships a self-documented UNSOUND memoization
tier. The current key is `parser.id` alone (the parser's identity). The correct
packrat key under Warth-Douglass-Millstein (WDM) is `(parser.id, offset)` — the
parser identity AND the input offset — because the same parser applied at
different offsets may produce different results, and the current id-only key
conflates them.

The audit (viol27): *"packrat.ts ships a self-documented-UNSOUND memoization
tier (id-only key, 'unsound across offsets') with zero production consumers,
kept opt-in rather than removed or correctly reimplemented
(Warth-Douglass-Millstein booked but not done)."* The comment in the source
itself acknowledges the unsoundness — this is a documented defect, not an
interpretation.

The consequence: any grammar that uses the packrat opt-in for left-recursion
handling or memoization correctness gets silently wrong results when the same
parser sub-expression appears at multiple offsets. For the CSS grammar (both
parse-that's structural layer and value.js's typed layer), property-value
parsers appear repeatedly at different offsets — the unsound memo can cache
a result from offset 5 and return it at offset 25, producing a wrong parse tree
with no error.

### §2.2 What kf asks parse-that to ship

PT-WAVE-6 (W93): the `(id, offset)` re-key following WDM. The memo table key
becomes a composite `(id, offset)` — implementable as a `Map<number, Map<number,
CachedResult>>` or a single `Map<number, CachedResult>` with a hash
`id * MAX_OFFSET + offset` (if MAX_OFFSET is bounded). The correctness
postcondition: `parse(s, parser, offset)` returns the same result regardless of
whether an earlier call at a different offset was memoized. The soundness
condition must be ASSERTED in a new `packrat.test.ts` arm — not just
re-documented.

The ordering (W91 before W93): typesVersions surgery (§4 below) should land as
PT-WAVE-4 first to give the packrat fix a clean publish posture to ship from.

### §2.3 How kf and value.js consume it

kf does not consume the packrat tier directly. The consumption chain is: the
`(id, offset)` fix → value.js can safely OPT INTO packrat for its recursive
grammar rules (the `@media`/`@supports`/`@container` recursive parse that L.W10
coordinates) without correctness risk → kf's L.W3 ingest-deepening (recursive
group-rule walk) gets a correct recursive parse from value.js. The unsound tier
is a **latent correctness hazard** under any recursive rule adoption — fixing it
before value.js enables Option B recursion is the correct ordering.

**L wave.** `L.W9` (Band B) — W93, viol27.

---

## §3 — Permutation combinator: typed CSS `||` any-order semantics

### §3.1 The precise gap

CSS's `||` operator ("any-order" — one or more of the listed values in any
order) is the backbone of shorthand grammar. `animation`, `transition`,
`background`, `font`, `border`, `grid` — every compound shorthand uses `||`
semantics to allow the user to specify sub-values in any order without the
grammar becoming an exponential alternation of explicit orderings.

parse-that has no `permutation(...parsers)` combinator (W105). value.js's
shorthand parsers work around this absence with hand-rolled sequences
(parse-that audit: *"no permutation (`||`) combinator, forcing hand-rolled
order-tolerance workarounds in value.js"*). The workaround grows exponentially
for shorthands with many sub-values — `animation` has 9 sub-values; an
exhaustive explicit alternation would be `9!` branches.

### §3.2 What kf asks parse-that to ship

PT-WAVE-5 (W105): a `permutation(...parsers)` combinator with typed CSS `||`
semantics — *"try each remaining un-matched parser at the current offset; on
any match, recurse with that parser removed from the remaining set; succeed when
at least one matched"*. The combinator is zero-alloc over the mutable
`ParserState` (the same zero-alloc discipline the SOTA core uses — confirmed in
the parse-that SOTA audit: *"mutable zero-alloc ParserState, O(1) dispatch()
jump table"*).

The return type must be typed — `permutation(p1: Parser<A>, p2: Parser<B>,
p3: Parser<C>) => Parser<Partial<[A, B, C]>>` (a tuple of optionals, one slot
per input parser, regardless of parse order) — so value.js's shorthand
combinators can destructure the result into typed fields.

### §3.3 How value.js and kf consume it

The consumption chain (value.js Tranche O §8 in `KF-TO-VALUEJS-O-ASKS.md`):
`permutation` ships in parse-that → value.js collapses its shorthand hand-rolled
order-tolerance workarounds onto the combinator (the `animation`/`transition`/
`border` sub-value parsers) → the grammar surface becomes the canonical
typed-any-order CSS spec. kf's `parseAndFlattenObject` and the compile seam
(`compileToCSS`) receive correctly typed shorthand decompositions instead of
order-sensitive parses that silently drop sub-values appearing in unexpected
positions.

kf's direct gate: `proof:replay-equality`'s shorthand arm (e.g., `animation:
1s ease-in 0.5s infinite bounce` with sub-values in a non-canonical order)
RED today (value.js's shorthand parse is order-sensitive); GREEN on the
value.js consume of `permutation`.

**L wave.** `L.W9` (Band B) — W105.

---

## §4 — typesVersions surgery: stale `dist/src/` path + CJS drop

### §4.1 The precise gap

parse-that 0.9.0 (the current published cut) carries a stale `typesVersions`
entry pointing to a non-existent path. The audit (viol21): *"pointing to a
nonexistent path (`dist/src/parse/index.d.ts`) in the published 0.9.0 package
is a legacy/workaround artifact — the modern `exports` map already covers types
correctly; the stale field violates the NO-legacy-code precept and the
substrate-and-consumer-land-together precept (the dist does not match what the
manifest claims)."*

The `exports` map in 0.9.0 is correct and already covers type resolution via
`"types"` conditions; `typesVersions` was the pre-`exports` mechanism and
creates a conflicting resolution when both are present. On TypeScript `>=5.0`
with `moduleResolution: bundler` (kf's setting — `CLAUDE.md §Conventions`), the
`exports` map wins, but the stale `typesVersions` field causes resolution
warnings and can silently misroute in older TS toolchains.

The secondary concern (W91): any CJS artifact in the published bundle
is unnecessary; the spine is ESM-only (`kf: ESM-only, no CJS artifact` —
`CLAUDE.md §Library Entry Point`). If parse-that's 0.9.0 cut ships a CJS
`main` field alongside the ESM `exports`, it is dead weight (no constellation
consumer uses it) and a potential dual-module hazard.

### §4.2 What kf asks parse-that to ship

PT-WAVE-4 (W91): **remove the stale `typesVersions` field** from `package.json`
entirely (the `exports`-map `"types"` condition is sufficient); and **audit the
published dist for any CJS artifact** — if a `.cjs` or `"main"` field exists,
drop it in the same cut (the constellation is ESM-only). The change is
`package.json`-only and a `dist/` cleanup — no parser source changes.

**This is the lowest-risk, highest-value parse-that ask** — a manifest hygiene
fix with no combinator or grammar changes, and the ordering anchor for the
packrat re-key (§2) which should follow from a clean publish posture.

### §4.3 kf-side consume gate

`proof:deps-current` (the existing gate) verifies that kf's consumed
dependencies match their expected published state. It currently checks the
`@mkbabb/parse-that ^0.9.0` specifier, but it does NOT assert that the
published `typesVersions` field is clean (it does not inspect the installed
package's `package.json`). The L.W4 hardening wave extends `proof:deps-current`
with a `typesVersions-absent` assertion for all constellation packages: for any
package in kf's graph, if the `exports` map covers type resolution, `typesVersions`
MUST be absent. RED today (parse-that 0.9.0 has the stale field); GREEN on the
PT-WAVE-4 publish + kf re-pin.

Note: once `KF-TO-VALUEJS-O-ASKS.md §8` lands (the `parseCSSSubValue` ask),
kf's direct `@mkbabb/parse-that` production dependency **is entirely deleted**
(viol24). At that point kf no longer pins parse-that directly and the
`proof:deps-current` parse-that clause becomes a transitive-check-only — the
`typesVersions` cleanliness is then value.js's concern on its re-pin. kf's
`proof:boundary` (extended per W96) asserts ZERO direct `@mkbabb/parse-that`
imports in `src/` — that gate is the terminal postcondition for the direct-dep
deletion (§5 below).

**L wave.** `L.W9` (Band B) — W91, viol21.

---

## §5 — `parseSingleValue`/`parseFunctionArgs` consumer adoption (the §1.5 produce-half)

### §5.1 The precise gap

parse-that 0.9.0 (PT-WAVE-3a) exposed `parseSingleValue` and `parseFunctionArgs`
at the package root — the `§1.5 expose` item from the PT-WAVE-3a audit. The
audit (viol22): *"`§1.5 expose (parseSingleValue / parseFunctionArgs)` is a
primitive without a current consumer — value.js has not adopted it; this
violates the 'substrate and consumer land together' precept and the 'no public
surface without a current consumer' overfitting rule (the produce-half shipped,
the consume-half did not)."*

The produce-half (parse-that's exposure) shipped in 0.9.0. The consume-half
— value.js adopting `parseSingleValue`/`parseFunctionArgs` as the backend for
its `parseCSSSubValue`/`parseCSSValueOrArgs` producer API (the
`KF-TO-VALUEJS-O-ASKS.md §8` ask) — has NOT shipped. A public API surface with
zero production consumers violates kf's own precept (CLAUDE.md: *"no public
surface without a current consumer"*) and is ported into value.js's obligation.

This is not a parse-that defect per se — parse-that shipped what it was asked to
ship. The obligation is on **value.js** to CONSUME the exposed primitives (the
`KF-TO-VALUEJS-O-ASKS.md §8` ask does exactly this: `parseCSSSubValue` at the
value.js root composes value.js's own parsers using `parseSingleValue`/
`parseFunctionArgs`). The parse-that ask here is minimal: confirm the exposed
surface is correct and stable for value.js's adoption — no breaking change before
value.js can consume it.

### §5.2 What kf asks parse-that to confirm

PT-WAVE-5 (W92): before value.js's `parseCSSSubValue` is authored (the
`KF-TO-VALUEJS-O-ASKS.md §8` produce-half), confirm:

1. `parseSingleValue` and `parseFunctionArgs` as exposed in 0.9.0 are **API-stable**
   — no planned breaking change to their signatures before the value.js consume.
2. The exposed primitives correctly compose value.js's parsers THROUGH the
   cross-realm nominal-type boundary (the `any` combinator seam kf currently
   navigates at `utils.ts:1`). If the 0.9.0 exposure has a cross-realm limitation
   that `parseCSSSubValue` would hit, name it now — kf's design (the `any`-seam
   deletion in `KF-TO-VALUEJS-O-ASKS.md §8`) depends on value.js's adoption
   WORKING.

This is a CONFIRMATION ask, not a code-change ask — parse-that 0.9.0 may already
satisfy both points. The risk being surfaced is that the produce-half shipped
without a consumer test; kf needs a signal that the 0.9.0 API is the right shape
before value.js builds on it.

### §5.3 The kf→parse-that dep deletion (the cascade)

The cascade on confirmation + value.js adoption:

```
parse-that 0.9.0 exposes parseSingleValue/parseFunctionArgs (DONE)
    → value.js Tranche O ships parseCSSSubValue composing them
    → kf L.W9 deletes utils.ts:1 (the any import)
    → kf L.W9 deletes @mkbabb/parse-that from package.json
    → proof:boundary (extended W96): zero parse-that imports in src/ → GREEN
    → kf's dependency graph is clean: value.js → kf, NO direct parse-that edge
```

The deletion gate (`proof:boundary` extended, W96) asserts NO occurrence of
`@mkbabb/parse-that` in `src/animation/`. It is RED today (the `any` import at
`utils.ts:1` fires it); GREEN ONLY on the simultaneous value.js publish + kf
dep-deletion + import-removal. The gate cannot be partially green — the import
and the dep must both be gone in one commit.

**L wave.** `L.W9` (Band B) — W92, viol22.

---

## §6 — non-ASCII `dispatch()` fallback (the permutation-adjacent jump-table gap)

### §6.1 The precise gap

parse-that's combinator core is genuinely SOTA-shaped — the audit confirms a
*"mutable zero-alloc ParserState, O(1) `dispatch()` jump table, LUT byte-scanners,
zero-copy Span variants"* (`audit-32-skeleton.txt:28`). The `dispatch()` jump table is
the heart of the `O(1)` alternation dispatch: it indexes the next parser by the input's
FIRST character. The gap (W106, `audit-32-skeleton.txt:178`, "PT-UNICODE-DISPATCH"): the
jump table is keyed on an **ASCII-byte index**, so a non-ASCII first-char (a Unicode
identifier start, an `attr()`/`env()` custom name with non-ASCII, an emoji-bearing CSS
custom-ident) **falls off the fast path** — it either mis-dispatches or skips the `O(1)`
table entirely. This is permutation-ADJACENT (it lives in the same `dispatch()` core the
W105 permutation combinator builds on), but DISTINCT from W105: W105 adds an any-order
combinator; W106 widens the existing dispatch index to admit the non-ASCII first-char.

### §6.2 What kf asks parse-that to ship

PT-WAVE-5/6 (W106): extend `dispatch()` to handle a non-ASCII first-char via a **`Map`
fallback** — the ASCII range keeps the `O(1)` array-indexed jump table (no perf
regression on the common path), and a non-ASCII first-char routes through a `Map<number,
Parser>` keyed on the code point. CSS identifiers admit non-ASCII (CSS Syntax L3 ident-start
includes `U+0080` and above), so the value.js grammar that consumes `dispatch()` cannot be
totality-complete while non-ASCII idents fall off the fast path. The fix is additive (the
ASCII fast path is untouched) and zero-alloc on the common case.

### §6.3 How value.js and kf consume it

kf does not consume `dispatch()` directly — the chain is: the `Map`-fallback lands in
parse-that → value.js's identifier/`attr()`/`env()`/custom-ident parsers (built over
`dispatch()`) accept non-ASCII first-chars → kf's adapter ingest + `proof:replay-equality`
see a non-ASCII custom-ident keyframe round-trip instead of a mis-parse. **No kf workaround
to delete** — it is a latent totality gap (non-ASCII idents are rare in animation CSS but
SHIPPED-grammar-incomplete). The consume edge: a `proof:replay-equality` non-ASCII-ident arm
REDs today (the ident falls off `dispatch()`); GREENs on the parse-that publish + value.js
re-pin.

**L wave.** `L.W9` (Band B) — W106, `audit-32-skeleton.txt:178`.

---

## §7 — The `any`-combinator seam (the active kf→parse-that violation)

This section records the ONE active direct-reach kf has into parse-that today —
not an ask to parse-that, but the kf-side evidence that makes §5's cascade load-
bearing.

**The seam.** `src/animation/utils.ts:1`:
```ts
import { any as parseAny } from "@mkbabb/parse-that";
```
Used at `utils.ts` to compose value.js's typed parsers (a cross-realm nominal-type
seam). `CLAUDE.md §Dependencies`: *"consumed directly only in
`src/animation/utils.ts` (the `any` combinator over value.js's parsers — a
cross-realm nominal-type seam)."*

**Why this is a violation.** viol24/⚠24: *"kf has `@mkbabb/parse-that` as a
first-class production dependency solely because it needs the `any` combinator
to compose value.js parsers. This composition belongs in value.js (which already
owns the parsers). The fix is a cross-repo ask, not a kf-local fix — kf must not
reach through value.js's parser abstraction layer to compose primitives from
parse-that."* `inv-L-acyclic-purity` (`L.md §invariant set`): "a defect in a
published sibling is fixed AT THE SIBLING and consumed via re-pin — NEVER
corrected at the kf consume seam."

**Why no kf-local fix is possible.** The `any` composition is load-bearing for
`parseAndFlattenObject`'s sub-value dispatch. Replacing it with a kf-authored
`any`-equivalent would be re-implementing parse-that's combinator AT THE CONSUME
SEAM — the exact anti-pattern the no-workaround precept and `inv-L-acyclic-purity`
jointly forbid. The correct fix is value.js exposing the composed surface
(`parseCSSSubValue`) so kf calls value.js's API, not parse-that's internals. The
seam deletion is the `KF-TO-VALUEJS-O-ASKS.md §8` consume; **this doc names the
evidence and the dependency vector, while the value.js ask owns the cure**.

**Current state.** `package.json` today:
```json
"@mkbabb/parse-that": "^0.9.0"
```
This dep exists solely because of the `utils.ts:1` seam. L.W9's workaround-deletion
gate (`proof:boundary` extended, W96) asserts it is gone. It is born-RED on today's
tree; it cannot GREEN without the value.js §8 publish.

---

## §8 — Constellation cadence (the single picture)

```
parse-that 0.9.0 (published; PT-WAVE-3a)
│
├─ §4 typesVersions surgery ──────────────► PT-WAVE-4 (package.json only)
│    kf-side: proof:deps-current typesVersions-absent clause (born-RED)
│    → value.js re-pins parse-that → kf follows transitively → GREEN
│    (lowest-risk; ships first; enables a clean base for §2)
│
├─ §5 parseSingleValue/parseFunctionArgs ─► PT-WAVE-4/5 stability confirm
│    kf-side: the confirmation enables value.js Tranche O §8 (parseCSSSubValue)
│    → value.js adopts → kf deletes utils.ts:1 + package.json dep → GREEN
│    proof:boundary (W96) asserts zero parse-that imports in src/ (born-RED)
│
├─ §2 packrat soundness (id,offset) ──────► PT-WAVE-6 (after PT-WAVE-4 clean)
│    kf-side: indirect — value.js can opt into correct packrat for recursive
│    grammar (L.W10 coordinated parse); no direct kf gate
│    → correctness gain for any value.js recursive grammar consumers
│
├─ §3 permutation combinator ─────────────► PT-WAVE-5 (coordinated with value.js)
│    kf-side: proof:replay-equality shorthand arm (born-RED: order-sensitive
│    parse drops sub-values in non-canonical order)
│    → value.js collapses shorthand workarounds → kf shorthand arm GREENs
│
├─ §6 non-ASCII dispatch() fallback ───────► PT-WAVE-5/6 (additive; ASCII fast path untouched)
│    kf-side: proof:replay-equality non-ASCII-ident arm (born-RED: non-ASCII
│    first-char falls off the O(1) jump table)
│    → value.js ident/attr()/env() grammar admits non-ASCII → kf arm GREENs
│
└─ §1 architectural unification ──────────► L.W10 research-spike FIRST
     kf-side: proof:css-parity capability matrix (gate authored before code)
     Option A: parse-that deletes parsers/css/ → value.js is the sole grammar
     Option B: parse-that adds Span + emitter → value.js tokenizer layer
     → direction named BEFORE L.W10 implementation; gate predicate follows
```

**The key ordering constraint.** §4 (PT-WAVE-4 typesVersions surgery) lands
BEFORE §2 (PT-WAVE-6 packrat soundness) to ensure the packrat re-key ships from
a clean publish posture. §5 (consumer confirmation) is pre-implementation — it
requires no parse-that code change, only a API-stability signal before value.js
builds on the surface. §1 is a research spike, not a code wave — the named
disposition (Option A or B) is needed before L.W10 authors any implementation
gate predicate.

**After the §5 cascade completes (value.js §8 ships + kf deletes the direct dep),
kf has ZERO direct parse-that imports.** All coordination from that point flows
through value.js as the single grammar authority. The spine becomes:
`parse-that (combinators)` → `value.js (typed grammar)` → `kf (animation
engine)` — acyclic, one-consumer-per-layer, each consuming the PUBLISHED
predecessor.

---

## §9 — Status ledger (for parse-that re-anchor)

| PT ask | What | The value.js/kf edge it closes | The kf workaround DELETED | Born-RED-gated kf-side? |
|---|---|---|---|---|
| **§1 architectural unification** | named Option A/B disposition (W97) | L.W10 direction gate; `proof:css-parity` predicate | — (direction decision, not a workaround) | YES — gate predicate gated on named disposition |
| **§2 packrat soundness** | `(id, offset)` re-key WDM (W93) | value.js recursive grammar opt-in (L.W10 coordinated) | — (latent hazard, not an active workaround) | NO direct kf gate; value.js-side correctness guarantee |
| **§3 permutation combinator** | `permutation(...)` typed `\|\|` (W105) | value.js shorthand grammar collapse (Tranche O); kf shorthand round-trip | — (workaround is value.js-side hand-rolled sequences) | YES — `proof:replay-equality` shorthand arm REDs today |
| **§4 typesVersions surgery** | delete stale `dist/src/` path, CJS audit (W91) | `proof:deps-current` `typesVersions-absent` arm | — (manifest cleanliness) | YES — clause REDs on parse-that 0.9.0; GREENs on PT-WAVE-4 |
| **§5 parseSingleValue/parseFunctionArgs** | API-stability confirm (W92) | value.js `parseCSSSubValue` (KF-TO-VALUEJS-O §8); kf `utils.ts:1` deletion | **the whole `@mkbabb/parse-that` production dep** + the `any` seam | YES — `proof:boundary` (W96) REDs on any surviving parse-that import in `src/` |
| **§6 non-ASCII dispatch()** | `Map`-fallback for non-ASCII first-char (W106) | value.js ident/`attr()`/`env()`/custom-ident totality; kf via the CSS grammar | — (latent grammar-totality gap, not an active workaround) | YES — `proof:replay-equality` non-ASCII-ident arm REDs today |

**The acyclic spine holds.** parse-that ships COMBINATORS (the SOTA core + the
`permutation` addition + the packrat soundness); value.js consumes them to build
the TYPED CSS GRAMMAR; kf consumes value.js's grammar for the animation engine.
No back-edge; no `file:` link; no vendored combinator. The six asks DELETE
kf's only direct parse-that dependency, close the architectural ambiguity of
two parallel CSS grammars in the spine, and widen the `dispatch()` core to
non-ASCII grammar totality. kf does NOT write parse-that's tree — the
wave numbering and the PT-WAVE-4/5/6 cuts are parse-that's to ship; this is the
outbound edge of the Band-B dispatch the L charter names.
