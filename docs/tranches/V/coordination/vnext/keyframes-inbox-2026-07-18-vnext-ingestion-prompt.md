# THE V-NEXT KICKOFF PROMPT — REFINED (r2, true-Fable-grounded) — 2026-07-18

> The owner's original prompt, refined per owner order ("Refine it, with context
> packets for handoff to augment and ground in already done-fable-grounded research
> and findings"). The owner's edicts and voice are preserved; questions the research
> has ANSWERED are replaced by their answers with pointers into the companion
> **context packets** (`keyframes-inbox-2026-07-18-vnext-formation-handoff.md`, "P#"
> below); mis-premises are corrected inline. The byte-canonical original + all five
> addenda travel in the packets (P0.3) — nothing is silently dropped.
>
> **PROVENANCE (P0):** every grounding fact herein is the r2 TRUE-FABLE union
> product — 8 fresh Fable skeptic seats + 2 Fable adjudicators, run ANEW after the
> discovery that the prior panel silently executed on Opus, with every Opus finding
> presumed incorrect and only evidence-survivors unioned. 18 Opus rulings were
> REFUTED (P0.2 names each); do not cite the pre-r2 letters.

---

## §0 — CHARTER

- **This is the value.js-owned V-next tranche FORMATION. No source edits land from
  this prompt.** The deliverable is the next tranche fully formed: plan folder, wave
  specs with born-RED gates wherever the defect is live, π/DELTA obligations for
  every visual claim, and a terminal disposition for every chronic, deferred item,
  and prompt-recap row.
- **Model routing (supersedes every earlier routing paragraph, owner ruling
  2026-07-18): ALL agents are Fable, declared explicitly on every spawn. ZERO Opus.**
  Opus may only ever return for pure mechanical implementation sweeps in a LATER
  phase, per-tranche owner-ratified. Verify the tier actually served, not just the
  declaration (the config-error lesson, P0.1). Batches of 5–6 concurrent; thrice
  panels are exactly 3 seats.
- **Tree pins (G0′ law — pin tree+branch+HEAD before any cross-repo claim):**
  value.js `tranche-u@db77dbd8` (4.0.0) · keyframes-v-exec `master@0dac636b`
  (6.0.0, CANONICAL kf) · parse-that `ef10d5b` · bbnf-lang `b3cf48e3b` · atlas
  ACTIVE `/Users/mkbabb/Programming/.p-totality/atlas` `p/totality@fe9abcf` (7.0.0;
  the standalone `atlas@master` checkout is a STALE trap; npm latest is ALREADY
  7.0.0) · glass-ui `master` (7.0.0; NOTE: it advances quickly — re-pin at read).
- **The 32-agent budget** is steerable, registry-driven, adversarial throughout.
  Leave no lens permanently staffed; withhold the tranche's favored success
  narrative from most auditors (independence early); dedupe finding-families by
  mechanism and redirect converging excess toward underexplored lenses; decompose
  any finding equivalent in strength to "redo the tranche" into wave-shaped rows.
  Check every "done" claim against the known **close-class lies**:
  green-over-broken, vacuous-green gates, declared captures missing on disk,
  masked fallbacks, alias smuggling, re-booked chronics, per-mechanism green over
  gestalt broken. Require concrete deliverables — file:line evidence, a failing
  probe, a reproduction, a named defect row; reject status reports, vague
  optimism, and "routine" claims about unverified global properties. The registry
  is stable when two consecutive passes surface nothing new.

## §1 — MISSION

Develop the next tranche across the tightly-coupled trio — value.js, keyframes.js,
parse-that — plus the consumers (glass-ui, atlas, the demos). Each library uplifted
and scrupulously analyzed at the library level; **frontend work focuses on
value.js**. The last many tranches of EACH repo are one large evidence set (already
mined — P5 indexes the standing record); the library set and the demo set are
separate workflow series. This value.js-owned tranche DIRECTS all keyframes.js
library items as specs + bounded dispatches into kf's coordination inbox; the next
kf-owned tranche implements and adapts (P4.5 protocol). Be not afraid of major
architecture changes so long as core features are not lost — and "not lost" is now
MACHINE-CHECKED (§7 law).

