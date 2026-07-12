# SPEC-B1 — Track B convergence loop, pass 1: THE COGENT SPECIFICATION

> **Step 2 (synthesis) of the owner 5-step loop** (OWNER-ASKS row 6; OD-U15/U16/U17/U18).
> Synthesized from the eight pass-1 research reports
> (`pass1-research-{lib-module-census, demo-module-census, claudemd-inventory,
> suppression-census, web-ts-granularity, web-vue-component-granularity,
> constellation-granularity, tranche-rulings-ledger}.md`) and reconciled against the
> chartered waves `waves/U.B.md` + `waves/U.C.md`. **This spec AMENDS the charters where
> the research demands it and CONFIRMS them everywhere else — it contradicts nothing
> already ruled.** Plain language throughout (the owner's cogency ruling, OWNER-ASKS row 3).
>
> Sections: §1 the ratified granularity rules · §2 the library ruling table · §3 the demo
> ruling table · §4 the charter gaps, resolved · §5 the CLAUDE.md total-removal plan ·
> §6 the suppression-removal plan · §7 what this spec amends vs confirms · §8 the six
> prototype charters (step 3) · §9 questions for the critique fleet (step 4).

---

## §0 — What this spec is, in one paragraph

The owner ordered (row 6): every library and demo module gets an explicit granularity
ruling — break long files into module directories (his example: `compile/easing-option.ts`
→ `compile/easing/`), inline absurdly small modules, delete every CLAUDE.md with its
content re-homed inline or into the README, delete suppression files like
`.dependency-cruiser-known-violations.json` by fixing what they suppress, and iterate
this loop until 100% converged. The research found: the library's granularity debt is
almost entirely in the LONG direction (four flat directories to carve, a handful of
long files that shrink by de-duplication); the "absurdly small" direction has essentially
ZERO library targets and ~8–10 demo targets; the CLAUDE.md deletion costs five gate edits
and two README paragraphs; and the named suppression file is already EMPTY — deleting it
makes the lint STRICTER. This spec turns those findings into per-module rulings and six
prototype charters.

---

## §1 — The granularity rules (ratified from the web + constellation research, cited)

These ten rules govern every ruling in §2/§3 and every future pass. Each carries its
evidence. G = granularity rule.

**G1 — Cohesion decides a carve, never line count.** A file splits into a module
directory only when it holds two or more genuinely distinct concerns, each with its own
testable identity — at any length. The owner's own named example proves this:
`compile/easing-option.ts` is **56 lines** and still moves into `compile/easing/`,
because the target of his sentence was the long-FLAT `compile/` directory, not the file.
Never adopt a numeric line trigger; the low-tier "100–200 lines per file" folk rule is
rejected. (web-ts R1; the SRP-to-the-extreme "yo-yo" anti-pattern, dev.to/alvesjessica +
wikibooks anti-patterns; the demo census: no demo file exceeds the 500-line ceiling, so
demo carves are cohesion carves and CSS splits only.)

**G2 — The granularity unit is the cohesive DIRECTORY behind one barrel, not the file.**
All three constellation repos converge on this shape (glass-ui: 43+ kebab component dirs;
value.js: functional dirs + a 3-file `quantize/` kept AS a dir; keyframes.js: the 11
zones). Tiny files live freely INSIDE such a directory; tiny standalone orphans do not.
(constellation R1.)

**G3 — "Inline the absurdly small" targets ONLY orphan micro-modules:** a standalone
file with one consumer, no subpath/entry role, and no sibling family — pure indirection.
Never inline (a) a subpath or entry-point shim (glass-ui keeps 78 one-line shims;
value.js keeps an 8-line one — they are build-entry contracts), or (b) a tiny distinct
member of a barrel'd family (glass-ui keeps a 228-byte `DialogClose.vue`), or (c) a
deliberate carve-out from an over-ceiling parent (inlining it re-merges what a prior
ruling split — e.g. `engine/playback-state.ts`, the single-storage store), or (d) a
multi-consumer leaf (inlining duplicates it — e.g. `internal/scroll-phases.ts`, 16 lines
but shared by two zones). (constellation R2; lib census rules 3/5; web-vue §3.)

**G4 — Barrels earn their place at exactly three seams; everywhere else they are tax.**
(a) A published `exports` entry point (`index.ts`, `public.ts`). (b) A zone/sub-zone
boundary that a gate or the depcruise cross-zone rule enforces (the LIGHT/HEAVY contract
rides these). (c) A demo lazy-delivery contract (a barrel wiring
`defineAsyncComponent` + skeleton). Everything else — a zero-consumer umbrella, a
one-line barrel over a one-component module, a "barrel" carrying statement bodies — is
deleted or inlined. First-party evidence is unambiguous: Vite officially says avoid
barrel files; Atlassian measured −75% build minutes and up to 10× faster tests removing
internal barrels; Rolldown's lazy-barrel optimization does NOT redeem them (resolve cost,
side-effect disablement, and circular hazards persist). A surviving barrel must be pure
re-exports — one real statement in it defeats every bundler optimization.
(web-ts R2/R3/R4/R5/R10, citing vite.dev/guide/performance, the Atlassian engineering
post, tkdodo, rolldown.rs lazy-barrel; constellation R1.)

