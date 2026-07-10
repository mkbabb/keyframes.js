# Pass 1 Research — web-ts-granularity

Lane: **web-ts-granularity** (Track B, 5-step loop, step 1, pass 1)
Scope: 2025/2026 state of the art on TypeScript library MODULE GRANULARITY — the
carve-vs-inline decision, barrel-file costs, deep-import vs subpath idioms, and how
the major libraries size their modules. Feeds OD-U16 (granularity, both directions)
and OD-U15 (CLAUDE.md removal → inline docs). READ-ONLY except this file.

---

## 0. The question, framed against U

The owner mandate (OD-U16) is **bidirectional**: long files break into module dirs
(named example `compile/easing-option.ts` → `compile/easing/`), and "absurdly small
modules should be abrogated for superfluity and instead made inline." So this lane
must produce rules for BOTH bounds, not just the fashionable "split big files" half.

Grounding note that reshapes the whole exercise: the owner's own named carve example,
`src/animation/compile/easing-option.ts`, is **56 lines** (`wc -l`). That is not a
"long file" by any LOC metric. So the carve rationale the spec adopts CANNOT be
LOC-driven — it must be **conceptual-cohesion-driven** (a file carves when it holds
two+ genuinely distinct sub-concepts, regardless of length). This is the single most
important calibration for the whole granularity ruling: reject the "100-200 lines"
folk rule the low-tier web sources repeat.

Codebase state today (evidence): `find src/animation -name index.ts` = **21 barrels**;
four are ≤15 lines — `orchestration/drag/index.ts` (13), `svg/index.ts` (14),
`constants/index.ts` (15), `engine/css/index.ts` (15) — the prime OD-U16 "inline"
candidates. The package-edge barrel `src/animation/index.ts` is 310 lines (the honest
public API "in").

---

## 1. Barrel files: the 2025/2026 verdict is settled, and it is "not internally"

The single strongest, most consistent finding across every credible source: **barrel
files (re-export `index.ts`) are harmful as INTERNAL structure and correct only at the
PUBLISHED package edge.** This is now first-party bundler guidance, not just blog
opinion.

