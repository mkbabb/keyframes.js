# parse-that SOTA hand-off — the Tranche-F cross-repo charter for `@mkbabb/parse-that`

**What this is.** The cross-repo charter the **`@mkbabb/parse-that` owner reads first** — the
combinator-engine layer one below `@mkbabb/value.js`, two below keyframes.js. It consolidates
the Tranche-F PARSING-SOTA deep-dive's parse-that-side findings into one prioritized,
falsifiably-gated proposal that carries the keyframes.js mandate with it. It is sourced from
the parsing synthesis (`docs/tranches/F/audit/parsing/_SYNTHESIS-parsing-sota.md`, §0–§5) and
the four parse-that-axis phase-1 lanes: `px-parse-that-arch` (the engine architecture),
`px-vj-css-parser` (PX-1/PX-2, the unsound-memo + dormant-reader roots), `px-parser-perf`
(PXP-1, the measured `any()` linear-rescan tax), and `px-parser-sota-libs` (the SOTA-field
convergence). It is the parse-that companion to the value.js charter v2
(`docs/tranches/F/valuejs-sota-handoff-v2.md`) — together they are the two cross-repo
artifacts Tranche F emits.

**Synthesis id:** `_F-parse-that-handoff`. **Deliverable:** this file only.

**inv-16 (hard — the whole point of this file).** This is a **HAND-OFF, not a directive, not
a write.** `@mkbabb/parse-that` is a **third, separate `@mkbabb` repo**
(`/Users/mkbabb/Programming/parse-that/`), distinct from value.js and keyframes.js. keyframes.js
does **not** edit parse-that. Every item below is a *proposal* the parse-that owner sequences,
scopes, accepts, defers, or re-scopes against parse-that's own discipline. The value.js-side
consumption findings (`any()`→`dispatch()` adoption, the `istring` non-anchor, the `linear()`
parser) are owned by the value.js charter v2 — **this file names only where each of them roots
in a parse-that-side cause**, and proposes the parse-that fix that unblocks it; it does not
re-derive the value.js-side number. keyframes.js owns no parse-that edit at all.

> Every cross-repo `file:line` was re-grounded against the live trees at audit time
> (2026-06-06) by the phase-1 lanes and **re-confirmed live for this charter** (the
> verification spot-checks are folded into the rows below):
> `parse-that typescript/src/parse/{parser,leaf,span,state,utils,scan}.ts`,
> `parsers/css/value.ts`, `rust/parse_that/{Cargo.toml,src/}`; the installed dist at
> `keyframes.js/node_modules/@mkbabb/parse-that/dist/` (pin `0.8.2`).

**The mandate (travels WITH this charter — verbatim-in-substance, the same precepts the
keyframes tranches and the value.js charter run under).** NO quick solutions, NO workarounds —
idiomatic, gestalt approaches only. This is a development product: **architectural
transpositions for the sake of elegance, simplicity, and performance above all are both
necessary and desirable** (the state-threading and packrat-isolation below ARE transpositions,
not patches — sequence them as such). **NO legacy code**: a replaced surface is replaced in the
same motion; a removed name is removed; the dead unsound packrat is **isolated or deleted**, not
left wired in a half-state beside its replacement. Every item is **measure-first** (a perf claim
lands behind a bench or is recorded-withheld with the number), **isomorphic** (output
value-equal / error-output-equal unless a befitting delta is NAMED — the per-row isomorphism
notes are binding), and **falsifiably gated** (the per-row gates MUST bite, not narrate). KISS —
§5's ALREADY-SOTA record is binding: **manufacture NO work where parse-that already leads.** The
F audit found parse-that's leaf tier to be **at or beyond the JS-combinator frontier** — the
gaps are the **module-global state**, the **dead-and-unsound packrat**, and the **half-published
span algebra**, NOT the hot primitives.

---

## §0. The headline — the one-sentence verdict + what F proposes

> **TRANSPOSE the engine seams; do NOT rewrite, do NOT cross the WASM boundary.** parse-that's
> **leaf tier is ALREADY-SOTA** (mutable single-`ParserState` offset-rewind, zero-alloc
> `string`/`regex`/whitespace leaves, the `Int8Array(128)` first-char `dispatch`, the
> flag-gated `call()`, the soundness-audited `many`/`sepBy`). The genuinely-not-SOTA seams are
> **above** the leaves: (1) the error/diagnostic substate lives in **module globals**, not on
> `ParserState` — a non-reentrancy / diagnostics-corruption hazard the Rust port already solves
> with state fields; (2) the packrat / left-recursion tier is **dead on every production path,
> latently UNSOUND** (id-only-keyed, not `(id,offset)`), and **taxes the LL(1) hot path** with a
> per-parse `MEMO.clear()`; (3) the span subsystem is a **half-published parallel algebra**
> (dist 0.8.2 ships 8 of 15 source span fns — a silent version-drift defect) with
> double-maintenance against `parser.ts`. The Rust port is the **design ORACLE** for which TS
> transpositions are real (spans-first, dispatch, state-threading) and which are not (packrat) —
> it is **NOT a deploy target**: every Rust win (SIMD bitmaps, the bump arena, zero-copy
> `Span<'a>` borrowing the input slice) is a property of owning a contiguous buffer for a whole
> parse, none of which survive a per-value WASM marshalling crossing.