**G5 — Do not add package entry points; two is the ratified shape.** `.` (LIGHT) +
`./engine` (HEAVY) match the SOTA multiple-named-entries idiom (Node `exports`
encapsulation; Zod v4's `zod/v4/core`; Vue's `@vue/shared` leaf). Shared cores are
solved by the leaf-tier pattern (`internal/`), never by new public subpaths.
(web-ts R7; ratified-terminal T-9.)

**G6 — A Vue sub-component earns its own file only with a paying contract:** reuse, OR
an exclusive prop cluster (Thiessen's Hidden Components), OR being one of ≥3 independent
sections in an orchestration-bearing file. A single-use region sharing the parent's
state stays inline — a child file there only manufactures prop-drilling. No SFC
line-count law exists or is adopted; `proof:demo-no-oversize` retires (it manufactured
the orphan composables drawer). (web-vue rules 1/2; demo census rule 1; U.B2's retire,
confirmed.)

**G7 — A composable file earns itself with ≥2 real consumers or an isolation-test
need.** Below that, it is an inline named function in `<script setup>` (RFC-sanctioned).
Single-consumer state is a plain `ref` — no abstraction. This IS the demo's "absurdly
small module" test. (web-vue rule 3, citing alexop + vueschool; demo census rule 6:
shared-tier seat = ≥2 consumers.)

**G8 — Async seams sit at the expensive-panel-within-a-route boundary,** never around
light components and never at the router seam (dynamic `import()` belongs there). Monaco
and the keyframes editor are the canonical async payload: they load only when their
facet is SHOWN (OD-U12 verbatim). (web-vue rule 4; U.B11 confirmed.)

**G9 — A `.ts` whose entire body is one string constant or one type inlines into its
owner;** a `*Types.ts` folds into the module's `constants.ts` (types-through-the-barrel,
the glass-ui idiom); an `InjectionKey`-bearing keys file KEEPS (the context type needs a
file) but declares its context interface rather than deriving it via `ReturnType`.
(demo census rule 5.)

**G10 — Every carve is a pure, module-load-safe move.** Imports introduced by a carve
resolve at module load, never per frame; LIGHT carves stay value.js-free; HEAVY carves
stay behind `loadAnimationEngine()`; every path-literal gate re-anchors in the SAME
commit as the move, co-scheduled with U.A's one gate pass. After any carve/inline pass,
circulars are verified at zero (`madge --circular` or the live depcruise no-cycle rule).
(lib census rule 8; rulings-ledger rule 5; web-ts R6; ring-fences T-3/T-4.)

**The both-bounds verdict, stated honestly (OD-U16):** both directions were assayed over
every module. The LONG direction carries nearly all the work — four library directory
carves + the U.C dedup shrinks, and the demo's depth/flatness recut. The SMALL direction
has ONE library kill (`constants/index.ts`, a migrated-off back-compat shim) and ~8–10
demo inlines. That asymmetry is a finding, not an omission — the library's 49–67-line
band is deliberate decomposition and shared leaves, which G3 protects.

---

## §2 — The library ruling table (every module under `src/animation/`)

Verdicts: **CARVE-DIR** (relocate into a new sub-module dir) · **CARVE-FILE** (split a
real concern out of one file) · **KEEP** · **INLINE** (fold into named target, delete) ·
**DELETE** · **MOVE** (cross-zone relocation) · **SHRINK** (the file thins via a U.C
dedup wave, no cosmetic split). Ratified-terminal structures (the 11-zone map, the
LIGHT/HEAVY boundary, `internal/`, `constants/{types,defaults}.ts`, the two entries, the
test mirror) are FIXED and not re-scored (rulings-ledger §1).

### Root tier (terminal keep as the entry seam — lane 32 F2; no `boundary/` dir)

| file | ruling | note |
|---|---|---|
| `index.ts` (310) | **SHRINK** (U.C13) | the ~150-line hand type re-list deletes; LIGHT surface + one `export type * from "./public"` remain |
| `load-engine.ts` (391) | **SHRINK to near-nothing** (U.C13) | `loadAnimationEngine = () => import("./public")`; the Promise.all roster deletes |
| `public.ts` (169) | **KEEP** | becomes the ONE dynamic-import target |
| `easing.ts` (97) | **KEEP** | root cross-zone facade |
| `validate.ts` (242) | **KEEP** | forward projection facade |

### `constants/`

| file | ruling |
|---|---|
| `types.ts` (322) · `defaults.ts` (80) | **KEEP** (terminal, T-6) |
| `index.ts` (15) | **DELETE** — the library's one genuine small-module kill; a migrated-off back-compat barrel; remaining importers retarget `./types`/`./defaults` directly (amendment A-3) |

### `physics/` + `physics/spring/` (LIGHT — hard boundary)

