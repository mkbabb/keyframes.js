# Skeptic A — r2 (TRUE-FABLE re-deployment) — draft-grounding, value.js/parser/color axis

## G0-prime tree pins (every tree read)

| Repo | Path | Branch | HEAD |
|---|---|---|---|
| keyframes.js (canonical) | /Users/mkbabb/Programming/keyframes-v-exec | master | `0dac636b` |
| value.js | /Users/mkbabb/Programming/value.js | tranche-u | `db77dbd8` (dirty: scripts/dev/dev.sh + untracked docs only) |
| parse-that | /Users/mkbabb/Programming/parse-that | master | `ef10d5b` |
| bbnf-lang | /Users/mkbabb/Programming/bbnf-lang | master | `b3cf48e3b` |
| glass-ui (peer check only) | /Users/mkbabb/Programming/glass-ui | master | `1b20f7d0` (v7.0.0) |

Not read: /Users/mkbabb/Programming/keyframes.js (dirty trap), /Users/mkbabb/Programming/atlas (stale trap), value.js `docs/tranches/V/coordination/keyframes-inbox-2026-07-18-vnext-*` (final-product mirrors — contamination ban honored).

---

## PHASE 1 — ANEW (written before opening the prior report)

### Core question 1 — what IS the extant value.js CSS parser, file-by-file

The `/css` capability at HEAD is **4 parser-bearing files, 1,614 lines total, zero runtime
dependencies** — a hand-rolled hybrid: character-scanning depth-tracked splitters for structure +
**regex classification for every leaf token**. No combinators, no parse-that, no tokenizer, no AST
arena, no byte-scanner dispatch.

- `src/css/grammar.ts` (483L) — the value/color/timing grammar. Structure: `splitTopLevel`
  (grammar.ts:63–87) and `splitValueTokens` (grammar.ts:89–126) — per-char loops tracking
  paren depth + quotes; whitespace tested with `/\s/.test(char)` **per character**
  (grammar.ts:77,80,115). Leaves: regex — `numberToken` (129), `channelToken` angle regex (141),
  hex `input.match(/^#([\da-f]{3,4}|…)$/i)` (267), function-call `input.match(/^([a-z][\w-]*)\((.*)\)$/is)`
  (279, 370), scalar/keyword regexes (318–330), keyframe-selector regexes (411, 418),
  `cubic-bezier`/`steps`/`linear()` regexes (444, 453, 466). 24 regex-operation sites in this file
  alone (grep count; stylesheet.ts adds 10, timeline.ts 7, syntax.ts 1).
- `src/css/stylesheet.ts` (899L) — at-rule/keyframes/animation-option/timeline collectors
  (`collectAnimationOptions` at stylesheet.ts:827), same split+regex idiom.
- `src/css/syntax.ts` (101L), `src/css/timeline.ts` (124L) — `@property` syntax descriptors,
  timeline grammar (post-cut seam splits of the stylesheet god-module, commit `6aca8602`).
- Every successful parse is **`deepFreeze`d recursively** (grammar.ts:33–44) — an
  allocation-and-walk cost on the hot path that no zero-alloc story tolerates.

So: the owner's "custom, non-parse-that implementation" is TRUE at HEAD, and addendum-2's
"regex rewrite" label is materially accurate (regex classifies every token; only the bracket/quote
structure walk is scanner-style).

### Core question 2 — when did this parser arrive, and what did it replace

**The current parser is ~1 day older than the owner's prompt.** It arrived at the Value-4 cut:

- Release line: `7334c793` (2026-07-16) "feat(package-v4): cut the exact-seven immutable
  capability surface" introduced `src/v4/css/grammar.ts` (658L); tag `v4.0.0` = `44ddaff7`
  (2026-07-16). The v4 cut commit on the working branch, `164343c1` (2026-07-17)
  "feat(v4)!: value 4.0 producer surface + packed-surface gate; retire pre-v4 src trees",
  is **not** an ancestor of the v4.0.0 tag (verified `git merge-base --is-ancestor` → NOT) —
  same cut, restated on `tranche-u`; then `f024d385` dissolved `v4/` to bare dirs and
  `6aca8602` split the seams (both 2026-07-17). `git log --follow src/css/grammar.ts` bottoms
  out at these three 2026-07-17 commits — there is no deeper history.
