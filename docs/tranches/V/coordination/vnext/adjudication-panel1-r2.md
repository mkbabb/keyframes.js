# Adjudication — panel-1 r2 (TRUE-FABLE seat) — the adjudicated amendment set

> Adjudicator 1, r2 re-deployment, union-with-demarcation protocol. Duty:
> PROVE or DISPROVE every contested/load-bearing finding of skeptic-A-r2 +
> skeptic-B-r2 with MY OWN on-disk verification. Phase 1 written and fixed
> on disk BEFORE the prior (Opus) adjudication-panel1.md was opened.
> Verification method: every ruling below rests on a probe I ran myself
> (grep/sed/git/node/npm), not on vote-counting the skeptics.

## G0-prime tree pins (every tree I read)

| tree | branch | HEAD | version | role |
|---|---|---|---|---|
| /Users/mkbabb/Programming/keyframes-v-exec | master | `0dac636b` | 6.0.0 | CANONICAL kf |
| /Users/mkbabb/Programming/value.js | tranche-u | `db77dbd8` | 4.0.0 | value.js (dirty: dev.sh + untracked docs only) |
| /Users/mkbabb/Programming/parse-that | master | `ef10d5b` | — | parse-that |
| /Users/mkbabb/Programming/bbnf-lang | master | `b3cf48e3b` | — | bbnf-lang |
| /Users/mkbabb/Programming/.p-totality/atlas | p/totality | `fe9abcf` | 7.0.0 | ACTIVE atlas |
| /Users/mkbabb/Programming/glass-ui | master | `1b20f7d0` | 7.0.0 | peer-check only |

Not read: /Users/mkbabb/Programming/keyframes.js (dirty trap), /Users/mkbabb/Programming/atlas
(STALE trap — cited by nobody in r2), any skeptic-*/adjudication-*/FINAL-* file beyond the
charter's permitted set. Live executions: `node` import of kf `dist/engine/index.js`;
`npm install --dry-run` peer probe in my own scratch dir (`scratchpad/adj1-peer-probe`).

---

# PHASE 1 — the adjudicated amendment set (G-prime / R-prime rows)

Each row: the contested claim(s), MY verification, the RULING. "A-…"/"B-…" name the
skeptic findings adjudicated; all cites re-derived by me at the pinned HEADs.

## Row TP′ — tree-pin discipline

Both r2 skeptics pinned the canonical trees and their HEADs match mine exactly
(A's table, B's table vs my pins above). B additionally alleges the prior Opus
report worked the STALE `/Users/mkbabb/Programming/atlas`; adjudicated in Phase 2.
On the ACTIVE atlas every atlas-touching claim below verifies. **RULING: r2 tree
discipline SOUND; the ACTIVE-atlas pin (`fe9abcf`, v7.0.0) is load-bearing for
G3/G4 and must ride in the final packet as a named discipline row.**

## Row G1′ — parser archaeology (the draft's G1 is wrong in three particulars; A's replacement narrative is PROVEN)

My independent verification, all at value.js `db77dbd8` unless noted:

1. **What the extant parser is**: `src/css/` = 7 files/1,948L; the 4 parser-bearing
   files (grammar 483 + stylesheet 899 + syntax 101 + timeline 124) = 1,607L
   (A said 1,614 — immaterial drift). `charCodeAt` = **0 hits across all css/*.ts**;
   23 regex-op sites in grammar.ts alone (A said 24 — pattern drift); per-char
   `/\s/.test(char)` in `splitTopLevel`/`splitValueTokens` (grammar.ts:77–81,115);
   every successful parse recursively `deepFreeze`d (grammar.ts:33–44). **CONFIRMED:
   char-split + regex-leaf hybrid; no byte-scanner dispatch, no combinators.**
2. **Arrival**: `git log --follow src/css/grammar.ts` bottoms at exactly three
   2026-07-17 commits (`164343c1` → `f024d385` → `6aca8602`); release line
   `7334c793` (2026-07-16); tag v4.0.0 = `44ddaff7` (2026-07-16); I verified
   `164343c1` is **NOT** an ancestor of the v4.0.0 tag (restated cut). **CONFIRMED:
   the parser is a v4-cut artifact, ~1 day older than the owner's prompt.**
3. **What it replaced**: `git show 164343c1^:src/parsing/index.ts` line 1 =
   `import { Parser, all, any, dispatch, regex, string, whitespace } from "@mkbabb/parse-that"`.
   `164343c1` = 129 files, **+4,117/−24,330**. **CONFIRMED: a parse-that combinator
   parser, deleted whole.**
4. **Dependency truth by tag** (I ran `git show <tag>:package.json` for all eight):
   v1.0.0 `^0.11.0` → v1.1.0 `^0.12.0` → v1.2.0/v2.0.0 `^0.13.0` →
   v2.0.1/v3.0.0/v3.1.0 `^1.0.0` → v4.0.0 **null**. **CONFIRMED: parse-that was a
   runtime dep at EVERY value.js release before 4.0.0.**
5. **S9**: kf `495484aa` (2026-06-23) deletes `"@mkbabb/parse-that": "^0.11.0"`
   from **keyframes.js** package.json ("The @mkbabb/parse-that PRODUCTION dependency
   is REMOVED (kf reaches it only transitively through value.js)"). **CONFIRMED:
   S9 was kf-side; the draft's "removed from value.js at the constellation" is FALSE.**
6. **Measurement**: bench/ existed at `164343c1^` (css-parse-perf.mjs,
   gamut-boundary.mjs, parser-namelookup.mjs, color-alloc-hotpath.mjs,
   color2-direct-paths.mjs, …); **no bench/ and no scripts/gates/proof-perf-target.mjs
   exist at HEAD** — the measurement apparatus died in the same commit that shipped
   the successor. V-A99 (archive/ADDENDA.md:169) records the post-cut choice: "Delete
   the unreachable Value 3 implementation … instead of restoring `parse-that`" —
   a reachability/scope rationale, not a benchmark. **CONFIRMED: no old-vs-new number
   exists on either side.**
7. **SpanParser**: parse-that `docs/tranches/A/PROGRESS.md:15` — tagged-union
   SpanParser "~10–14% SLOWER on V8/TS … RETIRED". **CONFIRMED parse-that-INTERNAL;
   it never tested parse-that-vs-custom on the value grammar.**

**RULING: draft G1 REFUTED in its three particulars (S9 attribution; "measured
decision"; "tested and refuted on V8"), exactly as skeptic A found. The replacement
narrative — incumbent-restoration, unmeasured day-old rewrite, greenfield baseline —
is PROVEN and must replace G1 in the packet. A's M1/M2 (one-day-old parser; the
bench corpus as its own UNJUSTLY-DROPPED candidate with resurrection recipe
`git show 164343c1^:bench/css-parse-perf.mjs`) are VERIFIED and ADOPTED.**

## Row G2′ — value /css already owns keyframes-adjacent grammar — CONFIRMED EXACT

My probes: `ParseIssue` closed 8-code union incl. `keyframe_selector_invalid`,
`animation_option_invalid`, `timeline_option_invalid` (src/css/types.ts:10–24);
`collectAnimationOptions` at stylesheet.ts:**827** exact; `parseTimingFunction` at
grammar.ts:**436** exact (corroborated by value D54: grammar.ts:436→css/index.ts:42→
subpaths/css.ts:53). kf consumes: `compile/selector.ts:3` (`parseKeyframeSelector`),
`validate.ts:47` (`collectKeyframes, parseStylesheet` from `@mkbabb/value.js/css`).
**RULING: G2 STANDS as drafted.**

## Row G3′ — the wedge + co-land pricing — CONFIRMED, SHARPENED, and now twice-executed

1. Published graph (git tags + manifests): value 4.0.0 **deps:null, peers:null**;
   kf 6.0.0 deps `{"@mkbabb/value.js":"4.0.0"}` EXACT, glass 7.0.0 as devDependency,
   exports exactly `.` + `./engine`; glass 7.0.0 peers kf `^6.0.0` + value `^4.0.0` +
   pencil-boil `^0.9.2`, with `peerDependenciesMeta.optional:true` on exactly 7 peers
   (kf, value, pencil-boil, vueuse, embla ×2, tw-animate-css) — **vue ^3.5,
   tailwindcss ^4.0, reka-ui ^2.0, @lucide/vue ^1.16 are NOT optional**. ACTIVE atlas
   7.0.0: devDeps EXACT `7.0.0/6.0.0/4.0.0/0.9.2`, peers `^7/^6/^4/^0.9.2`. ALL CONFIRMED.
2. **ERESOLVE severity — I re-ran the probe myself** (fresh scratch dir,
   `npm install --dry-run` of glass-ui@7.0.0 + keyframes.js@5.3.5):
   `npm error code ERESOLVE … peerOptional @mkbabb/keyframes.js@"^6.0.0" from
   @mkbabb/glass-ui@7.0.0 … Fix the upstream dependency conflict`. A
   present-incompatible optional peer HARD-FAILS. The wedge severity is
   measured twice independently (B's probe + mine). **CONFIRMED.**
3. **The value prod-deps bomb (B-1-NEW) — VERIFIED**: value HEAD `dependencies` =
   `{"@mkbabb/glass-ui":"^7.0.0","@mkbabb/keyframes.js":"^6.0.0"}`, born at
   `f2c8f565` (2026-07-17, "feat(v-w44)!: adopt @mkbabb/glass-ui 7.0.0 across the
   demo consumer surface"); package `private:false`, `files:["dist",…]`; the
   published v4.0.0 tag is deps-free. If any next value cut ships this block the
   registry acquires a kf↔value cycle and (under a value-5/kf-7 co-land) dual
   physical cores via kf 6's exact `value 4.0.0` pin. **RULING: G3 STANDS;
   R3 (co-land protocol) MUST add a strip/relocate-the-deps-block row + a
   pre-publish manifest gate. The mis-home is real: kf made the same glass-7
   adoption as a devDependency; value put it in dependencies.**

## Row G4′ — the kf fence pack + chase-site census — CONFIRMED IN EVERY CHECKABLE PARTICULAR

My probes at kf `0dac636b` + atlas `fe9abcf`:
`TimingFunction` at src/animation/constants/types.ts:**45** exact
(`export type TimingFunction = (t: number) => number;`); exports `.` + `./engine`;
**44-key runtime mirror re-proven by MY OWN node execution** of
`dist/engine/index.js` → 44 keys; depcruise value.js-free-leaf law at
`.dependency-cruiser.cjs:171` (`from: { path: "^src/animation/internal/" }`).
Atlas census: **9 kf import statements / 8 files** (grep-reproduced);
TimingFunction chase sites **exactly three** — `useCountUp.ts:47`,
`useScrollTimeline.ts:44`, `useScrollLettering.ts:57` (all three line-exact);
`buildMarkAnimation.ts:7` imports `MorphSVG` from `@mkbabb/keyframes.js/engine`
(the `./engine` fence HAS a live external consumer — B's census extension VERIFIED);
25 `@mkbabb/value.js` reference lines EXACT; glass-importing files = 49 by my count
(B said 46 — immaterial drift, direction unchanged).
**IN-ATLAS-5 provenance (my adjudication of B's nit):** the chain is real —
PROMPT-RECAP-V.md:130 carries the OLD 2+1 census under IN-ATLAS-3;
kf PROGRESS.md:143–145 records the correction as IN-ATLAS-5 **"folded into
IN-ATLAS-3's obligation text"**; FOLD-FORWARD.md:37 carries the corrected THREE.
Because the correction was folded INTO IN-ATLAS-3's obligation text, the draft's
"IN-ATLAS-3; THREE chase sites" is DEFENSIBLE as written; cite IN-ATLAS-5 as the
correction event for precision. B's nit downgrades to cosmetic. **RULING: G4
STANDS verbatim + the `/engine`-consumer census extension.**

## Row G5′ — kf structure just settled — CONFIRMED

proof:structure is real and src-birth-scoped (scripts/gates/structure/index.mjs:34–35);
LT-10 verbatim at docs/tranches/V/audit/R2-05-lib-target-tree.md:285–300 ("KEEP the
`internal/` name — REJECT the `shared/` rename … forces a load-bearing config edit
across 40+ importers for a taste preference"), with the importer census (leaves 12,
errors 11, reduced-motion 10, animation-id 4, binarySearch 2, scheduler 2,
scroll-phases 2); LT-16 at PROGRESS.md:131. `src/animation/internal/` = 9 leaf files
(ls-verified). **RULING: G5 STANDS; R4's amend-don't-fork mechanism is the right
frame. NOVEL sub-finding N-ADJ-3: LT-10's prose cites the depcruise key at `:168`
while HEAD has it at `:171` — the ratified blueprint's own line-cite has ALREADY
drifted, which independently proves R4's "re-derive anchors at execution" clause
must be a gate rule, not advice.**

## Row G6′/SCI-1 state — the draft is STALE; A's correction PROVEN

value DECISIONS.md:82 (D54, 2026-07-17): "SCI-1: **SHIP-4.1.x** — the sole ship …
into-variants mirroring the blessed `lerpArray` out-buffer idiom; un-dated,
execution-gated, evidence tuple owed at the cut — feeds W56's version choice";
CARRY-LEDGER.md:30 names W56 as the D54/SCI-1 vehicle (the 4.1.x
`mixColorsInto`/`toRgba8Into` cut); WL.md:47 records the capability "did NOT
survive to 4.0.0". **RULING: draft G6's "PENDING ruling" is FALSE as of D54; R6
must be reworded to SEQUENCE AGAINST the decided 4.1.x vehicle, not re-adjudicate
it. Double-booking risk confirmed.**

## Row G7′ — subpaths — CONFIRMED TO THE DIGIT

7 files, **163 lines total** exact (color 38/css 56/easing 25/math 17/quantize 2/
transform 23/value 2); 7 export keys, **no `.` root**; **zero** src-internal
importers (sole grep hit is SVG prose, transform/path.ts:16); public type exports
counted programmatically = **62 exact** (corroborated twice by V-A99/V-A105).
D50 (DECISIONS.md:78) verbatim: api-extractor dts rollup "stack-overflows on
IMPLICIT directory-index resolution through subpath re-exports (empirically
bisected)" — explicit `/index` specifiers required. **RULING: G7 STANDS
(export-map homes, not shims); R13 STANDS with the D50 build-tool boundary
attached as a gate condition on any exports-map repoint.**

## Row G8′ — kf V state — CONFIRMED

FOLD-FORWARD.md carries W7/W8 (both "NOT IMPLEMENTED — folds whole"), W9
(AUTHORED + STAGED on `v/w9-staging`), W10 (pre-rail subset landed), W11 (folds
whole), W12 (substantially discharged), W13 (close = successor's opening act);
the marks register = **15 numbered rows exact**; row 6 = the IN-ATLAS-5 census.
**RULING: G8 STANDS.**

## Row R1′ — phase labels

The owner verbatim is two composed documents (the vision prompt, lines 3–65, ending
"Agglomerate items as you see fit."; then the appended formation-governance block
headed "# Tranche formulation", lines 66–104, "This is NOT an implementation
phase"). Not a self-contradiction — a composition. **RULING: R1's REMEDY (explicit
PHASE A/PHASE B binding per edict) is SOUND and stays; its "contradiction" framing
softens to "two composed charters whose bindings must be labeled."**

## Row R2′ — parser bench framing — DIRECTION STANDS, PREMISE INVERTED (A proven)

The born-RED baseline survives, but the spec must state: the extant parser is the
UNMEASURED party; the baseline is GREENFIELD (the v4 cut deleted every bench + the
proof-perf-target gate); the archaeology cited must be A.W3 SpanParser
(parse-that-internal falsification), O.W6 MEASURE-FIRST (resurrect from
`164343c1^:bench/css-parse-perf.mjs`), and the unmeasured v4 rewrite — NOT "D7
falsification, S9 removal" (both mis-attributions, Row G1′). parse-that's shipped
TS design is already the mutable-ParserState + zero-copy Span architecture
(typescript/src/parse/state.ts — I read the Span/ParserState source at HEAD), so
the "prototype" is a consume of the incumbent architecture; the head-to-head
(parse-that combinators vs hand-rolled, on the value grammar corpus) has NEVER run.
**Tape (adjudicated on my own probes): parse-that TS = 0 "tape" hits (15 files);
parse-that Rust removed tape 2026-04-30 (`2b0596a`); bbnf-lang RE-ADOPTED tape
2026-05-29/30 (`1c5bd7a25` flat-tape substrate; `3a37c29d8` CSS L4 routed into it;
`6dad81fb9` lazy CSSOM projection) and it is LIVE at HEAD `b3cf48e3b`
(crates/core/src/runtime/tape/{arena,cursor,mod,record}.rs +
tests/tape_substrate.rs; skinny/README.md:24 still measuring the sonic-rs gap).
"Tape adoption for the TypeScript implementation" = NEW porting work of a live
Rust concept, bench-gated — neither dead nor already-available.**
**RULING: R2 AMENDED as above. A's M3 (deepFreeze-per-parse + per-char regex
whitespace as named hot-path costs) VERIFIED and attached to the wave spec. A's M6
VERIFIED: DISPOSITION-LEDGER.md:173 already RETIRED the S.H3 Pratt new-substrate
proposal — the wave must name-and-supersede it. A's M7/N7 VERIFIED: parse-that
1.0.0 was cut FOR value (`7eab78c`, S.H4, 2026-07-03), value 2.0.1 executed the
booked re-pin (CHANGELOG:175–184, 2026-07-04), the v4 cut severed the edge ~13
days later — the stranded-spine whiplash is real pricing context.**

## Row R5′ — parsing-boundary census — CONFIRMED with A's substitution of the live residual

Draft-named rows verified as ALREADY-THIN: kf `scroll/grammar.ts` header — "each a
thin pass-through to value.js['s] typed `CSSTimelineOptions` extractor + inverse
serializer" (zero productions; value ARCHITECTURE.md:655-region confirms
`extractNamedTimelines` deliberately transposed there as sole owner). The LIVE
kf-side duplication is `src/animation/easing.ts`: `CSS_NATIVE_KEYWORD` regex (:30)
+ `CSS_FUNCTION_EASING` regex (:38–39) re-encode value's timing-function name
table, under the DOCUMENTED law "Pure string logic — value.js-free" (:48, also
:6/:24) and the depcruise leaf law. **RULING: R5 STANDS as a census with the
easing.ts row ADDED and framed as law-adjudication (consume `parseTimingFunction`
and pay the heavy edge, or ratify the duplication under the light-engine boundary
law) — not silent drift. It is also a kf-side regex site for the addendum-2 regex
census.**

## Row R6′ — gamut policy — CONFIRMED with A's restoration prerequisite

At HEAD: `mapColorToGamut` (operations.ts:133–176) = OKLCh chroma bisection, fixed
32 iterations; **deltaE of any kind = 0 hits in src/**; no clipped-candidate
comparison — NOT CSS Color 4 §13.2 MINDE. `safeAccentColor` (operations.ts:207+)
calls `evaluate` 5 times statically incl. inside two 32-iteration bisection loops
(~67 dynamic calls upper bound — A's U8 structure VERIFIED). Deleted at `164343c1`:
gamut/boundary.ts 604L + gamut.ts 526L + okhsl.ts 270L + **raytrace.ts 137L**
(landed `60bb64e9` S.W1-10 2026-07-05) + sampleGamutBoundary/Into goldens+bench
(`07760131` R.W1.5 2026-07-03). HDR parse surface (`ictcp()`/`jzazbz()` parse +
serialize + color2Into currency) shipped in 3.1.0 (CHANGELOG:47–53, 2026-07-05)
and is REJECTED at HEAD (grammar.ts:263; deliberate CSS-native-only law,
V/ARCHITECTURE.md:108-region: "/css rejects those spellings"). Model union carries
17 spaces incl. hsv/kelvin/ictcp/jzazbz (model.ts:5–7) — parse/serialize for 13.
**RULING: R6 AMENDED: (a) sequence against the decided SCI-1/W56 4.1.x vehicle
(Row G6′); (b) the deltaEOK ≤ JND anchor REQUIRES RESTORING deltaE (deleted
wholesale); (c) the drops ledger takes the raytrace/boundary/okhsl apparatus, the
Into family, AND the 11-day HDR parse drop as named rows; (d) zero-alloc targets
must name `mapColorToGamutInto`/`safeAccentColor`-class paths, which SCI-1's two
into-variants do not touch.**

## Row R7′ — ad-hoc-fix archaeology — CONFIRMED + A's amendment

All four commits real and 2026-07-13 (`329932b8` U-F29 parseCSSValues loud-fail;
`0c212e8d` U-F30 color-mix serialization; `d82c63cd`, `184a9ec9` D3 diagnostics
passes) — patched on the PRE-v4 tree, deleted with it 4 days later. **RULING: R7
STANDS; the family register must record that the patches themselves died with the
tree (recurrence risk in the successor is live).**

## Row R8′ — standing-letters ingestion — AMENDED (+PT-E)

parse-that `ef10d5b` (2026-07-05) = `docs/tranches/A/VALUEJS-PT-E-2026-07-05.md`,
the standing ask letter TO value (diagnostics HIGH · inference MED · Pratt-dormant
record) — absent from the draft's R8 enumeration. **RULING: add PT-E to the
ingestion set.**

## Row R14′ — tests-isomorphism — B's reword PROVEN

kf test/: 17 dirs — 12 zone-mirroring (compile engine group ingest internal
orchestration physics presets resolve scroll svg waapi), `constants` missing, 5
non-mirroring (`_root characterization demo fixtures support`); proof:structure is
src-birth-scoped R1–R6 with NO isomorphism rule. value test/: flat root + only
`parsing/` + `transform/`, with demo-component tests (picker-blob-config,
preview-chips, slider-announcement, status-lamp, view-accents) mixed at root; NO
structure gate of any kind in value's scripts (dev/build/gh-pages/typecheck/lint/
test/test:e2e only). **RULING: R14 REWORDED — the rule is born-RED on BOTH repos;
on value it must be BUILT, not "verified"; kf's gate needs a NEW rule.**

## Row FLAT′ — the src/animation flatten blast radius — B's census VERIFIED (with drift notes)

All 13 anchors re-derived: tsconfig.json:30 self-alias (B said :31 — one-line
drift); vite.config.ts:41 (demo alias), :156 (lib entry), :172 (engine entry →
public.ts), :225/:229 (dts entryRoot/rootDir lockstep); vitest.config.ts:18;
depcruise :84 LIGHT_FROM / :93 ENGINE_PATH / :171 internal-leaf law (rule-1 `^src/`
flatten-safe); structure/index.mjs:91 resolver; engine-dts-rollup.ts:34,64;
surface gates 15 grep hits (boundary 8, published-surface 4, readme-runs 2,
consume-bundle 1 — B said 14/boundary 7; immaterial). Import lines: test **277
EXACT**, bench **37 EXACT**, scripts **18 EXACT**, demo 9 (B said 8) ⇒ ≈340.
FOLD-FORWARD W8 independently records the CT-04 remainder (~8 deep imports).
**RULING: the flatten is a coordinated config-and-graph move; B's 13-anchor
checklist + ≈340-line census becomes the R4 gate-row content. Line-number drifts
are immaterial and themselves argue for re-derive-at-execution (see N-ADJ-3).**

## NOVEL rows surfaced by MY verification (absent from both skeptics)

- **N-ADJ-1 (manifest-hygiene prior art):** value.js's OWN published manifests
  carried a SELF-dependency `"@mkbabb/value.js": "^1.0.2"` inside `dependencies`
  at v1.1.0, v1.2.0, v2.0.0 AND v2.0.1 (tag-verified; gone at 3.0.0). The
  constellation has shipped a nonsense manifest edge before — the R3 pre-publish
  manifest gate is not hypothetical armor; it has a named historical failure class.
- **N-ADJ-2 (non-optional peer set):** glass 7.0.0's `vue ^3.5`, `tailwindcss
  ^4.0`, `reka-ui ^2.0`, `@lucide/vue ^1.16` peers are NOT optional — the co-land
  wave's chase ledger must include the framework peers, not only the mkbabb tuple.
- **N-ADJ-3 (blueprint line-cite drift):** LT-10's ratified prose pins the
  depcruise key at `:168`; HEAD truth is `:171`. The structure authority's own
  anchors drift within days — "re-derive anchors against the landed tree" must be
  a mechanical gate step in every R4-class wave.

## Phase-1 verdict on the two skeptic reports

Every load-bearing r2 claim I tested REPRODUCED (dozens of file:line cites exact
to the line; three counts off by 1–7 in the immaterial direction, noted in-row).
Skeptic A's G1-refutation triad, the one-day-old-parser fact, the bench-deletion
fact, the SCI-1/D54 correction, and the tape-is-live-Rust-side finding are all
PROVEN on my own probes. Skeptic B's wedge mechanics (incl. the ERESOLVE
hard-fail, which I reproduced independently), the value prod-deps bomb, the
three-site chase census, the 13-anchor flatten census, and the
tests-isomorphism born-RED reword are all PROVEN. No r2 skeptic finding I tested
was refuted.

---

# PHASE 2 — UNION with the prior (Opus) adjudication-panel1.md

*(Opened only after Phase 1 above was fixed on disk. Every material Opus ruling
presumed INCORRECT and tested against my own probes; fresh probes run where my
Phase-1 evidence did not already cover the claim: stale-atlas manifest read,
`npm view @mkbabb/atlas`, `23d1a91e`, bbnf GESTALT.md:11/48 + its last-commit
date, parse-that perf-optimization-ts.md:55/71/335.)*

Root assessment: the Opus adjudication got the two-atlas trap RIGHT (its Ruling
5/6 tree diagnosis reproduces on my reads: stale `/Users/mkbabb/Programming/atlas`
@ `1e2b911` = v4.0.0/glass^6/kf^5.3.5/value^3.1.0; ACTIVE `p/totality` = 7.0.0
on-tuple) and most of its verifications reproduce. It fails on THREE dispositive
calls — peer-wedge severity, the tape disposition, and the co-land remedy rows —
and on the parser-archaeology framing, all of which flowed INTO its final
amendment set and would have mis-directed the executing tranche.

## OPUS-REFUTED (tested and wrong — the disproofs)

- **XR1. Ruling 5 / G3′ / R3′(e): "a major against glass's optional peers is a
  WARNING, not an install break … do NOT price them as hard edges." REFUTED BY
  EXECUTION, twice independently.** My own probe (fresh scratch dir,
  `npm install --dry-run` of glass-ui@7.0.0 + keyframes.js@5.3.5):
  `npm error code ERESOLVE … Conflicting peer dependency: @mkbabb/keyframes.js@6.0.0
  … peerOptional @mkbabb/keyframes.js@"^6.0.0" from @mkbabb/glass-ui@7.0.0`.
  `peerDependenciesMeta.optional` exempts ABSENT peers only; a PRESENT peer at an
  incompatible version hard-fails resolution. Every real consumer here (atlas,
  both demos) CO-INSTALLS kf+value+glass, so the glass edge is a hard edge for
  the entire constellation. The derived Opus framing "kf's exact pin is the ONE
  true hard install break" dies with it (the pin FACT survives). **This is the
  single most consequential refuted ruling: R3′(e) as written instructs the
  executing tranche to under-price the co-land set.**
- **XR2. Ruling 2 / G1′ / R2′: "tape is a Rust bbnf-lang runtime DELETED as
  slower … closed against the owner's direction … tape EXCLUDED/inadmissible."
  REFUTED on bbnf-lang HEAD.** The cited GESTALT.md:11/48 quotes are REAL but the
  file was last committed **2026-05-03**; tape was RE-ADOPTED 26 days later:
  `1c5bd7a25` (2026-05-29, "add shared flat-tape runtime substrate"), `3a37c29d8`
  (2026-05-30, CSS L4 routed into "the existing skinny tape"), `6dad81fb9` (lazy
  RICH typed-CSSOM projection from the tape). At HEAD `b3cf48e3b`:
  `crates/core/src/runtime/tape/{arena,cursor,mod,record}.rs` +
  `crates/core/tests/tape_substrate.rs` exist; `skinny/README.md:24` still
  measures "the current tape-materialization gap against sonic-rs". What
  survives: the Era-IV `crates/tape/` deletion happened (GESTALT literally true
  about THAT crate), and parse-that TS has zero tape (my grep). Correct
  disposition: **tape is a LIVE bbnf-lang Rust substrate; TS tape adoption =
  NEW porting work, bench-gated — admissible, not excluded.**
- **XR3. R3′(c): the value.js manifest cycle "must bump in lockstep" — REFUTED
  AS REMEDY.** kf has carried value as a runtime dependency at every modern
  release (exact `4.0.0` today), so ANY runtime `dependencies` edge from value
  to kf is a registry cycle regardless of version — lockstep-bumping PRESERVES
  the cycle (value 5 deps kf ^7; kf 7 deps value 5 → cycle + dual-core forcing
  via kf 6's exact pin wherever mixed trees resolve). The proven remedy is
  STRIP/RELOCATE: the block was born at `f2c8f565` (2026-07-17) as a
  demo-surface adoption mis-homed in `dependencies` (kf made the same glass-7
  adoption as a devDependency); the published v4.0.0 tag is deps-free, so the
  cycle is working-tree-only and preventable at formation by relocation + a
  pre-publish manifest gate.
- **XR4. R3′(d): "the STALE published atlas 4.0.0 … owes an independent catch-up
  NOW, before any major." REFUTED on the registry + the coordination ledger.**
  `npm view @mkbabb/atlas version` → **7.0.0** — the published latest is ALREADY
  the on-tuple successor; there is ONE atlas package whose catch-up already
  shipped. value's own W56 row (CARRY-LEDGER.md:30) rules the posture: "active
  atlas already migrated — zero atlas work; sci-report crosses ATOMICALLY at its
  glass-7 consume, no early bump." No independent catch-up wave exists to book.
- **XR5. Ruling 1 / G1′ framing: the retired `src/parsing/` tree as "the
  measured byte-scanner parser." REFUTED as an account of what v4 replaced.**
  `164343c1^:src/parsing/index.ts:1` imports `Parser, all, any, dispatch, regex,
  string, whitespace` from `@mkbabb/parse-that`; parse-that was a runtime dep at
  EVERY release v1.0.0→v3.1.0 (tag-by-tag manifests, Phase-1 Row G1′). The
  deposed tree was a parse-that COMBINATOR parser with O.W6 byte-scanner leaf
  tuning INSIDE it. Consequence the Opus set never states: R2′'s candidate (iii)
  "parse-that mutable-ParserState prototype" is not a fresh third contender —
  it is the deposed week-old incumbent's architecture (shipped at parse-that
  1.0.0: state.ts mutable `ok()`/offset mutation + zero-copy Spans;
  perf-optimization-ts.md:55/71/335 "~4,000 heap objects per parse" eliminated —
  quotes verified). The archaeology, dating, and incumbency in my Row G1′
  replace the Opus framing.

## OPUS-UNVERIFIABLE (excluded from the union product; listed for the record)

- **XU1.** Ruling 6's attribution of the old "2 atlas sites" figure to "a stale
  read": the superseded census (PROMPT-RECAP-V.md:130, IN-ATLAS-3: 2
  TimingFunction + 1 EasingFunction) matches NEITHER the active tree (3 kf) nor
  the Opus-reported stale tree (1 kf + 2 value) exactly; whether it was a
  stale-tree read or an earlier-tree truth is undecidable and immaterial — the
  IN-ATLAS-5 correction (kf PROGRESS.md:143–145) fixes ground truth at THREE.
- **XU2.** The atlas "CHALLENGE-2 letter" (Ruling 6): I did not locate/read the
  letter itself; its claimed content ("all three keyframes-origin") is
  independently TRUE on my census, so nothing rides on the letter's existence.

## The demarcated FINAL amendment set (union product = FABLE-NEW + UNION-CONFIRMED)

Every Phase-1 row re-stated with provenance vs the prior Opus adjudication:

| row | content (as adjudicated in Phase 1 above) | tag |
|---|---|---|
| TP′/G0′ | tree-pin discipline; two-atlas hazard; ACTIVE = `.p-totality/atlas` `fe9abcf` (+ my registry fact: npm atlas latest = 7.0.0) | [UNION-CONFIRMED] |
| G1′-core | extant parser = unmeasured regex/char-split v4 rewrite; 0 `charCodeAt`; benches+perf-gate deleted in the same commit; baseline GREENFIELD; SpanParser falsification real + parse-that-INTERNAL | [UNION-CONFIRMED] |
| G1′-incumbency | value.js parse-that-based its whole npm life (v1.0.0→v3.1.0 tag-verified); custom parser arrived at the v4 cut (`7334c793`/`164343c1`, 2026-07-16/17), ~1 day before the prompt; "parse-that adoption" = restoration of the deposed incumbent; S9 was kf-side (`495484aa`) | [FABLE-NEW] (displaces the refuted XR5 framing) |
| G1′-tape | tape LIVE Rust-side at bbnf HEAD, absent TS-side; TS adoption = NEW porting work, bench-gated, ADMISSIBLE | [FABLE-NEW] (displaces refuted XR2) |
| G2′ | value /css owns keyframes-adjacent grammar (8-code ParseIssue; collectAnimationOptions :827; parseTimingFunction :436) | [UNION-CONFIRMED] |
| G3′-facts | glass 7 peer ranges + 7-peer optionality set; kf EXACT `value 4.0.0`; active-atlas tuple; value working-tree deps block exists (`f2c8f565`), published 4.0.0 deps-free | [UNION-CONFIRMED] |
| G3′-severity | present-incompatible optional peer ⇒ ERESOLVE HARD FAIL (executed twice); wedge binds every co-installing consumer | [FABLE-NEW] (displaces refuted XR1; r2-skeptic-B + my probe) |
| G4′ | fence pack verbatim + THREE chase sites (:47/:44/:57) + 44-key mirror (executed) + `/engine` has a live external consumer (buildMarkAnimation.ts:7) + IN-ATLAS-5 provenance note | [UNION-CONFIRMED] (census-extension + provenance note [FABLE-NEW]) |
| G5′ | structure just settled; LT-10/LT-16 verbatim; amend-don't-fork + N-ADJ-3 cite-drift proof | [UNION-CONFIRMED] (N-ADJ-3 [FABLE-NEW]) |
| G6′ | SCI-1 DECIDED SHIP-4.1.x (D54), vehicle W56 — inherit, don't re-adjudicate | [UNION-CONFIRMED] |
| G7′ | subpaths = 7 files/163L/62-type export-map homes, zero internal importers — not shims | [UNION-CONFIRMED] |
| G8′ | kf V closed-by-fold; FOLD-FORWARD rows + 15-row marks register exact | [UNION-CONFIRMED] |
| R1′ | two composed charters; label each edict's phase | [UNION-CONFIRMED] |
| R2′ | born-RED greenfield bench; three-way contest with candidate (iii) NAMED as the deposed incumbent's architecture; tape admissible-if-ported (bench-gated); readability separate axis (`parseFunctionalColor` table-solvable); deepFreeze-per-parse + per-char `/\s/` as named costs; name-and-supersede the RETIRED S.H3 Pratt disposition (DISPOSITION-LEDGER.md:173); stranded-spine pricing context (`7eab78c`→2.0.1→v4 severance) | core [UNION-CONFIRMED]; incumbent-naming/tape/deepFreeze/Pratt/spine rows [FABLE-NEW] |
| R3′ | co-land protocol: kf exact pin + active-atlas ranges + glass peer-bump, ALL priced as hard edges for co-installers; ADD strip/relocate-the-value-deps-block row + pre-publish manifest gate; NO stale-atlas catch-up wave (npm latest 7.0.0; W56 I-8) | pricing [FABLE-NEW] (displaces refuted XR1/XR3/XR4); protocol skeleton [UNION-CONFIRMED] |
| R4′/FLAT′ | flatten = coordinated config-and-graph move; the FULL 13-anchor census + ≈340 import lines + dts entryRoot/rootDir lockstep (12-byte-stub failure) + engine-dts-rollup + surface gates + post-move 44-key re-verify | core [UNION-CONFIRMED]; full-census extension [FABLE-NEW] |
| R5′ | boundary census: draft's two named rows are census-PASS pass-throughs; the ONE live row = easing.ts:30/:38–39 name-table regex, adjudicated AGAINST the documented "value.js-free" light-engine law (consume-or-ratify); also a kf regex-census row for addendum-2 | [UNION-CONFIRMED] (law-citation precision [FABLE-NEW]) |
| R6′ | decide §13.2 MINDE vs ratified deviation; WPT vectors = NEW infra; deltaE (ANY kind) must be RESTORED first (grep=0); zero-alloc targets incl. `mapColorToGamutInto`/`safeAccentColor`-class; sequence against W56; HDR parse drop (3.1.0→4.0.0, 11 days) as a named drops-ledger row; math-evaluation homelessness (`evaluateMathFunction` deleted; calc opaque at v4) decided in the spec-coverage wave | core [UNION-CONFIRMED]; deltaE-restoration/HDR/math rows [FABLE-NEW] |
| R7′ | defect-family register, primary family = v4 capability LOSS (Into family, raytrace/boundary/okhsl, benches); capability-preservation gate IN; the 2026-07-13 ad-hoc patches (U-F29/U-F30/D3) died with the pre-v4 tree | [UNION-CONFIRMED] (died-with-the-tree note [FABLE-NEW]) |
| R8′ | ingest letters incl. SCI-1 as DECIDED + parse-that PT-E (`VALUEJS-PT-E-2026-07-05.md`) | SCI-1 [UNION-CONFIRMED]; PT-E [FABLE-NEW] |
| R13′ | subpaths dissolution allowed (keys frozen, files free) WITH the D50 api-extractor boundary (explicit `/index`, packed-surface re-verify) | core [UNION-CONFIRMED]; D50 condition [FABLE-NEW] |
| R14′ | tests-isomorphism born-RED on BOTH repos; value = BUILD gate + re-mirror; kf = NEW rule + support-dir allowlist | [UNION-CONFIRMED] |
| N-ADJ-1 | value.js shipped a SELF-dependency (`@mkbabb/value.js ^1.0.2` in its own deps, v1.1.0–v2.0.1, tag-verified) — the manifest-hygiene gate has a named historical failure class | [FABLE-NEW] (adjudicator-novel) |
| N-ADJ-2 | glass 7's NON-optional peers (vue ^3.5, tailwindcss ^4.0, reka-ui ^2.0, @lucide/vue ^1.16) belong in the co-land chase ledger | [FABLE-NEW] (adjudicator-novel) |
| N-ADJ-3 | LT-10's ratified prose already cite-drifted (`:168`→`:171`); re-derive-anchors-at-execution becomes a mechanical gate step | [FABLE-NEW] (adjudicator-novel) |

## Tally

- **[UNION-CONFIRMED]: 18** row-cores (TP′/G0′, G1′-core, G2′, G3′-facts, G4′,
  G5′, G6′, G7′, G8′, R1′, R2′-core, R3′-skeleton, R4′-core, R5′, R6′-core,
  R7′, R8′-SCI-1, R13′-core, R14′ — R8/R13 sub-rows folded).
- **[FABLE-NEW]: 16** (G1′-incumbency, G1′-tape, G3′-severity-by-execution,
  `/engine`-consumer census, IN-ATLAS-5 provenance, N-ADJ-3 + LT cite-drift,
  R2′ incumbent-naming/deepFreeze/Pratt/spine, R3′ strip-relocate + manifest
  gate, R4′ full census, R6′ deltaE/HDR/math rows, R7′ died-with-tree, R8′
  PT-E, R13′ D50, N-ADJ-1, N-ADJ-2).
- **[OPUS-REFUTED]: 5** (XR1 optional-peer-warning severity → the most
  consequential; XR2 tape-dead/excluded; XR3 lockstep-bump remedy; XR4
  stale-atlas catch-up wave; XR5 measured-byte-scanner framing).
- **[OPUS-UNVERIFIABLE]: 2** (XU1 stale-read attribution of the old census
  figure; XU2 the CHALLENGE-2 letter itself) — EXCLUDED from the union product.

**Union product = the FABLE-NEW + UNION-CONFIRMED rows above.** The XR
corrections MUST reach the final packet: the co-land set is priced on hard
edges (ERESOLVE-proven), the value deps block is stripped not bumped, no
stale-atlas wave is booked, tape is live-Rust/absent-TS, and the parser
narrative is incumbent-restoration.
