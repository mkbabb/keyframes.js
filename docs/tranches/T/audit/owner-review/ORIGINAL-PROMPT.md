# THE ORIGINAL PROMPT — the owner live-review verdict + the Tranche T development directive (2026-07-04, verbatim)

> Re-ingested post-compaction per the owner's instruction. Screenshot temp paths are dead; the
> mapping to the preserved copies (docs/tranches/T/audit/owner-review/shots/NN.png) is inline as
> [→ shots/NN]. The itemized distillation lives in VERDICT.md; THIS file is the verbatim source.

---

'…/Screenshot 2026-07-04 at 20.20.27.png' [→ shots/01] cube does not render fully.

'…/Screenshot 2026-07-04 at 20.20.46.png' [→ shots/02] --remove this crap.

'…/Screenshot 2026-07-04 at 20.21.11.png' [→ shots/03] --the original hero animation is totally broken and should uplift each individual char.

'/Users/mkbabb/Downloads/Screenshot 2026-07-04 at 20.20.58.png' [→ shots/04] --the docks are both blurry, broken, janky messes. '…/Screenshot 2026-07-04 at 20.21.46.png' [→ shots/05] Remove this as well.

'…/Screenshot 2026-07-04 at 20.21.59.png' [→ shots/06] what's this superfluous dividing line when on the home screen? And the play button should be the first element.

http://localhost:5180/#/amiga is a broken mess and does not properly interleave and stack animations.

'/Users/mkbabb/Downloads/Screenshot 2026-07-04 at 20.23.10.png' [→ shots/07] remove the surrounding pane--it's superlfuous.

'…/Screenshot 2026-07-04 at 20.23.35.png' [→ shots/08] remove all alements like this. '…/Screenshot 2026-07-04 at 20.23.47.png' [→ shots/09]

All of the dock animations are ruined.

http://localhost:5180/#/square--what even happened to this--totally a mess an unusable>

'…/Screenshot 2026-07-04 at 20.24.42.png' [→ shots/10] superfluous nonsense. '…/Screenshot 2026-07-04 at 20.25.02.png' [→ shots/11] Remove all of this. '…/Screenshot 2026-07-04 at 20.25.17.png' [→ shots/12] we should just have the easing balls previewed here. '…/Screenshot 2026-07-04 at 20.25.32.png' [→ shots/13] remove this button.

Most of the fonts on the site are not right at all, like the sub-header hero and dropdowns are mostly wrong.

Most of this page looks awful and needs to be re-designed with glass-ui in mind. I don't like this latent red theme.

http://localhost:5180/#/spring '…/Screenshot 2026-07-04 at 20.26.33.png' [→ shots/14]

When we have a page with ONE option, like easing, spring, etc--the dock should not show an extra "spring" or "easing" item--it should elide that intelligently if there's only ONE option. Same for animations--that should not be displayed if an animation only has ONE sub-animation.

The performance on every single page is god awful and needs to be rethought from the ground up. '…/Screenshot 2026-07-04 at 20.28.16.png' [→ shots/15] '/Users/mkbabb/Downloads/Screenshot 2026-07-04 at 20.28.13.png' [→ shots/16] --what the fuck even is this? If we're to have a keyframes option, it should be like the core cube/amiga/square (how it used to be) with sub options for the controls, keyframes, timeline, etc. wtf?

http://localhost:5180/#/motion-path barely works.

http://localhost:5180/#/morph does not work at all '…/Screenshot 2026-07-04 at 20.30.08.png' [→ shots/17]

There's this strange light that follows the cursor, but only partially--if you're going to implement this, it should be done right.

http://localhost:5180/#/compose--just straight up remove this crap.

motion-path, morph, and compose likely need to just be pruned. Square used to have a proper keyframes, controls, etc section but that was removed?

'…/Screenshot 2026-07-04 at 20.31.31.png' [→ shots/18]

The hero should be lower on the page, more towards the centre--it's OK if it sits a bit ontop of the cube.

Ensure that ALL of our fonts, sizes, etc are consistent and that we're properly leveraging glass-ui components for items. Why do we not properly have a keyframes, controls, etc view for the other sub-animations? It's like we forgot about that facility entirely? Further, what the fuck are most of these items? /Users/mkbabb/Programming/keyframes.js/demo/@/components/custom/KfPillTabs.vue?? KF? Pills? Why aren't these just glass-ui components?

