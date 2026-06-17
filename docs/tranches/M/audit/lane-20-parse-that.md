# Lane 20 — parse-that audit (Tranche M seed)

**Authored:** 2026-06-17 (post-L close, tranche-l-dev tip `529fcfd`/`4686aa4`).
**parse-that version probed:** `0.9.0` (the published cut; PT-WAVE-3a).
**Source trees read:** `/Users/mkbabb/Programming/parse-that/typescript/` (full
read); `/Users/mkbabb/Programming/keyframes.js/src/animation/utils.ts`,
`package.json`, `scripts/proof-workaround-deletion.mjs`,
`docs/tranches/L/KF-TO-PARSE-THAT-ASKS.md`,
`docs/tranches/L/audit/W10-css-parity-spike.md`,
`docs/tranches/L/audit/deferred-ledger-L.md`.

All claims are **ground-truth verified** against the live source + dist. Every
prior-audit assertion that was re-probed here is called out where it materially
agreed or diverged.

---

## §1 — parse-that 0.9.0 inventory (live-probed ground truth)

### §1.1 Package manifest — what the W10 spike and KF-TO-PARSE-THAT-ASKS documented is CONFIRMED

`parse-that/typescript/package.json` (the dev tree; the published 0.9.0 cut is
structurally identical — `dist/` is present and matches):

**`typesVersions` stale entry — CONFIRMED (viol21 / W91).**
```json
"typesVersions": { "*": { "*": ["dist/src/parse/index.d.ts"] } }
```
`dist/src/` does **NOT** exist (verified: `ls dist/src/` → absent). The
`exports` map already covers type resolution:
```json
"exports": { ".": { "types": "./dist/index.d.ts", ... } }
```
The stale `typesVersions` is dead and creates a conflicting resolution on
TS toolchains that prefer it over `exports`. **This is a live defect in the
published 0.9.0 package, not a conjecture.**

**CJS artifact — CONFIRMED (W91).**
```json
"require": "./dist/parse.cjs"
```
`dist/parse.cjs` EXISTS (verified: `ls dist/parse.cjs` → present, 146KB). An
ESM-only constellation (`kf: ESM-only — CLAUDE.md §Library Entry Point`) ships
a CJS artifact that no consumer uses. Dead weight + dual-module hazard.

**No `permutation` combinator — CONFIRMED (W105).**
`grep -r "permutation" src/` → zero hits. The combinator does not exist.

