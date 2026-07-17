# Tranche V — the owner's formation prompt (verbatim, 2026-07-16)

> Captured exactly as received. This is the charter seed for Tranche V
> formation. Every ask herein must appear in `PROMPT-RECAP-V.md` with an
> owning wave or a terminal disposition.

---

For the forthcoming tranche you'll beget, and what's been done adhoc hereof in
our glass-ui, value.js coordination. This includes deep library work (our
deferred colocation and modularization must be addrseed--our massive explosion
of module and directory structure must be finally settled, with better grouping
and encapsulation in both the library and the demo components hereof--refer to
glass-ui for the flattneing and component structuring idioms)

For example, /Users/mkbabb/Programming/keyframes.js/src/animation/compile/easing--the
modules therein should have their prefixes removed--no "easing-option"--just
"option"; why is
/Users/mkbabb/Programming/keyframes.js/src/animation/compile/compiled-frame.ts
split out into its own file, and then
/Users/mkbabb/Programming/keyframes.js/src/animation/compile/frame-compiler.ts
is quite massive--should this not be in a module, etc? All of our files should
be ruthlessly inspected for a better, more idiomatic, more logically grouped
file structure that's more cohesive and not so fragmented. No godmoules.

## Tranche formulation: the post-tranche audit and next-tranche development prompt

This is NOT an implementation phase. Tranche development only. No source edits
land from this prompt. The deliverable is the next tranche, fully formed: plan
folder, wave specs, gates, dispositions.

### Mission

DEEPLY audit our original plan and the waves thereof, alongside all changes
made hitherto, with 32 agents. Devise the path forward: audit the landed
changes and the remaining plan; recapitulate our original prompts, plans, and
precepts; verify every one has been addressed or carries an explicit ledger row
with an owner. Form the next tranche from what the audit surfaces.

### Standing edicts

- NO quick solutions, NO workarounds: idiomatic, gestalt approaches. This is a
  development product; architectural transpositions in the sake of elegance,
  simplicity, and performance above all are both necessary and desirable.
- NO legacy code. Clean breaks: no aliases, no migration shims, no dual paths,
  no masking fallbacks.
- Delineate every chronically deferred item and every deferred item and fold
  them into this tranche as DECIDED rows: build, fold, or retire with
  rationale. Re-booking is forbidden. A chronic that has ridden two or more
  closes un-decided is a disease row, and deciding it is a wave of its own.
- Recap ALL of our prompts and requests hitherto and ensure they've been
  addressed. An unaddressed ask becomes a registry row with an owning wave.
  Silent drops are forbidden.

### Orchestration

Treat the 32 agents as a steerable budget. Assignment follows the registry,
round over round; leave no lens permanently staffed.

- Open with a genuinely diverse portfolio of audit lenses: plan-vs-landed diff,
  gate soundness (can each gate actually fail?), gestalt read against
  per-mechanism PASS, the chronic and disposition ledgers, prompt-recap
  completeness, consumer truth (import graph and registry both), performance,
  accessibility, doc and canon drift, dead-code and dual-path census,
  cross-repo asks and consumes.
- Withhold the tranche's favored success narrative from most auditors.
  Independence in the early rounds keeps the fleet from converging on a
  confirmation of the close.
- Maintain an explicit registry of finding families, grouped by the underlying
  defect mechanism. Two findings that share a mechanism share a family, however
  differently worded. When many auditors converge on one family, redirect the
  excess toward underexplored lenses.
- Audit adversarially throughout. Check every "done" claim against the known
  close-class lies: green-over-broken, vacuous-green gates, declared captures
  missing on disk, masked fallbacks, alias smuggling, re-booked chronics,
  per-mechanism green over gestalt broken.
- Require concrete deliverables: file:line evidence, a failing probe, a
  reproduction, a named defect row. Reject status reports, vague optimism, and
  any claim that an unverified global property is "routine."
- Decompose any finding equivalent in strength to "redo the tranche" into
  wave-shaped rows; only at that grain can it be scheduled.
- The root agent repeatedly synthesizes, challenges, redirects, and launches
  new rounds. Do not stop after the first sweep. The registry is stable when
  two consecutive passes surface nothing new.

### Model routing and concurrency

The core model (Fable) owns orchestration, synthesis, adjudication, and every
cognitively complex call; ALL design routes through Fable and the frontend
design plugin (DesignSync). Opus and Sonnet take the workflow fanout and the
mechanical sweeps, and every fanout spawn declares its model explicitly rather
than inheriting the session's. Dispatch in batches of three concurrent agents
to stay under the rate wall.

### Partial progress

Track partial progress in the registry; discard nothing. Folding is a
decision. Every partial, banked, or abandoned item receives a terminal
disposition: folded into a named wave, banked with a named re-trigger, or
retired with rationale. Counting a partial as done is the close-class lie, and
it is forbidden.

### Return contract

Return only when the next tranche is fully formed: plan folder; wave specs
with acceptance gates, born RED wherever the defect is live; π and DELTA
obligations for every visual claim; a disposition for every chronic, every
deferred item, and every prompt-recap row. An inventory of problems without
the tranche that resolves them is an incomplete return. If a genuine blocker
prevents full formation, return the strongest rigorously converged tranche
core and its exact remaining gap.

---

Further, our frontend structure--and this is a grand edict for ALL file
directories--needs to be wildly re-structured: components should be COLOCATED
with their sub-components, composables, skeletons, constants, etc (and this
should be done recursively for nested components).

Composables that are truly module-level or global-level—and other dirs of that
nature—can be found within a composables/ dir therein, but otherwise they're
to be COLOCATED--same for styles, etc.

Long running dirs must and always be broken into common modules and
encapsulated thereof.

Similar treatment and enforcement should be applied to all backend files,
too—though abstracted and made befitting for those languages and
implementations.

Ensure that extreme parsimony and fastidious care is made for every
implementation: seek KISS-forward solutions that reduce complexity and suffuse
fewer lines of code: consider the greater library and component picture. Spend
little time on contrived gates or process and the majority of it on direct
code implementation—always done through agent orchestration—and visual
verification.

All of our gates, proof, meta scripts, should be ruthlessly critiqued. Most of
our tests as well. Prune the superfluity.

Any notes that are root-level glass-ui defects should be noted and batched,
and then sent to the working glass-ui agent. Ensure a great deal of care is
made to not interrupt that ongoing process until we've isolated large swaths
of features, written fully precepts/ compliant wave addenda thereof, and
targeted their exact defects hereof. Be cognizant of that agent's context
window and task at hand: they're in the middle of implementing the BI/P
tranches.

Finally:

Ecoute-moi:

Our cards, our components, and the design affordances, design hierarchy,
margins, paddings, dividing lines, small UI elements, should all be audited,
challenged, and refined to have a sense of Aristotelian proportionality,
alongside grand glass-ui suffusion and affordance. Mark, too, any superfluous,
duplicative, or distracting UI elements that are rife for removal; Mark other
items of the converse, whereof more affordance may be necessary.

Mark: glass-ui and sci-report and atlas are in ACTIVE execution right now:
establish bi-directional communication with them. Finally, value.js will have
a similar tranche development and auditing process: coordinate precisely with
them.