- It replaced a **parse-that combinator parser**. `git show 164343c1^:src/parsing/index.ts`
  line 1: `import { Parser, all, any, dispatch, regex, string, whitespace } from "@mkbabb/parse-that"`.
  The retired tree: `src/parsing/` (index 644L, math 536L, stylesheet/ 1,380L, timeline/ 1,025L,
  color/ 1,020L, syntax 219L, utils 603L, units 154L, animation-shorthand 208L) — ~5,800 lines,
  deleted in `164343c1` (whole-commit stats: 129 files, +4,117/−24,330).
- Dependency truth by tag (`git show <tag>:package.json`): parse-that was a runtime dep at
  **every** value.js release from v1.0.0 (`^0.11.0`) → v1.1.0 (`^0.12.0`) → v1.2.0/v2.0.0
  (`^0.13.0`) → v2.0.1/v3.0.0/v3.1.0 (`^1.0.0`) → **v4.0.0: no dependencies at all**.
  parse-that itself was vendored before `e7537c16` (2026-02-25, "use @mkbabb/parse-that from
  npm, drop vendored tarball") — value.js was parse-that-based for its entire pre-4.0 npm life.
- Cleanup record: V archive `docs/tranches/V/archive/ADDENDA.md` V-A99 — after the cut, 63
  source files still implemented the retired parser graph and **8 still imported the removed
  `@mkbabb/parse-that`**; disposition: "Delete the unreachable Value 3 implementation … instead
  of restoring `parse-that`".

Answer to the owner's "in what tranche": **value.js V′ (the reformation), at the 4.0.0
capability cut, 2026-07-16/17** — not the constellation, not S, not any June tranche.

### Core question 3 — was the predecessor measured; is the successor?

The **predecessor (parse-that-era) parser was measured, gate-protected, and perf-tuned**:

- `bench/css-parse-perf.mjs` (119L, deleted at `164343c1`): "O.W6 — CSS-parse throughput
  bench (MEASURE-FIRST)" — MB/s over a 10-string value corpus + stylesheet corpus + gamutMap
  ns/call; wired into `scripts/gates/proof-perf-target.mjs` (192L regression gate, also deleted).
- `docs/tranches/O/waves/O.W6.md:77–112` — the MEASURE-FIRST discipline: baseline first, target
  = baseline + 20% headroom, wall-clock/bytes → MB/s.
- `9aedfc50` (2026-06-19) "perf(O.W6): SOTA hot-path rewrites — byte-loop scanners + first-char
  dispatch" — the "byte-scanners + dispatch()" perf work lived **inside** the parse-that-era
  parser (custom leaf scanners feeding combinators), and was measured.
- Plus deleted benches: `parser-namelookup.mjs`, `color-alloc-hotpath.mjs`,
  `color2-direct-paths.mjs`, `gamut-boundary.mjs`, etc.

The **successor (extant) parser has never been benched**: no `bench/` dir exists at HEAD; the
entire bench corpus + all perf gates died in the same commit that introduced it. Symmetrically:
the owner's "slow" verdict on the extant parser is also **unmeasured in-repo** — plausible
(per-token regex, recursive split-and-reparse, deepFreeze-per-success), but no number exists on
either side. Any V-next parser adjudication must start by rebuilding the baseline the v4 cut
deleted.

### Core question 4 — what is "tape", really

- **Tape is a bbnf-lang Rust substrate, not a parse-that TS lever.** bbnf-lang:
  `3a37c29d8`/`c2a48fcbb`/`6dad81fb9` (2026-05-30, sk-v17) — "route CSS L4 Track-1 into the
  existing skinny tape", "tape-typed measurement bin", "rebuild lazy RICH typed-CSSOM
  projection from the tape"; `crates/core/tests/tape_substrate.rs` exists at HEAD.
- parse-that **removed** tape from its Rust workspace: `2b0596a` (2026-04-30) "refresh parser
  workspace lock after tape removal". Its only tape mention is aspirational:
  `docs/future-research.md:187–189` (a hypothetical `json_parser_tape()`).
- parse-that's TypeScript implementation (`typescript/src/parse/`, 14 files, 2,547L, v1.0.0)
  contains **zero occurrences of "tape"** (grep: NO-TAPE-IN-TS-SRC). What parse-that TS 1.0.0
  actually has: a **mutable `ParserState`** with in-place `ok()`/offset mutation and zero-copy
  `Span{start,end}` offsets (typescript/src/parse/state.ts:8–60) — i.e., the
  "mutable-ParserState" lever is already the shipped design, and "tape adoption for the
  TypeScript implementation" is **future work that would port a bbnf-lang Rust concept**, not an
  existing parse-that feature the tranche can "adopt".
- Related archaeology: the SpanParser experiment — parse-that A.W3
  (`docs/tranches/A/PROGRESS.md:15,41`): tagged-union SpanParser measured **~10–14% slower on
  V8/TS** → FALSIFIED, retired from the public surface (2026-06-19/22); `*Span` combinators
  deprecated at 0.13.0 (`2c806fb`) and excised at 1.0.0 (`043c4d1`, S.H2). This falsification is
  **parse-that-internal** (combinator Parser vs SpanParser variant). It never compared
  parse-that against value's custom parser, and cannot ground the v4 rewrite as "measured".

### Core question 5 — color/gamut/zero-alloc at HEAD vs shipped history

At HEAD (`src/color/`: model 142L, anchors 377L, operations 331L, index 41L):

- 17 model spaces incl. `hsv`/`kelvin`/`ictcp`/`jzazbz` (model.ts:5–7) — but `/css` **rejects**
  those spellings (grammar.ts:263); only the 13 CSS-native spaces parse.
- Gamut mapping EXISTS: `mapColorToGamut` (operations.ts:133–176) — OKLCh chroma bisection,
  fixed 32 iterations, hue+lightness held. It is NOT the CSS Color 4 algorithm: **no deltaEOK
  ≤ JND stopping criterion** (no deltaE of any kind survives at HEAD — grep zero), no
  clipped-candidate comparison, no raytrace.
- `mixColors` (operations.ts:83–123) allocates per call (Result + channels array); `toRgba8`
  (operations.ts:314) likewise. **No `Into` variant of anything exists at HEAD.**

Shipped history, deleted at the v4 cut (`164343c1` stats):

- `src/units/color/gamut/`: boundary.ts 604L, gamut.ts 526L, okhsl.ts 270L, **raytrace.ts 137L**
  — the raytrace exact-boundary reference landed S.W1-10 (`60bb64e9`, 2026-07-05); the
  double-algorithm gamut apparatus is the "double-gamut" loss the owner names.
- `sampleGamutBoundary/Into + goldens + bench` (`07760131`, R.W1.5, 2026-07-03).
- The zero-alloc Into family: `color2Into` currency across all spaces (3.x, per CHANGELOG 3.1.0
  rows), `mixColorsInto`/`toRgba8Into` (WL row: "did NOT survive to 4.0.0" —
  docs/tranches/V/reformation/waves/WL.md:47).
- `difference.ts` 243L (deltaE), `contrast.ts` 332L (HEAD keeps a minimal WCAG contrast at
  operations.ts:195+), `colorFilter.ts` 305L, `dispatch.ts` 558L, `mix.ts` 479L,
  `interpolate.ts` 284L, kelvin/ictcp/jzazbz **parse/serialize** (shipped 3.1.0, 2026-07-05 —
  dropped 11 days later at 4.0.0), `quantize/cluster.ts` 356L (HEAD quantize.ts = 139L).

### Core question 6 — SCI-1 decision state in value's own docs

**SCI-1 is DECIDED, not pending.** `docs/tranches/V/DECISIONS.md:82` (D54, 2026-07-17): "SCI-1:
**SHIP-4.1.x** — the sole ship (real measured consumer ~3,243 marks/frame; into-variants
mirroring the blessed `lerpArray` out-buffer idiom; un-dated, execution-gated, evidence tuple
owed at the cut — feeds W56's version choice)". Vehicle assigned:
`reformation/CARRY-LEDGER.md:30` (W56 = the 4.1.x `mixColorsInto`/`toRgba8Into` cut). The
restore-vs-bless fork the draft describes was closed on the side of SHIP. Only execution
(the 4.1.x cut itself) is outstanding.

### Draft row verdicts (value/parser/color-touching rows only)

- **G1 — WRONG on the decisive archaeology.** Three conflations:
  1. "the parse-that dependency was REMOVED from value.js at the constellation impl drive
     ('S9 parse-that dep removed', parse-that 0.12.0 era)" — **REFUTED**. S9 removed parse-that
     from **keyframes.js** (kf `495484aa`, 2026-06-23: `-"@mkbabb/parse-that": "^0.11.0"` from
     kf package.json, consuming value.js 1.1.0). value.js 1.1.0 itself depended on parse-that
     `^0.12.0` and stayed parse-that-based through 3.1.0. The value-side removal is the v4 cut,
     2026-07-16/17.
  2. "The custom parser was a MEASURED decision" — **REFUTED** as stated. The measured
     decisions on record are (a) parse-that-internal SpanParser falsification (A.W3) and
     (b) O.W6 byte-scanner tuning **inside** the parse-that-era value parser. The v4
     custom-parser rewrite itself carries **no recorded old-vs-new benchmark**, and deleted the
     entire bench corpus + `proof-perf-target` gate in its own commit. No doc row adjudicates
     "drop parse-that for a hand-rolled parser" on numbers.
  3. "the prompt's presumption that parse-that adoption is an uplift was previously TESTED AND
     REFUTED on V8" — **REFUTED/miscast**: what was falsified was SpanParser vs the classic
     combinator Parser *within* parse-that (~10–14% on V8). parse-that-vs-custom for value.js
     grammar was never tested. G1's bottom line ("re-adjudication under new evidence,
     bench-gated") survives, but for the opposite reason it gives: the extant parser is a
     day-old unmeasured rewrite, not a measured incumbent.
- **G2 — CONFIRMED.** ParseIssue is a closed 8-code union incl. `keyframe_selector_invalid`,
  `animation_option_invalid`, `timeline_option_invalid` (src/css/types.ts:10–24);
  `collectAnimationOptions` at stylesheet.ts:827, exported css/index.ts:52;
  `parseTimingFunction` on /css (grammar.ts:436, subpaths/css.ts). kf consumes them
  (kf demo/components/instrument/keyframes/utils/parseAnimationCSS.ts;
  src/animation/ingest/cssom.ts et al.).
- **G3 (value part) — CONFIRMED.** glass-ui@7.0.0 peers `@mkbabb/value.js: ^4.0.0` AND
  `@mkbabb/keyframes.js: ^6.0.0` (glass-ui package.json @ `1b20f7d0`); kf pins value EXACTLY
  `4.0.0` (keyframes-v-exec package.json @ `0dac636b`).
- **G6 — STALE/AMENDED.** The mixColors/parseCSSValue "historically fragile" gloss stands, but
  "SCI-1 … a PENDING execution-gated ruling" is wrong as of D54 (2026-07-17): the RULING is
  made (SHIP-4.1.x); only execution is gated. Consequence for R6: "fold the pending SCI-1
  ruling in here rather than leaving it orphaned in WL" would **double-book a decided ship that
  already has a vehicle** (W56/4.1.x, CARRY-LEDGER:30). R6 must be reworded to *sequence
  against* the 4.1.x cut, not re-adjudicate it.
- **G7 — CONFIRMED.** 7 subpath export keys, no `.` root (package.json exports); the
  `src/subpaths/*.ts` files are pure re-export barrels (subpaths/css.ts is type+symbol
  re-exports only) — export-map homes, not runtime shims; 62 public types is consistent with
  `fixtures/public-types/value-v4.ts` (the packed-surface fixture).
- **R2 — DIRECTION CONFIRMED, PREMISE INVERTED.** A born-RED bench baseline is right, but the
  spec must say: the extant parser is the UNMEASURED party (baseline must be rebuilt from
  scratch — the v4 cut deleted every bench); "the archaeology (D7 falsification, S9 removal)"
  as written would feed the fleet the same two mis-attributions G1 makes. Cite instead: A.W3
  SpanParser falsification (parse-that-internal), O.W6 MEASURE-FIRST corpus (deleted —
  resurrect from `164343c1^:bench/css-parse-perf.mjs`), and the v4 cut's unmeasured rewrite.
- **R5 — CONFIRMED** (census boundary is real: kf `src/animation/scroll/grammar.ts` exists;
  value ARCHITECTURE.md:655 records `extractNamedTimelines` deliberately transposed to that kf
  file as the sole owner).
- **R6 — AMEND** per G6 above; also note: the deltaEOK ≤ JND anchor requires **restoring
  deltaE**, which the v4 cut deleted entirely (no deltaE function at HEAD).
- **R7 — CONFIRMED** (defect-family register; the calc/computed + convert2/color2 fragility is
  kf-memory-recorded; the v4 cut then deleted the color2 pipeline wholesale).
- **R13 — CONFIRMED** ("the FILES can restructure freely, never the KEYS" matches the
  subpaths-as-barrels truth; NO-SHIMS applies to runtime indirection, which these are not).

### Missed material findings (absent from the draft)

- **M1. The one-day-old parser.** The draft nowhere states the single most consequential
  grounding fact: the "extant" custom parser predates the owner's prompt by ~1 day
  (v4.0.0 2026-07-16; prompt 2026-07-18). Every "why was this done" answer routes to the v4
  cut, not to June archaeology. The owner is being asked to re-adjudicate a decision his own
  reformation tranche made last week without a bench.
- **M2. The bench-corpus deletion is itself an UNJUSTLY-DROPPED candidate.** Addendum-2's
  drops lane should carry a row for `bench/*` + `scripts/gates/proof-perf-target.mjs`: the
  measurement apparatus (MEASURE-FIRST law, O.W6) died with the thing it measured. Any perf
  claim either way is currently unfalsifiable in-repo.
- **M3. deepFreeze-per-parse** (grammar.ts:33–44) — every successful parse deep-freezes the
  result tree; combined with per-char `/\s/` regex tests and recursive split→re-parse, these
  are concrete, citable uplift targets for the parser wave regardless of the
  parse-that-vs-custom verdict.
- **M4. The 3.1.0 HDR parse surface was dropped at 4.0.0.** `ictcp(…)`/`jzazbz(…)` parsing +
  serialization shipped 2026-07-05 (CHANGELOG 3.1.0) and was dropped 11 days later (grammar.ts:263
  rejects those spellings; deliberate CSS-native-only law, ARCHITECTURE.md:108). A drops-ledger
  row is owed: RIGHTLY (spec-honest: not CSS) or UNJUSTLY (owner wants SOTA-beyond-spec color).
- **M5. calc()/math evaluation vanished from value.** Pre-v4 `src/parsing/math.ts` (536L)
  parsed AND evaluated the full CSS math function set (`evaluateMathFunction`); v4 parses
  `calc()` only as a generic `kind:"call"` node (grammar.ts:370–388) and evaluates nothing
  (grep: no evaluate/calc logic in css/*). The V-next "total spec coverage" wave must decide
  where math evaluation lives; today it lives nowhere in value.
- **M6. A prior tranche already retired a new-parser-substrate proposal.**
  `docs/tranches/V/archive/DISPOSITION-LEDGER.md:173`: dormant S.H3 Pratt proposal —
  "**RETIRE**; the absent parse-that consumer and tiny calc duplication do not justify a new
  parser substrate." The V-next prompt effectively re-opens a retired disposition; the wave
  spec should name and supersede it explicitly (refutation-amends-charter), not silently
  re-litigate.
- **M7. parse-that 1.0.0 was cut FOR value.js days before value dropped it.** parse-that
  `7eab78c` (S.H4, 2026-07-03) cut 1.0.0; value 2.0.1 (2026-07-04) executed the booked
  `^1.0.0` re-pin (CHANGELOG:175–184); the v4 cut then severed the edge 12 days later. The
  constellation's "ONE external SPINE" investment was stranded almost immediately — context the
  parser re-adjudication wave should carry when pricing another whiplash.
- **M8. parse-that still has an open ask-letter TO value:** `ef10d5b` (2026-07-05,
  VALUEJS-PT-E: per-parse diagnostics HIGH, inference MED, Pratt-dormant record) — standing
  coordination surface the R8 "ingest the standing letters" row should enumerate (it names WL/
  RF letters but not parse-that's PT-E).

---

## PHASE 2 — UNION (prior Opus report tested against the above)

Prior report read AFTER Phase 1 was fixed on disk: `skeptic-A-report.md`. Every material
finding presumed incorrect and tested. Verdicts:

### UNION-CONFIRMED (in the Opus report AND independently re-derived — survive on MY evidence)

- **U1. Extant parser is regex/char-split, not byte-scanner; the O.W6 measured pedigree
  attaches to the retired `src/parsing/` tree.** My re-derivation: Phase-1 Q1/Q3;
  additionally verified their probes — `charCodeAt` = 0 hits across all seven `src/css/*.ts`;
  24 regex-op sites in grammar.ts. The extant parser is unmeasured; no parser bench exists at
  HEAD; the R2 baseline is greenfield, not an extension.
- **U2. SpanParser V8 falsification is real and parse-that-INTERNAL.** My cites:
  parse-that `docs/tranches/A/PROGRESS.md:15,41` (~10–14% slower on V8/TS, retired), `*Span`
  deprecated 0.13.0 (`2c806fb`), excised 1.0.0 (`043c4d1`). It rules out a SpanParser variant,
  not the regex incumbent, and never tested parse-that-vs-custom.
- **U3. parse-that TS contains no tape.** My grep: NO-TAPE-IN-TS-SRC over
  `typescript/src/parse/` (14 files, 2,547L).
- **U4. S9 removed parse-that from KEYFRAMES, not value.js.** My proof is stronger than
  theirs: kf `495484aa` package.json diff literally deletes `"@mkbabb/parse-that": "^0.11.0"`.
- **U5. SCI-1 is DECIDED SHIP-4.1.x (D54), vehicle W56 — inherit, don't re-adjudicate.**
  My cites: DECISIONS.md:82, CARRY-LEDGER.md:30, WL.md:47. Draft G6/R6 must be amended
  (double-booking risk).
- **U6. The v4 cut is a live capability REGRESSION: the zero-alloc Into family
  (color2Into/mixColorsInto/sampleGamutBoundaryInto) and the S/R-era gamut apparatus
  (raytrace/boundary/okhsl) were shipped, then dropped at `164343c1`.** My cites: commit stats
  (gamut/ 1,537L deleted), `60bb64e9` (S.W1-10 raytrace), `07760131` (R.W1.5
  sampleGamutBoundary/Into + goldens + bench), zero `Into` symbols at HEAD. The missing
  invariant = no capability-preservation gate on major rewrites. "Restore" in SCI-1 is literal.
- **U7. `mapColorToGamut` is NOT CSS Color 4 §13.2 MINDE.** My read of operations.ts:133–176:
  pure chroma bisection (32 fixed iters), no deltaEOK (no deltaE of ANY kind at HEAD), no
  clip-comparison, no L-endpoint short-circuit (only a clamp at :156). No WPT/conformance
  vectors anywhere in src/test (grep = 0). R6's gate infrastructure is NEW, and R6 must decide
  §13.2-adoption vs ratified-deviation explicitly.
- **U8. `safeAccentColor` is the uncovered heavyweight.** Verified structurally:
  `evaluate` (operations.ts:240) called at :249/:253/:255 plus two 32-iteration bisections
  (:266–268, :283–285) — up to ~67 calls, each running `mapColorToGamut`'s 32-iter
  convert/makeColor loop ⇒ ~10³–10⁴ allocations per call. SCI-1's two into-variants do not
  touch this path; the zero-alloc wave needs `mapColorToGamutInto`/`safeAccentColorInto`-class
  targets named.
- **U9. R5's two draft-named census rows are FALSE POSITIVES; the live kf-side residual is
  `src/animation/easing.ts`.** Verified: `scroll/grammar.ts` header — "each a thin
  pass-through to value.js … typed `CSSTimelineOptions` extractor + inverse serializer" (zero
  productions); `compile/selector.ts:3` imports value's `parseKeyframeSelector`;
  `validate.ts:47` imports `collectKeyframes, parseStylesheet`. easing.ts:30
  (`CSS_NATIVE_KEYWORD`) + :38–39 (`CSS_FUNCTION_EASING`) re-encode value's timing-function
  name table as regex. **My amendment the Opus row lacks:** the duplication is
  documented-deliberate — the file states "Pure string logic — value.js-free" under kf's
  light-engine/static-boundary law (`proof:boundary`), so the census row must adjudicate
  AGAINST that law (consume `parseTimingFunction` and pay the heavy edge, or ratify the
  duplication with the boundary law as rationale), not treat it as silent drift. It is also a
  kf-side regex-parsing site for the addendum-2 regex census.
- **U10. `parseFunctionalColor` (grammar.ts:175–255) is the readability defect, and it is
  table-solvable WITHOUT parse-that** — keep readability and parser-substrate as independent
  axes so adoption cannot ride in on the readability complaint. Verified by direct read (the
  8-branch `lower === "x" && components.length === 3` copy-chain).
- **U11. The mixColors/parseCSSValue ad-hoc history commits are real.** Verified all four:
  `329932b8` (U-F29 parseCSSValues loud-fail rename), `0c212e8d` (U-F30 color-mix
  serialization), `d82c63cd`, `184a9ec9` (D3 diagnostics passes) — all 2026-07-13, i.e.
  patched on the PRE-v4 tree three days before it was deleted; R7's family register should
  note the patches themselves died with the tree.
- **U12. value.js HEAD carries `@mkbabb/glass-ui ^7.0.0` + `@mkbabb/keyframes.js ^6.0.0` as
  RUNTIME `dependencies`.** Verified at `db77dbd8`. **My sharpening beyond the Opus flag:**
  deps were EMPTY at the published v4.0.0 tag; W44 (`f2c8f565`) added them on `tranche-u` for
  the demo. If the SCI-1/W56 **4.1.x cut publishes from this branch unpruned, npm gets a
  value↔keyframes dependency CYCLE** (kf pins value 4.0.0 exact). This needs a named
  pre-publish gate row in the V-next tranche, not just a "smell" note.
- **U13. The parse-that TS mutable-ParserState design is real — but it is SHIPPED, not a
  lever.** Their cite checks out (`docs/perf-optimization-ts.md` §3, commit `c1d7ea5`
  "perf(ts): mutable ParserState, zero-alloc combinators", 746→~2,500 ops/s), and
  `typescript/src/parse/state.ts:36–60` at 1.0.0 IS that design (in-place `ok()`, offset
  mutation, zero-copy Spans). Amendment: addendum-2's "parse-that mutable-ParserState
  prototype" gets this for free — it describes the incumbent parse-that architecture, not
  work the tranche must do; the open measurement is parse-that-combinators vs hand-rolled on
  the value grammar corpus, which has never run head-to-head.

### OPUS-REFUTED (tested and wrong — disproofs)

- **X1. "tape is a Rust bbnf-lang runtime that was DELETED as slower … fully dead … cannot
  flip the V8 verdict; closed against the owner's direction." REFUTED on the current state
  of bbnf-lang.** The cited docs are real but STALE: `GESTALT.md` and
  `HARDENING-PLAN-PROMPT.md` (Lock 1 "Tape … fully dead") were both last committed
  **2026-05-03**. Tape was RE-ADOPTED 26 days later: `1c5bd7a25` (2026-05-29,
  "feat(sk-v16-W6-tape): add shared flat-tape runtime substrate"), then sk-v17 (2026-05-30)
  routed CSS L4 into "the existing skinny tape" (`3a37c29d8`) and rebuilt the "lazy RICH
  typed-CSSOM projection from the tape" (`6dad81fb9`). At HEAD `b3cf48e3b`:
  `crates/core/src/runtime/tape/{arena,cursor,mod,record}.rs` exists,
  `crates/core/tests/tape_substrate.rs` imports `bbnf::runtime::tape`, and the newest line
  (sk-v24, 2026-07-16) still names "the current tape-materialization gap against sonic-rs"
  (skinny/README.md:24). What survives of their point: the Era-IV `crates/tape` deletion
  happened, and tape has never existed in parse-that TS (U3). The DISPOSITION flips: tape is
  a LIVE bbnf-lang Rust substrate the owner's premise correctly points at; the honest V-next
  statement is "tape is live Rust-side, absent TS-side; any TS tape adoption is NEW porting
  work, bench-gated" — not "closed against the owner's direction."
- **X2. The report's incumbency framing — O.W6.md's "value.js does not import the parse-that
  CSS parser surface; it only studies the technique," deployed to shrink the S9 conflation to
  "minor," plus calling the retired tree "the measured byte-scanner parser." REFUTED as an
  account of what the v4 cut replaced.** The quote (verified in context, O.W6.md:362–364)
  refers ONLY to parse-that's own `typescript/src/css/` parser (deleted at parse-that A.W1).
  value.js's retired parser was BUILT ON parse-that combinators —
  `164343c1^:src/parsing/index.ts:1` imports `Parser, all, any, dispatch, regex, string,
  whitespace` from `@mkbabb/parse-that` — and parse-that was a runtime dependency at EVERY
  release v1.0.0→v3.1.0 (tag-by-tag package.json). The Opus R2 amendment therefore mis-slots
  "parse-that combinators" as a fresh third candidate when it is the deposed week-old
  incumbent, and never dates the custom parser's arrival. The archaeology in my Phase-1
  Q2/M1 replaces it.

### OPUS-UNVERIFIABLE (excluded from the union product; listed for the record)

- None material. All load-bearing prior-report claims either re-derived (U1–U13) or refuted
  (X1–X2). Two decorative cites I did not chase (future-research.md:202–203 "combinator-tier
  only" phrasing; the exact −14% adversarial re-run row) sit under claims independently
  proven by other evidence and carry no standalone weight.

### FABLE-NEW (mine; absent from the Opus report)

- **N1. The incumbency/arrival fact** (Phase-1 Q2, M1): value.js was parse-that-based for its
  entire npm life (v1.0.0→v3.1.0, tag-verified deps; vendored before `e7537c16` 2026-02-25);
  the custom parser arrived at the v4 cut (`7334c793` release line / `164343c1` working
  branch, 2026-07-16/17) — ~1 day before the owner's prompt. "Why / in what tranche" = the
  value V′ 4.0.0 capability cut. "parse-that adoption" = restoration of the deposed incumbent.
- **N2. The measurement apparatus died with the thing it measured** (Q3, M2): O.W6
  MEASURE-FIRST bench + `proof-perf-target.mjs` regression gate deleted IN the commit that
  shipped the unmeasured successor. Both the draft's "measured decision" AND the owner's
  "slow" are currently unfalsifiable in-repo. Drops-lane row + resurrection recipe:
  `git show 164343c1^:bench/css-parse-perf.mjs`.
- **N3. deepFreeze-per-successful-parse** (grammar.ts:33–44) + per-char `/\s/` regex testing
  (:77,:80,:115) — concrete named hot-path costs for the parser wave (M3).
- **N4. The 3.1.0 HDR parse surface (`ictcp()`/`jzazbz()` parse+serialize, shipped
  2026-07-05) was dropped 11 days later at 4.0.0** (grammar.ts:263; CSS-native-only law,
  ARCHITECTURE.md:108) — an un-ledgered drop row in direct tension with the owner's
  SOTA-color edict (M4).
- **N5. calc()/math EVALUATION vanished from value at v4** (`src/parsing/math.ts` 536L
  `evaluateMathFunction` deleted; v4 parses `calc()` as an opaque `kind:"call"`) — "total
  and complete specification coverage" must first decide where math evaluation lives; today
  it lives nowhere in value (M5).
- **N6. A standing disposition already RETIRED a new-parser-substrate proposal** (S.H3 Pratt,
  DISPOSITION-LEDGER.md:173). The V-next parser wave re-opens it; name-and-supersede
  explicitly or the fleet re-litigates blind (M6).
- **N7. The stranded spine**: parse-that 1.0.0 was cut FOR value (S.H4, 2026-07-03), value
  2.0.1 executed the booked `^1.0.0` re-pin (2026-07-04), and the v4 cut severed the edge 12
  days later — whiplash context that must be priced into any re-adoption ruling (M7).
- **N8. parse-that's standing PT-E ask letter to value** (`ef10d5b`, 2026-07-05: per-parse
  diagnostics HIGH · inference MED · Pratt-dormant) is missing from R8's ingestion set (M8).

### Union product

FABLE-NEW (N1–N8) + UNION-CONFIRMED (U1–U13, with the U5/U9/U12/U13 amendments as stated).
X1–X2 corrections MUST reach the final packet: tape is live-Rust/absent-TS (not dead), and
the parser archaeology is incumbent-restoration (not fresh adoption).