**MEMO keyed on `parser.id` only — CONFIRMED EXACTLY AS DOCUMENTED (viol27 / W93).**
`packrat.ts` lines 28–37 show `const MEMO = new Map<number, ...>()` keyed on
`p.id` (NOT `(id, offset)`). The source comment at lines 18–27 SELF-DOCUMENTS
the unsoundness: *"the MEMO is keyed on the parser id only, not (id, offset)…
latently unsound for the non-recursive same-parser-at-two-offsets case."*
`memoize.test.ts:88–103` pins the CURRENT DEFECTIVE behaviour with an explicit
assertion that names its own flip target when the WDM fix lands. The unsound
tier is OFF the default path (`packrat.ts:14`: *"It is OFF the default parse
path"*) — this is a measured, bounded, isolated defect, not a pervasive one.

**IMPORTANT GROUND-TRUTH NUANCE on the packrat key:** the implementation at
lines 33–37 computes a `getCijKey` composite for `LEFT_RECURSION_COUNTS`:
```ts
const MEMO_OFFSET_BITS = 20;
function getCijKey(parser, state): number {
    return (parser.id << MEMO_OFFSET_BITS) | (state.offset & MEMO_MAX_OFFSET);
}
```
The LR-count table IS `(id, offset)`-keyed correctly. The BUG is specifically
in `memoize()` line 62: `const cached = MEMO.get(p.id)` — the MEMO result
lookup is `id`-only even though `getCijKey` is available. This is a
**one-line fix** (`MEMO.get(getCijKey(p, state))` everywhere), not a from-scratch
WDM reimplementation. The source comment's framing ("a from-scratch
reimplementation") overstates the cost; the ID and offset are already
composed for the LR table. The KF-TO-PARSE-THAT-ASKS §2.2 description was
accurate about the defect location but may have overstated implementation cost.

**`dispatch()` ASCII-only fast path — CONFIRMED (W106).**
`leaf.ts:60–103` (the `dispatch()` implementation). Line 91:
```ts
const idx = ch < 128 ? tbl[ch] : -1;
```
Any character code ≥128 immediately returns `idx = -1` → `state.isError = true`.
There is NO `Map` fallback for non-ASCII. CSS Syntax Level 3 `ident-start`
includes `U+0080` and above. The fast path is COMPLETE for ASCII CSS (the
overwhelmingly common case); non-ASCII idents, custom properties with non-ASCII
names, `env()`/`attr()` custom names with non-ASCII all fall off the fast path.
The fix (additive `Map` fallback, ASCII fast path untouched) is exactly as
described in KF-TO-PARSE-THAT-ASKS §6.

### §1.2 The CSS module — ground truth for the W10 Option B verdict

`src/parse/parsers/css/` is a **PUBLISHED ROOT EXPORT** of `@mkbabb/parse-that`
(live-confirmed in `dist/parse.js:2628–2661`):
```
cssParser, parseFunctionArgs, parseSingleValue, specificity
```
are all top-level exports. The W10 spike correctly called this out
(`W10-css-parity-spike.md §2.1`): *"not dead-code — deleting it is a breaking
API change."*

**Structural grammar capabilities (verified in source):**
- Typed `@media` with full `MediaQuery`/`MediaFeature`/range-interval
  (`types.ts:115-133`)
- Typed `@supports` with `SupportsCondition` (`types.ts:137-141`)
- Typed `@keyframes` with `KeyframeBlock`/`KeyframeStop` (`types.ts:41-45`,
  `104-112`)
- Typed selectors with specificity (`types.ts:82-102`, `specificity.ts`)
- `CssDeclaration.important: boolean` (`types.ts:63`) — typed, unlike value.js
  0.13.0's `decl.important` field which kf's `adapter.ts` was (pre-L.W1)
  not reading

**What parse-that's CSS module LACKS (all confirmed via source scan):**
- No `url` variant in `CssValue` (`types.ts:65-75` — omits url)
- No `@container`/`@layer`/`@scope`/`@page` in `CssNode` (`types.ts:3-11`)
- No CSS Nesting production (`rule.ts:111-137` — declaration list stops at `{`)
- **No serializer** (`grep "serialize\|toCss\|toCSS\|toString" src/parsers/css/`
  → zero hits; no format-backward path)
- **No `Span`/`loc` on ANY AST node** (`types.ts` has zero offset fields) — even
  though parse-that's CORE has full `Span` machinery (`state.ts`, `span.ts`)

The serializer-absence and Span-absence are STRUCTURAL barriers to
replay-equality at the parse-that CSS layer. They do NOT block Option B —
they ARE Option B's rationale (serializer ownership stays in value.js where
it already lives; Span retrofit not needed at value.js level).

**`parseSingleValue`/`parseFunctionArgs` — the §1.5 produce-half (viol22 / W92):**
Both are exported at package root (confirmed in `dist/parse.js:2651-2652`).
`value.ts:11-103` implements them as hand-rolled first-char-dispatch readers
over `ParserState<unknown>` directly (NOT as `Parser<T>` combinators). This is
important: they bypass the `Parser` class entirely, working directly on the
mutable `ParserState`. This means they CAN cross the cross-realm nominal-type
boundary that makes kf's current `any`-combinator seam necessary — because they
don't use `Parser<T>` instances, there's no nominal-type comparison to fail. The
value.js `parseCSSSubValue` consume (`KF-TO-VALUEJS-O-ASKS.md §8`) should work
cleanly once value.js imports them.

The produce-half shipped (0.9.0); the consume-half (value.js adopting them in
`parseCSSSubValue`) is PENDING (`proof:workaround-deletion` S9 = PENDING, run
confirmed `2026-06-17`).

---

## §2 — The kf consume seam (the ACTIVE violation)

**Single live direct import:**
```ts
// src/animation/utils.ts:1
import { any as parseAny } from "@mkbabb/parse-that";
```
Used at `utils.ts:241`:
```ts
(parseAny as any)(fnArgs, CSSValues.Value)
```
The `as any` cast is the cross-realm nominal-type workaround: value.js and kf
each ship their own copy of `@mkbabb/parse-that` in their respective
`node_modules`, so `Parser<T>` class instances are nominally distinct from
TypeScript's perspective. `parseAny` expects `Parser<T>[]` from its own realm;
`CSSValues.Value` is a `Parser<T>` from value.js's realm — the `as any` is the
bridging wedge.

