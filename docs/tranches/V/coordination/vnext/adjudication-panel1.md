# Adjudication — thrice-panel ONE (Fable, adjudicator seat)

> Duty: PROVE or DISPROVE each contested finding with my own on-disk verification,
> then emit the amendment set that supersedes the draft. All repos read-only.
> Verifications run against CURRENT HEADs: value.js `91fa1368` (note: Skeptic A cited
> `2c772824`; the repo advanced during the panel — every A structural claim reproduces
> on `91fa1368`, so the drift is immaterial). kf tree = `keyframes-v-exec`.
> **The two-atlas trap is the decisive event of this panel** (Ruling 5/6): Skeptic B
> read the STALE standalone atlas and inverted its own conclusions.

---

## RULING 1 — parser identity + the three-way bench framing (A#1/R2)

**RULING: UPHOLD-A (fully proven).**

My evidence:
- `value.js/src/parsing/` — **does not exist** (`ls` → No such file or directory).
- `git show 164343c1` = `feat(v4)!: value 4.0 producer surface … retire pre-v4 src trees`
  (2026-07-17), and its diff DELETES the byte-scanner benches `bench/css-parse-perf.mjs`
  and `bench/parser-namelookup.mjs`. The measured byte-scanner tree was retired at v4.
- Extant parser = `src/css/grammar.ts` (22 KB) + `stylesheet.ts` (43 KB). `grep -c`
  regex sites in grammar.ts = **24**; `grep charCodeAt|dispatch(|scanIdent|scanNumber
  src/css/` = **0 hits**. It is a regex/char-split rewrite, NOT a byte-scanner.
- No parser perf bench survives on disk. The baseline is greenfield.

Consequence: the draft's "measured byte-scanner, don't relitigate" spine is attached to
a DELETED tree; the incumbent is an UNMEASURED regex rewrite that may lose to both a
byte-scanner and parse-that. A's three-way greenfield bench (regex cleanup vs resurrected
byte-scanner reference vs parse-that mutable-ParserState prototype) is the correct framing.

**FINAL AMENDMENT → G1' and R2' (see set below).**

---

## RULING 2 — the tape inversion (A#2/#3)

**RULING: UPHOLD-A (fully proven).**

My evidence:
- parse-that TS `tape` grep over `typescript/` src = **0 hits**. No tape in the TS impl.
- `bbnf-lang/docs/GESTALT.md:11` — "The historical tape runtime is gone: `crates/tape/`
  was deleted at AZ-II.cutover.O5 + AZ-III.W1"; `:48` — "simdjson's tape was a proof of
  shape regularity, not the final surface … `crates/tape/` deleted." tape is a DELETED
  Rust bbnf-lang runtime, slower than direct-to-struct.
- `parse-that/docs/perf-optimization-ts.md:55` "Immutable → Mutable ParserState", `:71`
  "zero-alloc mutation", `:335` "Mutable state is the single biggest win … eliminated
  ~4,000 heap objects per parse." That — not tape — is the parse-that TS allocation lever.

The owner's premise ("tape adoption … reduce allocations on modern V8") is INVERTED: tape
is closed against the owner's direction. The intent (allocation reduction on modern V8) is
preserved by naming the correct lever.

**FINAL AMENDMENT → folded into G1' (see set).**

---

## RULING 3 — capability regression + SCI-1 state (A#8/#9)

**RULING: UPHOLD-A (fully proven); rule the capability-preservation gate IN.**

My evidence:
- Into surface SHIPPED: `git 07760131` = `feat(color-boundary · R.W1.5):
  sampleGamutBoundary/Into + goldens + bench` ("the zero-alloc Into twin"). `git 23d1a91e`
  Tranche P "color2Into gamut zero-alloc." So the into-variants were real, shipped, benched.