**The four proposed parse-that waves (full detail §1; sequencing §2):**

| Wave | Item | Class | Disposition |
|---|---|---|---|
| **PT-WAVE-1** | Thread the furthest-offset / expected-set / diagnostics error-state onto `ParserState` (off the module globals) | soundness, architectural | **parse-that-HANDOFF (HIGH)** |
| **PT-WAVE-2** | Isolate / re-key the dead `(id)`-keyed packrat into an opt-in module; strip the per-parse `MEMO.clear()` reset tax from the LL(1) default path | soundness + perf-hygiene | **parse-that-HANDOFF (MED)** |
| **PT-WAVE-3** | Rebuild + version-bump the half-published span dist (8-of-15 source↔dist drift) NOW; BOOK the span-first core unification | publish-discipline (now) + architectural (BOOK) | **parse-that-HANDOFF (MED)** |
| **PT-RECORD** | The build-time per-combinator closure allocation — the Rust port answered it, JS cannot express the monomorphized alternative | cost-model | **RECORD (ALREADY-SOTA for the JS workload)** |

Plus one **additive expose** (the prerequisite for value.js's deepest adoption, §1.5) and two
explicit **KILLs** (the WASM bridge, the chevrotain-codegen rewrite — §4), both recorded so no
future pass re-litigates them.

---

## §1. The proposed waves

Ordered by the gestalt dependency: the soundness root first (it unblocks everything and subsumes
a sibling-lane surface fix), then the packrat isolation it enables, then the publish-discipline
fix + the architectural BOOK.

### PT-WAVE-1 — thread the error/diagnostic state onto `ParserState` (HIGH, soundness)

**The finding (verified live).** The entire error / diagnostic substate is held as
**file-scoped mutable singletons** in `utils.ts`:

- `lastFurthestOffset = -1`, `lastState`, `lastExpected: string[]`, `lastSuggestions`,
  `lastSecondarySpans` (`utils.ts:31-35`) — written by `mergeErrorState` on **every** failed
  branch during a parse.
- `collectedDiagnostics: Diagnostic[]` (`utils.ts:146`) — the error-recovery accumulator.

Plus `parser.ts`'s `MEMO`/`LEFT_RECURSION_COUNTS` (`parser.ts:19-20`) and `PARSER_ID`
(`parser.ts:17`). `Parser.parse(val)` runs `parseState` → `reset()` (clears the globals,
`parser.ts:41-48`) → parses → reads `getLastState()`/`getLastFurthestOffset()` to render the
error display (`parser.ts:50-67`). **Crucially, `ParserState` already carries the correct home**
— `furthest: number = 0` (`state.ts:30`) and `expected?: string[]` (`state.ts:23`) are instance
fields — **but they are vestigial**: `mergeErrorState` writes the globals and only backward-mirrors
to the instance. **This is exactly backwards from SOTA.**

**Why it is a soundness hazard, not style** (`px-parse-that-arch §4`): the furthest-offset
tracking is correct **only because `reset()` runs at the top and nothing else parses
concurrently**. It breaks under two real scenarios — **(1) re-entrancy**: a `.map`/`.chain`
callback that itself calls `someParser.parse(subInput)` mid-rule runs `reset()` in the middle of
the outer parse, **wiping the outer parse's furthest-offset + collected diagnostics** (value.js
does not do this *today*, but `.parse` is the public entry — the API invites it and corruption is
silent); **(2) interleaving**: two parses cannot run interleaved — the globals make parse-that
**fundamentally single-flight**, blocking the streaming/incremental direction the SOTA field is
moving toward (csstree, the `@csstools` forgiving tokenizer).

**The transposition.** The direct port of the Rust port's already-correct model
(`rust/.../state.rs:36-45`, diagnostics as state fields; `parse.rs:116`,
`state.furthest_offset` is a field): `mergeErrorState(state, label)` mutates
`state.furthest`/`state.expected` **in place** (the fields exist); `parseState` reads them
directly off the state object it already holds; `reset()` shrinks to clearing only the `MEMO`
maps (and per PT-WAVE-2, those move out — so `reset()` may **disappear entirely** on the default
path).

- **Disposition:** **parse-that-HANDOFF (HIGH — architectural soundness).** The root that
  unblocks the rest. **Do this first.**
- **Gate** (`proof:reentrant-furthest`, FALSIFIABLE + MUST BITE): a re-entrancy regression test —
  `outer.map(() => inner.parse(x))` **preserves the outer parse's furthest-offset** (reds today:
  the inner `reset()` wipes it; greens once state-threaded) — **plus** the full
  `css-diagnostics`/`css-recovery` corpus passes byte-identically state-threaded (the
  single-flight error outputs are unchanged — the ONLY changed case is corruption-under-reentrancy,
  from wrong to right).