| file | ruling |
|---|---|
| `numeric.ts` · `smooth.ts` · `oscillator.ts` · `decay.ts` · `morph.ts` · `playback.ts` · `index.ts` | **KEEP** (`smooth.ts` gains the `ManagedStepper` delegation, U.C5; `numeric.ts` gets the per-instance `_out`, U.C6) |
| `spring/progress.ts` (492) | **KEEP** — cohesive hot-path class; do not carve the class body (G1) |
| `spring/managed-play.ts` · `spring/types.ts` · `spring/index.ts` | **KEEP** (managed-play is a deliberate carve-out — G3c protects it) |
| `spring/vector.ts` (154) | **DELETE by unification** — the byte-copied ODE dies in U.C4's modal kernel; ORDER: C4 before C7 |
| `spring/solver.ts` · `sample.ts` · `duration.ts` · `reseat.ts` | **CARVE-DIR → `spring/solver/`** (U.C7) |
| `spring/linear-stops.ts` · `timing-function.ts` | **CARVE-DIR → `spring/css/`** (U.C7; mirrors `engine/css/`) |

### `orchestration/` (LIGHT)

| file | ruling |
|---|---|
| `stagger.ts` · `flip.ts` · `index.ts` · `drag/drag-2d.ts` · `drag/index.ts` | **KEEP** |
| `drag/draggable.ts` (471) | **KEEP** — RULED here (the census left it "borderline"): one gesture machine (pointer-capture + fling + bounds is a single testable identity); a split would manufacture an interface with no reuse payoff (G1/G6-analog). Re-scorable by the critique fleet with a concrete seam proposal only. |
| `sequence/sequence.ts` (402) | **SHRINK** — the FSM dedup into the U.C1 Transport core is the real pressure; no cosmetic split |
| `sequence/{events,lifecycle,transport,index}.ts` | **KEEP** (lifecycle/transport fold into the Transport core, U.C1) |
| `split-text/*` · `timeline/*` · `view-transition/*` | **KEEP** all |

### `engine/` (HEAVY)

| file | ruling |
|---|---|
| `animation.ts` (483) | **KEEP** — residual class post-S.B carves; its play FSM dedups into U.C1 |
| `play-lifecycle.ts` (489) | **SHRINK** — one of the three copied FSMs U.C1 dissolves; the shrink IS the carve |
| `interpolate.ts` · `playback-state.ts` · `option-setters.ts` · `options.ts` · `compile-bridge.ts` · `composition.ts` · `index.ts` · `css/*` | **KEEP** all (`playback-state.ts` at 55 lines is G3c-protected — the single-storage store; do NOT inline) |

### `group/` (HEAVY — redesigned, not merely relocated: OD-U14, U.C14→C3→C15→C16)

| file | ruling |
|---|---|
| `group.ts` (440) | **KEEP (redesign)** — thins as draw-scratch fields move into the owned `CompositeState` |
| `lifecycle.ts` | **SHRINK** — FSM dedup (U.C1) |
| `entries.ts` · `types.ts` · `index.ts` | **KEEP** |
| `soa.ts` · `compositor.ts` · `springs.ts` · `layer-api.ts` · `yield-batch.ts` | **CARVE-DIR → `group/blend/`** — RULED MANDATORY here (was "optional, density-gated"; A-4 supersedes the optionality). Lands WITH the U.C3 redesign (`draw.ts` renderer + `CompositeState` join the family); `yield-batch.ts` rides into `blend/` with its family rather than sitting as a root orphan. |
| (incoming) `compile/plain-vars.ts` | **MOVE → the group renderer seam** (U.C3 — it is an output adapter misfiled in the input zone) |

### `compile/` (HEAVY — the owner's named example directory)

| file | ruling |
|---|---|
| `parse-flatten.ts` · `selector.ts` · `adapter.ts` · `numeric-plan.ts` · `index.ts` | **KEEP** at root (the FORWARD pipeline; `numeric-plan.ts` at 59 lines is G3c-protected) |
| `frame-compiler.ts` (458) | **CARVE-FILE** — extract `compile/reconcile.ts` (the buildVarIndex/reconcileVars graph, U.C9); the class keeps template-in→frames-out |
| `easing-registry.ts` · **`easing-option.ts`** | **CARVE-DIR → `compile/easing/`** — **the owner's literal example, resolved concretely: `easing-option.ts` (56 lines, 3 consumers) RELOCATES WHOLE into `compile/easing/` beside `easing-registry.ts`. It is not carved open (nothing to split) and not inlined (three consumers). The owner's sentence named the long-flat `compile/` directory; the `easing/` cluster is the cure.** (U.C8; the `getTimingFunction` re-authoring is additionally a U.F letter row to value.js.) |
| `entry.ts` (434) · `view-transition.ts` (393) | **CARVE-DIR → `compile/emit/`** + de-accrete via shared refusal-probes (U.C8/C9) |
| `backward/backward.ts` (475) | **CARVE-FILE + rename** — refusal blocks → `emit/refusal-probes.ts`; `backward/` renames `emit/` (a18 invariant re-anchors as FORWARD↔`emit/`, amendment A-2) |
| `backward/{backward-walk,backward-color,format,format-options,easing-serialize,densify,index}.ts` | **KEEP → `emit/`** (backward-color thins via the probe extraction) |
| `plain-vars.ts` | **MOVE → `group/`** (see group table) |

### `resolve/` (HEAVY)

