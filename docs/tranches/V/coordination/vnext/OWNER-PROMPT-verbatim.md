# The owner's V-next prompt (verbatim, 2026-07-18) — for the value.js-owned tranche

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