- **Isomorphism:** error *outputs* unchanged for every single-flight parse (the entire current
  corpus); only the re-entrancy corruption case changes (a befitting correctness delta, NAMED).
- **The cross-repo root it subsumes.** The value.js `console.error` custom-color-name leak
  (value.js charter v2 **F7**; `value.js/src/parsing/color.ts:613-628` runs the rich parser first,
  so every parse of a *registered custom color name* fails the first attempt and the top-level
  `parseState` fires `console.error(state.toString())` on the expected failure) is **downstream of
  this exact subsystem** — the two `console.error`s at `parser.ts:59,63`. value.js's cheap fix is
  to reorder `parseCSSColor` to try the name-map first; **the architectural root is here** — once
  the error state is local to `ParserState`, gating the two `console.error`s behind an
  `isDiagnosticsEnabled()` flag is a natural one-line surface fold. *Folds the parse-that root of:
  value.js-v2 F7.*

### PT-WAVE-2 — isolate / re-key the dead unsound packrat; strip the reset tax (MED)

**The finding (verified live, two defects in one tier).**

1. **The packrat MEMO is `id`-keyed, not `(id, offset)`-keyed → latently UNSOUND.**
   `Parser.memoize()` (`parser.ts:83`) stores/retrieves with `MEMO.get(this.id)` /
   `MEMO.set(this.id, …)` (`parser.ts:88,104,110,123,136`) — **the offset is not part of the
   key.** A packrat memo is *by definition* keyed on `(rule, position)`. The sibling
   `LEFT_RECURSION_COUNTS` is keyed *correctly* — `getCijKey(state) = (id << 20) | (offset &
   MAX)` (`parser.ts:74-76`, the 20-bit-offset / 11-bit-id packing) — and `MEMO` simply does not
   use it. The same parser at offset 0 and offset 40 collide; the guard `cached.offset >=
   state.offset` (`parser.ts:90`) either restores a wrong offset/value or silently re-parses
   without keying the new position. **The fix is already in the file** — `getCijKey` is the
   correct key, unused by `MEMO`.

2. **It is DEAD on every production path, and the dead machinery taxes the hot path.** Grep is
   unambiguous: `.memoize()` is **defined** at `parser.ts:83` with **zero call-sites** in
   parse-that `src/`, in value.js `src/`, in keyframes.js, and in the BBNF generators
   (`bbnf-lang`, `bbnf-buddy`) — the **only consumer is `test/memoize.test.ts`**. The README's
   "handles left recursion" banner is backed by a *test*, not a live grammar. Yet `reset()`
   clears both `MEMO` and `LEFT_RECURSION_COUNTS` on **every** top-level `parse()`
   (`parser.ts:43-44,48`) — so the very workload that has no left recursion to memoize (value.js's
   per-token compile-time parses, the kf per-frame computed re-parse) pays a per-parse
   `Map.clear()` tax for a dead feature. **The decisive corroboration:** the **Rust port — the
   project's own SOTA-performance artifact — implements no left-recursion / packrat at all** (no
   `memoize`/`seed`/`grow` in `rust/parse_that/src/`). When the same author rewrote for maximum
   performance, packrat was **dropped, not ported.** CSS value grammars are LL(1)-ish under
   first-char dispatch and do not need packrat — dispatch obviates it.

**The transposition (ISOLATE, not blunt-KILL — the synthesis adjudication).** Two phase-1 lanes
split on the verdict: `px-vj-css-parser PX-1` and `vj-parser-aug §2.4` reached **KILL**;
`px-parse-that-arch §3` reached **ISOLATE**. The synthesis (`_SYNTHESIS-parsing-sota §1 PT-2`)
adjudicates to **ISOLATE-then-the-default-path-loses-the-tax** — KILL would discard a real,
tested capability the BBNF-lang feature could one day want; ISOLATE removes the tax AND the
unsoundness from every non-recursive parse:

- Move `.memoize()`/`.mergeMemos()` + the `MEMO`/`LEFT_RECURSION_COUNTS` maps into a **separate
  opt-in module** (`packrat.ts`) the BBNF generator imports **only on a detected left-recursive
  grammar** — exactly as the Rust port omits them by default.
- **Re-key `MEMO` to `getCijKey(state)` inside the opt-in module** — fixing the id-only
  unsoundness in the same motion (no compat alias, no half-state — the no-legacy cut). Keep
  `getCijKey` verbatim; it is the one piece worth preserving.
- The default `parse()`/`reset()` path then carries **no** `MEMO.clear()` — the non-backtracking
  grammars (value.js, kf, the JSON/CSV/CSS reference parsers) stop paying for a feature they never
  use. Post-PT-WAVE-1, `reset()` may vanish on the default path entirely.

- **Disposition:** **parse-that-HANDOFF (MED).** Depends on PT-WAVE-1 (once errors are
  state-threaded, `reset()` is only the `MEMO` maps).
