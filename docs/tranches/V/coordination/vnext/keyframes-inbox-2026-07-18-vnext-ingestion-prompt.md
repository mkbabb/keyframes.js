# THE V-NEXT INGESTION PROMPT — the value.js-owned formation tranche (2026-07-18)

> **⚠ PROVENANCE HOLD (2026-07-18, kf orchestrator) — DO NOT FORM ON THIS LETTER YET.**
> A Claude Code config error caused every "Fable"-declared panel seat behind this
> corpus to silently run on OPUS. By owner order the entire panel corpus is being
> re-deployed on true Fable under the union-with-demarcation protocol (fresh Fable
> analysis first; Opus findings presumed incorrect; survivors unioned and
> provenance-tagged). A re-issued r2 supersedes this letter shortly. The verbatim
> owner text (ingestion prompt §A/§B) is unaffected.


> Execute this in the value.js session as the formation charter. It composes: §A the
> owner's prompt VERBATIM; §B the owner's five addenda VERBATIM; §C the binding
> amendments (two full thrice panels, adjudicated — facts the fleet must NOT
> re-litigate blind); §D the formation docket; §E ingestion set; §F return contract.
> The evidence base is the companion packet
> `keyframes-inbox-2026-07-18-vnext-formation-handoff.md` (same dir) — "the handoff
> packet" below.
>
> **Standing law for every spawn: ALL agents are Fable, declared explicitly. ZERO
> Opus** (owner addendum 5 supersedes §A's routing paragraph for all audit/critique/
> formation work; Opus is at most pure mechanical implementation sweeps in a LATER
> implementation phase, and only if the owner ratifies it then).
> **This is FORMATION ONLY: no source edits land from this prompt.**

---

## §A — THE OWNER'S PROMPT (verbatim, 2026-07-18)

Develop out the next tranche, would should include coordination and specific waves for our library items that use value.js and keyframes.js—and the other consumers that leverage that repo, too—as there's a tight coupling between the following: value.js, keyframes.js, and parse-that. Each library should be uplifted and scrupulously analyzed. Look to the last many tranches within EACH repo as one large set of workflows with fable—our library and our demo set should be then another series of workflow and tranche development processes.

In particular, we've had several issues that were addressed ad hoc a few tranches hence: mixColors, parseCSSValue. value.js owns the core CSS, most modern as of July 2026 with the experimental and chrome-specific features that have stabilized: ensure total and complete specification coverage, idiomatic and performant parse-that usage: parse-that itself has had a few developmental tranche sets begat in bbnf-lang, like tape adoption for the TypeScript implementation—what might we do to reduce allocations and increase performance to leverage the modern v8 engine as of July 2026? Our extant parser seems to be a custom, non-parse-that implementation—why was this done, in what tranche, and what are the performance benefits/downsides to such an approach. To me, the extant parser is unreadable and could be greatly uplifted by proper parse-that adoption.

At least, that's how our parsing facilities should be. keyframes.js itself needs to be ruthlessly examined in its parsing facilities: value.js should own the core CSS spec, keyframes the animation and keyframes-specific components (or perhaps all of the parsing is done by value.js, and keyframes.js uses use as a library? if we do go the split parsing strategy, as we do now, we must overhaul the directory structure between the two libraries totally, in both the compiler/parser AND all places elsewhere: achieve isomorphism and directory perfection within keyframes.js, too).

Mark me now: keyframes.js AND value.js are to be ruthlessly scrutinized at the library level, but frontend work should focus on value.js for the below. For example, why does keyframes.js have a superfluous src/animation structure—if animation is the only top level, why have it? Most of the sub-modules of keyframes.js need to be completely re-organized and re-structured at every level: with an emphasis on coherence and isomorphism between value.js and keyframes.js in an abstract facility.

For example, this /Users/mkbabb/Programming/keyframes.js/src/animation/internal—I don't like this at all.

All keyframes.js specific waves should, too, reference and examine their most recent tranche set, too: this most recent value.js tranche will own and direct all keyframes.js library items herein, though—the next proper keyframes.js-owned tranche will adapt accordingly. Be not afraid of major architecture changes so long as core features are not lost.

And for value.js, and keyframes.js—I don't like things like subpaths/ as a module. Code smell supreme. NO SHIMS.

—