**Why `parseSingleValue`/`parseFunctionArgs` skip this problem:** they operate
on `ParserState<unknown>` directly, not on `Parser<T>` instances. No cross-realm
nominal comparison occurs. The §8 value.js consume will call them from within
value.js's own module, where the state class is the same realm as the caller.

**`package.json` dep (CONFIRMED live):**
```json
"@mkbabb/parse-that": "^0.9.0"
```
at line 211. This dep exists SOLELY for the `utils.ts:1` import. Deleting the
import deletes the dep entirely.

**Gate state (run confirmed `2026-06-17`):**
`proof:workaround-deletion S9 = PENDING` (workaround PRESENT, sibling
`value.js@0.14.0` NOT YET published).

---

## §3 — The W10 Option B verdict — ground-truth assessment

The L.W10 spike's recommendation (Option B: delete parse-that's STRUCTURAL
`cssParser`/`CssNode` surface, keep `parseSingleValue`/`parseFunctionArgs`) is
**architecturally sound** given ground truth. Three verification points:

1. **The structural grammar is genuinely published, not dead-code (confirmed
   §1.2).** Option B's "delete structural grammar" is a parse-that MAJOR
   version bump, not a quiet removal. The spike acknowledged this. The key
   mitigating fact: no constellation member consumes `cssParser` today — kf
   uses value.js's `parseCSSStylesheet`, not parse-that's `cssParser`
   (`adapter.ts:5,201` import `parseCSSStylesheet`; zero kf reach to
   `cssParser` — confirmed by grep). The major CAN lag indefinitely; no
   live consumer is broken by the delay.

2. **The value readers are structurally compatible with value.js adoption
   (confirmed §1.2).** `parseSingleValue`/`parseFunctionArgs` operate on
   `ParserState<unknown>` directly. The cross-realm type boundary that makes the
   current `any`-cast seam necessary does NOT apply to them — they are
   state-mutation helpers, not `Parser<T>` class methods. The §8 consume in
   value.js should work without a cast hack.

3. **Serializer/replay ownership settled in value.js (confirmed §1.2).**
   parse-that's CSS module has NO serializer and NO Span on AST nodes.
   `serializeStylesheetItem`/`serializeStylesheet` are live root exports of
   value.js 0.13.0. Extending them to cover new gap classes (nesting,
   `@container`, url, etc.) is incremental; building a net-new serializer in
   parse-that (Option A's cost) is not. Option B is the correct home for the
   serialization surface.

**One ground-truth refinement to the spike:** the spike
(`W10-css-parity-spike.md §3.2`) says the spine becomes "parse-that (combinators
+ value readers) → value.js (the ONE typed CSS grammar) → kf" — this is right,
but the parse-that MAJOR deleting `cssParser` can (and should) LAG the value.js
O + kf re-pin. The kf gain (dep deletion + acyclic spine) is unlocked by
value.js O's `parseCSSSubValue` publish; the parse-that structural grammar
deletion is a FOLLOW-ON cleanup with no constellation urgency.

---

## §4 — Precept violations found (the M-carry set)