- **Gate** (`proof:packrat-isolated`, FALSIFIABLE + MUST BITE): the `memoize.test.ts`
  left-recursive grammars **still pass** through the opt-in path (the capability survives) **AND**
  the re-keyed `MEMO` passes a position test that the id-only key fails (a same-parser-two-offsets
  case returns distinct results — reds on the current `MEMO.get(this.id)`, greens on
  `getCijKey`); **AND** a JSON/CSS/value bench shows the per-parse `Map.clear()` gone from the
  LL(1) hot loop (a `clear`-call counter on the default `parse()` path drops to 0).
- **Isomorphism:** the default-path parse outputs are byte-identical (packrat was never on that
  path); the only behavioural change is the re-keyed memo (from latently-wrong to correct) inside
  the opt-in module. The reset-tax removal is pure perf-hygiene.

### PT-WAVE-3 — rebuild the half-published span dist NOW; BOOK the span-first unification (MED)

**The finding (verified live).** `span.ts` (548 lines) is a **complete parallel combinator
family** returning `Span {start, end}` (`state.ts:8`) instead of materialized substrings — the
zero-copy model — mirroring nearly the whole value algebra: leaves (`stringSpan`, `regexSpan`,
the `Uint8Array(128)` byte-class `takeUntilAnySpan`), structure (`manySpan`/`sepBySpan`/`wrapSpan`/
`optSpan`/`skipSpan`/`nextSpan`/`altSpan`), and the full assertion family (`negateSpan`/`peekSpan`/
`notSpan`/`minusSpan`/`lookAheadSpan`). This is **excellent SOTA-direction work** — spans are
exactly how lightningcss/csstree/the Rust port avoid substring allocation. But it carries two
problems:

1. **Source↔dist version drift with NO version bump (a latent runtime `undefined`).** Re-confirmed
   live this charter: the installed **dist `0.8.2`** exports **8** span fns (`stringSpan`,
   `regexSpan`, `manySpan`, `sepBySpan`, `wrapSpan`, `optSpan`, `skipSpan`, `nextSpan`) and
   **omits** `altSpan`, `takeUntilAnySpan`, and the entire 5-member assertion family — while the
   **source at the same `0.8.2`** (`typescript/src/parse/index.ts`) exports **all 15**. The span
   work post-dates the 2026-03-10 dist build (`git db19633` "add altSpan and takeUntilAnySpan";
   `git 597476f` the soundness audit). **A consumer `import { altSpan }` from the pinned dist hits
   a runtime `undefined`** — and the version number lies about it.

2. **Two parallel algebras is itself a maintenance liability.** Every soundness fix lands twice —
   and `git 597476f` proves it does: "soundness audit — sep_by trailing, negate/not/minus state"
   touched **both** `parser.ts` and `span.ts`. The `sepBy` trailing-separator logic exists in
   `parser.ts` **and again** in `span.ts`; the assertion semantics exist in both. Drift between the
   two is a live risk (the dist drift above is the first instance).

**The transposition.** Two items, sequenced:

- **(a) publish-discipline, IMMEDIATE:** rebuild + version-bump so **dist exports == source
  exports**. The current `0.8.2`-means-two-things state is a correctness defect, not a nicety.
- **(b) architectural, BOOK:** the SOTA answer is **one span-first core** (the Rust port's model:
  every leaf returns `Span<'a>`, the materialized string is a consumer-side `.text()` map). Make
  the leaves return spans by default, provide `.text()` / `.str()` as a one-line
  `.map(span => spanToString(span, src))`, and collapse the span-vs-string distinction to *what
  the leaf returned* — the structure combinators (`many`/`sepBy`/`wrap`/assertions) already only
  manipulate offsets + the inner value, so they need **one** span-agnostic implementation.
  `takeUntilAnySpan`'s byte-class scanner is the one genuinely-new primitive worth keeping
  first-class.

- **Disposition:** **parse-that-HANDOFF (MED, two items):** (a) **SHIP-now** (publish-discipline);
  (b) **BOOK** the span-first unification — *honestly sized:* a multi-day core refactor touching
  every combinator with real blast radius; BOOK it as the dedicated span-unification tranche, do
  NOT bolt it on.
- **Gate:** (a) `dist exports === source exports` (a grep equality that bites today — 8 vs 15);
  (b) for the BOOK — every `*Span` test AND every value-combinator test passes against the unified
  core, the JSON/CSS benchmarks show no regression (spans are strictly fewer allocations).
- **Isomorphism:** (a) additive — the missing 7 fns become reachable; (b) value-equal — spans are
  an allocation reduction, materialization is deferred to the consumer.

### PT-RECORD — the build-time closure allocation (ALREADY-SOTA for JS)