| file | ruling |
|---|---|
| `core.ts` · `index.ts` | **KEEP** at root (the dispatch seam) |
| `spring-css.ts` · `resolve-if.ts` · `resolve-function.ts` · `element-resolve.ts` · `env.ts` | **CARVE-DIR → `resolve/resolvers/`** — RULED MANDATORY here (was lane-16 F7 "optional if density N≤5"; A-4 makes the ruling explicit): five per-kind rewriters under one dispatcher is a clean cluster, and the carve is a pure module-load-safe move. |

### `ingest/` · `scroll/` · `waapi/` · `svg/` · `presets/` (HEAVY)

| file | ruling |
|---|---|
| `ingest/cssom.ts` (466) | **KEEP** — RULED here (census said "watch"): one cohesive walk concern; its real defect (the hand-rolled regex sibling-link) cures in U.C2, not by a split (G1). |
| `ingest/adopt.ts` · `index.ts` | **KEEP** (gains `seekAndPlay` consumption, U.C2) |
| `scroll/*` (6 files) | **KEEP** all (`driveScrollCSS` + dispatch de-dup land in U.C11 without moves) |
| `waapi/*` (6 files) | **KEEP** all — `emission.ts` (66, one consumer) RULED KEEP: a named pipeline stage, not an orphan (G3b) |
| `svg/*` (6 files) | **KEEP** all (`handle.ts` 53 lines, 3 consumers — shared base, protected) |
| `presets/*` (5 files) | **KEEP** files; the 34×4 hand-lists collapse to ONE `PRESET_SPECS` table INSIDE them (U.C12/OD-U6 — a de-dup, not a carve) |

### `internal/` (the value.js-free leaf tier — terminal, T-5)

All seven leaves **KEEP** (every one multi-zone; inlining duplicates). This includes
`scroll-phases.ts` (16 lines) — the tree's only literally-tiny file, protected by G3d.

### Documentation in-tree

| file | ruling |
|---|---|
| `src/animation/CLAUDE.md` (395) | **DELETE** after re-home (§5) |
| `src/env.d.ts` | **MOVE → `demo/env.d.ts`** (U.C13 item 5 — demo-only ambient) |

---

## §3 — The demo ruling table (every module under `demo/`)

The demo's defect is DEPTH + FLATNESS, not file length (no file over the 500-line
ceiling; deepest path 8 levels; an 18-file flat barrel-less drawer). Rulings confirm the
U.B waves and add the loop's own inline list. Root structure first:

