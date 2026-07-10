# Tranche U — THE ORIGINAL PROMPT (owner, mkbabb, 2026-07-09, verbatim)

> Preserved verbatim per the T evidence discipline (T's ORIGINAL-PROMPT.md pattern).
> Received mid-T.Z-close (the deploy-of-record run in flight; 5.2.0 on npm).

---

Alright, that runner is entirely superfluous--our CI needs to be trimmed substantially (most of it's likely tautological).

No more deferrals. This is now tranche development, with an emphasis on all of the above, plus a grand restructuring of our entire library and demo (all subcomponents, etc).

DEEPLY audit with 32 agents in parallel our original plan and waves thereof, alongside all changes made herein.

Devise a path forward: audit the hitherto made changes and the remaining plan; recapitulate our original prompts, plans, and precepts: NO quick solutions, NO workarounds: idiomatic, gestalt approaches. This is a development product, architectural transpositions in the sake of elegance, simplicity, and performance above all are both necessary and desirable.

NO legacy code.

Delineate any chronically deferred items and fold them into this tranche.

Delineate any deferred items and fold them into this tranche.

Recap ALL of our prompts and requests hitherto and ensure they've been addressed.

This is NOT an implementation phase. Tranche development only.

Use your core model for orchestration, design (all design must be routed using Fable and the frontend design plugin), synthesis, but defer to Opus or Sonnet for workflow fanout. Use batches of three agents in parallel to avoid rate limit walls.

Further, our frontend structure--and this is a grand edict for ALL file directories--needs to be wildly re-structured: components should be COLOCATED with their sub-components, composables, skeletons, constants, etc (and this should be done recursively for nested components).

Composables that are truly module-level or global-level—and other dirs of that nature—can be found within a composables/ dir therein, but otherwise they're to be COLOCATED--same for styles, etc.

Long running dirs must and always be broken into common modules and encapsulated thereof.

Similar treatment and enforcement should be applied to all backend files, too—though abstracted and made befitting for those languages and implementations.

Colocation, colocation, colocation. And performance is our grand edict.

Further, what of value.js, parse-that, too--has parse-that been driven? value.js' most recent tranche is in active development, note.

---

## The immediately-binding readings (fixed at receipt, before the audit fleet)

1. **CI TRIM** — the Linux runner is ruled superfluous; the gate roster (227 proof:*
   keys vs the declared 120 ceiling, itself a born-RED backlog row) is presumed
   substantially tautological. U owns a CI/gate-apparatus reduction band.
2. **NO MORE DEFERRALS** — every deferred and chronically-deferred item across all
   prior tranches folds INTO U. The "honest defer" device is terminated for U's scope.
3. **THE GRAND RESTRUCTURING** — library AND demo, all subcomponents: recursive
   colocation (sub-components, composables, skeletons, constants, styles colocated;
   composables/ dirs only for true module/global members), long dirs → encapsulated
   common modules, the backend (library/scripts) treatment abstracted befittingly.
   Architectural TRANSPOSITIONS for elegance, simplicity, performance are necessary
   and desirable. NO legacy code.
4. **PERFORMANCE is the grand edict** (with colocation).
5. **DEVELOPMENT ONLY** — this tranche produces the corpus (audit → synthesis →
   charter + waves). Implementation is NOT authorized until the owner says so.
6. **Orchestration spec** — Fable: orchestration, design (with the frontend-design
   plugin), synthesis. Opus/Sonnet: workflow fan-out. Batches of 3 agents.
7. **Constellation** — value.js's own tranche is IN ACTIVE DEVELOPMENT elsewhere:
   U charters the kf consume-edge + coordination letter only. parse-that's driven
   state (1.0.0; kf's direct dep removed at Q) is to be verified by audit.