**The finding** (`px-parse-that-arch §2`, sharpened by `px-parser-perf PXP-1`). Every combinator
(`then`/`or`/`map`/`many`/`sepBy`/`wrap`/`trim`, `parser.ts:149-774`) returns
`new Parser(closure, context)` capturing its children — the **parsimmon model**. A grammar of N
applications allocates ~3N objects **at construction**, once at module load, never per-parse. For
value.js's static grammar (the unit/color/math tree) that is a few thousand objects once at
import — invisible at runtime.

**Why it is RECORD, not a handoff.** The only SOTA improvement to the *cost model itself* is
compile-time monomorphization (nom/winnow's zero-cost trait composition; the Rust port's
`SmallBox<dyn ParserFn, S32>` inlining small closures into a 32-byte buffer, `parse.rs:62`) — and
**JS cannot express it.** The project already answered this by writing the Rust port. There is no
pure-TS transposition that changes parse-that's cost model without abandoning the algebraic
combinator API (chevrotain-style codegen would be a different library — §4). **The Rust port is
the cost-model SOTA and it is in-tree as the oracle.**

- **One disambiguation (`px-parser-perf PXP-1`, MEASURED):** the *build-time alloc* is RECORD, but
  the **call-time `any()` N-way linear re-scan IS a hot-path cost** — isolated at **21×** at the
  tail (132.7 ns 11th-branch vs 6.2 ns `dispatch`, flat across branch position). That cost is
  removed by `dispatch`, which parse-that **already ships and exports** (`leaf.ts:60-104`). It is a
  *value.js-consumption* fix (value.js trials `any()` where it should `dispatch()` — value.js
  charter v2 Wave A) requiring **zero parse-that change beyond §1.5's expose** — the primitive that
  removes it is already built. So: build-alloc → RECORD; call-time `any()` re-scan → the value.js
  adoption rides parse-that's existing `dispatch`.
- **Disposition:** **RECORD (ALREADY-SOTA for the JS workload).** Noted so no future pass mistakes
  the build-time alloc for a hot-path cost, or chases the un-portable `SmallBox` trick.

### §1.5 — the additive expose (the prerequisite for value.js's deepest adoption)

**The finding (verified live).** parse-that **already hand-writes the SOTA reader value.js
reimplements**: `parseSingleValue` (the first-char-dispatch single-pass reader,
`parsers/css/value.ts:11`) and `parseFunctionArgs` (`:89`) exist, typed, returning parse-that's
`CssValue` union — but **only `cssParser` (whole-sheet) is root-exported**; `parseSingleValue`,
`parseFunctionArgs`, and the `scan.ts` charCode scanners are NOT exported from the package root
(re-confirmed: the root `index.ts` exports `cssParser` via `parsers/index`, not `parseSingleValue`;
`scan.ts` even comments "internal — not exported"). value.js cannot adopt the reader it cannot
import.

- **Disposition:** **parse-that-HANDOFF (additive expose).** Export `parseSingleValue` /
  `parseFunctionArgs` at the package root. Cheap, additive, no behavioural change. Lands alongside
  PT-WAVE-1/2's sequencing.
- **Gate:** the symbols resolve from the package root; existing parse-that tests pass unchanged.
- **The cross-repo root it unblocks.** This is the **producer half** of value.js charter v2's
  *strategic option* — the `cssParser`-adoption transposition (VJ-WAVE-B): not "invent a
  tokenizer," but **"export one function (here) + write one thin `CssValue → ValueUnit` adapter
  (value.js side)."** The shape map is mechanical (`dimension`→`ValueUnit`, `color`→constructors,
  `function`→`FunctionValue`). Sequence the value.js adoption AFTER its cheap isomorphic Wave-A
  wins; this expose is the gate that makes it reachable. *Unblocks the parse-that root of:
  value.js-v2 Wave A's `cssParser`-adoption option.*

---

## §2. Proposed sequencing (owner-discretionary)

```
PT-WAVE-1  thread error/diagnostic state onto ParserState ── HIGH, soundness ──────────── FIRST
   └─ the root; the fields already exist; subsumes the value.js console.error leak (v2 F7)
   └─ prerequisite for any future incremental/interleaved parsing

PT-WAVE-2  isolate + re-key the dead unsound packrat; strip the reset tax ── MED ───────── AFTER 1
   └─ once errors are state-threaded, reset() is only the MEMO maps → move to opt-in packrat.ts
   └─ re-key MEMO to getCijKey in the same motion (the no-legacy unsoundness cut)

§1.5  expose parseSingleValue / parseFunctionArgs ── additive ──────────────────────────── WITH 1/2
   └─ the producer half of value.js's cssParser-adoption (v2 VJ-WAVE-B), reachable

PT-WAVE-3a rebuild + bump the span dist (8-of-15 drift) ── publish-discipline ──────────── NOW
PT-WAVE-3b span-first core unification ── BOOK, multi-day, real blast radius ───────────── dedicated tranche

PT-RECORD  build-time closure alloc (ALREADY-SOTA for JS; Rust port is the cost-model oracle)
```