| item | ruling |
|---|---|
| `demo/@/` | **DISSOLVE** → hoist five children to `demo/{components,composables,state,styles,utils}/`; alias SPELLINGS unchanged, declared in all three planes; zero import edits (U.B1/OD-U2 — awaiting the owner's one-word confirm) |
| `demo/@/components/custom/` | **DISSOLVE** → `components/instrument/`, `components/CopyButton.vue` (U.B1) |
| `demo/CLAUDE.md` | **DELETE** after re-home (§5) |
| `demo/DESIGN.md` | **KEEP** — resolved in §4.3 |
| `demo/glass-ui-gaps.ts` | **MOVE** off the demo root into the shared tier (U.B9) |

**Component modules** (all recut to the glass-ui post-BH shape — kebab dir, PascalCase
SFC, re-export-only `index.ts`, `constants.ts`, per-component `composables/`): the U.B2–B13
verdicts are CONFIRMED wholesale — the transport drawer dissolution (15 single-owner
composables into their owners; 3 multi-consumer hoists), the `TransportDock` cohesion
carve, the editor unification on `useKeyframesEditor`, the shell purge (dead
`EditorHeader.vue` DELETE; hero trio → `app/`), the `controlSurfaceDFA` split, the
SceneFacility subsumption, the scenes convergence (`useManagedLoop`/`useSweepScene`/
`usePainterRegistry`; the `num()`/`toRGB` dogfood deletions), the skeleton tier, the
facet async seams (the named `SpringPhysicsFacet.vue:133` eager-Monaco violation), and
the amiga suspend cure. One AMENDMENT rides U.B2: the `AnimationControls` /
`AnimationControlsControls` / `AnimationControlsGroup` stutter-trio is a split made on
volume, not responsibility (web-vue §grounding) — the recut must RE-DRAW that boundary
(merge-or-recarve on a real prop-cluster/section seam), not merely rename
`AnimationControlsControls`. The demo-component-recut prototype (§8.5) proves the shape.

**The demo INLINE list (OD-U16 lower bound — the real small-module targets):**

| module | ruling |
|---|---|
| `scenes/cube/matrix-editor/index.ts` (1 line) | **INLINE** — import `MatrixEditor.vue` directly; a 1-line barrel over a 1-component module is ceremony (G4) |
| `scenes/{cube,square,amiga}Keys.ts` (5–7 lines, bare id string, no InjectionKey) | **INLINE** into their `useXDemo` owners (G9) |
| `scenes/{spring,easing,sequence}Keys.ts` (InjectionKey-bearing) | **KEEP**, converting the `ReturnType`-derived context to a DECLARED interface (G9) |
| `app/runtime/rafConstants.ts` (15) | **INLINE** into the scene-runtime module (rides U.B3/B8) |
| `orbital-drag/types.ts` (15) | **INLINE** → the module's `constants.ts` |
| `keyframes/utils/contenteditable.ts` (23) | **INLINE** into its sole consumer (resolve importer count at recut) |
| `timeline/timelineTypes.ts` (36) | **INLINE** → module `constants.ts` |
| `keyframes/utils/flattenVars.ts` (33) | **INLINE** into `timelineEngine.ts` if single-owner at recut; else KEEP |
| `transportSource.ts` (33) | **KEEP** (borderline — holds the `TransportChannel` type contract) |
| `instrument/index.ts` (27, `export *`, zero consumers) | **DELETE** (U.B11 — an unconsumed umbrella IS legacy) |
| lazy barrels `keyframes/`·`transport/`·`timeline/`·`shell/index.ts` | **KEEP** — real `defineAsyncComponent` contracts (G4c) |
| `@/utils/clipboard.ts` (8, 5 importers) | **KEEP** — five consumers earn the shared seat (G7); reconciles the U.B9 "leave with CopyButton" note in favor of the consumer count |

**Shared-tier verdicts** (`useDragScrub` 6 imp, `useDoubleTap` 3, `useThrottledReadout` 2,
`kfEngine` 16 → hoist per U.B9; `gestureSelectSuppression` keeps with its recorded
global-singleton justification; single-owner satellites move into their owners): CONFIRMED.

---

## §4 — The charter gaps, resolved (surfaced by the demo census §6)

1. **`app/dock/` (`ChromeDock.vue` 386, `MbabbMenu.vue` 245)** — never named in U.B.md.
   RULING: **KEEP the module; recut to the glass-ui component-dir shape in U.B's pass**
   (kebab dir + `composables/` tier if a real dock-layout/dock-state concern separates —
   G1 decides at recut, no line-count carve). Homogeneity check against glass-ui's own
   `dock/` idiom is part of the recut; any dock BEHAVIOR change still belongs in
   glass-ui root (standing memory rule). Added to the demo-component-recut prototype.
2. **`orbital-drag/index.ts` (116 lines of interface + default-object bodies)** —
   RULING: **barrel-purity fix** — the bodies move to `constants.ts`; the barrel becomes
   re-export-only (G4/G5-hygiene; the same law U.B11 asserts instrument-side now applies
   scene-side). `OrbitalDrag.vue` (352) itself: KEEP — the module is already §9-shaped.
3. **`demo/DESIGN.md`** — RULING: **KEEP.** OD-U15's blast radius is CLAUDE.md, stated
   twice ("names only CLAUDE.md"). DESIGN.md is the demo's design authority, one of the
   two narration surfaces `proof:no-dead-dependency` keeps. It is swept to disk-truth
   (stale entries corrected) in the same U.B12 residual pass, and it absorbs the ~10-line
   demo orientation tree when `demo/CLAUDE.md` deletes (§5). Flagged for the owner only
   if he intends "documentation" broader than CLAUDE.md.
4. **The scene-keys split ruling** — resolved in §3's inline list (pure-id keys inline;
   InjectionKey files keep with declared context types).

---

## §5 — The CLAUDE.md total-removal plan (OD-U15)

**Protocol (adopted from glass-ui B4f — the constellation converges at the PROTOCOL
layer, not the destination):** (1) REDISTRIBUTE the load-bearing content first;
(2) RE-HOME every gate that reads a CLAUDE.md; (3) DELETE the three files as the
absolute-last act, in the same commit as the README edits. keyframes.js's destination is
the lean owner-stated one — **inline docstrings + a README `## Structure` section** —
because its corpus is 639 lines across 3 files, not glass-ui's 323KB (no `docs/canon/`
resolver tree is imported; that machinery is proportionate to glass-ui's scale). Note:
keyframes.js executes FIRST in the constellation (glass-ui B4f is planned-not-executed;
value.js has not started) — the protocol proven here becomes the sibling template. The
glass-ui born-RED `proof:claude-deletable` gate is NOT imported (the anti-sprawl covenant
forbids new standalone gates); ordering is held by wave sequencing, and the existing
`proof:readme-paths-live` already fires on any dead link left behind.

**Per-claim re-home map (the full inventory is `pass1-research-claudemd-inventory.md`
Part B; the load-bearing summary):**