/Users/mkbabb/Programming/keyframes.js/demo--this needs to be entirely re-structured from first-principles. Components should be structured and properly colocated into sub-components, composables, skeletons, constants, etc--and recursively so. Long running dirs shoudl be encapsulated into modules when befitting. /Users/mkbabb/Programming/keyframes.js/demo/@/styles--what the fuck is this?

Analyze the extant codebase for any legacy code, deprecated code, temporary workarounds, fallback or fall-through behavior: in all instances, either excise the code entirely, or fail explicitly therein: no silent or graceful handling unless befitting.

This should be a fastidious and surgical refactor: thoroughly identify all areas herein with legacy behavior and get everything explicitly migrated to whatever new API—or facility—present.

Divine an approach to achieve better encapsulation, consistency in service boundaries, dependency injection patterns, and pipeline orchestration.

NO god modules: break large files (>500 lines especially) into smaller, cohesive sub-modules when appropriate and expedient; leverage better and modern patterns.

NO workarounds, NO fallbacks, NO special cases. No effusive dynamicsim. NO nested imports. NO test files in src files.

NO duplicated effort: DRY. KISS.

Run linting and type checking to validate your changes at every interval.

Assay the frontend components herein to look for areas of better encapsulation, consistency in composables, useX's, state management and store management, etc.

We should break large components (>500 lines especially) into smaller sub-components when befitting; leverage better and modern Vue patterns. Components and composeables should be colocated together when befitting in functionality. Complex components should be structured into sub-component dirs with components, composeables, constants, skeletons, thereof, if needed.

Logical grouping of files, modules, components, into directories without contrivance or over-engineering. KISS.

Audit for deeply nested or brittle selector usage insofar as CSS or reactivity.

Analyze for non-idiomatic tailwind or tenuous, brittle, bespoke styling in therein, too. Ensure that any style changes are perfectly isomorphic thereto, unless HIGHLY befitting otherwise. For styling focus on:

(1) non-idiomatic Tailwind usage
(2) monolithic/global stylesheet patterns that should be colocated or component-scoped
(3) deprecated/archaic CSS
(4) fragile rules (magic numbers, brittle `calc()/min()/max()` chains, viewport-unit traps, z-index coupling, browser-specific breakage)—unless highly befitting

Ensure that we're using idiomatic tailwind applies for style, animations, colors: we should have a localized area that defines all of our design idioms—but still leverages proper colocation. Ensure design cohesion within our chosen aesthetic.

wtf is /Users/mkbabb/Programming/keyframes.js/demo/app/chrome?

wtf is 90% of the junk in /Users/mkbabb/Programming/keyframes.js/demo/app? Most of these should be pruned.

Why aren't these properly composed into sub-components when needed? /Users/mkbabb/Programming/keyframes.js/demo/scenes

The structure of /Users/mkbabb/Programming/keyframes.js/demo/@ is totally half baked and inconsistent.

Leverage proper, and the latest, glass-ui components for all items when befitting. Delinate our gaps, and glass-ui's gaps--glass-ui is in active development with BG/BH forthcoming.

DEEPLY audit with 32 agents in parallel our original plan and waves thereof, alongside all changes made herein.

Devise a path forward: audit the hitherto made changes and the remaining plan; recapitulate our original prompts, plans, and precepts: NO quick solutions, NO workarounds: idiomatic, gestalt approaches. This is a development product, architectural transpositions in the sake of elegance, simplicity, and performance above all are both necessary and desirable.

NO legacy code.

Delineate any chronically deferred items and fold them into this tranche.

Delineate any deferred items and fold them into this tranche.

Recap ALL of our prompts and requests hitherto and ensure they've been addressed.

This is NOT an implementation phase. Tranche development only.

Use your core model for orchestration, design (all design must be routed using Fable and the frontend design plugin), synthesis, but defer to Opus or Sonnet for workflow fanout. Use batches of three agents in parallel to avoid rate limit walls.

---

**Post-compaction amendment (the compaction message, 2026-07-04):** "Re-ingest our exact original
prompt thereafter, and then proceed, keep the extant running, too. You'll likely see a few gaps
hereupon compaction. **Tranche development and prototyping only.**" — PROTOTYPING is authorized
(the S dev-phase probe pattern: kept-worktree live prototypes, p01–p12/pass-3 style; still no
landing on the impl branch).
