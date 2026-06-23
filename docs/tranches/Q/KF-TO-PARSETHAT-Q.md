# keyframes.js → parse-that Tranche Q (0.13.0) — the cross-repo dispatch (ASK + INFORM)

> Authored 2026-06-23 at the keyframes **Tranche Q** development phase (the
> no-deferral terminal tranche — `docs/tranches/Q/Q.md`). parse-that is the ROOT
> of the constellation spine (**parse-that → value.js → keyframes.js → glass-ui**).
> This **supersedes and extends** the P dispatch (`docs/tranches/P/KF-TO-PARSETHAT-B.md`,
> which closed at the shipped **0.12.0**): the impl drive landed PT-B1's packrat
> cross-input fix + PT-B3's fusion/dispatch frontier + PT-B4's SpanParser KILL, but
> shipped THREE no-consumer surfaces (`thenMap`, `fuse`, the `dispatch` subTable) and
> a **re-entrancy regression** in the packrat fix that was never the cure the ledger
> specified. This is the formal handoff to parse-that's **Tranche Q** session.
>
> **inv-16 holds: no parse-that source is written from keyframes.js.** parse-that's
> Q session schedules these ASKs into its own waves; value.js consumes the corrected
> packrat surface + the consumer-anchored perf gate; kf inherits a faster, input-safe,
> re-entrancy-SOUND parser behind the same `CSSKeyframesAnimation` facade. Publish-then-consume,
> DAG-ordered, never cross-write.

This dispatch is the binding cross-repo contract behind kf wave **Q.WG1** (the
0.13.0 publish ask). parse-that Q sequences **BEFORE value.js Q** (which consumes the
subTable decision + the corrected packrat) and therefore **BEFORE keyframes Q** (the
transitive consumer). The version is a single **0.13.0 MINOR** — all asks are either
internal-correctness fixes or zero-consumer dead-code DELETIONS that carry **no BC
obligation** (a never-imported-able export is not part of the public contract).

> **Codegen is explicitly OUT (owner directive, carried from P).** parse-that ships
> NO `./codegen`, NO SpanParser→TS emitter, NO grammar-as-source generated parser.
> The dispatch/fusion frontier visually invites a "generate the dispatch table from a
> grammar" step — that is BBNF-lang's separate-session job, not referenced here as a
> dependency, substrate, or design reference.

---

## The ASK roster (one correctness BLOCKER + three no-legacy DELETIONS + one consumer-anchored gate)

> **Sibling-anchor verification (2026-06-23).** Every `file:line` anchor in this dispatch
> was re-confirmed against the LIVE parse-that source tree
> (`/Users/mkbabb/Programming/parse-that/typescript/src/parse/`) + the value.js consumer
> sites (`/Users/mkbabb/Programming/value.js/src/`). The AUDIT-31 anchors held EXCEPT the
> `*Span` range (`16-360` → corrected to `16-547`, which had truncated the last 5
> builders). All other anchors are tagged VERIFIED inline.