| content | destination |
|---|---|
| The two package "in"s + LIGHT/HEAVY boundary prose | `index.ts` / `load-engine.ts` / `public.ts` module docstrings; README §dynamic-engine + §tree-shaking tightened |
| The per-file zone inventory (the 395-line file's bulk) | **each zone's `index.ts` barrel docstring** (~11 barrels; `internal/` gets a header note in `leaves.ts`) — the doc travels with the module through future carves, where a directory-inventory file rots on the first change (web-ts R9) |
| Per-class prose (KeyframesAnimation, AnimationGroup, primitives, SVG factories…) | per-class docstrings at each class file (mostly already present; fold the missing detail) |
| **The managed-child lifecycle contract** (the ONE gate-parsed block) | **promoted to the authoritative statement in `group.ts` (~:332–337)**; `proof:engine`'s managed-pause-doc clause re-points to grep the group source |
| The `bumpLayoutEpoch` computed-unit contract | `constants/defaults.ts`/`interpolate.ts` docstring AND a README §Units paragraph (it is a public consumer obligation) |
| WAAPI eligibility / playback modes / architecture notes | docstrings at `waapi/eligibility.ts`, `physics/playback.ts`, `compile/frame-compiler.ts`, `group/` (README already carries the consumer cut) |
| Build table, tsconfig/prettier conventions, dependency tables | **DELETE** — package.json/tsconfig/.prettierrc ARE the authority (stale-by-construction prose) |
| demo/CLAUDE.md structure tree | a ~10-line orientation tree into `demo/DESIGN.md`; the `@→shared` S.D4 ruling section DELETES un-re-homed (REVERSED by OD-U2); scene table → `app/scene/scenes.ts` docstring; markRaw/Euler/suppression idioms → docstrings at their owning composables |

**Gate deaths and edits (all in the ordered removal wave):**

1. **DELETE `scripts/proof-claude-paths-live.mjs` entirely** (761 lines wholly dedicated)
   + its package.json script line + its `proof:hygiene-chain` reference. Zero invariant
   loss: its one real clause (HEAVY list ⊆ AnimationEngine keys) is already held by
   `proof:engine-subpath-mirror` + `proof:published-surface` — and that whole belt then
   dissolves further under U.C13's surface collapse (the fold-map satisfies OD-U1).
2. **`proof:engine` managed-pause-doc → re-point to `group.ts`** (source IS the authority).
3. **`proof:published-surface` clause (e) → split:** keep the disk-truth halves as pure
   filesystem checks; delete the CLAUDE reads and doc-assertion halves (frozen test
   counts die with the doc).
4. **`proof:drag2d-light-certified` clause (a)** → drop its two CLAUDE reads
   (`published-surface` (i) already certifies `drag2D` ∈ LIGHT).
5. **`proof:no-dead-dependency`** → remove the 3 CLAUDE.md entries from
   NARRATION_SURFACES (README + DESIGN.md remain).
6. **Scrub the five comment-only mentions** (`proof-no-flat-siblings`, `demo-roster`,
   `proof-board-live`, `proof-ci-coverage`, `proof-dogfood-hero`) — cosmetic.
7. **README, SAME commit:** drop the dead `](src/animation/CLAUDE.md)` link at `:54`
   (else `proof:readme-paths-live` fires) + the `:46–47` fence pointers.

**The README redesign shape (brief + deft — it is NOT a rewrite).** The current 829-line
README is ~90% of target (hero, runnable Quick Start, install, full API reference,
contributing). It gains: (a) a **`## Structure` section** — the 11-zone map, deftly, the
value.js precedent (its README embeds a commented `src/` tree; glass-ui generates the
same doc — homogeneous in intent); (b) the `bumpLayoutEpoch` contract paragraph under
§Units; (c) one managed-child-group line under §AnimationGroup; (d) the boundary prose
absorbed into the existing §dynamic-engine/§tree-shaking sections. Net growth ≈2 small
paragraphs + one tree. The 396-line per-file inventory does NOT move to the README — it
becomes barrel/class docstrings (inline is the primary home).

---

## §6 — The suppression-removal plan (OD-U17)

**The headline:** the owner-named target `.dependency-cruiser-known-violations.json` is
already **empty** (`[]`, 3 bytes — R.W2c drove it 26→0). It suppresses nothing; deleting
it makes the lint STRICTER (an absent baseline ignores nothing — any new cycle reds).
This is a vestige removal with zero functionality loss, exactly the honest cure.

**Deliverable 1 — the known-violations kill (die-by-fixing, fully specified):**
delete the file; `lint` drops `--ignore-known` (`package.json:237`); drop the flag +
"baseline ratchets N" clauses from `proof-lint-clean.mjs` and `proof-no-silent-fallback.mjs`
(the planted-cycle self-check still works unchanged); retire `proof-no-flat-siblings`'s
vestigial `count < 15` clause; strike the now-false "recorded in the BASELINE" sentence
in `.dependency-cruiser.cjs:124-125`; update the two precedent citations
(`proof-any-ceiling.mjs:35`, `proof-no-dead-export.mjs:34`); fix the CI step label. All
eight references un-wire in one commit.

**Deliverable 2 — the vestige sweep:** delete the 5 dead `eslint-disable` directives
(eslint is not installed; they suppress nothing); delete
`scripts/baselines/visual-lock/_diff/` (44 diff PNGs of a gate retired at T.M3, including
pruned scenes).

**Deliverable 3 — the `any` ceiling (CEILING=99) dies by the sweep, not by re-baselining.**
It is suppression-by-ratchet. The convergence loop's per-module assay types the seams to
0 (U.B4/U.B6 already charter the editor/store boundaries), then the gate deletes.
Irreducible cross-realm seams convert to co-located, self-verifying justifications —
never a global counter. Do not merely lower the number.

**Deliverable 4 — the one deferral-guard folds:** `it.skipIf(!vjL2LinearLanded)`
(`test/compile/roundtrip-easing.test.ts:164,170`) resolves against the U consume edge
(un-skip if VJ-L2 landed; else an explicit deadlined covenant row in U.F's letter — no
silent conditional skip survives). The `skipIf(!chromium)` capability guards KEEP —
honest environment checks, not suppressions.

**Explicit KEEPs (the honest forms the edict wants):** the 16 test-only
`@ts-expect-error` (self-verifying — tsc reds the moment the suppressed error clears);
`skipLibCheck` (universal hygiene for unowned declarations); the depcruise
`LIGHT_BARREL_MODULES`/math-subpath carve-outs (the boundary's DEFINITION, backstopped by
the runtime `proof:boundary` oracle — whether the depcruise TIER survives is OD-U1's
call, not a suppression verdict); perf baselines under gates that survive the trim.

**The per-gate JUSTIFIED/allowlist maps:** rationaled and self-reddening — not hidden
debt. Disposition: most die WITH their gate under OD-U1's dissolution; the
`proof:zone-cohesion` JUSTIFIED entries are re-adjudicated BY §2's table — the entries
the U.C7/U.C8 carves make structural RETIRE BY CARVE (never by declaration); the five
hot-path/data keeps (`progress.ts`, `frame-compiler.ts` post-carve, `play-lifecycle.ts`
post-shrink, `classic-data.ts`, `animation.ts`) keep their rationale as inline docstrings
per OD-U15.

**The standing rule (ratified):** a suppression surface must be either self-verifying
(reds when the suppressed condition clears) or die with the concern it served. No static
ledger of grandfathered violations survives U. (Named-but-absent surfaces — cspell,
api-extractor.json — verified nonexistent; recorded so no future lane hunts phantoms.)

---

## §7 — What this spec AMENDS vs CONFIRMS (the reconciliation record)

**Confirms (no change):** the entire U.C wave set (C1–C16) including the compositor
re-charter sequence; the entire U.B wave set (B1–B13) including the keystone dissolution
and facet seams; every ratified-terminal row (T-1..T-10); OD-U8's additive-only 5.3.0
bind on all of it; the anti-sprawl covenant (zero new standalone gates — every new
assertion is a clause on an existing gate, born-RED first).

**Amends (each with its authority):**
1. `group/blend/` and `resolve/resolvers/`: **optional → RULED CARVE** (A-4 — OD-U16
   makes per-module rulings mandatory; the density heuristic is superseded). §2.
2. The U.B2 transport recut gains the **stutter-trio re-carve** requirement (the split
   boundary is re-drawn on responsibility, not renamed) — web-vue evidence. §3.
3. Four demo charter gaps get first rulings (dock, orbital-drag barrel purity, DESIGN.md,
   scene keys). §4.
4. `drag/draggable.ts`, `ingest/cssom.ts`, `waapi/emission.ts`: census "watch/borderline"
   → **explicit KEEP** rulings with G1/G3 rationale (no deferred "watch" survives a
   converged table). §2.
5. The CLAUDE.md deletion acquires the glass-ui B4f ORDERING protocol (redistribute →
   re-home readers → delete last) with the lean inline+README destination — reconciling
   OD-U15's wording with the constellation reality (protocol convergence, not
   destination identity). §5.