**Every wave is measure-first / falsifiably gated.** The soundness wins (PT-WAVE-1's re-entrancy,
PT-WAVE-2's position-keyed memo) are invisible to a happy-path microbench and surface only under
the re-entrant / repeated-offset cases the named gates construct; the perf-hygiene win (the
`MEMO.clear()` reset tax) shows on the per-token LL(1) hot loop the JSON/CSS bench exercises. The
gates that MUST bite: `proof:reentrant-furthest` (the outer-furthest-offset preservation),
`proof:packrat-isolated` (the position-key test + the `clear`-call counter), and the
dist-equals-source grep.

---

## §3. The rewrite-vs-transpose decision — re-confirmed, with the parse-that-engine angle

The parsing synthesis (`_SYNTHESIS-parsing-sota §3`) tabulated the full A-vs-B ledger and reached
**TRANSPOSE (Option B)**. This charter re-confirms it from the **engine-architecture** axis (not a
reflex): every win the Rust port realizes is a property of **owning a contiguous byte buffer for
the whole parse** —

| Rust-port win | Why it does NOT survive a per-value WASM crossing |
|---|---|
| 64-byte zero-padded, 64-byte-aligned input buffer (`state.rs:47-90`) | a fresh `getComputedStyle` string in, `TextEncoder`d across the boundary — no persistent padded buffer |
| SIMD whitespace bitmaps + memchr/aho-corasick scanners (`scanners.rs`) | amortized over a whole sheet; a per-value call parses ~8 bytes — the marshalling dominates |
| polymorphic bump-slab arena, zero per-node alloc (`bump_slab.rs`) | the AST must be `TextDecoder`d back to a JS `ValueUnit` graph — unbounded reconstruction lightningcss never pays |
| zero-copy `Span<'a>` borrowing the input slice (`parse.rs`) | the borrow does not cross the boundary; value.js returns **live mutable** `ValueUnit`/`Color` graphs, not byte strings |

**The Rust port is SOTA for whole-buffer ingestion (a CLI, a build tool, a server) — the WRONG
tool for keyframes.js's per-token JS workload** (`parseCSSValueUnit("12px")`, the per-frame
computed re-parse). It is the **design ORACLE** (it shows precisely which TS transpositions are
real — spans-first PT-WAVE-3b, state-threading PT-WAVE-1; and which are NOT — packrat PT-WAVE-2),
**not a deploy target.** Re-confirmed live: the Rust crate has **no `cdylib`/`wasm_bindgen`** —
there is no WASM artifact, and building one is the multi-month effort the F audit priced out.

---

## §4. The two explicit KILLs (recorded; do NOT re-litigate)

- **The Rust→WASM bridge — KILLED (recorded, strengthened).** Per §3: the marshalling tax is fatal
  to the per-value call shape; the Rust wins require whole-buffer ownership; the platform parser
  (CSS Typed OM `CSSStyleValue.parse()`) is still not-Baseline 2026. Revisit ONLY if a future
  product parses whole stylesheets — not a keyframes.js workload (`_SYNTHESIS-parsing-sota
  DECLINE-1`).
- **The chevrotain-style codegen rewrite — KILLED (recorded).** chevrotain is the fastest pure-JS
  toolkit precisely because it self-analyzes and builds LL(k) lookahead tables — but that means
  imperative rule-methods, **no algebraic `.then`/`.or`.** Adopting it = abandoning the combinator
  API = a different product. parse-that benchmarks against it to know the gap, not to become it
  (`_SYNTHESIS-parsing-sota DECLINE-2`).
- **Do NOT add packrat.** The existing one is dead + unsound (PT-WAVE-2 isolates/re-keys it);
  dispatch obviates it for LL(1) CSS grammars. A future pass must not reach for packrat first.

> **FRONTIER BOOK (named, explicitly subordinate):** staged-combinator `compile()`
> (`_SYNTHESIS-parsing-sota FRONTIER-1`) — compiling the construction-time combinator graph to
> specialized first-order code with a first-set dispatch table (Jonnalagedda 2014, Parsley/`flap`;
> the First Futamura Projection). It is the principled whole-grammar form of the manual
> `any()`→`dispatch` adoption — but the pragmatic 90% of its win **is** the manual dispatch (which
> needs no staging machinery), and the staged form is a multi-month engine project with a
> correctness blast radius. **BOOK as a dedicated tranche, subordinate to the cheap manual
> dispatch.** The Rust port is itself a hand-staged instance.

---

## §5. ALREADY-SOTA — manufacture NO work here (the KISS clause, binding)

Re-confirmed live, post-audit — the parse-that **leaf tier is at or beyond the JS-combinator
frontier; every transposition above is in the state model, the dead packrat, or the algebra
structure, NEVER in the hot primitives:**

- **Mutable single-`ParserState` with offset-rewind** (`state.ts:21-117`) — one state threads the
  whole parse, combinators save/restore `state.offset` rather than reconstructing an immutable
  state per step. Strictly faster than parsimmon's `{input,index}` and arcsecond's immutable
  state; it is the nom/winnow `&mut` model in JS. **Do not churn it.**