| # | ASK | parse-that surface (file:line, grounded in AUDIT-31 + VERIFIED 2026-06-23) | parse-that Q deliverable | the value.js+kf payoff | born-RED gate |
|---|-----|------------------------------------------------------|--------------------------|------------------------|---------------|
| **PT-Q.W0** | **commit + reconcile the B record** to CLOSED-as-built (record-as-built honesty; the constellation-truth precondition) | parse-that `tranche-b` published `v0.12.0`; the B PROGRESS/charter likely still read DEVELOPMENT on a shipped tranche (mirrors the value.js/kf stale-header class, B7-honesty-record) | reconcile the B record header to CLOSED with per-wave SHIPPED status; commit any untracked B docs | n/a (parse-that record hygiene; the precondition for a durable Q dispatch anchor) | `proof:progress-honesty` (parse-that-side): the B PROGRESS header is not `DEVELOPMENT` while a `v0.12.0` tag exists on master |
| **PT-Q1** *(the SHIPPED DEFECT — lands FIRST)* | **the packrat RE-ENTRANCY fix** — move the src-epoch reset to the parseState ENTRY boundary, NOT per-`memoizeFn`-call; add the try/finally unwind hardening | `packrat.ts:281-284` (VERIFIED — the per-`memoizeFn`-call `if (state.src !== CURRENT_SRC) { resetPackrat(); CURRENT_SRC = state.src; }` inside `memoizeFn` — the WRONG arm; throws at `:249` `const seed = (MEMO.get(key)!.ans …)` on a nested grow [VERIFIED — the `MEMO.get(key)!` non-null assertion reads `undefined` after a mid-grow `resetPackrat()` wipe → `TypeError`]); zero `try`/`finally`/`catch` in `packrat.ts` (VERIFIED via grep) (`B1-parsethat-packrat`) | reset at the parseState entry (`parser.ts:33-34` — VERIFIED: `parseState(val)` at `:33`, `new ParserState(val)` at `:34`, the top-level entry where each `parse()` knows its src) — the SAFE arm `FULL-LOOP-LEDGER.md:797` named and the impl DID NOT take; wrap `evalParser`/`growLR` in `try/finally` to unwind `LR_STACK`/`GROWING`/`HEADS` on throw | a nested `.parse(differentSrc)` mid-grow no longer wipes the outer grow → no `TypeError`; the public re-parse API is re-entrancy-SOUND | `proof:packrat-reentrant` (born-RED): a memoized LR parser whose `.map` runs a nested `memoize().parse(differentSrc)` returns the correct OUTER result (today: `TypeError` at `packrat.ts:249`) |
| **PT-Q2** *(the SHIPPED DEFECT — same fix-class)* | **the >1MB offset-budget** — widen `getCijKey`'s 20-bit offset so a source ≥ 2²⁰ chars does not alias memo cells; correct the two comment defects | `packrat.ts:56-68` (VERIFIED — `getCijKey`; `:52-54` declare `MEMO_OFFSET_BITS=20`/`MEMO_MAX_OFFSET`/`MEMO_OFFSET_SPAN`; `:67` returns `parser.id * MEMO_OFFSET_SPAN + (offset & MEMO_MAX_OFFSET)` — the 20-bit mask; the `:62-63` `id*2²⁰+offset … exact for id up to 2³³` comment is off-by-one; the `:64-66` `&`-vs-`%` justification is wrong; live: `getCijKey(1, 2²⁰+3) === getCijKey(1, 3)` VERIFIED by the formula) | widen the offset budget to the float64 mantissa headroom (`id*2²⁰+offset` affords ~53 bits) OR guard+throw on `offset ≥ MEMO_OFFSET_SPAN`; correct the comments to the verified-true rationale | a memoized parse of a >1,048,576-char source no longer mis-restores cells from offsets 1MB apart (a silent-wrong-answer residual) | `proof:packrat-large-offset` (born-RED): memoize a parser, parse a source longer than `MEMO_OFFSET_SPAN`, assert no aliasing (today: `getCijKey(1, 2²⁰+3) === getCijKey(1, 3)`) |
| **PT-Q3** *(NO-LEGACY DELETE — zero BC obligation)* | **DELETE `thenMap` + `fuse`** — two zero-consumer speculative fusion seams born 0.12.0 | `parser.ts:96-119` (VERIFIED — `thenMap<S,R>(next, fn)` is a `Parser` method, so barrel-reachable via any instance; ZERO callers constellation-wide; value.js has ZERO `.then().map()` chains); `leaf.ts:351-362` (VERIFIED — `fuse<T>(…parsers)` declared at `:352`; NOT in the barrel [absent from `index.ts:9` + `core.ts` — VERIFIED], byte-identical to `all()`'s internal `fuseAll`) | DELETE both: `thenMap` (no real `then+map` shape exists) + `fuse` (unreachable from the package root + redundant) — honoring parse-that's OWN substrate-deadcode precept (`03-substrate-deadcode.md`: zero-workspace-consumer surface → DELETE) | a smaller surface; the no-legacy precept restored (the 0.12.0 contrivance retired) | `proof:no-dead-combinator` (born-RED): greps the parse-that surface for any export with zero in-realm consumers; today `thenMap`/`fuse` match → RED |
| **PT-Q4** *(the `*Span` DECISION — adopt-or-deprecate, terminal-or-KILL)* | **resolve the 15 `*Span` builders** — zero-consumer published+gated surface KEPT only to honor a 0.12.0 BC-additive promise | `span.ts:16-547` (VERIFIED — the 15 `export function …Span` builders run line 16 `stringSpan` → line 521 `lookAheadSpan`, in a 547-line file; the earlier `16-360` anchor truncated the last 5 builders); ZERO consumers across `parse-that/value.js/kf` src (VERIFIED); barrel-exported at `index.ts:10` (VERIFIED) + pinned as "canonical public API" by `dist-surface.test.ts:52` (VERIFIED — the `it.skipIf(!hasDist)("all 15 span fns are present in the dist…")` clause) + `scripts/proof-span-parser-killed.mjs` (VERIFIED present) | EITHER **(a) ADOPT** — wire ONE value.js hot leaf (the generic ident/number run) onto `takeUntilAnySpan`/`regexSpan`, proving the zero-alloc Span path on a real seam (PT-Q4 then partners a value.js consume); **OR (b) DEPRECATE** — `@deprecated`-tag the 15 in 0.13.0, schedule the delete in the next major (a recorded plan, not a forever-keep) | a zero-consumer surface gets a TERMINAL disposition (consumed or scheduled-for-removal), never a perpetual "kept for BC" punt | `proof:span-surface-resolved` (born-RED): asserts EITHER (a) ≥1 value.js/kf source consumes a `*Span` builder, OR (b) all 15 carry `@deprecated` + a removal-version note; today neither holds → RED |
| **PT-Q5** *(the `dispatch` subTable CONSUME-OR-RETRACT)* | **resolve the 2nd-byte subTable widening** — built + gated, ZERO production consumers | `leaf.ts:103-215` (VERIFIED — `dispatch<T>(table, subTable?)` with the 2nd-byte sub-LUT widening); value.js's ONLY `dispatch()` calls pass NO subTable (`parsing/index.ts:425` `const Function_ = dispatch({` + `color.ts:732` `const Value = dispatch(dispatchTable)…` — both single-arg, VERIFIED); the only 2-arg call is `test/benchmarks/pt-b3-fusion.bench.ts:72` (VERIFIED — the `dispatch({}, { c: {…} })` widened bench) | EITHER **CONSUME** — value.js wires the subTable into its `dispatch()` to flatten the megamorphic `c`-bucket (calc/clamp/cos/conic/cubic), with `proof:perf` re-anchored to the REAL value.js corpus; **OR RETRACT** — revert `leaf.ts:103-215` as a no-consumer perf seam | the residual `c`-bucket megamorphism the subTable was BUILT for either gets harvested on the real path, or the speculative seam is removed | `proof:perf` (re-scoped, born-RED): clause B' asserts the widening's win over value.js's ACTUAL `c`-bucket grammar fixture (NOT the synthetic `ca/cl/cu` corpus the gate constructs today); if the on-path win < the floor, the wave pivots to RETRACT |

All asks are **BC-additive or zero-BC** to parse-that's published 0.12.0 surface: PT-Q1/PT-Q2 are internal correctness fixes (no surface change); PT-Q3 deletes never-importable dead code (no contract break); PT-Q4/PT-Q5 are decisions with a terminal-or-KILL. A single **0.13.0 MINOR** closes them.

---

## PT-Q1 — the packrat RE-ENTRANCY fix (the SHIPPED DEFECT, lands FIRST)

> **AUDIT verdict (`B1-parsethat-packrat`, 2026-06-23): NOT TERMINAL.** The 0.12.0
> PT-B1 cure resolved the cross-input soundness BLOCKER correctly for the
> non-re-entrant single-parse path (12 tests + `proof:packrat-cross-input` green,
> value.js consumes green), **but it is NOT a terminal fix** — it introduced a
> re-entrancy REGRESSION the ledger explicitly warned against.

**The defect, grounded (live-probe-confirmed; anchors VERIFIED 2026-06-23 against
`parse-that/typescript/src/parse/packrat.ts`).** `packrat.ts:281-284` fires
`resetPackrat()` **per-`memoizeFn`-call** whenever `state.src !== CURRENT_SRC` (VERIFIED —
the guard block is inside `memoizeFn`, not at a parse-entry boundary). A
memoized parser that runs a nested top-level `.parse(differentSrc)` mid-grow wipes
the OUTER in-progress grow's module-global state (`resetPackrat()` clears
`MEMO`/`HEADS`/`GROWING`/`LR_STACK`/`CURRENT_SRC` — VERIFIED at `:134-139`) → `growLR`
throws `TypeError` at `packrat.ts:249` (VERIFIED — `const seed = (MEMO.get(key)!.ans as
Answer);` non-null-asserts a memo cell `resetPackrat()` just deleted). **This is a throw,
not a stale answer** — a real public-API correctness defect (a re-entrancy regression).