| # | Violation | File:line | Precept | M status |
|---|-----------|-----------|---------|----------|
| **P1** | `typesVersions` stale path `dist/src/parse/index.d.ts` in published 0.9.0; `dist/src/` does not exist | `parse-that/typescript/package.json:13-18` | NO-legacy-code; no-broken-manifest | **PT-WAVE-4** (lowest-risk; ships first per §8 cadence) |
| **P2** | CJS `require` artifact in ESM-only spine | `parse-that/typescript/package.json:10` | NO-legacy-code | **PT-WAVE-4** (same cut as P1) |
| **P3** | MEMO keyed on `parser.id` only (id-only packrat is unsound across offsets) | `packrat.ts:62` (`MEMO.get(p.id)`) | GESTALT-correctness; no-latent-hazard | **PT-WAVE-6** (after PT-WAVE-4; one-line fix to use `getCijKey`; test in `memoize.test.ts:88-103` pins the target) |
| **P4** | No `permutation` combinator — CSS `||` any-order semantics absent; value.js hand-rolls order-tolerance workarounds for shorthands | (absent) | NO-workaround (forces workaround at value.js layer) | **PT-WAVE-5** |
| **P5** | `dispatch()` ASCII-only (`ch < 128 ? tbl[ch] : -1`); non-ASCII first-char falls off fast path | `leaf.ts:91` | grammar-totality; no-silent-mis-dispatch | **PT-WAVE-5/6** (additive Map fallback; ASCII fast path untouched) |
| **P6** | `parseSingleValue`/`parseFunctionArgs` produce-half shipped without a consumer (value.js §8 adopt pending) | `css/index.ts:39`; `value.ts:11-103` | produce-and-consume-land-together | **TRIPWIRE** — value.js O `parseCSSSubValue` (VJ-L3) closes this; no parse-that code change needed |
| **P7** | CSS structural grammar (`cssParser`, `CssNode`, selectors) published-but-unconsumed; two CSS grammars in constellation; no serializer/Span in the CSS module | `parsers/css/types.ts`, `css/index.ts:43-63` | KISS; no-redundant-grammar; replay-equality structurally absent | **Option B decision** (parse-that MAJOR; structural grammar deleted; value readers kept; can lag value.js O) |

---

## §5 — M-wave proposals

### M-wave PT.M1 — `typesVersions` surgery + CJS audit (PT-WAVE-4)

**What:** Remove `typesVersions` from `package.json` entirely (the `exports`
`"types"` condition is sufficient). Remove or gate-off the `require`/CJS entry
if the constellation has committed to ESM-only. Ship as `0.9.1` (patch) — no
API change, no combinator change, no CSS module change. Lowest-risk, highest
hygiene value.

**Why it ships FIRST:** it is the clean publish-posture precondition for the
packrat re-key (PT.M3) and the non-ASCII dispatch fix (PT.M4). A soundness or
combinator fix shipped from a broken manifest state is harder to pin correctly
downstream.

**kf-side consume gate (born-RED today):** `proof:deps-current` extended with a
`typesVersions-absent` assertion for all constellation packages. RED today
(parse-that 0.9.0 has the field); GREEN on PT.M1 publish + kf/value.js re-pin.
Note: after value.js O's `parseCSSSubValue` lands and kf deletes its direct
parse-that dep, this gate becomes a value.js-side concern, not a kf-direct one.

### M-wave PT.M2 — `parseSingleValue`/`parseFunctionArgs` API-stability confirm (W92)

**What:** NOT a code change — a CONFIRMATION that the 0.9.0 surface is stable
for value.js adoption. The `parseSingleValue`/`parseFunctionArgs` signatures
(`value.ts:11-103`) operate on `ParserState<unknown>` directly. The ask:
confirm no planned breaking change to these signatures before value.js Tranche O
ships `parseCSSSubValue`.

**Ground-truth finding that strengthens this ask:** `parseSingleValue` and
`parseFunctionArgs` are `ParserState` mutation helpers, NOT `Parser<T>`
instances. They bypass the cross-realm nominal-type barrier entirely. This means
value.js can adopt them without a cast hack — the `(parseAny as any)` pattern
at `kf/utils.ts:241` is NOT the adoption pattern; value.js will call
`parseSingleValue(state)` directly, no realm boundary to cross.

**kf-side:** when value.js ships `parseCSSSubValue` over these, kf deletes
`utils.ts:1`, removes the `@mkbabb/parse-that` dep from `package.json`, and
`proof:boundary` (W96 extension) asserts zero parse-that imports in `src/` →
GREEN.

### M-wave PT.M3 — packrat soundness: `(id,offset)` re-key (W93 / PT-WAVE-6)

**What:** Change `memoize()` in `packrat.ts` to key the MEMO table on
`(id, offset)` instead of `id` alone. The composite key function `getCijKey()`
is ALREADY WRITTEN at lines 36-38 — it is used correctly for
`LEFT_RECURSION_COUNTS` but not for `MEMO`. The fix is:

```ts
// packrat.ts:62 — change MEMO.get(p.id) to MEMO.get(getCijKey(p, state))
// and MEMO.set(p.id, ...) to MEMO.set(getCijKey(p, state), ...)
const cached = MEMO.get(getCijKey(p, state as ParserState<unknown>)) as ...
```

The `memoize.test.ts:88-103` test already pins the defective behaviour with a
commented "SOUND target" that flips when the fix lands — the test is the born-RED
oracle; no new test scaffold needed. `mergeMemos` has the same id-only lookup at
line 99 and needs the same fix.

**Ordering:** ships AFTER PT.M1 (clean publish posture). Ships BEFORE value.js O
enables recursive grammar opts-in (so any `memoize()` use in value.js's
recursive group-rule parse is sound from day one).

**kf-side:** indirect. No direct kf gate. The value.js-O recursive `@container`/
`@layer` group-rule walk (L.W3 / DLL-27) can safely call `memoize()` after
PT.M3 without a latent correctness hazard. The `proof:packrat-sound` gate is
authored gate-first in kf (DLL-22 / deferred-ledger-L `DLL-22`); it asserts
the test's "SOUND target" shape.

**Ground-truth note on cost:** the KF-TO-PARSE-THAT-ASKS §2.2 framing said
"a from-scratch reimplementation… real correctness blast radius." The source
reading shows this is an OVERSTATEMENT — `getCijKey` is already present and
correct; the fix is a MEMO key change at two call sites (`memoize` + `mergeMemos`)
plus a `Map<number, Map<number, ...>>` or composite-hash upgrade of the MEMO
data structure. The blast radius is the packrat tier ONLY (opt-in, zero
production consumers).

### M-wave PT.M4 — `dispatch()` non-ASCII Map fallback (W106 / PT-WAVE-5/6)

**What:** Extend `dispatch()` in `leaf.ts:60-103` to handle a non-ASCII
first-char via a `Map<number, Parser<T>>` fallback keyed on code point.
The ASCII range keeps the `Int8Array(128)` indexed jump table (no perf
regression on the common path). The non-ASCII branch fires ONLY when
`ch >= 128` (currently hard-coded to error). Additive; zero change to the
ASCII fast path.

```ts
// leaf.ts:89-97 — proposed extension
const dispatchParser = (state: ParserState<T>) => {
    const ch = state.src.charCodeAt(state.offset);
    const idx = ch < 128 ? tbl[ch] : -1;
    if (idx >= 0) return parsers[idx].parser(state);
    // NEW: non-ASCII fallback
    const nonAsciiParser = nonAsciiMap?.get(ch);
    if (nonAsciiParser) return nonAsciiParser.parser(state);
    mergeErrorState(...); state.isError = true; return state;
};
```

The table constructor (`dispatch(table)`) builds `nonAsciiMap` lazily from any
key char code ≥128 in the table record.

**kf-side:** `proof:replay-equality` non-ASCII-ident arm (currently ABSENT from
the fixture set — the arm is a BOOK per DLL-50; born-RED on first author). GREEN
only after parse-that PT.M4 ships + value.js re-pins its grammar to use the
wider dispatch.

### M-wave PT.M5 — `permutation` combinator: typed CSS `||` semantics (W105 / PT-WAVE-5)

**What:** A new `permutation(...parsers)` combinator: try each remaining
un-matched parser at current offset; on match, recurse with that parser removed
from the set; succeed when at least one matched. Return type:
`permutation(p1: Parser<A>, p2: Parser<B>, p3: Parser<C>) => Parser<Partial<[A, B, C]>>`.

The implementation is O(n!) in the worst case (n = number of sub-parsers) BUT
CSS shorthands cap n at 9 (`animation`) and most at 4-5. The combinator is
zero-alloc over `ParserState` in the same discipline as `any()`/`all()` — each
branch resets `state.offset` on failure, no intermediate allocation.

**kf-side:** `proof:replay-equality` shorthand arm (e.g. `animation: 1s ease-in
0.5s infinite bounce` with sub-values in non-canonical order) is ABSENT today —
value.js's shorthand parse is order-sensitive and drops sub-values in
non-canonical positions. Born-RED arm. GREEN only after parse-that PT.M5 ships +
value.js adopts `permutation` in its shorthand grammar.