Further, our color specification implementation, adoption, and facilities should best SOTA. We should have near perfected zero-alloc color facilities for all spaces, and transforms betwixt the two; our iterative color out of gamut algorithm must be ruthlessly interrogated.

—

Ensure that extreme parsimony and fastidious care is made for every implementation: seek KISS-forward solutions that reduce complexity and suffuse fewer lines of code: consider the greater library and component picture. Adhere to the wave spec exactly. Spend little time on contrived gates or process and the majority of it on direct code implementation—always done through agent orchestration—and visual verification.

Any notes that are root-level glass-ui defects should be noted and batched, and then sent to the working glass-ui agent. Ensure a great deal of care is made to not interrupt that ongoing process until we've isolated large swaths of features, written fully precepts/ compliant wave addenda thereof, and targeted their exact defects hereof.

—

Our cards, our components, and the design affordances, design hierarchy, margins, paddings, dividing lines, small UI elements, should all be audited, challenged, and refined to have a sense of Aristotelian proportionality, alongside grand glass-ui suffusion and affordance. Mark, too, any superfluous, duplicative, or distracting UI elements that are rife for removal; Mark other items of the converse, whereof more affordance may be necessary.

Our prior tranche(s) were unable to properly validate and audit our frontend as it was broken pre glass UI 7.0.0—that must be carried forward (all previous items in the last many tranches) and audited now.

—

Further, our frontend structure--and this is a grand edict for ALL file directories--needs to be wildly and scrupulously analyzed: components should be COLOCATED with their sub-components, composables, skeletons, constants, etc (and this should be done recursively for nested components).

Composables that are truly module-level or global-level—and other dirs of that nature—can be found within a composables/ dir therein, but otherwise they're to be COLOCATED--same for styles, etc.

Long running dirs must and always be broken into common modules and encapsulated thereof.

Similar treatment and enforcement should be applied to all backend files, too—though abstracted and made befitting for those languages and implementations.

—

This includes deep library work: any and all deferred colocation and modularization work must be addressed--our massive explosion of module, file, and directory structure must be finally settled, with better grouping and encapsulation in both the library, and the frontend/demo components hereof; refer to glass-ui for the flattening and component structuring idioms

For example, long running directories should be pruned, or if those files are necessary, potentially agglomerated and better organized at the function/class level; long running directories should be grouped into logical sub-modules: too macro of granularity, and we get god-modules; too small of a granularity, and we get sand—we want to have a goldilocks of files and modules.

Grouped files in a module should always have their module name stripped in the file—as an abstract and generalized de-duplication mechanism: for example, if src/animation/compile/easing has sub-files of "easing-option" "easing-config", whose would be renamed as "option" and "config"

Tests should always be NOT co-located and found within source files—always displaced into a file structure isomorphic to the source, but for tests.

More code and complexity is likely not always better: be pithy, laconic, and fastidious in your analysis.

To accomplish this, a DAG of both our library and component structures must be created and ruthlessly analyzed: each and every node and edge, and cycles thereof—in batches of a dynamic and bespoke size pursuant to those graph clusters—shall be viewed thrice in the following fashion: two fresh perspectives of Fable agents, both which assume the graph structure is WRONG; the third, a Fable agent, serves as the adjudicator and proves or disproves those findings.

This should be done in an iterative and encapsulated fashion until library perfection, readability, and DIRIGIBLITY is reached.

- NO quick solutions, NO workarounds: idiomatic, gestalt approaches. This is a development product; architectural transpositions in the sake of elegance, simplicity, and performance above all are both necessary and desirable. Breaking library changes are allowed. Pruning and deletion of entire sectors and modules is granted totally IFF our findings are their vacuity or superfluity—consumer count is NOT enough.
- NO legacy code. Clean breaks: no aliases, no migration shims, no dual paths, no masking fallbacks.

—

Better utilize and leverage fable for all work of complexity, design, and auditing. Including your begotten DAG (modules and components herein AND our constellation of deps like keyframes.js, parse-that, atlas, etc), library, and component analysis for the distillation, modularization, colocation, and perfection thereof.

Further, we must properly and maximally parallelize this auditing task. Agglomerate items as you see fit.  # Tranche formulation: the post-tranche audit and next-tranche development prompt

This is NOT an implementation phase. Tranche development only. No source edits land from this prompt. The deliverable is the next tranche, fully formed: plan folder, wave specs, gates, dispositions.

## Mission