- Raytrace oracle SHIPPED: `git 60bb64e9` = `feat(S.W1-10 · color): raytrace gamut map
  (R-4) — the exact-boundary reference`. Pre-v4 tree (`164343c1~1`) contained
  `src/units/color/gamut/{raytrace,boundary,gamut}.ts`.
- LOST at v4: current tree `grep Into src/color src/subpaths` = **0**; `grep
  raytrace|MINDE|deltaEOK src` = **0**. Dropped at the `164343c1` cut with no
  capability-preservation gate. The regression is real; the owner's "we SHOULD have
  near-perfect zero-alloc" is a recovery, not net-new.
- SCI-1 state: `value.js/docs/tranches/V/DECISIONS.md:82` (D54) — "SCI-1: **SHIP-4.1.x** —
  the sole ship … into-variants … un-dated, execution-gated … feeds W56's version choice."
  It is DECIDED (ship), execution-gated — NOT "pending"/"orphaned in WL" as the draft's
  G6/R8 imply. The V-next registry inherits it as a DECIDED row.

A's proposed "capability-preservation gate on major rewrites" is ruled **IN** — it is the
missing invariant behind every regression this panel found.

**FINAL AMENDMENT → R7' and G6'/R8' (see set).**

---

## RULING 4 — gamut-mapping shape (A#7)

**RULING: UPHOLD-A (fully proven).**

My evidence (read `operations.ts:133-176`):
- `mapColorToGamut` converts to oklch, holds L and H, runs a **32-iteration binary search**
  for the greatest in-gamut chroma (`:158-170`), returns the reduced-chroma color.
- `:156` clamps L via `Math.min(1, Math.max(0, sourceL))` — **no** L≥1→white / L≤0→black
  short-circuit.
- **No** deltaEOK; **no** clip-vs-reduced (MINDE) comparison; the code's own comment
  (`:148-151`) confirms hue-preserving cylindrical clipping.
- `grep deltaEOK|MINDE|raytrace|wpt|13.2|conformance src` = **0** — no CSS-Color-4 §13.2
  vectors and no WPT suites on disk. R6 is greenfield gate infrastructure.

The impl is a §13.2 SIMPLIFICATION; the draft's R6 phrasing described the SPEC as if it
were the impl. Heaviest allocators (`mapColorToGamut` ~5 allocs × 32 iters; `safeAccentColor`
compounding) are NOT covered by SCI-1's two into-variants.

**FINAL AMENDMENT → R6' (see set).**

---

## RULING 5 — the wedge severity + the two-atlas trap (B#1/#2/#3/#9)