- **Zero-alloc leaves** (`leaf.ts`): `string()` (charCode fast path, `startsWith(str, offset)`, no
  substring until success); `regex()` (sticky `y` re-flagged once at construction, `test()` on the
  default path advances `lastIndex` with no `RegExpMatchArray` alloc); `trimStateWhitespace()`
  (charCode loop with non-WS fast-exit, no regex-engine entry for the common case).
- **The `Int8Array(128)` first-char `dispatch`** (`leaf.ts:60-104`) — the O(1) alternation the
  whole SOTA field (csstree, `@csstools`, lightningcss, winnow's `dispatch!`) converged on,
  **already built, exported, and proven in parse-that's own reference JSON parser.** The gap is
  value.js's *non-adoption* of it (value.js charter v2 Wave A), not the primitive.
- **Flag-gated `call()`** (`parser.ts:501-544`) — `flags===0` calls directly (the common case,
  zero overhead); the faithful JS port of the Rust port's `#[inline(always)]` `flags==0` fast
  return.
- **Soundness-audited `many`/`sepBy`** (`parser.ts:589-702`) — pre-sized arrays, zero-progress
  guards against nullable inners, the checkpoint-before-separator that correctly rejects trailing
  separators (`git 597476f`).
- **`getCijKey`'s numeric `(id<<20)|offset` memo-key packing** (`parser.ts:74-76`) — the one piece
  of the packrat tier worth keeping verbatim; PT-WAVE-2 re-uses it as the correct `MEMO` key.
- **The exported SOTA reader** — `parseSingleValue` + `cssParser` + `scan.ts` + the full `span.ts`
  family already exist, typed; §1.5 / PT-WAVE-3 are *adoption + publish-discipline*, not build.
- **The Rust port** — the SOTA-frontier design oracle, benchmarked against winnow/nom/pest/
  lightningcss/cssparser/simd_json; spans-first is its one portable lesson (PT-WAVE-3b).

**RECORD-grade (no action, noted to prevent mis-optimization):** `createParserContext` per-combinator
build-alloc for `debug()`/`toString()` (`state.ts:168-178`, build-time only); `getLineNumber`/
`getColumnNumber` re-scan from offset 0 on the cold error-display path (correct as-is — one lookup
per error); the `any/all` length-1 peephole (`leaf.ts:46,133`, ALREADY-SOTA micro-detail); the
2048-parser memo-key ceiling (binds only left-recursive grammars once packrat is opt-in — moves
with PT-WAVE-2).

---

## §6. Where each value.js-consumption finding roots in a parse-that-side cause

The charter's named cross-link — for each value.js-side consumption finding the F audit surfaced,
the parse-that-side root and the parse-that fix that unblocks it (inv-16: this charter proposes
the parse-that fix; the value.js half is owned by `valuejs-sota-handoff-v2.md`):

| value.js-side finding (owned by v2) | parse-that-side ROOT | the parse-that fix here |
|---|---|---|
| **`any()`→`dispatch()` adoption** (v2 Wave A1/A2; the 58 live `any(` sites; the measured 21× isolated / 3.65× end-to-end) | the `dispatch` primitive **exists + is exported** (`leaf.ts:60-104`) but the *single-value reader* that would carry it (`parseSingleValue`) is **not root-exported** | **§1.5** — expose `parseSingleValue`/`parseFunctionArgs` (unblocks VJ-WAVE-B's full adoption; the cheap per-fork `dispatch` needs no parse-that change, the primitive is already shipped) |
| **the `istring` non-anchor maximal-munch hazard** (v2 Wave A2; `units.ts:20` 45-way `any(istring)`; `svw` matches the `sv` prefix) | `istring` (`utils.ts:5-8`) compiles a **non-anchored** RegExp; `regex()` re-flags it sticky `y` (`leaf.ts:185`) — which anchors the *start* but **not the end** → prefix-match, safe only by declaration order | the structural fix is value.js-side (a longest-match LUT classifier, or adopt parse-that's `parseUnit` LUT in `scan.ts` which munches maximally); parse-that's contribution is **§1.5's expose** of that LUT path + the RECORD that the sticky-`y` semantics are correct-as-documented (the hazard is in *how value.js composes `istring`*, not in `regex()`) |
| **the `linear()` parser** (v2 Wave E1; value.js has the `cssLinear` evaluator but no parser; kf bridges with a hand-rolled regex shim) | NOT a parse-that defect — value.js simply hasn't *written* the `sepBy(comma)` of `all(number, percentage?, percentage?)` combinator against parse-that's existing primitives | **none on the parse-that side** — the primitives (`sepBy`, `all`, `number`, `percentage`) are all ALREADY-SOTA and exported; this is a value.js-authoring item (v2 E1), recorded here only to show it does **not** root in a parse-that gap |
| **the value.js `console.error` custom-name leak** (v2 F7; `color.ts:613-628` + `parser.ts:59,63`) | the two `console.error`s fire off the **module-global** error subsystem (`utils.ts:31-35`, `parser.ts:59,63`) — failure is treated as **I/O**, never a returned value (SOTA parsers do the opposite) | **PT-WAVE-1** — once the error state is local to `ParserState`, gating the two `console.error`s behind `isDiagnosticsEnabled()` is the natural fold; the architectural root is the state-threading, the value.js reorder is the cheap surface fix |
| **kf's diagnostics-blindness on a malformed parse** (kf BOOK + v2 VJ-F2 structured parse-error sink; `px-kf-grammar PX-5`) | value.js is *forgiving* (wraps, doesn't throw) but **silent** — and the error/diagnostic accumulator (`collectedDiagnostics`, `utils.ts:146`) it would surface is **module-global**, single-flight, and reset per parse | **PT-WAVE-1** — threading `collectedDiagnostics` onto `ParserState` is the prerequisite for value.js to expose a structured `onParseError`-shape sink (v2 VJ-F2) that kf can surface as a `diagnostics` channel |

---

## §7. inv-16 / inv ε compliance

This is a **HAND-OFF charter**, not a write. `@mkbabb/parse-that` is a separate, dirty + active
`@mkbabb` repo; keyframes.js does **not** edit it. Every item is a *proposal* the parse-that owner
sequences, scopes, and writes against parse-that's own discipline. The value.js-consumption
findings (§8) are owned by the value.js charter v2; this file names only their **parse-that-side
roots** and the parse-that fix that unblocks them. keyframes.js owns no parse-that edit.

**Only this file was written by this lane.** Every claim traces to a named phase-1 lane (cited
inline) or a `file:line` re-grounded against the live trees and **re-verified for this charter**
(2026-06-06): the module-global error state (`utils.ts:31-35,146`); the vestigial `ParserState`
fields (`state.ts:23,30`); the id-only `MEMO` key vs the correct `getCijKey` (`parser.ts:88,104,123,136`
vs `:74-76`); `.memoize()` defined at `parser.ts:83` with zero `src/` call-sites; the per-parse
`MEMO.clear()` reset tax (`parser.ts:43-44,48`); the two `console.error`s (`parser.ts:59,63`); the
dist 8-of-15 vs source 15-of-15 span export drift (`dist/index.d.ts` vs `src/parse/index.ts`, both
`0.8.2`); `parseSingleValue`/`parseFunctionArgs` defined (`parsers/css/value.ts:11,89`) but not
root-exported; the Rust crate's absence of `cdylib`/`wasm_bindgen`. The `git` provenance
(`597476f` soundness audit touching both `parser.ts`+`span.ts`; `db19633` the span additions
post-dating the dist) corroborates the double-maintenance + drift. The MANDATE travels with this
charter verbatim-in-substance.

## Sources

- **Parsing synthesis (consolidated, not re-derived):**
  `docs/tranches/F/audit/parsing/_SYNTHESIS-parsing-sota.md` (§0 verdict, §1 PT-1/PT-2/PT-4/PT-5,
  §3 rewrite-vs-transpose, §4 ALREADY-SOTA, DECLINE-1/2, FRONTIER-1).
- **parse-that-axis phase-1 lanes:**
  `docs/tranches/F/audit/parsing/{px-parse-that-arch,px-vj-css-parser,px-parser-perf,px-parser-sota-libs}.md`
  (px-parse-that-arch §1–§9 the engine architecture; px-vj-css-parser PX-1/PX-2/PX-5/PX-8;
  px-parser-perf PXP-1 the measured 21× `any()` tax).
- **value.js charter v2 (the consumption half, cross-linked):** `docs/tranches/F/valuejs-sota-handoff-v2.md`
  (Wave A dispatch/`istring`, E1 `linear()`, F7 the `console.error` leak, VJ-F2 the parse-error sink,
  the `cssParser`-adoption strategic option).
- **Live source (re-verified 2026-06-06):** parse-that
  `typescript/src/parse/{parser,leaf,span,state,utils,scan}.ts`, `parsers/css/value.ts`,
  `rust/parse_that/{Cargo.toml,src/}`; the installed dist `node_modules/@mkbabb/parse-that/dist/`
  (`0.8.2`); the parse-that `git log`.
- **SOTA field (per the upstream lanes):** winnow `dispatch!` (first-token > `alt`, `&mut` state);
  csstree (tokenize-once, `(type,start,end)` offset spans, `onParseError`); `@csstools`
  (spec-forgiving + error callback); chevrotain (self-analyzing LL(k) tables, no runtime closure
  composition); peggy/PEG.js (packrat, left-recursion-hostile); nom/winnow (zero-cost
  trait-monomorphized combinators); Warth et al. (packrat left-recursion seed-and-grow); staged
  combinators (Jonnalagedda 2014, Parsley/`flap`, First Futamura Projection); CSS Syntax Module
  Level 3; CSS Typed OM `CSSStyleValue.parse()` (not-Baseline 2026).