DEEPLY audit our original plan and the waves thereof, alongside all changes made hitherto, with 32 agents. Devise the path forward: audit the landed changes and the remaining plan; recapitulate our original prompts, plans, and precepts; verify every one has been addressed or carries an explicit ledger row with an owner. Form the next tranche from what the audit surfaces.

## Standing edicts

- NO quick solutions, NO workarounds: idiomatic, gestalt approaches. This is a development product; architectural transpositions in the sake of elegance, simplicity, and performance above all are both necessary and desirable.
- NO legacy code. Clean breaks: no aliases, no migration shims, no dual paths, no masking fallbacks.
- Delineate every chronically deferred item and every deferred item and fold them into this tranche as DECIDED rows: build, fold, or retire with rationale. Re-booking is forbidden. A chronic that has ridden two or more closes un-decided is a disease row, and deciding it is a wave of its own.
- Recap ALL of our prompts and requests hitherto and ensure they've been addressed. An unaddressed ask becomes a registry row with an owning wave. Silent drops are forbidden.

## Orchestration

Treat the 32 agents as a steerable budget. Assignment follows the registry, round over round; leave no lens permanently staffed.

- Open with a genuinely diverse portfolio of audit lenses: plan-vs-landed diff, gate soundness (can each gate actually fail?), gestalt read against per-mechanism PASS, the chronic and disposition ledgers, prompt-recap completeness, consumer truth (import graph and registry both), performance, accessibility, doc and canon drift, dead-code and dual-path census, cross-repo asks and consumes.
- Withhold the tranche's favored success narrative from most auditors. Independence in the early rounds keeps the fleet from converging on a confirmation of the close.
- Maintain an explicit registry of finding families, grouped by the underlying defect mechanism. Two findings that share a mechanism share a family, however differently worded. When many auditors converge on one family, redirect the excess toward underexplored lenses.
- Audit adversarially throughout. Check every "done" claim against the known close-class lies: green-over-broken, vacuous-green gates, declared captures missing on disk, masked fallbacks, alias smuggling, re-booked chronics, per-mechanism green over gestalt broken.
- Require concrete deliverables: file:line evidence, a failing probe, a reproduction, a named defect row. Reject status reports, vague optimism, and any claim that an unverified global property is "routine."
- Decompose any finding equivalent in strength to "redo the tranche" into wave-shaped rows; only at that grain can it be scheduled.
- The root agent repeatedly synthesizes, challenges, redirects, and launches new rounds. Do not stop after the first sweep. The registry is stable when two consecutive passes surface nothing new.

## Model routing and concurrency

The core model (Fable) owns orchestration, synthesis, adjudication, and every cognitively complex call; ALL design routes through Fable and the frontend design plugin (DesignSync). Opus to take the workflow fanout and the mechanical sweeps, and every fanout spawn declares its model explicitly rather than inheriting the session's. Dispatch in batches of 5-6 concurrent agents to stay under the rate wall. Use Fable judiciously for all problems of complexity, novelty, and creativity. Opus for implementation only.

## Partial progress

Track partial progress in the registry; discard nothing. Folding is a decision. Every partial, banked, or abandoned item receives a terminal disposition: folded into a named wave, banked with a named re-trigger, or retired with rationale. Counting a partial as done is the close-class lie, and it is forbidden.

## Return contract

Return only when the next tranche is fully formed: plan folder; wave specs with acceptance gates, born RED wherever the defect is live; π and DELTA obligations for every visual claim; a disposition for every chronic, every deferred item, and every prompt-recap row. An inventory of problems without the tranche that resolves them is an incomplete return. If a genuine blocker prevents full formation, return the strongest rigorously converged tranche core and its exact remaining gap.

## §B — THE OWNER'S FIVE ADDENDA (verbatim)

**Addendum 1 (historical lens):** "Too, we should look to how our library was structured before the massive explosion in complexity--many of our new features are overfit and superfluous. This is from a year+ ago we should compare. What were we doing right there? What are we providing now that's genuinely better, tighter, and more optimized? Another thrice pass should be taken at this."

**Addendum 2 (regex abrogation + drops archaeology):** "All regex-based parsing should likely be entirely abrogated: for both value.js and keyframes.js. All previous and heretofor features that have been pruned out, like the above, which were genuine, should be dug within a deep archealogy of our last many variants, too--what have we dropped? And what rightfully so? What unjustly so? The gamut mapping was a major loss, for example, as was the ill-defined and slow parser."