**RULING: NOVEL (B's atlas core is REFUTED — it read the STALE tree; B's tree-independent
points are UPHELD; the draft's atlas-tuple claim is VINDICATED on the active tree).**

My evidence — **the two-atlas trap resolved on disk**:
- Skeptic B read `/Users/mkbabb/Programming/atlas` = **STALE**: `version 4.0.0`, branch
  `master`, HEAD `1e2b911` dated **2026-07-15**, peers glass `^6.0.0`/kf `^5.3.5`/value
  `^3.1.0`. That is what produced B's "atlas REFUTED" and its 2-of-3 chase census.
- The **ACTIVE** atlas successor = `/Users/mkbabb/Programming/.p-totality/atlas`, branch
  `p/totality`, HEAD `fe9abcf` dated **2026-07-17** (newest), `version 7.0.0`, peers
  glass `^7.0.0`/kf `^6.0.0`/value `^4.0.0` — **exactly the "glass7+kf6+value4 tuple" the
  draft claimed.** (`p/totality` is a real branch in the standalone repo too — same HEAD.)
  The docs-only `sci-report/atlas` subtree is the docs half of this active atlas; its code
  successor is the `p/totality` tree. The published-and-installed 4.0.0
  (`sci-report/node_modules/@mkbabb/atlas` = 4.0.0) is the STALE edge.
- So the draft's "atlas 7.0.0 consumes glass7+kf6+value4" is **TRUE on the active tree**;
  B's "atlas is 4.0.0, REFUTED" is an artifact of reading stale `master`.

B's tree-INDEPENDENT points — verified myself, all UPHELD:
- glass-ui `7.0.0` `peerDependenciesMeta` marks **both** `@mkbabb/keyframes.js` AND
  `@mkbabb/value.js` `{optional: true}` (also pencil-boil, vueuse, embla, tw-animate-css).
  A major against glass's optional peers is a WARNING, not an install break. "P127-class
  wedge" is over-stated for the glass edge. **UPHELD.**
- kf pins value EXACTLY: `keyframes-v-exec/package.json:70` `"@mkbabb/value.js": "4.0.0"`
  (no caret), glass `7.0.0`. The one true hard install break a value major forces. **UPHELD.**
- value.js's OWN manifest: `dependencies: {"@mkbabb/glass-ui":"^7.0.0",
  "@mkbabb/keyframes.js":"^6.0.0"}` — a leaf lib runtime-declaring kf+glass; a
  manifest-level value→kf→value loop the draft's wedge analysis omitted. **UPHELD** (this
  is the SAME finding as A#7/MISSED — convergent across both skeptics).

True co-land scope for R3 = a synthesis absorbing BOTH: the active atlas successor
(p/totality 7.0.0) DOES sit behind `^4.0.0`/`^6.0.0` ranges (a value/kf major breaks it →
co-land needed); the kf EXACT `4.0.0` pin is the hard install break; value's self-declared
glass/kf deps must bump with any value major (the manifest cycle); glass's optional peers
are warnings; and the STALE published atlas 4.0.0 owes an independent catch-up regardless.

**FINAL AMENDMENT → G3' and R3' (see set).**

---

## RULING 6 — the chase-site census (B#5)

**RULING: UPHOLD-DRAFT / REFUTE-B (the draft's line list and atlas's CHALLENGE-2 letter are
CORRECT on the active tree; no correction-of-the-correction is owed to atlas).**

My evidence — the three cited sites, read in BOTH trees:
- **ACTIVE** `.p-totality/atlas` (p/totality 7.0.0):
  - `platform/composables/useCountUp.ts:47` = `import { NumericAnimation, type
    TimingFunction } from "@mkbabb/keyframes.js";` → **kf-origin.**
  - `motion/useScrollLettering.ts:57` = `type TimingFunction,` inside the block closing
    `} from "@mkbabb/keyframes.js";` (with `stagger, springTimingFunction`) → **kf-origin.**
  - `motion/useScrollTimeline.ts:44` = `import { ManualTimeline, type TimingFunction }
    from "@mkbabb/keyframes.js";` → **kf-origin.**
  - **All three chase kf's `TimingFunction`** — line numbers match the draft's list exactly.
- **STALE** `/Users/mkbabb/Programming/atlas` (master 4.0.0) — what B read: useCountUp and
  useScrollLettering take `TimingFunction` from `@mkbabb/value.js`; only useScrollTimeline
  takes kf's. That is B's "2 of 3 are value.js" — true only of the stale tree.

Therefore: the atlas CHALLENGE-2 letter ("all three are keyframes-origin") is CORRECT on
the active successor; B's contradiction of it is a stale-tree artifact. **No
correction-of-the-correction is owed to atlas.** The handoff must (a) PIN the census to the
active `p/totality` successor tree and (b) reconcile the doc-internal figure to THREE
kf-chase sites (`FOLD-FORWARD.md:37` "THREE kf chase sites" is right; the "2 atlas sites"
figure was a stale read), with an explicit two-tree hazard note so no executor re-reads
stale `master`.

**FINAL AMENDMENT → G4' (see set).**

---

## RULING 7 — the flatten minefield (B#6)

**RULING: UPHOLD-B (spot-checks proven).**

My evidence (3 anchors verified):
- `keyframes-v-exec/tsconfig.json` — self-alias present: `"@mkbabb/keyframes.js":
  ["./src/animation/index.ts"]` (with a long dogfood-inversion comment) and `"@src/*":
  ["./src/*"]`. A flatten must repoint both.
- `.dependency-cruiser.cjs:171` — `from: { path: "^src/animation/internal/" }` (the
  `leaf-no-engine-no-valuejs` rule → `ENGINE_PATH`/`VALUEJS_PATH`). `grep -c src/animation`
  in that file = **9** anchors. A single missed key silently vacuous-greens the
  value.js-free-leaf boundary.
- `vite.config.ts` — `"src/animation/index.ts"` at `:41` and `:156`, plus the `engine/index`
  named-entry logic emitting to `dist/engine/index.js` (the `./engine` subpath target).

The draft R4's "depcruise key repoint + engine-mirror re-verify" understates the blast
radius. B's full checklist is correct: born-RED at every anchor until they move together.

**FINAL AMENDMENT → R4' (see set).**

---

## RULING 8 — R14 tests-isomorphism (B#8)

**RULING: UPHOLD-B (born-RED on BOTH; no value gate exists).**

My evidence:
- value.js: `scripts/gates` **does not exist**; **no** `proof:*` npm script. There is NO
  structure gate to "extend." src dirs = {color, css, foundation, subpaths, transform};
  test dirs = {parsing, transform} + the BULK flat at `test/` root (easing.test.ts,
  math.test.ts, ink.test.ts, mix-v4.test.ts, v4-*.test.ts …). `test/parsing/` has no
  `src/parsing` counterpart (that tree was deleted at v4). NON-isomorphic. The value-side
  rule is "build the gate from scratch + re-mirror the whole test tree" — a born-RED WAVE.
- kf: **0** co-located `*.test.ts` in `src` (owner's no-colocation rule already met), but
  `test/` carries support dirs {_root, characterization, demo, fixtures, support} with no
  src counterpart. A NAIVE isomorphism gate is born-RED on kf too — it needs a support-dir
  allowlist + a types-only-src exemption. The draft's "kf already conforms" over-claims.

**FINAL AMENDMENT → R14' (see set).**

---

## RULING 9 — R1 / R5 / R10 / R13 (quick, per skeptic evidence)

**R1 — RULING: UPHOLD-B (misread, not contradiction; remedy retained).** The verbatim is two
composed segments: the vision (lines 3–65, incl. "majority on direct code implementation")
describes the FORMED tranche's execution character; the formation block (lines 66–104, "This
is NOT an implementation phase … no source edits") governs THIS deliverable. No contradiction
— but label each edict's phase. → R1'.

**R5 — RULING: UPHOLD-A (both draft-named sites are census-clean; easing.ts is the real
residual — verified myself).** I read `keyframes-v-exec/src/animation/easing.ts`:
`:30` `const CSS_NATIVE_KEYWORD = /^(linear|ease|ease-in|ease-out|ease-in-out)$/;` and `:39`
`const CSS_FUNCTION_EASING = /^(cubic-bezier\(|steps\(|linear\(|step-start$|step-end$)/;` —
kf re-encodes the CSS-native easing name table as classifier regex, the exact set value.js
owns in `parseTimingFunction` (grammar.ts:436). Genuine (minor) name-table duplication with
a perf-vs-duplication tradeoff to STATE. Meanwhile `scroll/grammar.ts` self-documents as
"each a thin pass-through to value.js … value.js owns VALUES" and imports
`parseAnimationTimeline`/`parseStylesheet` — zero local productions (census PASS);
`parseAnimationCSS.ts` likewise delegates. The draft's two named rows are FALSE POSITIVES.
(I temper A's "rename scroll/grammar.ts" sub-point to optional: the file legitimately owns
the SERIALIZE + round-trip contract, not only parse — filename honesty is a nicety, not a
defect.) → R5'.

**R10 — RULING: UPHOLD-DRAFT (B confirmed FAITHFUL).** "own and direct all kf library items"
+ "the next kf-owned tranche will adapt accordingly" + "frontend work focus on value.js" =
value DIRECTS kf library items as specs/dispatch; the kf successor IMPLEMENTS; kf's demo/UI
corpus stays successor-owned. R10's ask (make the grant explicit IF direct cross-repo EDITS
are intended) is the correct disambiguation. Keep R10 as drafted. → R10 (unchanged).

**R13 — RULING: UPHOLD-B (subpaths ARE export homes, but dissolution is ALLOWED and likely
owner intent).** B read all 7 `value.js/src/subpaths/*.ts` — pure curated re-export barrels
(named allowlists, zero runtime indirection), so "restructure the files, never the keys" is
honest. But R13's own principle PERMITS dissolving the `subpaths/` directory entirely
(repoint the exports map at the domain barrels, e.g. `./color`→`dist/color/index.js`),
preserving the 7 keys + symbol sets — which is what "subpaths/ as a module … code smell
supreme, NO SHIMS" asks for. State dissolution as allowed/likely-intended, not defend the
layer. (kf has no `subpaths/`; the owner's kf analog is `src/animation/internal/`.) → R13'.

---

## RULING 10 — MISSED-section sweep (promotions)

Promoted into the set (material, evidenced):
- A-MISSED-5 / R2': `grammar.ts:175-255` `parseFunctionalColor` 8-branch if-ladder is a
  readability defect solvable by table dispatch WITHOUT parse-that → keep readability and
  parser-choice as INDEPENDENT axes. **PROMOTED into R2'.**
- A-MISSED-6 / B-MISSED-4: BOTH R2 and R6 gates are GREENFIELD (no parser bench, no WPT
  vectors on disk); value.js has NO structure gate. "Extend the gate" is really "author the
  gate." **PROMOTED into R2'/R6'/R14' as explicit NEW-infrastructure lines.**
- A-MISSED-7 / B-MISSED-3 (convergent): value.js `dependencies` declares glass `^7` + kf
  `^6` → manifest-level value→kf→value cycle. **PROMOTED into R3'.**
- B-MISSED-6: doc-internal census inconsistency (V.md:47 "three atlas sites" vs
  FOLD-FORWARD.md:37 "THREE kf chase sites" vs PROMPT-RECAP "2 atlas sites"). Truth on the
  active tree = THREE kf-chase sites. **PROMOTED into G4'** (reconcile to one census).
- New adjudicator finding (NOT in either skeptic): the whole panel exposes a
  **stale-tree-read hazard** (B inverted its atlas conclusions off `master`; A cited a
  superseded value.js HEAD). **PROMOTED as G0' — a tree-pinning discipline for the executing
  session.**
- B-MISSED-5 ("fence rests on a name collision; IN-ATLAS-5 corrected to 2/3") is REFUTED by
  the active tree (all 3 kf-origin) — NOT promoted; corrected in G4'.

---

# THE ADJUDICATED AMENDMENT SET

> Clean, self-contained, merge-ready. Supersedes the corresponding draft rows. Unlisted
> draft rows (G2, G5, G7, G8, R9, R10, R11, R12, R15) stand as drafted, with G5's
> "amend-the-blueprint + extend-the-gate" mechanism reaffirmed.

**G0' (NEW — tree-pinning discipline).** Before any cross-repo claim, PIN the exact tree +
branch + HEAD. Two hazards proven this panel: (1) atlas exists as a STALE published tree
(`/Users/mkbabb/Programming/atlas` @ `master`, v4.0.0, glass6/kf5.3.5/value3.1.0) AND an
ACTIVE successor (`.p-totality/atlas` @ `p/totality`, v7.0.0, glass7/kf6/value4 — the docs
half lives at `sci-report/atlas`); ALL atlas verification uses the `p/totality` successor.
(2) value.js HEAD advances mid-audit — cite the HEAD hash. No cross-repo finding is admitted
without a pinned tree.

**G1' (parser archaeology + tape).** The measured byte-scanner parser (O.W6,
`value.js/src/parsing/`) was RETIRED at the v4 cut (`164343c1`, 2026-07-17, "retire pre-v4
src trees"), with its benches (`css-parse-perf.mjs`, `parser-namelookup.mjs`) deleted. The
EXTANT parser is `src/css/grammar.ts` (24 regex sites, 0 `charCodeAt`/`dispatch`/`scanIdent`)
+ `stylesheet.ts` — an UNMEASURED regex/char-split rewrite, not a byte-scanner. The
SpanParser-on-V8 falsification (parse-that future-research.md, −10..−14%) is REAL but rules
out only runtime-switch dispatch. "tape" is a Rust bbnf-lang runtime DELETED as slower than
direct-to-struct (bbnf-lang GESTALT.md:11,48), NOT a parse-that TS lever — the real TS lever
is mutable-ParserState / zero-alloc combinators (parse-that perf-optimization-ts.md:55,335,
"~4,000 heap objects/parse" eliminated). Framing = RE-ADJUDICATION of an unmeasured regex
parser under new evidence; tape is inadmissible as new evidence.

**G3' (majors re-open the wedge — priced honestly).** glass-ui@7.0.0 peers value `^4.0.0` +
kf `^6.0.0` but marks BOTH `{optional:true}` in `peerDependenciesMeta` → a major against
glass is a peer WARNING, not an install break. The true hard install break is kf's EXACT
pin `"@mkbabb/value.js":"4.0.0"` (keyframes-v-exec, no caret). value.js's OWN manifest
declares `dependencies: glass ^7 + kf ^6` — a manifest-level value→kf→value cycle. The
ACTIVE atlas successor (`p/totality` v7.0.0) sits behind `^4.0.0`/`^6.0.0` ranges (a
value/kf major breaks it); the STALE published atlas 4.0.0 (glass6/kf5.3.5/value3.1.0) is
ALREADY off-constellation and owes a catch-up regardless.

**G4' (kf frozen-fence pack — corrected census).** CONFIRMED verbatim: `TimingFunction =
(t:number)=>number` at `keyframes-v-exec/src/animation/constants/types.ts:45`; exports
exactly `.` + `./engine` with the 44-key built runtime mirror; kf 6.0.0 immutable;
depcruise value.js-free-leaf law keyed on `^src/animation/internal/`
(`.dependency-cruiser.cjs:171`) — the CONFIG KEY must move with any `internal/` rename or the
boundary silently vacuous-greens. CORRECTED: the THREE chase sites, verified on the ACTIVE
`p/totality` atlas successor, ALL import kf's `TimingFunction` — `useCountUp.ts:47`,
`useScrollLettering.ts:57`, `useScrollTimeline.ts:44` (the atlas CHALLENGE-2 "all three
keyframes-origin" letter is CORRECT; the "2-of-3-value.js" figure was a stale-`master` read).
Transmit ONE reconciled census = THREE kf-chase sites (per FOLD-FORWARD.md:37), with the
two-tree hazard note (G0').

**G6' (SCI-1 is DECIDED, not pending).** SCI-1 = DECIDED **SHIP-4.1.x** (value.js
DECISIONS.md:82 D54; coordination/INBOX.md O-5): restore the into-variant surface
(mixColorsInto / toRgba8Into), real consumer ~3,243 marks/frame (atlas), execution-gated to
the 4.1.x cut, vehicle W56. The V-next registry INHERITS it as a DECIDED row; it is not
re-adjudicated and not "orphaned in WL."

**R1' (phase labels, not a contradiction).** The verbatim composes two segments: the vision
(lines 3–65, incl. "majority on direct code implementation … visual verification") sets the
FORMED tranche's execution character; the formation block (lines 66–104, "NOT an
implementation phase … no source edits") binds THIS deliverable to audit+formation only. No
contradiction — LABEL each edict's phase (A=formation / B=implementation) so no executor
treats the vision's "direct code implementation" as a licence to edit during formation.

**R2' (three-way, greenfield, readability separated).** Born-RED baseline of the extant
REGEX parser (`grammar.ts` + `stylesheet.ts`): MB/s + allocs via V8 heap-sampling on the
real CSS corpus (NEW infra — no parser bench exists on disk). Contest THREE candidates:
(i) table/data-driven regex-or-char-scan cleanup (also cures the `grammar.ts:175-255`
`parseFunctionalColor` 8-branch if-ladder — readability, no parse-that needed), (ii) a fresh
byte-scanner reference (retired O.W6 technique, re-measured), (iii) a parse-that
mutable-ParserState / zero-alloc-combinator prototype. `tape` EXCLUDED. Adoption is
owner-ratified on measured MB/s+allocs; readability is a SEPARATE, table-solvable axis so
parse-that cannot ride in on "unreadable." Cite D7/SpanParser as ruling out runtime-switch
dispatch only.

**R3' (co-land protocol — by consumer, not one uniform wedge).** ONE coordinated
constellation cut. Targets, priced by consumer: (a) kf's EXACT value pin `4.0.0` — the sole
hard install break a value major forces; (b) the ACTIVE atlas successor (`p/totality`
v7.0.0) peer-range bump (glass7+kf6+value4 → +1 majors); (c) value.js's own self-declared
`dependencies` glass `^7`/kf `^6` (the manifest value→kf→value cycle) must bump in lockstep;
(d) the STALE published atlas 4.0.0 owes an independent catch-up NOW, before any major;
(e) glass-ui's OPTIONAL peers yield warnings, not breaks — do NOT price them as hard edges.
Name chase-site ledgers in advance; until the cut, restructures stay internal-only behind
frozen surfaces.

**R4' (flatten = coordinated config-and-graph move, born-RED at every anchor).** The
`src/animation`→`src` flatten and the `internal/` rename are NOT a rule tweak. Gate-row
checklist (all move together or the boundary vacuous-greens): tsconfig self-alias
(`"@mkbabb/keyframes.js":["./src/animation/index.ts"]`) + `@src/*` map; the ×N vite entries
(`src/animation/index.ts` at :41/:156, `entryRoot`, the `engine/index` named entry + its
`dist/engine/index.js` emit); vitest alias; ALL 9 `.dependency-cruiser.cjs` anchors (incl.
the `^src/animation/internal/` boundary key at :171, `ENGINE_PATH`/`VALUEJS_PATH`); the
structure-gate birth scope + R6 `@src/*` specifier resolver; the dts rollup emit path; a
post-move 44-key mirror re-verify + full depcruise `--selftest`. Feasible, but born-RED at
every anchor until unified.

**R5' (boundary is an ACHIEVED census — lock it; easing.ts is the one live row).** The
parsing boundary is ALREADY census-PASS at every site the draft named: `scroll/grammar.ts`
(self-documented "thin pass-through to value.js … value.js owns VALUES"; zero local
productions), `parseAnimationCSS.ts` (delegates to value's `parseStylesheet`),
`compile/selector.ts` (wraps value's `parseKeyframeSelector`). The gate LOCKS the achieved
state (zero productions on both sides). The ONE genuine kf-side residual is
`src/animation/easing.ts:30,39` — the CSS-native easing NAME TABLE re-encoded as classifier
regex (`/^(linear|ease|ease-in|ease-out|ease-in-out)$/`, `cubic-bezier(|steps(|linear(|
step-start$|step-end$`), duplicating the set value.js owns in `parseTimingFunction`
(grammar.ts:436): consume `parseTimingFunction` as the oracle, OR STATE the hot-path perf
reason to keep the local classifier. (Optional nicety: `scroll/grammar.ts` filename honesty
— it owns SERIALIZE + round-trip, not only parse.)

**R6' (DECIDE the gamut policy; name the true hot paths; NEW gate infra).** `mapColorToGamut`
(operations.ts:133-176) is hue-preserving pure-chroma-reduction (hold L+H, 32-iter binary
search) with NO deltaEOK, NO clip-vs-reduced MINDE, NO L≥1→white/L≤0→black short-circuit
(only clamps L, :156) — a §13.2 SIMPLIFICATION a strict WPT gamut-map suite would FAIL. R6
must DECIDE: (i) adopt §13.2 MINDE (add deltaEOK + clip-vs-reduced + L-endpoints —
re-anchoring the S-era raytrace oracle dropped at v4), OR (ii) ratify the current
hue-preserving reduction as a deliberate deviation and WPT-gate only conforming paths. WPT
Color-4 + §13.2 vectors are NEW gate infrastructure (grep=0 on disk), not an inheritance.
Priority zero-alloc targets = `mapColorToGamutInto` + `safeAccentColorInto` (the 10³–10⁴
alloc hot paths); SCI-1's mixColorsInto/toRgba8Into are necessary but do NOT touch them.

**R7' (defect-family register PRIMARY family = v4 capability LOSS + a capability-preservation
gate).** The register's primary family is *v4-rewrite capability loss*, not mere recurrence:
the R-era zero-alloc Into surface (`sampleGamutBoundaryInto` git 07760131; `color2Into` git
23d1a91e) and the S-era raytrace §13.2 gamut oracle (git 60bb64e9; pre-v4
`src/units/color/gamut/raytrace.ts`) were SHIPPED then DROPPED at the v4 cut (`164343c1`;
current `grep Into src/color` = 0, `grep raytrace src` = 0). SCI-1's "restore" is literal.
The missing invariant is the ABSENCE of a capability-preservation gate on major rewrites —
ADD it (a public-surface + capability diff that born-REDs on any drop across a major). Fold
the mixColors/parseCSSValue ad-hoc chain (git 329932b8 U-F29, 0c212e8d U-F30, V-D3
d82c63cd) as INSTANCES under this family, so the uplift closes families, not instances.

**R8' (ingest SCI-1 as DECIDED).** Ingest the standing letters as registry rows, but ingest
SCI-1 as a **DECIDED SHIP-4.1.x** row (not "pending"): the registry starts from the decision,
not a re-derivation.

**R13' (dissolve subpaths/ — allowed and likely intended).** The 7 `value.js/src/subpaths/*.ts`
are pure curated re-export barrels (named allowlists, zero runtime indirection), so the keys
are frozen but the files restructure freely. R13's own principle PERMITS dissolving the
`subpaths/` directory: repoint the exports map at the domain barrels
(`./color`→`dist/color/index.js`, etc.) and delete the layer, preserving the 7 keys + their
exported symbol sets. State dissolution as the likely owner intent ("subpaths/ as a module …
code smell supreme, NO SHIMS") and ALLOWED — do not defend the layer. kf analog: no
`subpaths/`; the owner's kf target is `src/animation/internal/` (the value.js-free-leaf home
guarded by depcruise :171).

**R14' (tests-isomorphism is a NEW gate, born-RED on BOTH).** Test-isomorphism born-REDs on
both repos: kf (0 co-located tests — no-colocation already met) needs a support-dir allowlist
{_root, characterization, demo, fixtures, support} + a types-only-src exemption to pass —
"kf already conforms" over-claims. value.js has NO structure gate at all (no `scripts/gates`,
no `proof:*`) and a NON-isomorphic test tree (`test/{parsing,transform}` + bulk flat at
`test/` root; `test/parsing` has no `src/parsing`) — so value = CREATE the gate + re-mirror
the whole test tree. Bill each as its own born-RED WAVE; do not assert either "conforms."