6. The OD-U16 "both directions" mandate is discharged with an explicit
   near-vacuous-in-the-library finding for the small bound (one delete + the demo list),
   so no pass re-litigates it hunting phantom inlines. §1.

---

## §8 — The six prototype charters (step 3 of the loop)

Common law binding all six (OD-U18): each prototype runs **worktree-isolated**; its
branch is **EVIDENCE, never merged** (the S scene-stage discipline); ring-fences hold
(LIGHT/HEAVY hard; the 11-zone map fixed; the two entries fixed; tests stay in
`test/<area>` mirror); every surface touch is additive-only under the 5.3.0 bind; ZERO
new standalone gates (clauses on existing gates only, authored born-RED on today's tree
first); every path-literal gate re-anchors in the same motion as any move. Each
prototype returns: the diff (or spec-with-prototype), a plain-language report, what
broke and how it was cured, and a self-assessed convergence % with the evidence for it
— the critique fleet (step 4) hardens and re-scores.

### P1 — `compile-easing-carve`
**Goal.** Execute the owner's named example end-to-end as a CONCRETE implementation:
`compile/easing/` ({easing-registry, easing-option, index}) + the `backward/`→`emit/`
rename with `entry.ts` + `view-transition.ts` moved in (the U.C8 shape, §2 table).
**Prove:** pure move (compile round-trip goldens byte-identical); `proof:boundary` green
(HEAVY preserved); the a18 zero-edge invariant re-anchored FORWARD↔`emit/`; the complete
list of path-literal gate re-anchors it forced (this list is the reusable template for
every later carve); `proof:zone-cohesion` JUSTIFIED entries retired BY the carve.
**Out of scope:** the U.C9 de-accretion interiors (refusal-probes) — note seams found,
do not build them. **Report:** move manifest, gate-re-anchor manifest, test/HMR timing
delta (the G4 evidence check), convergence %.