**Addendum 3 (e2e challenge + kf pre-4.0):** "The e2e oracle fleet is likely to be entirely abrogated due to being a contrived mess--challenge this. The demo could and should also be more tightly structured and de-duplicated in a similar fashion--but that's for the tranche itself to divine and find. We'd like to look at pre 4.0, too, for kf."

**Addendum 4 (kf gates/tests challenge):** "Same in kf. Most of our gates, proof:, e2e, etc are overfit pieces of nonsense. Same for most of our tests, though this to to be challenged. Fable. For these workflow agents."

**Addendum 5 (all-Fable routing):** "We ar to use Fable for all agents going forward in this session and audting. Ensure that we're not using Opus."

> The panels EXECUTED addenda 1–4's challenges pre-formation (results in the handoff
> packet §3–§8); the formation inherits those verdicts as adjudicated rows, not open
> questions. Addendum 5 binds every spawn (see the standing law at top).

## §C — BINDING AMENDMENTS (adjudicated; do not re-litigate blind)

C1. **Phases.** §A composes a VISION segment (execution character of the FORMED
tranche) and a FORMATION block (binds THIS run: audit + formation, no edits). Every
edict is labeled by phase in the wave specs.

C2. **Parser facts (handoff §3).** The extant value parser is an UNMEASURED regex
rewrite born at the v4 cut `164343c1`, which deleted the MEASURED
parse-that+`balancedText` hybrid AND its benches. "tape" is a deleted Rust runtime,
slower than direct-to-struct — inadmissible; the real parse-that TS lever is
mutable-ParserState/zero-alloc combinators. The bench (R2′) is three-way and
greenfield: regex-cleanup vs resurrected byte-scanner vs parse-that prototype;
readability is a separate table-solvable axis; adoption is owner-ratified on measured
MB/s + allocs. The regex-abrogation ruling condemns `src/css/{grammar,stylesheet,
timeline,syntax}.ts`. kf-side, the ONLY parsing residual is the easing name-table
regex (`easing.ts:30,39`; its `easing-serialize.ts:20` twin is emit-side duplication,
not a parser) — the split-parsing architecture is ALREADY achieved; LOCK it by census.

C3. **The drops archaeology is pre-run (handoff §4/§6).** The double gamut loss is
verified two-sided; the RESTORE ledger (R1→R11, gamut lives in VALUE) is formation
input. UNJUSTLY-DROPPED rows become RESTORE waves; RIGHTLY-DROPPED rows get one-line
tombstones, never re-litigated. SCI-1 is DECIDED SHIP-4.1.x — inherit, extend (R3),
never re-open.

C4. **The overfit adjudication is pre-run (handoff §7).** Adopt the zone disposition
tables. OWNER-DECISION rows (waapi, scroll-sampler, svg/morph, orchestration/timeline,
load-engine apparatus) go to the owner AT FORMATION with their recorded deliberate-KEEP
provenance — they are not unilateral prunes. Zone-orphaned tests bind to zone verdicts.
The e2e fleet verdict (ABROGATE for value.js; ~500-LOC survivor set → the demo
tranche) and the kf gates program (minimal-seven + subtraction + wiring) are
adjudicated; the formation writes their WAVES, not their re-audits.

C5. **Breaking changes are priced (handoff §5).** ONE co-land boundary; kf's EXACT
value pin is the sole hard install break; glass peers are optional (warnings); value's
own manifest value→kf→value cycle bumps in lockstep AND gets an adjudication row; the
active atlas is `p/totality` v7.0.0 (the standalone `master` checkout is a STALE trap
— G0′: pin tree+HEAD on every cross-repo claim).

C6. **The kf fence pack (handoff §2)** binds every kf-touching wave: TimingFunction
home (3 atlas chase sites), exports `.`+`./engine` + 44-key mirror, immutable 6.0.0 /
4.0.0, the depcruise `internal/` config key moves with any rename, the R4′ flatten
checklist born-RED at every anchor. **Structure governance (G5):** kf structure waves
AMEND the ratified LT blueprint + EXTEND proof:structure — never a parallel second
structure authority — naming the superseded rulings (LT-10, LT-16) explicitly;
refutation amends the charter, silence re-litigates it.