**First-party (Vite, official):** "If possible, you should avoid barrel files and
import the individual APIs directly, e.g. `import { slash } from './utils/slash.js'`"
— the reason given is that importing one API from a barrel "forces loading all files
within it, even when you only need one API, resulting in slower page loads."
(https://vite.dev/guide/performance)

**Why it hurts, mechanically:**
- **Tree-shaking defeat / bundle bloat.** A barrel import pulls the whole re-export
  graph; unused exports survive when any barrel member has side effects. Measured:
  MUI `Button` through a barrel nearly *doubled* bundle size; wildcard (`export *`)
  re-exports levied a ~70% server-side tax, named re-exports still ~16% client-side.
  (https://krishnavadlamudi44.medium.com/the-index-ts-dilemma-balancing-convenience-and-performance-in-typescript-projects-85e9dd4fc18f)
- **Dev-server / HMR / test blowup.** Every import of one symbol makes the graph
  fetch+transform every barrel member. Vitest: 2.61s → 1.32s just by dropping barrels;
  ~85% fewer module transforms. Vite HMR: barrels make each file *look* like it depends
  on the whole folder, so editing one utility invalidates unrelated siblings.
  (https://vitest.dev/guide/profiling-test-performance,
  https://dev.to/tassiofront/barrel-files-and-why-you-should-stop-using-them-now-bc4)
- **Circular dependencies.** A file that imports from its own folder's barrel, which
  re-exports that file, forms `a.ts → index.ts → a.ts`. JS tolerates it; "bundlers
  crash with the weirdest of error messages." Auto-import tooling creates these
  silently. (https://tkdodo.eu/blog/please-stop-using-barrel-files,
  https://github.com/angular/angular-cli/issues/7369)

**The hard field numbers (the load-bearing citations):**
- **Atlassian**, removing internal barrels across their monorepo: TypeScript
  highlighting **+30%**, local unit tests **~50% faster (up to 10×)**, **75% reduction
  in build minutes per commit**, 88% fewer tests run per typical build. Their adopted
  rule: prohibit *new* barrels, codemod existing barrel-imports to direct imports,
  delete dead barrels. "The best optimisation is the complexity you choose not to
  maintain."
  (https://www.atlassian.com/blog/atlassian-engineering/faster-builds-when-removing-barrel-files)
- **tkdodo** (React Query maintainer): a Next.js page loading **11k modules → 3.5k
  (−68%)**, 5–10s startup, purely from internal barrel removal. His one carve-out:
  "barrels are necessary [only] when you are writing a library" — the single
  `package.json` entry point.
- **Next.js** `optimizePackageImports`/modularizeImports exists *because* barrels are
  slow, and it silently **stops optimizing** the moment a barrel contains any non-re-
  export statement (`export const foo = 5`). (https://tkdodo.eu/blog/please-stop-using-barrel-files)

**Does Rolldown/Vite 8 make barrels safe again? No.** Rolldown's *lazy barrel
optimization* compiles only the imported members (real case: 2,986 → 250 modules,
~65ms → ~28ms). But the docs are explicit on the residue: (a) the **resolve step still
runs for every re-export** — `@mui/icons-material` with 10k+ re-exports still dominates
build time; (b) **any side effect** in the barrel disables it entirely; (c) unmatched/
star imports force loading *all* re-exports; (d) entry files and dynamic imports load
everything. Rolldown's own remedy is `@rolldown/plugin-transform-imports` to *rewrite
imports at source and bypass the barrel*. Verdict: the optimization mitigates the
tree-shaking half for well-behaved barrels; it does NOT redeem barrels as internal
structure, and the resolve/side-effect/circular hazards persist.
(https://rolldown.rs/in-depth/lazy-barrel-optimization,
https://voidzero.dev/posts/announcing-rolldown-1-0)

**The lone dissent, weighed and rejected for internal use:** a 2026 "Why I prefer
barrel files" piece exists (https://codecompose.com/articles/why-i-prefer-barrel-files-in-2026/),
but its case is DX/ergonomics for *application* code and it does not rebut the measured
build/HMR/tree-shaking costs. It does not move the library-authoring verdict.

**Net for U:** kf's 21 internal barrels are exactly the structure every source says to
minimize. But kf is a *library*, so the answer is not "delete all barrels" — it is
"barrels EARN their place only where they (i) constitute a published entry point, or
(ii) are the value.js-boundary contract that the LIGHT/HEAVY split is built on." Every
other barrel is dev-server/HMR/test tax with no consumer-visible benefit.

---

## 2. Subpath exports beat deep imports — encapsulation is the modern default

The consistent 2025 idiom for a library exposing more than one surface: **multiple
named entry points via `package.json` `exports`, each with its own internal barrel** —
NOT one root mega-barrel, and NOT letting consumers deep-import arbitrary internal
files.

- The `exports` field **encapsulates**: once declared, all non-listed subpaths throw
  `ERR_PACKAGE_PATH_NOT_EXPORTED`, giving a hard public/private boundary the compiler
  and Node both enforce.
  (https://nodejs.org/api/packages.html, https://hirok.io/posts/package-json-exports)
- Guidance: "For shared packages that bundle together several unrelated modules, prefer
  multiple entry points via the exports field over a single root barrel. Consumers
  import from `@myorg/shared/logger` … each entry point has its own barrel internally."
  (https://dev.to/thepassle/a-practical-guide-against-barrel-files-for-library-authors-118c)
- Correctness constraints for the exports map: **`types` first** in each conditional
  block; a subpath with an `import` condition needs a `require` too if you ship CJS;
  consumers need `moduleResolution: node16|nodenext|bundler`; validate the *published*
  shape with **`@arethetypeswrong/cli` (attw)**.
  (https://dev.to/gabrielanhaia/the-packagejson-exports-map-is-the-most-important-file-youre-writing-wrong-5a0o)

kf already lives this: exactly two entries (`.` LIGHT + dynamic loader, `./engine`
HEAVY static mirror), value.js-free vs value.js-bearing. That is the SOTA shape — the
granularity work must NOT proliferate entry points; it should keep the two-entry
contract and reserve barrels for those two surfaces plus the internal zone boundaries
that back them.

---

## 3. How the reference libraries actually size modules

- **Zod v4** — solved granularity by **package fission at the versioned subpath**, not
  by internal barrels. `zod/v4/core` (`@zod/core`) is a shared, function-first sub-
  package (no `.optional()` chain methods — plain top-level functions over base
  classes) that undergirds both Zod Classic and the slimmer Zod Mini; it is published
  as a *permalink* subpath meant to be extended, not deep-imported casually. Lesson:
  when two surfaces share a core, extract the core as its own entry with a flat
  function API, don't cross-import internals.
  (https://zod.dev/packages/core, https://github.com/colinhacks/zod/issues/4371)
- **Vue core** — pnpm monorepo, one package per genuine boundary
  (`@vue/reactivity`, `@vue/runtime-core`, `@vue/compiler-core`, `@vue/shared`),
  each independently importable, `runtime-core` importing `reactivity` as a real dep so
  there is a single instance. Granularity is drawn at *architectural seams* (reactivity
  vs runtime vs compiler vs shared helpers), and each package is internally many small
  cohesive files, not one blob. Lesson: the split axis is capability/layer, and the
  "shared" tier is a deliberate leaf, mirroring kf's `internal/` leaf tier.
  (https://github.com/vuejs/core/tree/main/packages,
  https://deepwiki.com/vuejs/core)
- **Vite/Rolldown** — dogfood their own guidance: avoid barrels, be explicit with
  import paths (`import './Component.jsx'`), move hot resolution to native (Rust) code.
  A bundler team choosing "no internal barrels" for their own repo is the strongest
  possible signal. (https://vite.dev/guide/performance)

Convergent pattern across all: **module boundaries follow conceptual/architectural
seams and are surfaced through the `exports` map; internal files stay small and
cohesive but are wired by direct relative imports, not re-export barrels.**

---

## 4. The small-module / over-fragmentation bound (the OD-U16 second direction)

The web is thin and low-quality on "too small" (searches drown in filesystem
fragmentation noise), but the design-principle consensus is clear and usable:

- **Cohesion is the metric, not line count.** "Related parts of code should be in the
  same module." SRP applied to the extreme — one function per file — is named as
  *over-fragmentation* that "undermines cohesion and creates maintenance challenges"
  (the yo-yo problem: structure hard to follow because it is excessively fragmented).
  (https://dev.to/alvesjessica/cohesion-in-software-design-559l,
  https://en.wikibooks.org/wiki/Introduction_to_Software_Engineering/Architecture/Anti-Patterns)
- A module with **one caller and no independent conceptual identity** is a candidate to
  inline: it adds a file, an import edge, and (if barrelled) a transform hop, for zero
  cohesion benefit. This is exactly kf's ≤15-line barrels: `drag/index.ts`,
  `svg/index.ts`, `constants/index.ts`, `engine/css/index.ts` re-export a small fixed
  set that could be a direct import.
- The reject-the-folk-rule point from §0: the low-tier "100–200 LOC per file" advice
  (https://www.webdevtutor.net/blog/typescript-split-module-into-multiple-files) is
  NOT adopted — kf's `compile/easing-option.ts` at 56 lines shows LOC and carve-worth
  are orthogonal.

---

## 5. Inline documentation (OD-U15 support)

OD-U15 deletes all CLAUDE.md and rehomes content inline-or-README. The granularity
literature reinforces this: the type-only-import discipline (types in `types/index.ts`,
runtime elsewhere) and direct relative imports keep circulars out
(https://oneuptime.com/blog/post/2026-01-24-typescript-circular-reference-errors/view),
and colocated docstrings at the code they describe are the natural home once the
per-directory prose file dies — the doc travels with the module through any future
carve/inline, whereas a CLAUDE.md inventory rots the instant granularity changes. Detect
residual circulars after restructuring with `madge --circular --extensions ts src/`.

---

## Rules/verdicts for the spec

Each rule is stated as a directly-applicable granularity ruling with its evidence.

**R1 — Cohesion, not LOC, decides a carve.** A file carves into a module dir iff it
holds two+ genuinely distinct sub-concepts (each with its own testable identity), *at
any length*. Do NOT adopt a line-count trigger. Evidence: owner's named example
`compile/easing-option.ts` is 56 lines yet targeted for `compile/easing/`
(src/animation/compile/easing-option.ts:1, `wc -l`=56); SRP-as-LOC is rejected as over-
fragmentation (cohesion sources §4).

**R2 — No internal re-export barrels; direct relative imports inside the package.**
Every `index.ts` that exists only to `export *`/`export {}` from siblings is HMR/test/
resolve tax with no consumer benefit. Delete it and rewrite dependents to direct
`./file` imports. Evidence: Vite official ("avoid barrel files, import individual APIs
directly"); Atlassian −75% build minutes, +30% TS highlighting, ~50–10× test speedup;
tkdodo 11k→3.5k modules; Vitest 85% fewer transforms.

**R3 — Barrels are legitimate ONLY at (a) a published `exports` entry point and (b) the
value.js LIGHT/HEAVY boundary contract.** kf keeps exactly the barrels that back its two
declared entries (`src/animation/index.ts` = 310L LIGHT `.`; `public.ts` HEAVY
`./engine`) plus the minimal zone boundary that enforces the value.js-free split.
Everything else in the 21-barrel inventory must justify itself against this or be
inlined/deleted. Evidence: tkdodo ("barrels necessary [only] when writing a library");
thepassle multi-entry-with-internal-barrel idiom; kf CLAUDE.md two-entry contract.

**R4 — Inline the "absurdly small" barrels first.** The ≤15-line re-export barrels are
the OD-U16 inline slam-dunks: `orchestration/drag/index.ts` (13),
`svg/index.ts` (14), `constants/index.ts` (15), `engine/css/index.ts` (15) — replace
with direct imports unless one is a genuine published/boundary entry per R3. Evidence:
`find src/animation -name index.ts -exec wc -l` (§0); over-fragmentation/cohesion sources.

**R5 — Never let a barrel carry side effects or non-re-export statements.** Any real
statement in an `index.ts` defeats Next-class import optimization and Rolldown lazy-
barrel, and risks tree-shaking failure and self-referential circulars. A surviving
barrel (R3) must be pure re-exports, `types`-first if it splits types.
Evidence: tkdodo (side effect ⇒ "whole file non-optimizable"); Rolldown lazy-barrel
caveats; MUI wildcard 70% tax.

**R6 — Split types from runtime to kill circulars, and verify with madge.** Where a
surviving boundary barrel re-exports both, use `type/` (type-only, erased) vs runtime
files; type-only imports create no runtime edge. After every carve/inline pass, gate
with `madge --circular --extensions ts src/` = 0. Evidence: circular-dep sources §1/§5.
This also lets the depcruise known-violations suppression (OD-U17) retire honestly
rather than by ledger.

**R7 — Do NOT proliferate `exports` entry points; the two-entry map is SOTA.** Keep the
`.`/`./engine` contract; solve "two surfaces share a core" by the layer/leaf pattern
(kf's `internal/` leaf, Vue's `@vue/shared`, Zod's `zod/v4/core`), not by new public
subpaths or by cross-importing internals. Validate the published shape with
`@arethetypeswrong/cli` and keep `types` first in each condition. Evidence: Zod v4 core
sub-package; Vue `@vue/shared`; exports-map correctness sources §2.

**R8 — Draw carve boundaries at architectural seams, keep leaf files small + cohesive.**
When a file DOES carve (R1), the resulting dir mirrors the reference-lib pattern:
capability/layer seams (Vue reactivity/runtime/compiler; the named `easing-option.ts` →
`easing/` by sub-concept), leaf files small and single-purpose, wired by direct imports.
The dir is a *conceptual* unit, not a bag; if it needs a barrel it is a boundary per R3.
Evidence: Vue/Vite/Zod structures §3.

**R9 — Rehome per-directory prose into colocated docstrings, not a new doc file.**
Supports OD-U15: docstrings travel with the module across future carve/inline moves; a
directory-inventory file rots on the first granularity change. Evidence: §5.

**R10 — Rolldown/Vite 8 does not license internal barrels.** Even under lazy-barrel
optimization the resolve step, side-effect disablement, star-import fallback, and
circular hazards remain; a green Vite 8 build is not evidence a barrel is free. Hold R2
regardless of bundler. Evidence: Rolldown lazy-barrel caveats page §1.

---

### Sources
- https://vite.dev/guide/performance
- https://rolldown.rs/in-depth/lazy-barrel-optimization
- https://voidzero.dev/posts/announcing-rolldown-1-0
- https://www.atlassian.com/blog/atlassian-engineering/faster-builds-when-removing-barrel-files
- https://tkdodo.eu/blog/please-stop-using-barrel-files
- https://dev.to/thepassle/a-practical-guide-against-barrel-files-for-library-authors-118c
- https://dev.to/tassiofront/barrel-files-and-why-you-should-stop-using-them-now-bc4
- https://krishnavadlamudi44.medium.com/the-index-ts-dilemma-balancing-convenience-and-performance-in-typescript-projects-85e9dd4fc18f
- https://vitest.dev/guide/profiling-test-performance
- https://hirok.io/posts/package-json-exports
- https://dev.to/gabrielanhaia/the-packagejson-exports-map-is-the-most-important-file-youre-writing-wrong-5a0o
- https://nodejs.org/api/packages.html
- https://zod.dev/packages/core
- https://github.com/colinhacks/zod/issues/4371
- https://github.com/vuejs/core/tree/main/packages
- https://deepwiki.com/vuejs/core
- https://dev.to/alvesjessica/cohesion-in-software-design-559l
- https://en.wikibooks.org/wiki/Introduction_to_Software_Engineering/Architecture/Anti-Patterns
- https://oneuptime.com/blog/post/2026-01-24-typescript-circular-reference-errors/view
- https://codecompose.com/articles/why-i-prefer-barrel-files-in-2026/ (dissent, weighed)