**Ordering note:** PT.M5 can ship independently of PT.M3/PT.M4; they share no
source file (`leaf.ts` is the combinator core; the permutation combinator may
live in the same file or in a dedicated `combinators.ts`).

### M-wave PT.M6 — Option B structural grammar deletion (W97 / parse-that MAJOR)

**What:** Delete `src/parse/parsers/css/` STRUCTURAL surface: `cssParser`,
`parseRule`, `parseSelectorList`, `parseMediaQueryList`, `types.ts` (`CssNode`,
`CssSelector`, `CssQualifiedRule`, `CssAtMedia`, `CssAtSupports`, etc.).
**KEEP** `parseSingleValue`, `parseFunctionArgs` (the §1.5 value readers). Ship
as a MAJOR version bump (1.0.0 or the next major after 0.9.0 — parse-that's
versioning cadence decides).

**Why this can lag:** no constellation member consumes `cssParser` today (kf
uses value.js's `parseCSSStylesheet`; value.js uses parse-that combinators
only, never `cssParser`). The structural deletion is a CORRECTNESS/KISS
cleanup, not an urgency. It can lag value.js O + kf re-pin by one or more
tranches.

**What MUST precede it:**
1. value.js O ships `parseCSSSubValue` (consuming `parseSingleValue`/
   `parseFunctionArgs`) — so the value readers have an active consumer BEFORE
   deletion of the structural layer removes other parse-that CSS surface.
2. kf re-pins and deletes its direct parse-that dep — confirming the only kf
   parse-that edge is via value.js.

**kf-side:** `proof:boundary` (W96 extension) asserts zero
`@mkbabb/parse-that` imports in `src/animation/`. RED today (the `any` import).
GREEN when value.js VJ-L3 ships + kf consumes + dep deleted. The structural
deletion (PT.M6) does not need to land first for `proof:boundary` to green —
it is a FOLLOW-ON cleanup.

---

## §6 — Deferred folds for M

| DLL# | What | Tripwire | Chronicity |
|------|------|----------|-----------|
| **DLL-22** | parse-that packrat / PT-2 soundness — `(id,offset)` re-key; `proof:packrat-sound` gate-first authored; `memoize.test.ts:88-103` is the born-RED oracle | parse-that PT.M3 publish + value.js re-pin | 5 tranches (E,F,G,H,I,K→L→M) |
| **DLL-50** | non-ASCII `dispatch()` fallback — `Map` fallback for code points ≥128; `proof:replay-equality` non-ASCII-ident arm (BOOK, not yet authored) | parse-that PT.M4 publish + value.js re-pin | 1 tranche (L→M) |
| **DLL-27 (parse-that portion)** | Option B structural grammar deletion (PT.M6) — MAJOR; can lag all other M-waves; no live constellation consumer | value.js O `parseCSSSubValue` published + kf dep-deleted (PREREQUISITE), then parse-that MAJOR | 1 tranche (L→M) |
| **DLL-23 (S9 arm)** | direct `@mkbabb/parse-that` import at `kf/src/animation/utils.ts:1` — `proof:workaround-deletion S9 = PENDING`; tripwire is value.js VJ-L3 `parseCSSSubValue` | value.js 0.14.0 published | 1 tranche (K→L→M) |

---

## §7 — Cross-repo coordination (the M-spine)

The coordinated M publish sequence (the §8 cadence from KF-TO-PARSE-THAT-ASKS,
verified and refined here):

```
parse-that PT.M1 (typesVersions + CJS cleanup — package.json only; FIRST, lowest-risk)
   └─► value.js re-pins parse-that → kf follows transitively
        → proof:deps-current typesVersions-absent arm GREEN

parse-that PT.M2 (API-stability confirm for parseSingleValue/parseFunctionArgs — no code)
   └─► value.js Tranche O ships parseCSSSubValue (VJ-L3) consuming them
        → kf re-pin: deletes utils.ts:1 import + package.json dep
        → proof:boundary (W96) GREEN — zero parse-that imports in src/
        → proof:workaround-deletion S9 GREEN

parse-that PT.M3 (packrat soundness — ONE-LINE fix per §5; getCijKey already exists)
   └─► value.js recursive grammar (L.W10/DLL-27 @container/@layer typed bodies) safe to opt in
        → proof:packrat-sound GREEN (memoize.test.ts:88-103 "SOUND target" flips)

parse-that PT.M4 (dispatch() non-ASCII Map fallback — additive, ASCII fast path untouched)
   └─► value.js ident/attr()/env()/custom-ident grammar admits non-ASCII idents
        → proof:replay-equality non-ASCII-ident arm GREEN

parse-that PT.M5 (permutation combinator — typed CSS || semantics)
   └─► value.js collapses shorthand hand-rolled order-tolerance workarounds
        → proof:replay-equality shorthand arm GREEN

parse-that PT.M6 (MAJOR: delete structural cssParser/CssNode; keep value readers)
   — can lag all of the above; no live consumer of cssParser in the constellation
   — MUST follow: value.js O parseCSSSubValue published + kf dep-deleted
```