C7. **The standing silent-drop law (H8′)**: capability-preservation gate born-RED on
any dropped public symbol across a major + a mandatory DROPS section
(RIGHTLY/UNJUSTLY/UNCLEAR + tombstone) in every major-cut wave spec + a surface-diff
check that fails on undeclared deletions.

C8. **Ownership (R10).** This tranche DIRECTS kf library items as specs + bounded
dispatches into kf's `docs/tranches/V/coordination/` inbox; the kf successor
implements; kf's demo/UI corpus stays kf-successor-owned (its FOLD-FORWARD waves W7/W8/
W9-landing/W10-remainder/W11/W13 + the 15-row marks register). Direct cross-repo edits
require an explicit owner grant.

C9. **Thrice-loop bounds (R9).** Two fresh Fable skeptics assuming WRONG + one Fable
adjudicator who PROVES with own on-disk evidence; convergence = two consecutive clean
passes per cluster; ≤3 iterations per cluster before owner escalation.

C10. **New lenses (R12).** Malformed-input fuzzing; one fleet-wide
allocation-measurement methodology; DAG from depcruise (tool-derived, then adjudicated);
the value.js `api/` backend (13k LOC, never audited); the value demo (31k) restructure
per addendum 3.

## §D — THE FORMATION DOCKET (what the 32-agent fleet must produce)

Wave-shaped, from the adjudicated set — the formation refines, schedules, and gates
these; it does not re-derive them:

1. **Parser bench trio** (R2′/C2): baseline infra + three candidates + owner
   ratification row. Born-RED (no bench exists).
2. **Regex abrogation execution plan** for the four condemned css/ files, gated on 1.
3. **The RESTORE waves** (handoff §6 R1→R4 first; R5–R11 scheduled or banked with
   re-triggers).
4. **Gamut policy DECIDE row** (R6′) + WPT vector gate birth.
5. **subpaths/ dissolution** (H2′) + decompose prune + quantize demotion (H7′).
6. **kf zone dispositions** → owner-decision docket + prune waves + shrink waves
   (H3′/H4′), each with its bound test disposition; dispatched as SPECS to kf per C8.
7. **kf flatten + internal/ dissolve** (R4′ checklist) — directed spec, kf-successor
   implemented.
8. **Parsing-boundary census LOCK gate** (R5′) + the easing name-table row.
9. **Tests-isomorphism gates** — born-RED waves BOTH repos; value structure gate
   CREATE (R14′).
10. **e2e abrogation wave** (value) + survivor migration row to the demo tranche;
    kf gates subtraction + wiring waves (H6′).
11. **Co-land boundary protocol wave** (R3′) + chase-site ledgers + the value-manifest
    cycle adjudication row.
12. **Capability-preservation gate birth** (both repos) + the DROPS-section law into
    precepts (C7).
13. **The demo/frontend program** (value-focused per §A): Aristotelian-proportionality
    audit, colocation edict enforcement, glass-defect batching to the glass agent —
    with π/DELTA obligations for every visual claim.
14. **Prompt-recap registry**: every §A/§B ask → a row with an owning wave; the
    unaddressed become registry rows. Silent drops forbidden.
15. **Chronic/deferred fold**: every kf FOLD-FORWARD row and value carry-row receives
    a terminal disposition (build/fold/retire) — re-booking forbidden.
16. **CSS-spec-completeness census** (owns the "total and complete specification
    coverage" ask): born-RED coverage census of value's grammar/color/timeline
    surfaces vs the July-2026 stabilized spec set (Color 4/5, HDR, stabilized
    chrome-experimental features); gaps become spec-coverage waves.
17. **The structural-conventions pack** (standing rules for every restructure wave):
    module-name stripping (`easing-option`→`option`); glass-ui as the REFERENCE MODEL
    for flattening/component idioms; composables/styles colocation (only truly
    module/global composables in `composables/`, all else colocated, recursively).

## §E — INGESTION SET

Handoff packet §10, verbatim — read before the first spawn. Pin every tree you read
(G0′): value `db77dbd8`+, kf `c2c8915f`, glass 7.0.0 `4ab12128`, atlas `p/totality`.

## §F — RETURN CONTRACT

The owner's, verbatim (§A "Return contract"), plus: every C-row above appears in the
formed tranche as either a wave, a gate, or an owner-decision docket row — zero
silent drops, measured against §D's seventeen items.