## §2 — THE PARSING PROGRAM

The archaeology is DONE and adjudicated (P1). The answer to "why was this done, in
what tranche" is a **two-repo answer**:

- **keyframes.js's parser exit was RIGHT** (4 stages, 2024-07→2026-06, blob-identical
  carve-out into value.js; kf has been parser-less since 2026-04-17; no unjust kf
  drop exists). kf-side work is therefore NOT parser adoption — it is the boundary
  CENSUS LOCK: zero grammar productions on both sides, with ONE live row —
  `src/animation/easing.ts:30,:38-39` re-encodes value's timing-function name table
  under kf's documented "value.js-free light engine" law: **adjudicate
  consume-vs-ratify explicitly** (P1.4).
- **value.js's extant parser is the condemned party**: an UNMEASURED regex/char-split
  rewrite born at the v4 cut (~1 day before the original prompt), which deleted the
  parse-that COMBINATOR incumbent (value's parser for its entire npm life,
  v1.0.0→v3.1.0) together with ALL 11 benches and the perf gate. "Proper parse-that
  adoption" = **restoration of the deposed week-old incumbent** — the head-to-head
  has never been run.

**THE OWNER DECREE (2026-07-18, at the V-next preparation — DECIDED, not
bench-contested): parse-that is READOPTED outright, as published.** value.js
consumes `@mkbabb/parse-that` from the registry at its published latest (1.0.0,
the S.H4 cut made FOR value.js; verified working, measured-in-service, with
zero-copy Spans as the core state architecture and the byte-scanner leaves —
`dispatch()` charCode tables, charCodeAt fast paths — live in the main entry; the
falsified SpanParser variant was rightly excised at 1.0.0). The regex rewrite is
**retired unconditionally**. All parse-that-INTERNAL evolution — tape porting, new
substrates, Pratt revival, combinator additions — is **OUT OF SCOPE for this
tranche and belongs to parse-that/bbnf-lang's own tranche set**; any needs
discovered here route as ask letters on the PT-E channel (P5). The S.H3 Pratt
disposition stays RETIRED.

**The wave set:** (1) **R-PARSER restoration** — resurrect the deposed parse-that
parser tree (recipe: `git show 164343c1^:src/parsing/`), modernized to the v4
public `/css` surface (parseStylesheet/collect*/ParseIssue signatures preserved —
consumers never move); re-add `@mkbabb/parse-that` per value's historical pin
convention; the co-land wave prices the dependency edge. The
`parseFunctionalColor` ladder, the deepFreeze-per-parse and per-char `/\s/.test`
costs die with the regex parser. (2) **The bench restore as REGRESSION WITNESS** —
resurrect the bench corpus (`git show 164343c1^:bench/css-parse-perf.mjs`) + the
portable ratio gate (the recorded recipe: MB/s + ns/call + the co-scaling ratio);
baseline the restored parse-that parser (born-RED until it meets the gate);
measure the retiring regex parser ONCE for the record. The bench tunes the
restoration; it does not re-contest the seat. (3) **Spec-completeness
census** — born-RED coverage census of grammar/color/timeline surfaces vs the
July-2026 stabilized set; gaps become waves ON the restored parse-that grammar,
including the named restores: `color-mix()`, relative-color `from`,
`contrast-color()`, the 11-day HDR parse drop (owner decides vs the
CSS-native-only law), and `spring()` easing grammar — an OPEN ownership decision
row: kf-owns-the-SOLVER is settled (K F6.6 fence); grammar ownership value-vs-kf
is the open question, leaning value as CSS-spec territory.

## §3 — THE COLOR PROGRAM

Color facilities must best SOTA with near-perfect zero-alloc facilities for all
spaces — and the research shows this is a **RESTORE program, not net-new** (P2). The
loss is **SINGLE-SIDED**: value.js's v4 cut deleted the entire gamut/ΔE/ramp/Into
apparatus in one commit; kf NEVER owned gamut code (blob-proven; kf-side work is
consume-only + deletion of the scar tissue: the hand-rolled oklab ΔE and the stale
`sampleColorRamp`/`deltaEOK` docstrings).