**After PT.M2 cascade completes (value.js O + kf dep-deletion):**
kf has ZERO direct parse-that imports. All coordination flows through value.js.
The spine is: `parse-that (combinators + value readers)` → `value.js (the ONE
typed CSS grammar)` → `kf (animation engine)`. Acyclic, published-only,
one-consumer-per-layer.

---

## §8 — Performance notes

The `dispatch()` ASCII fast path (`Int8Array(128)` index, `ch < 128` guard) is
SOTA for the CSS common case — confirmed SOTA in the audit. The non-ASCII
fallback (PT.M4) adds a `Map<number, Parser<T>>` lookup on the cold path only.
No perf regression on the ASCII fast path by construction.

The packrat tier (PT.M3) is OFF the default parse path. The `getCijKey`
composite already does one `<< 20 | &` operation per lookup; changing the MEMO
to use it has negligible cost over the already-correct LR-count table. No
measured perf impact on non-recursive grammars (they never touch the packrat
tier at all).

No parse-that bench numbers are available for the M audit. The KF-TO-PARSE-THAT-ASKS
doc cited the audit's *"zero-alloc ParserState, O(1) dispatch"* SOTA characterization
— this is confirmed by source inspection. No regression is proposed.

---

## §9 — Verdict summary

**parse-that 0.9.0 is a sound, well-structured combinator library with four
discrete defects** — each isolated, each bounded, each fixable without
architectural upheaval:

1. **Manifest hygiene** (P1/P2): stale `typesVersions` + CJS artifact. One-line
   `package.json` edit. Ships as PT.M1 / `0.9.1`.
2. **Packrat MEMO key** (P3): `MEMO.get(p.id)` should be
   `MEMO.get(getCijKey(p, state))`. The composite key function is ALREADY
   WRITTEN and used correctly for the LR-count table. Two call-site changes.
   Ships as PT.M3 / `0.9.x` after PT.M1.
3. **Non-ASCII dispatch gap** (P5): `ch < 128` guard hard-fails non-ASCII.
   Additive `Map` fallback. Ships as PT.M4 / `0.9.x`.
4. **Permutation combinator absent** (P4): no `permutation()`. Net-new combinator.
   Ships as PT.M5 / `0.9.x`.

The **structural CSS module redundancy** (P7) is a real KISS violation — two
CSS grammars in the constellation, the weaker one consumed — but its resolution
(Option B MAJOR) lags the above without blocking any M-wave. The **produce-without-consume** gap (P6) on `parseSingleValue`/`parseFunctionArgs` closes via
value.js O adoption, not a parse-that code change.

**The prior audit's framing that requires correction (the L.W1 lesson applied
here):**

- The packrat re-key was framed as *"a from-scratch WDM reimplementation."*
  Ground truth: `getCijKey` is already correct; the fix is a MEMO lookup
  key change. Cost is materially lower than framed.
- The `parseSingleValue`/`parseFunctionArgs` cross-realm concern was framed as
  potentially blocking the §8 consume. Ground truth: these functions operate
  on `ParserState<unknown>` directly, bypassing the `Parser<T>` nominal-type
  barrier entirely. No cast hack needed in value.js's adopt.
- The W10 spike's Option B requires nuance: "delete `parsers/css/`" should be
  read as "delete the STRUCTURAL grammar; keep the value readers" — both the
  spike and KF-TO-PARSE-THAT-ASKS §3.2 make this clear, but the headline
  phrasing risks being read as "delete the whole CSS module," which would
  break the §8 consume-edge.