**Why this is the exact arm the ledger named and the impl DID NOT take.**
`FULL-LOOP-LEDGER.md:797` states the cure should reset **"at the parseState ENTRY
boundary, not per-memoizeFn-call, for zero per-node cost."** A parseState-entry reset
(`parser.ts:33-34` — VERIFIED: `parseState(val: string)` at `:33` constructs
`new ParserState(val)` at `:34`, the single top-level entry where each `parse()` already
knows its `src`) is BOTH
cheaper (one compare per top-level parse, not per node) AND re-entrancy-safe (a nested
parse establishes its own entry epoch and unwinds to the parent's on return). The impl
shipped the per-node form — the wrong arm.

**The try/finally hardening — folded into PT-B1, never implemented.**
`FULL-LOOP-LEDGER.md:457` names "the try/finally around `evalParser`" as a "load-bearing
correctness item that should be explicitly named within PT-B1's cure section." `grep`
confirms ZERO `try`/`finally`/`catch` in `packrat.ts` (VERIFIED 2026-06-23 — `growLR` at
`:240-258` mutates `GROWING`/`HEADS` with no unwind guard). On any throw mid-grow, the
`LR_STACK`/`GROWING`/`HEADS` module-global stacks are left dirty — the blast radius the
re-entrancy throw exposes. The cure wraps `evalParser`/`growLR` in `try/finally` to
unwind the LR machinery on throw, so a recovered parse starts clean.

**The proposed cure (two viable forms, parse-that's session chooses).**
- **Form A (the ledger-named, FAVORED):** move the src-epoch reset to the parseState
  entry boundary (`parser.ts:33`). Each top-level `parse()` pushes its `src` epoch;
  a nested `parse(differentSrc)` pushes a child epoch and restores the parent's on
  return (a synchronous parse-stack, NOT a WeakRef-epoch).
- **Form B (a synchronous parse-stack-depth epoch):** scope the epoch to a parse-stack
  depth counter so the reset fires only at depth-0 entry, never mid-grow.

**The WeakRef-epoch is REJECTED** (the ledger's parked arm-(b)): async GC timing is
wrong for a synchronous parse lifecycle — a WeakRef-epoch would clear the cache at a
GC tick unrelated to the parse boundary, re-introducing nondeterminism. The cure is a
synchronous parse-stack epoch, full stop.

**The kf/value.js payoff.** value.js's parse LRU and kf's memoized timing-function
parses become re-entrancy-SOUND with zero caller discipline — a nested re-parse (the
exact shape a `calc()`-inside-`if()` resolve can trigger) no longer throws.

**Born-RED gate (`proof:packrat-reentrant`).** RED today: a memoized LR parser whose
`.map` runs a nested `memoize().parse(differentSrc)` mid-grow throws `TypeError` at
`packrat.ts:249`. GREEN when the entry-boundary reset + the try/finally land → the
nested parse returns its own result AND the outer grow completes correctly. Plant-a-failure:
revert the entry-boundary reset to the per-node form → the nested-parse clause re-throws.

---

## PT-Q2 — the >1MB offset-budget (the SHIPPED DEFECT, same fix-class)

**The defect, grounded (live-probe-confirmed; anchors VERIFIED 2026-06-23).** `getCijKey`
(`packrat.ts:56-68`) masks the offset with `& MEMO_MAX_OFFSET` — **20 bits** (`:67`,
VERIFIED: `return parser.id * MEMO_OFFSET_SPAN + (offset & MEMO_MAX_OFFSET);` with
`MEMO_OFFSET_SPAN = 2²⁰` at `:54`). A source ≥ 2²⁰ (1,048,576) chars silently aliases memo
cells: `getCijKey(1, 2²⁰+3) === getCijKey(1, 3)` (VERIFIED by the formula — both yield
`2²⁰ + 3`). A memoized parse of a >1MB source mis-restores cells from offsets 1MB apart —
a silent-wrong-answer residual.

**The two comment defects (correctness-of-record, same wave).**
- `packrat.ts:62-63` claims `id * 2²⁰ + offset` is "exact for id up to 2³³ with offset
  < 2²⁰" — **off-by-one**: at `id = 2³³` exactly, `offset = 5`, the key is `2⁵³+5`
  which is NOT float64-exact (mantissa gap = 2).
- `packrat.ts:64-66` claims `& MEMO_MAX_OFFSET` "would re-truncate to int32 on a large
  key" — **wrong** (the chosen `%` is fine, but the justification is false; a 200k-id
  live probe found `&` NEVER disagrees with `%` for valid offsets).

**The proposed cure.** EITHER (a) widen the offset budget — float64 affords ~53 bits,
so a larger `MEMO_OFFSET_SPAN` removes the 1MB ceiling for any realistic source; OR
(b) guard+throw on `offset ≥ MEMO_OFFSET_SPAN` (fail-loud instead of silent-alias).
Correct both comments to the verified-true rationale.

**Born-RED gate (`proof:packrat-large-offset`).** RED today: memoize a parser, parse a
source longer than the current `MEMO_OFFSET_SPAN`, assert the high-offset cells do not
alias the low-offset cells (today they do). GREEN when the budget is widened (or the
guard throws). Plant-a-failure: re-narrow the budget to 20 bits → the >1MB clause reds.

---

## PT-Q3 — DELETE `thenMap` + `fuse` (the no-legacy DELETE, zero BC obligation)

**The need, grounded (`B1-parsethat-fusion` + `B5-parsethat-arch`).** parse-that 0.12.0
shipped two zero-consumer speculative fusion seams that contradict its OWN
substrate-deadcode precept:
- `thenMap` (`parser.ts:96-119`, VERIFIED 2026-06-23) — a `then().map(f)` fusion `Parser`
  method (the PT-B3 zero-tuple seam). ZERO callers anywhere (only its own definition +
  `dist/parser.d.ts`); value.js has ZERO `.then().map()` chains (its grammar is all
  `all`/`any`/`dispatch`/`map`). The fused seam optimizes a shape no consumer writes.
- `fuse` (`leaf.ts:351-362`, VERIFIED 2026-06-23 — declared at `:352`) — strictly worse:
  ZERO consumers AND NOT in the barrel (absent from `index.ts:9` + `core.ts`, VERIFIED), so
  no consumer can even import it. It is byte-identical to `all()` (same `fuseAll` core).

**Why this is a clean DELETE with no BC obligation.** A never-importable export
(`fuse` is not barrel-reachable) is not part of the public contract — deleting it
breaks nothing. `thenMap` IS barrel-reachable, but it was born THIS-prior-tranche
(0.12.0) with zero consumers; deleting it in the next minor is honoring the
substrate-deadcode precept (`03-substrate-deadcode.md`: "public surface with zero
workspace consumers → DELETE"), not a BC break against an established surface.

**The registry-safety pre-empt (the FRICTION).** Deleting an export born 0.12.0 *could*
break a downstream that imported it between the 0.12.0 publish and Q — a silent BC break.
PRE-EMPT: gate PT-Q3 on a registry/usage check (the npm dependents + the constellation
tree) confirming zero external consumers BEFORE the delete; if a consumer is found,
PT-Q3 pivots `thenMap` to a `@deprecated`-then-remove-in-a-major plan (the PT-Q4 shape).

**Born-RED gate (`proof:no-dead-combinator`).** RED today: a grep over the parse-that
surface for any export with zero in-realm consumers matches `thenMap`/`fuse`. GREEN when
both are deleted. A vacuity-guard clause (the gate must itself match ≥1 known-live
export to prove the grep works) prevents a false-green.

---

## PT-Q4 — the `*Span` surface decision (adopt-or-deprecate, terminal-or-KILL)

**The need, grounded (`B1-parsethat-fusion`; anchors VERIFIED against the parse-that
`typescript/src/parse/` tree 2026-06-23).** The 15 `*Span` builders (`span.ts:16-547` —
`stringSpan` at `:16` → `lookAheadSpan` at `:521` in a 547-line file; the earlier `16-360`
anchor was a TRUNCATION that excluded `takeUntilAnySpan`/`negateSpan`/`peekSpan`/`notSpan`/
`minusSpan`/`lookAheadSpan`):
`stringSpan`/`regexSpan`/`manySpan`/`sepBySpan`/`wrapSpan`/`optSpan`/`skipSpan`/`nextSpan`/
`altSpan`/`takeUntilAnySpan`/`negateSpan`/`peekSpan`/`notSpan`/`minusSpan`/`lookAheadSpan`)
have ZERO consumers constellation-wide (VERIFIED — no `*Span` import in parse-that/value.js/kf
src), are barrel-exported at `index.ts:10` (VERIFIED), yet are pinned by `dist-surface.test.ts:52`
(VERIFIED) + `proof-span-parser-killed.mjs` (VERIFIED present) as "canonical public API." Keeping a 15-function
zero-consumer published surface directly contradicts parse-that's own substrate-deadcode
audit precept — a NO-LEGACY tension Q must resolve (not perpetuate).

**The proposed resolution (terminal-or-KILL — parse-that's session chooses an arm).**
- **Arm (a) — ADOPT.** Wire ONE value.js hot leaf — the generic ident/number-run scan
  (the megamorphic `c`-bucket leaf, or the generic identifier) — onto `takeUntilAnySpan`
  or `regexSpan`, harvesting the zero-alloc Span path on a real seam. This makes ≥1 of
  the 15 a genuinely-consumed surface (and the gate retargets to assert the consume).
  This arm partners a value.js consume edge (see the INFORM section).
- **Arm (b) — DEPRECATE-then-remove.** `@deprecated`-tag all 15 in 0.13.0 with a
  removal-version note (the next major), scheduling the delete. This is the no-legacy
  outcome when no clean value.js Span seam exists — a RECORDED plan, not a forever-keep.

**Why NOT delete-in-0.13.0 (the friction the ledger already recorded).** The P-era
"PT-B2 delete-them" overreached: the 15 were KEPT to honor the 0.12.0 BC-additive
promise, and deleting a barrel surface born one minor ago, in the very next minor, is a
semver lie against any consumer who took the additive promise at face value. PT-Q4's
deprecate-then-remove (arm b) is the BC-honest no-legacy path; arm (a) consume is the
no-legacy path when a real seam exists.

**Born-RED gate (`proof:span-surface-resolved`).** RED today: neither (a) a value.js/kf
source consumes a `*Span` builder, NOR (b) the 15 carry `@deprecated` + a removal-version
note. GREEN on either arm. Plant-a-failure: revert the consume (arm a) OR strip the
`@deprecated` tags (arm b) → the gate reds.

---

## PT-Q5 — the `dispatch` subTable consume-or-retract (the consumer-anchored perf gate)

**The need, grounded (`B5-parsethat-arch` headline gap; anchors VERIFIED 2026-06-23).**
`dispatch()`'s 2nd-byte subTable widening (`leaf.ts:103-215`, VERIFIED — `dispatch<T>(table,
subTable?)` with the `subByFirst` sub-LUT) is BUILT + gated (`proof-perf.mjs` clause B over a
SYNTHETIC `ca/cl/cu` corpus the gate itself constructs) but has ZERO real consumers.
value.js's ONLY `dispatch()` calls pass NO subTable (`parsing/index.ts:425` `dispatch({…})`
15 buckets; `color.ts:732` `dispatch(dispatchTable)` — both single-arg, VERIFIED) — so the
`c`-bucket (calc/clamp/cos/conic/cubic) is still a multi-deep
`any()`, the exact megamorphism the subTable was built to flatten. A gate that proves a
transposition on a corpus no consumer runs is a green that misses the application.

**The proposed resolution (consume-or-retract — terminal-or-KILL).**
- **CONSUME:** value.js wires the subTable into its `dispatch({...})` call to flatten
  the `c`/`r`/`s` function-name buckets (the multi-token first-char collisions). This
  partners a value.js consume edge (INFORM); `proof:perf` is RE-ANCHORED to assert the
  win over value.js's ACTUAL `c`-bucket grammar fixture, not the synthetic corpus.
- **RETRACT:** if the on-path win comes back < the floor (the FRICTION the lane named:
  "if Q-VJ1's ≥40% on-path clause comes back NEGATIVE"), the wave PIVOTS from consume
  to RETRACT — revert `leaf.ts:103-215` as a no-consumer perf seam (a different change
  shape, pre-empted by specifying BOTH NOW).

**The consumer-anchored gate (the contrivance-recheck terminal).** Re-scope
`proof-perf.mjs` clause B from the synthetic `ca/cl/cu` corpus to clause B' over
value.js's real `c`-bucket grammar shape (imported as a fixture). This closes the
"green-on-a-corpus-no-consumer-runs" contrivance — the win is asserted on the
application path or the seam is retracted.

**Born-RED gate (`proof:perf` clause B', born-RED).** RED today: clause B' (the
on-path measurement) does not exist; the gate measures only the synthetic corpus. GREEN
when the subTable is consumed on value.js's `c`-bucket AND the on-path bench asserts the
win (≥ the measured floor). If the consume yields no win → RETRACT, and the gate asserts
the seam is gone. Plant-a-failure: revert the value.js consume → clause B' reds (or, on
RETRACT, re-adding the unused subTable reds the no-dead-perf-seam clause).

---

## INFORM (what parse-that Q must know — the DAG, the value.js consume partner, the version)

1. **The DAG — parse-that Q sequences BEFORE value.js Q sequences BEFORE keyframes Q.**

   ```
   parse-that Q (0.13.0)  ─►  value.js Q (1.1.1 / 1.2.0)  ─►  keyframes Q (5.0.0 / 5.1.x)
   (re-entrancy + key fix;       (consumes subTable/Span        (inherits a sound, faster
    delete thenMap/fuse;          IF parse-that arm-(a)/CONSUME;  parser transitively)
    *Span + subTable decision)    re-pins ^0.13.0 transitively)
   ```

   PT-Q1/PT-Q2 (the correctness fixes) ship FIRST — they have no external sibling gate
   and unblock value.js's input-safe re-parse immediately. PT-Q3 (the delete) is
   independent. PT-Q4-(a)/PT-Q5-CONSUME REQUIRE a value.js consume edge — they are the
   cross-repo legs; value.js's Q session wires the consume and re-anchors `proof:perf`.

2. **The value.js consume partner (PT-Q4-a + PT-Q5-CONSUME).** If parse-that chooses to
   ADOPT the `*Span` surface (arm a) and/or CONSUME the subTable (PT-Q5), value.js's Q
   session must wire the consume in value.js's tree (`parsing/index.ts` / `color.ts`) —
   this is a value.js wave (dispatched separately via `KF-TO-VALUEJS-Q.md`), NOT a
   parse-that wave. parse-that publishes the surface; value.js consumes it. If value.js
   declines, parse-that falls to the DEPRECATE (arm b) / RETRACT arm — the terminal-or-KILL.

3. **The version — a single 0.13.0 MINOR.**

   | parse-that publish | contents | gates the consumer |
   |---|---|---|
   | **0.13.0** | PT-Q1 re-entrancy fix + PT-Q2 key hardening (internal); PT-Q3 delete `thenMap`/`fuse` (zero-BC); PT-Q4 `*Span` decision (adopt-or-deprecate); PT-Q5 subTable consume-or-retract | value.js re-pins `^0.13.0` (transitive — the re-entrancy fix is the binding consume); kf inherits transitively (NO direct kf parse-that dep — S9 retired it at 495484a) |

   The kf consume is **transitive** — kf removed its direct `@mkbabb/parse-that` dep at
   the M/P S9 retire (`proof:boundary` shows 0 specifiers in `src/animation/**`). kf
   inherits the corrected parser through value.js's re-pin; there is NO kf-side parse-that
   re-pin. The Q.WG1 wave is the dispatch authoring; the consume is value.js's.

4. **The master-merge precondition (B6-crossrepo-versions).** parse-that published
   `v0.12.0` from `tranche-b` (NOT master). Q.WA3 (the kf master-merge-reconcile wave)
   asks all three repos to merge their published tranche tips to master before any new
   cut. parse-that Q's first motion (PT-Q.W0) folds the `tranche-b → master` merge so the
   0.13.0 cut lands on a reconciled master.

---

## The pin/version state at this dispatch

| Package | Published | kf relationship | re-pin on the Q publish |
|---------|-----------|-----------------|--------------------------|
| `@mkbabb/parse-that` | **0.12.0** (VERIFIED — parse-that `package.json` version `0.12.0`, branch `tranche-b`) | **TRANSITIVE only** — kf has ZERO direct `@mkbabb/parse-that` dep (S9 retired it, 495484a; `proof:boundary` = 0 specifiers — VERIFIED: kf `package.json` has no parse-that dep, and `src/animation/` carries 0 import specifiers — the lone `utils.ts:234` hit is a comment recording the removal) | NONE kf-side — value.js re-pins `^0.13.0`; kf inherits through value.js |
| `@mkbabb/value.js` | 1.1.0 (VERIFIED) | kf pins `^1.1.0` (`package.json:221` VERIFIED) | value.js re-pins parse-that `^0.13.0`; kf re-pins value.js `^1.2.0` at Q.WG4 (for the value.js asks, not the parse-that asks) |

---

## Net actions

**parse-that Tranche Q (the sibling — to author in parse-that's tree, never from kf):**
1. **PT-Q.W0 (FIRST):** reconcile the B record to CLOSED-as-built; merge `tranche-b → master`.
2. **0.13.0 — the correctness fixes (land FIRST, no external gate):**
   - **PT-Q1** — move the packrat src-epoch reset to the parseState ENTRY boundary
     (Form A favored) + the try/finally unwind hardening (re-entrancy SOUND).
   - **PT-Q2** — widen the >1MB offset-budget (or guard+throw) + correct the two comments.
3. **0.13.0 — the no-legacy + decisions:**
   - **PT-Q3** — DELETE `thenMap` + `fuse` (zero-consumer dead API; registry-checked).
   - **PT-Q4** — resolve the `*Span` surface: ADOPT (value.js consume) OR DEPRECATE-then-remove.
   - **PT-Q5** — resolve the subTable: CONSUME (value.js wires it + `proof:perf` re-anchored
     to the real corpus) OR RETRACT.

**keyframes.js (the transitive inheritance — NO direct consume):**
1. kf writes ZERO parse-that source and carries ZERO direct parse-that dep. The Q.WG1
   wave is the dispatch authoring (this file). kf inherits the corrected, re-entrancy-sound,
   key-hardened parser transitively through value.js's `^0.13.0` re-pin.

**The contract.** parse-that publishes the corrected surface; value.js consumes it
(re-pin + the optional subTable/Span wire); kf inherits transitively. Neither writes the
other's tree (inv-16). The gate roster — `proof:packrat-reentrant` + `proof:packrat-large-offset`
(the correctness fixes) + `proof:no-dead-combinator` (the delete) + `proof:span-surface-resolved`
(the `*Span` decision) + `proof:perf` clause B' (the consumer-anchored subTable gate) — is
the binding cross-repo oracle.

---

## dev→impl boundary

This file is the Tranche Q DEVELOPMENT dispatch packet — **DOCS ONLY** (inv-16: kf writes
only keyframes.js; every cross-repo need is a *dispatch*, never a foreign-tree edit).
parse-that's Q session implements the ASKs in parse-that's own tree; value.js consumes
the corrected surface; kf inherits transitively. Every ASK carries a **falsifiable
born-RED gate** (the correctness asks: a live re-entrancy/aliasing probe over the built
barrel, RED today, GREEN on the fix; the delete: a zero-consumer grep, RED today; the
decisions: a consume-or-record assertion with a terminal-or-KILL). Implementation opens
only on the owner's explicit go, per-repo, DAG-ordered (parse-that Q → value.js Q →
keyframes Q). The two SHIPPED DEFECTS (PT-Q1/PT-Q2) are the lead — a real public-API
correctness regression the impl drive left. observable-truth, no-legacy, no-deferral
(every ask terminal-or-KILL), gestalt throughout.