**The iterative out-of-gamut algorithm, interrogated (the owner's ask):** the extant
`mapColorToGamut` is a 32-iteration chroma bisection with NO ΔE stop criterion — not
CSS Color 4 §13 conformant. The decided path (P2 ledger, priority order):
**R-DELTAE** (ΔE-OK/2000/ITP — prerequisite) → **R-GAMUT** (analytical Ottosson
cusp+Halley engine + ΔE-OK JND clip criterion, raytrace as the TEST-SIDE exact
oracle, zero-alloc kernel) → **R-INTO** (the Into family EXTENDED beyond the decided
SCI-1 pair, riding the W56 4.1.x vehicle — never forking it; the true hot paths are
`mapColorToGamutInto`/`safeAccentColor`-class) → **R-RAMP** (N-stop ramps; kf
backward-emit re-adopts and deletes its local duplication) → the remaining P6–P14
rows (grammar restores, SoA re-litigation, OKHSL/OKHSV, boundary samplers GATED on
W53's real needs).
WPT/§13 conformance vectors are NEW gate infrastructure. SCI-1 is **DECIDED
SHIP-4.1.x (D54)** — inherit, extend, never re-adjudicate.

## §4 — THE STRUCTURE PROGRAM

**Library (both repos):** achieve isomorphism and directory perfection — including
coherence and isomorphism BETWEEN value.js and keyframes.js in an abstract
facility, not merely per-repo tidiness. The same treatment and enforcement applies
to all backend files too (the api/ surface and any successor), abstracted and made
befitting for those languages and implementations.
- The kf `src/animation` flatten and the `internal/` question are **coordinated
  config-and-graph moves, born-RED at every anchor**: 13 config/gate anchors +
  ≈340 import lines, census pre-run (P4.3); anchors MUST be re-derived at execution
  (the ratified blueprint's own line-cites have already drifted — N-ADJ-3).
- **Structure governance**: kf structure waves AMEND the ratified LT blueprint +
  EXTEND proof:structure, naming superseded rulings (LT-10, LT-16) explicitly —
  never a parallel authority. `internal/` is OWNER-DECISION (restructure, not
  prune): the owner's dislike is the mandate; LT-10's 40+-importer census is the
  cost sheet.
- **subpaths/ dissolves** (owner: "code smell supreme, NO SHIMS") — with precision:
  the 7 files are 163-line export-map homes, not runtime shims; dissolution keeps
  the 7 keys frozen, uses explicit `/index` specifiers (the D50 api-extractor
  boundary), drops `./quantize`, creates a real `transform/index.ts`, and
  re-verifies the packed surface.
- **value.js hygiene**: `transform/decompose.ts` PRUNE (609 LOC, zero consumers);
  `quantize` DEMOTE to demo; **api/ EXTRACT from the repo** (125-file standalone
  backend); 39 root PNGs deleted; demo-component tests displaced out of library
  test/ root; the working-tree `dependencies` block (glass+kf) **STRIPPED/RELOCATED
  to devDependencies** + a pre-publish manifest gate (the registry has shipped
  nonsense manifests before — value once published itself as its own dependency).
- **Goldilocks granularity** everywhere: no god-modules, no sand; grouped files
  strip the module name (`easing-option`→`option`); long dirs → encapsulated
  modules; glass-ui is the REFERENCE MODEL for flattening/component idioms.
- **Tests-isomorphism is born-RED on BOTH repos**: value must BUILD its structure
  gate from scratch + re-mirror its test tree; kf needs a NEW isomorphism rule +
  support-dir allowlist.

**Demo/frontend (value-focused):** Aristotelian proportionality audit of cards,
components, design affordances, hierarchy, margins, paddings, dividing lines, and
small UI elements — **alongside grand glass-ui suffusion and affordance**;
superfluous, duplicative, or distracting elements marked for removal,
under-afforded items marked converse; the pre-glass-7 carried-forward UI corpus
audited NOW; recursive colocation (components with sub-components, composables,
skeletons, constants, styles; only truly module/global composables in
`composables/`). Root glass-ui defects are batched to the working glass agent —
and released only once large swaths of features are isolated, fully
precepts/-compliant wave addenda are written, and their exact defects targeted;
that ongoing process is not interrupted piecemeal. The W53 perceived-space plate
rebuild is the named connection for any gamut-viz restore.

## §5 — THE ZONE ADJUDICATION (dispositions are INPUT, not open questions)

Adopt the r2 zone tables (P3) — verdicts rest on the four-tree consumer census
(kf demo, value demo, glass-ui, atlas; exhaustive for every prune/demote-class
call) plus the internal wiring graph. Headlines:

- **KEEP-EARNED includes zones the Opus-era analysis condemned** — waapi (engine
  play strategy, `useWAAPI: true` is the DEFAULT), orchestration/timeline (3 runtime
  engine importers + atlas `ManualTimeline`), orchestration/drag (glass-ui
  `Draggable` runtime import), svg/morph-svg (atlas runtime via `./engine`),
  physics/spring/css (`springTimingFunction` consumed by demo+atlas+glass), the
  LIGHT/HEAVY load-engine split (glass+atlas consume LIGHT without the heavy chunk).
- **Unilateral PRUNE-CANDIDATES ≈ 0.8k LOC only**: split-text (486), motion-path
  (~180), oscillator (~150 — its keep-record's two named consumers are FALSE on
  disk; record-correction rider mandatory).
- **OWNER-DECISION ≈ 2.4k LOC** (flip, draw-svg, physics/morph, scroll, ingest):
  each carries an intact deliberate-KEEP record (EP-3 PATH-B, K.W8/K.W9 books) —
  the **record-state trichotomy** governs: intact record → owner decides; refuted
  record → shield pierced + correction duty; fence-register ruling (the K F6 annex:
  K-1 thrice-affirmed JS sampler, no-polyfill law, spring-solver LEAD) →
  cite-to-overturn with new Baseline evidence.
- **Shrink notes, not prunes**: emit/backward keeps the consumed round-trip core +
  CC-3 refusal, trims `compileToViewTransition` (demo=0; no phantom rows —
  compileToString/formatKeyframes do not exist); play-lifecycle recombines;
  presets catalog breadth.
- **Zone-orphaned tests BIND to zone verdicts** (scroll 800 / svg 807 / ingest
  1027 / waapi 737 LOC); no orphaned green.
- **The external-consumer census is a standing discipline**: no vacuity claim
  without all four trees + the wiring graph, at pinned HEADs.

**Gates/tests**: the presumption "most tests are overfit nonsense" is REFUTED on
tree (~98% behavior/contract-bearing; residue ~500 LOC). The apparatus program (P3):
kf — LAND the staged W9 quartet + prunes FIRST, wire the two enforcement-free
structural guards (lint + proof:structure appear in NO workflow, ever — two
one-line CI steps), demote the masked lighthouse step, fold boundary-cohesion's
clamp invariant into proof:structure before it dies, MR2/MR4 before any restructure
churn. value — library gates stay producer+api; the e2e fleet is adjudicated
per-oracle (~5.9k oracles + ~856 perf ABROGATE · ~1.7k FOLD · ~1.7k KEEP-EARNED on
verified catches incl. the safari trio and the driven a11y battery · ~1.2k journey
subset rides the ratified W55 vehicle); build the isomorphism gate; the pre-publish
manifest gate; resurrect bench/ with R-PARSER.

## §6 — OWNERSHIP, COORDINATION, AND THE CO-LAND BOUNDARY

- **Breaking changes are allowed and PRICED (P4.2)**: the wedge is **hard** — a
  present-incompatible optional peer HARD-FAILS npm resolution (ERESOLVE, proven by
  execution twice); every co-installing consumer (atlas, both demos) feels the
  glass edge; kf pins value EXACT `4.0.0`. ONE coordinated co-land boundary (value
  5 / kf 7 / glass peer-bump / active-atlas ranges / the NON-optional framework
  peers in the chase ledger); until it, restructures stay internal behind frozen
  surfaces. **No stale-atlas catch-up wave** (npm latest is already 7.0.0). The
  value deps block is STRIPPED, not lockstep-bumped (bumping preserves the cycle).
- **Cross-repo**: value DIRECTS kf library items as specs into kf's inbox
  (`docs/tranches/V/coordination/`); the kf successor implements; kf's demo/UI
  corpus and FOLD-FORWARD rows stay kf-owned. Direct cross-repo edits require an
  explicit owner grant.
- Glass-ui defect batching per §4; parse-that's standing PT-E ask letter is in the
  ingestion set (P5).

## §7 — STANDING EDICTS AND LAWS

The owner's edicts, in force verbatim (P0.3 carries the full original): NO quick
solutions or workarounds — idiomatic, gestalt approaches; architectural
transpositions for elegance, simplicity, performance are desirable; NO legacy code,
no aliases, no shims, no dual paths, no masking fallbacks; **extreme parsimony and
fastidious care in every implementation — KISS-forward solutions that reduce
complexity and suffuse fewer lines of code, always against the greater library and
component picture; adhere to the wave spec exactly; be pithy, laconic, and
fastidious in analysis** (more code and complexity is likely not better); pruning
granted IFF vacuity/superfluity is PROVEN — **consumer count is NOT enough** (and
the r2 record shows why: five zones nearly died of an unrun census); chronics
become DECIDED rows, re-booking forbidden — and **a chronic that has ridden two or
more closes un-decided is a DISEASE ROW: deciding it is a wave of its own**; recap
ALL prompts — an unaddressed ask becomes a registry row **with an owning wave**;
silent drops are forbidden; **partial progress is tracked in the registry and
nothing is discarded — folding is a decision, and every partial, banked, or
abandoned item receives a terminal disposition: folded into a named wave, banked
with a named re-trigger, or retired with rationale; counting a partial as done is
the close-class lie, and it is forbidden**. Plus the ratified laws:

1. **The silent-drop tombstone law**: no capability leaves a published surface
   without a by-name RIGHTLY/UNJUSTLY/UNCLEAR tombstone in the cutting release's
   CHANGELOG, machine-checked by a **capability-diff gate** (export-census diff vs
   the prior tag; red on any undeclared removal). The named failure mechanism it
   kills: *no advocate ⇒ no tombstone* (that is exactly how v4's capability drops
   — the 14-row D ledger, six families entirely unpapered — died with zero
   paper). Owning repos: BOTH — value.js first (it is where the mechanism fired);
   kf's 6.0.0 record already models compliance.
2. **G0′ tree pinning** on every cross-repo claim.
3. **Re-derive anchors at execution** — ratified blueprints' line-cites drift
   within days (N-ADJ-3); anchor re-derivation is a mechanical gate step.
4. **Phase labels**: the vision edicts ("majority on direct code implementation…
   visual verification") bind the FORMED tranche's implementation; the formation
   block binds THIS run. Label every edict.

## §8 — METHOD: THE THRICE LOOP, ALL-FABLE

The DAG spans the library and component structures AND the constellation of deps
(keyframes.js, parse-that, atlas, glass-ui — every node, edge, and cycle;
depcruise-derived, then adjudicated — never hand-drawn), analyzed in dynamic
cluster batches, each viewed thrice: two
fresh Fable skeptics assuming the structure is WRONG + one Fable adjudicator who
PROVES or disproves with its own evidence (never vote-counts). Iterate per cluster
until perfection, readability, DIRIGIBILITY: convergence = two consecutive clean
passes; ≤3 iterations per cluster before owner escalation. ALL design routes
through Fable + DesignSync. Maximal parallelization; agglomerate clusters as fits.

## §9 — RETURN CONTRACT

Return only when the next tranche is fully formed: plan folder; wave specs with
acceptance gates, born-RED wherever the defect is live; π and DELTA obligations for
every visual claim; a disposition for every chronic, deferred item, and
prompt-recap row; the OWNER-DECISION docket presented as a single decision sheet.
Every packet row (P1–P5) must land in the formed tranche as a wave, a gate, a
registry row, or an owner-decision row — **zero silent drops, checked against the
packets' row inventory**. An inventory of problems without the tranche that
resolves them is an incomplete return. If a genuine blocker prevents full
formation, return the strongest rigorously converged core and its exact remaining
gap.