### P2 — `small-module-inline-sweep`
**Goal.** Execute the ENTIRE ratified inline list: library `constants/index.ts` dissolve
(importers retarget `./types`/`./defaults`) + the §3 demo list (matrix-editor barrel,
the three pure-id sceneKeys, rafConstants, orbital-drag/types→constants.ts,
contenteditable, timelineTypes, flattenVars-if-single-owner) + the `instrument/index.ts`
umbrella DELETE. **Prove:** zero behavior change (vitest green through every fold);
importer counts verified at fold time (a file found multi-consumer at execution is
KEPT and reported, not forced); the G3/G9 rules hold as written or return with the
counter-example. **Report:** per-file fold map (target, importer count, verdict),
files-erased count, any rule refinement needed, convergence %.

### P3 — `claudemd-fold`
**Goal.** Execute the §5 protocol in full order: (1) redistribute — the ~11 zone-barrel
docstrings, the per-class docstring folds, the `group.ts` managed-child contract
promotion, the README edits (§Structure tree, bumpLayoutEpoch, the dead-link removal);
(2) re-home the five reader gates (delete claude-paths-live whole; re-point
proof:engine; split published-surface (e); drop drag2d (a) reads; trim
no-dead-dependency) + scrub the five comment mentions; (3) delete the three CLAUDE.md
files LAST. **Prove:** the full proof roster green after deletion; the fold-map showing
every load-bearing claim's new home (OD-U1's zero-loss clause); `proof:readme-paths-live`
green. **Report:** the redistribute manifest, the gate-death diff, README before/after
excerpt, convergence %.

### P4 — `known-violations-fix`
**Goal.** Execute §6 deliverables 1, 2, and 4: delete the empty baseline + un-wire all
eight references (+ drop `--ignore-known` everywhere); delete the five dead
eslint-disable directives + the visual-lock `_diff/` vestige; resolve the
`vjL2LinearLanded` skip against the live value.js edge. Additionally CALIBRATE
deliverable 3: type one representative slice of the 99 `any` seams (the editor-boundary
slice U.B4 names) and report the per-seam cost so the sweep-to-zero can be scheduled
honestly. **Prove:** `lint` strictly stronger (the planted-cycle self-check still reds);
full gate roster green; the ceiling lowered by the calibration slice with the ratchet's
equality rule satisfied. **Report:** un-wire diff, any-sweep cost-per-seam estimate,
convergence %.

### P5 — `demo-component-recut`
**Goal.** Prototype the glass-ui post-BH component shape on ONE representative slice so
U.B's full drive lands on a proven pattern: recut the transport `AnimationControls*`
stutter-trio with the boundary RE-DRAWN on responsibility (merge-or-recarve per §3's
amendment — Hidden-Components analysis first, then the cut), inside the target module
skeleton (kebab dir, re-export-only barrel, `constants.ts`, per-component
`composables/`); plus the three §4 gap items (the `app/dock/` cohesion assay with a
KEEP-or-carve verdict, the `orbital-drag/index.ts` barrel-purity fix, one InjectionKey
scene-keys conversion to a declared context interface). Runs on the PRE-dissolution tree
(U.B1 has not executed) — paths as-is, shape per the skeleton. **Prove:** transport
vitest green through the recut; the trio's new boundary justified in one paragraph
against G6 (prop clusters named); no prop-drilling manufactured. **Report:** before/after
tree, the boundary analysis, dock verdict with rationale, convergence %.

### P6 — `readme-redesign`
**Goal.** Produce the complete post-deletion README as a concrete artifact (the §5
target shape): the `## Structure` zone tree (value.js-style, per-dir one-liners,
sibling-homogeneous), the boundary prose absorbed into §dynamic-engine/§tree-shaking
(stated once, deftly), the `bumpLayoutEpoch` §Units paragraph, the managed-child
§AnimationGroup line, all CLAUDE.md pointers gone — while PRESERVING the runnable Quick
Start (`proof:readme-runs` green) and every live anchor (`proof:readme-paths-live`
green). Brief + deft is the acceptance bar: net growth ≤ ~40 lines; nothing moved into
the README that belongs in a docstring. **Prove:** both README gates green against the
prototype; a diff small enough to read in one sitting. **Report:** the README diff, a
line-count delta, what was deliberately left inline-only, convergence %.

---

## §9 — Questions the critique fleet must score (step 4)

1. **The zone-barrel tension (G4 vs the web verdict).** The 11 zone barrels + sub-zone
   barrels survive as boundary contracts (gates + the cross-zone depcruise rule ride
   them). P1's timing delta gives the first measured in-repo cost. If it is material,
   pass 2 weighs moving the cross-zone contract onto depcruise path rules and thinning
   internal barrels — a measured decision, not ideology in either direction.
2. **`drag/draggable.ts` KEEP** — overturnable only with a concrete two-identity seam
   proposal (G1), not a line count.
3. **The stutter-trio boundary** P5 draws — is it the right responsibility cut, or does
   the Hidden-Components analysis point at a different partition?
4. **`warmEngine`** — keep only against a proven demo consumer (U.C13/lane 15 F5);
   P3/P6 should note whether any doc still advertises it.
5. **The `any` sweep schedule** — P4's calibration decides whether sweep-to-zero fits
   U's impl drive or needs its own wave; report, don't assume.
6. **DESIGN.md's KEEP (§4.3)** — surface to the owner with the pass-1 results for a
   one-word confirm alongside the `@`-dissolution confirm OD-U2 awaits.
